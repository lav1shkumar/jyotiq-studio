"""Voice mix for the Jyotiq katha Reel ("The war that never happened").

Takes the 11 ElevenLabs takes in public/jyotiq/katha/vo/elevenlabs/, cuts each
into clean pieces (silence, breaths and the tails between phrases removed),
places every piece on its reel frame, then mixes:

  voices : 4th-order high-pass, mud cut, presence lift (de-hiss shelf on
           whispers), soft-knee compression, per-line loudness, light pan to
           the speaker's side of the frame, palace reverb on the court scenes
  sfx    : public/jyotiq/katha/sfx.wav (scripts/katha_audio.py), ducked under
           the voices with look-ahead
  master : look-ahead peak limiter, -14 LUFS integrated, <= -1 dBTP, fade-out

Writes public/jyotiq/katha/mix-elevenlabs.wav (48 kHz stereo 16-bit) and
src/Jyotiq/katha/voTiming.ts (per-frame mouth openness + phrase timings that
drive lip sync, bubbles, chips and CTA reveals).

Run from the video/ folder:  python3 scripts/katha_vo_mix.py
"""

import array
import collections
import json
import math
import os
import random
import re
import subprocess
import tempfile
import wave

SR = 48000
FPS = 30
SPF = SR // FPS  # samples per frame
VO_DIR = os.path.join("public", "jyotiq", "katha", "vo", "elevenlabs")
OUT_WAV = os.path.join("public", "jyotiq", "katha", "mix-elevenlabs.wav")
OUT_TS = os.path.join("src", "Jyotiq", "katha", "voTiming.ts")
TARGET_LUFS = -14.0
TP_MAX = -1.0
rng = random.Random(11)

src = open(os.path.join("src", "Jyotiq", "katha", "reelTimeline.ts")).read()
sc_block = re.search(r"export const SC = \{(.*?)\} as const;", src, re.S).group(1)
SC = {k: (int(a), int(b)) for k, a, b in re.findall(r"(\w+): \[(\d+), (\d+)\]", sc_block)}
ROOF0 = SC["today"][0] - 30
TOTAL = SC["cta"][1]
N = TOTAL * SPF


def at(scene, local):
    """Reel frame of a scene-local frame ('roof' = the rooftop clock)."""
    return (ROOF0 if scene == "roof" else SC[scene][0]) + local


