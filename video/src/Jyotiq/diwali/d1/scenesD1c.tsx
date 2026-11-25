import React from "react";
import { World } from "../../manthan/kit";
import { Motes } from "../../manthan/sets";
import { H, ramp, rnd, W, wob } from "../../manthan/style";
import { JewellerCounter } from "./counter";
import { DiyaDefs, DiyaRow, slotX } from "./diya";
import { HealthBeat, HealthDefs } from "./health";
import { MarketStall } from "./market";
import { D1Defs } from "./scenesD1a";
import { BEATS, CUES, SCENES } from "./timing";
import { YamrajDefs, YamrajSilhouette } from "./yamraj";

/* Diwali Day 1 scenes, part C: line 06 (a whip montage through the counter and the stall, then three health
   shots cut on the words, then diya 1 lights on 'सेहत'), the persistent diya-row layer (it becomes the series'
   progress bar at the top through 07-08 and drops into the end card under tomorrow's Yamraj tease), and the
   backgrounds for the kundali (07), the app (08) and the end card. */

const cue = (k: string, dflt: number): number => (typeof CUES[k] === "number" ? CUES[k] : dflt);

/** Whip offset and blur around a cut at `at`: the outgoing shot flies left, the incoming one arrives from the right. */
const whipAt = (f: number, at: number, span = 5): { dx: number; blur: number } => {
  if (f < at - span || f >= at + span) return { dx: 0, blur: 0 };
  if (f < at) {
    const k = ramp(f, at - span, at, "in");
    return { dx: -520 * k, blur: 60 * k };
  }
  const k = 1 - ramp(f, at, at + span, "out");
  return { dx: 520 * k, blur: 60 * k };
};

const Whip: React.FC<{ dx: number; blur: number; id: string; children: React.ReactNode }> = ({ dx, blur, id, children }) => (
  <g>
    {blur > 0.5 ? (
      <filter id={id} x="-20%" y="0%" width="140%" height="100%">
        <feGaussianBlur stdDeviation={`${blur.toFixed(1)} 0`} />
      </filter>
    ) : null}
    <g transform={`translate(${dx} 0)`} filter={blur > 0.5 ? `url(#${id})` : undefined}>
      {children}
    </g>
  </g>
);

/** A warm dark night sky for the diya beats. */
const WarmNight: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <defs>
      <radialGradient id="d1WarmNight" cx="0.5" cy="0.55" r="0.75">
        <stop offset="0" stopColor="#4A2414" />
        <stop offset="0.5" stopColor="#24120E" />
        <stop offset="1" stopColor="#0C0808" />
      </radialGradient>
    </defs>
    <rect x={-40} y={-40} width={W + 80} height={H + 80} fill="url(#d1WarmNight)" />
    <Motes f={f} n={36} seed="d1wn" color="#FFD27A" dir={-1} speed={0.5} size={3} o={0.6} />
  </g>
);

/** A starry indigo sky for the kundali and the end card. */
export const StarNight: React.FC<{ f: number; warm?: number }> = ({ f, warm = 0 }) => (
  <g>
    <defs>
      <linearGradient id="d1StarNight" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0A0818" />
        <stop offset="0.6" stopColor="#1A1236" />
        <stop offset="1" stopColor="#24102A" />
      </linearGradient>
      <radialGradient id="d1StarWarm" cx="0.5" cy="0.45" r="0.6">
        <stop offset="0" stopColor="#FFB45A" stopOpacity="0.28" />
        <stop offset="1" stopColor="#FFB45A" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect x={-40} y={-40} width={W + 80} height={H + 80} fill="url(#d1StarNight)" />
    {Array.from({ length: 70 }, (_, i) => (
      <circle key={i} cx={rnd(`st${i}x`) * W} cy={rnd(`st${i}y`) * H * 0.9} r={1 + rnd(`st${i}r`) * 2.2} fill="#FFF6E0" opacity={0.25 + 0.6 * (0.5 + 0.5 * wob(`st${i}`, f / 12))} />
    ))}
    <rect x={-40} y={-40} width={W + 80} height={H + 80} fill="url(#d1StarWarm)" opacity={warm} />
    <Motes f={f} n={24} seed="d1sn" color="#FFE6A3" dir={-1} speed={0.4} size={2.6} o={0.5} />
  </g>
);

/* ------------------------------------------------------------------ */
/* 06: whip montage, health shots, diya 1 on 'सेहत'                     */
/* ------------------------------------------------------------------ */

