"""Procedural sound effects for Kumara reel 1. numpy only: every sound is synthesised here, nothing licensed.

Writes audio/out/sfx.wav (48 kHz stereo, 24-bit, 69.0 s) and prints a level check against the voice.
Cue times follow the scene code (engine SEG/LS/LE), so the effects stay on their visual hits if a line moves.
Levels are peak dBFS per channel before the final mix; the voice sits at about -20 dB RMS at this stage.
"""
import math
import os
import wave

import numpy as np

import engine as E

SR = 48000
DUR = 69.0
OUT = os.path.join(E.P, "audio", "out")
rng = np.random.default_rng(7)
S = E.SEG


# ------------------------------------------------------------------ helpers
def tt(d):
    return np.arange(int(d * SR)) / SR


def norm(x):
    m = float(np.max(np.abs(x)))
    return x / m if m > 0 else x


def fft_filter(x, lo=None, hi=None):
    """Zero-phase band limit with gentle (2nd-order-like) skirts."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    m = np.ones_like(f)
    if hi:
        m /= np.sqrt(1 + (f / hi) ** 4)
    if lo:
        m /= np.sqrt(1 + (lo / np.maximum(f, 1e-3)) ** 4)
    return np.fft.irfft(X * m, len(x))


def band_sweep(x, fc_of, bw=0.8, n=1024, hop=256):
    """STFT filter: a log-frequency Gaussian band whose centre fc_of(seconds) moves over time."""
    win = np.hanning(n)
    pad = np.concatenate([np.zeros(n), x, np.zeros(n)])
    out, wsum = np.zeros(len(pad)), np.zeros(len(pad))
    f = np.maximum(np.fft.rfftfreq(n, 1 / SR), 1.0)
    for s in range(0, len(pad) - n + 1, hop):
        fc = fc_of((s + n / 2 - n) / SR)
        g = np.exp(-0.5 * (np.log2(f / fc) / bw) ** 2)
        out[s:s + n] += np.fft.irfft(np.fft.rfft(pad[s:s + n] * win) * g, n) * win
        wsum[s:s + n] += win ** 2
    return (out / np.maximum(wsum, 1e-6))[n:n + len(x)]


def sweep_phase(f):
    return 2 * np.pi * np.cumsum(f) / SR


# ------------------------------------------------------------------ sounds
def whoosh(d=0.45, f=(300, 2400, 700), up=0.55, bw=0.8):
    n = int(d * SR)

    def fc(sec):
        u = min(max(sec / d, 0.0), 1.0)
        return f[0] * (f[1] / f[0]) ** (u / up) if u < up else f[1] * (f[2] / f[1]) ** ((u - up) / (1 - up))
    y = band_sweep(rng.standard_normal(n), fc, bw)
    u = np.arange(n) / n
    env = np.where(u < up, (u / up) ** 2, ((1 - u) / (1 - up)) ** 1.6)
    return norm(y * env)


def thump(d=0.5, f0=120, f1=50, tau=0.13, harm=0.45, click=0.25):
    """Low hit with harmonics up to ~360 Hz so it still reads on phone speakers."""
    t = tt(d)
    ph = sweep_phase(f1 + (f0 - f1) * np.exp(-t / 0.05))
    y = (np.sin(ph) + harm * np.sin(2 * ph + 0.3) + 0.2 * np.sin(3 * ph + 0.7)) * np.exp(-t / tau)
    y *= np.minimum(1, t / 0.003)
    nz = fft_filter(rng.standard_normal(len(t)), hi=900) * np.exp(-t / 0.012) * click
    y = np.tanh(1.6 * (y + nz))
    return norm(y * np.minimum(1, (d - t) / 0.05))


def heartbeat_pair(strong=1.0):
    a = thump(0.32, 95, 48, 0.07, 0.6, 0.12)
    b = thump(0.32, 85, 46, 0.06, 0.6, 0.08) * 0.65
    y = np.zeros(int(0.6 * SR))
    y[:len(a)] += a
    k = int(0.22 * SR)
    y[k:k + len(b)] += b
    return y * strong


def chime(f0=523.25, d=1.8, tau=1.0, bright=1.0):
    """Soft mallet chime: bar modes 1 / 2.756 / 5.404, plus a fifth and an octave, slight detune for life."""
    t = tt(d)
    parts = [(1.0, 1.0, tau), (1.004, 0.4, tau), (2.756, 0.3 * bright, tau * 0.38),
             (5.404, 0.1 * bright, tau * 0.16), (1.5, 0.2, tau * 0.7), (2.0, 0.16, tau * 0.5)]
    y = sum(a * np.sin(2 * np.pi * f0 * r * t + i) * np.exp(-t / tc) for i, (r, a, tc) in enumerate(parts))
    y *= np.minimum(1, t / 0.004) * np.minimum(1, (d - t) / 0.25)
    return norm(y)


def pop(d=0.14, f0=380, f1=980, tau=0.045):
    t = tt(d)
    y = np.sin(sweep_phase(f0 + (f1 - f0) * (1 - np.exp(-t / 0.02)))) * np.exp(-t / tau)
    return norm(y * np.minimum(1, t / 0.002))


def ui_pop(d=0.3):
    """Button pop: a bright blip on a short low body."""
    t = tt(d)
    body = np.sin(sweep_phase(260 + 160 * np.exp(-t / 0.03))) * np.exp(-t / 0.06)
    blip = np.sin(sweep_phase(700 + 700 * (1 - np.exp(-t / 0.015)))) * np.exp(-t / 0.05) * 0.7
    return norm((body + blip) * np.minimum(1, t / 0.002))


def click(d=0.07, tone=2400):
    t = tt(d)
    nz = fft_filter(rng.standard_normal(len(t)), lo=1500) * np.exp(-t / 0.004)
    return norm(nz + 0.6 * np.sin(2 * np.pi * tone * t) * np.exp(-t / 0.012))


def ping(f0=1568, d=0.6, tau=0.16):
    t = tt(d)
    y = (np.sin(2 * np.pi * f0 * t) + 0.4 * np.sin(2 * np.pi * f0 * 2.01 * t)) * np.exp(-t / tau)
    return norm(y * np.minimum(1, t / 0.002) * np.minimum(1, (d - t) / 0.08))


def shimmer(d=1.0, n=12, lo=2600, hi=6200):
    t = tt(d)
    y = np.zeros(len(t))
    for i in range(n):
        t0 = i / n * d * 0.7 + rng.uniform(0, 0.05)
        k = t >= t0
        u = t[k] - t0
        y[k] += np.sin(2 * np.pi * rng.uniform(lo, hi) * u + rng.uniform(0, 6.28)) * np.exp(-u / 0.18) * (0.4 + 0.6 * i / n)
    swell = fft_filter(rng.standard_normal(len(t)), lo=4000, hi=9000) * np.sin(np.pi * np.clip(t / d, 0, 1)) ** 2 * 0.5
    return norm((y + swell) * np.minimum(1, (d - t) / 0.1))


def crack(d=0.45, n=14):
    """Brittle crackle that follows the crack line drawing down the frame."""
    t = tt(d)
    y = np.zeros(len(t))
    for t0 in np.sort(d * 0.8 * rng.uniform(0, 1, n) ** 1.6):
        k = (t >= t0) & (t < t0 + 0.02)
        y[k] += rng.standard_normal(int(k.sum())) * np.exp(-(t[k] - t0) / 0.003) * rng.uniform(0.3, 1)
    return norm(fft_filter(y, lo=900, hi=7000))


def beam(d=0.6):
    t = tt(d)
    ph = sweep_phase(160 + 420 * (t / d) ** 0.7)
    tone = (np.sin(ph) + 0.5 * np.sin(2 * ph) + 0.25 * np.sin(3 * ph)) * np.sin(np.pi * np.clip(t / d, 0, 1)) ** 1.2
    return norm(0.6 * tone + 0.6 * whoosh(d, (500, 3000, 1500), up=0.5))


def powerdown(d=1.2):
    """The eclipse: the sun's tone sinks and dims."""
    t = tt(d)
    ph = sweep_phase(90 + 230 * np.exp(-t / 0.35))
    tone = np.sin(ph) + 0.45 * np.sin(2 * ph) + 0.2 * np.sin(3 * ph)
    rum = fft_filter(rng.standard_normal(len(t)), hi=250) * 0.5
    env = np.minimum(1, t / 0.08) * np.exp(-t / 0.55) * np.minimum(1, (d - t) / 0.1)
    return norm((tone + rum) * env)