# ---------------------------------------------------------------------------
# Line sheet. Each piece: (scene, local frame of the first word, source
# start s, source end s, options). Source times come from the take's level
# analysis + whisper.cpp transcript; edges are refined to the take below.
# ---------------------------------------------------------------------------
MALE = dict(hpf=80, mud=-2.0, pres=2.5, shelf=0.0)
LINES = [
    dict(id="L1", file="01-general", who="general", text="कल सुबह... हमला!", eq=dict(MALE, hpf=90, pres=1.0),
         lufs=-14.5, pan=0.15, rev=0.20, duck=4.0,
         pieces=[("hook", 3, 0.10, 0.92), ("hook", 38.4, 1.46, 2.04)]),
    dict(id="L2", file="02-raja-ruko", who="raja", text="रुको।", eq=dict(MALE, hpf=70),
         lufs=-16.0, pan=-0.15, rev=0.14, duck=7.0,
         pieces=[("hook", 59, 0.04, 0.65)]),
    dict(id="L3", file="03-raja-sawaal", who="raja", text="मेरे सितारे... क्या कहते हैं?", eq=dict(MALE, hpf=70),
         lufs=-16.5, pan=0.15, rev=0.14, duck=7.0,
         pieces=[("court", 46, 0.19, 1.15), ("court", 83.8, 1.65, 2.57)]),
    dict(id="L4", file="04-jyotishi-mangal", who="jyotishi", text="मंगल कमज़ोर है... तीन दिन रुकिए, राजन।", eq=MALE,
         lufs=-15.5, pan=-0.15, rev=0.16, duck=8.0,
         pieces=[("court", 172, 0.00, 1.50), ("court", 227.8, 2.07, 3.65)]),
    dict(id="L5g", file="05-dut-shanti", who="dut", text="(gasp)", eq=dict(MALE, hpf=100),
         lufs=-21.0, pan=-0.15, rev=0.12, duck=2.0,
         pieces=[("days", 101, 0.15, 0.33)]),
    dict(id="L5", file="05-dut-shanti", who="dut", text="हमारे राजा... शांति चाहते हैं!", eq=dict(MALE, hpf=90),
         lufs=-15.5, pan=-0.15, rev=0.14, duck=7.0,
         pieces=[("peace", 3, 0.68, 1.46), ("peace", 35.4, 1.91, 2.92)]),
    dict(id="L6", file="06-praja-jai", who="crowd", text="महाराज की जय! महाराज की जय!", eq=dict(hpf=110, mud=-1.5, pres=1.5, shelf=0.0),
         lufs=-16.5, pan=0.0, rev=0.22, duck=3.0, ratio=2.0,
         # one continuous piece: the crowd bed must not be cut; aligned on its first word (0.17 s)
         pieces=[("peace", 63, 0.17, 4.03, dict(exact=True, pre=0.07, post=0.32, fin=0.04, fout=0.30))]),
    dict(id="L7", file="07-meera-soch", who="meera-thought", text="Job switch करूँ? क्या वो सही है? Abroad चली जाऊँ?",
         eq=dict(hpf=120, mud=0.0, pres=1.5, shelf=-2.0), lufs=-18.0, pan=0.0, rev=0.0, duck=8.0, ratio=2.5,
         pieces=[("roof", 62, 0.13, 1.00), ("roof", 94, 1.90, 2.66), ("roof", 123, 3.50, 4.52)]),
    dict(id="L8", file="08-jyotishi-phone", who="jyotishi", text="(laughs) चिंता मत करो... अब मैं तुम्हारे phone में हूँ।", eq=MALE,
         lufs=-15.5, pan=0.15, rev=0.14, duck=8.0,
         pieces=[("roof", 176, 0.13, 0.90, dict(exact_end=True, fout=0.14)), ("roof", 202, 1.42, 2.82), ("roof", 254.8, 3.34, 5.10)]),
    dict(id="L9", file="09-meera-type", who="meera-thought", text="इस साल job switch करूँ?",
         eq=dict(hpf=120, mud=0.0, pres=1.5, shelf=-2.0), lufs=-18.0, pan=0.0, rev=0.0, duck=8.0, ratio=2.5,
         pieces=[("app", 14, 0.14, 1.65)]),
    dict(id="L10", file="10-jyotishi-cta", who="jyotishi", text="अगला बड़ा फ़ैसला लेने से पहले... ज्योतिक से पूछो।", eq=MALE,
         lufs=-15.0, pan=-0.15, rev=0.06, duck=7.0,
         pieces=[("cta", 6, 0.07, 2.55), ("cta", 89.4, 3.15, 4.83)]),
    dict(id="L11", file="11-meera-free", who="meera", text="पहला सवाल, बिल्कुल free! ज्योतिक को अभी Play Store से download करें।",
         eq=dict(hpf=110, mud=-1.0, pres=1.5, shelf=0.0), lufs=-15.0, pan=0.15, rev=0.05, duck=7.0,
         pieces=[("cta", 147, 0.17, 2.14), ("cta", 213.6, 2.77, 5.04)]),
]

# ---------------------------------------------------------------------------
# I/O
# ---------------------------------------------------------------------------
ENV = dict(os.environ, PATH="/usr/local/bin:" + os.environ.get("PATH", ""))
TMP = tempfile.mkdtemp(prefix="katha-vo-")


def ffmpeg(*args):
    p = subprocess.run(["npx", "remotion", "ffmpeg", "-hide_banner", *args], capture_output=True, text=True, env=ENV)
    if p.returncode != 0:
        raise SystemExit(p.stderr[-2000:])
    return p.stderr


def read_wav(path):
    with wave.open(path, "rb") as w:
        ch, sw, n = w.getnchannels(), w.getsampwidth(), w.getnframes()
        assert sw == 2 and w.getframerate() == SR, path
        pcm = array.array("h")
        pcm.frombytes(w.readframes(n))
    if ch == 1:
        return [array.array("d", (v / 32768.0 for v in pcm))]
    return [array.array("d", (pcm[i] / 32768.0 for i in range(c, len(pcm), ch))) for c in range(ch)]


