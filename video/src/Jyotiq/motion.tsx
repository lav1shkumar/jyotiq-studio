import React, { useId } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SERIF, useTheme } from "./theme";

/* ------------------------------------------------------------------ */
/* Math                                                                */
/* ------------------------------------------------------------------ */

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.55, 0, 1, 0.45);

/** 0 -> 1 between frames a and b with easing, clamped. */
export const prog = (f: number, a: number, b: number, e = easeOut): number =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing: e });

/** Springy pop (overshoots ~8%) starting at `at`. */
export const usePop = (at: number, damping = 11, stiffness = 170): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, stiffness, mass: 0.7 } });
};

/** Non-overshooting settle starting at `at`. */
export const useSettle = (at: number, durationInFrames = 18): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, durationInFrames, config: { damping: 200 } });
};

export const pop = (frame: number, fps: number, at: number, damping = 11): number =>
  spring({ frame: frame - at, fps, config: { damping, stiffness: 170, mass: 0.7 } });

/* ------------------------------------------------------------------ */
/* Directional motion blur (SVG gaussian with separate x / y sigma)    */
/* ------------------------------------------------------------------ */

export const DirBlur: React.FC<{
  x?: number;
  y?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ x = 0, y = 0, style, children }) => {
  const id = "db" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const on = x > 0.3 || y > 0.3;
  return (
    <>
      {on ? (
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
          <defs>
            <filter id={id} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation={`${x.toFixed(2)} ${y.toFixed(2)}`} />
            </filter>
          </defs>
        </svg>
      ) : null}
      <div style={{ ...style, filter: on ? `url(#${id})` : style?.filter }}>{children}</div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Backdrop: warm black with a soft diya glow, slow star dust          */
/* ------------------------------------------------------------------ */

export const Backdrop: React.FC<{ glowY?: number; glowScale?: number }> = ({
  glowY = 52,
  glowScale = 1,
}) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const dots = new Array(70).fill(0).map((_, i) => {
    const x = random(`dx${i}`) * 100;
    const y = random(`dy${i}`) * 100;
    const s = 1 + random(`ds${i}`) * 2.2;
    const tw = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(frame / (9 + random(`dt${i}`) * 14) + i));
    return { x, y, s, o: tw * (t.dark ? 0.5 : 0.35) * (0.4 + random(`do${i}`) * 0.6) };
  });
  return (
    <AbsoluteFill style={{ background: t.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse ${58 * glowScale}% ${64 * glowScale}% at 50% ${glowY}%, ${t.glow}, transparent 72%)`,
        }}
      />
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.s,
            height: d.s,
            borderRadius: "50%",
            background: t.dust,
            opacity: d.o,
          }}
        />
      ))}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 80% at 50% 50%, transparent 55%, ${t.vignette} 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Kinetic type: word-by-word build, the line re-centres smoothly      */
/* ------------------------------------------------------------------ */

export type Word = { t: string; at: number; color?: string; italic?: boolean };

export const Words: React.FC<{
  words: Word[];
  size: number;
  font?: string;
  weight?: number;
  gap?: number;
  color?: string;
  style?: React.CSSProperties;
  letterSpacing?: number;
}> = ({ words, size, font = SERIF, weight = 700, gap, color, style, letterSpacing = -1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();
  const g = gap ?? size * 0.26;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "baseline",
        whiteSpace: "nowrap",
        fontFamily: font,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.15,
        letterSpacing,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const p = pop(frame, fps, w.at, 12);
        const shown = frame >= w.at;
        const open = Math.min(1, p * 1.35);
        return (
          <span
            key={`${w.t}-${i}`}
            style={{
              display: "inline-block",
              maxWidth: shown ? (open >= 1 ? "none" : open * size * 9) : 0,
              overflowX: "clip",
              overflowY: "visible",
              marginLeft: i > 0 ? g * Math.min(1, open) : 0,
              verticalAlign: "baseline",
            }}
          >
            <span
              style={{
                display: "inline-block",
                color: w.color ?? color ?? t.text,
                fontStyle: w.italic ? "italic" : "normal",
                opacity: shown ? Math.min(1, p * 1.6) : 0,
                transform: `translateY(${(1 - Math.min(p, 1)) * size * 0.22}px) scale(${0.72 + 0.28 * p})`,
                transformOrigin: "50% 80%",
              }}
            >
              {w.t}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Hand cursor (white glove, accent outline) with click ripple         */
/* ------------------------------------------------------------------ */

export const Hand: React.FC<{
  x: number;
  y: number;
  press?: number; // 0..1, 1 = fully pressed
  ripple?: number; // 0..1 progress of the click ripple
  opacity?: number;
  size?: number;
}> = ({ x, y, press = 0, ripple = 0, opacity = 1, size = 64 }) => {
  const t = useTheme();
  // Fingertip sits at (14, 2) in the 40 x 46 viewBox.
  const k = size / 40;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 14 * k,
        top: y - 2 * k,
        width: size,
        height: size * 1.15,
        opacity,
        pointerEvents: "none",
      }}
    >
      {ripple > 0 && ripple < 1 ? (
        <div
          style={{
            position: "absolute",
            left: 14 * k - 40 * ripple * 1.6,
            top: 2 * k - 40 * ripple * 1.6,
            width: 80 * ripple * 1.6,
            height: 80 * ripple * 1.6,
            borderRadius: "50%",
            border: `3px solid ${t.goldSoft}`,
            opacity: 1 - ripple,
          }}
        />
      ) : null}
      <svg
        viewBox="0 0 40 46"
        width={size}
        height={size * 1.15}
        style={{
          transform: `scale(${1 - 0.12 * press})`,
          transformOrigin: "35% 5%",
          filter: `drop-shadow(0 8px 14px ${t.shadow})`,
          overflow: "visible",
        }}
      >
        <path
          d="M11 4.5c0-2 1.4-3.5 3.2-3.5s3.2 1.5 3.2 3.5V18l.6-.1v-3.3c0-1.9 1.4-3.3 3.1-3.3s3.1 1.4 3.1 3.3v4l.6-.1v-2.4c0-1.8 1.4-3.2 3-3.2s3 1.4 3 3.2v3.3l.5-.1c.2-1.6 1.4-2.7 2.8-2.7 1.6 0 2.9 1.3 2.9 3V30c0 7.7-5.9 14-13.4 14h-2.3c-4.1 0-7.9-1.9-10.5-5.2L1.9 28.1c-1.2-1.5-1-3.7.5-4.9 1.4-1.1 3.4-1 4.6.2L11 27.6V4.5z"
          fill="#FFFFFF"
          stroke={t.gold}
          strokeWidth={2.2}
          strokeLinejoin="round"
        />
        <path d="M17.4 18v8.2M23.8 18.4v7.8M29.9 19.2v7" stroke={t.gold} strokeWidth={1.6} strokeLinecap="round" opacity={0.55} />
      </svg>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Stars                                                               */
/* ------------------------------------------------------------------ */

/** Rounded 5-point star, like the one on JYOTIQ's Q. */
export const Star5: React.FC<{ size: number; color: string; glow?: number; style?: React.CSSProperties }> = ({
  size,
  color,
  glow = 0.6,
  style,
}) => (
  <svg viewBox="-50 -50 100 100" width={size} height={size} style={{ overflow: "visible", ...style }}>
    <defs>
      <radialGradient id={`s5g${color.replace("#", "")}`} cx="40%" cy="35%" r="70%">
        <stop offset="0%" stopColor="#FFF4C9" />
        <stop offset="55%" stopColor={color} />
        <stop offset="100%" stopColor={color} />
      </radialGradient>
    </defs>
    <path
      d="M0,-46 L12.5,-15.5 L44,-14.2 L19.6,6.6 L27.6,38.8 L0,20.6 L-27.6,38.8 L-19.6,6.6 L-44,-14.2 L-12.5,-15.5 Z"
      fill={`url(#s5g${color.replace("#", "")})`}
      stroke={color}
      strokeWidth={5}
      strokeLinejoin="round"
      style={{ filter: glow > 0 ? `drop-shadow(0 0 ${14 * glow}px ${color})` : undefined }}
    />
  </svg>
);

/** 4-point glint used for twinkles. */
export const Glint: React.FC<{ size: number; color: string; style?: React.CSSProperties }> = ({ size, color, style }) => (
  <svg viewBox="-50 -50 100 100" width={size} height={size} style={{ overflow: "visible", ...style }}>
    <path
      d="M0,-50 C6,-12 12,-6 50,0 C12,6 6,12 0,50 C-6,12 -12,6 -50,0 C-12,-6 -6,-12 0,-50 Z"
      fill={color}
      style={{ filter: `drop-shadow(0 0 10px ${color})` }}
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Confetti: gold flakes, marigold petals and sparkles, 3D flips       */
/* ------------------------------------------------------------------ */

export const Confetti: React.FC<{ start: number; x: number; y: number; count?: number }> = ({
  start,
  x,
  y,
  count = 90,
}) => {
  const frame = useCurrentFrame();
  const t = useTheme();
  const age = frame - start;
  if (age < 0) return null;
  const golds = [t.gold, t.goldSoft, t.ribbon[1], t.ctaTo, t.star];
  const marigold = ["#F28C28", "#FFB627", "#E8651A"];
  return (
    <AbsoluteFill style={{ perspective: 900, pointerEvents: "none" }}>
      {new Array(count).fill(0).map((_, i) => {
        const r = (k: string) => random(`cf-${k}-${i}`);
        const ang = -Math.PI / 2 + (r("a") - 0.5) * Math.PI * 1.25;
        const speed = 16 + r("s") * 30;
        const drag = Math.exp(-age / 26);
        const dist = (speed * 26 * (1 - drag)) / 1;
        const px = x + Math.cos(ang) * dist + (r("w") - 0.5) * age * 2.2;
        const py = y + Math.sin(ang) * dist + 0.09 * age * age;
        const kind = r("k");
        const isPetal = kind > 0.62 && kind <= 0.88;
        const isSpark = kind > 0.88;
        const w = isSpark ? 22 : isPetal ? 20 : 12 + r("sz") * 10;
        const h = isSpark ? 22 : isPetal ? 30 : 22 + r("sz2") * 16;
        const color = isPetal ? marigold[Math.floor(r("c") * 3)] : golds[Math.floor(r("c") * golds.length)];
        const fade = interpolate(age, [24 + r("f") * 16, 46 + r("f") * 10], [1, 0], clamp);
        const rx = age * (8 + r("rx") * 14);
        const ry = age * (6 + r("ry") * 12);
        const rz = r("rz") * 360 + age * (r("dz") - 0.5) * 18;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px - w / 2,
              top: py - h / 2,
              width: w,
              height: h,
              opacity: fade,
              transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
              background: isSpark
                ? "transparent"
                : isPetal
                  ? `radial-gradient(ellipse at 40% 30%, #FFE08A, ${color} 70%)`
                  : `linear-gradient(135deg, ${color}, ${t.ribbon[0]})`,
              borderRadius: isPetal ? "50% 50% 50% 50% / 60% 60% 40% 40%" : 3,
            }}
          >
            {isSpark ? <Glint size={w} color={t.goldSoft} /> : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Typing helper                                                       */
/* ------------------------------------------------------------------ */

export const typed = (text: string, frame: number, start: number, charsPerFrame: number): string => {
  const n = Math.max(0, Math.min(text.length, Math.floor((frame - start) * charsPerFrame)));
  return text.slice(0, n);
};

export const Caret: React.FC<{ height: number; color: string; style?: React.CSSProperties }> = ({
  height,
  color,
  style,
}) => {
  const frame = useCurrentFrame();
  const on = Math.floor(frame / 8) % 2 === 0;
  return (
    <span
      style={{
        display: "inline-block",
        width: Math.max(3, height * 0.06),
        height,
        background: color,
        borderRadius: 2,
        opacity: on ? 1 : 0,
        verticalAlign: "middle",
        ...style,
      }}
    />
  );
};
