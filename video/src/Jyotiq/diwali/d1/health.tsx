import React from "react";
import { sparkle } from "../../katha/style";
import { H, ramp, rnd, W, wob } from "../../manthan/style";
import { HeadR, limb, Lit, V } from "./market";

/* Diwali Day 1, line 06 "पर सबसे बड़ा निवेश, अपनी सेहत में": three quick health vignettes against a sunrise, in
   the present-day silhouette style (dark figure, warm rim light). Each beat is a full-frame shot with a slow
   parallax drift; the scene cuts between them on the words.
   beat 0: a grandmother on a morning walk with her stick. beat 1: a child running, arms out, dupatta flying.
   beat 2: a glass of water on a window sill catching the sunrise.
   k 0..1 = progress through the beat (drives the drift). Put <HealthDefs /> once in the svg. */

export const HealthDefs: React.FC = () => (
  <defs>
    <linearGradient id="h1Sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#2C3C6E" />
      <stop offset="0.38" stopColor="#8A5A86" />
      <stop offset="0.56" stopColor="#F29A5A" />
      <stop offset="0.64" stopColor="#FFD08A" />
      <stop offset="0.66" stopColor="#5A2A34" />
      <stop offset="1" stopColor="#24101A" />
    </linearGradient>
    <radialGradient id="h1Sun">
      <stop offset="0" stopColor="#FFFDF0" />
      <stop offset="0.45" stopColor="#FFE9A6" />
      <stop offset="0.75" stopColor="#FFC060" stopOpacity="0.85" />
      <stop offset="1" stopColor="#FF9A40" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="h1SunGlow">
      <stop offset="0" stopColor="#FFE2A0" stopOpacity="0.8" />
      <stop offset="1" stopColor="#FF9A40" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="h1Water" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FFE6B0" stopOpacity="0.55" />
      <stop offset="1" stopColor="#F2A65A" stopOpacity="0.35" />
    </linearGradient>
    <linearGradient id="h1Glass" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.35" />
      <stop offset="0.2" stopColor="#FFFFFF" stopOpacity="0.06" />
      <stop offset="0.8" stopColor="#FFFFFF" stopOpacity="0.04" />
      <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.3" />
    </linearGradient>
    <filter id="h1Rim" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" />
    </filter>
    <linearGradient id="h1Saree" x1="0" y1="0" x2="1" y2="0.15">
      <stop offset="0" stopColor="#14201E" />
      <stop offset="0.6" stopColor="#2E5A52" />
      <stop offset="1" stopColor="#D8B08A" />
    </linearGradient>
  </defs>
);

const SIL = "#1C0C16";

/** Silhouette with a warm back-light rim. */
const Sil: React.FC<{ d: string; rim?: number }> = ({ d, rim = 1 }) => (
  <g>
    <path d={d} fill="none" stroke="#FFC77A" strokeWidth={12} opacity={0.7 * rim} filter="url(#h1Rim)" />
    <path d={d} fill="none" stroke="#FFE6B0" strokeWidth={3.5} opacity={0.95 * rim} />
    <path d={d} fill={SIL} />
  </g>
);

