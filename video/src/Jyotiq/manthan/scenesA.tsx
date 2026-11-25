import React from "react";
import { Eclipse, KundaliGrid, PlanArt } from "./graphics";
import { blinkAt, idle, Place, pose, Pose, Puppet } from "./rig";
import { AmritHall, Cam, Layer, Stars, Vignette } from "./sets";
import { H, P, ramp, track, W } from "./style";
import { CUES } from "./timing";
import { Lap, shake, World } from "./kit";

/* Scenes 1-3: hook, kundali/eclipse, title. */

/* ------------------------------------------------------------------ */
/* S1 HOOK - the disguised asura reaches for the amrit                 */
/* ------------------------------------------------------------------ */

export const Hook: React.FC<{ f: number }> = ({ f }) => {
  // anime freeze: the world nearly stops while the name card is up
  const fz = f < CUES.nameCard ? f : CUES.nameCard + (f - CUES.nameCard) * 0.06;
  const cam: Cam = {
    x: track(fz, [[0, 70], [40, 120, "out"], [150, 285, "io"]]),
    y: track(fz, [[0, 110], [40, 190, "out"], [150, 462, "io"]]),
    z: track(fz, [[0, 1.12], [40, 1.2, "out"], [150, 1.42, "io"]]),
  };
  const reach = ramp(fz, 8, 140, "io");
  const glow = ramp(fz, 126, 138) * (1 - ramp(f, 196, 210));
  const p: Pose = pose({
    ...idle("swb-hook", fz, 0.5),
    sF: 22 + 64 * reach,
    eF: 46 - 36 * reach,
    wF: -12 * reach,
    sB: -4,
    lean: 4 * reach,
    smile: 0.3 + 0.6 * ramp(fz, 96, 136),
    browTilt: 5 + 5 * glow,
    lookX: 0.9,
    lookY: 0.2,
    blink: blinkAt("swb", fz),
    glow,
  });
  const at: Place = { x: 850, y: 1560, s: 1.25, facing: -1 };
  const [sx, sy] = shake(f, CUES.nameCard, 10, 14);
  return (
    <World dx={sx} dy={sy}>
      <AmritHall f={fz} cam={cam} />
      <Layer cam={cam} depth={1}>
        <g transform={`translate(${at.x} ${at.y}) scale(${-at.s} ${at.s})`}>
          <Lap cloth="#E9D9A8" border="#C8902E" skin="#C99A6E" />
        </g>
        <Puppet id="hook-swb" who="swarbhanu" at={at} p={p} t={fz} disguise={0.82} noLegs />
      </Layer>
      {/* freeze tint */}
      <rect width={W} height={H} fill="#24163F" opacity={0.28 * ramp(f, CUES.nameCard, CUES.nameCard + 4) * (1 - ramp(f, 196, 206))} />
      <Vignette />
    </World>
  );
};

/* ------------------------------------------------------------------ */
/* S2 KUNDALI + S3 TITLE - the eclipse, and he lives in your chart      */
/* ------------------------------------------------------------------ */

export const Cosmos: React.FC<{ f: number; z?: number }> = ({ f, z = 1 }) => (
  <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
    <defs>
      <linearGradient id="mCosmos" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#07051A" />
        <stop offset="0.55" stopColor="#1B1040" />
        <stop offset="1" stopColor="#2A0F2E" />
      </linearGradient>
    </defs>
    <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="url(#mCosmos)" />
    <Stars f={f} n={120} y1={1920} seed="cos" o={0.9} />
    {/* Jyotiq orbit rings (the app's dasha-orbit motif) */}
    <g transform={`translate(540 980) rotate(${f * 0.35})`} opacity={0.35}>
      <circle r={430} fill="none" stroke={P.jGold} strokeWidth={2} />
      <circle r={470} fill="none" stroke={P.jGold} strokeWidth={1} strokeDasharray="4 14" />
      {new Array(12).fill(0).map((_, i) => (
        <g key={i} transform={`rotate(${i * 30}) translate(0 -450)`}>
          <circle r={6} fill={P.jGold} />
        </g>
      ))}
    </g>
  </g>
);

export const KundaliScene: React.FC<{ f: number }> = ({ f }) => {
  const e = ramp(f, 208, CUES.eclipse, "io");
  const d = ramp(f, 238, 292, "io");
  const g = ramp(f, CUES.eclipse, CUES.eclipse + 16);
  const z = track(f, [[204, 1.0], [336, 1.08, "io"]]);
  return (
    <World>
      <Cosmos f={f} z={z} />
      <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
        <Eclipse f={f} e={e} cx={540} cy={560} r={150} />
        <KundaliGrid f={f} cx={540} cy={1040} size={470} d={d} glyphs={g} />
      </g>
      <Vignette />
    </World>
  );
};

export const TitleScene: React.FC<{ f: number }> = ({ f }) => (
  <World>
    <Cosmos f={f} z={1.08 + ramp(f, 336, 400) * 0.04} />
    <g opacity={0.28}>
      <PlanArt f={f} d={1} x={540} y={1420} s={0.85} />
    </g>
    <rect width={W} height={H} fill="#0C0A07" opacity={0.35} />
    <Vignette />
  </World>
);

