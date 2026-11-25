"""Turn a copy of video/scripts/diwali_d2_audio.py into Day 3's (diwali_d3_audio.py): running order, line texts,
cues and scenes, voices, scene levels and low-end hits. The --placeholder mode comes with the Day 2 copy.
It refuses to overwrite an existing diwali_d3_audio.py, and refuses to write if a Day 2 name is left over or a cue the
mix uses is missing.
Run once: /usr/local/bin/python3 /Users/ayushrajput/.kiro/crew/workspace/jyotiq-marketing/diwali-series/splice_d3_audio.py
"""
import re
from pathlib import Path

S = Path("/Users/ayushrajput/.kiro/crew/workspace/video/scripts")
SRC = S / "diwali_d2_audio.py"
F = S / "diwali_d3_audio.py"
if F.exists():
    raise SystemExit(f"{F} exists; not overwriting")
t = SRC.read_text()
for a, b in [("diwali-d2", "diwali-d3"), ("diwali/d2/", "diwali/d3/"), ("diwali_d2_", "diwali_d3_"), ("Day 2", "Day 3")]:
    t = t.replace(a, b)


def block(t, start, end, new, include_end=False):
    a = t.index(start)
    b = t.index(end, a) + (len(end) if include_end else 0)
    return t[:a] + new + t[b:]


ORDER = '''ORDER = [
    ("vo", "01_narrator", 4),        # hook: a city glittering with diyas on Diwali night, tilting up into a moonless sky
    ("beat", "title", 4, 12),        # the title over the dark sky
    ("vo", "02_narrator", 2),        # the sky: the new moon and the Sun weak in Tula
    ("vo", "03_narrator", 5),        # rishis light the first diya; a diya wave across the land
    ("vo", "04_lakshmi", 5),         # Lakshmi on her lotus at a lit doorway
    ("vo", "05_narrator", 5),        # the Pushpak vimana over Ayodhya as the houses light up
    ("vo", "06_narrator", 5),        # 1 to 14 years, then the dasha timeline
    ("vo", "07_narrator", 4),        # dawn over the dark sky; diya 3 lights on 'ख़त्म'
    ("beat", "glow", 0, 12),         # diya 3 glows; the row becomes the progress bar
    ("vo", "08_narrator", 3),        # the phone with the real app clip and the drawn dasha card
    ("vo", "jyotiq_signoff", 6),     # the end card: tomorrow's tease (Govardhan) and the Jyotiq block
    ("beat", "hold", 0, 12),
]
'''
t = block(t, "ORDER = [", "MISSES = []", ORDER)

TEXT = '''TEXT = {
    "01_narrator": "सबसे कम रोशनी की रात... और भारत का सबसे बड़ा त्योहार। क्यों?",
    "02_narrator": "अमावस्या का चंद्रमा, बिना रोशनी। और सूर्य तुला राशि में, अपनी सबसे कमज़ोर अवस्था में।",
    "03_narrator": "तो ऋषियों ने कहा, आसमान में रोशनी कम हो... तो धरती पर दीये जलाओ।",
    "04_lakshmi": "जिस घर में दीया जलता है, मैं वहीं आती हूँ।",
    "05_narrator": "मान्यता है, इसी रात वनवास से राम अयोध्या लौटे थे... और अयोध्या दीयों से जगमगा उठी।",
    "06_narrator": "चौदह साल का वनवास भी ख़त्म हुआ। ज्योतिष में, जीवन के दौर को कहते हैं... दशा।",
    "07_narrator": "हर दशा बदलती है। हर अंधेरा ख़त्म होता है।",
    "08_narrator": "आपकी कौन सी दशा चल रही है? ज्योतिक़ पे फ़्री देखिए। दिवाली की हार्दिक शुभकामनाएँ।",
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
        # 01 hook: the city of lamps, the dark sky on 'रोशनी', the turn on 'और', the '?' on 'क्यों'
        "roshni01": w("01_narrator", ["रोशनी"]),
        "cap01b": w("01_narrator", ["और"]),
        "bada01": w("01_narrator", ["बड़ा", "बडा"]),
        "kyon01": w("01_narrator", ["क्यों", "क्यूं", "क्यूँ", "क्यो"]),
        "rewind": B["title"][0] - 8,
        "titleHit": B["title"][0] + 4,
        # 02 the sky: the new moon on 'अमावस्या', the Sun on 'सूर्य', Tula, 'कमज़ोर'
        "amavasya02": w("02_narrator", ["अमावस्या", "अमावस", "अमावश्या"]),
        "cap02b": w("02_narrator", ["और"]),
        "surya02": w("02_narrator", ["सूर्य", "सूरज", "सुर्य"]),
        "tula02": w("02_narrator", ["तुला"]),
        "kamzor02": w("02_narrator", ["कमज़ोर", "कमजोर"]),
        # 03 the rishis on 'ऋषियों', the earth on 'धरती', the diya wave on 'दीये'
        "rishi03": w("03_narrator", ["ऋषियों", "ऋषि", "रिषियों", "ऋषियो"]),
        "cap03b": w("03_narrator", ["तो"], nth=1),
        "dharti03": w("03_narrator", ["धरती"]),
        "diye03": w("03_narrator", ["दीये", "दिये", "दीए"]),
        # 04 Lakshmi: her reveal, the lit home on 'दीया', 'मैं वहीं आती हूँ'
        "lakshmi04": s("04_lakshmi"),
        "diya04": w("04_lakshmi", ["दीया", "दिया"]),
        "cap04b": w("04_lakshmi", ["मैं", "मै"]),
        "aati04": w("04_lakshmi", ["आती"]),
        # 05 Ayodhya: Ram on 'राम', the city on 'अयोध्या', the lights on 'जगमगा'
        "ram05": w("05_narrator", ["राम"]),
        "ayodhya05": w("05_narrator", ["अयोध्या", "अयोद्या", "अयोध्य"]),
        "cap05b": w("05_narrator", ["और"]),
        "jagmaga05": w("05_narrator", ["जगमगा", "जगमग"]),
        # 06 the years on 'चौदह', 'ख़त्म', the dasha timeline on 'दशा'
        "chaudah06": w("06_narrator", ["चौदह", "चौदा", "चोदह"]),
        "khatam06": w("06_narrator", ["ख़त्म", "खत्म", "खतम"]),
        "cap06b": w("06_narrator", ["ज्योतिष", "जोतिश", "ज्योतिश", "जोतिष"]),
        "daur06": w("06_narrator", ["दौर", "दोर"]),
        "dasha06": w("06_narrator", ["दशा", "दसा"]),
        # 07 dawn: 'बदलती', 'अंधेरा', and diya 3 lights on 'ख़त्म'
        "badalti07": w("07_narrator", ["बदलती", "बदलति"]),
        "andhera07": w("07_narrator", ["अंधेरा", "अँधेरा", "अंधेरे"]),
        "khatam07": w("07_narrator", ["ख़त्म", "खत्म", "खतम"]),
        "glow": B["glow"][0],
        # 08 the dasha card on 'दशा', 'फ़्री', the greeting on 'दिवाली'
        "kaun08": w("08_narrator", ["कौन", "कोन"]),
        "dasha08": w("08_narrator", ["दशा", "दसा"]),
        "free08": w("08_narrator", ["फ्री", "फ़्री", "फ्रि"]),
        "cap08b": w("08_narrator", ["दिवाली", "दीवाली"]),
        # the close
        "signoff": s("jyotiq_signoff"),
        "offer": w("jyotiq_signoff", ["पहला"]),
        "brandChime": e("jyotiq_signoff") + 2,
    }
    scenes = {
        "hook": (0, B["title"][0]),
        "title": (B["title"][0], s("02_narrator")),
        "sky": (s("02_narrator"), s("03_narrator") - 3),
        "rishis": (s("03_narrator") - 3, s("04_lakshmi") - 3),
        "lakshmi": (s("04_lakshmi") - 3, s("05_narrator") - 3),
        "ayodhya": (s("05_narrator") - 3, s("06_narrator") - 3),
        "dasha": (s("06_narrator") - 3, s("07_narrator") - 2),
        "dawn": (s("07_narrator") - 2, B["glow"][1]),
        "app": (B["glow"][1], s("jyotiq_signoff")),
        "end": (s("jyotiq_signoff"), total),
    }
    return L, B, scenes, cues, total
'''
t = block(t, "def build_timing(frames):", "    return L, B, scenes, cues, total\n", TIMING, include_end=True)

