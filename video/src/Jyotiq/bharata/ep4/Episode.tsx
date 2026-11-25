import React from "react";
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from "remotion";
import { AppStoreButton, PlayButton } from "../../katha/reelKit";
import { Kamandalu, Puppet, RigDefs, blinkAt, idle, pose, type Pose, type Who } from "../../manthan/rig";
import { SetDefs } from "../../manthan/sets";
import { Cam, Flash, Kundali, Motes, NameChipIn, Petals, Pop, lerp, outBack, outCubic, prog } from "../../navagraha/ep1/anim";
import { CAP_BOTTOM, CAP_TOP, Chrome, GRAD, HookPlate, JAKARTA, MUKTA, Part, Presents, ROZHA, S, TwoTone, gradText } from "../../navagraha/ep1/look";
import { NvDefs, SunRays, SvgImage } from "../../navagraha/ep1/world";
import { N2Defs } from "../../navagraha/ep2/anim2";
import { Baby } from "../../chhath/cast";
import { ChDefs, Cradle, HavanKund } from "../../chhath/world";
import { Devi } from "../ep1/ganga";
import { BhDefs, CourtSet } from "../ep1/world";
import { DEVAVRATA_BARE } from "../ep2/cast2";
import { Quiver } from "../ep1/cast";
import { AMBIKA4, DASI, Kalash, Pothi, SATYAVATI4, VYASA, palePal } from "./cast4";
import { BEATS, ENV, PHRASES, TOTAL, WORDS } from "./timing";
import { LampRow, MantraRing, NightArch, Sepia, Storm } from "./world4";

/*
 * भारत · BHARATA Episode 4 · तीन राजकुमार. Dialogue-led (Ayush 21 Nov): six speaking characters, narration only links.
 * Hook = flash-forward: Ambika's cry and Vyasa's verdict over the plate "धृतराष्ट्र अंधे क्यों जन्मे?", then the title,
 * then "पर ये हुआ क्यों?" rewinds to the Satyavati–Bhishma clash. Vedic dressing: yajna kund, kalash, mantra ring,
 * Vyasa's pothi and kamandalu. Kit and rules as Eps 1-3 (imported read-only): brand bug, no app panel.
 * Clock: timing.ts (mahabharat-ep4/tools/vo_prep.py). Audio is muxed after the render.
 */
export const BHARATA4_TOTAL = TOTAL;
const W = 1080;
const H = 1920;
const P = PHRASES;
const A = (i: number) => P[i].a;
const B = (i: number) => P[i].b;
const cue = (p: number, w: string) => (WORDS.find((x) => x.p === p && x.w.startsWith(w)) ?? WORDS.find((x) => x.p === p)!).a;
const p = (t: string, hi = false): Part => ({ t, hi });

const K = {
  ambika: A(0),
  dekh0: cue(2, "देख"),
  kyon: A(3),
  lampA: A(4),
  lampB: B(5),
  bhishma0: A(6),
  vivah: cue(7, "विवाह"),
  surya: cue(8, "सूर्य"),
  vachan: cue(9, "वचन"),
  rasta: A(10),
  vyas: A(11),
  aandhi: A(12),
  aag: cue(13, "भड़क"),
  jangal: A(14),
  jata: A(15),
  angaar: A(16),
  dar: A(18),
  band: A(19),
  dekh: cue(20, "देख"),
  dhrit: BEATS.dhrit[0],
  peela: cue(22, "पीला"),
  roop: A(23),
  pandu: BEATS.pandu[0],
  dasi: A(25),
  pranam: A(27),
  gyani: cue(28, "ज्ञानी"),
  vidur: BEATS.vidur[0],
  andha: A(29),
  peela2: A(30),
  dputra: A(31),
  bhai: A(32),
  sinh: A(33),
  raja: A(34),
  seed: BEATS.seed[0],
  pal: A(35),
  janm: A(37),
  kundali: cue(38, "कुंडली"),
};
const C = {
  vyHook: A(1) - 3,
  title: BEATS.title[0],
  intro: BEATS.title[1],
  satya: A(6) - 4,
  bhClose: A(8) - 3,
  satyaFire: A(10) - 4,
  storm: A(12) - 3,
  entry: A(14) - 3,
  eyes: A(15) - 3,
  vyClose: A(17) - 3,
  ambFear: A(18) - 4,
  verdict: A(20) - 3,
  dhrit: K.dhrit - 4,
  pale: BEATS.dhrit[1],
  vyPandu: A(24) - 3,
  pandu: K.pandu - 4,
  dasi: BEATS.pandu[1],
  vyBless: A(28) - 3,
  vidur: K.vidur - 4,
  cradles: BEATS.vidur[1],
  feature: BEATS.seed[1],
  end: B(38) + 6,
};
export const BH4_CUTS = C;
export const BH4_KEYS = K;

/** Mouth openness for a speaker at frame f (their own lines only), lightly smoothed. */
const talk = (f: number, who: string) => {
  const ph = P.find((x) => f >= x.a - 1 && f <= x.b + 1);
  if (!ph || ph.who !== who) return 0;
  const e = (i: number) => ENV[Math.max(0, Math.min(ENV.length - 1, i))] ?? 0;
  return Math.min(1, ((e(f - 1) + 2 * e(f) + e(f + 1)) / 4) * 1.25);
};

/* ------------------------------------------------------------------ */
/* Keyframed motion (as Episodes 2-3)                                  */
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
const Bhishma: React.FC<ManArgs> = (a) => <Man {...a} who={DEVAVRATA_BARE} backProp={<g transform="translate(-30 -40)"><Quiver s={0.9} /></g>} />;
/** Vyasa: kamandalu in the back hand, the palm-leaf Veda pothi in the front hand (pothi off when blessing). */
const Vyasa: React.FC<ManArgs & { pothi?: boolean }> = ({ pothi = true, ...a }) => (
  <Man {...a} who={VYASA} prop={pothi ? <g transform="translate(0 6)"><Pothi s={0.55} rot={-10} /></g> : undefined} backProp={<Kamandalu />} />
);

