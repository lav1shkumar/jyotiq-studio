import React from "react";
import { SeatedLegs, VishnuOnShesha } from "./beings";
import { KundaliGrid, PlanArt } from "./graphics";
import { World } from "./kit";
import { blinkAt, idle, Place, pose, Pose, Puppet, talkAt } from "./rig";
import { Cosmos } from "./scenesA";
import { AsuraCourt, Cam, KshiraSagar, Layer, Vignette } from "./sets";
import { H, P, ramp, track, W } from "./style";
import { CUES } from "./timing";

/* Scenes 8-11: the plea at the ocean of milk and Vishnu's plan (one take,
   1388-1730), the asura court cliffhanger (1730-1900), the end card bed. */

/** Kneeling lower body (thigh forward, shin on the ground), waist frame. */
const Kneel: React.FC<{ cloth: string; shade: string; border: string; skin: string }> = ({ cloth, shade, border, skin }) => (
  <g>
    <path d="M-62 112C-80 112 -92 122 -86 132L-30 132Z" fill={skin} />
    <path d="M100 82C96 112 40 122 -44 120L-66 100C-24 98 40 96 62 98Z" fill={shade} />
    <path d="M-48 2L50 -2C82 10 102 42 106 82L62 98C30 72 -20 62 -46 52Z" fill={cloth} />
    <path d="M-46 52C-20 62 30 72 62 98" stroke={border} strokeWidth={6} fill="none" />
    <path d="M-50 -10L54 -10L55 12L-51 12Z" fill="url(#mGold)" />
  </g>
);

const INDRA_AT: Place = { x: 230, y: 1500, s: 0.95, facing: 1 };
const VISHNU = { x: 650, y: 1450, s: 0.88 };

export const KsheerPlan: React.FC<{ f: number }> = ({ f }) => {
  const cam: Cam = {
    x: track(f, [[1388, -40], [1481, 0, "io"], [1540, 100, "io"], [1585, 60, "io"], [1650, 20, "io"], [1730, 0, "io"]]),
    y: track(f, [[1388, 80], [1481, 60, "io"], [1540, 250, "io"], [1585, 120, "io"], [1650, 0, "io"], [1730, 0, "io"]]),
    z: track(f, [[1388, 1.05], [1481, 1.1, "io"], [1540, 1.35, "io"], [1585, 1.15, "io"], [1650, 1.05, "io"], [1730, 1.08, "io"]]),
  };
  const swell = ramp(f, CUES.waterSwell, CUES.waterSwell + 120, "io") * (1 - ramp(f, 1600, 1700));
  const reveal = ramp(f, 1452, 1500, "io");
  const pillar = ramp(f, 1430, 1470) * (1 - ramp(f, 1490, 1530));
  const hope = ramp(f, 1600, 1680, "io");
  const plead: Pose = pose({
    ...idle("indra-k", f, 0.5),
    lean: track(f, [[1388, 26], [1414, 20, "io"], [1481, 10, "io"], [1600, 4, "io"]]),
    head: track(f, [[1388, 18], [1414, -6, "io"], [1481, -10, "io"], [1600, -16, "io"]]),
    sF: 68,
    eF: 104,
    wF: -20,
    sB: 60,
    eB: 100,
    talk: talkAt("08_indra", f),
    brow: 0.6 + 0.4 * hope,
    browTilt: -14 + 10 * hope,
    smile: -0.4 + 0.6 * hope,
    lookX: 0.8,
    lookY: track(f, [[1388, 0.6], [1414, -0.2, "io"], [1600, -0.8, "io"]]),
    blink: blinkAt("indra-k", f),
  });
  const drainK = 0.75 * (1 - 0.6 * hope);
  return (
    <World>
      <KshiraSagar f={f} cam={cam} glow={0.25 + 0.6 * reveal} swell={swell} />
      {/* the plan, drawn in gold across the sky */}
      <Layer cam={cam} depth={0.4}>
        <g opacity={ramp(f, 1556, 1570) * (1 - ramp(f, 1716, 1730) * 0.4)}>
          <PlanArt f={f} d={ramp(f, CUES.planDraw, CUES.planDraw + 130, "io")} x={540} y={560} s={1.0} />
        </g>
      </Layer>
      <Layer cam={cam} depth={0.85}>
        {/* pillar of light that condenses into Vishnu */}
        <rect x={VISHNU.x - 90 * pillar} y={-200} width={180 * pillar} height={VISHNU.y + 300} fill="#FFF8DE" opacity={0.75 * pillar} filter="url(#mBlur8)" />
        <g transform={`translate(${VISHNU.x} ${VISHNU.y + (1 - reveal) * 120}) scale(${VISHNU.s})`}>
          <VishnuOnShesha t={f} reveal={reveal} speak={talkAt("09_vishnu", f)} />
        </g>
      </Layer>
      <Layer cam={cam} depth={1}>
        {/* the devas, glory lost, kneeling with Indra */}
        {[
          { x: 110, y: 1452, s: 0.74, id: "dv1" },
          { x: 360, y: 1470, s: 0.78, id: "dv2" },
        ].map((d) => (
          <g key={d.id}>
            <g transform={`translate(${d.x} ${d.y}) scale(${d.s})`} style={{ filter: `saturate(${1 - drainK}) brightness(0.8)` }}>
              <Kneel cloth="#E9D9A8" shade="#CDB984" border="#C8902E" skin="#C48955" />
            </g>
            <Puppet
              id={d.id}
              who="deva"
              at={{ x: d.x, y: d.y, s: d.s, facing: 1 }}
              p={pose({ ...idle(d.id, f, 0.5), lean: 18 - 10 * hope, head: 10 - 20 * hope, sF: 66, eF: 104, sB: 58, eB: 100, lookY: -0.4 - 0.4 * hope, blink: blinkAt(d.id, f) })}
              t={f}
              drain={drainK}
              noLegs
            />
          </g>
        ))}
        <g transform={`translate(${INDRA_AT.x} ${INDRA_AT.y}) scale(${INDRA_AT.s})`} style={{ filter: `saturate(${1 - drainK}) brightness(${1 - 0.2 * drainK})` }}>
          <Kneel cloth={P.royalBlue} shade={P.royalBlueShade} border="#F2C14E" skin="#C98B57" />
        </g>
        <Puppet id="k-indra" who="indra" at={INDRA_AT} p={plead} t={f} drain={drainK} noLegs />
      </Layer>
      <Vignette o={0.7} />
    </World>
  );
};

