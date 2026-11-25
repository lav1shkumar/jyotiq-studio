import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, clamp, FADE, FONT, GRADIENT } from "./theme";

/* ------------------------------------------------------------------ */
/* Motion helpers                                                      */
/* ------------------------------------------------------------------ */

/** Smooth, no-overshoot entrance progress 0 -> 1 starting at `delay`. */
export const useEnter = (delay: number, durationInFrames = 18): number => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    durationInFrames,
    config: { damping: 200 },
  });
};

/** Scene wrapper: cross-fades in/out over FADE frames. */
export const SceneFrame: React.FC<{
  durationInFrames: number;
  fadeIn: boolean;
  fadeOut: boolean;
  children: React.ReactNode;
}> = ({ durationInFrames, fadeIn, fadeOut, children }) => {
  const frame = useCurrentFrame();
  const inOpacity = fadeIn ? interpolate(frame, [0, FADE], [0, 1], clamp) : 1;
  const outOpacity = fadeOut
    ? interpolate(frame, [durationInFrames - FADE, durationInFrames], [1, 0], clamp)
    : 1;
  return (
    <AbsoluteFill style={{ opacity: Math.min(inOpacity, outOpacity), fontFamily: FONT }}>
      {children}
    </AbsoluteFill>
  );
};

/** Slow 1.00 -> 1.04 camera push-in across the scene. Captions stay outside it. */
export const PushIn: React.FC<{ durationInFrames: number; children: React.ReactNode }> = ({
  durationInFrames,
  children,
}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.04], clamp);
  return <AbsoluteFill style={{ transform: `scale(${scale})` }}>{children}</AbsoluteFill>;
};

/* ------------------------------------------------------------------ */
/* Surfaces                                                            */
/* ------------------------------------------------------------------ */

export const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({
  style,
  children,
}) => (
  <div
    style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Browser-window frame. Neutral address bar: no URL text at all. */
export const AppWindow: React.FC<{
  width: number;
  height: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ width, height, style, children }) => (
  <div
    style={{
      width,
      height,
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 20,
      overflow: "hidden",
      boxShadow: "0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(99,102,241,0.08)",
      display: "flex",
      flexDirection: "column",
      ...style,
    }}
  >
    <div
      style={{
        height: 54,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 22px",
        borderBottom: `1px solid ${C.border}`,
        background: C.surface2,
      }}
    >
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
        <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />
      ))}
      <div
        style={{
          marginLeft: 18,
          flex: 1,
          height: 28,
          borderRadius: 14,
          background: C.bg,
          border: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          gap: 8,
        }}
      >
        <div style={{ width: 120, height: 8, borderRadius: 4, background: C.border }} />
        <div style={{ width: 60, height: 8, borderRadius: 4, background: C.border }} />
      </div>
    </div>
    <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>{children}</div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Data display                                                        */
/* ------------------------------------------------------------------ */

/** Number that counts from 0 to `to` between frames `from` and `until`. */
export const Counter: React.FC<{
  to: number;
  from: number;
  until: number;
  style?: React.CSSProperties;
}> = ({ to, from, until, style }) => {
  const frame = useCurrentFrame();
  const value = interpolate(frame, [from, until], [0, to], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {Math.round(value).toLocaleString("en-US")}
    </span>
  );
};

