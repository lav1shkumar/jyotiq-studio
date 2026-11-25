/**
 * भारत · विशेष — golden-hour battlefield kit (2.5D SVG).
 * Look target: soft illustrated epic — backlit low sun, volumetric rays, peach haze, dusty plain,
 * armies in perspective rows with bright flags, golden domed chariots, depth blur on near/far layers.
 * All drawn in code; nothing traced from any reference.
 */
import React from "react";

export const W = 1080;
export const H = 1920;

// ---------- palette ----------
export const P = {
  skyTop: "#5d6f9e",
  skyMid: "#c99a92",
  skyLow: "#f7c58e",
  horizon: "#ffe2ad",
  sunCore: "#fffbe9",
  sunGlow: "#ffd590",
  cloud: "#f8dcc0",
  cloudShade: "#c4928a",
  groundFar: "#f0c993",
  groundMid: "#c08a5a",
  groundNear: "#7a5238",
  groundEdge: "#4a3020",
  haze: "#f6d3a2",
  gold: "#f3c24f",
  goldMid: "#d39a2c",
  goldDark: "#8a5a14",
  red: "#b3242e",
  redDark: "#6c1119",
  white: "#f7f1e6",
  ink: "#24160f",
};

// ---------- utils ----------
export const rng = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = (t: number) => {
  const x = clamp(t);
  return x * x * x * (x * (x * 6 - 15) + 10);
};
export const inv = (f: number, a: number, b: number) => clamp((f - a) / (b - a));
const hex = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
export const mix = (c1: string, c2: string, t: number) => {
  const a = hex(c1);
  const b = hex(c2);
  const m = a.map((v, i) => Math.round(lerp(v, b[i], clamp(t))));
  return `rgb(${m[0]},${m[1]},${m[2]})`;
};

// ---------- shared defs ----------
export const WorldDefs: React.FC = () => (
  <defs>
    <filter id="sp-blur4" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4" /></filter>
    <filter id="sp-blur10" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="10" /></filter>
    <filter id="sp-blur24" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="24" /></filter>
    <filter id="sp-blur50" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="50" /></filter>
    <radialGradient id="sp-sunBloom">
      <stop offset="0" stopColor="#fffdf0" stopOpacity="1" />
      <stop offset="0.12" stopColor="#fff2c8" stopOpacity="0.95" />
      <stop offset="0.35" stopColor="#ffd590" stopOpacity="0.45" />
      <stop offset="0.7" stopColor="#ffb070" stopOpacity="0.12" />
      <stop offset="1" stopColor="#ff9a60" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="sp-glare" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#fff6d8" stopOpacity="0.85" />
      <stop offset="0.5" stopColor="#ffd9a0" stopOpacity="0.3" />
      <stop offset="1" stopColor="#ffd9a0" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="sp-ray" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#fff4d0" stopOpacity="0.55" />
      <stop offset="1" stopColor="#fff4d0" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="sp-gold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#ffe9a0" />
      <stop offset="0.45" stopColor={P.gold} />
      <stop offset="1" stopColor={P.goldDark} />
    </linearGradient>
    <linearGradient id="sp-goldH" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor={P.goldDark} />
      <stop offset="0.35" stopColor={P.gold} />
      <stop offset="0.6" stopColor="#fff0b0" />
      <stop offset="1" stopColor={P.goldMid} />
    </linearGradient>
    <radialGradient id="sp-dome" cx="0.35" cy="0.3" r="0.8">
      <stop offset="0" stopColor="#fff3c0" />
      <stop offset="0.4" stopColor={P.gold} />
      <stop offset="1" stopColor={P.goldDark} />
    </radialGradient>
    <linearGradient id="sp-red" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#d23a3a" />
      <stop offset="1" stopColor={P.redDark} />
    </linearGradient>
    <linearGradient id="sp-horse" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#ffffff" />
      <stop offset="0.6" stopColor="#efe6da" />
      <stop offset="1" stopColor="#b9a99a" />
    </linearGradient>
  </defs>
);

