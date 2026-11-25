import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { FocusLines, Shockwave, Sparks, SpeedLines, StarDust } from "../bbreel/anime";
import { DEVA } from "../bbreel/fonts";
import { INK, Slam, starPath } from "./prims";
import { SC, hit, kickPulse, ramp, shake, track, wob } from "./timing";

/* S2 — Shani Dev on his Bullet through Shani Lok. The visual peak:
   5 parallax layers, spinning spoked wheels, blue exhaust fire, flowing hair
   and scarf, a moustache twirl on "kacche dhaage", a wheelie + title on
   "jigra body mein", aura, sparks and impact frames on the kicks. */

const BLUE = { base: "#3F78E6", shade: "#2A52B4", deep: "#1C3A8A", light: "#86B2FF" };
const NAVY = "#141C44";
const NAVY_D = "#0B1030";

/** Arc path around (cx, cy), angles in degrees, clockwise (SVG y-down). */
const arc = (cx: number, cy: number, r: number, a0: number, a1: number): string => {
  const p = (a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
};

/* ------------------------------------------------------------------ */
/* Shani Lok backdrop                                                  */
/* ------------------------------------------------------------------ */

const Saturn: React.FC<{ f: number }> = ({ f }) => {
  const rot = -17 + Math.sin(f / 60) * 1.5;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs>
        <radialGradient id="sat-body" cx="0.38" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#F6E2A6" />
          <stop offset="0.5" stopColor="#C99B57" />
          <stop offset="1" stopColor="#5A3A4E" />
        </radialGradient>
        <linearGradient id="sat-ring" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8F7BD8" stopOpacity="0.2" />
          <stop offset="0.3" stopColor="#F2D9A0" stopOpacity="0.95" />
          <stop offset="0.7" stopColor="#C9A86A" stopOpacity="0.9" />
          <stop offset="1" stopColor="#8F7BD8" stopOpacity="0.2" />
        </linearGradient>
        <clipPath id="sat-front">
          <rect x={-800} y={0} width={1600} height={400} />
        </clipPath>
        <clipPath id="sat-back">
          <rect x={-800} y={-400} width={1600} height={400} />
        </clipPath>
      </defs>
      <circle cx={770} cy={540} r={360} fill="#7C4DD8" opacity={0.18} filter="url(#f-soft)" />
      <g transform={`translate(770 540) rotate(${rot})`}>
        <g clipPath="url(#sat-back)">
          <ellipse rx={560} ry={120} fill="none" stroke="url(#sat-ring)" strokeWidth={44} />
          <ellipse rx={470} ry={98} fill="none" stroke="url(#sat-ring)" strokeWidth={18} opacity={0.7} />
        </g>
      </g>
      <g transform="translate(770 540)">
        <circle r={262} fill="url(#sat-body)" />
        {[-150, -90, -30, 40, 110, 170].map((y, i) => (
          <path key={i} d={`M${-Math.sqrt(Math.max(0, 262 * 262 - y * y))} ${y} Q0 ${y + 18} ${Math.sqrt(Math.max(0, 262 * 262 - y * y))} ${y}`} fill="none" stroke={i % 2 ? "#E8C98A" : "#8E6440"} strokeWidth={i % 2 ? 10 : 16} opacity={0.55} />
        ))}
        <circle r={262} fill="none" stroke="#C9B6FF" strokeWidth={6} opacity={0.5} />
        <path d={arc(0, 0, 250, 120, 250)} fill="none" stroke="#FFF4D0" strokeWidth={10} opacity={0.35} />
      </g>
      <g transform={`translate(770 540) rotate(${rot})`}>
        <g clipPath="url(#sat-front)">
          <ellipse rx={560} ry={120} fill="none" stroke="url(#sat-ring)" strokeWidth={44} />
          <ellipse rx={470} ry={98} fill="none" stroke="url(#sat-ring)" strokeWidth={18} opacity={0.7} />
        </g>
      </g>
    </svg>
  );
};

/** Iron-temple skyline that tiles horizontally; `x` = scroll offset. */
const Skyline: React.FC<{ x: number; y: number; color: string; win: string; seed: string; scale?: number; o?: number }> = ({ x, y, color, win, seed, scale = 1, o = 1 }) => {
  const tile = 1400;
  const items: React.ReactNode[] = [];
  for (let k = -1; k < 2; k++) {
    for (let i = 0; i < 7; i++) {
      const r = (s: string) => wob(`${seed}${i}${s}`, 0.5) * 0.5 + 0.5;
      const bx = k * tile + i * 200 + r("x") * 60 - (x % tile);
      const h = (220 + r("h") * 260) * scale;
      const w = (120 + r("w") * 70) * scale;
      items.push(
        <g key={`${k}-${i}`} transform={`translate(${bx} ${y})`}>
          <path d={`M0 0 L0 ${-h * 0.55} Q${w * 0.1} ${-h * 0.62} ${w * 0.18} ${-h * 0.66} L${w * 0.5} ${-h} L${w * 0.82} ${-h * 0.66} Q${w * 0.9} ${-h * 0.62} ${w} ${-h * 0.55} L${w} 0Z`} fill={color} />
          <path d={`M${w * 0.5} ${-h} L${w * 0.5} ${-h - 40 * scale}`} stroke={color} strokeWidth={6 * scale} />
          <circle cx={w * 0.5} cy={-h - 44 * scale} r={7 * scale} fill={win} />
          {[0, 1, 2].map((j) => (
            <rect key={j} x={w * 0.3} y={-h * 0.45 + j * 50 * scale} width={w * 0.14} height={22 * scale} rx={4} fill={win} opacity={0.75} />
          ))}
          {[0, 1, 2].map((j) => (
            <rect key={`b${j}`} x={w * 0.58} y={-h * 0.45 + j * 50 * scale} width={w * 0.14} height={22 * scale} rx={4} fill={win} opacity={0.5} />
          ))}
        </g>,
      );
    }
  }
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: o }}>
      {items}
    </svg>
  );
};

