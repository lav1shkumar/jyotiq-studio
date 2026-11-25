import React from "react";
import { P } from "../../manthan/style";
import { lerp, outBack, prog, rnd } from "../../navagraha/ep1/anim";

/*
 * क्या होता अगर… Ep2: new SVG art, all pure functions of the frame. Flat cut-out style of the Manthan / Navagraha
 * series (bold shapes, soft gradients, rim light, ink lines). Ids are prefixed "kq".
 */

export const KQDefs: React.FC = () => (
  <defs>
    <linearGradient id="kqFire" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#1A0B1E" />
      <stop offset="0.45" stopColor="#5A1420" />
      <stop offset="0.78" stopColor="#B8361A" />
      <stop offset="1" stopColor="#F28C28" />
    </linearGradient>
    <radialGradient id="kqEmber" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#FFD27A" stopOpacity="0.95" />
      <stop offset="0.45" stopColor="#F5761A" stopOpacity="0.5" />
      <stop offset="1" stopColor="#E0482B" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="kqSaturn" cx="0.38" cy="0.32" r="0.75">
      <stop offset="0" stopColor="#F7D58A" />
      <stop offset="0.5" stopColor="#C98A3A" />
      <stop offset="1" stopColor="#5A2A14" />
    </radialGradient>
    <radialGradient id="kqCool" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#E4EAFF" stopOpacity="0.95" />
      <stop offset="0.4" stopColor="#8FA8FF" stopOpacity="0.45" />
      <stop offset="1" stopColor="#4A5AA8" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="kqGold" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
      <stop offset="0.35" stopColor="#FFE9A8" stopOpacity="0.85" />
      <stop offset="1" stopColor="#F2B84E" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="kqIronSeat" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#6A6E7C" />
      <stop offset="1" stopColor="#2C2F38" />
    </linearGradient>
    <linearGradient id="kqNight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#0E0B20" />
      <stop offset="0.6" stopColor="#1E1A3E" />
      <stop offset="1" stopColor="#3A2A55" />
    </linearGradient>
    <linearGradient id="kqGanSkin" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#F6C9A4" />
      <stop offset="1" stopColor="#E3A27E" />
    </linearGradient>
  </defs>
);

/* ------------------------------------------------------------------ */
/* Hook world: the fire sky, Saturn, embers                            */
/* ------------------------------------------------------------------ */

/** The burning night sky behind Shani in the hook: ember gradient, a huge ringed Saturn, heat haze. */
export const FireSky: React.FC<{ f: number; heat?: number }> = ({ f, heat = 1 }) => (
  <g>
    <rect width={1080} height={1920} fill="url(#kqFire)" />
    <circle cx={540} cy={1700} r={900} fill="url(#kqEmber)" opacity={0.55 + 0.25 * heat + 0.08 * Math.sin(f / 5)} />
    {/* Saturn behind the figure */}
    <g transform={`translate(540 640) rotate(-14)`}>
      <circle r={300} fill="#F28C28" opacity={0.18} filter="url(#nvBlur20)" />
      <ellipse rx={470} ry={92} fill="none" stroke="#E8B04A" strokeWidth={26} opacity={0.55} />
      <circle r={230} fill="url(#kqSaturn)" />
      {[-90, -40, 20, 70].map((y, i) => (
        <path key={i} d={`M${-Math.sqrt(230 * 230 - y * y)} ${y}Q0 ${y + 14} ${Math.sqrt(230 * 230 - y * y)} ${y}`} stroke="#7A3E1D" strokeWidth={8} fill="none" opacity={0.28} />
      ))}
      <path d="M-470 0A470 92 0 0 0 470 0" fill="none" stroke="#FFE3A1" strokeWidth={14} opacity={0.85} />
      <path d="M-430 0A430 80 0 0 0 430 0" fill="none" stroke="#C98A3A" strokeWidth={8} opacity={0.8} />
    </g>
    <Embers f={f} n={46} k={heat} />
  </g>
);

