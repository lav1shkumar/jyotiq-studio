import React from "react";
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from "remotion";
import { AppStoreButton, PlayButton } from "../../katha/reelKit";
import { Puppet, RigDefs, blinkAt, idle, pose, type Pose, type Who } from "../../manthan/rig";
import { SetDefs } from "../../manthan/sets";
import { Cam, Flash, Motes, NameChipIn, Petals, Pop, lerp, outBack, outCubic, prog } from "../../navagraha/ep1/anim";
import { CAP_BOTTOM, CAP_TOP, Chrome, GRAD, HookPlate, JAKARTA, MUKTA, Part, Presents, ROZHA, S, TwoTone, gradText } from "../../navagraha/ep1/look";
import { NvDefs, SunRays, SvgImage } from "../../navagraha/ep1/world";
import { Bow, DEVAVRATA, Quiver, SHANTANU } from "../ep1/cast";
import { Devi } from "../ep1/ganga";
import { BhDefs, CourtSet, WaterFront } from "../ep1/world";
import { Boat, CrownProp, DASHARAJ, DEVAVRATA_BARE, SATYAVATI } from "./cast2";
import { BEATS, ENV, PHRASES, TOTAL, WORDS } from "./timing";
import { FisherSet, FlowerRain, HeavenLight } from "./world2";

/*
 * भारत · BHARATA Episode 2 · भीष्म प्रतिज्ञा. Same kit and rules as Episode 1 (bharata/ep1, imported read-only): brand bug
 * top-left, no app panel (Ayush, 18 Nov), hook plate from frame 0, the cold open is the argument (Dasharaj vs Devavrata in
 * their designed voices, lip-synced from ENV), then the series title, then Kaal narrates; आज अनुकूल/प्रतिकूल feature; end
 * card with the next-episode tease. Clock: timing.ts (mahabharat-ep2/tools/vo_prep.py). Audio is muxed after the render.
 */
export const BHARATA2_TOTAL = TOTAL;
const W = 1080;
const H = 1920;
const P = PHRASES;
const A = (i: number) => P[i].a;
const B = (i: number) => P[i].b;
const cue = (p: number, w: string) => (WORDS.find((x) => x.p === p && x.w.startsWith(w)) ?? WORDS.find((x) => x.p === p)!).a;
const p = (t: string, hi = false): Part => ({ t, hi });

const C = {
  d1: A(1) - 3,
  r2: A(2) - 3,
  vow: A(3) - 4,
  title: BEATS.title[0],
  prince: BEATS.title[1],
  chief: A(7) - 3,
  love: A(10) - 5,
  sad: A(11) - 5,
  son: A(13) - 5,
  renounce: A(15) - 5,
  heaven: A(17) - 5,
  boon: A(20) - 4,
  moment: A(22) - 4,
  feature: A(24) - 4,
  end: B(26) + 6,
};
const K = {
  raja: cue(0, "राजा"),
  vivah: A(4),
  shart: cue(11, "शर्त"),
  chhoda: cue(15, "छोड़ा"),
  vansh: cue(16, "वंश"),
  phool: A(17),
  bhishma: A(19),
  beat: BEATS.bhishma[0],
  var: cue(20, "वरदान"),
  mrityu: A(21),
  din: cue(25, "अनुकूल"),
};

/** Mouth openness for a speaker at frame f (their own lines only), lightly smoothed. */
const talk = (f: number, who: string) => {
  const ph = P.find((x) => f >= x.a - 1 && f <= x.b + 1);
  if (!ph || ph.who !== who) return 0;
  const e = (i: number) => ENV[Math.max(0, Math.min(ENV.length - 1, i))] ?? 0;
  return Math.min(1, ((e(f - 1) + 2 * e(f) + e(f + 1)) / 4) * 1.25);
};

/* ------------------------------------------------------------------ */
/* Keyframed motion                                                    */
/* ------------------------------------------------------------------ */

type KP = [number, Partial<Pose>];
const EASE = Easing.inOut(Easing.cubic);
/** Pose keyframes with eased in-outs; numeric fields missing on one side hold the other side's value. */
const kp = (f: number, keys: KP[]): Partial<Pose> => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [fa, a] = keys[i];
    const [fb, b] = keys[i + 1];
    if (f < fb) {
      const u = EASE((f - fa) / Math.max(1, fb - fa));
      const out: Record<string, number> = {};
      const ks = new Set([...Object.keys(a), ...Object.keys(b)]);
      ks.forEach((k) => {
        const va = (a as Record<string, number>)[k];
        const vb = (b as Record<string, number>)[k];
        out[k] = lerp(va ?? vb, vb ?? va, u);
      });
      return out as Partial<Pose>;
    }
  }
  return keys[keys.length - 1][1];
};
/** The body follows the keys; the head and eyes follow 4 frames later (overlapping action). */
const kpo = (f: number, keys: KP[], lag = 4): Partial<Pose> => {
  const body = kp(f, keys);
  const late = kp(f - lag, keys);
  return { ...body, head: late.head ?? body.head, lookX: late.lookX ?? body.lookX, lookY: late.lookY ?? body.lookY };
};
type PuppetArgs = { f: number; id: string; who?: Who; x: number; y: number; s: number; facing?: number; p?: Partial<Pose>; prop?: React.ReactNode; backProp?: React.ReactNode; k?: number };
const Man: React.FC<PuppetArgs> = ({ f, id, who = SHANTANU, x, y, s, facing = 1, p: o = {}, prop, backProp, k = 1 }) => (
  <Puppet id={id} who={who} at={{ x, y, s, facing }} p={pose({ ...idle(id, f, k), blink: blinkAt(id, f), ...o })} t={f} prop={prop} backProp={backProp} />
);

