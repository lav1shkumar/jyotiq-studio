import React from "react";
import { Figure, type FigureSpec, type Key, handOf } from "../fight/rig";
import { lerp, rnd } from "../navagraha/ep1/anim";

/*
 * Sets for the Guru Tegh Bahadur reel (24 Nov 2026). Everything is drawn in code, frame-pure.
 * Battlefield (Kartarpur, April 1635, dust-lit afternoon / sunset), silhouette armies and horses, Anandpur darbar
 * (Shivalik foothills, canopy, takht), Delhi kotwali cell (1675), Chandni Chowk at dawn under a banyan, Gurdwara Sis Ganj
 * Sahib today, the kesari chadar over the land, diya rows. Light is always motivated: sun, dust, torch, window shaft, lamp.
 */
const W = 1080;
const H = 1920;

export const GTDefs: React.FC = () => (
  <defs>
    <filter id="gtBlur4" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4" /></filter>
    <filter id="gtBlur10" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="10" /></filter>
    <filter id="gtBlur24" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="24" /></filter>
    <filter id="gtBlur50" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="50" /></filter>
    <linearGradient id="gtSkyBattle" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#5A2A14" />
      <stop offset="0.35" stopColor="#B8642A" />
      <stop offset="0.62" stopColor="#F0B060" />
      <stop offset="0.75" stopColor="#E89A50" />
    </linearGradient>
    <linearGradient id="gtSkySunset" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#2A1028" />
      <stop offset="0.3" stopColor="#7A2A2A" />
      <stop offset="0.55" stopColor="#E0602A" />
      <stop offset="0.72" stopColor="#FFB050" />
    </linearGradient>
    <linearGradient id="gtGround" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#8A5A30" />
      <stop offset="1" stopColor="#3A2210" />
    </linearGradient>
    <linearGradient id="gtSkyMorning" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#7FA8C8" />
      <stop offset="0.5" stopColor="#E8D8B0" />
      <stop offset="0.7" stopColor="#F6E2B8" />
    </linearGradient>
    <linearGradient id="gtSkyDawn" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#2A3450" />
      <stop offset="0.45" stopColor="#8A6A78" />
      <stop offset="0.7" stopColor="#F0B888" />
    </linearGradient>
    <linearGradient id="gtKesari" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#FFB04A" />
      <stop offset="0.5" stopColor="#F08A1E" />
      <stop offset="1" stopColor="#B8561A" />
    </linearGradient>
    <linearGradient id="gtShaft" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FFF0C8" stopOpacity="0.55" />
      <stop offset="1" stopColor="#FFF0C8" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="gtMarble" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FFFFFF" />
      <stop offset="1" stopColor="#E6DED0" />
    </linearGradient>
    <linearGradient id="gtGoldDome" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#FFF0B0" />
      <stop offset="0.45" stopColor="#F2C14E" />
      <stop offset="1" stopColor="#A8701E" />
    </linearGradient>
    <radialGradient id="gtVig" cx="0.5" cy="0.5" r="0.75">
      <stop offset="0.5" stopColor="#000" stopOpacity="0" />
      <stop offset="1" stopColor="#000" stopOpacity="0.85" />
    </radialGradient>
  </defs>
);

export const Vig: React.FC<{ o?: number }> = ({ o = 0.6 }) => <rect width={W} height={H} fill="url(#gtVig)" opacity={o} />;
export const Tint: React.FC<{ c: string; o: number; blend?: React.CSSProperties["mixBlendMode"] }> = ({ c, o, blend }) =>
  o > 0.001 ? <rect width={W} height={H} fill={c} opacity={o} style={blend ? { mixBlendMode: blend } : undefined} /> : null;
/** Film-like grain (cheap: two moving dotted layers). */
export const Grain: React.FC<{ f: number; o?: number }> = ({ f, o = 0.08 }) => (
  <g opacity={o}>
    {Array.from({ length: 140 }, (_, i) => (
      <circle key={i} cx={(rnd(i, 3 + (f % 7)) * W)} cy={(rnd(i, 9 + (f % 5)) * H)} r={1.2 + rnd(i, 4) * 1.6} fill={i % 2 ? "#FFF" : "#000"} />
    ))}
  </g>
);

/* ------------------------------------------------------------------ */
/* Battlefield                                                         */
/* ------------------------------------------------------------------ */

