import React from "react";
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from "remotion";
import { AppStoreButton, PlayButton } from "../../katha/reelKit";
import { Puppet, RigDefs, blinkAt, idle, pose } from "../../manthan/rig";
import { SetDefs } from "../../manthan/sets";
import { Cam, Cracks, Flash, Motes, NameChipIn, PanelArrow, PanelPulse, Petals, Pop, SaturnHalo, inCubic, lerp, outBack, outCubic, prog, vnoise } from "../../navagraha/ep1/anim";
import { Chrome, GRAD, HookPlate, JAKARTA, MUKTA, Part, Pill, Presents, S, TwoTone, gradText } from "../../navagraha/ep1/look";
import { NvOpen, nvOpenBug } from "../../navagraha/ep1/open";
import { ForestSet, H, NvDefs, PalaceSet, SunRays, SvgImage, W } from "../../navagraha/ep1/world";
import { GlanceBeam, KailashSet, N2Defs, Scales, ShaniKundali } from "../../navagraha/ep2/anim2";
import { BabyGanesha, BowProp, ChakraProp, Crow, CurseRing, Embers, FireSky, GarudaWings, KQDefs, Kalank, LooseCrown, NineSeats, Seat, Swaddle, WiltLotus } from "./art";
import { KSHANI, KVIKRAM, KVIKRAM_BARE, KVISHNU } from "./cast";
import { KCaptionQ } from "./kit";
import { ParvatiStanding } from "./parvati";
import { INTRO, PHRASES, TOTAL, WORDS } from "./timing";

/*
 * क्या होता अगर… Ep2 · शनि की टेढ़ी नज़र (14 Nov 2026): the full reel, TOTAL frames at 30 fps, 1080x1920, in the
 * Navagraha series look (shared rig, sets, chrome, captions). Clock: timing.ts (kya-hota-agar-ep2/tools/vo_prep.py:
 * Kaal + Parvati + Shani + Vikramaditya). Earlier episodes are imported read-only. Audio is muxed after the render.
 * Order (Ayush): the hook first, then "Jyotiq presents" with the brand starter (NvOpen, time-squeezed), then the story.
 */

export const KQ2_TOTAL = TOTAL;

const P = PHRASES;
const A = (i: number) => P[i].a;
const B = (i: number) => P[i].b;
const cue = (p: number, w: string) => (WORDS.find((x) => x.p === p && x.w.startsWith(w)) ?? WORDS.find((x) => x.p === p)!).a;
const p = (t: string, hi = false): Part => ({ t, hi });

/* starter window: hook end -> story start; the 150-frame brand open is squeezed into it */
const OPEN_A = B(2) - 3;
const OPEN_B = A(3) - 6;
const openF = (f: number) => ((f - OPEN_A) * 150) / (OPEN_B - OPEN_A);

const C = {
  hookB: P[1].a - 2,
  hookC: P[2].a - 2,
  open: OPEN_A,
  curse: A(3) - 3,
  lotus: A(4) - 2,
  lower: A(6) - 2,
  kailash: A(7) - 2,
  parvati: A(8) - 3,
  side: A(9) - 2,
  eye: A(10) - 2,
  hush: A(11) - 2,
  vishnu: A(13) - 2,
  reveal: A(14) - 2,
  court: A(16) - 2,
  iron: A(17) - 2,
  shaniSpeak: A(18) - 3,
  sadeSati: A(19) - 2,
  kalank: A(20) - 2,
  crown: A(21) - 2,
  arrive: A(22) - 2,
  restore: A(23) - 2,
  ask: A(24) - 2,
  vikramSpeak: A(25) - 3,
  danda: A(26) - 2,
  hisaab: A(27) - 2,
  feature: A(28) - 3,
  phone: A(29) - 2,
  end: B(29) + 6,
};
const K = {
  najar: cue(1, "नज़र"),
  aap: cue(2, "आप"),
  shraap: cue(3, "श्राप"),
  anisht: cue(5, "अनिष्ट"),
  ganesh: cue(7, "गणेश"),
  parvatiW: cue(7, "पार्वती"),
  pal: cue(10, "पल"),
  sir: cue(11, "सिर"),
  alag: cue(12, "अलग"),
  vishnuW: cue(13, "विष्णु"),
  gajanan: A(15),
  vikram: cue(16, "विक्रमादित्य"),
  aakhiri: cue(16, "आख़िरी"),
  lohe: A(17),
  saadhe: A(19),
  kalankW: cue(20, "कलंक"),
  chhin: cue(21, "छिन"),
  khud: cue(22, "ख़ुद"),
  lauta: cue(23, "लौटा"),
  danda: cue(26, "दंड"),
  hisaab: cue(27, "हिसाब"),
};

const talking = (f: number, a: number, b: number, seed = 11) =>
  f >= a && f <= b ? Math.min(1, 0.18 + 0.5 * Math.abs(vnoise(f / 2.2, seed)) + 0.25 * Math.abs(Math.sin(f * 1.15))) : 0;

type PP = Partial<ReturnType<typeof pose>>;
type Fig = { f: number; id: string; x: number; y: number; s: number; facing?: number; p?: PP };

/** Shani, the adult graha, with his bow in the back hand. */
const Shani: React.FC<Fig & { bow?: boolean; crow?: boolean; flap?: number }> = ({ f, id, x, y, s, facing = 1, p: o = {}, bow = true, crow = false, flap = 0 }) => {
  const ps = pose({ ...idle(id, f, 0.7), blink: blinkAt(id, f), ...o });
  return (
    <g>
      <Puppet id={id} who={KSHANI} at={{ x, y, s, facing }} p={ps} t={f} backProp={bow ? <BowProp /> : undefined} />
      {crow ? <Crow f={f} x={x + facing * s * -70} y={y + ps.bob + s * -214} s={s * 0.42} facing={facing} flap={flap} /> : null}
    </g>
  );
};

const Vishnu: React.FC<Fig & { glow?: number }> = ({ f, id, x, y, s, facing = 1, p: o = {}, glow = 1 }) => (
  <Puppet
    id={id}
    who={KVISHNU}
    at={{ x, y, s, facing }}
    p={pose({ ...idle(id, f, 0.6), blink: blinkAt(id, f), sF: 100, eF: 70, wF: -10, sB: 20, eB: 40, ...o })}
    t={f}
    prop={<ChakraProp f={f} glow={glow} />}
  />
);