const Grey: React.FC<{ k: number }> = ({ k }) => (k > 0.01 ? <rect width={W} height={H} fill="#808080" opacity={k} style={{ mixBlendMode: "saturation" }} /> : null);
const Vignette: React.FC<{ o?: number; c?: string }> = ({ o = 0.55, c = "#0A0612" }) => (
  <g opacity={o}>
    <rect width={W} height={260} fill={c} opacity={0.5} />
    <radialGradient id="bhVig" cx="0.5" cy="0.5" r="0.75">
      <stop offset="0.55" stopColor={c} stopOpacity="0" />
      <stop offset="1" stopColor={c} stopOpacity="0.9" />
    </radialGradient>
    <rect width={W} height={H} fill="url(#bhVig)" />
  </g>
);


/* ================================================================== */
/* Scenes                                                              */
/* ================================================================== */

const Dasharaj: React.FC<{ f: number; id: string; x: number; y: number; s: number; facing?: number; p?: Partial<Pose>; k?: number }> = (a) => <Man {...a} who={DASHARAJ} />;
const Prince: React.FC<{ f: number; id: string; x: number; y: number; s: number; facing?: number; p?: Partial<Pose>; k?: number; bare?: boolean; bow?: boolean }> = ({ bare, bow, ...a }) => (
  <Man
    {...a}
    who={bare ? DEVAVRATA_BARE : DEVAVRATA}
    prop={bow ? <Bow s={0.9} rot={-4} /> : undefined}
    backProp={<g transform="translate(-30 -40)"><Quiver s={0.9} /></g>}
  />
);

/** Cold open wide: dusk at the fishermen's village; the chief states his price to the prince. */
const HookWorld: React.FC<{ f: number }> = ({ f }) => {
  const chief: KP[] = [
    [0, { lean: -4, sF: 40, eF: 112, sB: 36, eB: 110, head: -4, lookX: 1, lookY: -0.1, brow: 0.6, browTilt: 10, smile: -0.2 }],
    [K.raja - 4, { lean: 4, sF: 98, eF: 8, wF: -8, sB: 30, eB: 100, head: 4, lookX: 1, lookY: -0.2, brow: 0.9, browTilt: 16, smile: -0.4 }],
    [C.d1, { lean: 2, sF: 92, eF: 14, wF: -8, sB: 30, eB: 100, head: 2, lookX: 1, lookY: -0.2, brow: 0.8, browTilt: 14, smile: -0.3 }],
  ];
  return (
    <Cam f={f} a={0} b={C.d1} cx={540} cy={1200} s0={1.0} s1={1.1} hits={[K.raja]} amp={10}>
      <FisherSet f={f} mood="dusk" />
      <Dasharaj f={f} id="hD" x={290} y={1760} s={1.32} facing={1} p={{ ...kpo(f, chief), talk: talk(f, "dasharaj") }} />
      <Prince f={f} id="hP" x={800} y={1750} s={1.36} facing={-1} p={{ lean: 0, sF: 20, eF: 16, sB: -6, eB: 12, head: 0, lookX: 1, lookY: 0, brow: 0.5, browTilt: -6, smile: 0 }} />
    </Cam>
  );
};

/** "तो मैं राजगद्दी छोड़ता हूँ।": the prince close, hand to his heart. */
const D1World: React.FC<{ f: number }> = ({ f }) => {
  const keys: KP[] = [
    [C.d1, { lean: 0, sF: 20, eF: 20, head: 0, lookX: 1, lookY: 0, brow: 0.4, smile: 0 }],
    [A(1) + 16, { lean: 4, sF: 56, eF: 98, wF: -20, head: 4, lookX: 1, lookY: 0.05, brow: 0.5, browTilt: -4, smile: 0.1 }],
  ];
  return (
    <Cam f={f} a={C.d1} b={C.r2} cx={560} cy={900} s0={1.0} s1={1.08}>
      <FisherSet f={f} mood="dusk" huts={false} />
      <rect width={W} height={H} fill="#1A0E2A" opacity={0.2} />
      <Prince f={f} id="d1" x={620} y={1980} s={2.6} facing={-1} p={{ ...kpo(f, keys), talk: talk(f, "devavrata") }} k={0.5} />
    </Cam>
  );
};

/** "और तुम्हारे बेटे? वो दावा करेंगे तो?": the chief close, leaning in, suspicious. */
const R2World: React.FC<{ f: number }> = ({ f }) => {
  const keys: KP[] = [
    [C.r2, { lean: 0, sF: 30, eF: 60, head: 0, lookX: 1, lookY: -0.1, brow: 0.7, browTilt: 12, smile: -0.1 }],
    [A(2) + 20, { lean: 8, sF: 90, eF: 30, wF: -10, head: 6, lookX: 1, lookY: -0.15, brow: 1, browTilt: 18, smile: 0.15 }],
  ];
  return (
    <Cam f={f} a={C.r2} b={C.vow} cx={520} cy={900} s0={1.0} s1={1.1}>
      <FisherSet f={f} mood="dusk" huts={false} />
      <rect width={W} height={H} fill="#1A0E2A" opacity={0.2} />
      <Dasharaj f={f} id="r2" x={430} y={1980} s={2.6} facing={1} p={{ ...kpo(f, keys), talk: talk(f, "dasharaj") }} k={0.5} />
    </Cam>
  );
};

const OATH: KP[] = [
  [0, { lean: 0, sF: 30, eF: 20, head: -6, lookX: 1, lookY: 0.4, brow: 0.6, browTilt: -8, smile: -0.1, blink: 0.2 }],
  [1, { lean: -4, sF: 168, eF: 6, wF: 0, head: -12, lookX: 0.6, lookY: -1, brow: 1, browTilt: 8, smile: -0.2, blink: 0 }],
];
/** The prince's oath pose at progress u (0 = head bowed, 1 = right hand raised to the sky). */
const oathPose = (u: number): Partial<Pose> => kp(u, OATH);

