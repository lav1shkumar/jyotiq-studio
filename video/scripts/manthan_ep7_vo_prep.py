#!/usr/bin/env python3
"""Manthan Ep7 voice prep.

Same method as manthan_ep6_vo_prep.py: trim leading/trailing silence (keeping a short natural
pad), write 48 kHz stereo WAVs into public/jyotiq/manthan/ep7/vo/, measure a per-frame (30 fps)
loudness envelope that drives Rahu's mouth (lines 06 and 08), and write
src/Jyotiq/manthan/ep7/voData.ts.

Ayush uploaded a single Rahu file for both Rahu lines, so SPLIT cuts it into 06_rahu and
08_rahu first (times in the source file, read from the Whisper segments). The script refuses to
run until those times are filled in.

Pauses inside a take are capped at 0.35 s. The hook and the reveal beats keep a slightly longer
breath:
  01 "हर ग्रहण के पीछे... एक कटा हुआ सिर है। किसका?"
  05 "विष्णु का सुदर्शन चक्र चला... सिर धड़ से अलग!"
  07 "सिर बना राहु... और धड़, केतु।"
  09 "तभी से राहु उनका पीछा करता है... जब निगलता है, ग्रहण लगता है।"
The extras (x_bali, x_mohini) are not in the script and are skipped unless the transcription
shows one of them saying a scripted line.

Standard library only (no numpy on this Mac).
"""
import json
import re
import subprocess
import sys
from pathlib import Path

SRC = Path("/Users/ayushrajput/.kiro/crew/workspace/manthan-ep7/audio/vo")
ROOT = Path("/Users/ayushrajput/.kiro/crew/workspace/video")
OUT = ROOT / "public/jyotiq/manthan/ep7/vo"
TS = ROOT / "src/Jyotiq/manthan/ep7/voData.ts"
FPS = 30
SR = 48000
THRESH = "-35dB"
PAD = 0.10  # seconds of air kept before/after speech
CAP = 0.35  # longest pause kept inside a take
CAP_BY_LINE = {
    "01_narrator": 0.50,  # hook, before "किसका?"
    "05_narrator": 0.40,  # before "सिर धड़ से अलग!"
    "07_narrator": 0.45,  # between "राहु" and "केतु"
    "09_narrator": 0.45,  # before "जब निगलता है"
    "06_rahu": 0.40,      # after the laugh
    "08_rahu": 0.45,      # "सूर्य... चंद्र..." menace
}
# Source-file times (seconds) for the Rahu lines inside rahu_take.mp3 (the Jyotiq Rahu Voice Design preview,
# the same 'raahu ji' voice). 06 has its own new take (raahu ji (3), with the laugh), so only 08 is cut here:
# Ayush's 08 came in the Kaal narrator voice, and Rahu's lip-synced head needs Rahu's voice. Times from
# silencedetect on the preview: 'सूर्य' starts at 8.96 s after a 0.55 s pause; 'लौटूँगा' ends in the 62 ms gap
# at 12.66-12.72 s before 'और तुम्हें निगल जाऊँगा', which is dropped for time. Words: 'सूर्य, चंद्र, मैं हर बार लौटूँगा'.
SPLIT = {
    "rahu_take": [("06_rahu", None, None), ("08_rahu", 8.90, 12.69)],
}
SKIP = {"rahu_take", "x_bali", "x_mohini"}


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def split_sources():
    """Cut rahu_take.mp3 into 06_rahu / 08_rahu only when it is in use: a part whose own separate take is
    already in audio/vo (Ayush re-recorded the line) is left alone. Returns the stems cut this run."""
    made = set()
    for src, parts in SPLIT.items():
        if not (SRC / f"{src}.mp3").exists():
            continue
        for stem, a, b in parts:
            if (a is None or b is None) and (SRC / f"{stem}.mp3").exists():
                continue  # a separate take for this line is already in place
            if a is None or b is None:
                raise SystemExit(f"SPLIT times for {stem} are not set yet (read stt/{src}.wav.json)")
            run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-i", str(SRC / f"{src}.mp3"),
                 "-c:a", "libmp3lame", "-q:a", "0", str(SRC / f"{stem}.mp3")])
            made.add(stem)
            print(f"split {src} {a:.2f}-{b:.2f}s -> {stem}.mp3")
    return made


def check_takes(made):
    """Refuse to build on a take that does not say its Episode 7 line (for example an Episode 6 take
    still sitting in audio/vo): every scripted take needs a transcript in audio/stt (transcribe.sh) that
    scores at least 0.5 against SCRIPT.md with intake_new.score. Parts cut by the split this run are
    trusted, since their times came from the transcript."""
    sys.path.insert(0, str(SRC.parent.parent))  # manthan-ep7, for intake_new.py
    from intake_new import LINES as SCRIPT_LINES, score
    stt = SRC.parent / "stt"
    bad = []
    for stem, line in SCRIPT_LINES.items():
        f = SRC / f"{stem}.mp3"
        if not f.exists():
            bad.append(f"{stem}: no take in audio/vo")
            continue
        if stem in made:
            continue
        js = stt / f"{stem}.wav.json"
        if not js.exists() or js.stat().st_mtime < f.stat().st_mtime:
            bad.append(f"{stem}: transcript missing or older than the take (run manthan-ep7/transcribe.sh)")
            continue
        heard = " ".join(s["text"] for s in json.loads(js.read_text())["transcription"]).strip()
        sc = score(line, heard)
        if sc < 0.5:
            bad.append(f"{stem}: does not say its line (score {sc:.2f}): {heard}")
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
    check_takes(split_sources())
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
        run([
            "ffmpeg", "-v", "error", "-y", "-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-i", str(f),
            "-af", ",".join(chain), "-ar", str(SR), "-ac", "2", str(wav),
        ])
        env = envelope(wav)
        frames = len(env)
        data[f.stem] = {"file": f"jyotiq/manthan/ep7/vo/{wav.name}", "frames": frames, "sec": round(frames / FPS, 3), "env": env}
        src_total += dur
        cut_s = sum(y - x for x, y in cuts)
        print(f"{f.stem:20s} src {dur:5.2f}s  keep {a:5.2f}-{b:5.2f}  pauses cut {cut_s:4.2f}s ({len(cuts)})  -> {frames / FPS:5.2f}s")
    speech = sum(v["sec"] for v in data.values())
    print(f"Episode 7 speech incl. sign-off: {speech:.1f}s (untrimmed files: {src_total:.1f}s)")
    (OUT / "trim.json").write_text(json.dumps(trims))
    body = json.dumps(data, separators=(",", ":"))
    TS.write_text(
        "// Generated by scripts/manthan_ep7_vo_prep.py - do not edit by hand.\n"
        "// Per line: trimmed WAV path, length in frames (30 fps) and a 0..1 mouth envelope per frame.\n"
        "export type VoLine = { file: string; frames: number; sec: number; env: number[] };\n"
        f"export const VO: Record<string, VoLine> = {body};\n"
    )
    print("wrote", TS)


if __name__ == "__main__":
    main()
