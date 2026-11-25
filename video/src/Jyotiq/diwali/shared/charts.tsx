import React from "react";
import { ROZHA } from "../../manthan/graphics";
import { ramp } from "../../manthan/style";

/* Diwali series astrology charts in the Manthan look (gold lines on night, Rozha glyphs, soft glows).
   HoraDial (Day 2): 24 hora segments from sunrise, each ruled by one graha in the Chaldean cycle starting
   from the Sun (सू शु बु चं श गु मं), a sweeping hand, the current graha glowing.
   DashaTimeline (Day 3): the nine Vimshottari mahadashas as bars proportional to their years (120 in all)
   and a marker for "now".
   GocharWheel (Day 4): the 12 rashis with शनि, गुरु, राहु and केतु moving (Rahu and Ketu always opposite).
   All are drawn around (0,0); k 0..1 builds them in. */

export type Graha = { g: string; name: string; c: string };
export const GRAHA: Record<string, Graha> = {
  su: { g: "सू", name: "सूर्य", c: "#FFB43D" },
  ch: { g: "चं", name: "चंद्र", c: "#DDE6F2" },
  ma: { g: "मं", name: "मंगल", c: "#E8463A" },
  bu: { g: "बु", name: "बुध", c: "#3FBF6A" },
  gu: { g: "गु", name: "गुरु", c: "#F2C230" },
  sh: { g: "शु", name: "शुक्र", c: "#F6D6F2" },
  sa: { g: "श", name: "शनि", c: "#7A8AD8" },
  ra: { g: "रा", name: "राहु", c: "#9A7CFF" },
  ke: { g: "के", name: "केतु", c: "#B8A8C8" },
};
/** Hora lords from sunrise on a Sunday: the Chaldean cycle starting from the Sun. */
export const HORA_ORDER = ["su", "sh", "bu", "ch", "sa", "gu", "ma"];