/** A triangular kesari war flag on a pole. Origin = pole foot. */
export const Nishan: React.FC<{ f: number; h?: number; s?: number; c?: string; seed?: number }> = ({ f, h = 520, s = 1, c = "#F08A1E", seed = 0 }) => {
  const w = (k: number) => Math.sin(f / 6 + seed + k) * 14;
  return (
    <g transform={`scale(${s})`}>
      <path d={`M0 0L0 ${-h}`} stroke="#3A2414" strokeWidth={7} />
      <path d={`M0 ${-h + 6}C60 ${-h + 10 + w(0)} 130 ${-h + 40 + w(1)} 200 ${-h + 70 + w(2)}C130 ${-h + 100 + w(1)} 60 ${-h + 140 + w(0)} 0 ${-h + 150}Z`} fill={c} />
      <path d={`M0 ${-h + 6}C60 ${-h + 10 + w(0)} 130 ${-h + 40 + w(1)} 200 ${-h + 70 + w(2)}`} stroke="#FFD08A" strokeWidth={3} fill="none" opacity={0.6} />
      <circle cy={-h - 8} r={9} fill="#C8902E" />
    </g>
  );
};

export const Battlefield: React.FC<{ f: number; sunset?: number; sunX?: number; sunY?: number; dust?: number }> = ({ f, sunset = 0, sunX = 720, sunY = 980, dust = 1 }) => {
  const hz = 1180;
  return (
    <g>
      <rect width={W} height={H} fill="url(#gtSkyBattle)" />
      <rect width={W} height={H} fill="url(#gtSkySunset)" opacity={sunset} />
      {/* sun and its glow */}
      <circle cx={sunX} cy={sunY} r={420} fill="#FFC070" opacity={0.45} filter="url(#gtBlur50)" />
      <circle cx={sunX} cy={sunY} r={120} fill={sunset > 0.5 ? "#FFD08A" : "#FFF0C0"} opacity={0.95} />
      <circle cx={sunX} cy={sunY} r={170} fill="#FFE0A0" opacity={0.35} filter="url(#gtBlur24)" />
      {/* far Kartarpur town wall with bastions and a gate */}
      <g opacity={0.55} fill="#6A3A22">
        <path d={`M-20 ${hz}L-20 ${hz - 70}L120 ${hz - 70}L120 ${hz - 110}L170 ${hz - 110}L170 ${hz - 70}L380 ${hz - 70}L380 ${hz - 130}C380 ${hz - 160} 460 ${hz - 160} 460 ${hz - 130}L460 ${hz - 70}L640 ${hz - 70}L640 ${hz - 100}L690 ${hz - 100}L690 ${hz - 70}L1100 ${hz - 70}L1100 ${hz}Z`} />
        <path d={`M400 ${hz}L400 ${hz - 60}C400 ${hz - 90} 440 ${hz - 90} 440 ${hz - 60}L440 ${hz}Z`} fill="#3A1E10" />
        {Array.from({ length: 22 }, (_, i) => <rect key={i} x={-10 + i * 52} y={hz - 84} width={22} height={16} />)}
      </g>
      {/* smoke columns from burning huts */}
      {[[150, 0.8], [880, 0.6]].map(([x, k], i) => (
        <g key={i} opacity={0.5 * k}>
          {Array.from({ length: 6 }, (_, j) => {
            const u = ((f * 0.6 + j * 40) % 240) / 240;
            return <circle key={j} cx={x + Math.sin(u * 4 + i) * 40 + u * 80} cy={hz - 60 - u * 700} r={60 + u * 140} fill="#4A3428" opacity={0.7 * (1 - u)} filter="url(#gtBlur24)" />;
          })}
        </g>
      ))}
      {/* ground */}
      <path d={`M0 ${hz}L${W} ${hz}L${W} ${H}L0 ${H}Z`} fill="url(#gtGround)" />
      <path d={`M0 ${hz}C300 ${hz + 20} 700 ${hz - 10} ${W} ${hz + 10}L${W} ${hz + 60}L0 ${hz + 60}Z`} fill="#C08A4A" opacity={0.5} />
      {/* ripe wheat at the field edges */}
      {Array.from({ length: 60 }, (_, i) => {
        const x = (i / 60) * W + rnd(i, 2) * 18;
        const side = i < 14 || i > 46;
        if (!side) return null;
        const sw = Math.sin(f / 15 + i) * 6;
        return <path key={i} d={`M${x} ${hz + 40}Q${x + sw} ${hz - 10} ${x + sw * 1.6} ${hz - 50}`} stroke="#D8A850" strokeWidth={4} fill="none" opacity={0.8} />;
      })}
      {/* dust haze */}
      <g opacity={0.6 * dust}>
        {Array.from({ length: 7 }, (_, i) => {
          const x = ((f * (1.4 + i * 0.3) + i * 260) % 1600) - 260;
          return <ellipse key={i} cx={x} cy={hz - 40 + (i % 3) * 60} rx={360} ry={140} fill="#E8B878" opacity={0.55} filter="url(#gtBlur50)" />;
        })}
      </g>
    </g>
  );
};

