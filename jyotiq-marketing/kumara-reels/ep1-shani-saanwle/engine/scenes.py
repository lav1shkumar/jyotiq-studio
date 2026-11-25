"""Scenes for Kumara reel 1: शनि देव साँवले क्यों हैं?

Every time comes from timings.json via LS (line start), LE (line end) and SEG (phrase segment), so the
edit follows the audio if a voice line is regenerated.

Shot list (approved order)
  S01 sky    hook: the four Kumaras on a dawn cloud, title on screen from frame 0; सनत्कुमार asks
  S02 paper  पिता सूर्य / माँ छाया card
  S03 dark   कथा: Surya's blazing sun, Sanjna cannot bear it, leaves; her shadow rises as छाया
  S04 dark   तप: Chhaya meditates in the burning sun with Shani in her womb; Shiva appears as a vision
  S05 sky    "फिर?" punch-in on सनत्कुमार
  S06a pearl शनि जन्मे... साँवले (the newborn shown only as an indigo pearl of light)
  S06b dark  Surya sees only the colour, turns away: "ये मेरा पुत्र नहीं।"
  S07 dark   माँ का अपमान; Shani's gaze, an indigo beam; a dark sphere eclipses the sun (तेज मंद)
  S08 paper  father/son card with kundli lines; शत्रु both ways
  S09 sky    "तो शनि देव... ग़ुस्से वाले हैं?" nervous सनत्कुमार
  S10a sky   "नहीं।" punch-in on सनक
  S10b dark  Shiva + Shani + the scale: कर्मफल दाता
  S10c quote जिसे रंग देखकर परखा गया... वो सिर्फ़ कर्म देखता है। (captions off)
  S11 sky    डरना struck through as he says नहीं -> कर्म संभालना है! (captions off)
  S12 dark   phone with the Jyotiq app + gold button "Jyotiq से पूछिए"
  S13 dark   end card: logo, button, jyotiq.ai, LINK IN BIO (header off)
"""
from engine import *  # noqa: F401,F403

# Captions: (line, first segment, last segment, text). Text follows the approved script.
set_captions([
    ("L01", 0, 0, "शनि देव का रंग..."),
    ("L01", 1, 1, "साँवला क्यों है, सनक भैया?"),
    ("L02", 0, 1, "क्योंकि पिता हैं सूर्य..."),
    ("L02", 2, 3, "पर माँ हैं, छाया।"),
    ("L03", 0, 0, "कथा है..."),
    ("L03", 1, 1, "सूर्य देव का तेज,"),
    ("L03", 2, 2, "उनकी पत्नी संज्ञा सह न सकीं।"),
    ("L03", 3, 3, "अपनी जगह छोड़ गईं..."),
    ("L03", 4, 4, "अपनी छाया।"),
    ("L04", 0, 0, "शनि गर्भ में थे..."),
    ("L04", 1, 3, "और छाया, तपती धूप में..."),
    ("L04", 4, 5, "शिव जी के तप में लीन थीं।"),
    ("L05", 0, 0, "फिर?"),
    ("L06", 0, 0, "शनि जन्मे..."),
    ("L06", 1, 1, "साँवले।"),
    ("L06", 2, 2, "सूर्य देव ने बस रंग देखा..."),
    ("L06", 3, 4, "और कह दिया, ये मेरा पुत्र नहीं।"),
    ("L07", 0, 0, "माँ का अपमान..."),
    ("L07", 1, 1, "शनि से सहा न गया।"),
    ("L07", 2, 2, "उनकी दृष्टि पड़ी..."),
    ("L07", 3, 4, "और सूर्य देव का तेज मंद पड़ गया।"),
    ("L08", 0, 0, "पिता-पुत्र की वो दूरी..."),
    ("L08", 1, 1, "आज भी कुंडली में है।"),
    ("L08", 2, 4, "सूर्य और शनि, एक-दूसरे के शत्रु।"),
    ("L09", 0, 0, "तो शनि देव..."),
    ("L09", 1, 1, "ग़ुस्से वाले हैं?"),
    ("L10", 0, 0, "नहीं।"),
    ("L10", 1, 1, "शिव जी ने उन्हें बनाया..."),
    ("L10", 2, 2, "कर्मफल दाता।"),
    ("L10", 3, 3, "जिसे रंग देखकर परखा गया..."),
    ("L10", 4, 5, "वो सिर्फ़ कर्म देखता है।"),
    ("L11", 0, 0, "मतलब डरना नहीं..."),
    ("L11", 1, 1, "कर्म संभालना है!"),
    ("L12", 0, 0, "आपके शनि देव कहाँ बैठे हैं?"),
    ("L12", 1, 1, "ज्योतिक़ से पूछिए।"),
])

KUMARAS = ["sanaka", "sanandana", "sanatana", "sanatkumara"]
HOME_X = {"sanaka": 146, "sanandana": 398, "sanatana": 658, "sanatkumara": 922}
HOME_B, HOME_H = 1232, 392
VIOLET = ("#1E1730", "#B3A6DA", 1.1)            # Chhaya: Sanjna's figure as a violet shadow


def chhaya_of(name):
    return tinted(name, *VIOLET)


# ---------------------------------------------------------------- shared pieces
def cam_clamp(cx, cy, z):
    hw, hh = W / 2 / z, H / 2 / z
    return clamp(cx, hw, W - hw), clamp(cy, hh, H - hh)


def to_screen(x, y, cam):
    cx, cy, z = cam
    return (x - cx) * z + W / 2, (y - cy) * z + H / 2


def name_tag(fr, k, x, y, a):
    nm = SPEAKERS[k]["hi"]
    w = text_w([(C["ivory"], nm)], "bold", 30) + 38
    rrect(fr, x - w / 2, y - 24, x + w / 2, y + 22, 23, SPEAKERS[k]["paper"], 0.94 * a)
    text(fr, [(C["ivory"], nm)], "bold", 30, x, y + 10, ha="c", a=a)


def pill(fr, label, y, a=1.0, bg="#17142B", fg=None, size=26):
    fg = fg or C["gold_lt"]
    w = text_w([(fg, label)], "semi", size) + 46
    rrect(fr, W / 2 - w / 2, y - size * 0.9, W / 2 + w / 2, y + size * 0.9, size * 0.9, bg, 0.88 * a)
    text(fr, [(fg, label)], "semi", size, W / 2, y + size * 0.36, ha="c", a=a)


