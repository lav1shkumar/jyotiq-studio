import React from "react";
import { shake, World } from "../kit";
import { blinkAt, idle, pose, Puppet } from "../rig";
import { Layer, Vignette } from "../sets";
import { ramp, rnd } from "../style";
import { coil, headAngle, Mandar, mandarHalfW, runs, SerpentBody, spline, V2, VasukiHead } from "./beings2";
import { VishnuStanding } from "./beings3";
import { CH, FoamSkirt } from "./churn";
import { camOn, lerpCam } from "./scenes2A";
import { ChurnSea } from "./sets2";
import { mouth } from "./talk2";
import { CUES } from "./timing";

/* Episode 2: Vasuki (1815-2157).
   1815-1960 he bursts up out of the ocean of milk beside the distant mountain: "Main Naagraj Vasuki..."
   1960-2157 on "rassi" he spirals up Mandar, head leading; then the camera pushes in on his head:
             "Par amrit mein mera bhi bhaag hoga." - eyes and gem flare on the share, hot smoke curls. */

/** Foreground milk over the lower frame, so a body can rise out of it. */
const MilkFront: React.FC<{ f: number; y: number }> = ({ f, y }) => {
  const wave = (yy: number, a: number, ph: number) =>
    new Array(13)
      .fill(0)
      .map((_, j) => `${j ? "L" : "M"}${-100 + j * 110} ${(yy + Math.sin(f / 18 + j * 0.9 + ph) * a).toFixed(1)}`)
      .join("");
  const d = wave(y, 16, 0);
  return (
    <g>
      <path d={`${d}L1220 2100L-100 2100Z`} fill="#EFE9E0" />
      <path d={d} stroke="#FFFFFF" strokeWidth={8} fill="none" />
      <path d={d} transform="translate(0 16)" stroke="#9A90C0" strokeWidth={4} fill="none" opacity={0.5} />
      {[140, 300].map((dy, i) => (
        <g key={dy}>
          <path d={wave(y + dy, 22 + i * 6, 1.7 + i)} stroke="#FFFFFF" strokeWidth={6} fill="none" opacity={0.8} />
          <path d={wave(y + dy, 22 + i * 6, 1.7 + i)} transform="translate(0 14)" stroke="#9A90C0" strokeWidth={3} fill="none" opacity={0.4} />
        </g>
      ))}
    </g>
  );
};

const Spray: React.FC<{ t: number; x: number; y: number }> = ({ t, x, y }) => (
  <g>
    {new Array(22).fill(0).map((_, i) => {
      const vx = (rnd(`sp${i}`) - 0.5) * 22;
      const vy = 18 + rnd(`spy${i}`) * 26;
      const px = x + vx * t;
      const py = y - vy * t + 0.9 * t * t;
      if (py > y + 30) return null;
      return <circle key={i} cx={px} cy={py} r={5 + rnd(`spr${i}`) * 10} fill="#FFFFFF" opacity={Math.max(0, 1 - t / 34)} />;
    })}
  </g>
);

export const VasukiRise: React.FC<{ f: number }> = ({ f }) => {
  const r0 = CUES.vasukiRise;
  const up = ramp(f, r0, r0 + 30, "out");
  const sway = Math.sin((f - r0) / 22) * 14 * up;
  const cam = { x: 0, y: 40, z: 1.12 + 0.06 * ramp(f, r0, 1960) };
  const hy = 1560 - 820 * up + Math.sin((f - r0) / 30) * 8;
  const head: V2 = { x: 640 + sway, y: hy };
  // Starts far below the surface so the body's thin tail taper never shows.
  const body = spline(
    [{ x: 900, y: 2600 }, { x: 820, y: 2150 }, { x: 740, y: 1800 }, { x: 690, y: 1520 }, { x: 610 - sway * 0.3, y: hy + 420 }, { x: 650 + sway * 0.6, y: hy + 200 }, head],
    90,
  );
  const sp = mouth("vasuki", f);
  const t = f - r0 + 2;
  return (
    <World>
      <ChurnSea f={f} cam={cam} storm={0.15} glow={0.55} />
      <Layer cam={cam} depth={0.49}>
        <g transform="translate(300 1110) scale(0.45 0.55)">
          <Mandar t={f} glow={0.5} />
        </g>
      </Layer>
      <SerpentBody s={body} R={46} />
      <VasukiHead at={head} ang={headAngle(body)} s={1.5} t={f} eye={0.6 + 0.4 * up + 0.3 * sp} tongue={0.15 + 0.7 * sp} smoke={0.25 + 0.3 * sp} gem={up} hood={0.4 + 0.6 * up} />
      <MilkFront f={f} y={1470} />
      <ellipse cx={690} cy={1492} rx={170 * up} ry={26 * up} fill="none" stroke="#FFFFFF" strokeWidth={7} opacity={up} />
      <ellipse cx={690} cy={1504} rx={190 * up} ry={30 * up} fill="none" stroke="#9A90C0" strokeWidth={4} opacity={0.5 * up} />
      {t > 0 && t < 40 ? <Spray t={t} x={690} y={1490} /> : null}
      <Vignette o={0.85} />
    </World>
  );
};

