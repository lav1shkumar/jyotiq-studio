"""नवग्रह जन्म Ep2 mix (copied from the Ep1 v2 mix): narration + score stems + brand sonic -> public/jyotiq/navagraha/ep2/mix.wav.

- narration (navagraha-ep2/audio/vo/vo.wav) placed on the reel clock (clock.json vo_offset_s), high-passed,
  a touch of hall, levelled to -17 LUFS
- the brand open's sonic.wav at frame 0 (as ReelOpen), ducked under the hook line
- music stems (tanpura, pad, santoor, bells, drums) and SFX, ducked under every word (attack 30 ms,
  release 280 ms) with the 2-4 kHz band carved a further 4 dB while the narrator speaks
- bed level set so the narration sits ~13 LU over the bed while it speaks (house rule: >= 11.5)
- master: gain to -14 LUFS integrated, limiter at -3 dBFS (AAC adds 0.5-1 dB of true peak); reports integrated, LRA and true peak
Run: /Users/ayushrajput/earshot/.venv/bin/python scripts/navagraha_ep2_mix.py
"""
import json
import re
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
from manthan_ep4_score import band, convolve, make_ir  # noqa: E402

EP = Path("/Users/ayushrajput/.kiro/crew/workspace/navagraha-ep2")
VIDEO = Path("/Users/ayushrajput/.kiro/crew/workspace/video")
OUT = VIDEO / "public/jyotiq/navagraha/ep2/mix.wav"
FF = "/opt/homebrew/bin/ffmpeg"
SR = 48000
FPS = 30
CLK = json.loads((EP / "audio/vo/clock.json").read_text())
TOTAL = CLK["total"]
N = int(TOTAL / FPS * SR)
TMP = EP / "audio/mixwork"
VO_LUFS = -17.0
TARGET_GAP = 12.0  # LU between the narration and the bed while it speaks

# stem gains before the bed is levelled as a whole (relative balance of the score)
GAIN = {"tanpura": 0.42, "pad": 0.9, "santoor": 0.75, "bells": 0.7, "drums": 1.1, "sfx": 1.0, "pulse": 1.3}


def read(path):
    with wave.open(str(path), "rb") as w:
        n, ch, sw, sr = w.getnframes(), w.getnchannels(), w.getsampwidth(), w.getframerate()
        raw = w.readframes(n)
    assert sr == SR, (path, sr)
    if sw == 2:
        x = np.frombuffer(raw, "<i2").astype(np.float32) / 32768
    elif sw == 3:
        b = np.frombuffer(raw, np.uint8).reshape(-1, 3)
        i = (b[:, 0].astype(np.int32) | (b[:, 1].astype(np.int32) << 8) | (b[:, 2].astype(np.int32) << 16))
        i = np.where(i & 0x800000, i - 0x1000000, i)
        x = i.astype(np.float32) / 8388608
    else:
        x = np.frombuffer(raw, "<f4").astype(np.float32) if w.getcomptype() == "NONE" else None
    x = x.reshape(-1, ch)
    return np.repeat(x, 2, axis=1) if ch == 1 else x