const Vikram: React.FC<Fig & { drain?: number; bare?: boolean }> = ({ f, id, x, y, s, facing = 1, p: o = {}, drain = 0, bare = false }) => (
  <Puppet id={id} who={bare ? KVIKRAM_BARE : KVIKRAM} at={{ x, y, s, facing }} p={pose({ ...idle(id, f), blink: blinkAt(id, f), ...o })} t={f} drain={drain} />
);

/** Hands joined (namaste) for the rig: both forearms meet in front of the chest. */
// solved by two-link IK: palms meet at the sternum (~(76, -130) in puppet units), elbows tucked, fingers up and a little forward
const NAMASTE: PP = { sF: -33, eF: 137, wF: 66, sB: 15, eB: 94, wB: 61, fist: 0 };

/* ================================================================== */
/* Scenes                                                              */
/* ================================================================== */

/** Hook A: fire sky, Saturn, Shani standing with his crow, eyes shut; slow push. */
const HookA: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={0} b={C.hookB} cx={540} cy={900} s0={1} s1={1.12}>
    <FireSky f={f} />
    <Shani f={f} id="hA" x={540} y={1280} s={1.2} facing={1} crow p={{ blink: 1, head: 6, lookY: 0.4, glow: 0.05 }} />
  </Cam>
);

/** Hook B: closer; on "नज़र" his eyes open to the side, cold light. */
const HookB: React.FC<{ f: number }> = ({ f }) => {
  const open = prog(f, K.najar - 4, K.najar + 4);
  return (
    <Cam f={f} a={C.hookB} b={C.hookC} cx={520} cy={760} s0={1} s1={1.1} hits={[K.najar]} amp={10}>
      <FireSky f={f} heat={1.2} />
      <Shani f={f} id="hB" x={480} y={1660} s={2.2} facing={1} p={{ blink: 1 - open, head: lerp(6, -2, open), lookX: 0.9, lookY: 0.1, brow: 0.3, browTilt: 10 * open, glow: 0.9 * open, smile: -0.2 }} />
    </Cam>
  );
};

/** Hook C: "आप पर पड़ जाए?" an extreme close on the eyes, the glance comes at the lens, the screen cracks. */
const HookC: React.FC<{ f: number }> = ({ f }) => {
  const at = prog(f, K.aap - 2, B(2) - 2, Easing.in(Easing.quad));
  return (
    <Cam f={f} a={C.hookC} b={C.open + 8} cx={455} cy={1180} s0={1.55} s1={1.95} hits={[B(2) - 4]} amp={22}>
      <FireSky f={f} heat={1.4} />
      <Shani f={f} id="hC" x={440} y={1640} s={1.65} facing={1} p={{ lookX: lerp(0.9, 0.2, at), lookY: 0, brow: 0.6, browTilt: 14, glow: 1, smile: -0.3, head: -4 }} />
      <circle cx={470} cy={1130} r={lerp(20, 900, at)} fill="url(#kqCool)" opacity={0.9 * at} />
    </Cam>
  );
};

/** Under the brand starter: the yellow site look with Saturn's rings round the sun wheel. */
const TitleWorld: React.FC<{ f: number }> = ({ f }) => {
  const s = lerp(0.92, 1.02, prog(f, C.open, C.curse, outCubic));
  return (
    <g>
      <rect width={W} height={H} fill="url(#nvSkyPalace)" />
      <circle cx={540} cy={860} r={600} fill="url(#nvWarm)" opacity={0.95} />
      <g transform={`translate(536 760) scale(${s}) rotate(${(f - C.open) * 0.3}) translate(-536 -760)`}>
        <SunRays x={536} y={760} r={150} k={0.8} f={f} n={32} />
        <SvgImage file="jyotiq/site/hero-right-image.png" x={170} y={450} width={740} height={740 * (1293 / 1216)} />
      </g>
      <SaturnHalo f={f} at={INTRO[1].a} x={536} y={760} r={300} />
      <Embers f={f} n={22} k={0.5} seed={9} />
    </g>
  );
};

/** "शनि पर पत्नी का श्राप था…": Shani walks (wide), crow on his shoulder; the curse ring flares round his eyes. */
const CurseWorld: React.FC<{ f: number }> = ({ f }) => {
  const walk = (f - C.curse) * 1.2;
  return (
    <Cam f={f} a={C.curse} b={C.lotus} cx={540} cy={1000} s0={1.05} s1={1.14} dx={-20}>
      <PalaceSet f={f} dusk blaze={0.15} wheel={{ x: 760, y: 560, w: 420 }} />
      <rect width={W} height={H} fill={S.shani} opacity={0.38} />
      <Shani f={f} id="cuShani" x={380 + walk} y={1300} s={1.1} facing={1} crow p={{ lookX: 0.6, lookY: 0.2, brow: 0.3, smile: -0.15, glow: 0.35, bob: Math.abs(Math.sin(f / 6)) * -6 }} />
      <CurseRing f={f} at={K.shraap} x={380 + walk + 50} y={1300 - 1.1 * 330} r={110} />
      <Motes f={f} x={160} y={700} w={760} h={700} n={20} color="#9AA9E8" o={0.7} seed={14} />
    </Cam>
  );
};

/** "जिसे देखें, उसका अनिष्ट हो।": his look falls on a lotus; it withers and greys. */
const LotusWorld: React.FC<{ f: number }> = ({ f }) => {
  const wilt = prog(f, K.anisht - 6, K.anisht + 22, Easing.inOut(Easing.cubic));
  return (
    <Cam f={f} a={C.lotus} b={C.lower} cx={540} cy={1100} s0={1} s1={1.1} hits={[K.anisht]} amp={6}>
      <ForestSet f={f} dusk sun={0.2} />
      <rect width={W} height={H} fill={S.shani} opacity={0.3 + 0.2 * wilt} />
      <GlanceBeam f={f} a={C.lotus + 2} b={C.lower + 4} x0={-40} y0={600} x1={600} y1={1080} />
      <g transform="translate(600 1330)">
        <WiltLotus wilt={wilt} s={2.1} />
      </g>
      <Motes f={f} x={360} y={900} w={480} h={500} n={14} color="#B9B0A0" o={wilt} seed={3} />
    </Cam>
  );
};