/** "तो मैं… कभी विवाह नहीं करूँगा!": he raises his hand to the sky; the heavens answer. */
const VowWorld: React.FC<{ f: number; frozen?: number }> = ({ f, frozen }) => {
  const u = frozen ?? prog(f, K.vivah - 10, K.vivah + 8, Easing.inOut(Easing.cubic));
  const light = frozen !== undefined ? 1 : prog(f, K.vivah - 2, K.vivah + 20, outCubic);
  return (
    <Cam f={f} a={C.vow} b={C.title} cx={560} cy={1000} s0={1.0} s1={1.16} hits={frozen !== undefined ? [] : [K.vivah]} amp={16}>
      <FisherSet f={f} mood="dusk" huts={false} />
      <HeavenLight f={f} k={light * 0.8} x={620} />
      <Prince f={f} id="vw" x={560} y={1800} s={1.62} facing={-1} p={{ ...oathPose(u), talk: talk(f, "devavrata") }} k={0.4} />
      <Motes f={f} x={140} y={300} w={800} h={1100} n={24} color="#FFE7A0" o={light} seed={3} />
    </Cam>
  );
};

/** The series title over the river of light (same lockup as Episode 1). */
const TitleWorld: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={W} height={H} fill="#0C0A2A" />
    <circle cx={540} cy={820} r={760} fill="#2A1E5A" opacity={0.8} filter="url(#bhBlur20)" />
    <g transform={`translate(540 820) rotate(${(f - C.title) * 0.6}) translate(-540 -820)`}>
      <SunRays x={540} y={820} r={210} k={0.5} f={f} n={36} />
    </g>
    <circle cx={540} cy={760} r={330} fill="#0C0A2A" opacity={0.72} filter="url(#bhBlur20)" />
    <path d={`M0 1460C300 ${1400 + 10 * Math.sin(f / 8)} 700 ${1520 + 10 * Math.cos(f / 9)} 1080 1440L1080 1920L0 1920Z`} fill="#1E5A78" />
    <Petals f={f} n={12} seed={6} o={0.7} color="#F6A21B" />
    <Motes f={f} x={60} y={400} w={960} h={1100} n={30} color="#FFE7A0" o={0.8} seed={9} />
  </g>
);

/** "ये थे गंगापुत्र देवव्रत… हस्तिनापुर के युवराज।": the crown prince in the Hastinapur court, bow in hand. */
const PrinceWorld: React.FC<{ f: number }> = ({ f }) => {
  const keys: KP[] = [
    [C.prince, { lean: 0, sF: 30, eF: 24, wF: 4, head: -2, lookX: 0.3, smile: 0.3 }],
    [A(6) + 10, { lean: -2, sF: 34, eF: 28, wF: 4, head: 2, lookX: 0.1, lookY: -0.1, smile: 0.4 }],
  ];
  return (
    <Cam f={f} a={C.prince} b={C.chief} cx={540} cy={1100} s0={1.14} s1={1.0}>
      <CourtSet f={f} />
      <Prince f={f} id="pr" x={520} y={1640} s={1.3} facing={1} p={kpo(f, keys)} bow />
    </Cam>
  );
};

/** "और सामने, मछुआरों के मुखिया दाशराज… सत्यवती के पिता।": the chief by his boat; Satyavati at his side. */
const ChiefWorld: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.chief} b={C.love} cx={540} cy={1150} s0={1.0} s1={1.08} dx={20}>
    <FisherSet f={f} mood="dusk" />
    <Dasharaj f={f} id="cD" x={380} y={1660} s={1.1} facing={1} p={{ lean: -2, sF: 40, eF: 112, sB: 36, eB: 110, head: -2, lookX: 1, lookY: -0.1, brow: 0.6, browTilt: 8, smile: 0.1 }} />
    <Devi pal={SATYAVATI} id="cSat" f={f} x={760} y={1700} s={0.72} crown="none" hands={[[-40, -430], [44, -436]]} lookX={-0.4} lookY={0.3} smile={0.25} tilt={-4} />
  </Cam>
);

/** "राजा शांतनु को सत्यवती से प्रेम हुआ था।": dawn; she rows by; the king on the bank, hand on his heart. */
const LoveWorld: React.FC<{ f: number }> = ({ f }) => {
  const glide = prog(f, C.love, C.sad, Easing.linear);
  const keys: KP[] = [
    [C.love, { lean: 0, sF: 14, eF: 16, head: 0, lookX: 1, lookY: 0.1, smile: 0.2 }],
    [A(10) + 30, { lean: 4, sF: 54, eF: 98, wF: -20, head: 4, lookX: 1, lookY: 0.2, smile: 0.6 }],
  ];
  const bx = lerp(760, 680, glide);
  return (
    <Cam f={f} a={C.love} b={C.sad} cx={560} cy={1150} s0={1.04} s1={1.0}>
      <FisherSet f={f} mood="dawn" huts={false} />
      <Devi pal={SATYAVATI} id="lSat" f={f} x={bx - 20} y={1320} s={0.5} crown="none" hands={[[-40, -430], [60, -470]]} lookX={-0.6} lookY={0.2} smile={0.35} />
      <g transform={`translate(${bx} 1330)`}>
        <Boat f={f} s={0.62} oar={f / 8} />
      </g>
      <WaterFront f={f} y={1360} x0={380} x1={1120} o={0.7} />
      <Man f={f} id="lS" x={250} y={1700} s={1.05} facing={1} p={kpo(f, keys)} />
      <Petals f={f} n={12} seed={8} o={0.7} />
      <Vignette o={0.45} c="#3A1E0A" />
    </Cam>
  );
};

