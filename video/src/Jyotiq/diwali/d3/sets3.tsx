import React from "react";
import { H, ramp, rnd, W } from "../../manthan/style";
import { Diya } from "../d1/diya";
import { DiyaWave } from "../shared/fx";

/* Diwali Day 3 sets, part 1.
   CityNight: the hook's city on Diwali night from a high vantage point. Six depth layers of flat-roofed homes; every
   roofline is lined with glowing diyas, the near facades carry cascading fairy-light curtains and hanging aakash-kandil
   star lanterns (the Diwali signs a viewer reads at a glance), and the windows are dim and warm so the festival
   lights lead. Far layers use a window pattern; near layers have their own windows, which run down to the next row's
   rooftops so no empty bands show between rows. Above a soft horizon glow: an empty, MOONLESS sky (amavasya).
   `tilt` 0..1 pans the view up into that sky (the scene shifts down by 1100 px).
   The layout is built once at module load; per frame only the twinkle and the lantern sway change. */

export const HORIZON = 300;
const TILT_PX = 1100;

const LAYERS = [
  { y0: 372, w: [14, 34], h: [10, 40], col: "#221D42", s: 0.15 },
  { y0: 482, w: [24, 60], h: [24, 90], col: "#201A3E", s: 0.25 },
  { y0: 662, w: [40, 90], h: [50, 150], col: "#1B1535", s: 0.4 },
  { y0: 922, w: [60, 130], h: [80, 230], col: "#17112B", s: 0.6 },
  { y0: 1292, w: [90, 180], h: [130, 330], col: "#130E22", s: 0.85 },
  { y0: 1960, w: [140, 260], h: [220, 520], col: "#0E0A18", s: 1.25 },
];
const CURTAIN = ["#FFD36B", "#FFF1C1", "#FF9F43", "#FF5C5C"];
const KANDIL = ["#FF7A2E", "#FFC94D", "#E8463A", "#FF9F43"];

type Dot = { x: number; y: number; r: number; c: string; ph: number; glow: boolean };
type Win = { x: number; y: number; w: number; h: number; o: number };
type Lamp = { x: number; y: number; s: number; c: string; ph: number };
type Layer = { d: string; col: string; dots: Dot[]; wins: Win[]; lamps: Lamp[]; pattern: boolean };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const CITY: Layer[] = LAYERS.map((Ly, li) => {
  const s = Ly.s;
  const next = LAYERS[li + 1];
  const base = next ? next.y0 - next.h[0] + 6 : H; // facades run down to the next row's lowest rooftop
  let d = `M-40 ${H + 40}`;
  const dots: Dot[] = [];
  const wins: Win[] = [];
  const lamps: Lamp[] = [];
  let x = -30 + rnd(`c3x${li}`) * 20;
  for (let i = 0; x < W + 30; i++) {
    const w = lerp(Ly.w[0], Ly.w[1], rnd(`c3w${li}_${i}`));
    const h = lerp(Ly.h[0], Ly.h[1], rnd(`c3h${li}_${i}`));
    const roof = Ly.y0 - h;
    d += `L${x.toFixed(1)} ${Ly.y0}L${x.toFixed(1)} ${roof.toFixed(1)}L${(x + w).toFixed(1)} ${roof.toFixed(1)}L${(x + w).toFixed(1)} ${Ly.y0}`;
    for (let xx = x + 3; xx < x + w - 3; xx += 11 + 9 * s) {
      dots.push({ x: xx, y: roof - 1.5 * s, r: 1.4 + 2.6 * s, c: "#FFB347", ph: rnd(`c3p${li}_${i}_${xx | 0}`) * 6.28, glow: s >= 0.4 });
    }
    if (li >= 3) {
      const cols = Math.max(1, Math.floor((w - 8 * s) / (22 * s)));
      const rows = Math.max(1, Math.floor((base - roof - 16 * s) / (30 * s)));
      for (let cx = 0; cx < cols; cx++) {
        for (let cy = 0; cy < rows; cy++) {
          if (rnd(`c3win${li}_${i}_${cx}_${cy}`) < 0.3) {
            wins.push({ x: x + 6 * s + cx * 22 * s, y: roof + 12 * s + cy * 30 * s, w: 9 * s + 1, h: 11 * s + 1, o: 0.35 + 0.4 * rnd(`c3wo${li}_${i}_${cx}_${cy}`) });
          }
        }
      }
      if (rnd(`c3cur${li}_${i}`) < 0.55) {
        const strands = Math.floor(w / (14 * s));
        for (let k = 0; k < strands; k++) {
          const sx = x + 7 * s + k * 14 * s;
          const len = h * (0.35 + 0.3 * rnd(`c3len${li}_${i}_${k}`));
          for (let yy = roof + 4; yy < roof + len; yy += 12 * s) {
            dots.push({ x: sx, y: yy, r: 1.4 + 1.6 * s, c: CURTAIN[(k + Math.round(yy / (12 * s))) % 4], ph: rnd(`c3cp${li}_${i}_${k}_${yy | 0}`) * 6.28, glow: false });
          }
        }
      }
      if (rnd(`c3kan${li}_${i}`) < 0.4) {
        lamps.push({ x: x + w * (0.3 + 0.4 * rnd(`c3kx${li}_${i}`)), y: roof + h * 0.22, s: 0.7 * s, c: KANDIL[i % 4], ph: rnd(`c3kp${li}_${i}`) * 6.28 });
      }
    }
    x += w + rnd(`c3g${li}_${i}`) * 6 * s;
  }
  d += `L${W + 40} ${H + 40}Z`;
  return { d, col: Ly.col, dots, wins, lamps, pattern: li < 3 };
});

