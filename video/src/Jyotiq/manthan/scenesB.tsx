import React from "react";
import { FocusLines, lightningPath } from "../bbreel/anime";
import { AIRAVATA_SEAT, Airavata, SeatedLegs } from "./beings";
import { blinkAt, Danda, Garland, handToWorld, idle, Place, pose, Pose, Puppet, talkAt, Vajra } from "./rig";
import { Cam, Layer, Swarga, Vignette } from "./sets";
import { H, P, ramp, rnd, track, W } from "./style";
import { CUES } from "./timing";
import { bump, shake, World } from "./kit";

/* Scenes 4-7 as ONE continuous take in Swarga (396-1140): the garland, the
   curse, the glory draining away, the asura assault. Then the Swarbhanu
   plant (1140-1388) on the burning ridge. */

const GROUND = 1560;
const ES = 1.0; // Airavata scale
const RS = 0.7; // rider scale inside Airavata
const DUR_AT: Place = { x: 930, y: GROUND - 252 * 0.8, s: 0.8, facing: -1 };

const flashAt = (f: number, at: number, len = 5) => (f >= at && f < at + len ? 1 - (f - at) / len : 0);

const swargaState = (f: number) => {
  // Airavata: walks in, stops; after the curse it turns (paper flip) and retreats left
  const ex = track(f, [[396, -560], [520, 330, "out"], [1016, 330], [1130, -820, "in"]]);
  const flip = track(f, [[1002, 1], [1016, -1, "io"]]);
  const walkIn = 1 - ramp(f, 470, 522);
  const walkOut = ramp(f, 1012, 1030);
  const walk = f < 900 ? walkIn : walkOut;
  const stomp = Math.max(bump(f, 698, 712), bump(f, 714, 727));
  const seatX = ex + flip * ES * AIRAVATA_SEAT[0];
  const seat: Place = { x: seatX, y: GROUND + ES * AIRAVATA_SEAT[1] - Math.abs(Math.sin(f / 7)) * 6 * walk * ES, s: ES * RS, facing: flip };
  const cursed = ramp(f, 752, 760);
  const slump = ramp(f, 900, 960, "io");
  const indra: Pose = pose({
    ...idle("indra", f, 0.7),
    sF: track(f, [[396, 14], [556, 14], [584, 74, "io"], [638, 70], [650, 128, "in"], [664, 60, "out"], [700, 20, "io"], [752, 20], [760, 70, "out"], [900, 50, "io"], [960, 10, "io"]]),
    eF: track(f, [[396, 30], [556, 30], [584, 22, "io"], [638, 40], [650, 10, "in"], [700, 30, "io"], [752, 30], [760, 100, "out"], [900, 80], [960, 20, "io"]]),
    sB: 26 - 20 * slump,
    eB: 64 - 40 * slump,
    lean: track(f, [[556, 0], [584, 10, "io"], [638, -4, "io"], [664, 2, "io"], [752, 2], [758, -12, "out"], [900, -6, "io"], [960, 12, "io"]]),
    head: track(f, [[556, 0], [600, -8, "io"], [690, -2, "io"], [752, -2], [758, -8, "out"], [900, -4], [960, 12, "io"]]),
    smile: track(f, [[396, 0.35], [556, 0.35], [600, 0.85, "io"], [700, 0.8], [720, 0.0, "io"], [752, -0.2], [960, -0.6, "io"]]),
    talk: talkAt("04_indra", f) + (f > 756 && f < 860 ? 0.22 : 0),
    brow: Math.max(ramp(f, 712, 724) * (1 - ramp(f, 900, 940)), cursed * (1 - slump)),
    browTilt: -12 * slump,
    lookX: 0.8,
    lookY: track(f, [[556, 0], [584, 0.5, "io"], [640, 0, "io"], [900, 0], [960, 0.8, "io"]]),
    blink: blinkAt("indra", f),
  });
  const rage = ramp(f, 668, 752, "io");
  const leave = ramp(f, 972, 994);
  const dur: Pose = pose({
    ...idle("durvasa", f, 0.6),
    sF: track(f, [[396, 30], [426, 30], [470, 64, "io"], [586, 64], [610, 16, "io"], [748, 18], [756, 106, "out"], [846, 104], [884, 152, "io"], [953, 150], [985, 30, "io"]]),
    eF: track(f, [[396, 72], [426, 72], [470, 26, "io"], [586, 26], [610, 18, "io"], [748, 18], [756, 2, "out"], [884, 8, "io"]]),
    wF: track(f, [[748, 0], [756, -14, "out"], [884, -4]]),
    sB: track(f, [[396, -2], [846, -2], [884, 124, "io"], [953, 124], [985, 0, "io"]]),
    eB: track(f, [[396, 20], [884, 30, "io"]]),
    head: track(f, [[396, 0], [440, -6, "io"], [610, -2, "io"], [700, -8, "io"], [752, -8], [758, 4, "out"], [846, 2], [884, -12, "io"], [953, -10], [985, 0, "io"]]),
    lean: track(f, [[396, 0], [690, -6, "out"], [740, 8, "io"], [752, 8], [758, 16, "out"], [846, 10], [884, -6, "io"], [953, -4], [985, 2, "io"]]),
    talk: talkAt("03_durvasa", f) + talkAt("05_durvasa", f),
    smile: 0.25 * (1 - ramp(f, 600, 640)) - 0.7 * rage,
    browTilt: 2 + 28 * rage,
    brow: 0.4 * ramp(f, 650, 668) * (1 - rage),
    glow: Math.max(ramp(f, 722, 744), 0) * (1 - ramp(f, 960, 990)),
    fist: f > 712 && f < 752 ? 1 : 0,
    lookX: 1,
    lookY: track(f, [[396, -0.4], [600, -0.4], [640, 0.5, "io"], [700, 0.6], [752, -0.2, "io"], [884, -0.8, "io"], [953, -0.4]]),
    blink: f > 700 && f < 990 ? 0 : blinkAt("durvasa", f),
  });
  return { ex, flip, walk, stomp, seat, indra, dur, leave };
};

