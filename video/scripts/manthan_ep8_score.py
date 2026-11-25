"""Manthan Ep8 KETU - original score, SFX glue and Kaal time layer, synthesized from scratch (numpy).

Writes 32-bit float stems (48 kHz stereo) into manthan-ep8/audio/stems/ (outside Remotion's public/
folder; only mix.wav goes to public/). Same instruments and finishing pass as Episode 6
(manthan_ep6_score.py), with an Episode 8 arrangement:
  hook     cosmic drone + low choir (the 'eclipse bed'), a questioning santoor, 'कैसे बचा?' lifts
  title    rewind swell into the series title hit
  replay   tense tremolo under the chakra replay, cut dead on the freeze ('जहां अमृत रुका था')
  split    crystal shimmer; the drop splits: two santoor notes fly apart (left/right)
  wander   hollow, airy, sparse (no drums)
  rahu     dark komal Re tremolo + a hungry fast heartbeat
  ketu     everything drops to ONE sustained note (stillness vs desire)
  brahma   gold A major swell, choir, temple bell + ghanti on the name ('brahma_light')
  pair     calm; the two-note Rahu/Ketu motif (A left, E right)
  answer   shimmer rising to the JAWAB hit
  end      warm A add9 under the Jyotiq close
Nothing here samples or imitates any existing show's music or voice.

Run: "$KIROCREW_SCRATCH/venv-audio/bin/python" scripts/manthan_ep8_score.py [stem ...]
"""
import sys
import time
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
import manthan_ep8_audio as A  # noqa: E402  (same clock as the picture)
# Pure DSP helpers and instruments from Episode 4, imported read-only.
from manthan_ep4_score import (  # noqa: E402
    CYCLE, SR, STRINGS, TAU, add, band, bell, choir_note, convolve, dha, drum, env_ar, lub, make_ir,
    pan_gains, pink, read_wav, string_note, ta, tanpura_pluck, write_f32,
)

FPS = A.FPS
OUT = A.EP8 / "audio/stems"
LINES, BEATS, SCENES, CUES, TOTAL = A.build_timing(A.vo_frames())
N = int(TOTAL / FPS * SR) + 2 * SR  # 2 s of tail room; the mix trims to TOTAL
T0 = time.time()

