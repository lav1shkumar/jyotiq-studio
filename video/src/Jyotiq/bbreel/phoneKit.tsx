import React from "react";

/* Phone + hand, in WORLD px (the 1080x1920 frame before the S6 camera).
   A right hand in POV: palm behind the phone, four fingertips wrapped over
   the left edge, thumb over the screen from the right. Anime cel shading:
   flat base, one hard shadow tone, one highlight, dark brown line art. */

export const PH = { x: 226, y: 500, w: 628, h: 1328, bezel: 14, r: 78 };
export const SCR = { x: PH.x + PH.bezel, y: PH.y + PH.bezel, w: 600, h: 1300, r: 64 };
/** Screens are laid out in device px (724 x 1568, the size of Ayush's screenshots). */
export const DW = 724;
export const DH = 1568;
export const K = SCR.w / DW;
export const dev = (x: number, y: number) => ({ x: SCR.x + x * K, y: SCR.y + y * K });

export const SKIN = { base: "#D79C6A", shade: "#B0743F", light: "#F0C497", line: "#4A2814", nail: "#EFC7A6", nailHi: "#FBE3CF" };

/** Phone body; `children` is the screen content in device px (724 x 1568). */
export const PhoneFrame: React.FC<{ children: React.ReactNode; glare?: number }> = ({ children, glare = 1 }) => (
  <div style={{ position: "absolute", left: PH.x, top: PH.y, width: PH.w, height: PH.h }}>
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: PH.r,
        background: "linear-gradient(140deg, #4A4A55 0%, #17171C 18%, #0B0B0E 60%, #2C2C34 100%)",
        boxShadow: "0 40px 90px rgba(0,0,0,0.65), 0 0 0 2px #050507, inset 0 0 0 3px #3A3A44",
      }}
    />
    {/* side keys */}
    <div style={{ position: "absolute", right: -5, top: 300, width: 6, height: 150, borderRadius: 3, background: "#26262D" }} />
    <div style={{ position: "absolute", right: -5, top: 490, width: 6, height: 90, borderRadius: 3, background: "#26262D" }} />
    <div
      style={{
        position: "absolute",
        left: PH.bezel,
        top: PH.bezel,
        width: SCR.w,
        height: SCR.h,
        borderRadius: SCR.r,
        overflow: "hidden",
        background: "#000",
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, width: DW, height: DH, transform: `scale(${K})`, transformOrigin: "0 0" }}>{children}</div>
      {/* punch-hole camera */}
      <div style={{ position: "absolute", left: SCR.w / 2 - 11, top: 17, width: 22, height: 22, borderRadius: 11, background: "#050506", boxShadow: "0 0 0 3px #111116" }} />
      {/* glass */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.07) 0%, transparent 32%, transparent 70%, rgba(255,255,255,0.04) 100%)", opacity: glare }} />
    </div>
  </div>
);

/** Palm and wrist, drawn BEHIND the phone (only the parts outside it show). */
export const PalmBack: React.FC = () => (
  <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    <path
      d="M190 2000 C196 1860 236 1742 318 1668 L860 1530 C946 1512 1008 1572 1020 1668 C1032 1772 1012 1880 996 2000 Z"
      fill={SKIN.base}
      stroke={SKIN.line}
      strokeWidth={5}
    />
    {/* thenar shadow (cel) */}
    <path d="M880 1600 C950 1600 990 1660 996 1740 C1000 1820 990 1900 980 2000 L900 2000 C920 1880 930 1760 880 1600 Z" fill={SKIN.shade} />
    <path d="M940 1560 C980 1580 1004 1620 1010 1660" fill="none" stroke={SKIN.light} strokeWidth={10} strokeLinecap="round" opacity={0.8} />
    {/* kurta cuff at the wrist */}
    <path d="M150 1990 C330 1940 760 1930 1040 1980 L1040 2100 L150 2100 Z" fill="#3A1F48" />
    <path d="M150 1990 C330 1940 760 1930 1040 1980" fill="none" stroke="#E2B65C" strokeWidth={8} />
  </svg>
);

/** One finger curled round the phone's left edge: knuckle bulge outside, tip just over the bezel. */
const Finger: React.FC<{ id: string; y: number; h: number; reach: number }> = ({ id, y, h, reach }) => {
  const xr = PH.x + 12;
  const xl = PH.x - reach + h;
  const shape = `M${xr} ${y - h} L${xl} ${y - h} A${h * 0.95} ${h} 0 0 0 ${xl} ${y + h} L${xr} ${y + h} A16 ${h} 0 0 0 ${xr} ${y - h} Z`;
  return (
    <g>
      <defs>
        <clipPath id={`fc-${id}`}>
          <path d={shape} />
        </clipPath>
      </defs>
      <path d={shape} fill={SKIN.base} />
      <g clipPath={`url(#fc-${id})`}>
        <rect x={PH.x - reach - 20} y={y + h * 0.3} width={reach + 60} height={h} fill={SKIN.shade} />
        <ellipse cx={PH.x + 14} cy={y - h * 0.05} rx={11} ry={h * 0.62} fill="#E9B386" />
      </g>
      <path d={`M${xl - h * 0.25} ${y - h * 0.62} L${PH.x - 14} ${y - h * 0.62}`} stroke={SKIN.light} strokeWidth={8} strokeLinecap="round" opacity={0.9} />
      <path d={`M${xl + h * 0.5} ${y - h * 0.6} Q${xl + h * 0.78} ${y} ${xl + h * 0.5} ${y + h * 0.6}`} fill="none" stroke={SKIN.line} strokeWidth={3.5} opacity={0.5} />
      <path d={shape} fill="none" stroke={SKIN.line} strokeWidth={5} strokeLinejoin="round" />
    </g>
  );
};

