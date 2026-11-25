import React from "react";
import { blinkAt, handToWorld, idle, Place, Pose, pose, Puppet, Who } from "../rig";
import { Cam, Layer } from "../sets";
import { coil, headAngle, Mandar, mandarHalfW, runs, SerpentBody, spline, V2, VasukiHead } from "./beings2";
import { VishnuStanding } from "./beings3";
import { ChurnSea } from "./sets2";

/* The churning line-up on the ocean of milk. Mandar stands in the sea with Vasuki coiled
   round it. The asuras hold the head end on the left shore (Swarbhanu outermost, Vasuki's
   head rearing over him); the devtas hold the tail on the right, Vishnu leading.
   Used by the cold open (flash-forward) and by the churn and sink scenes. */

// depth: the milk surface at the shore line sits at parallax depth ~0.66 in ChurnSea, so the whole line-up lives there.
// MSX/MSY: Mandar is drawn a little slimmer than its own proportions so both teams fit the 9:16 frame.
export const CH = { MX: 580, MY: 1330, MSX: 0.56, MSY: 0.74, yTop: 860, yBot: 1220, turns: 2.5, shore: 1330, R: 18, headS: 0.62, depth: 0.66 };

type Mem = { id: string; who: Who; x: number; s: number; face: 1 | -1 };
/** Asuras, mountain side first. They face the mountain (right). */
export const ASURA_LINE: Mem[] = [
  { id: "bali", who: "bali", x: 350, s: 0.44, face: 1 },
  { id: "swar", who: "swarbhanu", x: 200, s: 0.44, face: 1 },
];
/** Devtas behind Vishnu, mountain side first. They face the mountain (left). */
export const DEVA_LINE: Mem[] = [{ id: "indra", who: "indra", x: 880, s: 0.44, face: -1 }];
export const VISHNU = { x: 770, s: 0.43, handL: [-78, 0] as [number, number], handR: [78, -8] as [number, number] };

export type LineupOpts = {
  heave?: number; // 0..1 how hard the two sides take turns pulling
  drag?: number; // 0..1 everyone dragged toward the sinking mountain
  tilt?: number; // 0..1 the mountain tips and sinks
  crack?: number;
  talk?: Record<string, number>;
  smile?: Record<string, number>;
  alpha?: Record<string, number>; // per-member opacity, e.g. Swarbhanu dissolving
  over?: Record<string, Partial<Pose>>;
  vishnuSmile?: number;
  halo?: number;
  eye?: number;
  smoke?: number;
};

const pullPose = (seed: string, f: number, lean: number, extra: Partial<Pose>): Pose =>
  pose({ ...idle(seed, f, 0.5), blink: blinkAt(seed, f), lean, head: -4, sF: 50, eF: 14, wF: -8, sB: 44, eB: 20, wB: -6, fist: 1, browTilt: 12, lookX: 0.8, ...extra });

