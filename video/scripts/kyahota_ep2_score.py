"""क्या होता अगर… Ep2 · शनि की टेढ़ी नज़र: original score and SFX, synthesized from scratch (numpy), on the reel clock.

Built on the Navagraha series instruments (helpers imported read-only from navagraha_ep2_score.py / manthan_ep4_score.py):
tanpura Sa-Pa (Sa = A), strings + choir, brass, santoor, temple bells, pakhawaj and the driving spiciato pulse.
This reel's palette: a FIERY open (fire roar and crackle, the pulse at full drive, frame drums, Shani's low tritone A / D#
with the Phrygian Bb rub), the lens crack and a sub boom, then the brand starter's sonic; the curse in violet clusters;
Kailash in a soft female choir; the glance as a held breath, a white-noise hush and silence; Vishnu's brass; the Gajanan
reveal in full A major with bells and sparkle; the court in royal brass; Sade Sati as a dark drone with dha strikes;
the kalank crack; the crown's fall; the restoration's swell; Vikram's ask tender and bare; the scales resolve the tritone.
Clock: kya-hota-agar-ep2/audio/vo/clock.json; cut frames mirror kyahota/ep2/Episode.tsx. Stems -> audio/stems/.
Run: /Users/ayushrajput/earshot/.venv/bin/python scripts/kyahota_ep2_score.py
"""
import json
import sys
import time
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
from manthan_ep4_score import CYCLE, SR, STRINGS, TAU, add, band, bell, convolve, dha, drum, make_ir, string_note, ta, tanpura_pluck, write_f32  # noqa: E402
from navagraha_ep2_score import NOTE, boom, crack, hiss, noise, norm, reverse_swell, run, seg, shimmer, sparkle, tick, whoosh, loop  # noqa: E402

EP = Path("/Users/ayushrajput/.kiro/crew/workspace/kya-hota-agar-ep2")
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


def sec(fr):
    return fr / FPS


OPEN_A = B_(2) - 3
C = dict(hookB=A_(1) - 2, hookC=A_(2) - 2, open=OPEN_A, curse=A_(3) - 3, lotus=A_(4) - 2, lower=A_(6) - 2, kailash=A_(7) - 2,
         parvati=A_(8) - 3, side=A_(9) - 2, eye=A_(10) - 2, hush=A_(11) - 2, vishnu=A_(13) - 2, reveal=A_(14) - 2, court=A_(16) - 2,
         iron=A_(17) - 2, shaniSpeak=A_(18) - 3, sadeSati=A_(19) - 2, kalank=A_(20) - 2, crown=A_(21) - 2, arrive=A_(22) - 2,
         restore=A_(23) - 2, ask=A_(24) - 2, vikramSpeak=A_(25) - 3, danda=A_(26) - 2, hisaab=A_(27) - 2, feature=A_(28) - 3,
         phone=A_(29) - 2, end=B_(29) + 6)
K = dict(najar=cue(1, "नज़र"), aap=cue(2, "आप"), shraap=cue(3, "श्राप"), anisht=cue(5, "अनिष्ट"), parvatiW=cue(7, "पार्वती"),
         pal=cue(10, "पल"), sir=cue(11, "सिर"), alag=cue(12, "अलग"), vishnuW=cue(13, "विष्णु"), gajanan=A_(15),
         vikram=cue(16, "विक्रमादित्य"), aakhiri=cue(16, "आख़िरी"), lohe=A_(17), saadhe=A_(19), kalankW=cue(20, "कलंक"),
         chhin=cue(21, "छिन"), khud=cue(22, "ख़ुद"), lauta=cue(23, "लौटा"), danda=cue(26, "दंड"), hisaab=cue(27, "हिसाब"))
CRACK = B_(2) - 3
TITLE = CLK["intro"][1]["fa"]  # "क्या होता अगर।" stamp
NOTE.update({"D5": 587.33, "C4": 261.63, "C5": 523.25, "G#2": 103.83, "D2": 73.42, "G2": 98.0, "C#2": 69.3, "F3": 174.61, "G3": 196.0})


