import React from "react";
import { World } from "../kit";
import { pose, Puppet } from "../rig";
import { Kalash, KshiraSagar, Motes, Vignette } from "../sets";
import { H, ramp, track, W } from "../style";
import { BEATS, CUES, SCENES } from "./timing";
import { MohiniStanding } from "./mohini";
import { BrawlScene } from "./scenes6b";
import { talk6 } from "./kit6";

/*
 * Scenes 6-7: Mohini's entrance and her ask.
 * Part 1: MohiniScene. The brawl freezes mid-swing (time-stop ripple, colour drains); then soft pink-gold
 * light and falling petals, Mohini walks in from the right with a gentle sway, the dust clears and the
 * asuras stand frozen, turning to stare. The camera eases in on her as her name lands.
 */

export const Petals6: React.FC<{ f: number; k: number; n?: number; seed?: number }> = ({ f, k, n = 26, seed = 3 }) => {
  if (k <= 0.01) return null;
  return (
    <g opacity={k}>
      {Array.from({ length: n }, (_, i) => {
        const r = Math.sin(i * 91.7 + seed) * 0.5 + 0.5;
        const x = ((i * 137 + seed * 53) % 1080) + Math.sin(f / 23 + i) * 40;
        const y = ((f * (2.2 + 2 * r) + i * 211) % 2100) - 120;
        return <ellipse key={i} cx={x} cy={y} rx={9} ry={5} transform={`rotate(${(f * 3 + i * 40) % 360} ${x} ${y})`} fill={i % 3 ? "#F7A9C6" : "#FFE6A3"} opacity={0.85} />;
      })}
    </g>
  );
};

export const MOHINI_HANDS_WAIST: [[number, number], [number, number]] = [[-40, -420], [40, -420]];

export const MohiniScene: React.FC<{ f: number }> = ({ f }) => {
  const [, b] = SCENES.mohini;
  const fz = BEATS.freeze[0];
  const ripple = f - fz;
  const swap = ramp(f, CUES.tabhi, CUES.adbhut, "io");
  const walk = ramp(f, CUES.tabhi, CUES.mohini - 6, "out");
  const mx = 1020 - 400 * walk;
  const sway = Math.sin(f / 7) * 2 * (1 - walk * 0.7);
  const z = track(f, [[CUES.mohini - 10, 1.0], [b, 1.18, "io"]]);
  const light = ramp(f, CUES.tabhi - 4, CUES.tabhi + 14, "out");
  const stare = ramp(f, CUES.adbhut, CUES.adbhut + 10, "out");
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {swap < 0.99 ? (
        <div style={{ position: "absolute", inset: 0, filter: `saturate(${0.25}) brightness(0.85)`, opacity: 1 - swap }}>
          <BrawlScene f={fz - 1} />
        </div>
      ) : null}
      {ripple >= 0 && ripple < 24 ? (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
          <circle cx={540} cy={1200} r={60 + ripple * 60} fill="none" stroke="#FFFFFF" strokeWidth={10 - ripple * 0.4} opacity={1 - ripple / 24} />
        </svg>
      ) : null}
      {swap > 0.01 ? (
        <div style={{ position: "absolute", inset: 0, opacity: swap }}>
          <World>
            <g transform={`translate(${mx} 1100) scale(${z}) translate(${-mx} -1100)`}>
              <KshiraSagar f={f} cam={{ x: 0, y: 0, z: 1 }} glow={0.5} swell={0.3} />
              <rect width={W} height={H} fill="#1A0F2A" opacity={0.3} />
              <ellipse cx={mx} cy={1150} rx={420} ry={700} fill="#FFD6E8" opacity={0.25 * light} filter="url(#mBlur8)" />
              <Puppet id="ma1" who="asura" at={{ x: 140, y: 1500, s: 1.05, facing: 1 }} p={pose({ brow: 0.6 * stare, lookX: 0.8 * stare, smile: 0.2 * stare })} t={f} />
              <Puppet id="ma2" who="bali" at={{ x: 290, y: 1470, s: 1.1, facing: 1 }} p={pose({ brow: 0.7 * stare, lookX: 0.8 * stare, smile: 0.25 * stare })} t={f} />
              <Puppet id="ma3" who="asura" at={{ x: 420, y: 1520, s: 1.0, facing: 1 }} p={pose({ brow: 0.6 * stare, lookX: 0.8 * stare, smile: 0.2 * stare })} t={f} />
              <g transform={`rotate(${sway} ${mx} 1820)`}>
                <MohiniStanding id="mo6" f={f} x={mx} y={1820} s={1.05} hands={MOHINI_HANDS_WAIST} smile={0.55} lookX={-0.6} glow={0.5 * light} />
              </g>
              <Petals6 f={f} k={light} />
              <Motes f={f} n={24} seed="mo6m" color="#FFE6F2" dir={-1} speed={0.4} size={3} o={0.6} />
            </g>
            <Vignette o={0.6} />
          </World>
        </div>
      ) : null}
    </div>
  );
};

/* Part 2: AskScene. Two-shot: Bali (left) clutches the kalash; Mohini (right, mirrored so she reaches left)
   holds out her open palm and speaks (lip-sync). Bali leans away on 'झगड़ा', then leans in and the kalash
   floats from his hand to her palm, landing on CUES.handover. */
const ASK6: [[number, number], [number, number]] = [[-60, -440], [170, -520]];

export const AskScene: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.ask;
  const z = track(f, [[a, 1.0], [b, 1.08, "io"]]);
  const away = ramp(f, CUES.jhagda, CUES.jhagda + 10, "out") * (1 - ramp(f, CUES.baant - 6, CUES.baant + 6, "io"));
  const give = ramp(f, CUES.handover - 10, CUES.handover, "io");
  const mx = 760;
  const bx = 330 - 30 * away + 30 * give;
  const hold: [number, number] = [bx + 196, 1238];
  const palm: [number, number] = [mx - 160, 1236];
  const kx = hold[0] + (palm[0] - hold[0]) * give;
  const ky = hold[1] + (palm[1] - hold[1]) * give - 70 * Math.sin(Math.PI * give);
  const speak = talk6("06_mohini", f);
  return (
    <World>
      <g transform={`translate(540 1150) scale(${z}) translate(-540 -1150)`}>
        <KshiraSagar f={f} cam={{ x: 0, y: 0, z: 1 }} glow={0.5} swell={0.3} />
        <rect width={W} height={H} fill="#1A0F2A" opacity={0.3} />
        <ellipse cx={mx} cy={1150} rx={400} ry={680} fill="#FFD6E8" opacity={0.22} filter="url(#mBlur8)" />
        <Puppet id="ab" who="bali" at={{ x: bx, y: 1450, s: 1.2, facing: 1 }} p={pose({ sF: 25 + 45 * give, eF: 80 - 50 * give, fist: 1 - give, brow: 0.5, smile: 0.3 + 0.3 * give, lookX: 0.8 })} t={f} />
        <g transform={`translate(${2 * mx} 0) scale(-1 1)`}>
          <MohiniStanding id="mo6a" f={f} x={mx} y={1820} s={1.05} hands={ASK6} openR smile={0.6} speak={speak} lookX={0.5} glow={0.4} />
        </g>
        <g transform={`translate(${kx} ${ky})`}>
          <circle r={70} fill="#FFE08A" opacity={0.35} filter="url(#mBlur8)" />
          <Kalash f={f} glow={0.9} s={0.42} />
        </g>
        <Petals6 f={f} k={0.7} n={16} seed={7} />
      </g>
      <Vignette o={0.6} />
    </World>
  );
};