const Grey: React.FC<{ k: number }> = ({ k }) => (k > 0.01 ? <rect width={W} height={H} fill="#808080" opacity={k} style={{ mixBlendMode: "saturation" }} /> : null);
const Vignette: React.FC<{ o?: number; c?: string }> = ({ o = 0.55, c = "#0A0612" }) => (
  <g opacity={o}>
    <rect width={W} height={260} fill={c} opacity={0.5} />
    <radialGradient id="bh4Vig" cx="0.5" cy="0.5" r="0.75">
      <stop offset="0.55" stopColor={c} stopOpacity="0" />
      <stop offset="1" stopColor={c} stopOpacity="0.9" />
    </radialGradient>
    <rect width={W} height={H} fill="url(#bh4Vig)" />
  </g>
);
const Night: React.FC<{ o?: number; c?: string }> = ({ o = 0.5, c = "#0A0620" }) => <rect width={W} height={H} fill={c} opacity={o} />;

/** The queens' chamber at night: the court hall darkened to violet, the yajna kund and kalash at the side. */
const Chamber: React.FC<{ f: number; fire?: number; kx?: number }> = ({ f, fire = 0.8, kx = 880 }) => (
  <g>
    <CourtSet f={f} />
    <Night o={0.6} c="#120828" />
    <HavanKund f={f} x={kx} y={1420} s={0.62} k={fire} />
    <g transform={`translate(${kx > 540 ? kx - 230 : kx + 230} 1430)`}>
      <Kalash s={0.8} />
    </g>
  </g>
);

/* ================================================================== */
/* Scenes                                                              */
/* ================================================================== */

/** Cold open: lightning, the young queen cries out and shuts her eyes. */
const HookAmbika: React.FC<{ f: number }> = ({ f }) => {
  const shut = prog(f, K.ambika + 10, K.ambika + 22, EASE);
  return (
    <Cam f={f} a={0} b={C.vyHook} cx={540} cy={1100} s0={1.08} s1={1.16} hits={[K.ambika + 2]} amp={14}>
      <Chamber f={f} fire={1.3} kx={190} />
      <Devi
        pal={AMBIKA4}
        id="hAm"
        f={f}
        x={560}
        y={2230}
        s={1.5}
        crown="queen"
        hands={[[lerp(-60, -86, shut), lerp(-430, -610, shut)], [lerp(60, 86, shut), lerp(-430, -610, shut)]]}
        eyes={1 - shut}
        lookX={-0.4}
        lookY={-0.2}
        smile={-0.6}
        sad={0.9}
        speak={talk(f, "ambika")}
        tilt={lerp(0, -6, shut)}
        lean={lerp(0, -3, shut)}
      />
      <Storm f={f} bolts={[2, 34]} rain={0.6} x={300} />
      <Vignette o={0.65} />
    </Cam>
  );
};

/** "आँखें बंद कर लीं, रानी… तो तुम्हारा पुत्र कभी देख नहीं पाएगा।": the sage in the storm-lit doorway. */
const VyasaHook: React.FC<{ f: number }> = ({ f }) => {
  const keys: KP[] = [
    [C.vyHook, { lean: 2, sF: 12, eF: 30, head: -2, lookX: 1, lookY: 0.1, brow: 0.5, browTilt: -6, smile: -0.2, glow: 0.35 }],
    [K.dekh0 - 6, { lean: 0, sF: 40, eF: 70, wF: 10, head: -6, lookX: 0.6, lookY: 0.35, brow: 0.7, browTilt: -12, smile: -0.4, glow: 0.55 }],
    [C.title, { lean: 0, sF: 30, eF: 60, wF: 10, head: -8, lookX: 0.2, lookY: 0.5, brow: 0.8, browTilt: -14, smile: -0.45, blink: 0.4, glow: 0.4 }],
  ];
  return (
    <Cam f={f} a={C.vyHook} b={C.title} cx={540} cy={950} s0={1.0} s1={1.1} hits={[K.dekh0]} amp={8}>
      <NightArch f={f} open={1} glow={0.6} />
      <Storm f={f} bolts={[C.vyHook + 4, K.dekh0]} rain={0.8} x={560} />
      <Vyasa f={f} id="vH" x={540} y={1800} s={2.2} facing={-1} p={{ ...kpo(f, keys), talk: talk(f, "vyasa") }} k={0.4} />
      <Vignette o={0.7} />
    </Cam>
  );
};

const TitleWorld: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={W} height={H} fill="#0C0A2A" />
    <circle cx={540} cy={820} r={760} fill="#2A1A40" opacity={0.85} filter="url(#bhBlur20)" />
    <g transform={`translate(540 820) rotate(${(f - C.title) * 0.6}) translate(-540 -820)`}>
      <SunRays x={540} y={820} r={210} k={0.5} f={f} n={36} />
    </g>
    <circle cx={540} cy={760} r={330} fill="#0C0A2A" opacity={0.72} filter="url(#bhBlur20)" />
    <MantraRing f={f} x={540} y={800} r={420} k={0.7} />
    <path d={`M0 1460C300 ${1400 + 10 * Math.sin(f / 8)} 700 ${1520 + 10 * Math.cos(f / 9)} 1080 1440L1080 1920L0 1920Z`} fill="#3A1830" />
    <Motes f={f} x={60} y={400} w={960} h={1100} n={30} color="#FFE7A0" o={0.8} seed={9} />
  </g>
);

