import React from "react";
import { AbsoluteFill, Audio, Img, useCurrentFrame } from "remotion";
import { CompeteScene, GtmScene, MarketScene, ModelScene } from "./scenes/Business";
import { AskScene, CloseScene } from "./scenes/Finale";
import { GateScene, ProblemScene, ScaleScene } from "./scenes/Mela";
import { Open } from "./scenes/Open";
import { PlanScene, TeamScene, TractionScene } from "./scenes/Proof";
import { SystemScene } from "./scenes/System";
import { C, FPS, KARLA, prog, SCENES } from "./theme";
import { asset, Crumbs, Win } from "./ui";

const SECTION_AT: [number, number][] = [
  [17.6, 0],
  [32.4, 1],
  [35.6, 2],
  [57.8, 3],
  [72.6, 4],
  [81.8, 5],
  [89.3, 6],
  [95.0, 7],
  [102.5, 8],
  [112.4, 9],
];

const Chrome: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  if (t < 17.4 || t > 117.2) return null;
  let active = 0;
  for (const [s, i] of SECTION_AT) if (t >= s) active = i;
  const dark = t > 35.3 && t < 58.0;
  const fade = prog(t, 17.5, 0.6) * (1 - prog(t, 116.4, 0.6));
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Crumbs active={active} light={dark} t={t} a={0} b={999} />
      <div style={{ position: "absolute", right: 70, top: 56, display: "flex", alignItems: "center", gap: 12, opacity: 0.9 }}>
        <Img src={asset("brand/icon_4x.png")} style={{ height: 34 }} />
        <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 18, letterSpacing: "0.16em", color: dark ? "rgba(255,240,220,0.8)" : C.ink2 }}>ASTRORAAGA · INVESTOR PREVIEW</div>
      </div>
    </AbsoluteFill>
  );
};

export const Pitch: React.FC<{ withAudio?: boolean }> = ({ withAudio = true }) => {
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Win a={SCENES.open[0]} b={SCENES.open[1]} name="open">
        <Open />
      </Win>
      <Win a={SCENES.gate[0]} b={SCENES.gate[1]} name="gate">
        <GateScene />
      </Win>
      <Win a={SCENES.problem[0]} b={SCENES.problem[1]} name="problem">
        <ProblemScene />
      </Win>
      <Win a={SCENES.scale[0]} b={SCENES.scale[1]} name="scale">
        <ScaleScene />
      </Win>
      <Win a={SCENES.system[0]} b={SCENES.system[1]} name="system">
        <SystemScene />
      </Win>
      <Win a={SCENES.market[0]} b={SCENES.market[1]} name="market">
        <MarketScene />
      </Win>
      <Win a={SCENES.compete[0]} b={SCENES.compete[1]} name="compete">
        <CompeteScene />
      </Win>
      <Win a={SCENES.gtm[0]} b={SCENES.gtm[1]} name="gtm">
        <GtmScene />
      </Win>
      <Win a={SCENES.model[0]} b={SCENES.model[1]} name="model">
        <ModelScene />
      </Win>
      <Win a={SCENES.traction[0]} b={SCENES.traction[1]} name="traction">
        <TractionScene />
      </Win>
      <Win a={SCENES.plan[0]} b={SCENES.plan[1]} name="plan">
        <PlanScene />
      </Win>
      <Win a={SCENES.team[0]} b={SCENES.team[1]} name="team">
        <TeamScene />
      </Win>
      <Win a={SCENES.ask[0]} b={SCENES.ask[1]} name="ask">
        <AskScene />
      </Win>
      <Win a={SCENES.close[0]} b={SCENES.close[1]} name="close">
        <CloseScene />
      </Win>
      <Chrome />
      {withAudio && (
        <>
          <Audio src={asset("audio/vo.wav")} />
          <Audio src={asset("audio/score.wav")} volume={0.22} />
        </>
      )}
    </AbsoluteFill>
  );
};
