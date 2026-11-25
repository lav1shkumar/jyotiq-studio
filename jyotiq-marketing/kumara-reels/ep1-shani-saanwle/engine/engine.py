"""Frame engine for the Jyotiq Kumara reels: 1080x1920 at 30 fps, composited with PIL.

Library only. scenes.py registers scenes with @scene and sets the captions; render.py is the command line.
Scene times come from timings.json through LS/LE/SEG, so the edit follows the audio if a line is swapped.
"""
import json
import math
import os
import subprocess
import sys
import time
from functools import lru_cache

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

from textlib import render as _render_text

HERE = os.path.dirname(os.path.abspath(__file__))
P = os.path.dirname(HERE)
CUT = os.path.join(P, "assets", "cut")
SRC = os.path.join(P, "assets", "src")
SCR = os.environ["KIROCREW_SCRATCH"]
W, H = 1080, 1920
FPS = int(os.environ.get("FPS", "30"))

# ------------------------------------------------------------------ palette
C = dict(dark="#17142B", paper="#EFE6D3", ink="#1B1A2E", ivory="#F3ECDD", surya="#E2A83A", surya_lt="#F6D27A",
         chhaya="#7A6A9E", chhaya_lt="#B3A6DA", shani="#34406B", shani_lt="#8E9BD0", gold="#C9A35A",
         gold_lt="#E8CF8E", muted="#8C8577", red="#B8463A")
SPEAKERS = {
    "sanaka": dict(hi="सनक", en="SANAKA", dark="#E8893A", paper="#B85E1C"),
    "sanandana": dict(hi="सनन्दन", en="SANANDANA", dark="#D9B44A", paper="#9A7A16"),
    "sanatana": dict(hi="सनातन", en="SANATANA", dark="#7FB3DE", paper="#2F6E9E"),
    "sanatkumara": dict(hi="सनत्कुमार", en="SANATKUMARA", dark="#E58FAE", paper="#B8466F"),
}
LIGHT_MODES = ("paper", "sky")


def rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def textcol(mode):
    return C["ink"] if mode in LIGHT_MODES else C["ivory"]


def spkcol(spk, mode):
    return SPEAKERS[spk]["paper" if mode in LIGHT_MODES else "dark"]


# ------------------------------------------------------------------ easing
def clamp(x, a=0.0, b=1.0):
    return a if x < a else b if x > b else x


def lerp(a, b, k):
    return a + (b - a) * k


def p(t, t0, d):
    return clamp((t - t0) / d) if d > 0 else float(t >= t0)


def eo(k):
    return 1 - (1 - k) ** 3


def ei(k):
    return k ** 3


def eio(k):
    return 4 * k ** 3 if k < 0.5 else 1 - (-2 * k + 2) ** 3 / 2


def eob(k, s=1.70158):
    k -= 1
    return 1 + (s + 1) * k ** 3 + s * k ** 2


def win(t, t0, t1, fin=0.2, fout=0.2):
    """1 inside [t0, t1] with fades at both ends."""
    return max(0.0, min(p(t, t0, fin), 1 - p(t, t1 - fout, fout)))


def wobble(t, amp=1.0, f=0.35, ph=0.0):
    return amp * math.sin(2 * math.pi * f * t + ph)


# ------------------------------------------------------------------ timings
with open(os.path.join(HERE, "timings.json")) as _f:
    TIM = json.load(_f)
LINES = {L["id"]: L for L in TIM["lines"]}
TOTAL = TIM["total"]


def LS(lid):
    return LINES[lid]["start"]


def LE(lid):
    return LINES[lid]["end"]


def SEG(lid, i, end=False):
    s = LINES[lid]["segments"][i]
    return s[1] if end else s[0]


def line_at(t, pad=0.06):
    for L in TIM["lines"]:
        if L["start"] - pad <= t <= L["end"] + pad:
            return L
    return None


_env = None


def env(t):
    """Voice loudness 0..1 at time t (60 Hz envelope of vo_raw.wav), used for the speaker's voice bars."""
    global _env
    if _env is None:
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", os.path.join(P, "audio", "out", "vo_raw.wav"),
                              "-ac", "1", "-ar", "48000", "-f", "f32le", "-"], capture_output=True, check=True).stdout
        x = np.frombuffer(raw, np.float32)
        hop = 800
        n = len(x) // hop
        db = 10 * np.log10((x[:n * hop].reshape(n, hop) ** 2).mean(1) + 1e-12)
        _env = np.clip((db + 45) / 30, 0, 1)
    i = int(t * 60)
    return float(_env[i]) if 0 <= i < len(_env) else 0.0


