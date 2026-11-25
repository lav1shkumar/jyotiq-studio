"""नवग्रह जन्म Ep2 SHANI: original score and SFX, synthesized from scratch (numpy), on the reel clock.

Same series instruments and helpers as Ep1 (copied from navagraha_ep1_score.py, which stays untouched): tanpura
Sa-Pa (Sa = A), strings + choir, Surya's brass, santoor, temple bells, pakhawaj, and Ep1 v2's driving pulse
layer. Episode palette for Shani: the low tritone A / D# and a cold choir for Shani, the violet A / Bb rub for
Chhaya, a heat shimmer for her tapas, a deep reverent choir and bell for Shiva, the full A major when the tej returns.
Clock: navagraha-ep2/audio/vo/clock.json; cut frames mirror Episode2.tsx. Writes stems to navagraha-ep2/audio/stems/.

Run: /Users/ayushrajput/earshot/.venv/bin/python scripts/navagraha_ep2_score.py
"""
import json
import sys
import time
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
from manthan_ep4_score import (  # noqa: E402
    CYCLE, SR, STRINGS, TAU, add, band, bell, choir_note, convolve, dha, drum, env_ar, lub, make_ir, string_note, ta,
    tanpura_pluck, write_f32,
)

EP = Path("/Users/ayushrajput/.kiro/crew/workspace/navagraha-ep2")
OUT = EP / "audio/stems"
CLK = json.loads((EP / "audio/vo/clock.json").read_text())
FPS = 30
TOTAL = CLK["total"]
PH = CLK["phrases"]
WD = CLK["words"]
N = int(TOTAL / FPS * SR) + 2 * SR
T0 = time.time()

A_ = lambda i: PH[i]["fa"]  # noqa: E731
B_ = lambda i: PH[i]["fb"]  # noqa: E731


def cue(p, w):
    for x in WD:
        if x["p"] == p and x["w"].startswith(w):
            return x["fa"]
    return PH[p]["fa"]


C = dict(say=A_(2) - 3, title=B_(2) + 4, surya=A_(3) - 3, shani=A_(4) - 2, tapas=A_(5) - 2, born=A_(7) - 2, doubt=A_(9) - 2,
         insult=A_(11) - 2, look=A_(12) - 2, dim=A_(13) - 2, sharan=A_(15) - 2, sach=A_(16) - 2, boon=A_(18) - 2, ring=A_(20) - 2,
         feature=A_(22) - 3, phone=A_(23) - 2, end=B_(24) + 4)
K = dict(shani=cue(4, "शनि"), dhoop=cue(6, "धूप"), shiva=cue(6, "शिव"), saanwle=cue(8, "साँवले"), shak=cue(10, "शक"),
         apmaan=cue(11, "अपमान"), najar=cue(13, "नज़र"), dhundh=cue(14, "धुँधला"), sach=cue(16, "सच"), tej=A_(17), var=cue(19, "वर"),
         navagraha=cue(20, "नवग्रहों"), nyay=cue(21, "न्याय"), surya3=cue(3, "सूर्य"))
I2 = CLK["intro"][1]["fa"]  # "नवग्रह जन्म।" on the title

NOTE = {"A1": 55.0, "Bb1": 58.27, "D#2": 77.78, "E2": 82.41, "F2": 87.31, "A2": 110.0, "Bb2": 116.54, "B2": 123.47,
        "C#3": 138.59, "D3": 146.83, "D#3": 155.56, "E3": 164.81, "F#3": 185.0, "G#3": 207.65, "A3": 220.0, "Bb3": 233.08,
        "B3": 246.94, "C#4": 277.18, "D4": 293.66, "D#4": 311.13, "E4": 329.63, "F#4": 369.99, "G#4": 415.30, "A4": 440.0,
        "Bb4": 466.16, "B4": 493.88, "C#5": 554.37, "D#5": 622.25, "E5": 659.26, "F#5": 739.99, "G#5": 830.61, "A5": 880.0,
        "Bb5": 932.33, "B5": 987.77, "C#6": 1108.73, "E6": 1318.51, "F#6": 1479.98}


def sec(fr):
    return fr / FPS


def noise(n, seed):
    return np.random.default_rng(seed).standard_normal(n).astype(np.float32)


def norm(y):
    return (y / max(1e-6, float(np.max(np.abs(y))))).astype(np.float32)