/** "इसलिए वो नज़रें झुकाए रहते।": close; his eyes lower, the crow settles. */
const LowerWorld: React.FC<{ f: number }> = ({ f }) => {
  const low = prog(f, C.lower + 8, C.lower + 30);
  return (
    <Cam f={f} a={C.lower} b={C.kailash} cx={520} cy={900} s0={1} s1={1.08}>
      <PalaceSet f={f} dusk blaze={0.1} wheel={{ x: 760, y: 560, w: 420 }} />
      <rect width={W} height={H} fill={S.shani} opacity={0.45} />
      <Shani f={f} id="loShani" x={470} y={1640} s={1.9} facing={1} crow p={{ head: lerp(0, 14, low), lookX: 0.4, lookY: lerp(0, 1, low), blink: 0.55 * low, brow: 0.2, smile: -0.1, glow: 0.2 }} />
    </Cam>
  );
};

/** Parvati with the newborn: the arms hold the swaddle at the chest. */
const ParvatiWithBaby: React.FC<{ f: number; id: string; x: number; y: number; s: number; head?: number; glow?: number; out?: number; speak?: number; smile?: number; lookX?: number; lookY?: number; eyes?: number; halo?: number }> = ({
  f, id, x, y, s, head = 1, glow = 0, out = 0, speak = 0, smile = 0.5, lookX = 0.2, lookY = 0.3, eyes = 1, halo = 0.4,
}) => (
  <g>
    <ParvatiStanding id={id} f={f} x={x} y={y} s={s} hands={[[-70 + 20 * out, -430 - 30 * out], [96 + 30 * out, -446 - 40 * out]]} speak={speak} smile={smile} lookX={lookX} lookY={lookY} eyes={eyes} halo={halo} />
    <g transform={`translate(${x + s * (20 + 40 * out)} ${y - s * (430 + 40 * out)})`}>
      <Swaddle f={f} s={s * 0.9} head={head} glow={glow} rot={-6} />
    </g>
  </g>
);

/** Kailash: "गणेश जन्मे, तो माँ पार्वती बोलीं," — Parvati with the newborn; Shani arrives at the edge, eyes down. */
const KailashWorld: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.kailash} b={C.parvati} cx={540} cy={1050} s0={1} s1={1.08} dx={-10}>
    <KailashSet f={f} glow={0.8} />
    <Petals f={f} n={10} seed={5} o={0.6} />
    <ParvatiWithBaby f={f} id="kaPar" x={430} y={1460} s={0.86} glow={0.35} />
    <Shani f={f} id="kaShani" x={890} y={1340} s={0.9} facing={-1} p={{ head: 12, lookY: 1, blink: 0.5, glow: 0.15 }} />
  </Cam>
);

/** Parvati, close: "शनिदेव… मेरे पुत्र को देखिए।" holding the baby out. */
const ParvatiWorld: React.FC<{ f: number }> = ({ f }) => {
  const out = prog(f, C.parvati + 20, C.parvati + 44, outCubic);
  return (
    <Cam f={f} a={C.parvati} b={C.side} cx={480} cy={820} s0={1} s1={1.08}>
      <KailashSet f={f} glow={0.9} />
      <ParvatiWithBaby f={f} id="paPar" x={470} y={2010} s={1.75} out={out} speak={talking(f, A(8), B(8), 5)} smile={0.6} lookX={0.5} lookY={0.1} glow={0.3} halo={0.5} />
    </Cam>
  );
};

/** "शनि ने कनखियों से,": Shani, close, eyes sliding to the side. */
const SideWorld: React.FC<{ f: number }> = ({ f }) => {
  const sl = prog(f, C.side + 6, C.side + 26);
  return (
    <Cam f={f} a={C.side} b={C.eye} cx={500} cy={900} s0={1.05} s1={1.15}>
      <KailashSet f={f} glow={0.4} />
      <rect width={W} height={H} fill={S.shani} opacity={0.35} />
      <Shani f={f} id="siShani" x={420} y={1660} s={2.1} facing={1} p={{ head: lerp(12, 8, sl), lookX: lerp(-0.2, 1, sl), lookY: 0.5, blink: lerp(0.5, 0.15, sl), brow: 0.4, browTilt: 6, glow: 0.3 + 0.5 * sl }} />
    </Cam>
  );
};

/** "बस एक पल देखा…": push into the eye; the glance leaves toward the baby. */
const EyeWorld: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.eye} b={C.hush} cx={480} cy={1130} s0={1.7} s1={2.3}>
    <KailashSet f={f} glow={0.3} />
    <rect width={W} height={H} fill={S.shani} opacity={0.5} />
    <Shani f={f} id="eyShani" x={420} y={1660} s={2.1} facing={1} p={{ head: 8, lookX: 1, lookY: 0.5, blink: 0.15, brow: 0.5, browTilt: 8, glow: 1 }} />
    <GlanceBeam f={f} a={K.pal - 4} b={C.hush + 4} x0={500} y0={1120} x1={1200} y1={1260} />
  </Cam>
);

/** The hush: "और बालक का सिर… धड़ से अलग हो गया।" white flash, Parvati's shock; the face is lost in light that rises away. */
const HushWorld: React.FC<{ f: number }> = ({ f }) => {
  const head = 1 - prog(f, K.sir - 2, K.alag + 16, Easing.inOut(Easing.cubic));
  const dark = prog(f, K.alag, C.vishnu, Easing.in(Easing.quad));
  return (
    <Cam f={f} a={C.hush} b={C.vishnu} cx={540} cy={1000} s0={1.12} s1={1.02} hits={[C.hush + 2, K.alag]} amp={16}>
      <KailashSet f={f} glow={0.2} />
      <rect width={W} height={H} fill="#2A2246" opacity={0.35 + 0.35 * dark} />
      <ParvatiWithBaby f={f} id="huPar" x={470} y={1500} s={0.95} head={head} glow={0.6 * (1 - head)} smile={-0.6} lookX={0.4} lookY={0.7} halo={0} />
      <Cracks f={f} at={C.hush + 1} x={560} y={900} n={13} />
    </Cam>
  );
};

/** "तब विष्णु हाथी का सिर लाए…": Vishnu descends on Garuda's wings, the chakra spinning, gold light. */
const VishnuWorld: React.FC<{ f: number }> = ({ f }) => {
  const d = prog(f, C.vishnu, C.vishnu + 24, outCubic);
  return (
    <Cam f={f} a={C.vishnu} b={C.reveal} cx={540} cy={980} s0={1} s1={1.08}>
      <KailashSet f={f} glow={0.9} />
      <circle cx={540} cy={900} r={520} fill="url(#kqGold)" opacity={0.7 * d} />
      <SunRays x={540} y={860} r={180} k={d} f={f * 2} n={30} />
      <GarudaWings f={f} x={540} y={lerp(560, 900, d)} open={d} s={1.2} />
      <Vishnu f={f} id="viVishnu" x={540} y={lerp(900, 1300, d)} s={1.12} facing={1} p={{ lookX: 0.5, lookY: 0.3, smile: 0.4, glow: 0.2 }} />
      <Motes f={f} x={200} y={500} w={680} h={900} n={26} color="#FFE08A" o={d} seed={21} />
    </Cam>
  );
};

