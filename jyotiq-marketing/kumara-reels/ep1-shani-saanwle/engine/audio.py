"""Assemble the 12 voice lines into one voiceover with tight, natural pacing, and write timings.json.

Per line: decode to 48 kHz mono, trim lead/tail silence, shorten long internal pauses (cut from the middle
of the silence, so no syllable is touched), measure pitch and speech level. Then level-match the lines,
place them on the timeline with short gaps, write audio/out/vo_raw.wav and engine/timings.json, and make
a two-pass loudnorm copy (-14 LUFS, -1 dBTP) at audio/out/vo_norm.wav for checking. The final mix with
SFX is normalised again later.
"""
import json
import os
import re
import subprocess

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
P = os.path.dirname(HERE)
SRC = os.path.join(P, "audio", "src")
OUT = os.path.join(P, "audio", "out")
os.makedirs(OUT, exist_ok=True)
SR = 48000
FR = 480                      # 10 ms analysis frames
START = 0.10                  # first word starts here; the hook title is on screen from frame 0
END_CARD = 2.5
MAX_PAUSE, KEEP_PAUSE = 0.40, 0.30
GAP_DEFAULT = 0.18
GAP_BEFORE = {"L02": 0.16, "L03": 0.24, "L05": 0.12, "L06": 0.14, "L09": 0.18, "L10": 0.10}
TARGET_SPEECH_DB = -20.0

SCRIPT = [
    ("L01", "sanatkumara", "शनि देव का रंग... साँवला क्यों है, सनक भैया?"),
    ("L02", "sanaka", "क्योंकि पिता हैं सूर्य... पर माँ हैं, छाया।"),
    ("L03", "sanandana", "कथा है... सूर्य देव का तेज, उनकी पत्नी संज्ञा सह न सकीं। अपनी जगह छोड़ गईं... अपनी छाया।"),
    ("L04", "sanatana", "शनि गर्भ में थे... और छाया, तपती धूप में... शिव जी के तप में लीन थीं।"),
    ("L05", "sanatkumara", "फिर?"),
    ("L06", "sanaka", "शनि जन्मे... साँवले। सूर्य देव ने बस रंग देखा... और कह दिया, ये मेरा पुत्र नहीं।"),
    ("L07", "sanandana", "माँ का अपमान... शनि से सहा न गया। उनकी दृष्टि पड़ी... और सूर्य देव का तेज मंद पड़ गया।"),
    ("L08", "sanatana", "पिता-पुत्र की वो दूरी... आज भी कुंडली में है। सूर्य और शनि, एक-दूसरे के शत्रु।"),
    ("L09", "sanatkumara", "तो शनि देव... ग़ुस्से वाले हैं?"),
    ("L10", "sanaka", "नहीं। शिव जी ने उन्हें बनाया... कर्मफल दाता। जिसे रंग देखकर परखा गया... वो सिर्फ़ कर्म देखता है।"),
    ("L11", "sanatkumara", "मतलब डरना नहीं... कर्म संभालना है!"),
    ("L12", "sanatana", "आपके शनि देव कहाँ बैठे हैं? ज्योतिक़ से पूछिए।"),
]


def script_phrases(text):
    return [p.strip() for p in re.split(r"\.\.\.|(?<=[।?!])\s+", text) if p.strip()]


def decode(path, sr):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()


def frame_db(x):
    n = len(x) // FR
    f = x[:n * FR].reshape(n, FR)
    return 10 * np.log10((f ** 2).mean(1) + 1e-12)


def runs(mask):
    """[(a, b)) index runs where mask is True."""
    out, i, n = [], 0, len(mask)
    while i < n:
        if mask[i]:
            j = i
            while j < n and mask[j]:
                j += 1
            out.append((i, j))
            i = j
        else:
            i += 1
    return out


def silence_threshold(db):
    return float(np.clip(np.percentile(db, 90) - 32, -50, -36))


def trim(x):
    db = frame_db(x)
    loud = np.nonzero(db > silence_threshold(db))[0]
    a = max(0, loud[0] * FR - int(0.03 * SR))
    b = min(len(x), (loud[-1] + 1) * FR + int(0.10 * SR))
    return x[a:b], a / SR, (len(x) - b) / SR