/** Foreground dust and drifting embers over a battle shot. */
export const DustFront: React.FC<{ f: number; k?: number; y?: number }> = ({ f, k = 1, y = 1500 }) => (
  <g opacity={k}>
    {Array.from({ length: 5 }, (_, i) => {
      const x = ((f * (2.5 + i * 0.6) + i * 340) % 1800) - 360;
      return <ellipse key={i} cx={x} cy={y + (i % 2) * 220} rx={420} ry={200} fill="#D8A060" opacity={0.35} filter="url(#gtBlur50)" />;
    })}
    {Array.from({ length: 26 }, (_, i) => {
      const life = 70 + rnd(i, 3) * 60;
      const t = (f + rnd(i, 4) * life) % life;
      const x = rnd(i, 5) * W + t * (1.5 + rnd(i, 6) * 2);
      const yy = 1600 - t * (4 + rnd(i, 7) * 4);
      return <circle key={`e${i}`} cx={x} cy={yy} r={2.5 + rnd(i, 8) * 3} fill="#FFC060" opacity={(1 - t / life) * 0.9} />;
    })}
  </g>
);

/** A galloping horse with its rider, in silhouette (reads at distance through dust). Origin = ground under the belly; faces +x. */
export const HorseSil: React.FC<{ f: number; s?: number; facing?: number; tone?: string; phase?: number; sword?: boolean }> = ({ f, s = 1, facing = 1, tone = "#2A1A12", phase = 0, sword = true }) => {
  const g = (f / 3.2 + phase) % (Math.PI * 2);
  const leg = (x: number, a: number, len = 120) => {
    const k1 = Math.sin(g + a) * 38;
    const k2 = Math.max(-10, Math.sin(g + a + 1.2) * 46);
    const r1 = (k1 * Math.PI) / 180;
    const kx = x + Math.sin(r1) * len * 0.55;
    const ky = -100 + Math.cos(r1) * len * 0.55;
    const r2 = ((k1 + k2) * Math.PI) / 180;
    const hx = kx + Math.sin(r2) * len * 0.5;
    const hy = ky + Math.cos(r2) * len * 0.5;
    return <path d={`M${x} -110L${kx} ${ky}L${hx} ${hy}`} stroke={tone} strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
  };
  const bob = Math.sin(g * 2) * 6;
  return (
    <g transform={`scale(${s * facing} ${s}) translate(0 ${bob})`}>
      {leg(-70, Math.PI)}
      {leg(70, 0.4)}
      {/* body, chest, rump */}
      <path d="M-110 -150C-120 -190 -60 -206 0 -204C60 -202 110 -196 130 -170C140 -140 120 -104 90 -98L-80 -96C-110 -100 -116 -124 -110 -150Z" fill={tone} />
      {/* neck and head, arched forward */}
      <path d={`M90 -190C120 -230 150 -270 170 -300C186 -308 200 -300 214 -286C222 -270 232 -256 236 -246C230 -238 218 -238 206 -246C196 -238 184 -226 176 -210C160 -180 140 -160 120 -140Z`} fill={tone} />
      <path d="M176 -304L182 -330L192 -306Z" fill={tone} />
      {/* mane and tail */}
      <path d={`M96 -196C110 -240 140 -282 168 -304C150 -270 ${130 + Math.sin(g) * 8} -236 110 -196Z`} fill={tone} />
      <path d={`M-112 -160C-150 ${-150 + Math.sin(g) * 14} -170 ${-110 + Math.sin(g + 1) * 12} -182 ${-70 + Math.sin(g + 2) * 10}C-160 -100 -140 -130 -112 -140Z`} fill={tone} />
      {leg(-90, Math.PI + 0.6)}
      {leg(90, 0)}
      {/* rider: turban, torso, sword arm */}
      <path d="M-30 -200C-36 -250 -20 -300 10 -310L30 -306C40 -270 34 -230 26 -200Z" fill={tone} />
      <circle cx={18} cy={-330} r={24} fill={tone} />
      <path d="M0 -352C10 -372 34 -372 42 -350L40 -334L0 -336Z" fill={tone} />
      {sword ? (
        <g transform={`translate(24 -290) rotate(${-60 + Math.sin(g) * 40})`}>
          <path d="M0 0L0 -60" stroke={tone} strokeWidth={10} strokeLinecap="round" />
          <path d="M0 -56C6 -110 20 -150 44 -178" stroke="#D8D0C0" strokeWidth={5} fill="none" strokeLinecap="round" />
        </g>
      ) : null}
    </g>
  );
};