/** "और बालक बने, गजानन।": the light in Parvati's arms; on "गजानन" it bursts and baby Ganesha is revealed. */
const RevealWorld: React.FC<{ f: number }> = ({ f }) => {
  const r = prog(f, K.gajanan - 4, K.gajanan + 10, outBack);
  return (
    <Cam f={f} a={C.reveal} b={C.court} cx={540} cy={1000} s0={1.06} s1={1} hits={[K.gajanan]} amp={8}>
      <KailashSet f={f} glow={1} />
      <SunRays x={540} y={980} r={lerp(60, 260, r)} k={0.5 + 0.5 * r} f={f * 2} n={32} />
      <ParvatiStanding id="rePar" f={f} x={540} y={1400} s={0.82} hands={[[-120, -440], [120, -440]]} smile={0.8} lookX={0} lookY={0.6} halo={0.7} glow={0.5} />
      <circle cx={540} cy={1200} r={lerp(120, 400, r)} fill="url(#kqGold)" opacity={lerp(1, 0.55, r)} />
      <g transform={`translate(540 ${1440}) scale(${0.8 * Math.max(0.01, r)})`} opacity={Math.min(1, r * 1.5)}>
        <BabyGanesha f={f} s={1} />
      </g>
      <Petals f={f} n={18} seed={7} o={r} />
    </Cam>
  );
};

/** Court of Ujjain: Vikram on his throne; nine metal seats; the camera slides to the last, iron seat. */
const CourtWorld: React.FC<{ f: number }> = ({ f }) => {
  const pan = prog(f, K.aakhiri - 30, C.iron, Easing.inOut(Easing.cubic));
  return (
    <Cam f={f} a={C.court} b={C.iron} cx={540} cy={1050} s0={1} s1={1.04} dx={-lerp(0, 0, pan)}>
      <g transform={`translate(${-lerp(0, 1080, pan)} 0)`}>
        <g transform="translate(1080 0)">
          <PalaceSet f={f} blaze={0.4} dusk />
        </g>
        <PalaceSet f={f} blaze={0.7} />
        <Vikram f={f} id="coVik" x={250} y={1250} s={1.05} facing={1} p={{ sF: lerp(20, 70, prog(f, K.vikram, K.vikram + 16)), eF: 30, wF: -20, lookX: 0.8, smile: 0.3 }} />
        <NineSeats f={f} at={C.court + 6} y={1300} x0={430} gap={160} s={0.62} ironGlow={prog(f, K.aakhiri, C.iron)} labels={prog(f, C.court + 30, C.court + 40)} />
        <g opacity={prog(f, K.aakhiri - 6, K.aakhiri + 8)}>
          <Shani f={f} id="coShani" x={430 + 8 * 160 + 110} y={1230} s={0.8} facing={-1} crow p={{ lookX: 0.5, lookY: 0.4, brow: 0.4, browTilt: 8, smile: -0.2, glow: 0.3 }} />
        </g>
      </g>
    </Cam>
  );
};

/** "लोहे का।": close on the iron seat, Shani on it, cold glow. */
const IronWorld: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.iron} b={C.shaniSpeak} cx={540} cy={1100} s0={1.2} s1={1.3} hits={[K.lohe + 2]} amp={8}>
    <PalaceSet f={f} blaze={0.2} dusk />
    <rect width={W} height={H} fill={S.shani} opacity={0.3} />
    <g transform="translate(360 1330)">
      <Seat c="#5A5E6A" d="#24262E" s={1.25} glow={0.9} />
    </g>
    <Shani f={f} id="irShani" x={700} y={1250} s={1.0} facing={-1} crow p={{ lookX: 0.6, lookY: 0.2, brow: 0.5, browTilt: 10, smile: -0.3, glow: 0.5 }} />
  </Cam>
);

/** "राजन… समय आने पर जानोगे।": Shani rises, close, calm and cold. */
const ShaniSpeakWorld: React.FC<{ f: number }> = ({ f }) => {
  const rise = prog(f, C.shaniSpeak, C.shaniSpeak + 20, outCubic);
  return (
    <Cam f={f} a={C.shaniSpeak} b={C.sadeSati} cx={540} cy={860} s0={1} s1={1.1}>
      <PalaceSet f={f} blaze={0.1} dusk />
      <rect width={W} height={H} fill={S.shani} opacity={0.5} />
      <SaturnHalo f={f} at={C.shaniSpeak + 4} x={620} y={640} r={150} />
      <Shani f={f} id="ssShani" x={600} y={lerp(1800, 1680, rise)} s={2.0} facing={-1} crow p={{ lookX: 0.8, lookY: 0.1, brow: 0.5, browTilt: 10, smile: -0.2, glow: 0.6, talk: talking(f, A(18), B(18), 19) }} />
    </Cam>
  );
};

/** "साढ़े साती आई…": night sky, Saturn sweeps across; the stamp is drawn in HTML. */
const SadeSatiWorld: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.sadeSati} b={C.kalank} cx={540} cy={960} s0={1.1} s1={1} hits={[K.saadhe + 2]} amp={12}>
    <rect width={W} height={H} fill="url(#kqNight)" />
    <Motes f={f} x={0} y={200} w={1080} h={1500} n={40} color="#C9D3FF" o={0.7} seed={41} />
    <g transform={`translate(${lerp(-200, 1280, prog(f, C.sadeSati, C.kalank + 10, Easing.linear))} 640) rotate(-14)`}>
      <circle r={130} fill="url(#kqSaturn)" />
      <ellipse rx={260} ry={52} fill="none" stroke="#E8B04A" strokeWidth={14} opacity={0.8} />
    </g>
    <Vikram f={f} id="saVik" x={540} y={1400} s={0.75} facing={1} p={{ head: 10, lookY: 0.6, smile: -0.4, brow: 0.3, browTilt: -10 }} drain={0.4} />
  </Cam>
);

