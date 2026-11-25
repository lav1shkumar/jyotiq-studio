import React from "react";
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadTiro } from "@remotion/google-fonts/TiroDevanagariHindi";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";

/* नरसिंह: aesthetic music reel (17 Nov 2026). Music only, in the look of Ayush's three "reel tester"
   references: pastel pink / cream / gold, glitter, film grain, centred hero framing, a hard cut on the beat.
   The song is reel tester 2's own audio, and the cuts sit on that reel's measured cut points, so every cut lands
   where the reference editor put it. Clips: Veo 3.1 from narasimha-aesthetic/public/clips (copied to public/narasimha).
   Clean frame (Ayush, 17 Nov): no brand open, no logo bug or app panel during the story; Jyotiq appears on the end card only. */

const { fontFamily: TIRO } = loadTiro("normal", { weights: ["400"], subsets: ["devanagari", "latin"] });
const { fontFamily: PLAYFAIR } = loadPlayfair("normal", { weights: ["600"], subsets: ["latin"] });

export const NS_FPS = 30;
const s = (t: number) => Math.round(t * NS_FPS);
export const NS_TOTAL = s(39.76);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const P = "narasimha/";

/* The cut points of reel tester 2 (ffmpeg scene detection), i.e. its edit on this song. */
const CUTS = [0, 0.633, 1.9, 3.167, 4.833, 6.9, 8.833, 10.833, 13.333, 15.8, 18.0, 19.867, 21.8, 23.733, 26.167, 28.033, 31.967, 39.76];

type Shot = { id: string; trim: number; rate: number; zoom: [number, number]; flash?: boolean };
const SHOTS: Shot[] = [
  { id: "s01_grip", trim: 0.6, rate: 0.8, zoom: [1.06, 1.1] },
  { id: "s02_throne", trim: 0.3, rate: 0.8, zoom: [1.0, 1.05] },
  { id: "s03_arch", trim: 1.0, rate: 1.4, zoom: [1.0, 1.05] }, // day turns to dusk: faster rate
  { id: "s04_goblet", trim: 0.5, rate: 0.8, zoom: [1.02, 1.07] },
  { id: "s05_feet", trim: 0.4, rate: 0.8, zoom: [1.0, 1.05] },
  { id: "s06_pray", trim: 0.4, rate: 0.8, zoom: [1.0, 1.05] },
  { id: "s07_loom", trim: 0.5, rate: 0.85, zoom: [1.0, 1.05] },
  { id: "s08_mace", trim: 3.2, rate: 0.85, zoom: [1.02, 1.08] },
  { id: "s09_eyes", trim: 1.4, rate: 0.8, zoom: [1.0, 1.06] },
  { id: "s10_crack", trim: 0.2, rate: 0.9, zoom: [1.0, 1.06] },
  { id: "s11_burst", trim: 1.0, rate: 1.0, zoom: [1.0, 1.08], flash: true },
  { id: "s12_rise", trim: 0.3, rate: 0.8, zoom: [1.0, 1.05], flash: true },
  { id: "s13_lioneyes", trim: 2.5, rate: 0.85, zoom: [1.0, 1.06] },
  { id: "s14_threshold", trim: 0.4, rate: 0.8, zoom: [1.0, 1.05] },
  { id: "s15_claws", trim: 0.2, rate: 0.85, zoom: [1.0, 1.06] },
  { id: "s16_bless", trim: 0.3, rate: 0.75, zoom: [1.0, 1.02] },
  { id: "s17_end", trim: 0.2, rate: 0.7, zoom: [1.0, 1.06] },
];

