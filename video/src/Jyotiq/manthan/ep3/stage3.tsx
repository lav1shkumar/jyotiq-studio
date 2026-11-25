import React from "react";
import { blinkAt, handToWorld, idle, Place, pose, Pose, Puppet, Who } from "../rig";
import { Cam, KshiraSagar, Layer } from "../sets";
import { Khadga, Parashu } from "../ep2/props";
import { coil, headAngle, Mandar, mandarHalfW, runs, SerpentBody, spline, V2, VasukiHead } from "../ep2/beings2";
import { KurmaFull } from "./kurma";
import { FireBreath, RainClouds, SmokeDrift } from "./fx";

/*
 * The churning stage, shared by every Episode 3 rope shot: the ocean of milk, Kurma's dome under
 * Mandar, Vasuki coiled round the mountain (coil phase animates = the churn), the asuras on the
 * LEFT at the head and the devtas on the RIGHT at the tail (Episode 2's layout), all drawn with
 * Episode 1/2 components. Vasuki's body is threaded through the front hands of each puppet.
 */

export const MX = 540;
export const MY = 1500; // Mandar's base
export const MS = 0.8;
const hw = (y: number) => MS * mandarHalfW((y - MY) / MS);

type Member = { who: Who; id: string; x: number; base: number; s: number; prop?: React.ReactNode };
const FRONT_L: Member[] = [
  { who: "asuraSlate", id: "aS", x: 400, base: 1770, s: 0.44 },
  { who: "swarbhanu", id: "sw", x: 280, base: 1790, s: 0.48 },
  { who: "bali", id: "ba", x: 150, base: 1810, s: 0.5 },
];
const BACK_L: Member[] = [
  { who: "asuraJade", id: "aJ", x: 330, base: 1690, s: 0.34, prop: <Khadga /> },
  { who: "asuraIron", id: "aI", x: 70, base: 1700, s: 0.34, prop: <Parashu /> },
];
const FRONT_R: Member[] = [
  { who: "agni", id: "ag", x: 680, base: 1770, s: 0.44 },
  { who: "surya", id: "su", x: 800, base: 1790, s: 0.48 },
  { who: "indra", id: "in", x: 930, base: 1810, s: 0.5 },
];
const BACK_R: Member[] = [
  { who: "chandra", id: "ch", x: 760, base: 1690, s: 0.34 },
  { who: "vayu", id: "va", x: 1010, base: 1700, s: 0.34 },
  { who: "deva", id: "de", x: 890, base: 1680, s: 0.32 },
];

const placeOf = (m: Member, facing: number): Place => ({ x: m.x, y: m.base - 245 * m.s, s: m.s, facing });

/** Pulling pose: lean back from the rope, both hands forward on it; heave 0..1. */
const pullPose = (seed: string, f: number, heave: number, extra?: Partial<Pose>): Pose =>
  pose({
    ...idle(seed, f, 0.6),
    lean: -10 - 12 * heave,
    head: -4 + 4 * heave,
    sF: 74,
    eF: 24,
    wF: -10,
    sB: 64,
    eB: 34,
    fist: 1,
    browTilt: 6 + 6 * heave,
    blink: blinkAt(seed, f),
    ...extra,
  });

const rot = (p: V2, deg: number, cx: number, cy: number): V2 => {
  const a = (deg * Math.PI) / 180;
  const dx = p.x - cx;
  const dy = p.y - cy;
  return { x: cx + dx * Math.cos(a) - dy * Math.sin(a), y: cy + dx * Math.sin(a) + dy * Math.cos(a) };
};

export type StageFx = {
  heat?: number; // smoke on the asura side 0..1
  fire?: number; // Vasuki's fire breath 0..1
  rain?: number; // cool clouds + rain over the devtas 0..1
  shell?: number; // Kurma's dome visible under Mandar 0..1
  sinkY?: number; // mountain + coil pushed down (px)
  tilt?: number; // mountain tilt (deg)
  spin?: number; // coil phase (radians); animate for the churn
  heave?: number; // 0..1 rope effort (both sides alternate around it)
  glow?: number; // ocean glow 0..1
  expr?: Partial<Record<string, Partial<Pose>>>; // per-member pose overrides by id
  fade?: Partial<Record<string, number>>; // per-member drain (smoke-greyed) by id
  vasuki?: { eye?: number; tongue?: number; smoke?: number; gem?: number };
};

