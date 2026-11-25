"""Diwali Day 1 (पाँच दीये · धनतेरस) - original score, SFX bed and Kaal time layer, synthesized from scratch (numpy).

Writes 32-bit float stems (48 kHz stereo) into diwali-d1/audio/stems/ (outside Remotion's public/ folder; only
mix.wav goes to public/): tanpura, pad, santoor (santoor + bansuri), bells, drums, sfx, kaal, kaal_fx and the
narrator hall IR. Follows diwali-d1/PLAN.md's Audio section. Built on the Manthan helpers: the DSP primitives are
imported read-only from manthan_ep4_score.py (as Episodes 6-7 do) and the instruments are copied from
manthan_ep7_score.py, so Day 1 keeps the series' sound (the tanpura on Sa = A, the santoor, the temple bells, the
Kaal drone) with a Diwali palette on top: market murmur and a coin's ching in the hook, diya plucks, a lotus chime,
an ocean swell and a conch for Dhanvantari, a festive tabla at the stall, a bansuri over the health montage, the
diya's ignition, and a calm, warm close. Major (Bilawal) colours throughout; nothing here samples or imitates any
existing music.

Run: "$KIROCREW_SCRATCH/venv-audio/bin/python" scripts/diwali_d1_score.py [stem ...]
(after scripts/diwali_d1_vo_prep.py: the score follows the takes' clock through diwali_d1_audio.build_timing)
"""
import sys
import time
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
import diwali_d1_audio as A  # noqa: E402  (same clock as the picture)
from manthan_ep4_score import (  # noqa: E402
    CYCLE, SR, STRINGS, TAU, add, band, bell, choir_note, convolve, dha, drum, env_ar, lub, make_ir,
    pan_gains, pink, string_note, ta, tanpura_pluck, write_f32,
)

FPS = A.FPS
OUT = A.EP / "audio/stems"
LINES, BEATS, SCENES, CUES, TOTAL = A.build_timing(A.vo_frames())
N = int(TOTAL / FPS * SR) + 2 * SR  # 2 s of tail room; the mix trims to TOTAL
T0 = time.time()

NOTE = {"A1": 55.0, "E2": 82.41, "F#2": 92.5, "A2": 110.0, "B2": 123.47, "C#3": 138.59, "D3": 146.83,
        "E3": 164.81, "F#3": 185.0, "G#3": 207.65, "A3": 220.0, "B3": 246.94, "C3": 130.81, "C4": 261.63,
        "C#4": 277.18, "D4": 293.66, "E4": 329.63, "F#4": 369.99, "G#4": 415.30, "A4": 440.0, "B4": 493.88,
        "C5": 523.25, "C#5": 554.37, "D5": 587.33, "E5": 659.26, "F#5": 739.99, "G#5": 830.61, "A5": 880.0,
        "B5": 987.77, "C#6": 1108.73, "E6": 1318.51, "F#6": 1479.98, "A6": 1760.0}


def sec(frame):
    return frame / FPS


def noise(n, seed):
    return np.random.default_rng(seed).standard_normal(n).astype(np.float32)


def norm(y):
    return (y / max(1e-6, float(np.max(np.abs(y))))).astype(np.float32)


def seg(buf, kind, a_f, b_f, notes, gain, att=0.8, rel=1.5, shape="flat", trem=0.0, seed=0, female=False):
    """One chord of strings or choir from frame a_f to b_f (plus release), spread across the stereo field."""
    hold = max(0.05, sec(b_f - a_f))
    n = int((hold + rel) * SR)
    e = env_ar(n, att, hold, rel, shape)
    if trem:
        tt = np.arange(n) / SR
        e = e * (1 - trem * (0.5 + 0.5 * np.sin(TAU * 11.0 * tt))).astype(np.float32)
    k = len(notes)
    for j, nm in enumerate(notes):
        f = NOTE[nm]
        x = choir_note(f, n, seed * 31 + 13 * j, female) if kind == "choir" else string_note(f, n, seed * 31 + 7 * j)
        pan = 0.0 if k == 1 else (-0.45 + 0.9 * j / (k - 1))
        add(buf, x * e, sec(a_f), pan, gain / np.sqrt(k))


# ------------------------------------------------------------------------------------ tanpura + pad
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
    return buf


