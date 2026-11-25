import React from "react";
import { ROZHA } from "../../manthan/graphics";
import { ramp, wob } from "../../manthan/style";

/* Diwali Day 2: Yama arrives as a serpent (04) and Yama = Kaal = time (06).
   Serpent: a dark, dignified cobra in the Manthan flat style: deep indigo with gold belly bands, a gentle hood,
   kind round gold eyes; no fangs, no tongue, no strike. `glide` carries it in from the left along a travelling wave,
   `coil` curls the body into a resting spiral under the raised hood, `squint` narrows the eyes in the glare.
   Origin: the head base sits at (x, y). Needs RigDefs (mBlur8).
   KaalWheel: the wheel of time: a slowly turning gold chakra with 12 spokes (the rashis) and 27 ticks
   (the nakshatras) around a glowing hub. */

type V = [number, number];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const Serpent: React.FC<{ f: number; x: number; y: number; glide?: number; coil?: number; squint?: number; hood?: number; s?: number }> = ({
  f, x, y, glide = 1, coil = 0, squint = 0, hood = 1, s = 1,
}) => {
  const L = 900;
  const N = 64;
  const g = ramp(glide, 0, 1, "out");
  const hx = lerp(-700, 0, g); // head base x, relative to (x, y)
  const phase = f * 0.22;
  const sway = wob("sp", f / 25) * 10 * (1 - coil * 0.5);
  const spine: V[] = Array.from({ length: N }, (_, i) => {
    const u = i / (N - 1);
    const gx = hx - u * L;
    const gy = 26 * Math.sin(u * Math.PI * 3.2 + phase) * (0.4 + 0.6 * u);
    const r = 46 + 170 * u;
    const th = u * Math.PI * 3.6 + 0.6;
    const cx = hx - 90 + r * Math.cos(th);
    const cy = 30 + 0.42 * r * Math.sin(th);
    return [lerp(gx, cx, coil), lerp(gy, cy, coil)];
  });
  const neckTop: V = [hx + 30 + sway, -210 * (0.45 + 0.55 * hood)];
  const eyeH = 7 * (1 - 0.8 * squint);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* soft shadow on the floor */}
      <ellipse cx={hx - 220 * (1 - coil) - 60 * coil} cy={46} rx={420 * (1 - coil) + 200 * coil} ry={30} fill="#000000" opacity={0.3} />
      {/* body: tail to head so the head end sits on top */}
      {spine
        .map((p, i) => ({ p, i }))
        .reverse()
        .map(({ p, i }) => {
          const u = i / (N - 1);
          const r = 30 * (1 - 0.82 * u) + 4;
          return (
            <g key={i}>
              <circle cx={p[0]} cy={p[1]} r={r} fill="#2A2A5A" />
              <circle cx={p[0] - r * 0.25} cy={p[1] - r * 0.35} r={r * 0.55} fill="#3E3E7A" opacity={0.8} />
              {i % 4 === 0 ? <path d={`M${p[0] - r * 0.7} ${p[1] + r * 0.45}Q${p[0]} ${p[1] + r * 0.9} ${p[0] + r * 0.7} ${p[1] + r * 0.45}`} stroke="#C8892A" strokeWidth={Math.max(1.5, r * 0.18)} fill="none" opacity={0.9} /> : null}
            </g>
          );
        })}
      {/* the raised neck */}
      <path d={`M${hx - 20} 10C${hx - 10} -70 ${neckTop[0] - 30} ${neckTop[1] + 90} ${neckTop[0]} ${neckTop[1]}`} stroke="#2A2A5A" strokeWidth={56} strokeLinecap="round" fill="none" />
      <path d={`M${hx - 6} 0C${hx + 4} -70 ${neckTop[0] - 18} ${neckTop[1] + 90} ${neckTop[0] + 8} ${neckTop[1] + 6}`} stroke="#C8892A" strokeWidth={14} strokeLinecap="round" fill="none" opacity={0.85} strokeDasharray="10 12" />
      <g transform={`translate(${neckTop[0]} ${neckTop[1]})`}>
        {/* the hood, spreading gently */}
        <path d={`M0 ${-60 * hood}C${-80 * hood} ${-40 * hood} ${-92 * hood} ${50} -24 110C-8 120 8 120 24 110C${92 * hood} 50 ${80 * hood} ${-40 * hood} 0 ${-60 * hood}Z`} fill="#33336A" stroke="#8A8AD8" strokeWidth={4} opacity={hood} />
        <path d={`M-30 10C-20 40 20 40 30 10`} stroke="#E8B24A" strokeWidth={6} fill="none" opacity={0.8 * hood} />
        <circle cx={-24} cy={6} r={7} fill="none" stroke="#E8B24A" strokeWidth={4} opacity={0.8 * hood} />
        <circle cx={24} cy={6} r={7} fill="none" stroke="#E8B24A" strokeWidth={4} opacity={0.8 * hood} />
        {/* head */}
        <path d="M-34 -10C-34 -48 -14 -66 0 -66C14 -66 34 -48 34 -10C34 14 18 30 0 34C-18 30 -34 14 -34 -10Z" fill="#2E2E64" stroke="#14142E" strokeWidth={3} />
        <path d="M-20 -50C-8 -58 8 -58 20 -50" stroke="#5A5AA0" strokeWidth={5} fill="none" opacity={0.7} />
        {[-14, 14].map((ex) => (
          <g key={ex}>
            <ellipse cx={ex} cy={-24} rx={8} ry={Math.max(1.2, eyeH)} fill="#FFD36B" />
            {squint < 0.7 ? <circle cx={ex} cy={-24} r={3.4 * (1 - squint * 0.5)} fill="#1A1408" /> : null}
          </g>
        ))}
        <path d="M-6 18C-2 22 2 22 6 18" stroke="#14142E" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        {squint > 0.01 ? <circle cx={0} cy={-24} r={70 + 30 * squint} fill="#FFF3C9" opacity={0.25 * squint} filter="url(#mBlur8)" /> : null}
      </g>
    </g>
  );
};

