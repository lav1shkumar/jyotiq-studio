import React from "react";
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from "remotion";
import { AppStoreButton, PlayButton } from "../../katha/reelKit";
import { Puppet, RigDefs, blinkAt, idle, pose, type Pose, type Who } from "../../manthan/rig";
import { SetDefs } from "../../manthan/sets";
import { Cam, Flash, Motes, NameChipIn, Petals, Pop, lerp, outBack, outCubic, prog } from "../../navagraha/ep1/anim";
import { CAP_BOTTOM, CAP_TOP, Chrome, GRAD, HookPlate, JAKARTA, MUKTA, Part, Presents, ROZHA, S, TwoTone, gradText } from "../../navagraha/ep1/look";
import { NvDefs, SunRays, SvgImage } from "../../navagraha/ep1/world";
import { N2Defs, ShaniKundali, Trishul } from "../../navagraha/ep2/anim2";
import { SHIVA } from "../../navagraha/ep2/cast2";
import { BHISHMA, Bow, Quiver } from "../ep1/cast";
import { Devi, Varmala } from "../ep1/ganga";
import { BhDefs, CourtSet, RiverSet, WarSet } from "../ep1/world";
import { DEVAVRATA_BARE } from "../ep2/cast2";
import { AMBA, AMBALIKA, AMBIKA, SHALVA, SHIKHANDI } from "./cast3";
import { BEATS, ENV, PHRASES, TOTAL, WORDS } from "./timing";
import { Fall, ForestSet, PalaceGate, ShivaBlaze } from "./world3";

/*
 * भारत · BHARATA Episode 3 · अंबा का श्राप. Same kit and rules as Episodes 1-2 (imported read-only): brand bug top-left,
 * no app panel, hook plate from frame 0, the cold open is the argument (Amba vs Bhishma in designed voices, lip-synced
 * from ENV), then the series title, then Kaal narrates; गोचर feature; end card with the next-episode tease.
 * Clock: timing.ts (mahabharat-ep3/tools/vo_prep.py). Audio is muxed after the render.
 */
export const BHARATA3_TOTAL = TOTAL;
const W = 1080;
const H = 1920;
const P = PHRASES;
const A = (i: number) => P[i].a;
const B = (i: number) => P[i].b;
const cue = (p: number, w: string) => (WORDS.find((x) => x.p === p && x.w.startsWith(w)) ?? WORDS.find((x) => x.p === p)!).a;
const p = (t: string, hi = false): Part => ({ t, hi });

const C = {
  aClose: A(1) - 3,
  bClose: A(3) - 4,
  title: BEATS.title[0],
  intro: BEATS.title[1],
  sway: A(6) - 3,
  love: A(8) - 4,
  release: A(9) - 4,
  turn: A(10) - 4,
  shClose: A(11) - 3,
  reject: A(12) - 4,
  tapas: A(13) - 4,
  mahadev: A(14) - 4,
  vision: A(17) - 3,
  shikh: A(18) - 4,
  moment: A(20) - 4,
  feature: A(22) - 4,
  end: B(23) + 6,
};
const K = {
  bhishma0: A(0),
  vivah: A(2),
  nahin: A(4),
  jeet: cue(6, "जीत"),
  bhai: cue(7, "भाई"),
  pher: cue(10, "फेर"),
  thukra: cue(12, "ठुकरा"),
  baras: cue(13, "बरसों"),
  prakat: A(14),
  var: A(15),
  mrityu: cue(17, "मृत्यु"),
  shikh: A(19),
  beat: BEATS.shikhandi[0],
  chhin: cue(21, "छिन"),
  atak: cue(22, "अटक"),
  gochar: cue(23, "गोचर"),
};

/** Mouth openness for a speaker at frame f (their own lines only), lightly smoothed. */
const talk = (f: number, who: string) => {
  const ph = P.find((x) => f >= x.a - 1 && f <= x.b + 1);
  if (!ph || ph.who !== who) return 0;
  const e = (i: number) => ENV[Math.max(0, Math.min(ENV.length - 1, i))] ?? 0;
  return Math.min(1, ((e(f - 1) + 2 * e(f) + e(f + 1)) / 4) * 1.25);
};

