import React from "react";
import { Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { loadFont as loadKhand } from "@remotion/google-fonts/Khand";
import { loadFont as loadMukta } from "@remotion/google-fonts/Mukta";
import { H, ramp, W } from "../../manthan/style";
import { LINES } from "./timing";

/* Day 3 story reel: editing vocabulary. Times passed in are frames unless named otherwise. */

export const KHAND = loadKhand("normal", { weights: ["600", "700"], subsets: ["devanagari", "latin"] }).fontFamily;
export const MUKTA = loadMukta("normal", { weights: ["500", "700", "800"], subsets: ["devanagari", "latin"] }).fontFamily;

export const CREAM = "#F7ECD8";
export const EMBER = "#FF7A45";
export const GOLD = "#FFC94D";
export const LEAF = "#7FD48A";
const SHADOW = "0 4px 26px rgba(0,0,0,0.85), 0 2px 4px rgba(0,0,0,0.6)";

const fr = (s: number) => Math.round(s * 30);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export type In = "cut" | "whipL" | "whipR" | "whipU" | "dissolve" | "slow" | "focus";
export type ShotDef = {
  t: number; // start, seconds
  src: string;
  clip?: number; // clip length in seconds when this shot is a video
  skip?: number; // seconds of the clip to skip
  from?: [number, number, number]; // scale, x, y at the start
  to?: [number, number, number];
  in?: In;
  dim?: number; // 0..1 darkening
};

export const Shot: React.FC<{ f: number; def: ShotDef; end: number }> = ({ f, def, end }) => {
  const start = fr(def.t);
  const dur = Math.max(1, end - start);
  const t = f - start;
  const p = Math.min(1, Math.max(0, t / dur));
  const a = def.from ?? [1.02, 0, 0];
  const b = def.to ?? [1.1, 0, 0];
  const s = lerp(a[0], b[0], p);
  const x = lerp(a[1], b[1], p);
  const y = lerp(a[2], b[2], p);
  const kind = def.in ?? "cut";
  const whip = ramp(t, 0, 8, "out");
  let tx = 0;
  let ty = 0;
  let blur = 0;
  let op = 1;
  if (kind === "whipL") { tx = (1 - whip) * W; blur = (1 - whip) * 34; }
  if (kind === "whipR") { tx = -(1 - whip) * W; blur = (1 - whip) * 34; }
  if (kind === "whipU") { ty = (1 - whip) * H; blur = (1 - whip) * 34; }
  if (kind === "dissolve") op = ramp(t, 0, 12, "lin");
  if (kind === "slow") op = ramp(t, 0, 26, "io");
  if (kind === "focus") { blur = (1 - ramp(t, 0, 16, "out")) * 22; op = ramp(t, 0, 6, "lin"); }
  const style: React.CSSProperties = { width: W, height: H, objectFit: "cover", display: "block" };
  const rate = def.clip ? Math.min(1, ((def.clip - (def.skip ?? 0)) * 30 - 3) / (dur + 30)) : 1;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: op, transform: `translate(${tx}px, ${ty}px)`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${x}px, ${y}px) scale(${s})`, transformOrigin: "50% 50%" }}>
        {def.clip ? (
          <Sequence from={start} durationInFrames={dur + 30} layout="none">
            <OffthreadVideo src={staticFile(`clips/${def.src}.mp4`)} muted playbackRate={rate} trimBefore={Math.round((def.skip ?? 0) * 30)} style={style} />
          </Sequence>
        ) : (
          <Img src={staticFile(`img/${def.src}.jpg`)} style={style} />
        )}
      </div>
      {def.dim ? <div style={{ position: "absolute", inset: 0, background: `rgba(4,3,8,${def.dim})` }} /> : null}
    </div>
  );
};

/** Warm light burst on a transition. */
export const Flash: React.FC<{ f: number; at: number; color?: string; power?: number; len?: number }> = ({ f, at, color = "255,190,110", power = 1, len = 12 }) => {
  const t = f - at;
  if (t < -3 || t > len) return null;
  const v = t < 0 ? ramp(t, -3, 0, "in") : 1 - ramp(t, 0, len, "out");
  return <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 40%, rgba(255,245,225,${v * power}), rgba(${color},${v * power * 0.85}) 45%, rgba(${color},${v * power * 0.35}) 100%)`, mixBlendMode: "screen" }} />;
};

