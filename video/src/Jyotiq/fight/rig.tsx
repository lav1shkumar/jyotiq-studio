import React from "react";
import { Easing, random } from "remotion";

/* Silhouette rig for the fight hook. A figure is a stack of round-capped
   strokes (limbs), two capsules (torso) and a head, posed by forward
   kinematics from a handful of angles. Every value is a pure function of the
   frame, so renders are deterministic.

   Angle convention (degrees): a limb at 0 hangs straight down, positive
   rotates toward the way the figure faces. Elbows flex forward (+), knees
   flex backward (+). `lean` tilts the torso forward (+). */

export type Pose = {
  x: number; // pelvis x, scene px
  lift: number; // hop above the ground solution, figure units
  seat: number; // 0 = standing on the floor, 1 = sitting at seatH
  seatH: number; // seat height above the floor, figure units
  lean: number;
  head: number;
  sF: number; // front shoulder
  eF: number; // front elbow
  sB: number; // back shoulder
  eB: number; // back elbow
  hF: number; // front hip
  kF: number; // front knee
  hB: number; // back hip
  kB: number; // back knee
};

export type EaseName = "io" | "out" | "snap" | "back" | "in" | "lin";
/** A keyframe: only the fields that change; `e` is the easing used to arrive here. */
export type Key = Partial<Pose> & { f: number; e?: EaseName };

const EASE: Record<EaseName, (t: number) => number> = {
  io: Easing.inOut(Easing.cubic),
  out: Easing.out(Easing.cubic),
  snap: Easing.out(Easing.exp),
  back: Easing.out(Easing.back(1.6)),
  in: Easing.in(Easing.quad),
  lin: (t) => t,
};

const BASE: Pose = {
  x: 0, lift: 0, seat: 0, seatH: 120, lean: 0, head: 0,
  sF: 4, eF: 12, sB: -4, eB: 12, hF: 3, kF: 4, hB: -3, kB: 4,
};
const FIELDS = Object.keys(BASE) as (keyof Pose)[];

export const poseAt = (keys: Key[], f: number): Pose => {
  const full: { f: number; e: EaseName; p: Pose }[] = [];
  let cur: Pose = { ...BASE };
  for (const k of keys) {
    cur = { ...cur };
    for (const fld of FIELDS) {
      const val = k[fld];
      if (val !== undefined) cur[fld] = val;
    }
    full.push({ f: k.f, e: k.e ?? "io", p: cur });
  }
  if (f <= full[0].f) return full[0].p;
  for (let i = 1; i < full.length; i++) {
    if (f < full[i].f) {
      const a = full[i - 1];
      const b = full[i];
      const t = EASE[b.e]((f - a.f) / (b.f - a.f));
      const out = { ...a.p };
      for (const fld of FIELDS) out[fld] = a.p[fld] + (b.p[fld] - a.p[fld]) * t;
      return out;
    }
  }
  return full[full.length - 1].p;
};

/** Smooth deterministic noise in -1..1. */
export const vnoise = (seed: string, t: number): number => {
  const i = Math.floor(t);
  const fr = t - i;
  const s = fr * fr * (3 - 2 * fr);
  const a = random(`${seed}:${i}`) * 2 - 1;
  const b = random(`${seed}:${i + 1}`) * 2 - 1;
  return a + (b - a) * s;
};

/* ------------------------------------------------------------------ */
/* Look                                                                */
/* ------------------------------------------------------------------ */

export type Hair = "short" | "quiff" | "curly" | "bun" | "dreads" | "long" | "bob";

export type FigureSpec = {
  id: string;
  facing: 1 | -1;
  floor: number; // scene y of this figure's floor line
  scale: number; // depth scale
  tone: string; // silhouette colour
  view?: "side" | "front";
  build?: number; // limb/torso thickness multiplier
  spread?: number; // half shoulder spread, figure units (side ~6, front ~50)
  hipSpread?: number;
  hair: Hair;
  top?: string; // shirt / cardigan / kurta colour (default tone)
  sleeves?: "short" | "long";
  bottom?: string; // trousers / shorts colour (default tone)
  shorts?: boolean;
  skirt?: { len: number; flare: number; color?: string }; // kurta / dress hem along the leg 0..1
  keys: Key[];
  jit?: [number, number, number][]; // struggle windows [from, to, amount]
  react?: number[]; // frames where a bystander flinches
  idle?: number; // breathing amount (default 1)
  filter?: string;
  shadow?: boolean;
};

