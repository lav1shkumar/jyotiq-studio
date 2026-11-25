import React from "react";
import { rnd, W } from "../../manthan/style";
import { Diya } from "../d1/diya";

/* Diwali Day 4 sets, part 1.
   AnnakootThali: the hook's brass thali with a conical hill of mixed food (a rice mound flecked with vegetables,
   tulsi on top, laddoos and puris round the base) ringed by six lit diyas.
   GovardhanHill: the same outline (MOUND_PATH) as a wooded hill, so the food hill can dissolve into Govardhan on the
   title (a shape match), and Krishna can hold it by its flat underside in 04.
   Both have their origin at the base centre (y up is negative); the mound is 460 x 304 at s 1. */

export const MOUND_PATH = "M-230 0C-200 -50 -150 -160 -80 -240C-40 -286 -10 -302 0 -304C10 -302 40 -286 80 -240C150 -160 200 -50 230 0Z";
/** The mound's half width at height y (0 at the base, -304 at the peak). */
const halfW = (y: number) => 230 * (1 - Math.pow(Math.min(1, Math.max(0, -y / 304)), 1.6));

const FLECK_COLS = ["#4C9A2A", "#E8792B", "#F2C230", "#C8302E", "#8A5A2B", "#6BB33A"];
const FLECKS = Array.from({ length: 90 }, (_, i) => {
  const y = -6 - rnd(`ak4y${i}`) * 284;
  return {
    x: (rnd(`ak4x${i}`) * 2 - 1) * halfW(y) * 0.9,
    y,
    rx: 6 + 5 * rnd(`ak4r${i}`),
    ry: 3 + 3 * rnd(`ak4q${i}`),
    rot: rnd(`ak4a${i}`) * 180,
    c: FLECK_COLS[Math.floor(rnd(`ak4c${i}`) * FLECK_COLS.length)],
  };
});
const RIM_DIYAS: [number, number][] = [[-336, 14], [-290, 62], [-110, 98], [110, 98], [290, 62], [336, 14]];

