import React from "react";
import { AbsoluteFill, Audio, Freeze, staticFile, useCurrentFrame } from "remotion";
import { z } from "zod";
import { prog } from "../motion";
import { SANS } from "../theme";
import { A, B, CAST, DRAMA, FREEZE, HIT1, HIT2 } from "./cast";
import { Figure, FigureSpec, FootShadow, handOf, headOf, vnoise } from "./rig";
import { SetBack, SetDefs, SetMid } from "./set";

/* 9:16 hook: a reality-show house fight rebuilt with silhouettes (no footage,
   no faces, no logos). Copy sits in the middle band (y ~600-930, x 90-930),
   clear of Instagram's header, bottom caption area and right rail. */

export const fightHookSchema = z.object({
  kicker: z.string(),
  question: z.array(z.string()),
  day: z.number(),
  withSfx: z.boolean(),
});
export type FightHookProps = z.infer<typeof fightHookSchema>;

export const FIGHT_DEFAULTS: FightHookProps = {
  kicker: "Reality show ya ghar?",
  question: ["Har baat pe", "jhagda kyun?"],
  day: 47,
  withSfx: true,
};

const decay = (f: number, at: number, tau: number) => (f >= at ? Math.exp(-(f - at) / tau) : 0);
const HITS: [number, number][] = [
  [HIT1, 1],
  [HIT2, 0.55],
  [DRAMA[0], 0.4],
  [DRAMA[1], 0.45],
  [DRAMA[2], 0.55],
];