def pad():
    buf = np.zeros((N, 2), np.float32)
    S, B, C = SCENES, BEATS, CUES
    hk = S["hook"]
    # hook: a low, curious bed from frame 0 (short attack); the minor third leans in on 'पर उस दिन सागर से'
    # and the suspense swells to 'नहीं'; a high 'aah' carries the glint into the whiteout
    seg(buf, "str", 0, hk[1], ["A1", "E2", "A2"], 0.5, att=0.05, rel=0.4, shape="cresc", seed=1)
    seg(buf, "str", C["cap01b"] - 2, C["nahi"] + 4, ["C3", "E3", "A3"], 0.3, att=0.3, rel=0.3, shape="cresc", trem=0.15, seed=2)
    seg(buf, "choir", C["strike"] - 4, hk[1] + 6, ["E5"], 0.22, att=0.25, rel=0.5, shape="cresc", female=True, seed=3)
    # the series title hit in A major as the Manthan sea appears
    seg(buf, "str", C["titleHit"], S["title"][1] + 12, ["A2", "E3", "A3", "C#4"], 0.6, att=0.03, rel=0.9, seed=4)
    seg(buf, "choir", C["titleHit"], S["title"][1] + 12, ["A2", "E3"], 0.36, att=0.05, rel=0.9, seed=5)
    # 02: warm A major for the five diyas; the IV chord (D) blooms with Lakshmi's lotus; suspended on 'क्यों?'
    dy = S["diyas"]
    seg(buf, "str", dy[0], C["lakshmi"], ["A2", "E3", "C#4"], 0.36, att=0.5, rel=0.4, seed=6)
    seg(buf, "str", C["lakshmi"] - 2, C["kyon"] - 2, ["D3", "F#3", "A3", "D4"], 0.36, att=0.3, rel=0.4, shape="swell", seed=7)
    seg(buf, "str", C["kyon"] - 2, dy[1] + 4, ["A2", "E3", "B3"], 0.32, att=0.1, rel=0.3, trem=0.1, seed=8)
    # 03: a rising choir from 'मंथन' to the reveal on 'धन्वंतरि' (full A major, high voices), warm after;
    # a swell from 'कलश' into the match cut
    ri = S["rise"]
    seg(buf, "choir", C["manthan03"] - 4, C["dhanvantari"], ["A2", "E3", "A3"], 0.42, att=0.6, rel=0.2, shape="cresc", seed=9)
    seg(buf, "str", ri[0], C["dhanvantari"], ["A2", "E3"], 0.34, att=0.6, rel=0.2, shape="cresc", seed=10)
    seg(buf, "str", C["dhanvantari"], C["kalash03"], ["A2", "E3", "A3", "C#4", "E4"], 0.5, att=0.05, rel=0.4, seed=11)
    seg(buf, "choir", C["dhanvantari"], C["kalash03"], ["C#5", "E5"], 0.2, att=0.1, rel=0.4, female=True, seed=12)
    seg(buf, "str", C["kalash03"] - 6, ri[1] + 4, ["A2", "E3", "A3", "E4"], 0.48, att=0.3, rel=0.3, shape="cresc", seed=13)
    # 04: the stall, festive and light: A, the IV on 'परंपरा', home again on 'याद'
    mk = S["market"]
    seg(buf, "str", mk[0], C["parampara"], ["A2", "E3", "A3"], 0.32, att=0.2, rel=0.3, seed=14)
    seg(buf, "str", C["parampara"], C["yaad"], ["D3", "A3", "F#4"], 0.32, att=0.2, rel=0.3, seed=15)
    seg(buf, "str", C["yaad"], mk[1] + 6, ["A2", "E3", "C#4"], 0.32, att=0.15, rel=0.4, seed=16)
    # 05: almost bare: a quiet open fifth under Dhanvantari, so his words carry
    wd = S["words"]
    seg(buf, "str", wd[0], wd[1], ["A2", "E3"], 0.2, att=0.6, rel=0.6, seed=17)
    # 06: warmth under the montage; F#m on 'पर सबसे बड़ा निवेश', D on 'निवेश', home (A) with a choir on 'सेहत'
    hl = S["health"]
    seg(buf, "str", hl[0], C["cap06b"], ["A2", "E3", "A3"], 0.28, att=0.2, rel=0.3, seed=18)
    seg(buf, "str", C["cap06b"], C["nivesh"], ["F#2", "C#3", "F#3", "A3"], 0.32, att=0.2, rel=0.3, seed=19)
    seg(buf, "str", C["nivesh"], C["sehat06"], ["D3", "F#3", "A3", "D4"], 0.34, att=0.2, rel=0.3, shape="cresc", seed=20)
    seg(buf, "str", C["sehat06"], hl[1] + 6, ["A2", "E3", "A3", "C#4", "E4"], 0.48, att=0.05, rel=0.8, seed=21)
    seg(buf, "choir", C["sehat06"], hl[1] + 6, ["A3", "E4"], 0.3, att=0.08, rel=0.8, seed=22)
    # 07: a calm night (sus2); a bright lift as सू lights on 'सूर्य'; suspended on 'बलवान है?'
    kd = S["kundali"]
    seg(buf, "str", kd[0], C["surya07"], ["A2", "E3", "B3"], 0.3, att=0.5, rel=0.3, seed=23)
    seg(buf, "str", C["surya07"], C["balwan"], ["E3", "G#3", "B3", "E4"], 0.32, att=0.1, rel=0.3, shape="swell", seed=24)
    seg(buf, "str", C["balwan"], kd[1] + 4, ["A2", "E3", "D4"], 0.28, att=0.1, rel=0.4, seed=25)
    # 08: warm A add9 under the app, brightening with a choir on the Dhanteras greeting
    ap = S["app"]
    seg(buf, "str", ap[0], C["shubh"], ["A2", "E3", "A3", "B3"], 0.3, att=0.3, rel=0.3, seed=26)
    seg(buf, "str", C["shubh"] - 4, ap[1] + 4, ["A2", "E3", "A3", "C#4", "E4"], 0.42, att=0.1, rel=0.5, seed=27)
    seg(buf, "choir", C["shubh"] - 4, ap[1] + 4, ["E4", "A4"], 0.26, att=0.1, rel=0.5, female=True, seed=28)
    # end: a low, calm open fifth for tomorrow's Yamraj tease, resolving warm under the sign-off
    seg(buf, "str", S["end"][0], TOTAL - 8, ["A1", "E2", "A2", "E3"], 0.34, att=0.4, rel=1.2, seed=29)
    seg(buf, "choir", C["signoff"] + 4, TOTAL - 8, ["A2", "E3", "C#4"], 0.24, att=0.6, rel=1.2, seed=30)
    return buf


