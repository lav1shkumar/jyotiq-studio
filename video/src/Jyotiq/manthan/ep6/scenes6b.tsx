import React from "react";
import { World } from "../kit";
import { pose, Puppet } from "../rig";
import { Kalash, KshiraSagar, Motes, Vignette } from "../sets";
import { H, ramp, track, W } from "../style";
import { CUES, LINES, SCENES } from "./timing";
import { DhanvantariStanding } from "./dhanvantari";
import { talk6 } from "./kit6";
import { BrawlCloud } from "./props6";

/*
 * Scenes 2-4: Dhanvantari rises, Bali claims the amrit, the snatch and the brawl.
 * Part 1: DhanvantariScene. The sea parts in a gold swirl; Dhanvantari rises out of it (clipped at the foam
 * line) holding the amrit kalash at his chest, with god-rays behind him and a slow push-in.
 */

export const Swirl6: React.FC<{ f: number; x: number; y: number; k: number }> = ({ f, x, y, k }) => {
  if (k <= 0.01) return null;
  return (
    <g transform={`translate(${x} ${y})`} opacity={k}>
      <ellipse rx={420} ry={90} fill="#FFD36B" opacity={0.28} filter="url(#mBlur8)" />
      {[0, 1, 2, 3].map((i) => (
        <ellipse key={i} rx={110 + i * 80} ry={24 + i * 17} fill="none" stroke={i % 2 ? "#FFE6A3" : "#FFFFFF"} strokeWidth={5 - i} strokeDasharray={`${60 + i * 20} ${40 + i * 10}`} strokeDashoffset={-f * (8 - i)} opacity={0.8 - i * 0.15} />
      ))}
    </g>
  );
};

const Rays: React.FC<{ x: number; y: number; k: number; f: number }> = ({ x, y, k, f }) => (
  <g transform={`translate(${x} ${y}) rotate(${f * 0.3})`} opacity={0.5 * k}>
    {Array.from({ length: 14 }, (_, i) => (
      <path key={i} d="M-26 0L26 0L120 -900L-120 -900Z" transform={`rotate(${i * (360 / 14)})`} fill="#FFE6A3" opacity={0.18} />
    ))}
  </g>
);

const Spray: React.FC<{ f: number; at: number; x: number; y: number }> = ({ f, at, x, y }) => {
  const t = f - at;
  if (t < 0 || t > 36) return null;
  return (
    <g>
      {Array.from({ length: 18 }, (_, i) => {
        const a = Math.PI * (1.05 + (0.9 * i) / 17);
        const v = 10 + (i % 4) * 4;
        return <circle key={i} cx={x + Math.cos(a) * v * t} cy={y + Math.sin(a) * v * t + 0.35 * t * t} r={9 - t / 5} fill="#FFFFFF" opacity={1 - t / 36} />;
      })}
    </g>
  );
};

export const DhanvantariScene: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.dhanvantari;
  const z = track(f, [[a, 1.0], [b, 1.06, "io"]]);
  const swirl = ramp(f, a - 6, a + 10, "out");
  const rise = ramp(f, a + 6, CUES.dhanvantari + 6, "out");
  const s = 0.9;
  const footY = 2320 - 820 * rise; // feet end at y 1500
  const glow = 0.6 + 0.4 * Math.sin(f / 9);
  return (
    <World>
      <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
        <KshiraSagar f={f} cam={{ x: 0, y: 0, z: 1 }} glow={0.6} swell={0.4} />
        <rect width={W} height={H} fill="#0C0A1C" opacity={0.25} />
        <Rays x={540} y={1200} k={rise} f={f} />
        <Swirl6 f={f} x={540} y={1520} k={swirl} />
        <clipPath id="dh6-water">
          <rect x={0} y={0} width={W} height={1525} />
        </clipPath>
        <g clipPath="url(#dh6-water)">
          <g transform={`translate(540 ${footY}) scale(${s})`}>
            <DhanvantariStanding t={f} smile={0.45} halo={0.9 * rise} handL={[-36, -110]} handR={[36, -110]} />
          </g>
          <g transform={`translate(540 ${footY - 392})`}>
            <circle r={110} fill="#FFE08A" opacity={0.35 * glow * rise} filter="url(#mBlur8)" />
            <Kalash f={f} glow={0.7 + 0.3 * glow} s={0.61} />
          </g>
        </g>
        <ellipse cx={540} cy={1522} rx={300 * (0.6 + 0.4 * swirl)} ry={34} fill="#FFFFFF" opacity={0.7 * swirl} />
        <Spray f={f} at={a + 6} x={540} y={1520} />
        <Motes f={f} n={34} seed="dh6m" color="#FFE6A3" dir={-1} speed={0.7} size={3} o={0.7} />
      </g>
      <Vignette o={0.6} />
    </World>
  );
};

/** Dhanvantari standing with the kalash at his chest, feet at (x, y), scale s (kalash placed to match). */
export const DhanWithKalash: React.FC<{ f: number; x: number; y: number; s: number; halo?: number; kalash?: number }> = ({ f, x, y, s, halo = 0.8, kalash = 1 }) => (
  <g>
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <DhanvantariStanding t={f} smile={0.4} halo={halo} handL={[-36, -110]} handR={[36, -110]} />
    </g>
    {kalash > 0.01 ? (
      <g transform={`translate(${x} ${y - 435.6 * s})`} opacity={kalash}>
        <Kalash f={f} glow={0.9} s={0.677 * s} />
      </g>
    ) : null}
  </g>
);

/* Part 2: BaliScene. Bali strides in from the left ('रुको!'), asuras behind him, and points at the kalash
   in Dhanvantari's hands on 'असुरों का है!'. */