/* ------------------------------------------------------------------ */
/* Keyframed motion (as Episode 2)                                     */
/* ------------------------------------------------------------------ */

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
const kpo = (f: number, keys: KP[], lag = 4): Partial<Pose> => {
  const body = kp(f, keys);
  const late = kp(f - lag, keys);
  return { ...body, head: late.head ?? body.head, lookX: late.lookX ?? body.lookX, lookY: late.lookY ?? body.lookY };
};
type PuppetArgs = { f: number; id: string; who: Who; x: number; y: number; s: number; facing?: number; p?: Partial<Pose>; prop?: React.ReactNode; backProp?: React.ReactNode; k?: number };
const Man: React.FC<PuppetArgs> = ({ f, id, who, x, y, s, facing = 1, p: o = {}, prop, backProp, k = 1 }) => (
  <Puppet id={id} who={who} at={{ x, y, s, facing }} p={pose({ ...idle(id, f, k), blink: blinkAt(id, f), ...o })} t={f} prop={prop} backProp={backProp} />
);
type ManArgs = Omit<PuppetArgs, "who">;
const Bhishma: React.FC<ManArgs & { bow?: boolean }> = ({ bow, prop, ...a }) => (
  <Man {...a} who={DEVAVRATA_BARE} prop={prop ?? (bow ? <Bow s={0.9} rot={-4} /> : undefined)} backProp={<g transform="translate(-30 -40)"><Quiver s={0.9} /></g>} />
);
const Shalva: React.FC<ManArgs> = (a) => <Man {...a} who={SHALVA} />;

const Grey: React.FC<{ k: number }> = ({ k }) => (k > 0.01 ? <rect width={W} height={H} fill="#808080" opacity={k} style={{ mixBlendMode: "saturation" }} /> : null);
const Vignette: React.FC<{ o?: number; c?: string }> = ({ o = 0.55, c = "#0A0612" }) => (
  <g opacity={o}>
    <rect width={W} height={260} fill={c} opacity={0.5} />
    <radialGradient id="bh3Vig" cx="0.5" cy="0.5" r="0.75">
      <stop offset="0.55" stopColor={c} stopOpacity="0" />
      <stop offset="1" stopColor={c} stopOpacity="0.9" />
    </radialGradient>
    <rect width={W} height={H} fill="url(#bh3Vig)" />
  </g>
);
const Night: React.FC<{ o?: number }> = ({ o = 0.5 }) => <rect width={W} height={H} fill="#0A0620" opacity={o} />;

/* ================================================================== */
/* Scenes                                                              */
/* ================================================================== */

/** Cold open wide: the night court; Amba storms in and calls him out. */
const HookWorld: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={0} b={C.aClose} cx={540} cy={1150} s0={1.06} s1={1.12} hits={[K.bhishma0]} amp={12}>
    <CourtSet f={f} />
    <Night o={0.45} />
    <Devi pal={AMBA} id="hA" f={f} x={330} y={1760} s={0.78} crown="queen" hands={[[-50, -430], [150, -600]]} lookX={0.7} lookY={0} smile={-0.4} sad={0.5} speak={talk(f, "amba")} lean={4} />
    <Bhishma f={f} id="hB" x={790} y={1760} s={1.3} facing={-1} p={{ lean: -2, sF: 16, eF: 14, head: -2, lookX: 1, lookY: 0, brow: 0.6, browTilt: -8, smile: -0.1 }} />
    <Vignette o={0.6} />
  </Cam>
);

/** "तुमने मेरा जीवन छीन लिया। मुझसे विवाह करो!": Amba close, tears, pointing at him. */
const AmbaClose: React.FC<{ f: number }> = ({ f }) => {
  const plead = prog(f, K.vivah - 8, K.vivah + 6, EASE);
  return (
    <Cam f={f} a={C.aClose} b={C.bClose} cx={540} cy={1000} s0={1.0} s1={1.1} hits={[K.vivah]} amp={8}>
      <CourtSet f={f} />
      <Night o={0.55} />
      <Devi
        pal={AMBA}
        id="aC"
        f={f}
        x={540}
        y={2350}
        s={1.55}
        crown="queen"
        hands={[[lerp(-50, -60, plead), lerp(-430, -470, plead)], [lerp(200, 70, plead), lerp(-720, -520, plead)]]}
        lookX={0.5}
        lookY={0}
        smile={-0.5}
        sad={lerp(0.5, 0.9, plead)}
        tears={prog(f, C.aClose + 10, C.aClose + 40)}
        speak={talk(f, "amba")}
        tilt={lerp(0, -5, plead)}
      />
      <Vignette o={0.6} />
    </Cam>
  );
};

/** "मैं प्रतिज्ञा से बँधा हूँ, अंबा। विवाह नहीं कर सकता।": Bhishma close, hand to his heart, then he looks away. */
const BhishmaClose: React.FC<{ f: number }> = ({ f }) => {
  const keys: KP[] = [
    [C.bClose, { lean: 0, sF: 16, eF: 16, head: 0, lookX: 1, lookY: 0, brow: 0.6, browTilt: -10, smile: -0.2 }],
    [A(3) + 14, { lean: 3, sF: 56, eF: 98, wF: -20, head: 3, lookX: 1, lookY: 0.05, brow: 0.7, browTilt: -12, smile: -0.25 }],
    [K.nahin + 4, { lean: 1, sF: 54, eF: 96, wF: -20, head: -6, lookX: -0.6, lookY: 0.4, brow: 0.8, browTilt: -16, smile: -0.35, blink: 0.3 }],
  ];
  return (
    <Cam f={f} a={C.bClose} b={C.title} cx={560} cy={900} s0={1.0} s1={1.1} hits={[K.nahin]} amp={6}>
      <CourtSet f={f} />
      <Night o={0.55} />
      <Bhishma f={f} id="bC" x={600} y={1980} s={2.6} facing={-1} p={{ ...kpo(f, keys), talk: talk(f, "bhishma") }} k={0.5} />
      <Vignette o={0.6} />
    </Cam>
  );
};

