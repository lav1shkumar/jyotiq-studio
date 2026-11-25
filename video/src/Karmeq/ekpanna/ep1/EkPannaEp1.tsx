import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  interpolateColors,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import { loadFont as loadTiro } from "@remotion/google-fonts/TiroDevanagariSanskrit";
import { SEGS, SEG_ORDER, TOTAL } from "./timing";

/* Karmeq "एक पन्ना" Ep 1: 18 नाम. A 30 s documentary reel built around one page:
   the verse naming the 18 creators of jyotish, returned to with a new meaning. */

export const EKPANNA_TOTAL = TOTAL;

const POPPINS = loadPoppins("normal", { weights: ["500", "600", "700"], subsets: ["devanagari", "latin"] }).fontFamily;
const TIRO = loadTiro("normal", { weights: ["400"], subsets: ["devanagari"] }).fontFamily;

/* The real Karmeq app icon: cream field, maroon क, green ring. */
const MAROON = "#700201";
const CREAM = "#F5ECA1";
const GREEN = "#30681F";
const DEEP = "#1C0604";
const GOLD_HI = "#FFD36B";
const IVORY = "#FBF6EA";
const INK = "#2A1A0C";

/** Set true once the animated havan clip is in public/ (falls back to the still). */
const HAVAN_CLIP: string | null = null;

const a = (n: string) => staticFile(`karmeq/ekpanna/ep1/${n}`);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ramp = (f: number, s: number, e: number, from = 0, to = 1) =>
  interpolate(f, [s, e], [from, to], { ...clamp, easing: Easing.inOut(Easing.cubic) });
const pop = (f: number, at: number, damping = 13) =>
  f < at ? 0 : spring({ frame: f - at, fps: 30, config: { damping, stiffness: 190, mass: 0.7 } });

const S = SEGS;
const wordStart = (key: keyof typeof SEGS, word: string) => {
  const w = (S[key].words as readonly { w: string; s: number }[]).find((x) => x.w.startsWith(word));
  return w ? w.s : S[key].s;
};
const END_AT = S.apna.e + 5;

/* ------------------------------ plates ------------------------------ */