/** "चोरी का कलंक लगा,": the necklace and the guards' spears; Vikram recoils. */
const KalankWorld: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.kalank} b={C.crown} cx={540} cy={1000} s0={1} s1={1.08} hits={[K.kalankW + 4]} amp={14}>
    <PalaceSet f={f} dusk blaze={0.1} />
    <rect width={W} height={H} fill="#5A1420" opacity={0.35} />
    <Vikram f={f} id="kaVik" x={320} y={1300} s={1.05} facing={1} p={{ lean: -8, sF: 70, eF: 60, lookX: 0.9, brow: 0.6, browTilt: -14, smile: -0.6 }} drain={0.3} />
    <Kalank f={f} at={K.kalankW - 8} x={740} y={900} />
  </Cam>
);

/** "राज-पाट छिन गया।": dusk forest; the crown falls from his head and cracks; he sinks to his knees. */
const CrownWorld: React.FC<{ f: number }> = ({ f }) => {
  const fall = prog(f, C.crown + 4, K.chhin + 6, Easing.in(Easing.quad));
  const crack = prog(f, K.chhin + 6, K.chhin + 16);
  return (
    <Cam f={f} a={C.crown} b={C.arrive} cx={540} cy={1100} s0={1.04} s1={1.12} hits={[K.chhin + 6]} amp={16}>
      <ForestSet f={f} dusk sun={0.05} />
      <rect width={W} height={H} fill="#2A2246" opacity={0.45} />
      <Vikram bare f={f} id="crVik" x={420} y={lerp(1300, 1420, fall)} s={1.05} facing={1} p={{ lean: lerp(0, 18, fall), head: lerp(0, 16, fall), lookY: 0.8, smile: -0.5, brow: 0.3, browTilt: -12 }} drain={0.6} />
      <g transform={`translate(${lerp(430, 700, fall)} ${lerp(860, 1430, fall)}) rotate(${lerp(0, 120, fall)})`}>
        <LooseCrown crack={crack} />
      </g>
    </Cam>
  );
};

/** "अंत में शनि ख़ुद आए,": Shani descends in cold light with his crow flying, before the kneeling king. */
const ArriveWorld: React.FC<{ f: number }> = ({ f }) => {
  const d = prog(f, C.arrive, K.khud + 10, outCubic);
  return (
    <Cam f={f} a={C.arrive} b={C.restore} cx={540} cy={1050} s0={1} s1={1.06}>
      <ForestSet f={f} dusk sun={0.1} />
      <rect width={W} height={H} fill="#2A2246" opacity={0.4 * (1 - 0.5 * d)} />
      <circle cx={760} cy={900} r={lerp(100, 520, d)} fill="url(#kqCool)" opacity={0.8 * d} />
      <Crow f={f} x={lerp(1100, 860, d)} y={lerp(500, 620, d)} s={0.9} facing={-1} flap={1} />
      <Shani f={f} id="arShani" x={760} y={lerp(1000, 1300, d)} s={1.05} facing={-1} p={{ lookX: 0.6, lookY: 0.5, smile: 0.15, glow: 0.3 }} />
      <Vikram bare f={f} id="arVik" x={300} y={1420} s={1.0} facing={1} p={{ lean: 16, head: 10, lookX: 0.6, lookY: 0.2, smile: -0.2 }} drain={0.5 * (1 - d)} />
    </Cam>
  );
};

/** "सब लौटा दिया।": the crown rises back to his head in gold light; colour returns. */
const RestoreWorld: React.FC<{ f: number }> = ({ f }) => {
  const r = prog(f, C.restore, K.lauta + 14, Easing.inOut(Easing.cubic));
  return (
    <Cam f={f} a={C.restore} b={C.ask} cx={540} cy={1000} s0={1.02} s1={1.1} hits={[K.lauta + 12]} amp={6}>
      <PalaceSet f={f} blaze={0.4 + 0.6 * r} />
      <SunRays x={420} y={760} r={lerp(0, 200, r)} k={r} f={f * 2} n={28} />
      <Vikram bare={r < 0.96} f={f} id="reVik" x={420} y={1300} s={1.1} facing={1} p={{ lean: lerp(10, 0, r), head: lerp(10, 0, r), lookX: 0.7, smile: lerp(0, 0.5, r), glow: 0.1 }} drain={0.5 * (1 - r)} />
      {r < 0.98 ? (
        <g transform={`translate(${lerp(700, 420 + 15, r)} ${lerp(1430, 1300 - 1.1 * 395, r)}) rotate(${lerp(120, 0, r)}) scale(${lerp(1, 0.6, r)})`} opacity={1 - prog(f, K.lauta + 8, K.lauta + 14)}>
          <LooseCrown glow={r} />
        </g>
      ) : null}
      <Motes f={f} x={200} y={600} w={600} h={800} n={20} color="#FFE08A" o={r} seed={33} />
    </Cam>
  );
};

/** "राजा ने बस इतना माँगा,": Vikram joins his hands before Shani. */
const AskWorld: React.FC<{ f: number }> = ({ f }) => {
  const j = prog(f, C.ask, C.ask + 16, outCubic);
  return (
    <Cam f={f} a={C.ask} b={C.vikramSpeak} cx={540} cy={1050} s0={1} s1={1.06} dx={10}>
      <PalaceSet f={f} blaze={0.6} />
      <Vikram f={f} id="asVik" x={330} y={1300} s={1.05} facing={1} p={{ ...{ sF: lerp(10, NAMASTE.sF!, j), eF: lerp(14, NAMASTE.eF!, j), wF: NAMASTE.wF! * j, sB: lerp(-6, NAMASTE.sB!, j), eB: lerp(10, NAMASTE.eB!, j), wB: NAMASTE.wB! * j }, lean: 6, head: 6, lookX: 0.8, smile: 0.1 }} />
      <Shani f={f} id="asShani" x={780} y={1300} s={1.05} facing={-1} crow p={{ lookX: 0.6, lookY: 0.3, smile: 0.25, glow: 0.2 }} />
    </Cam>
  );
};

/** Vikram, close: "ऐसा दुख… किसी और को मत दीजिए।" hands joined, a tear catching the light. */
const VikramSpeakWorld: React.FC<{ f: number }> = ({ f }) => {
  const tear = prog(f, A(25) + 30, A(25) + 60);
  return (
    <Cam f={f} a={C.vikramSpeak} b={C.danda} cx={520} cy={880} s0={1} s1={1.1}>
      <PalaceSet f={f} blaze={0.5} />
      <rect width={W} height={H} fill="#FFE6A8" opacity={0.12} />
      <Vikram f={f} id="vsVik" x={450} y={1700} s={2.0} facing={1} p={{ ...NAMASTE, lean: 4, head: 4, lookX: 0.8, lookY: -0.1, brow: 0.4, browTilt: -12, smile: -0.1, talk: talking(f, A(25), B(25), 23) }} />
      {tear > 0 ? <ellipse cx={590} cy={lerp(920, 980, tear)} rx={6} ry={9} fill="#E4F2FF" opacity={0.85 * Math.sin(Math.PI * tear)} /> : null}
    </Cam>
  );
};