/* ------------------------------------------------------------------ */

/** Vasuki's full path for the coil: tail in the sea (right), the helix round Mandar, the head end up at the left. */
const coilPath = () => {
  const hw = (y: number) => CH.MSX * mandarHalfW((y - CH.MY) / CH.MSY);
  const hx = coil(CH.MX, CH.yTop, CH.yBot, hw, CH.turns, 220, Math.PI / 2);
  const exitR = hx.pts[0];
  const exitL = hx.pts[hx.pts.length - 1];
  const tail = spline([{ x: 1180, y: 1400 }, { x: 980, y: 1395 }, { x: 830, y: 1330 }, exitR], 60).slice(0, -1);
  const lead = spline(
    [exitL, { x: 410, y: 900 }, { x: 330, y: 1080 }, { x: 262, y: 1250 }, { x: 200, y: 1300 }, { x: 160, y: 1200 }, { x: 178, y: 1050 }, { x: 208, y: 950 }],
    90,
  ).slice(1);
  return { body: [...tail, ...hx.pts, ...lead], front: [...tail.map(() => true), ...hx.front, ...lead.map(() => true)], h0: tail.length, h1: tail.length + hx.pts.length - 1 };
};
const PATH = coilPath();

export const VasukiCoil: React.FC<{ f: number }> = ({ f }) => {
  const k = ramp(f, CUES.coil - 8, CUES.coil + 40, "io");
  const push = ramp(f, 2016, 2140, "io");
  const cam = lerpCam(camOn(560, 1000, 1.05), camOn(270, 960, 2.15), push);
  const { body, front, h0, h1 } = PATH;
  const hi = Math.max(3, Math.round(k * (body.length - 1)));
  const vis = body.slice(0, hi + 1);
  const helixEnd = Math.min(h1, hi);
  const hr = hi > h0 ? runs(front.slice(h0, helixEnd + 1)).map((r) => ({ ...r, i0: r.i0 + h0, i1: r.i1 + h0 })) : [];
  const headBehind = hi > h0 && hi < h1 && !front[hi];
  const sp = mouth("vasuki", f);
  const share = ramp(f, CUES.share, CUES.share + 10);
  const head = (
    <VasukiHead
      at={body[hi]}
      ang={headAngle(vis)}
      s={0.7}
      t={f}
      eye={0.7 + 0.3 * share + 0.2 * sp}
      tongue={0.15 + 0.7 * sp}
      smoke={0.25 + 0.5 * share}
      gem={0.6 + 0.4 * share}
    />
  );
  return (
    <World>
      <ChurnSea f={f} cam={cam} storm={0.2} glow={0.5} swirl={0.6 * k} cx={CH.MX} cy={CH.MY} swirlDepth={CH.depth} />
      <Layer cam={cam} depth={CH.depth}>
        {hr
          .filter((r) => !r.front)
          .map((r) => (
            <SerpentBody key={`b${r.i0}`} s={body} i0={r.i0} i1={r.i1} R={CH.R} />
          ))}
        {headBehind ? head : null}
        <g transform={`translate(${CH.MX} ${CH.MY}) scale(${CH.MSX} ${CH.MSY})`}>
          <Mandar t={f} glow={0.5} />
        </g>
        {hr
          .filter((r) => r.front)
          .map((r) => (
            <SerpentBody key={`f${r.i0}`} s={body} i0={r.i0} i1={r.i1} R={CH.R} />
          ))}
        <FoamSkirt f={f} cx={CH.MX} cy={CH.MY} rx={CH.MSX * 270} />
        <SerpentBody s={body} i0={0} i1={Math.min(h0, hi)} R={CH.R} />
        {hi > h1 ? <SerpentBody s={body} i0={h1} i1={hi} R={CH.R} /> : null}
        {!headBehind ? head : null}
      </Layer>
      <Vignette o={0.85} />
    </World>
  );
};

