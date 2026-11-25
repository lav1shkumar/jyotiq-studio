import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadMono } from "@remotion/google-fonts/SpaceMono";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";

/* Govardhan carousel V2 (new knowledge, not the reel's story): Kartik new year, udaya tithi, tithi = 12°, Taurus/Venus, Kartik Sun in Tula, 2nd house.
   Art panD/E/F. Built from V1: one seamless 9-slide panorama (9 x 1080 by 1350), cut into slides afterwards.
   Art: three paper-diorama panels (govardhan-carousel/public/img/pan{A,B,C}.jpg) joined with torn-paper edges
   that cross the slide borders, a gold dotted thread linking every FIG to the sky chart on the last slide.
   Look follows the Day 4 Govardhan reel (Oswald headlines, Space Mono labels, torn Jyotiq tag). */

export const SLIDES = 9;
export const SW = 1080;
export const SH = 1350;
const OSW = loadOswald("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily;
const MONO = loadMono("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily;
const SANS = loadJakarta("normal", { weights: ["500", "700", "800"], subsets: ["latin"] }).fontFamily;
const INK = "#231A12";
const RED = "#D7362B";
const PAPER = "#F6EBD6";
const GOLD = "#E9B44C";

/* panels: scaled to 1420 tall (3347 wide), overlapping 160 px under a torn edge */
const PW = 3394;
const PH = 1440;
// seams sit just inside slides 4 and 7, so each swipe shows the torn edge crossing the border
const PANELS = [
  { src: "panD", x: 0, y: -50 },
  { src: "panE", x: 3300, y: -50 },
  { src: "panF", x: 6540, y: -50 },
];

// a jagged torn-paper left edge as a CSS mask (seeded, deterministic)
function tornMask(h: number, seed: number): string {
  const pts: string[] = ["40,0"];
  let s = seed;
  for (let y = 0; y <= h; y += 22) {
    s = (s * 9301 + 49297) % 233280;
    const x = 18 + (s / 233280) * 44;
    pts.push(`${x.toFixed(1)},${y}`);
  }
  const path = `M${PW},0 L${pts.join(" L")} L40,${h} L${PW},${h} Z`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${PW}' height='${h}'><path d='${path}' fill='black'/></svg>`)}")`;
}

const Panel: React.FC<{ src: string; x: number; y: number; torn: boolean; seed: number }> = ({ src, x, y, torn, seed }) => (
  <div style={{ position: "absolute", left: x, top: y, width: PW, height: PH, filter: torn ? "drop-shadow(-10px 0 10px rgba(0,0,0,0.35))" : undefined }}>
    <div style={{ width: PW, height: PH, WebkitMaskImage: torn ? tornMask(PH, seed) : undefined, maskImage: torn ? tornMask(PH, seed) : undefined, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" }}>
      <Img src={staticFile(`img/${src}.jpg`)} style={{ width: PW, height: PH, objectFit: "cover" }} />
      {torn ? <div style={{ position: "absolute", left: 0, top: 0, width: 70, height: PH, background: "linear-gradient(90deg, #FBF3E2 0 46px, rgba(251,243,226,0) 70px)" }} /> : null}
    </div>
  </div>
);

const Tag: React.FC<{ x: number }> = ({ x }) => (
  <div style={{ position: "absolute", left: x + SW - 430, top: 40, width: 400, padding: "10px 18px 12px", background: PAPER, color: INK, fontFamily: MONO, fontWeight: 700, fontSize: 21, letterSpacing: 1.5, transform: "rotate(1.2deg)", boxShadow: "0 4px 10px rgba(0,0,0,0.3)", clipPath: "polygon(0 6%, 4% 0, 30% 5%, 60% 0, 96% 4%, 100% 0, 99% 50%, 100% 100%, 70% 95%, 40% 100%, 6% 96%, 0 100%, 1% 50%)", textAlign: "center" }}>
    JYOTIQ · GOVARDHAN 2026
  </div>
);

const Label: React.FC<{ x: number; text: string; n: number; dark?: boolean }> = ({ x, text, n, dark }) => (
  <>
    <div style={{ position: "absolute", left: x + 48, top: 50, fontFamily: MONO, fontSize: 21, letterSpacing: 2, color: dark ? "rgba(246,235,214,0.85)" : "rgba(35,26,18,0.75)", textShadow: dark ? "0 1px 4px rgba(0,0,0,0.8)" : "0 0 10px rgba(251,243,226,1)" }}>{text}</div>
    <div style={{ position: "absolute", left: x + 48, top: SH - 66, fontFamily: MONO, fontSize: 20, letterSpacing: 2, color: dark ? "rgba(246,235,214,0.8)" : "rgba(35,26,18,0.65)" }}>{n} / {SLIDES}</div>
  </>
);

const Head: React.FC<{ x: number; a: string; b: string; dark?: boolean; size?: number; top?: number }> = ({ x, a, b, dark, size = 92, top = 104 }) => (
  <div style={{ position: "absolute", left: x + 46, top, width: SW - 92, fontFamily: OSW, fontWeight: 700, fontSize: size, lineHeight: 1.02, textTransform: "uppercase", color: dark ? "#FFF6E4" : INK, textShadow: dark ? "0 4px 0 rgba(0,0,0,0.35), 0 0 30px rgba(0,0,0,0.45)" : "0 2px 0 rgba(255,250,240,0.9), 0 0 18px rgba(251,243,226,0.95), 0 0 36px rgba(251,243,226,0.8)" }}>
    <div>{a}</div>
    <div style={{ color: RED }}>{b}</div>
  </div>
);

/* a paper note with a strip of tape */
const Note: React.FC<{ x: number; y: number; w: number; rot?: number; children: React.ReactNode; source?: string }> = ({ x, y, w, rot = -1, children, source }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, transform: `rotate(${rot}deg)` }}>
    <div style={{ position: "absolute", left: w / 2 - 70, top: -18, width: 140, height: 38, background: "rgba(233,214,170,0.85)", transform: "rotate(-3deg)", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
    <div style={{ background: PAPER, color: INK, padding: "30px 34px 26px", fontFamily: SANS, fontWeight: 500, fontSize: 34, lineHeight: 1.36, boxShadow: "0 10px 26px rgba(0,0,0,0.38)", backgroundImage: "repeating-linear-gradient(0deg, rgba(120,90,50,0.04) 0 2px, rgba(0,0,0,0) 2px 5px)" }}>
      {children}
      {source ? <div style={{ marginTop: 16, fontFamily: MONO, fontSize: 19, letterSpacing: 1, color: "#7A6650" }}>{source}</div> : null}
    </div>
  </div>
);

const B: React.FC<{ children: React.ReactNode; c?: string }> = ({ children, c = INK }) => <b style={{ fontWeight: 800, color: c }}>{children}</b>;

const Chip: React.FC<{ x: number; y: number; w: number; children: React.ReactNode; bg?: string }> = ({ x, y, w, children, bg = RED }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, background: bg, color: "#FFF6E4", fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 1, lineHeight: 1.35, padding: "14px 20px", transform: "rotate(-1.5deg)", boxShadow: "0 6px 16px rgba(0,0,0,0.35)" }}>{children}</div>
);

/* the gold thread: one dotted path across all slides, a numbered knot on each FIG */
const KNOTS: [number, number][] = [
  [0 * SW + 980, 1190], [1 * SW + 930, 1215], [2 * SW + 980, 1180], [3 * SW + 940, 1220], [4 * SW + 980, 1190],
  [5 * SW + 960, 1215], [6 * SW + 980, 1200], [7 * SW + 960, 1215], [8 * SW + 540, 430],
];
const KNOT_LABEL = ["", "1", "2", "3", "4", "5", "6", "★"];
const Thread: React.FC = () => {
  let d = `M ${KNOTS[0][0] - 400} ${KNOTS[0][1] + 40}`;
  let prev: [number, number] = [KNOTS[0][0] - 400, KNOTS[0][1] + 40];
  for (const k of KNOTS) {
    const mx = (prev[0] + k[0]) / 2;
    d += ` C ${mx} ${prev[1] + 90}, ${mx} ${k[1] - 90}, ${k[0]} ${k[1]}`;
    prev = k;
  }
  return (
    <svg width={SLIDES * SW} height={SH} style={{ position: "absolute", inset: 0 }}>
      <path d={d} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth={9} strokeDasharray="2 20" strokeLinecap="round" transform="translate(3,4)" />
      <path d={d} fill="none" stroke={GOLD} strokeWidth={8} strokeDasharray="2 20" strokeLinecap="round" />
      {KNOTS.slice(0, 8).map(([x, y], i) => (KNOT_LABEL[i] === "" ? null : (
        <g key={i} transform={`translate(${x},${y})`}>
          <circle r={30} fill={INK} stroke={GOLD} strokeWidth={4} />
          <text textAnchor="middle" y={10} fontFamily={MONO} fontWeight={700} fontSize={26} fill={GOLD}>{KNOT_LABEL[i]}</text>
        </g>
      )))}
    </svg>
  );
};

/* sidereal sky of Govardhan Puja, Tue 10 Nov 2026 (only placements checked against sources) */
const SIGNS = ["MESHA", "VRISHABHA", "MITHUNA", "KARKA", "SIMHA", "KANYA", "TULA", "VRISCHIKA", "DHANU", "MAKARA", "KUMBHA", "MEENA"];
const GRAHAS: { sign: number; name: string; note: string; c: string; dy?: number }[] = [
  { sign: 6, name: "SUN", note: "", c: "#F5A623", dy: -10 },
  { sign: 7, name: "MOON", note: "", c: "#E8EEF8", dy: 10 },
  { sign: 4, name: "JUPITER", note: "", c: "#F2D06B", dy: -16 },
  { sign: 4, name: "KETU", note: "", c: "#B9A2D9", dy: 46 },
  { sign: 10, name: "RAHU", note: "", c: "#9AA7C7" },
  { sign: 11, name: "SATURN", note: "", c: "#8EB5E0" },
];
const SkyWheel: React.FC<{ cx: number; cy: number; r: number }> = ({ cx, cy, r }) => {
  const ang = (i: number) => ((-90 - i * 30 - 15) * Math.PI) / 180; // Mesha at top, counter-clockwise
  const pos = (i: number, rr: number) => [cx + rr * Math.cos(ang(i)), cy + rr * Math.sin(ang(i))];
  return (
    <svg width={SLIDES * SW} height={SH} style={{ position: "absolute", inset: 0 }}>
      <circle cx={cx} cy={cy} r={r + 14} fill="rgba(10,14,34,0.72)" stroke={GOLD} strokeWidth={3} />
      <circle cx={cx} cy={cy} r={r * 0.4} fill="none" stroke="rgba(233,180,76,0.5)" strokeWidth={2} />
      {SIGNS.map((s, i) => {
        const a1 = ((-90 - i * 30) * Math.PI) / 180;
        const [lx, ly] = pos(i, r * 0.86);
        return (
          <g key={s}>
            <line x1={cx + r * 0.4 * Math.cos(a1)} y1={cy + r * 0.4 * Math.sin(a1)} x2={cx + r * Math.cos(a1)} y2={cy + r * Math.sin(a1)} stroke="rgba(233,180,76,0.45)" strokeWidth={2} />
            <text x={lx} y={ly + 6} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={i === 1 || i === 6 ? 17 : 15} fill={i === 1 || i === 6 ? GOLD : "rgba(246,235,214,0.75)"}>{s}</text>
          </g>
        );
      })}
      {GRAHAS.map((g, i) => {
        const [gx, gy] = pos(g.sign, r * 0.62);
        const y = gy + (g.dy ?? 0);
        return (
          <g key={i}>
            <circle cx={gx} cy={y} r={11} fill={g.c} />
            <text x={gx} y={y - 18} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={17} fill="#FFF6E4">{g.name}</text>
            {g.note ? <text x={gx} y={y + 32} textAnchor="middle" fontFamily={MONO} fontSize={14} fill="rgba(246,235,214,0.8)">{g.note}</text> : null}
          </g>
        );
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" fontFamily={OSW} fontWeight={700} fontSize={30} fill="#FFF6E4">10 NOV</text>
      <text x={cx} y={cy + 26} textAnchor="middle" fontFamily={OSW} fontWeight={700} fontSize={30} fill={GOLD}>2026</text>
    </svg>
  );
};

/* tithi strip: the Moon's distance ahead of the Sun, 12 degrees per tithi */
const TithiStrip: React.FC = () => (
  <div style={{ marginTop: 14, fontFamily: MONO, fontSize: 19, letterSpacing: 0.5 }}>
    <div style={{ display: "flex", height: 54, border: `2px solid ${INK}` }}>
      {[["0°", "AMAVASYA", "8 NOV · DIWALI", "#2B2420", "#F6EBD6"], ["0–12°", "PRATIPADA", "10 NOV · GOVARDHAN", RED, "#FFF6E4"], ["12–24°", "DWITIYA", "11 NOV · BHAI DOOJ", "#E9D6AA", INK]].map(([deg, name, , bg, fg], i) => (
        <div key={i} style={{ flex: i === 0 ? 0.7 : 1, background: bg, color: fg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontWeight: 700, borderLeft: i ? `2px solid ${INK}` : undefined, lineHeight: 1.15 }}>
          <span>{name}</span><span style={{ fontWeight: 400, fontSize: 16 }}>{deg}</span>
        </div>
      ))}
    </div>
    <div style={{ display: "flex", fontSize: 15, color: "#7A6650", marginTop: 6 }}>
      {["DIWALI", "GOVARDHAN", "BHAI DOOJ"].map((t, i) => <div key={t} style={{ flex: i === 0 ? 0.7 : 1, textAlign: "center" }}>{t}</div>)}
    </div>
  </div>
);

export const GovCarouselV2: React.FC = () => {
  const X = (i: number) => i * SW;
  return (
    <AbsoluteFill style={{ background: "#FBF3E2", overflow: "hidden" }}>
      {PANELS.map((p, i) => <Panel key={p.src} src={p.src} x={p.x} y={p.y} torn={i > 0} seed={17 + i * 31} />)}
      <Thread />

      {/* 1 · hook */}
      <Label x={X(0)} text="KARTIK 2026 · THE SKY CODE" n={1} />
      <Tag x={X(0)} />
      <Head x={X(0)} a="Govardhan is also" b="a New Year" size={110} top={110} />
      <Note x={X(0) + 470} y={470} w={540} rot={1.5}>
        Tuesday's sky hides <B c={RED}>6 Jyotish lessons</B> the story never tells you. Learn to read your panchang.
        <div style={{ marginTop: 14, fontFamily: OSW, fontWeight: 700, fontSize: 40, letterSpacing: 1, color: INK }}>SWIPE →</div>
      </Note>

      {/* 2 · the Kartik new year */}
      <Label x={X(1)} text="CODE 1 · THE CALENDAR" n={2} />
      <Tag x={X(1)} />
      <Head x={X(1)} a="New Year." b="Vikram Samvat 2083." size={88} />
      <Note x={X(1) + 420} y={330} w={620} rot={-1.2} source="KARTIKADI CALENDAR · BESTU VARAS · BALI PRATIPADA">
        India runs on <B>two new years</B>. North India counts from <B>Chaitra</B> (spring). Gujarat counts from <B>Kartik Shukla Pratipada</B>: the day of Govardhan. Merchants open a new <B c={RED}>chopda</B> (account book) at an auspicious muhurat.
      </Note>

      {/* 3 · udaya tithi */}
      <Label x={X(2)} text="CODE 2 · THE SUNRISE RULE" n={3} />
      <Tag x={X(2)} />
      <Head x={X(2)} a="Why festivals" b="get two dates" size={92} />
      <Note x={X(2) + 40} y={350} w={600} rot={1} source="UDAYA TITHI · WHY YOUR CITY'S PANCHANG MATTERS">
        A Hindu day takes the <B>tithi running at sunrise</B> (udaya tithi). Tithis change at any hour, and sunrise changes by city. So one panchang says <B>9 Nov</B>, another <B>10 Nov</B>. <B c={RED}>Neither is wrong.</B> Your sunrise decides.
      </Note>

      {/* 4 · what is a tithi */}
      <Label x={X(3) + 50} text="CODE 3 · THE MOON STEP" n={4} />
      <Tag x={X(3)} />
      <Head x={X(3) + 50} a="A tithi is" b="12° of moonlight" size={88} />
      <Note x={X(3) + 420} y={330} w={620} rot={-1}>
        Every time the <B>Moon</B> pulls <B>12°</B> further ahead of the <B>Sun</B>, a new tithi begins. 30 steps = one lunar month.
        <TithiStrip />
        <div style={{ marginTop: 10 }}>That thin crescent is <B c={RED}>Pratipada</B>: the Moon's first step.</div>
      </Note>

      {/* 5 · the cow's sign */}
      <Label x={X(4)} text="CODE 4 · THE COW'S SIGN" n={5} />
      <Tag x={X(4)} />
      <Head x={X(4)} a="The cow's sign" b="is Venus's home" size={90} />
      <Note x={X(4) + 50} y={350} w={520} rot={1.4} source="ROHINI = 10°–23°20′ TAURUS · MOON EXALTED AT 3° TAURUS">
        <B>Vrishabha</B> (Taurus), the bull, is ruled by <B>Shukra</B> (Venus): food, comfort, wealth, beauty. The <B>Moon</B> is exalted there. Those 7 stars are <B>Krittika</B>; <B>Rohini</B> shines beside them. <B c={RED}>Govardhan is a Venus festival.</B>
      </Note>

      {/* 6 · Kartik sun */}
      <Label x={X(5)} text="CODE 5 · THE MONTH OF LAMPS" n={6} />
      <Tag x={X(5)} />
      <Head x={X(5)} a="Kartik: the Sun" b="at its lowest" size={90} />
      <Note x={X(5) + 50} y={340} w={560} rot={-1.3} source="TULA = SUN'S DEBILITATION · OUR READING OF DEEPDAAN">
        Every Kartik the <B>Sun</B> walks through <B>Tula</B> (Libra): its sign of <B>debilitation</B>, also ruled by <B>Venus</B>. So for a month people light <B>deepdaan</B> lamps. <B c={RED}>When the big light is weak, we become the light.</B>
      </Note>
      <Chip x={X(5) + 80} y={860} w={460}>2026: THE SUN LEAVES TULA ON 16 NOV, 7:48 PM IST.</Chip>

      {/* 7 · 2nd house */}
      <Label x={X(6) + 50} text="CODE 6 · YOUR CHART" n={7} dark />
      <Tag x={X(6)} />
      <Head x={X(6) + 50} a="Annakut lives in" b="your 2nd house" dark size={90} />
      <Note x={X(6) + 560} y={770} w={480} rot={1.1} source="2ND BHAVA: DHANA / KUTUMBA · KARAKA: JUPITER">
        In Jyotish the <B>2nd house</B> holds <B>food</B>, <B>family</B>, <B>wealth</B> and <B>speech</B>. Annakut is all four at one table. <B c={RED}>Your 2nd lord shows what nourishes you.</B>
      </Note>

      {/* 8 · save card */}
      <Label x={X(7)} text="SAVE THIS · KARTIK SKY 2026" n={8} dark />
      <Tag x={X(7)} />
      <Head x={X(7)} a="Your next" b="15 days in the sky" dark size={86} />
      <Note x={X(7) + 60} y={330} w={640} rot={-1.1} source="DRIK PANCHANG · DELHI TIMES · CHECK YOUR CITY">
        <div style={{ fontSize: 28, lineHeight: 1.45 }}>
          {[["10 NOV", "Govardhan + Gujarati New Year · Pratipada till ~2 PM"], ["11 NOV", "Bhai Dooj (Dwitiya)"], ["16 NOV", "Sun enters Vrischika · leaves debilitation"], ["20 NOV", "Dev Uthani Ekadashi · Chaturmas ends, wedding season opens"], ["24 NOV", "Kartik Purnima · Dev Diwali"]].map(([d, t]) => (
            <div key={d} style={{ display: "flex", gap: 16, borderBottom: "1px dashed rgba(35,26,18,0.25)", padding: "3px 0" }}><span style={{ fontFamily: MONO, fontWeight: 700, color: RED, minWidth: 108 }}>{d}</span><span>{t}</span></div>
          ))}
        </div>
      </Note>

      {/* 9 · sky chart + Jyotiq */}
      <Label x={X(8)} text="GOVARDHAN 2026 · SIDEREAL SKY" n={9} dark />
      <Tag x={X(8)} />
      <SkyWheel cx={X(8) + 540} cy={430} r={290} />
      <div style={{ position: "absolute", left: X(8) + 100, top: 738, width: SW - 200, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 22, color: "#FFF6E4", textShadow: "0 2px 6px rgba(0,0,0,0.8)" }}>
        Sun in Tula · Moon one step ahead = <span style={{ color: "#FF8A7A" }}>Pratipada</span>
      </div>
      <div style={{ position: "absolute", left: X(8) + 70, top: 790, width: SW - 140, background: "rgba(12,10,7,0.9)", border: `3px solid ${GOLD}`, borderRadius: 26, padding: "30px 34px", color: "#FFF6E4", textAlign: "center", boxShadow: "0 16px 40px rgba(0,0,0,0.55)" }}>
        <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 52, textTransform: "uppercase", lineHeight: 1.05 }}>What does <span style={{ color: GOLD }}>your</span> 2nd house say?</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, marginTop: 18 }}>
          <Img src={staticFile("brand/logo-icon.png")} style={{ height: 64 }} />
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 38 }}>Ask Jyotiq · <span style={{ color: GOLD }}>first question free</span></div>
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 28, marginTop: 12 }}>www.jyotiq.ai · app link in bio ↑</div>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 26, marginTop: 16, color: "#E9DCC0" }}>Comment your lagna 👇 · Save for the next 15 days</div>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 18, marginTop: 14, color: "rgba(233,220,192,0.7)" }}>Guidance only, for entertainment and information.</div>
      </div>
    </AbsoluteFill>
  );
};
