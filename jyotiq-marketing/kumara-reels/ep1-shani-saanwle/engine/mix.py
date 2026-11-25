"""Final mix for Kumara reel 1: voice + procedural SFX -> -14 LUFS integrated, true peak <= -1 dBTP.

Reads audio/out/vo_raw.wav (48 kHz mono) and audio/out/sfx.wav (48 kHz stereo), sums them (voice centred),
pads to exactly 69.0 s and writes audio/out/mix_final.wav (48 kHz stereo, 24-bit). Loudness is set with a
linear gain; a 4x-oversampled peak limiter is added only when that gain would push the true peak past -1 dBTP,
and the gain is re-trimmed after limiting. No music: Ayush adds licensed music inside Instagram.
"""
import json
import os
import re
import subprocess
import sys
import wave

import numpy as np

from sfx import DUR, OUT, SR, read_wav, write_wav24

TARGET_I, TARGET_TP = -14.0, -1.0


def ff(args):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-y"] + args, capture_output=True, text=True)
    if r.returncode:
        sys.exit("ffmpeg failed:\n" + r.stderr[-1500:])
    return r.stderr


def measure(path):
    """Integrated loudness, true peak and LRA from loudnorm's analysis pass."""
    err = ff(["-i", path, "-af", "loudnorm=I=-14:TP=-1:LRA=11:print_format=json", "-f", "null", "-"])
    js = json.loads(err[err.rindex("{"):err.rindex("}") + 1])
    return float(js["input_i"]), float(js["input_tp"]), float(js["input_lra"])


def ebur(path):
    """Independent EBU R128 check (ebur128 filter, true-peak mode)."""
    err = ff(["-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"])
    s = err[err.rindex("Summary:"):]
    get = lambda pat: float(re.search(pat, s).group(1))
    return get(r"I:\s+(-?[\d.]+) LUFS"), get(r"Peak:\s+(-?[\d.]+) dBFS"), get(r"LRA:\s+(-?[\d.]+) LU")


def rate(path):
    with wave.open(path) as w:
        return w.getframerate()


def main():
    vo_p, sx_p = os.path.join(OUT, "vo_raw.wav"), os.path.join(OUT, "sfx.wav")
    for pth in (vo_p, sx_p):
        if rate(pth) != SR:
            sys.exit("%s is not %d Hz" % (pth, SR))
    n = int(round(DUR * SR))
    vo = read_wav(vo_p)[0]
    sx = read_wav(sx_p)
    vo = np.pad(vo, (0, max(0, n - len(vo))))[:n]
    sx = np.pad(sx, ((0, 0), (0, max(0, n - sx.shape[1]))))[:, :n]
    mix = sx + vo[None, :]
    print("pre-mix sample peak %.2f dBFS" % (20 * np.log10(np.max(np.abs(mix)))))
    pre = os.path.join(OUT, "mix_pre.wav")
    write_wav24(pre, np.clip(mix, -1, 1))

    i0, tp0, lra0 = measure(pre)
    gain = TARGET_I - i0
    print("pre-mix: I %.2f LUFS, TP %.2f dBTP, LRA %.1f LU -> gain %+.2f dB, TP after gain %.2f dBTP"
          % (i0, tp0, lra0, gain, tp0 + gain))
    final = os.path.join(OUT, "mix_final.wav")
    limit_db = -1.5
    need_lim = tp0 + gain > TARGET_TP - 0.2
    for it in range(4):
        if need_lim:
            # the limiter looks ahead by its attack time (2 ms = 96 samples at 48 kHz): trim it back off
            chain = ("volume=%.3fdB,aresample=192000,alimiter=limit=%.4f:attack=2:release=80:level=false,"
                     "aresample=48000,atrim=start_sample=%d,asetpts=PTS-STARTPTS,apad=whole_len=%d"
                     % (gain, 10 ** (limit_db / 20), round(0.002 * SR), n))
        else:
            chain = "volume=%.3fdB" % gain
        ff(["-i", pre, "-af", chain, "-ar", str(SR), "-ac", "2", "-c:a", "pcm_s24le", final])
        i1, tp1, lra1 = ebur(final)
        print("pass %d (%s): I %.2f LUFS, TP %.2f dBTP, LRA %.1f LU"
              % (it + 1, "gain + limiter at %.1f dBFS" % limit_db if need_lim else "gain only", i1, tp1, lra1))
        if abs(i1 - TARGET_I) <= 0.15 and tp1 <= TARGET_TP:
            break
        if tp1 > TARGET_TP:
            need_lim = True
            limit_db -= (tp1 - TARGET_TP) + 0.1
        gain += TARGET_I - i1
    else:
        sys.exit("could not reach the loudness target")
    with wave.open(final) as w:
        print("MIX_OK %s  %d Hz, %d ch, %d-bit, %.3f s" % (final, w.getframerate(), w.getnchannels(),
                                                          8 * w.getsampwidth(), w.getnframes() / w.getframerate()))


if __name__ == "__main__":
    main()
