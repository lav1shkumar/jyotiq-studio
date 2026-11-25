import React from "react";
import { AbsoluteFill, Audio, Easing, Img, staticFile, useCurrentFrame } from "remotion";
import { AppStoreButton, PlayButton } from "../../katha/reelKit";
import { Puppet, RigDefs, blinkAt, idle, pose, type Pose, type Who } from "../../manthan/rig";
import { SetDefs } from "../../manthan/sets";
import { Cam, Flash, lerp, outBack, outCubic, prog } from "../../navagraha/ep1/anim";
import { BRAND, GRAD, HookPlate, JAKARTA, MUKTA, PLAYFAIR, Presents, ROZHA, S, TwoTone, gradText, type Part } from "../../navagraha/ep1/look";
import { NvDefs } from "../../navagraha/ep1/world";
import { N2Defs } from "../../navagraha/ep2/anim2";
import { ChDefs } from "../../chhath/world";
import { BhDefs } from "../ep1/world";
import { Vasu } from "../ep1/cast";
import { W5Defs } from "../ep5/world5";
import { Kanya } from "../ep5/kunti";
import { AKRITAVRANA, AMBA6, BHISHMA6, BhishmaKavach, Bow6, NARADA, PARASHURAMA, PITRI, Parashu, Ratha, Veena } from "./cast6";
import { BEATS, ENV, PHRASES, TOTAL, WORDS } from "./timing";
import { ArrowClash, ArrowSky, Ashram, AstraClash, Kurukshetra, PrasvapaGlow, Smoke, StarSky, Tent, W6Defs } from "./world6";

/*
 * भारत · BHARATA Episode 6 · गुरु से युद्ध (Bhishma vs Parashurama, Udyoga Parva, Ganguli sec. 179-189).
 * Built on the approved storyboard (Board6.tsx), now on the voice clock (timing.ts from mahabharat-ep6/tools/vo_prep.py).
 * Ayush 25 Nov: fewer captions (Manthan-style short caption chunks only; no name chips or fact chips), the new zodiac-wheel
 * logo (logo-zodiac.png) in the brand bug and the end card, voice and score fully synced, directed-film camera.
 * On screen besides captions: the hook card for the first ~2 s, the title, a small day counter during the fight, the close.
 */
export const BHARATA6_TOTAL = TOTAL;
const W = 1080;
const H = 1920;
const P = PHRASES;
const A = (i: number) => P[i].a;
const B = (i: number) => P[i].b;
const cue = (p: number, w: string) => (WORDS.find((x) => x.p === p && x.w.startsWith(w)) ?? WORDS.find((x) => x.p === p)!).a;
const pt = (t: string, hi = false): Part => ({ t, hi });

/* cuts */
const C = {
  h1: A(1) - 2,
  h2: A(3) - 3,
  h3: A(5) - 3,
  h4: A(7) - 3,
  title: BEATS.title[0],
  intro: BEATS.title[1],
  plea: A(12) - 3,
  field: BEATS.march[0],
  refuse: A(16) - 3,
  war: BEATS.conch[0],
  hit: A(21) - 3,
  tent: BEATS.fall[1],
  dream: A(25) - 3,
  d23: BEATS.astra[1] - 6,
  narada: A(30) - 3,
  halt: A(32) - 3,
  admit: A(34) - 3,
  vow: A(37) - 3,
  alone: BEATS.vow[1],
  feature: BEATS.seed[1],
  end: B(45) + 10,
};
const K = {
  bhishma0: A(0),
  vadh: cue(2, "वध"),
  ikkis: cue(6, "इक्कीस"),
  bhishmaBorn: A(8),
  conch: BEATS.conch[0] + 4,
  day10: A(19),
  day20: A(20),
  laga: cue(21, "लगा"),
  gir: A(22),
  vasu: A(24),
  prasvap: A(26),
  chadhaya: cue(28, "चढ़ाया"),
  ruko: A(30),
  ruk: A(32),
  pitri: cue(33, "पितरों"),
  mrityu: A(38),
  kaun: A(41),
};

/* ------------------------------------------------------------------ */
/* Motion helpers                                                      */
/* ------------------------------------------------------------------ */

const talk = (f: number, who: string) => {
  const ph = P.find((x) => f >= x.a - 1 && f <= x.b + 1);
  if (!ph || ph.who !== who) return 0;
  const e = (i: number) => ENV[Math.max(0, Math.min(ENV.length - 1, i))] ?? 0;
  return Math.min(1, ((e(f - 1) + 2 * e(f) + e(f + 1)) / 4) * 1.25);
};
type KP = [number, Partial<Pose>];
const EASE = Easing.inOut(Easing.cubic);
const kp = (f: number, keys: KP[]): Partial<Pose> => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [fa, a] = keys[i];
    const [fb, b] = keys[i + 1];
    if (f < fb) {
      const u = EASE((f - fa) / Math.max(1, fb - fa));
      const out: Record<string, number> = {};
      new Set([...Object.keys(a), ...Object.keys(b)]).forEach((k) => {
        const va = (a as Record<string, number>)[k];
        const vb = (b as Record<string, number>)[k];
        out[k] = lerp(va ?? vb, vb ?? va, u);
      });
      return out as Partial<Pose>;
    }
  }
  return keys[keys.length - 1][1];
};
/** Head lags the body by a few frames (smoother, more human). */
const kpo = (f: number, keys: KP[], lag = 4): Partial<Pose> => {
  const body = kp(f, keys);
  const late = kp(f - lag, keys);
  const out: Partial<Pose> = { ...body };
  (["head", "lookX", "lookY"] as const).forEach((k) => {
    const v = late[k] ?? body[k];
    if (v !== undefined) out[k] = v;
  });
  return out;
};
const kn = (f: number, keys: [number, number][]): number => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (f < keys[i + 1][0]) return lerp(keys[i][1], keys[i + 1][1], EASE((f - keys[i][0]) / Math.max(1, keys[i + 1][0] - keys[i][0])));
  }
  return keys[keys.length - 1][1];
};

type ManArgs = { f: number; id: string; x: number; y: number; s: number; facing?: number; o?: Partial<Pose>; prop?: React.ReactNode; backProp?: React.ReactNode; k?: number };
const Man: React.FC<ManArgs & { who: Who }> = ({ f, id, who, x, y, s, facing = 1, o = {}, prop, backProp, k = 1 }) => (
  <Puppet id={id} who={who} at={{ x, y, s, facing }} p={pose({ ...idle(id, f, k), blink: blinkAt(id, f), ...o })} t={f} prop={prop} backProp={backProp} />
);
const Rama: React.FC<ManArgs> = (a) => <Man {...a} who={PARASHURAMA} o={{ talk: talk(a.f, "rama"), ...(a.o ?? {}) }} />;
const Bhishma: React.FC<ManArgs & { armour?: boolean }> = ({ armour = true, ...a }) => {
  const ps = pose({ ...idle(a.id, a.f, a.k ?? 1), blink: blinkAt(a.id, a.f), talk: talk(a.f, "bhishma"), ...(a.o ?? {}) });
  return (
    <g>
      <Puppet id={a.id} who={BHISHMA6} at={{ x: a.x, y: a.y, s: a.s, facing: a.facing ?? 1 }} p={ps} t={a.f} prop={a.prop} backProp={a.backProp} />
      {armour ? <BhishmaKavach x={a.x} y={a.y} s={a.s} facing={a.facing ?? 1} p={ps} /> : null}
    </g>
  );
};
const Car: React.FC<{ f: number; x: number; y: number; s: number; facing: number; metal: "silver" | "gold"; part?: "all" | "back" | "front"; umbrella?: boolean }> = ({ f, x, y, s, facing, metal, part = "all", umbrella }) => (
  <g transform={`translate(${x} ${y})`}>
    <Ratha f={f} s={s} facing={facing} metal={metal} banner={metal === "silver" ? "palm" : "sunmoon"} umbrella={umbrella ?? metal === "silver"} part={part} />
  </g>
);

