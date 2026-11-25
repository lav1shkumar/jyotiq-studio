import React from "react";
import { rnd } from "../../navagraha/ep1/anim";
import { P } from "../../manthan/style";

/*
 * भारत Ep5 sets (all new; earlier episodes' files are imported read-only). Look notes from the research pass: Indian palace
 * interiors in the epic TV dramas are carved sandstone with bell (ghata-pallava) capitals and lotus bases, cusped arches,
 * jharokha windows with jaali screens, brass lamps on chains, silk drapes with zari borders, toran garlands, lotus rangoli
 * on polished floors; night rivers read best as deep indigo with a cool moon path, reeds and mist; dawn as rose-gold haze.
 *  W5Defs: gradients and filters used here (mount once).
 *  KuntiChamber: Kunti's chamber in Kuntibhoja's palace, with a cusped jharokha (sky: night 0 .. dawn 1), sun rising in it,
 *    jaali screens with light shafts, carved pillars, hanging brass lamps, drapes, toran, lotus rangoli floor. blaze floods it gold.
 *  CourtyardSet: the palace courtyard with an arcade and a tulsi chaura; season 0 summer .. 1 monsoon .. 2 winter .. 3 spring.
 *  NightRiver: moonlit river under the palace on its hill, reeds, mist, fireflies, ghat steps.
 *  DawnRiver: rose-gold dawn on the far reach of the river, mist, egrets, reeds, a charioteer's chariot on the bank.
 *  SunMandala: Surya's radiance: rotating ray petals, rings, a lotus mandala and sparks.
 *  HoraDial: the seven grahas of the hora cycle on a dial; the needle settles on Surya.
 */
const W = 1080;
const H = 1920;
const mix = (a: string, b: string, u: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const k = Math.max(0, Math.min(1, u));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * k).toString(16).padStart(2, "0")).join("");
};

export const W5Defs: React.FC = () => (
  <defs>
    <linearGradient id="w5Sand" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#C98E58" />
      <stop offset="0.6" stopColor="#B07642" />
      <stop offset="1" stopColor="#7E4E2A" />
    </linearGradient>
    <linearGradient id="w5Pillar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#8A5A32" />
      <stop offset="0.35" stopColor="#E2B47A" />
      <stop offset="0.6" stopColor="#C8945C" />
      <stop offset="1" stopColor="#6E4424" />
    </linearGradient>
    <linearGradient id="w5Drape" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#5A0C1E" />
      <stop offset="0.5" stopColor="#9A1A34" />
      <stop offset="1" stopColor="#5A0C1E" />
    </linearGradient>
    <linearGradient id="w5Floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#6A3E22" />
      <stop offset="1" stopColor="#2E180C" />
    </linearGradient>
    <radialGradient id="w5Shaft" cx="0.5" cy="0" r="1">
      <stop offset="0" stopColor="#FFF0C0" stopOpacity="0.85" />
      <stop offset="1" stopColor="#FFD27A" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="w5Sun" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#FFFDF0" />
      <stop offset="0.35" stopColor="#FFE58A" />
      <stop offset="0.7" stopColor="#FFB23D" stopOpacity="0.8" />
      <stop offset="1" stopColor="#FF8A1E" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="w5Moon" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#E8EEFF" stopOpacity="0.7" />
      <stop offset="1" stopColor="#8AA0E0" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="w5NightSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#070A22" />
      <stop offset="0.6" stopColor="#16204A" />
      <stop offset="1" stopColor="#2A2E62" />
    </linearGradient>
    <linearGradient id="w5NightWater" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#1C2452" />
      <stop offset="1" stopColor="#080C24" />
    </linearGradient>
    <linearGradient id="w5DawnSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#5A6AB0" />
      <stop offset="0.35" stopColor="#E89AA8" />
      <stop offset="0.7" stopColor="#FFC98A" />
      <stop offset="1" stopColor="#FFE6B8" />
    </linearGradient>
    <linearGradient id="w5DawnWater" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#F2B88E" />
      <stop offset="0.5" stopColor="#B88AA0" />
      <stop offset="1" stopColor="#5A5A8A" />
    </linearGradient>
    <filter id="w5Blur4" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" />
    </filter>
    <filter id="w5Blur14" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="14" />
    </filter>
    <filter id="w5Blur30" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="30" />
    </filter>
  </defs>
);

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

