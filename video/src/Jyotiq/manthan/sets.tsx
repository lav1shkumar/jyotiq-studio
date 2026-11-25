import React from "react";
import { mix, P, rnd, wob, W, H } from "./style";

/* Backgrounds for Episode 1. Every set draws the full 1080x1920 frame and is
   built from parallax layers; the scene passes a camera {x, y, z}. Layers
   with depth 0 are fixed (sky), depth 1 move with the camera fully. */

export type Cam = { x: number; y: number; z: number };
export const CAM0: Cam = { x: 0, y: 0, z: 1 };

export const Layer: React.FC<{ cam: Cam; depth: number; children: React.ReactNode }> = ({ cam, depth, children }) => {
  const z = 1 + (cam.z - 1) * depth;
  return <g transform={`translate(${W / 2} ${H / 2}) scale(${z}) translate(${-W / 2 - cam.x * depth} ${-H / 2 - cam.y * depth})`}>{children}</g>;
};

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

export const Flame: React.FC<{ x: number; y: number; s: number; f: number; seed: string; hot?: boolean }> = ({ x, y, s, f, seed, hot }) => {
  const a = wob(`${seed}a`, f / 4) * 6;
  const b = wob(`${seed}b`, f / 3) * 5;
  const h = 1 + wob(`${seed}h`, f / 5) * 0.15;
  return (
    <g transform={`translate(${x} ${y}) scale(${s} ${s * h})`}>
      <path d={`M-22 0C-30 -24 ${-12 + a} -44 ${-4 + a} -72C${8 + b} -50 26 -30 22 0C14 10 -14 10 -22 0Z`} fill={hot ? "#FF5A1F" : "#FF7A22"} />
      <path d={`M-12 0C-16 -16 ${-6 + a * 0.6} -30 ${-1 + a * 0.6} -48C${6 + b * 0.6} -32 15 -18 12 0C7 6 -7 6 -12 0Z`} fill="#FFC23D" />
      <path d={`M-5 0C-7 -8 -2 -16 0 -24C3 -15 6 -8 5 0Z`} fill="#FFF3C4" />
    </g>
  );
};

export const Stars: React.FC<{ f: number; n: number; y1: number; seed: string; o?: number }> = ({ f, n, y1, seed, o = 1 }) => (
  <g>
    {new Array(n).fill(0).map((_, i) => {
      const x = rnd(`${seed}x${i}`) * W;
      const y = rnd(`${seed}y${i}`) * y1;
      const r = 0.8 + rnd(`${seed}r${i}`) * 2.2;
      const tw = 0.45 + 0.55 * Math.abs(Math.sin(f / (18 + i % 7) + i));
      return <circle key={i} cx={x} cy={y} r={r} fill="#FFF6E0" opacity={tw * o} />;
    })}
  </g>
);

/** Drifting light motes / embers. dir -1 rises, +1 falls. */
export const Motes: React.FC<{ f: number; n: number; seed: string; color: string; dir?: number; speed?: number; size?: number; o?: number }> = ({
  f,
  n,
  seed,
  color,
  dir = -1,
  speed = 1,
  size = 3,
  o = 1,
}) => (
  <g>
    {new Array(n).fill(0).map((_, i) => {
      const sp = (0.6 + rnd(`${seed}s${i}`)) * speed * 2.2;
      const y0 = rnd(`${seed}y${i}`) * (H + 200);
      const y = (((y0 + dir * f * sp) % (H + 200)) + H + 200) % (H + 200) - 100;
      const x = rnd(`${seed}x${i}`) * W + wob(`${seed}w${i}`, f / 40) * 40;
      const r = size * (0.5 + rnd(`${seed}r${i}`));
      const fl = 0.5 + 0.5 * Math.sin(f / 6 + i);
      return <circle key={i} cx={x} cy={y} r={r} fill={color} opacity={(0.35 + 0.65 * fl) * o} />;
    })}
  </g>
);

const Cloud: React.FC<{ x: number; y: number; s: number; c: string; shade: string }> = ({ x, y, s, c, shade }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-220 40C-250 40 -260 0 -230 -14C-238 -60 -170 -80 -140 -50C-120 -110 -30 -120 -4 -60C20 -100 100 -96 110 -40C150 -64 220 -40 210 10C250 14 250 40 220 40Z" fill={c} />
    <path d="M-230 40C-120 22 80 22 220 40Z" fill={shade} opacity={0.6} />
  </g>
);

