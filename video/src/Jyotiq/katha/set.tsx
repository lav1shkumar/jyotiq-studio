import React from "react";
import { C, rnd, wob } from "./style";

/* The painted set: sky, palace facade, courtyard and the seated court. */

/** Shared SVG defs. Mount once inside the world <svg>. */
export const SetDefs: React.FC = () => (
  <defs>
    <linearGradient id="kSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={C.sky} />
      <stop offset="1" stopColor={C.skyLow} />
    </linearGradient>
    <radialGradient id="kFlameGlow">
      <stop offset="0" stopColor="#FFE38A" stopOpacity="0.85" />
      <stop offset="1" stopColor="#FFB23C" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="kAura">
      <stop offset="0" stopColor="#FFF4C8" stopOpacity="0.95" />
      <stop offset="0.45" stopColor="#F6C75A" stopOpacity="0.45" />
      <stop offset="1" stopColor="#F6C75A" stopOpacity="0" />
    </radialGradient>
    {/* maroon panel with cream dots (upper windows) */}
    <pattern id="kDots" width="13" height="13" patternUnits="userSpaceOnUse">
      <rect width="13" height="13" fill={C.maroon} />
      <circle cx="6.5" cy="6.5" r="2.3" fill="#F1DFC0" />
    </pattern>
    {/* jaali lattice (doors, side arches) */}
    <pattern id="kJaali" width="17" height="17" patternUnits="userSpaceOnUse">
      <rect width="17" height="17" fill={C.maroon} />
      <path d="M0 0.8H17M0.8 0V17" stroke="#E9D3AE" strokeWidth="2.2" />
      <circle cx="9" cy="9" r="1.6" fill="#E9D3AE" opacity="0.7" />
    </pattern>
    {/* gold buti on the Raja's jama */}
    <pattern id="kButi" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="6" cy="6" r="2.4" fill="#E9B851" />
      <circle cx="19" cy="19" r="2.4" fill="#E9B851" />
      <circle cx="19" cy="19" r="0.9" fill="#FBE7B0" />
    </pattern>
    {/* bandhani dots on the turban */}
    <pattern id="kBandhani" width="11" height="11" patternUnits="userSpaceOnUse">
      <circle cx="3" cy="3" r="1.7" fill="#FFE6A6" />
      <circle cx="8.5" cy="8.5" r="1.7" fill="#FFE6A6" />
    </pattern>
    {/* block-print flowers on Meera's kurti */}
    <pattern id="kPrint" width="22" height="22" patternUnits="userSpaceOnUse">
      <circle cx="6" cy="6" r="2.6" fill="#FBEFD0" />
      <circle cx="6" cy="6" r="1" fill="#8E2420" />
      <circle cx="17" cy="17" r="2.6" fill="#FBEFD0" />
      <circle cx="17" cy="17" r="1" fill="#8E2420" />
    </pattern>
    {/* night tint for the palace time-lapse */}
    <linearGradient id="kSkyNight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#0F0B30" />
      <stop offset="0.6" stopColor="#2A1E5C" />
      <stop offset="1" stopColor="#5B3A78" />
    </linearGradient>
    {/* paper cut-out shadows */}
    <filter id="kCutShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="5" dy="7" stdDeviation="3.5" floodColor="#3A1607" floodOpacity="0.28" />
    </filter>
    <filter id="kPartShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="2.5" dy="3.5" stdDeviation="2" floodColor="#3A1607" floodOpacity="0.3" />
    </filter>
  </defs>
);

/* ------------------------------------------------------------------ */
/* Shapes                                                              */
/* ------------------------------------------------------------------ */

/** Pointed Mughal-Rajput arch in the box x,y,w,h (k = rise / width). */
export const arch = (x: number, y: number, w: number, h: number, k = 0.6): string => {
  const a = w * k;
  return `M${x} ${y + h}V${y + a}C${x} ${y + a * 0.4} ${x + w * 0.34} ${y + a * 0.12} ${x + w / 2} ${y}C${x + w * 0.66} ${y + a * 0.12} ${x + w} ${y + a * 0.4} ${x + w} ${y + a}V${y + h}Z`;
};

/** Bulbous dome with a pointed tip; base centred at cx,by, half-width b. */
const domePath = (cx: number, by: number, b: number, bulge: number, h: number): string =>
  `M${cx - b} ${by}C${cx - b - bulge} ${by - h * 0.38} ${cx - b * 0.2} ${by - h * 0.8} ${cx} ${by - h}C${cx + b * 0.2} ${by - h * 0.8} ${cx + b + bulge} ${by - h * 0.38} ${cx + b} ${by}Z`;

