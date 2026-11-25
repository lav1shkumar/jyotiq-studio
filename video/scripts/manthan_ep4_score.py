#!/usr/bin/env python3
"""Manthan Ep4 NEELKANTH - original score + Kaal time layer, synthesized from scratch (numpy).

Writes 32-bit float stems (48 kHz stereo) into manthan-ep4/audio/stems/ (outside Remotion's
public/ folder, so the render bundle stays small; only mix.wav goes to public/):
  tanpura.wav   tanpura in the series key (Sa = A, the drone of Episodes 1-3): Pa E2, Sa A2, Sa A2,
                low Sa A1, plucked in a 3.2 s cycle, with a jawari bloom sweeping up the partials
  pad.wav       strings (3 detuned voices) + an 'aah' choir (formant-shaped) that follow the story:
                dark fifth -> poison menace -> Shiva's calm -> rising cluster into the drink -> hush ->
                A major lift on 'नीलकंठ' -> mystery -> full chant -> gold end
  bells.wav     temple bells (inharmonic partials in beating pairs), struck in the gaps
  drums.wav     low pakhawaj-like dha/ta: running pulse + roll (flee), heartbeat (palm), chant hits
  kaal.wav      ORIGINAL 'Samay'-style time layer: a slowly beating low wheel tone with phone-audible
                harmonics, plus a cosmic wind
  kaal_fx.wav   a deep time-boom at frame 0 and a reversed-reverb rise of line 07's first word
  echo.wav      a fading, travelling echo of 'नीलकंठ' made from the user's own Kaal take (natural level)
  ir_narrator.wav  impulse response for the narrator's light 'Kaal hall' (used by the mix)
Nothing here samples or imitates any existing show's music or voice.

Run: "$KIROCREW_SCRATCH/venv-audio/bin/python" scripts/manthan_ep4_score.py
"""
import struct
import sys
import time
import wave
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
import manthan_ep4_audio as A  # noqa: E402  (same clock as the picture)

SR = 48000
FPS = A.FPS
OUT = A.EP4 / "audio/stems"
LINES, BEATS, SCENES, CUES, TOTAL = A.build_timing(A.vo_frames())
N = int(TOTAL / FPS * SR) + 2 * SR  # 2 s of tail room; the mix trims to TOTAL
TAU = 2 * np.pi
T0 = time.time()

NOTE = {"A1": 55.0, "E2": 82.41, "A2": 110.0, "B2": 123.47, "C3": 130.81, "E3": 164.81, "F3": 174.61,
        "F#3": 185.0, "A3": 220.0, "Bb3": 233.08, "B3": 246.94, "C4": 261.63, "C#4": 277.18, "E4": 329.63,
        "A4": 440.0, "C#5": 554.37, "E5": 659.26}


def sec(frame):
    return frame / FPS


# ------------------------------------------------------------------------------------ io + dsp
def read_wav(path):
    with wave.open(str(path), "rb") as w:
        ch, sw, n = w.getnchannels(), w.getsampwidth(), w.getnframes()
        raw = w.readframes(n)
    if sw != 2:
        raise SystemExit(f"{path}: expected 16-bit PCM")
    return (np.frombuffer(raw, dtype="<i2").astype(np.float32) / 32768.0).reshape(-1, ch)


def write_f32(path, x):
    x = np.ascontiguousarray(x, dtype=np.float32)
    data = x.tobytes()
    ch = x.shape[1]
    hdr = b"RIFF" + struct.pack("<I", 36 + len(data)) + b"WAVE"
    hdr += b"fmt " + struct.pack("<IHHIIHH", 16, 3, ch, SR, SR * ch * 4, ch * 4, 32)
    hdr += b"data" + struct.pack("<I", len(data))
    Path(path).write_bytes(hdr + data)


def pan_gains(p):
    a = (np.asarray(p) + 1) * np.pi / 4
    return np.cos(a), np.sin(a)


