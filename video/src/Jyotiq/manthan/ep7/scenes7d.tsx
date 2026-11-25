import React from "react";
import { ROZHA } from "../graphics";
import { World } from "../kit";
import { pose, Puppet } from "../rig";
import { Cosmos } from "../scenesA";
import { Motes, Vignette } from "../sets";
import { H, ramp, track, W } from "../style";
import { EclipseSun, GrahaOrb, KetuForm, RahuSpeaking } from "./cast7";
import { cue7, span7 } from "./kit7";
import { SCENES } from "./timing";

type P2 = [number, number];

/*
 * Episode 7, scene 6, over Rahu's line 06 ("हा हा हा... अमृत गले तक पहुँच चुका है। मैं अमर हूँ!").
 * Out of the chakra's whiteout (the white clears over the first 10 frames) the severed head rises into the dark
 * Cosmos sky: Episode 2's RahuHead through RahuSpeaking, centred and large, lip-synced to '06_rahu', laughing on
 * the laugh, eyes burning, the gold amrit glowing at the neck cut, his smoke trailing below. On 'गले' the throat
 * glow swells; on 'अमर' a gold flare bursts from the neck and the camera pushes in. ThroatChip7 and the captions
 * are HTML overlays. Placeholder defaults: immortal 600-700, 'हा हा हा' 604, 'गले' 640, 'अमर' 680.
 */
export const ImmortalScene7: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = span7(SCENES, "immortal", [600, 700]);
  const haha = cue7("hahaha", 604);
  const gale = cue7("gale", 640);
  const amar = cue7("amar", 680);
  const clear = 1 - ramp(f, a, a + 10, "out"); // the whiteout clearing
  const rise = ramp(f, a, a + 22, "out");
  const s = 2.4;
  const head = { x: 540, y: 1150 + 200 * (1 - rise) };
  const neck = { x: head.x - 6 * s, y: head.y + 56 * s };
  const laugh = ramp(f, haha - 2, haha + 4, "out") * (1 - ramp(f, haha + 26, haha + 34, "out"));
  const swell = Math.max(0, 1 - Math.abs(f - gale - 4) / 12);
  const flare = ramp(f, amar, amar + 16, "out");
  const z = track(f, [[a, 1.0], [amar, 1.04, "io"], [b, 1.1, "io"]]);
  return (
    <World>
      <g transform={`translate(540 1150) scale(${z}) translate(-540 -1150)`}>
        <Cosmos f={f} z={1.04} />
        <ellipse cx={540} cy={1000} rx={460} ry={520} fill="#3A2160" opacity={0.45} filter="url(#mBlur8)" />
        <ellipse cx={neck.x} cy={neck.y} rx={260} ry={120} fill="#FFB23D" opacity={0.18 + 0.2 * swell} filter="url(#mBlur8)" />
        <RahuSpeaking id="im7rahu" at={head} s={s} f={f} line="06_rahu" laugh={laugh} throat={1} rage={0.85} lookX={0} />
        {flare > 0 && flare < 1 ? (
          <g>
            <circle cx={neck.x} cy={neck.y} r={40 + 380 * flare} fill="none" stroke="#FFD36B" strokeWidth={2 + 10 * (1 - flare)} opacity={0.9 * (1 - flare)} />
            <circle cx={neck.x} cy={neck.y} r={120} fill="#FFE6A3" opacity={0.7 * (1 - flare)} filter="url(#mBlur8)" />
          </g>
        ) : null}
        <Motes f={f} n={28} seed="im7m" color="#FFD27A" dir={-1} speed={0.5} size={3} o={0.6} />
      </g>
      <Vignette o={0.75} />
      <rect width={W} height={H} fill="#FFF6DD" opacity={clear} />
    </World>
  );
};

/** Svarbhanu's headless body: the 'swarbhanu' Puppet clipped below its neck cut (rig NECK is at -224), with dark
 *  smoke curling from the cut over a faint gold glow (the amrit stopped at the throat). (x, y) = hips. */
