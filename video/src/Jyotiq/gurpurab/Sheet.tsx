import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { pose, Puppet, RigDefs, type Who } from "../manthan/rig";
import { H, W } from "../manthan/style";
import { AFSAR, Dhal, GOBIND, HARGOBIND, Katar, KIRPA, Mala, MUGHAL_RIDER, PANDIT, SheathedSword, SIKH_RIDER, Talwar, TEGH, TYAG } from "./cast";

/* Step 2 reference sheets for the Guru Tegh Bahadur reel (review only, not part of the reel). */

type C = { who: Who; label: string; s?: number; prop?: "talwar" | "mala" | "dhal"; over?: Record<string, number> };
const LINE: C[] = [
  { who: TYAG, label: "त्याग मल (1635)", prop: "talwar", over: { sF: 70, eF: 40, browTilt: 14 } },
  { who: HARGOBIND, label: "गुरु हरगोबिंद जी", over: { smile: 0.3 } },
  { who: TEGH, label: "गुरु तेग़ बहादुर जी", prop: "mala", over: { smile: 0.15 } },
  { who: GOBIND, label: "बाल गोबिंद राय", s: 0.74, over: { lookY: -0.4 } },
  { who: KIRPA, label: "पंडित कृपा राम", over: { browTilt: -14, talk: 0.3 } },
  { who: PANDIT, label: "कश्मीरी पंडित", over: { browTilt: -10 } },
  { who: AFSAR, label: "शाही अफ़सर", over: { browTilt: 18, smile: -0.3 } },
  { who: SIKH_RIDER, label: "सिख सवार / मुग़ल सवार", prop: "dhal" },
];

const Prop: React.FC<{ k?: C["prop"]; f: number }> = ({ k, f }) =>
  k === "talwar" ? <Talwar s={0.9} rot={10} /> : k === "mala" ? <Mala f={f} /> : k === "dhal" ? <Dhal s={0.9} /> : null;

export const GTCastSheet: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#5A2E18, #1A0E0A)" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <RigDefs />
        {LINE.map((c, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const x = 135 + col * 270;
          const y = 760 + row * 900;
          const s = 1.05 * (c.s ?? 1);
          return (
            <g key={c.label}>
              <ellipse cx={x} cy={y + 254 * s} rx={110} ry={16} fill="#000" opacity={0.35} />
              {c.who === HARGOBIND ? (
                <g transform={`translate(${x - 30 * s} ${y + 4 * s}) scale(${s})`}>
                  <SheathedSword rot={-14} />
                  <g transform="translate(26 0)"><SheathedSword rot={-24} s={0.95} /></g>
                </g>
              ) : null}
              {c.who === AFSAR ? <g transform={`translate(${x + 10 * s} ${y - 4 * s}) scale(${s})`}><Katar rot={-30} /></g> : null}
              <Puppet id={`gt-${i}`} who={c.who} at={{ x, y, s, facing: 1 }} p={pose({ ...(c.over ?? {}) })} t={f} prop={<Prop k={c.prop} f={f} />} />
              {c.who === SIKH_RIDER ? <Puppet id="gt-mr" who={MUGHAL_RIDER} at={{ x: x + 60, y: y + 30, s: s * 0.8, facing: -1 }} p={pose({ browTilt: 16 })} t={f} prop={<Talwar s={0.9} rot={-20} />} /> : null}
              <text x={x} y={y + 300 * s + 40} fill="#F6E7C8" fontSize={30} textAnchor="middle" fontFamily="Noto Sans Devanagari, sans-serif">{c.label}</text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

const FACES: C[] = [
  { who: TYAG, label: "त्याग मल", over: { browTilt: 16, lookX: 1 } },
  { who: HARGOBIND, label: "गुरु हरगोबिंद जी", over: { smile: 0.35 } },
  { who: TEGH, label: "गुरु तेग़ बहादुर जी", over: { smile: 0.12 } },
  { who: GOBIND, label: "बाल गोबिंद राय", over: { lookY: -0.5, brow: 0.5 } },
  { who: KIRPA, label: "पंडित कृपा राम", over: { browTilt: -16, talk: 0.4 } },
  { who: AFSAR, label: "शाही अफ़सर", over: { browTilt: 20, smile: -0.4 } },
];

export const GTFaceSheet: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#140A08" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <RigDefs />
        {FACES.map((c, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x0 = col * 540;
          const y0 = row * 640;
          return (
            <g key={c.label}>
              <clipPath id={`gtf-${i}`}>
                <rect x={x0 + 3} y={y0 + 3} width={534} height={634} />
              </clipPath>
              <g clipPath={`url(#gtf-${i})`}>
                <rect x={x0} y={y0} width={540} height={640} fill={["#6A3A1C", "#3A2A4A", "#5A3A1A", "#2A3A5A", "#4A3A2A", "#1E3A32"][i]} />
                <Puppet id={`gtf-${i}`} who={c.who} at={{ x: x0 + 230, y: y0 + 1060, s: 2.3, facing: 1 }} p={pose({ ...(c.over ?? {}), sF: 6, eF: 8 })} t={f} />
                <text x={x0 + 24} y={y0 + 610} fill="#F6E7C8" fontSize={28} fontFamily="Noto Sans Devanagari, sans-serif">{c.label}</text>
              </g>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
