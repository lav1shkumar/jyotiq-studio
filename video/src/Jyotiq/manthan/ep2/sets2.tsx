import React from "react";
import { Cam, Layer, Motes, Stars } from "../sets";
import { H, mix, W } from "../style";

/* Episode 2 sets. Same conventions as sets.tsx: full-frame, parallax via <Layer cam depth>. */

const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** A ridge line across the frame, closed to the bottom. */
const ridge = (y0: number, amp: number, n: number, seed: number) => {
  const pts: string[] = [];
  for (let i = 0; i <= 24; i++) {
    const x = -200 + (i / 24) * 1480;
    const k = (i / 24) * n * Math.PI;
    const y = y0 - amp * (0.55 + 0.45 * Math.abs(Math.sin(k + seed))) - (hash(i + seed) - 0.5) * amp * 0.25;
    pts.push(`${x.toFixed(0)} ${y.toFixed(0)}`);
  }
  return `M-200 2100L${pts.join("L")}L1280 2100Z`;
};

/** Dusk range where Mandar stands. dust 0..1 thickens the haze while it is torn out. */
export const MandarRange: React.FC<{ f: number; cam: Cam; dust?: number }> = ({ f, cam, dust = 0 }) => (
  <g>
    <defs>
      <linearGradient id="e2MrSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1B1440" />
        <stop offset="0.42" stopColor="#5E3468" />
        <stop offset="0.66" stopColor="#D97C58" />
        <stop offset="0.8" stopColor="#F6C57A" />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#e2MrSky)" />
    <Layer cam={cam} depth={0.08}>
      <Stars f={f} n={40} y1={620} seed="mr" o={0.55} />
      <circle cx={800} cy={1150} r={170} fill="#FFB27A" opacity={0.22} />
      <circle cx={800} cy={1150} r={96} fill="#FFDCA4" opacity={0.9} />
    </Layer>
    <Layer cam={cam} depth={0.2}>
      <path d={ridge(1240, 110, 7, 11)} fill="#8A5478" opacity={0.85} />
    </Layer>
    <Layer cam={cam} depth={0.35}>
      <path d={ridge(1330, 140, 5, 23)} fill="#5E3462" />
    </Layer>
    <Layer cam={cam} depth={0.55}>
      <path d={ridge(1450, 120, 4, 37)} fill="#3E2448" />
      {new Array(22).fill(0).map((_, i) => {
        const x = -160 + i * 66 + hash(i) * 20;
        const y = 1372 + hash(i + 9) * 40;
        const r = 18 + hash(i + 3) * 16;
        return (
          <g key={i}>
            <circle cx={x - r * 0.6} cy={y} r={r * 0.8} fill="#2A1A34" />
            <circle cx={x + r * 0.6} cy={y} r={r * 0.8} fill="#2A1A34" />
            <circle cx={x} cy={y - r * 0.5} r={r} fill="#332040" />
          </g>
        );
      })}
    </Layer>
    <Layer cam={cam} depth={0.85}>
      <path d="M-200 1560Q540 1500 1280 1560L1280 2100L-200 2100Z" fill="#2B1C28" />
      <path d="M-200 1560Q540 1500 1280 1560" stroke="#E8A06A" strokeWidth={4} opacity={0.4} fill="none" />
      {[
        [90, 1620, 60],
        [960, 1640, 74],
        [250, 1760, 44],
        [820, 1800, 52],
      ].map(([x, y, r], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx={r} ry={r * 0.55} fill="#3E2A30" />
          <ellipse cx={x - r * 0.2} cy={y - r * 0.2} rx={r * 0.5} ry={r * 0.25} fill="#5A3E3E" opacity={0.7} />
        </g>
      ))}
    </Layer>
    {dust > 0.01 ? (
      <g opacity={dust}>
        <rect x={0} y={1000} width={W} height={920} fill="#C89A6A" opacity={0.3} />
        <Motes f={f} n={40} seed="mrdust" color="#E8C49A" dir={-1} speed={0.6} size={4} o={0.8} />
      </g>
    ) : null}
  </g>
);

/**
 * The ocean of milk at night for the churning: storm 0..1 brings clouds and an amber glow,
 * swirl 0..1 draws foam rings turning around (cx, cy), the mountain's foot.
 */
