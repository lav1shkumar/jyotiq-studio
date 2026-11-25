"""Sound effects for the Jyotiq katha Reel ("The war that never happened").

No song and no background music by design: only synthesized effects, timed
from the cue sheet in src/Jyotiq/katha/reelTimeline.ts (CUES, reel frames).
Writes public/jyotiq/katha/sfx.wav, 48 kHz stereo 16-bit, full Reel length,
normalised to about -17 LUFS with peaks under -1 dBTP.

Run from the video/ folder:  python3 scripts/katha_audio.py
"""

import array
import json
import math
import os
import random
import re
import subprocess
import wave

SR = 48000
FPS = 30
OUT = os.path.join("public", "jyotiq", "katha")

src = open(os.path.join("src", "Jyotiq", "katha", "reelTimeline.ts")).read()
CUES = json.loads(re.search(r"export const CUES = (\{.*?\});\s*// CUES-JSON-END", src, re.S).group(1))
TOTAL = int(re.search(r"cta: \[\d+, (\d+)\]", src).group(1))
N = int(TOTAL / FPS * SR)
rng = random.Random(7)


def fr(f):
    return int(round(f / FPS * SR))


def zeros(n):
    return array.array("d", bytes(8 * n))


def lp(hz):
    return 1.0 - math.exp(-2.0 * math.pi * hz / SR)


