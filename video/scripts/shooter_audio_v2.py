"""Build the Jyotiq "Shooter Gaadi" Reel v2 soundtrack (pure Python stdlib + ffmpeg for decoding).

Writes public/jyotiq/shooter/mix-v2.wav, 48 kHz stereo 16-bit, 803 frames @ 30 fps (26.77 s):
  0.00-4.90 s   re-paced cold open: room tone, thumb tap + app-open blip, splash shimmer,
                frantic typing, send whoosh, kundli-reading twinkles and a low hit when
                Shani + Mangal light up
  4.90 s        the extended song (song-full.wav, 18.38 s) starts on the furious smash-cut
  5.43 s        Ayush's crying meme: its two wails are cut to land on the two kicks of the
                crying beat (the pause between them removed), high-passed at 450 Hz so it
                does not muddy the 808s, the song ducked 3 dB underneath and the meme set
                2 LU under the ducked song (K-weighted, BS.1770)
  7.7-19.0 s    v1 accents, moved +75 frames with the picture
  19.3-23.3 s   new whooshes into the dance, the converge/pull-back and the phone reveal
  22.9-23.27 s  the song's last "aate" is low-passed and faded instead of stopping dead, and
                an echo of it (1-beat delay, filtered feedback) rings out under the lockup
  23.27 s       lockup: riser -> impact (sub + clap), diya chime on the symbol, CTA ticks
  23.47 s       brand VO slot: if public/jyotiq/shooter/vo/brand-vo.(wav|mp3) exists it is
                placed here and the echo tail ducks under it

Run from the video/ folder:  python3 scripts/shooter_audio_v2.py
"""

import array
import math
import os
import random
import subprocess
import wave

SR = 48000
FPS = 30
TOTAL_FRAMES = 803
SONG_AT = 147  # frames (v1: 72)
SHIFT = 75
CRY, CRY2 = 163, 176  # crying beat kicks (reel frames)
LOCK, VO_AT = 698, 704
N = int(TOTAL_FRAMES / FPS * SR)
OUT = os.path.join("public", "jyotiq", "shooter")
rng = random.Random(11)

L = array.array("d", [0.0]) * N
R = array.array("d", [0.0]) * N


def at(frame):
    return int(round(frame / FPS * SR))


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
        yield k / na if k < na else math.exp(-(k - na) / (d * SR))


def click(gain=0.3):
    n = int(0.025 * SR)
    out, lp = [], 0.0
    for k, e in zip(range(n), env(n, 0.0005, 0.004)):
        x = rng.uniform(-1, 1)
        lp = lp + 0.5 * (x - lp)
        out.append((x - lp) * e * gain)
    return out


def tone(freqs, dur, d, gain, glide=1.0, a=0.004):
    n = int(dur * SR)
    out, ph = [], [0.0] * len(freqs)
    for k, e in zip(range(n), env(n, a, d)):
        t = k / n
        s = 0.0
        for j, f0 in enumerate(freqs):
            ph[j] += 2 * math.pi * f0 * (1 + (glide - 1) * t) / SR
            s += math.sin(ph[j]) / len(freqs)
        out.append(s * e * gain)
    return out


def whoosh(dur, gain, up=True):
    n = int(dur * SR)
    out, lp = [], 0.0
    for k in range(n):
        t = k / n
        shape = math.sin(math.pi * t) ** 2
        cut = 0.02 + 0.5 * (t if up else 1 - t)
        lp = lp + cut * (rng.uniform(-1, 1) - lp)
        out.append(lp * shape * gain)
    return out


def riser(dur, gain):
    """Noise swell that ends abruptly (into a hit)."""
    n = int(dur * SR)
    out, lp = [], 0.0
    for k in range(n):
        t = k / n
        lp = lp + (0.03 + 0.55 * t * t) * (rng.uniform(-1, 1) - lp)
        out.append(lp * (t ** 2.2) * gain)
    return out


def boom(gain):
    n = int(0.9 * SR)
    out, ph = [], 0.0
    for k in range(n):
        t = k / SR
        f0 = 38 + 60 * math.exp(-t / 0.06)
        ph += 2 * math.pi * f0 / SR
        e = min(1.0, k / (0.002 * SR)) * math.exp(-t / 0.28)
        out.append(math.sin(ph) * e * gain)
    return out


def biquad_co(kind, f0, q=0.7071):
    w0 = 2 * math.pi * f0 / SR
    c, s = math.cos(w0), math.sin(w0)
    al = s / (2 * q)
    if kind == "lp":
        b = ((1 - c) / 2, 1 - c, (1 - c) / 2)
    else:
        b = ((1 + c) / 2, -(1 + c), (1 + c) / 2)
    a0 = 1 + al
    return (b[0] / a0, b[1] / a0, b[2] / a0, -2 * c / a0, (1 - al) / a0)