# ------------------------------------------------------------------ images
_img = {}
_rs = {}
_rs_bytes = [0]
RS_BUDGET = 250 * 1024 * 1024     # animated scales make a new entry per frame; cap the cache by size, not count


def img(name):
    """RGBA asset: a name in assets/cut (no extension), a derived key, or an absolute path."""
    im = _img.get(name)
    if im is None:
        path = name if os.path.isabs(name) else os.path.join(CUT, name + ".png")
        im = Image.open(path).convert("RGBA")
        im.load()
        _img[name] = im
    return im


def derive(key, fn):
    if key not in _img:
        _img[key] = fn()
    return key


def resized(name, w, h, flip=False):
    key = (name, w, h, flip)
    im = _rs.get(key)
    if im is None:
        if len(_rs) > 500 or _rs_bytes[0] > RS_BUDGET:
            _rs.clear()
            _rs_bytes[0] = 0
        src = img(name)
        im = src.resize((w, h), Image.LANCZOS if w * h <= src.width * src.height else Image.BICUBIC)
        if flip:
            im = im.transpose(Image.FLIP_LEFT_RIGHT)
        _rs[key] = im
        _rs_bytes[0] += w * h * 4
    return im


_luts = {}


def with_alpha(im, a):
    if a >= 0.998:
        return im
    q = max(0, min(255, int(a * 255)))
    lut = _luts.get(q)
    if lut is None:
        lut = _luts[q] = [v * q // 255 for v in range(256)]
    out = im.copy()
    out.putalpha(im.getchannel("A").point(lut))
    return out


def comp(fr, im, x, y):
    """Alpha-composite im onto fr with its top-left at (x, y), clipped to the frame."""
    x, y = int(round(x)), int(round(y))
    if x >= W or y >= H or x + im.width <= 0 or y + im.height <= 0:
        return
    cx0, cy0 = max(0, -x), max(0, -y)
    cx1, cy1 = min(im.width, W - x), min(im.height, H - y)
    if cx0 or cy0 or cx1 < im.width or cy1 < im.height:
        im = im.crop((cx0, cy0, cx1, cy1))
    fr.alpha_composite(im, (x + cx0, y + cy0))


def tinted(name, dark, light, gamma=1.0, keep=0.0):
    """Luminance mapped onto a dark->light colour ramp, alpha kept. keep blends some original colour back."""
    def make():
        a = np.asarray(img(name)).astype(np.float32)
        lum = (a[..., :3] @ np.array([0.299, 0.587, 0.114], np.float32)) / 255.0
        lum = lum ** gamma
        d, l = np.array(rgb(dark), np.float32), np.array(rgb(light), np.float32)
        col = d * (1 - lum[..., None]) + l * lum[..., None]
        col = col * (1 - keep) + a[..., :3] * keep
        return Image.fromarray(np.dstack([np.clip(col, 0, 255), a[..., 3:]]).astype(np.uint8), "RGBA")
    return derive(f"{name}@{dark}-{light}-{gamma}-{keep}", make)


def silhouette(name, colour):
    def make():
        a = img(name)
        out = Image.new("RGBA", a.size, rgb(colour) + (0,))
        out.putalpha(a.getchannel("A"))
        return out
    return derive(f"{name}#sil{colour}", make)


def _shadow_key(name):
    def make():
        a = img(name)
        r = max(2, int(0.014 * max(a.size)))
        pad = 3 * r
        al = Image.new("L", (a.width + 2 * pad, a.height + 2 * pad), 0)
        al.paste(a.getchannel("A"), (pad, pad))
        al = al.filter(ImageFilter.GaussianBlur(r)).point(lambda v: int(v * 0.6))
        out = Image.new("RGBA", al.size, (8, 6, 18, 0))
        out.putalpha(al)
        out.info["pad"] = pad
        return out
    return derive(name + "#sh", make)


def place(fr, name, x, y, h=None, w=None, a=1.0, anchor="c", rot=0.0, flip=False, shadow=0.0, sx=1.0, sy=1.0):
    """Draw asset `name` scaled to height h (or width w) with its anchor at (x, y).
    anchor: c centre, b bottom-centre, t top-centre, l left-middle, r right-middle."""
    if a <= 0.004:
        return None
    src = img(name)
    if h is None and w is None:
        w, h = src.width, src.height
    elif h is None:
        h = w * src.height / src.width
    elif w is None:
        w = h * src.width / src.height
    w, h = w * sx, h * sy
    iw, ih = int(round(w)), int(round(h))
    if iw < 2 or ih < 2:
        return None
    ax = {"c": 0.5, "b": 0.5, "t": 0.5, "l": 0.0, "r": 1.0}[anchor]
    ay = {"c": 0.5, "b": 1.0, "t": 0.0, "l": 0.5, "r": 0.5}[anchor]
    cx, cy = x + (0.5 - ax) * iw, y + (0.5 - ay) * ih          # centre of the drawn image
    if shadow > 0:
        sk = _shadow_key(name)
        sh = img(sk)
        pad = sh.width - src.width
        sw, shh = int(round(iw * sh.width / src.width)), int(round(ih * sh.height / src.height))
        sim = resized(sk, max(2, sw), max(2, shh), flip)
        if rot:
            sim = sim.rotate(rot, Image.BICUBIC, expand=True)
        comp(fr, with_alpha(sim, shadow * a), cx - sim.width / 2, cy - sim.height / 2 + 0.022 * ih)
    im = resized(name, iw, ih, flip)
    if rot:
        im = im.rotate(rot, Image.BICUBIC, expand=True)
    comp(fr, with_alpha(im, a), cx - im.width / 2, cy - im.height / 2)
    return (cx - iw / 2, cy - ih / 2, iw, ih)


# ------------------------------------------------------------------ text
def text(fr, runs, font, size, x, y, ha="c", a=1.0, track=0.0, scale=1.0, shadow=0.0):
    """Draw coloured runs [(hex, text), ...] with the baseline at y. ha: l, c or r."""
    if a <= 0.004:
        return 0.0
    im, m = _render_text(runs, font, size, track)
    sh = _text_shadow(im) if shadow > 0 else None
    if scale != 1.0:
        sz = (max(1, int(im.width * scale)), max(1, int(im.height * scale)))
        im = im.resize(sz, Image.BICUBIC)
        if sh is not None:
            sh = sh.resize(sz, Image.BICUBIC)
    adv, ox, by = m["adv"] * scale, m["ox"] * scale, m["by"] * scale
    x0 = x - ox - (adv / 2 if ha == "c" else adv if ha == "r" else 0)
    y0 = y - by
    if sh is not None:
        comp(fr, with_alpha(sh, shadow * a), x0, y0 + max(2, size * 0.05))
    comp(fr, with_alpha(im, a), x0, y0)
    return adv


def text_w(runs, font, size, track=0.0):
    return _render_text(runs, font, size, track)[1]["adv"]


_tsh = {}


def _text_shadow(im):
    k = id(im)
    hit = _tsh.get(k)
    if hit is not None and hit[0] is im:          # the entry holds im, so its id cannot be reused meanwhile
        return hit[1]
    if len(_tsh) > 300:
        _tsh.clear()
    pad = 6
    al = Image.new("L", (im.width + 2 * pad, im.height + 2 * pad), 0)
    al.paste(im.getchannel("A"), (pad, pad))
    al = al.filter(ImageFilter.GaussianBlur(4)).crop((pad, pad, pad + im.width, pad + im.height))
    s = Image.new("RGBA", im.size, (5, 4, 12, 0))
    s.putalpha(al)
    _tsh[k] = (im, s)
    return s


def wrap2(txt, font, size, maxw, track=0.0):
    """One line if it fits, else the two-line split with the narrowest longest line."""
    if text_w([("000000", txt)], font, size, track) <= maxw:
        return [txt]
    words = txt.split(" ")
    best, best_w = [txt], 1e9
    for i in range(1, len(words)):
        a, b = " ".join(words[:i]), " ".join(words[i:])
        wmax = max(text_w([("000000", a)], font, size, track), text_w([("000000", b)], font, size, track))
        if wmax < best_w:
            best, best_w = [a, b], wmax
    return best


# ------------------------------------------------------------------ vector shapes (anti-aliased via distance fields)
def _bbox(x0, y0, x1, y1):
    return max(0, int(math.floor(x0))), max(0, int(math.floor(y0))), min(W, int(math.ceil(x1))), min(H, int(math.ceil(y1)))


def _patch(fr, colour, al, x0, y0):
    a8 = (np.clip(al, 0, 1) * 255).astype(np.uint8)
    im = Image.new("RGBA", (a8.shape[1], a8.shape[0]), (rgb(colour) if isinstance(colour, str) else colour) + (0,))
    im.putalpha(Image.fromarray(a8, "L"))
    fr.alpha_composite(im, (x0, y0))


def disc(fr, cx, cy, r, colour, a=1.0, soft=1.0):
    x0, y0, x1, y1 = _bbox(cx - r - 2 - soft, cy - r - 2 - soft, cx + r + 3 + soft, cy + r + 3 + soft)
    if x1 <= x0 or y1 <= y0 or a <= 0.004 or r <= 0:
        return
    ys, xs = np.mgrid[y0:y1, x0:x1].astype(np.float32)
    d = np.sqrt((xs + 0.5 - cx) ** 2 + (ys + 0.5 - cy) ** 2)
    _patch(fr, colour, np.clip((r - d) / soft + 0.5, 0, 1) * a, x0, y0)


def ellipse(fr, cx, cy, rx, ry, colour, a=1.0, soft=1.5):
    x0, y0, x1, y1 = _bbox(cx - rx - 3 - soft, cy - ry - 3 - soft, cx + rx + 4 + soft, cy + ry + 4 + soft)
    if x1 <= x0 or y1 <= y0 or a <= 0.004:
        return
    ys, xs = np.mgrid[y0:y1, x0:x1].astype(np.float32)
    q = np.sqrt(((xs + 0.5 - cx) / rx) ** 2 + ((ys + 0.5 - cy) / ry) ** 2)
    _patch(fr, colour, np.clip(0.5 - (q - 1) * min(rx, ry) / soft, 0, 1) * a, x0, y0)


def ring(fr, cx, cy, r, width, colour, a=1.0, frac=1.0, start=-90.0, soft=1.0):
    """Circle outline; frac < 1 draws a clockwise arc from angle `start` (degrees, -90 = top)."""
    o = r + width / 2 + 2
    x0, y0, x1, y1 = _bbox(cx - o, cy - o, cx + o + 1, cy + o + 1)
    if x1 <= x0 or y1 <= y0 or a <= 0.004 or frac <= 0:
        return
    ys, xs = np.mgrid[y0:y1, x0:x1].astype(np.float32)
    dx, dy = xs + 0.5 - cx, ys + 0.5 - cy
    al = np.clip((width / 2 - np.abs(np.sqrt(dx * dx + dy * dy) - r)) / soft + 0.5, 0, 1)
    if frac < 1:
        ang = (np.degrees(np.arctan2(dy, dx)) - start) % 360
        al = al * np.clip((frac * 360 - ang) / 2 + 0.5, 0, 1)
    _patch(fr, colour, al * a, x0, y0)


def line(fr, xa, ya, xb, yb, width, colour, a=1.0, soft=1.0):
    o = width / 2 + 2
    x0, y0, x1, y1 = _bbox(min(xa, xb) - o, min(ya, yb) - o, max(xa, xb) + o + 1, max(ya, yb) + o + 1)
    if x1 <= x0 or y1 <= y0 or a <= 0.004:
        return
    ys, xs = np.mgrid[y0:y1, x0:x1].astype(np.float32)
    px, py = xs + 0.5 - xa, ys + 0.5 - ya
    vx, vy = xb - xa, yb - ya
    L2 = vx * vx + vy * vy
    k = np.clip((px * vx + py * vy) / L2, 0, 1) if L2 > 0 else 0
    d = np.sqrt((px - k * vx) ** 2 + (py - k * vy) ** 2)
    _patch(fr, colour, np.clip((width / 2 - d) / soft + 0.5, 0, 1) * a, x0, y0)


def rect(fr, x0, y0, x1, y1, colour, a=1.0):
    bx0, by0, bx1, by1 = _bbox(x0, y0, x1, y1)
    if bx1 <= bx0 or by1 <= by0 or a <= 0.004:
        return
    im = Image.new("RGBA", (bx1 - bx0, by1 - by0), rgb(colour) + (int(255 * clamp(a)),))
    fr.alpha_composite(im, (bx0, by0))


def rrect(fr, x0, y0, x1, y1, r, colour, a=1.0):
    """Rounded rectangle (pill when r = half the height)."""
    bx0, by0, bx1, by1 = _bbox(x0 - 1, y0 - 1, x1 + 2, y1 + 2)
    if bx1 <= bx0 or by1 <= by0 or a <= 0.004:
        return
    ys, xs = np.mgrid[by0:by1, bx0:bx1].astype(np.float32)
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    hx, hy = (x1 - x0) / 2 - r, (y1 - y0) / 2 - r
    qx, qy = np.abs(xs + 0.5 - cx) - hx, np.abs(ys + 0.5 - cy) - hy
    d = np.sqrt(np.maximum(qx, 0) ** 2 + np.maximum(qy, 0) ** 2) + np.minimum(np.maximum(qx, qy), 0) - r
    _patch(fr, colour, np.clip(0.5 - d, 0, 1) * a, bx0, by0)


@lru_cache(maxsize=48)
def _glow_sprite(colour, size, hard):
    y, x = np.mgrid[0:size, 0:size].astype(np.float32)
    c = (size - 1) / 2
    d = np.sqrt((x - c) ** 2 + (y - c) ** 2) / (size / 2)
    al = np.exp(-(d ** 2) * hard) * np.clip(1 - d, 0, 1) ** 0.5
    im = Image.new("RGBA", (size, size), rgb(colour) + (0,))
    im.putalpha(Image.fromarray((al * 255).astype(np.uint8), "L"))
    return im


def glow(fr, cx, cy, r, colour, a=1.0, hard=3.0):
    size = max(8, int(r * 2) // 8 * 8)
    comp(fr, with_alpha(_glow_sprite(colour, size, hard), a), cx - size / 2, cy - size / 2)


# ------------------------------------------------------------------ backgrounds
_bg = {}


def _vignette(strength, cy=0.45):
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    d = np.sqrt(((xx - W / 2) / (W * 0.78)) ** 2 + ((yy - H * cy) / (H * 0.72)) ** 2)
    return np.clip(1 - strength * d ** 2, 0.5, 1)[..., None]


def bg_dark():
    if "dark" not in _bg:
        y = np.linspace(0, 1, H, dtype=np.float32)[:, None, None]
        top, bot = np.array(rgb("#1E1A3A"), np.float32), np.array(rgb("#0F0C1D"), np.float32)
        base = np.broadcast_to(top * (1 - y) + bot * y, (H, W, 3)) * _vignette(0.32)
        base = base + np.random.default_rng(7).normal(0, 2.0, (H, W, 1)).astype(np.float32)
        _bg["dark"] = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8), "RGB").convert("RGBA")
    return _bg["dark"].copy()


