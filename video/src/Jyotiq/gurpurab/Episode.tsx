import React from "react";
import { AbsoluteFill, Easing, Img, staticFile, useCurrentFrame } from "remotion";
import { AppStoreButton, PlayButton } from "../katha/reelKit";
import { Puppet, RigDefs, blinkAt, idle, pose, type Pose, type Who } from "../manthan/rig";
import { Cam as CamBase, Flash, lerp, outBack, outCubic, prog } from "../navagraha/ep1/anim";
import { BRAND, JAKARTA, MUKTA, PLAYFAIR, ROZHA, S, TwoTone, gradText } from "../navagraha/ep1/look";
import { Sepia } from "../bharata/ep4/world4";
import { AFSAR, Dhal, GOBIND, HARGOBIND, Katar, KIRPA, Mala, MUGHAL_RIDER, PANDIT, SheathedSword, Talwar, TEGH, TYAG } from "./cast";
import { BEATS, ENV, PHRASES, TOTAL, WORDS } from "./timing";
import { Bars, Battlefield, Cell, Chadar, Chowk, ClashBurst, Crowd, Darbar, Diyas, DustFront, GTDefs, Grain, Gurdwara, HorseSil, Nishan, Takht, Tint, Vig, WarCrowd } from "./world";

/*
 * गुरु तेग़ बहादुर जी · शहीदी दिवस (24 Nov 2026). Dialogue-led reel on the Manthan cut-out rig.
 * Ayush's brief: the fight first, characters dressed as the sources describe, very intense score, NO captions on picture,
 * the Gurus shown with faces (his decision). Brand bug only (no app panel); the end card carries the brand.
 * Clock: timing.ts (gurpurab-tegh-bahadur/tools/vo_prep.py). Audio is muxed after the render.
 */
export const GT_TOTAL = TOTAL;
const W = 1080;
const H = 1920;
const P = PHRASES;
const A = (i: number) => P[i].a;
void PHRASES;
const cue = (p: number, w: string) => (WORDS.find((x) => x.p === p && x.w.startsWith(w)) ?? WORDS.find((x) => x.p === p)!).a;

const K = {
  takra: cue(0, "टकरा"),
  jang: A(1),
  befikr: cue(1, "बेख़ौफ़"),
  ladd: cue(1, "लड़"),
  aaj: A(2),
  tegh: A(3),
  bahadur: cue(3, "बहादुर"),
  baras: A(4),
  guru9: cue(4, "गुरु"),
  ekdin: A(5),
  pandit: cue(5, "पंडित"),
  kirpa: A(6),
  dharm: A(7),
  marro: cue(7, "मरो"),
  zulm: A(8),
  sheesh8: cue(8, "शीश"),
  pitaji: A(9),
  kaun: cue(9, "कौन"),
  jaakar: A(10),
  pehle: cue(10, "पहले"),
  badal10: cue(10, "बदलवाओ"),
  dilli: A(11),
  qaid: cue(11, "क़ैद"),
  d1: A(12),
  d2: A(13),
  d3: A(14),
  maut: cue(14, "मौत"),
  nahi: A(15),
  jiske: A(16),
  talwar16: cue(16, "तलवार"),
  usne: A(17),
  uthai: cue(17, "उठाई"),
  kisi: A(18),
  sheesh: cue(18, "शीश"),
  vahan: A(19),
  isiliye: A(20),
  hind: A(21),
  chadar: cue(21, "चादर"),
  shaheedi: A(22),
  naman: cue(22, "नमन"),
  aisi: A(23),
};
const C = {
  duel: 58,
  win: 150,
  after: BEATS.victory[0],
  rename: K.aaj - 6,
  raise: K.tegh - 6,
  years: BEATS.years[0],
  anandpur: BEATS.years[1],
  arrive: K.ekdin - 4,
  plea: K.kirpa - 4,
  grave: K.zulm - 8,
  gobind: K.pitaji - 8,
  smile: BEATS.smile[0],
  hope: K.badal10 - 6,
  arrest: BEATS.arrest[0],
  cell: K.dilli - 4,
  afsar: K.d1 - 6,
  calm: K.nahi - 6,
  memory: K.jiske - 4,
  sword: K.usne - 4,
  chowk: K.kisi - 6,
  silence: BEATS.silence[0],
  gurdwara: BEATS.silence[1],
  chadar: K.isiliye - 6,
  namaskar: K.shaheedi - 6,
  end: K.aisi - 4,
};
export const GT_CUTS = C;
export const GT_KEYS = K;

const talk = (f: number, who: string) => {
  const ph = P.find((x) => f >= x.a - 1 && f <= x.b + 1);
  if (!ph || ph.who !== who) return 0;
  const e = (i: number) => ENV[Math.max(0, Math.min(ENV.length - 1, i))] ?? 0;
  return Math.min(1, ((e(f - 1) + 2 * e(f) + e(f + 1)) / 4) * 1.25);
};

/* keyframed poses (as the Bharata episodes) */
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
export const kn = (f: number, keys: [number, number][]): number => {
  if (f <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (f < keys[i + 1][0]) return lerp(keys[i][1], keys[i + 1][1], EASE((f - keys[i][0]) / Math.max(1, keys[i + 1][0] - keys[i][0])));
  }
  return keys[keys.length - 1][1];
};

