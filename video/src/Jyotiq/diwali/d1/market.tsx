import React from "react";
import { sparkle } from "../../katha/style";
import { H, ramp, rnd, W, wob } from "../../manthan/style";
import { Garland, Kalash, Strand } from "./counter";

/* Diwali Day 1, line 04: a Dhanteras vessel stall at dusk. The stall behind glows gold (soft focus: brass lotas,
   thalis, steel tumblers, kalash, diyas under a striped awning with marigolds and fairy lights). In front, a family
   lifts a shining brass kalash together: the present day is drawn as warm rim-lit silhouettes whose faces catch the
   kalash's light (closed happy eyes, smiles), myth figures stay fully drawn. The mother wears the hook's red and gold
   bangles, so the hand at the jeweller's counter was hers. Needs <CounterDefs /> and <MarketDefs /> in the svg.
   lift 0..1 raises the kalash (the family's hands ride with it); shine 0..1 brightens its glow and sparkles. */

export const MARKET_KALASH: [number, number] = [540, 1000]; // kalash base when fully lifted
export const MARKET_KALASH_S = 1.5;

export const MarketDefs: React.FC = () => (
  <defs>
    <radialGradient id="m1Stall" cx="0.5" cy="0.42" r="0.75">
      <stop offset="0" stopColor="#FFE2A6" />
      <stop offset="0.45" stopColor="#E8963E" />
      <stop offset="1" stopColor="#4A1C10" />
    </radialGradient>
    <linearGradient id="m1LitR" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#1E0E18" />
      <stop offset="0.55" stopColor="#3A1A22" />
      <stop offset="0.85" stopColor="#9A5640" />
      <stop offset="1" stopColor="#F2B07A" />
    </linearGradient>
    <linearGradient id="m1LitL" x1="1" y1="0" x2="0" y2="0">
      <stop offset="0" stopColor="#1E0E18" />
      <stop offset="0.55" stopColor="#3A1A22" />
      <stop offset="0.85" stopColor="#9A5640" />
      <stop offset="1" stopColor="#F2B07A" />
    </linearGradient>
    <linearGradient id="m1SareeR" x1="0" y1="0" x2="1" y2="0.2">
      <stop offset="0" stopColor="#2A0C24" />
      <stop offset="0.7" stopColor="#5A1640" />
      <stop offset="1" stopColor="#B04A6A" />
    </linearGradient>
    <linearGradient id="m1KurtaL" x1="1" y1="0" x2="0" y2="0.2">
      <stop offset="0" stopColor="#1E1410" />
      <stop offset="0.7" stopColor="#3E2A1A" />
      <stop offset="1" stopColor="#A8743E" />
    </linearGradient>
    <linearGradient id="m1FrockR" x1="0" y1="0" x2="1" y2="0.2">
      <stop offset="0" stopColor="#2A0A10" />
      <stop offset="0.7" stopColor="#6A1420" />
      <stop offset="1" stopColor="#D0604A" />
    </linearGradient>
    <radialGradient id="m1Halo">
      <stop offset="0" stopColor="#FFF4CC" stopOpacity="0.95" />
      <stop offset="0.35" stopColor="#FFD27A" stopOpacity="0.55" />
      <stop offset="1" stopColor="#FFB040" stopOpacity="0" />
    </radialGradient>
    <filter id="m1Dof" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="8" />
    </filter>
    <filter id="m1Rim" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" />
    </filter>
  </defs>
);

export type V = [number, number];

