import React from "react";
import { ramp } from "../../manthan/style";
import { Diya } from "../d1/diya";

/* Diwali Day 5 sets, part 1.
   IndiaMap: a stylised outline of India for 06 (one festival, many names), drawn from about 40 points placed by
   longitude and latitude (x = 200 + (lon - 68) * 24.1, y = 520 + (37 - lat) * 30.3), so the pins land in the right
   regions. Nepal, a neighbour, is drawn apart with a dashed outline. Illustrative, not a survey map.
   `k` 0..1 draws the coast in and fades the land up; the pins glow once the outline is complete. */

export const INDIA_PATH =
  "M429 565L489 656L513 726L501 768L598 814L687 841L697 796L735 829L771 829L851 778L899 808L839 884L803 959L766 929" +
  "L754 878L725 859L701 914L706 975L646 1035L549 1126L496 1171L496 1247L484 1323L429 1396L393 1338L364 1250L342 1174" +
  "L316 1065L313 999L308 965L270 1011L224 965L214 929L248 908L253 868L284 799L345 720L357 656L369 596Z";
export const NEPAL_PATH = "M501 768L525 720L590 762L686 796L687 841L598 814Z";
const INDIA_LEN = 3600; // about the outline's length, for the draw-in dash

/** Where each regional name of the day sits (screen coordinates at k 1). */
export const MAP_PINS: Record<string, [number, number]> = {
  north: [430, 776], // भाई दूज (Delhi, Uttar Pradesh)
  maharashtra: [381, 1050], // भाऊबीज
  gujarat: [284, 959], // ભાઈ બીજ
  bengal: [682, 944], // ভাইফোঁটা
  nepal: [610, 790], // भाइटीका
};

