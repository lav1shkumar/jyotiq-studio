import React from "react";
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FPS, GOLD_HI, ROZHA, clamp, ramp, s } from "../sadesaati/charanKit";
import { CaptionCard, HOLD } from "../sadesaati/charanCaptions";
import type { Card, Seg } from "../sadesaati/charanCaptions";
import { EndBackdrop, PhoneEnding, Sparks } from "../sadesaati/SadeSaati";
import { TvOpen, tvOpenBug } from "./open";

/* "तुलसी विवाह की कथा" (16 Nov 2026), Kaal narrator, 1080x1920 @ 24 fps, in the Sade Sati series look.
   Front: the Jyotiq brand open over shot 1 ("ज्योतिक़ प्रस्तुत करता है"). Story: ten Veo 3.1 shots
   (tulsi-vivah/public/clips) cut on the measured VO phrases. End: Ep1's book -> phone -> Jyotiq app,
   with the app reveal landing on "ज्योतिक़" (VO 76.8 s). Times below are VO seconds = reel seconds. */
export const TV_FPS = FPS;
const END_OFF = s(49.3); // Ep1 ending frames + END_OFF: app reveal (Ep1 27.5 s) at 76.8 s
export const TV_TOTAL = s(80.8); // VO ends 78.3 s, then the app card holds
const XF = 6;
const P = "tulsivivah/";

type Shot = { src: string; seq: number; end: number; trim: number; rate: number; zoom: [number, number]; xf: number };
const shot = (file: string, cut: number, end: number, trim: number, rate = 1, zoom: [number, number] = [1.0, 1.05]): Shot => {
  const xf = cut === 0 ? 0 : XF;
  return { src: P + file + ".mp4", seq: s(cut) - xf, end: s(end), trim, rate, zoom, xf };
};

const SHOTS: Shot[] = [
  shot("t01_pair", 0, 12.25, 0, 0.64, [1.0, 1.06]), // under the brand open, then the hook
  shot("t02_asura", 12.25, 14.95, 1.0), // "असुर जालंधर अजेय था"
  shot("t03_vrinda", 14.95, 25.5, 0, 0.72), // "उसकी पत्नी वृंदा… पतिव्रत"
  shot("t04_battle", 25.5, 27.62, 1.6), // "महादेव से युद्ध के बीच"
  shot("t05_disguise", 27.62, 32.15, 1.2), // "विष्णु जालंधर का रूप लेकर"
  shot("t06_crack", 32.15, 36.45, 0.8), // "पति समझा… व्रत टूटा"
  shot("t07_crown", 36.45, 39.45, 2.0), // "और जालंधर मारा गया"
  shot("t08_stone", 39.45, 50.95, 0, 0.66, [1.0, 1.08]), // the curse, then "बने शालिग्राम"
  shot("t09_sapling", 50.95, 58.4, 0, 1, [1.0, 1.06]), // "राख से उगा… तुलसी"
  shot("t01_pair", 58.4, 65.2, 0.4, 1, [1.04, 1.1]), // "वचन… शालिग्राम रूप में… विवाह करेंगे"
  shot("t10_vivah", 65.2, 75.0, 0, 0.8, [1.0, 1.07]), // "तुलसी विवाह… शादियों का मौसम… रिश्ते की बात"
];

const ShotLayer: React.FC<{ shot: Shot }> = ({ shot }) => {
  const f = useCurrentFrame();
  const dur = shot.end - shot.seq;
  const opacity = shot.xf > 0 ? ramp(f, 0, shot.xf, 0, 1, Easing.linear) : 1;
  const z = interpolate(f, [0, dur], shot.zoom, clamp);
  return (
    <AbsoluteFill style={{ opacity, transform: `scale(${z})` }}>
      <OffthreadVideo
        src={staticFile(shot.src)}
        trimBefore={Math.round(shot.trim * FPS)}
        playbackRate={shot.rate}
        muted
        style={{ width: 1080, height: 1920, objectFit: "cover", filter: "contrast(1.05) saturate(1.08)" }}
      />
    </AbsoluteFill>
  );
};

