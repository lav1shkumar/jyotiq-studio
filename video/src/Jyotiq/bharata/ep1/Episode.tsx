import React from "react";
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from "remotion";
import { Baby } from "../../chhath/cast";
import { AppStoreButton, PlayButton } from "../../katha/reelKit";
import { Puppet, RigDefs, blinkAt, idle, pose, type Pose, type Who } from "../../manthan/rig";
import { SetDefs } from "../../manthan/sets";
import { Cam, Flash, Motes, NameChipIn, Petals, Pop, lerp, outBack, outCubic, prog } from "../../navagraha/ep1/anim";
import { CAP_BOTTOM, CAP_TOP, Chrome, GRAD, HookPlate, JAKARTA, MUKTA, Part, Presents, ROZHA, S, TwoTone, gradText } from "../../navagraha/ep1/look";
import { NvDefs, SunRays, SvgImage } from "../../navagraha/ep1/world";
import { BHISHMA, Bow, DEVAVRATA, GANGA, Makara, Quiver, SHANTANU, Vasu } from "./cast";
import { Devi } from "./ganga";
import { BEATS, ENV, PHRASES, TOTAL, WORDS } from "./timing";
import { ArrowDam, BhDefs, CourtSet, Ripples, RiverSet, SoulLight, Splash, Vortex, WarSet, WaterFront } from "./world";

/*
 * भारत · BHARATA Episode 1 · गंगा के सात बेटे. One Manthan-format reel (TOTAL frames, 30 fps, 1080x1920) on the Navagraha
 * site-look kit (brand bug top-left, app panel top-right). Clock: timing.ts (mahabharat-ep1/tools/vo_prep.py).
 * Cold open = the argument (Shantanu and Ganga in their designed voices, lip-synced from ENV), then the series title,
 * then Kaal narrates; दशा feature; end card with the next-episode tease. Audio is muxed after the render.
 * Motion: every gesture is keyframed (kp) with eased in-outs, and the head follows the arms a few frames late (overlap),
 * so necks and hands move together rather than snapping.
 */
export const BHARATA1_TOTAL = TOTAL;
const W = 1080;
const H = 1920;
const P = PHRASES;
const A = (i: number) => P[i].a;
const B = (i: number) => P[i].b;
const cue = (p: number, w: string) => (WORDS.find((x) => x.p === p && x.w.startsWith(w)) ?? WORDS.find((x) => x.p === p)!).a;
const p = (t: string, hi = false): Part => ({ t, hi });

