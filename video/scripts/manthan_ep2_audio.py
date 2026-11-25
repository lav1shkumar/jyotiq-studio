#!/usr/bin/env python3
"""Manthan Ep2 - timeline + audio mix (single source of truth).

1. Lays Episode 2's trimmed takes end to end in script order (with the silent picture
   beats listed in ORDER), finds word-level cue points from the local Whisper transcripts,
   and writes src/Jyotiq/manthan/ep2/timing.ts so picture and sound share one clock.
   Swap a take, re-run, and every scene and cue moves with it.
2. Mixes dialogue, SFX and a synthesized bed into public/jyotiq/manthan/ep2/mix.wav. The bed
   and SFX are ducked hard under every line; the master gets ONE static gain to -14 LUFS plus
   a peak limiter (no dynamic loudnorm), so the measured dialogue-over-bed gap is what ships.
   Also writes dialogue and bed stems and prints the gap per line.

ffmpeg only (no numpy on this Mac). Run with --timing-only to skip the mix.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path("/Users/ayushrajput/.kiro/crew/workspace/video")
EP2 = Path("/Users/ayushrajput/.kiro/crew/workspace/manthan-ep2")
VO_DIR = ROOT / "public/jyotiq/manthan/ep2/vo"
STT = EP2 / "audio/stt"
TS = ROOT / "src/Jyotiq/manthan/ep2/timing.ts"
MIX_DIR = ROOT / "public/jyotiq/manthan/ep2"
SFX1 = Path("/Users/ayushrajput/.kiro/crew/workspace/manthan-ep1/audio/sfx")
SFX2 = EP2 / "audio/sfx"
FPS = 30

# Script order. ("vo", key, gap_before) places a take; ("beat", key, gap_before, length)
# holds picture with no dialogue. "01b" is take 01 played a second time.
ORDER = [
    ("vo", "01_swarbhanu", 4),       # cold open: the shout lands almost at once
    ("vo", "02_narrator", 8),
    ("beat", "title", 6, 66),
    ("vo", "03_narrator", 0),
    ("vo", "04_bali", 18),           # the thunder cracks in this gap, then "रुको!"
    ("vo", "05_indra", 8),
    ("vo", "06_swarbhanu", 6),
    ("vo", "07_bali", 6),
    ("vo", "08_narrator", 8),
    ("vo", "09_vasuki", 36),         # Vasuki rises out of the milk (water + hiss in clear air) before he speaks
    ("beat", "headTake", 6, 42),     # Vishnu takes the head, devtas line up behind him
    ("vo", "10_swarbhanu", 0),
    ("vo", "01b", 3),                # the cold-open shout returns in context
    ("vo", "11_vishnu", 14),
    ("vo", "12_swarbhanu", 22),      # Vishnu lets go and walks to the tail
    ("vo", "13_narrator", 8),
    ("beat", "sink", 0, 52),         # crack, tilt, the mountain goes under
    ("vo", "14_indra", 0),
    ("vo", "15_swarbhanu", 4),
    ("vo", "16_narrator", 10),
    ("beat", "freeze", 8, 12),       # cliffhanger freeze
    ("beat", "endIn", 0, 12),        # end card settles before the spoken close
    ("vo", "17_narrator", 0),
    ("vo", "jyotiq_signoff", 10),
    ("beat", "hold", 0, 40),
]
SRC = {"01b": "01_swarbhanu"}
MISSES = []


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def ms(f):
    return int(round(f * 1000 / FPS))


def vo_frames():
    t = (ROOT / "src/Jyotiq/manthan/ep2/voData.ts").read_text()
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
        # cold open
        "grab": s("01_swarbhanu"),
        "pullBack": s("02_narrator"),
        "dissolve": word_cue(L, "02_narrator", "सिर्फ"),
        "headRise": word_cue(L, "02_narrator", "बन"),
        "rahuStamp": word_cue(L, "02_narrator", "राहू"),
        "rahuSlam": e("02_narrator"),
        "titleHit": B["title"][0],
        # Bali's court
        "spears": s("03_narrator") + 24,
        "unarmed": word_cue(L, "03_narrator", "निहत"),
        "baliHalt": s("04_bali"),
        "indraBow": s("05_indra"),
        "amritShare": word_cue(L, "05_indra", "बांट"),
        "whisper": s("06_swarbhanu"),
        "trick": word_cue(L, "06_swarbhanu", "चाल"),
        "baliRise": s("07_bali"),
        "baliAccept": word_cue(L, "07_bali", "संधी"),
        "baliSeal": e("07_bali") + 1,
        # the truce and the uprooting
        "clasp": word_cue(L, "08_narrator", "संधी", lead=4),
        "uproot": word_cue(L, "08_narrator", "और"),
        "tear": word_cue(L, "08_narrator", "उखार"),
        "mandar": word_cue(L, "08_narrator", "मंदरा"),
        # Vasuki
        "vasukiRise": e("08_narrator") + 2,
        "vasukiName": s("09_vasuki") + 6,
        "coil": word_cue(L, "09_vasuki", "रस्सी"),
        "share": word_cue(L, "09_vasuki", "अम्रित"),
        "headTake": B["headTake"][0],
        # the head demand and Vishnu's smile
        "demand": s("10_swarbhanu"),
        "tail": word_cue(L, "10_swarbhanu", "पूच"),
        "noble": word_cue(L, "10_swarbhanu", "कुलीन"),
        "shout2": s("01b"),
        "rahuFlicker": s("01b") + 8,
        "smile": s("11_vishnu"),
        "letGo": e("11_vishnu") + 2,
        "eyesNarrow": s("12_swarbhanu"),
        "eyeOpen": s("12_swarbhanu") + 28,
        # churn, sink, cliffhanger
        "heave": s("13_narrator"),
        "crack": word_cue(L, "13_narrator", "तभी"),
        "crackHit": e("13_narrator"),
        "sink": B["sink"][0],
        "panic": s("14_indra"),
        "smirk": s("15_swarbhanu"),
        "smilePush": s("16_narrator"),
        "lightDive": word_cue(L, "16_narrator", "मुस्कुरा"),
        "freeze": B["freeze"][0],
        # spoken Jyotiq close
        "endCard": B["endIn"][0],
        "closeKundali": word_cue(L, "17_narrator", "कुंडली"),
        "closeHouse": word_cue(L, "17_narrator", "घर"),
        "signoff": s("jyotiq_signoff"),
        "offer": word_cue(L, "jyotiq_signoff", "पहला"),
        "brandChime": e("jyotiq_signoff") + 2,
    }
    scenes = {
        "cold": (0, B["title"][0]),
        "title": B["title"],
        "court": (s("03_narrator"), s("08_narrator")),
        "sandhi": (s("08_narrator"), cues["uproot"]),
        "uproot": (cues["uproot"], e("08_narrator")),
        "vasuki": (e("08_narrator"), B["headTake"][0]),
        "headTake": B["headTake"],
        "demand": (s("10_swarbhanu"), s("11_vishnu")),
        "smile": (s("11_vishnu"), s("12_swarbhanu")),
        "eyes": (s("12_swarbhanu"), s("13_narrator")),
        "churn": (s("13_narrator"), B["sink"][0]),
        "sink": (B["sink"][0], s("16_narrator")),
        "cliff": (s("16_narrator"), B["endIn"][0]),
        "end": (B["endIn"][0], total),
    }
    return L, B, scenes, cues, total


# Burned-in Hinglish captions, one entry per chunk: (line, start needle or None, text, who, gold words).
# A chunk starts where its needle is spoken and runs to the next chunk of the same line (or the
# line end + 6 frames). who: n narrator, s Swarbhanu, b Bali, i Indra, k Vasuki, v Vishnu.
# Lines 17 and the sign-off have no captions: the end card shows those words as they are spoken.
CAPTION_PLAN = [
    ("01_swarbhanu", None, "Sir hamara hoga!", "s", ["Sir"]),
    ("02_narrator", None, "Jis asur ne zid karke saanp ka sir maanga...", "n", ["sir"]),
    ("02_narrator", "एक", "...ek din woh khud...", "n", []),
    ("02_narrator", "सिर्फ", "...sirf ek sir bankar reh gaya.", "n", ["sir"]),
    ("02_narrator", "राहू", "Rahu.", "n", ["Rahu."]),
    ("03_narrator", None, "Swarg haar chuke devta...", "n", []),
    ("03_narrator", "आज", "...aaj apne shatru ke darbaar mein khade the.", "n", ["shatru"]),
    ("03_narrator", "निहत", "Nihatthe.", "n", ["Nihatthe."]),
    ("04_bali", None, "Ruko!", "b", ["Ruko!"]),
    ("04_bali", "निहत्थे", "Nihatthe shatru par asur vaar nahi karte.", "b", []),
    ("05_indra", None, "Yuddh se kisi ko amrit nahi milega, Bali.", "i", ["amrit"]),
    ("05_indra", "आओ", "Aao, milkar Ksheer Sagar mathein...", "i", ["Ksheer", "Sagar"]),
    ("05_indra", "और", "...aur amrit baant lein.", "i", ["amrit"]),
    ("06_swarbhanu", None, "Maharaj... kal tak jo hamare shatru the...", "s", []),
    ("06_swarbhanu", "आज", "...aaj amrit baantenge?", "s", ["amrit"]),
    ("06_swarbhanu", "जरूर", "Zaroor koi chaal hai.", "s", ["chaal"]),
    ("07_bali", None, "Chaal ho, toh bhi...", "b", []),
    ("07_bali", "अमरित", "...amrit is jokhim ke laayak hai.", "b", ["amrit"]),
    ("07_bali", "संधी", "Sandhi sweekar hai!", "b", ["Sandhi"]),
    ("08_narrator", None, "Shastra kehte hain...", "n", []),
    ("08_narrator", "लक्ष", "...lakshya bada ho, toh shatru se bhi sandhi ki jaati hai.", "n", ["sandhi"]),
    ("08_narrator", "और", "Aur dono ne milkar jad se ukhaad diya...", "n", []),
    ("08_narrator", "मंदरा", "...Mandarachal Parvat!", "n", ["Mandarachal", "Parvat!"]),
    ("09_vasuki", None, "Main Naagraj Vasuki...", "k", ["Vasuki..."]),
    ("09_vasuki", "तुम्हारी", "...tumhari rassi banunga.", "k", ["rassi"]),
    ("09_vasuki", "पर", "Par amrit mein mera bhi bhaag hoga.", "k", ["amrit"]),
    ("10_swarbhanu", None, "Ruko! Sir devta pakdenge...", "s", ["Sir"]),
    ("10_swarbhanu", "और", "...aur ashubh poonchh asur?", "s", ["poonchh"]),
    ("10_swarbhanu", "हम", "Hum kuleen hain, Vedon ke gyaata hain!", "s", []),
    ("01b", None, "Sir hamara hoga!", "s", ["Sir"]),
    ("11_vishnu", None, "Jaisi tumhari ichchha.", "v", ["ichchha."]),
    ("12_swarbhanu", None, "Woh... muskuraya kyun?", "s", ["muskuraya"]),
    ("13_narrator", None, "Manthan shuru hua...", "n", ["Manthan"]),
    ("13_narrator", "और", "...aur tabhi—", "n", []),
    ("14_indra", None, "Parvat doob raha hai!", "i", ["doob"]),
    ("15_swarbhanu", None, "Tumhare Vishnu ki yojana...", "s", ["Vishnu"]),
    ("15_swarbhanu", "डूब", "...doob rahi hai, Indra.", "s", ["doob"]),
    ("16_narrator", None, "Par Vishnu...", "n", ["Vishnu..."]),
    ("16_narrator", "अब", "...ab bhi muskura rahe the.", "n", ["muskura"]),
]


def build_caps(L):
    by_line = {}
    for item in CAPTION_PLAN:
        by_line.setdefault(item[0], []).append(item)
    caps = []
    for key, items in by_line.items():
        a, b = L[key]
        starts = [a if nd is None else word_cue(L, key, nd, lead=2) for (_, nd, _, _, _) in items]
        for j, (_, _, text, who, hi) in enumerate(items):
            to = starts[j + 1] if j + 1 < len(items) else b + 6
            if to <= starts[j]:
                MISSES.append(f"caption order {key}:{text[:12]}")
            caps.append((starts[j], to, text, who, hi))
    return sorted(caps)


def write_timing(L, B, scenes, cues, total, caps=()):
    out = [
        "// Generated by scripts/manthan_ep2_audio.py - edit timings THERE so picture and sound stay in sync.",
        f"export const FPS = {FPS};",
        f"export const TOTAL = {total};",
        "export type Range = readonly [number, number];",
        "/** Dialogue take -> [start, end) frames on the reel clock. 01b = take 01 played again. */",
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
    out += [
        'export type Cap = { from: number; to: number; text: string; who: "n" | "s" | "b" | "i" | "k" | "v"; hi: string[] };',
        "export const CAPS: Cap[] = [",
    ]
    out += [
        f'  {{ from: {a}, to: {b}, text: {json.dumps(t, ensure_ascii=False)}, who: "{w}", hi: {json.dumps(hi, ensure_ascii=False)} }},'
        for a, b, t, w, hi in caps
    ]
    out += ["];"]
    TS.parent.mkdir(parents=True, exist_ok=True)
    TS.write_text("\n".join(out) + "\n")


# ------------------------------------------------------------------------------------ mix
SWARBHANU = {"01_swarbhanu", "01b", "06_swarbhanu", "10_swarbhanu", "12_swarbhanu", "15_swarbhanu"}
NARRATOR = {"02_narrator", "03_narrator", "08_narrator", "13_narrator", "16_narrator", "17_narrator", "jyotiq_signoff"}
COURT = {"04_bali", "05_indra", "07_bali"}  # lines spoken inside Bali's hall

DRONE = (
    "0.30*sin(2*PI*110*t)*(0.75+0.25*sin(2*PI*0.21*t))"
    "+0.18*sin(2*PI*165*t)*(0.7+0.3*sin(2*PI*0.17*t+1))"
    "+0.14*sin(2*PI*220*t)*(0.6+0.4*sin(2*PI*0.29*t+2))"
    "+0.07*sin(2*PI*330.6*t)*(0.5+0.5*sin(2*PI*0.37*t))"
    "+0.05*sin(2*PI*440.4*t)*(0.5+0.5*sin(2*PI*0.43*t+0.5))"
    "+0.12*sin(2*PI*55*t)"
)
BED_LEVEL = [("cold", 0.26), ("title", 0.30), ("court", 0.22), ("sandhi", 0.26), ("uproot", 0.30),
             ("vasuki", 0.26), ("headTake", 0.26), ("demand", 0.24), ("smile", 0.20), ("eyes", 0.22),
             ("churn", 0.30), ("sink", 0.32), ("cliff", 0.24), ("end", 0.18)]


def build_graph(L, scenes, c, total):
    T = total / FPS
    inputs, g, vo_labels, fx = [], [], [], []
    comp = "highpass=f=75,acompressor=threshold=0.12:ratio=2.5:attack=8:release=160:makeup=1.6"
    for i, (k, (a, _)) in enumerate(L.items()):
        inputs += ["-i", str(VO_DIR / f"{SRC.get(k, k)}.wav")]
        d = f"adelay={ms(a)}|{ms(a)}"
        if k == "09_vasuki":  # the serpent king: a pitched-down shadow under the dry voice, cave space
            g.append(f"[{i}:a]{comp},asplit=2[vkA][vkB]")
            g.append("[vkB]asetrate=42240,aresample=48000,atempo=1.13636,lowpass=f=2200,volume=0.32[vkL]")
            g.append(f"[vkA][vkL]amix=inputs=2:normalize=0,equalizer=f=120:t=q:w=1:g=2.5,aecho=0.8:0.6:110|230:0.26|0.14,{d}[v{i}]")
        else:
            space = ""
            if k == "11_vishnu":
                space = ",aecho=0.8:0.55:70|140:0.28|0.16"  # temple-like space for the divine voice
            elif k in COURT:
                space = ",aecho=0.8:0.4:60|120:0.15|0.08"  # Bali's stone hall
            elif k in SWARBHANU:
                space = ",equalizer=f=180:t=q:w=1.2:g=2.5"  # close, darker, intimate
            elif k in NARRATOR:
                space = ",equalizer=f=160:t=q:w=1:g=1.5"  # warm storyteller
            g.append(f"[{i}:a]{comp}{space},{d}[v{i}]")
        vo_labels.append(f"[v{i}]")
    n = len(L)
    g.append(f"{''.join(vo_labels)}amix=inputs={n}:normalize=0,apad=whole_dur={T},asplit=3[vo][vosc][vostem]")

    # SFX files: Episode 1's thunder/volcano/water and Episode 2's hiss/sink/rope
    files = [SFX1 / "sfx_thunder.mp3", SFX1 / "sfx_volcano.mp3", SFX1 / "sfx_water.mp3",
             SFX2 / "serpent_hiss.mp3", SFX2 / "mountain_sink.mp3", SFX2 / "army_rope.mp3"]
    idx = {}
    for j, p in enumerate(files):
        inputs += ["-i", str(p)]
        idx[p.stem] = n + j
    g.append(f"[{idx['sfx_thunder']}:a]asplit=2[thA][thB]")
    g.append(f"[{idx['sfx_water']}:a]asplit=2[waA][waB]")
    g.append(f"[{idx['serpent_hiss']}:a]asplit=4[hs1][hs2][hs4][hs5]")

    def clip(src, a, b, at_f, gain, fin, fout, label):
        dur = b - a
        g.append(
            f"[{src}]atrim={a}:{b},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,"
            f"afade=t=in:d={fin},afade=t=out:st={max(0.0, dur - fout):.3f}:d={fout},volume={gain},"
            f"adelay={ms(at_f)}|{ms(at_f)}[{label}]"
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

    # Ayush's ElevenLabs effects, peaks placed in the gaps between lines
    clip("thB", 12.8, 15.6, c["titleHit"] - 2, 0.42, 0.02, 1.2, "th1")             # soft roll under the title
    clip("thA", 0.0, 0.9, c["baliHalt"] - 16, 0.62, 0.01, 0.65, "th2")             # crack in the gap, then "रुको!"
    clip(f"{idx['sfx_volcano']}:a", 0.0, 7.0, c["uproot"] - 6, 0.5, 0.5, 2.5, "vol")   # the earth tears
    clip("waA", 3.0, 7.5, c["vasukiRise"] - 4, 0.6, 0.6, 2.0, "wa1")              # Vasuki rises; fades as he speaks
    clip("waB", 4.0, 10.0, c["sink"] - 6, 0.55, 0.3, 3.0, "wa2")                  # the mountain goes under
    clip(f"{idx['mountain_sink']}:a", 0.0, 5.0, c["crackHit"], 0.85, 0.02, 3.0, "msk")
    rope_at = L["12_swarbhanu"][1] + 4
    rope_len = round(min(8.0, (c["crackHit"] + 20 - rope_at) / FPS), 3)
    clip(f"{idx['army_rope']}:a", 0.0, rope_len, rope_at, 0.55, 0.4, 0.6, "rop")  # both sides heave
    hiss("hs1", L["01_swarbhanu"][1], 0.5, 0.8, 0.7, "h1")       # after the cold-open shout
    hiss("hs2", c["vasukiRise"] + 2, 0.6, 0.72, 0.7, "h2")       # Vasuki surfaces
    hiss("hs4", c["headTake"] + 6, 0.55, 0.8, 0.7, "h4")         # Vishnu grips the head
    hiss("hs5", L["12_swarbhanu"][1] + 1, 0.45, 0.95, 0.9, "h5")  # the eye opens, after the whisper

    # synthesized accents (same recipes as Episode 1)
    whoosh(c["pullBack"] - 8, 0.4, 0.8, "w1")
    shimmer(c["dissolve"], 0.08, 990, 3.0, "s1")
    whoosh(c["headRise"], 0.28, 1.2, "w2")
    boom(c["rahuSlam"], 0.6, label="b1")
    shimmer(c["rahuSlam"], 0.1, 880, 3.5, "s2")
    boom(c["titleHit"], 0.55, 38, 40, 1.8, "b2")
    whoosh(c["baliHalt"] + 18, 0.15, 0.5, "w3")
    boom(c["baliSeal"], 0.45, 40, 30, 2.4, "b3")
    boom(c["clasp"], 0.55, label="b4")
    shimmer(c["clasp"] + 6, 0.09, 1320, 3.0, "s3")
    boom(c["tear"], 0.7, 34, 30, 1.6, "b5")
    whoosh(c["vasukiName"], 0.3, 0.5, "w4")
    shimmer(c["headTake"], 0.1, 1046, 3.0, "s4")
    shimmer(c["rahuFlicker"], 0.06, 1560, 1.6, "s5")
    shimmer(c["smile"], 0.07, 880, 3.0, "s6")
    boom(c["crackHit"], 0.75, 30, 50, 1.4, "b6")
    shimmer(c["lightDive"], 0.12, 660, 4.0, "s7")
    whoosh(c["freeze"] - 10, 0.5, 0.45, "w5")
    boom(c["freeze"], 0.65, 36, 44, 1.5, "b7")
    shimmer(c["endCard"], 0.12, 1046, 4.0, "s8")
    shimmer(c["brandChime"], 0.14, 1320, 2.5, "s9")

    # bed: tanpura-like drone (Sa-Pa on A) + low air, level set per scene
    g.append(f"aevalsrc='{DRONE}|{DRONE}':s=48000:d={T},lowpass=f=1400,aecho=0.8:0.7:180|360:0.3|0.2[drn]")
    g.append(f"anoisesrc=color=brown:amplitude=0.5:d={T}:r=48000,lowpass=f=320,aformat=channel_layouts=stereo[air]")
    expr = "0.18"
    for name, v in reversed(BED_LEVEL):
        expr = f"if(lt(t,{scenes[name][1] / FPS:.3f}),{v},{expr})"
    g.append(
        f"[drn][air]amix=inputs=2:normalize=0:weights=1 0.55,volume='{expr}':eval=frame,"
        f"afade=t=in:d=0.25,afade=t=out:st={T - 1.6:.3f}:d=1.6[bed]"
    )

    # buses: bed + SFX get a fixed -16 dB dip under every line (0.15 s in, 0.35 s out),
    # then a light sidechain on top, so soft lines are protected as well as loud ones
    duck = 10 ** (-16 / 20)
    win = "+".join(f"clip((t-{a / FPS - 0.15:.3f})/0.15,0,1)*clip(({b / FPS + 0.35:.3f}-t)/0.35,0,1)" for a, b in L.values())
    g.append(
        f"[bed]{''.join(fx)}amix=inputs={len(fx) + 1}:normalize=0,apad=whole_dur={T},"
        f"volume='1-{1 - duck:.4f}*min(1,{win})':eval=frame[bus]"
    )
    g.append("[bus][vosc]sidechaincompress=threshold=0.02:ratio=4:attack=8:release=300:knee=3:makeup=1,asplit=2[duck][duckstem]")
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
    gaps = sorted((rms_db(vo_stem, a, b) - rms_db(bus_stem, a, b), k) for k, (a, b) in L.items())
    print("dialogue minus bed (dB), lowest first:", ", ".join(f"{k} {s:.1f}" for s, k in gaps))


def main():
    frames = vo_frames()
    L, B, scenes, cues, total = build_timing(frames)
    write_timing(L, B, scenes, cues, total, build_caps(L))
    for k, (a, b) in L.items():
        print(f"{k:16s} {a:5d}-{b:5d}  ({a / FPS:6.2f}-{b / FPS:6.2f}s)")
    print("beats:", {k: (round(a / FPS, 2), round(b / FPS, 2)) for k, (a, b) in B.items()})
    print(f"TOTAL {total} frames = {total / FPS:.2f}s;  word cues missed: {MISSES or 'none'}")
    if "--timing-only" in sys.argv:
        return
    mix(L, scenes, cues, total)


if __name__ == "__main__":
    main()