/** Rising embers (fiery motes with short tails). */
export const Embers: React.FC<{ f: number; n?: number; k?: number; seed?: number }> = ({ f, n = 40, k = 1, seed = 3 }) => (
  <g opacity={k}>
    {Array.from({ length: n }, (_, i) => {
      const sp = 3 + rnd(i, seed) * 6;
      const h = 2100;
      const y = 1950 - ((rnd(i, seed + 1) * h + f * sp) % h);
      const x = rnd(i, seed + 2) * 1080 + Math.sin(f / 13 + i) * 26;
      const r = 3 + rnd(i, seed + 3) * 6;
      const tw = 0.5 + 0.5 * Math.sin(f / 4 + i * 1.7);
      return (
        <g key={i}>
          <line x1={x} y1={y} x2={x - Math.sin(f / 13 + i) * 6} y2={y + sp * 5} stroke="#FFB23D" strokeWidth={r * 0.8} strokeLinecap="round" opacity={0.35 * tw} />
          <circle cx={x} cy={y} r={r} fill={i % 3 ? "#FFC46B" : "#FFF1C4"} opacity={0.55 + 0.45 * tw} />
        </g>
      );
    })}
  </g>
);

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */

/** Shani's bow held upright in the back hand (origin = the grip). */
export const BowProp: React.FC = () => (
  <g>
    <path d="M0 -250C70 -170 70 170 0 250" stroke="#2C2F38" strokeWidth={16} fill="none" strokeLinecap="round" />
    <path d="M0 -250C70 -170 70 170 0 250" stroke="#8C96B4" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.7} />
    <path d="M0 -250L0 250" stroke="#E4EAFF" strokeWidth={2.5} opacity={0.9} />
    <rect x={-12} y={-22} width={24} height={44} rx={8} fill="#E8B04A" stroke="#7A4A1C" strokeWidth={3} />
  </g>
);

/** Vishnu's Sudarshana chakra, spinning on a raised finger (origin = the hand). */
export const ChakraProp: React.FC<{ f: number; glow?: number }> = ({ f, glow = 1 }) => (
  <g transform="translate(0 -70)">
    <circle r={90} fill="url(#kqGold)" opacity={0.7 * glow} />
    <g transform={`rotate(${f * 9})`}>
      <circle r={50} fill="#F6C431" stroke="#A8701E" strokeWidth={4} />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d="M0 -50L8 -66L0 -78L-8 -66Z" fill="#FFE08A" stroke="#A8701E" strokeWidth={2} transform={`rotate(${i * 30})`} />
      ))}
      <circle r={30} fill="none" stroke="#A8701E" strokeWidth={3} />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d="M0 0L0 -30" stroke="#A8701E" strokeWidth={3} transform={`rotate(${i * 45})`} />
      ))}
      <circle r={9} fill="#C8102E" />
    </g>
  </g>
);

