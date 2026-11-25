import React from "react";
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from "remotion";
import { AppStoreButton, PlayButton } from "../katha/reelKit";
import { Puppet, RigDefs, blinkAt, idle, pose, type Pose } from "../manthan/rig";
import { SetDefs } from "../manthan/sets";
import { Cam, Flash, Motes, NameChipIn, PanelArrow, PanelPulse, Petals, Pop, inCubic, lerp, outBack, outCubic, prog } from "../navagraha/ep1/anim";
import { CAP_BOTTOM, CAP_TOP, Chrome, GRAD, HookPlate, JAKARTA, MUKTA, Part, Presents, S, TwoTone, gradText } from "../navagraha/ep1/look";
import { NvOpen } from "../navagraha/ep1/open";
import { NvDefs, PalaceSet, SunRays, SvgImage } from "../navagraha/ep1/world";
import { Baby, Cat, KASHYAP, MALINI, PRIYAVRAT, SHASHTHI } from "./cast";
import { Devi } from "./devi";
import { BEATS, ENV, PHRASES, TOTAL, WORDS } from "./timing";
import { CharuBowl, ChDefs, Cradle, DawnGhatSet, GhatNightSet, HavanKund, Kosi, SkyCrack, Smoke, Vimana, Vratin } from "./world";

/*
 * छठी मैया की कथा: one Manthan-style reel (TOTAL frames, 30 fps, 1080x1920) on the Navagraha site-look kit.
 * Clock: timing.ts (chhathi-maiya/tools/vo_prep.py): Kaal narrates, Priyavrat / Malini / Shashthi speak in their
 * designed voices (lip-sync from ENV). Order: cold open (cremation ghat, the king's line, the sky cracks) -> Jyotiq
 * brand open + "ज्योतिक़ प्रस्तुत करता है… छठी मैया की कथा" -> the story -> present-day Chhath ghat -> पंचांग -> end card.
 * Audio is muxed after the render (public/jyotiq/chhath/mix.wav).
 */
export const CHHATH_TOTAL = TOTAL;
const W = 1080;
const H = 1920;
const P = PHRASES;
const A = (i: number) => P[i].a;
const B = (i: number) => P[i].b;
const cue = (p: number, w: string) => (WORDS.find((x) => x.p === p && x.w.startsWith(w)) ?? WORDS.find((x) => x.p === p)!).a;
const p = (t: string, hi = false): Part => ({ t, hi });

const C = {
  close: A(3) - 3,
  pv: A(6) - 3,
  sky: A(7) - 3,
  title: BEATS.crack[0],
  palace: A(12) - 3,
  yagya: A(16) - 2,
  birth: A(17) - 2,
  still: A(19) - 2,
  malini: A(21) - 2,
  walk: A(22) - 2,
  descent: A(25) - 2,
  devi: A(28) - 2,
  touch: A(29) - 2,
  command: A(31) - 2,
  reveal: A(32) - 3,
  mothers: A(36) - 2,
  feature: A(38) - 2,
  end: B(40) + 4,
};
const K = {
  aakash: A(8),
  phat: A(9),
  yajna: cue(16, "यज्ञ"),
  bani: A(18),
  roya: A(20),
  thaan: cue(24, "ठान"),
  jagmaga: cue(25, "जगमगा"),
  vimana: A(26),
  touch: BEATS.touch[0],
  cry: A(30),
  chhath: cue(33, "छठ"),
  maiya: A(35),
};
const OPEN0 = A(10) - 34; // NvOpen local frame 0 (ignite lands just before "ज्योतिक़")

/** Mouth openness for a speaker at frame f (their own lines only). */
const talk = (f: number, who: string) => {
  const ph = P.find((x) => f >= x.a - 1 && f <= x.b + 1);
  return ph && ph.who === who ? Math.min(1, (ENV[f] ?? 0) * 1.2) : 0;
};

type PuppetArgs = { f: number; id: string; x: number; y: number; s: number; facing?: number; p?: Partial<Pose>; prop?: React.ReactNode; backProp?: React.ReactNode };
const King: React.FC<PuppetArgs> = ({ f, id, x, y, s, facing = 1, p: o = {}, prop, backProp }) => (
  <Puppet id={id} who={PRIYAVRAT} at={{ x, y, s, facing }} p={pose({ ...idle(id, f), blink: blinkAt(id, f), ...o })} t={f} prop={prop} backProp={backProp} />
);
const Sage: React.FC<PuppetArgs> = ({ f, id, x, y, s, facing = 1, p: o = {}, prop }) => (
  <Puppet id={id} who={KASHYAP} at={{ x, y, s, facing }} p={pose({ ...idle(id, f, 0.6), blink: blinkAt(id, f), ...o })} t={f} prop={prop} />
);