def bg_paper():
    if "paper" not in _bg:
        a = np.asarray(Image.open(os.path.join(CUT, "paper_bg.png")).convert("RGB")).astype(np.float32)
        _bg["paper"] = Image.fromarray(np.clip(a * _vignette(0.13), 0, 255).astype(np.uint8), "RGB").convert("RGBA")
    return _bg["paper"].copy()


def plate(name, zoom=1.0, fx=0.5, fy=0.5, dx=0.0, dy=0.0):
    """Full-frame image (cover fit) zoomed about the source focus point (fx, fy) and shifted by (dx, dy) px.
    The view is clamped inside the source, so a pan or zoom never shows an empty edge."""
    src = img(name)
    s = max(W / src.width, H / src.height) * max(zoom, 1.0)
    hw, hh = W / (2 * s), H / (2 * s)
    csx = clamp(fx * src.width - dx / s, hw, src.width - hw)
    csy = clamp(fy * src.height - dy / s, hh, src.height - hh)
    data = (1 / s, 0, csx - hw, 0, 1 / s, csy - hh)
    return src.transform((W, H), Image.AFFINE, data, Image.BICUBIC)


def plate_pt(name, px, py, zoom=1.0, fx=0.5, fy=0.5, dx=0.0, dy=0.0):
    """Screen position of the source point (px, py) (fractions of the image) for the same plate() arguments."""
    src = img(name)
    s = max(W / src.width, H / src.height) * max(zoom, 1.0)
    hw, hh = W / (2 * s), H / (2 * s)
    csx = clamp(fx * src.width - dx / s, hw, src.width - hw)
    csy = clamp(fy * src.height - dy / s, hh, src.height - hh)
    return (px * src.width - (csx - hw)) * s, (py * src.height - (csy - hh)) * s, s


