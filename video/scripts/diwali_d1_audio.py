#!/usr/bin/env python3
"""Diwali Day 1 (पाँच दीये · धनतेरस) - timeline + audio mix (single source of truth).

Adapted from manthan_ep7_audio.py (same method):
1. Lays the trimmed Day 1 takes end to end in script order (with the silent picture beats in ORDER), finds
   word-level cue points from the local Whisper transcripts (diwali-d1/audio/vo/<line>.json, copied there by
   diwali-d1/intake.py) and writes src/Jyotiq/diwali/d1/timing.ts, so picture and sound share one clock.
2. Mixes dialogue, the synthesized SFX, the score and the Kaal time layer (stems from scripts/diwali_d1_score.py)
   into public/jyotiq/diwali/d1/mix.wav, calibrating over up to 4 passes so every line sits at least 11.5 LU
   (median 13) above the bed; master -14 LUFS, true peak at or below -1.5 dBFS.

Hard cap: under 60 s (1800 frames); aim for 58.5 s (1755) or less.
ffmpeg only (no numpy on this Mac). Run with --timing-only to skip the mix.
Cue words accept several spellings because Whisper spells Hindi loosely (धन्तेरस, धन्वन्तरी, जोतिश, क्यूं, साविर);
the first spelling that hits wins, and every miss is printed.
Prerequisite: scripts/diwali_d1_vo_prep.py (trimmed takes, trim.json, voData.ts).
Usage: /usr/local/bin/python3 /Users/ayushrajput/.kiro/crew/workspace/video/scripts/diwali_d1_audio.py [--timing-only]
"""
import array
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path("/Users/ayushrajput/.kiro/crew/workspace/video")
EP = Path("/Users/ayushrajput/.kiro/crew/workspace/diwali-d1")
VO_DIR = ROOT / "public/jyotiq/diwali/d1/vo"
STT = EP / "audio/vo"  # intake.py copies each chosen take's Whisper JSON next to it as <line>.json
TS = ROOT / "src/Jyotiq/diwali/d1/timing.ts"
MIX_DIR = ROOT / "public/jyotiq/diwali/d1"
FPS = 30
CAP_FRAMES = 1800  # 60.0 s
AIM_FRAMES = 1755  # 58.5 s

# Script order. ("vo", key, gap_before) places a take; ("beat", key, gap_before, length) holds picture with
# no dialogue. Scene names match the Day 1 scene components (PLAN.md, Scenes).
ORDER = [
    ("vo", "01_narrator", 4),        # hook: the jeweller's counter, poll chips (lit from frame 0)
    ("beat", "title", 4, 14),        # the coin's glint dissolves into the Manthan sea; title, five unlit diyas
    ("vo", "02_narrator", 2),        # the five diyas, Lakshmi's lotus over diya 3, '?' over diya 1
    ("vo", "03_narrator", 5),        # the sea parts, Dhanvantari rises with the amrit kalash
    ("vo", "04_narrator", 5),        # match cut: the amrit kalash becomes the brass kalash at the market stall
    ("vo", "05_dhanvantari", 5),     # Dhanvantari close-up: 'पहला सुख, निरोगी काया'
    ("vo", "06_narrator", 5),        # whip through the market, the health montage, diya 1 on 'सेहत'
    ("beat", "ignite", 0, 15),       # diya 1 ignites, arrow to diya 3; the end card forms
    ("vo", "07_narrator", 3),        # the kundali: सू glows on 'सूर्य'
    ("vo", "08_narrator", 5),        # the phone with the real Jyotiq recording, the greeting
    ("vo", "jyotiq_signoff", 6),     # the Jyotiq block
    ("beat", "hold", 0, 14),
]
MISSES = []


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def vo_frames():
    t = (ROOT / "src/Jyotiq/diwali/d1/voData.ts").read_text()
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
        else:
            n = item[3]
            beats[key] = (t, t + n)
        t += n
    return lines, beats, t