/** Tapered limb from a (wide) to b (narrow), bowed by `bow` px to one side. */
export const limb = (a: V, b: V, wa: number, wb: number, bow: number): string => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l = Math.hypot(dx, dy) || 1;
  const nx = -dy / l;
  const ny = dx / l;
  const mx = (a[0] + b[0]) / 2 + nx * bow;
  const my = (a[1] + b[1]) / 2 + ny * bow;
  const k = (wa + wb) / 4;
  const f = (x: number, y: number) => `${x.toFixed(1)} ${y.toFixed(1)}`;
  return (
    `M${f(a[0] + (nx * wa) / 2, a[1] + (ny * wa) / 2)} Q${f(mx + nx * k, my + ny * k)} ${f(b[0] + (nx * wb) / 2, b[1] + (ny * wb) / 2)} ` +
    `L${f(b[0] - (nx * wb) / 2, b[1] - (ny * wb) / 2)} Q${f(mx - nx * k, my - ny * k)} ${f(a[0] - (nx * wa) / 2, a[1] - (ny * wa) / 2)} Z`
  );
};

/** A back-lit shape: a soft warm rim (blurred stroke) behind the fill. */
export const Lit: React.FC<{ d: string; fill: string; rim?: number }> = ({ d, fill, rim = 1 }) => (
  <g>
    <path d={d} fill="none" stroke="#FFD9A0" strokeWidth={10} opacity={0.75 * rim} filter="url(#m1Rim)" />
    <path d={d} fill="none" stroke="#FFE8C0" strokeWidth={3.5} opacity={0.9 * rim} />
    <path d={d} fill={fill} />
  </g>
);

/** Hand cupped under the kalash, at h, fingers pointing `dir` (1 = right, -1 = left). */
const Cup: React.FC<{ h: V; dir: number; fill: string }> = ({ h, dir, fill }) => (
  <g transform={`translate(${h[0]},${h[1]}) scale(${dir},1)`}>
    <Lit d="M-16 8C-20 -6 -10 -16 4 -16L24 -14C30 -13 30 -7 24 -6L12 -5C18 -2 18 4 12 5L-2 8C-6 14 -14 14 -16 8Z" fill={fill} rim={0.8} />
  </g>
);

/** Profile head facing right, centre (0,0), about 92 px tall. Lit from the front (right). */
export const HeadR: React.FC<{ f: number; seed: string; hair: "bun" | "short" | "ponies"; bindi?: boolean; s?: number; tilt?: number }> = ({ f, seed, hair, bindi, s = 1, tilt = 0 }) => {
  const sm = 0.5 + 0.5 * Math.sin(f / 9 + rnd(seed) * 6); // a little living smile
  return (
    <g transform={`scale(${s}) rotate(${tilt})`}>
      {hair === "bun" ? (
        <>
          <circle cx={-44} cy={-6} r={24} fill="#140A0E" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const a = (-100 + i * 32) * (Math.PI / 180);
            return <circle key={i} cx={-44 + Math.cos(a) * 26} cy={-6 + Math.sin(a) * 26} r={4.5} fill="#FFF6E6" opacity={0.95} />;
          })}
        </>
      ) : null}
      {hair === "ponies" ? (
        <>
          <path d="M-36 -20C-62 -26 -78 -6 -74 22C-70 8 -58 -2 -40 -4Z" fill="#140A0E" />
          <circle cx={-40} cy={-12} r={6} fill="#D0283A" />
        </>
      ) : null}
      <Lit
        d="M-26 64C-40 40 -52 10 -48 -18C-44 -50 -14 -66 14 -60C34 -54 44 -38 46 -20C46 -14 50 -6 58 4L49 10C52 13 53 16 50 18C47 20 46 21 48 23C50 25 49 30 46 34C42 42 32 46 24 46L22 64Z"
        fill="url(#m1LitR)"
      />
      {/* hair cap */}
      <path
        d={
          hair === "short"
            ? "M-48 -18C-44 -52 -12 -68 18 -60C36 -54 44 -42 44 -32C30 -40 4 -44 -16 -36C-30 -30 -40 -16 -44 2Z"
            : "M-48 -18C-44 -52 -12 -68 18 -60C36 -54 44 -40 42 -30C26 -40 0 -40 -18 -30C-32 -22 -42 -4 -42 18Z"
        }
        fill="#140A0E"
      />
      {/* closed happy eye, brow, smile, blush, earring */}
      <path d="M22 -16C27 -21 33 -21 37 -16" stroke="#2A1210" strokeWidth={3.2} fill="none" strokeLinecap="round" />
      <path d="M20 -28C26 -32 34 -32 40 -28" stroke="#2A1210" strokeWidth={2.6} fill="none" strokeLinecap="round" opacity={0.8} />
      <path d={`M36 ${22 - sm}C40 ${26 + sm} 45 ${26 + sm} 48 ${21 - sm}`} stroke="#5A1A14" strokeWidth={2.6} fill="none" strokeLinecap="round" />
      <ellipse cx={30} cy={6} rx={8} ry={5} fill="#FF8A7A" opacity={0.35} />
      {bindi ? <circle cx={44} cy={-27} r={3.4} fill="#D0283A" /> : null}
      {hair !== "short" ? <circle cx={-4} cy={22} r={5} fill="url(#c1Gold)" /> : null}
    </g>
  );
};