def swipe(d=0.3):
    """Marker stroke for the strike-through."""
    w = whoosh(d, (1400, 4200, 2600), up=0.3, bw=0.6)
    grain = 1 + 0.6 * fft_filter(rng.standard_normal(len(w)), hi=70) / 0.05
    return norm(w * np.clip(grain, 0.2, 2.0))


# ------------------------------------------------------------------ cue sheet: (start s, sound, peak dBFS, pan, pan_to, note)
def at_mid(mid, d):
    """Start time that puts a whoosh's peak (55% in) on the transition's fastest moment."""
    return mid - 0.55 * d


def cues():
    c = []
    for t0, dur, d, f, g, pan, note in (
            (4.90, 0.30, 0.45, (300, 2400, 700), -27, 0.0, "S01->S02 zoom"),
            (8.43, 0.50, 0.60, (200, 1500, 500), -28, 0.0, "S02->S03 iris"),
            (23.82, 0.20, 0.30, (400, 3000, 900), -29, 0.0, "S04->S05 punch-in"),
            (39.95, 0.35, 0.45, (250, 2000, 600), -27, 0.0, "S07->S08 push up"),
            (47.45, 0.30, 0.42, (300, 2600, 800), -27, 0.35, "S08->S09 push left"),
            (51.45, 0.30, 0.50, (180, 1300, 420), -27, 0.0, "S10a->S10b zoom"),
            (59.15, 0.45, 0.55, (220, 1800, 600), -28, 0.0, "S10c->S11 iris"),
            (62.70, 0.35, 0.45, (250, 2000, 600), -27, 0.0, "S11->S12 push up")):
        c.append((at_mid(t0 + dur / 2, d), whoosh(d, f), g, pan, -pan if pan else None, note))
    c.append((S("L05", 0) + 0.03, pop(), -29, 0.3, None, "फिर? '?'"))
    # heartbeat under the pearl, fading through Surya's look; it stops where "ये मेरा पुत्र नहीं" lands
    for k in range(26, 32):
        tb = k * 0.95 + 0.05
        if 24.55 <= tb <= 29.8:
            g = -28 if tb < 27.05 else -31 - 1.5 * (tb - 27.05)
            c.append((tb - 0.004, heartbeat_pair(), g, 0.0, None, "heartbeat"))
    c.append((S("L06", 1) - 0.03, chime(392.0, 2.0, 1.2, 0.8), -30, 0.0, None, "साँवले"))
    c.append((at_mid(S("L06", 3) + 0.2, 0.4), whoosh(0.4, (300, 1600, 500)), -36, -0.2, 0.2, "Surya turns away"))
    c.append((S("L06", 4) - 0.04, thump(), -24, 0.0, None, "ये मेरा पुत्र नहीं (slam)"))
    c.append((S("L06", 4) - 0.02, crack(), -34, 0.0, None, "crack line"))
    c.append((S("L07", 2) - 0.05, beam(), -33, 0.25, -0.05, "Shani's gaze beam"))
    c.append((S("L07", 4) - 0.05, powerdown(), -30, 0.0, None, "eclipse: तेज -> मंद"))
    c.append((S("L08", 4) - 0.05, thump(0.4, 110, 50, 0.08, 0.45, 0.15), -30, 0.0, None, "शत्रु tags"))
    c.append((S("L09", 0) + 0.6, pop(0.14, 420, 1050), -29, 0.3, None, "S09 '?' 1"))
    c.append((S("L09", 1) + 0.1, pop(0.16, 340, 900, 0.055), -28, 0.35, None, "S09 '?' 2"))
    c.append((50.70, thump(0.45, 130, 55, 0.11), -26, 0.0, None, "नहीं। flash"))
    c.append((50.66, whoosh(0.25, (2000, 6000, 3000), up=0.3), -38, 0.0, None, "flash air"))
    c.append((S("L10", 2) - 0.01, chime(330.0, 2.4, 1.6, 0.9), -28, 0.0, None, "कर्मफल दाता"))
    c.append((S("L10", 5) - 0.04, chime(440.0, 1.6, 0.9, 0.7), -32, 0.0, None, "कर्म देखता है"))
    c.append((S("L11", 0) + 1.10, swipe(), -33, -0.2, 0.2, "डरना struck"))
    c.append((S("L11", 1) - 0.04, chime(659.25, 1.6, 0.9, 1.0), -29, 0.0, None, "कर्म संभालना है!"))
    q0, q0e, q1 = S("L12", 0), S("L12", 0, True), S("L12", 1)
    c.append((q0 + 0.25, ping(1568, 0.5), -33, -0.35, None, "orb appears"))
    c.append((q0 + 0.95, whoosh(0.5, (600, 2600, 900), up=0.5), -33, -0.35, 0.35, "orb hops"))
    c.append((q0 + 1.55, pop(), -29, 0.35, None, "S12 '?'"))
    c.append((q0e + 0.02, whoosh(0.3, (900, 3500, 1800), up=0.6), -33, 0.3, 0.0, "orb into the app"))
    c.append((q0e + 0.26, ping(2093, 0.5, 0.12), -32, 0.0, None, "question lands"))
    c.append((q1 - 0.03, ui_pop(), -28, 0.0, None, "button pops"))
    c.append((q1 + 0.62, click(), -28, 0.15, None, "tap"))
    c.append((66.45, shimmer(1.0), -28, 0.0, None, "end card"))
    c.append((67.25, shimmer(0.5, 5, 3500, 7000), -35, 0.0, None, "button shine"))
    c.append((67.95, click(0.06, 2000), -33, 0.15, None, "ripple"))
    c.append((68.30, shimmer(0.5, 5, 3500, 7000), -35, 0.0, None, "button shine"))
    return sorted(c, key=lambda e: e[0])