// ---------- sky ----------
export const Sky: React.FC<{ sunX: number; sunY: number; f: number; dim?: number; rays?: number }> = ({ sunX, sunY, f, dim = 0, rays = 1 }) => {
  const r = rng(7);
  const clouds = Array.from({ length: 9 }, (_, i) => ({
    x: r() * 1300 - 110,
    y: 120 + r() * 520,
    s: 0.6 + r() * 0.9,
    v: 0.08 + r() * 0.12,
    k: i,
  }));
  const rayList = Array.from({ length: 13 }, (_, i) => ({ a: -170 + i * 13 + (r() - 0.5) * 6, w: 2 + r() * 4, o: 0.35 + r() * 0.5 }));
  return (
    <g>
      <defs>
        <linearGradient id="sp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mix(P.skyTop, "#2a2238", dim)} />
          <stop offset="0.42" stopColor={mix(P.skyMid, "#5a3a3a", dim)} />
          <stop offset="0.75" stopColor={mix(P.skyLow, "#8a5a40", dim * 0.8)} />
          <stop offset="1" stopColor={mix(P.horizon, "#c08050", dim * 0.6)} />
        </linearGradient>
      </defs>
      <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="url(#sp-sky)" />
      {/* clouds: soft stacked puffs, lit from the sun side */}
      {clouds.map((c) => {
        const x = ((c.x + f * c.v * 2) % 1400) - 150;
        const lit = 1 - Math.min(1, Math.abs(x - sunX) / 900);
        return (
          <g key={c.k} transform={`translate(${x},${c.y}) scale(${c.s})`} opacity={0.9 - dim * 0.4} filter="url(#sp-blur10)">
            <ellipse cx={0} cy={20} rx={170} ry={34} fill={mix(P.cloudShade, "#3a2a34", dim)} opacity={0.75} />
            <ellipse cx={-60} cy={0} rx={80} ry={46} fill={mix(P.cloud, "#fff4dc", lit)} />
            <ellipse cx={20} cy={-18} rx={96} ry={58} fill={mix(P.cloud, "#fff8e8", lit)} />
            <ellipse cx={100} cy={4} rx={74} ry={40} fill={mix(P.cloud, "#fff0d6", lit * 0.8)} />
          </g>
        );
      })}
      {/* sun */}
      <circle cx={sunX} cy={sunY} r={780} fill="url(#sp-sunBloom)" opacity={0.9 * (1 - dim * 0.85)} />
      <circle cx={sunX} cy={sunY} r={70} fill={P.sunCore} opacity={1 - dim * 0.7} filter="url(#sp-blur10)" />
      {/* volumetric rays */}
      {rays > 0 && (
        <g opacity={rays * (0.55 - dim * 0.5) * (0.85 + 0.15 * Math.sin(f / 23))} filter="url(#sp-blur24)">
          {rayList.map((ry, i) => (
            <polygon
              key={i}
              transform={`translate(${sunX},${sunY}) rotate(${ry.a + Math.sin(f / 60 + i) * 1.2})`}
              points={`0,0 1500,${-ry.w * 18} 1500,${ry.w * 18}`}
              fill="url(#sp-ray)"
              opacity={ry.o}
            />
          ))}
        </g>
      )}
    </g>
  );
};

// ---------- ground ----------
export const Plain: React.FC<{ horizon: number; f: number; sunX: number; dim?: number }> = ({ horizon, f, sunX, dim = 0 }) => {
  const r = rng(21);
  const streaks = Array.from({ length: 70 }, () => ({ x: r() * 1300 - 100, y: r(), w: 40 + r() * 220, o: 0.05 + r() * 0.12 }));
  return (
    <g>
      <defs>
        <linearGradient id="sp-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mix(P.groundFar, "#7a5038", dim)} />
          <stop offset="0.18" stopColor={mix("#dcae78", "#5a3a28", dim)} />
          <stop offset="0.45" stopColor={mix(P.groundMid, "#3e281c", dim)} />
          <stop offset="0.8" stopColor={mix(P.groundNear, "#2a1a12", dim)} />
          <stop offset="1" stopColor={P.groundEdge} />
        </linearGradient>
      </defs>
      <rect x={-200} y={horizon} width={W + 400} height={H - horizon + 200} fill="url(#sp-ground)" />
      {streaks.map((s, i) => {
        const yy = horizon + Math.pow(s.y, 1.8) * (H - horizon);
        const sc = 0.3 + Math.pow(s.y, 1.8) * 1.6;
        return <ellipse key={i} cx={s.x} cy={yy} rx={s.w * sc} ry={3 * sc} fill={i % 3 ? "#3a2416" : "#ffe0b0"} opacity={s.o} />;
      })}
      {/* sun glare on the dust */}
      <ellipse cx={sunX} cy={horizon + 40} rx={620} ry={120} fill="url(#sp-glare)" opacity={0.9 - dim * 0.8} />
      {/* drifting dust */}
      <g filter="url(#sp-blur50)" opacity={0.35}>
        {[0, 1, 2, 3].map((i) => (
          <ellipse key={i} cx={((i * 360 + f * (0.6 + i * 0.2)) % 1500) - 200} cy={horizon + 60 + i * 70} rx={320} ry={60} fill="#ffe2b4" />
        ))}
      </g>
    </g>
  );
};

