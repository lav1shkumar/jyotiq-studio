import React from "react";
import { Crescent, Stars } from "./set";
import { rnd } from "./style";

/* Modern-day set, same flat miniature language: a city rooftop at night.
   Layers (parallax): sky 0.1, far skyline 0.25, near skyline 0.45, terrace 1. */

export const NightSky: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={-200} y={0} width={1480} height={1320} fill="url(#kSkyNight)" />
    <Stars f={f} n={120} y0={70} y1={900} opacity={1} />
    <Crescent x={250} y={300} r={44} />
  </g>
);

const Windows: React.FC<{ x: number; y: number; w: number; h: number; seed: string; size: number; lit: number }> = ({ x, y, w, h, seed, size, lit }) => {
  const cols = Math.max(1, Math.floor((w - 16) / (size * 2)));
  const rows = Math.max(1, Math.floor((h - 16) / (size * 2.3)));
  const out: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rnd(`${seed}-${r}-${c}`) > lit) continue;
      out.push(
        <rect
          key={`${r}-${c}`}
          x={x + 10 + c * size * 2}
          y={y + 12 + r * size * 2.3}
          width={size}
          height={size * 1.3}
          fill={rnd(`${seed}c-${r}-${c}`) > 0.25 ? "#F2C46B" : "#BFD7F2"}
          opacity={0.75}
        />,
      );
    }
  }
  return <g>{out}</g>;
};

export const FarSkyline: React.FC = () => {
  const blocks: React.ReactNode[] = [];
  let x = -180;
  let i = 0;
  while (x < 1260) {
    const w = 60 + rnd(`fw${i}`) * 80;
    const top = 720 + rnd(`fh${i}`) * 200;
    if (!(x > 700 && x < 820)) {
      blocks.push(
        <g key={i}>
          <rect x={x} y={top} width={w} height={1300 - top} fill="#2A2052" />
          <Windows x={x} y={top} w={w} h={420} seed={`fwin${i}`} size={7} lit={0.22} />
        </g>,
      );
    }
    x += w + 4;
    i++;
  }
  return (
    <g>
      {blocks}
      {/* a distant temple shikhara with its saffron flag */}
      <path d="M708 1100C712 960 734 860 760 800C786 860 808 960 812 1100Z" fill="#30255C" />
      <ellipse cx={760} cy={798} rx={20} ry={8} fill="#30255C" />
      <path d="M760 790V748" stroke="#30255C" strokeWidth={4} />
      <path d="M760 748L790 758L760 768Z" fill="#E8822A" />
    </g>
  );
};

export const NearSkyline: React.FC = () => {
  const blocks: React.ReactNode[] = [];
  let x = -200;
  let i = 0;
  while (x < 1280) {
    const w = 100 + rnd(`nw${i}`) * 110;
    const top = 880 + rnd(`nh${i}`) * 130;
    blocks.push(
      <g key={i}>
        <rect x={x} y={top} width={w} height={1300 - top} fill="#3A2C66" />
        <rect x={x} y={top} width={w} height={8} fill="#4A3B7A" />
        <Windows x={x} y={top} w={w} h={1180 - top} seed={`nwin${i}`} size={11} lit={0.3} />
        {rnd(`nt${i}`) > 0.45 ? (
          <g>
            <rect x={x + w * 0.25} y={top - 46} width={44} height={46} rx={8} fill="#241C40" />
            <path d={`M${x + w * 0.25} ${top - 34}H${x + w * 0.25 + 44}M${x + w * 0.25} ${top - 18}H${x + w * 0.25 + 44}`} stroke="#33295A" strokeWidth={3} />
          </g>
        ) : (
          <path d={`M${x + w * 0.7} ${top}V${top - 60}M${x + w * 0.7 - 14} ${top - 44}H${x + w * 0.7 + 14}`} stroke="#241C40" strokeWidth={3} />
        )}
      </g>,
    );
    x += w + 6;
    i++;
  }
  return <g>{blocks}</g>;
};