def add(buf, x, at_s, pan=0.0, gain=1.0):
    """Mix mono (or stereo) x into buf from at_s seconds."""
    i = int(round(at_s * SR))
    if i < 0:
        x, i = x[-i:], 0
    n = min(len(x), len(buf) - i)
    if n <= 0:
        return
    if x.ndim == 1:
        gl, gr = pan_gains(pan)
        buf[i:i + n, 0] += (gain * gl) * x[:n]
        buf[i:i + n, 1] += (gain * gr) * x[:n]
    else:
        buf[i:i + n] += gain * x[:n]


def _taper(lf, a, b):  # 1 below a, 0 above b (raised cosine on log frequency)
    x = np.clip((lf - a) / (b - a), 0, 1)
    return 0.5 * (1 + np.cos(np.pi * x))


def band(x, lo=None, hi=None, width=0.5):
    """Zero-phase band-limit (FFT) with smooth edges `width` octaves wide."""
    n = x.shape[0]
    nfft = 1 << (n - 1).bit_length()
    X = np.fft.rfft(x, nfft, axis=0)
    lf = np.log2(np.maximum(np.fft.rfftfreq(nfft, 1 / SR), 1.0))
    g = np.ones_like(lf)
    if hi:
        g *= _taper(lf, np.log2(hi), np.log2(hi) + width)
    if lo:
        g *= 1 - _taper(lf, np.log2(lo) - width, np.log2(lo))
    if x.ndim == 2:
        g = g[:, None]
    return np.fft.irfft(X * g, nfft, axis=0)[:n].astype(np.float32)


def pink(n, seed):
    rng = np.random.default_rng(seed)
    nfft = 1 << (n - 1).bit_length()
    X = np.fft.rfft(rng.standard_normal(nfft))
    X /= np.sqrt(np.maximum(np.fft.rfftfreq(nfft, 1 / SR), 20.0))
    y = np.fft.irfft(X, nfft)[:n]
    return (y / np.std(y)).astype(np.float32)


def make_ir(rt60, length, pre, seed, dark=1.0):
    """Synthetic stereo hall: decorrelated noise, lows ring longer than highs, unit energy."""
    rng = np.random.default_rng(seed)
    n = int(length * SR)
    t = np.arange(n) / SR
    chans = []
    for _ in range(2):
        w = rng.standard_normal(n).astype(np.float32)
        e = lambda r: np.exp(-6.91 * t / r).astype(np.float32)  # noqa: E731
        y = band(w, hi=400) * e(rt60 * 1.3) + band(w, lo=400, hi=3500) * e(rt60) + band(w, lo=3500) * e(rt60 * 0.4) / dark
        y *= np.clip(t / 0.015, 0, 1).astype(np.float32)
        chans.append(np.concatenate([np.zeros(int(pre * SR), np.float32), y]))
    ir = np.stack(chans, axis=1)
    return ir / np.sqrt((ir ** 2).sum(axis=0, keepdims=True))


def convolve(x, ir):
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    n = x.shape[0] + ir.shape[0] - 1
    nfft = 1 << (n - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, nfft, axis=0) * np.fft.rfft(ir, nfft, axis=0), nfft, axis=0)
    return y[:n].astype(np.float32)


def env_ar(n, att, hold, rel, shape="flat"):
    t = np.arange(n) / SR
    a = np.clip(t / max(att, 1e-3), 0, 1)
    e = a * a * (3 - 2 * a)
    r = np.clip((t - hold) / max(rel, 1e-3), 0, 1)
    e *= 1 - r * r * (3 - 2 * r)
    if shape == "cresc":
        e *= 0.35 + 0.65 * np.clip(t / max(hold, 1e-3), 0, 1) ** 1.5
    elif shape == "swell":
        e *= 0.55 + 0.45 * np.sin(np.pi * np.clip(t / max(hold, 1e-3), 0, 1))
    return e.astype(np.float32)