/** The king cradling the baby in his front arm (the bundle is the hand's prop, kept upright). */
const cradlePose = (o: Partial<Pose> = {}): Partial<Pose> => ({ sF: 52, eF: 82, wF: -6, sB: 34, eB: 70, ...o });
const KingBaby: React.FC<PuppetArgs & { life?: number; cry?: number; glow?: number }> = ({ life = 0, cry = 0, glow = 0, p: o = {}, ...r }) => (
  <King {...r} p={cradlePose(o)} prop={<g transform="translate(-30 -10)"><Baby f={r.f} s={0.95} life={life} cry={cry} glow={glow} rot={-8} /></g>} />
);

const Grey: React.FC<{ k: number }> = ({ k }) => (k > 0.01 ? <rect width={W} height={H} fill="#808080" opacity={k} style={{ mixBlendMode: "saturation" }} /> : null);

/* ================================================================== */
/* Scenes                                                              */
/* ================================================================== */

/** Cold open: midnight at the cremation ghat. The king stands by the unlit pyre, the still newborn at his chest. */
const HookWorld: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={0} b={C.close} cx={600} cy={1150} s0={1.0} s1={1.12}>
    <GhatNightSet f={f} moonX={250} />
    <KingBaby f={f} id="hKing" x={430} y={1370} s={1.05} facing={1} p={{ lean: 6, head: 16, lookX: 0.4, lookY: 0.7, brow: 0.3, browTilt: -14, smile: -0.6 }} />
    <Smoke f={f} x={200} y={1500} n={5} o={0.25} c="#6A5A7A" w={1.4} />
  </Cam>
);

/** Close: the newborn's still face against the king's chest, ember light flickering. */
const CloseWorld: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.close} b={C.pv} cx={470} cy={1000} s0={1.0} s1={1.14} dy={-20}>
    <GhatNightSet f={f} moonX={-200} />
    <rect width={W} height={H} fill="#FF7A22" opacity={0.06 + 0.04 * Math.sin(f / 5)} />
    <KingBaby f={f} id="cKing" x={420} y={1880} s={2.3} facing={1} p={{ lean: 8, head: 18, lookX: 0.5, lookY: 0.8, brow: 0.4, browTilt: -16, smile: -0.7 }} />
  </Cam>
);

/** "इसके बिना… मैं भी नहीं जिऊँगा!": the king's face, tear-lit, in his own voice. */
const PvWorld: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.pv} b={C.sky} cx={520} cy={900} s0={1.0} s1={1.12} hits={[A(6) + 30]} amp={6}>
    <GhatNightSet f={f} moonX={900} />
    <rect width={W} height={H} fill="#1A0E2A" opacity={0.25} />
    <King f={f} id="pvKing" x={560} y={1800} s={2.7} facing={-1} p={cradlePose({ lean: 2, head: -4, lookX: 0.3, lookY: -0.2, brow: 0.7, browTilt: -22, smile: -0.8, talk: talk(f, "priyavrat") })} />
    <Tears f={f} x={438} y={1014} s={2.7} dx={84} />
  </Cam>
);

/** Tear streaks for the rig face (placed by eye position in the shot). */
const Tears: React.FC<{ f: number; x: number; y: number; s: number; dx: number }> = ({ f, x, y, s, dx }) => (
  <g opacity={0.85}>
    {[0, 1].map((i) => {
      const run = ((f * 1.4 + i * 23) % 50) / 50;
      return (
        <g key={i} transform={`translate(${x + i * dx} ${y})`}>
          <path d={`M0 0C2 ${12 * s} 3 ${24 * s} 4 ${34 * s}`} stroke="#DFF3FF" strokeWidth={2.4 * s * 0.5} fill="none" strokeLinecap="round" opacity={0.6} />
          <ellipse cx={1 + 3 * run} cy={run * 34 * s} rx={2.4 * s * 0.5} ry={3.4 * s * 0.5} fill="#EAF8FF" opacity={1 - run * 0.5} />
        </g>
      );
    })}
  </g>
);

/** "और तभी… आकाश फट पड़ा।": wide night sky; the rift tears open on "आकाश" and bursts on "फट". */
const SkyWorld: React.FC<{ f: number }> = ({ f }) => {
  const k = Math.max(prog(f, K.aakash - 2, K.phat, inCubic) * 0.45, prog(f, K.phat, K.phat + 10, outCubic));
  return (
    <Cam f={f} a={C.sky} b={C.title + 8} cx={540} cy={900} s0={1.15} s1={1.0} hits={[K.phat]} amp={22}>
      <GhatNightSet f={f} moonX={180} crack={k} />
      <SkyCrack f={f} k={k} x={560} y={560} />
      <g transform="translate(0 0)" opacity={1}>
        <King f={f} id="skKing" x={330} y={1560} s={0.8} facing={1} p={cradlePose({ lean: -10, head: -14, lookX: 0.6, lookY: -1, brow: 1, browTilt: -4, smile: -0.2 })} prop={<g transform="translate(-30 -10)"><Baby f={f} s={0.95} life={0} rot={-8} /></g>} />
      </g>
    </Cam>
  );
};

