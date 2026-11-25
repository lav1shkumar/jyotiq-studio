import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { blinkAt, Danda, Garland, idle, Kamandalu, pose, Puppet, RigDefs, Vajra, Who } from "./rig";
import { H, W } from "./style";
import { AmritHall, AsuraCourt, CAM0, KshiraSagar, SetDefs, Swarga, Vignette } from "./sets";
import { BrandBug, Captions, Eclipse, EndCard, KundaliGrid, NameCard, PlanArt, TitleCard } from "./graphics";
import { AIRAVATA_SEAT, Airavata, SeatedLegs, VishnuOnShesha } from "./beings";

/* Character line-up for reviewing the rig (not part of the reel). */
const CAST: { who: Who; label: string; x: number; y: number }[] = [
  { who: "indra", label: "Indra", x: 190, y: 760 },
  { who: "durvasa", label: "Durvasa", x: 540, y: 760 },
  { who: "swarbhanu", label: "Swarbhanu", x: 890, y: 760 },
  { who: "bali", label: "Bali", x: 190, y: 1640 },
  { who: "deva", label: "Deva", x: 540, y: 1640 },
  { who: "asura", label: "Asura", x: 890, y: 1640 },
];

/* Close-up review: head + shoulders at the scale the reel's close-ups use. */
const FACES: { who: Who; over: Record<string, number>; bg: string }[] = [
  { who: "indra", over: { smile: 0.5, browTilt: -2, lookX: 0.8 }, bg: "#2B3E7A" },
  { who: "durvasa", over: { talk: 0.8, browTilt: 22, glow: 0.9, lookX: 1 }, bg: "#5A1A12" },
  { who: "swarbhanu", over: { smile: 0.9, browTilt: 8, lookX: 0.4, lookY: -0.3 }, bg: "#24163F" },
];

