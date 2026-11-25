import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FocusLines, SpeedLines, StarDust } from "../bbreel/anime";
import { CORMORANT } from "../bbreel/fonts";
import { FingersFront, K, PalmBack, PhoneFrame, SCR, Thumb } from "../bbreel/phoneKit";
import { ICONS, StatusBar, SysNav } from "../bbreel/playStore";
import { SANS } from "../theme";
import { Bust, CAST } from "./grahas";
import { Bedroom } from "./kid";
import { GOLD, INK, starPath } from "./prims";
import { Bullet, Crow, Shani } from "./shani";
import { hit, pop, ramp, track, wob } from "./timing";
import { E2 } from "./timing2";

/* S4 — "kah se aate hain": the whole kundli (all nine grahas, Shani on his
   Bullet in the middle) dances on a neon kundli floor, swirls together on the
   beat, and the camera pulls back: it was all happening on the Jyotiq app in
   the kid's hand. Text "kha se aate hai" lands word by word on the vocal. */

/* ------------------------------------------------------------------ */
/* Beat clock                                                          */
/* ------------------------------------------------------------------ */

const BEAT_LEN = 17.55; // 102.6 BPM at 30 fps
type BeatInfo = { i: number; since: number; ph: number };
const beatAt = (f: number): BeatInfo => {
  const B = E2.beats;
  if (f < B[0]) return { i: 0, since: 99, ph: 0 };
  let i = 0;
  for (let k = 0; k < B.length; k++) if (f >= B[k]) i = k;
  const a = B[i];
  const b = i + 1 < B.length ? B[i + 1] : a + BEAT_LEN;
  return { i, since: f - a, ph: Math.min(1, (f - a) / (b - a)) };
};
/** 1 on the beat, decaying over `dur` frames. */
const onBeat = (f: number, dur = 9): number => {
  const { since } = beatAt(f);
  return since > dur ? 0 : Math.pow(1 - since / dur, 2);
};

/* ------------------------------------------------------------------ */
/* Dancers                                                             */
/* ------------------------------------------------------------------ */

/** Hand targets [lx, ly, rx, ry] in Bust coordinates (shoulders at +-62,-110). */
const POSES: [number, number, number, number][] = [
  [-176, -330, 176, -330], // both hands up
  [-120, -14, 156, -372], // "bulb" twist up right, left on hip
  [-156, -372, 120, -14], // mirror
  [-214, -176, 214, -176], // arms out, shoulder shimmy
];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Converge on the swirl beat: everyone hops toward the centre. */
const convergeAt = (f: number) => track(f, [
  [E2.converge - 1, 0],
  [E2.converge + 5, 1, "out"],
  [E2.converge + 13, 0, "io"],
]);

