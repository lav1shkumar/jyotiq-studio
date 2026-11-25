"""Manthan Ep7 RAHU - original score, SFX bed and Kaal time layer, synthesized from scratch (numpy).

Writes 32-bit float stems (48 kHz stereo) into manthan-ep7/audio/stems/ (outside Remotion's public/
folder; only mix.wav goes to public/). Follows PLAN.md's Audio section. Built in parts:
  PART 1 (this file so far):
    tanpura.wav  the series drone (Sa = A), same strings and cycle as Episodes 4-6
    pad.wav      strings + choir: a low eclipse drone and dark choir under the hook, komal Re rubbing on 'सिर',
                 the female 'aah' on 'किसका?' -> the series title hit -> a cold creeping bed for the impostor
                 -> Mohini's Yaman warmth souring to komal Re on the sip -> a tritone cluster tightening to the
                 stab on 'ये असुर है!' -> the melt smearing down -> a rising build to the chakra's strike, then
                 nothing through the whiteout -> a beating A/Bb drone under the laugh -> low choir (split)
                 -> a dark fifth for the vow -> the eclipse swell that drops away at totality -> warm A add9 close
  PART 2 (next): santoor (Mohini's theme souring; the Rahu/Ketu two-note motif), bells (the totality bell),
                 drums (Episode 6's heartbeat under 02, the alarm roll in 04, the chakra hit, the vengeful pulse
                 in 08, the chase build in 09), synth SFX glue, the Kaal layer (sub drone, time-boom on frame 0,
                 the rewind after 'किसका?', echoes of 'राहु' and 'केतु' from the user's own takes), finish(), main().
Nothing here samples or imitates any existing show's music or voice.

Run: "$KIROCREW_SCRATCH/venv-audio/bin/python" scripts/manthan_ep7_score.py [stem ...]
(only after scripts/manthan_ep7_vo_prep.py has prepared the Episode 7 takes: the score follows their clock)
"""
import sys
import time
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
import manthan_ep7_audio as A  # noqa: E402  (same clock as the picture)
# Pure DSP helpers and instruments from Episode 4, imported read-only (as Episode 6 does).
from manthan_ep4_score import (  # noqa: E402
    CYCLE, SR, STRINGS, TAU, add, band, bell, choir_note, convolve, dha, drum, env_ar, lub, make_ir,
    pan_gains, pink, read_wav, string_note, ta, tanpura_pluck, write_f32,
)

FPS = A.FPS
OUT = A.EP7 / "audio/stems"
LINES, BEATS, SCENES, CUES, TOTAL = A.build_timing(A.vo_frames())
N = int(TOTAL / FPS * SR) + 2 * SR  # 2 s of tail room; the mix trims to TOTAL
T0 = time.time()

