#!/usr/bin/env python3
"""Diwali Day 2 (पाँच दीये · छोटी दिवाली) voice prep. Copied from diwali_d1_vo_prep.py (same method).

Trims leading/trailing silence (keeping a short natural pad), caps long inner pauses, writes 48 kHz stereo WAVs
into public/jyotiq/diwali/d2/vo/, measures a per-frame (30 fps) loudness envelope (it drives Yamraj's mouth
on line 05 and the caption pulse) and writes src/Jyotiq/diwali/d2/voData.ts.

Takes come from diwali-d2/intake.py (audio/vo/<line>.mp3 plus the Whisper transcript <line>.json). The sign-off
"ज्योतिक़ से पूछिए। पहला सवाल फ़्री।" is the Manthan Ep2 recording, copied in as audio/vo/jyotiq_signoff.mp3.
No take is split this time: every line has its own take.

Pauses inside a take are capped at 0.35 s. The beats that need a breath keep a little more:
  01 "...मृत्यु के देवता का दीया... क्यों?"               (the hook's question)
  04 "यमराज सर्प बनकर आए... पर रोशनी में..."            (the turn)
  05 "जहाँ मेरे नाम का दीया जलता है..."                  (Yamraj, calm and kind)
  06 "...एक नाम है काल... यानी समय।" and 07 "...होता है... होरा।" (the reveals)
  02 "...हिम के बेटे की... विवाह की..." a touch more than default.

Standard library only (no numpy on this Mac).
Usage: /usr/local/bin/python3 /Users/ayushrajput/.kiro/crew/workspace/video/scripts/diwali_d2_vo_prep.py
"""
import json
import re
import subprocess
import sys
from pathlib import Path

EP = Path("/Users/ayushrajput/.kiro/crew/workspace/diwali-d2")
SRC = EP / "audio/vo"
ROOT = Path("/Users/ayushrajput/.kiro/crew/workspace/video")
OUT = ROOT / "public/jyotiq/diwali/d2/vo"
TS = ROOT / "src/Jyotiq/diwali/d2/voData.ts"
FPS = 30
SR = 48000
THRESH = "-35dB"
PAD = 0.10  # seconds of air kept before/after speech
CAP = 0.35  # longest pause kept inside a take
CAP_BY_LINE = {
    "01_narrator": 0.45,
    "02_narrator": 0.40,
    "04_narrator": 0.45,
    "05_yamraj": 0.45,
    "06_narrator": 0.45,
    "07_narrator": 0.45,
}
SKIP = set()


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def check_takes():
    """Refuse to build on a take that does not say its Day 1 line: every scripted take needs its transcript
    (audio/vo/<line>.json, copied by intake.py) scoring at least 0.5 against SCRIPT.md with intake.score."""
    sys.path.insert(0, str(EP))
    from intake import LINES as SCRIPT_LINES, score
    bad = []
    for stem, line in SCRIPT_LINES.items():
        f = SRC / f"{stem}.mp3"
        js = SRC / f"{stem}.json"
        if not f.exists():
            bad.append(f"{stem}: no take in audio/vo")
            continue
        if not js.exists():
            bad.append(f"{stem}: no transcript next to the take (run intake.py --apply)")
            continue
        heard = " ".join(s["text"] for s in json.loads(js.read_text())["transcription"]).strip()
        sc = score(line, heard)
        if sc < 0.5:
            bad.append(f"{stem}: does not say its line (score {sc:.2f}): {heard}")
    if not (SRC / "jyotiq_signoff.mp3").exists():
        bad.append("jyotiq_signoff: copy manthan-ep7/audio/vo/jyotiq_signoff.mp3 (the Ep2 recording) into audio/vo")
    if bad:
        raise SystemExit("takes not ready:\n  " + "\n  ".join(bad))


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
    check_takes()
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
        chain.append("afade=t=in:d=0.02,areverse,afade=t=in:d=0.06,areverse")
        wav = OUT / f"{f.stem}.wav"
        r = run([
            "ffmpeg", "-v", "error", "-y", "-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-i", str(f),
            "-af", ",".join(chain), "-ar", str(SR), "-ac", "2", str(wav),
        ])
        if r.returncode != 0 or not wav.exists():
            raise SystemExit(f"ffmpeg failed on {f.name}: {r.stderr[-400:]}")
        env = envelope(wav)
        frames = len(env)
        data[f.stem] = {"file": f"jyotiq/diwali/d2/vo/{wav.name}", "frames": frames, "sec": round(frames / FPS, 3), "env": env}
        src_total += dur
        cut_s = sum(y - x for x, y in cuts)
        print(f"{f.stem:20s} src {dur:5.2f}s  keep {a:5.2f}-{b:5.2f}  pauses cut {cut_s:4.2f}s ({len(cuts)})  -> {frames / FPS:5.2f}s")
    speech = sum(v["sec"] for v in data.values())
    print(f"Day 1 speech incl. sign-off: {speech:.1f}s (untrimmed files: {src_total:.1f}s)")
    (OUT / "trim.json").write_text(json.dumps(trims))
    body = json.dumps(data, separators=(",", ":"))
    TS.write_text(
        "// Generated by scripts/diwali_d2_vo_prep.py - do not edit by hand.\n"
        "// Per line: trimmed WAV path, length in frames (30 fps) and a 0..1 mouth envelope per frame.\n"
        "export type VoLine = { file: string; frames: number; sec: number; env: number[] };\n"
        f"export const VO: Record<string, VoLine> = {body};\n"
    )
    print("wrote", TS)


if __name__ == "__main__":
    main()