// ---------- army in perspective rows ----------
const COATS = ["#a8262e", "#c9862e", "#e6dccb", "#3c4f86", "#7b2a52", "#d9b04a", "#4d6b3a", "#8a3a1c", "#f0e4c8"];
const FLAGS = ["#e8342e", "#f7c531", "#2f9a52", "#2c5fb8", "#f4f1e8", "#f28a1e", "#7a2fa0", "#e8342e"];

type ArmyProps = {
  horizon: number;
  front: number; // y of the front row
  x0: number;
  x1: number;
  f: number;
  seed?: number;
  rows?: number;
  sFront?: number;
  bhishma?: boolean;
  wave?: number; // 0..1 fall-over / knocked-out amount
};

export const Army: React.FC<ArmyProps> = ({ horizon, front, x0, x1, f, seed = 3, rows = 16, sFront = 1.5, bhishma = false, wave = 0 }) => {
  const r = rng(seed);
  const items: React.ReactNode[] = [];
  const vx = (x0 + x1) / 2;
  for (let k = rows - 1; k >= 0; k--) {
    const d = k / (rows - 1); // 0 front .. 1 back
    const z = 1 + Math.pow(d, 1.3) * 11;
    const s = sFront / z;
    const y = horizon + (front - horizon) / z;
    const xa = lerp(x0, vx, d * 0.2);
    const xb = lerp(x1, vx, d * 0.2);
    const hazeT = Math.pow(d, 0.7) * 0.82;
    // body band: the packed mass of the rank, so no ground shows between ranks
    const bandTop = y - 15 * s;
    const yNext = horizon + (front - horizon) / (1 + Math.pow(Math.max(0, (k - 1) / (rows - 1)), 1.3) * 11);
    items.push(
      <rect key={`b${k}`} x={xa - 40} y={bandTop} width={xb - xa + 80} height={Math.max(4, (yNext - y) + 15 * s)} fill={mix("#4a2c22", P.haze, hazeT)} opacity={0.92} />,
    );
    const spacing = Math.max(7.5 * s, 2.6);
    const n = Math.min(Math.floor((xb - xa) / spacing), 260);
    for (let i = 0; i < n; i++) {
      const x = xa + i * spacing + (r() - 0.5) * spacing * 1.4;
      const yy = y + (r() - 0.5) * 7 * s;
      const hs = 0.8 + r() * 0.45;
      const coat = mix(COATS[Math.floor(r() * COATS.length)], P.haze, hazeT);
      const bob = Math.sin(f / 9 + i * 1.7 + k) * 0.6 * s;
      const fall = wave > 0 ? clamp(wave * 1.6 - (1 - d) * 0.3 - r() * 0.5) : 0;
      const lean = (r() - 0.5) * 16;
      if (s > 0.32) {
        items.push(
          <g key={`s${k}-${i}`} transform={`translate(${x},${yy + bob}) rotate(${fall * (r() > 0.5 ? 80 : -80)}) scale(${hs})`}>
            <line x1={2.5 * s} y1={-26 * s} x2={2.5 * s + lean * s * 0.3} y2={2 * s} stroke={mix("#3a2a1c", P.haze, hazeT)} strokeWidth={Math.max(0.7, 0.9 * s)} transform={`rotate(${lean},0,0)`} />
            <rect x={-3.2 * s} y={-13 * s} width={6.4 * s} height={14 * s} rx={2 * s} fill={coat} />
            <circle cx={0} cy={-15.5 * s} r={2.7 * s} fill={mix("#5e3a24", P.haze, hazeT)} />
            <path d={`M${-3 * s},${-17 * s} q${3 * s},${-4.5 * s} ${6 * s},0`} fill={mix(r() > 0.55 ? P.gold : "#c9c0b0", P.haze, hazeT)} />
            {r() < 0.35 && <circle cx={-3.4 * s} cy={-7 * s} r={3.6 * s} fill={mix(r() > 0.5 ? "#7a4a1c" : "#b88a3a", P.haze, hazeT)} />}
          </g>,
        );
      } else {
        items.push(<circle key={`s${k}-${i}`} cx={x} cy={yy - 8 * s} r={Math.max(1, 3.6 * s * hs)} fill={coat} />);
        if (r() < 0.4) items.push(<line key={`p${k}-${i}`} x1={x} y1={yy - 6 * s} x2={x + (r() - 0.5) * 3} y2={yy - 30 * s} stroke={mix("#3a2a1c", P.haze, hazeT)} strokeWidth={0.6} />);
      }
      if (r() < 0.04 + d * 0.03) {
        const ph = 30 * s + 44 * s * r();
        const fc = mix(FLAGS[Math.floor(r() * FLAGS.length)], P.haze, hazeT * 0.6);
        const fl = Math.sin(f / 6 + i) * 3 * s;
        const fw = (12 + r() * 10) * s;
        items.push(
          <g key={`f${k}-${i}`} transform={`translate(${x},${yy})`}>
            <line x1={0} y1={0} x2={0} y2={-ph - 18 * s} stroke={mix("#4a3424", P.haze, hazeT)} strokeWidth={Math.max(0.7, 1.2 * s)} />
            <path d={`M0,${-ph - 18 * s} Q${fw * 0.5},${-ph - 16 * s + fl} ${fw},${-ph - 13 * s + fl * 1.4} L0,${-ph - 6 * s} Z`} fill={fc} />
          </g>,
        );
      }
      if (d > 0.08 && d < 0.85 && r() < 0.016) items.push(<ChariotSmall key={`c${k}-${i}`} x={x} y={yy} s={s * 1.5} haze={hazeT} f={f} />);
      if (d > 0.15 && d < 0.75 && r() < 0.008) items.push(<ElephantSmall key={`e${k}-${i}`} x={x} y={yy} s={s * 1.6} haze={hazeT} />);
    }
    if (bhishma && k === Math.floor(rows * 0.2)) {
      items.push(<ChariotSmall key="bhishma" x={vx + 30} y={y + 2} s={s * 2.6} haze={hazeT * 0.6} f={f} white />);
    }
  }
  return <g>{items}</g>;
};