/** Camera move that never drops below 104%: the shake and the slow drift can then never show the canvas edge (QA 24 Nov). */
const Cam: React.FC<React.ComponentProps<typeof CamBase>> = (p) => <CamBase {...p} s0={Math.max(1.04, p.s0 ?? 1)} s1={Math.max(1.04, p.s1 ?? 1.05)} />;

type ManArgs = { f: number; id: string; who: Who; x: number; y: number; s: number; facing?: number; p?: Partial<Pose>; prop?: React.ReactNode; backProp?: React.ReactNode; k?: number; upright?: boolean; noLegs?: boolean };
const Man: React.FC<ManArgs> = ({ f, id, who, x, y, s, facing = 1, p: o = {}, prop, backProp, k = 1, upright = true, noLegs }) => (
  <Puppet id={id} who={who} at={{ x, y, s, facing }} p={pose({ ...idle(id, f, k), blink: blinkAt(id, f), ...Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && !Number.isNaN(v))) })} t={f} prop={prop} backProp={backProp} upright={upright} noLegs={noLegs} />
);
/** Talwar held as a weapon (blade continues past the fist). */
const Blade: React.FC<{ flash?: number }> = ({ flash = 0 }) => <Talwar s={1.05} rot={180} flash={flash} />;
/** Guru Hargobind's two swords (miri and piri) on the hip, drawn over the puppet. */
const MiriPiri: React.FC<{ x: number; y: number; s: number; facing: number }> = ({ x, y, s, facing }) => (
  <g transform={`translate(${x} ${y}) scale(${facing * s} ${s})`}>
    <g transform="translate(-30 6)"><SheathedSword rot={-18} /></g>
    <g transform="translate(-6 10)"><SheathedSword rot={-30} s={0.95} /></g>
  </g>
);
const Blur: React.FC<{ px?: number; children: React.ReactNode }> = ({ px = 4, children }) => <g style={{ filter: `blur(${px}px)` }}>{children}</g>;

/* ================================================================== */
/* Battle (Kartarpur, 1635)                                            */
/* ================================================================== */

const HITS0 = [8, 30, 50];
const BattleWide: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={0} b={C.duel} cx={540} cy={1150} s0={1.18} s1={1.0} hits={HITS0} amp={16}>
    <Battlefield f={f} sunX={700} sunY={960} />
    <g transform="translate(70 1240)"><Nishan f={f} h={360} s={0.7} /></g>
    <g transform="translate(1010 1250)"><Nishan f={f} h={360} s={0.6} seed={2} c="#4A6A2A" /></g>
    <WarCrowd f={f} floor={1290} scale={0.26} pairs={[90, 300, 520, 760, 980]} tone="#3A2416" seed={2} o={0.85} />
    <g transform={`translate(${-260 + f * 16} 1330)`}><HorseSil f={f} s={0.55} phase={0} /></g>
    <g transform={`translate(${-500 + f * 15} 1360)`}><HorseSil f={f} s={0.6} phase={1.7} tone="#24160E" /></g>
    <g transform={`translate(${1340 - f * 15} 1350)`}><HorseSil f={f} s={0.58} facing={-1} phase={0.8} tone="#2A1A12" /></g>
    <WarCrowd f={f} floor={1700} scale={0.62} pairs={[150, 900]} tone="#1C120C" seed={5} />
    {HITS0.map((h, i) => <ClashBurst key={h} f={f} at={h} x={[300, 760, 520][i]} y={[1140, 1150, 1130][i]} s={0.8} />)}
    <ClashBurst f={f} at={20} x={150} y={1350} s={1.3} />
    <DustFront f={f} />
    <Vig o={0.5} />
  </Cam>
);

const tyagDuel = (f: number): Partial<Pose> => {
  const hs = [K.takra, K.takra + 22, K.jang + 18];
  const keys: KP[] = [[C.duel, { sF: 120, eF: 60, lean: 2, browTilt: 18, lookX: 1, smile: -0.2, fist: 1 }]];
  hs.forEach((h) => {
    keys.push([h - 9, { sF: 176, eF: 36, lean: -8, browTilt: 22, smile: -0.4, fist: 1 }]);
    keys.push([h, { sF: 78, eF: 2, lean: 14, browTilt: 26, smile: -0.5, fist: 1 }]);
    keys.push([h + 10, { sF: 118, eF: 58, lean: 4, browTilt: 18, smile: -0.2, fist: 1 }]);
  });
  return kpo(f, keys, 3);
};
const Duel: React.FC<{ f: number }> = ({ f }) => {
  const hs = [K.takra, K.takra + 22, K.jang + 18];
  const stag = prog(f, hs[2], hs[2] + 14, outCubic);
  const enemy: KP[] = [[C.duel, { sF: 140, eF: 70, lean: -2, browTilt: 18, lookX: 1, fist: 1 }]];
  hs.forEach((h) => {
    enemy.push([h - 6, { sF: 150, eF: 86, lean: -6, browTilt: 20 }]);
    enemy.push([h + 2, { sF: 166, eF: 92, lean: -14, browTilt: 26, smile: -0.5 }]);
    enemy.push([h + 12, { sF: 140, eF: 70, lean: -4, browTilt: 18 }]);
  });
  return (
    <Cam f={f} a={C.duel} b={C.win} cx={560} cy={1000} s0={1.06} s1={1.16} hits={hs} amp={22}>
      <Battlefield f={f} sunX={560} sunY={900} />
      <Blur px={3}>
        <WarCrowd f={f} floor={1280} scale={0.3} pairs={[120, 420, 980]} tone="#3A2416" seed={7} o={0.8} />
        <g transform={`translate(${-300 + (f - C.duel) * 14} 1320)`}><HorseSil f={f} s={0.6} phase={2.2} /></g>
      </Blur>
      <Man f={f} id="dM" who={MUGHAL_RIDER} x={820 + 120 * stag} y={1260} s={1.5} facing={-1} p={{ ...kpo(f, enemy, 3), lean: (kp(f, enemy).lean ?? 0) - 18 * stag }} prop={<Blade />} upright={false} k={0.3} />
      <Man f={f} id="dT" who={TYAG} x={330} y={1250} s={1.45} p={tyagDuel(f)} prop={<Blade flash={hs.some((h) => Math.abs(f - h) < 4) ? 1 : 0} />} backProp={<Dhal s={1.1} />} upright={false} k={0.3} />
      {hs.map((h) => <ClashBurst key={h} f={f} at={h} x={585} y={690} s={1.4} />)}
      <DustFront f={f} k={0.8} />
      <Vig o={0.55} />
    </Cam>
  );
};

