import React from "react";
import { World } from "../kit";
import { pose, Puppet } from "../rig";
import { Kalash, KshiraSagar, Motes, Vignette } from "../sets";
import { H, ramp, track, W } from "../style";
import { CUES, SCENES } from "./timing";
import { MohiniStanding } from "./mohini";
import { VishnuStanding } from "../ep2/beings3";
import { CHANDRA, SURYA } from "./cast6";
import { AmritCup, AmritStream } from "./props6";
import { MOHINI_CLUE_POS, MOHINI_CLUE_S } from "./layout6";
import { Petals6 } from "./scenes6c";

/*
 * Scenes 8-10: the enchantment and clue freeze, the reveal, the amrit.
 * Part 1: EnchantedScene. Mohini centre-frame holding the kalash at her waist; the asuras sway, dreamy, with
 * little hearts rising over their heads on 'मोहित'. On 'ये है कौन?' the world freezes and dims slightly so the
 * clue circles (Episode6 overlay) can point at her blue skin, the pitambara and the Kaustubha.
 */

const Hearts: React.FC<{ f: number; x: number; y: number; k: number; seed: number }> = ({ f, x, y, k, seed }) => {
  if (k <= 0.01) return null;
  return (
    <g opacity={k}>
      {[0, 1, 2].map((i) => {
        const u = ((f / 40 + i / 3 + seed * 0.13) % 1 + 1) % 1;
        const hx = x + Math.sin(f / 9 + i * 2 + seed) * 22;
        const hy = y - u * 120;
        return (
          <path key={i} d="M0 4C-12 -6 -6 -16 0 -9C6 -16 12 -6 0 4Z" transform={`translate(${hx} ${hy}) scale(${1.6 - u * 0.6})`} fill="#FF7FB0" opacity={1 - u} />
        );
      })}
    </g>
  );
};

const KALASH_HANDS: [[number, number], [number, number]] = [[-34, -400], [34, -400]];

export const EnchantedScene: React.FC<{ f: number }> = ({ f }) => {
  const [a] = SCENES.enchanted;
  const ff = Math.min(f, CUES.kaun);
  const frozen = ramp(f, CUES.kaun, CUES.kaun + 6, "out");
  const z = track(f, [[a, 1.0], [CUES.kaun, 1.04, "io"], [SCENES.enchanted[1], 1.08, "io"]]);
  const dreamy = ramp(f, CUES.mohit - 4, CUES.mohit + 10, "out");
  const sway = (i: number) => Math.sin(ff / 11 + i) * 5 * dreamy;
  const [mx, my] = MOHINI_CLUE_POS;
  const s = MOHINI_CLUE_S;
  return (
    <World>
      <g transform={`translate(540 1150) scale(${z}) translate(-540 -1150)`}>
        <KshiraSagar f={ff} cam={{ x: 0, y: 0, z: 1 }} glow={0.5} swell={0.3} />
        <rect width={W} height={H} fill="#1A0F2A" opacity={0.3} />
        <ellipse cx={mx} cy={1150} rx={430} ry={720} fill="#FFD6E8" opacity={0.25} filter="url(#mBlur8)" />
        <g transform={`rotate(${sway(0)} 110 1650)`}>
          <Puppet id="ea1" who="asura" at={{ x: 110, y: 1650, s: 1.15, facing: 1 }} p={pose({ smile: 0.7 * dreamy, lid: 0.5 * dreamy, lookX: 0.8 })} t={ff} />
        </g>
        <g transform={`rotate(${sway(2)} 970 1650)`}>
          <Puppet id="ea2" who="bali" at={{ x: 970, y: 1650, s: 1.15, facing: -1 }} p={pose({ smile: 0.7 * dreamy, lid: 0.5 * dreamy, lookX: -0.8 })} t={ff} />
        </g>
        <Hearts f={ff} x={110} y={1180} k={dreamy} seed={1} />
        <Hearts f={ff} x={970} y={1180} k={dreamy} seed={4} />
        <MohiniStanding id="mo6e" f={ff} x={mx} y={my} s={s} hands={KALASH_HANDS} smile={0.6} lookX={0} glow={0.4} />
        <g transform={`translate(${mx} ${my - 400 * s - 10})`}>
          <Kalash f={ff} glow={0.9} s={0.42 * s} />
        </g>
        <Petals6 f={ff} k={0.6} n={14} seed={11} />
        <Motes f={ff} n={20} seed="en6m" color="#FFE6F2" dir={-1} speed={0.4} size={3} o={0.5} />
        <rect width={W} height={H} fill="#0C0A1C" opacity={0.25 * frozen} />
      </g>
      <Vignette o={0.6} />
    </World>
  );
};

