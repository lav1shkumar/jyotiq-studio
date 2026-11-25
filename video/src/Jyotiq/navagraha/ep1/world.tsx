import React, { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { Flame } from "../../manthan/sets";
import { rnd } from "../../manthan/style";
import { S } from "./look";

/*
 * नवग्रह जन्म Ep1 sets and effects, in the jyotiq.ai palette (warm cream, saffron, gold, lavender clouds,
 * lotus pink, leaf green). Flat shapes in the Manthan cut-out style, but daylight-warm instead of night.
 * All drawn in a 1080 x 1920 SVG. Sets keep their focal art out of the top-right app panel.
 */

export const W = 1080;
export const H = 1920;

export const NvDefs: React.FC = () => (
  <defs>
    <linearGradient id="nvSkyPalace" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FFF6E8" />
      <stop offset="0.55" stopColor="#FCE3C0" />
      <stop offset="1" stopColor="#F6C894" />
    </linearGradient>
    <linearGradient id="nvSkyDawn" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FFF4E4" />
      <stop offset="0.6" stopColor="#FDDDBA" />
      <stop offset="1" stopColor="#F9C99A" />
    </linearGradient>
    <linearGradient id="nvSkyDusk" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#E9DDF4" />
      <stop offset="0.55" stopColor="#F6D3C4" />
      <stop offset="1" stopColor="#F4B98E" />
    </linearGradient>
    <linearGradient id="nvWorkshop" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#F8DDB2" />
      <stop offset="1" stopColor="#E7A866" />
    </linearGradient>
    <linearGradient id="nvFloor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#F8E4C6" />
      <stop offset="1" stopColor="#EFCB98" />
    </linearGradient>
    <linearGradient id="nvSand" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#E9C08A" />
      <stop offset="0.5" stopColor="#F6D9AE" />
      <stop offset="1" stopColor="#E3B57C" />
    </linearGradient>
    <linearGradient id="nvDrape" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={S.saffron} />
      <stop offset="1" stopColor={S.red} />
    </linearGradient>
    <radialGradient id="nvSunCore" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#FFFDF0" />
      <stop offset="0.45" stopColor="#FFE58F" />
      <stop offset="1" stopColor="#FFB23D" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="nvWarm" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#FFF1C8" stopOpacity="0.95" />
      <stop offset="1" stopColor="#FFD58A" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="nvViolet" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#8E78D6" stopOpacity="0.55" />
      <stop offset="1" stopColor="#4A3A78" stopOpacity="0" />
    </radialGradient>
    {/* Chhaya: Sanjna's own figure turned to dusk-violet shadow (same shapes = "हूबहू अपने जैसी") */}
    <filter id="nvChhaya" x="-20%" y="-10%" width="140%" height="120%">
      <feColorMatrix type="matrix" values="0.22 0.22 0.08 0 0.10  0.16 0.18 0.08 0 0.07  0.30 0.34 0.28 0 0.22  0 0 0 0.95 0" />
    </filter>
    {/* a "being-born" shadow: flat silhouette */}
    <filter id="nvSil">
      <feColorMatrix type="matrix" values="0 0 0 0 0.20  0 0 0 0 0.15  0 0 0 0 0.36  0 0 0 0.85 0" />
    </filter>
    <filter id="nvBlur20">
      <feGaussianBlur stdDeviation="20" />
    </filter>
    <filter id="nvBlur6">
      <feGaussianBlur stdDeviation="6" />
    </filter>
  </defs>
);

/**
 * An SVG <image> that Remotion waits for (a plain <image> is not awaited, so a frame can be captured before
 * the file has loaded). `file` is a path under public/.
 */
export const SvgImage: React.FC<Omit<React.SVGProps<SVGImageElement>, "href"> & { file: string }> = ({ file, ...rest }) => {
  const src = staticFile(file);
  const [handle] = useState(() => delayRender(`svg image ${file}`));
  useEffect(() => {
    const im = new Image();
    const done = () => continueRender(handle);
    im.onload = () => {
      im.decode().then(done, done);
    };
    im.onerror = done;
    im.src = src;
  }, [src, handle]);
  return <image href={src} preserveAspectRatio="xMidYMid meet" {...rest} />;
};

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

export const Cloud: React.FC<{ x: number; y: number; s?: number; c?: string; o?: number }> = ({ x, y, s = 1, c = S.lavender, o = 0.9 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <ellipse cx={0} cy={0} rx={150} ry={56} fill={c} />
    <circle cx={-70} cy={-30} r={62} fill={c} />
    <circle cx={10} cy={-58} r={78} fill={c} />
    <circle cx={90} cy={-26} r={56} fill={c} />
    <ellipse cx={-10} cy={-20} rx={120} ry={34} fill="#FFFFFF" opacity={0.35} />
  </g>
);

export const Lotus: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={70} ry={14} fill="#5E8F33" opacity={0.85} />
    {[-60, -30, 0, 30, 60].map((a) => (
      <path key={a} d="M0 0C-16 -18 -18 -52 0 -78C18 -52 16 -18 0 0Z" transform={`rotate(${a})`} fill={a === 0 ? "#F7B3C6" : S.lotus} stroke={S.lotusDeep} strokeWidth={2} />
    ))}
    <circle cx={0} cy={-8} r={9} fill={S.gold} />
  </g>
);

export const Leaf: React.FC<{ x: number; y: number; s?: number; rot?: number; c?: string }> = ({ x, y, s = 1, rot = 0, c = S.leaf }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M0 0C30 -30 80 -30 120 0C80 30 30 30 0 0Z" fill={c} />
    <path d="M4 0L112 0" stroke={S.leafDark} strokeWidth={3} opacity={0.6} />
  </g>
);

/** Surya's tej: a white-gold disc with long rays. k 0..1 = how blinding; turns slowly with f. */
export const SunRays: React.FC<{ x: number; y: number; r: number; k?: number; f: number; n?: number }> = ({ x, y, r, k = 1, f, n = 28 }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r * 3.2} fill="url(#nvWarm)" opacity={0.55 * k} />
    <g transform={`rotate(${f * 0.25})`} opacity={0.75 * k}>
      {Array.from({ length: n }, (_, i) => {
        const long = i % 2 === 0;
        const L = r * (long ? 2.6 : 1.9) * (0.9 + 0.2 * rnd(`ray${i}`));
        return <path key={i} d={`M${-r * 0.12} 0L0 ${-L}L${r * 0.12} 0Z`} transform={`rotate(${(i * 360) / n})`} fill={long ? "#FFE58F" : "#FFF3C9"} />;
      })}
    </g>
    <circle r={r * 1.25} fill="url(#nvSunCore)" opacity={k} />
    <circle r={r * 0.8} fill="#FFF8E1" opacity={0.9 * k} />
  </g>
);