def write_wav(path, L, R, dither=True):
    pcm = array.array("h", bytes(4 * len(L)))
    for n in range(len(L)):
        dl = (rng.random() - rng.random()) if dither else 0.0
        dr = (rng.random() - rng.random()) if dither else 0.0
        pcm[2 * n] = max(-32768, min(32767, int(round(L[n] * 32767 + dl))))
        pcm[2 * n + 1] = max(-32768, min(32767, int(round(R[n] * 32767 + dr))))
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def measure(path):
    err = ffmpeg("-i", path, "-af", "loudnorm=print_format=json", "-f", "null", "-")
    j = json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", err, re.S).group(0))
    return float(j["input_i"]), float(j["input_tp"]), float(j["input_lra"])


def decode(name):
    out = os.path.join(TMP, name + ".wav")
    ffmpeg("-y", "-loglevel", "error", "-i", os.path.join(VO_DIR, name + ".mp3"), "-ac", "1", "-ar", str(SR), "-c:a", "pcm_s16le", out)
    return read_wav(out)[0]


# ---------------------------------------------------------------------------
# DSP helpers (pure Python, RBJ biquads)
# ---------------------------------------------------------------------------
def biquad(x, b0, b1, b2, a0, a1, a2):
    b0, b1, b2, a1, a2 = b0 / a0, b1 / a0, b2 / a0, a1 / a0, a2 / a0
    y = array.array("d", bytes(8 * len(x)))
    x1 = x2 = y1 = y2 = 0.0
    for i in range(len(x)):
        xi = x[i]
        yi = b0 * xi + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2
        x2, x1, y2, y1 = x1, xi, y1, yi
        y[i] = yi
    return y


def hpf(x, f0, q):
    w = 2 * math.pi * f0 / SR
    c, al = math.cos(w), math.sin(w) / (2 * q)
    return biquad(x, (1 + c) / 2, -(1 + c), (1 + c) / 2, 1 + al, -2 * c, 1 - al)


def peak_eq(x, f0, db, q):
    A, w = 10 ** (db / 40), 2 * math.pi * f0 / SR
    c, al = math.cos(w), math.sin(w) / (2 * q)
    return biquad(x, 1 + al * A, -2 * c, 1 - al * A, 1 + al / A, -2 * c, 1 - al / A)


def high_shelf(x, f0, db):
    A, w = 10 ** (db / 40), 2 * math.pi * f0 / SR
    c, s = math.cos(w), math.sin(w)
    al = s / 2 * math.sqrt(2)
    sa = 2 * math.sqrt(A) * al
    return biquad(x, A * ((A + 1) + (A - 1) * c + sa), -2 * A * ((A - 1) + (A + 1) * c), A * ((A + 1) + (A - 1) * c - sa),
                  (A + 1) - (A - 1) * c + sa, 2 * ((A - 1) - (A + 1) * c), (A + 1) - (A - 1) * c - sa)


def kweight(x):
    y = biquad(x, 1.53512485958697, -2.69169618940638, 1.19839281085285, 1.0, -1.69065929318241, 0.73248077421585)
    return biquad(y, 1.0, -2.0, 1.0, 1.0, -1.99004745483398, 0.99007225036621)


def lufs(x):
    """BS.1770 gated loudness of a mono clip (short clips fall back to an active-sample mean)."""
    k = kweight(x)
    blk, hop = int(0.4 * SR), int(0.1 * SR)
    ms = []
    for s in range(0, max(1, len(k) - blk + 1), hop):
        seg = k[s:s + blk]
        ms.append(sum(v * v for v in seg) / max(1, len(seg)))
    if len(k) < blk or len(ms) < 3:
        act = [v * v for v in k if abs(v) > 0.003]
        return -0.691 + 10 * math.log10(sum(act) / max(1, len(act)) + 1e-12)
    g1 = [m for m in ms if -0.691 + 10 * math.log10(m + 1e-12) > -70]
    rel = -0.691 + 10 * math.log10(sum(g1) / len(g1)) - 10
    g2 = [m for m in g1 if -0.691 + 10 * math.log10(m) > rel]
    return -0.691 + 10 * math.log10(sum(g2) / len(g2))