# Series key Sa = A. Bb (komal Re) and F only for Rahu and the replay's tension.
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
    # hook: the eclipse bed, a low open fifth with a low male choir; komal Re creeps in on 'धड़',
    # a female 'aah' lifts on 'कैसे बचा?'
    seg(buf, "str", 0, S["hook"][1], ["A1", "E2", "A2"], 0.55, att=0.12, rel=0.5, shape="cresc", seed=1)
    seg(buf, "choir", 0, S["hook"][1], ["A2", "E3"], 0.3, att=0.4, rel=0.5, seed=2)
    seg(buf, "str", C["dhad01"] - 2, C["kaise"], ["Bb2", "F3"], 0.24, att=0.1, rel=0.3, trem=0.35, seed=3)
    seg(buf, "choir", C["kaise"] - 6, S["hook"][1] + 4, ["E4"], 0.28, att=0.25, rel=0.4, shape="cresc", female=True, seed=4)
    # title hit as the rewind lands on Episode 7's frame
    seg(buf, "str", C["titleHit"], S["title"][1], ["A2", "E3", "A3", "C#4"], 0.7, att=0.03, rel=0.8, seed=5)
    seg(buf, "choir", C["titleHit"], S["title"][1], ["A2", "E3"], 0.42, att=0.05, rel=0.9, seed=6)
    # replay: tritone tremolo under the chakra, cut dead on the freeze, then a lone high hush
    rp = S["replay"]
    seg(buf, "str", rp[0], C["freeze"], ["A2", "D#3", "A3"], 0.5, att=0.05, rel=0.12, shape="cresc", trem=0.55, seed=7)
    seg(buf, "str", C["freeze"], rp[1], ["E5"], 0.14, att=0.2, rel=0.4, seed=8)
    # split: crystal swell, brighter as the drop splits
    sp = S["split"]
    seg(buf, "str", sp[0], sp[1], ["A3", "C#4", "E4"], 0.32, att=0.4, rel=0.4, shape="swell", seed=9)
    seg(buf, "choir", C["splitHit"], sp[1], ["C#5", "E5"], 0.22, att=0.15, rel=0.5, female=True, seed=10)
    # wander: hollow and airy, a slow sway
    wd = S["wander"]
    seg(buf, "str", wd[0], wd[1], ["A2", "E3"], 0.3, att=0.6, rel=0.4, trem=0.12, seed=11)
    seg(buf, "choir", wd[0], wd[1], ["E4"], 0.13, att=0.8, rel=0.4, female=True, seed=12)
    # Rahu: dark komal Re, hungry tremolo building
    rh = S["rahu"]
    seg(buf, "str", rh[0], rh[1], ["A1", "Bb2", "F3"], 0.5, att=0.06, rel=0.15, shape="cresc", trem=0.45, seed=13)
    # Ketu: one still note and nothing else
    kt = S["ketu"]
    seg(buf, "str", kt[0], kt[1], ["E4"], 0.16, att=0.3, rel=0.5, seed=14)
    # Brahma: gold A major swell into full choir as Ketu is named
    br = S["brahma"]
    seg(buf, "str", br[0], C["ketuName"], ["A2", "E3", "A3"], 0.42, att=0.5, rel=0.2, shape="cresc", seed=15)
    seg(buf, "str", C["ketuName"], br[1], ["A2", "E3", "A3", "C#4", "E4"], 0.74, att=0.05, rel=0.9, seed=16)
    seg(buf, "choir", C["brahma"], br[1], ["A2", "E3", "A3"], 0.4, att=0.4, rel=0.9, seed=17)
    seg(buf, "choir", C["ketuName"], br[1], ["C#5", "E5"], 0.26, att=0.15, rel=0.9, female=True, seed=18)
    # pair: calm and open
    pr = S["pair"]
    seg(buf, "str", pr[0], pr[1], ["A2", "E3", "B3"], 0.36, att=0.5, rel=0.5, seed=19)
    # answer: shimmer rising to the JAWAB hit
    an = S["answer"]
    seg(buf, "str", an[0], C["jawab"], ["A3", "E4", "B4"], 0.32, att=0.4, rel=0.2, shape="cresc", seed=20)
    seg(buf, "str", C["jawab"], an[1], ["A2", "E3", "A3", "C#4", "E4"], 0.6, att=0.03, rel=0.7, seed=21)
    # end: calm gold under the Jyotiq close (A add9), no fear in the Ketu question
    seg(buf, "str", S["end"][0], TOTAL - 20, ["A2", "E3", "A3", "B3", "E4"], 0.42, att=1.0, rel=1.5, seed=22)
    seg(buf, "choir", C["signoff"] - 10, TOTAL - 20, ["A2", "E3"], 0.26, att=0.8, rel=1.5, seed=23)
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