# ------------------------------------------------------------------ wav io
def read_wav(path):
    with wave.open(path) as w:
        n, ch, sw = w.getnframes(), w.getnchannels(), w.getsampwidth()
        raw = w.readframes(n)
    if sw == 3:
        b = np.frombuffer(raw, np.uint8).reshape(-1, 3).astype(np.int32)
        v = b[:, 0] | (b[:, 1] << 8) | (b[:, 2] << 16)
        x = np.where(v >= 1 << 23, v - (1 << 24), v) / float(1 << 23)
    elif sw == 2:
        x = np.frombuffer(raw, "<i2") / 32768.0
    else:
        raise ValueError("unsupported sample width %d" % sw)
    return x.reshape(-1, ch).T


def write_wav24(path, x):
    v = np.clip(np.round(x.T.reshape(-1) * 8388607), -8388608, 8388607).astype("<i4")
    with wave.open(path, "wb") as w:
        w.setnchannels(x.shape[0])
        w.setsampwidth(3)
        w.setframerate(SR)
        w.writeframes(v.view(np.uint8).reshape(-1, 4)[:, :3].tobytes())


def win_rms(x, t, d=0.4):
    i0, i1 = max(0, int((t - d / 2) * SR)), int((t + d / 2) * SR)
    seg = x[i0:i1]
    return 20 * math.log10(max(float(np.sqrt(np.mean(seg ** 2))) if len(seg) else 0.0, 1e-9))