/** A carved sandstone pillar: lotus base, fluted shaft with bands, a ghata-pallava (pot and foliage) capital and brackets. */
export const CarvedPillar: React.FC<{ x: number; y0: number; y1: number; w?: number; dark?: number }> = ({ x, y0, y1, w = 120, dark = 0 }) => {
  const h = y1 - y0;
  return (
    <g>
      {/* bracket arms at the top */}
      <path d={`M${x - w / 2 - 70} ${y0 + 10}L${x + w / 2 + 70} ${y0 + 10}L${x + w / 2 + 40} ${y0 + 44}L${x - w / 2 - 40} ${y0 + 44}Z`} fill="#9A6236" stroke="#5A3418" strokeWidth={3} />
      {[-1, 1].map((sd) => (
        <path key={sd} d={`M${x + sd * (w / 2)} ${y0 + 110}C${x + sd * (w / 2 + 30)} ${y0 + 100} ${x + sd * (w / 2 + 56)} ${y0 + 70} ${x + sd * (w / 2 + 60)} ${y0 + 44}L${x + sd * (w / 2 + 28)} ${y0 + 44}C${x + sd * (w / 2 + 24)} ${y0 + 66} ${x + sd * (w / 2 + 14)} ${y0 + 80} ${x + sd * (w / 2)} ${y0 + 86}Z`} fill="#B07642" stroke="#5A3418" strokeWidth={3} />
      ))}
      {/* capital: abacus, foliage pot */}
      <rect x={x - w / 2 - 18} y={y0 + 44} width={w + 36} height={26} fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={2} />
      <path d={`M${x - w / 2 - 6} ${y0 + 70}C${x - w / 2 - 20} ${y0 + 110} ${x - w / 2 + 6} ${y0 + 150} ${x - w / 2 + 14} ${y0 + 160}L${x + w / 2 - 14} ${y0 + 160}C${x + w / 2 - 6} ${y0 + 150} ${x + w / 2 + 20} ${y0 + 110} ${x + w / 2 + 6} ${y0 + 70}Z`} fill="url(#w5Pillar)" stroke="#5A3418" strokeWidth={3} />
      {[-0.32, 0, 0.32].map((u) => (
        <path key={u} d={`M${x + u * w} ${y0 + 156}C${x + u * w - 22} ${y0 + 130} ${x + u * w - 18} ${y0 + 92} ${x + u * w} ${y0 + 76}C${x + u * w + 18} ${y0 + 92} ${x + u * w + 22} ${y0 + 130} ${x + u * w} ${y0 + 156}Z`} fill="#7A9A3A" stroke="#3E5A1A" strokeWidth={2} opacity={0.85} />
      ))}
      {/* shaft with flutes and carved bands */}
      <rect x={x - w / 2 + 10} y={y0 + 160} width={w - 20} height={h - 260} fill="url(#w5Pillar)" />
      {[-0.28, -0.1, 0.08, 0.26].map((u) => (
        <path key={u} d={`M${x + u * w} ${y0 + 170}L${x + u * w} ${y1 - 110}`} stroke="#6E4424" strokeWidth={3} opacity={0.5} />
      ))}
      {[0.22, 0.5, 0.78].map((u) => {
        const yy = y0 + 160 + (h - 260) * u;
        return (
          <g key={u}>
            <rect x={x - w / 2 + 2} y={yy - 16} width={w - 4} height={32} fill="#A86A3A" stroke="#5A3418" strokeWidth={2} />
            {[-0.3, -0.1, 0.1, 0.3].map((v) => <circle key={v} cx={x + v * w} cy={yy} r={7} fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={1} />)}
          </g>
        );
      })}
      {/* lotus base */}
      <path d={`M${x - w / 2 - 20} ${y1}L${x + w / 2 + 20} ${y1}L${x + w / 2 + 6} ${y1 - 60}L${x - w / 2 - 6} ${y1 - 60}Z`} fill="#9A6236" stroke="#5A3418" strokeWidth={3} />
      {Array.from({ length: 7 }, (_, i) => {
        const xx = x - w / 2 + (i * w) / 6;
        return <path key={i} d={`M${xx - 12} ${y1 - 60}C${xx - 12} ${y1 - 90} ${xx} ${y1 - 104} ${xx} ${y1 - 104}C${xx} ${y1 - 104} ${xx + 12} ${y1 - 90} ${xx + 12} ${y1 - 60}Z`} fill="#C8945C" stroke="#5A3418" strokeWidth={2} />;
      })}
      <rect x={x - w / 2 - 26} y={y1} width={w + 52} height={30} fill="#6E4424" />
      {dark > 0.01 ? <rect x={x - w / 2 - 80} y={y0} width={w + 160} height={h + 30} fill="#0A0618" opacity={dark} /> : null}
    </g>
  );
};

/** A brass hanging lamp on chains (swinging gently). Origin = the ceiling hook. */
export const HangingLamp: React.FC<{ x: number; y: number; len: number; f: number; seed: number; lit?: number; s?: number }> = ({ x, y, len, f, seed, lit = 1, s = 1 }) => {
  const sw = Math.sin(f / 40 + seed) * 2.5;
  return (
    <g transform={`translate(${x} ${y}) rotate(${sw}) scale(${s})`}>
      {[-16, 0, 16].map((xx) => <path key={xx} d={`M0 0L${xx} ${len}`} stroke="#8A6A2A" strokeWidth={2.5} strokeDasharray="6 4" />)}
      <g transform={`translate(0 ${len})`}>
        {lit > 0.01 ? <circle cy={10} r={120} fill="#FFB04A" opacity={0.22 * lit} filter="url(#w5Blur14)" /> : null}
        <path d="M-40 0L40 0L28 26C14 34 -14 34 -28 26Z" fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={2} />
        <path d="M-40 0L40 0" stroke={P.goldDeep} strokeWidth={3} />
        <path d="M0 32L0 52M-8 46L8 46" stroke={P.goldDeep} strokeWidth={2.5} />
        <circle cy={56} r={4} fill="url(#mGold)" />
        {lit > 0.01
          ? [-24, 0, 24].map((xx, i) => (
              <path key={xx} d={`M${xx - 5} -2C${xx - 6} -14 ${xx - 1} -20 ${xx} ${-28 - 3 * Math.sin(f / 3 + i + seed)}C${xx + 1} -20 ${xx + 6} -14 ${xx + 5} -2Z`} fill="#FFC23A" opacity={lit} />
            ))
          : null}
      </g>
    </g>
  );
};

