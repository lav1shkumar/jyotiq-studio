/**
 * Arjuna close-up, profile facing right, drawing the Gandiva skyward.
 * Text-true look (Virata Parva XLV–XLVI): red garments, black curling locks tied with a piece of white cloth,
 * bracelets off, gold-embroidered gloves; golden ape banner behind.
 * Soft illustrated shading: base + gradient + cheek shadow + warm rim from the low sun at frame right.
 */
import React from "react";
import { P, clamp } from "./world";

const SKIN_LIT = "#e6a978";
const SKIN = "#c4865b";
const SKIN_SH = "#8a5236";
const HAIR = "#17100c";

export const ArjunaDefs: React.FC = () => (
  <defs>
    <linearGradient id="ar-face" x1="0" y1="0" x2="1" y2="0.2">
      <stop offset="0" stopColor={SKIN_SH} />
      <stop offset="0.45" stopColor={SKIN} />
      <stop offset="0.85" stopColor={SKIN_LIT} />
      <stop offset="1" stopColor="#f3c08c" />
    </linearGradient>
    <linearGradient id="ar-neck" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#6e3f28" />
      <stop offset="0.7" stopColor={SKIN_SH} />
      <stop offset="1" stopColor={SKIN} />
    </linearGradient>
    <linearGradient id="ar-body" x1="0" y1="0" x2="1" y2="0.3">
      <stop offset="0" stopColor="#6a3c26" />
      <stop offset="0.55" stopColor={SKIN_SH} />
      <stop offset="0.9" stopColor={SKIN} />
      <stop offset="1" stopColor={SKIN_LIT} />
    </linearGradient>
    <linearGradient id="ar-armNear" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={SKIN_LIT} />
      <stop offset="0.35" stopColor={SKIN} />
      <stop offset="1" stopColor={SKIN_SH} />
    </linearGradient>
    <linearGradient id="ar-cloth" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#e2414a" />
      <stop offset="0.5" stopColor={P.red} />
      <stop offset="1" stopColor="#5a0c14" />
    </linearGradient>
    <linearGradient id="ar-white" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#b9aea0" />
      <stop offset="0.6" stopColor="#f5efe4" />
      <stop offset="1" stopColor="#fffaf0" />
    </linearGradient>
    <linearGradient id="ar-bow" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#3a2414" />
      <stop offset="0.5" stopColor="#6b4220" />
      <stop offset="1" stopColor="#2a180c" />
    </linearGradient>
    <radialGradient id="ar-cheek" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#7a3f2a" stopOpacity="0.45" />
      <stop offset="1" stopColor="#7a3f2a" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="ar-hi" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#ffe0b8" stopOpacity="0.7" />
      <stop offset="1" stopColor="#ffe0b8" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="ar-tipGlow">
      <stop offset="0" stopColor="#fffbe0" stopOpacity="1" />
      <stop offset="0.3" stopColor="#ffd77a" stopOpacity="0.7" />
      <stop offset="1" stopColor="#ff9a40" stopOpacity="0" />
    </radialGradient>
  </defs>
);

const FACE =
  "M560,760 C585,770 600,790 604,815 C608,830 614,840 612,850 C608,858 604,864 606,870 " +
  "C620,890 645,915 662,935 C664,942 650,950 630,948 C626,955 624,960 628,968 C636,972 638,978 628,984 " +
  "C624,986 622,987 626,990 C634,994 632,1002 618,1008 C612,1012 616,1022 626,1032 " +
  "C634,1046 626,1066 604,1072 C570,1078 520,1074 480,1050 L470,1030 L440,960 L450,800 Z";

const HAIR_MASS =
  "M566,772 C562,720 520,688 458,690 C388,692 346,742 342,822 C338,902 358,982 408,1022 " +
  "C428,1036 450,1032 462,1012 C452,982 448,942 452,906 C456,862 470,822 500,802 C526,786 548,782 566,772 Z";