/* Ep1's book -> phone-light clip, exactly as SadeSaatiCharan uses it. */
const PhoneClip: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: ramp(f, 0, XF, 0, 1, Easing.linear) }}>
      <OffthreadVideo
        src={staticFile("sadesaati/s7_phone.mp4")}
        trimBefore={s(3.7)}
        playbackRate={1.5}
        muted
        style={{ width: 1080, height: 1920, objectFit: "cover", filter: "contrast(1.05) saturate(1.08)" }}
      />
    </AbsoluteFill>
  );
};

const EndingLocal: React.FC = () => {
  const lf = useCurrentFrame();
  return (
    <>
      <Sequence from={607} durationInFrames={s(29.4) - 607} layout="none">
        <PhoneClip />
      </Sequence>
      <EndBackdrop f={lf} />
      <Sparks f={lf} />
      <PhoneEnding f={lf} />
    </>
  );
};

const L = (...segs: [string, number][]): Seg[] => segs.map(([t, at]) => ({ t, at: s(at) }));
const c = (from: number, to: number, ...lines: Seg[][]): Card => ({ from: s(from), to: s(to), lines });

const CARDS: Card[] = [
  c(0, 4.6, L(["*Jyotiq* प्रस्तुत करता है...", 0.05]), L(["*तुलसी विवाह* की कथा", 2.39])),
  c(4.3, 6.98, L(["हर वर्ष *देवउठनी एकादशी* पर...", 4.4])),
  c(7.0, 10.9, L(["भगवान *विष्णु*, एक पौधे से", 7.08]), L(["*विवाह* करते हैं।", 8.9])),
  c(10.95, 12.2, L(["*क्यों?*", 11.01])),
  c(12.25, 14.9, L(["असुर *जालंधर* अजेय था।", 12.32]), L(["उसकी ताक़त थी...", 13.7])),
  c(14.95, 16.7, L(["उसकी पत्नी *वृंदा*।", 15.0])),
  c(16.75, 21.95, L(["जब तक वृंदा का *पतिव्रत*", 16.79]), L(["अटूट था,", 19.07])),
  c(22.2, 25.4, L(["जालंधर को कोई", 22.29]), L(["*मार* नहीं सकता था।", 23.4])),
  c(25.5, 27.55, L(["*महादेव* से युद्ध के बीच", 25.58])),
  c(27.62, 32.1, L(["*विष्णु* जालंधर का रूप लेकर", 27.69]), L(["वृंदा के पास पहुँचे।", 29.6])),
  c(32.15, 34.9, L(["वृंदा ने उन्हें", 32.25]), L(["अपना *पति* समझा।", 33.1])),
  c(34.95, 39.3, L(["*व्रत* टूटा...", 35.03]), L(["और जालंधर *मारा गया*।", 36.53])),
  c(39.45, 44.5, L(["सच जानकर वृंदा ने *श्राप* दिया,", 39.51]), L(["कि विष्णु *पत्थर* बन जाएँ।", 41.98])),
  c(44.6, 48.0, L(["नारायण ने सिर झुकाकर", 44.66]), L(["श्राप *स्वीकार* किया...", 46.1])),
  c(48.05, 50.9, L(["और बने *शालिग्राम*।", 48.14])),
  c(51.1, 54.1, L(["वृंदा अपने पति के साथ", 51.18]), L(["*सती* हो गईं।", 52.6])),
  c(54.2, 58.3, L(["उनकी राख से उगा एक पौधा...", 54.28]), L(["*तुलसी*।", 56.76])),
  c(58.4, 62.7, L(["विष्णु ने *वचन* दिया...", 58.49]), L(["हर साल, *शालिग्राम* रूप में,", 60.26])),
  c(62.75, 65.1, L(["वे *तुलसी* से *विवाह* करेंगे।", 62.83])),
  c(65.2, 69.25, L(["इसीलिए देवउठनी पर", 65.31]), L(["*तुलसी विवाह* होता है...", 67.25])),
  c(69.95, 72.95, L(["फिर *विवाह* शुरू होते हैं।", 70.03])),
  c(73.15, 75.35, L(["घर में *रिश्ते* की बात", 73.24]), L(["चल रही है?", 74.2])),
  { from: s(75.4), to: HOLD, lines: [L(["दोनों की *कुंडली*,", 75.48]), L(["*Jyotiq* पर मिलाकर देखिए।", 76.79])] },
];