# ------------------------------------------------------------------------------------ instruments
def voice_phase(f, n, cents, vib_hz, vib_cents, rng):
    t = np.arange(n) / SR
    dev = (cents + vib_cents * np.sin(TAU * vib_hz * t + rng.uniform(0, TAU))
           + 4.0 * np.sin(TAU * rng.uniform(0.08, 0.2) * t + rng.uniform(0, TAU)))
    return TAU * np.cumsum(f * 2.0 ** (dev / 1200.0)) / SR


def string_note(f, n, seed, voices=3):
    rng = np.random.default_rng(seed)
    y = np.zeros(n, np.float32)
    H = max(1, int(min(36, 5200 / f)))
    for v in range(voices):
        ph = voice_phase(f, n, (v - (voices - 1) / 2) * 8.0, 5.0 + 0.35 * v, 7.0, rng)
        for h in range(1, H + 1):
            a = 1.0 / h if h <= 8 else 8.0 / (h * h)  # saw-like, rolled off above the 8th partial
            y += (a * np.sin(h * ph + rng.uniform(0, TAU))).astype(np.float32)
    return y / max(1e-6, float(np.max(np.abs(y))))


FORMANTS = {False: [(730, 220, 1.0), (1090, 260, 0.5), (2440, 380, 0.22), (3400, 480, 0.1)],  # male /a/
            True: [(850, 240, 1.0), (1220, 280, 0.55), (2810, 400, 0.25), (3800, 500, 0.1)]}  # female /a/


def choir_note(f, n, seed, female=False, voices=5):
    rng = np.random.default_rng(seed)
    y = np.zeros(n, np.float32)
    t = np.arange(n) / SR
    H = max(1, int(min(48, 4800 / f)))
    forms = FORMANTS[female]
    for _ in range(voices):
        ph = voice_phase(f, n, rng.uniform(-11, 11), rng.uniform(4.6, 5.6), 13.0, rng)
        flutter = (1 + 0.1 * np.sin(TAU * rng.uniform(0.2, 0.6) * t + rng.uniform(0, TAU))).astype(np.float32)
        for h in range(1, H + 1):
            fh = h * f
            w = sum(g * np.exp(-0.5 * ((fh - F) / bw) ** 2) for F, bw, g in forms) + 0.02
            y += (w / h ** 0.35 * np.sin(h * ph + rng.uniform(0, TAU))).astype(np.float32) * flutter
    breath = band(rng.standard_normal(n).astype(np.float32), lo=600, hi=3200)
    y += breath * (0.03 * float(np.std(y)) / max(1e-6, float(np.std(breath))))
    return y / max(1e-6, float(np.max(np.abs(y))))


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


STRINGS = [(82.41, -0.35, 0.85), (110.0, 0.3, 1.0), (110.14, -0.1, 0.95), (55.0, 0.05, 0.8)]  # Pa, Sa, Sa, low Sa
CYCLE = 3.2


def tanpura_pluck(f0, seed, dur=6.5):
    rng = np.random.default_rng(seed)
    n = int(dur * SR)
    t = np.arange(n) / SR
    centre = 3.0 + 22.0 * (1.0 - np.exp(-t / 0.9))  # the jawari formant sweeps up the partials
    bloom_t = np.exp(-t / 2.6) * (1.0 - np.exp(-t / 0.08))
    attack = 1.0 - np.exp(-t / 0.003)
    y = np.zeros(n)
    for h in range(1, int(min(70, 7000 / f0)) + 1):
        fh = h * f0 * np.sqrt(1.0 + 4e-6 * h * h)
        amp = (0.8 + 0.4 * rng.random()) / h ** 1.05
        env = np.exp(-t / (7.0 / (1.0 + 0.045 * h))) * (0.35 + 1.4 * np.exp(-((h - centre) ** 2) / 50.0) * bloom_t)
        y += amp * env * attack * np.sin(TAU * fh * t + rng.uniform(0, TAU))
    pick = band(rng.standard_normal(n).astype(np.float32), lo=2500) * np.exp(-t / 0.012)
    y += pick * 0.04 * float(np.max(np.abs(y)))
    return (y / np.max(np.abs(y))).astype(np.float32)


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