export const KetuBody7: React.FC<{ id: string; f: number; x: number; y: number; s: number; facing?: number }> = ({ id, f, x, y, s, facing = 1 }) => {
  const cutY = y - 218 * s;
  const cx = x + facing * 6 * s;
  return (
    <g>
      <clipPath id={`${id}-cut`}>
        <rect x={x - 420 * s} y={cutY} width={840 * s} height={640 * s} />
      </clipPath>
      <g clipPath={`url(#${id}-cut)`}>
        <Puppet id={id} who="swarbhanu" at={{ x, y, s, facing }} p={pose({ sF: 24, eF: 30, sB: -22, eB: 26, sway: Math.sin(f / 18) * 2 })} t={f} />
      </g>
      <ellipse cx={cx} cy={cutY} rx={44 * s} ry={14 * s} fill="#FFD36B" opacity={0.55} filter="url(#mBlur8)" />
      {[0, 1, 2, 3].map((i) => {
        const u = (((f / 40 + i / 4) % 1) + 1) % 1;
        return (
          <ellipse
            key={i}
            cx={cx + Math.sin(f / 13 + i) * 16 * s}
            cy={cutY - u * 120 * s}
            rx={30 * s * (1 - 0.4 * u)}
            ry={20 * s * (1 - 0.4 * u)}
            fill="#2A1B44"
            opacity={0.55 * (1 - u)}
            filter="url(#mBlur8)"
          />
        );
      })}
    </g>
  );
};

export const Glyph7: React.FC<{ t: string; size: number; color: string }> = ({ t, size, color }) => (
  <text x={0} y={size * 0.36} textAnchor="middle" fontSize={size} fill={color} fontFamily={ROZHA}>
    {t}
  </text>
);

/*
 * Episode 7, scene 7, over line 07 ("सिर बना राहु... और धड़, केतु।").
 * Still in the Cosmos and on scene 6's camera pivot: the head drifts from where scene 6 left it (centre, s 2.4)
 * up to the upper left and shrinks, while the headless body (KetuBody7, facing the head) floats in from the
 * lower right. On 'राहु' the head dissolves into the warm graha orb रा; on 'केतु' the body dissolves into the
 * silver-blue comet orb के with its tail. A dashed axis then joins them across the frame (the two always sit
 * opposite each other, which the end card pays off). NameCard7 for both is HTML.
 * Placeholder defaults: split 700-800, 'राहु' 718, 'केतु' 770.
 */
export const SplitScene7: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = span7(SCENES, "split", [700, 800]);
  const rahu = cue7("rahu07", 718);
  const ketu = cue7("ketu07", 770);
  const part = ramp(f, a, a + 18, "out");
  const hs = 2.4 - 1.0 * part;
  const head = { x: 540 - 200 * part, y: 1150 - 380 * part };
  const kr = ramp(f, rahu - 2, rahu + 12, "out");
  const kk = ramp(f, ketu - 2, ketu + 12, "out");
  const bodyIn = ramp(f, a + 4, a + 26, "out");
  const bx = 720 + 120 * (1 - bodyIn);
  const by = 1520 + 220 * (1 - bodyIn) + Math.sin(f / 20) * 8;
  const ra: P2 = [head.x, head.y + 40];
  const ke: P2 = [bx, by - 200];
  const axis = ramp(f, ketu + 10, b - 4, "out");
  const popR = Math.max(0, 1 - Math.abs(f - rahu - 4) / 8);
  const popK = Math.max(0, 1 - Math.abs(f - ketu - 4) / 8);
  const z = track(f, [[a, 1.1], [b, 1.0, "io"]]);
  return (
    <World>
      <g transform={`translate(540 1150) scale(${z}) translate(-540 -1150)`}>
        <Cosmos f={f} z={1.04} />
        <ellipse cx={540} cy={1100} rx={500} ry={640} fill="#3A2160" opacity={0.4} filter="url(#mBlur8)" />
        {axis > 0.01 ? (
          <path
            d={`M${ra[0]} ${ra[1]}L${ra[0] + (ke[0] - ra[0]) * axis} ${ra[1] + (ke[1] - ra[1]) * axis}`}
            stroke="#F3DB9D"
            strokeWidth={4}
            strokeDasharray="14 12"
            opacity={0.7}
          />
        ) : null}
        {bodyIn > 0.01 && kk < 0.99 ? (
          <g opacity={bodyIn * (1 - kk)}>
            <KetuBody7 id="sp7ke" f={f} x={bx} y={by} s={1.1} facing={-1} />
          </g>
        ) : null}
        <circle cx={ke[0]} cy={ke[1]} r={90 + 120 * popK} fill="#CFE6FF" opacity={0.55 * popK} filter="url(#mBlur8)" />
        <KetuForm x={ke[0]} y={ke[1]} r={110} f={f} k={kk} tail={1} tailDeg={20}>
          <Glyph7 t="के" size={110} color="#DCE3F4" />
        </KetuForm>
        {kr < 0.99 ? (
          <g opacity={1 - kr}>
            <RahuSpeaking id="sp7rahu" at={head} s={hs * (1 - 0.4 * kr)} f={f} laugh={0} throat={1} rage={0.6} lookX={0.3} />
          </g>
        ) : null}
        <circle cx={ra[0]} cy={ra[1]} r={90 + 120 * popR} fill="#FFE6A3" opacity={0.55 * popR} filter="url(#mBlur8)" />
        <GrahaOrb x={ra[0]} y={ra[1]} r={110} f={f} rim="#FFB23D" k={kr}>
          <Glyph7 t="रा" size={110} color="#FFD27A" />
        </GrahaOrb>
        <Motes f={f} n={24} seed="sp7m" color="#FFD27A" dir={-1} speed={0.4} size={3} o={0.55} />
      </g>
      <Vignette o={0.7} />
    </World>
  );
};

