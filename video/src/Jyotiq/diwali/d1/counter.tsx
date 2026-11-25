import React from "react";
import { sparkle } from "../../katha/style";
import { H, P, ramp, rnd, W, wob } from "../../manthan/style";

/* Diwali Day 1 hook frame: a jeweller's counter on Dhanteras evening, lit from frame 0 (never black).
   Marigold garlands and string lights across the top, a soft-focus wall of jewellery shelves behind,
   a red velvet tray with gold and silver coin stacks, a silver spoon and a brass kalash, and a bangled hand
   reaching from the right for the front coin. The coin's glint grows into a bloom that hands over to the
   Manthan sea. Layout keeps the middle third (y 640-1280) calm for the hook plate; the subject sits at
   y 1300-1560, clear of the bottom 250 px. Put <CounterDefs /> once in the svg.
   push 0..1: slow camera push toward the coin. reach 0..1: the hand slides in. glint 0..1: the bloom. */

export const COIN_AT: [number, number] = [566, 1452];

export const CounterDefs: React.FC = () => (
  <defs>
    <linearGradient id="c1Wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#3B1712" />
      <stop offset="0.5" stopColor="#5A2818" />
      <stop offset="1" stopColor="#2E120C" />
    </linearGradient>
    <radialGradient id="c1Bokeh">
      <stop offset="0" stopColor="#FFE3A0" stopOpacity="0.95" />
      <stop offset="0.6" stopColor="#FFB040" stopOpacity="0.45" />
      <stop offset="1" stopColor="#FF8A2A" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="c1BokehRose">
      <stop offset="0" stopColor="#FFD0C0" stopOpacity="0.9" />
      <stop offset="0.6" stopColor="#F07A6A" stopOpacity="0.35" />
      <stop offset="1" stopColor="#E05088" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="c1Bulb">
      <stop offset="0" stopColor="#FFFBE6" />
      <stop offset="0.35" stopColor="#FFD27A" stopOpacity="0.9" />
      <stop offset="1" stopColor="#FF9A2E" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="c1Velvet" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#5A0C16" />
      <stop offset="0.5" stopColor="#8E1A24" />
      <stop offset="1" stopColor="#4A0810" />
    </linearGradient>
    <radialGradient id="c1VelvetLight" cx="0.5" cy="0.45" r="0.6">
      <stop offset="0" stopColor="#FF9A5A" stopOpacity="0.35" />
      <stop offset="1" stopColor="#FF9A5A" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="c1Gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#FFF0B8" />
      <stop offset="0.35" stopColor="#F2C25A" />
      <stop offset="0.75" stopColor="#C8892A" />
      <stop offset="1" stopColor="#8A5A12" />
    </linearGradient>
    <linearGradient id="c1Silver" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#FFFFFF" />
      <stop offset="0.4" stopColor="#D6DCE4" />
      <stop offset="1" stopColor="#7E8794" />
    </linearGradient>
    <linearGradient id="c1Brass" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#6B410F" />
      <stop offset="0.3" stopColor="#D9A23C" />
      <stop offset="0.42" stopColor="#FFE6A3" />
      <stop offset="0.6" stopColor="#C8892A" />
      <stop offset="1" stopColor="#5A3408" />
    </linearGradient>
    <linearGradient id="c1Leaf" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#1F5A1E" />
      <stop offset="1" stopColor="#7DBA3E" />
    </linearGradient>
    <linearGradient id="c1Glass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#3A1A12" />
      <stop offset="1" stopColor="#1E0C08" />
    </linearGradient>
    <linearGradient id="c1Skin" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#D9A074" />
      <stop offset="1" stopColor="#A86C44" />
    </linearGradient>
    <radialGradient id="c1Bloom">
      <stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
      <stop offset="0.25" stopColor="#FFF1C4" stopOpacity="0.9" />
      <stop offset="0.6" stopColor="#FFC94D" stopOpacity="0.45" />
      <stop offset="1" stopColor="#FF8A2A" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="c1Vignette" cx="0.5" cy="0.55" r="0.75">
      <stop offset="0.55" stopColor="#000000" stopOpacity="0" />
      <stop offset="1" stopColor="#000000" stopOpacity="0.55" />
    </radialGradient>
    <filter id="c1Dof" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="7" />
    </filter>
  </defs>
);