/** "क्योंकि शनि दंड नहीं…": Shani's calm face, a faint smile, soft light. */
const DandaWorld: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.danda} b={C.hisaab} cx={520} cy={900} s0={1.04} s1={1.12}>
    <rect width={W} height={H} fill="url(#n2Cosmos)" />
    <SaturnHalo f={f} at={C.danda + 2} x={560} y={660} r={170} />
    <Motes f={f} x={0} y={300} w={1080} h={1300} n={30} color="#E4EAFF" o={0.7} seed={23} />
    <Shani f={f} id="daShani" x={470} y={1660} s={2.0} facing={1} p={{ lookX: 0.5, lookY: 0, smile: 0.35, glow: 0.35, brow: 0.1 }} />
  </Cam>
);

/** "कर्मों का हिसाब देते हैं।": the scales of karma swing into balance. */
const HisaabWorld: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.hisaab} b={C.feature} cx={540} cy={960} s0={1.08} s1={1}>
    <rect width={W} height={H} fill="url(#n2Cosmos)" />
    <Motes f={f} x={0} y={300} w={1080} h={1300} n={40} color="#E4EAFF" o={0.8} seed={29} />
    <SaturnHalo f={f} at={C.hisaab + 2} x={540} y={900} r={260} />
    <Scales f={f} at={K.hisaab} x={540} y={840} s={1.1} />
  </Cam>
);

const FeatureWorld: React.FC<{ f: number }> = ({ f }) => {
  const ph = prog(f, C.phone - 2, C.phone + 12, Easing.inOut(Easing.cubic));
  const phoneIn = prog(f, C.phone, C.phone + 14, outBack);
  const hops = [
    { at: C.feature + 14, house: 6 },
    { at: C.feature + 30, house: 7 },
    { at: C.feature + 46, house: 8 },
  ];
  return (
    <Cam f={f} a={C.feature} b={C.end} cx={540} cy={1000} s0={1} s1={1.04}>
      <rect width={W} height={H} fill="url(#nvSkyPalace)" />
      <circle cx={540} cy={1000} r={620} fill="url(#nvWarm)" />
      <g transform={`translate(${lerp(190, 40, ph)} ${lerp(660, 760, ph)}) scale(${lerp(1, 0.72, ph)})`}>
        <ShaniKundali f={f} at={C.feature} x={0} y={0} size={700} hops={hops} />
      </g>
      <g transform={`translate(${lerp(1120, 560, phoneIn)} 720)`} opacity={Math.min(1, phoneIn * 2)}>
        <SvgImage file="jyotiq/site/s1.png" x={0} y={0} width={480} height={480 * (1360 / 1157)} />
      </g>
    </Cam>
  );
};

const EndWorld: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.end} b={TOTAL} cx={540} cy={900} s0={1} s1={1.06}>
    <rect width={W} height={H} fill="url(#nvSkyPalace)" />
    <SunRays x={540} y={655} r={140 + 12 * Math.sin(f / 7)} k={0.7} f={f * 2.5} n={28} />
    <circle cx={540} cy={760} r={480} fill="url(#nvWarm)" />
    <SvgImage file="jyotiq/site/hero-left-image.png" x={-130} y={1500} width={470} height={470 * (1216 / 1294)} opacity={0.7} />
    <SvgImage file="jyotiq/site/hero-right-image.png" x={760} y={1520} width={400} height={400 * (1293 / 1216)} opacity={0.7} />
    <Petals f={f} n={12} seed={31} o={0.8} />
  </Cam>
);

/* ================================================================== */
/* HTML layers                                                         */
/* ================================================================== */

/** After the bloom: the series stamp "क्या होता अगर…", the episode pill and the open-loop chip. */
const TitleText: React.FC<{ f: number }> = ({ f }) => {
  const a = INTRO[1].a - 4;
  const stamp = prog(f, a, a + 8, outBack);
  const out = 1 - prog(f, C.curse - 6, C.curse);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: out }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1110, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <div
          style={{
            padding: "6px 44px 18px",
            borderRadius: 40,
            background: "rgba(255,248,238,0.93)",
            border: `3px solid ${S.goldLight}`,
            boxShadow: "0 16px 36px rgba(58,31,18,0.25)",
            transform: `scale(${1.5 - 0.5 * stamp})`,
            opacity: Math.min(1, stamp * 2),
          }}
        >
          <TwoTone parts={[p("क्या होता "), p("अगर…", true)]} size={128} />
        </div>
        <div style={{ opacity: prog(f, a + 10, a + 18), transform: `translateY(${(1 - prog(f, a + 10, a + 20, outBack)) * 40}px)` }}>
          <div style={{ padding: "12px 34px", borderRadius: 40, background: S.shani, color: "#E4EAFF", border: `3px solid ${S.gold}`, fontFamily: MUKTA, fontWeight: 800, fontSize: 52, boxShadow: "0 10px 24px rgba(46,58,102,0.4)" }}>
            शनि की टेढ़ी नज़र
          </div>
        </div>
        <div style={{ opacity: prog(f, a + 18, a + 26), padding: "8px 26px", borderRadius: 30, background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 36 }}>
          2 कथाएँ · 1 सच
        </div>
      </div>
    </div>
  );
};

/** Chapter chip (कथा 1/2, कथा 2/2) under the brand row: keeps the viewer counting. */
const Chapter: React.FC<{ f: number; a: number; b: number; n: string; t: string }> = ({ f, a, b, n, t }) => (
  <Pop f={f} at={a} out={b} from="up">
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 26px 12px", borderRadius: 40, background: "rgba(255,248,238,0.95)", border: `2.5px solid ${S.gold}`, boxShadow: "0 8px 20px rgba(58,31,18,0.22)" }}>
        <span style={{ padding: "2px 14px", borderRadius: 20, background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 32 }}>{n}</span>
        <span style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: 36, color: S.brown }}>{t}</span>
      </div>
    </div>
  </Pop>
);