/** "पर ये शर्त सुनकर… वो चुपचाप लौट आए।": night court; the king alone, head bowed. */
const SadWorld: React.FC<{ f: number }> = ({ f }) => {
  const keys: KP[] = [
    [C.sad, { lean: 4, sF: 10, eF: 14, head: 6, lookX: 0.6, lookY: 0.6, brow: 0.6, browTilt: -16, smile: -0.5 }],
    [B(12), { lean: 10, sF: 6, eF: 10, head: 16, lookX: 0.4, lookY: 0.9, brow: 0.8, browTilt: -20, smile: -0.7, blink: 0.4 }],
  ];
  return (
    <Cam f={f} a={C.sad} b={C.son} cx={540} cy={1150} s0={1.0} s1={1.12}>
      <CourtSet f={f} />
      <rect width={W} height={H} fill="#0A0620" opacity={0.55} />
      <Man f={f} id="sS" x={520} y={1640} s={1.2} facing={1} p={kpo(f, keys, 6)} k={0.4} />
      <Vignette o={0.7} />
    </Cam>
  );
};

/** "बेटे से पिता का दुख देखा नहीं गया।": the son watches his father from across the hall; his fist tightens. */
const SonWorld: React.FC<{ f: number }> = ({ f }) => {
  const grip = prog(f, A(14) - 4, A(14) + 10);
  return (
    <Cam f={f} a={C.son} b={C.renounce} cx={360} cy={1100} s0={1.0} s1={1.14}>
      <CourtSet f={f} />
      <rect width={W} height={H} fill="#0A0620" opacity={0.45} />
      <Man f={f} id="soS" x={800} y={1500} s={0.85} facing={-1} p={{ lean: 10, sF: 6, eF: 10, head: 16, lookX: 0.4, lookY: 0.9, brow: 0.8, browTilt: -20, smile: -0.7, blink: 0.4 }} k={0.4} />
      <Prince f={f} id="soP" x={300} y={1720} s={1.35} facing={1} p={{ lean: 2, sF: lerp(14, 8, grip), eF: lerp(16, 30, grip), fist: grip, head: lerp(0, 4, grip), lookX: 1, lookY: 0.3, brow: lerp(0.5, 0.9, grip), browTilt: lerp(-14, 10, grip), smile: lerp(-0.3, -0.1, grip) }} />
      <Vignette o={0.6} />
    </Cam>
  );
};

/** "उसने राज भी छोड़ा… और अपना वंश भी।": back at the river: the crown set down, then the hand raised. */
const RenounceWorld: React.FC<{ f: number }> = ({ f }) => {
  const down = prog(f, K.chhoda - 14, K.chhoda + 4, Easing.inOut(Easing.cubic));
  const bare = f >= K.chhoda - 2;
  const u = prog(f, K.vansh - 8, K.vansh + 8, Easing.inOut(Easing.cubic));
  const keys: KP[] = [
    [C.renounce, { lean: 0, sF: 20, eF: 20, head: 0, lookX: 1, lookY: 0 }],
    [K.chhoda - 4, { lean: 14, sF: 70, eF: 30, wF: 10, head: 14, lookX: 0.8, lookY: 0.8, brow: 0.5 }],
    [K.chhoda + 10, { lean: 2, sF: 24, eF: 20, head: 0, lookX: 1, lookY: 0, brow: 0.6, browTilt: -4 }],
  ];
  const pp = u > 0 ? { ...kpo(f, keys), ...oathPose(u) } : kpo(f, keys);
  return (
    <Cam f={f} a={C.renounce} b={C.heaven} cx={560} cy={1200} s0={1.0} s1={1.1} hits={[K.chhoda]} amp={6}>
      <FisherSet f={f} mood="dusk" />
      <Dasharaj f={f} id="rnD" x={260} y={1660} s={1.0} facing={1} p={{ lean: -6, sF: 20, eF: 30, head: -4, lookX: 1, lookY: -0.1, brow: 1, browTilt: -6, smile: -0.1 }} />
      <g transform={`translate(${lerp(760, 640, down)} ${lerp(1060, 1690, down)}) scale(${lerp(0.55, 0.9, down)})`} opacity={f >= K.chhoda - 14 ? 1 : 0}>
        <CrownProp glow={0.6} />
      </g>
      <Prince f={f} id="rnP" x={780} y={1650} s={1.08} facing={-1} p={pp} bare={bare} />
    </Cam>
  );
};

/** "आकाश से फूल बरसे… और देवव्रत कहलाए, भीष्म।": the sky opens, petals pour; the chief and Satyavati bow. */
const HeavenWorld: React.FC<{ f: number }> = ({ f }) => {
  const k = prog(f, C.heaven, K.phool + 10, outCubic);
  return (
    <Cam f={f} a={C.heaven} b={C.boon} cx={540} cy={1150} s0={1.12} s1={1.0} hits={[K.beat]} amp={18}>
      <FisherSet f={f} mood="dusk" />
      <HeavenLight f={f} k={k} />
      <rect width={W} height={H} fill="#FFE7A0" opacity={0.12 * k} />
      <Prince f={f} id="hvP" x={540} y={1700} s={1.3} facing={-1} p={{ ...oathPose(1), lookY: -0.6, head: -8, smile: 0.2 }} bare k={0.4} />
      <Dasharaj f={f} id="hvD" x={190} y={1680} s={0.85} facing={1} p={{ lean: 22, head: 14, sF: 70, eF: 112, wF: -20, sB: 66, eB: 104, lookX: 0.6, lookY: 0.4, smile: 0.3 }} />
      <Devi pal={SATYAVATI} id="hvS" f={f} x={900} y={1700} s={0.6} crown="none" hands={[[-14, -520], [14, -520]]} lookX={-0.4} lookY={-0.3} smile={0.4} lean={-4} />
      <FlowerRain f={f} a={K.phool - 6} k={k} />
    </Cam>
  );
};