const C = {
  g1: A(1) - 3,
  s2: A(2) - 3,
  leave: A(3) - 4,
  title: BEATS.title[0],
  ganga: BEATS.title[1],
  king: A(6) - 3,
  vow: A(8) - 6,
  sons: A(10) - 6,
  vasus: A(12) - 6,
  eighth: A(15) - 6,
  gone: A(16) - 6,
  years: A(17) - 6,
  bhishma: A(19) - 6,
  moment: A(20) - 4,
  feature: A(21) - 4,
  end: B(22) + 6,
};
const K = {
  ruko: A(0) + 2,
  rukna: A(4),
  shart: cue(8, "शर्त"),
  kabhi: A(9),
  vasu: A(13),
  mukt: cue(14, "मुक्त"),
  lamba: cue(15, "लंबा"),
  lauta: cue(17, "लौटा"),
  dev: A(18),
  bhishma: cue(19, "भीष्म"),
  beat: BEATS.bhishma[0],
  dasha: cue(21, "दशा"),
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
type T2 = [number, number];
const kh = (f: number, keys: [number, T2, T2][]): [T2, T2] => {
  if (f <= keys[0][0]) return [keys[0][1], keys[0][2]];
  for (let i = 0; i < keys.length - 1; i++) {
    const [fa, l0, r0] = keys[i];
    const [fb, l1, r1] = keys[i + 1];
    if (f < fb) {
      const u = EASE((f - fa) / Math.max(1, fb - fa));
      return [[lerp(l0[0], l1[0], u), lerp(l0[1], l1[1], u)], [lerp(r0[0], r1[0], u), lerp(r0[1], r1[1], u)]];
    }
  }
  const l = keys[keys.length - 1];
  return [l[1], l[2]];
};

type PuppetArgs = { f: number; id: string; who?: Who; x: number; y: number; s: number; facing?: number; p?: Partial<Pose>; prop?: React.ReactNode; backProp?: React.ReactNode; k?: number };
const Man: React.FC<PuppetArgs> = ({ f, id, who = SHANTANU, x, y, s, facing = 1, p: o = {}, prop, backProp, k = 1 }) => (
  <Puppet id={id} who={who} at={{ x, y, s, facing }} p={pose({ ...idle(id, f, k), blink: blinkAt(id, f), ...o })} t={f} prop={prop} backProp={backProp} />
);

/** Ganga with a baby in her arms (hands meet under the bundle). */
const GangaBaby: React.FC<{
  f: number; id: string; x: number; y: number; s: number; hands: [T2, T2]; life?: number; glow?: number; tilt?: number; lean?: number;
  lookX?: number; lookY?: number; smile?: number; speak?: number; sad?: number; tears?: number; halo?: number; aura?: number; baby?: boolean; eyes?: number;
}> = ({ f, id, x, y, s, hands, life = 0.9, glow = 0, baby = true, aura = 0, ...r }) => {
  const bx = x + s * ((hands[0][0] + hands[1][0]) / 2 + 6);
  const by = y + s * ((hands[0][1] + hands[1][1]) / 2 - 30);
  return (
    <g>
      <Devi pal={GANGA} id={id} f={f} x={x} y={y} s={s} crown="ganga" hands={hands} glow={aura} {...r} />
      {baby ? (
        <g transform={`translate(${bx} ${by})`}>
          <Baby f={f} s={s * 1.25} life={life} rot={-10} glow={glow} />
        </g>
      ) : null}
    </g>
  );
};

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

const HOOK_KEYS: KP[] = [
  [0, { lean: 12, sF: 100, eF: 22, wF: -6, sB: 40, eB: 36, head: 4, lookX: 1, lookY: -0.2, brow: 1, browTilt: 16, smile: -0.6 }],
  [K.ruko + 4, { lean: 18, sF: 122, eF: 8, wF: -14, sB: 60, eB: 24, head: 8, lookX: 1, lookY: -0.3, brow: 1, browTilt: 20, smile: -0.7 }],
  [C.g1, { lean: 14, sF: 116, eF: 14, wF: -10, sB: 46, eB: 30, head: 4, lookX: 1, lookY: -0.4, brow: 0.9, browTilt: 14, smile: -0.6 }],
];

/** Cold open: storm dusk on the Ganga. She holds the eighth baby out over the water; the king lunges from the ghat. */
const HookWorld: React.FC<{ f: number; freeze?: boolean }> = ({ f, freeze }) => {
  const hands = kh(f, [[0, [-40, -470], [92, -478]], [K.ruko, [-30, -500], [104, -508]], [C.g1, [-20, -520], [100, -530]]]);
  return (
    <Cam f={f} a={0} b={C.g1} cx={560} cy={1150} s0={1.0} s1={1.12} hits={freeze ? [] : [K.ruko]} amp={18}>
      <RiverSet f={f} mood="storm" sunX={820} bolts={[-2, 46]} />
      <GangaBaby f={f} id="hG" x={770} y={1790} s={0.95} hands={hands} tilt={6} lean={2} lookX={-0.15} lookY={0.7} smile={-0.2} sad={0.5} life={0.9} />
      <WaterFront f={f} y={1440} x0={430} />
      <Ripples f={f} x={780} y={1450} k={0.8} />
      <Man f={f} id="hS" x={250} y={1640} s={1.02} facing={1} p={{ ...kpo(f, HOOK_KEYS), talk: talk(f, "shantanu"), fist: 0 }} />
    </Cam>
  );
};

/** "आपने वचन दिया था, राजन्… कोई सवाल नहीं।": Ganga close, calm, the baby at her breast; her head turns to the king. */
const G1World: React.FC<{ f: number }> = ({ f }) => {
  const tilt = lerp(-2, -9, prog(f, C.g1 + 4, C.g1 + 30));
  return (
    <Cam f={f} a={C.g1} b={C.s2} cx={560} cy={960} s0={1.02} s1={1.1}>
      <RiverSet f={f} mood="storm" steps={false} sunX={300} bolts={[C.g1 + 70]} />
      <rect width={W} height={H} fill="#0E0A26" opacity={0.25} />
      <GangaBaby f={f} id="g1" x={560} y={2330} s={2.05} hands={[[-36, -500], [96, -520]]} tilt={tilt} lookX={-0.55} lookY={0.05} smile={-0.1} sad={0.35} speak={talk(f, "ganga")} />
      <WaterFront f={f} y={1840} o={0.8} />
      <Motes f={f} x={160} y={500} w={760} h={900} n={18} color="#BFF6FA" o={0.6} seed={5} />
    </Cam>
  );
};

/** "बस… अब और नहीं।": the king close, tear-lit; head drops on "बस…", snaps up on "अब और नहीं". */
const S2World: React.FC<{ f: number }> = ({ f }) => {
  const keys: KP[] = [
    [C.s2, { lean: 4, head: -14, sF: 30, eF: 50, sB: 20, eB: 40, lookX: 0.6, lookY: 0.7, brow: 0.7, browTilt: -20, smile: -0.8, blink: 0.3 }],
    [A(2) + 26, { lean: 2, head: -16, sF: 32, eF: 54, lookX: 0.6, lookY: 0.8, brow: 0.8, browTilt: -22, smile: -0.8, blink: 0.5 }],
    [A(2) + 40, { lean: 10, head: 6, sF: 80, eF: 20, wF: -10, sB: 30, eB: 30, lookX: 1, lookY: -0.2, brow: 1, browTilt: 18, smile: -0.7, blink: 0 }],
  ];
  return (
    <Cam f={f} a={C.s2} b={C.leave} cx={500} cy={900} s0={1.0} s1={1.1} hits={[A(2) + 40]} amp={8}>
      <RiverSet f={f} mood="storm" steps={false} sunX={850} />
      <rect width={W} height={H} fill="#1A0E2A" opacity={0.3} />
      <Man f={f} id="s2" x={470} y={1960} s={2.7} facing={1} p={{ ...kpo(f, keys, 5), talk: talk(f, "shantanu") }} k={0.5} />
      <Tears f={f} x={590} y={1000} s={2.7} />
    </Cam>
  );
};

const Tears: React.FC<{ f: number; x: number; y: number; s: number }> = ({ f, x, y, s }) => (
  <g opacity={0.85}>
    {[0].map((i) => {
      const run = ((f * 1.4 + i * 23) % 50) / 50;
      return (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path d={`M0 0C2 ${12 * s} 3 ${24 * s} 4 ${34 * s}`} stroke="#DFF3FF" strokeWidth={1.4 * s} fill="none" strokeLinecap="round" opacity={0.6} />
          <ellipse cx={1 + 3 * run} cy={run * 34 * s} rx={1.3 * s} ry={1.8 * s} fill="#EAF8FF" opacity={1 - run * 0.5} />
        </g>
      );
    })}
  </g>
);

/** "तो वचन टूट गया। अब मैं रुक नहीं सकती।": the river rises around her in a vortex; she sinks away with the child. */
const LeaveWorld: React.FC<{ f: number; a: number; b: number; rise: number; id: string }> = ({ f, a, b, rise, id }) => {
  const v = prog(f, rise - 6, b - 2, Easing.in(Easing.quad));
  const sink = prog(f, rise + 10, b + 4, Easing.in(Easing.cubic));
  const kneel: KP[] = [
    [a, { lean: 16, sF: 90, eF: 14, wF: -10, sB: 40, eB: 30, head: 4, lookX: 1, lookY: -0.3, brow: 1, browTilt: -10, smile: -0.6 }],
    [rise + 10, { lean: 28, sF: 100, eF: 4, wF: -16, sB: 60, eB: 20, head: 10, lookX: 1, lookY: 0.2, brow: 1, browTilt: -18, smile: -0.8 }],
    [b, { lean: 34, sF: 70, eF: 30, wF: -6, sB: 30, eB: 40, head: 18, lookX: 0.8, lookY: 0.8, brow: 1, browTilt: -22, smile: -0.9 }],
  ];
  return (
    <Cam f={f} a={a} b={b} cx={620} cy={1150} s0={1.0} s1={1.16} hits={[rise]} amp={10}>
      <RiverSet f={f} mood="storm" sunX={820} bolts={[rise + 2]} />
      <Vortex f={f} x={760} y={1460} k={v} h={1000} />
      <g opacity={1 - prog(f, b - 14, b)}>
        <GangaBaby f={f} id={id} x={770} y={1790 + 520 * sink} s={0.95} hands={[[-30, -500], [100, -510]]} tilt={-6} lookX={-0.5} lookY={0} smile={-0.2} sad={0.6} speak={talk(f, "ganga")} aura={v} life={0.9} glow={v * 0.6} />
      </g>
      <WaterFront f={f} y={1440 - 120 * v} x0={430} />
      <Ripples f={f} x={780} y={1450} k={1} n={4} />
      <Man f={f} id={`${id}S`} x={250} y={1640} s={1.02} facing={1} p={{ ...kpo(f, kneel, 5), talk: talk(f, "shantanu") }} />
      <Splash x={770} y={1430} u={prog(f, b - 18, b + 4, Easing.linear)} s={1.3} />
      <rect width={W} height={H} fill="#BFF6FA" opacity={0.25 * v} />
    </Cam>
  );
};

/** The series title (under the brand bug): a gold Kuru sun-wheel turning over the river of light. */
const TitleWorld: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={W} height={H} fill="#0C0A2A" />
    <circle cx={540} cy={820} r={760} fill="#2A1E5A" opacity={0.8} filter="url(#bhBlur20)" />
    <g transform={`translate(540 820) rotate(${(f - C.title) * 0.6}) translate(-540 -820)`}>
      <SunRays x={540} y={820} r={210} k={0.5} f={f} n={36} />
    </g>
    <circle cx={540} cy={760} r={330} fill="#0C0A2A" opacity={0.72} filter="url(#bhBlur20)" />
    <circle cx={540} cy={820} r={190} fill="none" stroke="#E8B04A" strokeWidth={8} opacity={0.8} />
    {Array.from({ length: 24 }, (_, i) => (
      <path key={i} d="M540 820L540 650" stroke="#E8B04A" strokeWidth={4} opacity={0.3} transform={`rotate(${i * 15 + (f - C.title) * 0.6} 540 820)`} />
    ))}
    <path d={`M0 1460C300 ${1400 + 10 * Math.sin(f / 8)} 700 ${1520 + 10 * Math.cos(f / 9)} 1080 1440L1080 1920L0 1920Z`} fill="#1E5A78" />
    {Array.from({ length: 9 }, (_, i) => (
      <path key={i} d={`M${((i * 140 + f * 3) % 1260) - 90} ${1500 + i * 40}q40 -10 80 0`} stroke="#BFF6FA" strokeWidth={4} fill="none" opacity={0.5} />
    ))}
    <Motes f={f} x={60} y={400} w={960} h={1100} n={30} color="#FFE7A0" o={0.8} seed={9} />
  </g>
);