/* ------------------------------------------------------------------ */
/* Amrit kalash (also used as a prop)                                  */
/* ------------------------------------------------------------------ */

export const Kalash: React.FC<{ f: number; glow?: number; s?: number }> = ({ f, glow = 1, s = 1 }) => {
  const pulse = 0.85 + 0.15 * Math.sin(f / 10);
  return (
    <g transform={`scale(${s})`}>
      <circle cx={0} cy={-90} r={230} fill="url(#mAmritGlow)" opacity={glow * pulse} />
      <ellipse cx={0} cy={6} rx={120} ry={18} fill="#000" opacity={0.25} />
      <path d="M-86 -60C-104 -10 -76 4 0 6C76 4 104 -10 86 -60C78 -110 44 -130 0 -130C-44 -130 -78 -110 -86 -60Z" fill="url(#mGold)" />
      <path d="M-86 -60C-104 -10 -76 4 0 6C-50 -10 -64 -60 -40 -126C-64 -118 -80 -96 -86 -60Z" fill={P.goldDark} opacity={0.5} />
      <path d="M-80 -70C-30 -56 30 -56 80 -70" stroke={P.goldDeep} strokeWidth={4} fill="none" />
      <path d="M-74 -44C-26 -30 26 -30 74 -44" stroke="#FFF0BF" strokeWidth={2.5} fill="none" opacity={0.7} />
      {[-40, 0, 40].map((x) => (
        <circle key={x} cx={x} cy={-58 + Math.abs(x) * 0.1} r={6} fill={x ? "#2E7BFF" : "#D9283A"} />
      ))}
      <path d="M-36 -128L-30 -158L30 -158L36 -128Z" fill="url(#mGoldDark)" />
      <ellipse cx={0} cy={-160} rx={52} ry={12} fill="url(#mGold)" />
      {/* the nectar glowing at the mouth */}
      <ellipse cx={0} cy={-162} rx={40} ry={8} fill="#FFF7D6" opacity={0.9 * pulse} />
      <path d="M-26 -166C-20 -200 -8 -214 0 -236C8 -214 20 -200 26 -166Z" fill="#FFF3C4" opacity={0.55 * glow * pulse} />
    </g>
  );
};

export const SetDefs: React.FC = () => (
  <defs>
    <radialGradient id="mAmritGlow">
      <stop offset="0" stopColor="#FFF4C8" stopOpacity={0.95} />
      <stop offset="0.35" stopColor="#FFC94D" stopOpacity={0.45} />
      <stop offset="1" stopColor="#FF8A2A" stopOpacity={0} />
    </radialGradient>
    <linearGradient id="mShaft" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FFF4D0" stopOpacity={0.5} />
      <stop offset="1" stopColor="#FFC94D" stopOpacity={0} />
    </linearGradient>
    <radialGradient id="mVignette" cx="0.5" cy="0.48" r="0.75">
      <stop offset="0.55" stopColor="#000" stopOpacity={0} />
      <stop offset="1" stopColor="#000" stopOpacity={0.55} />
    </radialGradient>
    <radialGradient id="mTorch">
      <stop offset="0" stopColor="#FFD27A" stopOpacity={0.7} />
      <stop offset="1" stopColor="#FF8A2A" stopOpacity={0} />
    </radialGradient>
  </defs>
);

/* ------------------------------------------------------------------ */
/* (a) Amrit hall - the hook                                           */
/* ------------------------------------------------------------------ */

