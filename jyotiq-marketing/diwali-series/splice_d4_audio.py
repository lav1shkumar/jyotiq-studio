"""Turn a copy of video/scripts/diwali_d3_audio.py into Day 4's (diwali_d4_audio.py): running order, line texts,
cues and scenes, voices, scene levels and low-end hits. The --placeholder mode comes with the copy.
It refuses to overwrite an existing diwali_d4_audio.py, and refuses to write if a Day 3 name is left over or a cue the
mix uses is missing.
Run once: /usr/local/bin/python3 /Users/ayushrajput/.kiro/crew/workspace/jyotiq-marketing/diwali-series/splice_d4_audio.py
"""
import re
from pathlib import Path

S = Path("/Users/ayushrajput/.kiro/crew/workspace/video/scripts")
SRC = S / "diwali_d3_audio.py"
F = S / "diwali_d4_audio.py"
if F.exists():
    raise SystemExit(f"{F} exists; not overwriting")
t = SRC.read_text()
for a, b in [("diwali-d3", "diwali-d4"), ("diwali/d3/", "diwali/d4/"), ("diwali_d3_", "diwali_d4_"), ("Day 3", "Day 4")]:
    t = t.replace(a, b)


def block(t, start, end, new, include_end=False):
    a = t.index(start)
    b = t.index(end, a) + (len(end) if include_end else 0)
    return t[:a] + new + t[b:]


ORDER = '''ORDER = [
    ("vo", "01_narrator", 4),        # hook: an Annakoot thali, a hill of food on brass ringed with diyas (lit from frame 0)
    ("beat", "title", 4, 12),        # the food hill dissolves into Govardhan; the title
    ("vo", "02_narrator", 2),        # Gokul offering to Indra; Krishna points at the hill
    ("vo", "03_narrator", 5),        # Indra on Airavata in the storm
    ("vo", "04_narrator", 5),        # Krishna lifts Govardhan on his little finger; the village shelters
    ("vo", "05_krishna", 5),         # Krishna close-up: 'प्रकृति का सम्मान = रक्षा'
    ("vo", "06_narrator", 5),        # cooking together under the hill; the food mound matches back to the thali
    ("vo", "07_narrator", 4),        # the gochar wheel; diya 4 lights on 'बदलाव'
    ("beat", "glow", 0, 12),         # diya 4 glows; the row becomes the progress bar
    ("vo", "08_narrator", 3),        # the phone with the real app clip and the drawn gochar card
    ("vo", "jyotiq_signoff", 6),     # the end card: tomorrow's tease (Yamraj at his sister's door) and the Jyotiq block
    ("beat", "hold", 0, 12),
]
'''
t = block(t, "ORDER = [", "MISSES = []", ORDER)

