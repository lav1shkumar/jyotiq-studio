import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FocusLines, Halftone, SpeedLines, StarDust } from "../bbreel/anime";
import { CORMORANT, DEVA } from "../bbreel/fonts";
import { FingersFront, PalmBack, PhoneFrame, Ripple, Thumb, dev } from "../bbreel/phoneKit";
import { ICONS, StatusBar, SysNav } from "../bbreel/playStore";
import { SANS } from "../theme";
import { AngerVein, Eye, GOLD, INK, Sweat } from "./prims";
import { hit, pop, ramp, shake, track, wob } from "./timing";
import { K2 } from "./timing2";

/* S1 — the kid. POV phone opens Jyotiq, he types in a panic, the app reads
   his kundli, and his face cycles furious -> crying -> confused -> derp on
   the kicks while Jyotiq's answer stacks up underneath. */

export const QUESTION = "Mera Shani itna bhaari kyun hai??";

/* ------------------------------------------------------------------ */
/* Kundli chart (North Indian), shared with S3                         */
/* ------------------------------------------------------------------ */

export type Graha = { k: string; label: string; color: string; house: number };
export const GRAHAS: Graha[] = [
  { k: "sa", label: "Sa", color: "#6FA8FF", house: 1 },
  { k: "ra", label: "Ra", color: "#B9A6D8", house: 3 },
  { k: "mo", label: "Mo", color: "#F3F0FF", house: 4 },
  { k: "ju", label: "Ju", color: "#FFD45A", house: 5 },
  { k: "ma", label: "Ma", color: "#FF5A4E", house: 7 },
  { k: "ke", label: "Ke", color: "#C9B9A6", house: 9 },
  { k: "su", label: "Su", color: "#FF9E3D", house: 10 },
  { k: "me", label: "Me", color: "#66E08A", house: 11 },
  { k: "ve", label: "Ve", color: "#FFB3D9", house: 11 },
];
const HOUSE_C: Record<number, [number, number]> = {
  1: [0.5, 0.25],
  2: [0.25, 0.1],
  3: [0.1, 0.25],
  4: [0.25, 0.5],
  5: [0.1, 0.75],
  6: [0.25, 0.9],
  7: [0.5, 0.75],
  8: [0.75, 0.9],
  9: [0.9, 0.75],
  10: [0.75, 0.5],
  11: [0.9, 0.25],
  12: [0.75, 0.1],
};
/** Position (0..1 chart units) of a graha's glyph; two in a house sit side by side. */
export const grahaPos = (g: Graha): [number, number] => {
  const same = GRAHAS.filter((o) => o.house === g.house);
  const i = same.indexOf(g);
  const [x, y] = HOUSE_C[g.house];
  return [x + (same.length > 1 ? (i - (same.length - 1) / 2) * 0.09 : 0), y];
};