export const ChariotSmall: React.FC<{ x: number; y: number; s: number; haze: number; f: number; white?: boolean }> = ({ x, y, s, haze, f, white }) => {
  const g = (c: string) => mix(c, P.haze, haze);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* horses */}
      {[-14, -8].map((dx, i) => (
        <g key={i} transform={`translate(${dx - 10},0)`}>
          <ellipse cx={0} cy={-9} rx={6} ry={3.5} fill={g("#f2ece2")} />
          <path d={`M-5,-10 l-3,-6 l2,0 z`} fill={g("#f2ece2")} />
          <line x1={-4} y1={-7} x2={-4} y2={0} stroke={g("#e6ddd0")} strokeWidth={1.2} />
          <line x1={4} y1={-7} x2={4} y2={0} stroke={g("#e6ddd0")} strokeWidth={1.2} />
        </g>
      ))}
      <rect x={-6} y={-14} width={16} height={9} fill={g(white ? "#f4f1ea" : P.red)} />
      <circle cx={2} cy={-4} r={5} fill="none" stroke={g(P.goldMid)} strokeWidth={1.4} />
      <line x1={-4} y1={-14} x2={-4} y2={-30} stroke={g(P.goldMid)} strokeWidth={0.9} />
      <line x1={8} y1={-14} x2={8} y2={-30} stroke={g(P.goldMid)} strokeWidth={0.9} />
      <path d="M-8,-30 Q2,-44 12,-30 Z" fill={g(white ? "#fbf8f0" : P.gold)} />
      <path d="M-8,-30 L12,-30 L11,-27 L-7,-27 Z" fill={g(white ? "#e8e2d4" : P.red)} />
      <line x1={2} y1={-40} x2={2} y2={-58} stroke={g("#4a3424")} strokeWidth={0.8} />
      <path d={`M2,-58 L14,${-54 + Math.sin(f / 7) * 2} L2,-50 Z`} fill={g(white ? "#ffffff" : "#e8342e")} />
    </g>
  );
};

export const ElephantSmall: React.FC<{ x: number; y: number; s: number; haze: number }> = ({ x, y, s, haze }) => {
  const g = (c: string) => mix(c, P.haze, haze);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={-14} rx={13} ry={9} fill={g("#6e6660")} />
      <circle cx={-12} cy={-16} r={6} fill={g("#6e6660")} />
      <path d="M-17,-14 q-3,8 0,13" stroke={g("#6e6660")} strokeWidth={2.4} fill="none" />
      {[-8, -2, 5, 10].map((lx) => (
        <rect key={lx} x={lx - 1.6} y={-8} width={3.2} height={8} fill={g("#5e5650")} />
      ))}
      <rect x={-6} y={-30} width={14} height={8} rx={1} fill={g(P.red)} />
      <path d="M-7,-30 Q1,-40 9,-30 Z" fill={g(P.gold)} />
    </g>
  );
};

