"""Full render of Kumara reel 1: frame-exact segments in ONE process, then concat (stream copy) and mux.

Run from engine/:  nohup "$KIROCREW_SCRATCH/venv/bin/python" render_all.py > "$KIROCREW_SCRATCH/render.log" 2>&1 &
Optional args: segment numbers to force re-render (e.g. `render_all.py 3 5`), used after a fix to one stretch.
A segment with a .done marker is skipped, so a crashed run resumes where it stopped.
"""
import os
import subprocess
import sys
import time

import engine as E
import scenes  # noqa: F401  (registers the scenes)

E.finalize()
FPS = E.FPS
CUTS = [0, 250, 520, 810, 1200, 1545, 1880, 2070]          # frame indices; 2070 frames = 69.0 s
SEG = os.path.join(E.SCR, "seg")
OUT = os.path.join(E.P, "renders", "jyotiq-kumara-ep1-shani-saanwle-v1.mp4")
MIX = os.path.join(E.P, "audio", "out", "mix_final.wav")


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        sys.exit("FAILED: %s\n%s" % (" ".join(cmd[:6]), r.stderr[-1500:]))
    return r.stdout + r.stderr


def main():
    force = {int(a) for a in sys.argv[1:]}
    os.makedirs(SEG, exist_ok=True)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    os.environ.setdefault("CRF", "16")
    os.environ.setdefault("PRESET", "slow")
    os.environ.setdefault("X264_THREADS", "4")
    assert CUTS[-1] == int(round(E.TOTAL * FPS)) or abs(CUTS[-1] / FPS - 69.0) < 1e-6, "cut list does not end at 69.0 s"
    ts = time.time()
    parts = []
    for i, (f0, f1) in enumerate(zip(CUTS, CUTS[1:])):
        path = os.path.join(SEG, "seg%02d.mp4" % i)
        parts.append(path)
        done = path + ".done"
        if os.path.exists(done) and os.path.exists(path) and i not in force:
            print("skip seg%02d (done)" % i, flush=True)
            continue
        if os.path.exists(done):
            os.remove(done)
        print("seg%02d: frames %d-%d (%.3f-%.3f s)" % (i, f0, f1 - 1, f0 / FPS, f1 / FPS), flush=True)
        E.video(f0 / FPS, f1 / FPS, path)
        n = run(["ffprobe", "-v", "error", "-count_packets", "-select_streams", "v:0",
                 "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", path]).strip()
        if int(n) != f1 - f0:
            sys.exit("seg%02d has %s frames, expected %d" % (i, n, f1 - f0))
        open(done, "w").write(n)
        print("seg%02d ok: %s frames, total %.0f s elapsed" % (i, n, time.time() - ts), flush=True)

    lst = os.path.join(SEG, "list.txt")
    with open(lst, "w") as fh:
        fh.writelines("file '%s'\n" % p for p in parts)
    video = os.path.join(SEG, "video.mp4")
    run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", video])
    enc = run(["ffmpeg", "-hide_banner", "-encoders"])
    aac = ["-c:a", "aac_at", "-b:a", "320k"] if " aac_at " in enc else ["-c:a", "aac", "-b:a", "320k"]
    run(["ffmpeg", "-v", "error", "-y", "-i", video, "-i", MIX, "-map", "0:v:0", "-map", "1:a:0",
         "-c:v", "copy"] + aac + ["-ar", "48000", "-ac", "2", "-t", "69.0", "-movflags", "+faststart", OUT])
    print("RENDER_OK %s (%s, %.0f s total)" % (OUT, aac[1], time.time() - ts), flush=True)


if __name__ == "__main__":
    main()