/** A crow (Shani's vahana), side view facing +x. Origin = the feet. flap 0 folded .. 1 wings up. */
export const Crow: React.FC<{ f: number; x: number; y: number; s?: number; facing?: number; flap?: number; caw?: number }> = ({ f, x, y, s = 1, facing = 1, flap = 0, caw = 0 }) => {
  const bob = Math.sin(f / 9) * 2;
  const w = flap > 0 ? Math.sin(f / 2.2) * 0.5 + 0.5 : 0;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${facing * s} ${s})`}>
      <path d="M-6 0L-10 -26M8 0L6 -26" stroke="#3A3A44" strokeWidth={4} strokeLinecap="round" />
      <path d="M-58 -70L-120 -40L-108 -56L-126 -48L-62 -86Z" fill="#14141C" />
      <ellipse cx={-6} cy={-62} rx={58} ry={38} fill="#1B1B26" />
      <path d="M-40 -80C-20 -100 30 -100 46 -70C20 -60 -10 -56 -40 -80Z" fill="#2A2A3A" opacity={0.7} />
      {flap > 0 ? (
        <g transform={`translate(-10 -78) rotate(${-lerp(10, 70, w * flap)})`}>
          <path d="M0 0C-30 -40 -90 -60 -140 -40C-110 -30 -90 -20 -70 -4C-90 -6 -110 4 -120 14C-70 18 -30 12 0 0Z" fill="#14141C" />
        </g>
      ) : (
        <path d="M-60 -74C-20 -96 30 -86 40 -60C10 -50 -30 -48 -60 -74Z" fill="#101018" />
      )}
      <circle cx={42} cy={-104} r={30} fill="#1B1B26" />
      <path d={`M66 -108L${104 + 4 * caw} -${98 + 6 * caw}L68 -96Z`} fill="#3A3A44" />
      {caw > 0.05 ? <path d={`M68 -98L${100} -${86 - 8 * caw}L68 -92Z`} fill="#3A3A44" /> : null}
      <circle cx={52} cy={-110} r={6} fill="#E8D7A0" />
      <circle cx={53} cy={-110} r={3} fill="#0A0A0E" />
      <path d="M22 -128C34 -136 52 -134 62 -124" stroke="#4A4A60" strokeWidth={3} fill="none" opacity={0.7} />
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Babies                                                              */
/* ------------------------------------------------------------------ */

/**
 * The newborn in a swaddle (origin = the bundle's centre). `head` 1 = the baby's face shows; as it goes to 0 the face
 * is hidden under a soft white light that rises away (Brahmavaivarta: the head goes to Goloka). Never graphic.
 */
export const Swaddle: React.FC<{ f: number; s?: number; head?: number; glow?: number; rot?: number }> = ({ f, s = 1, head = 1, glow = 0, rot = 0 }) => (
  <g transform={`scale(${s}) rotate(${rot})`}>
    {glow > 0.01 ? <circle r={170} fill="url(#kqGold)" opacity={glow} /> : null}
    <path d="M-120 20C-130 -30 -90 -70 -40 -72L70 -60C120 -50 140 0 120 40C100 80 -80 90 -120 20Z" fill="#FFF3D6" stroke="#C9A86A" strokeWidth={4} />
    <path d="M-90 30C-40 0 40 -10 110 10" stroke="#E8B04A" strokeWidth={8} fill="none" />
    <path d="M-100 50C-40 30 40 30 100 46" stroke="#C9A86A" strokeWidth={3} fill="none" opacity={0.6} />
    {head > 0.01 ? (
      <g transform="translate(-92 -58)" opacity={head}>
        <circle r={52} fill="#F2C595" stroke="#8E5A34" strokeWidth={3} />
        <path d="M-46 -16C-40 -50 10 -62 40 -34C20 -42 -10 -40 -46 -16Z" fill="#2A1A12" />
        <path d="M-16 6C-12 10 -6 10 -2 6M10 6C14 10 20 10 24 6" stroke="#5A3420" strokeWidth={3} fill="none" strokeLinecap="round" />
        <path d="M0 24Q6 28 12 24" stroke="#B8304E" strokeWidth={3} fill="none" strokeLinecap="round" />
        <circle cx={-22} cy={18} r={7} fill="#E0685A" opacity={0.25} />
        <circle cx={30} cy={18} r={7} fill="#E0685A" opacity={0.25} />
        <circle cx={4} cy={-14} r={3.5} fill="#C8102E" />
      </g>
    ) : null}
    {head < 0.99 ? (
      <g transform={`translate(-92 ${-58 - (1 - head) * 260})`} opacity={Math.sin(Math.PI * Math.min(1, (1 - head) * 1.2))}>
        <circle r={90} fill="url(#kqGold)" />
        <circle r={36} fill="#FFFFFF" />
      </g>
    ) : null}
    <circle cx={-92} cy={-58} r={70} fill="#FFFFFF" opacity={0.85 * (1 - head) * (0.8 + 0.2 * Math.sin(f / 3))} filter="url(#nvBlur20)" />
  </g>
);

/**
 * Baby Ganesha (Gajanana), seated, frontal, origin = the seat. Golden-pink skin, elephant head with fanning ears,
 * the trunk curling to his left, the broken right tusk is NOT shown (that comes later in his story), a small mukut,
 * tilak, yellow dhoti, gold haar, a modak in one hand and abhaya in the other.
 */
export const BabyGanesha: React.FC<{ f: number; s?: number; smile?: number }> = ({ f, s = 1, smile = 1 }) => {
  const ear = Math.sin(f / 7) * 5;
  const trunk = Math.sin(f / 16) * 4;
  const blink = (f % 110) < 4 ? 0.15 : 1;
  return (
    <g transform={`scale(${s})`}>
      {/* body: round belly, folded legs */}
      <ellipse cx={0} cy={-24} rx={150} ry={40} fill="#F6C431" stroke="#A8701E" strokeWidth={4} />
      <path d="M-130 -30C-150 -70 -110 -96 -60 -90L60 -90C110 -96 150 -70 130 -30Z" fill="#F6C431" stroke="#A8701E" strokeWidth={4} />
      <path d="M-120 -40C-60 -60 60 -60 120 -40" stroke="#C8102E" strokeWidth={8} fill="none" />
      <ellipse cx={-70} cy={-38} rx={34} ry={20} fill="url(#kqGanSkin)" stroke="#9A5A3A" strokeWidth={3} />
      <ellipse cx={70} cy={-38} rx={34} ry={20} fill="url(#kqGanSkin)" stroke="#9A5A3A" strokeWidth={3} />
      <ellipse cx={0} cy={-170} rx={96} ry={92} fill="url(#kqGanSkin)" stroke="#9A5A3A" strokeWidth={4} />
      <ellipse cx={8} cy={-150} rx={60} ry={58} fill="#FFDDBE" opacity={0.6} />
      <circle cx={6} cy={-150} r={6} fill="#9A5A3A" opacity={0.6} />
      {/* sacred thread (a snake-belt in the texts: shown as a simple gold thread for a baby) and haar */}
      <path d="M-70 -250C-20 -200 30 -150 70 -110" stroke="#FFF3C9" strokeWidth={5} fill="none" />
      <path d="M-56 -252Q0 -200 56 -252" stroke="#E8B04A" strokeWidth={9} fill="none" />
      <circle cx={0} cy={-218} r={9} fill="#C8102E" stroke="#A8701E" strokeWidth={2} />
      {/* arms: left holds a modak, right in abhaya */}
      <path d="M-86 -236C-130 -210 -140 -160 -120 -130" stroke="#E8AE88" strokeWidth={36} fill="none" strokeLinecap="round" />
      <g transform="translate(-118 -122)">
        <path d="M-26 6C-26 -18 -14 -32 0 -40C14 -32 26 -18 26 6Z" fill="#FFF3D6" stroke="#C9A86A" strokeWidth={3} />
        {[-16, -6, 4, 14].map((xx) => (
          <path key={xx} d={`M${xx} 4L${xx * 0.3} -34`} stroke="#E0C890" strokeWidth={2} />
        ))}
      </g>
      <path d="M86 -236C130 -230 150 -270 140 -310" stroke="#E8AE88" strokeWidth={36} fill="none" strokeLinecap="round" />
      <g transform="translate(140 -322)">
        <path d="M-20 12C-22 -10 -20 -22 -16 -32L-10 -32L-9 -20L-6 -40L0 -40L1 -20L5 -42L11 -42L11 -20L15 -36L21 -34L19 -8C25 -14 30 -12 29 -8C25 0 20 8 13 14C6 18 -14 20 -20 12Z" fill="#E8AE88" stroke="#9A5A3A" strokeWidth={2} />
        <circle cx={1} cy={-6} r={4.5} fill="#C8102E" opacity={0.75} />
      </g>
      {/* the elephant head */}
      <g transform="translate(0 -330)">
        {/* ears */}
        <g transform={`rotate(${-ear} -70 0)`}>
          <path d="M-60 -50C-150 -90 -210 -20 -190 60C-180 110 -120 120 -70 70Z" fill="#E8AE88" stroke="#9A5A3A" strokeWidth={4} />
          <path d="M-80 -30C-140 -50 -170 0 -160 50C-150 80 -110 86 -80 56Z" fill="#F4B6A0" opacity={0.8} />
        </g>
        <g transform={`rotate(${ear} 70 0)`}>
          <path d="M60 -50C150 -90 210 -20 190 60C180 110 120 120 70 70Z" fill="#E8AE88" stroke="#9A5A3A" strokeWidth={4} />
          <path d="M80 -30C140 -50 170 0 160 50C150 80 110 86 80 56Z" fill="#F4B6A0" opacity={0.8} />
        </g>
        {/* head dome and cheeks */}
        <path d="M-84 20C-100 -60 -60 -120 0 -122C60 -120 100 -60 84 20C76 64 40 86 0 88C-40 86 -76 64 -84 20Z" fill="url(#kqGanSkin)" stroke="#9A5A3A" strokeWidth={4} />
        <ellipse cx={-48} cy={30} rx={20} ry={13} fill="#E0685A" opacity={0.22} />
        <ellipse cx={48} cy={30} rx={20} ry={13} fill="#E0685A" opacity={0.22} />
        {/* the trunk curling to his left (viewer right) */}
        <path
          d={`M-18 40C-22 90 -14 140 10 170C30 196 66 196 ${78 + trunk} 172C${88 + trunk} 150 ${70 + trunk} 136 ${54 + trunk} 146`}
          stroke="#9A5A3A"
          strokeWidth={50}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M-18 40C-22 90 -14 140 10 170C30 196 66 196 ${78 + trunk} 172C${88 + trunk} 150 ${70 + trunk} 136 ${54 + trunk} 146`}
          stroke="#E8AE88"
          strokeWidth={42}
          fill="none"
          strokeLinecap="round"
        />
        {[70, 92, 114, 136].map((yy) => (
          <path key={yy} d={`M-30 ${yy}Q-14 ${yy + 6} 2 ${yy}`} stroke="#9A5A3A" strokeWidth={2.4} fill="none" opacity={0.55} />
        ))}
        {/* left tusk (his right) only small, the right tusk small too: a baby */}
        <path d="M-34 52C-44 70 -48 84 -44 96C-38 86 -30 74 -26 58Z" fill="#FFF9EE" stroke="#C9B48A" strokeWidth={2} />
        <path d="M30 52C40 70 44 84 40 96C34 86 26 74 22 58Z" fill="#FFF9EE" stroke="#C9B48A" strokeWidth={2} />
        {/* eyes */}
        {[-1, 1].map((sd) => (
          <g key={sd} transform={`translate(${sd * 34} -10) scale(1 ${blink})`}>
            <ellipse rx={13} ry={10} fill="#FFFFFF" />
            <circle cx={sd * 1.5} cy={1} r={6.5} fill="#2A1408" />
            <circle cx={sd * 1.5 + 2} cy={-2} r={2} fill="#FFFFFF" />
          </g>
        ))}
        <path d={`M-48 -28Q-34 ${-36 - 3 * smile} -20 -28M20 -28Q34 ${-36 - 3 * smile} 48 -28`} stroke="#5A3420" strokeWidth={3.4} fill="none" strokeLinecap="round" />
        {/* tilak and mukut */}
        <path d="M-10 -78L0 -48L10 -78Z" fill="#C8102E" />
        <path d="M-14 -82L14 -82" stroke="#F2F2F2" strokeWidth={4} />
        <g transform="translate(0 -110)">
          <path d="M-54 10L-46 -40L-24 -14L0 -70L24 -14L46 -40L54 10Z" fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={3} />
          <path d="M-56 10L56 10" stroke={P.goldDeep} strokeWidth={4} />
          <circle cx={0} cy={-26} r={8} fill="#C8102E" />
          <circle cx={-30} cy={-6} r={4} fill="#2E7BFF" />
          <circle cx={30} cy={-6} r={4} fill="#2E7BFF" />
          <circle cx={0} cy={-70} r={5} fill="#FFF3C9" />
        </g>
      </g>
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Court, kalank, crown                                                */
/* ------------------------------------------------------------------ */