// ---------- arrow storm ----------
export const ArrowStorm: React.FC<{
  f: number;
  n?: number;
  from: [number, number];
  to: [number, number];
  spread?: number;
  apex?: number;
  dur?: number;
  launch?: number;
  scale?: number;
  seed?: number;
}> = ({ f, n = 900, from, to, spread = 600, apex = 900, dur = 42, launch = 40, scale = 1, seed = 5 }) => {
  const r = rng(seed);
  const out: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const t0 = r() * launch;
    const lane = r(); // lane across the volley: keeps trajectories parallel
    const sx = from[0] + (r() - 0.5) * 80 + lane * 40;
    const sy = from[1] + (r() - 0.5) * 40;
    const tx = to[0] + (lane - 0.5) * spread + (r() - 0.5) * 40;
    const ty = to[1] + (lane - 0.5) * spread * 0.12 + (r() - 0.5) * 20;
    const ap = apex * (0.92 + lane * 0.16);
    const depth = 0.55 + r() * 0.7;
    const T = dur * (0.95 + r() * 0.1);
    const p = (f - t0) / T;
    if (p <= 0 || p >= 1) continue;
    const pos = (q: number) => ({ x: lerp(sx, tx, q), y: lerp(sy, ty, q) - ap * 4 * q * (1 - q) });
    const a1 = pos(p);
    const a0 = pos(Math.max(0, p - 0.035));
    const ang = (Math.atan2(a1.y - a0.y, a1.x - a0.x) * 180) / Math.PI;
    const len = 42 * depth * scale;
    const streak = Math.hypot(a1.x - a0.x, a1.y - a0.y);
    out.push(
      <g key={i} transform={`translate(${a1.x},${a1.y}) rotate(${ang})`} opacity={0.5 + depth * 0.45}>
        <line x1={-streak - len} y1={0} x2={-len} y2={0} stroke="#ffeec4" strokeOpacity={0.16} strokeWidth={2.6 * depth * scale} strokeLinecap="round" />
        <line x1={-len} y1={0} x2={0} y2={0} stroke="#24140a" strokeWidth={2.1 * depth * scale} />
        <path d={`M0,0 l${-8 * depth * scale},${-3.2 * depth * scale} l0,${6.4 * depth * scale} z`} fill={P.gold} />
        <path d={`M${-len},0 l${-7 * depth * scale},${-4 * depth * scale} l${4 * depth * scale},${4 * depth * scale} l${-4 * depth * scale},${4 * depth * scale} z`} fill="#eadcc4" />
      </g>,
    );
  }
  return <g>{out}</g>;
};