def background(mode):
    return bg_paper() if mode == "paper" else bg_dark()


# ------------------------------------------------------------------ chrome
HEADER_Y, HEADER_H = 196, 104


@lru_cache(maxsize=1)
def _header_bar():
    bar = Image.new("RGBA", (W, HEADER_H), rgb("#120F24") + (236,))
    d = ImageDraw.Draw(bar)
    d.rectangle((0, HEADER_H - 2, W, HEADER_H), fill=rgb(C["gold"]) + (150,))
    return bar


def header(fr, a=1.0):
    comp(fr, with_alpha(_header_bar(), a), 0, HEADER_Y)
    icon, word = img("logo_icon"), img("logo_word")
    ih, wh, gap = 80, 42, 16
    iw, ww = ih * icon.width / icon.height, wh * word.width / word.height
    x0 = W / 2 - (iw + gap + ww) / 2
    cy = HEADER_Y + (HEADER_H - 2) / 2
    place(fr, "logo_icon", x0 + iw / 2, cy, h=ih, a=a)
    place(fr, "logo_word", x0 + iw + gap + ww / 2, cy + 3, h=wh, a=a)
    for x in (64, W - 64):
        disc(fr, x, cy, 3.2, C["gold"], a * 0.8)


def footer(fr, mode, a=1.0):
    col = textcol(mode)
    y = 1652
    text(fr, [(col, "@jyotiq_")], "latinmed", 22, W / 2, y, ha="c", a=0.62 * a, track=2)
    line(fr, 150, y - 8, 440, y - 8, 1.2, col, a=0.22 * a)
    line(fr, 640, y - 8, 930, y - 8, 1.2, col, a=0.22 * a)