/** Title: under the Jyotiq brand open, a golden sunrise wheel; after the bloom the title lockup. */
const TitleWorld: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={W} height={H} fill="url(#nvSkyPalace)" />
    <circle cx={540} cy={860} r={600} fill="url(#nvWarm)" />
    <g transform={`translate(540 760) rotate(${(f - C.title) * 0.3}) translate(-540 -760)`}>
      <SunRays x={540} y={760} r={170} k={0.9} f={f} n={36} />
    </g>
    <circle cx={540} cy={760} r={150} fill="url(#chSun)" />
    <Petals f={f} n={10} seed={3} o={0.6} />
  </g>
);

/** The palace: an empty cradle rocking by itself between the king and queen. */
const PalaceWorld: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.palace} b={C.yagya} cx={540} cy={1150} s0={1.08} s1={1.0}>
    <PalaceSet f={f} blaze={0.5} wheel={{ x: 290, y: 520, w: 500 }} />
    <Cradle f={f} x={540} y={1430} s={0.95} rock={5} />
    <King f={f} id="paKing" x={200} y={1330} s={0.95} facing={1} p={{ lookX: 0.8, lookY: 0.5, brow: 0.3, browTilt: -10, smile: -0.3, sF: 14, eF: 30 }} />
    <Devi pal={MALINI} id="paMal" f={f} x={880} y={1460} s={0.72} crown="queen" hands={[[-40, -450], [58, -440]]} lookX={-0.6} lookY={0.5} smile={-0.25} sad={0.6} />
  </Cam>
);

/** The yagya: Kashyap at the roaring fire offers the charu; Malini receives it. */
const YagyaWorld: React.FC<{ f: number }> = ({ f }) => {
  const roar = 0.7 + 0.8 * prog(f, K.yajna - 4, K.yajna + 12, outBack);
  const give = prog(f, K.yajna + 6, C.birth - 4);
  return (
    <Cam f={f} a={C.yagya} b={C.birth} cx={540} cy={1200} s0={1.0} s1={1.08} hits={[K.yajna]} amp={8}>
      <PalaceSet f={f} blaze={0.9} dusk wheel={{ x: 290, y: 480, w: 500 }} />
      <rect width={W} height={H} fill="#FF7A22" opacity={0.08 + 0.05 * Math.sin(f / 4)} />
      <Sage f={f} id="yKas" x={230} y={1330} s={0.95} facing={1} p={{ sF: lerp(40, 78, give), eF: lerp(70, 18, give), wF: -10, lookX: 0.8, lookY: 0.3, smile: 0.35 }} prop={<CharuBowl f={f} s={0.9} glow={0.5 + 0.5 * give} />} />
      <Devi pal={MALINI} id="yMal" f={f} x={860} y={1460} s={0.72} crown="queen" hands={[[lerp(-58, -150, give), lerp(-440, -500, give)], [58, -440]]} openR={false} lookX={-0.7} lookY={0.3} smile={0.3} />
      <HavanKund f={f} x={560} y={1560} s={0.85} k={roar} />
      <Smoke f={f} x={560} y={1200} n={6} o={0.3} c="#C8A8A0" w={1.2} />
    </Cam>
  );
};

/** "…और रानी मालिनी माँ बनीं।": Malini holds her newborn, warm light, petals. Then (still) the colour drains. */
const BirthWorld: React.FC<{ f: number }> = ({ f }) => {
  const joy = prog(f, K.bani - 6, K.bani + 10);
  return (
    <Cam f={f} a={C.birth} b={C.still} cx={540} cy={1000} s0={1.0} s1={1.1}>
      <PalaceSet f={f} blaze={0.8} wheel={{ x: 290, y: 480, w: 500 }} />
      <Devi pal={MALINI} id="bMal" f={f} x={540} y={1700} s={1.0} crown="queen" hands={[[-70, -470], [80, -500]]} lookX={0} lookY={0.8} smile={0.2 + 0.5 * joy} />
      <g transform="translate(560 1205)">
        <Baby f={f} s={1.15} life={0.75} rot={-6} glow={0.4 * joy} />
      </g>
      <Petals f={f} n={14} seed={7} o={joy} />
    </Cam>
  );
};

/** "पर बेटा… रोया तक नहीं।": push in on the still baby; colour drains, a heartbeat stops. */
const StillWorld: React.FC<{ f: number }> = ({ f }) => {
  const drain = prog(f, C.still, K.roya + 10, Easing.inOut(Easing.cubic));
  return (
    <Cam f={f} a={C.still} b={C.malini} cx={560} cy={1205} s0={1.6} s1={2.2}>
      <PalaceSet f={f} blaze={0.3 * (1 - drain)} dusk wheel={{ x: 290, y: 480, w: 500 }} />
      <Devi pal={MALINI} id="sMal" f={f} x={540} y={1700} s={1.0} crown="queen" hands={[[-70, -470], [80, -500]]} lookX={0} lookY={0.8} smile={lerp(0.5, -0.5, drain)} sad={drain} />
      <g transform="translate(560 1205)">
        <Baby f={f} s={1.15} life={lerp(0.75, 0, drain)} rot={-6} />
      </g>
      <Grey k={0.75 * drain} />
      <rect width={W} height={H} fill="#140A1E" opacity={0.35 * drain} />
    </Cam>
  );
};

