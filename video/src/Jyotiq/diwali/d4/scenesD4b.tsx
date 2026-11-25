import React from "react";
import { AIRAVATA_SEAT, Airavata, SeatedLegs } from "../../manthan/beings";
import { World } from "../../manthan/kit";
import { blinkAt, idle, pose, Puppet, Vajra } from "../../manthan/rig";
import { Motes, Vignette } from "../../manthan/sets";
import { ramp, track, W } from "../../manthan/style";
import { D2Defs } from "../d2/scenesD2a";
import { Bansuri, DeityStanding, KRISHNA } from "../shared/deities";
import { Storm } from "../shared/fx";
import { GCow, GovardhanHill, Villager } from "./sets4";
import { CUES, LINES, SCENES } from "./timing";
import { VO } from "./voData";

/* Diwali Day 4 scenes, part B: Indra's storm (03), the lift (04) and Krishna's words (05).
   One clock: timing.ts (PLACEHOLDER until the takes are in). Indra and Airavata are Manthan Ep2's (read-only
   imports, composed as in manthan/RigTest.tsx). */

const cue = (k: string, dflt: number): number => (typeof CUES[k] === "number" ? CUES[k] : dflt);

/** A one-frame lightning pulse at `at`, decaying over 6 frames. */
const pulse = (f: number, at: number) => ramp(f, at - 1, at + 1, "out") * (1 - ramp(f, at + 2, at + 8, "in"));

/* ------------------------------------------------------------------ */
/* 03: Indra's storm                                                    */
/* ------------------------------------------------------------------ */

/** Indra on Airavata appears high in the clouds in a lightning flash on 'इंद्र', angry but dignified (brows down, no
    snarl). Lightning cracks on 'क्रोधित' and 'सात'; the storm builds to its height by 'तूफ़ान', the rain lashing the
    dark land with Govardhan on the horizon. The camera shakes a little on each flash. */
export const StormD4: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.storm;
  const IN = cue("indra03", 510);
  const KR = cue("krodh03", 525);
  const SA = cue("saat03", 555);
  const TF = cue("toofan03", 631);
  const k = 0.6 + 0.4 * ramp(f, a, TF, "io");
  const flash = Math.max(pulse(f, IN), pulse(f, KR), pulse(f, SA));
  const shake = flash * 6 * Math.sin(f * 2.3);
  const indra = ramp(f, IN - 2, IN + 6, "out");
  const z = track(f, [[a, 1.0], [b, 1.08, "io"]]);
  return (
    <World>
      <D2Defs />
      <g transform={`translate(${shake} 0) translate(540 900) scale(${z}) translate(-540 -900)`}>
        <rect width={W} height={1920} fill="#0B0E1C" />
        <Storm f={f} k={k} seed="d4st" flash={flash} />
        <g opacity={indra} transform={`translate(560 640) scale(0.55)`}>
          <Airavata
            t={f}
            step={f / 9}
            walk={0.2}
            flap={0.5}
            rider={
              <g transform={`translate(${AIRAVATA_SEAT[0]} ${AIRAVATA_SEAT[1]})`}>
                <Puppet id="d4-indra" who="indra" at={{ x: 0, y: 0, s: 0.74, facing: 1 }} p={pose({ ...idle("indra", f), sF: 50, eF: 70, smile: 0, browTilt: 14 })} t={f} prop={<Vajra />} noLegs />
              </g>
            }
            riderLegs={
              <g transform={`translate(${AIRAVATA_SEAT[0]} ${AIRAVATA_SEAT[1]}) scale(0.74)`}>
                <SeatedLegs who="indra" />
              </g>
            }
          />
        </g>
        <path d="M0 1500C300 1480 700 1496 1080 1474V1920H0Z" fill="#101A0C" />
        <g transform="translate(780 1500)">
          <GovardhanHill f={f} s={0.7} wet={1} />
        </g>
        <rect width={W} height={1920} fill="#E8ECFF" opacity={0.35 * flash} />
      </g>
    </World>
  );
};

/* ------------------------------------------------------------------ */
/* 04: Krishna lifts Govardhan on his little finger                     */
/* ------------------------------------------------------------------ */

const zoomAt = (x: number, y: number, z: number) => `translate(${x} ${y}) scale(${z}) translate(${-x} ${-y})`;

const KRISHNA_AT = { x: 633, y: 1700, s: 0.62 };
// The raised left hand is at [-150, -560] in DeityStanding's upper-body units, which sit 360 above the feet origin
// (deities.tsx), so on screen it is at about (540, 1130); the pinky tip is about 20 px above it. The hill is centred
// over it, its underside just above his crown.
const PINKY = { x: KRISHNA_AT.x - 150 * KRISHNA_AT.s, y: KRISHNA_AT.y - (560 + 360) * KRISHNA_AT.s - 20 };
const HILL_S = 1.6;
const SPLASH: [number, number][] = Array.from({ length: 14 }, (_, i) => {
  const x = -200 + (400 * i) / 13;
  return [x, -304 * Math.pow(1 - Math.abs(x) / 230, 1 / 1.6)];
});

/** Close on Krishna as his left arm rises from 'उंगली' and the hill lifts from the ground onto his little finger by
    'गोवर्धन', the storm still raging, rain splashing off the hill's top. A cut on 'सारा' ('सारा गाँव उसके नीचे') to the
    wide: the villagers and cows shelter beneath the hill in warm lamplight. */