const TitleWorld: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={W} height={H} fill="#0C0A2A" />
    <circle cx={540} cy={820} r={760} fill="#3A1430" opacity={0.8} filter="url(#bhBlur20)" />
    <g transform={`translate(540 820) rotate(${(f - C.title) * 0.6}) translate(-540 -820)`}>
      <SunRays x={540} y={820} r={210} k={0.5} f={f} n={36} />
    </g>
    <circle cx={540} cy={760} r={330} fill="#0C0A2A" opacity={0.72} filter="url(#bhBlur20)" />
    <path d={`M0 1460C300 ${1400 + 10 * Math.sin(f / 8)} 700 ${1520 + 10 * Math.cos(f / 9)} 1080 1440L1080 1920L0 1920Z`} fill="#5A1428" />
    <Petals f={f} n={12} seed={6} o={0.7} color="#E0304A" />
    <Motes f={f} x={60} y={400} w={960} h={1100} n={30} color="#FFE7A0" o={0.8} seed={9} />
  </g>
);

/** "काशी की राजकुमारी अंबा…": Amba at the swayamvara with her garland, lamps and petals. */
const IntroWorld: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.intro} b={C.sway} cx={540} cy={1100} s0={1.14} s1={1.02}>
    <CourtSet f={f} />
    <Devi pal={AMBA} id="iA" f={f} x={540} y={1800} s={0.95} crown="queen" garland lift={0.55} lookX={0.1} lookY={0.1} smile={0.45} />
    <Petals f={f} n={14} seed={12} o={0.8} />
  </Cam>
);

/** "जिसे भीष्म स्वयंवर से जीत लाए थे, अपने छोटे भाई के लिए।": Bhishma with his bow before the three princesses. */
const SwayWorld: React.FC<{ f: number }> = ({ f }) => {
  const draw = prog(f, K.jeet - 12, K.jeet, EASE) * (1 - prog(f, K.jeet + 2, K.jeet + 8));
  const keys: KP[] = [
    [C.sway, { lean: -2, sF: 30, eF: 24, wF: 4, head: -2, lookX: 1, lookY: 0, brow: 0.7, smile: 0 }],
    [K.jeet, { lean: -6, sF: 80, eF: 10, wF: 0, sB: 70, eB: 120, head: -4, lookX: 1, lookY: -0.1, brow: 0.9, browTilt: 10, smile: -0.1 }],
    [K.bhai, { lean: 0, sF: 30, eF: 24, wF: 4, head: 2, lookX: 1, lookY: 0.1, brow: 0.5, smile: 0.2 }],
  ];
  return (
    <Cam f={f} a={C.sway} b={C.love} cx={540} cy={1150} s0={1.0} s1={1.1} hits={[K.jeet]} amp={14}>
      <CourtSet f={f} />
      <Devi pal={AMBIKA} id="sAk" f={f} x={620} y={1640} s={0.58} crown="queen" hands={[[-30, -440], [40, -440]]} lookX={-0.6} smile={-0.1} sad={0.4} />
      <Devi pal={AMBALIKA} id="sAl" f={f} x={940} y={1660} s={0.58} crown="queen" hands={[[-30, -440], [40, -440]]} lookX={-0.6} smile={-0.1} sad={0.4} />
      <Devi pal={AMBA} id="sA" f={f} x={780} y={1700} s={0.66} crown="queen" hands={[[-60, -470], [60, -470]]} lookX={-0.8} smile={-0.3} sad={0.6} />
      <Bhishma f={f} id="sB" x={300} y={1760} s={1.3} facing={1} p={kpo(f, keys)} prop={<Bow s={0.9} rot={-4} draw={draw} />} />
      <Motes f={f} x={100} y={500} w={900} h={900} n={18} color="#FFE7A0" o={0.6} seed={21} />
    </Cam>
  );
};

