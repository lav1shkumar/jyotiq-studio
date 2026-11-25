import React from "react";
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { vnoise } from "../fight/rig";
import { clamp, easeIn, easeOut, pop, prog } from "../motion";
import { SANS, SERIF } from "../theme";
import { FocusLines, lightningPath, Shockwave, Sparks, SpeedLines, TitleText } from "./anime";
import { DEVA } from "./fonts";
import { Kundali, Mars, Saturn } from "./houseKit";

/* ================================================================== */
/* S3  reel 215-338: MANGAL vs SHANI. Title card slams in, the planets */
/* fire beams that lock in the middle, the Jyotiq diya drops into the  */
/* clash, swallows both beams and a kundali draws itself around it.    */
/*   local 0 cut (3.58 s) / 15 beams (4.07 s) / 68 diya lands /         */
/*   83 absorb / 122 out (7.65 s)                                       */
/* ================================================================== */

const MARS = { x: 320, y: 650, r: 150 };
const SAT = { x: 800, y: 1235, r: 118 };
const BEAMS_AT = 15;
const DIYA_AT = 68;
const ABSORB = 83;
/** logo-icon.png box once landed; its flame sits 62 % down the image. */
const DIYA = { left: 330, top: 705, w: 420, h: 346, flame: 215 };
const DIYA_CY = DIYA.top + DIYA.h / 2;

/** Seam of the diagonal split, left-low to right-high. */
const SEAM = { x1: -60, y1: 1215, x2: 1140, y2: 705 };

const clashPoint = (f: number) => {
  const t = 0.5 + 0.06 * Math.sin(f / 2.6) + 0.05 * vnoise("cl", f * 0.4);
  return { x: MARS.x + (SAT.x - MARS.x) * t, y: MARS.y + (SAT.y - MARS.y) * t };
};

const Beam: React.FC<{ x1: number; y1: number; x2: number; y2: number; color: string; core: string; w: number }> = ({ x1, y1, x2, y2, color, core, w }) => (
  <g strokeLinecap="round">
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w * 2.6} opacity={0.18} />
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w * 1.6} opacity={0.45} />
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} opacity={0.95} />
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={core} strokeWidth={w * 0.38} />
  </g>
);

