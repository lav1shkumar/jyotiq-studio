#!/usr/bin/env python3
"""Soundtrack for Ep3 "शनि सूर्य के पास आए... तो साढ़े साती क्यों नहीं होती?": the series'
cosmic drone + wind bed ducked under the Kaal VO, a gong on the hook, a shimmer at every cut,
soft tings as the planet-speed tracker fills in and before "साढ़े साती", a low hit before
"सबसे धीमा", a slow swell (inside the ducked bed) while Saturn approaches the Moon, a water
drop on "मन", and a whoosh into a deep boom as the light becomes the phone, in the VO gap
before "Jyotiq". Levels are set against the voice (bed ~11 dB under speech in the pauses),
then one fixed gain to -14 LUFS with a peak limiter (no riding normaliser: this narrator
pauses a lot, and a dynamic normaliser lifts the bed in every pause).
Output: public/sadesaati3/mix.wav (48 kHz, stereo, 24-bit)."""
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "public" / "sadesaati3"
VO, OUT, PRE = ROOT / "vo.wav", ROOT / "mix.wav", ROOT / "premix.wav"
DUR = 46.75  # = CHA_TOTAL 1122 frames / 24 fps
CUTS = [4.7, 10.85, 16.1, 22.05, 24.8, 27.4, 31.0, 36.7, 40.1]
TINGS = [12.16, 17.31, 19.49, 37.85]  # tracker values pop; the gap before "साढ़े साती"
DHOOM = 20.45  # the gap before "सबसे धीमा"
SWELL = (31.0, 36.6)  # Saturn approaches the Moon
DROP = 29.25  # the drop hits the lake, on "मन"
BOOM = 43.0  # the light becomes the phone (VO gap 42.95-43.42)
SR = 48000
ST = "pan=stereo|c0=c0|c1=c0"


def ms(t):
    return int(round(t * 1000))


n, nt = len(CUTS), len(TINGS)
sw = round(SWELL[1] - SWELL[0], 3)
g = [
    f"[0:a]aresample={SR},{ST},acompressor=threshold=0.1:ratio=3:attack=10:release=180:knee=4,aecho=0.8:0.5:60|120:0.18|0.10,asplit=2[vo][vosc]",
    f"sine=f=55:d={DUR}:sample_rate={SR}[s1]",
    f"sine=f=82.5:d={DUR}:sample_rate={SR},volume=0.6[s2]",
    f"[s1][s2]amix=inputs=2:normalize=0,tremolo=f=0.15:d=0.3,lowpass=f=400,{ST}[drone]",
    f"anoisesrc=d={DUR}:c=pink:r={SR}:a=0.5,bandpass=f=500:width_type=h:w=400,tremolo=f=0.1:d=0.6,{ST}[wind]",
    f"sine=f=49:d={sw}:sample_rate={SR}[w1]",
    f"sine=f=73.5:d={sw}:sample_rate={SR},volume=0.5[w2]",
    f"[w1][w2]amix=inputs=2:normalize=0,afade=t=in:d={sw - 0.6}:curve=qsin,afade=t=out:st={sw - 0.5}:d=0.5,volume=-2dB,{ST},adelay={ms(SWELL[0])}:all=1[swell]",
    f"[drone][wind][swell]amix=inputs=3:normalize=0:duration=first,volume=-20dB,afade=t=in:d=0.5,afade=t=out:st={DUR - 2}:d=2[bed0]",
    "[bed0][vosc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[bed]",
    f"sine=f=110:d=5:sample_rate={SR}[g1]",
    f"sine=f=220.5:d=5:sample_rate={SR},volume=0.5[g2]",
    f"sine=f=331:d=5:sample_rate={SR},volume=0.3[g3]",
    f"[g1][g2][g3]amix=inputs=3:normalize=0,afade=t=in:d=0.01,afade=t=out:st=0:d=5:curve=exp,volume=-14dB,{ST},adelay=50:all=1[gong]",
    f"sine=f=2093:d=1.2:sample_rate={SR}[h1]",
    f"sine=f=3136:d=1.2:sample_rate={SR},volume=0.6[h2]",
    f"[h1][h2]amix=inputs=2:normalize=0,afade=t=in:d=0.15,afade=t=out:st=0.2:d=1.0,volume=-27dB,{ST},asplit={n}"
    + "".join(f"[sh{i}]" for i in range(n)),
    *[f"[sh{i}]adelay={ms(c - 0.1)}:all=1[x{i}]" for i, c in enumerate(CUTS)],
    f"sine=f=2637:d=0.9:sample_rate={SR}[t1]",
    f"sine=f=3951:d=0.9:sample_rate={SR},volume=0.4[t2]",
    f"[t1][t2]amix=inputs=2:normalize=0,afade=t=in:d=0.005,afade=t=out:st=0:d=0.9:curve=exp,volume=-25dB,{ST},asplit={nt}"
    + "".join(f"[tg{i}]" for i in range(nt)),
    *[f"[tg{i}]adelay={ms(c)}:all=1[y{i}]" for i, c in enumerate(TINGS)],
    f"sine=f=52:d=1.8:sample_rate={SR},afade=t=in:d=0.01,afade=t=out:st=0:d=1.8:curve=exp,volume=-10dB,{ST},adelay={ms(DHOOM)}:all=1[dh]",
    f"aevalsrc='0.14*sin(2*PI*(900*t+9000*t*t))*exp(-28*t)':s={SR}:d=0.3,{ST},adelay={ms(DROP)}:all=1[plip]",
    f"anoisesrc=d=1.4:c=pink:r={SR}:a=0.5,bandpass=f=420:width_type=h:w=300,afade=t=in:d=0.04,afade=t=out:st=0.05:d=1.35:curve=exp,volume=-23dB,{ST},adelay={ms(DROP)}:all=1[rip]",
    f"anoisesrc=d=0.9:c=pink:r={SR}:a=0.6,highpass=f=300,afade=t=in:d=0.85:curve=exp,afade=t=out:st=0.85:d=0.05,volume=-15dB,{ST},adelay={ms(BOOM - 0.9)}:all=1[wh]",
    f"sine=f=45:d=2.5:sample_rate={SR},afade=t=in:d=0.005,afade=t=out:st=0:d=2.5:curve=exp,volume=-7dB,{ST},adelay={ms(BOOM)}:all=1[bm]",
    "[vo][bed][gong]"
    + "".join(f"[x{i}]" for i in range(n))
    + "".join(f"[y{i}]" for i in range(nt))
    + f"[dh][plip][rip][wh][bm]amix=inputs={3 + n + nt + 5}:normalize=0:duration=longest,"
    f"apad=whole_dur={DUR},atrim=0:{DUR},aresample={SR}[out]",
]
subprocess.run(
    ["ffmpeg", "-v", "error", "-y", "-i", str(VO), "-filter_complex", ";".join(g), "-map", "[out]", "-c:a", "pcm_f32le", "-ar", str(SR), str(PRE)],
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
    ("speech 12.2-14.3", 12.2, 14.3),
    ("speech 31.2-33.8", 31.2, 33.8),
    ("gap 10.35-11.0", 10.35, 11.0),
    ("gap 33.9-34.1 (swell)", 33.9, 34.1),
    ("drop 29.2-29.6", 29.2, 29.6),
    ("boom gap 42.97-43.4", 42.97, 43.4),
    ("end card 45.2-46.5", 45.2, 46.5),
]:
    print(f"  {label}: {mean_db(a, b)} dB")