TEXT = '''TEXT = {
    "01_narrator": "अन्नकूट में हर सब्ज़ी एक साथ क्यों पकती है? जवाब... एक पहाड़ के नीचे है।",
    "02_narrator": "गोकुल वाले इंद्र को पूजते थे। कृष्ण बोले... पूजा उस पर्वत की करो, जो हमें पालता है।",
    "03_narrator": "इंद्र क्रोधित हुए। सात दिन, सात रात, भयंकर तूफ़ान।",
    "04_narrator": "कृष्ण ने छोटी उंगली पर पूरा गोवर्धन उठा लिया... सारा गाँव उसके नीचे।",
    "05_krishna": "डरो मत। जो प्रकृति का सम्मान करता है, प्रकृति उसकी रक्षा करती है।",
    "06_narrator": "कहते हैं, सात दिन पहाड़ के नीचे जो भी मिला, सब मिलाकर पकाया गया... वही है अन्नकूट।",
    "07_narrator": "ज्योतिष में भी, बड़े बदलाव आते हैं ग्रहों के गोचर से।",
    "08_narrator": "शनि, राहु, गुरु अभी कहाँ हैं? ज्योतिक़ पे गोचर फ़्री देखिए। गोवर्धन पूजा की शुभकामनाएँ।",
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
        # 01 hook: the thali, 'सब्ज़ी', the '?' on 'क्यों', the answer on 'जवाब', the hill on 'पहाड़'
        "sabzi01": w("01_narrator", ["सब्ज़ी", "सब्जी", "सबजी"]),
        "kyon01": w("01_narrator", ["क्यों", "क्यूं", "क्यूँ", "क्यो"]),
        "jawab01": w("01_narrator", ["जवाब", "जबाब"]),
        "pahad01": w("01_narrator", ["पहाड़", "पहाड"]),
        "rewind": B["title"][0] - 8,
        "titleHit": B["title"][0] + 4,
        # 02 Gokul: 'इंद्र', Krishna on 'कृष्ण', the hill on 'पर्वत'
        "gokul02": w("02_narrator", ["गोकुल"]),
        "indra02": w("02_narrator", ["इंद्र", "इन्द्र"]),
        "krishna02": w("02_narrator", ["कृष्ण", "क्रिष्ण", "कृष्णा"]),
        "parvat02": w("02_narrator", ["पर्वत"]),
        "palta02": w("02_narrator", ["पालता"]),
        # 03 the storm: 'क्रोधित', 'सात', 'तूफ़ान'
        "indra03": w("03_narrator", ["इंद्र", "इन्द्र"]),
        "krodh03": w("03_narrator", ["क्रोधित", "क्रोध"]),
        "saat03": w("03_narrator", ["सात"]),
        "toofan03": w("03_narrator", ["तूफ़ान", "तूफान", "तुफान"]),
        # 04 the lift: 'उंगली', 'गोवर्धन', 'सारा गाँव'
        "ungli04": w("04_narrator", ["उंगली", "उँगली", "ऊँगली"]),
        "govardhan04": w("04_narrator", ["गोवर्धन", "गोबर्धन"]),
        "cap04b": w("04_narrator", ["सारा"]),
        "gaon04": w("04_narrator", ["गाँव", "गांव"]),
        # 05 Krishna: his close-up, 'डरो मत', 'प्रकृति', the gold words on the second 'प्रकृति' and 'रक्षा'
        "krishna05": s("05_krishna"),
        "daro05": w("05_krishna", ["डरो"]),
        "prakriti05": w("05_krishna", ["प्रकृति", "प्रकृती"]),
        "cap05b": w("05_krishna", ["प्रकृति", "प्रकृती"], nth=1),
        "raksha05": w("05_krishna", ["रक्षा", "रकषा"]),
        # 06 Annakoot: 'पहाड़', 'मिला', the mound on 'वही', 'अन्नकूट'
        "kehte06": w("06_narrator", ["कहते"]),
        "pahad06": w("06_narrator", ["पहाड़", "पहाड"]),
        "mila06": w("06_narrator", ["मिला"]),
        "cap06b": w("06_narrator", ["वही"]),
        "annakoot06": w("06_narrator", ["अन्नकूट", "अन्नकुट", "अनकूट"]),
        # 07 the gochar wheel: diya 4 lights on 'बदलाव', 'गोचर'
        "jyotish07": w("07_narrator", ["ज्योतिष", "जोतिश", "ज्योतिश", "जोतिष"]),
        "badlav07": w("07_narrator", ["बदलाव", "बदलाओ"]),
        "gochar07": w("07_narrator", ["गोचर"]),
        "glow": B["glow"][0],
        # 08 the gochar card: 'शनि', 'राहु', 'गुरु', 'गोचर', 'फ़्री', the greeting on 'गोवर्धन'
        "shani08": w("08_narrator", ["शनि"]),
        "rahu08": w("08_narrator", ["राहु"]),
        "guru08": w("08_narrator", ["गुरु", "गुरू"]),
        "gochar08": w("08_narrator", ["गोचर"]),
        "free08": w("08_narrator", ["फ्री", "फ़्री", "फ्रि"]),
        "cap08b": w("08_narrator", ["गोवर्धन", "गोबर्धन"]),
        # the close
        "signoff": s("jyotiq_signoff"),
        "offer": w("jyotiq_signoff", ["पहला"]),
        "brandChime": e("jyotiq_signoff") + 2,
    }
    scenes = {
        "hook": (0, B["title"][0]),
        "title": (B["title"][0], s("02_narrator")),
        "gokul": (s("02_narrator"), s("03_narrator") - 3),
        "storm": (s("03_narrator") - 3, s("04_narrator") - 3),
        "lift": (s("04_narrator") - 3, s("05_krishna") - 3),
        "krishna": (s("05_krishna") - 3, s("06_narrator") - 3),
        "annakoot": (s("06_narrator") - 3, s("07_narrator") - 2),
        "gochar": (s("07_narrator") - 2, B["glow"][1]),
        "app": (B["glow"][1], s("jyotiq_signoff")),
        "end": (s("jyotiq_signoff"), total),
    }
    return L, B, scenes, cues, total
'''
t = block(t, "def build_timing(frames):", "    return L, B, scenes, cues, total\n", TIMING, include_end=True)