export const KaalWheel: React.FC<{ f: number; k?: number; R?: number }> = ({ f, k = 1, R = 360 }) => {
  if (k <= 0.01) return null;
  const a = ramp(k, 0, 0.7, "out");
  const rot = f * 0.4;
  return (
    <g opacity={a} transform={`scale(${0.85 + 0.15 * a})`}>
      <circle r={R + 60} fill="#FFD36B" opacity={0.12} filter="url(#mBlur8)" />
      <g transform={`rotate(${rot})`}>
        <circle r={R} fill="none" stroke="url(#mGold)" strokeWidth={18} />
        <circle r={R - 34} fill="none" stroke="#DFB15B" strokeWidth={3} opacity={0.8} />
        {Array.from({ length: 27 }, (_, i) => (
          <line key={i} x1={0} y1={-R + 8} x2={0} y2={-R + 30} stroke="#FFE6A3" strokeWidth={4} transform={`rotate(${(i * 360) / 27})`} />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <g key={i} transform={`rotate(${i * 30})`}>
            <path d={`M-7 -70L7 -70L4 ${-R + 40}L-4 ${-R + 40}Z`} fill="url(#mGold)" opacity={0.95} />
            <circle cx={0} cy={-R + 64} r={9} fill="#FFE6A3" />
          </g>
        ))}
      </g>
      <g transform={`rotate(${-rot * 1.5})`}>
        <circle r={150} fill="none" stroke="#DFB15B" strokeWidth={4} strokeDasharray="14 18" />
      </g>
      <circle r={96} fill="#0C0A1C" stroke="url(#mGold)" strokeWidth={10} />
      <circle r={96} fill="#FFD36B" opacity={0.12 + 0.06 * Math.sin(f / 8)} />
      <text y={26} textAnchor="middle" fontFamily={ROZHA} fontSize={84} fill="#FFD36B" style={{ filter: "drop-shadow(0 0 14px rgba(255,201,77,0.8))" }}>
        काल
      </text>
    </g>
  );
};
