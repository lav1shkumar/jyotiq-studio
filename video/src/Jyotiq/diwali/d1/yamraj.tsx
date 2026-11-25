import React from "react";
import { wob } from "../../manthan/style";

/* Diwali Day 1 end card: the tease for tomorrow ("यमराज के लिए दीया क्यों?"). Yamaraja seated calmly on his
   buffalo, as a faint, dignified silhouette: deep indigo with a cool moon-gold rim and a soft halo behind the
   crown, so he reads as a deity and never as a horror figure. No noose, no skulls, no red eyes.
   Origin at the buffalo's feet centre, facing right, about 520 x 640 px at scale 1. `k` 0..1 fades him in.
   Put <YamrajDefs /> once in the svg. */

export const YamrajDefs: React.FC = () => (
  <defs>
    <linearGradient id="y1Body" x1="0" y1="0" x2="1" y2="0.3">
      <stop offset="0" stopColor="#14122C" />
      <stop offset="0.75" stopColor="#24224A" />
      <stop offset="1" stopColor="#3E3A6A" />
    </linearGradient>
    <radialGradient id="y1Halo">
      <stop offset="0" stopColor="#F2DCA0" stopOpacity="0" />
      <stop offset="0.62" stopColor="#F2DCA0" stopOpacity="0" />
      <stop offset="0.72" stopColor="#F2DCA0" stopOpacity="0.5" />
      <stop offset="0.82" stopColor="#F2DCA0" stopOpacity="0.12" />
      <stop offset="1" stopColor="#F2DCA0" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="y1Glow">
      <stop offset="0" stopColor="#9890D8" stopOpacity="0.35" />
      <stop offset="1" stopColor="#9890D8" stopOpacity="0" />
    </radialGradient>
    <filter id="y1Rim" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" />
    </filter>
  </defs>
);

const Shape: React.FC<{ d: string; rim?: number }> = ({ d, rim = 1 }) => (
  <g>
    <path d={d} fill="none" stroke="#E8D6A6" strokeWidth={9} opacity={0.5 * rim} filter="url(#y1Rim)" />
    <path d={d} fill="none" stroke="#F2E2B8" strokeWidth={2.6} opacity={0.85 * rim} />
    <path d={d} fill="url(#y1Body)" />
  </g>
);

