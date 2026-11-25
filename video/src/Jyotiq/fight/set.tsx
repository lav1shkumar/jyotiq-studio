import React from "react";

/* Generic reality-show living area, drawn for a 1080x1920 frame with bleed
   (the camera shakes and zooms). Deliberately NOT a copy of any real show's
   set: hot-pink damask wall, gold arch, two sconces, sofas, a green floor.
   Floor lines: back layer 1505, mid 1625, front 1735. */

export const FLOOR = { back: 1505, mid: 1625, front: 1735, fg: 1990 } as const;

/** <defs>: gradients, the wall pattern and one rim-light filter per depth. */
export const SetDefs: React.FC = () => (
  <defs>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#4E0E2E" />
      <stop offset="0.42" stopColor="#A82A58" />
      <stop offset="0.78" stopColor="#D64A7A" />
      <stop offset="1" stopColor="#C23C6C" />
    </linearGradient>
    <radialGradient id="hot" cx="540" cy="1150" r="620" gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="#FFE3EC" stopOpacity="0.95" />
      <stop offset="0.35" stopColor="#FF9CC0" stopOpacity="0.55" />
      <stop offset="1" stopColor="#FF6FA3" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="lamp" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#FFF4D6" stopOpacity="1" />
      <stop offset="0.25" stopColor="#FFD58A" stopOpacity="0.75" />
      <stop offset="1" stopColor="#FF9F5A" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#48A86E" />
      <stop offset="0.5" stopColor="#2F8656" />
      <stop offset="1" stopColor="#1A5435" />
    </linearGradient>
    <pattern id="damask" width="180" height="230" patternUnits="userSpaceOnUse">
      <path
        d="M90 18 C120 52 132 84 112 115 C132 146 120 178 90 212 C60 178 48 146 68 115 C48 84 60 52 90 18 Z"
        fill="none"
        stroke="#FFC2D8"
        strokeWidth="5"
        opacity="0.22"
      />
      <circle cx="90" cy="115" r="12" fill="#FFC2D8" opacity="0.2" />
      <circle cx="0" cy="0" r="8" fill="#FFC2D8" opacity="0.16" />
      <circle cx="180" cy="0" r="8" fill="#FFC2D8" opacity="0.16" />
      <circle cx="0" cy="230" r="8" fill="#FFC2D8" opacity="0.16" />
      <circle cx="180" cy="230" r="8" fill="#FFC2D8" opacity="0.16" />
    </pattern>
    {rim("rim", 10, 5, 0.5)}
    {rim("rimMid", 8, 4, 0.42)}
    {rim("rimBack", 6, 3, 0.32)}
    <filter id="fg" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
    </filter>
  </defs>
);

/* Backlight: a soft pink halo around the silhouette plus a hard cream rim on
   its upper-left edges (alpha minus a down-right shifted copy of itself). */
function rim(id: string, blur: number, off: number, halo: number) {
  return (
    <filter id={id} x="-40%" y="-25%" width="180%" height="150%" colorInterpolationFilters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation={blur} result="b" />
      <feFlood floodColor="#FFB3D1" floodOpacity={halo} />
      <feComposite in2="b" operator="in" result="halo" />
      <feOffset in="SourceAlpha" dx={off} dy={off} result="sh" />
      <feComposite in="SourceAlpha" in2="sh" operator="out" result="edge" />
      <feFlood floodColor="#FFE6C2" floodOpacity="0.85" />
      <feComposite in2="edge" operator="in" result="rimc" />
      <feMerge>
        <feMergeNode in="halo" />
        <feMergeNode in="SourceGraphic" />
        <feMergeNode in="rimc" />
      </feMerge>
    </filter>
  );
}