export const AmritHall: React.FC<{ f: number; cam: Cam; kalash?: boolean }> = ({ f, cam, kalash = true }) => (
  <g>
    <rect width={W} height={H} fill="url(#mHallSky)" />
    <defs>
      <linearGradient id="mHallSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0B0820" />
        <stop offset="0.55" stopColor="#2A1240" />
        <stop offset="1" stopColor="#3A1A2E" />
      </linearGradient>
    </defs>
    <Layer cam={cam} depth={0.1}>
      <Stars f={f} n={70} y1={900} seed="hall" />
    </Layer>
    <Layer cam={cam} depth={0.35}>
      {[-1, 1].map((sd) =>
        [0, 1, 2].map((k) => {
          const x = 540 + sd * (200 + k * 150);
          const h = 900 + k * 120;
          return (
            <g key={`${sd}${k}`}>
              <rect x={x - 26 - k * 6} y={1180 - h} width={52 + k * 12} height={h} fill={mix("#1A1030", "#0E0820", k / 2)} />
              <rect x={x - 34 - k * 6} y={1180 - h} width={68 + k * 12} height={18} fill={P.goldDark} opacity={0.45} />
              <rect x={x - 26 - k * 6} y={1180 - h} width={8} height={h} fill="#FFC94D" opacity={sd < 0 ? 0.12 : 0.04} />
            </g>
          );
        }),
      )}
      <path d="M0 1180H1080V1920H0Z" fill="#1A0C1E" />
      <ellipse cx={540} cy={1200} rx={420} ry={60} fill="#FFC94D" opacity={0.12} />
    </Layer>
    {/* light shaft */}
    <Layer cam={cam} depth={0.5}>
      <path d="M470 -40L610 -40L760 1180L320 1180Z" fill="url(#mShaft)" opacity={0.8 + 0.2 * Math.sin(f / 30)} />
    </Layer>
    {/* rows of seated devas (silhouettes, rim-lit by the kalash) */}
    <Layer cam={cam} depth={0.6}>
      {[-1, 1].map((sd) =>
        new Array(5).fill(0).map((_, i) => {
          const k = i / 4;
          const x = 540 + sd * (150 + i * 95);
          const y = 1190 + k * 230;
          const s = 0.55 + k * 0.55;
          return (
            <g key={`${sd}${i}`} transform={`translate(${x} ${y}) scale(${s})`}>
              <ellipse cx={0} cy={0} rx={70} ry={58} fill="#120A22" />
              <circle cx={0} cy={-84} r={34} fill="#120A22" />
              <path d="M-22 -112L22 -112L12 -160L0 -176L-12 -160Z" fill="#120A22" />
              <path d={sd < 0 ? "M34 -96C40 -80 36 -64 30 -56M60 -30C70 -8 68 14 60 30" : "M-34 -96C-40 -80 -36 -64 -30 -56M-60 -30C-70 -8 -68 14 -60 30"} stroke="#FFC94D" strokeWidth={4} fill="none" opacity={0.65} />
            </g>
          );
        }),
      )}
    </Layer>
    <Layer cam={cam} depth={0.75}>
      {kalash ? (
        <g transform="translate(540 1170)">
          <Kalash f={f} />
        </g>
      ) : null}
      <Motes f={f} n={36} seed="hallm" color="#FFE7A0" dir={-1} speed={0.4} size={3.2} />
    </Layer>
  </g>
);

/* ------------------------------------------------------------------ */
/* (b, c) Swarga / Amaravati - day, storm, burning                     */
/* ------------------------------------------------------------------ */

const Spire: React.FC<{ x: number; base: number; h: number; w: number; c: string; shade: string; gold: string }> = ({ x, base, h, w, c, shade, gold }) => (
  <g>
    <path d={`M${x - w} ${base}C${x - w} ${base - h * 0.6} ${x - w * 0.4} ${base - h * 0.9} ${x} ${base - h}C${x + w * 0.4} ${base - h * 0.9} ${x + w} ${base - h * 0.6} ${x + w} ${base}Z`} fill={c} />
    <path d={`M${x - w} ${base}C${x - w} ${base - h * 0.6} ${x - w * 0.4} ${base - h * 0.9} ${x} ${base - h}L${x} ${base}Z`} fill={shade} opacity={0.5} />
    {[0.25, 0.45, 0.65].map((u) => (
      <path key={u} d={`M${x - w * (1 - u * 0.5)} ${base - h * u}Q${x} ${base - h * u + 8} ${x + w * (1 - u * 0.5)} ${base - h * u}`} stroke={gold} strokeWidth={3} fill="none" opacity={0.7} />
    ))}
    <circle cx={x} cy={base - h - 8} r={w * 0.18} fill={gold} />
    <path d={`M${x} ${base - h - 14}L${x} ${base - h - 50}`} stroke={gold} strokeWidth={3} />
    <path d={`M${x} ${base - h - 50}L${x + 26} ${base - h - 42}L${x} ${base - h - 34}Z`} fill={P.saffron} />
  </g>
);