/* ------------------------------------------------------------------ */
/* 2157-2199 Vishnu takes the head; 2199-2526 Swarbhanu's demand        */
/* ------------------------------------------------------------------ */

const Ledge: React.FC<{ y: number }> = ({ y }) => {
  const top = `M-60 ${y}L180 ${y - 14}L420 ${y + 4}L700 ${y - 10}L1140 ${y + 6}`;
  return (
    <g>
      <path d={`${top}L1140 2100L-60 2100Z`} fill="#231C33" />
      <path d={top} stroke="#54476E" strokeWidth={6} fill="none" strokeLinejoin="round" />
    </g>
  );
};

/** Silent beat: Vishnu's lower hands close on Vasuki's neck; Indra and Surya fall in behind him. */
export const HeadTake: React.FC<{ f: number }> = ({ f }) => {
  const h0 = CUES.headTake;
  const grip = ramp(f, h0 + 2, h0 + 14, "io");
  const fall = ramp(f, h0, h0 + 26, "out");
  const look = ramp(f, h0 + 6, h0 + 16, "io");
  const cam = { x: 0, y: 160, z: 1.25 };
  // relaxed [-140,-96]/[140,-96] -> on the neck (upper-body coordinates of VishnuStanding)
  const hL: [number, number] = [-140 + 69 * grip, -96 + 44 * grip];
  const hR: [number, number] = [140 - 81 * grip, -96 + 138 * grip];
  const head: V2 = { x: 300, y: 800 + 10 * Math.sin(f / 20) };
  const neck = spline([{ x: 1500, y: 2700 }, { x: 1250, y: 2150 }, { x: 900, y: 1560 }, { x: 590, y: 1330 }, { x: 480, y: 1250 }, { x: 330, y: 1010 }, head], 90);
  const helper = (who: "indra" | "surya", x: number, s: number, hold: boolean, seed: string) => (
    <Puppet
      id={`ht-${seed}`}
      who={who}
      at={{ x, y: 1600 - 252 * s, s, facing: -1 }}
      p={pose({ ...idle(seed, f, 0.4), blink: blinkAt(seed, f), sF: hold ? 64 : 12, eF: hold ? 20 : 16, sB: hold ? 58 : -4, eB: hold ? 24 : 12, fist: hold ? 1 : 0, lookX: 0.7, browTilt: 2 })}
      t={f}
    />
  );
  return (
    <World>
      <ChurnSea f={f} cam={cam} storm={0.2} glow={0.5} />
      <Layer cam={cam} depth={0.49}>
        <g transform="translate(880 1110) scale(0.4 0.5)">
          <Mandar t={f} glow={0.5} />
        </g>
      </Layer>
      <Ledge y={1590} />
      <SerpentBody s={neck} R={44} />
      {helper("surya", 1020 - 120 * fall, 0.58, false, "hs")}
      {helper("indra", 900 - 120 * fall, 0.6, fall > 0.9, "hi")}
      <g transform="translate(540 1600) scale(0.85)">
        <VishnuStanding t={f} smile={0.6} halo={0.9} handL={hL} handR={hR} />
      </g>
      {/* samples between his hands (control points 3 and 4 of the neck) cross in front of him */}
      <g opacity={grip}>
        <SerpentBody s={neck} i0={46} i1={58} R={44} />
      </g>
      <VasukiHead at={head} ang={headAngle(neck) + 14 * look} s={1.25} t={f} eye={0.8} tongue={0.3 + 0.5 * Math.max(0, Math.sin(f / 5))} smoke={0.3} />
      <Vignette o={0.85} />
    </World>
  );
};

/** Faint gold vision of his fate: an eclipse ring round his head, smoke where the neck should be. */
const RahuGhost: React.FC<{ x: number; y: number; s: number; o: number }> = ({ x, y, s, o }) => (
  <g opacity={o}>
    <circle cx={x} cy={y - 20 * s} r={150 * s} fill="none" stroke="#FFD36B" strokeWidth={5} />
    <circle cx={x} cy={y - 20 * s} r={164 * s} fill="none" stroke="#FFD36B" strokeWidth={2} strokeDasharray="6 10" />
    {[-2, -1, 0, 1, 2].map((k) => (
      <path
        key={k}
        d={`M${x + k * 16 * s} ${y + 60 * s}c${8 * s} ${30 * s} ${-8 * s} ${50 * s} ${k * 10 * s} ${90 * s}`}
        stroke="#FFD36B"
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
    ))}
  </g>
);