t = block(t, "NARRATOR = {", "\nDHAN = {",
          'NARRATOR = {"01_narrator", "02_narrator", "03_narrator", "05_narrator", "06_narrator", "07_narrator",\n'
          '            "08_narrator", "jyotiq_signoff"}')
t = block(t, "DHAN = {", "\n", 'DHAN = {"04_lakshmi"}  # the non-narrator voice: Lakshmi, close and warm (the Day 1 Dhanvantari treatment)')
t = t.replace('LINE_TARGET = {"05_yamraj": -18.0}', 'LINE_TARGET = {"04_lakshmi": -18.0}')
t = block(t, "TANPURA_LV = {", "}\n",
          'TANPURA_LV = {"hook": 0.4, "title": 0.55, "sky": 0.45, "rishis": 0.45, "lakshmi": 0.5, "ayodhya": 0.4,\n'
          '              "dasha": 0.45, "dawn": 0.5, "app": 0.45, "end": 0.5}\n', include_end=True)
t = block(t, "KAAL_LV = {", "}\n",
          'KAAL_LV = {"hook": 0.5, "title": 0.7, "sky": 0.6, "rishis": 0.4, "lakshmi": 0.35, "ayodhya": 0.35,\n'
          '           "dasha": 0.6, "dawn": 0.45, "app": 0.35, "end": 0.45}\n', include_end=True)
OLD_BOOMS = ('    boom(c["titleHit"], 0.42, 38, 40, 1.8, "b1")      # the rewind lands in the legend: the title\n'
             '    boom(c["yama05"], 0.36, 34, 40, 2.4, "b2")        # Yamraj appears\n'
             '    boom(c["glow"] + 2, 0.26, 44, 30, 1.6, "b3")      # diya 2 lights')
NEW_BOOMS = ('    boom(c["titleHit"], 0.42, 38, 40, 1.8, "b1")      # the dark sky turns into the title\n'
             '    boom(c["lakshmi04"], 0.34, 36, 40, 2.4, "b2")     # Lakshmi appears\n'
             '    boom(c["glow"] + 2, 0.26, 44, 30, 1.6, "b3")      # diya 3 lights')
if OLD_BOOMS not in t:
    raise SystemExit("boom anchor not found")
t = t.replace(OLD_BOOMS, NEW_BOOMS)

keys = set(re.findall(r'"(\w+)": (?:w\(|s\(|e\(|B\[)', TIMING))
used = set(re.findall(r'c\["(\w+)"\]', t))
miss = sorted(used - keys)
leftover = [x for x in ("05_yamraj", "04_narrator", "chauthi", "samay06", '"hora"', '"palace"', '"serpent"', '"lamps"', '"yama"')
            if x in t]
if miss or leftover:
    raise SystemExit(f"not written: cues used but not defined {miss}; Day 2 names left {leftover}")
F.write_text(t)
print("spliced", F, "lines:", len(t.splitlines()))
