#!/usr/bin/env python3
"""Manthan Ep3 KURMA - timeline + audio mix (single source of truth).

Same method as manthan_ep2_audio.py (Episode 2):
1. Lays Episode 3's trimmed takes end to end in script order (with the silent picture beats in
   ORDER), finds word-level cue points from the local Whisper transcripts, and writes
   src/Jyotiq/manthan/ep3/timing.ts so picture and sound share one clock.
2. Mixes dialogue, SFX and the series' synthesized bed into public/jyotiq/manthan/ep3/mix.wav.
   Episode 3 asks for dialogue clearly in front while the score stays present: the bed and SFX
   dip by DUCK_DB under every line (softer than Episode 2's -16 dB) plus a light sidechain, and
   the per-line dialogue-over-bed gap is printed so it can be held at about 10-14 dB.
   The master gets ONE static gain to -14 LUFS plus a peak limiter (no dynamic loudnorm).

ffmpeg only (no numpy on this Mac). Run with --timing-only to skip the mix.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path("/Users/ayushrajput/.kiro/crew/workspace/video")
EP3 = Path("/Users/ayushrajput/.kiro/crew/workspace/manthan-ep3")
VO_DIR = ROOT / "public/jyotiq/manthan/ep3/vo"
STT = EP3 / "audio/stt"
TS = ROOT / "src/Jyotiq/manthan/ep3/timing.ts"
MIX_DIR = ROOT / "public/jyotiq/manthan/ep3"
SFX1 = Path("/Users/ayushrajput/.kiro/crew/workspace/manthan-ep1/audio/sfx")
SFX2 = Path("/Users/ayushrajput/.kiro/crew/workspace/manthan-ep2/audio/sfx")
SFX3 = EP3 / "audio/sfx"
FPS = 30
DUCK_DB = -7.0  # fixed dip of bed + SFX under every line (Episode 2 used -16)
WAVES = 1.5  # weight of the ocean-wave wash inside the bed

# Script order. ("vo", key, gap_before) places a take; ("beat", key, gap_before, length)
# holds picture with no dialogue.
ORDER = [
    ("vo", "01_narrator", 6),         # hook: lit shell glow at frame 0, the line starts at once
    ("beat", "title", 6, 60),         # Jyotiq presents · मंथन · Episode 3 · कूर्म
    ("vo", "02_indra", 20),           # the mountain jolts to a stop in this gap, then "रुक गया!"
    ("vo", "03_narrator", 30),        # the shell's rumble swells up under Mandar before the narrator
    ("vo", "04_vishnu", 24),          # shell rises clear of the water, the ancient eye turns
    ("vo", "05_bali", 12),            # impact frame on Bali
    ("vo", "06_narrator", 10),        # churning resumes
    ("vo", "07_vasuki", 14),
    ("vo", "08_swarbhanu", 22),       # Vasuki's fire bursts in this gap
    ("vo", "09_narrator", 10),
    ("vo", "10_swarbhanu", 14),       # rain on the devta side settles
    ("vo", "11_bali", 10),
    ("beat", "boil", 6, 72),          # the ocean starts to boil (poison_boil swell peaks here)
    ("vo", "12_narrator", 0),
    ("vo", "13_indra", 36),           # the poison column roars up in this gap
    ("vo", "14_swarbhanu", 10),
    ("vo", "15_narrator", 12),
    ("beat", "freeze", 8, 14),        # cliffhanger freeze on Kailash
    ("beat", "endIn", 0, 12),         # end card settles before the spoken close
    ("vo", "16_narrator", 0),
    ("vo", "jyotiq_signoff", 10),
    ("beat", "hold", 0, 40),
]
SRC = {}
MISSES = []
LEVEL_FIX = {}  # dB applied to each take to reach its loudness target (printed after the mix)
POST_FIX = {}  # dB applied after each line's space/echo chain (second mix pass), so the measured
               # line loudness lands on its target: aecho's out_gain otherwise drops Indra/Bali ~10 dB


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def ms(f):
    return int(round(f * 1000 / FPS))


def vo_frames():
    t = (ROOT / "src/Jyotiq/manthan/ep3/voData.ts").read_text()
    data = json.loads(t.split("VoLine> = ", 1)[1].strip().rstrip(";"))
    return {k: v["frames"] for k, v in data.items()}


def layout(frames):
    lines, beats, t = {}, {}, 0
    for item in ORDER:
        kind, key, gap = item[0], item[1], item[2]
        t += gap
        if kind == "vo":
            n = frames[SRC.get(key, key)]
            lines[key] = (t, t + n)
        else:
            n = item[3]
            beats[key] = (t, t + n)
        t += n
    return lines, beats, t


def words(stem):
    """Whisper words for one take: [text, start_s, end_s] on the untrimmed file's clock."""
    data = json.loads((STT / f"{stem}.wav.json").read_text())
    out = []
    for seg in data["transcription"]:
        for tok in seg.get("tokens", []):
            text = tok.get("text", "")
            if not text or text.startswith("[_"):
                continue
            a, b = tok["offsets"]["from"] / 1000, tok["offsets"]["to"] / 1000
            if text.startswith(" ") or not out:
                out.append([text.strip(), a, b])
            else:
                out[-1][0] += text
                out[-1][2] = b
    return out