def words(stem):
    """Whisper words for one take: [text, start_s, end_s] on the untrimmed file's clock."""
    path = STT / f"{stem}.json"
    if not path.exists():  # the reused sign-off was transcribed in a Manthan episode
        olds = sorted(Path("/Users/ayushrajput/.kiro/crew/workspace").glob(f"manthan-ep*/audio/stt/{stem}.wav.json"))
        if not olds:
            MISSES.append(f"{stem}:<no transcript>")
            return []
        path = olds[-1]
    data = json.loads(path.read_text())
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


def trim_info():
    path = VO_DIR / "trim.json"
    return json.loads(path.read_text()) if path.exists() else {}


TRIM = trim_info()


def to_trimmed(stem, t):
    """Map a time in the untrimmed take onto the trimmed WAV (start trim and shortened pauses)."""
    info = TRIM.get(stem, {"a": 0.0, "cuts": []})
    rel = t - info["a"]
    shift = sum(min(y, rel) - x for x, y in info["cuts"] if rel > x)
    return max(0.0, rel - shift)


def word_cue(lines, key, needles, nth=0, lead=0):
    """Absolute frame where the first matching spelling in `needles` starts in line `key`.
    nth picks the match (negative counts from the end); lead moves the cue that many frames early."""
    ws = words(key)
    for needle in needles:
        hits = [w for w in ws if needle in w[0]]
        if hits and -len(hits) <= nth < len(hits):
            return lines[key][0] + int(round(to_trimmed(key, hits[nth][1]) * FPS)) - lead
    MISSES.append(f"{key}:{'/'.join(needles)}")
    return lines[key][0]


DHANTERAS = ["धनतेरस", "धन्तेरस", "तेरस"]
SURYA = ["सूर्य", "सूर्या", "सुर्य", "सूरज"]
KUNDALI = ["कुंडली", "कुण्डली", "कुंडलि", "कुंडली"]


