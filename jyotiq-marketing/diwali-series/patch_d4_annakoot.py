"""Lift Day 4's Annakoot cooking scene (AnnakootD4) 200 px so the pot clears the 1500 caption, and brighten it.
Each replacement must match exactly once; prints a unified diff. Run once:
/usr/local/bin/python3 /Users/ayushrajput/.kiro/crew/workspace/jyotiq-marketing/diwali-series/patch_d4_annakoot.py
"""
import difflib
from pathlib import Path

F = Path("/Users/ayushrajput/.kiro/crew/workspace/video/src/Jyotiq/diwali/d4/scenesD4c.tsx")
old = F.read_text()
t = old
SWAPS = [
    ('<stop offset="1" stopColor="#4A2A14" />', '<stop offset="1" stopColor="#6A3A1A" />'),
    ('<circle cx={540} cy={1400} r={760} fill="url(#d2Flare)" opacity={0.5} style={{ mixBlendMode: "screen" }} />',
     '<circle cx={540} cy={1250} r={760} fill="url(#d2Flare)" opacity={0.75} style={{ mixBlendMode: "screen" }} />'),
    ('<path d="M0 1640C300 1624 700 1636 1080 1616V1920H0Z" fill="#2A1A0E" />',
     '<path d="M0 1440C300 1424 700 1436 1080 1416V1920H0Z" fill="#2A1A0E" />'),
    ("<g opacity={1 - match}>", '<g opacity={1 - match} transform="translate(0 -200)">'),
    ("const my = 1462 + (1450 - 1462) * match;", "const my = 1262 + (1450 - 1262) * match;"),
    ("y1: 1420 - rnd(`ak6h${i}`) * 110,", "y1: 1220 - rnd(`ak6h${i}`) * 110,"),
]
for a, b in SWAPS:
    n = t.count(a)
    if n != 1:
        raise SystemExit(f"anchor found {n} times, nothing written: {a[:70]}")
    t = t.replace(a, b)
F.write_text(t)
print("".join(difflib.unified_diff(old.splitlines(True), t.splitlines(True), str(F), str(F), n=0)))
