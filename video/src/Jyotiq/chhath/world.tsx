import React from "react";
import { Flame, Stars } from "../manthan/sets";
import { rnd, vnoise } from "../navagraha/ep1/anim";

/*
 * छठी मैया की कथा sets and props, flat cut-out style (Manthan/Navagraha kit), drawn in a 1080 x 1920 SVG.
 * Night cremation ghat (moon-blue + pyre ember-orange: the fiery cold open), the sky crack, the golden vimana,
 * the palace cradle, the yagya kund, and the present-day Chhath ghat at sunrise with vratin silhouettes.
 * All motion is a pure function of the frame f.
 */
const W = 1080;
const H = 1920;

export const ChDefs: React.FC = () => (
  <defs>
    <linearGradient id="chNight" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#0A0820" />
      <stop offset="0.45" stopColor="#1C1440" />
      <stop offset="0.72" stopColor="#3A1E46" />
      <stop offset="0.86" stopColor="#7A2E2A" />
      <stop offset="1" stopColor="#2A1210" />
    </linearGradient>
    <linearGradient id="chRiverN" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#1E2150" />
      <stop offset="1" stopColor="#0C0C24" />
    </linearGradient>
    <linearGradient id="chStone" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#4A3A40" />
      <stop offset="1" stopColor="#241A1E" />
    </linearGradient>
    <radialGradient id="chEmber" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#FFB04A" stopOpacity="0.95" />
      <stop offset="0.4" stopColor="#FF6A1F" stopOpacity="0.45" />
      <stop offset="1" stopColor="#FF4A10" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="chMoon" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#FFF8E4" />
      <stop offset="0.6" stopColor="#F2E6C4" />
      <stop offset="1" stopColor="#F2E6C4" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="chDivine" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
      <stop offset="0.25" stopColor="#FFF0B8" stopOpacity="0.95" />
      <stop offset="0.6" stopColor="#FFC94D" stopOpacity="0.45" />
      <stop offset="1" stopColor="#FF9A1F" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="chBeam" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FFF6D0" stopOpacity="0.9" />
      <stop offset="1" stopColor="#FFD36B" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="chDawn" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FFE9C2" />
      <stop offset="0.35" stopColor="#FFC27A" />
      <stop offset="0.58" stopColor="#F8893A" />
      <stop offset="0.7" stopColor="#E85A2A" />
      <stop offset="1" stopColor="#B3361E" />
    </linearGradient>
    <linearGradient id="chRiverD" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#F6A65A" />
      <stop offset="0.5" stopColor="#C8603A" />
      <stop offset="1" stopColor="#6A2A28" />
    </linearGradient>
    <radialGradient id="chSun" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#FFFBEA" />
      <stop offset="0.5" stopColor="#FFE07A" />
      <stop offset="0.8" stopColor="#FFB23D" />
      <stop offset="1" stopColor="#FF8A1F" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="chSil" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#4A1E14" />
      <stop offset="1" stopColor="#2A0E0A" />
    </linearGradient>
    <linearGradient id="chWood" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#6A3A1C" />
      <stop offset="0.5" stopColor="#9A5A2A" />
      <stop offset="1" stopColor="#5A2E14" />
    </linearGradient>
    <filter id="chBlur14">
      <feGaussianBlur stdDeviation="14" />
    </filter>
    <filter id="chBlur4">
      <feGaussianBlur stdDeviation="4" />
    </filter>
    <filter id="chGrey">
      <feColorMatrix type="saturate" values="0.15" />
    </filter>
  </defs>
);

/* ------------------------------------------------------------------ */
/* Night ghat                                                          */
/* ------------------------------------------------------------------ */

const Spire: React.FC<{ x: number; y: number; s: number; c: string }> = ({ x, y, s, c }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={c}>
    <path d="M-60 0L-60 -120L-40 -150L-40 -210C-30 -260 -14 -300 0 -340C14 -300 30 -260 40 -210L40 -150L60 -120L60 0Z" />
    <path d="M0 -340L0 -380" stroke={c} strokeWidth={4} />
    <path d="M0 -380L26 -370L0 -360Z" />
  </g>
);

