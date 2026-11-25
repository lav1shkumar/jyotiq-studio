import React from "react";
import { AbsoluteFill, getStaticFiles, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, ease, easeInOut, easeSoft, FPS, GRAD, isV5, KARLA, MARCELLUS, prog, SERIF } from "./theme";

export const asset = (p: string) => staticFile(`astroraaga-pitch/${p}`);
/** v7 painted images (Astra, or free FLUX stand-ins until they arrive): uses `fallback` while `name` is missing. */
export const v7img = (name: string, fallback: string) => {
  const has = (n: string) => getStaticFiles().some((f) => f.name === `astroraaga-pitch/v7/img/${n}.jpg`);
  return asset(`v7/img/${has(name) ? name : has(fallback) ? fallback : "family"}.jpg`);
};
/** A painted image, softly masked into the paper. */
export const Painting: React.FC<{ src: string; w: number; h: number; style?: React.CSSProperties; radius?: number; zoom?: number }> = ({ src, w, h, style, radius = 28, zoom = 1 }) => (
  <div style={{ width: w, height: h, borderRadius: radius, overflow: "hidden", position: "relative", boxShadow: "0 30px 70px rgba(124,45,18,0.16)", border: `1.5px solid ${C.goldHair}`, ...style }}>
    <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }} />
  </div>
);

/** Global film time in seconds, also inside a Sequence (pass the sequence start). */
export const useT = (from = 0) => (useCurrentFrame() + from) / FPS;

/** Mount children only inside [a,b] seconds; children read global time via useWinT(). */
const WinCtx = React.createContext(0);
export const Win: React.FC<{ a: number; b: number; children: React.ReactNode; name?: string }> = ({ a, b, children, name }) => {
  const from = Math.round(a * FPS);
  return (
    <Sequence from={from} durationInFrames={Math.max(1, Math.round(b * FPS) - from)} name={name} layout="none">
      <WinCtx.Provider value={from}>{children}</WinCtx.Provider>
    </Sequence>
  );
};
/** A board on the mela map can freeze or shift time for everything inside it. */
const TimeCtx = React.createContext<number | null>(null);
export const AtTime: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => <TimeCtx.Provider value={t}>{children}</TimeCtx.Provider>;
export const useWinT = () => {
  const from = React.useContext(WinCtx);
  const fixed = React.useContext(TimeCtx);
  const f = useCurrentFrame();
  return fixed ?? (f + from) / FPS;
};