def home(fr, t, z=1.0, cx=W / 2, cy=1000, tags=True, offsets=None):
    """The Kumaras' home base on the dawn cloud. The current speaker lifts, grows and glows. Returns the camera."""
    cx, cy = cam_clamp(cx, cy, z)
    cam = (cx, cy, z)
    comp(fr, plate("cloud_9x16", zoom=z, fx=cx / W, fy=cy / H), 0, 0)
    L = line_at(t, 0.14)
    spk = L["speaker"] if L else None
    for i, k in enumerate(KUMARAS):
        t_on = -1.0 if (L and L["id"] == "L01") else (L["start"] - 0.14 if L else 0.0)
        act = win(t, t_on, L["end"] + 0.14, 0.18, 0.22) if (L and k == spk) else 0.0
        ox, oy = (offsets or {}).get(k, (0.0, 0.0))
        y = HOME_B + wobble(t, 4, 0.31, i * 1.7) - 18 * act - 8 * env(t) * act + oy
        sx, sy = to_screen(HOME_X[k] + ox, y, cam)
        if act > 0.01:
            gx, gy = to_screen(HOME_X[k] + ox, y - HOME_H * 0.5, cam)
            glow(fr, gx, gy, 240 * z, SPEAKERS[k]["dark"], 0.6 * act)
        box = place(fr, "kumara_" + k, sx, sy, h=HOME_H * (1 + 0.06 * act) * z, anchor="b", shadow=0.35)
        if tags and act > 0.01 and box:
            name_tag(fr, k, sx, box[1] - 24, act)
    return cam


def heartbeat(t, period=0.95):
    u = t % period
    return max(math.exp(-((u - 0.05) ** 2) / 0.003), 0.65 * math.exp(-((u - 0.27) ** 2) / 0.003))


def dotted(fr, xa, ya, xb, yb, k, col, a, gap=22, r=4.0):
    n = max(1, int(math.hypot(xb - xa, yb - ya) / gap))
    for i in range(int(n * k) + 1):
        f = i / n
        disc(fr, xa + (xb - xa) * f, ya + (yb - ya) * f, r, col, a)


def arrow(fr, xa, ya, xb, yb, k, col, a, width=4.0, head=22.0):
    if k <= 0:
        return
    xe, ye = lerp(xa, xb, k), lerp(ya, yb, k)
    line(fr, xa, ya, xe, ye, width, col, a)
    ang = math.atan2(ye - ya, xe - xa)
    for s in (-1, 1):
        line(fr, xe, ye, xe - head * math.cos(ang + s * 0.5), ye - head * math.sin(ang + s * 0.5), width, col, a)


def tag(fr, label, x, y, bg, fg, a=1.0, size=34, scale=1.0):
    s = size * scale
    w = text_w([(fg, label)], "bold", s) + 0.9 * s
    rrect(fr, x - w / 2, y - 0.78 * s, x + w / 2, y + 0.72 * s, 0.75 * s, bg, a)
    text(fr, [(fg, label)], "bold", s, x, y + 0.32 * s, ha="c", a=a)


_kundli_full = {}


def kundli(fr, cx, cy, size, k, col, a, width=2.5):
    """North-Indian chart (square, both diagonals, inner diamond) drawn on line by line as k goes 0 -> 1."""
    h = size / 2
    P_ = dict(tl=(cx - h, cy - h), tr=(cx + h, cy - h), br=(cx + h, cy + h), bl=(cx - h, cy + h),
              t=(cx, cy - h), r=(cx + h, cy), b=(cx, cy + h), l=(cx - h, cy))
    segs = [("tl", "tr"), ("tr", "br"), ("br", "bl"), ("bl", "tl"), ("tl", "br"), ("tr", "bl"),
            ("t", "r"), ("r", "b"), ("b", "l"), ("l", "t")]
    key = (cx, cy, size, col, round(a, 3), width)
    if k >= 1 and key in _kundli_full:
        fr.alpha_composite(_kundli_full[key])
        return
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0)) if k >= 1 else fr
    for i, (u, v) in enumerate(segs):
        kk = clamp(k * (len(segs) * 0.4 + 0.6) - i * 0.4)
        if kk <= 0:
            continue
        (xa, ya), (xb, yb) = P_[u], P_[v]
        line(layer, xa, ya, lerp(xa, xb, kk), lerp(ya, yb, kk), width, col, a)
    if k >= 1:
        _kundli_full[key] = layer
        fr.alpha_composite(layer)


# ---------------------------------------------------------------- S01 hook
@scene(0, 4.90, "sky", chip=False)
def s01_hook(fr, t):
    home(fr, t, z=1.0 + 0.035 * eio(p(t, 0, 4.9)))
    pill(fr, "कुमारों की कथा · 01", 352)
    sc = lerp(1.035, 1.0, eo(p(t, 0, 0.6)))
    text(fr, [(C["ink"], "शनि देव")], "title", 132, W / 2, 532, ha="c", scale=sc)
    q = SEG("L01", 1)
    pulse = math.sin(math.pi * p(t, q, 0.55)) if t >= q else 0.0
    runs = [(C["shani"], "साँवले"), (C["ink"], " क्यों हैं?")]
    wall = text_w(runs, "title", 104)
    text(fr, runs, "title", 104, W / 2, 668, ha="c", scale=sc * (1 + 0.045 * pulse))
    ku = eo(p(t, q + 0.05, 0.45))
    if ku > 0:
        x0 = W / 2 - wall / 2
        line(fr, x0 + 4, 700, x0 + 4 + (text_w([(C["shani"], "साँवले")], "title", 104) - 8) * ku, 700, 5,
             C["shani"], 0.85)
    text(fr, [(C["ink"], "ब्रह्मा जी के 4 मानस पुत्र · सनकादि कुमार")], "med", 30, W / 2, 1306, ha="c",
         a=0.78 * (1 - p(t, 3.9, 0.4)))


# ---------------------------------------------------------------- S02 parents
@scene(4.90, LS("L03"), "paper", index=("01", "माता-पिता", "PARENTS"), tin=("zoom", 0.3))
def s02_parents(fr, t):
    t1, t2, t3 = SEG("L02", 1), SEG("L02", 2), SEG("L02", 3)
    line(fr, W / 2, 760, W / 2, 760 + 480 * eo(p(t, 4.95, 0.5)), 2, C["ink"], 0.16)
    ks = p(t, t1 - 0.06, 0.45)
    if ks > 0:
        e = eob(ks)
        glow(fr, 290, 960, 300, C["surya"], 0.42 * ks)
        place(fr, "surya", 290, 960 + wobble(t, 4, 0.3), h=560 * lerp(0.8, 1.0, e), a=min(1, ks * 2), shadow=0.32)
        text(fr, [("#B97C14", "सूर्य")], "title", 104, 290, 640, ha="c", a=min(1, ks * 2), scale=lerp(1.2, 1, e))
        text(fr, [(C["ink"], "पिता")], "bold", 38, 290, 1300, ha="c", a=ks)
        text(fr, [(C["muted"], "FATHER · SUN")], "latinmed", 14, 290, 1332, ha="c", a=ks, track=2.5)
    kq, kc = p(t, t2 - 0.06, 0.35), p(t, t3 - 0.1, 0.5)
    if kq > 0 and kc < 1:
        place(fr, silhouette("sanjna", "#2A2440"), 790, 1240, h=560, anchor="b", a=0.13 * kq * (1 - kc))
        text(fr, [(C["muted"], "?")], "title", 130, 790, 1010, ha="c", a=0.55 * kq * (1 - kc))
    if kc > 0:
        e = eo(kc)
        glow(fr, 790, 990, 300, C["chhaya"], 0.4 * e)
        place(fr, chhaya_of("sanjna"), 790, 1240, h=560, anchor="b", sy=lerp(0.55, 1.0, e), a=min(1, kc * 1.6),
              shadow=0.3)
        text(fr, [(C["chhaya"], "छाया")], "title", 112, 790, 640, ha="c", a=min(1, kc * 2),
             scale=lerp(1.25, 1.0, eob(kc)))
        text(fr, [(C["ink"], "माँ")], "bold", 38, 790, 1300, ha="c", a=e)
        text(fr, [(C["muted"], "MOTHER · SHADOW")], "latinmed", 14, 790, 1332, ha="c", a=e, track=2.5)