const DuelWin: React.FC<{ f: number }> = ({ f }) => {
  const h = K.befikr;
  const h2 = K.ladd + 4;
  const keys: KP[] = [
    [C.win, { sF: 120, eF: 60, lean: 4, browTilt: 18, lookX: 1, fist: 1 }],
    [h - 9, { sF: 176, eF: 36, lean: -8, browTilt: 24, fist: 1 }],
    [h, { sF: 70, eF: 0, lean: 18, browTilt: 28, smile: -0.5, fist: 1 }],
    [h2 - 9, { sF: 176, eF: 30, lean: -6, browTilt: 24, fist: 1 }],
    [h2, { sF: 60, eF: 0, lean: 20, browTilt: 30, smile: -0.5, fist: 1 }],
    [C.after, { sF: 100, eF: 40, lean: 6, browTilt: 14, smile: -0.1, fist: 1 }],
  ];
  const fall = prog(f, h2, h2 + 18, outCubic);
  return (
    <Cam f={f} a={C.win} b={C.after} cx={540} cy={1200} s0={1.0} s1={1.08} hits={[h, h2]} amp={24}>
      <Battlefield f={f} sunX={860} sunY={940} sunset={0.25} />
      <WarCrowd f={f} floor={1300} scale={0.3} pairs={[100, 560, 1000]} tone="#3A2416" seed={11} o={0.75} />
      <g transform={`translate(${1300 - (f - C.win) * 18} 1340)`}><HorseSil f={f} s={0.62} facing={-1} phase={0.4} /></g>
      <g transform={`translate(${840 + 460 * fall} ${1420 + 220 * fall}) rotate(${45 * fall})`} opacity={1 - prog(f, K.ladd + 14, K.ladd + 26)}>
        <Man f={f} id="wM" who={MUGHAL_RIDER} x={0} y={0} s={1.25} facing={-1} p={{ sF: 150, eF: 90, lean: -14 - 20 * fall, browTilt: 24, smile: -0.6, fist: 1 }} prop={fall < 0.4 ? <Blade /> : undefined} upright={false} k={0.2} />
      </g>
      <Man f={f} id="wT" who={TYAG} x={lerp(380, 470, prog(f, h - 4, h2 + 4))} y={1420} s={1.3} p={kpo(f, keys, 3)} prop={<Blade flash={Math.abs(f - h) < 4 || Math.abs(f - h2) < 4 ? 1 : 0} />} backProp={<Dhal s={1.1} />} upright={false} k={0.3} />
      <ClashBurst f={f} at={h} x={720} y={880} s={1.3} />
      <ClashBurst f={f} at={h2} x={740} y={900} s={1.6} />
      <DustFront f={f} k={0.9} />
      <Vig o={0.55} />
    </Cam>
  );
};

const Aftermath: React.FC<{ f: number }> = ({ f }) => {
  const walk = prog(f, C.after, C.rename + 4, Easing.inOut(Easing.sin));
  return (
    <Cam f={f} a={C.after} b={C.rename} cx={540} cy={1250} s0={1.12} s1={1.0}>
      <Battlefield f={f} sunset={1} sunX={560} sunY={1060} dust={0.5} />
      <g transform="translate(860 1250) rotate(18)"><Nishan f={f} h={300} s={0.7} c="#4A6A2A" /></g>
      <g transform="translate(160 1260)"><Nishan f={f} h={420} s={0.8} /></g>
      <Man f={f} id="aT" who={TYAG} x={620} y={1420} s={1.15} facing={-1} p={{ sF: 18, eF: 10, lean: 6, head: 6 + 3 * Math.sin(f / 9), browTilt: 4, lookX: 0.8, lookY: 0.2, bob: Math.sin(f / 7) * 4 }} prop={<Blade />} backProp={<Dhal />} upright={false} k={0.4} />
      <Man f={f} id="aH" who={HARGOBIND} x={lerp(-160, 300, walk)} y={1430} s={1.2} p={{ sF: 10, eF: 14, lookX: 1, smile: 0.25, bob: Math.sin(walk * 24) * 5 * (1 - walk) }} k={0.4} />
      <MiriPiri x={lerp(-160, 300, walk) - 10} y={1430} s={1.2} facing={1} />
      <DustFront f={f} k={0.5} />
      <Vig o={0.55} />
    </Cam>
  );
};

