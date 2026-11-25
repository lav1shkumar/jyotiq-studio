import React from "react";
import { World } from "../kit";
import { Cosmos } from "../scenesA";
import { KshiraSagar, Motes, Vignette } from "../sets";
import { H, ramp, track, W } from "../style";
import { EclipseSun, RahuSpeaking } from "./cast7";
import { cue7, span7 } from "./kit7";
import { DevaRow7 } from "./row7";
import { BEATS, SCENES } from "./timing";

/*
 * Episode 7, scene 1: the hook, over line 01 ("हर ग्रहण के पीछे... एक कटा हुआ सिर है। किसका?").
 * Lit from frame 0, never black: the blazing sun at the top is the one lit element, already being bitten by a
 * sliding dark disc that keeps eating it while the line plays; its corona stays above the hook plate (HTML
 * overlay, top 650). Rahu's severed head (Episode 2's RahuHead) sits large below the plate, half in the sun's
 * shadow, eyes glowing up at the sun, gold amrit glowing at the neck cut; only his smoke reaches the bottom
 * 250 px. On 'सिर' the throat glow pulses. On 'किसका?' the sun flares, the head is lit, his eyes flare and snap
 * to camera, then the world freezes (Episode 6's grammar) and the Kaal rewind carries us to the title.
 * Placeholder defaults keep it drawable before the real timing exists: hook 0-120, सिर 62, किसका 92.
 */

/** Episode 6's Kaal rewind (streaks rushing inward, a clock ring spinning back), copied so Episode 7 does not
 *  depend on Episode 6 files that are still changing. k 0..1. */