def build_timing(frames):
    L, B, total = layout(frames)

    def s(k):
        return L[k][0]

    def e(k):
        return L[k][1]

    def w(key, needles, nth=0, lead=0):
        return word_cue(L, key, needles, nth, lead)

    cues = {
        # 01 hook: the hand reaches on 'खरीदेंगे', the glint grows on 'सागर', the strike on the second 'सोना'
        "kharid01": w("01_narrator", ["खरीद"]),
        "cap01b": w("01_narrator", ["पर"]),
        "sagar01": w("01_narrator", ["सागर", "साग"]),
        "cap01c": w("01_narrator", ["वो"]),
        "strike": w("01_narrator", ["सोना"], nth=1, lead=2),
        "nahi": w("01_narrator", ["नहीं", "नही"]),
        "dissolve": B["title"][0] - 6,
        "titleHit": B["title"][0] + 4,
        # 02 the diyas slide in on 'पाँच', the thread on 'क्रम', the lotus on 'लक्ष्मी', diya 1 and the '?'
        "paanch": w("02_narrator", ["पांच", "पाँच", "पाच"]),
        "kram": w("02_narrator", ["क्रम", "कर्म"]),
        "cap02b": w("02_narrator", ["और"]),
        "lakshmi": w("02_narrator", ["लक्ष्मी", "लक्षमी", "लक्ष", "लछमी"]),
        "dhanteras02": w("02_narrator", DHANTERAS),
        "kyon": w("02_narrator", ["क्यों", "क्यूं", "क्यूँ", "क्यो"]),
        # 03 the sea parts on 'सागर', he rises on 'प्रकट', name card on 'धन्वंतरि', chip on 'वैद्य', kalash flare
        "manthan03": w("03_narrator", ["मंथन", "मन्थन", "मंतन"]),
        "sagar03": w("03_narrator", ["सागर", "साविर", "साग", "सावि"]),
        "cap03b": w("03_narrator", ["प्रकट", "प्रगट"]),
        "prakat": w("03_narrator", ["प्रकट", "प्रगट"]),
        "dhanvantari": w("03_narrator", ["धन्वंतरि", "धन्वन्तरी", "धन्वंतरी", "धन्वन्तरि", "धन्व", "धनवं"]),
        "cap03c": w("03_narrator", ["देवताओं", "देवता"]),
        "vaidya": w("03_narrator", ["वैद्य", "वैद", "वैध"]),
        "amrit03": w("03_narrator", ["अमृत", "अम्रित", "अमरित", "अमृ"]),
        "kalash03": w("03_narrator", ["कलश"], nth=-1),
        # 04 the brass kalash rises on 'बर्तन', the chip on 'याद'
        "bartan": w("04_narrator", ["बर्तन", "बरतन"]),
        "parampara": w("04_narrator", ["परंपरा", "परम्परा", "परमपरा"]),
        "cap04b": w("04_narrator", ["उसी"]),
        "kalash04": w("04_narrator", ["कलश"]),
        "yaad": w("04_narrator", ["याद"]),
        # 05 Dhanvantari's words build with his voice
        "pehla": w("05_dhanvantari", ["पहला", "पहले"]),
        "sukh": w("05_dhanvantari", ["सुख", "सुक"]),
        "nirogi": w("05_dhanvantari", ["निरोगी", "निरोग"]),
        "kaya": w("05_dhanvantari", ["काया"]),
        "cap05b": w("05_dhanvantari", ["बाकी", "बाक़ी", "बाकि"]),
        "baad": w("05_dhanvantari", ["बाद"]),
        # 06 'जो चाहें खरीदिए' whips through the market; the health montage from 'पर'; diya 1 on 'सेहत'
        "jo06": w("06_narrator", ["जो"]),
        "kharidiye": w("06_narrator", ["खरी", "खरीदिए", "खरीदिये"]),
        "cap06b": w("06_narrator", ["पर"]),
        "nivesh": w("06_narrator", ["निवेश", "निवेस"]),
        "apni06": w("06_narrator", ["अपनी"]),
        "sehat06": w("06_narrator", ["सेहत", "सेहद"]),
        "ignite": B["ignite"][0],
        # 07 the kundali: सू glows on 'सूर्य', the '?' and ray pulse on 'बलवान'
        "jyotish07": w("07_narrator", ["ज्योतिष", "जोतिश", "ज्योतिश", "जोतिष"]),
        "karak": w("07_narrator", ["कारक"]),
        "surya07": w("07_narrator", SURYA),
        "cap07b": w("07_narrator", ["आपकी", "आपके"]),
        "kundali07": w("07_narrator", KUNDALI),
        "surya07b": w("07_narrator", SURYA, nth=-1),
        "balwan": w("07_narrator", ["बलवान", "बलवाण", "बलवा"]),
        # 08 the phone slides in on 'कुंडली', the chip on 'फ़्री', the greeting on 'धनतेरस'
        "kundali08": w("08_narrator", KUNDALI),
        "jyotiq08": w("08_narrator", ["ज्योतिक", "जोतिक", "ज्योतिक़", "ज्योतिष"]),
        "free08": w("08_narrator", ["फ्री", "फ़्री", "फ्रि"]),
        "cap08b": w("08_narrator", DHANTERAS),
        "shubh": w("08_narrator", ["शुभ", "शुक", "हार्दिक"]),
        # the close
        "signoff": s("jyotiq_signoff"),
        "offer": w("jyotiq_signoff", ["पहला"]),
        "brandChime": e("jyotiq_signoff") + 2,
    }
    scenes = {
        "hook": (0, B["title"][0]),
        "title": (B["title"][0], s("02_narrator")),
        "diyas": (s("02_narrator"), s("03_narrator") - 3),
        "rise": (s("03_narrator") - 3, s("04_narrator") - 3),
        "market": (s("04_narrator") - 3, s("05_dhanvantari") - 3),
        "words": (s("05_dhanvantari") - 3, s("06_narrator") - 2),
        "health": (s("06_narrator") - 2, B["ignite"][1]),
        "kundali": (B["ignite"][1], s("08_narrator") - 3),
        "app": (s("08_narrator") - 3, s("jyotiq_signoff")),
        "end": (s("jyotiq_signoff"), total),
    }
    return L, B, scenes, cues, total


