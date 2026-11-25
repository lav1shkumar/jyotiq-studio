import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Mukta";
import { FPS, TOTAL } from "./timing";

const { fontFamily } = loadFont("normal", { weights: ["500", "700", "800"], subsets: ["devanagari", "latin"] });
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1080;
const H = 1920;

const C = {
  paper: "#ead9b8",
  paper2: "#f3e6c9",
  indigo: "#16213f",
  indigo2: "#243861",
  ink: "#101827",
  brass: "#9b6c2f",
  brass2: "#d0a653",
  cream: "#ffe7bd",
  red: "#ba2d25",
  red2: "#e15638",
  gold: "#f1c05f",
  shadow: "#080c18",
};

const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);
const sec = (s: number) => Math.round(s * FPS);
const wave = (f: number, speed = 1, phase = 0) => Math.sin(f * speed * 0.12 + phase);

type Cap = { a: number; b: number; text: string };
const CAPS: Cap[] = [
  { a: 0.1, b: 5.81, text: "लंका का एक कारीगर सिंहासन की आख़िरी सीढ़ी नाप रहा था।" },
  { a: 5.76, b: 9.01, text: "हर बार नाप अलग आती थी।" },
  { a: 9.01, b: 11.43, text: "उसने कान लगाया।" },
  { a: 11.43, b: 15.0, text: "सोने के नीचे साँस चल रही थी।" },
  { a: 15.0, b: 22.23, text: "लोककथा कहती है कि रावण ने नौ ग्रहों को बंदी बनाकर अपनी सीढ़ियाँ बना ली थीं।" },
  { a: 22.23, b: 26.56, text: "सबसे नीचे शनि थे, मुँह ज़मीन की ओर।" },
  { a: 26.56, b: 32.4, text: "उस दिन रावण दरबार में आया तो कारीगर की डोरी वहीं पड़ी थी।" },
  { a: 32.4, b: 35.73, text: "उसे उठाने के लिए राजा झुका।" },
  { a: 35.73, b: 39.81, text: "उसी पल नीचे से शनि की आँखें उठीं।" },
  { a: 39.81, b: 42.88, text: "कारीगर ने डोरी खींच ली।" },
  { a: 42.88, b: 45.98, text: "अब नाप एकदम ठीक थी।" },
  { a: 45.98, b: 50.83, text: "काँपने वाली चीज़ सीढ़ी नहीं, राजा का हाथ था।" },
];

const Paper: React.FC = () => (
  <>
    <rect width={W} height={H} fill={C.paper} />
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="8" />
      <feColorMatrix type="saturate" values="0" />
      <feComponentTransfer><feFuncA type="table" tableValues="0 0.12" /></feComponentTransfer>
    </filter>
    <rect width={W} height={H} filter="url(#grain)" opacity="0.9" />
    <ellipse cx="180" cy="250" rx="420" ry="360" fill={C.indigo2} opacity="0.13" />
    <ellipse cx="930" cy="1580" rx="520" ry="470" fill={C.indigo} opacity="0.14" />
    <rect width={W} height={H} fill="url(#paperShade)" />
  </>
);

const Defs: React.FC = () => (
  <defs>
    <radialGradient id="paperShade" cx="50%" cy="42%" r="78%">
      <stop offset="0%" stopColor="#fff2cf" stopOpacity="0.12" />
      <stop offset="64%" stopColor="#251a24" stopOpacity="0.02" />
      <stop offset="100%" stopColor="#080c18" stopOpacity="0.34" />
    </radialGradient>
    <linearGradient id="brass" x1="0" x2="1">
      <stop offset="0" stopColor="#6d431e" />
      <stop offset="0.45" stopColor="#d1a453" />
      <stop offset="1" stopColor="#7a4b21" />
    </linearGradient>
    <linearGradient id="indigoWash" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#263f68" />
      <stop offset="1" stopColor="#111a33" />
    </linearGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="8" /></filter>
    <filter id="tinyBlur"><feGaussianBlur stdDeviation="2" /></filter>
  </defs>
);