# ---------------------------------------------------------------- S03 the shadow
def sun(fr, t, x, y, h, bright=0.0, a=1.0, spin=5.0, rays=0.0, dim=0.0):
    s = 1 + 0.1 * bright
    if rays > 0:
        for i in range(16):
            ang = math.radians(i * 22.5 + t * 8)
            fl = 0.6 + 0.4 * math.sin(t * 6 + i * 1.3)
            r0, r1 = 0.58 * h * s, (0.8 + 0.12 * fl) * h * s
            line(fr, x + r0 * math.cos(ang), y + r0 * math.sin(ang), x + r1 * math.cos(ang), y + r1 * math.sin(ang),
                 3, C["surya_lt"], 0.35 * rays * fl * a)
    glow(fr, x, y, 0.9 * h * s, C["surya"], (0.45 + 0.4 * bright) * a * (1 - 0.85 * dim))
    disc(fr, x, y, 0.177 * h * s, C["surya_lt"], a * (1 - 0.6 * dim), soft=6)
    if dim < 1:
        place(fr, "sun_gold", x, y, h=h * s, a=a * (1 - dim), rot=-t * spin)
    if dim > 0:
        place(fr, tinted("sun_gold", "#3A3850", "#9A97A8", 1.0), x, y, h=h * s, a=a * dim, rot=-t * spin)


@scene(LS("L03"), LS("L04"), "dark", index=("02", "कथा", "THE STORY"), tin=("iris", 0.5))
def s03_shadow(fr, t):
    a1, a2, a3, a4 = SEG("L03", 1), SEG("L03", 2), SEG("L03", 3), SEG("L03", 4)
    k0 = eo(p(t, LS("L03"), 0.7))
    kb = eo(p(t, a1 - 0.1, 0.8))
    sun(fr, t, 540, 640 - 30 * (1 - k0), 520, bright=kb, a=k0, rays=kb)
    kh = kb * (1 - p(t, a3, 0.6))
    if kh > 0:                                   # तेज: heat rings radiate while Sanjna endures it
        for j in range(3):
            v = (t - a1) / 0.9 - j / 3
            if v >= 0:
                u = v % 1.0
                ring(fr, 540, 640, lerp(160, 540, eo(u)), 3, C["surya_lt"], 0.32 * kh * (1 - u) ** 1.5)
    text(fr, [(C["gold_lt"], "सूर्य देव")], "bold", 36, 540, 990, ha="c", a=eo(p(t, a1, 0.4)) * (1 - p(t, a2, 0.3)))
    kin, kout = eo(p(t, a2 - 0.1, 0.6)), ei(p(t, a3 + 0.15, 0.7))
    if kin > 0:
        ellipse(fr, 770, 1352, 150 * kin, 24, C["chhaya"], 0.55 * kin, soft=10)
        if kout < 1:
            place(fr, "sanjna", 770 + 420 * (1 - kin) + 560 * kout, 1352, h=640, anchor="b", a=kin * (1 - kout),
                  sx=1 + 0.012 * math.sin(t * 9), shadow=0.3)
            la = kin * (1 - p(t, a3, 0.3))
            text(fr, [(C["ivory"], "संज्ञा")], "bold", 42, 440, 1080, ha="c", a=la, shadow=0.5)
            text(fr, [(C["ivory"], "SANJNA · SURYA'S QUEEN")], "latinmed", 14, 440, 1112, ha="c", a=0.6 * la, track=2.2)
    kr = eo(p(t, a4 - 0.1, 0.7))
    if kr > 0:
        glow(fr, 770, 1120, 330, C["chhaya"], 0.55 * kr)
        place(fr, chhaya_of("sanjna"), 770, 1352, h=640, anchor="b", sy=max(0.03, kr), a=min(1, kr * 1.5))
        text(fr, [(C["chhaya_lt"], "छाया")], "title", 100, 400, 1090, ha="c", a=min(1, kr * 1.5),
             scale=lerp(1.2, 1.0, eob(p(t, a4, 0.5))))
        text(fr, [(C["ivory"], "CHHAYA · HER SHADOW")], "latinmed", 14, 400, 1130, ha="c", a=0.6 * kr, track=2.2)


# ---------------------------------------------------------------- S04 tapasya
@scene(LS("L04"), LS("L05"), "dark", index=("03", "तप", "PENANCE"), tin=("fade", 0.35))
def s04_tapas(fr, t):
    b1, b4 = SEG("L04", 1), SEG("L04", 4)
    k0 = eo(p(t, LS("L04"), 0.6))
    ksv = eo(p(t, b4 - 0.15, 0.9))
    if ksv > 0:
        glow(fr, 540, 820, 540, "#9FB4D8", 0.32 * ksv)
        place(fr, "shiva", 540, 860 + wobble(t, 6, 0.2), h=980, a=0.34 * ksv)
    kh = eo(p(t, b1 - 0.1, 0.6)) * (1 - p(t, b4 - 0.2, 0.6))
    if kh > 0:
        sun(fr, t, 540, 560, 330, bright=0.6, a=kh, spin=8)
        for i in range(7):
            x = 300 + i * 80
            ph = t * 2.2 + i * 0.9
            pts = [(x + 10 * math.sin(ph + j * 0.9), 780 + j * 58) for j in range(7)]
            for (xa, ya), (xb, yb) in zip(pts, pts[1:]):
                line(fr, xa, ya, xb, yb, 2.5, C["surya_lt"], 0.2 * kh)
        rect(fr, 0, 0, W, H, C["surya"], 0.05 * kh)
    place(fr, chhaya_of("chhaya"), 540, 1360, h=560, anchor="b", a=k0, shadow=0.3)
    ko = eo(p(t, LS("L04") + 0.2, 0.8))
    pulse = 0.75 + 0.25 * math.sin(t * 2 * math.pi * 0.9)
    glow(fr, 540, 1250, 150, C["shani_lt"], 0.65 * ko * pulse)
    disc(fr, 540, 1250, 15, "#D2DAF5", ko * pulse, soft=4)
    kt = eo(p(t, LS("L04") + 0.3, 0.4)) * (1 - p(t, b1 - 0.2, 0.3))
    text(fr, [(C["shani_lt"], "शनि")], "bold", 32, 540, 1200, ha="c", a=kt, shadow=0.5)


