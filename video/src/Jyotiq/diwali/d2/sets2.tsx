import React from "react";
import { H, P, rnd, W, wob } from "../../manthan/style";
import { Coin, Garland, Stack, Strand } from "../d1/counter";
import { Flame } from "../d1/diya";
import { HeadR, limb, Lit, V } from "../d1/market";
import { DiyaWave } from "../shared/fx";

/* Diwali Day 2 (छोटी दिवाली · यम का दीया) sets in the Manthan look.
   Doorstep: the hook at dusk: a carved door with a toran and fairy lights, a rangoli at the threshold and the
   four-wick चौमुखा diya facing south on it (lit from frame 0; the middle third stays calm for the hook plate).
   Palace: the legend's night palace: arches, curtains, a carpet and the central doorway to the night; `lamps`
   lights the walls in sequence, `gold` lays gold and silver at the threshold, `dawn` turns the doorway sky.
   Couple and Bride: the prince and his bride as rim-lit legend silhouettes (Day 1's present-day style).
   Needs DiyaDefs, CounterDefs and MarketDefs in the svg (and RigDefs for mGold/mBlur8). */

/** The four-wick chaumukha diya seen from above at a slight angle; origin = bowl centre. */
export const Chaumukha: React.FC<{ f: number; lit?: number; s?: number }> = ({ f, lit = 1, s = 1 }) => {
  const spouts: [number, number, number][] = [
    [0, 44, 0], // south: towards the viewer
    [-104, 0, -90],
    [104, 0, 90],
    [0, -40, 180],
  ];
  return (
    <g transform={`scale(${s})`}>
      <circle cx={0} cy={-40} r={240} fill="url(#d1Glow)" opacity={lit} />
      <ellipse cx={0} cy={58} rx={160} ry={34} fill="url(#d1Pool)" opacity={0.9 * lit} />
      <ellipse cx={0} cy={36} rx={70} ry={16} fill="#4A1C0C" />
      {spouts.map(([x, y, a], i) => (
        <path key={i} d="M-16 0C-14 -14 14 -14 16 0L0 34Z" transform={`translate(${x * 0.86} ${y * 0.86}) rotate(${a})`} fill="url(#d1Clay)" stroke="#3A1608" strokeWidth={3} />
      ))}
      <ellipse cx={0} cy={0} rx={96} ry={42} fill="url(#d1Clay)" stroke="#3A1608" strokeWidth={3} />
      <ellipse cx={0} cy={-4} rx={78} ry={30} fill="url(#d1Oil)" />
      <path d="M-84 6C-50 28 50 28 84 6" stroke="#E08A56" strokeWidth={3} fill="none" opacity={0.8} />
      {[-40, -20, 0, 20, 40].map((x, i) => (
        <circle key={x} cx={x} cy={22} r={3} fill={i % 2 ? P.flame : "#E8463A"} />
      ))}
      {spouts.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y - 10}) scale(${i === 3 ? 0.8 : 1})`}>
          <Flame f={f + i * 7} k={lit} seed={`cm${i}`} scale={1.15} />
        </g>
      ))}
    </g>
  );
};

/** A rangoli in perspective (concentric petals and dots); origin = centre on the floor. */
const Rangoli: React.FC<{ f: number }> = ({ f }) => {
  const rings: [number, string, number][] = [
    [330, "#E0457F", 16],
    [270, "#F2C230", 14],
    [210, "#F28C12", 12],
    [150, "#3FA8D8", 10],
    [96, "#FFFFFF", 8],
  ];
  return (
    <g transform="scale(1 0.36)">
      <circle r={350} fill="#3A1A10" opacity={0.35} />
      {rings.map(([r, c, n], ri) =>
        Array.from({ length: n }, (_, i) => {
          const a = (i / n) * 360 + ri * 9;
          return (
            <g key={`${ri}-${i}`} transform={`rotate(${a}) translate(0 ${-r})`}>
              <path d={`M0 ${-r * 0.16}C${r * 0.09} ${-r * 0.06} ${r * 0.09} ${r * 0.08} 0 ${r * 0.16}C${-r * 0.09} ${r * 0.08} ${-r * 0.09} ${-r * 0.06} 0 ${-r * 0.16}Z`} fill={c} opacity={0.92} />
            </g>
          );
        }),
      )}
      {Array.from({ length: 36 }, (_, i) => {
        const a = (i / 36) * Math.PI * 2;
        return <circle key={i} cx={Math.cos(a) * 360} cy={Math.sin(a) * 360} r={7} fill="#FFFFFF" opacity={0.7 + 0.3 * Math.sin(f / 9 + i)} />;
      })}
      <circle r={60} fill="#B3262E" />
      <circle r={40} fill="#F2C230" />
    </g>
  );
};

export const Doorstep: React.FC<{ f: number; push?: number }> = ({ f, push = 0 }) => {
  const z = 1 + 0.12 * push;
  return (
    <g transform={`translate(540 1480) scale(${z}) translate(-540 -1480)`}>
      <defs>
        <linearGradient id="d2Wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A2A4A" />
          <stop offset="0.6" stopColor="#7A4A3A" />
          <stop offset="1" stopColor="#B8784A" />
        </linearGradient>
        <linearGradient id="d2Door" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3A1A0A" />
          <stop offset="0.5" stopColor="#6A3418" />
          <stop offset="1" stopColor="#3A1A0A" />
        </linearGradient>
        <linearGradient id="d2Floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5A2E1E" />
          <stop offset="1" stopColor="#2A140C" />
        </linearGradient>
      </defs>
      <rect x={-80} y={-80} width={W + 160} height={1420} fill="url(#d2Wall)" />
      {/* door frame, carved doors, gold studs */}
      <rect x={220} y={240} width={640} height={1040} rx={10} fill="#4A2A18" stroke="#C8892A" strokeWidth={8} />
      <path d="M240 260L840 260L840 1270L240 1270Z" fill="url(#d2Door)" />
      <path d="M540 260L540 1270" stroke="#2A1208" strokeWidth={8} />
      {[0, 1].map((side) =>
        [380, 620, 860, 1100].map((y) => (
          <g key={`${side}${y}`}>
            <rect x={side ? 580 : 280} y={y - 90} width={220} height={170} rx={14} fill="none" stroke="#8A5A2A" strokeWidth={6} />
            <circle cx={side ? 690 : 390} cy={y - 5} r={26} fill="none" stroke="#C8892A" strokeWidth={4} opacity={0.8} />
          </g>
        )),
      )}
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i}>
          <circle cx={264} cy={300 + i * 132} r={7} fill="url(#mGold)" />
          <circle cx={816} cy={300 + i * 132} r={7} fill="url(#mGold)" />
        </g>
      ))}
      <circle cx={514} cy={800} r={14} fill="url(#mGold)" />
      <circle cx={566} cy={800} r={14} fill="url(#mGold)" />
      {/* toran and fairy lights on the frame */}
      <Garland x1={210} y1={250} x2={870} y2={250} sag={70} seed="d2t" />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d="M0 0C-12 18 -10 44 0 60C10 44 12 18 0 0Z" transform={`translate(${250 + i * 72} ${276 + 70 * 4 * (i / 8) * (1 - i / 8)})`} fill="#3F8C41" stroke="#1F5A1E" strokeWidth={2} />
      ))}
      {Array.from({ length: 22 }, (_, i) => {
        const left = i < 11;
        const y = 300 + (i % 11) * 92;
        return <circle key={i} cx={left ? 220 : 860} cy={y} r={12} fill="url(#c1Bulb)" opacity={0.6 + 0.4 * (0.5 + 0.5 * wob(`d2fl${i}`, f / 8))} />;
      })}
      {/* wall lamps on brackets */}
      {[120, 960].map((x, i) => (
        <g key={x} transform={`translate(${x} 760)`}>
          <rect x={-40} y={20} width={80} height={10} fill="#4A2A18" />
          <g transform="scale(0.55)">
            <Flame f={f + i * 11} k={1} seed={`wl${i}`} scale={1.2} />
          </g>
          <circle r={90} fill="url(#d1Glow)" opacity={0.6} />
        </g>
      ))}
      {/* threshold and floor */}
      <rect x={180} y={1270} width={720} height={60} fill="#7A5A44" stroke="#4A3424" strokeWidth={4} />
      <rect x={-80} y={1330} width={W + 160} height={H - 1330 + 80} fill="url(#d2Floor)" />
      <g transform="translate(540 1520)">
        <Rangoli f={f} />
      </g>
      <g transform="translate(540 1500)">
        <Chaumukha f={f} lit={1} s={1.1} />
      </g>
      <Strand f={f} y1={-20} y2={-20} sag={60} seed="d2s" />
    </g>
  );
};

/** Wall-lamp positions in the palace, lit in order by `lamps` (DiyaWave timing is supplied by the scene). */
export const PALACE_LAMPS: [number, number][] = [
  [80, 1260], [200, 1300], [330, 1330], [750, 1330], [880, 1300], [1000, 1260],
  [150, 900], [930, 900], [180, 640], [900, 640], [420, 1380], [660, 1380],
];

export const Palace: React.FC<{ f: number; lampsAt?: number; gold?: number; dawn?: number; push?: number }> = ({
  f, lampsAt = 99999, gold = 0, dawn = 0, push = 0,
}) => {
  const z = 1 + 0.08 * push;
  const g = Math.max(0, Math.min(1, gold));
  return (
    <g transform={`translate(540 1100) scale(${z}) translate(-540 -1100)`}>
      <defs>
        <linearGradient id="d2Night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0E1030" />
          <stop offset="1" stopColor="#2A2A5A" />
        </linearGradient>
        <linearGradient id="d2DawnDoor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5A5A9A" />
          <stop offset="0.6" stopColor="#E89A6A" />
          <stop offset="1" stopColor="#FFD8A0" />
        </linearGradient>
        <linearGradient id="d2Carpet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5A1018" />
          <stop offset="1" stopColor="#2A0810" />
        </linearGradient>
      </defs>
      <rect x={-80} y={-80} width={W + 160} height={1430} fill="#2A1428" />
      {/* the central doorway to the night (dawn later) */}
      <path d="M380 1260L380 560C380 440 460 380 540 380C620 380 700 440 700 560L700 1260Z" fill="url(#d2Night)" />
      <path d="M380 1260L380 560C380 440 460 380 540 380C620 380 700 440 700 560L700 1260Z" fill="url(#d2DawnDoor)" opacity={dawn} />
      {Array.from({ length: 16 }, (_, i) => (
        <circle key={i} cx={400 + rnd(`d2st${i}`) * 280} cy={420 + rnd(`d2sy${i}`) * 500} r={1.5 + rnd(`d2sr${i}`) * 2} fill="#FFF6E0" opacity={(0.4 + 0.5 * wob(`d2sw${i}`, f / 10)) * (1 - dawn)} />
      ))}
      <path d="M380 1260L380 560C380 440 460 380 540 380C620 380 700 440 700 560L700 1260" fill="none" stroke="#C8892A" strokeWidth={10} />
      {/* side arches with curtains */}
      {[180, 900].map((cx, i) => (
        <g key={cx}>
          <path d={`M${cx - 120} 1200L${cx - 120} 640C${cx - 120} 540 ${cx - 60} 490 ${cx} 490C${cx + 60} 490 ${cx + 120} 540 ${cx + 120} 640L${cx + 120} 1200Z`} fill="#3E1E36" stroke="#C8892A" strokeWidth={6} />
          <path d={`M${cx - 120} 560C${cx - 60} 700 ${cx - 70} 980 ${cx - 110} 1200L${cx - 120} 1200Z`} fill="#8E1A24" />
          <path d={`M${cx + 120} 560C${cx + 60} 700 ${cx + 70} 980 ${cx + 110} 1200L${cx + 120} 1200Z`} fill="#8E1A24" />
          <path d={`M${cx - 120} 560C${cx - 60} 700 ${cx - 70} 980 ${cx - 110} 1200`} stroke="#F2C25A" strokeWidth={4} fill="none" opacity={0.7} />
          <path d={`M${cx + 120} 560C${cx + 60} 700 ${cx + 70} 980 ${cx + 110} 1200`} stroke="#F2C25A" strokeWidth={4} fill="none" opacity={0.7} />
          <circle cx={cx} cy={600} r={22 + i * 0} fill="url(#mGold)" opacity={0.7} />
        </g>
      ))}
      {/* pillars */}
      {[320, 760].map((x) => (
        <g key={x}>
          <rect x={x - 26} y={360} width={52} height={900} fill="#4A2A3A" stroke="#C8892A" strokeWidth={4} />
          <rect x={x - 36} y={340} width={72} height={30} fill="url(#mGold)" />
          <rect x={x - 36} y={1240} width={72} height={30} fill="url(#mGold)" />
        </g>
      ))}
      {/* carpet floor */}
      <path d="M-80 1260L1160 1260L1160 2000L-80 2000Z" fill="url(#d2Carpet)" />
      <path d="M220 1260L860 1260L1000 2000L80 2000Z" fill="none" stroke="#C8892A" strokeWidth={8} opacity={0.6} />
      <path d="M380 1258L700 1258" stroke="#C8892A" strokeWidth={10} />
      {/* gold and silver at the threshold */}
      {g > 0.01 ? (
        <g opacity={g}>
          <Stack x={420} y={1300} n={Math.round(2 + 4 * g)} s={0.9} />
          <Stack x={540} y={1290} n={Math.round(2 + 5 * g)} s={0.95} />
          <Stack x={660} y={1300} n={Math.round(2 + 4 * g)} s={0.9} silver />
          {Array.from({ length: 10 }, (_, i) => (
            <Coin key={i} x={360 + rnd(`d2c${i}`) * 360} y={1330 + rnd(`d2cy${i}`) * 50} s={0.75} silver={i % 3 === 0} />
          ))}
        </g>
      ) : null}
      <DiyaWave f={f} at={lampsAt} points={PALACE_LAMPS} step={4} scale={0.5} seed="d2pl" />
    </g>
  );
};

/** The prince (turban) and the bride (veil) facing each other: rim-lit legend silhouettes. Origin = between them, at the feet. */
export const Couple: React.FC<{ f: number; worry?: number }> = ({ f, worry = 0 }) => {
  const prince: V = [-150, 0];
  const bride: V = [150, 0];
  const lean = worry * 4;
  return (
    <g>
      {/* prince in a sherwani, facing right */}
      <g transform={`translate(${prince[0]} ${prince[1]}) rotate(${lean})`}>
        <Lit d="M-70 -620C-60 -660 -20 -680 20 -676C56 -670 74 -640 72 -600C76 -420 84 -200 92 0L-96 0C-92 -200 -86 -420 -70 -620Z" fill="url(#m1KurtaL)" />
        <path d="M-60 -520L64 -520" stroke="#E8B24A" strokeWidth={5} opacity={0.6} />
        <g transform="translate(4 -748)">
          <HeadR f={f} seed="prince" hair="short" s={0.95} tilt={-4} />
          {/* pagdi turban with a kalgi */}
          <path d="M-46 -40C-40 -76 30 -84 46 -50C50 -36 40 -26 30 -30C10 -40 -24 -40 -44 -26Z" fill="#C8892A" />
          <path d="M-40 -46C-10 -58 24 -60 42 -48" stroke="#FFE6A3" strokeWidth={3} fill="none" opacity={0.7} />
          <path d="M20 -74C26 -100 36 -112 44 -120" stroke="#F6EBD6" strokeWidth={5} strokeLinecap="round" fill="none" />
          <circle cx={18} cy={-70} r={6} fill="#E8463A" />
        </g>
        <Lit d={limb([40, -600], [90, -440], 30, 18, -8)} fill="url(#m1KurtaL)" rim={0.8} />
      </g>
      {/* bride in a red lehenga with a veil, facing left (mirrored) */}
      <g transform={`translate(${bride[0]} ${bride[1]}) scale(-1 1) rotate(${lean})`}>
        <Lit d="M-60 -600C-50 -640 -10 -650 24 -644C54 -638 66 -610 62 -580C70 -420 110 -200 150 0L-160 0C-120 -200 -76 -420 -60 -600Z" fill="url(#m1FrockR)" />
        <path d="M-150 -30C-60 -10 60 -10 140 -30" stroke="#E8B24A" strokeWidth={8} fill="none" opacity={0.9} />
        <g transform="translate(2 -700)">
          <HeadR f={f} seed="bride" hair="bun" bindi s={0.88} tilt={-6} />
          {/* the veil over her head and down her back */}
          <path d="M40 -40C20 -78 -30 -86 -58 -60C-80 -36 -86 10 -78 60L-120 200L-80 120C-60 60 -50 0 -42 -30C-20 -58 16 -58 38 -36Z" fill="#B3262E" opacity={0.92} />
          <path d="M40 -40C20 -78 -30 -86 -58 -60C-80 -36 -86 10 -78 60" stroke="#F2C25A" strokeWidth={5} fill="none" />
        </g>
        <Lit d={limb([36, -580], [70, -430], 26, 15, -6)} fill="url(#m1LitR)" rim={0.8} />
      </g>
    </g>
  );
};

/** The bride alone, holding up an aarti thali with a lit diya (03). Origin = feet; facing right. */
export const BrideThali: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <Lit d="M-60 -600C-50 -640 -10 -650 24 -644C54 -638 66 -610 62 -580C70 -420 110 -200 150 0L-160 0C-120 -200 -76 -420 -60 -600Z" fill="url(#m1FrockR)" />
    <path d="M-150 -30C-60 -10 60 -10 140 -30" stroke="#E8B24A" strokeWidth={8} fill="none" opacity={0.9} />
    <g transform="translate(2 -700)">
      <HeadR f={f} seed="bride3" hair="bun" bindi s={0.88} tilt={-2} />
      <path d="M40 -40C20 -78 -30 -86 -58 -60C-80 -36 -86 10 -78 60L-120 200L-80 120C-60 60 -50 0 -42 -30C-20 -58 16 -58 38 -36Z" fill="#B3262E" opacity={0.92} />
      <path d="M40 -40C20 -78 -30 -86 -58 -60C-80 -36 -86 10 -78 60" stroke="#F2C25A" strokeWidth={5} fill="none" />
    </g>
    <Lit d={limb([36, -580], [150, -520], 26, 15, -10)} fill="url(#m1LitR)" />
    <Lit d={limb([-20, -580], [130, -500], 26, 15, 10)} fill="url(#m1LitR)" rim={0.7} />
    <g transform="translate(170 -516)">
      <ellipse cx={0} cy={0} rx={70} ry={16} fill="url(#mGold)" stroke="#6B410F" strokeWidth={3} />
      <circle cx={-34} cy={-6} r={6} fill="#E8463A" />
      <circle cx={34} cy={-6} r={6} fill="#F2C230" />
      <g transform="translate(0 -10) scale(0.7)">
        <Flame f={f} k={1} seed="thali" scale={1.2} />
      </g>
      <circle cx={0} cy={-40} r={70} fill="url(#d1Glow)" opacity={0.9} />
    </g>
  </g>
);
