import React from "react";
import { World } from "../kit";
import { handToWorld, pose } from "../rig";
import { Motes, Stars, Vignette } from "../sets";
import { H, ramp, track, W } from "../style";
import { TitleScene } from "../scenesA";
import { Kailash } from "../ep3/kailash";
import { KailashBg } from "./kailash4";
import { PoisonOrb, ShivaSeated, Trishul } from "./cast4";
import { CUES } from "./timing";

/* Episode 4 scenes, part A: the hook (continues Episode 3's last shot) and the title bed. */

/** Mahadev's place on Kailash: scale 0.8, waist at (560, 1434): the throat sits on Episode 3's
 * silhouette throat (560, 1264) and the pelt on its base. */
export const SH_AT = { x: 560, y: 1434, s: 0.8, facing: 1 };
export const PALM_POSE = { sF: 58, eF: 92, wF: -30, head: -4, lookX: 0.4 };
export const palmWorld = () => handToWorld(pose({ sF: 18, eF: -10, wF: -6, sB: -16, eB: 44, wB: 10, ...PALM_POSE }), SH_AT, true);

/** Poison ribbons streaming in from the edges of the frame to a point. */
export const PoisonStreams: React.FC<{ f: number; to: [number, number]; k?: number; n?: number; spread?: number }> = ({ f, to, k = 1, n = 7, spread = 900 }) => (
  <g fill="none" strokeLinecap="round" opacity={k}>
    {Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 + 0.4;
      const x0 = to[0] + Math.cos(a) * spread;
      const y0 = to[1] + Math.sin(a) * spread * 0.8;
      const cx = to[0] + Math.cos(a + 1.1) * spread * 0.45;
      const cy = to[1] + Math.sin(a + 1.1) * spread * 0.35;
      const d = `M${x0} ${y0}Q${cx} ${cy} ${to[0]} ${to[1]}`;
      return (
        <g key={i}>
          <path d={d} stroke="#0E1E3A" strokeWidth={18} opacity={0.55} />
          <path d={d} stroke={i % 2 ? "#40D8E8" : "#9888D8"} strokeWidth={6} strokeDasharray="60 90" strokeDashoffset={-f * 9 - i * 37} opacity={0.85} />
        </g>
      );
    })}
  </g>
);

export const Hook: React.FC<{ f: number }> = ({ f }) => {
  const FLASH = CUES.palmFlash;
  if (f < FLASH) {
    // frame 0 is exactly Episode 3's last story shot; the camera accelerates into the glowing throat
    // while the night lifts off him and the silhouette turns into Mahadev in colour
    const z = track(f, [[0, 1.0], [FLASH, 2.35, "in"]]);
    const sx = track(f, [[0, 560], [FLASH, 540, "io"]]);
    const sy = track(f, [[0, 1264], [FLASH, 1310, "io"]]);
    const colour = ramp(f, 20, 56, "io");
    const pre = ramp(f, FLASH - 5, FLASH);
    return (
      <World>
        <g transform={`translate(${sx} ${sy}) scale(${z}) translate(-560 -1264)`}>
          <Kailash f={f} throat={1} moon={1} rim={1} id="h4" />
          {/* lift the night so frame 0 never reads as black: moonlight wash + a stronger throat bloom */}
          <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#34448A" opacity={0.38 * (1 - colour)} style={{ mixBlendMode: "screen" }} />
          <circle cx={720} cy={360} r={330} fill="#FFF1C8" opacity={0.14 * (1 - colour)} filter="url(#mBlur8)" />
          <circle cx={560} cy={1264} r={90} fill="#40D8E8" opacity={0.35 * (0.8 + 0.2 * Math.sin(f / 5))} filter="url(#mBlur8)" />
          <g opacity={colour}>
            <KailashBg f={f} id="h4b" />
            <g transform="translate(712 1530) scale(0.8)">
              <Trishul f={f} glow={0.3} />
            </g>
            <ShivaSeated id="sh4" f={f} {...SH_AT} eyes={0} throat={0.75} halo={0.6} />
          </g>
        </g>
        <Vignette o={0.5} />
        <rect width={W} height={H} fill="#E6FDFF" opacity={0.9 * pre} />
      </World>
    );
  }
  // flash-forward: the poison already blazing in his raised palm
  const t = f - FLASH;
  const [px, py] = palmWorld();
  const orbY = py - 30;
  const z = track(t, [[0, 2.5], [80, 2.85, "out"]]);
  const flash = 1 - ramp(t, 0, 8, "out");
  const sx = 540 + Math.sin(f / 9) * 4;
  const sy = 1290 + Math.cos(f / 11) * 3;
  return (
    <World>
      <defs>
        <radialGradient id="h4storm" cx="0.5" cy="0.62" r="0.7">
          <stop offset="0" stopColor="#1C4A72" />
          <stop offset="0.45" stopColor="#141A40" />
          <stop offset="1" stopColor="#070A1C" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#h4storm)" />
      <Stars f={f} n={60} y1={1920} seed="h4ff" o={0.6} />
      <g transform={`translate(${sx} ${sy}) scale(${z}) translate(${-px} ${-orbY})`}>
        <PoisonStreams f={f} to={[px, orbY]} k={0.9} spread={420} />
        <ShivaSeated id="sh4" f={f} {...SH_AT} eyes={0} throat={0} halo={0.3} p={PALM_POSE} prop={<PoisonOrb f={f} k={1.6} />} />
        <circle cx={px} cy={orbY} r={60} fill="#40D8E8" opacity={0.2 + 0.08 * Math.sin(f / 3)} filter="url(#mBlur8)" />
      </g>
      <Motes f={f} n={40} seed="h4m" color="#40D8E8" dir={-1} speed={0.8} size={3} o={0.6} />
      {/* the flash-forward look: a cool grade and a soft edge */}
      <rect width={W} height={H} fill="#40D8E8" opacity={0.08} />
      <Vignette o={0.75} />
      <rect width={W} height={H} fill="#E6FDFF" opacity={0.9 * flash} />
    </World>
  );
};

/** The series title bed, exactly Episode 1's (the title card itself is an overlay). */
export const TitleBed = TitleScene;