def seg(buf, kind, a_f, b_f, notes, gain, att=0.8, rel=1.5, shape="flat", trem=0.0, seed=0, female=False):
    hold = max(0.05, sec(b_f - a_f))
    n = int((hold + rel) * SR)
    e = env_ar(n, att, hold, rel, shape)
    if trem:
        tt = np.arange(n) / SR
        e = e * (1 - trem * (0.5 + 0.5 * np.sin(TAU * 11.0 * tt))).astype(np.float32)
    k = len(notes)
    for j, nm in enumerate(notes):
        f = NOTE[nm]
        if kind == "choir":
            x = choir_note(f, n, seed * 31 + 13 * j, female)
        elif kind == "brass":
            x = brass_note(f, n, seed * 31 + 5 * j)
        else:
            x = string_note(f, n, seed * 31 + 7 * j)
        pan = 0.0 if k == 1 else (-0.45 + 0.9 * j / (k - 1))
        add(buf, x * e, sec(a_f), pan, gain / np.sqrt(k))


def brass_note(f, n, seed):
    """Surya's brass: a bright saw-like stack whose brightness opens with the attack (lip buzz), two voices."""
    rng = np.random.default_rng(seed)
    t = np.arange(n) / SR
    y = np.zeros(n)
    bright = 1 - np.exp(-t / 0.18)
    for cents in (-4.0, 4.0):
        fc = f * 2 ** (cents / 1200)
        vib = 1 + 0.003 * np.sin(TAU * 5.2 * t + rng.uniform(0, TAU)) * np.clip(t / 0.6, 0, 1)
        ph = TAU * np.cumsum(fc * vib) / SR
        for h in range(1, int(min(16, 7000 / f)) + 1):
            amp = (1 / h) * (0.35 + 0.65 * bright ** (0.4 * h))
            y += amp * np.sin(h * ph + rng.uniform(0, TAU))
    return norm(band(y.astype(np.float32), hi=6500))


# ------------------------------------------------------------------ santoor (copied from Manthan Ep6/7)
def santoor_note(f, seed, dur=2.4):
    rng = np.random.default_rng(seed)
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    H = int(max(1, min(14, 9000 / f)))
    for cents in (-3.5, 0.0, 3.0):
        fc = f * 2.0 ** (cents / 1200.0)
        for h in range(1, H + 1):
            fh = fc * h * np.sqrt(1.0 + 3e-5 * h * h)
            a = (1.25 if h in (2, 3) else 1.0) / h ** 1.15
            d = 1.5 / (1.0 + 0.4 * (h - 1))
            y += a * np.exp(-t / d) * np.sin(TAU * fh * t + rng.uniform(0, TAU))
    y *= 1 - np.exp(-t / 0.0012)
    peak = float(np.max(np.abs(y)))
    y += band(noise(n, seed + 1), lo=2500, hi=9000) * np.exp(-t / 0.004) * 0.3 * peak
    return norm(y)


_SN = {}


def sn(nm, v):
    key = (nm, v % 3)
    if key not in _SN:
        _SN[key] = santoor_note(NOTE[nm], 500 + 7 * len(_SN))
    return _SN[key]


def run(buf, at_f, names, step, gain, pan=(-0.4, 0.4), accel=1.0, v0=0):
    t, k = sec(at_f), len(names)
    for i, nm in enumerate(names):
        p = pan[0] + (pan[1] - pan[0]) * (i / max(1, k - 1))
        add(buf, sn(nm, v0 + i), t, p, gain * (0.85 + 0.15 * ((i * 7919) % 5) / 4))
        t += step
        step *= accel


def whoosh(dur, seed, lo=300, hi=5000):
    n = int(dur * SR)
    u = np.arange(n) / n
    e = (u ** 1.5) * (1 - u) ** 0.6
    return norm(band(noise(n, seed), lo=lo, hi=hi) * (e / max(1e-6, float(e.max()))).astype(np.float32))


def sparkle(dur, seed, n_pings=10, lo=2600, hi=6200, decay=0.08):
    rng = np.random.default_rng(seed)
    n = int((dur + 0.6) * SR)
    y = np.zeros(n, np.float32)
    m = int(0.5 * SR)
    tt = np.arange(m) / SR
    for _ in range(n_pings):
        at = int(rng.uniform(0, dur) * SR)
        f = rng.uniform(lo, hi)
        p = (np.sin(TAU * f * tt) + 0.4 * np.sin(TAU * f * 2.76 * tt)) * np.exp(-tt / decay) * (1 - np.exp(-tt / 0.0008))
        e = min(m, n - at)
        y[at:at + e] += (rng.uniform(0.4, 1.0) * p[:e]).astype(np.float32)
    return norm(y)