/** Mother in a saree, facing right; shoulder at (0,0). `hand` is her front hand target in the same frame. */
const Mother: React.FC<{ f: number; hand: V; hand2: V }> = ({ f, hand, hand2 }) => (
  <g>
    {/* back arm (behind the body) */}
    <Lit d={limb([-6, 6], hand2, 34, 18, -16)} fill="url(#m1LitR)" rim={0.7} />
    {/* torso and saree, the pallu over the back shoulder */}
    <Lit d="M-70 10C-60 -16 -20 -26 20 -18C48 -12 60 10 60 40C60 140 70 320 96 900L-150 900C-130 600 -110 200 -70 10Z" fill="url(#m1SareeR)" />
    <path d="M-62 2C-120 120 -150 420 -170 900" stroke="#C8892A" strokeWidth={7} fill="none" opacity={0.85} />
    <path d="M-40 -14C-30 120 -40 420 -60 900" stroke="#E8B24A" strokeWidth={4} fill="none" opacity={0.55} />
    {/* neck and head */}
    <path d="M-14 -12L-10 -46L16 -46L22 -12Z" fill="#3A1A22" />
    <g transform="translate(8,-100)">
      <HeadR f={f} seed="ma" hair="bun" bindi tilt={-14} />
    </g>
    {/* front arm with bangles */}
    <Lit d={limb([26, 6], hand, 34, 18, -20)} fill="url(#m1LitR)" />
    {[0.86, 0.9, 0.94].map((t, i) => {
      const x = 26 + (hand[0] - 26) * t;
      const y = 6 + (hand[1] - 6) * t;
      const ang = (Math.atan2(hand[1] - 6, hand[0] - 26) * 180) / Math.PI;
      return <ellipse key={t} cx={x} cy={y} rx={4} ry={11} transform={`rotate(${ang},${x},${y})`} fill="none" stroke={i === 1 ? "url(#c1Gold)" : "#D0283A"} strokeWidth={4} />;
    })}
  </g>
);

/** Father in a kurta, facing left (mirrored), shoulder at (0,0); `hand` in the unmirrored parent frame. */
const Father: React.FC<{ f: number; hand: V }> = ({ f, hand }) => (
  <g>
    <Lit d="M70 10C60 -18 20 -28 -20 -20C-50 -14 -64 10 -66 40C-70 160 -60 400 -50 900L170 900C160 500 140 200 70 10Z" fill="url(#m1KurtaL)" />
    {/* placket and buttons catching the light */}
    <path d="M-30 -14L-36 200" stroke="#E8B24A" strokeWidth={3} opacity={0.6} />
    {[30, 70, 110].map((y) => (
      <circle key={y} cx={-33} cy={y} r={4} fill="#F2C25A" opacity={0.8} />
    ))}
    <path d="M14 -12L10 -46L-16 -46L-22 -12Z" fill="#3A1A22" />
    <g transform="translate(-8,-104) scale(-1,1)">
      <HeadR f={f} seed="pa" hair="short" s={1.08} tilt={-12} />
    </g>
    <path d="M-42 -84C-52 -80 -58 -74 -56 -70" stroke="#140A0E" strokeWidth={5} fill="none" strokeLinecap="round" />
    <Lit d={limb([-26, 8], hand, 40, 21, 18)} fill="url(#m1KurtaL)" />
  </g>
);