/** "वो थीं देवी गंगा…": her divine form at dawn, standing on the makara, halo and light. */
const GangaWorld: React.FC<{ f: number }> = ({ f }) => {
  const rise = prog(f, C.ganga, C.ganga + 30, outCubic);
  return (
    <Cam f={f} a={C.ganga} b={C.king} cx={540} cy={1000} s0={1.14} s1={1.0} dy={-30}>
      <RiverSet f={f} mood="dawn" steps={false} sunX={540} />
      <circle cx={540} cy={900} r={640} fill="url(#bhGlowTeal)" opacity={0.55} />
      <g transform={`translate(0 ${lerp(160, 0, rise)})`}>
        <g transform="translate(520 1500)">
          <Makara f={f} s={1.15} />
        </g>
        <Devi pal={GANGA} id="gD" f={f} x={500} y={1390} s={0.95} crown="ganga" pose="abhaya" halo={1} glow={0.9} lookX={0} lookY={0.2} smile={0.4} tilt={-3} />
      </g>
      <WaterFront f={f} y={1500} o={0.85} />
      <Petals f={f} n={10} seed={4} o={0.5} color="#FFFFFF" />
    </Cam>
  );
};

/** "और राजा, हस्तिनापुर के शांतनु।": the Kuru king before his elephant throne. */
const KingWorld: React.FC<{ f: number }> = ({ f }) => {
  const keys: KP[] = [
    [C.king, { lean: 0, sF: 10, eF: 14, sB: -6, eB: 10, head: -2, lookX: 0.2, smile: 0.25 }],
    [A(7) + 6, { lean: -2, sF: 62, eF: 70, wF: -30, sB: -4, eB: 12, head: 2, lookX: 0.3, lookY: -0.1, smile: 0.35 }],
    [C.vow, { lean: -2, sF: 58, eF: 74, wF: -30, head: 0, lookX: 0.3, smile: 0.3 }],
  ];
  return (
    <Cam f={f} a={C.king} b={C.vow} cx={540} cy={1100} s0={1.12} s1={1.0}>
      <CourtSet f={f} />
      <Man f={f} id="kS" x={500} y={1600} s={1.25} facing={1} p={kpo(f, keys)} />
    </Cam>
  );
};

