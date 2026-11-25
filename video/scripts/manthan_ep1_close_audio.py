#!/usr/bin/env python3
"""Episode 1 update: add the voiced Jyotiq close over Episode 1's end card.

Builds a NEW mix (public/jyotiq/manthan/ep1close/mix_close.wav) from Episode 1's original mix.wav,
leaving every Episode 1 file untouched:
  - Episode 1's mix, dipped 16 dB from just before the close (its end-card bed keeps playing under it)
  - ep1_close_narrator ("Rahu aur Ketu aaj bhi...") on the end card, then jyotiq_signoff
  - a soft drone tail past Episode 1's original end, and a small brand chime
Voice levels are matched to Episode 2's own close (stem_vo.wav windows), then the master is limited
to about -1 dBTP. Prints loudness and the voice-over-bed gap per line, and writes the frame timings
for the Remotion composition to src/Jyotiq/manthan/ep1close/timing.ts.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path("/Users/ayushrajput/.kiro/crew/workspace/video")
PUB = ROOT / "public/jyotiq/manthan"
EP1_MIX = PUB / "mix.wav"
VO_DIR = PUB / "ep2/vo"
EP2_STEM_VO = PUB / "ep2/stem_vo.wav"
OUT_DIR = PUB / "ep1close"
TS_OUT = ROOT / "src/Jyotiq/manthan/ep1close/timing.ts"

FPS = 30
EP1_TOTAL = 2070  # Episode 1's original length (frames)
END_CARD = 1906  # Episode 1's end card cue
VO1_AT = 1932  # close narrator starts as the tie-in text appears
GAP = 11  # frames between the two takes
HOLD = 40  # frames after the sign-off before the end
DIP_DB = -16.0

# Episode 2 timeline windows (frames) holding the same two kinds of take, for level matching
EP2_17 = (3275, 3528)
EP2_SIGNOFF = (3538, 3639)


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def dur(path):
    r = run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", str(path)])
    return float(r.stdout.strip())


def lufs(path, start=None, length=None):
    cmd = ["ffmpeg", "-hide_banner", "-nostats"]
    if start is not None:
        cmd += ["-ss", f"{start:.3f}", "-t", f"{length:.3f}"]
    cmd += ["-i", str(path), "-af", "loudnorm=print_format=json", "-f", "null", "-"]
    r = run(cmd)
    m = re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", r.stderr, re.S)
    if not m:
        sys.exit(f"loudness failed for {path}: {r.stderr[-400:]}")
    j = json.loads(m.group(0))
    return float(j["input_i"]), float(j["input_tp"]), float(j["input_lra"])


def mean_db(path, start, length):
    r = run(["ffmpeg", "-hide_banner", "-nostats", "-ss", f"{start:.3f}", "-t", f"{length:.3f}", "-i", str(path), "-af", "volumedetect", "-f", "null", "-"])
    m = re.search(r"mean_volume:\s*(-?[\d.]+) dB", r.stderr)
    return float(m.group(1)) if m else -120.0


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    TS_OUT.parent.mkdir(parents=True, exist_ok=True)
    vo1 = VO_DIR / "ep1_close_narrator.wav"
    vo2 = VO_DIR / "jyotiq_signoff.wav"
    d1, d2 = dur(vo1), dur(vo2)
    f1 = round(d1 * FPS)
    f2 = round(d2 * FPS)
    signoff_at = VO1_AT + f1 + GAP
    chime_at = signoff_at + f2 + 6
    total = signoff_at + f2 + HOLD
    t1, t2, tc, T = VO1_AT / FPS, signoff_at / FPS, chime_at / FPS, total / FPS

    # level match to Episode 2's own close
    tgt1 = lufs(EP2_STEM_VO, EP2_17[0] / FPS, (EP2_17[1] - EP2_17[0]) / FPS)[0]
    tgt2 = lufs(EP2_STEM_VO, EP2_SIGNOFF[0] / FPS, (EP2_SIGNOFF[1] - EP2_SIGNOFF[0]) / FPS)[0]
    g1 = tgt1 - lufs(vo1)[0]
    g2 = tgt2 - lufs(vo2)[0]
    print(f"targets {tgt1:.1f} / {tgt2:.1f} LUFS -> gains {g1:+.1f} / {g2:+.1f} dB")

    dip = 10 ** (DIP_DB / 20)
    d0 = t1 - 0.25
    vo_wav, bed_wav, mix_wav = OUT_DIR / "vo_close.wav", OUT_DIR / "bed_close.wav", OUT_DIR / "mix_close.wav"

    # voices only, placed on the reel clock
    g = (
        f"[0:a]aresample=48000,aformat=channel_layouts=stereo,volume={g1:.2f}dB,adelay={int(t1*1000)}:all=1[a];"
        f"[1:a]aresample=48000,aformat=channel_layouts=stereo,volume={g2:.2f}dB,adelay={int(t2*1000)}:all=1[b];"
        f"[a][b]amix=inputs=2:normalize=0:duration=longest,apad=whole_dur={T:.3f}[o]"
    )
    r = run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", str(vo1), "-i", str(vo2), "-filter_complex", g, "-map", "[o]", "-t", f"{T:.3f}", "-ar", "48000", str(vo_wav)])
    if r.returncode:
        sys.exit(r.stderr)

    # bed: Episode 1's mix dipped under the close, a soft drone tail and a brand chime
    tail = T - (EP1_TOTAL / FPS - 1.0)
    g = (
        f"[0:a]aresample=48000,aformat=channel_layouts=stereo,"
        f"volume='1-{1 - dip:.4f}*min(max((t-{d0:.3f})/0.25,0),1)':eval=frame,apad=whole_dur={T:.3f}[ep1];"
        f"sine=frequency=110:duration={tail:.3f}[s1];sine=frequency=164.81:duration={tail:.3f}[s2];sine=frequency=220:duration={tail:.3f}[s3];"
        f"[s1][s2][s3]amix=inputs=3:normalize=0,volume=0.03,aformat=channel_layouts=stereo,aresample=48000,"
        f"afade=t=in:d=1.0,afade=t=out:st={tail - 1.6:.3f}:d=1.6,adelay={int((EP1_TOTAL / FPS - 1.0) * 1000)}:all=1[drone];"
        f"sine=frequency=1318.51:duration=1.8[c1];sine=frequency=1975.53:duration=1.8[c2];"
        f"[c1][c2]amix=inputs=2:normalize=0,volume=0.05,afade=t=out:st=0.05:d=1.75:curve=exp,aformat=channel_layouts=stereo,aresample=48000,"
        f"adelay={int(tc * 1000)}:all=1[chime];"
        f"[ep1][drone][chime]amix=inputs=3:normalize=0:duration=first[o]"
    )
    r = run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", str(EP1_MIX), "-filter_complex", g, "-map", "[o]", "-t", f"{T:.3f}", "-ar", "48000", str(bed_wav)])
    if r.returncode:
        sys.exit(r.stderr)

    # master
    g = "[0:a][1:a]amix=inputs=2:normalize=0:duration=longest,alimiter=limit=0.87:level=false[o]"
    r = run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", str(bed_wav), "-i", str(vo_wav), "-filter_complex", g, "-map", "[o]", "-t", f"{T:.3f}", "-ar", "48000", "-c:a", "pcm_s16le", str(mix_wav)])
    if r.returncode:
        sys.exit(r.stderr)

    # checks
    for name, a, b in (("ep1_close_narrator", t1, t1 + d1), ("jyotiq_signoff", t2, t2 + d2)):
        v = mean_db(vo_wav, a + 0.1, b - a - 0.2)
        bd = mean_db(bed_wav, a + 0.1, b - a - 0.2)
        print(f"{name}: voice {v:.1f} dB, bed {bd:.1f} dB -> gap {v - bd:.1f} dB")
    i, tp, lra = lufs(mix_wav)
    tail_i = lufs(mix_wav, t1, T - t1)[0]
    print(f"master: {i:.1f} LUFS integrated, TP {tp:.1f} dBTP, LRA {lra:.1f}; close section {tail_i:.1f} LUFS; length {T:.2f} s = {total} frames")

    TS_OUT.write_text(
        "// Generated by scripts/manthan_ep1_close_audio.py - Episode 1 with the voiced Jyotiq close.\n"
        f"export const EP1C = {{ TOTAL: {total}, EP1_TOTAL: {EP1_TOTAL}, END_CARD: {END_CARD}, VO1: {VO1_AT}, SIGNOFF: {signoff_at}, CHIME: {chime_at} }} as const;\n"
    )
    print(f"wrote {mix_wav} and {TS_OUT}")


if __name__ == "__main__":
    main()