/** The girl, facing right and looking up, shoulder at (0,0); `hand` is her reaching hand. */
const Girl: React.FC<{ f: number; hand: V }> = ({ f, hand }) => (
  <g>
    <Lit d="M-44 8C-36 -10 -10 -16 16 -12C36 -8 44 8 44 26C46 80 70 200 110 420L-130 420C-100 200 -60 80 -44 8Z" fill="url(#m1FrockR)" />
    <path d="M-120 380C-60 400 40 400 104 380" stroke="#E8B24A" strokeWidth={6} fill="none" opacity={0.8} />
    <path d="M-10 -8L-8 -34L12 -34L16 -8Z" fill="#3A1A22" />
    <g transform="translate(4,-76)">
      <HeadR f={f} seed="gi" hair="ponies" s={0.82} tilt={-30} />
    </g>
    <Lit d={limb([20, 4], hand, 25, 14, -12)} fill="url(#m1LitR)" />
  </g>
);

/** Soft-focus stall behind: shelves of brass and steel under a striped awning. */
const Stall: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x={-80} y={-80} width={W + 160} height={H + 160} fill="url(#m1Stall)" />
    <g filter="url(#m1Dof)">
      {[400, 600, 800, 1000].map((y, si) => (
        <g key={y}>
          <rect x={-60} y={y} width={W + 120} height={22} fill="#6A3414" />
          <rect x={-60} y={y} width={W + 120} height={5} fill="#FFD27A" opacity={0.7} />
          {Array.from({ length: 8 }).map((_, i) => {
            const x = 40 + i * 140 + (si % 2) * 70;
            const k = (i * 3 + si) % 4;
            if (k === 0) {
              return (
                <g key={i}>
                  <circle cx={x} cy={y - 52} r={44} fill="#E8B24A" />
                  <rect x={x - 16} y={y - 112} width={32} height={26} fill="#C8892A" />
                  <ellipse cx={x} cy={y - 114} rx={26} ry={8} fill="#FFE6A3" />
                </g>
              );
            }
            if (k === 1) return <ellipse key={i} cx={x} cy={y - 60} rx={58} ry={56} fill="none" stroke="#F2C25A" strokeWidth={12} />;
            if (k === 2) return <rect key={i} x={x - 26} y={y - 96} width={52} height={96} rx={6} fill="#D6DCE4" opacity={0.9} />;
            return <circle key={i} cx={x} cy={y - 40} r={30} fill="#FFD27A" opacity={0.9} />;
          })}
        </g>
      ))}
      {Array.from({ length: 22 }).map((_, i) => (
        <circle key={i} cx={rnd(`mb${i}x`) * W} cy={300 + rnd(`mb${i}y`) * 900} r={20 + rnd(`mb${i}r`) * 40} fill="url(#c1Bokeh)" opacity={0.5 + 0.3 * wob(`mb${i}`, f / 15)} />
      ))}
    </g>
    {/* awning: red and marigold stripes with a scalloped edge */}
    {Array.from({ length: 12 }).map((_, i) => (
      <path key={i} d={`M${-90 + i * 110} -40L${-30 + i * 110} -40L${-14 + i * 112} 240L${-80 + i * 112} 240Z`} fill={i % 2 ? "#F28C12" : "#B3262E"} />
    ))}
    {Array.from({ length: 19 }).map((_, i) => (
      <path key={i} d={`M${-40 + i * 64} 236A32 32 0 0 0 ${24 + i * 64} 236Z`} fill={i % 2 ? "#F28C12" : "#B3262E"} />
    ))}
    <rect x={-60} y={228} width={W + 120} height={10} fill="#7A1A12" opacity={0.6} />
    <Garland x1={-20} y1={250} x2={1100} y2={250} sag={60} seed="mg" />
    <Strand f={f} y1={300} y2={300} sag={50} seed="ms" />
  </g>
);

