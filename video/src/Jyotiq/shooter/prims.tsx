import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { ANIME } from "../bbreel/fonts";
import { SANS } from "../theme";
import { pop, ramp } from "./timing";

/* Shared anime primitives for the Shooter Reel. Line art is a warm ink,
   cel shading is one hard shadow tone + one highlight. */

export const INK = "#1B1026";
export const GOLD = "#F2C14E";
export const GOLD_D = "#B8832A";

/** Gradient / filter defs every scene can reference by id. */
export const Defs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      <linearGradient id="g-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFE9A3" />
        <stop offset="0.45" stopColor="#F2C14E" />
        <stop offset="1" stopColor="#A86E1E" />
      </linearGradient>
      <linearGradient id="g-chrome" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="0.35" stopColor="#C9D3E6" />
        <stop offset="0.55" stopColor="#6B7590" />
        <stop offset="1" stopColor="#E3E9F5" />
      </linearGradient>
      <linearGradient id="g-jq" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#E05088" />
        <stop offset="0.3" stopColor="#E86070" />
        <stop offset="0.55" stopColor="#F07858" />
        <stop offset="0.8" stopColor="#F0A048" />
        <stop offset="1" stopColor="#F0B848" />
      </linearGradient>
      <radialGradient id="g-glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#FFF4C8" stopOpacity="1" />
        <stop offset="0.4" stopColor="#FFC85A" stopOpacity="0.55" />
        <stop offset="1" stopColor="#FF9A2E" stopOpacity="0" />
      </radialGradient>
      <filter id="f-blurx" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="18 0" />
      </filter>
      <filter id="f-soft" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="10" />
      </filter>
      <filter id="f-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="14" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      {/* Shani rig gradients (also used by the squad shot) */}
      <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#FFF4C8" stopOpacity="0.95" />
        <stop offset="1" stopColor="#FFF4C8" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="scarf" x1="1" y1="0" x2="0" y2="0">
        <stop offset="0" stopColor="#2B3FA8" />
        <stop offset="0.6" stopColor="#5A2FA0" />
        <stop offset="1" stopColor="#2A1460" />
      </linearGradient>
      <linearGradient id="ringFront" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#9C8CFF" stopOpacity="0.2" />
        <stop offset="0.5" stopColor="#F2D9A0" />
        <stop offset="1" stopColor="#9C8CFF" stopOpacity="0.2" />
      </linearGradient>
    </defs>
  </svg>
);

/* ------------------------------------------------------------------ */
/* Faces                                                               */
/* ------------------------------------------------------------------ */

/** Big anime eye (local coords, centred). look = iris offset px, lid 0 open .. 1 shut. */
export const Eye: React.FC<{ x: number; y: number; w: number; h: number; iris: string; look?: [number, number]; lid?: number; flip?: boolean; glint?: number; small?: number }> = ({
  x,
  y,
  w,
  h,
  iris,
  look = [0, 0],
  lid = 0,
  flip = false,
  glint = 1,
  small = 1,
}) => {
  const hh = h * (1 - 0.92 * lid);
  const id = `eye-${Math.round(x)}-${Math.round(y)}-${iris.replace("#", "")}`;
  const sx = flip ? -1 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${sx} 1)`}>
      <defs>
        <clipPath id={id}>
          <ellipse cx={0} cy={0} rx={w / 2} ry={hh / 2} />
        </clipPath>
      </defs>
      <ellipse cx={0} cy={0} rx={w / 2} ry={hh / 2} fill="#FFFFFF" />
      <g clipPath={`url(#${id})`}>
        <ellipse cx={look[0]} cy={look[1] + h * 0.06} rx={w * 0.34 * small} ry={h * 0.42 * small} fill={iris} />
        <ellipse cx={look[0]} cy={look[1] + h * 0.18} rx={w * 0.26 * small} ry={h * 0.22 * small} fill="#000" opacity={0.25} />
        <ellipse cx={look[0]} cy={look[1] + h * 0.08} rx={w * 0.15 * small} ry={h * 0.2 * small} fill="#0A0610" />
        <ellipse cx={look[0] - w * 0.1} cy={look[1] - h * 0.12} rx={w * 0.1} ry={h * 0.12} fill="#FFFFFF" opacity={glint} />
        <circle cx={look[0] + w * 0.1} cy={look[1] + h * 0.2} r={w * 0.045} fill="#FFFFFF" opacity={0.85 * glint} />
        {/* upper lid shadow */}
        <rect x={-w} y={-hh / 2 - 4} width={w * 2} height={hh * 0.22} fill="#000" opacity={0.18} />
      </g>
      {/* lash line */}
      <path d={`M${-w * 0.56} ${-hh * 0.18} Q${-w * 0.1} ${-hh * 0.72} ${w * 0.56} ${-hh * 0.3}`} fill="none" stroke={INK} strokeWidth={Math.max(5, w * 0.1)} strokeLinecap="round" />
      <path d={`M${-w * 0.42} ${hh * 0.42} Q0 ${hh * 0.6} ${w * 0.42} ${hh * 0.4}`} fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
    </g>
  );
};