const Crows: React.FC<{ f: number }> = ({ f }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    {[0, 1, 2, 3, 4].map((i) => {
      const x = ((1300 - (f * (5 + i)) + i * 260) % 1400) - 160;
      const y = 900 + i * 46 + Math.sin(f / 5 + i) * 14;
      const flap = Math.sin(f / 1.6 + i * 1.3);
      return (
        <path key={i} transform={`translate(${x} ${y}) scale(${0.9 - i * 0.08})`} d={`M-34 ${-10 * flap} Q-16 ${-4 - 12 * flap} 0 4 Q16 ${-4 - 12 * flap} 34 ${-10 * flap} Q14 ${4 - 4 * flap} 0 12 Q-14 ${4 - 4 * flap} -34 ${-10 * flap}Z`} fill="#06051A" opacity={0.85} />
      );
    })}
  </svg>
);

const Road: React.FC<{ f: number; y: number; speed: number }> = ({ f, y, speed }) => {
  const off = (f * speed) % 260;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#241A4A" />
          <stop offset="0.15" stopColor="#120E2A" />
          <stop offset="1" stopColor="#05040E" />
        </linearGradient>
      </defs>
      <rect x={-40} y={y} width={1160} height={1920 - y + 40} fill="url(#road)" />
      <rect x={-40} y={y - 8} width={1160} height={12} fill="#6A5BD8" opacity={0.6} />
      {/* lane dashes (Jyotiq gold) */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={i * 260 - off - 120} y={y + 150} width={150} height={16} rx={8} fill="#F2C14E" opacity={0.9} />
      ))}
      {/* motion-blurred road grit */}
      <g filter="url(#f-blurx)">
        {new Array(16).fill(0).map((_, i) => {
          const gx = ((i * 157 - f * speed * 1.2) % 1300) + 1200;
          return <rect key={i} x={(gx % 1300) - 110} y={y + 40 + ((i * 53) % 340)} width={60 + (i % 4) * 40} height={4} fill="#8C7BFF" opacity={0.35} />;
        })}
      </g>
    </svg>
  );
};