/** "पिता ने वरदान दिया… मृत्यु तभी आएगी, जब तुम चाहोगे।": the king's hand on his bowed son's head, golden light. */
const BoonWorld: React.FC<{ f: number }> = ({ f }) => {
  const reach = prog(f, C.boon + 6, K.var + 6, Easing.inOut(Easing.cubic));
  const glow = prog(f, K.mrityu - 6, K.mrityu + 20);
  return (
    <Cam f={f} a={C.boon} b={C.moment} cx={540} cy={1150} s0={1.0} s1={1.1}>
      <CourtSet f={f} />
      <circle cx={600} cy={1100} r={520} fill="#FFE7A0" opacity={0.25 * glow} filter="url(#bhBlur20)" />
      <Man f={f} id="bnS" x={790} y={1580} s={1.15} facing={-1} p={{ lean: lerp(0, 6, reach), sF: lerp(14, 104, reach), eF: lerp(16, 22, reach), wF: lerp(0, -24, reach), sB: -6, eB: 10, head: lerp(0, 12, reach), lookX: 1, lookY: 0.6, smile: 0.5, brow: 0.3 }} />
      <Prince f={f} id="bnP" x={330} y={1620} s={1.15} facing={1} p={{ lean: 26, head: 20, sF: 70, eF: 112, wF: -20, sB: 66, eB: 104, lookX: 0.6, lookY: 0.7, smile: 0.2, blink: 0.6 }} bare />
      <Motes f={f} x={300} y={800} w={600} h={800} n={20} color="#FFF0B8" o={glow} seed={17} />
    </Cam>
  );
};

/** "एक पल का फ़ैसला… पूरी उम्र का बंधन।": the oath moment again, frozen, draining of colour. */
const MomentWorld: React.FC<{ f: number }> = ({ f }) => {
  const d = prog(f, C.moment, C.feature, Easing.inOut(Easing.cubic));
  return (
    <g>
      <g transform={`translate(540 1000) scale(${1.04 + 0.06 * d}) translate(-540 -1000)`}>
        <VowWorld f={C.vow + 70} frozen={1} />
      </g>
      <Grey k={0.85 * d} />
      <rect width={W} height={H} fill="#140A1E" opacity={0.25 * d} />
    </g>
  );
};

const FeatureWorld: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.feature} b={C.end} cx={540} cy={1000} s0={1.0} s1={1.04}>
    <rect width={W} height={H} fill="url(#nvSkyPalace)" />
    <circle cx={540} cy={980} r={640} fill="url(#nvWarm)" />
    <SvgImage file="jyotiq/site/hero-left-image.png" x={-140} y={1420} width={460} height={460 * (1216 / 1294)} opacity={0.55} />
    <Petals f={f} n={8} seed={23} o={0.5} />
  </Cam>
);

const EndWorld: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.end} b={TOTAL} cx={540} cy={900} s0={1} s1={1.05}>
    <rect width={W} height={H} fill="url(#nvSkyPalace)" />
    <SunRays x={540} y={760} r={140 + 12 * Math.sin(f / 7)} k={0.6} f={f * 2.5} n={28} />
    <circle cx={540} cy={760} r={480} fill="url(#nvWarm)" />
    <SvgImage file="jyotiq/site/hero-left-image.png" x={-130} y={1500} width={470} height={470 * (1216 / 1294)} opacity={0.7} />
    <SvgImage file="jyotiq/site/hero-right-image.png" x={760} y={1520} width={400} height={400 * (1293 / 1216)} opacity={0.7} />
    <Petals f={f} n={12} seed={31} o={0.8} color="#F6B70E" />
  </Cam>
);

/* ================================================================== */
/* HTML layers                                                         */
/* ================================================================== */

const KEYW = new Set(["देवव्रत…", "हस्तिनापुर", "युवराज।", "दाशराज…", "सत्यवती", "शांतनु", "शर्त", "राज", "वंश", "फूल", "भीष्म।", "वरदान", "मृत्यु", "फ़ैसला…", "बंधन।", "अनुकूल", "प्रतिकूल…", "फ़्री", "ज्योतिक़"]);
const WHO: Record<string, string> = { dasharaj: "दाशराज · मछुआरों के मुखिया", devavrata: "युवराज देवव्रत" };