/** A pale full moon (Chandra's silver-blue), with soft craters and a glow; flash 0..1 brightens it. */
export const Moon7: React.FC<{ x: number; y: number; r: number; flash?: number }> = ({ x, y, r, flash = 0 }) => (
  <g>
    <circle cx={x} cy={y} r={r * 1.9} fill="#CFE6FF" opacity={0.16 + 0.3 * flash} filter="url(#mBlur8)" />
    <circle cx={x} cy={y} r={r} fill="#DCE3F4" />
    <circle cx={x - r * 0.25} cy={y - r * 0.2} r={r * 0.22} fill="#B4BEDA" opacity={0.7} />
    <circle cx={x + r * 0.3} cy={y + r * 0.15} r={r * 0.14} fill="#B4BEDA" opacity={0.6} />
    <circle cx={x - r * 0.05} cy={y + r * 0.42} r={r * 0.1} fill="#B4BEDA" opacity={0.6} />
    <circle cx={x} cy={y} r={r} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={0.5 + 0.5 * flash} />
  </g>
);

/*
 * Episode 7, scene 8, over Rahu's line 08 ("सूर्य... चंद्र... मैं लौटूँगा।").
 * Close on the head again, large and glaring (RahuSpeaking, lip-synced to '08_rahu'), with his two betrayers
 * small in the sky behind him: the uncovered sun at upper left and the full moon at upper right. On 'सूर्य' the
 * sun flares and his eyes swing to it; on 'चंद्र' the moon flares and his eyes swing across; on 'लौटूँगा' he turns
 * to camera, eyes burning, under a slow push and a violet pulse: the vow the eclipses keep.
 * Placeholder defaults: vow 800-880, 'सूर्य' 812, 'चंद्र' 834, 'लौटूँगा' 856.
 */
export const VowScene7: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = span7(SCENES, "vow", [800, 880]);
  const surya = cue7("surya08", 812);
  const chandra = cue7("chandra08", 834);
  const lautunga = cue7("lautunga", 856);
  const sFlash = Math.max(0, 1 - Math.abs(f - surya - 3) / 10);
  const cFlash = Math.max(0, 1 - Math.abs(f - chandra - 3) / 10);
  const vow = Math.max(0, 1 - Math.abs(f - lautunga - 4) / 14);
  const look = track(f, [
    [a, 0.2],
    [surya - 4, 0.2],
    [surya + 4, -0.6, "io"],
    [chandra - 4, -0.6],
    [chandra + 4, 0.6, "io"],
    [lautunga - 4, 0.6],
    [lautunga + 2, 0, "io"],
  ]);
  const z = track(f, [[a, 1.0], [lautunga, 1.04, "io"], [b, 1.1, "io"]]);
  return (
    <World>
      <g transform={`translate(540 1250) scale(${z}) translate(-540 -1250)`}>
        <Cosmos f={f} z={1.04} />
        <ellipse cx={290} cy={380} rx={300} ry={260} fill="#FFB23D" opacity={0.18 + 0.25 * sFlash} filter="url(#mBlur8)" />
        <EclipseSun id="vw7sun" f={f} x={290} y={380} r={110} cover={0} />
        <Moon7 x={800} y={400} r={95} flash={cFlash} />
        <ellipse cx={540} cy={1150} rx={460} ry={520} fill="#3A2160" opacity={0.45 + 0.2 * vow} filter="url(#mBlur8)" />
        <RahuSpeaking id="vw7rahu" at={{ x: 540, y: 1250 }} s={2.8} f={f} line="08_rahu" laugh={0} throat={1} rage={0.85 + 0.15 * vow} lookX={look} />
        <Motes f={f} n={22} seed="vw7m" color="#C9B4FF" dir={-1} speed={0.4} size={3} o={0.5} />
      </g>
      <rect width={W} height={H} fill="#5A2A9A" opacity={0.2 * vow} />
      <Vignette o={0.75} />
    </World>
  );
};
