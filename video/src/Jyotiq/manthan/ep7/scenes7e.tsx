import React from "react";
import { World } from "../kit";
import { Cosmos } from "../scenesA";
import { Motes, Vignette } from "../sets";
import { H, ramp, track, W } from "../style";
import { EclipseSun, RahuSpeaking } from "./cast7";
import { cue7, span7 } from "./kit7";
import { Moon7 } from "./scenes7d";
import { BEATS, SCENES } from "./timing";

type P2 = [number, number];
const mixP = (a: P2, b: P2, k: number): P2 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/*
 * Episode 7, scene 9, over line 09 ("तभी से राहु उनका पीछा करता है... जब निगलता है, ग्रहण लगता है।") and the
 * totality beat. On the Cosmos sky the sun drifts up and away with the moon faint at upper left; from 'पीछा'
 * Rahu's head (RahuSpeaking, small) chases it from the lower left, accelerating, a violet smoke trail and speed
 * streaks behind him. On 'निगलता' his jaws gape and he lunges onto the sun; the head melts into the dark disc
 * (EclipseSun, coming in from his side) as cover reaches 1 by 'ग्रहण': Rahu IS the eclipse. Over the totality beat
 * the corona blazes and the diamond ring flashes while the camera closes in; Jawab7 ('ग्रहण = राहु ✓') is the
 * HTML on this beat. The camera focus is clamped so the frame never leaves the set. Placeholder defaults: chase
 * 880-1010, 'पीछा' 900, 'निगलता' 960, 'ग्रहण' 985, totality 1010-1026.
 */
export const ChaseScene7: React.FC<{ f: number }> = ({ f }) => {
  const [a] = span7(SCENES, "chase", [880, 1010]);
  const [t0, t1] = span7(BEATS, "totality", [1010, 1026]);
  const peecha = cue7("peecha", 900);
  const nigalta = cue7("nigalta", 960);
  const grahan = cue7("grahan09", 985);
  const sun = mixP([640, 620], [720, 560], ramp(f, a, grahan, "out"));
  // the chase: lower left toward the sun, then the lunge onto it
  const chase = ramp(f, peecha - 10, nigalta, "in");
  const start: P2 = [230, 1480];
  const near: P2 = [sun[0] - 230, sun[1] + 260];
  const lunge = ramp(f, nigalta, grahan, "out");
  const head = mixP(mixP(start, near, chase), [sun[0] - 30, sun[1] + 70], lunge);
  const hs = 1.3 + 0.4 * lunge;
  const jaw = ramp(f, nigalta - 4, nigalta + 4, "out");
  const headO = 1 - ramp(f, nigalta + 10, grahan, "in");
  const cover = ramp(f, nigalta - 4, grahan, "in");
  const diamond = Math.max(0, 1 - Math.abs(f - (t0 + 4)) / 8);
  const blaze = ramp(f, grahan, t1, "out");
  // camera: wide on the chase, then closing on the eclipse
  const z = track(f, [[a, 1.0], [nigalta, 1.08, "io"], [t1, 1.3, "io"]]);
  const F0 = mixP([520, 980], [sun[0], sun[1] + 80], ramp(f, nigalta - 10, grahan, "out"));
  const F: P2 = [clamp(F0[0], 540 / z, 1080 - 540 / z), clamp(F0[1], 960 / z, 1920 - 960 / z)];
  return (
    <World>
      <g transform={`translate(540 960) scale(${z}) translate(${-F[0]} ${-F[1]})`}>
        <Cosmos f={f} z={1.04} />
        <g opacity={0.7 * (1 - 0.6 * cover)}>
          <Moon7 x={250} y={420} r={70} />
        </g>
        <ellipse cx={sun[0]} cy={sun[1]} rx={430} ry={400} fill="#FFB23D" opacity={0.26 * (1 - cover) + 0.3 * blaze} filter="url(#mBlur8)" />
        <EclipseSun id="cs7sun" f={f} x={sun[0]} y={sun[1]} r={170} cover={cover} ring={diamond} from={125} />
        {/* the smoke trail and speed streaks he leaves across the sky (the chase1 stills showed the first, dark
            trail vanishing into the night, so it is lighter violet now, with streaks along his path) */}
        {chase > 0.02 && headO > 0.01 ? (
          <g opacity={headO}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
              const p = mixP(start, near, Math.max(0, chase - i * 0.05));
              return <ellipse key={i} cx={p[0]} cy={p[1] + 60} rx={90 - 8 * i} ry={60 - 5 * i} fill="#7A5AC8" opacity={0.42 * (1 - i / 9)} filter="url(#mBlur8)" />;
            })}
            {[0, 1, 2, 3, 4].map((i) => {
              const p0 = mixP(start, near, Math.max(0, chase - 0.03));
              const p1 = mixP(start, near, Math.max(0, chase - 0.22 - 0.04 * i));
              const off = (i - 2) * 26;
              return (
                <path
                  key={`s${i}`}
                  d={`M${p0[0] + 0.94 * off} ${p0[1] + 60 + 0.34 * off}L${p1[0] + 0.94 * off} ${p1[1] + 60 + 0.34 * off}`}
                  stroke="#CDB8FF"
                  strokeWidth={3}
                  strokeLinecap="round"
                  opacity={0.45}
                />
              );
            })}
          </g>
        ) : null}
        {headO > 0.01 ? (
          <g opacity={headO}>
            <RahuSpeaking id="cs7rahu" at={{ x: head[0], y: head[1] }} s={hs} f={f} laugh={jaw} throat={1} rage={0.9} lookX={0.6} />
          </g>
        ) : null}
        <Motes f={f} n={22} seed="cs7m" color="#FFD27A" dir={-1} speed={0.5} size={3} o={0.5} />
      </g>
      <Vignette o={0.7} />
    </World>
  );
};

