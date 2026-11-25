import React from "react";
import { World } from "../../manthan/kit";
import { blinkAt } from "../../manthan/rig";
import { Motes, Vignette } from "../../manthan/sets";
import { H, ramp, track, W } from "../../manthan/style";
import { Diya } from "../d1/diya";
import { Danda, DeityStanding, YAMRAJ } from "../shared/deities";
import { DawnSky } from "../shared/fx";
import { D2Defs } from "./scenesD2a";
import { Serpent } from "./serpent";
import { BrideThali, Palace } from "./sets2";
import { CUES, LINES, SCENES } from "./timing";
import { VO } from "./voData";

/* Diwali Day 2 scenes, part B: the lamps (03), the serpent (04) and Yamraj's words (05).
   One clock: timing.ts (PLACEHOLDER until the takes are in). */

const cue = (k: string, dflt: number): number => (typeof CUES[k] === "number" ? CUES[k] : dflt);

/** Zoom about a fixed point, so the frame never leaves the set (for z >= 1). */
const zoomAt = (x: number, y: number, z: number) => `translate(${x} ${y}) scale(${z}) translate(${-x} ${-y})`;

/* ------------------------------------------------------------------ */
/* 03: the gold at the threshold, the lamps in every corner             */
/* ------------------------------------------------------------------ */

/** Wide on the threshold as the gold and silver are laid ('सोना-चाँदी'); a cut on 'और' to the bride with her thali
    while the lamps light corner by corner ('कोने'); a cut back to the whole palace glowing on 'दीये'. The warm room
    light rises with the lamps (review note: the lamps alone read small and dim). */
export const LampsD2: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.lamps;
  const S = cue("sona03", 524);
  const B = cue("cap03b", 555);
  const K = cue("kone03", 585);
  const D = cue("diye03", 615);
  const gold = ramp(f, S - 6, B, "out");
  const light = ramp(f, K - 4, D + 24, "io");
  const view =
    f < B
      ? zoomAt(540, 1250, track(f, [[a, 1.0], [B, 1.22, "io"]]))
      : f < D
        ? zoomAt(250, 1300, track(f, [[B, 1.6], [D, 1.72, "io"]]))
        : zoomAt(540, 1000, track(f, [[D, 1.0], [b, 1.05, "io"]]));
  return (
    <World>
      <D2Defs />
      <g transform={view}>
        <Palace f={f} lampsAt={K - 4} gold={gold} push={ramp(f, a, b, "lin")} />
        <g transform="translate(250 1420) scale(0.85)">
          <BrideThali f={f} />
        </g>
        <circle cx={540} cy={1100} r={900} fill="url(#d2Flare)" opacity={0.12 + 0.43 * light} style={{ mixBlendMode: "screen" }} />
      </g>
    </World>
  );
};

/* ------------------------------------------------------------------ */
/* 04: Yama as a serpent, dazzled by the light, gone at dawn            */
/* ------------------------------------------------------------------ */

/** A low shot as the serpent glides in toward the gold ('सर्प'); a cut on 'रोशनी' close on its hood among the lamps;
    the glare flares on 'चौंधिया' and it squints and coils; a cut on 'और' to wide as dawn fills the doorway ('भोर');
    on 'लौट' it fades into the dawn light. Calm and dignified throughout: no fangs, no strike. */