# Series key Sa = A. Yaman = A B C# D# E F# G# for Mohini; komal Re (Bb), F and C for Rahu's darkness.
NOTE = {"A1": 55.0, "Bb1": 58.27, "E2": 82.41, "F2": 87.31, "A2": 110.0, "Bb2": 116.54, "B2": 123.47,
        "C3": 130.81, "C#3": 138.59, "D3": 146.83, "D#3": 155.56, "E3": 164.81, "F3": 174.61, "F#3": 185.0,
        "G3": 196.0, "G#3": 207.65, "A3": 220.0, "Bb3": 233.08, "B3": 246.94, "C4": 261.63, "C#4": 277.18,
        "D4": 293.66, "D#4": 311.13, "E4": 329.63, "F4": 349.23, "F#4": 369.99, "G4": 392.0, "G#4": 415.30,
        "A4": 440.0, "Bb4": 466.16, "B4": 493.88, "C5": 523.25, "C#5": 554.37, "D#5": 622.25, "E5": 659.26,
        "F5": 698.46, "F#5": 739.99, "G#5": 830.61, "A5": 880.0, "B5": 987.77, "C#6": 1108.73, "E6": 1318.51,
        "F#6": 1479.98}


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
    # hook: sound from frame 0 (a short attack): the low eclipse drone and a dark male choir, swelling;
    # komal Re rubs in on 'सिर'; the female 'aah' leans in on 'किसका?'
    hk = S["hook"]
    seg(buf, "str", 0, hk[1], ["A1", "E2", "A2"], 0.6, att=0.05, rel=0.5, shape="cresc", seed=1)
    seg(buf, "choir", 0, hk[1], ["A2", "E3"], 0.34, att=0.3, rel=0.5, shape="cresc", seed=2)
    seg(buf, "str", C["sir"] - 2, C["kiska"], ["Bb2", "F3"], 0.28, att=0.1, rel=0.3, trem=0.4, seed=3)
    seg(buf, "choir", C["kiska"] - 6, hk[1] + 4, ["E4"], 0.3, att=0.2, rel=0.4, shape="cresc", female=True, seed=4)
    # the series title hit (A major, as Episode 6) as the rewind lands on Episode 6's last beat
    seg(buf, "str", C["titleHit"], S["title"][1], ["A2", "E3", "A3", "C#4"], 0.62, att=0.03, rel=0.8, seed=5)
    seg(buf, "choir", C["titleHit"], S["title"][1], ["A2", "E3"], 0.4, att=0.05, rel=0.9, seed=6)
    # 02 the row: a cold creeping bed (low A with komal Re); the strings lean in on 'स्वर्भानु'
    rw = S["row"]
    seg(buf, "str", rw[0], rw[1], ["A1", "E2", "Bb2"], 0.4, att=0.4, rel=0.3, trem=0.12, seed=7)
    seg(buf, "str", C["svarbhanu"] - 2, rw[1], ["F3", "Bb3"], 0.22, att=0.08, rel=0.3, trem=0.35, seed=8)
    # 03 the pour: Mohini's Yaman warmth (tivra Ma), souring to komal Re the moment he sips
    po = S["pour"]
    seg(buf, "str", po[0], C["ghoont"], ["A2", "E3", "G#3", "C#4"], 0.4, att=0.5, rel=0.3, shape="swell", seed=9)
    seg(buf, "choir", po[0] + 6, C["ghoont"], ["E5"], 0.16, att=0.4, rel=0.3, female=True, seed=10)
    seg(buf, "str", C["ghoont"], po[1], ["A2", "Bb2", "F3"], 0.44, att=0.05, rel=0.4, trem=0.3, seed=11)
    # 04 the alert: a tritone cluster tightening to the stab on 'ये असुर है!'
    al = S["alert"]
    seg(buf, "str", al[0], C["asurHai"], ["A2", "D#3", "A3"], 0.42, att=0.1, rel=0.1, shape="cresc", trem=0.5, seed=12)
    seg(buf, "str", C["asurHai"], al[1], ["Bb2", "F3", "Bb3", "D4"], 0.7, att=0.02, rel=0.5, seed=13)
    # the melt: the cluster smears down as the disguise falls away
    me = B["melt"]
    seg(buf, "str", me[0], me[1] + 4, ["A1", "Bb1", "E2"], 0.5, att=0.05, rel=0.4, trem=0.6, seed=14)
    # 05 the chakra: a rising build to the strike on 'अलग' (short release), then nothing in the pad through
    # the whiteout: the hit and the silence carry it
    ch = S["chakra"]
    seg(buf, "str", ch[0], C["alag"], ["A2", "E3", "A3"], 0.45, att=0.2, rel=0.08, shape="cresc", trem=0.25, seed=15)
    seg(buf, "choir", C["chala"], C["alag"], ["A3", "E4"], 0.3, att=0.15, rel=0.08, shape="cresc", seed=16)
    # 06 immortal: a beating A/Bb drone under the laugh; a cold low choir on 'अमर'
    im = S["immortal"]
    seg(buf, "str", im[0], im[1], ["A1", "Bb1", "E2"], 0.52, att=0.3, rel=0.4, seed=17)
    seg(buf, "choir", C["amar"] - 2, im[1], ["Bb2", "F3"], 0.3, att=0.1, rel=0.4, seed=18)
    # 07 split: low choir and an open fifth (the Rahu/Ketu two-note motif is in the santoor part)
    sp = S["split"]
    seg(buf, "choir", sp[0], sp[1], ["A2", "E3"], 0.36, att=0.4, rel=0.4, seed=19)
    seg(buf, "str", sp[0], sp[1], ["A1", "E2"], 0.34, att=0.4, rel=0.4, seed=20)
    # 08 vow: a dark fifth with komal Re (the vengeful pulse itself is in the drums)
    vw = S["vow"]
    seg(buf, "str", vw[0], vw[1], ["A1", "E2", "Bb2"], 0.48, att=0.15, rel=0.3, trem=0.2, seed=21)
    # 09 chase: the eclipse swell, cut away at 'ग्रहण' so totality falls to near-silence (one high breath)
    cs = S["chase"]
    seg(buf, "str", cs[0], C["grahan09"], ["A2", "E3", "A3", "Bb3"], 0.55, att=0.3, rel=0.15, shape="cresc", trem=0.3, seed=22)
    seg(buf, "choir", C["nigalta"] - 6, C["grahan09"], ["A2", "E3", "A3"], 0.4, att=0.2, rel=0.15, shape="cresc", seed=23)
    seg(buf, "choir", B["totality"][0], B["totality"][1] + 6, ["E5"], 0.1, att=0.3, rel=0.8, female=True, seed=24)
    # end: warm resolve (A add9) under the kundali and the Jyotiq close
    seg(buf, "str", S["kundali"][0], TOTAL - 20, ["A2", "E3", "A3", "B3", "E4"], 0.4, att=1.0, rel=1.5, seed=25)
    seg(buf, "choir", C["signoff"] - 10, TOTAL - 20, ["A2", "E3"], 0.26, att=0.8, rel=1.5, seed=26)
    return buf