def fire(dur, seed):
    """A fire: low roar (brown-ish rumble), mid hiss, and random crackles."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    roar = band(np.cumsum(noise(n, seed)) / 300.0, lo=30, hi=260)
    roar = roar / max(1e-6, float(np.max(np.abs(roar))))
    hissy = band(noise(n, seed + 1), lo=900, hi=5000) * (0.5 + 0.5 * np.sin(TAU * 0.7 * t) ** 2) * 0.25
    rng = np.random.default_rng(seed + 2)
    cr = np.zeros(n, np.float32)
    m = int(0.03 * SR)
    tt = np.arange(m) / SR
    for _ in range(int(dur * 22)):
        at = int(rng.uniform(0, dur - 0.05) * SR)
        cr[at:at + m] += (band(noise(m, int(rng.integers(1e6))), lo=1500, hi=9000) * np.exp(-tt / 0.004) * rng.uniform(0.3, 1.0)).astype(np.float32)
    e = np.clip(t / 0.05, 0, 1) * np.clip((dur - t) / 0.4, 0, 1)
    return norm((0.9 * roar + hissy + 0.6 * cr) * e)


def white_hush(dur, seed):
    """The hush after the glance: a soft high air tone fading to nothing (tinnitus-like but gentle)."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = 0.6 * np.sin(TAU * 2960 * t) * np.exp(-t / (0.45 * dur)) + 0.4 * band(noise(n, seed), lo=4000, hi=9000) * np.exp(-t / 0.3)
    return norm(y * np.clip(t / 0.01, 0, 1))


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
    g = np.ones(N, np.float32)
    pts = [(0, 0.35), (C["open"], 0.35), (C["curse"], 1.0), (C["eye"], 1.0), (C["hush"], 0.0), (C["vishnu"], 0.0), (C["vishnu"] + 20, 1.0),
           (C["sadeSati"], 1.0), (C["sadeSati"] + 4, 0.4), (C["arrive"], 0.4), (C["arrive"] + 20, 1.0), (TOTAL, 1.0)]
    fx_, vx = zip(*pts)
    g = np.interp(np.arange(N) / SR * FPS, fx_, vx).astype(np.float32)
    return buf * g[:, None]