TRIM = json.loads((VO_DIR / "trim.json").read_text())


def to_trimmed(stem, t):
    """Map a time in the untrimmed take onto the trimmed WAV (start trim and shortened pauses)."""
    info = TRIM[stem]
    rel = t - info["a"]
    shift = sum(min(y, rel) - x for x, y in info["cuts"] if rel > x)
    return max(0.0, rel - shift)


def word_cue(lines, key, needle, nth=0, lead=0):
    """Absolute frame where `needle` starts in line `key` (nth match), `lead` frames early."""
    stem = SRC.get(key, key)
    hits = [w for w in words(stem) if needle in w[0]]
    if len(hits) <= nth:
        MISSES.append(f"{key}:{needle}")
        return lines[key][0]
    return lines[key][0] + int(round(to_trimmed(stem, hits[nth][1]) * FPS)) - lead


def build_timing(frames):
    L, B, total = layout(frames)

    def s(k):
        return L[k][0]

    def e(k):
        return L[k][1]

    cues = {
        # cold open: continuity from Episode 2's shell glow, the eye opens
        "depth": word_cue(L, "01_narrator", "सागर"),
        "eyeOpen": word_cue(L, "01_narrator", "आख"),
        "eyeFlash": e("01_narrator"),
        "titleHit": B["title"][0],
        # the mountain stops, Kurma is revealed
        "stopHit": s("02_indra") - 18,
        "riseRumble": e("02_indra") - 4,
        "rise": word_cue(L, "03_narrator", "नीचे"),
        "shell": word_cue(L, "03_narrator", "कवच"),
        "kurmaName": word_cue(L, "03_narrator", "कूर्म"),
        "hold": word_cue(L, "03_narrator", "थाम"),
        "kurmaEye": s("04_vishnu") - 10,
        "noSink": word_cue(L, "04_vishnu", "डूबेगा"),
        # Bali, the churn, Vasuki's fire
        "baliHit": s("05_bali") - 4,
        "pull": word_cue(L, "05_bali", "किंच"),
        "churn": word_cue(L, "06_narrator", "शुरू"),
        "vasukiLook": word_cue(L, "06_narrator", "वासुकी"),
        "breathGlow": word_cue(L, "06_narrator", "गर्म"),
        "vasukiSpeak": s("07_vasuki"),
        "fireWord": word_cue(L, "07_vasuki", "आग"),
        "fireBurst": e("07_vasuki") + 2,
        "cough": s("08_swarbhanu"),
        "smokeWord": word_cue(L, "08_swarbhanu", "धुआ"),
        # head side vs tail side
        "headSide": word_cue(L, "09_narrator", "फुंकार"),
        "tailSide": word_cue(L, "09_narrator", "पूंच"),
        "rain": word_cue(L, "09_narrator", "बादल"),
        "realise": s("10_swarbhanu"),
        "smileWord": word_cue(L, "10_swarbhanu", "मुस्कुराया"),
        "baliHold": s("11_bali"),
        "baliFire": word_cue(L, "11_bali", "आग"),
        "afterBali": e("11_bali"),
        # Halahala
        "boil": B["boil"][0],
        "tabhi": s("12_narrator"),
        "emerge": word_cue(L, "12_narrator", "निकला"),
        "roar": e("12_narrator") - 6,
        "column": e("12_narrator") + 4,
        "halahala": word_cue(L, "13_indra", "हला"),
        "fear": s("14_swarbhanu"),
        "devta": word_cue(L, "14_swarbhanu", "देवता"),
        "asura": word_cue(L, "14_swarbhanu", "असुर"),
        "drop": word_cue(L, "15_narrator", "बूंद"),
        "kailash": word_cue(L, "15_narrator", "उसे"),
        "kaun": word_cue(L, "15_narrator", "कौन"),
        "freeze": B["freeze"][0],
        # spoken Jyotiq close
        "endCard": B["endIn"][0],
        "shani": word_cue(L, "16_narrator", "शनी"),
        "bojh": word_cue(L, "16_narrator", "बोज"),
        "closeKundali": word_cue(L, "16_narrator", "कुंडली"),
        "closeHouse": word_cue(L, "16_narrator", "घर"),
        "signoff": s("jyotiq_signoff"),
        "offer": word_cue(L, "jyotiq_signoff", "पहला"),
        "brandChime": e("jyotiq_signoff") + 2,
        # caption split points (second half of a two-part caption starts here)
        "cap03b": word_cue(L, "03_narrator", "स्वयम"),
        "cap03c": word_cue(L, "03_narrator", "पूरा"),
        "cap04b": word_cue(L, "04_vishnu", "ये"),
        "cap06b": word_cue(L, "06_narrator", "पर"),
        "cap08b": word_cue(L, "08_swarbhanu", "ये"),
        "cap09b": word_cue(L, "09_narrator", "और"),
        "cap09c": word_cue(L, "09_narrator", "देवताओं"),
        "cap11b": word_cue(L, "11_bali", "अमृत"),
        "cap12b": word_cue(L, "12_narrator", "अम्रित"),
        "cap14b": word_cue(L, "14_swarbhanu", "देवता"),
        "cap15b": word_cue(L, "15_narrator", "उसे"),
    }
    scenes = {
        "cold": (0, B["title"][0]),
        "title": B["title"],
        "stop": (B["title"][1], s("03_narrator")),
        "reveal": (s("03_narrator"), s("04_vishnu") - 14),
        "kurma": (s("04_vishnu") - 14, s("05_bali") - 6),
        "bali": (s("05_bali") - 6, s("06_narrator")),
        "churn": (s("06_narrator"), s("07_vasuki") - 6),
        "vasuki": (s("07_vasuki") - 6, s("08_swarbhanu")),
        "smoke": (s("08_swarbhanu"), s("09_narrator")),
        "split": (s("09_narrator"), s("10_swarbhanu")),
        "realise": (s("10_swarbhanu"), s("11_bali")),
        "hold": (s("11_bali"), B["boil"][0]),
        "boil": (B["boil"][0], s("12_narrator")),
        "rise": (s("12_narrator"), s("13_indra")),
        "halahala": (s("13_indra"), s("15_narrator")),
        "cliff": (s("15_narrator"), B["endIn"][0]),
        "end": (B["endIn"][0], total),
    }
    return L, B, scenes, cues, total


