"""Manthan Ep6 MOHINI - original score, SFX bed and Kaal time layer, synthesized from scratch (numpy).

Writes 32-bit float stems (48 kHz stereo) into manthan-ep6/audio/stems/ (outside Remotion's public/
folder; only mix.wav goes to public/). Built in parts:
  PART 1 (this file so far):
    tanpura.wav  the series drone (Sa = A), same strings and cycle as Episodes 4-5
    pad.wav      strings + 'aah' choir: mystery and a dark stab on 'एक बूंद नहीं' (hook) -> title hit ->
                 bright swell (Dhanvantari) -> tense tremolo (Bali, brawl) that stops dead on the freeze
                 -> Yaman warmth for Mohini (tivra Ma = D#) -> dreamy (enchanted) -> suspension on 'कौन?'
                 -> A major on the conch (Vishnu) -> shimmer (amrit) -> dark komal Re (Rahu) -> warm close
  PART 2 (next): pluck melody for Mohini, bells, drums, synth SFX glue, Kaal layer, echoes.
Nothing here samples or imitates any existing show's music or voice.

Run: "$KIROCREW_SCRATCH/venv-audio/bin/python" scripts/manthan_ep6_score.py [stem ...]
"""
import sys
import time
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
import manthan_ep6_audio as A  # noqa: E402  (same clock as the picture)
# Pure DSP helpers and instruments from Episode 4, imported read-only.
from manthan_ep4_score import (  # noqa: E402
    CYCLE, SR, STRINGS, TAU, add, band, bell, choir_note, convolve, dha, drum, env_ar, lub, make_ir,
    pan_gains, pink, read_wav, string_note, ta, tanpura_pluck, write_f32,
)

FPS = A.FPS
OUT = A.EP6 / "audio/stems"
LINES, BEATS, SCENES, CUES, TOTAL = A.build_timing(A.vo_frames())
N = int(TOTAL / FPS * SR) + 2 * SR  # 2 s of tail room; the mix trims to TOTAL
T0 = time.time()