const KCaption: React.FC<{ f: number }> = ({ f }) => {
  let pi = -1;
  for (let i = 0; i < P.length; i++) {
    const ph = P[i];
    const next = P[i + 1];
    const end = Math.min(next ? next.a - 2 : 1e9, ph.b + 16);
    if (f >= ph.a - 2 && f < end) pi = i;
  }
  if (pi < 0) return null;
  const ph = P[pi];
  const ws = WORDS.filter((w) => w.p === pi);
  const pop = prog(f, ph.a - 2, ph.a + 5, outBack);
  const nextA = P[pi + 1] ? P[pi + 1].a - 2 : 1e9;
  const fadeOut = 1 - prog(f, Math.min(ph.b + 10, nextA - 4), Math.min(ph.b + 16, nextA), outCubic);
  const char = ph.who !== "kaal";
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: CAP_TOP, height: CAP_BOTTOM - CAP_TOP, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div
        style={{
          maxWidth: 900,
          padding: "16px 26px 20px",
          borderRadius: 30,
          background: char ? "rgba(26,16,40,0.92)" : "rgba(255,255,255,0.95)",
          border: `2.5px solid ${char ? S.gold : S.goldLight}`,
          boxShadow: "0 10px 26px rgba(20,10,30,0.3)",
          textAlign: "center",
          fontFamily: MUKTA,
          fontWeight: 700,
          fontSize: 52,
          lineHeight: 1.28,
          color: char ? "#FFF3DA" : S.brown,
          opacity: Math.min(1, pop * 1.4) * fadeOut,
          transform: `scale(${0.88 + 0.12 * pop})`,
          transformOrigin: "50% 100%",
        }}
      >
        {char ? <div style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: 28, color: S.gold, marginBottom: 2 }}>{WHO[ph.who]}</div> : null}
        {ws.map((w, i) => {
          const cur = f >= w.a - 1 && f < (ws[i + 1] ? ws[i + 1].a - 1 : w.b + 12);
          const said = f >= w.a - 1;
          const key = KEYW.has(w.w);
          const k = cur ? prog(f, w.a - 1, w.a + 3, outBack) : 0;
          return (
            <React.Fragment key={i}>
              <span
                style={{
                  display: "inline-block",
                  padding: "0 8px",
                  margin: "2px 0",
                  borderRadius: 14,
                  background: cur ? GRAD : "transparent",
                  color: cur ? "#FFFFFF" : undefined,
                  opacity: said ? 1 : 0.45,
                  transform: `scale(${1 + 0.08 * k})`,
                  boxShadow: cur ? "0 6px 14px rgba(224,72,43,0.35)" : undefined,
                  ...(key && !cur && !char ? { ...gradText, fontWeight: 800 } : {}),
                }}
              >
                {w.w}
              </span>{" "}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};


/** The series title lockup: JYOTIQ PRESENTS · भारत · BHARATA · Episode 2 · भीष्म प्रतिज्ञा. */
const TitleText: React.FC<{ f: number }> = ({ f }) => {
  const a = C.title;
  const t = prog(f, a + 4, a + 18, outBack);
  const sub = prog(f, a + 14, a + 26, outCubic);
  const out = 1 - prog(f, C.prince - 6, C.prince);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: out }}>
      <Presents y={300} o={prog(f, a, a + 8)} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 590, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div
          style={{
            fontFamily: ROZHA,
            fontSize: 250,
            lineHeight: 1.05,
            background: "linear-gradient(180deg, #FFF3C4 0%, #F6C14E 45%, #C07A1E 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextStroke: "3px #5A2E0A",
            filter: "drop-shadow(0 0 22px rgba(12,10,42,0.95)) drop-shadow(0 10px 30px rgba(255,190,80,0.35))",
            transform: `scale(${1.6 - 0.6 * t})`,
            opacity: Math.min(1, t * 2),
          }}
        >
          भारत
        </div>
        <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 40, letterSpacing: 18, color: "#FFE3A1", opacity: sub, marginTop: -10 }}>BHARATA</div>
        <div style={{ marginTop: 24, padding: "12px 34px", borderRadius: 40, background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 44, opacity: sub, transform: `translateY(${(1 - sub) * 30}px)` }}>
          Episode 2 · भीष्म प्रतिज्ञा
        </div>
      </div>
    </div>
  );
};

/** A big stamped word. */
const Stamp: React.FC<{ f: number; at: number; out: number; text: Part[]; y: number; size: number; sub?: string; dark?: boolean }> = ({ f, at, out, text, y, size, sub, dark }) => {
  if (f < at - 2 || f > out + 8) return null;
  const k = prog(f, at - 2, at + 6, outBack);
  const o = Math.min(1, k * 2) * (1 - prog(f, out, out + 8));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", flexDirection: "column", alignItems: "center", opacity: o, transform: `scale(${1.6 - 0.6 * k})` }}>
      <div style={{ padding: "6px 48px 18px", borderRadius: 40, background: dark ? "rgba(26,10,10,0.88)" : "rgba(255,248,238,0.94)", border: `4px solid ${S.gold}`, boxShadow: "0 18px 40px rgba(20,10,10,0.45)" }}>
        <TwoTone parts={text} size={size} />
      </div>
      {sub ? <div style={{ marginTop: 10, padding: "8px 26px", borderRadius: 30, background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 36 }}>{sub}</div> : null}
    </div>
  );
};

/** A fact chip (dark glass, gold edge), centred at y. */
const Chip: React.FC<{ f: number; at: number; out: number; text: string; y?: number }> = ({ f, at, out, text, y = 560 }) => (
  <Pop f={f} at={at} out={out} from="up">
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center" }}>
      <div style={{ padding: "14px 34px", borderRadius: 40, background: "rgba(20,12,34,0.82)", border: `2.5px solid ${S.gold}`, color: "#FFF3DA", fontFamily: MUKTA, fontWeight: 800, fontSize: 44, boxShadow: "0 10px 24px rgba(0,0,0,0.35)" }}>{text}</div>
    </div>
  </Pop>
);