const Vignette: React.FC<{ o?: number; c?: string }> = ({ o = 0.55, c = "#0A0612" }) => (
  <g opacity={o}>
    <radialGradient id={`e6Vig${c.slice(1)}`} cx="0.5" cy="0.5" r="0.75">
      <stop offset="0.55" stopColor={c} stopOpacity="0" />
      <stop offset="1" stopColor={c} stopOpacity="0.9" />
    </radialGradient>
    <rect width={W} height={H} fill={`url(#e6Vig${c.slice(1)})`} />
  </g>
);
const Grey: React.FC<{ k: number }> = ({ k }) => (k > 0.01 ? <rect width={W} height={H} fill="#808080" opacity={k} style={{ mixBlendMode: "saturation" }} /> : null);
const FireGlow: React.FC<{ x: number; y: number; r?: number; o?: number }> = ({ x, y, r = 420, o = 0.35 }) => <circle cx={x} cy={y} r={r} fill="#FF7A2A" opacity={o} filter="url(#k6Blur24)" />;
const Dust: React.FC<{ f: number; y?: number; o?: number }> = ({ f, y = 1500, o = 0.14 }) => (
  <g>
    {Array.from({ length: 12 }, (_, i) => (
      <circle key={i} cx={(i * 113 + f * 2.4) % (W + 200) - 100} cy={y + ((i * 47) % 300)} r={50 + (i % 4) * 22} fill="#C89A6A" opacity={o} />
    ))}
  </g>
);

/* ================================================================== */
/* Scenes                                                              */
/* ================================================================== */

const ROAR: Partial<Pose> = { sF: 118, eF: 28, wF: 0, sB: 30, eB: 50, lean: 4, head: -4, brow: 0.9, browTilt: 12, smile: -0.6, glow: 0.8, lookX: 1, fist: 1 };

/** "भीष्म!": Parashurama on the plain at dawn, the parashu raised; the gods watch from the clouds. */
const HookWide: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={0} b={C.h1} cx={560} cy={900} s0={1.0} s1={1.1} hits={[K.bhishma0]} amp={10}>
    <Kurukshetra f={f} tod="dawn" sunX={760} gods={0.6} />
    <FireGlow x={540} y={900} r={520} o={0.28 + 0.05 * Math.sin(f / 5)} />
    <Rama f={f} id="h0" x={560} y={1520} s={2.3} facing={-1} o={{ ...ROAR, glow: 0.6 + 0.3 * Math.sin(f / 4) }} k={0.5} prop={<Parashu s={0.72} glow={0.7 + 0.3 * Math.sin(f / 4)} />} backProp={<Bow6 s={0.9} rot={8} />} />
    <Dust f={f} />
    <Vignette o={0.55} c="#2A0A06" />
  </Cam>
);

/** "अंबा को अपनाओ… वरना आज तुम्हारा वध होगा।": close; on "वध" the axe comes up. */
const HookClose: React.FC<{ f: number }> = ({ f }) => {
  const keys: KP[] = [
    [C.h1, { sF: 46, eF: 100, wF: -10, lean: 2, head: -2, brow: 0.7, browTilt: 10, smile: -0.4, glow: 0.4, lookX: 1, fist: 1 }],
    [K.vadh - 6, { sF: 52, eF: 96, wF: -10, lean: 4, head: -4, brow: 0.8, browTilt: 12, smile: -0.5, glow: 0.5, lookX: 1, fist: 1 }],
    [K.vadh + 4, { sF: 96, eF: 50, wF: 0, lean: 7, head: -7, brow: 1, browTilt: 14, smile: -0.7, glow: 1, lookX: 1, fist: 1 }],
  ];
  return (
    <Cam f={f} a={C.h1} b={C.h2} cx={560} cy={800} s0={1.02} s1={1.14} hits={[K.vadh]} amp={12}>
      <Kurukshetra f={f} tod="dawn" sunX={300} gods={0.4} />
      <FireGlow x={600} y={800} o={0.3 + 0.2 * prog(f, K.vadh - 4, K.vadh + 6)} />
      <Rama f={f} id="h1" x={560} y={1760} s={2.6} facing={-1} o={kpo(f, keys)} k={0.5} prop={<Parashu s={0.66} glow={0.4 + 0.6 * prog(f, K.vadh - 4, K.vadh + 6)} rot={-8} />} />
      <Vignette o={0.5} c="#2A0A06" />
    </Cam>
  );
};

/** "गुरुदेव… डर से मैं अपना वचन नहीं तोड़ूँगा।": Bhishma in white on the silver car, bow lowered, unmoved. */
const BhishmaCar: React.FC<{ f: number }> = ({ f }) => {
  const keys: KP[] = [
    [C.h2, { sF: 18, eF: 30, sB: -10, eB: 14, head: 6, lookX: 0.6, lookY: 0.2, brow: 0.1 }],
    [C.h2 + 14, { sF: 18, eF: 30, sB: -10, eB: 14, head: 1, lookX: 1, lookY: 0, brow: 0.2 }],
    [C.h3, { sF: 22, eF: 34, sB: -6, eB: 16, head: -1, lookX: 1, brow: 0.35, browTilt: 4 }],
  ];
  return (
    <Cam f={f} a={C.h2} b={C.h3} cx={470} cy={1000} s0={1.0} s1={1.12}>
      <Kurukshetra f={f} tod="dawn" sunX={820} gods={0.5} />
      <Car f={f} x={460} y={1700} s={1.25} facing={1} metal="silver" part="back" />
      <Bhishma f={f} id="b2" x={430} y={1330} s={1.45} facing={1} o={kpo(f, keys)} k={0.4} prop={<Bow6 s={0.85} white />} />
      <Car f={f} x={460} y={1700} s={1.25} facing={1} metal="silver" part="front" />
      <Dust f={f} y={1600} o={0.1} />
      <Vignette o={0.45} c="#1A0A10" />
    </Cam>
  );
};

/** "मुझे ललकारोगे? मैंने इक्कीस बार…": the war sky; the axe goes overhead on "इक्कीस" with thunder. */
const RamaRoar: React.FC<{ f: number }> = ({ f }) => {
  const keys: KP[] = [
    [C.h3, { ...ROAR, sF: 70, eF: 70, glow: 0.5, talk: 0 }],
    [K.ikkis - 8, { ...ROAR, sF: 84, eF: 60, glow: 0.7 }],
    [K.ikkis + 4, { ...ROAR, sF: 150, eF: 12, glow: 1, lean: 7, head: -8 }],
  ];
  const bolt = prog(f, K.ikkis, K.ikkis + 2) * (1 - prog(f, K.ikkis + 3, K.ikkis + 10));
  return (
    <Cam f={f} a={C.h3} b={C.h4} cx={480} cy={800} s0={1.04} s1={1.12} hits={[K.ikkis]} amp={16}>
      <Kurukshetra f={f} tod="war" sunX={540} gods={0} crowd={0} camp={false} />
      <FireGlow x={540} y={700} r={600} o={0.4 + 0.15 * Math.sin(f / 3)} />
      {bolt > 0 ? <path d="M820 0L760 220L800 230L700 520L760 530L640 860" stroke="#FFF6E0" strokeWidth={8} fill="none" opacity={bolt} /> : null}
      <Rama f={f} id="h3" x={470} y={1700} s={2.4} facing={1} o={{ ...kpo(f, keys), talk: talk(f, "rama") }} k={0.6} prop={<Parashu s={0.5} glow={1} />} />
      <Vignette o={0.6} c="#1A0404" />
    </Cam>
  );
};

