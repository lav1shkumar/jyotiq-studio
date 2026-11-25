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
import { W5Defs } from "../ep5/world5";
import { Bow6, Ratha } from "../ep6/cast6";
import { W6Defs } from "../ep6/world6";
import { ARJUNA, ClayGuru, DRONA, Dog, EKALAVYA, Target, WrappedHand } from "./cast7";
import { ArenaDusk, Forest7, Gurukul, W7Defs } from "./world7";
import { BEATS, ENV, PHRASES, TOTAL, WORDS } from "./timing";

/*
 * भारत · BHARATA Episode 7 · एकलव्य का अंगूठा (Adi Parva, Sambhava Parva, Ganguli sec. CXXXIV).
 * Built on the approved 21-panel board (Board7.tsx), driven by the voice clock (timing.ts, TOTAL 3407, 113.6 s).
 * Manthan-style short captions, no name/fact chips (Ayush 25 Nov); zodiac-wheel brand bug; no gore — the cutting
 * is carried by a white flash and a birds-burst cutaway; the dog is sealed but unhurt, exactly as in the text.
 */
export const BHARATA7_TOTAL = TOTAL;
const W = 1080;
const H = 1920;
const P = PHRASES;
const LI = (n: number) => P.findIndex((p) => p.l === n);
const A = (n: number) => P[LI(n)].a;
const B = (n: number) => {
  let b = 0;
  P.forEach((p) => { if (p.l === n) b = p.b; });
  return b;
};
const wl = (line: number, prefix: string) => (WORDS.find((x) => x.l === line && x.w.startsWith(prefix)) ?? WORDS.find((x) => x.l === line)!).a;
const pt = (t: string, hi = false): Part => ({ t, hi });

/* cuts */
const C = {
  h1: A(2) - 2,
  title: BEATS.title[0],
  intro: BEATS.title[1],
  gurukul: BEATS.title[1],
  plea: A(4) - 2,
  refuse: A(5) - 2,
  devotion: BEATS.forest[1],
  hunt: A(7) - 2,
  dog: A(8) - 2,
  amazed: A(9) - 2,
  reveal: A(10) - 2,
  stride: A(11) - 2,
  argue: A(12) - 2,
  walk: A(13) - 2,
  prostrate: A(14) - 2,
  demand: A(15) - 2,
  serene: A(16) - 2,
  aftermath: BEATS.cut[1],
  relief: A(18) - 2,
  seed: A(19) - 2,
  feature: BEATS.seed[1],
  end: B(20) + 8,
};

/* key moments */
const K = {
  angutha1: wl(1, "अंगूठा"),
  nishad: wl(5, "निषाद"),
  murti: wl(6, "मूर्ति"),
  saat: wl(8, "सात"),
  shishya: wl(10, "शिष्य"),
  promise: wl(12, "वचन"),
  dakshina: wl(15, "दक्षिणा"),
  angutha15: wl(15, "अंगूठा"),
  pal: wl(16, "पल"),
  kat: wl(17, "कट"),
  chinta: wl(18, "चिंता"),
  karna: wl(19, "कर्ण"),
};

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

type ManArgs = { f: number; id: string; x: number; y: number; s: number; facing?: number; o?: Partial<Pose>; prop?: React.ReactNode; backProp?: React.ReactNode; k?: number };
const Man: React.FC<ManArgs & { who: Who }> = ({ f, id, who, x, y, s, facing = 1, o = {}, prop, backProp, k = 1 }) => (
  <Puppet id={id} who={who} at={{ x, y, s, facing }} p={pose({ ...idle(id, f, k), blink: blinkAt(id, f), ...o })} t={f} prop={prop} backProp={backProp} />
);
const Ek: React.FC<ManArgs> = (a) => <Man {...a} who={EKALAVYA} o={{ talk: talk(a.f, "ekalavya"), ...(a.o ?? {}) }} />;
const Dro: React.FC<ManArgs> = (a) => <Man {...a} who={DRONA} o={{ talk: talk(a.f, "drona"), ...(a.o ?? {}) }} />;
const Arj: React.FC<ManArgs> = (a) => <Man {...a} who={ARJUNA} o={{ talk: talk(a.f, "arjuna"), ...(a.o ?? {}) }} />;

const Vignette: React.FC<{ o?: number; c?: string }> = ({ o = 0.55, c = "#0A0612" }) => (
  <g opacity={o}>
    <radialGradient id={`e7Vig${c.slice(1)}`} cx="0.5" cy="0.5" r="0.75">
      <stop offset="0.55" stopColor={c} stopOpacity="0" />
      <stop offset="1" stopColor={c} stopOpacity="0.9" />
    </radialGradient>
    <rect width={W} height={H} fill={`url(#e7Vig${c.slice(1)})`} />
  </g>
);
const Grey: React.FC<{ k: number }> = ({ k }) => (k > 0.01 ? <rect width={W} height={H} fill="#808080" opacity={k} style={{ mixBlendMode: "saturation" }} /> : null);

