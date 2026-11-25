import React from "react";
import { RahuHead } from "../ep2/beings3";
import { talk7 } from "./kit7";

/*
 * Episode 7 new art (no Episode 1-6 file is edited). Colours follow the Episode 2 RahuRise eclipse
 * motif: dark disc #0A0612 with a gold rim #FFD27A, gold rays and an orange glow #FFB23D.
 *  - EclipseSun: the bright sun with its corona; a dark disc slides across it (cover 0..1) and at
 *    totality only the gold rim and the corona remain; `ring` fires the diamond-ring flare.
 *  - SudarshanChakra: Vishnu's spinning disc, gold with flame teeth.
 *  - GrahaOrb: a graha as a dark orb with a coloured rim and an optional comet tail (Ketu). The glyph
 *    (रा / के) is passed as children so it uses the series' caption font from the gfx layer.
 */

export const EclipseSun: React.FC<{
  id: string;
  f: number;
  x: number;
  y: number;
  r: number;
  cover: number; // 0 = full bright sun .. 1 = total eclipse
  ring?: number; // diamond-ring flare 0..1
  from?: number; // direction the dark disc slides in from (deg, 0 = from the right)
}> = ({ id, f, x, y, r, cover, ring = 0, from = -20 }) => {
  const c = Math.max(0, Math.min(1, cover));
  const a = (from * Math.PI) / 180;
  const off = (1 - c) * 2.15 * r;
  const dx = x + Math.cos(a) * off;
  const dy = y + Math.sin(a) * off;
  const bright = 1 - 0.75 * c;
  const corona = 0.35 + 0.65 * c;
  // diamond ring sits on the sun's rim opposite the disc's last gap
  const rx = x - Math.cos(a) * r * 0.98;
  const ry = y - Math.sin(a) * r * 0.98;
  const fl = Math.max(0, Math.min(1, ring)) * (0.85 + 0.15 * Math.sin(f / 3));
  return (
    <g>
      <defs>
        <radialGradient id={`es-core-${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFFBEA" />
          <stop offset="0.55" stopColor="#FFE7A0" />
          <stop offset="0.85" stopColor="#FFD27A" />
          <stop offset="1" stopColor="#FFB23D" />
        </radialGradient>
        <radialGradient id={`es-halo-${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.3" stopColor="#FFB23D" stopOpacity={0.55} />
          <stop offset="1" stopColor="#FFB23D" stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* halo */}
      <circle cx={x} cy={y} r={r * 2.6} fill={`url(#es-halo-${id})`} opacity={0.5 + 0.5 * bright} />
      <circle cx={x} cy={y} r={r * 1.35} fill="#FFB23D" opacity={0.35 * bright + 0.15} filter="url(#mBlur8)" />
      {/* corona rays (the Episode 2 ray shape, two counter-rotating rings) */}
      <g transform={`translate(${x} ${y}) rotate(${f * 0.4})`} opacity={0.5 * corona}>
        {Array.from({ length: 16 }, (_, i) => (
          <path key={i} d={`M0 ${-r * 1.07}L${r * 0.035} ${-r * 1.5}L0 ${-r * 1.65}L${-r * 0.035} ${-r * 1.5}Z`} fill="#FFD27A" transform={`rotate(${i * 22.5})`} />
        ))}
      </g>
      <g transform={`translate(${x} ${y}) rotate(${-f * 0.25 + 11})`} opacity={0.32 * corona}>
        {Array.from({ length: 16 }, (_, i) => (
          <path key={i} d={`M0 ${-r * 1.04}L${r * 0.025} ${-r * 1.32}L0 ${-r * 1.42}L${-r * 0.025} ${-r * 1.32}Z`} fill="#FFF1C2" transform={`rotate(${i * 22.5})`} />
        ))}
      </g>
      {/* the sun */}
      <circle cx={x} cy={y} r={r} fill={`url(#es-core-${id})`} />
      {/* the dark disc (Rahu's shadow), clipped visually by drawing it on top */}
      {c > 0.001 ? (
        <g>
          <circle cx={dx} cy={dy} r={r * 1.2} fill="#3A2160" opacity={0.35 * (1 - 0.6 * c)} filter="url(#mBlur8)" />
          <circle cx={dx} cy={dy} r={r * 1.01} fill="#0A0612" />
          <circle cx={dx} cy={dy} r={r * 1.01} fill="none" stroke="#FFD27A" strokeWidth={Math.max(0.5, 5 * c * c)} opacity={0.4 + 0.6 * c} />
        </g>
      ) : null}
      {/* diamond-ring flare */}
      {fl > 0.01 ? (
        <g transform={`translate(${rx} ${ry})`} opacity={fl}>
          <circle r={r * 0.22} fill="#FFFFFF" opacity={0.85} filter="url(#mBlur8)" />
          <circle r={r * 0.07} fill="#FFFFFF" />
          <path d={`M${-r * 0.9} 0L0 ${-r * 0.03}L${r * 0.9} 0L0 ${r * 0.03}Z`} fill="#FFFFFF" opacity={0.9} />
          <path d={`M0 ${-r * 0.6}L${r * 0.025} 0L0 ${r * 0.6}L${-r * 0.025} 0Z`} fill="#FFFFFF" opacity={0.75} />
          <path d={`M0 ${-r * 0.35}L${r * 0.02} 0L0 ${r * 0.35}L${-r * 0.02} 0Z`} fill="#FFF1C2" opacity={0.6} transform="rotate(45)" />
          <path d={`M0 ${-r * 0.35}L${r * 0.02} 0L0 ${r * 0.35}L${-r * 0.02} 0Z`} fill="#FFF1C2" opacity={0.6} transform="rotate(-45)" />
        </g>
      ) : null}
    </g>
  );
};

/** Vishnu's Sudarshan chakra. Origin = hub. spin in degrees; glow 0..1; s = scale (radius ~ 90 px at s = 1). */
export const SudarshanChakra: React.FC<{ x: number; y: number; s?: number; spin: number; glow?: number; o?: number }> = ({
  x, y, s = 1, spin, glow = 1, o = 1,
}) => {
  if (o <= 0.01) return null;
  const R = 90;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <circle r={R * 1.9} fill="#FFD27A" opacity={0.28 * glow} filter="url(#mBlur8)" />
      <circle r={R * 1.25} fill="#FFF1C2" opacity={0.35 * glow} filter="url(#mBlur8)" />
      <g transform={`rotate(${spin})`}>
        {/* flame teeth */}
        {Array.from({ length: 12 }, (_, i) => (
          <path
            key={i}
            d={`M${-R * 0.2} ${-R * 0.93}C${-R * 0.18} ${-R * 1.18} ${R * 0.05} ${-R * 1.22} ${R * 0.12} ${-R * 1.42}C${R * 0.2} ${-R * 1.2} ${R * 0.26} ${-R * 1.05} ${R * 0.2} ${-R * 0.93}Z`}
            fill={i % 2 ? "#FFB23D" : "#FFD27A"}
            stroke="#FFF1C2"
            strokeWidth={2}
            transform={`rotate(${i * 30})`}
          />
        ))}
        {/* rim, inner ring and spokes */}
        <circle r={R} fill="#E8A93A" stroke="#FFF1C2" strokeWidth={5} />
        <circle r={R * 0.78} fill="#8A4A12" />
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d={`M${-R * 0.06} 0L0 ${-R * 0.76}L${R * 0.06} 0Z`} fill="#FFD27A" transform={`rotate(${i * 45 + 22.5})`} />
        ))}
        <circle r={R * 0.78} fill="none" stroke="#FFD27A" strokeWidth={4} />
        <circle r={R * 0.24} fill="#FFD27A" stroke="#FFF1C2" strokeWidth={3} />
        <circle r={R * 0.09} fill="#C8341E" />
      </g>
      {/* motion streak ring */}
      <circle r={R * 1.12} fill="none" stroke="#FFFFFF" strokeWidth={3} strokeDasharray="40 70" strokeDashoffset={-spin * 1.5} opacity={0.55 * glow} />
    </g>
  );
};