export const ChurnStage: React.FC<{ f: number; cam: Cam; fx?: StageFx }> = ({ f, cam, fx = {} }) => {
  const { heat = 0, fire = 0, rain = 0, shell = 1, sinkY = 0, tilt = 0, spin = 0, heave = 0.5, glow = 0.3, expr = {}, fade = {}, vasuki = {} } = fx;
  const wave = Math.sin(f / 13);
  const hL = Math.max(0, Math.min(1, heave + 0.35 * wave));
  const hR = Math.max(0, Math.min(1, heave - 0.35 * wave));

  // puppets and their rope hands (world coordinates)
  const left = FRONT_L.map((m) => {
    const at = placeOf(m, 1);
    const p = pullPose(m.id, f, hL, expr[m.id]);
    const h = handToWorld(p, at, true);
    return { m, at, p, hand: { x: h[0], y: h[1] } as V2 };
  });
  const right = FRONT_R.map((m) => {
    const at = placeOf(m, -1);
    const p = pullPose(m.id, f, hR, expr[m.id]);
    const h = handToWorld(p, at, true);
    return { m, at, p, hand: { x: h[0], y: h[1] } as V2 };
  });

  // Vasuki: tail (right, off-frame) -> devta hands -> coil (bottom -> top) -> asura hands -> head (left)
  const yTop = MY - 0.55 * 1250 * MS;
  const yBot = MY - 0.1 * 1250 * MS;
  // 2.5 turns: the bottom end sits on the right (tail side), the top end on the left (head side).
  // spin should only rock back and forth (about +-0.6 rad) so the ends stay on their sides.
  const helix = coil(MX, yTop, yBot, hw, 2.5, 200, Math.PI / 2 + spin);
  const tf = (p: V2): V2 => {
    const r = rot(p, tilt, MX, MY);
    return { x: r.x, y: r.y + sinkY };
  };
  const hpts = helix.pts.map(tf);
  const c0 = hpts[0];
  const c1 = hpts[hpts.length - 1];
  const tail = spline([{ x: 1200, y: 1690 }, ...[...right].reverse().map((r) => r.hand), { x: c0.x + 40, y: c0.y + 60 }, c0], 70).slice(0, -1);
  // the head rears up above the asuras (clear of Swarbhanu's crown) and looks down at them
  const lead = spline([c1, { x: c1.x - 60, y: c1.y + 120 }, ...left.map((l) => l.hand), { x: 30, y: 1520 }, { x: 30, y: 1360 }, { x: 80, y: 1296 }, { x: 132, y: 1318 }], 90).slice(1);
  const BODY: V2[] = [...tail, ...hpts, ...lead];
  const FRONT: boolean[] = [...tail.map(() => true), ...helix.front, ...lead.map(() => true)];
  const RUNS = runs(FRONT);
  const head = BODY[BODY.length - 1];
  const hang = headAngle(BODY);
  const mouth = { x: head.x + 34, y: head.y + 30 };

  const drawMember = (r: { m: Member; at: Place; p: Pose }, facing: number) => (
    <Puppet key={r.m.id} id={`cs-${r.m.id}`} who={r.m.who} at={{ ...r.at, facing }} p={r.p} t={f} drain={fade[r.m.id] ?? 0} />
  );

  return (
    <g>
      <KshiraSagar f={f} cam={cam} glow={glow} />
      <Layer cam={cam} depth={0.75}>
        {/* the far half of the coil, behind the mountain */}
        {RUNS.filter((r) => !r.front).map((r) => (
          <SerpentBody key={`b${r.i0}`} s={BODY} i0={r.i0} i1={r.i1} R={26} />
        ))}
        <g transform={`translate(0 ${sinkY}) rotate(${tilt} ${MX} ${MY})`}>
          {shell > 0.01 ? (
            <g opacity={shell} transform={`translate(${MX} ${MY - 8}) scale(1.33)`}>
              <KurmaFull id="stage" t={f} glow={0.6} eye={1} mountain={false} />
            </g>
          ) : null}
          <g transform={`translate(${MX} ${MY}) scale(${MS})`}>
            <Mandar t={f} glow={0.6} />
          </g>
        </g>
        {/* milk in front of the base and the lower shell */}
        <path d={`M-100 ${MY + 110}C200 ${MY + 90 + wave * 6} 880 ${MY + 130 - wave * 6} 1180 ${MY + 106}L1180 2000L-100 2000Z`} fill="#EEE8F4" opacity={0.78} />
        <path d={`M-100 ${MY + 110}C200 ${MY + 90 + wave * 6} 880 ${MY + 130 - wave * 6} 1180 ${MY + 106}`} stroke="#FFFFFF" strokeWidth={5} fill="none" />
      </Layer>
      <Layer cam={cam} depth={0.9}>
        <RainClouds x0={600} y0={1300} w={480} h={460} f={f} o={rain} rain={rain} />
        {/* back rows */}
        {BACK_L.map((m) => (
          <Puppet key={m.id} id={`cs-${m.id}`} who={m.who} at={placeOf(m, 1)} p={pullPose(m.id, f, hL, { sF: 40, eF: 60, ...expr[m.id] })} t={f} prop={m.prop} drain={fade[m.id] ?? 0} />
        ))}
        {BACK_R.map((m) => (
          <Puppet key={m.id} id={`cs-${m.id}`} who={m.who} at={placeOf(m, -1)} p={pullPose(m.id, f, hR, { sF: 40, eF: 60, ...expr[m.id] })} t={f} drain={fade[m.id] ?? 0} />
        ))}
      </Layer>
      <Layer cam={cam} depth={1}>
        {/* rocky shores the two sides stand on */}
        <path d="M-60 1740C80 1716 260 1730 470 1790L470 2000L-60 2000Z" fill="#2A2240" />
        <path d="M-60 1740C80 1716 260 1730 470 1790" stroke="#4A3D66" strokeWidth={6} fill="none" />
        <path d="M1140 1740C1000 1716 820 1730 610 1790L610 2000L1140 2000Z" fill="#2A2240" />
        <path d="M1140 1740C1000 1716 820 1730 610 1790" stroke="#4A3D66" strokeWidth={6} fill="none" />
        {/* front of the coil and both rope runs */}
        {RUNS.filter((r) => r.front).map((r) => (
          <SerpentBody key={`f${r.i0}`} s={BODY} i0={r.i0} i1={r.i1} R={26} />
        ))}
        {left.map((r) => drawMember(r, 1))}
        {right.map((r) => drawMember(r, -1))}
        <VasukiHead at={head} ang={hang} s={0.62} t={f} eye={vasuki.eye ?? 1} tongue={vasuki.tongue ?? 0.3} smoke={vasuki.smoke ?? heat * 0.8} gem={vasuki.gem ?? 1} />
        <FireBreath x={mouth.x} y={mouth.y} ang={52} len={400} power={fire} f={f} seed="stagefire" />
        <SmokeDrift x0={0} y0={1300} w={520} h={420} density={heat} f={f} seed="stagesmoke" dir={1} />
      </Layer>
    </g>
  );
};
