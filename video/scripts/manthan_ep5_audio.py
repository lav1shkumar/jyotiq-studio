#!/usr/bin/env python3
"""Manthan Ep5 LAKSHMI - timeline + audio mix (single source of truth).

Same method as manthan_ep4_audio.py:
1. Lays Episode 5's trimmed takes end to end in script order (with the silent picture beats in
   ORDER), finds word-level cue points from the local Whisper transcripts, and writes
   src/Jyotiq/manthan/ep5/timing.ts so picture and sound share one clock.
2. Mixes dialogue, SFX, the generated score and the Kaal time layer into
   public/jyotiq/manthan/ep5/mix.wav (added in the mix step).

Hard cap: the reel must stay under 60 s (1800 frames).
ffmpeg only (no numpy on this Mac). Run with --timing-only to skip the mix.
Cue words are matched against Whisper's own spelling (e.g. लक्षमी, विश्नु, तब for तप).
"""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path("/Users/ayushrajput/.kiro/crew/workspace/video")
EP5 = Path("/Users/ayushrajput/.kiro/crew/workspace/manthan-ep5")
VO_DIR = ROOT / "public/jyotiq/manthan/ep5/vo"
STT = EP5 / "audio/stt"
TS = ROOT / "src/Jyotiq/manthan/ep5/timing.ts"
MIX_DIR = ROOT / "public/jyotiq/manthan/ep5"
FPS = 30
CAP_FRAMES = 1800  # 60.0 s

# Script order. ("vo", key, gap_before) places a take; ("beat", key, gap_before, length) holds
# picture with no dialogue.
ORDER = [
    ("vo", "01_narrator", 8),        # hook: frame 0 is Episode 4's last story frame (lit); the line at 0.27 s
    ("beat", "title", 6, 40),        # मंथन · Episode 5 · लक्ष्मी, shimmer + bell
    ("vo", "02_narrator", 4),        # the sea gives its treasures; Kamadhenu goes to the rishis
    ("vo", "03_bali", 14),           # Uchchaihshravas bursts from a wave in this gap
    ("vo", "04_narrator", 10),       # Airavata to Indra, the Kaustubha gem to Vishnu
    ("vo", "05_narrator", 14),       # the sea parts and the lotus starts rising in this gap
    ("beat", "reveal", 0, 40),       # Lakshmi fully revealed, name card, Kaal echo on 'लक्ष्मी' (3 taps fit here)
    ("vo", "06_narrator", 0),        # she looks at everyone: tapas but anger, knowledge but attachment
    ("vo", "07_narrator", 10),       # 'और एक थे...' Vishnu, serene
    ("beat", "pause", 0, 12),        # echo on 'श्री विष्णु'; she walks to him
    ("vo", "08_narrator", 0),        # the varmala
    ("beat", "varmala", 0, 40),      # conch and bells, petals rain, the poll card is answered
    ("vo", "09_narrator", 4),        # the spoken Jyotiq close over the kundali
    ("vo", "jyotiq_signoff", 8),
    ("beat", "hold", 0, 24),
]
MISSES = []


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def vo_frames():
    t = (ROOT / "src/Jyotiq/manthan/ep5/voData.ts").read_text()
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
        # hook: the poll card's chips are struck in time with the line
        "devta": word_cue(L, "01_narrator", "देवता"),
        "strikeDevta": word_cue(L, "01_narrator", "नहीं", nth=0),
        "asur": word_cue(L, "01_narrator", "असुर"),
        "strikeAsur": word_cue(L, "01_narrator", "नहीं", nth=1),
        "kise": word_cue(L, "01_narrator", "किसे"),
        "titleHit": B["title"][0],
        # the treasures
        "sagar": word_cue(L, "02_narrator", "सागर"),
        "ratna": word_cue(L, "02_narrator", "रत्न"),
        "kamdhenu": word_cue(L, "02_narrator", "काम"),
        "rishi": word_cue(L, "02_narrator", "रिशि"),
        "horseBurst": s("03_bali") - 14,
        "ashva": word_cue(L, "03_bali", "अश्व"),
        "mera": word_cue(L, "03_bali", "मेरा"),
        "airavat": s("04_narrator"),
        "indra": word_cue(L, "04_narrator", "इंद्र"),
        "kaustubh": word_cue(L, "04_narrator", "कौस्तु"),
        "vishnuGem": word_cue(L, "04_narrator", "विश्नु"),
        # Lakshmi rises
        "lotusRise": s("05_narrator") - 14,
        "kamal": word_cue(L, "05_narrator", "कमल"),
        "prakat": word_cue(L, "05_narrator", "प्रकट"),
        "lakshmi": word_cue(L, "05_narrator", "लक्ष"),
        "reveal": B["reveal"][0],
        # her choice
        "dekha": word_cue(L, "06_narrator", "देखा"),
        "tap": word_cue(L, "06_narrator", "तब"),
        "krodh": word_cue(L, "06_narrator", "क्रोध"),
        "kisi2": word_cue(L, "06_narrator", "किसी", nth=1),
        "gyan": word_cue(L, "06_narrator", "ग्यान"),
        "moh": word_cue(L, "06_narrator", "मोह"),
        "ekThe": word_cue(L, "07_narrator", "एक"),
        "chah": word_cue(L, "07_narrator", "चाह"),
        "shriVishnu": word_cue(L, "07_narrator", "श्री"),
        "walk": B["pause"][0],
        "varmala": word_cue(L, "08_narrator", "वर"),
        "gale": word_cue(L, "08_narrator", "गले"),
        "daal": word_cue(L, "08_narrator", "डाल"),
        "conch": B["varmala"][0],
        "answer": B["varmala"][0] + 6,
        # spoken Jyotiq close
        "endCard": B["varmala"][1] - 10,
        "jyotish": s("09_narrator"),
        "shukra": word_cue(L, "09_narrator", "शुक्र"),
        "sukh": word_cue(L, "09_narrator", "सुख"),
        "samriddhi": word_cue(L, "09_narrator", "सम्रि"),
        "kundali": word_cue(L, "09_narrator", "कुंडली"),
        "shukra2": word_cue(L, "09_narrator", "शुक्र", nth=1),
        "deta": word_cue(L, "09_narrator", "देता"),
        "signoff": s("jyotiq_signoff"),
        "offer": word_cue(L, "jyotiq_signoff", "पहला"),
        "brandChime": e("jyotiq_signoff") + 2,
        # caption split points (the next part of a caption starts here)
        "cap01b": word_cue(L, "01_narrator", "असुर"),
        "cap01c": word_cue(L, "01_narrator", "तो"),
        "cap02b": word_cue(L, "02_narrator", "काम"),
        "cap04b": word_cue(L, "04_narrator", "और"),
        "cap06b": word_cue(L, "06_narrator", "किसी", nth=0),
        "cap06c": word_cue(L, "06_narrator", "किसी", nth=1),
        "cap07b": word_cue(L, "07_narrator", "श्री"),
        "cap09b": word_cue(L, "09_narrator", "आपकी"),
    }
    scenes = {
        "hook": (0, B["title"][0]),
        "title": B["title"],
        "ratna": (B["title"][1], s("03_bali") - 14),
        "horse": (s("03_bali") - 14, s("04_narrator") - 4),
        "airavata": (s("04_narrator") - 4, cues["kaustubh"] - 6),
        "kaustubha": (cues["kaustubh"] - 6, s("05_narrator") - 14),
        "lotus": (s("05_narrator") - 14, B["reveal"][1]),
        "choice": (B["reveal"][1], s("07_narrator") - 10),
        "vishnu": (s("07_narrator") - 10, s("08_narrator")),
        "varmala": (s("08_narrator"), B["varmala"][1] - 10),
        "end": (B["varmala"][1] - 10, total),
    }
    return L, B, scenes, cues, total