/** Geometry for one frame: member places and poses, the serpent's path and its head. */
export const lineup = (f: number, o: LineupOpts = {}) => {
  const heave = o.heave ?? 1;
  const drag = o.drag ?? 0;
  const tilt = o.tilt ?? 0;
  const pull = Math.sin((f / 75) * 2 * Math.PI) * heave; // + asuras pulling, - devtas pulling
  const slide = -8 * pull;
  const aLean = -20 - 9 * Math.max(0, pull) + 5 * Math.max(0, -pull) + 30 * drag;
  const dLean = -20 - 9 * Math.max(0, -pull) + 5 * Math.max(0, pull) + 30 * drag;
  const place = (m: Mem) => {
    const at: Place = { x: m.x + slide + m.face * 46 * drag, y: CH.shore - 245 * m.s, s: m.s, facing: m.face };
    const p = pullPose(m.id, f + (m.face === 1 ? 0 : 37), m.face === 1 ? aLean : dLean, {
      talk: o.talk?.[m.id] ?? 0,
      smile: o.smile?.[m.id] ?? 0,
      ...(o.over?.[m.id] ?? {}),
    });
    const h = handToWorld(p, at, true);
    return { ...m, at, p, hand: { x: h[0], y: h[1] } as V2 };
  };
  const asuras = ASURA_LINE.map(place);
  const devas = DEVA_LINE.map(place);
  const vx = VISHNU.x + slide - 46 * drag;
  const vL: V2 = { x: vx + VISHNU.s * VISHNU.handL[0], y: CH.shore + VISHNU.s * (VISHNU.handL[1] - 360) };
  const vR: V2 = { x: vx + VISHNU.s * VISHNU.handR[0], y: CH.shore + VISHNU.s * (VISHNU.handR[1] - 360) };

  // The mountain tips and sinks as it loses its footing (sink beat).
  const ang = tilt * 9;
  const sink = tilt * 110;
  const ca = Math.cos((ang * Math.PI) / 180);
  const sa = Math.sin((ang * Math.PI) / 180);
  const tp = (q: V2): V2 => ({
    x: CH.MX + (q.x - CH.MX) * ca - (q.y - CH.MY) * sa,
    y: CH.MY + (q.x - CH.MX) * sa + (q.y - CH.MY) * ca + sink,
  });
  const hw = (y: number) => CH.MSX * mandarHalfW((y - CH.MY) / CH.MSY);
  const hx = coil(CH.MX, CH.yTop, CH.yBot, hw, CH.turns, 220, Math.PI / 2 + 0.18 * pull);
  const helix = hx.pts.map(tp);
  const exitR = helix[0];
  const exitL = helix[helix.length - 1];

  // Tail: from the tip (beyond the last devta) in through every devta's hands and Vishnu's, to the coil.
  const last = devas[devas.length - 1];
  const tailCp: V2[] = [
    { x: last.at.x + 127, y: CH.shore - 40 },
    { x: last.at.x + 95, y: CH.shore - 25 },
    { x: last.at.x + 50, y: CH.shore - 80 },
    { x: last.at.x + 6, y: last.hand.y + 10 },
    ...devas.slice().reverse().map((d) => d.hand),
    vR,
    vL,
    { x: (vL.x + exitR.x) / 2, y: (vL.y + exitR.y) / 2 + 6 },
    exitR,
  ];
  const tail = spline(tailCp, 80).slice(0, -1);
  // Samples between Vishnu's hands (control points vR, vL): drawn in front of him so he visibly holds the tail.
  const seg = tailCp.length - 1;
  const kR = 4 + devas.length;
  const vFront: [number, number] = [Math.ceil((kR * 79) / seg) + 1, Math.floor(((kR + 1) * 79) / seg) - 1];

  // Head end: off the coil, down through the asuras' hands, then the neck rears up over Swarbhanu.
  const sw = asuras[asuras.length - 1];
  const sh = sw.hand;
  const leadCp: V2[] = [
    exitL,
    { x: exitL.x - 52, y: exitL.y + 46 },
    { x: asuras[0].hand.x - 4, y: asuras[0].hand.y - 96 },
    ...asuras.map((a) => a.hand),
    { x: sw.at.x - 15, y: sh.y + 11 },
    { x: sw.at.x - 85, y: sh.y - 11 },
    { x: sw.at.x - 120, y: sh.y - 81 },
    { x: sw.at.x - 112, y: sh.y - 141 },
    { x: sw.at.x - 108, y: sh.y - 165 },
  ];
  const lead = spline(leadCp, 110).slice(1);
  const body: V2[] = [...tail, ...helix, ...lead];
  const front: boolean[] = [...tail.map(() => true), ...hx.front, ...lead.map(() => true)];
  const h0 = tail.length;
  const h1 = tail.length + helix.length - 1;
  return { asuras, devas, vx, vL, vR, vFront, body, front, h0, h1, ang, sink, pull, head: body[body.length - 1], headAng: headAngle(body) };
};

const Shore: React.FC<{ x0: number; x1: number; y: number }> = ({ x0, x1, y }) => {
  const n = 7;
  const top = new Array(n + 1).fill(0).map((_, i) => {
    const x = x0 + ((x1 - x0) * i) / n;
    const dy = (i % 2 ? -7 : 3) + (i === 0 || i === n ? 10 : 0);
    return `${x.toFixed(0)} ${(y + dy).toFixed(0)}`;
  });
  return (
    <g>
      <path d={`M${top.join("L")}L${x1 - 26} ${y + 64}L${x0 + 16} ${y + 84}Z`} fill="#231C33" />
      <path d={`M${top.join("L")}`} stroke="#54476E" strokeWidth={5} fill="none" strokeLinejoin="round" />
      <path d={`M${x0 + 10} ${y + 80}Q${(x0 + x1) / 2} ${y + 96} ${x1 - 20} ${y + 62}`} stroke="#FFFFFF" strokeWidth={6} fill="none" opacity={0.85} strokeLinecap="round" />
    </g>
  );
};

