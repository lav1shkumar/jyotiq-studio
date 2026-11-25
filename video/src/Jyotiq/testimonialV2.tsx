import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Freeze,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  interpolateColors,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont as loadSans } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadSerif } from "@remotion/google-fonts/PlayfairDisplay";
import { CAPTIONS, Caption } from "./testimonial";

/*
 * Jyotiq testimonial v2 -- 480x864, 30fps, 3446 frames (same as v1).
 * Back to front: original video (title card + her first second) -> Jyotiq night-sky set ->
 * beat footage + app motion graphics in the free wall space -> speaker cut-out (Apple Vision
 * matte) -> v1 planet medallions -> v1 captions -> v1 watermark.
 * Times are seconds on the source timeline (work/testimonial-v2/beat-plan.json).
 * Free wall space from the matte occupancy map: left x 0-93, right x 349-479 (y 84-350),
 * top band y < 56 across the frame. Text stays inside those zones.
 */

const { fontFamily: SANS } = loadSans("normal", {
  weights: ["500", "600", "700", "800"],
  subsets: ["latin"],
});
const { fontFamily: SERIF } = loadSerif("normal", {
  weights: ["600", "700"],
  subsets: ["latin"],
});

const FPS = 30;
export const V2_FRAMES = 3446;
const f = (s: number) => Math.round(s * FPS);
const P = "jyotiq/testimonial/";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SOFT = { damping: 15, mass: 0.6, stiffness: 140 };

// Jyotiq app palette (site CSS: warm black #0c0a07, gold #a87232, cream #fbf7f0)
const C = {
  card: "rgba(14,11,8,0.88)",
  cardSoft: "rgba(14,11,8,0.74)",
  gold: "#e6b45a",
  goldDeep: "#a87232",
  goldLine: "rgba(230,180,90,0.55)",
  cream: "#fbf7f0",
  muted: "rgba(251,247,240,0.72)",
  ink: "#1a1208",
};

const card = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  background: C.card,
  border: `1px solid ${C.goldLine}`,
  borderRadius: 14,
  boxShadow: "0 8px 22px rgba(0,0,0,0.45)",
  color: C.cream,
  fontFamily: SANS,
  boxSizing: "border-box",
  ...extra,
});

// 0 -> 1 over fi after a, then 1 -> 0 over fo before b
const env = (t: number, a: number, b: number, fi = 0.25, fo = 0.35) =>
  Math.min(
    interpolate(t, [a, a + fi], [0, 1], clamp),
    interpolate(t, [b - fo, b], [1, 0], clamp)
  );

const dotPulse = (frame: number, k: number) =>
  0.35 + 0.65 * Math.max(0, Math.sin(frame * 0.35 - k * 0.9));

/* ---------- primitives ---------- */

const Pop: React.FC<{
  at: number;
  out: number;
  x: number;
  y: number;
  w?: number;
  fo?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at, out, x, y, w, fo = 0.35, style, children }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < at - 0.04 || t > out + 0.04) return null;
  const s = spring({ frame: frame - f(at), fps: FPS, config: SOFT });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        opacity: env(t, at, out, 0.16, fo),
        transform: `translateY(${interpolate(s, [0, 1], [12, 0])}px) scale(${interpolate(s, [0, 1], [0.85, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Ripple: React.FC<{ at: number; size?: number }> = ({ at, size = 44 }) => {
  const t = useCurrentFrame() / FPS;
  if (t < at || t > at + 0.6) return null;
  const p = interpolate(t, [at, at + 0.6], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: "50%",
        border: `2px solid ${C.gold}`,
        opacity: 1 - p,
        transform: `scale(${0.3 + p * 1.3})`,
      }}
    />
  );
};

const FlameIcon: React.FC<{ size: number; id: string }> = ({ size, id }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 40 52" style={{ display: "block" }}>
    <defs>
      <linearGradient id={`fl-${id}`} x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#e2401f" />
        <stop offset="0.55" stopColor="#ff8f1f" />
        <stop offset="1" stopColor="#ffd56b" />
      </linearGradient>
    </defs>
    <path
      d="M20 2 C27 14 36 20 34 34 C32.5 45 26 50 20 50 C14 50 7.5 45 6 34 C5 25 11 19 13 12 C15 18 17 20 19 21 C18 14 18 8 20 2 Z"
      fill={`url(#fl-${id})`}
    />
    <path
      d="M20 26 C24 31 27 35 25.5 41 C24.5 45 22 47 20 47 C18 47 15.5 45 14.5 41 C13.5 36 17 32 20 26 Z"
      fill="#ffe7a3"
      opacity={0.9}
    />
  </svg>
);

