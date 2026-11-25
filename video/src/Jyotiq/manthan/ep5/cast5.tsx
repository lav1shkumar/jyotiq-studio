import React from "react";
import { LOOKS, Who } from "../rig";
import { mix, P } from "../style";

/*
 * Episode 5 cast additions on the SAME cut-out rig as every Manthan character. The rig's look table is
 * extended at runtime (as Episode 4 did for Shiva), so no Episode 1-4 file is edited:
 *  - GURU: a learned sage in yellow silk (knowledge, but attachment), holding a palm-leaf pothi
 *  - RISHI: an ivory-robed sage, one of the rishis who receive Kamadhenu
 * Props and effects drawn here in the series style: the pothi, the Kaustubha gem, the empty gold
 * setting that covers Vishnu's chest gem until the Kaustubha arrives, and the tapas aura that flares
 * into anger.
 */
type Look = (typeof LOOKS)[keyof typeof LOOKS];

const GURU_LOOK: Look = {
  skin: "#E2AE74", skinShade: "#BF8650", skinLine: "#82502A", rim: "#FFE4BC",
  sclera: "#F8F1E4", iris: "#2E1C12", glowColor: "#FFD36B", lid: 0.32,
  brow: "#ECE6DA", browW: 6,
  hair: "jata", hairColor: "#E4DDD0", hairShade: "#A8A090",
  beard: "sage", moustache: "sage", beardColor: "#F2EEE6",
  tilak: "urdhva",
  thread: true, necklaces: 1, rudraksha: true,
  stole: ["#E9B92E", "#8E5A10"],
  dhoti: ["#F2C14E", "#C9961E", "#8E5A10"],
  armlet: false, bracelet: "#8E5A10", anklet: false, earring: "kundala", chest: 0.96,
};
const RISHI_LOOK: Look = {
  skin: "#C89A76", skinShade: "#A57856", skinLine: "#6A4630", rim: "#F2E2CE",
  sclera: "#F6EFE2", iris: "#2A1A12", glowColor: "#FFE2A0", lid: 0.36,
  brow: "#E8E2D6", browW: 6,
  hair: "jata", hairColor: "#CFC8BA", hairShade: "#9A9284",
  beard: "sage", moustache: "sage", beardColor: "#EAE5DA",
  tilak: "tripundra",
  thread: true, necklaces: 0, rudraksha: true,
  stole: ["#F3EBDA", "#C4702A"],
  dhoti: ["#F6EFE0", "#D8CCB2", "#C4702A"],
  armlet: false, bracelet: "#6B3A22", anklet: false, earring: "rudraksha", chest: 0.9,
};
(LOOKS as unknown as Record<string, Look>).guru5 = GURU_LOOK;
(LOOKS as unknown as Record<string, Look>).rishi5 = RISHI_LOOK;
export const GURU = "guru5" as unknown as Who;
export const RISHI = "rishi5" as unknown as Who;

/** A palm-leaf manuscript (pothi) between wooden covers; glow = the light of knowledge. Held at its middle. */
export const Pothi: React.FC<{ glow?: number; f?: number }> = ({ glow = 0, f = 0 }) => (
  <g>
    {glow > 0.01 ? <ellipse rx={120} ry={56} fill="#FFE9A6" opacity={0.55 * glow} filter="url(#mBlur8)" /> : null}
    {glow > 0.01
      ? [0, 1, 2, 3, 4].map((i) => {
          const u = ((f / 40 + i / 5) % 1 + 1) % 1;
          return <circle key={i} cx={-50 + i * 25} cy={-20 - u * 70} r={3.5 * (1 - u)} fill="#FFF3C9" opacity={glow * (1 - u)} />;
        })
      : null}
    <rect x={-66} y={-14} width={132} height={28} rx={10} fill="#E8D3A2" stroke="#8C6A3A" strokeWidth={2} />
    <rect x={-66} y={-14} width={132} height={7} rx={4} fill="#7A4A22" />
    <rect x={-66} y={7} width={132} height={7} rx={4} fill="#7A4A22" />
    {[-4, 0, 4].map((yy) => (
      <path key={yy} d={`M-56 ${yy}L56 ${yy}`} stroke="#B89A66" strokeWidth={1.4} />
    ))}
    <path d="M-12 -16L-12 16M12 -16L12 16" stroke="#C8102E" strokeWidth={2.5} />
    <circle r={3.2} fill={P.gold} />
  </g>
);