export const Grade: React.FC<{ f: number; capBand: boolean }> = ({ f, capBand }) => (
  <>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 48%, rgba(3,2,8,0.58) 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 620, background: "linear-gradient(180deg, rgba(4,3,10,0.82) 0%, rgba(4,3,10,0.55) 42%, rgba(4,3,10,0) 100%)" }} />
    {capBand ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 620, background: "linear-gradient(0deg, rgba(4,3,10,0.86) 0%, rgba(4,3,10,0.6) 48%, rgba(4,3,10,0) 100%)" }} /> : null}
    <Img
      src={staticFile("img/grain.png")}
      style={{
        position: "absolute", left: 0, top: 0, width: W + 240, height: H + 240, opacity: 0.1, mixBlendMode: "overlay",
        transform: `translate(${-Math.floor(hash(Math.floor(f / 2)) * 240)}px, ${-Math.floor(hash(Math.floor(f / 2) + 9) * 240)}px)`,
      }}
    />
  </>
);

/** Floating embers, dust or falling rain, always in front of the picture so the frame has depth. */
export const Motes: React.FC<{ f: number; kind: "ember" | "dust" | "rain" | "gold"; n?: number; op?: number }> = ({ f, kind, n = 34, op = 1 }) => {
  if (op <= 0.01) return null;
  const items = Array.from({ length: n }).map((_, i) => {
    const r = hash(i + 3);
    const r2 = hash(i + 91);
    const r3 = hash(i + 201);
    if (kind === "rain") {
      const y = ((r * H + f * (58 + r2 * 22)) % (H + 200)) - 100;
      const x = (r3 * (W + 200) - 100 + f * 5) % W;
      return <line key={i} x1={x} y1={y} x2={x + 7} y2={y + 66} stroke="rgba(190,214,255,0.45)" strokeWidth={2} />;
    }
    const speed = kind === "ember" ? 2.2 + r2 * 3 : kind === "gold" ? 1 + r2 * 1.6 : 0.35 + r2 * 0.6;
    const dir = kind === "gold" ? 1 : -1;
    const raw = r * (H + 120) + dir * f * speed;
    const y = ((raw % (H + 120)) + H + 120) % (H + 120) - 60;
    const x = r3 * W + Math.sin(f / (26 + r * 30) + i) * (kind === "dust" ? 18 : 34);
    const size = kind === "ember" ? 2 + r2 * 4.5 : kind === "gold" ? 2 + r2 * 4 : 1.2 + r2 * 2.6;
    const tw = 0.45 + 0.55 * Math.sin(f / (6 + r3 * 12) + i);
    const color = kind === "ember" ? "255,140,70" : kind === "gold" ? "255,214,120" : "255,234,200";
    return (
      <g key={i}>
        <circle cx={x} cy={y} r={size * 3} fill={`rgba(${color},${0.12 * tw})`} />
        <circle cx={x} cy={y} r={size} fill={`rgba(${color},${0.88 * tw})`} />
      </g>
    );
  });
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: op }}>
      {items}
    </svg>
  );
};

/** Two-colour headline revealed line by line on the words. */
export const Head: React.FC<{
  f: number; at: number; out: number; a: string; b?: string; bAt?: number; c?: string; top?: number; size?: number; sizeB?: number; center?: boolean;
}> = ({ f, at, out, a, b, bAt, c = EMBER, top = 212, size = 122, sizeB, center = false }) => {
  if (f < at - 1 || f > out + 8) return null;
  const exit = ramp(f, out, out + 7, "in");
  const line = (text: string, start: number, color: string, sz: number) => {
    const t = f - start;
    if (t < 0) return null;
    const p = ramp(t, 0, 7, "out");
    const over = 1 + (1 - ramp(t, 0, 10, "out")) * 0.05;
    return (
      <div style={{ overflow: "visible" }}>
        <div
          style={{
            fontFamily: KHAND, fontWeight: 700, fontSize: sz, lineHeight: 1.08, color, textShadow: SHADOW, letterSpacing: 0.5, whiteSpace: "nowrap",
            clipPath: center ? undefined : `inset(-30% ${(1 - p) * 100}% -30% -5%)`, opacity: center ? p : 1,
            transform: `scale(${over})`, transformOrigin: center ? "50% 60%" : "0% 60%",
          }}
        >
          {text}
        </div>
      </div>
    );
  };
  return (
    <div style={{ position: "absolute", left: 56, right: center ? 56 : 30, top, opacity: 1 - exit, transform: `translateY(${exit * -14}px)`, textAlign: center ? "center" : "left" }}>
      {line(a, at, CREAM, size)}
      {b ? line(b, bAt ?? at, c, sizeB ?? size) : null}
    </div>
  );
};