# Series key Sa = A. Yaman = A B C# D# E F# G#; Bb (komal Re) and F only for the hook's stab and Rahu.
NOTE = {"A1": 55.0, "E2": 82.41, "F2": 87.31, "A2": 110.0, "Bb2": 116.54, "B2": 123.47, "C#3": 138.59,
        "D#3": 155.56, "E3": 164.81, "F3": 174.61, "F#3": 185.0, "G#3": 207.65, "A3": 220.0, "Bb3": 233.08,
        "B3": 246.94, "C#4": 277.18, "D#4": 311.13, "E4": 329.63, "F#4": 369.99, "G#4": 415.30, "A4": 440.0,
        "B4": 493.88, "C#5": 554.37, "D#5": 622.25, "E5": 659.26, "F#5": 739.99, "G#5": 830.61, "A5": 880.0,
        "B5": 987.77, "C#6": 1108.73, "E6": 1318.51, "F#6": 1479.98}


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
    # hook: mysterious open fifth; a dark komal-Re stab when the kalash bursts on 'एक बूंद नहीं';
    # the female 'aah' leans in on 'क्यों?'
    seg(buf, "str", 0, S["hook"][1], ["A2", "E3"], 0.55, att=0.15, rel=0.5, shape="cresc", seed=1)
    seg(buf, "str", C["boond"] - 2, C["kyon"], ["Bb2", "F3", "Bb3"], 0.3, att=0.04, rel=0.4, trem=0.45, seed=2)
    seg(buf, "choir", C["kyon"] - 8, S["hook"][1] + 4, ["E4"], 0.28, att=0.3, rel=0.4, shape="cresc", female=True, seed=3)
    # title hit as the rewind lands on Episode 5's last frame
    seg(buf, "str", C["titleHit"], S["title"][1], ["A2", "E3", "A3", "C#4"], 0.7, att=0.03, rel=0.8, seed=4)
    seg(buf, "choir", C["titleHit"], S["title"][1], ["A2", "E3"], 0.42, att=0.05, rel=0.9, seed=5)
    # Dhanvantari rises: a bright swell, a high female 'aah' as his name lands
    dh = S["dhanvantari"]
    seg(buf, "str", dh[0], dh[1], ["A2", "E3", "A3", "C#4"], 0.5, att=0.6, rel=0.5, shape="swell", seed=6)
    seg(buf, "choir", C["dhanvantari"] - 6, dh[1], ["C#5", "E5"], 0.22, att=0.4, rel=0.5, female=True, seed=7)
    # Bali's claim: low tremolo, building
    seg(buf, "str", S["bali"][0], S["bali"][1], ["A1", "A2", "E3"], 0.6, att=0.05, rel=0.3, shape="cresc", trem=0.5, seed=8)
    # the brawl: tritone tremolo, cut dead on the freeze (short release)
    seg(buf, "str", S["brawl"][0], C["freeze"], ["A2", "D#3", "A3"], 0.55, att=0.03, rel=0.12, trem=0.6, seed=9)
    # Mohini: a hush on a lone high note at the freeze, then Yaman warmth (tivra Ma) as she walks in
    mo = S["mohini"]
    seg(buf, "str", C["freeze"], C["tabhi"] + 6, ["E5"], 0.14, att=0.25, rel=0.4, seed=10)
    seg(buf, "str", C["tabhi"], mo[1], ["A2", "E3", "G#3", "C#4"], 0.48, att=0.7, rel=0.6, shape="swell", seed=11)
    seg(buf, "choir", C["mohini"] - 4, mo[1], ["E5", "G#5"], 0.24, att=0.35, rel=0.6, female=True, seed=12)
    seg(buf, "str", C["mohini"], mo[1], ["D#5"], 0.1, att=0.3, rel=0.5, seed=13)
    # her ask: gentle, sweet
    ak = S["ask"]
    seg(buf, "str", ak[0], ak[1], ["A2", "E3", "A3", "C#4"], 0.38, att=0.5, rel=0.5, seed=14)
    seg(buf, "choir", ak[0], ak[1], ["E4"], 0.16, att=0.6, rel=0.5, female=True, seed=15)
    # enchanted: dreamy add6/add9 with a slow sway; a suspension on 'ये है कौन?'
    en = S["enchanted"]
    seg(buf, "str", en[0], C["kaun"], ["A2", "E3", "B3", "F#4"], 0.4, att=0.5, rel=0.4, trem=0.18, seed=16)
    seg(buf, "str", C["kaun"] - 2, en[1], ["A2", "E3", "B3", "E4"], 0.42, att=0.1, rel=0.3, shape="cresc", seed=17)
    # the reveal: full A major on the conch
    rv = S["reveal"]
    seg(buf, "str", rv[0], C["conch"], ["A2", "E3"], 0.42, att=0.2, rel=0.2, shape="cresc", seed=18)
    seg(buf, "str", C["conch"], rv[1], ["A2", "E3", "A3", "C#4", "E4"], 0.76, att=0.04, rel=0.9, seed=19)
    seg(buf, "choir", C["conch"], rv[1], ["A2", "E3", "A3"], 0.48, att=0.08, rel=0.9, seed=20)
    seg(buf, "choir", C["conch"], rv[1], ["C#5", "E5"], 0.28, att=0.15, rel=0.9, female=True, seed=21)
    # the amrit: high shimmer while she pours
    am = S["amrit"]
    seg(buf, "str", am[0], am[1], ["A3", "C#4", "E4"], 0.3, att=0.3, rel=0.4, seed=22)
    seg(buf, "choir", am[0] + 6, am[1], ["A4"], 0.16, att=0.4, rel=0.4, female=True, seed=23)
    # the impostor: dark komal Re, colder at the sting
    rh = S["rahu"]
    seg(buf, "str", rh[0], C["sting"], ["A1", "Bb2", "E3"], 0.46, att=0.4, rel=0.3, shape="cresc", seed=24)
    seg(buf, "str", C["sting"], rh[1], ["Bb2", "F3", "Bb3"], 0.4, att=0.03, rel=0.5, trem=0.4, seed=25)
    # end: calm gold under the Jyotiq close (A add9), no fear in the Rahu question
    seg(buf, "str", S["end"][0], TOTAL - 20, ["A2", "E3", "A3", "B3", "E4"], 0.42, att=1.0, rel=1.5, seed=26)
    seg(buf, "choir", C["signoff"] - 10, TOTAL - 20, ["A2", "E3"], 0.26, att=0.8, rel=1.5, seed=27)
    return buf