# ---------------------------------------------------------------- S05 फिर?
@scene(LS("L05"), 24.50, "sky", chip=False, tin=("zoom", 0.2))
def s05_phir(fr, t):
    kz = eo(p(t, LS("L05"), 0.35))
    cam = home(fr, t, z=lerp(1.04, 1.38, kz), cx=lerp(W / 2, 860, kz), cy=lerp(1000, 980, kz))
    kq = p(t, SEG("L05", 0), 0.35)
    if kq > 0:
        qx, qy = to_screen(HOME_X["sanatkumara"] + 95, HOME_B - HOME_H - 40, cam)
        text(fr, [(SPEAKERS["sanatkumara"]["paper"], "?")], "title", 150, qx, qy, ha="c", a=min(1, kq * 2),
             scale=lerp(0.6, 1.0, eob(kq)))


# ---------------------------------------------------------------- S06a birth: the indigo pearl
PEARL = (0.503, 0.647)


@scene(24.50, 27.05, "pearl", index=("04", "जन्म", "BIRTH"), tin=("fade", 0.3))
def s06a_birth(fr, t):
    z = 1.0 + 0.18 * eio(p(t, 24.5, 2.6))
    comp(fr, plate("pearl_9x16", zoom=z, fx=PEARL[0], fy=PEARL[1]), 0, 0)
    px, py, _ = plate_pt("pearl_9x16", PEARL[0], PEARL[1], zoom=z, fx=PEARL[0], fy=PEARL[1])
    beat = heartbeat(t)
    glow(fr, px, py, 170 + 70 * beat, C["shani_lt"], 0.4 + 0.4 * beat)
    k1 = p(t, SEG("L06", 0) - 0.05, 0.5)
    text(fr, [(C["ivory"], "शनि जन्मे")], "title", 112, W / 2, 610, ha="c", a=eo(k1), scale=lerp(1.08, 1, eo(k1)),
         shadow=0.5)
    k2 = p(t, SEG("L06", 1) - 0.05, 0.45)
    text(fr, [(C["chhaya_lt"], "साँवले।")], "title", 150, W / 2, 800, ha="c", a=min(1, k2 * 2),
         scale=lerp(1.3, 1, eob(k2)), shadow=0.5)


# ---------------------------------------------------------------- S06b rejected
ORB = (800, 1150)
CRACK = [(568, 600), (590, 690), (556, 770), (600, 860), (570, 950), (612, 1040), (580, 1130), (618, 1230),
         (594, 1320)]


def shani_orb(fr, t, x, y, a, power=0.0):
    beat = heartbeat(t)
    glow(fr, x, y, (170 + 30 * beat) * (1 + 0.5 * power), C["shani_lt"], (0.5 + 0.2 * beat + 0.25 * power) * a)
    disc(fr, x, y, 46, C["shani"], a, soft=3)
    ring(fr, x, y, 46, 3, C["shani_lt"], 0.85 * a)
    disc(fr, x - 14, y - 15, 9, "#C9D2F2", 0.5 * a, soft=6)


@scene(27.05, 32.20, "dark", index=("04", "जन्म", "BIRTH"), tin=("fade", 0.25))
def s06b_rejected(fr, t):
    c2, c3, c4 = SEG("L06", 2), SEG("L06", 3), SEG("L06", 4)
    k0 = eo(p(t, 27.05, 0.5))
    shani_orb(fr, t, ORB[0], ORB[1], k0)
    text(fr, [(C["shani_lt"], "शनि")], "bold", 32, ORB[0], ORB[1] + 100, ha="c", a=0.9 * k0, shadow=0.5)
    ft = eio(p(t, c3 - 0.05, 0.5))
    sx_, sy_ = 310, 880
    glow(fr, sx_, sy_, 330, C["surya"], 0.45 * k0)
    place(fr, "surya", sx_, sy_, h=560, a=k0, sx=max(0.04, abs(1 - 2 * ft)), flip=ft > 0.5, shadow=0.3)
    text(fr, [(C["gold_lt"], "सूर्य देव")], "bold", 36, sx_, sy_ + 335, ha="c", a=0.9 * k0, shadow=0.5)
    ke = eo(p(t, c2 + 0.1, 0.6)) * (1 - p(t, c3 - 0.1, 0.3))
    if ke > 0:
        dotted(fr, 420, 790, ORB[0] - 64, ORB[1] - 46, ke, C["gold_lt"], 0.8 * ke)
        if ke > 0.6:
            tag(fr, "सिर्फ़ रंग", 640, 930, C["surya"], C["ink"], a=min(1, (ke - 0.6) * 3), size=32)
    kq = p(t, c4 - 0.05, 0.5)
    if kq > 0:
        n = len(CRACK) - 1
        for i, ((xa, ya), (xb, yb)) in enumerate(zip(CRACK, CRACK[1:])):
            kk = clamp(eo(kq) * n - i)
            if kk > 0:
                line(fr, xa, ya, lerp(xa, xb, kk), lerp(ya, yb, kk), 3, C["ivory"], 0.55)
        text(fr, [(C["surya_lt"], "“ये मेरा पुत्र नहीं।”")], "title", 74, W / 2, 545, ha="c", a=min(1, kq * 2),
             scale=lerp(1.15, 1, eob(kq)), shadow=0.6)


