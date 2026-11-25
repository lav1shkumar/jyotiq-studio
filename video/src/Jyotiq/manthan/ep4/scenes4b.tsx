import React from "react";
import { World } from "../kit";
import { Cam, KshiraSagar, Layer, Motes, Vignette } from "../sets";
import { H, ramp, track, W } from "../style";
import { Who } from "../rig";
import { HalahalaColumn, SmokeDrift, Wither } from "../ep3/fx";
import { KailashBg } from "./kailash4";
import { Kneeler, Runner } from "./armies4";
import { talk4 } from "./kit4";
import { CUES, SCENES } from "./timing";

/* Episode 4 scenes, part B: the flight to Kailash, the plea. */

const RUN_CUT = CUES.run - 25; // the poisoned sea -> the armies on Kailash's snow (just before "भागे")

/** The snow slope the armies climb: rises to the right. */
const slopeY = (x: number) => 1560 - 0.36 * x;

const RUNNERS: { who: Who; x0: number; row: number; s: number }[] = [
  { who: "indra", x0: 520, row: 0, s: 0.42 },
  { who: "bali", x0: 380, row: 0, s: 0.44 },
  { who: "agni", x0: 230, row: 1, s: 0.36 },
  { who: "swarbhanu", x0: 140, row: 0, s: 0.42 },
  { who: "surya", x0: 610, row: 1, s: 0.35 },
  { who: "asuraJade", x0: 40, row: 1, s: 0.36 },
  { who: "deva", x0: 720, row: 2, s: 0.3 },
  { who: "asuraSlate", x0: 300, row: 2, s: 0.3 },
  { who: "asura", x0: -60, row: 2, s: 0.3 },
];

/** 334-412: Indra and Bali kneel side by side before Mahadev (his light from the right); Indra pleads. */
export const Plea: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.plea;
  const z = track(f, [[a, 1.18], [b, 1.3, "io"]]);
  const cam: Cam = { x: -20 + track(f, [[a, -20], [b, 10, "io"]]), y: 470, z };
  const bowI = ramp(f, CUES.raksha - 6, CUES.raksha + 10, "io");
  const bowB = ramp(f, CUES.raksha - 2, CUES.raksha + 14, "io");
  const plead = { brow: 1, browTilt: -14, lookY: -0.6, smile: -0.3 };
  const settle = 1 - ramp(f, a, a + 12, "out"); // they drop to their knees as the shot opens
  return (
    <World>
      <Layer cam={cam} depth={0.5}>
        <KailashBg f={f} id="pl4" />
      </Layer>
      <rect width={W} height={H} fill="#0B1240" opacity={0.18} />
      <Layer cam={cam} depth={1}>
        {/* Mahadev's light, off frame to the right */}
        <ellipse cx={1180} cy={1300} rx={520} ry={620} fill="#CFE7FF" opacity={0.3} filter="url(#mBlur8)" />
        {/* the snow ledge before his seat */}
        <path d="M-400 1580C0 1560 600 1570 1500 1590L1500 2400L-400 2400Z" fill="#C9D5EE" />
        <path d="M-400 1580C0 1560 600 1570 1500 1590" stroke="#F2F6FF" strokeWidth={6} fill="none" />
        {/* the poison's cyan haze still far behind them */}
        <ellipse cx={-120} cy={1480} rx={380} ry={160} fill="#2C5E74" opacity={0.55} filter="url(#mBlur8)" />
        {/* the back row: devtas and asuras kneeling together */}
        {([
          ["swarbhanu", 60, 0.38],
          ["asuraJade", 190, 0.36],
          ["agni", 830, 0.36],
          ["surya", 950, 0.38],
        ] as const).map(([who, x, s]) => (
          <Kneeler key={who} m={{ who: who as Who, id: `pb${who}`, x, base: 1585, s, facing: 1 }} f={f} bow={0.3} extra={{ brow: 0.8, browTilt: -10, lookY: -0.4 }} />
        ))}
        <g transform={`translate(0 ${-30 * settle})`}>
          <Kneeler m={{ who: "bali", id: "plb", x: 380, base: 1640, s: 0.62, facing: 1 }} f={f} bow={0.15 + 0.6 * bowB} extra={{ ...plead, browTilt: -10 }} />
          <Kneeler m={{ who: "indra", id: "pli", x: 640, base: 1652, s: 0.62, facing: 1 }} f={f} bow={0.1 + 0.6 * bowI} talk={talk4("03_indra", f)} extra={plead} />
        </g>
      </Layer>
      <Motes f={f} n={24} seed="pl4s" color="#FFFFFF" dir={1} speed={0.4} size={2.2} o={0.5} />
      <Vignette o={0.6} />
    </World>
  );
};