// ---------- the hero chariot, rear three-quarter (for the wide lone-vs-army shot) ----------
export const HeroChariotRear: React.FC<{ x: number; y: number; s: number; f: number; draw?: number }> = ({ x, y, s, f, draw = 1 }) => {
  const fl = (k: number) => Math.sin(f / 5 + k) * 10;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* contact shadow toward camera (backlit) */}
      <ellipse cx={30} cy={8} rx={260} ry={34} fill="#1a0e08" opacity={0.45} filter="url(#sp-blur10)" />
      {/* horses beyond the car (smaller, partly hidden) */}
      {[-150, -80, 40, 110].map((hx, i) => (
        <g key={i} transform={`translate(${hx + 20},${-150}) scale(0.62)`}>
          <HorseRear f={f + i * 7} />
        </g>
      ))}
      {/* yoke pole */}
      <path d="M-10,-120 L0,-210" stroke={P.goldDark} strokeWidth={10} />
      {/* wheels: seen from behind, nearly edge-on ellipses */}
      {[-150, 190].map((wx, i) => (
        <g key={i} transform={`translate(${wx},-110)`}>
          <ellipse cx={0} cy={0} rx={38} ry={118} fill="none" stroke="url(#sp-goldH)" strokeWidth={18} />
          <ellipse cx={0} cy={0} rx={22} ry={96} fill="none" stroke={P.goldDark} strokeWidth={4} opacity={0.8} />
          {[0, 30, 60, 90, 120, 150].map((a) => (
            <line key={a} x1={0} y1={0} x2={Math.cos((a * Math.PI) / 180) * 30} y2={Math.sin((a * Math.PI) / 180) * 100} stroke={P.goldMid} strokeWidth={5} />
          ))}
          <ellipse cx={0} cy={0} rx={12} ry={20} fill="url(#sp-gold)" />
        </g>
      ))}
      {/* car body */}
      <path d="M-170,-120 L210,-120 L230,-250 L-190,-250 Z" fill="url(#sp-red)" />
      <path d="M-190,-250 L230,-250 L236,-268 L-196,-268 Z" fill="url(#sp-goldH)" />
      <path d="M-170,-120 L210,-120 L214,-104 L-174,-104 Z" fill="url(#sp-goldH)" />
      {[-120, -40, 40, 120].map((px) => (
        <g key={px}>
          <circle cx={px + 20} cy={-185} r={26} fill="none" stroke={P.gold} strokeWidth={5} />
          <circle cx={px + 20} cy={-185} r={10} fill={P.gold} />
        </g>
      ))}
      {/* Arjuna from behind, drawing the Gandiva toward the army */}
      <g transform="translate(40,-268)">
        <ArjunaBackFigure f={f} draw={draw} />
      </g>
      {/* canopy pillars */}
      {[-180, 220].map((px) => (
        <rect key={px} x={px - 5} y={-640} width={10} height={380} fill="url(#sp-goldH)" />
      ))}
      {/* dome */}
      <path d="M-215,-640 Q20,-860 255,-640 Z" fill="url(#sp-dome)" />
      <path d="M-215,-640 L255,-640 L248,-612 L-208,-612 Z" fill={P.red} />
      {Array.from({ length: 16 }, (_, i) => (
        <path key={i} d={`M${-208 + i * 29},-612 q14.5,22 29,0 Z`} fill={P.red} />
      ))}
      {Array.from({ length: 16 }, (_, i) => (
        <circle key={i} cx={-194 + i * 29} cy={-588} r={4} fill="#fff4dc" />
      ))}
      <rect x={14} y={-900} width={12} height={60} fill={P.goldMid} />
      <circle cx={20} cy={-905} r={14} fill="url(#sp-dome)" />
      {/* the ape banner: tall pole from the back corner */}
      <line x1={250} y1={-260} x2={250} y2={-1180} stroke={P.goldDark} strokeWidth={12} />
      <circle cx={250} cy={-1186} r={14} fill="url(#sp-dome)" />
      <g transform="translate(256,-1170)">
        <path
          d={`M0,0 C80,${-10 + fl(0)} 160,${10 + fl(1)} 250,${fl(2)} L240,${150 + fl(3)} C160,${160 + fl(1)} 80,${140 + fl(0)} 0,150 Z`}
          fill="url(#sp-gold)"
        />
        <path d={`M0,0 C80,${-10 + fl(0)} 160,${10 + fl(1)} 250,${fl(2)}`} stroke="#fff3c0" strokeWidth={4} fill="none" opacity={0.7} />
        <g transform={`translate(110,${60 + fl(1) * 0.6}) scale(1.05)`}>
          <ApeEmblem />
        </g>
      </g>
    </g>
  );
};

// simplified leaping-ape emblem (red on gold), lion tail per the text
export const ApeEmblem: React.FC = () => (
  <g fill="#a3201f">
    <ellipse cx={0} cy={0} rx={30} ry={18} transform="rotate(-20)" />
    <circle cx={30} cy={-22} r={14} />
    <path d="M38,-30 l10,-6 l-2,10 z" />
    <path d="M-10,8 L-30,40 L-22,42 L-2,14 Z" />
    <path d="M14,6 L30,38 L38,34 L22,4 Z" />
    <path d="M20,-14 L52,-40 L56,-34 L26,-8 Z" />
    <path d="M-26,-6 C-60,-20 -70,-50 -50,-64 C-46,-56 -54,-36 -24,-14 Z" />
    <circle cx={-52} cy={-66} r={7} />
  </g>
);

