import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadMono } from "@remotion/google-fonts/SpaceMono";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";

/* Govardhan carousel: one seamless 9-slide panorama (9 x 1080 by 1350), cut into slides afterwards.
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
  { src: "panA", x: 0, y: -50 },
  { src: "panB", x: 3300, y: -50 },
  { src: "panC", x: 6540, y: -50 },
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
const KNOT_LABEL = ["", "1", "2", "3", "4", "5", "★", "6"];
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
  const [tx, ty] = pos(1, r * 0.62);
  const [sx, sy] = pos(7, r * 0.62);
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
            <text x={lx} y={ly + 6} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={i === 1 || i === 7 ? 17 : 15} fill={i === 1 || i === 7 ? GOLD : "rgba(246,235,214,0.75)"}>{s}</text>
          </g>
        );
      })}
      {/* the Taurus-Scorpio axis: Krishna's birth Moon vs Govardhan 2026 Moon */}
      <line x1={tx} y1={ty} x2={sx} y2={sy} stroke={RED} strokeWidth={4} strokeDasharray="10 8" />
      <circle cx={tx} cy={ty} r={30} fill="#F6EBD6" stroke={RED} strokeWidth={4} />
      <text x={tx} y={ty + 7} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={17} fill={INK}>☾ K</text>
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