/** A low brass diya with a flame. */
export const Diya: React.FC<{ x: number; y: number; s?: number; f: number; seed: string }> = ({ x, y, s = 1, f, seed }) => (
  <g>
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-40 0C-36 22 36 22 40 0Z" fill="url(#mGold)" stroke={S.goldDeep} strokeWidth={2} />
      <path d="M30 -2L52 -10L40 4Z" fill="url(#mGold)" />
    </g>
    <Flame x={x + 40 * s} y={y - 12 * s} s={0.55 * s} f={f} seed={seed} />
  </g>
);

/* ------------------------------------------------------------------ */
/* Sets                                                                */
/* ------------------------------------------------------------------ */

/**
 * Surya's sun-wheel: the site's hero-right art cropped to the zodiac wheel only (its scroll, books and lotus
 * are clipped away so they don't float behind characters), with tej rays and my own lavender clouds.
 * (x, y, w) = the box of the full art; the wheel sits at about (0.495w, 0.42h), radius 0.31w.
 */
export const SunWheel: React.FC<{ x: number; y: number; w: number; f: number; blaze?: number; id: string; clouds?: boolean }> = ({ x, y, w, f, blaze = 0.7, id, clouds = true }) => {
  const h = w * (1293 / 1216);
  const cx = x + 0.495 * w;
  const cy = y + 0.395 * h;
  const r = 0.282 * w;
  return (
    <g>
      <SunRays x={cx} y={cy} r={r * 0.62} k={blaze} f={f} />
      {clouds ? (
        <>
          <Cloud x={cx - r * 0.95} y={cy + r * 0.55} s={w / 900} />
          <Cloud x={cx + r * 0.95} y={cy + r * 0.45} s={w / 1000} o={0.85} />
        </>
      ) : null}
      <clipPath id={`${id}-clip`}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <g clipPath={`url(#${id}-clip)`}>
        <SvgImage file="jyotiq/site/hero-right-image.png" x={x} y={y} width={w} height={h} />
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={S.gold} strokeWidth={Math.max(4, w / 120)} />
    </g>
  );
};

const Pillar: React.FC<{ x: number; y0: number; y1: number; w?: number }> = ({ x, y0, y1, w = 96 }) => (
  <g>
    <rect x={x - w / 2} y={y0} width={w} height={y1 - y0} fill="url(#nvSand)" />
    <rect x={x - w / 2 + 12} y={y0} width={10} height={y1 - y0} fill="#FFF0D6" opacity={0.55} />
    <rect x={x - w / 2 - 14} y={y0 - 40} width={w + 28} height={44} rx={8} fill="url(#mGold)" />
    <rect x={x - w / 2 - 20} y={y0 - 58} width={w + 40} height={20} rx={6} fill={S.goldDeep} opacity={0.8} />
    <rect x={x - w / 2 - 14} y={y1 - 8} width={w + 28} height={40} rx={8} fill="url(#mGold)" />
    {[0.3, 0.55, 0.8].map((u) => (
      <rect key={u} x={x - w / 2} y={y0 + (y1 - y0) * u} width={w} height={8} fill={S.gold} opacity={0.65} />
    ))}
  </g>
);

const Drape: React.FC<{ x0: number; x1: number; y: number; sag: number }> = ({ x0, x1, y, sag }) => (
  <g>
    <path d={`M${x0} ${y}Q${(x0 + x1) / 2} ${y + sag} ${x1} ${y}L${x1} ${y + 26}Q${(x0 + x1) / 2} ${y + sag + 40} ${x0} ${y + 26}Z`} fill="url(#nvDrape)" />
    <path d={`M${x0} ${y + 26}Q${(x0 + x1) / 2} ${y + sag + 40} ${x1} ${y + 26}`} stroke={S.gold} strokeWidth={6} fill="none" />
  </g>
);

/**
 * Surya's palace: cream sandstone hall, saffron drapes, and the site's sun-wheel art (hero-right) as the
 * blazing disc behind the throne. `wheel` = where the disc sits (it stays clear of the app panel by default).
 */
export const PalaceSet: React.FC<{ f: number; wheel?: { x: number; y: number; w: number }; blaze?: number; door?: boolean; dusk?: boolean }> = ({
  f,
  wheel = { x: 150, y: 470, w: 780 },
  blaze = 0.7,
  door = false,
  dusk = false,
}) => (
  <g>
    <rect width={W} height={H} fill={dusk ? "url(#nvSkyDusk)" : "url(#nvSkyPalace)"} />
    {/* back wall + arch */}
    <rect x={0} y={420} width={W} height={1000} fill="#F7DDB6" />
    <path d="M140 1420L140 760C140 560 300 440 540 440C780 440 940 560 940 760L940 1420Z" fill={dusk ? "#F3C9A8" : "#FCEAD0"} />
    <path d="M140 760C140 560 300 440 540 440C780 440 940 560 940 760" stroke={S.gold} strokeWidth={14} fill="none" />
    <path d="M168 760C168 586 318 470 540 470C762 470 912 586 912 760" stroke={S.goldLight} strokeWidth={4} fill="none" />
    {door ? (
      // an open doorway to the outside: dusk light, the path away
      <g>
        <path d="M380 1420L380 900C380 820 450 760 540 760C630 760 700 820 700 900L700 1420Z" fill="url(#nvSkyDusk)" />
        <path d="M540 1420L470 1100L610 1100Z" fill="#E9B98A" opacity={0.5} />
        <ellipse cx={540} cy={1080} rx={120} ry={18} fill="#B9C98F" opacity={0.8} />
      </g>
    ) : (
      <SunWheel x={wheel.x} y={wheel.y} w={wheel.w} f={f} blaze={blaze} id={`pw${wheel.x}-${wheel.y}`} />
    )}
    <Pillar x={70} y0={520} y1={1430} />
    <Pillar x={1010} y0={520} y1={1430} />
    <Drape x0={0} x1={540} y={470} sag={120} />
    <Drape x0={540} x1={1080} y={470} sag={120} />
    {/* floor */}
    <path d="M0 1400L1080 1400L1080 1920L0 1920Z" fill="url(#nvFloor)" />
    {[0, 1, 2, 3, 4].map((i) => (
      <path key={i} d={`M0 ${1440 + i * 90}L1080 ${1440 + i * 90}`} stroke={S.gold} strokeWidth={3} opacity={0.35} />
    ))}
    {[-3, -2, -1, 0, 1, 2, 3].map((i) => (
      <path key={i} d={`M${540 + i * 70} 1400L${540 + i * 260} 1920`} stroke={S.gold} strokeWidth={3} opacity={0.3} />
    ))}
    <Diya x={150} y={1470} f={f} seed="d1" />
    <Diya x={900} y={1470} f={f} seed="d2" />
  </g>
);

/** The forest of Sanjna's tapas: a dawn sky, lavender clouds, layered green hills, trees and a lotus pond. */
export const ForestSet: React.FC<{ f: number; dusk?: boolean; sun?: number }> = ({ f, dusk = false, sun = 0.5 }) => {
  const tree = (x: number, y: number, s: number, c: string) => (
    <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-14} y={-40} width={28} height={200} fill="#7A4A26" />
      <circle cx={0} cy={-120} r={110} fill={c} />
      <circle cx={-80} cy={-60} r={80} fill={c} />
      <circle cx={80} cy={-70} r={86} fill={c} />
      <circle cx={-30} cy={-160} r={60} fill="#FFFFFF" opacity={0.08} />
    </g>
  );
  return (
    <g>
      <rect width={W} height={H} fill={dusk ? "url(#nvSkyDusk)" : "url(#nvSkyDawn)"} />
      <SunRays x={540} y={760} r={90} k={sun} f={f} n={24} />
      <Cloud x={200} y={640} s={1.1} />
      <Cloud x={760} y={560} s={0.9} o={0.8} />
      <Cloud x={480} y={820} s={0.7} o={0.7} />
      <path d="M0 980C200 900 380 940 560 900C760 860 920 900 1080 880L1080 1920L0 1920Z" fill="#C9D79E" />
      <path d="M0 1080C180 1020 360 1060 540 1030C720 1000 900 1050 1080 1010L1080 1920L0 1920Z" fill="#A9C477" />
      {tree(120, 1060, 1.1, "#6E9B3A")}
      {tree(960, 1040, 1.2, "#5E8F33")}
      {tree(300, 1110, 0.7, "#7FA948")}
      {tree(800, 1120, 0.75, "#7FA948")}
      <path d="M0 1240C220 1200 420 1230 600 1210C800 1190 940 1230 1080 1210L1080 1920L0 1920Z" fill="#8DB25A" />
      {/* lotus pond, foreground */}
      <ellipse cx={540} cy={1560} rx={620} ry={150} fill="#A9D3C3" />
      <ellipse cx={540} cy={1540} rx={560} ry={110} fill="#C4E3D6" opacity={0.7} />
      <Lotus x={180} y={1560} s={0.9} />
      <Lotus x={880} y={1580} s={1.0} />
      <Lotus x={620} y={1610} s={0.6} />
      <Leaf x={20} y={1450} s={1.4} rot={-20} />
      <Leaf x={1060} y={1440} s={1.4} rot={200} />
    </g>
  );
};