/* Part 2: RevealScene. 'वो स्वयं श्री विष्णु थे': Mohini glows white-gold from 'स्वयं'; on 'विष्णु' Vishnu's own
   form fades in through her (she thins to a luminous ghost), and on the conch a white flash and a burst of
   rays; the asuras at the corners recoil. The kalash stays glowing at her hands. */
const Burst: React.FC<{ f: number; at: number; x: number; y: number }> = ({ f, at, x, y }) => {
  const t = f - at;
  if (t < 0) return null;
  const k = ramp(t, 0, 6, "out") * (1 - ramp(t, 30, 70, "in"));
  return (
    <g transform={`translate(${x} ${y}) rotate(${t * 0.6})`} opacity={k}>
      {Array.from({ length: 18 }, (_, i) => (
        <path key={i} d="M-22 0L22 0L110 -1100L-110 -1100Z" transform={`rotate(${i * 20})`} fill="#FFF3C9" opacity={0.22} />
      ))}
    </g>
  );
};

export const RevealScene: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.reveal;
  const z = track(f, [[a, 1.08], [b, 1.0, "io"]]);
  const glow = ramp(f, CUES.swayam - 4, CUES.vishnu, "out");
  const show = ramp(f, CUES.vishnu - 4, CUES.vishnu + 10, "io");
  const flash = Math.max(0, 1 - Math.abs(f - CUES.conch - 2) / 6);
  const recoil = ramp(f, CUES.conch - 2, CUES.conch + 8, "out");
  const [mx, my] = MOHINI_CLUE_POS;
  const s = MOHINI_CLUE_S;
  return (
    <World>
      <g transform={`translate(540 1150) scale(${z}) translate(-540 -1150)`}>
        <KshiraSagar f={f} cam={{ x: 0, y: 0, z: 1 }} glow={0.6} swell={0.3} />
        <rect width={W} height={H} fill="#1A0F2A" opacity={0.35} />
        <Burst f={f} at={CUES.conch} x={mx} y={1150} />
        <ellipse cx={mx} cy={1250} rx={360 + 120 * show} ry={700} fill="#FFF3C9" opacity={0.18 + 0.32 * glow} filter="url(#mBlur8)" />
        <g transform={`rotate(${-7 * recoil} 110 1650)`}>
          <Puppet id="ra1" who="asura" at={{ x: 110, y: 1650, s: 1.15, facing: 1 }} p={pose({ brow: 0.9 * recoil, lookX: 0.8 })} t={f} />
        </g>
        <g transform={`rotate(${7 * recoil} 970 1650)`}>
          <Puppet id="ra2" who="bali" at={{ x: 970, y: 1650, s: 1.15, facing: -1 }} p={pose({ brow: 0.9 * recoil, lookX: -0.8 })} t={f} />
        </g>
        <g opacity={1 - 0.65 * show}>
          <MohiniStanding id="mo6r" f={f} x={mx} y={my} s={s} hands={KALASH_HANDS} smile={0.6} glow={glow} />
        </g>
        <g opacity={show} transform={`translate(${mx} ${my}) scale(1.04)`}>
          <VishnuStanding t={f} closed={0} smile={0.5} halo={1} />
        </g>
        <g transform={`translate(${mx} ${my - 400 * s - 10})`}>
          <Kalash f={f} glow={1} s={0.42 * s} />
        </g>
        <rect width={W} height={H} fill="#FFFFFF" opacity={0.75 * flash} />
      </g>
      <Vignette o={0.6} />
    </World>
  );
};

