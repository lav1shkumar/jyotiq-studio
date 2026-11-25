#!/usr/bin/env python3
"""Manthan Ep7 RAHU - timeline + audio mix (single source of truth).

Same method as manthan_ep6_audio.py:
1. Lays Episode 7's trimmed takes end to end in script order (with the silent picture beats in
   ORDER), finds word-level cue points from the local Whisper transcripts, and writes
   src/Jyotiq/manthan/ep7/timing.ts so picture and sound share one clock.
2. Mixes dialogue, SFX, the score and the Kaal time layer (stems from scripts/manthan_ep7_score.py) into
   public/jyotiq/manthan/ep7/mix.wav, calibrating over up to 4 passes so every line sits at least 11.5 LU
   (median 13) above the bed; master -14 LUFS, true peak at or below -1.5 dBFS.

Hard cap: the reel must stay under 60 s (1800 frames); aim for 58.5 s or less.
ffmpeg only (no numpy on this Mac). Run with --timing-only to skip the mix.
Cue words accept several spellings because Whisper's first pass spells Hindi loosely
(e.g. अम्रित/अमरित, राहू, केतू, घूंट); the first spelling that hits wins, and every miss is printed.
Prerequisite: scripts/manthan_ep7_vo_prep.py (trimmed takes, trim.json, voData.ts) and
manthan-ep7/transcribe.sh (Whisper JSON in manthan-ep7/audio/stt) on the real Episode 7 takes.
"""
import array
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path("/Users/ayushrajput/.kiro/crew/workspace/video")
EP7 = Path("/Users/ayushrajput/.kiro/crew/workspace/manthan-ep7")
VO_DIR = ROOT / "public/jyotiq/manthan/ep7/vo"
STT = EP7 / "audio/stt"
TS = ROOT / "src/Jyotiq/manthan/ep7/timing.ts"
MIX_DIR = ROOT / "public/jyotiq/manthan/ep7"
FPS = 30
CAP_FRAMES = 1800  # 60.0 s
AIM_FRAMES = 1755  # 58.5 s

# Script order. ("vo", key, gap_before) places a take; ("beat", key, gap_before, length) holds
# picture with no dialogue. Scene names match the Episode 7 scene components.
ORDER = [
    ("vo", "01_narrator", 6),        # hook: the sun being eaten, Rahu's severed head (lit from frame 0)
    ("beat", "rewind", 4, 24),       # Kaal rewind onto Episode 6's last beat (the impostor in the row) + title
    ("vo", "02_narrator", 4),        # the devas' row, push in on the disguised Svarbhanu
    ("vo", "03_narrator", 6),        # Mohini pours, he sips on 'घूँट'
    ("beat", "sip", 0, 12),          # the gold glow runs to his throat, the meter flips
    ("vo", "04_narrator", 4),        # Surya and Chandra recognise him: 'ये असुर है!'
    ("beat", "melt", 0, 14),         # the disguise melts into his true form
    ("vo", "05_narrator", 4),        # the Sudarshan chakra
    ("beat", "whiteout", 0, 10),     # the strike burns to white (no blood)
    ("vo", "06_rahu", 4),            # the head laughs: immortal
    ("vo", "07_narrator", 6),        # head = Rahu, body = Ketu
    ("vo", "08_rahu", 6),            # the vow to the sun and moon
    ("vo", "09_narrator", 6),        # the chase and the eclipse
    ("beat", "totality", 0, 16),     # totality, diamond ring, JAWAB
    ("vo", "10_narrator", 4),        # the kundali: Rahu and Ketu always opposite
    ("vo", "jyotiq_signoff", 8),
    ("beat", "hold", 0, 18),
]
MISSES = []


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def vo_frames():
    t = (ROOT / "src/Jyotiq/manthan/ep7/voData.ts").read_text()
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