export const Strip: React.FC<{ f: number; label: string; lit: number; litAt?: number; hide: boolean }> = ({ f, label, lit, litAt = 1e9, hide }) => {
  if (hide) return null;
  const flame = ramp(f, litAt, litAt + 14, "out");
  return (
    <div style={{ position: "absolute", left: 56, right: 56, top: 128 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 10, borderBottom: "2px solid rgba(247,236,216,0.34)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
          <div style={{ width: 52, height: 52, borderRadius: 26, background: "#F7ECD8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Img src={staticFile("jyotiq/logo-icon.png")} style={{ width: 42, height: 38, objectFit: "contain" }} />
          </div>
          <span style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: 31, color: GOLD, textShadow: SHADOW }}>Jyotiq</span>
          <span style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 29, color: CREAM, textShadow: SHADOW, whiteSpace: "nowrap" }}>{label}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "4px 14px", borderRadius: 26, background: "rgba(10,7,4,0.62)", border: "1.5px solid rgba(255,201,77,0.65)" }}>
          {[0, 1, 2, 3, 4].map((i) => {
            const v = i < lit ? 1 : i === lit ? flame : 0;
            return <div key={i} style={{ width: 13, height: 17, borderRadius: "50% 50% 50% 50% / 62% 62% 38% 38%", background: v > 0.02 ? `rgba(255,${170 + 40 * v},70,${0.25 + 0.75 * v})` : "rgba(247,236,216,0.22)", boxShadow: v > 0.5 ? "0 0 12px rgba(255,180,70,0.9)" : "none" }} />;
          })}
          <span style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: 25, color: GOLD, marginLeft: 6 }}>दिन 3/5</span>
        </div>
      </div>
    </div>
  );
};

const groups = LINES.flatMap((l) => {
  const out: { s: number; e: number; words: typeof l.words }[] = [];
  let cur: typeof l.words = [];
  const flush = () => {
    if (cur.length) out.push({ s: cur[0].s, e: cur[cur.length - 1].e, words: cur });
    cur = [];
  };
  l.words.forEach((w) => {
    const short = /[।?!]$/.test(w.t) && w.t.length <= 5;
    if (cur.length && cur.map((x) => x.t).join(" ").length + w.t.length > 24 && !short) flush();
    cur.push(w);
    const chars = cur.map((x) => x.t).join(" ").length;
    if (/[।?!]$|\.\.\.$/.test(w.t) ? chars >= 4 : /,$/.test(w.t) && chars >= 9) flush();
  });
  flush();
  return out.map((g, i) => ({ ...g, end: i + 1 < out.length ? out[i + 1].s : l.start + l.dur + 0.15 }));
});

export const Captions: React.FC<{ f: number; hide: boolean }> = ({ f, hide }) => {
  if (hide) return null;
  const sec = f / 30;
  const g = groups.find((x) => sec >= x.s - 0.03 && sec < x.end);
  if (!g) return null;
  const pop = ramp(sec, g.s - 0.03, g.s + 0.1, "out");
  return (
    <div style={{ position: "absolute", left: 44, width: 900, bottom: 262, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 14, opacity: pop, transform: `translateY(${(1 - pop) * 10}px)` }}>
      {g.words.map((w, i) => {
        const on = sec >= w.s - 0.02;
        const cur = sec >= w.s - 0.02 && sec < w.e;
        return (
          <span key={i} style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: 60, lineHeight: 1.2, color: cur ? GOLD : on ? "#FFFFFF" : "rgba(255,255,255,0.62)", textShadow: "0 3px 12px rgba(0,0,0,0.95), 0 0 3px rgba(0,0,0,0.9)" }}>
            {w.t.replace(/[।,]$/, "").replace(/\.\.\.$/, "")}
          </span>
        );
      })}
    </div>
  );
};