# ------------------------------------------------------------------------------------ santoor + bansuri
# santoor_note, sn, santoor_run and tremolo are copied from manthan_ep7_score.py unchanged.
def santoor_note(f, seed, dur=2.4):
    """Hammered dulcimer: three slightly detuned strings per note, a bright hammer, highs die fast."""
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


def santoor_run(buf, at_f, names, step, gain, pan=(-0.4, 0.4), accel=1.0, v0=0):
    t, k = sec(at_f), len(names)
    for i, nm in enumerate(names):
        p = pan[0] + (pan[1] - pan[0]) * (i / max(1, k - 1))
        add(buf, sn(nm, v0 + i), t, p, gain * (0.85 + 0.15 * ((i * 7919) % 5) / 4))
        t += step
        step *= accel


def tremolo(buf, at_f, end_f, names, rate, gain, seed=0):
    t0, end = sec(at_f), sec(end_f)
    t, i, k = t0, 0, len(names)
    while t < end:
        fade = 1.0 - 0.6 * (t - t0) / max(0.1, end - t0)
        add(buf, sn(names[i % k], seed + i), t, 0.35 * np.sin(i * 1.7), gain * fade)
        t += 1.0 / rate
        i += 1


def bansuri_note(f, dur, seed, vib_delay=0.18):
    """A breathy bamboo flute: a sine with soft 2nd and 3rd partials, a delayed 5 Hz vibrato, a breath noise
    band around the pitch, a 60 ms attack and a 160 ms release."""
    rng = np.random.default_rng(seed)
    rel = 0.16
    n = int((dur + rel) * SR)
    t = np.arange(n) / SR
    vib = 1 + (15 / 1200) * np.log(2) * np.sin(TAU * 5.2 * t + rng.uniform(0, TAU)) * np.clip((t - vib_delay) / 0.2, 0, 1)
    ph = TAU * np.cumsum(f * vib) / SR
    y = np.sin(ph) + 0.18 * np.sin(2 * ph + 0.4) + 0.07 * np.sin(3 * ph + 1.1)
    breath = band(noise(n, seed + 3), lo=f * 0.8, hi=min(12000, f * 6)) * 0.16
    e = np.clip(t / 0.06, 0, 1) * np.clip((dur + rel - t) / rel, 0, 1)
    swell = 0.85 + 0.15 * np.sin(np.pi * np.clip(t / max(0.1, dur), 0, 1))
    return norm((y + breath) * e * swell)