export const Rewind7: React.FC<{ f: number; k: number }> = ({ f, k }) => {
  if (k <= 0.01) return null;
  return (
    <g opacity={k}>
      <rect width={W} height={H} fill="#0C0A1C" opacity={0.35 * k} />
      {Array.from({ length: 28 }, (_, i) => {
        const a = (i / 28) * Math.PI * 2;
        const r0 = 900 - ((f * 40 + i * 37) % 700);
        return (
          <path
            key={i}
            d={`M${540 + Math.cos(a) * r0} ${960 + Math.sin(a) * r0}L${540 + Math.cos(a) * (r0 + 160)} ${960 + Math.sin(a) * (r0 + 160)}`}
            stroke="#CDB8FF"
            strokeWidth={4}
            opacity={0.5}
            strokeLinecap="round"
          />
        );
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

export const Hook7: React.FC<{ f: number }> = ({ f }) => {
  const [, b] = span7(SCENES, "hook", [0, 120]);
  const sir = cue7("sir", 62);
  const kiska = cue7("kiska", 92);
  const lit = ramp(f, kiska - 3, kiska + 4, "out"); // the reveal on 'किसका?'
  const hold = kiska + 6; // the world freezes once the reveal has landed
  const ff = Math.min(f, hold);
  const freeze = ramp(f, hold, hold + 6, "out");
  const punch = 0.04 * Math.max(0, 1 - Math.abs(f - kiska - 2) / 6); // a short camera punch on 'किसका?'
  const z = track(f, [[0, 1.0], [hold, 1.06, "io"]]) + punch;
  // half the sun is already gone on frame 0 (coming in from 140 deg, the disc's lower edge sits at about y 651,
  // just clear of the hook plate at top 650), and the shadow keeps eating it to a thin crescent by 'किसका?'
  const cover = 0.5 + 0.22 * ramp(ff, 0, kiska, "in") + 0.05 * lit;
  const pulse = Math.max(0, 1 - Math.abs(ff - sir - 4) / 10); // the 'सिर' beat at the neck
  const ring = ramp(ff, sir, sir + 14, "out"); // a gold ring bursting out of the neck cut on 'सिर'
  const shade = 0.86 + 0.14 * lit;
  const rw = ramp(f, b - 16, b, "in");
  const RS = 2.45; // Rahu's head, centred under the sun so sun, shadow, text and head share one axis
  const head = { x: 540, y: 1500 };
  const neck = { x: head.x - 6 * RS, y: head.y + 56 * RS }; // where RahuSpeaking draws the throat glow
  return (
    <div style={{ position: "absolute", inset: 0, filter: `saturate(${1 - 0.55 * freeze}) brightness(${1 - 0.12 * freeze})` }}>
      <World>
        <defs>
          <filter id="h7-shade" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncR type="linear" slope={shade} />
              <feFuncG type="linear" slope={shade} />
              <feFuncB type="linear" slope={Math.min(1, shade + 0.08)} />
            </feComponentTransfer>
          </filter>
        </defs>
        <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
          <Cosmos f={ff} z={1.04} />
          {/* sunlight spilling down from the top: the one lit element */}
          <ellipse cx={560} cy={330} rx={540} ry={430} fill="#FFB23D" opacity={0.22 + 0.16 * lit} filter="url(#mBlur8)" />
          <EclipseSun id="h7sun" f={ff} x={560} y={330} r={190} cover={cover} from={140} />
          {/* a violet shadow pool behind the head so it reads against the dark lower half; sunlight warms it on the reveal */}
          <ellipse cx={head.x} cy={head.y - 120} rx={400} ry={340} fill="#3A2160" opacity={0.45} filter="url(#mBlur8)" />
          <ellipse cx={head.x} cy={head.y - 260} rx={300} ry={200} fill="#FFB23D" opacity={0.18 * lit} filter="url(#mBlur8)" />
          <g filter="url(#h7-shade)">
            <RahuSpeaking
              id="h7rahu"
              at={head}
              s={RS}
              f={ff}
              laugh={0}
              throat={Math.min(1, 0.6 + 0.4 * pulse + 0.3 * lit)}
              rage={0.65 + 0.35 * lit}
              lookX={0.3 * (1 - lit)}
            />
          </g>
          {/* 'सिर': a thin gold ring bursts out of the neck cut */}
          {ring > 0 && ring < 1 ? (
            <ellipse cx={neck.x} cy={neck.y} rx={60 + 260 * ring} ry={18 + 70 * ring} fill="none" stroke="#FFD36B" strokeWidth={1 + 6 * (1 - ring)} opacity={0.9 * (1 - ring)} />
          ) : null}
          <Motes f={ff} n={26} seed="h7m" color="#FFD27A" dir={-1} speed={0.5} size={3} o={0.55} />
        </g>
        {/* 'किसका?': a short red flash under the punch-in (Episode 6's sting colour) */}
        <rect width={W} height={H} fill="#8A0F1E" opacity={0.22 * Math.max(0, 1 - Math.abs(f - kiska - 1) / 5)} />
        <Rewind7 f={f} k={rw} />
        <Vignette o={0.75} />
      </World>
    </div>
  );
};

/*
 * Title bed (BEATS.rewind into SCENES.title): Episode 6's last story beat, the impostor seated in the devas'
 * row on the dim Kshira Sagar, held low in frame (row shifted down 290 px) so TitleCard7 (HTML, centred) reads
 * clear above the crowns. The Kaal rewind clears off it over the first 12 frames, a slow push follows, and a red
 * glint flashes in his eyes just before scene 02, which pushes in on him.
 */
export const TitleBed7: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = span7(SCENES, "title", [120, 150]);
  const [r0] = span7(BEATS, "rewind", [120, 144]);
  const z = track(f, [[a, 1.0], [b + 6, 1.05, "io"]]);
  const rw = 1 - ramp(f, r0, r0 + 12, "out");
  const glint = Math.max(0, 1 - Math.abs(f - (b - 8)) / 7);
  return (
    <World>
      <g transform={`translate(540 1500) scale(${z}) translate(-540 -1500)`}>
        <KshiraSagar f={f} cam={{ x: 0, y: 0, z: 1.05 }} glow={0.3} swell={0.3} />
        <rect x={-200} width={W + 400} height={H} fill="#0A0814" opacity={0.5} />
        <g transform="translate(0 290)">
          <ellipse cx={540} cy={1300} rx={520} ry={600} fill="#FFE6A3" opacity={0.14} filter="url(#mBlur8)" />
          <DevaRow7 id="tb7" f={f} glint={glint} />
        </g>
        <Motes f={f} n={14} seed="tb7m" color="#C9B4FF" dir={-1} speed={0.4} size={3} o={0.5} />
      </g>
      <Rewind7 f={f} k={rw} />
      <Vignette o={0.75} />
    </World>
  );
};