def pad():
    buf = np.zeros((N, 2), np.float32)
    # HOOK: fiery and dark: low strings in tremolo with the Phrygian rub, Shani's tritone choir building to the crack
    seg(buf, "str", 0, CRACK, ["A1", "Bb1", "E2", "A2"], 0.5, att=0.05, rel=0.2, shape="cresc", trem=0.35, seed=1)
    seg(buf, "choir", 0, CRACK, ["A2", "D#3"], 0.3, att=0.3, rel=0.2, shape="cresc", seed=2)
    seg(buf, "brass", K["najar"] - 2, CRACK, ["A2", "D#3", "A3"], 0.34, att=0.06, rel=0.2, shape="cresc", seed=3)
    seg(buf, "str", C["hookC"], CRACK, ["Bb4", "A5"], 0.12, att=0.3, rel=0.05, shape="cresc", trem=0.5, seed=4)
    # title stamp after the starter: Shani's colour in the A major of the brand
    seg(buf, "str", TITLE - 2, C["curse"], ["A2", "E3", "A3", "C#4"], 0.42, att=0.03, rel=0.4, seed=5)
    seg(buf, "choir", TITLE - 2, C["curse"], ["A2", "E3"], 0.3, att=0.05, rel=0.4, seed=6)
    seg(buf, "choir", TITLE + 6, C["curse"], ["D#4"], 0.1, att=0.3, rel=0.4, female=True, seed=7)
    # the curse: violet clusters; the lotus wilting: a falling thin line
    seg(buf, "str", C["curse"], C["lower"], ["A1", "D#2", "A2", "Bb2"], 0.48, att=0.05, rel=0.3, trem=0.3, seed=8)
    seg(buf, "choir", K["shraap"] - 2, C["lower"], ["D#3", "A3"], 0.26, att=0.05, rel=0.3, seed=9)
    seg(buf, "str", K["anisht"] - 6, C["lower"], ["E5", "D#5"], 0.1, att=0.3, rel=0.2, seed=10)
    seg(buf, "str", C["lower"], C["kailash"], ["A1", "D#2", "A2"], 0.4, att=0.2, rel=0.3, seed=11)
    # Kailash and Parvati: tender, a female choir, Yaman colour
    seg(buf, "str", C["kailash"], C["side"], ["A2", "E3", "G#3", "C#4"], 0.38, att=0.4, rel=0.3, shape="swell", seed=12)
    seg(buf, "choir", C["kailash"] + 6, C["side"], ["C#5", "E5"], 0.14, att=0.4, rel=0.3, female=True, seed=13)
    # the side glance and the eye: tension, a held thin note, the cluster tightening
    seg(buf, "str", C["side"], C["hush"], ["A1", "Bb1", "D#2", "A2"], 0.5, att=0.1, rel=0.05, shape="cresc", trem=0.4, seed=14)
    seg(buf, "str", C["eye"], C["hush"], ["Bb5"], 0.13, att=0.3, rel=0.02, shape="cresc", seed=15)
    seg(buf, "choir", C["eye"], C["hush"], ["D#3", "A3"], 0.26, att=0.3, rel=0.02, shape="cresc", seed=16)
    # the hush: almost nothing, a low choir far away
    seg(buf, "choir", K["sir"], C["vishnu"], ["A2", "Bb2"], 0.2, att=0.6, rel=0.3, seed=17)
    # Vishnu: brass and strings rising in D major (IV of A), then the reveal in full A major
    seg(buf, "str", C["vishnu"], C["reveal"], ["D3", "F#3", "A3", "D4"], 0.42, att=0.3, rel=0.2, shape="cresc", seed=18)
    seg(buf, "brass", C["vishnu"] + 6, C["reveal"], ["D3", "A3", "D4"], 0.28, att=0.2, rel=0.2, shape="cresc", seed=19)
    seg(buf, "str", K["gajanan"], C["court"] + 6, ["A2", "E3", "A3", "C#4", "E4"], 0.6, att=0.03, rel=0.5, shape="swell", seed=20)
    seg(buf, "choir", K["gajanan"], C["court"] + 6, ["A2", "E3", "A3", "C#4"], 0.46, att=0.04, rel=0.5, shape="swell", seed=21)
    seg(buf, "brass", K["gajanan"] + 1, C["court"], ["A2", "E3", "A3", "C#4"], 0.3, att=0.04, rel=0.4, shape="swell", seed=22)
    seg(buf, "choir", K["gajanan"] + 4, C["court"] + 6, ["E5", "A5"], 0.13, att=0.2, rel=0.5, female=True, seed=23)
    # the court: royal brass in A; it sours to the tritone on "आख़िरी… लोहे का"
    seg(buf, "brass", C["court"], K["aakhiri"], ["A2", "E3", "A3"], 0.26, att=0.1, rel=0.2, seed=24)
    seg(buf, "str", C["court"], K["aakhiri"], ["A2", "E3", "A3", "C#4"], 0.36, att=0.1, rel=0.2, seed=25)
    seg(buf, "str", K["aakhiri"], C["sadeSati"], ["A1", "D#2", "A2", "D#3"], 0.52, att=0.05, rel=0.2, trem=0.25, seed=26)
    seg(buf, "choir", K["lohe"], C["sadeSati"], ["D#3", "A3"], 0.28, att=0.1, rel=0.2, seed=27)
    # Sade Sati: a dark low drone; kalank: a cold cluster; the crown's fall: everything sinks
    seg(buf, "str", C["sadeSati"], C["arrive"], ["A1", "Bb1", "E2"], 0.5, att=0.05, rel=0.3, trem=0.2, seed=28)
    seg(buf, "choir", C["sadeSati"], C["kalank"], ["A2", "D#3"], 0.28, att=0.1, rel=0.2, seed=29)
    seg(buf, "str", C["kalank"], C["crown"], ["Bb3", "E4", "A4"], 0.2, att=0.05, rel=0.2, trem=0.5, seed=30)
    seg(buf, "choir", C["crown"], C["arrive"], ["A2", "Bb2"], 0.3, att=0.2, rel=0.3, seed=31)
    # Shani arrives: cool light, then the restoration swell into A major
    seg(buf, "str", C["arrive"], C["restore"], ["A2", "E3", "B3", "E4"], 0.38, att=0.3, rel=0.2, shape="cresc", seed=32)
    seg(buf, "choir", C["arrive"], C["restore"], ["E4", "B4"], 0.14, att=0.3, rel=0.2, female=True, seed=33)
    seg(buf, "str", C["restore"], C["ask"] + 10, ["A2", "E3", "A3", "C#4", "E4"], 0.5, att=0.2, rel=0.5, shape="swell", seed=34)
    seg(buf, "brass", K["lauta"], C["ask"], ["A2", "E3", "A3"], 0.26, att=0.1, rel=0.4, shape="swell", seed=35)
    # the ask: bare and tender (strings only, F#m colour), under Vikram's voice almost nothing
    seg(buf, "str", C["ask"], C["danda"], ["F#3", "A3", "C#4"], 0.3, att=0.4, rel=0.3, seed=36)
    seg(buf, "choir", C["vikramSpeak"], C["danda"], ["A2", "C#3"], 0.16, att=0.5, rel=0.3, seed=37)
    # the truth: the tritone resolves into A (scales of karma)
    seg(buf, "str", C["danda"], K["hisaab"], ["A1", "D#2", "A2"], 0.36, att=0.2, rel=0.1, seed=38)
    seg(buf, "str", K["hisaab"], C["feature"], ["A1", "E2", "A2", "E3", "A3"], 0.58, att=0.02, rel=0.4, seed=39)
    seg(buf, "choir", K["hisaab"], C["feature"], ["A2", "E3", "A3"], 0.4, att=0.03, rel=0.4, seed=40)
    seg(buf, "brass", K["hisaab"] + 1, C["feature"] - 2, ["A2", "E3", "A3"], 0.28, att=0.03, rel=0.4, seed=41)
    # feature and end: bright
    seg(buf, "str", C["feature"], C["end"], ["A2", "E3", "A3", "C#4"], 0.36, att=0.15, rel=0.3, seed=42)
    seg(buf, "brass", C["phone"], C["end"], ["A3", "C#4", "E4"], 0.18, att=0.2, rel=0.3, seed=43)
    seg(buf, "str", C["end"], TOTAL - 10, ["A2", "E3", "A3", "B3", "E4"], 0.42, att=0.3, rel=1.2, seed=44)
    seg(buf, "choir", C["end"], TOTAL - 10, ["A2", "E3"], 0.26, att=0.4, rel=1.2, seed=45)
    return buf


