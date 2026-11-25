"""Per-line voice fingerprint: YIN pitch percentiles and spectral centroid on voiced frames.

Used to check that each Kumara's lines come from one consistent voice (audio.py's quick autocorrelation
pitch suggested L02 differs from Sanaka's other lines).
"""
import os
import subprocess

import numpy as np
from numpy.lib.stride_tricks import sliding_window_view

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(os.path.dirname(HERE), "audio", "src")
SR = 16000


def decode(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()


def yin(x, fmin=70, fmax=600, win=640, hop=160, thr=0.12, gate=1e-4):
    tmin, tmax = int(SR / fmax), int(SR / fmin)
    out = []
    for k in range(0, len(x) - win - tmax, hop):
        seg = x[k:k + win + tmax]
        if float((seg[:win] ** 2).mean()) < gate:
            continue
        m = sliding_window_view(seg, win)[:tmax]
        d = ((m[0][None, :] - m) ** 2).sum(1)
        c = np.ones_like(d)
        cs = np.cumsum(d[1:])
        c[1:] = d[1:] * np.arange(1, tmax) / np.maximum(cs, 1e-12)
        idx = np.nonzero(c[tmin:] < thr)[0]
        if not len(idx):
            continue
        t = tmin + idx[0]
        while t + 1 < tmax and c[t + 1] < c[t]:
            t += 1
        out.append(SR / t)
    return np.array(out)


def centroid(x, win=512, hop=256):
    frames = sliding_window_view(x, win)[::hop]
    e = (frames ** 2).mean(1)
    frames = frames[e > 1e-4] * np.hanning(win)
    mag = np.abs(np.fft.rfft(frames, axis=1))
    f = np.fft.rfftfreq(win, 1 / SR)
    return float(np.median((mag * f).sum(1) / np.maximum(mag.sum(1), 1e-9)))


import sys

GATE = float(sys.argv[sys.argv.index("--gate") + 1]) if "--gate" in sys.argv else 1e-4
THR = float(sys.argv[sys.argv.index("--thr") + 1]) if "--thr" in sys.argv else 0.12
ONLY = [a for a in sys.argv[1:] if a.startswith("L")]

print(f"{'line':22} {'n':>4} {'p10':>5} {'p25':>5} {'p50':>5} {'p75':>5} {'p90':>5} {'centroid':>8}  gate={GATE} thr={THR}")
for name in sorted(os.listdir(SRC)):
    if not name.endswith(".mp3") or (ONLY and name[:3] not in ONLY):
        continue
    x = decode(os.path.join(SRC, name))
    f0 = yin(x, thr=THR, gate=GATE)
    p = np.percentile(f0, [10, 25, 50, 75, 90]) if len(f0) else [0] * 5
    print(f"{name:22} {len(f0):4d} " + " ".join(f"{v:5.0f}" for v in p) + f" {centroid(x):8.0f}")
