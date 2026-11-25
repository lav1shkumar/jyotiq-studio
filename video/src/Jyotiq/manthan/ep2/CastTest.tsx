import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { blinkAt, idle, pose, Puppet, RigDefs, Vajra, Who } from "../rig";
import { H, W } from "../style";
import { Khadga, Mace, Parashu } from "./props";

/* Episode 2 cast review stills (not part of the reel). */

// Feet sit 245 local units below a puppet's origin, so at.y = baseline - 245 * s.
const LINEUP: { who: Who; label: string; x: number; base: number; s: number; face: 1 | -1 }[] = [
  { who: "indra", label: "Indra", x: 150, base: 600, s: 0.5, face: 1 },
  { who: "surya", label: "Surya", x: 410, base: 600, s: 0.5, face: 1 },
  { who: "chandra", label: "Chandra", x: 670, base: 600, s: 0.5, face: 1 },
  { who: "agni", label: "Agni", x: 930, base: 600, s: 0.5, face: 1 },
  { who: "vayu", label: "Vayu", x: 190, base: 1180, s: 0.52, face: 1 },
  { who: "deva", label: "Deva", x: 540, base: 1180, s: 0.52, face: 1 },
  { who: "swarbhanu", label: "Swarbhanu", x: 890, base: 1180, s: 0.52, face: -1 },
  { who: "bali", label: "Bali", x: 150, base: 1760, s: 0.5, face: -1 },
  { who: "asuraSlate", label: "General · gada", x: 410, base: 1760, s: 0.5, face: -1 },
  { who: "asuraJade", label: "General · khadga", x: 670, base: 1760, s: 0.5, face: -1 },
  { who: "asuraIron", label: "General · parashu", x: 930, base: 1760, s: 0.5, face: -1 },
];

const WEAPON: Partial<Record<Who, React.ReactNode>> = {
  indra: <Vajra glow={0.6} />,
  asuraSlate: <Mace />,
  asuraJade: <Khadga />,
  asuraIron: <Parashu />,
};

export const ManthanEp2CastTest: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#2A1A3A, #0E0A14)" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <RigDefs />
        {LINEUP.map((c) => {
          const armed = WEAPON[c.who];
          const p = pose({
            ...idle(c.who, f),
            blink: blinkAt(c.who, f),
            sF: armed ? 34 : 10,
            eF: armed ? 52 : 30,
            browTilt: c.who.startsWith("asura") ? 14 : 0,
            smile: c.who === "swarbhanu" ? 0.8 : 0,
          });
          return (
            <g key={c.who}>
              <Puppet id={`c2-${c.who}`} who={c.who} at={{ x: c.x, y: c.base - 245 * c.s, s: c.s, facing: c.face }} p={p} t={f} prop={armed} />
              <text x={c.x} y={c.base + 44} textAnchor="middle" fill="#FFE6A3" fontSize={26} fontFamily="Georgia">
                {c.label}
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

/* Close-ups at reel scale: the new devtas, Bali, and the three generals. */
const FACES2: { who: Who; label: string; over: Record<string, number>; bg: string }[] = [
  { who: "surya", label: "Surya", over: { smile: 0.4, lookX: 0.8 }, bg: "#5A2E0E" },
  { who: "chandra", label: "Chandra", over: { smile: 0.3, lookX: 0.6 }, bg: "#1E2A4A" },
  { who: "agni", label: "Agni", over: { browTilt: 8, lookX: 0.8 }, bg: "#4A120A" },
  { who: "vayu", label: "Vayu", over: { smile: 0.2, lookX: 0.9 }, bg: "#16324A" },
  { who: "bali", label: "Bali", over: { browTilt: 4, lookX: 0.7 }, bg: "#3A0E12" },
  { who: "asuraSlate", label: "General (horned helm)", over: { browTilt: 16, talk: 0.5, lookX: 0.8 }, bg: "#1A222C" },
  { who: "asuraJade", label: "General (tusk crown)", over: { browTilt: 18, lookX: 0.6 }, bg: "#10241A" },
  { who: "asuraIron", label: "General (iron crown)", over: { browTilt: 20, smile: 0.3, lookX: 0.7 }, bg: "#221A1C" },
];

export const ManthanEp2FaceTest: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#0E0A12" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <RigDefs />
        {FACES2.map((c, i) => {
          const x0 = (i % 2) * 540;
          const y0 = Math.floor(i / 2) * 480;
          return (
            <g key={c.who}>
              <clipPath id={`f2-${i}`}>
                <rect x={x0 + 2} y={y0 + 2} width={536} height={476} />
              </clipPath>
              <g clipPath={`url(#f2-${i})`}>
                <rect x={x0} y={y0} width={540} height={480} fill={c.bg} />
                <Puppet id={`f2-${c.who}`} who={c.who} at={{ x: x0 + 225, y: y0 + 705, s: 1.55, facing: 1 }} p={pose({ ...c.over, sF: 6, eF: 8 })} t={f} />
                <text x={x0 + 20} y={y0 + 462} fill="#FFE6A3" fontSize={26} fontFamily="Georgia">
                  {c.label}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