def write_timing(L, B, scenes, cues, total):
    out = [
        "// Generated by scripts/manthan_ep3_audio.py - edit timings THERE so picture and sound stay in sync.",
        f"export const FPS = {FPS};",
        f"export const TOTAL = {total};",
        "export type Range = readonly [number, number];",
        "/** Dialogue take -> [start, end) frames on the reel clock. */",
        "export const LINES: Record<string, Range> = {",
    ]
    out += [f'  "{k}": [{a}, {b}],' for k, (a, b) in L.items()]
    out += ["};", "/** Silent picture beats. */", "export const BEATS = {"]
    out += [f"  {k}: [{a}, {b}] as Range," for k, (a, b) in B.items()]
    out += ["};", "export const SCENES = {"]
    out += [f"  {k}: [{a}, {b}] as Range," for k, (a, b) in scenes.items()]
    out += ["};", "export const CUES = {"]
    out += [f"  {k}: {v}," for k, v in cues.items()]
    out += ["};"]
    TS.parent.mkdir(parents=True, exist_ok=True)
    TS.write_text("\n".join(out) + "\n")


# ------------------------------------------------------------------------------------ mix
SWARBHANU = {"08_swarbhanu", "10_swarbhanu", "14_swarbhanu"}
NARRATOR = {"01_narrator", "03_narrator", "06_narrator", "09_narrator", "12_narrator", "15_narrator",
            "16_narrator", "jyotiq_signoff"}
