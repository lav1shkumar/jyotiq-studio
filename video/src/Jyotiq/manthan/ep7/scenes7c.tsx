import React from "react";
import { VishnuStanding } from "../ep2/beings3";
import { World } from "../kit";
import { pose, Puppet } from "../rig";
import { KshiraSagar, Motes, Vignette } from "../sets";
import { H, ramp, track, W } from "../style";
import { SudarshanChakra } from "./cast7";
import { cue7, span7 } from "./kit7";
import { DevaRow7, ROW, ROW_EYE_Y } from "./row7";
import { BEATS, SCENES } from "./timing";

type P2 = [number, number];
const mixP = (a: P2, b: P2, k: number): P2 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];

/*
 * Episode 7, the melt beat (BEATS.melt, straight after 'ये असुर है!'). Still on the row, Surya and Chandra hold
 * him where AlertScene7 left them (recoiled, arms on his shoulders) while the deva disguise melts off through a
 * violet smoke burst into Svarbhanu's true asura form (Episode 1's 'swarbhanu' puppet; DevaRow7 disguise 1 to 0),
 * his eyes glinting red. A pale violet flash and a shockwave ring fire at the midpoint; the camera creeps in from
 * AlertScene7's 1.27. The 'disguise melt' SFX sits on this beat.
 * Placeholder default: melt 480-494.
 */
export const MeltScene7: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = span7(BEATS, "melt", [480, 494]);
  const m = (a + b) / 2;
  const k = ramp(f, a, b, "in"); // 0 disguised .. 1 true form
  const mid = Math.max(0, 1 - Math.abs(f - m) / ((b - a) / 2 + 2));
  const z = track(f, [[a, 1.27], [b + 10, 1.33, "io"]]);
  const fy = ROW_EYE_Y + 60;
  const ringR = 60 + 520 * ramp(f, m - 2, b + 8, "out");
  const ringO = ramp(f, m - 3, m, "out") * (1 - ramp(f, m, b + 8, "out"));
  const ix = ROW.X_IMP;
  const iy = ROW_EYE_Y + 120;
  return (
    <World>
      <g transform={`translate(540 ${fy}) scale(${z}) translate(-540 ${-fy})`}>
        <KshiraSagar f={f} cam={{ x: 0, y: 0, z: 1.05 }} glow={0.3} swell={0.3} />
        <rect x={-200} width={W + 400} height={H} fill="#0A0814" opacity={0.5 + 0.15 * k} />
        <ellipse cx={540} cy={1300} rx={520} ry={600} fill="#FFE6A3" opacity={0.14 * (1 - k)} filter="url(#mBlur8)" />
        <ellipse cx={ix} cy={iy} rx={300} ry={420} fill="#5A2A9A" opacity={0.35 * k + 0.4 * mid} filter="url(#mBlur8)" />
        <DevaRow7 id="me7" f={f} disguise={1 - k} recoil={1} point={1} glint={k} smoke={1} />
        <circle cx={ix} cy={iy} r={ringR} fill="none" stroke="#C9A0FF" strokeWidth={10 - 5 * ringO} opacity={0.7 * ringO} />
        <Motes f={f} n={20} seed="me7m" color="#C9B4FF" dir={-1} speed={0.7} size={3} o={0.6} />
      </g>
      <rect width={W} height={H} fill="#E9D8FF" opacity={0.35 * mid} />
      <Vignette o={0.8} />
    </World>
  );
};

/*
 * Episode 7, scene 5, over line 05 ("विष्णु का सुदर्शन चक्र चला... सिर धड़ से अलग!") and the whiteout beat.
 * A two-shot on the same dim sea: Svarbhanu in his true form on the viewer's left (facing right), Vishnu (the
 * series' VishnuStanding, feet at its origin) on the right with his halo up. From 'चक्र' the chakra in his upper
 * viewer-left hand (local (-200, -462) in the upper-body coordinates, which sit 360 above the feet) flares and
 * spins up into the Sudarshan; on 'चला' it leaves his hand with a release flash and streaks along an arc with a
 * motion trail to Svarbhanu's neck while he looks up in fear, arms rising; the camera follows it in. On 'अलग' it
 * cuts through in a white-gold flash and a ring, and the frame burns to white over the whiteout beat. No blood.
 * Placeholder defaults: chakra scene 494-590, 'चक्र' 520, 'चला' 540, 'अलग' 572, whiteout 590-600.
 */