export const BaliScene: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.bali;
  const z = track(f, [[a, 1.22], [b, 1.3, "io"]]);
  const walk = ramp(f, a, CUES.ruko + 4, "out");
  const bx = 60 + 320 * walk;
  const point = ramp(f, CUES.asur03 - 4, CUES.asur03 + 4, "out");
  const step = Math.sin(walk * Math.PI * 4) * 10 * (1 - walk);
  return (
    <World>
      <g transform={`translate(470 1080) scale(${z}) translate(-470 -1180)`}>
        <KshiraSagar f={f} cam={{ x: 0, y: 0, z: 1 }} glow={0.5} swell={0.4} />
        <rect width={W} height={H} fill="#0C0A1C" opacity={0.25} />
        <DhanWithKalash f={f} x={800} y={1480} s={0.55} />
        <Puppet id="ba1" who="asura" at={{ x: 150, y: 1300, s: 0.95, facing: 1 }} p={pose({ fist: 1, browTilt: 12, sF: 40 + 40 * point, eF: 40 })} t={f} />
        <Puppet id="ba2" who="asura" at={{ x: 290, y: 1290, s: 0.9, facing: 1 }} p={pose({ fist: 1, browTilt: 12, sF: 30, eF: 60 })} t={f} />
        <Puppet
          id="bbali"
          who="bali"
          at={{ x: bx, y: 1380 + step, s: 1.25, facing: 1 }}
          p={pose({ talk: talk6("03_bali", f), browTilt: 14, fist: 1 - point, sF: 40 + 50 * point, eF: 40 - 30 * point, lookX: 0.6 })}
          t={f}
        />
        <Motes f={f} n={20} seed="ba6m" color="#FFE6A3" dir={-1} speed={0.5} size={3} o={0.5} />
      </g>
      <Vignette o={0.65} />
    </World>
  );
};
export const BALI_LINE = LINES["03_bali"];

/* Part 3: BrawlScene. An asura lunges and snatches the kalash on 'छीन' (whoosh, Dhanvantari steps back and
   fades), then on 'आपस' the asuras pile in: a cartoon brawl cloud with the kalash bobbing on top, a shake on
   'लड़', worried Indra at the edge. The freeze itself is the next scene's first frame. */
export const BrawlScene: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.brawl;
  const z = track(f, [[a, 1.1], [b, 1.2, "io"]]);
  const lunge = ramp(f, a, CUES.chheen, "in");
  const snatch = ramp(f, CUES.chheen, CUES.chheen + 7, "out");
  const dhanGone = ramp(f, CUES.chheen + 2, CUES.chheen + 16, "in");
  const cloud = ramp(f, CUES.aapas - 6, CUES.aapas + 4, "out");
  const cloudPop = track(f - (CUES.aapas - 6), [[0, 0.3], [8, 1.12, "out"], [13, 1, "io"]]);
  const shake = f >= CUES.lad ? Math.sin(f * 2.1) * 9 * (1 - ramp(f, CUES.lad, CUES.lad + 30)) : 0;
  const ax = 100 + 420 * lunge;
  const from: [number, number] = [700, 1480 - 435.6 * 0.75];
  const to: [number, number] = [ax + 80, 1420 - 450];
  const kx = from[0] + (to[0] - from[0]) * snatch;
  const ky = from[1] + (to[1] - from[1]) * snatch - 60 * Math.sin(Math.PI * snatch);
  const indra = ramp(f, CUES.aapas, CUES.aapas + 10, "out");
  return (
    <World>
      <g transform={`translate(${540 + shake} 1080) scale(${z}) translate(-540 -1180)`}>
        <KshiraSagar f={f} cam={{ x: 0, y: 0, z: 1 }} glow={0.4} swell={0.5} />
        <rect width={W} height={H} fill="#0C0A1C" opacity={0.3} />
        <g opacity={1 - dhanGone} transform={`translate(${30 * dhanGone} 0)`}>
          <DhanWithKalash f={f} x={700} y={1480} s={0.75} kalash={0} />
        </g>
        <g opacity={1 - cloud}>
          <Puppet id="bra" who="asura" at={{ x: ax, y: 1420, s: 1.1, facing: 1 }} p={pose({ sF: 90 + 75 * snatch, eF: 20, fist: snatch, browTilt: 14, smile: 0.6 * snatch })} t={f} />
        </g>
        {cloud < 0.99 ? (
          <g opacity={1 - cloud}>
            {snatch > 0 && snatch < 1 ? <path d={`M${from[0]} ${from[1]}Q${(from[0] + kx) / 2} ${Math.min(from[1], ky) - 60} ${kx} ${ky}`} stroke="#FFE6A3" strokeWidth={14} opacity={0.5} fill="none" strokeLinecap="round" /> : null}
            <g transform={`translate(${kx} ${ky})`}>
              <Kalash f={f} glow={1} s={0.5} />
            </g>
          </g>
        ) : null}
        {cloud > 0.01 ? (
          <g opacity={cloud} transform={`translate(540 1300) scale(${cloudPop}) translate(-540 -1300)`}>
            <BrawlCloud x={540} y={1300} s={1.6} f={f}>
              <Kalash f={f} glow={0.9} s={0.55} />
            </BrawlCloud>
          </g>
        ) : null}
        <g opacity={indra}>
          <Puppet id="bri" who="indra" at={{ x: 890, y: 1440, s: 0.95, facing: -1 }} p={pose({ browTilt: -10, brow: 0.6, lookX: -0.8, sF: 30, eF: 70 })} t={f} />
        </g>
      </g>
      <Vignette o={0.7} />
    </World>
  );
};