export const HorseRear: React.FC<{ f: number }> = ({ f }) => {
  const sw = Math.sin(f / 4) * 6;
  return (
    <g>
      {/* rear view: rump, back, raised neck and ears beyond */}
      <path d="M-40,-150 C-50,-220 -30,-260 0,-262 C30,-260 50,-220 40,-150 Z" fill="url(#sp-horse)" />
      <path d="M-8,-250 C-10,-300 -4,-330 8,-340 C18,-330 22,-300 14,-250 Z" fill="#ece3d6" />
      <path d="M0,-338 l-8,-22 l8,10 z M10,-338 l8,-22 l-6,12 z" fill="#e0d6c8" />
      <path d="M-4,-344 C0,-372 10,-380 6,-400" stroke="#c42a2a" strokeWidth={8} fill="none" />
      <ellipse cx={-26} cy={-120} rx={30} ry={70} fill="url(#sp-horse)" />
      <ellipse cx={26} cy={-120} rx={30} ry={70} fill="url(#sp-horse)" />
      <path d={`M0,-160 C${sw},-120 ${sw * 1.5},-80 ${sw},-50`} stroke="#d8cdbd" strokeWidth={16} strokeLinecap="round" fill="none" />
      <rect x={-40} y={-60} width={12} height={62} rx={5} fill="#e6ddd0" />
      <rect x={28} y={-60} width={12} height={62} rx={5} fill="#e6ddd0" />
      <rect x={-46} y={-170} width={92} height={14} rx={6} fill="#b3242e" />
      <rect x={-46} y={-166} width={92} height={4} fill={P.gold} />
    </g>
  );
};

// Arjuna seen from behind on the car: red garments, hair bound in white cloth, gold gloves, Gandiva drawn
export const ArjunaBackFigure: React.FC<{ f: number; draw: number }> = ({ f, draw }) => {
  const tail = Math.sin(f / 4) * 8;
  const pull = 70 * draw;
  return (
    <g>
      {/* legs + dhoti */}
      <path d="M-46,0 L-30,-150 L30,-150 L46,0 Z" fill="#9e1f28" />
      <path d="M-30,-150 L30,-150 L24,-120 L-24,-120 Z" fill={P.gold} />
      {/* back */}
      <path d="M-44,-150 C-56,-220 -50,-270 -30,-292 L30,-292 C50,-270 56,-220 44,-150 Z" fill="#8a5a3c" />
      <path d="M-44,-150 C-40,-220 -10,-260 30,-292 L44,-270 C10,-240 -20,-200 -20,-150 Z" fill="#c22b33" opacity={0.95} />
      {/* draw arm (right) pulled back */}
      <path d={`M30,-280 L${70 + 0},-300 L${120 - pull * 0.2},-306`} stroke="#8a5a3c" strokeWidth={20} strokeLinecap="round" fill="none" />
      <circle cx={120 - pull * 0.2} cy={-306} r={11} fill={P.gold} />
      {/* bow arm (left) extended toward the army (away from camera, upward) */}
      <path d="M-30,-282 L-30,-370 L-12,-470" stroke="#8a5a3c" strokeWidth={18} strokeLinecap="round" fill="none" />
      <circle cx={-12} cy={-472} r={11} fill={P.gold} />
      {/* Gandiva, foreshortened */}
      <path d="M-40,-640 C30,-560 30,-380 -10,-300" stroke="url(#sp-goldH)" strokeWidth={10} fill="none" />
      <path d={`M-40,-640 L${120 - pull * 0.2},-306 L-10,-300`} stroke="#fff6e0" strokeWidth={1.6} fill="none" opacity={0.85} />
      {/* head */}
      <circle cx={0} cy={-316} r={30} fill="#1c120c" />
      <ellipse cx={0} cy={-344} rx={22} ry={14} fill={P.white} />
      <path d={`M-14,-340 C-40,${-330 + tail} -60,${-320 + tail * 1.4} -80,${-310 + tail * 1.8}`} stroke={P.white} strokeWidth={8} fill="none" strokeLinecap="round" />
      <circle cx={-28} cy={-310} r={5} fill={P.gold} />
    </g>
  );
};

// foreground silhouettes: spears, shields and helmets of warriors cut by the frame edge
export const ForeSilhouettes: React.FC<{ f: number; side?: "left" | "right"; y?: number; s?: number }> = ({ f, side = "left", y = H, s = 1 }) => {
  const r = rng(side === "left" ? 31 : 32);
  const n = 7;
  return (
    <g transform={`translate(${side === "left" ? 0 : W},${y}) scale(${side === "left" ? s : -s},${s})`} filter="url(#sp-blur4)">
      {Array.from({ length: n }, (_, i) => {
        const x = i * 70 + r() * 30;
        const h = 300 + r() * 220;
        const sway = Math.sin(f / 18 + i) * 6;
        return (
          <g key={i} transform={`translate(${x},0) rotate(${sway * 0.3})`}>
            <line x1={0} y1={0} x2={-30 + sway} y2={-h - 260} stroke="#140c08" strokeWidth={7} />
            <path d={`M${-30 + sway},${-h - 260} l-8,24 l16,0 z`} fill="#140c08" />
            <circle cx={30} cy={-h * 0.55} r={70 + r() * 30} fill="#1a100a" />
            <ellipse cx={-20} cy={-h * 0.8} rx={48} ry={56} fill="#140c08" />
            <path d={`M-60,-${h * 0.8} q40,-70 80,0`} fill="#140c08" />
            <rect x={-70} y={-h * 0.75} width={110} height={h * 0.75} rx={30} fill="#120a06" />
          </g>
        );
      })}
    </g>
  );
};

