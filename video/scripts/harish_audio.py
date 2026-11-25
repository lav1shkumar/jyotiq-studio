#!/usr/bin/env python3
"""Soundtrack for Ep4 "लोग कहते हैं... शनि देव जी दंड देते हैं।" (Raja Harishchandra, anime).
Ayush asked for no extra sound effects, only relevant ones, so the scene sound is each Flow clip's
OWN ambience (crows over the ghats, the shimmer as the book opens, footsteps and crickets on the
night road, fire at the cremation ghat, doves in the palace, the crow at dawn), cut at 1x from the
source time each shot shows, placed at its cut and ducked under the Kaal VO. Under it sits the
series' low drone, quieter than Ep3, with no gong, shimmers or tings. The only added sound is a
soft whoosh into a low boom as the book's light becomes the phone, in the VO gap before "ज्योतिक़".
Spots that looked vocal in the spectrograms are skipped (s06 t2-3, s07 entirely, s09a after 3.5 s).
Levels: fixed gain to -14 LUFS with a peak limiter (see Ep3: a riding normaliser lifts the bed in
every pause). Output: public/sadesaati4/mix.wav (48 kHz, stereo, 24-bit)."""
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "public" / "sadesaati4"
VO, OUT, PRE = ROOT / "vo.mp3", ROOT / "mix.wav", ROOT / "premix.wav"
DUR = 49.75  # = HAR_TOTAL 1194 frames / 24 fps
BOOM = 46.2  # the phone bezel forms (VO gap 46.17-46.62)
SR = 48000
ST = "pan=stereo|c0=c0|c1=c0"

# (clip, source start, reel start, duration, gain dB, extra filter). Gains bring each clip to ~-30 LUFS
# from its measured level (s01 -27.2, s02 -31.4, s04 -37.3, s05 -33.2, s06 -35.8, s08 -34.8,
# s09a -27.4, s09b -37.0, s10 -32.7, s11 -28.7).
SEGS = [
    ("s01_hook_saturn", 0.0, 0.0, 1.81, -2.8, ""),  # S1a: dusk ghats, water
    ("s01_hook_saturn", 5.3, 1.66, 2.21, -2.8, ""),  # S1b: crows over the worried pilgrims
    ("s02_manuscript_open", 0.25, 3.72, 9.45, 1.4, ""),  # S2 + fallback S3a: the book opens, the palace rises
    ("s09b_royal_reunion", 0.2, 13.02, 2.23, 1.0, ",lowpass=f=1200"),  # fallback S3b: the family as a muffled memory
    ("s04_wanderer", 3.9, 15.1, 4.15, 7.3, ""),  # S4: footsteps, then the night sky
    ("s05_queen_arrives", 1.0, 19.1, 4.35, 1.2, ""),  # S5: fire at the ghat
    ("s06_keeper_fee", 4.0, 23.3, 4.75, 3.8, ""),  # S6, and its fire carries on under S7 (s07 muted)
    ("s08_cloth_duty", 2.4, 27.9, 7.05, 2.8, ""),  # S8: fire, the handoff
    ("s09a_family_light", 0.9, 34.8, 2.6, -2.6, ""),  # S9a: the light (stops before the vocal-like spot)
    ("s09b_royal_reunion", 5.4, 37.4, 2.15, 7.0, ""),  # S9b: doves rise
    ("s10_dawn_ghats", 3.2, 39.4, 4.55, -3.3, ""),  # S10: dawn water, the crow's caw in the gap after line 10
    ("s11_manuscript_phone", 4.6, 43.8, 5.4, -1.3, ""),  # S11: the book's glow, under the end card
]


def ms(t):
    return int(round(t * 1000))


inputs = ["-i", str(VO)]
for clip, src, _, d, _, _ in SEGS:
    inputs += ["-ss", f"{src:.3f}", "-t", f"{d:.3f}", "-i", str(ROOT / f"{clip}.mp4")]