/** Smoke wisps rising from (x, y). */
export const Smoke: React.FC<{ f: number; x: number; y: number; n?: number; o?: number; c?: string; w?: number }> = ({ f, x, y, n = 6, o = 0.5, c = "#8A7A8A", w = 1 }) => (
  <g opacity={o} filter="url(#chBlur4)">
    {Array.from({ length: n }, (_, i) => {
      const life = 110;
      const t = (f + i * (life / n)) % life;
      const u = t / life;
      const px = x + vnoise(t / 30 + i, 31) * 60 * w + i * 6 - 18;
      const py = y - u * 520;
      return <ellipse key={i} cx={px} cy={py} rx={(30 + 70 * u) * w} ry={(22 + 40 * u) * w} fill={c} opacity={(1 - u) * Math.min(1, u * 5)} />;
    })}
  </g>
);

/** Embers rising (sparks of the pyre). */
export const Embers: React.FC<{ f: number; x: number; y: number; w: number; n?: number; o?: number }> = ({ f, x, y, w, n = 26, o = 1 }) => (
  <g opacity={o}>
    {Array.from({ length: n }, (_, i) => {
      const life = 60 + rnd(i, 41) * 60;
      const t = (f + rnd(i, 42) * life) % life;
      const u = t / life;
      const px = x + (rnd(i, 43) - 0.5) * w + Math.sin(t / 8 + i) * 16;
      const py = y - u * (300 + rnd(i, 44) * 300);
      const r = 2 + rnd(i, 45) * 3.5;
      return <circle key={i} cx={px} cy={py} r={r} fill={i % 3 ? "#FFB04A" : "#FFE7A0"} opacity={(1 - u) * (0.6 + 0.4 * Math.sin(f / 3 + i))} />;
    })}
  </g>
);

