import React from "react";
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from "remotion";
import { AppStoreButton, PlayButton } from "../../katha/reelKit";
import { Kamandalu, Puppet, RigDefs, blinkAt, idle, pose, type Pose, type Who } from "../../manthan/rig";
import { SetDefs } from "../../manthan/sets";
import { Cam, Flash, Motes, NameChipIn, Petals, Pop, lerp, outBack, outCubic, prog } from "../../navagraha/ep1/anim";
import { CAP_BOTTOM, CAP_TOP, Chrome, GRAD, HookPlate, JAKARTA, MUKTA, Part, Presents, ROZHA, S, TwoTone, gradText } from "../../navagraha/ep1/look";
import { NvDefs, SunRays, SvgImage } from "../../navagraha/ep1/world";
import { N2Defs } from "../../navagraha/ep2/anim2";
import { ChDefs } from "../../chhath/world";
import { BhDefs, CourtSet } from "../ep1/world";
import { Sepia } from "../ep4/world4";
import { HandLotus, Kanya } from "./kunti";
import { ADHIRATHA, Basket, DAI, DURVASA5, KUNTI, KUNTI_RANI, KarnaBaby, PANDU5, RADHA, SURYA5, Thali, Whip } from "./cast5";
import { BEATS, ENV, PHRASES, TOTAL, WORDS } from "./timing";
import { CourtyardSet, DawnRiver, HoraDial, KuntiChamber, NightRiver, SunMandala, W5Defs } from "./world5";

/*
 * भारत · BHARATA Episode 5 · कुंती का मंत्र. Dialogue-led like Ep4: Kunti, Surya, Durvasa, the nurse and Adhiratha speak; Kaal links.
 * Cold open = the clash: Kunti orders Surya to leave, the god refuses, she drops to her knees (hook plate "कुंती ने अपना बेटा
 * क्यों बहाया?"). Title, then "पर ये शुरू कहाँ से हुआ?" rewinds to Durvasa's boon; the cold-open lines replay when Surya descends.
 * Look upgrades (Ayush 23 Nov: richer backgrounds, ornaments, faces): carved sandstone chamber with a jharokha and jaali screens,
 * the courtyard through a year, a moonlit river under the palace, a rose-gold dawn river, Surya's mandala; Kunti with a matha patti,
 * two-tier jhumkas, a temple coin necklace and a nose pin (a nath only once she is Pandu's queen). Kit as Eps 1-4 (read-only):
 * brand bug, no app panel. Clock: timing.ts (mahabharat-ep5/tools/vo_prep.py). Audio is muxed after the render.
 */
export const BHARATA5_TOTAL = TOTAL;
const W = 1080;
const H = 1920;
const P = PHRASES;
const A = (i: number) => P[i].a;
const B = (i: number) => P[i].b;
const cue = (p: number, w: string) => (WORDS.find((x) => x.p === p && x.w.startsWith(w)) ?? WORDS.find((x) => x.p === p)!).a;
const p = (t: string, hi = false): Part => ({ t, hi });

const K = {
  laut: cue(0, "लौट"),
  parkha: cue(1, "परखा"),
  mantra2: A(2),
  khali: cue(3, "खाली"),
  vivah: cue(4, "विवाह"),
  duniya: A(5),
  shuru: A(6),
  seva: cue(7, "सेवा"),
  durvasa: cue(7, "दुर्वासा"),
  prasann: A(8),
  lo: A(9),
  aayega: cue(10, "आएगा"),
  sach: A(11),
  ekbaar: A(12),
  whisper: BEATS.mantra[0],
  utar: cue(13, "उतर"),
  surya13: cue(13, "सूर्यदेव"),
  r1: A(14),
  r2: A(15),
  dand: cue(16, "दंड"),
  pita: cue(16, "पिता"),
  vachan: A(17),
  maan: A(18),
  bana: A(19),
  putra: cue(20, "पुत्र"),
  bless: BEATS.blessing[0],
  samay: A(21),
  kavach: cue(22, "कवच"),
  dai: A(23),
  tokri: cue(24, "टोकरी"),
  nadi: cue(25, "नदी"),
  jahan: A(26),
  lal: cue(27, "लाल"),
  door: A(28),
  adhi: cue(29, "अधिरथ"),
  radha: A(30),
  beta: cue(31, "बेटा"),
  suryaBeta: A(32),
  sarathi: A(33),
  duniya2: A(34),
  karna: A(35),
  baras: A(36),
  pandu: cue(36, "पांडु"),
  raaz: A(37),
  kabhi: A(38),
  seed: BEATS.seed[0],
  ghadi: A(39),
  hora: cue(40, "होरा"),
  mantraF: A(41),
  free: A(42),
};
const C = {
  surHook: A(2) - 3,
  kneel: A(4) - 3,
  title: BEATS.title[0],
  intro: BEATS.title[1],
  boon: A(8) - 3,
  window: A(11) - 3,
  descent: A(13) - 3,
  r1: A(14) - 2,
  threat: A(15) - 2,
  vachan: A(17) - 3,
  bless: A(19) - 3,
  birth: A(21) - 3,
  dai: A(23) - 3,
  river: A(24) - 3,
  tears: A(26) - 3,
  journey: A(28) - 3,
  adhi: A(30) - 3,
  karna: A(32) - 3,
  rani: BEATS.karna[1],
  feature: BEATS.seed[1],
  end: B(42) + 6,
};
export const BH5_CUTS = C;
export const BH5_KEYS = K;

/** Mouth openness for a speaker at frame f (their own lines only), lightly smoothed. */
const talk = (f: number, who: string) => {
  const ph = P.find((x) => f >= x.a - 1 && f <= x.b + 1);
  if (!ph || ph.who !== who) return 0;
  const e = (i: number) => ENV[Math.max(0, Math.min(ENV.length - 1, i))] ?? 0;
  return Math.min(1, ((e(f - 1) + 2 * e(f) + e(f + 1)) / 4) * 1.25);
};