const Dancer: React.FC<{ id: string; f: number; x: number; ground: number; scale: number; off: number; dance?: boolean }> = ({ id, f, x, ground, scale, off, dance = true }) => {
  const s = CAST[id];
  const b = beatAt(f);
  const dip = onBeat(f, 8) * 26; // knees bend on the beat
  const side = Math.sin(((f - E2.beats[0]) / BEAT_LEN) * Math.PI + off) * 12;
  const cv = convergeAt(f);
  const cx = x + (540 - x) * 0.22 * cv + side;
  const hop = 90 * cv;
  const snap = ramp(b.since, 0, 4, "out");
  const pa = POSES[(b.i + off + 3) % 4];
  const pb = POSES[(b.i + off) % 4];
  const arms: [number, number, number, number] = [lerp(pa[0], pb[0], snap), lerp(pa[1], pb[1], snap), lerp(pa[2], pb[2], snap), lerp(pa[3], pb[3], snap)];
  const tilt = Math.sin(((f - E2.beats[0]) / BEAT_LEN) * Math.PI + off) * 5 + cv * (off % 2 ? 12 : -12);
  if (s.headOnly) {
    // Rahu: a floating head that bounces on the beat
    return (
      <g transform={`translate(${cx} ${ground - hop - dip * 1.4}) scale(${scale})`}>
        <Bust s={s} f={f} seed={id} bob={onBeat(f, 8)} />
      </g>
    );
  }
  const legL = { hx: -36, fx: -78 - dip * 0.4 };
  const legR = { hx: 36, fx: 78 + dip * 0.4 };
  const footY = 250 - dip;
  const knee = (hx: number, fx: number, sd: number) => ({ x: (hx + fx) / 2 + sd * (18 + dip * 1.3), y: footY / 2 });
  const leg = (hx: number, fx: number, sd: number, key: string) => {
    const k = knee(hx, fx, sd);
    return (
      <g key={key}>
        <path d={`M${hx} -6 Q${k.x} ${k.y} ${fx} ${footY - 22}`} fill="none" stroke={INK} strokeWidth={50} strokeLinecap="round" />
        <path d={`M${hx} -6 Q${k.x} ${k.y} ${fx} ${footY - 22}`} fill="none" stroke={s.outfitD} strokeWidth={38} strokeLinecap="round" />
        <path d={`M${fx - 34 * (sd < 0 ? 1.2 : 0.6)} ${footY} Q${fx} ${footY - 34} ${fx + 34 * (sd < 0 ? 0.6 : 1.2)} ${footY}Z`} fill="#16111F" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <path d={`M${fx - 26} ${footY - 6} L${fx + 26} ${footY - 6}`} stroke={s.trim} strokeWidth={5} strokeLinecap="round" />
      </g>
    );
  };
  return (
    <g transform={`translate(${cx} ${ground - footY * scale - hop}) scale(${scale}) rotate(${tilt} 0 120)`}>
      <ellipse cx={0} cy={footY + 6} rx={120} ry={18} fill="#000" opacity={0.35 * (1 - cv * 0.6)} />
      {leg(legL.hx, legL.fx, -1, "l")}
      {leg(legR.hx, legR.fx, 1, "r")}
      <Bust s={s} f={f} seed={id} bob={onBeat(f, 8) * 0.6} danceArms={dance ? arms : undefined} />
    </g>
  );
};

/** Shani on his Bullet: lowrider hop on every beat, moustache twirl on the off-beats, flex on the downbeats. */
const ShaniDance: React.FC<{ f: number; x: number; ground: number; scale: number }> = ({ f, x, ground, scale }) => {
  const b = beatAt(f);
  const bounce = onBeat(f, 10);
  const hop = Math.sin(Math.min(1, b.since / 9) * Math.PI) * 34 * (f >= E2.beats[0] ? 1 : 0);
  const cv = convergeAt(f);
  const twirl = b.i % 2 === 1 ? ramp(b.since, 0, 5, "out") * (1 - ramp(b.since, 12, 17)) : 0;
  const flex = b.i % 2 === 0 ? ramp(b.since, 0, 4, "back") * (1 - ramp(b.since, 10, 16)) : 0;
  const glint = hit(f, E2.beats[b.i] + 3, 9);
  const wheelie = -10 * cv;
  return (
    <g transform={`translate(${x} ${ground - hop - cv * 60}) scale(${scale})`}>
      <ellipse cx={0} cy={-4 + hop / scale} rx={500} ry={34} fill="#000" opacity={0.5} />
      <g transform={`rotate(${wheelie} -300 0)`}>
        <Bullet f={f} flame={0.2 + bounce * 0.5} />
        <Shani f={f} twirl={twirl} curl={1} glint={glint} flex={flex} />
        <Crow f={f} caw={bounce} />
      </g>
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Stage                                                               */
/* ------------------------------------------------------------------ */

/** North-Indian kundli grid laid on the stage floor (pinhole projection, lines stay straight). */
const FL = { F: 251, c: 980, hz: 1000, half: 3.585, zn: 1, zf: 8.17 };
const proj = (X: number, Z: number) => ({ x: 540 + (FL.F * X) / Z, y: FL.hz + FL.c / Z });
const KundliFloor: React.FC<{ f: number; pulse: number }> = ({ f, pulse }) => {
  const { half: h, zn, zf } = FL;
  const zm = (zn + zf) / 2;
  const P = {
    nl: proj(-h, zn),
    nr: proj(h, zn),
    fr: proj(h, zf),
    fl: proj(-h, zf),
    mn: proj(0, zn),
    mr: proj(h, zm),
    mf: proj(0, zf),
    ml: proj(-h, zm),
  };
  const L = (a: { x: number; y: number }, b: { x: number; y: number }) => `M${a.x} ${a.y}L${b.x} ${b.y}`;
  const d = [L(P.nl, P.nr), L(P.nr, P.fr), L(P.fr, P.fl), L(P.fl, P.nl), L(P.nl, P.fr), L(P.nr, P.fl), L(P.mn, P.mr), L(P.mr, P.mf), L(P.mf, P.ml), L(P.ml, P.mn)].join(" ");
  const runners = [0, 1, 2, 3, 4, 5].map((i) => {
    const t = (f * 0.012 + i / 6) % 1;
    const along = i % 2 === 0 ? [-h + 2 * h * t, zn + (zf - zn) * t] : [h - 2 * h * t, zn + (zf - zn) * t];
    return proj(along[0], along[1]);
  });
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs>
        <linearGradient id="dn-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2A1150" stopOpacity="0.9" />
          <stop offset="1" stopColor="#140726" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <path d={`M${P.nl.x} ${P.nl.y}L${P.nr.x} ${P.nr.y}L${P.fr.x} ${P.fr.y}L${P.fl.x} ${P.fl.y}Z`} fill="url(#dn-floor)" />
      <path d={d} fill="none" stroke="#F2C14E" strokeWidth={22} opacity={0.16 + 0.22 * pulse} strokeLinecap="round" />
      <path d={d} fill="none" stroke="#FFE7A8" strokeWidth={6} opacity={0.75 + 0.25 * pulse} strokeLinecap="round" />
      {runners.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4 + (p.y - FL.hz) * 0.012} fill="#FFFFFF" opacity={0.8} />
      ))}
    </svg>
  );
};