OCEAN = {"02_indra", "05_bali", "11_bali", "13_indra"}  # spoken out on the open ocean
LINE_GAIN = {}  # superseded by per-line loudness targets below
# Every take is first set to a K-weighted loudness target, so no voice (the narrator included)
# towers over another; the acting levels stay: shouts a little up, the whisper a little down.
TARGET_LUFS = -18.0
LINE_TARGET = {"05_bali": -17.0, "02_indra": -17.5, "13_indra": -21.0, "10_swarbhanu": -19.5}
BED_GAIN = 1.7  # whole bed lift so the score stays present under dialogue

# Same tanpura-like drone as Episodes 1-2 (series sound)
DRONE = (
    "0.30*sin(2*PI*110*t)*(0.75+0.25*sin(2*PI*0.21*t))"
    "+0.18*sin(2*PI*165*t)*(0.7+0.3*sin(2*PI*0.17*t+1))"
    "+0.14*sin(2*PI*220*t)*(0.6+0.4*sin(2*PI*0.29*t+2))"
    "+0.07*sin(2*PI*330.6*t)*(0.5+0.5*sin(2*PI*0.37*t))"
    "+0.05*sin(2*PI*440.4*t)*(0.5+0.5*sin(2*PI*0.43*t+0.5))"
    "+0.12*sin(2*PI*55*t)"
)
BED_LEVEL = [("cold", 0.22), ("title", 0.30), ("stop", 0.20), ("reveal", 0.26), ("kurma", 0.22),
             ("bali", 0.24), ("churn", 0.26), ("vasuki", 0.22), ("smoke", 0.22), ("split", 0.26),
             ("realise", 0.22), ("hold", 0.22), ("boil", 0.30), ("rise", 0.26), ("halahala", 0.22),
             ("cliff", 0.26), ("end", 0.22)]