/*
 * Episode 7, the end bed, under line 10 (SCENES.kundali) and the sign-off (SCENES.end). The end card and the
 * kundali chart both start with line 10 (EndCard7's tease sits at top 250-540, EndKundali7's chart at (540, 800),
 * the tie-in text from top 960). The bed starts on exactly ChaseScene7's last framing (z 1.3, focus (665, 738),
 * the eclipsed sun at (720, 560) r 170) and settles over 28 frames: the camera eases back to 1.0 while the
 * eclipsed sun sinks into the chart's centre (540, 800), shrinks to r 70 and fades to a ghost behind it, so the
 * eclipse sits inside the kundali and nothing lies under the text. The bed then dims for the card.
 * Placeholder defaults: kundali 1030-1150, end 1150-1320.
 */
export const EndBed7: React.FC<{ f: number }> = ({ f }) => {
  const [a] = span7(SCENES, "kundali", [1030, 1150]);
  const [e0] = span7(SCENES, "end", [1150, 1320]);
  const settle = ramp(f, a - 4, a + 24, "out");
  const z = 1.3 - 0.3 * settle;
  const F = mixP([665, 738], [540, 960], settle);
  const sun = mixP([720, 560], [540, 800], settle);
  const r = 170 - 100 * settle;
  const ghost = 1 - 0.65 * ramp(f, a + 6, a + 30, "out");
  const dim = 0.25 * settle + 0.3 * ramp(f, a + 6, a + 26, "out") + 0.12 * ramp(f, e0, e0 + 20, "out");
  return (
    <World>
      <g transform={`translate(540 960) scale(${z}) translate(${-F[0]} ${-F[1]})`}>
        <Cosmos f={f} z={1.04} />
        <g opacity={ghost}>
          <ellipse cx={sun[0]} cy={sun[1]} rx={r * 2.4} ry={r * 2.2} fill="#FFB23D" opacity={0.3} filter="url(#mBlur8)" />
          <EclipseSun id="eb7sun" f={f} x={sun[0]} y={sun[1]} r={r} cover={1} ring={0} from={125} />
        </g>
        <Motes f={f} n={24} seed="eb7m" color="#FFD27A" dir={-1} speed={0.4} size={3} o={0.5} />
      </g>
      <rect width={W} height={H} fill="#07050E" opacity={dim} />
      <Vignette o={0.8} />
    </World>
  );
};