/** Fairy-light string: two swags of warm bulbs that twinkle. */
const FairyLights: React.FC<{ f: number }> = ({ f }) => {
  const swags: [number, number, number, number, number][] = [
    [-80, 1010, 540, 990, 80],
    [540, 990, 1160, 1010, 80],
  ];
  return (
    <g>
      {swags.map(([x1, y1, x2, y2, sag], k) => {
        const n = 22;
        const pt = (t: number): [number, number] => [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t + 4 * sag * t * (1 - t)];
        const d = new Array(n + 1)
          .fill(0)
          .map((_, i) => pt(i / n))
          .map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`)
          .join("");
        return (
          <g key={k}>
            <path d={d} fill="none" stroke="#1C1634" strokeWidth={2.5} />
            {new Array(n - 1).fill(0).map((_, i) => {
              const [x, y] = pt((i + 1) / n);
              const tw = 0.65 + 0.35 * Math.sin(f / 6 + i * 2.3 + k);
              return (
                <g key={i}>
                  <circle cx={x} cy={y + 8} r={15} fill="#FFD27A" opacity={0.16 * tw} />
                  <circle cx={x} cy={y + 8} r={5.5} fill={i % 3 === 0 ? "#FFB35C" : "#FFE09A"} opacity={0.6 + 0.4 * tw} />
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
};

export const Terrace: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <FairyLights f={f} />
    {/* parapet */}
    <rect x={-200} y={1196} width={1480} height={100} fill="#5E4C8A" />
    <rect x={-210} y={1180} width={1500} height={18} fill="#8C7BB4" />
    {[60, 300, 560, 820, 1040].map((x) => (
      <rect key={x} x={x} y={1262} width={22} height={10} rx={3} fill="#3E3166" />
    ))}
    {/* floor */}
    <rect x={-200} y={1296} width={1480} height={700} fill="#4A3B70" />
    {[1360, 1450, 1560, 1700].map((y) => (
      <path key={y} d={`M-200 ${y}H1280`} stroke="#55467C" strokeWidth={2} />
    ))}
    {/* potted tulsi on the parapet */}
    <path d="M110 1180L118 1124H186L194 1180Z" fill="#B5552E" stroke="#7E3519" strokeWidth={2} />
    <rect x={112} y={1116} width={80} height={12} rx={4} fill="#C9653D" />
    {[
      [140, 1090, -20],
      [160, 1070, 8],
      [178, 1094, 30],
      [128, 1106, -40],
      [168, 1102, 18],
    ].map(([x, y, a], i) => (
      <ellipse key={i} cx={x} cy={y} rx={10} ry={22} transform={`rotate(${a} ${x} ${y})`} fill={i % 2 ? "#3F8C41" : "#2E7434"} />
    ))}
    {/* black water tank */}
    <rect x={930} y={1060} width={150} height={236} rx={24} fill="#2B2440" />
    {[1110, 1170, 1230].map((y) => (
      <path key={y} d={`M930 ${y}H1080`} stroke="#3A3156" strokeWidth={4} />
    ))}
    <rect x={984} y={1046} width={44} height={18} rx={6} fill="#241C40" />
  </g>
);

/** Slowly turning gold kundali mandala (app + CTA backdrops). */
export const Mandala: React.FC<{ f: number; cx: number; cy: number; r: number; opacity: number }> = ({ f, cx, cy, r, opacity }) => {
  const s = r * 0.62;
  return (
    <g opacity={opacity} transform={`rotate(${f * 0.12} ${cx} ${cy})`} fill="none" stroke="#DFB15B">
      <circle cx={cx} cy={cy} r={r} strokeWidth={2.5} />
      <circle cx={cx} cy={cy} r={r * 0.9} strokeWidth={1.2} strokeDasharray="4 10" />
      {new Array(12).fill(0).map((_, i) => {
        const a = (i * Math.PI) / 6;
        return (
          <path
            key={i}
            d={`M${cx + Math.cos(a) * r * 0.9} ${cy + Math.sin(a) * r * 0.9}L${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r}`}
            strokeWidth={2.5}
          />
        );
      })}
      <path d={`M${cx - s} ${cy - s}H${cx + s}V${cy + s}H${cx - s}Z`} strokeWidth={2.5} />
      <path d={`M${cx - s} ${cy - s}L${cx + s} ${cy + s}M${cx + s} ${cy - s}L${cx - s} ${cy + s}`} strokeWidth={1.8} />
      <path d={`M${cx} ${cy - s}L${cx + s} ${cy}L${cx} ${cy + s}L${cx - s} ${cy}Z`} strokeWidth={2.2} />
    </g>
  );
};