/** "मेरा लाल… आँखें खोलो!": Malini, close, tears. */
const MaliniWorld: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.malini} b={C.walk} cx={540} cy={900} s0={1.0} s1={1.08}>
    <PalaceSet f={f} blaze={0.1} dusk wheel={{ x: 290, y: 480, w: 500 }} />
    <Grey k={0.7} />
    <rect width={W} height={H} fill="#140A1E" opacity={0.35} />
    <Devi pal={MALINI} id="mMal" f={f} x={540} y={2350} s={2.2} crown="queen" hands={[[-70, -470], [80, -500]]} lookX={0} lookY={0.9} smile={-0.7} sad={1} tears={1} speak={talk(f, "malini")} eyes={0.55} />
    <g transform="translate(580 1290)">
      <Baby f={f} s={2.4} life={0} rot={-6} />
    </g>
  </Cam>
);

/** Callback to the cold open: the king at the pyre resolves to give up his life (eyes close on "ठान"). */
const WalkWorld: React.FC<{ f: number }> = ({ f }) => {
  const shut = prog(f, K.thaan - 4, K.thaan + 8);
  return (
    <Cam f={f} a={C.walk} b={C.descent} cx={520} cy={1150} s0={1.0} s1={1.18}>
      <GhatNightSet f={f} moonX={250} />
      <Grey k={0.35} />
      <KingBaby f={f} id="wKing" x={430} y={1370} s={1.05} facing={1} p={{ lean: 6, head: 16, lookX: 0.4, lookY: 0.7, brow: 0.5, browTilt: -18, smile: -0.7, blink: shut }} />
    </Cam>
  );
};

/** "तभी आकाश जगमगा उठा… दिव्य विमान से एक देवी उतरीं।": the sky lights, the golden vimana descends. */
const DescentWorld: React.FC<{ f: number }> = ({ f }) => {
  const lit = prog(f, K.jagmaga - 6, K.jagmaga + 14, outCubic);
  const down = prog(f, K.vimana - 10, C.devi, Easing.out(Easing.cubic));
  return (
    <Cam f={f} a={C.descent} b={C.devi} cx={540} cy={1000} s0={1.0} s1={1.06} hits={[K.jagmaga]} amp={10}>
      <GhatNightSet f={f} moonX={180} crack={lit} warm={1 - lit} />
      <SkyCrack f={f} k={0.6 + 0.4 * lit} x={560} y={460} />
      <rect width={W} height={H} fill="#FFD36B" opacity={0.12 * lit} />
      <Vimana f={f} x={560} y={lerp(-200, 760, down)} s={0.7} glow={0.5 + 0.5 * lit} />
      <KingBaby f={f} id="dKing" x={300} y={1580} s={0.85} facing={1} p={{ lean: -10, head: -14, lookX: 0.7, lookY: -1, brow: 1, browTilt: -2, smile: -0.1 }} />
      <Motes f={f} x={100} y={400} w={880} h={1100} n={30} color="#FFE7A0" o={lit} seed={21} />
    </Cam>
  );
};

/** Shashthi Devi speaks: golden, crowned, the lotus halo, the cat at her feet. */
const DeviWorld: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.devi} b={C.touch} cx={540} cy={1000} s0={1.12} s1={1.02}>
    <GhatNightSet f={f} moonX={-300} crack={1} warm={0} />
    <circle cx={540} cy={820} r={720} fill="url(#chDivine)" opacity={0.9} />
    <g transform={`translate(540 760) rotate(${f * 0.25}) translate(-540 -760)`}>
      <SunRays x={540} y={760} r={180} k={0.7} f={f} n={32} />
    </g>
    <Devi pal={SHASHTHI} id="dDevi" f={f} x={540} y={1640} s={1.05} crown="devi" pose="abhaya" halo={1} glow={1} lookX={0} lookY={0.2} smile={0.4} speak={talk(f, "shashthi")} />
    <g transform="translate(200 1440)">
      <Cat f={f} s={0.6} />
    </g>
    <Motes f={f} x={140} y={500} w={800} h={1100} n={26} color="#FFF0B8" o={0.9} seed={33} />
  </Cam>
);

