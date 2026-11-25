"""Cut the reel's source images into stickers, engravings, plates, paper and logo parts.

Outputs go to assets/cut/; a contact sheet goes to $KIROCREW_SCRATCH/cut_sheet.png.
Stickers: the flat grey background is flooded inward from the image border at half resolution, so
grey-ish areas inside a sticker (Shiva's skin, Shani's silver) stay inside its white outline. Only the
large components are kept, which drops the small Gemini sparkle sitting in the empty corner.
"""
import os
from collections import deque

import numpy as np
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
P = os.path.dirname(HERE)
SRC = os.path.join(P, "assets", "src")
OUT = os.path.join(P, "assets", "cut")
SCR = os.environ["KIROCREW_SCRATCH"]
os.makedirs(OUT, exist_ok=True)

IVORY = np.array([243, 236, 221], np.float32)
GOLD = np.array([226, 168, 58], np.float32)
LUMA = np.array([0.299, 0.587, 0.114], np.float32)


def rgb(name):
    return np.asarray(Image.open(os.path.join(SRC, name)).convert("RGB")).astype(np.float32)


def to_img(arr):
    arr = np.clip(arr, 0, 255).astype(np.uint8)
    return Image.fromarray(arr, "RGBA" if arr.shape[-1] == 4 else "RGB")


def save(arr, name):
    im = to_img(arr) if isinstance(arr, np.ndarray) else arr
    im.save(os.path.join(OUT, name))
    return im


def grow(m, n=1):
    for _ in range(n):
        d = m.copy()
        d[1:] |= m[:-1]
        d[:-1] |= m[1:]
        d[:, 1:] |= m[:, :-1]
        d[:, :-1] |= m[:, 1:]
        m = d
    return m


def shrink(m, n=1):
    return ~grow(~m, n)


def flood_from_border(ok):
    """Pixels of `ok` 4-connected to the image border, by repeated one-pixel growth."""
    reg = np.zeros_like(ok)
    reg[0], reg[-1], reg[:, 0], reg[:, -1] = ok[0], ok[-1], ok[:, 0], ok[:, -1]
    last = -1
    for i in range(20000):
        reg = grow(reg) & ok
        if i % 20 == 0:
            n = int(reg.sum())
            if n == last:
                break
            last = n
    return reg


def components(mask):
    h, w = mask.shape
    flat = mask.ravel().tolist()
    lab = [0] * (h * w)
    sizes = [0]
    cur = 0
    for start in np.flatnonzero(mask.ravel()).tolist():
        if lab[start]:
            continue
        cur += 1
        lab[start] = cur
        q = deque([start])
        n = 0
        while q:
            k = q.popleft()
            n += 1
            y, x = divmod(k, w)
            for nk, ok in ((k - w, y > 0), (k + w, y < h - 1), (k - 1, x > 0), (k + 1, x < w - 1)):
                if ok and flat[nk] and not lab[nk]:
                    lab[nk] = cur
                    q.append(nk)
        sizes.append(n)
    return np.array(lab, np.int32).reshape(h, w), sizes