/** The promise (memory): dawn ghat; Ganga raises a hand with her one condition; the king lays a hand on his heart. */
const VowWorld: React.FC<{ f: number }> = ({ f }) => {
  const up = prog(f, K.shart - 6, K.shart + 10);
  const nod = prog(f, K.kabhi + 10, K.kabhi + 30);
  const king: KP[] = [
    [C.vow, { lean: 0, sF: 12, eF: 16, head: 0, lookX: 1, lookY: 0, smile: 0.5 }],
    [K.kabhi + 12, { lean: 8, sF: 52, eF: 96, wF: -20, head: 8, lookX: 1, lookY: 0.2, smile: 0.4 }],
    [C.sons, { lean: 10, sF: 54, eF: 98, wF: -20, head: 10, lookX: 1, lookY: 0.3, smile: 0.35 }],
  ];
  return (
    <Cam f={f} a={C.vow} b={C.sons} cx={540} cy={1150} s0={1.0} s1={1.08}>
      <RiverSet f={f} mood="dawn" sunX={540} />
      <Man f={f} id="vS" x={300} y={1640} s={1.05} facing={1} p={{ ...kpo(f, king), head: (kpo(f, king).head ?? 0) + 6 * Math.sin(Math.PI * nod) }} />
      <Devi pal={GANGA} id="vG" f={f} x={760} y={1660} s={0.8} crown="ganga" hands={[[-58, -440], [lerp(58, 150, up), lerp(-440, -640, up)]]} openR palmRot={lerp(-80, 4, up)} lookX={-0.6} lookY={0.1} smile={0.25} tilt={-4} />
      <rect width={W} height={H} fill="#FFB45A" opacity={0.12} style={{ mixBlendMode: "multiply" }} />
      <Vignette o={0.6} c="#3A1E0A" />
    </Cam>
  );
};

/** "सात बेटे जन्मे… सातों गंगा में बहा दिए गए।": dusk; she wades in; seven lights drift downstream one by one. */
const SonsWorld: React.FC<{ f: number }> = ({ f }) => {
  const t = (i: number) => lerp(A(10) + 4, B(11) - 6, i / 6);
  return (
    <Cam f={f} a={C.sons} b={C.vasus} cx={540} cy={1150} s0={1.0} s1={1.06} dx={-20}>
      <RiverSet f={f} mood="dusk" sunX={760} />
      {Array.from({ length: 7 }, (_, i) => {
        const k = prog(f, t(i), t(i) + 10, outCubic);
        const d = Math.max(0, f - t(i));
        return k > 0 ? <SoulLight key={i} f={f} x={640 + d * 2.4} y={1180 + i * 6 - d * 0.5} s={0.55 + 0.1 * k} k={k * (1 - prog(d, 90, 140))} seed={i} /> : null;
      })}
      <GangaBaby f={f} id="sG" x={610} y={1620} s={0.62} hands={[[-36, -500], [96, -510]]} tilt={4} lookX={0.3} lookY={0.8} smile={-0.1} sad={0.4} life={0.9} glow={0.4} />
      <WaterFront f={f} y={1380} x0={300} x1={1120} />
      <Ripples f={f} x={610} y={1390} k={0.7} />
      <Man f={f} id="sS" x={170} y={1700} s={0.95} facing={1} p={{ lean: 4, head: 6, sF: 6, eF: 10, fist: 1, lookX: 1, lookY: 0.2, brow: 0.8, browTilt: -16, smile: -0.7 }} k={0.4} />
    </Cam>
  );
};