const Hooks: React.FC<{ f: number }> = ({ f }) => {
  const o = 1 - ramp(f, sec(4.0), sec(5.2));
  if (o <= 0) return null;
  return (
    <g opacity={o}>
      <rect x="82" y="370" width="916" height="310" rx="36" fill="#f4dfb5" opacity="0.88" stroke="#c99b55" strokeWidth="4" />
      <text x="540" y="500" textAnchor="middle" fontFamily={fontFamily} fontWeight="800" fontSize="70" fill={C.ink}>आख़िरी सीढ़ी ने</text>
      <text x="540" y="590" textAnchor="middle" fontFamily={fontFamily} fontWeight="800" fontSize="70" fill={C.red}>आँखें क्यों खोलीं?</text>
      <text x="540" y="646" textAnchor="middle" fontFamily={fontFamily} fontWeight="700" fontSize="28" fill={C.indigo}>एक लोककथा · @ashuanimates</text>
    </g>
  );
};

const Caption: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS;
  const cap = CAPS.find((c) => t >= c.a && t < c.b);
  if (!cap) return null;
  const o = Math.min(ramp(f, sec(cap.a), sec(cap.a + 0.18)), 1 - ramp(f, sec(cap.b - 0.18), sec(cap.b)));
  return (
    <g opacity={o}>
      <rect x="78" y="1460" width="924" height="172" rx="28" fill="#f7ead0" opacity="0.93" stroke="#d7ac65" strokeWidth="3" />
      <text x="540" y="1540" textAnchor="middle" fontFamily={fontFamily} fontWeight="700" fontSize="42" fill={C.ink}>
        {cap.text.length > 39 ? (
          <>
            <tspan x="540">{cap.text.slice(0, cap.text.lastIndexOf(" ", 39))}</tspan>
            <tspan x="540" dy="58">{cap.text.slice(cap.text.lastIndexOf(" ", 39) + 1)}</tspan>
          </>
        ) : cap.text}
      </text>
    </g>
  );
};


const PalaceBackdrop: React.FC<{ f: number }> = ({ f }) => (
  <g opacity="0.72">
    <rect x="92" y="190" width="896" height="1240" rx="26" fill="#16213f" opacity="0.24" />
    {[170, 390, 610, 830].map((x, i) => (
      <g key={x} opacity={i === 1 || i === 2 ? 0.68 : 0.46}>
        <path d={`M${x - 82} 1190 L${x - 82} 520 Q${x} 350 ${x + 82} 520 L${x + 82} 1190`} fill="#111a33" opacity="0.62" stroke="#304566" strokeWidth="7" />
        <path d={`M${x - 52} 1165 L${x - 52} 555 Q${x} 430 ${x + 52} 555 L${x + 52} 1165`} fill="#ead9b8" opacity="0.08" />
        <rect x={x - 96} y="1168" width="192" height="34" rx="8" fill="#513923" opacity="0.32" />
      </g>
    ))}
    <path d="M80 1325 C260 1285 390 1340 540 1308 S830 1280 1000 1330 L1000 1460 L80 1460 Z" fill="#101827" opacity="0.18" />
    {Array.from({ length: 18 }, (_, i) => (
      <circle key={i} cx={110 + i * 51} cy={245 + (i % 5) * 88 + wave(f, 0.12, i) * 8} r={1.8 + (i % 3)} fill="#f5cf79" opacity="0.22" />
    ))}
  </g>
);

const RevealOverlay: React.FC<{ f: number }> = ({ f }) => {
  const enter = ramp(f, sec(35.55), sec(36.25));
  const leave = 1 - ramp(f, sec(42.15), sec(42.88));
  const o = Math.min(enter, leave);
  if (o <= 0) return null;
  const open = ramp(f, sec(35.7), sec(37.25));
  const pulse = 1 + wave(f, 1.3) * 0.035;
  return (
    <g opacity={o}>
      <rect x="0" y="720" width="1080" height="620" fill="#070b16" opacity={0.42 + open * 0.28} />
      <path d="M95 1020 C260 955 810 955 985 1020 L935 1235 C760 1300 320 1300 145 1235 Z" fill="#24150f" stroke="#b4823e" strokeWidth="8" />
      <path d="M145 1075 C330 1022 750 1022 935 1075" fill="none" stroke="#d0a653" strokeWidth="20" opacity="0.55" />
      <g transform={`translate(540 1135) scale(${pulse})`}>
        <ellipse cx="-135" cy="0" rx={95} ry={10 + open * 58} fill="#f5c768" stroke="#3b150e" strokeWidth="6" />
        <ellipse cx="135" cy="0" rx={95} ry={10 + open * 58} fill="#f5c768" stroke="#3b150e" strokeWidth="6" />
        <circle cx="-135" cy="0" r={10 + open * 26} fill={C.red} />
        <circle cx="135" cy="0" r={10 + open * 26} fill={C.red} />
        <circle cx="-143" cy="-12" r={5 + open * 6} fill="#fff3c6" opacity={open} />
        <circle cx="127" cy="-12" r={5 + open * 6} fill="#fff3c6" opacity={open} />
      </g>
      <text x="540" y="905" textAnchor="middle" fontFamily={fontFamily} fontWeight="800" fontSize="44" fill="#f0c66f" opacity={open}>शनि की नज़र उठी</text>
    </g>
  );
};