/** Foam pool where the mountain meets the milk, with rings turning with the churn. */
export const FoamSkirt: React.FC<{ f: number; cx: number; cy: number; rx: number }> = ({ f, cx, cy, rx }) => (
  <g>
    <ellipse cx={cx} cy={cy + 6} rx={rx * 1.25} ry={rx * 0.22} fill="#F4EEF8" />
    <path d={`M${cx - rx * 1.25} ${cy + 6}A${rx * 1.25} ${rx * 0.22} 0 0 0 ${cx + rx * 1.25} ${cy + 6}`} stroke="#B7A6D6" strokeWidth={5} fill="none" />
    {[0, 1, 2].map((k) => (
      <ellipse
        key={k}
        cx={cx}
        cy={cy + 10 + k * 14}
        rx={rx * (1.35 + k * 0.28)}
        ry={rx * (0.25 + k * 0.06)}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={4 - k}
        strokeDasharray={`${60 - k * 10} ${34 + k * 8}`}
        strokeDashoffset={-(f * (3 - k))}
        opacity={0.85 - k * 0.2}
      />
    ))}
  </g>
);

export const ChurnLineup: React.FC<{
  f: number;
  cam: Cam;
  o?: LineupOpts;
  storm?: number;
  glow?: number;
  swirl?: number;
  children?: React.ReactNode;
}> = ({ f, cam, o = {}, storm = 0.3, glow = 0.4, swirl = 1, children }) => {
  const g = lineup(f, o);
  const hr = runs(g.front.slice(g.h0, g.h1 + 1)).map((r) => ({ ...r, i0: r.i0 + g.h0, i1: r.i1 + g.h0 }));
  return (
    <g>
      <ChurnSea f={f} cam={cam} storm={storm} swirl={swirl} glow={glow} cx={CH.MX} cy={CH.MY} swirlDepth={CH.depth} />
      <Layer cam={cam} depth={CH.depth}>
        {/* everything of the mountain and its coil below the waterline is under the milk */}
        <clipPath id="e2-water">
          <rect x={-3000} y={-4000} width={7000} height={4000 + CH.MY + 8} />
        </clipPath>
        <g clipPath="url(#e2-water)">
          {hr
            .filter((r) => !r.front)
            .map((r) => (
              <SerpentBody key={`b${r.i0}`} s={g.body} i0={r.i0} i1={r.i1} R={CH.R} />
            ))}
          <g transform={`translate(${CH.MX} ${CH.MY + g.sink}) rotate(${g.ang}) scale(${CH.MSX} ${CH.MSY})`}>
            <Mandar t={f} crack={o.crack ?? 0} glow={0.5 + 0.3 * glow} />
          </g>
          {hr
            .filter((r) => r.front)
            .map((r) => (
              <SerpentBody key={`f${r.i0}`} s={g.body} i0={r.i0} i1={r.i1} R={CH.R} />
            ))}
        </g>
        <FoamSkirt f={f} cx={CH.MX} cy={CH.MY} rx={CH.MSX * 270} />
        <Shore x0={-30} x1={450} y={CH.shore} />
        <Shore x0={690} x1={1110} y={CH.shore} />
        {/* the rope runs behind each body, so the hands drawn next read as gripping it */}
        <g clipPath="url(#e2-water)">
          <SerpentBody s={g.body} i0={0} i1={g.h0} R={CH.R} />
          <SerpentBody s={g.body} i0={g.h1} i1={g.body.length - 1} R={CH.R} />
        </g>
        {g.asuras.map((a) => (
          <g key={a.id} opacity={o.alpha?.[a.id] ?? 1}>
            <Puppet id={`ch-${a.id}`} who={a.who} at={a.at} p={a.p} t={f} />
          </g>
        ))}
        <g transform={`translate(${g.vx} ${CH.shore}) scale(${VISHNU.s})`} opacity={o.alpha?.vishnu ?? 1}>
          <VishnuStanding t={f} smile={o.vishnuSmile ?? 0.7} halo={o.halo ?? 0.9} handL={VISHNU.handL} handR={VISHNU.handR} speak={o.talk?.vishnu ?? 0} />
        </g>
        <g opacity={o.alpha?.vishnu ?? 1}>
          <SerpentBody s={g.body} i0={g.vFront[0]} i1={g.vFront[1]} R={CH.R} />
        </g>
        {g.devas.map((d) => (
          <g key={d.id} opacity={o.alpha?.[d.id] ?? 1}>
            <Puppet id={`ch-${d.id}`} who={d.who} at={d.at} p={d.p} t={f} />
          </g>
        ))}
        <VasukiHead at={g.head} ang={g.headAng} s={CH.headS} t={f} eye={o.eye ?? 0.8} tongue={0.3 + 0.3 * Math.max(0, Math.sin(f / 9))} smoke={o.smoke ?? 0} />
        {children}
      </Layer>
    </g>
  );
};