/** "तब… भीष्म पैदा नहीं हुआ था।": close on Bhishma; the white bow comes up as he says his own name. */
const BhishmaReply: React.FC<{ f: number }> = ({ f }) => {
  const keys: KP[] = [
    [C.h4, { sF: 20, eF: 30, sB: -4, eB: 20, head: 2, brow: 0.3, smile: 0.05, lookX: 1 }],
    [K.bhishmaBorn - 4, { sF: 26, eF: 34, sB: -4, eB: 20, head: 0, brow: 0.4, browTilt: 4, smile: 0.15, lookX: 1 }],
    [K.bhishmaBorn + 14, { sF: 70, eF: 50, sB: -4, eB: 20, head: -3, brow: 0.55, browTilt: 7, smile: 0.2, lookX: 1 }],
  ];
  return (
    <Cam f={f} a={C.h4} b={C.title} cx={520} cy={900} s0={1.02} s1={1.16}>
      <Kurukshetra f={f} tod="dawn" sunX={260} gods={0} crowd={0} />
      <circle cx={540} cy={820} r={520} fill="#FFF4E0" opacity={0.25} filter="url(#k6Blur24)" />
      <Bhishma f={f} id="h4" x={520} y={1760} s={2.9} facing={1} o={kpo(f, keys)} k={0.4} prop={<Bow6 s={0.9} white />} />
      <Vignette o={0.5} c="#10080A" />
    </Cam>
  );
};

const TitleWorld: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={W} height={H} fill="#140806" />
    <circle cx={540} cy={820} r={760} fill="#4A1A08" opacity={0.85} filter="url(#k6Blur24)" />
    <g opacity={0.55} transform={`translate(${-20 * prog(f, C.title, C.intro)} 0)`}>
      <Car f={f} x={300} y={1700} s={0.9} facing={1} metal="silver" umbrella={false} />
    </g>
    <g opacity={0.55} transform={`translate(${20 * prog(f, C.title, C.intro)} 0)`}>
      <Car f={f} x={800} y={1700} s={0.9} facing={-1} metal="gold" />
    </g>
    <path d="M0 1500C300 1460 700 1540 1080 1480L1080 1920L0 1920Z" fill="#200A06" />
  </g>
);

/** "पर ये हुआ क्यों? …वो परशुराम के पास गई।": the hermitage; Parashurama strides in with his disciples' friend Akritavrana. */
const AshramWide: React.FC<{ f: number }> = ({ f }) => {
  const walk = prog(f, C.intro + 4, C.intro + 40, Easing.out(Easing.cubic));
  return (
    <Cam f={f} a={C.intro} b={C.plea} cx={540} cy={1200} s0={1.06} s1={1.0}>
      <Ashram f={f} />
      <Man f={f} id="ak5" who={AKRITAVRANA} x={160} y={1560} s={1.0} facing={1} o={{ sF: 20, eF: 40, smile: 0.1, lookX: 1 }} k={0.5} />
      <Rama f={f} id="r5" x={lerp(1000, 760, walk)} y={1560 + Math.abs(Math.sin(walk * Math.PI * 4)) * -8 * (1 - walk)} s={1.3} facing={-1} o={{ sF: 20, eF: 30, sB: -8, eB: 10, lookX: 1, brow: 0.3 }} prop={<Bow6 s={0.75} />} backProp={<Parashu s={0.8} rot={-6} />} />
      <Kanya pal={AMBA6} id="a5" f={f} x={420} y={1800} s={0.95} crown="none" plain hands={[[-14, -520], [14, -520]]} lookX={lerp(0.2, 0.7, walk)} lookY={-0.2} smile={-0.5} sad={0.9} tears={0.5} tilt={4} />
      <Vignette o={0.3} c="#3A1A08" />
    </Cam>
  );
};

/** "भगवन्… भीष्म ने मेरा जीवन उजाड़ दिया। न्याय कीजिए।": Amba on her knees; he looks down at her. */
const AmbaPlea: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.plea} b={C.field} cx={420} cy={1100} s0={1.0} s1={1.14}>
    <Ashram f={f} />
    <Rama f={f} id="r6" x={780} y={1700} s={1.9} facing={-1} o={{ sF: 40, eF: 70, wF: -10, lookX: 1, lookY: 0.5, brow: 0.4 + 0.3 * prog(f, A(13), A(14)), browTilt: lerp(-4, 8, prog(f, A(13), A(14))), smile: -0.2 }} k={0.4} backProp={<Parashu s={0.8} rot={-6} />} />
    <Kanya pal={AMBA6} id="a6" f={f} x={360} y={2060} s={1.3} crown="none" plain hands={[[-14, -520], [14, -520]]} lookX={0.7} lookY={-0.6} smile={-0.6} sad={1} tears={0.6 + 0.4 * prog(f, A(13), A(14))} tilt={-6} lean={6} speak={talk(f, "amba")} />
    <Vignette o={0.35} c="#3A1A08" />
  </Cam>
);

/** Kurukshetra at dawn: Bhishma steps down, folds his hands and bows: "आशीर्वाद दीजिए, गुरुदेव।" */
const Blessing: React.FC<{ f: number }> = ({ f }) => {
  const bow: KP[] = [
    [C.field, { lean: 0, head: 0, sF: 14, eF: 20, sB: -8, eB: 12, lookX: 1, lookY: 0.2, blink: 0, smile: 0.1 }],
    [A(15) - 8, { lean: 2, head: 4, sF: 40, eF: 80, sB: 36, eB: 80, lookX: 1, lookY: 0.4, smile: 0.1 }],
    [A(15) + 10, { lean: 16, head: 18, sF: 62, eF: 118, wF: 10, sB: 58, eB: 118, wB: 10, lookX: 0.5, lookY: 0.9, blink: 0.85, smile: 0.15 }],
  ];
  return (
    <Cam f={f} a={C.field} b={C.refuse} cx={560} cy={1000} s0={1.08} s1={1.0}>
      <Kurukshetra f={f} tod="dawn" sunX={540} gods={0.8} />
      <Car f={f} x={150} y={1640} s={0.9} facing={1} metal="silver" />
      <Rama f={f} id="r7" x={760} y={1400} s={1.35} facing={-1} o={{ sF: 50, eF: 60, wF: -20, lookX: 1, lookY: 0.6, smile: 0.1, brow: 0.2 }} k={0.4} prop={<Bow6 s={0.8} />} />
      <Bhishma f={f} id="b7" x={420} y={1420} s={1.25} facing={1} o={kpo(f, bow)} k={0.3} armour={false} />
      <Vignette o={0.4} c="#1A0A10" />
    </Cam>
  );
};

