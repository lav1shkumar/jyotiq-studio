"""Diwali Day 3 (पाँच दीये · छोटी दिवाली) - original score, SFX bed and Kaal time layer, synthesized from scratch (numpy).

Writes 32-bit float stems (48 kHz stereo) into diwali-d3/audio/stems/ (outside Remotion's public/ folder; only
mix.wav goes to public/): tanpura, pad, santoor (santoor + bansuri), bells, drums, sfx, kaal, kaal_fx and the
narrator hall IR. Follows diwali-d3/PLAN.md's Audio section. Built on the Manthan helpers: the DSP primitives are
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
import diwali_d3_audio as A  # noqa: E402  (same clock as the picture)
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
    S, C = SCENES, CUES
    hk = S["hook"]
    # hook: an A minor question on the empty moon; the sky erupts into A major on 'बड़ा'; bare on 'क्यों'
    seg(buf, "str", 0, C["bada01"], ["A1", "E2", "A2", "C3"], 0.5, att=0.05, rel=0.2, shape="cresc", trem=0.12, seed=1)
    seg(buf, "str", C["bada01"] - 1, C["kyon01"], ["A2", "E3", "A3", "C#4", "E4"], 0.6, att=0.03, rel=0.2, seed=2)
    seg(buf, "choir", C["bada01"] - 1, C["kyon01"], ["A3", "E4", "A4"], 0.34, att=0.04, rel=0.2, female=True, seed=3)
    seg(buf, "choir", C["kyon01"], hk[1] + 6, ["E5"], 0.22, att=0.08, rel=0.5, female=True, seed=30)
    # the series title hit, in A major
    seg(buf, "str", C["titleHit"], S["title"][1] + 12, ["A2", "E3", "A3", "C#4"], 0.6, att=0.03, rel=0.9, seed=4)
    seg(buf, "choir", C["titleHit"], S["title"][1] + 12, ["A2", "E3"], 0.36, att=0.05, rel=0.9, seed=5)
    # 02: the sky: a thin, cold open fifth, sinking to A minor on 'कमज़ोर'
    sk = S["sky"]
    seg(buf, "str", sk[0], C["kamzor02"], ["A1", "E2", "E3"], 0.34, att=0.4, rel=0.3, trem=0.1, seed=6)
    seg(buf, "str", C["kamzor02"], sk[1] + 4, ["A1", "E2", "A2", "C3"], 0.38, att=0.15, rel=0.4, seed=7)
    # 03: the rishis: warmth arrives; full A major as the diyas spread on 'दीये'
    ri = S["rishis"]
    seg(buf, "str", ri[0], C["dharti03"], ["D3", "A3", "D4"], 0.3, att=0.3, rel=0.3, seed=8)
    seg(buf, "str", C["dharti03"], ri[1] + 4, ["A2", "E3", "A3", "C#4", "E4"], 0.44, att=0.2, rel=0.3, shape="cresc", seed=9)
    seg(buf, "choir", C["diye03"], ri[1] + 4, ["A4", "C#5"], 0.22, att=0.15, rel=0.3, female=True, seed=10)
    # 04: Lakshmi: radiant and quiet, so her voice carries
    la = S["lakshmi"]
    seg(buf, "str", la[0], la[1] + 6, ["A2", "E3", "A3", "C#4"], 0.28, att=0.15, rel=0.5, seed=11)
    seg(buf, "choir", la[0], la[1] + 6, ["E4", "A4", "C#5"], 0.2, att=0.2, rel=0.5, female=True, seed=12)
    # 05: Ayodhya: a homecoming that swells, opening fully on 'जगमगा'
    ay = S["ayodhya"]
    seg(buf, "str", ay[0], C["jagmaga05"], ["A2", "E3", "A3"], 0.34, att=0.3, rel=0.2, shape="cresc", seed=13)
    seg(buf, "str", C["jagmaga05"], ay[1] + 6, ["A2", "E3", "A3", "C#4", "E4"], 0.52, att=0.05, rel=0.5, seed=14)
    seg(buf, "choir", C["jagmaga05"], ay[1] + 6, ["A4", "E5"], 0.28, att=0.1, rel=0.5, female=True, seed=15)
    # 06: the years: low and patient; a suspended question over 'दशा'
    da = S["dasha"]
    seg(buf, "str", da[0], C["cap06b"], ["A1", "E2", "A2"], 0.36, att=0.2, rel=0.3, trem=0.1, seed=16)
    seg(buf, "str", C["cap06b"], da[1] + 4, ["A2", "E3", "B3"], 0.32, att=0.2, rel=0.3, seed=17)
    # 07: dawn: the reel's emotional peak, resolving on 'ख़त्म' as diya 3 lights
    dw = S["dawn"]
    seg(buf, "str", dw[0], C["khatam07"], ["D3", "F#3", "A3", "D4"], 0.34, att=0.2, rel=0.2, shape="cresc", seed=18)
    seg(buf, "str", C["khatam07"], dw[1] + 6, ["A2", "E3", "A3", "C#4", "E4"], 0.56, att=0.04, rel=0.7, seed=19)
    seg(buf, "choir", C["khatam07"], dw[1] + 6, ["A3", "E4", "A4"], 0.34, att=0.06, rel=0.7, female=True, seed=20)
    # 08: warm under the app, then festive on the greeting
    ap = S["app"]
    seg(buf, "str", ap[0], C["cap08b"], ["A2", "E3", "A3", "B3"], 0.32, att=0.2, rel=0.3, seed=23)
    seg(buf, "str", C["cap08b"] - 4, ap[1] + 4, ["A2", "E3", "A3", "C#4", "E4"], 0.46, att=0.1, rel=0.5, seed=24)
    seg(buf, "choir", C["cap08b"] - 4, ap[1] + 4, ["E4", "A4"], 0.28, att=0.1, rel=0.5, female=True, seed=25)
    # end: a warm home chord under the sign-off and tomorrow's tease
    seg(buf, "str", S["end"][0], TOTAL - 8, ["A1", "E2", "A2", "E3"], 0.36, att=0.3, rel=1.2, seed=26)
    seg(buf, "choir", C["signoff"] + 4, TOTAL - 8, ["A2", "E3", "C#4"], 0.26, att=0.5, rel=1.2, seed=27)
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
    # hook: sparse notes on the empty moon, a bright run into 'बड़ा', the question left open on 'क्यों'
    add(buf, sn("E5", 0), sec(C["roshni01"]), -0.2, 0.2)
    add(buf, sn("C5", 0), sec(C["roshni01"]) + 0.3, 0.2, 0.18)
    santoor_run(buf, C["bada01"] - 5, ["A4", "C#5", "E5", "A5", "C#6", "E6"], 0.04, 0.3, pan=(-0.4, 0.4))
    add(buf, sn("E5", 1), sec(C["kyon01"]), -0.15, 0.26)
    add(buf, sn("F#5", 1), sec(C["kyon01"]) + 0.22, 0.15, 0.26)
    santoor_run(buf, C["titleHit"], ["A4", "E5", "A5"], 0.02, 0.34)
    # 02: two falling phrases in the gaps
    santoor_run(buf, C["amavasya02"] + 30, ["E5", "D5", "C5", "A4"], 0.2, 0.13, pan=(-0.3, 0.3))
    santoor_run(buf, C["kamzor02"] + 20, ["C5", "B4", "A4"], 0.22, 0.13, pan=(0.3, -0.3))
    # 03: one pluck per lamp as the wave spreads from 'दीये'
    gap = max(3, (S["rishis"][1] - C["diye03"]) // 7)
    for i, nm in enumerate(["A4", "C#5", "E5", "F#5", "A5", "C#6", "E6"]):
        add(buf, sn(nm, i), sec(C["diye03"] + i * gap), -0.45 + 0.15 * i, 0.22)
    # 04: a soft rise that opens on 'आती'
    santoor_run(buf, C["aati04"], ["A4", "E5", "A5", "C#6"], 0.08, 0.14, pan=(-0.1, 0.1))
    # 05: a homecoming tune, then a run for the lights
    santoor_run(buf, S["ayodhya"][0] + 6, ["A4", "C#5", "E5", "F#5", "E5", "C#5"], 0.2, 0.14, pan=(-0.3, 0.3))
    santoor_run(buf, C["jagmaga05"], ["A4", "C#5", "E5", "F#5", "A5", "C#6", "E6", "A6"], 0.07, 0.22, pan=(-0.4, 0.4))
    # 06: 'दशा' left open
    santoor_run(buf, C["dasha06"], ["E5", "B5"], 0.16, 0.18)
    # 07: the bansuri lands on Sa as diya 3 catches
    bansuri_phrase(buf, C["khatam07"] - 8, [("E5", 0.25), ("F#5", 0.2), ("A5", 1.2)], 0.32, seed=930)
    # 08: a festive tune over the tabla, a sparkle on 'फ़्री'
    santoor_run(buf, S["app"][0] + 6, ["A4", "C#5", "E5", "F#5", "E5", "C#5", "B4", "A4"], 0.17, 0.15, pan=(-0.3, 0.3))
    santoor_run(buf, C["free08"], ["E6", "C#6", "A5"], 0.05, 0.16, pan=(0.3, -0.1))
    santoor_run(buf, C["cap08b"], ["A4", "C#5", "E5", "A5", "C#6"], 0.11, 0.2, pan=(-0.2, 0.3))
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
    # a temple ghanti for Lakshmi's arrival and for Ayodhya's lights
    add(buf, ghanti(1.6, 70, rate=8.0), sec(C["lakshmi04"]), 0.35, 0.14)
    add(buf, ghanti(1.8, 71, rate=9.0), sec(C["jagmaga05"]), -0.35, 0.18)
    hits = [  # (frame, fundamental Hz, gain, pan, decay s)
        (C["titleHit"], 220.0, 0.95, 0.0, 7.0),        # the series title bell
        (C["titleHit"], 440.0, 0.32, 0.2, 5.0),
        (C["kamzor02"], 165.0, 0.4, 0.0, 6.0),         # 'कमज़ोर': one low toll
        (C["lakshmi04"] + 2, 440.0, 0.34, 0.0, 6.0),   # Lakshmi appears
        (C["jagmaga05"], 880.0, 0.3, 0.1, 4.0),        # Ayodhya lights up
        (C["dasha06"], 220.0, 0.4, 0.0, 6.0),          # 'दशा'
        (C["khatam07"] + 2, 880.0, 0.36, 0.1, 4.0),    # diya 3 lights
        (C["signoff"] + 6, 220.0, 0.4, 0.0, 8.0),      # a calm bell under the close
        (C["brandChime"], 880.0, 0.32, 0.2, 5.0),      # Jyotiq sign-off chime
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
    # hook: a heartbeat under the empty moon, a big hit on 'बड़ा', one low hit on 'क्यों'
    t, k = sec(C["roshni01"]), 0
    while t < sec(C["bada01"]) - 0.2:
        add(buf, lub(10 + k), t, 0.0, 0.34 + 0.04 * k)
        t += 0.62
        k += 1
    add(buf, lub(29), sec(C["bada01"]), 0.0, 0.85)
    add(buf, lub(30), sec(C["kyon01"]), 0.0, 0.7)
    add(buf, lub(31), sec(C["titleHit"]), 0.0, 0.8)
    # 05: a slow tabla carries Ram home, lifting on 'जगमगा'
    loop(buf, sec(S["ayodhya"][0]) + 0.2, sec(C["jagmaga05"]) - 0.05, 84, ["D", None, None, "T", None, "T", "D", None], 0.2, 0.3, 61)
    loop(buf, sec(C["jagmaga05"]), sec(S["ayodhya"][1]) - 0.1, 104, ["D", None, "T", "T", "D", None, "T", None], 0.28, 0.38, 62)
    # 06-07: a patient heartbeat from 'ज्योतिष' to the resolution
    t, k = sec(C["cap06b"]), 0
    while t < sec(C["khatam07"]) - 0.3:
        add(buf, lub(40 + k % 20), t, 0.0, 0.3 + 0.012 * k)
        t += 0.8
        k += 1
    add(buf, lub(71), sec(C["khatam07"]) + 0.03, 0.0, 0.6)
    # 08: the groove through the app and the greeting
    loop(buf, sec(S["app"][0]) + 0.1, sec(S["app"][1]) - 0.1, 112, ["D", None, "T", "D", "T", None, "D", "T"], 0.28, 0.4, 63)
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


def firework(dur, seed):
    """One burst: the crack, a low thump, then a falling crackle. Computed, no samples."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    crack = band(noise(n, seed), lo=900, hi=7000) * np.exp(-t / 0.035).astype(np.float32)
    thump = np.sin(TAU * np.cumsum(58 + 60 * np.exp(-t / 0.05)) / SR) * np.exp(-t / 0.28)
    rng = np.random.default_rng(seed)
    y = np.zeros(n, np.float32)
    for at, g in zip(rng.uniform(0.12, max(0.2, dur - 0.1), 46), rng.uniform(0.2, 1.0, 46)):
        i = int(at * SR)
        m = min(int(0.012 * SR), n - i)
        y[i:i + m] += g * np.exp(-np.arange(m) / (0.002 * SR)).astype(np.float32)
    crackle = band(y, lo=2200, hi=9000) * np.exp(-t / (dur * 0.55)).astype(np.float32)
    return norm(0.9 * crack + 0.7 * thump.astype(np.float32) + 1.1 * crackle)