class Bus:
    """Mono dry bus + reverb send."""

    def __init__(self, n):
        self.n = n
        self.dry = zeros(n)
        self.send = zeros(n)

    def put(self, n, s, rev):
        if 0 <= n < self.n:
            self.dry[n] += s
            self.send[n] += s * rev

    def boom(self, at, f0, f1, tau_f, tau_a, amp, rev=0.35):
        start, ph = fr(at), 0.0
        for i in range(int(SR * tau_a * 6)):
            t = i / SR
            ph += 2 * math.pi * (f1 + (f0 - f1) * math.exp(-t / tau_f)) / SR
            env = math.exp(-t / tau_a) * min(1.0, t / 0.002)
            self.put(start + i, amp * env * (math.sin(ph) + 0.25 * math.sin(2 * ph)), rev)

    def noise(self, at, dur, amp, lo, hi, tau=None, attack=0.002, rev=0.2, shape=None, sweep=None, am=None):
        start = fr(at)
        y_hi = y_lo = 0.0
        total = int(SR * dur)
        for i in range(total):
            t = i / SR
            u = i / total
            h = hi if sweep is None else hi * sweep(u)
            l = lo if sweep is None else lo * sweep(u)
            x = rng.uniform(-1, 1)
            y_hi += lp(h) * (x - y_hi)
            y_lo += (lp(l) if l > 0 else 0.0) * (x - y_lo)
            band = y_hi - y_lo if l > 0 else y_hi
            env = shape(u) if shape else (math.exp(-t / tau) if tau else 1.0)
            env *= min(1.0, t / attack) if attack > 0 else 1.0
            if am:
                env *= am(t)
            self.put(start + i, amp * env * band, rev)

    def tone(self, at, hz, amp, tau, rev=0.4, attack=0.003):
        start = fr(at)
        for i in range(int(SR * tau * 6)):
            t = i / SR
            env = math.exp(-t / tau) * min(1.0, t / attack)
            self.put(start + i, amp * env * math.sin(2 * math.pi * hz * t), rev)

    # --- composite sounds -------------------------------------------------

    def dhum(self, at, k):
        self.boom(at, 125, 50, 0.06, 0.6, 0.9 * k, 0.6)
        self.boom(at, 260, 130, 0.04, 0.16, 0.55 * k, 0.6)
        self.noise(at, 0.08, 1.2 * k, 0, 3000, tau=0.02, rev=0.5)

    def sword(self, at, k):
        # "shing": bright inharmonic ring + a hissing scrape
        for hz, a, tau in ((3150, 0.16, 0.55), (4720, 0.11, 0.42), (6080, 0.07, 0.3), (2210, 0.08, 0.7)):
            self.tone(at + 0.03 * FPS, hz, a * k, tau, rev=0.45, attack=0.004)
        self.noise(at, 0.22, 0.5 * k, 3500, 12000, attack=0.01, rev=0.3,
                   shape=lambda u: (1 - u) ** 2, sweep=lambda u: 0.6 + 0.6 * u)

    def whoosh(self, at, k, dur=0.42):
        self.noise(at - 0.7 * dur * FPS, dur, 1.4 * k, 500, 2600, attack=0, rev=0.15,
                   shape=lambda u: math.sin(math.pi * u) ** 2, sweep=lambda u: 0.45 + 1.1 * u)

    def pop(self, at, k=1.0):
        start, ph = fr(at), 0.0
        for i in range(int(SR * 0.09)):
            t = i / SR
            ph += 2 * math.pi * (480 + 520 * min(1.0, t / 0.05)) / SR
            self.put(start + i, 0.3 * k * math.exp(-t / 0.03) * min(1.0, t / 0.002) * math.sin(ph), 0.25)
        self.noise(at, 0.02, 0.22 * k, 2000, 8000, tau=0.004, rev=0.05)

    def flap(self, at):
        for d in (0.0, 0.09):
            self.noise(at + d * FPS, 0.07, 0.7, 700, 4200, tau=0.02, rev=0.15)

    def rustle(self, a, b):
        dur = (b - a) / FPS
        crackle = [rng.random() for _ in range(int(dur * 90) + 2)]
        self.noise(a, dur, 0.55, 1800, 9000, attack=0.02, rev=0.2,
                   shape=lambda u: math.sin(math.pi * u) ** 0.6,
                   am=lambda t: 0.35 + 0.65 * crackle[int(t * 90)])

    def shimmer(self, at, k):
        for _ in range(14):
            self.tone(at + rng.uniform(0, 0.7) * FPS, rng.uniform(2200, 5200), 0.05 * k, rng.uniform(0.12, 0.3), rev=0.6)
        self.noise(at, 0.8, 0.12 * k, 6000, 12000, attack=0, rev=0.5, shape=lambda u: math.sin(math.pi * u))

    def bell(self, at, k):
        # temple bell: inharmonic partials with slow beating
        f0 = 523.0
        for r, a, tau in ((1.0, 0.22, 2.2), (2.0, 0.12, 1.6), (2.76, 0.1, 1.1), (3.9, 0.06, 0.7), (5.4, 0.04, 0.45)):
            self.tone(at, f0 * r, a * k, tau, rev=0.55, attack=0.002)
            self.tone(at, f0 * r * 1.004, a * 0.6 * k, tau, rev=0.55, attack=0.002)
        self.noise(at, 0.03, 0.5 * k, 2000, 9000, tau=0.006, rev=0.3)

    def step(self, at, k=1.0):
        self.boom(at, 140, 70, 0.02, 0.06, 0.45 * k, 0.1)
        self.noise(at, 0.05, 0.3 * k, 300, 2500, tau=0.012, rev=0.08)

    def cheer(self, a, b, k=1.0):
        dur = (b - a) / FPS
        bursts = [rng.uniform(0.5, 1.0) for _ in range(int(dur * 6) + 2)]
        self.noise(a, dur, 0.7 * k, 350, 2600, attack=0.25, rev=0.4,
                   shape=lambda u: min(1.0, u / 0.15) * (1 - max(0.0, (u - 0.6) / 0.4)) ** 1.5,
                   am=lambda t: 0.6 + 0.4 * bursts[int(t * 6)] * (0.5 + 0.5 * math.sin(2 * math.pi * 3.1 * t)))
        for j in range(10):
            t0 = a + rng.uniform(0.05, 0.6) * (b - a)
            self.tone(t0, rng.uniform(600, 1100), 0.025 * k, 0.35, rev=0.5, attack=0.05)

    def roll(self, a, b):
        dur = (b - a) / FPS
        self.noise(a, dur, 0.6, 400, 3000, attack=0.05, rev=0.25,
                   shape=lambda u: math.sin(math.pi * u) ** 0.8, sweep=lambda u: 0.6 + 0.9 * u,
                   am=lambda t: 0.75 + 0.25 * math.sin(2 * math.pi * 18 * t))
        self.boom(b - 2, 110, 60, 0.03, 0.18, 0.5, 0.3)

    def crickets(self, a, b):
        t = a / FPS + 0.2
        end = b / FPS
        while t < end:
            hz = rng.uniform(4300, 4900)
            for c in range(3):
                start = fr((t + c * 0.045) * FPS)
                for i in range(int(SR * 0.03)):
                    tt = i / SR
                    env = math.sin(math.pi * tt / 0.03) * (0.5 + 0.5 * math.sin(2 * math.pi * 320 * tt))
                    self.put(start + i, 0.028 * env * math.sin(2 * math.pi * hz * tt), 0.3)
            t += rng.uniform(0.45, 0.9)

    def ding(self, at, k=1.0):
        for hz, a, tau in ((1318.5, 0.3, 0.9), (1975.5, 0.15, 0.6), (2637.0, 0.1, 0.45), (3951.0, 0.05, 0.3)):
            self.tone(at, hz, a * k, tau, rev=0.5)

    def tap(self, at, k=1.0):
        self.noise(at, 0.03, 0.5 * k, 1500, 7000, tau=0.006, rev=0.05)
        self.boom(at, 190, 110, 0.01, 0.03, 0.2 * k, 0.05)