# ---------------------------------------------------------------- S07 the gaze, the eclipse
@scene(32.20, 39.95, "dark", index=("05", "दृष्टि", "THE GAZE"), tin=("fade", 0.3))
def s07_gaze(fr, t):
    d1, d2, d3, d4 = SEG("L07", 1), SEG("L07", 2), SEG("L07", 3), SEG("L07", 4)
    k0 = eo(p(t, 32.20, 0.5))
    SX, SY, OX, OY = 540, 640, 790, 1210
    ke = eo(p(t, d4 - 0.05, 0.9))
    bright = 0.3 + 0.7 * eo(p(t, d3 - 0.1, 0.6))
    sun(fr, t, SX, SY, 440, bright=bright * (1 - ke), a=k0, rays=bright * (1 - ke), dim=ke)
    if ke > 0:
        r = 0.177 * 440 * (1 + 0.1 * bright * (1 - ke)) + 6
        ex = lerp(SX + 560, SX, ke)
        glow(fr, ex, SY, r * 2.2, C["shani_lt"], 0.35 * ke)
        disc(fr, ex, SY, r, "#12102A", min(1, ke * 1.4), soft=2)
        place(fr, tinted("sphere_ivory", "#12102A", "#7F89C2", 1.0), ex, SY, h=r * 2.05, a=0.55 * min(1, ke * 1.4))
        ring(fr, ex, SY, r, 2.5, C["shani_lt"], 0.7 * ke)
    kb = eo(p(t, d2 - 0.05, 0.55))
    if kb > 0:
        bx, by_ = lerp(OX, SX, kb), lerp(OY, SY + 120, kb)
        line(fr, OX, OY, bx, by_, 42, C["shani_lt"], 0.12)
        line(fr, OX, OY, bx, by_, 10, "#C9D2F2", 0.75)
        glow(fr, bx, by_, 90, C["shani_lt"], 0.6)
    km = eo(p(t, 32.30, 0.5))
    place(fr, chhaya_of("sanjna"), 250, 1400, h=520, anchor="b", a=km, shadow=0.3)
    text(fr, [(C["chhaya_lt"], "माँ")], "bold", 34, 250, 860, ha="c", a=km * (1 - p(t, d2, 0.4)), shadow=0.5)
    shani_orb(fr, t, OX, OY, k0, power=eo(p(t, d1 - 0.05, 0.6)))
    kt = eo(p(t, d3, 0.4))
    if kt > 0:
        text(fr, [(C["surya_lt"], "तेज")], "title", 96, 870, 960, ha="c", a=kt * (1 - ke), shadow=0.5)
        text(fr, [("#9A97A8", "मंद")], "title", 96, 870, 960, ha="c", a=kt * ke, shadow=0.5)


# ---------------------------------------------------------------- S08 the chart: enemies
@scene(39.95, 47.45, "paper", index=("06", "कुंडली", "IN THE CHART"), tin=("up", 0.35))
def s08_chart(fr, t):
    e1, e3, e4 = SEG("L08", 1), SEG("L08", 3), SEG("L08", 4)
    k0 = eo(p(t, 39.95, 0.45))
    kundli(fr, 540, 930, 780, eo(p(t, e1 - 0.1, 1.1)), C["ink"], 0.11)
    sep = lerp(170, 255, eio(p(t, SEG("L08", 0), 1.7)))
    ty, by_ = 930 - sep, 930 + sep
    R = 168
    for y, name, col, hi, en, h in ((ty, "surya", "#B97C14", "सूर्य", "पिता · FATHER", 330),
                                   (by_, "shani", C["shani"], "शनि", "पुत्र · SON", 300)):
        disc(fr, 540, y, R, "#E4D9C2", k0)
        ring(fr, 540, y, R, 2.5, C["ink"], 0.3 * k0)
        place(fr, name, 540, y - 6, h=h, a=k0, shadow=0.25)
        text(fr, [(col, hi)], "title", 66, 820, y + 6, ha="c", a=k0)
        text(fr, [(C["muted"], en)], "latinmed", 14, 820, y + 40, ha="c", a=k0, track=2.2)
    kd = k0 * (1 - p(t, e3 - 0.2, 0.3))
    if kd > 0:
        dotted(fr, 540, ty + R + 14, 540, by_ - R - 14, 1.0, C["muted"], 0.7 * kd, gap=18, r=3)
        text(fr, [(C["muted"], "दूरी")], "semi", 30, 450, 942, ha="c", a=kd)
    ka = eo(p(t, e3 - 0.1, 0.5))
    if ka > 0:
        arrow(fr, 470, ty + R + 10, 470, by_ - R - 10, ka, C["red"], 0.9)
        arrow(fr, 610, by_ - R - 10, 610, ty + R + 10, ka, C["red"], 0.9)
    ks = p(t, e4 - 0.06, 0.35)
    if ks > 0:
        sc = lerp(1.7, 1.0, eob(ks))
        tag(fr, "शत्रु", 340, 930, C["red"], C["ivory"], a=min(1, ks * 2.5), size=38, scale=sc)
        tag(fr, "शत्रु", 740, 930, C["red"], C["ivory"], a=min(1, ks * 2.5), size=38, scale=sc)


# ---------------------------------------------------------------- S09 "angry?"
@scene(47.45, 50.70, "sky", chip=False, tin=("left", 0.3))
def s09_angry(fr, t):
    q1 = SEG("L09", 1)
    jit = win(t, q1, LE("L09") + 0.1, 0.1, 0.15)
    off = {"sanatkumara": (3.5 * math.sin(t * 2 * math.pi * 13) * jit, 0.0)}
    cam = home(fr, t, z=1.06, offsets=off)
    for i, tq in enumerate((SEG("L09", 0) + 0.6, q1 + 0.1)):
        kq = p(t, tq, 0.35)
        if kq > 0:
            qx, qy = to_screen(HOME_X["sanatkumara"] + (70 if i == 0 else 135), HOME_B - HOME_H - 30 - 50 * i, cam)
            text(fr, [(SPEAKERS["sanatkumara"]["paper"], "?")], "title", 110 + 30 * i, qx, qy, ha="c",
                 a=min(1, kq * 2), scale=lerp(0.6, 1.0, eob(kq)))


# ---------------------------------------------------------------- S10a "नहीं।"
@scene(50.70, 51.45, "sky", chip=False, tin=("flash", 0.2))
def s10a_no(fr, t):
    kz = eo(p(t, 50.70, 0.3))
    sway = 6 * math.sin(2 * math.pi * 3.2 * t) * win(t, SEG("L10", 0), SEG("L10", 0, True) + 0.1, 0.06, 0.12)
    home(fr, t, z=lerp(1.06, 1.32, kz), cx=lerp(W / 2, 300, kz), cy=1000, offsets={"sanaka": (sway, 0.0)})


# ---------------------------------------------------------------- S10b Shiva's boon: कर्मफल दाता
@scene(51.45, 54.60, "dark", index=("07", "शिव का वरदान", "SHIVA'S BOON"), tin=("zoom", 0.3))
def s10b_karmaphal(fr, t):
    f1, f2 = SEG("L10", 1), SEG("L10", 2)
    ks = eo(p(t, f1 - 0.1, 0.8))
    glow(fr, 540, 820, 560, "#9FB4D8", 0.3 * ks)
    place(fr, "shiva", 540, 840 + wobble(t, 5, 0.2), h=900, a=0.3 * ks * (1 - 0.4 * p(t, f2, 0.5)))
    kn = eo(p(t, f1 + 0.1, 0.6))
    glow(fr, 540, 1140, 390, C["shani_lt"], 0.55 * kn)
    glow(fr, 540, 1160, 220, "#C9D2F2", 0.25 * kn)
    place(fr, "shani", 540, 1370 + 60 * (1 - kn), h=470, anchor="b", a=kn, shadow=0.35)
    kc = p(t, f2 - 0.15, 0.7)
    if kc > 0:
        e = eo(kc)
        y = lerp(-220, 720, e)
        dt = max(0.0, t - f2)
        swing = 7 * math.exp(-3 * dt) * math.sin(10 * dt)
        glow(fr, 540, y + 40, 230, C["gold"], 0.35 * e)
        place(fr, "scale_ivory", 540, y, h=400, a=min(1, kc * 2), rot=swing)
    kt = eo(p(t, f2, 0.45))
    if kt > 0:
        text(fr, [(C["gold_lt"], "कर्मफल दाता")], "title", 96, W / 2, 476, ha="c", a=kt,
             scale=lerp(1.15, 1, eob(kt)), shadow=0.5)
        text(fr, [(C["ivory"], "GIVER OF KARMA'S FRUITS")], "latinmed", 14, W / 2, 512, ha="c", a=0.6 * kt, track=2.4)