/** The touch: the goddess's hand glows over the baby; on "रो पड़ा" life floods back, the baby cries. */
const TouchWorld: React.FC<{ f: number }> = ({ f }) => {
  const reach = prog(f, C.touch + 4, K.touch, Easing.inOut(Easing.cubic));
  const glow = prog(f, K.touch - 4, K.touch + 10);
  const life = prog(f, K.touch + 6, K.cry + 2, Easing.inOut(Easing.cubic));
  const cry = prog(f, K.cry - 4, K.cry + 4);
  const gk = 0.45 * (1 - life);
  return (
    <Cam f={f} a={C.touch} b={C.command} cx={560} cy={1150} s0={1.0} s1={1.1} hits={[K.cry]} amp={6}>
      <GhatNightSet f={f} moonX={-300} crack={1} warm={life} />
      <circle cx={360} cy={900} r={620} fill="url(#chDivine)" opacity={0.75} />
      <Devi pal={SHASHTHI} id="tDevi" f={f} x={330} y={1620} s={0.9} crown="devi" halo={1} glow={0.8} hands={[[-58, -440], [lerp(58, 200, reach), lerp(-440, -470, reach)]]} openR lookX={0.7} lookY={0.5} smile={0.35 + 0.3 * life} />
      <KingBaby f={f} id="tKing" x={760} y={1500} s={1.05} facing={-1} life={life} cry={cry} glow={glow * (1 - 0.5 * life)} p={{ lean: 4, head: 10, lookX: 0.5, lookY: 0.6, brow: lerp(0.6, 0.9, cry), browTilt: lerp(-16, 0, life), smile: lerp(-0.6, 0.7, life) }} />
      {glow > 0.01 ? <circle cx={600} cy={1180} r={60 + 140 * glow} fill="url(#chDivine)" opacity={glow * (1 - 0.6 * life)} /> : null}
      <Grey k={gk} />
      <Petals f={f} n={18} seed={11} o={cry} color="#F6B70E" />
    </Cam>
  );
};

/** "मेरी पूजा करो… और संसार से भी करवाओ।": the goddess blesses; the king bows, Malini holds the living child. */
const CommandWorld: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.command} b={C.reveal} cx={540} cy={1100} s0={1.04} s1={1.0}>
    <GhatNightSet f={f} moonX={-300} crack={1} warm={1} />
    <circle cx={540} cy={820} r={640} fill="url(#chDivine)" opacity={0.8} />
    <Devi pal={SHASHTHI} id="cDevi" f={f} x={540} y={1500} s={0.82} crown="devi" pose="abhaya" halo={1} glow={0.8} lookX={0} lookY={0.4} smile={0.45} speak={talk(f, "shashthi")} />
    <g transform="translate(400 1530)">
      <Cat f={f} s={0.45} />
    </g>
    <King f={f} id="cKing" x={190} y={1480} s={0.82} facing={1} p={{ lean: 22, head: 12, sF: 70, eF: 112, wF: -20, sB: 66, eB: 104, lookX: 0.6, lookY: 0.4, smile: 0.5 }} />
    <Devi pal={MALINI} id="cMal" f={f} x={890} y={1500} s={0.62} crown="queen" hands={[[-70, -470], [80, -500]]} lookX={-0.4} lookY={0.6} smile={0.7} />
    <g transform="translate(902 1188) scale(0.62)">
      <Baby f={f} s={1.15} life={1} cry={0} rot={-6} />
    </g>
    <Petals f={f} n={12} seed={14} o={0.8} color="#F6B70E" />
  </Cam>
);

/** Present-day Chhath ghat at sunrise: vratins raise their soops; "छठ" and "छठी मैया" are stamped. */
const RevealWorld: React.FC<{ f: number }> = ({ f }) => {
  const rise = prog(f, C.reveal, C.mothers, Easing.out(Easing.cubic));
  return (
    <Cam f={f} a={C.reveal} b={C.mothers} cx={540} cy={1000} s0={1.12} s1={1.0}>
      <DawnGhatSet f={f} rise={0.4 + 0.6 * rise} />
      <Kosi f={f} x={120} y={1500} s={0.75} />
      <Kosi f={f} x={960} y={1520} s={0.7} />
      <Vratin f={f} x={300} y={1480} s={0.62} seed={1} raise={0.9} />
      <Vratin f={f} x={560} y={1520} s={0.7} seed={2} raise={1} />
      <Vratin f={f} x={800} y={1470} s={0.6} seed={3} raise={0.85} facing={-1} />
    </Cam>
  );
};

/** "इसीलिए आज भी हर माँ…": a mother with her child, close, the sun behind them. */
const MothersWorld: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.mothers} b={C.feature} cx={520} cy={1100} s0={1.0} s1={1.1}>
    <DawnGhatSet f={f} rise={1} sunX={600} />
    <Vratin f={f} x={420} y={1560} s={1.2} seed={4} raise={1} child />
    <Petals f={f} n={10} seed={19} o={0.6} color="#F6B70E" />
  </Cam>
);

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
    <SunRays x={540} y={655} r={140 + 12 * Math.sin(f / 7)} k={0.7} f={f * 2.5} n={28} />
    <circle cx={540} cy={760} r={480} fill="url(#nvWarm)" />
    <SvgImage file="jyotiq/site/hero-left-image.png" x={-130} y={1500} width={470} height={470 * (1216 / 1294)} opacity={0.7} />
    <SvgImage file="jyotiq/site/hero-right-image.png" x={760} y={1520} width={400} height={400 * (1293 / 1216)} opacity={0.7} />
    <Petals f={f} n={12} seed={31} o={0.8} color="#F6B70E" />
  </Cam>
);