# ------------------------------------------------------------------------------------ santoor
# santoor_note, sn, santoor_run and tremolo are copied from manthan_ep6_score.py unchanged (importing that
# module would also build Episode 6's clock).
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
    C, S, L = CUES, SCENES, LINES
    # hook: a questioning note on 'सिर', a dark komal-Re fall on 'किसका?', the rewinding run into the title
    add(buf, sn("E5", 0), sec(C["sir"]), -0.3, 0.3)
    santoor_run(buf, C["kiska"], ["E5", "Bb4", "A4"], 0.1, 0.3, pan=(0.4, -0.4))
    santoor_run(buf, C["rewind"], ["A5", "F#5", "E5", "C#5", "B4", "A4"], 0.05, 0.3, pan=(0.5, -0.5), accel=0.9)
    santoor_run(buf, C["titleHit"], ["A4", "E5", "A5"], 0.02, 0.34)
    # 02: Episode 6's impostor motif, two cold notes a tritone apart, on 'स्वर्भानु'
    add(buf, sn("Bb3", 1), sec(C["svarbhanu"]), -0.2, 0.24)
    add(buf, sn("E4", 1), sec(C["svarbhanu"] + 12), 0.2, 0.22)
    # 03: Mohini's theme (Yaman, as Episode 6) as her name opens the line, glitter falling into his cup on
    # 'डाला', then the theme souring through komal Re after 'घूँट'
    santoor_run(buf, L["03_narrator"][0] + 2, ["A4", "B4", "C#5", "D#5", "E5"], 0.16, 0.28)
    santoor_run(buf, C["dala"], ["E6", "C#6", "B5", "A5", "F#5", "E5"], 0.07, 0.26, pan=(0.5, -0.5))
    santoor_run(buf, C["ghoont"] + 4, ["E5", "D#5", "C5", "Bb4", "A4"], 0.14, 0.26, pan=(0.3, -0.3), accel=1.15)
    # 04: the alarm, a cold trill from 'पहचान' to 'ये असुर है!'
    tremolo(buf, C["pehchan"], C["asurHai"], ["Bb4", "E5"], 14.0, 0.22, seed=40)
    # 07: the Rahu/Ketu motif, komal Re for Rahu and the tritone above it for Ketu (opposite, always)
    add(buf, sn("Bb3", 0), sec(C["rahu07"]), -0.35, 0.32)
    add(buf, sn("E4", 0), sec(C["ketu07"]), 0.35, 0.3)
    # 10: the motif returns on 'कुंडली' and resolves to Sa on 'भाव'
    santoor_run(buf, C["kundali"], ["Bb4", "E5"], 0.12, 0.22, pan=(-0.35, 0.35))
    santoor_run(buf, C["bhaav"], ["A4", "E5", "A5"], 0.08, 0.22)
    return buf


# ------------------------------------------------------------------------------------ bells + drums
def ghanti(dur, seed, rate=9.0):
    """A temple hand bell rung fast: repeated strikes of a small bell (copied from Episode 6)."""
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
    C, B = CUES, BEATS
    hits = [  # (frame, fundamental Hz, gain, pan): in the gaps between lines
        (C["titleHit"], 220.0, 1.0, 0.0),            # the series title bell
        (C["titleHit"], 440.0, 0.35, 0.2),
        (C["svarbhanu"] + 2, 233.08, 0.42, -0.2),    # SVARBHANU name card: a low, cold komal-Re bell
        (B["totality"][0] + 6, 220.0, 0.9, 0.0),     # after the eclipse swell drops away: one deep bell
        (B["totality"][0] + 8, 440.0, 0.3, 0.2),
        (C["kundali"], 659.26, 0.3, -0.15),          # a soft bell as the chart starts to turn
        (C["brandChime"], 880.0, 0.35, 0.2),         # Jyotiq sign-off chime
    ]
    for i, (f_, hz, g, p) in enumerate(hits):
        add(buf, bell(hz, 7.0 if hz <= 240 else 5.0, 40 + i), sec(f_), p, g)
    return buf