/* ------------------------------------------------------------------ */
/* Asura court - "Devta... humse madad maangne aaye hain?"             */
/* ------------------------------------------------------------------ */

const SWB_COURT: Place = { x: 720, y: 1760 - 252 * 1.3, s: 1.3, facing: -1 };

export const CourtCliff: React.FC<{ f: number }> = ({ f }) => {
  const fz = Math.min(f, CUES.freeze);
  const frozen = ramp(f, CUES.freeze, CUES.freeze + 3);
  const cam: Cam = {
    x: track(fz, [[1730, 40], [1800, 90, "io"], [1891, 154, "io"]]),
    y: track(fz, [[1730, 60], [1800, 120, "io"], [1891, 232, "io"]]) ,
    z: track(fz, [[1730, 1.05], [1800, 1.3, "io"], [1891, 1.75, "io"]]) + 0.06 * frozen,
  };
  const laugh = ramp(fz, 1808, 1840);
  const p: Pose = pose({
    ...idle("swb-court", fz, 0.5),
    sF: track(fz, [[1730, 10], [1744, 30, "io"], [1808, 46, "io"], [1880, 40, "io"]]),
    eF: track(fz, [[1730, 30], [1744, 70, "io"], [1808, 96, "io"]]),
    wF: -16,
    sB: -14,
    eB: 76,
    head: track(fz, [[1730, 4], [1744, -4, "io"], [1808, 6, "io"], [1891, -4, "io"]]),
    lean: track(fz, [[1730, 0], [1808, 6, "io"]]),
    talk: talkAt("10_swarbhanu", fz),
    smile: 0.4 + 0.6 * laugh,
    brow: track(fz, [[1744, 0], [1756, 0.9, "io"], [1800, 0.2, "io"]]),
    browTilt: 4 + 8 * laugh,
    glow: 0.2 + 0.8 * ramp(fz, 1866, 1891),
    lookX: 0.7,
    lookY: 0.1,
    blink: fz > 1850 ? 0 : blinkAt("swb-c", fz),
  });
  const bali: Pose = pose({ ...idle("bali", fz, 0.4), sF: 24, eF: 60, sB: 30, eB: 70, smile: 0.3 * laugh, lookX: 0.2 });
  return (
    <World>
      <AsuraCourt f={fz} cam={cam} />
      <Layer cam={cam} depth={0.3}>
        <g transform="translate(540 1116) scale(0.5)">
          <SeatedLegs who="bali" />
        </g>
        <Puppet id="c-bali" who="bali" at={{ x: 540, y: 1116, s: 0.5, facing: 1 }} p={bali} t={fz} noLegs />
      </Layer>
      <Layer cam={cam} depth={0.65}>
        {[230, 380].map((x, i) => (
          <Puppet key={x} id={`c-a${i}`} who="asura" at={{ x, y: 1640 - 252 * 0.72, s: 0.72, facing: 1 }} p={pose({ ...idle(`ca${i}`, fz, 0.5), sF: 20, eF: 40, smile: 0.4 * laugh, browTilt: 10 })} t={fz} drain={0.3} />
        ))}
      </Layer>
      <Layer cam={cam} depth={1}>
        <Puppet id="c-swb" who="swarbhanu" at={SWB_COURT} p={p} t={fz} />
      </Layer>
      {/* the freeze: tint + flash */}
      <rect width={W} height={H} fill="#24163F" opacity={0.35 * frozen} />
      {f >= CUES.freeze && f < CUES.freeze + 3 ? <rect width={W} height={H} fill="#FFFFFF" opacity={0.7 - (f - CUES.freeze) * 0.22} /> : null}
      <Vignette o={1} />
    </World>
  );
};

/* ------------------------------------------------------------------ */
/* End card bed                                                        */
/* ------------------------------------------------------------------ */

export const EndBed: React.FC<{ f: number }> = ({ f }) => (
  <World>
    <Cosmos f={f} z={1.04} />
    <KundaliGrid f={f} cx={540} cy={790} size={330} d={ramp(f, CUES.endCard, CUES.endCard + 40, "io")} glyphs={ramp(f, CUES.endCard + 30, CUES.endCard + 46)} o={0.55} />
    <rect width={W} height={H} fill="#0C0A07" opacity={0.25} />
    <Vignette o={1} />
  </World>
);
