import React from "react";
import { bump, shake, World } from "../kit";
import { idle, pose, Puppet, Who } from "../rig";
import { CAM0, KshiraSagar, Motes, Vignette } from "../sets";
import { H, ramp, track, W } from "../style";
import { GiantLotus, LakshmiStanding, LotusPad } from "./lakshmi";
import { GURU, Pothi, TapasAura } from "./cast5";
import { CUES, SCENES } from "./timing";

/* Episode 5 scenes, part D: the reveal (line 05 + the reveal beat) and her choice (line 06).
   The lotus rises and opens, Lakshmi rises inside it (drawn between its back and front petals and
   clipped at the pericarp), the name card lands, and the camera pushes in as she opens her eyes.
   Then she looks over everyone, and two candidates fail her test: Durvasa (tapas, but anger) and the
   learned sage (knowledge, but attachment). */

/** Elimination tags for the overlay layer (Episode5.tsx renders them with gfx5's XTag). */
export const XTAGS: { at: number; out: number; x: number; y: number; text: string }[] = [
  { at: CUES.krodh + 4, out: CUES.kisi2 - 2, x: 790, y: 880, text: "क्रोध" },
  { at: CUES.moh + 4, out: SCENES.choice[1] - 2, x: 790, y: 880, text: "मोह" },
];

/** Gold swirl on the milk where the sea parts for the lotus. */
const Swirl: React.FC<{ f: number; x: number; y: number; k: number }> = ({ f, x, y, k }) =>
  k > 0.01 ? (
    <g transform={`translate(${x} ${y})`} opacity={k}>
      {[1, 0.72, 0.48].map((r, i) => (
        <ellipse key={i} rx={420 * r} ry={70 * r} fill="none" stroke="#FFD36B" strokeWidth={6 - i} strokeDasharray={`${60 * r} ${40 * r}`} strokeDashoffset={(f * (6 + i * 3)) % 1000} opacity={0.6} />
      ))}
      <ellipse rx={300} ry={60} fill="#FFE6A3" opacity={0.35} filter="url(#mBlur8)" />
    </g>
  ) : null;

const LX = 540;
const LB = 1600; // lotus base (waterline)
const LSC = 1.25; // lotus scale
const PERI = LB - 46 * LSC; // the pericarp, where her feet rest
const LS = 0.9; // Lakshmi's scale in the reveal
const FACE_Y = PERI - LS * 700;

/** 660-802: the sea parts, the lotus rises and opens, Lakshmi is revealed; push-in on her face. */
export const LotusScene: React.FC<{ f: number }> = ({ f }) => {
  const swirl = ramp(f, SCENES.lotus[0], SCENES.lotus[0] + 16, "out");
  const bud = ramp(f, SCENES.lotus[0], CUES.prakat + 2, "out");
  const open = ramp(f, CUES.prakat, CUES.lakshmi + 6, "io");
  const lk = ramp(f, CUES.prakat + 8, CUES.lakshmi + 8, "out");
  const blaze = ramp(f, CUES.lakshmi - 4, CUES.lakshmi + 10, "out");
  const flash = bump(f, CUES.lakshmi - 4, CUES.lakshmi + 12);
  const eyes = ramp(f, CUES.reveal + 2, CUES.reveal + 12);
  const z = track(f, [[SCENES.lotus[0], 1.0], [CUES.lakshmi, 1.03], [CUES.reveal, 1.06, "io"], [SCENES.lotus[1], 1.75, "io"]]);
  const lotusY = LB + (1 - bud) * 520;
  const feetY = PERI + (1 - bud) * 520 + (1 - lk) * 820;
  return (
    <World>
      <g transform={`translate(${LX} ${FACE_Y}) scale(${z}) translate(${-LX} ${-FACE_Y})`}>
        <KshiraSagar f={f} cam={CAM0} glow={0.7 + 0.3 * blaze} swell={0.3} />
        <g transform={`translate(${LX} 1000) rotate(${f * 0.2})`} opacity={0.5 * blaze}>
          {new Array(20).fill(0).map((_, i) => (
            <path key={i} d="M-18 0L0 -1250L18 0Z" transform={`rotate(${i * 18})`} fill="#FFE6A3" opacity={0.16} />
          ))}
        </g>
        <Swirl f={f} x={LX} y={LB} k={swirl * (1 - 0.5 * blaze)} />
        <LotusPad x={200} y={LB + 40} s={1.4} rot={-8} />
        <LotusPad x={890} y={LB + 60} s={1.2} rot={10} />
        <clipPath id="lt5-water">
          <rect x={0} y={0} width={W} height={LB + 10} />
        </clipPath>
        <g clipPath="url(#lt5-water)">
          <g transform={`translate(${LX} ${lotusY})`}>
            <GiantLotus id="lt5" f={f} open={0.08 + 0.92 * open} glow={0.4 + 0.6 * blaze} s={LSC} part="back" />
          </g>
          <clipPath id="lt5-peri">
            <rect x={0} y={0} width={W} height={lotusY - 46 * LSC + 4} />
          </clipPath>
          <g clipPath="url(#lt5-peri)">
            <LakshmiStanding id="lk5" f={f} x={LX} y={feetY} s={LS} eyes={eyes} smile={0.4 + 0.25 * eyes} halo={0.3 + 0.7 * blaze} glow={0.3 + 0.7 * blaze} />
          </g>
          <g transform={`translate(${LX} ${lotusY})`}>
            <GiantLotus id="lt5" f={f} open={0.08 + 0.92 * open} glow={0.4 + 0.6 * blaze} s={LSC} part="front" />
          </g>
        </g>
      </g>
      <rect width={W} height={H} fill="#FFF6DC" opacity={0.7 * flash} />
      <Motes f={f} n={34} seed="lt5m" color="#FFC6DE" dir={-1} speed={0.5} size={3.2} o={0.5 + 0.4 * blaze} />
      <Vignette o={0.55} />
    </World>
  );
};

