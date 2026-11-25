import React from "react";
import { wob } from "../../manthan/style";

/* Yamuna's vahana: a calm, gentle tortoise in the Manthan flat style, its back as her standing platform.
   Origin = the top of the shell, where her feet stand; about 420 x 170 px at scale 1, facing right.
   `f` drives a slow paddle and the ripples. Needs RigDefs (mGold) in the svg. */

export const Tortoise: React.FC<{ f: number; s?: number }> = ({ f, s = 1 }) => {
  const paddle = Math.sin(f / 14) * 6;
  const head = wob("tt", f / 40) * 3;
  return (
    <g transform={`scale(${s})`}>
      {/* ripples on the water */}
      {[0, 1, 2].map((i) => {
        const k = ((f / 60 + i / 3) % 1);
        return <ellipse key={i} cx={0} cy={150} rx={200 + 160 * k} ry={22 + 16 * k} fill="none" stroke="#BFE0FF" strokeWidth={3} opacity={0.5 * (1 - k)} />;
      })}
      {/* legs (paddling) */}
      <path d={`M-150 70C-200 ${84 + paddle} -230 ${110 + paddle} -214 ${126 + paddle}C-190 ${120 + paddle} -160 100 -130 92Z`} fill="#4E7A52" stroke="#2A4A2E" strokeWidth={3} />
      <path d={`M130 80C176 ${96 - paddle} 196 ${120 - paddle} 180 ${136 - paddle}C156 ${128 - paddle} 128 110 104 100Z`} fill="#4E7A52" stroke="#2A4A2E" strokeWidth={3} />
      {/* head and neck, reaching forward */}
      <g transform={`translate(196 ${30 + head})`}>
        <path d="M-40 10C-10 -20 30 -30 58 -18C76 -10 80 12 64 22C40 34 0 34 -34 30Z" fill="#5C8A5C" stroke="#2A4A2E" strokeWidth={3} />
        <circle cx={46} cy={-6} r={6} fill="#0E1A10" />
        <circle cx={48} cy={-8} r={2} fill="#FFFFFF" />
        <path d="M58 12C66 14 72 12 76 8" stroke="#2A4A2E" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      </g>
      {/* the plastron edge and the domed shell */}
      <ellipse cx={0} cy={96} rx={200} ry={40} fill="#C8B070" stroke="#6A5A2A" strokeWidth={3} />
      <path d="M-196 92C-190 10 -110 -36 0 -36C110 -36 190 10 196 92C120 110 -120 110 -196 92Z" fill="#3E6A48" stroke="#22402A" strokeWidth={4} />
      {/* scutes */}
      <path d="M-60 -30L-90 30L-40 80L40 80L90 30L60 -30Z" fill="#4E7E56" stroke="#22402A" strokeWidth={3} />
      {[
        "M-60 -30L-140 0L-170 70L-90 30Z",
        "M60 -30L140 0L170 70L90 30Z",
        "M-90 30L-170 70L-120 100L-40 80Z",
        "M90 30L170 70L120 100L40 80Z",
      ].map((d, i) => (
        <path key={i} d={d} fill="#456F4D" stroke="#22402A" strokeWidth={3} />
      ))}
      {/* a gold rim and a soft highlight: a divine mount */}
      <path d="M-196 92C-120 110 120 110 196 92" stroke="url(#mGold)" strokeWidth={6} fill="none" />
      <path d="M-120 -10C-70 -30 -20 -36 30 -34" stroke="#BFE8C8" strokeWidth={5} fill="none" opacity={0.45} strokeLinecap="round" />
    </g>
  );
};