const Rename: React.FC<{ f: number }> = ({ f }) => {
  const hand = prog(f, K.aaj - 4, K.aaj + 14);
  const keysH: KP[] = [
    [C.rename, { sF: 12, eF: 14, lookX: 1, lookY: 0.2, smile: 0.25, brow: 0.3 }],
    [K.aaj + 14, { sF: 62, eF: 14, wF: 20, lookX: 1, lookY: 0.3, smile: 0.45, brow: 0.5 }],
    [C.raise, { sF: 64, eF: 12, wF: 20, lookX: 1, lookY: 0.3, smile: 0.6, brow: 0.6 }],
  ];
  return (
    <Cam f={f} a={C.rename} b={C.raise} cx={560} cy={1100} s0={1.0} s1={1.12}>
      <Battlefield f={f} sunset={1} sunX={560} sunY={1000} dust={0.4} />
      <Man f={f} id="rT" who={TYAG} x={880} y={1560} s={1.42} facing={-1} p={{ sF: 16, eF: 12, head: lerp(6, -4, hand), lookX: 1, lookY: lerp(0.1, -0.3, hand), smile: lerp(0, 0.3, hand), brow: 0.4 * hand }} prop={<Blade />} upright={false} k={0.4} />
      <Man f={f} id="rH" who={HARGOBIND} x={330} y={1500} s={1.62} p={{ ...kpo(f, keysH), talk: talk(f, "hargobind") }} k={0.4} />
      <MiriPiri x={320} y={1500} s={1.62} facing={1} />
      <DustFront f={f} k={0.35} />
      <Vig o={0.55} />
    </Cam>
  );
};

const Raise: React.FC<{ f: number }> = ({ f }) => {
  const up = prog(f, K.bahadur - 10, K.bahadur + 2, outCubic);
  return (
    <Cam f={f} a={C.raise} b={C.years} cx={540} cy={1000} s0={1.0} s1={1.1} hits={[K.bahadur]} amp={12}>
      <Battlefield f={f} sunset={1} sunX={600} sunY={760} dust={0.3} />
      <circle cx={600} cy={760} r={200 + 120 * up} fill="#FFE8B0" opacity={0.35 * up} filter="url(#gtBlur24)" />
      <Man f={f} id="xT" who={TYAG} x={500} y={1680} s={1.9} p={{ sF: lerp(20, 172, up), eF: lerp(14, 0, up), wF: 0, lean: lerp(4, -6, up), head: lerp(4, -12, up), lookX: 0.8, lookY: lerp(0, -0.9, up), smile: 0.35 * up, brow: 0.6 * up, fist: 1 }} prop={<Blade flash={up} />} upright={false} k={0.3} />
      <DustFront f={f} k={0.3} />
      <Vig o={0.5} />
    </Cam>
  );
};

/** Years pass: the sun sets and the moon crosses the sky, then morning. */
const Years: React.FC<{ f: number }> = ({ f }) => {
  const u = prog(f, C.years, C.anandpur + 10, Easing.linear);
  return (
    <g>
      <rect width={W} height={H} fill="#140C18" />
      <rect width={W} height={H} fill="url(#gtSkySunset)" opacity={1 - u} />
      {Array.from({ length: 50 }, (_, i) => <circle key={i} cx={(i * 197) % W} cy={(i * 331) % 1100} r={2 + (i % 3)} fill="#FFF6E0" opacity={Math.sin(u * Math.PI) * 0.8} />)}
      <circle cx={lerp(-80, 1160, u)} cy={900 - Math.sin(u * Math.PI) * 600} r={70} fill="#F4F0E0" opacity={Math.sin(u * Math.PI)} />
      <path d="M0 1200C200 1150 400 1180 600 1140C800 1100 950 1150 1080 1120L1080 1920L0 1920Z" fill="#1A1210" />
      <Sepia k={0.5} />
    </g>
  );
};

/* ================================================================== */
/* Anandpur darbar (1675)                                              */
/* ================================================================== */

const GuruSeated: React.FC<{ f: number; id: string; x: number; y: number; s: number; facing?: number; p?: Partial<Pose>; takht?: number }> = ({ f, id, x, y, s, facing = 1, p = {}, takht = 520 }) => (
  <g>
    <Man f={f} id={id} who={TEGH} x={x} y={y} s={s} facing={facing} p={{ sF: 2, eF: 58, sB: -2, eB: 54, ...p }} prop={<Mala f={f} />} noLegs k={0.6} />
    <g transform={`translate(${x} ${y + 10 * s}) scale(${s})`}>
      {takht ? (
        <Takht w={takht} />
      ) : (
        <g>
          <path d="M-170 -24C-190 120 -230 300 -260 460L280 460C250 300 210 120 180 -24Z" fill="#F6F2E8" />
          <path d="M-170 -24C-190 120 -230 300 -260 460L-120 460C-110 300 -80 120 -60 -24Z" fill="#D6CEBE" opacity={0.7} />
          <path d={`M${-60 * facing} -20C${-20 * facing} 140 ${40 * facing} 300 ${120 * facing} 460L${220 * facing} 460C${150 * facing} 300 ${70 * facing} 120 ${30 * facing} -20Z`} fill="url(#gtKesari)" />
          <path d={`M${-60 * facing} -20C${-20 * facing} 140 ${40 * facing} 300 ${120 * facing} 460`} stroke="#F6D070" strokeWidth={6} fill="none" />
        </g>
      )}
    </g>
  </g>
);