export const YamrajSilhouette: React.FC<{ f: number; k?: number }> = ({ f, k = 1 }) => {
  const t = f / 30;
  const breathe = Math.sin(t * 1.6) * 2;
  const cape = wob("yc", t * 0.8) * 8;
  const tail = wob("yt", t * 0.9) * 6;
  return (
    <g opacity={k}>
      {/* a soft cool glow on the ground and behind the figure */}
      <ellipse cx={0} cy={-260} rx={360} ry={320} fill="url(#y1Glow)" />
      <ellipse cx={10} cy={4} rx={230} ry={18} fill="#000000" opacity={0.35} />
      {/* the buffalo, facing right, calm, head slightly lowered */}
      <Shape d={`M-178 -196C${-190 - tail} -150 ${-198 - tail} -110 ${-200 - tail} -86L${-188 - tail} -80C${-182 - tail} -110 -176 -150 -170 -178Z`} rim={0.6} />
      <Shape d="M-150 -112L-146 -6L-122 -6L-118 -112Z M-112 -112L-104 -6L-82 -6L-84 -112Z" rim={0.7} />
      <Shape d="M96 -112L92 -6L114 -6L118 -112Z M130 -116L132 -6L154 -6L154 -118Z" rim={0.7} />
      <Shape d="M-182 -170C-190 -230 -130 -266 -40 -268C40 -270 110 -268 150 -244C186 -222 196 -176 176 -136C160 -110 120 -104 60 -106L-120 -106C-160 -108 -178 -130 -182 -170Z" />
      <Shape d="M146 -250C172 -268 214 -266 238 -246C256 -230 270 -206 282 -178C288 -162 284 -146 270 -142C252 -138 228 -140 206 -146C184 -152 166 -166 154 -188Z" />
      <ellipse cx={272} cy={-156} rx={20} ry={15} fill="url(#y1Body)" stroke="#F2E2B8" strokeWidth={2} opacity={0.95} />
      {/* horns: heavy scimitar crescents sweeping back over the neck, like a water buffalo's */}
      <Shape d="M220 -256C204 -300 168 -328 128 -336C156 -314 184 -290 198 -248Z" rim={0.6} />
      <Shape d="M196 -252C170 -290 130 -312 88 -318C118 -300 150 -276 172 -238Z" />
      <Shape d="M204 -228C196 -220 184 -214 172 -214C178 -222 190 -230 202 -234Z" rim={0.6} />
      <path d="M236 -204C240 -198 246 -196 250 -198" stroke="#F2E2B8" strokeWidth={2.5} fill="none" opacity={0.7} strokeLinecap="round" />
      {/* Yamaraja seated upright: halo, crown, danda */}
      <g transform={`translate(0,${breathe})`}>
        <circle cx={10} cy={-488} r={92} fill="url(#y1Halo)" />
        {/* uttariya flowing behind */}
        <Shape d={`M-30 -430C-80 -420 ${-120 + cape} -380 ${-140 + cape} -320C${-120 + cape} -340 -90 -360 -40 -380Z`} rim={0.7} />
        {/* leg over the buffalo's side */}
        <Shape d="M10 -282C50 -284 80 -270 88 -250L82 -168L96 -150L64 -148L58 -232C40 -246 20 -248 0 -250Z" rim={0.8} />
        {/* torso and dhoti */}
        <Shape d="M-44 -258C-50 -310 -50 -370 -40 -420C-30 -436 40 -440 54 -422C64 -380 64 -310 58 -258C30 -246 -20 -246 -44 -258Z" />
        {/* arm holding the danda upright */}
        <Shape d="M44 -414C70 -404 82 -380 84 -350L70 -346C66 -370 56 -390 38 -396Z" rim={0.9} />
        <path d="M84 -586L84 -196" stroke="url(#y1Body)" strokeWidth={10} strokeLinecap="round" />
        <path d="M89 -586L89 -196" stroke="#F2E2B8" strokeWidth={2} opacity={0.8} />
        <rect x={74} y={-578} width={20} height={8} rx={2} fill="url(#y1Body)" stroke="#F2E2B8" strokeWidth={2} />
        <ellipse cx={84} cy={-604} rx={24} ry={28} fill="url(#y1Body)" stroke="#F2E2B8" strokeWidth={2.5} />
        {[-12, 0, 12].map((dx) => (
          <path key={dx} d={`M${84 + dx} -630C${84 + dx * 1.4} -612 ${84 + dx * 1.4} -596 ${84 + dx} -578`} stroke="#F2E2B8" strokeWidth={1.5} fill="none" opacity={0.6} />
        ))}
        <path d="M78 -630L84 -652L90 -630Z" fill="url(#y1Body)" stroke="#F2E2B8" strokeWidth={2} />
        {/* resting arm on the thigh */}
        <Shape d="M-34 -410C-56 -380 -54 -320 -24 -290L-10 -298C-30 -326 -32 -372 -20 -398Z" rim={0.8} />
        {/* head and a tall mukut */}
        <Shape d="M-14 -450C-20 -470 -12 -500 12 -502C36 -504 46 -482 40 -460C36 -444 20 -436 6 -438C-4 -440 -10 -444 -14 -450Z" />
        <Shape d="M-18 -494L-24 -520L-6 -514L2 -560L10 -584L18 -560L26 -514L44 -520L38 -494Z" />
        <circle cx={10} cy={-588} r={5} fill="#F2E2B8" opacity={0.9} />
      </g>
    </g>
  );
};