export const KundliChart: React.FC<{ size: number; draw: number; glyphs: number; hot?: string[]; pulse?: number; hide?: string[]; lift?: (k: string) => number }> = ({
  size,
  draw,
  glyphs,
  hot = [],
  pulse = 0,
  hide = [],
  lift,
}) => {
  const S = size;
  const L = S * 4 + S * 2 * Math.SQRT2 * 2 + S * 2; // rough total length for the dash draw
  const dash = { strokeDasharray: L, strokeDashoffset: L * (1 - draw) };
  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} style={{ overflow: "visible" }}>
      <rect x={0} y={0} width={S} height={S} fill="rgba(20,14,6,0.6)" />
      <g fill="none" stroke="#E8C77A" strokeWidth={S * 0.008} strokeLinecap="round" style={dash}>
        <path d={`M0 0H${S}V${S}H0Z M0 0L${S} ${S} M${S} 0L0 ${S} M${S / 2} 0L${S} ${S / 2}L${S / 2} ${S}L0 ${S / 2}Z`} />
      </g>
      {GRAHAS.filter((g) => !hide.includes(g.k)).map((g, i) => {
        const [x, y] = grahaPos(g);
        const v = Math.max(0, Math.min(1, glyphs * GRAHAS.length - i));
        const isHot = hot.includes(g.k);
        const lf = lift ? lift(g.k) : 0;
        if (v <= 0) return null;
        return (
          <g key={g.k} transform={`translate(${x * S} ${y * S - lf * S * 0.12}) scale(${(0.6 + 0.4 * v) * (1 + (isHot ? 0.28 * pulse : 0) + lf * 0.8)})`} opacity={Math.min(1, v) * (1 - Math.max(0, lf - 0.6) * 2.5)}>
            {isHot ? <circle r={S * 0.075} fill={g.color} opacity={0.22 + 0.3 * pulse} /> : null}
            <text textAnchor="middle" dominantBaseline="central" fontFamily={SANS} fontWeight={800} fontSize={S * 0.062} fill={g.color} style={{ paintOrder: "stroke" }} stroke="#120B04" strokeWidth={S * 0.012}>
              {g.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Phone screens (device px 724 x 1568)                                */
/* ------------------------------------------------------------------ */

const APP_COLS = ["#3DDC84", "#4285F4", "#EA4335", "#FBBC05", "#7E57C2", "#00ACC1", "#F06292", "#8D6E63", "#26A69A", "#FF7043", "#5C6BC0", "#9CCC65"];
/** Jyotiq icon centre on the home screen (device px). */
export const JQ_ICON = { x: 452, y: 1004 };

const AndroidHome: React.FC<{ f: number; zoom: number }> = ({ f, zoom }) => {
  const icons: React.ReactNode[] = [];
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) {
      const x = 92 + c * 180;
      const y = 560 + r * 222;
      const isJq = r === 2 && c === 2;
      if (isJq) continue;
      const col = APP_COLS[(r * 4 + c) % APP_COLS.length];
      icons.push(
        <div key={`${r}${c}`} style={{ position: "absolute", left: x - 64, top: y - 64, width: 128, height: 170, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 118, height: 118, borderRadius: 34, background: `linear-gradient(150deg, ${col}, ${col}AA)`, opacity: 0.55 }} />
          <div style={{ marginTop: 12, width: 82, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.28)" }} />
        </div>,
      );
    }
  const glow = 0.5 + 0.5 * Math.sin(f / 3.2);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(170deg, #241B4A 0%, #3B1F57 46%, #12101F 100%)", fontFamily: SANS }}>
      <StatusBar time="11:58" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", color: "#FFFFFF", fontSize: 150, fontWeight: 300, letterSpacing: -4 }}>11:58</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 350, textAlign: "center", color: "rgba(255,255,255,0.75)", fontSize: 34, fontWeight: 600 }}>Mon, 20 Oct · 🌙</div>
      {icons}
      {/* Jyotiq icon */}
      <div style={{ position: "absolute", left: JQ_ICON.x - 64, top: JQ_ICON.y - 64, width: 128, height: 172, display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${1 + 0.05 * glow + zoom * 9})`, transformOrigin: "64px 64px" }}>
        <div
          style={{
            width: 124,
            height: 124,
            borderRadius: 34,
            background: "#0C0A07",
            boxShadow: `0 0 ${24 + 26 * glow}px rgba(240,184,72,${0.55 + 0.35 * glow}), inset 0 0 0 3px rgba(232,199,122,0.6)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Img src={staticFile("jyotiq/logo-icon.png")} style={{ width: 108, height: 89 }} />
        </div>
        <div style={{ marginTop: 10, color: "#FFFFFF", fontSize: 26, fontWeight: 700, opacity: 1 - zoom * 4 }}>Jyotiq</div>
      </div>
      {/* badge */}
      <div style={{ position: "absolute", left: JQ_ICON.x + 34, top: JQ_ICON.y - 82, width: 44, height: 44, borderRadius: 22, background: "#E8283C", color: "#fff", fontWeight: 800, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", opacity: 1 - zoom * 5 }}>
        1
      </div>
      <SysNav top={1490} bg="transparent" />
    </AbsoluteFill>
  );
};

const Splash: React.FC<{ f: number; v: number }> = ({ f, v }) => {
  const g = 0.5 + 0.5 * Math.sin(f / 2.6);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, #3A2608 0%, #0C0A07 62%)", opacity: v }}>
      <div style={{ position: "absolute", left: 362 - 240, top: 360, width: 480, height: 552, transform: `scale(${0.82 + 0.18 * v})`, filter: `drop-shadow(0 0 ${30 + 30 * g}px rgba(240,184,72,0.7))` }}>
        <Img src={staticFile("jyotiq/logo-full.png")} style={{ width: 480, height: 552 }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 980, textAlign: "center", fontFamily: DEVA, fontSize: 40, color: "#C9B78A" }}>तमसो मा ज्योतिर्गमय</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1046, textAlign: "center", fontFamily: CORMORANT, fontStyle: "italic", fontSize: 38, color: "#8E846F" }}>From darkness, lead me to light</div>
    </AbsoluteFill>
  );
};

/** Jyotiq chat thread reading the kundli (device px). */
export const ReadingScreen: React.FC<{ f: number; t0: number; pace?: number }> = ({ f, t0, pace = 1 }) => {
  const t = f - t0;
  const draw = ramp(f, t0 + 1 * pace, t0 + 9 * pace, "out");
  const glyphs = ramp(f, t0 + 4 * pace, t0 + 13 * pace, "lin");
  const pulse = 0.5 + 0.5 * Math.sin(t / 1.6);
  const dots = [0, 1, 2].map((i) => 0.3 + 0.7 * Math.max(0, Math.sin(t / 2 - i * 0.9)));
  return (
    <AbsoluteFill style={{ background: "#15120E", fontFamily: SANS }}>
      <StatusBar time="11:58" />
      <div style={{ position: "absolute", left: 0, top: 80, width: 724, height: 100, borderBottom: "2px solid #2A241B", display: "flex", alignItems: "center", gap: 16, paddingLeft: 26, boxSizing: "border-box" }}>
        <svg viewBox="0 0 24 24" width={42} height={42}>
          <path d={ICONS.back} fill="#EADBB4" />
        </svg>
        <Img src={staticFile("jyotiq/logo-icon.png")} style={{ width: 70, height: 58 }} />
        <div style={{ fontFamily: CORMORANT, fontWeight: 700, fontSize: 44, color: "#EADBB4", letterSpacing: 2 }}>Jyotiq</div>
      </div>
      <div style={{ position: "absolute", right: 26, top: 214, maxWidth: 560, padding: "22px 30px", borderRadius: "30px 30px 8px 30px", background: "linear-gradient(160deg, #E8CD82, #C9A44E)", color: "#1A1206", fontSize: 38, fontWeight: 700, lineHeight: 1.3 }}>
        {QUESTION} <span style={{ fontSize: 38 }}>😭</span>
      </div>
      <div style={{ position: "absolute", left: 26, top: 380, display: "flex", alignItems: "center", gap: 14, color: "#E8C77A", fontSize: 34, fontWeight: 700 }}>
        <span>✨ Reading your kundli</span>
        {dots.map((o, i) => (
          <span key={i} style={{ width: 12, height: 12, borderRadius: 6, background: "#E8C77A", opacity: o, display: "inline-block" }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 82, top: 460 }}>
        <KundliChart size={560} draw={draw} glyphs={glyphs} hot={["sa", "ma"]} pulse={pulse} />
      </div>
      <div style={{ position: "absolute", left: 26, right: 26, top: 1060, display: "flex", gap: 16, justifyContent: "center", opacity: ramp(f, t0 + 8 * pace, t0 + 12 * pace), transform: `scale(${0.9 + 0.1 * pop(f, t0 + 8 * pace, 8)})` }}>
        <div style={{ padding: "14px 24px", borderRadius: 18, border: "3px solid #6FA8FF", color: "#BFD7FF", fontSize: 32, fontWeight: 800, background: "rgba(111,168,255,0.12)" }}>🪐 Shani · Mahadasha</div>
        <div style={{ padding: "14px 24px", borderRadius: 18, border: "3px solid #FF5A4E", color: "#FFC2BC", fontSize: 32, fontWeight: 800, background: "rgba(255,90,78,0.12)" }}>🔥 Mangal · Antardasha</div>
      </div>
      <SysNav top={1490} bg="#000" />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Room                                                                */
/* ------------------------------------------------------------------ */

export const Bedroom: React.FC<{ f: number; glow: number; moon?: boolean }> = ({ f, glow, moon = true }) => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg, #141936 0%, #1C1E44 55%, #120F26 100%)" }}>
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {/* window */}
      <rect x={70} y={330} width={360} height={470} rx={16} fill="#0A0D24" stroke="#2E3466" strokeWidth={14} />
      {moon ? <circle cx={300} cy={440} r={54} fill="#F5F0D8" /> : null}
      {moon ? <circle cx={322} cy={426} r={50} fill="#0A0D24" /> : null}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <circle key={i} cx={110 + ((i * 71) % 300)} cy={380 + ((i * 113) % 380)} r={2 + (i % 3)} fill="#FFF3D2" opacity={0.4 + 0.6 * (0.5 + 0.5 * Math.sin(f / 5 + i))} />
      ))}
      <path d="M70 565 H430 M250 330 V800" stroke="#2E3466" strokeWidth={10} />
      {/* poster */}
      <rect x={720} y={300} width={270} height={360} rx={8} fill="#2A2F5E" stroke="#3B4180" strokeWidth={6} transform="rotate(4 855 480)" />
      <path d="M800 600 L860 380 L910 600 Z" fill="#3B4180" transform="rotate(4 855 480)" />
      <circle cx={858} cy={360} r={34} fill="#3B4180" />
      {/* shelf + trophy */}
      <rect x={640} y={760} width={380} height={18} fill="#2B2350" />
      <path d="M700 760 L700 700 Q720 690 740 700 L740 760 Z" fill="#6B5A2A" />
      <rect x={800} y={690} width={60} height={70} fill="#33407A" />
      <rect x={870} y={705} width={46} height={55} fill="#5A3570" />
      {/* headboard */}
      <rect x={-20} y={1180} width={1120} height={120} rx={30} fill="#2A2252" />
    </svg>
    {/* phone glow from below */}
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 42% at 50% 92%, rgba(255,196,96,${0.42 * glow}) 0%, rgba(255,150,60,${0.16 * glow}) 45%, transparent 75%)` }} />
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* The kid                                                             */
/* ------------------------------------------------------------------ */

export type Mood = "stress" | "furious" | "cry" | "confused" | "weird";
const SK = { base: "#C98A5A", shade: "#A46A3E", light: "#E6B282" };

const spiral = (r: number, turns = 2.6): string => {
  let d = "";
  const n = 60;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = t * turns * Math.PI * 2;
    const rr = r * t;
    d += `${i === 0 ? "M" : "L"}${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)}`;
  }
  return d;
};

const KidHead: React.FC<{ f: number; mood: Mood; blink: number }> = ({ f, mood, blink }) => {
  const furious = mood === "furious";
  const cry = mood === "cry";
  const conf = mood === "confused";
  const weird = mood === "weird";
  const quake = furious ? Math.sin(f * 2.7) * 5 : cry ? Math.sin(f * 1.9) * 3 : 0;
  // eyebrows: [inner y, outer y] relative
  const brow = furious ? { in: 40, out: -36 } : cry ? { in: -46, out: 6 } : conf ? { in: -10, out: -26 } : weird ? { in: -40, out: -50 } : { in: -26, out: -6 };
  return (
    <g transform={`translate(${quake} 0)`}>
      {/* ears */}
      <ellipse cx={-258} cy={30} rx={46} ry={62} fill={SK.base} stroke={INK} strokeWidth={7} />
      <ellipse cx={258} cy={30} rx={46} ry={62} fill={SK.base} stroke={INK} strokeWidth={7} />
      <ellipse cx={-258} cy={34} rx={20} ry={32} fill={SK.shade} />
      <ellipse cx={258} cy={34} rx={20} ry={32} fill={SK.shade} />
      {/* face */}
      <path d="M-252 -40 C-252 -232 -132 -302 0 -302 C132 -302 252 -232 252 -40 C252 92 192 202 92 252 C52 272 -52 272 -92 252 C-192 202 -252 92 -252 -40Z" fill={SK.base} stroke={INK} strokeWidth={8} />
      <path d="M-232 70 C-200 180 -120 240 -40 258 C-110 230 -180 170 -214 60Z" fill={SK.shade} opacity={0.75} />
      <path d="M150 -220 C210 -180 236 -110 238 -40" fill="none" stroke={SK.light} strokeWidth={16} strokeLinecap="round" opacity={0.7} />
      {/* rage flush / sad blue */}
      {furious ? <path d="M-252 -40 C-252 -232 -132 -302 0 -302 C132 -302 252 -232 252 -40 L252 -10 L-252 -10Z" fill="#E8283C" opacity={0.38} /> : null}
      {cry ? <path d="M-252 -40 C-252 -232 -132 -302 0 -302 C132 -302 252 -232 252 -40 L252 -60 L-252 -60Z" fill="#3D6BFF" opacity={0.3} /> : null}
      {/* blush */}
      <ellipse cx={-150} cy={118} rx={50} ry={22} fill="#FF7A8A" opacity={weird || cry ? 0.75 : 0.35} />
      <ellipse cx={150} cy={118} rx={50} ry={22} fill="#FF7A8A" opacity={weird || cry ? 0.75 : 0.35} />
      {/* eyes */}
      {mood === "stress" ? (
        <>
          <Eye x={-108} y={22} w={142} h={164} iris="#5A3418" look={[wob("ek", f / 3) * 6, 10]} lid={blink} small={0.72} />
          <Eye x={108} y={22} w={142} h={164} iris="#5A3418" look={[wob("ek", f / 3) * 6, 10]} lid={blink} flip small={0.72} />
          <path d="M-170 106 Q-108 130 -46 106 M46 106 Q108 130 170 106" fill="none" stroke="#5B3A78" strokeWidth={8} strokeLinecap="round" opacity={0.6} />
        </>
      ) : null}
      {furious ? (
        <>
          {[-1, 1].map((sd) => (
            <g key={sd}>
              <path d={`M${sd * 40} ${-6} L${sd * 176} ${-30} L${sd * 168} ${50} Q${sd * 100} ${70} ${sd * 44} ${44}Z`} fill="#FFFFFF" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
              <circle cx={sd * 104} cy={26} r={15} fill={INK} />
            </g>
          ))}
        </>
      ) : null}
      {cry ? (
        <>
          {[-1, 1].map((sd) => (
            <path key={sd} d={`M${sd * 46} ${30} Q${sd * 108} ${-26} ${sd * 172} ${30}`} fill="none" stroke={INK} strokeWidth={11} strokeLinecap="round" />
          ))}
        </>
      ) : null}
      {conf ? (
        <>
          {[-1, 1].map((sd) => (
            <g key={sd} transform={`translate(${sd * 108} 24) rotate(${(f * 22 * sd) % 360})`}>
              <circle r={70} fill="#FFFFFF" stroke={INK} strokeWidth={7} />
              <path d={spiral(62)} fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
            </g>
          ))}
        </>
      ) : null}
      {weird ? (
        <>
          <Eye x={-112} y={14} w={180} h={200} iris="#5A3418" look={[18, 4]} small={0.32} />
          <path d="M60 30 Q110 6 168 30" fill="none" stroke={INK} strokeWidth={11} strokeLinecap="round" />
          <path d="M64 46 L168 34" stroke={INK} strokeWidth={5} opacity={0.5} />
        </>
      ) : null}
      {/* brows */}
      {[-1, 1].map((sd) => (
        <path
          key={sd}
          d={`M${sd * 42} ${-92 + brow.in} Q${sd * 110} ${-110 + (brow.in + brow.out) / 2 - 12} ${sd * 178} ${-92 + brow.out}`}
          fill="none"
          stroke={INK}
          strokeWidth={weird && sd === 1 ? 12 : 16}
          strokeLinecap="round"
        />
      ))}
      {/* nose */}
      <path d="M-8 86 Q6 100 -4 112" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" opacity={0.7} />
      {/* mouth */}
      {mood === "stress" ? (
        <g transform="translate(0 168)">
          <path d="M-70 0 Q0 -18 70 0 L66 22 Q0 40 -66 22Z" fill="#FFFFFF" stroke={INK} strokeWidth={6} />
          <path d="M-46 -6 V30 M-16 -10 V36 M16 -10 V36 M46 -6 V30" stroke={INK} strokeWidth={3} opacity={0.6} />
        </g>
      ) : null}
      {furious ? (
        <g transform={`translate(0 178) scale(${1 + 0.06 * Math.sin(f * 2.2)})`}>
          <path d="M-120 -40 Q0 -70 120 -40 Q110 70 0 80 Q-110 70 -120 -40Z" fill="#5A0E1C" stroke={INK} strokeWidth={8} />
          <path d="M-110 -36 Q0 -62 110 -36 L104 -6 Q0 -26 -104 -6Z" fill="#FFFFFF" />
          <path d="M-80 54 Q0 30 80 54 Q40 78 0 79 Q-40 78 -80 54Z" fill="#FFFFFF" />
          <path d="M-50 40 Q0 10 50 40" fill="#E85A6A" />
        </g>
      ) : null}
      {cry ? (
        <g transform={`translate(0 180) scale(${1 + 0.08 * Math.sin(f * 1.7)} ${1 + 0.12 * Math.sin(f * 1.7)})`}>
          <path d="M-100 -30 Q0 -64 100 -30 Q96 80 0 92 Q-96 80 -100 -30Z" fill="#4A0A18" stroke={INK} strokeWidth={8} />
          <path d="M-56 60 Q0 22 56 60 Q30 88 0 90 Q-30 88 -56 60Z" fill="#E85A6A" />
          <path d="M-92 -28 Q0 -58 92 -28 L86 -4 Q0 -26 -86 -4Z" fill="#FFFFFF" />
        </g>
      ) : null}
      {conf ? <path d="M-60 176 Q-30 150 0 176 Q30 202 60 176" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" /> : null}
      {weird ? (
        <g transform="translate(10 160)">
          <path d="M-110 -10 Q0 60 120 -26 Q100 70 0 84 Q-100 70 -110 -10Z" fill="#5A0E1C" stroke={INK} strokeWidth={8} />
          <path d="M-96 -2 Q0 50 106 -18 L100 4 Q0 60 -92 14Z" fill="#FFFFFF" />
          <path d="M40 40 Q70 30 92 60 Q96 110 60 116 Q30 112 30 70Z" fill="#FF7A8A" stroke={INK} strokeWidth={6} />
          <path d="M60 60 L62 100" stroke="#D44A5A" strokeWidth={4} />
        </g>
      ) : null}
      {/* tears */}
      {cry
        ? [-1, 1].map((sd) => {
            const fl = (f % 6) / 6;
            return (
              <g key={sd}>
                <path d={`M${sd * 70} 40 C${sd * 64} 160 ${sd * 90} 300 ${sd * 60} 520 L${sd * 160} 520 C${sd * 140} 300 ${sd * 168} 160 ${sd * 160} 40Z`} fill="#7EC8FF" stroke={INK} strokeWidth={6} opacity={0.95} />
                {[0, 1, 2].map((k) => (
                  <path key={k} d={`M${sd * (92 + k * 18)} ${80 + ((fl + k / 3) % 1) * 400} l0 60`} stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" opacity={0.75} />
                ))}
              </g>
            );
          })
        : null}
      {/* hair */}
      <path
        d="M-272 -30 C-300 -210 -186 -372 0 -372 C196 -372 306 -226 272 -30 L232 -112 L214 -26 L170 -152 L124 -58 L82 -176 L24 -82 L-38 -184 L-92 -70 L-142 -164 L-184 -58 L-224 -142 L-246 -24Z"
        fill="#1A1424"
        stroke={INK}
        strokeWidth={8}
        strokeLinejoin="round"
      />
      <path d="M-140 -300 C-80 -340 40 -350 120 -316" fill="none" stroke="#4A3C66" strokeWidth={18} strokeLinecap="round" opacity={0.8} />
      {/* ahoge */}
      {conf ? (
        <path d="M10 -366 C10 -440 90 -456 96 -404 C100 -370 50 -372 52 -340" fill="none" stroke="#1A1424" strokeWidth={22} strokeLinecap="round" />
      ) : (
        <path d={cry ? "M10 -364 C30 -420 110 -400 130 -330 C96 -380 50 -380 30 -360Z" : furious ? "M0 -366 L40 -470 L44 -364Z" : "M6 -366 C0 -450 86 -478 116 -426 C78 -446 44 -414 34 -364Z"} fill="#1A1424" stroke={INK} strokeWidth={6} />
      )}
      {/* stress / mood symbols */}
      {mood === "stress" ? (
        <>
          <Sweat x={232} y={-120} s={1.6} />
          <Sweat x={-226} y={-80} s={1.1} o={0.9} />
        </>
      ) : null}
      {furious ? (
        <>
          <AngerVein x={150} y={-232} s={1.8} />
          <AngerVein x={-170} y={-200} s={1.1} />
        </>
      ) : null}
      {conf
        ? [0, 1, 2].map((k) => (
            <text key={k} x={-330 + k * 330} y={-300 - Math.sin(f / 4 + k) * 22 - (k === 1 ? 60 : 0)} fontFamily={SANS} fontWeight={800} fontSize={120 - k * 8} fill="#FFFFFF" stroke={INK} strokeWidth={9} style={{ paintOrder: "stroke" }} transform={`rotate(${-14 + k * 14} ${-330 + k * 330} -300)`}>
              ?
            </text>
          ))
        : null}
      {weird ? (
        <g opacity={0.95}>
          <path d="M210 -250 l18 -40 l18 40 l40 18 l-40 18 l-18 40 l-18 -40 l-40 -18Z" fill="#FFE27A" stroke={INK} strokeWidth={5} />
        </g>
      ) : null}
    </g>
  );
};

/** Torso + hands holding a phone (back to camera). */
const KidBody: React.FC<{ f: number; typing: number; mood: Mood }> = ({ f, typing, mood }) => {
  const shiver = mood === "furious" ? Math.sin(f * 2.7) * 4 : 0;
  const tapL = typing * Math.max(0, Math.sin(f * 1.9)) * 12;
  const tapR = typing * Math.max(0, Math.sin(f * 1.9 + 2)) * 12;
  return (
    <g transform={`translate(${shiver} 0)`}>
      {/* neck */}
      <path d="M-70 220 L-74 320 L74 320 L70 220Z" fill={SK.shade} stroke={INK} strokeWidth={7} />
      {/* T-shirt */}
      <path d="M-330 1100 C-350 760 -320 420 -220 340 C-150 300 -90 296 -60 300 Q0 350 60 300 C90 296 150 300 220 340 C320 420 350 760 330 1100Z" fill="#F3B428" stroke={INK} strokeWidth={8} />
      <path d="M-300 1100 C-316 820 -300 520 -230 420 C-260 560 -270 820 -240 1100Z" fill="#C98A14" opacity={0.8} />
      <path d="M-60 300 Q0 360 60 300" fill="none" stroke={INK} strokeWidth={8} />
      {/* planet print */}
      <g transform="translate(130 520) rotate(-16)">
        <circle r={54} fill="#2B2350" stroke={INK} strokeWidth={6} />
        <ellipse rx={92} ry={20} fill="none" stroke="#2B2350" strokeWidth={10} />
        <ellipse rx={92} ry={20} fill="none" stroke={INK} strokeWidth={3} />
      </g>
      {/* phone (back) + glow */}
      <ellipse cx={0} cy={650} rx={260} ry={120} fill="url(#g-glow)" opacity={0.65} />
      <g transform={`translate(0 640) rotate(${wob("ph", f / 6) * 3})`}>
        <rect x={-150} y={-230} width={300} height={460} rx={44} fill="#141420" stroke={INK} strokeWidth={8} />
        <rect x={-110} y={-196} width={86} height={110} rx={28} fill="#22222E" stroke="#3A3A4A" strokeWidth={4} />
        <circle cx={-90} cy={-170} r={18} fill="#0A0A10" stroke="#55556A" strokeWidth={4} />
        <circle cx={-90} cy={-116} r={18} fill="#0A0A10" stroke="#55556A" strokeWidth={4} />
        <circle cx={-46} cy={-142} r={8} fill="#E8E2C8" />
        <path d="M-150 -230 L150 -230" stroke="#FFD27A" strokeWidth={6} opacity={0.6} />
      </g>
      {/* hands */}
      {[-1, 1].map((sd) => (
        <g key={sd} transform={`translate(${sd * 160} ${700 - (sd < 0 ? tapL : tapR)})`}>
          <path d={`M${-sd * 10} -80 C${sd * 60} -90 ${sd * 90} -30 ${sd * 80} 40 C${sd * 70} 110 ${sd * 10} 120 ${-sd * 30} 90 C${-sd * 50} 40 ${-sd * 40} -50 ${-sd * 10} -80Z`} fill={SK.base} stroke={INK} strokeWidth={7} />
          <path d={`M${-sd * 34} -40 Q${-sd * 60} -10 ${-sd * 40} 30`} fill="none" stroke={SK.shade} strokeWidth={8} strokeLinecap="round" />
        </g>
      ))}
      {/* sleeves */}
      <path d="M-330 600 C-300 700 -250 760 -190 780 L-160 700 C-220 680 -260 620 -270 560Z" fill="#F3B428" stroke={INK} strokeWidth={7} />
      <path d="M330 600 C300 700 250 760 190 780 L160 700 C220 680 260 620 270 560Z" fill="#F3B428" stroke={INK} strokeWidth={7} />
    </g>
  );
};

const MOOD_BG: Record<Mood, React.FC<{ f: number }>> = {
  stress: () => null,
  furious: ({ f }) => (
    <>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 44%, #FF6A3D 0%, #C3122A 46%, #4A0412 100%)" }} />
      <FocusLines f={f} cx={540} cy={860} rx={420} ry={600} color="#FFE1D0" opacity={0.75} count={90} />
    </>
  ),
  cry: ({ f }) => (
    <>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #2747C9 0%, #142A7A 60%, #0B1240 100%)" }} />
      <SpeedLines f={f} angle={90} count={60} color="#9FC4FF" opacity={0.35} speed={70} seed="rain" />
    </>
  ),
  confused: ({ f }) => (
    <>
      <AbsoluteFill style={{ background: `conic-gradient(from ${f * 9}deg at 50% 46%, #6A3FD8, #B04FD8, #3A2C9A, #8A5CF0, #6A3FD8)` }} />
      <Halftone color="rgba(255,255,255,0.18)" size={26} dot={4} />
    </>
  ),
  weird: ({ f }) => (
    <>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 44%, #FFF3A0 0%, #FFB347 50%, #FF6FA8 100%)" }} />
      <Halftone color="rgba(255,255,255,0.35)" size={34} dot={7} />
      <FocusLines f={f} cx={540} cy={860} rx={460} ry={640} color="#FFFFFF" opacity={0.45} count={70} seed="wd" />
    </>
  ),
};

const AnswerCard: React.FC<{ f: number; t0?: number; at?: [number, number, number] }> = ({ f, t0 = 88, at = [90, 106, 128] }) => {
  const lines: { at: number; text: React.ReactNode }[] = [
    { at: at[0], text: <>🪐 <b style={{ color: "#9EC2FF" }}>Shani ki Mahadasha</b> chal rahi hai</> },
    { at: at[1], text: <>🔥 Upar se <b style={{ color: "#FF8A80" }}>Mangal ki Antardasha</b></> },
    { at: at[2], text: <>🏍️ Aur Shani Dev abhi <b style={{ color: GOLD }}>full ride pe</b> hain…</> },
  ];
  const v = pop(f, t0, 8);
  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        width: 952,
        top: 1290,
        padding: "22px 28px 26px",
        borderRadius: 30,
        background: "linear-gradient(170deg, rgba(30,26,20,0.97), rgba(16,13,9,0.97))",
        border: "3px solid #8A6A2E",
        boxShadow: "0 0 40px rgba(240,184,72,0.35), 0 18px 40px rgba(0,0,0,0.5)",
        transform: `translateY(${(1 - v) * 120}px) scale(${0.9 + 0.1 * v})`,
        opacity: Math.min(1, v * 1.5),
        fontFamily: SANS,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
        <Img src={staticFile("jyotiq/logo-icon.png")} style={{ width: 66, height: 54 }} />
        <div style={{ fontFamily: CORMORANT, fontWeight: 700, fontSize: 44, color: "#EADBB4", letterSpacing: 2 }}>Jyotiq</div>
        <div style={{ marginLeft: "auto", fontSize: 26, fontWeight: 700, color: "#8D8676" }}>reading your kundli</div>
      </div>
      {lines.map((ln, i) => {
        const lv = pop(f, ln.at, 7);
        return (
          <div key={i} style={{ fontSize: 42, fontWeight: 700, color: "#F5ECDD", lineHeight: 1.28, opacity: lv, transform: `translateX(${(1 - lv) * -40}px)`, height: lv > 0 ? undefined : 0, overflow: "hidden" }}>
            {ln.text}
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

/** Kid-scene clock. KID_V1 reproduces the approved v1 cut exactly; KID_V2 is the slower v2 opening. */
export type KidT = {
  face: number; // cut from the POV phone to the kid typing
  tap: number; // thumb taps the Jyotiq icon
  splashIn: number; // splash fade-in frames (starts at tap + 8)
  handIn: number; // frames for the hand to settle into frame
  typeFrom: number; // question bubble pops, typing starts
  typeSpeed: number; // characters per frame
  sent: number; // bubble flies off
  read: number; // Jyotiq reading screen
  readPace: number; // >1 = slower chart draw
  react: number; // furious smash-cut + answer card
  cry: number;
  cry2?: number; // second wail of the crying meme: punch-in
  confused: number;
  weird: number;
  ans: [number, number, number]; // answer card line times
};
export const KID_V1: KidT = { face: 40, tap: 19, splashIn: 7, handIn: 14, typeFrom: 44, typeSpeed: 1.6, sent: 66, read: 72, readPace: 1, react: 88, cry: 101, confused: 123, weird: 137, ans: [90, 106, 128] };
export const KID_V2: KidT = {
  face: K2.face,
  tap: K2.tap,
  splashIn: 8,
  handIn: 20,
  typeFrom: K2.typeFrom,
  typeSpeed: 1.1,
  sent: K2.sent,
  read: K2.read,
  readPace: 1.5,
  react: K2.react,
  cry: K2.cry,
  cry2: K2.cry2,
  confused: K2.confused,
  weird: K2.weird,
  ans: [150, 170, 200],
};

const moodAt = (f: number, T: KidT): Mood => (f < T.react ? "stress" : f < T.cry ? "furious" : f < T.confused ? "cry" : f < T.weird ? "confused" : "weird");

export const S1Kid: React.FC<{ f: number; T?: KidT }> = ({ f, T = KID_V1 }) => {
  /* Shot A: POV phone (v1 0-40, v2 0-66) */
  if (f < T.face) {
    const tapAt = T.tap;
    const press = hit(f, tapAt, 6);
    const zoom = ramp(f, tapAt + 2, tapAt + 13, "in");
    const splash = ramp(f, tapAt + 8, tapAt + 8 + T.splashIn, "out");
    const icon = dev(JQ_ICON.x, JQ_ICON.y);
    const tipRest = { x: 930, y: 1250 };
    const tx = track(f, [
      [0, tipRest.x],
      [tapAt - 1, icon.x + 10, "io"],
      [tapAt + 10, tipRest.x + 40, "in"],
    ]);
    const ty = track(f, [
      [0, tipRest.y],
      [tapAt - 1, icon.y + 30, "io"],
      [tapAt + 10, tipRest.y + 140, "in"],
    ]);
    const hand = { x: wob("hx", f / 9) * 8, y: wob("hy", f / 9) * 8 + track(f, [[0, 60], [T.handIn, 0, "out"]]) };
    return (
      <AbsoluteFill style={{ background: "#0A0816", overflow: "hidden" }}>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 50% at 50% 60%, #2A2050 0%, #0A0816 70%)" }} />
        <StarDust f={f} count={40} opacity={0.35} seed="bok" />
        <div style={{ position: "absolute", inset: 0, transform: `translate(${hand.x}px, ${hand.y - 120}px) scale(1.04)` }}>
          <PalmBack />
          <PhoneFrame>
            <AndroidHome f={f} zoom={zoom} />
            {splash > 0 ? <Splash f={f} v={splash} /> : null}
          </PhoneFrame>
          <FingersFront />
          <Ripple x={icon.x} y={icon.y} t={f - tapAt} />
          <Thumb B={{ x: 1130, y: 1760 }} T={{ x: tx, y: ty }} press={press} />
          {/* screen light spill */}
          <AbsoluteFill style={{ background: `radial-gradient(ellipse 50% 40% at 50% 55%, rgba(255,200,110,${0.12 * splash}) 0%, transparent 70%)` }} />
        </div>
      </AbsoluteFill>
    );
  }

  /* Shot C: phone close-up reading the kundli (v1 72-88, v2 114-147) */
  if (f >= T.read && f < T.react) {
    const push = ramp(f, T.read, T.react, "lin");
    return (
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #3A2608 0%, #0C0A07 70%)", overflow: "hidden" }}>
        <FocusLines f={f} cx={540} cy={1000} rx={520} ry={760} color="#F2C14E" opacity={0.18} count={70} seed="rd" />
        <div style={{ position: "absolute", inset: 0, transform: `translate(0px, ${20}px) scale(${1.16 + 0.06 * push}) rotate(${-2 + 2 * push}deg)`, transformOrigin: "540px 1150px" }}>
          <PhoneFrame>
            <ReadingScreen f={f} t0={T.read} pace={T.readPace} />
          </PhoneFrame>
        </div>
      </AbsoluteFill>
    );
  }

  /* Shots B + D: the kid's face */
  const mood = moodAt(f, T);
  const cutAt = f < T.read ? T.face : mood === "furious" ? T.react : mood === "cry" ? T.cry : mood === "confused" ? T.confused : T.weird;
  // v2: the crying meme's second wail lands on the next kick -> punch in and sob harder
  const wail2 = mood === "cry" && T.cry2 !== undefined && f >= T.cry2;
  const punch = Math.max(hit(f, cutAt, 7), wail2 && T.cry2 !== undefined ? hit(f, T.cry2, 7) * 1.15 : 0);
  const sh = shake(f, mood === "furious" ? 0.7 + punch : punch * 0.9, "kid");
  const blink = mood === "stress" && f % 38 > 34 ? 1 : 0;
  const typing = f < T.read ? 1 : 0;
  const tilt = mood === "confused" ? -9 : mood === "weird" ? 6 : 0;
  const scale = 1 + 0.12 * punch + (f < T.read ? 0.05 * ramp(f, T.face, T.read, "lin") : 0) + (wail2 ? 0.07 : 0);
  const Bg = MOOD_BG[mood];
  const sent = f >= T.sent && f < T.read;
  const typedN = Math.floor(Math.min(QUESTION.length, Math.max(0, (f - T.typeFrom) * T.typeSpeed)));
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#0A0816" }}>
      {mood === "stress" ? <Bedroom f={f} glow={0.8 + 0.2 * Math.sin(f / 4)} /> : <Bg f={f} />}
      <div style={{ position: "absolute", inset: 0, transform: `translate(${sh.x}px, ${sh.y}px) rotate(${sh.r + tilt}deg) scale(${scale})`, transformOrigin: "540px 900px" }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <g transform="translate(540 1000)">
            <KidBody f={f} typing={typing} mood={mood} />
          </g>
          <g transform={`translate(540 ${880 + (mood === "cry" ? Math.sin(f * 1.7) * (wail2 ? 10 : 6) : 0)})`}>
            <KidHead f={f} mood={mood} blink={blink} />
          </g>
        </svg>
      </div>
      {/* steam on rage */}
      {mood === "furious"
        ? [0, 1].map((k) => {
            const t = ((f - T.react) * 0.09 + k * 0.5) % 1;
            return <div key={k} style={{ position: "absolute", left: k ? 840 : 140, top: 720 - t * 260, width: 120 + t * 80, height: 120 + t * 80, borderRadius: "50%", background: "rgba(255,255,255,0.75)", opacity: 1 - t, filter: "blur(4px)" }} />;
          })
        : null}
      {/* typing bubble */}
      {f < T.read ? (
        <div
          style={{
            position: "absolute",
            left: 120,
            width: 840,
            top: 1410,
            padding: "22px 30px",
            borderRadius: "30px 30px 30px 8px",
            background: "linear-gradient(160deg, #E8CD82, #C9A44E)",
            color: "#1A1206",
            fontFamily: SANS,
            fontSize: 46,
            fontWeight: 800,
            boxShadow: "0 0 36px rgba(240,184,72,0.45)",
            transform: sent ? `translateY(${-ramp(f, T.sent, T.sent + 6, "in") * 500}px) scale(${1 - 0.4 * ramp(f, T.sent, T.sent + 6, "in")})` : `scale(${pop(f, T.typeFrom, 6)})`,
            opacity: sent ? 1 - ramp(f, T.sent + 2, T.sent + 6) : 1,
          }}
        >
          {QUESTION.slice(0, typedN)}
          {typedN < QUESTION.length ? <span style={{ display: "inline-block", width: 4, height: 46, background: "#1A1206", verticalAlign: "middle", marginLeft: 4 }} /> : null}
        </div>
      ) : null}
      {f < T.read ? (
        <div style={{ position: "absolute", left: 60, top: 1260, fontFamily: SANS, fontWeight: 900, fontSize: 56, color: "#FFFFFF", WebkitTextStroke: `3px ${INK}`, transform: `rotate(-10deg) translateY(${Math.sin(f) * 4}px)`, opacity: 0.9 }}>
          tap tap tap!!
        </div>
      ) : null}
      {f >= T.react ? <AnswerCard f={f} t0={T.react} at={T.ans} /> : null}
    </AbsoluteFill>
  );
};
