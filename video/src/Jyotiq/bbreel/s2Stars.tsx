import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { A, B, FREEZE } from "../fight/cast";
import { useCamera as hookCamera } from "../fight/FightHook";
import { headOf } from "../fight/rig";
import { clamp, easeInOut, pop, prog } from "../motion";
import { SERIF } from "../theme";
import { FocusLines, StarDust, TitleText, sparklePath } from "./anime";
import { ALL_CAST, Constellation, HouseSVG, Mars, Saturn } from "./houseKit";

/* ================================================================== */
/* S2  reel 108-215: impact frame, the lights go out, every housemate  */
/* turns into a constellation. "It's not them. / It's their STARS."    */
/* ================================================================== */

const parseCam = (s: string) => {
  const m = /translate\(([-\d.]+)px, ([-\d.]+)px\) scale\(([-\d.]+)\)/.exec(s);
  return m ? { tx: Number(m[1]), ty: Number(m[2]), s: Number(m[3]) } : { tx: 0, ty: 0, s: 1 };
};
const END = parseCam(hookCamera(107).transform);
const WIDE = { tx: -27, ty: -60, s: 1.05 };

export const S2Stars: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // camera: from the hook's last zoom straight back out to the whole room, then a slow push
  const back = prog(f, 3, 34, easeInOut);
  const push = 1 + 0.035 * prog(f, 34, 107);
  const s = (END.s + (WIDE.s - END.s) * back) * push;
  const tx = END.tx + (WIDE.tx - END.tx) * back - (push - 1) * 540;
  const ty = END.ty + (WIDE.ty - END.ty) * back - (push - 1) * 1250;

  const night = interpolate(f, [4, 40], [0, 0.9], clamp);
  const impact = f < 2;
  const flash = f === 2 ? 0.55 : f === 3 ? 0.2 : 0;

  const ha = headOf(A, FREEZE);
  const hb = headOf(B, FREEZE);
  const mars = { x: ha.x - 10, y: ha.y - 190 };
  const sat = { x: hb.x + 20, y: hb.y - 210 };
  const pl = pop(f, fps, 70, 10);

  const l1 = pop(f, fps, 53, 12);
  const l2 = pop(f, fps, 68, 10);
  const l3 = pop(f, fps, 70, 9);

  return (
    <AbsoluteFill style={{ background: "#07061A", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${s.toFixed(4)})`,
          transformOrigin: "0 0",
          filter: impact ? "grayscale(1) contrast(3) invert(1)" : "saturate(0.7)",
        }}
      >
        <HouseSVG
          tf={FREEZE}
          over={
            <>
              <rect x={-200} y={-200} width={1480} height={2400} fill="#090722" opacity={night} />
              {ALL_CAST.map((spec, i) => (
                <Constellation key={spec.id} spec={spec} tf={FREEZE} f={f} p={prog(f, 12 + (i % 4) * 4, 46 + (i % 4) * 4)} />
              ))}
              {pl > 0.01 ? (
                <g opacity={Math.min(1, pl)}>
                  <path d={`M${mars.x} ${mars.y + 44}L${ha.x} ${ha.y - 52}`} stroke="#FF8A5C" strokeWidth={3} strokeDasharray="8 10" opacity={0.8} />
                  <path d={`M${sat.x} ${sat.y + 44}L${hb.x} ${hb.y - 52}`} stroke="#9DB8FF" strokeWidth={3} strokeDasharray="8 10" opacity={0.8} />
                  <g transform={`translate(${mars.x} ${mars.y}) scale(${pl}) translate(${-mars.x} ${-mars.y})`}>
                    <Mars x={mars.x} y={mars.y} r={44} id="s2m" />
                  </g>
                  <g transform={`translate(${sat.x} ${sat.y}) scale(${pl}) translate(${-sat.x} ${-sat.y})`}>
                    <Saturn x={sat.x} y={sat.y} r={38} id="s2s" />
                  </g>
                </g>
              ) : null}
            </>
          }
        />
      </AbsoluteFill>
      <StarDust f={f} opacity={night} count={110} />
      {impact ? <FocusLines f={f} color="#000000" rx={260} ry={380} cx={560} cy={1060} count={130} width={1.2} /> : null}
      {f >= 3 && f < 22 ? <FocusLines f={f} color="#F3DB9D" opacity={0.5 * (1 - prog(f, 3, 22))} rx={420} ry={640} cx={540} cy={1150} count={90} /> : null}
      {flash > 0 ? <AbsoluteFill style={{ background: "#FFFFFF", opacity: flash }} /> : null}

      {/* copy: middle band, clear of the IG header and caption */}
      <div style={{ position: "absolute", left: 90, width: 900, top: 330, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {f >= 53 ? (
          <div
            style={{
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 84,
              color: "#F5ECDD",
              letterSpacing: -1,
              opacity: Math.min(1, l1 * 1.5),
              transform: `translateY(${(1 - Math.min(1, l1)) * 30}px) scale(${0.8 + 0.2 * l1})`,
              textShadow: "0 6px 30px rgba(0,0,0,0.8)",
            }}
          >
            It&apos;s not them.
          </div>
        ) : null}
        {f >= 68 ? (
          <div
            style={{
              marginTop: 10,
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 84,
              color: "#F5ECDD",
              letterSpacing: -1,
              opacity: Math.min(1, l2 * 1.5),
              transform: `translateY(${(1 - Math.min(1, l2)) * 30}px)`,
              textShadow: "0 6px 30px rgba(0,0,0,0.8)",
            }}
          >
            It&apos;s their
          </div>
        ) : null}
        {f >= 70 ? (
          <div style={{ marginTop: 14, position: "relative", transform: `scale(${Math.max(0, l3) * (1 + 0.04 * Math.sin(f / 4))}) rotate(-3deg)` }}>
            <TitleText text="STARS." size={136} fill="#FFD45A" stroke="#2A1206" strokeW={17} shadow="#B8541A" />
            <svg width={120} height={120} viewBox="-60 -60 120 120" style={{ position: "absolute", right: -40, top: -46, transform: `rotate(${f * 3}deg)`, overflow: "visible" }}>
              <path d={sparklePath(52)} fill="#FFF6D6" style={{ filter: "drop-shadow(0 0 12px #FFD45A)" }} />
            </svg>
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