/**
 * draw: 0 = string at rest, 1 = full draw at the cheek. released: 0..1 after release (string snaps, arrow gone).
 * f: frame for cloth flutter and breathing.
 */
export const ArjunaCloseUp: React.FC<{ f: number; draw: number; released?: number; tilt?: number }> = ({ f, draw, released = 0, tilt = -16 }) => {
  const d = released > 0 ? 0 : clamp(draw);
  const tremble = d > 0.92 ? Math.sin(f * 2.3) * 1.2 : 0;
  const breathe = Math.sin(f / 22) * 3;
  const wind = Math.sin(f / 5);
  const wind2 = Math.sin(f / 7 + 1);
  // nock (draw hand) position: from rest near the bow to the anchor at the jaw
  const anchor = { x: 632, y: 1042 };
  const rest = { x: 840, y: 1042 };
  const nock = { x: rest.x + (anchor.x - rest.x) * d, y: rest.y + tremble };
  // bow + arrow rotate about the anchor point (aim up into the sky)
  const rad = (tilt * Math.PI) / 180;
  const rot = (x: number, y: number) => ({
    x: anchor.x + (x - anchor.x) * Math.cos(rad) - (y - anchor.y) * Math.sin(rad),
    y: anchor.y + (x - anchor.x) * Math.sin(rad) + (y - anchor.y) * Math.cos(rad),
  });
  const grip = rot(905, 1042);
  const flex = 26 * d; // limbs bend more at full draw
  const top = { x: 870 - flex * 0.6, y: 520 + flex * 0.4 };
  const bot = { x: 870 - flex * 0.6, y: 1564 - flex * 0.4 };
  const snap = released > 0 ? Math.sin(released * Math.PI * 6) * 30 * (1 - released) : 0;
  const nockLocal = { x: anchor.x + (nock.x - anchor.x) + (released > 0 ? 238 + snap : 0), y: anchor.y };

  return (
    <g transform={`translate(0,${breathe})`}>
      {/* ---------- far side: bow arm + Gandiva + arrow (rotated aim) ---------- */}
      {/* far arm from the far shoulder to the grip */}
      <path d={`M600,1218 C700,1150 ${grip.x - 120},${grip.y + 40} ${grip.x - 10},${grip.y + 4}`} stroke={SKIN_SH} strokeWidth={62} strokeLinecap="round" fill="none" />
      <path d={`M610,1196 C700,1132 ${grip.x - 120},${grip.y + 18} ${grip.x - 10},${grip.y - 16}`} stroke="#b07448" strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.55} />
      {/* gold armlet on the far arm */}
      <g transform={`translate(${690},${1158}) rotate(-30)`}>
        <rect x={-10} y={-34} width={20} height={68} rx={6} fill="url(#sp-goldH)" />
      </g>
      <g transform={`rotate(${tilt},${anchor.x},${anchor.y})`}>
        {/* Gandiva: recurved, dark wood with gold bands */}
        <path
          d={`M${top.x},${top.y} C${top.x + 40},${top.y + 40} ${top.x + 6},${top.y + 90} ${top.x + 40},${top.y + 170} C${top.x + 90},${top.y + 300} 930,900 905,1042 C930,1184 ${bot.x + 90},${bot.y - 300} ${bot.x + 40},${bot.y - 170} C${bot.x + 6},${bot.y - 90} ${bot.x + 40},${bot.y - 40} ${bot.x},${bot.y}`}
          stroke="url(#ar-bow)"
          strokeWidth={22}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={`M${top.x + 40},${top.y + 170} C${top.x + 90},${top.y + 300} 930,900 905,1042 C930,1184 ${bot.x + 90},${bot.y - 300} ${bot.x + 40},${bot.y - 170}`}
          stroke="#ffcf7a"
          strokeWidth={4}
          fill="none"
          opacity={0.55}
          transform="translate(6,0)"
        />
        {[0.18, 0.32, 0.68, 0.82].map((k, i) => {
          const y = top.y + (bot.y - top.y) * k;
          const x = 905 + (k < 0.5 ? -1 : -1) * Math.pow(Math.abs(k - 0.5) * 2, 1.6) * 30;
          return <rect key={i} x={x - 18} y={y - 9} width={36} height={18} rx={5} fill="url(#sp-goldH)" />;
        })}
        <circle cx={top.x} cy={top.y} r={10} fill={P.gold} />
        <circle cx={bot.x} cy={bot.y} r={10} fill={P.gold} />
        {/* string */}
        <path d={`M${top.x},${top.y} L${nockLocal.x},${nockLocal.y} L${bot.x},${bot.y}`} stroke="#fff4dc" strokeWidth={3} fill="none" opacity={0.95} />
        {/* arrow */}
        {released === 0 && (
          <g>
            <line x1={nock.x - 4} y1={anchor.y} x2={1060} y2={anchor.y} stroke="#3a2412" strokeWidth={7} />
            <path d={`M${nock.x - 2},${anchor.y} l-34,-14 l10,14 l-10,14 z`} fill="#efe2cc" />
            <path d="M1060,1028 L1104,1042 L1060,1056 Z" fill={P.gold} />
            <circle cx={1090} cy={anchor.y} r={70 + 40 * d} fill="url(#ar-tipGlow)" opacity={0.4 + 0.6 * d} />
          </g>
        )}
        {/* gold-gloved bow hand around the grip */}
        <g transform="translate(905,1042)">
          <rect x={-30} y={-40} width={60} height={80} rx={26} fill="url(#sp-gold)" />
          <path d="M-26,-22 h52 M-26,0 h52 M-26,22 h52" stroke={P.goldDark} strokeWidth={4} opacity={0.6} />
          <path d="M-30,-10 C-50,-6 -50,20 -30,26" stroke="#b8862a" strokeWidth={10} fill="none" />
        </g>
      </g>

      {/* ---------- torso: red garment (text: "pure red garments") with gold borders ---------- */}
      <path d="M300,1920 C296,1600 316,1350 418,1236 C470,1204 560,1198 640,1214 C762,1250 824,1400 834,1920 Z" fill="url(#ar-cloth)" />
      {/* shoulder volume + chest light */}
      <path d="M418,1236 C470,1204 560,1198 640,1214 C700,1230 752,1268 784,1330 C700,1290 560,1270 430,1300 Z" fill="#e2454e" opacity={0.55} />
      <ellipse cx={720} cy={1460} rx={70} ry={220} fill="#ff8a6a" opacity={0.22} />
      {/* gold neckline border */}
      <path d="M452,1222 C500,1300 600,1306 650,1222" stroke="url(#sp-goldH)" strokeWidth={14} fill="none" />
      <path d="M452,1222 C500,1300 600,1306 650,1222" stroke="#7a4a10" strokeWidth={2} fill="none" strokeDasharray="6 8" />
      {/* diagonal uttariya over the far shoulder, flying */}
      <path d={`M610,1208 C672,1222 712,1250 724,1300 C650,1430 530,1570 392,1716 C360,1660 346,1620 336,1580 C446,1470 546,1336 610,1208 Z`} fill="#8e1621" />
      <path d={`M610,1208 C672,1222 712,1250 724,1300 C650,1430 530,1570 392,1716`} stroke="url(#sp-goldH)" strokeWidth={8} fill="none" />
      <path d={`M724,1300 C792,1306 ${852 + wind * 16},${1252 + wind2 * 12} ${916 + wind * 30},${1230 + wind2 * 20} C884,1324 832,1366 768,1388 Z`} fill="#a01c27" />
      <path d="M650,1268 C606,1366 526,1466 426,1586 M690,1306 C628,1408 548,1508 468,1628" stroke="#4a0a10" strokeWidth={5} fill="none" opacity={0.45} />
      {/* necklace */}
      <path d="M476,1214 C506,1286 596,1292 634,1220" stroke={P.gold} strokeWidth={6} fill="none" strokeDasharray="1 11" strokeLinecap="round" />
      <path d="M484,1232 C520,1320 600,1324 628,1238" stroke="url(#sp-goldH)" strokeWidth={6} fill="none" />
      <circle cx={556} cy={1300} r={15} fill="#c0232e" stroke={P.gold} strokeWidth={5} />

      {/* ---------- neck ---------- */}
      <path d="M572,1056 C574,1110 580,1160 600,1214 L440,1226 C430,1160 424,1080 420,1010 Z" fill="url(#ar-neck)" />

      {/* ---------- head ---------- */}
      <path d={FACE} fill="url(#ar-face)" />
      {/* rim light on the profile edge (sun at right) */}
      <path
        d="M560,760 C585,770 600,790 604,815 C608,830 614,840 612,850 C608,858 604,864 606,870 C620,890 645,915 662,935"
        stroke="#ffe3b6"
        strokeWidth={5}
        fill="none"
        opacity={0.75}
      />
      <path d="M626,1032 C634,1046 626,1066 604,1072" stroke="#ffd9a6" strokeWidth={4} fill="none" opacity={0.6} />
      {/* cheek + under-jaw shading */}
      <ellipse cx={548} cy={980} rx={60} ry={70} fill="url(#ar-cheek)" />
      <ellipse cx={590} cy={918} rx={30} ry={20} fill="url(#ar-hi)" />
      <path d="M480,1050 C520,1074 570,1078 604,1072 C590,1086 540,1092 490,1074 Z" fill="#5e321f" opacity={0.6} />
      {/* nostril + mouth line */}
      <path d="M634,944 C640,946 642,942 640,938" stroke="#6a3622" strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M626,987 C616,988 608,990 600,994" stroke="#5a2a1a" strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M628,975 C634,978 634,982 628,984" fill="#b0604a" />
      {/* eye (profile almond, looking along the arrow) */}
      <path d="M568,870 Q586,858 604,866 Q592,880 570,878 Z" fill="#fbf2e6" />
      <circle cx={594} cy={869} r={7.5} fill="#2a160c" />
      <circle cx={597} cy={866} r={2.4} fill="#ffffff" />
      <path d="M566,868 Q586,854 606,864" stroke={HAIR} strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d="M572,879 Q588,882 600,874" stroke="#7a4430" strokeWidth={2} fill="none" />
      {/* brow — set, focused */}
      <path d="M548,846 Q578,826 614,840" stroke={HAIR} strokeWidth={9} fill="none" strokeLinecap="round" />
      {/* tilak */}
      <path d="M586,800 L590,770" stroke="#c0232e" strokeWidth={5} strokeLinecap="round" />

      {/* ear + earring */}
      <path d="M494,892 C470,880 452,900 455,930 C458,962 474,986 494,980 C502,960 500,920 494,892 Z" fill={SKIN} />
      <path d="M488,906 C474,904 468,920 472,940 C476,954 484,960 490,956" stroke="#7a4430" strokeWidth={4} fill="none" />
      <g transform={`translate(482,${990}) rotate(${wind * 4})`}>
        <circle cx={0} cy={0} r={9} fill="url(#sp-gold)" />
        <path d="M-16,8 Q0,46 16,8 Z" fill="url(#sp-gold)" />
        <circle cx={0} cy={40} r={5} fill="#c0232e" />
      </g>

      {/* hair mass + curls */}
      <path d={HAIR_MASS} fill={HAIR} />
      <path d="M352,770 C326,800 342,826 330,850 C318,880 340,902 330,928 C322,956 346,976 344,1000 C350,1020 380,1030 404,1022" fill={HAIR} stroke={HAIR} strokeWidth={6} />
      <path d="M420,730 C396,760 380,820 384,880 M450,716 C420,760 410,840 420,920" stroke="#3a2a20" strokeWidth={3} fill="none" opacity={0.7} />
      <path d="M560,760 C540,730 500,712 456,712" stroke="#ffcf96" strokeWidth={5} fill="none" opacity={0.55} strokeLinecap="round" />
      <path d="M470,1010 C454,980 452,940 456,906" stroke="#6a4a30" strokeWidth={3} fill="none" opacity={0.5} />
      {/* topknot tied with white cloth, tails flying back */}
      <ellipse cx={440} cy={690} rx={58} ry={44} fill={HAIR} />
      <path d="M392,676 C410,640 470,636 492,670 C496,690 490,708 480,716 C460,700 420,700 396,712 C388,700 388,688 392,676 Z" fill="url(#ar-white)" />
      <path d="M398,696 C420,686 462,686 486,698" stroke="#c9bfb0" strokeWidth={4} fill="none" />
      <path
        d={`M396,700 C350,${702 + wind * 10} 300,${690 + wind2 * 22} ${240 + wind * 10},${700 + wind * 30} C${250 + wind * 6},${724 + wind * 26} 320,${724 + wind2 * 16} 398,716 Z`}
        fill="url(#ar-white)"
      />
      <path
        d={`M400,712 C360,${742 + wind2 * 14} 320,${760 + wind * 26} ${270 + wind2 * 12},${790 + wind2 * 30} C${290 + wind2 * 8},${804 + wind2 * 22} 350,${774 + wind * 14} 410,724 Z`}
        fill="#e9e1d4"
      />

      {/* ---------- near arm: draw arm, elbow back and up, hand anchored at the jaw ---------- */}
      <path d="M470,1262 C420,1268 380,1240 350,1190 C322,1146 296,1100 286,1060 C282,1032 300,1010 326,1012 C348,1014 360,1036 372,1062 C392,1110 420,1160 456,1196 Z" fill="url(#ar-armNear)" />
      <path d={`M300,1030 C330,1006 360,1010 400,1014 C480,1020 ${nock.x - 120},${anchor.y - 22} ${nock.x - 30},${anchor.y - 20} L${nock.x - 30},${anchor.y + 22} C${nock.x - 140},${anchor.y + 30} 450,1074 380,1080 C330,1084 296,1068 300,1030 Z`} fill={SKIN} />
      <path d={`M320,1018 C380,1010 ${nock.x - 140},${anchor.y - 18} ${nock.x - 34},${anchor.y - 16}`} stroke="#f0bc8c" strokeWidth={6} fill="none" opacity={0.75} strokeLinecap="round" />
      <path d={`M330,1074 C400,1074 ${nock.x - 150},${anchor.y + 24} ${nock.x - 40},${anchor.y + 18}`} stroke="#7a442c" strokeWidth={5} fill="none" opacity={0.5} />
      {/* gold armlet near the shoulder */}
      <g transform="translate(372,1150) rotate(52)">
        <rect x={-12} y={-44} width={24} height={88} rx={8} fill="url(#sp-goldH)" />
        <circle cx={0} cy={0} r={8} fill="#c0232e" />
      </g>
      {/* gold-gloved draw hand (fingers hooked on the string) */}
      <g transform={`translate(${nock.x - 6},${anchor.y})`}>
        <rect x={-46} y={-30} width={58} height={62} rx={24} fill="url(#sp-gold)" />
        <path d="M6,-22 C22,-20 24,-4 10,0 M6,0 C24,2 24,18 8,20" stroke={P.goldDark} strokeWidth={6} fill="none" strokeLinecap="round" />
        <path d="M-40,-14 h40 M-40,6 h40" stroke="#b8862a" strokeWidth={3} opacity={0.6} />
      </g>
    </g>
  );
};