def biquad(x, co):
    b0, b1, b2, a1, a2 = co
    y, x1, x2, y1, y2 = [0.0] * len(x), 0.0, 0.0, 0.0, 0.0
    for i, v in enumerate(x):
        o = b0 * v + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2
        x2, x1, y2, y1 = x1, v, y1, o
        y[i] = o
    return y


# ITU-R BS.1770 K-weighting at 48 kHz (shelf + RLB high-pass)
K1 = (1.53512485958697, -2.69169618940638, 1.19839281085285, -1.69065929318241, 0.73248077421585)
K2 = (1.0, -2.0, 1.0, -1.99004745483398, 0.99007225036621)


def loudness(l, r):
    ms = 0.0
    for ch in (l, r):
        y = biquad(biquad(ch, K1), K2)
        ms += sum(v * v for v in y) / max(1, len(y))
    return -0.691 + 10 * math.log10(ms + 1e-12)


def read_wav(path):
    with wave.open(path) as w:
        assert w.getframerate() == SR and w.getsampwidth() == 2, path
        ch = w.getnchannels()
        raw = array.array("h", w.readframes(w.getnframes()))
    if ch == 1:
        l = [v / 32768.0 for v in raw]
        return l, list(l)
    return [raw[i] / 32768.0 for i in range(0, len(raw), 2)], [raw[i] / 32768.0 for i in range(1, len(raw), 2)]


# --- cold open (0-147) ----------------------------------------------------
lp = 0.0
for i in range(at(SONG_AT) + at(6)):  # room tone, fading under the song
    lp = lp + 0.03 * (rng.uniform(-1, 1) - lp)
    fade = 1.0 if i < at(SONG_AT) else max(0.0, 1 - (i - at(SONG_AT)) / at(6))
    L[i] += lp * 0.05 * fade
    R[i] += lp * 0.045 * fade
add(at(34), click(0.55), pan=0.3)  # thumb taps the Jyotiq icon
add(at(36), tone([880, 1320], 0.28, 0.12, 0.16, glide=1.5), pan=0.2)  # app-open blip
add(at(46), tone([1046.5, 1318.5, 1568.0], 1.1, 0.42, 0.18))  # diya shimmer on the splash
add(at(64), whoosh(0.2, 0.35, up=False))  # cut to the kid
k = 72
while k < 103:  # frantic typing
    add(at(k) + rng.randint(0, 600), click(0.17 + rng.random() * 0.12), pan=rng.uniform(-0.3, 0.3))
    k += rng.choice([1, 2, 2, 3])
add(at(103), whoosh(0.26, 0.5, up=True))  # send
add(at(108), tone([660, 990], 0.2, 0.07, 0.14, glide=1.8))
add(at(113), whoosh(0.18, 0.25, up=False), pan=-0.2)  # into the reading screen
for j, fr in enumerate([117, 121, 125, 129]):  # reading twinkles
    add(at(fr), tone([1567.98 * (1.12246 ** j)], 0.3, 0.12, 0.06), pan=-0.4 + 0.27 * j)
add(at(126), tone([73.4, 146.8], 0.9, 0.35, 0.28, a=0.01), pan=0.0)  # Shani + Mangal light up
add(at(126), tone([311.1, 466.2], 0.7, 0.3, 0.05), pan=0.1)

# --- the song ----------------------------------------------------------------
sl, sr_ = read_wav(os.path.join(OUT, "song-full.wav"))
ns = len(sl)
g = [0.89] * ns  # -1 dB so its own 0 dBFS peaks never hit the limiter
# duck 3 dB under the crying meme (40 ms ramps)
d0, d1 = at(CRY) - at(SONG_AT) - int(0.03 * SR), at(198) - at(SONG_AT) + int(0.05 * SR)
ramp_n = int(0.04 * SR)
DUCK = 10 ** (-3 / 20)
for i in range(max(0, d0 - ramp_n), min(ns, d1 + ramp_n)):
    if i < d0:
        w = (i - (d0 - ramp_n)) / ramp_n
    elif i > d1:
        w = 1 - (i - d1) / ramp_n
    else:
        w = 1.0
    g[i] *= 1 - (1 - DUCK) * max(0.0, min(1.0, w))
# ending: low-pass sweep + fade on the last "aate" instead of a dead stop
t_lp, t_fade = int(17.90 * SR), int(18.00 * SR)
yl = yr = 0.0
for i in range(t_lp, ns):
    u = (i - t_lp) / max(1, ns - t_lp)
    fc = 18000 * (900 / 18000) ** u
    a = 1 - math.exp(-2 * math.pi * fc / SR)
    yl += a * (sl[i] - yl)
    yr += a * (sr_[i] - yr)
    sl[i], sr_[i] = yl, yr