const STARS = Array.from({ length: 70 }, (_, i) => ({
  x: rnd(`c3sx${i}`) * W,
  y: -1400 + rnd(`c3sy${i}`) * (HORIZON + 1200),
  r: 0.8 + rnd(`c3sr${i}`),
  o: 0.2 + 0.4 * rnd(`c3so${i}`),
}));

const STAR = Array.from({ length: 10 }, (_, i) => {
  const a = (i * Math.PI) / 5 - Math.PI / 2;
  const r = i % 2 ? 8 : 18;
  return `${i ? "L" : "M"}${(r * Math.cos(a)).toFixed(1)} ${(r * Math.sin(a)).toFixed(1)}`;
}).join("") + "Z";

/** An aakash kandil: a star lantern on a short cord, swaying gently, with a glow and tassels. */
const Kandil: React.FC<{ L: Lamp; f: number }> = ({ L, f }) => (
  <g transform={`translate(${L.x} ${L.y}) rotate(${Math.sin(f / 20 + L.ph) * 4}) scale(${L.s})`}>
    <line x1={0} y1={-44} x2={0} y2={-18} stroke="#C9A25A" strokeWidth={1.5} />
    <circle r={34} fill={L.c} opacity={0.28} />
    <path d={STAR} fill={L.c} stroke="#FFE6A3" strokeWidth={1.2} />
    <path d="M-7 14L-6 30M0 16L0 34M7 14L6 30" stroke={L.c} strokeWidth={2} opacity={0.85} />
  </g>
);

/** A tile of windows (4 x 3 cells, about 40% lit) for the far rows. */
const WinPattern: React.FC<{ id: string; s: number }> = ({ id, s }) => (
  <pattern id={id} patternUnits="userSpaceOnUse" width={88 * s} height={90 * s}>
    {[[0, 0], [2, 0], [3, 0], [1, 1], [3, 1], [0, 2], [2, 2]].map(([cx, cy], i) => (
      <rect key={i} x={6 * s + cx * 22 * s} y={6 * s + cy * 30 * s} width={9 * s + 0.6} height={11 * s + 0.6} fill="#FFD27A" opacity={0.18 + 0.05 * i} />
    ))}
  </pattern>
);