def build_graph(L, scenes, c, total):
    T = total / FPS
    inputs, g, vo_labels, fx = [], [], [], []
    comp = "highpass=f=75,acompressor=threshold=0.12:ratio=2.5:attack=8:release=160:makeup=1.6"
    for i, (k, (a, _)) in enumerate(L.items()):
        wav = VO_DIR / f"{SRC.get(k, k)}.wav"
        inputs += ["-i", str(wav)]
        d = f"volume={POST_FIX.get(k, 0.0):.2f}dB,adelay={ms(a)}|{ms(a)}"
        gdb = LINE_TARGET.get(k, TARGET_LUFS) - measure(wav)[0]  # level-match this take first
        LEVEL_FIX[k] = round(gdb, 1)
        lcomp = f"volume={gdb:.2f}dB,{comp}"
        if k == "07_vasuki":  # same serpent-king treatment as Episode 2
            g.append(f"[{i}:a]{lcomp},asplit=2[vkA][vkB]")
            g.append("[vkB]asetrate=42240,aresample=48000,atempo=1.13636,lowpass=f=2200,volume=0.32[vkL]")
            g.append(f"[vkA][vkL]amix=inputs=2:normalize=0,equalizer=f=120:t=q:w=1:g=2.5,aecho=0.8:0.6:110|230:0.26|0.14,{d}[v{i}]")
        elif k == "04_vishnu":  # Vishnu as Kurma: a soft low shadow and a vast ocean-temple echo
            g.append(f"[{i}:a]{lcomp},asplit=2[kuA][kuB]")
            g.append("[kuB]asetrate=43200,aresample=48000,atempo=1.11111,lowpass=f=1800,volume=0.26[kuL]")
            g.append(f"[kuA][kuL]amix=inputs=2:normalize=0,equalizer=f=110:t=q:w=1:g=2,aecho=0.8:0.6:90|190:0.3|0.18,{d}[v{i}]")
        else:
            space = ""
            if k in OCEAN:
                space = ",aecho=1.0:1.0:45|95:0.08|0.04"  # open air over the ocean (unity gain: Ep2's 0.8:0.4 cost ~8 dB)
            elif k in SWARBHANU:
                space = ",equalizer=f=180:t=q:w=1.2:g=2.5"  # close, darker, intimate (as Episode 2)
            elif k in NARRATOR:
                space = ",equalizer=f=160:t=q:w=1:g=1.5"  # warm storyteller (as Episode 2)
            g.append(f"[{i}:a]{lcomp}{space},{d}[v{i}]")
        vo_labels.append(f"[v{i}]")
    n = len(L)
    g.append(f"{''.join(vo_labels)}amix=inputs={n}:normalize=0,apad=whole_dur={T},asplit=3[vo][vosc][vostem]")

    files = [SFX1 / "sfx_thunder.mp3", SFX1 / "sfx_water.mp3",
             SFX2 / "serpent_hiss.mp3", SFX2 / "mountain_sink.mp3", SFX2 / "army_rope.mp3",
             SFX3 / "kurma_rise.mp3", SFX3 / "fire_breath.mp3", SFX3 / "rain_clouds.mp3", SFX3 / "poison_boil.mp3"]
    idx = {}
    for j, p in enumerate(files):
        inputs += ["-i", str(p)]
        idx[p.stem] = n + j
    g.append(f"[{idx['sfx_thunder']}:a]asplit=2[thA][thB]")
    g.append(f"[{idx['sfx_water']}:a]asplit=2[waA][waB]")
    g.append(f"[{idx['serpent_hiss']}:a]asplit=2[hs1][hs2]")
    g.append(f"[{idx['fire_breath']}:a]asplit=2[fbA][fbB]")
    g.append(f"[{idx['poison_boil']}:a]asplit=2[pbA][pbB]")

    def clip(src, a, b, at_f, gain, fin, fout, label):
        dur = b - a
        g.append(
            f"[{src}]atrim={a}:{b},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,"
            f"afade=t=in:d={fin},afade=t=out:st={max(0.0, dur - fout):.3f}:d={fout},volume={gain},"
            f"adelay={ms(max(0, at_f))}|{ms(max(0, at_f))}[{label}]"
        )
        fx.append(f"[{label}]")

    def hiss(src, at_f, gain, rate, tempo, label):
        """The 1 s hiss, pitched down (rate < 1) and stretched (tempo < 1) into a bigger serpent breath."""
        dur = 1.0 / rate / tempo
        g.append(
            f"[{src}]aresample=48000,aformat=channel_layouts=stereo,asetrate={int(48000 * rate)},aresample=48000,"
            f"atempo={tempo},lowpass=f=7000,afade=t=in:d=0.08,afade=t=out:st={dur * 0.55:.3f}:d={dur * 0.45:.3f},"
            f"volume={gain},adelay={ms(at_f)}|{ms(at_f)}[{label}]"
        )
        fx.append(f"[{label}]")

    def boom(at_f, amp, f0=42, f1=34, dec=2.6, label="b"):
        w = f"{amp}*sin(2*PI*({f0}+{f1}*exp(-t*9))*t)*exp(-t*{dec})"
        g.append(f"aevalsrc='{w}|{w}':s=48000:d=2.4,lowpass=f=180,adelay={ms(at_f)}|{ms(at_f)}[{label}]")
        fx.append(f"[{label}]")

    def whoosh(at_f, amp, dur=0.7, label="w"):
        g.append(
            f"anoisesrc=color=pink:amplitude=1:d={dur}:r=48000,bandpass=f=900:w=1400,"
            f"volume='{amp}*sin(PI*t/{dur})^2':eval=frame,aformat=channel_layouts=stereo,"
            f"adelay={ms(at_f)}|{ms(at_f)}[{label}]"
        )
        fx.append(f"[{label}]")

    def shimmer(at_f, amp, base=1320, dur=3.0, label="s"):
        e = "+".join(f"{a}*sin(2*PI*{base * r}*t)*exp(-t*{k})" for a, r, k in ((0.5, 1, 1.4), (0.3, 1.5, 1.8), (0.22, 2, 2.2), (0.15, 3, 2.8)))
        g.append(
            f"aevalsrc='{amp}*({e})|{amp}*({e})':s=48000:d={dur},aecho=0.8:0.6:120|240:0.35|0.2,"
            f"adelay={ms(at_f)}|{ms(at_f)}[{label}]"
        )
        fx.append(f"[{label}]")

    # ElevenLabs effects; peaks placed in the gaps between lines (envelopes measured with
    # manthan-ep3/sfx_env.py: kurma_rise peaks 0-3.5 s, fire_breath 0.5-1.5 s, poison_boil 3-4 s)
    clip(f"{idx['mountain_sink']}:a", 3.0, 8.0, 0, 0.5, 0.02, 2.2, "msk")      # Ep2's sink carries over at frame 0
    clip("waA", 0.0, 6.0, 0, 0.35, 0.05, 2.0, "wa1")                           # deep water around the shell
    clip("thB", 12.8, 15.4, c["titleHit"] - 2, 0.42, 0.02, 1.2, "th1")          # soft roll under the title
    clip(f"{idx['kurma_rise']}:a", 0.0, 6.0, c["riseRumble"], 0.6, 0.2, 2.0, "krs")  # the shell rises under Mandar
    clip("waB", 3.0, 7.5, c["hold"], 0.45, 0.4, 2.0, "wa2")                    # water sheets off the shell
    clip(f"{idx['army_rope']}:a", 0.0, 8.0, c["churn"] - 6, 0.5, 0.4, 2.0, "rop")  # both sides heave again
    clip("fbA", 0.0, 4.0, c["fireBurst"] - 3, 0.8, 0.05, 1.4, "fb1")           # Vasuki's fire, after his line
    clip(f"{idx['rain_clouds']}:a", 0.0, 6.0, c["tailSide"], 0.9, 0.8, 2.0, "rn")  # cool rain on the devtas
    clip("thA", 12.8, 15.6, c["rain"] + 10, 0.22, 0.4, 1.2, "th2")             # distant thunder in the clouds
    clip("fbB", 1.5, 4.0, c["afterBali"], 0.25, 0.3, 1.0, "fb2")               # the heat, after Bali's line
    clip("pbA", 0.0, 5.0, c["boil"] - 40, 0.75, 0.3, 1.2, "pbl")               # boil swell peaks inside the beat
    clip("pbB", 2.6, 4.0, c["roar"], 0.7, 0.25, 0.5, "pb2")                     # the column roars after "निकला"
    hiss("hs1", c["vasukiSpeak"] - 12, 0.55, 0.8, 0.7, "h1")    # Vasuki strains before he speaks
    hiss("hs2", c["column"] - 6, 0.4, 1.0, 0.9, "h2")           # the serpent recoils from the poison

    # synthesized accents (same recipes as Episodes 1-2); decays kept short so no tail sits on a word
    shimmer(c["eyeFlash"] - 4, 0.1, 880, 3.0, "s1")    # gold rim flash as the eye opens
    whoosh(c["titleHit"] - 10, 0.35, 0.6, "w1")
    boom(c["titleHit"], 0.55, 38, 40, 1.8, "b1")
    boom(c["stopHit"], 0.6, 34, 30, 3.0, "b2")         # the mountain jolts to a stop
    shimmer(c["kurmaName"], 0.09, 1046, 3.0, "s2")     # Kurma name card
    boom(c["kurmaEye"], 0.45, 36, 30, 3.5, "b3")
    whoosh(c["baliHit"] - 10, 0.3, 0.5, "w2")
    boom(c["baliHit"] - 4, 0.5, 40, 30, 4.0, "b4")     # impact frame on Bali
    shimmer(c["smileWord"], 0.05, 880, 2.5, "s3")      # callback to Vishnu's smile
    boom(c["column"], 0.75, 30, 50, 3.0, "b5")         # the poison column breaks the surface
    whoosh(c["freeze"] - 10, 0.45, 0.45, "w3")
    boom(c["freeze"], 0.6, 36, 44, 3.0, "b6")
    shimmer(c["endCard"], 0.12, 1046, 4.0, "s4")
    shimmer(c["shani"], 0.06, 1320, 2.0, "s5")         # Shani glyph lights on the end card
    shimmer(c["brandChime"], 0.14, 1320, 2.5, "s6")

    # bed: the series drone (Sa-Pa on A) + low air + (new in Episode 3) a soft ocean-wave wash in the
    # mid band, so the background stays audible under dialogue; level set per scene
    g.append(f"aevalsrc='{DRONE}|{DRONE}':s=48000:d={T},lowpass=f=1400,aecho=0.8:0.7:180|360:0.3|0.2[drn]")
    g.append(f"anoisesrc=color=brown:amplitude=0.5:d={T}:r=48000,lowpass=f=320,aformat=channel_layouts=stereo[air]")
    g.append(
        f"anoisesrc=color=pink:amplitude=0.6:d={T}:r=48000:seed=7,bandpass=f=600:w=900,lowpass=f=2400,"
        f"volume='0.55+0.45*sin(2*PI*0.12*t)':eval=frame,aformat=channel_layouts=stereo[wav]"
    )
    expr = "0.22"
    for name, v in reversed(BED_LEVEL):
        expr = f"if(lt(t,{scenes[name][1] / FPS:.3f}),{v},{expr})"
    g.append(
        f"[drn][air][wav]amix=inputs=3:normalize=0:weights=1 0.55 {WAVES},volume='{BED_GAIN}*({expr})':eval=frame,"
        f"afade=t=in:d=0.05,afade=t=out:st={T - 1.6:.3f}:d=1.6[bed]"
    )

    # buses: bed + SFX get a fixed DUCK_DB dip under every line (0.2 s in, 0.4 s out, gentle
    # enough not to pump), then a light sidechain on top so loud SFX never cover a word
    duck = 10 ** (DUCK_DB / 20)
    win = "+".join(f"clip((t-{a / FPS - 0.2:.3f})/0.2,0,1)*clip(({b / FPS + 0.4:.3f}-t)/0.4,0,1)" for a, b in L.values())
    g.append(
        f"[bed]{''.join(fx)}amix=inputs={len(fx) + 1}:normalize=0,apad=whole_dur={T},"
        f"volume='1-{1 - duck:.4f}*min(1,{win})':eval=frame[bus]"
    )
    g.append("[bus][vosc]sidechaincompress=threshold=0.06:ratio=2:attack=10:release=320:knee=4:makeup=1,asplit=2[duck][duckstem]")
    g.append(f"[vo][duck]amix=inputs=2:normalize=0,atrim=0:{T}[pre]")
    return inputs, ";\n".join(g)