def rms_db(x, a, b):
    a, b = max(0, a), min(len(x), b)
    if b <= a:
        return -120.0
    return 10 * math.log10(sum(v * v for v in x[a:b]) / (b - a) + 1e-12)


def compress(x, ratio, knee=6.0):
    """Soft-knee RMS compressor; threshold 9 dB under the clip's loud (95th pct) level."""
    step = int(0.005 * SR)
    lv = [rms_db(x, i - step, i + step) for i in range(0, len(x), step)]
    loud = sorted(v for v in lv if v > -60)
    if not loud:
        return x
    thr = loud[int(0.95 * (len(loud) - 1))] - 9.0
    gr_pts = []
    for v in lv:
        over = v - thr
        if over <= -knee / 2:
            g = 0.0
        elif over >= knee / 2:
            g = over * (1 / ratio - 1)
        else:
            g = (1 / ratio - 1) * (over + knee / 2) ** 2 / (2 * knee)
        gr_pts.append(g)
    att, rel = math.exp(-step / (0.005 * SR)), math.exp(-step / (0.09 * SR))
    sm, cur = [], 0.0
    for g in gr_pts:
        cur = (att if g < cur else rel) * cur + (1 - (att if g < cur else rel)) * g
        sm.append(cur)
    y = array.array("d", bytes(8 * len(x)))
    for i in range(len(x)):
        j = i / step
        j0 = min(int(j), len(sm) - 1)
        j1 = min(j0 + 1, len(sm) - 1)
        g = sm[j0] + (sm[j1] - sm[j0]) * (j - j0)
        y[i] = x[i] * 10 ** (g / 20)
    return y


def fade(seg, fin, fout):
    n_in, n_out = int(fin * SR), int(fout * SR)
    for i in range(min(n_in, len(seg))):
        seg[i] *= 0.5 - 0.5 * math.cos(math.pi * i / n_in)
    for i in range(min(n_out, len(seg))):
        seg[len(seg) - 1 - i] *= 0.5 - 0.5 * math.cos(math.pi * i / n_out)
    return seg


def refine(x, a, b, thr_db):
    """Snap a rough [a, b] (s) to the take: first/last 2.5 ms frame above thr within +-120 ms."""
    hop, win = int(0.0025 * SR), int(0.005 * SR)

    def lvl(t):
        c = int(t * SR)
        return rms_db(x, c - win, c + win)

    t, on = max(0.0, a - 0.12), None
    while t <= a + 0.12:
        if lvl(t) > thr_db:
            on = t
            break
        t += hop / SR
    t, off = min(len(x) / SR, b + 0.12), None
    while t >= b - 0.12:
        if lvl(t) > thr_db:
            off = t
            break
        t -= hop / SR
    return (a if on is None else on), (b if off is None else off)


def reverb(x, offset):
    """Schroeder room, the same one scripts/katha_audio.py uses for the SFX (same space)."""
    n_ = len(x)
    out = array.array("d", bytes(8 * n_))
    for d in (1557, 1617, 1491, 1422):
        d = int((d + offset) * SR / 44100)
        buf = array.array("d", bytes(8 * d))
        idx, damp = 0, 0.0
        for n in range(n_):
            yv = buf[idx]
            damp = yv * 0.6 + damp * 0.4
            buf[idx] = x[n] + damp * 0.8
            idx = (idx + 1) % d
            out[n] += yv * 0.25
    for d in (225, 556):
        d = int((d + offset) * SR / 44100)
        buf = array.array("d", bytes(8 * d))
        idx = 0
        for n in range(n_):
            bv = buf[idx]
            yv = -out[n] + bv
            buf[idx] = out[n] + bv * 0.5
            idx = (idx + 1) % d
            out[n] = yv
    return out


