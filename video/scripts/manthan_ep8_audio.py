#!/usr/bin/env python3
"""Manthan Ep8 KETU - timeline + audio mix (single source of truth).

Same method as manthan_ep6_audio.py:
1. Lays Episode 8's trimmed takes end to end in script order (with the silent picture beats in
   ORDER), finds word-level cue points from the local Whisper transcripts, and writes
   src/Jyotiq/manthan/ep8/timing.ts so picture and sound share one clock.
2. Mixes dialogue, SFX, the generated score and the Kaal time layer into
   public/jyotiq/manthan/ep8/mix.wav (added in the mix step).

Hard cap: the reel must stay under 60 s (1800 frames); aim for 58.5 s or less.
ffmpeg only (no numpy on this Mac). Run with --timing-only to skip the mix.
Cue words are matched against Whisper's own first-pass spelling (अमरित, अम्मेत, बूंद, बट, सिर्भी,
अंधेरे, आखें, भूक, सुर्य, ब्रह्मा, ग्रहों, मिला, द्रह, मोख्ष, इसलिए, सीधेक, केतू, कहां).
"""
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path("/Users/ayushrajput/.kiro/crew/workspace/video")
EP8 = Path("/Users/ayushrajput/.kiro/crew/workspace/manthan-ep8")
VO_DIR = ROOT / "public/jyotiq/manthan/ep8/vo"
STT = EP8 / "audio/stt"
TS = ROOT / "src/Jyotiq/manthan/ep8/timing.ts"
MIX_DIR = ROOT / "public/jyotiq/manthan/ep8"
FPS = 30
CAP_FRAMES = 1800  # 60.0 s
AIM_FRAMES = 1755  # 58.5 s

# Script order. ("vo", key, gap_before) places a take; ("beat", key, gap_before, length) holds
# picture with no dialogue.
ORDER = [
    ("vo", "01_narrator", 6),        # hook: headless body glowing at the neck, Rahu's head above (lit frame 0)
    ("beat", "rewind", 4, 24),       # Kaal time-rewind onto Episode 7's line-07 frame + title overlay
    ("vo", "02_narrator", 4),        # slow-mo chakra replay, freeze on the throat glow
    ("vo", "03_narrator", 6),        # the drop splits in two
    ("beat", "split", 0, 14),        # chime + "सिर ✓ धड़ ✓" chips land
    ("vo", "04_narrator", 6),        # the body wanders through smoke
    ("vo", "05_rahu", 8),            # Rahu: 'मुझे सब चाहिए!'
    ("vo", "06_ketu", 8),            # split-screen, Ketu's chest glow: 'कुछ नहीं चाहिए'
    ("vo", "07_narrator", 6),        # Brahma's light, Ketu rises as a graha
    ("beat", "rise", 0, 20),         # comet streak, name card केतु, orb के
    ("vo", "08_narrator", 4),        # Rahu and Ketu orbs opposite: इच्छा / त्याग · मोक्ष
    ("vo", "09_narrator", 6),        # chest glow -> third-eye light
    ("beat", "jawab", 0, 12),        # JAWAB stamp, loop frame matches the hook
    ("vo", "10_narrator", 4),        # end card, kundali with के
    ("vo", "jyotiq_signoff", 8),
    ("beat", "hold", 0, 18),
]
MISSES = []


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def vo_frames():
    t = (ROOT / "src/Jyotiq/manthan/ep8/voData.ts").read_text()
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
    path = STT / f"{stem}.wav.json"
    if not path.exists():  # the reused sign-off was transcribed in an earlier episode
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

    def w(key, needle, nth=0, lead=0):
        return word_cue(L, key, needle, nth, lead)

    cues = {
        # hook: the throat glow pulses on 'गले', the body on 'धड़', 'कैसे बचा?' pulses
        "gale01": w("01_narrator", "गले"),
        "bina": w("01_narrator", "बिना"),
        "dhad01": w("01_narrator", "धड़"),
        "kaise": w("01_narrator", "कैसे"),
        "rewind": B["rewind"][0],
        "titleHit": B["rewind"][0] + 10,
        # chakra replay, freeze on the throat
        "chakra": s("02_narrator"),
        "gale02": w("02_narrator", "गले"),
        "freeze": w("02_narrator", "जहां"),
        "ruka": w("02_narrator", "रुका"),
        # the split
        "boond": w("03_narrator", "बूंद"),
        "hisson": w("03_narrator", "हिस्सों"),
        "splitHit": w("03_narrator", "बट"),
        "sirOk": w("03_narrator", "सिर"),
        "dhadOk": w("03_narrator", "धड़"),
        "chips": B["split"][0],
        # the wander
        "andhere": w("04_narrator", "अंधेरे"),
        "bhatak": w("04_narrator", "भटक"),
        "aankhen": w("04_narrator", "आखें"),
        "bhookh": w("04_narrator", "भूक"),
        # Rahu, then Ketu
        "rahuIn": s("05_rahu") - 8,
        "sab": w("05_rahu", "सब"),
        "surya": w("05_rahu", "सुर्य"),
        "chandra": w("05_rahu", "चंद्र"),
        "sabKuch": w("05_rahu", "सब", nth=1),
        "splitScreen": s("06_ketu") - 8,
        "ketuMujhe": w("06_ketu", "मुझे"),
        "kuch": w("06_ketu", "कुछ"),
        # Brahma and the rise
        "brahma": w("07_narrator", "ब्रह्मा"),
        "graha": w("07_narrator", "ग्रहों"),
        "naam": w("07_narrator", "नाम"),
        "ketuName": w("07_narrator", "मिला", lead=-8),
        "rise": B["rise"][0],
        # the pair
        "rahuOrb": s("08_narrator"),
        "ichha": w("08_narrator", "इच्छा"),
        "ketuOrb": w("08_narrator", "केतु"),
        "tyag": w("08_narrator", "त्याग"),
        "moksh": w("08_narrator", "मोख्ष"),
        # the answer
        "isliye": s("09_narrator"),
        "sirZaroor": w("09_narrator", "सिर"),
        "sochta": w("09_narrator", "सोचता"),
        "jaanta": w("09_narrator", "जानता"),
        "jawab": B["jawab"][0],
        # Ketu in the kundali and the close
        "kundaliKetu": s("10_narrator"),
        "bhaav": w("10_narrator", "भाव"),
        "mann": w("10_narrator", "मन"),
        "aapka": w("10_narrator", "आपका"),
        "kahan": w("10_narrator", "कहां"),
        "endCard": s("10_narrator") + 4,
        "signoff": s("jyotiq_signoff"),
        "offer": w("jyotiq_signoff", "पहला"),
        "brandChime": e("jyotiq_signoff") + 2,
        # caption split points (the next part of a caption starts here)
        "cap01b": w("01_narrator", "तो"),
        "cap02b": w("02_narrator", "जहां"),
        "cap03b": w("03_narrator", "सिर"),
        "cap04b": w("04_narrator", "ना"),
        "cap05b": w("05_rahu", "सुर्य"),
        "cap07b": w("07_narrator", "नाम"),
        "cap08b": w("08_narrator", "और"),
        "cap09b": w("09_narrator", "वो"),
        "cap10b": w("10_narrator", "आपका"),
    }
    scenes = {
        "hook": (0, B["rewind"][0]),
        "title": (B["rewind"][0], s("02_narrator")),
        "replay": (s("02_narrator"), s("03_narrator") - 6),
        "split": (s("03_narrator") - 6, s("04_narrator") - 6),
        "wander": (s("04_narrator") - 6, s("05_rahu") - 8),
        "rahu": (s("05_rahu") - 8, s("06_ketu") - 8),
        "ketu": (s("06_ketu") - 8, s("07_narrator") - 6),
        "brahma": (s("07_narrator") - 6, B["rise"][1]),
        "pair": (B["rise"][1], s("09_narrator") - 6),
        "answer": (s("09_narrator") - 6, B["jawab"][1]),
        "end": (B["jawab"][1], total),
    }
    return L, B, scenes, cues, total