def tok(seed):
    """A soft wooden tick (copied from Episode 6)."""
    return drum(seed, 620, 900, 0.01, 0.035, 2000, 6000, 0.004, 0.3, dur=0.2, harm2=0.2)


def loop(buf, a, b, bpm, pat, g0, g1, seed):
    """Tabla eighths from a to b seconds, gain ramping g0 -> g1 (copied from Episode 6)."""
    beat, t, k = 60 / bpm / 2, a, 0
    while t < b:
        s = pat[k % len(pat)]
        if s:
            g = (g0 + (g1 - g0) * (t - a) / max(0.1, b - a)) * (1.0 if k % 8 == 0 else 0.8)
            add(buf, dha(seed + k) if s == "D" else ta(seed + k), t, -0.15 if s == "D" else 0.2, g)
        t += beat
        k += 1


def heartbeat(buf, a, b, period, g, seed):
    """Episode 6's impostor heartbeat: a low lub-dub every `period` seconds from a to b."""
    t, k = a, 0
    while t < b:
        add(buf, lub(seed + k), t, 0.0, g)
        add(buf, lub(seed + k + 1), t + 0.22, 0.0, g * 0.7)
        t += period
        k += 2


def drums():
    buf = np.zeros((N, 2), np.float32)
    S, B, C, L = SCENES, BEATS, CUES, LINES
    # hook: a tick on 'सिर', a low hit on 'किसका?'
    add(buf, tok(10), sec(C["sir"]), 0.0, 0.4)
    add(buf, lub(20), sec(C["kiska"]), 0.0, 0.8)
    # 02: Episode 6's heartbeat under the row, a low hit on 'स्वर्भानु'
    heartbeat(buf, sec(S["row"][0]) + 0.3, sec(S["row"][1]) - 0.3, 0.9, 0.42, 100)
    add(buf, lub(150), sec(C["svarbhanu"]), 0.0, 0.9)
    # 03: Mohini's light taps (her walk in Episode 6) until the pour
    t, k = sec(L["03_narrator"][0]), 0
    while t < sec(C["dala"]):
        add(buf, ta(200 + k), t, 0.3 * np.sin(k * 1.3), 0.14)
        t += 0.5
        k += 1
    # 04: the alarm roll from 'पहचान', a big hit as 'ये असुर है!' lands; a low thud as the disguise melts
    loop(buf, sec(C["pehchan"]), sec(C["asurHai"]) - 0.03, 150, ["D", "T", "T", "D", "T", "D", "T", "T"], 0.4, 0.85, 300)
    add(buf, lub(400), sec(C["asurHai"]), 0.0, 1.1)
    add(buf, dha(401), sec(C["asurHai"]), 0.0, 0.9)
    add(buf, lub(420), sec(B["melt"][0]), 0.0, 0.8)
    # 05: a pulse that builds from 'चक्र', ONE big hit on 'अलग', then nothing through the whiteout
    loop(buf, sec(C["chakra"]), sec(C["alag"]) - 0.03, 120, ["D", None, "T", "T", "D", None, "T", None], 0.3, 0.75, 500)
    add(buf, lub(600), sec(C["alag"]), 0.0, 1.3)
    add(buf, dha(601), sec(C["alag"]), 0.0, 1.0)
    # 06: one low hit on 'अमर'
    add(buf, lub(650), sec(C["amar"]), 0.0, 0.9)
    # 08: the slow vengeful pulse, a hit on 'लौटूँगा'
    heartbeat(buf, sec(S["vow"][0]) + 0.2, sec(C["lautunga"]) - 0.1, 0.75, 0.5, 700)
    add(buf, lub(780), sec(C["lautunga"]), 0.0, 1.1)
    # 09: the chase builds from 'पीछा' and doubles from 'निगलता', cut dead at 'ग्रहण' (totality is near-silent)
    loop(buf, sec(C["peecha"]), sec(C["nigalta"]), 110, ["D", None, "T", "T", "D", None, "T", None], 0.35, 0.6, 800)
    loop(buf, sec(C["nigalta"]), sec(C["grahan09"]) - 0.03, 160, ["D", "T", "T", "D", "T", "D", "T", "T"], 0.6, 0.95, 860)
    add(buf, lub(900), sec(C["grahan09"]), 0.0, 1.0)
    return buf