BELL = [(0.5, 0.7, 7.0), (1.0, 1.0, 4.5), (1.183, 0.55, 3.4), (1.506, 0.45, 2.8), (2.0, 0.6, 2.4),
        (2.51, 0.28, 1.7), (2.99, 0.24, 1.4), (4.07, 0.16, 0.9), (5.32, 0.1, 0.65), (6.7, 0.06, 0.45)]


def bell(f, dur, seed):
    rng = np.random.default_rng(seed)
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for r, a, d in BELL:
        for s in (-1, 1):  # two close modes per partial beat slowly: the bell's living 'wah'
            fr = f * r + s * rng.uniform(0.3, 1.2)
            if fr < 16000:
                y += 0.5 * a * np.exp(-t / d) * np.sin(TAU * fr * t + rng.uniform(0, TAU))
    y *= 1 - np.exp(-t / 0.002)
    y += band(rng.standard_normal(n).astype(np.float32), lo=1800, hi=6000) * np.exp(-t / 0.006) * 0.25
    return (y / np.max(np.abs(y))).astype(np.float32)


def drum(seed, f_lo, f_hi, sweep, body_dec, slap_lo, slap_hi, slap_dec, slap_g, dur=0.9, harm2=0.35):
    rng = np.random.default_rng(seed)
    n = int(dur * SR)
    t = np.arange(n) / SR
    ph = TAU * np.cumsum(f_lo + (f_hi - f_lo) * np.exp(-t / sweep)) / SR
    body = (np.sin(ph) + harm2 * np.sin(2 * ph)) * np.exp(-t / body_dec) * (1 - np.exp(-t / 0.0015))
    slap = band(rng.standard_normal(n).astype(np.float32), lo=slap_lo, hi=slap_hi) * np.exp(-t / slap_dec) * slap_g
    y = body + slap
    return (y / np.max(np.abs(y))).astype(np.float32)


def dha(seed):
    return drum(seed, 58, 150, 0.05, 0.3, 700, 3500, 0.02, 0.35)


def ta(seed):
    return drum(seed, 220, 300, 0.02, 0.1, 1500, 6000, 0.012, 0.5, dur=0.4, harm2=0.5)


def lub(seed):
    return drum(seed, 44, 80, 0.03, 0.16, 300, 1200, 0.01, 0.08, dur=0.6, harm2=0.45)