/* Proportions in figure units (about 700 tall standing). */
const TORSO = 235;
const SH_DROP = 26;
const UA = 132;
const FA = 116;
const TH = 176;
const SN = 170;
const ANK = 12;
const NECK = 22;
const HEAD_R = 41;
const FOOT = 44;

type V = { x: number; y: number };
const v = (x: number, y: number): V => ({ x, y });
const add = (a: V, b: V, k = 1): V => ({ x: a.x + b.x * k, y: a.y + b.y * k });
const mix = (a: V, b: V, t: number): V => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
const RAD = Math.PI / 180;
/** Limb direction: 0 = down, + = toward facing. */
const dir = (deg: number, fc: number): V => v(Math.sin(deg * RAD) * fc, Math.cos(deg * RAD));
const upOf = (deg: number, fc: number): V => v(Math.sin(deg * RAD) * fc, -Math.cos(deg * RAD));
const fwdOf = (deg: number, fc: number): V => v(Math.cos(deg * RAD) * fc, Math.sin(deg * RAD));

export type Joints = {
  s: number;
  P: V; N: V; S0: V; shF: V; shB: V; elF: V; elB: V; wrF: V; wrB: V;
  hipF: V; hipB: V; knF: V; knB: V; anF: V; anB: V; toF: V; toB: V;
  HC: V; hu: V; hf: V; tu: V; tf: V;
};

/** Pose at frame f including struggle noise, bystander flinches and breathing. */
export const livePose = (spec: FigureSpec, f: number): Pose => {
  const p = { ...poseAt(spec.keys, f) };
  const sd = spec.id;
  const idle = spec.idle ?? 1;
  p.lean += 0.9 * idle * Math.sin(f / 13 + random(`${sd}ph`) * 6);
  p.head += 1.4 * idle * Math.sin(f / 17 + random(`${sd}ph2`) * 6);
  for (const [a, b, amt] of spec.jit ?? []) {
    if (f < a - 4 || f > b + 4) continue;
    const w = amt * Math.min(1, (f - a + 4) / 6, (b + 4 - f) / 6);
    const t = f * 0.34;
    p.x += w * 9 * vnoise(`${sd}x`, t);
    p.lean += w * 6 * vnoise(`${sd}l`, t);
    p.head += w * 7 * vnoise(`${sd}h`, t * 1.3);
    p.sF += w * 16 * vnoise(`${sd}sf`, t * 1.2);
    p.eF += w * 14 * vnoise(`${sd}ef`, t * 1.1);
    p.sB += w * 14 * vnoise(`${sd}sb`, t * 1.25);
    p.hF += w * 5 * vnoise(`${sd}hf`, t);
    p.hB += w * 5 * vnoise(`${sd}hb`, t * 0.9);
  }
  for (const r of spec.react ?? []) {
    if (f < r) continue;
    const k = Math.exp(-(f - r) / 6) * Math.min(1, (f - r + 1) / 2);
    p.lean -= 8 * k;
    p.head -= 7 * k;
    p.sF += 14 * k;
    p.sB += 10 * k;
  }
  return p;
};