def santoor():
    buf = np.zeros((N, 2), np.float32)
    run(buf, 4, ["A4", "D#5"], 0.3, 0.24, pan=(-0.3, 0.3))  # Shani's motif under frame 0
    run(buf, TITLE - 4, ["A4", "C#5", "E5", "A5"], 0.035, 0.3)
    run(buf, K["shraap"] + 4, ["A4", "D#5", "A4"], 0.3, 0.2, pan=(-0.3, 0.3))
    run(buf, C["kailash"] + 4, ["A4", "B4", "C#5", "D#5", "E5"], 0.12, 0.24, pan=(0.3, -0.3))  # a lullaby for the newborn
    run(buf, C["eye"] + 6, ["A4", "D#5"], 0.4, 0.2, pan=(-0.3, 0.3))
    run(buf, K["gajanan"] + 2, ["A4", "C#5", "E5", "A5", "C#6", "E6"], 0.06, 0.24, pan=(-0.5, 0.5))
    run(buf, C["court"] + 6, ["A4", "B4", "C#5", "D5", "E5", "F#5", "G#5", "A5"], 0.07, 0.18, pan=(-0.5, 0.5))  # a royal fanfare run
    run(buf, K["lohe"] + 2, ["A4", "D#5"], 0.3, 0.22, pan=(0.3, -0.3))
    run(buf, K["lauta"] + 4, ["A4", "C#5", "E5", "A5"], 0.09, 0.22)
    run(buf, C["ask"] + 6, ["E5", "C#5", "B4", "A4"], 0.3, 0.16, pan=(0.3, -0.3))
    run(buf, K["hisaab"] + 2, ["A4", "B4", "C#5", "E5", "F#5", "A5"], 0.08, 0.2)
    run(buf, C["feature"] + 14, ["A4", "C#5", "E5", "A5", "E5", "C#5", "E5", "A5"], 0.11, 0.2)
    run(buf, C["phone"], ["A5", "E5", "C#5", "A4"], 0.05, 0.2, pan=(0.4, -0.4))
    run(buf, C["end"] + 2, ["A4", "E5", "A5"], 0.07, 0.26)
    return buf


