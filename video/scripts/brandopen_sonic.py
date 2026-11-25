"""Jyotiq reel-opening sonic logo (5 s, original, synthesized; no samples, no credits).

Light motes gather (rising air shimmer + small pings in A major pentatonic) -> the flame ignites
(temple bell + tanpura Sa/Pa, Sa = A) -> a soft whoosh carries into the story.
Picture clock: 30 fps; ignite at frame 30 (1.00 s), bloom/swap at frame 80-92 (2.67-3.07 s).

Run: /opt/anaconda3/bin/python3 -I scripts/brandopen_sonic.py
"""
import os
import wave

import numpy as np

SR = 48000
DUR = 5.0
N = int(SR * DUR)
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "jyotiq", "brandopen", "sonic.wav")
rng = np.random.default_rng(7)
t = np.arange(N) / SR
L = np.zeros(N)
R = np.zeros(N)


def add(x, at, pan=0.0, g=1.0):
    i = int(at * SR)
    n = min(len(x), N - i)
    if n <= 0:
        return
    gl, gr = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    L[i:i + n] += x[:n] * g * gl * 1.414
    R[i:i + n] += x[:n] * g * gr * 1.414


def lowpass(x, fc):
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.zeros_like(x)
    acc = 0.0
    for i in range(len(x)):  # short buffers only
        acc = (1 - a) * x[i] + a * acc
        y[i] = acc
    return y


def fft_band(x, lo, hi):
    X = np.fft.rfft(x)
    fr = np.fft.rfftfreq(len(x), 1 / SR)
    X[(fr < lo) | (fr > hi)] = 0
    return np.fft.irfft(X, len(x))


# 1) air shimmer: rising, soft (0 -> 1.0 s), tails under the ignition
n = int(2.2 * SR)
tt = np.arange(n) / SR
env = np.clip(tt / 1.0, 0, 1) ** 2 * np.exp(-np.clip(tt - 1.0, 0, None) * 2.2)
sh = np.zeros(n)
for f0, a in [(880, 1.0), (1318.5, 0.7), (1760, 0.55), (2637, 0.35)]:
    for d in (-3, 3):
        sh += a * np.sin(2 * np.pi * f0 * (1 + d / 1200) * tt + rng.uniform(0, 6))
air = fft_band(rng.normal(size=n), 3000, 9000) * 0.6
add((sh * 0.035 + air * 0.05) * env, 0.0)

# 2) motes: tiny glassy pings while the light gathers (A major pentatonic, high)
penta = [1760, 1975.5, 2217.5, 2637, 2960, 3520]
for k in range(16):
    at = 0.08 + k * 0.058 + rng.uniform(-0.02, 0.02)
    f0 = penta[rng.integers(len(penta))]
    m = int(0.5 * SR)
    tm = np.arange(m) / SR
    ping = (np.sin(2 * np.pi * f0 * tm) + 0.3 * np.sin(2 * np.pi * f0 * 2.01 * tm)) * np.exp(-tm * 9) * np.clip(tm / 0.004, 0, 1)
    add(ping * (0.03 + 0.02 * k / 16), at, pan=rng.uniform(-0.7, 0.7))

# 3) ignition: temple bell on A4 + a soft low "whoomph" of the flame
m = int(4.0 * SR)
tb = np.arange(m) / SR
bell = np.zeros(m)
for ratio, amp, dec in [(0.5, 0.5, 0.9), (1.0, 1.0, 1.1), (1.19, 0.45, 1.6), (1.56, 0.35, 2.0), (2.0, 0.5, 1.8), (2.74, 0.25, 2.6), (3.0, 0.2, 3.0), (4.1, 0.12, 3.6)]:
    f0 = 440 * ratio
    bell += amp * np.sin(2 * np.pi * f0 * tb + rng.uniform(0, 6)) * np.exp(-tb * dec)
bell *= np.clip(tb / 0.002, 0, 1)
add(bell * 0.16, 1.0, pan=0.0)
whoomph = fft_band(rng.normal(size=int(0.6 * SR)), 60, 400)
tw = np.arange(len(whoomph)) / SR
add(whoomph * np.exp(-tw * 7) * np.clip(tw / 0.03, 0, 1) * 0.10, 0.98)

# 4) tanpura-like drone Sa (A2) and Pa (E3) from ignition, fading at the end
def drone(f0, dur, seed):
    r = np.random.default_rng(seed)
    n = int(dur * SR)
    td = np.arange(n) / SR
    x = np.zeros(n)
    for h in range(1, 14):
        x += (1 / h ** 1.1) * np.sin(2 * np.pi * f0 * h * (1 + r.uniform(-2, 2) / 1200) * td + r.uniform(0, 6)) * (1 + 0.25 * np.sin(2 * np.pi * (0.3 + 0.1 * h) * td))
    return x


dd = 4.0
ed = np.arange(int(dd * SR)) / SR
denv = np.clip(ed / 0.35, 0, 1) * np.clip((dd - ed) / 1.2, 0, 1)
add(drone(110, dd, 1) * denv * 0.022, 1.0, pan=-0.25)
add(drone(164.81, dd, 2) * denv * 0.014, 1.15, pan=0.25)

# 5) whoosh into the story (2.55 -> 3.1 s), then a light chime as the first shot lands
m = int(0.8 * SR)
tw = np.arange(m) / SR
wn = rng.normal(size=m)
sweep = np.zeros(m)
for j, (lo, hi) in enumerate([(300, 1200), (800, 3000), (1500, 6000), (2500, 9000)]):
    seg = fft_band(wn, lo, hi)
    w = np.exp(-((tw - (0.15 + 0.13 * j)) / 0.12) ** 2)
    sweep += seg * w
add(sweep * 0.06, 2.55, pan=0.0)
m = int(2.0 * SR)
tc = np.arange(m) / SR
chime = sum(a * np.sin(2 * np.pi * f0 * tc) * np.exp(-tc * d) for f0, a, d in [(1318.5, 1.0, 2.2), (2637, 0.4, 3.0), (3955, 0.15, 4.0)])
add(chime * np.clip(tc / 0.003, 0, 1) * 0.05, 3.07, pan=0.3)

# room: short convolution reverb
ir_n = int(1.8 * SR)
ti = np.arange(ir_n) / SR
irL = rng.normal(size=ir_n) * np.exp(-ti * 3.8)
irR = rng.normal(size=ir_n) * np.exp(-ti * 3.8)
irL[0] = irR[0] = 0
irL /= np.sqrt(np.sum(irL ** 2))
irR /= np.sqrt(np.sum(irR ** 2))


def conv(x, ir):
    sz = 1 << int(np.ceil(np.log2(len(x) + len(ir))))
    return np.fft.irfft(np.fft.rfft(x, sz) * np.fft.rfft(ir, sz), sz)[: len(x)]


wet = 0.35
Lo = L + wet * conv(L, irL)
Ro = R + wet * conv(R, irR)
# fade the tail so the 5 s file ends cleanly
fade = np.clip((DUR - t) / 0.4, 0, 1)
Lo *= fade
Ro *= fade
peak = max(np.abs(Lo).max(), np.abs(Ro).max())
g = 10 ** (-3 / 20) / peak
st = np.stack([Lo * g, Ro * g], axis=1)
pcm = (np.clip(st, -1, 1) * 32767).astype("<i2")
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with wave.open(OUT, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote", os.path.normpath(OUT))