/** The four fingers over the left edge (drawn IN FRONT of the phone), pinky first so each overlaps the one below. */
export const FingersFront: React.FC = () => (
  <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    {/* back of the hand behind the curled fingers */}
    <path d={`M${PH.x + 10} 1140 C${PH.x - 70} 1150 ${PH.x - 112} 1260 ${PH.x - 116} 1360 C${PH.x - 112} 1450 ${PH.x - 80} 1530 ${PH.x + 10} 1545 Z`} fill={SKIN.shade} stroke={SKIN.line} strokeWidth={5} />
    <Finger id="p" y={1494} h={42} reach={80} />
    <Finger id="r" y={1404} h={50} reach={98} />
    <Finger id="m" y={1304} h={54} reach={108} />
    <Finger id="i" y={1202} h={52} reach={96} />
  </svg>
);

type P = { x: number; y: number };

/** Thumb from base B to tip T (world px), nail side towards the viewer. */
export const Thumb: React.FC<{ B: P; T: P; w?: number; press?: number }> = ({ B, T, w = 104, press = 0 }) => {
  const L = Math.hypot(T.x - B.x, T.y - B.y);
  const ang = (Math.atan2(T.y - B.y, T.x - B.x) * 180) / Math.PI;
  const s = 1 - 0.035 * press;
  const ww = w * (1 + 0.04 * press);
  const n0 = L - ww * 0.98;
  const n1 = L - ww * 0.14;
  const body = `M0 ${-ww * 0.66} C${L * 0.4} ${-ww * 0.7} ${L * 0.72} ${-ww * 0.58} ${L - ww * 0.5} ${-ww * 0.5} A${ww * 0.5} ${ww * 0.5} 0 0 1 ${L - ww * 0.5} ${ww * 0.5} C${L * 0.72} ${ww * 0.58} ${L * 0.4} ${ww * 0.7} 0 ${ww * 0.66} Z`;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      <g transform={`translate(${B.x} ${B.y}) rotate(${ang}) scale(${s})`} style={{ filter: "drop-shadow(-10px 16px 18px rgba(0,0,0,0.45))" }}>
        <path d={body} fill={SKIN.base} stroke={SKIN.line} strokeWidth={5} strokeLinejoin="round" />
        {/* cel shadow on the lower edge */}
        <path d={`M0 ${ww * 0.28} C${L * 0.4} ${ww * 0.36} ${L * 0.7} ${ww * 0.3} ${L - ww * 0.42} ${ww * 0.3} A${ww * 0.48} ${ww * 0.48} 0 0 1 ${L - ww * 0.5} ${ww * 0.5} C${L * 0.72} ${ww * 0.58} ${L * 0.4} ${ww * 0.7} 0 ${ww * 0.66} Z`} fill={SKIN.shade} />
        <path d={`M${L * 0.1} ${-ww * 0.46} C${L * 0.4} ${-ww * 0.52} ${L * 0.66} ${-ww * 0.44} ${L - ww * 1.1} ${-ww * 0.4}`} fill="none" stroke={SKIN.light} strokeWidth={9} strokeLinecap="round" opacity={0.9} />
        {/* knuckle creases */}
        <path d={`M${L - ww * 1.35} ${-ww * 0.3} Q${L - ww * 1.25} 0 ${L - ww * 1.35} ${ww * 0.3}`} fill="none" stroke={SKIN.line} strokeWidth={3.5} opacity={0.5} />
        <path d={`M${L - ww * 1.5} ${-ww * 0.22} Q${L - ww * 1.42} 0 ${L - ww * 1.5} ${ww * 0.22}`} fill="none" stroke={SKIN.line} strokeWidth={3} opacity={0.4} />
        {/* nail */}
        <rect x={n0} y={-ww * 0.33} width={n1 - n0} height={ww * 0.66} rx={ww * 0.3} fill={SKIN.nail} stroke={SKIN.line} strokeWidth={4} />
        <rect x={n0 + ww * 0.1} y={-ww * 0.22} width={(n1 - n0) * 0.5} height={ww * 0.14} rx={ww * 0.07} fill={SKIN.nailHi} />
        <path d={`M${n0 + ww * 0.12} ${-ww * 0.3} Q${n0 - ww * 0.04} 0 ${n0 + ww * 0.12} ${ww * 0.3}`} fill="none" stroke={SKIN.shade} strokeWidth={4} opacity={0.7} />
      </g>
    </svg>
  );
};

/** Touch ripple at a world point; t = frames since the press. */
export const Ripple: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  if (t < 0 || t > 10) return null;
  const u = t / 10;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 70 * (0.3 + u),
        top: y - 70 * (0.3 + u),
        width: 140 * (0.3 + u),
        height: 140 * (0.3 + u),
        borderRadius: "50%",
        background: "rgba(255,255,255,0.22)",
        border: "3px solid rgba(255,255,255,0.6)",
        opacity: 1 - u,
        pointerEvents: "none",
      }}
    />
  );
};