/** "वो बच्चे श्राप से जन्मे वसु देवता थे। गंगा उन्हें मुक्त कर रही थीं।": the lights rise and become the Vasus. */
const VasuWorld: React.FC<{ f: number }> = ({ f }) => {
  const rise = prog(f, C.vasus, K.vasu + 6, Easing.inOut(Easing.cubic));
  const free = prog(f, K.mukt - 4, K.mukt + 14, outCubic);
  const slot = (i: number): T2 => {
    const a = Math.PI * (1.1 + (0.8 * i) / 7);
    return [540 + Math.cos(a) * 400, 980 + Math.sin(a) * 420];
  };
  return (
    <Cam f={f} a={C.vasus} b={C.eighth} cx={540} cy={900} s0={1.06} s1={1.0}>
      <RiverSet f={f} mood="dusk" steps={false} sunX={540} />
      <rect width={W} height={H} fill="#0A0824" opacity={0.45} />
      <circle cx={540} cy={700} r={560} fill="#FFE7A0" opacity={0.12 + 0.18 * free} filter="url(#bhBlur20)" />
      {Array.from({ length: 8 }, (_, i) => {
        const [sx, sy] = slot(i);
        if (i === 7) {
          return <circle key={i} cx={sx} cy={sy} r={34} fill="none" stroke="#FFE7A0" strokeWidth={3} strokeDasharray="8 8" opacity={0.6 * rise} />;
        }
        const x0 = 380 + i * 50;
        const y0 = 1260;
        const u = prog(f, C.vasus + i * 4, K.vasu + i * 3, Easing.inOut(Easing.cubic));
        const x = lerp(x0, sx, u);
        const y = lerp(y0, sy, u) - Math.sin(Math.PI * u) * 80;
        const morph = prog(f, K.vasu + i * 2, K.vasu + 14 + i * 2);
        return (
          <g key={i}>
            <SoulLight f={f} x={x} y={y} s={0.6} k={1 - morph} seed={i} />
            <g transform={`translate(${x} ${y})`}>
              <Vasu f={f} s={1 + 0.35 * free} k={morph} seed={i} />
            </g>
          </g>
        );
      })}
      <Motes f={f} x={100} y={300} w={880} h={1000} n={30} color="#FFF0B8" o={free} seed={13} />
    </Cam>
  );
};

/** "पर आठवें को धरती पर लंबा जीवन जीना था।": the eighth light comes down into the baby in her arms (the hook moment). */
const EighthWorld: React.FC<{ f: number }> = ({ f }) => {
  const down = prog(f, C.eighth, K.lamba, Easing.inOut(Easing.cubic));
  const lit = prog(f, K.lamba - 4, K.lamba + 10);
  return (
    <Cam f={f} a={C.eighth} b={C.gone} cx={720} cy={1200} s0={1.0} s1={1.18}>
      <RiverSet f={f} mood="storm" sunX={820} />
      <GangaBaby f={f} id="eG" x={770} y={1790} s={0.95} hands={[[-40, -470], [92, -478]]} tilt={6} lookX={-0.1} lookY={0.8} smile={0.05} sad={0.3} life={1} glow={lit} />
      <SoulLight f={f} x={lerp(540, 830, down)} y={lerp(420, 1330, down)} s={0.8} k={1 - lit * 0.8} />
      <WaterFront f={f} y={1440} x0={430} />
      <Man f={f} id="eS" x={250} y={1640} s={1.02} facing={1} p={{ lean: 14, sF: 90, eF: 12, wF: -10, sB: 40, eB: 30, head: 4, lookX: 1, lookY: -0.2, brow: 0.6, browTilt: 4, smile: -0.2 }} />
    </Cam>
  );
};