# ---------------------------------------------------------------- S10c quote card
QUOTE1 = "जिसे रंग देखकर परखा गया...".split(" ")


@scene(54.60, 59.15, "dark", caps=False, tin=("fade", 0.35))
def s10c_quote(fr, t):
    rect(fr, 0, 0, W, H, "#1B2440", 1.0)
    glow(fr, 540, 980, 760, "#2C3868", 0.7)
    place(fr, "scale_ivory", 540, 640, h=200, a=0.85 * eo(p(t, 54.62, 0.5)))
    g0, g1 = SEG("L10", 3), SEG("L10", 3, True)
    n = len(QUOTE1)
    shown = clamp((t - g0) / max(g1 - g0, 0.1) * n + 0.6, 0, n)
    if shown > 0:
        full = " ".join(QUOTE1)
        x0 = W / 2 - text_w([(C["ivory"], full)], "semi", 62) / 2
        kf = int(shown)
        if kf:
            text(fr, [(C["ivory"], " ".join(QUOTE1[:kf]))], "semi", 62, x0, 876, ha="l")
        if kf < n:
            text(fr, [(C["ivory"], " ".join(QUOTE1[:kf + 1]))], "semi", 62, x0, 876, ha="l", a=shown - kf)
    k2 = p(t, SEG("L10", 4) - 0.05, 0.45)
    if k2 > 0:
        text(fr, [(C["ivory"], "वो सिर्फ़")], "title", 108, W / 2, 1035, ha="c", a=min(1, k2 * 2),
             scale=lerp(1.2, 1, eob(k2)))
    k3 = p(t, SEG("L10", 5) - 0.05, 0.45)
    if k3 > 0:
        text(fr, [(C["surya_lt"], "कर्म"), (C["ivory"], " देखता है।")], "title", 108, W / 2, 1168, ha="c",
             a=min(1, k3 * 2), scale=lerp(1.2, 1, eob(k3)))
    kr = eo(p(t, 58.55, 0.5))
    if kr > 0:
        line(fr, W / 2 - 220 * kr, 1238, W / 2 + 220 * kr, 1238, 2.5, C["gold"], 0.9)
        text(fr, [(C["gold_lt"], "रंग नहीं, कर्म।")], "med", 38, W / 2, 1306, ha="c", a=eo(p(t, 58.7, 0.4)))


# ---------------------------------------------------------------- S11 kaam ki baat: डरना struck out
@scene(59.15, 62.70, "sky", caps=False, chip=False, tin=("iris", 0.45))
def s11_kaam(fr, t):
    h0, h1 = SEG("L11", 0), SEG("L11", 1)
    bounce = abs(math.sin(2 * math.pi * 2.0 * t)) * 14 * win(t, h1, LE("L11") + 0.1, 0.1, 0.2)
    home(fr, t, z=1.03, offsets={"sanatkumara": (0.0, -bounce)})
    k1 = eo(p(t, h0 + 0.66, 0.3))             # "डरना" is spoken at ~h0+0.73 (envelope check)
    strike = eo(p(t, h0 + 1.10, 0.3))         # "नहीं" starts at ~h0+1.13
    if k1 > 0:
        w = text_w([(C["ink"], "डरना")], "title", 118)
        text(fr, [(C["ink"], "डरना")], "title", 118, W / 2, 575, ha="c", a=k1 * (1 - 0.5 * strike),
             scale=lerp(1.12, 1, eo(k1)))
        if strike > 0:
            x0 = W / 2 - w / 2 - 18
            line(fr, x0, 548, x0 + (w + 36) * strike, 532, 8, C["red"], 0.92)
    k2 = p(t, h1 - 0.05, 0.45)
    if k2 > 0:
        runs = [("#B97C14", "कर्म संभालना है!")]
        text(fr, runs, "title", 96, W / 2, 724, ha="c", a=min(1, k2 * 2), scale=lerp(1.25, 1, eob(k2)))
        ku = eo(p(t, h1 + 0.3, 0.5))
        if ku > 0:
            w2 = text_w(runs, "title", 96)
            line(fr, W / 2 - w2 / 2 * ku, 756, W / 2 + w2 / 2 * ku, 756, 5, C["gold"], 0.9)


# ---------------------------------------------------------------- S12 the app: phone + "Jyotiq से पूछिए"
APPF = os.path.join(SCR, "appframes")      # engine/appframes.sh: app.mp4 2.0-9.6 s, 30 fps, 440 px wide
APP_I0 = 8                                 # frames 0-7 still show the launch animation
SCR_W, SCR_H, BEZ = 440, 954, 12
PH_W, PH_H, PH_R, SCR_R = SCR_W + 2 * BEZ, SCR_H + 2 * BEZ, 64, 52
PH_X, PH_Y = 540, 835                      # phone centre at rest: top 346, bottom 1324 (chip sits at ~1394)
INPUT_DY = -60                             # the app's question bar, relative to the phone centre (keyboard up)
BTN_Y, BTN_H, BTN_SIZE = 1180, 104, 46     # CTA button: same place in S12 and S13 so it carries across the cut
BTN_LABEL = "Jyotiq से पूछिए"
H3, H11 = (165, 610), (915, 610)           # kundli houses 3 and 11: the side strips the phone leaves visible
MOTES = [((i * 197 + 61) % 1000 / 1000, (i * 389 + 113) % 1000 / 1000, 0.6 + (i * 53 % 7) / 10,
          2.0 + (i * 31 % 5) * 0.6, i * 1.3) for i in range(16)]


@lru_cache(maxsize=1)
def _app_count():
    n = len([f for f in os.listdir(APPF) if f.endswith(".jpg")])
    if not n:
        raise RuntimeError("no app frames: run bash engine/appframes.sh")
    return n


@lru_cache(maxsize=6)
def _app_frame(i):
    im = Image.open(os.path.join(APPF, "af_%04d.jpg" % i)).convert("RGB")
    im.load()
    return im


def _app_index(t):
    """Speed ramp: the home screen plays at 1x, then the typing runs at ~2.1x to the end of the scene."""
    u = max(0.0, t - 62.70)
    r, a0, w = 1.12, 0.3, 0.7
    x = clamp((u - a0) / w)
    s = u + r * w * (x ** 3 - 0.5 * x ** 4) + r * max(0.0, u - a0 - w)
    return int(clamp(APP_I0 + s * 30, 0, _app_count() - 1))