const Dome: React.FC<{ id: string; cx: number; by: number; b: number; bulge: number; h: number; ribs: number }> = ({
  id,
  cx,
  by,
  b,
  bulge,
  h,
  ribs,
}) => {
  const d = domePath(cx, by, b, bulge, h);
  const n = Math.floor(ribs / 2);
  const petals = Math.max(6, Math.round((2 * b) / 22));
  const step = (2 * b) / petals;
  return (
    <g>
      <clipPath id={id}>
        <path d={d} />
      </clipPath>
      <path d={d} fill={C.cream} />
      <g clipPath={`url(#${id})`}>
        {/* shaded right flank */}
        <path d={`M${cx + b * 0.35} ${by}Q${cx + b * 0.5} ${by - h * 0.6} ${cx} ${by - h}L${cx + b * 2} ${by - h}L${cx + b * 2} ${by}Z`} fill={C.creamShade} opacity={0.45} />
        {new Array(2 * n + 1).fill(0).map((_, i) => {
          const k = i - n;
          return (
            <path
              key={k}
              d={`M${cx + (k * b) / (n + 0.6)} ${by}Q${cx + (k * (b + bulge)) / (n + 0.2)} ${by - h * 0.52} ${cx} ${by - h}`}
              fill="none"
              stroke={C.rib}
              strokeWidth={2.6}
            />
          );
        })}
      </g>
      <path d={d} fill="none" stroke={C.outline} strokeWidth={2.6} />
      {/* lotus-petal collar */}
      {new Array(petals).fill(0).map((_, i) => {
        const x0 = cx - b + i * step;
        return (
          <path
            key={i}
            d={`M${x0} ${by}A${step / 2} ${step / 2} 0 0 1 ${x0 + step} ${by}Z`}
            fill={C.cream}
            stroke={C.rib}
            strokeWidth={1.6}
          />
        );
      })}
      {/* kalash finial */}
      <circle cx={cx} cy={by - h - 7} r={b * 0.07 + 3} fill={C.gold} stroke={C.goldDark} strokeWidth={1.5} />
      <circle cx={cx} cy={by - h - 7 - b * 0.12 - 5} r={b * 0.05 + 2} fill={C.gold} stroke={C.goldDark} strokeWidth={1.5} />
      <path
        d={`M${cx - 3} ${by - h - b * 0.2 - 10}L${cx} ${by - h - b * 0.38 - 18}L${cx + 3} ${by - h - b * 0.2 - 10}Z`}
        fill={C.gold}
      />
    </g>
  );
};

const Chhatri: React.FC<{ id: string; cx: number }> = ({ id, cx }) => (
  <g>
    <rect x={cx - 60} y={344} width={120} height={16} fill={C.cream} stroke={C.outline} strokeWidth={1.5} />
    {[-48, -18, 18, 48].map((dx) => (
      <rect key={dx} x={cx + dx - 5} y={262} width={10} height={82} fill={C.cream} stroke={C.creamShade} strokeWidth={1.2} />
    ))}
    <path d={`M${cx - 74} 262L${cx + 74} 262L${cx + 62} 249L${cx - 62} 249Z`} fill={C.orange} stroke={C.wallLine} strokeWidth={1.5} />
    <rect x={cx - 60} y={237} width={120} height={12} fill={C.cream} stroke={C.outline} strokeWidth={1.2} />
    <Dome id={id} cx={cx} by={237} b={46} bulge={8} h={74} ribs={5} />
  </g>
);