def stickers(name, keep=1):
    """Returns [(centroid (y, x), RGBA array)] for the `keep` largest stickers in the image."""
    a = rgb(name)
    H, W = a.shape[:2]
    half = np.asarray(to_img(a).resize((W // 2, H // 2), Image.BOX)).astype(np.float32)
    bg = np.median(np.concatenate([half[0], half[-1], half[:, 0], half[:, -1]]), axis=0)
    d_half = np.sqrt(((half - bg) ** 2).sum(-1))
    back = flood_from_border(d_half < 30)
    # Background pockets the outline encloses (between an arm and the body, inside a trident): flat
    # background colour ringed mostly by the white outline. Grey artwork such as Shiva's skin is ringed
    # by dark line art instead, so it stays.
    lum_half = half @ LUMA
    hl, hs = components(~back & (d_half < 26))
    holes = 0
    for j in range(1, len(hs)):
        if hs[j] < 12:
            continue
        comp = hl == j
        ring = grow(comp, 2) & ~comp
        if (lum_half[ring] > 200).mean() > 0.5:
            back |= comp
            holes += 1
    lab, sizes = components(~back)
    order = sorted(range(1, len(sizes)), key=lambda i: -sizes[i])[:keep]
    d_full = np.sqrt(((a - bg) ** 2).sum(-1))
    ramp = np.clip((d_full - 20) / 70.0, 0, 1)
    out = []
    for i in order:
        m = np.asarray(Image.fromarray(((lab == i) * 255).astype(np.uint8)).resize((W, H), Image.NEAREST)) > 127
        inner, outer = shrink(m, 3), grow(m, 3)
        band = outer & ~inner
        alpha = np.where(inner, 1.0, np.where(outer, ramp, 0.0))
        col = a.copy()
        sel = band & (d_full > 90)
        white = np.percentile(a[sel], 75, axis=0) if sel.any() else np.array([246, 246, 244], np.float32)
        col[band] = white                        # clean white rim: no grey fringe from the old background
        ys, xs = np.nonzero(alpha > 0.02)
        y0, y1 = max(ys.min() - 10, 0), min(ys.max() + 11, H)
        x0, x1 = max(xs.min() - 10, 0), min(xs.max() + 11, W)
        out.append(((ys.mean(), xs.mean()), np.dstack([col, alpha * 255])[y0:y1, x0:x1]))
    print(f"{name}: bg {bg.round(1)}, kept {[sizes[i] for i in order]} px (half res) of {len(sizes) - 1} "
          f"components, {holes} enclosed pockets opened")
    return out


def avatar(rgba, fx, fy, fr, size=220):
    """Circular face crop for the speaker chip. fx, fy: face centre as fractions of the sticker box; fr: radius / width."""
    h, w = rgba.shape[:2]
    cx, cy, r = fx * w, fy * h, fr * w
    x0, y0, d = int(round(cx - r)), int(round(cy - r)), int(round(2 * r))
    face = to_img(rgba).crop((x0, y0, x0 + d, y0 + d)).resize((size, size), Image.LANCZOS)
    base = Image.new("RGBA", (size, size), (239, 230, 211, 255))
    base.alpha_composite(face)
    mask = Image.new("L", (size * 4, size * 4), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size * 4 - 1, size * 4 - 1), fill=255)
    base.putalpha(mask.resize((size, size), Image.LANCZOS))
    return base


def engraving(name, box=None, blank_corner=False):
    """Ink-on-white drawing -> (cropped original for multiply on light grounds, alpha 0..1, cropped RGB)."""
    a = rgb(name)
    if box:
        a = a[box[1]:box[3], box[0]:box[2]]
    lum = a @ LUMA
    paper, ink = np.percentile(lum, 85), np.percentile(lum, 0.3)
    alpha = np.clip((paper - 8 - lum) / max(paper - 8 - ink, 1), 0, 1)
    if blank_corner:
        h, w = alpha.shape
        alpha[int(h * 0.86):, int(w * 0.84):] = 0
    ys, xs = np.nonzero(alpha > 0.05)
    y0, x0 = max(ys.min() - 8, 0), max(xs.min() - 8, 0)
    y1, x1 = min(ys.max() + 9, a.shape[0]), min(xs.max() + 9, a.shape[1])
    a, alpha = a[y0:y1, x0:x1], alpha[y0:y1, x0:x1]
    sel = alpha < 0.02
    ground = np.median(a[sel], axis=0) if sel.any() else np.array([255, 255, 255], np.float32)
    mul = np.clip(a * (255.0 / np.maximum(ground, 1)), 0, 255)   # off-white ground -> pure white for multiply
    mul[sel] = 255
    return mul, alpha


def ivory_version(a, alpha):
    """Light lines for dark grounds; warm glow pixels keep a brightened gold."""
    lum = a @ LUMA
    g = (np.clip((a[..., 0] - a[..., 2] - 40) / 60, 0, 1) * np.clip((lum - 110) / 50, 0, 1))[..., None]
    col = IVORY * (1 - g) + np.clip(a * 1.2, 0, 255) * g
    return np.dstack([col, alpha * 255])


def mono_version(alpha, colour):
    h, w = alpha.shape
    return np.dstack([np.broadcast_to(colour, (h, w, 3)), alpha * 255])


def plate(name, out):
    im = Image.open(os.path.join(SRC, name)).convert("RGB")
    W, H = im.size
    w = int(round(H * 9 / 16))
    x0 = (W - w) // 2
    return save(im.crop((x0, 0, x0 + w, H)), out)   # the corner sparkle falls outside this centre crop


def paper_bg():
    im = Image.open(os.path.join(SRC, "paper.jpg")).convert("RGB")
    W, H = im.size
    h = int(H * 0.84)
    w = int(round(h * 9 / 16))                       # top-left crop: leaves out the sparkle in the corner
    crop = np.asarray(im.crop((0, 0, w, h)).resize((1080, 1920), Image.LANCZOS)).astype(np.float32)
    tex = (crop @ LUMA) / (crop @ LUMA).mean()
    return save(np.array([239, 230, 211], np.float32) * tex[..., None], "paper_bg.png")


def logo():
    im = Image.open(os.path.join(SRC, "logo_site.png"))
    a = np.asarray(im.convert("RGBA")).astype(np.float32)
    keyed = im.mode != "RGBA" or a[..., 3].min() > 250
    if keyed:                                        # no transparency: key out the white ground
        c = a[..., :3]
        al = np.clip((255 - c.min(-1)) / 60.0, 0, 1)
        col = np.clip((c - 255 * (1 - al[..., None])) / np.maximum(al, 1e-3)[..., None], 0, 255)
        a = np.dstack([col, al * 255])
    rows = a[..., 3].sum(1)
    h = a.shape[0]
    lo, hi = int(h * 0.62), int(h * 0.82)
    cut = lo + int(np.argmin(rows[lo:hi]))

    def crop(arr):
        ys, xs = np.nonzero(arr[..., 3] > 8)
        return arr[ys.min():ys.max() + 1, xs.min():xs.max() + 1]

    print(f"logo: mode {im.mode} {im.size}, keyed white={keyed}, split at row {cut}")
    return save(crop(a), "logo_full.png"), save(crop(a[:cut]), "logo_icon.png"), save(crop(a[cut:]), "logo_word.png")


# ---------------------------------------------------------------- run
made = {}
H0, W0 = 1568, 1171
names = {(0, 0): "sanaka", (0, 1): "sanandana", (1, 0): "sanatana", (1, 1): "sanatkumara"}
faces = {"sanaka": (0.49, 0.215, 0.26), "sanandana": (0.49, 0.215, 0.26),
         "sanatana": (0.49, 0.215, 0.26), "sanatkumara": (0.36, 0.2, 0.26)}
for (cy, cx), arr in stickers("kumaras.jpg", keep=4):
    k = names[(int(cy > H0 / 2), int(cx > W0 / 2))]
    made["kumara_" + k] = (save(arr, f"kumara_{k}.png"), "paper")
    made["avatar_" + k] = (save(avatar(arr, *faces[k]), f"avatar_{k}.png"), "dark")
for n in ("surya", "sanjna", "chhaya", "shiva", "shani"):
    (_, arr), = stickers(n + ".jpg")
    made[n] = (save(arr, n + ".png"), "paper")

a, al = engraving("scale.jpg", blank_corner=True)
made["scale_mul"] = (save(a, "scale_mul.png"), "mul")
made["scale_ivory"] = (save(ivory_version(a, al), "scale_ivory.png"), "dark")
a, al = engraving("sun_emblem.jpg", box=(0, 0, 615, H0))
made["sun_gold"] = (save(mono_version(al, GOLD), "sun_gold.png"), "dark")
made["sun_ink"] = (save(mono_version(al, np.array([27, 26, 46], np.float32)), "sun_ink.png"), "paper")
a, al = engraving("sun_emblem.jpg", box=(615, 0, W0, H0))
made["sphere_ivory"] = (save(mono_version(al, IVORY), "sphere_ivory.png"), "dark")
made["pearl_9x16"] = (plate("pearl_plate.jpg", "pearl_9x16.png"), "paper")
made["cloud_9x16"] = (plate("cloud_plate.jpg", "cloud_9x16.png"), "paper")
made["paper_bg"] = (paper_bg(), "paper")
for k, im in zip(("logo_full", "logo_icon", "logo_word"), logo()):
    made[k] = (im, "dark")

# edge checks at 1:1 on the dark ground
sj = Image.open(os.path.join(OUT, "sanjna.png"))
made["zoom_sanjna_arm"] = (sj.crop((20, 110, 244, 370)), "dark1")
sn = Image.open(os.path.join(OUT, "shani.png"))
made["zoom_shani_edge"] = (sn.crop((sn.width - 300, 40, sn.width - 76, 300)), "dark1")

# ---------------------------------------------------------------- contact sheet
PAPER_C, DARK_C = (239, 230, 211), (23, 20, 43)
tiles = []
for label, (im, mode) in made.items():
    t = Image.new("RGB", (240, 300), PAPER_C if mode in ("paper", "mul") else DARK_C)
    im = im.copy()
    if mode != "dark1":
        im.thumbnail((224, 262), Image.LANCZOS)
    x, y = (240 - im.width) // 2, 6 + (262 - im.height) // 2
    if mode == "mul":
        reg = np.asarray(t.crop((x, y, x + im.width, y + im.height)), np.float32)
        t.paste(Image.fromarray((reg * np.asarray(im.convert("RGB"), np.float32) / 255).astype(np.uint8)), (x, y))
    else:
        t.paste(im, (x, y), im if im.mode == "RGBA" else None)
    ImageDraw.Draw(t).text((8, 282), f"{label} {im.width}x{im.height}", fill=(205, 70, 70))
    tiles.append(t)
cols = 6
sheet = Image.new("RGB", (cols * 240, ((len(tiles) + cols - 1) // cols) * 300), (90, 90, 90))
for i, t in enumerate(tiles):
    sheet.paste(t, ((i % cols) * 240, (i // cols) * 300))
p = os.path.join(SCR, "cut_sheet.png")
sheet.save(p)
print("wrote", p, sheet.size, "and", len(made), "assets in", OUT)