def sfx():
    buf = np.zeros((N, 2), np.float32)
    C, S = CUES, SCENES

    def ending_at(y, f_, pan, g):
        add(buf, y, sec(f_) - len(y) / SR, pan, g)

    # hook: distant fireworks over the city, the sky erupting on 'बड़ा', everything stopping by 'क्यों'
    B, K = C["bada01"], C["kyon01"]
    for i, (f_, pan, g) in enumerate([(2, -0.5, 0.12), (20, -0.3, 0.13), (52, 0.45, 0.14), (84, -0.45, 0.15),
                                      (B - 1, -0.5, 0.42), (B - 1, 0.5, 0.42), (B + 5, 0.0, 0.36), (B + 18, -0.3, 0.26),
                                      (B + 28, 0.35, 0.24)]):
        add(buf, firework(min(1.5, max(0.5, (K - f_) / FPS)), 200 + i), sec(f_), pan, g)
    ending_at(reverse_swell(1.0, 81), B, 0.0, 0.34)
    add(buf, sparkle(0.8, 82, n_pings=8, decay=0.1), sec(K) + 0.15, 0.2, 0.2)
    # whooshes into the scenes
    for i, name in enumerate(["rishis", "lakshmi", "ayodhya", "dasha", "dawn", "app", "end"]):
        add(buf, whoosh_m(0.5, 10 + i), sec(S[name][0]) - 0.35, 0.5 if i % 2 else -0.5, 0.2)
    # 02: a cold air under the Sun's weakness
    add(buf, whoosh_m(0.9, 28, lo=120, hi=1200), sec(C["tula02"]) - 0.1, 0.2, 0.16)
    # 03: the first flame catches, the wave spreads
    add(buf, whoomph(31), sec(C["rishi03"]) + 1.0, -0.2, 0.2)
    add(buf, sparkle(1.1, 32, n_pings=12, decay=0.12), sec(C["diye03"]), 0.2, 0.22)
    # 04: Lakshmi's glow
    add(buf, shimmer(1.2, 35, ("A5", "E6", "A6")), sec(C["lakshmi04"]), 0.0, 0.2)
    add(buf, shimmer(0.9, 36, ("E5", "A5", "C#6")), sec(C["aati04"]), 0.1, 0.14)
    # 05: the lights race across Ayodhya
    add(buf, whoosh_m(1.0, 37, lo=120, hi=1400), sec(C["ram05"]) - 0.1, 0.4, 0.2)
    add(buf, sparkle(1.4, 38, n_pings=16, decay=0.12), sec(C["jagmaga05"]), 0.0, 0.26)
    # 06: the year counter ticks up from 'चौदह' and lands on 14; the timeline slides on 'दशा'
    gap = max(2, (C["khatam06"] - C["chaudah06"]) // 14)
    for i in range(14):
        add(buf, ui_pop(300 + i, 900.0 + 40 * i, 1300.0 + 40 * i), sec(C["chaudah06"] + i * gap), 0.0, 0.08 + 0.006 * i)
    add(buf, shimmer(0.9, 40, ("A5", "E6")), sec(C["dasha06"]), 0.0, 0.14)
    # 07: diya 3 catches
    add(buf, whoomph(41), sec(C["khatam07"]) + 0.05, 0.0, 0.5)
    add(buf, sparkle(0.8, 42, n_pings=8, decay=0.1), sec(C["khatam07"]) + 0.3, -0.2, 0.2)
    # 08: the dasha card pops on 'दशा', a pop on 'फ़्री'
    add(buf, ui_pop(51), sec(C["dasha08"]), 0.15, 0.26)
    add(buf, ui_pop(53), sec(C["free08"]), 0.15, 0.22)
    add(buf, ui_pop(54, 1300.0, 2000.0), sec(C["offer"]), -0.1, 0.18)
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
    # Day 3 has no rewind: the hook tilts straight up into the same sky the title opens on
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