g = [
    f"[0:a]aresample={SR},{ST},acompressor=threshold=0.1:ratio=3:attack=10:release=180:knee=4,aecho=0.8:0.5:60|120:0.18|0.10,asplit=2[vo][vosc]",
    f"sine=f=55:d={DUR}:sample_rate={SR}[s1]",
    f"sine=f=82.5:d={DUR}:sample_rate={SR},volume=0.6[s2]",
    f"[s1][s2]amix=inputs=2:normalize=0,tremolo=f=0.15:d=0.3,lowpass=f=400,{ST}[drone]",
    f"anoisesrc=d={DUR}:c=pink:r={SR}:a=0.5,bandpass=f=500:width_type=h:w=400,tremolo=f=0.1:d=0.6,{ST}[wind]",
    f"[drone][wind]amix=inputs=2:normalize=0:duration=first,volume=-24dB,afade=t=in:d=0.5[bed0]",
]
for k, (clip, src, at, d, gain, extra) in enumerate(SEGS, start=1):
    g.append(
        f"[{k}:a]aformat=channel_layouts=stereo,aresample={SR},highpass=f=80,lowpass=f=14000{extra},"
        f"volume={gain}dB,afade=t=in:d=0.12,afade=t=out:st={max(0.0, d - 0.3):.3f}:d=0.3,adelay={ms(at)}:all=1[a{k}]"
    )
n = len(SEGS)
g += [
    "".join(f"[a{k}]" for k in range(1, n + 1)) + f"amix=inputs={n}:normalize=0:duration=longest,apad=whole_dur={DUR},atrim=0:{DUR},volume=-3dB[amb]",
    f"[amb][bed0]amix=inputs=2:normalize=0:duration=first,afade=t=out:st={DUR - 1.6}:d=1.5[bus0]",
    "[bus0][vosc]sidechaincompress=threshold=0.03:ratio=4:attack=20:release=400[bus]",
    f"anoisesrc=d=0.6:c=pink:r={SR}:a=0.6,highpass=f=300,afade=t=in:d=0.55:curve=exp,afade=t=out:st=0.55:d=0.05,volume=-19dB,{ST},adelay={ms(BOOM - 0.6)}:all=1[wh]",
    f"sine=f=45:d=2.2:sample_rate={SR},afade=t=in:d=0.005,afade=t=out:st=0:d=2.2:curve=exp,volume=-11dB,{ST},adelay={ms(BOOM)}:all=1[bm]",
    f"[vo][bus][wh][bm]amix=inputs=4:normalize=0:duration=longest,apad=whole_dur={DUR},atrim=0:{DUR},aresample={SR}[out]",
]
subprocess.run(
    ["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(g), "-map", "[out]", "-c:a", "pcm_f32le", "-ar", str(SR), str(PRE)],
    check=True,
)


def measure(path):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(path), "-af", "loudnorm=print_format=summary", "-f", "null", "-"], capture_output=True, text=True).stderr
    get = lambda k: float(re.search(rf"Input {k}:\s+([-+]?[0-9.]+)", r).group(1))
    return get("Integrated"), get("True Peak"), get("LRA")


i0, _, _ = measure(PRE)
gain = -14.0 - i0
for _ in range(3):
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-i", str(PRE), "-af", f"volume={gain:.2f}dB,alimiter=limit=0.79:attack=4:release=60:level=false,aresample={SR}",
         "-c:a", "pcm_s24le", "-ar", str(SR), str(OUT)],
        check=True,
    )
    i1, tp1, lra1 = measure(OUT)
    if abs(i1 + 14.0) <= 0.2:
        break
    gain += -14.0 - i1
PRE.unlink()
print(f"wrote {OUT}: {DUR}s, {i1} LUFS, {tp1} dBTP, LRA {lra1} (gain {gain:+.2f} dB)")


def mean_db(a, b):
    out = subprocess.run(["ffmpeg", "-hide_banner", "-ss", str(a), "-t", str(b - a), "-i", str(OUT), "-af", "volumedetect", "-f", "null", "-"], capture_output=True, text=True).stderr
    m = re.search(r"mean_volume:\s+(-?[0-9.]+)", out)
    return m and m.group(1)


for label, a, b in [
    ("speech 9.45-10.95", 9.45, 10.95),
    ("speech 31.3-34.4", 31.3, 34.4),
    ("gap 3.62-4.42 (hook, crows)", 3.62, 4.42),
    ("gap 14.6-15.35 (memory -> road)", 14.6, 15.35),
    ("gap 22.76-23.5 (fire)", 22.76, 23.5),
    ("gap 43.06-44.0 (dawn, crow)", 43.06, 44.0),
    ("boom gap 46.18-46.6", 46.18, 46.6),
    ("end card 48.3-49.5", 48.3, 49.5),
]:
    print(f"  {label}: {mean_db(a, b)} dB")