def read_any(path):
    """Float WAVs (stems) go through ffmpeg to be safe about the header."""
    raw = subprocess.run([FF, "-v", "error", "-i", str(path), "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()


def write24(path, x):
    path.parent.mkdir(parents=True, exist_ok=True)
    ints = (np.clip(x, -1, 1) * 8388607).astype("<i4").tobytes()
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(3)
        w.setframerate(SR)
        w.writeframes(b"".join(ints[i:i + 3] for i in range(0, len(ints), 4)))


def fit(x):
    y = np.zeros((N, 2), np.float32)
    m = min(N, len(x))
    y[:m] = x[:m]
    return y


def place(x, at_s):
    y = np.zeros((N, 2), np.float32)
    i = int(round(at_s * SR))
    m = min(len(x), N - i)
    y[i:i + m] = x[:m]
    return y


def measure(x, name):
    p = TMP / f"{name}.wav"
    write24(p, x)
    out = subprocess.run([FF, "-hide_banner", "-nostats", "-i", str(p), "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    summ = out.split("Summary:")[-1]
    I = float(re.search(r"I:\s+(-?[\d.]+|-inf) LUFS", summ).group(1).replace("-inf", "-99"))
    lra = float(re.search(r"LRA:\s+([\d.]+) LU", summ).group(1))
    tp = re.search(r"Peak:\s+(-?[\d.]+|-inf) dBFS", summ)
    return I, lra, float(tp.group(1)) if tp else -99.0


def db(g):
    return 10 ** (g / 20)


def envelope(v, att=0.03, rel=0.28):
    """Narration activity 0..1 from its level (10 ms hop), with attack/release smoothing, per sample."""
    m = np.abs(v).mean(axis=1)
    h = SR // 100
    n = len(m) // h
    r = np.sqrt(np.mean(m[: n * h].reshape(n, h) ** 2, axis=1))
    lvl = 20 * np.log10(r + 1e-9)
    act = np.clip((lvl - (lvl.max() - 42)) / 14, 0, 1)
    out = np.zeros(n)
    a, rl = np.exp(-0.01 / att), np.exp(-0.01 / rel)
    s = 0.0
    for i in range(n):
        k = a if act[i] > s else rl
        s = k * s + (1 - k) * act[i]
        out[i] = s
    # look ahead 40 ms so the bed is already down when a word starts
    out = np.maximum(out, np.concatenate([out[4:], np.zeros(4)]))
    e = np.repeat(out, h)
    return np.concatenate([e, np.zeros(len(m) - len(e))]).astype(np.float32)


def main():
    TMP.mkdir(parents=True, exist_ok=True)
    vo = read(EP / "audio/vo/vo.wav")
    vo = band(vo, lo=80)
    vo = vo + 0.07 * convolve(vo, make_ir(1.4, 1.8, 0.02, seed=21, dark=1.6))[: len(vo)]
    vo = place(vo, CLK["vo_offset_s"])
    I, _, _ = measure(vo, "vo")
    vo *= db(VO_LUFS - I)
    env = envelope(vo)

    stems = {k: fit(read_any(EP / f"audio/stems/{k}.wav")) * GAIN[k] for k in GAIN}
    sonic = fit(read(VIDEO / "public/jyotiq/brandopen/sonic.wav")) * 0.9
    # the brand sonic's tail fades out before the title hit (frames 124-138) so the title lands clean
    fo = np.ones(N, np.float32)
    a, b = int(124 / FPS * SR), int(138 / FPS * SR)
    fo[a:b] = np.linspace(1, 0, b - a) ** 2
    fo[b:] = 0
    sonic *= fo[:, None]
    music = sum(stems[k] for k in ("tanpura", "pad", "santoor", "bells", "drums", "pulse"))
    fx = stems["sfx"] + sonic
    # ducking: music -8 dB and fx -4 dB under the narration; carve 2-4 kHz of the music another -4 dB
    gm = (1 - env * (1 - db(-7.0)))[:, None]
    gf = (1 - env * (1 - db(-4.0)))[:, None]
    mid = band(music, lo=2000, hi=4000)
    music = (music - mid) * gm + mid * gm * (1 - env * (1 - db(-4.0)))[:, None]
    bed = music + fx * gf
    # level the bed against the narration while it speaks
    speaking = (env > 0.5)[:, None]
    Ib, _, _ = measure(bed * speaking, "bed_speaking")
    Iv, _, _ = measure(vo * speaking, "vo_speaking")
    bed *= db((Iv - TARGET_GAP) - Ib)
    Ib2, _, _ = measure(bed * speaking, "bed_speaking2")
    # v2: every phrase must sit >= 11.5 LU over the bed (house rule), checked phrase by phrase
    # where a hit lands on a word (श्राप, शनि, the lathe) the bed is ridden down over that phrase only, 60 ms ramps
    def phrase_gaps():
        out = []
        for i, ph in enumerate(CLK["phrases"]):
            a, b = int(ph["fa"] / FPS * SR), int((ph["fb"] + 1) / FPS * SR)
            if b - a < int(0.5 * SR):
                continue
            sv, _, _ = measure(vo[a:b], "pv")
            sb, _, _ = measure(bed[a:b], "pb")
            out.append((sv - sb, i, a, b))
        return out

    for _ in range(3):
        gaps = phrase_gaps()
        low = [(g, i, a, b) for g, i, a, b in gaps if g < 12.0]
        if not low:
            break
        ride = np.ones(N, np.float32)
        r = int(0.06 * SR)
        for g, i, a, b in low:
            d = db(-min(12.0, 12.3 - g))
            seg_ = np.full(b - a + 2 * r, d, np.float32)
            seg_[:r] = np.linspace(1, d, r)
            seg_[-r:] = np.linspace(d, 1, r)
            lo_, hi_ = max(0, a - r), min(N, b + r)
            ride[lo_:hi_] = np.minimum(ride[lo_:hi_], seg_[lo_ - (a - r): len(seg_) - ((b + r) - hi_)])
        bed *= ride[:, None]
        print("rode down:", [(i, round(g, 1)) for g, i, _, _ in low])
    gaps = [(g, i) for g, i, _, _ in phrase_gaps()]
    print("phrase gaps LU: min %.1f (P%d), median %.1f" % (min(gaps)[0], min(gaps)[1], sorted(g for g, _ in gaps)[len(gaps) // 2]))
    mix = vo + bed
    Im, _, _ = measure(mix, "premix")
    pre = TMP / "premaster.wav"
    OUT.parent.mkdir(parents=True, exist_ok=True)
    # limiter at -3 dBFS sample peak (AAC adds ~0.5-1 dB of true peak); re-gain until the limited master is -14.0
    g = -14.0 - Im
    for _ in range(4):
        write24(pre, mix * db(g))
        subprocess.run([FF, "-v", "error", "-y", "-i", str(pre), "-af", "alimiter=limit=0.708:attack=3:release=80:level=disabled", "-ar", str(SR), "-c:a", "pcm_s24le", str(OUT)], check=True)
        I_out, _, _ = measure(read(OUT), "limited")
        if abs(I_out + 14.0) < 0.1:
            break
        g += -14.0 - I_out
    out = subprocess.run([FF, "-hide_banner", "-nostats", "-i", str(OUT), "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr.split("Summary:")[-1]
    print(f"narration {Iv:.1f} LUFS while speaking; bed {Ib2:.1f} LUFS while speaking -> gap {Iv - Ib2:.1f} LU")
    print("master:", " ".join(out.split()))
    print("wrote", OUT, f"({N / SR:.2f} s)")


if __name__ == "__main__":
    main()