for i in range(t_fade, ns):
    u = (i - t_fade) / max(1, ns - t_fade)
    g[i] *= 0.25 + 0.75 * 0.5 * (1 + math.cos(math.pi * u))
tail = int(0.015 * SR)
for i in range(ns - tail, ns):
    g[i] *= (ns - i) / tail
i0 = at(SONG_AT)
for i in range(ns):
    j = i0 + i
    if j >= N:
        break
    L[j] += sl[i] * g[i]
    R[j] += sr_[i] * g[i]

# echo-out: the last "aate" (17.30-18.38 s) through a 1-beat feedback delay
D = int(0.585 * SR)
FB = 0.45
send_from = int(17.30 * SR)
el, er = [], []
for i in range(send_from, ns):
    u = (i - send_from) / (0.05 * SR)
    w = min(1.0, u) * 0.89
    el.append(sl[i] * w)
    er.append(sr_[i] * w)
total = len(el) + int(3.6 * SR)
bufl, bufr = [0.0] * D, [0.0] * D
lpl = lpr = hpl = hpr = 0.0
a_lp = 1 - math.exp(-2 * math.pi * 2800 / SR)
a_hp = 1 - math.exp(-2 * math.pi * 220 / SR)
echo_l, echo_r = [0.0] * total, [0.0] * total
for n in range(total):
    xl = el[n] if n < len(el) else 0.0
    xr = er[n] if n < len(er) else 0.0
    dl, dr = bufl[n % D], bufr[n % D]
    lpl += a_lp * (dl - lpl)
    lpr += a_lp * (dr - lpr)
    hpl += a_hp * (lpl - hpl)
    hpr += a_hp * (lpr - hpr)
    yl, yr = lpl - hpl, lpr - hpr
    echo_l[n], echo_r[n] = yl, yr
    # ping-pong a little: feed each side partly from the other
    bufl[n % D] = xl + FB * (0.8 * yl + 0.2 * yr)
    bufr[n % D] = xr + FB * (0.8 * yr + 0.2 * yl)
e0 = i0 + send_from
fade_out_from, fade_out_to = at(TOTAL_FRAMES) - int(1.3 * SR), at(TOTAL_FRAMES)

# --- brand VO (optional) -------------------------------------------------------
vo = None
for name in ("brand-vo.wav", "brand-vo.mp3", "brand-vo.m4a"):
    src = os.path.join(OUT, "vo", name)
    if os.path.exists(src):
        tmp = os.path.join(OUT, "vo", ".brand-vo-48k.wav")
        subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", src, "-ar", str(SR), "-ac", "2", "-c:a", "pcm_s16le", tmp], check=True)
        vo = read_wav(tmp)
        break
vo_from = at(VO_AT)
vo_to = vo_from + (len(vo[0]) if vo else 0)

ECHO_GAIN = 0.55
VO_DUCK = 10 ** (-9 / 20)
gate_from, gate_len = i0 + int(18.0 * SR), int(0.25 * SR)  # echoes take over as the dry song fades
for n in range(total):
    j = e0 + n
    if j >= N:
        break
    gg = ECHO_GAIN * max(0.0, min(1.0, (j - gate_from) / gate_len))
    if fade_out_from <= j:
        gg *= max(0.0, 1 - (j - fade_out_from) / (fade_out_to - fade_out_from))
    if vo and vo_from - int(0.08 * SR) <= j <= vo_to + int(0.25 * SR):
        gg *= VO_DUCK
    L[j] += echo_l[n] * gg
    R[j] += echo_r[n] * gg
if vo:
    for k2 in range(len(vo[0])):
        j = vo_from + k2
        if j >= N:
            break
        L[j] += vo[0][k2]
        R[j] += vo[1][k2]

# --- crying meme on the crying beat ----------------------------------------
ml, mr = read_wav(os.path.join(OUT, "sfx", "cry-meme.wav"))
hp = biquad_co("hp", 450)


def seg(a_s, b_s, fin=0.008, fout=0.03):
    a_i, b_i = int(a_s * SR), int(b_s * SR)
    l, r = ml[a_i:b_i], mr[a_i:b_i]
    n = len(l)
    for k3 in range(n):
        w = min(1.0, k3 / (fin * SR), (n - 1 - k3) / (fout * SR))
        l[k3] *= w
        r[k3] *= w
    return l, r


# wail onsets measured at 0.57 s and 1.80 s in Ayush's clip; each lands on its kick
w1 = seg(0.55, 1.00, fout=0.03)
w2 = seg(1.78, 2.50, fout=0.07)
cry_l = [0.0] * (at(198) - at(CRY) + int(0.1 * SR))
cry_r = list(cry_l)
for (sl2, sr2), start in ((w1, at(CRY) - int(0.02 * SR)), (w2, at(CRY2) - int(0.02 * SR))):
    off = start - (at(CRY) - int(0.02 * SR))
    for k3 in range(len(sl2)):
        if 0 <= off + k3 < len(cry_l):
            cry_l[off + k3] += sl2[k3]
            cry_r[off + k3] += sr2[k3]