# ------------------------------------------------------------------------------------ santoor
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
    """Cached santoor note: three variants per pitch so repeated notes are not identical."""
    key = (nm, v % 3)
    if key not in _SN:
        _SN[key] = santoor_note(NOTE[nm], 500 + 7 * len(_SN))
    return _SN[key]


def santoor_run(buf, at_f, names, step, gain, pan=(-0.4, 0.4), accel=1.0, v0=0):
    """Notes `step` seconds apart (accelerating when accel < 1), panned across the field."""
    t, k = sec(at_f), len(names)
    for i, nm in enumerate(names):
        p = pan[0] + (pan[1] - pan[0]) * (i / max(1, k - 1))
        add(buf, sn(nm, v0 + i), t, p, gain * (0.85 + 0.15 * ((i * 7919) % 5) / 4))
        t += step
        step *= accel


def tremolo(buf, at_f, end_f, names, rate, gain, seed=0):
    """Rapid alternating strikes on a chord (the santoor's trill), thinning out toward end_f."""
    t0, end = sec(at_f), sec(end_f)
    t, i, k = t0, 0, len(names)
    while t < end:
        fade = 1.0 - 0.6 * (t - t0) / max(0.1, end - t0)
        add(buf, sn(names[i % k], seed + i), t, 0.35 * np.sin(i * 1.7), gain * fade)
        t += 1.0 / rate
        i += 1


def santoor():
    buf = np.zeros((N, 2), np.float32)
    C, S = CUES, SCENES
    # hook: two questioning notes, a fall as 'एक बूंद नहीं' lands, a rewinding run into the title
    add(buf, sn("E5", 0), sec(C["kalash01"]), -0.3, 0.32)
    add(buf, sn("C#5", 1), sec(C["boond"]), 0.3, 0.32)
    santoor_run(buf, C["nahi"], ["E5", "C#5", "A4", "E4"], 0.09, 0.3, pan=(0.4, -0.4))
    santoor_run(buf, C["rewind"], ["A5", "F#5", "E5", "C#5", "B4", "A4"], 0.05, 0.3, pan=(0.5, -0.5), accel=0.9)
    santoor_run(buf, C["titleHit"], ["A4", "E5", "A5"], 0.02, 0.34)
    # Dhanvantari: a sparkle as his name lands
    santoor_run(buf, C["dhanvantari"], ["E6", "C#6", "A5", "E5"], 0.06, 0.28, pan=(0.45, -0.45))
    # Mohini's theme (Yaman: tivra Ma D#), slow and graceful, answered a breath later
    santoor_run(buf, C["mohini"], ["A4", "B4", "C#5", "D#5", "E5"], 0.16, 0.3)
    santoor_run(buf, C["mohini"] + 30, ["G#5", "F#5", "E5"], 0.2, 0.26, pan=(0.3, -0.3))
    # her playful ask
    santoor_run(buf, C["mujhe"], ["E5", "F#5", "E5", "C#5"], 0.1, 0.24)
    santoor_run(buf, C["baant"], ["A4", "C#5", "E5"], 0.06, 0.24)
    # enchanted: dreamy single notes
    add(buf, sn("D#5", 2), sec(C["mohit"]), -0.25, 0.22)
    add(buf, sn("G#5", 0), sec(C["mohit"] + 18), 0.25, 0.2)
    # the conch: a joyful trill under the reveal
    tremolo(buf, C["conch"] + 2, S["reveal"][1], ["A5", "E5", "C#6", "E5"], 12.0, 0.28, seed=40)
    # the pour: glitter falling into the cups
    santoor_run(buf, C["pour"], ["E6", "C#6", "B5", "A5", "F#5", "E5"], 0.07, 0.28, pan=(0.5, -0.5))
    # the impostor: two cold notes a tritone apart
    add(buf, sn("Bb3", 1), sec(C["chupke"]), -0.2, 0.24)
    add(buf, sn("E4", 1), sec(C["chupke"] + 12), 0.2, 0.22)
    # the kundali
    santoor_run(buf, C["kundali"], ["B4", "E5"], 0.09, 0.2)
    return buf