/** "पर अंबा का मन राजा शाल्व को दे चुका था।": dawn by the river; Amba with the garland she meant for Shalva, his figure in light. */
const LoveWorld: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.love} b={C.release} cx={540} cy={1150} s0={1.08} s1={1.04} dx={-20}>
    <RiverSet f={f} mood="dawn" steps={false} />
    <circle cx={800} cy={1150} r={260} fill="#FFF0D0" opacity={0.5 * prog(f, C.love, C.love + 30)} filter="url(#bhBlur20)" />
    <g opacity={0.9 * prog(f, C.love + 4, C.love + 30)}>
      <Shalva f={f} id="lSh" x={820} y={1560} s={0.8} facing={-1} p={{ lean: 0, sF: 20, eF: 30, head: 0, lookX: 1, lookY: 0.1, smile: 0.4 }} />
    </g>
    <Devi pal={AMBA} id="lA" f={f} x={330} y={1780} s={0.9} crown="queen" garland lift={0.5} lookX={0.8} lookY={-0.1} smile={0.6} tilt={4} />
    <Petals f={f} n={14} seed={8} o={0.7} />
    <Vignette o={0.4} c="#3A1E0A" />
  </Cam>
);

/** "भीष्म ने उसे जाने दिया।": Bhishma's open hand; Amba walks away along the river. */
const ReleaseWorld: React.FC<{ f: number }> = ({ f }) => {
  const go = prog(f, C.release + 6, C.turn + 6, Easing.inOut(Easing.sin));
  return (
    <Cam f={f} a={C.release} b={C.turn} cx={540} cy={1150} s0={1.0} s1={1.06}>
      <RiverSet f={f} mood="dawn" steps={false} />
      <Devi pal={AMBA} id="rA" f={f} x={lerp(700, 860, go)} y={lerp(1640, 1560, go)} s={lerp(0.62, 0.5, go)} crown="queen" hands={[[-40, -430], [44, -436]]} lookX={-0.6} lookY={0.2} smile={0.2} />
      <Bhishma f={f} id="rB" x={290} y={1760} s={1.3} facing={1} p={{ lean: -2, sF: lerp(20, 70, prog(f, C.release, C.release + 14)), eF: 20, wF: -30, head: 2, lookX: 1, lookY: 0.1, brow: 0.4, smile: 0.15 }} />
    </Cam>
  );
};

/** "पर शाल्व ने मुँह फेर लिया…": Shalva's hall; she reaches him, he turns his back. */
const TurnWorld: React.FC<{ f: number }> = ({ f }) => {
  const away = f >= K.pher - 2;
  const keys: KP[] = [
    [C.turn, { lean: 0, sF: 20, eF: 30, head: 0, lookX: 1, lookY: 0, brow: 0.4, smile: 0 }],
    [K.pher - 4, { lean: -4, sF: 16, eF: 20, head: -6, lookX: 0.4, lookY: -0.2, brow: 0.8, browTilt: 14, smile: -0.3 }],
    [K.pher + 12, { lean: 2, sF: 14, eF: 30, wF: 10, sB: 30, eB: 80, head: 4, lookX: 0.6, lookY: -0.2, brow: 0.9, browTilt: 16, smile: -0.2 }],
  ];
  return (
    <Cam f={f} a={C.turn} b={C.shClose} cx={540} cy={1150} s0={1.0} s1={1.1} hits={[K.pher]} amp={6}>
      <CourtSet f={f} />
      <rect width={W} height={H} fill="#2A1A4A" opacity={0.45} />
      <Devi pal={AMBA} id="tA" f={f} x={330} y={1760} s={0.76} crown="queen" hands={[[-40, -470], [120, -520]]} lookX={0.8} smile={0.1} sad={prog(f, K.pher, K.pher + 14) * 0.8} />
      <Shalva f={f} id="tS" x={790} y={1760} s={1.3} facing={away ? 1 : -1} p={kpo(f, keys)} />
      <Vignette o={0.55} />
    </Cam>
  );
};

/** Shalva close: "जिसे कोई और जीत ले गया… उसे मैं नहीं अपनाऊँगा।" over his shoulder, cold. */
const ShalvaClose: React.FC<{ f: number }> = ({ f }) => {
  const keys: KP[] = [
    [C.shClose, { lean: 2, sF: 14, eF: 30, head: 4, lookX: -0.4, lookY: -0.1, brow: 0.8, browTilt: 16, smile: -0.2 }],
    [A(11) + 40, { lean: -2, sF: 40, eF: 60, wF: 20, head: -4, lookX: -0.8, lookY: -0.15, brow: 1, browTilt: 18, smile: -0.35 }],
    [B(11), { lean: 0, sF: 14, eF: 30, head: 8, lookX: 0.3, lookY: -0.2, brow: 0.9, browTilt: 18, smile: -0.3 }],
  ];
  return (
    <Cam f={f} a={C.shClose} b={C.reject} cx={540} cy={900} s0={1.0} s1={1.08}>
      <CourtSet f={f} />
      <rect width={W} height={H} fill="#2A1A4A" opacity={0.5} />
      <Shalva f={f} id="sC" x={520} y={1980} s={2.6} facing={1} p={{ ...kpo(f, keys), talk: talk(f, "shalva") }} k={0.5} />
      <Vignette o={0.6} />
    </Cam>
  );
};