/** A coin lying on the tray, seen from a high angle (an ellipse with its edge below). */
export const Coin: React.FC<{ x: number; y: number; s?: number; silver?: boolean }> = ({ x, y, s = 1, silver = false }) => {
  const face = silver ? "url(#c1Silver)" : "url(#c1Gold)";
  const edge = silver ? "#6E7682" : "#7A4A10";
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={6} rx={36} ry={13} fill={edge} />
      <ellipse cx={0} cy={0} rx={36} ry={13} fill={face} />
      <ellipse cx={0} cy={0} rx={27} ry={9.5} fill="none" stroke={silver ? "#9AA3AE" : "#B07A22"} strokeWidth={2} />
      {/* a small embossed lotus mark */}
      <path d="M0 -5C-4 -2 -4 2 0 4C4 2 4 -2 0 -5Z M-8 1C-6 4 -3 4 0 4C-2 1 -5 0 -8 1Z M8 1C6 4 3 4 0 4C2 1 5 0 8 1Z" fill={silver ? "#8A93A0" : "#A86E1C"} />
      <path d="M-30 -3C-18 -11 16 -12 30 -4" stroke="#FFFFFF" strokeWidth={2} fill="none" opacity={0.55} />
    </g>
  );
};

export const Stack: React.FC<{ x: number; y: number; n: number; s?: number; silver?: boolean }> = ({ x, y, n, s = 1, silver }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => (
      <Coin key={i} x={x + (rnd(`st${x}${i}`) - 0.5) * 3 * s} y={y - i * 7 * s} s={s} silver={silver} />
    ))}
  </g>
);

/** Brass kalash with mango leaves and a mauli thread, base at (0,0). */
export const Kalash: React.FC<{ f: number; s?: number; shine?: number }> = ({ f, s = 1, shine = 0 }) => {
  const sway = wob("kl", f / 40) * 2;
  return (
    <g transform={`scale(${s})`}>
      <ellipse cx={0} cy={4} rx={58} ry={11} fill="#3A2206" opacity={0.7} />
      {/* mango leaves fanned round the mouth, the outer ones drooping */}
      {[-78, -52, -26, 0, 26, 52, 78].map((a, i) => (
        <g key={a} transform={`translate(0,-256) rotate(${a + sway * (i % 2 ? 1 : -1)})`}>
          <path d="M0 0C-26 -24 -26 -80 -2 -124C2 -126 4 -124 6 -118C26 -78 24 -24 0 0Z" fill="url(#c1Leaf)" stroke="#173F14" strokeWidth={2.2} />
          <path d="M0 -4C1 -40 2 -80 3 -116" stroke="#CFEAA8" strokeWidth={1.8} opacity={0.65} fill="none" />
          <path d="M-14 -40C-8 -56 -2 -70 4 -86" stroke="#E6F5C8" strokeWidth={3} opacity={0.25} fill="none" />
        </g>
      ))}
      {/* body */}
      <path
        d="M-30 -226C-44 -210 -98 -188 -104 -120C-110 -50 -64 -4 0 -2C64 -4 110 -50 104 -120C98 -188 44 -210 30 -226Z"
        fill="url(#c1Brass)"
        stroke="#4A2C06"
        strokeWidth={3}
      />
      <path d="M-34 -228L34 -228L40 -250L-40 -250Z" fill="url(#c1Brass)" stroke="#4A2C06" strokeWidth={3} />
      <ellipse cx={0} cy={-254} rx={52} ry={12} fill="url(#c1Brass)" stroke="#4A2C06" strokeWidth={3} />
      {/* mauli thread round the neck */}
      <path d="M-36 -232C-12 -224 12 -224 36 -232" stroke="#C81E28" strokeWidth={6} fill="none" />
      <path d="M-35 -238C-12 -230 12 -230 35 -238" stroke={P.flame} strokeWidth={3} fill="none" />
      {/* engraved band and kumkum dots */}
      <path d="M-98 -132C-40 -112 40 -112 98 -132" stroke="#7A4E12" strokeWidth={3} fill="none" opacity={0.8} />
      <path d="M-100 -116C-40 -96 40 -96 100 -116" stroke="#FFE6A3" strokeWidth={2} fill="none" opacity={0.5} />
      {[-22, 0, 22].map((x) => (
        <circle key={x} cx={x} cy={-160} r={6} fill="#C81E28" />
      ))}
      {/* specular: a hot streak that brightens with `shine` */}
      <path d="M-58 -186C-78 -150 -80 -96 -56 -54" stroke="#FFF6D8" strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.45 + 0.4 * shine} />
      <path d="M70 -170C84 -130 82 -86 64 -52" stroke="#FFD27A" strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.5} />
    </g>
  );
};