def write_timing(L, B, scenes, cues, total):
    out = [
        "// Generated by scripts/diwali_d1_audio.py - edit timings THERE so picture and sound stay in sync.",
        f"export const FPS = {FPS};",
        f"export const TOTAL = {total};",
        "export type Range = readonly [number, number];",
        "/** Dialogue take -> [start, end) frames on the reel clock. */",
        "export const LINES: Record<string, Range> = {",
    ]
    out += [f'  "{k}": [{a}, {b}],' for k, (a, b) in L.items()]
    out += ["};", "/** Silent picture beats. */", "export const BEATS: Record<string, Range> = {"]
    out += [f"  {k}: [{a}, {b}]," for k, (a, b) in B.items()]
    out += ["};", "export const SCENES: Record<string, Range> = {"]
    out += [f"  {k}: [{a}, {b}]," for k, (a, b) in scenes.items()]
    out += ["};", "export const CUES: Record<string, number> = {"]
    out += [f"  {k}: {v}," for k, v in cues.items()]
    out += ["};"]
    TS.parent.mkdir(parents=True, exist_ok=True)
    TS.write_text("\n".join(out) + "\n")


# ------------------------------------------------------------------------------------ mix
STEMS = EP / "audio/stems"
NARRATOR = {"01_narrator", "02_narrator", "03_narrator", "04_narrator", "06_narrator", "07_narrator",
            "08_narrator", "jyotiq_signoff"}
DHAN = {"05_dhanvantari"}
# Every take is first set to a K-weighted loudness target so no voice towers over another (PLAN.md:
# narrator -18; Dhanvantari -18, warm and close with only a quiet send to the shared hall, no echo or slapback).
TARGET_LUFS = -18.0
LINE_TARGET = {"05_dhanvantari": -18.0}
DUCK_DB = -7.0      # fixed dip of score + SFX under every line
MIN_GAP = 11.5      # every line must sit at least this many LU above the bed
GOAL_GAP = 13.0     # the bed level is calibrated so the median line sits this far above it
HALL_DB = -10.0     # narrator 'Kaal hall' send (the IR itself is about -6 dB)
DHAN_SEND_DB = -6.0  # Dhanvantari's send to the same hall, below the narrator's (intimate, not booming)
HUSH = {}           # no silent beat needs the sustained layers pulled down further this time
TRUE_PEAK_MAX = -1.5
BED = {"gain": 0.5}
LEVEL_FIX, POST_FIX, EXTRA_DUCK = {}, {}, {}
# per-scene levels of the two sustained layers (pad, santoor, bells, drums and sfx carry their own dynamics)
TANPURA_LV = {"hook": 0.35, "title": 0.55, "diyas": 0.45, "rise": 0.45, "market": 0.35, "words": 0.5,
              "health": 0.4, "kundali": 0.5, "app": 0.45, "end": 0.5}
KAAL_LV = {"hook": 0.45, "title": 0.7, "diyas": 0.4, "rise": 0.55, "market": 0.3, "words": 0.35,
           "health": 0.3, "kundali": 0.45, "app": 0.35, "end": 0.4}


def ms(f):
    return int(round(f * 1000 / FPS))


def level_expr(levels, scenes):
    """Per-scene level as a smooth expression: 0.3 s linear ramps at the scene boundaries."""
    names = list(scenes)
    out = f"{levels[names[0]]}"
    for a, b in zip(names, names[1:]):
        d = levels[b] - levels[a]
        if abs(d) > 1e-6:
            out += f"{d:+.3f}*clip((t-{scenes[b][0] / FPS - 0.15:.3f})/0.3,0,1)"
    return out


def hush_expr(B):
    """The extra dip (0..1) of the sustained layers inside the HUSH beats."""
    terms = []
    for k, db in HUSH.items():
        a, b = B[k]
        d = 1 - 10 ** (db / 20)
        terms.append(f"{d:.4f}*clip((t-{a / FPS - 0.15:.3f})/0.15,0,1)*clip(({b / FPS + 0.3:.3f}-t)/0.3,0,1)")
    return "+".join(terms) if terms else "0"