def reverb(x, offset):
    """Schroeder: 4 damped combs in parallel, 2 allpasses in series."""
    n_ = len(x)
    out = zeros(n_)
    for d in (1557, 1617, 1491, 1422):
        d = int((d + offset) * SR / 44100)
        buf = zeros(d)
        idx = 0
        damp = 0.0
        for n in range(n_):
            yv = buf[idx]
            damp = yv * 0.6 + damp * 0.4
            buf[idx] = x[n] + damp * 0.8
            idx = (idx + 1) % d
            out[n] += yv * 0.25
    for d in (225, 556):
        d = int((d + offset) * SR / 44100)
        buf = zeros(d)
        idx = 0
        for n in range(n_):
            bv = buf[idx]
            yv = -out[n] + bv
            buf[idx] = out[n] + bv * 0.5
            idx = (idx + 1) % d
            out[n] = yv
    return out


def write_wav(path, L, R):
    pcm = array.array("h")
    for n in range(len(L)):
        pcm.append(int(max(-1.0, min(1.0, L[n])) * 32767))
        pcm.append(int(max(-1.0, min(1.0, R[n])) * 32767))
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def loudness(path):
    env = dict(os.environ, PATH="/usr/local/bin:" + os.environ.get("PATH", ""))
    p = subprocess.run(["npx", "remotion", "ffmpeg", "-hide_banner", "-i", path, "-af", "loudnorm=print_format=json", "-f", "null", "-"],
                       capture_output=True, text=True, env=env)
    m = re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", p.stderr, re.S)
    j = json.loads(m.group(0))
    return float(j["input_i"]), float(j["input_tp"])


# ------------------------------------------------------------------------

bus = Bus(N)
for f, k in CUES["dhum"]:
    bus.dhum(f, k)
for f, k in CUES["sword"]:
    bus.sword(f, k)
for f, k in CUES["pop"]:
    bus.pop(f, k)
bus.flap(CUES["flip"])
for f, k in CUES["whoosh"]:
    bus.whoosh(f, k)
bus.rustle(*CUES["rustle"])
for f, k in CUES["shimmer"]:
    bus.shimmer(f, k)
for f, k in CUES["bell"]:
    bus.bell(f, k)
a, b, step = CUES["steps"]
for f in range(a, b + 1, step):
    bus.step(f, 0.8 + 0.2 * rng.random())
bus.cheer(*CUES["cheer"])
bus.roll(*CUES["roll"])
bus.crickets(*CUES["crickets"])
for f, k in CUES["ding"]:
    bus.ding(f, k)
a, b, n = CUES["taps"]
for i in range(n):
    bus.tap(a + (b - a) * i / max(1, n - 1), 0.7 + 0.3 * rng.random())
bus.pop(CUES["send"], 1.0)
bus.whoosh(CUES["send"] + 4, 0.35, dur=0.3)

wl, wr = reverb(bus.send, 0), reverb(bus.send, 23)
L = array.array("d", (math.tanh(bus.dry[n] + 0.5 * wl[n]) for n in range(N)))
R = array.array("d", (math.tanh(bus.dry[n] + 0.5 * wr[n]) for n in range(N)))

os.makedirs(OUT, exist_ok=True)
path = os.path.join(OUT, "sfx.wav")
tmp = os.path.join(OUT, "sfx-raw.wav")


def scaled(g):
    peak = max(max(abs(v) for v in L), max(abs(v) for v in R))
    g = min(g, 0.89 / peak)  # never above -1 dBFS sample peak
    return array.array("d", (v * g for v in L)), array.array("d", (v * g for v in R)), g


l1, r1, g1 = scaled(1e9)
write_wav(tmp, l1, r1)
lufs, tp = loudness(tmp)
target = -17.0
g2 = 10 ** ((target - lufs) / 20)
l2, r2, gf = scaled(g1 * g2)
write_wav(path, l2, r2)
os.remove(tmp)
lufs2, tp2 = loudness(path)
print(f"wrote {path}: {N / SR:.2f}s, {lufs2:.1f} LUFS, {tp2:.1f} dBTP (peak-normalised level was {lufs:.1f} LUFS)")