# ------------------------------------------------------------------------------------ bells + drums
def ghanti(dur, seed, rate=9.0):
    """A temple hand bell rung fast: repeated strikes of a small bell."""
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


def bells():
    buf = np.zeros((N, 2), np.float32)
    C = CUES
    hits = [  # (frame, fundamental Hz, gain, pan): in the gaps between lines
        (C["titleHit"], 220.0, 1.0, 0.0),
        (C["titleHit"], 440.0, 0.35, 0.2),
        (C["dhanvantari"], 440.0, 0.45, -0.15),      # Dhanvantari rises
        (C["dhanvantari"] + 3, 659.26, 0.3, 0.25),
        (C["nameCard"] + 1, 659.26, 0.5, -0.15),     # MOHINI name card: E, G#, B
        (C["nameCard"] + 3, 830.61, 0.32, 0.25),
        (C["nameCard"] + 5, 987.77, 0.22, -0.3),
        (C["conch"], 220.0, 0.85, -0.15),            # with the conch (Vishnu)
        (C["conch"] + 2, 440.0, 0.4, 0.2),
        (C["brandChime"], 880.0, 0.35, 0.2),         # Jyotiq sign-off chime
    ]
    for i, (f_, hz, g, p) in enumerate(hits):
        add(buf, bell(hz, 7.0 if hz <= 220 else 5.0, 40 + i), sec(f_), p, g)
    add(buf, ghanti(1.2, 90), sec(C["conch"] + 3), 0.25, 0.38)
    return buf


def tok(seed):
    """A soft wooden tick."""
    return drum(seed, 620, 900, 0.01, 0.035, 2000, 6000, 0.004, 0.3, dur=0.2, harm2=0.2)


def loop(buf, a, b, bpm, pat, g0, g1, seed):
    """Tabla eighths from a to b seconds, gain ramping g0 -> g1."""
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
    # hook: a tick as the kalash bursts on 'बूंद'
    add(buf, tok(10), sec(C["boond"]), 0.0, 0.4)
    # Dhanvantari into Bali: a soft pulse that grows; a hit on 'रुको'
    loop(buf, sec(C["sagar"]), sec(S["bali"][1]) - 0.06, 100, ["D", None, "T", "T", "D", None, "T", None], 0.3, 0.6, 100)
    add(buf, dha(300), sec(C["ruko"]), 0.0, 0.9)
    # the snatch and the brawl: fast and rough, stopping dead on the freeze
    add(buf, lub(400), sec(C["chheen"]), 0.0, 1.1)
    add(buf, dha(401), sec(C["chheen"]), 0.0, 0.9)
    loop(buf, sec(C["chheen"]) + 0.2, sec(C["freeze"]) - 0.02, 140, ["D", "T", "T", "D", "T", "D", "T", "T"], 0.55, 0.85, 420)
    # Mohini's walk: light ghungroo-like taps
    t, k = sec(C["tabhi"]), 0
    while t < sec(S["mohini"][1]):
        add(buf, ta(500 + k), t, 0.3 * np.sin(k * 1.3), 0.16)
        t += 0.5
        k += 1
    # the conch: a deep hit
    add(buf, lub(600), sec(C["conch"]), 0.0, 1.0)
    add(buf, dha(601), sec(C["conch"]), 0.0, 0.8)
    # the impostor: a slow heartbeat, a low hit on the sting
    t, k = sec(C["chupke"]), 0
    while t < sec(S["rahu"][1]) - 0.3:
        add(buf, lub(700 + k), t, 0.0, 0.45)
        add(buf, lub(701 + k), t + 0.22, 0.0, 0.32)
        t += 0.9
        k += 2
    add(buf, lub(800), sec(C["sting"]), 0.0, 1.2)
    add(buf, dha(801), sec(C["sting"]), 0.0, 0.9)
    return buf


# ------------------------------------------------------------------------------------ sfx helpers
def whoosh_m(dur, seed, lo=300, hi=5000):
    """Mono whoosh (pan it with add): swells toward 70 %, then lets go."""
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