export const CityNight: React.FC<{ f: number; tilt?: number }> = ({ f, tilt = 0 }) => (
  <g transform={`translate(0 ${tilt * TILT_PX})`}>
    <defs>
      <linearGradient id="d3Sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#04050D" />
        <stop offset="0.75" stopColor="#0E0D26" />
        <stop offset="1" stopColor="#1E1838" />
      </linearGradient>
      <linearGradient id="d3Hor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FF9A4A" stopOpacity={0} />
        <stop offset="0.75" stopColor="#FF9A4A" stopOpacity={0.26} />
        <stop offset="1" stopColor="#FF9A4A" stopOpacity={0.1} />
      </linearGradient>
      <linearGradient id="d3Haze" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FF9A4A" stopOpacity={0.14} />
        <stop offset="0.35" stopColor="#FF9A4A" stopOpacity={0.05} />
        <stop offset="1" stopColor="#FF9A4A" stopOpacity={0.12} />
      </linearGradient>
      {LAYERS.slice(0, 3).map((Ly, li) => (
        <WinPattern key={li} id={`d3Win${li}`} s={Ly.s} />
      ))}
    </defs>
    <rect x={0} y={-1400} width={W} height={HORIZON + 1460} fill="url(#d3Sky)" />
    {STARS.map((st, i) => (
      <circle key={i} cx={st.x} cy={st.y} r={st.r} fill="#E8ECFF" opacity={st.o * (0.75 + 0.25 * Math.sin(f / 11 + i))} />
    ))}
    <rect x={0} y={HORIZON - 200} width={W} height={260} fill="url(#d3Hor)" />
    {CITY.map((L, li) => (
      <g key={li}>
        <path d={L.d} fill={L.col} />
        {L.pattern ? <path d={L.d} fill={`url(#d3Win${li})`} /> : null}
        {L.wins.map((w, i) => (
          <rect key={i} x={w.x} y={w.y} width={w.w} height={w.h} fill="#FFD27A" opacity={w.o} />
        ))}
        {L.dots.map((p, i) => {
          const tw = 0.7 + 0.3 * Math.sin(f / 7 + p.ph);
          return (
            <g key={i}>
              {p.glow ? <circle cx={p.x} cy={p.y} r={p.r * 3.2} fill={p.c} opacity={0.3 * tw} /> : null}
              <circle cx={p.x} cy={p.y} r={p.r} fill={p.c} opacity={tw} />
            </g>
          );
        })}
        {L.lamps.map((k, i) => (
          <Kandil key={i} L={k} f={f} />
        ))}
      </g>
    ))}
    <rect x={0} y={HORIZON} width={W} height={H - HORIZON + 40} fill="url(#d3Haze)" />
  </g>
);

/* ------------------------------------------------------------------ */
/* 03: the rishis light the first diya on a dark land                   */
/* ------------------------------------------------------------------ */

const LAND_STARS = Array.from({ length: 60 }, (_, i) => ({ x: rnd(`r3sx${i}`) * W, y: rnd(`r3sy${i}`) * 1150, r: 0.8 + rnd(`r3sr${i}`), o: 0.25 + 0.4 * rnd(`r3so${i}`) }));

/** The moonless sky over a dark land with a gentle rise; the land starts at about y 1230. */
export const NightLand: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <defs>
      <linearGradient id="d3Night" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#04050D" />
        <stop offset="1" stopColor="#1A1636" />
      </linearGradient>
      <linearGradient id="d3NightHor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3A2E5A" stopOpacity={0} />
        <stop offset="1" stopColor="#4A3A6A" stopOpacity={0.7} />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#d3Night)" />
    <rect x={0} y={860} width={W} height={400} fill="url(#d3NightHor)" />
    {LAND_STARS.map((st, i) => (
      <circle key={i} cx={st.x} cy={st.y} r={st.r} fill="#E8ECFF" opacity={st.o * (0.75 + 0.25 * Math.sin(f / 11 + i))} />
    ))}
    <path d="M0 1250C300 1206 700 1236 1080 1200L1080 1920L0 1920Z" fill="#0B0814" />
  </g>
);

const RISHI_BODY = "M-150 0C-150 -60 -120 -120 -96 -170C-84 -200 -60 -226 -30 -232L30 -232C60 -226 84 -200 96 -170C120 -120 150 -60 150 0Z";
const RISHI_ARMS = "M-90 -190C-80 -140 -40 -118 -10 -116L10 -116C40 -118 80 -140 90 -190L70 -196C60 -160 30 -136 0 -134C-30 -136 -60 -160 -70 -196Z";