/** "बरसों बाद बेटा लौटा… देवव्रत।": mist; a wall of arrows checks the river; the prince walks out of the water. */
const YearsWorld: React.FC<{ f: number }> = ({ f }) => {
  const dam = prog(f, C.years + 4, K.lauta, Easing.out(Easing.cubic));
  const walk = prog(f, K.lauta - 6, K.dev + 10, Easing.out(Easing.cubic));
  const keys: KP[] = [
    [C.years, { lean: 0, sF: 40, eF: 30, wF: 0, sB: -10, eB: 12, head: 0, lookX: 0.4, lookY: 0, smile: 0.2 }],
    [K.dev, { lean: -2, sF: 30, eF: 24, wF: 4, sB: -8, eB: 14, head: -4, lookX: 0.1, lookY: -0.1, smile: 0.45 }],
  ];
  return (
    <Cam f={f} a={C.years} b={C.bhishma} cx={540} cy={1150} s0={1.08} s1={1.0}>
      <RiverSet f={f} mood="mist" steps={false} sunX={380} />
      <ArrowDam f={f} y={1190} u={dam} />
      <Devi pal={GANGA} id="yG" f={f} x={820} y={1520} s={0.62} crown="ganga" pose="abhaya" halo={0.6} glow={0.6} lookX={-0.4} smile={0.45} tilt={-4} />
      <rect x={0} y={0} width={W} height={H} fill="#FFFFFF" opacity={0.12} />
      <Man
        f={f}
        id="yD"
        who={DEVAVRATA}
        x={480}
        y={lerp(1800, 1650, walk)}
        s={1.2}
        facing={1}
        p={kpo(f, keys)}
        prop={<Bow s={0.9} rot={-4} />}
        backProp={<g transform="translate(-30 -40)"><Quiver s={0.9} /></g>}
      />
      <WaterFront f={f} y={lerp(1420, 1600, walk)} o={0.8} />
    </Cam>
  );
};

/** "जिसे दुनिया भीष्म के नाम से जानेगी।": flash-forward to Kurukshetra; the old Bhishma, bow in hand. */
const BhishmaWorld: React.FC<{ f: number }> = ({ f }) => {
  const keys: KP[] = [
    [C.bhishma, { lean: 0, sF: 30, eF: 24, wF: 4, sB: -10, eB: 12, head: 0, lookX: 0.5, smile: 0 }],
    [K.bhishma + 6, { lean: -4, sF: 78, eF: 64, wF: -12, sB: -4, eB: 10, head: -6, lookX: 0.2, lookY: -0.3, brow: 0.4, browTilt: 6, smile: 0.05 }],
  ];
  return (
    <Cam f={f} a={C.bhishma} b={C.moment} cx={540} cy={1200} s0={1.0} s1={1.14} hits={[K.beat]} amp={20}>
      <WarSet f={f} />
      <Man f={f} id="bB" who={BHISHMA} x={480} y={1760} s={1.35} facing={1} p={kpo(f, keys)} prop={<Bow s={0.95} rot={-4} />} backProp={<g transform="translate(-30 -40)"><Quiver s={0.95} /></g>} k={0.5} />
      <rect width={W} height={H} fill="#FF6A1F" opacity={0.1} style={{ mixBlendMode: "multiply" }} />
      <rect y={0} width={W} height={120} fill="#000000" opacity={0.85} />
      <rect y={H - 120} width={W} height={120} fill="#000000" opacity={0.85} />
    </Cam>
  );
};

/** "पल भर में सब बदल गया।": the hook moment again, frozen, draining of colour. */
const MomentWorld: React.FC<{ f: number }> = ({ f }) => {
  const d = prog(f, C.moment, C.feature, Easing.inOut(Easing.cubic));
  return (
    <g>
      <g transform={`translate(540 1100) scale(${1.06 + 0.06 * d}) translate(-540 -1100)`}>
        <HookWorld f={14} freeze />
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

const KEYW = new Set(["गंगा…", "गंगा", "शांतनु।", "हस्तिनापुर", "शर्त", "सात", "सातों", "श्राप", "वसु", "मुक्त", "आठवें", "लंबा", "देवव्रत।", "भीष्म", "दशा", "फ़्री", "ज्योतिक़", "वचन"]);
const WHO: Record<string, string> = { shantanu: "राजा शांतनु", ganga: "देवी गंगा" };

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

/** The series title lockup: JYOTIQ PRESENTS · भारत · BHARATA · Episode 1 · गंगा के सात बेटे. */
const TitleText: React.FC<{ f: number }> = ({ f }) => {
  const a = C.title;
  const t = prog(f, a + 4, a + 18, outBack);
  const sub = prog(f, a + 16, a + 28, outCubic);
  const out = 1 - prog(f, C.ganga - 6, C.ganga);
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
          Episode 1 · गंगा के सात बेटे
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

const DEV = ["०", "१", "२", "३", "४", "५", "६", "७"];
/** The seven-sons counter: ticks up as each light enters the river. */
const SonsCounter: React.FC<{ f: number }> = ({ f }) => {
  if (f < C.sons || f > C.vasus + 6) return null;
  const t = (i: number) => lerp(A(10) + 4, B(11) - 6, i / 6);
  let n = 0;
  for (let i = 0; i < 7; i++) if (f >= t(i)) n = i + 1;
  const last = n ? t(n - 1) : C.sons;
  const k = prog(f, last, last + 6, outBack);
  const o = Math.min(prog(f, C.sons, C.sons + 6), 1 - prog(f, C.vasus, C.vasus + 6));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 540, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "10px 36px", borderRadius: 50, background: "rgba(20,12,34,0.82)", border: `3px solid ${S.gold}` }}>
        <div style={{ fontFamily: ROZHA, fontSize: 110, lineHeight: 1, color: "#FFE3A1", transform: `scale(${1.3 - 0.3 * k})` }}>{DEV[n]}</div>
        <div style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: 46, color: "#FFF3DA" }}>बेटे · गंगा में</div>
      </div>
    </div>
  );
};