const SunMedallion: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => (
  <g>
    {new Array(16).fill(0).map((_, i) => {
      const a = (i * Math.PI) / 8;
      const r1 = i % 2 === 0 ? 70 : 61;
      const da = 0.13;
      const p = (r: number, t: number) => `${cx + Math.sin(t) * r} ${cy - Math.cos(t) * r}`;
      return <path key={i} d={`M${p(46, a - da)}L${p(r1, a)}L${p(46, a + da)}Z`} fill={i % 2 === 0 ? "#E7A93A" : "#F2C14E"} stroke={C.goldDark} strokeWidth={1.2} />;
    })}
    <circle cx={cx} cy={cy} r={48} fill="#F2BE4A" stroke={C.goldDark} strokeWidth={3} />
    <circle cx={cx} cy={cy} r={40} fill="none" stroke="#E09A2E" strokeWidth={2} />
    {/* Surya's calm face */}
    <g fill="none" stroke="#9A5A16" strokeWidth={3} strokeLinecap="round">
      <path d={`M${cx - 20} ${cy - 8}Q${cx - 13} ${cy - 2} ${cx - 6} ${cy - 8}`} />
      <path d={`M${cx + 6} ${cy - 8}Q${cx + 13} ${cy - 2} ${cx + 20} ${cy - 8}`} />
      <path d={`M${cx} ${cy - 6}L${cx - 4} ${cy + 8}L${cx + 2} ${cy + 8}`} />
      <path d={`M${cx - 12} ${cy + 16}Q${cx} ${cy + 25} ${cx + 12} ${cy + 16}`} />
    </g>
    <circle cx={cx - 22} cy={cy + 8} r={6} fill="#E8823A" opacity={0.35} />
    <circle cx={cx + 22} cy={cy + 8} r={6} fill="#E8823A" opacity={0.35} />
  </g>
);

/* ------------------------------------------------------------------ */
/* Sky                                                                 */
/* ------------------------------------------------------------------ */

const Cloud: React.FC<{ x: number; y: number; w: number }> = ({ x, y, w }) => {
  const u = w / 200;
  return (
    <g transform={`translate(${x} ${y}) scale(${u})`}>
      <path
        d="M-100 0C-104 -24 -82 -38 -62 -30C-58 -58 -22 -66 -4 -44C8 -70 52 -66 58 -36C80 -44 104 -26 100 0Z"
        fill={C.cloud}
      />
      <path d="M-100 0C-80 -8 80 -8 100 0Z" fill={C.cloudShade} />
    </g>
  );
};

export const Sky: React.FC<{ f: number; night?: number; sun?: [number, number] | null; moon?: [number, number] | null }> = ({
  f,
  night = 0,
  sun = null,
  moon = null,
}) => {
  const drift = f * 0.22;
  return (
    <g>
      <rect x={-140} y={0} width={1360} height={960} fill="url(#kSky)" />
      {night > 0.001 ? <rect x={-140} y={0} width={1360} height={960} fill="url(#kSkyNight)" opacity={night} /> : null}
      {night > 0.05 ? <Stars f={f} n={70} y0={60} y1={620} opacity={night} /> : null}
      {sun ? <SunDisc x={sun[0]} y={sun[1]} /> : null}
      {moon ? <Crescent x={moon[0]} y={moon[1]} r={40} /> : null}
      <g opacity={1 - 0.6 * night}>
        <Cloud x={140 + drift} y={170} w={190} />
        <Cloud x={940 + drift * 0.8} y={300} w={170} />
        <Cloud x={120 + drift * 1.1} y={500} w={150} />
        <Cloud x={975 + drift} y={545} w={140} />
      </g>
    </g>
  );
};

export const Stars: React.FC<{ f: number; n: number; y0: number; y1: number; opacity: number }> = ({ f, n, y0, y1, opacity }) => (
  <g opacity={opacity}>
    {new Array(n).fill(0).map((_, i) => {
      const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(f / (4 + rnd(`st${i}`) * 7) + i * 1.9));
      const x = -100 + rnd(`sx${i}`) * 1280;
      const y = y0 + rnd(`sy${i}`) * (y1 - y0);
      const r = 1.2 + rnd(`sr${i}`) * 2.6;
      return i % 9 === 0 ? (
        <path key={i} d={`M${x} ${y - r * 2.4}L${x + r * 0.5} ${y}L${x} ${y + r * 2.4}L${x - r * 0.5} ${y}Z M${x - r * 2.4} ${y}L${x} ${y - r * 0.5}L${x + r * 2.4} ${y}L${x} ${y + r * 0.5}Z`} fill="#FFF3C8" opacity={tw} />
      ) : (
        <circle key={i} cx={x} cy={y} r={r} fill="#FFF3D6" opacity={tw} />
      );
    })}
  </g>
);

export const SunDisc: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={78} fill="#FFE7A0" opacity={0.35} />
    {new Array(12).fill(0).map((_, i) => (
      <path key={i} d="M-7 -50L0 -70L7 -50Z" transform={`rotate(${i * 30})`} fill="#F7C548" />
    ))}
    <circle r={46} fill="#F7C948" stroke="#E09A2E" strokeWidth={3} />
  </g>
);