/* ------------------------------------------------------------------ */
/* Keyframed motion (as Episodes 2-4)                                  */
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
/** Eased number keys (for the female figures' hands, tilt, lean). */
type NK = [number, number];
const kn = (f: number, keys: NK[]): number => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (f < keys[i + 1][0]) return lerp(keys[i][1], keys[i + 1][1], EASE((f - keys[i][0]) / Math.max(1, keys[i + 1][0] - keys[i][0])));
  }
  return keys[keys.length - 1][1];
};
type PuppetArgs = { f: number; id: string; who: Who; x: number; y: number; s: number; facing?: number; p?: Partial<Pose>; prop?: React.ReactNode; backProp?: React.ReactNode; k?: number };
const Man: React.FC<PuppetArgs> = ({ f, id, who, x, y, s, facing = 1, p: o = {}, prop, backProp, k = 1 }) => (
  <Puppet id={id} who={who} at={{ x, y, s, facing }} p={pose({ ...idle(id, f, k), blink: blinkAt(id, f), ...o })} t={f} prop={prop} backProp={backProp} />
);
type ManArgs = Omit<PuppetArgs, "who">;
const Surya: React.FC<ManArgs & { lotus?: boolean }> = ({ lotus = true, ...a }) => (
  <Man {...a} who={SURYA5} prop={lotus ? <g transform="translate(0 4)"><HandLotus s={1.3} /></g> : undefined} backProp={<g transform="translate(0 4)"><HandLotus s={1.2} rot={10} /></g>} />
);
/** Surya's halo behind his head: (x, y, s) as the puppet's place; the head sits about 300 units above the feet. */
const SuryaHalo: React.FC<{ f: number; x: number; y: number; s: number; k?: number }> = ({ f, x, y, s, k = 1 }) => <SunMandala f={f} x={x} y={y - 300 * s} r={95 * s} k={k} />;
const Durvasa: React.FC<ManArgs> = (a) => <Man {...a} who={DURVASA5} backProp={<Kamandalu />} />;

const Vignette: React.FC<{ o?: number; c?: string }> = ({ o = 0.55, c = "#0A0612" }) => (
  <g opacity={o}>
    <rect width={W} height={260} fill={c} opacity={0.5} />
    <radialGradient id="bh5Vig" cx="0.5" cy="0.5" r="0.75">
      <stop offset="0.55" stopColor={c} stopOpacity="0" />
      <stop offset="1" stopColor={c} stopOpacity="0.9" />
    </radialGradient>
    <rect width={W} height={H} fill="url(#bh5Vig)" />
  </g>
);
const Grey: React.FC<{ k: number }> = ({ k }) => (k > 0.01 ? <rect width={W} height={H} fill="#808080" opacity={k} style={{ mixBlendMode: "saturation" }} /> : null);
const Night: React.FC<{ o?: number; c?: string }> = ({ o = 0.5, c = "#0A0620" }) => <rect width={W} height={H} fill={c} opacity={o} />;