/** "पर ये हुआ क्यों? … चल बसे थे। कोई वारिस नहीं बचा।": rewind into the past; the funeral lamps go out before the empty throne. */
const LampsWorld: React.FC<{ f: number }> = ({ f }) => {
  const rew = 1 - prog(f, C.intro, C.intro + 26, outCubic);
  return (
    <Cam f={f} a={C.intro} b={C.satya} cx={540} cy={1000} s0={1.18} s1={1.02}>
      <CourtSet f={f} />
      <Night o={0.35 + 0.25 * prog(f, K.lampA, K.lampB)} />
      <LampRow f={f} a={K.lampA + 10} b={K.lampB - 4} y={1330} />
      <Sepia k={0.35 + 0.6 * rew} />
      {rew > 0.02 ? <rect width={W} height={H} fill="#FFF4D6" opacity={0.3 * rew * (0.5 + 0.5 * Math.sin(f * 1.7))} /> : null}
      <Vignette o={0.55} />
    </Cam>
  );
};

/** "भीष्म! सिंहासन खाली है। प्रतिज्ञा तोड़ दो… विवाह करो!": the Rajmata confronts Bhishma before the empty throne. */
const SatyaArgue: React.FC<{ f: number }> = ({ f }) => {
  const push = prog(f, K.vivah - 10, K.vivah + 4, EASE);
  return (
    <Cam f={f} a={C.satya} b={C.bhClose} cx={540} cy={1150} s0={1.04} s1={1.14} hits={[K.bhishma0, K.vivah]} amp={10}>
      <CourtSet f={f} />
      <Night o={0.4} />
      <Devi
        pal={SATYAVATI4}
        id="sV"
        f={f}
        x={330}
        y={1760}
        s={0.8}
        crown="queen"
        hands={[[-50, -430], [lerp(150, 200, push), lerp(-600, -660, push)]]}
        lookX={0.8}
        lookY={0}
        smile={-0.5}
        sad={0.4}
        speak={talk(f, "satyavati")}
        lean={lerp(2, 6, push)}
      />
      <Bhishma f={f} id="sB" x={800} y={1760} s={1.3} facing={-1} p={{ lean: -2, sF: 16, eF: 14, head: -2, lookX: 1, lookY: 0, brow: 0.6, browTilt: -8, smile: -0.1 }} />
      <Vignette o={0.55} />
    </Cam>
  );
};

/** "माता… सूर्य अपना तेज छोड़ दे, पर भीष्म अपना वचन नहीं छोड़ेगा।": Bhishma close, a sun disc rising behind him. */
const BhishmaClose: React.FC<{ f: number }> = ({ f }) => {
  const sun = prog(f, K.surya - 6, K.surya + 30, outCubic);
  const keys: KP[] = [
    [C.bhClose, { lean: 0, sF: 16, eF: 16, head: 0, lookX: 1, lookY: 0, brow: 0.6, browTilt: -6, smile: -0.1 }],
    [K.surya + 10, { lean: 2, sF: 60, eF: 100, wF: -20, head: -3, lookX: 1, lookY: -0.2, brow: 0.7, browTilt: 4, smile: -0.1 }],
    [K.vachan + 2, { lean: 0, sF: 56, eF: 98, wF: -20, head: 2, lookX: 1, lookY: 0, brow: 0.9, browTilt: 12, smile: -0.2, fist: 1 }],
  ];
  return (
    <Cam f={f} a={C.bhClose} b={C.satyaFire} cx={560} cy={900} s0={1.0} s1={1.1} hits={[K.vachan]} amp={9}>
      <CourtSet f={f} />
      <Night o={0.55} />
      <circle cx={520} cy={760} r={260 + 30 * sun} fill="#FFD07A" opacity={0.55 * sun} filter="url(#bhBlur20)" />
      <SunRays x={520} y={760} r={150 + 20 * sun} k={0.7 * sun} f={f} n={28} />
      <Bhishma f={f} id="bC" x={600} y={1980} s={2.6} facing={-1} p={{ ...kpo(f, keys), talk: talk(f, "bhishma") }} k={0.5} />
      <Vignette o={0.6} />
    </Cam>
  );
};

/** "तो अब एक ही रास्ता है… मेरा पहला पुत्र, महर्षि व्यास।": Satyavati turns to the yajna fire; it answers. */
const SatyaFire: React.FC<{ f: number }> = ({ f }) => {
  const flare = prog(f, K.vyas - 4, K.vyas + 12, outCubic);
  return (
    <Cam f={f} a={C.satyaFire} b={C.storm} cx={540} cy={1050} s0={1.0} s1={1.12} hits={[K.vyas]} amp={8}>
      <Chamber f={f} fire={0.7 + 0.8 * flare} kx={800} />
      <MantraRing f={f} x={800} y={1160} r={260} k={0.8 * flare} />
      <Devi pal={SATYAVATI4} id="sF" f={f} x={380} y={2230} s={1.45} crown="queen" hands={[[-14, -520], [14, -520]]} lookX={0.9} lookY={-0.1} smile={-0.1} sad={0.3} speak={talk(f, "satyavati")} tilt={-3} />
      <Vignette o={0.55} />
    </Cam>
  );
};

/** "आँधी उठी… यज्ञ की आग भड़क उठी…": a storm hits the palace, the drapes whip, the yajna fire roars up. */
const StormWorld: React.FC<{ f: number }> = ({ f }) => {
  const roar = prog(f, K.aag - 6, K.aag + 10, outCubic);
  return (
    <Cam f={f} a={C.storm} b={C.entry} cx={540} cy={1150} s0={1.1} s1={1.0} hits={[K.aandhi, K.aag]} amp={18}>
      <Chamber f={f} fire={0.8 + 0.9 * roar} kx={540} />
      <Storm f={f} bolts={[K.aandhi + 2, K.aag]} rain={1} x={760} />
      <Devi pal={SATYAVATI4} id="sS" f={f} x={230} y={1780} s={0.62} crown="queen" hands={[[-80, -560], [80, -560]]} lookX={0.6} lookY={-0.3} smile={-0.2} sad={0.3} lean={-4} />
      <Motes f={f} x={300} y={700} w={500} h={700} n={30} color="#FFB04A" o={roar} seed={44} />
      <Vignette o={0.6} />
    </Cam>
  );
};

