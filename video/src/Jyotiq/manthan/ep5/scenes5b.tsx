import React from "react";
import { shake, World } from "../kit";
import { idle, pose, Puppet, Who } from "../rig";
import { Cam, CAM0, KshiraSagar, Motes, Vignette } from "../sets";
import { ramp, rnd, track, W } from "../style";
import { ChurnStage } from "../ep3/stage3";
import { Kamadhenu, Uchchaihshravas } from "./beasts5";
import { GURU, RISHI } from "./cast5";
import { talk5 } from "./kit5";
import { CUES, LINES, SCENES } from "./timing";

/* Episode 5 scenes, part B: the ocean starts giving its treasures (line 02), Kamadhenu rises to the
   rishis, and Uchchaihshravas bursts out of a wave for Bali to claim (line 03). Faces stay above the
   caption band (y 1280-1420). */

/** A ring of foam where something breaks the milk surface. */
export const Foam: React.FC<{ f: number; x: number; y: number; w: number; o: number }> = ({ f, x, y, w, o }) =>
  o > 0.01 ? (
    <g opacity={o}>
      <ellipse cx={x} cy={y} rx={w} ry={w * 0.16} fill="#FFFFFF" opacity={0.85} />
      {new Array(9).fill(0).map((_, i) => {
        const a = (i / 9) * Math.PI * 2 + f / 10;
        return <circle key={i} cx={x + Math.cos(a) * w * 0.95} cy={y + Math.sin(a) * w * 0.15} r={w * 0.08} fill="#F4F1EA" />;
      })}
    </g>
  ) : null;

/** A burst of milk-white spray thrown up from (x, y) at frame `at` (40 frames). */
export const Splash: React.FC<{ f: number; at: number; x: number; y: number; s?: number }> = ({ f, at, x, y, s = 1 }) => {
  const t = f - at;
  if (t < 0 || t > 40) return null;
  const k = t / 40;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={1 - k * k}>
      {[-60, -30, 0, 30, 60].map((a, i) => (
        <path
          key={i}
          d={`M-30 0C-40 ${-120 * (0.4 + k)} -10 ${-260 * (0.5 + k)} 0 ${-300 * (0.5 + k * 0.8)}C10 ${-260 * (0.5 + k)} 40 ${-120 * (0.4 + k)} 30 0Z`}
          transform={`rotate(${a * (0.6 + 0.6 * k)})`}
          fill="#FFFFFF"
          opacity={0.75}
        />
      ))}
      {new Array(22).fill(0).map((_, i) => {
        const ang = -Math.PI / 2 + (rnd(`sp${i}`) - 0.5) * 2.4;
        const sp = 9 + rnd(`spv${i}`) * 9;
        return <circle key={i} cx={Math.cos(ang) * sp * t} cy={Math.sin(ang) * sp * t + 0.45 * t * t} r={4 + rnd(`spr${i}`) * 6} fill="#FFFFFF" />;
      })}
    </g>
  );
};

/** Treasures surfacing in the churn: pillars of light breaking the surface one after another. */
const PILLARS = [
  { x: 250, d: 0, c: "#FFE6A3" },
  { x: 820, d: 8, c: "#FFD6E8" },
  { x: 430, d: 16, c: "#D6F0FF" },
  { x: 660, d: 24, c: "#FFF3C9" },
];

const RISHIS: { who: Who; x: number }[] = [
  { who: RISHI, x: 770 },
  { who: GURU, x: 885 },
  { who: "durvasa", x: 1000 },
];

