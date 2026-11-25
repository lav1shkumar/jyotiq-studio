import React from "react";
import { World } from "../kit";
import { pose, Puppet } from "../rig";
import { KshiraSagar, Motes, Vignette } from "../sets";
import { H, ramp, track, W } from "../style";
import { CUES, SCENES } from "./timing";
import { CHANDRA, ImpostorSmoke, SURYA, SVARDEVA } from "./cast6";

/*
 * Scenes 11-12: the impostor and the close.
 * RahuScene: the lights dim; the camera pans slowly along the devas' row. On 'एक असुर' a figure slips into the
 * gap between Surya and Chandra and sits there by 'बैठा': a deva crown, but dark smoke at his feet and a red
 * glint in his slit eyes. A red pulse on the sting.
 * EndBed6: push in on him; on 'राहू' the disguise smokes off and Swarbhanu's true form (the series' own asura,
 * Rahu) is revealed; then the frame dims under the end card.
 */

const S = 1.05;
const HIPS = 1500;
const FEET = HIPS + 240 * S;
const EYE_Y = HIPS - 318;

const Row: React.FC<{ f: number; slip: number; trueForm?: number; recoil?: number; glint?: number; smoke?: number }> = ({ f, slip, trueForm = 0, recoil = 0, glint = 0, smoke = 1 }) => {
  const iy = HIPS - 120 * (1 - slip);
  const is = S * (0.8 + 0.2 * slip);
  return (
    <g>
      <Puppet id="rw-su" who={SURYA} at={{ x: 290, y: HIPS, s: S, facing: 1 }} p={pose({ smile: 0.4 * (1 - recoil), brow: 0.8 * recoil, lookX: 0.6 * recoil })} t={f} />
      <Puppet id="rw-ch" who={CHANDRA} at={{ x: 790, y: HIPS, s: S, facing: -1 }} p={pose({ smile: 0.4 * (1 - recoil), brow: 0.8 * recoil, lookX: -0.6 * recoil })} t={f} />
      <g opacity={slip}>
        {trueForm < 0.5 ? (
          <Puppet id="rw-sv" who={SVARDEVA} at={{ x: 540, y: iy, s: is, facing: 1 }} p={pose({ smile: 0.25, lid: 0.3, lookX: 0.3 })} t={f} />
        ) : (
          <Puppet id="rw-rh" who="swarbhanu" at={{ x: 540, y: iy, s: is, facing: 1 }} p={pose({ smile: 0.5, browTilt: 12, lookX: 0 })} t={f} />
        )}
        <g transform={`translate(540 ${FEET})`}>
          <ImpostorSmoke f={f} amount={smoke} w={150} />
        </g>
        {glint > 0.01 ? (
          <g transform={`translate(${552} ${EYE_Y})`} opacity={glint}>
            <circle r={26} fill="#FF2A3A" opacity={0.35} filter="url(#mBlur8)" />
            <path d="M0 -18L4 -4L18 0L4 4L0 18L-4 4L-18 0L-4 -4Z" fill="#FF5A6E" />
          </g>
        ) : null}
      </g>
    </g>
  );
};

export const RahuScene: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.rahu;
  const pan = track(f, [[a, 70], [b, -40, "io"]]);
  const dim = ramp(f, a, CUES.chupke, "out");
  const slip = ramp(f, CUES.ekAsur, CUES.baitha, "io");
  const glint = Math.max(0, 1 - Math.abs(f - CUES.chupke - 12) / 8) + Math.max(0, 1 - Math.abs(f - CUES.sting - 2) / 10);
  const pulse = Math.max(0, 1 - Math.abs(f - CUES.sting - 2) / 10);
  return (
    <World>
      <g transform={`translate(${pan} 0)`}>
        <KshiraSagar f={f} cam={{ x: 0, y: 0, z: 1.05 }} glow={0.3} swell={0.3} />
        <rect x={-200} width={W + 400} height={H} fill="#0A0814" opacity={0.25 + 0.3 * dim} />
        <ellipse cx={540} cy={1300} rx={520} ry={600} fill="#FFE6A3" opacity={0.14} filter="url(#mBlur8)" />
        <Row f={f} slip={slip} glint={Math.min(1, glint)} />
        <Motes f={f} n={14} seed="rh6m" color="#C9B4FF" dir={-1} speed={0.4} size={3} o={0.5} />
      </g>
      <rect width={W} height={H} fill="#8A0F1E" opacity={0.28 * pulse} />
      <Vignette o={0.75} />
    </World>
  );
};

export const EndBed6: React.FC<{ f: number }> = ({ f }) => {
  const [a] = SCENES.end;
  const z = track(f, [[a, 1.0], [CUES.rahu, 1.32, "io"]]);
  const lift = ramp(f, a, CUES.rahu, "io");
  const reveal = ramp(f, CUES.rahu - 4, CUES.rahu + 4, "out");
  const burst = Math.max(0, 1 - Math.abs(f - CUES.rahu) / 10);
  const under = ramp(f, CUES.rahu + 30, CUES.rahu + 44, "out");
  return (
    <World>
      <g transform={`translate(540 ${1180 - 200 * lift}) scale(${z}) translate(-540 -1180)`}>
        <KshiraSagar f={f} cam={{ x: 0, y: 0, z: 1.05 }} glow={0.25} swell={0.3} />
        <rect width={W} height={H} fill="#0A0814" opacity={0.55} />
        <Row f={f} slip={1} trueForm={reveal} recoil={reveal} glint={0.6 * (1 - reveal)} smoke={1 - 0.6 * reveal} />
        {burst > 0.01
          ? [0, 1, 2, 3, 4, 5, 6].map((i) => (
              <circle key={i} cx={540 + Math.cos(i * 0.9) * 120 * (1.5 - burst)} cy={1250 + Math.sin(i * 0.9) * 160 * (1.5 - burst)} r={90} fill="#2A1B44" opacity={0.6 * burst} filter="url(#mBlur8)" />
            ))
          : null}
      </g>
      <rect width={W} height={H} fill="#0C0A07" opacity={0.6 * under} />
      <Vignette o={0.75} />
    </World>
  );
};