/** "और जंगल से आए महर्षि व्यास।": the great doors fly open; the sage walks in out of the storm. */
const EntryWorld: React.FC<{ f: number }> = ({ f }) => {
  const open = prog(f, K.jangal - 8, K.jangal + 6, Easing.out(Easing.cubic));
  const walk = prog(f, K.jangal, C.eyes + 4, Easing.inOut(Easing.sin));
  return (
    <Cam f={f} a={C.entry} b={C.eyes} cx={540} cy={1200} s0={1.0} s1={1.12} hits={[K.jangal - 2]} amp={16}>
      <NightArch f={f} open={open} glow={open} />
      <Storm f={f} bolts={[K.jangal - 2]} rain={0.7} x={540} />
      <g opacity={prog(f, K.jangal - 4, K.jangal + 4)}>
        <Vyasa f={f} id="vE" x={540} y={lerp(1520, 1700, walk)} s={lerp(0.62, 0.95, walk)} facing={-1} p={{ lean: 3, sF: 14, eF: 30, head: -2, lookX: 1, lookY: 0.1, brow: 0.5, smile: -0.1, glow: 0.3, bob: Math.abs(Math.sin(f / 7)) * 6 }} />
      </g>
      <Motes f={f} x={300} y={900} w={500} h={700} n={26} color="#C8B898" o={0.7 * open} seed={52} />
      <Vignette o={0.6} />
    </Cam>
  );
};

/** "धूल से सनी जटाएँ, अंगारों जैसी आँखें।": extreme close on the sage; his eyes kindle like embers. */
const EyesWorld: React.FC<{ f: number }> = ({ f }) => {
  const ember = prog(f, K.angaar - 4, K.angaar + 10, outCubic);
  return (
    <Cam f={f} a={C.eyes} b={C.vyClose} cx={540} cy={800} s0={1.0} s1={1.14} dy={-30} hits={[K.angaar + 2]} amp={6}>
      <NightArch f={f} open={1} glow={0.4} />
      <Night o={0.4} />
      <circle cx={540} cy={800} r={420} fill="#FF7A2A" opacity={0.25 * ember} filter="url(#bhBlur20)" />
      <Vyasa f={f} id="vX" x={540} y={2120} s={4.0} facing={-1} pothi={false} p={{ lean: 0, sF: 10, eF: 20, head: 2, lookX: 0.15, lookY: 0.1, brow: 0.7, browTilt: 8, smile: -0.1, glow: 0.2 + 0.8 * ember }} k={0.3} />
      <Motes f={f} x={160} y={300} w={760} h={900} n={34} color="#D8C8A8" o={0.8} seed={61} />
      <Vignette o={0.65} />
    </Cam>
  );
};

/** "माता, मैं आ गया। रानियों से कहिए… मेरे रूप से डरें नहीं।": Vyasa in the chamber, calm, the mantra ring behind. */
const VyasaClose: React.FC<{ f: number }> = ({ f }) => {
  const keys: KP[] = [
    [C.vyClose, { lean: 0, sF: 14, eF: 30, head: 0, lookX: 1, lookY: 0, brow: 0.4, smile: 0.1, glow: 0.2 }],
    [A(17) + 50, { lean: 2, sF: 34, eF: 70, wF: 10, head: -3, lookX: 1, lookY: 0.1, brow: 0.5, smile: 0.15, glow: 0.2 }],
    [B(17), { lean: 0, sF: 50, eF: 110, wF: -10, head: 3, lookX: 0.8, lookY: 0.05, brow: 0.7, browTilt: -4, smile: 0, glow: 0.25 }],
  ];
  return (
    <Cam f={f} a={C.vyClose} b={C.ambFear} cx={540} cy={920} s0={1.0} s1={1.08}>
      <Chamber f={f} fire={1} kx={860} />
      <MantraRing f={f} x={540} y={760} r={340} k={0.55} />
      <Vyasa f={f} id="vC" x={520} y={1700} s={2.5} facing={1} p={{ ...kpo(f, keys), talk: talk(f, "vyasa") }} k={0.5} />
      <Vignette o={0.55} />
    </Cam>
  );
};

/** "पर बड़ी रानी अंबिका डर गईं… और उन्होंने आँखें बंद कर लीं।": she sees him across the chamber, and shuts her eyes. */
const AmbikaFear: React.FC<{ f: number }> = ({ f }) => {
  const shut = prog(f, K.band + 4, K.band + 18, EASE);
  const recoil = prog(f, K.dar - 4, K.dar + 14, EASE);
  return (
    <Cam f={f} a={C.ambFear} b={C.verdict} cx={600} cy={1150} s0={1.0} s1={1.16} dx={-40} hits={[K.band + 6]} amp={10}>
      <Chamber f={f} fire={0.9} kx={520} />
      <g opacity={0.92}>
        <Vyasa f={f} id="vF" x={250} y={1640} s={0.8} facing={1} p={{ lean: 0, sF: 14, eF: 30, head: 0, lookX: 1, lookY: 0.05, brow: 0.4, smile: 0, glow: 0.4 }} />
      </g>
      <Devi
        pal={AMBIKA4}
        id="aF"
        f={f}
        x={730}
        y={1820}
        s={0.92}
        crown="queen"
        hands={[[lerp(-50, -84, shut), lerp(-430, -610, shut)], [lerp(lerp(50, 120, recoil), 84, shut), lerp(lerp(-430, -560, recoil), -610, shut)]]}
        eyes={1 - shut}
        lookX={-0.9}
        lookY={0}
        smile={-0.6}
        sad={0.4 + 0.5 * recoil}
        lean={lerp(0, 5, recoil)}
        tilt={lerp(0, 6, shut)}
      />
      <Storm f={f} bolts={[K.band + 6]} rain={0.3} x={420} />
      <Vignette o={0.55} />
    </Cam>
  );
};