/** "विजयी भव नहीं कहूँगा… आज मैं तुम्हें हराने आया हूँ।": he steps back to his golden car; Akritavrana at the reins. */
const Refusal: React.FC<{ f: number }> = ({ f }) => {
  const keys: KP[] = [
    [C.refuse, { sF: 40, eF: 70, wF: -20, lookX: 1, brow: 0.4, browTilt: 4, smile: 0.05 }],
    [A(17), { sF: 60, eF: 80, wF: -30, lookX: 1, brow: 0.6, browTilt: 8, smile: 0.15 }],
    [B(17), { sF: 80, eF: 40, wF: -10, lookX: 1, brow: 0.8, browTilt: 12, smile: 0.1, glow: 0.4 }],
  ];
  return (
    <Cam f={f} a={C.refuse} b={C.war} cx={600} cy={1000} s0={1.0} s1={1.12}>
      <Kurukshetra f={f} tod="dawn" sunX={300} gods={0.6} />
      <Car f={f} x={860} y={1640} s={0.95} facing={-1} metal="gold" part="back" />
      <Man f={f} id="ak8" who={AKRITAVRANA} x={900} y={1400} s={0.8} facing={-1} o={{ sF: 60, eF: 70, lookX: 1 }} k={0.5} />
      <Car f={f} x={860} y={1640} s={0.95} facing={-1} metal="gold" part="front" />
      <Rama f={f} id="r8" x={600} y={1720} s={2.2} facing={-1} o={kpo(f, keys)} k={0.4} prop={<Bow6 s={0.9} />} />
      <Vignette o={0.45} c="#1A0A06" />
    </Cam>
  );
};

/** The duel: two cars, arrows cut down in mid-air, the day counter climbing: "एक दिन… दस दिन… बीस दिन…" */
const Duel: React.FC<{ f: number }> = ({ f }) => {
  const d1 = 0.55 + 0.4 * Math.abs(Math.sin(f / 9));
  const d2 = 0.55 + 0.4 * Math.abs(Math.sin(f / 9 + 1.3));
  const tod = f < K.day10 ? "dawn" : f < K.day20 ? "day" : "war";
  return (
    <Cam f={f} a={C.war} b={C.hit} cx={540} cy={1200} s0={1.12} s1={1.0} dx={-30} hits={[K.conch, K.day10, K.day20]} amp={8}>
      <Kurukshetra f={f} tod={tod} sunX={lerp(200, 880, prog(f, C.war, C.hit, Easing.linear))} gods={0.9} horizon={1120} />
      <ArrowSky f={f} k={0.3 + 0.5 * prog(f, C.war, C.hit)} />
      <Car f={f} x={230} y={1720} s={0.95} facing={1} metal="silver" part="back" />
      <Bhishma f={f} id="b9" x={210} y={1440} s={1.05} facing={1} o={{ sF: 92, eF: 0, sB: 86, eB: 90 + 35 * d1, lookX: 1, brow: 0.6, browTilt: 8 }} k={0.3} prop={<Bow6 s={0.8} white draw={d1} arrow={1} />} />
      <Car f={f} x={230} y={1720} s={0.95} facing={1} metal="silver" part="front" />
      <Car f={f} x={860} y={1720} s={0.95} facing={-1} metal="gold" part="back" />
      <Rama f={f} id="r9" x={880} y={1440} s={1.05} facing={-1} o={{ sF: 92, eF: 0, sB: 86, eB: 90 + 35 * d2, lookX: 1, brow: 0.8, browTilt: 12, glow: 0.4 }} k={0.3} prop={<Bow6 s={0.8} draw={d2} arrow={1} />} />
      <Car f={f} x={860} y={1720} s={0.95} facing={-1} metal="gold" part="front" />
      <ArrowClash f={f} x={545} y={1080} n={16} />
      <Dust f={f} y={1560} o={0.12} />
      <Vignette o={0.35} c="#2A0A06" />
    </Cam>
  );
};

/** "फिर परशुराम का बाण भीष्म की छाती में लगा… और वो गिर पड़े।": the arrow strikes on "लगा"; he topples from the car. */
const Struck: React.FC<{ f: number }> = ({ f }) => {
  const hit = prog(f, K.laga - 2, K.laga + 3);
  const fall = prog(f, K.gir - 4, K.gir + 16, Easing.in(Easing.quad));
  const rot = lerp(0, -12, hit) + lerp(0, -40, fall);
  const arrowX = lerp(1100, 470, prog(f, K.laga - 8, K.laga, Easing.linear));
  return (
    <Cam f={f} a={C.hit} b={C.tent} cx={480} cy={1300} s0={1.0} s1={1.12} hits={[K.laga, K.gir + 12]} amp={14}>
      <Kurukshetra f={f} tod="war" sunX={760} gods={0.4} crowd={0.6} />
      <ArrowSky f={f} k={0.7} />
      <Car f={f} x={560} y={1760} s={1.05} facing={1} metal="silver" part="back" />
      <g transform={`rotate(${rot} 420 ${1640 + 120 * fall})`}>
        <Bhishma f={f} id="b10" x={420} y={1540 + 120 * fall} s={1.3} facing={1}
          o={kp(f, [[C.hit, { sF: 92, eF: 0, sB: 86, eB: 110, brow: 0.7, browTilt: 8, lookX: 1 }], [K.laga + 2, { sF: 140, eF: 40, sB: 120, eB: 60, head: -16, blink: 0.6, smile: -0.5, brow: 0.9, browTilt: -10 }], [K.gir + 10, { sF: 160, eF: 30, sB: 140, eB: 40, head: -20, blink: 1, smile: -0.4 }]])} k={0.2} />
      </g>
      {f >= K.laga - 8 ? (
        <g transform={`rotate(${f < K.laga ? 0 : rot} 420 1640)`}>
          <path d={`M${arrowX + 150} ${1150 - (arrowX - 470) * 0.2}L${arrowX} ${1290 - (arrowX - 470) * 0.2}`} stroke="#5A3A22" strokeWidth={6} />
          <path d={`M${arrowX} ${1290 - (arrowX - 470) * 0.2}l16 -20l6 14z`} fill="#C9CCD2" />
        </g>
      ) : null}
      <Car f={f} x={560} y={1760} s={1.05} facing={1} metal="silver" part="front" />
      <Dust f={f} y={1680} o={0.1 + 0.2 * fall} />
      <Grey k={0.45 * prog(f, K.laga, K.gir + 10)} />
      <Vignette o={0.6} c="#1A0404" />
    </Cam>
  );
};

/** "उस रात… सपने में आठ ब्राह्मण आए।": the tent; eight lights appear one by one around the sleeping Bhishma. */
const TentDream: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.tent} b={C.dream} cx={540} cy={1300} s0={1.12} s1={1.0}>
    <Tent f={f} lamp={1} blue={0.4 + 0.3 * prog(f, K.vasu - 10, K.vasu + 20)} />
    <g transform="rotate(-90 540 1500)">
      <Bhishma f={f} id="b11" x={540} y={1500} s={1.15} facing={1} o={{ blink: 1, sF: 20, eF: 40, sB: -10, eB: 20, smile: 0, head: 6, talk: 0 }} k={0.2} armour={false} />
    </g>
    {Array.from({ length: 8 }, (_, i) => {
      const k = prog(f, K.vasu + i * 4, K.vasu + i * 4 + 10, outBack);
      if (k <= 0) return null;
      const a = Math.PI * (0.1 + (0.8 * i) / 7);
      return (
        <g key={i} transform={`translate(${540 - Math.cos(a) * 400} ${1140 - Math.sin(a) * 420}) scale(${k})`}>
          <Vasu f={f + i * 7} s={2.1} seed={i} />
        </g>
      );
    })}
    <circle cx={540} cy={900} r={420} fill="#FFF0C0" opacity={0.12 * prog(f, K.vasu, K.vasu + 30)} filter="url(#k6Blur24)" />
  </Cam>
);