def index_block(fr, idx, mode, a=1.0):
    num, hi, en = idx
    x, y = 1012, 384
    text(fr, [(C["gold"], num)], "title", 52, x, y, ha="r", a=a)
    text(fr, [(textcol(mode), hi)], "semi", 25, x, y + 40, ha="r", a=0.92 * a)
    text(fr, [(textcol(mode), en)], "latinmed", 12.5, x, y + 64, ha="r", a=0.55 * a, track=2.2)


# ------------------------------------------------------------------ captions and speaker chip
CAPS = []                 # (start, end, speaker, text)
CAP_SIZE, CAP_MAXW, CAP_BASE, CAP_LH = 48, 900, 1486, 60
CHIP_GAP = 92


def set_captions(spec):
    """spec: [(line id, first segment, last segment, text)] in order. Captions hand off without gaps."""
    CAPS.clear()
    for i, (lid, s0, s1, txt) in enumerate(spec):
        start = SEG(lid, s0) - 0.06
        nxt = spec[i + 1] if i + 1 < len(spec) else None
        nstart = SEG(nxt[0], nxt[1]) - 0.06 if nxt else 1e9
        end = nstart - 0.02 if nxt and nxt[0] == lid else min(LE(lid) + 0.3, nstart - 0.02)
        CAPS.append((start, end, LINES[lid]["speaker"], txt))