/** A festive hand with red and gold bangles reaching left; wrist at (0,0), fingertips near (-150, -6). */
const ReachHand: React.FC<{ f: number }> = ({ f }) => {
  const curl = 0.5 + 0.5 * wob("hand", f / 18);
  return (
    <g>
      {/* sleeve: maroon kurta with a gold border */}
      <path d="M150 -44L560 -10L560 150L150 54Z" fill="#6A1420" />
      <path d="M150 -44L150 54" stroke="url(#c1Gold)" strokeWidth={14} />
      <path d="M170 -40L560 -6" stroke="#8E2430" strokeWidth={6} opacity={0.6} />
      {/* forearm */}
      <path d="M-6 -34C40 -40 100 -42 156 -40L156 50C100 50 40 44 -6 34Z" fill="url(#c1Skin)" stroke="#5A321A" strokeWidth={3} />
      {/* bangles */}
      {[16, 34, 50, 66, 82].map((x, i) => (
        <ellipse key={x} cx={x} cy={2} rx={8} ry={40} fill="none" stroke={i % 2 ? "url(#c1Gold)" : "#C81E28"} strokeWidth={i % 2 ? 7 : 9} />
      ))}
      {/* back of the hand */}
      <path d="M2 -32C-30 -40 -74 -38 -104 -26L-110 20C-80 32 -36 36 2 30Z" fill="url(#c1Skin)" stroke="#5A321A" strokeWidth={3} />
      {/* fingers, reaching and slightly curled down toward the coin */}
      {[
        [-104, -22, 62, 8],
        [-108, -8, 66, 14],
        [-109, 6, 60, 20],
        [-106, 18, 48, 26],
      ].map(([x, y, len, ang], i) => (
        <g key={i} transform={`translate(${x},${y}) rotate(${180 + ang + curl * 6})`}>
          <path
            d={`M0 -8.5L${len - 9} -6.5Q${len} -6.5 ${len} 0Q${len} 6.5 ${len - 9} 6.5L0 8.5Z`}
            fill="url(#c1Skin)"
            stroke="#5A321A"
            strokeWidth={3}
            strokeLinejoin="round"
          />
          <path d={`M${len * 0.42} -6.5L${len * 0.42} 6.5`} stroke="#8A5232" strokeWidth={1.5} opacity={0.5} />
          <ellipse cx={len - 7} cy={-1} rx={5.5} ry={4} fill="#F4D2BC" opacity={0.85} />
        </g>
      ))}
      {/* thumb tucked under, tapered like the fingers */}
      <g transform="translate(-34,22) rotate(162)">
        <path d="M0 -10L50 -7Q60 -7 60 0Q60 7 50 7L0 10Z" fill="url(#c1Skin)" stroke="#5A321A" strokeWidth={3} strokeLinejoin="round" />
        <ellipse cx={53} cy={-1} rx={5.5} ry={4} fill="#F4D2BC" opacity={0.85} />
      </g>
      {/* rim light from the counter's glow */}
      <path d="M-104 -26C-74 -38 -30 -40 2 -32C40 -40 100 -42 156 -40" stroke="#FFD9A0" strokeWidth={3} fill="none" opacity={0.7} />
    </g>
  );
};

/** Marigold garland swag from (x1,y1) to (x2,y2) sagging by `sag` px. */
export const Garland: React.FC<{ x1: number; y1: number; x2: number; y2: number; sag: number; seed: string }> = ({ x1, y1, x2, y2, sag, seed }) => {
  const n = Math.round(Math.hypot(x2 - x1, y2 - y1) / 26);
  return (
    <g>
      {Array.from({ length: n + 1 }).map((_, i) => {
        const t = i / n;
        const x = x1 + (x2 - x1) * t;
        const y = y1 + (y2 - y1) * t + sag * 4 * t * (1 - t);
        const r = 15 + rnd(`${seed}r${i}`) * 4;
        const c = rnd(`${seed}c${i}`) > 0.35 ? "#F28C12" : "#FFB824";
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={r} fill={c} />
            <circle cx={x - 3} cy={y - 3} r={r * 0.6} fill={c === "#F28C12" ? "#FFA62E" : "#FFD25A"} />
            <circle cx={x} cy={y} r={r * 0.22} fill="#9A4A06" />
          </g>
        );
      })}
    </g>
  );
};