/* Part 3: AmritScene. Two rows: the asuras far back with empty cups (puzzled), the devas in front with cups
   that fill in turn as Mohini pours the amrit down a glowing stream (target changes every 12 frames from the
   word 'अमृत'). The drop meters (Episode6 overlay) count the devas up while the asuras stay at 0. */
export const AmritScene: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.amrit;
  const z = track(f, [[a, 1.0], [b, 1.06, "io"]]);
  const t0 = CUES.amrit08;
  const devaX = [170, 400, 680, 910];
  const asuraX = [200, 420, 660, 880];
  const step = Math.max(0, Math.floor((f - t0) / 12));
  const target = Math.min(devaX.length - 1, step);
  const pouring = f >= t0 - 2;
  const tilt = ramp(f, t0 - 8, t0, "out");
  const spout: [number, number] = [600, 1090];
  const cupY = 1460;
  const devas = [{ who: "indra" }, { who: SURYA }, { who: CHANDRA }, { who: "deva" }];
  return (
    <World>
      <g transform={`translate(540 1200) scale(${z}) translate(-540 -1200)`}>
        <KshiraSagar f={f} cam={{ x: 0, y: 0, z: 1 }} glow={0.5} swell={0.3} />
        <rect width={W} height={H} fill="#1A0F2A" opacity={0.3} />
        {asuraX.map((x, i) => (
          <g key={`a${i}`} opacity={0.9}>
            <Puppet id={`am-a${i}`} who="asura" at={{ x, y: 990, s: 0.6, facing: i < 2 ? 1 : -1 }} p={pose({ brow: 0.6, lookX: i < 2 ? 0.6 : -0.6 })} t={f} />
            <AmritCup x={x + (i < 2 ? 34 : -34)} y={915} s={0.6} f={f} fill={0} />
          </g>
        ))}
        <ellipse cx={540} cy={1250} rx={380} ry={520} fill="#FFF3C9" opacity={0.18} filter="url(#mBlur8)" />
        <g transform={`rotate(${-8 * tilt} 540 1500)`}>
          <MohiniStanding id="mo6p" f={f} x={540} y={1500} s={0.85} hands={KALASH_HANDS} smile={0.6} glow={0.3} />
        </g>
        <g transform={`translate(${spout[0] - 40} ${spout[1] + 20}) rotate(${-50 * tilt})`}>
          <Kalash f={f} glow={1} s={0.4} />
        </g>
        {pouring ? <AmritStream a={spout} b={[devaX[target] + 30, cupY - 40]} t={ramp(f, t0 - 2 + 12 * target, t0 + 4 + 12 * target, "out")} f={f} w={9} /> : null}
        {devaX.map((x, i) => (
          <g key={`d${i}`}>
            <Puppet id={`am-d${i}`} who={devas[i].who as never} at={{ x, y: 1600, s: 0.95, facing: i < 2 ? 1 : -1 }} p={pose({ smile: 0.5 + 0.3 * ramp(f, t0 + 12 * i, t0 + 12 * i + 10), lookX: i < 2 ? 0.5 : -0.5 })} t={f} />
            <AmritCup x={x + 30} y={cupY} s={0.9} f={f} fill={ramp(f, t0 + 12 * i, t0 + 12 * i + 10, "out")} />
          </g>
        ))}
        <Motes f={f} n={20} seed="am6m" color="#FFE6A3" dir={-1} speed={0.5} size={3} o={0.6} />
      </g>
      <Vignette o={0.6} />
    </World>
  );
};