/** "हस्तिनापुर ने भी ठुकरा दिया।": the great gate swings shut in front of her; colour drains. */
const RejectWorld: React.FC<{ f: number }> = ({ f }) => {
  const shut = prog(f, K.thukra - 10, K.thukra + 8, Easing.in(Easing.cubic));
  return (
    <Cam f={f} a={C.reject} b={C.tapas} cx={540} cy={1250} s0={1.02} s1={1.12} hits={[K.thukra + 8]} amp={14}>
      <PalaceGate f={f} shut={shut} />
      <Devi pal={AMBA} id="gA" f={f} x={540} y={1840} s={0.62} crown="queen" hands={[[-30, -420], [40, -420]]} lookX={0} lookY={-0.4} smile={-0.4} sad={0.9} />
      <Grey k={0.45 * prog(f, K.thukra + 8, C.tapas)} />
      <Vignette o={0.55} />
    </Cam>
  );
};

/** "अंबा ने बरसों तप किया।": Amba in tapas in the forest; the seasons pass over her. */
const TapasWorld: React.FC<{ f: number }> = ({ f }) => {
  const u = prog(f, C.tapas, C.mahadev, Easing.linear);
  const season = u * 3;
  return (
    <Cam f={f} a={C.tapas} b={C.mahadev} cx={540} cy={1300} s0={1.12} s1={1.0}>
      <ForestSet f={f} season={season} />
      <Devi pal={AMBA} id="tpA" f={f} x={540} y={1780} s={0.8} crown="none" hands={[[-14, -520], [14, -520]]} eyes={0} lookY={0.2} smile={0} glow={0.3 * u} />
      <Fall f={f} kind={0} k={Math.max(0, 1 - Math.abs(season - 1.5) * 2)} />
      <Fall f={f} kind={1} k={Math.max(0, 1 - Math.abs(season - 2.6) * 2.2)} n={30} />
      <Vignette o={0.5} />
    </Cam>
  );
};

/** Shiva: front hand in abhaya, the trishul behind (Navagraha Ep2's look, built here from the rig). */
const ShivaFig: React.FC<{ f: number; id: string; x: number; y: number; s: number; facing?: number; bless?: number }> = ({ f, id, x, y, s, facing = 1, bless = 1 }) => (
  <Puppet
    id={id}
    who={SHIVA}
    at={{ x, y, s, facing }}
    p={pose({ ...idle(id, f, 0.6), blink: blinkAt(id, f), sF: lerp(10, 30, bless), eF: lerp(16, 135, bless), wF: -10, sB: 18, eB: 30, lookX: 0.7, lookY: 0.4, smile: 0.35, glow: 0.3 })}
    t={f}
    backProp={
      <g>
        <rect x={-6} y={-300} width={12} height={520} rx={6} fill="#8A6A44" stroke="#4A3420" strokeWidth={3} />
        <g fill="none" stroke="#D9DEE8" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round">
          <path d="M0 -300L0 -400" />
          <path d="M-48 -380C-50 -330 -28 -300 0 -300C28 -300 50 -330 48 -380" />
        </g>
        <path d="M0 -418L-10 -392L10 -392Z M-48 -398L-56 -372L-40 -376Z M48 -398L40 -376L56 -372Z" fill="#D9DEE8" />
      </g>
    }
  />
);

/** "महादेव प्रकट हुए… वरदान दिया… अगले जन्म में,": light breaks into the forest, Mahadev blesses the kneeling princess. */
const MahadevWorld: React.FC<{ f: number }> = ({ f }) => {
  const k = prog(f, K.prakat - 6, K.prakat + 16, outCubic);
  const bless = prog(f, K.var - 8, K.var + 6, EASE);
  return (
    <Cam f={f} a={C.mahadev} b={C.vision} cx={540} cy={1150} s0={1.0} s1={1.1} hits={[K.prakat]} amp={16}>
      <ForestSet f={f} season={3} fire={0.6} blaze={k} />
      <ShivaBlaze f={f} k={k} x={720} y={1560} />
      <Trishul x={720} y={420} s={0.7} o={0.6 * k} f={f} />
      <g opacity={k}>
        <ShivaFig f={f} id="mS" x={720} y={1580} s={1.1} facing={-1} bless={bless} />
      </g>
      <Devi pal={AMBA} id="mA" f={f} x={290} y={1800} s={0.78} crown="none" hands={[[-14, -520], [14, -520]]} eyes={prog(f, K.prakat, K.prakat + 10)} lookX={0.8} lookY={-0.3} smile={0.1} lean={6} glow={0.3} />
      <Motes f={f} x={300} y={500} w={700} h={1000} n={24} color="#E6EEFF" o={k} seed={33} />
    </Cam>
  );
};