/** Sunrise sky, sun on the horizon at (sx, 1180), a distant skyline of trees and a temple shikhara, a few birds. */
const Sunrise: React.FC<{ f: number; drift: number; sx?: number; ground?: boolean }> = ({ f, drift, sx = 540, ground = true }) => {
  const hz = 1180;
  return (
    <g>
      <rect x={-100} y={-100} width={W + 200} height={H + 200} fill="url(#h1Sky)" />
      <circle cx={sx} cy={hz} r={520} fill="url(#h1SunGlow)" />
      {Array.from({ length: 14 }).map((_, i) => {
        const a = Math.PI + (i / 13) * Math.PI;
        const l = 900 + rnd(`ray${i}`) * 300;
        const w = 0.03 + rnd(`rw${i}`) * 0.03;
        const x1 = sx + Math.cos(a - w) * l;
        const y1 = hz + Math.sin(a - w) * l;
        const x2 = sx + Math.cos(a + w) * l;
        const y2 = hz + Math.sin(a + w) * l;
        return <path key={i} d={`M${sx} ${hz}L${x1} ${y1}L${x2} ${y2}Z`} fill="#FFE6B0" opacity={0.07 + 0.04 * wob(`rf${i}`, f / 20)} />;
      })}
      <circle cx={sx} cy={hz} r={150} fill="url(#h1Sun)" />
      {/* skyline, drifting slower than the foreground */}
      <g transform={`translate(${-drift * 40},0)`} fill="#4A2234" opacity={0.95}>
        <path
          d={`M-200 ${hz}L-200 ${hz - 40}C-120 ${hz - 110} -40 ${hz - 60} 40 ${hz - 90}C120 ${hz - 140} 200 ${hz - 70} 280 ${hz - 60}L300 ${hz - 60}L360 ${hz - 60}C460 ${hz - 50} 560 ${hz - 120} 660 ${hz - 70}C760 ${hz - 30} 860 ${hz - 130} 960 ${hz - 80}C1060 ${hz - 40} 1160 ${hz - 100} 1300 ${hz - 60}L1300 ${hz}Z`}
        />
        <path d={`M300 ${hz - 60}C302 ${hz - 130} 316 ${hz - 190} 330 ${hz - 200}C344 ${hz - 190} 358 ${hz - 130} 360 ${hz - 60}Z`} />
        <ellipse cx={330} cy={hz - 202} rx={15} ry={6} />
        <path d={`M326 ${hz - 206}L330 ${hz - 226}L334 ${hz - 206}Z`} />
        <path d={`M330 ${hz - 224}L330 ${hz - 262}`} stroke="#4A2234" strokeWidth={3} />
        <path d={`M331 ${hz - 262}L360 ${hz - 252}L331 ${hz - 242}Z`} fill="#E07A1F" />
      </g>
      {ground ? (
        <g>
          <rect x={-100} y={hz} width={W + 200} height={H} fill="#2A1220" />
          <path d={`M-100 ${hz + 260}C300 ${hz + 200} 700 ${hz + 220} 1200 ${hz + 280}L1200 ${hz + 340}C700 ${hz + 290} 300 ${hz + 270} -100 ${hz + 340}Z`} fill="#6A3A3A" opacity={0.6} />
        </g>
      ) : null}
      {/* birds */}
      {[0, 1, 2, 3].map((i) => {
        const x = 200 + i * 130 + ((f * 1.6 + i * 40) % 300) - drift * 60;
        const y = 560 + i * 40 + wob(`bd${i}`, f / 12) * 14;
        const flap = Math.sin(f / 3 + i) * 8;
        return <path key={i} d={`M${x - 16} ${y - flap}Q${x - 6} ${y - 6} ${x} ${y}Q${x + 6} ${y - 6} ${x + 16} ${y - flap}`} stroke="#3A1A28" strokeWidth={3.5} fill="none" />;
      })}
      {/* sun motes */}
      {Array.from({ length: 18 }).map((_, i) => (
        <circle
          key={i}
          cx={(rnd(`mt${i}x`) * W + f * (0.4 + rnd(`mv${i}`)) - drift * 30) % W}
          cy={500 + rnd(`mt${i}y`) * 1100 + wob(`my${i}`, f / 25) * 20}
          r={2 + rnd(`mr${i}`) * 3}
          fill="#FFF0C0"
          opacity={0.4 + 0.3 * wob(`mo${i}`, f / 8)}
        />
      ))}
    </g>
  );
};

/** Beat 0: a grandmother in a saree, pallu over her head, walking right toward the sun with a stick, her face lit
 *  and smiling. Feet at (0,0), ~620 px tall. Needs MarketDefs (m1LitR) in the same svg. */
const Dadi: React.FC<{ f: number }> = ({ f }) => {
  const ph = f / 7;
  const bob = Math.abs(Math.sin(ph)) * 6;
  const step = Math.sin(ph) * 26;
  const stick = Math.sin(ph) * 5;
  const hand: V = [104 + stick, -318];
  return (
    <g transform={`translate(0,${-bob})`}>
      {/* stick */}
      <path d={`M${hand[0]} ${hand[1]}L${136 + stick * 2} 0`} stroke="#3A1E10" strokeWidth={9} strokeLinecap="round" />
      <path d={`M${hand[0] + 3} ${hand[1]}L${139 + stick * 2} 0`} stroke="#FFD9A0" strokeWidth={2.5} opacity={0.8} />
      {/* feet in chappals */}
      <Sil d={`M${-30 - step} -6C${-30 - step} -22 ${6 - step} -22 ${14 - step} -6Z`} rim={0.6} />
      <Sil d={`M${40 + step} -6C${40 + step} -22 ${78 + step} -22 ${88 + step} -6Z`} rim={0.6} />
      {/* saree with a slight stoop; gold border on the hem */}
      <Lit d="M-60 -16C-70 -160 -74 -300 -60 -400C-52 -446 -24 -478 10 -484C50 -488 76 -466 82 -430C90 -380 88 -330 84 -300C90 -200 98 -100 104 -16Z" fill="url(#h1Saree)" />
      <path d="M-58 -40C-10 -30 50 -30 102 -40" stroke="#E8B24A" strokeWidth={8} fill="none" opacity={0.9} />
      {/* the pallu falling from the head over the back, with its border */}
      <path d="M-14 -560C-60 -540 -84 -480 -80 -400C-76 -330 -70 -260 -66 -200" stroke="#E8B24A" strokeWidth={7} fill="none" opacity={0.85} />
      {/* arm to the stick */}
      <Lit d={limb([44, -456], hand, 30, 16, -14)} fill="url(#h1Saree)" rim={0.8} />
      <Lit d={limb([hand[0] - 26, hand[1] - 22], hand, 16, 14, 0)} fill="url(#m1LitR)" rim={0.6} />
      {/* head: lit face, silver hair, pallu over the top */}
      <g transform="translate(26,-548)">
        <HeadR f={f} seed="dadi" hair="bun" bindi s={0.95} tilt={8} />
        <path d="M-48 -16C-46 -54 -14 -72 18 -64C34 -60 42 -50 44 -40C30 -48 6 -52 -14 -44C-30 -38 -42 -22 -44 0Z" fill="#E8E2D6" />
        <Lit d="M38 -46C30 -76 -6 -86 -36 -70C-62 -56 -70 -20 -66 20C-62 50 -50 70 -34 84L-56 120L-80 70C-92 20 -88 -40 -60 -72C-30 -98 24 -92 46 -56Z" fill="url(#h1Saree)" rim={0.9} />
        <path d="M46 -56C24 -92 -30 -98 -60 -72C-88 -40 -92 20 -80 70" stroke="#E8B24A" strokeWidth={6} fill="none" opacity={0.9} />
      </g>
    </g>
  );
};