/* ================================================================== */
/* HTML layers                                                         */
/* ================================================================== */

const KEY = new Set(["श्मशान।", "राजा,", "साँस", "आकाश", "प्रियव्रत…", "कश्यप", "पुत्रेष्टि", "मालिनी", "नहीं।", "देवी", "षष्ठी", "छठ।", "छठी", "मैया।", "मैया", "माँ…", "पंचांग", "फ़्री", "ज्योतिक़", "रो", "विमान"]);

/** Karaoke caption (copied from Navagraha KCaption2, bound to this reel's clock). */
const KCaption: React.FC<{ f: number; hide?: number[] }> = ({ f, hide = [] }) => {
  let pi = -1;
  for (let i = 0; i < P.length; i++) {
    const ph = P[i];
    const next = P[i + 1];
    const end = Math.min(next ? next.a - 2 : 1e9, ph.b + 16);
    if (f >= ph.a - 2 && f < end) pi = i;
  }
  if (pi < 0 || hide.includes(pi)) return null;
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
          maxWidth: 880,
          padding: "16px 26px 20px",
          borderRadius: 30,
          background: char ? "rgba(36,22,40,0.92)" : "rgba(255,255,255,0.95)",
          border: `2.5px solid ${char ? S.gold : S.goldLight}`,
          boxShadow: "0 10px 26px rgba(58,31,18,0.22)",
          textAlign: "center",
          fontFamily: MUKTA,
          fontWeight: 700,
          fontSize: 50,
          lineHeight: 1.3,
          color: char ? "#FFF3DA" : S.brown,
          opacity: Math.min(1, pop * 1.4) * fadeOut,
          transform: `scale(${0.88 + 0.12 * pop})`,
          transformOrigin: "50% 100%",
        }}
      >
        {char ? (
          <div style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: 28, color: S.gold, marginBottom: 2 }}>
            {ph.who === "priyavrat" ? "राजा प्रियव्रत" : ph.who === "malini" ? "रानी मालिनी" : "षष्ठी देवी"}
          </div>
        ) : null}
        {ws.map((w, i) => {
          const cur = f >= w.a - 1 && f < (ws[i + 1] ? ws[i + 1].a - 1 : w.b + 12);
          const said = f >= w.a - 1;
          const key = KEY.has(w.w);
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
  const lf = f - OPEN0;
  const t = prog(lf, 94, 104, outBack);
  const sub = prog(f, A(11) + 10, A(11) + 20);
  const out = 1 - prog(f, C.palace - 8, C.palace - 1);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: out }}>
      <Presents y={300} o={prog(lf, 92, 100)} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1030, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div
          style={{
            padding: "10px 44px 22px",
            borderRadius: 44,
            background: "rgba(255,248,238,0.92)",
            border: `3px solid ${S.goldLight}`,
            boxShadow: "0 16px 36px rgba(58,31,18,0.25)",
            transform: `scale(${1.5 - 0.5 * t})`,
            opacity: Math.min(1, t * 2),
          }}
        >
          <TwoTone parts={[p("छठी मैया "), p("की कथा", true)]} size={120} />
        </div>
        <div style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 40, color: S.brownMid, opacity: sub }}>राजा प्रियव्रत · षष्ठी देवी · ब्रह्मवैवर्त पुराण</div>
      </div>
    </div>
  );
};

/** A big stamped word (छठ / छठी मैया). */
const Stamp: React.FC<{ f: number; at: number; out: number; text: Part[]; y: number; size: number; sub?: string }> = ({ f, at, out, text, y, size, sub }) => {
  if (f < at - 2 || f > out + 8) return null;
  const k = prog(f, at - 2, at + 6, outBack);
  const o = Math.min(1, k * 2) * (1 - prog(f, out, out + 8));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", flexDirection: "column", alignItems: "center", opacity: o, transform: `scale(${1.6 - 0.6 * k})` }}>
      <div style={{ padding: "6px 44px 18px", borderRadius: 40, background: "rgba(255,248,238,0.94)", border: `4px solid ${S.gold}`, boxShadow: "0 18px 40px rgba(58,31,18,0.35)" }}>
        <TwoTone parts={text} size={size} />
      </div>
      {sub ? <div style={{ marginTop: 10, padding: "8px 26px", borderRadius: 30, background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 36 }}>{sub}</div> : null}
    </div>
  );
};

