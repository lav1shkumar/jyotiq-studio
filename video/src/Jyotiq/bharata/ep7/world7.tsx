import React from "react";

/*
 * भारत Ep7 sets: Ekalavya's forest and Drona's gurukul (Adi Parva, sec. CXXXIV).
 *  - Forest7: the deep jungle where the clay guru stands — layered canopy, slanting light shafts, mist, leaf litter.
 *    tod: day (green-gold), golden (late amber), dusk (blue-shadowed). The demand scene is the same forest at golden.
 *  - Gurukul: Drona's archery academy on the forest fringe near Hastinapur: open training ground, grass, huts, a weapon
 *    rack, the forest wall behind, a wide tree. Bright, privileged, open — the visual opposite of Ekalavya's forest floor.
 *  - ArenaDusk: a far, empty tourney field at dusk for the Karna seed (unnamed silhouette is drawn in the board).
 */
const W = 1080;
const H = 1920;
const rnd = (i: number, k = 1) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const W7Defs: React.FC = () => (
  <defs>
    <linearGradient id="k7SkyDay" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#9FC8E8" />
      <stop offset="0.5" stopColor="#D8E8C0" />
      <stop offset="1" stopColor="#F2E0A8" />
    </linearGradient>
    <linearGradient id="k7SkyGolden" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#E8A85A" />
      <stop offset="0.5" stopColor="#F6C878" />
      <stop offset="1" stopColor="#FFE2A8" />
    </linearGradient>
    <linearGradient id="k7SkyDusk" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#1E2440" />
      <stop offset="0.55" stopColor="#4A3A54" />
      <stop offset="1" stopColor="#8A5A48" />
    </linearGradient>
    <linearGradient id="k7Floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#5E5A34" />
      <stop offset="1" stopColor="#2E2416" />
    </linearGradient>
    <linearGradient id="k7GuruSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#8EC0E8" />
      <stop offset="0.55" stopColor="#D0E4C8" />
      <stop offset="1" stopColor="#F0E6BC" />
    </linearGradient>
    <linearGradient id="k7GuruGround" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#9AA860" />
      <stop offset="1" stopColor="#5E6A34" />
    </linearGradient>
    <linearGradient id="k7ArenaSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#201A38" />
      <stop offset="0.5" stopColor="#6A3450" />
      <stop offset="0.78" stopColor="#C86A3E" />
    </linearGradient>
    <linearGradient id="k7Beam" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stopColor="#FFF4C8" stopOpacity="0.5" />
      <stop offset="1" stopColor="#FFF4C8" stopOpacity="0" />
    </linearGradient>
    <filter id="k7Blur8" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" />
    </filter>
    <filter id="k7Blur22" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="22" />
    </filter>
  </defs>
);

/** One jungle tree: trunk with root flares and a leaf-mass canopy. */
const Tree: React.FC<{ x: number; y: number; s?: number; trunk?: string; leaf?: string; leafHi?: string; f?: number; swayK?: number }> = ({
  x,
  y,
  s = 1,
  trunk = "#4A3220",
  leaf = "#3E5A2E",
  leafHi = "#567A3C",
  f = 60,
  swayK = 1,
}) => {
  const sw = Math.sin(f / 34 + x / 90) * 3 * swayK;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-26 0C-20 -160 -16 -320 -12 -440L20 -440C22 -320 26 -160 34 0Z" fill={trunk} />
      <path d="M-26 0C-14 -24 16 -26 34 0Z" fill="#3A2618" />
      {[0, 1].map((i) => (
        <path key={i} d={`M${i ? 20 : -14} -${300 + i * 90}C${i ? 60 : -60} -${330 + i * 90} ${i ? 90 : -90} -${380 + i * 90} ${i ? 130 : -130} -${390 + i * 90}`} stroke={trunk} strokeWidth={12} fill="none" />
      ))}
      <g transform={`translate(${sw} -480)`}>
        <ellipse cx={0} cy={0} rx={180} ry={130} fill={leaf} />
        <ellipse cx={-120} cy={40} rx={130} ry={95} fill={leaf} />
        <ellipse cx={120} cy={36} rx={135} ry={100} fill={leaf} />
        <ellipse cx={-40} cy={-70} rx={120} ry={85} fill={leafHi} opacity={0.85} />
        <ellipse cx={80} cy={-50} rx={90} ry={65} fill={leafHi} opacity={0.7} />
      </g>
    </g>
  );
};