/** The Kaustubha: a blazing red gem in a gold claw setting, with slow rays and a twinkle. Origin = its centre. */
export const Kaustubha: React.FC<{ f: number; s?: number; glow?: number }> = ({ f, s = 1, glow = 1 }) => {
  const tw = 0.5 + 0.5 * Math.sin(f / 5);
  return (
    <g transform={`scale(${s})`}>
      {glow > 0.01 ? <circle r={70} fill="#FF6A88" opacity={0.4 * glow} filter="url(#mBlur8)" /> : null}
      {glow > 0.01 ? (
        <g transform={`rotate(${f * 1.5})`} opacity={0.55 * glow}>
          {new Array(8).fill(0).map((_, i) => (
            <path key={i} d="M-3 -30L0 -92L3 -30Z" transform={`rotate(${i * 45})`} fill="#FFE2EA" />
          ))}
        </g>
      ) : null}
      <path d="M0 -30L26 -10L17 24L-17 24L-26 -10Z" fill={P.goldDeep} />
      <path d="M0 -26L22 -8L14 21L-14 21L-22 -8Z" fill="#E3264A" />
      <path d="M0 -26L22 -8L14 21L-14 21L-22 -8Z" fill="url(#mGem)" />
      <path d="M0 -26L0 -6M22 -8L6 -2M14 21L5 6M-14 21L-5 6M-22 -8L-6 -2M0 -6L6 -2L5 6L-5 6L-6 -2Z" stroke="#FF9AB0" strokeWidth={1.4} fill="none" opacity={0.8} />
      <path d="M0 -26L22 -8L6 -2L0 -6Z" fill="#FFFFFF" opacity={0.25} />
      {[[-26, -10], [26, -10], [17, 24], [-17, 24], [0, -30]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={3} fill="url(#mGold)" />
      ))}
      <g transform={`translate(-9 -12) scale(${0.6 + 0.6 * tw})`} opacity={0.6 + 0.4 * tw}>
        <path d="M0 -9L2 -2L9 0L2 2L0 9L-2 2L-9 0L-2 -2Z" fill="#FFFFFF" />
      </g>
    </g>
  );
};

/** The empty gold setting drawn over VishnuStanding's chest gem (at his local (0, -566)) until the Kaustubha lands. */
export const EmptySetting: React.FC = () => (
  <g>
    <circle r={15} fill={P.goldDeep} />
    <circle r={12.5} fill="url(#mGold)" />
    <circle r={6.5} fill={P.goldDark} />
    <circle r={3} fill={P.goldDeep} />
  </g>
);

/**
 * Tapas aura behind a sage: a calm gold ring of light that, as `anger` rises, turns red and throws
 * flickering flame tongues. Origin = its centre (put it behind the head/chest).
 */
export const TapasAura: React.FC<{ f: number; r: number; anger: number; o?: number }> = ({ f, r, anger, o = 1 }) => {
  const a = Math.max(0, Math.min(1, anger));
  const col = mix("#FFE08A", "#FF3A1A", a);
  return (
    <g opacity={o}>
      <circle r={r} fill={col} opacity={0.32 + 0.12 * a} filter="url(#mBlur8)" />
      <circle r={r * 0.9} fill="none" stroke={col} strokeWidth={4} opacity={0.65} />
      {a > 0.05
        ? new Array(16).fill(0).map((_, i) => {
            const ang = (i / 16) * 360;
            const len = r * (0.2 + 0.22 * a) * (0.7 + 0.3 * Math.sin(f / 2.5 + i * 1.7));
            return (
              <path
                key={i}
                d={`M${-r * 0.07} ${-r * 0.88}Q0 ${-r * 0.88 - len * 1.2} ${r * 0.07} ${-r * 0.88}Z`}
                transform={`rotate(${ang + Math.sin(f / 7 + i) * 4})`}
                fill={mix("#FFB03A", "#FF2A10", a)}
                opacity={0.85 * a}
              />
            );
          })
        : null}
    </g>
  );
};