const Beams: React.FC<{ f: number; pulse: number }> = ({ f, pulse }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="dn-beam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFF4C8" stopOpacity="0.55" />
        <stop offset="1" stopColor="#FFF4C8" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="dn-beamP" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FF7AD0" stopOpacity="0.45" />
        <stop offset="1" stopColor="#FF7AD0" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="dn-beamB" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7FB0FF" stopOpacity="0.5" />
        <stop offset="1" stopColor="#7FB0FF" stopOpacity="0" />
      </linearGradient>
    </defs>
    {[
      { x: 120, a: 18, g: "dn-beam", ph: 0 },
      { x: 960, a: -18, g: "dn-beam", ph: 1.4 },
      { x: 330, a: 8, g: "dn-beamP", ph: 2.2 },
      { x: 750, a: -8, g: "dn-beamB", ph: 3.1 },
    ].map((bm, i) => {
      const sw = Math.sin(f / 11 + bm.ph) * 16 + bm.a;
      return (
        <g key={i} transform={`rotate(${sw} ${bm.x} -40)`} opacity={0.55 + 0.45 * pulse}>
          <path d={`M${bm.x - 26} -40 L${bm.x + 26} -40 L${bm.x + 230} 1900 L${bm.x - 230} 1900Z`} fill={`url(#${bm.g})`} />
        </g>
      );
    })}
  </svg>
);

const NeonSign: React.FC<{ f: number; pulse: number }> = ({ f, pulse }) => {
  const flick = 0.92 + 0.08 * Math.sin(f * 1.3);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 236, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <Img
        src={staticFile("jyotiq/logo-wordmark.png")}
        style={{ width: 470, height: 144, opacity: flick, transform: `scale(${1 + 0.035 * pulse})`, filter: `drop-shadow(0 0 ${12 + 20 * pulse}px rgba(255,140,170,0.85)) drop-shadow(0 0 ${30 + 30 * pulse}px rgba(240,184,72,0.6))` }}
      />
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: 8, color: "#FFE7A8", textShadow: `0 0 ${12 + 14 * pulse}px rgba(240,184,72,0.9)` }}>🪩 LIVE FROM YOUR KUNDLI</div>
    </div>
  );
};