/** A toran across the top: mango leaves and marigold garlands. */
export const Toran: React.FC<{ y: number; f: number; x0?: number; x1?: number }> = ({ y, f, x0 = -20, x1 = W + 20 }) => (
  <g>
    <path d={`M${x0} ${y}L${x1} ${y}`} stroke="#6A4422" strokeWidth={6} />
    {Array.from({ length: 4 }, (_, i) => {
      const a = x0 + ((x1 - x0) * i) / 4;
      const b = x0 + ((x1 - x0) * (i + 1)) / 4;
      return (
        <g key={i}>
          {Array.from({ length: 13 }, (_, j) => {
            const u = j / 12;
            const xx = a + (b - a) * u;
            const yy = y + Math.sin(u * Math.PI) * 70;
            return <circle key={j} cx={xx} cy={yy} r={11} fill={j % 2 ? "#F59A1B" : "#FFC23A"} stroke="#C8701A" strokeWidth={1.4} />;
          })}
        </g>
      );
    })}
    {Array.from({ length: 22 }, (_, i) => {
      const xx = x0 + 24 + i * ((x1 - x0 - 48) / 21);
      return <path key={`l${i}`} d={`M${xx} ${y}C${xx - 12} ${y + 22} ${xx - 8} ${y + 50} ${xx} ${y + 62}C${xx + 8} ${y + 50} ${xx + 12} ${y + 22} ${xx} ${y}Z`} fill="#2E7A32" stroke="#1A4A1E" strokeWidth={1.5} transform={`rotate(${Math.sin(f / 30 + i) * 4} ${xx} ${y})`} />;
    })}
  </g>
);