export const Crescent: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r * 2} fill="#FFF3D0" opacity={0.12} />
    <path d={`M0 ${-r}A${r} ${r} 0 1 0 0 ${r}A${r * 0.74} ${r * 0.86} 0 1 1 0 ${-r}Z`} fill="#FBF0CF" transform="rotate(-25)" />
  </g>
);

/* ------------------------------------------------------------------ */
/* Palace facade                                                       */
/* ------------------------------------------------------------------ */

const Pillar: React.FC<{ x: number }> = ({ x }) => (
  <g>
    <rect x={x - 15} y={648} width={30} height={206} fill={C.cream} stroke={C.creamShade} strokeWidth={1.4} />
    <rect x={x - 15} y={648} width={8} height={206} fill={C.creamShade} opacity={0.5} />
    {new Array(8).fill(0).map((_, i) => (
      <circle key={i} cx={x + 1} cy={666 + i * 24} r={3.2} fill={C.red} />
    ))}
    <rect x={x - 30} y={626} width={60} height={8} fill={C.goldDark} />
    <path d={`M${x - 27} 633H${x + 27}L${x + 16} 650H${x - 16}Z`} fill={C.gold} stroke={C.goldDark} strokeWidth={1.4} />
    <rect x={x - 24} y={852} width={48} height={16} fill={C.gold} stroke={C.goldDark} strokeWidth={1.4} />
  </g>
);

/** Marigold toran: a swag of flowers with hanging strands that sway. */
const Toran: React.FC<{ f: number; x1: number; x2: number; y: number; sag: number; seed: string }> = ({ f, x1, x2, y, sag, seed }) => {
  const len = x2 - x1;
  const n = Math.round(len / 12);
  const at = (t: number): [number, number] => [x1 + len * t, y + 4 * sag * t * (1 - t)];
  return (
    <g>
      {[0, 0.25, 0.5, 0.75, 1].map((t, k) => {
        const [px, py] = at(t);
        const sw = wob(`${seed}-${k}`, f / 22) * 5;
        return (
          <g key={k} transform={`translate(${px} ${py}) rotate(${sw})`}>
            {[10, 22, 34].map((dy, j) => (
              <circle key={j} cy={dy} r={6.2} fill={j % 2 ? C.marigoldY : C.marigold} stroke="#C25E10" strokeWidth={1} />
            ))}
            <path d="M0 40C-7 46 -6 56 0 62C6 56 7 46 0 40Z" fill={C.leaf} />
          </g>
        );
      })}
      {new Array(n + 1).fill(0).map((_, i) => {
        const [px, py] = at(i / n);
        return (
          <g key={i}>
            {i % 3 === 1 ? <ellipse cx={px} cy={py + 9} rx={4} ry={7} fill={C.leaf} /> : null}
            <circle cx={px} cy={py} r={7.2} fill={i % 2 ? C.marigoldY : C.marigold} stroke="#C25E10" strokeWidth={1} />
            <circle cx={px} cy={py} r={2.2} fill="#B5480C" />
          </g>
        );
      })}
    </g>
  );
};

/** Clay diya with a flickering flame. */
export const Diya: React.FC<{ f: number; x: number; y: number; seed: string; s?: number }> = ({ f, x, y, seed, s = 1 }) => {
  const fl = wob(seed, f / 3.2);
  const fl2 = wob(`${seed}b`, f / 2.1);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cy={-14} r={30} fill="url(#kFlameGlow)" opacity={0.55 + 0.2 * fl} />
      <g transform={`translate(0 -7) scale(${1 + 0.06 * fl2} ${1 + 0.14 * fl}) skewX(${fl2 * 6})`}>
        <path d="M0 0C-6 -4 -7 -12 0 -22C7 -12 6 -4 0 0Z" fill="#FFC93C" />
        <path d="M0 -1C-3 -4 -3 -9 0 -14C3 -9 3 -4 0 -1Z" fill="#FF7A1A" />
      </g>
      <path d="M-16 -6Q0 12 16 -6Z" fill="#A84A1E" />
      <path d="M-17 -6H17" stroke="#D06A2E" strokeWidth={3} strokeLinecap="round" />
    </g>
  );
};

