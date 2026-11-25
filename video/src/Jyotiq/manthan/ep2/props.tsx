import React from "react";

/*
 * Episode 2 hand props for the asura generals. Same convention as rig.tsx's Vajra/Danda:
 * drawn around the grip at the origin, pointing up (negative y); the Puppet keeps them upright.
 */

/** Gada (mace): wooden haft with gold bands, iron head, gold collar and spike. */
export const Mace: React.FC = () => (
  <g>
    <rect x={-6} y={-122} width={12} height={192} rx={5} fill="#5A3A1E" />
    <rect x={-6} y={-122} width={4} height={192} fill="#7A5230" />
    {[-70, -10, 36].map((y) => (
      <rect key={y} x={-8} y={y} width={16} height={7} rx={2} fill="url(#mGoldDark)" />
    ))}
    <circle cx={0} cy={66} r={9} fill="url(#mGold)" />
    <circle cx={0} cy={-162} r={40} fill="url(#mIron)" />
    {[-24, -8, 8, 24].map((x) => (
      <path key={x} d={`M${x} -198Q${x * 1.5} -162 ${x} -126`} stroke="#8A919C" strokeWidth={2} fill="none" opacity={0.55} />
    ))}
    <path d="M-40 -162Q0 -148 40 -162Q0 -174 -40 -162Z" fill="url(#mGold)" />
    <circle cx={0} cy={-162} r={40} fill="url(#mGem)" opacity={0.35} />
    <path d="M0 -200L-7 -214L0 -234L7 -214Z" fill="url(#mGold)" />
  </g>
);

/** Khadga: broad sword that widens toward a curved tip, gold guard. */
export const Khadga: React.FC = () => (
  <g>
    <rect x={-5} y={-18} width={10} height={58} rx={4} fill="#3A2412" />
    <circle cx={0} cy={44} r={8} fill="url(#mGold)" />
    <path d="M-26 -22Q0 -32 26 -22L22 -14Q0 -22 -22 -14Z" fill="url(#mGold)" />
    <path
      d="M-7 -26C-10 -90 -6 -150 6 -210C12 -226 26 -238 34 -232C30 -200 22 -150 12 -90C10 -60 8 -40 7 -26Z"
      fill="#DCE3EA" stroke="#7A8794" strokeWidth={2}
    />
    <path d="M0 -40C0 -100 4 -160 14 -210" stroke="#FFFFFF" strokeWidth={2.4} fill="none" opacity={0.7} />
  </g>
);

/** Parashu (battle-axe): long haft with a crescent blade near the top. */
export const Parashu: React.FC = () => (
  <g>
    <rect x={-6} y={-202} width={12} height={292} rx={5} fill="#5A3A1E" />
    <rect x={-6} y={-202} width={4} height={292} fill="#7A5230" />
    <path d="M6 -196C40 -214 70 -200 80 -168C84 -150 80 -132 70 -118C60 -140 40 -150 6 -150Z" fill="#CBD3DB" stroke="#6E7985" strokeWidth={2.2} />
    <path d="M76 -160C78 -146 74 -132 68 -122" stroke="#FFFFFF" strokeWidth={2.4} fill="none" opacity={0.7} />
    <rect x={-9} y={-202} width={18} height={12} rx={3} fill="url(#mGoldDark)" />
    <rect x={-9} y={-152} width={18} height={10} rx={3} fill="url(#mGoldDark)" />
  </g>
);