/** Beat 1: a girl running right toward the sun, arms out, a dupatta streaming from her shoulders.
 *  Feet near (0,0), ~430 px tall. Needs MarketDefs (m1LitR, m1FrockR) in the same svg. */
const Runner: React.FC<{ f: number }> = ({ f }) => {
  const ph = f / 3.2;
  const s = Math.sin(ph);
  const bob = Math.abs(Math.cos(ph)) * 14;
  const wave = (i: number) => Math.sin(f / 4 - i * 0.8) * 22;
  const ribbon = Array.from({ length: 8 }).map((_, i) => [-10 - i * 50, -306 + i * 12 + wave(i)] as const);
  const hip: V = [0, -170];
  const kneeF: V = [52 + s * 22, -96];
  const footF: V = [40 + s * 36, -8];
  const kneeB: V = [-40 - s * 16, -110];
  const footB: V = [-104 - s * 16, -132];
  const sh: V = [6, -306];
  const elbF: V = [70, -360 + s * 10];
  const handF: V = [116, -432 + s * 14];
  const elbB: V = [-64, -350 - s * 10];
  const handB: V = [-118, -410 - s * 14];
  return (
    <g transform={`translate(0,${-bob})`}>
      {/* dupatta streaming from her shoulders */}
      <path
        d={`M${sh[0] + 4} ${sh[1] - 4} ${ribbon.map(([x, y]) => `L${x} ${y}`).join(" ")} ${[...ribbon].reverse().map(([x, y]) => `L${x + 6} ${y + 24}`).join(" ")} L${sh[0] + 8} ${sh[1] + 18}Z`}
        fill="#E8505A"
        opacity={0.92}
      />
      {/* back leg and arm */}
      <Lit d={limb(hip, kneeB, 30, 22, -6)} fill="url(#m1LitR)" rim={0.7} />
      <Lit d={limb(kneeB, footB, 22, 16, 4)} fill="url(#m1LitR)" rim={0.7} />
      <Lit d={limb(sh, elbB, 20, 16, 4)} fill="url(#m1LitR)" rim={0.7} />
      <Lit d={limb(elbB, handB, 16, 13, 0)} fill="url(#m1LitR)" rim={0.7} />
      {/* front leg, with a shoe */}
      <Lit d={limb([hip[0] + 8, hip[1]], kneeF, 30, 22, 6)} fill="url(#m1LitR)" rim={0.8} />
      <Lit d={limb(kneeF, footF, 22, 16, -4)} fill="url(#m1LitR)" rim={0.8} />
      <ellipse cx={footF[0] + 12} cy={footF[1] + 2} rx={24} ry={10} fill="#D0283A" />
      <ellipse cx={footB[0] - 10} cy={footB[1] + 4} rx={22} ry={9} fill="#D0283A" transform={`rotate(-30,${footB[0] - 10},${footB[1] + 4})`} />
      {/* frock, flaring as she runs */}
      <Lit d="M-30 -312C-6 -326 26 -326 42 -312C50 -270 54 -230 80 -150C40 -132 -30 -130 -66 -146C-50 -220 -40 -270 -30 -312Z" fill="url(#m1FrockR)" />
      <path d="M-62 -152C-20 -138 40 -138 76 -154" stroke="#E8B24A" strokeWidth={6} fill="none" opacity={0.85} />
      {/* front arm out and up */}
      <Lit d={limb([sh[0] + 14, sh[1]], elbF, 20, 16, -4)} fill="url(#m1LitR)" />
      <Lit d={limb(elbF, handF, 16, 13, 0)} fill="url(#m1LitR)" />
      {/* head, looking toward the sun */}
      <g transform="translate(14,-372)">
        <HeadR f={f} seed="run" hair="ponies" s={0.78} tilt={-12} />
      </g>
    </g>
  );
};