/** Keyframes for a looping sword duel (attacker strikes, defender parries) from frame a, period T. */
const duelKeys = (a: number, b: number, T: number, x: number, attack: boolean, seed: number): Key[] => {
  const keys: Key[] = [{ f: a, x, hF: 18, kF: 14, hB: -24, kB: 16, lean: 4 }];
  for (let t = a; t < b; t += T) {
    const j = rnd(seed, Math.floor(t)) * 10;
    if (attack) {
      keys.push({ f: t + T * 0.35, sF: 170, eF: 30, lean: -6, x: x - 8, e: "io" });
      keys.push({ f: t + T * 0.55, sF: 70 + j, eF: 4, lean: 14, x: x + 22, e: "snap" });
      keys.push({ f: t + T, sF: 110, eF: 50, lean: 4, x, e: "io" });
    } else {
      keys.push({ f: t + T * 0.4, sF: 120, eF: 70, sB: 60, lean: -4, x: x + 6, e: "io" });
      keys.push({ f: t + T * 0.6, sF: 140, eF: 80, lean: -12, x: x + 26, e: "snap" });
      keys.push({ f: t + T, sF: 100, eF: 50, lean: 2, x, e: "io" });
    }
  }
  return keys;
};

/** A row of dueling silhouette soldiers (fight rig) with swords, behind the action. */
export const WarCrowd: React.FC<{ f: number; floor: number; scale: number; pairs: number[]; tone?: string; seed?: number; o?: number }> = ({ f, floor, scale, pairs, tone = "#2E1C12", seed = 1, o = 1 }) => (
  <g opacity={o}>
    {pairs.map((x, i) => {
      const T = 22 + (i % 3) * 5;
      const off = Math.floor(rnd(i, seed) * T);
      const mk = (id: string, facing: 1 | -1, px: number, attack: boolean): FigureSpec => ({
        id, facing, floor, scale, tone, hair: "bun", sleeves: "long", skirt: { len: 0.55, flare: 1.3 },
        keys: duelKeys(-off, 2400, T, px, attack, i + seed), idle: 0, shadow: false,
      });
      const A = mk(`wcA${seed}-${i}`, 1, x - 70 * scale, true);
      const B = mk(`wcB${seed}-${i}`, -1, x + 70 * scale, false);
      return (
        <g key={i}>
          {[A, B].map((sp) => {
            const hnd = handOf(sp, f);
            const ang = sp.facing === 1 ? -50 : 50;
            return (
              <g key={sp.id}>
                <Figure spec={sp} f={f} />
                <path d={`M${hnd.x} ${hnd.y}l${Math.sin((ang * Math.PI) / 180) * 120 * scale} ${-Math.cos((ang * Math.PI) / 180) * 120 * scale}`} stroke="#E8E0D0" strokeWidth={5 * scale + 1} strokeLinecap="round" opacity={0.85} />
              </g>
            );
          })}
        </g>
      );
    })}
  </g>
);

/** A burst of sparks and a star flash where two blades meet (frame-pure; peaks at `at`). */
export const ClashBurst: React.FC<{ f: number; at: number; x: number; y: number; s?: number }> = ({ f, at, x, y, s = 1 }) => {
  const t = f - at;
  if (t < -1 || t > 16) return null;
  const k = t < 0 ? 0.5 : Math.exp(-t / 5);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={90 * k + 20} fill="#FFF4C8" opacity={0.6 * k} filter="url(#gtBlur10)" />
      <path d={`M0 ${-120 * k}L10 -10L${120 * k} 0L10 10L0 ${120 * k}L-10 10L${-120 * k} 0L-10 -10Z`} fill="#FFFFFF" opacity={k} />
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2 + rnd(i, at) * 0.4;
        const v = 10 + rnd(i, at + 1) * 14;
        const px = Math.cos(a) * v * Math.max(0, t);
        const py = Math.sin(a) * v * Math.max(0, t) + 0.6 * Math.max(0, t) ** 2;
        return <line key={i} x1={px} y1={py} x2={px - Math.cos(a) * 18} y2={py - Math.sin(a) * 18} stroke={i % 3 ? "#FFD060" : "#FFFFFF"} strokeWidth={4} strokeLinecap="round" opacity={Math.max(0, 1 - t / 16)} />;
      })}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Anandpur darbar                                                     */
/* ------------------------------------------------------------------ */

