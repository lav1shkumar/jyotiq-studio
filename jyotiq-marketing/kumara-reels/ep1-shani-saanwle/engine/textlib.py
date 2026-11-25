"""Text rendering for the reel engine: calls the CoreText `textr` tool and caches the results.

render(runs, font, size, track) -> (RGBA image, metrics)
  runs    list of (hex colour, text) pairs drawn on one line
  font    key of FONTS
  size    font size in px at 1080 x 1920
  track   extra letter spacing in px
metrics: w, h, ox (pen x of the line start), by (baseline y from the image top), adv (advance width).
"""
import hashlib
import json
import os
import subprocess

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SCRATCH = os.environ["KIROCREW_SCRATCH"]
TEXTR = os.path.join(SCRATCH, "textr")
CACHE = os.path.join(SCRATCH, "textcache")

FONTS = {
    "title": "RozhaOne-Regular.ttf",
    "reg": "Mukta-Regular.ttf",
    "med": "Mukta-Medium.ttf",
    "semi": "Mukta-SemiBold.ttf",
    "bold": "Mukta-Bold.ttf",
    "xbold": "Mukta-ExtraBold.ttf",
    "latin": "Poppins-Regular.ttf",
    "latinmed": "Poppins-Medium.ttf",
    "latinsemi": "Poppins-SemiBold.ttf",
}

_mem = {}


def render(runs, font, size, track=0.0):
    spec = {
        "font": os.path.join(HERE, "fonts", FONTS[font]),
        "size": round(float(size), 2),
        "track": round(float(track), 2),
        "pad": max(4, int(size * 0.25)),
        "runs": [{"t": t, "c": c.lstrip("#")} for c, t in runs],
    }
    key = hashlib.sha1(json.dumps(spec, ensure_ascii=False, sort_keys=True).encode()).hexdigest()[:20]
    hit = _mem.get(key)
    if hit:
        return hit
    os.makedirs(CACHE, exist_ok=True)
    png = os.path.join(CACHE, key + ".png")
    meta = os.path.join(CACHE, key + ".json")
    if not (os.path.exists(png) and os.path.exists(meta)):
        spec["out"] = png
        res = subprocess.run([TEXTR, json.dumps(spec, ensure_ascii=False)],
                             capture_output=True, text=True, check=True)
        with open(meta, "w") as f:
            f.write(res.stdout)
    with open(meta) as f:
        m = json.load(f)
    im = Image.open(png).convert("RGBA")
    im.load()
    _mem[key] = (im, m)
    return im, m