// lone hero chariot seen from behind and above, small in the frame: long shadow toward camera, dust trail
export const HeroChariotFar: React.FC<{ x: number; y: number; s: number; f: number }> = ({ x, y, s, f }) => {
  const fl = Math.sin(f / 5) * 6;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* long backlit shadow toward the camera */}
      <path d="M-60,0 L60,0 L110,190 L-110,190 Z" fill="#2a160c" opacity={0.3} filter="url(#sp-blur10)" />
      {/* dust kicked up */}
      <ellipse cx={0} cy={-6} rx={150} ry={26} fill="#ffe3b8" opacity={0.45} filter="url(#sp-blur10)" />
      {/* four white horses ahead (toward the army), backs and heads */}
      {[-45, -15, 15, 45].map((hx, i) => (
        <g key={i} transform={`translate(${hx},${-58 + Math.sin(f / 3 + i) * 1.5})`}>
          <ellipse cx={0} cy={0} rx={11} ry={22} fill="url(#sp-horse)" />
          <path d="M-4,-18 C-5,-34 -2,-44 2,-48 C6,-44 8,-34 5,-18 Z" fill="#efe7da" />
          <path d="M0,-50 l-3,-8 M3,-50 l3,-8" stroke="#e0d6c8" strokeWidth={2} />
          <path d="M1,-52 q2,-10 0,-16" stroke="#c42a2a" strokeWidth={3} fill="none" />
          <rect x={-11} y={-6} width={22} height={5} fill="#b3242e" />
        </g>
      ))}
      <line x1={0} y1={-30} x2={0} y2={-6} stroke={P.goldDark} strokeWidth={4} />
      {/* wheels, edge-on */}
      <ellipse cx={-52} cy={-14} rx={7} ry={24} fill="none" stroke="url(#sp-goldH)" strokeWidth={5} />
      <ellipse cx={52} cy={-14} rx={7} ry={24} fill="none" stroke="url(#sp-goldH)" strokeWidth={5} />
      {/* body */}
      <path d="M-46,-6 L46,-6 L50,-44 L-50,-44 Z" fill="url(#sp-red)" />
      <rect x={-52} y={-48} width={104} height={6} fill="url(#sp-goldH)" />
      {/* Arjuna standing, bow raised */}
      <rect x={-7} y={-80} width={14} height={34} rx={5} fill="#b3242e" />
      <circle cx={0} cy={-86} r={7} fill="#1c120c" />
      <ellipse cx={0} cy={-92} rx={6} ry={3.5} fill={P.white} />
      <path d="M14,-130 C26,-110 26,-80 14,-60" stroke="url(#sp-goldH)" strokeWidth={3} fill="none" />
      {/* canopy */}
      {[-46, 46].map((px) => (
        <rect key={px} x={px - 1.5} y={-130} width={3} height={84} fill={P.gold} />
      ))}
      <path d="M-56,-130 Q0,-186 56,-130 Z" fill="url(#sp-dome)" />
      <path d="M-56,-130 L56,-130 L54,-123 L-54,-123 Z" fill={P.red} />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${-54 + i * 13.5},-123 q6.75,8 13.5,0 Z`} fill={P.red} />
      ))}
      <circle cx={0} cy={-178} r={5} fill="url(#sp-dome)" />
      {/* ape banner */}
      <line x1={50} y1={-40} x2={50} y2={-330} stroke={P.goldDark} strokeWidth={4} />
      <g transform="translate(52,-326)">
        <path d={`M0,0 C26,${-4 + fl} 52,${4 - fl} 80,${fl} L76,${48 + fl} C52,${52 - fl} 26,${46 + fl} 0,48 Z`} fill="url(#sp-gold)" />
        <g transform={`translate(36,${22 + fl * 0.5}) scale(0.34)`}><ApeEmblem /></g>
      </g>
    </g>
  );
};
