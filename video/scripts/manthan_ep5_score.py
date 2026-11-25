"""Manthan Ep5 LAKSHMI - original score, SFX and Kaal time layer, synthesized from scratch (numpy).

Writes 32-bit float stems (48 kHz stereo) into manthan-ep5/audio/stems/ (outside Remotion's public/
folder, so the render bundle stays small; only mix.wav goes to public/):
  tanpura.wav   the series drone (Sa = A): Pa E2, Sa A2, Sa A2, low Sa A1, plucked in a 3.2 s cycle
  pad.wav       strings + 'aah' choir in Bhoopali colours (Sa Re Ga Pa Dha = A B C# E F#):
                mystery -> title hit -> awe of the treasures -> power (horse, elephant) -> glass (gem)
                -> hush and bloom (Lakshmi) -> suspended (the choice) -> warm resolve (Vishnu) ->
                joyful lift (varmala) -> calm gold (the close)
  santoor.wav   santoor-like hammered strings: the hook's question, treasure glitter, the lotus climb,
                the reveal trill, the varmala cascade
  bells.wav     temple bells in the gaps, the ghanti rung fast with the conch, the sign-off chime
  drums.wav     tabla-like pulse under the treasures, the horse's gallop, Airavata's hit, the choice's
                heartbeat, the wedding rhythm, soft ticks when the hook's chips are struck
  sfx.wav       synthesized SFX: whooshes on cuts, wave burst (horse), gong bloom (Airavata), glass and
                sparkle (gem), reversed swell + water + shimmer (lotus), anger flare, gold glints (moh),
                petals and gold rain, soft pops for the 'who got what' tags
  kaal.wav      the series' ORIGINAL time layer: a slowly beating low wheel tone + cosmic wind
  kaal_fx.wav   the time-boom at frame 0
  echo.wav      a fading, travelling echo of 'लक्ष्मी' made from the user's own Kaal take
  ir_narrator.wav  impulse response for the narrator's light hall (used by the mix)
Nothing here samples or imitates any existing show's music or voice.

Run: "$KIROCREW_SCRATCH/venv-audio/bin/python" scripts/manthan_ep5_score.py
"""
import sys
import time
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
import manthan_ep5_audio as A  # noqa: E402  (same clock as the picture)
# Pure DSP helpers and instruments from Episode 4, imported read-only (Episode 4's stems are untouched).
from manthan_ep4_score import (  # noqa: E402
    CYCLE, SR, STRINGS, TAU, add, band, bell, choir_note, convolve, dha, drum, env_ar, lub, make_ir,
    pan_gains, pink, read_wav, string_note, ta, tanpura_pluck, write_f32,
)

FPS = A.FPS
OUT = A.EP5 / "audio/stems"
LINES, BEATS, SCENES, CUES, TOTAL = A.build_timing(A.vo_frames())
N = int(TOTAL / FPS * SR) + 2 * SR  # 2 s of tail room; the mix trims to TOTAL
T0 = time.time()