/** 206-394: the churn glows and gives up its gems; then Kamadhenu rises and goes to the rishis. */
export const RatnaScene: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.ratna;
  const cut = CUES.kamdhenu - 4;
  if (f < cut) {
    const z = track(f, [[a, 1.0], [CUES.ratna, 1.06, "io"], [cut, 1.2, "in"]]);
    const cam: Cam = { x: 0, y: 60 * ramp(f, CUES.ratna, cut, "io"), z };
    const glow = 0.45 + 0.55 * ramp(f, a, CUES.ratna + 10, "io");
    return (
      <World>
        <ChurnStage f={f} cam={cam} fx={{ heave: 0.7, spin: 0.45 * Math.sin(f / 13), glow, vasuki: { eye: 1 } }} />
        {PILLARS.map((p, i) => {
          const k = ramp(f, CUES.ratna + p.d, CUES.ratna + p.d + 12, "out");
          const tw = 0.6 + 0.4 * Math.sin(f / 4 + i);
          return k > 0 ? (
            <g key={i} opacity={k}>
              <rect x={p.x - 45} y={1560 - 700 * k} width={90} height={700 * k} fill={p.c} opacity={0.5} filter="url(#mBlur8)" />
              <g transform={`translate(${p.x} ${1560 - 700 * k}) scale(${1.0 + 0.6 * tw})`}>
                <path d="M0 -26L6 -6L26 0L6 6L0 26L-6 6L-26 0L-6 -6Z" fill="#FFFFFF" />
              </g>
            </g>
          ) : null;
        })}
        <Motes f={f} n={36} seed="rt5" color="#FFE6A3" dir={-1} speed={0.6} size={3} o={0.75} />
        <Vignette o={0.6} />
      </World>
    );
  }
  const t = f - cut;
  const groundY = 1470;
  const rise = ramp(t, 0, 22, "out");
  const walkK = ramp(f, CUES.kamdhenu + 18, b, "io");
  const cx = 300 + 170 * walkK;
  const greet = ramp(f, CUES.rishi - 6, CUES.rishi + 8, "out");
  const z = track(f, [[cut, 1.08], [b, 1.0, "out"]]);
  return (
    <World>
      <g transform={`translate(540 1200) scale(${z}) translate(-540 -1200)`}>
        <KshiraSagar f={f} cam={CAM0} glow={0.85} />
        <ellipse cx={cx + 40} cy={groundY - 140} rx={300} ry={230} fill="#FFE6A3" opacity={0.3 * (1 - 0.6 * walkK)} filter="url(#mBlur8)" />
        {RISHIS.map((r, i) => (
          <Puppet
            key={i}
            id={`rr${i}`}
            who={r.who}
            at={{ x: r.x, y: 1330, s: 0.72, facing: -1 }}
            p={pose({ ...idle(`rr${i}`, f), sF: 30 + 35 * greet, eF: 40 + 80 * greet, lean: 5 * greet, smile: 0.5 * greet, lookX: 0.7, lookY: 0.2 })}
            t={f}
          />
        ))}
        <clipPath id="kd5-clip">
          <rect x={0} y={0} width={W} height={groundY + 6} />
        </clipPath>
        <g clipPath="url(#kd5-clip)">
          <Kamadhenu id="kd5" f={f} x={cx} y={groundY + (1 - rise) * 330} s={0.95} walk={walkK > 0.02 && walkK < 0.98 ? 1 : 0} glow={1} />
        </g>
        <Foam f={f} x={cx + 40} y={groundY} w={170} o={1 - ramp(t, 16, 34)} />
        <Splash f={f} at={cut + 2} x={cx + 40} y={groundY} s={0.8} />
      </g>
      <Motes f={f} n={30} seed="kd5m" color="#FFF2C2" dir={-1} speed={0.4} size={2.6} o={0.7} />
      <Vignette o={0.55} />
    </World>
  );
};

/** 394-508: a wave bursts, the white horse leaps out rearing, and Bali strides in to claim it. */
export const HorseScene: React.FC<{ f: number }> = ({ f }) => {
  const [a] = SCENES.horse;
  const t = f - a;
  const groundY = 1560;
  const hx = 720;
  const rise = ramp(t, 0, 16, "out");
  const rear = track(t, [[0, 1], [24, 1, "io"], [60, 0.35, "io"], [114, 0.25]]);
  const [sx, sy] = shake(f, a, 14, 16);
  const z = track(t, [[0, 1.12], [114, 1.0, "out"]]);
  const inK = ramp(f, LINES["03_bali"][0] - 12, LINES["03_bali"][0] + 10, "out");
  const claim = ramp(f, CUES.mera - 6, CUES.mera + 4, "out");
  return (
    <World dx={sx} dy={sy}>
      <g transform={`translate(540 1300) scale(${z}) translate(-540 -1300)`}>
        <KshiraSagar f={f} cam={CAM0} glow={0.6} swell={0.6} />
        <clipPath id="uh5-clip">
          <rect x={0} y={0} width={W} height={groundY + 8} />
        </clipPath>
        <g clipPath="url(#uh5-clip)">
          <Uchchaihshravas id="uh5" f={f} x={hx} y={groundY + (1 - rise) * 420} s={1.15} facing={-1} rear={rear} wind={1} glow={1} />
        </g>
        <Foam f={f} x={hx} y={groundY} w={220} o={1 - ramp(t, 20, 44)} />
        <Splash f={f} at={a} x={hx} y={groundY} s={1.3} />
        <Puppet
          id="bali5"
          who="bali"
          at={{ x: -120 + 400 * inK, y: 1420, s: 0.95, facing: 1 }}
          p={pose({ ...idle("bali5", f), talk: talk5("03_bali", f), sF: 70 + 60 * claim, eF: 30 + 10 * claim, fist: claim, browTilt: 10, smile: 0.3, lookX: 0.9, lookY: -0.4 })}
          t={f}
        />
      </g>
      <Motes f={f} n={24} seed="hs5" color="#FFFFFF" dir={-1} speed={0.8} size={3} o={0.6} />
      <Vignette o={0.55} />
    </World>
  );
};