/**
 * A graha as a dark orb with a coloured rim and a soft pulse. tail > 0 adds a comet tail (Ketu)
 * pointing at `tailDeg` (0 = right). The glyph comes in as children, centred on the orb.
 */
export const GrahaOrb: React.FC<{
  x: number;
  y: number;
  r: number;
  f: number;
  rim: string;
  k?: number;
  tail?: number;
  tailDeg?: number;
  children?: React.ReactNode;
}> = ({ x, y, r, f, rim, k = 1, tail = 0, tailDeg = 150, children }) => {
  if (k <= 0.01) return null;
  const pulse = 0.85 + 0.15 * Math.sin(f / 10);
  const L = tail * r * 4.2;
  return (
    <g transform={`translate(${x} ${y})`} opacity={k}>
      {tail > 0.01 ? (
        <g transform={`rotate(${tailDeg})`}>
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M0 ${-r * (0.85 - i * 0.2)}C${L * 0.4} ${-r * (0.9 - i * 0.25)} ${L * 0.75} ${-r * 0.35} ${L} ${(i - 1) * r * 0.25}C${L * 0.75} ${r * 0.35} ${L * 0.4} ${r * (0.9 - i * 0.25)} 0 ${r * (0.85 - i * 0.2)}Z`}
              fill={i === 0 ? "#2A1B44" : i === 1 ? rim : "#FFF1C2"}
              opacity={[0.55, 0.35, 0.25][i]}
              filter={i === 0 ? "url(#mBlur8)" : undefined}
            />
          ))}
        </g>
      ) : null}
      <circle r={r * 1.55} fill={rim} opacity={0.25 * pulse} filter="url(#mBlur8)" />
      <circle r={r} fill="#140C22" stroke={rim} strokeWidth={Math.max(3, r * 0.06)} />
      <circle r={r * 0.84} fill="none" stroke={rim} strokeWidth={2} opacity={0.45} />
      {children}
    </g>
  );
};

/**
 * Rahu's living head (the series' own RahuHead from Episode 2: Swarbhanu's puppet cut at the neck with
 * smoke below). Lip-sync comes from the Episode 7 voice envelope of `line`; `laugh` 0..1 adds a fast
 * laughing jaw bounce and head bob; `throat` 0..1 lights the gold amrit glow that stopped at his throat
 * (the clue for why the head lives). at = head centre, s = puppet scale.
 */
export const RahuSpeaking: React.FC<{
  id: string;
  at: { x: number; y: number };
  s: number;
  f: number;
  line?: string;
  laugh?: number;
  throat?: number;
  rage?: number;
  lookX?: number;
}> = ({ id, at, s, f, line, laugh = 0, throat = 1, rage = 0.6, lookX = 0.2 }) => {
  const lip = line ? talk7(line, f) : 0;
  const bounce = laugh > 0 ? laugh * (0.45 + 0.55 * Math.abs(Math.sin(f / 2.3))) : 0;
  const talk = Math.max(lip, bounce);
  const bob = laugh * Math.sin(f / 2.3) * 4;
  const tg = Math.max(0, Math.min(1, throat)) * (0.8 + 0.2 * Math.sin(f / 6));
  return (
    <g>
      <RahuHead
        id={id}
        at={at}
        s={s}
        t={f}
        p={{ talk, smile: 0.85 - 0.4 * lip, browTilt: 8 + 6 * rage, lookX, glow: 0.4 + 0.6 * rage, bob, head: -2 * laugh }}
        smoke={1}
      />
      {tg > 0.01 ? (
        <g opacity={tg}>
          <ellipse cx={at.x - 6 * s} cy={at.y + 56 * s} rx={34 * s} ry={9 * s} fill="#FFD27A" opacity={0.5} filter="url(#mBlur8)" />
          <ellipse cx={at.x - 6 * s} cy={at.y + 56 * s} rx={16 * s} ry={4 * s} fill="#FFF1C2" opacity={0.75} />
          {[0, 1, 2, 3, 4].map((i) => {
            // sparks circle the neck: the amrit stopped here, it never went further
            const a = f / 9 + (i * Math.PI * 2) / 5;
            return <circle key={i} cx={at.x - 6 * s + Math.cos(a) * 30 * s} cy={at.y + 56 * s + Math.sin(a) * 6 * s} r={2.6 * s * (0.6 + 0.4 * Math.sin(a))} fill="#FFF1C2" opacity={0.5 + 0.5 * Math.sin(a)} />;
          })}
        </g>
      ) : null}
    </g>
  );
};

/** Ketu: the body's graha, a smoky orb with a long comet tail in Chandra's cool silver-blue. */
export const KetuForm: React.FC<{ x: number; y: number; r: number; f: number; k?: number; tail?: number; tailDeg?: number; children?: React.ReactNode }> = ({
  x, y, r, f, k = 1, tail = 1, tailDeg = 150, children,
}) => (
  <GrahaOrb x={x} y={y} r={r} f={f} rim="#9FB3D9" k={k} tail={tail} tailDeg={tailDeg}>
    {children}
  </GrahaOrb>
);