# ------------------------------------------------------------------------------------ stems
def pad():
    buf = np.zeros((N, 2), np.float32)
    S, C, L = SCENES, CUES, LINES
    # hook: dark open fifth, a high komal Ga, the choir creeping in toward the palm flash
    seg(buf, "str", 0, S["hook"][1], ["A2", "E3"], 0.55, att=0.25, rel=0.6, shape="cresc", seed=1)
    seg(buf, "str", C["palmFlash"] - 6, S["hook"][1], ["C4"], 0.18, att=0.4, rel=0.5, shape="cresc", seed=2)
    seg(buf, "choir", C["palmFlash"] - 10, S["hook"][1] + 6, ["A2"], 0.35, att=0.5, rel=0.5, shape="cresc", seed=3)
    # title hit
    seg(buf, "str", S["title"][0], S["title"][1], ["A2", "E3", "A3"], 0.7, att=0.03, rel=0.9, seed=4)
    seg(buf, "choir", S["title"][0], S["title"][1], ["A2", "E3"], 0.45, att=0.05, rel=1.0, seed=5)
    # flee: the poison's menace, tremolo strings on Sa-Pa-komal Dha
    seg(buf, "str", S["flee"][0], S["flee"][1], ["A2", "E3", "F3"], 0.6, att=0.3, rel=0.6, shape="cresc", trem=0.6, seed=6)
    # plea: pleading minor
    seg(buf, "str", S["plea"][0], S["plea"][1], ["A2", "C3", "E3"], 0.5, att=0.25, rel=0.8, seed=7)
    seg(buf, "choir", S["plea"][0], S["plea"][1], ["A2"], 0.25, att=0.4, rel=0.8, seed=8)
    # Shiva: calm open fifths, a soft high 'aah' as he speaks
    seg(buf, "str", S["shiva"][0], S["shiva"][1], ["A2", "E3", "A3"], 0.45, att=0.6, rel=1.0, seed=9)
    seg(buf, "choir", C["bhavani"], S["shiva"][1], ["A4"], 0.22, att=1.0, rel=1.0, female=True, seed=10)
    # Parvati: Re-Pa-Dha, settling onto Sa with her 'yes'
    seg(buf, "str", S["parvati"][0], C["haan"], ["B2", "E3", "F#3"], 0.45, att=0.5, rel=0.6, seed=11)
    seg(buf, "str", C["haan"] - 4, S["parvati"][1], ["A2", "E3", "A3", "C4"], 0.5, att=0.3, rel=0.7, seed=12)
    seg(buf, "choir", C["haan"] - 4, S["parvati"][1], ["E4"], 0.2, att=0.4, rel=0.7, female=True, seed=13)
    # palm: a rising cluster over Sa-Pa, crescendo into the drink
    a, d = S["palm"][0], C["drink"]
    seg(buf, "str", a, d, ["A2", "E3"], 0.5, att=0.4, rel=0.5, shape="cresc", seed=14)
    steps = [(a, C["gather"], "A3"), (C["gather"], C["uthaya"], "Bb3"), (C["uthaya"], C["pee"], "B3"), (C["pee"], d, "C4")]
    for i, (x0, x1, nm) in enumerate(steps):
        seg(buf, "str", x0, x1 + 3, [nm], 0.28 + 0.06 * i, att=0.12, rel=0.25, seed=15 + i)
    seg(buf, "choir", a + 10, d, ["A2", "E3"], 0.4, att=1.2, rel=0.4, shape="cresc", seed=20)
    seg(buf, "choir", C["uthaya"], d, ["E4"], 0.25, att=0.8, rel=0.4, shape="cresc", female=True, seed=21)
    # the drink: a peak, then a hush on pure Sa as the colour returns
    seg(buf, "str", d, C["colourBack"], ["A2", "E3", "A3", "C4"], 0.75, att=0.03, rel=0.7, seed=22)
    seg(buf, "choir", d, C["colourBack"], ["A2", "A3"], 0.55, att=0.05, rel=0.8, seed=23)
    seg(buf, "str", C["colourBack"] - 4, L["07_narrator"][0] + 20, ["A2", "A3"], 0.3, att=0.5, rel=0.8, seed=24)
    seg(buf, "choir", C["colourBack"], L["07_narrator"][0] + 10, ["A4"], 0.18, att=0.6, rel=0.8, female=True, seed=25)
    # Neelkanth: the major lift, peaking on the word, held through the echo
    k0 = L["07_narrator"][0] + 10
    seg(buf, "str", k0, S["neelkanth"][1], ["A2", "E3", "A3", "C#4", "E4"], 0.55, att=1.5, rel=1.2, shape="cresc", seed=26)
    seg(buf, "choir", C["neelkanth"] - 20, S["neelkanth"][1], ["A4", "C#5"], 0.4, att=0.7, rel=1.4, shape="swell", female=True, seed=27)
    seg(buf, "choir", C["neelkanth"] - 10, S["neelkanth"][1], ["A2", "E3"], 0.35, att=0.5, rel=1.2, seed=28)
    # drops: mystery, low and soft
    seg(buf, "str", S["drops"][0], S["drops"][1], ["A2", "E3", "F3"], 0.35, att=0.6, rel=0.6, seed=29)
    # chant: everyone together, full A major
    seg(buf, "str", S["chant"][0], S["chant"][1], ["A2", "E3", "A3", "C#4", "E4"], 0.75, att=0.12, rel=1.2, shape="cresc", seed=30)
    seg(buf, "choir", S["chant"][0], S["chant"][1], ["A2", "E3", "A3"], 0.5, att=0.15, rel=1.2, seed=31)
    seg(buf, "choir", S["chant"][0], S["chant"][1], ["C#5", "E5"], 0.25, att=0.3, rel=1.2, female=True, seed=32)
    # end: gold and calm under the Jyotiq close (A add9)
    seg(buf, "str", S["end"][0], TOTAL - 20, ["A2", "E3", "A3", "B3", "E4"], 0.45, att=1.2, rel=1.5, seed=33)
    seg(buf, "choir", S["end"][0] + 30, TOTAL - 30, ["E4"], 0.15, att=1.5, rel=1.5, female=True, seed=34)
    return buf