/** "तुम ही भीष्म की मृत्यु का कारण बनोगी।": a vision of old Bhishma on the field, red sky; the light dims on "मृत्यु". */
const VisionWorld: React.FC<{ f: number }> = ({ f }) => {
  const dim = prog(f, K.mrityu - 4, K.mrityu + 14);
  return (
    <Cam f={f} a={C.vision} b={C.shikh} cx={540} cy={1150} s0={1.12} s1={1.0} hits={[K.mrityu]} amp={10}>
      <WarSet f={f} />
      <rect width={W} height={H} fill="#7A0A14" opacity={0.25 + 0.2 * dim} style={{ mixBlendMode: "multiply" }} />
      <Man f={f} id="vB" who={BHISHMA} x={540} y={1760} s={1.35} facing={-1} p={{ lean: 0, sF: 20, eF: 20, head: -2, lookX: 1, lookY: -0.2, brow: 0.6, smile: 0 }} prop={<Bow s={0.9} rot={-4} />} k={0.4} />
      <Grey k={0.4 * dim} />
      <Vignette o={0.7} c="#1A0408" />
    </Cam>
  );
};

/** "वो जन्मी… शिखंडी बनकर।": out of the dark a young warrior rises, red-lit, bow in hand. */
const ShikhWorld: React.FC<{ f: number }> = ({ f }) => {
  const rise = prog(f, C.shikh, K.shikh + 6, outCubic);
  return (
    <Cam f={f} a={C.shikh} b={C.moment} cx={540} cy={1100} s0={1.0} s1={1.14} hits={[K.beat]} amp={18}>
      <WarSet f={f} />
      <rect width={W} height={H} fill="#140408" opacity={0.6} />
      <circle cx={540} cy={1200} r={520} fill="#FF4A2A" opacity={0.3 * rise} filter="url(#bhBlur20)" />
      <g opacity={rise}>
        <Man f={f} id="shK" who={SHIKHANDI} x={540} y={lerp(1980, 1780, rise)} s={1.5} facing={1} p={{ lean: 0, sF: 30, eF: 24, wF: 4, head: -2, lookX: 0.2, lookY: -0.1, brow: 0.8, browTilt: 10, smile: -0.1, glow: 0.4 }} prop={<Bow s={0.9} rot={-4} />} />
      </g>
      <Motes f={f} x={140} y={500} w={800} h={1100} n={24} color="#FF9A6A" o={rise} seed={41} />
      <Vignette o={0.6} c="#140408" />
    </Cam>
  );
};

