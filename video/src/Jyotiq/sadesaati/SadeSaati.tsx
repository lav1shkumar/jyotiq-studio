import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont as loadRozha } from "@remotion/google-fonts/RozhaOne";
import { CORMORANT, DEVA } from "../bbreel/fonts";

/* "शनि की साढ़े साती" — Brihat Parashara Hora Shastra narrator Reel.
   Seven Google Flow clips (24 fps, 1080x1920) cut to the ElevenLabs VO, with
   Samay-style captions, beat graphics, a top-right Jyotiq mark and a
   book -> phone -> Jyotiq ending. All times below are VO seconds. */

const ROZHA = loadRozha("normal", { weights: ["400"], subsets: ["devanagari", "latin"] }).fontFamily;

export const SS_FPS = 24;
const s = (sec: number) => Math.round(sec * SS_FPS);
export const SS_TOTAL = s(31.5);

const GOLD = "#E6B45A";
const GOLD_HI = "#FFD98A";
const CREAM = "#FFF6E2";
const XF = 6; // crossfade frames

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ramp = (f: number, a: number, b: number, from = 0, to = 1, easing = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [a, b], [from, to], { ...clamp, easing });

/* ------------------------------------------------------------------ */
/* Shots: seq = when the layer starts (XF before the cut), clip = the   */
/* source time at that moment, end = when the layer stops.              */
/* ------------------------------------------------------------------ */
type Shot = { src: string; seq: number; end: number; clip: number; rate?: number; zoom: [number, number]; origin?: string };

const SHOTS: Shot[] = [
  { src: "s1_manuscript.mp4", seq: 0, end: s(3.35), clip: 0.3, zoom: [1.0, 1.05] },
  { src: "s2_saturn.mp4", seq: s(3.35) - XF, end: s(7.25), clip: 5.8, zoom: [1.0, 1.03] },
  // shot 3: the Saturn pass re-used, punched in (capped at 1.12 so Flow's corner mark stays in frame)
  { src: "s2_saturn.mp4", seq: s(7.25) - XF, end: s(11.8), clip: 1.49, zoom: [1.12, 1.12], origin: "540px 950px" },
  { src: "s4_stardust.mp4", seq: s(11.8) - XF, end: s(16.1), clip: 3.35, zoom: [1.0, 1.04] },
  { src: "s5_grid.mp4", seq: s(16.1) - XF, end: s(21.55), clip: 4.2, zoom: [1.0, 1.03] },
  { src: "s6_fish.mp4", seq: s(21.55) - XF, end: s(25.55), clip: 5.65, zoom: [1.0, 1.04] },
  // book -> white phone-shaped light, sped up so the phone is formed before "Jyotiq ऐप में देखो"
  { src: "s7_phone.mp4", seq: s(25.55) - XF, end: s(29.4), clip: 3.7, rate: 1.5, zoom: [1.0, 1.0] },
];