/** Beat 2: a glass of water on a sill, the sunrise through the window behind. */
const WaterGlass: React.FC<{ f: number; k: number }> = ({ f, k }) => {
  const t = f / 30;
  const glint = 0.6 + 0.4 * Math.max(0, wob("wg", t * 3));
  return (
    <g>
      {/* window frame and sill, dark against the sky */}
      <path d={`M-100 -100L1180 -100L1180 ${H + 100}L-100 ${H + 100}Z M140 260L940 260L940 1500L140 1500Z`} fill="#1E0E16" fillRule="evenodd" />
      <rect x={530} y={260} width={20} height={1240} fill="#1E0E16" />
      <rect x={140} y={860} width={800} height={18} fill="#1E0E16" />
      <rect x={60} y={1500} width={960} height={60} fill="#3A1A20" />
      <rect x={60} y={1500} width={960} height={6} fill="#FFC77A" opacity={0.7} />
      {/* the glass */}
      <g transform={`translate(${540 + k * 10},0)`}>
        <ellipse cx={0} cy={1500} rx={150} ry={20} fill="#000000" opacity={0.25} />
        {/* water */}
        <path d="M-150 1040L-130 1488C-80 1504 80 1504 130 1488L150 1040C80 1056 -80 1056 -150 1040Z" fill="url(#h1Water)" />
        <ellipse cx={0} cy={1040} rx={150} ry={20} fill="#FFF2CC" opacity={0.5} />
        {/* the sun refracted in the water */}
        <ellipse cx={-6} cy={1240} rx={64} ry={84} fill="#FFFBE8" opacity={0.22} />
        <ellipse cx={-6} cy={1240} rx={28} ry={40} fill="#FFFFFF" opacity={0.3} />
        {/* bubbles */}
        {Array.from({ length: 9 }).map((_, i) => {
          const y = 1470 - ((f * (1.5 + rnd(`bb${i}`)) + rnd(`by${i}`) * 400) % 420);
          return <circle key={i} cx={-100 + rnd(`bx${i}`) * 200} cy={y} r={3 + rnd(`br${i}`) * 4} fill="none" stroke="#FFFFFF" strokeWidth={1.5} opacity={0.55} />;
        })}
        {/* glass walls and rim */}
        <path d="M-166 900L-140 1490C-80 1510 80 1510 140 1490L166 900Z" fill="url(#h1Glass)" stroke="#FFF2D8" strokeWidth={3} opacity={0.95} />
        <ellipse cx={0} cy={900} rx={166} ry={24} fill="none" stroke="#FFF6E0" strokeWidth={4} />
        <path d="M-136 930L-116 1460" stroke="#FFFFFF" strokeWidth={14} opacity={0.35} strokeLinecap="round" />
        <path d="M128 940L112 1440" stroke="#FFFFFF" strokeWidth={6} opacity={0.3} strokeLinecap="round" />
        {/* the glint on the rim */}
        <path d={sparkle(30 + 14 * glint)} transform="translate(110,896)" fill="#FFFFFF" opacity={glint} />
      </g>
    </g>
  );
};

export const HealthBeat: React.FC<{ f: number; beat: 0 | 1 | 2; k: number }> = ({ f, beat, k }) => {
  const drift = ramp(k, 0, 1, "lin");
  if (beat === 2) {
    return (
      <g>
        <g transform={`translate(${-drift * 20},0)`}>
          <Sunrise f={f} drift={drift} sx={430} ground={false} />
        </g>
        <g transform={`translate(540,1200) scale(${1 + 0.05 * drift}) translate(-540,-1200)`}>
          <WaterGlass f={f} k={drift} />
        </g>
      </g>
    );
  }
  return (
    <g>
      <Sunrise f={f} drift={drift} sx={beat === 0 ? 640 : 520} />
      {beat === 0 ? (
        <g transform={`translate(${250 + drift * 90},1650) scale(1.45)`}>
          <Dadi f={f} />
        </g>
      ) : (
        <g transform={`translate(${340 + drift * 160},1670) scale(1.7)`}>
          <Runner f={f} />
        </g>
      )}
    </g>
  );
};