export const Darbar: React.FC<{ f: number; light?: number }> = ({ f, light = 1 }) => (
  <g>
    <rect width={W} height={H} fill="url(#gtSkyMorning)" />
    <circle cx={880} cy={420} r={300} fill="#FFF2C8" opacity={0.6 * light} filter="url(#gtBlur50)" />
    {/* Shivalik foothills, layered */}
    <path d="M0 760C120 640 240 700 360 620C480 540 600 660 720 600C840 540 960 620 1080 560L1080 1000L0 1000Z" fill="#7E95A8" opacity={0.7} />
    <path d="M0 860C160 760 300 820 440 750C580 690 720 800 860 740C960 700 1020 730 1080 720L1080 1000L0 1000Z" fill="#5E7A6A" />
    <path d="M0 940C200 880 380 920 560 880C740 840 900 900 1080 870L1080 1040L0 1040Z" fill="#4A6450" />
    {/* haveli wall with arched openings */}
    <rect x={0} y={900} width={W} height={420} fill="#E2C89A" />
    <rect x={0} y={900} width={W} height={26} fill="#C8A26A" />
    {[90, 330, 570, 810].map((x) => (
      <g key={x}>
        <path d={`M${x} 1320L${x} 1060C${x} 990 ${x + 180} 990 ${x + 180} 1060L${x + 180} 1320Z`} fill="#8A6A44" />
        <path d={`M${x + 14} 1320L${x + 14} 1066C${x + 14} 1006 ${x + 166} 1006 ${x + 166} 1066L${x + 166} 1320Z`} fill="#5A4026" />
        <path d={`M${x} 1060C${x} 990 ${x + 180} 990 ${x + 180} 1060`} stroke="#F2DCA8" strokeWidth={6} fill="none" />
      </g>
    ))}
    {/* courtyard floor and durries */}
    <path d="M0 1320L1080 1320L1080 1920L0 1920Z" fill="#C8A878" />
    <path d="M-60 1400L1140 1400L1180 1920L-100 1920Z" fill="#8E2A26" />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-60 + i * 150} 1400L${-100 + i * 160} 1920`} stroke="#C8902E" strokeWidth={4} opacity={0.5} />)}
    <path d="M-60 1400L1140 1400" stroke="#E8C060" strokeWidth={8} />
    {/* canopy (chandoa) on carved poles */}
    <path d="M140 560L940 560L980 640L100 640Z" fill="#F4ECD8" />
    <path d="M100 640L980 640" stroke="#C8902E" strokeWidth={10} />
    {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M${110 + i * 40} 642l20 30l20 -30Z`} fill={i % 2 ? "#C8302E" : "#E8B24A"} />)}
    {[150, 930].map((x) => (
      <g key={x}>
        <rect x={x - 10} y={640} width={20} height={780} fill="#7A4A26" />
        <rect x={x - 16} y={640} width={32} height={20} fill="#C8902E" />
        <rect x={x - 16} y={1400} width={32} height={24} fill="#C8902E" />
      </g>
    ))}
    {/* brass lamps either side */}
    {[260, 820].map((x, i) => (
      <g key={x} transform={`translate(${x} 1420)`}>
        <path d="M-10 0L10 0L6 -90L-6 -90Z" fill="#C8902E" />
        <ellipse cy={-92} rx={30} ry={8} fill="#E8B24A" />
        <path d={`M-4 -96C-6 -110 -1 -118 0 ${-128 - 3 * Math.sin(f / 3 + i)}C1 -118 6 -110 4 -96Z`} fill="#FFC23A" />
        <circle cy={-110} r={34} fill="#FFB04A" opacity={0.35} filter="url(#gtBlur10)" />
      </g>
    ))}
    {/* morning beams */}
    <g opacity={0.35 * light}>
      <path d="M760 0L1080 0L640 1500L420 1500Z" fill="url(#gtShaft)" />
    </g>
  </g>
);

/** A low takht with a white sheet and a kesari rumala falling in front (hides a seated puppet's legs). Origin = front centre top. */
export const Takht: React.FC<{ w?: number }> = ({ w = 520 }) => (
  <g>
    <rect x={-w / 2} y={-20} width={w} height={40} fill="#F6F2E8" />
    <path d={`M${-w / 2} 20L${w / 2} 20L${w / 2 - 10} 170L${-w / 2 + 10} 170Z`} fill="url(#gtKesari)" />
    <path d={`M${-w / 2 + 10} 150L${w / 2 - 10} 150`} stroke="#F6D070" strokeWidth={8} />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-w / 2 + 30 + i * ((w - 60) / 11)} 160l8 22l8 -22`} fill="#F6D070" />)}
    <rect x={-w / 2 - 10} y={170} width={w + 20} height={30} fill="#6A3A1C" />
  </g>
);

/* ------------------------------------------------------------------ */
/* Delhi kotwali cell                                                  */
/* ------------------------------------------------------------------ */

export const Cell: React.FC<{ f: number; shaft?: number; torch?: number; bars?: number }> = ({ f, shaft = 1, torch = 1, bars = 1 }) => {
  const fl = 0.85 + 0.15 * Math.sin(f / 2.3) + 0.08 * Math.sin(f / 1.1);
  return (
    <g>
      <rect width={W} height={H} fill="#1C1612" />
      {/* stone blocks */}
      {Array.from({ length: 16 }, (_, r) =>
        Array.from({ length: 6 }, (_, c) => (
          <rect key={`${r}-${c}`} x={c * 200 - (r % 2) * 100} y={r * 100} width={196} height={96} rx={6} fill={["#2E261E", "#342A22", "#2A221C"][(r + c) % 3]} />
        )),
      )}
      {/* high window and its shaft */}
      <rect x={640} y={240} width={160} height={110} fill="#C8D8E8" />
      {[670, 720, 770].map((x) => <rect key={x} x={x - 4} y={240} width={8} height={110} fill="#1C1612" />)}
      <path d="M640 350L800 350L560 1900L120 1900Z" fill="url(#gtShaft)" opacity={0.75 * shaft} />
      {Array.from({ length: 24 }, (_, i) => {
        const u = ((f * 0.5 + i * 37) % 300) / 300;
        return <circle key={i} cx={lerp(720, 380, u) + Math.sin(f / 20 + i) * 60} cy={350 + u * 1400} r={2 + rnd(i, 2) * 2} fill="#FFF0C8" opacity={0.5 * shaft * Math.sin(u * Math.PI)} />;
      })}
      {/* wall torch */}
      <g transform="translate(150 820)" opacity={torch}>
        <circle r={260} fill="#FF9A3A" opacity={0.28 * fl} filter="url(#gtBlur50)" />
        <path d="M-8 0L8 0L12 90L-12 90Z" fill="#3A2414" />
        <path d={`M-22 0C-30 -40 -12 -70 0 ${-100 - 10 * fl}C12 -70 30 -40 22 0Z`} fill="#FF8A2A" />
        <path d={`M-10 0C-14 -26 -4 -48 0 ${-66 - 6 * fl}C4 -48 14 -26 10 0Z`} fill="#FFE08A" />
      </g>
      {/* floor with straw */}
      <path d="M0 1560L1080 1520L1080 1920L0 1920Z" fill="#241C16" />
      {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${rnd(i, 4) * W} ${1600 + rnd(i, 5) * 280}l${30 + rnd(i, 6) * 30} ${-6 + rnd(i, 7) * 12}`} stroke="#8A6A3A" strokeWidth={3} opacity={0.5} />)}
      {bars > 0 ? null : null}
    </g>
  );
};

