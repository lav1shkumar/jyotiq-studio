import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { RigDefs, Puppet, pose, Vajra } from "../rig";
import { Airavata } from "../beings";
import { CAM0, KshiraSagar, SetDefs } from "../sets";
import { H, W } from "../style";
import { VishnuStanding } from "../ep2/beings3";
import { GiantLotus, LakshmiStanding, LotusPad, Varmala } from "./lakshmi";
import { Kamadhenu, Uchchaihshravas } from "./beasts5";
import { EmptySetting, GURU, Kaustubha, Pothi, RISHI, TapasAura } from "./cast5";
import { BrandBug } from "../graphics";
import { BEATS, CUES, SCENES } from "./timing";
import { AskAnswer5, Captions5, EndCard5, EndKundali5, HookPoll5, TitleCard5, Toasts5, XTag } from "./gfx5";

/* Review sheet for Episode 5's new art: four half-size panels in one 1080x1920 frame. */
const Panel: React.FC<{ i: number; children: React.ReactNode; zoom?: [number, number, number] }> = ({ i, children, zoom }) => {
  const x = (i % 2) * (W / 2);
  const y = Math.floor(i / 2) * (H / 2);
  const [zx, zy, z] = zoom ?? [W / 2, H / 2, 1];
  return (
    <g transform={`translate(${x} ${y}) scale(0.5)`}>
      <clipPath id={`p5c${i}`}>
        <rect x={0} y={0} width={W} height={H} />
      </clipPath>
      <g clipPath={`url(#p5c${i})`}>
        <g transform={`translate(${W / 2} ${H / 2}) scale(${z}) translate(${-zx} ${-zy})`}>{children}</g>
      </g>
      <rect x={0} y={0} width={W} height={H} fill="none" stroke="#FFFFFF" strokeWidth={4} opacity={0.5} />
    </g>
  );
};

const Sea: React.FC<{ f: number; glow?: number }> = ({ f, glow = 0.7 }) => <KshiraSagar f={f} cam={CAM0} glow={glow} />;

/* Sheet C (frames 90-119): Durvasa's anger and the learned sage, Bali and Indra, the gem, Airavata. */
const CastSheet: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ background: "#0C1028" }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <RigDefs />
      <SetDefs />
      <Panel i={0}>
        <Sea f={f} glow={0.3} />
        <g transform="translate(330 1020)">
          <TapasAura f={f} r={230} anger={1} />
        </g>
        <Puppet id="tdv" who="durvasa" at={{ x: 330, y: 1240, s: 1.05, facing: 1 }} p={pose({ browTilt: 22, brow: 0.2, glow: 1, fist: 1, sF: 40, eF: 60 })} t={f} />
        <g transform="translate(770 1000)">
          <TapasAura f={f} r={200} anger={0} o={0.7} />
        </g>
        <Puppet id="tgu" who={GURU} at={{ x: 760, y: 1240, s: 1.05, facing: -1 }} p={pose({ sF: 30, eF: 70, lookX: -0.8, lookY: 0.6 })} t={f} prop={<Pothi glow={1} f={f} />} />
      </Panel>
      <Panel i={1}>
        <Sea f={f} glow={0.3} />
        <Puppet id="tba" who="bali" at={{ x: 320, y: 1240, s: 1.05, facing: 1 }} p={pose({ talk: 0.7, fist: 1, sF: 70, eF: 30, browTilt: 8 })} t={f} />
        <Puppet id="tin" who="indra" at={{ x: 760, y: 1240, s: 1.05, facing: -1 }} p={pose({ smile: 0.6, sF: 60, eF: 50 })} t={f} prop={<Vajra glow={0.6} />} />
        <Puppet id="tri" who={RISHI} at={{ x: 540, y: 1700, s: 0.8, facing: 1 }} p={pose({ smile: 0.5 })} t={f} />
      </Panel>
      <Panel i={2}>
        <Sea f={f} glow={0.4} />
        <g transform="translate(540 560)">
          <Kaustubha f={f} s={3} />
        </g>
        <g transform="translate(540 1820) scale(0.95)" filter="url(#mCut)">
          <VishnuStanding t={f} closed={0} smile={0.4} halo={0.7} />
          <g transform="translate(0 -566)">
            <EmptySetting />
          </g>
        </g>
      </Panel>
      <Panel i={3}>
        <Sea f={f} glow={0.4} />
        <g transform="translate(180 1520) scale(0.95)" filter="url(#mCut)">
          <Airavata t={f} trunkCurl={0.8} flap={0.5} />
        </g>
      </Panel>
    </svg>
  </AbsoluteFill>
);