const CUSP = (cx: number, top: number, w: number, base: number) => {
  // a cusped (multifoil) arch: five lobes from the springing line up to the apex
  const r = w / 2;
  const n = 5;
  let d = `M${cx - r} ${base}`;
  for (let i = 0; i < n; i++) {
    const a0 = Math.PI * (1 - i / n);
    const a1 = Math.PI * (1 - (i + 1) / n);
    const x1 = cx + Math.cos(a1) * r;
    const y1 = base - Math.sin(a1) * (base - top);
    const am = (a0 + a1) / 2;
    const xm = cx + Math.cos(am) * r * 0.86;
    const ym = base - Math.sin(am) * (base - top) * 0.86;
    d += `Q${xm.toFixed(1)} ${ym.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  return d;
};

/** A jaali (lattice) panel: stars in a grid, light coming through. */
const Jaali: React.FC<{ x: number; y: number; w: number; h: number; light: number }> = ({ x, y, w, h, light }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={mix("#3A2210", "#FFE3A0", light)} />
    {Array.from({ length: Math.floor(h / 36) }, (_, r) =>
      Array.from({ length: Math.floor(w / 36) }, (_, c) => {
        const cx = x + 18 + c * 36;
        const cy = y + 18 + r * 36;
        return <path key={`${r}${c}`} d={`M${cx} ${cy - 16}L${cx + 5} ${cy - 5}L${cx + 16} ${cy}L${cx + 5} ${cy + 5}L${cx} ${cy + 16}L${cx - 5} ${cy + 5}L${cx - 16} ${cy}L${cx - 5} ${cy - 5}Z`} fill="#8A5A30" stroke="#5A3418" strokeWidth={1.5} />;
      }),
    )}
    <rect x={x} y={y} width={w} height={h} fill="none" stroke="#5A3418" strokeWidth={8} />
  </g>
);

/* ------------------------------------------------------------------ */
/* Sets                                                                */
/* ------------------------------------------------------------------ */

/**
 * Kunti's chamber. dawn 0 night .. 1 sunrise (the sky in the jharokha, the light on the walls); sunY = the sun's height in the
 * window (pixels from its base, 0 below the horizon); blaze 0..1 floods the room with Surya's gold (shafts, white-gold wash).
 */
export const KuntiChamber: React.FC<{ f: number; dawn?: number; sunY?: number; blaze?: number; lamps?: number }> = ({ f, dawn = 0.6, sunY = 120, blaze = 0, lamps = 1 }) => {
  const winL = 330;
  const winR = 750;
  const winTop = 560;
  const winBase = 1210;
  const arch = CUSP(540, winTop, winR - winL, winTop + 180);
  const win = `${arch}L${winR} ${winBase}L${winL} ${winBase}Z`;
  const wall = mix("#2A120A", "#A85E34", 0.3 + 0.6 * dawn);
  const sunCy = winBase - 60 - sunY;
  return (
    <g>
      <rect width={W} height={H} fill={wall} />
      <rect width={W} height={H} fill="url(#w5Sand)" opacity={0.35 + 0.4 * dawn} style={{ mixBlendMode: "multiply" }} />
      {/* wall carving: a frieze of lotus medallions and niche shelves */}
      <rect x={0} y={250} width={W} height={60} fill="#7E4E2A" opacity={0.7} />
      {Array.from({ length: 12 }, (_, i) => (
        <g key={i} transform={`translate(${45 + i * 90} 280)`}>
          {[0, 45, 90, 135].map((a) => <ellipse key={a} rx={6} ry={20} fill="#C8945C" transform={`rotate(${a})`} />)}
          <circle r={7} fill="url(#mGold)" />
        </g>
      ))}
      {/* the jharokha: sky, rising sun, far hills and palace */}
      <clipPath id="w5Win">
        <path d={win} />
      </clipPath>
      <g clipPath="url(#w5Win)">
        <rect x={winL} y={winTop} width={winR - winL} height={winBase - winTop} fill={mix("#0C1236", "#F4A88A", dawn)} />
        <rect x={winL} y={winTop + 300 * (1 - dawn)} width={winR - winL} height={winBase - winTop} fill="#FFD9A0" opacity={0.7 * dawn} />
        {dawn < 0.5 ? Array.from({ length: 18 }, (_, i) => <circle key={i} cx={winL + rnd(i, 1) * 420} cy={winTop + rnd(i, 2) * 420} r={1.5 + rnd(i, 3) * 1.5} fill="#FFFFFF" opacity={(0.5 - dawn) * 1.6 * (0.6 + 0.4 * Math.sin(f / 9 + i))} />) : null}
        <circle cx={560} cy={sunCy} r={200 + 200 * blaze} fill="url(#w5Sun)" opacity={0.7 * dawn + blaze} />
        <circle cx={560} cy={sunCy} r={56 + 30 * blaze} fill="#FFF6D8" opacity={Math.min(1, dawn * 1.4 + blaze)} />
        <path d={`M${winL} ${winBase - 150}C430 ${winBase - 190} 520 ${winBase - 170} 600 ${winBase - 200}C660 ${winBase - 220} 720 ${winBase - 180} ${winR} ${winBase - 190}L${winR} ${winBase}L${winL} ${winBase}Z`} fill={mix("#141634", "#B8707A", dawn)} />
        <g fill={mix("#0E1028", "#8A4A5A", dawn)}>
          {[410, 470, 640, 700].map((x, i) => <path key={x} d={`M${x - 20} ${winBase - 140}L${x - 20} ${winBase - 200 - (i % 2) * 30}L${x} ${winBase - 240 - (i % 2) * 40}L${x + 20} ${winBase - 200 - (i % 2) * 30}L${x + 20} ${winBase - 140}Z`} />)}
        </g>
        <path d={`M${winL} ${winBase - 90}L${winR} ${winBase - 90}L${winR} ${winBase}L${winL} ${winBase}Z`} fill={mix("#10122A", "#7A4A50", dawn)} />
      </g>
      {/* arch frame with carving */}
      <path d={win} fill="none" stroke="#5A3418" strokeWidth={26} />
      <path d={win} fill="none" stroke="url(#mGold)" strokeWidth={8} />
      <path d={CUSP(540, winTop - 40, winR - winL + 90, winTop + 190)} fill="none" stroke="#7E4E2A" strokeWidth={14} />
      {/* jaali screens either side, with light breaking through */}
      <Jaali x={150} y={700} w={144} h={504} light={0.2 + 0.7 * dawn + blaze} />
      <Jaali x={786} y={700} w={144} h={504} light={0.2 + 0.7 * dawn + blaze} />
      {/* the chhajja sill with brackets and diyas */}
      <path d={`M${winL - 60} ${winBase}L${winR + 60} ${winBase}L${winR + 40} ${winBase + 40}L${winL - 40} ${winBase + 40}Z`} fill="#8A5A30" stroke="#5A3418" strokeWidth={3} />
      {[winL - 20, 540, winR + 20].map((x) => (
        <path key={x} d={`M${x - 24} ${winBase + 40}L${x + 24} ${winBase + 40}L${x + 10} ${winBase + 90}L${x - 10} ${winBase + 90}Z`} fill="#A86A3A" stroke="#5A3418" strokeWidth={2} />
      ))}
      {[winL + 10, winR - 10].map((x, i) => (
        <g key={x} transform={`translate(${x} ${winBase - 6})`}>
          <path d="M-22 0C-20 12 20 12 22 0Z" fill="url(#mGold)" />
          <path d={`M-4 -2C-5 -12 -1 -16 0 ${-24 - 2 * Math.sin(f / 3 + i)}C1 -16 5 -12 4 -2Z`} fill="#FFC23A" opacity={lamps} />
          <circle cy={-10} r={40} fill="#FFB04A" opacity={0.25 * lamps} filter="url(#w5Blur14)" />
        </g>
      ))}
      {/* drapes tied at the window sides */}
      {[-1, 1].map((sd) => {
        const x = 540 + sd * 300;
        return (
          <g key={sd}>
            <path d={`M${x - 70} 330C${x - 60} 700 ${x - sd * 40} 900 ${x - 10} 1060C${x + 10} 1180 ${x - 20} 1340 ${x - 50} 1400L${x + 50} 1400C${x + 40} 1300 ${x + 60} 1100 ${x + 40} 980C${x + 30} 800 ${x + 60} 560 ${x + 70} 330Z`} fill="url(#w5Drape)" transform={`rotate(${Math.sin(f / 50 + sd) * 0.6} ${x} 330)`} />
            <path d={`M${x - 50} 1400L${x + 50} 1400`} stroke="url(#mGold)" strokeWidth={10} />
            <path d={`M${x - 40} 1040C${x - 10} 1060 ${x + 20} 1060 ${x + 46} 1030`} stroke="url(#mGold)" strokeWidth={9} fill="none" />
            <circle cx={x + 2} cy={1056} r={9} fill="#C8102E" stroke={P.goldDeep} strokeWidth={2} />
          </g>
        );
      })}
      {/* pillars */}
      <CarvedPillar x={70} y0={330} y1={1420} w={130} />
      <CarvedPillar x={1010} y0={330} y1={1420} w={130} />
      <Toran y={330} f={f} />
      {/* floor with a lotus rangoli in perspective and the window's reflection */}
      <rect x={0} y={1420} width={W} height={H - 1420} fill="url(#w5Floor)" />
      <path d={`M${winL} 1420L${winR} 1420L${winR + 140} ${H}L${winL - 140} ${H}Z`} fill="#FFD9A0" opacity={0.08 + 0.12 * dawn + 0.2 * blaze} />
      <g transform="translate(540 1640) scale(1 0.32)">
        {Array.from({ length: 16 }, (_, i) => <ellipse key={i} cy={-150} rx={36} ry={110} fill={i % 2 ? "#E8892A" : "#C8102E"} opacity={0.75} transform={`rotate(${i * 22.5})`} />)}
        {Array.from({ length: 8 }, (_, i) => <ellipse key={`w${i}`} cy={-80} rx={26} ry={70} fill="#F8EEDB" opacity={0.8} transform={`rotate(${i * 45 + 22})`} />)}
        <circle r={60} fill="#F6B70E" />
        <circle r={240} fill="none" stroke="#F8EEDB" strokeWidth={10} strokeDasharray="4 18" opacity={0.7} />
      </g>
      {/* hanging brass lamps */}
      <HangingLamp x={250} y={0} len={360} f={f} seed={1} lit={lamps * (1 - 0.5 * dawn)} />
      <HangingLamp x={830} y={0} len={300} f={f} seed={2.4} lit={lamps * (1 - 0.5 * dawn)} />
      {/* light shafts from the window and jaalis */}
      {dawn > 0.3 || blaze > 0.01 ? (
        <g opacity={Math.min(0.75, (dawn - 0.3) * 0.7 + 0.6 * blaze)} style={{ mixBlendMode: "screen" }}>
          <path d={`M${winL + 40} ${winTop + 200}L${winR - 40} ${winTop + 200}L${winR + 260} ${H}L${winL - 260} ${H}Z`} fill="url(#w5Shaft)" opacity={0.4} />
          {[0, 1].map((i) => <path key={i} d={`M${i ? 786 : 150} 760L${i ? 930 : 294} 760L${i ? 1080 : 400} 1700L${i ? 880 : 0} 1700Z`} fill="url(#w5Shaft)" opacity={0.25} />)}
          {Array.from({ length: 24 }, (_, i) => {
            const yy = ((f * (0.6 + rnd(i, 4)) + rnd(i, 5) * 1200) % 1200) + 500;
            return <circle key={i} cx={300 + rnd(i, 6) * 480 + Math.sin(f / 30 + i) * 20} cy={yy} r={1.6 + rnd(i, 7) * 2} fill="#FFF3C0" opacity={0.5} />;
          })}
        </g>
      ) : null}
      {blaze > 0.01 ? <rect width={W} height={H} fill="#FFD27A" opacity={0.12 * blaze} style={{ mixBlendMode: "screen" }} /> : null}
    </g>
  );
};

/** The palace courtyard: an arcade of cusped arches, a tulsi chaura, the sky turning through a year (season 0..3). */
export const CourtyardSet: React.FC<{ f: number; season: number }> = ({ f, season }) => {
  const sk = ["#F6C27A", "#7A8494", "#B8C8DA", "#F4C8C0"];
  const i0 = Math.max(0, Math.min(3, Math.floor(season)));
  const i1 = Math.min(3, i0 + 1);
  const u = season - i0;
  const sky = mix(sk[i0], sk[i1], u);
  const rain = Math.max(0, 1 - Math.abs(season - 1) * 1.6);
  const mist = Math.max(0, 1 - Math.abs(season - 2) * 1.6);
  const petals = Math.max(0, 1 - Math.abs(season - 3) * 1.6);
  const leaves = Math.max(0, 1 - Math.abs(season - 0) * 1.6);
  return (
    <g>
      <rect width={W} height={H} fill={sky} />
      <circle cx={760} cy={300} r={140} fill="#FFF3C0" opacity={0.6 * (leaves + petals)} filter="url(#w5Blur30)" />
      {/* far palace domes */}
      <g fill={mix("#C8945C", "#5A6070", rain)} opacity={0.75}>
        <path d="M120 760L120 600C120 520 180 470 240 470C300 470 360 520 360 600L360 760Z" />
        <path d="M240 470L240 420" stroke={mix("#C8945C", "#5A6070", rain)} strokeWidth={6} />
        <path d="M720 760L720 560C720 480 790 430 860 430C930 430 1000 480 1000 560L1000 760Z" />
        <rect x={380} y={620} width={320} height={140} />
      </g>
      {/* arcade */}
      <rect x={0} y={760} width={W} height={620} fill={mix("#C8945C", "#7A6A64", rain)} />
      {[0, 1, 2, 3].map((i) => {
        const cx = 135 + i * 270;
        return (
          <g key={i}>
            <path d={`${CUSP(cx, 860, 200, 980)}L${cx + 100} 1380L${cx - 100} 1380Z`} fill={mix("#3A2216", "#2A2630", rain)} opacity={0.85} />
            <path d={CUSP(cx, 860, 200, 980)} fill="none" stroke="url(#mGold)" strokeWidth={6} />
          </g>
        );
      })}
      <rect x={0} y={760} width={W} height={40} fill="#7E4E2A" />
      {/* courtyard floor */}
      <rect x={0} y={1380} width={W} height={H - 1380} fill={mix("#D8A870", "#6A6060", rain)} />
      {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${540 + (i - 3.5) * 150} 1380L${540 + (i - 3.5) * 420} ${H}`} stroke="#8A5A30" strokeWidth={2} opacity={0.4} />)}
      {/* tulsi chaura */}
      <g transform="translate(880 1500)">
        <path d="M-80 0L80 0L66 -150L-66 -150Z" fill="#E8D2A8" stroke="#8A5A30" strokeWidth={4} />
        <path d="M-90 -150L90 -150L90 -176L-90 -176Z" fill="#C8945C" stroke="#8A5A30" strokeWidth={3} />
        <rect x={-24} y={-110} width={48} height={60} rx={24} fill="#8A3A22" />
        <path d="M0 -176L0 -300" stroke="#3E5A1A" strokeWidth={6} />
        {Array.from({ length: 14 }, (_, i) => (
          <ellipse key={i} cx={(i % 2 ? 1 : -1) * (14 + (i % 3) * 8)} cy={-196 - i * 8} rx={18} ry={9} fill={i % 3 ? "#3E8A3A" : "#2E6A2A"} transform={`rotate(${(i % 2 ? 1 : -1) * 30} ${(i % 2 ? 1 : -1) * 14} ${-196 - i * 8})`} />
        ))}
        <path d={`M8 -180C10 -190 14 -192 14 ${-198 - 2 * Math.sin(f / 3)}`} stroke="#FFC23A" strokeWidth={4} />
      </g>
      {/* weather */}
      {rain > 0.01 ? Array.from({ length: 60 }, (_, i) => {
        const y = ((f * 34 + rnd(i, 1) * 2000) % 2000) - 80;
        const x = rnd(i, 2) * 1180 - 60;
        return <path key={i} d={`M${x} ${y}l-10 50`} stroke="#DDE6F0" strokeWidth={2.2} opacity={0.5 * rain} />;
      }) : null}
      {mist > 0.01 ? [0, 1, 2].map((i) => <rect key={i} x={-200 + ((f * (0.5 + i * 0.2)) % 400)} y={900 + i * 220} width={1500} height={140} rx={70} fill="#EEF2F8" opacity={0.3 * mist} filter="url(#w5Blur30)" />) : null}
      {petals + leaves > 0.01 ? Array.from({ length: 24 }, (_, i) => {
        const y = ((f * (2 + rnd(i, 3) * 2) + rnd(i, 4) * 2000) % 2000) - 60;
        const x = rnd(i, 5) * 1080 + Math.sin(f / 20 + i) * 40;
        return <ellipse key={i} cx={x} cy={y} rx={9} ry={5} fill={petals > leaves ? "#F28DB2" : "#D88A2A"} opacity={0.8 * Math.max(petals, leaves)} transform={`rotate(${f * 3 + i * 40} ${x} ${y})`} />;
      }) : null}
    </g>
  );
};