export const ScoreBar: React.FC<{
  label: string;
  valueText: string;
  fraction: number;
  color: string;
  appearAt: number;
  height?: number;
}> = ({ label, valueText, fraction, color, appearAt, height = 12 }) => {
  const p = useEnter(appearAt, 24);
  return (
    <div style={{ opacity: interpolate(p, [0, 0.3], [0, 1], clamp) }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
          fontSize: 24,
          color: C.muted,
          fontWeight: 500,
        }}
      >
        <span>{label}</span>
        <span style={{ color, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
          {valueText}
        </span>
      </div>
      <div style={{ height, borderRadius: height, background: C.bg, border: `1px solid ${C.border}` }}>
        <div
          style={{
            height: "100%",
            width: `${Math.max(fraction * p * 100, fraction === 0 ? 0 : 2)}%`,
            borderRadius: height,
            background: color,
            boxShadow: `0 0 16px ${color}66`,
          }}
        />
      </div>
    </div>
  );
};

export const FunnelBar: React.FC<{
  label: string;
  value: number;
  widthPct: number;
  color: string;
  appearAt: number;
}> = ({ label, value, widthPct, color, appearAt }) => {
  const p = useEnter(appearAt, 22);
  return (
    <div
      style={{
        position: "relative",
        width: `${widthPct}%`,
        minWidth: 190,
        height: 88,
        opacity: interpolate(p, [0, 0.25], [0, 1], clamp),
        transform: `translateY(${interpolate(p, [0, 1], [18, 0])}px)`,
      }}
    >
      {/* The bar grows via scaleX behind the label, so the label never gets clipped. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 14,
          background: `linear-gradient(90deg, ${color}33, ${color}14)`,
          border: `1px solid ${color}66`,
          transform: `scaleX(${interpolate(p, [0, 1], [0.35, 1])})`,
          transformOrigin: "left center",
        }}
      />
      <div
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 26px",
          gap: 18,
          whiteSpace: "nowrap",
          opacity: interpolate(p, [0.2, 0.7], [0, 1], clamp),
        }}
      >
        <span
          style={{
            fontSize: 46,
            fontWeight: 800,
            color,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </span>
        <span style={{ fontSize: 26, color: C.text, fontWeight: 500 }}>{label}</span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Overlays                                                            */
/* ------------------------------------------------------------------ */

/** Burned-in caption: max 2 explicit lines, bottom third, >= 80px from edges. */
export const Caption: React.FC<{ lines: [string] | [string, string]; from: number; to: number }> = ({
  lines,
  from,
  to,
}) => {
  const frame = useCurrentFrame();
  const p = useEnter(from, 14);
  const out = interpolate(frame, [to - 8, to], [1, 0], clamp);
  if (frame < from || frame >= to) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        bottom: 110,
        display: "flex",
        justifyContent: "center",
        opacity: Math.min(p, out),
        transform: `translateY(${interpolate(p, [0, 1], [16, 0])}px)`,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          background: "rgba(11,13,18,0.82)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 26,
          padding: "22px 38px",
          boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
          textAlign: "center",
        }}
      >
        {lines.map((line) => (
          <div
            key={line}
            style={{
              fontSize: 48,
              lineHeight: 1.22,
              fontWeight: 700,
              color: "#FFFFFF",
              whiteSpace: "nowrap",
              letterSpacing: -0.5,
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

export const Toast: React.FC<{ text: string; appearAt: number; style?: React.CSSProperties }> = ({
  text,
  appearAt,
  style,
}) => {
  const p = useEnter(appearAt, 16);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 16,
        padding: "20px 30px",
        borderRadius: 18,
        background: C.surface2,
        border: `1px solid ${C.success}88`,
        boxShadow: `0 18px 50px rgba(0,0,0,0.5), 0 0 30px ${C.success}33`,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [-24, 0])}px)`,
        ...style,
      }}
    >
      <CheckIcon size={34} color={C.success} />
      <span style={{ fontSize: 32, fontWeight: 700, color: C.text }}>{text}</span>
    </div>
  );
};

/** Human pointer with a small "You" tag, so it is never mistaken for the tool. */
export const Cursor: React.FC<{ x: number; y: number; pressed?: boolean }> = ({ x, y, pressed }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `scale(${pressed ? 0.88 : 1})`,
      transformOrigin: "top left",
      filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.6))",
    }}
  >
    <svg width="46" height="56" viewBox="0 0 46 56">
      <path
        d="M4 3 L4 44 L15 34 L23 52 L31 48 L23 31 L39 31 Z"
        fill="#FFFFFF"
        stroke="#0B0D12"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
    <div
      style={{
        position: "absolute",
        left: 38,
        top: 40,
        padding: "5px 14px",
        borderRadius: 12,
        background: GRADIENT,
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      You
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

export const CheckIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="11" fill={`${color}22`} stroke={color} strokeWidth="1.5" />
    <path d="M7 12.5 L10.5 16 L17 9" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const LockIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <rect x="4.5" y="10.5" width="15" height="10.5" rx="2.5" fill="none" stroke={color} strokeWidth="2" />
    <path d="M8 10.5 V7.5 A4 4 0 0 1 16 7.5 V10.5" fill="none" stroke={color} strokeWidth="2" />
    <circle cx="12" cy="15.7" r="1.6" fill={color} />
  </svg>
);

export const FlagIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M5 21 V4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M5 4 H17 L14.5 8 L17 12 H5" fill={`${color}33`} stroke={color} strokeWidth="2" strokeLinejoin="round" />
  </svg>
);
