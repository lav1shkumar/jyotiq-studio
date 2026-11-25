import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { A, B, C, D, G } from "../fight/cast";
import { FigureSpec, headOf } from "../fight/rig";
import { easeInOut, pop, prog } from "../motion";
import { SANS } from "../theme";
import { FocusLines, SpeedLines } from "./anime";
import { HouseSVG } from "./houseKit";

/* ================================================================== */
/* S4  reel 338-466: lights back on in the house; one by one every     */
/* housemate's question pops up as a Jyotiq question chip.             */
/* AsksContent(f) is also the texture of the ball in S5.               */
/* ================================================================== */

/** Cast frame: the tableau holds (no struggle noise after 92), people breathe. */
const castFrame = (f: number) => 92 + f;

type Ask = { who: FigureSpec; text: string; at: number; x: number; y: number };
/** Chip anchor = its top-left in world px; `at` = local frame it pops (on the track's beats). */
export const ASKS: Ask[] = [
  { who: D, text: "What does my future hold for me?", at: 14, x: 150, y: 372 },
  { who: G, text: "Am I going home this week?", at: 29, x: 262, y: 512 },
  { who: A, text: "Will I win this season?", at: 45, x: 96, y: 652 },
  { who: B, text: "Who is my real friend here?", at: 60, x: 246, y: 792 },
  { who: C, text: "When will I find true love?", at: 75, x: 90, y: 932 },
];
const CHIP_H = 78;

const Chip: React.FC<{ ask: Ask; f: number; fps: number; active: boolean }> = ({ ask, f, fps, active }) => {
  const p = pop(f, fps, ask.at, 11);
  if (f < ask.at) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: ask.x,
        top: ask.y,
        height: CHIP_H,
        padding: "0 30px 0 26px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        borderRadius: 26,
        background: "rgba(19,17,13,0.94)",
        border: `2.5px solid ${active ? "#DFB15B" : "#DFB15B77"}`,
        boxShadow: active ? "0 0 34px rgba(223,177,91,0.55), 0 14px 30px rgba(0,0,0,0.45)" : "0 12px 26px rgba(0,0,0,0.4)",
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 34,
        color: "#F5ECDD",
        whiteSpace: "nowrap",
        opacity: Math.min(1, p * 1.5),
        transform: `translateY(${(1 - Math.min(1, p)) * 40}px) scale(${0.7 + 0.3 * p})`,
        transformOrigin: "30% 100%",
      }}
    >
      <span style={{ color: "#DFB15B", fontSize: 34 }}>✦</span>
      {ask.text}
      <span style={{ color: "#DFB15B", fontSize: 30, marginLeft: 4 }}>↗</span>
    </div>
  );
};

/** The whole S4 frame at local frame f (no camera shake, no transitions): set, cast, chips. */
export const AsksContent: React.FC<{ f: number; fps: number }> = ({ f, fps }) => {
  const tf = castFrame(f);
  const zoom = 1.1 - 0.1 * prog(f, 0, 110, easeInOut);
  const last = ASKS.filter((a) => f >= a.at).length - 1;
  const header = pop(f, fps, 4, 14);
  return (
    <AbsoluteFill style={{ background: "#3A0C24", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "540px 600px" }}>
        <HouseSVG
          tf={tf}
          over={
            <g>
              {/* leader lines from each chip to its asker's head */}
              {ASKS.map((a, i) => {
                const k = prog(f, a.at, a.at + 7);
                if (k <= 0) return null;
                const h = headOf(a.who, tf);
                const sx = Math.min(Math.max(h.x, a.x + 60), a.x + 520);
                const sy = a.y + CHIP_H;
                const ex = sx + (h.x - sx) * k;
                const ey = sy + (h.y - 60 - sy) * k;
                return (
                  <g key={i} opacity={i === last ? 1 : 0.55}>
                    <path d={`M${sx} ${sy}L${ex} ${ey}`} stroke="#F3DB9D" strokeWidth={3} strokeDasharray="2 9" strokeLinecap="round" />
                    {k >= 1 ? <circle cx={ex} cy={ey} r={7} fill="#FFE7A8" /> : null}
                  </g>
                );
              })}
            </g>
          }
        />
        {/* warm "Jyotiq light" from above */}
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 700px 900px at 50% 30%, rgba(255,214,140,0.18), transparent 70%)" }} />
        {ASKS.map((a, i) => (
          <Chip key={i} ask={a} f={f} fps={fps} active={i === last} />
        ))}
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 268,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 34,
          letterSpacing: 9,
          color: "#FFE7A8",
          textShadow: "0 3px 14px rgba(40,0,20,0.8)",
          opacity: Math.min(1, header * 1.4),
        }}
      >
        EVERYONE HAS A QUESTION
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 75% at 50% 52%, transparent 55%, rgba(20,0,12,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

export const S4Asks: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flash = f === 0 ? 0.7 : f === 1 ? 0.3 : 0;
  return (
    <AbsoluteFill>
      <AsksContent f={f} fps={fps} />
      {f < 8 ? <SpeedLines f={f} angle={0} count={34} opacity={0.5 * (1 - f / 8)} speed={180} seed="s4" /> : null}
      {ASKS.map((a) =>
        f >= a.at && f < a.at + 4 ? <FocusLines key={a.at} f={f} color="#FFFFFF" opacity={0.18} rx={420} ry={700} cy={900} count={70} seed={`fa${a.at}`} /> : null,
      )}
      {flash > 0 ? <AbsoluteFill style={{ background: "#FFFFFF", opacity: flash }} /> : null}
    </AbsoluteFill>
  );
};