export const AnnakootThali: React.FC<{ f: number; s?: number }> = ({ f, s = 1 }) => (
  <g transform={`scale(${s})`}>
    <defs>
      <linearGradient id="d4Brass" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#8A5A12" />
        <stop offset="0.5" stopColor="#E8B84A" />
        <stop offset="1" stopColor="#8A5A12" />
      </linearGradient>
      <linearGradient id="d4Rice" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFF6E4" />
        <stop offset="1" stopColor="#D9C49A" />
      </linearGradient>
    </defs>
    <ellipse cx={0} cy={10} rx={352} ry={92} fill="url(#d4Brass)" />
    <ellipse cx={0} cy={6} rx={318} ry={76} fill="#B5832E" />
    <ellipse cx={0} cy={10} rx={352} ry={92} fill="none" stroke="#FFE6A3" strokeWidth={4} opacity={0.7} />
    <path d={MOUND_PATH} fill="url(#d4Rice)" />
    {FLECKS.map((k, i) => (
      <ellipse key={i} cx={k.x} cy={k.y} rx={k.rx} ry={k.ry} fill={k.c} transform={`rotate(${k.rot} ${k.x} ${k.y})`} />
    ))}
    {[-30, 0, 30].map((a) => (
      <path key={a} d="M0 -300C-12 -320 -8 -340 0 -348C8 -340 12 -320 0 -300Z" fill="#3E8E2E" transform={`rotate(${a} 0 -300)`} />
    ))}
    {Array.from({ length: 11 }, (_, i) => {
      const x = -250 + i * 50;
      return i % 2 ? (
        <ellipse key={i} cx={x} cy={-8} rx={30} ry={13} fill="#D9A050" stroke="#A8702A" strokeWidth={2} />
      ) : (
        <g key={i}>
          <circle cx={x} cy={-14} r={20} fill="#F2A23A" />
          <circle cx={x - 6} cy={-20} r={7} fill="#FFD27A" opacity={0.8} />
        </g>
      );
    })}
    {RIM_DIYAS.map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y})`}>
        <Diya f={f} lit={1} seed={`ak4d${i}`} scale={0.34} glow={1} />
      </g>
    ))}
  </g>
);

const TREES = Array.from({ length: 42 }, (_, i) => {
  const y = -18 - rnd(`gh4ty${i}`) * 276;
  return { x: (rnd(`gh4tx${i}`) * 2 - 1) * halfW(y) * 0.95, y, r: 18 + 12 * rnd(`gh4r${i}`), tone: rnd(`gh4c${i}`) };
}).sort((a, b) => a.y - b.y); // far (high) trees first, so the lower ones overlap them
const ROCKS = Array.from({ length: 8 }, (_, i) => {
  const y = -20 - rnd(`gh4ry${i}`) * 220;
  return { x: (rnd(`gh4rx${i}`) * 2 - 1) * halfW(y) * 0.6, y, rx: 16 + 12 * rnd(`gh4rr${i}`) };
});

/** Govardhan: the food mound's outline as a wooded hill. Dense layered trees break the outline (no hard edge), with
    rocks and a light gradient; `wet` 0..1 brightens the storm sheen on the left slope. */
export const GovardhanHill: React.FC<{ f: number; s?: number; wet?: number }> = ({ f, s = 1, wet = 0 }) => (
  <g transform={`scale(${s})`}>
    <defs>
      <linearGradient id="d4Hill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2E4A26" />
        <stop offset="1" stopColor="#141E0E" />
      </linearGradient>
    </defs>
    <path d={MOUND_PATH} fill="url(#d4Hill)" />
    {ROCKS.map((r, i) => (
      <ellipse key={i} cx={r.x} cy={r.y} rx={r.rx} ry={r.rx * 0.55} fill="#4A4838" />
    ))}
    {TREES.map((t, i) => (
      <g key={i}>
        <circle cx={t.x} cy={t.y} r={t.r} fill={t.tone < 0.5 ? "#1E3A1C" : "#244620"} />
        <circle cx={t.x - t.r * 0.3} cy={t.y - t.r * 0.32} r={t.r * 0.5} fill="#3A6A2E" opacity={0.7 + 0.2 * Math.sin(f / 13 + i)} />
      </g>
    ))}
    <circle cx={0} cy={-312} r={28} fill="#244620" />
    <path d="M-230 0C-200 -50 -150 -160 -80 -240C-40 -286 -10 -302 0 -304" fill="none" stroke="#C9D6F0" strokeWidth={3} opacity={0.2 + 0.3 * wet} />
  </g>
);

/* ------------------------------------------------------------------ */
/* 02: Gokul village offering to Indra                                 */
/* ------------------------------------------------------------------ */

const VSIL = "#2A1810";
const VRIM = "#FFB65A";

/** A villager raising a thali to the sky (a warm rim-lit silhouette, as the series draws everyday people). Origin at
    the feet; about 180 px tall at s 1. dress 1 = a saree, 0 = a dhoti. */
export const Villager: React.FC<{ x: number; y: number; s: number; flip?: boolean; dress: number }> = ({ x, y, s, flip, dress }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path
      d={dress ? "M-26 0C-30 -50 -24 -100 -16 -120H16C24 -100 30 -50 26 0Z" : "M-18 0L-14 -60L-20 -120H20L14 -60L18 0H6L2 -56H-2L-6 0Z"}
      fill={VSIL}
      stroke={VRIM}
      strokeWidth={2}
      strokeOpacity={0.7}
    />
    <path d="M-14 -116L-30 -170M14 -116L30 -170" stroke={VSIL} strokeWidth={9} strokeLinecap="round" />
    <path d="M-14 -116L-30 -170M14 -116L30 -170" stroke={VRIM} strokeWidth={2} strokeOpacity={0.6} fill="none" />
    <circle cy={-136} r={13} fill={VSIL} stroke={VRIM} strokeWidth={2} strokeOpacity={0.7} />
    <ellipse cy={-176} rx={36} ry={7} fill="#C8952E" stroke="#FFE6A3" strokeWidth={1.5} />
  </g>
);

const Hut: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-70} y={-90} width={140} height={90} fill="#6A4428" />
    <rect x={-18} y={-58} width={36} height={58} fill={VSIL} />
    <path d="M-96 -86L0 -170L96 -86Z" fill="#C9A25A" />
    {[-60, -30, 0, 30, 60].map((d) => (
      <path key={d} d={`M${d * 1.4} -88L0 -168`} stroke="#9C7A3A" strokeWidth={2} />
    ))}
    <path d="M-96 -86L0 -170L96 -86" fill="none" stroke={VRIM} strokeWidth={2.5} opacity={0.7} />
  </g>
);

/** A white Gokul cow, warm-lit. Origin at the hooves; about 130 px long at s 1. */
export const GCow: React.FC<{ x: number; y: number; s: number; flip?: boolean }> = ({ x, y, s, flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M-34 -30V0M-20 -28V0M22 -28V0M36 -30V0" stroke="#D9CBB4" strokeWidth={7} />
    <ellipse cx={0} cy={-44} rx={52} ry={24} fill="#EFE4D2" stroke={VRIM} strokeWidth={2} strokeOpacity={0.6} />
    <circle cx={56} cy={-58} r={16} fill="#EFE4D2" />
    <path d="M50 -72L44 -86M62 -72L68 -86" stroke="#8A6A3A" strokeWidth={3} strokeLinecap="round" />
    <circle cx={62} cy={-58} r={2.5} fill={VSIL} />
    <path d="M-50 -48C-62 -40 -64 -26 -60 -16" stroke="#D9CBB4" strokeWidth={3} fill="none" />
  </g>
);

/** Gokul at golden hour: a warm sky with Indra's golden cloud bank (glow 0..1 brightens it), Govardhan on the
    horizon, fields, thatched huts, cows and villagers raising offerings to the sky. Young Krishna is added by the
    scene (fully drawn, as the series draws myth figures). */
export const GokulVillage: React.FC<{ f: number; glow?: number }> = ({ f, glow = 0.5 }) => (
  <g>
    <defs>
      <linearGradient id="d4Gokul" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2A2350" />
        <stop offset="0.55" stopColor="#8A4A5A" />
        <stop offset="1" stopColor="#E8955A" />
      </linearGradient>
    </defs>
    <rect width={W} height={1200} fill="url(#d4Gokul)" />
    <g filter="url(#mBlur8)" opacity={0.35 + 0.4 * glow}>
      {[[120, 250, 70], [210, 220, 90], [320, 240, 80], [430, 210, 95], [550, 235, 85], [660, 215, 90], [770, 245, 80], [880, 225, 88], [980, 250, 70]].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy + Math.sin(f / 40 + i) * 5} r={r} fill="#F6D9A0" opacity={0.55} />
      ))}
    </g>
    <path d="M60 290C200 270 340 300 480 280C620 300 760 272 1020 292" fill="none" stroke="#FFE6A3" strokeWidth={3} opacity={0.25 + 0.35 * glow} />
    <ellipse cx={540} cy={250} rx={560} ry={120} fill="#FFE6A3" opacity={0.12 + 0.28 * glow} filter="url(#mBlur8)" />
    <g transform="translate(780 1180)">
      <GovardhanHill f={f} s={0.62} />
    </g>
    <path d="M0 1170C300 1150 700 1160 1080 1140V1920H0Z" fill="#3A4A22" />
    <path d="M0 1240C300 1220 700 1236 1080 1214V1920H0Z" fill="#2E3A1A" />
    <Hut x={360} y={1262} s={0.8} />
    <Hut x={130} y={1300} s={1} />
    <Hut x={930} y={1290} s={0.95} />
    <GCow x={250} y={1500} s={1} />
    <GCow x={830} y={1520} s={1.1} flip />
    <Villager x={590} y={1480} s={1.1} dress={1} />
    <Villager x={690} y={1500} s={1.05} flip dress={0} />
    <Villager x={170} y={1580} s={1.2} dress={0} />
    <Villager x={980} y={1580} s={1.15} flip dress={1} />
  </g>
);

/* ------------------------------------------------------------------ */
/* End-card tease (Day 5): Yamraj walks to his sister Yamuna's door     */
/* ------------------------------------------------------------------ */

const YSIL = "#120C1E";
const YRIM = "#C9D6F0";

/** Yamraj as a calm, moon-rimmed silhouette (tall mukut, danda; no buffalo) walks toward a small lit doorway with a
    marigold toran, where his sister Yamuna waits in warm light with an aarti thali; a point of light (the tilak) glows
    between them. Origin at the ground centre; about 430 x 400 at s 1. */
export const BhaiDoojTease: React.FC<{ f: number; x: number; y: number; s?: number }> = ({ f, x, y, s = 1 }) => {
  const step = Math.sin(f / 8) * 6;
  const flick = 0.85 + 0.15 * Math.sin(f / 3);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g transform="translate(140 0)">
        <rect x={-80} y={-300} width={160} height={300} fill="#FFB65A" opacity={0.85} />
        <path d="M-80 -300V-330C-80 -380 80 -380 80 -330V-300Z" fill="#FFB65A" opacity={0.85} />
        <path d="M-100 0V-330C-100 -400 100 -400 100 -330V0" fill="none" stroke="#8A5A2B" strokeWidth={14} />
        {[-60, -30, 0, 30, 60].map((dx) => (
          <circle key={dx} cx={dx} cy={-366 + Math.abs(dx) * 0.3} r={7} fill="#F2A23A" />
        ))}
        <g fill="#5A2A1A">
          <path d="M-24 0C-28 -60 -22 -130 -14 -150H14C22 -130 28 -60 24 0Z" />
          <circle cy={-168} r={16} />
        </g>
        <path d="M-16 -178C-14 -194 14 -194 16 -178L18 -150H-18Z" fill="#C8302E" />
        <path d="M-14 -140L-44 -112" stroke="#5A2A1A" strokeWidth={8} strokeLinecap="round" />
        <ellipse cx={-52} cy={-110} rx={24} ry={6} fill="#C8952E" stroke="#FFE6A3" strokeWidth={1.5} />
        <path d="M-52 -114C-56 -122 -54 -130 -52 -134C-50 -130 -48 -122 -52 -114Z" fill="#FFD36B" opacity={flick} />
      </g>
      <circle cx={10} cy={-170} r={30} fill="#FFD36B" opacity={0.2 * flick} />
      <circle cx={10} cy={-170} r={9 + 3 * flick} fill="#FFD36B" opacity={0.85} />
      <g transform="translate(-140 0)">
        <path d={`M-6 -120L${-24 - step} 0`} stroke={YSIL} strokeWidth={16} strokeLinecap="round" />
        <path d={`M6 -120L${20 + step} 0`} stroke={YSIL} strokeWidth={16} strokeLinecap="round" />
        <path d="M-36 -110C-40 -170 -32 -230 -20 -250H20C32 -230 40 -170 36 -110Z" fill={YSIL} stroke={YRIM} strokeWidth={2.5} />
        <circle cy={-272} r={22} fill={YSIL} stroke={YRIM} strokeWidth={2.5} />
        <path d="M-16 -290L-10 -340H10L16 -290Z" fill={YSIL} stroke={YRIM} strokeWidth={2.5} />
        <path d="M-30 -230L-46 -150" stroke={YSIL} strokeWidth={10} strokeLinecap="round" />
        <path d="M-52 -300V0" stroke="#8A6A3A" strokeWidth={6} />
        <circle cx={-52} cy={-306} r={10} fill="#C8952E" />
      </g>
      <path d="M-260 2H260" stroke={YRIM} strokeWidth={2} opacity={0.3} />
    </g>
  );
};