def _rr_alpha(w, h, r):
    ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
    qx, qy = np.abs(xs + 0.5 - w / 2) - (w / 2 - r), np.abs(ys + 0.5 - h / 2) - (h / 2 - r)
    d = np.sqrt(np.maximum(qx, 0) ** 2 + np.maximum(qy, 0) ** 2) + np.minimum(np.maximum(qx, qy), 0) - r
    return np.clip(0.5 - d, 0, 1)


def _phone_body():
    """Dark phone body with a thin gold rim and side keys, drawn at 3x and downsampled for clean edges."""
    s, cw, ch = 3, PH_W + 8, PH_H
    im = Image.new("RGBA", (cw * s, ch * s), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    x0, key = 4 * s, rgb("#2A2638")
    d.rounded_rectangle((x0 + PH_W * s - 6 * s, int(0.20 * ch * s), x0 + PH_W * s + 3 * s, int(0.29 * ch * s)),
                        radius=2 * s, fill=key)
    for y0, y1 in ((0.16, 0.22), (0.235, 0.295)):
        d.rounded_rectangle((x0 - 3 * s, int(y0 * ch * s), x0 + 6 * s, int(y1 * ch * s)), radius=2 * s, fill=key)
    d.rounded_rectangle((x0, 0, x0 + PH_W * s - 1, ch * s - 1), radius=PH_R * s, fill=rgb(C["gold"]))
    g = int(2.5 * s)
    d.rounded_rectangle((x0 + g, g, x0 + PH_W * s - 1 - g, ch * s - 1 - g), radius=PH_R * s - g,
                        fill=rgb("#0B0A12"))
    b = BEZ * s
    d.rounded_rectangle((x0 + b, b, x0 + (PH_W - BEZ) * s - 1, (PH_H - BEZ) * s - 1), radius=SCR_R * s,
                        fill=(0, 0, 0))
    return im.resize((cw, ch), Image.LANCZOS)


def _screen_mask():
    s = 3
    m = Image.new("L", (SCR_W * s, SCR_H * s), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, SCR_W * s - 1, SCR_H * s - 1), radius=SCR_R * s, fill=255)
    return m.resize((SCR_W, SCR_H), Image.LANCZOS)


_phones = {}


def phone_img(i):
    im = _phones.get(i)
    if im is None:
        if len(_phones) > 4:
            _phones.clear()
        im = img(derive("phone_body", _phone_body)).copy()
        im.paste(_app_frame(i), (4 + BEZ, BEZ), img(derive("phone_mask", _screen_mask)))
        disc(im, 4 + PH_W / 2, BEZ + 21, 7.5, "#050508", 1.0)          # punch-hole camera over the status bar
        _phones[i] = im
    return im


def draw_phone(fr, t, x, y, rot=0.0, a=1.0):
    im = phone_img(_app_index(t))
    if abs(rot) > 0.05:
        im = im.rotate(rot, Image.BICUBIC, expand=True)
    comp(fr, with_alpha(im, a), x - im.width / 2, y - im.height / 2)


def _button():
    """Gold pill: ink label, dark disc with a gold arrow on the right."""
    tw = text_w([(C["ink"], BTN_LABEL)], "bold", BTN_SIZE)
    cd, pl, gap, pr = 68, 52, 24, 18
    bw, bh = int(pl + tw + gap + cd + pr), BTN_H
    ys = np.linspace(0, 1, bh, dtype=np.float32)[:, None, None]
    top, bot = np.array(rgb("#F4DB97"), np.float32), np.array(rgb("#C99A45"), np.float32)
    col = np.repeat(top * (1 - ys) + bot * ys, bw, axis=1)
    im = Image.fromarray(np.dstack([col, _rr_alpha(bw, bh, bh / 2) * 255]).astype(np.uint8), "RGBA")
    line(im, bh / 2, 6, bw - bh / 2, 6, 2, "#FFF4D0", 0.6)
    text(im, [(C["ink"], BTN_LABEL)], "bold", BTN_SIZE, pl, bh / 2 + 0.34 * BTN_SIZE, ha="l")
    cx, cy = bw - pr - cd / 2, bh / 2
    disc(im, cx, cy, cd / 2, C["ink"], 1.0)
    line(im, cx - 13, cy, cx + 12, cy, 4, C["gold_lt"], 1.0)
    line(im, cx + 13, cy, cx + 2, cy - 11, 4, C["gold_lt"], 1.0)
    line(im, cx + 13, cy, cx + 2, cy + 11, 4, C["gold_lt"], 1.0)
    return im


def _shined(b, k):
    arr = np.asarray(b).astype(np.float32)
    h, w = arr.shape[:2]
    ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
    x0 = lerp(-0.3 * w, 1.3 * w, eio(k))
    band = np.exp(-(((xs - x0) + 0.55 * (ys - h / 2)) / 26.0) ** 2) * 0.55
    arr[..., :3] += (255 - arr[..., :3]) * band[..., None]
    return Image.fromarray(arr.clip(0, 255).astype(np.uint8), "RGBA")


def button_w():
    return img(derive("cta_button", _button)).width


def draw_button(fr, y=BTN_Y, s=1.0, a=1.0, shine=None):
    if a <= 0.004 or s <= 0.05:
        return
    b = img(derive("cta_button", _button))
    glow(fr, W / 2, y + 6, b.width * 0.72 * s, C["gold"], 0.32 * a)
    ellipse(fr, W / 2, y + 0.5 * BTN_H * s + 10, b.width * 0.42 * s, 12 * s, "#000000", 0.35 * a, soft=10)
    im = _shined(b, shine) if shine is not None and 0 < shine < 1 else b
    if abs(s - 1) > 0.002:
        im = im.resize((max(2, int(b.width * s)), max(2, int(b.height * s))), Image.BICUBIC)
    comp(fr, with_alpha(im, a), W / 2 - im.width / 2, y - im.height / 2)


def tap(fr, t, t_tap, x, y, finger=True):
    """Touch indicator sliding onto (x, y), a press, then two ripples."""
    if finger:
        kf = win(t, t_tap - 0.32, t_tap + 0.22, 0.14, 0.18)
        if kf > 0.01:
            m = eo(p(t, t_tap - 0.32, 0.3))
            fx, fy = lerp(x + 70, x, m), lerp(y + 90, y, m)
            r = 30 * (1 - 0.25 * win(t, t_tap - 0.04, t_tap + 0.1, 0.04, 0.08))
            disc(fr, fx, fy, r + 3, "#FFFFFF", 0.22 * kf, soft=3)
            disc(fr, fx, fy, r, "#FFFFFF", 0.42 * kf, soft=2)
    for dt, r1, wd, col, al in ((0.0, 170, 4, "#FFF4D0", 0.75), (0.12, 130, 3, C["gold_lt"], 0.5)):
        q = p(t, t_tap + dt, 0.6)
        if 0 < q < 1:
            ring(fr, x, y, lerp(28, r1, eo(q)), wd, col, al * (1 - q))