/* Astroraaga AI Services card, bottom-right (as on the published Sade Sati reels). Logo art crop: x100-505, y135-250 of 612x408. */
const AstroraagaBadge: React.FC = () => (
  <div
    style={{
      position: "absolute",
      right: 34,
      bottom: 110,
      width: 300,
      height: 96,
      background: "#FFFFFF",
      borderRadius: 6,
      overflow: "hidden",
      boxShadow: "0 4px 16px rgba(0,0,0,0.45)",
    }}
  >
    <Img
      src={staticFile("jyotiq/astroraaga-logo.png")}
      style={{ position: "absolute", width: 612 * 0.66, height: 408 * 0.66, left: -100 * 0.66 + 16, top: -135 * 0.66 + 10 }}
    />
  </div>
);

export const TulsiVivahReel: React.FC<{ withAudio?: boolean }> = ({ withAudio = true }) => {
  const f = useCurrentFrame();
  const openF = (f * 30) / FPS; // the brand open is timed in 30 fps frames
  const logoO = tvOpenBug(openF);
  const titleO = Math.min(ramp(f, s(3.7), s(4.3), 0, 1, Easing.linear), ramp(f, s(11.6), s(12.2), 1, 0, Easing.linear));
  return (
    <AbsoluteFill style={{ background: "#07041A" }}>
      {SHOTS.map((sh, i) => (
        <Sequence key={i} from={sh.seq} durationInFrames={sh.end - sh.seq} layout="none">
          <ShotLayer shot={sh} />
        </Sequence>
      ))}

      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 62% at 50% 46%, transparent 55%, rgba(4,2,14,0.42) 100%)" }} />

      <Sequence from={END_OFF} layout="none">
        <EndingLocal />
      </Sequence>

      <AbsoluteFill style={{ background: "linear-gradient(to bottom, transparent 58%, rgba(6,4,18,0.5) 68%, rgba(6,4,18,0.58) 78%, transparent 88%)" }} />

      {/* front branding: Jyotiq brand open over shot 1 */}
      <TvOpen f={openF} />

      {titleO > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 236,
            textAlign: "center",
            fontFamily: ROZHA,
            fontSize: 54,
            color: GOLD_HI,
            opacity: titleO,
            letterSpacing: 1,
            textShadow: "0 0 18px rgba(0,0,0,0.9), 0 2px 0 rgba(0,0,0,0.6)",
          }}
        >
          <span style={{ opacity: 0.7 }}>✦ </span>तुलसी विवाह की कथा<span style={{ opacity: 0.7 }}> ✦</span>
        </div>
      ) : null}

      {CARDS.map((card, i) => (
        <CaptionCard key={i} card={card} f={f} />
      ))}

      <Img
        src={staticFile("jyotiq/logo-full.png")}
        style={{
          position: "absolute",
          right: 40,
          top: 168,
          width: 128,
          height: (128 * 511) / 444,
          opacity: 0.96 * logoO,
          filter: "drop-shadow(0 0 14px rgba(230,180,90,0.35)) drop-shadow(0 4px 10px rgba(0,0,0,0.65))",
        }}
      />
      <AstroraagaBadge />

      {withAudio ? <Audio src={staticFile(P + "mix.wav")} /> : null}
    </AbsoluteFill>
  );
};