/** A strand of fairy lights along a sagging curve; bulbs twinkle with their own seeds. */
export const Strand: React.FC<{ f: number; y1: number; y2: number; sag: number; seed: string }> = ({ f, y1, y2, sag, seed }) => {
  const pts = Array.from({ length: 21 }).map((_, i) => {
    const t = i / 20;
    return [-30 + 1140 * t, y1 + (y2 - y1) * t + sag * 4 * t * (1 - t)] as const;
  });
  return (
    <g>
      <path d={`M${pts.map(([x, y]) => `${x} ${y}`).join(" L")}`} stroke="#2A1A0A" strokeWidth={2} fill="none" opacity={0.8} />
      {pts.map(([x, y], i) => {
        const tw = 0.65 + 0.35 * (0.5 + 0.5 * wob(`${seed}${i}`, f / 9));
        return <circle key={i} cx={x} cy={y + 6} r={18} fill="url(#c1Bulb)" opacity={tw} />;
      })}
    </g>
  );
};

export const JewellerCounter: React.FC<{ f: number; push?: number; reach?: number; glint?: number }> = ({ f, push = 0, reach = 1, glint = 0 }) => {
  const [cx, cy] = COIN_AT;
  const zoom = 1.15 + 0.25 * push;
  const bgZoom = 1.05 + 0.08 * push;
  const handX = (1 - ramp(reach, 0, 1, "out")) * 520;
  const g = Math.max(0, Math.min(1, glint));
  return (
    <g>
      {/* wall and shelves, soft focus */}
      <g transform={`translate(${cx},${cy}) scale(${bgZoom}) translate(${-cx},${-cy})`}>
        <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#c1Wall)" />
        <g filter="url(#c1Dof)">
          {[430, 660, 890].map((y, si) => (
            <g key={y}>
              <rect x={-40} y={y} width={W + 80} height={26} fill="#3A1A0C" />
              <rect x={-40} y={y} width={W + 80} height={6} fill="#C8892A" opacity={0.8} />
              {Array.from({ length: 7 }).map((_, i) => {
                const x = 80 + i * 150 + (si % 2) * 60;
                const kind = (i + si) % 3;
                return kind === 0 ? (
                  <path key={i} d={`M${x - 50} ${y - 90}C${x - 40} ${y - 10} ${x + 40} ${y - 10} ${x + 50} ${y - 90}`} stroke="#F2C25A" strokeWidth={10} strokeDasharray="2 12" strokeLinecap="round" fill="none" />
                ) : kind === 1 ? (
                  <ellipse key={i} cx={x} cy={y - 40} rx={44} ry={30} fill="none" stroke="#E8B24A" strokeWidth={9} />
                ) : (
                  <circle key={i} cx={x} cy={y - 34} r={26} fill="#E8B24A" opacity={0.85} />
                );
              })}
            </g>
          ))}
        </g>
        {/* bokeh: string lights out of focus */}
        {Array.from({ length: 28 }).map((_, i) => {
          const x = rnd(`bk${i}x`) * W;
          const y = 260 + rnd(`bk${i}y`) * 900;
          const r = 22 + rnd(`bk${i}r`) * 54;
          const tw = 0.45 + 0.4 * (0.5 + 0.5 * wob(`bk${i}`, f / 14));
          return <circle key={i} cx={x} cy={y} r={r} fill={i % 5 === 0 ? "url(#c1BokehRose)" : "url(#c1Bokeh)"} opacity={tw} />;
        })}
        <Strand f={f} y1={140} y2={190} sag={120} seed="sa" />
        <Strand f={f} y1={300} y2={250} sag={90} seed="sb" />
        <Garland x1={-20} y1={30} x2={560} y2={40} sag={150} seed="ga" />
        <Garland x1={520} y1={40} x2={1100} y2={20} sag={150} seed="gb" />
      </g>
      {/* the counter, sharp */}
      <g transform={`translate(${cx},${cy}) scale(${zoom}) translate(${-cx},${-cy})`}>
        {/* glass case front */}
        <rect x={-60} y={1580} width={W + 120} height={420} fill="url(#c1Glass)" />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${120 + i * 260} 1600L${40 + i * 260} 1940`} stroke="#FFFFFF" strokeWidth={18} opacity={0.05} />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <circle key={i} cx={rnd(`rf${i}`) * W} cy={1650 + rnd(`rg${i}`) * 220} r={10 + rnd(`rh${i}`) * 16} fill="url(#c1Bokeh)" opacity={0.25} />
        ))}
        <g filter="url(#c1Dof)" opacity={0.7}>
          {[130, 400, 670, 940].map((x, i) => (
            <path key={x} d={`M${x - 90} 1640C${x - 70} ${1760 + (i % 2) * 30} ${x + 70} ${1760 + (i % 2) * 30} ${x + 90} 1640`} stroke="#F2C25A" strokeWidth={12} strokeDasharray="3 14" strokeLinecap="round" fill="none" />
          ))}
          {[265, 535, 805].map((x) => (
            <ellipse key={x} cx={x} cy={1720} rx={46} ry={20} fill="none" stroke="#E8B24A" strokeWidth={10} />
          ))}
        </g>
        {/* velvet tray */}
        <path d="M70 1236L1010 1236L1076 1586L4 1586Z" fill="url(#c1Velvet)" />
        <path d="M70 1236L1010 1236L1076 1586L4 1586Z" fill="url(#c1VelvetLight)" />
        <path d="M70 1236L1010 1236" stroke="#F2C25A" strokeWidth={5} />
        <path d="M4 1586L1076 1586" stroke="url(#c1Gold)" strokeWidth={12} />
        {/* back row: kalash, stacks, spoon */}
        <g transform="translate(220,1452)">
          <Kalash f={f} s={0.95} shine={g} />
        </g>
        <Stack x={430} y={1330} n={6} s={0.95} />
        <Stack x={612} y={1300} n={4} s={0.9} />
        <Stack x={776} y={1336} n={7} s={0.95} />
        <Stack x={914} y={1300} n={4} s={0.85} silver />
        <g transform="translate(330,1556) rotate(6)">
          <ellipse cx={-56} cy={0} rx={30} ry={13} fill="url(#c1Silver)" stroke="#6E7682" strokeWidth={2} />
          <rect x={-28} y={-5} width={110} height={10} rx={5} fill="url(#c1Silver)" stroke="#6E7682" strokeWidth={2} />
        </g>
        {/* front coins */}
        <Coin x={410} y={1500} s={1.05} silver />
        <Coin x={486} y={1530} s={1.05} />
        <Coin x={cx} y={cy} s={1.12} />
        <Coin x={690} y={1520} s={1.05} />
        {/* twinkles on the gold */}
        {[
          [430, 1292],
          [612, 1276],
          [776, 1290],
          [520, 1524],
          [700, 1510],
          [190, 1330],
        ].map(([x, y], i) => {
          const tw = Math.max(0, wob(`tw${i}`, f / 7));
          return <path key={i} d={sparkle(10 + 8 * tw)} transform={`translate(${x},${y})`} fill="#FFF8E0" opacity={tw} />;
        })}
        {/* the hand */}
        <g transform={`translate(${728 + handX},${1474 + handX * 0.12}) rotate(-8)`}>
          <ReachHand f={f} />
        </g>
      </g>
      <rect x={0} y={0} width={W} height={H} fill="url(#c1Vignette)" />
      {/* the glint on the front coin, growing into a bloom */}
      <g transform={`translate(${cx + 14},${cy - 6})`}>
        <circle cx={0} cy={0} r={40 + 1500 * g * g} fill="url(#c1Bloom)" opacity={Math.min(1, 0.35 + g * 1.2)} />
        <path d={sparkle(26 + 260 * g)} transform={`rotate(${12 + 30 * g})`} fill="#FFFDF2" opacity={0.85} />
        <path d={sparkle(14 + 150 * g)} transform={`rotate(${57 + 30 * g})`} fill="#FFFFFF" opacity={0.6} />
      </g>
      {/* the bloom completes into a warm whiteout that the Manthan sea fades in from */}
      <rect x={0} y={0} width={W} height={H} fill="#FFF4D6" opacity={Math.pow(g, 3) * 0.9} />
    </g>
  );
};
