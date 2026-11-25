import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { pop, Word, Words } from "./motion";
import { BEAT, BEAT0, BEAT_FRAMES, BEAT_STRENGTH, LEVEL } from "./music";
import { SERIF, useTheme } from "./theme";

/* 9:16 Reel canvas. Instagram overlays the top ~220 px (header), the bottom
   ~380 px (caption, audio) and a right rail of icons in the lower half, so all
   copy sits between y 300 and 1500 and x 90 and 930. */
export const RW = 1080;
export const RH = 1920;
export const RCX = 540;
export const RCY = 960;

/* ------------------------------------------------------------------ */
/* Music: the beat grid measured from public/audio.m4a (music.ts)      */
/* ------------------------------------------------------------------ */

/** Decaying kick envelope 0..1 at a GLOBAL frame (strongest right on the beat). */
export const beatPulse = (f: number, decay = 5): number => {
  const k = Math.floor((f - BEAT0) / BEAT);
  if (k < 0 || k >= BEAT_STRENGTH.length) return 0;
  const since = f - BEAT_FRAMES[k];
  if (since < 0) return 0;
  return BEAT_STRENGTH[k] * Math.exp(-since / decay);
};

/** Whole-mix loudness 0..1 at a GLOBAL frame (drops in the 27.3 s break and the fade-out). */
export const level = (f: number): number => LEVEL[Math.max(0, Math.min(LEVEL.length - 1, Math.round(f)))];

/* Camera punches: a 1-2 % zoom thump on the hits where a word lands, a tap
   happens or a scene changes, so the edit hits with the track. [frame, amount] */
const PUNCHES: [number, number][] = [
  [52, 0.026], // "Into clarity." lands
  [112, 0.018], // JYOTIQ tile pops on the kick entry
  [143, 0.012], // tap Chat Now
  [189, 0.016], // +1 Flame card thump
  [234, 0.012], // Kundali.
  [250, 0.012], // Muhurat.
  [265, 0.012], // Remedies.
  [281, 0.018], // Your AI Vedic astrologer.
  [419, 0.024], // Answered. + confetti
  [541, 0.012], // tap View Remedy
  [569, 0.018], // Across your life.
  [648, 0.01], // tap LOVE
  [679, 0.012], // tap send
  [725, 0.014], // tap Upto 1 Year
  [801, 0.016], // star lands: Ask.
  [818, 0.016], // Align.
  [838, 0.024], // Answered. (music comes back)
  [870, 0.02], // end card
];

export const punchAt = (f: number): number => {
  let s = 0;
  for (const [h, a] of PUNCHES) {
    if (f >= h && f < h + 26) s += a * Math.min(1, (f - h + 1) / 2) * Math.exp(-(f - h) / 4.5);
  }
  return s;
};

/** Wraps the whole edit; must sit OUTSIDE the scene <Sequence>s so it reads the global frame. */
export const Punch: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `scale(${1 + punchAt(f)})` }}>{children}</AbsoluteFill>;
};

/* ------------------------------------------------------------------ */
/* Backdrop: warm black, a diya glow that breathes with the kick,      */
/* twinkling dust and rising embers that brighten on every beat        */
/* ------------------------------------------------------------------ */

export const ReelBackdrop: React.FC = () => {
  const t = useTheme();
  const f = useCurrentFrame();
  const pulse = beatPulse(f, 6);
  const lv = level(f);

  const dust = new Array(64).fill(0).map((_, i) => {
    const tw = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(f / (9 + random(`rdt${i}`) * 14) + i));
    return {
      x: random(`rdx${i}`) * RW,
      y: random(`rdy${i}`) * RH,
      s: 1.2 + random(`rds${i}`) * 2.4,
      o: tw * (t.dark ? 0.5 : 0.35) * (0.4 + random(`rdo${i}`) * 0.6),
    };
  });

  const emberCols = [t.gold, t.ctaTo, t.goldSoft, t.star];
  const embers = new Array(30).fill(0).map((_, i) => {
    const r = (k: string) => random(`emb-${k}-${i}`);
    const speed = 1.1 + r("s") * 2.6;
    const span = RH + 240;
    const y = RH + 80 - ((r("y") * span + f * speed) % span);
    const x = r("x") * RW + Math.sin(f / (14 + r("w") * 22) + i * 1.7) * (10 + r("a") * 28);
    const size = 2.5 + r("z") * 5;
    const edge = Math.min(1, Math.max(0, (RH + 80 - y) / 260)) * Math.min(1, Math.max(0, y / 520));
    const flicker = 0.55 + 0.45 * Math.sin(f / (2.6 + r("f") * 4) + i * 2.1);
    const o = edge * (0.25 + 0.55 * flicker) * (0.45 + 0.55 * lv) * (0.75 + 0.9 * pulse);
    return { x, y, size, o: Math.min(1, o), c: emberCols[Math.floor(r("c") * emberCols.length)] };
  });

  return (
    <AbsoluteFill style={{ background: t.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 780px 960px at 50% 47%, ${t.glow}, transparent 72%)`,
          opacity: 0.78 + 0.3 * pulse,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 430px 540px at 50% 48%, ${t.gold}22, transparent 70%)`,
          opacity: 0.35 + 0.85 * pulse,
        }}
      />
      {dust.map((d, i) => (
        <div
          key={`d${i}`}
          style={{
            position: "absolute",
            left: d.x,
            top: d.y,
            width: d.s,
            height: d.s,
            borderRadius: "50%",
            background: t.dust,
            opacity: d.o,
          }}
        />
      ))}
      {embers.map((e, i) =>
        e.o > 0.01 ? (
          <div
            key={`e${i}`}
            style={{
              position: "absolute",
              left: e.x - e.size / 2,
              top: e.y - e.size / 2,
              width: e.size,
              height: e.size * 1.35,
              borderRadius: "50% 50% 45% 45%",
              background: `radial-gradient(circle at 50% 40%, #FFF3D0, ${e.c} 65%)`,
              boxShadow: `0 0 ${e.size * 3}px ${e.c}`,
              opacity: e.o,
            }}
          />
        ) : null,
      )}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 85% 75% at 50% 50%, transparent 55%, ${t.vignette} 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Stacked kinetic type: each line opens on its first word, so the     */
/* block re-centres vertically as it builds (the 9:16 twin of Words)   */
/* ------------------------------------------------------------------ */

export type Line = {
  words: Word[];
  size: number;
  weight?: number;
  font?: string;
  lh?: number;
  letterSpacing?: number;
};

export const Lines: React.FC<{ lines: Line[]; style?: React.CSSProperties }> = ({ lines, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", ...style }}>
      {lines.map((ln, i) => {
        const at = Math.min(...ln.words.map((w) => w.at));
        const open = frame < at ? 0 : Math.min(1, pop(frame, fps, at, 14) * 1.25);
        const h = (ln.lh ?? 1.12) * ln.size;
        return (
          <div
            key={i}
            style={{
              height: h * open,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "visible",
            }}
          >
            <Words
              words={ln.words}
              size={ln.size}
              weight={ln.weight}
              font={ln.font ?? SERIF}
              letterSpacing={ln.letterSpacing ?? -1.5}
            />
          </div>
        );
      })}
    </div>
  );
};