/** A heap of gold coins and jewels (what pulls the learned sage's eyes). */
const GoldHeap: React.FC<{ f: number; x: number; y: number; k: number }> = ({ f, x, y, k }) =>
  k > 0.01 ? (
    <g transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * k})`} opacity={k}>
      <ellipse cx={0} cy={-40} rx={170} ry={90} fill="#FFD36B" opacity={0.35} filter="url(#mBlur8)" />
      {[[-90, 0], [-45, 0], [0, 0], [45, 0], [90, 0], [-66, -22], [-22, -22], [22, -22], [66, -22], [-44, -44], [0, -44], [44, -44], [-22, -66], [22, -66], [0, -88]].map(([cx, cy], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={30} ry={13} fill="url(#mGold)" stroke="#6B410F" strokeWidth={1.5} />
      ))}
      {[[-60, -34, "#E3264A"], [40, -58, "#1E9A6A"], [70, -14, "#2E7BFF"], [-14, -80, "#E3264A"]].map(([cx, cy, c], i) => (
        <circle key={i} cx={cx as number} cy={cy as number} r={9} fill={c as string} stroke="#6B410F" strokeWidth={1.5} />
      ))}
      {[0, 1, 2].map((i) => {
        const tw = Math.max(0, Math.sin(f / 5 + i * 2));
        return (
          <path key={i} d="M0 -14L3 -3L14 0L3 3L0 14L-3 3L-14 0L-3 -3Z" transform={`translate(${-70 + i * 70} ${-70 - i * 12}) scale(${tw})`} fill="#FFFFFF" />
        );
      })}
    </g>
  ) : null;

type Cand = { who: Who; x: number };
const DEVTAS: Cand[] = [
  { who: "indra", x: 92 },
  { who: "surya", x: 186 },
  { who: "chandra", x: 280 },
];
const ASURAS: Cand[] = [
  { who: "asuraSlate", x: 800 },
  { who: "bali", x: 894 },
  { who: "asuraJade", x: 988 },
];

/** 802-1024: she looks over everyone; Durvasa's anger, then the sage's attachment. */
export const ChoiceScene: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.choice;
  const c1 = CUES.cap06b - 2; // two-shot with Durvasa
  const c2 = CUES.kisi2 - 2; // two-shot with the learned sage
  if (f < c1) {
    const z = track(f, [[a, 1.0], [c1, 1.07, "io"]]);
    const scan = Math.sin((f - a) / 9) * 0.9;
    return (
      <World>
        <g transform={`translate(540 1150) scale(${z}) translate(-540 -1150)`}>
          <KshiraSagar f={f} cam={CAM0} glow={0.75} />
          <circle cx={540} cy={1150} r={300} fill="#FFE2A0" opacity={0.35} filter="url(#mBlur8)" />
          {DEVTAS.map((m, i) => (
            <Puppet key={m.x} id={`ch-d${i}`} who={m.who} at={{ x: m.x, y: 1390, s: 0.5, facing: 1 }} p={pose({ ...idle(`chd${i}`, f), lookX: 0.8, lookY: -0.4, smile: 0.4 })} t={f} />
          ))}
          {ASURAS.map((m, i) => (
            <Puppet key={m.x} id={`ch-a${i}`} who={m.who} at={{ x: m.x, y: 1390, s: 0.5, facing: -1 }} p={pose({ ...idle(`cha${i}`, f), lookX: 0.8, lookY: -0.4, smile: 0.4 })} t={f} />
          ))}
          <g transform="translate(540 1560)">
            <GiantLotus id="ch5" f={f} open={1} glow={0.6} s={0.8} part="back" />
          </g>
          <LakshmiStanding id="lkc" f={f} x={540} y={1560 - 46 * 0.8 + 2} s={0.6} lookX={scan} smile={0.45} glow={0.4} />
          <g transform="translate(540 1560)">
            <GiantLotus id="ch5" f={f} open={1} glow={0.6} s={0.8} part="front" />
          </g>
        </g>
        <Motes f={f} n={30} seed="ch5w" color="#FFE6A3" dir={-1} speed={0.5} size={3} o={0.7} />
        <Vignette o={0.55} />
      </World>
    );
  }
  const durvasa = f < c2;
  const cue = durvasa ? CUES.krodh : CUES.moh;
  const fail = ramp(f, cue - 2, cue + 8, "out");
  const away = ramp(f, cue + 10, cue + 20, "io");
  const start = durvasa ? c1 : c2;
  const z = track(f, [[start, 1.0], [cue, 1.03], [cue + 10, 1.09, "out"], [durvasa ? c2 : b, 1.1]]);
  const [sx, sy] = durvasa ? shake(f, CUES.krodh, 10, 10) : [0, 0];
  const gyan = durvasa ? 0 : ramp(f, CUES.gyan - 4, CUES.gyan + 8, "out") * (1 - 0.7 * fail);
  return (
    <World dx={sx} dy={sy}>
      <g transform={`translate(790 1150) scale(${z}) translate(-790 -1150)`}>
        <KshiraSagar f={f} cam={CAM0} glow={0.55} />
        {durvasa ? (
          <g transform="translate(790 1110)">
            <TapasAura f={f} r={270} anger={fail} />
          </g>
        ) : (
          <g transform="translate(790 1110)">
            <TapasAura f={f} r={240} anger={0} o={0.5 + 0.5 * gyan} />
          </g>
        )}
        {!durvasa ? <GoldHeap f={f} x={935} y={1520} k={fail} /> : null}
        {durvasa ? (
          <Puppet
            id="ch-dv"
            who="durvasa"
            at={{ x: 790, y: 1350, s: 1.0, facing: -1 }}
            p={pose({ ...idle("chdv", f, 0.6), blink: 0.85 * (1 - fail), browTilt: 22 * fail, brow: 0.2 * fail, glow: fail, fist: fail, sF: 10 + 40 * fail, eF: 20 + 50 * fail, lean: 4 * fail, lookX: 0.7 })}
            t={f}
          />
        ) : (
          <Puppet
            id="ch-gu"
            who={GURU}
            at={{ x: 790, y: 1350, s: 1.0, facing: -1 }}
            p={pose({ ...idle("chgu", f, 0.6), sF: 30, eF: 70, lookX: 0.6 - 1.5 * fail, lookY: 0.55 * fail, smile: 0.35 * fail, head: -6 * fail })}
            t={f}
            prop={<Pothi glow={gyan} f={f} />}
          />
        )}
        <LakshmiStanding id="lkc" f={f} x={270 - 30 * away} y={1660} s={0.72} lookX={0.8 - 1.5 * away} smile={0.45 - 0.3 * away} glow={0.3} />
      </g>
      {durvasa ? <rect width={W} height={H} fill="#FF2A10" opacity={0.22 * bump(f, CUES.krodh - 2, CUES.krodh + 14)} /> : null}
      <Motes f={f} n={24} seed={durvasa ? "ch5d" : "ch5g"} color={durvasa ? "#FFB08A" : "#FFE6A3"} dir={-1} speed={0.5} size={3} o={0.6} />
      <Vignette o={0.6} />
    </World>
  );
};
