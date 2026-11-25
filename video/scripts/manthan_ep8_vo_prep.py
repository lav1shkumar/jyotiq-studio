#!/usr/bin/env python3
"""Manthan Ep8 voice prep.

Same method as manthan_ep7_vo_prep.py: trim leading/trailing silence (keeping a short natural
pad), write 48 kHz stereo WAVs into public/jyotiq/manthan/ep8/vo/, measure a per-frame (30 fps)
loudness envelope, and write src/Jyotiq/manthan/ep8/voData.ts.

The envelope drives Rahu's mouth (05) and Ketu's chest glow (06; Ketu has no mouth).
06_ketu also gets a hollow cave treatment here (low-cut, soft multi-tap echo), so the envelope
and the timeline include the echo tail.

Pauses inside a take are capped at 0.35 s. The hook and reveal beats keep a longer breath:
  01 "अमृत सिर्फ़ गले तक पहुँचा था... तो बिना सिर का धड़ कैसे बचा?"
  03 "बूँद दो हिस्सों में बँट गई... सिर भी अमर, धड़ भी।"
  06 "और मुझे... कुछ नहीं चाहिए।"
  07 "तब ब्रह्मा ने उसे नवग्रहों में जगह दी... नाम मिला, केतु।"
  09 "इसीलिए केतु को सिर की ज़रूरत नहीं... वो सोचता नहीं, सीधे जानता है।"

Standard library only (no numpy on this Mac).
"""
import json
import re
import subprocess
from pathlib import Path

SRC = Path("/Users/ayushrajput/.kiro/crew/workspace/manthan-ep8/audio/vo")
ROOT = Path("/Users/ayushrajput/.kiro/crew/workspace/video")
OUT = ROOT / "public/jyotiq/manthan/ep8/vo"
TS = ROOT / "src/Jyotiq/manthan/ep8/voData.ts"
FPS = 30
SR = 48000
THRESH = "-35dB"
PAD = 0.10  # seconds of air kept before/after speech
CAP = 0.35  # longest pause kept inside a take
CAP_BY_LINE = {
    "01_narrator": 0.50,  # hook, before "तो बिना सिर का धड़"
    "03_narrator": 0.40,  # before "सिर भी अमर"
    "06_ketu": 0.55,      # "और मुझे... कुछ नहीं" stillness
    "07_narrator": 0.45,  # before "नाम मिला, केतु"
    "09_narrator": 0.40,  # before "वो सोचता नहीं"
}
# Extra filter per line, applied after trimming (before the edge fades).
FX_BY_LINE = {
    # Hollow cave: thin the chest a little, then three soft taps that decay; adds ~0.6 s tail.
    "06_ketu": "highpass=f=110,lowpass=f=7500,apad=pad_dur=0.6,aecho=0.85:0.55:90|180|320:0.32|0.20|0.12",
}
SKIP: set = set()


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def silences(path: Path):
    r = run(["ffmpeg", "-hide_banner", "-i", str(path), "-af", f"silencedetect=n={THRESH}:d=0.08", "-f", "null", "-"])
    dur = float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)]).stdout)
    starts = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", r.stderr)]
    ends = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", r.stderr)]
    return starts, ends, dur


def speech_bounds(starts, ends, dur):
    head = 0.0
    if starts and starts[0] <= 0.02 and ends:
        head = ends[0]
    tail = dur
    if starts and (not ends or starts[-1] > ends[-1] or (ends[-1] >= dur - 0.03 and starts[-1] > head)):
        tail = starts[-1]
    return max(0.0, head - PAD), min(dur, tail + PAD)


def cuts_for(stem, starts, ends, a, b):
    """Middle parts of over-long inner pauses, relative to the trimmed start."""
    cap = CAP_BY_LINE.get(stem, CAP)
    cuts = []
    for s, e in zip(starts, ends):
        if s > a + PAD and e < b - PAD and e - s > cap:
            cuts.append((round(s - a + cap / 2, 3), round(e - a - cap / 2, 3)))
    return cuts


def envelope(path: Path):
    """Per-frame RMS (dB) -> 0..1 openness (Rahu's mouth, Ketu's glow)."""
    n = SR // FPS
    r = run([
        "ffmpeg", "-hide_banner", "-i", str(path), "-af",
        f"aresample={SR},pan=mono|c0=0.5*c0+0.5*c1,asetnsamples=n={n}:p=0,astats=metadata=1:reset=1,"
        "ametadata=print:key=lavfi.astats.Overall.RMS_level",
        "-f", "null", "-",
    ])
    vals = []
    for m in re.findall(r"RMS_level=(-?[0-9.]+|-inf)", r.stderr):
        db = -90.0 if m == "-inf" else float(m)
        v = (db + 42.0) / 28.0  # -42 dB = shut, -14 dB = wide open
        vals.append(round(max(0.0, min(1.0, v)), 2))
    return vals


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    TS.parent.mkdir(parents=True, exist_ok=True)
    data = {}
    trims = {}  # how each take was cut, so Whisper word times can be mapped onto the trimmed WAV
    src_total = 0.0
    for f in sorted(SRC.glob("*.mp3")):
        if f.stem in SKIP:
            continue
        starts, ends, dur = silences(f)
        a, b = speech_bounds(starts, ends, dur)
        cuts = cuts_for(f.stem, starts, ends, a, b)
        trims[f.stem] = {"a": round(a, 3), "cuts": cuts}
        chain = []
        if cuts:
            keep = "+".join(f"between(t,{x:.3f},{y:.3f})" for x, y in cuts)
            chain.append(f"aselect='not({keep})',asetpts=N/SR/TB")
        if f.stem in FX_BY_LINE:
            chain.append(FX_BY_LINE[f.stem])
        chain.append("afade=t=in:d=0.02,areverse,afade=t=in:d=0.06,areverse")
        wav = OUT / f"{f.stem}.wav"
        res = run([
            "ffmpeg", "-v", "error", "-y", "-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-i", str(f),
            "-af", ",".join(chain), "-ar", str(SR), "-ac", "2", str(wav),
        ])
        if res.returncode != 0:
            raise SystemExit(f"ffmpeg failed on {f.stem}: {res.stderr.strip()}")
        env = envelope(wav)
        frames = len(env)
        data[f.stem] = {"file": f"jyotiq/manthan/ep8/vo/{wav.name}", "frames": frames, "sec": round(frames / FPS, 3), "env": env}
        src_total += dur
        cut_s = sum(y - x for x, y in cuts)
        print(f"{f.stem:20s} src {dur:5.2f}s  keep {a:5.2f}-{b:5.2f}  pauses cut {cut_s:4.2f}s ({len(cuts)})  -> {frames / FPS:5.2f}s")
    speech = sum(v["sec"] for v in data.values())
    print(f"Episode 8 speech incl. sign-off: {speech:.1f}s (untrimmed files: {src_total:.1f}s)")
    (OUT / "trim.json").write_text(json.dumps(trims))
    body = json.dumps(data, separators=(",", ":"))
    TS.write_text(
        "// Generated by scripts/manthan_ep8_vo_prep.py - do not edit by hand.\n"
        "// Per line: trimmed WAV path, length in frames (30 fps) and a 0..1 envelope per frame.\n"
        "export type VoLine = { file: string; frames: number; sec: number; env: number[] };\n"
        f"export const VO: Record<string, VoLine> = {body};\n"
    )
    print("wrote", TS)


if __name__ == "__main__":
    main()
