#!/usr/bin/env python3
"""Manthan Ep4 NEELKANTH - timeline + audio mix (single source of truth).

Same method as manthan_ep3_audio.py:
1. Lays Episode 4's trimmed takes end to end in script order (with the silent picture beats in
   ORDER), finds word-level cue points from the local Whisper transcripts, and writes
   src/Jyotiq/manthan/ep4/timing.ts so picture and sound share one clock.
2. Mixes dialogue, the user's SFX (damru, conch), the generated score and the Kaal time layer
   into public/jyotiq/manthan/ep4/mix.wav (added in the mix step).

Hard cap: the reel must stay under 60 s (1800 frames).
ffmpeg only (no numpy on this Mac). Run with --timing-only to skip the mix.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path("/Users/ayushrajput/.kiro/crew/workspace/video")
EP4 = Path("/Users/ayushrajput/.kiro/crew/workspace/manthan-ep4")
VO_DIR = ROOT / "public/jyotiq/manthan/ep4/vo"
STT = EP4 / "audio/stt"
TS = ROOT / "src/Jyotiq/manthan/ep4/timing.ts"
MIX_DIR = ROOT / "public/jyotiq/manthan/ep4"
SFX3 = Path("/Users/ayushrajput/.kiro/crew/workspace/manthan-ep3/audio/sfx")
SFX4 = EP4 / "audio/sfx"
FPS = 30
CAP_FRAMES = 1800  # 60.0 s
BALI_LAG = 2  # Bali's "हर हर महादेव!" starts 2 frames after Indra's, so the chant sounds like two voices

# Script order. ("vo", key, gap_before) places a take; ("beat", key, gap_before, length) holds
# picture with no dialogue; ("chant", key, gap_before) places 09_indra and 09_bali together.
ORDER = [
    ("vo", "01_narrator", 10),      # hook: picture moving and the Kaal time-boom at frame 0, the line at 0.33 s
    ("beat", "title", 6, 42),       # मंथन · Episode 4 · नीलकंठ, damru roll
    ("vo", "02_narrator", 4),       # poison fog, the armies run to Kailash
    ("vo", "03_indra", 10),         # they kneel in this gap
    ("vo", "04_shiva", 12),         # Shiva's eyes open in this gap
    ("vo", "05_narrator", 8),
    ("vo", "06_narrator", 8),
    ("beat", "drink", 0, 60),       # he drinks; colour drains back into the sky
    ("vo", "07_narrator", 0),
    ("vo", "08_narrator", 48),      # the 'नीलकंठ' time-echo and the bell ring in this gap
    ("chant", "09", 8),             # हर हर महादेव! (Indra + Bali + crowd)
    ("beat", "conch", 0, 36),       # shankh blast in the clear
    ("vo", "10_narrator", 4),       # the spoken Jyotiq close over the end card
    ("vo", "jyotiq_signoff", 8),
    ("beat", "hold", 0, 24),
]
MISSES = []


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def ms(f):
    return int(round(f * 1000 / FPS))


def vo_frames():
    t = (ROOT / "src/Jyotiq/manthan/ep4/voData.ts").read_text()
    data = json.loads(t.split("VoLine> = ", 1)[1].strip().rstrip(";"))
    return {k: v["frames"] for k, v in data.items()}


def layout(frames):
    lines, beats, t = {}, {}, 0
    for item in ORDER:
        kind, key, gap = item[0], item[1], item[2]
        t += gap
        if kind == "vo":
            n = frames[key]
            lines[key] = (t, t + n)
        elif kind == "chant":
            ni, nb = frames["09_indra"], frames["09_bali"]
            lines["09_indra"] = (t, t + ni)
            lines["09_bali"] = (t + BALI_LAG, t + BALI_LAG + nb)
            n = max(ni, nb + BALI_LAG)
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
    hits = [w for w in words(key) if needle in w[0]]
    if len(hits) <= nth:
        MISSES.append(f"{key}:{needle}")
        return lines[key][0]
    return lines[key][0] + int(round(to_trimmed(key, hits[nth][1]) * FPS)) - lead


def build_timing(frames):
    L, B, total = layout(frames)

    def s(k):
        return L[k][0]

    def e(k):
        return L[k][1]

    cues = {
        # hook: Episode 3's last Kailash frame, push into the throat, flash-forward to the palm
        "halahal": word_cue(L, "01_narrator", "हलाहल"),
        "palmFlash": word_cue(L, "01_narrator", "महादेव"),
        "poocha": word_cue(L, "01_narrator", "पूछा"),
        "titleHit": B["title"][0],
        # the poison spreads, everyone runs to Kailash
        "fog": s("02_narrator"),
        "spread": word_cue(L, "02_narrator", "फैलने"),
        "run": word_cue(L, "02_narrator", "भागे"),
        "kailash": word_cue(L, "02_narrator", "कैलाश"),
        "kneel": s("03_indra") - 8,
        "raksha": word_cue(L, "03_indra", "रक्षा"),
        # Shiva and Parvati
        "eyesOpen": s("04_shiva") - 10,
        "bhavani": word_cue(L, "04_shiva", "भवानी"),
        "dharma": word_cue(L, "04_shiva", "धर्म"),
        "parvati": word_cue(L, "05_narrator", "पार्वती"),
        "shakti": word_cue(L, "05_narrator", "शक्ति"),
        "haan": word_cue(L, "05_narrator", "हां"),
        # the drink
        "gather": word_cue(L, "06_narrator", "हला"),
        "hatheli": word_cue(L, "06_narrator", "हथेली"),
        "uthaya": word_cue(L, "06_narrator", "उठाया"),
        "pee": word_cue(L, "06_narrator", "पी"),
        "drink": B["drink"][0],
        "colourBack": B["drink"][0] + 30,
        "kanth": word_cue(L, "07_narrator", "कंट"),
        "thahar": word_cue(L, "07_narrator", "ठहर"),
        "neelkanth": word_cue(L, "07_narrator", "नील"),
        # the spilled drops, Swarbhanu watches
        "drops": word_cue(L, "08_narrator", "बूंद"),
        "snakes": word_cue(L, "08_narrator", "सांप"),
        "scorpions": word_cue(L, "08_narrator", "बिच्छ"),
        "sama": word_cue(L, "08_narrator", "समा"),
        "afterDrops": e("08_narrator"),
        # together
        "chant": s("09_indra"),
        "conch": B["conch"][0],
        # spoken Jyotiq close
        "endCard": B["conch"][1] - 12,
        "jyotish": s("10_narrator"),
        "chandra": word_cue(L, "10_narrator", "चंद्रमा"),
        "mann": word_cue(L, "10_narrator", "मन"),
        "sir": word_cue(L, "10_narrator", "सिर"),
        "kundali": word_cue(L, "10_narrator", "कुंडली"),
        "chandra2": word_cue(L, "10_narrator", "चंद्रमा", nth=1),
        "shaant": word_cue(L, "10_narrator", "शांत"),
        "signoff": s("jyotiq_signoff"),
        "offer": word_cue(L, "jyotiq_signoff", "पहला"),
        "brandChime": e("jyotiq_signoff") + 2,
        # caption split points (the next part of a caption starts here)
        "cap01b": word_cue(L, "01_narrator", "महादेव"),
        "cap02b": word_cue(L, "02_narrator", "देवता"),
        "cap04b": word_cue(L, "04_shiva", "दीनों"),
        "cap05b": word_cue(L, "05_narrator", "उन्हों"),
        "cap06b": word_cue(L, "06_narrator", "और"),
        "cap07b": word_cue(L, "07_narrator", "और"),
        "cap08b": word_cue(L, "08_narrator", "वो"),
        "cap10b": word_cue(L, "10_narrator", "और"),
        "cap10c": word_cue(L, "10_narrator", "आपकी"),
    }
    scenes = {
        "hook": (0, B["title"][0]),
        "title": B["title"],
        "flee": (B["title"][1], s("03_indra") - 8),
        "plea": (s("03_indra") - 8, s("04_shiva") - 10),
        "shiva": (s("04_shiva") - 10, s("05_narrator")),
        "parvati": (s("05_narrator"), s("06_narrator")),
        "palm": (s("06_narrator"), B["drink"][0]),
        "drink": B["drink"],
        "neelkanth": (s("07_narrator"), s("08_narrator")),
        "drops": (s("08_narrator"), s("09_indra") - 4),
        "chant": (s("09_indra") - 4, B["conch"][1] - 12),
        "end": (B["conch"][1] - 12, total),
    }
    return L, B, scenes, cues, total


def write_timing(L, B, scenes, cues, total):
    out = [
        "// Generated by scripts/manthan_ep4_audio.py - edit timings THERE so picture and sound stay in sync.",
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
STEMS = EP4 / "audio/stems"
SFX2 = Path("/Users/ayushrajput/.kiro/crew/workspace/manthan-ep2/audio/sfx")
NARRATOR = {"01_narrator", "02_narrator", "05_narrator", "06_narrator", "07_narrator", "08_narrator",
            "10_narrator", "jyotiq_signoff"}
CHANT = ("09_indra", "09_bali")
# Every take is first set to a K-weighted loudness target so no voice towers over another; the
# chant window (Indra + Bali + crowd together) sits 3 LU up, the plea a little up.
TARGET_LUFS = -18.0
LINE_TARGET = {"03_indra": -17.5, "09_indra": -15.0, "09_bali": -15.0}
DUCK_DB = -7.0      # fixed dip of score + SFX under every line
MIN_GAP = 11.5      # every line must sit at least this many LU above the bed (rule: >= 10)
GOAL_GAP = 13.0     # the bed level is calibrated so the median line sits this far above it
HALL_DB = -10.0     # narrator 'Kaal hall' send (the IR itself is about -6 dB)
SHIVA_HALL_DB = -6.0
ECHO_DB = 2.0       # the 'नीलकंठ' echo follows line 07's level, plus the compressor's make-up
BED = {"gain": 0.5}
LEVEL_FIX, POST_FIX, EXTRA_DUCK = {}, {}, {}
# per-scene levels of the two sustained layers (the pad, bells and drums carry their own dynamics)
TANPURA_LV = {"hook": 0.5, "title": 0.55, "flee": 0.4, "plea": 0.45, "shiva": 0.55, "parvati": 0.55, "palm": 0.45,
              "drink": 0.35, "neelkanth": 0.5, "drops": 0.5, "chant": 0.4, "end": 0.5}
KAAL_LV = {"hook": 0.9, "title": 0.6, "flee": 0.45, "plea": 0.45, "shiva": 0.55, "parvati": 0.5, "palm": 0.6,
           "drink": 0.9, "neelkanth": 0.75, "drops": 0.6, "chant": 0.35, "end": 0.45}
CROWD = [  # (take, pitch ratio, delay ms, gain, left, right): devtas and asuras chanting along
    ("09_indra", 1.06, 18, 0.20, 0.90, 0.35),
    ("09_indra", 0.92, 41, 0.20, 0.35, 0.90),
    ("09_indra", 1.13, 63, 0.14, 0.70, 0.55),
    ("09_bali", 0.95, 27, 0.20, 0.85, 0.40),
    ("09_bali", 1.08, 52, 0.18, 0.40, 0.85),
    ("09_bali", 0.88, 76, 0.14, 0.60, 0.60),
]


def level_expr(levels, scenes):
    """Per-scene level as a smooth expression: 0.3 s linear ramps at the scene boundaries."""
    names = list(scenes)
    out = f"{levels[names[0]]}"
    for a, b in zip(names, names[1:]):
        d = levels[b] - levels[a]
        if abs(d) > 1e-6:
            out += f"{d:+.3f}*clip((t-{scenes[b][0] / FPS - 0.15:.3f})/0.3,0,1)"
    return out


def build_graph(L, scenes, c, total):
    T = total / FPS
    inputs, g, vo, send_n, send_s, fx = [], [], [], [], [], []
    comp = "highpass=f=75,acompressor=threshold=0.12:ratio=2.5:attack=8:release=160:makeup=1.6"

    def inp(path):
        inputs.extend(["-i", str(path)])
        return len(inputs) // 2 - 1

    for k, (a, _) in L.items():
        wav = VO_DIR / f"{k}.wav"
        i = inp(wav)
        gdb = LINE_TARGET.get(k, TARGET_LUFS) - measure(wav)[0]  # level-match this take first
        LEVEL_FIX[k] = round(gdb, 1)
        post = POST_FIX.get(k, 0.0)
        d = f"volume={post:.2f}dB,adelay={ms(a)}|{ms(a)}"
        lcomp = f"volume={gdb:.2f}dB,{comp}"
        if k in NARRATOR:  # warm storyteller (as Episodes 2-3) + a send to the Kaal hall
            g.append(f"[{i}:a]{lcomp},equalizer=f=160:t=q:w=1:g=1.5,{d},asplit=2[v{i}][n{i}]")
            vo.append(f"[v{i}]")
            send_n.append(f"[n{i}]")
        elif k == "04_shiva":  # a soft low shadow, a warm mountain echo and a wider hall
            g.append(f"[{i}:a]{lcomp},asplit=2[shA][shB]")
            g.append("[shB]asetrate=43200,aresample=48000,atempo=1.11111,lowpass=f=1800,volume=0.22[shL]")
            g.append(f"[shA][shL]amix=inputs=2:normalize=0,equalizer=f=120:t=q:w=1:g=2,aecho=1.0:1.0:70|150:0.1|0.05,{d},asplit=2[v{i}][s{i}]")
            vo.append(f"[v{i}]")
            send_s.append(f"[s{i}]")
        elif k in CHANT:  # the lead take, plus pitched and delayed copies as the crowd
            mine = [x for x in CROWD if x[0] == k]
            g.append(f"[{i}:a]{lcomp},asplit={len(mine) + 1}[c{i}m]" + "".join(f"[c{i}x{j}]" for j in range(len(mine))))
            g.append(f"[c{i}m]aecho=1.0:1.0:45|95:0.08|0.04,{d}[v{i}]")
            vo.append(f"[v{i}]")
            for j, (_, r, dly, gc, pl, pr) in enumerate(mine):
                g.append(
                    f"[c{i}x{j}]asetrate={int(48000 * r)},aresample=48000,atempo={1 / r:.5f},highpass=f=150,lowpass=f=3200,"
                    f"pan=stereo|c0={pl}*c0|c1={pr}*c1,volume={gc * 10 ** (post / 20):.4f},"
                    f"adelay={ms(a) + dly}|{ms(a) + dly + 9}[cr{i}x{j}]"
                )
                vo.append(f"[cr{i}x{j}]")
        else:  # 03_indra: open mountain air (unity-gain echo)
            g.append(f"[{i}:a]{lcomp},aecho=1.0:1.0:45|95:0.08|0.04,{d}[v{i}]")
            vo.append(f"[v{i}]")

    # the 'नीलकंठ' time-echo (built in manthan_ep4_score.py from the trimmed take) follows line 07's level
    ie = inp(STEMS / "echo.wav")
    g.append(f"[{ie}:a]volume={LEVEL_FIX['07_narrator'] + POST_FIX.get('07_narrator', 0.0) + ECHO_DB:.2f}dB,highpass=f=90[echo]")
    vo.append("[echo]")
    # the Kaal hall: one long, high-passed reverb shared by all narrator lines; a wider one for Shiva
    ir = inp(STEMS / "ir_narrator.wav")
    g.append(f"[{ir}:a]asplit=2[irA][irB]")
    g.append(f"{''.join(send_n)}amix=inputs={len(send_n)}:normalize=0,highpass=f=250,lowpass=f=7000,apad=pad_dur=4[ns]")
    g.append(f"[ns][irA]afir=irnorm=-1:irgain=1,volume={HALL_DB}dB[hallN]")
    g.append(f"{''.join(send_s)}highpass=f=180,apad=pad_dur=4[ss]")
    g.append(f"[ss][irB]afir=irnorm=-1:irgain=1,volume={SHIVA_HALL_DB}dB[hallS]")
    vo += ["[hallN]", "[hallS]"]
    g.append(f"{''.join(vo)}amix=inputs={len(vo)}:normalize=0,apad=whole_dur={T},atrim=0:{T},asplit=3[vo][vosc][vostem]")

    def clip(src, a, b, at_f, gain, fin, fout, label):
        dur = b - a
        g.append(
            f"[{src}]atrim={a}:{b},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,"
            f"afade=t=in:d={fin},afade=t=out:st={max(0.0, dur - fout):.3f}:d={fout},volume={gain},"
            f"adelay={ms(max(0, at_f))}|{ms(max(0, at_f))}[{label}]"
        )
        fx.append(f"[{label}]")

    def hiss(src, at_f, gain, rate, tempo, label):
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

    # the user's ElevenLabs effects, both in the clear (damru: even 2 s roll; shankh: peak at 0-1.1 s)
    sx = {"damru": inp(SFX4 / "damru_roll.mp3"), "shankh": inp(SFX4 / "shankh_blast.mp3"),
          "boil": inp(SFX3 / "poison_boil.mp3"), "hiss": inp(SFX2 / "serpent_hiss.mp3")}
    clip(f"{sx['damru']}:a", 0.0, 2.0, c["titleHit"] - 6, 0.75, 0.01, 0.4, "dmr")
    clip(f"{sx['shankh']}:a", 0.0, 3.0, c["conch"] - 2, 0.7, 0.01, 1.2, "shk")
    clip(f"{sx['boil']}:a", 0.0, 3.4, c["fog"] - 8, 0.35, 0.3, 1.2, "pbl")      # Episode 3's poison, spreading
    hiss(f"{sx['hiss']}:a", c["snakes"] - 4, 0.3, 0.85, 0.8, "hs")               # the drops become serpents
    # synthesized accents (Episode 3 recipes)
    whoosh(c["palmFlash"] - 10, 0.25, 0.5, "w1")
    shimmer(c["palmFlash"], 0.05, 988, 2.0, "s1")
    boom(c["titleHit"], 0.5, 38, 40, 1.8, "b1")
    shimmer(c["eyesOpen"], 0.07, 1320, 2.5, "s2")
    whoosh(c["drink"] - 14, 0.35, 0.5, "w2")
    boom(c["drink"], 0.55, 34, 40, 2.6, "b2")
    shimmer(c["colourBack"], 0.08, 1046, 3.0, "s3")
    shimmer(c["neelkanth"], 0.05, 1318, 3.0, "s4")
    boom(c["conch"], 0.45, 36, 40, 2.4, "b3")
    shimmer(c["endCard"], 0.1, 1046, 3.5, "s5")
    shimmer(c["chandra"], 0.05, 1568, 2.0, "s6")
    shimmer(c["brandChime"], 0.12, 1320, 2.5, "s7")

    # the generated score + the Kaal time layer
    st = {n: inp(STEMS / f"{n}.wav") for n in ("tanpura", "pad", "bells", "drums", "kaal", "kaal_fx")}
    g.append(f"[{st['tanpura']}:a]volume='{level_expr(TANPURA_LV, scenes)}':eval=frame[tp]")
    g.append(f"[{st['kaal']}:a]volume='{level_expr(KAAL_LV, scenes)}':eval=frame[kl]")
    g.append(
        f"[{st['pad']}:a][{st['bells']}:a][{st['drums']}:a][{st['kaal_fx']}:a][tp][kl]"
        f"amix=inputs=6:normalize=0:weights=1 0.8 0.9 1 1 1,atrim=0:{T}[bed0]"
    )
    # bed + SFX dip by DUCK_DB under every line (0.2 s in, 0.4 s out), deeper where a line needs it,
    # then a light sidechain on top so no SFX transient covers a word
    win = None
    for k, (a, b) in L.items():
        if k == "09_bali":
            continue  # same window as 09_indra
        depth = 1 - 10 ** ((DUCK_DB - EXTRA_DUCK.get(k, 0.0)) / 20)
        term = f"{depth:.4f}*clip((t-{a / FPS - 0.2:.3f})/0.2,0,1)*clip(({b / FPS + 0.4:.3f}-t)/0.4,0,1)"
        win = term if win is None else f"max({win},{term})"
    g.append(
        f"[bed0]volume={BED['gain']:.4f}[bed];[bed]{''.join(fx)}amix=inputs={len(fx) + 1}:normalize=0,"
        f"apad=whole_dur={T},atrim=0:{T},acompressor=threshold=0.1:ratio=3:attack=30:release=350:knee=4:makeup=1,"
        f"volume='1-({win})':eval=frame,afade=t=out:st={T - 1.4:.3f}:d=1.4[bus]"
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


def lufs_seg(path, a, b):
    """K-weighted integrated loudness of one window (how loud it sounds, not raw sub-bass energy)."""
    r = run(["ffmpeg", "-hide_banner", "-ss", f"{a / FPS:.3f}", "-to", f"{b / FPS:.3f}", "-i", str(path),
             "-af", "ebur128", "-f", "null", "-"]).stderr
    m = re.search(r"I:\s+(-?[0-9.]+) LUFS", r.split("Summary:")[-1])
    return -70.0 if not m else float(m.group(1))


def mix(L, B, scenes, cues, total, tag):
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
    gain = -14.0 - measure(pre)[0]
    r = run(["ffmpeg", "-hide_banner", "-v", "error", "-y", "-i", str(pre), "-af",
             f"volume={gain:.2f}dB,alimiter=limit=0.8:attack=4:release=80:level=0",
             "-ar", "48000", "-c:a", "pcm_s16le", str(out)])
    if r.returncode:
        print(r.stderr[-2000:])
        raise SystemExit(1)
    i, lra, tp = measure(out)
    print(f"[{tag}] wrote {out.name}  I={i} LUFS  LRA={lra}  TP={tp} dBFS  (static gain {gain:+.2f} dB, bed gain {BED['gain']:.3f})", flush=True)
    vo_l = {k: lufs_seg(vo_stem, a, b) for k, (a, b) in L.items()}
    gaps = {k: vo_l[k] - lufs_seg(bus_stem, a, b) for k, (a, b) in L.items()}
    print(f"[{tag}] dialogue LUFS:", ", ".join(f"{k} {v:.1f}" for k, v in vo_l.items()), flush=True)
    print(f"[{tag}] dialogue minus bed (LU), lowest first:", ", ".join(f"{k} {v:.1f}" for k, v in sorted(gaps.items(), key=lambda kv: kv[1])), flush=True)
    beds = {n: lufs_seg(bus_stem, a, b) for n, (a, b) in B.items()}
    print(f"[{tag}] bed in the silent beats (LUFS, pre-master):", ", ".join(f"{k} {v:.1f}" for k, v in beds.items()), flush=True)
    return vo_l, gaps


def main():
    frames = vo_frames()
    L, B, scenes, cues, total = build_timing(frames)
    write_timing(L, B, scenes, cues, total)
    order = sorted(cues.items(), key=lambda kv: kv[1])
    bad = [k for k, v in cues.items() if v < 0 or v > total]
    print(f"TOTAL {total} frames = {total / FPS:.2f} s (cap {CAP_FRAMES} = 60.0 s)", "OK" if total < CAP_FRAMES else "OVER CAP")
    print("scenes:", ", ".join(f"{k} {a}-{b}" for k, (a, b) in scenes.items()))
    print("cues:", ", ".join(f"{k} {v}" for k, v in order))
    print("missing word cues:", MISSES or "none", "| out of range:", bad or "none", flush=True)
    if "--timing-only" in sys.argv:
        return
    for p in range(1, 5):
        vo_l, gaps = mix(L, B, scenes, cues, total, f"pass {p}")
        err = {k: LINE_TARGET.get(k, TARGET_LUFS) - v for k, v in vo_l.items()}
        med = sorted(gaps.values())[len(gaps) // 2]
        ok = max(abs(v) for v in err.values()) <= 0.5 and min(gaps.values()) >= MIN_GAP - 0.5 and abs(med - GOAL_GAP) <= 1.5
        print(f"[pass {p}] max level error {max(abs(v) for v in err.values()):.2f} dB, min gap {min(gaps.values()):.1f}, median gap {med:.1f}", "-> DONE" if ok else "", flush=True)
        if ok or p == 4:
            break
        for k, v in err.items():
            POST_FIX[k] = round(POST_FIX.get(k, 0.0) + v, 2)
        # gaps after this pass's voice trims; the bed moves so their median lands on GOAL_GAP
        after = {k: gaps[k] + err[k] for k in gaps}
        bed_db = sorted(after.values())[len(after) // 2] - GOAL_GAP  # positive: the bed can come up
        if abs(bed_db) > 1.0:
            BED["gain"] *= 10 ** (bed_db / 20)
        for k in gaps:
            expect = after[k] - (bed_db if abs(bed_db) > 1.0 else 0.0)
            if expect < MIN_GAP:
                EXTRA_DUCK[k] = round(EXTRA_DUCK.get(k, 0.0) + MIN_GAP - expect + 0.5, 1)
        print(f"[pass {p}] next: post trims {POST_FIX}, extra ducks {EXTRA_DUCK}", flush=True)
    print("take level-match (dB):", ", ".join(f"{k} {v:+.1f}" for k, v in LEVEL_FIX.items()))
    print("MIX DONE", flush=True)


if __name__ == "__main__":
    main()