/** The brahmanas: "उठो, भीष्म। प्रस्वाप अस्त्र याद करो… पिछले जन्म में ये तुम्हारा था।": the blue light settles in his palm. */
const Brahmanas: React.FC<{ f: number }> = ({ f }) => {
  const g = prog(f, K.prasvap - 4, K.prasvap + 30);
  return (
    <Cam f={f} a={C.dream} b={C.d23} cx={560} cy={1100} s0={1.0} s1={1.12}>
      <StarSky f={f} />
      {Array.from({ length: 8 }, (_, i) => {
        const a = Math.PI * (0.05 + (0.9 * i) / 7);
        return (
          <g key={i} transform={`translate(${540 - Math.cos(a) * 430} ${900 - Math.sin(a) * 380 + Math.sin(f / 20 + i) * 6})`}>
            <Vasu f={f + i * 5} s={2.4} seed={i} />
          </g>
        );
      })}
      <Bhishma f={f} id="b12" x={540} y={1800} s={2.4} facing={1} o={{ sF: lerp(20, 60, g), eF: lerp(30, 70, g), wF: -20, lookX: 0.2, lookY: -0.8, head: -10, brow: 0.8, smile: 0.1 * g, talk: 0 }} k={0.3} armour={false} />
      <PrasvapaGlow f={f} x={lerp(540, 700, g)} y={lerp(700, 1180, g)} r={60 + 30 * g} k={0.3 + 0.7 * g} />
      <Vignette o={0.45} c="#05051A" />
    </Cam>
  );
};

/** Day 23: the Brahma-astras blaze in the sky; Bhishma draws the Prasvapa: "…जो गुरु को रणभूमि में सुला देता।" */
const Day23: React.FC<{ f: number }> = ({ f }) => {
  const draw = prog(f, C.d23 + 6, K.chadhaya + 6);
  return (
    <Cam f={f} a={C.d23} b={C.narada} cx={360} cy={1200} s0={1.0} s1={1.16} hits={[C.d23 + 4]} amp={14}>
      <Kurukshetra f={f} tod="war" sunX={540} gods={0.3} crowd={0.5} />
      <AstraClash f={f} x={540} y={520} k={0.6 + 0.4 * Math.sin(f / 7) ** 2} />
      <Car f={f} x={340} y={1780} s={1.0} facing={1} metal="silver" part="back" />
      <Bhishma f={f} id="b13" x={330} y={1480} s={1.3} facing={1} o={{ sF: 92, eF: 0, sB: 86, eB: 90 + 35 * draw, lookX: 1, brow: 0.8, browTilt: 10, glow: 0.3 * draw, talk: 0 }} k={0.2} prop={<Bow6 s={0.85} white draw={draw} arrow={1} astra={draw} />} />
      <Car f={f} x={340} y={1780} s={1.0} facing={1} metal="silver" part="front" />
      <Vignette o={0.5} c="#1A0404" />
    </Cam>
  );
};

/** "रुको, भीष्म! अपने गुरु का अपमान मत करो!": Narada in the sky with the devas. */
const NaradaSky: React.FC<{ f: number }> = ({ f }) => {
  const keys: KP[] = [
    [C.narada, { sF: 60, eF: 60, wF: -10, sB: 30, eB: 60, lookX: 0.1, lookY: 0.4, brow: 0.4 }],
    [K.ruko + 4, { sF: 150, eF: 10, wF: -20, sB: 30, eB: 60, lookX: 0.1, lookY: 0.4, brow: 0.6, browTilt: -2 }],
  ];
  const rise = prog(f, C.narada, C.narada + 20, outCubic);
  return (
    <Cam f={f} a={C.narada} b={C.halt} cx={540} cy={1000} s0={1.08} s1={1.0} hits={[K.ruko]} amp={10}>
      <Kurukshetra f={f} tod="day" sunX={540} gods={1} horizon={1500} crowd={0} camp={false} />
      <g opacity={0.95}>
        <path d="M80 1500C120 1400 300 1380 380 1430C440 1360 640 1360 700 1430C780 1380 960 1400 1000 1500Z" fill="#FFF0DA" />
        <path d="M80 1500L1000 1500C960 1470 880 1460 820 1470C740 1450 640 1450 560 1466C470 1450 380 1452 300 1470C220 1460 140 1470 80 1500Z" fill="#E8D2B0" />
      </g>
      <circle cx={540} cy={900} r={380} fill="#FFF4D0" opacity={0.5} filter="url(#k6Blur24)" />
      <Man f={f} id="n14" who={NARADA} x={540} y={lerp(1560, 1470, rise)} s={2.0} facing={1} o={{ ...kpo(f, keys), talk: talk(f, "narada") }} k={0.4} backProp={<Veena s={0.9} rot={-6} glow={0.6} />} />
      {[[150, 1040], [930, 1040], [230, 1260], [850, 1260]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y + Math.sin(f / 18 + i) * 6})`} opacity={0.85}>
          <circle cy={-50} r={34} fill="#FFF6D0" opacity={0.6} />
          <circle cy={-50} r={20} fill="#D49A6A" />
          <path d="M-14 -70L0 -94L14 -70Z" fill="#F2C14E" />
          <path d="M-30 0C-26 -28 -14 -40 0 -40C14 -40 26 -28 30 0Z" fill={i % 2 ? "#B3262E" : "#1F3E8A"} />
        </g>
      ))}
    </Cam>
  );
};

/** "भीष्म रुक गए। और परशुराम के पितरों ने युद्ध रुकवा दिया।": the bow comes down; the forefathers rise in smoke. */
const Halt: React.FC<{ f: number }> = ({ f }) => {
  const low = prog(f, K.ruk - 4, K.ruk + 18);
  const pit = prog(f, K.pitri - 10, K.pitri + 16);
  const axe = prog(f, K.pitri + 6, B(33));
  return (
    <Cam f={f} a={C.halt} b={C.admit} cx={540} cy={1200} s0={1.0} s1={1.08}>
      <Kurukshetra f={f} tod="dusk" sunX={540} gods={0.5} crowd={0.4} />
      <Smoke f={f} x={760} y={1500} w={600} h={900} k={pit} />
      {[[620, 1300], [790, 1240], [950, 1300]].map(([x, y], i) => (
        <g key={i} opacity={0.42 * pit}>
          <Man f={f} id={`pt${i}`} who={PITRI} x={x} y={y + (1 - pit) * 40} s={1.05} facing={-1} o={{ sF: i === 1 ? 120 : 60, eF: 30, lookX: 1, smile: 0, brow: 0.3 }} k={0.3} />
        </g>
      ))}
      <Rama f={f} id="r15" x={780} y={1640} s={1.45} facing={-1} o={{ sF: lerp(60, 10, axe), eF: lerp(60, 20, axe), sB: -14, eB: 10, head: lerp(0, 10, axe), lookX: 0.2, lookY: lerp(0, 0.7, axe), brow: 0.5, browTilt: lerp(8, -6, axe), smile: -0.3 }} k={0.3} prop={<Parashu s={0.85} rot={lerp(0, 60, axe)} />} />
      <Bhishma f={f} id="b15" x={290} y={1640} s={1.45} facing={1} o={{ sF: lerp(92, 12, low), eF: lerp(0, 20, low), sB: lerp(86, -8, low), eB: lerp(120, 12, low), head: 4 * low, lookX: 1, brow: 0.3, smile: 0.05 }} k={0.3} prop={<Bow6 s={0.8} white rot={30 * low} />} />
      <Vignette o={0.45} c="#140A14" />
    </Cam>
  );
};

/** "अंबा… मैंने पूरी शक्ति लगा दी। पर भीष्म को नहीं हरा सका।": breathing hard, he turns to her. */
const Admit: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.admit} b={C.vow} cx={560} cy={1000} s0={1.0} s1={1.12}>
    <Kurukshetra f={f} tod="dusk" sunX={260} gods={0} crowd={0.3} />
    <Rama f={f} id="r16" x={680} y={1760} s={2.5} facing={-1} o={{ sF: 30, eF: 60, wF: -20, head: 8, lookX: 1, lookY: 0.3, brow: 0.5, browTilt: -8, smile: -0.4, blink: 0.25, bob: Math.sin(f / 6) * 6 }} k={0.3} />
    <Kanya pal={AMBA6} id="a16" f={f} x={220} y={2050} s={1.25} crown="none" plain hands={[[-40, -440], [40, -440]]} lookX={0.8} lookY={-0.2} smile={-0.5} sad={kn(f, [[C.admit, 0.6], [B(36), 0.9]])} tilt={6} />
    <Vignette o={0.5} c="#140A14" />
  </Cam>
);

/** "तो अब मैं खुद… भीष्म की मृत्यु बनूँगी।": Amba, close, in firelight. */
const Vow: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.vow} b={C.alone} cx={540} cy={900} s0={1.0} s1={1.18} hits={[K.mrityu]} amp={6}>
    <rect width={W} height={H} fill="#120806" />
    <FireGlow x={300} y={1500} r={700} o={0.35 + 0.08 * Math.sin(f / 3)} />
    {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${60 + i * 160} 1920L${80 + i * 160} 300`} stroke="#0A0604" strokeWidth={50 + (i % 3) * 20} opacity={0.6} />)}
    <Kanya pal={AMBA6} id="a17" f={f} x={540} y={2280} s={1.75} crown="none" plain hands={[[-40, -440], [60, -560]]} lookX={-0.1} lookY={0} smile={-0.7} sad={kn(f, [[C.vow, 0.6], [K.mrityu, 0.2]])} tilt={0} speak={talk(f, "amba")} />
    <Vignette o={0.6} c="#0A0402" />
  </Cam>
);