def bells():
    buf = np.zeros((N, 2), np.float32)
    C, L = CUES, LINES
    hits = [  # (frame, fundamental Hz, gain, pan): all in the gaps between lines
        (C["titleHit"], 220.0, 1.0, 0.0),             # with the damru on the title
        (L["02_narrator"][1] + 2, 329.63, 0.45, -0.3), # they reach Kailash
        (C["eyesOpen"], 440.0, 0.35, 0.3),            # Shiva opens his eyes
        (C["drink"] + 4, 110.0, 1.0, 0.0),            # the drink: a deep bell
        (L["07_narrator"][1] + 2, 220.0, 0.9, 0.0),   # after 'नीलकंठ', under the echo
        (L["07_narrator"][1] + 2, 440.0, 0.4, 0.25),
        (C["conch"], 220.0, 0.8, -0.2),               # with the conch
        (C["brandChime"], 880.0, 0.35, 0.2),          # Jyotiq sign-off chime
    ]
    for i, (f_, hz, g, p) in enumerate(hits):
        add(buf, bell(hz, 7.0 if hz <= 220 else 5.0, 40 + i), sec(f_), p, g)
    return buf


def drums():
    buf = np.zeros((N, 2), np.float32)
    S, C = SCENES, CUES
    # flee: a running pulse (132 bpm eighths), growing, then an accelerating roll into the kneel
    beat = 60 / 132 / 2
    pat = ["D", None, "T", "D", "D", "T", None, "T"]
    a = sec(S["flee"][0]) + 0.05
    roll_from = sec(C["kneel"]) - 1.0
    t, k = a, 0
    while t < roll_from:
        s = pat[k % 8]
        if s:
            g = (0.55 + 0.45 * (t - a) / max(0.1, roll_from - a)) * (1.0 if k % 8 == 0 else 0.8)
            add(buf, dha(k) if s == "D" else ta(k), t, -0.15 if s == "D" else 0.2, g)
        t += beat
        k += 1
    step = beat
    while t < sec(C["kneel"]) - 0.05:
        add(buf, ta(1000 + k), t, 0.2 * np.sin(k), 0.6 + 0.4 * (t - roll_from))
        step = max(0.055, step * 0.86)
        t += step
        k += 1
    add(buf, dha(2000), sec(C["kneel"]), 0.0, 1.25)
    # palm: a heartbeat that quickens into the drink
    t, iv = sec(S["palm"][0]), 0.95
    while t < sec(C["drink"]) - 0.3:
        add(buf, lub(3000 + k), t, 0.0, 0.7)
        add(buf, lub(3001 + k), t + 0.2, 0.0, 0.5)
        iv = max(0.48, iv * 0.93)
        t += iv
        k += 2
    # the chant: hits on its syllables, the biggest with the conch
    for c, g in ((C["chant"], 0.9), (A.word_cue(LINES, "09_indra", "हर", nth=1), 0.8),
                 (A.word_cue(LINES, "09_indra", "महादेव"), 1.0), (C["conch"], 1.3)):
        add(buf, dha(4000 + c), sec(c), 0.0, g)
    return buf