/** Camera: slow push, punch-ins on hits, then three TV-drama zoom steps onto the pair. */
export const useCamera = (f: number) => {
  const c1 = { x: 540, y: 1150 };
  const punch = 0.07 * decay(f, HIT1, 5) + 0.035 * decay(f, HIT2, 5);
  const s1 = (1 + 0.05 * prog(f, 0, FREEZE)) * (1 + punch);
  const ha = headOf(A, FREEZE);
  const hb = headOf(B, FREEZE);
  const c2 = { x: (ha.x + hb.x) / 2, y: (ha.y + hb.y) / 2 + 30 };
  const s2 = 1 + 0.22 * prog(f, DRAMA[0], DRAMA[0] + 3) + 0.26 * prog(f, DRAMA[1], DRAMA[1] + 3) + 0.32 * prog(f, DRAMA[2], DRAMA[2] + 3);
  let amp = 0;
  for (const [h, a] of HITS) amp += 24 * a * decay(f, h, 4.5);
  const sx = amp * vnoise("camx", f * 0.9);
  const sy = amp * vnoise("camy", f * 0.9 + 40);
  const rot = (amp / 24) * 0.9 * vnoise("camr", f * 0.8 + 90);
  const S = s1 * s2;
  const tx = s2 * (1 - s1) * c1.x + (1 - s2) * c2.x + sx;
  const ty = s2 * (1 - s1) * c1.y + (1 - s2) * c2.y + sy;
  return { transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${S.toFixed(4)})`, rot };
};

/** Comic-free impact read: an expanding ring + radial streaks at the contact point. */
const Burst: React.FC<{ f: number; at: number; x: number; y: number; size: number }> = ({ f, at, x, y, size }) => {
  const t = (f - at) / 7;
  if (t < 0 || t > 1) return null;
  const k = 1 - t;
  return (
    <g opacity={k}>
      <circle cx={x} cy={y} r={(40 + 170 * t) * size} fill="none" stroke="#FFF6E0" strokeWidth={12 * k * size} />
      {new Array(12).fill(0).map((_, i) => {
        const a = (i / 12) * Math.PI * 2 + 0.2;
        const r0 = (60 + 150 * t) * size;
        const r1 = r0 + 80 * k * size;
        return (
          <line
            key={i}
            x1={x + Math.cos(a) * r0}
            y1={y + Math.sin(a) * r0}
            x2={x + Math.cos(a) * r1}
            y2={y + Math.sin(a) * r1}
            stroke={i % 2 ? "#FFD43B" : "#FFFFFF"}
            strokeWidth={9 * k * size}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
};

export const Layer: React.FC<{ list: FigureSpec[]; f: number }> = ({ list, f }) => (
  <>
    {list.map((s) => (
      <FootShadow key={`sh${s.id}`} spec={s} f={f} />
    ))}
    {list.map((s) => (
      <Figure key={s.id} spec={s} f={f} />
    ))}
  </>
);

/* ------------------------------------------------------------------ */
/* Live-TV chrome: LIVE / DAY pill, camera label, timecode, corners    */
/* ------------------------------------------------------------------ */

const glitchAt = (f: number) => [HIT1, HIT1 + 1, HIT2, ...DRAMA].includes(f);

const Chrome: React.FC<{ f: number; day: number }> = ({ f, day }) => {
  const g = glitchAt(f);
  const off = g ? (f % 2 ? 9 : -7) : 0;
  const split = g ? "3px 0 0 rgba(255,40,80,0.85), -3px 0 0 rgba(40,220,255,0.85)," : "";
  const shadow = `${split} 0 2px 10px rgba(0,0,0,0.55)`;
  const sec = 9 + Math.floor(f / 30);
  const tc = `21:47:${String(sec).padStart(2, "0")}:${String(f % 30).padStart(2, "0")}`;
  const corner = (x: number, y: number, dx: number, dy: number) => (
    <path d={`M${x} ${y + dy * 58} L${x} ${y} L${x + dx * 58} ${y}`} fill="none" stroke="rgba(255,255,255,0.78)" strokeWidth="5" />
  );
  return (
    <AbsoluteFill style={{ transform: `translateX(${off}px)`, fontFamily: SANS, color: "#FFFFFF" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {corner(56, 214, 1, 1)}
        {corner(1024, 214, -1, 1)}
        {corner(56, 1650, 1, -1)}
        {corner(1024, 1650, -1, -1)}
      </svg>
      <div style={{ position: "absolute", left: 92, top: 248, display: "flex", alignItems: "center", gap: 14, padding: "10px 20px", borderRadius: 999, background: "rgba(14,6,14,0.62)", textShadow: shadow }}>
        <div style={{ width: 18, height: 18, borderRadius: 9, background: "#FF2D3D", opacity: f % 30 < 20 ? 1 : 0.25, boxShadow: "0 0 14px #FF2D3D" }} />
        <span style={{ fontWeight: 800, fontSize: 30, letterSpacing: 2 }}>LIVE</span>
        <span style={{ width: 2, height: 26, background: "rgba(255,255,255,0.45)" }} />
        <span style={{ fontWeight: 700, fontSize: 30, letterSpacing: 1 }}>DAY {day}</span>
      </div>
      <div style={{ position: "absolute", left: 100, top: 322, fontWeight: 700, fontSize: 22, letterSpacing: 4, opacity: 0.9, textShadow: shadow }}>
        CAM 07 · LIVING AREA
      </div>
      <div style={{ position: "absolute", right: 96, top: 258, fontWeight: 700, fontSize: 26, letterSpacing: 2, fontVariantNumeric: "tabular-nums", textShadow: shadow }}>
        {tc}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Hook copy: kicker plate + the question on a yellow plate            */
/* ------------------------------------------------------------------ */

const HookText: React.FC<{ f: number; kicker: string; question: string[] }> = ({ f, kicker, question }) => {
  const settle = 1 + 0.06 * (1 - prog(f, 0, 8));
  let punch = 0.11 * decay(f, HIT1, 4) + 0.05 * decay(f, HIT2, 4);
  for (const d of DRAMA) punch += 0.05 * decay(f, d, 3.5);
  const jx = 10 * decay(f, HIT1, 3) * vnoise("tx", f) + 5 * decay(f, HIT2, 3) * vnoise("tx2", f);
  return (
    <div style={{ position: "absolute", left: 90, width: 840, top: 598, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, fontFamily: SANS, transform: `scale(${settle})` }}>
      <div style={{ padding: "12px 26px 14px", borderRadius: 16, background: "rgba(16,7,16,0.9)", color: "#FFFFFF", fontWeight: 800, fontSize: 44, letterSpacing: 0.5, textTransform: "uppercase", boxShadow: "0 8px 24px rgba(0,0,0,0.35)", borderLeft: "8px solid #FF2D3D" }}>
        {kicker}
      </div>
      <div
        style={{
          padding: "16px 34px 22px",
          borderRadius: 22,
          background: "#FFD43B",
          color: "#16080F",
          fontWeight: 800,
          fontSize: 92,
          lineHeight: 1.02,
          letterSpacing: -1,
          textAlign: "center",
          textTransform: "uppercase",
          boxShadow: "0 12px 0 rgba(60,8,30,0.55), 0 18px 40px rgba(0,0,0,0.35)",
          transform: `translateX(${jx}px) rotate(-2deg) scale(${1 + punch})`,
        }}
      >
        {question.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* The hook                                                            */
/* ------------------------------------------------------------------ */

export const FightHook: React.FC<FightHookProps> = ({ kicker, question, day, withSfx }) => {
  const f = useCurrentFrame();
  const tf = Math.min(f, FREEZE); // the people freeze; camera + copy keep going
  const cam = useCamera(f);
  const frozen = f >= FREEZE;
  let drama = 0;
  for (const d of DRAMA) drama += decay(f, d, 4);
  const flash = f === HIT1 ? 0.55 : f === HIT1 + 1 ? 0.22 : f === HIT2 ? 0.18 : 0;
  const lamp = 1 + 0.04 * Math.sin(f / 3.1) + 0.03 * vnoise("lamp", f * 0.5);
  const h1 = handOf(A, HIT1);
  const h2a = handOf(A, HIT2);
  const h2b = handOf(B, HIT2);

  return (
    <AbsoluteFill style={{ background: "#3A0C24", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `rotate(${cam.rot.toFixed(3)}deg)`, transformOrigin: "540px 1100px" }}>
        <AbsoluteFill
          style={{
            transform: cam.transform,
            transformOrigin: "0 0",
            filter: frozen ? "saturate(0.55) contrast(1.15) brightness(0.96)" : undefined,
          }}
        >
          <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ overflow: "visible" }}>
            <SetDefs />
            <SetBack lampFlicker={lamp} />
            <Layer list={CAST.back} f={tf} />
            <SetMid />
            <Layer list={CAST.mid} f={tf} />
            <Layer list={CAST.front} f={tf} />
            <Burst f={f} at={HIT1} x={h1.x + 24} y={h1.y} size={1} />
            <Burst f={f} at={HIT2} x={(h2a.x + h2b.x) / 2} y={(h2a.y + h2b.y) / 2} size={0.6} />
            <Layer list={CAST.fg} f={tf} />
          </svg>
        </AbsoluteFill>
      </AbsoluteFill>
      {/* drama-hit tint + vignette (no strobing white: only the main hit flashes) */}
      <AbsoluteFill style={{ background: "rgba(150,0,40,1)", mixBlendMode: "multiply", opacity: 0.22 * Math.min(1, drama) }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 50% 52%, transparent 50%, rgba(20,0,12,0.6) 100%)", opacity: 0.75 + 0.25 * Math.min(1, drama) }} />
      {flash > 0 ? <AbsoluteFill style={{ background: "#FFF4E8", opacity: flash }} /> : null}
      <Chrome f={f} day={day} />
      <HookText f={f} kicker={kicker} question={question} />
      {withSfx ? <Audio src={staticFile("jyotiq/hook/fight-sfx.wav")} /> : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Review                                                              */
/* ------------------------------------------------------------------ */

export const FIGHT_KEYFRAMES = [0, 12, 20, 23, 27, 36, 47, 60, 80, 91, 97, 107];

export const fightKeyframesSchema = z.object({ list: z.array(z.number()).optional() });

/** Frame i = list[i] of the hook (render --sequence --frames=0-N). */
export const FightHookKeyframes: React.FC<{ list?: number[] }> = ({ list }) => {
  const frame = useCurrentFrame();
  const frames = list && list.length > 0 ? list : FIGHT_KEYFRAMES;
  return (
    <Freeze frame={frames[Math.min(frame, frames.length - 1)]}>
      <FightHook {...FIGHT_DEFAULTS} withSfx={false} />
    </Freeze>
  );
};

/** One-image contact sheet: 6 x 2 thumbnails (270 x 480) with frame labels. */
export const FightHookSheet: React.FC<{ list?: number[] }> = ({ list }) => {
  const frames = (list && list.length > 0 ? list : FIGHT_KEYFRAMES).slice(0, 12);
  return (
    <AbsoluteFill style={{ background: "#0B0509" }}>
      {frames.map((fr, i) => (
        <div key={i} style={{ position: "absolute", left: (i % 6) * 274 + 4, top: Math.floor(i / 6) * 520 + 4, width: 270, height: 516 }}>
          <div style={{ width: 270, height: 480, overflow: "hidden" }}>
            <div style={{ width: 1080, height: 1920, transform: "scale(0.25)", transformOrigin: "0 0" }}>
              <Freeze frame={fr}>
                <FightHook {...FIGHT_DEFAULTS} withSfx={false} />
              </Freeze>
            </div>
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, color: "#F5ECDD", marginTop: 4 }}>
            f{fr} · {(fr / 30).toFixed(2)}s
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