/** "मंज़िल के इतने पास… और सब छिन गया।": the garland slips from her hands and falls, frozen and grey. */
const MomentWorld: React.FC<{ f: number }> = ({ f }) => {
  const drop = prog(f, K.chhin - 8, K.chhin + 18, Easing.in(Easing.quad));
  const d = prog(f, C.moment, C.feature, EASE);
  return (
    <g>
      <g transform={`translate(540 1000) scale(${1.04 + 0.06 * d}) translate(-540 -1000)`}>
        <RiverSet f={C.love + 40} mood="dawn" steps={false} />
        <Devi pal={AMBA} id="moA" f={C.love + 40} x={540} y={2050} s={1.3} crown="queen" hands={[[-60, -470], [60, -470]]} lookX={0} lookY={0.5} smile={-0.4} sad={0.9} tears={0.8} />
        <g transform={`translate(540 ${lerp(1450, 1900, drop)}) rotate(${12 * drop})`} opacity={1 - prog(f, K.chhin + 12, K.chhin + 22)}>
          <Varmala a={[-150, 0]} b={[150, 0]} sag={150} t={C.love + 40} glow={0.4} />
        </g>
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
    <ShaniKundali f={f} at={C.feature + 4} x={240} y={760} size={600} hops={[{ at: C.feature + 16, house: 8 }, { at: K.atak + 4, house: 9 }, { at: K.gochar, house: 10 }]} />
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

const KEYW = new Set(["अंबा…", "स्वयंवर", "भाई", "शाल्व", "जाने", "फेर", "हस्तिनापुर", "ठुकरा", "बरसों", "तप", "महादेव", "वरदान", "मृत्यु", "शिखंडी", "मंज़िल", "छिन", "अटक", "गोचर", "ज्योतिक़"]);
const WHO: Record<string, string> = { amba: "अंबा · काशी की राजकुमारी", bhishma: "भीष्म", shalva: "शाल्व · सौभ के राजा" };

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
          const key = KEYW.has(w.w) || [...KEYW].some((k) => w.w.startsWith(k));
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

const TitleText: React.FC<{ f: number }> = ({ f }) => {
  const a = C.title;
  const t = prog(f, a + 4, a + 18, outBack);
  const sub = prog(f, a + 14, a + 26, outCubic);
  const out = 1 - prog(f, C.intro - 6, C.intro);
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
          Episode 3 · अंबा का श्राप
        </div>
      </div>
    </div>
  );
};

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

const Chip: React.FC<{ f: number; at: number; out: number; text: string; y?: number }> = ({ f, at, out, text, y = 560 }) => (
  <Pop f={f} at={at} out={out} from="up">
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center" }}>
      <div style={{ padding: "14px 34px", borderRadius: 40, background: "rgba(20,12,34,0.82)", border: `2.5px solid ${S.gold}`, color: "#FFF3DA", fontFamily: MUKTA, fontWeight: 800, fontSize: 44, boxShadow: "0 10px 24px rgba(0,0,0,0.35)" }}>{text}</div>
    </div>
  </Pop>
);

/** Three rejections, struck through one by one: शाल्व, हस्तिनापुर, भीष्म. */
const Rejected: React.FC<{ f: number }> = ({ f }) => {
  if (f < K.pher - 4 || f > C.tapas + 6) return null;
  const o = 1 - prog(f, C.tapas - 4, C.tapas + 4);
  const one = (at: number, t: string, i: number) => {
    const k = prog(f, at, at + 10, outBack);
    const strike = prog(f, at + 6, at + 14, outCubic);
    return (
      <div key={t} style={{ position: "relative", padding: "12px 26px", borderRadius: 34, background: "rgba(20,12,34,0.85)", border: `2.5px solid ${S.gold}`, color: "#FFF3DA", fontFamily: MUKTA, fontWeight: 800, fontSize: 54, opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - k) * 40}px) rotate(${(i - 1) * 2}deg)` }}>
        {t}
        <div style={{ position: "absolute", left: 16, right: 16, top: "52%", height: 6, borderRadius: 3, background: "#E0482B", transform: `scaleX(${strike})`, transformOrigin: "0 50%" }} />
      </div>
    );
  };
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", gap: 16, opacity: o }}>
      {one(K.pher, "शाल्व", 0)}
      {one(K.thukra, "हस्तिनापुर", 1)}
    </div>
  );
};

/** The गोचर feature card text around the kundali. */
const FeatureText: React.FC<{ f: number }> = ({ f }) => {
  const k = prog(f, C.feature + 2, C.feature + 14, outBack);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - k) * 60}px)` }}>
        <div style={{ padding: "14px 40px", borderRadius: 40, background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 56, boxShadow: "0 10px 24px rgba(224,72,43,0.35)" }}>आपका गोचर</div>
        <div style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 34, color: S.brownMid }}>अभी आसमान में कौन-सा ग्रह कहाँ है?</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1400, display: "flex", justifyContent: "center", gap: 14 }}>
        {["शनि", "राहु", "केतु", "गुरु"].map((t, i) => {
          const kk = prog(f, K.atak - 4 + i * 5, K.atak + 6 + i * 5, outBack);
          return (
            <div key={t} style={{ padding: "10px 26px", borderRadius: 30, background: i === 0 ? GRAD : "#FFFFFF", border: `2.5px solid ${S.goldLight}`, fontFamily: MUKTA, fontWeight: 800, fontSize: 40, color: i === 0 ? "#FFF" : S.brown, opacity: Math.min(1, kk * 1.5), transform: `scale(${0.8 + 0.2 * kk})` }}>
              {t}
            </div>
          );
        })}
      </div>
    </>
  );
};

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
        <div style={{ fontFamily: ROZHA, fontSize: 84, lineHeight: 1.1, background: "linear-gradient(180deg, #FFF3C4 0%, #F6C14E 60%, #C07A1E 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>तीन राजकुमार</div>
        <div style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 34, color: "#FFF3DA" }}>एक अंधा, एक पीला, एक दासी-पुत्र</div>
      </div>
      <div style={{ ...st(1), display: "flex", alignItems: "center", gap: 20, marginTop: 6 }}>
        <div style={{ width: 120, height: 120, borderRadius: 60, background: "radial-gradient(circle at 50% 40%, #2A1830 0%, #120C16 75%)", border: `3px solid ${S.gold}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Img src={staticFile("jyotiq/logo-full.png")} style={{ width: 82, height: 96, objectFit: "contain" }} />
        </div>
        <TwoTone parts={[p("ज्योतिक़ "), p("डाउनलोड कीजिए", true)]} size={66} />
      </div>
      <div style={{ ...st(2), display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, maxWidth: 940 }}>
        {["गोचर", "दशा", "फ़्री कुंडली", "आज का दिन", "पंचांग"].map((t, i) => (
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
        कमेंट करें: अंबा के साथ अन्याय किसने किया?
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
  { a: 0, b: C.aClose, World: HookWorld },
  { a: C.aClose, b: C.bClose, World: AmbaClose },
  { a: C.bClose, b: C.title, World: BhishmaClose },
  { a: C.title, b: C.intro, World: TitleWorld },
  { a: C.intro, b: C.sway, World: IntroWorld },
  { a: C.sway, b: C.love, World: SwayWorld },
  { a: C.love, b: C.release, World: LoveWorld },
  { a: C.release, b: C.turn, World: ReleaseWorld },
  { a: C.turn, b: C.shClose, World: TurnWorld },
  { a: C.shClose, b: C.reject, World: ShalvaClose },
  { a: C.reject, b: C.tapas, World: RejectWorld },
  { a: C.tapas, b: C.mahadev, World: TapasWorld },
  { a: C.mahadev, b: C.vision, World: MahadevWorld },
  { a: C.vision, b: C.shikh, World: VisionWorld },
  { a: C.shikh, b: C.moment, World: ShikhWorld },
  { a: C.moment, b: C.feature, World: MomentWorld },
  { a: C.feature, b: C.end, World: FeatureWorld },
  { a: C.end, b: TOTAL, World: EndWorld },
];
const XFADE: Record<number, number> = { [C.love]: 10, [C.release]: 8, [C.tapas]: 12, [C.moment]: 10, [C.end]: 8 };

export const Bharata3Reel: React.FC = () => {
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
  const hookEnd = A(2) - 4;
  const hookOut = 1 - prog(f, hookEnd - 6, hookEnd + 2);
  return (
    <AbsoluteFill style={{ background: "#0C0A2A", overflow: "hidden" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <RigDefs />
        <SetDefs />
        <NvDefs />
        <N2Defs />
        <BhDefs />
        {layers}
      </svg>

      {f < hookEnd + 4 ? (
        <div style={{ position: "absolute", inset: 0, opacity: hookOut, transform: `scale(${1 + 0.015 * Math.sin(f / 10)})`, transformOrigin: "50% 30%" }}>
          <HookPlate y={420} size={66} lines={[[p("जिसे सबने ठुकराया…")], [p("उसने "), p("भीष्म की मौत", true), p(" माँग ली!")]]} chip="क्या महादेव ने उसकी सुनी?" />
        </div>
      ) : null}

      <NameChipIn f={f} at={C.intro + 6} out={C.sway - 4} hi="अंबा" en="AMBA" tag="काशी की सबसे बड़ी राजकुमारी" y={520} icon="✿" />
      <Chip f={f} at={K.jeet - 2} out={C.love - 4} text="स्वयंवर · तीन राजकुमारियाँ" y={560} />
      <NameChipIn f={f} at={C.love + 8} out={C.release - 4} hi="शाल्व" en="SHALVA" tag="सौभ के राजा · अंबा का प्रेम" y={520} icon="♛" />
      <Rejected f={f} />
      <Chip f={f} at={K.baras} out={C.mahadev - 4} text="बरसों का कठोर तप" y={560} />
      <NameChipIn f={f} at={K.prakat + 4} out={K.var + 6} hi="महादेव" en="MAHADEV" tag="शिव · कैलाशपति" y={520} icon="☾" />
      <Chip f={f} at={K.var + 2} out={C.shikh - 4} text="वरदान: अगले जन्म में भीष्म की मृत्यु का कारण" y={560} />
      <Stamp f={f} at={K.beat} out={C.moment - 2} text={[p("शिखंडी", true)]} y={540} size={180} sub="राजा द्रुपद के घर जन्म" dark />
      <Chip f={f} at={A(20) + 2} out={C.feature - 2} text="मंज़िल के इतने पास…" y={600} />

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

      {!inTitle && f < C.end ? <KCaption f={f} /> : null}

      <Flash f={f} at={K.bhishma0} color="#FFFFFF" peak={0.3} rise={1} fall={6} />
      <Flash f={f} at={K.vivah} color="#FFD0D0" peak={0.25} rise={1} fall={8} />
      <Flash f={f} at={K.nahin} color="#FFF0B8" peak={0.35} rise={2} fall={10} />
      <Flash f={f} at={C.title} color="#FFF4D6" peak={1} rise={3} fall={14} />
      <Flash f={f} at={C.intro} color="#FFF4D6" peak={0.6} rise={2} fall={10} />
      <Flash f={f} at={K.jeet} color="#FFE7A0" peak={0.4} fall={8} />
      <Flash f={f} at={K.thukra + 8} color="#FFFFFF" peak={0.25} fall={8} />
      <Flash f={f} at={K.prakat} color="#E6EEFF" peak={0.8} rise={2} fall={14} />
      <Flash f={f} at={K.mrityu} color="#FF4A4A" peak={0.35} fall={10} />
      <Flash f={f} at={K.beat} color="#FFB09A" peak={0.7} rise={2} fall={12} />
      <Flash f={f} at={C.feature} peak={0.7} fall={8} />

      <Chrome f={f} brand={1} panel={0} />
    </AbsoluteFill>
  );
};