/** Scene envelope: soft focus-pull in and out at the window edges. */
export const Scene: React.FC<{
  a: number;
  b: number;
  inDur?: number;
  outDur?: number;
  bg?: string;
  noIn?: boolean;
  noOut?: boolean;
  children: React.ReactNode;
}> = ({ a, b, inDur = 0.45, outDur = 0.4, bg, noIn, noOut, children }) => {
  const t = useWinT();
  const pin = noIn ? 1 : prog(t, a, inDur);
  const pout = noOut ? 0 : interpolate(t, [b - outDur, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = pin * (1 - pout);
  const blur = (1 - pin) * 14 + pout * 10;
  const sc = 1 + (1 - pin) * 0.025 - pout * 0.02;
  return (
    <AbsoluteFill style={{ opacity: op, filter: blur > 0.3 ? `blur(${blur}px)` : undefined, transform: `scale(${sc})`, background: bg }}>
      {children}
    </AbsoluteFill>
  );
};

/** Element entrance (rise + unblur) at t0, optional exit at t1. */
export const In: React.FC<{
  t0: number;
  t1?: number;
  dur?: number;
  dy?: number;
  dx?: number;
  s0?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ t0, t1, dur = 0.7, dy = 26, dx = 0, s0 = 1, style, children }) => {
  const t = useWinT();
  // v5.1: every reveal is a soft zoom: it grows in from 90 % (slower, eased both ways) and zooms gently out on exit
  const v5 = isV5();
  const p = prog(t, t0, v5 ? Math.max(dur, 0.9) : dur, v5 ? easeSoft : undefined);
  const q = t1 === undefined ? 0 : prog(t, t1, v5 ? 0.6 : 0.45, v5 ? easeSoft : undefined);
  if (p <= 0) return null;
  const op = p * (1 - q);
  const blur = (1 - p) * (v5 ? 6 : 10) + q * (v5 ? 5 : 8);
  const z0 = v5 ? Math.min(s0, 0.9) : s0;
  const sc = (z0 + (1 - z0) * p) * (1 + (v5 ? 0.05 : 0) * q);
  const k = v5 ? 0.5 : 1; // smaller slides, the zoom does the work
  return (
    <div
      style={{
        opacity: op,
        transform: `translate(${(1 - p) * dx * k}px, ${(1 - p) * dy * k - q * 12 * k}px) scale(${sc})`,
        filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Paper: React.FC<{ tint?: string }> = ({ tint }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: C.bg }} />
    <AbsoluteFill
      style={{
        background: `radial-gradient(1200px 700px at 50% 42%, rgba(255,255,255,0.75), rgba(255,255,255,0) 70%),
          radial-gradient(900px 600px at 88% 100%, ${tint ?? "rgba(245,158,11,0.10)"}, rgba(0,0,0,0) 70%),
          radial-gradient(800px 500px at 0% 0%, rgba(234,88,12,0.08), rgba(0,0,0,0) 70%),
          radial-gradient(900px 520px at 100% 0%, rgba(250,204,21,0.10), rgba(0,0,0,0) 70%),
          radial-gradient(700px 480px at 0% 100%, rgba(22,163,74,0.05), rgba(0,0,0,0) 70%)`,
      }}
    />
    <Img src={asset("grain.png")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.05, mixBlendMode: "multiply" }} />
  </AbsoluteFill>
);

/** Iridescent orb in the ElevenLabs manner, in AstroRaaga colours. */
export const Orb: React.FC<{ size: number; t: number; hue?: "saffron" | "violet" | "green" | "teal"; glow?: number; style?: React.CSSProperties }> = ({
  size,
  t,
  hue = "saffron",
  glow = 0.35,
  style,
}) => {
  const pal = {
    saffron: ["#F59E0B", "#EA580C", "#FCD34D", "#10B981", "#F472B6"],
    violet: ["#8B5CF6", "#6366F1", "#F59E0B", "#EC4899", "#22D3EE"],
    green: ["#10B981", "#059669", "#FCD34D", "#0EA5E9", "#84CC16"],
    teal: ["#06B6D4", "#0E7490", "#A7F3D0", "#3B82F6", "#F59E0B"],
  }[hue];
  const blobs = pal.map((c, i) => {
    const a = t * (0.35 + i * 0.07) + i * 1.7;
    const x = 50 + Math.cos(a) * 26;
    const y = 50 + Math.sin(a * 1.13 + i) * 26;
    return `radial-gradient(circle at ${x}% ${y}%, ${c} 0%, ${c}00 ${48 + (i % 2) * 8}%)`;
  });
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        position: "relative",
        overflow: "hidden",
        boxShadow: `0 ${size * 0.08}px ${size * 0.35}px rgba(234,88,12,${glow * 0.6}), 0 0 ${size * 0.5}px rgba(245,158,11,${glow * 0.45})`,
        background: pal[0],
        ...style,
      }}
    >
      <div style={{ position: "absolute", inset: -size * 0.1, background: blobs.join(","), filter: `blur(${size * 0.06}px)` }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `radial-gradient(circle at 34% 28%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 32%), radial-gradient(circle at 70% 80%, rgba(0,0,0,0.18), rgba(0,0,0,0) 55%)`,
        }}
      />
    </div>
  );
};

export const Lotus: React.FC<{ size?: number; color?: string }> = ({ size = 22, color = C.saffron }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 4c2 2.5 2.6 5.5 0 9.5C9.4 9.5 10 6.5 12 4Z" fill={color} />
    <path d="M12 13.5c-2.5-1.8-5.6-2.6-8.5-2 1 3.3 4.3 5.3 8.5 5.3s7.5-2 8.5-5.3c-2.9-.6-6 .2-8.5 2Z" fill={color} opacity={0.75} />
    <path d="M3 18.5h18" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
  </svg>
);

export const Label: React.FC<{ children: React.ReactNode; color?: string; light?: boolean; style?: React.CSSProperties }> = ({
  children,
  color,
  light,
  style,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, ...style, ...(typeof children === "string" && /^\d\d · /.test(children) ? { visibility: "hidden" } : {}) }}>
    <div style={{ width: 44, height: 1.5, background: light ? "rgba(255,220,170,0.6)" : C.goldHair }} />
    <Lotus color={light ? "#F5B971" : C.gold} />
    <div
      style={{
        fontFamily: KARLA,
        fontWeight: 600,
        fontSize: 21,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: color ?? (light ? "#F3D9B5" : C.goldDeep),
      }}
    >
      {children}
    </div>
    <div style={{ width: 44, height: 1.5, background: light ? "rgba(255,220,170,0.6)" : C.goldHair }} />
  </div>
);

export const Accent: React.FC<{ children: React.ReactNode; light?: boolean }> = ({ children, light }) => (
  <span
    style={{
      fontFamily: SERIF,
      fontStyle: "italic",
      fontWeight: 700,
      backgroundImage: light ? "linear-gradient(100deg,#FDBA74,#FDE68A 50%,#FB923C)" : GRAD,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      padding: "0 0.06em",
    }}
  >
    {children}
  </span>
);