def bells():
    buf = np.zeros((N, 2), np.float32)
    hits = [
        (0, 110.0, 0.6, 0.0), (K["najar"], 233.08, 0.6, 0.1), (TITLE, 220.0, 0.9, 0.0), (TITLE, 440.0, 0.3, 0.2),
        (K["shraap"], 233.08, 0.5, 0.0), (C["kailash"] + 2, 440.0, 0.35, -0.2), (K["gajanan"], 220.0, 0.9, 0.0), (K["gajanan"], 440.0, 0.45, 0.2),
        (K["gajanan"], 880.0, 0.3, -0.2), (C["court"], 220.0, 0.5, 0.0), (K["lohe"], 116.54, 0.6, 0.0), (K["saadhe"], 110.0, 0.7, 0.0),
        (K["lauta"] + 10, 220.0, 0.7, 0.0), (K["hisaab"], 220.0, 0.85, 0.0), (K["hisaab"], 110.0, 0.45, 0.0), (C["phone"], 880.0, 0.32, 0.3),
        (C["end"] + 2, 880.0, 0.4, 0.2), (C["end"] + 2, 440.0, 0.4, -0.2),
    ]
    for i, (f_, hz, g, p) in enumerate(hits):
        add(buf, bell(hz, 7.0 if hz <= 240 else 5.0, 40 + i), sec(f_), p, g)
    return buf


def drums():
    buf = np.zeros((N, 2), np.float32)
    # the fiery hook: a pakhawaj pattern from frame 2, accelerating density to the crack
    loop(buf, sec(2), sec(K["najar"] - 2), 104, ["D", 0, "T", "T", "D", 0, "T", 0], 0.35, 0.55, 300)
    loop(buf, sec(K["najar"]), sec(CRACK - 2), 112, ["D", "T", "T", "D", "T", "T", "D", "T"], 0.5, 0.75, 330)
    add(buf, dha(390), sec(CRACK), 0.0, 1.0)
    add(buf, dha(391), sec(TITLE), 0.0, 0.6)
    add(buf, dha(392), sec(K["shraap"]), 0.0, 0.5)
    loop(buf, sec(C["side"] + 4), sec(C["hush"] - 1), 96, ["D", 0, "T", 0, "D", "T", "T", 0], 0.22, 0.5, 340)
    add(buf, dha(393), sec(C["hush"]), 0.0, 0.8)
    add(buf, dha(394), sec(K["gajanan"]), 0.0, 0.7)
    loop(buf, sec(C["court"] + 4), sec(K["aakhiri"] - 2), 100, ["D", 0, "T", 0, "D", 0, "T", "T"], 0.25, 0.32, 360)
    add(buf, dha(395), sec(K["lohe"]), 0.0, 0.7)
    add(buf, dha(396), sec(K["saadhe"]), 0.0, 0.9)
    add(buf, dha(397), sec(K["kalankW"] + 4), 0.0, 0.7)
    add(buf, dha(398), sec(K["chhin"] + 6), 0.0, 0.8)
    add(buf, dha(399), sec(K["lauta"] + 12), 0.0, 0.6)
    add(buf, dha(400), sec(K["hisaab"]), 0.0, 0.7)
    loop(buf, sec(C["feature"] + 12), sec(C["end"]), 104, ["D", 0, "T", "T", 0, "T", "D", "T"], 0.18, 0.3, 460)
    add(buf, dha(499), sec(C["end"]), 0.0, 0.5)
    return buf


