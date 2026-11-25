"""Hindi shaping test sheet for textr with the reel fonts, on paper and on the dark background."""
import os

from PIL import Image

from textlib import render

S = os.environ["KIROCREW_SCRATCH"]
INK, PAPER, DARK, IVORY, VIOLET, GOLD = "1B1A2E", "EFE6D3", "17142B", "F3ECDD", "7A6A9E", "E2A83A"
ROWS = [
    ([(INK, "शनि देव")], "title", 120, 0),
    ([(INK, "साँवले क्यों हैं?")], "title", 96, 0),
    ([(INK, "पर माँ हैं, "), (VIOLET, "छाया")], "semi", 50, 0),
    ([(INK, "ग़ुस्से वाले हैं? · ज्योतिक़ से पूछिए")], "med", 42, 0),
    ([(INK, "सनक · सनन्दन · सनातन · सनत्कुमार")], "bold", 42, 0),
    ([(INK, "कर्मफल दाता · शत्रु · पुत्र · दृष्टि · संज्ञा")], "semi", 42, 0),
    ([(INK, "रंग नहीं, कर्म। · तेज मंद पड़ गया · तप")], "reg", 42, 0),
    ([(GOLD, "FATHER · SUN   GIVER OF KARMA'S FRUIT")], "latinmed", 22, 3),
]
W = 1080


def sheet(bg, recolor=None):
    ims = []
    for runs, font, size, tr in ROWS:
        if recolor:
            runs = [(recolor.get(c, c), t) for c, t in runs]
        ims.append(render(runs, font, size, tr)[0])
    can = Image.new("RGBA", (W, sum(im.height + 12 for im in ims) + 40), "#" + bg)
    y = 20
    for im in ims:
        can.alpha_composite(im, (40, y))
        y += im.height + 12
    return can


a = sheet(PAPER)
b = sheet(DARK, {INK: IVORY})
out = Image.new("RGB", (W, a.height + b.height))
out.paste(a.convert("RGB"), (0, 0))
out.paste(b.convert("RGB"), (0, a.height))
os.makedirs(os.path.join(S, "ttest"), exist_ok=True)
p = os.path.join(S, "ttest", "sheet.png")
out.save(p)
print("wrote", p, out.size)