/** "भीष्म को कोई योद्धा नहीं हरा सकता था। तो फिर… उन्हें गिराएगा कौन?": Bhishma alone on the empty field. */
const Alone: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.alone} b={C.feature} cx={540} cy={1100} s0={1.0} s1={1.2} hits={[K.kaun]} amp={5}>
    <Kurukshetra f={f} tod="dusk" sunX={540} gods={0} crowd={0} camp={false} />
    <Bhishma f={f} id="b18" x={540} y={1700} s={1.5} facing={1} o={{ sF: 8, eF: 14, sB: -8, eB: 10, head: 6, lookX: kn(f, [[C.alone, 0.3], [K.kaun, 1]]), lookY: 0.3, smile: 0, talk: 0 }} k={0.3} prop={<Bow6 s={0.8} white rot={10} />} />
    <Dust f={f} y={1600} o={0.08} />
    <Grey k={0.25 + 0.2 * prog(f, K.kaun, C.feature)} />
    <Vignette o={0.65} c="#0A0408" />
  </Cam>
);

const FeatureWorld: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={W} height={H} fill="#FFF4E4" />
    <circle cx={540} cy={900} r={700} fill="#FFE0B0" opacity={0.6} filter="url(#k6Blur24)" />
    <g opacity={0.12}>
      <Car f={f} x={200 - 20 * prog(f, C.feature, C.end)} y={1900} s={0.8} facing={1} metal="silver" umbrella={false} />
      <Car f={f} x={880 + 20 * prog(f, C.feature, C.end)} y={1900} s={0.8} facing={-1} metal="gold" />
    </g>
  </g>
);
const EndWorld: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={W} height={H} fill="#FFF4E4" />
    <circle cx={540} cy={800 + 10 * Math.sin(f / 30)} r={760} fill="#FFE0B0" opacity={0.6} filter="url(#k6Blur24)" />
  </g>
);

/* ================================================================== */
/* Text layers                                                         */
/* ================================================================== */

/** The new Jyotiq brand bug (zodiac-wheel logo, 24 Nov 2026). */
const BrandBug6: React.FC<{ o?: number }> = ({ o = 1 }) =>
  o > 0.01 ? (
    <div style={{ position: "absolute", left: BRAND.x, top: BRAND.y, height: 92, display: "flex", alignItems: "center", gap: 12, padding: "0 26px 0 8px", borderRadius: 60,
      background: "radial-gradient(120% 140% at 20% 50%, rgba(36,22,40,0.9) 0%, rgba(14,10,18,0.88) 100%)", border: "2px solid rgba(223,177,91,0.75)", boxShadow: "0 8px 22px rgba(58,31,18,0.25)", opacity: o }}>
      <Img src={staticFile("jyotiq/logo-zodiac.png")} style={{ width: 76, height: 76, borderRadius: 38, boxShadow: "0 0 0 2px rgba(240,180,80,0.8)" }} />
      <div style={{ fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 38, color: "#F3DB9D", letterSpacing: 2 }}>Jyotiq</div>
    </div>
  ) : null;

