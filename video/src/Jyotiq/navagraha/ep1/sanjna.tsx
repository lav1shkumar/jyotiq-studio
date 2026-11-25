import React from "react";
import { blinkAt } from "../../manthan/rig";
import { P } from "../../manthan/style";

/*
 * नवग्रह जन्म Ep1: Sanjna (Vishvakarma's daughter, Surya's wife), copied from Episode 6's Mohini
 * (no Manthan file is edited). Same frontal two-armed figure and origin (between the feet); new palette:
 * warm wheat skin, a lotus-pink sari with a gold border, a saffron choli, and a ruby pendant (Surya's gem).
 * Chhaya is this same figure drawn through the violet shadow filter in look.tsx (#nvChhaya).
 */
type T2 = [number, number];
const LK = {
  skin: "#E9B98A", skinShade: "#C98F5E", skinLine: "#8A5530", rim: "#FFE9C8",
  hair: "#160D0A", hairHi: "#3E2A20",
  sari: "#E4507A", sariShade: "#B5335A", sariHi: "#F7889F", choli: "#E8892A",
  iris: "#3A2014", sclera: "#FBF4EA", lip: "#B8304E",
};
const BORDER = "#F2C14E";
const PINK = { tip: "#FBD3E2", mid: "#F28DB2", base: "#D3477F", edge: "#B83A72" };

const qp = (p0: T2, m: T2, p1: T2, u: number): T2 => [
  (1 - u) * (1 - u) * p0[0] + 2 * (1 - u) * u * m[0] + u * u * p1[0],
  (1 - u) * (1 - u) * p0[1] + 2 * (1 - u) * u * m[1] + u * u * p1[1],
];
const qt = (p0: T2, m: T2, p1: T2, u: number): T2 => [
  2 * (1 - u) * (m[0] - p0[0]) + 2 * u * (p1[0] - m[0]),
  2 * (1 - u) * (m[1] - p0[1]) + 2 * u * (p1[1] - m[1]),
];

/** A band across a curved limb at u (armlet, bangle): a short stroke perpendicular to the curve. */
const Band: React.FC<{ p0: T2; m: T2; p1: T2; u: number; half: number; color: string; w: number }> = ({ p0, m, p1, u, half, color, w }) => {
  const p = qp(p0, m, p1, u);
  const t = qt(p0, m, p1, u);
  const l = Math.hypot(t[0], t[1]) || 1;
  const n: T2 = [-t[1] / l, t[0] / l];
  return <path d={`M${p[0] - n[0] * half} ${p[1] - n[1] * half}L${p[0] + n[0] * half} ${p[1] + n[1] * half}`} stroke={color} strokeWidth={w} strokeLinecap="round" />;
};

/** One arm from the shoulder pin to the wrist, as Vishnu's Arm4 but slimmer, with a bajuband and bangles. */
const LArm: React.FC<{ from: T2; to: T2; w?: number; bend?: number }> = ({ from, to, w = 26, bend = 0.12 }) => {
  const m: T2 = [(from[0] + to[0]) / 2 + (to[1] - from[1]) * bend, (from[1] + to[1]) / 2 - (to[0] - from[0]) * bend * 0.3];
  const d = `M${from[0]} ${from[1]}Q${m[0]} ${m[1]} ${to[0]} ${to[1]}`;
  return (
    <g>
      <path d={d} stroke={LK.skin} strokeWidth={w} strokeLinecap="round" fill="none" />
      <path d={d} stroke={LK.rim} strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.4} transform="translate(-6 -3)" />
      <Band p0={from} m={m} p1={to} u={0.3} half={w * 0.55} color={P.gold} w={9} />
      <Band p0={from} m={m} p1={to} u={0.3} half={w * 0.2} color="#C8102E" w={5} />
      <Band p0={from} m={m} p1={to} u={0.84} half={w * 0.56} color="#C8102E" w={5} />
      <Band p0={from} m={m} p1={to} u={0.9} half={w * 0.56} color={P.gold} w={6} />
    </g>
  );
};

