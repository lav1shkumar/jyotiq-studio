#!/usr/bin/env python3
"""Manthan Ep4 voice prep.

Same method as manthan_ep3_vo_prep.py: trim leading/trailing silence (keeping a short natural
pad), write 48 kHz stereo WAVs into public/jyotiq/manthan/ep4/vo/, measure a per-frame (30 fps)
loudness envelope that drives the puppets' mouths, and write src/Jyotiq/manthan/ep4/voData.ts.

Episode 4 has a hard 60 s cap, so pauses inside a take are capped tighter than in Episode 3.
Only the hook ("...पहले... महादेव") and the name beat ("...ठहर गया... और ... नीलकंठ") keep a
slightly longer breath.

Standard library only (no numpy on this Mac).
"""
import json
import re
import subprocess
from pathlib import Path

SRC = Path("/Users/ayushrajput/.kiro/crew/workspace/manthan-ep4/audio/vo")
ROOT = Path("/Users/ayushrajput/.kiro/crew/workspace/video")
OUT = ROOT / "public/jyotiq/manthan/ep4/vo"
TS = ROOT / "src/Jyotiq/manthan/ep4/voData.ts"
FPS = 30
SR = 48000
THRESH = "-35dB"
PAD = 0.10  # seconds of air kept before/after speech
CAP = 0.42  # longest pause kept inside a take
CAP_BY_LINE = {
    "01_narrator": 0.55,  # hook: "हलाहल पीने से पहले... महादेव ने किससे पूछा था?"
    "07_narrator": 0.50,  # "विष कंठ में ही ठहर गया... और महादेव कहलाए, नीलकंठ।"
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
    # ffmpeg closes a trailing silence at EOF (silence_end == duration), so a silence that runs to
    # within 30 ms of the end also counts as the tail.
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
        data[f.stem] = {"file": f"jyotiq/manthan/ep4/vo/{wav.name}", "frames": frames, "sec": round(frames / FPS, 3), "env": env}
        src_total += dur
        cut_s = sum(y - x for x, y in cuts)
        print(f"{f.stem:20s} src {dur:5.2f}s  keep {a:5.2f}-{b:5.2f}  pauses cut {cut_s:4.2f}s ({len(cuts)})  -> {frames / FPS:5.2f}s")
    # 09_indra and 09_bali are one chant layered together, so count the longer of the two once.
    chant = max(data["09_indra"]["sec"], data["09_bali"]["sec"])
    speech = sum(v["sec"] for k, v in data.items() if not k.startswith("09_")) + chant
    print(f"Episode 4 speech incl. sign-off, chant counted once: {speech:.1f}s (untrimmed files: {src_total:.1f}s)")
    (OUT / "trim.json").write_text(json.dumps(trims))
    body = json.dumps(data, separators=(",", ":"))
    TS.write_text(
        "// Generated by scripts/manthan_ep4_vo_prep.py - do not edit by hand.\n"
        "// Per line: trimmed WAV path, length in frames (30 fps) and a 0..1 mouth envelope per frame.\n"
        "export type VoLine = { file: string; frames: number; sec: number; env: number[] };\n"
        f"export const VO: Record<string, VoLine> = {body};\n"
    )
    print("wrote", TS)


if __name__ == "__main__":
    main()
