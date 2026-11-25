import React from "react";
import { SANS } from "../theme";
import { BAND, C, CORMORANT, H, W, ramp, rnd, sparkle } from "./style";

/* On-screen type and overlays for the katha Reel, in the same parchment
   language as the caption card: hook banner, speech bubbles, narration card,
   question chips, petals, whip streaks, the scroll roller, CTA parts. */

const INK = "#3A1D12";
const PAPER = "#FFF8E8";

/** Envelope: 0 before `from`, pops to 1 over `inF`, fades out over `outF` before `to`. */
export const env = (f: number, from: number, to: number, inF = 7, outF = 6): number =>
  Math.min(ramp(f, from, from + inF, "out"), 1 - ramp(f, to - outF, to, "in"));

/* ------------------------------------------------------------------ */
/* Hook banner: an unfurled scroll across the top of the picture       */
/* ------------------------------------------------------------------ */

export const HookBanner: React.FC<{ f: number; lines: string[]; out: number }> = ({ f, lines, out }) => {
  // fully readable on frame 0 (the Reel's cover / first impression), then breathes
  const open = 0.9 + 0.1 * ramp(f, 0, 6, "out");
  const w = 600 + 340 * open;
  const pulse = 1 + 0.015 * Math.sin(f / 4);
  return (
    <div
      style={{
        position: "absolute",
        left: 540 - w / 2,
        top: 318,
        width: w,
        height: 250,
        opacity: 1 - out,
        transform: `translateY(${-60 * out}px) scale(${pulse})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "10px 22px",
          background: "linear-gradient(180deg, #FFF6DC 0%, #F6E6C0 100%)",
          border: `4px solid ${C.paperEdge}`,
          boxShadow: "0 14px 30px rgba(40,10,0,0.45)",
          borderRadius: 6,
        }}
      />
      <div style={{ position: "absolute", inset: "24px 36px", border: "2px solid #B3262B", borderRadius: 3 }} />
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            [i ? "right" : "left"]: 0,
            width: 30,
            height: 250,
            borderRadius: 15,
            background: "linear-gradient(90deg, #6E4520, #A8743C 45%, #6E4520)",
            boxShadow: "0 8px 16px rgba(0,0,0,0.35)",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: "28px 50px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: CORMORANT,
          fontWeight: 700,
          color: INK,
          textAlign: "center",
          lineHeight: 1.04,
        }}
      >
        {lines.map((l, i) => (
          <div key={i} style={{ fontSize: i === 0 ? 74 : 62, whiteSpace: "nowrap" }}>
            {l.split(/(WAR)/).map((part, j) =>
              part === "WAR" ? (
                <span key={j} style={{ color: "#B3171E", fontSize: 92, letterSpacing: 2 }}>
                  {part}
                </span>
              ) : (
                <span key={j}>{part}</span>
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Speech bubbles                                                      */
/* ------------------------------------------------------------------ */

/** Parchment speech bubble; (x, y) is the tail tip at the speaker's mouth. */
export const Bubble: React.FC<{ x: number; y: number; text: string; vis: number; dx: number; lift?: number; size?: number }> = ({
  x,
  y,
  text,
  vis,
  dx,
  lift = 150,
  size = 50,
}) => {
  if (vis <= 0.001) return null;
  const bx = x + dx;
  const by = y - lift;
  const tailX = x + dx * 0.3;
  const s = 0.55 + 0.45 * Math.min(1, vis * 1.15);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, opacity: Math.min(1, vis * 1.6), transformOrigin: `${x}px ${y}px`, transform: `scale(${s})` }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path d={`M${tailX - 22} ${by - 4}L${x} ${y}L${tailX + 22} ${by - 4}Z`} fill={PAPER} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      </svg>
      <div
        style={{
          position: "absolute",
          left: bx,
          top: by,
          transform: "translate(-50%, -100%)",
          background: PAPER,
          border: `4px solid ${INK}`,
          borderRadius: 30,
          padding: "14px 30px 18px",
          fontFamily: CORMORANT,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.08,
          color: INK,
          textAlign: "center",
          whiteSpace: "pre",
          boxShadow: "0 10px 20px rgba(40,10,0,0.35)",
        }}
      >
        {text}
      </div>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path d={`M${tailX - 18} ${by - 6}L${tailX + 18} ${by - 6}`} stroke={PAPER} strokeWidth={8} />
      </svg>
    </div>
  );
};

/** Jagged shout burst; (x, y) is the spike tip at the shouter's mouth. */
export const Shout: React.FC<{ x: number; y: number; cx: number; cy: number; rx: number; ry: number; text: string; vis: number; f: number }> = ({
  x,
  y,
  cx,
  cy,
  rx,
  ry,
  text,
  vis,
  f,
}) => {
  if (vis <= 0.001) return null;
  const n = 22;
  const pts = new Array(n * 2).fill(0).map((_, i) => {
    const a = (i / (n * 2)) * Math.PI * 2;
    const k = i % 2 === 0 ? 1 : 0.8 + 0.06 * Math.sin(i * 3.1);
    return `${cx + Math.cos(a) * rx * k} ${cy + Math.sin(a) * ry * k}`;
  });
  const jit = Math.sin(f * 2.3) * 3;
  const s = 0.5 + 0.5 * Math.min(1, vis * 1.2);
  // spike from the burst edge toward the mouth
  const ang = Math.atan2(y - cy, x - cx);
  const ex = cx + Math.cos(ang) * rx * 0.78;
  const ey = cy + Math.sin(ang) * ry * 0.78;
  const nx = -Math.sin(ang) * 26;
  const ny = Math.cos(ang) * 26;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, vis * 1.6), transformOrigin: `${cx}px ${cy}px`, transform: `translate(${jit}px, ${-jit}px) scale(${s}) rotate(-3deg)` }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path d={`M${ex + nx} ${ey + ny}L${x} ${y}L${ex - nx} ${ey - ny}Z`} fill="#FFF1B8" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <path d={`M${pts.join("L")}Z`} fill="#FFF1B8" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <path d={`M${ex + nx * 0.7} ${ey + ny * 0.7}L${ex - nx * 0.7} ${ey - ny * 0.7}`} stroke="#FFF1B8" strokeWidth={10} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: cx - rx,
          top: cy - ry,
          width: rx * 2,
          height: ry * 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontFamily: CORMORANT,
          fontWeight: 700,
          fontSize: 66,
          lineHeight: 0.98,
          letterSpacing: 1,
          color: "#B3171E",
          textShadow: "0 3px 0 rgba(58,29,18,0.25)",
          whiteSpace: "pre",
        }}
      >
        {text}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Narration card (bottom), shown only while a cue is live             */
/* ------------------------------------------------------------------ */

export type NCue = { from: number; to: number; text: string };

export const Narration: React.FC<{ f: number; cues: NCue[] }> = ({ f, cues }) => {
  const active = cues.filter((c) => f >= c.from - 1 && f < c.to);
  if (!active.length) return null;
  const c = active[0];
  const pop = ramp(f, c.from, c.from + 9, "back");
  const out = ramp(f, c.to - 6, c.to, "in");
  return (
    <div
      style={{
        position: "absolute",
        left: 140,
        top: 1500,
        width: 800,
        height: 162,
        opacity: ramp(f, c.from, c.from + 5) * (1 - out),
        transform: `translateY(${(1 - pop) * 26}px) scale(${0.94 + 0.06 * pop})`,
        transformOrigin: "50% 100%",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: C.paper, borderRadius: 16, boxShadow: "0 10px 22px rgba(58,22,7,0.38)" }} />
      <div style={{ position: "absolute", inset: 9, border: `2.5px solid ${C.paperEdge}`, borderRadius: 10 }} />
      <div style={{ position: "absolute", inset: 15, border: `1px solid ${C.paperEdge}`, borderRadius: 7, opacity: 0.75 }} />
      {[1, 781].map((x) => (
        <div key={x} style={{ position: "absolute", left: x, top: 72, width: 18, height: 18, background: C.paperEdge, transform: "rotate(45deg)" }} />
      ))}
      <div
        style={{
          position: "absolute",
          inset: "0 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          whiteSpace: "pre-line",
          fontFamily: CORMORANT,
          fontWeight: 700,
          fontSize: 47,
          lineHeight: 1.14,
          color: C.text,
          opacity: ramp(f, c.from + 2, c.from + 9),
        }}
      >
        {c.text}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Question chip                                                       */
/* ------------------------------------------------------------------ */

export const Chip: React.FC<{ x: number; y: number; text: string; pop: number; out: number; f: number; seed: number }> = ({ x, y, text, pop, out, f, seed }) => {
  if (pop <= 0.001 || out >= 0.999) return null;
  const s = (0.4 + 0.6 * pop) * (1 - 0.3 * out);
  const fy = Math.sin(f / 14 + seed * 2) * 6 - out * 40;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + fy,
        transform: `translate(-50%, -50%) scale(${s}) rotate(${(seed - 1) * 2.5}deg)`,
        opacity: Math.min(1, pop * 1.5) * (1 - out),
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 30px 16px 16px",
        borderRadius: 999,
        background: PAPER,
        border: "3.5px solid #8E2420",
        boxShadow: "0 10px 22px rgba(10,5,30,0.45)",
        fontFamily: CORMORANT,
        fontWeight: 700,
        fontSize: 44,
        color: INK,
        whiteSpace: "nowrap",
      }}
    >
      <div style={{ width: 52, height: 52, borderRadius: 26, background: "#B3171E", color: "#FFF1C8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, lineHeight: 1 }}>
        ?
      </div>
      {text}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Screen-space SVG effects                                            */
/* ------------------------------------------------------------------ */

const inner = { clipPath: `inset(${BAND}px)` } as const;

/** Marigold petals raining over the picture from frame `from`. */
export const Petals: React.FC<{ f: number; from: number; n?: number }> = ({ f, from, n = 46 }) => {
  if (f < from) return null;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, ...inner }}>
      {new Array(n).fill(0).map((_, i) => {
        const born = from + rnd(`pb${i}`) * 34;
        const age = f - born;
        if (age < 0) return null;
        const x = 60 + rnd(`px${i}`) * 960 + Math.sin(age / 9 + i) * 26;
        const y = -30 + age * (13 + rnd(`pv${i}`) * 9);
        if (y > H + 40) return null;
        return (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx={8}
            ry={13}
            transform={`rotate(${age * (6 + rnd(`pr${i}`) * 8) + i * 40} ${x} ${y})`}
            fill={i % 3 === 0 ? C.marigoldY : i % 3 === 1 ? C.marigold : "#E2552B"}
            stroke="#B5480C"
            strokeWidth={1}
          />
        );
      })}
    </svg>
  );
};

/** Horizontal speed streaks for a whip pan. */
export const Streaks: React.FC<{ f: number; amount: number }> = ({ f, amount }) => {
  if (amount <= 0.01) return null;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: amount, ...inner }}>
      {new Array(18).fill(0).map((_, i) => {
        const y = 80 + rnd(`wy${i}`) * 1760;
        const len = 300 + rnd(`wl${i}`) * 700;
        const x = ((rnd(`wx${i}`) * 1600 + f * 140) % 1900) - 500;
        return <rect key={i} x={x} y={y} width={len} height={3 + rnd(`wh${i}`) * 7} rx={4} fill="#FFF6E0" opacity={0.35 + rnd(`wo${i}`) * 0.5} />;
      })}
    </svg>
  );
};

/** The paper roller riding the edge of a scene that rolls up. */
export const Roller: React.FC<{ y: number }> = ({ y }) => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
    <defs>
      <linearGradient id="kRoll" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#C9AE74" />
        <stop offset="0.45" stopColor="#F8EBCB" />
        <stop offset="1" stopColor="#B89A5E" />
      </linearGradient>
    </defs>
    <rect x={BAND - 6} y={y - 6} width={W - 2 * BAND + 12} height={30} rx={10} fill="rgba(0,0,0,0.3)" />
    <rect x={BAND - 6} y={y - 24} width={W - 2 * BAND + 12} height={44} rx={22} fill="url(#kRoll)" stroke="#8A6A34" strokeWidth={2} />
    {[BAND - 10, W - BAND + 10].map((x) => (
      <circle key={x} cx={x} cy={y - 2} r={20} fill={C.gold} stroke={C.goldDark} strokeWidth={3} />
    ))}
  </svg>
);

/** "DAY n" tag; flips in when the number changes. */
export const DayTag: React.FC<{ n: number; flip: number; vis: number }> = ({ n, flip, vis }) => (
  <div
    style={{
      position: "absolute",
      left: 540,
      top: 470,
      transform: `translate(-50%, -50%) scale(${(0.7 + 0.3 * flip) * (0.6 + 0.4 * vis)}) rotateX(${(1 - flip) * 70}deg)`,
      opacity: vis,
      padding: "10px 44px 14px",
      background: PAPER,
      border: "4px solid #8E2420",
      borderRadius: 14,
      boxShadow: "0 12px 24px rgba(0,0,0,0.4)",
      fontFamily: CORMORANT,
      fontWeight: 700,
      fontSize: 72,
      color: "#8E2420",
      letterSpacing: 4,
    }}
  >
    DAY {n}
  </div>
);

/** Full-frame gold-white flash. */
export const Flash: React.FC<{ o: number }> = ({ o }) =>
  o > 0.01 ? (
    <div style={{ position: "absolute", inset: 0, opacity: o, background: "radial-gradient(circle at 50% 50%, #FFFFFF 0%, #FFF1C2 45%, #F6C75A 100%)" }} />
  ) : null;

/* ------------------------------------------------------------------ */
/* CTA parts                                                           */
/* ------------------------------------------------------------------ */

export const PlayButton: React.FC<{ glow: number }> = ({ glow }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 22,
      padding: "20px 50px 20px 36px",
      borderRadius: 26,
      background: "#0A0907",
      border: `3px solid ${C.gold}`,
      boxShadow: `0 16px 36px rgba(0,0,0,0.55), 0 0 ${46 * glow}px rgba(246,199,90,${0.75 * glow})`,
    }}
  >
    <svg viewBox="0 0 24 26" width={64} height={70}>
      <defs>
        <linearGradient id="kGp" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#DFB15B" />
          <stop offset="1" stopColor="#FE9A00" />
        </linearGradient>
      </defs>
      <path d="M2 1.5v23l20-11.5z" fill="url(#kGp)" />
    </svg>
    <div style={{ fontFamily: SANS, color: "#F5ECDD", lineHeight: 1.05 }}>
      <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: 2, opacity: 0.85 }}>GET IT ON</div>
      <div style={{ fontSize: 52, fontWeight: 800 }}>Google Play</div>
    </div>
  </div>
);

/**
 * iOS twin of PlayButton: same box, gold border, glow and type scale, with Apple's own badge
 * wording ("Download on the / App Store"). Apple glyph: Simple Icons "apple" path (CC0 data).
 */
export const AppStoreButton: React.FC<{ glow: number }> = ({ glow }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 20,
      padding: "20px 50px 20px 34px",
      borderRadius: 26,
      background: "#0A0907",
      border: `3px solid ${C.gold}`,
      boxShadow: `0 16px 36px rgba(0,0,0,0.55), 0 0 ${46 * glow}px rgba(246,199,90,${0.75 * glow})`,
    }}
  >
    <svg viewBox="0 0 24 24" width={60} height={70}>
      <defs>
        <linearGradient id="kAs" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#DFB15B" />
          <stop offset="1" stopColor="#FE9A00" />
        </linearGradient>
      </defs>
      <path
        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
        fill="url(#kAs)"
      />
    </svg>
    <div style={{ fontFamily: SANS, color: "#F5ECDD", lineHeight: 1.05 }}>
      <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: 0.5, opacity: 0.85 }}>Download on the</div>
      <div style={{ fontSize: 52, fontWeight: 800 }}>App Store</div>
    </div>
  </div>
);

export const FreeRibbon: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "relative", padding: "12px 70px 16px", fontFamily: CORMORANT, fontWeight: 700, fontSize: 50, color: "#FFE7A8", whiteSpace: "nowrap" }}>
    <svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <path d="M-6 3L6 3L6 17L-6 17L-2 10Z" fill="#7E151B" />
      <path d="M106 3L94 3L94 17L106 17L102 10Z" fill="#7E151B" />
      <rect x={3} y={0} width={94} height={20} fill="#B3171E" stroke={C.gold} strokeWidth={0.6} vectorEffect="non-scaling-stroke" />
    </svg>
    <span style={{ position: "relative" }}>{text}</span>
  </div>
);

/** A little hand-drawn arrow pointing down-left (toward the Reel's username / bio). */
export const BioArrow: React.FC<{ draw: number }> = ({ draw }) => (
  <svg width={150} height={120} viewBox="0 0 150 120" style={{ overflow: "visible" }}>
    <path d="M140 8C120 60 80 90 24 100" fill="none" stroke="#F6D78A" strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
    {draw > 0.95 ? <path d="M44 82L22 101L50 112" fill="none" stroke="#F6D78A" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" /> : null}
  </svg>
);

export const SparkBurst: React.FC<{ x: number; y: number; t: number; n?: number; r?: number }> = ({ x, y, t, n = 10, r = 110 }) => {
  if (t <= 0 || t >= 1) return null;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
      <g opacity={1 - t}>
        <circle cx={x} cy={y} r={16 + t * r * 0.7} fill="none" stroke="#FFE39A" strokeWidth={4 * (1 - t) + 1} />
        {new Array(n).fill(0).map((_, i) => {
          const a = (i / n) * Math.PI * 2 + 0.3;
          const d = 24 + t * r;
          return <path key={i} d={sparkle(11 - t * 5)} transform={`translate(${x + Math.cos(a) * d} ${y + Math.sin(a) * d})`} fill="#FFF3C4" />;
        })}
      </g>
    </svg>
  );
};