const Fern: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = "#4E6E36" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-70, -35, 0, 35, 70].map((a) => (
      <path key={a} d="M0 0C-4 -30 -14 -52 -30 -66" stroke={c} strokeWidth={5} fill="none" transform={`rotate(${a})`} />
    ))}
  </g>
);

/** Deep forest. horizon ~1180; trees layered far/mid/near; light shafts; mist; leaf litter. */
export const Forest7: React.FC<{ f: number; tod?: "day" | "golden" | "dusk"; beams?: number; mist?: number; dense?: number; floorY?: number }> = ({
  f,
  tod = "day",
  beams = 1,
  mist = 0.5,
  dense = 1,
  floorY = 1240,
}) => {
  const sky = tod === "day" ? "url(#k7SkyDay)" : tod === "golden" ? "url(#k7SkyGolden)" : "url(#k7SkyDusk)";
  const dim = tod === "dusk" ? 0.45 : tod === "golden" ? 0.12 : 0;
  const leaf = tod === "dusk" ? "#22301E" : "#3E5A2E";
  const leafHi = tod === "dusk" ? "#2E4028" : tod === "golden" ? "#7A9440" : "#567A3C";
  const trunk = tod === "dusk" ? "#2E2014" : "#4A3220";
  return (
    <g>
      <rect width={W} height={H} fill={sky} />
      {tod !== "dusk" ? (
        <g>
          <circle cx={760} cy={420} r={tod === "golden" ? 130 : 100} fill="#FFF6DA" opacity={0.9} />
          <circle cx={760} cy={420} r={380} fill={tod === "golden" ? "#FFCE7A" : "#FFF0B8"} opacity={0.3} filter="url(#k7Blur22)" />
        </g>
      ) : null}
      {/* far tree masses */}
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse key={i} cx={-60 + i * 165} cy={950 + (i % 3) * 30} rx={150} ry={200} fill={leaf} opacity={tod === "dusk" ? 0.8 : 0.6} />
      ))}
      {/* mid trees */}
      <Tree x={140} y={floorY + 90} s={1.15} trunk={trunk} leaf={leaf} leafHi={leafHi} f={f} />
      <Tree x={880} y={floorY + 70} s={1.3} trunk={trunk} leaf={leaf} leafHi={leafHi} f={f + 20} />
      {dense > 0.5 ? <Tree x={560} y={floorY + 30} s={0.8} trunk={trunk} leaf={leaf} leafHi={leafHi} f={f + 40} /> : null}
      {/* light shafts */}
      {beams > 0.01 && tod !== "dusk" ? (
        <g opacity={beams * (tod === "golden" ? 0.85 : 0.6)} style={{ mixBlendMode: "screen" }}>
          {[220, 480, 720].map((x, i) => (
            <path key={i} d={`M${x + 200} 100L${x + 330} 100L${x - 100 + Math.sin(f / 50 + i) * 12} ${floorY + 200}L${x - 230 + Math.sin(f / 50 + i) * 12} ${floorY + 200}Z`} fill="url(#k7Beam)" />
          ))}
        </g>
      ) : null}
      {/* floor */}
      <rect y={floorY} width={W} height={H - floorY} fill="url(#k7Floor)" />
      <path d={`M0 ${floorY}C260 ${floorY - 24} 600 ${floorY + 18} 1080 ${floorY - 12}L1080 ${floorY + 60}C600 ${floorY + 80} 260 ${floorY + 40} 0 ${floorY + 62}Z`} fill={tod === "dusk" ? "#2E3A22" : "#6A7A40"} opacity={0.85} />
      {Array.from({ length: 34 }, (_, i) => (
        <ellipse key={i} cx={rnd(i, 1) * W} cy={floorY + 40 + rnd(i, 2) * (H - floorY - 60)} rx={8 + rnd(i, 3) * 18} ry={3.5 + rnd(i, 4) * 5} fill={i % 3 ? "#8A6A34" : "#5E4A22"} opacity={0.5} />
      ))}
      <Fern x={120} y={floorY + 210} s={1.1} c={tod === "dusk" ? "#2E4028" : "#4E6E36"} />
      <Fern x={960} y={floorY + 260} s={1.25} c={tod === "dusk" ? "#2E4028" : "#476430"} />
      <Fern x={520} y={floorY + 340} s={0.9} c={tod === "dusk" ? "#263620" : "#40592C"} />
      {/* mist */}
      {mist > 0.01 ? (
        <g opacity={mist}>
          {[0, 1, 2].map((i) => (
            <ellipse key={i} cx={((f * (0.5 + i * 0.2) + i * 420) % (W + 700)) - 350} cy={floorY + 60 + i * 130} rx={420} ry={70} fill="#E8EEE0" opacity={0.16} filter="url(#k7Blur22)" />
          ))}
        </g>
      ) : null}
      {/* motes / fireflies in the shafts */}
      {tod !== "dusk"
        ? Array.from({ length: 14 }, (_, i) => (
            <circle key={i} cx={rnd(i, 7) * W} cy={500 + rnd(i, 8) * 700} r={2 + rnd(i, 9) * 2.5} fill="#FFF2C0" opacity={0.25 + 0.35 * Math.abs(Math.sin(f / 22 + i * 2))} />
          ))
        : Array.from({ length: 20 }, (_, i) => (
            <circle key={i} cx={rnd(i, 7) * W} cy={600 + rnd(i, 8) * 900} r={2.4 + rnd(i, 9) * 2.2} fill="#D8FF9A" opacity={0.3 + 0.5 * Math.abs(Math.sin(f / 16 + i * 2.4))} />
          ))}
      {/* dark foreground trunks framing the edges */}
      <path d="M-30 1920C-10 1400 -20 800 10 200L110 200C90 800 100 1400 130 1920Z" fill={tod === "dusk" ? "#16100A" : "#241812"} opacity={0.92} />
      <path d="M1000 1920C1016 1400 1010 800 1036 260L1120 260L1120 1920Z" fill={tod === "dusk" ? "#16100A" : "#241812"} opacity={0.9} />
      {dim > 0 ? <rect width={W} height={H} fill="#101830" opacity={dim} /> : null}
    </g>
  );
};