const METALS = [
  ["#F2C14E", "#A8701E", "स्वर्ण"],
  ["#E4E8F0", "#8C96B4", "रजत"],
  ["#D9824A", "#8A4A22", "ताम्र"],
  ["#D8B25A", "#8A6A22", "पीतल"],
  ["#B8925A", "#6A4A22", "काँसा"],
  ["#A6AEB8", "#5A626E", "सीसा"],
  ["#C9CED6", "#7A828E", "जस्ता"],
  ["#D8D0E4", "#8C84A0", "अभ्रक"],
  ["#5A5E6A", "#24262E", "लोहा"],
] as const;

/** One throne: a cushioned seat with a rounded back, in the given metal. Origin = the seat's front centre. */
export const Seat: React.FC<{ c: string; d: string; s?: number; glow?: number }> = ({ c, d, s = 1, glow = 0 }) => (
  <g transform={`scale(${s})`}>
    {glow > 0.01 ? <ellipse cx={0} cy={-120} rx={150} ry={170} fill="url(#kqCool)" opacity={glow} /> : null}
    <path d="M-80 -150C-86 -250 -40 -300 0 -300C40 -300 86 -250 80 -150Z" fill={c} stroke={d} strokeWidth={6} />
    <path d="M-56 -160C-58 -230 -28 -266 0 -266C28 -266 58 -230 56 -160Z" fill={d} opacity={0.22} />
    <circle cx={0} cy={-238} r={12} fill={d} opacity={0.6} />
    <rect x={-100} y={-150} width={200} height={50} rx={14} fill={c} stroke={d} strokeWidth={6} />
    <rect x={-92} y={-176} width={184} height={30} rx={14} fill="#A8122A" stroke="#6A0A1A" strokeWidth={3} />
    <path d="M-86 -100L-76 0M86 -100L76 0" stroke={d} strokeWidth={14} strokeLinecap="round" />
    <path d="M-86 -100L-76 0M86 -100L76 0" stroke={c} strokeWidth={7} strokeLinecap="round" />
  </g>
);

