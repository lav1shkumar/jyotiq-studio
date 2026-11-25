"""Turn a copy of video/scripts/diwali_d4_audio.py into Day 5's (diwali_d5_audio.py): running order, line texts,
cues and scenes, voices, scene levels and low-end hits. The --placeholder mode comes with the copy.
It refuses to overwrite an existing diwali_d5_audio.py, and refuses to write if a Day 4 name is left over or a cue the
mix uses is missing.
Run once: /usr/local/bin/python3 /Users/ayushrajput/.kiro/crew/workspace/jyotiq-marketing/diwali-series/splice_d5_audio.py
"""
import re
from pathlib import Path

S = Path("/Users/ayushrajput/.kiro/crew/workspace/video/scripts")
SRC = S / "diwali_d4_audio.py"
F = S / "diwali_d5_audio.py"
if F.exists():
    raise SystemExit(f"{F} exists; not overwriting")
t = SRC.read_text()
for a, b in [("diwali-d4", "diwali-d5"), ("diwali/d4/", "diwali/d5/"), ("diwali_d4_", "diwali_d5_"), ("Day 4", "Day 5")]:
    t = t.replace(a, b)


def block(t, start, end, new, include_end=False):
    a = t.index(start)
    b = t.index(end, a) + (len(end) if include_end else 0)
    return t[:a] + new + t[b:]


ORDER = '''ORDER = [
    ("vo", "01_narrator", 4),        # hook: Yamraj at a humble doorway lit warm from inside (lit from frame 0)
    ("beat", "title", 4, 10),        # the title
    ("vo", "02_narrator", 2),        # Yamuna on her tortoise by the river, waiting through the seasons
    ("vo", "03_narrator", 3),        # the welcome: the tilak, the aarti, a leaf plate of food
    ("vo", "04_yamraj", 4),          # Yamraj close-up, moved: 'बहन का तिलक, भाई की रक्षा'
    ("vo", "05_narrator", 3),        # 'यम द्वितीया → भाई दूज'; diya 5 lights on 'दूज'
    ("beat", "glow", 0, 10),         # diya 5 glows; the row becomes the progress bar
    ("vo", "06_narrator", 3),        # the map of India with the day's regional names
    ("vo", "07_narrator", 3),        # 'त्योहार एक, भाषाएँ अनेक' with the language chips
    ("vo", "08_narrator", 3),        # the phone with the real app clip and the drawn language card
    ("vo", "jyotiq_signoff", 4),     # the end card: all five diyas light in turn; शुभ दीपावली
    ("beat", "hold", 0, 12),
]
'''
t = block(t, "ORDER = [", "MISSES = []", ORDER)

TEXT = '''TEXT = {
    "01_narrator": "मृत्यु के देवता, आज ही के दिन, अपनी बहन के घर खाना खाने गए थे।",
    "02_narrator": "यमुना, बरसों से भाई यम को बुलाती रहीं... पर यम हमेशा व्यस्त।",
    "03_narrator": "यम आए, तो यमुना ने तिलक लगाया, आरती उतारी, अपने हाथ से खाना खिलाया।",
    "04_yamraj": "आज जो भाई बहन के हाथ से तिलक लगवाएगा, उसे मेरा भय नहीं रहेगा।",
    "05_narrator": "इसीलिए ये दिन कहलाया, यम द्वितीया... भाई दूज।",
    "06_narrator": "और हर भाषा में इसका अपना नाम: भाऊबीज, भाई बीज, भाई फोंटा, भाई टीका।",
    "07_narrator": "त्योहार एक, भाषाएँ अनेक। ज्योतिक़ भी बात करता है आपकी अपनी भाषा में।",
    "08_narrator": "हिंदी, पंजाबी, गुजराती, मराठी, इंग्लिश में बात कीजिए। भाई दूज की हार्दिक शुभकामनाएँ।",
    "jyotiq_signoff": "ज्योतिक़ से पूछिए। पहला सवाल फ़्री।",
}
'''
t = block(t, "TEXT = {", "RATE = 15.1", TEXT)