const TopPill: React.FC<{
  at: number;
  out: number;
  w: number;
  fo?: number;
  children: React.ReactNode;
}> = ({ at, out, w, fo, children }) => (
  <Pop at={at} out={out} x={206 - w / 2} y={12} w={w} fo={fo}>
    <div
      style={card({
        height: 36,
        borderRadius: 18,
        border: `1px solid ${C.gold}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        padding: "0 12px",
        whiteSpace: "nowrap",
      })}
    >
      {children}
    </div>
  </Pop>
);

/* ---------- background set ---------- */

const STARS = Array.from({ length: 46 }, (_, i) => {
  const r = (n: number) => {
    const v = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
    return v - Math.floor(v);
  };
  return { x: r(1) * 480, y: r(2) * 520, s: 1 + r(3) * 1.8, ph: r(4) * 600 };
});

const NightSet: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < 5.85) return null;
  const spin = frame * 0.04;
  return (
    <AbsoluteFill style={{ opacity: interpolate(t, [5.9, 6.45], [0, 1], clamp) }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(130% 80% at 50% 24%, #26165c 0%, #150b36 45%, #08051a 100%)",
        }}
      />
      {STARS.map((st, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: st.x,
            top: st.y,
            width: st.s,
            height: st.s,
            borderRadius: "50%",
            background: "#fff",
            opacity: 0.3 + 0.5 * (0.5 + 0.5 * Math.sin((frame + st.ph) / 17)),
            boxShadow: `0 0 ${st.s * 3}px rgba(255,255,255,0.6)`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 10,
          top: -20,
          width: 460,
          height: 460,
          borderRadius: "50%",
          border: "1px solid rgba(230,180,90,0.18)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 40,
          width: 340,
          height: 340,
          borderRadius: "50%",
          border: "1px dashed rgba(230,180,90,0.16)",
          transform: `rotate(${-spin}deg)`,
        }}
      />
      {/* warm back-light behind her head: separates dark hair from the night sky */}
      <div
        style={{
          position: "absolute",
          left: 20,
          top: 10,
          width: 440,
          height: 520,
          background:
            "radial-gradient(50% 44% at 50% 40%, rgba(244,196,120,0.30) 0%, rgba(244,196,120,0.10) 48%, rgba(244,196,120,0) 76%)",
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------- footage ---------- */

type Grade = "normal" | "stress" | "soft" | "warm";
const GRADES: Record<Grade, { filter: string; tint: string }> = {
  normal: { filter: "brightness(0.8) saturate(0.92) contrast(1.04)", tint: "rgba(20,10,52,0.20)" },
  stress: { filter: "brightness(0.66) saturate(0.5) contrast(1.12)", tint: "rgba(26,18,74,0.30)" },
  soft: { filter: "brightness(0.58) saturate(0.85) blur(2.4px)", tint: "rgba(20,10,52,0.30)" },
  warm: { filter: "brightness(0.62) saturate(1.05) blur(1.4px)", tint: "rgba(20,10,52,0.22)" },
};

const FootageInner: React.FC<{
  src: string;
  dur: number;
  h: number;
  left: number;
  grade: Grade;
  fi: number;
  fo: number;
}> = ({ src, dur, h, left, grade, fi, fo }) => {
  const lf = useCurrentFrame(); // local to the Sequence
  const o = Math.min(
    interpolate(lf, [0, f(fi)], [0, 1], clamp),
    interpolate(lf, [f(dur) - f(fo), f(dur)], [1, 0], clamp)
  );
  const z = interpolate(lf, [0, f(dur)], [1, 1.05]);
  const g = GRADES[grade];
  const mask = "linear-gradient(to bottom, #000 0%, #000 68%, transparent 100%)";
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 480,
          height: h,
          overflow: "hidden",
          WebkitMaskImage: mask,
          maskImage: mask,
        }}
      >
        <OffthreadVideo
          src={staticFile(`${P}broll/${src}.mp4`)}
          muted
          style={{
            position: "absolute",
            left,
            top: 0,
            width: (h * 16) / 9,
            height: h,
            maxWidth: "none", // Tailwind preflight caps img at 100% of the parent
            objectFit: "fill",
            filter: g.filter,
            transform: `scale(${z})`,
            transformOrigin: "50% 30%",
          }}
        />
        <AbsoluteFill style={{ background: g.tint }} />
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(90% 70% at 50% 35%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const Footage: React.FC<{
  src: string;
  at: number;
  dur: number;
  h: number;
  left: number;
  grade?: Grade;
  fi?: number;
  fo?: number;
}> = ({ src, at, dur, h, left, grade = "normal", fi = 0.35, fo = 0.35 }) => (
  <Sequence from={f(at)} durationInFrames={f(dur)} name={`b-roll ${src}`}>
    <FootageInner src={src} dur={dur} h={h} left={left} grade={grade} fi={fi} fo={fo} />
  </Sequence>
);

/* ---------- beat 1: kundali chart (left) ---------- */

const KS = 82;
const HOUSE: Record<number, [number, number]> = {
  1: [0.5, 0.27], 2: [0.25, 0.12], 3: [0.12, 0.25], 4: [0.27, 0.5],
  5: [0.12, 0.75], 6: [0.25, 0.88], 7: [0.5, 0.73], 8: [0.75, 0.88],
  9: [0.88, 0.75], 10: [0.73, 0.5], 11: [0.88, 0.25], 12: [0.75, 0.12],
};
const GRAHAS: [string, number][] = [
  ["Ju", 1], ["Ra", 3], ["Mo", 4], ["Sa", 5], ["Ma", 7],
  ["Ke", 9], ["Su", 10], ["Me", 11], ["Ve", 12],
];

const Kundali: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < 6.95 || t > 19.7) return null;
  const draw = interpolate(t, [7.1, 8.5], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const pulse = interpolate(t, [13.35, 13.6, 14.1], [0, 1, 0], clamp);
  const glow = interpolate(t, [16.9, 17.4, 19.0], [0, 1, 0.6], clamp);
  const lines = [
    `M0 0 H${KS} V${KS} H0 Z`,
    `M0 0 L${KS} ${KS}`,
    `M${KS} 0 L0 ${KS}`,
    `M${KS / 2} 0 L${KS} ${KS / 2} L${KS / 2} ${KS} L0 ${KS / 2} Z`,
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: 4,
        top: 176,
        width: 90,
        opacity: env(t, 7.0, 19.6, 0.4, 0.5),
        transform: `scale(${1 + pulse * 0.07})`,
      }}
    >
      <div
        style={card({
          background: C.cardSoft,
          borderRadius: 12,
          padding: "6px 4px 5px",
          boxShadow: `0 0 ${10 + glow * 18}px rgba(230,180,90,${0.15 + glow * 0.35}), 0 8px 22px rgba(0,0,0,0.45)`,
        })}
      >
        <div
          style={{
            fontSize: 8.5,
            fontWeight: 800,
            letterSpacing: 2,
            color: C.gold,
            textAlign: "center",
            marginBottom: 4,
            opacity: interpolate(t, [7.3, 7.7], [0, 1], clamp),
          }}
        >
          KUNDALI
        </div>
        <svg
          width={KS}
          height={KS}
          viewBox={`-1 -1 ${KS + 2} ${KS + 2}`}
          style={{ display: "block", margin: "0 auto", overflow: "visible" }}
        >
          {lines.map((d, i) => (
            <path
              key={i}
              d={d}
              pathLength={1}
              fill="none"
              stroke={C.gold}
              strokeWidth={1.2}
              strokeDasharray={1}
              strokeDashoffset={1 - draw}
              style={{ filter: `drop-shadow(0 0 ${2 + glow * 3}px rgba(230,180,90,0.8))` }}
            />
          ))}
          {GRAHAS.map(([g, h], i) => {
            const s = spring({
              frame: frame - f(14.3 + i * 0.16),
              fps: FPS,
              config: { damping: 12, mass: 0.5, stiffness: 160 },
            });
            const cx = HOUSE[h][0] * KS;
            const cy = HOUSE[h][1] * KS;
            return (
              <text
                key={g}
                x={cx}
                y={cy + 3}
                textAnchor="middle"
                fontFamily={SANS}
                fontSize={8}
                fontWeight={800}
                fill={C.cream}
                opacity={interpolate(s, [0, 1], [0, 1], clamp)}
                transform={`translate(${cx} ${cy}) scale(${interpolate(s, [0, 1], [0.3, 1])}) translate(${-cx} ${-cy})`}
              >
                {g}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

/* ---------- beat 1 + 3: the Jyotiq phone (right) ---------- */

const PX = 360;
const PY = 96;
const PW = 110;
const PH = 222;

const PhoneFrame: React.FC<{ glow: number; children: React.ReactNode }> = ({ glow, children }) => (
  <div
    style={{
      width: PW,
      height: PH,
      borderRadius: 20,
      background: "#15110d",
      border: `1px solid ${C.goldLine}`,
      boxShadow: `0 14px 34px rgba(0,0,0,0.6), 0 0 ${22 + glow * 26}px rgba(230,180,90,${0.18 + glow * 0.45})`,
      padding: 4,
      boxSizing: "border-box",
    }}
  >
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: 16,
        overflow: "hidden",
        background: "#0c0a07",
      }}
    >
      {children}
      <div
        style={{
          position: "absolute",
          top: 5,
          left: "50%",
          width: 30,
          height: 7,
          marginLeft: -15,
          borderRadius: 4,
          background: "#000",
        }}
      />
    </div>
  </div>
);

const OS_COLORS = [
  "#3d5a80", "#7a5c99", "#4f7d62", "#9a6b3f", "#5c6b8a", "#8a4f5c", "#4f6f7d", "#6b7d4f",
  "#7d4f6b", "#4f5c8a", "#8a7a4f", "#5c8a7d", "#7a4f4f", "#4f7a8a", "#6b4f8a", "#8a6b4f",
  "#4f8a5c", "#5c4f7a", "#7a7a7a", "#4f4f7a",
];
const ICON = 17;
const JX = 5 + 1 * (ICON + 8);
const JY = 28 + 2 * 27;

const OsHome: React.FC<{ t: number }> = ({ t }) => {
  const press = interpolate(t, [7.45, 7.55, 7.65], [1, 0.86, 1], clamp);
  const zoom = interpolate(t, [7.62, 8.0], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <AbsoluteFill
      style={{ background: "linear-gradient(160deg, #2a2f55 0%, #1a1636 55%, #0f0c22 100%)" }}
    >
      <div
        style={{
          position: "absolute",
          top: 13,
          left: 9,
          fontFamily: SANS,
          fontSize: 6,
          fontWeight: 700,
          color: "rgba(255,255,255,0.8)",
        }}
      >
        9:41
      </div>
      {OS_COLORS.map((col, i) => {
        const cx = i % 4;
        const cy = Math.floor(i / 4);
        if (cx === 1 && cy === 2) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 5 + cx * (ICON + 8),
              top: 28 + cy * 27,
              width: ICON,
              height: ICON,
              borderRadius: 5,
              background: col,
              opacity: 0.55,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: JX,
          top: JY,
          width: ICON,
          height: ICON,
          borderRadius: 5,
          background: "#0c0a07",
          border: `1px solid ${C.gold}`,
          transform: `scale(${press})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 8px rgba(230,180,90,0.6)",
        }}
      >
        <Img src={staticFile("jyotiq/logo-icon.png")} style={{ width: 13 }} />
        <Ripple at={7.45} size={30} />
      </div>
      <div
        style={{
          position: "absolute",
          left: JX - 6,
          top: JY + ICON + 1.5,
          width: ICON + 12,
          textAlign: "center",
          fontFamily: SANS,
          fontSize: 5,
          fontWeight: 700,
          color: C.cream,
        }}
      >
        Jyotiq
      </div>
      {zoom > 0 && (
        <div
          style={{
            position: "absolute",
            left: interpolate(zoom, [0, 1], [JX, 0]),
            top: interpolate(zoom, [0, 1], [JY, 0]),
            width: interpolate(zoom, [0, 1], [ICON, 102]),
            height: interpolate(zoom, [0, 1], [ICON, 214]),
            borderRadius: interpolate(zoom, [0, 1], [5, 16]),
            background: "#0c0a07",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Img
            src={staticFile("jyotiq/logo-icon.png")}
            style={{ width: interpolate(zoom, [0, 1], [13, 48]) }}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};

const Splash: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill
    style={{
      background: "radial-gradient(80% 60% at 50% 45%, #1e1408 0%, #0c0a07 70%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: interpolate(t, [7.98, 8.2], [0, 1], clamp),
    }}
  >
    <Img
      src={staticFile("jyotiq/logo-full.png")}
      style={{
        width: 64,
        transform: `scale(${interpolate(t, [8.0, 8.9], [0.92, 1.02], clamp)})`,
        filter: "drop-shadow(0 0 8px rgba(230,180,90,0.45))",
      }}
    />
  </AbsoluteFill>
);

const MINI: [string, string][] = [
  ["✨", "General"], ["❤️", "Love"], ["🌿", "Health"], ["💼", "Career"],
  ["💰", "Wealth"], ["🎓", "Education"], ["🏡", "Family"], ["✈️", "Travel"],
];

const AppHome: React.FC<{ t: number; fadeFrom?: number }> = ({ t, fadeFrom }) => (
  <AbsoluteFill
    style={{
      background: "#0c0a07",
      fontFamily: SANS,
      opacity: fadeFrom === undefined ? 1 : interpolate(t, [fadeFrom, fadeFrom + 0.25], [0, 1], clamp),
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 16,
        left: 7,
        right: 7,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
        <Img src={staticFile("jyotiq/logo-icon.png")} style={{ width: 11 }} />
        <span style={{ fontSize: 6.5, fontWeight: 800, color: C.gold }}>JyotiQ</span>
      </div>
      <div
        style={{
          fontSize: 5.5,
          fontWeight: 700,
          color: C.gold,
          border: `0.5px solid ${C.goldLine}`,
          borderRadius: 6,
          padding: "1px 4px",
        }}
      >
        🔥 1
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        top: 34,
        left: 7,
        right: 7,
        fontFamily: SERIF,
        fontSize: 9.5,
        fontWeight: 700,
        lineHeight: 1.15,
        color: C.cream,
      }}
    >
      Where Does Your Light Fall?
    </div>
    <div
      style={{
        position: "absolute",
        top: 62,
        left: 6,
        right: 6,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 4,
      }}
    >
      {MINI.map(([ic, lb]) => (
        <div
          key={lb}
          style={{
            height: 22,
            borderRadius: 5,
            background: "#15110d",
            border: "0.5px solid rgba(230,180,90,0.35)",
            display: "flex",
            alignItems: "center",
            gap: 3,
            padding: "0 4px",
          }}
        >
          <span style={{ fontSize: 7 }}>{ic}</span>
          <span style={{ fontSize: 5.5, fontWeight: 700, color: C.cream }}>{lb}</span>
        </div>
      ))}
    </div>
    <div
      style={{
        position: "absolute",
        bottom: 10,
        left: 6,
        right: 6,
        height: 18,
        borderRadius: 9,
        background: "#15110d",
        border: `0.5px solid ${C.goldLine}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 3px 0 7px",
      }}
    >
      <span style={{ fontSize: 5.5, color: C.muted }}>What would you like to know?</span>
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          background: `linear-gradient(135deg, ${C.gold}, ${C.goldDeep})`,
        }}
      />
    </div>
  </AbsoluteFill>
);

const PhoneBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const a = t >= 6.25 && t <= 13.35;
  const b = t >= 31.1 && t <= 33.75; // must clear before the source card at 33.70
  if (!a && !b) return null;
  const at = a ? 6.3 : 31.15;
  const out = a ? 13.3 : 33.72;
  const s = spring({
    frame: frame - f(at),
    fps: FPS,
    config: { damping: 16, mass: 0.8, stiffness: 110 },
  });
  let screen: React.ReactNode;
  if (a && t < 8.2) {
    screen = (
      <>
        <OsHome t={t} />
        {t >= 7.98 && <Splash t={t} />}
      </>
    );
  } else if (a && t < 9.15) {
    screen = (
      <>
        <Splash t={t} />
        {t >= 8.85 && <AppHome t={t} fadeFrom={8.85} />}
      </>
    );
  } else {
    screen = <AppHome t={t} />;
  }
  const land = b ? interpolate(t, [31.95, 32.15, 32.6], [0, 1, 0], clamp) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: PX,
        top: PY,
        opacity: env(t, at, out, 0.25, 0.4),
        transform: `translateY(${interpolate(s, [0, 1], [36, 0])}px) rotate(${interpolate(s, [0, 1], [6, 2])}deg) scale(${1 + land * 0.05})`,
        transformOrigin: "50% 60%",
      }}
    >
      <PhoneFrame glow={land}>{screen}</PhoneFrame>
    </div>
  );
};

/* ---------- beat 3: remedies that resolve into the app ---------- */

const RemedyIcon: React.FC<{ kind: string }> = ({ kind }) => {
  const g = C.gold;
  if (kind === "om") {
    return (
      <div
        style={{
          fontFamily: "'Kohinoor Devanagari', 'Devanagari Sangam MN', sans-serif",
          fontSize: 32,
          lineHeight: 1,
          color: g,
          marginTop: 2,
          textShadow: "0 0 8px rgba(230,180,90,0.6)",
        }}
      >
        ॐ
      </div>
    );
  }
  return (
    <svg width={38} height={38} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="remedy-flame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ff8f1f" />
          <stop offset="1" stopColor="#ffe08a" />
        </linearGradient>
      </defs>
      {kind === "gem" && (
        <g fill="none" stroke={g} strokeLinejoin="round">
          <path d="M9 18 L16 9 H32 L39 18 L24 41 Z" strokeWidth={2} fill="rgba(230,180,90,0.14)" />
          <path d="M9 18 H39 M16 9 L20.5 18 L24 41 M32 9 L27.5 18 L24 41 M20.5 18 L24 9 L27.5 18" strokeWidth={1.3} />
        </g>
      )}
      {kind === "diya" && (
        <g>
          <path
            d="M24 7 C28.5 13 29.5 18 24 24 C18.5 18 19.5 13 24 7 Z"
            fill="url(#remedy-flame)"
            style={{ filter: "drop-shadow(0 0 4px rgba(255,170,60,0.9))" }}
          />
          <path d="M7 27 C11 39 37 39 41 27 Z" fill="rgba(230,180,90,0.22)" stroke={g} strokeWidth={2} strokeLinejoin="round" />
          <path d="M5 27 H43" stroke={g} strokeWidth={2} strokeLinecap="round" />
        </g>
      )}
      {kind === "vastu" && (
        <g fill="none" stroke={g} strokeWidth={2} strokeLinejoin="round">
          <path d="M9 25 L24 12 L39 25 V40 H9 Z" fill="rgba(230,180,90,0.12)" />
          <path d="M20.5 40 V31 H27.5 V40" />
          <path d="M24 2.5 L25.6 6.4 L29.5 8 L25.6 9.6 L24 13.5 L22.4 9.6 L18.5 8 L22.4 6.4 Z" fill={g} stroke="none" />
        </g>
      )}
    </svg>
  );
};

const REMEDIES = [
  { key: "gem", label: "GEMSTONES", x: 2, y: 98, at: 29.0 },
  { key: "diya", label: "HAWAN & POOJA", x: 366, y: 96, at: 29.4 },
  { key: "om", label: "MANTRAS", x: 2, y: 222, at: 29.8 },
  { key: "vastu", label: "VASTU", x: 366, y: 222, at: 30.2 },
];

const RemedyMedallions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < 28.95 || t > 32.25) return null;
  return (
    <>
      {REMEDIES.map((r) => {
        if (t < r.at - 0.03) return null;
        const s = spring({ frame: frame - f(r.at), fps: FPS, config: { damping: 13, mass: 0.6, stiffness: 140 } });
        const lag = r.x < 200 ? 0 : 0.1;
        const fly = interpolate(t, [31.3 + lag, 32.0 + lag], [0, 1], {
          ...clamp,
          easing: Easing.inOut(Easing.cubic),
        });
        const x = interpolate(fly, [0, 1], [r.x, PX + PW / 2 - 45]);
        const y = interpolate(fly, [0, 1], [r.y, PY + PH / 2 - 40]) - Math.sin(fly * Math.PI) * 40;
        const sc = interpolate(s, [0, 1], [0.5, 1]) * interpolate(fly, [0, 1], [1, 0.22]);
        const o = interpolate(s, [0, 1], [0, 1], clamp) * interpolate(fly, [0.75, 1], [1, 0], clamp);
        const bob = Math.sin((frame + r.x) / 18) * 2.5 * (1 - fly);
        return (
          <div
            key={r.key}
            style={{
              position: "absolute",
              left: x,
              top: y + bob,
              width: 90,
              opacity: o,
              transform: `scale(${sc})`,
              transformOrigin: "50% 40%",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                margin: "0 auto",
                borderRadius: "50%",
                background: C.card,
                border: `1.5px solid ${C.gold}`,
                boxShadow: "0 0 18px rgba(230,180,90,0.35), inset 0 0 14px rgba(230,180,90,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <RemedyIcon kind={r.key} />
            </div>
            <div
              style={{
                marginTop: 5,
                fontFamily: SANS,
                fontSize: 8,
                fontWeight: 800,
                letterSpacing: 1,
                whiteSpace: "nowrap",
                color: C.gold,
                textShadow: "0 1px 4px rgba(0,0,0,0.85)",
              }}
            >
              {r.label}
            </div>
          </div>
        );
      })}
    </>
  );
};

// labels as the app itself names them ("Kundali", "💬 Chat", Remedies, Muhurat, "Astrological Reports")
const FEATURES: [string, string][] = [
  ["🪐", "Kundali"], ["💬", "Chat"], ["🔱", "Remedies"], ["📅", "Muhurat"], ["📜", "Reports"],
];

const FeatureChips: React.FC = () => (
  <>
    {FEATURES.map(([ic, lb], i) => (
      <Pop key={lb} at={32.2 + i * 0.12} out={33.62} x={4} y={100 + i * 38} w={88}>
        <div
          style={card({
            height: 30,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "0 7px",
          })}
        >
          <span style={{ fontSize: 12 }}>{ic}</span>
          <span style={{ fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>{lb}</span>
        </div>
      </Pop>
    ))}
  </>
);

/* ---------- beat 4: first question free + flame system ---------- */

const EMBERS = Array.from({ length: 20 }, (_, i) => {
  const r = (n: number) => {
    const v = Math.sin(i * 91.7 + n * 47.3) * 24634.6345;
    return v - Math.floor(v);
  };
  const side = i % 3;
  const x = side === 0 ? 4 + r(1) * 78 : side === 1 ? 358 + r(1) * 108 : 30 + r(1) * 400;
  return {
    x,
    top: side === 2,
    start: 36.7 + r(2) * 9.2,
    life: 3.4 + r(3) * 2.6,
    size: 9 + r(4) * 10,
    sway: 5 + r(5) * 9,
    ph: r(6) * 6.28,
  };
});

const Embers: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < 36.6 || t > 52) return null;
  const master = interpolate(t, [36.6, 37.1], [0, 1], clamp);
  return (
    <>
      {EMBERS.map((e, i) => {
        if (t < e.start || t > e.start + e.life) return null;
        const p = (t - e.start) / e.life;
        const y = interpolate(p, [0, 1], [e.top ? 120 : 430, -40]);
        const o =
          master *
          0.85 *
          Math.min(interpolate(p, [0, 0.15], [0, 1], clamp), interpolate(p, [0.65, 1], [1, 0], clamp));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: e.x + Math.sin(p * 6 + e.ph) * e.sway,
              top: y,
              opacity: o,
              transform: `scale(${0.9 + 0.12 * Math.sin(frame * 0.9 + e.ph * 5)})`,
              filter: "drop-shadow(0 0 6px rgba(255,150,40,0.85))",
            }}
          >
            <FlameIcon size={e.size} id={`e${i}`} />
          </div>
        );
      })}
    </>
  );
};

const FlameCards: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const bal = t < 43.3 ? 3 : t < 45.0 ? 2 : 1;
  const tickAt = t >= 45.0 ? 45.0 : 43.3;
  const tick = t >= 43.3 ? interpolate(t, [tickAt, tickAt + 0.7], [1, 0], clamp) : 0;
  return (
    <>
      <Pop at={36.8} out={41.5} x={354} y={92} w={118}>
        <div style={card({ padding: "10px 8px", textAlign: "center" })}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              filter: "drop-shadow(0 0 8px rgba(255,150,40,0.8))",
            }}
          >
            <FlameIcon size={30} id="free" />
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 700, color: C.gold, marginTop: 4 }}>
            +1 Flame
          </div>
          <div style={{ fontSize: 7.5, fontWeight: 800, letterSpacing: 1, color: C.muted, marginTop: 2 }}>
            1 FLAME CREDITED!
          </div>
          <div style={{ fontSize: 10.5, fontWeight: 800, marginTop: 6, lineHeight: 1.25 }}>
            Your first question is free
          </div>
        </div>
      </Pop>
      <Pop at={38.25} out={41.5} x={4} y={110} w={88}>
        <div style={card({ padding: "8px 7px", borderRadius: 12 })}>
          <div style={{ fontSize: 9, fontWeight: 800, color: C.gold, whiteSpace: "nowrap" }}>🔥 Flame packs</div>
          <div style={{ fontSize: 8.5, fontWeight: 600, marginTop: 6, whiteSpace: "nowrap" }}>✓ Instant credit</div>
          <div style={{ fontSize: 8.5, fontWeight: 600, marginTop: 3, whiteSpace: "nowrap" }}>✓ Never expire</div>
        </div>
      </Pop>
      <TopPill at={41.85} out={46.6} w={240}>
        <FlameIcon size={14} id="rule" />
        <span style={{ fontSize: 14.5, fontWeight: 800 }}>1 Flame = 1 Question</span>
      </TopPill>
      <Pop at={41.8} out={46.6} x={354} y={92} w={118}>
        <div style={card({ padding: "9px 8px 11px", textAlign: "center", position: "relative" })}>
          <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: 1.2, color: C.gold }}>FLAME BALANCE</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 7 }}>
            <FlameIcon size={20} id="bal" />
            <span style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 700, lineHeight: 1 }}>{bal}</span>
          </div>
          {tick > 0 && (
            <div
              style={{
                position: "absolute",
                right: 14,
                top: 28 - (1 - tick) * 18,
                opacity: tick,
                fontSize: 12,
                fontWeight: 800,
                color: "#ff9d4a",
              }}
            >
              −1
            </div>
          )}
        </div>
      </Pop>
    </>
  );
};

/* ---------- beat 5: asking Jyotiq questions ---------- */

const ChatBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < 53.3 || t > 67.0) return null;
  const thumb = spring({ frame: frame - f(61.7), fps: FPS, config: { damping: 10, mass: 0.5, stiffness: 180 } });
  return (
    <>
      <Pop at={53.4} out={66.9} x={352} y={88} w={120}>
        <div
          style={{
            background: `linear-gradient(135deg, ${C.gold}, ${C.goldDeep})`,
            color: C.ink,
            borderRadius: "14px 14px 4px 14px",
            padding: "8px 9px",
            fontFamily: SANS,
            fontSize: 10.5,
            fontWeight: 700,
            lineHeight: 1.28,
            boxShadow: "0 8px 20px rgba(0,0,0,0.45)",
          }}
        >
          Which career path aligns with my Kundali's sun sign?
        </div>
      </Pop>
      <Pop at={54.8} out={66.9} x={4} y={140} w={88}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 70,
              height: 70,
              margin: "0 auto",
              borderRadius: "50%",
              overflow: "hidden",
              position: "relative",
              border: `2px solid ${C.gold}`,
              boxShadow: "0 0 16px rgba(230,180,90,0.35)",
              background: "#f3e9d8",
            }}
          >
            <Img
              src={staticFile(`${P}pandit.png`)}
              style={{ position: "absolute", width: 252, maxWidth: "none", left: -91, top: -3 }}
            />
          </div>
          <div
            style={{
              marginTop: 6,
              fontFamily: SANS,
              fontSize: 8,
              fontWeight: 800,
              letterSpacing: 1,
              color: C.gold,
              whiteSpace: "nowrap",
              textShadow: "0 1px 4px rgba(0,0,0,0.85)",
            }}
          >
            YOUR ASTROLOGER
          </div>
        </div>
      </Pop>
      {t < 55.75 && (
        <Pop at={54.8} out={55.75} x={352} y={160} w={56} fo={0.12}>
          <div
            style={card({
              height: 26,
              borderRadius: "14px 14px 14px 4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            })}
          >
            {[0, 1, 2].map((k) => (
              <span
                key={k}
                style={{ width: 5, height: 5, borderRadius: 3, background: C.gold, opacity: dotPulse(frame, k) }}
              />
            ))}
          </div>
        </Pop>
      )}
      <Pop at={55.65} out={66.9} x={352} y={160} w={120}>
        <div style={card({ borderRadius: "14px 14px 14px 4px", padding: "8px 9px" })}>
          <div style={{ fontSize: 10, fontWeight: 700, lineHeight: 1.3 }}>Here's what your chart shows ✨</div>
          <div style={{ height: 4, width: "92%", borderRadius: 2, background: "rgba(230,180,90,0.32)", marginTop: 7 }} />
          <div style={{ height: 4, width: "64%", borderRadius: 2, background: "rgba(230,180,90,0.32)", marginTop: 5 }} />
        </div>
      </Pop>
      <Pop at={57.5} out={66.9} x={352} y={238} w={120}>
        <div
          style={card({
            height: 28,
            borderRadius: 14,
            border: `1px solid ${C.gold}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
          })}
        >
          <span style={{ fontSize: 11 }}>🔱</span>
          <span style={{ fontSize: 10, fontWeight: 800, color: C.gold }}>View Remedy</span>
        </div>
      </Pop>
      <Pop at={61.0} out={66.9} x={352} y={276} w={120}>
        <div
          style={card({
            height: 30,
            borderRadius: 15,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 5px 0 10px",
          })}
        >
          <span style={{ fontSize: 9, fontWeight: 700, color: C.muted }}>Was this helpful?</span>
          <span
            style={{
              width: 21,
              height: 21,
              borderRadius: 11,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              background: t >= 61.7 ? `linear-gradient(135deg, ${C.gold}, ${C.goldDeep})` : "rgba(255,255,255,0.08)",
              transform: `scale(${t >= 61.7 ? interpolate(thumb, [0, 1], [0.7, 1]) : 1})`,
            }}
          >
            👍
          </span>
        </div>
      </Pop>
    </>
  );
};

/* ---------- beats 6-7: life areas, topic clips, quick prompts ---------- */

const CATS: { ic: string; lb: string; side: "L" | "R"; row: number }[] = [
  { ic: "✨", lb: "GENERAL", side: "L", row: 0 },
  { ic: "❤️", lb: "LOVE", side: "L", row: 1 },
  { ic: "🌿", lb: "HEALTH", side: "L", row: 2 },
  { ic: "💼", lb: "CAREER", side: "L", row: 3 },
  { ic: "💰", lb: "WEALTH", side: "R", row: 0 },
  { ic: "🎓", lb: "EDUCATION", side: "R", row: 1 },
  { ic: "🏡", lb: "FAMILY", side: "R", row: 2 },
  { ic: "✈️", lb: "TRAVEL", side: "R", row: 3 },
];
const HIGHLIGHT: Record<string, [number, number][]> = {
  HEALTH: [[76.45, 77.35], [87.8, 89.95]],
  LOVE: [[90.2, 104.65]],
};

const CategoryTiles: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const A = t >= 70.45 && t <= 77.4;
  const B = t >= 86.25 && t <= 104.7;
  if (!A && !B) return null;
  return (
    <>
      {CATS.map((c, i) => {
        const at = A ? 70.5 + i * 0.14 : 86.3 + i * 0.05;
        const out = A ? 77.35 : c.lb === "LOVE" ? 104.6 : 91.4;
        const hl = (HIGHLIGHT[c.lb] || []).find(([a, b]) => t >= a && t <= b);
        const hp = hl ? interpolate(t, [hl[0], hl[0] + 0.25], [0, 1], clamp) : 0;
        const left = c.side === "L";
        return (
          <Pop key={c.lb + (A ? "a" : "b")} at={at} out={out} x={left ? 4 : 354} y={96 + c.row * 56} w={left ? 88 : 118}>
            <div
              style={card({
                height: 46,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "0 7px",
                position: "relative",
                border: `1px solid ${hp > 0 ? C.gold : C.goldLine}`,
                background: hp > 0 ? "rgba(60,42,14,0.92)" : C.card,
                boxShadow: `0 8px 22px rgba(0,0,0,0.45), 0 0 ${hp * 18}px rgba(230,180,90,${hp * 0.6})`,
                transform: `scale(${1 + hp * 0.06})`,
              })}
            >
              <span style={{ fontSize: 15 }}>{c.ic}</span>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: 1,
                  whiteSpace: "nowrap",
                  color: hp > 0 ? C.gold : C.cream,
                }}
              >
                {c.lb}
              </span>
              {hl && <Ripple at={hl[0]} size={50} />}
            </div>
          </Pop>
        );
      })}
    </>
  );
};

