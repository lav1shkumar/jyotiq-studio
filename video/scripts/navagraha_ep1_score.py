"""नवग्रह जन्म Ep1 SURYA: original score and SFX, synthesized from scratch (numpy), on the reel clock.

Series instruments from Manthan (tanpura Sa-Pa with Sa = A, strings + choir, santoor, temple bells, pakhawaj
dha/ta), imported read-only from manthan_ep4_score.py; santoor/whoosh/shimmer helpers copied from
manthan_ep7_score.py. Episode palette for Surya: a bright brass voice (A major), a choir swell on the tej,
a beating violet drone (A/Bb) for Chhaya, the Shani sting (low tritone, cold bell), lathe grind and sparks.
Clock: navagraha-ep1/audio/vo/clock.json (written by tools/vo_prep.py); cut frames mirror Episode1.tsx.
Writes float32 stems to navagraha-ep1/audio/stems/. Nothing here samples or imitates existing music.

Run: /Users/ayushrajput/earshot/.venv/bin/python scripts/navagraha_ep1_score.py
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

EP = Path("/Users/ayushrajput/.kiro/crew/workspace/navagraha-ep1")
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


C = dict(shadow=A_(2) - 2, title=B_(2) + 4, surya=A_(3) - 3, sanjna=A_(4) - 2, love=A_(6) - 2, tej=A_(7) - 2, make=A_(9) - 2,
         mirror=A_(10) - 2, forest=A_(11) - 2, truth=A_(13) - 2, curse=A_(14) - 2, real=A_(16) - 3, work=A_(17) - 2,
         lathe=A_(18) - 2, bow=A_(19) - 3, reunion=A_(20) - 2, shani=A_(21) - 2, feature=A_(23) - 3, phone=A_(24) - 2,
         end=B_(24) + 4)
K = dict(chhaya=cue(9, "छाया"), yama=cue(14, "यम"), shraap=cue(15, "श्राप"), surya3=cue(3, "सूर्य"), tej7=cue(7, "तेज"),
         prem=cue(20, "प्रेम"), shani=A_(22), sach=A_(13), sanjna5=cue(5, "संज्ञा"), tap=cue(12, "तप"), nahi=cue(16, "श्राप"))

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
    # the drone sits out under the brand sonic and drops for the Shani sting
    g = np.ones(N, np.float32)
    ramp = lambda a, b, v0, v1: (int(sec(a) * SR), int(sec(b) * SR), v0, v1)  # noqa: E731
    for a, b, v0, v1 in [ramp(0, 120, 0.25, 0.25), ramp(120, 150, 0.25, 1.0), ramp(K["shani"] - 6, K["shani"] + 30, 1.0, 0.35),
                         ramp(K["shani"] + 30, C["feature"], 0.35, 1.0)]:
        g[a:b] = np.linspace(v0, v1, b - a)
    return buf * g[:, None]


def pad():
    buf = np.zeros((N, 2), np.float32)
    # hook (under the brand sonic): a dark, low choir of mystery, rising toward 'परछाईं'
    seg(buf, "choir", 0, C["shadow"], ["A2", "E3"], 0.26, att=1.2, rel=0.3, shape="cresc", seed=1)
    seg(buf, "str", 40, C["shadow"], ["A1", "E2"], 0.32, att=1.0, rel=0.2, shape="cresc", seed=2)
    # the shadow standing up: Chhaya's beating violet drone (A against komal Re)
    seg(buf, "str", C["shadow"], C["title"], ["A1", "Bb1", "E2", "Bb2"], 0.5, att=0.15, rel=0.3, trem=0.35, seed=3)
    seg(buf, "choir", C["shadow"] + 8, C["title"], ["Bb3"], 0.16, att=0.3, rel=0.3, female=True, seed=4)
    # title: Surya's A major in strings, choir and brass
    seg(buf, "str", C["title"], C["surya"], ["A2", "E3", "A3", "C#4"], 0.6, att=0.03, rel=0.6, seed=5)
    seg(buf, "choir", C["title"], C["surya"], ["A2", "E3", "A3"], 0.42, att=0.05, rel=0.6, seed=6)
    seg(buf, "brass", C["title"] + 1, C["surya"] - 4, ["A3", "E4", "A4"], 0.34, att=0.04, rel=0.5, seed=7)
    # Surya: the brass holds his chord, a fifth higher as his name is said
    seg(buf, "brass", C["surya"], C["sanjna"], ["A2", "E3", "C#4"], 0.28, att=0.2, rel=0.5, shape="swell", seed=8)
    seg(buf, "str", C["surya"], C["sanjna"], ["A2", "E3", "A3", "C#4"], 0.36, att=0.1, rel=0.5, seed=9)
    # Sanjna: Yaman warmth (tivra Ma), a soft female 'aah'
    seg(buf, "str", C["sanjna"], C["tej"], ["A2", "E3", "G#3", "C#4"], 0.36, att=0.4, rel=0.4, shape="swell", seed=10)
    seg(buf, "choir", C["sanjna"] + 6, C["tej"], ["E5"], 0.13, att=0.5, rel=0.4, female=True, seed=11)
    # the tej: strings + choir + brass crescendo into a white-out, cut dead at the next scene
    seg(buf, "str", C["tej"], C["make"], ["A2", "E3", "A3", "D#4", "E4"], 0.56, att=0.4, rel=0.06, shape="cresc", trem=0.15, seed=12)
    seg(buf, "choir", C["tej"] + 6, C["make"], ["A3", "E4", "A4"], 0.42, att=0.5, rel=0.06, shape="cresc", seed=13)
    seg(buf, "brass", A_(8) - 4, C["make"], ["A3", "D#4", "E4"], 0.3, att=0.3, rel=0.06, shape="cresc", seed=14)
    # making Chhaya: the violet drone returns; it opens into a mirrored fifth for 'हूबहू'
    seg(buf, "str", C["make"], C["mirror"], ["A1", "Bb1", "E2"], 0.48, att=0.1, rel=0.3, trem=0.3, seed=15)
    seg(buf, "choir", K["chhaya"] - 4, C["forest"], ["Bb2", "F2"], 0.22, att=0.2, rel=0.4, seed=16)
    seg(buf, "str", C["mirror"], C["forest"], ["A2", "E3", "Bb3", "E4"], 0.34, att=0.2, rel=0.5, trem=0.12, seed=17)
    # the forest: calm open fifths with the 9th, a high female 'aah' on 'तप'
    seg(buf, "str", C["forest"], C["truth"], ["A2", "E3", "B3", "E4"], 0.38, att=0.6, rel=0.2, seed=18)
    seg(buf, "choir", K["tap"] - 2, C["truth"], ["E5", "A5"], 0.13, att=0.4, rel=0.2, female=True, seed=19)
    # truth + curse: a cold cluster tightening to the strike, then the violet chord on 'श्राप'
    seg(buf, "str", C["truth"], K["shraap"], ["A2", "Bb2", "E3", "Bb3"], 0.42, att=0.05, rel=0.08, shape="cresc", trem=0.45, seed=20)
    seg(buf, "choir", C["curse"] + 10, K["shraap"], ["A2", "Bb2", "E3"], 0.3, att=0.6, rel=0.08, shape="cresc", seed=21)
    seg(buf, "str", K["shraap"], C["real"], ["A1", "Bb1", "E2", "Bb2"], 0.62, att=0.02, rel=0.6, seed=22)
    seg(buf, "choir", K["shraap"], C["real"], ["Bb2", "E3"], 0.36, att=0.03, rel=0.6, seed=23)
    # realisation: hush, a low fifth and a held breath
    seg(buf, "str", C["real"], C["work"], ["A1", "E2", "A2"], 0.34, att=0.3, rel=0.3, seed=24)
    seg(buf, "choir", K["nahi"] - 4, C["work"], ["E3"], 0.16, att=0.3, rel=0.3, seed=25)
    # workshop: steady warm strings; the lathe lowers the brass in steps (the tej being cut down)
    seg(buf, "str", C["work"], C["bow"], ["A2", "E3", "A3"], 0.36, att=0.3, rel=0.1, seed=26)
    for i, (a, b, nts) in enumerate([(C["lathe"], C["lathe"] + 16, ["A4", "E5"]), (C["lathe"] + 16, C["lathe"] + 32, ["E4", "A4"]),
                                     (C["lathe"] + 32, C["lathe"] + 48, ["A3", "E4"]), (C["lathe"] + 48, C["bow"], ["E3", "A3"])]):
        seg(buf, "brass", a, b, nts, 0.28 - 0.03 * i, att=0.02, rel=0.25, seed=27 + i)
    # the world bows: the full A major with choir and brass, broad
    seg(buf, "str", C["bow"], C["reunion"] + 6, ["A2", "E3", "A3", "C#4", "E4"], 0.6, att=0.25, rel=0.8, shape="swell", seed=31)
    seg(buf, "choir", C["bow"], C["reunion"] + 6, ["A2", "E3", "A3", "C#4"], 0.48, att=0.3, rel=0.8, shape="swell", seed=32)
    seg(buf, "brass", C["bow"] + 4, C["reunion"], ["A2", "E3", "A3", "C#4"], 0.34, att=0.3, rel=0.6, shape="swell", seed=33)
    # reunion: Sanjna's Yaman theme in warm A add9, a female 'aah' at 'प्रेम'
    seg(buf, "str", C["reunion"], C["shani"], ["A2", "E3", "B3", "C#4", "E4"], 0.44, att=0.4, rel=0.15, seed=34)
    seg(buf, "choir", K["prem"] - 4, C["shani"], ["C#5", "E5"], 0.17, att=0.3, rel=0.15, female=True, seed=35)
    # Shani: drop to the dark violet; at 'शनि' a low tritone (A / D#) and a cold choir
    seg(buf, "str", C["shani"], K["shani"], ["A1", "Bb1", "E2"], 0.44, att=0.05, rel=0.05, trem=0.25, seed=36)
    seg(buf, "str", K["shani"], C["feature"], ["A1", "D#2", "A2"], 0.6, att=0.02, rel=0.4, seed=37)
    seg(buf, "choir", K["shani"], C["feature"], ["D#3", "A3"], 0.3, att=0.05, rel=0.4, seed=38)
    # feature: bright and forward; end: warm A add9
    seg(buf, "str", C["feature"], C["end"], ["A2", "E3", "A3", "C#4"], 0.36, att=0.15, rel=0.3, seed=39)
    seg(buf, "brass", C["phone"], C["end"], ["A3", "C#4", "E4"], 0.18, att=0.2, rel=0.3, seed=40)
    seg(buf, "str", C["end"], TOTAL - 10, ["A2", "E3", "A3", "B3", "E4"], 0.42, att=0.3, rel=1.2, seed=41)
    seg(buf, "choir", C["end"], TOTAL - 10, ["A2", "E3"], 0.26, att=0.4, rel=1.2, seed=42)
    return buf


def santoor():
    buf = np.zeros((N, 2), np.float32)
    # hook: a questioning two-note fall after 'चली गई…', and the shadow motif (Bb -> E) as she is left behind
    run(buf, B_(0) + 2, ["E5", "C#5"], 0.18, 0.26, pan=(0.3, -0.3))
    run(buf, A_(2), ["Bb4", "E5"], 0.22, 0.3, pan=(-0.4, 0.4))
    # title: a rising A major run into the hit
    run(buf, C["title"] - 6, ["A4", "C#5", "E5", "A5"], 0.035, 0.34)
    # Surya's motif on his name; Sanjna's Yaman phrase on hers
    run(buf, K["surya3"], ["A4", "C#5", "E5", "F#5", "E5"], 0.09, 0.26)
    run(buf, K["sanjna5"], ["A4", "B4", "C#5", "D#5", "E5"], 0.11, 0.26, pan=(0.3, -0.3))
    run(buf, A_(6) + 4, ["E5", "D#5", "C#5", "B4"], 0.16, 0.18, pan=(-0.2, 0.3))
    # the shadow motif as Chhaya rises, then mirrored left/right on 'हूबहू'
    run(buf, K["chhaya"], ["Bb4", "E5"], 0.2, 0.3, pan=(-0.4, 0.4))
    run(buf, A_(10), ["E5", "Bb4", "Bb4", "E5"], 0.14, 0.24, pan=(-0.5, 0.5))
    # forest: a slow descending line
    run(buf, A_(12), ["E5", "C#5", "B4", "A4"], 0.26, 0.2, pan=(0.3, -0.3))
    # curse: a cold trill toward the strike
    t, i = sec(K["yama"]), 0
    while t < sec(K["shraap"]):
        add(buf, sn(["Bb4", "E5"][i % 2], 40 + i), t, 0.3 * np.sin(i * 1.7), 0.16 * (0.6 + 0.4 * (t - sec(K["yama"])) / max(0.1, sec(K["shraap"] - K["yama"]))))
        t += 1 / 13
        i += 1
    # realisation: two lonely notes
    add(buf, sn("E4", 1), sec(K["nahi"]), -0.2, 0.22)
    add(buf, sn("A4", 2), sec(K["nahi"] + 14), 0.2, 0.18)
    # reunion: Sanjna's theme returns, complete
    run(buf, C["reunion"] + 4, ["A4", "B4", "C#5", "D#5", "E5", "C#5", "E5", "A5"], 0.13, 0.24)
    # Shani: two cold notes; feature: a bright arpeggio and a sparkle as the sun lands
    run(buf, A_(21) + 6, ["Bb3", "E4"], 0.3, 0.24, pan=(-0.3, 0.3))
    run(buf, C["feature"] + 14, ["A4", "C#5", "E5", "A5", "E5", "C#5", "E5", "A5"], 0.11, 0.22)
    run(buf, C["phone"], ["A5", "E5", "C#5", "A4"], 0.05, 0.2, pan=(0.4, -0.4))
    run(buf, C["end"] + 2, ["A4", "E5", "A5"], 0.07, 0.26)
    return buf


def bells():
    buf = np.zeros((N, 2), np.float32)
    hits = [
        (C["title"], 220.0, 1.0, 0.0), (C["title"], 440.0, 0.35, 0.2),
        (K["surya3"], 659.26, 0.3, 0.25),
        (K["shraap"] + 2, 233.08, 0.5, -0.2),
        (K["nahi"] + 6, 220.0, 0.45, 0.0),
        (C["bow"] + 2, 220.0, 0.8, 0.0), (C["bow"] + 2, 440.0, 0.3, -0.2),
        (K["shani"], 233.08, 0.7, 0.0), (K["shani"], 116.54, 0.4, 0.0),
        (C["phone"], 880.0, 0.32, 0.3),
        (C["end"] + 2, 880.0, 0.4, 0.2), (C["end"] + 2, 440.0, 0.4, -0.2),
    ]
    for i, (f_, hz, g, p) in enumerate(hits):
        add(buf, bell(hz, 7.0 if hz <= 240 else 5.0, 40 + i), sec(f_), p, g)
    return buf


def drums():
    buf = np.zeros((N, 2), np.float32)
    # the curse: a pulse building from 'जब' to the strike, a dha on it
    loop(buf, sec(C["curse"] + 6), sec(K["shraap"] - 1), 96, ["D", 0, "T", 0, "D", "T", "T", 0], 0.22, 0.5, 300)
    add(buf, dha(390), sec(K["shraap"]), 0.0, 0.8)
    # workshop: soft anvil ticks; the lathe: dha on each grind hit
    for i, fr in enumerate(range(C["work"] + 6, C["lathe"] - 2, 15)):
        add(buf, tick(400 + i), sec(fr), 0.3 if i % 2 else -0.3, 0.3)
    for i, fr in enumerate([C["lathe"] + 10, C["lathe"] + 26, C["lathe"] + 42]):
        add(buf, dha(420 + i), sec(fr), 0.0, 0.6)
    # the world bows: one big hit; feature: a light forward groove
    add(buf, dha(450), sec(C["bow"]), 0.0, 0.7)
    loop(buf, sec(C["feature"] + 12), sec(C["end"]), 104, ["D", 0, "T", "T", 0, "T", "D", "T"], 0.18, 0.3, 460)
    add(buf, dha(499), sec(C["end"]), 0.0, 0.5)
    return buf


def sfx():
    buf = np.zeros((N, 2), np.float32)

    def ending_at(y, f_, pan, g):
        add(buf, y, sec(f_) - len(y) / SR, pan, g)

    # every cut lands: a short whip whose peak sits on the cut frame (whoosh peaks at ~60 % of its length)
    cuts = ["title", "surya", "sanjna", "love", "tej", "make", "mirror", "forest", "truth", "curse", "real", "work", "lathe", "bow",
            "reunion", "shani", "feature", "phone", "end"]
    for i, name in enumerate(cuts):
        w = whoosh(0.3, 10 + i, lo=500, hi=7000)
        add(buf, w, sec(C[name]) - 0.6 * 0.3, 0.45 if i % 2 else -0.45, 0.42)
    # and the big turns get a short low cut-hit on the frame
    for i, name in enumerate(["title", "make", "curse", "lathe", "bow", "shani", "feature", "end"]):
        add(buf, boom(80 + i, f0=58, dur=0.7, bright=0.5), sec(C[name]), 0.0, 0.42)
    ending_at(reverse_swell(0.6, 30, ("Bb3", "E4", "Bb4")), C["shadow"] + 20, 0.0, 0.35)  # Chhaya stands
    add(buf, boom(31, f0=44), sec(C["shadow"] + 20), 0.0, 0.5)
    add(buf, shimmer(1.0, 32, ("A5", "E6")), sec(C["title"]), 0.0, 0.2)
    ending_at(whoosh(0.4, 33, lo=600, hi=9000), C["surya"], 0.0, 0.42)  # zoom through the sun
    add(buf, sparkle(0.8, 34, n_pings=8), sec(K["surya3"]), 0.2, 0.2)
    ending_at(reverse_swell(1.0, 35), C["make"], 0.0, 0.5)  # the tej white-out
    add(buf, boom(36, f0=50, bright=0.4), sec(C["make"]), 0.0, 0.45)
    ending_at(reverse_swell(0.5, 37, ("Bb3", "E4", "Bb4")), K["chhaya"] + 12, 0.0, 0.32)
    add(buf, shimmer(0.9, 38, ("E6", "Bb5")), sec(C["mirror"] + 8), 0.0, 0.16)  # the mirror glint
    add(buf, sparkle(1.4, 39, n_pings=8, lo=2200, hi=4200, decay=0.1), sec(C["forest"] + 6), 0.3, 0.12)  # forest birds-ish
    add(buf, shimmer(1.4, 40, ("A5", "E6", "B5")), sec(K["tap"] + 6), 0.0, 0.14)  # the halo
    add(buf, crack(41), sec(K["sach"]), 0.0, 0.55)
    add(buf, boom(42, f0=40), sec(K["sach"]), 0.0, 0.5)
    ending_at(hiss(sec(K["shraap"] - K["yama"] + 4), 43), K["shraap"], 0.2, 0.42)  # the curse travelling
    add(buf, boom(44, f0=42, bright=0.5), sec(K["shraap"]), 0.1, 0.75)
    add(buf, grind(sec(C["bow"] - C["lathe"] - 6), 45), sec(C["lathe"] + 2), 0.0, 0.42)
    for i, fr in enumerate([C["lathe"] + 10, C["lathe"] + 26, C["lathe"] + 42]):
        add(buf, sparkle(0.5, 46 + i, n_pings=14, lo=3000, hi=9000, decay=0.05), sec(fr), 0.35 if i % 2 else -0.35, 0.3)
    ending_at(whoosh(0.4, 50, lo=500, hi=8000), C["bow"], 0.0, 0.42)  # into the sun-wheel
    add(buf, shimmer(1.6, 51, ("C#6", "E6", "A5")), sec(K["prem"]), 0.0, 0.18)
    ending_at(reverse_swell(0.7, 52, ("A3", "D#4", "A4")), K["shani"], 0.0, 0.45)
    add(buf, boom(53, f0=36, dur=3.0), sec(K["shani"]), 0.0, 0.85)
    for i, fr in enumerate([C["feature"] + 16, C["feature"] + 26, C["feature"] + 34, C["feature"] + 44]):
        add(buf, tick(60 + i), sec(fr), -0.2 + 0.13 * i, 0.32)  # the sun hopping across houses
    add(buf, sparkle(0.6, 65, n_pings=10, lo=3000, hi=7000), sec(C["feature"] + 44), 0.0, 0.26)
    # UI pops: name cards and the app panel pulse
    for i, fr in enumerate([C["surya"] + 8, C["sanjna"] + 4, C["mirror"] + 2, K["yama"] - 2, C["work"] + 4, C["phone"] + 8]):
        add(buf, tick(70 + i), sec(fr), -0.4, 0.22)
    return buf


def pulse():
    """v2 (13 Nov): the driving layer that makes the bed intense without masking the voice. A low string spiccato
    ostinato on a 100 bpm 16th grid, a big low frame-drum on the bar, and pakhawaj eighths. It lives below ~1 kHz,
    so the narration's 2-4 kHz stays clear; its strength follows the story (a section intensity curve)."""
    buf = np.zeros((N, 2), np.float32)
    six = 60 / 100 / 4  # one 16th at 100 bpm
    # intensity anchors (frame, 0..1): build on the hook, drive the series intro, hush for tenderness and for Surya's line
    pts = [(0, 0.3), (C["shadow"], 0.5), (C["title"] - 2, 0.6), (C["title"], 0.95), (C["surya"] - 4, 0.9), (C["surya"], 0.55),
           (C["sanjna"], 0.35), (C["tej"], 0.4), (C["make"] - 2, 1.0), (C["make"], 0.5), (C["forest"], 0.45), (C["forest"] + 6, 0.2),
           (C["truth"], 0.55), (K["shraap"] - 1, 1.0), (K["shraap"] + 20, 0.7), (C["real"], 0.0), (C["work"] - 4, 0.0),
           (C["work"], 0.5), (C["lathe"], 0.75), (C["bow"] - 2, 0.9), (C["bow"], 1.0), (C["reunion"], 0.7), (C["reunion"] + 10, 0.4),
           (C["shani"], 0.5), (K["shani"], 0.85), (C["feature"], 0.6), (C["end"], 0.35), (TOTAL, 0.2)]
    fx_, vx = zip(*pts)
    inten = lambda t: float(np.interp(t * FPS, fx_, vx))  # noqa: E731
    # harmony per section: (root, upper) for the ostinato; the violet A/Bb rub for Chhaya and the curse, A/D# for Shani
    harm = [(0, ("A1", "E2")), (C["shadow"], ("A1", "Bb1")), (C["title"], ("A1", "E2")), (C["make"], ("A1", "Bb1")),
            (C["forest"], ("A1", "E2")), (C["truth"], ("A1", "Bb1")), (C["work"], ("A1", "E2")), (C["shani"], ("A1", "Bb1")),
            (K["shani"], ("A1", "D#2")), (C["feature"], ("A1", "E2"))]
    n = int(0.32 * SR)
    tt = np.arange(n) / SR
    envs = (np.exp(-tt / 0.075) * (1 - np.exp(-tt / 0.004))).astype(np.float32)
    spic = {}
    for nm in ("A1", "Bb1", "E2", "D#2", "A2", "Bb2"):
        y = string_note(NOTE[nm] * 2, n, 700 + len(spic)) * envs  # one octave up from the name: cello-register bite
        y += 0.6 * string_note(NOTE[nm], n, 750 + len(spic)) * envs
        spic[nm] = norm(y)
    pat = [0, None, 0, 1, 0, None, 0, 2, 0, None, 0, 1, None, 0, 1, 2]  # 0 root, 1 upper, 2 root an octave up, None rest
    k, t = 0, 0.0
    while t < sec(TOTAL) - 0.6:
        g = inten(t)
        if g > 0.04 and pat[k % 16] is not None:
            fr = t * FPS
            lo, hi = next(h for a, h in reversed(harm) if fr >= a)
            nm = [lo, hi, {"A1": "A2", "Bb1": "Bb2"}.get(lo, "A2")][pat[k % 16]]
            acc = 1.0 if k % 4 == 0 else 0.72
            add(buf, spic[nm], t, -0.25 if k % 2 else 0.25, 0.5 * g * acc)
        # the big drum on the bar (and on beat 3 when it drives); pakhawaj eighths once the story pushes
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