export const S3Clash: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slide = prog(f, 0, 7, easeOut);
  const fight = f >= BEAMS_AT && f < ABSORB + 4;
  const calm = interpolate(f, [ABSORB, ABSORB + 12], [0, 1], clamp);

  // shake: on the cut, through the beam lock, on the diya landing
  let amp = 18 * Math.exp(-f / 4);
  if (fight) amp += 7 + 5 * Math.sin(f / 1.7);
  if (f >= DIYA_AT) amp += 26 * Math.exp(-(f - DIYA_AT) / 4);
  amp *= 1 - calm;
  const sx = amp * vnoise("s3x", f * 0.9);
  const sy = amp * vnoise("s3y", f * 0.9 + 30);

  const cp = clashPoint(f);
  // after the diya lands both beams bend into its flame and thin out
  const diyaTop = interpolate(f, [DIYA_AT - 5, DIYA_AT], [-480, DIYA.top], { ...clamp, easing: easeIn });
  const flame = { x: 540, y: diyaTop + DIYA.flame };
  const into = prog(f, DIYA_AT, ABSORB);
  const tip = { x: cp.x + (flame.x - cp.x) * into, y: cp.y + (flame.y - cp.y) * into };
  const beamOn = prog(f, BEAMS_AT, BEAMS_AT + 5);
  const beamW = (34 + 8 * Math.sin(f / 1.3)) * beamOn * (1 - prog(f, ABSORB - 6, ABSORB));
  const mTip = { x: MARS.x + (tip.x - MARS.x) * beamOn, y: MARS.y + (tip.y - MARS.y) * beamOn };
  const sTip = { x: SAT.x + (tip.x - SAT.x) * beamOn, y: SAT.y + (tip.y - SAT.y) * beamOn };

  const vs = pop(f, fps, 3, 9);
  const vsOut = prog(f, BEAMS_AT, BEAMS_AT + 6, easeIn);
  const label = (at: number) => Math.min(1, pop(f, fps, at, 12));

  const chart = prog(f, ABSORB + 2, ABSORB + 26, easeOut);
  const diyaScale = (f < DIYA_AT ? 1 : 1 + 0.25 * Math.exp(-(f - DIYA_AT) / 5)) * (1 - 0.3 * chart);
  const planets = prog(f, ABSORB + 12, 118);
  const read = pop(f, fps, ABSORB + 9, 12);
  const chip = pop(f, fps, ABSORB + 18, 12);

  return (
    <AbsoluteFill style={{ background: "#0C0A07", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${sx.toFixed(2)}px, ${sy.toFixed(2)}px)` }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <defs>
            <radialGradient id="s3mars" cx={MARS.x} cy={MARS.y} r="1100" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#FF7A3A" />
              <stop offset="0.35" stopColor="#C42A16" />
              <stop offset="1" stopColor="#2C0505" />
            </radialGradient>
            <radialGradient id="s3sat" cx={SAT.x} cy={SAT.y} r="1100" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#5E8EFF" />
              <stop offset="0.35" stopColor="#1E3AA6" />
              <stop offset="1" stopColor="#050A2A" />
            </radialGradient>
            <pattern id="s3dots" width="18" height="18" patternUnits="userSpaceOnUse">
              <circle cx="9" cy="9" r="2.8" fill="#FFFFFF" opacity="0.16" />
            </pattern>
          </defs>
          {/* the two halves slide in from opposite corners */}
          <g transform={`translate(${(-380 * (1 - slide)).toFixed(1)} ${(-380 * (1 - slide)).toFixed(1)})`}>
            <path d={`M-400 -400H1480V${SEAM.y2 - 40}L${SEAM.x2} ${SEAM.y2}L${SEAM.x1} ${SEAM.y1}L-400 ${SEAM.y1 + 60}Z`} fill="url(#s3mars)" />
            <path d={`M-400 -400H1480V${SEAM.y2 - 40}L${SEAM.x2} ${SEAM.y2}L${SEAM.x1} ${SEAM.y1}L-400 ${SEAM.y1 + 60}Z`} fill="url(#s3dots)" />
          </g>
          <g transform={`translate(${(380 * (1 - slide)).toFixed(1)} ${(380 * (1 - slide)).toFixed(1)})`}>
            <path d={`M-400 2400H1480V${SEAM.y2 - 40}L${SEAM.x2} ${SEAM.y2}L${SEAM.x1} ${SEAM.y1}L-400 ${SEAM.y1 + 60}Z`} fill="url(#s3sat)" />
            <path d={`M-400 2400H1480V${SEAM.y2 - 40}L${SEAM.x2} ${SEAM.y2}L${SEAM.x1} ${SEAM.y1}L-400 ${SEAM.y1 + 60}Z`} fill="url(#s3dots)" />
          </g>
          {slide > 0.95 ? (
            <path d={lightningPath(f, SEAM.x1, SEAM.y1, SEAM.x2, SEAM.y2, 26, "seam")} fill="none" stroke="#FFF2C6" strokeWidth={7} style={{ filter: "drop-shadow(0 0 10px #FFD45A)" }} />
          ) : null}
          <g transform={`translate(${(-380 * (1 - slide)).toFixed(1)} ${(-380 * (1 - slide)).toFixed(1)})`}>
            <Mars x={MARS.x} y={MARS.y} r={MARS.r * (1 + 0.03 * Math.sin(f / 2))} id="s3m" glow={1 + 0.4 * beamOn} />
          </g>
          <g transform={`translate(${(380 * (1 - slide)).toFixed(1)} ${(380 * (1 - slide)).toFixed(1)})`}>
            <Saturn x={SAT.x} y={SAT.y} r={SAT.r * (1 + 0.03 * Math.sin(f / 2 + 1))} id="s3s" glow={1 + 0.4 * beamOn} />
          </g>
          {beamW > 0.5 ? (
            <>
              <Beam x1={MARS.x} y1={MARS.y} x2={mTip.x} y2={mTip.y} color="#FF6A2E" core="#FFF0D8" w={beamW} />
              <Beam x1={SAT.x} y1={SAT.y} x2={sTip.x} y2={sTip.y} color="#4F8BFF" core="#EAF2FF" w={beamW} />
            </>
          ) : null}
          {fight && f >= BEAMS_AT + 4 && f < DIYA_AT ? (
            <g>
              {[0, 1, 2, 3].map((i) => {
                const a = random(`arc-${Math.floor(f / 2)}-${i}`) * Math.PI * 2;
                const rr = 150 + random(`arr-${Math.floor(f / 2)}-${i}`) * 140;
                return (
                  <path
                    key={i}
                    d={lightningPath(f + i, cp.x, cp.y, cp.x + Math.cos(a) * rr, cp.y + Math.sin(a) * rr, 30, `a${i}`)}
                    fill="none"
                    stroke={i % 2 ? "#BFD4FF" : "#FFD9B0"}
                    strokeWidth={5}
                    strokeLinejoin="round"
                  />
                );
              })}
              <circle cx={cp.x} cy={cp.y} r={92 + 16 * Math.sin(f / 1.4)} fill="#FFFFFF" opacity={0.25} />
              <circle cx={cp.x} cy={cp.y} r={58 + 10 * Math.sin(f / 1.1)} fill="#FFF7E2" />
            </g>
          ) : null}
        </svg>
        {f >= BEAMS_AT && f < DIYA_AT ? (
          <>
            <Sparks f={f} at={BEAMS_AT + 4 + 8 * Math.floor((f - BEAMS_AT - 4) / 8)} x={cp.x} y={cp.y} count={30} seed="s3k" power={0.9} dur={14} />
            {[0, 1, 2, 3, 4].map((i) => (
              <Shockwave key={i} f={f} at={BEAMS_AT + 4 + i * 10} x={cp.x} y={cp.y} size={0.55} color="#FFE0B0" dur={12} />
            ))}
          </>
        ) : null}
        {f < 10 ? <SpeedLines f={f} angle={-24} count={40} opacity={0.6 * (1 - f / 10)} speed={140} seed="s3sl" /> : null}

        {/* labels */}
        <div style={{ position: "absolute", right: 96, top: 318, textAlign: "right", opacity: label(4) * (1 - calm), transform: `translateX(${(1 - label(4)) * 160}px) rotate(-4deg)` }}>
          <TitleText text="MANGAL" size={104} fill="#FF7A45" stroke="#2A0604" strokeW={16} shadow="#7A1206" />
          <div style={{ fontFamily: `${DEVA}, ${SANS}`, fontWeight: 700, fontSize: 40, color: "#FFE2CF", marginTop: 6, textShadow: "0 3px 10px rgba(0,0,0,0.6)" }}>मंगल · MARS</div>
        </div>
        <div style={{ position: "absolute", left: 92, top: 1268, opacity: label(7) * (1 - calm), transform: `translateX(${(label(7) - 1) * 160}px) rotate(-4deg)` }}>
          <TitleText text="SHANI" size={104} fill="#7FA6FF" stroke="#03082A" strokeW={16} shadow="#14247A" />
          <div style={{ fontFamily: `${DEVA}, ${SANS}`, fontWeight: 700, fontSize: 40, color: "#DCE7FF", marginTop: 6, textShadow: "0 3px 10px rgba(0,0,0,0.6)" }}>शनि · SATURN</div>
        </div>
        {f >= 3 && vsOut < 1 ? (
          <div
            style={{
              position: "absolute",
              left: 540,
              top: 935,
              transform: `translate(-50%, -50%) scale(${(0.6 + 2.2 * Math.max(0, 1 - vs) + 0.4 * Math.min(1, vs)) * (1 + 0.6 * vsOut)}) rotate(-8deg)`,
              opacity: 1 - vsOut,
            }}
          >
            <TitleText text="VS" size={230} fill="#FFD45A" stroke="#1A0A02" strokeW={22} shadow="#000000" />
          </div>
        ) : null}

        {/* the diya drops into the clash */}
        {f >= DIYA_AT - 5 ? (
          <>
            {f < DIYA_AT ? <SpeedLines f={f} angle={90} count={36} opacity={0.75} speed={160} seed="drop" thickness={1.4} /> : null}
            <div
              style={{
                position: "absolute",
                left: DIYA.left,
                top: diyaTop,
                width: DIYA.w,
                height: DIYA.h,
                transform: `scale(${diyaScale})`,
                transformOrigin: "50% 85%",
                filter: `drop-shadow(0 0 ${30 + 40 * into}px rgba(255,200,90,${0.5 + 0.4 * into}))`,
              }}
            >
              <Img src={staticFile("jyotiq/logo-icon.png")} style={{ width: DIYA.w, height: DIYA.h }} />
            </div>
          </>
        ) : null}
      </AbsoluteFill>

      {/* after the absorb: warm calm, kundali around the diya */}
      {calm > 0 ? (
        <AbsoluteFill style={{ opacity: calm }}>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse 620px 760px at 50% 48%, #3A2A10 0%, #120D06 55%, #0A0805 100%)" }} />
          <div style={{ position: "absolute", left: 540 - 330, top: DIYA_CY - 330, transform: `scale(${0.9 + 0.1 * chart}) rotate(${(1 - chart) * -12}deg)` }}>
            <Kundali size={660} draw={chart} planets={planets} f={f} />
          </div>
          <div
            style={{
              position: "absolute",
              left: DIYA.left,
              top: DIYA.top,
              width: DIYA.w,
              height: DIYA.h,
              transform: `scale(${diyaScale})`,
              transformOrigin: "50% 85%",
              filter: "drop-shadow(0 0 40px rgba(255,200,90,0.7))",
            }}
          >
            <Img src={staticFile("jyotiq/logo-icon.png")} style={{ width: DIYA.w, height: DIYA.h }} />
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 300,
              textAlign: "center",
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 88,
              lineHeight: 1.08,
              letterSpacing: -1,
              color: "#F5ECDD",
              opacity: Math.min(1, read * 1.4),
              transform: `translateY(${(1 - Math.min(1, read)) * 26}px)`,
              textShadow: "0 6px 26px rgba(0,0,0,0.7)",
            }}
          >
            Jyotiq reads
            <br />
            the <span style={{ color: "#DFB15B", fontStyle: "italic" }}>kundali.</span>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1296, display: "flex", justifyContent: "center", opacity: Math.min(1, chip * 1.4), transform: `scale(${0.8 + 0.2 * chip})` }}>
            <div style={{ padding: "16px 34px", borderRadius: 999, border: "2.5px solid #DFB15Baa", background: "rgba(223,177,91,0.12)", fontFamily: SANS, fontWeight: 700, fontSize: 40, color: "#F3DB9D" }}>
              ✦ Free AI Kundali
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      {f >= DIYA_AT && f < DIYA_AT + 3 ? <AbsoluteFill style={{ background: "#FFF8E6", opacity: f === DIYA_AT ? 0.7 : 0.3 }} /> : null}
      <Shockwave f={f} at={DIYA_AT} x={540} y={DIYA.top + DIYA.flame} size={1.1} />
      <Shockwave f={f} at={ABSORB} x={540} y={DIYA.top + DIYA.flame} size={1.5} color="#FFD45A" dur={20} />
      <Sparks f={f} at={ABSORB} x={540} y={DIYA.top + DIYA.flame} count={46} power={1.3} dur={26} seed="abs" />
      {f >= ABSORB && f < ABSORB + 10 ? <FocusLines f={f} color="#FFE7A8" opacity={0.55 * (1 - prog(f, ABSORB, ABSORB + 10))} rx={360} ry={420} cy={DIYA.top + DIYA.flame} /> : null}
    </AbsoluteFill>
  );
};