export const Stamp: React.FC<{ f: number; at: number; out: number; text: string; x?: number; y?: number; color?: string; size?: number; rot?: number }> = ({ f, at, out, text, x = 540, y = 1120, color = "#FF5A3C", size = 86, rot = -6 }) => {
  const t = f - at;
  if (t < 0 || f > out + 6) return null;
  const s = t < 5 ? lerp(1.9, 1, ramp(t, 0, 5, "in")) : 1 + 0.02 * (1 - ramp(t, 5, 12, "out"));
  const op = ramp(t, 0, 2, "lin") * (1 - ramp(f, out, out + 6, "lin"));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: op, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${s})` }}>
      <div style={{ fontFamily: KHAND, fontWeight: 700, fontSize: size, lineHeight: 1.1, color, padding: "8px 26px 6px", border: `6px solid ${color}`, borderRadius: 12, whiteSpace: "nowrap", background: "rgba(10,6,4,0.55)", textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>{text}</div>
    </div>
  );
};

export const Callout: React.FC<{ f: number; at: number; out: number; x1: number; y1: number; x2: number; y2: number; text: string; color?: string }> = ({ f, at, out, x1, y1, x2, y2, text, color = GOLD }) => {
  const t = f - at;
  if (t < 0 || f > out + 6) return null;
  const draw = ramp(t, 0, 10, "out");
  const op = 1 - ramp(f, out, out + 6, "lin");
  const label = ramp(t, 7, 14, "out");
  const anchorRight = x2 > 540;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: op }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <circle cx={x1} cy={y1} r={7 + 3 * Math.sin(f / 5)} fill={color} />
        <circle cx={x1} cy={y1} r={18} fill="none" stroke={color} strokeWidth={2} opacity={0.6} />
        <line x1={x1} y1={y1} x2={lerp(x1, x2, draw)} y2={lerp(y1, y2, draw)} stroke={color} strokeWidth={3} />
      </svg>
      <div style={{ position: "absolute", top: y2 - 34, ...(anchorRight ? { right: W - x2 } : { left: x2 }), opacity: label, padding: "6px 18px", borderRadius: 10, background: "rgba(8,6,4,0.8)", border: `2px solid ${color}`, fontFamily: MUKTA, fontWeight: 800, fontSize: 38, color: CREAM, whiteSpace: "nowrap" }}>
        {text}
      </div>
    </div>
  );
};

export const NameCard: React.FC<{ f: number; at: number; out: number; deva: string; latin: string; sub?: string; y?: number }> = ({ f, at, out, deva, latin, sub, y = 1110 }) => {
  const t = f - at;
  if (t < 0 || f > out + 6) return null;
  const p = ramp(t, 0, 9, "out");
  const op = 1 - ramp(f, out, out + 6, "lin");
  return (
    <div style={{ position: "absolute", left: 56, top: y, opacity: op * p, transform: `translateX(${(1 - p) * -40}px)` }}>
      <div style={{ width: lerp(0, 220, p), height: 4, background: GOLD, marginBottom: 8 }} />
      <div style={{ fontFamily: KHAND, fontWeight: 700, fontSize: 92, lineHeight: 1, color: GOLD, textShadow: SHADOW }}>{deva}<span style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 34, letterSpacing: 7, color: CREAM, marginLeft: 18 }}>{latin}</span></div>
      {sub ? <div style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 38, color: CREAM, textShadow: SHADOW }}>{sub}</div> : null}
    </div>
  );
};

/** Years count up with chalk tally marks, the reel's own progress device. */
export const YearCounter: React.FC<{ f: number; at: number; out: number }> = ({ f, at, out }) => {
  const t = f - at;
  if (t < 0 || f > out + 6) return null;
  const span = Math.max(1, out - at - 8);
  const year = Math.min(14, 1 + Math.floor((t / span) * 14));
  const op = ramp(t, 0, 5, "lin") * (1 - ramp(f, out, out + 6, "lin"));
  const marks = Array.from({ length: year }).map((_, i) => {
    const group = Math.floor(i / 5);
    const pos = i % 5;
    const ox = 90 + group * 300;
    if (pos === 4) return <line key={i} x1={ox - 16} y1={72} x2={ox + 142} y2={8} stroke={CREAM} strokeWidth={8} strokeLinecap="round" />;
    return <line key={i} x1={ox + pos * 36} y1={6} x2={ox + pos * 36 - 5} y2={80} stroke={CREAM} strokeWidth={8} strokeLinecap="round" />;
  });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: op }}>
      <div style={{ position: "absolute", left: 56, top: 208, display: "flex", alignItems: "baseline", gap: 18 }}>
        <span style={{ fontFamily: KHAND, fontWeight: 700, fontSize: 210, lineHeight: 0.95, color: GOLD, textShadow: SHADOW }}>{year}</span>
        <span style={{ fontFamily: KHAND, fontWeight: 700, fontSize: 88, color: CREAM, textShadow: SHADOW }}>साल</span>
      </div>
      <svg width={W} height={100} style={{ position: "absolute", left: 0, top: 438, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.9))" }}>{marks}</svg>
    </div>
  );
};

/** Moon phases sliding to zero with a live meter, then the weak Sun in Tula. */
export const SkyBoard: React.FC<{ f: number; moonAt: number; zeroAt: number; sunAt: number; neechAt: number; out: number; dimAt: number }> = ({ f, moonAt, zeroAt, sunAt, neechAt, out, dimAt }) => {
  if (f < moonAt - 1 || f > out + 8) return null;
  const op = ramp(f, moonAt, moonAt + 8, "lin") * (1 - ramp(f, out, out + 8, "lin"));
  const m = ramp(f, moonAt, zeroAt + 4, "io");
  const pct = Math.round(100 * (1 - m));
  const moonR = 104;
  const shadowX = lerp(moonR * 2.1, 0, m);
  const sunVis = ramp(f, sunAt, sunAt + 10, "out");
  const sunWeak = ramp(f, neechAt, neechAt + 26, "io");
  const dim = ramp(f, dimAt, dimAt + 18, "io");
  const row: React.CSSProperties = { position: "absolute", left: 76, width: 800 };
  return (
    <div style={{ position: "absolute", inset: 0, opacity: op }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="story3moon"><circle cx={250} cy={700} r={moonR} /></clipPath>
          <radialGradient id="story3sun"><stop offset="0%" stopColor="#FFF3C4" /><stop offset="55%" stopColor="#FFB238" /><stop offset="100%" stopColor="#E0651A" /></radialGradient>
        </defs>
        <circle cx={250} cy={700} r={moonR + 26} fill={`rgba(226,232,255,${0.2 * (1 - m)})`} />
        <circle cx={250} cy={700} r={moonR} fill="#E9EDF7" opacity={1 - 0.2 * dim} />
        <g clipPath="url(#story3moon)"><circle cx={250 + shadowX} cy={700} r={moonR + 4} fill="#0A0D1F" /></g>
        <circle cx={250} cy={700} r={moonR} fill="none" stroke="rgba(226,232,255,0.5)" strokeWidth={2.5} />
        <g opacity={sunVis} transform={`translate(800 700) scale(${(0.75 + 0.25 * sunVis) * (1 - 0.34 * sunWeak)})`}>
          <circle r={160} fill={`rgba(255,160,60,${0.3 * (1 - sunWeak)})`} />
          <circle r={106} fill="url(#story3sun)" opacity={1 - 0.42 * sunWeak} />
        </g>
        <g opacity={sunVis} stroke={CREAM} strokeWidth={5} fill="none" strokeLinecap="round" transform="translate(800 912)">
          <path d="M0 -44V56M-100 -40H100M-60 56H60" />
          <path d="M-100 -40L-136 28H-64ZM100 -40L64 28H136Z" />
        </g>
      </svg>
      <div style={{ ...row, top: 1024, opacity: 1 }}>
        <Meter label="चाँद" v={1 - m} text={`${pct}%`} color="#CBD6FF" />
      </div>
      <div style={{ ...row, top: 1136, opacity: sunVis }}>
        <Meter label="सूरज · तुला में नीच" v={1 - 0.82 * sunWeak} text={sunWeak > 0.8 ? "सबसे कमज़ोर" : ""} color="#FFB238" />
      </div>
    </div>
  );
};

const Meter: React.FC<{ label: string; v: number; text: string; color: string }> = ({ label, v, text, color }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MUKTA, fontWeight: 800, fontSize: 36, color: CREAM, textShadow: SHADOW }}>
      <span>{label}</span>
      <span style={{ color }}>{text}</span>
    </div>
    <div style={{ height: 18, marginTop: 4, borderRadius: 9, background: "rgba(255,255,255,0.18)", overflow: "hidden" }}>
      <div style={{ width: `${v * 100}%`, height: "100%", background: color, boxShadow: `0 0 16px ${color}` }} />
    </div>
  </div>
);

/** A handwritten-style note with items ticked on the words. */
export const ListCard: React.FC<{ f: number; at: number; out: number; title: string; items: { text: string; at: number; color: string }[] }> = ({ f, at, out, title, items }) => {
  const t = f - at;
  if (t < 0 || f > out + 8) return null;
  const p = ramp(t, 0, 10, "out");
  const op = 1 - ramp(f, out, out + 8, "lin");
  return (
    <div style={{ position: "absolute", left: 150, width: 690, top: 960, opacity: op * p, transform: `rotate(${-1.6 + (1 - p) * -5}deg) translateY(${(1 - p) * 60}px)`, background: "linear-gradient(170deg, #F8EEDB, #EBD9B8)", borderRadius: 10, padding: "30px 40px 34px", boxShadow: "0 26px 70px rgba(0,0,0,0.65)" }}>
      <div style={{ fontFamily: KHAND, fontWeight: 700, fontSize: 56, color: "#6B2A12", borderBottom: "3px dashed rgba(107,42,18,0.4)", paddingBottom: 8, marginBottom: 12 }}>{title}</div>
      {items.map((it, i) => {
        const v = ramp(f, it.at, it.at + 8, "out");
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, padding: "6px 0", opacity: 0.32 + 0.68 * v }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, display: "flex", alignItems: "center", justifyContent: "center", background: v > 0.2 ? it.color : "rgba(107,42,18,0.15)", transform: `scale(${1 + (1 - v) * 0.12 + Math.sin(Math.min(1, v) * Math.PI) * 0.15})`, fontFamily: KHAND, fontWeight: 700, fontSize: 44, color: "#FFF8E8" }}>{i + 1}</div>
            <div style={{ fontFamily: KHAND, fontWeight: 700, fontSize: 76, lineHeight: 1.05, color: "#2A1408" }}>{it.text}</div>
          </div>
        );
      })}
    </div>
  );
};

const DASHAS: [string, number, string][] = [
  ["केतु", 7, "#A58FD6"], ["शुक्र", 20, "#F2E8D2"], ["सूर्य", 6, "#FFB238"], ["चंद्र", 10, "#CBD6FF"], ["मंगल", 7, "#F06A4A"],
  ["राहु", 18, "#8C9BB8"], ["गुरु", 16, "#F2C230"], ["शनि", 19, "#6F8FD8"], ["बुध", 17, "#7FD48A"],
];

/** The nine mahadashas as real Vimshottari lengths, highlighted on the words, then a marker running to a change date. */
export const DashaBoard: React.FC<{ f: number; at: number; out: number; shani: number; rahu: number; surya: number; dateAt: number }> = ({ f, at, out, shani, rahu, surya, dateAt }) => {
  const t = f - at;
  if (t < 0 || f > out + 8) return null;
  const op = ramp(t, 0, 8, "lin") * (1 - ramp(f, out, out + 8, "lin"));
  const hot = (name: string) => {
    const on = (a: number, b: number) => f >= a && f < b;
    if (name === "शनि" && on(shani, rahu)) return true;
    if (name === "राहु" && on(rahu, surya)) return true;
    if (name === "सूर्य" && on(surya, dateAt)) return true;
    return false;
  };
  const d = ramp(f, dateAt, dateAt + 8, "out");
  return (
    <>
    <div style={{ position: "absolute", inset: 0, background: "rgba(5,4,12,0.5)", opacity: op }} />
    <div style={{ position: "absolute", left: 60, width: 860, top: 700, opacity: op }}>
      <div style={{ opacity: 1 - d, transform: `translateY(${d * -30}px)`, position: "absolute", width: 860 }}>
        {DASHAS.map(([name, yrs, color], i) => {
          const grow = ramp(t, i * 2, i * 2 + 12, "out");
          const on = hot(name);
          return (
            <div key={name} style={{ display: "flex", alignItems: "center", height: 66, gap: 12, transform: on ? "scale(1.05)" : undefined, transformOrigin: "0 50%" }}>
              <div style={{ width: 118, fontFamily: MUKTA, fontWeight: 800, fontSize: 40, color: on ? GOLD : CREAM, textShadow: SHADOW, textAlign: "right" }}>{name}</div>
              <div style={{ width: (yrs / 20) * 590 * grow, height: on ? 42 : 30, borderRadius: 8, background: color, boxShadow: on ? `0 0 28px ${color}` : "0 2px 8px rgba(0,0,0,0.6)" }} />
              <div style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: on ? 44 : 36, color: on ? GOLD : CREAM, textShadow: SHADOW, opacity: grow }}>{yrs}</div>
            </div>
          );
        })}
      </div>
      {d > 0.01 ? <DateRibbon f={f} at={dateAt} p={d} /> : null}
    </div>
    </>
  );
};

const DateRibbon: React.FC<{ f: number; at: number; p: number }> = ({ f, at, p }) => {
  const seg = [["शनि", 19, "#6F8FD8"], ["बुध", 17, "#7FD48A"]] as const;
  const run = ramp(f, at + 6, at + 62, "io");
  const boundary = (19 / 36) * 860;
  const x = lerp(70, boundary, run);
  const stamp = f >= at + 62;
  return (
    <div style={{ position: "absolute", top: 110, width: 860, opacity: p }}>
      <div style={{ display: "flex", height: 92, borderRadius: 14, overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,0.6)" }}>
        {seg.map(([n, y, c]) => (
          <div key={n} style={{ flex: y, background: c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: KHAND, fontWeight: 700, fontSize: 52, color: "#0E0A18" }}>{n} दशा</div>
        ))}
      </div>
      <div style={{ position: "absolute", left: x - 3, top: -36, width: 6, height: 164, background: "#FFF3C4", boxShadow: "0 0 18px #FFD36B" }} />
      <div style={{ position: "absolute", left: x, top: -86, transform: "translateX(-50%)", fontFamily: MUKTA, fontWeight: 800, fontSize: 34, color: "#FFF3C4", whiteSpace: "nowrap", textShadow: SHADOW }}>{stamp ? "यहाँ बदलती है" : "आप यहाँ"}</div>
      <div style={{ marginTop: 56, fontFamily: MUKTA, fontWeight: 700, fontSize: 30, color: "rgba(247,236,216,0.8)", textShadow: SHADOW }}>उदाहरण · हर कुंडली की तारीख़ें अलग होती हैं</div>
    </div>
  );
};

/** The silent Play Store moment: a phone slides into the free space, Install is tapped, Open appears. Drawn, no ratings or counts. */
export const PlayPhone: React.FC<{ f: number; at: number; out: number; x?: number; y?: number; scale?: number }> = ({ f, at, out, x = 618, y = 500, scale = 1 }) => {
  const t = f - at;
  if (t < 0 || f > out + 12) return null;
  const inP = ramp(t, 0, 14, "out");
  const outP = ramp(f, out, out + 12, "in");
  const tapAt = 30;
  const installed = 80;
  const tap = ramp(t, tapAt, tapAt + 12, "out");
  const tapFade = 1 - ramp(t, tapAt + 6, tapAt + 16, "lin");
  const prog = ramp(t, tapAt + 4, installed, "io");
  const state: "install" | "going" | "open" = t < tapAt + 2 ? "install" : t < installed ? "going" : "open";
  const float = Math.sin(f / 18) * 5;
  const w = 330;
  const h = 690;
  const circ = 2 * Math.PI * 58;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `translateX(${(1 - inP) * 520 + outP * 520}px) translateY(${float}px) rotate(${(1 - inP) * 8 + 2}deg) scale(${scale})`, transformOrigin: "50% 50%" }}>
      <div style={{ position: "absolute", inset: -11, borderRadius: 54, background: "linear-gradient(150deg, #3B3026, #0D0A08)", border: "2.5px solid rgba(255,201,77,0.85)", boxShadow: "0 30px 80px rgba(0,0,0,0.75), 0 0 46px rgba(255,190,90,0.3)" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 44, overflow: "hidden", background: "#FBFAF7" }}>
        <div style={{ height: 74, background: "#FBFAF7", display: "flex", alignItems: "center", gap: 10, padding: "26px 22px 0" }}>
          <svg viewBox="0 0 24 26" width={26} height={28}><path d="M2 1L14 13L2 25Z" fill="#00C3FF" /><path d="M2 1L18 9.5L14 13Z" fill="#00E676" /><path d="M2 25L18 16.5L14 13Z" fill="#FF3D47" /><path d="M18 9.5L23 13L18 16.5L14 13Z" fill="#FFCE00" /></svg>
          <span style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 25, color: "#3C4043" }}>Google Play</span>
        </div>
        <div style={{ padding: "30px 24px 0", textAlign: "center" }}>
          <div style={{ position: "relative", width: 136, height: 136, margin: "0 auto" }}>
            <div style={{ position: "absolute", inset: 8, borderRadius: 26, background: "linear-gradient(150deg, #2A1A3A, #120A1C)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Img src={staticFile("jyotiq/logo-icon.png")} style={{ width: 92, height: 78, objectFit: "contain" }} />
            </div>
            {state === "going" ? (
              <svg width={136} height={136} style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
                <circle cx={68} cy={68} r={58} fill="none" stroke="rgba(1,135,95,0.2)" strokeWidth={6} />
                <circle cx={68} cy={68} r={58} fill="none" stroke="#01875F" strokeWidth={6} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - prog)} />
              </svg>
            ) : null}
          </div>
          <div style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: 50, color: "#1F1F1F", marginTop: 12, lineHeight: 1.1 }}>Jyotiq</div>
          <div style={{ fontFamily: MUKTA, fontWeight: 500, fontSize: 25, color: "#5F6368", lineHeight: 1.25, marginTop: 2 }}>Jyotiq se pucho</div>
          <div style={{ position: "relative", marginTop: 26, height: 66, borderRadius: 33, background: state === "going" ? "#E8EAED" : "#01875F", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MUKTA, fontWeight: 800, fontSize: 31, color: state === "going" ? "#5F6368" : "#FFFFFF" }}>
            {state === "install" ? "Install" : state === "going" ? `${Math.round(prog * 100)}%` : "Open"}
            {tapFade > 0 && t >= tapAt ? <div style={{ position: "absolute", left: "50%", top: "50%", width: 60 + tap * 140, height: 60 + tap * 140, borderRadius: "50%", transform: "translate(-50%, -50%)", background: `rgba(255,255,255,${0.5 * tapFade})`, border: `3px solid rgba(255,255,255,${0.9 * tapFade})` }} /> : null}
          </div>
        </div>
        <div style={{ position: "absolute", left: 24, right: 24, bottom: 44, padding: "16px 12px", borderRadius: 18, background: "#F1EDE3", textAlign: "center", fontFamily: MUKTA, fontWeight: 800, fontSize: 30, lineHeight: 1.2, color: "#3A2A18" }}>
          पहला सवाल<br /><span style={{ color: "#B5541C" }}>फ़्री</span>
        </div>
      </div>
    </div>
  );
};