/** "साढ़े साती" stamp with "7½ वर्ष". */
const SadeSatiText: React.FC<{ f: number }> = ({ f }) => {
  const k = prog(f, K.saadhe - 2, K.saadhe + 8, outBack);
  const out = 1 - prog(f, C.kalank - 6, C.kalank);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 820, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: Math.min(1, k * 2) * out, transform: `scale(${1.6 - 0.6 * k})` }}>
      <div style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: 140, color: "#E4EAFF", textShadow: "0 0 40px rgba(143,168,255,0.8), 0 8px 0 #1C2350", letterSpacing: -1 }}>साढ़े साती</div>
      <div style={{ padding: "8px 28px", borderRadius: 30, background: "rgba(14,11,32,0.75)", border: `2px solid ${S.gold}`, color: S.goldLight, fontFamily: MUKTA, fontWeight: 800, fontSize: 42 }}>7½ वर्ष</div>
    </div>
  );
};

const FeatureText: React.FC<{ f: number }> = ({ f }) => {
  const hOut = 1 - prog(f, C.phone - 4, C.phone + 2);
  return (
    <>
      <Pop f={f} at={C.feature + 2} out={C.phone - 4} from="up">
        <div style={{ position: "absolute", left: 50, right: 50, top: 512, display: "flex", justifyContent: "center", opacity: hOut }}>
          <div style={{ padding: "12px 30px 18px", borderRadius: 32, background: "rgba(255,248,238,0.92)", border: `3px solid ${S.goldLight}`, boxShadow: "0 14px 30px rgba(58,31,18,0.2)", textAlign: "center" }}>
            <TwoTone parts={[p("शनि अभी आपकी कुंडली में "), p("कहाँ हैं?", true)]} size={58} />
          </div>
        </div>
      </Pop>
      <Pop f={f} at={C.phone + 8} from="up">
        <Pill text="गोचर देखिए · ज्योतिक़ ऐप" y={1352} center size={46} />
      </Pop>
      <PanelPulse f={f} a={C.phone} b={C.end + 2} />
      <PanelArrow f={f} a={C.phone + 4} b={C.end} x0={560} y0={600} label="ऐप यहाँ से डाउनलोड करें" />
    </>
  );
};

const EndChip: React.FC<{ t: string; on?: boolean }> = ({ t, on }) => (
  <div style={{ padding: "10px 24px", borderRadius: 30, background: on ? GRAD : "#FFFFFF", border: `2.5px solid ${S.goldLight}`, fontFamily: MUKTA, fontWeight: 700, fontSize: 34, color: on ? "#FFFFFF" : S.brown, boxShadow: "0 6px 14px rgba(58,31,18,0.12)" }}>
    {t}
  </div>
);

const EndText: React.FC<{ f: number }> = ({ f }) => {
  const e = C.end;
  const st = (i: number): React.CSSProperties => {
    const k = prog(f, e + 2 + i * 3, e + 11 + i * 3, outBack);
    return { opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - k) * 40}px) scale(${0.85 + 0.15 * k})` };
  };
  const arrow = Math.sin(f / 4) * 8;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 500, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
      <div
        style={{
          ...st(0),
          width: 280,
          height: 280,
          borderRadius: 140,
          background: "radial-gradient(circle at 50% 40%, #2A1830 0%, #120C16 75%)",
          border: `4px solid ${S.gold}`,
          boxShadow: `0 16px 40px rgba(58,31,18,0.35), 0 0 ${40 + 14 * Math.sin(f / 6)}px rgba(255,214,140,0.45)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Img src={staticFile("jyotiq/logo-full.png")} style={{ width: 186, height: 216, objectFit: "contain" }} />
      </div>
      <div style={st(1)}>
        <TwoTone parts={[p("ज्योतिक़ "), p("डाउनलोड कीजिए", true)]} size={76} />
      </div>
      <div style={{ ...st(2), display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, maxWidth: 940 }}>
        {["गोचर", "फ़्री कुंडली", "दशा", "पंचांग", "होरा"].map((t, i) => (
          <EndChip key={t} t={t} on={i === 0} />
        ))}
      </div>
      <div style={{ ...st(3), display: "flex", gap: 18, marginTop: -6, marginBottom: -6 }}>
        <div style={{ display: "flex", gap: 18, transform: "scale(0.9)" }}>
          <PlayButton glow={0.4 + 0.3 * Math.sin(f / 5)} />
          <AppStoreButton glow={0.4 + 0.3 * Math.sin(f / 5 + 1)} />
        </div>
      </div>
      <div style={{ ...st(4), fontFamily: MUKTA, fontWeight: 800, fontSize: 44, ...gradText }}>
        ऐप का लिंक बायो में <span style={{ display: "inline-block", color: S.red, WebkitTextFillColor: S.red, transform: `translateY(${-Math.abs(arrow)}px)` }}>↑</span> · www.jyotiq.ai
      </div>
      <div style={{ ...st(5), padding: "14px 32px", borderRadius: 28, background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 40, boxShadow: "0 10px 24px rgba(224,72,43,0.35)" }}>
        कमेंट में लिखें: ॐ शं शनैश्चराय नमः
      </div>
      <div style={{ ...st(6), padding: "12px 30px", borderRadius: 40, background: S.brown, color: S.goldLight, border: `2px solid ${S.gold}`, fontFamily: MUKTA, fontWeight: 800, fontSize: 36 }}>
        अगला: क्या होता अगर ग्रह ही न होते? ▸
      </div>
      <div style={{ ...st(7), fontFamily: JAKARTA, fontWeight: 600, fontSize: 24, color: S.brownMid, opacity: 0.85 }}>Guidance only, for entertainment and information.</div>
    </div>
  );
};

/* ================================================================== */
/* Composition                                                         */
/* ================================================================== */