def caption_layer(fr, t, mode, chip_on=True, before=None):
    """before: only draw captions that started before this time (used to fade out a scene's captions)."""
    col = textcol(mode)
    lines_now = 1
    for s, e, spk, txt in CAPS:
        if not (s <= t <= e) or (before is not None and s >= before):
            continue
        k = min(eo(p(t, s, 0.14)), 1 - p(t, e - 0.08, 0.08))
        rows = wrap2(txt, "semi", CAP_SIZE, CAP_MAXW)
        lines_now = len(rows)
        rise = (1 - eo(p(t, s, 0.22))) * 14
        for j, row in enumerate(rows):
            y = CAP_BASE - (len(rows) - 1 - j) * CAP_LH + rise
            text(fr, [(col, row)], "semi", CAP_SIZE, W / 2, y, ha="c", a=k,
                 shadow=0.55 if mode not in LIGHT_MODES else 0.0)
    if chip_on:
        L = line_at(t)
        if L:
            k = win(t, L["start"] - 0.08, L["end"] + 0.12, 0.14, 0.14)
            chip(fr, L["speaker"], mode, k, t, CAP_BASE - (lines_now - 1) * CAP_LH - CHIP_GAP)


def chip(fr, spk, mode, a, t, y):
    if a <= 0.01:
        return
    col = spkcol(spk, mode)
    name = SPEAKERS[spk]["hi"]
    d, gap, bw, bg = 66, 14, 6, 5
    nw = text_w([(col, name)], "bold", 34)
    total = d + gap + nw + gap + 3 * bw + 2 * bg
    x0 = W / 2 - total / 2
    cx = x0 + d / 2
    disc(fr, cx, y, d / 2 + 4, col, a)
    place(fr, "avatar_" + spk, cx, y, h=d, a=a)
    text(fr, [(col, name)], "bold", 34, x0 + d + gap, y + 12, ha="l", a=a,
         shadow=0.5 if mode not in LIGHT_MODES else 0.0)
    e = env(t)
    bx = x0 + d + gap + nw + gap + bw / 2
    for i in range(3):
        ph = 0.5 + 0.5 * math.sin(t * 19 + i * 2.2)
        hh = 6 + 24 * e * (0.5 + 0.5 * ph)
        line(fr, bx + i * (bw + bg), y - hh / 2, bx + i * (bw + bg), y + hh / 2, bw, col, a)