/** Two "given up" chips that strike in as he renounces. */
const GivenUp: React.FC<{ f: number }> = ({ f }) => {
  if (f < K.chhoda - 4 || f > C.heaven + 6) return null;
  const o = 1 - prog(f, C.heaven - 4, C.heaven + 4);
  const one = (at: number, t: string, i: number) => {
    const k = prog(f, at, at + 10, outBack);
    const strike = prog(f, at + 6, at + 14, outCubic);
    return (
      <div key={t} style={{ position: "relative", padding: "12px 30px", borderRadius: 34, background: "rgba(20,12,34,0.85)", border: `2.5px solid ${S.gold}`, color: "#FFF3DA", fontFamily: MUKTA, fontWeight: 800, fontSize: 46, opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - k) * 40}px) rotate(${i ? 2 : -2}deg)` }}>
        {t}
        <div style={{ position: "absolute", left: 18, right: 18, top: "52%", height: 6, borderRadius: 3, background: "#E0482B", transform: `scaleX(${strike})`, transformOrigin: "0 50%" }} />
      </div>
    );
  };
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", gap: 22, opacity: o }}>
      {one(K.chhoda, "राजगद्दी", 0)}
      {one(K.vansh, "विवाह · वंश", 1)}
    </div>
  );
};

/** The "आज का दिन" feature card: अनुकूल / प्रतिकूल, with what to do and what to avoid. */
const DayCard: React.FC<{ f: number }> = ({ f }) => {
  const k = prog(f, C.feature + 2, C.feature + 14, outBack);
  const flip = prog(f, K.din - 4, K.din + 30, Easing.inOut(Easing.cubic));
  const good = Math.sin(flip * Math.PI * 2) > -0.2 || flip > 0.95;
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: 620, opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - k) * 80}px) scale(${0.9 + 0.1 * k})` }}>
      <div style={{ borderRadius: 40, overflow: "hidden", background: "#FFFFFF", border: `3px solid ${S.gold}`, boxShadow: "0 24px 50px rgba(58,31,18,0.3)" }}>
        <div style={{ background: GRAD, padding: "22px 34px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: 54, color: "#FFF" }}>आज का दिन</div>
          <div style={{ padding: "6px 18px", borderRadius: 20, background: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 32, color: S.red }}>फ़्री</div>
        </div>
        <div style={{ padding: "28px 30px 30px", display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", gap: 16 }}>
            {[["अनुकूल", "✓", "#2E8B4A"], ["प्रतिकूल", "✗", "#C8302A"]].map(([t, m, c], i) => {
              const on = (i === 0) === good;
              return (
                <div key={t} style={{ flex: 1, padding: "18px 0", borderRadius: 24, textAlign: "center", background: on ? c : "#FFF8EE", border: `2.5px solid ${on ? c : S.goldLight}`, fontFamily: MUKTA, fontWeight: 800, fontSize: 44, color: on ? "#FFF" : S.brownMid, transform: `scale(${on ? 1.06 : 1})` }}>
                  {m} {t}
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            {[["क्या करें", "आज के शुभ काम"], ["क्या टालें", "आज किन बातों से बचें"]].map(([a, b], i) => (
              <div key={a} style={{ flex: 1, padding: "14px 18px", borderRadius: 22, background: i === 0 ? "#FFF3D6" : "#FDF7EE", border: `2px solid ${S.goldLight}`, opacity: prog(f, A(26) - 6 + i * 6, A(26) + 6 + i * 6) }}>
                <div style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: 38, ...gradText }}>{a}</div>
                <div style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 28, color: S.brownMid }}>{b}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureText: React.FC<{ f: number }> = ({ f }) => (
  <>
    <DayCard f={f} />
    <Pop f={f} at={A(26) + 4} from="up">
      <div style={{ position: "absolute", left: 0, right: 0, top: 1300, display: "flex", justifyContent: "center" }}>
        <div style={{ padding: "14px 34px", borderRadius: 40, background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 46, boxShadow: "0 10px 24px rgba(224,72,43,0.35)" }}>हर दिन फ़्री देखें · ज्योतिक़ ऐप</div>
      </div>
    </Pop>
  </>
);

const EndChip: React.FC<{ t: string; on?: boolean }> = ({ t, on }) => (
  <div style={{ padding: "10px 24px", borderRadius: 30, background: on ? GRAD : "#FFFFFF", border: `2.5px solid ${S.goldLight}`, fontFamily: MUKTA, fontWeight: 700, fontSize: 34, color: on ? "#FFFFFF" : S.brown, boxShadow: "0 6px 14px rgba(58,31,18,0.12)" }}>{t}</div>
);


const EndText: React.FC<{ f: number }> = ({ f }) => {
  const e = C.end;
  const st = (i: number): React.CSSProperties => {
    const k = prog(f, e + 2 + i * 4, e + 12 + i * 4, outBack);
    return { opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - k) * 40}px) scale(${0.85 + 0.15 * k})` };
  };
  const arrow = Math.sin(f / 4) * 8;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 500, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ ...st(0), padding: "16px 40px 20px", borderRadius: 34, background: "rgba(26,16,40,0.92)", border: `3px solid ${S.gold}`, textAlign: "center", boxShadow: "0 14px 30px rgba(20,10,30,0.3)" }}>
        <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 24, letterSpacing: 6, color: S.goldLight }}>अगला एपिसोड · NEXT</div>
        <div style={{ fontFamily: ROZHA, fontSize: 84, lineHeight: 1.1, background: "linear-gradient(180deg, #FFF3C4 0%, #F6C14E 60%, #C07A1E 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>अंबा का श्राप</div>
        <div style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 34, color: "#FFF3DA" }}>जिसने भीष्म की मौत की कसम खाई</div>
      </div>
      <div style={{ ...st(1), display: "flex", alignItems: "center", gap: 20, marginTop: 6 }}>
        <div style={{ width: 120, height: 120, borderRadius: 60, background: "radial-gradient(circle at 50% 40%, #2A1830 0%, #120C16 75%)", border: `3px solid ${S.gold}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Img src={staticFile("jyotiq/logo-full.png")} style={{ width: 82, height: 96, objectFit: "contain" }} />
        </div>
        <TwoTone parts={[p("ज्योतिक़ "), p("डाउनलोड कीजिए", true)]} size={66} />
      </div>
      <div style={{ ...st(2), display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, maxWidth: 940 }}>
        {["आज का दिन", "दशा", "फ़्री कुंडली", "गोचर", "पंचांग"].map((t, i) => (
          <EndChip key={t} t={t} on={i === 0} />
        ))}
      </div>
      <div style={{ ...st(3), display: "flex", gap: 18, marginTop: -6, marginBottom: -6 }}>
        <div style={{ display: "flex", gap: 18, transform: "scale(0.9)" }}>
          <PlayButton glow={0.4 + 0.3 * Math.sin(f / 5)} />
          <AppStoreButton glow={0.4 + 0.3 * Math.sin(f / 5 + 1)} />
        </div>
      </div>
      <div style={{ ...st(4), fontFamily: MUKTA, fontWeight: 800, fontSize: 42, ...gradText }}>
        ऐप का लिंक बायो में <span style={{ display: "inline-block", color: S.red, WebkitTextFillColor: S.red, transform: `translateY(${-Math.abs(arrow)}px)` }}>↑</span> · www.jyotiq.ai
      </div>
      <div style={{ ...st(5), padding: "14px 32px", borderRadius: 28, background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 40, boxShadow: "0 10px 24px rgba(224,72,43,0.35)" }}>
        कमेंट करें: भीष्म की प्रतिज्ञा, सही या ग़लत?
      </div>
      <div style={{ ...st(6), fontFamily: JAKARTA, fontWeight: 600, fontSize: 24, color: S.brownMid, opacity: 0.85 }}>Guidance only, for entertainment and information.</div>
    </div>
  );
};

/* ================================================================== */
/* Composition                                                         */
/* ================================================================== */

type Shot = { a: number; b: number; World: React.FC<{ f: number }> };
const SHOTS: Shot[] = [
  { a: 0, b: C.d1, World: HookWorld },
  { a: C.d1, b: C.r2, World: D1World },
  { a: C.r2, b: C.vow, World: R2World },
  { a: C.vow, b: C.title, World: VowWorld },
  { a: C.title, b: C.prince, World: TitleWorld },
  { a: C.prince, b: C.chief, World: PrinceWorld },
  { a: C.chief, b: C.love, World: ChiefWorld },
  { a: C.love, b: C.sad, World: LoveWorld },
  { a: C.sad, b: C.son, World: SadWorld },
  { a: C.son, b: C.renounce, World: SonWorld },
  { a: C.renounce, b: C.heaven, World: RenounceWorld },
  { a: C.heaven, b: C.boon, World: HeavenWorld },
  { a: C.boon, b: C.moment, World: BoonWorld },
  { a: C.moment, b: C.feature, World: MomentWorld },
  { a: C.feature, b: C.end, World: FeatureWorld },
  { a: C.end, b: TOTAL, World: EndWorld },
];
const XFADE: Record<number, number> = { [C.love]: 8, [C.sad]: 10, [C.son]: 8, [C.boon]: 10, [C.end]: 8 };

export const Bharata2Reel: React.FC = () => {
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
  const inTitle = f >= C.title && f < C.prince;
  const hookOut = 1 - prog(f, C.d1 - 6, C.d1 + 2);
  return (
    <AbsoluteFill style={{ background: "#0C0A2A", overflow: "hidden" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <RigDefs />
        <SetDefs />
        <NvDefs />
        <BhDefs />
        {layers}
      </svg>

      {f < C.d1 + 4 ? (
        <div style={{ position: "absolute", inset: 0, opacity: hookOut, transform: `scale(${1 + 0.015 * Math.sin(f / 10)})`, transformOrigin: "50% 30%" }}>
          <HookPlate y={480} size={66} lines={[[p("पिता की शादी के लिए…")], [p("बेटे ने "), p("सब कुछ छोड़ दिया!", true)]]} chip="फिर आसमान से फूल क्यों बरसे?" />
        </div>
      ) : null}

      <NameChipIn f={f} at={C.prince + 6} out={C.chief - 4} hi="देवव्रत" en="DEVAVRATA" tag="गंगापुत्र · हस्तिनापुर के युवराज" y={520} icon="➶" />
      <NameChipIn f={f} at={C.chief + 6} out={C.love - 4} hi="दाशराज" en="DASHARAJ" tag="मछुआरों के मुखिया · सत्यवती के पिता" y={520} icon="⚓" />
      <Chip f={f} at={K.shart - 2} out={C.son - 4} text="शर्त: सत्यवती का बेटा ही राजा बनेगा" y={560} />
      <GivenUp f={f} />
      <Stamp f={f} at={K.beat} out={C.boon - 2} text={[p("भीष्म", true)]} y={560} size={200} sub="भीषण प्रतिज्ञा करने वाले" dark />
      <Chip f={f} at={K.var} out={C.moment - 4} text="वरदान: इच्छा-मृत्यु" y={560} />
      <Chip f={f} at={A(22) + 2} out={C.feature - 2} text="एक पल… और पूरी उम्र का बंधन" y={600} />

      {inTitle ? <TitleText f={f} /> : null}
      {f >= C.feature && f < C.end + 8 ? <FeatureText f={f} /> : null}
      {f >= C.end ? (
        <div style={{ position: "absolute", inset: 0, opacity: prog(f, C.end, C.end + 8), transform: `scale(${1 + 0.03 * prog(f, C.end, TOTAL, Easing.inOut(Easing.sin))})`, transformOrigin: "50% 45%" }}>
          <EndText f={f} />
        </div>
      ) : null}

      {!inTitle && f < C.end ? <KCaption f={f} /> : null}

      <Flash f={f} at={K.raja} color="#FFFFFF" peak={0.25} rise={1} fall={6} />
      <Flash f={f} at={K.vivah} color="#FFF0B8" peak={0.75} rise={2} fall={12} />
      <Flash f={f} at={C.title} color="#FFF4D6" peak={1} rise={3} fall={14} />
      <Flash f={f} at={C.prince} color="#FFF4D6" peak={0.6} rise={2} fall={10} />
      <Flash f={f} at={K.chhoda} color="#FFE7A0" peak={0.35} fall={8} />
      <Flash f={f} at={K.phool} color="#FFF0B8" peak={0.55} fall={12} />
      <Flash f={f} at={K.beat} color="#FFE2A0" peak={0.8} rise={2} fall={12} />
      <Flash f={f} at={K.mrityu} color="#FFF0B8" peak={0.35} fall={12} />
      <Flash f={f} at={C.feature} peak={0.7} fall={8} />

      <Chrome f={f} brand={1} panel={0} />
    </AbsoluteFill>
  );
};