export const GovCarousel: React.FC = () => {
  const X = (i: number) => i * SW;
  return (
    <AbsoluteFill style={{ background: "#FBF3E2", overflow: "hidden" }}>
      {PANELS.map((p, i) => <Panel key={p.src} src={p.src} x={p.x} y={p.y} torn={i > 0} seed={17 + i * 31} />)}
      <Thread />

      {/* 1 · hook */}
      <Label x={X(0)} text="BRAJ · THE PUJA" n={1} />
      <Tag x={X(0)} />
      <Head x={X(0)} a="A 7-year-old defied" b="Jupiter's own god" size={104} top={110} />
      <Note x={X(0) + 560} y={420} w={470} rot={1.5}>
        Govardhan isn't only a miracle. It's a <B c={RED}>Jyotish lesson</B> in 6 codes.
        <div style={{ marginTop: 14, fontFamily: OSW, fontWeight: 700, fontSize: 40, letterSpacing: 1, color: INK }}>SWIPE →</div>
      </Note>

      {/* 2 · go = cow = Taurus */}
      <Label x={X(1)} text="FIG. 1 · THE NAME" n={2} />
      <Tag x={X(1)} />
      <Head x={X(1)} a="Go means cow." b="Cow means Taurus." />
      <Note x={X(1) + 50} y={350} w={600} rot={-1.2} source="BHAGAVATA 10.3.1 · ROHINI = 10°–23°20′ TAURUS">
        <B>Govardhan</B> = go (cow) + vardhan (the one who nourishes). Krishna was born in <B>Rohini nakshatra</B>, which sits wholly in <B>Taurus</B>, the bull's sign, where the Moon is exalted. The cowherd god, born under the cow's own sign.
      </Note>

      {/* 3 · Indra = Jupiter */}
      <Label x={X(2)} text="FIG. 2 · THE KING" n={3} />
      <Tag x={X(2)} />
      <Head x={X(2)} a="Indra is" b="Jupiter's deity" />
      <Note x={X(2) + 40} y={350} w={560} rot={1} source="BRIHAT JATAKA (VARAHAMIHIRA) · BHAGAVATA 10.24">
        In <B>Brihat Jataka</B>, Indra presides over <B>Jupiter</B>, the Guru of wisdom, rain and plenty. Krishna asked Braj to honour what truly feeds them: <B c={RED}>the hill, the cows, their own work.</B>
      </Note>
      <Chip x={X(2) + 70} y={860} w={470}>2026: JUPITER LEFT EXALTED CANCER FOR LEO ON 31 OCT. TEN DAYS BEFORE GOVARDHAN.</Chip>

      {/* 4 · the 2026 sky */}
      <Label x={X(3) + 50} text="FIG. 3 · THE SKY, 2026" n={4} dark />
      <Tag x={X(3)} />
      <Head x={X(3) + 50} a="This year, both" b="sky lamps are low" dark size={86} />
      <Note x={X(3) + 300} y={350} w={700} rot={-1} source="PANCHANG · TUE 10 NOV 2026 · MOON ENTERS SCORPIO ~3 AM IST">
        On Govardhan 2026 the <B>Sun</B> is in <B>Libra</B>, its sign of debilitation. The newborn <B>Moon</B> crosses into <B>Scorpio</B>, its own debilitation sign: <B c={RED}>exactly opposite Krishna's Taurus Moon.</B>
        <div style={{ marginTop: 12, fontFamily: OSW, fontWeight: 700, fontSize: 38, textTransform: "uppercase" }}>Weak kings above. Strong ground below.</div>
      </Note>

      {/* 5 · seven days, seven grahas */}
      <Label x={X(4)} text="FIG. 4 · THE LIFT" n={5} />
      <Tag x={X(4)} />
      <Head x={X(4)} a="7 days." b="7 grahas." size={110} />
      <Note x={X(4) + 600} y={120} w={440} rot={1.4} source="BHAGAVATA 10.25.23 · OUR READING, NOT SCRIPTURE">
        Krishna held the hill <B>seven days</B>, without food. Each day of our week is ruled by a graha: <B>Ravi, Soma, Mangal, Budh, Guru, Shukra, Shani.</B> One full turn, and the storm gave up.
      </Note>

      {/* 6 · every storm has a date */}
      <Label x={X(5)} text="FIG. 5 · THE TIMING" n={6} />
      <Tag x={X(5)} />
      <Head x={X(5)} a="Every storm" b="has a date" />
      <Note x={X(5) + 60} y={330} w={560} rot={-1.3}>
        <div style={{ fontFamily: MONO, fontSize: 27, lineHeight: 1.6 }}>
          {[["MOON", "~2¼ days a sign"], ["SUN", "~1 month"], ["JUPITER", "~1 year"], ["RAHU–KETU", "~18 months"], ["SATURN", "~2½ years"], ["SADE SATI", "~7½ years"]].map(([a, b]) => (
            <div key={a} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed rgba(35,26,18,0.25)" }}><b>{a}</b><span>{b}</span></div>
          ))}
        </div>
        <div style={{ marginTop: 14 }}>Krishna knew it would pass. <B c={RED}>Your chart knows when.</B></div>
      </Note>

      {/* 7 · save card */}
      <Label x={X(6) + 50} text="SAVE THIS · PUJA 2026" n={7} />
      <Tag x={X(6)} />
      <Head x={X(6) + 50} a="Govardhan Puja" b="Tue 10 Nov 2026" size={88} />
      <Note x={X(6) + 430} y={340} w={600} rot={1.1} source="TIMINGS FOR DELHI (DRIK PANCHANG) · CHECK YOUR CITY">
        <div style={{ fontSize: 31, lineHeight: 1.5 }}>
          ☐ <B>Kartik Shukla Pratipada</B>, ends 2:00 PM<br />
          ☐ Do the puja in the morning<br />
          ☐ Shape a Govardhan from cow dung or clay<br />
          ☐ Offer <B>annakut</B>: a mountain of food<br />
          ☐ Walk around it (parikrama)<br />
          ☐ Feed and honour a cow
        </div>
      </Note>

      {/* 8 · Yashoda = Moon */}
      <Label x={X(7)} text="FIG. 6 · THE MOTHER" n={8} />
      <Tag x={X(7)} />
      <Head x={X(7)} a="Yashoda" b="is the Moon" size={86} />
      <Note x={X(7) + 575} y={250} w={470} rot={-1.2} source="56 BHOG: AS IT'S TOLD, NOT SCRIPTURE">
        In Jyotish the <B>Moon</B> is the karaka of the <B>mother</B>: mind, comfort, nourishment. Yashoda counted: <B c={RED}>8 meals a day × 7 days = 56 bhog.</B> Annakut is a mother's math.
      </Note>

      {/* 9 · sky chart + Jyotiq */}
      <Label x={X(8)} text="GOVARDHAN 2026 · SIDEREAL SKY" n={9} />
      <Tag x={X(8)} />
      <SkyWheel cx={X(8) + 540} cy={430} r={290} />
      <div style={{ position: "absolute", left: X(8) + 120, top: 738, width: SW - 240, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 22, color: "#FFF6E4", textShadow: "0 2px 6px rgba(0,0,0,0.8)" }}>
        <span style={{ color: "#FF8A7A" }}>☾ K</span> = Krishna's birth Moon · Sun &amp; Moon both debilitated
      </div>
      <div style={{ position: "absolute", left: X(8) + 70, top: 790, width: SW - 140, background: "rgba(12,10,7,0.9)", border: `3px solid ${GOLD}`, borderRadius: 26, padding: "30px 34px", color: "#FFF6E4", textAlign: "center", boxShadow: "0 16px 40px rgba(0,0,0,0.55)" }}>
        <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 52, textTransform: "uppercase", lineHeight: 1.05 }}>Which storm is over <span style={{ color: GOLD }}>your</span> chart?</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, marginTop: 18 }}>
          <Img src={staticFile("brand/logo-icon.png")} style={{ height: 64 }} />
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 38 }}>Ask Jyotiq · <span style={{ color: GOLD }}>first question free</span></div>
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 28, marginTop: 12 }}>www.jyotiq.ai · app link in bio ↑</div>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 26, marginTop: 16, color: "#E9DCC0" }}>Comment your rashi 👇 · Send this to the one who held up your sky</div>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 18, marginTop: 14, color: "rgba(233,220,192,0.7)" }}>Guidance only, for entertainment and information.</div>
      </div>
    </AbsoluteFill>
  );
};
