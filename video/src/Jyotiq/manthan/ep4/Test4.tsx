import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { RigDefs } from "../rig";
import { SetDefs } from "../sets";
import { H, W } from "../style";
import { BrandBug, NameCard } from "../graphics";
import { BEATS, CUES, SCENES } from "./timing";
import { Captions4, EndCard4, EndKundali4, HookAnswer, HookText4, TitleCard4 } from "./gfx4";
import { KailashBg } from "./kailash4";
import { ShivaSeated, Trishul } from "./cast4";
import { Cobra, PoisonDrop, Scorpion } from "./creatures4";
import { Kneeler, Runner } from "./armies4";
import { ParvatiSeated } from "./parvati";

/* Review sheet for Episode 4's new art: four half-size panels in one 1080x1920 frame. */
const Panel: React.FC<{ i: number; children: React.ReactNode; zoom?: [number, number, number] }> = ({ i, children, zoom }) => {
  const x = (i % 2) * (W / 2);
  const y = Math.floor(i / 2) * (H / 2);
  const [zx, zy, z] = zoom ?? [W / 2, H / 2, 1];
  return (
    <g transform={`translate(${x} ${y}) scale(0.5)`}>
      <clipPath id={`p4c${i}`}>
        <rect x={0} y={0} width={W} height={H} />
      </clipPath>
      <g clipPath={`url(#p4c${i})`}>
        <g transform={`translate(${W / 2} ${H / 2}) scale(${z}) translate(${-zx} ${-zy})`}>{children}</g>
      </g>
      <rect x={0} y={0} width={W} height={H} fill="none" stroke="#FFFFFF" strokeWidth={4} opacity={0.5} />
    </g>
  );
};