# ------------------------------------------------------------------ scenes, transitions, frames
SCENES = []


def scene(t0, t1, bg="dark", index=None, chip=True, caps=True, header=True, footer=True, tin=None):
    """Register a scene for [t0, t1). tin = (kind, seconds) transition from the previous scene:
    kinds fade, flash, up, down, left, right, zoom, iris."""
    def deco(fn):
        SCENES.append(dict(t0=t0, t1=t1, bg=bg, index=index, chip=chip, caps=caps, header=header,
                           footer=footer, tin=tin, fn=fn, name=fn.__name__))
        return fn
    return deco


def finalize():
    SCENES.sort(key=lambda s: s["t0"])


def scene_at(t):
    idx = 0
    for i, sc in enumerate(SCENES):
        if sc["t0"] <= t:
            idx = i
    return idx


def draw_scene(sc, t):
    fr = background(sc["bg"])
    sc["fn"](fr, t)
    if sc["index"]:
        index_block(fr, sc["index"], sc["bg"], a=eo(p(t, sc["t0"] + 0.08, 0.3)))
    return fr


def transition(a, b, kind, k):
    if kind == "fade":
        return Image.blend(a, b, k)
    if kind == "flash":
        out = Image.blend(a, b, clamp(k * 1.6 - 0.3))
        rect(out, 0, 0, W, H, "#FFF6E0", 0.75 * (1 - abs(2 * k - 1)) ** 1.5)
        return out
    if kind in ("up", "down", "left", "right"):
        e = eio(k)
        out = Image.new("RGBA", (W, H))
        if kind in ("up", "down"):
            o = int(H * e) * (1 if kind == "up" else -1)
            out.paste(a, (0, -o))
            out.paste(b, (0, H - o if kind == "up" else -H - o))
        else:
            o = int(W * e) * (1 if kind == "left" else -1)
            out.paste(a, (-o, 0))
            out.paste(b, (W - o if kind == "left" else -W - o, 0))
        return out
    if kind == "zoom":
        s = 1 + 0.18 * eio(k)
        za = a.resize((int(W * s), int(H * s)), Image.BILINEAR).crop(
            (int((W * s - W) / 2), int((H * s - H) / 2), int((W * s - W) / 2) + W, int((H * s - H) / 2) + H))
        return Image.blend(za, b, eio(k))
    if kind == "iris":
        r = eio(k) * math.hypot(W, H) / 2
        mask = Image.new("L", (W, H), 0)
        ImageDraw.Draw(mask).ellipse((W / 2 - r, H * 0.45 - r, W / 2 + r, H * 0.45 + r), fill=255)
        mask = mask.filter(ImageFilter.GaussianBlur(18))
        return Image.composite(b, a, mask)
    return b