/** The pyre: stacked logs on a stone plinth, ember glow; `lit` 0 = embers only. Origin = base centre. */
export const Pyre: React.FC<{ f: number; x: number; y: number; s?: number; lit?: number }> = ({ f, x, y, s = 1, lit = 0.2 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={-80} rx={260} ry={200} fill="url(#chEmber)" opacity={0.55 + 0.25 * Math.sin(f / 6) * Math.sin(f / 11)} />
    <path d="M-170 0L-150 -40L150 -40L170 0Z" fill="#3A2A2A" stroke="#1E1414" strokeWidth={3} />
    {[0, 1, 2, 3].map((r) => (
      <g key={r}>
        {Array.from({ length: 5 - (r % 2) }, (_, i) => {
          const off = r % 2 ? 30 : 0;
          return (
            <rect key={i} x={-140 + off + i * 60} y={-72 - r * 30} width={52} height={28} rx={12} fill="url(#chWood)" stroke="#2A160A" strokeWidth={2.5} />
          );
        })}
      </g>
    ))}
    {[-90, -30, 30, 90].map((xx, i) => (
      <ellipse key={xx} cx={xx} cy={-60} rx={18} ry={8} fill="#FF7A22" opacity={0.5 + 0.5 * Math.abs(Math.sin(f / (4 + i) + i))} />
    ))}
    {lit > 0.25 ? (
      <g opacity={Math.min(1, (lit - 0.25) * 2)}>
        <Flame x={-60} y={-180} s={2.2} f={f} seed="py1" hot />
        <Flame x={10} y={-185} s={2.8} f={f} seed="py2" />
        <Flame x={80} y={-178} s={2.0} f={f} seed="py3" hot />
      </g>
    ) : null}
    <Embers f={f} x={0} y={-150} w={240} n={22} />
  </g>
);

/** The night cremation ghat: moon, distant temple spires, the river, stone steps, the pyre on the right. */
export const GhatNightSet: React.FC<{ f: number; pyre?: boolean; moonX?: number; crack?: number; warm?: number }> = ({ f, pyre = true, moonX = 300, crack = 0, warm = 1 }) => (
  <g>
    <rect width={W} height={H} fill="url(#chNight)" />
    <Stars f={f} n={70} y1={900} seed="chs" o={1 - crack * 0.7} />
    <circle cx={moonX} cy={560} r={210} fill="url(#chMoon)" opacity={0.35} />
    <circle cx={moonX} cy={560} r={92} fill="#F6EED6" />
    <circle cx={moonX + 26} cy={546} r={18} fill="#E2D6B8" opacity={0.6} />
    <circle cx={moonX - 30} cy={584} r={12} fill="#E2D6B8" opacity={0.5} />
    {/* far bank: temple spires and a banyan */}
    <g opacity={0.95}>
      <Spire x={760} y={1080} s={1.1} c="#160F28" />
      <Spire x={880} y={1080} s={0.75} c="#1B1430" />
      <Spire x={170} y={1080} s={0.6} c="#1B1430" />
      <path d="M0 1080L0 1000C80 980 160 1010 240 990C330 970 420 1000 520 990C640 975 760 1010 1080 990L1080 1080Z" fill="#140E24" />
      <g transform="translate(480 1000)" fill="#120C20">
        <rect x={-14} y={-150} width={28} height={160} />
        <circle cx={0} cy={-200} r={110} />
        <circle cx={-110} cy={-150} r={80} />
        <circle cx={110} cy={-160} r={86} />
        {[-80, -40, 50, 90].map((xx) => <path key={xx} d={`M${xx} -120L${xx + 4} 0`} stroke="#120C20" strokeWidth={3} />)}
      </g>
    </g>
    {/* river with the moon's broken reflection */}
    <rect x={0} y={1080} width={W} height={260} fill="url(#chRiverN)" />
    {Array.from({ length: 9 }, (_, i) => {
      const yy = 1100 + i * 26;
      const ww = 120 - i * 8 + 20 * Math.sin(f / 12 + i);
      return <rect key={i} x={moonX - ww / 2 + Math.sin(f / 18 + i * 1.7) * 14} y={yy} width={ww} height={5} rx={2.5} fill="#F2E6C4" opacity={0.55 - i * 0.04} />;
    })}
    {Array.from({ length: 6 }, (_, i) => (
      <path key={i} d={`M${(i * 190 + f * 1.2) % 1240 - 80} ${1150 + i * 30}q30 -8 60 0`} stroke="#5A5AA0" strokeWidth={3} fill="none" opacity={0.35} />
    ))}
    {/* stone ghat steps */}
    {Array.from({ length: 7 }, (_, i) => {
      const y0 = 1330 + i * 85;
      return (
        <g key={i}>
          <rect x={0} y={y0} width={W} height={85} fill={i % 2 ? "#2E2228" : "#382A30"} />
          <rect x={0} y={y0} width={W} height={7} fill="#5A4650" opacity={0.7} />
        </g>
      );
    })}
    {/* ember light washing the steps from the pyre */}
    <ellipse cx={860} cy={1420} rx={520} ry={360} fill="url(#chEmber)" opacity={0.35 * warm + 0.1 * Math.sin(f / 7)} />
    {pyre ? <Pyre f={f} x={860} y={1420} s={0.9} /> : null}
    {pyre ? <Smoke f={f} x={860} y={1210} n={7} o={0.35} /> : null}
  </g>
);

/** The sky splitting open: a jagged golden rift with light pouring down. k 0..1 opens it. */
export const SkyCrack: React.FC<{ f: number; k: number; x?: number; y?: number }> = ({ f, k, x = 560, y = 520 }) => {
  if (k <= 0.001) return null;
  const pts: [number, number][] = [[-520, -120], [-380, -60], [-300, -150], [-170, -40], [-60, -110], [40, 10], [150, -80], [260, 20], [380, -60], [540, 30]];
  const half = 8 + 70 * k;
  const top = pts.map(([px, py], i) => `${i ? "L" : "M"}${px * Math.min(1, k * 1.6)} ${py - half * (0.6 + 0.4 * Math.sin(i * 2.1))}`).join("");
  const bot = pts.slice().reverse().map(([px, py], i) => `L${px * Math.min(1, k * 1.6)} ${py + half * (0.6 + 0.4 * Math.cos(i * 1.7))}`).join("");
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse rx={700 * k} ry={420 * k} fill="url(#chDivine)" opacity={0.75} />
      <path d={`${top}${bot}Z`} fill="#FFF8E0" filter="url(#chBlur4)" />
      <path d={`${top}${bot}Z`} fill="#FFFFFF" opacity={0.9} />
      {Array.from({ length: 9 }, (_, i) => {
        const bx = -420 + i * 105;
        const sw = 30 + 30 * Math.abs(Math.sin(i * 1.3 + f / 20));
        return <path key={i} d={`M${bx - sw / 3} 0L${bx + sw / 3} 0L${bx * 1.35 + sw * 2} 1500L${bx * 1.35 - sw * 2} 1500Z`} fill="url(#chBeam)" opacity={0.35 * k} />;
      })}
    </g>
  );
};