/* Sheet B (frames 60-89): Kamadhenu standing / walking, Uchchaihshravas standing / rearing. */
const BeastSheet: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ background: "#0C1028" }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <RigDefs />
      <SetDefs />
      <Panel i={0}>
        <Sea f={f} glow={0.5} />
        <Kamadhenu id="tk1" f={f} x={500} y={1500} s={1.5} />
      </Panel>
      <Panel i={1} zoom={[700, 1500 - 1.5 * 260, 2.2]}>
        <Sea f={f} glow={0.5} />
        <Kamadhenu id="tk2" f={f} x={500} y={1500} s={1.5} walk={1} />
      </Panel>
      <Panel i={2}>
        <Sea f={f} glow={0.4} />
        <Uchchaihshravas id="th1" f={f} x={480} y={1500} s={1.5} />
      </Panel>
      <Panel i={3}>
        <Sea f={f} glow={0.4} />
        <Uchchaihshravas id="th2" f={f} x={460} y={1560} s={1.5} rear={1} wind={1} />
      </Panel>
    </svg>
  </AbsoluteFill>
);

/* Graphics check: frame i of this composition shows episode frame GFX_AT[i]. */
export const GFX_AT = [130, 470, 655, 900, 1318, 1500, 1565, 1640];
export const ManthanEp5GfxTest: React.FC = () => {
  const i = useCurrentFrame();
  const f = GFX_AT[Math.min(GFX_AT.length - 1, i)];
  const end = f >= CUES.endCard;
  return (
    <AbsoluteFill style={{ background: "#0C1028" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <RigDefs />
        <SetDefs />
        <Sea f={f} glow={0.5} />
        {end ? <rect x={0} y={0} width={W} height={H} fill="#0C0A07" opacity={0.6} /> : null}
        <EndKundali5 f={f} at={CUES.endCard} />
      </svg>
      <HookPoll5 f={f} out={BEATS.title[0]} />
      <TitleCard5 f={f} at={SCENES.title[0] - 6} out={SCENES.title[1] - 4} />
      <Toasts5 f={f} end={SCENES.lotus[0]} />
      <AskAnswer5 f={f} at={SCENES.choice[0] + 6} answer={CUES.answer} out={SCENES.end[0]} />
      <XTag f={f} at={CUES.krodh + 4} out={CUES.kisi2 + 4} x={330} y={700} text="क्रोध" />
      <XTag f={f} at={CUES.moh + 4} out={SCENES.choice[1]} x={760} y={700} text="मोह" />
      <Captions5 f={f} y={1300} />
      <EndCard5 f={f} at={CUES.endCard} />
      <BrandBug o={f >= SCENES.title[1] && f < CUES.endCard ? 1 : 0} />
    </AbsoluteFill>
  );
};

export const ManthanEp5Test: React.FC = () => {
  const f = useCurrentFrame();
  if (f >= 90) return <CastSheet f={f} />;
  if (f >= 60) return <BeastSheet f={f} />;
  const scene = (lift: number, open: number) => (
    <g>
      <Sea f={f} />
      <LotusPad x={250} y={1330} s={1.3} rot={-8} />
      <LotusPad x={860} y={1360} s={1.1} rot={10} />
      <g transform="translate(540 1330)">
        <GiantLotus id="tl" f={f} open={open} glow={0.8} s={1.5} />
      </g>
      <LakshmiStanding id="tlk" f={f} x={540} y={1262} s={0.78} lift={lift} glow={0.6} />
    </g>
  );
  return (
    <AbsoluteFill style={{ background: "#0C1028" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <RigDefs />
        <SetDefs />
        {/* 0: Lakshmi on the open lotus */}
        <Panel i={0}>{scene(0, 1)}</Panel>
        {/* 1: her face, close */}
        <Panel i={1} zoom={[540, 1262 - 0.78 * 700, 3.2]}>
          {scene(0, 1)}
        </Panel>
        {/* 2: the two-shot at the varmala: Lakshmi lifting the garland, Vishnu with his eyes closed */}
        <Panel i={2}>
          <Sea f={f} glow={0.5} />
          <LakshmiStanding id="tlk2" f={f} x={330} y={1500} s={0.62} lift={1} lookX={0.8} smile={0.6} />
          <g transform="translate(760 1500) scale(0.62)" filter="url(#mCut)">
            <VishnuStanding t={f} closed={1} smile={0.35} halo={0.7} />
          </g>
        </Panel>
        {/* 3: the bud, the abhaya pose with gold, and the varmala alone */}
        <Panel i={3}>
          <Sea f={f} glow={0.3} />
          <g transform="translate(270 1400)">
            <GiantLotus id="tl3" f={f} open={0.15} glow={0.3} s={1.0} />
          </g>
          <LakshmiStanding id="tlk3" f={f} x={760} y={1500} s={0.6} pose="abhaya" coins={1} />
          <Varmala a={[120, 300]} b={[520, 300]} sag={200} t={f} glow={0.6} />
        </Panel>
      </svg>
    </AbsoluteFill>
  );
};