export const Palace: React.FC<{ f: number; night?: number }> = ({ f, night = 0 }) => (
  <g>
    {/* chhatris + main dome behind the upper block */}
    <Chhatri id="kChL" cx={282} />
    <Chhatri id="kChR" cx={798} />
    <rect x={386} y={318} width={308} height={44} fill={C.cream} stroke={C.outline} strokeWidth={1.5} />
    <path d="M386 330H694" stroke={C.rib} strokeWidth={2} />
    <Dome id="kDome" cx={540} by={318} b={150} bulge={30} h={246} ribs={7} />

    {/* upper block */}
    <rect x={250} y={360} width={580} height={262} fill={C.wallUp} />
    <rect x={806} y={360} width={24} height={262} fill={C.wallSide} />
    <rect x={240} y={356} width={600} height={22} fill={C.cornice} stroke={C.wallLine} strokeWidth={2} />
    {[330, 435, 645, 750].map((x) => (
      <g key={x}>
        <path d={arch(x - 39, 396, 78, 162)} fill={C.cream} stroke={C.outline} strokeWidth={1.6} />
        <path d={arch(x - 30, 407, 60, 146)} fill="url(#kDots)" />
        <rect x={x - 46} y={556} width={92} height={10} fill={C.cream} stroke={C.creamShade} strokeWidth={1.2} />
      </g>
    ))}
    <SunMedallion cx={540} cy={474} />

    {/* parapet of pointed merlons */}
    {new Array(52).fill(0).map((_, i) => {
      const x = -100 + i * 26;
      return <path key={i} d={`M${x} 612V590L${x + 11} 574L${x + 22} 590V612Z`} fill={C.cream} stroke={C.creamShade} strokeWidth={1.2} />;
    })}
    <rect x={-120} y={604} width={1320} height={15} fill="#EADBB9" stroke={C.creamShade} strokeWidth={1.2} />

    {/* lower storey */}
    <rect x={-120} y={619} width={1320} height={250} fill={C.wall} />
    <rect x={-120} y={619} width={1320} height={9} fill={C.wallLine} opacity={0.45} />
    {/* outer niches */}
    {[62, 962].map((x) => (
      <g key={x}>
        <path d={arch(x, 700, 56, 120)} fill={C.cream} stroke={C.outline} strokeWidth={1.4} />
        <path d={arch(x + 7, 708, 42, 112)} fill={C.maroon} />
      </g>
    ))}
    {/* side arches + central door */}
    {[190, 720].map((x) => (
      <g key={x}>
        <path d={arch(x, 664, 170, 204)} fill={C.cream} stroke={C.outline} strokeWidth={1.6} />
        <path d={arch(x + 12, 678, 146, 190)} fill="url(#kJaali)" />
      </g>
    ))}
    <path d={arch(446, 642, 188, 226)} fill={C.cream} stroke={C.outline} strokeWidth={1.6} />
    <path d={arch(460, 657, 160, 211)} fill="url(#kJaali)" />
    <path d="M540 657V868" stroke={C.cream} strokeWidth={4} />
    {[150, 400, 680, 930].map((x) => (
      <Pillar key={x} x={x} />
    ))}
    <Toran f={f} x1={168} x2={384} y={658} sag={26} seed="tl" />
    <Toran f={f} x1={412} x2={668} y={646} sag={30} seed="tc" />
    <Toran f={f} x1={696} x2={912} y={658} sag={26} seed="tr" />

    {/* diamond band + plinth */}
    <rect x={-120} y={868} width={1320} height={30} fill="#F1E2C2" />
    {new Array(44).fill(0).map((_, i) => {
      const x = -104 + i * 32;
      const col = [C.red, C.green, C.gold][i % 3];
      return (
        <g key={i}>
          <path d={`M${x} 872L${x + 11} 883L${x} 894L${x - 11} 883Z`} fill={col} />
          <circle cx={x + 16} cy={883} r={2.2} fill={C.wallLine} />
        </g>
      );
    })}
    <path d="M-120 868H1200M-120 898H1200" stroke={C.wallLine} strokeWidth={3} />
    <rect x={-120} y={899} width={1320} height={42} fill="#8E3B22" />
    <rect x={-120} y={899} width={1320} height={5} fill="#A54A2A" />
    {night > 0.001 ? (
      <g opacity={0.55 * night} fill="#1A1442">
        <rect x={-200} y={572} width={1480} height={373} />
        <rect x={240} y={356} width={600} height={222} />
        <rect x={386} y={318} width={308} height={44} />
        <path d={domePath(540, 318, 150, 30, 246)} />
        <rect x={536} y={20} width={8} height={56} />
        {[282, 798].map((cx) => (
          <g key={cx}>
            <rect x={cx - 74} y={237} width={148} height={123} />
            <path d={domePath(cx, 237, 46, 8, 74)} />
          </g>
        ))}
      </g>
    ) : null}
    {[205, 345, 470, 610, 735, 875].map((x, i) => (
      <Diya key={x} f={f} x={x} y={866} seed={`d${i}`} s={0.85 + 0.35 * night} />
    ))}
  </g>
);