def tighten(x):
    """Shorten internal silences longer than MAX_PAUSE to KEEP_PAUSE, cutting their middle with 15 ms crossfades."""
    db = frame_db(x)
    thr = silence_threshold(db)
    cuts, removed = [], 0.0
    for a, b in runs(db < thr):
        dur = (b - a) * FR / SR
        if a == 0 or b == len(db) or dur <= MAX_PAUSE:
            continue
        c0 = a * FR + int(KEEP_PAUSE / 2 * SR)
        c1 = b * FR - int(KEEP_PAUSE / 2 * SR)
        cuts.append((c0, c1))
        removed += (c1 - c0) / SR
    pieces, last = [], 0
    for c0, c1 in cuts:
        pieces.append(x[last:c0])
        last = c1
    pieces.append(x[last:])
    xs = int(0.015 * SR)
    ramp = np.linspace(0, 1, xs, dtype=np.float32)
    y = pieces[0]
    for pc in pieces[1:]:
        if len(y) >= xs and len(pc) >= xs:
            y = np.concatenate([y[:-xs], y[-xs:] * (1 - ramp) + pc[:xs] * ramp, pc[xs:]])
        else:
            y = np.concatenate([y, pc])
    return y, len(cuts), removed


def speech_segments(x, min_gap=0.12):
    """Speech runs separated by at least min_gap of silence, as [(start_s, end_s)] relative to the line."""
    db = frame_db(x)
    thr = silence_threshold(db)
    segs = []
    for a, b in runs(db >= thr):
        s, e = a * FR / SR, b * FR / SR
        if segs and s - segs[-1][1] < min_gap:
            segs[-1] = (segs[-1][0], e)
        else:
            segs.append((s, e))
    return [(round(s, 3), round(e, 3)) for s, e in segs if e - s >= 0.05]


def median_f0(x16):
    win, hop, lo, hi = 640, 160, 32, 229            # 40 ms windows at 16 kHz; 500 Hz .. 70 Hz
    f0s = []
    for k in range((len(x16) - win) // hop):
        w = x16[k * hop:k * hop + win]
        if float((w ** 2).mean()) < 1e-4:            # skip quiet frames (below about -40 dBFS)
            continue
        w = w - w.mean()
        r = np.fft.irfft(np.abs(np.fft.rfft(w, 2048)) ** 2)[:win]
        if r[0] <= 0:
            continue
        r = r / r[0] * win / (win - np.arange(win))    # unbiased autocorrelation
        seg = r[lo:hi]
        best = seg.max()
        if best < 0.55:
            continue
        lag = lo + int(np.nonzero(seg >= 0.9 * best)[0][0])
        f0s.append(16000.0 / lag)
    return (float(np.median(f0s)) if f0s else 0.0), len(f0s)


def speech_db(x):
    db = frame_db(x)
    sel = db > np.percentile(db, 90) - 15
    return float(10 * np.log10(np.mean(10 ** (db[sel] / 10))))


def write_wav(x, path):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-",
                    "-c:a", "pcm_s24le", path], input=x.astype(np.float32).tobytes(), check=True)


def loudnorm_measure(path):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af",
                        "loudnorm=I=-14:TP=-1:LRA=11:print_format=json", "-f", "null", "-"],
                       capture_output=True, text=True)
    t = r.stderr
    return json.loads(t[t.rfind("{"):t.rfind("}") + 1])


def normalise(src, dst):
    m = loudnorm_measure(src)
    tmp = dst + ".pass2.wav"
    af = ("highpass=f=70,loudnorm=I=-14:TP=-1:LRA=11:"
          f"measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:"
          f"measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true:print_format=json")
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-y", "-i", src, "-af", af, "-ar", str(SR),
                        "-c:a", "pcm_s24le", tmp], capture_output=True, text=True, check=True)
    mode = json.loads(r.stderr[r.stderr.rfind("{"):r.stderr.rfind("}") + 1]).get("normalization_type")
    n = loudnorm_measure(tmp)
    gain = min(-14.0 - float(n["input_i"]), -1.1 - float(n["input_tp"]))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", f"volume={gain:.2f}dB", "-c:a", "pcm_s24le", dst],
                   check=True)
    os.remove(tmp)
    f = loudnorm_measure(dst)
    return m, mode, gain, f