/** The divine vimana: a flying golden temple-chariot on a lotus base, glowing. Origin = base centre. */
export const Vimana: React.FC<{ f: number; x: number; y: number; s?: number; glow?: number }> = ({ f, x, y, s = 1, glow = 1 }) => {
  const bob = Math.sin(f / 18) * 6;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s})`}>
      <ellipse cx={0} cy={-200} rx={420} ry={360} fill="url(#chDivine)" opacity={0.65 * glow} />
      <path d="M-120 20L120 20L320 1400L-320 1400Z" fill="url(#chBeam)" opacity={0.4 * glow} />
      {/* lotus base */}
      {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((i) => (
        <path key={i} d="M0 0C-26 -16 -30 -70 0 -110C30 -70 26 -16 0 0Z" transform={`translate(${i * 44} 20) rotate(${i * 9}) scale(1 0.8)`} fill={i % 2 ? "#F7B6C8" : "#FFD0DC"} stroke="#D9467A" strokeWidth={2} />
      ))}
      <path d="M-210 -40L210 -40L190 -10L-190 -10Z" fill="url(#mGold)" stroke="#6B410F" strokeWidth={3} />
      {/* wings of light */}
      {[-1, 1].map((sd) => (
        <g key={sd} transform={`scale(${sd} 1)`}>
          {[0, 1, 2].map((j) => (
            <path key={j} d={`M200 ${-60 - j * 20}C${300 + j * 40} ${-140 - j * 40} ${380 + j * 30} ${-120 - j * 50} ${420 + j * 20} ${-90 - j * 40}C${340} ${-70 - j * 20} 260 ${-50 - j * 10} 200 ${-40 - j * 20}Z`} fill={j % 2 ? "#FFE6A3" : "#FFF3CC"} stroke="#E8B24A" strokeWidth={2} opacity={0.9} transform={`rotate(${Math.sin(f / 10 + j) * 3} 200 -60)`} />
          ))}
        </g>
      ))}
      {/* pavilion: pillars, arch, shikhara */}
      {[-150, -60, 60, 150].map((xx) => (
        <rect key={xx} x={xx - 12} y={-210} width={24} height={170} fill="url(#mGold)" stroke="#6B410F" strokeWidth={2} />
      ))}
      <path d="M-120 -40L-120 -150C-120 -200 -70 -220 0 -220C70 -220 120 -200 120 -150L120 -40Z" fill="#FFF3C9" opacity={0.95} />
      <path d="M-120 -150C-120 -200 -70 -220 0 -220C70 -220 120 -200 120 -150" stroke="#C8102E" strokeWidth={8} fill="none" />
      <path d="M-190 -210L190 -210L170 -250L-170 -250Z" fill="url(#mGold)" stroke="#6B410F" strokeWidth={3} />
      <path d="M-130 -250C-120 -330 -70 -400 0 -470C70 -400 120 -330 130 -250Z" fill="url(#mGold)" stroke="#6B410F" strokeWidth={3} />
      {[0, 1, 2, 3].map((j) => (
        <path key={j} d={`M${-120 + j * 14} ${-270 - j * 50}Q0 ${-290 - j * 50} ${120 - j * 14} ${-270 - j * 50}`} stroke="#A8701E" strokeWidth={3} fill="none" />
      ))}
      <circle cx={0} cy={-480} r={16} fill="url(#mGold)" stroke="#6B410F" strokeWidth={2} />
      <path d="M0 -496L0 -560" stroke="#6B410F" strokeWidth={4} />
      <path d={`M0 -560L${50 + Math.sin(f / 5) * 6} ${-548 + Math.sin(f / 4) * 4}L0 -530Z`} fill="#F28C28" />
      {/* bells */}
      {[-180, 180].map((xx) => (
        <g key={xx} transform={`translate(${xx} -205) rotate(${Math.sin(f / 7 + xx) * 10})`}>
          <path d="M0 0L0 22" stroke="#6B410F" strokeWidth={2} />
          <path d="M-12 40C-12 26 -8 22 0 22C8 22 12 26 12 40Z" fill="url(#mGold)" />
        </g>
      ))}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Palace pieces                                                       */
/* ------------------------------------------------------------------ */

/** A carved wooden cradle (palna) hanging from a frame, empty, rocking by `rock` degrees. Origin = frame base centre. */
export const Cradle: React.FC<{ f: number; x: number; y: number; s?: number; rock?: number; baby?: React.ReactNode }> = ({ f, x, y, s = 1, rock = 6, baby }) => {
  const a = Math.sin(f / 16) * rock;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={6} rx={240} ry={24} fill="#7A3E1D" opacity={0.25} />
      {[-200, 200].map((xx) => (
        <g key={xx}>
          <rect x={xx - 14} y={-460} width={28} height={460} rx={8} fill="url(#chWood)" stroke="#3A1F12" strokeWidth={3} />
          <circle cx={xx} cy={-472} r={22} fill="url(#mGold)" stroke="#6B410F" strokeWidth={2} />
          <rect x={xx - 30} y={-14} width={60} height={20} rx={6} fill="#5A2E14" />
        </g>
      ))}
      <rect x={-214} y={-452} width={428} height={22} rx={10} fill="url(#chWood)" stroke="#3A1F12" strokeWidth={3} />
      <g transform={`rotate(${a} 0 -440)`}>
        {[-120, 120].map((xx) => (
          <path key={xx} d={`M${xx * 0.6} -440L${xx} -230`} stroke="#C9A24A" strokeWidth={5} strokeDasharray="10 6" />
        ))}
        <path d="M-170 -240C-170 -120 -110 -80 0 -80C110 -80 170 -120 170 -240Z" fill="#B9692E" stroke="#3A1F12" strokeWidth={4} />
        <path d="M-150 -220C-140 -130 -90 -100 0 -100C90 -100 140 -130 150 -220" stroke="url(#mGold)" strokeWidth={7} fill="none" />
        {[-100, -50, 0, 50, 100].map((xx) => (
          <circle key={xx} cx={xx} cy={-160 + Math.abs(xx) * 0.15} r={9} fill="url(#mGold)" />
        ))}
        <path d="M-170 -240L170 -240" stroke="#3A1F12" strokeWidth={8} strokeLinecap="round" />
        <path d="M-150 -246C-60 -270 60 -270 150 -246" fill="#FFF3DD" stroke="#E2C99A" strokeWidth={2} />
        {baby ? <g transform="translate(0 -262)">{baby}</g> : null}
        {/* a small toy hanging from the bar, still */}
        <path d="M0 -440L0 -330" stroke="#C9A24A" strokeWidth={2} />
        <circle cx={0} cy={-322} r={12} fill="#E3264A" />
        <path d="M-8 -312L8 -312L0 -298Z" fill="#E8B24A" />
      </g>
    </g>
  );
};

/** The yagya kund: a stepped brick altar with the sacred fire. k scales the flames (0.2 .. 1.6). Origin = base centre. */
export const HavanKund: React.FC<{ f: number; x: number; y: number; s?: number; k?: number }> = ({ f, x, y, s = 1, k = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={-200} rx={340 * (0.6 + 0.4 * k)} ry={300 * (0.6 + 0.4 * k)} fill="url(#chEmber)" opacity={0.7} />
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M${-200 + i * 30} ${-i * 34}L${200 - i * 30} ${-i * 34}L${190 - i * 30} ${-34 - i * 34}L${-190 + i * 30} ${-34 - i * 34}Z`} fill={i % 2 ? "#B8562E" : "#C8683A"} stroke="#5A2412" strokeWidth={3} />
    ))}
    {[-120, -60, 0, 60, 120].map((xx) => (
      <path key={xx} d={`M${xx} -6L${xx} -30`} stroke="#5A2412" strokeWidth={2} opacity={0.5} />
    ))}
    {/* swastika-free plain kund rim with turmeric and kumkum dots */}
    {[-110, -70, -30, 10, 50, 90].map((xx, i) => (
      <circle key={xx} cx={xx + 10} cy={-118} r={6} fill={i % 2 ? "#F6B70E" : "#C8102E"} />
    ))}
    <g transform="translate(0 -102)">
      <Flame x={-70} y={0} s={2.4 * k} f={f} seed="hk1" hot />
      <Flame x={70} y={0} s={2.3 * k} f={f} seed="hk2" hot />
      <Flame x={-20} y={0} s={3.3 * k} f={f} seed="hk3" />
      <Flame x={30} y={0} s={3.0 * k} f={f} seed="hk4" />
    </g>
    <Embers f={f} x={0} y={-200} w={200} n={24} o={Math.min(1, k)} />
  </g>
);