export const Headline: React.FC<{ size?: number; color?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({
  size = 92,
  color = C.ink,
  style,
  children,
}) => (
  <div style={{ fontFamily: MARCELLUS, fontSize: size, lineHeight: 1.08, color, letterSpacing: "-0.01em", ...style }}>{children}</div>
);

export const Body: React.FC<{ size?: number; color?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({
  size = 28,
  color = C.ink2,
  style,
  children,
}) => <div style={{ fontFamily: KARLA, fontSize: size, lineHeight: 1.35, color, ...style }}>{children}</div>;

/** Typing text with a caret (ElevenLabs "Help customers…" beat). */
export const TypeText: React.FC<{ text: string; t: number; t0: number; cps?: number; caret?: boolean; style?: React.CSSProperties }> = ({
  text,
  t,
  t0,
  cps = 26,
  caret = true,
  style,
}) => {
  const n = Math.max(0, Math.min(text.length, Math.floor((t - t0) * cps)));
  const done = n >= text.length;
  const on = !done || Math.floor(t * 2.2) % 2 === 0;
  return (
    <span style={style}>
      {text.slice(0, n)}
      {caret && (
        <span style={{ display: "inline-block", width: "0.06em", height: "1em", marginLeft: "0.04em", background: "currentColor", opacity: on ? 0.85 : 0, transform: "translateY(0.12em)" }} />
      )}
    </span>
  );
};

export const Pill: React.FC<{ dark?: boolean; icon?: React.ReactNode; children: React.ReactNode; style?: React.CSSProperties; size?: number }> = ({
  dark,
  icon,
  children,
  style,
  size = 26,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: `${size * 0.5}px ${size * 0.95}px`,
      borderRadius: 999,
      background: dark ? C.black : C.card,
      color: dark ? "#FFF7EC" : C.ink,
      border: dark ? "none" : `1.5px solid ${C.goldHair}`,
      boxShadow: dark ? "0 12px 30px rgba(28,21,14,0.25)" : "0 14px 34px rgba(124,45,18,0.08)",
      fontFamily: KARLA,
      fontWeight: 600,
      fontSize: size,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {icon}
    {children}
  </div>
);

export const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode; glass?: boolean }> = ({ style, children, glass }) => (
  <div
    style={{
      background: glass ? "rgba(255,255,255,0.10)" : C.card,
      border: glass ? "1.5px solid rgba(255,255,255,0.22)" : `1.5px solid ${C.goldHair}`,
      borderRadius: 26,
      boxShadow: glass ? "0 30px 80px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25)" : "0 24px 60px rgba(124,45,18,0.09)",
      backdropFilter: glass ? "blur(22px) saturate(1.3)" : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Number that counts up from 0 between t0 and t0+dur. */
export const Count: React.FC<{ to: number; t: number; t0: number; dur?: number; prefix?: string; suffix?: string; locale?: string }> = ({
  to,
  t,
  t0,
  dur = 1.2,
  prefix = "",
  suffix = "",
  locale = "en-IN",
}) => {
  const p = prog(t, t0, dur, ease);
  const v = Math.round(to * p);
  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefix}
      {v.toLocaleString(locale)}
      {suffix}
    </span>
  );
};

/** Hairline path drawn on with progress p (0..1). */
export const Draw: React.FC<{ d: string; p: number; stroke?: string; width?: number; dash?: string; opacity?: number }> = ({
  d,
  p,
  stroke = C.hair,
  width = 2,
  dash,
  opacity = 1,
}) => (
  <path
    d={d}
    pathLength={1}
    fill="none"
    stroke={stroke}
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeDasharray={dash ?? "1 1"}
    strokeDashoffset={dash ? undefined : 1 - Math.max(0, Math.min(1, p))}
    opacity={dash ? opacity * (p > 0 ? 1 : 0) : opacity}
  />
);

export const SECTIONS = ["Intro", "Team", "Problem", "Solution", "Segments", "Goals", "Market", "Go-to-market", "Model", "Roadmap", "Traction", "Competition", "Vision", "Funding"];

/** Deck breadcrumb at the bottom, so investors always know which slide they are on. */
export const Crumbs: React.FC<{ active: number; light?: boolean; t: number; a: number; b: number }> = ({ active, light, t, a, b }) => {
  const op = Math.min(prog(t, a, 0.5), 1 - prog(t, b - 0.4, 0.4));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 44, display: "flex", justifyContent: "center", gap: 26, opacity: op * 0.95 }}>
      {SECTIONS.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: 4,
              background: i === active ? C.saffron : light ? "rgba(255,255,255,0.25)" : "rgba(44,24,16,0.18)",
              boxShadow: i === active ? "0 0 10px rgba(234,88,12,0.6)" : undefined,
            }}
          />
          <div
            style={{
              fontFamily: KARLA,
              fontWeight: i === active ? 700 : 500,
              fontSize: 17,
              letterSpacing: "0.06em",
              color: i === active ? (light ? "#FFE8CC" : C.ink) : light ? "rgba(255,255,255,0.38)" : "rgba(44,24,16,0.38)",
            }}
          >
            {s}
          </div>
        </div>
      ))}
    </div>
  );
};