/* Graphics check: frame i of this 5-frame composition shows episode frame GFX_AT[i]. */
export const GFX_AT = [20, 168, 650, 1030, 1600];
export const ManthanEp4GfxTest: React.FC = () => {
  const i = useCurrentFrame();
  const f = GFX_AT[Math.min(GFX_AT.length - 1, i)];
  return (
    <AbsoluteFill style={{ background: "#0C1028" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <RigDefs />
        <SetDefs />
        <KailashBg f={f} />
        {f >= CUES.endCard ? <rect x={0} y={0} width={W} height={H} fill="#0C0A07" opacity={0.55} /> : null}
        <EndKundali4 f={f} at={CUES.endCard} />
      </svg>
      <HookText4 f={f} out={BEATS.title[0]} />
      <TitleCard4 f={f} at={SCENES.title[0] - 6} out={SCENES.title[1] - 4} />
      <HookAnswer f={f} at={CUES.haan} out={SCENES.parvati[1]} />
      <NameCard f={f} at={CUES.neelkanth} out={CUES.neelkanth + 75} name="NEELKANTH" deva="नीलकंठ" tag="जिसने विष को कंठ में रोका" y={360} />
      <Captions4 f={f} y={1300} />
      <EndCard4 f={f} at={CUES.endCard} />
      <BrandBug o={f >= SCENES.title[1] && f < CUES.endCard ? 1 : 0} />
    </AbsoluteFill>
  );
};

export const ManthanEp4Test: React.FC = () => {
  const f = useCurrentFrame();
  // scale 0.8 with the waist at y 1434 puts the throat on Episode 3's silhouette throat (560, 1264)
  // and the pelt on the silhouette's base (y ~1538)
  const shiva = (extra: Partial<React.ComponentProps<typeof ShivaSeated>> = {}) => (
    <ShivaSeated id="t4s" f={f} x={560} y={1434} s={0.8} facing={1} eyes={1} throat={0.6} {...extra} />
  );
  const trishul = (
    <g transform="translate(712 1530) scale(0.8)">
      <Trishul f={f} />
    </g>
  );
  const couple = (shivaExtra: Partial<React.ComponentProps<typeof ShivaSeated>>, pv: Partial<React.ComponentProps<typeof ParvatiSeated>>) => (
    <g>
      {trishul}
      <ParvatiSeated id="t4p" f={f} x={748} y={1452} s={0.72} facing={-1} part="body" {...pv} />
      {shiva(shivaExtra)}
      <ParvatiSeated id="t4p" f={f} x={748} y={1452} s={0.72} facing={-1} part="arm" {...pv} />
    </g>
  );
  return (
    <AbsoluteFill style={{ background: "#0C1028" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <RigDefs />
        <SetDefs />
        {/* A: the armies: five runners up the snow (top), Indra and Bali kneeling side by side (bottom) */}
        <Panel i={0}>
          <KailashBg f={f} />
          <path d="M0 900L1080 640L1080 1060L0 1240Z" fill="#C9D5EE" />
          <path d="M0 900L1080 640" stroke="#F2F6FF" strokeWidth={6} />
          {([
            ["deva", 140, 0.36],
            ["asura", 320, 0.38],
            ["swarbhanu", 500, 0.4],
            ["surya", 680, 0.38],
            ["asuraJade", 860, 0.36],
          ] as const).map(([who, x, s], i) => (
            <Runner key={who} m={{ who: who as never, id: `r${i}`, x, base: 900 - (x / 1080) * 260 + 40, s, facing: 1 }} f={f + i * 3} />
          ))}
          <path d="M0 1500C300 1460 700 1470 1080 1500L1080 1920L0 1920Z" fill="#C9D5EE" />
          <Kneeler m={{ who: "bali", id: "kb", x: 380, base: 1640, s: 0.62, facing: 1 }} f={f} />
          <Kneeler m={{ who: "indra", id: "ki", x: 620, base: 1650, s: 0.62, facing: 1 }} f={f} talk={0.5} />
        </Panel>
        {/* B: Shiva turns to Parvati (two-shot, medium) */}
        <Panel i={1} zoom={[640, 1310, 1.7]}>
          <KailashBg f={f} />
          {couple({ throat: 0, p: { lookX: 0.9, head: 4, smile: 0.3 } }, { reach: 0, nod: 0, lookX: 0.8 })}
        </Panel>
        {/* C: the spilled drops become serpents and scorpions (plain on the left, glowing on the right) */}
        <Panel i={2} zoom={[540, 1500, 2.2]}>
          <KailashBg f={f} />
          <path d="M200 1440C320 1400 460 1410 560 1420C700 1434 820 1410 900 1430L900 1760L200 1760Z" fill="#C9D5EE" />
          <path d="M200 1440C320 1400 460 1410 560 1420C700 1434 820 1410 900 1430" stroke="#F2F6FF" strokeWidth={6} fill="none" />
          <path d="M200 1600C360 1580 520 1640 900 1600L900 1760L200 1760Z" fill="#9FB0D6" opacity={0.6} />
          <g transform="translate(400 1560)">
            <Cobra f={f} s={1} glow={0} />
          </g>
          <g transform="translate(560 1580)">
            <Scorpion f={f} s={0.9} glow={0} />
          </g>
          <g transform="translate(680 1560)">
            <Cobra f={f} s={1} glow={1} facing={-1} />
          </g>
          <g transform="translate(560 1660)">
            <Scorpion f={f} s={0.9} glow={1} facing={-1} />
          </g>
          <g transform="translate(470 1420)">
            <PoisonDrop r={9} stretch={1.6} />
          </g>
          <g transform="translate(640 1450)">
            <PoisonDrop r={7} stretch={1} />
          </g>
        </Panel>
        {/* D: close two-shot, her hand on his shoulder, her nod */}
        <Panel i={3} zoom={[660, 1250, 3.0]}>
          <KailashBg f={f} />
          {couple({ throat: 0, talk: 0.4, p: { lookX: 0.9, head: 4, smile: 0.35 } }, { reach: 1, nod: 0.6, lookX: 0.8, smile: 0.55 })}
        </Panel>
      </svg>
    </AbsoluteFill>
  );
};