def build_timing(frames):
    L, B, total = layout(frames)

    def s(k):
        return L[k][0]

    def e(k):
        return L[k][1]

    def w(key, needles, nth=0, lead=0):
        return word_cue(L, key, needles, nth, lead)

    cues = {
        # hook: the throat ring on 'सिर', the reveal and the freeze on 'किसका?'
        "sir": w("01_narrator", ["सिर"]),
        "kiska": w("01_narrator", ["किसका", "किसके", "किस"]),
        "rewind": B["rewind"][0],
        "titleHit": B["rewind"][0] + 10,
        # 02 the row: the glint and the name card on 'स्वर्भानु'
        "svarbhanu": w("02_narrator", ["स्वर्भानु", "स्वरभानु", "स्वर्भानू", "सुवर्भानु", "भानु"]),
        "cap02b": w("02_narrator", ["असुर"]),
        # 03 the pour from 'डाला', the sip on 'घूँट'
        "dala": w("03_narrator", ["डाला", "डाल"]),
        "ghoont": w("03_narrator", ["घूँट", "घूंट", "घुट", "घूट"]),
        "cap03b": w("03_narrator", ["और"]),
        # 04 recognition from 'पहचान', the punch, ring and shake as 'ये असुर है' lands
        "pehchan": w("04_narrator", ["पहचान", "पहचाना", "पैचान"]),
        "asurHai": w("04_narrator", ["असुर"], lead=4),
        "cap04b": w("04_narrator", ["ये", "यह"]),
        # 05 the chakra spins up on 'चक्र', flies on 'चला', strikes on 'अलग'
        "chakra": w("05_narrator", ["चक्र", "चकर"]),
        "chala": w("05_narrator", ["चला"]),
        "alag": w("05_narrator", ["अलग"]),
        "cap05b": w("05_narrator", ["सिर"]),
        # 06 the laugh opens the take; the throat swells on 'गले', flares on 'अमर' (the LAST 'अमर': Whisper
        # can spell अमृत as अमरित, which also contains अमर)
        "hahaha": s("06_rahu"),
        "gale": w("06_rahu", ["गले"]),
        "amar": w("06_rahu", ["अमर"], nth=-1),
        "cap06b": w("06_rahu", ["अमृत", "अम्रित", "अमरित", "अमृ"]),
        # 07 the head becomes रा on 'राहु', the body के on 'केतु'
        "rahu07": w("07_narrator", ["राहु", "राहू"]),
        "ketu07": w("07_narrator", ["केतु", "केतू"]),
        # 08 the sun and the moon flare on their words, the vow on 'लौटूँगा'
        "surya08": w("08_rahu", ["सूर्य", "सूर्या", "सुर्य", "सूरज"]),
        "chandra08": w("08_rahu", ["चंद्र", "चन्द्र", "चंदर", "चांद"]),
        "lautunga": w("08_rahu", ["लौटूँगा", "लौटूंगा", "लोटूंगा", "लौटुंगा", "लौट", "लोट"]),
        # 09 the chase from 'पीछा', the bite on 'निगलता', totality by 'ग्रहण'
        "peecha": w("09_narrator", ["पीछा", "पिछा", "पीछे"]),
        "nigalta": w("09_narrator", ["निगलता", "निगल"]),
        "grahan09": w("09_narrator", ["ग्रहण", "ग्रहन", "ग्रहान"]),
        "cap09b": w("09_narrator", ["जब"]),
        # 10 and the close: the chart turns from 'कुंडली', settles on 'भाव'
        "kundali": w("10_narrator", ["कुंडली", "कुण्डली", "कुंडलि"]),
        "bhaav": w("10_narrator", ["भाव"]),
        "signoff": s("jyotiq_signoff"),
        "offer": w("jyotiq_signoff", ["पहला"]),
        "brandChime": e("jyotiq_signoff") + 2,
    }
    scenes = {
        "hook": (0, B["rewind"][0]),
        "title": (B["rewind"][0], s("02_narrator")),
        "row": (s("02_narrator"), s("03_narrator") - 3),
        "pour": (s("03_narrator") - 3, B["sip"][1]),
        "alert": (B["sip"][1], B["melt"][0]),
        "chakra": (B["melt"][1], B["whiteout"][0]),
        "immortal": (B["whiteout"][1], s("07_narrator") - 3),
        "split": (s("07_narrator") - 3, s("08_rahu") - 3),
        "vow": (s("08_rahu") - 3, s("09_narrator") - 3),
        "chase": (s("09_narrator") - 3, B["totality"][0]),
        "kundali": (B["totality"][1], s("jyotiq_signoff")),
        "end": (s("jyotiq_signoff"), total),
    }
    return L, B, scenes, cues, total