def shimmer(dur, seed, notes=("A5", "C#6", "E6", "F#6"), glide=0.015):
    rng = np.random.default_rng(seed)
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for nm in notes:
        ph = TAU * np.cumsum(NOTE[nm] * (1 + glide * t / dur)) / SR + rng.uniform(0, TAU)
        y += np.sin(ph) * (0.55 + 0.45 * np.sin(TAU * rng.uniform(5.5, 8.5) * t + rng.uniform(0, TAU)))
    e = np.clip(t / (0.6 * dur), 0, 1) ** 1.5 * np.clip((dur - t) / 0.4, 0, 1)
    return norm(y * e)


def reverse_swell(dur, seed, notes=("A4", "E5", "A5")):
    n = int(dur * SR)
    u = np.arange(n) / n
    y = band(noise(n, seed), lo=400, hi=8000) * (u ** 3) + 0.7 * shimmer(dur, seed + 1, notes, 0.0) * (u ** 2)
    y[-int(0.01 * SR):] *= np.linspace(1, 0, int(0.01 * SR))
    return norm(y)


def boom(seed, f0=48, dur=2.4, bright=0.25):
    n = int(dur * SR)
    t = np.arange(n) / SR
    body = np.sin(TAU * np.cumsum(f0 + 70 * np.exp(-t / 0.06)) / SR) * np.exp(-t / 0.7)
    air = band(noise(n, seed), lo=80, hi=3000) * np.exp(-t / 0.25) * bright
    return norm(body + air)


def crack(seed):
    """Glass-like crack: a sharp band of noise, inharmonic pings and a short rattle."""
    n = int(1.4 * SR)
    t = np.arange(n) / SR
    snap = band(noise(n, seed), lo=2500, hi=12000) * np.exp(-t / 0.012)
    rattle = band(noise(n, seed + 1), lo=3000, hi=9000) * np.exp(-t / 0.18) * (0.5 + 0.5 * np.sign(np.sin(TAU * 38 * t))) * 0.3
    pings = sparkle(0.25, seed + 2, n_pings=8, lo=3500, hi=8000, decay=0.12)[:n]
    y = snap + rattle
    y[: len(pings)] += 0.6 * pings
    return norm(y)


def hiss(dur, seed):
    """The curse travelling: a dark breath rising in pitch, with a fizzing edge."""
    n = int(dur * SR)
    u = np.arange(n) / n
    lo = band(noise(n, seed), lo=200, hi=1400) * (u ** 1.2)
    hi = band(noise(n, seed + 1), lo=3000, hi=8000) * (u ** 2.5) * 0.5
    tone = np.sin(TAU * np.cumsum(180 + 420 * u ** 2) / SR) * 0.25 * u
    return norm(lo + hi + tone)