const Reeds: React.FC<{ x: number; y: number; f: number; n?: number; c?: string; s?: number; flip?: boolean }> = ({ x, y, f, n = 9, c = "#0A0C1E", s = 1, flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    {Array.from({ length: n }, (_, i) => {
      const xx = i * 26 + rnd(i, 1) * 10;
      const hh = 260 + rnd(i, 2) * 260;
      const sw = Math.sin(f / 25 + i * 0.7) * 10;
      return (
        <g key={i}>
          <path d={`M${xx} 0Q${xx + sw * 0.5} ${-hh * 0.5} ${xx + sw} ${-hh}`} stroke={c} strokeWidth={5} fill="none" />
          {i % 3 === 0 ? <ellipse cx={xx + sw} cy={-hh - 20} rx={7} ry={26} fill={c} /> : null}
          {i % 2 ? <path d={`M${xx} -40Q${xx - 40} ${-hh * 0.4} ${xx - 60 + sw} ${-hh * 0.6}`} stroke={c} strokeWidth={4} fill="none" /> : null}
        </g>
      );
    })}
  </g>
);

/** The river by night under Kuntibhoja's palace: moon, moon path, the lit palace on its hill, reeds, mist, fireflies, steps. */
export const NightRiver: React.FC<{ f: number; moonX?: number; steps?: boolean; horizon?: number }> = ({ f, moonX = 760, steps = true, horizon = 1000 }) => (
  <g>
    <rect width={W} height={H} fill="url(#w5NightSky)" />
    {Array.from({ length: 80 }, (_, i) => <circle key={i} cx={rnd(i, 11) * W} cy={rnd(i, 12) * (horizon - 100)} r={0.8 + rnd(i, 13) * 2} fill="#FFFFFF" opacity={0.3 + 0.5 * Math.abs(Math.sin(f / (20 + i) + i))} />)}
    <circle cx={moonX} cy={420} r={260} fill="url(#w5Moon)" />
    <circle cx={moonX} cy={420} r={84} fill="#F4F0E0" />
    <circle cx={moonX - 22} cy={404} r={14} fill="#DCD6C2" opacity={0.6} />
    <circle cx={moonX + 24} cy={440} r={10} fill="#DCD6C2" opacity={0.5} />
    {/* the palace on its hill with lit windows */}
    <path d={`M0 ${horizon}L0 ${horizon - 140}C140 ${horizon - 220} 260 ${horizon - 320} 380 ${horizon - 330}C480 ${horizon - 330} 560 ${horizon - 220} 700 ${horizon - 170}C840 ${horizon - 130} 960 ${horizon - 160} 1080 ${horizon - 120}L1080 ${horizon}Z`} fill="#0C1030" />
    <g transform={`translate(380 ${horizon - 330})`} fill="#141A40">
      <rect x={-130} y={-120} width={260} height={130} />
      <path d="M-90 -120L-90 -190C-90 -230 -50 -250 -10 -250L10 -250C50 -250 90 -230 90 -190L90 -120Z" />
      <path d="M-160 -60L-160 -150C-160 -175 -140 -190 -120 -190C-100 -190 -80 -175 -80 -150L-80 -60Z" />
      <path d="M80 -60L80 -150C80 -175 100 -190 120 -190C140 -190 160 -175 160 -150L160 -60Z" />
      <path d="M0 -250L0 -290" stroke="#141A40" strokeWidth={5} />
      <path d="M0 -290L26 -280L0 -270Z" fill="#B3182E" />
      {[[-100, -40], [-60, -40], [60, -40], [100, -40], [-20, -160], [20, -160], [-120, -120], [120, -120]].map(([x, y], i) => (
        <rect key={i} x={x - 8} y={y - 14} width={16} height={22} rx={8} fill="#FFC86A" opacity={0.75 + 0.25 * Math.sin(f / 13 + i)} />
      ))}
    </g>
    {/* water with the moon path */}
    <rect x={0} y={horizon} width={W} height={H - horizon} fill="url(#w5NightWater)" />
    {Array.from({ length: 16 }, (_, i) => {
      const yy = horizon + 14 + i * 30;
      const ww = 160 - i * 6 + 30 * Math.sin(f / 12 + i);
      return <rect key={i} x={moonX - ww / 2 + Math.sin(f / 18 + i * 1.7) * (10 + i * 2)} y={yy} width={ww} height={4 + i * 0.3} rx={2} fill="#E8E6D2" opacity={0.6 - i * 0.03} />;
    })}
    {Array.from({ length: 10 }, (_, i) => (
      <path key={i} d={`M${(i * 150 + f * 1.4) % 1300 - 110} ${horizon + 60 + i * 60}q40 -10 80 0`} stroke="#5A6AB0" strokeWidth={3} fill="none" opacity={0.3} />
    ))}
    {/* mist bands */}
    {[0, 1].map((i) => <rect key={i} x={-300 + ((f * (0.6 + 0.3 * i)) % 600)} y={horizon - 60 + i * 120} width={1700} height={110} rx={55} fill="#A8B4E0" opacity={0.18} filter="url(#w5Blur30)" />)}
    {/* reeds both sides and fireflies */}
    <Reeds x={-30} y={horizon + 380} f={f} n={8} />
    <Reeds x={1110} y={horizon + 420} f={f} n={8} flip />
    {Array.from({ length: 16 }, (_, i) => {
      const x = rnd(i, 21) * W + Math.sin(f / (17 + i) + i) * 40;
      const y = horizon - 40 + rnd(i, 22) * 500 + Math.cos(f / (23 + i)) * 30;
      return <circle key={i} cx={x} cy={y} r={3} fill="#D8FF8A" opacity={0.3 + 0.6 * Math.max(0, Math.sin(f / 7 + i * 2))} />;
    })}
    {steps
      ? Array.from({ length: 5 }, (_, i) => {
          const y0 = 1500 + i * 90;
          return (
            <g key={i}>
              <rect x={0} y={y0} width={W} height={90} fill={i % 2 ? "#1E1A2E" : "#262036"} />
              <rect x={0} y={y0} width={W} height={6} fill="#4A4466" opacity={0.7} />
            </g>
          );
        })
      : null}
  </g>
);

/** The far reach of the river at dawn: rose-gold haze, mist, egrets, reeds; a chariot and horse on the near bank (bank = show it). */
export const DawnRiver: React.FC<{ f: number; bank?: boolean; horizon?: number; sunX?: number }> = ({ f, bank = true, horizon = 980, sunX = 300 }) => (
  <g>
    <rect width={W} height={H} fill="url(#w5DawnSky)" />
    <circle cx={sunX} cy={horizon - 90} r={300} fill="url(#w5Sun)" opacity={0.8} />
    <circle cx={sunX} cy={horizon - 90} r={70} fill="#FFF6D8" />
    {/* far tree line */}
    <path d={`M0 ${horizon}L0 ${horizon - 60}${Array.from({ length: 14 }, (_, i) => `Q${i * 80 + 40} ${horizon - 110 - rnd(i, 31) * 60} ${(i + 1) * 80} ${horizon - 60}`).join("")}L1120 ${horizon}Z`} fill="#8A6A8A" opacity={0.8} />
    {/* egrets */}
    {[0, 1, 2].map((i) => {
      const x = ((f * (2.2 + i * 0.4) + i * 300) % 1400) - 160;
      const y = 520 + i * 70 + Math.sin(f / 10 + i) * 10;
      const w = Math.sin(f / 4 + i) * 14;
      return <path key={i} d={`M${x - 26} ${y + w}Q${x - 10} ${y - 6} ${x} ${y}Q${x + 10} ${y - 6} ${x + 26} ${y + w}`} stroke="#FFFFFF" strokeWidth={4} fill="none" strokeLinecap="round" />;
    })}
    <rect x={0} y={horizon} width={W} height={H - horizon} fill="url(#w5DawnWater)" />
    {Array.from({ length: 14 }, (_, i) => {
      const yy = horizon + 12 + i * 28;
      const ww = 140 - i * 5 + 30 * Math.sin(f / 12 + i);
      return <rect key={i} x={sunX - ww / 2 + Math.sin(f / 16 + i * 1.3) * (8 + i * 2)} y={yy} width={ww} height={4} rx={2} fill="#FFF0C8" opacity={0.7 - i * 0.04} />;
    })}
    {[0, 1, 2].map((i) => <rect key={i} x={-300 + ((f * (0.5 + 0.2 * i)) % 600)} y={horizon - 80 + i * 110} width={1700} height={120} rx={60} fill="#FFF0E0" opacity={0.28} filter="url(#w5Blur30)" />)}
    <Reeds x={-20} y={horizon + 420} f={f} n={7} c="#4A3A4A" />
    {bank ? (
      <g>
        <path d={`M560 ${H}C600 1560 760 1440 1080 1400L1080 ${H}Z`} fill="#7A5A42" />
        <path d={`M560 ${H}C600 1560 760 1440 1080 1400`} stroke="#A8805A" strokeWidth={8} fill="none" />
        {/* chariot: body, wheel and pole, and a resting horse */}
        <g transform="translate(900 1420)">
          <path d="M-90 -20L60 -20L50 -110L-80 -110Z" fill="#8A3A22" stroke="#4A1A0E" strokeWidth={4} />
          <path d="M-80 -110L50 -110" stroke="url(#mGold)" strokeWidth={8} />
          <circle cx={-20} cy={0} r={70} fill="none" stroke="#5A3A1C" strokeWidth={12} />
          {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M-20 0L${-20 + Math.cos((i * Math.PI) / 4) * 66} ${Math.sin((i * Math.PI) / 4) * 66}`} stroke="#5A3A1C" strokeWidth={6} />)}
          <circle cx={-20} cy={0} r={12} fill="url(#mGold)" />
          <path d="M-90 -40L-230 -60" stroke="#5A3A1C" strokeWidth={8} />
        </g>
      </g>
    ) : null}
  </g>
);

/** Surya's radiance: rotating ray petals, rings, a lotus mandala, sparks. k 0..1. Origin = (x, y). */
export const SunMandala: React.FC<{ f: number; x: number; y: number; r: number; k: number }> = ({ f, x, y, r, k }) =>
  k > 0.01 ? (
    <g transform={`translate(${x} ${y})`} opacity={Math.min(1, k)}>
      <circle r={r * 1.9} fill="url(#w5Sun)" opacity={0.9} />
      <g transform={`rotate(${f * 0.5})`}>
        {Array.from({ length: 36 }, (_, i) => (
          <path key={i} d={`M0 ${-r * 0.7}L${r * 0.05} ${-r * (1.25 + 0.15 * (i % 2))}L${-r * 0.05} ${-r * (1.25 + 0.15 * (i % 2))}Z`} fill="#FFE58A" opacity={0.65} transform={`rotate(${i * 10})`} />
        ))}
      </g>
      <g transform={`rotate(${-f * 0.3})`}>
        {Array.from({ length: 16 }, (_, i) => (
          <path key={i} d={`M0 ${-r * 0.55}C${r * 0.12} ${-r * 0.7} ${r * 0.1} ${-r * 0.92} 0 ${-r}C${-r * 0.1} ${-r * 0.92} ${-r * 0.12} ${-r * 0.7} 0 ${-r * 0.55}Z`} fill="#FFF3C0" fillOpacity={0.35} stroke="#FFC23A" strokeWidth={3} transform={`rotate(${i * 22.5})`} />
        ))}
      </g>
      <circle r={r * 0.56} fill="none" stroke="#FFE58A" strokeWidth={6} opacity={0.9} />
      <circle r={r * 1.04} fill="none" stroke="#FFD27A" strokeWidth={3} strokeDasharray="10 14" opacity={0.7} transform={`rotate(${f})`} />
      {Array.from({ length: 20 }, (_, i) => {
        const a = (i / 20) * Math.PI * 2 + f / 40;
        const rr = r * (1.2 + 0.4 * ((f / 30 + rnd(i, 41)) % 1));
        return <circle key={i} cx={Math.cos(a) * rr} cy={Math.sin(a) * rr} r={3 + rnd(i, 42) * 3} fill="#FFFBE0" opacity={0.7 * (1 - ((f / 30 + rnd(i, 41)) % 1))} />;
      })}
    </g>
  ) : null;

const HORA = [
  { n: "सूर्य", c: "#FF8A1E", g: "☉" },
  { n: "शुक्र", c: "#E85A9A", g: "♀" },
  { n: "बुध", c: "#2EA36A", g: "☿" },
  { n: "चंद्र", c: "#8AA0E0", g: "☾" },
  { n: "शनि", c: "#3A4A8A", g: "♄" },
  { n: "गुरु", c: "#E8B22A", g: "♃" },
  { n: "मंगल", c: "#D8302E", g: "♂" },
];
/** The hora dial: the seven grahas in hora order round a gold ring; the needle sweeps and settles on Surya at `at`. */
export const HoraDial: React.FC<{ f: number; x: number; y: number; r: number; at: number; font: string }> = ({ f, x, y, r, at, font }) => {
  const u = Math.max(0, Math.min(1, (f - (at - 40)) / 40));
  const ease = 1 - Math.pow(1 - u, 3);
  const ang = -360 * 1.5 * (1 - ease);
  const lit = Math.max(0, Math.min(1, (f - at) / 10));
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r + 40} fill="#FFF8EC" stroke="#F2C14E" strokeWidth={6} />
      <circle r={r - 70} fill="none" stroke="#F2C14E" strokeWidth={3} strokeDasharray="4 10" />
      {HORA.map((h, i) => {
        const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
        const on = i === 0 ? lit : 0;
        return (
          <g key={h.n} transform={`translate(${Math.cos(a) * r} ${Math.sin(a) * r})`}>
            {on > 0.01 ? <circle r={70} fill="#FFC23A" opacity={0.45 * on} filter="url(#w5Blur14)" /> : null}
            <circle r={46 + 8 * on} fill={i === 0 ? mix("#FFFFFF", "#FF8A1E", on) : "#FFFFFF"} stroke={h.c} strokeWidth={5} />
            <text y={-2} textAnchor="middle" fontSize={34} fill={i === 0 && on > 0.5 ? "#FFFFFF" : h.c} fontWeight={700}>{h.g}</text>
            <text y={30} textAnchor="middle" fontSize={22} fontWeight={800} fill={i === 0 && on > 0.5 ? "#FFFFFF" : "#5A3418"} style={{ fontFamily: font }}>{h.n}</text>
          </g>
        );
      })}
      <g transform={`rotate(${ang})`}>
        <path d={`M-10 0L0 ${-r + 60}L10 0Z`} fill="#C8102E" />
        <circle r={22} fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={3} />
      </g>
    </g>
  );
};
