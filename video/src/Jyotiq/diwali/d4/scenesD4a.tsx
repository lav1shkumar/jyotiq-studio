import React from "react";
import { World } from "../../manthan/kit";
import { blinkAt } from "../../manthan/rig";
import { H, ramp, track, W } from "../../manthan/style";
import { D2Defs } from "../d2/scenesD2a";
import { DeityStanding, KRISHNA } from "../shared/deities";
import { AnnakootThali, GokulVillage, GovardhanHill } from "./sets4";
import { CUES, SCENES } from "./timing";

/* Diwali Day 4 scenes, part A: the hook (01: the Annakoot thali, whose food hill dissolves into Govardhan) and Gokul
   (title + 02). One clock: timing.ts (PLACEHOLDER until the takes are in). The series defs are Day 2's (D2Defs). */

const cue = (k: string, dflt: number): number => (typeof CUES[k] === "number" ? CUES[k] : dflt);

/** Zoom about a fixed point, so the frame never leaves the set (for z >= 1). */
const zoomAt = (x: number, y: number, z: number) => `translate(${x} ${y}) scale(${z}) translate(${-x} ${-y})`;

/* ------------------------------------------------------------------ */
/* 01 hook: the Annakoot thali, then the shape match into Govardhan     */
/* ------------------------------------------------------------------ */

const THALI_AT = { x: 540, y: 1450, s: 1.15 }; // the mound's peak sits at about y 1100, below the hook plate

/** Lit from frame 0 on the thali with a slow push. On 'जवाब' the camera eases toward the food hill, and from
    'पहाड़' the hill of food dissolves into Govardhan at the same place and size while the sky turns to storm (a
    shape match into the title). */
export const HookD4: React.FC<{ f: number }> = ({ f }) => {
  const [, end] = SCENES.hook;
  const J = cue("jawab01", 140);
  const P = cue("pahad01", 170);
  const z = track(f, [[0, 1.0], [J, 1.08, "lin"], [end, 1.3, "io"]]);
  const k = ramp(f, P - 4, P + 26, "io");
  return (
    <World>
      <D2Defs />
      <g transform={zoomAt(540, 1300, z)}>
        <rect width={W} height={H} fill="#1A0F0A" />
        <circle cx={540} cy={1300} r={700} fill="url(#d2Flare)" opacity={0.35 * (1 - k)} />
        <rect width={W} height={H} fill="#141A30" opacity={k} />
        <path d="M0 1440C300 1420 700 1436 1080 1414V1920H0Z" fill="#16220F" opacity={k} />
        <g transform={`translate(${THALI_AT.x} ${THALI_AT.y})`}>
          <g opacity={1 - k}>
            <AnnakootThali f={f} s={THALI_AT.s} />
          </g>
          <g opacity={k}>
            <GovardhanHill f={f} s={THALI_AT.s} />
          </g>
        </g>
      </g>
    </World>
  );
};

/* ------------------------------------------------------------------ */
/* Title + 02: Gokul offering to Indra; Krishna points at the hill      */
/* ------------------------------------------------------------------ */

/** Wide on Gokul at golden hour under the title; Indra's clouds brighten on 'इंद्र' as the village raises its
    offerings. A cut on 'कृष्ण' to a closer two-shot of Krishna and the hill, his right hand rising to point at it
    by 'पर्वत' ('पूजा उस पर्वत की करो'). */
export const GokulD4: React.FC<{ f: number }> = ({ f }) => {
  const [a] = SCENES.title;
  const [, b] = SCENES.gokul;
  const IN = cue("indra02", 276);
  const KR = cue("krishna02", 337);
  const PV = cue("parvat02", 397);
  const glow = 0.4 + 0.6 * ramp(f, IN - 4, IN + 20, "out");
  const point = ramp(f, KR + 10, PV, "io");
  const handR: [number, number] = [120 + 130 * point, -110 - 340 * point];
  const view = f < KR ? zoomAt(540, 1100, track(f, [[a, 1.0], [KR, 1.06, "io"]])) : zoomAt(520, 1320, track(f, [[KR, 1.4], [b, 1.5, "io"]]));
  return (
    <World>
      <D2Defs />
      <g transform={view}>
        <GokulVillage f={f} glow={glow} />
        <g transform="translate(430 1500) scale(0.45)">
          <DeityStanding L={KRISHNA} t={f} smile={0.6} closed={blinkAt("d4kg", f)} halo={0.5} handR={handR} />
        </g>
      </g>
    </World>
  );
};
