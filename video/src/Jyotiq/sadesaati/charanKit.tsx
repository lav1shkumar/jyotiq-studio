import React from "react";
import { AbsoluteFill, Easing, interpolate, random } from "remotion";
import { loadFont as loadRozha } from "@remotion/google-fonts/RozhaOne";

/* Shared pieces for "साढ़े साती के 3 चरण" (Ep2). All times are VO seconds. */
export const FPS = 24;
export const s = (sec: number) => Math.round(sec * FPS);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ramp = (f: number, a: number, b: number, from = 0, to = 1, easing = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [a, b], [from, to], { ...clamp, easing });

export const ROZHA = loadRozha("normal", { weights: ["400"], subsets: ["devanagari", "latin"] }).fontFamily;
export const GOLD = "#E6B45A";
export const GOLD_HI = "#FFD98A";
export const CREAM = "#FFF6E2";

/* One colour per phase: मन silver-blue, तन copper, धन gold. */
export const PHASES = [
  { name: "मन", color: "#A9C8F0" },
  { name: "तन", color: "#D9895B" },
  { name: "धन", color: "#E6B45A" },
];

/* Tracker schedule: phase 1, 2, 3 start, then all three lit for "हर चरण में". */
const T_FROM = s(21.75);
const T_TO = s(56.19);
const CHANGES = [s(21.75), s(31.58), s(44.41), s(52.35)];

/** मन · तन · धन row near the top; the active phase glows in its own colour. */
export const PhaseTracker: React.FC<{ f: number }> = ({ f }) => {
  if (f < T_FROM || f > T_TO) return null;
  const vis = Math.min(ramp(f, T_FROM, T_FROM + 8, 0, 1, Easing.linear), ramp(f, T_TO - 8, T_TO, 1, 0, Easing.linear));
  const step = CHANGES.filter((c) => f >= c).length - 1; // 0,1,2 = one phase; 3 = all
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 236, display: "flex", justifyContent: "center", alignItems: "center", gap: 26, opacity: vis }}>
      {PHASES.map((p, i) => {
        const on = step === 3 || step === i;
        const since = step === 3 ? CHANGES[3] : CHANGES[i];
        const pop = on ? ramp(f, since, since + 8, 0, 1, Easing.out(Easing.back(1.6))) : 0;
        return (
          <React.Fragment key={p.name}>
            {i ? <span style={{ color: CREAM, opacity: 0.35, fontSize: 40, fontFamily: ROZHA }}>·</span> : null}
            <span
              style={{
                fontFamily: ROZHA,
                fontSize: 50,
                color: on ? p.color : CREAM,
                opacity: on ? 1 : 0.38,
                display: "inline-block",
                transform: `scale(${1 + 0.12 * pop})`,
                textShadow: on ? `0 0 22px ${p.color}, 0 2px 0 rgba(0,0,0,0.6)` : "0 2px 0 rgba(0,0,0,0.6)",
              }}
            >
              {p.name}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

/** Our own nebula plate (no Flow footage): purple/indigo clouds, twinkling stars, slow drift. */
export const NebulaPlate: React.FC<{ f: number; seed?: number }> = ({ f, seed = 7 }) => {
  const drift = f * 0.15;
  const stars = new Array(90).fill(0).map((_, i) => ({
    x: random(`nx${seed}-${i}`) * 1080,
    y: random(`ny${seed}-${i}`) * 1920,
    r: 1 + random(`nr${seed}-${i}`) * 2.4,
    o: 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(f / (5 + random(`nt${seed}-${i}`) * 9) + i)),
  }));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(120% 85% at 50% 42%, #2E1A5E 0%, #170D3A 50%, #07041A 100%)", overflow: "hidden" }}>
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", left: 0, top: 0, opacity: 0.8, transform: `translate(${-drift * 0.4}px, ${-drift}px) scale(1.15)` }}
      >
        <filter id={`neb${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.0022 0.0032" numOctaves={5} seed={seed} />
          <feColorMatrix type="matrix" values="0.55 0 0 0 0.05  0.25 0 0 0 0.02  0.95 0 0 0 0.12  1.8 0 0 0 -0.6" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#neb${seed})`} />
      </svg>
      {stars.map((st, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: st.x,
            top: st.y,
            width: st.r,
            height: st.r,
            borderRadius: "50%",
            background: "#fff",
            opacity: st.o * 0.8,
            boxShadow: `0 0 ${st.r * 3}px rgba(255,255,255,0.7)`,
          }}
        />
      ))}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 62% at 50% 46%, transparent 55%, rgba(4,2,14,0.45) 100%)" }} />
    </AbsoluteFill>
  );
};