export const HealthD1: React.FC<{ f: number }> = ({ f }) => {
  const [a] = SCENES.health;
  const J = cue("jo06", a + 37);
  const C = cue("cap06b", a + 94);
  const N = cue("nivesh", a + 131);
  const A = cue("apni06", a + 155);
  const S = cue("sehat06", a + 171);
  const wJ = whipAt(f, J);
  const wC = whipAt(f, C);
  const flash = (at: number) => (f >= at && f < at + 4 ? 1 - (f - at) / 4 : 0);
  const fl = Math.max(flash(N), flash(A), flash(S));
  let shot: React.ReactNode;
  if (f < J) {
    shot = (
      <Whip dx={wJ.dx} blur={wJ.blur} id="d1wj0">
        <JewellerCounter f={f} push={0.35 + 0.2 * ramp(f, a, J, "lin")} reach={1} glint={0.05} />
      </Whip>
    );
  } else if (f < C) {
    const w = f < J + 5 ? wJ : wC;
    shot = (
      <Whip dx={w.dx} blur={w.blur} id="d1wj1">
        <MarketStall f={f} lift={1} shine={0.8} push={ramp(f, J, C, "lin")} />
      </Whip>
    );
  } else if (f < S) {
    const beat = (f < N ? 0 : f < A ? 1 : 2) as 0 | 1 | 2;
    const span: [number, number] = beat === 0 ? [C, N] : beat === 1 ? [N, A] : [A, S];
    const k = ramp(f, span[0], span[1], "lin");
    const w = beat === 0 ? wC : { dx: 0, blur: 0 };
    shot = (
      <Whip dx={w.dx} blur={w.blur} id="d1wj2">
        <HealthBeat f={f} beat={beat} k={k} />
      </Whip>
    );
  } else {
    shot = <WarmNight f={f} />;
  }
  return (
    <World>
      <D1Defs />
      <HealthDefs />
      {shot}
      {fl > 0 ? <rect width={W} height={H} fill="#FFF4D6" opacity={0.55 * fl} /> : null}
    </World>
  );
};

/* ------------------------------------------------------------------ */
/* The diya row as one persistent layer from 'सेहत' to the last frame   */
/* ------------------------------------------------------------------ */

export const RowLayerD1: React.FC<{ f: number }> = ({ f }) => {
  const S = cue("sehat06", 1255);
  const IG = BEATS.ignite ?? [1274, 1289];
  const SO = cue("signoff", 1642);
  if (f < S - 2) return null;
  const inK = ramp(f, S - 2, S + 4, "out");
  const lit = ramp(f, S + 2, S + 14, "out");
  const toTop = ramp(f, IG[1] - 8, IG[1] + 10, "io");
  const toEnd = ramp(f, SO - 14, SO + 6, "io");
  const y = 1000 + (230 - 1000) * toTop + (700 - 230) * toEnd;
  const sc = 0.95 + (0.55 - 0.95) * toTop + (0.8 - 0.55) * toEnd;
  const labels = 1 - toTop + toEnd;
  const arrow = ramp(f, S + 10, S + 24, "io") * (1 - ramp(f, IG[1] - 10, IG[1] - 2, "in"));
  const sehat = toTop < 0.5;
  // the arrow from diya 1 (सेहत) over to diya 3 (धन), drawn in row space
  const ax0 = slotX(0);
  const ax1 = slotX(2);
  const ay = y - 120 * (sc / 0.9);
  const len = (ax1 - ax0) * arrow;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, opacity: inK }}>
      <DiyaDefs />
      <g transform={`translate(540 ${y}) scale(${sc / 0.9}) translate(-540 ${-y})`}>
        <DiyaRow
          f={f}
          y={y}
          lit={[lit, 0, 0, 0, 0]}
          labels={Math.max(0, Math.min(1, labels))}
          labelText={sehat ? ["सेहत", null, "धन", null, null] : []}
          highlight={toEnd > 0.01 ? 1 : sehat ? 0 : -1}
          hl={toEnd > 0.01 ? 0.6 * toEnd : sehat ? 0.5 * lit : 0}
        />
      </g>
      {arrow > 0.01 ? (
        <g opacity={Math.min(1, arrow * 3)}>
          <path d={`M${ax0 + 40} ${ay}Q${(ax0 + ax1) / 2} ${ay - 90} ${ax0 + 40 + len * 0.86} ${ay}`} stroke="#FFC94D" strokeWidth={7} fill="none" strokeLinecap="round" />
          {arrow > 0.9 ? <path d={`M${ax1 - 40} ${ay - 22}L${ax1 - 12} ${ay + 2}L${ax1 - 46} ${ay + 14}`} stroke="#FFC94D" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
        </g>
      ) : null}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Backgrounds for 07, 08 and the end card                              */
/* ------------------------------------------------------------------ */

export const KundaliBedD1: React.FC<{ f: number }> = ({ f }) => (
  <World>
    <StarNight f={f} warm={0.6 + 0.4 * Math.sin(f / 30)} />
  </World>
);

export const AppBedD1: React.FC<{ f: number }> = ({ f }) => (
  <World>
    <D1Defs />
    <WarmNight f={f} />
    {Array.from({ length: 16 }, (_, i) => (
      <circle key={i} cx={rnd(`ab${i}x`) * W + Math.sin(f / 40 + i) * 14} cy={200 + ((rnd(`ab${i}y`) * 1500 - f * (0.5 + 0.4 * rnd(`ab${i}v`)) + 3000) % 1500)} r={24 + rnd(`ab${i}r`) * 50} fill="url(#c1Bokeh)" opacity={0.25 + 0.2 * wob(`ab${i}`, f / 14)} />
    ))}
  </World>
);

export const EndBedD1: React.FC<{ f: number }> = ({ f }) => {
  const SO = cue("signoff", 1642);
  const y = ramp(f, SO - 6, SO + 14, "out");
  return (
    <World>
      <YamrajDefs />
      <StarNight f={f} warm={0.3} />
      <g transform={`translate(${slotX(1) - 6} ${640 - 4 * (1 - y)}) scale(0.62)`}>
        <YamrajSilhouette f={f} k={0.9 * y} />
      </g>
    </World>
  );
};