/** Vyasa's verdict again: "तो तुम्हारा पुत्र कभी देख नहीं पाएगा।" */
const VyasaVerdict: React.FC<{ f: number }> = ({ f }) => {
  const keys: KP[] = [
    [C.verdict, { lean: 0, sF: 14, eF: 30, head: 0, lookX: 1, lookY: 0.1, brow: 0.6, browTilt: -8, smile: -0.2, glow: 0.3 }],
    [K.dekh - 2, { lean: 0, sF: 40, eF: 70, wF: 10, head: -6, lookX: 0.8, lookY: 0.4, brow: 0.8, browTilt: -12, smile: -0.4, glow: 0.4 }],
    [C.dhrit, { lean: 0, sF: 30, eF: 50, head: -8, lookX: 0.5, lookY: 0.5, brow: 0.8, browTilt: -14, smile: -0.4, blink: 0.4, glow: 0.3 }],
  ];
  return (
    <Cam f={f} a={C.verdict} b={C.dhrit} cx={540} cy={940} s0={1.04} s1={1.12}>
      <Chamber f={f} fire={0.7} kx={200} />
      <Vyasa f={f} id="vV" x={560} y={1700} s={2.5} facing={-1} p={{ ...kpo(f, keys), talk: talk(f, "vyasa") }} k={0.4} />
      <Vignette o={0.6} />
    </Cam>
  );
};

/** A cradle with the newborn under a coloured light (each prince's stamp shot). */
const CradleShot: React.FC<{ f: number; a: number; b: number; light: string; skin?: number; dim?: number }> = ({ f, a, b, light, skin = 1, dim = 0 }) => (
  <Cam f={f} a={a} b={b} cx={540} cy={1200} s0={1.12} s1={1.02} hits={[a + 4]} amp={8}>
    <CourtSet f={f} />
    <Night o={0.5 + 0.2 * dim} />
    <circle cx={540} cy={1180} r={460} fill={light} opacity={0.45} filter="url(#bhBlur20)" />
    <Cradle f={f} x={540} y={1560} s={1.1} rock={4} baby={<Baby f={f} s={1.4} life={skin} glow={0.4} />} />
    <Petals f={f} n={8} seed={a % 50} o={0.5} color="#FFE7A0" />
    <Vignette o={0.6} />
  </Cam>
);

/** "छोटी रानी अंबालिका का चेहरा डर से पीला पड़ गया। / ये… ये कैसा रूप है?": the colour drains from her face. */
const PaleWorld: React.FC<{ f: number }> = ({ f }) => {
  const u = prog(f, K.peela - 14, K.peela + 12, EASE);
  const back = prog(f, K.roop - 6, K.roop + 14, EASE);
  return (
    <Cam f={f} a={C.pale} b={C.vyPandu} cx={540} cy={1050} s0={1.0} s1={1.12} hits={[K.roop]} amp={6}>
      <Chamber f={f} fire={0.8} kx={860} />
      <Devi
        pal={palePal(u)}
        id="aL"
        f={f}
        x={540}
        y={2240}
        s={1.48}
        crown="queen"
        hands={[[lerp(-50, -70, back), lerp(-430, -560, back)], [lerp(50, 70, back), lerp(-430, -560, back)]]}
        lookX={0.6}
        lookY={-0.1}
        smile={-0.5}
        sad={0.6 + 0.3 * u}
        speak={talk(f, "ambalika")}
        lean={lerp(0, -5, back)}
        tilt={lerp(0, -4, back)}
      />
      <rect width={W} height={H} fill="#E8F0E0" opacity={0.12 * u} />
      <Vignette o={0.55} />
    </Cam>
  );
};

/** "तो इसका पुत्र भी पीला होगा।" */
const VyasaPandu: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.vyPandu} b={C.pandu} cx={540} cy={940} s0={1.04} s1={1.1}>
    <Chamber f={f} fire={0.7} kx={860} />
    <Vyasa f={f} id="vP" x={520} y={1700} s={2.5} facing={1} p={{ lean: 0, sF: 30, eF: 60, head: -4, lookX: 1, lookY: 0.2, brow: 0.7, browTilt: -10, smile: -0.3, glow: 0.25, talk: talk(f, "vyasa") }} k={0.4} />
    <Vignette o={0.6} />
  </Cam>
);

/** "तीसरी बार अंबिका ने अपनी दासी को भेज दिया। पर वो डरी नहीं। / प्रणाम, महर्षि।": the maid walks in calm and bows. */
const DasiWorld: React.FC<{ f: number }> = ({ f }) => {
  const walk = prog(f, C.dasi, K.pranam - 6, Easing.inOut(Easing.sin));
  const bow = prog(f, K.pranam - 6, K.pranam + 8, EASE);
  return (
    <Cam f={f} a={C.dasi} b={C.vyBless} cx={600} cy={1200} s0={1.02} s1={1.14} dx={-30}>
      <Chamber f={f} fire={1} kx={540} />
      <Devi
        pal={DASI}
        id="dS"
        f={f}
        x={lerp(140, 440, walk)}
        y={1780}
        s={0.86}
        crown="none"
        hands={bow > 0.05 ? [[lerp(-50, -14, bow), lerp(-430, -540, bow)], [lerp(50, 14, bow), lerp(-430, -540, bow)]] : [[-50, -430], [50, -430]]}
        lookX={0.8}
        lookY={lerp(0, 0.3, bow)}
        smile={0.35}
        speak={talk(f, "dasi")}
        lean={lerp(0, 7, bow)}
        tilt={lerp(0, 6, bow)}
      />
      <Vyasa f={f} id="vD" x={830} y={1660} s={1.0} facing={-1} p={{ lean: 0, sF: 14, eF: 30, head: 0, lookX: 1, lookY: 0.1, brow: 0.4, smile: lerp(0, 0.35, bow), glow: 0.15 }} />
      <Vignette o={0.5} />
    </Cam>
  );
};