# ------------------------------------------------------------------ per line
lines = []
for lid, spk, text in SCRIPT:
    path = os.path.join(SRC, f"{lid}_{spk}.mp3")
    raw = decode(path, SR)
    x, lead, tail = trim(raw)
    x, ncut, removed = tighten(x)
    f0, nf = median_f0(decode(path, 16000))
    lvl = speech_db(x)
    lines.append(dict(id=lid, speaker=spk, text=text, audio=x, raw_len=len(raw) / SR, lead=lead, tail=tail,
                      cuts=ncut, removed=removed, f0=f0, f0_frames=nf, level=lvl))

# ------------------------------------------------------------------ level match + timeline
t = START
timeline = []
for i, L in enumerate(lines):
    if i:
        t += GAP_BEFORE.get(L["id"], GAP_DEFAULT)
    gain = float(np.clip(TARGET_SPEECH_DB - L["level"], -6, 6))
    L["gain_db"] = gain
    L["audio"] = L["audio"] * (10 ** (gain / 20))
    L["start"] = round(t, 3)
    t += len(L["audio"]) / SR
    L["end"] = round(t, 3)
    timeline.append(L)
total = round(t + END_CARD, 3)

mix = np.zeros(int(total * SR) + SR // 10, np.float32)
for L in timeline:
    a = int(round(L["start"] * SR))
    mix[a:a + len(L["audio"])] += L["audio"]
mix = mix[:int(total * SR)]
peak = float(np.abs(mix).max())
raw_path = os.path.join(OUT, "vo_raw.wav")
write_wav(mix, raw_path)

# ------------------------------------------------------------------ timings.json
out = dict(sr=SR, start=START, end_card=END_CARD, total=total, vo_end=timeline[-1]["end"], lines=[])
print(f"{'id':4} {'speaker':12} {'raw':>5} {'trim':>5} {'cut':>4} {'len':>5} {'start':>6} {'end':>6} {'f0':>5} {'lvl':>6} {'gain':>5}  phrases(script/detected)")
for L in timeline:
    segs = speech_segments(L["audio"])
    sp = script_phrases(L["text"])
    out["lines"].append(dict(id=L["id"], speaker=L["speaker"], text=L["text"], start=L["start"], end=L["end"],
                             script_phrases=sp,
                             segments=[[round(L["start"] + s, 3), round(L["start"] + e, 3)] for s, e in segs],
                             f0=round(L["f0"], 1), gain_db=round(L["gain_db"], 2)))
    print(f"{L['id']:4} {L['speaker']:12} {L['raw_len']:5.2f} {L['lead'] + L['tail']:5.2f} {L['removed']:4.2f} "
          f"{L['end'] - L['start']:5.2f} {L['start']:6.2f} {L['end']:6.2f} {L['f0']:5.0f} {L['level']:6.1f} "
          f"{L['gain_db']:5.1f}  {len(sp)}/{len(segs)} " + " ".join(f"[{s:.2f}-{e:.2f}]" for s, e in segs))
with open(os.path.join(HERE, "timings.json"), "w") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)

by = {}
for L in timeline:
    by.setdefault(L["speaker"], []).append(round(L["f0"]))
print("median F0 per speaker:", {k: v for k, v in by.items()})
print(f"voice ends {timeline[-1]['end']:.2f}s, total with end card {total:.2f}s, raw peak {20 * np.log10(peak):.1f} dBFS")

m, mode, gain, f = normalise(raw_path, os.path.join(OUT, "vo_norm.wav"))
print(f"loudnorm: input {m['input_i']} LUFS / {m['input_tp']} dBTP, pass-2 mode {mode}, trim {gain:+.2f} dB "
      f"-> final {f['input_i']} LUFS, {f['input_tp']} dBTP, LRA {f['input_lra']}")
