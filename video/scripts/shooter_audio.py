"""Build the Jyotiq "Shooter Gaadi" Reel soundtrack (pure Python stdlib).

Writes public/jyotiq/shooter/mix.wav, 48 kHz stereo 16-bit, 516 frames @ 30 fps (17.20 s):
  0.00-2.40 s  cold open: room tone + phone tap, app-open chime, diya shimmer,
               typing clicks and the "send" whoosh (no music yet)
  2.40 s       the song (public/jyotiq/shooter/song-clip.wav, the 14.72 s of real
               audio cut from Ayush's MP3) starts at 0 dB, untouched
  on top       a few low-level accents synced to the picture: whip-pan whoosh into
               Shani (f157), moustache "ting" (f206), whoosh into the kundli (f297),
               cash flutter (f358), final squad "ting" (f494)

The song is already mastered hot (0 dBFS peaks), so accents are kept quiet and the
sum is peak-limited back under -1 dBFS only where it would clip.

Run from the video/ folder:  python3 scripts/shooter_audio.py
"""

import array
import math
import os
import random
import wave

SR = 48000
FPS = 30
TOTAL_FRAMES = 516
SONG_AT = 72  # frames
N = int(TOTAL_FRAMES / FPS * SR)
OUT = os.path.join("public", "jyotiq", "shooter")
rng = random.Random(7)

L = array.array("d", [0.0]) * N
R = array.array("d", [0.0]) * N


def at(frame):
    return int(frame / FPS * SR)


def add(i0, samples, gain=1.0, pan=0.0):
    gl = gain * math.cos((pan + 1) * math.pi / 4)
    gr = gain * math.sin((pan + 1) * math.pi / 4)
    for k, v in enumerate(samples):
        i = i0 + k
        if 0 <= i < N:
            L[i] += v * gl
            R[i] += v * gr


def env(n, a=0.002, d=0.1):
    na = max(1, int(a * SR))
    for k in range(n):
        if k < na:
            yield k / na
        else:
            yield math.exp(-(k - na) / (d * SR))


def click(gain=0.3):
    n = int(0.025 * SR)
    out = []
    lp = 0.0
    for k, e in zip(range(n), env(n, 0.0005, 0.004)):
        x = rng.uniform(-1, 1)
        lp = lp + 0.5 * (x - lp)
        out.append((x - lp) * e)
    return [v * gain for v in out]


def tone(freqs, dur, d, gain, glide=1.0):
    n = int(dur * SR)
    out = []
    ph = [0.0] * len(freqs)
    for k, e in zip(range(n), env(n, 0.004, d)):
        t = k / n
        s = 0.0
        for j, f0 in enumerate(freqs):
            fr = f0 * (1 + (glide - 1) * t)
            ph[j] += 2 * math.pi * fr / SR
            s += math.sin(ph[j]) / len(freqs)
        out.append(s * e * gain)
    return out


def whoosh(dur, gain, up=True):
    n = int(dur * SR)
    out = []
    lp = 0.0
    for k in range(n):
        t = k / n
        shape = math.sin(math.pi * t) ** 2
        cut = 0.02 + 0.5 * (t if up else 1 - t)
        x = rng.uniform(-1, 1)
        lp = lp + cut * (x - lp)
        out.append(lp * shape * gain)
    return out


# --- cold open ---------------------------------------------------------
# room tone (very soft filtered noise) for the whole pre-roll, fading under the song
lp = 0.0
for i in range(at(SONG_AT) + at(6)):
    x = rng.uniform(-1, 1)
    lp = lp + 0.03 * (x - lp)
    fade = 1.0 if i < at(SONG_AT) else max(0.0, 1 - (i - at(SONG_AT)) / at(6))
    v = lp * 0.05 * fade
    L[i] += v
    R[i] += v * 0.9

add(at(19), click(0.55), pan=0.3)  # thumb taps the Jyotiq icon
add(at(21), tone([880, 1320], 0.28, 0.12, 0.16, glide=1.5), pan=0.2)  # app-open blip
add(at(31), tone([1046.5, 1318.5, 1568.0], 0.9, 0.35, 0.18), pan=0.0)  # diya shimmer on the splash
add(at(39), whoosh(0.18, 0.35, up=False))  # cut to the kid
k = 44
while k < 66:  # frantic typing
    add(at(k) + rng.randint(0, 600), click(0.18 + rng.random() * 0.12), pan=rng.uniform(-0.3, 0.3))
    k += rng.choice([1, 2, 2, 3])
add(at(65), whoosh(0.26, 0.5, up=True))  # send
add(at(70), tone([660, 990], 0.2, 0.07, 0.14, glide=1.8))

# --- song --------------------------------------------------------------
with wave.open(os.path.join(OUT, "song-clip.wav")) as w:
    assert w.getframerate() == SR and w.getnchannels() == 2 and w.getsampwidth() == 2
    raw = array.array("h", w.readframes(w.getnframes()))
i0 = at(SONG_AT)
for k in range(0, len(raw) // 2):
    i = i0 + k
    if i >= N:
        break
    L[i] += raw[2 * k] / 32768.0
    R[i] += raw[2 * k + 1] / 32768.0

# --- accents on top of the song (quiet) --------------------------------
add(at(155), whoosh(0.3, 0.32, up=True), pan=-0.4)  # whip-pan into Shani Lok
add(at(206), tone([2637, 3520], 0.5, 0.16, 0.10), pan=0.4)  # moustache ting
add(at(295), whoosh(0.25, 0.3, up=True), pan=0.4)  # into the kundli
for j in range(10):  # cash flutter for Guru
    add(at(360) + j * 1900 + rng.randint(0, 800), click(0.07), pan=rng.uniform(-0.8, 0.2))
add(at(494), tone([2093, 2637, 3136], 0.7, 0.25, 0.09))  # squad pose sparkle

# --- de-click the tail, peak-limit, write ------------------------------
tail = at(TOTAL_FRAMES) - int(0.03 * SR)
for i in range(max(0, tail), N):
    g = max(0.0, 1 - (i - tail) / (0.03 * SR))
    L[i] *= g
    R[i] *= g
CEIL = 10 ** (-1.0 / 20)
out = array.array("h", [0]) * (2 * N)
for i in range(N):
    m = max(abs(L[i]), abs(R[i]))
    g = CEIL / m if m > CEIL else 1.0
    out[2 * i] = int(max(-32767, min(32767, L[i] * g * 32767)))
    out[2 * i + 1] = int(max(-32767, min(32767, R[i] * g * 32767)))
with wave.open(os.path.join(OUT, "mix.wav"), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(out.tobytes())
print("wrote", os.path.join(OUT, "mix.wav"), f"{N / SR:.2f}s")