export const SerpentD2: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.serpent;
  const SP = cue("sarp04", 665);
  const R = cue("roshni04", 726);
  const C = cue("chondhiya04", 756);
  const B = cue("cap04b", 786);
  const BH = cue("bhor04", 801);
  const L = cue("laut04", 846);
  const glide = ramp(f, SP - 15, SP + 35, "out") * (1 - 0.15 * ramp(f, L, L + 30, "io"));
  const hood = 0.3 + 0.7 * ramp(f, SP + 10, R, "io");
  const glare = ramp(f, C - 3, C + 3, "out") * (1 - 0.55 * ramp(f, C + 6, C + 30, "io"));
  const squint = ramp(f, C - 2, C + 6, "out");
  const coil = 0.65 * ramp(f, C, B + 10, "io");
  const dawn = ramp(f, BH - 6, L + 20, "io");
  const gone = ramp(f, L, L + 24, "in");
  const view =
    f < R
      ? zoomAt(420, 1360, track(f, [[a, 1.42], [R, 1.55, "io"]]))
      : f < B
        ? zoomAt(580, 1200, track(f, [[R, 1.85], [B, 1.95, "io"]]))
        : zoomAt(540, 1000, track(f, [[B, 1.0], [b, 1.06, "io"]]));
  return (
    <World>
      <D2Defs />
      <g transform={view}>
        <Palace f={f} lampsAt={a - 300} gold={1} dawn={dawn} push={ramp(f, a, b, "lin")} />
        <g transform="translate(250 1420) scale(0.85)">
          <BrideThali f={f} />
        </g>
        <circle cx={540} cy={1100} r={900} fill="url(#d2Flare)" opacity={0.55 - 0.2 * dawn} style={{ mixBlendMode: "screen" }} />
        <g opacity={1 - gone} transform={`translate(0 ${-20 * gone})`}>
          <Serpent f={f} x={560} y={1370} glide={glide} coil={coil} squint={squint} hood={hood} s={0.8} />
        </g>
        <circle cx={584} cy={1220} r={420} fill="url(#d2Flare)" opacity={0.85 * glare * (1 - 0.8 * dawn) + 1.2 * gone * (1 - gone)} style={{ mixBlendMode: "screen" }} />
      </g>
    </World>
  );
};

/* ------------------------------------------------------------------ */
/* 05: Yamraj speaks, calm and kind, at dawn                            */
/* ------------------------------------------------------------------ */

/** Mouth openness from the take's loudness envelope (Day 1's talkD1 on Day 2's clock). */
export const talkD2 = (line: string, f: number): number => {
  const r = LINES[line];
  const v = VO[line];
  if (!r || !v) return 0;
  const i = Math.round(f) - r[0];
  if (i < 0 || i >= v.env.length) return 0;
  const g = (k: number) => v.env[Math.max(0, Math.min(v.env.length - 1, k))];
  return Math.min(1, ((g(i - 1) + 2 * g(i) + g(i + 1)) / 4) * 1.1);
};

const CU = 2.2;

/** A close-up framed as Day 1's WordsD1 (eyes near y 600): a dawn sky, gold motes, his halo and a slow push. His
    danda rests in his right hand; the diya in his left palm lights on 'नाम' (the lamp in his name). The chest area
    stays calm for the gold words at y 1270. */
export const YamaD2: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.yama;
  const z = track(f, [[a, 1.0], [b, 1.06, "io"]]);
  const speak = talkD2("05_yamraj", f);
  const footY = 650 + 720 * CU;
  const N = cue("naam05", 911);
  const lit = ramp(f, N - 4, N + 10, "out");
  return (
    <World>
      <D2Defs />
      <g transform={`translate(540 800) scale(${z}) translate(-540 -800)`}>
        <DawnSky k={1} y={1500} />
        <rect width={W} height={H} fill="#0C0A1C" opacity={0.3} />
        <g transform={`translate(540 ${footY}) scale(${CU})`}>
          <DeityStanding
            L={YAMRAJ}
            t={f}
            smile={0.45}
            speak={speak}
            closed={blinkAt("d2ym", f)}
            halo={1}
            inHandR={<Danda />}
            inHandL={<Diya f={f} lit={lit} seed="d2yd" scale={0.32} glow={lit} />}
          />
        </g>
        <Motes f={f} n={24} seed="d2ym" color="#FFE6A3" dir={-1} speed={0.5} size={3.5} o={0.55} />
      </g>
      <Vignette o={0.6} />
    </World>
  );
};