const GuruHut: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-90 0L-80 -70L80 -70L90 0Z" fill="#8A5E36" />
    <path d="M-120 -60L0 -150L120 -60Z" fill="#C89A54" />
    <path d="M-120 -60L0 -150L0 -60Z" fill="#9A7438" opacity={0.6} />
    <path d="M-22 0L-22 -50L22 -50L22 0Z" fill="#2A180C" />
  </g>
);

/** Drona's archery academy: open ground, a wide tree, huts, a bow rack; the forest wall behind; bright and open. */
export const Gurukul: React.FC<{ f: number; horizon?: number }> = ({ f, horizon = 1180 }) => (
  <g>
    <rect width={W} height={H} fill="url(#k7GuruSky)" />
    <circle cx={280} cy={360} r={95} fill="#FFF8E0" opacity={0.95} />
    <circle cx={280} cy={360} r={330} fill="#FFF0B8" opacity={0.3} filter="url(#k7Blur22)" />
    {/* the forest wall behind the clearing */}
    {Array.from({ length: 9 }, (_, i) => (
      <g key={i}>
        <ellipse cx={-30 + i * 140} cy={horizon - 130 + (i % 2) * 16} rx={110} ry={130} fill="#4E6E36" />
        <rect x={-40 + i * 140} y={horizon - 90} width={18} height={100} fill="#4A3220" />
      </g>
    ))}
    {/* ground */}
    <rect y={horizon} width={W} height={H - horizon} fill="url(#k7GuruGround)" />
    <path d={`M0 ${horizon + 40}C300 ${horizon + 16} 700 ${horizon + 60} 1080 ${horizon + 30}L1080 ${horizon + 90}C700 ${horizon + 110} 300 ${horizon + 70} 0 ${horizon + 100}Z`} fill="#8A9A54" opacity={0.7} />
    {/* practice lanes: worn bare strips */}
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M${120 + i * 340} ${horizon + 30}C${150 + i * 340} ${horizon + 200} ${140 + i * 340} ${horizon + 420} ${170 + i * 340} ${H}`} stroke="#9A8A56" strokeWidth={60} opacity={0.5} fill="none" />
    ))}
    {/* huts on the left */}
    <GuruHut x={170} y={horizon + 60} s={1.0} />
    <GuruHut x={330} y={horizon + 44} s={0.7} />
    {/* the wide tree on the right */}
    <Tree x={930} y={horizon + 120} s={1.35} f={f} />
    {/* a bow rack: posts + leaning bows */}
    <g transform={`translate(620 ${horizon + 130})`}>
      <path d="M-90 0L-90 -120M90 0L90 -120M-96 -116L96 -116" stroke="#5A3A22" strokeWidth={10} strokeLinecap="round" />
      {[-52, -18, 18, 52].map((x, i) => (
        <path key={i} d={`M${x} 0C${x - 16} -60 ${x - 16} -110 ${x - 6} -150`} stroke={i % 2 ? "#6A3E1E" : "#4A2810"} strokeWidth={7} fill="none" />
      ))}
    </g>
    {/* scattered grass tufts */}
    {Array.from({ length: 26 }, (_, i) => (
      <path key={i} d={`M${rnd(i, 5) * W} ${horizon + 60 + rnd(i, 6) * (H - horizon - 80)}l4 -22l4 22M${rnd(i, 5) * W + 7} ${horizon + 60 + rnd(i, 6) * (H - horizon - 80)}l3 -16l4 16`} stroke="#5E7A34" strokeWidth={3.4} fill="none" />
    ))}
  </g>
);

/** A far, empty tourney field at dusk for the seed panel: dusty ground, a distant gallery silhouette, a low red sun. */
export const ArenaDusk: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={W} height={H} fill="url(#k7ArenaSky)" />
    <circle cx={540} cy={1060} r={120} fill="#FF9A5A" opacity={0.9} />
    <circle cx={540} cy={1060} r={400} fill="#FF7A3A" opacity={0.3} filter="url(#k7Blur22)" />
    {/* distant gallery silhouette */}
    <path d="M0 1100L1080 1100L1080 1000C980 960 880 1000 800 980C700 952 600 990 500 972C400 950 300 990 200 972C120 956 40 990 0 980Z" fill="#161022" />
    {Array.from({ length: 16 }, (_, i) => (
      <path key={i} d={`M${i * 70 + 20} 1100L${i * 70 + 20} ${1052 - (i % 3) * 8}L${i * 70 + 40} ${1052 - (i % 3) * 8}L${i * 70 + 40} 1100Z`} fill="#161022" />
    ))}
    {/* dusty ground */}
    <rect y={1100} width={W} height={H - 1100} fill="#3A2430" />
    <path d="M0 1100C300 1080 700 1120 1080 1090L1080 1160C700 1180 300 1150 0 1170Z" fill="#4A2E3A" opacity={0.8} />
    {[0, 1, 2].map((i) => (
      <ellipse key={i} cx={((f * 0.4 + i * 500) % (W + 600)) - 300} cy={1300 + i * 160} rx={380} ry={60} fill="#8A5A48" opacity={0.12} filter="url(#k7Blur22)" />
    ))}
    {Array.from({ length: 30 }, (_, i) => (
      <ellipse key={i} cx={rnd(i, 1) * W} cy={1150 + rnd(i, 2) * 700} rx={7 + rnd(i, 3) * 15} ry={3 + rnd(i, 4) * 5} fill="#1E1218" opacity={0.4} />
    ))}
  </g>
);