const Anandpur: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.anandpur} b={C.arrive} cx={540} cy={1150} s0={1.0} s1={1.12}>
    <Darbar f={f} />
    <GuruSeated f={f} id="aG" x={540} y={1300} s={1.05} p={{ lookX: 0.3, lookY: 0.2, smile: 0.15, head: 3 }} />
    <Crowd f={f} y={1640} n={9} s={1.1} tone="#4A2A20" seed={4} bow={0.4} />
    <Vig o={0.35} />
  </Cam>
);

const PANDITS: { who: Who; dx: number; s: number }[] = [
  { who: KIRPA, dx: 0, s: 1.0 },
  { who: PANDIT, dx: -170, s: 0.95 },
  { who: PANDIT, dx: -320, s: 0.92 },
  { who: KIRPA, dx: -470, s: 0.9 },
];
const Arrive: React.FC<{ f: number }> = ({ f }) => {
  const walk = prog(f, C.arrive, C.plea - 6, Easing.out(Easing.sin));
  const fold = prog(f, C.plea - 14, C.plea);
  return (
    <Cam f={f} a={C.arrive} b={C.plea} cx={540} cy={1200} s0={1.04} s1={1.0}>
      <Darbar f={f} />
      <GuruSeated f={f} id="rG" x={830} y={1330} s={0.92} facing={-1} p={{ lookX: 1, lookY: 0.1, smile: 0.05 }} takht={420} />
      {PANDITS.map((c, i) => {
        const x = lerp(-260 + c.dx, 470 + c.dx * 0.8, walk);
        return (
          <Man key={i} f={f} id={`pa${i}`} who={c.who} x={x} y={1440 + i * 8} s={c.s} p={{ lean: 6, sF: lerp(14, 46, fold), eF: lerp(20, 52, fold), wF: -34 * fold, sB: lerp(-10, 40, fold), eB: lerp(14, 50, fold), browTilt: -12, lookX: 1, smile: -0.3, bob: Math.sin(walk * 30 + i) * 6 * (1 - walk) }} k={0.4} />
        );
      })}
      <Vig o={0.4} />
    </Cam>
  );
};

const Plea: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.plea} b={C.grave} cx={540} cy={1250} s0={1.0} s1={1.1} hits={[K.marro]} amp={6}>
    <Blur px={6}><Darbar f={f} /></Blur>
    <Blur px={3}>
      <Man f={f} id="pl1" who={PANDIT} x={120} y={1640} s={1.45} p={{ sF: 46, eF: 52, wF: -34, sB: 40, eB: 50, browTilt: -14, lookX: 1, smile: -0.4 }} />
      <Man f={f} id="pl2" who={PANDIT} x={-140} y={1660} s={1.45} p={{ sF: 46, eF: 52, wF: -34, sB: 40, eB: 50, browTilt: -10, lookX: 1, smile: -0.3 }} />
    </Blur>
    <Man f={f} id="plK" who={KIRPA} x={520} y={1780} s={2.1} p={{ sF: 46, eF: 52, wF: -34, sB: 40, eB: 50, lean: 4 + 4 * prog(f, K.dharm, K.marro), head: 6, browTilt: -18, brow: 0.6, lookX: 1, lookY: -0.2, smile: -0.5, talk: talk(f, "kirpa") }} k={0.5} />
    <Vig o={0.5} />
  </Cam>
);

const Grave: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.grave} b={C.gobind} cx={540} cy={1200} s0={1.0} s1={1.12}>
    <Blur px={6}><Darbar f={f} light={1.2} /></Blur>
    <circle cx={620} cy={900} r={420} fill="#FFE8B8" opacity={0.25} filter="url(#gtBlur50)" />
    <GuruSeated f={f} id="gG" x={600} y={1520} s={2.0} facing={-1} p={{ lookX: 0.9, lookY: 0.15, head: 4, brow: 0.3, browTilt: -4, smile: -0.05, talk: talk(f, "tegh") }} takht={0} />
    <Vig o={0.5} />
  </Cam>
);

const Gobind: React.FC<{ f: number }> = ({ f }) => {
  const ask = prog(f, K.kaun - 10, K.kaun + 6);
  const turn = prog(f, K.pitaji - 2, K.pitaji + 14);
  return (
    <Cam f={f} a={C.gobind} b={C.smile} cx={460} cy={1250} s0={1.02} s1={1.14}>
      <Blur px={4}><Darbar f={f} /></Blur>
      <GuruSeated f={f} id="bG" x={690} y={1430} s={1.35} facing={-1} p={{ lookX: lerp(0.3, 1, turn), lookY: lerp(0, 0.5, turn), head: lerp(0, 8, turn), smile: lerp(0, 0.15, ask), brow: 0.4 * ask }} takht={460} />
      <Man f={f} id="bR" who={GOBIND} x={300} y={1580} s={0.98} p={{ sF: lerp(10, 58, ask), eF: lerp(14, 50, ask), wF: -20 * ask, head: -8, lookX: 1, lookY: -0.8, brow: 0.5 + 0.3 * ask, smile: 0.1, talk: talk(f, "gobind") }} k={0.6} />
      <Vig o={0.45} />
    </Cam>
  );
};