def main():
    n = int(DUR * SR)
    mix = np.zeros((2, n))
    table = []
    for t0, x, g, pan, pan_to, note in cues():
        i0 = int(round(t0 * SR))
        x = x[max(0, -i0):]
        i0 = max(0, i0)
        m = min(len(x), n - i0)
        if m <= 0:
            continue
        x = x[:m] * 10 ** (g / 20)
        pv = np.linspace(pan, pan_to, m) if pan_to is not None else np.full(m, pan)
        th = (pv + 1) * math.pi / 4                      # -1 left, 0 centre, +1 right, constant power
        mix[0, i0:i0 + m] += x * np.cos(th) * math.sqrt(2)
        mix[1, i0:i0 + m] += x * np.sin(th) * math.sqrt(2)
        table.append((t0, m / SR, g, note))
    os.makedirs(OUT, exist_ok=True)
    write_wav24(os.path.join(OUT, "sfx.wav"), mix)

    vo = read_wav(os.path.join(OUT, "vo_raw.wav"))[0]
    vo = np.pad(vo, (0, max(0, n - len(vo))))[:n]
    sm = mix.mean(axis=0)
    peak = 20 * math.log10(max(float(np.max(np.abs(mix))), 1e-9))
    st = [win_rms(sm, k * 0.1) for k in range(int(DUR * 10))]
    vwin = np.array([win_rms(vo, k * 0.1) for k in range(int(DUR * 10))])
    speech = float(np.median(vwin[vwin > -40]))
    print("SFX: %d cues, peak %.1f dBFS, loudest 400 ms RMS %.1f dBFS at %.1f s; voice speech RMS %.1f dB"
          % (len(table), peak, max(st), 0.1 * int(np.argmax(st)), speech))
    print("  time   dur  peak  sfxRMS voiceRMS margin  cue")
    worst = 99.0
    for t0, d, g, note in table:
        mid = t0 + min(d, 0.6) * 0.45
        s_r, v_r = win_rms(sm, mid), win_rms(vo, mid)
        margin = v_r - s_r if v_r > -40 else float("nan")
        if v_r > -40:
            worst = min(worst, margin)
        flag = "  <-- under 12 dB" if v_r > -40 and margin < 12 else ""
        print("%6.2f %5.2f %5.0f %7.1f %8.1f %6.1f  %s%s" % (t0, d, g, s_r, v_r, margin, note, flag))
    print("worst margin under the voice: %.1f dB" % worst)


if __name__ == "__main__":
    main()