export const LiftD4: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.lift;
  const UN = cue("ungli04", 690);
  const GV = cue("govardhan04", 736);
  const C = cue("cap04b", 781);
  const lift = ramp(f, UN - 6, GV + 10, "io");
  const hy = KRISHNA_AT.y + (PINKY.y - KRISHNA_AT.y) * lift + Math.sin(f / 9) * 3 * lift;
  const handL: [number, number] = [-140 - 10 * lift, -96 - 464 * lift];
  const shelter = ramp(f, C - 4, C + 12, "out");
  const view = f < C ? zoomAt(560, 1300, track(f, [[a, 1.25], [C, 1.32, "lin"]])) : zoomAt(540, 1400, track(f, [[C, 1.0], [b, 1.05, "io"]]));
  return (
    <World>
      <D2Defs />
      <g transform={view}>
        <rect width={W} height={1920} fill="#0B0E1C" />
        <Storm f={f} k={1} seed="d4lf" />
        <path d="M0 1680C300 1664 700 1676 1080 1656V1920H0Z" fill="#101A0C" />
        <circle cx={540} cy={1560} r={440} fill="url(#d2Flare)" opacity={0.6 * shelter} style={{ mixBlendMode: "screen" }} />
        <g opacity={shelter}>
          <Villager x={230} y={1700} s={1.0} dress={1} />
          <Villager x={330} y={1710} s={0.95} flip dress={0} />
          <GCow x={430} y={1730} s={0.9} />
          <GCow x={730} y={1735} s={0.95} flip />
          <Villager x={800} y={1705} s={1.0} flip dress={1} />
          <Villager x={890} y={1715} s={1.05} dress={0} />
        </g>
        <g transform={`translate(${PINKY.x} ${hy})`}>
          <GovardhanHill f={f} s={HILL_S} wet={1} />
          {lift > 0.9
            ? SPLASH.map(([x, y], i) =>
                (f + i * 3) % 6 < 3 ? (
                  <path key={i} d={`M${x * HILL_S - 7} ${y * HILL_S}Q${x * HILL_S} ${y * HILL_S - 10} ${x * HILL_S + 7} ${y * HILL_S}`} stroke="#C9D6F0" strokeWidth={2} fill="none" opacity={0.7} />
                ) : null,
              )
            : null}
        </g>
        <g transform={`translate(${KRISHNA_AT.x} ${KRISHNA_AT.y}) scale(${KRISHNA_AT.s})`}>
          <DeityStanding L={KRISHNA} t={f} smile={0.6} closed={blinkAt("d4kl", f)} halo={0.8} handL={handL} handR={[120, -110]} pinkyL={lift > 0.5} />
        </g>
      </g>
    </World>
  );
};

/* ------------------------------------------------------------------ */
/* 05: Krishna speaks, under the hill                                   */
/* ------------------------------------------------------------------ */

/** Mouth openness from the take's loudness envelope (Day 1's talkD1 on Day 4's clock). */
export const talkD4 = (line: string, f: number): number => {
  const r = LINES[line];
  const v = VO[line];
  if (!r || !v) return 0;
  const i = Math.round(f) - r[0];
  if (i < 0 || i >= v.env.length) return 0;
  const g = (k: number) => v.env[Math.max(0, Math.min(v.env.length - 1, k))];
  return Math.min(1, ((g(i - 1) + 2 * g(i) + g(i + 1)) / 4) * 1.1);
};

const CU = 2.2;

/** A close-up framed like Day 2's YamaD2 (eyes near y 650): Krishna smiling, lips moving with his voice, the flute
    held at his chest. Above, the dark underside of the lifted hill; beyond it the storm; around him warm lamplight
    and gold motes. The chest stays calm for the gold words at y 1360. */
export const KrishnaD4: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.krishna;
  const z = track(f, [[a, 1.0], [b, 1.06, "io"]]);
  const footY = 650 + 720 * CU;
  return (
    <World>
      <D2Defs />
      <g transform={`translate(540 800) scale(${z}) translate(-540 -800)`}>
        <rect width={W} height={1920} fill="#0B0E1C" />
        <Storm f={f} k={0.55} seed="d4kr" />
        <circle cx={540} cy={1100} r={900} fill="url(#d2Flare)" opacity={0.55} style={{ mixBlendMode: "screen" }} />
        <path d="M-100 0H1180V330C900 300 700 322 540 312C380 322 180 300 -100 330Z" fill="#141C10" />
        <path d="M-100 330C180 300 380 322 540 312C700 322 900 300 1180 330" fill="none" stroke="#FFB65A" strokeWidth={3} opacity={0.5} />
        <g transform={`translate(540 ${footY}) scale(${CU})`}>
          <DeityStanding
            L={KRISHNA}
            t={f}
            smile={0.75}
            speak={talkD4("05_krishna", f)}
            closed={blinkAt("d4kc", f)}
            halo={1}
            handL={[-70, -250]}
            handR={[80, -246]}
            inHandR={<Bansuri />}
          />
        </g>
        <Motes f={f} n={24} seed="d4km" color="#FFE6A3" dir={-1} speed={0.5} size={3.5} o={0.5} />
      </g>
      <Vignette o={0.6} />
    </World>
  );
};