/** "तुम्हारा पुत्र… धर्म का सबसे बड़ा ज्ञानी होगा।": Vyasa smiles and raises his hand in blessing; gold light. */
const VyasaBless: React.FC<{ f: number }> = ({ f }) => {
  const bless = prog(f, C.vyBless + 4, C.vyBless + 20, EASE);
  const gold = prog(f, K.gyani - 6, K.gyani + 14, outCubic);
  return (
    <Cam f={f} a={C.vyBless} b={C.vidur} cx={540} cy={920} s0={1.0} s1={1.1} hits={[K.gyani]} amp={5}>
      <Chamber f={f} fire={1} kx={860} />
      <circle cx={540} cy={800} r={480} fill="#FFD07A" opacity={0.4 * gold} filter="url(#bhBlur20)" />
      <MantraRing f={f} x={540} y={760} r={360} k={0.3 + 0.6 * gold} />
      <Vyasa
        f={f}
        id="vB"
        x={540}
        y={1700}
        s={2.5}
        facing={-1}
        pothi={false}
        p={{ lean: 0, sF: lerp(14, 34, bless), eF: lerp(30, 140, bless), wF: -10, head: -2, lookX: 1, lookY: 0.2, brow: 0.3, smile: 0.5, glow: 0.1, fist: 0, talk: talk(f, "vyasa") }}
        k={0.4}
      />
      <Motes f={f} x={160} y={300} w={760} h={900} n={24} color="#FFE7A0" o={gold} seed={72} />
      <Vignette o={0.5} />
    </Cam>
  );
};

/** "एक अंधा… एक पीला… एक दासी-पुत्र। तीन भाई… एक सिंहासन। राजा कौन बनेगा?": three cradles, the throne above, Bhishma watching. */
const CradlesWorld: React.FC<{ f: number }> = ({ f }) => {
  const spot = (at: number) => prog(f, at - 4, at + 8, outCubic);
  const throne = prog(f, K.sinh - 4, K.sinh + 12, outCubic);
  const freeze = prog(f, K.raja + 10, C.feature, EASE);
  const ff = f < K.raja + 20 ? f : K.raja + 20;
  return (
    <g>
      <Cam f={ff} a={C.cradles} b={C.feature} cx={540} cy={1250} s0={1.0} s1={1.1} dy={-60}>
        <CourtSet f={ff} />
        <Night o={0.55} />
        <circle cx={540} cy={680} r={330} fill="#FFD07A" opacity={0.5 * throne} filter="url(#bhBlur20)" />
        {[
          [200, "#7A8AC8", K.andha, 0.75],
          [540, "#E8F0E0", K.peela2, 0.85],
          [880, "#FFD07A", K.dputra, 1],
        ].map(([x, c, at, life]) => (
          <g key={x as number}>
            <circle cx={x as number} cy={1240} r={230} fill={c as string} opacity={0.15 + 0.4 * spot(at as number)} filter="url(#bhBlur20)" />
            <Cradle f={ff + (x as number)} x={x as number} y={1500} s={0.62} rock={3} baby={<Baby f={ff} s={1.4} life={life as number} />} />
          </g>
        ))}
        <g opacity={prog(f, K.bhai - 4, K.bhai + 10)}>
          <Bhishma f={ff} id="cB" x={1010} y={1980} s={1.5} facing={-1} p={{ lean: 0, sF: 14, eF: 20, head: -4, lookX: 1, lookY: 0.4, brow: 0.6, browTilt: -8, smile: -0.1 }} k={0.3} />
        </g>
        <Vignette o={0.55} />
      </Cam>
      <Grey k={0.7 * freeze} />
    </g>
  );
};

const FeatureWorld: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.feature} b={C.end} cx={540} cy={1000} s0={1.0} s1={1.04}>
    <rect width={W} height={H} fill="url(#nvSkyPalace)" />
    <circle cx={540} cy={980} r={640} fill="url(#nvWarm)" />
    <SvgImage file="jyotiq/site/hero-left-image.png" x={-140} y={1420} width={460} height={460 * (1216 / 1294)} opacity={0.55} />
    <Kundali f={f} at={C.feature + 4} x={240} y={760} size={600} hops={[{ at: C.feature + 16, house: 0 }, { at: K.janm, house: 3 }, { at: K.kundali, house: 9 }]} />
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

const KEYW = new Set(["क्यों?", "विचित्रवीर्य", "वारिस", "आँधी", "यज्ञ", "व्यास।", "जटाएँ,", "अंगारों", "अंबिका", "बंद", "अंबालिका", "पीला", "दासी", "डरी", "अंधा…", "पीला…", "दासी-पुत्र।", "भाई…", "सिंहासन।", "राजा", "किस्मतें", "जन्म", "कुंडली", "ज्योतिक़"]);
const WHO: Record<string, string> = {
  ambika: "अंबिका · बड़ी रानी",
  ambalika: "अंबालिका · छोटी रानी",
  vyasa: "महर्षि व्यास",
  satyavati: "राजमाता सत्यवती",
  bhishma: "भीष्म",
  dasi: "दासी",
};

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
          Episode 4 · तीन राजकुमार
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