/** Aviator / star / round shades centred on (x, y), width w. */
export const Shades: React.FC<{ x: number; y: number; w: number; kind?: "aviator" | "star" | "round" | "visor"; lens?: string; frame?: string; tilt?: number }> = ({
  x,
  y,
  w,
  kind = "aviator",
  lens = "#141022",
  frame = "#E8C25A",
  tilt = 0,
}) => {
  const lx = w * 0.27;
  const r = w * 0.2;
  const lensPath = (cx: number) =>
    kind === "star"
      ? starPath(cx, 0, r * 1.25, r * 0.55, 5)
      : kind === "round"
        ? `M${cx - r} 0 A${r} ${r} 0 1 0 ${cx + r} 0 A${r} ${r} 0 1 0 ${cx - r} 0Z`
        : kind === "visor"
          ? ""
          : `M${cx - r * 1.05} ${-r * 0.55} Q${cx} ${-r * 0.8} ${cx + r * 1.05} ${-r * 0.55} Q${cx + r * 1.1} ${r * 0.9} ${cx} ${r * 0.95} Q${cx - r * 1.05} ${r * 0.85} ${cx - r * 1.05} ${-r * 0.55}Z`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
      {kind === "visor" ? (
        <>
          <path d={`M${-w * 0.52} ${-r * 0.5} Q0 ${-r * 0.9} ${w * 0.52} ${-r * 0.5} L${w * 0.46} ${r * 0.6} Q0 ${r * 0.9} ${-w * 0.46} ${r * 0.6}Z`} fill={lens} stroke={frame} strokeWidth={5} />
          <path d={`M${-w * 0.36} ${-r * 0.2} L${-w * 0.1} ${-r * 0.4}`} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
        </>
      ) : (
        <>
          <path d={`M${-lx + r * 0.9} ${-r * 0.35} Q0 ${-r * 0.7} ${lx - r * 0.9} ${-r * 0.35}`} fill="none" stroke={frame} strokeWidth={5} />
          {[-lx, lx].map((cx) => (
            <g key={cx}>
              <path d={lensPath(cx)} fill={lens} stroke={frame} strokeWidth={5} strokeLinejoin="round" />
              <path d={`M${cx - r * 0.55} ${-r * 0.25} L${cx - r * 0.1} ${-r * 0.5}`} stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.75} />
              <path d={`M${cx + r * 0.1} ${r * 0.45} L${cx + r * 0.5} ${r * 0.1}`} stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" opacity={0.45} />
            </g>
          ))}
        </>
      )}
    </g>
  );
};

export const starPath = (cx: number, cy: number, R: number, r: number, n: number, rot = -90): string => {
  let d = "";
  for (let i = 0; i < n * 2; i++) {
    const a = ((rot + (i * 180) / n) * Math.PI) / 180;
    const rr = i % 2 === 0 ? R : r;
    d += `${i === 0 ? "M" : "L"}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`;
  }
  return d + "Z";
};