const Node: React.FC<{ x: number; y: number; gr: Graha; r?: number; on?: number }> = ({ x, y, gr, r = 34, on = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${1 + 0.35 * on})`}>
    {on > 0.01 ? <circle r={r * 1.9} fill={gr.c} opacity={0.28 * on} filter="url(#mBlur8)" /> : null}
    <circle r={r} fill="#0C0A07" stroke={gr.c} strokeWidth={3 + 2 * on} opacity={0.95} />
    <text y={r * 0.42} textAnchor="middle" fontFamily={ROZHA} fontSize={r * 1.15} fill={gr.c}>
      {gr.g}
    </text>
  </g>
);

/** hour 0..24 from sunrise drives the hand; the graha of that hora glows. */
export const HoraDial: React.FC<{ f: number; hour: number; k?: number; R?: number }> = ({ f, hour, k = 1, R = 300 }) => {
  const a = ramp(k, 0, 0.6, "out");
  const b = ramp(k, 0.3, 1, "out");
  const h = ((hour % 24) + 24) % 24;
  const cur = Math.floor(h);
  const lord = HORA_ORDER[cur % 7];
  const ang = (h / 24) * 360 - 90;
  const pulse = 0.85 + 0.15 * Math.sin(f / 5);
  return (
    <g opacity={a}>
      <circle r={R + 30} fill="#0C0A1C" opacity={0.75} />
      <circle r={R + 30} fill="none" stroke="#DFB15B" strokeWidth={3} opacity={0.9} />
      {/* 24 hora segments, coloured by their lord */}
      {Array.from({ length: 24 }, (_, i) => {
        const g0 = (i / 24) * Math.PI * 2 - Math.PI / 2;
        const g1 = ((i + 1) / 24) * Math.PI * 2 - Math.PI / 2;
        const gr = GRAHA[HORA_ORDER[i % 7]];
        const r0 = R - 46;
        const r1 = R + 10;
        const p = (r: number, g: number) => `${(r * Math.cos(g)).toFixed(1)} ${(r * Math.sin(g)).toFixed(1)}`;
        const isCur = i === cur;
        return (
          <g key={i} opacity={ramp(b, i / 30, i / 30 + 0.2, "out")}>
            <path d={`M${p(r0, g0)}L${p(r1, g0)}A${r1} ${r1} 0 0 1 ${p(r1, g1)}L${p(r0, g1)}A${r0} ${r0} 0 0 0 ${p(r0, g0)}Z`} fill={gr.c} opacity={isCur ? 0.75 * pulse : 0.22} stroke="#0C0A1C" strokeWidth={2} />
            <text x={(R - 18) * Math.cos((g0 + g1) / 2)} y={(R - 18) * Math.sin((g0 + g1) / 2) + 9} textAnchor="middle" fontFamily={ROZHA} fontSize={24} fill={isCur ? "#0C0A07" : gr.c}>
              {gr.g}
            </text>
          </g>
        );
      })}
      {/* sunrise mark at the top */}
      <text x={0} y={-R - 44} textAnchor="middle" fontFamily={ROZHA} fontSize={30} fill="#FFD36B" opacity={b}>
        सूर्योदय
      </text>
      {/* the seven grahas on the inner ring */}
      {HORA_ORDER.map((id, i) => {
        const g = (i / 7) * Math.PI * 2 - Math.PI / 2;
        return <Node key={id} x={(R - 140) * Math.cos(g)} y={(R - 140) * Math.sin(g)} gr={GRAHA[id]} on={id === lord ? b : 0} r={30} />;
      })}
      {/* the hand */}
      <g transform={`rotate(${ang})`} opacity={b}>
        <path d={`M0 -8L${R - 50} -2L${R - 50} 2L0 8Z`} fill="#FFD36B" />
        <circle cx={R - 50} cy={0} r={7} fill="#FFF3C4" />
      </g>
      <circle r={16} fill="url(#mGold)" opacity={b} />
    </g>
  );
};

/** The nine Vimshottari mahadashas. */
export const DASHA: [string, number][] = [["ke", 7], ["sh", 20], ["su", 6], ["ch", 10], ["ma", 7], ["ra", 18], ["gu", 16], ["sa", 19], ["bu", 17]];

/** Bars across `width`, centred on 0; `marker` 0..1 slides the "अभी" pointer along the 120 years. */
export const DashaTimeline: React.FC<{ f: number; marker: number; k?: number; width?: number }> = ({ f, marker, k = 1, width = 940 }) => {
  const total = DASHA.reduce((s, [, y]) => s + y, 0);
  const x0 = -width / 2;
  let acc = 0;
  const mx = x0 + width * Math.max(0, Math.min(1, marker));
  const grow = ramp(k, 0, 0.8, "out");
  const pulse = 0.9 + 0.1 * Math.sin(f / 5);
  return (
    <g>
      <rect x={x0 - 24} y={-110} width={width + 48} height={230} rx={24} fill="#0C0A1C" opacity={0.72 * ramp(k, 0, 0.3)} stroke="#DFB15B" strokeWidth={2} />
      {DASHA.map(([id, yrs], i) => {
        const gr = GRAHA[id];
        const w = (width * yrs) / total;
        const x = x0 + (width * acc) / total;
        acc += yrs;
        const show = ramp(grow, i / 11, i / 11 + 0.25, "out");
        const here = mx >= x && mx < x + w;
        return (
          <g key={id} opacity={show}>
            <rect x={x + 2} y={-36} width={Math.max(2, w - 4)} height={72} rx={8} fill={gr.c} opacity={here ? 0.95 * pulse : 0.45} />
            <text x={x + w / 2} y={-52} textAnchor="middle" fontFamily={ROZHA} fontSize={30} fill={gr.c}>
              {gr.g}
            </text>
            {w > 60 ? (
              <text x={x + w / 2} y={12} textAnchor="middle" fontFamily={ROZHA} fontSize={28} fill="#0C0A07">
                {yrs}
              </text>
            ) : null}
          </g>
        );
      })}
      {/* "now" marker */}
      <g transform={`translate(${mx} 0)`} opacity={ramp(k, 0.6, 1)}>
        <path d="M-14 66L14 66L0 46Z" fill="#FFD36B" />
        <rect x={-2} y={-44} width={4} height={92} fill="#FFF3C4" />
        <text y={100} textAnchor="middle" fontFamily={ROZHA} fontSize={32} fill="#FFD36B">
          अभी
        </text>
      </g>
    </g>
  );
};

const RASHI = ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"];

/** The 12 rashis round a wheel; Saturn and Jupiter crawl forward, Rahu and Ketu backward and opposite. */
export const GocharWheel: React.FC<{ f: number; k?: number; R?: number; start?: Partial<Record<"sa" | "gu" | "ra", number>> }> = ({ f, k = 1, R = 300, start = {} }) => {
  const a = ramp(k, 0, 0.6, "out");
  const b = ramp(k, 0.3, 1, "out");
  const t = f / 30;
  // positions in rashi units (0 = start of मेष), roughly late 2026 (sidereal): शनि in मीन, गुरु in कर्क, राहु in कुंभ,
  // केतु in सिंह; the motion is exaggerated so it reads on screen
  const sa = (start.sa ?? 11.2) + 0.05 * t;
  const gu = (start.gu ?? 3.6) + 0.12 * t;
  const ra = (start.ra ?? 10.4) - 0.04 * t;
  const ke = ra + 6;
  const pos = (u: number, r: number): [number, number] => {
    const g = (u / 12) * Math.PI * 2 - Math.PI / 2;
    return [r * Math.cos(g), r * Math.sin(g)];
  };
  return (
    <g opacity={a}>
      <circle r={R + 40} fill="#0C0A1C" opacity={0.75} />
      <circle r={R + 40} fill="none" stroke="#DFB15B" strokeWidth={3} />
      <circle r={R - 60} fill="none" stroke="#DFB15B" strokeWidth={1.5} opacity={0.6} />
      {RASHI.map((n, i) => {
        const [lx1, ly1] = pos(i, R - 60);
        const [lx2, ly2] = pos(i, R + 40);
        const [tx, ty] = pos(i + 0.5, R + 6);
        return (
          <g key={n} opacity={ramp(b, i / 16, i / 16 + 0.25, "out")}>
            <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke="#DFB15B" strokeWidth={1.5} opacity={0.6} />
            <text x={tx} y={ty + 9} textAnchor="middle" fontFamily={ROZHA} fontSize={25} fill="#F3DB9D">
              {n}
            </text>
          </g>
        );
      })}
      {/* Rahu-Ketu axis */}
      {(() => {
        const [x1, y1] = pos(ra, R - 120);
        const [x2, y2] = pos(ke, R - 120);
        return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#9A7CFF" strokeWidth={2} strokeDasharray="8 10" opacity={0.6 * b} />;
      })()}
      {(
        [
          ["sa", sa],
          ["gu", gu],
          ["ra", ra],
          ["ke", ke],
        ] as [string, number][]
      ).map(([id, u]) => {
        const [x, y] = pos(u, R - 120);
        const [px, py] = pos(u - (id === "ra" || id === "ke" ? -0.35 : 0.35), R - 120);
        return (
          <g key={id} opacity={b}>
            <line x1={px} y1={py} x2={x} y2={y} stroke={GRAHA[id].c} strokeWidth={6} opacity={0.35} strokeLinecap="round" />
            <Node x={x} y={y} gr={GRAHA[id]} r={32} on={0.4 + 0.2 * Math.sin(f / 7 + u)} />
          </g>
        );
      })}
      <circle r={22} fill="url(#mGold)" opacity={b} />
      <text y={8} textAnchor="middle" fontFamily={ROZHA} fontSize={22} fill="#0C0A07" opacity={b}>
        पृ
      </text>
    </g>
  );
};