/** The row of nine graha seats in descending order of metal, gold nearest the king, iron last (rightmost). */
export const NineSeats: React.FC<{ f: number; at: number; y: number; x0: number; gap: number; s?: number; ironGlow?: number; labels?: number }> = ({
  f, at, y, x0, gap, s = 0.62, ironGlow = 0, labels = 0,
}) => (
  <g>
    {METALS.map(([c, d, t], i) => {
      const k = prog(f, at + i * 3, at + i * 3 + 10, outBack);
      return (
        <g key={i} transform={`translate(${x0 + i * gap} ${y}) scale(${k})`} opacity={Math.min(1, k)}>
          <Seat c={c} d={d} s={s} glow={i === 8 ? ironGlow : 0} />
          {labels > 0 ? (
            <text y={36} textAnchor="middle" fontFamily="Mukta, sans-serif" fontWeight={800} fontSize={34} fill={i === 8 ? "#FFE3A1" : "#3A1F12"} opacity={labels}>
              {t}
            </text>
          ) : null}
        </g>
      );
    })}
  </g>
);

/** Vikramaditya's crown on its own (falls and cracks during the Sade Sati). Origin = the base centre. */
export const LooseCrown: React.FC<{ crack?: number; glow?: number }> = ({ crack = 0, glow = 0 }) => (
  <g>
    {glow > 0.01 ? <circle cy={-60} r={130} fill="url(#kqGold)" opacity={glow} /> : null}
    <path d="M-44 0L60 0L46 -80L8 -118L-30 -80Z" fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={3} />
    <path d="M-38 -40L56 -40" stroke={P.goldDeep} strokeWidth={3} />
    <path d="M-52 12Q8 22 68 12L68 -4Q8 6 -52 -4Z" fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={2} />
    <circle cx={8} cy={-62} r={8} fill="#2E7BFF" />
    {crack > 0 ? <path d="M8 -116L0 -90L14 -70L-2 -44L10 -20L2 4" stroke="#2A1408" strokeWidth={4} fill="none" pathLength={1} strokeDasharray={`${crack} 1`} /> : null}
  </g>
);