/** The full 1080 x 1920 dance floor; also rendered (scaled) on the phone. */
export const DanceStage: React.FC<{ f: number }> = ({ f }) => {
  const pulse = onBeat(f, 10);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#0A0626" }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #0A0626 0%, #1B0F4E 36%, #3A1670 62%, #160830 100%)" }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 34% at 50% 58%, rgba(240,120,200,${0.22 + 0.18 * pulse}) 0%, transparent 70%)` }} />
      <StarDust f={f} count={120} opacity={0.85} seed="dn" />
      <Beams f={f} pulse={pulse} />
      <KundliFloor f={f} pulse={pulse} />
      <NeonSign f={f} pulse={pulse} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {/* top: the shadow pair */}
        <Dancer id="rahu" f={f} x={238} ground={760} scale={0.5} off={1} />
        <Dancer id="ketu" f={f} x={842} ground={1010} scale={0.4} off={2} dance={false} />
        {/* back row */}
        <Dancer id="chandra" f={f} x={150} ground={1250} scale={0.45} off={0} dance={false} />
        <Dancer id="guru" f={f} x={385} ground={1215} scale={0.45} off={1} dance={false} />
        <Dancer id="shukra" f={f} x={695} ground={1215} scale={0.45} off={2} dance={false} />
        <Dancer id="budh" f={f} x={930} ground={1250} scale={0.45} off={3} />
        {/* front row (Mangal after Shani so the headlight beam passes behind him) */}
        <Dancer id="surya" f={f} x={168} ground={1790} scale={0.5} off={0} />
        <ShaniDance f={f} x={560} ground={1760} scale={0.46} />
        <Dancer id="mangal" f={f} x={912} ground={1790} scale={0.5} off={2} />
        {/* confetti stars on the beat */}
        {new Array(16).fill(0).map((_, i) => {
          const life = ((f - E2.beats[0]) * 0.9 + i * 11) % 60;
          const x = (i * 197 + 80) % 1080 + wob(`cf${i}`, f / 9) * 30;
          const y = -40 + life * 34;
          return <path key={i} d={starPath(x, y, 14, 5, 4, f * 6 + i * 40)} fill={i % 3 === 0 ? "#FFE27A" : i % 3 === 1 ? "#FF9ACB" : "#9FD1FF"} opacity={0.85} />;
        })}
      </svg>
      <AbsoluteFill style={{ background: "#FFFFFF", opacity: onBeat(f, 4) * 0.08, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* The phone in the kid's hand                                         */
/* ------------------------------------------------------------------ */

/** Device-px rect of the dance area inside the app (724-wide device, below the app header). */
const AREA = { y: 180, h: 1287 };
const STAGE_K = 724 / 1080;

const DanceApp: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ background: "#15120E", fontFamily: SANS }}>
    <StatusBar time="11:59" />
    <div style={{ position: "absolute", left: 0, top: 80, width: 724, height: 100, borderBottom: "2px solid #2A241B", display: "flex", alignItems: "center", gap: 16, paddingLeft: 26, boxSizing: "border-box" }}>
      <svg viewBox="0 0 24 24" width={42} height={42}>
        <path d={ICONS.back} fill="#EADBB4" />
      </svg>
      <Img src={staticFile("jyotiq/logo-icon.png")} style={{ width: 70, height: 58 }} />
      <div style={{ fontFamily: CORMORANT, fontWeight: 700, fontSize: 44, color: "#EADBB4", letterSpacing: 2 }}>Jyotiq</div>
      <div style={{ marginLeft: "auto", marginRight: 24, padding: "8px 18px", borderRadius: 30, background: "rgba(232,40,60,0.16)", border: "2px solid #E8283C", color: "#FFB3BC", fontSize: 26, fontWeight: 800, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 14, height: 14, borderRadius: 7, background: "#E8283C", opacity: 0.55 + 0.45 * Math.sin(f / 3) }} />
        Kundli LIVE
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, top: AREA.y, width: 724, height: AREA.h, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${STAGE_K})`, transformOrigin: "0 0" }}>
        <DanceStage f={f} />
      </div>
    </div>
    <SysNav top={1490} bg="#000" />
  </AbsoluteFill>
);

/** Phone group placement in the final reveal frame: scale about P0, then move to P1. */
const G = { s: 0.86, p0: { x: 540, y: 1300 }, p1: { x: 540, y: 1366 } };
const gMap = (x: number, y: number) => ({ x: G.s * (x - G.p0.x) + G.p1.x, y: G.s * (y - G.p0.y) + G.p1.y });
// dance-area centre + width on the canvas once the phone is in place
const AREA_C = gMap(SCR.x + 362 * K, SCR.y + (AREA.y + AREA.h / 2) * K);
const AREA_W = 724 * K * G.s;
const Z0 = 1080 / AREA_W; // zoom at which the app's dance area exactly fills the frame

const Word: React.FC<{ f: number; at: number; text: string; color?: string; size?: number; rot?: number }> = ({ f, at, text, color = "#FFFFFF", size = 138, rot = 0 }) => {
  const v = pop(f, at, 7);
  if (f < at) return null;
  return (
    <span
      style={{
        display: "inline-block",
        margin: "0 14px",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1,
        color,
        WebkitTextStroke: `10px ${INK}`,
        paintOrder: "stroke fill",
        textShadow: `0 10px 0 ${INK}, 0 0 40px rgba(240,184,72,0.55)`,
        transform: `translateY(${(1 - v) * 60}px) scale(${0.5 + 0.5 * v + 0.12 * hit(f, at, 6)}) rotate(${rot}deg)`,
        opacity: Math.min(1, v * 2),
      }}
    >
      {text}
    </span>
  );
};

export const S4Ending: React.FC<{ f: number }> = ({ f }) => {
  // A: full-frame dance floor (with a beat-pumped camera)
  if (f < E2.converge + 2) {
    const pulse = onBeat(f, 9);
    const push = ramp(f, E2.beats[2], E2.converge, "in");
    const enter = 1 - ramp(f, E2.dance, E2.dance + 8, "out");
    return (
      <AbsoluteFill style={{ overflow: "hidden", background: "#0A0626" }}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${1.0 + 0.025 * pulse + 0.06 * push + 0.12 * enter}) rotate(${Math.sin(f / 9) * 0.8}deg)`, transformOrigin: "540px 1250px" }}>
          <DanceStage f={f} />
        </div>
        <FocusLines f={f} cx={540} cy={1180} rx={480} ry={720} color="#FFFFFF" opacity={0.22 * pulse + 0.3 * enter} count={80} seed="dnf" />
      </AbsoluteFill>
    );
  }
  // B + C: pull back from the dance area to the phone in the kid's hand
  const u = ramp(f, E2.converge + 2, E2.reveal, "io");
  const Z = Math.exp(Math.log(Z0) * (1 - u)) * (1 + 0.025 * ramp(f, E2.reveal, E2.lock, "lin"));
  const C = { x: 540, y: AREA_C.y + (960 - AREA_C.y) * u };
  const settle = hit(f, E2.reveal, 10);
  const cam = `translate(540px, ${960 + settle * 10}px) scale(${Z}) translate(${-C.x}px, ${-C.y}px) rotate(${(1 - u) * -3}deg)`;
  const glow = 0.85 + 0.15 * Math.sin(f / 4);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#0A0816" }}>
      <div style={{ position: "absolute", inset: 0, transform: cam, transformOrigin: "0 0" }}>
        <Bedroom f={f} glow={glow} moon={false} />
        <div style={{ position: "absolute", inset: 0, transform: `translate(${G.p1.x}px, ${G.p1.y}px) scale(${G.s}) translate(${-G.p0.x}px, ${-G.p0.y}px)`, transformOrigin: "0 0" }}>
          <PalmBack />
          <PhoneFrame>
            <DanceApp f={f} />
          </PhoneFrame>
          <FingersFront />
          <Thumb B={{ x: 1130, y: 1760 }} T={{ x: 935, y: 1270 + wob("th", f / 8) * 6 }} press={0} />
          <AbsoluteFill style={{ background: "radial-gradient(ellipse 46% 36% at 50% 62%, rgba(255,140,220,0.16) 0%, transparent 70%)" }} />
        </div>
      </div>
      {/* speed lines while the camera pulls back */}
      {u < 0.98 ? <SpeedLines f={f} angle={90} count={50} color="#FFFFFF" opacity={0.35 * Math.sin(u * Math.PI)} speed={-90} seed="pb" /> : null}
      {/* night falls over the room behind the text so it reads cleanly */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(6,5,16,0.92) 0%, rgba(6,5,16,0.82) 26%, rgba(6,5,16,0.35) 36%, transparent 44%)", opacity: u }} />
      {/* "kha se aate hai" on the vocal */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transform: "rotate(-4deg)" }}>
        <div>
          <Word f={f} at={E2.words.kha} text="kha" />
          <Word f={f} at={E2.words.se} text="se" />
        </div>
        <div>
          <Word f={f} at={E2.words.aate} text="aate" color={GOLD} />
          <Word f={f} at={E2.words.hai} text="hai" color={GOLD} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
