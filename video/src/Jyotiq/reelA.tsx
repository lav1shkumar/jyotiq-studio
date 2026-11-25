import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamp, Confetti, DirBlur, easeIn, easeInOut, easeOut, Hand, lerp, pop, prog } from "./motion";
import { Lines, RCX, RCY, RH, RW } from "./reelKit";
import { SANS, SERIF, useTheme } from "./theme";
import { AppTile, FlameCard, LoginCard, ScreenCard } from "./ui";

/* 9:16 Reel, beats R1-R4. Same shot structure and cut points as the 16:9 film
   (scenesA.tsx); accents inside each beat sit on the measured beat grid
   (117.45 BPM, one beat = 15.33 frames, music.ts). Frame numbers are local. */

const center: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

/** Optical centre for copy: a little above the middle, clear of the caption area. */
const TY = 930;

/* ================================================================== */
/* R1  0.0 - 3.0 s   Hook: "Turn / confusion" -> "Into / clarity."      */
/* ================================================================== */

export const R1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();

  const exit = prog(f, 44, 54, easeIn);
  const l1op = 1 - prog(f, 49, 54, easeIn);

  const p2 = spring({ frame: f - 52, fps, config: { damping: 13, stiffness: 120, mass: 0.9 } });
  const s2 = interpolate(p2, [0, 1], [1.55, 1]);
  const op2 = prog(f, 52, 57);
  const blur2 = interpolate(f, [52, 61], [18, 0], clamp);
  const out = prog(f, 84, 90, easeIn);
  const sweep = interpolate(f, [62, 84], [120, -20], clamp);
  const flare = interpolate(f, [52, 60, 90], [0, 1, 0.55], clamp);

  return (
    <AbsoluteFill>
      {/* the lit element on frame 0: a warm diya flare behind the words */}
      <div
        style={{
          ...center,
          background: `radial-gradient(ellipse 560px 420px at 50% ${(TY / RH) * 100}%, ${t.gold}${t.dark ? "48" : "30"}, transparent 70%)`,
          opacity: f < 52 ? 0.62 : 0.62 + 0.38 * flare,
        }}
      />
      {f < 55 ? (
        <div style={{ ...center, top: TY - RCY, bottom: RCY - TY }}>
          <DirBlur x={exit * 70} style={{ transform: `translateX(${-exit * 1000}px)`, opacity: l1op }}>
            <Lines
              lines={[
                { size: 178, words: [{ t: "Turn", at: -6, color: t.gold }] },
                { size: 178, words: [{ t: "confusion", at: 15, color: t.muted }] },
              ]}
            />
          </DirBlur>
        </div>
      ) : null}
      {f >= 52 ? (
        <div style={{ ...center, top: TY - RCY, bottom: RCY - TY }}>
          <div
            style={{
              transform: `scale(${s2 * (1 - 0.04 * out)})`,
              opacity: op2 * (1 - out),
              filter: `blur(${blur2 + out * 14}px)`,
              fontFamily: SERIF,
              fontWeight: 700,
              letterSpacing: -2,
              whiteSpace: "nowrap",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              lineHeight: 1.02,
            }}
          >
            <span style={{ color: t.gold, fontSize: 150 }}>Into</span>
            <span
              style={{
                fontSize: 216,
                backgroundImage: `linear-gradient(100deg, ${t.gold} 0%, ${t.gold} 38%, ${t.goldSoft} 47%, #FFF8E2 50%, ${t.goldSoft} 53%, ${t.gold} 62%, ${t.gold} 100%)`,
                backgroundSize: "300% 100%",
                backgroundPosition: `${sweep}% 0`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                // background-clip:text only paints inside the padding box: pad it so the "y"
                // descender is not cut off, then pull the layout back up by the same amount.
                padding: "0 14px 56px",
                marginBottom: -56,
              }}
            >
              clarity.
            </span>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* R2  3.0 - 6.6 s   "On AstroRaaga" / [JYOTIQ tile] / "With Jyotiq"     */
/*                   tap Chat Now -> dive -> sign in -> +1 Flame        */
/* ================================================================== */

const TS = 1.45; // app tile scale
const TILE_L = RCX - 200 * TS;
const TILE_T = RCY - 180 * TS;
const BTN = { x: TILE_L + 200 * TS, y: TILE_T + 288 * TS }; // "Chat Now" centre

export const R2Entry: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();

  const split = prog(f, 17, 32, easeInOut);
  const sideOut = prog(f, 60, 70, easeIn);
  const tileP = pop(f, fps, 22, 10);
  const dive = prog(f, 64, 84, easeIn);

  // cursor comes up from the bottom-right and taps the right end of "Chat Now"
  const cm = prog(f, 36, 53, easeOut);
  const cx = lerp(1010, BTN.x + 78 * TS, cm);
  const cy = lerp(1980, BTN.y + 8 * TS, cm);
  const press = interpolate(f, [52, 55, 59], [0, 1, 0], clamp);
  const ripple = interpolate(f, [54, 68], [0, 1], clamp);

  const loginIn = prog(f, 70, 84);
  const flameCfg = { damping: 15, stiffness: 120, mass: 0.8 };
  const flame = spring({ frame: f - 82, fps, config: flameCfg });
  const flameVel = f >= 82 ? Math.abs(flame - spring({ frame: f - 83, fps, config: flameCfg })) : 0;

  return (
    <AbsoluteFill>
      {f < 72 ? (
        <>
          <div
            style={{
              position: "absolute",
              left: RCX,
              top: lerp(TY, 520, split),
              transform: "translate(-50%, -50%)",
              opacity: 1 - sideOut,
              filter: `blur(${sideOut * 10}px)`,
            }}
          >
            <Lines
              lines={[
                {
                  size: 104,
                  words: [
                    { t: "On", at: 2, color: t.gold },
                    { t: "AstroRaaga", at: 10, color: t.text },
                  ],
                },
              ]}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: RCX,
              top: 1395,
              transform: "translate(-50%, -50%)",
              opacity: 1 - sideOut,
              filter: `blur(${sideOut * 10}px)`,
            }}
          >
            <Lines
              lines={[
                {
                  size: 104,
                  words: [
                    { t: "With", at: 30, color: t.gold },
                    { t: "Jyotiq", at: 35, color: t.gold },
                  ],
                },
              ]}
            />
          </div>
        </>
      ) : null}

      {f >= 22 && f < 86 ? (
        <div
          style={{
            position: "absolute",
            left: TILE_L,
            top: TILE_T,
            width: 400 * TS,
            height: 360 * TS,
            transformOrigin: `${200 * TS}px ${288 * TS}px`,
            transform: `translateY(${(1 - Math.min(tileP, 1)) * 80}px) scale(${tileP * (1 + dive * 6)})`,
            opacity: 1 - prog(f, 74, 84),
            filter: `blur(${dive * 18}px)`,
          }}
        >
          <div style={{ transform: `scale(${TS})`, transformOrigin: "0 0" }}>
            <AppTile press={press} />
          </div>
        </div>
      ) : null}

      {f >= 70 ? (
        <div style={{ ...center, perspective: 1800 }}>
          <div
            style={{
              opacity: loginIn * (1 - 0.72 * prog(f, 84, 100)),
              transform: `rotateX(${lerp(26, 18, prog(f, 70, 108))}deg) rotateY(${lerp(-22, -14, prog(f, 70, 108))}deg) rotateZ(4deg) scale(${lerp(2.0, 1.5, prog(f, 70, 92))})`,
              filter: `blur(${(1 - loginIn) * 12 + prog(f, 84, 96) * 3}px)`,
            }}
          >
            <LoginCard />
          </div>
        </div>
      ) : null}

      {f >= 82 ? (
        <div style={{ ...center, top: -40, bottom: 40, perspective: 1600 }}>
          <DirBlur
            y={flameVel * 140}
            style={{
              transform: `translateY(${lerp(220, 0, flame)}px) rotateX(${lerp(40, 0, Math.min(flame, 1))}deg) scale(${lerp(0.5, 1.76, flame)})`,
              opacity: Math.min(1, flame * 2),
            }}
          >
            <FlameCard />
          </DirBlur>
        </div>
      ) : null}

      {f >= 36 && f < 74 ? <Hand x={cx} y={cy} press={press} ripple={ripple} opacity={1 - prog(f, 64, 72)} size={88} /> : null}
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* R3  6.6 - 10.6 s  "Just ask / Jyotiq." -> tall 3D tunnel of screens  */
/* ================================================================== */

type Wall = "left" | "right" | "top" | "bottom";
const IMGS = [
  "chat-love",
  "flame-credited",
  "astroraag-home",
  "chat-typed",
  "login",
  "align-coords",
  "chat-home",
  "opening-modal",
  "astroraag-apps",
];
const SIDE_ROWS = [-640, 0, 640];
const TUNNEL: { wall: Wall; z: number; y: number; src: string }[] = (() => {
  const out: { wall: Wall; z: number; y: number; src: string }[] = [];
  let n = 0;
  for (const z of [-900, -2300, -3700]) {
    SIDE_ROWS.forEach((y, r) => {
      out.push({ wall: "left", z: z - r * 160, y, src: IMGS[n++ % IMGS.length] });
      out.push({ wall: "right", z: z - (2 - r) * 160, y, src: IMGS[n++ % IMGS.length] });
    });
    out.push({ wall: "top", z, y: 0, src: IMGS[n++ % IMGS.length] });
    out.push({ wall: "bottom", z, y: 0, src: IMGS[n++ % IMGS.length] });
  }
  return out;
})();

const TunnelV: React.FC<{ f: number }> = ({ f }) => {
  const camZ = interpolate(f, [26, 104], [-200, 2300], { ...clamp, easing: Easing.bezier(0.42, 0, 0.3, 1) });
  const collapse = prog(f, 96, 116, easeIn);
  const k = 1 - 0.6 * collapse;
  const bw = RW * k;
  const bh = RH * k;
  return (
    <AbsoluteFill
      style={{ perspective: 1100, perspectiveOrigin: "50% 50%", opacity: prog(f, 26, 34) * (1 - prog(f, 106, 116)) }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 0,
          height: 0,
          transformStyle: "preserve-3d",
          transform: `translateZ(${camZ}px) rotateZ(${-16 * collapse}deg) rotateX(${22 * collapse}deg)`,
        }}
      >
        {TUNNEL.map((s, i) => {
          const zEff = s.z + camZ;
          if (zEff > 760 || zEff < -4700) return null;
          const fade = interpolate(zEff, [-4700, -3700, 300, 760], [0, 1, 1, 0], clamp);
          const side = s.wall === "left" || s.wall === "right";
          const SW = side ? 1150 : 1000;
          const SH = side ? 580 : 560;
          let tf = "";
          if (s.wall === "left") tf = `translate3d(${-bw / 2}px, ${s.y * k}px, ${s.z}px) rotateY(90deg)`;
          if (s.wall === "right") tf = `translate3d(${bw / 2}px, ${s.y * k}px, ${s.z}px) rotateY(-90deg)`;
          if (s.wall === "top") tf = `translate3d(0px, ${-bh / 2}px, ${s.z}px) rotateX(-90deg)`;
          if (s.wall === "bottom") tf = `translate3d(0px, ${bh / 2}px, ${s.z}px) rotateX(90deg)`;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: -SW / 2,
                top: -SH / 2,
                width: SW,
                height: SH,
                transform: tf,
                backfaceVisibility: "hidden",
                opacity: fade,
              }}
            >
              <ScreenCard src={s.src} w={SW} h={SH} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const R3Ask: React.FC = () => {
  const f = useCurrentFrame();
  const t = useTheme();
  const fly = prog(f, 24, 36, easeIn);
  const brand = interpolateColors(f, [10, 24], [t.faint, t.gold]);
  const swapOut = prog(f, 74, 80, easeIn);
  const finalOut = prog(f, 108, 118, easeIn);

  return (
    <AbsoluteFill>
      {f < 38 ? (
        <div style={{ ...center, top: TY - RCY, bottom: RCY - TY }}>
          <div style={{ transform: `scale(${1 + fly * 1.8})`, opacity: 1 - fly, filter: `blur(${fly * 16}px)` }}>
            <Lines
              lines={[
                {
                  size: 124,
                  words: [
                    { t: "Just", at: 0, color: t.text },
                    { t: "ask", at: 5, color: t.text },
                  ],
                },
                { size: 196, words: [{ t: "Jyotiq.", at: 10, color: brand }] },
              ]}
            />
          </div>
        </div>
      ) : null}

      {f >= 24 ? <TunnelV f={f} /> : null}

      {/* centre plate keeps the copy readable over the walls */}
      {f >= 30 ? (
        <div
          style={{
            ...center,
            background: `radial-gradient(ellipse 520px 440px at 50% ${(TY / RH) * 100}%, ${t.bg}f2, ${t.bg}00 100%)`,
            opacity: prog(f, 30, 38) * (1 - finalOut),
          }}
        />
      ) : null}
      {/* one word per beat: 36.7 / 52.1 / 67.4 (local) */}
      {f >= 33 && f < 80 ? (
        <div style={{ ...center, top: TY - RCY, bottom: RCY - TY }}>
          <div style={{ opacity: 1 - swapOut, filter: `blur(${swapOut * 14}px)` }}>
            <Lines
              lines={[
                { size: 120, words: [{ t: "Kundali.", at: 34, color: t.gold }] },
                { size: 120, words: [{ t: "Muhurat.", at: 49, color: t.gold }] },
                { size: 120, words: [{ t: "Remedies.", at: 64, color: t.gold }] },
              ]}
            />
          </div>
        </div>
      ) : null}
      {f >= 78 ? (
        <div style={{ ...center, top: TY - RCY, bottom: RCY - TY }}>
          <div style={{ opacity: 1 - finalOut, filter: `blur(${finalOut * 14}px)` }}>
            <Lines
              lines={[
                {
                  size: 104,
                  words: [
                    { t: "Your", at: 79, color: t.text },
                    { t: "AI", at: 79, color: t.text },
                  ],
                },
                {
                  size: 104,
                  words: [
                    { t: "Vedic", at: 82, color: t.gold },
                    { t: "astrologer.", at: 82, color: t.gold },
                  ],
                },
              ]}
            />
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* R4  10.6 - 15.5 s  ribbon -> 100/100 -> check circle, "Answered."    */
/* ================================================================== */

const BAR_Y = 1060;
const BAR_H = 84;
const X0 = -160;
const barEnd = (v: number) => 110 + 830 * (v / 100);
const CIRCLE_Y = 1010;
const CIRCLE_D = 460;

// 60 -> 78 -> 94 -> 99 -> 100, each step on a beat (local 24 / 39.3 / 54.6 / 70 / 85.3)
const counterAt = (f: number) =>
  interpolate(f, [26, 39, 54, 69, 84], [60, 78, 94, 99, 100], { ...clamp, easing: Easing.out(Easing.cubic) });

// The app's own loading lines, one per beat.
const STATUS: [number, string][] = [
  [26, "MAPPING MUHURAT WINDOWS"],
  [39, "ALIGNING HORA TIMINGS"],
  [54, "FETCHING PANCHANG ELEMENTS"],
  [69, "ALIGNING COSMIC VECTORS"],
];

export const R4Progress: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();

  const draw = prog(f, 0, 20, easeOut);
  const bend = interpolate(f, [0, 30], [-620, 0], { ...clamp, easing: easeOut });
  const v = counterAt(f);
  const dv = Math.abs(v - counterAt(f - 1));
  const xe = barEnd(v);
  const m = prog(f, 86, 104, easeInOut);
  const fadeAll = prog(f, 138, 147, easeIn);

  const path = `M ${X0} ${BAR_Y} C ${lerp(X0, xe, 0.33)} ${BAR_Y + bend}, ${lerp(X0, xe, 0.66)} ${BAR_Y - bend * 0.6}, ${xe} ${BAR_Y}`;

  const L = lerp(X0 - BAR_H / 2, RCX - CIRCLE_D / 2, m);
  const R = lerp(barEnd(100) + BAR_H / 2, RCX + CIRCLE_D / 2, m);
  const hh = lerp(BAR_H, CIRCLE_D, m);
  const cy = lerp(BAR_Y, CIRCLE_Y, m);

  const word = pop(f, fps, 98, 12);
  const check = prog(f, 103, 119, easeOut);
  const shownCount = Math.round(v);
  const uiOp = prog(f, 26, 34) * (1 - prog(f, 86, 92));

  return (
    <AbsoluteFill style={{ opacity: 1 - fadeAll, filter: `blur(${fadeAll * 10}px)` }}>
      {m <= 0 ? (
        <svg width={RW} height={RH} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <defs>
            <linearGradient id="rRibbonG" gradientUnits="userSpaceOnUse" x1={X0} y1={0} x2={xe} y2={0}>
              <stop offset="0%" stopColor={t.ribbon[1]} />
              <stop offset="30%" stopColor={t.ribbon[0]} />
              <stop offset="62%" stopColor={t.ribbon[2]} />
              <stop offset="100%" stopColor={t.ribbon[3]} />
            </linearGradient>
            <filter id="rRibbonShadow" x="-20%" y="-50%" width="140%" height="200%">
              <feGaussianBlur stdDeviation="18" />
            </filter>
          </defs>
          <path
            d={path}
            pathLength={1}
            fill="none"
            stroke={t.ctaTo}
            strokeOpacity={0.35}
            strokeWidth={BAR_H}
            strokeLinecap="round"
            strokeDasharray={`${draw} 2`}
            filter="url(#rRibbonShadow)"
            transform="translate(0 18)"
          />
          <path
            d={path}
            pathLength={1}
            fill="none"
            stroke="url(#rRibbonG)"
            strokeWidth={BAR_H}
            strokeLinecap="round"
            strokeDasharray={`${draw} 2`}
          />
        </svg>
      ) : (
        <div
          style={{
            position: "absolute",
            left: L,
            width: R - L,
            top: cy - hh / 2,
            height: hh,
            borderRadius: 999,
            overflow: "hidden",
            boxShadow: `0 ${lerp(16, 30, m)}px ${lerp(40, 90, m)}px ${t.ctaTo}${t.dark ? "44" : "33"}`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(90deg, ${t.ribbon[1]}, ${t.ribbon[0]} 30%, ${t.ribbon[2]} 62%, ${t.ribbon[3]})`,
              opacity: 1 - m,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 999,
              background: `radial-gradient(circle at 38% 30%, ${t.goldSoft}${t.dark ? "55" : "aa"}, ${t.gold}${t.dark ? "22" : "33"} 70%)`,
              border: `5px solid ${t.gold}`,
              opacity: m,
            }}
          />
        </div>
      )}

      {f >= 26 && f < 92 ? (
        <>
          {/* status line: a ticker that rolls the next loading line up on each beat */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 632, height: 56, overflow: "hidden", opacity: uiOp }}>
            {STATUS.map(([at, label], i) => {
              const next = STATUS[i + 1]?.[0] ?? 999;
              const inP = prog(f, at, at + 6, easeOut);
              const outP = prog(f, next, next + 6, easeInOut);
              if (f < at || outP >= 1) return null;
              return (
                <div
                  key={label}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 8,
                    textAlign: "center",
                    fontFamily: SANS,
                    fontWeight: 800,
                    fontSize: 30,
                    letterSpacing: 5,
                    color: t.muted,
                    opacity: i === 0 ? inP : 1,
                    transform: `translateY(${(i === 0 ? 0 : (1 - inP) * 56) - outP * 56}px)`,
                  }}
                >
                  {label}
                  {i === STATUS.length - 1 ? ".".repeat(1 + (Math.floor(f / 6) % 3)) : "..."}
                </div>
              );
            })}
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 700,
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 190,
              letterSpacing: -5,
              fontVariantNumeric: "tabular-nums",
              opacity: uiOp,
            }}
          >
            <DirBlur y={Math.min(18, dv * 5)}>
              <span style={{ color: t.gold }}>{shownCount}</span>
            </DirBlur>
            <span style={{ color: t.faint }}>/100</span>
          </div>
        </>
      ) : null}

      {f >= 98 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 560,
            textAlign: "center",
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 160,
            letterSpacing: -2,
            color: t.gold,
            transform: `translateY(${(1 - Math.min(word, 1)) * 44}px) scale(${0.75 + 0.25 * word})`,
            opacity: Math.min(1, word * 1.5),
          }}
        >
          Answered.
        </div>
      ) : null}
      {f >= 101 ? (
        <svg
          width={CIRCLE_D}
          height={CIRCLE_D}
          viewBox="0 0 400 400"
          style={{ position: "absolute", left: RCX - CIRCLE_D / 2, top: CIRCLE_Y - CIRCLE_D / 2 }}
        >
          <path
            d="M 118 206 L 178 264 L 288 146"
            fill="none"
            stroke={t.gold}
            strokeWidth={20}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={`${check} 2`}
          />
        </svg>
      ) : null}
      <Confetti start={101} x={RCX} y={CIRCLE_Y} count={110} />
    </AbsoluteFill>
  );
};