/** A gold bowl of charu (sweet rice), steam rising. Origin = bowl base. */
export const CharuBowl: React.FC<{ f: number; s?: number; glow?: number }> = ({ f, s = 1, glow = 0 }) => (
  <g transform={`scale(${s})`}>
    {glow > 0.01 ? <ellipse cy={-30} rx={90} ry={60} fill="#FFE9A6" opacity={0.6 * glow} filter="url(#mBlur8)" /> : null}
    <ellipse cx={0} cy={-34} rx={56} ry={14} fill="#FFF6E2" />
    <path d="M-58 -34C-54 -4 -30 6 0 6C30 6 54 -4 58 -34Z" fill="url(#mGold)" stroke="#6B410F" strokeWidth={2} />
    <circle cx={-14} cy={-38} r={4} fill="#C8102E" />
    <circle cx={12} cy={-36} r={3} fill="#2EA36A" />
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M${-20 + i * 20} -50C${-30 + i * 20} -70 ${-10 + i * 20} -80 ${-20 + i * 20} ${-100 - ((f + i * 10) % 30)}`} stroke="#FFFFFF" strokeWidth={3} fill="none" opacity={0.35} />
    ))}
  </g>
);

/* ------------------------------------------------------------------ */
/* Chhath dawn                                                         */
/* ------------------------------------------------------------------ */

/** A soop (bamboo winnowing basket) heaped with Chhath prasad: bananas, coconut, thekua, a diya. Origin = rim centre. */
export const Soop: React.FC<{ f: number; s?: number; rot?: number; lit?: boolean }> = ({ f, s = 1, rot = 0, lit = true }) => (
  <g transform={`rotate(${rot}) scale(${s})`}>
    <path d="M-90 0C-96 30 -60 52 0 52C60 52 96 30 90 0Z" fill="#D9A55A" stroke="#7A4E1E" strokeWidth={3} />
    {[-60, -30, 0, 30, 60].map((xx) => (
      <path key={xx} d={`M${xx} 2L${xx * 0.8} 48`} stroke="#A8783A" strokeWidth={2} />
    ))}
    <path d="M-92 0Q0 -10 92 0" stroke="#7A4E1E" strokeWidth={6} fill="none" />
    <path d="M-60 -6C-62 -40 -40 -56 -20 -50C-30 -40 -40 -24 -40 -6Z" fill="#F6D04A" stroke="#A8801A" strokeWidth={2} />
    <path d="M-44 -6C-46 -44 -24 -60 -4 -52C-14 -42 -24 -26 -24 -6Z" fill="#FFDD5A" stroke="#A8801A" strokeWidth={2} />
    <circle cx={30} cy={-26} r={26} fill="#7A4E2A" stroke="#4A2E14" strokeWidth={2} />
    <path d="M18 -44C26 -50 38 -48 42 -40" stroke="#5A3A1C" strokeWidth={3} fill="none" />
    <ellipse cx={-4} cy={-14} rx={16} ry={9} fill="#C88A3A" stroke="#7A4E1E" strokeWidth={1.5} />
    <ellipse cx={62} cy={-12} rx={14} ry={8} fill="#C88A3A" stroke="#7A4E1E" strokeWidth={1.5} />
    <circle cx={8} cy={-6} r={6} fill="#C8102E" />
    {lit ? (
      <g transform="translate(-74 -10)">
        <path d="M-12 0C-12 8 12 8 12 0Z" fill="#B8562E" />
        <Flame x={0} y={-2} s={0.5} f={f} seed="sp" />
      </g>
    ) : null}
  </g>
);

/**
 * A vratin at the ghat: a warm rim-lit silhouette of a woman standing in the river, pallu over her head, both arms
 * raised holding a soop toward the sun. Origin = waterline centre. raise 0..1 lifts the soop.
 */
export const Vratin: React.FC<{ f: number; x: number; y: number; s?: number; raise?: number; seed?: number; facing?: number; child?: boolean }> = ({
  f, x, y, s = 1, raise = 1, seed = 1, facing = 1, child = false,
}) => {
  const sway = Math.sin(f / 30 + seed) * 1.5;
  const hy = -560 - 160 * raise;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * facing} ${s}) rotate(${sway})`}>
      {/* body in sari, cut at the waterline */}
      <path d="M-70 0C-80 -120 -86 -260 -72 -380C-66 -440 -50 -470 -30 -480L30 -480C50 -470 66 -440 72 -380C86 -260 80 -120 70 0Z" fill="url(#chSil)" />
      <path d="M-70 0C-80 -120 -86 -260 -72 -380C-66 -440 -50 -470 -30 -480" stroke="#FFB04A" strokeWidth={5} fill="none" opacity={0.85} />
      {/* sari border glint and pleats */}
      <path d="M-74 -300C-20 -280 30 -290 76 -320" stroke="#E8B24A" strokeWidth={6} fill="none" opacity={0.8} />
      {/* arms raised */}
      <path d={`M-40 -460C-70 -500 -70 ${hy + 60} -44 ${hy + 10}`} stroke="#3A160E" strokeWidth={26} fill="none" strokeLinecap="round" />
      <path d={`M40 -460C70 -500 70 ${hy + 60} 44 ${hy + 10}`} stroke="#3A160E" strokeWidth={26} fill="none" strokeLinecap="round" />
      <path d={`M-40 -460C-70 -500 -70 ${hy + 60} -44 ${hy + 10}`} stroke="#FFB04A" strokeWidth={4} fill="none" opacity={0.7} transform="translate(-10 0)" />
      {/* head with the pallu drawn over it */}
      <ellipse cx={0} cy={-540} rx={52} ry={62} fill="url(#chSil)" />
      <path d="M-58 -520C-62 -590 -30 -620 0 -620C30 -620 62 -590 58 -520C64 -480 76 -440 80 -400L-80 -400C-76 -440 -64 -480 -58 -520Z" fill="#5A1A14" />
      <path d="M-58 -520C-62 -590 -30 -620 0 -620C30 -620 62 -590 58 -520" stroke="#FFB04A" strokeWidth={5} fill="none" />
      <path d="M-62 -540C-20 -560 20 -560 62 -540" stroke="#E8B24A" strokeWidth={5} fill="none" opacity={0.8} />
      {/* the soop held up */}
      <g transform={`translate(0 ${hy})`}>
        <Soop f={f + seed * 13} s={0.9} />
      </g>
      {/* a child beside her (silhouette) */}
      {child ? (
        <g transform="translate(150 0)">
          <path d="M-38 0C-44 -80 -44 -160 -34 -220L34 -220C44 -160 44 -80 38 0Z" fill="url(#chSil)" />
          <circle cx={0} cy={-260} r={42} fill="url(#chSil)" />
          <path d="M-42 -262C-40 -300 -20 -306 0 -306C24 -306 40 -294 42 -262" stroke="#FFB04A" strokeWidth={4} fill="none" />
          <path d="M-30 -200C-60 -230 -70 -300 -100 -340" stroke="#3A160E" strokeWidth={18} fill="none" strokeLinecap="round" />
        </g>
      ) : null}
      {/* ripples at the waterline */}
      {[0, 1].map((i) => (
        <ellipse key={i} cx={0} cy={6} rx={110 + 30 * ((f / 20 + i / 2) % 1) * 2} ry={14 + 6 * ((f / 20 + i / 2) % 1)} fill="none" stroke="#FFE0A0" strokeWidth={3} opacity={0.6 * (1 - ((f / 20 + i / 2) % 1))} />
      ))}
    </g>
  );
};

