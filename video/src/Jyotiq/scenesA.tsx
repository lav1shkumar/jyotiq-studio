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
import {
  clamp,
  Confetti,
  DirBlur,
  easeIn,
  easeInOut,
  easeOut,
  Hand,
  lerp,
  pop,
  prog,
  Words,
} from "./motion";
import { SANS, SERIF, useTheme } from "./theme";
import { AppTile, FlameCard, LoginCard, ScreenCard } from "./ui";

const center: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

/* ================================================================== */
/* B1  0.0 - 3.0 s   Hook: "Turn confusion" -> "Into clarity."         */
/* ================================================================== */

export const B1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();

  // Line 1 smears out to the left on the 1.77 s hit.
  const exit = prog(f, 44, 54, easeIn);
  const l1op = 1 - prog(f, 49, 54, easeIn);

  // Line 2 lands big and springs down to rest (2.26 s hit).
  const p2 = spring({ frame: f - 52, fps, config: { damping: 13, stiffness: 120, mass: 0.9 } });
  const s2 = interpolate(p2, [0, 1], [1.55, 1]);
  const op2 = prog(f, 52, 57);
  const blur2 = interpolate(f, [52, 61], [18, 0], clamp);
  const out = prog(f, 84, 90, easeIn);
  const sweep = interpolate(f, [62, 84], [120, -20], clamp);
  const flare = interpolate(f, [52, 60, 90], [0, 1, 0.55], clamp);

  return (
    <AbsoluteFill>
      {/* the lit element: a warm flare behind the words */}
      <div
        style={{
          ...center,
          background: `radial-gradient(ellipse 30% 24% at 50% 50%, ${t.gold}${t.dark ? "40" : "2e"}, transparent 70%)`,
          opacity: f < 52 ? 0.55 : 0.55 + 0.45 * flare,
        }}
      />
      {f < 55 ? (
        <div style={center}>
          <DirBlur
            x={exit * 70}
            style={{ transform: `translateX(${-exit * 1100}px)`, opacity: l1op }}
          >
            <Words
              size={112}
              words={[
                { t: "Turn", at: -4, color: t.gold },
                { t: "confusion", at: 16, color: t.muted },
              ]}
            />
          </DirBlur>
        </div>
      ) : null}
      {f >= 52 ? (
        <div style={center}>
          <div
            style={{
              transform: `scale(${s2 * (1 - 0.04 * out)})`,
              opacity: op2 * (1 - out),
              filter: `blur(${blur2 + out * 14}px)`,
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: 150,
              letterSpacing: -2,
              whiteSpace: "nowrap",
              display: "flex",
              gap: 38,
            }}
          >
            <span style={{ color: t.gold }}>Into</span>
            <span
              style={{
                backgroundImage: `linear-gradient(100deg, ${t.gold} 0%, ${t.gold} 38%, ${t.goldSoft} 47%, #FFF8E2 50%, ${t.goldSoft} 53%, ${t.gold} 62%, ${t.gold} 100%)`,
                backgroundSize: "300% 100%",
                backgroundPosition: `${sweep}% 0`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
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
/* B2  3.0 - 6.6 s   "On AstroRaaga [JYOTIQ tile] With Jyotiq"          */
/*                   cursor taps Chat Now -> dive -> login -> +1 Flame  */
/* ================================================================== */

export const B2Entry: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();

  const split = prog(f, 17, 32, easeInOut);
  const sideOut = prog(f, 60, 70, easeIn);
  const tileP = pop(f, fps, 24, 10);
  const dive = prog(f, 64, 84, easeIn);

  // Cursor: enters bottom-right, lands on the right end of "Chat Now" so the label stays readable.
  const btnX = 960;
  const btnY = 648;
  const cm = prog(f, 36, 54, easeOut);
  const cx = lerp(1540, btnX + 78, cm);
  const cy = lerp(1080, btnY + 8, cm);
  const press = interpolate(f, [54, 57, 61], [0, 1, 0], clamp);
  const ripple = interpolate(f, [56, 70], [0, 1], clamp);

  // Login card behind the dive, then the +1 Flame card flies out of it.
  const loginIn = prog(f, 70, 84);
  const flame = spring({ frame: f - 82, fps, config: { damping: 15, stiffness: 120, mass: 0.8 } });
  const flameVel = f >= 82 ? Math.abs(flame - spring({ frame: f - 83, fps, config: { damping: 15, stiffness: 120, mass: 0.8 } })) : 0;

  return (
    <AbsoluteFill>
      {/* side words */}
      {f < 72 ? (
        <>
          <div
            style={{
              position: "absolute",
              top: 540,
              left: lerp(960, 440, split),
              transform: "translate(-50%, -50%)",
              opacity: 1 - sideOut,
              filter: `blur(${sideOut * 10}px)`,
            }}
          >
            <Words
              size={84}
              words={[
                { t: "On", at: 2, color: t.gold },
                { t: "AstroRaaga", at: 10, color: t.text },
              ]}
            />
          </div>
          <div
            style={{
              position: "absolute",
              top: 540,
              left: 1475,
              transform: "translate(-50%, -50%)",
              opacity: 1 - sideOut,
              filter: `blur(${sideOut * 10}px)`,
            }}
          >
            <Words
              size={84}
              words={[
                { t: "With", at: 30, color: t.gold },
                { t: "Jyotiq", at: 36, color: t.gold },
              ]}
            />
          </div>
        </>
      ) : null}

      {/* JYOTIQ app tile */}
      {f >= 24 && f < 86 ? (
        <div
          style={{
            position: "absolute",
            left: 960 - 200,
            top: 540 - 180,
            width: 400,
            height: 360,
            transformOrigin: `200px 288px`,
            transform: `translateY(${(1 - Math.min(tileP, 1)) * 60}px) scale(${tileP * (1 + dive * 6)})`,
            opacity: 1 - prog(f, 74, 84),
            filter: `blur(${dive * 18}px)`,
          }}
        >
          <AppTile press={press} />
        </div>
      ) : null}

      {/* Login screen in 3D tilt */}
      {f >= 70 ? (
        <div style={{ ...center, perspective: 1600 }}>
          <div
            style={{
              opacity: loginIn * (1 - 0.45 * prog(f, 84, 96)),
              transform: `rotateX(${lerp(26, 18, prog(f, 70, 108))}deg) rotateY(${lerp(-22, -14, prog(f, 70, 108))}deg) rotateZ(4deg) scale(${lerp(1.3, 0.9, prog(f, 70, 92))})`,
              filter: `blur(${(1 - loginIn) * 12 + prog(f, 84, 96) * 3}px)`,
            }}
          >
            <LoginCard />
          </div>
        </div>
      ) : null}

      {/* +1 Flame card flies out and enlarges */}
      {f >= 82 ? (
        <div style={{ ...center, perspective: 1400 }}>
          <DirBlur
            y={flameVel * 120}
            style={{
              transform: `translateY(${lerp(140, 0, flame)}px) rotateX(${lerp(40, 0, Math.min(flame, 1))}deg) scale(${lerp(0.3, 1.02, flame)})`,
              opacity: Math.min(1, flame * 2),
            }}
          >
            <FlameCard />
          </DirBlur>
        </div>
      ) : null}

      {f >= 36 && f < 74 ? (
        <Hand x={cx} y={cy} press={press} ripple={ripple} opacity={1 - prog(f, 64, 72)} size={66} />
      ) : null}
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* B3  6.6 - 10.6 s  "Just ask Jyotiq." -> 3D tunnel of real screens    */
/* ================================================================== */

type Wall = "left" | "right" | "top" | "bottom";
const TUNNEL: { wall: Wall; z: number; src: string }[] = [
  { wall: "left", z: -900, src: "chat-home" },
  { wall: "right", z: -900, src: "flame-credited" },
  { wall: "top", z: -900, src: "astroraag-home" },
  { wall: "bottom", z: -900, src: "astroraag-apps" },
  { wall: "left", z: -2300, src: "login" },
  { wall: "right", z: -2300, src: "align-coords" },
  { wall: "top", z: -2300, src: "opening-modal" },
  { wall: "bottom", z: -2300, src: "chat-home" },
  { wall: "left", z: -3700, src: "flame-credited" },
  { wall: "right", z: -3700, src: "chat-home" },
  { wall: "top", z: -3700, src: "login" },
  { wall: "bottom", z: -3700, src: "align-coords" },
];

const Tunnel: React.FC<{ f: number }> = ({ f }) => {
  const camZ = interpolate(f, [26, 104], [-200, 2300], {
    ...clamp,
    easing: Easing.bezier(0.42, 0, 0.3, 1),
  });
  const collapse = prog(f, 98, 118, easeIn);
  const bw = 1820 * (1 - 0.6 * collapse);
  const bh = 1080 * (1 - 0.6 * collapse);
  const SW = 1150;
  const SH = 720;
  return (
    <AbsoluteFill style={{ perspective: 1100, perspectiveOrigin: "50% 50%", opacity: prog(f, 26, 34) * (1 - prog(f, 108, 118)) }}>
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
          if (zEff > 760 || zEff < -4600) return null;
          const fade = interpolate(zEff, [-4600, -3600, 300, 760], [0, 1, 1, 0], clamp);
          let tf = "";
          if (s.wall === "left") tf = `translate3d(${-bw / 2}px, 0px, ${s.z}px) rotateY(90deg)`;
          if (s.wall === "right") tf = `translate3d(${bw / 2}px, 0px, ${s.z}px) rotateY(-90deg)`;
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

export const B3Ask: React.FC = () => {
  const f = useCurrentFrame();
  const t = useTheme();
  const fly = prog(f, 24, 36, easeIn);
  const brand = interpolateColors(f, [10, 24], [t.faint, t.gold]);
  const swapOut = prog(f, 86, 92, easeIn);
  const finalOut = prog(f, 110, 118, easeIn);

  return (
    <AbsoluteFill>
      {f < 38 ? (
        <div style={center}>
          <div style={{ transform: `scale(${1 + fly * 1.8})`, opacity: 1 - fly, filter: `blur(${fly * 16}px)` }}>
            <Words
              size={112}
              words={[
                { t: "Just", at: 0, color: t.text },
                { t: "ask", at: 5, color: t.text },
                { t: "Jyotiq.", at: 10, color: brand },
              ]}
            />
          </div>
        </div>
      ) : null}

      {f >= 24 ? <Tunnel f={f} /> : null}

      {/* centre plate keeps the copy readable over the walls */}
      {f >= 30 ? (
        <div
          style={{
            ...center,
            background: `radial-gradient(ellipse 26% 16% at 50% 50%, ${t.bg}ee, ${t.bg}00 100%)`,
            opacity: prog(f, 30, 38) * (1 - finalOut),
          }}
        />
      ) : null}
      {f >= 34 && f < 92 ? (
        <div style={center}>
          <div style={{ opacity: 1 - swapOut, filter: `blur(${swapOut * 14}px)` }}>
            <Words
              size={68}
              words={[
                { t: "Kundali.", at: 36, color: t.gold },
                { t: "Muhurat.", at: 54, color: t.gold },
                { t: "Remedies.", at: 72, color: t.gold },
              ]}
            />
          </div>
        </div>
      ) : null}
      {f >= 90 ? (
        <div style={center}>
          <div style={{ opacity: 1 - finalOut, filter: `blur(${finalOut * 14}px)` }}>
            <Words
              size={68}
              words={[
                { t: "Your", at: 90, color: t.text },
                { t: "AI", at: 90, color: t.text },
                { t: "Vedic", at: 93, color: t.gold },
                { t: "astrologer.", at: 93, color: t.gold },
              ]}
            />
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* B4  10.6 - 15.5 s  ribbon -> progress 100/100 -> "Answered." + burst */
/* ================================================================== */

const BAR_Y = 600;
const BAR_H = 72;
const X0 = -140;
const barEnd = (v: number) => 260 + 1400 * (v / 100);

const counterAt = (f: number) =>
  interpolate(f, [30, 40, 55, 68, 80], [60, 78, 94, 99, 100], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

export const B4Progress: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();

  const draw = prog(f, 0, 20, easeOut);
  const bend = interpolate(f, [0, 30], [-430, 0], { ...clamp, easing: easeOut });
  const v = counterAt(f);
  const dv = Math.abs(v - counterAt(f - 1));
  const xe = barEnd(v);
  const m = prog(f, 84, 102, easeInOut);
  const fadeAll = prog(f, 138, 147, easeIn);

  const path = `M ${X0} ${BAR_Y} C ${lerp(X0, xe, 0.33)} ${BAR_Y + bend}, ${lerp(X0, xe, 0.66)} ${BAR_Y - bend * 0.6}, ${xe} ${BAR_Y}`;

  // Morph geometry (bar pill -> check circle)
  const L = lerp(X0 - BAR_H / 2, 960 - 200, m);
  const R = lerp(barEnd(100) + BAR_H / 2, 960 + 200, m);
  const hh = lerp(BAR_H, 400, m);
  const cy = lerp(BAR_Y, 610, m);

  const word = pop(f, fps, 96, 12);
  const check = prog(f, 102, 118, easeOut);
  const shownCount = Math.round(v);

  return (
    <AbsoluteFill style={{ opacity: 1 - fadeAll, filter: `blur(${fadeAll * 10}px)` }}>
      {m <= 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <defs>
            <linearGradient id="ribbonG" gradientUnits="userSpaceOnUse" x1={X0} y1={0} x2={xe} y2={0}>
              <stop offset="0%" stopColor={t.ribbon[1]} />
              <stop offset="30%" stopColor={t.ribbon[0]} />
              <stop offset="62%" stopColor={t.ribbon[2]} />
              <stop offset="100%" stopColor={t.ribbon[3]} />
            </linearGradient>
            <filter id="ribbonShadow" x="-20%" y="-50%" width="140%" height="200%">
              <feGaussianBlur stdDeviation="16" />
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
            filter="url(#ribbonShadow)"
            transform="translate(0 16)"
          />
          <path
            d={path}
            pathLength={1}
            fill="none"
            stroke="url(#ribbonG)"
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
            boxShadow: `0 ${lerp(16, 30, m)}px ${lerp(40, 80, m)}px ${t.ctaTo}${t.dark ? "44" : "33"}`,
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
              border: `4px solid ${t.gold}`,
              opacity: m,
            }}
          />
        </div>
      )}

      {/* label + counter */}
      {f >= 32 && f < 92 ? (
        <>
          <div
            style={{
              position: "absolute",
              left: 260,
              top: BAR_Y - 150,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 24,
              letterSpacing: 4,
              color: t.muted,
              opacity: prog(f, 32, 40) * (1 - prog(f, 84, 90)),
            }}
          >
            ALIGNING COSMIC VECTORS{".".repeat(1 + (Math.floor(f / 6) % 3))}
          </div>
          <div
            style={{
              position: "absolute",
              right: 1920 - (xe - 20),
              top: BAR_Y - 200,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 118,
              letterSpacing: -3,
              fontVariantNumeric: "tabular-nums",
              opacity: prog(f, 32, 38) * (1 - prog(f, 84, 90)),
              display: "flex",
              alignItems: "baseline",
            }}
          >
            <DirBlur y={Math.min(16, dv * 5)}>
              <span style={{ color: t.gold }}>{shownCount}</span>
            </DirBlur>
            <span style={{ color: t.faint }}>/100</span>
          </div>
        </>
      ) : null}

      {/* payoff */}
      {f >= 96 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 160,
            textAlign: "center",
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 124,
            letterSpacing: -2,
            color: t.gold,
            transform: `translateY(${(1 - Math.min(word, 1)) * 40}px) scale(${0.75 + 0.25 * word})`,
            opacity: Math.min(1, word * 1.5),
          }}
        >
          Answered.
        </div>
      ) : null}
      {f >= 100 ? (
        <svg width={400} height={400} viewBox="0 0 400 400" style={{ position: "absolute", left: 760, top: 410 }}>
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
      <Confetti start={101} x={960} y={560} count={96} />
    </AbsoluteFill>
  );
};