export const ChakraScene7: React.FC<{ f: number }> = ({ f }) => {
  const [a] = span7(SCENES, "chakra", [494, 590]);
  const [, w1] = span7(BEATS, "whiteout", [590, 600]);
  const chakra = cue7("chakra", 520);
  const chala = cue7("chala", 540);
  const alag = cue7("alag", 572);
  // Vishnu, and the chakra resting in his upper viewer-left hand
  const vs = 0.95;
  const vx = 820;
  const vy = 1880;
  const hand: P2 = [vx - 200 * vs, vy - (462 + 360) * vs];
  // Svarbhanu in his true form
  const at = { x: 300, y: 1500, s: 1.05, facing: 1 };
  const neck: P2 = [at.x + 6 * at.s, at.y - 224 * at.s];
  const fear = ramp(f, chala - 4, chala + 10, "out");
  const sv = pose({
    smile: -0.4 * fear,
    brow: fear,
    browTilt: -10 * fear,
    talk: 0.5 * fear,
    lookX: 0.5,
    lookY: -0.6 * fear,
    sF: 8 + 120 * fear,
    eF: 12 + 50 * fear,
  });
  // the chakra: spins up in the hand, then flies an arc to his neck
  const spinUp = ramp(f, chakra - 6, chala, "out");
  const fly = ramp(f, chala, alag, "in");
  const ctrl: P2 = [(hand[0] + neck[0]) / 2, Math.min(hand[1], neck[1]) - 180];
  const bez = (u: number): P2 => [
    (1 - u) * (1 - u) * hand[0] + 2 * (1 - u) * u * ctrl[0] + u * u * neck[0],
    (1 - u) * (1 - u) * hand[1] + 2 * (1 - u) * u * ctrl[1] + u * u * neck[1],
  ];
  const flying = f >= chala && f <= alag + 3;
  const cpos = f < chala ? hand : bez(fly);
  const cs = 0.47 + 0.43 * spinUp;
  const spin = f * (12 + 40 * spinUp);
  const release = Math.max(0, 1 - Math.abs(f - chala) / 8);
  const hit = Math.max(0, 1 - Math.abs(f - alag) / 6);
  const ring = ramp(f, alag, alag + 14, "out");
  const white = ramp(f, alag + 2, w1, "in");
  // camera: a slow push, then it follows the chakra in to the neck. The focus is clamped so the set's left edge
  // (world x 0) never enters the frame at the close-up (the chakra1 stills showed a dark band there).
  const z = track(f, [[a, 1.0], [chala, 1.05, "io"], [alag, 1.35, "io"]]);
  const F0 = mixP([560, 1200], neck, fly);
  const F: P2 = [Math.max(540 / z + 4, F0[0]), F0[1]];
  return (
    <World>
      <g transform={`translate(540 1000) scale(${z}) translate(${-F[0]} ${-F[1]})`}>
        <KshiraSagar f={f} cam={{ x: 0, y: 0, z: 1.05 }} glow={0.35} swell={0.3} />
        <rect x={-400} width={W + 800} height={H + 400} fill="#0A0814" opacity={0.45} />
        <ellipse cx={vx} cy={vy - 600} rx={360} ry={520} fill="#FFF3C9" opacity={0.18 + 0.1 * spinUp} filter="url(#mBlur8)" />
        <Puppet id="ch7sv" who="swarbhanu" at={at} p={sv} t={f} />
        <g transform={`translate(${vx} ${vy}) scale(${vs})`}>
          <VishnuStanding t={f} smile={0.25} halo={0.7 + 0.3 * spinUp} />
        </g>
        <circle cx={hand[0]} cy={hand[1]} r={60 + 60 * release} fill="#FFF3C9" opacity={0.6 * release} filter="url(#mBlur8)" />
        {flying
          ? [5, 4, 3, 2, 1].map((i) => {
              const p = bez(Math.max(0, fly - i * 0.06));
              return <SudarshanChakra key={i} x={p[0]} y={p[1]} s={cs} spin={spin - i * 20} glow={0.3} o={0.45 * (1 - i / 6)} />;
            })
          : null}
        {f < alag + 4 ? <SudarshanChakra x={cpos[0]} y={cpos[1]} s={cs} spin={spin} glow={0.6 + 0.4 * spinUp} /> : null}
        {ring > 0 && ring < 1 ? (
          <circle cx={neck[0]} cy={neck[1]} r={40 + 420 * ring} fill="none" stroke="#FFE6A3" strokeWidth={2 + 10 * (1 - ring)} opacity={0.9 * (1 - ring)} />
        ) : null}
        <circle cx={neck[0]} cy={neck[1]} r={140} fill="#FFF6DD" opacity={0.9 * hit} filter="url(#mBlur8)" />
        <Motes f={f} n={16} seed="ch7m" color="#FFE6A3" dir={-1} speed={0.6} size={3} o={0.5} />
      </g>
      <rect width={W} height={H} fill="#FFF6DD" opacity={Math.min(1, 0.5 * hit + white)} />
      <Vignette o={0.7 * (1 - white)} />
    </World>
  );
};
