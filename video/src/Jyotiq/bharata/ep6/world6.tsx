import React from "react";

/*
 * भारत Ep6 sets, from the text (Udyoga Parva, Ganguli sec. 179-189):
 *  - Kurukshetra: Parashurama's ascetics camp "on the banks of the stream of Saraswati" (sec. 180); on the field "many Brahmanas
 *    ... ascetics ... as also the gods with Indra at their head, were stationed there ... celestial garlands ... many cloudy
 *    canopies" (sec. 181). The fight runs from sunrise to sunset each day for 23 days; arrows "covering the welkin ... the very
 *    sun could not shed its rays", and a conflagration in the sky (sec. 183).
 *  - Ashram: the forest hermitage where Hotravahana and Akritavrana sit with Amba; Rama arrives at daybreak (sec. 179).
 *  - Tent: "in the solitude of my room ... I laid myself down on my bed" (sec. 186): Bhishma's war tent at night, an oil lamp.
 *  - Sky: Narada with the gods in the sky; the eight brahmanas "like bright stars risen on the firmament" (sec. 188).
 */
const W = 1080;
const H = 1920;
const rnd = (i: number, k = 1) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const W6Defs: React.FC = () => (
  <defs>
    <linearGradient id="k6Dawn" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#3A2A4A" />
      <stop offset="0.38" stopColor="#B8604A" />
      <stop offset="0.6" stopColor="#F2A85A" />
      <stop offset="0.72" stopColor="#FFD9A0" />
    </linearGradient>
    <linearGradient id="k6Day" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#C8763A" />
      <stop offset="0.5" stopColor="#E8A85A" />
      <stop offset="0.72" stopColor="#F6D7A0" />
    </linearGradient>
    <linearGradient id="k6War" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#2A0E0A" />
      <stop offset="0.45" stopColor="#7A2A14" />
      <stop offset="0.7" stopColor="#D8723A" />
    </linearGradient>
    <linearGradient id="k6Dusk" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#1E1430" />
      <stop offset="0.45" stopColor="#6A2A3A" />
      <stop offset="0.7" stopColor="#D0683A" />
    </linearGradient>
    <linearGradient id="k6Ground" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#9A6A3E" />
      <stop offset="1" stopColor="#4A2E18" />
    </linearGradient>
    <linearGradient id="k6Ashram" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#F6D9A0" />
      <stop offset="0.55" stopColor="#E8B878" />
      <stop offset="1" stopColor="#C8905A" />
    </linearGradient>
    <radialGradient id="k6Lamp" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#FFD38A" stopOpacity="0.9" />
      <stop offset="1" stopColor="#FFD38A" stopOpacity="0" />
    </radialGradient>
    <filter id="k6Blur6" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" />
    </filter>
    <filter id="k6Blur24" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="24" />
    </filter>
  </defs>
);

const Cloud: React.FC<{ x: number; y: number; s?: number; c?: string; o?: number }> = ({ x, y, s = 1, c = "#FFE9C8", o = 0.9 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <path d="M-200 30C-210 -10 -170 -40 -130 -26C-120 -70 -60 -84 -30 -50C-10 -96 70 -96 90 -44C130 -66 190 -40 180 4C220 6 230 40 200 50L-190 50C-224 46 -224 30 -200 30Z" fill={c} />
    <path d="M-190 50L200 50C190 34 150 30 120 34C90 22 40 24 10 34C-30 22 -90 22 -120 34C-150 28 -180 34 -190 50Z" fill="#000" opacity={0.08} />
  </g>
);

/** A celestial garland strung between two points (the gods watching, sec. 181). */
const SkyGarland: React.FC<{ x0: number; y0: number; x1: number; y1: number; sag: number; f: number }> = ({ x0, y0, x1, y1, sag, f }) => {
  const n = 22;
  return (
    <g>
      {Array.from({ length: n + 1 }, (_, i) => {
        const u = i / n;
        const x = x0 + (x1 - x0) * u;
        const y = y0 + (y1 - y0) * u + Math.sin(u * Math.PI) * sag + Math.sin(f / 20 + i) * 1.5;
        return <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 9 : 7} fill={i % 3 === 0 ? "#F2C14E" : i % 3 === 1 ? "#FF8A3A" : "#FFF4E0"} />;
      })}
    </g>
  );
};