const SW_D = { x: 520, y: 1620 - 252 * 1.4, s: 1.4, facing: -1 };
const FLICKER = [0.5, 0.1, 0.6, 0.2, 0.45, 0, 0.35, 0];

/** "Ruko! Sir devta pakdenge... aur ashubh poonchh asur? Hum kuleen hain, Vedon ke gyaata hain!" + "Sir hamara hoga!" */
export const Demand: React.FC<{ f: number }> = ({ f }) => {
  const d0 = CUES.demand;
  const shout = ramp(f, CUES.shout2 - 4, CUES.shout2 + 6, "out");
  const z = 1 + 0.08 * ramp(f, d0, CUES.shout2 - 10) + 0.5 * shout;
  const [sx, sy] = shake(f, CUES.shout2, 12, 10);
  const pointK = ramp(f, d0, d0 + 8, "out") - ramp(f, CUES.tail - 6, CUES.tail + 4);
  const tailK = ramp(f, CUES.tail - 6, CUES.tail + 4) - ramp(f, CUES.noble - 8, CUES.noble);
  const noble = ramp(f, CUES.noble - 8, CUES.noble + 4) - ramp(f, CUES.shout2 - 6, CUES.shout2);
  const p = pose({
    ...idle("sw-d", f, 0.5),
    blink: blinkAt("sw-d", f),
    lean: 4 * pointK - 6 * noble + 8 * shout,
    head: -3 * noble - 4 * shout,
    // point at the devtas; flick back at the tail on "poonchh"; hand on chest on "kuleen"; fist up on "Sir hamara hoga!"
    sF: 24 + 76 * pointK + 6 * noble + 130 * shout,
    eF: 40 - 36 * pointK + 80 * noble - 30 * shout,
    wF: -8,
    sB: -10 - 30 * tailK,
    eB: 40 + 50 * tailK,
    fist: 0.6 * pointK + shout,
    browTilt: 16 + 6 * shout - 8 * noble,
    brow: 0.4 * tailK,
    smile: -0.3 + 0.6 * tailK + 0.3 * noble,
    glow: 0.3 + 0.6 * shout,
    lookX: 0.8,
    talk: mouth("swarbhanu", f),
  });
  const ft = f - CUES.rahuFlicker;
  const fl = ft >= 0 && ft < FLICKER.length * 4 ? FLICKER[Math.floor(ft / 4)] : 0;
  const cam = { x: 120, y: 200, z: 1.3 };
  const nod = Math.max(0, Math.sin((f - d0) / 9)) * 3 * noble;
  return (
    <World dx={sx} dy={sy}>
      <ChurnSea f={f} cam={cam} storm={0.3} glow={0.5} />
      <Layer cam={cam} depth={0.49}>
        <g transform="translate(260 1110) scale(0.4 0.5)">
          <Mandar t={f} glow={0.5} />
        </g>
      </Layer>
      <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
        <Ledge y={1600} />
        <Puppet id="dm-jade" who="asuraJade" at={{ x: 960, y: 1600 - 252 * 0.7, s: 0.7, facing: -1 }} p={pose({ ...idle("dmj", f, 0.4), blink: blinkAt("dmj", f), browTilt: 14, head: nod, lookX: 0.6 })} t={f} />
        <Puppet id="dm-bali" who="bali" at={{ x: 865, y: 1600 - 252 * 0.75, s: 0.75, facing: -1 }} p={pose({ ...idle("dmb", f, 0.4), blink: blinkAt("dmb", f), browTilt: 8, head: nod, lookX: 0.6, sF: 20, eF: 60 })} t={f} />
        <Puppet id="dm-sw" who="swarbhanu" at={SW_D} p={p} t={f} />
        {fl > 0 ? <RahuGhost x={SW_D.x - 29 * SW_D.s} y={SW_D.y - 289 * SW_D.s} s={SW_D.s} o={fl} /> : null}
      </g>
      <Vignette o={0.9} />
    </World>
  );
};