def motes(fr, t, a=1.0, x0=40, x1=1040, y0=340, y1=1330):
    """Slow gold dust rising behind everything."""
    for fx, fy, sp, r, ph in MOTES:
        y = y1 - ((fy * (y1 - y0) + sp * 28 * t) % (y1 - y0))
        x = x0 + fx * (x1 - x0) + 10 * math.sin(t * 0.8 + ph)
        k = a * (0.55 + 0.45 * math.sin(t * 2.3 + ph * 2.1)) * min(1.0, (y - y0) / 80, (y1 - y) / 80)
        if k > 0.01:
            glow(fr, x, y, r * 9, C["gold_lt"], 0.22 * k)
            disc(fr, x, y, r, C["gold_lt"], 0.7 * k)


def mini_orb(fr, x, y, a, r=17.0):
    glow(fr, x, y, r * 5.5, C["shani_lt"], 0.55 * a)
    disc(fr, x, y, r, C["shani"], a, soft=2)
    ring(fr, x, y, r, 2.5, C["shani_lt"], 0.9 * a)
    disc(fr, x - r * 0.32, y - r * 0.34, r * 0.22, "#C9D2F2", 0.6 * a, soft=3)


def _orb_pos(t, t_hop, t_in, tgt):
    h = eio(p(t, t_hop, 0.5))
    x = lerp(H3[0], H11[0], h)
    y = lerp(H3[1], H11[1], h) - 150 * math.sin(math.pi * h) + wobble(t, 6, 0.4, 1.0)
    kf = eio(p(t, t_in, 0.28))
    return lerp(x, tgt[0], kf), lerp(y, tgt[1], kf), kf


@scene(62.70, 66.45, "dark", tin=("up", 0.35))
def s12_app(fr, t):
    q0, q0e, q1 = SEG("L12", 0), SEG("L12", 0, True), SEG("L12", 1)
    t_hop, t_q, t_in, t_tap = q0 + 0.95, q0 + 1.55, q0e + 0.02, q1 + 0.62
    ke = p(t, 62.70, 0.7)
    py = PH_Y + (1 - eob(ke)) * 140 + wobble(t, 5, 0.22)
    glow(fr, 540, 860, 780, "#2A2560", 0.55)
    glow(fr, 540, py, 600, C["gold"], 0.14 + 0.1 * env(t))
    motes(fr, t)
    kundli(fr, 540, PH_Y, 900, eo(p(t, 62.78, 1.1)), C["gold"], 0.17, 2.0)
    # Shani's orb sits in one house, hops to another on "कहाँ", then flies into the app's question bar
    ka = p(t, q0 + 0.25, 0.35)
    ox, oy, kf = _orb_pos(t, t_hop, t_in, (540, py + INPUT_DY))
    if ka > 0 and kf <= 0:
        mini_orb(fr, ox, oy, min(1, ka * 2), r=22 * lerp(0.3, 1.0, eob(ka)))
    draw_phone(fr, t, PH_X, py, rot=-4.0 * (1 - eo(ke)))
    if 0 < kf < 1:
        mini_orb(fr, ox, oy, 1 - kf ** 3, r=22 * (1 - 0.55 * kf))
    kfl = win(t, t_in + 0.24, t_in + 0.75, 0.05, 0.4)
    if kfl > 0:
        glow(fr, 540, py + INPUT_DY, 260, C["shani_lt"], 0.55 * kfl)
    kq_in = p(t, t_q, 0.35)
    kq = min(1, kq_in * 2) * (1 - p(t, t_in, 0.12))
    if kq > 0:
        text(fr, [(C["gold_lt"], "?")], "latinsemi", 62, ox + 46, oy - 20, ha="c", a=kq,
             scale=lerp(1.5, 1, eob(kq_in)))
    kb = p(t, q1 - 0.03, 0.42)
    if kb > 0:
        press = 1 - 0.06 * win(t, t_tap - 0.05, t_tap + 0.16, 0.05, 0.12)
        draw_button(fr, BTN_Y, s=lerp(0.55, 1.0, eob(kb)) * press, a=min(1, kb * 2.5))
        tap(fr, t, t_tap, W / 2 + button_w() / 2 - 18 - 34, BTN_Y)


# ---------------------------------------------------------------- S13 end card
@scene(66.45, TOTAL, "dark", caps=False, chip=False, header=False, tin=("fade", 0.3))
def s13_end(fr, t):
    k = p(t, 66.47, 0.55)
    glow(fr, 540, 760, 760, "#2A2560", 0.6)
    motes(fr, t)
    glow(fr, 540, 690, 480, C["gold"], 0.22 * eo(k))
    s = lerp(0.84, 1.0, eob(k))
    lh = 400 * s
    place(fr, "logo_full", 540, 690, h=lh, a=eo(k))
    fl = 0.75 + 0.25 * math.sin(t * 13.1) * math.sin(t * 7.3 + 1.0)        # diya flame flicker
    glow(fr, 540 + (0.495 - 0.5) * lh * 399 / 472, 690 + (0.526 - 0.5) * lh, 90 * s, C["surya_lt"], 0.35 * eo(k) * fl)
    k2 = eo(p(t, 66.72, 0.45))
    if k2 > 0:
        text(fr, [(C["ivory"], "jyotiq.ai")], "latinsemi", 54, W / 2, 1012 + 18 * (1 - k2), ha="c", a=k2, track=1)
    k3 = eo(p(t, 66.92, 0.45))
    if k3 > 0:
        lab = [(C["gold_lt"], "LINK IN BIO")]
        w3 = text_w(lab, "latinmed", 19, track=6)
        text(fr, lab, "latinmed", 19, W / 2, 1064, ha="c", a=k3, track=6)
        for sgn in (-1, 1):
            xa = W / 2 + sgn * (w3 / 2 + 24)
            line(fr, xa, 1057, xa + sgn * 90 * k3, 1057, 1.5, C["gold"], 0.7 * k3)
    br = win(t, 67.35, TOTAL + 1, 0.4, 0.1)
    sh = None
    for ts in (67.25, 68.3):
        if ts <= t < ts + 0.6:
            sh = (t - ts) / 0.6
    draw_button(fr, BTN_Y, s=1 + 0.028 * math.sin(2 * math.pi * 1.15 * (t - 67.35)) * br, shine=sh)
    tap(fr, t, 67.95, W / 2 + button_w() / 2 - 18 - 34, BTN_Y, finger=False)
    k4 = eo(p(t, 67.15, 0.6))
    if k4 > 0:
        text(fr, [(C["ivory"], "तमसो मा ज्योतिर्गमय")], "med", 30, W / 2, 1332, ha="c", a=0.62 * k4)