def kaal(cosmic):
    bed = np.zeros((N, 2), np.float32)
    fx = np.zeros((N, 2), np.float32)
    echo = np.zeros((N, 2), np.float32)
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
    # the time-boom at frame 0: a deep falling impact into a long cosmic tail
    n = int(2.6 * SR)
    tb = np.arange(n) / SR
    ph = TAU * np.cumsum(38 + 52 * np.exp(-tb / 0.12)) / SR
    boom = (np.sin(ph) + 0.4 * np.sin(2 * ph) + 0.15 * np.sin(3 * ph)) * np.exp(-tb / 1.1) * (1 - np.exp(-tb / 0.004))
    boom = boom.astype(np.float32) + band(np.random.default_rng(3).standard_normal(n).astype(np.float32), hi=400) * np.exp(-tb / 0.05).astype(np.float32) * 0.5
    y = convolve(boom, cosmic) * 0.55
    y[:n] += boom[:, None]
    add(fx, y, 0.0, gain=0.9)
    # a reversed-reverb rise of line 07's first word ('विष') over the drink beat, ending as the word begins
    vo7 = read_wav(A.VO_DIR / "07_narrator.wav").mean(axis=1)
    first = vo7[: int(0.65 * SR)] * (np.linspace(1, 0, int(0.65 * SR)) ** 0.5).astype(np.float32)
    rev = convolve(np.ascontiguousarray(first[::-1]), cosmic)[::-1]  # reverse, reverb (wet only), reverse
    m = int(2.0 * SR)
    rev = band(rev[-m:] * (np.linspace(0, 1, m) ** 2)[:, None].astype(np.float32), lo=220, hi=6500)
    add(fx, rev / max(1e-6, float(np.max(np.abs(rev)))), sec(LINES["07_narrator"][0]) - m / SR, gain=0.55)
    # the 'नीलकंठ' echo: three taps, each darker, wetter and further away, travelling left and right
    s07, e07 = LINES["07_narrator"]
    w0 = max(0, int(sec(CUES["neelkanth"] - s07) * SR) - int(0.03 * SR))
    word = vo7[w0:].copy()
    word[: int(0.01 * SR)] *= np.linspace(0, 1, int(0.01 * SR))
    word[-int(0.06 * SR):] *= np.linspace(1, 0, int(0.06 * SR))
    for d, g, lp, wetm, pan in ((0.05, 0.42, 6500, 0.3, 0.0), (0.97, 0.24, 3800, 0.55, -0.45), (1.89, 0.12, 2200, 0.8, 0.45)):
        x = band(word, lo=140, hi=lp)
        y = convolve(x, cosmic) * wetm
        pl, pr = pan_gains(pan)
        y[: len(x), 0] += (1 - wetm) * pl * x
        y[: len(x), 1] += (1 - wetm) * pr * x
        add(echo, y, sec(e07) + d, gain=g)
    return bed, fx, echo


def finish(name, x, wet=0.0, ir=None, lp=None, peak=0.5):
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


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    print(f"TOTAL {TOTAL} frames = {TOTAL / FPS:.2f} s; writing stems to {OUT}", flush=True)
    hall = make_ir(2.4, 3.0, 0.025, seed=5)
    cosmic = make_ir(5.5, 6.0, 0.06, seed=33, dark=1.4)
    write_f32(OUT / "ir_narrator.wav", make_ir(2.6, 3.2, 0.035, seed=21, dark=1.8) * 0.5)
    finish("tanpura", tanpura(), 0.35, hall, lp=9000)
    finish("pad", pad(), 0.45, hall, lp=5600)
    finish("bells", bells(), 0.5, hall)
    finish("drums", drums(), 0.18, hall, lp=7000)
    bed, fx, echo = kaal(cosmic)
    finish("kaal", bed)
    finish("kaal_fx", fx)
    finish("echo", echo, peak=None)  # natural level, relative to the trimmed narrator take
    print("SCORE DONE", flush=True)


if __name__ == "__main__":
    main()
