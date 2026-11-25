import React from "react";
import { P } from "../style";

/* Episode 6 props. The kalash itself is the series' Kalash from ../sets (as under Episode 5's end card). */
type T2 = [number, number];

/** A glowing stream of amrit from a to b; t 0..1 reveals it along its length; drops sparkle down it. */
export const AmritStream: React.FC<{ a: T2; b: T2; t: number; f: number; w?: number }> = ({ a, b, t, f, w = 10 }) => {
  if (t <= 0.001) return null;
  const m: T2 = [(a[0] + b[0]) / 2 + 30, (a[1] + b[1]) / 2 - 20];
  const d = `M${a[0]} ${a[1]}Q${m[0]} ${m[1]} ${b[0]} ${b[1]}`;
  const dash = `${Math.min(1, t)} 1`;
  return (
    <g>
      <path d={d} pathLength={1} strokeDasharray={dash} stroke="#FFD66B" strokeWidth={w * 2.6} fill="none" opacity={0.45} filter="url(#mBlur8)" strokeLinecap="round" />
      <path d={d} pathLength={1} strokeDasharray={dash} stroke="#FFF1C2" strokeWidth={w} fill="none" strokeLinecap="round" />
      {[0, 1, 2, 3].map((i) => {
        const u = ((f / 14 + i / 4) % 1) * Math.min(1, t);
        const x = (1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * m[0] + u * u * b[0];
        const y = (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * m[1] + u * u * b[1];
        return <circle key={i} cx={x} cy={y} r={w * 0.45} fill="#FFFFFF" opacity={0.85} />;
      })}
    </g>
  );
};

/** A small gold cup; fill 0..1 raises a glowing amrit level inside the rim. */
export const AmritCup: React.FC<{ x: number; y: number; s?: number; fill?: number; f: number }> = ({ x, y, s = 1, fill = 0, f }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-30 -40L30 -40L20 0L-20 0Z" fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={2} />
    <path d="M-12 0L12 0L16 10L-16 10Z" fill={P.goldDeep} />
    <ellipse cx={0} cy={-40} rx={30} ry={8} fill={P.goldDeep} />
    {fill > 0.02 ? (
      <g>
        <ellipse cx={0} cy={-40} rx={26 * Math.min(1, fill + 0.2)} ry={6} fill="#FFF1C2" />
        <ellipse cx={0} cy={-46} rx={30} ry={14} fill="#FFE08A" opacity={0.35 * fill} filter="url(#mBlur8)" />
      </g>
    ) : null}
    <path d="M-22 -34L-16 -8" stroke="#FFFFFF" strokeWidth={3} opacity={0.5 + 0.2 * Math.sin(f / 7)} strokeLinecap="round" />
  </g>
);

const STAR = "M0 -12L3 -4L12 -4L5 2L8 11L0 6L-8 11L-5 2L-12 -4L-3 -4Z";

/** A cartoon brawl cloud: churning dust puffs, fists and spinning stars; children (the kalash) bob on top. */
export const BrawlCloud: React.FC<{ x: number; y: number; s?: number; f: number; children?: React.ReactNode }> = ({ x, y, s = 1, f, children }) => {
  const puffs: [number, number, number][] = [[-120, 0, 90], [0, -30, 110], [120, 0, 90], [-60, 50, 80], [70, 50, 85], [0, 40, 95]];
  const k = Math.floor(f / 4);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {puffs.map(([px, py, r], i) => (
        <circle key={i} cx={px + Math.sin(f / 3 + i) * 10} cy={py + Math.cos(f / 4 + i) * 8} r={r} fill={i % 2 ? "#E7D9C2" : "#F3E8D6"} stroke="#B9A88C" strokeWidth={3} />
      ))}
      {[0, 1, 2, 3].map((i) => {
        const a = ((k * 47 + i * 97) % 360) * (Math.PI / 180);
        const fx = Math.cos(a) * 170;
        const fy = Math.sin(a) * 110;
        const rot = (a * 180) / Math.PI;
        return (
          <g key={i}>
            {/* an arm punching out of the cloud */}
            <path d={`M${fx * 0.45} ${fy * 0.45}L${fx * 0.92} ${fy * 0.92}`} stroke="#7A3B2E" strokeWidth={22} strokeLinecap="round" />
            <path d={`M${fx * 0.45} ${fy * 0.45}L${fx * 0.92} ${fy * 0.92}`} stroke="#3A1A12" strokeWidth={26} strokeLinecap="round" opacity={0.25} />
            <g transform={`translate(${fx} ${fy}) rotate(${rot})`}>
              <rect x={-14} y={-20} width={30} height={40} rx={12} fill="#7A3B2E" stroke="#3A1A12" strokeWidth={3} />
              {[-13, -4, 5, 14].map((ky) => (
                <circle key={ky} cx={16} cy={ky} r={5} fill="#8E4A3A" stroke="#3A1A12" strokeWidth={2} />
              ))}
              <path d="M-6 16Q4 24 12 16" stroke="#3A1A12" strokeWidth={2.5} fill="none" />
            </g>
          </g>
        );
      })}
      {[0, 1, 2].map((i) => (
        <path key={i} d={STAR} transform={`translate(${-90 + i * 90} ${-120 - (i % 2) * 30}) rotate(${f * 9 + i * 40}) scale(1.4)`} fill={P.goldLight} stroke={P.goldDeep} strokeWidth={1.5} />
      ))}
      {children ? <g transform={`translate(0 ${-150 + Math.sin(f / 3) * 14}) rotate(${Math.sin(f / 5) * 12})`}>{children}</g> : null}
    </g>
  );
};