def peak_time(path, sr=16000):
    """Seconds into `path` of its loudest sample (where a hit lands), from a mono 16 kHz decode."""
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-ac", "1", "-ar", str(sr), "-f", "s16le", "-"],
                         capture_output=True).stdout
    a = array.array("h", raw[: len(raw) // 2 * 2])
    if not a:
        return 0.0
    return max(range(len(a)), key=lambda k: abs(a[k])) / sr


def build_graph(L, B, scenes, c, total):
    T = total / FPS
    inputs, g, vo, send_n, fx = [], [], [], [], []
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
        if k in NARRATOR:  # warm storyteller (as in Manthan) + a send to the Kaal hall
            g.append(f"[{i}:a]{lcomp},equalizer=f=160:t=q:w=1:g=1.5,{d},asplit=2[v{i}][n{i}]")
            vo.append(f"[v{i}]")
            send_n.append(f"[n{i}]")
        else:  # Dhanvantari: a kind healer close to the ear: warmth, a softer top, a quieter send to the hall
            g.append(f"[{i}:a]{lcomp},equalizer=f=180:t=q:w=1:g=2.0,equalizer=f=3200:t=q:w=1.2:g=-0.8,"
                     f"highshelf=f=9000:g=-1.5,{d},asplit=2[v{i}][m{i}]")
            g.append(f"[m{i}]volume={DHAN_SEND_DB}dB[n{i}]")
            vo.append(f"[v{i}]")
            send_n.append(f"[n{i}]")

    # the Kaal hall: one long, high-passed reverb shared by all lines (diwali_d1_score.py writes the IR)
    ir = inp(STEMS / "ir_narrator.wav")
    g.append(f"{''.join(send_n)}amix=inputs={len(send_n)}:normalize=0,highpass=f=250,lowpass=f=7000,apad=pad_dur=4[ns]")
    g.append(f"[ns][{ir}:a]afir=irnorm=-1:irgain=1,volume={HALL_DB}dB[hallN]")
    vo.append("[hallN]")
    g.append(f"{''.join(vo)}amix=inputs={len(vo)}:normalize=0,apad=whole_dur={T},atrim=0:{T},asplit=3[vo][vosc][vostem]")

    def boom(at_f, amp, f0=42, f1=34, dec=2.6, label="b"):
        wv = f"{amp}*sin(2*PI*({f0}+{f1}*exp(-t*9))*t)*exp(-t*{dec})"
        g.append(f"aevalsrc='{wv}|{wv}':s=48000:d=2.4,lowpass=f=180,adelay={ms(at_f)}|{ms(at_f)}[{label}]")
        fx.append(f"[{label}]")

    # low-end weight on the big moments, kept gentle: this is a festival reel, not a battle
    boom(c["titleHit"], 0.42, 38, 40, 1.8, "b1")      # the Manthan sea and the title
    boom(c["dhanvantari"], 0.38, 36, 40, 2.2, "b2")   # his name lands
    boom(c["ignite"] + 2, 0.26, 44, 30, 1.6, "b3")    # diya 1 lights

    # the generated score, SFX and the Kaal time layer (scripts/diwali_d1_score.py)
    names = ("tanpura", "pad", "santoor", "bells", "drums", "sfx", "kaal", "kaal_fx")
    st = {n: inp(STEMS / f"{n}.wav") for n in names}
    hush = hush_expr(B)
    g.append(f"[{st['tanpura']}:a]volume='({level_expr(TANPURA_LV, scenes)})*(1-({hush}))':eval=frame[tp]")
    g.append(f"[{st['kaal']}:a]volume='({level_expr(KAAL_LV, scenes)})*(1-({hush}))':eval=frame[kl]")
    g.append(
        f"[{st['pad']}:a][{st['santoor']}:a][{st['bells']}:a][{st['drums']}:a][{st['sfx']}:a][{st['kaal_fx']}:a][tp][kl]"
        f"amix=inputs=8:normalize=0:weights=1 0.9 0.8 0.9 1 1 1 1,atrim=0:{T}[bed0]"
    )
    # bed + SFX dip by DUCK_DB under every line (0.2 s in, 0.4 s out), deeper where a line needs it,
    # then a light sidechain on top so no SFX transient covers a word
    win = None
    for k, (a, b) in L.items():
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
    """Render the mix: the pre-master and the two measurement stems stay in diwali-d1/audio/stems (outside the
    Remotion bundle); only the mastered mix.wav goes to public/."""
    MIX_DIR.mkdir(parents=True, exist_ok=True)
    pre, vo_stem, bus_stem = (STEMS / x for x in ("pre.wav", "stem_vo.wav", "stem_bus.wav"))
    out = MIX_DIR / "mix.wav"
    inputs, graph = build_graph(L, B, scenes, cues, total)
    gp = STEMS / "mix_graph.txt"
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
             f"volume={gain:.2f}dB,alimiter=limit=0.78:attack=4:release=80:level=0",
             "-ar", "48000", "-c:a", "pcm_s16le", str(out)])
    if r.returncode:
        print(r.stderr[-2000:])
        raise SystemExit(1)
    i, lra, tp = measure(out)
    warn = "" if tp is None or tp <= TRUE_PEAK_MAX else f"  TRUE PEAK OVER {TRUE_PEAK_MAX} dBFS"
    print(f"[{tag}] wrote {out.name}  I={i} LUFS  LRA={lra}  TP={tp} dBFS  (static gain {gain:+.2f} dB, bed gain {BED['gain']:.3f}){warn}", flush=True)
    vo_l = {k: lufs_seg(vo_stem, a, b) for k, (a, b) in L.items()}
    gaps = {k: vo_l[k] - lufs_seg(bus_stem, a, b) for k, (a, b) in L.items()}
    print(f"[{tag}] dialogue LUFS:", ", ".join(f"{k} {v:.1f}" for k, v in vo_l.items()), flush=True)
    print(f"[{tag}] dialogue minus bed (LU), lowest first:", ", ".join(f"{k} {v:.1f}" for k, v in sorted(gaps.items(), key=lambda kv: kv[1])), flush=True)
    beds = {n: lufs_seg(bus_stem, a, b) for n, (a, b) in B.items()}
    print(f"[{tag}] bed in the silent beats (LUFS, pre-master):", ", ".join(f"{k} {v:.1f}" for k, v in beds.items()), flush=True)
    return vo_l, gaps