/** Anime anger vein (💢) centred at (x, y). */
export const AngerVein: React.FC<{ x: number; y: number; s: number; color?: string }> = ({ x, y, s, color = "#E8283C" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round">
    <path d="M-30 -8 Q-10 -10 -8 -30" />
    <path d="M30 -8 Q10 -10 8 -30" />
    <path d="M-30 8 Q-10 10 -8 30" />
    <path d="M30 8 Q10 10 8 30" />
  </g>
);

/** Sweat drop. */
export const Sweat: React.FC<{ x: number; y: number; s: number; o?: number }> = ({ x, y, s, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <path d="M0 -34 C16 -10 22 4 22 14 A22 22 0 0 1 -22 14 C-22 4 -16 -10 0 -34Z" fill="#9FD8FF" stroke={INK} strokeWidth={4} />
    <ellipse cx={-7} cy={10} rx={5} ry={8} fill="#FFFFFF" opacity={0.8} />
  </g>
);

/* ------------------------------------------------------------------ */
/* Overlays                                                            */
/* ------------------------------------------------------------------ */

/** IG-native caption box at the top (safe zone). Words wrapped in *stars* are gold. */
export const Caption: React.FC<{ f: number; at: number; out?: number; lines: string[]; y?: number; size?: number; accent?: string }> = ({
  f,
  at,
  out = 1e9,
  lines,
  y = 196,
  size = 50,
  accent = GOLD,
}) => {
  const vin = pop(f, at, 8);
  const vout = 1 - ramp(f, out - 5, out, "in");
  const v = Math.min(vin, vout);
  if (v <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        width: 800,
        top: y,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        transform: `translateY(${(1 - vin) * -26}px) scale(${0.9 + 0.1 * vin})`,
        opacity: Math.min(1, v * 1.4),
      }}
    >
      {lines.map((ln, i) => (
        <div
          key={i}
          style={{
            background: "rgba(8,6,14,0.86)",
            borderRadius: 18,
            padding: "10px 24px 12px",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: size,
            lineHeight: 1.12,
            color: "#FFFFFF",
            textAlign: "center",
            boxShadow: "0 8px 22px rgba(0,0,0,0.35)",
          }}
        >
          {ln.split("*").map((part, j) => (
            <span key={j} style={{ color: j % 2 === 1 ? accent : "#FFFFFF" }}>
              {part}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

/** Jyotiq logo bug, top-right, inside the IG safe zone. Pulses on beats. */
export const LogoBug: React.FC<{ beat: number; o?: number }> = ({ beat, o = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: 912,
      top: 168,
      width: 136,
      height: 156,
      opacity: o,
      transform: `scale(${1 + 0.05 * beat})`,
      transformOrigin: "50% 50%",
      filter: `drop-shadow(0 0 ${10 + 18 * beat}px rgba(240,184,72,0.55)) drop-shadow(0 4px 8px rgba(0,0,0,0.6))`,
    }}
  >
    <div style={{ position: "absolute", inset: -6, borderRadius: 28, background: "rgba(8,6,14,0.55)" }} />
    <Img src={staticFile("jyotiq/logo-full.png")} style={{ position: "absolute", left: 4, top: 2, width: 128, height: 147 }} />
  </div>
);

/** Kinetic lyric / title slam with anime outline. */
export const Slam: React.FC<{ f: number; at: number; dur: number; text: string; size: number; y: number; fill?: string; stroke?: string; rot?: number; sub?: string; subColor?: string }> = ({
  f,
  at,
  dur,
  text,
  size,
  y,
  fill = "#FFFFFF",
  stroke = INK,
  rot = -4,
  sub,
  subColor = GOLD,
}) => {
  const t = f - at;
  if (t < 0 || t > dur) return null;
  const vin = ramp(f, at, at + 5, "back");
  const vout = 1 - ramp(f, at + dur - 5, at + dur, "in");
  const sc = 1.9 - 0.9 * vin + 0.04 * Math.sin(t / 2.2);
  const jit = t < 6 ? (t % 2 === 0 ? 6 : -6) : 0;
  const base: React.CSSProperties = { fontFamily: ANIME, fontSize: size, lineHeight: 1, whiteSpace: "nowrap", letterSpacing: 2 };
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", flexDirection: "column", alignItems: "center", opacity: vout, transform: `translateX(${jit}px) rotate(${rot}deg) scale(${sc})` }}>
      <div style={{ position: "relative" }}>
        <div style={{ ...base, position: "absolute", left: size * 0.07, top: size * 0.08, color: "#000", WebkitTextStroke: `${size * 0.22}px #000`, opacity: 0.55 }}>{text}</div>
        <div style={{ ...base, position: "absolute", left: 0, top: 0, color: stroke, WebkitTextStroke: `${size * 0.2}px ${stroke}` }}>{text}</div>
        <div style={{ ...base, position: "relative", color: fill }}>{text}</div>
      </div>
      {sub ? (
        <div style={{ marginTop: size * 0.22, fontFamily: SANS, fontWeight: 800, fontSize: size * 0.34, letterSpacing: 6, color: subColor, textShadow: "0 3px 0 #000, 0 0 18px rgba(0,0,0,0.8)" }}>{sub}</div>
      ) : null}
    </div>
  );
};

/** Name tag chip that pops in at `at`. */
export const NameTag: React.FC<{ f: number; at: number; x: number; y: number; name: string; tag: string; color: string; out?: number }> = ({ f, at, x, y, name, tag, color, out = 1e9 }) => {
  const v = Math.min(pop(f, at, 8), 1 - ramp(f, out - 4, out, "in"));
  if (v <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, 0) scale(${v}) rotate(${-3 + 3 * v}deg)`, transformOrigin: "50% 100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontFamily: ANIME, fontSize: 54, color: "#FFFFFF", WebkitTextStroke: `10px ${INK}`, paintOrder: "stroke fill", letterSpacing: 2, lineHeight: 1 }}>{name}</div>
      <div style={{ marginTop: 6, background: color, color: "#120B1A", fontFamily: SANS, fontWeight: 800, fontSize: 30, padding: "6px 18px", borderRadius: 14, border: `4px solid ${INK}`, whiteSpace: "nowrap" }}>{tag}</div>
    </div>
  );
};

/** Full-frame white/colour flash. */
export const Flash: React.FC<{ o: number; color?: string }> = ({ o, color = "#FFFFFF" }) =>
  o > 0.001 ? <AbsoluteFill style={{ background: color, opacity: Math.min(1, o), pointerEvents: "none" }} /> : null;

/** Vignette + subtle film grain (re-seeded per frame). */
export const Grade: React.FC<{ f: number; vig?: number; grain?: number }> = ({ f, vig = 0.55, grain = 0.06 }) => (
  <>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 62% at 50% 46%, transparent 55%, rgba(4,2,10,${vig}) 100%)`, pointerEvents: "none" }} />
    {grain > 0 ? (
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: grain, mixBlendMode: "overlay", pointerEvents: "none" }}>
        <filter id={`grain-${f % 6}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed={(f % 6) + 1} />
          <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 1.4 -0.2" />
        </filter>
        <rect width={1080} height={1920} filter={`url(#grain-${f % 6})`} />
      </svg>
    ) : null}
  </>
);
