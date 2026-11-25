#!/usr/bin/env python3
"""Manthan Ep3 voice prep.

Same method as manthan_ep2_vo_prep.py (Episode 2), for Episode 3's takes: trim leading/trailing
silence (keeping a short natural pad), write 48 kHz stereo WAVs into
public/jyotiq/manthan/ep3/vo/, measure a per-frame (30 fps) loudness envelope that drives
the puppets' mouths, and write src/Jyotiq/manthan/ep3/voData.ts.

The ElevenLabs v4 takes carry a room-tone floor above -45 dB, so silence is found at -35 dB.
Pauses inside a take longer than CAP are shortened by cutting their quiet middle (the edges of
the pause stay, so breaths and word endings are untouched). The hook, the head/tail turn, the
"और तभी..." beat and the cliffhanger question keep longer dramatic pauses.

Standard library only (no numpy on this Mac).
"""
import json
import re
import subprocess
from pathlib import Path

SRC = Path("/Users/ayushrajput/.kiro/crew/workspace/manthan-ep3/audio/vo")
ROOT = Path("/Users/ayushrajput/.kiro/crew/workspace/video")
OUT = ROOT / "public/jyotiq/manthan/ep3/vo"
TS = ROOT / "src/Jyotiq/manthan/ep3/voData.ts"
FPS = 30
SR = 48000
THRESH = "-35dB"
PAD = 0.12  # seconds of air kept before/after speech
CAP = 0.55  # longest pause kept inside a take
CAP_BY_LINE = {
    "01_narrator": 0.70,  # "पर्वत डूब रहा था... [pause] और सागर की गहराई में..."
    "09_narrator": 0.65,  # "...फुंकार थी। [pause] और पूँछ की तरफ़?"
    "12_narrator": 0.75,  # "और तभी... [pause] अमृत से पहले..."
    "15_narrator": 0.80,  # "...जला दे... [pause] उसे पिएगा कौन?"
}


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
    # This ffmpeg closes a trailing silence at EOF (silence_end == duration), so a silence that
    # runs to within 30 ms of the end also counts as the tail (Episode 2's check missed that).
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
    """Per-frame RMS (dB) -> 0..1 mouth openness."""
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
        starts, ends, dur = silences(f)
        a, b = speech_bounds(starts, ends, dur)
        cuts = cuts_for(f.stem, starts, ends, a, b)
        trims[f.stem] = {"a": round(a, 3), "cuts": cuts}
        chain = []
        if cuts:
            keep = "+".join(f"between(t,{x:.3f},{y:.3f})" for x, y in cuts)
            chain.append(f"aselect='not({keep})',asetpts=N/SR/TB")
        chain.append("afade=t=in:d=0.02,areverse,afade=t=in:d=0.06,areverse")
        wav = OUT / f"{f.stem}.wav"
        run([
            "ffmpeg", "-v", "error", "-y", "-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-i", str(f),
            "-af", ",".join(chain), "-ar", str(SR), "-ac", "2", str(wav),
        ])
        env = envelope(wav)
        frames = len(env)
        data[f.stem] = {"file": f"jyotiq/manthan/ep3/vo/{wav.name}", "frames": frames, "sec": round(frames / FPS, 3), "env": env}
        src_total += dur
        cut_s = sum(y - x for x, y in cuts)
        print(f"{f.stem:20s} src {dur:5.2f}s  keep {a:5.2f}-{b:5.2f}  pauses cut {cut_s:4.2f}s ({len(cuts)})  -> {frames / FPS:5.2f}s")
    speech = sum(v["sec"] for v in data.values())
    print(f"Episode 3 speech incl. sign-off: {speech:.1f}s (untrimmed files: {src_total:.1f}s)")
    (OUT / "trim.json").write_text(json.dumps(trims))
    body = json.dumps(data, separators=(",", ":"))
    TS.write_text(
        "// Generated by scripts/manthan_ep3_vo_prep.py - do not edit by hand.\n"
        "// Per line: trimmed WAV path, length in frames (30 fps) and a 0..1 mouth envelope per frame.\n"
        "export type VoLine = { file: string; frames: number; sec: number; env: number[] };\n"
        f"export const VO: Record<string, VoLine> = {body};\n"
    )
    print("wrote", TS)


if __name__ == "__main__":
    main()