const TOPICS = [
  { ic: "🌿", lb: "HEALTH & WELLNESS", a: 77.4, b: 79.25 },
  { ic: "❤️", lb: "LOVE & MARRIAGE", a: 79.25, b: 80.55 },
  { ic: "💼", lb: "CAREER", a: 80.55, b: 83.05 },
];

const TopHeadings: React.FC = () => (
  <>
    {[
      [70.5, 77.3],
      [86.3, 91.3],
    ].map(([a, b]) => (
      <TopPill key={a} at={a} out={b} w={250}>
        <span style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 700 }}>Where Does Your Light Fall?</span>
      </TopPill>
    ))}
    {TOPICS.map((p) => (
      <TopPill key={p.lb} at={p.a} out={p.b} w={204} fo={0.14}>
        <span style={{ fontSize: 14 }}>{p.ic}</span>
        <span style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: 1.2 }}>{p.lb}</span>
      </TopPill>
    ))}
    <TopPill at={91.6} out={104.3} w={170}>
      <span style={{ color: C.gold, fontSize: 13 }}>✦</span>
      <span style={{ fontSize: 13.5, fontWeight: 800 }}>Quick prompts</span>
    </TopPill>
  </>
);

// The app's own quick prompts, one each for marriage (7th house), health and career
const PROMPTS = [
  { text: "What does the Moon and Mars combo in my 7th house mean?", at: 93.3, y: 88 },
  { text: "How does the current Saturn Transit affect my health?", at: 95.3, y: 166 },
  { text: "Which career path aligns with my Kundali's sun sign?", at: 97.3, y: 244 },
];