/** Iron bars in the foreground (drawn over the puppets). */
export const Bars: React.FC<{ x0?: number; x1?: number; o?: number }> = ({ x0 = -40, x1 = 1120, o = 1 }) => (
  <g opacity={o}>
    {Array.from({ length: Math.ceil((x1 - x0) / 150) }, (_, i) => (
      <g key={i}>
        <rect x={x0 + i * 150} y={0} width={26} height={H} fill="#141010" />
        <rect x={x0 + i * 150 + 4} y={0} width={6} height={H} fill="#5A5048" opacity={0.6} />
      </g>
    ))}
    <rect x={0} y={260} width={W} height={30} fill="#141010" />
    <rect x={0} y={1460} width={W} height={30} fill="#141010" />
  </g>
);

/* ------------------------------------------------------------------ */
/* Chandni Chowk at dawn                                               */
/* ------------------------------------------------------------------ */

export const Chowk: React.FC<{ f: number; dawn?: number; bloom?: number }> = ({ f, dawn = 1, bloom = 0 }) => (
  <g>
    <rect width={W} height={H} fill="url(#gtSkyDawn)" />
    <circle cx={540} cy={1000} r={500} fill="#FFD8A0" opacity={0.4 * dawn + 0.6 * bloom} filter="url(#gtBlur50)" />
    {/* Mughal-era arcades */}
    {[[-40, 860, 380], [700, 820, 420]].map(([x, y, w], i) => (
      <g key={i} fill="#5A3A3A" opacity={0.85}>
        <rect x={x} y={y} width={w} height={600} />
        {Array.from({ length: 3 }, (_, j) => (
          <path key={j} d={`M${x + 30 + j * (w / 3)} ${y + 600}L${x + 30 + j * (w / 3)} ${y + 260}C${x + 30 + j * (w / 3)} ${y + 180} ${x + j * (w / 3) + w / 3 - 10} ${y + 180} ${x + j * (w / 3) + w / 3 - 10} ${y + 260}L${x + j * (w / 3) + w / 3 - 10} ${y + 600}Z`} fill="#2A1A1E" />
        ))}
        <rect x={x} y={y - 30} width={w} height={30} fill="#6A4848" />
        {[0.2, 0.8].map((k) => <path key={k} d={`M${x + w * k - 40} ${y - 30}C${x + w * k - 40} ${y - 100} ${x + w * k + 40} ${y - 100} ${x + w * k + 40} ${y - 30}Z`} fill="#6A4848" />)}
      </g>
    ))}
    {/* banyan tree: trunk, aerial roots and canopy */}
    <g>
      <path d="M440 1500C450 1300 460 1100 430 960L560 960C540 1100 560 1300 580 1500Z" fill="#3A2A1E" />
      {Array.from({ length: 14 }, (_, i) => {
        const x = 220 + i * 50 + rnd(i, 2) * 20;
        const sw = Math.sin(f / 30 + i) * 3;
        return <path key={i} d={`M${x} ${760 + rnd(i, 3) * 80}C${x + sw} 1000 ${x - sw} 1200 ${x + 4} ${1300 + rnd(i, 4) * 200}`} stroke="#4A3626" strokeWidth={4 + rnd(i, 5) * 4} fill="none" opacity={0.85} />;
      })}
      {[[500, 700, 420], [300, 780, 260], [720, 760, 280], [520, 560, 300]].map(([x, y, r], i) => (
        <ellipse key={i} cx={x + Math.sin(f / 40 + i) * 4} cy={y} rx={r} ry={r * 0.6} fill={["#2E4A30", "#26402A", "#2A4630", "#345A38"][i]} />
      ))}
    </g>
    {/* street floor */}
    <path d="M0 1480L1080 1480L1080 1920L0 1920Z" fill="#6A5048" />
    <path d="M0 1480L1080 1480" stroke="#8A6A58" strokeWidth={8} />
    {/* bloom of light */}
    {bloom > 0.01 ? <rect width={W} height={H} fill="#FFF6E0" opacity={bloom} /> : null}
  </g>
);