t = block(t, "NARRATOR = {", "\nDHAN = {",
          'NARRATOR = {"01_narrator", "02_narrator", "03_narrator", "04_narrator", "06_narrator", "07_narrator",\n'
          '            "08_narrator", "jyotiq_signoff"}')
t = block(t, "DHAN = {", "\n", 'DHAN = {"05_krishna"}  # the non-narrator voice: Krishna, close and warm (the Day 1 Dhanvantari treatment)')
t = t.replace('LINE_TARGET = {"04_lakshmi": -18.0}', 'LINE_TARGET = {"05_krishna": -18.0}')
t = block(t, "TANPURA_LV = {", "}\n",
          'TANPURA_LV = {"hook": 0.4, "title": 0.55, "gokul": 0.45, "storm": 0.3, "lift": 0.45, "krishna": 0.5,\n'
          '              "annakoot": 0.45, "gochar": 0.45, "app": 0.45, "end": 0.5}\n', include_end=True)
t = block(t, "KAAL_LV = {", "}\n",
          'KAAL_LV = {"hook": 0.45, "title": 0.7, "gokul": 0.4, "storm": 0.6, "lift": 0.5, "krishna": 0.35,\n'
          '           "annakoot": 0.35, "gochar": 0.6, "app": 0.35, "end": 0.45}\n', include_end=True)
OLD_BOOMS = ('    boom(c["titleHit"], 0.42, 38, 40, 1.8, "b1")      # the dark sky turns into the title\n'
             '    boom(c["lakshmi04"], 0.34, 36, 40, 2.4, "b2")     # Lakshmi appears\n'
             '    boom(c["glow"] + 2, 0.26, 44, 30, 1.6, "b3")      # diya 3 lights')
NEW_BOOMS = ('    boom(c["titleHit"], 0.42, 38, 40, 1.8, "b1")      # the food hill becomes Govardhan: the title\n'
             '    boom(c["krishna05"], 0.34, 36, 40, 2.4, "b2")     # Krishna speaks\n'
             '    boom(c["glow"] + 2, 0.26, 44, 30, 1.6, "b3")      # diya 4 lights')
if OLD_BOOMS not in t:
    raise SystemExit("boom anchor not found")
t = t.replace(OLD_BOOMS, NEW_BOOMS)

keys = set(re.findall(r'"(\w+)": (?:w\(|s\(|e\(|B\[)', TIMING))
used = set(re.findall(r'c\["(\w+)"\]', t))
miss = sorted(used - keys)
leftover = [x for x in ("04_lakshmi", "05_narrator", '"sky"', '"rishis"', '"lakshmi"', '"ayodhya"', '"dasha"', '"dawn"') if x in t]
if miss or leftover:
    raise SystemExit(f"not written: cues used but not defined {miss}; Day 3 names left {leftover}")
F.write_text(t)
print("spliced", F, "lines:", len(t.splitlines()))
