import React from "react";
import { RigDefs } from "../rig";
import { CAM0, KshiraSagar, SetDefs } from "../sets";
import { H, W } from "../style";

/* Episode 6 scene index. Each scene starts as a placeholder (the plain series sea) and is replaced by
   a re-export from its real file (scenes6a..e) as it is built, so Episode6.tsx never changes. */

export const Sea6: React.FC<{ f: number; glow?: number }> = ({ f, glow = 0.4 }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
    <RigDefs />
    <SetDefs />
    <KshiraSagar f={f} cam={CAM0} glow={glow} />
  </svg>
);

const Placeholder: React.FC<{ f: number }> = ({ f }) => <Sea6 f={f} />;

export { Hook6, TitleBed6 } from "./scenes6a";
export { DhanvantariScene } from "./scenes6b";
export { BaliScene } from "./scenes6b";
export { BrawlScene } from "./scenes6b";
export { MohiniScene } from "./scenes6c";
export { AskScene } from "./scenes6c";
export { EnchantedScene } from "./scenes6d";
export { RevealScene } from "./scenes6d";
export { AmritScene } from "./scenes6d";
export { EndBed6, RahuScene } from "./scenes6e";