def frame(t):
    i = scene_at(t)
    sc = SCENES[i]
    fr = draw_scene(sc, t)
    prev, keep = None, 0.0
    if sc["tin"] and i > 0:
        kind, d = sc["tin"]
        if t < sc["t0"] + d:
            k = clamp((t - sc["t0"]) / d)
            prev, keep = SCENES[i - 1], 1 - k
            fr = transition(draw_scene(prev, t), fr, kind, k)
    mode = sc["bg"]
    if sc["caps"]:
        caption_layer(fr, t, mode, sc["chip"])
    elif prev and prev["caps"] and keep > 0.004:
        # the outgoing scene's captions and chip fade with the transition instead of cutting
        ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        caption_layer(ov, t, prev["bg"], prev["chip"], before=sc["t0"])
        comp(fr, with_alpha(ov, keep), 0, 0)
    if sc["header"]:
        header(fr)
    elif prev and prev["header"] and keep > 0.004:
        header(fr, a=keep)
    if sc["footer"]:
        footer(fr, mode)
    return fr.convert("RGB")


# ------------------------------------------------------------------ outputs
def still(times):
    os.makedirs(os.path.join(SCR, "stills"), exist_ok=True)
    for t in times:
        path = os.path.join(SCR, "stills", f"t{t:06.2f}.png")
        frame(t).save(path)
        print("wrote", path)


def sheet(t0, t1, step, cols=6, tag=None):
    from PIL import ImageFont
    times = list(np.arange(t0, t1 + 1e-6, step))
    tw, th = 270, 480
    rows = (len(times) + cols - 1) // cols
    out = Image.new("RGB", (cols * tw, rows * (th + 22)), (40, 40, 40))
    d = ImageDraw.Draw(out)
    font = ImageFont.load_default()
    ts = time.time()
    for i, t in enumerate(times):
        im = frame(float(t)).resize((tw, th), Image.LANCZOS)
        x, y = (i % cols) * tw, (i // cols) * (th + 22)
        out.paste(im, (x, y))
        d.text((x + 6, y + th + 4), f"{t:.2f}s {SCENES[scene_at(float(t))]['name']}", fill=(255, 210, 120), font=font)
    os.makedirs(os.path.join(SCR, "sheets"), exist_ok=True)
    path = os.path.join(SCR, "sheets", f"sheet_{tag or ''}{t0:05.1f}-{t1:05.1f}.png")
    out.save(path)
    print("wrote", path, f"{len(times)} frames in {time.time() - ts:.1f}s")


def video(t0, t1, out, crf=None, preset=None):
    """RGB frames piped to x264 with BT.709 tags, so the palette survives players that assume HD colour."""
    crf = crf if crf is not None else int(os.environ.get("CRF", "16"))
    preset = preset or os.environ.get("PRESET", "medium")
    n0, n1 = int(round(t0 * FPS)), int(round(t1 * FPS))
    cmd = ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
           "-r", str(FPS), "-i", "-",
           "-vf", "scale=out_color_matrix=bt709:out_range=tv:flags=accurate_rnd+full_chroma_int,format=yuv420p,"
                  "setparams=color_primaries=bt709:color_trc=bt709:colorspace=bt709:range=tv",
           "-c:v", "libx264", "-preset", preset, "-crf", str(crf), "-profile:v", "high",
           "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
           "-movflags", "+faststart", out]
    if os.environ.get("X264_THREADS"):
        cmd[-1:-1] = ["-threads", os.environ["X264_THREADS"]]
    pr = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    ts = time.time()
    for n in range(n0, n1):
        pr.stdin.write(frame(n / FPS).tobytes())
        if (n - n0) % 90 == 0:
            print(f"{out}: {n - n0}/{n1 - n0} frames, {time.time() - ts:.0f}s", file=sys.stderr, flush=True)
    pr.stdin.close()
    pr.wait()
    print("wrote", out, n1 - n0, "frames", f"{time.time() - ts:.0f}s", flush=True)


def cli(argv):
    finalize()
    cmd = argv[0] if argv else "help"
    if cmd == "still":
        still([float(v) for v in argv[1:]])
    elif cmd == "sheet":
        sheet(float(argv[1]), float(argv[2]), float(argv[3]), int(argv[4]) if len(argv) > 4 else 6,
              argv[5] if len(argv) > 5 else None)
    elif cmd == "video":
        video(float(argv[1]), float(argv[2]), argv[3])
    elif cmd == "scenes":
        for sc in SCENES:
            print(f"{sc['t0']:6.2f}-{sc['t1']:6.2f} {sc['bg']:6} {sc['name']}")
    else:
        print(__doc__)