def bansuri_phrase(buf, at_f, notes, gain, pan=0.1, seed=900):
    t = sec(at_f)
    for i, (nm, d) in enumerate(notes):
        add(buf, bansuri_note(NOTE[nm], d + 0.04, seed + i), t, pan, gain)
        t += d


def santoor():
    buf = np.zeros((N, 2), np.float32)
    C, S = CUES, SCENES
    # hook: a sparkle run rising with the glint from 'नहीं' into the whiteout
    santoor_run(buf, C["nahi"], ["E5", "F#5", "A5", "C#6", "E6"], 0.06, 0.24, pan=(-0.3, 0.4))
    # title: the series run
    santoor_run(buf, C["titleHit"], ["A4", "E5", "A5"], 0.02, 0.32)
    # 02: one pluck per diya as each slides in (the picture staggers them 5 frames apart), a run along the thread,
    # the lotus chime, and a two-note question left open on 'क्यों?'
    for i, nm in enumerate(["A4", "C#5", "E5", "F#5", "A5"]):
        add(buf, sn(nm, i), sec(C["paanch"] + i * 5 + 2), -0.4 + 0.2 * i, 0.26)
    santoor_run(buf, C["kram"], ["A4", "B4", "C#5", "E5", "F#5", "A5"], 0.11, 0.18, pan=(-0.45, 0.45))
    santoor_run(buf, C["lakshmi"] + 2, ["C#6", "E6", "A6"], 0.05, 0.16, pan=(0.1, 0.3))
    add(buf, sn("E5", 1), sec(C["kyon"]), -0.15, 0.24)
    add(buf, sn("F#5", 1), sec(C["kyon"]) + 0.22, 0.15, 0.24)
    # 03: a soft shimmer around the reveal, thinning by 'वैद्य'
    tremolo(buf, C["dhanvantari"] + 4, C["vaidya"], ["A5", "E5"], 12.0, 0.1, seed=40)
    # 04: a festive santoor tune over the tabla at the stall
    mk = S["market"]
    santoor_run(buf, mk[0] + 10, ["A4", "C#5", "E5", "F#5", "E5", "C#5", "B4", "A4"], 0.17, 0.18, pan=(-0.3, 0.3))
    santoor_run(buf, C["parampara"], ["E5", "F#5", "A5", "F#5", "E5", "C#5"], 0.15, 0.17, pan=(0.3, -0.3))
    santoor_run(buf, C["yaad"] + 2, ["A4", "E5", "A5"], 0.08, 0.2)
    # 06: the bansuri carries the turn 'पर सबसे बड़ा निवेश, अपनी सेहत में', landing on Sa (A5) at 'सेहत'
    bansuri_phrase(buf, C["cap06b"] + 2, [("E5", 0.42), ("F#5", 0.2), ("E5", 0.2), ("C#5", 0.42), ("E5", 0.3)], 0.3)
    bansuri_phrase(buf, C["sehat06"] - 6, [("A5", 1.1)], 0.3, seed=930)
    # 07: the sun rising in four notes on 'सूर्य'
    santoor_run(buf, C["surya07"], ["A4", "C#5", "E5", "A5"], 0.07, 0.22)
    # 08: a light sparkle on 'फ़्री'
    santoor_run(buf, C["free08"], ["E6", "C#6", "A5"], 0.05, 0.16, pan=(0.3, -0.1))
    # the close resolves to Sa with the offer
    santoor_run(buf, C["offer"], ["A4", "E5", "A5"], 0.08, 0.22)
    return buf


# ------------------------------------------------------------------------------------ bells + drums
def ghanti(dur, seed, rate=9.0):
    """A temple hand bell rung fast (copied from Episode 6 through Episode 7)."""
    rng = np.random.default_rng(seed)
    n = int((dur + 2.0) * SR)
    y = np.zeros(n, np.float32)
    small = [bell(1180.0 * rng.uniform(0.995, 1.005), 2.0, seed + k) for k in range(3)]
    t, k = 0.0, 0
    while t < dur:
        g = (0.6 + 0.4 * rng.random()) * (1.0 - 0.5 * t / dur)
        i = int(t * SR)
        x = small[k % 3]
        m = min(len(x), n - i)
        y[i:i + m] += g * x[:m]
        t += (1.0 / rate) * rng.uniform(0.85, 1.15)
        k += 1
    return norm(y)


