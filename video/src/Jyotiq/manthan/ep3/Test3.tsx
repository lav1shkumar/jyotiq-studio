import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { RigDefs } from "../rig";
import { SetDefs } from "../sets";
import { H, W } from "../style";
import { KurmaGlow } from "../ep2/beings3";
import { KurmaEye, KurmaFull } from "./kurma";
import { Boil, FireBreath, HalahalaColumn, RainClouds, SmokeDrift, Wither } from "./fx";
import { Kailash } from "./kailash";
import { Captions3, EndCard3, EndKundali3, HookText, TitleCard3 } from "./gfx3";
import { BrandBug, NameCard } from "../graphics";
import { BEATS, CUES, TOTAL } from "./timing";
import { ChurnStage } from "./stage3";
import { CAM0 } from "../sets";
import { World } from "../kit";

/* Episode 3 review: the churning stage (not in the reel). */
export const ManthanEp3StageTest: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#0E0A12" }}>
      <World>
        <ChurnStage f={f} cam={CAM0} fx={{ heat: 0.7, fire: 0.8, rain: 0.8, spin: 0.6 * Math.sin(f / 13), heave: 0.6 }} />
      </World>
    </AbsoluteFill>
  );
};

export const EP3_GFX_TOTAL = TOTAL;

/* Episode 3 review: every graphic on the real clock over a plain night background (not in the reel). */
export const ManthanEp3GfxTest: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#141B44, #2A2F6A 60%, #0C1230)" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <RigDefs />
        <EndKundali3 f={f} at={CUES.endCard} />
      </svg>
      <HookText f={f} out={BEATS.title[0]} />
      <TitleCard3 f={f} at={BEATS.title[0]} out={BEATS.title[1]} />
      <NameCard f={f} at={CUES.kurmaName} out={CUES.kurmaName + 75} name="KURMA" deva="कूर्म" tag="विष्णु का दूसरा अवतार" y={980} />
      <Captions3 f={f} />
      <EndCard3 f={f} at={CUES.endCard} />
      <BrandBug o={f < BEATS.title[0] || f > BEATS.title[1] ? 1 : 0} />
    </AbsoluteFill>
  );
};

/* Episode 3 review still: the new effects and the Kailash cliffhanger set (not in the reel). */
export const ManthanEp3FxTest: React.FC = () => {
  const f = useCurrentFrame();
  const panel = (i: number, bg: string, body: React.ReactNode, vb = "0 0 540 640") => (
    <svg key={i} x={(i % 2) * 540} y={Math.floor(i / 2) * 640} width={540} height={640} viewBox={vb}>
      {vb === "0 0 540 640" ? <rect x={0} y={0} width={540} height={640} fill={bg} /> : null}
      {body}
    </svg>
  );
  return (
    <AbsoluteFill style={{ background: "#0E0A12" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <RigDefs />
        <SetDefs />
        {panel(0, "#1A1030", <FireBreath x={40} y={320} ang={-8} len={460} power={1} f={f} />)}
        {panel(
          1,
          "#2A2F6A",
          <g>
            <rect x={0} y={0} width={270} height={640} fill="#3A1A1A" />
            <SmokeDrift x0={0} y0={120} w={270} h={420} density={0.9} f={f} />
            <RainClouds x0={270} y0={90} w={270} h={500} f={f} o={1} rain={1} />
          </g>,
        )}
        {panel(
          2,
          "#2A2F6A",
          <g>
            <rect x={0} y={260} width={540} height={380} fill="#EEE8F4" />
            <Boil cx={270} cy={420} w={480} h={220} level={0.8} f={f} />
          </g>,
        )}
        {panel(
          3,
          "#0C1230",
          <g>
            <rect x={0} y={560} width={540} height={80} fill="#3A4470" />
            <g transform="translate(270 600)">
              <HalahalaColumn height={520} rise={1} f={f} w={110} />
            </g>
          </g>,
        )}
        {panel(
          4,
          "#2A2F6A",
          <g>
            <rect x={0} y={560} width={540} height={80} fill="#5A4E3A" />
            <g transform="translate(0 560)">
              <Wither w={540} amount={0.6} f={f} />
            </g>
          </g>,
        )}
        {panel(5, "#000", <Kailash f={f} />, "0 280 1080 1280")}
      </svg>
    </AbsoluteFill>
  );
};

/* Episode 3 review still: Kurma's eye, Kurma carrying Mandar, and Episode 2's KurmaGlow for comparison (not in the reel). */
export const ManthanEp3Test: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#141B44, #2A2F6A 60%, #0C1230)" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <RigDefs />
        <SetDefs />
        <clipPath id="t3eye">
          <rect x={40} y={40} width={1000} height={600} rx={24} />
        </clipPath>
        <g clipPath="url(#t3eye)">
          <g transform="translate(540 340)">
            <KurmaEye id="t3" t={f} open={0.9} flash={0.6} s={0.75} />
          </g>
        </g>
        <rect x={40} y={40} width={1000} height={600} rx={24} fill="none" stroke="#FFD27A" strokeWidth={3} opacity={0.7} />
        <g transform="translate(475 1283) scale(0.36)">
          <KurmaFull id="t3" t={f} eye={1} glow={1} wet={1} />
        </g>
        <rect x={0} y={1470} width={W} height={450} fill="#EEE8F4" opacity={0.85} />
        <path d="M0 1470Q270 1454 540 1470T1080 1470" stroke="#FFFFFF" strokeWidth={6} fill="none" />
        <g transform="translate(300 1730) scale(0.3)">
          <KurmaGlow id="t3g" t={f} glow={1} eye={1} />
        </g>
        <text x={40} y={1890} fill="#2A2F6A" fontSize={26} fontFamily="Georgia">
          inset: Episode 2 KurmaGlow (continuity reference)
        </text>
      </svg>
    </AbsoluteFill>
  );
};
