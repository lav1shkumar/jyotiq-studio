import React from "react";
import { CHANDRA, ImpostorSmoke, SURYA, SVARDEVA } from "../ep6/cast6";
import { pose, Puppet } from "../rig";

/*
 * The devas' row from Episode 6's last story beat, rebuilt from ep6/scenes6e.tsx's Row (it is not exported)
 * with the same placement: Surya at x 290 and Chandra at x 790, the impostor seated between them at 540.
 *  disguise 1 = Svarbhanu as a deva (Episode 6's SVARDEVA look), 0 = his true form ('swarbhanu'); the two
 *    cross-fade with a smoke burst at the midpoint (the melt beat).
 *  recoil 0..1 = Surya and Chandra turn on him: smiles drop, brows up, eyes on the impostor. rig.tsx's lookX is
 *    "toward facing = +", so both look +0.6 (Episode 6 gave Chandra -0.6, which turns his eyes away from him).
 *  point 0..1 = both raise their front arm at him ('ये असुर है!'), letting go of his hands, brows angry.
 *  glint 0..1 = the red glint in his slit eyes. smoke 0..1 = the dark smoke at his feet.
 */
export const ROW = { S: 1.05, HIPS: 1500, X_SURYA: 290, X_IMP: 540, X_CHANDRA: 790 } as const;
export const ROW_FEET = ROW.HIPS + 240 * ROW.S;
export const ROW_EYE_Y = ROW.HIPS - 318;

export const DevaRow7: React.FC<{ id?: string; f: number; disguise?: number; recoil?: number; point?: number; glint?: number; smoke?: number }> = ({
  id = "r7",
  f,
  disguise = 1,
  recoil = 0,
  point = 0,
  glint = 0,
  smoke = 1,
}) => {
  const { S, HIPS, X_SURYA, X_IMP, X_CHANDRA } = ROW;
  const melt = 1 - disguise;
  const burst = Math.sin(Math.PI * Math.max(0, Math.min(1, melt)));
  const deva = pose({
    smile: 0.4 * (1 - recoil),
    brow: 0.8 * recoil * (1 - 0.5 * point),
    browTilt: 12 * point,
    lookX: 0.6 * recoil,
    sF: 8 + 75 * point,
    eF: 12 - 8 * point,
  });
  return (
    <g>
      <Puppet id={`${id}-su`} who={SURYA} at={{ x: X_SURYA, y: HIPS, s: S, facing: 1 }} p={deva} t={f} />
      <Puppet id={`${id}-ch`} who={CHANDRA} at={{ x: X_CHANDRA, y: HIPS, s: S, facing: -1 }} p={deva} t={f} />
      {disguise > 0.01 ? (
        <g opacity={disguise}>
          <Puppet id={`${id}-sv`} who={SVARDEVA} at={{ x: X_IMP, y: HIPS, s: S, facing: 1 }} p={pose({ smile: 0.25, lookX: 0.3 })} t={f} />
        </g>
      ) : null}
      {melt > 0.01 ? (
        <g opacity={melt}>
          <Puppet id={`${id}-rh`} who="swarbhanu" at={{ x: X_IMP, y: HIPS, s: S, facing: 1 }} p={pose({ smile: 0.5, browTilt: 12, glow: melt })} t={f} />
        </g>
      ) : null}
      <g transform={`translate(${X_IMP} ${ROW_FEET})`}>
        <ImpostorSmoke f={f} amount={Math.min(1, smoke + burst)} w={150 + 120 * burst} />
      </g>
      {glint > 0.01 ? (
        <g transform={`translate(${X_IMP + 12} ${ROW_EYE_Y})`} opacity={glint}>
          <circle r={26} fill="#FF2A3A" opacity={0.35} filter="url(#mBlur8)" />
          <path d="M0 -18L4 -4L18 0L4 4L0 18L-4 4L-18 0L-4 -4Z" fill="#FF5A6E" />
        </g>
      ) : null}
    </g>
  );
};