const Chain: React.FC<{ x: number; y: number; len: number; sway?: number }> = ({ x, y, len, sway = 0 }) => {
  const links = [];
  for (let i = 0; i < len; i++) links.push(<ellipse key={i} cx={x + sway * i * 0.35} cy={y + i * 22} rx="7" ry="11" fill="none" stroke="#76809a" strokeWidth="3" opacity="0.9" transform={`rotate(${i % 2 ? 90 : 0} ${x + sway * i * 0.35} ${y + i * 22})`} />);
  return <>{links}</>;
};

const Orb: React.FC<{ x: number; y: number; r: number; color: string; lit?: number }> = ({ x, y, r, color, lit = 1 }) => (
  <g opacity={lit}>
    <circle cx={x} cy={y} r={r * 1.8} fill={color} opacity="0.14" filter="url(#soft)" />
    <circle cx={x} cy={y} r={r} fill={color} stroke="#f2d58a" strokeWidth="3" />
    <circle cx={x - r * 0.28} cy={y - r * 0.32} r={r * 0.2} fill="#fff0c7" opacity="0.72" />
  </g>
);

const Staircase: React.FC<{ f: number; reveal?: number; dim?: number }> = ({ f, reveal = 0, dim = 0 }) => {
  const orbColors = ["#f2b34c", "#ece7da", "#d95338", "#79a95f", "#d5a63f", "#f0e8d2", "#354d8e", "#73516d", "#69677b"];
  const steps = [];
  for (let i = 0; i < 9; i++) {
    const y = 1355 - i * 103;
    const w = 790 - i * 52;
    const x = 540 - w / 2;
    const lowest = i === 0;
    steps.push(
      <g key={i} opacity={1 - dim * (lowest ? 0.55 : 0)}>
        <path d={`M${x} ${y} L${x + w} ${y} L${x + w - 24} ${y + 72} L${x + 22} ${y + 72} Z`} fill="url(#brass)" stroke="#4a2e1c" strokeWidth="4" />
        <path d={`M${x + 22} ${y + 72} L${x + w - 24} ${y + 72} L${x + w - 34} ${y + 92} L${x + 32} ${y + 92} Z`} fill="#5b351f" opacity="0.9" />
        {!lowest && <Orb x={540} y={y + 38} r={21} color={orbColors[i]} lit={0.72 + 0.18 * wave(f, 0.8, i)} />}
        {lowest && (
          <g opacity={0.5 + reveal * 0.5}>
            <ellipse cx="500" cy={y + 38} rx={17 + reveal * 7} ry={4 + reveal * 12} fill="#f3c15b" />
            <ellipse cx="580" cy={y + 38} rx={17 + reveal * 7} ry={4 + reveal * 12} fill="#f3c15b" />
            <circle cx="500" cy={y + 38} r={4 + reveal * 4} fill={C.red} />
            <circle cx="580" cy={y + 38} r={4 + reveal * 4} fill={C.red} />
          </g>
        )}
      </g>,
    );
  }
  return <g>{steps}</g>;
};

const MeasuringCord: React.FC<{ f: number; tremble?: number; x?: number; y?: number; scale?: number }> = ({ f, tremble = 1, x = 0, y = 0, scale = 1 }) => {
  const dx = wave(f, 1.8) * 6 * tremble;
  const dy = wave(f, 1.2, 2) * 4 * tremble;
  const marks = [];
  for (let i = 0; i < 17; i++) marks.push(<line key={i} x1={180 + i * 44} y1={1112 + (i % 2 ? 6 : -4)} x2={180 + i * 44} y2={1138} stroke={C.cream} strokeWidth={i % 4 === 0 ? 6 : 3} opacity="0.9" />);
  return (
    <g transform={`translate(${x + dx} ${y + dy}) scale(${scale}) rotate(${-6 + wave(f, 1.4) * tremble} 540 1120)`}>
      <path d="M105 1125 C270 1096 410 1135 560 1116 S830 1094 975 1128" fill="none" stroke={C.red} strokeWidth="24" strokeLinecap="round" />
      <path d="M105 1125 C270 1096 410 1135 560 1116 S830 1094 975 1128" fill="none" stroke="#f0d7b5" strokeWidth="3" strokeDasharray="10 34" opacity="0.9" />
      {marks}
    </g>
  );
};