export const solve = (spec: FigureSpec, p: Pose): Joints => {
  const s = spec.scale;
  const fc = spec.facing;
  const tu = upOf(p.lean, fc);
  const tf = fwdOf(p.lean, fc);
  const hs = spec.hipSpread ?? 4;
  const hipF0 = v(fc * hs, 0);
  const hipB0 = v(-fc * hs, 0);
  const knF0 = add(hipF0, dir(p.hF, fc), TH);
  const anF0 = add(knF0, dir(p.hF - p.kF, fc), SN);
  const knB0 = add(hipB0, dir(p.hB, fc), TH);
  const anB0 = add(knB0, dir(p.hB - p.kB, fc), SN);
  const drop = Math.max(anF0.y, anB0.y) + ANK;
  const yG = spec.floor - (drop + p.lift) * s;
  const yS = spec.floor - (p.seatH + p.lift) * s;
  const P = v(p.x, yG + (yS - yG) * p.seat);
  const L = (q: V): V => add(P, q, s);
  const N = add(P, tu, TORSO * s);
  const S0 = add(P, tu, (TORSO - SH_DROP) * s);
  const sp = spec.spread ?? 6;
  const shF = add(S0, tf, sp * s);
  const shB = add(S0, tf, -sp * s);
  const elF = add(shF, dir(p.sF, fc), UA * s);
  const wrF = add(elF, dir(p.sF + p.eF, fc), FA * s);
  const elB = add(shB, dir(p.sB, fc), UA * s);
  const wrB = add(elB, dir(p.sB + p.eB, fc), FA * s);
  const front = spec.view === "front";
  const toeDir = (side: 1 | -1) => (front ? v(fc * side * 0.45, 0.25) : v(fc, 0.08));
  const anF = L(anF0);
  const anB = L(anB0);
  const hu = upOf(p.lean + p.head, fc);
  const hf = fwdOf(p.lean + p.head, fc);
  return {
    s, P, N, S0, shF, shB, elF, elB, wrF, wrB,
    hipF: L(hipF0), hipB: L(hipB0), knF: L(knF0), knB: L(knB0), anF, anB,
    toF: add(anF, toeDir(1), FOOT * s), toB: add(anB, toeDir(-1), FOOT * s),
    HC: add(N, hu, (NECK + HEAD_R) * s), hu, hf, tu, tf,
  };
};

/* ------------------------------------------------------------------ */
/* Drawing                                                             */
/* ------------------------------------------------------------------ */