/** Distant onlookers: rows of small ascetic and brahmana silhouettes (topknots, staffs). */
const Onlookers: React.FC<{ y: number; x0?: number; x1?: number; n?: number; c?: string; s?: number }> = ({ y, x0 = 0, x1 = W, n = 18, c = "#4A2A1A", s = 1 }) => (
  <g fill={c}>
    {Array.from({ length: n }, (_, i) => {
      const x = x0 + ((x1 - x0) * (i + 0.5)) / n + (rnd(i, 3) - 0.5) * 20;
      const h = (60 + rnd(i, 5) * 16) * s;
      return (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path d={`M${-12 * s} 0L${-9 * s} ${-h + 20 * s}L${9 * s} ${-h + 20 * s}L${12 * s} 0Z`} />
          <circle cy={-h + 10 * s} r={9 * s} />
          <circle cy={-h - 2 * s} r={4 * s} />
          {i % 4 === 0 ? <path d={`M${14 * s} 0L${16 * s} ${-h - 10 * s}`} stroke={c} strokeWidth={3 * s} /> : null}
        </g>
      );
    })}
  </g>
);

const Hut: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = "#7A4E2A" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-90 0L-80 -70L80 -70L90 0Z" fill={c} />
    <path d="M-120 -60L0 -150L120 -60Z" fill="#B8904E" />
    <path d="M-120 -60L0 -150L0 -60Z" fill="#8A6A36" opacity={0.6} />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${-110 + i * 30} -62L${-6 + i * 2} -146`} stroke="#6A4E22" strokeWidth={2} opacity={0.5} />)}
    <path d="M-22 0L-22 -50L22 -50L22 0Z" fill="#2A180C" />
  </g>
);

/** Kurukshetra: a wide, bare plain; the Saraswati as a silver band; the ascetics' huts on its bank; onlookers; gods in the sky. */
export const Kurukshetra: React.FC<{ f: number; tod?: "dawn" | "day" | "war" | "dusk"; gods?: number; sunX?: number; horizon?: number; camp?: boolean; crowd?: number }> = ({
  f,
  tod = "dawn",
  gods = 1,
  sunX = 300,
  horizon = 1180,
  camp = true,
  crowd = 1,
}) => {
  const sky = tod === "dawn" ? "url(#k6Dawn)" : tod === "day" ? "url(#k6Day)" : tod === "war" ? "url(#k6War)" : "url(#k6Dusk)";
  const sunY = tod === "dawn" ? horizon - 60 : tod === "day" ? 380 : tod === "war" ? 520 : horizon - 30;
  return (
    <g>
      <rect width={W} height={H} fill={sky} />
      <circle cx={sunX} cy={sunY} r={tod === "day" ? 90 : 120} fill="#FFF2C8" opacity={tod === "war" ? 0.55 : 0.95} />
      <circle cx={sunX} cy={sunY} r={420} fill="#FFC46A" opacity={0.28} filter="url(#k6Blur24)" />
      {gods > 0.01 ? (
        <g opacity={gods}>
          <Cloud x={190} y={300} s={1.2} c="#FFE2C0" o={0.85} />
          <Cloud x={860} y={250} s={1.35} c="#FFE8CC" o={0.85} />
          <Cloud x={560} y={150} s={0.9} c="#FFF0DA" o={0.7} />
          {/* tiny deva silhouettes with halos, looking down from the cloud canopies */}
          {[[130, 290], [210, 286], [290, 292], [790, 236], [870, 230], [950, 238]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <circle cy={-34} r={20} fill="#FFF6D0" opacity={0.7} />
              <circle cy={-34} r={11} fill="#C88A5A" />
              <path d="M-8 -46L0 -60L8 -46Z" fill="#F2C14E" />
              <path d="M-16 0C-14 -16 -8 -24 0 -24C8 -24 14 -16 16 0Z" fill="#C88A5A" />
            </g>
          ))}
          <SkyGarland x0={60} y0={360} x1={420} y1={350} sag={40} f={f} />
          <SkyGarland x0={680} y0={320} x1={1040} y1={330} sag={44} f={f} />
        </g>
      ) : null}
      {/* far tree line and the river */}
      <path d={`M0 ${horizon}C200 ${horizon - 26} 380 ${horizon - 10} 560 ${horizon - 24}C760 ${horizon - 40} 900 ${horizon - 16} 1080 ${horizon - 30}L1080 ${horizon + 10}L0 ${horizon + 10}Z`} fill="#5A3A3A" opacity={0.65} />
      <rect y={horizon} width={W} height={H - horizon} fill="url(#k6Ground)" />
      <path d={`M0 ${horizon + 40}C300 ${horizon + 20} 600 ${horizon + 70} 1080 ${horizon + 34}L1080 ${horizon + 74}C600 ${horizon + 110} 300 ${horizon + 60} 0 ${horizon + 84}Z`} fill="#F2DDB0" opacity={0.75} />
      <path d={`M0 ${horizon + 58}C300 ${horizon + 40} 600 ${horizon + 88} 1080 ${horizon + 52}`} stroke="#FFFFFF" strokeWidth={3} opacity={0.5} fill="none" />
      {camp ? (
        <g opacity={0.9}>
          <Hut x={120} y={horizon + 30} s={0.45} />
          <Hut x={230} y={horizon + 26} s={0.4} />
          <Hut x={900} y={horizon + 24} s={0.42} />
          <path d={`M180 ${horizon + 10}C170 ${horizon - 40} 200 ${horizon - 80} 186 ${horizon - 140}`} stroke="#E8E2D6" strokeWidth={10} opacity={0.35} fill="none" filter="url(#k6Blur6)" />
        </g>
      ) : null}
      {crowd > 0.01 ? (
        <g opacity={crowd}>
          <Onlookers y={horizon + 150} x0={-20} x1={300} n={8} c="#5A341E" s={0.9} />
          <Onlookers y={horizon + 150} x0={780} x1={1100} n={8} c="#5A341E" s={0.9} />
        </g>
      ) : null}
      {/* ground texture: scattered stones, dry grass, chariot ruts */}
      {Array.from({ length: 40 }, (_, i) => (
        <ellipse key={i} cx={rnd(i, 1) * W} cy={horizon + 120 + rnd(i, 2) * (H - horizon - 120)} rx={6 + rnd(i, 3) * 14} ry={3 + rnd(i, 4) * 5} fill="#3A2210" opacity={0.35} />
      ))}
      <path d={`M-40 ${H - 120}C300 ${H - 220} 700 ${H - 260} 1120 ${H - 330}`} stroke="#3A2210" strokeWidth={10} opacity={0.25} fill="none" />
      <path d={`M-40 ${H - 60}C300 ${H - 160} 700 ${H - 200} 1120 ${H - 270}`} stroke="#3A2210" strokeWidth={10} opacity={0.25} fill="none" />
      {Array.from({ length: 16 }, (_, i) => (
        <circle key={`d${i}`} cx={(i * 97 + f * 1.2) % W} cy={horizon + 200 + ((i * 41) % 400)} r={30 + (i % 4) * 16} fill="#C89A6A" opacity={0.08} />
      ))}
    </g>
  );
};

/** The forest hermitage at daybreak: banyan, thatch huts, a yajna kund with smoke, tulsi, a deer-skin seat. */
export const Ashram: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={W} height={H} fill="url(#k6Ashram)" />
    <circle cx={820} cy={520} r={110} fill="#FFF6DA" opacity={0.95} />
    <circle cx={820} cy={520} r={460} fill="#FFE0A0" opacity={0.35} filter="url(#k6Blur24)" />
    {/* far forest */}
    {Array.from({ length: 10 }, (_, i) => (
      <ellipse key={i} cx={-40 + i * 125} cy={1060 + (i % 2) * 20} rx={120} ry={170} fill="#6A7A4A" opacity={0.55} />
    ))}
    {/* banyan on the left: trunk, aerial roots, canopy */}
    <g>
      <ellipse cx={120} cy={520} rx={360} ry={300} fill="#3E5A2E" />
      <ellipse cx={260} cy={420} rx={260} ry={200} fill="#4E6E36" />
      <ellipse cx={20} cy={640} rx={220} ry={160} fill="#34502A" />
      <path d="M90 1400L110 760L210 760L230 1400Z" fill="#5A3E28" />
      {[30, 70, 260, 300, 330].map((x, i) => <path key={i} d={`M${x} 640L${x + 6} ${1300 + (i % 2) * 60}`} stroke="#6A4A30" strokeWidth={6} opacity={0.8} />)}
    </g>
    <Hut x={760} y={1300} s={1.2} />
    <Hut x={1010} y={1260} s={0.85} />
    <rect y={1290} width={W} height={H - 1290} fill="#B8875A" />
    <path d="M0 1290C300 1270 700 1310 1080 1280L1080 1340C700 1360 300 1330 0 1350Z" fill="#9A6E44" opacity={0.6} />
    {/* yajna kund with a thin smoke column */}
    <g transform="translate(560 1420)">
      <path d="M-80 0L80 0L64 -26L-64 -26Z" fill="#8A5A34" />
      <path d="M-64 -26L64 -26L56 -36L-56 -36Z" fill="#A8744A" />
      <path d={`M-20 -34C-24 -70 -6 -80 0 ${-112 - 8 * Math.sin(f / 2.5)}C6 -80 24 -70 20 -34Z`} fill="#FFB23A" />
      <path d={`M-8 -34C-10 -56 -2 -60 0 ${-80 - 6 * Math.sin(f / 2)}C2 -60 10 -56 8 -34Z`} fill="#FFF0B0" />
      <path d={`M0 -120C-20 -220 30 -320 0 -460`} stroke="#E8E2D6" strokeWidth={22} opacity={0.3} fill="none" filter="url(#k6Blur6)" />
    </g>
    {/* tulsi on a platform */}
    <g transform="translate(940 1460)">
      <path d="M-50 0L50 0L44 -70L-44 -70Z" fill="#C88A5A" />
      <path d="M-56 -70L56 -70L56 -84L-56 -84Z" fill="#A8683A" />
      {Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={-24 + (i % 3) * 24} cy={-110 - Math.floor(i / 3) * 26} rx={16} ry={10} fill="#3E6A2E" />)}
    </g>
    {/* deer-skin seat */}
    <path d="M320 1560C340 1530 460 1526 490 1556C500 1576 470 1594 410 1594C350 1594 310 1582 320 1560Z" fill="#B8874E" />
    {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={350 + i * 22} cy={1560 + (i % 2) * 10} r={4} fill="#F4E6C8" />)}
  </g>
);

/** Bhishma's war tent at night: striped canvas, a brass oil lamp, a low cot. */
export const Tent: React.FC<{ f: number; lamp?: number; blue?: number }> = ({ f, lamp = 1, blue = 0 }) => (
  <g>
    <rect width={W} height={H} fill="#140C10" />
    <path d="M0 200L540 40L1080 200L1080 1500L0 1500Z" fill="#3A2420" />
    {Array.from({ length: 9 }, (_, i) => (
      <path key={i} d={`M${i * 135} ${200 - (i <= 4 ? i : 8 - i) * 40}L${i * 135 + 68} ${200 - (i <= 4 ? i + 0.5 : 7.5 - i) * 40}L${i * 135 + 68} 1500L${i * 135} 1500Z`} fill={i % 2 ? "#5A2A24" : "#4A3020"} opacity={0.8} />
    ))}
    <path d="M540 40L540 1500" stroke="#2A1810" strokeWidth={14} />
    <rect y={1500} width={W} height={H - 1500} fill="#2A1A14" />
    <path d="M0 1500L1080 1500" stroke="#5A3A2A" strokeWidth={6} />
    {/* low cot */}
    <path d="M120 1560L960 1560L960 1600L120 1600Z" fill="#6A4228" />
    <path d="M140 1600L150 1700M940 1600L930 1700" stroke="#4A2E1A" strokeWidth={14} />
    <path d="M110 1530C300 1510 760 1510 970 1530L970 1564L110 1564Z" fill="#E8E2D6" />
    <path d="M110 1548C300 1532 760 1532 970 1548" stroke="#C9C2B4" strokeWidth={3} fill="none" />
    {/* lamp */}
    <g transform="translate(880 1440)" opacity={lamp}>
      <circle r={300} fill="url(#k6Lamp)" opacity={0.5 + 0.05 * Math.sin(f / 3)} />
      <path d="M-40 60L40 60L24 20L-24 20Z" fill="#B8862E" />
      <path d="M-50 20C-40 0 40 0 50 20Z" fill="#D9A84A" />
      <path d={`M-8 10C-10 -14 -2 -20 0 ${-38 - 4 * Math.sin(f / 2)}C2 -20 10 -14 8 10Z`} fill="#FFD36A" />
    </g>
    <rect width={W} height={H} fill="#0A1030" opacity={0.25 + 0.3 * blue} />
  </g>
);

/** Night sky over the field, for the dream and for the eight brahmanas "like bright stars". */
export const StarSky: React.FC<{ f: number; o?: number }> = ({ f, o = 1 }) => (
  <g opacity={o}>
    <rect width={W} height={H} fill="#0A0A22" />
    <rect width={W} height={1100} fill="#141436" />
    {Array.from({ length: 90 }, (_, i) => (
      <circle key={i} cx={rnd(i, 7) * W} cy={rnd(i, 8) * 1200} r={1 + rnd(i, 9) * 2.4} fill="#FFFFFF" opacity={0.4 + 0.5 * Math.abs(Math.sin(f / 18 + i))} />
    ))}
  </g>
);

/** Arrows meeting mid-air in sparks (sec. 183: "cut off ... in mid-air"). Two streams, from left and right, meeting at (x, y). */
export const ArrowClash: React.FC<{ f: number; x: number; y: number; n?: number; k?: number }> = ({ f, x, y, n = 14, k = 1 }) => (
  <g opacity={k}>
    {Array.from({ length: n }, (_, i) => {
      const dir = i % 2 ? 1 : -1;
      const u = ((f * 2.2 + i * 17) % 60) / 60;
      const ax = x - dir * (520 - 520 * u);
      const ay = y + (rnd(i, 2) - 0.5) * 360 + dir * (1 - u) * 60;
      return (
        <g key={i} transform={`translate(${ax} ${ay}) rotate(${dir > 0 ? 0 : 180} 0 0)`}>
          <path d="M-90 0L0 0" stroke={dir > 0 ? "#E8E2D2" : "#C88A3A"} strokeWidth={4} />
          <path d="M0 0L-16 -7L-12 0L-16 7Z" fill="#D9DDE3" />
          <path d="M-90 0L-76 -8L-70 0L-76 8Z" fill={dir > 0 ? "#F4F1E8" : "#B3262E"} />
        </g>
      );
    })}
    {Array.from({ length: 10 }, (_, i) => {
      const a = (i / 10) * Math.PI * 2 + f / 9;
      const r = 30 + ((f * 3 + i * 13) % 90);
      return <circle key={`s${i}`} cx={x + Math.cos(a) * r} cy={y + Math.sin(a) * r * 0.7} r={5 + (i % 3) * 2} fill="#FFE7A0" opacity={1 - r / 130} />;
    })}
    <circle cx={x} cy={y} r={70} fill="#FFF0B8" opacity={0.6} filter="url(#k6Blur6)" />
  </g>
);

/** The sky "enveloped by clouds of arrows" (sec. 183): a dark lattice of shafts across the upper frame. */
export const ArrowSky: React.FC<{ f: number; k?: number }> = ({ f, k = 1 }) => (
  <g opacity={k}>
    {Array.from({ length: 70 }, (_, i) => {
      const x = rnd(i, 11) * (W + 200) - 100;
      const y = 120 + rnd(i, 12) * 700;
      const a = i % 2 ? -18 : 198;
      const drift = ((f * 3 + i * 9) % 80) - 40;
      return <path key={i} d="M-60 0L60 0M60 0L48 -6M60 0L48 6" stroke="#2A140C" strokeWidth={3.5} transform={`translate(${x + drift} ${y}) rotate(${a})`} opacity={0.75} />;
    })}
  </g>
);

/** Two Brahma-astras meeting in mid-air (sec. 187): a white-gold sun of fire with rings. */
export const AstraClash: React.FC<{ f: number; x: number; y: number; k?: number }> = ({ f, x, y, k = 1 }) => (
  <g opacity={k}>
    <circle cx={x} cy={y} r={360} fill="#FF9A3A" opacity={0.35} filter="url(#k6Blur24)" />
    <circle cx={x} cy={y} r={150} fill="#FFE7A0" opacity={0.9} filter="url(#k6Blur6)" />
    <circle cx={x} cy={y} r={70} fill="#FFFFFF" />
    {[200, 260, 330].map((r, i) => (
      <circle key={r} cx={x} cy={y} r={r + ((f * 3) % 40)} fill="none" stroke="#FFD36A" strokeWidth={6 - i * 1.5} opacity={0.6 - i * 0.15} />
    ))}
  </g>
);

/** The Prasvapa astra's light: a cool, sleepy blue (it puts the foe to sleep, sec. 186), gathering at (x, y). */
export const PrasvapaGlow: React.FC<{ f: number; x: number; y: number; r?: number; k?: number }> = ({ f, x, y, r = 120, k = 1 }) => (
  <g opacity={k}>
    <circle cx={x} cy={y} r={r * 2.4} fill="#5A7AFF" opacity={0.22} filter="url(#k6Blur24)" />
    <circle cx={x} cy={y} r={r} fill="#9FC0FF" opacity={0.55} filter="url(#k6Blur6)" />
    {Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2 + f / 20;
      return <circle key={i} cx={x + Math.cos(a) * r * 1.3} cy={y + Math.sin(a) * r * 1.3} r={6} fill="#E8F0FF" opacity={0.8} />;
    })}
    <text x={x} y={y + 24} textAnchor="middle" fontSize={r * 0.6} fill="#F4F8FF" opacity={0.85} fontWeight={800}>ॐ</text>
  </g>
);

/** Smoke: the forefathers appear as figures in smoke (drawn behind translucent puppets). */
export const Smoke: React.FC<{ f: number; x: number; y: number; w?: number; h?: number; k?: number }> = ({ f, x, y, w = 600, h = 900, k = 1 }) => (
  <g opacity={k}>
    {Array.from({ length: 14 }, (_, i) => (
      <ellipse
        key={i}
        cx={x + (rnd(i, 21) - 0.5) * w + Math.sin(f / 30 + i) * 20}
        cy={y - rnd(i, 22) * h}
        rx={90 + rnd(i, 23) * 80}
        ry={70 + rnd(i, 24) * 60}
        fill="#E8E2D6"
        opacity={0.16}
        filter="url(#k6Blur24)"
      />
    ))}
  </g>
);