def write_timing(L, B, scenes, cues, total):
    out = [
        "// Generated by scripts/manthan_ep8_audio.py - edit timings THERE so picture and sound stay in sync.",
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
import re  # noqa: E402

STEMS = EP8 / "audio/stems"
SFX8 = EP8 / "audio/sfx"
NARRATOR = {"01_narrator", "02_narrator", "03_narrator", "04_narrator", "07_narrator", "08_narrator",
            "09_narrator", "10_narrator", "jyotiq_signoff"}
# Every take is set to a K-weighted loudness target first; Rahu sits a little up (close, menacing).
TARGET_LUFS = -18.0
LINE_TARGET = {"05_rahu": -17.0}
DUCK_DB = -7.0
MIN_GAP = 13.0      # PLAN: dialogue at least 13 LU above the bed on every line
GOAL_GAP = 14.0
HALL_DB = -10.0
ECHO_DB = 2.0       # the 'केतु' echo follows line 07's level
BED = {"gain": 0.5}
LEVEL_FIX, POST_FIX, EXTRA_DUCK = {}, {}, {}
# per-scene levels of the two sustained layers; Ketu's scene drops almost to silence (stillness)
TANPURA_LV = {"hook": 0.45, "title": 0.55, "replay": 0.4, "split": 0.5, "wander": 0.45, "rahu": 0.3,
              "ketu": 0.2, "brahma": 0.5, "pair": 0.5, "answer": 0.45, "end": 0.5}
KAAL_LV = {"hook": 0.9, "title": 0.6, "replay": 0.5, "split": 0.45, "wander": 0.7, "rahu": 0.55,
           "ketu": 0.3, "brahma": 0.45, "pair": 0.5, "answer": 0.5, "end": 0.5}


def ms(f):
    return int(round(f * 1000 / FPS))


def level_expr(levels, scenes):
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
        gdb = LINE_TARGET.get(k, TARGET_LUFS) - measure(wav)[0]
        LEVEL_FIX[k] = round(gdb, 1)
        post = POST_FIX.get(k, 0.0)
        d = f"volume={post:.2f}dB,adelay={ms(a)}|{ms(a)}"
        lcomp = f"volume={gdb:.2f}dB,{comp}"
        if k in NARRATOR:  # warm storyteller + a send to the Kaal hall
            g.append(f"[{i}:a]{lcomp},equalizer=f=160:t=q:w=1:g=1.5,{d},asplit=2[v{i}][n{i}]")
            vo.append(f"[v{i}]")
            send_n.append(f"[n{i}]")
        elif k == "05_rahu":  # close and menacing with the Episode 7 dark slapback
            g.append(f"[{i}:a]{lcomp},equalizer=f=120:t=q:w=1:g=1.5,aecho=1.0:1.0:70|140:0.12|0.06,{d}[v{i}]")
            vo.append(f"[v{i}]")
        else:  # 06_ketu: its cave echo is already in the take; a touch of air, no hall
            g.append(f"[{i}:a]{lcomp},equalizer=f=3000:t=q:w=1:g=1.0,{d}[v{i}]")
            vo.append(f"[v{i}]")

    ie = inp(STEMS / "echo.wav")
    g.append(f"[{ie}:a]volume={LEVEL_FIX['07_narrator'] + POST_FIX.get('07_narrator', 0.0) + ECHO_DB:.2f}dB,highpass=f=90[echo]")
    vo.append("[echo]")
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

    def user_sfx(name, at_f, gain, fin, fout, label, dur=None):
        src = inp(SFX8 / f"{name}.mp3")
        clip(f"{src}:a", 0.0, dur or 3.0, at_f, gain, fin, fout, label)

    # Ayush's ElevenLabs SFX for Episode 8; all ride the ducked bus so no hit sits on a word
    user_sfx("amrit_split", c["splitHit"] - 2, 0.55, 0.02, 0.6, "u1", 2.0)   # the drop splits
    user_sfx("soft_liquid", c["splitHit"], 0.22, 0.05, 0.6, "u2", 2.0)       # soft layer under it
    user_sfx("smoke_wander", c["andhere"] - 6, 0.5, 0.3, 1.0, "u3", 4.0)     # the body wanders
    user_sfx("ketu_rise", c["ketuName"] - 4, 0.6, 0.05, 0.8, "u4", 3.0)      # Ketu rises as a graha
    boom(c["titleHit"], 0.5, 38, 40, 1.8, "b1")
    boom(c["freeze"], 0.4, 36, 40, 2.0, "b2")
    boom(c["ketuName"], 0.45, 36, 40, 2.4, "b3")
    boom(c["jawab"], 0.45, 34, 38, 2.4, "b4")

    names = ("tanpura", "pad", "santoor", "bells", "drums", "sfx", "kaal", "kaal_fx")
    st = {n: inp(STEMS / f"{n}.wav") for n in names}
    g.append(f"[{st['tanpura']}:a]volume='{level_expr(TANPURA_LV, scenes)}':eval=frame[tp]")
    g.append(f"[{st['kaal']}:a]volume='{level_expr(KAAL_LV, scenes)}':eval=frame[kl]")
    g.append(
        f"[{st['pad']}:a][{st['santoor']}:a][{st['bells']}:a][{st['drums']}:a][{st['sfx']}:a][{st['kaal_fx']}:a][tp][kl]"
        f"amix=inputs=8:normalize=0:weights=1 0.9 0.8 0.9 1 1 1 1,atrim=0:{T}[bed0]"
    )
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
    r = run(["ffmpeg", "-hide_banner", "-ss", f"{a / FPS:.3f}", "-to", f"{b / FPS:.3f}", "-i", str(path),
             "-af", "ebur128", "-f", "null", "-"]).stderr
    m = re.search(r"I:\s+(-?[0-9.]+) LUFS", r.split("Summary:")[-1])
    return -70.0 if not m else float(m.group(1))


def mix(L, B, scenes, cues, total, tag):
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
    print(f"TOTAL {total} frames = {total / FPS:.2f} s (cap {CAP_FRAMES}, aim {AIM_FRAMES})")
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
        ok = max(abs(v) for v in err.values()) <= 0.5 and min(gaps.values()) >= MIN_GAP - 0.3 and abs(med - GOAL_GAP) <= 1.5
        print(f"[pass {p}] max level error {max(abs(v) for v in err.values()):.2f} dB, min gap {min(gaps.values()):.1f}, median gap {med:.1f}", "-> DONE" if ok else "", flush=True)
        if ok or p == 4:
            break
        for k, v in err.items():
            POST_FIX[k] = round(POST_FIX.get(k, 0.0) + v, 2)
        after = {k: gaps[k] + err[k] for k in gaps}
        bed_db = sorted(after.values())[len(after) // 2] - GOAL_GAP
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