export const Swargaloka: React.FC<{ f: number }> = ({ f }) => {
  const s = swargaState(f);
  const cam: Cam = {
    x: track(f, [[396, -20], [640, 40, "io"], [700, 70, "io"], [746, 374, "io"], [790, 380, "io"], [840, 125, "io"], [884, 160, "io"], [953, 100, "io"], [1000, 0, "io"], [1140, -20, "io"]]),
    y: track(f, [[396, 150], [700, 160], [746, 271, "io"], [790, 265, "io"], [840, 120, "io"], [884, 0, "io"], [953, 80, "io"], [1000, 60, "io"], [1140, 20, "io"]]),
    z: track(f, [[396, 1.18], [640, 1.2, "io"], [700, 1.24, "io"], [746, 1.9, "io"], [790, 1.98, "io"], [840, 1.3, "io"], [884, 1.25, "io"], [953, 1.15, "io"], [1000, 1.05, "io"], [1140, 1.0, "io"]]),
  };
  const storm = ramp(f, 744, 790);
  const burn = ramp(f, 984, 1050, "io");
  const army = ramp(f, 1004, 1066, "io");
  const flash = Math.max(flashAt(f, CUES.thunder1), flashAt(f, CUES.thunder2));
  const drain = ramp(f, 920, 975, "io");
  // garland hand-offs
  const dHand = handToWorld(s.dur, DUR_AT);
  const iHand = handToWorld(s.indra, s.seat);
  const head: [number, number] = [s.ex + ES * 300, GROUND - ES * 486];
  const groundG: [number, number] = [s.ex + ES * 520, GROUND - 6];
  let gPos: [number, number] = dHand;
  let gRot = 0;
  let squash = 1;
  if (f >= 586 && f < 650) gPos = iHand;
  else if (f >= 650 && f < 664) {
    const u = ramp(f, 650, 664, "io");
    gPos = [iHand[0] + (head[0] - iHand[0]) * u, iHand[1] + (head[1] - iHand[1]) * u - Math.sin(Math.PI * u) * 90];
    gRot = u * 160;
  } else if (f >= 664 && f < 676) gPos = head;
  else if (f >= 676 && f < 700) {
    const u = ramp(f, 676, 700, "in");
    gPos = [head[0] + (groundG[0] - head[0]) * u, head[1] + (groundG[1] - head[1]) * u - Math.sin(Math.PI * u) * 160];
    gRot = 160 + u * 300;
  } else if (f >= 700) {
    gPos = [330 + ES * 520, GROUND - 6];
    gRot = 100;
    squash = f > 712 ? 0.45 : 1;
  }
  const inHand = f < 586;
  const sh = [
    shake(f, CUES.stomp1, 9, 16),
    shake(f, CUES.stomp2, 9, 20),
    shake(f, CUES.thunder1, 16, 30),
    shake(f, CUES.thunder2, 14, 22),
    shake(f, CUES.volcano, 30, 12),
  ].reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
  const trunkCurl = bump(f, 664, 692);
  const indraAt = s.seat;
  const crownW: [number, number] = [indraAt.x + indraAt.facing * indraAt.s * 18, indraAt.y - indraAt.s * 400];
  return (
    <>
      <World dx={sh[0]} dy={sh[1]}>
        <Swarga f={f} cam={cam} uid="s4" storm={storm * (1 - 0.3 * burn)} burn={burn} flash={flash} army={army} />
        {/* lightning */}
        {[CUES.thunder1, CUES.thunder2].map((at, i) =>
          f >= at - 1 && f < at + 7 ? (
            <Layer key={at} cam={cam} depth={0.3}>
              <g opacity={1 - (f - at) / 7} filter="url(#mGlow)">
                <path d={lightningPath(f, 300 + i * 420, -40, 520 + i * 120, 760, 80, `lz${i}`)} stroke="#E8F2FF" strokeWidth={12} fill="none" opacity={0.5} />
                <path d={lightningPath(f, 300 + i * 420, -40, 520 + i * 120, 760, 80, `lz${i}`)} stroke="#FFFFFF" strokeWidth={4} fill="none" />
              </g>
            </Layer>
          ) : null,
        )}
        <Layer cam={cam} depth={1}>
          <g transform={`translate(${s.ex} ${GROUND}) scale(${ES * s.flip} ${ES})`} style={drain > 0 ? { filter: `saturate(${1 - 0.8 * drain}) brightness(${1 - 0.3 * drain})` } : undefined}>
            <Airavata
              t={f}
              step={f < 690 ? f / 7 : f > 1000 ? f / 6 : Math.PI / 2}
              walk={f < 690 ? s.walk : f > 1000 ? s.walk : s.stomp}
              flap={0.35 + 0.6 * bump(f, 664, 700) + 0.4 * bump(f, 752, 790)}
              trunkCurl={trunkCurl + 0.6 * bump(f, 752, 800)}
              trunkSway={1 + trunkCurl}
              rider={
                <g transform={`translate(${AIRAVATA_SEAT[0]} ${AIRAVATA_SEAT[1]})`}>
                  <Puppet id="s4-indra" who="indra" at={{ x: 0, y: 0, s: RS, facing: 1 }} p={s.indra} t={f} backProp={<Vajra glow={0.3 * (1 - drain)} />} noLegs />
                </g>
              }
              riderLegs={
                <g transform={`translate(${AIRAVATA_SEAT[0]} ${AIRAVATA_SEAT[1]}) scale(${RS})`}>
                  <SeatedLegs who="indra" swing={Math.sin(f / 14) * 4} />
                </g>
              }
            />
          </g>
          {/* glory (aishwarya) leaving Indra and sinking toward the ocean */}
          {f > 884 && f < 1000 ? (
            <g>
              {new Array(34).fill(0).map((_, i) => {
                const u = ramp(f, 884 + i * 1.6, 940 + i * 1.6, "in");
                if (u <= 0 || u >= 1) return null;
                const x = crownW[0] + Math.sin(i * 1.7 + u * 5) * 60 * u + (rnd(`gl${i}`) - 0.5) * 80;
                const y = crownW[1] + u * (H - crownW[1] + 200);
                return <circle key={i} cx={x} cy={y} r={5 + rnd(`gr${i}`) * 6} fill="#FFD36B" opacity={(1 - u) * 0.95} filter="url(#mGlow)" />;
              })}
            </g>
          ) : null}
          {/* the garland */}
          {!inHand ? (
            <g transform={`translate(${gPos[0]} ${gPos[1]}) rotate(${gRot}) scale(0.62 ${0.62 * squash})`} opacity={(f > 712 ? 0.8 : 1) * (1 - burn)}>
              <Garland t={f} r={44} glow={f > 712 ? 0 : 0.8} />
            </g>
          ) : null}
          {f > CUES.stomp1 - 1 && f < CUES.stomp1 + 26 ? (
            <g opacity={1 - ramp(f, CUES.stomp1, CUES.stomp1 + 26)}>
              {new Array(9).fill(0).map((_, i) => (
                <circle key={i} cx={groundG[0] + (i - 4) * 26 * (1 + ramp(f, CUES.stomp1, CUES.stomp1 + 26) * 2)} cy={GROUND - 10 - ramp(f, CUES.stomp1, CUES.stomp1 + 26) * 40 * (1 - Math.abs(i - 4) / 5)} r={14 + ramp(f, CUES.stomp1, CUES.stomp1 + 26) * 18} fill="#FFFFFF" opacity={0.7} />
              ))}
            </g>
          ) : null}
          {/* Durvasa (leaves in a puff of ash once the curse is spoken) */}
          {s.leave < 1 ? (
            <g opacity={1 - s.leave}>
              <Puppet id="s4-dur" who="durvasa" at={DUR_AT} p={s.dur} t={f} prop={inHand ? <Garland t={f} r={40} glow={0.9} /> : undefined} backProp={<Danda />} />
            </g>
          ) : null}
          {f > 968 && f < 1010 ? (
            <g opacity={1 - ramp(f, 990, 1010)}>
              {new Array(10).fill(0).map((_, i) => (
                <circle key={i} cx={DUR_AT.x + (rnd(`ash${i}`) - 0.5) * 220 * (0.4 + ramp(f, 968, 1010))} cy={DUR_AT.y - 150 + (rnd(`asy${i}`) - 0.5) * 380 - ramp(f, 968, 1010) * 120} r={30 + ramp(f, 968, 1010) * 50} fill="#C9C2B6" opacity={0.5} />
              ))}
            </g>
          ) : null}
        </Layer>
        {/* impact frames: brief negative-white */}
        {[CUES.thunder1, CUES.thunder2].map((at) => (f >= at && f < at + 3 ? <rect key={at} width={W} height={H} fill="#FFFFFF" opacity={0.75 - (f - at) * 0.2} /> : null))}
        <Vignette o={0.8 + 0.2 * storm} />
      </World>
      <FocusLines f={f} cx={540} cy={760} rx={360} ry={520} count={90} color="#140A12" opacity={0.85 * (1 - ramp(f, CUES.thunder1, CUES.thunder1 + 22)) * (f >= CUES.thunder1 ? 1 : 0)} seed="fl1" />
      <FocusLines f={f} cx={600} cy={900} rx={420} ry={600} count={80} color="#FFFFFF" opacity={0.7 * (1 - ramp(f, CUES.thunder2, CUES.thunder2 + 18)) * (f >= CUES.thunder2 ? 1 : 0)} seed="fl2" />
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Swarbhanu plant - "jiski bhookh kisi bhi ratna se badi thi"         */
/* ------------------------------------------------------------------ */

const Spear: React.FC = () => (
  <g>
    <rect x={-4} y={-330} width={8} height={560} rx={3} fill="#3A2414" />
    <path d="M0 -400L16 -330L-16 -330Z" fill="#B8C2CC" />
    <path d="M0 -400L4 -330L-4 -330Z" fill="#EEF3F7" />
    <path d="M-14 -330H14" stroke={P.gold} strokeWidth={5} />
  </g>
);

const SWB_AT: Place = { x: 540, y: GROUND - 252 * 1.15, s: 1.15, facing: 1 };

export const SwarbhanuPlant: React.FC<{ f: number }> = ({ f }) => {
  const cam: Cam = {
    x: track(f, [[1140, -30], [1381, 23, "io"]]),
    y: track(f, [[1140, 150], [1381, 81, "io"]]),
    z: track(f, [[1140, 1.12], [1240, 1.45, "io"], [1381, 2.3, "io"]]),
  };
  const hunger = ramp(f, 1256, 1300, "io");
  const p: Pose = pose({
    ...idle("swb-plant", f, 0.4),
    sF: 10 + 6 * hunger,
    eF: track(f, [[1140, 30], [1256, 30], [1300, 96, "io"]]),
    sB: -12,
    eB: 74,
    head: track(f, [[1140, 2], [1290, -9, "io"]]),
    smile: 0.3 + 0.6 * hunger,
    browTilt: 6 + 6 * hunger,
    lookX: track(f, [[1140, 0.9], [1290, 0.2, "io"]]),
    lookY: track(f, [[1140, 0], [1290, -0.7, "io"]]),
    fist: hunger > 0.5 ? 1 : 0,
    glow: 0.25 + 0.5 * ramp(f, CUES.eyeGlint, CUES.eyeGlint + 10),
    blink: f > 1290 ? 0 : blinkAt("swb", f),
  });
  // eye reflections of the Sun and the Moon (the two he will hunt)
  const refl = ramp(f, 1300, 1330);
  const eyes: [number, number][] = [
    [SWB_AT.x + SWB_AT.s * 11.2, SWB_AT.y + p.bob + SWB_AT.s * -295.6],
    [SWB_AT.x + SWB_AT.s * 40.4, SWB_AT.y + p.bob + SWB_AT.s * -295.6],
  ];
  return (
    <World>
      <Swarga f={f + 400} cam={cam} uid="s6" storm={0.45} burn={1} army={1} />
      {/* the Sun and the Moon above the smoke */}
      <Layer cam={cam} depth={0.15}>
        <circle cx={250} cy={360} r={76} fill="#FF9A3A" opacity={0.95} />
        <circle cx={250} cy={360} r={130} fill="#FF9A3A" opacity={0.2} />
        <path d="M880 300a70 70 0 1 0 40 128a56 56 0 1 1 -40 -128Z" fill="#EAE6F6" opacity={0.95} />
      </Layer>
      <Layer cam={cam} depth={1}>
        {/* asura ranks: mid-ground soldiers and two big foreground spearmen */}
        {[300, 780].map((x, i) => (
          <Puppet key={x} id={`pl-a${i}`} who="asura" at={{ x, y: GROUND - 252 * 0.85 - 40, s: 0.85, facing: i ? -1 : 1 }} p={pose({ ...idle(`a${i}`, f, 0.6), sF: 40, eF: 70, browTilt: 14 })} t={f} prop={<Spear />} upright />
        ))}
        <Puppet id="pl-swb" who="swarbhanu" at={SWB_AT} p={p} t={f} />
        {refl > 0 ? (
          <g opacity={refl}>
            {eyes.map(([x, y], i) => (
              <g key={i} transform={`translate(${x} ${y})`}>
                <circle cx={-1.6} cy={-1.4} r={1.9} fill="#FFB04A" />
                <path d="M2 -2.6a1.8 1.8 0 1 0 1.2 3.2a1.4 1.4 0 1 1 -1.2 -3.2Z" fill="#F2F0FF" />
              </g>
            ))}
          </g>
        ) : null}
        {[-1, 1].map((sd, i) => (
          <Puppet key={sd} id={`pl-f${i}`} who="asura" at={{ x: 540 + sd * 470, y: GROUND - 252 * 1.5 + 260, s: 1.5, facing: -sd }} p={pose({ ...idle(`f${i}`, f, 0.4), sF: 30, eF: 80, browTilt: 18, lookX: 0.3 })} t={f} prop={<Spear />} drain={0.35} />
        ))}
      </Layer>
      <rect width={W} height={H} fill="#24163F" opacity={0.18 * ramp(f, 1300, 1381)} />
      <Vignette o={1} />
    </World>
  );
};