type Shot = { a: number; b: number; World: React.FC<{ f: number }> };
const SHOTS: Shot[] = [
  { a: 0, b: C.hookB, World: HookA },
  { a: C.hookB, b: C.hookC, World: HookB },
  { a: C.hookC, b: C.open + 8, World: HookC },
  { a: C.open + 8, b: C.curse, World: TitleWorld },
  { a: C.curse, b: C.lotus, World: CurseWorld },
  { a: C.lotus, b: C.lower, World: LotusWorld },
  { a: C.lower, b: C.kailash, World: LowerWorld },
  { a: C.kailash, b: C.parvati, World: KailashWorld },
  { a: C.parvati, b: C.side, World: ParvatiWorld },
  { a: C.side, b: C.eye, World: SideWorld },
  { a: C.eye, b: C.hush, World: EyeWorld },
  { a: C.hush, b: C.vishnu, World: HushWorld },
  { a: C.vishnu, b: C.reveal, World: VishnuWorld },
  { a: C.reveal, b: C.court, World: RevealWorld },
  { a: C.court, b: C.iron, World: CourtWorld },
  { a: C.iron, b: C.shaniSpeak, World: IronWorld },
  { a: C.shaniSpeak, b: C.sadeSati, World: ShaniSpeakWorld },
  { a: C.sadeSati, b: C.kalank, World: SadeSatiWorld },
  { a: C.kalank, b: C.crown, World: KalankWorld },
  { a: C.crown, b: C.arrive, World: CrownWorld },
  { a: C.arrive, b: C.restore, World: ArriveWorld },
  { a: C.restore, b: C.ask, World: RestoreWorld },
  { a: C.ask, b: C.vikramSpeak, World: AskWorld },
  { a: C.vikramSpeak, b: C.danda, World: VikramSpeakWorld },
  { a: C.danda, b: C.hisaab, World: DandaWorld },
  { a: C.hisaab, b: C.feature, World: HisaabWorld },
  { a: C.feature, b: C.end, World: FeatureWorld },
  { a: C.end, b: TOTAL, World: EndWorld },
];
const XFADE: Record<number, number> = { [C.kailash]: 8, [C.vishnu]: 10, [C.court]: 8, [C.arrive]: 10, [C.danda]: 8, [C.end]: 8 };

export const KyaHotaEp2: React.FC = () => {
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
  const of = openF(f);
  const brand = f < C.open ? 0 : f < C.curse ? nvOpenBug(of) : 1;
  const hookOut = 1 - prog(f, B(2) - 2, B(2) + 6);
  return (
    <AbsoluteFill style={{ background: "#1A0B1E", overflow: "hidden" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <RigDefs />
        <SetDefs />
        <NvDefs />
        <N2Defs />
        <KQDefs />
        {layers}
        {/* the lens crack when Shani's glance hits the viewer (over the starter's first frames) */}
        <Cracks f={f} at={B(2) - 3} x={540} y={900} n={16} />
      </svg>

      {f >= C.open && of <= 110 ? <NvOpen f={of} /> : null}

      {f < B(2) + 8 ? (
        <>
          <Presents y={168} o={hookOut} />
          <div style={{ position: "absolute", inset: 0, opacity: hookOut, transform: `scale(${1 + 0.015 * Math.sin(f / 10)})`, transformOrigin: "50% 70%" }}>
            <HookPlate y={1250} size={64} lines={[[p("क्या होता अगर "), p("शनि देव की", true)], [p("टेढ़ी नज़र… ", true), p("आप पर पड़ जाए?")]]} chip="2 कथाएँ · 1 सच · अंत तक देखिए" />
          </div>
        </>
      ) : null}

      {f >= C.open && f < C.curse ? <TitleText f={f} /> : null}

      <Chapter f={f} a={C.curse + 4} b={C.court - 8} n="कथा 1/2" t="बालक गणेश" />
      <Chapter f={f} a={C.court + 4} b={C.danda - 8} n="कथा 2/2" t="राजा विक्रमादित्य" />

      <NameChipIn f={f} at={C.curse + 10} out={C.lotus - 4} hi="शनि" en="SHANI" tag="सूर्य-छाया पुत्र · कर्मफलदाता" y={400} icon="◍" />
      <NameChipIn f={f} at={K.parvatiW} out={C.parvati + 30} hi="पार्वती" en="PARVATI" tag="महादेव की अर्धांगिनी · गणेश की माँ" y={400} icon="✿" />
      <NameChipIn f={f} at={K.vishnuW + 2} out={C.reveal - 4} hi="विष्णु" en="VISHNU" tag="गरुड़ पर · सुदर्शन चक्रधारी" y={400} icon="☸" />
      <NameChipIn f={f} at={K.gajanan + 4} out={C.court - 6} hi="गजानन" en="GANESHA" tag="ब्रह्मवैवर्त पुराण की कथा" y={400} icon="ॐ" />
      <NameChipIn f={f} at={K.vikram + 2} out={K.aakhiri - 10} hi="विक्रमादित्य" en="VIKRAMADITYA" tag="उज्जैन के राजा" y={400} icon="♛" />

      {f >= C.sadeSati && f < C.kalank + 2 ? <SadeSatiText f={f} /> : null}
      {f >= C.feature && f < C.end + 8 ? <FeatureText f={f} /> : null}
      {f >= C.end ? (
        <div style={{ position: "absolute", inset: 0, opacity: prog(f, C.end, C.end + 8), transform: `scale(${1 + 0.035 * prog(f, C.end, TOTAL, Easing.inOut(Easing.sin))})`, transformOrigin: "50% 45%" }}>
          <EndText f={f} />
        </div>
      ) : null}

      {f >= C.curse - 4 ? <KCaptionQ f={f} hide={[0, 1, 2]} /> : null}

      <Flash f={f} at={K.najar} color="#C9D3FF" peak={0.45} fall={10} />
      <Flash f={f} at={B(2) - 3} color="#FFFFFF" peak={0.95} rise={3} fall={12} />
      <Flash f={f} at={C.curse} color="#E4EAFF" peak={0.5} fall={8} />
      <Flash f={f} at={K.shraap} color="#B99BFF" peak={0.35} fall={12} />
      <Flash f={f} at={C.hush} color="#FFFFFF" peak={1} rise={3} fall={16} />
      <Flash f={f} at={K.gajanan} color="#FFF3C9" peak={0.9} rise={4} fall={14} />
      <Flash f={f} at={C.court} peak={0.6} fall={8} />
      <Flash f={f} at={K.lohe} color="#C9D3FF" peak={0.35} fall={10} />
      <Flash f={f} at={K.saadhe} color="#0E0B20" peak={0.7} rise={3} fall={10} />
      <Flash f={f} at={K.chhin + 6} color="#FFFFFF" peak={0.4} fall={10} />
      <Flash f={f} at={K.lauta + 12} color="#FFE9C4" peak={0.6} fall={14} />
      <Flash f={f} at={K.hisaab} color="#FFE9C4" peak={0.4} fall={14} />
      <Flash f={f} at={C.feature} peak={0.8} fall={8} />

      <Chrome f={f} brand={brand} />
    </AbsoluteFill>
  );
};

export { inCubic };