const ShotLayer: React.FC<{ shot: Shot; first: boolean }> = ({ shot, first }) => {
  const f = useCurrentFrame();
  const dur = shot.end - shot.seq;
  const opacity = first ? 1 : ramp(f, 0, XF, 0, 1, Easing.linear);
  const z = interpolate(f, [0, dur], shot.zoom, clamp);
  return (
    <AbsoluteFill style={{ opacity, transform: `scale(${z})`, transformOrigin: shot.origin ?? "50% 50%" }}>
      <OffthreadVideo
        src={staticFile(`sadesaati/${shot.src}`)}
        trimBefore={Math.round(shot.clip * SS_FPS)}
        playbackRate={shot.rate ?? 1}
        muted
        style={{ width: 1080, height: 1920, objectFit: "cover", filter: "contrast(1.05) saturate(1.08)" }}
      />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Captions (Samay style: heavy white Devanagari, drawn gold underline) */
/* `*word*` = gold.                                                     */
/* ------------------------------------------------------------------ */
type Seg = { t: string; at: number };
type Card = { from: number; to: number; lines: Seg[][] };

const CARDS: Card[] = [
  { from: 0, to: s(3.3), lines: [[{ t: "मैं *बृहत् पाराशर*", at: 0 }], [{ t: "*होरा शास्त्र* हूँ...", at: 0 }]] },
  { from: s(3.4), to: s(7.2), lines: [[{ t: "*शनि*...", at: s(3.45) }], [{ t: "हर राशि में *ढाई वर्ष* ठहरता है।", at: s(4.45) }]] },
  {
    from: s(7.3),
    to: s(11.75),
    lines: [[{ t: "तुम्हारी *चंद्र राशि* के पीछे...", at: s(7.35) }], [{ t: "उसी पर...", at: s(9.78) }, { t: " और आगे —", at: s(10.8) }]],
  },
  { from: s(11.85), to: s(16.05), lines: [[{ t: "*साढ़े सात वर्ष*...", at: s(11.85) }], [{ t: "जिसे तुम *साढ़े साती* कहते हो।", at: s(13.65) }]] },
  { from: s(16.15), to: s(17.62), lines: [[{ t: "यह *दंड नहीं*...", at: s(16.2) }]] },
  { from: s(17.66), to: s(21.5), lines: [[{ t: "इसका फल मेरे *अष्टकवर्ग* के", at: s(17.7) }], [{ t: "*बिंदु* बताते हैं।", at: s(18.9) }]] },
  { from: s(21.6), to: s(25.5), lines: [[{ t: "अभी शनि *मीन* में है...", at: s(21.7) }], [{ t: "और तुम्हारी *चंद्र राशि*?", at: s(23.6) }]] },
  { from: s(25.65), to: SS_TOTAL, lines: [[{ t: "अपनी कुंडली का यह *रहस्य* जानना है?", at: s(25.7) }], [{ t: "*Jyotiq* ऐप में देखो।", at: s(28.28) }]] },
];

const Rich: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split("*").map((p, i) =>
      i % 2 ? (
        <span key={i} style={{ color: GOLD_HI }}>
          {p}
        </span>
      ) : (
        <React.Fragment key={i}>{p}</React.Fragment>
      ),
    )}
  </>
);