def main():
    frames = vo_frames()
    missing = [item[1] for item in ORDER if item[0] == "vo" and item[1] not in frames]
    if missing:
        sys.exit(f"missing prepared takes {missing}: run scripts/diwali_d1_vo_prep.py first")
    L, B, scenes, cues, total = build_timing(frames)
    write_timing(L, B, scenes, cues, total)
    flag = "OVER THE 60 s CAP" if total >= CAP_FRAMES else ("over the 58.5 s aim" if total > AIM_FRAMES else "ok")
    print(f"TOTAL {total} frames = {total / FPS:.2f} s ({flag}; cap {CAP_FRAMES}, aim {AIM_FRAMES})")
    for k, (a, b) in L.items():
        print(f"  line  {k:16s} {a:5d}-{b:5d}  {(b - a) / FPS:5.2f} s")
    for k, (a, b) in scenes.items():
        print(f"  scene {k:16s} {a:5d}-{b:5d}  {(b - a) / FPS:5.2f} s")
    print("  cues: " + ", ".join(f"{k} {v}" for k, v in cues.items()))
    bad = [k for k, v in cues.items() if v < 0 or v > total]
    print("missing word cues:", MISSES or "none", "| out of range:", bad or "none", flush=True)
    if total >= CAP_FRAMES:
        print("OVER CAP: tighten the gaps and the beats first")
        sys.exit(1)
    if "--timing-only" in sys.argv:
        return
    STEMS.mkdir(parents=True, exist_ok=True)
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