const Fist: React.FC<{ at: T2; r?: number; rot?: number }> = ({ at, r = 15, rot = 0 }) => (
  <g transform={`translate(${at[0]} ${at[1]}) rotate(${rot})`}>
    <ellipse rx={r} ry={r * 1.1} fill={LK.skin} stroke={LK.skinLine} strokeWidth={1.4} />
    <path d={`M${-r * 0.6} ${-r * 0.2}C${-r * 0.2} ${-r * 0.6} ${r * 0.4} ${-r * 0.6} ${r * 0.7} ${-r * 0.1}`} stroke={LK.skinLine} strokeWidth={1.4} fill="none" />
  </g>
);

/** Abhaya: an open palm facing the viewer, fingers up, alta dot in the palm. */
const Palm: React.FC<{ at: T2; rot?: number; s?: number }> = ({ at, rot = 0, s = 1 }) => (
  <g transform={`translate(${at[0]} ${at[1]}) rotate(${rot}) scale(${s})`}>
    <path
      d="M-15 4C-17 -14 -15 -24 -12 -34L-7 -34L-6 -22L-4 -44L1 -44L2 -24L5 -46L10 -46L10 -24L13 -40L18 -38L16 -12C22 -18 27 -16 26 -12C22 -4 18 4 12 10C6 14 -10 14 -15 4Z"
      fill={LK.skin}
      stroke={LK.skinLine}
      strokeWidth={1.4}
    />
    <circle cx={1} cy={-4} r={4.5} fill="#C8102E" opacity={0.75} />
  </g>
);

/** A pink lotus held up by its stem (the upper hands). Origin = where the hand grips the stem. */
export const HandLotus: React.FC<{ s?: number; open?: number; rot?: number }> = ({ s = 1, open = 1, rot = 0 }) => (
  <g transform={`rotate(${rot}) scale(${s})`}>
    <path d="M0 10L0 -34" stroke="#3E7A3A" strokeWidth={5} strokeLinecap="round" />
    <g transform="translate(0 -34)">
      {[-64, -32, 0, 32, 64].map((a, i) => (
        <path key={a} d="M0 0C-14 -10 -16 -40 0 -62C16 -40 14 -10 0 0Z" transform={`rotate(${a * (0.45 + 0.55 * open)})`} fill={i % 2 ? PINK.mid : "#F7A9C6"} stroke={PINK.edge} strokeWidth={1.4} />
      ))}
      <ellipse cy={-10} rx={10} ry={5} fill={P.goldLight} />
    </g>
  </g>
);

/**
 * The varmala: a sagging string of red roses, marigolds and jasmine with leaves and a gold tassel,
 * hung from point a to point b (in the parent's coordinates).
 */
