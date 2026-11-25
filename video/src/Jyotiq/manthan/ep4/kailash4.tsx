import React from "react";
import { Stars } from "../sets";
import { H, W } from "../style";

/*
 * Episode 4's Kailash: the same night set as Episode 3's cliffhanger (ep3/kailash.tsx: sky, crescent
 * moon, far ranges, the square-faced peak, snow ridges, the foreground ledge), without the seated
 * silhouette, so the coloured Mahadev can sit exactly where the silhouette sat.
 * `dawn` 0..1 warms the sky after he drinks (the colour returns to the world).
 */
export const KailashBg: React.FC<{ f: number; moon?: number; dawn?: number; id?: string }> = ({ f, moon = 1, dawn = 0, id = "k4" }) => (
  <g>
    <defs>
      <linearGradient id={`k4sky-${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#070A1C" />
        <stop offset="0.55" stopColor="#141A40" />
        <stop offset="1" stopColor="#232B5C" />
      </linearGradient>
      <linearGradient id={`k4dawn-${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1A2A66" stopOpacity={0} />
        <stop offset="0.6" stopColor="#6A5AA8" stopOpacity={0.5} />
        <stop offset="1" stopColor="#F2A86A" stopOpacity={0.75} />
      </linearGradient>
    </defs>
    <rect x={0} y={0} width={W} height={H} fill={`url(#k4sky-${id})`} />
    {dawn > 0 ? <rect x={0} y={0} width={W} height={1300} fill={`url(#k4dawn-${id})`} opacity={dawn} /> : null}
    <Stars f={f} n={70} y1={900} seed={`ks${id}`} o={0.8 * (1 - 0.6 * dawn)} />
    <g opacity={moon} transform="translate(720 360)">
      <circle cx={0} cy={0} r={150} fill="#FFF1C8" opacity={0.18} filter="url(#mBlur8)" />
      <path d="M60 -110A120 120 0 1 0 60 110A96 96 0 1 1 60 -110Z" fill="#FFF1C8" />
    </g>
    <path d="M0 1180L140 1020L260 1110L400 960L520 1060L660 940L820 1070L960 980L1080 1060L1080 1920L0 1920Z" fill="#161C40" />
    <path d="M180 1400L360 860L470 700L540 640L610 700L720 860L900 1400Z" fill="#262F5E" />
    <path d="M540 640L610 700L720 860L900 1400L560 1400L560 900Z" fill="#1C2448" />
    <path d="M470 700L540 640L610 700L590 760L540 730L490 760Z" fill="#E4ECFA" />
    <path d="M440 790L500 770L540 800L590 772L650 800L660 822L600 806L548 830L494 806L436 818Z" fill="#DCE6F8" opacity={0.8} />
    <path d="M392 930L470 900L520 934L560 912L640 936L700 920L716 946L640 960L560 940L500 966L430 948L384 960Z" fill="#DCE6F8" opacity={0.62} />
    <path d="M330 1100L420 1060L480 1096L530 1074L600 1104L700 1080L770 1108L780 1132L690 1118L600 1134L520 1112L440 1136L340 1126Z" fill="#DCE6F8" opacity={0.46} />
    <path d="M270 1270L380 1236L460 1262L560 1246L660 1270L800 1250L830 1278L700 1290L560 1276L450 1296L290 1292Z" fill="#DCE6F8" opacity={0.32} />
    {dawn > 0 ? <path d="M180 1400L360 860L470 700L540 640L560 660L560 1400Z" fill="#F2A86A" opacity={0.18 * dawn} /> : null}
    <path d="M0 1560C200 1500 420 1490 620 1520C800 1546 960 1520 1080 1490L1080 1920L0 1920Z" fill="#0C1028" />
  </g>
);
