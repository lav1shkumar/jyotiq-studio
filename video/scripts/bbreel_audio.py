"""Build the Bigg Boss x Jyotiq Reel soundtrack (pure Python + Remotion's ffmpeg).

Writes, 48 kHz stereo 16-bit, 1099 frames @ 30 fps (36.63 s):
  public/jyotiq/bbreel/soundtrack.wav        hook = the REAL clip audio (+ dhum stinger)
  public/jyotiq/bbreel/soundtrack-synth.wav  hook = public/jyotiq/hook/fight-sfx.wav

Hook alignment: the clip's near-silent gap ends at 1.40 s, where the shouting
bursts. The hook's shove (HIT1) is at frame 22 (0.733 s), so the clip starts
0.667 s in (20 frames): its silence lands on the wind-up and the burst on the
shove. It is cut at the freeze (frame 88) for the "dhum dhum dhum".
Gain +9 dB: the clip is -23.5 LUFS with peaks already limited at -14.5 dBTP.

Music (public/audio.m4a) starts at frame 108. Brand-section SFX are
synthesized from the cue sheet in src/Jyotiq/bbreel/timeline.ts (CUES).

Run from the video/ folder:  python3 scripts/bbreel_audio.py
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
CLIP = "/Users/ayushrajput/.kiro/crew/uploads/59ff986c582442149b0d020f1a310142_export-1792228798831.mp4"
TMP = os.path.join(".analysis", "bbreel")
OUT = os.path.join("public", "jyotiq", "bbreel")

src = open(os.path.join("src", "Jyotiq", "bbreel", "timeline.ts")).read()
CUES = json.loads(re.search(r"export const CUES = (\{.*?\});\s*// CUES-JSON-END", src, re.S).group(1))
HOOK = int(re.search(r"export const HOOK = (\d+);", src).group(1))
TOTAL = HOOK + 991
N = int(TOTAL / FPS * SR)
rng = random.Random(11)


def fr(f):
    return int(round(f / FPS * SR))


def zeros(n):
    return array.array("d", bytes(8 * n))


def ffmpeg(*args):
    env = dict(os.environ, PATH="/usr/local/bin:" + os.environ.get("PATH", ""))
    subprocess.run(["npx", "remotion", "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *args], check=True, env=env)


def read_wav(path):
    w = wave.open(path)
    n, ch = w.getnframes(), w.getnchannels()
    a = array.array("h")
    a.frombytes(w.readframes(n))
    L = array.array("d", (a[i] / 32768.0 for i in range(0, len(a), ch)))
    R = array.array("d", (a[i + 1] / 32768.0 for i in range(0, len(a), ch))) if ch == 2 else L
    return L, R


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

    def noise(self, at, dur, amp, lo, hi, tau=None, attack=0.002, rev=0.2, shape=None, sweep=None):
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
            self.put(start + i, amp * env * band, rev)

    def tone(self, at, hz, amp, tau, rev=0.4, attack=0.003):
        start = fr(at)
        for i in range(int(SR * tau * 6)):
            t = i / SR
            env = math.exp(-t / tau) * min(1.0, t / attack)
            self.put(start + i, amp * env * math.sin(2 * math.pi * hz * t), rev)

    # --- composite sounds -------------------------------------------------

    def hit(self, at, k, rev=0.35):
        self.boom(at, 150, 46, 0.05, 0.42, 0.9 * k, rev)
        self.boom(at, 300, 120, 0.03, 0.11, 0.55 * k, rev)
        self.noise(at, 0.08, 1.6 * k, 0, 3500, tau=0.018, rev=rev)

    def whoosh(self, at, k, dur=0.42):
        # peaks ~70 % of the way in, so the swish lands on the cut
        self.noise(at - 0.7 * dur * FPS, dur, 1.5 * k, 500, 2600, attack=0, rev=0.15,
                   shape=lambda u: math.sin(math.pi * u) ** 2, sweep=lambda u: 0.45 + 1.1 * u)

    def tap(self, at, k=1.0):
        self.noise(at, 0.03, 0.55 * k, 1500, 7000, tau=0.006, rev=0.05)
        self.boom(at, 190, 110, 0.01, 0.03, 0.22 * k, 0.05)

    def pop(self, at, k=1.0):
        start, ph = fr(at), 0.0
        for i in range(int(SR * 0.09)):
            t = i / SR
            ph += 2 * math.pi * (520 + 520 * min(1.0, t / 0.05)) / SR
            self.put(start + i, 0.32 * k * math.exp(-t / 0.03) * min(1.0, t / 0.002) * math.sin(ph), 0.25)
        self.noise(at, 0.02, 0.25 * k, 2000, 8000, tau=0.004, rev=0.05)

    def ding(self, at):
        for hz, a, tau in ((1318.5, 0.32, 0.9), (1975.5, 0.16, 0.6), (2637.0, 0.11, 0.45), (3951.0, 0.05, 0.3)):
            self.tone(at, hz, a, tau, rev=0.5)

    def shimmer(self, at, k):
        for j in range(14):
            self.tone(at + rng.uniform(0, 0.7) * FPS, rng.uniform(2200, 5200), 0.05 * k, rng.uniform(0.12, 0.3), rev=0.6)
        self.noise(at, 0.8, 0.14 * k, 6000, 12000, attack=0, rev=0.5, shape=lambda u: math.sin(math.pi * u))

    def dhum(self, at, k):
        self.boom(at, 125, 52, 0.06, 0.55, 0.85 * k, 0.6)
        self.boom(at, 260, 130, 0.04, 0.16, 0.6 * k, 0.6)
        self.noise(at, 0.08, 1.3 * k, 0, 3000, tau=0.02, rev=0.5)


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


def render_bus(bus, gain):
    wl, wr = reverb(bus.send, 0), reverb(bus.send, 23)
    L = array.array("d", (math.tanh(bus.dry[n] + 0.5 * wl[n]) * gain for n in range(bus.n)))
    R = array.array("d", (math.tanh(bus.dry[n] + 0.5 * wr[n]) * gain for n in range(bus.n)))
    return L, R


# ------------------------------------------------------------------------
# 1. brand-section SFX from the cue sheet
# ------------------------------------------------------------------------
sfx = Bus(N)
for at, k in CUES["impact"]:
    sfx.hit(at, k)
    if k >= 0.99:  # the clash: extra crack + wash
        sfx.noise(at, 1.4, 0.55, 4500, 14000, tau=0.5, attack=0.004, rev=0.45)
for at, k in CUES["whoosh"]:
    sfx.whoosh(at, k)

# beam lock: detuned hum + crackle, rising
b0, b1 = fr(CUES["beam"][0]), fr(CUES["beam"][1])
y = 0.0
for n in range(b0, b1):
    t = (n - b0) / SR
    u = (n - b0) / (b1 - b0)
    env = min(1.0, t / 0.08) * min(1.0, (b1 - n) / (0.12 * SR))
    rise = 1.0 + 0.35 * u
    s = math.sin(2 * math.pi * 98 * rise * t) + 0.6 * math.sin(2 * math.pi * 147.5 * rise * t) + 0.35 * math.sin(2 * math.pi * 196.4 * rise * t + 2 * math.sin(2 * math.pi * 3 * t))
    s *= 0.8 + 0.2 * math.sin(2 * math.pi * 7 * t)
    y += lp(5000) * (rng.uniform(-1, 1) - y)
    crackle = y * (1.0 if rng.random() < 0.02 else 0.15)
    sfx.put(n, 0.13 * env * s + 0.5 * env * crackle, 0.3)

# absorb: reversed swell into the flame, then a shimmer
a0 = CUES["absorb"]
sfx.noise(a0 - 0.4 * FPS, 0.4, 1.0, 800, 6000, attack=0, rev=0.3, shape=lambda u: u ** 3)
for at, k in CUES["shimmer"]:
    sfx.shimmer(at, k)
for at in CUES["chips"]:
    sfx.pop(at)

# the ball: rumble while it rolls, a thump on each landing
r0, r1 = fr(CUES["roll"][0]), fr(CUES["roll"][1])
y = 0.0
for n in range(r0, r1):
    y += lp(140) * (rng.uniform(-1, 1) - y)
    edge = min(1.0, (n - r0) / (0.05 * SR), (r1 - n) / (0.03 * SR))
    sfx.put(n, 1.4 * y * edge * (0.75 + 0.25 * math.sin(2 * math.pi * 9 * (n - r0) / SR)), 0.1)
for at in CUES["bounce"]:
    sfx.boom(at, 110, 55, 0.03, 0.12, 0.42, 0.2)

for at in CUES["taps"]:
    sfx.tap(at)
k0, k1, nk = CUES["type"]
for i in range(nk):
    sfx.noise(k0 + i * (k1 - k0) / nk, 0.012, rng.uniform(0.12, 0.2), 2500, 8000, tau=0.003, rev=0.03)
sfx.ding(CUES["ding"])
bu = CUES["burst"]
sfx.whoosh(bu, 0.5)
for j in range(8):
    sfx.pop(bu + j * 1.2, 0.6 + 0.4 * rng.random())

S_L, S_R = render_bus(sfx, 0.62)

# dhum stinger for the original-audio hook (own short bus)
hook_n = fr(HOOK + 45)
dh = Bus(hook_n)
for at, k in zip(CUES["dhum"], (0.72, 0.84, 1.0)):
    dh.dhum(at, k)
dh.noise(CUES["dhum"][2], 1.2, 0.5, 4500, 14000, tau=0.5, attack=0.004, rev=0.4)
D_L, D_R = render_bus(dh, 0.74)

# ------------------------------------------------------------------------
# 2. sources
# ------------------------------------------------------------------------
os.makedirs(TMP, exist_ok=True)
os.makedirs(OUT, exist_ok=True)
clip_wav = os.path.join(TMP, "clip48.wav")
music_wav = os.path.join(TMP, "music48.wav")
if not os.path.exists(clip_wav):
    ffmpeg("-i", CLIP, "-vn", "-ac", "2", "-ar", str(SR), "-c:a", "pcm_s16le", clip_wav)
if not os.path.exists(music_wav):
    ffmpeg("-i", os.path.join("public", "audio.m4a"), "-ac", "2", "-ar", str(SR), "-c:a", "pcm_s16le", music_wav)
cl, cr = read_wav(clip_wav)
ml, mr = read_wav(music_wav)
fl, frt = read_wav(os.path.join("public", "jyotiq", "hook", "fight-sfx.wav"))

# music bed with a short dip under the two biggest hits
duck = [(fr(215), 0.25), (fr(527), 0.35)]


def music_gain(n):
    g = 1.0
    for c, d in duck:
        if c - 0.03 * SR < n < c + 0.5 * SR:
            u = (n - c) / (0.5 * SR)
            g -= d * (1 - abs(u)) if u > 0 else d
    return g


def mix(hook_original):
    L, R = zeros(N), zeros(N)
    s0 = fr(HOOK)
    for i in range(min(len(ml), N - s0)):
        g = music_gain(s0 + i)
        L[s0 + i] += ml[i] * g
        R[s0 + i] += mr[i] * g
    for n in range(N):
        L[n] += S_L[n]
        R[n] += S_R[n]
    if hook_original:
        off = fr(20)
        g = 10 ** (9 / 20)
        f0, f1 = fr(CUES["freeze"]), fr(CUES["freeze"] + 4)
        for n in range(min(len(cl) - off, f1)):
            e = min(1.0, n / 240)
            if n >= f0:
                e *= (f1 - n) / (f1 - f0)
            L[n] += cl[off + n] * g * e
            R[n] += cr[off + n] * g * e
        for n in range(hook_n):
            L[n] += D_L[n]
            R[n] += D_R[n]
    else:
        for n in range(min(len(fl), N)):
            L[n] += fl[n]
            R[n] += frt[n]
    # soft knee above 0.7, then peak at -1 dBFS
    knee = 0.7
    for buf in (L, R):
        for n in range(N):
            x = buf[n]
            a = abs(x)
            if a > knee:
                buf[n] = math.copysign(knee + (1 - knee) * math.tanh((a - knee) / (1 - knee)), x)
    peak = max(max(abs(v) for v in L), max(abs(v) for v in R))
    g = 0.891 / peak
    for buf in (L, R):
        for n in range(N):
            buf[n] *= g
    return L, R


for name, orig in (("soundtrack.wav", True), ("soundtrack-synth.wav", False)):
    L, R = mix(orig)
    path = os.path.join(OUT, name)
    write_wav(path, L, R)
    print(f"wrote {path}: {N / SR:.2f}s")