/** The three princes' tally over the cradles: names light as the narrator counts them; "?" over the throne. */
const Tally: React.FC<{ f: number }> = ({ f }) => {
  if (f < K.andha - 4 || f > C.feature + 6) return null;
  const o = 1 - prog(f, C.feature - 4, C.feature + 4);
  const one = (at: number, t: string, sub: string) => {
    const k = prog(f, at - 2, at + 8, outBack);
    return (
      <div key={t} style={{ padding: "10px 20px", borderRadius: 28, background: "rgba(20,12,34,0.86)", border: `2.5px solid ${S.gold}`, textAlign: "center", opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - k) * 40}px)` }}>
        <div style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: 44, color: "#FFF3DA" }}>{t}</div>
        <div style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 26, color: S.goldLight }}>{sub}</div>
      </div>
    );
  };
  const q = prog(f, K.raja - 2, K.raja + 8, outBack);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1030, display: "flex", justifyContent: "center", gap: 18 }}>
        {one(K.andha, "धृतराष्ट्र", "अंधा")}
        {one(K.peela2, "पांडु", "पीला")}
        {one(K.dputra, "विदुर", "दासी-पुत्र")}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", justifyContent: "center", opacity: Math.min(1, q * 1.5), transform: `scale(${0.6 + 0.4 * q})` }}>
        <div style={{ padding: "10px 40px 16px", borderRadius: 40, background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 64, boxShadow: "0 14px 30px rgba(224,72,43,0.45)" }}>राजा कौन? 👑</div>
      </div>
    </div>
  );
};

const FeatureText: React.FC<{ f: number }> = ({ f }) => {
  const k = prog(f, C.feature + 2, C.feature + 14, outBack);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - k) * 60}px)` }}>
        <div style={{ padding: "14px 40px", borderRadius: 40, background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 56, boxShadow: "0 10px 24px rgba(224,72,43,0.35)" }}>आपकी फ़्री कुंडली</div>
        <div style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 34, color: S.brownMid }}>जन्म के पल में छिपी आपकी किस्मत</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1400, display: "flex", justifyContent: "center", gap: 14 }}>
        {["जन्म तिथि", "जन्म समय", "जन्म स्थान"].map((t, i) => {
          const kk = prog(f, K.janm - 4 + i * 6, K.janm + 6 + i * 6, outBack);
          return (
            <div key={t} style={{ padding: "10px 24px", borderRadius: 30, background: i === 1 ? GRAD : "#FFFFFF", border: `2.5px solid ${S.goldLight}`, fontFamily: MUKTA, fontWeight: 800, fontSize: 38, color: i === 1 ? "#FFF" : S.brown, opacity: Math.min(1, kk * 1.5), transform: `scale(${0.8 + 0.2 * kk})` }}>
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
        <div style={{ fontFamily: ROZHA, fontSize: 84, lineHeight: 1.1, background: "linear-gradient(180deg, #FFF3C4 0%, #F6C14E 60%, #C07A1E 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>कुंती का मंत्र</div>
        <div style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 34, color: "#FFF3DA" }}>“सूर्यदेव, लौट जाइए!”</div>
      </div>
      <div style={{ ...st(1), display: "flex", alignItems: "center", gap: 20, marginTop: 6 }}>
        <div style={{ width: 120, height: 120, borderRadius: 60, background: "radial-gradient(circle at 50% 40%, #2A1830 0%, #120C16 75%)", border: `3px solid ${S.gold}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Img src={staticFile("jyotiq/logo-full.png")} style={{ width: 82, height: 96, objectFit: "contain" }} />
        </div>
        <TwoTone parts={[p("ज्योतिक़ "), p("डाउनलोड कीजिए", true)]} size={66} />
      </div>
      <div style={{ ...st(2), display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, maxWidth: 940 }}>
        {["फ़्री कुंडली", "दशा", "गोचर", "आज का दिन", "पंचांग"].map((t, i) => (
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
        कमेंट करें: राजा किसे बनना चाहिए था?
      </div>
      <div style={{ ...st(6), fontFamily: JAKARTA, fontWeight: 600, fontSize: 24, color: S.brownMid, opacity: 0.85 }}>Guidance only, for entertainment and information.</div>
    </div>
  );
};

/* ================================================================== */
/* Composition                                                         */
/* ================================================================== */

type Shot = { a: number; b: number; World: React.FC<{ f: number }> };
const Dhrit: React.FC<{ f: number }> = ({ f }) => <CradleShot f={f} a={C.dhrit} b={C.pale} light="#5A6AB8" skin={0.8} dim={1} />;
const Pandu: React.FC<{ f: number }> = ({ f }) => <CradleShot f={f} a={C.pandu} b={C.dasi} light="#E8F0E0" skin={0.85} />;
const Vidur: React.FC<{ f: number }> = ({ f }) => <CradleShot f={f} a={C.vidur} b={C.cradles} light="#FFD07A" />;
const SHOTS: Shot[] = [
  { a: 0, b: C.vyHook, World: HookAmbika },
  { a: C.vyHook, b: C.title, World: VyasaHook },
  { a: C.title, b: C.intro, World: TitleWorld },
  { a: C.intro, b: C.satya, World: LampsWorld },
  { a: C.satya, b: C.bhClose, World: SatyaArgue },
  { a: C.bhClose, b: C.satyaFire, World: BhishmaClose },
  { a: C.satyaFire, b: C.storm, World: SatyaFire },
  { a: C.storm, b: C.entry, World: StormWorld },
  { a: C.entry, b: C.eyes, World: EntryWorld },
  { a: C.eyes, b: C.vyClose, World: EyesWorld },
  { a: C.vyClose, b: C.ambFear, World: VyasaClose },
  { a: C.ambFear, b: C.verdict, World: AmbikaFear },
  { a: C.verdict, b: C.dhrit, World: VyasaVerdict },
  { a: C.dhrit, b: C.pale, World: Dhrit },
  { a: C.pale, b: C.vyPandu, World: PaleWorld },
  { a: C.vyPandu, b: C.pandu, World: VyasaPandu },
  { a: C.pandu, b: C.dasi, World: Pandu },
  { a: C.dasi, b: C.vyBless, World: DasiWorld },
  { a: C.vyBless, b: C.vidur, World: VyasaBless },
  { a: C.vidur, b: C.cradles, World: Vidur },
  { a: C.cradles, b: C.feature, World: CradlesWorld },
  { a: C.feature, b: C.end, World: FeatureWorld },
  { a: C.end, b: TOTAL, World: EndWorld },
];
const XFADE: Record<number, number> = { [C.intro]: 6, [C.satyaFire]: 8, [C.dasi]: 8, [C.cradles]: 10, [C.end]: 8 };

export const Bharata4Reel: React.FC = () => {
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
  const hookEnd = C.title;
  const hookOut = 1 - prog(f, hookEnd - 6, hookEnd);
  return (
    <AbsoluteFill style={{ background: "#0C0A2A", overflow: "hidden" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <RigDefs />
        <SetDefs />
        <NvDefs />
        <N2Defs />
        <BhDefs />
        <ChDefs />
        {layers}
      </svg>

      {f < hookEnd ? (
        <div style={{ position: "absolute", inset: 0, opacity: hookOut, transform: `scale(${1 + 0.015 * Math.sin(f / 10)})`, transformOrigin: "50% 30%" }}>
          <HookPlate y={400} size={70} lines={[[p("धृतराष्ट्र "), p("अंधे", true), p(" क्यों जन्मे?")]]} chip="एक डर… और पूरी महाभारत" />
        </div>
      ) : null}

      <Chip f={f} at={C.intro + 4} out={K.lampA + 30} text="⏪ कुछ समय पहले… हस्तिनापुर" y={560} />
      <Chip f={f} at={K.lampA + 32} out={C.satya - 4} text="राजा विचित्रवीर्य · निःसंतान मृत्यु" y={560} />
      <NameChipIn f={f} at={C.satya + 6} out={C.bhClose - 4} hi="सत्यवती" en="SATYAVATI" tag="हस्तिनापुर की राजमाता" y={520} icon="♛" />
      <Chip f={f} at={K.vachan} out={C.satyaFire - 2} text="भीष्म प्रतिज्ञा · आजीवन ब्रह्मचर्य" y={560} />
      <Chip f={f} at={K.aag} out={C.entry - 2} text="यज्ञ की अग्नि भड़क उठी" y={560} />
      <NameChipIn f={f} at={K.jangal + 6} out={C.eyes - 2} hi="वेदव्यास" en="VEDA VYASA" tag="वेदों के संकलनकर्ता · सत्यवती के पुत्र" y={520} icon="ॐ" />
      <NameChipIn f={f} at={C.ambFear + 6} out={C.verdict - 4} hi="अंबिका" en="AMBIKA" tag="बड़ी रानी" y={520} icon="✿" />
      <Stamp f={f} at={K.dhrit - 2} out={C.pale - 2} text={[p("धृतराष्ट्र", true)]} y={520} size={150} sub="जन्म से अंधे" dark />
      <NameChipIn f={f} at={C.pale + 6} out={K.roop - 4} hi="अंबालिका" en="AMBALIKA" tag="छोटी रानी" y={520} icon="✿" />
      <Stamp f={f} at={K.pandu - 2} out={C.dasi - 2} text={[p("पांडु", true)]} y={520} size={150} sub="पीले रंग के राजकुमार" dark />
      <Chip f={f} at={C.dasi + 4} out={K.pranam - 4} text="तीसरी बार… दासी" y={560} />
      <Stamp f={f} at={K.vidur - 2} out={C.cradles - 2} text={[p("विदुर", true)]} y={520} size={150} sub="धर्म के ज्ञानी" dark />
      <Tally f={f} />

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

      <Flash f={f} at={K.ambika + 2} color="#E6EEFF" peak={0.5} rise={1} fall={8} />
      <Flash f={f} at={K.dekh0} color="#FFD0A0" peak={0.25} rise={1} fall={8} />
      <Flash f={f} at={C.title} color="#FFF4D6" peak={1} rise={3} fall={14} />
      <Flash f={f} at={C.intro} color="#FFF4D6" peak={0.6} rise={2} fall={10} />
      <Flash f={f} at={K.vivah} color="#FFD0D0" peak={0.25} rise={1} fall={8} />
      <Flash f={f} at={K.vachan} color="#FFF0B8" peak={0.4} rise={2} fall={10} />
      <Flash f={f} at={K.vyas} color="#FFB04A" peak={0.35} fall={10} />
      <Flash f={f} at={K.jangal - 2} color="#E6EEFF" peak={0.7} rise={1} fall={12} />
      <Flash f={f} at={K.angaar + 2} color="#FF8A3A" peak={0.3} fall={10} />
      <Flash f={f} at={K.dhrit - 2} color="#C8D0FF" peak={0.5} fall={10} />
      <Flash f={f} at={K.pandu - 2} color="#FFFFFF" peak={0.5} fall={10} />
      <Flash f={f} at={K.vidur - 2} color="#FFE7A0" peak={0.6} fall={10} />
      <Flash f={f} at={C.feature} peak={0.7} fall={8} />

      <Chrome f={f} brand={1} panel={0} />
    </AbsoluteFill>
  );
};