def sfx():
    buf = np.zeros((N, 2), np.float32)
    C, S = CUES, SCENES

    def ending_at(y, f_, pan, g):
        add(buf, y, sec(f_) - len(y) / SR, pan, g)

    for i, name in enumerate(["title", "dhanvantari", "bali", "brawl", "ask", "enchanted", "amrit", "rahu", "end"]):
        add(buf, whoosh_m(0.45, 10 + i), sec(S[name][0]) - 0.3, 0.5 if i % 2 else -0.5, 0.22)
    ending_at(reverse_swell(0.8, 30), C["titleHit"], 0.0, 0.45)       # the rewind lands on Episode 5
    add(buf, sparkle(0.6, 31, n_pings=16), sec(C["boond"]), 0.0, 0.5)  # the kalash bursts into sparks
    add(buf, wave_burst(32), sec(C["sagar"]), 0.0, 0.4)               # the sea parts
    add(buf, whoosh_m(0.3, 33, lo=500, hi=7000), sec(C["chheen"]) - 0.15, 0.3, 0.4)  # the snatch
    ending_at(reverse_swell(0.5, 34), C["freeze"], 0.0, 0.35)         # time stops
    add(buf, shimmer(1.6, 35, ("E5", "G#5", "B5")), sec(C["mohini"]), 0.0, 0.3)
    ending_at(reverse_swell(0.7, 36), C["conch"], 0.0, 0.45)          # into Vishnu's reveal
    add(buf, sparkle(1.6, 37, n_pings=14, decay=0.12), sec(C["pour"]), 0.2, 0.32)
    add(buf, whoosh_m(0.6, 38, lo=60, hi=900), sec(C["sting"]) - 0.4, 0.0, 0.5)
    return buf


# ------------------------------------------------------------------------------------ Kaal layer
def word_echo(cosmic, stem, cue, end_cue, at_f, taps, fade_a, fade_b):
    """Echo taps of one word cut from a trimmed take, in its own buffer, silenced from fade_b on."""
    out = np.zeros((N, 2), np.float32)
    vo = read_wav(A.VO_DIR / f"{stem}.wav").mean(axis=1)
    s = LINES[stem][0]
    w0 = max(0, int(sec(cue - s) * SR) - int(0.03 * SR))
    w1 = len(vo) if end_cue is None else min(len(vo), int(sec(end_cue - s) * SR))
    word = vo[w0:w1].copy()
    word[: int(0.01 * SR)] *= np.linspace(0, 1, int(0.01 * SR))
    word[-int(0.06 * SR):] *= np.linspace(1, 0, int(0.06 * SR))
    for d, g, lp, wetm, pan in taps:
        x = band(word, lo=140, hi=lp)
        y = convolve(x, cosmic) * wetm
        pl, pr = pan_gains(pan)
        y[: len(x), 0] += (1 - wetm) * pl * x
        y[: len(x), 1] += (1 - wetm) * pr * x
        add(out, y, sec(at_f) + d, gain=g)
    ia, ib = int(sec(fade_a) * SR), int(sec(fade_b) * SR)
    out[ia:ib] *= (np.linspace(1, 0, ib - ia) ** 2)[:, None].astype(np.float32)
    out[ib:] = 0
    return out


