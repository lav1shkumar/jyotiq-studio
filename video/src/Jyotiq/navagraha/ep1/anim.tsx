import React from "react";
import { Easing, interpolate } from "remotion";
import { CAP_BOTTOM, CAP_TOP, GRAD, JAKARTA, MUKTA, NameChip, PANEL, S, gradText } from "./look";
import { PHRASES, WORDS } from "./timing";

/*
 * नवग्रह जन्म Ep1 motion kit: camera, shake, flashes, karaoke captions, animated chips and the particle /
 * graphic pieces used by Episode1.tsx. Everything is a pure function of the frame (seeded noise only).
 */

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const prog = (f: number, a: number, b: number, ease: (t: number) => number = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
export const outBack = Easing.out(Easing.back(1.6));
export const outCubic = Easing.out(Easing.cubic);
export const inCubic = Easing.in(Easing.cubic);
export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

export const rnd = (i: number, k: number) => {
  const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
/** Smooth 1-D value noise in [-1, 1]. */
export const vnoise = (t: number, seed: number) => {
  const i = Math.floor(t);
  const u = t - i;
  const a = rnd(i, seed) * 2 - 1;
  const b = rnd(i + 1, seed) * 2 - 1;
  const s = u * u * (3 - 2 * u);
  return a + (b - a) * s;
};

/** Decaying camera shake from a list of hit frames. */
export const shakeAt = (f: number, hits: number[], amp = 18, dur = 14) => {
  let x = 0;
  let y = 0;
  for (const h of hits) {
    const t = f - h;
    if (t < 0 || t > dur) continue;
    const k = Math.pow(1 - t / dur, 2) * amp;
    x += vnoise(t * 1.7, h) * k;
    y += vnoise(t * 1.7, h + 99) * k;
  }
  return { x, y };
};

/** SVG camera: eased push (s0 -> s1) about (cx, cy) over [a, b], with drift (dx, dy), handheld breathing and shake. */
export const Cam: React.FC<{
  f: number;
  a: number;
  b: number;
  cx: number;
  cy: number;
  s0?: number;
  s1?: number;
  dx?: number;
  dy?: number;
  hits?: number[];
  amp?: number;
  children: React.ReactNode;
}> = ({ f, a, b, cx, cy, s0 = 1, s1 = 1.05, dx = 0, dy = 0, hits = [], amp = 18, children }) => {
  const u = prog(f, a, b, Easing.inOut(Easing.sin));
  const s = lerp(s0, s1, u);
  const sh = shakeAt(f, hits, amp);
  const bx = vnoise(f / 45, 7) * 3;
  const by = vnoise(f / 50, 11) * 3;
  return <g transform={`translate(${cx + dx * u + sh.x + bx} ${cy + dy * u + sh.y + by}) scale(${s}) translate(${-cx} ${-cy})`}>{children}</g>;
};

/** Full-frame flash peaking at `at`. */
export const Flash: React.FC<{ f: number; at: number; color?: string; peak?: number; rise?: number; fall?: number }> = ({ f, at, color = "#FFF8EE", peak = 0.9, rise = 2, fall = 10 }) => {
  const o = interpolate(f, [at - rise, at, at + fall], [0, peak, 0], clamp);
  if (o <= 0.001) return null;
  return <div style={{ position: "absolute", inset: 0, background: color, opacity: o }} />;
};

/** HTML pop-in / pop-out wrapper (absolute children keep their own positions). */
export const Pop: React.FC<{ f: number; at: number; out?: number; from?: "scale" | "left" | "up" | "right"; origin?: string; children: React.ReactNode }> = ({
  f,
  at,
  out = 1e9,
  from = "scale",
  origin = "50% 50%",
  children,
}) => {
  if (f < at || f > out + 8) return null;
  const i = prog(f, at, at + 12, outBack);
  const o = Math.min(prog(f, at, at + 5, outCubic), 1 - prog(f, out, out + 7, outCubic));
  const tr =
    from === "left" ? `translateX(${(1 - i) * -560}px)` : from === "right" ? `translateX(${(1 - i) * 560}px)` : from === "up" ? `translateY(${(1 - i) * 160}px)` : `scale(${0.6 + 0.4 * i})`;
  return <div style={{ position: "absolute", inset: 0, opacity: o, transform: tr, transformOrigin: origin }}>{children}</div>;
};

export const NameChipIn: React.FC<{ f: number; at: number; out: number; hi: string; en: string; tag: string; y: number; icon?: string; x?: number }> = ({ f, at, out, ...p }) => (
  <Pop f={f} at={at} out={out} from="left">
    <NameChip {...p} />
  </Pop>
);

/* ------------------------------------------------------------------ */
/* Karaoke captions                                                    */
/* ------------------------------------------------------------------ */

const KEY = new Set(["परछाईं।", "सूर्य।", "सूर्य", "संज्ञा।", "तेज", "छाया,", "छाया", "श्राप", "विश्वकर्मा", "प्रेम", "शनि।", "कुंडली", "ज्योतिक़", "फ़्री", "यम", "तप"]);

/** Bottom caption: one phrase per page, every word visible; the spoken word sits on the saffron gradient. */
export const KCaption: React.FC<{ f: number; hide?: number[]; bottom?: number }> = ({ f, hide = [], bottom = CAP_BOTTOM }) => {
  let pi = -1;
  for (let i = 0; i < PHRASES.length; i++) {
    const p = PHRASES[i];
    const next = PHRASES[i + 1];
    const end = Math.min(next ? next.a - 2 : 1e9, p.b + 16);
    if (f >= p.a - 2 && f < end) pi = i;
  }
  if (pi < 0 || hide.includes(pi)) return null;
  const P = PHRASES[pi];
  const ws = WORDS.filter((w) => w.p === pi);
  const pop = prog(f, P.a - 2, P.a + 5, outBack);
  const nextA = PHRASES[pi + 1] ? PHRASES[pi + 1].a - 2 : 1e9;
  const fadeOut = 1 - prog(f, Math.min(P.b + 10, nextA - 4), Math.min(P.b + 16, nextA), outCubic);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: CAP_TOP, height: bottom - CAP_TOP, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div
        style={{
          maxWidth: 860,
          padding: "16px 26px 20px",
          borderRadius: 30,
          background: "rgba(255,255,255,0.95)",
          border: `2.5px solid ${S.goldLight}`,
          boxShadow: "0 10px 26px rgba(58,31,18,0.22)",
          textAlign: "center",
          fontFamily: MUKTA,
          fontWeight: 700,
          fontSize: 50,
          lineHeight: 1.3,
          color: S.brown,
          opacity: Math.min(1, pop * 1.4) * fadeOut,
          transform: `scale(${0.88 + 0.12 * pop})`,
          transformOrigin: "50% 100%",
        }}
      >
        {ws.map((w, i) => {
          const cur = f >= w.a - 1 && f < (ws[i + 1] ? ws[i + 1].a - 1 : w.b + 12);
          const said = f >= w.a - 1;
          const key = KEY.has(w.w);
          const k = cur ? prog(f, w.a - 1, w.a + 3, outBack) : 0;
          return (
            <React.Fragment key={i}>
              <span
                style={{
                  display: "inline-block",
                  padding: "0 8px",
                  margin: "2px 0",
                  borderRadius: 14,
                  background: cur ? GRAD : "transparent",
                  color: cur ? "#FFFFFF" : undefined,
                  opacity: said ? 1 : 0.45,
                  transform: `scale(${1 + 0.08 * k})`,
                  boxShadow: cur ? "0 6px 14px rgba(224,72,43,0.35)" : undefined,
                  ...(key && !cur ? { ...gradText, fontWeight: 800 } : {}),
                }}
              >
                {w.w}
              </span>{" "}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Particles and graphics (SVG)                                        */
/* ------------------------------------------------------------------ */

/** Falling lotus petals across the frame. */
export const Petals: React.FC<{ f: number; n?: number; o?: number; seed?: number; color?: string }> = ({ f, n = 16, o = 1, seed = 1, color = S.lotus }) => (
  <g opacity={o}>
    {Array.from({ length: n }, (_, i) => {
      const x0 = rnd(i, seed) * 1080;
      const sp = 1.6 + rnd(i, seed + 1) * 2.2;
      const y = ((rnd(i, seed + 2) * 2200 + f * sp) % 2200) - 200;
      const x = x0 + Math.sin(f / 30 + i) * 40;
      const r = f * (1 + rnd(i, seed + 3) * 2) + i * 40;
      const s = 0.7 + rnd(i, seed + 4) * 0.8;
      return <path key={i} d="M0 -18C10 -8 10 8 0 18C-10 8 -10 -8 0 -18Z" transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} fill={i % 3 ? color : "#FFE3EC"} opacity={0.85} />;
    })}
  </g>
);

/** Rising motes (violet for Chhaya, gold for tej). */
export const Motes: React.FC<{ f: number; x: number; y: number; w: number; h: number; n?: number; o?: number; color?: string; seed?: number }> = ({
  f,
  x,
  y,
  w,
  h,
  n = 24,
  o = 1,
  color = "#B99BFF",
  seed = 5,
}) => (
  <g opacity={o}>
    {Array.from({ length: n }, (_, i) => {
      const sp = 2 + rnd(i, seed) * 4;
      const py = y + h - ((rnd(i, seed + 1) * h + f * sp) % h);
      const px = x + rnd(i, seed + 2) * w + Math.sin(f / 14 + i) * 12;
      const r = 3 + rnd(i, seed + 3) * 6;
      const tw = 0.5 + 0.5 * Math.sin(f / 5 + i * 2);
      return <circle key={i} cx={px} cy={py} r={r} fill={color} opacity={0.4 + 0.6 * tw} />;
    })}
  </g>
);

/** Sparks spraying from a point (the lathe grinding tej). */
export const Sparks: React.FC<{ f: number; x: number; y: number; n?: number; k?: number; dir?: number; spread?: number }> = ({ f, x, y, n = 40, k = 1, dir = -30, spread = 70 }) => (
  <g opacity={k}>
    {Array.from({ length: n }, (_, i) => {
      const life = 14 + rnd(i, 3) * 10;
      const t = (f + rnd(i, 4) * life) % life;
      const u = t / life;
      const ang = ((dir + (rnd(i, 5) - 0.5) * spread) * Math.PI) / 180;
      const v = 18 + rnd(i, 6) * 26;
      const px = x + Math.cos(ang) * v * t;
      const py = y + Math.sin(ang) * v * t + 0.9 * t * t;
      const L = 18 + rnd(i, 7) * 22;
      return (
        <line
          key={i}
          x1={px}
          y1={py}
          x2={px - Math.cos(ang) * L}
          y2={py - Math.sin(ang) * L + 2 * t}
          stroke={i % 4 ? "#FFE58F" : "#FFFFFF"}
          strokeWidth={4 + 3 * (1 - u)}
          strokeLinecap="round"
          opacity={1 - u}
        />
      );
    })}
  </g>
);

/** Truth breaking open: violet-white cracks drawing outward from a point. */
export const Cracks: React.FC<{ f: number; at: number; x: number; y: number; n?: number }> = ({ f, at, x, y, n = 11 }) => {
  const u = prog(f, at, at + 8, outCubic);
  const o = 1 - prog(f, at + 14, at + 26);
  if (u <= 0 || o <= 0) return null;
  return (
    <g opacity={o}>
      {Array.from({ length: n }, (_, i) => {
        const a0 = (i / n) * Math.PI * 2 + rnd(i, 21) * 0.4;
        let px = x;
        let py = y;
        let d = `M${x} ${y}`;
        for (let s = 1; s <= 5; s++) {
          const a = a0 + (rnd(i * 7 + s, 22) - 0.5) * 0.7;
          const L = 60 + rnd(i * 7 + s, 23) * 90;
          px += Math.cos(a) * L;
          py += Math.sin(a) * L;
          d += `L${px} ${py}`;
        }
        return (
          <g key={i}>
            <path d={d} stroke="#B99BFF" strokeWidth={14} fill="none" pathLength={1} strokeDasharray={`${u} 1`} opacity={0.35} filter="url(#nvBlur6)" />
            <path d={d} stroke="#FFFFFF" strokeWidth={4} fill="none" pathLength={1} strokeDasharray={`${u} 1`} />
          </g>
        );
      })}
    </g>
  );
};

/** The curse travelling from the hand to Yama: a violet coil drawn over [a, b], impact bloom at b. */
export const CurseBolt: React.FC<{ f: number; a: number; b: number; x0: number; y0: number; x1: number; y1: number }> = ({ f, a, b, x0, y0, x1, y1 }) => {
  const u = prog(f, a, b, Easing.inOut(Easing.quad));
  if (f < a) return null;
  const fade = 1 - prog(f, b + 18, b + 34);
  const N = 22;
  const pts = Array.from({ length: N + 1 }, (_, i) => {
    const v = (i / N) * u;
    return [x0 + (x1 - x0) * v, y0 + (y1 - y0) * v + Math.sin(v * 11 + f * 0.35) * 28 * (1 - v * 0.4)] as const;
  });
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("");
  const hit = interpolate(f, [b - 1, b + 3, b + 22], [0, 1, 0], clamp);
  const head = pts[pts.length - 1];
  return (
    <g opacity={fade}>
      <path d={d} stroke="#4A3A78" strokeWidth={40} fill="none" strokeLinecap="round" opacity={0.4} filter="url(#nvBlur6)" />
      <path d={d} stroke="#7B66C9" strokeWidth={13} fill="none" strokeLinecap="round" />
      <path d={d} stroke="#E4DAFF" strokeWidth={4} fill="none" strokeLinecap="round" />
      <circle cx={head[0]} cy={head[1]} r={26} fill="#E4DAFF" opacity={u < 1 ? 0.9 : 0} filter="url(#nvBlur6)" />
      <circle cx={x1} cy={y1} r={60 + 160 * hit} fill="url(#nvViolet)" opacity={hit} />
      <circle cx={x1} cy={y1} r={30 + 120 * hit} fill="none" stroke="#E4DAFF" strokeWidth={6} opacity={hit} />
    </g>
  );
};

/** Saturn's rings and a cool halo for Shani's reveal. */
export const SaturnHalo: React.FC<{ f: number; at: number; x: number; y: number; r?: number }> = ({ f, at, x, y, r = 170 }) => {
  const u = prog(f, at - 4, at + 14, outBack);
  if (u <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${u})`} opacity={Math.min(1, u)}>
      <circle r={r * 1.5} fill="#8FA8FF" opacity={0.18} filter="url(#nvBlur20)" />
      <g transform={`rotate(-16) rotate(${(f - at) * 0.4})`}>
        <ellipse rx={r * 1.25} ry={r * 0.32} fill="none" stroke="#C9D3FF" strokeWidth={6} opacity={0.75} />
        <ellipse rx={r * 1.45} ry={r * 0.38} fill="none" stroke="#9AA9E8" strokeWidth={3} opacity={0.6} strokeDasharray="18 14" />
      </g>
    </g>
  );
};

/** North-Indian kundali chart drawn over [at, at + 24]; the sun hops between houses and settles with a glow. */
export const KUNDALI_HOUSES: [number, number][] = [
  [0.5, 0.25], [0.25, 0.1], [0.1, 0.25], [0.25, 0.5], [0.1, 0.75], [0.25, 0.9], [0.5, 0.75], [0.75, 0.9], [0.9, 0.75], [0.75, 0.5], [0.9, 0.25], [0.75, 0.1],
];
export const Kundali: React.FC<{ f: number; at: number; x: number; y: number; size: number; hops: { at: number; house: number }[] }> = ({ f, at, x, y, size, hops }) => {
  const u = prog(f, at, at + 24, Easing.inOut(Easing.cubic));
  const s = size;
  const L = (d: string, w = 6, c: string = S.goldDeep) => <path d={d} stroke={c} strokeWidth={w} fill="none" pathLength={1} strokeDasharray={`${u} 1`} strokeLinecap="round" />;
  // the sun's position: eased between successive hops
  let hx = KUNDALI_HOUSES[hops[0].house][0];
  let hy = KUNDALI_HOUSES[hops[0].house][1];
  for (let i = 1; i < hops.length; i++) {
    const v = prog(f, hops[i].at - 7, hops[i].at, Easing.inOut(Easing.cubic));
    if (v > 0) {
      const [px, py] = KUNDALI_HOUSES[hops[i - 1].house];
      const [nx, ny] = KUNDALI_HOUSES[hops[i].house];
      hx = lerp(px, nx, v);
      hy = lerp(py, ny, v) - Math.sin(v * Math.PI) * 0.08;
    }
  }
  const sunIn = prog(f, hops[0].at - 6, hops[0].at + 4, outBack);
  const settle = hops[hops.length - 1].at;
  const glow = prog(f, settle, settle + 10) * (0.75 + 0.25 * Math.sin((f - settle) / 4));
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-12} y={-12} width={s + 24} height={s + 24} rx={28} fill="#FFFFFF" opacity={0.9 * Math.min(1, u * 3)} stroke={S.goldLight} strokeWidth={4} />
      <rect x={0} y={0} width={s} height={s} fill="#FFF6E2" opacity={Math.min(1, u * 3)} />
      {L(`M0 0L${s} 0L${s} ${s}L0 ${s}Z`, 8)}
      {L(`M0 0L${s} ${s}M${s} 0L0 ${s}`)}
      {L(`M${s / 2} 0L${s} ${s / 2}L${s / 2} ${s}L0 ${s / 2}Z`)}
      {KUNDALI_HOUSES.map(([hx2, hy2], i) => (
        <text key={i} x={hx2 * s} y={hy2 * s + 12} textAnchor="middle" fontFamily={JAKARTA} fontWeight={700} fontSize={30} fill={S.brownMid} opacity={0.35 * prog(f, at + 14 + i, at + 20 + i)}>
          {i + 1}
        </text>
      ))}
      {sunIn > 0 ? (
        <g transform={`translate(${hx * s} ${hy * s - 6}) scale(${sunIn})`}>
          <circle r={86} fill="url(#nvWarm)" opacity={0.6 + 0.4 * glow} />
          <g transform={`rotate(${f * 1.5})`}>
            {Array.from({ length: 12 }, (_, i) => (
              <path key={i} d="M-6 -40L0 -64L6 -40Z" fill="#F5A623" transform={`rotate(${i * 30})`} />
            ))}
          </g>
          <circle r={38} fill="url(#nvSunCore)" stroke="#E8A93A" strokeWidth={3} />
          <text y={13} textAnchor="middle" fontFamily={MUKTA} fontWeight={800} fontSize={38} fill={S.brown}>
            सू
          </text>
          {glow > 0.02 ? <circle r={100} fill="none" stroke={S.saffron} strokeWidth={5} opacity={glow} strokeDasharray="10 10" transform={`rotate(${-f * 2})`} /> : null}
        </g>
      ) : null}
    </g>
  );
};

/** The world bowing to the tej: rows of silhouettes on a horizon bending forward over [a, b]. */
export const BowingWorld: React.FC<{ f: number; a: number; b: number; y: number }> = ({ f, a, b, y }) => {
  const people = (row: number, n: number, yy: number, s: number, col: string) =>
    Array.from({ length: n }, (_, i) => {
      const x = (i + 0.5) * (1080 / n) + (rnd(i, row) - 0.5) * 30;
      const d0 = a + row * 4 + rnd(i, row + 9) * 18;
      const bow = prog(f, d0, d0 + 26, Easing.inOut(Easing.cubic)) * (0.88 + 0.12 * Math.sin(f / 9 + i)) * 0.95;
      const ang = bow * 58;
      return (
        <g key={`${row}-${i}`} transform={`translate(${x} ${yy}) scale(${s})`}>
          <path d="M-16 0L-12 -70L12 -70L16 0Z" fill={col} />
          <g transform={`translate(0 -66) rotate(${ang * (i % 2 ? 1 : 1)})`}>
            <path d="M-18 0C-20 -40 -16 -70 0 -80C16 -70 20 -40 18 0Z" fill={col} />
            <circle cx={0} cy={-98} r={20} fill={col} />
            <path d="M-14 -66C-30 -40 -24 -20 -4 -18M14 -66C30 -40 24 -20 4 -18" stroke={col} strokeWidth={10} fill="none" strokeLinecap="round" />
          </g>
        </g>
      );
    });
  const treeBend = prog(f, a + 6, b, Easing.inOut(Easing.cubic)) * 8;
  return (
    <g>
      <path d={`M0 ${y - 40}C220 ${y - 90} 380 ${y - 60} 560 ${y - 100}C760 ${y - 130} 920 ${y - 70} 1080 ${y - 90}L1080 1920L0 1920Z`} fill="#E9B76E" />
      {[90, 990].map((x, i) => (
        <g key={x} transform={`translate(${x} ${y - 60}) rotate(${(i ? -1 : 1) * treeBend})`}>
          <rect x={-10} y={-160} width={20} height={170} fill="#8A5A2B" />
          <circle cx={0} cy={-200} r={80} fill="#A67A3D" />
        </g>
      ))}
      {people(0, 7, y + 10, 1.15, "#B27A3E")}
      <path d={`M0 ${y + 40}L1080 ${y + 40}L1080 1920L0 1920Z`} fill="#D9A15A" />
      {people(1, 6, y + 210, 1.45, "#8A5427")}
      <path d={`M0 ${y + 240}L1080 ${y + 240}L1080 1920L0 1920Z`} fill="#C88A48" />
    </g>
  );
};

/** The nine grahas as a progress row; the first (Surya) lit. */
const GRAHA = ["#F5A623", "#E8E4D8", "#E0482B", "#6E9B3A", "#F2C14E", "#F49AB4", "#2E3A66", "#5B4A8A", "#8C6B4A"];
export const GrahaRow: React.FC<{ f: number; at: number; y: number; lit?: number; label?: string }> = ({ f, at, y, lit = 0, label = "1 / 9" }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", alignItems: "center", gap: 14 }}>
    {GRAHA.map((c, i) => {
      const k = prog(f, at + i * 2, at + i * 2 + 10, outBack);
      const on = i === lit;
      const pulse = on ? 1 + 0.12 * Math.sin(f / 5) : 1;
      return (
        <div
          key={i}
          style={{
            width: on ? 40 : 26,
            height: on ? 40 : 26,
            borderRadius: 20,
            background: c,
            opacity: on ? 1 : 0.5,
            border: `3px solid ${on ? "#FFFFFF" : "rgba(255,255,255,0.7)"}`,
            boxShadow: on ? `0 0 22px 6px ${c}` : "0 3px 6px rgba(58,31,18,0.2)",
            transform: `scale(${k * pulse})`,
          }}
        />
      );
    })}
    <div style={{ marginLeft: 10, fontFamily: JAKARTA, fontWeight: 800, fontSize: 26, color: S.brownMid, opacity: prog(f, at + 18, at + 26) }}>{label}</div>
  </div>
);

/** A gold glow pulse around the fixed app panel (it never moves; only the ring breathes) for the CTA. */
export const PanelPulse: React.FC<{ f: number; a: number; b: number }> = ({ f, a, b }) => {
  const o = Math.min(prog(f, a, a + 8), 1 - prog(f, b - 8, b));
  if (o <= 0) return null;
  const p = (f - a) % 24;
  const ring = p / 24;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: PANEL.x - 10 - ring * 18,
          top: PANEL.y - 10 - ring * 18,
          width: PANEL.w + 20 + ring * 36,
          height: PANEL.h + 20 + ring * 36,
          borderRadius: 38 + ring * 10,
          border: `5px solid ${S.saffron}`,
          opacity: o * (1 - ring),
        }}
      />
      <div style={{ position: "absolute", left: PANEL.x - 6, top: PANEL.y - 6, width: PANEL.w + 12, height: PANEL.h + 12, borderRadius: 34, boxShadow: `0 0 36px 10px rgba(242,140,40,${0.55 * o})` }} />
    </>
  );
};

/** A curved arrow from a point to the app panel ("download here"), drawn on over [a, a + 12]. */
export const PanelArrow: React.FC<{ f: number; a: number; b: number; x0: number; y0: number; label: string }> = ({ f, a, b, x0, y0, label }) => {
  const u = prog(f, a, a + 12, outCubic);
  const o = 1 - prog(f, b - 6, b);
  if (u <= 0 || o <= 0) return null;
  const x1 = PANEL.x + PANEL.w * 0.42;
  const y1 = PANEL.y + PANEL.h + 22;
  const bob = Math.sin(f / 4) * 6;
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: o }}>
        <path
          d={`M${x0} ${y0}C${x0 + 40} ${y0 - 120} ${x1 - 160} ${y1 + 80} ${x1} ${y1 + bob}`}
          stroke={S.red}
          strokeWidth={9}
          fill="none"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={`${u} 1`}
        />
        {u > 0.95 ? <path d={`M${x1 - 26} ${y1 + 22 + bob}L${x1} ${y1 + bob}L${x1 + 8} ${y1 + 32 + bob}`} stroke={S.red} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
      </svg>
      <div
        style={{
          position: "absolute",
          left: x0 - 200,
          top: y0 + 6,
          width: 400,
          textAlign: "center",
          opacity: o * prog(f, a + 4, a + 12),
          fontFamily: MUKTA,
          fontWeight: 800,
          fontSize: 38,
          color: S.red,
        }}
      >
        {label}
      </div>
    </>
  );
};