export const Varmala: React.FC<{ a: T2; b: T2; sag: number; t: number; glow?: number; n?: number; size?: number }> = ({
  a, b, sag, t, glow = 0, n = 17, size = 1,
}) => {
  const pts: T2[] = new Array(n).fill(0).map((_, i) => {
    const u = i / (n - 1);
    return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u + sag * Math.sin(Math.PI * u)];
  });
  const d = "M" + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("L");
  const low = pts[Math.floor(n / 2)];
  return (
    <g>
      {glow > 0.01 ? <path d={d} stroke="#FFE6A3" strokeWidth={50 * size} fill="none" opacity={0.45 * glow} filter="url(#mBlur8)" strokeLinecap="round" /> : null}
      <path d={d} stroke="#2F7A3A" strokeWidth={6 * size} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <g transform={`translate(${low[0]} ${low[1] + 8 * size}) scale(${size})`}>
        <path d="M0 0L0 14" stroke={P.goldDark} strokeWidth={2.5} />
        <path d="M-8 14L8 14L4 36L-4 36Z" fill="url(#mGold)" />
        <circle cy={38} r={3} fill="#C8102E" />
      </g>
      {pts.map((p, i) => {
        const kind = i % 3;
        const r = (kind === 1 ? 13 : 11) * size;
        return (
          <g key={i} transform={`translate(${p[0]} ${p[1]}) rotate(${i * 41 + t * 0.5})`}>
            <ellipse cx={10 * size} rx={9 * size} ry={4.5 * size} fill="#3F8C41" transform="rotate(25)" />
            {kind === 0 ? (
              <g>
                <circle r={r} fill="#C8102E" />
                <path d={`M${-r * 0.6} 0A${r * 0.6} ${r * 0.6} 0 1 1 ${r * 0.3} ${r * 0.45}`} stroke="#8A0A20" strokeWidth={2 * size} fill="none" />
                <circle r={r * 0.3} fill="#E8304A" />
              </g>
            ) : kind === 1 ? (
              <g>
                {new Array(10).fill(0).map((__, j) => (
                  <ellipse key={j} cy={-r * 0.55} rx={r * 0.35} ry={r * 0.5} fill={j % 2 ? "#F5A21B" : "#FFC23A"} transform={`rotate(${j * 36})`} />
                ))}
                <circle r={r * 0.35} fill="#E07A1F" />
              </g>
            ) : (
              <g>
                {new Array(5).fill(0).map((__, j) => (
                  <ellipse key={j} cy={-r * 0.45} rx={r * 0.3} ry={r * 0.5} fill="#FFFDF2" transform={`rotate(${j * 72})`} />
                ))}
                <circle r={r * 0.25} fill="#F2D27A" />
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};

const ALMOND = "M-15 0C-9 -8 9 -9 15 -2C9 5 -9 6 -15 0Z";

/** A frontal almond eye; `mirror` draws the viewer-left eye. lookX/lookY move both irises the same way. */
const FEye: React.FC<{ id: string; cx: number; open: number; lookX: number; lookY: number; mirror: boolean }> = ({ id, cx, open, lookX, lookY, mirror }) => {
  const sx = mirror ? -1 : 1;
  const ix = lookX * 3.8 * sx;
  const iy = 0.5 + lookY * 1.6;
  const cid = `${id}-e${mirror ? "l" : "r"}`;
  return (
    <g transform={`translate(${cx} -66) scale(${1.1 * sx} 1.1)`}>
      <g transform={`scale(1 ${Math.max(0.06, open)})`}>
        <path d={ALMOND} fill={LK.sclera} />
        <clipPath id={cid}>
          <path d={ALMOND} />
        </clipPath>
        <g clipPath={`url(#${cid})`}>
          <circle cx={ix} cy={iy} r={6.9} fill={LK.iris} />
          <circle cx={ix} cy={iy} r={3.2} fill="#0B0705" />
          <circle cx={ix + 2.2 * sx} cy={iy - 2.4} r={1.7} fill="#FFFFFF" opacity={0.95} />
          <rect x={-17} y={-12} width={34} height={7.5} fill={LK.skinShade} />
        </g>
      </g>
      <path d={open > 0.3 ? "M-16 0C-9 -9 9 -10 17 -3" : "M-15 0C-6 4 6 4 15 0"} stroke="#140A08" strokeWidth={3.4} fill="none" strokeLinecap="round" />
      {open > 0.3 ? <path d="M16 -3L21 -7M13 -6L17 -11" stroke="#140A08" strokeWidth={2} strokeLinecap="round" /> : null}
      {open > 0.3 ? <path d="M-13 3C-4 6 6 6 13 2" stroke="#140A08" strokeWidth={1.2} fill="none" opacity={0.45} /> : null}
    </g>
  );
};

const FACE_F = "M-56 -66C-58 -104 -32 -130 0 -130C32 -130 58 -104 56 -66C54 -36 36 -10 18 -2C8 2 -8 2 -18 -2C-36 -10 -54 -36 -56 -66Z";

/** Lakshmi's head, frontal. Origin = the chin. */
const LHead: React.FC<{ id: string; f: number; open: number; lookX: number; lookY: number; smile: number; speak: number }> = ({
  id, f, open, lookX, lookY, smile, speak,
}) => {
  const sm = smile * 3;
  const lo = -15 + speak * 4;
  return (
    <g>
      {/* hair behind the face, falling to the shoulders */}
      <path d="M-54 -96C-78 -60 -84 -10 -76 40L-48 40C-54 0 -52 -46 -42 -84Z" fill={LK.hair} />
      <path d="M54 -96C78 -60 84 -10 76 40L48 40C54 0 52 -46 42 -84Z" fill={LK.hair} />
      {/* ears and jhumkas */}
      {[-1, 1].map((sd) => (
        <g key={sd}>
          <ellipse cx={sd * 56} cy={-62} rx={8} ry={14} fill={LK.skinShade} />
          <g transform={`translate(${sd * 57} -46) rotate(${Math.sin(f / 16 + sd) * 6})`}>
            <path d="M0 0L0 6" stroke={P.goldDark} strokeWidth={2} />
            <path d="M-9 18C-9 9 -5 6 0 6C5 6 9 9 9 18Z" fill="url(#mGold)" />
            {[-6, -2, 2, 6].map((xx) => <circle key={xx} cx={xx} cy={20} r={1.7} fill="#FFF9EE" />)}
          </g>
        </g>
      ))}
      {/* face: the series cel shade on the left, a warm rim on the right */}
      <clipPath id={`${id}-fc`}>
        <path d={FACE_F} />
      </clipPath>
      <path d={FACE_F} fill={LK.skin} />
      <g clipPath={`url(#${id}-fc)`}>
        <path d="M-56 -66C-58 -104 -32 -130 0 -130C-24 -116 -36 -92 -36 -64C-36 -38 -24 -16 -6 0C-24 -2 -50 -26 -56 -66Z" fill={LK.skinShade} opacity={0.42} />
        <path d="M44 -110C56 -90 58 -60 50 -36" stroke={LK.rim} strokeWidth={6} fill="none" opacity={0.5} />
        <ellipse cx={-32} cy={-40} rx={10} ry={6} fill="#E0685A" opacity={0.18} />
        <ellipse cx={32} cy={-40} rx={10} ry={6} fill="#E0685A" opacity={0.22} />
      </g>
      <FEye id={id} cx={-25} open={open} lookX={lookX} lookY={lookY} mirror />
      <FEye id={id} cx={25} open={open} lookX={lookX} lookY={lookY} mirror={false} />
      {/* thin arched brows */}
      <path d="M-39 -84C-31 -92 -18 -93 -9 -87" stroke={LK.hair} strokeWidth={3.4} fill="none" strokeLinecap="round" />
      <path d="M39 -84C31 -92 18 -93 9 -87" stroke={LK.hair} strokeWidth={3.4} fill="none" strokeLinecap="round" />
      {/* nose and nath */}
      <path d="M2 -62C0 -52 -3 -44 -6 -39C-2 -35 4 -35 8 -38" stroke={LK.skinLine} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      <circle cx={10} cy={-36} r={5.5} fill="none" stroke="url(#mGold)" strokeWidth={2} />
      <circle cx={8} cy={-31} r={1.6} fill="#C8102E" />
      {/* lips */}
      <path d={`M-14 ${-21 - sm}Q-7 -27 0 -23Q7 -27 14 ${-21 - sm}Q7 ${lo} 0 ${lo}Q-7 ${lo} -14 ${-21 - sm}Z`} fill={LK.lip} />
      <path d="M-8 -19Q0 -17 8 -19" stroke="#E8707E" strokeWidth={1.6} fill="none" opacity={0.6} />
      {/* bindi */}
      <circle cx={0} cy={-96} r={4} fill="#C8102E" />
      <circle cx={0} cy={-103} r={1.5} fill={P.gold} />
      {/* hair over the forehead, centre parting */}
      <path d="M-58 -64C-64 -112 -36 -142 0 -142C36 -142 64 -112 58 -64C54 -86 44 -110 24 -118C12 -122 4 -122 0 -112C-4 -122 -12 -122 -24 -118C-44 -110 -54 -86 -58 -64Z" fill={LK.hair} />
      <path d="M-40 -126C-24 -136 -10 -136 -2 -128M40 -126C24 -136 10 -136 2 -128" stroke={LK.hairHi} strokeWidth={3} fill="none" opacity={0.6} />
      {/* maang tikka along the parting */}
      <path d="M0 -140L0 -116" stroke={P.gold} strokeWidth={1.6} />
      <circle cx={0} cy={-113} r={3.6} fill="url(#mGold)" />
      <circle cx={0} cy={-113} r={1.6} fill="#C8102E" />
      {/* no crown: a high bun ringed with a jasmine gajra, a small gold crescent and a rose (Mohini) */}
      <ellipse cx={0} cy={-152} rx={42} ry={24} fill={LK.hair} />
      <path d="M-28 -164C-12 -174 12 -174 28 -164" stroke={LK.hairHi} strokeWidth={3} fill="none" opacity={0.6} />
      {Array.from({ length: 13 }, (_, i) => {
        const a = Math.PI * (1.08 + (0.84 * i) / 12);
        return <circle key={i} cx={Math.cos(a) * 46} cy={-150 + Math.sin(a) * 27} r={4.2} fill="#FFFDF5" stroke="#E2DCC8" strokeWidth={0.8} />;
      })}
      <path d="M-14 -176C-8 -186 8 -186 14 -176C8 -181 -8 -181 -14 -176Z" fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={1} />
      <circle cx={0} cy={-184} r={3} fill="#E3264A" />
      <g transform="translate(40 -142)">
        {[0, 72, 144, 216, 288].map((ang) => (
          <ellipse key={ang} cx={0} cy={-5} rx={4} ry={6} transform={`rotate(${ang})`} fill="#E0457F" />
        ))}
        <circle r={3} fill="#9E1B4E" />
      </g>
    </g>
  );
};

export type SanjnaProps = {
  id: string;
  f: number;
  x: number;
  y: number;
  s?: number;
  pose?: "garland" | "abhaya";
  lift?: number; // pose "garland": 0 hands at the waist .. 1 raised
  garland?: boolean; // keep false for Mohini (the scene draws the kalash in her hands)
  hands?: [T2, T2]; // explicit wrist positions [left, right] in figure units; overrides pose
  openR?: boolean; // right hand as an open palm (asking for the kalash) instead of a fist
  eyes?: number; // 1 open with natural blinks, 0 closed
  lookX?: number; // -1 viewer-left .. 1 viewer-right
  lookY?: number;
  smile?: number;
  speak?: number;
  halo?: number;
  glow?: number; // an aura around the whole figure
  coins?: number; // unused for Mohini
};

/** Sanjna standing (two arms). (x, y) = between her feet; s = scale (0.43 matches Vishnu at the churning). */
export const SanjnaStanding: React.FC<SanjnaProps> = ({
  id, f, x, y, s = 0.43, pose = "garland", lift = 0, garland = false, hands, openR = false, eyes = 1, lookX = 0, lookY = 0, smile = 0.45, speak = 0,
  halo = 0, glow = 0, coins = 0,
}) => {
  const open = Math.min(eyes, 1 - (eyes > 0.95 ? blinkAt(`${id}-b`, f) : 0));
  const breath = Math.sin(f / 30) * 1.5;
  const hl = (0.6 + 0.2 * Math.sin(f / 22)) * halo;
  const k = Math.max(0, Math.min(1, lift));
  const hL: T2 = hands ? hands[0] : pose === "abhaya" ? [-130, -536] : [-58 - 28 * k, -440 - 250 * k];
  const hR: T2 = hands ? hands[1] : pose === "abhaya" ? [120, -432] : [58 + 28 * k, -440 - 250 * k];
  const skirt = "M-64 -400C-88 -280 -118 -140 -132 -22C-60 -8 60 -8 132 -22C118 -140 88 -280 64 -400Z";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* aura and the lotus-petal halo */}
      {glow > 0.01 ? <ellipse cx={0} cy={-470} rx={260} ry={520} fill="#FFE6A3" opacity={0.32 * glow} filter="url(#mBlur8)" /> : null}
      <g transform={`translate(0 -716) rotate(${f * 0.2})`} opacity={hl}>
        <circle r={186} fill="#FFE2A0" opacity={0.3} filter="url(#mBlur8)" />
        <circle r={168} fill="#FFF3C9" opacity={0.16} />
        <circle r={176} fill="none" stroke={P.gold} strokeWidth={4} />
        {new Array(24).fill(0).map((_, i) => (
          <path key={i} d="M0 -150C-9 -160 -9 -178 0 -190C9 -178 9 -160 0 -150Z" transform={`rotate(${i * 15})`} fill={P.goldLight} fillOpacity={0.35} stroke={P.gold} strokeWidth={2.5} />
        ))}
        <circle r={150} fill="none" stroke={P.goldLight} strokeWidth={2} opacity={0.8} />
      </g>
      <g transform={`translate(0 ${breath})`} filter="url(#mCut)">
        {/* long hair behind the shoulders */}
        <path d="M-56 -700C-96 -640 -110 -560 -100 -460C-96 -430 -84 -424 -74 -436C-84 -520 -82 -600 -46 -664Z" fill={LK.hair} />
        <path d="M56 -700C96 -640 110 -560 100 -460C96 -430 84 -424 74 -436C84 -520 82 -600 46 -664Z" fill={LK.hair} />
        {/* Mohini has two arms only (Lakshmi's raised upper pair with lotuses is removed) */}
        {/* feet with alta, peeking out under the hem */}
        <path d="M-50 -2C-50 -12 -14 -15 -8 -5C-10 4 -42 6 -50 -2Z" fill={LK.skin} stroke={LK.skinLine} strokeWidth={1.4} />
        <path d="M50 -2C50 -12 14 -15 8 -5C10 4 42 6 50 -2Z" fill={LK.skin} stroke={LK.skinLine} strokeWidth={1.4} />
        <path d="M-48 1C-36 5 -18 4 -9 -1M48 1C36 5 18 4 9 -1" stroke="#C8102E" strokeWidth={3} fill="none" opacity={0.8} />
        {/* the sari skirt: shade, pleats and the gold border */}
        <clipPath id={`${id}-sk`}>
          <path d={skirt} />
        </clipPath>
        <path d={skirt} fill={LK.sari} />
        <g clipPath={`url(#${id}-sk)`}>
          <path d="M-64 -400C-88 -280 -118 -140 -132 -22L-56 -14C-46 -140 -36 -280 -24 -400Z" fill={LK.sariShade} opacity={0.55} />
          <path d="M64 -400C84 -280 104 -140 116 -24" stroke={LK.sariHi} strokeWidth={10} fill="none" opacity={0.35} />
          {[-36, -18, 0, 18, 36].map((px) => (
            <path key={px} d={`M${px * 0.25} -396C${px * 0.5} -260 ${px * 0.8} -140 ${px * 1.15} -14`} stroke={LK.sariShade} strokeWidth={3} fill="none" opacity={0.7} />
          ))}
          {[-300, -220, -140, -70].map((yy, r) =>
            [-2, -1, 0, 1, 2].map((c) => {
              const xx = c * (34 + r * 9) + (r % 2 ? 17 : 0);
              return Math.abs(xx) < 60 + r * 18 ? (
                <g key={`${r}${c}`} transform={`translate(${xx} ${yy})`} opacity={0.85}>
                  {[0, 90].map((a) => <ellipse key={a} rx={2} ry={5} fill={P.goldLight} transform={`rotate(${a})`} />)}
                </g>
              ) : null;
            })
          )}
          <path d="M-136 -24C-60 -10 60 -10 136 -24" stroke={BORDER} strokeWidth={14} fill="none" />
          <path d="M-134 -40C-60 -26 60 -26 134 -40" stroke={P.goldLight} strokeWidth={2.5} fill="none" opacity={0.75} />
        </g>
        {/* torso, choli and midriff */}
        <path d="M-84 -566C-86 -590 -58 -606 -24 -608L24 -608C58 -606 86 -590 84 -566C80 -520 70 -470 62 -400L-62 -400C-70 -470 -80 -520 -84 -566Z" fill={LK.skin} />
        <path d="M-84 -566C-86 -590 -58 -606 -24 -608L-14 -608C-40 -560 -46 -480 -36 -400L-62 -400C-70 -470 -80 -520 -84 -566Z" fill={LK.skinShade} opacity={0.5} />
        <path d="M-84 -566C-60 -560 -40 -548 -26 -536Q0 -520 26 -536C40 -548 60 -560 84 -566C82 -520 72 -460 65 -418L-65 -418C-72 -460 -82 -520 -84 -566Z" fill={LK.choli} />
        <path d="M-65 -418L65 -418" stroke="url(#mGold)" strokeWidth={5} />
        <path d="M-84 -566C-60 -560 -40 -548 -26 -536Q0 -520 26 -536C40 -548 60 -560 84 -566" stroke="url(#mGold)" strokeWidth={3} fill="none" />
        {/* the kamarbandh with a ruby */}
        <path d="M-66 -412Q0 -400 66 -412L64 -392Q0 -380 -64 -392Z" fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={1.2} />
        <path d="M-8 -388L8 -388L0 -370Z" fill="url(#mGold)" />
        <circle cx={0} cy={-394} r={5} fill="#E3264A" />
        {/* the pallu over her left shoulder, across to the right hip */}
        <path d="M40 -610C64 -612 84 -596 88 -572C40 -520 -6 -460 -48 -392L-84 -398C-40 -466 0 -540 40 -610Z" fill={LK.sari} />
        <path d="M88 -572C40 -520 -6 -460 -48 -392L-60 -394C-20 -460 26 -530 76 -584Z" fill={LK.sariShade} opacity={0.35} />
        <path d="M40 -610C0 -540 -40 -466 -84 -398" stroke="url(#mGold)" strokeWidth={6} fill="none" />
        <path d="M88 -572C40 -520 -6 -460 -48 -392" stroke="url(#mGold)" strokeWidth={4.5} fill="none" />
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={52 - 34 * i} cy={-566 + 44 * i} r={2.4} fill={P.goldLight} opacity={0.85} />
        ))}
        {/* neck and necklaces: a choker and a long rani haar with drops */}
        <path d="M-20 -642L20 -642L24 -604L-24 -604Z" fill={LK.skin} />
        <path d="M-20 -642L-6 -642C-8 -628 -8 -616 -4 -604L-24 -604Z" fill={LK.skinShade} opacity={0.55} />
        <path d="M-26 -606Q0 -590 26 -606" stroke="url(#mGold)" strokeWidth={7} fill="none" />
        <path d="M-44 -602Q0 -520 44 -602" stroke="url(#mGold)" strokeWidth={6} fill="none" />
        <path d="M-40 -600Q0 -528 40 -600" stroke={P.goldDeep} strokeWidth={1.2} fill="none" opacity={0.6} />
        {[-0.62, -0.32, 0.32, 0.62].map((u) => (
          <circle key={u} cx={u * 40} cy={-602 + 82 * (1 - u * u) - 4} r={3.4} fill="#E3264A" stroke={P.goldDeep} strokeWidth={1} />
        ))}
        <g transform="translate(0 -526)">
          {/* a ruby pendant: Surya's gem */}
          <circle cy={7} r={18} fill="#FF4A6A" opacity={0.25 + 0.1 * Math.sin(f / 9)} filter="url(#mBlur8)" />
          <path d="M0 -10L15 4L0 26L-15 4Z" fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={1.4} />
          <circle cy={6} r={9} fill="#E3264A" />
          <circle cy={6} r={9} fill="url(#mGem)" />
          <circle cx={-3} cy={2} r={2.4} fill="#FFFFFF" opacity={0.8} />
        </g>
        {/* the head */}
        <g transform="translate(0 -630)">
          <LHead id={id} f={f} open={open} lookX={lookX} lookY={lookY} smile={smile} speak={speak} />
        </g>
        {/* lower arms */}
        <LArm from={[-80, -566]} to={hL} w={26} bend={pose === "abhaya" ? -0.15 : 0.1} />
        <LArm from={[80, -566]} to={hR} w={26} bend={pose === "abhaya" ? 0.12 : -0.1} />
        {pose === "garland" && garland ? <Varmala a={[hL[0] + 4, hL[1] + 8]} b={[hR[0] - 4, hR[1] + 8]} sag={190 - 30 * k} t={f} glow={0.5 + 0.5 * k} /> : null}
        {pose === "abhaya" ? (
          <g>
            <Palm at={hL} rot={-6} s={1.25} />
            <Fist at={hR} r={15} rot={20} />
            {coins > 0.01
              ? new Array(9).fill(0).map((_, i) => {
                  const fall = (f * 5 + i * 41) % 240;
                  return (
                    <ellipse key={i} cx={hR[0] + 6 + Math.sin(i * 2.3 + f / 9) * 10} cy={hR[1] + 20 + fall} rx={8} ry={4 + 3 * Math.abs(Math.sin(f / 6 + i))} fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={1} opacity={coins * (1 - fall / 240)} />
                  );
                })
              : null}
          </g>
        ) : (
          <g>
            <Fist at={hL} r={15} />
            {openR ? <Palm at={hR} rot={-80} s={1.2} /> : <Fist at={hR} r={15} />}
          </g>
        )}
      </g>
    </g>
  );
};

const PETAL = "M0 0C-40 -24 -48 -110 0 -180C48 -110 40 -24 0 0Z";

/**
 * The giant lotus Lakshmi rises on. Origin = the base of the petals at the waterline; the petals fan
 * out as `open` goes 0 (bud) -> 1 (open); the golden pericarp (where she stands) is at about
 * y = -44 * s when open. glow adds the golden light pouring out of the flower.
 */
export const GiantLotus: React.FC<{ id: string; f: number; open?: number; glow?: number; s?: number; part?: "all" | "back" | "front" }> = ({
  id, f, open = 1, glow = 0, s = 1, part = "all",
}) => {
  const o = Math.max(0, Math.min(1, open));
  const back = part !== "front";
  const front = part !== "back";
  const ring = (n: number, spread: number, len: number, fill: string, dy: number, key: string) => (
    <g transform={`translate(0 ${dy})`}>
      {new Array(n).fill(0).map((_, i) => {
        const u = n === 1 ? 0 : (i / (n - 1)) * 2 - 1;
        const br = 1 + 0.02 * Math.sin(f / 20 + i);
        return (
          <g key={`${key}${i}`} transform={`rotate(${u * spread}) scale(${0.95 * br} ${len})`}>
            <path d={PETAL} fill={fill} stroke={PINK.edge} strokeWidth={2} />
            <path d="M0 -8C-2 -60 -2 -120 0 -168" stroke={PINK.base} strokeWidth={2} fill="none" opacity={0.45} />
          </g>
        );
      })}
    </g>
  );
  return (
    <g transform={`scale(${s})`}>
      <defs>
        <linearGradient id={`${id}-pb`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={PINK.base} />
          <stop offset="0.55" stopColor={PINK.mid} />
          <stop offset="1" stopColor={PINK.tip} />
        </linearGradient>
        <linearGradient id={`${id}-pf`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#E06A9A" />
          <stop offset="0.6" stopColor="#F7A9C6" />
          <stop offset="1" stopColor="#FFE8F0" />
        </linearGradient>
      </defs>
      {back && glow > 0.01 ? <ellipse cx={0} cy={-90} rx={300} ry={190} fill="#FFE6A3" opacity={0.5 * glow} filter="url(#mBlur8)" /> : null}
      {back ? ring(7, 22 + 62 * o, 1.0, `url(#${id}-pb)`, 0, "b") : null}
      {back ? ring(6, 14 + 50 * o, 1.06, `url(#${id}-pb)`, 4, "m") : null}
      {back && o > 0.05 ? (
        <g opacity={Math.min(1, o * 1.6)}>
          <ellipse cx={0} cy={-36 - 10 * o} rx={56 * o} ry={16 * o} fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={1.5} />
          {new Array(14).fill(0).map((_, i) => (
            <circle key={i} cx={Math.cos((i / 14) * Math.PI * 2) * 44 * o} cy={-36 - 10 * o + Math.sin((i / 14) * Math.PI * 2) * 12 * o} r={3} fill={P.goldLight} />
          ))}
        </g>
      ) : null}
      {front ? ring(5, 8 + 36 * o, 0.88, `url(#${id}-pf)`, 10, "f") : null}
      {front && glow > 0.01 ? <ellipse cx={0} cy={-50} rx={70} ry={30} fill="#FFF6D8" opacity={0.6 * glow} filter="url(#mBlur8)" /> : null}
    </g>
  );
};

/** A round lotus leaf floating on the water (seen low and flat), with its notch. */
export const LotusPad: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s} ${s * 0.32})`}>
    <path d="M0 0L-12 -98A100 100 0 1 0 12 -98Z" fill="#3E8E4A" stroke="#245E2E" strokeWidth={4} />
    <path d="M0 0L-60 -60M0 0L60 -40M0 0L-80 30M0 0L70 50M0 0L0 90" stroke="#2A6B36" strokeWidth={4} opacity={0.6} />
    <path d="M-80 -40A100 100 0 0 1 -12 -98" stroke="#7CC47E" strokeWidth={6} fill="none" opacity={0.5} />
  </g>
);