def santoor():
    buf = np.zeros((N, 2), np.float32)
    C = CUES
    # hook: two questioning notes, a falling run on 'कैसे बचा?', a rewinding run into the title
    add(buf, sn("E5", 0), sec(C["gale01"]), -0.3, 0.3)
    add(buf, sn("C#5", 1), sec(C["dhad01"]), 0.3, 0.3)
    santoor_run(buf, C["kaise"], ["E5", "C#5", "B4", "E4"], 0.09, 0.28, pan=(0.4, -0.4))
    santoor_run(buf, C["rewind"], ["A5", "F#5", "E5", "C#5", "B4", "A4"], 0.05, 0.3, pan=(0.5, -0.5), accel=0.9)
    santoor_run(buf, C["titleHit"], ["A4", "E5", "A5"], 0.02, 0.34)
    # split: the drop splits, two notes flying apart
    add(buf, sn("A5", 2), sec(C["splitHit"]), -0.6, 0.3)
    add(buf, sn("A4", 2), sec(C["splitHit"]) + 0.06, 0.6, 0.3)
    santoor_run(buf, C["chips"], ["E5", "A5"], 0.12, 0.24)
    # wander: sparse single notes in the dark
    add(buf, sn("B4", 0), sec(C["bhatak"]), -0.3, 0.18)
    add(buf, sn("E5", 1), sec(C["bhookh"]), 0.3, 0.16)
    # Brahma names Ketu: an ascending run
    santoor_run(buf, C["ketuName"], ["A4", "C#5", "E5", "A5"], 0.07, 0.3)
    # the Rahu/Ketu motif: A (left) for Rahu, E (right) for Ketu
    add(buf, sn("A4", 0), sec(C["rahuOrb"]), -0.45, 0.26)
    add(buf, sn("E5", 0), sec(C["ketuOrb"]), 0.45, 0.26)
    add(buf, sn("A4", 1), sec(C["ichha"]) + 8 / FPS, -0.45, 0.18)
    add(buf, sn("E5", 1), sec(C["moksh"]) + 8 / FPS, 0.45, 0.18)
    # the answer: sparkle rising on 'जानता है'
    santoor_run(buf, C["jaanta"], ["E5", "A5", "C#6", "E6"], 0.06, 0.26, pan=(-0.45, 0.45))
    # the kundali
    santoor_run(buf, C["bhaav"], ["B4", "E5"], 0.09, 0.2)
    return buf


# ------------------------------------------------------------------------------------ bells + drums
def ghanti(dur, seed, rate=9.0):
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
    hits = [  # (frame, fundamental Hz, gain, pan)
        (C["titleHit"], 220.0, 1.0, 0.0),
        (C["titleHit"], 440.0, 0.35, 0.2),
        (C["splitHit"], 880.0, 0.32, -0.2),      # crystal ping as the drop splits
        (C["splitHit"] + 2, 1318.51, 0.2, 0.25),
        (C["ketuName"], 220.0, 0.85, -0.1),      # Brahma's temple bell as Ketu is named
        (C["ketuName"] + 2, 440.0, 0.4, 0.2),
        (C["jawab"], 440.0, 0.45, 0.0),          # JAWAB
        (C["brandChime"], 880.0, 0.35, 0.2),     # Jyotiq sign-off chime
    ]
    for i, (f_, hz, g, p) in enumerate(hits):
        add(buf, bell(hz, 7.0 if hz <= 220 else 5.0, 40 + i), sec(f_), p, g)
    add(buf, ghanti(1.2, 90), sec(C["ketuName"] + 3), 0.25, 0.34)
    return buf


def tok(seed):
    return drum(seed, 620, 900, 0.01, 0.035, 2000, 6000, 0.004, 0.3, dur=0.2, harm2=0.2)


def drums():
    buf = np.zeros((N, 2), np.float32)
    S, C = SCENES, CUES
    add(buf, tok(10), sec(C["gale01"]), 0.0, 0.35)                 # hook tick on 'गले'
    add(buf, lub(200), sec(C["chakra"]), 0.0, 0.9)                 # the chakra replay
    add(buf, lub(201), sec(C["freeze"]), 0.0, 1.0)                 # freeze hit, then silence
    add(buf, dha(202), sec(C["freeze"]), 0.0, 0.7)
    add(buf, tok(203), sec(C["splitHit"]), 0.0, 0.35)              # the split
    # Rahu: a hungry, fast heartbeat; hits on 'सूर्य' and 'चंद्र'
    t, k = sec(C["rahuIn"]), 0
    while t < sec(S["rahu"][1]) - 0.25:
        add(buf, lub(300 + k), t, 0.0, 0.5)
        add(buf, lub(301 + k), t + 0.16, 0.0, 0.36)
        t += 0.6
        k += 2
    add(buf, dha(350), sec(C["surya"]), -0.2, 0.7)
    add(buf, dha(351), sec(C["chandra"]), 0.2, 0.7)
    # Ketu: no drums at all. Brahma: one deep hit on the name. JAWAB: a hit.
    add(buf, lub(400), sec(C["ketuName"]), 0.0, 0.9)
    add(buf, lub(500), sec(C["jawab"]), 0.0, 1.0)
    add(buf, dha(501), sec(C["jawab"]), 0.0, 0.8)
    return buf