/** The stolen-necklace "kalank": a pearl-and-ruby haar glinting, two guards' spears crossing in from the sides. */
export const Kalank: React.FC<{ f: number; at: number; x: number; y: number }> = ({ f, at, x, y }) => {
  const k = prog(f, at - 4, at + 10, outBack);
  const sp = prog(f, at + 4, at + 16, outBack);
  return (
    <g transform={`translate(${x} ${y})`}>
      <g transform={`scale(${k})`} opacity={Math.min(1, k)}>
        <circle r={150} fill="url(#kqGold)" opacity={0.6} />
        {Array.from({ length: 17 }, (_, i) => {
          const a = Math.PI * (0.1 + (0.8 * i) / 16);
          return <circle key={i} cx={Math.cos(a) * 110} cy={-40 + Math.sin(a) * 110} r={i % 4 === 0 ? 13 : 10} fill={i % 4 === 0 ? "#C8102E" : "#FFF9EE"} stroke="#C9B48A" strokeWidth={2} />;
        })}
        <path d="M0 64L-22 96L0 134L22 96Z" fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={3} />
        <circle cy={98} r={12} fill="#C8102E" />
      </g>
      {[-1, 1].map((sd) => (
        <g key={sd} transform={`translate(${sd * lerp(700, 170, sp)} 40) rotate(${sd * -32})`}>
          <path d={`M0 -360L0 360`} stroke="#4A3420" strokeWidth={16} strokeLinecap="round" />
          <path d="M0 -440L-22 -360L22 -360Z" fill="#B9C2D0" stroke="#5A626E" strokeWidth={3} />
        </g>
      ))}
    </g>
  );
};