# ---------------------------------------------------------------------------
# 1. Build every line
# ---------------------------------------------------------------------------
dryL = array.array("d", bytes(8 * N))
dryR = array.array("d", bytes(8 * N))
send = array.array("d", bytes(8 * N))
duck_ms = [0.0] * (N // 48 + 2)  # wanted SFX attenuation (dB) per millisecond
cache, report, timing = {}, [], {}
PRE_DLY = int(0.018 * SR)

for ln in LINES:
    if ln["file"] not in cache:
        cache[ln["file"]] = decode(ln["file"])
    x = cache[ln["file"]]
    peak = max(rms_db(x, i, i + 480) for i in range(0, len(x), 480))
    thr = peak - 45.0
    placed = []  # (reel sample of the first word, piece samples, onset offset in piece, on_s, off_s)
    for pc in ln["pieces"]:
        scene, local, a, b = pc[:4]
        o = pc[4] if len(pc) > 4 else {}
        if o.get("exact"):
            on, off = a, b
        else:
            on, off = refine(x, a, b, thr)
            if o.get("exact_end"):
                off = b
        pre, post = o.get("pre", 0.012), o.get("post", 0.05)
        s0, s1 = max(0, int((on - pre) * SR)), min(len(x), int((off + post) * SR))
        seg = fade(array.array("d", x[s0:s1]), o.get("fin", 0.006), o.get("fout", 0.035))
        placed.append((round(at(scene, local) * SPF), seg, int(on * SR) - s0, on, off))
    # one buffer per line so EQ/compression/loudness act on the whole performance
    first = min(p[0] - p[2] for p in placed)
    last = max(p[0] - p[2] + len(p[1]) for p in placed)
    buf = array.array("d", bytes(8 * (last - first + int(0.05 * SR))))
    for start, seg, onoff, _, _ in placed:
        o0 = start - onoff - first
        for i, v in enumerate(seg):
            buf[o0 + i] += v
    eq = ln["eq"]
    y = hpf(hpf(buf, eq["hpf"], 0.5412), eq["hpf"], 1.3066)
    if eq["mud"]:
        y = peak_eq(y, 300, eq["mud"], 1.0)
    if eq["pres"]:
        y = peak_eq(y, 3200, eq["pres"], 0.9)
    if eq["shelf"]:
        y = high_shelf(y, 7500, eq["shelf"])
    y_lip = y  # pre-compression copy: keeps the syllable dips the mouths follow
    y = compress(y, ln.get("ratio", 3.0))
    g = 10 ** ((ln["lufs"] - lufs(y)) / 20)
    y = array.array("d", (v * g for v in y))
    # place: -3 dB pan law, reverb send pre-delayed
    th = (ln["pan"] + 1) * math.pi / 4
    gl, gr = math.cos(th), math.sin(th)
    for i, v in enumerate(y):
        n = first + i
        if 0 <= n < N:
            dryL[n] += v * gl
            dryR[n] += v * gr
            if ln["rev"] and n + PRE_DLY < N:
                send[n + PRE_DLY] += v * ln["rev"]
    # ducking request + lip sync, both from the processed dry voice
    for ms in range(0, len(y) // 48):
        lv = rms_db(y, ms * 48 - 240, ms * 48 + 240)
        act = max(0.0, min(1.0, (lv + 48.0) / 12.0))
        k = first // 48 + ms
        if 0 <= k < len(duck_ms):
            duck_ms[k] = max(duck_ms[k], ln["duck"] * act)
    f0 = first // SPF
    f1 = (first + len(y)) // SPF + 1
    lv_fr = []
    for f in range(f0, f1 + 1):
        c_ = int((f + 1.5) * SPF) - first  # 40 ms window one frame ahead: the mouth opens just before the sound
        lv_fr.append(rms_db(y_lip, c_ - 960, c_ + 960))
    hi = sorted(lv_fr)[int(0.95 * (len(lv_fr) - 1))]
    talk, prev = [], 0.0
    for i, lv in enumerate(lv_fr):
        loc = max(lv_fr[max(0, i - 5):i + 6])  # local syllable peak within +-170 ms
        rel = max(0.0, min(1.0, (lv - (loc - 9.0)) / 7.0))
        ab = max(0.0, min(1.0, (lv - (hi - 24.0)) / 18.0))
        o_ = 0.0 if lv < hi - 32.0 else (0.8 * rel + 0.2 * ab) * ab ** 0.3
        prev = max(o_, prev * 0.45)
        talk.append(round(prev if prev > 0.06 else 0.0, 3))
    pieces_fr = [[round(p[0] / SPF, 2), round((p[0] + (p[4] - p[3]) * SR) / SPF, 2)] for p in placed]
    timing[ln["id"]] = dict(who=ln["who"], text=ln["text"], src=ln["file"], frm=f0, pieces=pieces_fr, talk=talk)
    report.append((ln["id"], ln["who"], pieces_fr, sum(p[4] - p[3] for p in placed), lufs(y)))

# ---------------------------------------------------------------------------
# 2. Voice bus = dry + palace/rooftop reverb return
# ---------------------------------------------------------------------------
wl, wr = reverb(send, 0), reverb(send, 23)
vL = array.array("d", (dryL[n] + 0.5 * wl[n] for n in range(N)))
vR = array.array("d", (dryR[n] + 0.5 * wr[n] for n in range(N)))

# ---------------------------------------------------------------------------
# 3. SFX ducked under the voices (25 ms look-ahead, 25 ms attack, 250 ms release)
# ---------------------------------------------------------------------------
sL, sR = read_wav(os.path.join("public", "jyotiq", "katha", "sfx.wav"))
sL, sR = sL[:N], sR[:N]
la = 25
want = duck_ms[la:] + [0.0] * la
a_c, r_c = math.exp(-1 / 25.0), math.exp(-1 / 250.0)
cur, depth = 0.0, []
for w_ in want:
    c_ = a_c if w_ > cur else r_c
    cur = c_ * cur + (1 - c_) * w_
    depth.append(cur)
dg = [10 ** (-d / 20) for d in depth]


def duck_gain(n):
    j = n / 48.0
    j0 = min(int(j), len(dg) - 2)
    return dg[j0] + (dg[j0 + 1] - dg[j0]) * (j - j0)


dL = array.array("d", (sL[n] * duck_gain(n) for n in range(len(sL))))
dR = array.array("d", (sR[n] * duck_gain(n) for n in range(len(sR))))

write_wav(os.path.join(TMP, "voice.wav"), vL, vR, dither=False)
write_wav(os.path.join(TMP, "sfx-ducked.wav"), dL, dR, dither=False)
Lv, _, _ = measure(os.path.join(TMP, "voice.wav"))
Ls, _, _ = measure(os.path.join(TMP, "sfx-ducked.wav"))
g_sfx_db = (Lv - 6.0) - Ls  # effects sit ~6 LU under the dialogue
g_sfx = 10 ** (g_sfx_db / 20)

# ---------------------------------------------------------------------------
# 4. Master: sum, look-ahead limiter, loudness, fade-out
# ---------------------------------------------------------------------------
mL = array.array("d", (vL[n] + dL[n] * g_sfx for n in range(N)))
mR = array.array("d", (vR[n] + dR[n] * g_sfx for n in range(N)))


def limit(L, R, gain, ceil_db):
    ceil = 10 ** (ceil_db / 20)
    n_ = len(L)
    req = array.array("d", (min(1.0, ceil / (max(abs(L[i]), abs(R[i])) * gain + 1e-12)) for i in range(n_)))
    look = int(0.003 * SR)
    mins = array.array("d", bytes(8 * n_))
    dq = collections.deque()
    for i in range(n_ + look):
        if i < n_:
            while dq and req[dq[-1]] >= req[i]:
                dq.pop()
            dq.append(i)
        j = i - look
        if j >= 0:
            while dq[0] < j:
                dq.popleft()
            mins[j] = req[dq[0]]
    rel = 1 - math.exp(-1 / (0.06 * SR))
    g, sm = 1.0, array.array("d", bytes(8 * n_))
    for i in range(n_):
        g = mins[i] if mins[i] < g else g + (mins[i] - g) * rel
        sm[i] = g
    # moving average over the look-ahead window turns the gain steps into ramps
    out_l, out_r = array.array("d", bytes(8 * n_)), array.array("d", bytes(8 * n_))
    acc, q = 0.0, collections.deque()
    for i in range(n_):
        v = sm[min(n_ - 1, i + look // 2)]
        q.append(v)
        acc += v
        if len(q) > look:
            acc -= q.popleft()
        gg = min(acc / len(q), sm[i]) * gain
        out_l[i], out_r[i] = L[i] * gg, R[i] * gg
    return out_l, out_r


fade_n = 8 * SPF
gain, ceil_db = 1.0, -1.6
for it in range(4):
    oL, oR = limit(mL, mR, gain, ceil_db)
    for i in range(fade_n):
        k = 0.5 + 0.5 * math.cos(math.pi * i / fade_n)
        oL[N - fade_n + i] *= k
        oR[N - fade_n + i] *= k
    for i in range(int(0.003 * SR)):
        oL[i] *= i / (0.003 * SR)
        oR[i] *= i / (0.003 * SR)
    probe = os.path.join(TMP, "probe.wav")
    write_wav(probe, oL, oR, dither=False)
    I, TP, LRA = measure(probe)
    print(f"  master pass {it + 1}: {I:.2f} LUFS, {TP:.2f} dBTP (gain {20 * math.log10(gain):+.2f} dB, ceiling {ceil_db:.1f})")
    if abs(I - TARGET_LUFS) <= 0.2 and TP <= TP_MAX:
        break
    if TP > TP_MAX:
        ceil_db -= TP - TP_MAX + 0.15
    gain *= 10 ** ((TARGET_LUFS - I) / 20)

write_wav(OUT_WAV, oL, oR, dither=True)
I, TP, LRA = measure(OUT_WAV)

# ---------------------------------------------------------------------------
# 5. Lip-sync / timing module for the composition
# ---------------------------------------------------------------------------
with open(OUT_TS, "w") as fh:
    fh.write("/* GENERATED by scripts/katha_vo_mix.py from the ElevenLabs takes. Do not edit by hand.\n")
    fh.write("   pieces: [first word, last word end] in reel frames; talk: mouth openness 0..1 per reel frame from `frm`. */\n\n")
    fh.write("export type VoLine = { who: string; text: string; src: string; frm: number; pieces: [number, number][]; talk: number[] };\n\n")
    fh.write("export const VO: Record<string, VoLine> = ")
    fh.write(json.dumps(timing, ensure_ascii=False, separators=(",", ":")))
    fh.write(";\n\n")
    fh.write("/** Mouth openness of line `id` at reel frame `f` (0 outside the line). */\n")
    fh.write("export const voTalk = (id: string, f: number): number => {\n")
    fh.write("  const v = VO[id];\n  const i = Math.floor(f) - v.frm;\n  return i >= 0 && i < v.talk.length ? v.talk[i] : 0;\n};\n")
    fh.write("/** Reel frame where piece `i` of line `id` starts. */\n")
    fh.write("export const voOn = (id: string, i = 0): number => VO[id].pieces[i][0];\n")
    fh.write("/** Reel frame where piece `i` (default: the last) of line `id` ends. */\n")
    fh.write("export const voOff = (id: string, i?: number): number => VO[id].pieces[i ?? VO[id].pieces.length - 1][1];\n")

print(f"voice bus {Lv:.1f} LUFS, ducked sfx {Ls:.1f} LUFS -> sfx gain {g_sfx_db:+.1f} dB")
for rid, who, pcs, dur, lu in report:
    spans = ", ".join(f"{a / FPS:5.2f}-{b / FPS:5.2f}s" for a, b in pcs)
    print(f"  {rid:4s} {who:14s} {dur:4.2f}s speech  {lu:6.1f} LUFS  {spans}")
print(f"wrote {OUT_WAV}: {N / SR:.2f}s, {I:.2f} LUFS, {TP:.2f} dBTP, LRA {LRA:.1f}")
print(f"wrote {OUT_TS}")
for f_ in os.listdir(TMP):
    os.remove(os.path.join(TMP, f_))
os.rmdir(TMP)