const PromptChips: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < 93.2 || t > 104.7) return null;
  const glow = interpolate(t, [98.45, 98.8, 99.9, 100.3], [0, 1, 1, 0], clamp);
  const sent = interpolate(t, [100.85, 101.15], [0, 1], clamp);
  return (
    <>
      {PROMPTS.map((p, i) => {
        const first = i === 0;
        const s = first ? sent : 0;
        return (
          <Pop key={i} at={p.at} out={first ? 104.6 : 101.1} x={352} y={p.y} w={120} fo={first ? 0.5 : 0.35}>
            <div
              style={card({
                position: "relative",
                overflow: "hidden",
                padding: "8px 9px",
                borderRadius: first && s > 0 ? "14px 14px 4px 14px" : 14,
                border: `1px solid ${glow > 0 ? C.gold : C.goldLine}`,
                boxShadow: `0 8px 22px rgba(0,0,0,0.45), 0 0 ${glow * 16}px rgba(230,180,90,${glow * 0.55})`,
              })}
            >
              {s > 0 && (
                <AbsoluteFill
                  style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldDeep})`, opacity: s }}
                />
              )}
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  gap: 5,
                  fontSize: 9.8,
                  fontWeight: 600,
                  lineHeight: 1.28,
                  color: interpolateColors(s, [0, 1], [C.cream, C.ink]),
                }}
              >
                <span style={{ color: s > 0.5 ? C.ink : C.gold }}>✦</span>
                <span>{p.text}</span>
              </div>
              {first && s > 0.5 && (
                <div style={{ position: "relative", marginTop: 5, fontSize: 8, fontWeight: 800, color: C.ink }}>
                  ✓ Asked
                </div>
              )}
              {first && <Ripple at={100.5} size={60} />}
            </div>
          </Pop>
        );
      })}
      <Pop at={101.7} out={104.6} x={352} y={178} w={80} fo={0.5}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              overflow: "hidden",
              position: "relative",
              border: `1px solid ${C.gold}`,
              background: "#f3e9d8",
              flexShrink: 0,
            }}
          >
            <Img src={staticFile(`${P}pandit.png`)} style={{ position: "absolute", width: 80, maxWidth: "none", left: -29, top: -1 }} />
          </div>
          <div
            style={card({
              height: 24,
              width: 48,
              borderRadius: "12px 12px 12px 4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            })}
          >
            {[0, 1, 2].map((k) => (
              <span
                key={k}
                style={{ width: 4.5, height: 4.5, borderRadius: 3, background: C.gold, opacity: dotPulse(frame, k) }}
              />
            ))}
          </div>
        </div>
      </Pop>
    </>
  );
};

const Cta: React.FC = () => (
  <Pop at={104.95} out={110.6} x={354} y={104} w={118} fo={0.6}>
    <div style={card({ padding: "10px 8px", textAlign: "center" })}>
      <div style={{ display: "flex", justifyContent: "center", filter: "drop-shadow(0 0 8px rgba(255,150,40,0.8))" }}>
        <FlameIcon size={24} id="cta" />
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 700, color: C.gold, lineHeight: 1.2, marginTop: 4 }}>
        Your first question is free
      </div>
      <div style={{ fontSize: 8.5, color: C.muted, marginTop: 5 }}>+1 Flame on sign-up</div>
    </div>
  </Pop>
);

/* ---------- v1 elements, unchanged ---------- */

// Same placement, fades and drift as the v1 ffmpeg overlay (14.3-19.3s)
const PLANETS = [
  { src: "saturn_m.png", size: 156, a: 14.5, b: 18.6, x: (t: number) => -36 + 4 * Math.sin((t - 14.3) * 0.9), y: (t: number) => 3 * Math.sin((t - 14.3) * 0.7) },
  { src: "jupiter_m.png", size: 166, a: 14.3, b: 18.7, x: (t: number) => 308 - 3 * Math.sin((t - 14.3) * 0.8), y: (t: number) => -20 + 4 * Math.sin((t - 14.3) * 0.6 + 1) },
  { src: "moon_m.png", size: 130, a: 14.7, b: 18.8, x: (t: number) => 174 + 3 * Math.sin((t - 14.3) * 0.7), y: (t: number) => -36 + 3 * Math.sin((t - 14.3) * 0.9 + 2) },
  { src: "mars_m.png", size: 116, a: 15.0, b: 18.5, x: (t: number) => 368 + 2 * Math.sin((t - 14.3) * 1.0), y: (t: number) => 92 + 3 * Math.sin((t - 14.3) * 0.8) },
];

const Planets: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  if (t < 14.3 || t > 19.3) return null;
  return (
    <>
      {PLANETS.map((p) => (
        <Img
          key={p.src}
          src={staticFile(`${P}planets/${p.src}`)}
          style={{
            position: "absolute",
            left: Math.round(p.x(t)),
            top: Math.round(p.y(t)),
            width: p.size,
            height: p.size,
            opacity: Math.min(
              interpolate(t, [p.a, p.a + 0.5], [0, 1], clamp),
              interpolate(t, [p.b, p.b + 0.6], [1, 0], clamp)
            ),
          }}
        />
      ))}
    </>
  );
};

const CaptionScrim: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 300,
      background:
        "linear-gradient(to top, rgba(10,6,24,0.55) 0%, rgba(10,6,24,0.22) 45%, rgba(10,6,24,0) 100%)",
    }}
  />
);

const Watermark: React.FC = () => {
  const frame = useCurrentFrame();
  const wm =
    interpolate(frame, [12, 36], [0, 0.72], clamp) *
    interpolate(frame, [V2_FRAMES - 20, V2_FRAMES - 2], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        right: 14,
        opacity: wm,
        filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))",
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: 14,
          background: "linear-gradient(145deg, rgba(26,16,52,0.82), rgba(12,8,28,0.82))",
          border: `1px solid ${C.gold}66`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Img src={staticFile("jyotiq/logo-icon.png")} style={{ width: 38, height: "auto" }} />
      </div>
    </div>
  );
};

/* ---------- composition ---------- */

const SPEAKER_FROM = 136; // source cut from the title card to her (4.533s)

// The source's own silent question cards and its logo outro play exactly as shot (frame-exact cuts).
const INSERTS: [number, number][] = [
  [1011, 1101], // "What kind of questions can you ask JYOTIQ?"   33.70-36.70
  [2019, 2109], // "What areas of life can you explore on JYOTIQ?" 67.30-70.30
  [3346, V2_FRAMES], // circuit-brain + diya logo outro          111.53-end
];

const InsertClip: React.FC<{ from: number }> = ({ from }) => {
  const lf = useCurrentFrame(); // local to the Sequence
  return (
    <AbsoluteFill style={{ opacity: interpolate(lf, [0, 6], [0, 1], clamp) }}>
      <OffthreadVideo src={staticFile(`${P}source.mp4`)} muted trimBefore={from} />
    </AbsoluteFill>
  );
};

const SourceInserts: React.FC = () => (
  <>
    {INSERTS.map(([a, b]) => (
      <Sequence key={a} from={a} durationInFrames={b - a} name="source insert (untouched)">
        <InsertClip from={a} />
      </Sequence>
    ))}
  </>
);

// 8-frame dip to black into each insert (she is silent there; the cards open on black),
// 6-frame rise back out of the two cards. Sits under the inserts.
const Dips: React.FC = () => {
  const frame = useCurrentFrame();
  const o = Math.max(
    ...INSERTS.map(([a, b]) =>
      Math.min(
        interpolate(frame, [a - 8, a], [0, 1], clamp),
        interpolate(frame, [b, b + 6], [1, 0], clamp)
      )
    )
  );
  if (o <= 0.001) return null;
  return <AbsoluteFill style={{ background: "#000", opacity: o }} />;
};

// Three V1 caption lines ran across the silent cards/outro ("app They", "my real life They",
// "try for one"). End each where she stops and carry the trailing "They" onto the next line.
type Chunk = (typeof CAPTIONS)[number];
const CAPTIONS_V2: Chunk[] = (() => {
  const out: Chunk[] = CAPTIONS.map((c) => ({ ...c }));
  const split = (start: number, end: number, resume: number | null) => {
    const i = out.findIndex((c) => Math.abs(c.start - start) < 0.02);
    if (i < 0) return;
    const words = out[i].text.split(" ");
    if (resume !== null && i + 1 < out.length) {
      const tail = words.pop();
      out[i + 1] = { ...out[i + 1], text: `${tail} ${out[i + 1].text}`, start: resume };
    }
    out[i] = { ...out[i], text: words.join(" "), end };
  };
  split(32.63, 33.05, 36.7);
  split(65.45, 66.55, 70.35);
  split(109.21, 110.35, null);
  return out;
})();

// The source's burned-in "Health / Wellness / Career / Marriage" sticker (77.77-83.17s, y 487-751)
// sits exactly where the captions do, and below it is Instagram's UI zone. Lift those lines to just
// above the sticker, under her chin, for the four chunks it overlaps.
const STICKER: [number, number] = [77.7, 83.2];
const CaptionV2: React.FC<{ chunk: Chunk }> = ({ chunk }) =>
  chunk.end > STICKER[0] && chunk.start < STICKER[1] ? (
    <AbsoluteFill style={{ transform: "translateY(-240px)" }}>
      <Caption chunk={chunk} />
    </AbsoluteFill>
  ) : (
    <Caption chunk={chunk} />
  );

export const JyotiqTestimonialV2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Audio src={staticFile(`${P}source.mp4`)} />
    <Sequence durationInFrames={f(6.6)} name="original video (title card, first second)">
      <OffthreadVideo src={staticFile(`${P}source.mp4`)} muted />
    </Sequence>
    <NightSet />

    {/* footage behind her, framed so subjects sit beside her head */}
    <Footage src="argue" at={21.4} dur={3.9} h={560} left={-194} grade="stress" fi={0.45} />
    <Footage src="stress" at={24.95} dur={2.85} h={440} left={-20} grade="stress" fi={0.3} fo={0.5} />
    <Footage src="remedy" at={28.4} dur={3.2} h={600} left={-293} grade="warm" fo={0.5} />
    <Footage src="typing" at={53.2} dur={7.1} h={440} left={-341} grade="soft" />
    <Footage src="smile" at={59.85} dur={7.05} h={640} left={-655} grade="soft" fi={0.45} fo={0.5} />
    <Footage src="health1" at={77.2} dur={2.15} h={560} left={-229} fi={0.25} fo={0.25} />
    <Footage src="marriageA" at={79.1} dur={1.55} h={420} left={-140} fi={0.25} fo={0.25} />
    <Footage src="career" at={80.4} dur={3.0} h={440} left={-151} fi={0.25} fo={0.45} />
    <Footage src="health2" at={87.3} dur={2.7} h={560} left={-279} grade="soft" fo={0.3} />
    <Footage src="marriageB" at={89.7} dur={2.0} h={420} left={-140} grade="soft" fi={0.3} fo={0.5} />

    {/* app motion graphics behind her */}
    <Kundali />
    <PhoneBeat />
    <RemedyMedallions />
    <FeatureChips />
    <Embers />
    <FlameCards />
    <ChatBeat />
    <CategoryTiles />
    <TopHeadings />
    <PromptChips />
    <Cta />

    {/* speaker in front */}
    <Sequence from={SPEAKER_FROM} durationInFrames={INSERTS[2][0] - SPEAKER_FROM} name="speaker cut-out">
      <OffthreadVideo
        src={staticFile(`${P}speaker_rgba.mov`)}
        transparent
        muted
        trimBefore={SPEAKER_FROM}
      />
    </Sequence>

    <Planets />
    <CaptionScrim />

    {/* the source's own cards + outro, on top of everything except captions and watermark */}
    <Dips />
    <SourceInserts />

    {CAPTIONS_V2.map((c, i) => (
      <CaptionV2 key={i} chunk={c} />
    ))}
    <Watermark />
  </AbsoluteFill>
);

/* ---------- review sheet: 20 beat frames at half size, render frame 0 with `remotion still` ---------- */

const REVIEW = [
  231, 465, 690, 780, 900, 975, 1005, 1035, 1107, 1320,
  1620, 1890, 2055, 2175, 2346, 2445, 2658, 3000, 3210, 3360,
];

export const JyotiqTestimonialV2Sheet: React.FC = () => (
  <AbsoluteFill style={{ background: "#111", display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
    {REVIEW.map((fr) => (
      <div key={fr} style={{ width: 240, height: 432, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 480, height: 864, transform: "scale(0.5)", transformOrigin: "0 0" }}>
          <Freeze frame={fr}>
            <JyotiqTestimonialV2 />
          </Freeze>
        </div>
        <div
          style={{
            position: "absolute",
            left: 4,
            top: 4,
            background: "rgba(0,0,0,0.65)",
            color: "#fff",
            font: "bold 12px sans-serif",
            padding: "1px 5px",
          }}
        >
          {(fr / FPS).toFixed(1)}s
        </div>
      </div>
    ))}
  </AbsoluteFill>
);
