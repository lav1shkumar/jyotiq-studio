import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { RigDefs } from "../rig";
import { SetDefs } from "../sets";
import { EndCard7, EndKundali7, HookPlate7, TitleCard7 } from "./gfx7";
import { Hook7, TitleBed7 } from "./scenes7a";
import { AlertScene7, PourScene7, RowScene7 } from "./scenes7b";
import { ChakraScene7, MeltScene7 } from "./scenes7c";
import { ImmortalScene7, SplitScene7, VowScene7 } from "./scenes7d";
import { ChaseScene7, EndBed7 } from "./scenes7e";

/*
 * Review sheet for Episode 7's art on the placeholder timing.
 * Frames 0-29: the hook (Hook7 + HookPlate7), sampled every 4th hook frame (test frame t = hook frame 4t).
 * Frames 30+: one story moment per test frame from SHOTS (scene, reel frame, optional HTML overlay), so a 2x2
 *   stills sheet of four consecutive test frames checks four moments at once. The eclipse, chakra and graha-orb
 *   art passed its own stills earlier and is checked again inside its scenes.
 */
type Shot = { Scene: React.FC<{ f: number }>; at: number; Over?: React.FC<{ f: number }> };

const TitleOver: React.FC<{ f: number }> = ({ f }) => <TitleCard7 f={f} at={120} out={150} />;
// EndKundali7 is an SVG fragment (KundaliGrid, lines, text), so it needs its own full-frame svg; it starts with
// EndCard7 on line 10 (the card's cues default to at+20 'kundali', at+80 'bhaav', at+120 'signoff', S+30 'offer').
const EndOver: React.FC<{ f: number }> = ({ f }) => (
  <>
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      <EndKundali7 f={f} at={1030} />
    </svg>
    <EndCard7 f={f} at={1030} />
  </>
);

const SHOTS: Shot[] = [
  { Scene: TitleBed7, at: 135, Over: TitleOver }, // 30
  { Scene: RowScene7, at: 240 }, // 31
  { Scene: PourScene7, at: 312 }, // 32
  { Scene: PourScene7, at: 382 }, // 33
  { Scene: AlertScene7, at: 430 }, // 34
  { Scene: AlertScene7, at: 458 }, // 35
  { Scene: MeltScene7, at: 487 }, // 36 the disguise mid-melt
  { Scene: ChakraScene7, at: 528 }, // 37 the chakra spinning up in Vishnu's hand
  { Scene: ChakraScene7, at: 556 }, // 38 in flight
  { Scene: ChakraScene7, at: 574 }, // 39 the strike
  { Scene: ImmortalScene7, at: 608 }, // 40 laughing as the white clears
  { Scene: ImmortalScene7, at: 684 }, // 41 the 'अमर' flare
  { Scene: SplitScene7, at: 724 }, // 42 the head becoming रा
  { Scene: SplitScene7, at: 792 }, // 43 both orbs on the axis
  { Scene: VowScene7, at: 815 }, // 44 the sun flaring on 'सूर्य', his eyes on it
  { Scene: ChaseScene7, at: 935 }, // 45 mid-chase with the smoke trail
  { Scene: ChaseScene7, at: 970 }, // 46 jaws open at the sun
  { Scene: ChaseScene7, at: 1014 }, // 47 totality with the diamond ring
  { Scene: EndBed7, at: 1080, Over: EndOver }, // 48 line 10: chart turning, tease, tie-in, the question
  { Scene: EndBed7, at: 1192, Over: EndOver }, // 49 the sign-off: Jyotiq block and the offer
];

const Defs: React.FC = () => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <RigDefs />
    <SetDefs />
  </svg>
);

export const ManthanEp7Test: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 30) {
    const hf = f * 4;
    return (
      <AbsoluteFill style={{ background: "#07050E" }}>
        <Defs />
        <Hook7 f={hf} />
        <HookPlate7 f={hf} out={120} />
      </AbsoluteFill>
    );
  }
  const shot = SHOTS[Math.min(SHOTS.length - 1, f - 30)];
  const { Scene, Over } = shot;
  return (
    <AbsoluteFill style={{ background: "#07050E" }}>
      <Defs />
      <Scene f={shot.at} />
      {Over ? <Over f={shot.at} /> : null}
    </AbsoluteFill>
  );
};