def sfx():
    buf = np.zeros((N, 2), np.float32)

    def ending_at(y, f_, pan, g):
        add(buf, y, sec(f_) - len(y) / SR, pan, g)

    # the fire under the whole hook, swelling to the crack
    fr = fire(sec(CRACK) + 0.3, 7)
    fr *= np.clip(0.55 + 0.45 * np.arange(len(fr)) / len(fr), 0, 1).astype(np.float32)
    add(buf, fr, 0.0, 0.0, 0.55)
    add(buf, boom(8, f0=42, dur=2.2, bright=0.6), 0.0, 0.0, 0.7)  # frame 0 impact
    ending_at(reverse_swell(0.8, 9, ("A3", "D#4", "A4")), K["najar"], 0.0, 0.45)  # the eyes opening
    add(buf, boom(10, f0=46, dur=1.4, bright=0.4), sec(K["najar"]), 0.0, 0.5)
    ending_at(hiss(1.0, 11), CRACK, 0.0, 0.4)  # the glance coming at the lens
    add(buf, crack(12), sec(CRACK), 0.0, 0.75)
    add(buf, boom(13, f0=34, dur=3.2, bright=0.6), sec(CRACK), 0.0, 0.95)
    cuts = ["hookB", "hookC", "curse", "lotus", "lower", "kailash", "parvati", "side", "eye", "vishnu", "reveal", "court", "iron", "shaniSpeak",
            "sadeSati", "kalank", "crown", "arrive", "restore", "ask", "vikramSpeak", "danda", "hisaab", "feature", "phone", "end"]
    for i, name in enumerate(cuts):
        add(buf, whoosh(0.3, 20 + i, lo=500, hi=7000), sec(C[name]) - 0.18, 0.45 if i % 2 else -0.45, 0.4)
    for i, name in enumerate(["curse", "court", "sadeSati", "feature", "end"]):
        add(buf, boom(60 + i, f0=58, dur=0.7, bright=0.5), sec(C[name]), 0.0, 0.42)
    add(buf, shimmer(1.2, 70, ("A5", "E6")), sec(TITLE), 0.0, 0.2)
    add(buf, hiss(0.9, 71), sec(K["shraap"]), 0.0, 0.22)  # the curse ring
    ending_at(hiss(0.8, 72), K["anisht"] + 6, 0.2, 0.25)  # the glance on the lotus
    ending_at(reverse_swell(0.9, 73, ("Bb3", "D#4", "Bb4")), K["pal"], 0.0, 0.45)  # the side glance gathering
    ending_at(hiss(0.8, 74), C["hush"], 0.0, 0.3)
    add(buf, boom(75, f0=36, dur=3.0, bright=0.4), sec(C["hush"]), 0.0, 0.8)
    add(buf, white_hush(2.4, 76), sec(C["hush"] + 1), 0.0, 0.16)
    add(buf, shimmer(1.6, 77, ("A5", "C#6", "E6")), sec(K["sir"] + 6), 0.0, 0.14)  # the light rising to Goloka
    add(buf, whoosh(1.2, 78, lo=200, hi=3000), sec(C["vishnu"]), 0.0, 0.45)  # Garuda's wings
    ending_at(reverse_swell(1.0, 79), K["gajanan"], 0.0, 0.55)
    add(buf, boom(80, f0=50, bright=0.4), sec(K["gajanan"]), 0.0, 0.6)
    add(buf, sparkle(1.4, 81, n_pings=14), sec(K["gajanan"] + 2), 0.0, 0.26)
    for i in range(9):
        add(buf, tick(90 + i), sec(C["court"] + 6 + i * 3), -0.5 + i / 8, 0.18)  # the nine seats landing
    add(buf, boom(100, f0=40, dur=1.6, bright=0.3), sec(K["lohe"]), 0.0, 0.55)
    ending_at(reverse_swell(0.7, 101, ("A2", "D#3", "A3")), C["shaniSpeak"] + 2, 0.0, 0.3)
    add(buf, boom(102, f0=34, dur=2.6, bright=0.4), sec(K["saadhe"]), 0.0, 0.8)
    add(buf, whoosh(1.4, 103, lo=150, hi=1500), sec(C["sadeSati"] + 4), 0.0, 0.3)  # Saturn sweeping past
    add(buf, crack(104), sec(K["kalankW"] + 4), 0.2, 0.4)
    add(buf, crack(105), sec(K["chhin"] + 6), -0.1, 0.55)  # the crown cracking
    add(buf, boom(106, f0=48, dur=1.2, bright=0.5), sec(K["chhin"] + 6), 0.0, 0.5)
    add(buf, whoosh(0.9, 107, lo=300, hi=4000), sec(C["arrive"] + 4), 0.4, 0.3)  # the crow's wings
    ending_at(reverse_swell(0.9, 108), K["lauta"] + 12, 0.0, 0.5)
    add(buf, sparkle(1.2, 109, n_pings=12), sec(K["lauta"] + 12), 0.0, 0.24)
    add(buf, boom(110, f0=44, dur=2.4, bright=0.35), sec(K["hisaab"]), 0.0, 0.55)
    for i, fr_ in enumerate([C["feature"] + 14, C["feature"] + 30, C["feature"] + 46]):
        add(buf, tick(120 + i), sec(fr_), -0.2 + 0.2 * i, 0.32)
    add(buf, sparkle(0.6, 125, n_pings=10, lo=3000, hi=7000), sec(C["feature"] + 46), 0.0, 0.24)
    for i, fr_ in enumerate([C["curse"] + 10, K["parvatiW"], K["vishnuW"] + 2, K["gajanan"] + 4, K["vikram"] + 2, C["phone"] + 8]):
        add(buf, tick(130 + i), sec(fr_), -0.4, 0.2)  # name cards and the app panel
    return buf