# ------------------------------------------------------------------------------------ sfx helpers
# whoosh_m, wave_burst, sparkle, shimmer and reverse_swell are copied from manthan_ep6_score.py unchanged.
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
    """Synth glue only; the user's own ElevenLabs SFX are placed by the mix (manthan_ep7_audio.py)."""
    buf = np.zeros((N, 2), np.float32)
    C, S, B = CUES, SCENES, BEATS

    def ending_at(y, f_, pan, g):
        add(buf, y, sec(f_) - len(y) / SR, pan, g)

    for i, name in enumerate(["title", "row", "pour", "alert", "chakra", "split", "vow", "chase", "kundali"]):
        add(buf, whoosh_m(0.45, 10 + i), sec(S[name][0]) - 0.3, 0.5 if i % 2 else -0.5, 0.22)
    ending_at(reverse_swell(0.8, 30), C["titleHit"], 0.0, 0.45)                 # the rewind lands on Episode 6
    add(buf, sparkle(1.2, 31, n_pings=12, decay=0.12), sec(C["dala"]), 0.2, 0.3)  # amrit glitter into his cup
    add(buf, shimmer(1.0, 32, ("A5", "E6")), sec(B["sip"][0]), -0.1, 0.24)      # the gold glow down his throat
    ending_at(reverse_swell(0.5, 33), B["melt"][0], 0.0, 0.4)                   # into the melt
    ending_at(whoosh_m(1.0, 34, lo=300, hi=6500), C["alag"], -0.3, 0.5)         # the chakra flying in to the strike
    add(buf, whoosh_m(0.6, 35, lo=60, hi=900), sec(S["vow"][0]) - 0.4, 0.0, 0.4)  # the head returns, close
    add(buf, sparkle(0.5, 36, n_pings=6, lo=4000, hi=8000, decay=0.1), sec(B["totality"][0] + 4), 0.3, 0.32)  # diamond ring
    return buf


# ------------------------------------------------------------------------------------ Kaal layer
def word_echo(cosmic, stem, cue, end_cue, at_f, taps, fade_a, fade_b):
    """Echo taps of one word cut from a trimmed take, in its own buffer, silenced from fade_b on
    (copied from Episode 6 unchanged)."""
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


def rewind_fx(dur, seed):
    """Kaal's time-rewind: a tape-scrub sweep falling then rising, under a brightening hiss."""
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
    # the wheel of time: two close low tones beating at 0.35 Hz, with harmonics phones can play (Episode 6)
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
    # the time-rewind after 'किसका?', running into the title hit
    rw = rewind_fx(max(0.5, sec(CUES["titleHit"] - CUES["kiska"] - 6)), 7)
    add(fx, rw, sec(CUES["kiska"] + 6), 0.0, 0.45)
    # echoes of 'राहु' and 'केतु' from line 07's own take, each gone before the next words
    s07, e07 = LINES["07_narrator"]
    rahu, ketu = CUES["rahu07"], CUES["ketu07"]
    echo = word_echo(cosmic, "07_narrator", rahu, min(rahu + 14, ketu - 4), rahu + 14,
                     ((0.08, 0.34, 4500, 0.5, -0.35), (0.55, 0.16, 2600, 0.85, 0.35)),
                     min(rahu + 30, ketu - 14), min(rahu + 40, ketu - 6))
    nxt = LINES["08_rahu"][0]
    echo += word_echo(cosmic, "07_narrator", ketu, None, e07,
                      ((0.08, 0.34, 4500, 0.5, 0.35), (0.55, 0.16, 2600, 0.85, -0.35)),
                      nxt - 14, nxt - 4)
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


# (stem, wet, low-pass) exactly as Episodes 5-6
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
    if not only or only & {"kaal", "kaal_fx", "echo"}:
        bed, fx, echo = kaal(cosmic)
        finish("kaal", bed)
        finish("kaal_fx", fx)
        finish("echo", echo, peak=None)  # natural level, relative to the trimmed narrator takes
    print("SCORE DONE", flush=True)


if __name__ == "__main__":
    main()
