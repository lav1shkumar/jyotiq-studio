"""Turn video/scripts/diwali_d2_audio.py (a copy of Day 1's) into Day 2's: cues and scenes, voices, scene levels,
low-end hits, and the --placeholder mode (timing estimated from the script before the takes exist).
Run once: /usr/local/bin/python3 /Users/ayushrajput/.kiro/crew/workspace/jyotiq-marketing/diwali-series/splice_d2_audio.py
"""
from pathlib import Path

F = Path("/Users/ayushrajput/.kiro/crew/workspace/video/scripts/diwali_d2_audio.py")
t = F.read_text()

TIMING = '''def build_timing(frames):
    L, B, total = layout(frames)

    def s(k):
        return L[k][0]

    def e(k):
        return L[k][1]

    def w(key, needles, nth=0, lead=0):
        return word_cue(L, key, needles, nth, lead)

    cues = {
        # 01 hook: the diya on 'दीया', Yamraj's name, 'मृत्यु', the '?' on 'क्यों'
        "diya01": w("01_narrator", ["दीया", "दिया"]),
        "yamraj01": w("01_narrator", ["यमराज", "यम"]),
        "cap01b": w("01_narrator", ["मृत्यु", "मृत्य", "म्रित्यु"]),
        "kyon01": w("01_narrator", ["क्यों", "क्यूं", "क्यूँ", "क्यो"]),
        "rewind": B["title"][0] - 8,
        "titleHit": B["title"][0] + 4,
        # 02 the palace: 'हिम', the scroll on 'चौथी', 'मृत्यु'
        "him02": w("02_narrator", ["हिम"]),
        "cap02b": w("02_narrator", ["विवाह", "विवा"]),
        "chauthi02": w("02_narrator", ["चौथी", "चोथी"]),
        "mrityu02": w("02_narrator", ["मृत्यु", "मृत्य", "म्रित्यु"]),
        # 03 gold on 'सोना', lamps from 'कोने' and 'दीये'
        "sona03": w("03_narrator", ["सोना"]),
        "cap03b": w("03_narrator", ["और"]),
        "kone03": w("03_narrator", ["कोने", "कोन"]),
        "diye03": w("03_narrator", ["दीये", "दिये", "दीए"]),
        # 04 the serpent on 'सर्प', the glare on 'चौंधिया', dawn on 'भोर', gone on 'लौट'
        "sarp04": w("04_narrator", ["सर्प", "सरप"]),
        "roshni04": w("04_narrator", ["रोशनी"]),
        "chondhiya04": w("04_narrator", ["चौंधिया", "चौंध", "चोंधिया", "चौधिया"]),
        "cap04b": w("04_narrator", ["और"]),
        "bhor04": w("04_narrator", ["भोर"]),
        "laut04": w("04_narrator", ["लौट", "लोट"]),
        # 05 Yamraj: his reveal, 'नाम', the gold words from 'समय', 'नहीं'
        "yama05": s("05_yamraj"),
        "naam05": w("05_yamraj", ["नाम"]),
        "cap05b": w("05_yamraj", ["वहाँ", "वहां", "वहा"]),
        "samay05": w("05_yamraj", ["समय"]),
        "nahi05": w("05_yamraj", ["नहीं", "नही"]),
        # 06 the Kaal wheel on 'काल'; diya 2 lights on 'समय'
        "kaal06": w("06_narrator", ["काल"]),
        "samay06": w("06_narrator", ["समय"]),
        "glow": B["glow"][0],
        # 07 the hora dial: 'घंटा', 'ग्रह', 'होरा'
        "jyotish07": w("07_narrator", ["ज्योतिष", "जोतिश", "ज्योतिश", "जोतिष"]),
        "ghanta07": w("07_narrator", ["घंटा", "घण्टा", "घंटे"]),
        "graha07": w("07_narrator", ["ग्रह", "ग्रेह"]),
        "hora07": w("07_narrator", ["होरा"]),
        # 08 the feature card on 'नोटिफिकेशन', the mantra on 'मंत्र', 'फ़्री', the greeting on 'छोटी'
        "hora08": w("08_narrator", ["होरा"]),
        "notif08": w("08_narrator", ["नोटिफिकेशन", "नोटिफ़िकेशन", "नोटि"]),
        "mantra08": w("08_narrator", ["मंत्र", "मन्त्र"]),
        "free08": w("08_narrator", ["फ्री", "फ़्री", "फ्रि"]),
        "cap08b": w("08_narrator", ["छोटी", "छोटि"]),
        # the close
        "signoff": s("jyotiq_signoff"),
        "offer": w("jyotiq_signoff", ["पहला"]),
        "brandChime": e("jyotiq_signoff") + 2,
    }
    scenes = {
        "hook": (0, B["title"][0]),
        "title": (B["title"][0], s("02_narrator")),
        "palace": (s("02_narrator"), s("03_narrator") - 3),
        "lamps": (s("03_narrator") - 3, s("04_narrator") - 3),
        "serpent": (s("04_narrator") - 3, s("05_yamraj") - 3),
        "yama": (s("05_yamraj") - 3, s("06_narrator") - 2),
        "kaal": (s("06_narrator") - 2, B["glow"][1]),
        "hora": (B["glow"][1], s("08_narrator") - 3),
        "app": (s("08_narrator") - 3, s("jyotiq_signoff")),
        "end": (s("jyotiq_signoff"), total),
    }
    return L, B, scenes, cues, total
'''