const Resolve: React.FC<{ f: number }> = ({ f }) => {
  const sm = prog(f, C.smile, C.smile + 16);
  const firm = prog(f, K.pehle - 6, K.pehle + 10);
  return (
    <Cam f={f} a={C.smile} b={C.hope} cx={540} cy={1150} s0={1.04} s1={1.16}>
      <Blur px={6}><Darbar f={f} light={1.4} /></Blur>
      <circle cx={600} cy={860} r={480} fill="#FFE8B8" opacity={0.2 + 0.2 * firm} filter="url(#gtBlur50)" />
      <GuruSeated f={f} id="vG" x={590} y={1540} s={2.1} facing={-1} p={{ smile: lerp(0, 0.45, sm) - 0.25 * firm, lookX: 1, lookY: lerp(0.5, 0.1, firm), head: lerp(8, 0, firm), brow: 0.3 + 0.3 * firm, browTilt: 6 * firm, sF: lerp(2, 62, firm), eF: lerp(58, 30, firm), talk: talk(f, "tegh") }} takht={0} />
      <Vig o={0.45} />
    </Cam>
  );
};

const Hope: React.FC<{ f: number }> = ({ f }) => {
  const bow = prog(f, C.hope, C.arrest - 4);
  return (
    <Cam f={f} a={C.hope} b={C.arrest} cx={540} cy={1200} s0={1.08} s1={1.0}>
      <Darbar f={f} light={1.3} />
      <GuruSeated f={f} id="hG" x={540} y={1250} s={0.95} p={{ sF: 100, eF: 30, wF: -30, lookX: 0.2, lookY: 0.5, smile: 0.3 }} />
      {[[-60, 1, PANDIT], [200, 1, KIRPA], [880, -1, PANDIT], [1120, -1, KIRPA]].map(([x, fc, who], i) => (
        <Man key={i} f={f} id={`hp${i}`} who={who as Who} x={x as number} y={1560} s={1.05} facing={fc as number} p={{ lean: 10 + 14 * bow, head: 6 + 10 * bow, sF: 46, eF: 52, wF: -34, sB: 40, eB: 50, lookX: 1, lookY: 0.4, smile: 0.2 * bow, browTilt: -6 }} k={0.4} />
      ))}
      <Vig o={0.4} />
    </Cam>
  );
};

/* ================================================================== */
/* Delhi (1675)                                                        */
/* ================================================================== */

const Arrest: React.FC<{ f: number }> = ({ f }) => {
  const slam = K.dilli - 18;
  const drop = prog(f, slam - 8, slam, Easing.in(Easing.quad));
  return (
    <Cam f={f} a={C.arrest} b={C.cell} cx={540} cy={960} s0={1.1} s1={1.0} hits={[slam]} amp={26}>
      <Cell f={f} shaft={0.3} torch={prog(f, slam, slam + 10)} />
      <Tint c="#000" o={0.55} />
      <g transform={`translate(0 ${lerp(-H, 0, drop)})`}><Bars /></g>
      <Vig o={0.7} />
    </Cam>
  );
};

const CellWide: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.cell} b={C.afsar} cx={560} cy={1200} s0={1.0} s1={1.1}>
    <Cell f={f} />
    <GuruSeated f={f} id="cG" x={560} y={1460} s={1.15} facing={-1} p={{ lookX: 0.2, lookY: 0.3, head: 6, smile: 0.05, blink: 0.6 }} takht={360} />
    <Bars o={0.95} />
    <Vig o={0.6} />
  </Cam>
);

const Afsar: React.FC<{ f: number }> = ({ f }) => {
  const keys: KP[] = [
    [C.afsar, { sF: 10, eF: 14, lean: 0, browTilt: 18, lookX: 1, smile: -0.3 }],
    [K.d1 + 4, { sF: 82, eF: 6, wF: 10, lean: 6, browTilt: 24, smile: -0.4 }],
    [K.d2 + 4, { sF: 64, eF: 40, wF: -30, lean: 2, browTilt: 20, smile: 0.25, brow: 0.6 }],
    [K.maut - 2, { sF: 96, eF: 10, lean: 10, browTilt: 30, smile: -0.6, fist: 1, glow: 0.2 }],
    [C.calm, { sF: 90, eF: 14, lean: 8, browTilt: 30, smile: -0.6, fist: 1 }],
  ];
  return (
    <Cam f={f} a={C.afsar} b={C.calm} cx={540} cy={1050} s0={1.0} s1={1.14} hits={[K.maut]} amp={14}>
      <Cell f={f} shaft={0.4} />
      <Tint c="#2A0E06" o={0.35} />
      <circle cx={120} cy={900} r={500} fill="#FF8A2A" opacity={0.22 + 0.04 * Math.sin(f / 2.3)} filter="url(#gtBlur50)" />
      <Man f={f} id="fA" who={AFSAR} x={520} y={1780} s={2.35} p={{ ...kpo(f, keys), talk: talk(f, "afsar") }} k={0.4} />
      <g transform={`translate(${520 + 30 * 2.35} ${1780 - 6 * 2.35}) scale(2.35)`}><Katar rot={-30} /></g>
      <Vig o={0.6} />
    </Cam>
  );
};

const Calm: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.calm} b={C.memory} cx={540} cy={1100} s0={1.06} s1={1.14}>
    <Cell f={f} shaft={1.3} torch={0.4} />
    <GuruSeated f={f} id="mG" x={590} y={1560} s={2.15} facing={-1} p={{ lookX: 1, lookY: 0, head: 0, smile: 0.1, brow: 0.2, talk: talk(f, "tegh") }} takht={0} />
    <rect width={W} height={H} fill="url(#gtShaft)" opacity={0.25} />
    <Vig o={0.6} />
  </Cam>
);