/** A single arrow streaking from (x0,y0) to (x1,y1) over [a,b] frames. */
const ArrowFly: React.FC<{ f: number; a: number; b: number; x0: number; y0: number; x1: number; y1: number; o?: number }> = ({ f, a, b, x0, y0, x1, y1, o = 1 }) => {
  const u = prog(f, a, b, Easing.linear);
  if (u <= 0 || u >= 1) return null;
  const x = lerp(x0, x1, u);
  const y = lerp(y0, y1, u);
  const ang = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang})`} opacity={o}>
      <line x1={-90} y1={0} x2={0} y2={0} stroke="#FFE9B8" strokeWidth={5} strokeLinecap="round" opacity={0.35} />
      <line x1={-46} y1={0} x2={0} y2={0} stroke="#C89A5A" strokeWidth={4} strokeLinecap="round" />
      <path d="M0 0L-12 -5L-9 0L-12 5Z" fill="#E8E0D0" />
    </g>
  );
};

/** Birds bursting out of the canopy — the cutaway that carries the cutting (never shown). */
const BirdBurst: React.FC<{ f: number; a: number; n?: number }> = ({ f, a, n = 22 }) => {
  const t = f - a;
  if (t < 0) return null;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const dx = ((i * 137) % 300) - 150 + t * (2.5 + (i % 5) * 0.9) * (i % 2 ? 1 : -1) * 0.6;
        const dy = -t * (3.5 + (i % 4) * 1.1) - ((i * 53) % 120);
        const flap = Math.sin(t / 2 + i) * 5;
        const o = Math.max(0, 1 - t / 55);
        return (
          <path key={i} d={`M0 ${-flap} Q7 ${-8 - flap} 14 0 Q7 ${-3 - flap} 0 ${flap * 0.4} Q-7 ${-3 - flap} -14 0 Q-7 ${-8 - flap} 0 ${-flap}`}
            transform={`translate(${540 + dx} ${760 + dy}) scale(${0.7 + (i % 3) * 0.3})`} fill="#1A1410" opacity={o} />
        );
      })}
    </g>
  );
};

/* ================================================================== */
/* Scenes                                                              */
/* ================================================================== */

/** Cold open, line 1: the demand. Dusk clearing; Drona looms over the kneeling Ekalavya; Arjuna at the treeline. */
const HookWide: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={0} b={C.h1} cx={560} cy={950} s0={1.02} s1={1.14} hits={[K.angutha1]} amp={12}>
    <Forest7 f={f} tod="dusk" beams={0.25} mist={0.4} />
    <circle cx={620} cy={1050} r={480} fill="#FFB050" opacity={0.1} filter="url(#k6Blur24)" />
    <Ek f={f} id="hk_e" x={300} y={1610} s={1.55} facing={1} k={0.4}
      o={{ sF: 46, eF: 118, wF: 8, sB: 40, eB: 112, wB: 8, lean: 14, head: 16, lookX: 0.6, lookY: 0.9, brow: 0.5, browTilt: -8, smile: -0.2, blink: 0.2 }} />
    <Arj f={f} id="hk_a" x={920} y={1560} s={1.15} facing={-1} k={0.4}
      o={{ sF: 14, eF: 22, sB: -8, eB: 12, lookX: -1, brow: 0.5, browTilt: 8, smile: -0.15 }} />
    <Dro f={f} id="hk_d" x={760} y={1500} s={1.85} facing={-1} k={0.4}
      o={{ sF: 62, eF: 24, wF: -6, sB: -6, eB: 14, lean: 4, head: -3, lookX: -0.8, lookY: 0.5, brow: 0.75, browTilt: 12, smile: -0.45, fist: 0.6 }}
      prop={<Bow6 s={0.8} rot={-4} />} />
    <Vignette o={0.6} c="#140A04" />
  </Cam>
);

/** Line 2: the narrator's question — slow close on Ekalavya's still face as the forest darkens. */
const HookQ: React.FC<{ f: number }> = ({ f }) => {
  const dark = prog(f, C.h1, C.title - 10);
  return (
    <Cam f={f} a={C.h1} b={C.title} cx={430} cy={1050} s0={1.06} s1={1.22}>
      <Forest7 f={f} tod="dusk" beams={0.15 * (1 - dark)} mist={0.5} dense={1} />
      <Ek f={f} id="hq_e" x={430} y={1560} s={2.1} facing={1} k={0.25}
        o={{ sF: 46, eF: 118, wF: 8, sB: 40, eB: 112, wB: 8, lean: 12, head: 10, lookX: 0.4, lookY: 0.7, brow: 0.55, browTilt: -6, smile: -0.1, blink: 0.15 }} />
      <rect width={W} height={H} fill="#0A0508" opacity={0.35 * dark} />
      <Vignette o={0.55 + 0.2 * dark} c="#080408" />
    </Cam>
  );
};

/** Title backdrop: the dark forest, the clay idol silhouette lit gold. */
const TitleWorld: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={W} height={H} fill="#100A06" />
    <Forest7 f={f} tod="dusk" beams={0.2} mist={0.35} dense={1} />
    <circle cx={540} cy={1120} r={560} fill="#4A2408" opacity={0.7} filter="url(#k6Blur24)" />
    <g opacity={0.9}>
      <ClayGuru x={540} y={1470} s={1.5} glow={0.5 + 0.2 * Math.sin(f / 6)} />
    </g>
    <path d="M0 1560C300 1520 700 1600 1080 1540L1080 1920L0 1920Z" fill="#160C06" />
  </g>
);

/** Rewind into the story: bright gurukul morning, Ekalavya at the entrance with joined hands, students drilling behind. */
const GurukulWide: React.FC<{ f: number }> = ({ f }) => {
  const walk = prog(f, C.intro + 6, C.intro + 46, Easing.out(Easing.cubic));
  return (
    <Cam f={f} a={C.gurukul} b={C.plea} cx={540} cy={1150} s0={1.12} s1={1.0}>
      <Gurukul f={f} />
      <Arj f={f} id="gw_a1" x={820} y={1530} s={0.8} facing={-1} k={0.6}
        o={{ sF: 88, eF: 6, sB: 80, eB: 84 + 20 * Math.abs(Math.sin(f / 7)), lookX: -1 }} prop={<Bow6 s={0.62} draw={0.5 + 0.4 * Math.abs(Math.sin(f / 7))} arrow={1} />} />
      <Dro f={f} id="gw_d" x={640} y={1480} s={1.45} facing={-1} k={0.4}
        o={{ sF: 22, eF: 30, sB: -6, eB: 14, lookX: -1, lookY: 0.2, brow: 0.3, browTilt: 4, smile: 0 }} prop={<Bow6 s={0.7} rot={-4} />} />
      <Ek f={f} id="gw_e" x={lerp(120, 330, walk)} y={1540} s={1.2} facing={1} k={0.5}
        o={{ sF: 42, eF: 112, wF: 8, sB: 38, eB: 108, wB: 8, lean: 6, head: 8, lookX: 1, lookY: -0.1, brow: 0.35, browTilt: -6, smile: 0.2 }} />
      <Vignette o={0.3} c="#2A1808" />
    </Cam>
  );
};

/** Line 4, the plea: close on Ekalavya, hands joined, hope naked on his face. */
const Plea: React.FC<{ f: number }> = ({ f }) => {
  const keys: KP[] = [
    [C.plea, { sF: 42, eF: 112, wF: 8, sB: 38, eB: 108, wB: 8, lean: 8, head: 10, lookX: 0.8, lookY: -0.2, brow: 0.5, browTilt: -9, smile: 0.15 }],
    [B(4) - 10, { sF: 48, eF: 120, wF: 10, sB: 44, eB: 116, wB: 10, lean: 11, head: 13, lookX: 0.9, lookY: -0.3, brow: 0.65, browTilt: -11, smile: 0.05 }],
  ];
  return (
    <Cam f={f} a={C.plea} b={C.refuse} cx={470} cy={1050} s0={1.04} s1={1.16}>
      <Gurukul f={f} />
      <Dro f={f} id="pl_d" x={880} y={1560} s={1.9} facing={-1} k={0.3}
        o={{ sF: 20, eF: 28, sB: -6, eB: 14, lookX: -1, lookY: 0.5, brow: 0.45, browTilt: 8, smile: -0.2, head: -2 }} />
      <Ek f={f} id="pl_e" x={440} y={1620} s={1.9} facing={1} k={0.4} o={kpo(f, keys)} />
      <Vignette o={0.35} c="#2A1808" />
    </Cam>
  );
};

/** Line 5, the refusal: Drona close — "तुम निषाद हो…" — the arm cuts across, and he turns his back. */
const Refusal: React.FC<{ f: number }> = ({ f }) => {
  const turn = prog(f, B(5) - 26, B(5) - 4);
  const keys: KP[] = [
    [C.refuse, { sF: 30, eF: 40, sB: -6, eB: 14, head: -4, lookX: -0.9, lookY: 0.4, brow: 0.6, browTilt: 11, smile: -0.35 }],
    [K.nishad - 4, { sF: 34, eF: 46, sB: -6, eB: 14, head: -6, lookX: -0.9, lookY: 0.4, brow: 0.75, browTilt: 14, smile: -0.5 }],
    [K.nishad + 8, { sF: 96, eF: 18, wF: -8, sB: -6, eB: 14, head: -7, lean: 5, lookX: -1, brow: 0.85, browTilt: 15, smile: -0.55, fist: 0.5 }],
    [B(5) - 20, { sF: 20, eF: 28, sB: -6, eB: 14, head: 2, lookX: 0.4, brow: 0.5, browTilt: 6, smile: -0.3 }],
  ];
  return (
    <Cam f={f} a={C.refuse} b={C.devotion} cx={500} cy={1000} s0={1.02} s1={1.15} hits={[K.nishad]} amp={8}>
      <Gurukul f={f} />
      <Ek f={f} id="rf_e" x={220} y={1560} s={1.05} facing={1} k={0.4}
        o={{ sF: 44, eF: 114, wF: 8, sB: 40, eB: 110, wB: 8, lean: 8, head: 12, lookX: 1, lookY: -0.1, brow: 0.6, browTilt: -10, smile: -0.25, blink: 0.3 }} />
      <g transform={`translate(${lerp(0, 160, turn)} 0)`}>
        <Dro f={f} id="rf_d" x={520} y={1540} s={2.1} facing={turn > 0.5 ? 1 : -1} k={0.35} o={kpo(f, keys)} prop={<Bow6 s={0.75} rot={-4} />} />
      </g>
      <Vignette o={0.45} c="#201004" />
    </Cam>
  );
};

/** Line 6 + montage beat: the clay guru. Ekalavya sculpts, bows, then practises as the light sweeps day → golden → day. */
const Devotion: React.FC<{ f: number }> = ({ f }) => {
  const u = prog(f, C.devotion, C.hunt, Easing.linear);
  const tod = u < 0.33 ? "golden" : u < 0.66 ? "day" : "golden";
  const drill = u < 0.45 ? 0 : 0.55 + 0.4 * Math.abs(Math.sin((f - C.devotion) / 8));
  const bowing = f < K.murti + 30;
  const arrows = Math.min(7, 2 + Math.floor(u * 8));
  const keys: KP[] = bowing
    ? [
        [C.devotion, { sF: 42, eF: 112, wF: 8, sB: 38, eB: 108, wB: 8, lean: 16, head: 18, lookX: 0.5, lookY: 0.8, brow: 0.3, browTilt: -6, smile: 0.25 }],
        [K.murti + 30, { sF: 42, eF: 112, wF: 8, sB: 38, eB: 108, wB: 8, lean: 4, head: 6, lookX: 0.7, lookY: -0.2, smile: 0.3 }],
      ]
    : [
        [K.murti + 30, { sF: 42, eF: 112, wF: 8, sB: 38, eB: 108, wB: 8, lean: 4, head: 6, lookX: 0.7, lookY: -0.2, smile: 0.3 }],
        [K.murti + 60, { sF: 90, eF: 4, sB: 82, eB: 86, head: -2, lookX: 1, lookY: -0.1, brow: 0.5, browTilt: 6, smile: 0.1 }],
      ];
  return (
    <Cam f={f} a={C.devotion} b={C.hunt} cx={540} cy={1100} s0={1.05} s1={1.0} dx={20}>
      <Forest7 f={f} tod={tod} beams={0.8} mist={0.3} />
      <ClayGuru x={730} y={1290} s={1.05} glow={0.4 + 0.3 * prog(f, K.murti - 10, K.murti + 20)} />
      <Target x={930} y={1230} s={0.85} arrows={arrows} spread={0.35 - 0.2 * u} />
      <Ek f={f} id="dv_e" x={380} y={1560} s={1.4} facing={1} k={0.5} o={kpo(f, keys)}
        prop={bowing ? undefined : <Bow6 s={0.72} draw={drill} arrow={drill > 0.85 ? 1 : 0} />} />
      {drill > 0.92 ? <ArrowFly f={f} a={f - 2} b={f + 4} x0={430} y0={1330} x1={920} y1={1235} o={0.9} /> : null}
      <Vignette o={0.35} c="#1A1004" />
    </Cam>
  );
};

/** Line 7: the hunt — chariots rush the forest edge, the dog runs ahead. */
const Hunt: React.FC<{ f: number }> = ({ f }) => {
  const rush = prog(f, C.hunt, C.hunt + 60, Easing.linear);
  const dogX = lerp(1150, 420, prog(f, C.hunt + 4, C.dog - 10, Easing.linear));
  return (
    <Cam f={f} a={C.hunt} b={C.dog} cx={540} cy={1150} s0={1.0} s1={1.08} dx={-40}>
      <Forest7 f={f} tod="day" beams={0.5} mist={0.25} />
      <g transform={`translate(${lerp(-400, 60, rush)} 0)`}>
        <g transform="translate(180 1450)"><Ratha f={f} s={0.72} facing={1} metal="gold" banner="sunmoon" part="all" /></g>
      </g>
      <g transform={`translate(${lerp(-650, -120, rush)} 0)`}>
        <g transform="translate(300 1520)"><Ratha f={f} s={0.66} facing={1} metal="silver" banner="palm" umbrella={false} part="all" /></g>
      </g>
      <g transform={`translate(0 ${Math.abs(Math.sin(f / 2.5)) * -14})`}>
        <Dog x={dogX} y={1420} s={0.8} facing={-1} mode="bark" f={f} />
      </g>
      <Vignette o={0.3} c="#1A1004" />
    </Cam>
  );
};

/** Line 8, the money shot: the dog barks — on "सात" seven arrows seal its mouth. Alive, unhurt, no blood. */
const DogSealed: React.FC<{ f: number }> = ({ f }) => {
  const sealed = f >= K.saat + 20;
  const arrowAt = (i: number) => K.saat + 2 + i * 3;
  return (
    <Cam f={f} a={C.dog} b={C.amazed} cx={500} cy={1150} s0={1.08} s1={1.2} hits={[0, 1, 2, 3, 4, 5, 6].map((i) => arrowAt(i))} amp={5}>
      <Forest7 f={f} tod="day" beams={0.4} mist={0.3} dense={1} />
      <Ek f={f} id="dg_e" x={240} y={1560} s={1.25} facing={1} k={0.5}
        o={{ sF: 92, eF: 2, sB: 84, eB: 88, head: -2, lookX: 1, lookY: 0.15, brow: 0.6, browTilt: 7, smile: 0 }}
        prop={<Bow6 s={0.75} draw={sealed ? 0.2 : 1} arrow={sealed ? 0 : 1} />} />
      <Dog x={660} y={1445} s={1.05} facing={-1} mode={sealed ? "sealed" : "bark"} f={f} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <ArrowFly key={i} f={f} a={arrowAt(i)} b={arrowAt(i) + 3} x0={330} y0={1290 + i * 4} x1={618 + (i % 3) * 9} y1={1380 + i * 7} />
      ))}
      <Vignette o={0.45} c="#140E04" />
    </Cam>
  );
};

/** Line 9: Arjuna parts the bushes — close, eyes wide: "ये कौन है?… कैसे?" */
const Amazed: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.amazed} b={C.reveal} cx={520} cy={1000} s0={1.05} s1={1.18}>
    <Forest7 f={f} tod="day" beams={0.35} mist={0.35} dense={1} />
    <Dog x={850} y={1300} s={0.62} facing={-1} mode="sealed" f={f} />
    <Arj f={f} id="am_a" x={520} y={1580} s={2.15} facing={-1} k={0.4}
      o={{ sF: 30, eF: 52, wF: 4, sB: 24, eB: 48, wB: 4, lean: 7, head: 4, lookX: -0.6, lookY: 0.1, brow: 0.9, browTilt: -6, smile: -0.1 }} />
    <g opacity={0.85}>
      <ellipse cx={120} cy={1080} rx={150} ry={520} fill="#1E3416" />
      <ellipse cx={980} cy={1080} rx={140} ry={520} fill="#182C12" />
    </g>
    <Vignette o={0.5} c="#101004" />
  </Cam>
);

/** Line 10, the reveal: Ekalavya shoots ceaselessly — then turns, calm and proud: "मैं… द्रोणाचार्य का शिष्य हूँ।" */
const Reveal: React.FC<{ f: number }> = ({ f }) => {
  const speaking = f >= A(10);
  const drill = speaking ? 0.15 : 0.55 + 0.45 * Math.abs(Math.sin((f - C.reveal) / 5.5));
  const keys: KP[] = [
    [C.reveal, { sF: 90, eF: 4, sB: 82, eB: 86, head: -2, lookX: 1, lookY: 0, brow: 0.55, browTilt: 6, smile: 0.05 }],
    [A(10) - 6, { sF: 90, eF: 4, sB: 82, eB: 86, head: -2, lookX: 1, brow: 0.55, browTilt: 6, smile: 0.05 }],
    [K.shishya - 6, { sF: 40, eF: 60, sB: 30, eB: 44, head: 2, lookX: 0.8, lookY: 0, brow: 0.35, browTilt: -4, smile: 0.3 }],
    [K.shishya + 10, { sF: 38, eF: 58, sB: 28, eB: 42, head: 0, lookX: 0.8, brow: 0.3, browTilt: -4, smile: 0.45 }],
  ];
  return (
    <Cam f={f} a={C.reveal} b={C.stride} cx={480} cy={1100} s0={1.0} s1={1.14} hits={[K.shishya]} amp={6}>
      <Forest7 f={f} tod="golden" beams={0.7} mist={0.3} />
      <Target x={900} y={1240} s={0.9} arrows={9} spread={0.12} />
      <Ek f={f} id="rv_e" x={420} y={1560} s={1.6} facing={1} k={0.45} o={kpo(f, keys)} prop={<Bow6 s={0.78} draw={drill} arrow={drill > 0.85 ? 1 : 0} />} />
      {drill > 0.92 && !speaking ? <ArrowFly f={f} a={f - 1} b={f + 3} x0={480} y0={1320} x1={890} y1={1245} o={0.85} /> : null}
      <Vignette o={0.4} c="#1A1004" />
    </Cam>
  );
};

/** Line 11: the irony — Arjuna strides off through the forest, shadow across his face; behind him the boy shoots on, unaware. */
const Stride: React.FC<{ f: number }> = ({ f }) => {
  const walkU = prog(f, C.stride, C.argue - 8, Easing.linear);
  const x = lerp(880, 260, walkU);
  return (
    <Cam f={f} a={C.stride} b={C.argue} cx={500} cy={1100} s0={1.06} s1={1.0} dx={-30}>
      <Forest7 f={f} tod="golden" beams={0.5} mist={0.4} dense={1} />
      <Ek f={f} id="st_e" x={880} y={1470} s={0.85} facing={1} k={0.5}
        o={{ sF: 90, eF: 4, sB: 82, eB: 86 + 20 * Math.abs(Math.sin(f / 6)), lookX: 1, brow: 0.5, browTilt: 6 }}
        prop={<Bow6 s={0.6} draw={0.5 + 0.4 * Math.abs(Math.sin(f / 6))} arrow={1} />} />
      <g transform={`translate(0 ${Math.abs(Math.sin(f / 4)) * -6})`}>
        <Arj f={f} id="st_a" x={x} y={1560} s={1.7} facing={-1} k={0.4}
          o={{ sF: 26, eF: 34, sB: -4, eB: 16, lean: 5, head: 6, lookX: -1, lookY: 0.4, brow: 0.7, browTilt: 13, smile: -0.5, fist: 0.7 }} />
      </g>
      <rect width={W} height={H} fill="#0A0808" opacity={0.18 * walkU} />
      <Vignette o={0.5} c="#100A04" />
    </Cam>
  );
};

/** Line 12: the argument — Arjuna confronts Drona in the courtyard: "आपने वचन दिया था…" */
const Argument: React.FC<{ f: number }> = ({ f }) => {
  const keys: KP[] = [
    [C.argue, { sF: 60, eF: 40, wF: -6, sB: 20, eB: 30, lean: 6, head: -2, lookX: 1, brow: 0.85, browTilt: 14, smile: -0.5, fist: 0.8 }],
    [K.promise - 4, { sF: 96, eF: 20, wF: -10, sB: 20, eB: 30, lean: 8, head: -4, lookX: 1, brow: 0.95, browTilt: 16, smile: -0.55, fist: 0.9 }],
    [B(12) - 8, { sF: 40, eF: 50, sB: 18, eB: 28, lean: 5, head: 0, lookX: 1, brow: 0.8, browTilt: 12, smile: -0.45, fist: 0.7 }],
  ];
  return (
    <Cam f={f} a={C.argue} b={C.walk} cx={500} cy={1050} s0={1.04} s1={1.16} hits={[K.promise]} amp={8}>
      <Gurukul f={f} />
      <Dro f={f} id="ar_d" x={720} y={1520} s={1.8} facing={-1} k={0.3}
        o={{ sF: 18, eF: 26, sB: -6, eB: 14, head: -3, lookX: -1, lookY: 0.15, brow: 0.5 + 0.25 * prog(f, B(12) - 20, B(12)), browTilt: 9, smile: -0.35 }} prop={<Bow6 s={0.72} rot={-4} />} />
      <Arj f={f} id="ar_a" x={360} y={1580} s={1.85} facing={1} k={0.4} o={kpo(f, keys)} />
      <Vignette o={0.42} c="#201004" />
    </Cam>
  );
};

/** Line 13: master and student walk deep into the forest — light dies golden → dusk around them. */
const WalkForest: React.FC<{ f: number }> = ({ f }) => {
  const u = prog(f, C.walk, C.prostrate, Easing.linear);
  const tod = u < 0.5 ? "golden" : "dusk";
  const bob = Math.abs(Math.sin(f / 4)) * -7;
  return (
    <Cam f={f} a={C.walk} b={C.prostrate} cx={540} cy={1150} s0={1.0} s1={1.1}>
      <Forest7 f={f} tod={tod} beams={0.55 * (1 - u)} mist={0.3 + 0.3 * u} dense={1} />
      <g transform={`translate(${lerp(-140, 40, u)} 0)`}>
        <g transform={`translate(0 ${bob})`}>
          <Dro f={f} id="wk_d" x={480} y={1540} s={1.55} facing={1} k={0.35}
            o={{ sF: 20, eF: 28, sB: -6, eB: 14, lean: 3, head: 2, lookX: 1, lookY: 0.2, brow: 0.55, browTilt: 8, smile: -0.3 }} prop={<Bow6 s={0.7} rot={-4} />} />
        </g>
        <g transform={`translate(0 ${-bob})`}>
          <Arj f={f} id="wk_a" x={700} y={1560} s={1.45} facing={1} k={0.35}
            o={{ sF: 22, eF: 30, sB: -4, eB: 14, lean: 3, head: 4, lookX: 1, lookY: 0.3, brow: 0.5, browTilt: 8, smile: -0.2 }} />
        </g>
      </g>
      <Vignette o={0.45 + 0.15 * u} c="#100A04" />
    </Cam>
  );
};

/** Line 14: Ekalavya sees his guru — joy! He prostrates full-length at the clay shrine clearing. */
const Prostrate: React.FC<{ f: number }> = ({ f }) => {
  const down = prog(f, A(14) + 6, A(14) + 26);
  const keys: KP[] = [
    [C.prostrate, { sF: 44, eF: 114, wF: 8, sB: 40, eB: 110, wB: 8, lean: 4, head: 2, lookX: -0.8, lookY: -0.1, brow: 0.4, browTilt: -8, smile: 0.6 }],
    [A(14) + 4, { sF: 48, eF: 120, wF: 10, sB: 44, eB: 116, wB: 10, lean: 10, head: 8, lookX: -0.9, lookY: 0.2, brow: 0.5, browTilt: -10, smile: 0.7 }],
    [A(14) + 26, { sF: 70, eF: 130, wF: 12, sB: 66, eB: 126, wB: 12, lean: 34, head: 26, lookX: -0.6, lookY: 0.9, brow: 0.4, browTilt: -8, smile: 0.5, blink: 0.5 }],
  ];
  return (
    <Cam f={f} a={C.prostrate} b={C.demand} cx={480} cy={1100} s0={1.08} s1={1.0}>
      <Forest7 f={f} tod="dusk" beams={0.3} mist={0.4} />
      <ClayGuru x={760} y={1290} s={0.95} glow={0.4 + 0.2 * Math.sin(f / 6)} />
      <Dro f={f} id="pr_d" x={320} y={1500} s={1.6} facing={1} k={0.3}
        o={{ sF: 20, eF: 28, sB: -6, eB: 14, head: 2, lookX: 1, lookY: 0.5, brow: 0.55, browTilt: 8, smile: -0.25 }} prop={<Bow6 s={0.7} rot={-4} />} />
      <Arj f={f} id="pr_a" x={180} y={1540} s={1.25} facing={1} k={0.3}
        o={{ sF: 20, eF: 28, sB: -4, eB: 14, lookX: 1, lookY: 0.3, brow: 0.45, browTilt: 6, smile: -0.15 }} />
      <g transform={`translate(0 ${down * 130}) rotate(${down * 8} 500 1500)`}>
        <Ek f={f} id="pr_e" x={500} y={1590} s={1.5} facing={-1} k={0.45} o={kpo(f, keys)} />
      </g>
      <Vignette o={0.45} c="#140A04" />
    </Cam>
  );
};

/** Line 15: the demand lands — the hook's mirror. Slow push on Drona; gong on "अंगूठा"; the smile dies on Ekalavya's face. */
const Demand: React.FC<{ f: number }> = ({ f }) => {
  const fade = prog(f, K.angutha15 - 10, B(15));
  const keys: KP[] = [
    [C.demand, { sF: 30, eF: 40, sB: -6, eB: 14, head: -2, lookX: 0.9, lookY: 0.4, brow: 0.6, browTilt: 10, smile: -0.3 }],
    [K.dakshina - 4, { sF: 60, eF: 28, wF: -6, sB: -6, eB: 14, head: -4, lean: 4, lookX: 1, brow: 0.7, browTilt: 12, smile: -0.4, fist: 0.5 }],
    [K.angutha15 + 6, { sF: 96, eF: 16, wF: -8, sB: -6, eB: 14, head: -5, lean: 5, lookX: 1, brow: 0.8, browTilt: 13, smile: -0.45, fist: 0.6 }],
  ];
  return (
    <Cam f={f} a={C.demand} b={C.serene} cx={540} cy={1000} s0={1.03} s1={1.18} hits={[K.angutha15]} amp={12}>
      <Forest7 f={f} tod="dusk" beams={0.2} mist={0.5} dense={1} />
      <Ek f={f} id="dm_e" x={235} y={1580} s={1.6} facing={1} k={0.4}
        o={{ sF: 46, eF: 116, wF: 8, sB: 42, eB: 112, wB: 8, lean: 10 - 4 * fade, head: 10 - 4 * fade, lookX: 0.8, lookY: 0.3, brow: 0.5 + 0.2 * fade, browTilt: -8 + 10 * fade, smile: 0.55 - 0.75 * fade, blink: 0.2 }} />
      <Dro f={f} id="dm_d" x={740} y={1520} s={1.85} facing={-1} k={0.3} o={kpo(f, keys)} prop={<Bow6 s={0.78} rot={-4} />} />
      <circle cx={620} cy={1000} r={460} fill="#FF8030" opacity={0.06 + 0.1 * prog(f, K.angutha15 - 4, K.angutha15 + 6)} filter="url(#k6Blur24)" />
      <Vignette o={0.58} c="#100604" />
    </Cam>
  );
};

/** Line 16 + the cut: serene close — "एक पल भी नहीं" — white flash, and the birds carry what is never shown. */
const Serene: React.FC<{ f: number }> = ({ f }) => {
  const cutK = prog(f, BEATS.cut[0], BEATS.cut[0] + 5);
  const birdsT = BEATS.cut[0] + 4;
  return (
    <Cam f={f} a={C.serene} b={C.aftermath} cx={500} cy={1000} s0={1.1} s1={1.24}>
      <Forest7 f={f} tod="dusk" beams={0.12} mist={0.55} dense={1} />
      {f < birdsT ? (
        <Ek f={f} id="sr_e" x={500} y={1560} s={2.2} facing={1} k={0.25}
          o={{ sF: 40, eF: 90, wF: 6, sB: 36, eB: 84, wB: 6, lean: 3, head: 2, lookX: 0.5, lookY: -0.2, brow: 0.25, browTilt: -5, smile: 0.35, blink: 0.4 }} />
      ) : null}
      {f >= birdsT ? <BirdBurst f={f} a={birdsT} /> : null}
      <rect width={W} height={H} fill="#FFF6E0" opacity={cutK * (1 - prog(f, BEATS.cut[0] + 5, BEATS.cut[0] + 16))} />
      <Vignette o={0.5} c="#080408" />
    </Cam>
  );
};

/** Line 17: aftermath — the wrapped hand, then the slow bow: the lightness is gone. */
const Aftermath: React.FC<{ f: number }> = ({ f }) => {
  const u = prog(f, C.aftermath, C.relief, Easing.linear);
  const weakDraw = u < 0.4 ? 0.1 : 0.25 + 0.18 * Math.abs(Math.sin((f - C.aftermath) / 16));
  return (
    <Cam f={f} a={C.aftermath} b={C.relief} cx={520} cy={1100} s0={1.05} s1={1.0} dx={15}>
      <Forest7 f={f} tod="day" beams={0.4} mist={0.35} />
      <ClayGuru x={800} y={1300} s={0.9} glow={0.25} />
      <Target x={940} y={1260} s={0.8} arrows={1} spread={0.55} />
      {u < 0.35 ? (
        <g transform={`translate(${lerp(0, -60, u / 0.35)} 0)`}>
          <WrappedHand x={500} y={1180} s={2.2} facing={1} />
        </g>
      ) : (
        <Ek f={f} id="af_e" x={420} y={1560} s={1.5} facing={1} k={0.3}
          o={{ sF: 88, eF: 8, sB: 80, eB: 84, lean: 5, head: 8, lookX: 1, lookY: 0.3, brow: 0.55, browTilt: -10, smile: -0.35, blink: 0.3 }}
          prop={<Bow6 s={0.74} draw={weakDraw} arrow={1} />} />
      )}
      {u >= 0.55 && u < 0.75 ? <ArrowFly f={f} a={C.aftermath + Math.floor((C.relief - C.aftermath) * 0.55)} b={C.aftermath + Math.floor((C.relief - C.aftermath) * 0.75)} x0={470} y0={1340} x1={880} y1={1320} o={0.7} /> : null}
      <Grey k={0.25} />
      <Vignette o={0.5} c="#0E0A06" />
    </Cam>
  );
};

/** Line 18: Arjuna drills alone in the gurukul — a small relieved smile; then the shadow passes over his face. */
const Relief: React.FC<{ f: number }> = ({ f }) => {
  const sh = prog(f, K.chinta - 6, B(18));
  return (
    <Cam f={f} a={C.relief} b={C.seed} cx={500} cy={1050} s0={1.04} s1={1.16}>
      <Gurukul f={f} />
      <Arj f={f} id="rl_a" x={500} y={1560} s={1.9} facing={1} k={0.4}
        o={{ sF: 90, eF: 4, sB: 82, eB: 86 + 18 * Math.abs(Math.sin(f / 7)), head: -2, lookX: 1, brow: 0.3 + 0.3 * sh, browTilt: -2 + 8 * sh, smile: 0.3 - 0.55 * sh }}
        prop={<Bow6 s={0.76} draw={0.5 + 0.35 * Math.abs(Math.sin(f / 7))} arrow={1} />} />
      <rect width={W} height={H} fill="#0A0810" opacity={0.3 * sh} />
      <Vignette o={0.45 + 0.15 * sh} c="#100A08" />
    </Cam>
  );
};

/** Line 19, the seed: a far arena at dusk — one more silhouette with a bow, unnamed. Karna's shape only. */
const Seed: React.FC<{ f: number }> = ({ f }) => {
  const grow = prog(f, K.karna - 8, B(19));
  return (
    <Cam f={f} a={C.seed} b={C.feature} cx={540} cy={1150} s0={1.0} s1={1.12} hits={[K.karna]} amp={6}>
      <ArenaDusk f={f} />
      <circle cx={540} cy={1080} r={420} fill="#FF9840" opacity={0.14 + 0.1 * grow} filter="url(#k6Blur24)" />
      <g opacity={0.55 + 0.45 * grow}>
        <Man f={f} id="sd_k" who={ARJUNA} x={540} y={1420} s={0.95} facing={-1} k={0.2}
          o={{ sF: 60, eF: 30, sB: 20, eB: 34, head: -4, lookX: -1, brow: 0.6, browTilt: 10, smile: -0.2, glow: 0.5 * grow }}
          prop={<Bow6 s={0.68} draw={0.3 + 0.3 * grow} rot={6} />} />
      </g>
      <rect width={W} height={H} fill="#120A14" opacity={0.25} />
      <Vignette o={0.6} c="#0E0612" />
    </Cam>
  );
};

const FeatureWorld: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={W} height={H} fill="#171022" />
    <Forest7 f={f} tod="dusk" beams={0.15} mist={0.4} dense={1} />
    <circle cx={540} cy={960} r={620} fill="#3A2410" opacity={0.55} filter="url(#k6Blur24)" />
    <Vignette o={0.45} c="#0E0816" />
  </g>
);
const EndWorld: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={W} height={H} fill="#FFF4E2" />
    <circle cx={540} cy={860} r={700} fill="#FFE3B0" opacity={0.5} filter="url(#k6Blur24)" />
  </g>
);

/* ================================================================== */
/* Text layers                                                         */
/* ================================================================== */

const BrandBug7: React.FC<{ o?: number }> = ({ o = 1 }) =>
  o > 0.01 ? (
    <div style={{ position: "absolute", left: BRAND.x, top: BRAND.y, height: 92, display: "flex", alignItems: "center", gap: 12, padding: "0 26px 0 8px", borderRadius: 60,
      background: "radial-gradient(120% 140% at 20% 50%, rgba(36,22,40,0.9) 0%, rgba(14,10,18,0.88) 100%)", border: "2px solid rgba(223,177,91,0.75)", boxShadow: "0 8px 22px rgba(58,31,18,0.25)", opacity: o }}>
      <Img src={staticFile("jyotiq/logo-zodiac.png")} style={{ width: 76, height: 76, borderRadius: 38, boxShadow: "0 0 0 2px rgba(240,180,80,0.8)" }} />
      <div style={{ fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 38, color: "#F3DB9D", letterSpacing: 2 }}>Jyotiq</div>
    </div>
  ) : null;

const WHO: Record<string, string> = { kaal: "#FFF6E4", drona: "#FFD9A0", ekalavya: "#C8E8B8", arjuna: "#BCD4FF" };
const KEYW = ["अंगूठा", "अंगूठा।", "गुरु-दक्षिणा", "निषाद", "मूर्ति", "सात", "शिष्य", "वचन", "ईर्ष्या", "कर्ण", "ज्योतिक़", "भाषा", "कट", "पल", "गुरु…"];
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
        <div style={{ marginTop: 24, padding: "12px 34px", borderRadius: 40, background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 44, opacity: sub, transform: `translateY(${(1 - sub) * 30}px)` }}>Episode 7 · एकलव्य का अंगूठा</div>
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
  const q = "मेरे लिए क्या सही है… किससे पूछूँ?";
  const typed = Math.round(q.length * prog(f, a + 20, A(20) + 40, Easing.linear));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
      <div style={st(0)}>
        <TwoTone parts={[pt("गुरुकुल ने भेद किया… "), pt("ज्योतिक़ नहीं", true)]} size={62} />
      </div>
      <div style={{ ...st(1), width: 760, borderRadius: 48, background: "#FFF9F0", border: `4px solid ${S.goldLight}`, boxShadow: "0 24px 60px rgba(20,10,30,0.35)", padding: "26px 28px 30px", display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, borderBottom: "2px solid #F0E2CC", paddingBottom: 14 }}>
          <Logo size={64} />
          <div style={{ fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 34, color: S.brown }}>Jyotiq</div>
          <div style={{ marginLeft: "auto", fontFamily: MUKTA, fontWeight: 700, fontSize: 28, color: S.brownMid }}>अपनी भाषा में</div>
        </div>
        <div style={{ alignSelf: "flex-end", maxWidth: 560, minHeight: 50, padding: "16px 22px", borderRadius: "28px 28px 6px 28px", background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 700, fontSize: 38, lineHeight: 1.3 }}>
          {q.slice(0, typed)}
          <span style={{ opacity: Math.sin(f / 3) > 0 ? 1 : 0 }}>|</span>
        </div>
        <div style={{ alignSelf: "flex-start", padding: "16px 26px", borderRadius: "28px 28px 28px 6px", background: "#F3E6D2", color: S.brown, fontFamily: MUKTA, fontWeight: 700, fontSize: 40, opacity: f > A(20) + 40 ? 1 : 0 }}>
          {["●", "●", "●"].map((d, i) => (
            <span key={i} style={{ opacity: 0.4 + 0.6 * Math.max(0, Math.sin(f / 4 - i)) }}>{d} </span>
          ))}
        </div>
      </div>
      <div style={{ ...st(2), padding: "14px 32px", borderRadius: 28, background: "rgba(26,16,40,0.9)", border: `2.5px solid ${S.gold}`, color: "#FFF3DA", fontFamily: MUKTA, fontWeight: 800, fontSize: 42 }}>अपने मन का सवाल… ज्योतिक़ पर पूछिए</div>
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
        <div style={{ fontFamily: ROZHA, fontSize: 84, lineHeight: 1.1, background: "linear-gradient(180deg, #FFF3C4 0%, #F6C14E 60%, #C07A1E 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>कर्ण का अपमान</div>
        <div style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 34, color: "#FFF3DA" }}>"कोई और… कर्ण खड़ा होगा।"</div>
      </div>
      <div style={{ ...st(1), display: "flex", alignItems: "center", gap: 20, marginTop: 6 }}>
        <Logo size={124} />
        <TwoTone parts={[pt("ज्योतिक़ "), pt("डाउनलोड कीजिए", true)]} size={66} />
      </div>
      <div style={{ ...st(2), display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, maxWidth: 940 }}>
        {["सवाल पूछिए", "अपनी भाषा में", "फ़्री कुंडली", "दशा", "पंचांग"].map((t, i) => (
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
      <div style={{ ...st(5), padding: "14px 32px", borderRadius: 28, background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 40 }}>कमेंट करें: द्रोण सही थे… या एकलव्य के साथ अन्याय हुआ?</div>
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
  { a: C.h1, b: C.title, World: HookQ },
  { a: C.title, b: C.intro, World: TitleWorld },
  { a: C.intro, b: C.plea, World: GurukulWide },
  { a: C.plea, b: C.refuse, World: Plea },
  { a: C.refuse, b: C.devotion, World: Refusal },
  { a: C.devotion, b: C.hunt, World: Devotion },
  { a: C.hunt, b: C.dog, World: Hunt },
  { a: C.dog, b: C.amazed, World: DogSealed },
  { a: C.amazed, b: C.reveal, World: Amazed },
  { a: C.reveal, b: C.stride, World: Reveal },
  { a: C.stride, b: C.argue, World: Stride },
  { a: C.argue, b: C.walk, World: Argument },
  { a: C.walk, b: C.prostrate, World: WalkForest },
  { a: C.prostrate, b: C.demand, World: Prostrate },
  { a: C.demand, b: C.serene, World: Demand },
  { a: C.serene, b: C.aftermath, World: Serene },
  { a: C.aftermath, b: C.relief, World: Aftermath },
  { a: C.relief, b: C.seed, World: Relief },
  { a: C.seed, b: C.feature, World: Seed },
  { a: C.feature, b: C.end, World: FeatureWorld },
  { a: C.end, b: TOTAL, World: EndWorld },
];
const XFADE: Record<number, number> = { [C.intro]: 8, [C.devotion]: 10, [C.aftermath]: 12, [C.feature]: 10, [C.end]: 8 };

export const Bharata7Reel: React.FC<{ audio?: boolean }> = ({ audio = false }) => {
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
  const hookOut = 1 - prog(f, A(2) + 10, A(2) + 18);
  const brand = inTitle || f >= C.feature ? 0 : 1;
  return (
    <AbsoluteFill style={{ background: "#100A06", overflow: "hidden" }}>
      {audio ? <Audio src={staticFile("jyotiq/bharata/ep7/mix.wav")} /> : null}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <RigDefs />
        <SetDefs />
        <NvDefs />
        <N2Defs />
        <BhDefs />
        <ChDefs />
        <W5Defs />
        <W6Defs />
        <W7Defs />
        {layers}
      </svg>
      {hookOut > 0.01 ? (
        <div style={{ position: "absolute", inset: 0, opacity: hookOut, transform: `scale(${1 + 0.015 * Math.sin(f / 10)})`, transformOrigin: "50% 20%" }}>
          <HookPlate y={300} size={60} lines={[[pt("गुरु ने माँगा… "), pt("अंगूठा", true)], [pt("न्याय… "), pt("या अन्याय?", true)]]} />
        </div>
      ) : null}
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

      <Flash f={f} at={K.angutha1} color="#FFB070" peak={0.3} rise={1} fall={8} />
      <Flash f={f} at={C.title} color="#FFF4D6" peak={1} rise={3} fall={14} />
      <Flash f={f} at={C.intro} color="#FFF4D6" peak={0.5} rise={2} fall={10} />
      <Flash f={f} at={K.nishad} color="#FF9A60" peak={0.2} fall={8} />
      <Flash f={f} at={K.saat + 2} color="#FFE7A0" peak={0.35} rise={1} fall={6} />
      <Flash f={f} at={K.shishya} color="#FFE7A0" peak={0.25} fall={8} />
      <Flash f={f} at={K.angutha15} color="#FF8A50" peak={0.45} rise={1} fall={10} />
      <Flash f={f} at={K.karna} color="#C080FF" peak={0.2} fall={10} />
      <Flash f={f} at={C.feature} peak={0.6} fall={8} />

      <BrandBug7 o={brand} />
    </AbsoluteFill>
  );
};