const CaptionCard: React.FC<{ card: Card; f: number }> = ({ card, f }) => {
  if (f < card.from - 1 || f > card.to) return null;
  const out = card.to >= SS_TOTAL ? 1 : ramp(f, card.to - 5, card.to, 1, 0, Easing.linear);
  return (
    <div style={{ position: "absolute", left: 50, right: 50, bottom: 420, textAlign: "center", opacity: out, textWrap: "balance" }}>
      {card.lines.map((line, li) => {
        const lineAt = line[0].at;
        const draw = ramp(f, lineAt + 2, lineAt + 14, 0, 1, Easing.out(Easing.cubic));
        return (
          <div key={li} style={{ marginTop: li ? 6 : 0 }}>
            <span
              style={{
                fontFamily: ROZHA,
                fontSize: 70,
                lineHeight: 1.28,
                color: CREAM,
                textShadow: "0 3px 0 rgba(0,0,0,0.55), 0 0 26px rgba(0,0,0,0.85)",
                paddingBottom: 12,
                backgroundImage: `linear-gradient(to top, ${GOLD} 0px, ${GOLD} 7px, rgba(20,10,0,0.7) 7px, rgba(20,10,0,0.7) 10px, transparent 10px)`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left bottom",
                backgroundSize: `${draw * 100}% 100%`,
                WebkitBoxDecorationBreak: "clone",
                boxDecorationBreak: "clone",
              }}
            >
              {line.map((seg, si) => {
                const a = ramp(f, seg.at, seg.at + 5, 0, 1, Easing.out(Easing.cubic));
                return (
                  <span
                    key={si}
                    style={{
                      opacity: a,
                      display: "inline-block",
                      transform: `translateY(${(1 - a) * 16}px)`,
                      filter: `blur(${(1 - a) * 6}px)`,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    <Rich text={seg.t} />
                  </span>
                );
              })}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Shot 3 graphics: the sign behind the Moon, the Moon's own, the next  */
/* ------------------------------------------------------------------ */
const SLOTS = [
  { x: 300, at: s(7.4), label: "पिछली राशि", moon: false },
  { x: 540, at: s(9.81), label: "चंद्र राशि", moon: true },
  { x: 780, at: s(10.84), label: "अगली राशि", moon: false },
];
// a "rashi track" just above Saturn's path (Saturn crosses at y~926), so the signs read clearly
const SLOT_Y = 640;

const MoonSlots: React.FC<{ f: number }> = ({ f }) => {
  const a = s(7.1);
  const b = s(11.75);
  if (f < a || f > b) return null;
  const vis = Math.min(ramp(f, a, a + 8), ramp(f, b - 6, b, 1, 0));
  return (
    <AbsoluteFill style={{ opacity: vis }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="slotGlow">
            <stop offset="0%" stopColor={GOLD_HI} stopOpacity={0.55} />
            <stop offset="60%" stopColor={GOLD} stopOpacity={0.18} />
            <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
          </radialGradient>
          <mask id="crescent">
            <rect x={0} y={0} width={1080} height={1920} fill="black" />
            <circle cx={540} cy={SLOT_Y} r={40} fill="white" />
            <circle cx={558} cy={SLOT_Y - 11} r={35} fill="black" />
          </mask>
        </defs>
        <line x1={300} y1={SLOT_Y} x2={780} y2={SLOT_Y} stroke="rgba(230,180,90,0.35)" strokeWidth={2} strokeDasharray="6 10" />
        {SLOTS.map((sl) => {
          const lit = ramp(f, sl.at - 2, sl.at + 8);
          const pulse = Math.exp(-Math.max(0, f - sl.at) / 7) * (f >= sl.at ? 1 : 0);
          return (
            <g key={sl.x}>
              <circle cx={sl.x} cy={SLOT_Y} r={120 + 30 * pulse} fill="url(#slotGlow)" opacity={lit} />
              <circle cx={sl.x} cy={SLOT_Y} r={64} fill="rgba(10,6,30,0.35)" stroke="rgba(255,255,255,0.45)" strokeWidth={3} opacity={1 - lit} />
              <circle cx={sl.x} cy={SLOT_Y} r={64 + 8 * pulse} fill="rgba(230,180,90,0.14)" stroke={GOLD_HI} strokeWidth={4} opacity={lit} />
            </g>
          );
        })}
        <circle cx={540} cy={SLOT_Y} r={40} fill="#F6EFD9" mask="url(#crescent)" style={{ filter: "drop-shadow(0 0 14px rgba(255,240,200,0.95))" }} />
      </svg>
      {SLOTS.map((sl) => {
        const lit = ramp(f, sl.at, sl.at + 8);
        return (
          <div
            key={sl.label}
            style={{
              position: "absolute",
              left: sl.x - 140,
              width: 280,
              top: SLOT_Y + 82,
              textAlign: "center",
              fontFamily: DEVA,
              fontWeight: 700,
              fontSize: 34,
              color: sl.moon ? GOLD_HI : CREAM,
              opacity: lit * 0.92,
              textShadow: "0 2px 10px rgba(0,0,0,0.9)",
            }}
          >
            {sl.label}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Shot 4 graphics: three 2½-year arcs close into 7½                    */
/* ------------------------------------------------------------------ */
const CX = 530;
const CY = 940;
const R = 250;
const arcPath = (a0: number, a1: number) => {
  const p = (a: number) => [CX + R * Math.cos((a * Math.PI) / 180), CY + R * Math.sin((a * Math.PI) / 180)];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  return `M ${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1}`;
};

const SevenHalf: React.FC<{ f: number }> = ({ f }) => {
  const a = s(11.75);
  const b = s(16.05);
  if (f < a || f > b) return null;
  const vis = Math.min(ramp(f, a, a + 6), ramp(f, b - 6, b, 1, 0));
  const num = ramp(f, s(12.0), s(12.6), 0, 1, Easing.out(Easing.back(1.4)));
  const sum = ramp(f, s(13.35), s(13.75));
  return (
    <AbsoluteFill style={{ opacity: vis }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 0 10px rgba(255,200,110,0.8))" }}>
        {[0, 1, 2].map((k) => {
          const start = -90 + k * 120 + 4;
          const p = ramp(f, s(11.95) + k * s(0.42), s(11.95) + (k + 1) * s(0.42), 0, 1, Easing.inOut(Easing.quad));
          return (
            <path
              key={k}
              d={arcPath(start, start + 112)}
              pathLength={1}
              fill="none"
              stroke={GOLD_HI}
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray="1 1"
              strokeDashoffset={1 - p}
            />
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          left: CX - 300,
          width: 600,
          top: CY - 150,
          textAlign: "center",
          fontFamily: CORMORANT,
          fontWeight: 700,
          fontSize: 250,
          lineHeight: "300px",
          color: GOLD_HI,
          opacity: num,
          transform: `scale(${0.7 + 0.3 * num})`,
          WebkitTextStroke: "3px rgba(70,35,0,0.75)",
          paintOrder: "stroke fill",
          textShadow: "0 4px 18px rgba(0,0,0,0.85), 0 0 46px rgba(255,180,80,0.55)",
        }}
      >
        7½
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: CY + R + 18,
          textAlign: "center",
          fontFamily: DEVA,
          fontWeight: 700,
          fontSize: 38,
          color: CREAM,
          opacity: sum,
          letterSpacing: 1,
          textShadow: "0 2px 12px rgba(0,0,0,0.9)",
        }}
      >
        2½ + 2½ + 2½ वर्ष
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Ending: the white light becomes a phone, the knowledge lives in Jyotiq */
/* ------------------------------------------------------------------ */
const RECT = { x: 229, y: 368, w: 620, h: 1189, r: 70 };
const RCX = RECT.x + RECT.w / 2;
const RCY = RECT.y + RECT.h / 2;
const BEZEL = 16;

export const EndBackdrop: React.FC<{ f: number }> = ({ f }) => {
  const o = ramp(f, s(27.55), s(27.85), 0, 1, Easing.linear);
  if (o <= 0) return null;
  const spin = interpolate(f, [s(27.5), SS_TOTAL], [0, 22], clamp);
  const stars = new Array(80).fill(0).map((_, i) => ({
    x: random(`ssx${i}`) * 1080,
    y: random(`ssy${i}`) * 1920,
    r: 1.2 + random(`ssr${i}`) * 2.6,
    o: 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(f / (6 + random(`sst${i}`) * 10) + i)),
  }));
  return (
    <AbsoluteFill style={{ opacity: o, background: "radial-gradient(120% 80% at 50% 44%, #2B1859 0%, #140B33 52%, #07041A 100%)" }}>
      {stars.map((st, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: st.x,
            top: st.y,
            width: st.r,
            height: st.r,
            borderRadius: "50%",
            background: "#fff",
            opacity: st.o * 0.8,
            boxShadow: `0 0 ${st.r * 3}px rgba(255,255,255,0.7)`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 540 - 480,
          top: 860 - 480,
          width: 960,
          height: 960,
          borderRadius: "50%",
          border: "1.5px solid rgba(230,180,90,0.45)",
          transform: `rotate(${spin}deg)`,
          boxShadow: "inset 0 0 80px rgba(230,180,90,0.08)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 540 - 360,
          top: 860 - 360,
          width: 720,
          height: 720,
          borderRadius: "50%",
          border: "1.5px dashed rgba(230,180,90,0.28)",
          transform: `rotate(${-spin * 1.5}deg)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 540 - 420,
          top: 860 - 520,
          width: 840,
          height: 1040,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(230,180,90,0.22), rgba(230,180,90,0))",
        }}
      />
    </AbsoluteFill>
  );
};

const Pill: React.FC<{ small: string; big: string }> = ({ small, big }) => (
  <div
    style={{
      width: 262,
      height: 92,
      borderRadius: 20,
      border: "2px solid #8A7442",
      background: "linear-gradient(180deg, #221C14, #16120D)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 0 18px rgba(230,180,90,0.15)",
    }}
  >
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 17, letterSpacing: 2, color: "#B8A57A", fontWeight: 600 }}>{small}</div>
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 33, color: CREAM, fontWeight: 700, marginTop: 2 }}>{big}</div>
  </div>
);

/** The Jyotiq screen, laid out at the light-rectangle's own size (620 x 1189). */
const JyotiqScreen: React.FC<{ t: number }> = ({ t }) => {
  const a = interpolate(t, [0, 10], [0, 1], clamp);
  const logoIn = interpolate(t, [0, 14], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.3)) });
  const breathe = 1 + 0.025 * Math.sin(t / 6);
  const below = interpolate(t, [10, 20], [0, 1], clamp);
  const pills = interpolate(t, [18, 28], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(90% 60% at 50% 38%, #2A2117 0%, #15120E 70%)" }}>
      {[150, 205, 270].map((r, i) => (
        <div
          key={r}
          style={{
            position: "absolute",
            left: 310 - r,
            top: 420 - r,
            width: r * 2,
            height: r * 2,
            borderRadius: "50%",
            border: "2px solid #3A2F20",
            opacity: (0.95 - i * 0.25) * a,
            transform: `scale(${0.9 + 0.1 * a + 0.02 * Math.sin(t / 7 + i)})`,
          }}
        />
      ))}
      <Img
        src={staticFile("jyotiq/logo-icon.png")}
        style={{
          position: "absolute",
          left: 310 - 135,
          top: 420 - 111,
          width: 270,
          height: 222,
          opacity: logoIn,
          transform: `scale(${(0.75 + 0.25 * logoIn) * breathe})`,
          filter: `drop-shadow(0 0 ${26 + 10 * Math.sin(t / 5)}px rgba(230,180,90,0.45))`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 640,
          textAlign: "center",
          fontFamily: CORMORANT,
          fontWeight: 700,
          fontSize: 76,
          letterSpacing: 22,
          paddingLeft: 22,
          color: "#D9BC72",
          opacity: below,
        }}
      >
        JYOTIQ
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 742, textAlign: "center", fontFamily: CORMORANT, fontStyle: "italic", fontWeight: 600, fontSize: 34, color: "#A8987A", opacity: below }}>
        Vedic Wisdom, Modern Clarity
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 812, textAlign: "center", fontFamily: DEVA, fontSize: 28, color: "#8E8574", opacity: below }}>
        तमसो मा ज्योतिर्गमय
      </div>
      <div style={{ position: "absolute", left: 150, right: 150, top: 880, height: 2, background: "linear-gradient(90deg, transparent, #8A7442, transparent)", opacity: below }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 930,
          display: "flex",
          justifyContent: "center",
          gap: 20,
          opacity: pills,
          transform: `translateY(${(1 - pills) * 16}px)`,
        }}
      >
        <Pill small="GET IT ON" big="Google Play" />
        <Pill small="DOWNLOAD ON THE" big="App Store" />
      </div>
    </AbsoluteFill>
  );
};

export const PhoneEnding: React.FC<{ f: number }> = ({ f }) => {
  const bezel = ramp(f, s(27.25), s(27.55), 0, 1, Easing.out(Easing.cubic));
  if (bezel <= 0) return null;
  const reveal = ramp(f, s(27.5), s(27.9), 0, 1, Easing.inOut(Easing.quad)); // white -> app
  const shrink = ramp(f, s(27.75), s(28.3), 0, 1, Easing.inOut(Easing.cubic));
  const scale = interpolate(shrink, [0, 1], [1, 0.66]);
  const cy = interpolate(shrink, [0, 1], [RCY, 860]);
  const bezelGrow = interpolate(bezel, [0, 1], [1.05, 1]);
  return (
    <div
      style={{
        position: "absolute",
        left: RCX - RECT.w / 2 - BEZEL,
        top: cy - RECT.h / 2 - BEZEL,
        width: RECT.w + 2 * BEZEL,
        height: RECT.h + 2 * BEZEL,
        transform: `scale(${scale})`,
        transformOrigin: "50% 50%",
      }}
    >
      {/* gold aura behind the device */}
      <div
        style={{
          position: "absolute",
          inset: -60,
          borderRadius: RECT.r + 60,
          background: "radial-gradient(closest-side, rgba(230,180,90,0.35), rgba(230,180,90,0))",
          opacity: bezel,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: RECT.r + BEZEL,
          background: "linear-gradient(140deg, #5A4C33 0%, #1A1712 18%, #0B0A08 60%, #3A3122 100%)",
          boxShadow: "0 40px 90px rgba(0,0,0,0.6), 0 0 0 2px #050404, inset 0 0 0 2px rgba(230,180,90,0.45)",
          opacity: bezel,
          transform: `scale(${bezelGrow})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: BEZEL,
          top: BEZEL,
          width: RECT.w,
          height: RECT.h,
          borderRadius: RECT.r,
          overflow: "hidden",
          background: "#D4D2D8",
          opacity: bezel,
        }}
      >
        <AbsoluteFill style={{ opacity: reveal }}>
          <JyotiqScreen t={f - s(27.6)} />
        </AbsoluteFill>
        {/* the light collapsing into the screen */}
        <AbsoluteFill
          style={{
            background: "radial-gradient(70% 55% at 50% 40%, rgba(255,250,235,1), rgba(240,236,245,0.9))",
            opacity: 1 - reveal,
          }}
        />
        <div style={{ position: "absolute", left: RECT.w / 2 - 11, top: 18, width: 22, height: 22, borderRadius: 11, background: "#050506", opacity: reveal }} />
        <AbsoluteFill style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.08) 0%, transparent 32%, transparent 70%, rgba(255,255,255,0.05) 100%)" }} />
      </div>
    </div>
  );
};

/** Gold sparks thrown off the light as it becomes the phone. */
export const Sparks: React.FC<{ f: number }> = ({ f }) => {
  const a = s(27.05);
  const b = s(28.1);
  if (f < a || f > b) return null;
  const p = (f - a) / (b - a);
  return (
    <AbsoluteFill>
      {new Array(46).fill(0).map((_, i) => {
        const r = (k: string) => random(`spk-${k}-${i}`);
        const side = Math.floor(r("s") * 4);
        const u = r("u");
        const x0 = side === 0 ? RECT.x + u * RECT.w : side === 1 ? RECT.x + RECT.w : side === 2 ? RECT.x + u * RECT.w : RECT.x;
        const y0 = side === 0 ? RECT.y : side === 1 ? RECT.y + u * RECT.h : side === 2 ? RECT.y + RECT.h : RECT.y + u * RECT.h;
        const ang = Math.atan2(y0 - RCY, x0 - RCX) + (r("a") - 0.5) * 0.8;
        const dist = (60 + r("d") * 220) * Easing.out(Easing.cubic)(p);
        const size = 3 + r("z") * 6;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x0 + Math.cos(ang) * dist,
              top: y0 + Math.sin(ang) * dist,
              width: size,
              height: size,
              borderRadius: "50%",
              background: i % 3 ? GOLD_HI : "#FFFFFF",
              opacity: (1 - p) * (0.6 + 0.4 * r("o")),
              boxShadow: `0 0 ${size * 3}px rgba(255,210,120,0.9)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Full reel                                                            */
/* ------------------------------------------------------------------ */
export const SadeSaatiReel: React.FC<{ withAudio?: boolean }> = ({ withAudio = true }) => {
  const f = useCurrentFrame();
  const titleO = ramp(f, s(2.9), s(3.25), 1, 0, Easing.linear);
  return (
    <AbsoluteFill style={{ background: "#07041A" }}>
      {SHOTS.map((shot, i) => (
        <Sequence key={i} from={shot.seq} durationInFrames={shot.end - shot.seq} layout="none">
          <ShotLayer shot={shot} first={i === 0} />
        </Sequence>
      ))}

      {/* grade: soft vignette over the footage */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 62% at 50% 46%, transparent 55%, rgba(4,2,14,0.42) 100%)" }} />

      <MoonSlots f={f} />
      <SevenHalf f={f} />

      <EndBackdrop f={f} />
      <Sparks f={f} />
      <PhoneEnding f={f} />

      {/* caption scrim, lower-middle */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(to bottom, transparent 58%, rgba(6,4,18,0.5) 68%, rgba(6,4,18,0.58) 78%, transparent 88%)",
        }}
      />

      {/* sound-off topic line on the hook */}
      {titleO > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 236,
            textAlign: "center",
            fontFamily: ROZHA,
            fontSize: 50,
            color: GOLD_HI,
            opacity: titleO,
            letterSpacing: 1,
            textShadow: "0 0 18px rgba(0,0,0,0.9), 0 2px 0 rgba(0,0,0,0.6)",
          }}
        >
          <span style={{ opacity: 0.7 }}>✦ </span>शनि की साढ़े साती<span style={{ opacity: 0.7 }}> ✦</span>
        </div>
      ) : null}

      {CARDS.map((c, i) => (
        <CaptionCard key={i} card={c} f={f} />
      ))}

      {/* Jyotiq mark, top-right (below Instagram's header/camera icon) */}
      <Img
        src={staticFile("jyotiq/logo-full.png")}
        style={{
          position: "absolute",
          right: 40,
          top: 168,
          width: 128,
          height: (128 * 511) / 444,
          opacity: 0.96,
          filter: "drop-shadow(0 0 14px rgba(230,180,90,0.35)) drop-shadow(0 4px 10px rgba(0,0,0,0.65))",
        }}
      />

      {withAudio ? <Audio src={staticFile("sadesaati/mix.wav")} /> : null}
    </AbsoluteFill>
  );
};