export const Swarga: React.FC<{ f: number; cam: Cam; storm?: number; burn?: number; flash?: number; army?: number; uid?: string }> = ({
  f,
  cam,
  uid = "",
  storm = 0,
  burn = 0,
  flash = 0,
  army = 0,
}) => {
  const top = mix(mix("#4F86D9", "#23263E", storm), "#2A0606", burn);
  const mid = mix(mix("#A9C6EC", "#4A4660", storm), "#8E1E10", burn);
  const low = mix(mix("#F7DDA4", "#7A6A72", storm), "#FF7A2A", burn);
  const stone = mix(mix("#F3E2BE", "#8E8A96", storm), "#2A1012", burn);
  const stoneShade = mix(mix("#D4B888", "#615D6E", storm), "#160608", burn);
  const gold = mix(mix(P.gold, "#9C8A62", storm), "#5A2A10", burn);
  const cloud = mix(mix("#FFFFFF", "#6E6A80", storm), "#3A1414", burn);
  const cloudShade = mix(mix("#E3E9F6", "#4A4660", storm), "#200808", burn);
  return (
    <g>
      <defs>
        <linearGradient id={`mSwSky${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="0.5" stopColor={mid} />
          <stop offset="0.85" stopColor={low} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#mSwSky${uid})`} />
      {flash > 0 ? <rect width={W} height={H} fill="#E8F0FF" opacity={flash * 0.55} /> : null}
      <Layer cam={cam} depth={0.12}>
        <circle cx={820} cy={430} r={110} fill="#FFF3C8" opacity={(1 - storm) * (1 - burn) * 0.9} />
        <circle cx={820} cy={430} r={190} fill="#FFF3C8" opacity={(1 - storm) * (1 - burn) * 0.25} />
        <Cloud x={200} y={520 + wob("c1", f / 200) * 10} s={1.1} c={cloud} shade={cloudShade} />
        <Cloud x={900} y={640 + wob("c2", f / 220) * 10} s={0.9} c={cloud} shade={cloudShade} />
        {storm > 0.05 ? (
          <g opacity={storm * (1 - burn * 0.6)}>
            {[0, 1, 2, 3].map((i) => (
              <Cloud key={i} x={((i * 330 + f * (1.2 + i * 0.3)) % 1500) - 200} y={260 + i * 90} s={1.6 - i * 0.15} c="#2E2C40" shade="#1A1828" />
            ))}
          </g>
        ) : null}
      </Layer>
      {/* Amaravati skyline */}
      <Layer cam={cam} depth={0.4}>
        <Spire x={540} base={1180} h={560} w={120} c={stone} shade={stoneShade} gold={gold} />
        <Spire x={300} base={1200} h={380} w={84} c={stone} shade={stoneShade} gold={gold} />
        <Spire x={790} base={1200} h={400} w={88} c={stone} shade={stoneShade} gold={gold} />
        <Spire x={120} base={1230} h={260} w={62} c={stone} shade={stoneShade} gold={gold} />
        <Spire x={970} base={1230} h={280} w={66} c={stone} shade={stoneShade} gold={gold} />
        <path d="M40 1240L1040 1240L1040 1150Q540 1120 40 1150Z" fill={stoneShade} />
        {new Array(13).fill(0).map((_, i) => (
          <path key={i} d={`M${80 + i * 72} 1240V1170Q${116 + i * 72} 1140 ${152 + i * 72} 1170V1240`} fill={mix(stone, "#000000", 0.12)} stroke={gold} strokeWidth={2} />
        ))}
        {burn > 0.05 ? (
          <g opacity={Math.min(1, burn * 1.4)}>
            {[
              [540, 640, 2.4],
              [300, 830, 1.8],
              [790, 810, 1.9],
              [120, 980, 1.3],
              [970, 960, 1.4],
              [420, 1150, 1.6],
              [680, 1150, 1.7],
            ].map(([x, y, s], i) => (
              <Flame key={i} x={x} y={y} s={s * burn} f={f} seed={`fl${i}`} hot />
            ))}
            {[200, 540, 860].map((x, i) => (
              <g key={x} opacity={0.75}>
                {new Array(5).fill(0).map((_, k) => {
                  const ph = ((f * 1.5 + k * 60 + i * 40) % 300) / 300;
                  return <circle key={k} cx={x + wob(`sm${i}${k}`, f / 50) * 60 + ph * 80} cy={1000 - ph * 900} r={70 + ph * 140} fill="#1A0E10" opacity={(1 - ph) * 0.55 * burn} />;
                })}
              </g>
            ))}
          </g>
        ) : null}
      </Layer>
      {/* Parijata tree */}
      <Layer cam={cam} depth={0.6}>
        <path d="M120 1460C130 1360 110 1260 150 1180C170 1250 176 1360 168 1460Z" fill={mix("#5A3A24", "#1A0A08", burn)} />
        {new Array(9).fill(0).map((_, i) => (
          <circle key={i} cx={60 + (i % 3) * 70 + wob(`pt${i}`, f / 80) * 4} cy={1080 + Math.floor(i / 3) * 60} r={64} fill={mix(mix("#3F8C41", "#2E4A36", storm), "#2A0E08", burn)} />
        ))}
        {new Array(26).fill(0).map((_, i) => (
          <circle key={i} cx={30 + rnd(`pf${i}`) * 230} cy={1040 + rnd(`pg${i}`) * 200} r={6} fill={mix("#FFFFFF", "#FF6A2A", burn)} opacity={1 - storm * 0.5} />
        ))}
        {[880, 1000].map((x, i) => (
          <g key={x}>
            <path d={`M${x} 1480V1060`} stroke={gold} strokeWidth={6} />
            <path d={`M${x} 1070C${x + 60 + wob(`bn${i}`, f / 12) * 14} 1080 ${x + 90} 1110 ${x + 110 + wob(`bm${i}`, f / 10) * 12} 1140C${x + 70} 1150 ${x + 40} 1160 ${x} 1170Z`} fill={mix(P.saffron, "#3A0A08", burn)} />
          </g>
        ))}
      </Layer>
      {/* asura army on the ridge */}
      {army > 0.01 ? (
        <Layer cam={cam} depth={0.7}>
          <g opacity={army} transform={`translate(0 ${(1 - army) * 120})`}>
            <path d="M-20 1420C200 1360 400 1390 560 1370C760 1350 900 1380 1100 1350L1100 1520L-20 1520Z" fill="#14070A" />
            {new Array(22).fill(0).map((_, i) => {
              const x = 10 + i * 50 + rnd(`ar${i}`) * 20;
              const y = 1400 - Math.sin(i * 0.7) * 20;
              const h = 60 + rnd(`ah${i}`) * 30;
              return (
                <g key={i}>
                  <path d={`M${x - 16} ${y}L${x - 12} ${y - h}L${x + 12} ${y - h}L${x + 16} ${y}Z`} fill="#14070A" />
                  <circle cx={x} cy={y - h - 14} r={13} fill="#14070A" />
                  <path d={`M${x + 18} ${y + 10}L${x + 26} ${y - h - 70}`} stroke="#14070A" strokeWidth={4} />
                  <path d={`M${x + 22} ${y - h - 88}L${x + 30} ${y - h - 66}L${x + 18} ${y - h - 68}Z`} fill="#FF8A3A" opacity={0.8} />
                </g>
              );
            })}
            {[160, 520, 880].map((x, i) => (
              <g key={x}>
                <path d={`M${x} 1380V1170`} stroke="#14070A" strokeWidth={6} />
                <path d={`M${x} 1176C${x + 50 + wob(`ab${i}`, f / 9) * 12} 1182 ${x + 80} 1204 ${x + 96} 1228L${x} 1240Z`} fill="#6A0E14" />
                <path d={`M${x + 40} 1206a10 10 0 1 0 6 -14a8 8 0 1 1 -6 14Z`} fill="#FFC23D" opacity={0.8} />
              </g>
            ))}
          </g>
        </Layer>
      ) : null}
      {/* cloud floor where characters stand */}
      <Layer cam={cam} depth={0.9}>
        <path d="M-60 1500C140 1450 340 1480 540 1460C760 1440 920 1470 1140 1450L1140 1980L-60 1980Z" fill={cloud} />
        <path d="M-60 1560C200 1520 420 1550 600 1530C800 1510 960 1540 1140 1520L1140 1980L-60 1980Z" fill={cloudShade} />
        <path d="M-60 1700C200 1670 500 1690 760 1670C900 1660 1020 1670 1140 1660L1140 1980L-60 1980Z" fill={mix(cloudShade, "#000000", 0.08)} />
      </Layer>
      {burn > 0.05 ? (
        <Layer cam={cam} depth={1}>
          <Motes f={f} n={46} seed="emb" color="#FFB04A" dir={-1} speed={1.6} size={3.4} o={burn} />
        </Layer>
      ) : null}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* (d) Kshira Sagar - the ocean of milk                                */
/* ------------------------------------------------------------------ */

export const KshiraSagar: React.FC<{ f: number; cam: Cam; glow?: number; swell?: number }> = ({ f, cam, glow = 0, swell = 0 }) => (
  <g>
    <defs>
      <linearGradient id="mKsSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#15123A" />
        <stop offset="0.45" stopColor="#4D3F7C" />
        <stop offset="0.6" stopColor={mix("#E9B98A", "#FFF1CC", glow)} />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#mKsSky)" />
    <Layer cam={cam} depth={0.1}>
      <Stars f={f} n={60} y1={760} seed="ks" o={0.8} />
      <ellipse cx={540} cy={1060} rx={700} ry={180} fill="#FFF1CC" opacity={0.25 + glow * 0.5} />
    </Layer>
    {/* wave bands */}
    {new Array(11).fill(0).map((_, i) => {
      const k = i / 10;
      const y = 1080 + Math.pow(k, 1.6) * 860;
      const amp = (6 + k * 26) * (1 + swell * 1.2);
      const ph = f / (30 - k * 12) + i * 1.3;
      const c = mix(mix(i % 2 ? "#DCD4EE" : "#EEE8F4", i % 2 ? "#E9E2D4" : "#F7F3EA", k), "#FFF7E0", glow * (1 - k) * 0.6);
      const d = new Array(13)
        .fill(0)
        .map((_, j) => {
          const x = -100 + j * 110;
          const yy = y + Math.sin(ph + j * 0.9) * amp;
          return `${j === 0 ? "M" : "L"}${x} ${yy.toFixed(1)}`;
        })
        .join("");
      return (
        <Layer key={i} cam={cam} depth={0.3 + k * 0.7}>
          <path d={`${d}L1220 2100L-100 2100Z`} fill={c} />
          <path d={d} stroke="#FFFFFF" strokeWidth={3 + k * 5} fill="none" opacity={0.9} />
          <path d={d} transform={`translate(0 ${8 + k * 10})`} stroke="#A99FCB" strokeWidth={2 + k * 3} fill="none" opacity={0.45} />
        </Layer>
      );
    })}
    {/* luminous reflection column */}
    <rect x={380} y={1080} width={320} height={840} fill="#FFF6D6" opacity={0.18 + glow * 0.4} />
    <Layer cam={cam} depth={0.8}>
      {new Array(5).fill(0).map((_, i) => (
        <ellipse key={i} cx={((i * 260 + f * (0.6 + i * 0.1)) % 1400) - 150} cy={1150 + i * 120} rx={260} ry={34} fill="#FFFFFF" opacity={0.18} />
      ))}
      <Motes f={f} n={30} seed="ksm" color="#FFF2C2" dir={-1} speed={0.3} size={2.6} o={0.6 + glow * 0.4} />
    </Layer>
  </g>
);

/* ------------------------------------------------------------------ */
/* (e) Asura court                                                     */
/* ------------------------------------------------------------------ */

export const AsuraCourt: React.FC<{ f: number; cam: Cam }> = ({ f, cam }) => (
  <g>
    <defs>
      <linearGradient id="mCourt" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0E0614" />
        <stop offset="0.6" stopColor="#2A0E22" />
        <stop offset="1" stopColor="#12060E" />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#mCourt)" />
    <Layer cam={cam} depth={0.3}>
      {/* back wall arch + throne */}
      <path d="M260 1240V560Q540 300 820 560V1240Z" fill="#3A1430" />
      <path d="M300 1240V580Q540 360 780 580V1240" stroke={P.goldDark} strokeWidth={6} fill="none" opacity={0.7} />
      <path d="M400 1180V760Q540 640 680 760V1180Z" fill="url(#mGoldDark)" opacity={0.9} />
      <path d="M430 1170V790Q540 690 650 790V1170Z" fill="#5E1219" />
      <rect x={380} y={1120} width={320} height={70} rx={10} fill="url(#mGold)" />
      <circle cx={540} cy={720} r={26} fill="#C8102E" />
      <circle cx={540} cy={720} r={26} fill="url(#mGem)" />
      {/* drapes */}
      {[-1, 1].map((sd) => (
        <path key={sd} d={sd < 0 ? "M0 0H380C330 300 250 520 160 760C100 600 40 400 0 300Z" : "M1080 0H700C750 300 830 520 920 760C980 600 1040 400 1080 300Z"} fill="#6A0E1E" />
      ))}
      <path d="M0 0H1080V70Q540 130 0 70Z" fill="#4A0A16" />
      <path d="M0 70Q540 130 1080 70" stroke={P.gold} strokeWidth={6} fill="none" />
    </Layer>
    {/* pillars + torches */}
    {[0, 1, 2].map((k) => (
      <Layer key={k} cam={cam} depth={0.45 + k * 0.25}>
        {[-1, 1].map((sd) => {
          const x = 540 + sd * (330 + k * 120);
          const w = 70 + k * 40;
          const top = 220 - k * 200;
          const bot = 1300 + k * 220;
          return (
            <g key={sd}>
              <rect x={x - w / 2} y={top} width={w} height={bot - top} fill={mix("#2A1030", "#12060E", k / 2)} />
              <rect x={x - w / 2} y={top} width={w * 0.18} height={bot - top} fill="#FFB04A" opacity={0.08 + 0.05 * (sd < 0 ? 1 : 0)} />
              {[0.15, 0.85].map((u) => (
                <rect key={u} x={x - w / 2 - 8} y={top + (bot - top) * u} width={w + 16} height={16 + k * 6} fill="url(#mGoldDark)" />
              ))}
              <g transform={`translate(${x - sd * (w / 2 + 14)} ${top + (bot - top) * 0.42})`}>
                <circle r={120 + k * 40} fill="url(#mTorch)" opacity={0.8 + 0.2 * Math.sin(f / 5 + k + sd)} />
                <path d="M-14 0L14 0L8 40L-8 40Z" fill="url(#mGoldDark)" />
                <Flame x={0} y={0} s={0.9 + k * 0.3} f={f} seed={`tc${k}${sd}`} />
              </g>
            </g>
          );
        })}
      </Layer>
    ))}
    {/* floor */}
    <Layer cam={cam} depth={0.8}>
      <path d="M-100 1300H1180V2100H-100Z" fill="#160812" />
      {new Array(9).fill(0).map((_, i) => (
        <path key={i} d={`M540 1300L${-500 + i * 260} 2100`} stroke={P.goldDark} strokeWidth={2} opacity={0.25} />
      ))}
      {[1360, 1460, 1600, 1800].map((y) => (
        <path key={y} d={`M-100 ${y}H1180`} stroke={P.goldDark} strokeWidth={2} opacity={0.2} />
      ))}
      <ellipse cx={540} cy={1340} rx={300} ry={40} fill="#FFB04A" opacity={0.12} />
    </Layer>
    <Layer cam={cam} depth={1}>
      <Motes f={f} n={20} seed="crt" color="#FFB04A" dir={-1} speed={0.5} size={2.4} o={0.6} />
    </Layer>
  </g>
);

/** Soft vignette over any set. */
export const Vignette: React.FC<{ o?: number }> = ({ o = 1 }) => <rect width={W} height={H} fill="url(#mVignette)" opacity={o} />;