export const ManthanFaceTest: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#100A12" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <RigDefs />
        {FACES.map((c, i) => {
          const top = i * 640;
          return (
            <g key={c.who}>
              <clipPath id={`fp-${i}`}>
                <rect x={0} y={top} width={W} height={636} />
              </clipPath>
              <g clipPath={`url(#fp-${i})`}>
                <rect x={0} y={top} width={W} height={640} fill={c.bg} />
                <Puppet
                  id={`f-${c.who}`}
                  who={c.who}
                  at={{ x: 470, y: top + 1060, s: 2.4, facing: 1 }}
                  p={pose({ ...c.over, sF: 6, eF: 8 })}
                  t={f}
                />
              </g>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

export const ManthanRigTest: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#3B1A2A, #120A18)" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <RigDefs />
        {CAST.map((c, i) => {
          const p = pose({
            ...idle(c.who, f),
            blink: blinkAt(c.who, f),
            talk: i % 2 ? 0.55 : 0,
            browTilt: c.who === "durvasa" || c.who === "asura" ? 14 : c.who === "swarbhanu" ? 6 : 0,
            smile: c.who === "swarbhanu" ? 0.8 : 0,
            sF: c.who === "indra" ? 40 : c.who === "durvasa" ? 18 : 10,
            eF: c.who === "indra" ? 60 : 30,
            glow: c.who === "durvasa" ? 0.6 : 0,
          });
          const prop =
            c.who === "indra" ? <Vajra glow={0.6} /> : c.who === "durvasa" ? <Danda /> : c.who === "deva" ? <Garland t={f} r={34} /> : undefined;
          return (
            <g key={c.who}>
              <Puppet
                id={`t-${c.who}`}
                who={c.who}
                at={{ x: c.x, y: c.y, s: 0.62, facing: i < 3 ? 1 : -1 }}
                p={p}
                t={f}
                prop={prop}
                backProp={c.who === "durvasa" ? <Kamandalu /> : undefined}
              />
              <text x={c.x} y={c.y + 210} textAnchor="middle" fill="#FFE6A3" fontSize={34} fontFamily="Georgia">
                {c.label}
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

/* Beings review: Airavata with Indra riding, and Vishnu on Shesha. */
export const ManthanBeingsTest: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#5B86C8, #F4E3C2 46%, #1C2C5A 52%, #0C1630)" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <RigDefs />
        <g transform="translate(400 860) scale(0.86)">
          <Airavata
            t={f}
            step={f / 9}
            walk={0.6}
            flap={0.4}
            rider={
              <g transform={`translate(${AIRAVATA_SEAT[0]} ${AIRAVATA_SEAT[1]})`}>
                <Puppet id="ride-indra" who="indra" at={{ x: 0, y: 0, s: 0.74, facing: 1 }} p={pose({ ...idle("indra", f), sF: 50, eF: 70, smile: 0.4 })} t={f} prop={<Vajra />} noLegs />
              </g>
            }
            riderLegs={
              <g transform={`translate(${AIRAVATA_SEAT[0]} ${AIRAVATA_SEAT[1]}) scale(0.74)`}>
                <SeatedLegs who="indra" />
              </g>
            }
          />
        </g>
        <g transform="translate(540 1610) scale(0.9)">
          <VishnuOnShesha t={f} reveal={1} speak={0.3} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* Sets review: six backgrounds at 1/3 size. */
export const ManthanSetsTest: React.FC = () => {
  const f = useCurrentFrame();
  const panels: React.ReactNode[] = [
    <AmritHall key="a" f={f} cam={CAM0} />,
    <Swarga key="b" f={f} cam={CAM0} uid="b" />,
    <Swarga key="c" f={f} cam={CAM0} storm={1} flash={0.3} uid="c" />,
    <Swarga key="d" f={f} cam={CAM0} storm={0.6} burn={1} army={1} uid="d" />,
    <KshiraSagar key="e" f={f} cam={CAM0} glow={0.7} swell={0.5} />,
    <AsuraCourt key="g" f={f} cam={CAM0} />,
  ];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <RigDefs />
        <SetDefs />
        {panels.map((pn, i) => (
          <svg key={i} x={(i % 3) * 360} y={Math.floor(i / 3) * 640} width={356} height={636} viewBox={`0 0 ${W} ${H}`}>
            {pn}
            <Vignette />
          </svg>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

/* Graphics review: A = kundali/eclipse/plan/name card/caption, B = title, C = end card. */
export const ManthanGfxTest: React.FC = () => {
  const f = useCurrentFrame();
  const panel = Math.floor(f / 100);
  const lf = f % 100;
  return (
    <AbsoluteFill style={{ background: "#0C0A07" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <RigDefs />
        <SetDefs />
        {panel === 0 ? (
          <g>
            <KshiraSagar f={f} cam={CAM0} glow={0.3} />
            <KundaliGrid f={f} cx={300} cy={330} size={380} d={1} glyphs={1} />
            <Eclipse f={f} e={0.95} cx={800} cy={330} r={110} />
            <PlanArt f={f} d={1} x={540} y={900} s={0.9} />
          </g>
        ) : (
          <g>
            <Swarga f={f} cam={CAM0} storm={0.7} burn={panel === 2 ? 0 : 0.6} uid="g" />
            <rect width={W} height={H} fill="#0C0A07" opacity={0.72} />
          </g>
        )}
        <Vignette />
      </svg>
      {panel === 0 ? (
        <>
          <NameCard f={lf + 20} at={0} out={200} name="SWARBHANU" deva="स्वर्भानु" tag="Woh asur jisne Vishnu ko chhala" y={1080} />
          <Captions f={100} />
          <BrandBug o={1} />
        </>
      ) : panel === 1 ? (
        <TitleCard f={lf + 40} at={0} out={300} />
      ) : (
        <EndCard f={lf + 80} at={0} />
      )}
    </AbsoluteFill>
  );
};