const Metalworker: React.FC<{ f: number; x?: number; y?: number; scale?: number; listen?: number }> = ({ f, x = 0, y = 0, scale = 1, listen = 0 }) => {
  const lean = 10 + listen * 18 + wave(f, 0.5) * 1.2;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale}) rotate(${lean} 320 850)`}>
      <path d="M230 915 C190 1010 185 1135 242 1220 C320 1265 410 1225 430 1135 C450 1040 405 945 345 900 Z" fill="url(#indigoWash)" stroke="#080d1b" strokeWidth="5" />
      <circle cx="325" cy="830" r="72" fill={C.cream} stroke="#3a241c" strokeWidth="5" />
      <path d="M260 815 C280 748 365 742 392 810 C360 790 310 790 260 815" fill="#16111a" />
      <circle cx="355" cy="840" r="7" fill="#141824" />
      <path d="M332 875 Q354 890 377 874" fill="none" stroke="#3b211b" strokeWidth="5" strokeLinecap="round" />
      <path d="M390 960 C460 982 505 1035 535 1096" fill="none" stroke={C.cream} strokeWidth="35" strokeLinecap="round" />
      <path d="M232 1165 C150 1205 120 1285 132 1358" fill="none" stroke="#111a33" strokeWidth="48" strokeLinecap="round" />
    </g>
  );
};

const Ravana: React.FC<{ f: number; x?: number; y?: number; scale?: number; bend?: number; tremble?: number }> = ({ f, x = 0, y = 0, scale = 1, bend = 0, tremble = 0 }) => {
  const sh = wave(f, 2.2) * tremble * 6;
  return (
    <g transform={`translate(${x + sh} ${y}) scale(${scale}) rotate(${bend * 24} 610 930)`}>
      <path d="M560 900 C520 1000 515 1170 575 1305 L705 1305 C750 1168 742 1015 700 900 Z" fill="#3a1d23" stroke="#0b0b12" strokeWidth="6" />
      <path d="M575 950 L710 1220" stroke={C.red2} strokeWidth="46" opacity="0.95" />
      <circle cx="635" cy="810" r="74" fill="#be7c4d" stroke="#2a1213" strokeWidth="5" />
      <path d="M570 795 L590 715 L610 780 L635 690 L660 780 L684 715 L700 795 Z" fill={C.gold} stroke="#5b3516" strokeWidth="5" />
      {[-52, -25, 0, 25, 52].map((dx, i) => <circle key={i} cx={635 + dx} cy={778 - Math.abs(dx) * 0.25} r="18" fill="#be7c4d" stroke="#2a1213" strokeWidth="3" />)}
      <circle cx="612" cy="820" r="7" fill="#140f16" /><circle cx="660" cy="820" r="7" fill="#140f16" />
      <path d="M610 852 Q635 868 662 851" fill="none" stroke="#2a1213" strokeWidth="5" strokeLinecap="round" />
      <path d="M545 985 C475 1035 455 1105 468 1185" fill="none" stroke="#be7c4d" strokeWidth="38" strokeLinecap="round" />
      <path d="M718 982 C795 1038 825 1112 812 1195" fill="none" stroke="#be7c4d" strokeWidth="38" strokeLinecap="round" />
    </g>
  );
};

const Lamps: React.FC<{ f: number }> = ({ f }) => (
  <g opacity="0.9">
    {[180, 900].map((x, i) => (
      <g key={x} transform={`translate(${x} 1320)`}>
        <path d="M-45 38 Q0 70 45 38 L28 75 L-28 75 Z" fill="url(#brass)" />
        <ellipse cx="0" cy="0" rx={20 + wave(f, 1.5, i) * 2} ry={38 + wave(f, 1.2, i) * 4} fill="#f59b31" opacity="0.82" filter="url(#tinyBlur)" />
        <ellipse cx="0" cy="10" rx="9" ry="20" fill="#ffe38b" />
      </g>
    ))}
  </g>
);

const SceneFrame: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS;
  const reveal = ramp(f, sec(35.5), sec(37.3));
  let cam = "scale(1) translate(0 0)";
  let content: React.ReactNode = null;
  if (t < 9) {
    const z = interpolate(f, [0, sec(9)], [1.04, 1.16], clamp);
    cam = `scale(${z}) translate(${interpolate(f, [0, sec(9)], [0, -35], clamp)} ${interpolate(f, [0, sec(9)], [0, -95], clamp)})`;
    content = <><Staircase f={f} dim={0.15} /><MeasuringCord f={f} tremble={1} /><Metalworker f={f} x={-75} y={130} scale={0.72} /></>;
  } else if (t < 15) {
    const z = interpolate(f, [sec(9), sec(15)], [1.12, 1.28], clamp);
    cam = `scale(${z}) translate(-190 -210)`;
    content = <><Staircase f={f} dim={0.25} /><Metalworker f={f} x={120} y={90} scale={0.82} listen={1} /><MeasuringCord f={f} tremble={0.35} x={20} y={-18} /></>;
  } else if (t < 26.56) {
    const z = interpolate(f, [sec(15), sec(26.5)], [1.02, 1.12], clamp);
    cam = `scale(${z}) translate(0 ${interpolate(f, [sec(15), sec(26.5)], [30, -60], clamp)})`;
    content = <><Chain x={180} y={110} len={16} sway={wave(f, 0.3)} /><Chain x={900} y={90} len={17} sway={wave(f, 0.3, 2)} /><Staircase f={f} dim={0.12} /><Ravana f={f} x={-10 + ramp(f, sec(17), sec(25.5)) * 75} y={210 - ramp(f, sec(17), sec(25.5)) * 115} scale={0.63} /></>;
  } else if (t < 35.73) {
    const z = interpolate(f, [sec(26.56), sec(35.7)], [1.1, 1.28], clamp);
    cam = `scale(${z}) translate(${-80 - ramp(f, sec(32), sec(35)) * 90} ${-120 - ramp(f, sec(32), sec(35)) * 120})`;
    content = <><Staircase f={f} dim={0.2} /><MeasuringCord f={f} tremble={0.2} x={12} y={8} /><Ravana f={f} x={-35} y={135} scale={0.75} bend={ramp(f, sec(32.1), sec(34.7))} /></>;
  } else if (t < 42.88) {
    const z = interpolate(f, [sec(35.73), sec(42.8)], [1.28, 1.42], clamp);
    cam = `scale(${z}) translate(-155 -260)`;
    content = <><Staircase f={f} reveal={reveal} dim={0.25} /><Ravana f={f} x={-45} y={120} scale={0.76} bend={1} tremble={ramp(f, sec(37), sec(41))} /><MeasuringCord f={f} tremble={0.05} x={10} y={18} /></>;
  } else {
    const z = interpolate(f, [sec(42.88), sec(53.4)], [1.22, 1.12], clamp);
    cam = `scale(${z}) translate(-70 -120)`;
    content = <><Staircase f={f} reveal={1} dim={0.15} /><MeasuringCord f={f} tremble={0} x={0} y={10} /><Ravana f={f} x={-50} y={135} scale={0.73} bend={1} tremble={1} /></>;
  }
  return <g transform={cam}><PalaceBackdrop f={f} />{content}</g>;
};

export const AshuNineStepsReel: React.FC<{ showCaptions?: boolean }> = ({ showCaptions = true }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <Defs />
        <Paper />
        <SceneFrame f={f} />
        <RevealOverlay f={f} />
        <Lamps f={f} />
        <Hooks f={f} />
        {showCaptions ? <Caption f={f} /> : null}
        <text x="46" y="78" fontFamily={fontFamily} fontWeight="800" fontSize="30" fill={C.ink} opacity="0.78">@ashuanimates</text>
        <text x="1034" y="78" textAnchor="end" fontFamily={fontFamily} fontWeight="700" fontSize="25" fill={C.ink} opacity="0.55">लोककथा</text>
        {f > TOTAL - 95 && (
          <g opacity={ramp(f, TOTAL - 95, TOTAL - 65)}>
            <rect x="210" y="1710" width="660" height="86" rx="43" fill={C.indigo} opacity="0.9" />
            <text x="540" y="1766" textAnchor="middle" fontFamily={fontFamily} fontWeight="800" fontSize="36" fill="#ffe7bd">कहानी कैसी लगी? · @ashuanimates</text>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
