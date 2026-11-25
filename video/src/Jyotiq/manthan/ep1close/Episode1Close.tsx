import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { Episode1Props, ManthanEp1 } from "../Episode1";
import { EndCard } from "../graphics";
import { EndBed } from "../scenesC";
import { P } from "../style";
import { EP1C } from "./timing";

/* Episode 1 "Shraap" with the series' voiced Jyotiq close (ep1_close_narrator, then jyotiq_signoff)
   over its end card. Frames before Episode 1's original end are Episode 1 itself (its own audio off,
   end card in the v2 layout with www.jyotiq.ai and the CTA arriving on the sign-off); after that the
   end bed and card simply continue. Audio: scripts/manthan_ep1_close_audio.py. */

export const EP1C_TOTAL = EP1C.TOTAL;
const END: Episode1Props["endCard"] = { v2: true, cta: EP1C.SIGNOFF };

export const ManthanEp1Close: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: P.jNight }}>
      {f < EP1C.EP1_TOTAL ? (
        <ManthanEp1 audio={false} endCard={END} />
      ) : (
        <>
          <AbsoluteFill>
            <EndBed f={f} />
          </AbsoluteFill>
          <EndCard f={f} at={EP1C.END_CARD} {...END} />
        </>
      )}
      <Audio src={staticFile("jyotiq/manthan/ep1close/mix_close.wav")} />
    </AbsoluteFill>
  );
};