/** Small line icons (24 px grid). */
export const Icon: React.FC<{ name: string; size?: number; color?: string; sw?: number }> = ({ name, size = 26, color = "currentColor", sw = 1.8 }) => {
  const P: Record<string, React.ReactNode> = {
    chat: <path d="M4 5h16v11H9l-5 4V5Z" />,
    sms: (
      <>
        <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
        <path d="M10 18.5h4" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3.5 6 8.5 7 8.5-7" />
      </>
    ),
    check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
    star: <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8L12 3.5Z" />,
    play: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="m10 9 5 3-5 3V9Z" />
      </>
    ),
    temple: (
      <>
        <path d="M12 2.5v3M7 21V11l5-5 5 5v10M4 21h16M10 21v-5h4v5" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5a3 3 0 0 1 0 6M18 14c2 .7 3 2.6 3 6" />
      </>
    ),
    gift: (
      <>
        <rect x="3.5" y="9" width="17" height="11" rx="1.5" />
        <path d="M12 9v11M3.5 13h17M12 9C9 9 7 7.8 7 6.2 7 4.7 9.5 4 12 9Zm0 0c3 0 5-1.2 5-2.8C17 4.7 14.5 4 12 9Z" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.6 2.7 3.8 5.7 3.8 9s-1.2 6.3-3.8 9c-2.6-2.7-3.8-5.7-3.8-9S9.4 5.7 12 3Z" />
      </>
    ),
    phone: <path d="M6 3.5h3l1.5 4.5-2 1.3a11 11 0 0 0 6.2 6.2l1.3-2 4.5 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4 5.5a2 2 0 0 1 2-2Z" />,
    video: (
      <>
        <rect x="3" y="6" width="13" height="12" rx="2" />
        <path d="m16 10.5 5-3v9l-5-3" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6L12 3Z" />
        <path d="m8.8 12 2.2 2.2 4.2-4.4" />
      </>
    ),
    spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />,
    pin: (
      <>
        <path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11Z" />
        <circle cx="12" cy="10" r="2.3" />
      </>
    ),
    reset: (
      <>
        <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
        <path d="M4 4v4.5h4.5" />
      </>
    ),
    tag: (
      <>
        <path d="M3.5 12.5V4.5h8l9 9-8 8-9-9Z" />
        <circle cx="8" cy="9" r="1.4" />
      </>
    ),
    alert: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5v5.5M12 16.3v.2" />
      </>
    ),
    question: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.6 9.3a2.5 2.5 0 1 1 3.4 2.4c-.7.3-1 .8-1 1.5v.5M12 16.6v.2" />
      </>
    ),
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    bolt: <path d="M13 2.5 5 13.5h6l-1 8 8-11h-6l1-8Z" />,
    growth: <path d="M3.5 17.5 9 12l4 4 7.5-8M15 8h5.5v5.5" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {P[name]}
    </svg>
  );
};

export const BrandIcon: React.FC<{ which: "jyotiq" | "karmeq"; size?: number }> = ({ which, size = 64 }) => {
  return (
    <Img
      src={asset(which === "jyotiq" ? "v7/jyotiq_ring.png" : `brand/${which}_4x.png`)}
      style={{ width: size, height: size, borderRadius: size / 2, boxShadow: "0 10px 26px rgba(124,45,18,0.18)" }}
    />
  );
};

export const Mono: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <span style={{ fontFamily: KARLA, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", fontSize: 18, ...style }}>{children}</span>
);

export { ease };

/** Circular reveal (light burst) from a point: children clipped to a growing circle with a glowing edge. */
export const Burst: React.FC<{ x: number; y: number; t0: number; dur?: number; color?: string; children: React.ReactNode }> = ({
  x,
  y,
  t0,
  dur = 1.0,
  color = "rgba(255,190,110,0.9)",
  children,
}) => {
  const t = useWinT();
  const p = prog(t, t0, dur, easeInOut);
  const R = p * p * 2300 + p * 60;
  if (p >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `circle(${R}px at ${x}px ${y}px)` }}>{children}</AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: x - R,
          top: y - R,
          width: R * 2,
          height: R * 2,
          borderRadius: "50%",
          boxShadow: `0 0 ${60 + 120 * (1 - p)}px ${20 + 40 * (1 - p)}px ${color}`,
          opacity: (1 - p) * 0.9,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