# ------------------------------------------------------------------------------------ sfx glue
def whoosh_m(dur, seed, lo=300, hi=5000):
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

    for i, name in enumerate(["title", "replay", "split", "wander", "rahu", "ketu", "brahma", "pair", "answer", "end"]):
        add(buf, whoosh_m(0.45, 10 + i), sec(S[name][0]) - 0.3, 0.5 if i % 2 else -0.5, 0.2)
    ending_at(reverse_swell(0.8, 30), C["titleHit"], 0.0, 0.45)       # the rewind lands on Episode 7
    ending_at(reverse_swell(0.5, 31), C["freeze"], 0.0, 0.35)         # time stops on the throat
    add(buf, sparkle(0.6, 32, n_pings=14), sec(C["splitHit"]), 0.0, 0.4)
    add(buf, whoosh_m(0.6, 33, lo=60, hi=900), sec(C["rahuIn"]) - 0.2, 0.0, 0.45)
    add(buf, shimmer(2.0, 34, ("A5", "C#6", "E6")), sec(C["brahma"]), 0.0, 0.3)  # Brahma's light
    ending_at(reverse_swell(0.6, 35), C["jawab"], 0.0, 0.4)           # into the answer
    add(buf, sparkle(1.0, 36, n_pings=12, decay=0.12), sec(C["jaanta"]), 0.2, 0.3)
    return buf


# ------------------------------------------------------------------------------------ Kaal layer
def word_echo(cosmic, stem, cue, end_cue, at_f, taps, fade_a, fade_b):
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
    bed[:, 0] += 0.22 * wind * swell * gl.astype(np.float32)
    bed[:, 1] += 0.22 * wind * swell * gr.astype(np.float32)
    del wind, swell, gl, gr, t
    # the time-boom at frame 0
    n = int(2.6 * SR)
    tb = np.arange(n) / SR
    ph = TAU * np.cumsum(38 + 52 * np.exp(-tb / 0.12)) / SR
    boom = (np.sin(ph) + 0.4 * np.sin(2 * ph) + 0.15 * np.sin(3 * ph)) * np.exp(-tb / 1.1) * (1 - np.exp(-tb / 0.004))
    boom = boom.astype(np.float32) + band(noise(n, 3), hi=400) * np.exp(-tb / 0.05).astype(np.float32) * 0.5
    y = convolve(boom, cosmic) * 0.55
    y[:n] += boom[:, None]
    add(fx, y, 0.0, gain=0.9)
    # echo: 'केतु' after line 07, inside the rise beat, gone before line 08
    echo = word_echo(cosmic, "07_narrator", CUES["ketuName"], None, LINES["07_narrator"][1],
                     ((0.08, 0.38, 5000, 0.45, -0.3), (0.55, 0.18, 2600, 0.85, 0.4)),
                     BEATS["rise"][1] - 8, BEATS["rise"][1] + 2)
    return bed, fx, echo


STEMS = {"tanpura": tanpura, "pad": pad, "santoor": santoor, "bells": bells, "drums": drums, "sfx": sfx}


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
    if not only or only & {"kaal", "kaal_fx", "echo"}:
        bed, fx, echo = kaal(cosmic)
        finish("kaal", bed)
        finish("kaal_fx", fx)
        finish("echo", echo, peak=None)
    print("SCORE DONE", flush=True)


if __name__ == "__main__":
    main()