# Series key Sa = A. Bhoopali = A B C# E F#; Bb (komal Re) and F (komal Dha) only for the choice's tension.
NOTE = {"A1": 55.0, "E2": 82.41, "A2": 110.0, "Bb2": 116.54, "B2": 123.47, "C#3": 138.59, "E3": 164.81,
        "F3": 174.61, "F#3": 185.0, "A3": 220.0, "Bb3": 233.08, "B3": 246.94, "C#4": 277.18, "E4": 329.63,
        "F#4": 369.99, "A4": 440.0, "B4": 493.88, "C#5": 554.37, "E5": 659.26, "F#5": 739.99, "A5": 880.0,
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
    # hook: a mysterious open fifth with a high Dha shimmer; the female 'aah' leans in on 'किसे?'
    seg(buf, "str", 0, S["hook"][1], ["A2", "E3"], 0.55, att=0.2, rel=0.6, shape="cresc", seed=1)
    seg(buf, "str", C["devta"], S["hook"][1], ["F#4"], 0.16, att=0.6, rel=0.5, shape="cresc", seed=2)
    seg(buf, "choir", C["kise"] - 12, S["hook"][1] + 4, ["E4"], 0.28, att=0.4, rel=0.4, shape="cresc", female=True, seed=3)
    # title hit: bright A major
    seg(buf, "str", S["title"][0], S["title"][1], ["A2", "E3", "A3", "C#4"], 0.72, att=0.03, rel=0.9, seed=4)
    seg(buf, "choir", S["title"][0], S["title"][1], ["A2", "E3"], 0.45, att=0.05, rel=1.0, seed=5)
    # the treasures: awe, Re rising to Ga as the gems surface
    a = S["ratna"][0]
    seg(buf, "str", a, C["ratna"], ["A2", "E3", "B3"], 0.45, att=0.4, rel=0.5, seed=6)
    seg(buf, "str", C["ratna"] - 3, S["ratna"][1], ["A2", "E3", "A3", "C#4"], 0.5, att=0.3, rel=0.6, shape="swell", seed=7)
    seg(buf, "choir", C["kamdhenu"] - 6, S["ratna"][1], ["C#5"], 0.16, att=0.5, rel=0.6, female=True, seed=8)
    # the horse: power, tremolo strings
    seg(buf, "str", S["horse"][0], S["horse"][1], ["A2", "E3", "A3"], 0.6, att=0.05, rel=0.5, shape="cresc", trem=0.55, seed=9)
    # Airavata: low and royal
    seg(buf, "str", S["airavata"][0], S["airavata"][1], ["A1", "A2", "E3"], 0.6, att=0.05, rel=0.6, seed=10)
    seg(buf, "choir", S["airavata"][0], S["airavata"][1], ["A2"], 0.35, att=0.1, rel=0.6, seed=11)
    # the gem: high and glassy (Pa-Re-Pa)
    seg(buf, "str", S["kaustubha"][0], S["kaustubha"][1], ["E3", "B3", "E4"], 0.4, att=0.2, rel=0.5, seed=12)
    # the lotus: a hush on Sa, then the bloom on 'लक्ष्मी' (A add6), held through the reveal
    seg(buf, "str", S["lotus"][0], C["lakshmi"], ["A2", "A3"], 0.32, att=0.3, rel=0.4, shape="cresc", seed=13)
    seg(buf, "choir", C["kamal"], C["lakshmi"], ["A2"], 0.22, att=0.8, rel=0.4, shape="cresc", seed=14)
    seg(buf, "str", C["lakshmi"] - 4, S["lotus"][1], ["A2", "E3", "A3", "C#4", "F#4"], 0.62, att=0.25, rel=1.0, shape="swell", seed=15)
    seg(buf, "choir", C["lakshmi"] - 4, S["lotus"][1], ["A4", "C#5"], 0.42, att=0.3, rel=1.0, shape="swell", female=True, seed=16)
    # the choice: suspended (Sa Pa Re), a dark komal-Re stab on 'क्रोध', a komal-Dha shade on 'मोह'
    ch = S["choice"]
    seg(buf, "str", ch[0], ch[1], ["A2", "E3", "B3"], 0.4, att=0.5, rel=0.6, seed=17)
    seg(buf, "str", C["krodh"] - 2, C["kisi2"], ["Bb2", "E3", "Bb3"], 0.26, att=0.05, rel=0.4, trem=0.4, seed=18)
    seg(buf, "str", C["moh"] - 2, ch[1], ["F3", "A3"], 0.2, att=0.3, rel=0.5, seed=19)
    # Vishnu: warm resolve, a low 'aah', a gentle swell on 'श्री विष्णु'
    vi = S["vishnu"]
    seg(buf, "str", vi[0], vi[1], ["A2", "E3", "A3", "C#4"], 0.42, att=0.8, rel=0.8, seed=20)
    seg(buf, "choir", vi[0] + 6, vi[1], ["A2", "E3"], 0.3, att=1.0, rel=0.8, seed=21)
    seg(buf, "choir", C["shriVishnu"] - 6, vi[1], ["E4", "A4"], 0.26, att=0.4, rel=0.8, shape="swell", female=True, seed=22)
    # the varmala: the joyful lift, peaking with the conch
    va = S["varmala"]
    seg(buf, "str", va[0], C["conch"], ["A2", "E3", "A3", "C#4"], 0.5, att=0.4, rel=0.4, shape="cresc", seed=23)
    seg(buf, "str", C["conch"], va[1], ["A2", "E3", "A3", "C#4", "E4", "F#4"], 0.78, att=0.04, rel=1.2, seed=24)
    seg(buf, "choir", C["conch"], va[1], ["A2", "E3", "A3"], 0.5, att=0.08, rel=1.2, seed=25)
    seg(buf, "choir", C["conch"], va[1], ["C#5", "E5"], 0.3, att=0.15, rel=1.2, female=True, seed=26)
    # end: calm gold under the Jyotiq close (A add9)
    seg(buf, "str", S["end"][0], TOTAL - 20, ["A2", "E3", "A3", "B3", "E4"], 0.42, att=1.0, rel=1.5, seed=27)
    seg(buf, "choir", C["shukra"], TOTAL - 30, ["E4"], 0.14, att=1.5, rel=1.5, female=True, seed=28)
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
    C, S, B = CUES, SCENES, BEATS
    # hook: a sparse question, then a run up into the title
    add(buf, sn("E5", 0), sec(C["devta"]), -0.3, 0.35)
    add(buf, sn("C#5", 1), sec(C["asur"]), 0.3, 0.35)
    santoor_run(buf, C["kise"] + 3, ["A4", "B4", "C#5", "E5", "F#5", "A5"], 0.085, 0.45, accel=0.95)
    # the treasures surface: glitter down on 'रत्न', a soft chord for Kamadhenu
    santoor_run(buf, C["ratna"], ["E6", "C#6", "B5", "A5", "F#5", "E5", "C#5"], 0.07, 0.32, pan=(0.45, -0.45))
    santoor_run(buf, C["kamdhenu"], ["A4", "C#5", "E5"], 0.05, 0.3)
    # the gem: a glassy climb as it flies, a landing chord on Vishnu
    santoor_run(buf, C["kaustubh"], ["A5", "B5", "C#6", "E6", "F#6"], 0.06, 0.3, pan=(-0.5, 0.5))
    santoor_run(buf, C["vishnuGem"], ["A4", "E5", "A5"], 0.03, 0.32)
    # the lotus: a slow climb out of the hush, a trill on the reveal
    santoor_run(buf, S["lotus"][0] + 4, ["A3", "C#4", "E4", "F#4", "A4", "B4", "C#5", "E5"], 0.23, 0.22, accel=0.93)
    tremolo(buf, C["lakshmi"], B["reveal"][1] - 4, ["A5", "E5", "C#5", "E5"], 14.0, 0.26, seed=40)
    # the choice: single questioning notes
    add(buf, sn("F#5", 2), sec(C["dekha"]), -0.2, 0.25)
    add(buf, sn("B4", 0), sec(C["gyan"]), 0.25, 0.22)
    # Vishnu: a warm slow rise on 'श्री विष्णु'
    santoor_run(buf, C["shriVishnu"], ["A4", "C#5", "E5", "A5"], 0.12, 0.3)
    # the varmala: a cascade as the garland lands, then a joyful trill with the conch
    santoor_run(buf, C["gale"], ["E6", "C#6", "B5", "A5", "F#5", "E5", "C#5", "B4", "A4"], 0.045, 0.34, pan=(0.5, -0.5))
    tremolo(buf, C["conch"] + 2, B["varmala"][1] + 6, ["A5", "E5", "C#6", "E5"], 12.0, 0.3, seed=60)
    # end: Shukra's sparkle, then the kundali
    santoor_run(buf, C["shukra"], ["F#5", "A5"], 0.09, 0.22)
    santoor_run(buf, C["kundali"], ["B4", "E5"], 0.09, 0.2)
    return buf


# ------------------------------------------------------------------------------------ bells + drums
def ghanti(dur, seed, rate=9.0):
    """A temple hand bell rung fast, as at a wedding: repeated strikes of a small bell."""
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
    C, L, B, S = CUES, LINES, BEATS, SCENES
    hits = [  # (frame, fundamental Hz, gain, pan): in the gaps between lines
        (C["titleHit"], 220.0, 1.0, 0.0),
        (C["titleHit"], 440.0, 0.35, 0.2),
        (B["reveal"][0] + 1, 440.0, 0.6, -0.15),      # Lakshmi revealed
        (B["reveal"][0] + 3, 659.26, 0.35, 0.25),
        (B["reveal"][0] + 5, 880.0, 0.22, -0.3),
        (S["vishnu"][0], 220.0, 0.32, 0.1),           # into Vishnu's calm
        (L["07_narrator"][1] + 1, 329.63, 0.4, -0.1),  # after 'श्री विष्णु'
        (C["conch"], 220.0, 0.85, -0.15),             # with the conch
        (C["conch"] + 2, 440.0, 0.4, 0.2),
        (C["brandChime"], 880.0, 0.35, 0.2),          # Jyotiq sign-off chime
    ]
    for i, (f_, hz, g, p) in enumerate(hits):
        add(buf, bell(hz, 7.0 if hz <= 220 else 5.0, 40 + i), sec(f_), p, g)
    add(buf, ghanti(1.4, 90), sec(C["conch"] + 3), 0.25, 0.42)
    return buf


def tok(seed):
    """A soft wooden tick for the hook's chips being struck."""
    return drum(seed, 620, 900, 0.01, 0.035, 2000, 6000, 0.004, 0.3, dur=0.2, harm2=0.2)


def drums():
    buf = np.zeros((N, 2), np.float32)
    S, C, L, B = SCENES, CUES, LINES, BEATS
    # hook: ticks as देवता and असुर are struck off the poll card
    add(buf, tok(10), sec(C["strikeDevta"]), -0.2, 0.35)
    add(buf, tok(11), sec(C["strikeAsur"]), 0.2, 0.35)
    # the treasures: a soft tabla pulse (100 bpm eighths), growing into the horse
    beat = 60 / 100 / 2
    pat = ["D", None, "T", "T", "D", None, "T", None]
    a, b = sec(C["sagar"]), sec(S["horse"][0]) - 0.06
    t, k = a, 0
    while t < b:
        s = pat[k % 8]
        if s:
            g = (0.32 + 0.4 * (t - a) / max(0.1, b - a)) * (1.0 if k % 8 == 0 else 0.8)
            add(buf, dha(k) if s == "D" else ta(k), t, -0.15 if s == "D" else 0.2, g)
        t += beat
        k += 1
    # the horse: a big hit with the wave, then a gallop (da-da-DUM), softer under Bali's claim
    add(buf, dha(500), sec(C["horseBurst"]), 0.0, 1.3)
    add(buf, lub(501), sec(C["horseBurst"]), 0.0, 1.0)
    t, k = sec(C["horseBurst"]) + 0.42, 0
    end = sec(S["horse"][1]) - 0.1
    while t < end:
        g = 0.42 if L["03_bali"][0] <= t * FPS < L["03_bali"][1] else 0.7
        add(buf, ta(600 + k), t, 0.25, 0.55 * g)
        add(buf, ta(601 + k), t + 0.085, -0.2, 0.65 * g)
        add(buf, dha(602 + k), t + 0.17, 0.0, g)
        t += 0.4
        k += 3
    # Airavata: one huge low hit with the gong
    add(buf, lub(700), sec(S["airavata"][0]), 0.0, 1.4)
    add(buf, dha(701), sec(S["airavata"][0]), 0.0, 1.1)
    # the choice: a slow heartbeat, a hit on 'क्रोध'
    t = sec(C["dekha"])
    while t < sec(S["choice"][1]) - 0.3:
        add(buf, lub(800 + k), t, 0.0, 0.45)
        add(buf, lub(801 + k), t + 0.22, 0.0, 0.32)
        t += 0.95
        k += 2
    add(buf, dha(900), sec(C["krodh"]), 0.0, 0.8)
    # the varmala: a wedding rhythm with the conch
    beat = 60 / 128 / 2
    pat = ["D", "T", "D", "D", "T", "D", "T", "T"]
    t, k = sec(C["conch"]), 0
    while t < sec(B["varmala"][1]) - 0.05:
        s = pat[k % 8]
        g = 1.1 if k == 0 else (0.75 if s == "D" else 0.6)
        add(buf, dha(1000 + k) if s == "D" else ta(1000 + k), t, -0.15 if s == "D" else 0.2, g)
        t += beat
        k += 1
    return buf


# ------------------------------------------------------------------------------------ sfx
def whoosh(dur, seed, pan_from=-0.6, pan_to=0.6, lo=300, hi=5000):
    n = int(dur * SR)
    u = np.arange(n) / n
    e = (u ** 1.5) * (1 - u) ** 0.6  # swells toward 70 %, then lets go
    y = band(noise(n, seed), lo=lo, hi=hi) * (e / max(1e-6, float(e.max()))).astype(np.float32)
    gl, gr = pan_gains(np.linspace(pan_from, pan_to, n))
    return norm(np.stack([y * gl.astype(np.float32), y * gr.astype(np.float32)], axis=1))


def wave_burst(seed):
    n = int(2.2 * SR)
    t = np.arange(n) / SR
    crash = band(noise(n, seed), lo=120, hi=6000) * (1 - np.exp(-t / 0.02)) * np.exp(-t / 0.55)
    hiss = band(noise(n, seed + 1), lo=2500, hi=9000) * np.exp(-t / 1.1) * 0.35
    thump = np.sin(TAU * np.cumsum(40 + 50 * np.exp(-t / 0.08)) / SR) * np.exp(-t / 0.35) * 1.4
    return norm(crash + hiss + thump)


GONG = [(1.0, 1.0, 4.5), (1.47, 0.7, 3.8), (1.93, 0.55, 3.2), (2.44, 0.5, 2.6), (2.98, 0.4, 2.2),
        (3.53, 0.32, 1.8), (4.12, 0.25, 1.4), (5.31, 0.18, 1.0), (6.6, 0.12, 0.8)]


def gong(f0, seed, dur=6.0):
    """Tam-tam: inharmonic modes in beating pairs; the higher modes bloom later (the gong's swell)."""
    rng = np.random.default_rng(seed)
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for r, a, d in GONG:
        for s in (-1, 1):
            fr = f0 * r * (1 + s * rng.uniform(0.001, 0.004))
            bloom = 1 - np.exp(-t / (0.02 + 0.05 * r))
            y += 0.5 * a * bloom * np.exp(-t / d) * np.sin(TAU * fr * t + rng.uniform(0, TAU))
    y += band(noise(n, seed + 9), lo=60, hi=900) * np.exp(-t / 0.06) * 0.5
    return norm(y)


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


def glass(dur=2.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = sum(a * np.exp(-t / d) * np.sin(TAU * f * t + ph)
            for f, a, d, ph in ((1760, 1.0, 1.2, 0.0), (2637, 0.6, 0.9, 1.0), (3520, 0.35, 0.6, 2.0), (5274, 0.2, 0.4, 3.0)))
    return norm(y * (1 - np.exp(-t / 0.002)))


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


def water_swell(dur, seed):
    rng = np.random.default_rng(seed)
    n = int(dur * SR)
    t = np.arange(n) / SR
    body = band(noise(n, seed), lo=150, hi=2200) * (np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.5)
    bub = np.zeros(n)
    m = int(0.08 * SR)
    tt = np.arange(m) / SR
    for _ in range(int(dur * 9)):
        at = int(rng.uniform(0, dur * 0.9) * SR)
        f = rng.uniform(320, 900)
        blip = np.sin(TAU * np.cumsum(f * (1 + 1.5 * tt / 0.08)) / SR) * np.exp(-tt / 0.02)
        e = min(m, n - at)
        bub[at:at + e] += rng.uniform(0.2, 0.5) * blip[:e]
    return norm(body + 0.6 * bub)


def flare(seed):
    """Anger: a low whoomp with a crackle of sparks."""
    rng = np.random.default_rng(seed)
    n = int(1.2 * SR)
    t = np.arange(n) / SR
    whoomp = band(noise(n, seed), lo=60, hi=1500) * np.clip(t / 0.18, 0, 1) ** 2 * np.exp(-np.clip(t - 0.18, 0, None) / 0.25)
    crack = np.zeros(n, np.float32)
    w = int(0.004 * SR)
    for _ in range(26):
        at = int(rng.uniform(0.12, 0.9) * SR)
        crack[at:at + w] += (rng.uniform(-1, 1) * np.exp(-np.arange(w) / (0.001 * SR))).astype(np.float32)
    return norm(whoomp + 0.6 * band(crack, lo=1200, hi=6000))


def pop(seed):
    """A soft rising blip for a 'who got what' tag popping in."""
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    ph = TAU * np.cumsum(620 + 700 * (t / 0.05).clip(0, 1)) / SR
    return norm(np.sin(ph) * np.exp(-t / 0.03) * (1 - np.exp(-t / 0.002)))


def sfx():
    buf = np.zeros((N, 2), np.float32)
    C, S = CUES, SCENES
    # cuts: whooshes on the hard scene changes
    for i, (f_, d, pf, pt) in enumerate(((S["ratna"][0] - 6, 0.45, -0.6, 0.6), (S["airavata"][0] - 8, 0.4, 0.6, -0.6),
                                         (S["choice"][0] - 7, 0.4, -0.5, 0.5), (S["vishnu"][0] - 8, 0.45, 0.5, -0.5),
                                         (S["end"][0] - 8, 0.5, -0.6, 0.6))):
        add(buf, whoosh(d, 200 + i, pf, pt), sec(f_), gain=0.45)
    # title: a shimmer under the bell
    add(buf, shimmer(1.3, 23), sec(C["titleHit"]), 0.0, 0.25)
    # 'who got what' tags popping in
    for i, c in enumerate(("rishi", "mera", "indra", "vishnuGem")):
        add(buf, pop(300 + i), sec(C[c]) + 0.2, 0.3 * (-1) ** i, 0.2)
    # the horse bursts from a wave
    add(buf, wave_burst(11), sec(C["horseBurst"]) - 0.05, 0.0, 0.9)
    # Airavata: the gong bloom
    add(buf, gong(68.0, 12), sec(S["airavata"][0]), -0.1, 0.8)
    # the gem: a glassy tone and sparkles as it flies, a soft landing glint
    add(buf, glass(), sec(C["kaustubh"]), 0.2, 0.32)
    add(buf, sparkle(0.9, 14), sec(C["kaustubh"]), -0.2, 0.3)
    add(buf, sparkle(0.4, 15, n_pings=5), sec(C["vishnuGem"]), 0.15, 0.25)
    # the lotus: a reversed swell into the rise, water swelling, the shimmer opening on the reveal
    rs = 1.1
    add(buf, reverse_swell(rs, 16), sec(C["lotusRise"]) - rs, 0.0, 0.5)
    add(buf, water_swell(2.6, 17), sec(C["lotusRise"]), 0.0, 0.5)
    add(buf, shimmer(2.2, 18), sec(C["lakshmi"]) - 0.3, 0.0, 0.32)
    # the choice: an anger flare on 'क्रोध', gold glints on 'मोह'
    add(buf, flare(19), sec(C["krodh"]) - 0.12, -0.25, 0.5)
    add(buf, sparkle(0.45, 20, n_pings=6, lo=3000, hi=5500, decay=0.12), sec(C["moh"]), 0.3, 0.32)
    # the varmala: petals and gold falling, a shimmer with the conch
    add(buf, sparkle(2.4, 21, n_pings=30, lo=2200, hi=7000, decay=0.06), sec(C["daal"]), 0.0, 0.3)
    add(buf, shimmer(2.0, 22, ("A5", "E6", "C#6")), sec(C["conch"]), 0.0, 0.25)
    return buf


# ------------------------------------------------------------------------------------ Kaal layer
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
    # the time-boom at frame 0 (the series opening): a deep falling impact into a long cosmic tail
    n = int(2.6 * SR)
    tb = np.arange(n) / SR
    ph = TAU * np.cumsum(38 + 52 * np.exp(-tb / 0.12)) / SR
    boom = (np.sin(ph) + 0.4 * np.sin(2 * ph) + 0.15 * np.sin(3 * ph)) * np.exp(-tb / 1.1) * (1 - np.exp(-tb / 0.004))
    boom = boom.astype(np.float32) + band(noise(n, 3), hi=400) * np.exp(-tb / 0.05).astype(np.float32) * 0.5
    y = convolve(boom, cosmic) * 0.55
    y[:n] += boom[:, None]
    add(fx, y, 0.0, gain=0.9)
    # the 'लक्ष्मी' echo: two taps, the second darker, wetter and further away; gone before line 06
    vo5 = read_wav(A.VO_DIR / "05_narrator.wav").mean(axis=1)
    s05, e05 = LINES["05_narrator"]
    w0 = max(0, int(sec(CUES["lakshmi"] - s05) * SR) - int(0.03 * SR))
    word = vo5[w0:].copy()
    word[: int(0.01 * SR)] *= np.linspace(0, 1, int(0.01 * SR))
    word[-int(0.06 * SR):] *= np.linspace(1, 0, int(0.06 * SR))
    for d, g, lp, wetm, pan in ((0.08, 0.38, 5000, 0.45, -0.3), (0.7, 0.18, 2600, 0.85, 0.4)):
        x = band(word, lo=140, hi=lp)
        y = convolve(x, cosmic) * wetm
        pl, pr = pan_gains(pan)
        y[: len(x), 0] += (1 - wetm) * pl * x
        y[: len(x), 1] += (1 - wetm) * pr * x
        add(echo, y, sec(e05) + d, gain=g)
    ia, ib = int(sec(BEATS["reveal"][1] - 6) * SR), int(sec(BEATS["reveal"][1] + 10) * SR)
    echo[ia:ib] *= (np.linspace(1, 0, ib - ia) ** 2)[:, None].astype(np.float32)
    echo[ib:] = 0
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
    only = set(sys.argv[1:])  # optional: rebuild only the named stems
    for name, fn, wet, lp in (("tanpura", tanpura, 0.35, 9000), ("pad", pad, 0.45, 5600),
                              ("santoor", santoor, 0.4, 11000), ("bells", bells, 0.5, None),
                              ("drums", drums, 0.18, 7000), ("sfx", sfx, 0.3, None)):
        if not only or name in only:
            finish(name, fn(), wet, hall, lp=lp)
    if not only or only & {"kaal", "kaal_fx", "echo"}:
        bed, fx, echo = kaal(cosmic)
        finish("kaal", bed)
        finish("kaal_fx", fx)
        finish("echo", echo, peak=None)  # natural level, relative to the trimmed narrator take
    print("SCORE DONE", flush=True)


if __name__ == "__main__":
    main()