def coin_ching(seed):
    """A gold coin's ching: two bright inharmonic partials, a sharp strike, a short ring."""
    n = int(1.2 * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for f, g, d in ((2637.0, 1.0, 0.35), (3951.0, 0.6, 0.22), (5274.0, 0.35, 0.12), (6213.0, 0.2, 0.08)):
        y += g * np.sin(TAU * f * t) * np.exp(-t / d)
    y *= 1 - np.exp(-t / 0.0006)
    y += band(noise(n, seed), lo=4000, hi=11000) * np.exp(-t / 0.003) * 0.5
    return norm(y)


def bells():
    buf = np.zeros((N, 2), np.float32)
    C, S = CUES, SCENES
    # the hook's market: a distant temple ghanti, low in the bed
    add(buf, ghanti(1.6, 70, rate=8.0), 0.4, 0.55, 0.14)
    add(buf, ghanti(1.2, 71, rate=7.0), sec(S["hook"][1]) - 3.4, -0.5, 0.1)
    # the coin's ching as the hand reaches for it
    add(buf, coin_ching(72), sec(C["kharid01"]), 0.15, 0.32)
    hits = [  # (frame, fundamental Hz, gain, pan, decay s)
        (C["titleHit"], 220.0, 0.95, 0.0, 7.0),        # the series title bell
        (C["titleHit"], 440.0, 0.32, 0.2, 5.0),
        (C["dhanvantari"] + 2, 220.0, 0.6, -0.1, 7.0),  # the reveal
        (C["kalash04"], 1318.5, 0.28, 0.25, 2.0),       # the brass kalash's ting
        (C["kaya"], 440.0, 0.22, 0.0, 5.0),             # 'काया'
        (C["sehat06"] + 2, 880.0, 0.32, 0.1, 4.0),      # diya 1 lights
        (C["surya07"], 659.26, 0.2, -0.15, 4.0),        # सू lights
        (C["signoff"] + 6, 220.0, 0.55, 0.0, 8.0),      # one deep, calm bell under tomorrow's tease
        (C["brandChime"], 880.0, 0.32, 0.2, 5.0),       # Jyotiq sign-off chime
    ]
    for i, (f_, hz, g, p, d) in enumerate(hits):
        add(buf, bell(hz, d, 40 + i), sec(f_), p, g)
    return buf


def loop(buf, a, b, bpm, pat, g0, g1, seed):
    """Tabla eighths from a to b seconds, gain ramping g0 -> g1 (copied from Episode 7)."""
    beat, t, k = 60 / bpm / 2, a, 0
    while t < b:
        s = pat[k % len(pat)]
        if s:
            g = (g0 + (g1 - g0) * (t - a) / max(0.1, b - a)) * (1.0 if k % 8 == 0 else 0.8)
            add(buf, dha(seed + k) if s == "D" else ta(seed + k), t, -0.15 if s == "D" else 0.2, g)
        t += beat
        k += 1


def drums():
    buf = np.zeros((N, 2), np.float32)
    S, C = SCENES, CUES
    # hook: a soft, slow suspense pulse from 'पर उस दिन' to 'नहीं', one low hit on 'नहीं'
    t, k = sec(C["cap01b"]), 0
    while t < sec(C["nahi"]) - 0.2:
        add(buf, lub(10 + k), t, 0.0, 0.32 + 0.12 * k / 6)
        t += 0.8
        k += 1
    add(buf, lub(30), sec(C["nahi"]), 0.0, 0.7)
    add(buf, lub(31), sec(C["titleHit"]), 0.0, 0.8)
    # 03: one low hit on the reveal
    add(buf, lub(40), sec(C["dhanvantari"]), 0.0, 0.8)
    # 04: a light festive tabla at the stall (dadra-like lilt), easing out before 05
    mk = S["market"]
    loop(buf, sec(mk[0]) + 0.25, sec(mk[1]) - 0.2, 104, ["D", None, "T", "D", "T", None, "D", "T"], 0.26, 0.38, 300)
    # 06: a gentle dholak lift under the montage from 'पर', stopping for the ignition on 'सेहत'
    loop(buf, sec(C["cap06b"]), sec(C["sehat06"]) - 0.05, 112, ["D", None, "T", "T", "D", None, "T", None], 0.22, 0.4, 500)
    add(buf, lub(600), sec(C["sehat06"]) + 0.07, 0.0, 0.55)
    return buf


# ------------------------------------------------------------------------------------ sfx
# whoosh_m, wave_burst, sparkle, shimmer and reverse_swell are copied from manthan_ep7_score.py unchanged.
def whoosh_m(dur, seed, lo=300, hi=5000):
    n = int(dur * SR)
    u = np.arange(n) / n
    e = (u ** 1.5) * (1 - u) ** 0.6
    return norm(band(noise(n, seed), lo=lo, hi=hi) * (e / max(1e-6, float(e.max()))).astype(np.float32))


def wave_burst(seed):
    n = int(2.2 * SR)
    t = np.arange(n) / SR
    crash = band(noise(n, seed), lo=120, hi=6000) * (1 - np.exp(-t / 0.02)) * np.exp(-t / 0.55)
    hiss = band(noise(n, seed + 1), lo=2500, hi=9000) * np.exp(-t / 1.1) * 0.35
    thump = np.sin(TAU * np.cumsum(40 + 50 * np.exp(-t / 0.08)) / SR) * np.exp(-t / 0.35) * 1.4
    return norm(crash + hiss + thump)


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


def reverse_swell(dur, seed):
    n = int(dur * SR)
    u = np.arange(n) / n
    y = band(noise(n, seed), lo=400, hi=8000) * (u ** 3) + 0.7 * shimmer(dur, seed + 1, ("A4", "E5", "A5"), 0.0) * (u ** 2)
    y[-int(0.01 * SR):] *= np.linspace(1, 0, int(0.01 * SR))
    return norm(y)


def murmur(dur, seed):
    """A festive market's murmur: band-passed pink noise in the voice range with syllable-rate wobble from a few
    overlapping 'talkers', far back (no words, no real recording)."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.zeros(n, np.float32)
    rng = np.random.default_rng(seed)
    for k in range(5):
        v = band(pink(n, seed + k), lo=rng.uniform(250, 400), hi=rng.uniform(1800, 2600))
        rate = rng.uniform(3.5, 6.0)
        syl = (0.5 + 0.5 * np.sin(TAU * rate * t + rng.uniform(0, TAU))) ** 2
        phrase = (0.5 + 0.5 * np.sin(TAU * rng.uniform(0.15, 0.35) * t + rng.uniform(0, TAU))) ** 1.5
        y += (v * syl * phrase).astype(np.float32)
    e = np.clip(t / 0.05, 0, 1) * np.clip((dur - t) / 0.6, 0, 1)
    return norm(y * e)


def shankh(dur, seed):
    """A conch (shankh): a breathy A3 with strong odd partials, a slow swell, a small rising bend at the start."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    bend = 1 - 0.03 * np.exp(-t / 0.25)
    ph = TAU * np.cumsum(220.0 * bend * (1 + 0.003 * np.sin(TAU * 4.5 * t))) / SR
    y = np.sin(ph) + 0.55 * np.sin(3 * ph) + 0.3 * np.sin(5 * ph) + 0.15 * np.sin(7 * ph) + 0.25 * np.sin(2 * ph)
    y += band(noise(n, seed), lo=400, hi=3000) * 0.25
    e = np.clip(t / 0.35, 0, 1) ** 1.5 * np.clip((dur - t) / 0.6, 0, 1)
    return norm(band(y * e, hi=4500))


def whoomph(seed):
    """A diya catching: a soft low-passed breath of air swelling over 0.25 s with a warm thump under it."""
    n = int(0.9 * SR)
    t = np.arange(n) / SR
    air = band(noise(n, seed), lo=150, hi=1800) * np.clip(t / 0.18, 0, 1) * np.exp(-np.clip(t - 0.18, 0, None) / 0.18)
    thump = np.sin(TAU * np.cumsum(70 + 60 * np.exp(-t / 0.06)) / SR) * np.exp(-t / 0.22) * 0.8
    return norm(air + thump)


def ui_pop(seed, f0=1100.0, f1=1700.0):
    """A soft UI pop: a 70 ms rising sine blip."""
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    f = f0 + (f1 - f0) * np.clip(t / 0.05, 0, 1)
    y = np.sin(TAU * np.cumsum(f) / SR) * np.exp(-t / 0.03) * (1 - np.exp(-t / 0.002))
    return norm(y)


def sfx():
    buf = np.zeros((N, 2), np.float32)
    C, S, B = CUES, SCENES, BEATS

    def ending_at(y, f_, pan, g):
        add(buf, y, sec(f_) - len(y) / SR, pan, g)

    # hook: the market's murmur from frame 0, a riser into 'नहीं', a sparkle on the glint
    hk = S["hook"]
    add(buf, murmur(sec(hk[1]) + 0.3, 80), 0.0, 0.0, 0.32)
    ending_at(reverse_swell(1.2, 81), C["nahi"], 0.0, 0.32)
    add(buf, sparkle(1.0, 82, n_pings=10, decay=0.1), sec(C["nahi"]) + 0.2, 0.2, 0.26)
    # whooshes into the scenes (the whips in 06 are tighter and faster)
    for i, name in enumerate(["rise", "words", "kundali", "app", "end"]):
        add(buf, whoosh_m(0.5, 10 + i), sec(S[name][0]) - 0.35, 0.5 if i % 2 else -0.5, 0.2)
    ending_at(whoosh_m(0.6, 20, lo=200, hi=6000), S["market"][0] + 2, 0.3, 0.32)  # forward whoosh on the match cut
    add(buf, whoosh_m(0.32, 21, lo=500, hi=7000), sec(C["jo06"]) - 0.16, -0.6, 0.34)  # whip 1
    add(buf, whoosh_m(0.32, 22, lo=500, hi=7000), sec(C["cap06b"]) - 0.16, 0.6, 0.34)  # whip 2
    # 03: the sea parts (a wave), spray as he rises, a conch on the reveal, amrit glitter on 'कलश'
    add(buf, wave_burst(30), sec(S["rise"][0]) + 0.1, 0.0, 0.42)
    add(buf, shankh(2.2, 31), sec(C["dhanvantari"]) - 0.2, -0.05, 0.3)
    add(buf, sparkle(1.0, 32, n_pings=12, decay=0.12), sec(C["kalash03"]), 0.15, 0.26)
    ending_at(reverse_swell(0.6, 33), S["market"][0], 0.0, 0.3)
    # 04: the brass shines on 'कलश'
    add(buf, shimmer(0.9, 34, ("E6", "A6")), sec(C["kalash04"]) - 0.1, 0.2, 0.18)
    # 06: the diya catches on 'सेहत', glitter as the arrow draws
    add(buf, whoomph(40), sec(C["sehat06"]) + 0.05, 0.0, 0.5)
    add(buf, sparkle(0.8, 41, n_pings=8, decay=0.1), sec(C["sehat06"]) + 0.3, -0.2, 0.2)
    # 07: a shimmer on 'सूर्य'; 08: the phone slides in, a pop on 'फ़्री'
    add(buf, shimmer(1.0, 50, ("A5", "E6")), sec(C["surya07"]) - 0.05, 0.0, 0.16)
    add(buf, whoosh_m(0.4, 51, lo=300, hi=4000), sec(S["app"][0]) + 0.05, 0.3, 0.18)
    add(buf, ui_pop(52), sec(C["free08"]), 0.15, 0.22)
    add(buf, ui_pop(53, 1300.0, 2000.0), sec(C["offer"]), -0.1, 0.18)
    _ = B  # the beats need no extra glue
    return buf


# ------------------------------------------------------------------------------------ Kaal layer
def rewind_fx(dur, seed):
    """Kaal's time-rewind: a tape-scrub sweep falling then rising, under a brightening hiss (copied from Ep7)."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    u = t / dur
    f = 220 + 600 * (1 - u) ** 2 + 500 * u ** 3
    scrub = np.sin(TAU * np.cumsum(f) / SR) * (0.6 + 0.4 * np.sin(TAU * 18.0 * t))
    hiss = band(noise(n, seed), lo=1500, hi=7000) * u ** 2
    e = np.clip(u / 0.15, 0, 1) * np.clip((1 - u) / 0.1, 0, 1)
    return norm((scrub * 0.7 + hiss * 0.5) * e)


def kaal(cosmic):
    bed = np.zeros((N, 2), np.float32)
    fx = np.zeros((N, 2), np.float32)
    t = np.arange(N) / SR
    # the wheel of time: the series' low beating drone with harmonics phones can play (as Episodes 6-7)
    breath = 0.72 + 0.28 * np.sin(TAU * t / 8.5 + 0.6)
    drone = 0.5 * (np.sin(TAU * 55.0 * t) + np.sin(TAU * 55.35 * t))
    drone += 0.45 * np.sin(TAU * 110.18 * t) * (0.6 + 0.4 * np.sin(TAU * 0.11 * t))
    drone += 0.25 * np.sin(TAU * 165.2 * t) * (0.5 + 0.5 * np.sin(TAU * 0.07 * t + 1.0))
    drone += 0.12 * np.sin(TAU * 220.4 * t) * (0.5 + 0.5 * np.sin(TAU * 0.05 * t + 2.0))
    drone = (0.5 * drone * breath).astype(np.float32)
    bed += drone[:, None]
    del drone, breath
    wind = band(pink(N, 11), lo=180, hi=900)
    swell = ((0.5 + 0.5 * np.sin(TAU * t / 11.0 + 1.3)) ** 1.5).astype(np.float32)
    gl, gr = pan_gains(0.5 * np.sin(TAU * t / 17.0))
    bed[:, 0] += 0.2 * wind * swell * gl.astype(np.float32)
    bed[:, 1] += 0.2 * wind * swell * gr.astype(np.float32)
    del wind, swell, gl, gr, t
    # a soft time-boom on frame 0 (lighter than Manthan's: this one opens on a festive market)
    n = int(2.4 * SR)
    tb = np.arange(n) / SR
    ph = TAU * np.cumsum(40 + 48 * np.exp(-tb / 0.12)) / SR
    boom = (np.sin(ph) + 0.4 * np.sin(2 * ph) + 0.15 * np.sin(3 * ph)) * np.exp(-tb / 1.0) * (1 - np.exp(-tb / 0.004))
    boom = boom.astype(np.float32) + band(noise(n, 3), hi=400) * np.exp(-tb / 0.05).astype(np.float32) * 0.4
    y = convolve(boom, cosmic) * 0.5
    y[:n] += boom[:, None]
    add(fx, y, 0.0, gain=0.55)
    # Kaal rewinds time from today's market back to the Manthan: from just before the dissolve into the title hit
    rw = rewind_fx(max(0.5, sec(CUES["titleHit"] - CUES["dissolve"] + 14)), 7)
    add(fx, rw, sec(CUES["dissolve"] - 14), 0.0, 0.42)
    return bed, fx


STEMS = {"tanpura": tanpura, "pad": pad, "santoor": santoor, "bells": bells, "drums": drums, "sfx": sfx}


def finish(name, x, wet=0.0, ir=None, lp=None, peak=0.5):
    """The series' finishing pass: hall reverb, low-pass, a 1.4 s end fade, peak 0.5, dBFS report."""
    if ir is not None and wet > 0:
        x = x + wet * convolve(x, ir)[: len(x)]
    if lp:
        x = band(x, hi=lp)
    end = int(TOTAL / FPS * SR)
    fade = int(1.4 * SR)
    g = np.ones(len(x), np.float32)
    g[end - fade:end] = np.linspace(1, 0, fade) ** 2
    g[end:] = 0
    x = x * g[:, None]
    m = float(np.max(np.abs(x)))
    if peak and m > 0:
        x = x * (peak / m)
    write_f32(OUT / f"{name}.wav", x)
    rms = 20 * np.log10(float(np.sqrt(np.mean(x[:end] ** 2))) + 1e-9)
    pk = 20 * np.log10(float(np.max(np.abs(x))) + 1e-9)
    print(f"{name:12s} peak {pk:6.1f} dBFS  rms {rms:6.1f} dBFS  ({time.time() - T0:4.0f} s)", flush=True)


FINISH = {"tanpura": (0.35, 9000), "pad": (0.45, 5600), "santoor": (0.4, 11000), "bells": (0.5, None),
          "drums": (0.18, 7000), "sfx": (0.3, None)}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    print(f"TOTAL {TOTAL} frames = {TOTAL / FPS:.2f} s; writing stems to {OUT}", flush=True)
    hall = make_ir(2.4, 3.0, 0.025, seed=5)
    cosmic = make_ir(5.5, 6.0, 0.06, seed=33, dark=1.4)
    write_f32(OUT / "ir_narrator.wav", make_ir(2.6, 3.2, 0.035, seed=21, dark=1.8) * 0.5)
    only = set(sys.argv[1:])
    for name, fn in STEMS.items():
        if not only or name in only:
            wet, lp = FINISH[name]
            finish(name, fn(), wet, hall, lp=lp)
    if not only or only & {"kaal", "kaal_fx"}:
        bed, fx = kaal(cosmic)
        finish("kaal", bed)
        finish("kaal_fx", fx)
    print("SCORE DONE", flush=True)


if __name__ == "__main__":
    main()
