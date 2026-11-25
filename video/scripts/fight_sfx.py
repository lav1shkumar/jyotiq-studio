"""Synthesize the fight-hook SFX bed (no samples, so no licensing).

Pure Python (no numpy on this Mac). Writes public/jyotiq/hook/fight-sfx.wav,
48 kHz stereo 16-bit, 3.6 s, timed to src/Jyotiq/fight/cast.ts:
  f0      soft thump (the cut-in)
  f2-20   tension riser + mid drone
  f20-22  suck-out (silence) before the shove
  f22     HIT 1: whoosh into a boom + body + crack
  f24-86  scuffle bed: rumble, random body thumps, cloth swishes
  f47     HIT 2
  f86-90  silence
  f90/96/102  "dhum" x3 (TV-drama zoom), last one with a cymbal wash
Hits carry 150-300 Hz body + a noise crack so they still read on phone
speakers, which cannot reproduce the sub boom.

Run from the video/ folder:  python3 scripts/fight_sfx.py
"""

import array
import math
import os
import random
import wave

SR = 48000
FPS = 30
DUR = 108 / FPS
N = int(DUR * SR)
rng = random.Random(7)

dry = [0.0] * N  # mono dry bus
send = [0.0] * N  # reverb send


def fr(f):
    return int(f / FPS * SR)


def lp_coef(hz):
    return 1.0 - math.exp(-2.0 * math.pi * hz / SR)


def add_boom(at, f0, f1, tau_f, tau_a, amp, rev=0.35):
    """Pitch-dropping sine (kick / dhum)."""
    start = fr(at)
    ph = 0.0
    for i in range(int(SR * tau_a * 6)):
        n = start + i
        if n >= N:
            break
        t = i / SR
        hz = f1 + (f0 - f1) * math.exp(-t / tau_f)
        ph += 2 * math.pi * hz / SR
        env = math.exp(-t / tau_a) * min(1.0, t / 0.002)
        s = amp * env * (math.sin(ph) + 0.25 * math.sin(2 * ph))
        dry[n] += s
        send[n] += s * rev


def add_noise(at, dur, amp, lo_hz, hi_hz, tau=None, attack=0.002, rev=0.2, shape=None):
    """Band-limited noise burst: low-pass at hi_hz minus low-pass at lo_hz."""
    start = fr(at)
    a_hi = lp_coef(hi_hz)
    a_lo = lp_coef(lo_hz) if lo_hz > 0 else 0.0
    y_hi = y_lo = 0.0
    total = int(SR * dur)
    for i in range(total):
        n = start + i
        if n >= N:
            break
        t = i / SR
        x = rng.uniform(-1, 1)
        y_hi += a_hi * (x - y_hi)
        y_lo += a_lo * (x - y_lo)
        band = y_hi - y_lo if lo_hz > 0 else y_hi
        if shape is not None:
            env = shape(t / dur)
        else:
            env = math.exp(-t / tau) if tau else 1.0
        env *= min(1.0, t / attack) if attack > 0 else 1.0
        s = amp * env * band
        dry[n] += s
        send[n] += s * rev


def add_hit(at, k, rev=0.35):
    add_boom(at, 150, 46, 0.05, 0.42, 0.9 * k, rev)  # sub
    add_boom(at, 300, 120, 0.03, 0.11, 0.55 * k, rev)  # body (phone-audible)
    add_noise(at, 0.08, 1.6 * k, 0, 3500, tau=0.018, rev=rev)  # crack


# f0: soft thump so frame 0 is not silent
add_boom(0, 120, 60, 0.04, 0.18, 0.45)
add_noise(0, 0.05, 0.6, 0, 2500, tau=0.012)