const Seg: React.FC<{ a: V; b: V; w: number; c: string }> = ({ a, b, w, c }) => (
  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={c} strokeWidth={w} strokeLinecap="round" />
);
const Dot: React.FC<{ p: V; r: number; c: string }> = ({ p, r, c }) => <circle cx={p.x} cy={p.y} r={r} fill={c} />;
const Poly: React.FC<{ pts: V[]; c: string; round?: number }> = ({ pts, c, round = 16 }) => (
  <path
    d={pts.map((q, i) => `${i ? "L" : "M"}${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(" ") + "Z"}
    fill={c}
    stroke={c}
    strokeWidth={round}
    strokeLinejoin="round"
  />
);

/** Point along hip -> knee -> ankle at t (0..1). */
const alongLeg = (hip: V, kn: V, an: V, t: number): V => (t <= 0.5 ? mix(hip, kn, t * 2) : mix(kn, an, (t - 0.5) * 2));

export const Figure: React.FC<{ spec: FigureSpec; f: number }> = ({ spec, f }) => {
  const j = solve(spec, livePose(spec, f));
  const { s } = j;
  const b = (spec.build ?? 1) * s * 1.15; // stroke thickness (limbs + torso)
  const fc = spec.facing;
  const tone = spec.tone;
  const top = spec.top ?? tone;
  const bottom = spec.bottom ?? tone;
  const front = spec.view === "front";

  // Hair swing: lagged head velocity (hair trails the motion).
  let vx = 0;
  let vy = 0;
  const w = [0.34, 0.26, 0.19, 0.13, 0.08];
  for (let k = 0; k < w.length; k++) {
    const a = solve(spec, livePose(spec, f - k)).HC;
    const c = solve(spec, livePose(spec, f - k - 1)).HC;
    vx += (a.x - c.x) * w[k];
    vy += (a.y - c.y) * w[k];
  }
  const swing = Math.max(-75, Math.min(75, (-vx * 2.6) / s)); // degrees, screen-space (+ = toward +x)
  const bounce = Math.max(-30, Math.min(30, (vy * 1.5) / s));

  const leg = (hip: V, kn: V, an: V, to: V, back: boolean) => (
    <g key={back ? "lb" : "lf"}>
      <Seg a={hip} b={kn} w={50 * b} c={bottom} />
      <Seg a={kn} b={an} w={38 * b} c={bottom} />
      <Seg a={an} b={to} w={22 * b} c={tone} />
      {spec.shorts ? <Seg a={hip} b={mix(hip, kn, 0.56)} w={60 * b} c={bottom} /> : null}
      {spec.shorts ? <Seg a={mix(hip, kn, 0.6)} b={kn} w={46 * b} c={tone} /> : null}
      {spec.shorts ? <Seg a={kn} b={an} w={38 * b} c={tone} /> : null}
    </g>
  );

  const arm = (sh: V, el: V, wr: V, key: string) => {
    const sleeve = spec.sleeves ?? "short";
    const hand = add(wr, v((wr.x - el.x) / (FA * s), (wr.y - el.y) / (FA * s)), 9 * s);
    return (
      <g key={key}>
        <Seg a={sh} b={el} w={33 * b} c={sleeve === "long" ? top : tone} />
        <Seg a={el} b={wr} w={27 * b} c={sleeve === "long" ? top : tone} />
        {sleeve === "short" ? <Seg a={sh} b={mix(sh, el, 0.5)} w={41 * b} c={top} /> : null}
        <Dot p={hand} r={16 * b} c={tone} />
      </g>
    );
  };

  // Torso: chest + waist capsules, plus a shoulder bar when seen from the front.
  const chestTop = add(j.P, j.tu, (TORSO - 40) * s);
  const chestMid = add(j.P, j.tu, TORSO * 0.52 * s);
  const waist = add(j.P, j.tu, 34 * s);
  const torso = (
    <g key="torso">
      <Seg a={chestTop} b={chestMid} w={(front ? 118 : 100) * b} c={top} />
      <Seg a={chestMid} b={waist} w={(front ? 98 : 86) * b} c={top} />
      {front ? <Seg a={j.shF} b={j.shB} w={46 * b} c={top} /> : null}
      <Seg a={j.N} b={add(j.HC, j.hu, -20 * s)} w={30 * b} c={tone} />
    </g>
  );

  const skirt = spec.skirt
    ? (() => {
        const sk = spec.skirt;
        const half = (front ? 52 : 44) * b;
        const t0 = add(j.P, j.tu, 70 * s);
        const hemF = add(alongLeg(j.hipF, j.knF, j.anF, sk.len), v(fc, 0), sk.flare * s);
        const hemB = add(alongLeg(j.hipB, j.knB, j.anB, sk.len), v(-fc, 0), sk.flare * s);
        return <Poly key="skirt" pts={[add(t0, j.tf, half), hemF, hemB, add(t0, j.tf, -half)]} c={sk.color ?? top} round={20 * s} />;
      })()
    : null;

  // Head + hair.
  const R = HEAD_R * s;
  const hairBack: React.ReactNode[] = [];
  const hairTop: React.ReactNode[] = [];
  const crown = add(add(j.HC, j.hu, 5 * s), j.hf, -5 * s);
  if (spec.hair !== "bob") hairTop.push(<Dot key="cap" p={crown} r={R + 3 * s} c={tone} />);
  if (spec.hair === "quiff") {
    const q = add(add(j.HC, j.hu, R - 2 * s), j.hf, 12 * s);
    hairTop.push(<ellipse key="q" cx={q.x} cy={q.y} rx={24 * s} ry={13 * s} fill={tone} />);
  }
  if (spec.hair === "curly") {
    for (let k = 0; k < 7; k++) {
      const a = (-105 + k * 35) * RAD;
      const c = add(add(j.HC, j.hu, Math.cos(a) * (R + 2 * s)), j.hf, Math.sin(a) * (R + 2 * s));
      hairTop.push(<Dot key={`c${k}`} p={c} r={15 * s} c={tone} />);
    }
  }
  if (spec.hair === "bun" || spec.hair === "dreads") {
    const bun = add(add(j.HC, j.hu, R + 9 * s), j.hf, -16 * s);
    hairTop.push(<Dot key="bun" p={bun} r={17 * s} c={tone} />);
  }
  if (spec.hair === "dreads") {
    const root = add(add(j.HC, j.hu, R * 0.75), j.hf, -14 * s);
    for (let k = 0; k < 6; k++) {
      let p0 = add(root, j.hf, (-k * 4 + 6) * s);
      const pts = [p0];
      for (let seg = 0; seg < 3; seg++) {
        const base = -fc * (28 + k * 7) + swing * (0.55 + 0.25 * seg) - bounce * 0.4;
        const d = v(Math.sin(base * RAD), Math.cos(base * RAD));
        p0 = add(p0, d, (40 + k * 3) * s);
        pts.push(p0);
      }
      hairBack.push(
        <polyline
          key={`dr${k}`}
          points={pts.map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(" ")}
          fill="none"
          stroke={tone}
          strokeWidth={10 * s}
          strokeLinecap="round"
          strokeLinejoin="round"
        />,
      );
    }
  }
  if (spec.hair === "long") {
    const a0 = add(add(j.HC, j.hu, R + 2 * s), j.hf, -4 * s);
    const a1 = add(add(j.HC, j.hu, 4 * s), j.hf, -(R + 10 * s));
    const sw = swing * 1.2 - bounce;
    const tip = (len: number, side: number) => {
      const ang = (-fc * 14 + sw * 0.9) * RAD;
      return add(add(a1, v(Math.sin(ang), Math.cos(ang)), len * s), j.hf, side * s);
    };
    hairBack.push(<Poly key="long" pts={[a0, a1, tip(150, -10), tip(160, 30), add(j.HC, j.hf, 12 * s)]} c={tone} round={26 * s} />);
  }
  if (spec.hair === "bob") {
    hairTop.push(<ellipse key="bob" cx={j.HC.x} cy={j.HC.y + 4 * s} rx={R + 10 * s} ry={R + 7 * s} fill={tone} />);
  }

  const face =
    spec.view !== "front" ? (
      <g key="face">
        <Poly
          pts={[add(add(j.HC, j.hf, R - 4 * s), j.hu, 6 * s), add(add(j.HC, j.hf, R + 9 * s), j.hu, -6 * s), add(add(j.HC, j.hf, R - 3 * s), j.hu, -14 * s)]}
          c={tone}
          round={5 * s}
        />
        <Dot p={add(add(j.HC, j.hf, 20 * s), j.hu, -30 * s)} r={17 * s} c={tone} />
      </g>
    ) : null;

  return (
    <g filter={`url(#${spec.filter ?? "rim"})`}>
      {hairBack}
      {arm(j.shB, j.elB, j.wrB, "ab")}
      {leg(j.hipB, j.knB, j.anB, j.toB, true)}
      {spec.skirt ? leg(j.hipF, j.knF, j.anF, j.toF, false) : null}
      {torso}
      {skirt}
      {spec.skirt ? null : leg(j.hipF, j.knF, j.anF, j.toF, false)}
      {spec.shorts ? <Dot p={j.P} r={36 * b} c={bottom} /> : null}
      {spec.shorts ? <Seg a={j.P} b={add(j.P, j.tu, 46 * s)} w={84 * b} c={top} /> : null}
      {arm(j.shF, j.elF, j.wrF, "af")}
      <ellipse cx={j.HC.x} cy={j.HC.y} rx={R * 0.96} ry={R * 1.08} fill={tone} transform={`rotate(${(Math.atan2(j.hu.x, -j.hu.y) / RAD).toFixed(2)} ${j.HC.x.toFixed(1)} ${j.HC.y.toFixed(1)})`} />
      {face}
      {hairTop}
    </g>
  );
};

/** Soft contact shadow under a figure (drawn before it, outside its filter). */
export const FootShadow: React.FC<{ spec: FigureSpec; f: number }> = ({ spec, f }) => {
  if (spec.shadow === false) return null;
  const j = solve(spec, livePose(spec, f));
  const x = (j.anF.x + j.anB.x) / 2;
  return <ellipse cx={x} cy={spec.floor} rx={105 * spec.scale} ry={17 * spec.scale} fill="rgba(30,4,24,0.42)" />;
};

/** Head-centre of a figure at frame f (used to aim the camera and FX). */
export const headOf = (spec: FigureSpec, f: number): V => solve(spec, livePose(spec, f)).HC;
/** Front wrist of a figure at frame f. */
export const handOf = (spec: FigureSpec, f: number): V => solve(spec, livePose(spec, f)).wrF;