export const IndiaMap: React.FC<{ f: number; k: number }> = ({ f, k }) => {
  const draw = ramp(k, 0, 0.7, "io");
  const land = ramp(k, 0.3, 1, "out");
  const pins = ramp(k, 0.85, 1, "out");
  return (
    <g>
      <defs>
        <linearGradient id="d5Land" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2A2350" />
          <stop offset="1" stopColor="#3A2A3E" />
        </linearGradient>
      </defs>
      <path d={NEPAL_PATH} fill="#2A2350" opacity={0.6 * land} stroke="#C9D6F0" strokeWidth={2.5} strokeDasharray="8 6" strokeOpacity={0.6 * land} />
      <path d={INDIA_PATH} fill="url(#d5Land)" opacity={land} />
      <path
        d={INDIA_PATH}
        fill="none"
        stroke="#FFD36B"
        strokeWidth={4}
        strokeLinejoin="round"
        strokeDasharray={INDIA_LEN}
        strokeDashoffset={INDIA_LEN * (1 - draw)}
        style={{ filter: "drop-shadow(0 0 10px rgba(255,201,77,0.6))" }}
      />
      {Object.values(MAP_PINS).map(([x, y], i) => (
        <g key={i} opacity={pins}>
          <circle cx={x} cy={y} r={22} fill="#FFC94D" opacity={0.25 * (0.8 + 0.2 * Math.sin(f / 6 + i))} />
          <circle cx={x} cy={y} r={7} fill="#FFE6A3" />
        </g>
      ))}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* 03: the welcome: tilak, aarti, a meal on a leaf                      */
/* ------------------------------------------------------------------ */

/* The close-up's colours: Yamraj's look (shared/deities.tsx YAMRAJ) and Yamuna's (shared/yamuna.tsx), her skin a
   touch lighter so the hand reads against his face. */
const YAM_C = { skin: "#3F5A5E", shade: "#2C4044", line: "#142224", hair: "#0B1416" };
const YMN_C = { skin: "#4A5C8A", shade: "#27345A", line: "#121C30" };
/** A point on the mukut brim's lower edge: a quadratic arc from x -340 to 440, highest at x 50. */
const brimAt = (t: number): [number, number] => [
  -340 * (1 - t) * (1 - t) + 100 * t * (1 - t) + 440 * t * t,
  -120 * (1 - t) * (1 - t) - 660 * t * (1 - t) - 120 * t * t,
];
const PEARLS = Array.from({ length: 13 }, (_, i) => brimAt(0.06 + (0.88 * i) / 12));
const [GJ1X, GJ1Y] = brimAt(0.24);
const [GJ2X, GJ2Y] = brimAt(0.76);
// her curled fingers: knuckles along the lower edge of the back of her hand
const KNUCKLES: [number, number][] = [[-5, 103], [-22, 121], [-45, 134], [-69, 140]];

/** A close-up of the welcome: Yamraj's forehead under his gold mukut (the brim with three jewels and a pearl edge,
    the crown rising out of frame), dark brows and closed eyes. Yamuna's dark hand in red-and-gold bangles and her
    royal-blue sari comes in from the lower left, and her thumb presses a red tilak with rice grains. k 0..1: the hand
    comes in and the tilak appears on contact. Origin at the centre; the face fills the frame at s 1.3 and its edges
    fall into a vignette. */
export const TilakClose: React.FC<{ f: number; k: number; s?: number }> = ({ f, k, s = 1 }) => {
  const press = ramp(k, 0.75, 1, "out");
  const dx = -90 * (1 - k);
  const dy = 100 * (1 - k);
  return (
    <g transform={`scale(${s})`}>
      <defs>
        <linearGradient id="d5tcGold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#A86E1E" />
          <stop offset="0.45" stopColor="#F6D27A" />
          <stop offset="1" stopColor="#9A6418" />
        </linearGradient>
        <radialGradient id="d5tcVig" cx={50} cy={60} r={720} gradientUnits="userSpaceOnUse">
          <stop offset="0.5" stopColor="#0C0A07" stopOpacity={0} />
          <stop offset="1" stopColor="#0C0A07" stopOpacity={0.9} />
        </radialGradient>
      </defs>
      {/* hair at the temples, behind the face (mostly out of frame), then the face: teal skin, a warm lamp light
          from the lower left, the far side in shade */}
      <path d="M-250 -200C-380 -80 -380 140 -330 340L-480 360C-500 140 -470 -80 -370 -210Z" fill={YAM_C.hair} />
      <path d="M350 -200C480 -80 480 140 430 340L580 360C600 140 570 -80 470 -210Z" fill={YAM_C.hair} />
      <ellipse cx={50} cy={140} rx={400} ry={470} fill={YAM_C.skin} />
      <ellipse cx={350} cy={160} rx={170} ry={420} fill={YAM_C.shade} opacity={0.6} />
      <ellipse cx={-60} cy={60} rx={280} ry={230} fill="#E8A55A" opacity={0.14} />
      <ellipse cx={20} cy={-70} rx={190} ry={90} fill="#6A8A8E" opacity={0.3} />
      {/* brows, closed eyes and the bridge of the nose */}
      <path d="M-170 112C-120 72 -40 68 0 90M100 90C140 68 220 72 270 112" stroke={YAM_C.line} strokeWidth={16} strokeLinecap="round" fill="none" />
      <path d="M-160 178C-115 204 -45 204 -10 178M110 178C145 204 215 204 260 178" stroke={YAM_C.line} strokeWidth={9} strokeLinecap="round" fill="none" />
      <path d="M88 212C84 282 82 342 96 412" stroke={YAM_C.shade} strokeWidth={14} strokeLinecap="round" fill="none" opacity={0.5} />
      {/* the mukut: the crown body rising out of frame, its highlights, then the brim on top */}
      <path d="M-300 -190L-180 -980L280 -980L400 -190Z" fill="url(#d5tcGold)" />
      {[-130, -40, 140, 230].map((x) => (
        <path key={x} d={`M${x} -290L${50 + (x - 50) * 0.65} -980`} stroke="#FFE7A6" strokeWidth={6} opacity={0.3} />
      ))}
      <path d="M-340 -120Q50 -330 440 -120L440 -200Q50 -410 -340 -200Z" fill="url(#d5tcGold)" stroke="#7A4A12" strokeWidth={5} />
      {PEARLS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y - 12} r={6} fill="#FFF3D6" opacity={0.85} />
      ))}
      <circle cx={50} cy={-265} r={30} fill="#E8B84A" stroke="#7A4A12" strokeWidth={4} />
      <circle cx={50} cy={-265} r={20} fill="#C8102E" />
      <circle cx={44} cy={-271} r={6} fill="#FFD0D0" opacity={0.7} />
      {[[GJ1X, GJ1Y], [GJ2X, GJ2Y]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y - 40} r={18} fill="#E8B84A" stroke="#7A4A12" strokeWidth={3} />
          <circle cx={x} cy={y - 40} r={11} fill="#1F8A5A" />
        </g>
      ))}
      {/* the tilak, on contact */}
      <g opacity={press}>
        <path d="M50 -40V40" stroke="#C8102E" strokeWidth={18} strokeLinecap="round" />
        {[[30, -18], [64, -6], [42, 12], [58, 28], [36, 34]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx={4} ry={2.2} fill="#FFF6E4" transform={`rotate(${i * 37} ${x} ${y})`} />
        ))}
      </g>
      {/* Yamuna's hand: a soft shadow, her forearm with a warm rim, the royal-blue sari with a silver border, the
          bangles, the back of the hand with curled fingers, and the thumb with kumkum on its tip */}
      <g transform={`translate(${dx} ${dy})`}>
        <ellipse cx={-20} cy={120} rx={150} ry={64} fill="#000000" opacity={0.18} transform="rotate(-40 -20 120)" />
        <path d="M-110 120L-320 340" stroke={YMN_C.skin} strokeWidth={92} strokeLinecap="round" />
        <path d="M-110 120L-320 340" stroke={YMN_C.shade} strokeWidth={92} strokeLinecap="round" opacity={0.3} />
        <path d="M-128 96L-336 314" stroke="#FFB867" strokeWidth={6} strokeLinecap="round" opacity={0.35} />
        <path d="M-280 300L-420 446" stroke="#1E3A8A" strokeWidth={130} />
        <path d="M-322 252L-232 336" stroke="#D8E0F0" strokeWidth={10} strokeLinecap="round" />
        {[0, 1, 2].map((i) => (
          <ellipse key={i} cx={-160 - 22 * i} cy={172 + 22 * i} rx={52} ry={16} fill="none" stroke={i === 1 ? "#E8B84A" : "#C8302E"} strokeWidth={8} transform={`rotate(45 ${-160 - 22 * i} ${172 + 22 * i})`} />
        ))}
        <ellipse cx={-62} cy={78} rx={74} ry={58} fill={YMN_C.skin} transform="rotate(-30 -62 78)" />
        {KNUCKLES.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={20} fill={YMN_C.skin} stroke={YMN_C.line} strokeWidth={2} strokeOpacity={0.4} />
        ))}
        <path d="M-34 36C-10 14 12 4 34 0" stroke={YMN_C.skin} strokeWidth={26} strokeLinecap="round" fill="none" />
        <path d="M-30 26C-8 4 12 -6 32 -10" stroke="#FFB867" strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.4} />
        <ellipse cx={24} cy={2} rx={8} ry={5} fill="#8A9AC8" opacity={0.55} transform="rotate(-15 24 2)" />
        <circle cx={36} cy={0} r={6} fill="#C8102E" opacity={0.5 + 0.5 * press} />
      </g>
      <circle cx={50} cy={0} r={90} fill="#FFD36B" opacity={0.12 * press * (0.8 + 0.2 * Math.sin(f / 5))} />
      <rect x={-520} y={-780} width={1140} height={1700} fill="url(#d5tcVig)" />
    </g>
  );
};

