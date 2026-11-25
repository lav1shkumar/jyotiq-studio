#!/usr/bin/env python3
"""Soundtrack for "तुलसी विवाह की कथा" (copy of charan_audio.py for Ep2 "साढ़े साती के 3 चरण"), plus the Jyotiq brand-open sonic at 0 s.
Original note: soundtrack for Ep2: a cosmic drone + wind bed ducked under the
Kaal VO, a gong on the hook, a soft shimmer at every cut, and a whoosh into a deep boom as
the book becomes the phone. One ffmpeg graph, normalised to -14 LUFS / -1.5 dBTP.
Output: public/sadesaati-charan/mix.wav (48 kHz, stereo, 24-bit)."""
import re
import subprocess
from pathlib import Path

PUB = Path(__file__).resolve().parents[1] / "public"
ROOT = PUB / "tulsivivah"
VO, OUT = ROOT / "vo.mp3", ROOT / "mix.wav"
SONIC = PUB / "jyotiq" / "brandopen" / "sonic.wav"
DUR = 1939 / 24  # = TV_TOTAL
CUTS = [12.25, 14.95, 25.5, 27.62, 32.15, 36.45, 39.45, 50.95, 58.4, 65.2]
BOOM = (654 + 1183) / 24  # the light becomes the phone (Ep1 frame 654 + END_OFF)
SR = 48000
ST = "pan=stereo|c0=c0|c1=c0"


def ms(t):
    return int(round(t * 1000))


n = len(CUTS)
g = [
    f"[0:a]aresample={SR},{ST},aecho=0.8:0.5:60|120:0.18|0.10,asplit=2[vo][vosc]",
    f"sine=f=55:d={DUR}:sample_rate={SR}[s1]",
    f"sine=f=82.5:d={DUR}:sample_rate={SR},volume=0.6[s2]",
    f"[s1][s2]amix=inputs=2:normalize=0,tremolo=f=0.15:d=0.3,lowpass=f=400,{ST}[drone]",
    f"anoisesrc=d={DUR}:c=pink:r={SR}:a=0.5,bandpass=f=500:width_type=h:w=400,tremolo=f=0.1:d=0.6,{ST}[wind]",
    f"[drone][wind]amix=inputs=2:normalize=0,volume=-14dB,afade=t=in:d=0.5,afade=t=out:st={DUR - 2}:d=2[bed0]",
    "[bed0][vosc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[bed]",
    f"sine=f=110:d=5:sample_rate={SR}[g1]",
    f"sine=f=220.5:d=5:sample_rate={SR},volume=0.5[g2]",
    f"sine=f=331:d=5:sample_rate={SR},volume=0.3[g3]",
    f"[g1][g2][g3]amix=inputs=3:normalize=0,afade=t=in:d=0.01,afade=t=out:st=0:d=5:curve=exp,volume=-10dB,{ST},adelay=4800:all=1[gong]",
    f"sine=f=2093:d=1.2:sample_rate={SR}[h1]",
    f"sine=f=3136:d=1.2:sample_rate={SR},volume=0.6[h2]",
    f"[h1][h2]amix=inputs=2:normalize=0,afade=t=in:d=0.15,afade=t=out:st=0.2:d=1.0,volume=-24dB,{ST},asplit={n}"
    + "".join(f"[sh{i}]" for i in range(n)),
    *[f"[sh{i}]adelay={ms(c - 0.1)}:all=1[x{i}]" for i, c in enumerate(CUTS)],
    f"anoisesrc=d=0.9:c=pink:r={SR}:a=0.6,highpass=f=300,afade=t=in:d=0.85:curve=exp,afade=t=out:st=0.85:d=0.05,volume=-12dB,{ST},adelay={ms(BOOM - 0.9)}:all=1[wh]",
    f"sine=f=45:d=2.5:sample_rate={SR},afade=t=in:d=0.005,afade=t=out:st=0:d=2.5:curve=exp,{ST},adelay={ms(BOOM)}:all=1[bm]",
    f"[1:a]aresample={SR},volume=-4dB[son];" + "[vo][bed][gong][son]" + "".join(f"[x{i}]" for i in range(n)) + f"[wh][bm]amix=inputs={n + 6}:normalize=0:duration=longest,"
    f"apad=whole_dur={DUR},atrim=0:{DUR},loudnorm=I=-14:TP=-1.5:LRA=11,aresample={SR}[out]",
]
subprocess.run(
    ["ffmpeg", "-v", "error", "-y", "-i", str(VO), "-i", str(SONIC), "-filter_complex", ";".join(g), "-map", "[out]", "-c:a", "pcm_s24le", "-ar", str(SR), str(OUT)],
    check=True,
)
r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(OUT), "-af", "loudnorm=print_format=summary", "-f", "null", "-"], capture_output=True, text=True).stderr
i = re.search(r"Input Integrated:\s+(-?[0-9.]+)", r)
tp = re.search(r"Input True Peak:\s+([-+]?[0-9.]+)", r)
print(f"wrote {OUT}: {DUR}s, {i and i.group(1)} LUFS, {tp and tp.group(1)} dBTP")