/** Vishvakarma's lathe: a great stone-and-gold wheel on a stand; spokes turn with f. */
export const Lathe: React.FC<{ x: number; y: number; r: number; f: number; spin?: number }> = ({ x, y, r, f, spin = 1 }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M${-r * 0.9} ${r * 1.55}L${-r * 0.35} 0L${r * 0.35} 0L${r * 0.9} ${r * 1.55}Z`} fill="#8A5A2B" />
    <path d={`M${-r * 0.9} ${r * 1.55}L${r * 0.9} ${r * 1.55}`} stroke={S.goldDeep} strokeWidth={18} />
    <circle r={r} fill="#B98A57" stroke={S.goldDeep} strokeWidth={10} />
    <circle r={r * 0.86} fill="#CFA06A" />
    <g transform={`rotate(${f * 6 * spin})`}>
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d={`M0 0L0 ${-r * 0.84}`} stroke={S.goldDeep} strokeWidth={10} transform={`rotate(${i * 30})`} />
      ))}
      {Array.from({ length: 36 }, (_, i) => (
        <path key={i} d={`M0 ${-r * 1.0}L0 ${-r * 1.08}`} stroke={S.gold} strokeWidth={8} transform={`rotate(${i * 10})`} />
      ))}
    </g>
    <circle r={r * 0.2} fill="url(#mGold)" stroke={S.goldDeep} strokeWidth={4} />
  </g>
);

/** Shavings of tej flying off the lathe: small gold shards on spiral paths. */
export const TejShards: React.FC<{ x: number; y: number; f: number; k?: number; n?: number }> = ({ x, y, f, k = 1, n = 26 }) => (
  <g transform={`translate(${x} ${y})`} opacity={k}>
    {Array.from({ length: n }, (_, i) => {
      const a = rnd(`ts${i}`) * Math.PI * 2 + f * 0.02;
      const d = 120 + rnd(`td${i}`) * 360;
      const sx = Math.cos(a) * d;
      const sy = Math.sin(a) * d * 0.8;
      const sc = 1.4 + 1.4 * rnd(`tz${i}`);
      return (
        <g key={i} transform={`translate(${sx} ${sy}) rotate(${(a * 180) / Math.PI})`}>
          <ellipse rx={22 * sc} ry={10 * sc} fill="#FFD36B" opacity={0.45} filter="url(#nvBlur6)" />
          <path d="M0 -14L6 0L0 14L-6 0Z" transform={`scale(${sc})`} fill={i % 3 ? "#FFE58F" : "#FFFFFF"} stroke="#E8A93A" strokeWidth={1} />
        </g>
      );
    })}
  </g>
);

/** Vishvakarma's workshop: warm amber interior, tool racks, a forge glow and the lathe. */
export const WorkshopSet: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={W} height={H} fill="url(#nvWorkshop)" />
    {/* rafters */}
    {[520, 600].map((y) => (
      <rect key={y} x={0} y={y} width={W} height={26} fill="#9B6634" opacity={0.6} />
    ))}
    {/* tool rack on the left wall (hammers, compasses, chisels) */}
    <g opacity={0.75}>
      <rect x={40} y={680} width={260} height={16} fill="#8A5A2B" />
      {[70, 120, 170, 220, 270].map((x, i) => (
        <g key={x} transform={`translate(${x} 700)`}>
          <rect x={-4} y={0} width={8} height={130} fill="#7A4A26" />
          {i % 2 ? <rect x={-22} y={0} width={44} height={22} rx={4} fill="#6B6B6B" /> : <path d="M0 0L-18 120M0 0L18 120" stroke="#6B6B6B" strokeWidth={6} />}
        </g>
      ))}
    </g>
    {/* forge glow bottom-left */}
    <circle cx={120} cy={1380} r={260} fill="url(#nvWarm)" opacity={0.8} />
    <rect x={40} y={1280} width={200} height={140} rx={20} fill="#7A4A26" />
    <path d="M60 1290C90 1230 120 1260 140 1210C160 1260 190 1230 220 1290Z" fill={S.saffron} />
    {/* floor */}
    <path d="M0 1400L1080 1400L1080 1920L0 1920Z" fill="#D9A56A" />
    <path d="M0 1400L1080 1400" stroke="#9B6634" strokeWidth={6} />
    <Lathe x={600} y={940} r={300} f={f} />
    {/* anvil */}
    <path d="M820 1340L980 1340L960 1380L900 1390L900 1420L860 1420L860 1390L840 1380Z" fill="#5A5A60" />
  </g>
);

/** The curse: a thin coil of dark smoke from a pointing hand to its target (restrained, no gore). */
export const CurseSmoke: React.FC<{ x0: number; y0: number; x1: number; y1: number; f: number; k?: number }> = ({ x0, y0, x1, y1, f, k = 1 }) => {
  const pts = Array.from({ length: 9 }, (_, i) => {
    const u = i / 8;
    return [x0 + (x1 - x0) * u, y0 + (y1 - y0) * u + Math.sin(u * 9 + f * 0.2) * 26] as const;
  });
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join("");
  return (
    <g opacity={k}>
      <path d={d} stroke="#4A3A78" strokeWidth={34} fill="none" strokeLinecap="round" opacity={0.35} filter="url(#nvBlur6)" />
      <path d={d} stroke="#6B57B0" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.7} />
      <circle cx={x1} cy={y1} r={60} fill="url(#nvViolet)" />
    </g>
  );
};