/** Golden syllables drifting from (x0, y0) to (x1, y1) over [a, b]: the mantra passing. */
const MantraFlow: React.FC<{ f: number; a: number; b: number; x0: number; y0: number; x1: number; y1: number; n?: number }> = ({ f, a, b, x0, y0, x1, y1, n = 7 }) => {
  if (f < a || f > b + 20) return null;
  const SY = ["ॐ", "ह्रीं", "श्रीं", "ॐ", "क्लीं", "ॐ", "स्वाहा"];
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const u = prog(f, a + i * 5, a + i * 5 + 34, Easing.inOut(Easing.sin));
        if (u <= 0 || u >= 1) return null;
        const x = lerp(x0, x1, u) + Math.sin(u * Math.PI * 2 + i) * 40;
        const y = lerp(y0, y1, u) - Math.sin(u * Math.PI) * 120;
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${0.6 + 0.6 * Math.sin(u * Math.PI)})`} opacity={Math.sin(u * Math.PI)}>
            <circle r={36} fill="#FFD36A" opacity={0.35} filter="url(#w5Blur14)" />
            <text textAnchor="middle" y={14} fontSize={46} fontWeight={800} fill="#FFF3C0" style={{ fontFamily: MUKTA }}>{SY[i % SY.length]}</text>
          </g>
        );
      })}
    </g>
  );
};

/* ================================================================== */
/* Scenes                                                              */
/* ================================================================== */

/** Cold open: Surya's light floods the chamber; Kunti shields her eyes: "सूर्यदेव… लौट जाइए! मैंने तो बस मंत्र परखा था!" */
const HookKunti: React.FC<{ f: number }> = ({ f }) => {
  const plead = prog(f, K.parkha - 8, K.parkha + 6, EASE);
  return (
    <Cam f={f} a={0} b={C.surHook} cx={540} cy={1150} s0={1.08} s1={1.16} hits={[K.laut]} amp={12}>
      <KuntiChamber f={f} dawn={0.9} sunY={260} blaze={0.85 + 0.1 * Math.sin(f / 6)} />
      <Kanya
        pal={KUNTI}
        id="hK"
        f={f}
        x={560}
        y={2170}
        s={1.55}
        crown="princess"
        temple
        hands={[[lerp(-40, -14, plead), lerp(-450, -520, plead)], [lerp(150, 14, plead), lerp(-660, -520, plead)]]}
        openR={plead < 0.5}
        palmRot={-8}
        eyes={lerp(0.25, 0.9, plead)}
        lookX={0.5}
        lookY={-0.3}
        smile={-0.5}
        sad={0.9}
        speak={talk(f, "kunti")}
        tilt={lerp(-8, 2, plead)}
        lean={lerp(-4, 1, plead)}
      />
      <SunMandala f={f} x={760} y={560} r={260} k={0.7} />
      <Vignette o={0.35} c="#3A1A0A" />
    </Cam>
  );
};

/** "मंत्र से बुलाया है, कुंती… देवता खाली हाथ नहीं लौटता।": Surya in his blaze, unmoved. */
const SuryaHook: React.FC<{ f: number }> = ({ f }) => {
  const keys: KP[] = [
    [C.surHook, { lean: 0, sF: 20, eF: 40, wF: 0, head: 0, lookX: 1, lookY: 0.1, brow: 0.3, browTilt: 0, smile: 0.05, glow: 0.4 }],
    [K.khali - 4, { lean: 2, sF: 60, eF: 90, wF: -20, head: -3, lookX: 0.8, lookY: 0.2, brow: 0.5, browTilt: 4, smile: -0.05, glow: 0.6 }],
    [C.kneel, { lean: 0, sF: 50, eF: 80, wF: -10, head: -4, lookX: 0.6, lookY: 0.4, brow: 0.6, browTilt: 6, smile: -0.1, glow: 0.5 }],
  ];
  return (
    <Cam f={f} a={C.surHook} b={C.kneel} cx={540} cy={900} s0={1.0} s1={1.1} hits={[K.khali]} amp={8}>
      <KuntiChamber f={f} dawn={1} sunY={300} blaze={1} />
      <SunMandala f={f} x={540} y={760} r={360} k={0.5} />
      <SuryaHalo f={f} x={540} y={1980} s={2.5} />
      <Surya f={f} id="sH" x={540} y={1980} s={2.5} facing={-1} p={{ ...kpo(f, keys), talk: talk(f, "surya") }} k={0.5} />
      <Vignette o={0.35} c="#5A2A0A" />
    </Cam>
  );
};

/** "पर मेरा विवाह नहीं हुआ… दुनिया क्या कहेगी?": she drops to her knees, the light on her back. */
const KuntiKneel: React.FC<{ f: number }> = ({ f }) => {
  const down = prog(f, C.kneel, C.kneel + 18, EASE);
  return (
    <Cam f={f} a={C.kneel} b={C.title} cx={540} cy={1250} s0={1.02} s1={1.12} hits={[K.duniya]} amp={8}>
      <KuntiChamber f={f} dawn={0.9} sunY={260} blaze={0.7} />
      <Kanya
        pal={KUNTI}
        id="kK"
        f={f}
        x={540}
        y={lerp(2000, 2140, down)}
        s={1.3}
        crown="princess"
        temple
        hands={[[-14, -520], [14, -520]]}
        lookX={-0.1}
        lookY={-0.6}
        smile={-0.6}
        sad={1}
        tears={prog(f, K.duniya - 6, K.duniya + 10)}
        speak={talk(f, "kunti")}
        tilt={-4}
        lean={-6 * down}
      />
      <Motes f={f} x={160} y={500} w={760} h={900} n={24} color="#FFE7A0" o={0.8} seed={5} />
      <Vignette o={0.5} c="#2A1206" />
    </Cam>
  );
};

const TitleWorld: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={W} height={H} fill="#1A0C06" />
    <circle cx={540} cy={820} r={760} fill="#4A2208" opacity={0.85} filter="url(#bhBlur20)" />
    <SunMandala f={f} x={540} y={820} r={300} k={0.55} />
    <circle cx={540} cy={760} r={330} fill="#1A0C06" opacity={0.7} filter="url(#bhBlur20)" />
    <path d={`M0 1460C300 ${1400 + 10 * Math.sin(f / 8)} 700 ${1520 + 10 * Math.cos(f / 9)} 1080 1440L1080 1920L0 1920Z`} fill="#2A1206" />
    <Motes f={f} x={60} y={400} w={960} h={1100} n={30} color="#FFE7A0" o={0.8} seed={9} />
  </g>
);

/** "पर ये शुरू कहाँ से हुआ? राजकुमारी कुंती ने एक साल तक ऋषि दुर्वासा की सेवा की।": rewind; a year of service in the courtyard. */
const ServiceWorld: React.FC<{ f: number }> = ({ f }) => {
  const rew = 1 - prog(f, C.intro, C.intro + 26, outCubic);
  const season = 3 * prog(f, K.seva - 20, C.boon - 4, Easing.linear);
  const walk = prog(f, K.seva - 10, K.seva + 30, EASE);
  return (
    <Cam f={f} a={C.intro} b={C.boon} cx={540} cy={1150} s0={1.12} s1={1.0}>
      <CourtyardSet f={f} season={season} />
      <Durvasa f={f} id="dS" x={330} y={1700} s={1.2} facing={1} p={{ lean: 2, sF: 10, eF: 20, head: 2, lookX: 1, lookY: 0.2, brow: 0.6, browTilt: 8, smile: lerp(-0.4, 0.1, season / 3) }} />
      <Kanya pal={KUNTI} id="sK" f={f} x={lerp(860, 720, walk)} y={1720} s={0.72} crown="princess" temple hands={[[-50, -470], [50, -470]]} lookX={-0.8} lookY={0.2} smile={0.3} tilt={-3} />
      <g transform={`translate(${lerp(860, 720, walk)} ${1720 - 0.72 * 470})`}>
        <Thali f={f} s={0.9} />
      </g>
      <Sepia k={0.75 * rew} />
      {rew > 0.02 ? <rect width={W} height={H} fill="#FFF4D6" opacity={0.3 * rew * (0.5 + 0.5 * Math.sin(f * 1.7))} /> : null}
      <Vignette o={0.45} />
    </Cam>
  );
};

/** "प्रसन्न हूँ, पुत्री। ये मंत्र लो… जिस देवता को पुकारोगी, वो आएगा।": the boon; golden syllables pass to her. */
const BoonWorld: React.FC<{ f: number }> = ({ f }) => {
  const keys: KP[] = [
    [C.boon, { lean: 0, sF: 14, eF: 30, head: 0, lookX: 1, lookY: 0.3, brow: 0.5, browTilt: 4, smile: 0.25 }],
    [K.lo, { lean: 4, sF: 70, eF: 70, wF: -30, head: -4, lookX: 1, lookY: 0.4, brow: 0.6, browTilt: 2, smile: 0.35, glow: 0.4 }],
    [K.aayega, { lean: 2, sF: 50, eF: 60, wF: -20, head: -2, lookX: 1, lookY: 0.3, brow: 0.8, browTilt: 0, smile: 0.3, glow: 0.3 }],
  ];
  return (
    <Cam f={f} a={C.boon} b={C.window} cx={560} cy={1050} s0={1.0} s1={1.12} hits={[K.lo]} amp={6}>
      <CourtyardSet f={f} season={0.2} />
      <Night o={0.15} c="#3A1A0A" />
      <Durvasa f={f} id="dB" x={360} y={1980} s={2.1} facing={1} p={{ ...kpo(f, keys), talk: talk(f, "durvasa") }} k={0.5} />
      <Kanya pal={KUNTI} id="bK" f={f} x={860} y={2060} s={1.05} crown="princess" temple hands={[[-14, -520], [14, -520]]} lookX={-0.9} lookY={-0.1} smile={0.2} tilt={-6} eyes={K.aayega < f ? 0.7 : 1} />
      <MantraFlow f={f} a={K.lo} b={C.window} x0={520} y0={1300} x1={820} y1={1260} />
      <Vignette o={0.45} />
    </Cam>
  );
};

/** "क्या सच में…? बस एक बार।": dawn at the jharokha; she joins her hands and whispers (the mantra beat). */
const WindowWorld: React.FC<{ f: number }> = ({ f }) => {
  const rise = prog(f, C.window, C.descent, Easing.linear);
  const join = prog(f, K.ekbaar - 6, K.ekbaar + 10, EASE);
  return (
    <Cam f={f} a={C.window} b={C.descent} cx={540} cy={1000} s0={1.0} s1={1.1}>
      <KuntiChamber f={f} dawn={0.3 + 0.5 * rise} sunY={-40 + 160 * rise} />
      <Kanya
        pal={KUNTI}
        id="wK"
        f={f}
        x={540}
        y={2330}
        s={1.4}
        crown="princess"
        temple
        hands={[[lerp(-60, -14, join), lerp(-450, -540, join)], [lerp(60, 14, join), lerp(-450, -540, join)]]}
        lookX={0.15}
        lookY={-0.5}
        smile={lerp(0.25, 0.05, join)}
        eyes={f > K.whisper ? 0 : 1}
        speak={talk(f, "kunti") + (f > K.whisper && f < C.descent - 4 ? 0.25 * Math.abs(Math.sin(f / 2)) : 0)}
        tilt={2}
      />
      <MantraFlow f={f} a={K.whisper} b={C.descent} x0={540} y0={1260} x1={560} y1={760} n={6} />
      <Vignette o={0.4} c="#140A10" />
    </Cam>
  );
};

/** "और आकाश से उतर आए सूर्यदेव।": the sun swells in the window and pours into the room; Surya steps out of the light. */
const DescentWorld: React.FC<{ f: number }> = ({ f }) => {
  const swell = prog(f, C.descent, K.utar + 6, Easing.in(Easing.cubic));
  const appear = prog(f, K.utar, K.surya13 + 10, outCubic);
  return (
    <Cam f={f} a={C.descent} b={C.r1} cx={540} cy={1000} s0={1.0} s1={1.18} hits={[K.surya13]} amp={14}>
      <KuntiChamber f={f} dawn={1} sunY={150 + 200 * swell} blaze={0.75 * swell} />
      <SunMandala f={f} x={540} y={lerp(1000, 760, appear)} r={180 + 60 * appear} k={0.8 * swell * (1 - 0.5 * appear)} />
      <g opacity={appear} transform={`translate(0 ${(1 - appear) * -160})`}>
        <SuryaHalo f={f} x={470} y={1880} s={lerp(1.2, 1.6, appear)} k={appear} />
        <Surya f={f} id="sD" x={470} y={1880} s={lerp(1.2, 1.6, appear)} facing={1} p={{ lean: 0, sF: 40, eF: 60, wF: -10, head: 0, lookX: 0.8, lookY: 0.3, brow: 0.3, smile: 0.15, glow: 0.5 }} />
      </g>
      <Kanya pal={KUNTI} id="dK" f={f} x={900} y={2060} s={1.0} crown="princess" temple hands={[[-80, -560], [80, -680]]} openR palmRot={-160} lookX={-0.7} lookY={-0.4} smile={-0.4} sad={0.7} lean={6 * appear} />
      <Vignette o={0.3} c="#5A2A0A" />
    </Cam>
  );
};

/** Replay of line 1, a tighter angle: "सूर्यदेव… लौट जाइए!" */
const ReplayKunti: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.r1} b={C.threat} cx={540} cy={1180} s0={1.12} s1={1.2} hits={[K.r1 + 2]} amp={10}>
    <KuntiChamber f={f} dawn={1} sunY={300} blaze={0.95} />
    <Kanya pal={KUNTI} id="rK" f={f} x={520} y={2380} s={1.7} crown="princess" temple hands={[[-50, -460], [60, -760]]} openR palmRot={-170} eyes={0.35} lookX={0.4} lookY={-0.3} smile={-0.6} sad={1} speak={talk(f, "kunti")} tilt={-8} lean={-4} />
    <Vignette o={0.35} c="#3A1A0A" />
  </Cam>
);

/** "देवता खाली हाथ नहीं लौटता। मुझे लौटाया, तो दंड तुम्हारे पिता को भी मिलेगा।": the light turns hard; the lamps bend. */
const ThreatWorld: React.FC<{ f: number }> = ({ f }) => {
  const hard = prog(f, K.dand - 8, K.dand + 6, EASE);
  const keys: KP[] = [
    [C.threat, { lean: 0, sF: 30, eF: 50, head: 0, lookX: 1, lookY: 0.3, brow: 0.5, browTilt: 4, smile: 0, glow: 0.5 }],
    [K.dand + 2, { lean: 3, sF: 90, eF: 30, wF: -10, head: -4, lookX: 1, lookY: 0.4, brow: 0.9, browTilt: 14, smile: -0.3, glow: 0.9, fist: 0 }],
    [K.pita + 6, { lean: 2, sF: 80, eF: 40, wF: 0, head: -2, lookX: 1, lookY: 0.4, brow: 0.9, browTilt: 12, smile: -0.3, glow: 0.8 }],
    [C.vachan, { lean: 0, sF: 40, eF: 50, head: 0, lookX: 1, lookY: 0.4, brow: 0.6, browTilt: 6, smile: -0.1, glow: 0.5 }],
  ];
  return (
    <Cam f={f} a={C.threat} b={C.vachan} cx={540} cy={880} s0={1.04} s1={1.14} hits={[K.dand]} amp={12}>
      <KuntiChamber f={f} dawn={1} sunY={300} blaze={1} lamps={1 - hard} />
      <rect width={W} height={H} fill="#FF6A1E" opacity={0.18 * hard} style={{ mixBlendMode: "multiply" }} />
      <SuryaHalo f={f * (1 + hard)} x={540} y={1990} s={2.6} />
      <Surya f={f} id="sT" x={540} y={1990} s={2.6} facing={-1} p={{ ...kpo(f, keys), talk: talk(f, "surya") }} k={0.4} />
      <Vignette o={0.4 + 0.2 * hard} c="#4A1A04" />
    </Cam>
  );
};

/** "तो वचन दीजिए… मेरा मान बना रहेगा।": she looks up, trembling, still on her knees. */
const VachanWorld: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.vachan} b={C.bless} cx={540} cy={1200} s0={1.06} s1={1.14} hits={[K.maan]} amp={5}>
    <KuntiChamber f={f} dawn={1} sunY={300} blaze={0.75} />
    <Kanya
      pal={KUNTI}
      id="vK"
      f={f}
      x={540 + Math.sin(f * 1.3) * 1.5}
      y={2300}
      s={1.55}
      crown="princess"
      temple
      hands={[[-14, -520], [14, -520]]}
      lookX={0.1}
      lookY={-0.8}
      smile={-0.3}
      sad={0.8}
      tears={0.6}
      speak={talk(f, "kunti")}
      tilt={kn(f, [[C.vachan, -6], [K.maan, 3]])}
    />
    <Motes f={f} x={160} y={400} w={760} h={900} n={20} color="#FFE7A0" o={0.7} seed={15} />
    <Vignette o={0.45} c="#2A1206" />
  </Cam>
);

/** "बना रहेगा। और मेरे तेज से तुम्हें पुत्र मिलेगा।": blessing hand; a small sun settles over her (the blessing beat). */
const BlessWorld: React.FC<{ f: number }> = ({ f }) => {
  const orb = prog(f, K.putra - 4, C.birth - 6, Easing.inOut(Easing.sin));
  const keys: KP[] = [
    [C.bless, { lean: 0, sF: 30, eF: 50, head: 0, lookX: 1, lookY: 0.2, brow: 0.3, smile: 0.3, glow: 0.3 }],
    [K.putra, { lean: 3, sF: 100, eF: 20, wF: -30, head: -3, lookX: 1, lookY: 0.3, brow: 0.4, smile: 0.4, glow: 0.5 }],
  ];
  const ox = lerp(430, 780, orb);
  const oy = lerp(1050, 1180, orb) - Math.sin(orb * Math.PI) * 160;
  return (
    <Cam f={f} a={C.bless} b={C.birth} cx={560} cy={1150} s0={1.0} s1={1.08} hits={[K.bana]} amp={5}>
      <KuntiChamber f={f} dawn={1} sunY={300} blaze={0.8} />
      <SuryaHalo f={f} x={330} y={1760} s={1.3} />
      <Surya f={f} id="sB" x={330} y={1760} s={1.3} facing={1} p={{ ...kpo(f, keys), talk: talk(f, "surya") }} lotus={false} />
      <Kanya pal={KUNTI} id="lK" f={f} x={790} y={1790} s={0.82} crown="princess" temple hands={[[-14, -520], [14, -520]]} lookX={-0.8} lookY={-0.3} smile={0.1} sad={0.4} eyes={orb > 0.8 ? 0.2 : 1} tilt={-4} glow={orb} />
      {orb > 0.01 && orb < 0.99 ? (
        <g transform={`translate(${ox} ${oy})`}>
          <circle r={70} fill="#FFD36A" opacity={0.5} filter="url(#w5Blur14)" />
          <circle r={26} fill="#FFF6D8" />
          <SunRays x={0} y={0} r={30} k={0.8} f={f} n={16} />
        </g>
      ) : null}
      <Vignette o={0.4} c="#3A1A0A" />
    </Cam>
  );
};

/** "समय आया… एक बालक जन्मा, कवच-कुंडल पहने।": a dark room, the newborn glowing gold in his armour and earrings. */
const BirthWorld: React.FC<{ f: number }> = ({ f }) => {
  const reveal = prog(f, C.birth, K.kavach + 4, outCubic);
  return (
    <Cam f={f} a={C.birth} b={C.dai} cx={540} cy={1060} s0={1.2} s1={1.0} hits={[K.kavach]} amp={6}>
      <KuntiChamber f={f} dawn={0} sunY={-100} lamps={0.6} />
      <Night o={0.55} c="#0C0618" />
      <circle cx={540} cy={1080} r={380 * reveal} fill="#FFD36A" opacity={0.22} filter="url(#w5Blur30)" />
      <path d="M200 1210C220 1150 860 1150 880 1210L880 1290L200 1290Z" fill="#6A1A2A" />
      <path d="M200 1210C220 1150 860 1150 880 1210" stroke="url(#mGold)" strokeWidth={8} fill="none" />
      <g transform="translate(500 1150)">
        <KarnaBaby f={f} s={2.6 + 0.2 * reveal} glow={0.15 + 0.25 * reveal} shine={reveal} />
      </g>
      <SunRays x={440} y={1120} r={200} k={0.3 * reveal} f={f} n={24} />
      <Motes f={f} x={300} y={800} w={500} h={500} n={22} color="#FFE7A0" o={reveal} seed={21} />
      <Vignette o={0.6} />
    </Cam>
  );
};

/** "राजकुमारी… अब क्या करेंगी?": the old nurse at the door with a lamp; Kunti holds the baby, afraid. */
const DaiWorld: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.dai} b={C.river} cx={540} cy={1150} s0={1.02} s1={1.1}>
    <KuntiChamber f={f} dawn={0} sunY={-100} lamps={0.5} />
    <Night o={0.55} c="#0C0618" />
    <circle cx={300} cy={1150} r={340} fill="#FFB04A" opacity={0.25} filter="url(#w5Blur30)" />
    <Kanya pal={DAI} id="dD" f={f} x={290} y={1820} s={0.86} crown="none" old={1} veil={1} plain hands={[[-40, -470], [70, -600]]} lookX={0.7} lookY={0.1} smile={-0.3} sad={0.7} speak={talk(f, "dai")} lean={3} />
    <g transform="translate(350 1300)">
      <path d="M-22 0C-20 12 20 12 22 0Z" fill="url(#mGold)" />
      <path d={`M-4 -2C-5 -12 -1 -16 0 ${-26 - 2 * Math.sin(f / 3)}C1 -16 5 -12 4 -2Z`} fill="#FFC23A" />
      <circle cy={-10} r={50} fill="#FFB04A" opacity={0.35} filter="url(#w5Blur14)" />
    </g>
    <Kanya pal={KUNTI} id="kD" f={f} x={770} y={1840} s={0.9} crown="princess" temple hands={[[-40, -470], [40, -470]]} lookX={-0.6} lookY={0.3} smile={-0.4} sad={0.9} tilt={-6} />
    <g transform={`translate(770 ${1840 - 0.9 * 500})`}>
      <KarnaBaby f={f} s={0.62} glow={0.5} />
    </g>
    <Vignette o={0.55} />
  </Cam>
);

/** "रात में, चुपचाप, कुंती ने उसे टोकरी में रखा… और नदी में छोड़ दिया।": the ghat at night; the basket set on the water drifts off. */
const RiverWorld: React.FC<{ f: number }> = ({ f }) => {
  const place = prog(f, K.tokri - 6, K.tokri + 20, EASE);
  const drift = prog(f, K.nadi, C.tears + 6, Easing.inOut(Easing.sin));
  return (
    <Cam f={f} a={C.river} b={C.tears} cx={540} cy={1250} s0={1.06} s1={1.0}>
      <NightRiver f={f} />
      <g transform={`translate(${lerp(600, 780, drift)} ${lerp(lerp(1290, 1340, place), 1150, drift)}) scale(${lerp(1, 0.55, drift)})`}>
        <Basket f={f} s={1.15} glow={0.6} bob={drift} />
      </g>
      <Kanya pal={KUNTI} id="nK" f={f} x={330} y={2000} s={1.25} crown="princess" temple hands={[[lerp(-40, -60, place), lerp(-470, -380, place)], [lerp(40, 120, place), lerp(-470, -380, place)]]} lookX={0.5} lookY={0.6} smile={-0.5} sad={1} tears={drift} lean={lerp(0, 8, place)} />
      <Night o={0.15} c="#060A20" />
      <Vignette o={0.5} c="#04061A" />
    </Cam>
  );
};

/** "जहाँ भी जाओ… जीते रहना, मेरे लाल।": close on her face, tears catching moonlight; the basket far away on the moon path. */
const TearsWorld: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.tears} b={C.journey} cx={540} cy={1100} s0={1.04} s1={1.12} hits={[K.lal]} amp={3}>
    <NightRiver f={f} steps={false} horizon={1250} />
    <g transform={`translate(${lerp(760, 820, prog(f, C.tears, C.journey))} 1290) scale(0.32)`}>
      <Basket f={f} glow={0.8} bob={1} />
    </g>
    <Kanya pal={KUNTI} id="tK" f={f} x={480} y={2420} s={1.75} crown="princess" temple hands={[[-30, -480], [50, -620]]} lookX={0.6} lookY={0.2} smile={-0.4} sad={1} tears={1} speak={talk(f, "kunti")} tilt={kn(f, [[C.tears, -2], [K.lal, -8]])} />
    <rect width={W} height={H} fill="#6A80D0" opacity={0.12} style={{ mixBlendMode: "screen" }} />
    <Vignette o={0.55} c="#04061A" />
  </Cam>
);

/** "नदी उसे दूर ले गई… सारथी अधिरथ के पास।": the basket drifts on; night melts into a rose-gold dawn far downstream. */
const JourneyWorld: React.FC<{ f: number }> = ({ f }) => {
  const day = prog(f, C.journey + 10, K.adhi - 4, Easing.inOut(Easing.sin));
  const u = prog(f, C.journey, C.adhi, Easing.linear);
  return (
    <Cam f={f} a={C.journey} b={C.adhi} cx={540} cy={1200} s0={1.0} s1={1.06}>
      <NightRiver f={f} steps={false} horizon={1000} />
      <g opacity={day}>
        <DawnRiver f={f} bank={day > 0.6} horizon={1000} sunX={300} />
      </g>
      <g transform={`translate(${lerp(140, 640, u)} ${lerp(1260, 1480, u)}) scale(${lerp(0.5, 0.85, u)})`}>
        <Basket f={f} glow={0.7} bob={1} />
      </g>
      <Vignette o={lerp(0.5, 0.25, day)} c={day > 0.5 ? "#3A1A20" : "#04061A"} />
    </Cam>
  );
};

/** "राधा! देखो… गंगा माँ ने बेटा दिया है!": Adhiratha lifts the glowing baby from the basket; Radha runs down the bank. */
const AdhirathaWorld: React.FC<{ f: number }> = ({ f }) => {
  const lift = prog(f, C.adhi, K.beta, EASE);
  const run = prog(f, K.radha, C.karna, Easing.out(Easing.quad));
  const keys: KP[] = [
    [C.adhi, { lean: 8, sF: 40, eF: 40, wF: 0, head: 6, lookX: 0.6, lookY: 0.8, brow: 0.6, smile: 0.3 }],
    [K.radha, { lean: 2, sF: 110, eF: 40, wF: -20, head: -6, lookX: -0.4, lookY: -0.2, brow: 1, browTilt: -6, smile: 0.7 }],
    [K.beta, { lean: -2, sF: 150, eF: 20, wF: -20, head: -10, lookX: 0.3, lookY: -0.6, brow: 1, browTilt: -8, smile: 1 }],
    [C.karna, { lean: -2, sF: 150, eF: 22, wF: -20, head: -8, lookX: 0.3, lookY: -0.6, brow: 0.9, browTilt: -6, smile: 1 }],
  ];
  return (
    <Cam f={f} a={C.adhi} b={C.karna} cx={540} cy={1150} s0={1.04} s1={1.1} hits={[K.radha, K.beta]} amp={7}>
      <DawnRiver f={f} bank horizon={980} sunX={300} />
      <Kanya pal={RADHA} id="aR" f={f} x={lerp(1040, 860, run)} y={1700} s={0.62} crown="none" plain hands={[[-80, -560], [80, -640]]} openR palmRot={-110} lookX={-0.8} lookY={-0.2} smile={0.6} lean={-6 * (1 - run)} />
      <Man
        f={f}
        id="aA"
        who={ADHIRATHA}
        x={450}
        y={1690}
        s={1.42}
        facing={1}
        p={{ ...kpo(f, keys), talk: talk(f, "adhiratha") }}
        prop={<g transform="translate(10 10)"><KarnaBaby f={f} s={0.95} glow={0.3 + 0.4 * lift} /></g>}
        backProp={<Whip f={f} />}
      />
      <SunRays x={300} y={890} r={120} k={0.5} f={f} n={24} />
      <Vignette o={0.3} c="#3A1A20" />
    </Cam>
  );
};

/** "सूर्य का बेटा… अब सारथी का बेटा था। दुनिया उसे जानेगी… कर्ण।": the baby in sunrays; the stamp. */
const KarnaWorld: React.FC<{ f: number }> = ({ f }) => {
  const sun = prog(f, C.karna, K.sarathi, outCubic);
  const dim = prog(f, K.sarathi, K.sarathi + 20, EASE) * (1 - prog(f, K.karna - 6, K.karna + 4, EASE));
  return (
    <Cam f={f} a={C.karna} b={C.rani} cx={540} cy={1050} s0={1.14} s1={1.0} hits={[K.karna]} amp={10}>
      <DawnRiver f={f} bank={false} horizon={1250} sunX={540} />
      <SunMandala f={f} x={540} y={900} r={300} k={sun * (1 - 0.6 * dim)} />
      <rect width={W} height={H} fill="#2A1A20" opacity={0.45 * dim} />
      <g transform="translate(470 1180)">
        <path d="M-250 40C-230 -30 290 -30 310 40L310 120L-250 120Z" fill="#E8DCC8" />
        <KarnaBaby f={f} s={2.6} glow={0.5 + 0.5 * sun} shine={sun} />
      </g>
      <Motes f={f} x={200} y={600} w={700} h={800} n={24} color="#FFE7A0" o={0.9} seed={33} />
      <Vignette o={0.4} c="#3A1A20" />
    </Cam>
  );
};

/** "बरसों बाद कुंती राजा पांडु की रानी बनीं। पर ये राज़… उन्होंने कभी किसी से नहीं कहा।": Hastinapur court; the secret's shadow; freeze. */
const RaniWorld: React.FC<{ f: number }> = ({ f }) => {
  const shadow = prog(f, K.raaz - 6, K.raaz + 20, EASE);
  const freeze = prog(f, K.kabhi + 20, C.feature, EASE);
  return (
    <g>
      <Cam f={f} a={C.rani} b={C.feature} cx={540} cy={1150} s0={1.0} s1={1.1}>
        <CourtSet f={f} />
        <Night o={0.25} />
        <Man f={f} id="rP" who={PANDU5} x={360} y={1760} s={1.3} facing={1} p={{ lean: 0, sF: 12, eF: 16, head: 2, lookX: 1, lookY: 0, smile: 0.2 }} />
        <g opacity={0.5 * shadow} transform={`translate(760 ${1180 - 30 * shadow}) scale(0.9)`}>
          <ellipse rx={260} ry={120} fill="#FFD36A" opacity={0.4} filter="url(#w5Blur30)" />
          <Basket f={f} glow={0.6} />
        </g>
        <Kanya pal={KUNTI_RANI} id="rK" f={f} x={730} y={1790} s={0.86} crown="rani" nath temple hands={[[-14, -520], [14, -520]]} lookX={lerp(-0.6, 0.3, shadow)} lookY={lerp(0, 0.3, shadow)} smile={lerp(0.3, -0.2, shadow)} sad={0.6 * shadow} tilt={-3} />
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
    <HoraDial f={f} x={540} y={980} r={250} at={K.hora} font={MUKTA} />
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

const KEYW = new Set(["शुरू", "सेवा", "दुर्वासा", "उतर", "सूर्यदेव।", "समय", "कवच-कुंडल", "टोकरी", "नदी", "अधिरथ", "सूर्य", "सारथी", "कर्ण।", "पांडु", "राज़…", "कभी", "ग्रह", "घड़ी", "होरा", "मंत्र", "ज्योतिक़", "फ़्री।"]);
const WHO: Record<string, string> = {
  kunti: "राजकुमारी कुंती",
  surya: "सूर्यदेव",
  durvasa: "ऋषि दुर्वासा",
  dai: "दाई",
  adhiratha: "सारथी अधिरथ",
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
            filter: "drop-shadow(0 0 22px rgba(26,12,6,0.95)) drop-shadow(0 10px 30px rgba(255,190,80,0.35))",
            transform: `scale(${1.6 - 0.6 * t})`,
            opacity: Math.min(1, t * 2),
          }}
        >
          भारत
        </div>
        <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 40, letterSpacing: 18, color: "#FFE3A1", opacity: sub, marginTop: -10 }}>BHARATA</div>
        <div style={{ marginTop: 24, padding: "12px 34px", borderRadius: 40, background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 44, opacity: sub, transform: `translateY(${(1 - sub) * 30}px)` }}>
          Episode 5 · कुंती का मंत्र
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

const FeatureText: React.FC<{ f: number }> = ({ f }) => {
  const k = prog(f, C.feature + 2, C.feature + 14, outBack);
  const card = prog(f, K.mantraF - 4, K.mantraF + 8, outBack);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - k) * 60}px)` }}>
        <div style={{ padding: "14px 40px", borderRadius: 40, background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 56, boxShadow: "0 10px 24px rgba(224,72,43,0.35)" }}>होरा अलर्ट · फ़्री</div>
        <div style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 34, color: S.brownMid }}>हर घंटे कौन-सा ग्रह, मंत्र के साथ</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1330, display: "flex", justifyContent: "center", opacity: Math.min(1, card * 1.5), transform: `translateY(${(1 - card) * 50}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 30px", borderRadius: 30, background: "#FFFFFF", border: `3px solid ${S.goldLight}`, boxShadow: "0 12px 28px rgba(58,31,18,0.18)" }}>
          <div style={{ width: 76, height: 76, borderRadius: 38, background: "radial-gradient(circle, #FFF3C0 0%, #FFB23D 60%, #FF8A1E 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, color: "#FFF" }}>☉</div>
          <div>
            <div style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: 40, color: S.brown }}>अभी सूर्य होरा चल रहा है</div>
            <div style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 32, color: S.red }}>मंत्र: ॐ सूर्याय नमः</div>
          </div>
        </div>
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
        <div style={{ fontFamily: ROZHA, fontSize: 84, lineHeight: 1.1, background: "linear-gradient(180deg, #FFF3C4 0%, #F6C14E 60%, #C07A1E 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>एकलव्य का अंगूठा</div>
        <div style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 34, color: "#FFF3DA" }}>“गुरु-दक्षिणा में… अंगूठा।”</div>
      </div>
      <div style={{ ...st(1), display: "flex", alignItems: "center", gap: 20, marginTop: 6 }}>
        <div style={{ width: 120, height: 120, borderRadius: 60, background: "radial-gradient(circle at 50% 40%, #2A1830 0%, #120C16 75%)", border: `3px solid ${S.gold}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Img src={staticFile("jyotiq/logo-full.png")} style={{ width: 82, height: 96, objectFit: "contain" }} />
        </div>
        <TwoTone parts={[p("ज्योतिक़ "), p("डाउनलोड कीजिए", true)]} size={66} />
      </div>
      <div style={{ ...st(2), display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, maxWidth: 940 }}>
        {["होरा अलर्ट", "फ़्री कुंडली", "दशा", "गोचर", "पंचांग"].map((t, i) => (
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
        कमेंट करें: कुंती सही थीं या गलत?
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
  { a: 0, b: C.surHook, World: HookKunti },
  { a: C.surHook, b: C.kneel, World: SuryaHook },
  { a: C.kneel, b: C.title, World: KuntiKneel },
  { a: C.title, b: C.intro, World: TitleWorld },
  { a: C.intro, b: C.boon, World: ServiceWorld },
  { a: C.boon, b: C.window, World: BoonWorld },
  { a: C.window, b: C.descent, World: WindowWorld },
  { a: C.descent, b: C.r1, World: DescentWorld },
  { a: C.r1, b: C.threat, World: ReplayKunti },
  { a: C.threat, b: C.vachan, World: ThreatWorld },
  { a: C.vachan, b: C.bless, World: VachanWorld },
  { a: C.bless, b: C.birth, World: BlessWorld },
  { a: C.birth, b: C.dai, World: BirthWorld },
  { a: C.dai, b: C.river, World: DaiWorld },
  { a: C.river, b: C.tears, World: RiverWorld },
  { a: C.tears, b: C.journey, World: TearsWorld },
  { a: C.journey, b: C.adhi, World: JourneyWorld },
  { a: C.adhi, b: C.karna, World: AdhirathaWorld },
  { a: C.karna, b: C.rani, World: KarnaWorld },
  { a: C.rani, b: C.feature, World: RaniWorld },
  { a: C.feature, b: C.end, World: FeatureWorld },
  { a: C.end, b: TOTAL, World: EndWorld },
];
const XFADE: Record<number, number> = { [C.intro]: 6, [C.window]: 8, [C.birth]: 12, [C.river]: 10, [C.journey]: 8, [C.rani]: 12, [C.end]: 8 };

export const Bharata5Reel: React.FC = () => {
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
    <AbsoluteFill style={{ background: "#1A0C06", overflow: "hidden" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <RigDefs />
        <SetDefs />
        <NvDefs />
        <N2Defs />
        <BhDefs />
        <ChDefs />
        <W5Defs />
        {layers}
      </svg>

      {f < hookEnd ? (
        <div style={{ position: "absolute", inset: 0, opacity: hookOut, transform: `scale(${1 + 0.015 * Math.sin(f / 10)})`, transformOrigin: "50% 30%" }}>
          <HookPlate y={380} size={70} lines={[[p("कुंती ने अपना "), p("बेटा", true), p(" क्यों बहाया?")]]} chip="एक मंत्र… और महाभारत का सबसे बड़ा राज़" />
        </div>
      ) : null}

      <Chip f={f} at={C.intro + 4} out={K.seva - 6} text="⏪ बरसों पहले… राजा कुंतिभोज का महल" y={560} />
      <NameChipIn f={f} at={K.durvasa - 4} out={C.boon - 4} hi="दुर्वासा" en="DURVASA" tag="क्रोध के लिए प्रसिद्ध ऋषि" y={520} icon="ॐ" />
      <Chip f={f} at={K.seva + 10} out={K.durvasa - 8} text="एक साल की सेवा" y={560} />
      <Chip f={f} at={K.aayega} out={C.window - 2} text="वरदान: किसी भी देवता को बुलाने का मंत्र" y={560} />
      <NameChipIn f={f} at={C.window + 6} out={K.whisper} hi="कुंती" en="KUNTI" tag="राजा कुंतिभोज की पुत्री" y={520} icon="✿" />
      <NameChipIn f={f} at={K.surya13 + 4} out={C.r1 + 30} hi="सूर्यदेव" en="SURYA" tag="प्रकाश और तेज के देवता" y={520} icon="☀" />
      <Chip f={f} at={K.kavach} out={C.dai - 2} text="जन्म से कवच और कुंडल" y={560} />
      <NameChipIn f={f} at={K.adhi} out={K.beta + 10} hi="अधिरथ" en="ADHIRATHA" tag="सारथी · पत्नी राधा" y={520} icon="☸" />
      <Stamp f={f} at={K.karna} out={C.rani - 2} text={[p("कर्ण", true)]} y={520} size={170} sub="सूर्यपुत्र · राधेय" dark />
      <Chip f={f} at={K.pandu} out={K.raaz - 4} text="हस्तिनापुर · महारानी कुंती" y={560} />
      <Chip f={f} at={K.raaz + 6} out={C.feature - 4} text="🤫 एक राज़… जो कोई नहीं जानता था" y={560} />

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

      <Flash f={f} at={K.laut} color="#FFF4C0" peak={0.35} rise={1} fall={8} />
      <Flash f={f} at={K.khali} color="#FFE0A0" peak={0.25} rise={1} fall={8} />
      <Flash f={f} at={C.title} color="#FFF4D6" peak={1} rise={3} fall={14} />
      <Flash f={f} at={C.intro} color="#FFF4D6" peak={0.6} rise={2} fall={10} />
      <Flash f={f} at={K.lo} color="#FFE7A0" peak={0.3} fall={10} />
      <Flash f={f} at={K.surya13} color="#FFFFFF" peak={0.85} rise={2} fall={14} />
      <Flash f={f} at={K.dand} color="#FF9A4A" peak={0.35} rise={1} fall={10} />
      <Flash f={f} at={K.bless} color="#FFF0B8" peak={0.5} rise={2} fall={10} />
      <Flash f={f} at={K.kavach} color="#FFE7A0" peak={0.4} fall={10} />
      <Flash f={f} at={K.beta} color="#FFF4D6" peak={0.3} fall={10} />
      <Flash f={f} at={K.karna} color="#FFE7A0" peak={0.7} fall={12} />
      <Flash f={f} at={C.feature} peak={0.7} fall={8} />

      <Chrome f={f} brand={1} panel={0} />
    </AbsoluteFill>
  );
};