def measure(path):
    m = run(["ffmpeg", "-hide_banner", "-i", str(path), "-af", "ebur128=peak=true", "-f", "null", "-"]).stderr
    summ = m.split("Summary:")[-1]
    i = re.search(r"I:\s+(-?[0-9.]+) LUFS", summ)
    lra = re.search(r"LRA:\s+([0-9.]+) LU", summ)
    pk = re.search(r"Peak:\s+(-?[0-9.]+) dBFS", summ)
    return float(i.group(1)), lra and float(lra.group(1)), pk and float(pk.group(1))


def rms_db(path, a, b):
    r = run(["ffmpeg", "-hide_banner", "-ss", f"{a / FPS:.3f}", "-to", f"{b / FPS:.3f}", "-i", str(path),
             "-af", "astats=measure_perchannel=none", "-f", "null", "-"]).stderr
    m = re.findall(r"RMS level dB: (-?[0-9.]+|-inf)", r)
    return -120.0 if not m or m[-1] == "-inf" else float(m[-1])


def lufs_seg(path, a, b):
    """K-weighted integrated loudness of one window (how loud it sounds, not raw sub-bass energy)."""
    r = run(["ffmpeg", "-hide_banner", "-ss", f"{a / FPS:.3f}", "-to", f"{b / FPS:.3f}", "-i", str(path),
             "-af", "ebur128", "-f", "null", "-"]).stderr
    m = re.search(r"I:\s+(-?[0-9.]+) LUFS", r.split("Summary:")[-1])
    return -70.0 if not m else float(m.group(1))