def write_timing(L, B, scenes, cues, total):
    out = [
        "// Generated by scripts/manthan_ep7_audio.py - edit timings THERE so picture and sound stay in sync.",
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
STEMS = EP7 / "audio/stems"
SFX7 = EP7 / "audio/sfx"
NARRATOR = {"01_narrator", "02_narrator", "03_narrator", "04_narrator", "05_narrator", "07_narrator",
            "09_narrator", "10_narrator", "jyotiq_signoff"}
RAHU = {"06_rahu", "08_rahu"}
# Every take is first set to a K-weighted loudness target so no voice towers over another (PLAN.md:
# narrator -18, Rahu -17, close and menacing with a short dark slapback only).
TARGET_LUFS = -18.0
LINE_TARGET = {"06_rahu": -17.0, "08_rahu": -17.0}
DUCK_DB = -7.0      # fixed dip of score + SFX under every line
MIN_GAP = 11.5      # every line must sit at least this many LU above the bed (rule: >= 10)
GOAL_GAP = 13.0     # the bed level is calibrated so the median line sits this far above it (PLAN: >= 13)
HALL_DB = -10.0     # narrator 'Kaal hall' send (the IR itself is about -6 dB)
ECHO_DB = 0.0       # the 'राहु' / 'केतु' echoes follow line 07's level
HUSH = {"whiteout": -6.0, "totality": -9.0}  # tanpura + Kaal dip in these beats: near-silence, bells still ring
MELT_SFX = "disguise_melt"  # PLAN: the better of disguise_melt / disguise_melt_alt (judge by ear in review)
TRUE_PEAK_MAX = -1.5
BED = {"gain": 0.5}
LEVEL_FIX, POST_FIX, EXTRA_DUCK = {}, {}, {}
# per-scene levels of the two sustained layers (pad, santoor, bells, drums and sfx carry their own dynamics)
TANPURA_LV = {"hook": 0.4, "title": 0.55, "row": 0.45, "pour": 0.5, "alert": 0.35, "chakra": 0.3,
              "immortal": 0.35, "split": 0.45, "vow": 0.35, "chase": 0.3, "kundali": 0.5, "end": 0.5}
KAAL_LV = {"hook": 0.9, "title": 0.6, "row": 0.5, "pour": 0.4, "alert": 0.4, "chakra": 0.45,
           "immortal": 0.8, "split": 0.7, "vow": 0.75, "chase": 0.6, "kundali": 0.5, "end": 0.5}


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
        if k in NARRATOR:  # warm storyteller (as Episodes 2-6) + a send to the Kaal hall
            g.append(f"[{i}:a]{lcomp},equalizer=f=160:t=q:w=1:g=1.5,{d},asplit=2[v{i}][n{i}]")
            vo.append(f"[v{i}]")
            send_n.append(f"[n{i}]")
        else:  # Rahu: close and menacing, low warmth, a touch less bite, one short dark slapback, no hall
            g.append(f"[{i}:a]{lcomp},equalizer=f=120:t=q:w=1:g=2.0,equalizer=f=2800:t=q:w=1:g=-1.0,"
                     f"aecho=1.0:1.0:70:0.2,lowpass=f=9500,{d}[v{i}]")
            vo.append(f"[v{i}]")

    # the 'राहु' / 'केतु' echoes (built in manthan_ep7_score.py from line 07's trimmed take) follow its level
    ie = inp(STEMS / "echo.wav")
    g.append(f"[{ie}:a]volume={LEVEL_FIX['07_narrator'] + POST_FIX.get('07_narrator', 0.0) + ECHO_DB:.2f}dB,highpass=f=90[echo]")
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

    # the user's own ElevenLabs SFX for Episode 7 (PLAN.md), all on the ducked bus so no hit sits on a word
    def user_sfx(name, at_f, gain, fin, fout, label, dur=None):
        src = inp(SFX7 / f"{name}.mp3")
        clip(f"{src}:a", 0.0, dur or 3.0, at_f, gain, fin, fout, label)

    crack = int(round(peak_time(SFX7 / "chakra.mp3") * FPS))
    print(f"chakra.mp3 loudest at {crack} frames: placed so it lands on 'अलग'", flush=True)
    user_sfx("eclipse", 0, 0.35, 0.02, 1.2, "u1")                        # the hook's bed: the sun being eaten
    user_sfx("amrit_sip", c["ghoont"] - 2, 0.6, 0.02, 0.4, "u2", 1.6)     # the sip on 'घूँट'
    user_sfx(MELT_SFX, B["melt"][0] - 4, 0.55, 0.05, 0.5, "u3", 2.2)      # the disguise melts
    user_sfx("chakra", c["alag"] - crack, 0.7, 0.05, 0.6, "u4")           # its crack lands on 'अलग'
    user_sfx("rahu_rise", L["07_narrator"][0] - 4, 0.5, 0.3, 1.0, "u5")   # head = Rahu, body = Ketu
    user_sfx("eclipse", c["nigalta"] - 4, 0.65, 0.05, 1.0, "u6")          # the swallow into totality
    # low-end weight on the big moments
    boom(c["titleHit"], 0.5, 38, 40, 1.8, "b1")
    boom(c["asurHai"], 0.4, 36, 40, 2.0, "b2")
    boom(c["alag"], 0.5, 34, 40, 2.4, "b3")
    boom(B["totality"][0], 0.45, 30, 36, 2.6, "b4")

    # the generated score, SFX glue and the Kaal time layer; tanpura and Kaal dip into the HUSH beats
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
    """Render the mix: pre-master and the two measurement stems stay in audio/stems (outside the
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
        sys.exit(f"missing prepared takes {missing}: run scripts/manthan_ep7_vo_prep.py on the Episode 7 takes first")
    L, B, scenes, cues, total = build_timing(frames)
    write_timing(L, B, scenes, cues, total)
    flag = "OVER THE 60 s CAP" if total >= CAP_FRAMES else ("over the 58.5 s aim" if total > AIM_FRAMES else "ok")
    print(f"TOTAL {total} frames = {total / FPS:.2f} s ({flag}; cap {CAP_FRAMES}, aim {AIM_FRAMES})")
    for k, (a, b) in L.items():
        print(f"  line  {k:16s} {a:5d}-{b:5d}  {(b - a) / FPS:5.2f} s")
    for k, (a, b) in scenes.items():
        print(f"  scene {k:16s} {a:5d}-{b:5d}  {(b - a) / FPS:5.2f} s")
    bad = [k for k, v in cues.items() if v < 0 or v > total]
    print("missing word cues:", MISSES or "none", "| out of range:", bad or "none", flush=True)
    if total >= CAP_FRAMES:
        print("OVER CAP: tighten the gaps and the beats first")
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