export const Flee: React.FC<{ f: number }> = ({ f }) => {
  if (f < RUN_CUT) {
    // the poisoned ocean of milk: the column still stands (Episode 3), dark fog rolls toward camera
    const spread = ramp(f, CUES.spread - 10, RUN_CUT, "io");
    const cam: Cam = { x: 0, y: 0, z: track(f, [[SCENES.flee[0], 1.0], [RUN_CUT, 1.08, "io"]]) };
    return (
      <World>
        <KshiraSagar f={f} cam={cam} glow={0.05} swell={0.6} />
        <rect width={W} height={H} fill="#0B1240" opacity={0.5} />
        <Layer cam={cam} depth={0.7}>
          <g transform="translate(860 1220)">
            <HalahalaColumn height={1050} rise={1} f={f} w={150} seed="hh4" />
          </g>
          <ellipse cx={860} cy={1222} rx={230} ry={36} fill="#BFF6FF" opacity={0.3} filter="url(#mBlur8)" />
        </Layer>
        <Layer cam={cam} depth={1}>
          <SmokeDrift x0={-100} y0={1260 - 260 * spread} w={1280} h={520 + 300 * spread} density={0.3 + 0.55 * spread} f={f} seed="fog4a" tint="#2C5E74" dir={1} />
          <SmokeDrift x0={-100} y0={1500 - 200 * spread} w={1280} h={420} density={0.25 + 0.5 * spread} f={f} seed="fog4b" tint="#1B3550" dir={-1} />
        </Layer>
        <rect width={W} height={H} fill="#40D8E8" opacity={0.07 + 0.05 * spread} />
        <g transform="translate(0 1990) scale(1.3)">
          <Wither w={830} amount={ramp(f, CUES.spread, RUN_CUT, "io")} f={f} seed="wi4" />
        </g>
        <Vignette o={0.7} />
      </World>
    );
  }
  // the armies run up the snow toward Kailash; the camera tilts up to the peak on "कैलाश"
  const t = f - RUN_CUT;
  const tilt = ramp(f, CUES.kailash - 6, CUES.kailash + 26, "io");
  const cam: Cam = { x: 40, y: track(tilt, [[0, 330], [1, -40]]), z: track(tilt, [[0, 1.3], [1, 1.0]]) };
  const fog = ramp(t, 0, 60, "io");
  return (
    <World>
      <Layer cam={cam} depth={0.55}>
        <KailashBg f={f} id="fl4" />
      </Layer>
      <Layer cam={cam} depth={1}>
        {/* the snow slope */}
        <path d={`M-300 ${slopeY(-300)}L1400 ${slopeY(1400)}L1400 2400L-300 2400Z`} fill="#C9D5EE" />
        <path d={`M-300 ${slopeY(-300)}L1400 ${slopeY(1400)}`} stroke="#F2F6FF" strokeWidth={8} />
        <path d={`M-300 ${slopeY(-300) + 160}L1400 ${slopeY(1400) + 160}L1400 2400L-300 2400Z`} fill="#9FB0D6" opacity={0.45} />
        {[...RUNNERS].sort((a, b) => b.row - a.row).map((r, i) => {
          const x = r.x0 + 2.4 * t;
          const base = slopeY(x) + 30 + r.row * -38;
          return <Runner key={r.who} m={{ who: r.who, id: `fl${r.who}`, x, base, s: r.s, facing: 1 }} f={f + i * 5} k={1.1} />;
        })}
        {/* the poison fog chasing them up the slope */}
        <SmokeDrift x0={-400} y0={slopeY(-200) - 220} w={900} h={520} density={0.35 + 0.4 * fog} f={f} seed="fog4c" tint="#2C5E74" dir={1} />
        {/* foreground snow bank */}
        <path d={`M-300 ${slopeY(-300) + 330}C200 ${slopeY(200) + 250} 700 ${slopeY(700) + 300} 1400 ${slopeY(1400) + 250}L1400 2400L-300 2400Z`} fill="#E3EAF8" />
      </Layer>
      <Motes f={f} n={30} seed="fl4s" color="#FFFFFF" dir={1} speed={0.5} size={2.4} o={0.55} />
      <Vignette o={0.55} />
    </World>
  );
};