/** Manthan-style captions: one short chunk at a time (<= 3 words / ~18 letters), speaker colour, one gold keyword. */
const WHO: Record<string, string> = { kaal: "#FFF6E4", rama: "#FFB48A", bhishma: "#DDE8FF", amba: "#FFC2CE", narada: "#FFE08A", brahman: "#BFE6FF" };
const KEYW = ["वध", "वचन", "इक्कीस", "भीष्म", "क्यों?", "परशुराम", "न्याय", "आशीर्वाद", "विजयी", "हराने", "दस", "बीस", "छाती", "गिर", "सपने", "आठ", "प्रस्वाप", "पिछले", "तेईसवें", "सुला", "रुको,", "अपमान", "पितरों", "शक्ति", "मृत्यु", "योद्धा", "कौन?", "गुरु…", "वचन।", "ज्योतिक़"];
type Chunk = { a: number; b: number; who: string; text: string };
const CHUNKS: Chunk[] = (() => {
  const out: Chunk[] = [];
  P.forEach((ph, pi) => {
    const ws = WORDS.filter((w) => w.p === pi);
    let cur: typeof ws = [];
    const flush = () => {
      if (cur.length) out.push({ a: cur[0].a, b: cur[cur.length - 1].b, who: ph.who, text: cur.map((w) => w.w).join(" ") });
      cur = [];
    };
    ws.forEach((w, i) => {
      const len = [...cur, w].map((x) => x.w).join(" ").length;
      if (cur.length && (cur.length >= 3 || len > 19)) flush();
      cur.push(w);
      if (i === ws.length - 1) flush();
    });
  });
  return out.map((c, i) => ({ ...c, b: Math.min(c.b + 10, (out[i + 1]?.a ?? 1e9) - 1) }));
})();
const Captions: React.FC<{ f: number }> = ({ f }) => {
  const c = CHUNKS.find((k) => f >= k.a - 1 && f < k.b);
  if (!c) return null;
  const t = f - (c.a - 1);
  const pop = prog(t, 0, 6, outBack);
  const o = Math.min(1, t / 3) * (1 - prog(f, c.b - 3, c.b));
  const words = c.text.split(" ");
  return (
    <div style={{ position: "absolute", left: 90, width: 900, top: 1500, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ transform: `scale(${0.9 + 0.1 * pop})`, padding: "12px 28px 16px", borderRadius: 22, background: "rgba(12,10,7,0.6)", border: "1.5px solid rgba(223,177,91,0.55)",
        textAlign: "center", fontFamily: MUKTA, fontWeight: 800, fontSize: 54, lineHeight: 1.2, color: WHO[c.who] ?? "#FFF6E4", textShadow: "0 3px 10px rgba(0,0,0,0.6)" }}>
        {words.map((w, i) => (
          <span key={i} style={{ color: KEYW.includes(w) ? "#FFC94D" : undefined }}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </div>
    </div>
  );
};

const DayCounter: React.FC<{ f: number }> = ({ f }) => {
  const show = (f >= C.war + 6 && f < C.tent - 4) || (f >= C.d23 && f < C.narada);
  if (!show) return null;
  const n = f >= C.d23 ? 23 : Math.round(f < K.day10 ? kn(f, [[C.war + 6, 1], [K.day10 - 2, 9]]) : f < K.day20 ? kn(f, [[K.day10, 10], [K.day20 - 2, 19]]) : 20);
  const red = n >= 20;
  const inK = f >= C.d23 ? prog(f, C.d23, C.d23 + 6, outBack) : prog(f, C.war + 6, C.war + 12, outBack);
  return (
    <div style={{ position: "absolute", right: 40, top: 300, transform: `scale(${0.7 + 0.3 * inK})`, opacity: inK, display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 18px 10px", borderRadius: 22, background: "rgba(26,10,10,0.78)", border: `2.5px solid ${red ? "#FF6A3A" : S.gold}` }}>
      <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 16, letterSpacing: 4, color: S.goldLight }}>दिन · DAY</div>
      <div style={{ fontFamily: ROZHA, fontSize: 70, lineHeight: 1, color: red ? "#FF8A5A" : "#FFE3A1" }}>
        {n}
        <span style={{ fontFamily: MUKTA, fontSize: 26, color: "#FFF3DA", opacity: 0.7 }}> / 23</span>
      </div>
    </div>
  );
};

const TitleText: React.FC<{ f: number }> = ({ f }) => {
  const a = C.title;
  const t = prog(f, a + 4, a + 18, outBack);
  const sub = prog(f, a + 14, a + 26, outCubic);
  const out = 1 - prog(f, C.intro - 6, C.intro);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: out }}>
      <Presents y={300} o={prog(f, a, a + 8)} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 590, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={{ fontFamily: ROZHA, fontSize: 250, lineHeight: 1.05, background: "linear-gradient(180deg, #FFF3C4 0%, #F6C14E 45%, #C07A1E 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
          WebkitTextStroke: "3px #5A2E0A", filter: "drop-shadow(0 0 22px rgba(26,12,6,0.95)) drop-shadow(0 10px 30px rgba(255,190,80,0.35))", transform: `scale(${1.6 - 0.6 * t})`, opacity: Math.min(1, t * 2) }}>
          भारत
        </div>
        <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 40, letterSpacing: 18, color: "#FFE3A1", opacity: sub, marginTop: -10 }}>BHARATA</div>
        <div style={{ marginTop: 24, padding: "12px 34px", borderRadius: 40, background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 44, opacity: sub, transform: `translateY(${(1 - sub) * 30}px)` }}>Episode 6 · गुरु से युद्ध</div>
      </div>
    </div>
  );
};

const Logo: React.FC<{ size: number }> = ({ size }) => <Img src={staticFile("jyotiq/logo-zodiac.png")} style={{ width: size, height: size, borderRadius: size / 2, boxShadow: `0 0 0 3px ${S.gold}` }} />;

const FeatureText: React.FC<{ f: number }> = ({ f }) => {
  const a = C.feature;
  const st = (i: number): React.CSSProperties => {
    const k = prog(f, a + 2 + i * 6, a + 14 + i * 6, outBack);
    return { opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - k) * 40}px) scale(${0.88 + 0.12 * k})` };
  };
  const q = "नई नौकरी का ऑफ़र है, पर पुरानी जगह से वादा किया था… क्या करूँ?";
  const typed = Math.round(q.length * prog(f, a + 20, A(44), Easing.linear));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
      <div style={st(0)}>
        <TwoTone parts={[pt("एक तरफ़ गुरु… "), pt("एक तरफ़ वचन", true)]} size={64} />
      </div>
      <div style={{ ...st(1), width: 760, borderRadius: 48, background: "#FFF9F0", border: `4px solid ${S.goldLight}`, boxShadow: "0 24px 60px rgba(20,10,30,0.35)", padding: "26px 28px 30px", display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, borderBottom: "2px solid #F0E2CC", paddingBottom: 14 }}>
          <Logo size={64} />
          <div style={{ fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 34, color: S.brown }}>Jyotiq</div>
        </div>
        <div style={{ alignSelf: "flex-end", maxWidth: 560, minHeight: 50, padding: "16px 22px", borderRadius: "28px 28px 6px 28px", background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 700, fontSize: 38, lineHeight: 1.3 }}>
          {q.slice(0, typed)}
          <span style={{ opacity: Math.sin(f / 3) > 0 ? 1 : 0 }}>|</span>
        </div>
        <div style={{ alignSelf: "flex-start", padding: "16px 26px", borderRadius: "28px 28px 28px 6px", background: "#F3E6D2", color: S.brown, fontFamily: MUKTA, fontWeight: 700, fontSize: 40, opacity: f > A(44) ? 1 : 0 }}>
          {["●", "●", "●"].map((d, i) => (
            <span key={i} style={{ opacity: 0.4 + 0.6 * Math.max(0, Math.sin(f / 4 - i)) }}>{d} </span>
          ))}
        </div>
      </div>
      <div style={{ ...st(2), padding: "14px 32px", borderRadius: 28, background: "rgba(26,16,40,0.9)", border: `2.5px solid ${S.gold}`, color: "#FFF3DA", fontFamily: MUKTA, fontWeight: 800, fontSize: 42 }}>जब मन दो राहों पर अटके… ज्योतिक़ से पूछिए</div>
    </div>
  );
};

const EndChip: React.FC<{ t: string; on?: boolean }> = ({ t, on }) => (
  <div style={{ padding: "10px 24px", borderRadius: 30, background: on ? GRAD : "#FFFFFF", border: `2.5px solid ${S.goldLight}`, fontFamily: MUKTA, fontWeight: 700, fontSize: 34, color: on ? "#FFFFFF" : S.brown }}>{t}</div>
);
const EndText: React.FC<{ f: number }> = ({ f }) => {
  const e = C.end;
  const st = (i: number): React.CSSProperties => {
    const k = prog(f, e + 2 + i * 4, e + 12 + i * 4, outBack);
    return { opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - k) * 40}px) scale(${0.85 + 0.15 * k})` };
  };
  const arrow = Math.sin(f / 4) * 8;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 440, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ ...st(0), padding: "16px 40px 20px", borderRadius: 34, background: "rgba(26,16,40,0.92)", border: `3px solid ${S.gold}`, textAlign: "center" }}>
        <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 24, letterSpacing: 6, color: S.goldLight }}>अगला एपिसोड · NEXT</div>
        <div style={{ fontFamily: ROZHA, fontSize: 84, lineHeight: 1.1, background: "linear-gradient(180deg, #FFF3C4 0%, #F6C14E 60%, #C07A1E 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>एकलव्य का अंगूठा</div>
        <div style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 34, color: "#FFF3DA" }}>“गुरु-दक्षिणा में… अंगूठा।”</div>
      </div>
      <div style={{ ...st(1), display: "flex", alignItems: "center", gap: 20, marginTop: 6 }}>
        <Logo size={124} />
        <TwoTone parts={[pt("ज्योतिक़ "), pt("डाउनलोड कीजिए", true)]} size={66} />
      </div>
      <div style={{ ...st(2), display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, maxWidth: 940 }}>
        {["सवाल पूछिए", "फ़्री कुंडली", "दशा", "गोचर", "पंचांग"].map((t, i) => (
          <EndChip key={t} t={t} on={i === 0} />
        ))}
      </div>
      <div style={{ ...st(3), display: "flex", gap: 18, transform: "scale(0.9)" }}>
        <PlayButton glow={0.4 + 0.3 * Math.sin(f / 5)} />
        <AppStoreButton glow={0.4 + 0.3 * Math.sin(f / 5 + 1)} />
      </div>
      <div style={{ ...st(4), fontFamily: MUKTA, fontWeight: 800, fontSize: 42, ...gradText }}>
        ऐप का लिंक बायो में <span style={{ display: "inline-block", color: S.red, WebkitTextFillColor: S.red, transform: `translateY(${-Math.abs(arrow)}px)` }}>↑</span> · www.jyotiq.ai
      </div>
      <div style={{ ...st(5), padding: "14px 32px", borderRadius: 28, background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 40 }}>कमेंट करें: भीष्म सही थे या परशुराम?</div>
      <div style={{ ...st(6), fontFamily: JAKARTA, fontWeight: 600, fontSize: 24, color: S.brownMid, opacity: 0.85 }}>Guidance only, for entertainment and information.</div>
    </div>
  );
};

