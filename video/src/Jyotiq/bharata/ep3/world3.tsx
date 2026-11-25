import React from "react";
import { Stars } from "../../manthan/sets";
import { rnd } from "../../navagraha/ep1/anim";
import { P } from "../../manthan/style";

/*
 * भारत Ep3 sets (uses Episode 1's BhDefs gradients and blurs).
 *  ForestSet: a deep forest for Amba's tapas; `season` 0..3 drifts the night from rain-green to snow to autumn leaves
 *  (the "बरसों" passing), with a small sacred fire beside her.
 *  PalaceGate: Hastinapur's great gate at dusk; `shut` 0..1 swings the two doors closed over the lit hall.
 *  Fall: snow or leaves drifting down. ShivaBlaze: the light in which Mahadev appears.
 */
const W = 1080;
const H = 1920;

const Tree: React.FC<{ x: number; y: number; s: number; c: string; f: number; seed: number }> = ({ x, y, s, c, f, seed }) => {
  const sway = Math.sin(f / 30 + seed) * 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${sway})`}>
      <path d="M-22 0L-14 -420L14 -420L22 0Z" fill="#1A0E10" />
      {[0, 1, 2, 3].map((i) => (
        <ellipse key={i} cx={(i % 2 ? 1 : -1) * 60 * rnd(seed, i)} cy={-420 - i * 90} rx={190 - i * 30} ry={120 - i * 14} fill={c} opacity={0.95} />
      ))}
    </g>
  );
};

export const ForestSet: React.FC<{ f: number; season?: number; fire?: number; blaze?: number }> = ({ f, season = 0, fire = 1, blaze = 0 }) => {
  const leaf = season < 1 ? "#1E3A2A" : season < 2 ? "#2A3A4A" : "#5A2A1A";
  const ground = season >= 1 && season < 2 ? ["#C8D2E2", "#9AA8C0"] : ["#2A2018", "#1A140E"];
  return (
    <g>
      <rect width={W} height={H} fill="#0A0E1E" />
      <rect width={W} height={1100} fill="#141A3A" />
      <Stars f={f} n={50} y1={700} seed="fo" o={0.7} />
      <circle cx={760} cy={360} r={70} fill="#F4F0E0" opacity={0.85} />
      <circle cx={760} cy={360} r={240} fill="#C8D2FF" opacity={0.12} filter="url(#bhBlur20)" />
      {Array.from({ length: 9 }, (_, i) => (
        <Tree key={`b${i}`} x={-60 + i * 150} y={1240} s={0.9 + 0.2 * rnd(i, 4)} c="#0E1624" f={f} seed={i} />
      ))}
      {[[-40, 1500, 1.3], [1120, 1520, 1.35], [110, 1420, 1.0], [980, 1430, 1.05]].map(([x, y, s], i) => (
        <Tree key={`f${i}`} x={x} y={y} s={s} c={leaf} f={f} seed={i + 20} />
      ))}
      <path d="M0 1380C260 1350 620 1400 1080 1360L1080 1920L0 1920Z" fill={ground[0]} />
      <path d="M0 1560C300 1530 700 1580 1080 1540L1080 1920L0 1920Z" fill={ground[1]} opacity={0.7} />
      {fire > 0.01 ? (
        <g transform="translate(780 1590)" opacity={fire}>
          <circle r={150} fill="#FF9A3A" opacity={0.22 + 0.06 * Math.sin(f / 3)} filter="url(#bhBlur20)" />
          <path d="M-60 10L60 10L40 -10L-40 -10Z" fill="#4A2A14" />
          <path d={`M-30 -6C-34 -50 -6 -60 0 ${-110 - 10 * Math.sin(f / 2)}C8 -60 34 -50 30 -6Z`} fill="#FFB23A" />
          <path d={`M-14 -6C-16 -34 -4 -40 0 ${-70 - 8 * Math.sin(f / 2.4)}C4 -40 16 -34 14 -6Z`} fill="#FFF0B0" />
        </g>
      ) : null}
      {blaze > 0.01 ? <rect width={W} height={H} fill="#DCE8FF" opacity={0.18 * blaze} /> : null}
    </g>
  );
};

/** Snow (kind 0) or autumn leaves (kind 1) drifting down. */
export const Fall: React.FC<{ f: number; kind: 0 | 1; k: number; n?: number }> = ({ f, kind, k, n = 50 }) => {
  if (k <= 0.01) return null;
  return (
    <g opacity={k}>
      {Array.from({ length: n }, (_, i) => {
        const sp = (kind ? 3.5 : 2.2) + 2 * rnd(i, 2);
        const y = ((f * sp + rnd(i, 1) * 2000) % 2000) - 40;
        const x = rnd(i, 3) * W + Math.sin(f / 18 + i) * (kind ? 60 : 24);
        const r = kind ? 10 + 6 * rnd(i, 4) : 4 + 4 * rnd(i, 4);
        return kind ? (
          <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.5} fill={i % 2 ? "#C8501A" : "#E8A02A"} transform={`rotate(${f * 3 + i * 40} ${x} ${y})`} />
        ) : (
          <circle key={i} cx={x} cy={y} r={r} fill="#FFFFFF" opacity={0.85} />
        );
      })}
    </g>
  );
};

/** Hastinapur's gate at dusk; the doors swing shut (shut 0 open .. 1 closed) over the lit hall. */
export const PalaceGate: React.FC<{ f: number; shut: number }> = ({ f, shut }) => {
  const dw = 230 * shut;
  return (
    <g>
      <rect width={W} height={H} fill="url(#bhDusk)" />
      <circle cx={540} cy={560} r={360} fill="#FFB04A" opacity={0.14} filter="url(#bhBlur20)" />
      {/* walls and towers */}
      <rect x={0} y={760} width={W} height={760} fill="#6A2E28" />
      <rect x={0} y={760} width={W} height={40} fill="#8A4A34" />
      {Array.from({ length: 14 }, (_, i) => <rect key={i} x={i * 80} y={720} width={44} height={44} fill="#6A2E28" />)}
      {[150, 930].map((x) => (
        <g key={x}>
          <rect x={x - 110} y={460} width={220} height={1060} fill="#7A3A2E" />
          <path d={`M${x - 130} 470L${x} 330L${x + 130} 470Z`} fill="#B0543A" stroke="url(#mGold)" strokeWidth={6} />
          <circle cx={x} cy={318} r={14} fill="url(#mGold)" />
          <rect x={x - 26} y={600} width={52} height={90} rx={26} fill="#2A0E0A" />
          <rect x={x - 20} y={606} width={40} height={80} rx={20} fill="#FFB04A" opacity={0.45 + 0.1 * Math.sin(f / 6)} />
        </g>
      ))}
      {/* the arch, the lit hall behind it, the doors */}
      <path d="M300 1520L300 900C300 760 420 680 540 680C660 680 780 760 780 900L780 1520Z" fill="#FFD9A0" />
      <path d="M300 1520L300 900C300 760 420 680 540 680C660 680 780 760 780 900L780 1520Z" fill="#FFB04A" opacity={0.4 + 0.08 * Math.sin(f / 5)} />
      <rect x={300} y={680} width={dw + 10} height={840} fill="#4A2412" />
      <rect x={780 - dw - 10} y={680} width={dw + 10} height={840} fill="#4A2412" />
      {shut > 0.02
        ? [0, 1].map((sd) => {
            const x0 = sd ? 780 - dw : 300;
            return (
              <g key={sd}>
                {Array.from({ length: 5 }, (_, j) => <circle key={j} cx={x0 + dw / 2} cy={800 + j * 160} r={9} fill={P.goldDeep} />)}
                <rect x={x0} y={680} width={dw} height={840} fill="none" stroke="#2A1208" strokeWidth={6} />
              </g>
            );
          })
        : null}
      <path d="M300 900C300 760 420 680 540 680C660 680 780 760 780 900" stroke="url(#mGold)" strokeWidth={14} fill="none" />
      <path d="M0 1520L1080 1520L1080 1920L0 1920Z" fill="#5A3A2E" />
      <path d="M0 1520C300 1560 780 1560 1080 1520" stroke="#3A2218" strokeWidth={6} fill="none" />
    </g>
  );
};

/** The light Mahadev appears in: a cold white-blue column and a ring. */
export const ShivaBlaze: React.FC<{ f: number; k: number; x: number; y: number }> = ({ f, k, x, y }) => {
  if (k <= 0.01) return null;
  return (
    <g opacity={k}>
      <ellipse cx={x} cy={y - 400} rx={420} ry={700} fill="#DCE8FF" opacity={0.35} filter="url(#bhBlur20)" />
      <rect x={x - 140} y={0} width={280} height={y} fill="#F0F6FF" opacity={0.18} filter="url(#bhBlur20)" />
      <circle cx={x} cy={y - 520} r={300 + 10 * Math.sin(f / 6)} fill="none" stroke="#E6EEFF" strokeWidth={6} opacity={0.6} strokeDasharray="14 18" transform={`rotate(${f} ${x} ${y - 520})`} />
    </g>
  );
};