a = t.index('DHANTERAS = ["धनतेरस"')
b = t.index("    return L, B, scenes, cues, total\n") + len("    return L, B, scenes, cues, total\n")
t = t[:a] + TIMING + t[b:]

swaps = [
    ('NARRATOR = {"01_narrator", "02_narrator", "03_narrator", "04_narrator", "06_narrator", "07_narrator",\n            "08_narrator", "jyotiq_signoff"}\nDHAN = {"05_dhanvantari"}',
     'NARRATOR = {"01_narrator", "02_narrator", "03_narrator", "04_narrator", "06_narrator", "07_narrator",\n            "08_narrator", "jyotiq_signoff"}\nDHAN = {"05_yamraj"}  # the non-narrator voice: Yamraj, close and warm (the Day 1 Dhanvantari treatment)'),
    ('LINE_TARGET = {"05_dhanvantari": -18.0}', 'LINE_TARGET = {"05_yamraj": -18.0}'),
    ('TANPURA_LV = {"hook": 0.35, "title": 0.55, "diyas": 0.45, "rise": 0.45, "market": 0.35, "words": 0.5,\n              "health": 0.4, "kundali": 0.5, "app": 0.45, "end": 0.5}',
     'TANPURA_LV = {"hook": 0.35, "title": 0.55, "palace": 0.45, "lamps": 0.45, "serpent": 0.3, "yama": 0.5,\n              "kaal": 0.45, "hora": 0.45, "app": 0.45, "end": 0.5}'),
    ('KAAL_LV = {"hook": 0.45, "title": 0.7, "diyas": 0.4, "rise": 0.55, "market": 0.3, "words": 0.35,\n           "health": 0.3, "kundali": 0.45, "app": 0.35, "end": 0.4}',
     'KAAL_LV = {"hook": 0.5, "title": 0.75, "palace": 0.45, "lamps": 0.4, "serpent": 0.6, "yama": 0.55,\n           "kaal": 0.8, "hora": 0.5, "app": 0.35, "end": 0.45}'),
    ('    boom(c["titleHit"], 0.42, 38, 40, 1.8, "b1")      # the Manthan sea and the title\n    boom(c["dhanvantari"], 0.38, 36, 40, 2.2, "b2")   # his name lands\n    boom(c["ignite"] + 2, 0.26, 44, 30, 1.6, "b3")    # diya 1 lights',
     '    boom(c["titleHit"], 0.42, 38, 40, 1.8, "b1")      # the rewind lands in the legend: the title\n    boom(c["yama05"], 0.36, 34, 40, 2.4, "b2")        # Yamraj appears\n    boom(c["glow"] + 2, 0.26, 44, 30, 1.6, "b3")      # diya 2 lights'),
    ("import array\nimport json\n", "import array\nimport json\nimport math\n"),
    ('        "// Generated by scripts/diwali_d2_audio.py - edit timings THERE so picture and sound stay in sync.",',
     '        ("// PLACEHOLDER timing estimated from the script (diwali_d2_audio.py --placeholder); re-run without it once the takes are in."\n         if PLACEHOLDER else "// Generated by scripts/diwali_d2_audio.py - edit timings THERE so picture and sound stay in sync."),'),
    ("def main():\n    frames = vo_frames()",
     '''def write_placeholder_vo():
    """Before the takes exist: each line's length estimated from its words at RATE, with a gentle speech-like
    mouth envelope (diwali_d2_vo_prep.py overwrites this with the real takes)."""
    data = {}
    for item in ORDER:
        if item[0] != "vo":
            continue
        k = item[1]
        n_words = len([w for w in TEXT[k].split() if w.strip(".,!?।…")])
        n = SIGNOFF_FRAMES if k == "jyotiq_signoff" else max(30, int(round(n_words * RATE)))
        env = [round(0.35 + 0.3 * abs(math.sin(i / 2.7)), 2) for i in range(n)]
        data[k] = {"file": f"jyotiq/diwali/d2/vo/{k}.wav", "frames": n, "sec": round(n / FPS, 3), "env": env}
    path = ROOT / "src/Jyotiq/diwali/d2/voData.ts"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        "// PLACEHOLDER written by scripts/diwali_d2_audio.py --placeholder (estimated from the script);\\n"
        "// scripts/diwali_d2_vo_prep.py replaces it with the real takes.\\n"
        "export type VoLine = { file: string; frames: number; sec: number; env: number[] };\\n"
        f"export const VO: Record<string, VoLine> = {json.dumps(data, separators=(',', ':'))};\\n"
    )


def main():
    if PLACEHOLDER:
        write_placeholder_vo()
    frames = vo_frames()'''),
    ('    if "--timing-only" in sys.argv:\n        return', '    if "--timing-only" in sys.argv or PLACEHOLDER:\n        return'),
]
missing = [x for x, _ in swaps if x not in t]
if missing:
    raise SystemExit("anchors not found:\n" + "\n---\n".join(missing))
for x, y in swaps:
    t = t.replace(x, y)
F.write_text(t)
print("spliced", F, "lines:", len(t.splitlines()))