# f2-20: riser (noise brightening + swelling) and a mid drone, hard stop at f20
r0, r1 = fr(2), fr(20)
y = 0.0
for n in range(r0, r1):
    u = (n - r0) / (r1 - r0)
    a = lp_coef(400 * (5000 / 400) ** u)
    y += a * (rng.uniform(-1, 1) - y)
    fade = min(1.0, (r1 - n) / (0.004 * SR))
    s = 0.55 * u * u * y * fade
    t = n / SR
    drone = 0.07 * (math.sin(2 * math.pi * 110 * t) + 0.6 * math.sin(2 * math.pi * 165 * t))
    drone *= min(1.0, t / 0.08) * (0.8 + 0.2 * math.sin(2 * math.pi * 6 * t)) * fade
    dry[n] += s + drone

# whoosh into the shove, then HIT 1
add_noise(19.6, 0.1, 1.2, 600, 4000, shape=lambda u: math.sin(math.pi * u) ** 2, attack=0, rev=0.1)
add_hit(22, 1.0)

# scuffle bed f24-86: rumble + random thumps + cloth swishes
b0, b1 = fr(24), fr(86)
y = 0.0
a = lp_coef(160)
for n in range(b0, b1):
    y += a * (rng.uniform(-1, 1) - y)
    edge = min(1.0, (n - b0) / (0.05 * SR), (b1 - n) / (0.05 * SR))
    dry[n] += 0.9 * y * edge
t = 24.5
while t < 84:
    add_noise(t, 0.12, rng.uniform(0.9, 1.6), 0, 520, tau=0.045, rev=0.12)
    if rng.random() < 0.55:
        add_noise(t + rng.uniform(0.3, 1.2), 0.09, rng.uniform(0.25, 0.4), 900, 3200, shape=lambda u: math.sin(math.pi * u), attack=0, rev=0.05)
    t += rng.uniform(2.6, 5.5)
add_hit(47, 0.62)

# f90 / 96 / 102: dhum dhum DHUM
for at, k in ((90, 0.72), (96, 0.84), (102, 1.0)):
    add_boom(at, 125, 52, 0.06, 0.55, 0.85 * k, 0.6)
    add_boom(at, 260, 130, 0.04, 0.16, 0.6 * k, 0.6)
    add_noise(at, 0.08, 1.3 * k, 0, 3000, tau=0.02, rev=0.5)
add_noise(102, 1.2, 0.5, 4500, 14000, tau=0.5, attack=0.004, rev=0.4)


def reverb(x, offset):
    """Schroeder: 4 damped combs in parallel, 2 allpasses in series."""
    combs = [1557, 1617, 1491, 1422]
    out = [0.0] * N
    for d in combs:
        d = int((d + offset) * SR / 44100)
        buf = [0.0] * d
        idx = 0
        damp = 0.0
        for n in range(N):
            yv = buf[idx]
            damp = yv * 0.6 + damp * 0.4
            buf[idx] = x[n] + damp * 0.8
            idx = (idx + 1) % d
            out[n] += yv * 0.25
    for d in (225, 556):
        d = int((d + offset) * SR / 44100)
        buf = [0.0] * d
        idx = 0
        for n in range(N):
            bv = buf[idx]
            yv = -out[n] + bv
            buf[idx] = out[n] + bv * 0.5
            idx = (idx + 1) % d
            out[n] = yv
    return out


wl = reverb(send, 0)
wr = reverb(send, 23)

left = [math.tanh(1.0 * (dry[n] + 0.5 * wl[n])) for n in range(N)]
right = [math.tanh(1.0 * (dry[n] + 0.5 * wr[n])) for n in range(N)]
peak = max(max(abs(v) for v in left), max(abs(v) for v in right))
g = 0.89 / peak * 0.78  # peak -1 dBFS, then trimmed to ~-13 LUFS so it sits under a Reel mix

pcm = array.array("h")
for n in range(N):
    pcm.append(int(max(-1.0, min(1.0, left[n] * g)) * 32767))
    pcm.append(int(max(-1.0, min(1.0, right[n] * g)) * 32767))

out = os.path.join("public", "jyotiq", "hook", "fight-sfx.wav")
os.makedirs(os.path.dirname(out), exist_ok=True)
with wave.open(out, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(f"wrote {out}: {N / SR:.2f}s, peak gain {g:.3f}")