/** "जिसके नाम में तलवार थी…": a sepia flash of the boy raising his sword at Kartarpur. */
const Memory: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <Raise f={K.bahadur + 6 + (f - C.memory) * 0.3} />
    <Sepia k={0.85} />
    <rect width={W} height={H} fill="#FFF4D6" opacity={0.15 + 0.1 * Math.sin(f * 1.3)} />
    <Vig o={0.6} />
  </g>
);

const Sword: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.sword} b={C.chowk} cx={540} cy={1400} s0={1.12} s1={1.0}>
    <Cell f={f} shaft={1.2} torch={0.5} />
    <GuruSeated f={f} id="sG" x={560} y={1300} s={1.45} facing={-1} p={{ lookX: 0.6, lookY: 0.6, head: 10, smile: 0.12, blink: 0.55 }} takht={0} />
    <g transform="translate(330 1640) rotate(-80) scale(2.2)"><SheathedSword /></g>
    <circle cx={520} cy={1650} r={260} fill="#FFF0C8" opacity={0.18} filter="url(#gtBlur50)" />
    <Vig o={0.6} />
  </Cam>
);

const ChowkShot: React.FC<{ f: number }> = ({ f }) => {
  const bloom = prog(f, K.sheesh - 6, C.silence, Easing.in(Easing.quad));
  return (
    <Cam f={f} a={C.chowk} b={C.silence} cx={540} cy={1100} s0={1.0} s1={1.12}>
      <Chowk f={f} bloom={0} />
      <GuruSeated f={f} id="kG" x={540} y={1330} s={0.82} p={{ lookX: 0.1, lookY: 0.2, head: 6, smile: 0.12, blink: 0.65 }} takht={360} />
      <Man f={f} id="kA" who={AFSAR} x={900} y={1360} s={0.8} facing={-1} p={{ browTilt: 20, lookX: 1 }} k={0.3} />
      <Crowd f={f} y={1560} n={12} s={0.95} tone="#2A1C1E" seed={8} bow={prog(f, K.kisi, K.sheesh)} />
      <Crowd f={f} y={1720} n={9} s={1.25} tone="#1A1214" seed={9} bow={prog(f, K.kisi + 10, K.sheesh)} />
      <rect width={W} height={H} fill="#FFF6E0" opacity={bloom} />
      <Vig o={0.4 * (1 - bloom)} />
    </Cam>
  );
};

const Silence: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={W} height={H} fill="#050304" />
    <Diyas f={f} y={1180} n={1} s={2.2} lit={prog(f, C.silence + 6, C.silence + 24)} />
  </g>
);

const GurdwaraShot: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.gurdwara} b={C.chadar} cx={540} cy={1000} s0={1.12} s1={1.0} dy={-30}>
    <Gurdwara f={f} />
    <Crowd f={f} y={1700} n={11} s={0.8} tone="#3A2A28" seed={12} bow={0.3} />
    <Diyas f={f} y={1850} n={9} s={0.9} lit={prog(f, C.gurdwara, C.gurdwara + 60)} />
    <Vig o={0.3} />
  </Cam>
);

const ChadarShot: React.FC<{ f: number }> = ({ f }) => {
  const k = prog(f, C.chadar, K.chadar + 4, Easing.inOut(Easing.quad));
  return (
    <Cam f={f} a={C.chadar} b={C.namaskar} cx={540} cy={1000} s0={1.15} s1={1.0} hits={[K.chadar]} amp={10}>
      <Chadar f={f} k={k} />
      <Vig o={0.4} />
    </Cam>
  );
};

const Namaskar: React.FC<{ f: number }> = ({ f }) => (
  <Cam f={f} a={C.namaskar} b={C.end + 12} cx={540} cy={1200} s0={1.0} s1={1.08}>
    <Gurdwara f={f} glow={0.6} />
    <Tint c="#1A1030" o={0.5} />
    <Crowd f={f} y={1560} n={13} s={0.95} tone="#140C14" seed={14} bow={prog(f, K.shaheedi, K.naman + 8)} />
    <Diyas f={f} y={1780} n={11} s={1} lit={prog(f, C.namaskar, K.naman + 6)} />
    <Diyas f={f} y={1900} n={8} s={1.2} lit={prog(f, C.namaskar + 10, K.naman + 14)} />
    <Vig o={0.45} />
  </Cam>
);

const EndWorld: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={W} height={H} fill="#140A08" />
    <circle cx={540} cy={820} r={600} fill="#6A3010" opacity={0.6} filter="url(#gtBlur50)" />
    <Diyas f={f} y={1700} n={9} s={1} lit={1} />
  </g>
);