export const ChurnSea: React.FC<{ f: number; cam: Cam; storm?: number; swirl?: number; glow?: number; cx?: number; cy?: number; swirlDepth?: number }> = ({
  f,
  cam,
  storm = 0,
  swirl = 0,
  glow = 0,
  cx = 540,
  cy = 1240,
  swirlDepth = 0.7,
}) => (
  <g>
    <defs>
      <linearGradient id="e2CsSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0E0C2E" />
        <stop offset="0.35" stopColor={mix("#2A2160", "#3A1E3A", storm)} />
        <stop offset="0.52" stopColor={mix("#7A5A9A", "#E0875A", storm * 0.7 + glow * 0.3)} />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#e2CsSky)" />
    <Layer cam={cam} depth={0.08}>
      <Stars f={f} n={60} y1={900} seed="cs" o={0.8 * (1 - storm * 0.7)} />
    </Layer>
    <Layer cam={cam} depth={0.18}>
      <g opacity={storm}>
        {new Array(6).fill(0).map((_, i) => {
          const x = ((i * 240 + f * (0.4 + i * 0.08)) % 1500) - 200;
          const y = 260 + (i % 3) * 170;
          return (
            <g key={i}>
              <ellipse cx={x} cy={y} rx={260} ry={60} fill="#1A1430" opacity={0.85} />
              <ellipse cx={x + 90} cy={y - 30} rx={170} ry={50} fill="#241C40" opacity={0.85} />
              <ellipse cx={x - 40} cy={y + 30} rx={200} ry={30} fill="#E0875A" opacity={0.08 + 0.1 * storm} />
            </g>
          );
        })}
      </g>
      <ellipse cx={540} cy={990} rx={720} ry={170} fill="#FFF1CC" opacity={0.18 + glow * 0.4} />
    </Layer>
    {new Array(11).fill(0).map((_, i) => {
      const k = i / 10;
      const y = 990 + Math.pow(k, 1.55) * 940;
      const amp = (8 + k * 28) * (1 + storm * 1.1);
      const ph = f / (26 - k * 10) + i * 1.3;
      const base = mix(i % 2 ? "#CFC6E6" : "#E4DCEE", i % 2 ? "#DDD4C8" : "#EFE9E0", k);
      const c = mix(base, "#FFF4D8", glow * (1 - k) * 0.5);
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
          <path d={d} stroke="#FFFFFF" strokeWidth={3 + k * 5} fill="none" opacity={0.85} />
          <path d={d} transform={`translate(0 ${8 + k * 10})`} stroke="#9A90C0" strokeWidth={2 + k * 3} fill="none" opacity={0.45} />
        </Layer>
      );
    })}
    {swirl > 0.01 ? (
      <Layer cam={cam} depth={swirlDepth}>
        <g opacity={swirl}>
          {new Array(5).fill(0).map((_, i) => (
            <g key={i}>
              <ellipse
                cx={cx}
                cy={cy + i * 18 + 5}
                rx={180 + i * 90}
                ry={34 + i * 18}
                fill="none"
                stroke="#7E74B0"
                strokeWidth={7 - i * 0.8}
                strokeDasharray={`${120 - i * 12} ${60 + i * 10}`}
                strokeDashoffset={-f * (6 - i) * (1 + swirl)}
                opacity={0.45 - i * 0.06}
              />
              <ellipse
                cx={cx}
                cy={cy + i * 18}
                rx={180 + i * 90}
                ry={34 + i * 18}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth={6 - i * 0.8}
                strokeDasharray={`${120 - i * 12} ${60 + i * 10}`}
                strokeDashoffset={-f * (6 - i) * (1 + swirl)}
                opacity={0.85 - i * 0.1}
              />
            </g>
          ))}
        </g>
      </Layer>
    ) : null}
    <Layer cam={cam} depth={0.8}>
      <Motes f={f} n={26} seed="csm" color="#FFF2C2" dir={-1} speed={0.35} size={2.6} o={0.5 + glow * 0.4} />
    </Layer>
  </g>
);

/** Beneath the ocean of milk: pale surface light fading to deep blue, shafts and drifting motes. */
export const UnderMilk: React.FC<{ f: number; cam: Cam; light?: number }> = ({ f, cam, light = 1 }) => (
  <g>
    <defs>
      <linearGradient id="e2UmSea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#EAE4F2" />
        <stop offset="0.3" stopColor="#A9BCDD" />
        <stop offset="0.7" stopColor="#3D5C8E" />
        <stop offset="1" stopColor="#1A2A50" />
      </linearGradient>
      <linearGradient id="e2UmShaft" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity={0.5} />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#e2UmSea)" />
    <Layer cam={cam} depth={0.2}>
      <g opacity={0.6 * light}>
        {new Array(6).fill(0).map((_, i) => {
          const x = 80 + i * 190 + Math.sin(f / 40 + i) * 30;
          return <path key={i} d={`M${x} -40L${x + 90} -40L${x + 330} 1500L${x + 150} 1500Z`} fill="url(#e2UmShaft)" />;
        })}
      </g>
    </Layer>
    <path
      d={`M0 120${new Array(12)
        .fill(0)
        .map((_, j) => `L${j * 100} ${(120 + Math.sin(f / 14 + j) * 10).toFixed(1)}`)
        .join("")}L1080 120L1080 0L0 0Z`}
      fill="#F6F2FA"
      opacity={0.8}
    />
    <Layer cam={cam} depth={0.6}>
      <Motes f={f} n={40} seed="umb" color="#FFFFFF" dir={-1} speed={0.5} size={3} o={0.5} />
    </Layer>
  </g>
);