/* ------------------------------------------------------------------ */
/* Courtyard + seated court                                            */
/* ------------------------------------------------------------------ */

export const Ground: React.FC<{ night?: number }> = ({ night = 0 }) => (
  <g>
    <rect x={-140} y={940} width={1360} height={1000} fill={C.sand} />
    <rect x={-140} y={940} width={1360} height={20} fill={C.sandDark} opacity={0.55} />
    {new Array(340).fill(0).map((_, i) => (
      <circle
        key={i}
        cx={-120 + rnd(`gx${i}`) * 1320}
        cy={962 + rnd(`gy${i}`) * 960}
        r={0.9 + rnd(`gr${i}`) * 1.9}
        fill={rnd(`gc${i}`) > 0.5 ? C.sandLight : C.sandDark}
        opacity={0.55}
      />
    ))}
    {night > 0.001 ? <rect x={-200} y={930} width={1480} height={1020} fill="#1A1442" opacity={0.55 * night} /> : null}
  </g>
);

const CLOTH = ["#C0392B", "#2E6DB4", "#2F8A57", "#7B3FA0", "#E2A72E", "#E0742A", "#F3EAD6", "#1F7A7A"];
const SKIN = ["#C68B59", "#A86B45", "#8A5636", "#D9A273"];

export const Crowd: React.FC<{ f: number; cheer?: number; night?: number }> = ({ f, cheer = 0, night = 0 }) => (
  <g>
    {[
      { y: 1012, gap: 46, s: 0.86, off: 0 },
      { y: 1062, gap: 52, s: 1, off: 26 },
    ].map((row, r) =>
      new Array(Math.ceil(1340 / row.gap)).fill(0).map((_, i) => {
        const x = -110 + row.off + i * row.gap + (rnd(`cx${r}${i}`) - 0.5) * 8;
        const k = `${r}-${i}`;
        const body = CLOTH[Math.floor(rnd(`cb${k}`) * CLOTH.length)];
        const pag = CLOTH[Math.floor(rnd(`ct${k}`) * CLOTH.length)];
        const skin = SKIN[Math.floor(rnd(`cs${k}`) * SKIN.length)];
        const calm = rnd(`cm${k}`) > 0.45 ? Math.sin(f / (7 + rnd(`cf${k}`) * 5) + i * 1.3) * 2.2 : 0;
        const jump = cheer > 0 ? -Math.abs(Math.sin(f / (2.6 + rnd(`cj${k}`) * 1.4) + i * 2.1)) * 12 * cheer : 0;
        const arms = cheer > 0.2 && rnd(`ca${k}`) > 0.35;
        return (
          <g key={k} transform={`translate(${x} ${row.y + calm + jump}) scale(${row.s})`}>
            {arms ? (
              <g fill={skin} stroke="#00000022" strokeWidth={1}>
                <circle cx={-24} cy={-62 - 14 * cheer} r={7} />
                <circle cx={24} cy={-62 - 14 * cheer} r={7} />
              </g>
            ) : null}
            <path d="M-31 0C-30 -16 -26 -30 -18 -36C-8 -42 8 -42 18 -36C26 -30 30 -16 31 0Z" fill={body} stroke="#00000022" strokeWidth={1.5} />
            <path d="M-4 -40L0 -22L4 -40Z" fill="#00000026" />
            <circle cy={-54} r={16} fill={skin} />
            <path d="M-17 -56C-18 -76 -8 -82 0 -82C8 -82 18 -76 17 -56C8 -62 -8 -62 -17 -56Z" fill={pag} stroke="#00000022" strokeWidth={1.2} />
            <circle cx={9} cy={-78} r={5} fill={pag} stroke="#00000022" strokeWidth={1} />
          </g>
        );
      }),
    )}
    {night > 0.001 ? <rect x={-200} y={900} width={1480} height={260} fill="#1A1442" opacity={0.5 * night} /> : null}
  </g>
);