const Swirl: React.FC<{ x: number; y: number; flip?: boolean }> = ({ x, y, flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
    <path
      d="M0 0 C0 -60 70 -90 110 -50 C140 -20 120 30 80 30 C50 30 40 0 60 -14 C74 -24 92 -10 84 4"
      fill="none"
      stroke="#F2C35E"
      strokeWidth="12"
      strokeLinecap="round"
    />
  </g>
);

/** Wall, arch, sconces, floor, back-row sofas and plant. */
export const SetBack: React.FC<{ lampFlicker: number }> = ({ lampFlicker }) => (
  <g>
    <rect x="-120" y="-120" width="1320" height="1590" fill="url(#wall)" />
    <rect x="-120" y="-120" width="1320" height="1590" fill="url(#damask)" />
    <rect x="-120" y="300" width="1320" height="1200" fill="url(#hot)" />
    {/* gold arch framing the centre */}
    <path d="M150 1460 L150 720 Q150 420 540 400 Q930 420 930 720 L930 1460" fill="none" stroke="#5A1230" strokeWidth="44" opacity="0.35" />
    <path d="M150 1460 L150 720 Q150 420 540 400 Q930 420 930 720 L930 1460" fill="none" stroke="#E9B44C" strokeWidth="16" />
    <path d="M182 1460 L182 728 Q184 456 540 436 Q896 456 898 728 L898 1460" fill="none" stroke="#F7D48A" strokeWidth="4" opacity="0.8" />
    <Swirl x={150} y={760} />
    <Swirl x={930} y={760} flip />
    <circle cx="540" cy="404" r="20" fill="#F2C35E" />
    {/* sconces: the warm lit points of the frame */}
    {[60, 1020].map((x) => (
      <g key={x}>
        <circle cx={x} cy="560" r={190 * lampFlicker} fill="url(#lamp)" opacity="0.8" />
        <rect x={x - 16} y="560" width="32" height="70" rx="10" fill="#B9822F" />
        <ellipse cx={x} cy="552" rx="34" ry="24" fill="#FFF3D4" />
      </g>
    ))}
    {/* baseboard + floor */}
    <rect x="-120" y="1420" width="1320" height="34" fill="#4A0F2A" />
    <rect x="-120" y="1452" width="1320" height="600" fill="url(#floor)" />
    <ellipse cx="560" cy="1712" rx="560" ry="150" fill="#E8C37C" opacity="0.38" />
    <ellipse cx="560" cy="1712" rx="560" ry="150" fill="none" stroke="#F6DFA8" strokeWidth="6" opacity="0.4" />
    {/* plant, back left */}
    <g fill="#174A2E">
      <rect x="40" y="1420" width="90" height="85" rx="12" fill="#7A3B1E" />
      <ellipse cx="60" cy="1300" rx="44" ry="110" transform="rotate(-24 60 1300)" />
      <ellipse cx="112" cy="1290" rx="40" ry="120" transform="rotate(18 112 1290)" />
      <ellipse cx="84" cy="1250" rx="34" ry="120" />
    </g>
    {/* yellow sofa, back row left */}
    <g>
      <rect x="150" y="1290" width="360" height="150" rx="46" fill="#E9A92E" />
      <rect x="128" y="1350" width="70" height="150" rx="30" fill="#F2BD45" />
      <rect x="462" y="1350" width="70" height="150" rx="30" fill="#F2BD45" />
      <rect x="180" y="1398" width="300" height="80" rx="22" fill="#F7CB5A" />
      <rect x="150" y="1470" width="380" height="30" rx="10" fill="#B87D18" />
    </g>
    {/* pink loveseat, back row right */}
    <g>
      <rect x="720" y="1320" width="420" height="130" rx="56" fill="#F3B3C9" />
      <rect x="745" y="1405" width="380" height="80" rx="24" fill="#F8C9D8" />
      <rect x="700" y="1372" width="68" height="128" rx="30" fill="#F7C1D3" />
      <rect x="770" y="1342" width="92" height="74" rx="16" fill="#7B2C4A" />
      <rect x="880" y="1342" width="92" height="74" rx="16" fill="#F6E5C9" />
      <rect x="730" y="1478" width="400" height="22" rx="8" fill="#C07D93" />
    </g>
  </g>
);

/** Mid-row props: the round wooden platform (left) and a striped pouf (right). */
export const SetMid: React.FC = () => (
  <g>
    <g>
      <rect x="-110" y="1546" width="440" height="78" fill="#9C4E22" />
      <ellipse cx="110" cy="1624" rx="220" ry="46" fill="#7E3C18" />
      <ellipse cx="110" cy="1546" rx="220" ry="46" fill="#C86A31" />
      <ellipse cx="110" cy="1546" rx="196" ry="36" fill="none" stroke="#E79A5A" strokeWidth="5" opacity="0.7" />
    </g>
    <g>
      <rect x="900" y="1520" width="150" height="104" rx="18" fill="#F6EBD6" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={910 + i * 28} y="1520" width="12" height="104" fill="#D9A93E" />
      ))}
      <ellipse cx="975" cy="1522" rx="75" ry="16" fill="#FFF6E6" />
    </g>
  </g>
);