/** Rows of silent onlookers in silhouette (heads and shoulders, turbans and shawls). */
export const Crowd: React.FC<{ f: number; y: number; n?: number; s?: number; tone?: string; seed?: number; bow?: number }> = ({ f, y, n = 14, s = 1, tone = "#2A1C1A", seed = 3, bow = 0 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const x = -40 + (i / (n - 1)) * 1160 + (rnd(i, seed) - 0.5) * 40;
      const h = 1 + (rnd(i, seed + 1) - 0.5) * 0.15;
      const b = bow * (0.6 + 0.4 * rnd(i, seed + 2)) * 30;
      const turban = rnd(i, seed + 3) > 0.45;
      return (
        <g key={i} transform={`translate(${x} ${y + Math.sin(f / 30 + i) * 1.5}) scale(${s * h})`}>
          <path d="M-70 200C-70 90 -40 40 0 40C40 40 70 90 70 200Z" fill={tone} />
          <g transform={`translate(0 ${b}) rotate(${b * 0.4})`}>
            <circle cy={0} r={34} fill={tone} />
            {turban ? <path d="M-36 -6C-40 -50 40 -56 38 -6Z" fill={tone} /> : <path d="M-40 10C-44 -40 44 -44 40 10L46 60L-46 60Z" fill={tone} />}
          </g>
        </g>
      );
    })}
  </g>
);

/* ------------------------------------------------------------------ */
/* Gurdwara Sis Ganj Sahib, the chadar, diyas                          */
/* ------------------------------------------------------------------ */