/** One seated rishi (origin at the base centre, about 400 px tall at s 1): crossed legs, shawl, beard, jata bun. */
const RishiShape: React.FC<{ fill: string; arms: boolean }> = ({ fill, arms }) => (
  <g>
    <ellipse cx={0} cy={-14} rx={170} ry={34} fill={fill} />
    <path d={RISHI_BODY} fill={fill} />
    {arms ? <path d={RISHI_ARMS} fill={fill} /> : null}
    <circle cx={0} cy={-290} r={50} fill={fill} />
    <path d="M-34 -270C-30 -220 -10 -196 0 -186C10 -196 30 -220 34 -270Z" fill={fill} />
    <circle cx={0} cy={-352} r={30} fill={fill} />
    <path d="M-12 -378C-6 -396 6 -396 12 -378Z" fill={fill} />
  </g>
);

/** Three rishis in silhouette; the lead (centre) holds the first diya. `light` 0..1 lights it and warms the faces
    and robes turned towards it, with a pool of light on the ground. The side rishis face the lamp. */
export const Rishis: React.FC<{ f: number; light: number }> = ({ f, light }) => {
  const fig = [
    { x: 250, y: 1340, s: 0.78, flip: false, lead: false },
    { x: 830, y: 1340, s: 0.78, flip: true, lead: false },
    { x: 540, y: 1420, s: 1.0, flip: false, lead: true },
  ];
  return (
    <g>
      <defs>
        <radialGradient id="d3RimSide" cx="0.74" cy="0.6" r="0.75">
          <stop offset="0" stopColor="#FFB347" stopOpacity={0.85} />
          <stop offset="0.55" stopColor="#C8662A" stopOpacity={0.35} />
          <stop offset="1" stopColor="#C8662A" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="d3RimLead" cx="0.5" cy="0.68" r="0.6">
          <stop offset="0" stopColor="#FFC56A" stopOpacity={0.95} />
          <stop offset="0.5" stopColor="#D2702E" stopOpacity={0.45} />
          <stop offset="1" stopColor="#D2702E" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={540} cy={1420} rx={300} ry={56} fill="#FFB347" opacity={0.3 * light} />
      {fig.map((r, i) => (
        <g key={i} transform={`translate(${r.x} ${r.y}) scale(${r.flip ? -r.s : r.s} ${r.s})`}>
          <g stroke="#5A5296" strokeWidth={4} strokeOpacity={0.85}>
            <RishiShape fill="#120C1A" arms={r.lead} />
          </g>
          <g opacity={light}>
            <RishiShape fill={r.lead ? "url(#d3RimLead)" : "url(#d3RimSide)"} arms={r.lead} />
          </g>
          {r.lead ? (
            <g transform="translate(0 -128)">
              <Diya f={f} lit={light} seed="d3first" scale={0.5} glow={light} />
            </g>
          ) : null}
        </g>
      ))}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* 05: Ayodhya by the Saryu, and the Pushpak vimana                     */
/* ------------------------------------------------------------------ */

const AY_BASE = 1340; // the ghats start here; the river below
type AyB = { x: number; w: number; top: number; kind: number };

const AY: AyB[] = (() => {
  const out: AyB[] = [];
  const side = (from: number, to: number, seed: string) => {
    let x = from;
    for (let i = 0; x < to; i++) {
      const w = Math.min(60 + 60 * rnd(`${seed}w${i}`), to - x);
      out.push({ x, w, top: AY_BASE - (90 + 150 * rnd(`${seed}h${i}`)), kind: Math.floor(rnd(`${seed}k${i}`) * 3) });
      x += w + 4;
    }
  };
  side(-20, 412, "ayl");
  out.push({ x: 420, w: 240, top: AY_BASE - 300, kind: 3 }); // the palace
  side(668, W + 20, "ayr");
  return out;
})();

const dome = (x: number, w: number, top: number) => `M${x + w * 0.1} ${top}A${w * 0.4} ${w * 0.4} 0 0 1 ${x + w * 0.9} ${top}Z`;
const spire = (x: number, w: number, top: number, h: number) =>
  `M${x + w * 0.15} ${top}C${x + w * 0.2} ${top - h * 0.6} ${x + w * 0.42} ${top - h * 0.95} ${x + w * 0.5} ${top - h}` +
  `C${x + w * 0.58} ${top - h * 0.95} ${x + w * 0.8} ${top - h * 0.6} ${x + w * 0.85} ${top}Z`;

const AY_PATH = AY.map((b) => {
  let d = `M${b.x} ${AY_BASE}V${b.top}H${b.x + b.w}V${AY_BASE}Z`;
  if (b.kind === 1) d += dome(b.x, b.w, b.top);
  if (b.kind === 2) d += spire(b.x, b.w, b.top, b.w * 0.9);
  if (b.kind === 3) d += dome(b.x + 50, 140, b.top) + spire(b.x, 60, b.top, 90) + spire(b.x + 180, 60, b.top, 90);
  return d;
}).join("");

/** About 44 lamps on the parapets, the palace and the ghat steps, ordered from the palace outward. */
export const AYODHYA_LAMPS: [number, number][] = [
  ...AY.flatMap((b) => [[b.x + b.w * 0.5, b.top - 4], [b.x + b.w * 0.3, b.top + 34]] as [number, number][]),
  ...Array.from({ length: 18 }, (_, i) => [30 + i * 60, AY_BASE + 14] as [number, number]),
].sort((p, q) => Math.hypot(p[0] - 540, p[1] - AY_BASE) - Math.hypot(q[0] - 540, q[1] - AY_BASE));

/** Ayodhya at night on the Saryu: domes, shikharas and the palace in silhouette, ghats, and a dark river. The
    lamps light outward from the palace (a diya wave from `at`, `step` frames apart), each with a shimmering
    reflection in the water. */
export const Ayodhya: React.FC<{ f: number; at: number; step?: number }> = ({ f, at, step = 1 }) => (
  <g>
    <defs>
      <linearGradient id="d3AySky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#04050D" />
        <stop offset="1" stopColor="#1C1638" />
      </linearGradient>
      <linearGradient id="d3AyGlow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FF9A4A" stopOpacity={0} />
        <stop offset="1" stopColor="#FF9A4A" stopOpacity={0.34} />
      </linearGradient>
      <linearGradient id="d3River" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#141A36" />
        <stop offset="1" stopColor="#05070F" />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#d3AySky)" />
    {LAND_STARS.map((st, i) => (
      <circle key={i} cx={st.x} cy={st.y} r={st.r} fill="#E8ECFF" opacity={st.o * (0.75 + 0.25 * Math.sin(f / 11 + i))} />
    ))}
    <rect x={0} y={AY_BASE - 620} width={W} height={620} fill="url(#d3AyGlow)" />
    <path d={AY_PATH} fill="#2C1D44" />
    {[0, 1, 2].map((k) => (
      <rect key={k} x={0} y={AY_BASE + k * 16} width={W} height={16} fill={k % 2 ? "#1A1228" : "#140E22"} />
    ))}
    <rect x={0} y={AY_BASE + 48} width={W} height={H - AY_BASE} fill="url(#d3River)" />
    {AYODHYA_LAMPS.map(([x, y], i) => {
      const k = ramp(f, at + i * step, at + i * step + 6, "out");
      if (k <= 0) return null;
      const ry = AY_BASE + 48 + (AY_BASE + 48 - y) * 0.7;
      return <ellipse key={i} cx={x} cy={ry} rx={4} ry={26} fill="#FFB347" opacity={0.35 * k * (0.7 + 0.3 * Math.sin(f / 5 + i))} />;
    })}
    <DiyaWave f={f} at={at} points={AYODHYA_LAMPS} step={step} scale={0.36} seed="d3ay" />
  </g>
);

const FIG = {
  body: "M-16 0C-18 -40 -14 -64 -10 -70H10C14 -64 18 -40 16 0Z",
  crown: "M-9 -92L-7 -104H7L9 -92Z",
  bow: "M20 -86C30 -60 30 -30 20 -6",
  veil: "M-12 -84C-10 -100 10 -100 12 -84L14 -60L-14 -60Z",
};

/** The Pushpak vimana: a gold flying temple (a shikhara with an amalaka and flag over a pillared pavilion on a carved
    platform), a hamsa prow and gently beating wings. Sita, Ram and Lakshman stand in the pavilion. Origin: the
    centre of the platform's top; about 460 px wide plus the wings. */
export const Vimana: React.FC<{ f: number; s?: number }> = ({ f, s = 1 }) => {
  const flap = Math.sin(f / 9) * 7;
  return (
    <g transform={`scale(${s})`}>
      <circle r={300} fill="url(#d2Flare)" opacity={0.55} />
      <g transform={`translate(-170 10) rotate(${-flap})`}>
        <path d="M0 0C-60 -40 -150 -50 -210 -20C-150 -10 -90 10 0 20Z" fill="#E8B84A" stroke="#FFE6A3" strokeWidth={2} />
      </g>
      <g transform={`translate(170 10) rotate(${flap})`}>
        <path d="M0 0C60 -40 150 -50 210 -20C150 -10 90 10 0 20Z" fill="#E8B84A" stroke="#FFE6A3" strokeWidth={2} />
      </g>
      {[-120, -40, 40, 120].map((px) => (
        <rect key={px} x={px - 6} y={-110} width={12} height={110} fill="#E8B84A" />
      ))}
      <g transform="translate(-80 0)">
        <path d={FIG.body} fill="#C8302E" />
        <circle cy={-82} r={10} fill="#D8A07A" />
        <path d={FIG.veil} fill="#E84A3A" opacity={0.9} />
      </g>
      <g>
        <path d={FIG.body} fill="#F2C230" />
        <circle cy={-82} r={11} fill="#3B5BA9" />
        <path d={FIG.crown} fill="#FFD36B" />
        <path d={FIG.bow} stroke="#8A5A12" strokeWidth={2.5} fill="none" />
      </g>
      <g transform="translate(80 0)">
        <path d={FIG.body} fill="#D9822B" />
        <circle cy={-82} r={10} fill="#D8A07A" />
        <path d={FIG.crown} fill="#FFD36B" />
        <path d={FIG.bow} stroke="#8A5A12" strokeWidth={2.5} fill="none" />
      </g>
      <path d="M-150 -110H150L130 -128H-130Z" fill="#C8952E" stroke="#FFE6A3" strokeWidth={2} />
      <path d="M-90 -128C-80 -200 -30 -300 0 -330C30 -300 80 -200 90 -128Z" fill="#E8B84A" stroke="#FFE6A3" strokeWidth={2} />
      <ellipse cx={0} cy={-336} rx={22} ry={8} fill="#F2C25A" />
      <path d="M0 -344V-380L26 -372L0 -364" fill="#FF7A2E" stroke="#C8952E" strokeWidth={2} />
      <path d="M-190 0H190L170 40H-170Z" fill="#C8952E" stroke="#FFE6A3" strokeWidth={2} />
      <path d="M-180 16H180" stroke="#8A5A12" strokeWidth={4} />
      <path d="M-190 6C-230 -10 -244 -60 -222 -84C-208 -98 -190 -88 -196 -70C-200 -56 -214 -40 -196 -20Z" fill="#F2C25A" stroke="#FFE6A3" strokeWidth={2} />
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* End-card tease (Day 4): Krishna lifts Govardhan on his little finger */
/* ------------------------------------------------------------------ */

const GV = {
  legs: "M-40 0L-30 -40C-36 -80 -44 -120 -48 -150H48C44 -120 36 -80 30 -40L40 0H16L10 -60H-10L-16 0Z",
  torso: "M-44 -150C-46 -190 -40 -220 -30 -232H30C40 -220 46 -190 44 -150Z",
  armUp: "M30 -226C44 -260 50 -330 48 -400L38 -402C38 -340 32 -276 20 -232Z",
  armDown: "M-30 -226C-50 -200 -54 -170 -40 -150L-30 -156C-40 -172 -38 -196 -22 -220Z",
  mukut: "M-16 -276L-12 -292H12L16 -276Z",
  feather: "M6 -290C10 -320 22 -336 30 -340C28 -326 20 -306 12 -288Z",
  hill: "M-196 -440C-150 -462 -60 -470 44 -462C148 -470 238 -462 284 -440C258 -560 168 -650 44 -660C-80 -650 -170 -560 -196 -440Z",
  under: "M-196 -440C-150 -462 -60 -470 44 -462C148 -470 238 -462 284 -440",
  top: "M-196 -440C-170 -560 -80 -650 44 -660C168 -650 258 -560 284 -440",
};
const GV_TREES: [number, number][] = [[-120, -560], [-60, -610], [10, -640], [80, -640], [150, -605], [210, -555]];
const GV_RAIN = Array.from({ length: 24 }, (_, i) => ({ x: i % 2 ? 300 + rnd(`gvr${i}`) * 80 : -300 + rnd(`gvl${i}`) * 90, y0: rnd(`gvy${i}`) * 700 }));
const SIL = "#120C1E";
const RIM = "#FFD36B";

const Cow: React.FC<{ x: number; flip?: boolean }> = ({ x, flip }) => (
  <g transform={`translate(${x} 0) scale(${flip ? -0.9 : 0.9} 0.9)`} fill={SIL}>
    <ellipse cx={0} cy={-34} rx={34} ry={16} />
    <circle cx={36} cy={-44} r={10} />
    <path d="M-24 -24V0M-12 -22V0M14 -22V0M26 -24V0" stroke={SIL} strokeWidth={5} />
    <path d="M30 -54L26 -64M40 -54L44 -64" stroke={RIM} strokeWidth={2} opacity={0.7} />
  </g>
);

/** Young Krishna in silhouette, gold-rimmed and moonlit, holding the whole hill aloft on his left little finger, the
    flute at his waist. Rain streaks fall at the edges; two cows and a cowherd shelter beneath. Dignified and joyful.
    Origin at Krishna's feet; about 480 x 660 at s 1. */
export const GovardhanTease: React.FC<{ f: number; x: number; y: number; s?: number }> = ({ f, x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {GV_RAIN.map((r, i) => {
      const yy = ((r.y0 + f * 14) % 700) - 700;
      return <path key={i} d={`M${r.x} ${yy}L${r.x - 8} ${yy + 36}`} stroke="#9FB4E0" strokeWidth={2} opacity={0.45} />;
    })}
    <path d={GV.hill} fill="#2F5A36" />
    {GV_TREES.map(([tx, ty], i) => (
      <circle key={i} cx={tx} cy={ty} r={18} fill="#4C8A4C" />
    ))}
    <path d={GV.top} fill="none" stroke="#C9D6F0" strokeWidth={3} opacity={0.8} />
    <path d={GV.under} fill="none" stroke={RIM} strokeWidth={4} opacity={0.8} />
    <Cow x={-140} />
    <g transform="translate(-82 0)" fill={SIL}>
      <circle cy={-52} r={8} />
      <path d="M-10 0L-8 -40H8L10 0Z" />
    </g>
    <Cow x={150} flip />
    <circle cx={0} cy={-256} r={46} fill="#FFE6A3" opacity={0.22} />
    <g fill="#2C62A8" stroke={RIM} strokeWidth={2.5} strokeLinejoin="round">
      <path d={GV.legs} />
      <path d={GV.torso} />
      <path d={GV.armUp} />
      <path d={GV.armDown} />
      <circle cx={0} cy={-256} r={24} />
      <path d={GV.mukut} />
      <path d={GV.feather} />
    </g>
    <circle cx={24} cy={-326} r={4} fill="#1F8A8A" />
    <path d="M44 -402L44 -440" stroke={SIL} strokeWidth={6} strokeLinecap="round" />
    <path d="M44 -402L44 -440" stroke={RIM} strokeWidth={1.5} strokeLinecap="round" />
    <path d="M-60 -160L20 -140" stroke="#C8952E" strokeWidth={4} strokeLinecap="round" />
  </g>
);