export const MarketStall: React.FC<{ f: number; lift?: number; shine?: number; push?: number }> = ({ f, lift = 1, shine = 1, push = 0 }) => {
  const up = ramp(lift, 0, 1, "out");
  const [kx, ky0] = MARKET_KALASH;
  const ky = ky0 + (1 - up) * 140;
  const sc = MARKET_KALASH_S;
  const z = 1 + 0.06 * push;
  // hands under the base of the kalash ride with it
  const handM: V = [kx - 52, ky + 8];
  const handM2: V = [kx - 18, ky + 22];
  const handF: V = [kx + 50, ky + 6];
  const handG: V = [kx - 170, ky + 400 - 40 * up];
  const motherAt: V = [380, 1190];
  const fatherAt: V = [722, 1132];
  const girlAt: V = [300, 1572];
  const rel = (h: V, at: V): V => [h[0] - at[0], h[1] - at[1]];
  return (
    <g transform={`translate(${kx},${ky0}) scale(${z}) translate(${-kx},${-ky0})`}>
      <Stall f={f} />
      {/* the kalash and its light */}
      <circle cx={kx} cy={ky - 190 * sc} r={300 + 60 * shine} fill="url(#m1Halo)" opacity={0.55 + 0.45 * shine} />
      <g transform={`translate(${kx},${ky})`}>
        <Kalash f={f} s={sc} shine={shine} />
      </g>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = rnd(`ks${i}a`) * Math.PI * 2;
        const r = 120 + rnd(`ks${i}r`) * 170;
        const tw = Math.max(0, wob(`ks${i}`, f / 6 + i));
        return (
          <path
            key={i}
            d={sparkle(8 + 16 * tw)}
            transform={`translate(${kx + Math.cos(a) * r},${ky - 200 * sc + Math.sin(a) * r * 0.8})`}
            fill="#FFFBEA"
            opacity={tw * shine}
          />
        );
      })}
      {/* falling gold dust */}
      {Array.from({ length: 16 }).map((_, i) => {
        const x = kx - 200 + rnd(`fd${i}`) * 400;
        const y = ky - 80 + (((f * (1.2 + rnd(`fv${i}`)) + rnd(`fy${i}`) * 600) % 600));
        return <circle key={i} cx={x + wob(`fw${i}`, f / 20) * 12} cy={y} r={2 + rnd(`fr${i}`) * 2.5} fill="#FFE6A3" opacity={0.7 * shine} />;
      })}
      {/* the family */}
      <g transform={`translate(${fatherAt[0]},${fatherAt[1]})`}>
        <Father f={f} hand={rel(handF, fatherAt)} />
      </g>
      <g transform={`translate(${motherAt[0]},${motherAt[1]})`}>
        <Mother f={f} hand={rel(handM, motherAt)} hand2={rel(handM2, motherAt)} />
      </g>
      <Cup h={handM} dir={1} fill="url(#m1LitR)" />
      <Cup h={handM2} dir={1} fill="url(#m1LitR)" />
      <Cup h={handF} dir={-1} fill="url(#m1LitL)" />
      <g transform={`translate(${girlAt[0]},${girlAt[1]})`}>
        <Girl f={f} hand={rel(handG, girlAt)} />
      </g>
      <Cup h={handG} dir={1} fill="url(#m1LitR)" />
      <rect x={-80} y={-80} width={W + 160} height={H + 160} fill="url(#c1Vignette)" />
    </g>
  );
};