const Plate: React.FC<{
  src: string;
  frame: number;
  from: number;
  to: number;
  pos?: string;
  zoom: [number, number];
  origin?: string;
  shade?: number;
  video?: boolean;
  flicker?: boolean;
}> = ({ src, frame, from, to, pos = "50% 50%", zoom, origin = "50% 50%", shade = 0.55, video, flicker }) => {
  const s = interpolate(frame, [from, to], zoom, clamp);
  const fl = flicker ? 1.03 + 0.035 * Math.sin(frame * 0.9) + 0.025 * Math.sin(frame * 2.3 + 1) + 0.015 * Math.sin(frame * 4.1 + 2) : 1;
  const style: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: pos,
    transform: `scale(${s})`,
    transformOrigin: origin,
    filter: flicker ? `brightness(${fl})` : undefined,
  };
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {video ? <OffthreadVideo src={src} muted style={style} /> : <Img src={src} style={style} />}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(24,6,4,${shade * 0.55}) 0%, rgba(24,6,4,0) 26%, rgba(24,6,4,0) 46%, rgba(24,6,4,${shade}) 70%, rgba(24,6,4,${shade * 1.25}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ------------------------------ the page ------------------------------ */

type Part = { t: string; id?: string };
const VERSE: { y: number; words: { x: number; parts: Part[] }[] }[] = [
  {
    y: 690,
    words: [
      { x: 92, parts: [{ t: "सूर्यः" }] },
      { x: 262, parts: [{ t: "पितामहो" }] },
      { x: 458, parts: [{ t: "व्यासो", id: "vyasa" }] },
      { x: 672, parts: [{ t: "वसिष्ठो", id: "vas" }, { t: "ऽत्रिः", id: "atri" }] },
      { x: 926, parts: [{ t: "पराशरः", id: "para" }, { t: " ।" }] },
    ],
  },
  {
    y: 815,
    words: [
      { x: 118, parts: [{ t: "कश्यपो", id: "kash" }] },
      { x: 300, parts: [{ t: "नारदो" }] },
      { x: 450, parts: [{ t: "गर्गो", id: "garg" }] },
      { x: 756, parts: [{ t: "मरीचिर्मनुरङ्गिराः" }, { t: " ॥" }] },
    ],
  },
  {
    y: 940,
    words: [
      { x: 112, parts: [{ t: "लोमशः" }] },
      { x: 318, parts: [{ t: "पौलिशश्चैव" }] },
      { x: 536, parts: [{ t: "च्यवनो", id: "chyavan" }] },
      { x: 700, parts: [{ t: "यवनो" }] },
      { x: 884, parts: [{ t: "भृगुः", id: "bhrigu" }, { t: " ।" }] },
    ],
  },
  {
    y: 1065,
    words: [
      { x: 262, parts: [{ t: "शौनको", id: "shaunak" }, { t: "ऽष्टादशा", id: "ashta" }, { t: "श्चैते" }] },
      { x: 746, parts: [{ t: "ज्योतिःशास्त्रप्रवर्तकाः", id: "prav" }, { t: " ॥" }] },
    ],
  },
];

type Cam = { at: number; s: number; x: number; y: number };
const DRIFT = 0.0011;
const camAt = (f: number, keys: Cam[], move = 9) => {
  let i = 0;
  for (let k = 0; k < keys.length; k++) if (keys[k].at <= f) i = k;
  const k = keys[i];
  const prev = i > 0 ? keys[i - 1] : k;
  const p = ramp(f, k.at, k.at + move);
  const prevS = prev.s * (1 + DRIFT * (k.at - prev.at));
  return {
    s: interpolate(p, [0, 1], [prevS, k.s]) * (1 + DRIFT * Math.max(0, f - k.at)),
    x: interpolate(p, [0, 1], [prev.x, k.x]),
    y: interpolate(p, [0, 1], [prev.y, k.y]),
  };
};

const Page: React.FC<{
  cam: { s: number; x: number; y: number };
  dark?: number;
  hl?: Record<string, number>;
  glow?: Record<string, number>;
}> = ({ cam, dark = 0, hl = {}, glow = {} }) => {
  const x = Math.min(1080 - 540 / cam.s, Math.max(540 / cam.s, cam.x));
  const y = Math.min(1920 - 960 / cam.s, Math.max(960 / cam.s, cam.y));
  const base = interpolateColors(dark, [0, 1], [INK, "#8C6A5E"]);
  return (
    <AbsoluteFill style={{ backgroundColor: DEEP, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1080,
          height: 1920,
          transformOrigin: "0 0",
          transform: `translate(${540 - x * cam.s}px, ${960 - y * cam.s}px) scale(${cam.s})`,
        }}
      >
        <Img src={a("paper.jpg")} style={{ position: "absolute", width: 1080, height: 1920, objectFit: "cover" }} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 47%, rgba(70,40,10,0) 45%, rgba(70,40,10,0.42) 100%)" }} />
        <AbsoluteFill style={{ backgroundColor: DEEP, opacity: dark * 0.94 }} />
        <div style={{ position: "absolute", left: 200, right: 200, top: 620, height: 3, background: base, opacity: 0.4 }} />
        <div style={{ position: "absolute", left: 200, right: 200, top: 1168, height: 3, background: base, opacity: 0.4 }} />
        {VERSE.map((line) =>
          line.words.map((word) => (
            <div
              key={`${line.y}-${word.x}`}
              style={{
                position: "absolute",
                left: word.x,
                top: line.y,
                transform: "translate(-50%, -50%)",
                whiteSpace: "nowrap",
                fontFamily: TIRO,
                fontSize: 54,
                lineHeight: 1.5,
              }}
            >
              {word.parts.map((part) => {
                const p = part.id ? hl[part.id] ?? 0 : 0;
                const g = part.id ? glow[part.id] ?? 0 : 0;
                const color = g > 0 ? interpolateColors(g, [0, 1], [base, GOLD_HI]) : base;
                return (
                  <span
                    key={part.t}
                    style={{
                      color,
                      textShadow: g > 0 ? `0 0 ${20 * g}px rgba(255,190,70,${0.85 * g})` : undefined,
                      backgroundImage: "linear-gradient(rgba(255,206,40,0.82), rgba(255,206,40,0.82))",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: `${p * 100}% 68%`,
                      backgroundPosition: "0 62%",
                      paddingInline: 2,
                    }}
                  >
                    {part.t}
                  </span>
                );
              })}
            </div>
          )),
        )}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1192,
            textAlign: "center",
            fontFamily: POPPINS,
            fontWeight: 500,
            fontSize: 24,
            color: base,
            opacity: 0.72,
          }}
        >
          बृहत् पाराशर होरा शास्त्र · अध्याय 1 की टिप्पणी से
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------ overlays ------------------------------ */