/** The दशा feature card: a Vimshottari strip with "आप यहाँ हैं" marker sliding to the current dasha. */
const DashaCard: React.FC<{ f: number }> = ({ f }) => {
  const k = prog(f, C.feature + 2, C.feature + 14, outBack);
  const mark = prog(f, K.dasha - 6, K.dasha + 20, Easing.inOut(Easing.cubic));
  const seq = ["केतु", "शुक्र", "सूर्य", "चंद्र", "मंगल", "राहु", "गुरु", "शनि", "बुध"];
  const cur = 6;
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: 620, opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - k) * 80}px) scale(${0.9 + 0.1 * k})` }}>
      <div style={{ borderRadius: 40, overflow: "hidden", background: "#FFFFFF", border: `3px solid ${S.gold}`, boxShadow: "0 24px 50px rgba(58,31,18,0.3)" }}>
        <div style={{ background: GRAD, padding: "22px 34px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: 54, color: "#FFF" }}>आपकी दशा</div>
          <div style={{ padding: "6px 18px", borderRadius: 20, background: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 32, color: S.red }}>फ़्री</div>
        </div>
        <div style={{ padding: "28px 30px 30px", display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {seq.map((g, i) => {
              const on = i === cur && mark > 0.6;
              return (
                <div key={g} style={{ flex: 1, padding: "14px 0", borderRadius: 14, textAlign: "center", background: on ? GRAD : i < cur ? "#F6E9D2" : "#FFF8EE", border: `2px solid ${S.goldLight}`, fontFamily: MUKTA, fontWeight: 800, fontSize: 26, color: on ? "#FFF" : S.brown, transform: `scale(${on ? 1.12 : 1})` }}>
                  {g}
                </div>
              );
            })}
          </div>
          <div style={{ position: "relative", height: 60 }}>
            <div style={{ position: "absolute", left: `${lerp(2, (cur / 9) * 100 + 3, mark)}%`, top: 0, padding: "6px 18px", borderRadius: 20, background: S.brown, color: S.goldLight, fontFamily: MUKTA, fontWeight: 800, fontSize: 30, whiteSpace: "nowrap" }}>▲ आप यहाँ</div>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            {[["महादशा", "कब से कब तक"], ["अंतर्दशा", "अभी क्या चल रहा है"]].map(([a, b], i) => (
              <div key={a} style={{ flex: 1, padding: "14px 18px", borderRadius: 22, background: i === 0 ? "#FFF3D6" : "#FDF7EE", border: `2px solid ${S.goldLight}`, opacity: prog(f, A(22) - 6 + i * 6, A(22) + 6 + i * 6) }}>
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
    <DashaCard f={f} />
    <Pop f={f} at={A(22) + 4} from="up">
      <div style={{ position: "absolute", left: 0, right: 0, top: 1300, display: "flex", justifyContent: "center" }}>
        <div style={{ padding: "14px 34px", borderRadius: 40, background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 46, boxShadow: "0 10px 24px rgba(224,72,43,0.35)" }}>अपनी दशा फ़्री में देखें · ज्योतिक़ ऐप</div>
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
        <div style={{ fontFamily: ROZHA, fontSize: 84, lineHeight: 1.1, background: "linear-gradient(180deg, #FFF3C4 0%, #F6C14E 60%, #C07A1E 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>भीष्म प्रतिज्ञा</div>
        <div style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 34, color: "#FFF3DA" }}>एक बेटा, जिसने अपना सब कुछ छोड़ दिया</div>
      </div>
      <div style={{ ...st(1), display: "flex", alignItems: "center", gap: 20, marginTop: 6 }}>
        <div style={{ width: 120, height: 120, borderRadius: 60, background: "radial-gradient(circle at 50% 40%, #2A1830 0%, #120C16 75%)", border: `3px solid ${S.gold}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Img src={staticFile("jyotiq/logo-full.png")} style={{ width: 82, height: 96, objectFit: "contain" }} />
        </div>
        <TwoTone parts={[p("ज्योतिक़ "), p("डाउनलोड कीजिए", true)]} size={66} />
      </div>
      <div style={{ ...st(2), display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, maxWidth: 940 }}>
        {["दशा", "फ़्री कुंडली", "गोचर", "पंचांग", "होरा"].map((t, i) => (
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
        कमेंट करें: शांतनु सही थे या गंगा?
      </div>
      <div style={{ ...st(6), fontFamily: JAKARTA, fontWeight: 600, fontSize: 24, color: S.brownMid, opacity: 0.85 }}>Guidance only, for entertainment and information.</div>
    </div>
  );
};

/* ================================================================== */
/* Composition                                                         */
/* ================================================================== */

const L1: React.FC<{ f: number }> = ({ f }) => <LeaveWorld f={f} a={C.leave} b={C.title} rise={K.rukna} id="l1" />;
const L2: React.FC<{ f: number }> = ({ f }) => <LeaveWorld f={f} a={C.gone} b={C.years} rise={A(16) + 6} id="l2" />;

type Shot = { a: number; b: number; World: React.FC<{ f: number }> };
const SHOTS: Shot[] = [
  { a: 0, b: C.g1, World: HookWorld },
  { a: C.g1, b: C.s2, World: G1World },
  { a: C.s2, b: C.leave, World: S2World },
  { a: C.leave, b: C.title, World: L1 },
  { a: C.title, b: C.ganga, World: TitleWorld },
  { a: C.ganga, b: C.king, World: GangaWorld },
  { a: C.king, b: C.vow, World: KingWorld },
  { a: C.vow, b: C.sons, World: VowWorld },
  { a: C.sons, b: C.vasus, World: SonsWorld },
  { a: C.vasus, b: C.eighth, World: VasuWorld },
  { a: C.eighth, b: C.gone, World: EighthWorld },
  { a: C.gone, b: C.years, World: L2 },
  { a: C.years, b: C.bhishma, World: YearsWorld },
  { a: C.bhishma, b: C.moment, World: BhishmaWorld },
  { a: C.moment, b: C.feature, World: MomentWorld },
  { a: C.feature, b: C.end, World: FeatureWorld },
  { a: C.end, b: TOTAL, World: EndWorld },
];
const XFADE: Record<number, number> = { [C.vow]: 8, [C.sons]: 8, [C.vasus]: 10, [C.years]: 12, [C.end]: 8 };

export const Bharata1Reel: React.FC = () => {
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
  const inTitle = f >= C.title && f < C.ganga;
  const hookOut = 1 - prog(f, C.g1 - 6, C.g1 + 2);
  return (
    <AbsoluteFill style={{ background: "#0C0A2A", overflow: "hidden" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <RigDefs />
        <SetDefs />
        <NvDefs />
        <BhDefs />
        {layers}
      </svg>

      {f < C.g1 + 4 ? (
        <div style={{ position: "absolute", inset: 0, opacity: hookOut, transform: `scale(${1 + 0.015 * Math.sin(f / 10)})`, transformOrigin: "50% 30%" }}>
          <HookPlate y={500} size={62} lines={[[p("सात बेटे गंगा में बहा दिए…")], [p("आठवें पर "), p("राजा चीख पड़ा!", true)]]} chip="वो माँ कौन थी?" />
        </div>
      ) : null}

      <NameChipIn f={f} at={C.ganga + 8} out={C.king - 4} hi="देवी गंगा" en="GANGA" tag="नदी की देवी · मकर पर विराजमान" y={520} icon="✦" />
      <NameChipIn f={f} at={C.king + 6} out={C.vow - 4} hi="राजा शांतनु" en="SHANTANU" tag="हस्तिनापुर के कुरुवंशी सम्राट" y={520} icon="♔" />
      <Chip f={f} at={K.shart} out={C.sons - 4} text="शर्त: कभी नहीं रोकेंगे, कभी सवाल नहीं" y={560} />
      <SonsCounter f={f} />
      <Chip f={f} at={K.vasu - 2} out={C.eighth - 4} text="८ वसु देवता · ऋषि वसिष्ठ का श्राप" y={560} />
      <Chip f={f} at={K.lamba - 2} out={C.gone - 2} text="आठवाँ बेटा: धरती पर लंबा जीवन" y={560} />
      <NameChipIn f={f} at={K.dev - 2} out={C.bhishma - 4} hi="देवव्रत" en="DEVAVRATA" tag="गंगा और शांतनु का पुत्र" y={520} icon="➶" />
      <Stamp f={f} at={K.beat} out={C.moment - 2} text={[p("भीष्म", true)]} y={560} size={200} sub="गंगापुत्र भीष्म" dark />
      <Chip f={f} at={A(20) + 2} out={C.feature - 2} text="एक पल… और पूरी ज़िंदगी बदल गई" y={600} />

      {inTitle ? <TitleText f={f} /> : null}
      {f >= C.feature && f < C.end + 8 ? <FeatureText f={f} /> : null}
      {f >= C.end ? (
        <div style={{ position: "absolute", inset: 0, opacity: prog(f, C.end, C.end + 8), transform: `scale(${1 + 0.03 * prog(f, C.end, TOTAL, Easing.inOut(Easing.sin))})`, transformOrigin: "50% 45%" }}>
          <EndText f={f} />
        </div>
      ) : null}

      {!inTitle && f < C.end ? <KCaption f={f} /> : null}

      <Flash f={f} at={K.ruko} color="#FFFFFF" peak={0.35} rise={1} fall={6} />
      <Flash f={f} at={C.title} color="#DFFBFF" peak={1} rise={3} fall={14} />
      <Flash f={f} at={C.ganga} color="#FFF4D6" peak={0.7} rise={2} fall={10} />
      <Flash f={f} at={K.mukt} color="#FFF0B8" peak={0.45} fall={12} />
      <Flash f={f} at={C.years} color="#FFFFFF" peak={0.8} rise={3} fall={14} />
      <Flash f={f} at={K.beat} color="#FFE2A0" peak={0.8} rise={2} fall={12} />
      <Flash f={f} at={C.feature} peak={0.7} fall={8} />

      <Chrome f={f} brand={1} panel={0} />
    </AbsoluteFill>
  );
};