def kaal(cosmic):
    bed = np.zeros((N, 2), np.float32)
    fx = np.zeros((N, 2), np.float32)
    t = np.arange(N) / SR
    # the wheel of time: two close low tones beating at 0.35 Hz, with harmonics phones can play
    breath = 0.72 + 0.28 * np.sin(TAU * t / 8.5 + 0.6)
    drone = 0.5 * (np.sin(TAU * 55.0 * t) + np.sin(TAU * 55.35 * t))
    drone += 0.45 * np.sin(TAU * 110.18 * t) * (0.6 + 0.4 * np.sin(TAU * 0.11 * t))
    drone += 0.25 * np.sin(TAU * 165.2 * t) * (0.5 + 0.5 * np.sin(TAU * 0.07 * t + 1.0))
    drone += 0.12 * np.sin(TAU * 220.4 * t) * (0.5 + 0.5 * np.sin(TAU * 0.05 * t + 2.0))
    drone = (0.5 * drone * breath).astype(np.float32)
    bed += drone[:, None]
    del drone, breath
    # cosmic wind: pink noise 180-900 Hz, slow swells, slowly travelling across the stereo field
    wind = band(pink(N, 11), lo=180, hi=900)
    swell = ((0.5 + 0.5 * np.sin(TAU * t / 11.0 + 1.3)) ** 1.5).astype(np.float32)
    gl, gr = pan_gains(0.5 * np.sin(TAU * t / 17.0))
    bed[:, 0] += 0.22 * wind * swell * gl.astype(np.float32)
    bed[:, 1] += 0.22 * wind * swell * gr.astype(np.float32)
    del wind, swell, gl, gr, t
    # the time-boom at frame 0 (the series opening): a deep falling impact into a long cosmic tail
    n = int(2.6 * SR)
    tb = np.arange(n) / SR
    ph = TAU * np.cumsum(38 + 52 * np.exp(-tb / 0.12)) / SR
    boom = (np.sin(ph) + 0.4 * np.sin(2 * ph) + 0.15 * np.sin(3 * ph)) * np.exp(-tb / 1.1) * (1 - np.exp(-tb / 0.004))
    boom = boom.astype(np.float32) + band(noise(n, 3), hi=400) * np.exp(-tb / 0.05).astype(np.float32) * 0.5
    y = convolve(boom, cosmic) * 0.55
    y[:n] += boom[:, None]
    add(fx, y, 0.0, gain=0.9)
    # echoes: 'मोहिनी' after line 05 (gone before her own line), and a short slap on 'राहू'
    # inside line 10 (gone before 'आपकी')
    echo = word_echo(cosmic, "05_narrator", CUES["mohini"], None, LINES["05_narrator"][1],
                     ((0.08, 0.38, 5000, 0.45, -0.3), (0.7, 0.18, 2600, 0.85, 0.4)),
                     BEATS["reveal"][1] - 10, BEATS["reveal"][1] + 2)
    echo += word_echo(cosmic, "10_narrator", CUES["rahu"], CUES["cap10b"], CUES["rahu"],
                      ((0.28, 0.3, 3500, 0.6, 0.3),), CUES["cap10b"] - 4, CUES["cap10b"] + 8)
    return bed, fx, echo


STEMS = {"tanpura": tanpura, "pad": pad, "santoor": santoor, "bells": bells, "drums": drums, "sfx": sfx}


def finish(name, x, wet=0.0, ir=None, lp=None, peak=0.5):
    """Episode 5's finishing pass: hall reverb, low-pass, a 1.4 s end fade, peak 0.5, dBFS report."""
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


# (stem, wet, low-pass) exactly as Episode 5
FINISH = {"tanpura": (0.35, 9000), "pad": (0.45, 5600), "santoor": (0.4, 11000), "bells": (0.5, None),
          "drums": (0.18, 7000), "sfx": (0.3, None)}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    print(f"TOTAL {TOTAL} frames = {TOTAL / FPS:.2f} s; writing stems to {OUT}", flush=True)
    hall = make_ir(2.4, 3.0, 0.025, seed=5)
    cosmic = make_ir(5.5, 6.0, 0.06, seed=33, dark=1.4)
    write_f32(OUT / "ir_narrator.wav", make_ir(2.6, 3.2, 0.035, seed=21, dark=1.8) * 0.5)
    only = set(sys.argv[1:])  # optional: rebuild only the named stems
    for name, fn in STEMS.items():
        if not only or name in only:
            wet, lp = FINISH[name]
            finish(name, fn(), wet, hall, lp=lp)
    kaal_fn = globals().get("kaal")
    if kaal_fn and (not only or only & {"kaal", "kaal_fx", "echo"}):
        bed, fx, echo = kaal_fn(cosmic)
        finish("kaal", bed)
        finish("kaal_fx", fx)
        finish("echo", echo, peak=None)  # natural level, relative to the trimmed narrator takes
    print("SCORE DONE", flush=True)


if __name__ == "__main__":
    main()