const PAGE_CAPTION: string[] = ["kyonki", "atharah", "vas", "garg", "vya", "aur", "ab", "kash", "bhrigu", "garg2", "shayad", "apna"];

const ActiveCaption: React.FC<{ f: number }> = ({ f }) => {
  if (f >= END_AT) return null;
  let key = SEG_ORDER[0];
  for (const k of SEG_ORDER) if (S[k].s <= f) key = k;
  const seg = S[key];
  const hero = key === "ram" || key === "krishna" || key === "mahabharat";
  const top = hero ? 1040 : 1452;
  // over the verse the words need a solid backing: outlined text fights the Sanskrit behind it
  const pill = PAGE_CAPTION.includes(key);
  return (
    <div style={{ position: "absolute", left: 110, width: 820, top, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          textAlign: "center",
          fontFamily: POPPINS,
          fontWeight: 700,
          fontSize: hero ? 88 : 66,
          lineHeight: 1.36,
          color: "#fff",
          WebkitTextStroke: pill ? undefined : `${hero ? 14 : 12}px ${DEEP}`,
          paintOrder: "stroke fill",
          backgroundColor: pill ? MAROON : undefined,
          borderRadius: pill ? 20 : undefined,
          padding: pill ? "14px 20px 4px" : undefined,
        }}
      >
        {(seg.words as readonly { w: string; s: number; e: number }[]).map((w, i) => {
          const spoken = hero || pill || f >= w.s - 1; // a solid box shows its whole line; only open captions build word by word
          const now = !hero && f >= w.s - 1 && f < w.e;
          return (
            <span key={i} style={{ color: now ? GOLD_HI : "#fff", opacity: spoken ? 1 : 0, display: "inline-block", marginInline: 10 }}>
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const HookChip: React.FC<{ f: number }> = ({ f }) => {
  if (f >= S.tino.s) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: POPPINS,
          fontWeight: 700,
          fontSize: 56,
          lineHeight: 1.3,
          color: MAROON,
          backgroundColor: CREAM,
          padding: "14px 38px 10px",
          borderRadius: 18,
        }}
      >
        तीनों एक ही पन्ने पर क्यों?
      </div>
    </div>
  );
};

const Bug: React.FC<{ f: number }> = ({ f }) => {
  if (f >= END_AT) return null;
  return (
    <Img src={a("karmeq_icon.png")} style={{ position: "absolute", left: 40, top: 120, width: 118, height: 118 }} />
  );
};

const EvidenceCard: React.FC<{ f: number; at: number; src: string; pos: string; label: string; tilt: number }> = ({ f, at, src, pos, label, tilt }) => {
  const p = pop(f, at);
  return (
    <div
      style={{
        position: "absolute",
        left: 170,
        top: 214,
        width: 740,
        padding: "16px 16px 8px",
        backgroundColor: "#fff",
        borderRadius: 6,
        boxShadow: "0 22px 50px rgba(20,10,0,0.45)",
        transform: `scale(${0.82 + 0.18 * p}) rotate(${tilt}deg)`,
        opacity: Math.min(1, p * 2.2),
      }}
    >
      <Img src={src} style={{ width: "100%", height: 380, objectFit: "cover", objectPosition: pos, display: "block" }} />
      <div style={{ fontFamily: POPPINS, fontWeight: 700, fontSize: 48, lineHeight: 1.5, color: MAROON, textAlign: "center", marginTop: 6 }}>{label}</div>
    </div>
  );
};

/* ------------------------------ scenes ------------------------------ */

const THREE = [
  { src: "ram_vasishtha.jpg", pos: "82% 55%", x: 70, y: 250, r: -7, at: 0 },
  { src: "krishna_birth.jpg", pos: "50% 60%", x: 520, y: 470, r: 6, at: 5 },
  { src: "ganesh_vyasa.jpg", pos: "42% 60%", x: 110, y: 830, r: -3, at: 10 },
];

const TinoScene: React.FC<{ f: number }> = ({ f }) => {
  const t0 = S.tino.s;
  const fall = ramp(f, S.tino.e - 2, S.kyonki.s + 1);
  return (
    <AbsoluteFill style={{ backgroundColor: DEEP }}>
      <AbsoluteFill style={{ transform: `translateY(${(1 - fall) * 1920}px)` }}>
        <Page cam={{ s: 1, x: 540, y: 960 }} />
      </AbsoluteFill>
      {THREE.map((c) => {
        const p = pop(f, t0 + c.at);
        const x = interpolate(fall, [0, 1], [c.x, 400]);
        const y = interpolate(fall, [0, 1], [c.y, 760]);
        const scale = interpolate(fall, [0, 1], [0.85 + 0.15 * p, 0.42]);
        return (
          <div
            key={c.src}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 500,
              padding: 12,
              backgroundColor: "#fff",
              borderRadius: 4,
              transform: `scale(${scale}) rotate(${c.r}deg)`,
              opacity: Math.min(1, p * 2) * (1 - ramp(f, S.kyonki.s - 3, S.kyonki.s + 2)),
              boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
            }}
          >
            <Img src={a(c.src)} style={{ width: "100%", height: 400, objectFit: "cover", objectPosition: c.pos, display: "block" }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const VERSE_C = { s: 1, x: 540, y: 905 };

const PageA: React.FC<{ f: number }> = ({ f }) => {
  const jy = wordStart("kyonki", "ज्योतिष");
  const cam = camAt(f, [
    { at: S.kyonki.s, ...VERSE_C },
    { at: jy, s: 1.5, x: 650, y: 1065 },
    { at: S.atharah.s, s: 1.65, x: 330, y: 1065 },
    { at: S.vas.s, s: 1.8, x: 672, y: 690 },
    { at: S.garg.s, s: 1.8, x: 450, y: 815 },
    { at: S.vya.s, s: 1.8, x: 458, y: 690 },
    { at: S.aur.s, s: 1.8, x: 536, y: 940 },
  ]);
  const swipe = (at: number) => ramp(f, at, at + 9);
  const hl = {
    prav: swipe(jy + 3),
    ashta: swipe(S.atharah.s + 1),
    vas: swipe(S.vas.s + 1),
    garg: swipe(S.garg.s + 1),
    vyasa: swipe(S.vya.s + 1),
    chyavan: swipe(S.aur.s + 2),
  };
  const stamp = pop(f, S.atharah.s + 1, 11);
  const inA = f >= S.atharah.s && f < S.vas.s;
  const inGloss = f >= jy + 3 && f < S.atharah.s;
  return (
    <AbsoluteFill>
      <Page cam={cam} hl={hl} />
      {inGloss ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1016, display: "flex", justifyContent: "center", opacity: ramp(f, jy + 3, jy + 8) }}>
          <div style={{ fontFamily: POPPINS, fontWeight: 700, fontSize: 50, lineHeight: 1.35, color: IVORY, background: MAROON, padding: "18px 34px 12px", borderRadius: 14, textAlign: "center" }}>
            प्रवर्तक = शुरू करने वाले
          </div>
        </div>
      ) : null}
      {inA ? (
        <div
          style={{
            position: "absolute",
            left: 310,
            width: 460,
            top: 210,
            padding: "26px 0 18px",
            textAlign: "center",
            fontFamily: POPPINS,
            fontWeight: 700,
            backgroundColor: MAROON,
            border: `6px solid ${CREAM}`,
            borderRadius: 26,
            boxShadow: "0 22px 50px rgba(20,10,0,0.45)",
            transform: `scale(${1.7 - 0.7 * stamp}) rotate(-3deg)`,
            opacity: Math.min(1, stamp * 3),
          }}
        >
          <div style={{ fontSize: 290, lineHeight: 1, color: CREAM }}>18</div>
          <div style={{ fontSize: 76, lineHeight: 1.2, color: IVORY }}>नाम</div>
        </div>
      ) : null}
      {f >= S.vas.s && f < S.garg.s ? <EvidenceCard f={f} at={S.vas.s} src={a("ram_vasishtha.jpg")} pos="88% 55%" label="राम के गुरु" tilt={-2} /> : null}
      {f >= S.garg.s && f < S.vya.s ? <EvidenceCard f={f} at={S.garg.s} src={a("krishna_birth.jpg")} pos="50% 72%" label="कृष्ण का नाम रखने वाले" tilt={1.5} /> : null}
      {f >= S.vya.s && f < S.aur.s ? <EvidenceCard f={f} at={S.vya.s} src={a("ganesh_vyasa.jpg")} pos="40% 60%" label="महाभारत के लेखक" tilt={-1.5} /> : null}
    </AbsoluteFill>
  );
};

const GOTRA_IDS = ["vas", "atri", "para", "kash", "garg", "bhrigu", "shaunak"];

const PageB: React.FC<{ f: number }> = ({ f }) => {
  const dim = ramp(f, S.ab.s + 10, S.ab.e - 2);
  const cam = camAt(f, [
    { at: S.ab.s, ...VERSE_C },
    { at: S.kash.s, s: 1.65, x: 330, y: 815 },
    { at: S.bhrigu.s, s: 1.65, x: 760, y: 940 },
    { at: S.garg2.s, s: 1.65, x: 450, y: 815 },
  ]);
  const off = 1 - ramp(f, S.ab.s + 6, S.ab.s + 18);
  const hl = { prav: off, ashta: off, vas: off, garg: off, vyasa: off, chyavan: off };
  const glow = {
    kash: ramp(f, S.kash.s, S.kash.s + 6),
    bhrigu: ramp(f, S.bhrigu.s, S.bhrigu.s + 6),
    garg: ramp(f, S.garg2.s, S.garg2.s + 6),
  };
  return <Page cam={cam} dark={dim} hl={hl} glow={glow} />;
};

const GOTRAS = ["कश्यप", "वशिष्ठ", "भृगु", "पराशर", "अत्रि", "गर्ग"];

const PujaScene: React.FC<{ f: number }> = ({ f }) => {
  const ask = wordStart("puja", "गोत्र");
  const second = f >= S.yahi.s;
  const p = pop(f, ask);
  const idx = Math.min(GOTRAS.length - 1, Math.floor(Math.max(0, f - S.yahi.s) / 4));
  return (
    <AbsoluteFill>
      {second ? (
        <Plate src={a("havan_fire.jpg")} frame={f} from={S.yahi.s} to={S.shayad.s} pos="48% 50%" zoom={[1.12, 1.2]} shade={0.75} />
      ) : (
        <Sequence from={S.puja.s} layout="none">
          <Plate
            src={HAVAN_CLIP ? a(HAVAN_CLIP) : a("havan_white.jpg")}
            video={Boolean(HAVAN_CLIP)}
            frame={f}
            from={S.puja.s}
            to={S.yahi.s}
            pos="50% 62%"
            zoom={[1.0, 1.1]}
            origin="50% 62%"
            shade={0.62}
            flicker
          />
        </Sequence>
      )}
      {f >= ask ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 400, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 26,
              fontFamily: POPPINS,
              fontWeight: 700,
              background: MAROON,
              border: `4px solid ${CREAM}`,
              borderRadius: 22,
              padding: "24px 52px 14px",
              transform: `scale(${0.8 + 0.2 * p})`,
              opacity: Math.min(1, p * 2),
            }}
          >
            <span style={{ color: IVORY, fontSize: 72, lineHeight: 1.3 }}>गोत्र{second ? ":" : "?"}</span>
            {second ? <span style={{ color: GOLD_HI, fontSize: 92, lineHeight: 1.2 }}>{GOTRAS[idx]}</span> : null}
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const PageC: React.FC<{ f: number }> = ({ f }) => {
  const t0 = S.shayad.s;
  const glow: Record<string, number> = {};
  GOTRA_IDS.forEach((id, i) => {
    glow[id] = ramp(f, t0 + i * 6, t0 + i * 6 + 8);
  });
  const pull = ramp(f, S.apna.s - 2, S.apna.s + 8);
  const s = interpolate(f, [t0, S.apna.s], [1.02, 1.14], clamp) * (1 - pull * 0.1);
  const y = interpolate(pull, [0, 1], [905, 1030]);
  return <Page cam={{ s, x: 540, y }} dark={1} glow={glow} />;
};

const TYPED = ["", "क", "कश्", "कश्य", "कश्यप"];

const CommentBox: React.FC<{ f: number }> = ({ f }) => {
  const t0 = S.apna.s + 2;
  const p = pop(f, t0);
  const n = Math.min(TYPED.length - 1, Math.max(0, Math.floor((f - t0 - 6) / 4)));
  const cursor = Math.floor(f / 8) % 2 === 0;
  return (
    <div style={{ position: "absolute", left: 90, width: 820, top: 1160, transform: `translateY(${(1 - p) * 90}px)`, opacity: Math.min(1, p * 2) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24, background: "#fff", borderRadius: 60, padding: "20px 36px 14px 22px", boxShadow: "0 14px 40px rgba(0,0,0,0.5)" }}>
        <Img src={a("karmeq_icon.png")} style={{ width: 88, height: 88, flexShrink: 0 }} />
        <div style={{ fontFamily: POPPINS, fontWeight: 600, fontSize: 56, lineHeight: 1.4, color: MAROON, whiteSpace: "nowrap" }}>
          मेरा गोत्र: {TYPED[n]}
          <span style={{ opacity: cursor ? 1 : 0, color: GREEN }}>|</span>
        </div>
      </div>
    </div>
  );
};

const EndCard: React.FC<{ f: number }> = ({ f }) => {
  const inP = ramp(f, END_AT, END_AT + 8);
  const pill = pop(f, END_AT + 8);
  return (
    <AbsoluteFill style={{ backgroundColor: CREAM, opacity: inP, alignItems: "center" }}>
      <Img src={a("karmeq_icon.png")} style={{ position: "absolute", top: 330, width: 440, height: 440 }} />
      <div style={{ position: "absolute", top: 800, fontFamily: TIRO, fontSize: 124, lineHeight: 1.3, color: MAROON }}>एक पन्ना</div>
      <div style={{ position: "absolute", top: 966, fontFamily: POPPINS, fontWeight: 600, fontSize: 48, lineHeight: 1.4, color: GREEN }}>Astrology 101 · एपिसोड 1</div>
      <div
        style={{
          position: "absolute",
          top: 1074,
          fontFamily: POPPINS,
          fontWeight: 700,
          fontSize: 54,
          lineHeight: 1.3,
          color: CREAM,
          background: MAROON,
          borderRadius: 18,
          padding: "16px 44px 10px",
          transform: `scale(${0.85 + 0.15 * pill})`,
          opacity: Math.min(1, pill * 2),
        }}
      >
        अभी Karmeq से बुकिंग कीजिए
      </div>
      <div style={{ position: "absolute", top: 1226, fontFamily: POPPINS, fontWeight: 600, fontSize: 40, lineHeight: 1.4, color: MAROON }}>KARMEQ · Google Play पर</div>
      <div style={{ position: "absolute", top: 1570, fontFamily: POPPINS, fontWeight: 500, fontSize: 22, color: MAROON, opacity: 0.6 }}>
        Photo: Bharat Mudgal (CC BY 2.0)
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------ composition ------------------------------ */

export const EkPannaEp1: React.FC<{ withAudio?: boolean }> = ({ withAudio = false }) => {
  const f = useCurrentFrame();
  let scene: React.ReactNode;
  if (f < S.krishna.s) {
    scene = <Plate src={a("ram_vasishtha.jpg")} frame={f} from={0} to={S.krishna.s} pos="90% 50%" zoom={[1.04, 1.1]} origin="70% 45%" />;
  } else if (f < S.mahabharat.s) {
    scene = <Plate src={a("krishna_birth.jpg")} frame={f} from={S.krishna.s} to={S.mahabharat.s} pos="50% 50%" zoom={[1.14, 1.04]} origin="50% 70%" />;
  } else if (f < S.tino.s) {
    scene = <Plate src={a("ganesh_vyasa.jpg")} frame={f} from={S.mahabharat.s} to={S.tino.s} pos="8% 50%" zoom={[1.02, 1.08]} origin="30% 50%" />;
  } else if (f < S.kyonki.s) {
    scene = <TinoScene f={f} />;
  } else if (f < S.chyavan.s) {
    scene = <PageA f={f} />;
  } else if (f < S.haan.s) {
    scene = <Plate src={a("chyavana.jpg")} frame={f} from={S.chyavan.s} to={S.haan.s} pos="12% 50%" zoom={[1.3, 1.42]} origin="24% 52%" />;
  } else if (f < S.ab.s) {
    scene = <Plate src={a("jar.png")} frame={f} from={S.haan.s} to={S.ab.s} pos="42% 50%" zoom={[1.12, 1.22]} origin="45% 45%" shade={0.7} />;
  } else if (f < S.puja.s) {
    scene = <PageB f={f} />;
  } else if (f < S.shayad.s) {
    scene = <PujaScene f={f} />;
  } else {
    scene = <PageC f={f} />;
  }
  return (
    <AbsoluteFill style={{ backgroundColor: DEEP }}>
      {scene}
      {f >= S.apna.s && f < END_AT ? <CommentBox f={f} /> : null}
      <HookChip f={f} />
      <Bug f={f} />
      <ActiveCaption f={f} />
      {f >= END_AT ? <EndCard f={f} /> : null}
      {withAudio ? <Audio src={a("mix.wav")} /> : null}
    </AbsoluteFill>
  );
};