const EndText: React.FC<{ f: number }> = ({ f }) => {
  const e = C.end;
  const st = (i: number): React.CSSProperties => {
    const k = prog(f, e + 4 + i * 5, e + 16 + i * 5, outBack);
    return { opacity: Math.min(1, k * 1.5), transform: `translateY(${(1 - k) * 40}px) scale(${0.85 + 0.15 * k})` };
  };
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
      <div style={{ ...st(0), width: 300, height: 300, borderRadius: 150, border: `5px solid ${S.gold}`, boxShadow: "0 0 80px rgba(255,180,80,0.45)", overflow: "hidden" }}>
        <Img src={staticFile("jyotiq/logo-zodiac.png")} style={{ width: 300, height: 300 }} />
      </div>
      <div style={{ ...st(1), fontFamily: ROZHA, fontSize: 120, lineHeight: 1.05, background: "linear-gradient(180deg, #FFF3C4 0%, #F6C14E 60%, #C07A1E 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>ज्योतिक़</div>
      <div style={{ ...st(2), display: "flex", gap: 18, transform: "scale(0.95)" }}>
        <PlayButton glow={0.4 + 0.3 * Math.sin(f / 5)} />
        <AppStoreButton glow={0.4 + 0.3 * Math.sin(f / 5 + 1)} />
      </div>
      <div style={{ ...st(3), fontFamily: MUKTA, fontWeight: 800, fontSize: 40, ...gradText }}>www.jyotiq.ai</div>
      <div style={{ ...st(4), fontFamily: JAKARTA, fontWeight: 600, fontSize: 22, color: "#E8D8C0", opacity: 0.75 }}>Guidance only, for entertainment and information.</div>
    </div>
  );
};
void TwoTone;

/**
 * Brand bug with Jyotiq's new logo (the app's zodiac-wheel logo, approved 23 Nov 2026), on the same dark glass pill and
 * position as the series bug, so it reads over every scene. Shown on every frame.
 */
const ZBug: React.FC<{ o?: number }> = ({ o = 1 }) => (
  <div style={{ position: "absolute", left: BRAND.x, top: BRAND.y, height: BRAND.h, display: "flex", alignItems: "center", gap: 14, padding: "0 30px 0 10px",
    borderRadius: 60, background: "radial-gradient(120% 140% at 20% 50%, rgba(36,22,40,0.94) 0%, rgba(14,10,18,0.92) 100%)", border: "2px solid rgba(223,177,91,0.75)",
    boxShadow: "0 8px 22px rgba(58,31,18,0.25)", opacity: o }}>
    <Img src={staticFile("jyotiq/logo-zodiac.png")} style={{ width: 86, height: 86, borderRadius: 43, boxShadow: "0 0 0 2px rgba(240,180,80,0.8)" }} />
    <div style={{ fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 42, color: "#F3DB9D", letterSpacing: 2 }}>Jyotiq</div>
  </div>
);

/* ================================================================== */
/* Composition                                                         */
/* ================================================================== */

type Shot = { a: number; b: number; World: React.FC<{ f: number }> };
const SHOTS: Shot[] = [
  { a: 0, b: C.duel, World: BattleWide },
  { a: C.duel, b: C.win, World: Duel },
  { a: C.win, b: C.after, World: DuelWin },
  { a: C.after, b: C.rename, World: Aftermath },
  { a: C.rename, b: C.raise, World: Rename },
  { a: C.raise, b: C.years, World: Raise },
  { a: C.years, b: C.anandpur, World: Years },
  { a: C.anandpur, b: C.arrive, World: Anandpur },
  { a: C.arrive, b: C.plea, World: Arrive },
  { a: C.plea, b: C.grave, World: Plea },
  { a: C.grave, b: C.gobind, World: Grave },
  { a: C.gobind, b: C.smile, World: Gobind },
  { a: C.smile, b: C.hope, World: Resolve },
  { a: C.hope, b: C.arrest, World: Hope },
  { a: C.arrest, b: C.cell, World: Arrest },
  { a: C.cell, b: C.afsar, World: CellWide },
  { a: C.afsar, b: C.calm, World: Afsar },
  { a: C.calm, b: C.memory, World: Calm },
  { a: C.memory, b: C.sword, World: Memory },
  { a: C.sword, b: C.chowk, World: Sword },
  { a: C.chowk, b: C.silence, World: ChowkShot },
  { a: C.silence, b: C.gurdwara, World: Silence },
  { a: C.gurdwara, b: C.chadar, World: GurdwaraShot },
  { a: C.chadar, b: C.namaskar, World: ChadarShot },
  { a: C.namaskar, b: C.end, World: Namaskar },
  { a: C.end, b: TOTAL, World: EndWorld },
];
const XFADE: Record<number, number> = { [C.years]: 8, [C.anandpur]: 12, [C.memory]: 4, [C.sword]: 6, [C.gurdwara]: 14, [C.chadar]: 10, [C.namaskar]: 12, [C.end]: 14 };

export const GuruTeghReel: React.FC = () => {
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
  const ending = f >= C.end;
  return (
    <AbsoluteFill style={{ background: "#120A08", overflow: "hidden" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <RigDefs />
        <GTDefs />
        {layers}
        <Grain f={f} o={0.05} />
      </svg>
      {ending ? <div style={{ position: "absolute", inset: 0, opacity: prog(f, C.end, C.end + 10) }}><EndText f={f} /></div> : null}
      <Flash f={f} at={K.takra} color="#FFF4D0" peak={0.35} rise={1} fall={6} />
      <Flash f={f} at={K.befikr} color="#FFF4D0" peak={0.3} rise={1} fall={6} />
      <Flash f={f} at={K.bahadur} color="#FFE8B0" peak={0.55} rise={2} fall={12} />
      <Flash f={f} at={K.dilli - 18} color="#000000" peak={0.6} rise={1} fall={8} />
      <Flash f={f} at={K.maut} color="#8A1A0A" peak={0.25} rise={1} fall={10} />
      <Flash f={f} at={K.chadar} color="#FFD890" peak={0.6} rise={2} fall={14} />
      <ZBug o={ending ? 1 - prog(f, C.end, C.end + 10) : 1} />
    </AbsoluteFill>
  );
};