def write_timing(L, B, scenes, cues, total):
    out = [
        "// Generated by scripts/manthan_ep5_audio.py - edit timings THERE so picture and sound stay in sync.",
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
STEMS = EP5 / "audio/stems"
SFX5 = EP5 / "audio/sfx"
NARRATOR = {"01_narrator", "02_narrator", "04_narrator", "05_narrator", "06_narrator", "07_narrator",
            "08_narrator", "09_narrator", "jyotiq_signoff"}
# Every take is first set to a K-weighted loudness target so no voice towers over another; Bali's
# proud claim sits a little up.
TARGET_LUFS = -18.0
LINE_TARGET = {"03_bali": -17.0}
DUCK_DB = -7.0      # fixed dip of score + SFX under every line
MIN_GAP = 11.5      # every line must sit at least this many LU above the bed (rule: >= 10)
GOAL_GAP = 13.0     # the bed level is calibrated so the median line sits this far above it
HALL_DB = -10.0     # narrator 'Kaal hall' send (the IR itself is about -6 dB)
ECHO_DB = 2.0       # the 'लक्ष्मी' echo follows line 05's level, plus the compressor's make-up
BED = {"gain": 0.5}
LEVEL_FIX, POST_FIX, EXTRA_DUCK = {}, {}, {}
# per-scene levels of the two sustained layers (pad, santoor, bells, drums and sfx carry their own dynamics)
TANPURA_LV = {"hook": 0.45, "title": 0.55, "ratna": 0.45, "horse": 0.35, "airavata": 0.4, "kaustubha": 0.45,
              "lotus": 0.5, "choice": 0.45, "vishnu": 0.55, "varmala": 0.45, "end": 0.5}
KAAL_LV = {"hook": 0.9, "title": 0.6, "ratna": 0.45, "horse": 0.35, "airavata": 0.45, "kaustubha": 0.5,
           "lotus": 0.75, "choice": 0.55, "vishnu": 0.6, "varmala": 0.35, "end": 0.45}


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


def build_graph(L, scenes, c, total):
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
        if k in NARRATOR:  # warm storyteller (as Episodes 2-4) + a send to the Kaal hall
            g.append(f"[{i}:a]{lcomp},equalizer=f=160:t=q:w=1:g=1.5,{d},asplit=2[v{i}][n{i}]")
            vo.append(f"[v{i}]")
            send_n.append(f"[n{i}]")
        else:  # 03_bali: a proud voice in open sea air (unity-gain echo, as Indra in Episode 4)
            g.append(f"[{i}:a]{lcomp},equalizer=f=140:t=q:w=1:g=1.0,aecho=1.0:1.0:45|95:0.08|0.04,{d}[v{i}]")
            vo.append(f"[v{i}]")

    # the 'लक्ष्मी' time-echo (built in manthan_ep5_score.py from the trimmed take) follows line 05's level
    ie = inp(STEMS / "echo.wav")
    g.append(f"[{ie}:a]volume={LEVEL_FIX['05_narrator'] + POST_FIX.get('05_narrator', 0.0) + ECHO_DB:.2f}dB,highpass=f=90[echo]")
    vo.append("[echo]")
    # the Kaal hall: one long, high-passed reverb shared by all narrator lines
    ir = inp(STEMS / "ir_narrator.wav")
    g.append(f"{''.join(send_n)}amix=inputs={len(send_n)}:normalize=0,highpass=f=250,lowpass=f=7000,apad=pad_dur=4[ns]")
    g.append(f"[ns][{ir}:a]afir=irnorm=-1:irgain=1,volume={HALL_DB}dB[hallN]")
    vo.append("[hallN]")
    g.append(f"{''.join(vo)}amix=inputs={len(vo)}:normalize=0,apad=whole_dur={T},atrim=0:{T},asplit=3[vo][vosc][vostem]")

    def clip(src, a, b, at_f, gain, fin, fout, label):
        dur = b - a
        g.append(
            f"[{src}]atrim={a}:{b},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,"
            f"afade=t=in:d={fin},afade=t=out:st={max(0.0, dur - fout):.3f}:d={fout},volume={gain},"
            f"adelay={ms(max(0, at_f))}|{ms(max(0, at_f))}[{label}]"
        )
        fx.append(f"[{label}]")

    def boom(at_f, amp, f0=42, f1=34, dec=2.6, label="b"):
        w = f"{amp}*sin(2*PI*({f0}+{f1}*exp(-t*9))*t)*exp(-t*{dec})"
        g.append(f"aevalsrc='{w}|{w}':s=48000:d=2.4,lowpass=f=180,adelay={ms(at_f)}|{ms(at_f)}[{label}]")
        fx.append(f"[{label}]")

    # the user's own conch (Episode 4 SFX), in the clear right after the varmala line
    shankh = inp(SFX5 / "shankh_blast.mp3")
    clip(f"{shankh}:a", 0.0, 3.0, c["conch"] - 2, 0.7, 0.01, 1.2, "shk")
    # low-end weight on the big moments
    boom(c["titleHit"], 0.5, 38, 40, 1.8, "b1")
    boom(c["horseBurst"], 0.4, 36, 40, 2.2, "b2")
    boom(c["reveal"], 0.35, 34, 40, 2.6, "b3")
    boom(c["conch"], 0.45, 36, 40, 2.4, "b4")

    # the generated score, SFX and the Kaal time layer
    names = ("tanpura", "pad", "santoor", "bells", "drums", "sfx", "kaal", "kaal_fx")
    st = {n: inp(STEMS / f"{n}.wav") for n in names}
    g.append(f"[{st['tanpura']}:a]volume='{level_expr(TANPURA_LV, scenes)}':eval=frame[tp]")
    g.append(f"[{st['kaal']}:a]volume='{level_expr(KAAL_LV, scenes)}':eval=frame[kl]")
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
    """Render the mix: pre-master and the two measurement stems stay in audio/stems (outside the
    Remotion bundle); only the mastered mix.wav goes to public/."""
    MIX_DIR.mkdir(parents=True, exist_ok=True)
    pre, vo_stem, bus_stem = (STEMS / x for x in ("pre.wav", "stem_vo.wav", "stem_bus.wav"))
    out = MIX_DIR / "mix.wav"
    inputs, graph = build_graph(L, scenes, cues, total)
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
    print(f"TOTAL {total} frames = {total / FPS:.2f} s (cap {CAP_FRAMES})")
    for k, (a, b) in scenes.items():
        print(f"  scene {k:10s} {a:5d}-{b:5d}  ({(b - a) / FPS:5.2f} s)")
    bad = [k for k, v in cues.items() if v < 0 or v > total]
    print("missing word cues:", MISSES or "none", "| out of range:", bad or "none", flush=True)
    if total >= CAP_FRAMES:
        print("OVER CAP: tighten gaps and the title first")
        sys.exit(1)
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