def grind(dur, seed, r0=6.0, r1=22.0):
    """Lathe grind: stone-on-metal noise amplitude-modulated by the turning wheel, speeding up."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    rate = r0 + (r1 - r0) * np.clip(t / (0.5 * dur), 0, 1)
    am = 0.55 + 0.45 * np.sin(TAU * np.cumsum(rate) / SR) ** 2
    y = band(noise(n, seed), lo=900, hi=7000) * am + 0.4 * band(noise(n, seed + 1), lo=120, hi=600) * am
    e = np.clip(t / 0.08, 0, 1) * np.clip((dur - t) / 0.25, 0, 1)
    return norm(y * e)


def tick(seed):
    return drum(seed, 620, 900, 0.01, 0.035, 2000, 6000, 0.004, 0.3, dur=0.2, harm2=0.2)


def loop(buf, a, b, bpm, pat, g0, g1, seed):
    beat, t, k = 60 / bpm / 2, a, 0
    while t < b:
        s = pat[k % len(pat)]
        if s:
            g = (g0 + (g1 - g0) * (t - a) / max(0.1, b - a)) * (1.0 if k % 8 == 0 else 0.8)
            add(buf, dha(seed + k) if s == "D" else ta(seed + k), t, -0.15 if s == "D" else 0.2, g)
        t += beat
        k += 1


# ------------------------------------------------------------------ stems
def tanpura():
    buf = np.zeros((N, 2), np.float32)
    rng = np.random.default_rng(2)
    plucks = [[tanpura_pluck(f, 100 * i + v) for v in range(3)] for i, (f, _, _) in enumerate(STRINGS)]
    k, t0 = 0, 0.0
    while t0 < N / SR:
        for i, (_, pan, g) in enumerate(STRINGS):
            st = t0 + i * CYCLE / 4 + (rng.uniform(-0.025, 0.025) if t0 or i else 0.0)
            add(buf, plucks[i][k % 3], st, pan, g * rng.uniform(0.85, 1.0))
        t0 += CYCLE
        k += 1
    # quiet under the brand sonic; it drops away for the glance and returns with the tej
    g = np.ones(N, np.float32)
    ramp = lambda a, b, v0, v1: (int(sec(a) * SR), int(sec(b) * SR), v0, v1)  # noqa: E731
    for a, b, v0, v1 in [ramp(0, 120, 0.25, 0.25), ramp(120, 150, 0.25, 1.0), ramp(C["look"] - 6, C["look"] + 10, 1.0, 0.3),
                         ramp(C["look"] + 10, K["tej"], 0.3, 0.3), ramp(K["tej"], K["tej"] + 20, 0.3, 1.0)]:
        g[a:b] = np.linspace(v0, v1, b - a)
    return buf * g[:, None]


def pad():
    buf = np.zeros((N, 2), np.float32)
    # hook: the father looks at the dark newborn: a low choir and strings creeping up, the violet rub under it
    seg(buf, "choir", 0, C["say"], ["A2", "E3"], 0.26, att=1.2, rel=0.2, shape="cresc", seed=1)
    seg(buf, "str", 30, C["say"], ["A1", "Bb1", "E2"], 0.34, att=1.0, rel=0.2, shape="cresc", trem=0.2, seed=2)
    # "ये मेरा बेटा नहीं।": a cold, held cluster under Surya's voice
    seg(buf, "str", C["say"], C["title"], ["A1", "Bb1", "E2", "Bb2"], 0.42, att=0.1, rel=0.2, trem=0.3, seed=3)
    seg(buf, "choir", C["say"] + 6, C["title"], ["Bb3"], 0.14, att=0.3, rel=0.2, female=True, seed=4)
    # title: Surya's A major in strings, choir and brass; Shani's cold colour enters on "नवग्रह जन्म"
    seg(buf, "str", C["title"], C["surya"], ["A2", "E3", "A3", "C#4"], 0.6, att=0.03, rel=0.6, seed=5)
    seg(buf, "choir", C["title"], C["surya"], ["A2", "E3", "A3"], 0.42, att=0.05, rel=0.6, seed=6)
    seg(buf, "brass", C["title"] + 1, C["surya"] - 4, ["A3", "E4", "A4"], 0.32, att=0.04, rel=0.5, seed=7)
    seg(buf, "choir", I2, C["surya"], ["D#4"], 0.12, att=0.4, rel=0.4, female=True, seed=70)
    # Surya: his brass; Shani: the low tritone and a cold choir
    seg(buf, "brass", C["surya"], C["shani"], ["A2", "E3", "C#4"], 0.28, att=0.15, rel=0.3, shape="swell", seed=8)
    seg(buf, "str", C["surya"], C["shani"], ["A2", "E3", "A3", "C#4"], 0.36, att=0.1, rel=0.3, seed=9)
    seg(buf, "str", C["shani"], C["tapas"], ["A1", "D#2", "A2"], 0.52, att=0.05, rel=0.4, seed=10)
    seg(buf, "choir", K["shani"] - 2, C["tapas"], ["D#3", "A3"], 0.28, att=0.1, rel=0.4, seed=11)
    # Chhaya's tapas in the sun: a high shimmering open fifth (heat), a female 'aah', a deep choir on "शिव"
    seg(buf, "str", C["tapas"], C["born"], ["A2", "E3", "B3", "E4"], 0.36, att=0.5, rel=0.3, seed=12)
    seg(buf, "str", K["dhoop"] - 4, C["born"], ["E5", "B5"], 0.12, att=0.6, rel=0.3, trem=0.4, seed=13)
    seg(buf, "choir", K["shiva"] - 2, C["born"], ["A2", "E3"], 0.3, att=0.3, rel=0.4, seed=14)
    seg(buf, "choir", C["tapas"] + 10, K["shiva"], ["E5"], 0.12, att=0.5, rel=0.3, female=True, seed=15)
    # born: warm Yaman colour (tivra Ma), tender
    seg(buf, "str", C["born"], C["doubt"], ["A2", "E3", "G#3", "C#4"], 0.36, att=0.3, rel=0.2, shape="swell", seed=16)
    seg(buf, "choir", K["saanwle"] - 4, C["doubt"], ["C#5", "E5"], 0.13, att=0.3, rel=0.2, female=True, seed=17)
    # doubt: a cold cluster tightening to "शक"
    seg(buf, "str", C["doubt"], C["insult"], ["A2", "Bb2", "E3", "Bb3"], 0.44, att=0.05, rel=0.1, shape="cresc", trem=0.45, seed=18)
    seg(buf, "choir", K["shak"], C["insult"], ["A2", "Bb2"], 0.28, att=0.03, rel=0.1, seed=19)
    # insult: low tremolo rising; look: a held breath on a high thin note
    seg(buf, "str", C["insult"], C["look"], ["A1", "D#2", "A2", "D#3"], 0.5, att=0.2, rel=0.05, shape="cresc", trem=0.35, seed=20)
    seg(buf, "str", C["look"], C["dim"], ["Bb5"], 0.12, att=0.4, rel=0.05, shape="cresc", seed=21)
    seg(buf, "choir", C["look"], C["dim"], ["D#3", "A3"], 0.24, att=0.4, rel=0.05, shape="cresc", seed=22)
    # the glance: the cluster strikes on "नज़र"; Surya's chord sinks and goes grey
    seg(buf, "str", K["najar"], C["sharan"], ["A1", "Bb1", "D#2", "A2"], 0.62, att=0.02, rel=0.5, seed=23)
    seg(buf, "brass", C["dim"], K["dhundh"] + 10, ["A3", "C#4", "E4"], 0.22, att=0.1, rel=0.6, shape="swell", seed=24)
    seg(buf, "choir", K["dhundh"], C["sharan"], ["A2", "Bb2"], 0.3, att=0.2, rel=0.5, seed=25)
    # Kailash: a deep, still choir and low strings (Shiva), the vision on "सच" a soft shimmer
    seg(buf, "choir", C["sharan"], K["tej"], ["A2", "E3", "A3"], 0.34, att=0.4, rel=0.1, seed=26)
    seg(buf, "str", C["sharan"], K["tej"], ["A1", "E2", "A2"], 0.36, att=0.4, rel=0.1, seed=27)
    # the tej returns: the full A major with brass and choir, broad, through the boon
    seg(buf, "str", K["tej"], C["ring"], ["A2", "E3", "A3", "C#4", "E4"], 0.6, att=0.04, rel=0.6, shape="swell", seed=28)
    seg(buf, "choir", K["tej"], C["ring"], ["A2", "E3", "A3", "C#4"], 0.46, att=0.05, rel=0.6, shape="swell", seed=29)
    seg(buf, "brass", K["tej"] + 1, C["boon"] + 20, ["A2", "E3", "A3", "C#4"], 0.34, att=0.04, rel=0.6, shape="swell", seed=30)
    seg(buf, "choir", K["var"] - 4, C["ring"], ["E5", "A5"], 0.12, att=0.3, rel=0.4, female=True, seed=31)
    # the nine grahas: wide and cosmic (A add9 with the 6th), then the scales: Shani's tritone resolved into A
    seg(buf, "str", C["ring"], K["nyay"], ["A2", "E3", "B3", "F#4", "C#5"], 0.42, att=0.2, rel=0.3, seed=32)
    seg(buf, "choir", K["navagraha"] - 2, K["nyay"], ["A3", "E4"], 0.26, att=0.2, rel=0.3, seed=33)
    seg(buf, "str", K["nyay"], C["feature"], ["A1", "E2", "A2", "E3", "A3"], 0.6, att=0.02, rel=0.4, seed=34)
    seg(buf, "choir", K["nyay"], C["feature"], ["A2", "E3", "A3"], 0.4, att=0.03, rel=0.4, seed=35)
    seg(buf, "brass", K["nyay"] + 1, C["feature"] - 2, ["A2", "E3", "A3"], 0.28, att=0.03, rel=0.4, seed=36)
    # feature: bright and forward; end: warm A add9
    seg(buf, "str", C["feature"], C["end"], ["A2", "E3", "A3", "C#4"], 0.36, att=0.15, rel=0.3, seed=37)
    seg(buf, "brass", C["phone"], C["end"], ["A3", "C#4", "E4"], 0.18, att=0.2, rel=0.3, seed=38)
    seg(buf, "str", C["end"], TOTAL - 10, ["A2", "E3", "A3", "B3", "E4"], 0.42, att=0.3, rel=1.2, seed=39)
    seg(buf, "choir", C["end"], TOTAL - 10, ["A2", "E3"], 0.26, att=0.4, rel=1.2, seed=40)
    return buf


def santoor():
    buf = np.zeros((N, 2), np.float32)
    # hook: a questioning fall after "देखा…", the shadow motif (Bb -> E) on "और कहा"
    run(buf, B_(0) + 2, ["E5", "C#5"], 0.18, 0.26, pan=(0.3, -0.3))
    run(buf, A_(1), ["Bb4", "E5"], 0.22, 0.3, pan=(-0.4, 0.4))
    run(buf, C["title"] - 6, ["A4", "C#5", "E5", "A5"], 0.035, 0.34)
    run(buf, K["surya3"], ["A4", "C#5", "E5", "F#5", "E5"], 0.09, 0.24)
    # Shani's motif: two cold notes, a tritone apart
    run(buf, K["shani"] + 2, ["A4", "D#5"], 0.28, 0.26, pan=(-0.3, 0.3))
    # tapas: a slow descending line; born: Sanjna's Yaman phrase, now Chhaya's lullaby
    run(buf, A_(5) + 4, ["E5", "C#5", "B4", "A4"], 0.26, 0.18, pan=(0.3, -0.3))
    run(buf, A_(8), ["A4", "B4", "C#5", "D#5", "E5"], 0.12, 0.24, pan=(0.3, -0.3))
    # look: Shani's motif again, slower, before the glance
    run(buf, A_(12) + 6, ["A4", "D#5", "A4"], 0.36, 0.2, pan=(-0.3, 0.3))
    # vision on "सच": a gentle rising run; the boon: the lullaby, complete
    run(buf, K["sach"], ["A4", "C#5", "E5", "A5"], 0.09, 0.2)
    run(buf, K["var"], ["A4", "B4", "C#5", "D#5", "E5", "C#5", "E5", "A5"], 0.12, 0.22)
    # nine grahas: nine notes rising round the ring
    run(buf, K["navagraha"], ["A4", "B4", "C#5", "E5", "F#5", "A5", "B5", "C#6", "E6"], 0.07, 0.2, pan=(-0.5, 0.5))
    # feature: a bright arpeggio; phone and end
    run(buf, C["feature"] + 14, ["A4", "C#5", "E5", "A5", "E5", "C#5", "E5", "A5"], 0.11, 0.2)
    run(buf, C["phone"], ["A5", "E5", "C#5", "A4"], 0.05, 0.2, pan=(0.4, -0.4))
    run(buf, C["end"] + 2, ["A4", "E5", "A5"], 0.07, 0.26)
    return buf


def bells():
    buf = np.zeros((N, 2), np.float32)
    hits = [
        (C["title"], 220.0, 1.0, 0.0), (C["title"], 440.0, 0.35, 0.2),
        (K["shani"], 233.08, 0.6, 0.0), (K["shani"], 116.54, 0.35, 0.0),
        (K["shiva"], 110.0, 0.7, 0.0), (K["shiva"], 220.0, 0.35, -0.2),
        (K["najar"], 233.08, 0.55, 0.1),
        (C["sharan"] + 4, 110.0, 0.5, 0.0),
        (K["tej"], 220.0, 0.8, 0.0), (K["tej"], 440.0, 0.3, -0.2),
        (K["nyay"], 220.0, 0.85, 0.0), (K["nyay"], 110.0, 0.45, 0.0),
        (C["phone"], 880.0, 0.32, 0.3),
        (C["end"] + 2, 880.0, 0.4, 0.2), (C["end"] + 2, 440.0, 0.4, -0.2),
    ]
    for i, (f_, hz, g, p) in enumerate(hits):
        add(buf, bell(hz, 7.0 if hz <= 240 else 5.0, 40 + i), sec(f_), p, g)
    return buf


def drums():
    buf = np.zeros((N, 2), np.float32)
    add(buf, dha(300), sec(C["title"]), 0.0, 0.6)
    add(buf, dha(301), sec(K["shak"]), 0.0, 0.6)
    # the insult: a pakhawaj pulse building to the glance
    loop(buf, sec(C["insult"] + 6), sec(K["najar"] - 1), 96, ["D", 0, "T", 0, "D", "T", "T", 0], 0.22, 0.5, 310)
    add(buf, dha(390), sec(K["najar"]), 0.0, 0.8)
    add(buf, dha(450), sec(K["tej"]), 0.0, 0.7)
    add(buf, dha(451), sec(K["nyay"]), 0.0, 0.7)
    loop(buf, sec(C["feature"] + 12), sec(C["end"]), 104, ["D", 0, "T", "T", 0, "T", "D", "T"], 0.18, 0.3, 460)
    add(buf, dha(499), sec(C["end"]), 0.0, 0.5)
    return buf


def sfx():
    buf = np.zeros((N, 2), np.float32)

    def ending_at(y, f_, pan, g):
        add(buf, y, sec(f_) - len(y) / SR, pan, g)

    cuts = ["say", "title", "surya", "shani", "tapas", "born", "doubt", "insult", "look", "dim", "sharan", "sach", "boon", "ring", "feature", "phone", "end"]
    for i, name in enumerate(cuts):
        w = whoosh(0.3, 10 + i, lo=500, hi=7000)
        add(buf, w, sec(C[name]) - 0.6 * 0.3, 0.45 if i % 2 else -0.45, 0.42)
    for i, name in enumerate(["title", "shani", "dim", "ring", "feature", "end"]):
        add(buf, boom(80 + i, f0=58, dur=0.7, bright=0.5), sec(C[name]), 0.0, 0.42)
    add(buf, shimmer(1.0, 32, ("A5", "E6")), sec(C["title"]), 0.0, 0.2)
    ending_at(whoosh(0.4, 33, lo=600, hi=9000), C["surya"], 0.0, 0.42)  # out of the sun
    ending_at(reverse_swell(0.7, 34, ("A3", "D#4", "A4")), K["shani"], 0.0, 0.42)  # Shani revealed
    add(buf, boom(35, f0=40, dur=2.0), sec(K["shani"]), 0.0, 0.6)
    add(buf, shimmer(2.0, 36, ("E6", "B5", "A5")), sec(K["dhoop"]), 0.0, 0.12)  # heat
    add(buf, shimmer(1.6, 37, ("A5", "E6")), sec(K["shiva"]), 0.0, 0.16)  # the trishul sign
    add(buf, crack(38), sec(K["shak"]), 0.0, 0.45)
    ending_at(reverse_swell(0.9, 39, ("Bb3", "D#4", "Bb4")), K["najar"], 0.0, 0.5)  # the glance gathering
    ending_at(hiss(1.0, 40), K["najar"] + 8, 0.0, 0.32)  # the beam crossing
    add(buf, boom(41, f0=38, dur=3.0, bright=0.5), sec(K["najar"] + 8), 0.0, 0.85)
    add(buf, shimmer(1.4, 42, ("A5", "C#6", "E6")), sec(K["sach"]), 0.0, 0.16)  # the vision
    ending_at(reverse_swell(0.8, 43), K["tej"], 0.0, 0.5)  # the tej returning
    add(buf, boom(44, f0=50, bright=0.4), sec(K["tej"]), 0.0, 0.6)
    add(buf, sparkle(1.0, 45, n_pings=10), sec(K["tej"] + 4), 0.2, 0.2)
    add(buf, shimmer(1.6, 46, ("C#6", "E6", "A5")), sec(K["var"]), 0.0, 0.16)
    add(buf, sparkle(1.4, 47, n_pings=9, lo=2600, hi=5200, decay=0.12), sec(K["navagraha"]), 0.0, 0.22)  # nine grahas lighting
    add(buf, boom(48, f0=44, dur=2.4, bright=0.35), sec(K["nyay"]), 0.0, 0.6)
    for i, fr in enumerate([C["feature"] + 16, C["feature"] + 34, C["feature"] + 52]):
        add(buf, tick(60 + i), sec(fr), -0.2 + 0.2 * i, 0.32)  # Shani moving house to house
    add(buf, sparkle(0.6, 65, n_pings=10, lo=3000, hi=7000), sec(C["feature"] + 52), 0.0, 0.24)
    for i, fr in enumerate([C["surya"] + 8, K["shani"] + 4, C["tapas"] + 6, C["sharan"] + 6, C["phone"] + 8]):
        add(buf, tick(70 + i), sec(fr), -0.4, 0.22)  # name cards and the app panel
    return buf


def pulse():
    """Ep1 v2's driving layer, re-cued for Shani: low string spiccato on a 100 bpm 16th grid, a big frame-drum on
    the bar and pakhawaj eighths, below ~1 kHz so the narration stays clear; its strength follows the story."""
    buf = np.zeros((N, 2), np.float32)
    six = 60 / 100 / 4
    pts = [(0, 0.35), (C["say"], 0.55), (C["title"] - 2, 0.55), (C["title"], 0.95), (C["surya"] - 4, 0.9), (C["surya"], 0.5),
           (C["shani"], 0.6), (C["tapas"], 0.35), (C["born"], 0.2), (C["doubt"], 0.5), (C["insult"], 0.6), (C["look"] - 2, 0.9),
           (C["look"], 0.15), (K["najar"] - 2, 0.2), (K["najar"], 1.0), (K["dhundh"] + 20, 0.7), (C["sharan"], 0.0), (K["tej"] - 2, 0.0),
           (K["tej"], 1.0), (C["boon"], 0.8), (C["ring"], 0.6), (K["nyay"], 1.0), (C["feature"], 0.6), (C["end"], 0.35), (TOTAL, 0.2)]
    fx_, vx = zip(*pts)
    inten = lambda t: float(np.interp(t * FPS, fx_, vx))  # noqa: E731
    harm = [(0, ("A1", "Bb1")), (C["title"], ("A1", "E2")), (C["shani"], ("A1", "D#2")), (C["tapas"], ("A1", "E2")),
            (C["doubt"], ("A1", "Bb1")), (C["insult"], ("A1", "D#2")), (K["tej"], ("A1", "E2"))]
    n = int(0.32 * SR)
    tt = np.arange(n) / SR
    envs = (np.exp(-tt / 0.075) * (1 - np.exp(-tt / 0.004))).astype(np.float32)
    spic = {}
    for nm in ("A1", "Bb1", "E2", "D#2", "A2", "Bb2"):
        y = string_note(NOTE[nm] * 2, n, 700 + len(spic)) * envs
        y += 0.6 * string_note(NOTE[nm], n, 750 + len(spic)) * envs
        spic[nm] = norm(y)
    pat = [0, None, 0, 1, 0, None, 0, 2, 0, None, 0, 1, None, 0, 1, 2]
    k, t = 0, 0.0
    while t < sec(TOTAL) - 0.6:
        g = inten(t)
        if g > 0.04 and pat[k % 16] is not None:
            fr = t * FPS
            lo, hi = next(h for a, h in reversed(harm) if fr >= a)
            nm = [lo, hi, {"A1": "A2", "Bb1": "Bb2"}.get(lo, "A2")][pat[k % 16]]
            add(buf, spic[nm], t, -0.25 if k % 2 else 0.25, 0.5 * g * (1.0 if k % 4 == 0 else 0.72))
        if k % 16 == 0 and g > 0.25:
            add(buf, drum(800 + k, 38, 95, 0.04, 0.42, 200, 900, 0.02, 0.12, dur=1.4, harm2=0.25), t, 0.0, 0.9 * g)
        if k % 16 == 8 and g > 0.55:
            add(buf, drum(900 + k, 40, 90, 0.04, 0.32, 200, 900, 0.02, 0.12, dur=1.2, harm2=0.25), t, 0.0, 0.7 * g)
        if k % 2 == 0 and g > 0.5:
            s = "D" if k % 8 in (0, 6) else "T"
            add(buf, dha(1000 + k) if s == "D" else ta(1000 + k), t, -0.2 if s == "D" else 0.25, 0.32 * (g - 0.3))
        t += six
        k += 1
    return buf

STEMS = {"tanpura": tanpura, "pad": pad, "santoor": santoor, "bells": bells, "drums": drums, "sfx": sfx, "pulse": pulse}
FINISH = {"tanpura": (0.35, 9000), "pad": (0.45, 5600), "santoor": (0.4, 11000), "bells": (0.5, None), "drums": (0.18, 7000), "sfx": (0.25, None),
          "pulse": (0.14, 2400)}


def finish(name, x, wet, ir, lp):
    if ir is not None and wet > 0:
        x = x + wet * convolve(x, ir)[: len(x)]
    if lp:
        x = band(x, hi=lp)
    end = int(TOTAL / FPS * SR)
    fade = int(1.2 * SR)
    g = np.ones(len(x), np.float32)
    g[end - fade:end] = np.linspace(1, 0, fade) ** 2
    g[end:] = 0
    x = (x * g[:, None])[:end]
    m = float(np.max(np.abs(x)))
    if m > 0:
        x = x * (0.5 / m)
    write_f32(OUT / f"{name}.wav", x)
    rms = 20 * np.log10(float(np.sqrt(np.mean(x ** 2))) + 1e-9)
    print(f"{name:10s} rms {rms:6.1f} dBFS  ({time.time() - T0:4.0f} s)", flush=True)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    print(f"TOTAL {TOTAL} frames = {TOTAL / FPS:.2f} s; cuts {C}; cues {K}", flush=True)
    hall = make_ir(2.4, 3.0, 0.025, seed=5)
    only = set(sys.argv[1:])
    for name, fn in STEMS.items():
        if not only or name in only:
            wet, lp = FINISH[name]
            finish(name, fn(), wet, hall, lp)
    print("SCORE DONE", flush=True)


if __name__ == "__main__":
    main()