const ShotLayer: React.FC<{ shot: Shot; dur: number }> = ({ shot, dur }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], shot.zoom, clamp);
  const flash = shot.flash ? interpolate(f, [0, 2, 10], [0.85, 0.85, 0], clamp) : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${z})` }}>
        <OffthreadVideo
          src={staticFile(P + shot.id + ".mp4")}
          trimBefore={Math.round(shot.trim * NS_FPS)}
          playbackRate={shot.rate}
          muted
          style={{ width: 1080, height: 1920, objectFit: "cover" }}
        />
      </AbsoluteFill>
      {flash > 0 && <AbsoluteFill style={{ background: "#FFF6E8", opacity: flash }} />}
    </AbsoluteFill>
  );
};

/* Captions: one or more lines, each with its own entry time; all leave together. */
type Cap = { from: number; to: number; lines: { t: string; at: number }[]; size?: number; y?: number };
const CAPS: Cap[] = [
  { from: 0.15, to: 1.85, lines: [{ t: "उसे कोई मार नहीं सकता था।", at: 0.15 }] },
  {
    from: 1.9,
    to: 4.75,
    lines: [
      { t: "न इंसान, न जानवर।", at: 1.9 },
      { t: "न अंदर, न बाहर।", at: 2.55 },
      { t: "न दिन, न रात।", at: 3.17 },
    ],
  },
  { from: 4.83, to: 6.85, lines: [{ t: "पर उसका अपना बेटा…", at: 4.83 }] },
  { from: 6.9, to: 8.8, lines: [{ t: "…हर पल हरि का नाम लेता था।", at: 6.9 }] },
  { from: 10.83, to: 13.28, lines: [{ t: "“कहाँ है तेरा हरि?", at: 10.83 }, { t: "इस खंभे में?”", at: 11.8 }] },
  { from: 13.33, to: 15.75, lines: [{ t: "“हाँ।”", at: 13.6 }], size: 84, y: 1500 },
  { from: 19.87, to: 21.75, lines: [{ t: "न इंसान, न जानवर —", at: 19.87 }, { t: "नरसिंह।", at: 20.6 }] },
  { from: 23.73, to: 26.1, lines: [{ t: "न अंदर, न बाहर —", at: 23.73 }, { t: "दहलीज़ पर।", at: 24.6 }] },
  { from: 26.17, to: 28.0, lines: [{ t: "न दिन, न रात —", at: 26.17 }, { t: "संध्या।", at: 26.9 }] },
  { from: 28.03, to: 31.9, lines: [{ t: "वरदान भी सच रहा…", at: 28.3 }, { t: "और भक्त भी बचा।", at: 29.6 }] },
  { from: 32.1, to: 34.3, lines: [{ t: "सही घड़ी में", at: 32.1 }, { t: "सब बदल जाता है।", at: 32.7 }] },
];

const Caption: React.FC<{ cap: Cap }> = ({ cap }) => {
  const f = useCurrentFrame(); // relative to cap.from
  const end = s(cap.to - cap.from);
  const out = interpolate(f, [end - 6, end], [1, 0], clamp);
  const size = cap.size ?? 64;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", top: cap.y ?? 1290 }}>
      {cap.lines.map((l, i) => {
        const lf = f - s(l.at - cap.from);
        const a = interpolate(lf, [0, 7], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
        const blur = interpolate(lf, [0, 7], [8, 0], clamp);
        const dy = interpolate(lf, [0, 9], [14, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
        return (
          <div
            key={i}
            style={{
              fontFamily: TIRO,
              fontSize: size,
              lineHeight: 1.32,
              color: "#FFFBF4",
              opacity: a * out,
              filter: `blur(${blur}px)`,
              transform: `translateY(${dy}px)`,
              textShadow: "0 0 3px rgba(60,14,34,0.9), 0 2px 10px rgba(60,14,34,0.85), 0 0 30px rgba(60,14,34,0.55)",
              letterSpacing: 0.5,
              textAlign: "center",
              padding: "0 70px",
            }}
          >
            {l.t}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* Soft cream vignette + warm lift, to sit the Veo frames in the reference grade (grain is added in ffmpeg). */
const Grade: React.FC = () => (
  <>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(60,20,35,0.28) 100%)" }} />
    <AbsoluteFill style={{ background: "rgba(255,214,200,0.06)", mixBlendMode: "screen" }} />
    {/* readability band behind the captions */}
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 58%, rgba(60,18,40,0.46) 69%, rgba(60,18,40,0.46) 79%, rgba(0,0,0,0) 90%)" }} />
  </>
);

/* ---------- End card: phone with a hora alert, then the logo ---------- */
const PHONE = { w: 470, h: 960, r: 64 };

const HoraScreen: React.FC<{ f: number }> = ({ f }) => {
  const n = interpolate(f, [s(0.9), s(1.3)], [-120, 0], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const na = interpolate(f, [s(0.9), s(1.2)], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #FCE9E4 0%, #F7D6DA 55%, #F2C6B4 100%)" }}>
      <div style={{ position: "absolute", top: 190, width: "100%", textAlign: "center", fontFamily: PLAYFAIR, fontSize: 30, color: "#7A2F4D" }}>
        Jyotiq
      </div>
      <div style={{ position: "absolute", top: 240, width: "100%", textAlign: "center", fontFamily: TIRO, fontSize: 92, color: "#7A2F4D", lineHeight: 1 }}>
        होरा
      </div>
      <div style={{ position: "absolute", top: 348, width: "100%", textAlign: "center", fontFamily: TIRO, fontSize: 28, color: "#9B5A6E" }}>
        हर घंटे का ग्रह · मंत्र के साथ
      </div>
      {/* hour list */}
      {["सूर्य", "शुक्र", "बुध", "चंद्र", "शनि"].map((g, i) => (
        <div
          key={g}
          style={{
            position: "absolute",
            left: 40,
            right: 40,
            top: 412 + i * 92,
            height: 76,
            borderRadius: 20,
            background: i === 0 ? "linear-gradient(90deg,#E9A13B,#E2658A)" : "rgba(255,255,255,0.55)",
            color: i === 0 ? "#FFF" : "#7A2F4D",
            fontFamily: TIRO,
            fontSize: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
          }}
        >
          <span>{g} होरा</span>
          <span style={{ fontSize: 24 }}>{i === 0 ? "अभी" : ""}</span>
        </div>
      ))}
      {/* notification sliding in */}
      <div
        style={{
          position: "absolute",
          left: 22,
          right: 22,
          top: 24 + n,
          opacity: na,
          borderRadius: 26,
          background: "rgba(255,255,255,0.94)",
          boxShadow: "0 12px 30px rgba(120,40,70,0.25)",
          padding: "18px 22px",
          fontFamily: TIRO,
          color: "#5A2238",
        }}
      >
        <div style={{ fontSize: 20, opacity: 0.7, fontFamily: PLAYFAIR }}>Jyotiq · अभी</div>
        <div style={{ fontSize: 30, marginTop: 4 }}>सूर्य होरा शुरू हो गया है</div>
        <div style={{ fontSize: 24, marginTop: 4, opacity: 0.8 }}>मंत्र: ॐ सूर्याय नमः</div>
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const f = useCurrentFrame(); // from 32.0 s
  const T = (t: number) => s(t - 31.967);
  const py = interpolate(f, [T(33.9), T(34.7)], [1800, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const phoneOut = interpolate(f, [T(37.6), T(37.83)], [1, 0], clamp);
  const logoA = interpolate(f, [T(37.83), T(38.2)], [0, 1], clamp);
  const logoS = interpolate(f, [T(37.83), T(38.6)], [0.92, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const dim = interpolate(f, [T(33.6), T(34.6)], [0, 0.35], clamp);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "#3A1426", opacity: dim }} />
      {/* phone */}
      <div
        style={{
          position: "absolute",
          left: (1080 - PHONE.w) / 2,
          top: 330 + py,
          width: PHONE.w,
          height: PHONE.h,
          borderRadius: PHONE.r,
          padding: 12,
          background: "linear-gradient(140deg,#F4D9A8,#C99A55 40%,#F7E4BF 70%,#B98A48)",
          boxShadow: "0 40px 90px rgba(80,20,40,0.45)",
          opacity: phoneOut,
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: PHONE.r - 12, overflow: "hidden" }}>
          <HoraScreen f={f - T(34.0)} />
        </div>
      </div>
      {/* question over the phone */}
      <Sequence from={T(34.4)} durationInFrames={T(37.75) - T(34.4)} layout="none">
        <Caption cap={{ from: 0, to: 37.75 - 34.4, lines: [{ t: "अभी कौन-सा होरा चल रहा है?", at: 0 }], y: 1340, size: 56 }} />
      </Sequence>
      {/* logo lockup */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: logoA }}>
        <div
          style={{
            transform: `scale(${logoS})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "48px 70px 44px",
            borderRadius: 48,
            background: "rgba(46,14,32,0.72)",
            border: "2px solid rgba(240,200,140,0.6)",
            boxShadow: "0 30px 80px rgba(40,10,25,0.5)",
          }}
        >
          <Img src={staticFile("jyotiq/logo-full.png")} style={{ width: 380 }} />
          <div style={{ fontFamily: TIRO, fontSize: 50, color: "#FFF3E2", marginTop: 26, textAlign: "center" }}>फ़्री में देखिए</div>
          <div style={{ fontFamily: TIRO, fontSize: 38, color: "#F2C98A", marginTop: 6, textAlign: "center" }}>ज्योतिक़ ऐप पर</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const NarasimhaReel: React.FC<{ withAudio?: boolean }> = ({ withAudio = true }) => (
  <AbsoluteFill style={{ background: "#2A0F1C" }}>
    {SHOTS.map((shot, i) => {
      const from = s(CUTS[i]);
      const dur = s(CUTS[i + 1]) - from;
      return (
        <Sequence key={shot.id} from={from} durationInFrames={dur}>
          <ShotLayer shot={shot} dur={dur} />
        </Sequence>
      );
    })}
    <Grade />
    {CAPS.map((c, i) => (
      <Sequence key={i} from={s(c.from)} durationInFrames={s(c.to) - s(c.from)}>
        <Caption cap={{ ...c, lines: c.lines.map((l) => ({ ...l, at: l.at })) }} />
      </Sequence>
    ))}
    <Sequence from={s(31.967)} durationInFrames={NS_TOTAL - s(31.967)}>
      <EndCard />
    </Sequence>
    {withAudio && (
      <Audio
        src={staticFile(P + "song.wav")}
        volume={(f) => interpolate(f, [NS_TOTAL - s(0.6), NS_TOTAL], [1, 0], clamp)}
      />
    )}
  </AbsoluteFill>
);