/** Iron lamp posts with blue flames, whipping past in the mid-ground. */
const Posts: React.FC<{ f: number; y: number; speed: number; scale?: number; blur?: boolean }> = ({ f, y, speed, scale = 1, blur }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <g filter={blur ? "url(#f-blurx)" : undefined}>
      {[0, 1].map((i) => {
        const x = 1500 - ((f * speed + i * 760) % 1520);
        const fl = 1 + 0.15 * Math.sin(f * 1.3 + i);
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${scale})`}>
            <rect x={-12} y={-620} width={24} height={620} fill="#0B0920" />
            <path d="M-40 -620 L40 -620 L26 -650 L-26 -650Z" fill="#0B0920" />
            <ellipse cx={0} cy={-700} rx={70} ry={90} fill="#5B8CFF" opacity={0.25} />
            <path d={`M0 ${-650 - 90 * fl} C30 ${-690} 28 -660 0 -650 C-28 -660 -30 ${-690} 0 ${-650 - 90 * fl}Z`} fill="#8FB8FF" />
            <path d={`M0 ${-650 - 50 * fl} C14 -676 14 -660 0 -652 C-14 -660 -14 -676 0 ${-650 - 50 * fl}Z`} fill="#FFFFFF" />
          </g>
        );
      })}
    </g>
  </svg>
);

/* ------------------------------------------------------------------ */
/* The Bullet                                                          */
/* ------------------------------------------------------------------ */

const Wheel: React.FC<{ cx: number; cy: number; r: number; spin: number }> = ({ cx, cy, r, spin }) => (
  <g transform={`translate(${cx} ${cy})`}>
    <circle r={r} fill="#07060E" />
    <circle r={r - 6} fill="none" stroke="#1C1A2A" strokeWidth={8} strokeDasharray="14 10" transform={`rotate(${spin * 1.3})`} />
    <circle r={r * 0.78} fill="#0E0D1C" />
    {/* motion-blurred spokes: three ghost copies */}
    {[0, 6, 12].map((g, gi) => (
      <g key={g} transform={`rotate(${spin + g})`} opacity={gi === 0 ? 0.9 : 0.35}>
        {new Array(20).fill(0).map((_, i) => {
          const a = (i * 18 * Math.PI) / 180;
          return <line key={i} x1={Math.cos(a) * 14} y1={Math.sin(a) * 14} x2={Math.cos(a + 0.22) * r * 0.76} y2={Math.sin(a + 0.22) * r * 0.76} stroke="#C9D3E6" strokeWidth={2.2} />;
        })}
      </g>
    ))}
    <circle r={r * 0.78} fill="none" stroke="url(#g-chrome)" strokeWidth={9} />
    <circle r={r * 0.62} fill="rgba(160,170,220,0.10)" />
    <circle r={22} fill="url(#g-chrome)" stroke={INK} strokeWidth={4} />
    <circle r={8} fill="#2A2A3A" />
    <circle r={r} fill="none" stroke={INK} strokeWidth={6} />
    <path d={arc(0, 0, r - 4, 200, 250)} fill="none" stroke="#7B76A8" strokeWidth={5} opacity={0.8} />
  </g>
);

export const RW = { x: -300, y: -140, r: 142 };
const FW = { x: 300, y: -140, r: 142 };

export const Bullet: React.FC<{ f: number; flame: number }> = ({ f, flame }) => {
  const spin = f * 41;
  const fl = 1 + 0.25 * Math.sin(f * 1.9) + 0.12 * Math.sin(f * 3.1);
  return (
    <g>
      {/* exhaust fire (behind) */}
      <g transform="translate(-560 -126)">
        <path d={`M0 0 C${-90 * fl * flame} ${-40} ${-200 * fl * flame} ${-10} ${-260 * fl * flame} 0 C${-200 * fl * flame} 10 ${-90 * fl * flame} 40 0 0Z`} fill="#5B6BFF" opacity={0.75} filter="url(#f-glow)" />
        <path d={`M0 0 C${-60 * fl * flame} -22 ${-130 * fl * flame} -6 ${-170 * fl * flame} 0 C${-130 * fl * flame} 6 ${-60 * fl * flame} 22 0 0Z`} fill="#BFD0FF" />
        <path d={`M0 0 C${-30 * fl * flame} -10 ${-60 * fl * flame} -3 ${-80 * fl * flame} 0 C${-60 * fl * flame} 3 ${-30 * fl * flame} 10 0 0Z`} fill="#FFFFFF" />
      </g>
      <Wheel cx={RW.x} cy={RW.y} r={RW.r} spin={spin} />
      <Wheel cx={FW.x} cy={FW.y} r={FW.r} spin={spin} />
      {/* fenders */}
      <path d={arc(RW.x, RW.y, RW.r + 18, 175, 318)} fill="none" stroke={NAVY} strokeWidth={34} strokeLinecap="round" />
      <path d={arc(RW.x, RW.y, RW.r + 18, 200, 300)} fill="none" stroke="#3A4C9A" strokeWidth={6} />
      <path d={arc(FW.x, FW.y, FW.r + 16, 205, 330)} fill="none" stroke={NAVY} strokeWidth={30} strokeLinecap="round" />
      <path d={arc(FW.x, FW.y, FW.r + 16, 225, 310)} fill="none" stroke="#3A4C9A" strokeWidth={6} />
      {/* frame */}
      <g stroke={NAVY_D} strokeWidth={22} strokeLinecap="round" fill="none">
        <path d="M232 -432 L46 -132" />
        <path d="M232 -432 L-150 -396" />
        <path d="M-150 -396 L-300 -140" />
        <path d="M-300 -140 L-10 -120" />
      </g>
      {/* fork */}
      <path d="M244 -440 L300 -140" stroke="url(#g-chrome)" strokeWidth={22} strokeLinecap="round" />
      <path d="M256 -360 L286 -210" stroke="#1E1E2E" strokeWidth={30} strokeLinecap="round" opacity={0.85} />
      {/* engine */}
      <g transform="translate(40 -200)">
        <rect x={-60} y={-110} width={150} height={120} rx={18} fill="url(#g-chrome)" stroke={INK} strokeWidth={5} />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={-74} y={-104 + i * 22} width={178} height={11} rx={5} fill="#8E97B4" stroke={INK} strokeWidth={2.5} />
        ))}
        <ellipse cx={-20} cy={50} rx={110} ry={62} fill="#1A1C2C" stroke={INK} strokeWidth={5} />
        <ellipse cx={-20} cy={50} rx={58} ry={32} fill="url(#g-chrome)" stroke={INK} strokeWidth={4} />
        <circle cx={-20} cy={50} r={10} fill={INK} />
      </g>
      {/* exhaust pipe + peashooter */}
      <path d="M120 -220 C170 -170 150 -110 60 -96 L-330 -96" fill="none" stroke="url(#g-chrome)" strokeWidth={24} strokeLinecap="round" />
      <path d="M-260 -112 L-560 -138 L-562 -112 L-260 -80Z" fill="url(#g-chrome)" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M-280 -104 L-540 -126" stroke="#FFFFFF" strokeWidth={4} opacity={0.6} />
      {/* toolbox */}
      <path d="M-210 -360 L-60 -350 L-80 -250 L-200 -262Z" fill={NAVY} stroke={INK} strokeWidth={5} />
      <text x={-140} y={-294} textAnchor="middle" fontFamily={DEVA} fontWeight={700} fontSize={40} fill="#F2C14E">शनि</text>
      {/* seat */}
      <path d="M-250 -418 C-240 -446 -120 -452 -60 -430 L-70 -404 L-246 -398Z" fill="#5A3420" stroke={INK} strokeWidth={5} />
      <path d="M-230 -430 C-180 -442 -120 -440 -80 -430" fill="none" stroke="#8A5A36" strokeWidth={6} />
      <path d="M-180 -398 L-176 -366 M-120 -400 L-118 -368" stroke="url(#g-chrome)" strokeWidth={8} />
      {/* fuel tank with Jyotiq decal */}
      <path d="M-100 -404 C-96 -478 110 -506 214 -448 C240 -430 230 -394 196 -388 L-96 -380Z" fill="#101845" stroke={INK} strokeWidth={6} />
      <path d="M-80 -420 C-60 -470 100 -488 196 -442" fill="none" stroke="#F2C14E" strokeWidth={6} />
      <path d="M-60 -452 C-10 -478 90 -484 150 -462" fill="none" stroke="#9FB4FF" strokeWidth={10} strokeLinecap="round" opacity={0.6} />
      <image href={staticFile("jyotiq/logo-full.png")} x={22} y={-476} width={86} height={99} />
      {/* headlight + beam */}
      <path d="M330 -460 L1180 -640 L1180 -200 L330 -404Z" fill="url(#beam)" opacity={0.55} />
      <circle cx={318} cy={-432} r={56} fill="url(#g-chrome)" stroke={INK} strokeWidth={6} />
      <circle cx={322} cy={-432} r={40} fill="#FFF6D6" />
      <circle cx={322} cy={-432} r={70} fill="#FFF0B8" opacity={0.25} filter="url(#f-soft)" />
      {/* handlebar */}
      <path d="M248 -452 C236 -500 212 -520 170 -526" fill="none" stroke="url(#g-chrome)" strokeWidth={14} strokeLinecap="round" />
      <path d="M262 -470 L300 -520" stroke="#20203A" strokeWidth={6} />
      <ellipse cx={304} cy={-532} rx={22} ry={14} fill="url(#g-chrome)" stroke={INK} strokeWidth={4} />
      {/* foot peg + kicker */}
      <rect x={20} y={-196} width={90} height={14} rx={7} fill="#2A2A3A" />
      {/* rim light along the top line */}
      <path d="M-96 -402 C-90 -470 110 -500 212 -446" fill="none" stroke="#B8C8FF" strokeWidth={3} opacity={0.7} />
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Shani Dev                                                           */
/* ------------------------------------------------------------------ */

const ShaniHead: React.FC<{ f: number; grin: number; brow: number; glint: number; curl: number }> = ({ f, grin, brow, glint, curl }) => {
  const heh = Math.max(0, Math.sin(f / 2.6)) * 4 * grin;
  return (
    <g>
      {/* hair flowing back */}
      {[0, 1, 2, 3].map((i) => {
        const w = Math.sin(f / 2.2 + i * 0.9) * 22;
        const w2 = Math.sin(f / 1.7 + i * 1.3) * 30;
        return (
          <path
            key={i}
            d={`M-70 ${-110 + i * 36} C-160 ${-120 + i * 40 + w} -240 ${-80 + i * 46 - w} -330 ${-60 + i * 50 + w2} C-260 ${-40 + i * 46 + w} -170 ${-60 + i * 40 - w} -60 ${-40 + i * 36}Z`}
            fill={i % 2 ? "#120E22" : "#1C1630"}
            stroke={INK}
            strokeWidth={4}
          />
        );
      })}
      {/* neck */}
      <path d="M-40 110 L-46 190 L60 190 L52 110Z" fill={BLUE.shade} stroke={INK} strokeWidth={6} />
      {/* ear + earring */}
      <ellipse cx={-80} cy={10} rx={26} ry={38} fill={BLUE.base} stroke={INK} strokeWidth={6} />
      <circle cx={-82} cy={62} r={16} fill="none" stroke="url(#g-gold)" strokeWidth={7} />
      {/* face (3/4, facing camera-right) */}
      <path d="M-92 -44 C-98 -140 -40 -176 22 -172 C92 -168 124 -108 120 -40 C118 22 112 60 94 96 C70 136 32 152 2 150 C-40 148 -80 116 -92 60 C-100 20 -96 -12 -92 -44Z" fill={BLUE.base} stroke={INK} strokeWidth={7} />
      <path d="M-86 40 C-70 110 -30 140 10 146 C-30 120 -60 90 -72 30Z" fill={BLUE.shade} opacity={0.8} />
      <path d="M70 -150 C104 -120 116 -80 116 -40" fill="none" stroke={BLUE.light} strokeWidth={10} strokeLinecap="round" opacity={0.75} />
      {/* tilak */}
      <path d="M8 -128 Q22 -96 36 -128" fill="none" stroke="#F2C14E" strokeWidth={6} strokeLinecap="round" />
      <circle cx={22} cy={-104} r={6} fill="#E8283C" />
      {/* eyes: half-lidded, gold irises */}
      {[
        { x: -18, w: 58, s: 1 },
        { x: 70, w: 44, s: 0.82 },
      ].map((e, i) => (
        <g key={i} transform={`translate(${e.x} -30)`}>
          <ellipse rx={e.w / 2} ry={16 * e.s} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
          <circle cx={6} cy={4} r={12 * e.s} fill="#FFC940" stroke={INK} strokeWidth={3} />
          <circle cx={7} cy={4} r={5 * e.s} fill={INK} />
          <circle cx={2} cy={0} r={3} fill="#FFFFFF" />
          <path d={`M${-e.w / 2 - 4} -2 Q0 ${-22 * e.s} ${e.w / 2 + 4} -4 L${e.w / 2 + 4} -14 L${-e.w / 2 - 4} -14Z`} fill={BLUE.shade} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        </g>
      ))}
      {/* eye glint star */}
      {glint > 0.01 ? <path d={starPath(-2, -40, 34 * glint, 6 * glint, 4)} fill="#FFFFFF" /> : null}
      {/* brows: near one arched up (mysterious), far one flat */}
      <path d={`M-52 ${-64 - 10 * brow} Q-20 ${-92 - 22 * brow} 14 ${-70 - 8 * brow}`} fill="none" stroke={INK} strokeWidth={14} strokeLinecap="round" />
      <path d="M46 -66 Q72 -78 98 -64" fill="none" stroke={INK} strokeWidth={12} strokeLinecap="round" />
      {/* nose */}
      <path d="M58 -14 C70 10 84 26 74 36 C66 42 54 38 50 34" fill={BLUE.base} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      {/* grin */}
      <g transform={`translate(0 ${heh})`}>
        <path d={`M-46 70 Q30 ${96 + 26 * grin} 108 64 Q96 ${118 + 16 * grin} 30 ${124 + 12 * grin} Q-30 ${116 + 10 * grin} -46 70Z`} fill="#3A0A18" stroke={INK} strokeWidth={6} />
        <path d={`M-40 72 Q30 ${94 + 22 * grin} 102 66 L98 80 Q30 ${104 + 20 * grin} -36 84Z`} fill="#FFFFFF" />
        <path d="M-10 80 L-12 92 M14 86 L13 98 M40 88 L40 100 M66 84 L67 96" stroke={INK} strokeWidth={2.5} opacity={0.6} />
      </g>
      {/* handlebar moustache (front tip curls with the twirl) */}
      <path
        d={`M40 46 C10 40 -30 46 -62 54 C-92 62 -110 44 -104 18 C-100 0 -84 -4 -76 8 C-90 10 -92 30 -76 34 C-50 36 -14 26 40 30Z`}
        fill="#0E0A18"
        stroke={INK}
        strokeWidth={4}
      />
      <g>
        <path
          d={`M44 30 C80 24 116 30 140 ${36 - 10 * curl} C${166 + 10 * curl} ${40 - 20 * curl} ${170 + 6 * curl} ${10 - 30 * curl} ${150 + 4 * curl} ${-4 - 30 * curl} C${140} ${-10 - 30 * curl} ${130 - 6 * curl} ${0 - 22 * curl} ${140} ${10 - 18 * curl} C150 ${18 - 10 * curl} 146 ${30 - 6 * curl} 130 ${44 - 6 * curl} C100 52 70 52 40 46Z`}
          fill="#0E0A18"
          stroke={INK}
          strokeWidth={4}
        />
        <path d="M60 36 C90 32 112 34 128 40" fill="none" stroke="#5A4C88" strokeWidth={5} strokeLinecap="round" />
      </g>
      {/* crown (mukut) */}
      <g transform="translate(14 -150)">
        <path d="M-104 6 C-60 -14 60 -16 112 2 L104 34 C50 20 -50 20 -98 36Z" fill="url(#g-gold)" stroke={INK} strokeWidth={6} />
        <path d="M-84 0 L-60 -96 L-30 -40 L0 -150 L30 -40 L62 -96 L90 0Z" fill="url(#g-gold)" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <path d="M0 -150 L0 -196" stroke={INK} strokeWidth={8} />
        <circle cx={0} cy={-206} r={14} fill="url(#g-gold)" stroke={INK} strokeWidth={5} />
        <path d="M0 -22 L22 4 L0 30 L-22 4Z" fill="#2E5BFF" stroke={INK} strokeWidth={5} />
        <path d="M-4 -12 L8 2" stroke="#BFD3FF" strokeWidth={4} strokeLinecap="round" />
        {[-70, -40, 40, 70].map((x) => (
          <circle key={x} cx={x} cy={14} r={8} fill="#E8283C" stroke={INK} strokeWidth={3} />
        ))}
      </g>
    </g>
  );
};

/** Rider pose; `twirl` 0..1 lifts the near hand to the moustache. */
export const Shani: React.FC<{ f: number; twirl: number; curl: number; glint: number; flex: number }> = ({ f, twirl, curl, glint, flex }) => {
  const head = { x: -6 + 10 * flex, y: -812 - 14 * flex };
  const handGrip = { x: 172, y: -524 };
  const tw = twirl > 0 ? { x: Math.cos(f * 1.1) * 10, y: Math.sin(f * 1.1) * 10 } : { x: 0, y: 0 };
  const handTw = { x: head.x + 150 + tw.x, y: head.y + 8 + tw.y };
  const hand = { x: handGrip.x + (handTw.x - handGrip.x) * twirl, y: handGrip.y + (handTw.y - handGrip.y) * twirl };
  const shoulder = { x: -40, y: -682 - 10 * flex };
  const elbow = { x: shoulder.x + (hand.x - shoulder.x) * 0.5 + 60 - 20 * twirl, y: shoulder.y + (hand.y - shoulder.y) * 0.5 + 70 - 90 * twirl };
  const scarfW = (i: number) => Math.sin(f / 1.9 + i) * 34;
  return (
    <g>
      {/* scarf streaming behind */}
      <path
        d={`M-60 -700 C-200 ${-720 + scarfW(0)} -360 ${-660 - scarfW(1)} -520 ${-700 + scarfW(2)} C-600 ${-720 + scarfW(3)} -660 ${-690 - scarfW(4)} -720 ${-700 + scarfW(5)} C-650 ${-650 + scarfW(4)} -580 ${-640 - scarfW(3)} -500 ${-640 + scarfW(2)} C-360 ${-610 - scarfW(1)} -200 ${-640 + scarfW(0)} -40 -640Z`}
        fill="url(#scarf)"
        stroke={INK}
        strokeWidth={5}
      />
      {/* far arm */}
      <path d="M40 -680 C110 -640 170 -600 206 -546" fill="none" stroke={BLUE.deep} strokeWidth={42} strokeLinecap="round" />
      <circle cx={208} cy={-544} r={22} fill={BLUE.shade} stroke={INK} strokeWidth={5} />
      {/* torso */}
      <path d={`M-150 -444 C-176 -540 -160 -650 -100 ${-704 - 8 * flex} C-50 ${-736 - 10 * flex} 40 ${-730 - 10 * flex} ${70 + 8 * flex} ${-680 - 6 * flex} C${96 + 10 * flex} -620 70 -520 20 -456Z`} fill={NAVY} stroke={INK} strokeWidth={7} />
      <path d="M-150 -444 C-176 -540 -160 -650 -100 -704 C-130 -620 -136 -520 -110 -450Z" fill={NAVY_D} />
      <path d={`M-96 -700 C-40 -620 0 -540 18 -460`} fill="none" stroke="url(#g-gold)" strokeWidth={16} />
      <path d={`M-100 ${-704 - 8 * flex} C-50 ${-736 - 10 * flex} 40 ${-730 - 10 * flex} ${70 + 8 * flex} ${-680 - 6 * flex}`} fill="none" stroke="url(#g-gold)" strokeWidth={10} />
      {/* near leg */}
      <path d="M-130 -446 C-60 -470 30 -470 80 -440 C96 -420 92 -396 70 -390 L60 -360 C50 -300 60 -250 64 -204 L18 -204 C12 -260 10 -320 20 -380 C-30 -386 -100 -390 -140 -400Z" fill="#0F1430" stroke={INK} strokeWidth={6} />
      <path d="M10 -206 L130 -206 C150 -206 152 -180 130 -178 L6 -178Z" fill="url(#g-gold)" stroke={INK} strokeWidth={5} />
      {/* near arm */}
      <path d={`M${shoulder.x} ${shoulder.y} Q${elbow.x} ${elbow.y} ${hand.x} ${hand.y}`} fill="none" stroke={INK} strokeWidth={50} strokeLinecap="round" />
      <path d={`M${shoulder.x} ${shoulder.y} Q${elbow.x} ${elbow.y} ${hand.x} ${hand.y}`} fill="none" stroke={BLUE.base} strokeWidth={38} strokeLinecap="round" />
      <path d={`M${shoulder.x + 6} ${shoulder.y - 8} Q${elbow.x} ${elbow.y - 12} ${hand.x - 10} ${hand.y - 12}`} fill="none" stroke={BLUE.light} strokeWidth={8} strokeLinecap="round" opacity={0.6} />
      {/* armlet + bracelet */}
      <circle cx={shoulder.x + (elbow.x - shoulder.x) * 0.45} cy={shoulder.y + (elbow.y - shoulder.y) * 0.45} r={26} fill="none" stroke="url(#g-gold)" strokeWidth={12} />
      <circle cx={hand.x - (hand.x - elbow.x) * 0.25} cy={hand.y - (hand.y - elbow.y) * 0.25} r={22} fill="none" stroke="url(#g-gold)" strokeWidth={10} />
      {/* shoulder pad */}
      <path d={`M${shoulder.x - 50} ${shoulder.y + 10} Q${shoulder.x} ${shoulder.y - 60} ${shoulder.x + 54} ${shoulder.y + 6} Q${shoulder.x} ${shoulder.y - 20} ${shoulder.x - 50} ${shoulder.y + 10}Z`} fill="url(#g-gold)" stroke={INK} strokeWidth={5} />
      {/* head + Saturn halo */}
      <g transform={`translate(${head.x} ${head.y})`}>
        <g transform="translate(16 -60) rotate(-18)">
          <path d="M-196 0 A196 46 0 0 1 196 0" fill="none" stroke="#9C8CFF" strokeWidth={10} opacity={0.55} />
        </g>
        <ShaniHead f={f} grin={0.8 + 0.2 * Math.sin(f / 5)} brow={0.6 + 0.4 * glint + 0.3 * twirl} glint={glint} curl={curl} />
        <g transform="translate(16 -60) rotate(-18)">
          <path d="M-196 0 A196 46 0 0 0 196 0" fill="none" stroke="url(#ringFront)" strokeWidth={14} strokeLinecap="round" />
          {[0, 1, 2].map((i) => {
            const a = f / 8 + i * 2.1;
            const x = Math.cos(a) * 196;
            const y = Math.sin(a) * 46;
            return y > 0 ? <circle key={i} cx={x} cy={y} r={7} fill="#FFFFFF" opacity={0.9} /> : null;
          })}
        </g>
      </g>
      {/* near hand (fist on grip or twirling) */}
      <g transform={`translate(${hand.x} ${hand.y}) rotate(${-30 * twirl})`}>
        <ellipse rx={30} ry={26} fill={BLUE.base} stroke={INK} strokeWidth={6} />
        {twirl > 0.5 ? <path d="M10 -20 Q34 -34 30 -54" fill="none" stroke={INK} strokeWidth={14} strokeLinecap="round" /> : null}
        {twirl > 0.5 ? <path d="M10 -20 Q34 -34 30 -54" fill="none" stroke={BLUE.base} strokeWidth={8} strokeLinecap="round" /> : null}
        <path d="M-14 -8 Q0 -14 16 -6" fill="none" stroke={BLUE.shade} strokeWidth={5} strokeLinecap="round" />
      </g>
    </g>
  );
};

/** The crow on the headlight, in tiny shades. */
export const Crow: React.FC<{ f: number; caw: number }> = ({ f, caw }) => {
  const bob = Math.sin(f / 2.4) * 4;
  const ruff = Math.sin(f * 1.7) * 6;
  return (
    <g transform={`translate(330 ${-512 + bob})`}>
      <path d={`M-64 -14 C-90 ${-30 + ruff} -110 ${-20 - ruff} -126 ${-30 + ruff} C-100 0 -80 10 -60 6Z`} fill="#0A0814" stroke={INK} strokeWidth={4} />
      <ellipse cx={-20} cy={-20} rx={56} ry={40} fill="#14101F" stroke={INK} strokeWidth={5} />
      <path d={`M-50 -30 C-30 ${-50 + ruff} 0 -46 10 -30`} fill="none" stroke="#3A3060" strokeWidth={6} />
      <circle cx={30} cy={-52} r={30} fill="#14101F" stroke={INK} strokeWidth={5} />
      <path d={`M56 -58 L96 ${-50 - 8 * caw} L58 -44Z`} fill="#4A4A5A" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      {caw > 0.1 ? <path d={`M58 -44 L92 ${-30 + 6 * caw} L56 -40Z`} fill="#4A4A5A" stroke={INK} strokeWidth={4} strokeLinejoin="round" /> : null}
      <rect x={14} y={-66} width={44} height={14} rx={6} fill="#0A0A10" stroke="#F2C14E" strokeWidth={3} />
      <path d="M-6 20 L-8 36 M10 20 L12 36" stroke="#C9A04A" strokeWidth={5} strokeLinecap="round" />
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

export const S2Shani: React.FC<{ f: number }> = ({ f }) => {
  const t = f - SC.shani;
  const shot2 = f >= SC.wheelie;
  const kp = kickPulse(f, SC.shani, SC.kundli, 7);
  // twirl on "kacche dhaage" (175-210), curl stays
  const twirl = track(f, [
    [174, 0],
    [182, 1, "out"],
    [208, 1],
    [218, 0, "io"],
  ]);
  const curl = track(f, [
    [176, 0],
    [206, 1, "io"],
  ]);
  const glint = Math.max(hit(f, 193, 9), hit(f, 206, 9) * 0.6, shot2 ? hit(f, SC.wheelie + 9, 12) : 0);
  // wheelie
  const wheelie = shot2
    ? track(f, [
        [SC.wheelie, 0],
        [241, -4, "in"],
        [247, -17, "back"],
        [276, -15, "io"],
        [287, -18, "io"],
        [292, 0, "in"],
      ])
    : 0;
  const land = hit(f, 292, 10);
  const flex = shot2 ? ramp(f, 241, 250, "back") * (1 - ramp(f, 286, 294)) : 0;
  const aura = shot2 ? ramp(f, 238, 246) : 0;
  const scroll = f * 1.0;
  const sh = shake(f, kp * 0.5 + land * 1.4 + (t < 6 ? (6 - t) / 6 : 0), "s2");
  const vib = { x: wob("vx", f * 3.1) * 1.6, y: wob("vy", f * 3.3) * 1.8 + Math.sin(f / 2.9) * 4 };
  const bikeX = 520 + track(f, [
    [SC.shani, -260],
    [SC.shani + 10, 0, "out"],
  ]);
  const groundY = 1560;
  const whip = 1 - ramp(f, SC.shani, SC.shani + 7, "out");
  // camera: three shots. Wide (157-171) -> close-up on the twirl (171-232) -> low-angle wheelie (232-297).
  const MCU = 171;
  const rot = (lx: number, ly: number): [number, number] => {
    const a = (wheelie * Math.PI) / 180;
    const dx = lx - RW.x;
    return [bikeX + RW.x + dx * Math.cos(a) - ly * Math.sin(a), groundY + dx * Math.sin(a) + ly * Math.cos(a)];
  };
  const cam = shot2
    ? (() => {
        const [fx, fy] = rot(-70, -600);
        return { fx: Math.max(430, Math.min(650, fx)), fy, px: 560, py: 1120, s: 1.24 + 0.08 * ramp(f, SC.wheelie, SC.kundli, "lin"), r: -4 };
      })()
    : f >= MCU
      ? { fx: bikeX + 60, fy: 780, px: 540, py: 1010, s: 1.75 + 0.15 * ramp(f, MCU, SC.wheelie, "lin"), r: 2 }
      : { fx: 540, fy: 1150, px: 540, py: 1150, s: 1.0 + 0.06 * ramp(f, SC.shani, MCU, "lin"), r: 0 };
  const camT = `translate(${cam.px + sh.x}px, ${cam.py + sh.y}px) rotate(${cam.r + sh.r}deg) scale(${cam.s}) translate(${-cam.fx}px, ${-cam.fy}px)`;
  return (
    <AbsoluteFill style={{ background: "#07061A", overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFF4C8" stopOpacity="0.95" />
            <stop offset="1" stopColor="#FFF4C8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="scarf" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#2B3FA8" />
            <stop offset="0.6" stopColor="#5A2FA0" />
            <stop offset="1" stopColor="#2A1460" />
          </linearGradient>
          <linearGradient id="ringFront" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#9C8CFF" stopOpacity="0.2" />
            <stop offset="0.5" stopColor="#F2D9A0" />
            <stop offset="1" stopColor="#9C8CFF" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="auraG" cx="0.5" cy="0.6" r="0.5">
            <stop offset="0" stopColor="#8F7BFF" stopOpacity="0.7" />
            <stop offset="1" stopColor="#3A2AD8" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
      <div style={{ position: "absolute", inset: 0, transform: camT, transformOrigin: "0 0" }}>
        {/* sky */}
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #070522 0%, #160F48 34%, #3B1C70 62%, #7A3290 80%, #2A1452 100%)" }} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 30% at 30% 40%, rgba(90,60,220,0.35), transparent 70%), radial-gradient(ellipse 50% 24% at 80% 66%, rgba(220,80,200,0.25), transparent 70%)" }} />
        <StarDust f={f} count={150} opacity={0.9} seed="s2" />
        <Saturn f={f} />
        <Skyline x={scroll * 3} y={1330} color="#1A1246" win="#7FA6FF" seed="far" scale={0.8} o={0.95} />
        <Crows f={f} />
        <Skyline x={scroll * 9} y={1420} color="#0D0A2A" win="#A8C2FF" seed="mid" scale={1.1} />
        <Posts f={f} y={1500} speed={34} />
        <Road f={f} y={groundY - 60} speed={64} />
        {/* bike + rider */}
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {/* ground shadow */}
          <ellipse cx={bikeX} cy={groundY - 4} rx={520} ry={34} fill="#000" opacity={0.55} />
          <g transform={`translate(${bikeX + vib.x} ${groundY + vib.y}) rotate(${wheelie} ${RW.x} 0)`}>
            {aura > 0 ? (
              <g opacity={aura * (0.75 + 0.25 * Math.sin(f / 1.5)) + 0.3 * kp}>
                <ellipse cx={-40} cy={-560} rx={420} ry={460} fill="url(#auraG)" />
                {new Array(9).fill(0).map((_, i) => {
                  const a = -Math.PI / 2 + (i - 4) * 0.33;
                  const h = 300 + 80 * Math.sin(f / 1.3 + i * 1.7);
                  const bx = -40 + Math.cos(a) * 300;
                  const by = -560 + Math.sin(a) * 320;
                  return <path key={i} d={`M${bx - 40} ${by + 80} Q${bx} ${by - h * 0.4} ${bx + Math.cos(a) * 30} ${by - h * 0.6} Q${bx + 10} ${by - h * 0.3} ${bx + 40} ${by + 80}Z`} fill="#8F7BFF" opacity={0.45} />;
                })}
              </g>
            ) : null}
            <Bullet f={f} flame={1 + 0.6 * kp + (shot2 ? 0.4 : 0)} />
            <Shani f={f} twirl={twirl} curl={curl} glint={glint} flex={flex} />
            <Crow f={f} caw={Math.max(hit(f, 254, 8), hit(f, 171, 8))} />
          </g>
        </svg>
        {/* foreground dust */}
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const age = (f * 0.7 + i * 7) % 22;
            const x = bikeX - 330 - age * 26;
            const y = groundY - 30 - age * 3 - (i % 3) * 14;
            return <circle key={i} cx={x} cy={y} r={20 + age * 3} fill="#B7A6FF" opacity={0.28 * (1 - age / 22)} />;
          })}
        </svg>
        {shot2 ? <Sparks f={f} at={Math.floor((f - SC.wheelie) / 4) * 4 + SC.wheelie} x={bikeX - 300} y={groundY - 6} count={18} dir={-Math.PI * 0.85} spread={1.1} power={1.2} dur={14} seed="wh" /> : null}
        <Posts f={f} y={1990} speed={90} scale={1.8} blur />
      </div>
      {/* overlays outside the camera */}
      <SpeedLines f={f} angle={180} count={shot2 ? 60 : 34} color="#DCD6FF" opacity={shot2 ? 0.45 : 0.28} speed={-120} seed="s2l" />
      {shot2 ? <FocusLines f={f} cx={540} cy={1000} rx={470} ry={640} color="#FFFFFF" opacity={0.25 * aura + 0.4 * hit(f, 241, 10)} count={90} seed="s2f" /> : null}
      {shot2 ? <Shockwave f={f} at={292} x={bikeX - 120} y={groundY + 40} size={1.2} color="#BFD0FF" /> : null}
      {/* whip-pan entry */}
      {whip > 0.01 ? <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(255,255,255,${whip}) 0%, rgba(160,140,255,${whip * 0.8}) 40%, transparent 100%)`, mixBlendMode: "screen" }} /> : null}
      {/* title on the wheelie */}
      <Slam f={f} at={241} dur={SC.kundli - 241} text="SHANI DEV" size={112} y={300} fill="#6FA8FF" stroke="#0A0820" rot={-5} sub="शनि देव · KARM-PHAL DAATA" subColor="#F2C14E" />
      {/* flash on the wheelie hit */}
      {hit(f, 241, 5) > 0 ? <AbsoluteFill style={{ background: "#FFFFFF", opacity: hit(f, 241, 5) * 0.55 }} /> : null}
      <AbsoluteFill style={{ fontFamily: DEVA, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