cry_l = biquad(biquad(cry_l, hp), hp)
cry_r = biquad(biquad(cry_r, hp), hp)
c0 = at(CRY) - int(0.02 * SR)
win = (at(CRY), at(198))
song_lu = loudness(L[win[0]:win[1]], R[win[0]:win[1]])
cry_lu = loudness(cry_l[: win[1] - c0], cry_r[: win[1] - c0])
target = song_lu - 2.0
cry_gain = 10 ** ((target - cry_lu) / 20)
for k3 in range(len(cry_l)):
    j = c0 + k3
    if 0 <= j < N:
        L[j] += cry_l[k3] * cry_gain
        R[j] += cry_r[k3] * cry_gain * 0.96
print(f"crying beat: ducked song {song_lu:.1f} LUFS, meme raw {cry_lu:.1f} LUFS -> gain {20 * math.log10(cry_gain):+.1f} dB (meme at {target:.1f} LUFS)")

# --- accents (v1 picture accents moved +75 frames) -----------------------------
add(at(155 + SHIFT), whoosh(0.3, 0.32, up=True), pan=-0.4)  # whip-pan into Shani Lok
add(at(206 + SHIFT), tone([2637, 3520], 0.5, 0.16, 0.10), pan=0.4)  # moustache ting
add(at(295 + SHIFT), whoosh(0.25, 0.3, up=True), pan=0.4)  # into the kundli
for j in range(10):  # Guru's cash flutter
    add(at(360 + SHIFT) + j * 1900 + rng.randint(0, 800), click(0.07), pan=rng.uniform(-0.8, 0.2))
add(at(494 + SHIFT), tone([2093, 2637, 3136], 0.7, 0.25, 0.09))  # squad sparkle

# --- new ending ----------------------------------------------------------------
add(at(578), whoosh(0.16, 0.3, up=True), pan=-0.2)  # into the dance floor
add(at(582), tone([1568, 2093, 2637, 3136], 0.9, 0.3, 0.07))  # disco sparkle
add(at(631), whoosh(0.22, 0.32, up=True), pan=0.2)  # the swirl
add(at(637), whoosh(0.5, 0.36, up=False), pan=0.0)  # camera pulls back
add(at(651), tone([196, 294], 0.35, 0.12, 0.12, a=0.003))  # phone lands in frame
add(at(651), click(0.25), pan=0.1)

# --- lockup ----------------------------------------------------------------------
add(at(LOCK) - int(0.32 * SR), riser(0.32, 0.38))
add(at(LOCK), boom(0.62))
cl = []
lp = 0.0
for k3 in range(int(0.06 * SR)):  # clap
    lp = lp + 0.35 * (rng.uniform(-1, 1) - lp)
    cl.append((rng.uniform(-1, 1) - lp) * math.exp(-k3 / (0.012 * SR)))
add(at(LOCK), cl, gain=0.3)
add(at(LOCK) + int(0.01 * SR), tone([3520, 4186], 0.45, 0.1, 0.05), pan=0.3)  # shing
add(at(LOCK + 9), tone([1318.5, 1975.5], 0.9, 0.35, 0.09))  # diya chime on the symbol
add(at(LOCK + 6), whoosh(0.35, 0.16, up=False))  # shockwave
add(at(LOCK + 28), tone([2093], 0.3, 0.1, 0.05))  # CTA
add(at(LOCK + 34), click(0.12), pan=-0.3)  # badge
add(at(LOCK + 39), click(0.12), pan=0.3)  # badge

# --- de-click the very end, peak-limit, write -----------------------------------------
tl = at(TOTAL_FRAMES) - int(0.03 * SR)
for i in range(max(0, tl), N):
    w = max(0.0, 1 - (i - tl) / (0.03 * SR))
    L[i] *= w
    R[i] *= w
CEIL = 10 ** (-1.0 / 20)
out = array.array("h", [0]) * (2 * N)
limited = 0
for i in range(N):
    m = max(abs(L[i]), abs(R[i]))
    gg = CEIL / m if m > CEIL else 1.0
    if gg < 1.0:
        limited += 1
    out[2 * i] = int(max(-32767, min(32767, L[i] * gg * 32767)))
    out[2 * i + 1] = int(max(-32767, min(32767, R[i] * gg * 32767)))
with wave.open(os.path.join(OUT, "mix-v2.wav"), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(out.tobytes())
print("wrote", os.path.join(OUT, "mix-v2.wav"), f"{N / SR:.2f}s", f"limited samples: {limited}", "VO:", "yes" if vo else "slot empty")