TIMING = '''def build_timing(frames):
    L, B, total = layout(frames)

    def s(k):
        return L[k][0]

    def e(k):
        return L[k][1]

    def w(key, needles, nth=0, lead=0):
        return word_cue(L, key, needles, nth, lead)

    cues = {
        # 01 hook: Yamraj at the door; 'देवता', 'बहन', 'खाना'
        "devta01": w("01_narrator", ["देवता"]),
        "behan01": w("01_narrator", ["बहन", "बेहन"]),
        "khana01": w("01_narrator", ["खाना"]),
        "rewind": B["title"][0] - 8,
        "titleHit": B["title"][0] + 4,
        # 02 Yamuna waiting: 'यमुना', 'बरसों', the turn on 'पर', 'व्यस्त'
        "yamuna02": w("02_narrator", ["यमुना"]),
        "barson02": w("02_narrator", ["बरसों", "बरसो"]),
        "cap02b": w("02_narrator", ["पर"]),
        "vyast02": w("02_narrator", ["व्यस्त", "व्यस्थ"]),
        # 03 the welcome: 'तिलक', 'आरती', the meal on 'अपने'
        "aaye03": w("03_narrator", ["आए", "आये"]),
        "tilak03": w("03_narrator", ["तिलक"]),
        "aarti03": w("03_narrator", ["आरती"]),
        "cap03b": w("03_narrator", ["अपने"]),
        # 04 Yamraj: his close-up, 'तिलक', the gold words on 'उसे', 'भय'
        "yama04": s("04_yamraj"),
        "tilak04": w("04_yamraj", ["तिलक"]),
        "cap04b": w("04_yamraj", ["उसे"]),
        "bhay04": w("04_yamraj", ["भय"]),
        # 05 the name: 'द्वितीया', and diya 5 lights on 'दूज'
        "dwitiya05": w("05_narrator", ["द्वितीया", "द्वितिया", "दूतिया"]),
        "dooj05": w("05_narrator", ["दूज"]),
        "glow": B["glow"][0],
        # 06 the map: 'भाषा', then each regional name
        "bhasha06": w("06_narrator", ["भाषा"]),
        "bhaubeej06": w("06_narrator", ["भाऊबीज", "भाऊ", "भाउबीज"]),
        "bhai06a": w("06_narrator", ["भाई"]),
        "bhai06b": w("06_narrator", ["भाई"], nth=1),
        "bhai06c": w("06_narrator", ["भाई"], nth=2),
        # 07 one festival, many languages: 'एक', 'अनेक', 'ज्योतिक़', 'अपनी'
        "ek07": w("07_narrator", ["एक"]),
        "anek07": w("07_narrator", ["अनेक"]),
        "cap07b": w("07_narrator", ["ज्योतिक़", "ज्योतिक", "जोतिक"]),
        "apni07": w("07_narrator", ["अपनी"]),
        # 08 the language chips, one per name, and the greeting on 'भाई'
        "hindi08": w("08_narrator", ["हिंदी", "हिन्दी"]),
        "punjabi08": w("08_narrator", ["पंजाबी"]),
        "gujarati08": w("08_narrator", ["गुजराती"]),
        "marathi08": w("08_narrator", ["मराठी"]),
        "english08": w("08_narrator", ["इंग्लिश", "इंगलिश", "अंग्रेज़ी"]),
        "cap08b": w("08_narrator", ["भाई"]),
        # the close
        "signoff": s("jyotiq_signoff"),
        "offer": w("jyotiq_signoff", ["पहला"]),
        "brandChime": e("jyotiq_signoff") + 2,
    }
    scenes = {
        "hook": (0, B["title"][0]),
        "title": (B["title"][0], s("02_narrator")),
        "yamuna": (s("02_narrator"), s("03_narrator") - 3),
        "welcome": (s("03_narrator") - 3, s("04_yamraj") - 3),
        "yama": (s("04_yamraj") - 3, s("05_narrator") - 3),
        "name": (s("05_narrator") - 3, B["glow"][1]),
        "map": (B["glow"][1], s("07_narrator") - 3),
        "langs": (s("07_narrator") - 3, s("08_narrator") - 3),
        "app": (s("08_narrator") - 3, s("jyotiq_signoff")),
        "end": (s("jyotiq_signoff"), total),
    }
    return L, B, scenes, cues, total
'''
t = block(t, "def build_timing(frames):", "    return L, B, scenes, cues, total\n", TIMING, include_end=True)

t = block(t, "NARRATOR = {", "\nDHAN = {",
          'NARRATOR = {"01_narrator", "02_narrator", "03_narrator", "05_narrator", "06_narrator", "07_narrator",\n'
          '            "08_narrator", "jyotiq_signoff"}')
t = block(t, "DHAN = {", "\n", 'DHAN = {"04_yamraj"}  # the non-narrator voice: Yamraj, close and warm (the Day 1 Dhanvantari treatment)')
t = t.replace('LINE_TARGET = {"05_krishna": -18.0}', 'LINE_TARGET = {"04_yamraj": -18.0}')
t = block(t, "TANPURA_LV = {", "}\n",
          'TANPURA_LV = {"hook": 0.4, "title": 0.55, "yamuna": 0.45, "welcome": 0.5, "yama": 0.5, "name": 0.45,\n'
          '              "map": 0.45, "langs": 0.45, "app": 0.45, "end": 0.55}\n', include_end=True)
t = block(t, "KAAL_LV = {", "}\n",
          'KAAL_LV = {"hook": 0.5, "title": 0.7, "yamuna": 0.45, "welcome": 0.35, "yama": 0.4, "name": 0.55,\n'
          '           "map": 0.35, "langs": 0.35, "app": 0.35, "end": 0.45}\n', include_end=True)
OLD_BOOMS = ('    boom(c["titleHit"], 0.42, 38, 40, 1.8, "b1")      # the food hill becomes Govardhan: the title\n'
             '    boom(c["krishna05"], 0.34, 36, 40, 2.4, "b2")     # Krishna speaks\n'
             '    boom(c["glow"] + 2, 0.26, 44, 30, 1.6, "b3")      # diya 4 lights')
NEW_BOOMS = ('    boom(c["titleHit"], 0.42, 38, 40, 1.8, "b1")      # the doorway turns into the title\n'
             '    boom(c["yama04"], 0.34, 36, 40, 2.4, "b2")        # Yamraj speaks\n'
             '    boom(c["glow"] + 2, 0.26, 44, 30, 1.6, "b3")      # diya 5 lights')
if OLD_BOOMS not in t:
    raise SystemExit("boom anchor not found")
t = t.replace(OLD_BOOMS, NEW_BOOMS)

keys = set(re.findall(r'"(\w+)": (?:w\(|s\(|e\(|B\[)', TIMING))
used = set(re.findall(r'c\["(\w+)"\]', t))
miss = sorted(used - keys)
leftover = [x for x in ("05_krishna", "04_narrator", '"gokul"', '"storm"', '"lift"', '"krishna"', '"annakoot"', '"gochar"') if x in t]
if miss or leftover:
    raise SystemExit(f"not written: cues used but not defined {miss}; Day 4 names left {leftover}")
F.write_text(t)
print("spliced", F, "lines:", len(t.splitlines()))