def pulse():
    """The series' driving layer (low string spiccato on a 100 bpm 16th grid + frame drum + pakhawaj eighths, under
    ~1 kHz). Here it runs at FULL drive from frame 0 for the fiery open, and its strength follows the story."""
    buf = np.zeros((N, 2), np.float32)
    six = 60 / 100 / 4
    pts = [(0, 0.85), (C["hookB"], 0.9), (CRACK - 1, 1.0), (CRACK + 2, 0.0), (C["curse"] - 2, 0.0), (C["curse"], 0.6), (C["lower"], 0.45),
           (C["kailash"], 0.15), (C["side"], 0.45), (C["eye"], 0.8), (C["hush"] - 1, 0.95), (C["hush"], 0.0), (C["vishnu"] + 10, 0.0),
           (C["reveal"], 0.5), (K["gajanan"], 0.9), (C["court"], 0.55), (K["aakhiri"], 0.7), (C["shaniSpeak"], 0.35), (C["sadeSati"], 0.75),
           (C["crown"], 0.9), (C["arrive"], 0.2), (C["restore"], 0.5), (C["ask"], 0.0), (C["danda"], 0.0), (K["hisaab"], 0.9),
           (C["feature"], 0.6), (C["end"], 0.35), (TOTAL, 0.2)]
    fx_, vx = zip(*pts)
    inten = lambda t: float(np.interp(t * FPS, fx_, vx))  # noqa: E731
    harm = [(0, ("A1", "Bb1")), (C["curse"], ("A1", "D#2")), (C["kailash"], ("A1", "E2")), (C["side"], ("A1", "Bb1")), (C["vishnu"], ("A1", "E2")),
            (K["aakhiri"], ("A1", "D#2")), (C["sadeSati"], ("A1", "Bb1")), (C["restore"], ("A1", "E2"))]
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