export const Gurdwara: React.FC<{ f: number; glow?: number }> = ({ f, glow = 1 }) => (
  <g>
    <rect width={W} height={H} fill="url(#gtSkyMorning)" />
    <circle cx={540} cy={560} r={520} fill="#FFF0C8" opacity={0.5 * glow} filter="url(#gtBlur50)" />
    {/* main hall */}
    <g transform="translate(540 1300)">
      <rect x={-420} y={-300} width={840} height={420} fill="url(#gtMarble)" />
      <rect x={-440} y={-330} width={880} height={36} fill="#F6F2EA" />
      {Array.from({ length: 5 }, (_, i) => {
        const x = -360 + i * 180;
        return (
          <g key={i}>
            <path d={`M${x - 60} 120L${x - 60} -140C${x - 60} -230 ${x + 60} -230 ${x + 60} -140L${x + 60} 120Z`} fill="#D8CDBA" />
            <path d={`M${x - 46} 120L${x - 46} -130C${x - 46} -206 ${x + 46} -206 ${x + 46} -130L${x + 46} 120Z`} fill={i === 2 ? "#8A5A2A" : "#B8A890"} />
          </g>
        );
      })}
      {/* central golden dome with a finial */}
      <path d="M-170 -330C-190 -480 -60 -600 0 -640C60 -600 190 -480 170 -330Z" fill="url(#gtGoldDome)" />
      <path d="M-120 -420C-60 -460 60 -460 120 -420" stroke="#FFF6D0" strokeWidth={6} fill="none" opacity={0.6} />
      <path d="M0 -640L0 -720" stroke="#E8B24A" strokeWidth={10} />
      <circle cy={-728} r={14} fill="#F6D070" />
      {/* chhatris */}
      {[-360, 360].map((x) => (
        <g key={x} transform={`translate(${x} -330)`}>
          {[-30, 30].map((px) => <rect key={px} x={px - 6} y={-120} width={12} height={120} fill="#F4EEE2" />)}
          <rect x={-50} y={-130} width={100} height={14} fill="#F4EEE2" />
          <path d="M-56 -130C-56 -200 56 -200 56 -130Z" fill="url(#gtGoldDome)" />
          <path d="M0 -196L0 -230" stroke="#E8B24A" strokeWidth={6} />
        </g>
      ))}
      <rect x={-460} y={120} width={920} height={40} fill="#E6DED0" />
    </g>
    {/* Nishan Sahib */}
    <g transform="translate(900 1420)">
      <Nishan f={f} h={900} s={1} />
    </g>
    <path d="M0 1460L1080 1460L1080 1920L0 1920Z" fill="#EDE6DA" />
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M0 ${1500 + i * 44}L1080 ${1500 + i * 44}`} stroke="#D8CEC0" strokeWidth={2} />)}
  </g>
);

/** The kesari chadar spreading over the land (k 0..1 = how far it has spread). */
export const Chadar: React.FC<{ f: number; k: number }> = ({ f, k }) => {
  const wv = (x: number, t: number) => Math.sin(x / 140 + t) * 40 + Math.sin(x / 70 + t * 1.6) * 14;
  const t = f / 14;
  const top = lerp(1500, 380, k);
  const pts = Array.from({ length: 13 }, (_, i) => i * 90);
  const upper = pts.map((x) => `${x - 30} ${top + wv(x, t)}`).join(" L");
  const lower = pts.slice().reverse().map((x) => `${x - 30} ${top + 460 + wv(x, t + 0.8) * 1.4}`).join(" L");
  return (
    <g>
      {/* the land below: hills, villages, temples, a river */}
      <rect width={W} height={H} fill="#3A2A3A" />
      <circle cx={540} cy={400} r={560} fill="#FFB060" opacity={0.5} filter="url(#gtBlur50)" />
      <path d="M0 1180C200 1100 360 1150 540 1090C720 1030 900 1110 1080 1060L1080 1920L0 1920Z" fill="#4A3A40" />
      <path d="M0 1320C240 1260 440 1300 640 1250C820 1210 960 1260 1080 1240L1080 1920L0 1920Z" fill="#3A3036" />
      <path d="M-20 1700C200 1600 400 1660 560 1560C700 1480 900 1540 1100 1460" stroke="#7A8AA8" strokeWidth={26} fill="none" opacity={0.6} />
      {[[160, 1300], [420, 1250], [700, 1230], [930, 1270]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`} fill="#2A2228">
          <rect x={-40} y={-60} width={80} height={60} />
          {i % 2 ? <path d="M-30 -60C-30 -110 30 -110 30 -60Z" /> : <path d="M-34 -60L0 -130L34 -60Z" />}
          <rect x={-90} y={-30} width={40} height={30} />
          <rect x={56} y={-36} width={44} height={36} />
        </g>
      ))}
      {/* the cloth */}
      <g opacity={Math.min(1, k * 3)}>
        <path d={`M${upper} L${lower} Z`} fill="url(#gtKesari)" opacity={0.92} />
        <path d={`M${upper}`} stroke="#FFE08A" strokeWidth={10} fill="none" />
        <path d={`M${pts.map((x) => `${x - 30} ${top + 460 + wv(x, t + 0.8) * 1.4}`).join(" L")}`} stroke="#E8B24A" strokeWidth={14} fill="none" />
        {[0.3, 0.55, 0.8].map((y, i) => (
          <path key={i} d={`M${pts.map((x) => `${x - 30} ${top + 460 * y + wv(x, t + 0.3 * i) * (1 + y * 0.4)}`).join(" L")}`} stroke="#C86A1A" strokeWidth={6} fill="none" opacity={0.45} />
        ))}
        <rect width={W} height={H} fill="#FFB050" opacity={0.15 * k} />
      </g>
    </g>
  );
};

/** A row of clay diyas with flickering flames along y, x from a to b. */
export const Diyas: React.FC<{ f: number; y: number; a?: number; b?: number; n?: number; s?: number; lit?: number }> = ({ f, y, a = 60, b = 1020, n = 9, s = 1, lit = 1 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const x = lerp(a, b, n === 1 ? 0.5 : i / (n - 1));
      const on = Math.max(0, Math.min(1, lit * n - i));
      const fl = 1 + 0.1 * Math.sin(f / 2.2 + i * 1.7);
      return (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          {on > 0 ? <circle cy={-34} r={70} fill="#FFB04A" opacity={0.35 * on} filter="url(#gtBlur24)" /> : null}
          <path d="M-34 0C-30 22 30 22 34 0Z" fill="#A0522A" />
          <path d="M-34 0C-20 -8 20 -8 34 0" stroke="#C8703A" strokeWidth={4} fill="none" />
          {on > 0 ? (
            <g transform={`scale(${on})`}>
              <path d={`M-8 -4C-12 -26 -3 -40 0 ${-58 * fl}C3 -40 12 -26 8 -4Z`} fill="#FF9A2A" />
              <path d={`M-4 -6C-6 -20 -1 -30 0 ${-40 * fl}C1 -30 6 -20 4 -6Z`} fill="#FFF0A0" />
            </g>
          ) : null}
        </g>
      );
    })}
  </g>
);
