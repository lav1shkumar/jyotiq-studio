import React from "react";
import { World } from "../kit";
import { pose, Puppet } from "../rig";
import { Kalash, KshiraSagar, Motes, Vignette } from "../sets";
import { H, ramp, track, W } from "../style";
import { BEATS, CUES, SCENES } from "./timing";

/*
 * Scene 1 (hook) and the title bed.
 * Hook: a flash-forward, lit from frame 0 (never black): Bali holds the amrit kalash high among cheering
 * asuras, the kalash is the one lit element, darkness around. On 'बूंद' the kalash dissolves into gold
 * sparks out of his hands (the paradox: they had it, yet not one drop). On 'क्यों?' the frame freezes and
 * a Kaal time-rewind (reverse streaks, a clock ring spinning back) carries us to the title bed.
 * Title bed: Episode 5's last story frame (EndBed5's night sea with the risen, glowing kalash), undimmed.
 */

const Sparks: React.FC<{ f: number; at: number; x: number; y: number }> = ({ f, at, x, y }) => {
  const t = f - at;
  if (t < 0 || t > 40) return null;
  return (
    <g>
      {Array.from({ length: 22 }, (_, i) => {
        const a = (i / 22) * Math.PI * 2 + i * 0.37;
        const v = 9 + (i % 5) * 3;
        const d = v * t * (1 - t / 90);
        return <circle key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d + 0.12 * t * t} r={6 - t / 8} fill={i % 3 ? "#FFD36B" : "#FFF3C9"} opacity={1 - t / 40} />;
      })}
      <circle cx={x} cy={y} r={60 + t * 6} fill="#FFE6A3" opacity={Math.max(0, 0.6 - t / 20)} filter="url(#mBlur8)" />
    </g>
  );
};

/** The Kaal rewind: streaks rushing inward and a clock ring spinning backwards; k 0..1. */
export const Rewind: React.FC<{ f: number; k: number }> = ({ f, k }) => {
  if (k <= 0.01) return null;
  return (
    <g opacity={k}>
      <rect width={W} height={H} fill="#0C0A1C" opacity={0.35 * k} />
      {Array.from({ length: 28 }, (_, i) => {
        const a = (i / 28) * Math.PI * 2;
        const r0 = 900 - ((f * 40 + i * 37) % 700);
        return <path key={i} d={`M${540 + Math.cos(a) * r0} ${960 + Math.sin(a) * r0}L${540 + Math.cos(a) * (r0 + 160)} ${960 + Math.sin(a) * (r0 + 160)}`} stroke="#CDB8FF" strokeWidth={4} opacity={0.5} strokeLinecap="round" />;
      })}
      <g transform={`translate(540 960) rotate(${-f * 14})`}>
        <circle r={330} fill="none" stroke="#FFD36B" strokeWidth={6} opacity={0.8} />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d="M0 -330L0 -296" stroke="#FFD36B" strokeWidth={8} transform={`rotate(${i * 30})`} />
        ))}
        <path d="M0 0L0 -250" stroke="#FFF3C9" strokeWidth={10} strokeLinecap="round" />
        <path d="M0 0L170 0" stroke="#FFF3C9" strokeWidth={14} strokeLinecap="round" transform={`rotate(${f * 40})`} />
      </g>
    </g>
  );
};

export const Hook6: React.FC<{ f: number }> = ({ f }) => {
  const [, b] = SCENES.hook;
  const z = track(f, [[0, 1.0], [CUES.kyon, 1.09, "io"]]);
  const gone = ramp(f, CUES.boond, CUES.boond + 10, "out");
  const freeze = ramp(f, CUES.kyon, CUES.kyon + 6, "out");
  const ff = f < CUES.kyon ? f : CUES.kyon; // freeze the world on 'क्यों?'
  const rw = ramp(f, b - 16, b, "in");
  const kx = 635;
  const ky = 390;
  return (
    <div style={{ position: "absolute", inset: 0, filter: `saturate(${1 - 0.6 * freeze}) brightness(${1 - 0.15 * freeze})` }}>
      <World>
        <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
          <KshiraSagar f={ff} cam={{ x: 0, y: 0, z: 1 }} glow={0.25} swell={0.5} />
          <rect width={W} height={H} fill="#0C0A1C" opacity={0.5} />
          {/* the one lit element: the kalash glow, held high in Bali's raised fist above the hook plate */}
          <circle cx={kx} cy={ky} r={300} fill="#FFD36B" opacity={0.42 * (1 - 0.7 * gone)} filter="url(#mBlur8)" />
          {/* Bali in the middle distance (head and fist above the plate), cheering asuras in the foreground */}
          <Puppet id="hbali" who="bali" at={{ x: 540, y: 970, s: 1.3, facing: 1 }} p={pose({ sF: 165, eF: 10, fist: 1, smile: 0.8 * (1 - gone), browTilt: 10 * gone, lookY: -0.8 })} t={ff} />
          <g opacity={1 - gone} transform={`translate(${kx} ${ky + 40})`}>
            <Kalash f={ff} glow={1} s={0.5} />
          </g>
          <Puppet id="ha1" who="asura" at={{ x: 170, y: 1640, s: 1.2, facing: 1 }} p={pose({ sF: 150 - 30 * gone, eF: 20, fist: 1, smile: 0.7 * (1 - gone), lookY: -0.7 })} t={ff} />
          <Puppet id="ha2" who="asura" at={{ x: 910, y: 1640, s: 1.2, facing: -1 }} p={pose({ sF: 140 - 30 * gone, eF: 30, fist: 1, smile: 0.7 * (1 - gone), lookY: -0.7 })} t={ff} />
          <Sparks f={f} at={CUES.boond} x={kx} y={ky} />
          <Motes f={ff} n={30} seed="h6m" color="#FFE6A3" dir={-1} speed={0.6} size={3} o={0.6} />
        </g>
        <Rewind f={f} k={rw} />
        <Vignette o={0.8} />
      </World>
    </div>
  );
};

export const TitleBed6: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.title;
  const z = track(f, [[a, 1.07], [b + 6, 1.1, "io"]]);
  const gold = 0.6 + 0.4 * Math.sin(f / 14);
  const rw = 1 - ramp(f, BEATS.rewind[0], BEATS.rewind[0] + 12, "out");
  return (
    <World>
      <KshiraSagar f={f} cam={{ x: 0, y: 0, z }} glow={0.5} swell={0.3} />
      <ellipse cx={540} cy={1580} rx={520} ry={170} fill="#FFD36B" opacity={0.35 * gold} filter="url(#mBlur8)" />
      <clipPath id="tb6-water">
        <rect x={0} y={0} width={W} height={1620} />
      </clipPath>
      <g clipPath="url(#tb6-water)" opacity={0.85}>
        <g transform="translate(540 1580) scale(1.1)">
          <Kalash f={f} glow={0.6 + 0.4 * gold} />
        </g>
      </g>
      <Motes f={f} n={36} seed="tb6m" color="#FFE6A3" dir={-1} speed={0.5} size={3} o={0.7} />
      <Rewind f={f} k={rw} />
      <Vignette o={0.7} />
    </World>
  );
};