/** A floating diya on the water. */
export const WaterDiya: React.FC<{ f: number; x: number; y: number; s?: number; seed: string }> = ({ f, x, y, s = 1, seed }) => (
  <g transform={`translate(${x + Math.sin(f / 25 + x) * 6} ${y + Math.sin(f / 15 + y) * 2}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={60} ry={20} fill="#FFB04A" opacity={0.25} />
    <path d="M-26 -4C-24 10 24 10 26 -4Z" fill="#B8562E" stroke="#6A2A12" strokeWidth={2} />
    <Flame x={0} y={-4} s={0.6} f={f} seed={seed} />
  </g>
);

/** Sugarcane canopy (the Chhath kosi): four canes tied at the top, with a lamp under. Origin = base centre. */
export const Kosi: React.FC<{ f: number; x: number; y: number; s?: number }> = ({ f, x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-1, 1].map((sd) => (
      <g key={sd}>
        <path d={`M${sd * 110} 0C${sd * 90} -200 ${sd * 40} -360 0 -420`} stroke="#5E8F33" strokeWidth={14} fill="none" />
        {[1, 2, 3, 4].map((j) => {
          const t = j / 5;
          const px = sd * 110 * (1 - t) * (1 - t) + 2 * (1 - t) * t * sd * 70;
          const py = -420 * t * (2 - t) * 0.95;
          return <path key={j} d={`M${px - 9} ${py}L${px + 9} ${py}`} stroke="#3F6B22" strokeWidth={4} />;
        })}
        <path d={`M0 -420C${sd * 60} -470 ${sd * 120} -460 ${sd * 160} -430`} stroke="#7FB04A" strokeWidth={8} fill="none" />
        <path d={`M0 -420C${sd * 40} -500 ${sd * 90} -520 ${sd * 120} -510`} stroke="#6E9B3A" strokeWidth={7} fill="none" />
      </g>
    ))}
    <path d="M-20 -410L20 -410" stroke="#E3264A" strokeWidth={8} />
    <path d="M-30 -6C-28 14 28 14 30 -6Z" fill="#B8562E" />
    <Flame x={0} y={-6} s={0.8} f={f} seed="kosi" />
    <ellipse cx={0} cy={-20} rx={80} ry={50} fill="#FFB04A" opacity={0.25} />
  </g>
);

/** The present-day Chhath ghat at sunrise: the sun disk rising over the river, glitter path, far bank, kosi, diyas. */
export const DawnGhatSet: React.FC<{ f: number; rise?: number; sunX?: number }> = ({ f, rise = 1, sunX = 540 }) => {
  const sy = 1060 - 260 * rise;
  return (
    <g>
      <rect width={W} height={H} fill="url(#chDawn)" />
      <circle cx={sunX} cy={sy} r={460} fill="url(#chSun)" opacity={0.55} />
      <circle cx={sunX} cy={sy} r={170} fill="#FFF3C0" />
      <circle cx={sunX} cy={sy} r={170} fill="none" stroke="#FFD36B" strokeWidth={10} opacity={0.8} />
      {Array.from({ length: 4 }, (_, i) => (
        <path key={i} d={`M${-100 + i * 300 + f * 0.6} ${520 + i * 70}c60 -30 140 -30 200 0`} stroke="#FFE6C0" strokeWidth={10} fill="none" opacity={0.35} strokeLinecap="round" />
      ))}
      {/* birds */}
      {[0, 1, 2].map((i) => {
        const bx = ((f * 2.2 + i * 160) % 1300) - 100;
        const by = 640 - i * 40 + Math.sin(f / 9 + i) * 10;
        const fl = Math.sin(f / 3 + i) * 10;
        return <path key={i} d={`M${bx - 20} ${by + fl}Q${bx - 10} ${by - 6} ${bx} ${by}Q${bx + 10} ${by - 6} ${bx + 20} ${by + fl}`} stroke="#5A2A1C" strokeWidth={4} fill="none" />;
      })}
      {/* far bank */}
      <path d="M0 1080L0 1030C120 1010 260 1040 380 1020C520 1000 640 1030 780 1012C900 1000 1000 1020 1080 1010L1080 1080Z" fill="#7A2E22" />
      <Spire x={160} y={1040} s={0.45} c="#6A2620" />
      <Spire x={930} y={1040} s={0.55} c="#6A2620" />
      {/* river with the sun's glitter path */}
      <rect x={0} y={1080} width={W} height={840} fill="url(#chRiverD)" />
      {Array.from({ length: 16 }, (_, i) => {
        const yy = 1095 + i * 34;
        const ww = 90 + i * 16 + 30 * Math.sin(f / 10 + i);
        return <rect key={i} x={sunX - ww / 2 + Math.sin(f / 14 + i * 1.3) * 18} y={yy} width={ww} height={6} rx={3} fill="#FFF0B8" opacity={0.75 - i * 0.035} />;
      })}
      {[[120, 1230, "w1"], [330, 1300, "w2"], [760, 1260, "w3"], [960, 1340, "w4"], [560, 1420, "w5"]].map(([xx, yy, sd]) => (
        <WaterDiya key={sd as string} f={f} x={xx as number} y={yy as number} s={0.9} seed={sd as string} />
      ))}
    </g>
  );
};