/** The aarti thali: brass, a lit diya at the centre, kumkum, rice and marigolds. It circles on a small orbit (spin in
    degrees), with a faint trail of light. Origin at the orbit's centre; about 480 px wide at s 1. */
export const AartiThali: React.FC<{ f: number; spin: number; s?: number }> = ({ f, spin, s = 1 }) => {
  const a = (spin * Math.PI) / 180;
  const x = 70 * Math.cos(a);
  const y = 34 * Math.sin(a);
  return (
    <g transform={`scale(${s})`}>
      <ellipse cx={0} cy={0} rx={70} ry={34} fill="none" stroke="#FFD36B" strokeWidth={6} opacity={0.18} />
      <g transform={`translate(${x} ${y})`}>
        <ellipse cx={0} cy={10} rx={220} ry={62} fill="url(#d5Brass)" />
        <ellipse cx={0} cy={10} rx={220} ry={62} fill="none" stroke="#FFE6A3" strokeWidth={4} opacity={0.75} />
        <circle cx={-120} cy={8} r={26} fill="#C8102E" />
        <ellipse cx={120} cy={10} rx={36} ry={16} fill="#FFF6E4" />
        {[[-70, 30], [70, 32], [-150, 30], [160, 26], [0, 44]].map(([fx, fy], i) => (
          <circle key={i} cx={fx} cy={fy} r={12} fill="#F2A23A" stroke="#E8792B" strokeWidth={3} />
        ))}
        <g transform="translate(0 -2)">
          <Diya f={f} lit={1} seed="d5aarti" scale={0.45} glow={1} />
        </g>
      </g>
      <defs>
        <linearGradient id="d5Brass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8A5A12" />
          <stop offset="0.5" stopColor="#E8B84A" />
          <stop offset="1" stopColor="#8A5A12" />
        </linearGradient>
      </defs>
    </g>
  );
};

/** A meal on a banana leaf: rice, dal, sabzi, a puri and a laddoo. Origin at the centre; about 620 px wide at s 1. */
export const LeafPlate: React.FC<{ f: number; s?: number }> = ({ f, s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-310 20C-220 -110 160 -140 310 -30C220 100 -160 130 -310 20Z" fill="#3E8E2E" />
    <path d="M-300 18C-120 -10 120 -30 300 -28" stroke="#2C6A20" strokeWidth={5} fill="none" />
    <path d="M-240 -2C-140 -60 120 -70 260 -30" stroke="#5AAE40" strokeWidth={2} fill="none" opacity={0.6} />
    <ellipse cx={-40} cy={0} rx={90} ry={44} fill="#FFF6E4" />
    <ellipse cx={-50} cy={-14} rx={50} ry={20} fill="#FFFFFF" opacity={0.6} />
    <ellipse cx={110} cy={-24} rx={52} ry={26} fill="#E8B030" />
    <ellipse cx={110} cy={-28} rx={34} ry={14} fill="#F6CC50" opacity={0.7 + 0.2 * Math.sin(f / 9)} />
    <ellipse cx={130} cy={36} rx={48} ry={24} fill="#6A7A2A" />
    <ellipse cx={-200} cy={10} rx={50} ry={22} fill="#D9A050" stroke="#A8702A" strokeWidth={3} />
    <circle cx={30} cy={56} r={24} fill="#F2A23A" />
    <circle cx={22} cy={48} r={8} fill="#FFD27A" opacity={0.8} />
  </g>
);