const PanchangCard: React.FC<{ f: number }> = ({ f }) => {
  const k = prog(f, C.feature + 2, C.feature + 14, outBack);
  const row = (i: number) => prog(f, A(39) - 6 + i * 5, A(39) + 4 + i * 5, outBack);
  const chips = ["नक्षत्र", "योग", "करण", "वार", "होरा"];
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: 650, opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - k) * 80}px) scale(${0.9 + 0.1 * k})` }}>
      <div style={{ borderRadius: 40, overflow: "hidden", background: "#FFFFFF", border: `3px solid ${S.gold}`, boxShadow: "0 24px 50px rgba(58,31,18,0.3)" }}>
        <div style={{ background: GRAD, padding: "22px 34px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: 54, color: "#FFF" }}>आज का पंचांग</div>
          <div style={{ padding: "6px 18px", borderRadius: 20, background: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 32, color: S.red }}>फ़्री</div>
        </div>
        <div style={{ padding: "26px 34px 30px", display: "flex", flexDirection: "column", gap: 18 }}>
          {[
            ["तिथि", "कार्तिक शुक्ल षष्ठी"],
            ["पर्व", "छठ पूजा · सूर्य अर्घ्य"],
          ].map(([a, b], i) => (
            <div key={a} style={{ display: "flex", alignItems: "center", gap: 20, opacity: Math.min(1, row(i) * 1.5), transform: `translateX(${(1 - row(i)) * -60}px)` }}>
              <div style={{ width: 110, fontFamily: MUKTA, fontWeight: 700, fontSize: 38, color: S.brownMid }}>{a}</div>
              <div style={{ flex: 1, padding: "10px 22px", borderRadius: 22, background: i === 0 ? "#FFF3D6" : "#FDF7EE", border: `2px solid ${S.goldLight}`, fontFamily: MUKTA, fontWeight: 800, fontSize: 44, ...(i === 0 ? gradText : { color: S.brown }) }}>{b}</div>
            </div>
          ))}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 6, opacity: row(2) }}>
            {chips.map((c) => (
              <div key={c} style={{ padding: "8px 22px", borderRadius: 24, background: "#FFF8EE", border: `2px solid ${S.goldLight}`, fontFamily: MUKTA, fontWeight: 700, fontSize: 32, color: S.brown }}>{c}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureText: React.FC<{ f: number }> = ({ f }) => (
  <>
    <PanchangCard f={f} />
    <Pop f={f} at={A(40) + 4} from="up">
      <div style={{ position: "absolute", left: 0, right: 0, top: 1290, display: "flex", justifyContent: "center" }}>
        <div style={{ padding: "14px 34px", borderRadius: 40, background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 46, boxShadow: "0 10px 24px rgba(224,72,43,0.35)" }}>हर व्रत की सही तिथि · ज्योतिक़ ऐप</div>
      </div>
    </Pop>
    <PanelPulse f={f} a={A(40)} b={C.end + 2} />
    <PanelArrow f={f} a={A(40) + 6} b={C.end} x0={560} y0={540} label="ऐप यहाँ से डाउनलोड करें" />
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
    <div style={{ position: "absolute", left: 0, right: 0, top: 500, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <div style={{ ...st(0), width: 280, height: 280, borderRadius: 140, background: "radial-gradient(circle at 50% 40%, #2A1830 0%, #120C16 75%)", border: `4px solid ${S.gold}`, boxShadow: `0 16px 40px rgba(58,31,18,0.35), 0 0 ${40 + 14 * Math.sin(f / 6)}px rgba(255,214,140,0.45)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Img src={staticFile("jyotiq/logo-full.png")} style={{ width: 190, height: 220, objectFit: "contain" }} />
      </div>
      <div style={st(1)}>
        <TwoTone parts={[p("ज्योतिक़ "), p("डाउनलोड कीजिए", true)]} size={76} />
      </div>
      <div style={{ ...st(2), display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, maxWidth: 940 }}>
        {["पंचांग", "फ़्री कुंडली", "दशा", "गोचर", "होरा"].map((t, i) => (
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
        कमेंट में लिखें: जय छठी मैया
      </div>
      <div style={{ ...st(6), padding: "12px 30px", borderRadius: 40, background: S.brown, color: S.goldLight, border: `2px solid ${S.gold}`, fontFamily: MUKTA, fontWeight: 800, fontSize: 36 }}>
        हर उस माँ को भेजें जो छठ करती है ▸
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
  { a: 0, b: C.close, World: HookWorld },
  { a: C.close, b: C.pv, World: CloseWorld },
  { a: C.pv, b: C.sky, World: PvWorld },
  { a: C.sky, b: C.title, World: SkyWorld },
  { a: C.title, b: C.palace, World: TitleWorld },
  { a: C.palace, b: C.yagya, World: PalaceWorld },
  { a: C.yagya, b: C.birth, World: YagyaWorld },
  { a: C.birth, b: C.still, World: BirthWorld },
  { a: C.still, b: C.malini, World: StillWorld },
  { a: C.malini, b: C.walk, World: MaliniWorld },
  { a: C.walk, b: C.descent, World: WalkWorld },
  { a: C.descent, b: C.devi, World: DescentWorld },
  { a: C.devi, b: C.touch, World: DeviWorld },
  { a: C.touch, b: C.command, World: TouchWorld },
  { a: C.command, b: C.reveal, World: CommandWorld },
  { a: C.reveal, b: C.mothers, World: RevealWorld },
  { a: C.mothers, b: C.feature, World: MothersWorld },
  { a: C.feature, b: C.end, World: FeatureWorld },
  { a: C.end, b: TOTAL, World: EndWorld },
];
const XFADE: Record<number, number> = { [C.birth]: 6, [C.still]: 8, [C.walk]: 10, [C.reveal]: 10, [C.mothers]: 8, [C.end]: 8 };

export const ChhathReel: React.FC = () => {
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
  const lf = f - OPEN0;
  const inTitle = f >= C.title && f < C.palace;
  const hookOut = 1 - prog(f, C.close - 8, C.close);
  // the bug is hidden while the brand open builds the logo, and returns as the logo lands in the corner
  const brand = f < OPEN0 + 80 ? (f < C.title - 4 ? 1 : 1 - prog(f, C.title - 4, C.title + 4)) : prog(lf, 102, 112);
  return (
    <AbsoluteFill style={{ background: S.cream, overflow: "hidden" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <RigDefs />
        <SetDefs />
        <NvDefs />
        <ChDefs />
        {layers}
      </svg>

      {inTitle && lf >= 0 && lf <= 110 ? <NvOpen f={lf} /> : null}
      {inTitle && f < OPEN0 ? <div style={{ position: "absolute", inset: 0, background: "#0b0716", opacity: 0.55 }} /> : null}

      {f < C.close + 2 ? (
        <div style={{ position: "absolute", inset: 0, opacity: hookOut, transform: `scale(${1 + 0.015 * Math.sin(f / 10)})`, transformOrigin: "50% 40%" }}>
          <HookPlate y={560} size={70} lines={[[p("आधी रात, श्मशान…")], [p("राजा का नवजात बेटा")], [p("साँस लिए बिना जन्मा", true)]]} chip="फिर आकाश से कौन उतरा?" />
        </div>
      ) : null}

      <NameChipIn f={f} at={A(12) + 4} out={C.yagya - 4} hi="प्रियव्रत" en="PRIYAVRAT" tag="स्वायंभुव मनु के पुत्र · पृथ्वी के सम्राट" y={520} icon="♔" />
      <NameChipIn f={f} at={C.yagya + 6} out={C.birth - 2} hi="महर्षि कश्यप" en="KASHYAP" tag="प्रजापति · यज्ञ के आचार्य" y={520} icon="ॐ" />
      <NameChipIn f={f} at={C.devi + 8} out={C.touch - 4} hi="षष्ठी देवी" en="SHASHTHI" tag="ब्रह्मा की मानस पुत्री · बच्चों की रक्षक" y={520} icon="✦" />
      <Pop f={f} at={A(27) - 2} out={C.devi - 2} from="up">
        <div style={{ position: "absolute", left: 0, right: 0, top: 1240, display: "flex", justifyContent: "center" }}>
          <div style={{ padding: "14px 36px", borderRadius: 40, background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 46, boxShadow: "0 10px 24px rgba(224,72,43,0.35)" }}>कौन थीं ये देवी?</div>
        </div>
      </Pop>

      <Stamp f={f} at={K.chhath} out={A(34) - 4} text={[p("छठ", true)]} y={560} size={190} sub="षष्ठी → छठ" />
      <Stamp f={f} at={K.maiya} out={C.mothers - 2} text={[p("छठी "), p("मैया", true)]} y={560} size={150} sub="जय छठी मैया" />

      {inTitle ? <TitleText f={f} /> : null}
      {f >= C.feature && f < C.end + 8 ? <FeatureText f={f} /> : null}
      {f >= C.end ? (
        <div style={{ position: "absolute", inset: 0, opacity: prog(f, C.end, C.end + 8), transform: `scale(${1 + 0.03 * prog(f, C.end, TOTAL, Easing.inOut(Easing.sin))})`, transformOrigin: "50% 45%" }}>
          <EndText f={f} />
        </div>
      ) : null}

      {!inTitle && f < C.feature ? <KCaption f={f} /> : null}
      {f >= C.feature && f < C.end ? <KCaption f={f} /> : null}

      <Flash f={f} at={K.phat} color="#FFFFFF" peak={0.85} rise={2} fall={8} />
      <Flash f={f} at={C.title} color="#FFF4D6" peak={1} rise={3} fall={12} />
      <Flash f={f} at={C.palace} peak={0.6} fall={8} />
      <Flash f={f} at={K.yajna} color="#FFB04A" peak={0.35} fall={10} />
      <Flash f={f} at={K.jagmaga} color="#FFF0B8" peak={0.7} fall={12} />
      <Flash f={f} at={C.devi} color="#FFFFFF" peak={0.6} fall={10} />
      <Flash f={f} at={K.touch} color="#FFF0B8" peak={0.8} rise={3} fall={14} />
      <Flash f={f} at={K.cry} color="#FFFFFF" peak={0.5} fall={10} />
      <Flash f={f} at={C.reveal} color="#FFE7B0" peak={0.9} rise={4} fall={14} />
      <Flash f={f} at={C.feature} peak={0.7} fall={8} />

      <Chrome f={f} brand={brand} />
    </AbsoluteFill>
  );
};