/** Garuda's wings: two great golden wing fans behind Vishnu. open 0..1. */
export const GarudaWings: React.FC<{ f: number; x: number; y: number; open?: number; s?: number }> = ({ f, x, y, open = 1, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={open}>
    {[-1, 1].map((sd) => (
      <g key={sd} transform={`scale(${sd} 1) rotate(${-10 + 6 * Math.sin(f / 10) - 30 * (1 - open)})`}>
        {Array.from({ length: 7 }, (_, i) => (
          <path
            key={i}
            d={`M0 0C80 ${-60 - i * 10} ${200 + i * 30} ${-120 + i * 26} ${300 + i * 26} ${-60 + i * 40}C${220 + i * 20} ${-40 + i * 36} 120 ${-10 + i * 10} 0 0Z`}
            fill={i % 2 ? "#F2B84E" : "#E8732A"}
            stroke="#8A3A12"
            strokeWidth={3}
            opacity={0.92}
          />
        ))}
      </g>
    ))}
  </g>
);

/** A lotus that withers under Shani's look: petals droop and grey as `wilt` goes 0 -> 1. Origin = the stem base. */
export const WiltLotus: React.FC<{ wilt: number; s?: number }> = ({ wilt, s = 1 }) => {
  const g = (c: string, d: string) => (wilt > 0 ? mixHex(c, d, wilt) : c);
  return (
    <g transform={`scale(${s})`}>
      <path d={`M0 0C0 -80 ${-10 * wilt} -160 ${60 * wilt} ${-220 + 70 * wilt}`} stroke={g("#3E7A3A", "#6A5A3A")} strokeWidth={10} fill="none" strokeLinecap="round" />
      <g transform={`translate(${60 * wilt} ${-220 + 70 * wilt}) rotate(${70 * wilt})`}>
        {[-70, -35, 0, 35, 70].map((a, i) => (
          <path
            key={a}
            d="M0 0C-26 -18 -30 -74 0 -116C30 -74 26 -18 0 0Z"
            transform={`rotate(${a * (1 + 0.6 * wilt) + (i % 2 ? 18 : -12) * wilt}) scale(1 ${1 - 0.25 * wilt})`}
            fill={g(i % 2 ? "#F28DB2" : "#F7A9C6", "#8A7A6E")}
            stroke={g("#B83A72", "#5A4A40")}
            strokeWidth={2.5}
          />
        ))}
        <ellipse cy={-12} rx={18} ry={9} fill={g("#FFE08A", "#7A6A50")} />
      </g>
    </g>
  );
};

const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mixHex = (a: string, b: string, u: number) => {
  const x = hex(a);
  const y = hex(b);
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * u).toString(16).padStart(2, "0")).join("")}`;
};

/** The curse ring: a violet glyph circling Shani's eyes when the curse is named. */
export const CurseRing: React.FC<{ f: number; at: number; x: number; y: number; r?: number }> = ({ f, at, x, y, r = 120 }) => {
  const k = prog(f, at - 2, at + 12, outBack);
  const o = Math.min(1, k) * (1 - prog(f, at + 40, at + 60));
  if (o <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${k}) rotate(${(f - at) * 1.2})`} opacity={o}>
      <circle r={r} fill="none" stroke="#B99BFF" strokeWidth={6} strokeDasharray="4 10" />
      <circle r={r * 0.82} fill="none" stroke="#7B66C9" strokeWidth={3} />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d={`M0 ${-r - 8}L6 ${-r - 26}L0 ${-r - 40}L-6 ${-r - 26}Z`} fill="#E4DAFF" transform={`rotate(${i * 30})`} opacity={0.8} />
      ))}
    </g>
  );
};