def mix(L, scenes, cues, total):
    MIX_DIR.mkdir(parents=True, exist_ok=True)
    pre, vo_stem, bus_stem, out = (MIX_DIR / x for x in ("pre.wav", "stem_vo.wav", "stem_bus.wav", "mix.wav"))
    inputs, graph = build_graph(L, scenes, cues, total)
    gp = MIX_DIR / "mix_graph.txt"
    gp.write_text(graph)
    r = run(["ffmpeg", "-hide_banner", "-v", "error", "-y", *inputs, "-/filter_complex", str(gp),
             "-map", "[pre]", "-ac", "2", "-ar", "48000", "-c:a", "pcm_s24le", str(pre),
             "-map", "[vostem]", "-ac", "2", "-ar", "48000", "-c:a", "pcm_s24le", str(vo_stem),
             "-map", "[duckstem]", "-ac", "2", "-ar", "48000", "-c:a", "pcm_s24le", str(bus_stem)])
    if r.returncode:
        print(r.stderr[-3000:])
        raise SystemExit(1)
    i_pre = measure(pre)[0]
    gain = -14.0 - i_pre
    r = run(["ffmpeg", "-hide_banner", "-v", "error", "-y", "-i", str(pre), "-af",
             f"volume={gain:.2f}dB,alimiter=limit=0.82:attack=4:release=80:level=0",
             "-ar", "48000", "-c:a", "pcm_s16le", str(out)])
    if r.returncode:
        print(r.stderr[-2000:])
        raise SystemExit(1)
    i, lra, tp = measure(out)
    print(f"wrote {out}  I={i} LUFS  LRA={lra}  TP={tp} dBFS  (static gain {gain:+.2f} dB)")
    print("take level-match (dB):", ", ".join(f"{k} {v:+.1f}" for k, v in LEVEL_FIX.items()))
    vo_l = {k: lufs_seg(vo_stem, a, b) for k, (a, b) in L.items()}
    print("dialogue loudness per line (LUFS, before master gain):", ", ".join(f"{k} {v:.1f}" for k, v in vo_l.items()))
    gaps = sorted((vo_l[k] - lufs_seg(bus_stem, a, b), k) for k, (a, b) in L.items())
    print("dialogue minus bed (LU, K-weighted), lowest first:", ", ".join(f"{k} {s:.1f}" for s, k in gaps))
    return vo_l


def main():
    frames = vo_frames()
    L, B, scenes, cues, total = build_timing(frames)
    write_timing(L, B, scenes, cues, total)
    for k, (a, b) in L.items():
        print(f"{k:16s} {a:5d}-{b:5d}  ({a / FPS:6.2f}-{b / FPS:6.2f}s)")
    print("beats:", {k: (round(a / FPS, 2), round(b / FPS, 2)) for k, (a, b) in B.items()})
    print(f"TOTAL {total} frames = {total / FPS:.2f}s;  word cues missed: {MISSES or 'none'}")
    if "--timing-only" in sys.argv:
        return
    vo_l = mix(L, scenes, cues, total)
    # second pass: trim each line after its space/echo chain so it lands exactly on its target
    for k in L:
        POST_FIX[k] = round(LINE_TARGET.get(k, TARGET_LUFS) - vo_l[k], 2)
    if max(abs(v) for v in POST_FIX.values()) > 0.5:
        print("pass 2, post-chain trims (dB):", ", ".join(f"{k} {v:+.1f}" for k, v in POST_FIX.items()))
        mix(L, scenes, cues, total)


if __name__ == "__main__":
    main()