/* ================================================================== */
/* Composition                                                         */
/* ================================================================== */

type Shot = { a: number; b: number; World: React.FC<{ f: number }> };
const SHOTS: Shot[] = [
  { a: 0, b: C.h1, World: HookWide },
  { a: C.h1, b: C.h2, World: HookClose },
  { a: C.h2, b: C.h3, World: BhishmaCar },
  { a: C.h3, b: C.h4, World: RamaRoar },
  { a: C.h4, b: C.title, World: BhishmaReply },
  { a: C.title, b: C.intro, World: TitleWorld },
  { a: C.intro, b: C.plea, World: AshramWide },
  { a: C.plea, b: C.field, World: AmbaPlea },
  { a: C.field, b: C.refuse, World: Blessing },
  { a: C.refuse, b: C.war, World: Refusal },
  { a: C.war, b: C.hit, World: Duel },
  { a: C.hit, b: C.tent, World: Struck },
  { a: C.tent, b: C.dream, World: TentDream },
  { a: C.dream, b: C.d23, World: Brahmanas },
  { a: C.d23, b: C.narada, World: Day23 },
  { a: C.narada, b: C.halt, World: NaradaSky },
  { a: C.halt, b: C.admit, World: Halt },
  { a: C.admit, b: C.vow, World: Admit },
  { a: C.vow, b: C.alone, World: Vow },
  { a: C.alone, b: C.feature, World: Alone },
  { a: C.feature, b: C.end, World: FeatureWorld },
  { a: C.end, b: TOTAL, World: EndWorld },
];
const XFADE: Record<number, number> = { [C.intro]: 8, [C.tent]: 12, [C.dream]: 10, [C.alone]: 10, [C.feature]: 10, [C.end]: 8 };

export const Bharata6Reel: React.FC<{ audio?: boolean }> = ({ audio = false }) => {
  const f = useCurrentFrame();
  const layers: React.ReactNode[] = [];
  SHOTS.forEach((s, i) => {
    const next = SHOTS[i + 1];
    const tail = next ? XFADE[next.a] ?? 0 : 0;
    if (f >= s.a && f < s.b + tail) {
      const x = XFADE[s.a] ?? 0;
      const o = x ? prog(f, s.a, s.a + x, Easing.linear) : 1;
      layers.push(
        <g key={i} opacity={o}>
          <s.World f={f} />
        </g>,
      );
    }
  });
  const inTitle = f >= C.title && f < C.intro;
  const hookOut = 1 - prog(f, A(1) + 10, A(1) + 18);
  const brand = inTitle || f >= C.feature ? 0 : 1;
  return (
    <AbsoluteFill style={{ background: "#140806", overflow: "hidden" }}>
      {audio ? <Audio src={staticFile("jyotiq/bharata/ep6/mix.wav")} /> : null}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <RigDefs />
        <SetDefs />
        <NvDefs />
        <N2Defs />
        <BhDefs />
        <ChDefs />
        <W5Defs />
        <W6Defs />
        {layers}
      </svg>
      {hookOut > 0.01 ? (
        <div style={{ position: "absolute", inset: 0, opacity: hookOut, transform: `scale(${1 + 0.015 * Math.sin(f / 10)})`, transformOrigin: "50% 20%" }}>
          <HookPlate y={300} size={60} lines={[[pt("गुरु "), pt("बनाम", true), pt(" शिष्य")], [pt("23 दिन… "), pt("जीता कौन?", true)]]} />
        </div>
      ) : null}
      <DayCounter f={f} />
      {inTitle ? <TitleText f={f} /> : null}
      {f >= C.feature && f < C.end + 8 ? (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - prog(f, C.end, C.end + 8) }}>
          <FeatureText f={f} />
        </div>
      ) : null}
      {f >= C.end ? (
        <div style={{ position: "absolute", inset: 0, opacity: prog(f, C.end, C.end + 8), transform: `scale(${1 + 0.03 * prog(f, C.end, TOTAL, Easing.inOut(Easing.sin))})`, transformOrigin: "50% 45%" }}>
          <EndText f={f} />
        </div>
      ) : null}
      {!inTitle && f < C.feature ? <Captions f={f} /> : null}

      <Flash f={f} at={K.vadh} color="#FFB070" peak={0.25} rise={1} fall={8} />
      <Flash f={f} at={K.ikkis} color="#FFF4E0" peak={0.55} rise={1} fall={10} />
      <Flash f={f} at={C.title} color="#FFF4D6" peak={1} rise={3} fall={14} />
      <Flash f={f} at={C.intro} color="#FFF4D6" peak={0.5} rise={2} fall={10} />
      <Flash f={f} at={K.conch} color="#FFE7A0" peak={0.35} fall={10} />
      <Flash f={f} at={K.laga} color="#FFFFFF" peak={0.6} rise={1} fall={8} />
      <Flash f={f} at={C.d23 + 4} color="#FFE0A0" peak={0.7} rise={2} fall={14} />
      <Flash f={f} at={K.ruko} color="#FFFFFF" peak={0.5} rise={1} fall={12} />
      <Flash f={f} at={K.mrityu} color="#FF7A3A" peak={0.2} fall={10} />
      <Flash f={f} at={C.feature} peak={0.6} fall={8} />

      <BrandBug6 o={brand} />
    </AbsoluteFill>
  );
};
