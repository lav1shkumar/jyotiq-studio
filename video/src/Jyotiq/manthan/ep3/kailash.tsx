import React from "react";
import { Stars } from "../sets";
import { H, W } from "../style";

/*
 * Episode 3 cliffhanger set: Mount Kailash at night, a crescent moon, and a seated figure in
 * silhouette with a faint blue glow at the throat (the Episode 4 hint). Shown with dignity:
 * a still silhouette with a soft rim light, a trishul beside it, no face drawn.
 * Full frame (1080 x 1920). throat 0..1 = blue glow, moon 0..1, rim 0..1.
 */
export const Kailash: React.FC<{ f: number; throat?: number; moon?: number; rim?: number; id?: string }> = ({ f, throat = 1, moon = 1, rim = 1, id = "k3" }) => {
  const pulse = 0.8 + 0.2 * Math.sin(f / 10);
  return (
    <g>
      <defs>
        <linearGradient id={`ksky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#070A1C" />
          <stop offset="0.55" stopColor="#141A40" />
          <stop offset="1" stopColor="#232B5C" />
        </linearGradient>
        <radialGradient id={`kth-${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#BFF6FF" />
          <stop offset="0.4" stopColor="#40D8E8" />
          <stop offset="1" stopColor="#40D8E8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill={`url(#ksky-${id})`} />
      <Stars f={f} n={70} y1={900} seed={`ks${id}`} o={0.8} />
      {/* crescent moon */}
      <g opacity={moon} transform="translate(720 360)">
        <circle cx={0} cy={0} r={150} fill="#FFF1C8" opacity={0.18} filter="url(#mBlur8)" />
        <path d="M60 -110A120 120 0 1 0 60 110A96 96 0 1 1 60 -110Z" fill="#FFF1C8" />
      </g>
      {/* far ranges */}
      <path d="M0 1180L140 1020L260 1110L400 960L520 1060L660 940L820 1070L960 980L1080 1060L1080 1920L0 1920Z" fill="#161C40" />
      {/* Kailash: the square-faced peak with snow bands */}
      <path d="M180 1400L360 860L470 700L540 640L610 700L720 860L900 1400Z" fill="#262F5E" />
      <path d="M540 640L610 700L720 860L900 1400L560 1400L560 900Z" fill="#1C2448" />
      <path d="M470 700L540 640L610 700L590 760L540 730L490 760Z" fill="#E4ECFA" />
      {/* irregular snow ridges, brighter on the moonlit left face */}
      <path d="M440 790L500 770L540 800L590 772L650 800L660 822L600 806L548 830L494 806L436 818Z" fill="#DCE6F8" opacity={0.8} />
      <path d="M392 930L470 900L520 934L560 912L640 936L700 920L716 946L640 960L560 940L500 966L430 948L384 960Z" fill="#DCE6F8" opacity={0.62} />
      <path d="M330 1100L420 1060L480 1096L530 1074L600 1104L700 1080L770 1108L780 1132L690 1118L600 1134L520 1112L440 1136L340 1126Z" fill="#DCE6F8" opacity={0.46} />
      <path d="M270 1270L380 1236L460 1262L560 1246L660 1270L800 1250L830 1278L700 1290L560 1276L450 1296L290 1292Z" fill="#DCE6F8" opacity={0.32} />
      {/* foreground ledge */}
      <path d="M0 1560C200 1500 420 1490 620 1520C800 1546 960 1520 1080 1490L1080 1920L0 1920Z" fill="#0C1028" />
      {/* seated figure in silhouette, crescent in the hair, trishul beside */}
      <g transform="translate(560 1500)">
        <path d="M150 40L150 -330" stroke="#0B0F22" strokeWidth={10} />
        <path d="M110 -330C112 -380 130 -400 150 -410C170 -400 188 -380 190 -330M150 -410L150 -330M110 -330C116 -350 124 -356 130 -360M190 -330C184 -350 176 -356 170 -360" stroke="#0B0F22" strokeWidth={9} fill="none" strokeLinecap="round" />
        <path
          d="M-130 30C-140 -10 -110 -40 -70 -50C-80 -100 -70 -160 -40 -190C-46 -214 -44 -236 -30 -250C-40 -276 -30 -300 0 -316C30 -300 40 -276 30 -250C44 -236 46 -214 40 -190C70 -160 80 -100 70 -50C110 -40 140 -10 130 30Z"
          fill="#0B0F22"
          stroke="#9FB4FF"
          strokeWidth={3}
          strokeOpacity={0.45 * rim}
        />
        {/* jata bun with the crescent */}
        <ellipse cx={0} cy={-326} rx={22} ry={18} fill="#0B0F22" stroke="#9FB4FF" strokeWidth={3} strokeOpacity={0.45 * rim} />
        <path d="M14 -352A20 20 0 1 0 14 -318A15 15 0 1 1 14 -352Z" fill="#FFF1C8" opacity={0.95 * moon} />
        {/* the faint blue glow at the throat */}
        <circle cx={0} cy={-236} r={46} fill={`url(#kth-${id})`} opacity={0.9 * throat * pulse} />
        <circle cx={0} cy={-236} r={9} fill="#BFF6FF" opacity={0.85 * throat} />
      </g>
    </g>
  );
};
