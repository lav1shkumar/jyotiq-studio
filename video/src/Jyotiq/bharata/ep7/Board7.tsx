import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { AppStoreButton, PlayButton } from "../../katha/reelKit";
import { Puppet, RigDefs, blinkAt, idle, pose, type Pose, type Who } from "../../manthan/rig";
import { SetDefs } from "../../manthan/sets";
import { CAP_BOTTOM, CAP_TOP, Chrome, GRAD, HookPlate, JAKARTA, MUKTA, Presents, ROZHA, S, TwoTone, gradText, type Part } from "../../navagraha/ep1/look";
import { NvDefs } from "../../navagraha/ep1/world";
import { N2Defs } from "../../navagraha/ep2/anim2";
import { ChDefs } from "../../chhath/world";
import { BhDefs } from "../ep1/world";
import { W5Defs } from "../ep5/world5";
import { Bow6, Ratha } from "../ep6/cast6";
import { W6Defs } from "../ep6/world6";
import { ARJUNA, ClayGuru, DRONA, Dog, EKALAVYA, Target, WrappedHand } from "./cast7";
import { ArenaDusk, Forest7, Gurukul, W7Defs } from "./world7";

/*
 * भारत · BHARATA Episode 7 · एकलव्य का अंगूठा: STORYBOARD (one still per script beat, frame i = board panel i).
 * Frame design pass before audio; captions show the planned lines. Text facts per cast7.tsx/world7.tsx headers.
 */
export const BOARD7_FRAMES = 21;
const W = 1080;
const H = 1920;
const F = 60;
const p = (t: string, hi = false): Part => ({ t, hi });

type ManArgs = { id: string; who: Who; x: number; y: number; s: number; facing?: number; o?: Partial<Pose>; prop?: React.ReactNode; backProp?: React.ReactNode; f?: number };
const Man: React.FC<ManArgs> = ({ id, who, x, y, s, facing = 1, o = {}, prop, backProp, f = F }) => (
  <Puppet id={id} who={who} at={{ x, y, s, facing }} p={pose({ ...idle(id, f, 0.6), blink: blinkAt(id, f), ...o })} t={f} prop={prop} backProp={backProp} />
);
const Ek: React.FC<Omit<ManArgs, "who">> = (a) => <Man {...a} who={EKALAVYA} />;
const Dr: React.FC<Omit<ManArgs, "who">> = (a) => <Man {...a} who={DRONA} />;
const Ar: React.FC<Omit<ManArgs, "who">> = (a) => <Man {...a} who={ARJUNA} />;

const Vignette: React.FC<{ o?: number; c?: string }> = ({ o = 0.55, c = "#0A0612" }) => (
  <g opacity={o}>
    <radialGradient id="b7Vig" cx="0.5" cy="0.5" r="0.75">
      <stop offset="0.55" stopColor={c} stopOpacity="0" />
      <stop offset="1" stopColor={c} stopOpacity="0.9" />
    </radialGradient>
    <rect width={W} height={H} fill="url(#b7Vig)" />
  </g>
);

/* ------------------------------------------------------------------ */
/* HTML overlays                                                       */
/* ------------------------------------------------------------------ */

const Caption: React.FC<{ who?: string; text: string; keys?: string[] }> = ({ who, text, keys = [] }) => {
  const char = !!who;
  const ws = text.split(" ");
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: CAP_TOP, height: CAP_BOTTOM - CAP_TOP, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div
        style={{
          maxWidth: 900,
          padding: "16px 26px 20px",
          borderRadius: 30,
          background: char ? "rgba(26,16,40,0.92)" : "rgba(255,255,255,0.95)",
          border: `2.5px solid ${char ? S.gold : S.goldLight}`,
          boxShadow: "0 10px 26px rgba(20,10,30,0.3)",
          textAlign: "center",
          fontFamily: MUKTA,
          fontWeight: 700,
          fontSize: 50,
          lineHeight: 1.28,
          color: char ? "#FFF3DA" : S.brown,
        }}
      >
        {char ? <div style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: 28, color: S.gold, marginBottom: 2 }}>{who}</div> : null}
        {ws.map((w, i) => {
          const hi = keys.some((k) => w.startsWith(k));
          return (
            <React.Fragment key={i}>
              <span style={{ display: "inline-block", padding: "0 8px", borderRadius: 14, background: hi ? GRAD : "transparent", color: hi ? "#FFFFFF" : undefined }}>{w}</span>{" "}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
const Chip: React.FC<{ text: string; y?: number }> = ({ text, y = 560 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center" }}>
    <div style={{ padding: "14px 34px", borderRadius: 40, background: "rgba(20,12,34,0.82)", border: `2.5px solid ${S.gold}`, color: "#FFF3DA", fontFamily: MUKTA, fontWeight: 800, fontSize: 44, boxShadow: "0 10px 24px rgba(0,0,0,0.35)" }}>{text}</div>
  </div>
);
const Stamp: React.FC<{ text: Part[]; y: number; size: number; sub?: string }> = ({ text, y, size, sub }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", flexDirection: "column", alignItems: "center" }}>
    <div style={{ padding: "6px 48px 18px", borderRadius: 40, background: "rgba(255,248,238,0.95)", border: `4px solid ${S.gold}`, boxShadow: "0 18px 40px rgba(20,10,10,0.45)" }}>
      <TwoTone parts={text} size={size} />
    </div>
    {sub ? <div style={{ marginTop: 10, padding: "8px 26px", borderRadius: 30, background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 36 }}>{sub}</div> : null}
  </div>
);

const TitleText: React.FC = () => (
  <div style={{ position: "absolute", inset: 0 }}>
    <Presents y={300} o={1} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 590, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div
        style={{
          fontFamily: ROZHA,
          fontSize: 250,
          lineHeight: 1.05,
          background: "linear-gradient(180deg, #FFF3C4 0%, #F6C14E 45%, #C07A1E 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextStroke: "3px #5A2E0A",
          filter: "drop-shadow(0 0 22px rgba(26,12,6,0.95)) drop-shadow(0 10px 30px rgba(255,190,80,0.35))",
        }}
      >
        भारत
      </div>
      <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 40, letterSpacing: 18, color: "#FFE3A1", marginTop: -10 }}>BHARATA</div>
      <div style={{ marginTop: 24, padding: "12px 34px", borderRadius: 40, background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 44 }}>Episode 7 · एकलव्य का अंगूठा</div>
    </div>
  </div>
);

const ChatCard: React.FC = () => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
    <TwoTone parts={[p("गुरुकुल ने भेद किया… "), p("ज्योतिक़ नहीं करता", true)]} size={60} />
    <div style={{ width: 760, borderRadius: 48, background: "#FFF9F0", border: `4px solid ${S.goldLight}`, boxShadow: "0 24px 60px rgba(20,10,30,0.45)", padding: "26px 28px 30px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, borderBottom: "2px solid #F0E2CC", paddingBottom: 14 }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: "#1A1020", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Img src={staticFile("jyotiq/logo-zodiac.png")} style={{ width: 50, height: 50, objectFit: "contain" }} />
        </div>
        <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 32, color: S.brown }}>Jyotiq</div>
        <div style={{ marginLeft: "auto", padding: "8px 18px", borderRadius: 22, background: "#F3E6D2", fontFamily: MUKTA, fontWeight: 800, fontSize: 28, color: S.brown }}>भाषा: हिंदी ▾</div>
      </div>
      <div style={{ alignSelf: "flex-end", maxWidth: 560, padding: "16px 22px", borderRadius: "28px 28px 6px 28px", background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 700, fontSize: 38, lineHeight: 1.3 }}>
        मेहनत के बाद भी आगे नहीं बढ़ पा रहा… कब बदलेगा ये समय?
      </div>
      <div style={{ alignSelf: "flex-start", padding: "16px 26px", borderRadius: "28px 28px 28px 6px", background: "#F3E6D2", color: S.brown, fontFamily: MUKTA, fontWeight: 700, fontSize: 40 }}>● ● ●</div>
    </div>
    <div style={{ padding: "14px 32px", borderRadius: 28, background: "rgba(26,16,40,0.9)", border: `2.5px solid ${S.gold}`, color: "#FFF3DA", fontFamily: MUKTA, fontWeight: 800, fontSize: 42 }}>अपने मन का सवाल… अपनी भाषा में पूछिए</div>
  </div>
);

const EndChip: React.FC<{ t: string; on?: boolean }> = ({ t, on }) => (
  <div style={{ padding: "10px 24px", borderRadius: 30, background: on ? GRAD : "#FFFFFF", border: `2.5px solid ${S.goldLight}`, fontFamily: MUKTA, fontWeight: 700, fontSize: 34, color: on ? "#FFFFFF" : S.brown }}>{t}</div>
);
const EndText: React.FC = () => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 500, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
    <div style={{ padding: "16px 40px 20px", borderRadius: 34, background: "rgba(26,16,40,0.92)", border: `3px solid ${S.gold}`, textAlign: "center" }}>
      <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 24, letterSpacing: 6, color: S.goldLight }}>अगला एपिसोड · NEXT</div>
      <div style={{ fontFamily: ROZHA, fontSize: 84, lineHeight: 1.1, background: "linear-gradient(180deg, #FFF3C4 0%, #F6C14E 60%, #C07A1E 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>कर्ण का अपमान</div>
      <div style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 34, color: "#FFF3DA" }}>“सूतपुत्र!” — रंगभूमि में एक ही शब्द</div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 6 }}>
      <div style={{ width: 120, height: 120, borderRadius: 60, background: "radial-gradient(circle at 50% 40%, #2A1830 0%, #120C16 75%)", border: `3px solid ${S.gold}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Img src={staticFile("jyotiq/logo-zodiac.png")} style={{ width: 92, height: 92, objectFit: "contain" }} />
      </div>
      <TwoTone parts={[p("ज्योतिक़ "), p("डाउनलोड कीजिए", true)]} size={66} />
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, maxWidth: 940 }}>
      {["अपनी भाषा में", "फ़्री कुंडली", "दशा", "गोचर", "पंचांग"].map((t, i) => (
        <EndChip key={t} t={t} on={i === 0} />
      ))}
    </div>
    <div style={{ display: "flex", gap: 18, transform: "scale(0.9)" }}>
      <PlayButton glow={0.5} />
      <AppStoreButton glow={0.5} />
    </div>
    <div style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: 42, ...gradText }}>ऐप का लिंक बायो में ↑ · www.jyotiq.ai</div>
    <div style={{ padding: "14px 32px", borderRadius: 28, background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 40 }}>कमेंट करें: द्रोण सही थे या एकलव्य के साथ अन्याय?</div>
    <div style={{ fontFamily: JAKARTA, fontWeight: 600, fontSize: 24, color: S.brownMid, opacity: 0.85 }}>Guidance only, for entertainment and information.</div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Panels                                                              */
/* ------------------------------------------------------------------ */

const DRONA_COLD: Partial<Pose> = { sF: 20, eF: 34, sB: -8, eB: 14, lean: 0, head: 2, brow: 0.55, browTilt: 6, talk: 0.4, smile: -0.1, lookX: 1 };
const EK_JOINED: Partial<Pose> = { sF: 68, eF: 96, wF: 8, sB: 62, eB: 98, wB: 8, lean: 6, head: 8, brow: 0.4, browTilt: -6, smile: 0.15, lookX: 1, lookY: -0.4 };
const ARCHER: Partial<Pose> = { sF: 92, eF: 0, sB: 86, eB: 120, lookX: 1, brow: 0.5, browTilt: 6 };

type Panel = { svg: React.ReactNode; html?: React.ReactNode };

const panels: Panel[] = [
  // 00 · HOOK (frame 0): the demand in the forest clearing, frozen mid-scene; plate on top.
  {
    svg: (
      <g>
        <Forest7 f={F} tod="golden" beams={0.9} mist={0.3} dense={0} />
        <ClayGuru x={830} y={1500} s={0.85} glow={0.4} />
        <Dr id="d0" x={680} y={1690} s={1.7} facing={-1} o={DRONA_COLD} />
        <Ek id="e0" x={330} y={1740} s={1.7} facing={1} o={EK_JOINED} />
        <Ar id="a0" x={940} y={1620} s={1.35} facing={-1} o={{ sF: 14, eF: 20, lookX: 1, brow: 0.4, smile: -0.1 }} prop={<Bow6 s={0.7} rot={6} />} />
        <Vignette o={0.5} c="#1A0E06" />
      </g>
    ),
    html: (
      <>
        <HookPlate y={380} size={64} lines={[[p("दक्षिणा: "), p("दाहिना अंगूठा", true)], [p("देगा "), p("या नहीं?", true)]]} chip="एकलव्य और द्रोणाचार्य" />
        <Caption who="द्रोणाचार्य" text="मेरे शिष्य हो? तो गुरु-दक्षिणा दो… अपने दाहिने हाथ का अंगूठा।" keys={["अंगूठा"]} />
      </>
    ),
  },
  // 01 · L2 the freeze question, darkened.
  {
    svg: (
      <g>
        <Forest7 f={F} tod="golden" beams={0.4} mist={0.5} dense={0} />
        <ClayGuru x={830} y={1500} s={0.85} glow={0.2} />
        <Dr id="d1" x={680} y={1690} s={1.7} facing={-1} o={{ ...DRONA_COLD, talk: 0 }} />
        <Ek id="e1" x={330} y={1740} s={1.7} facing={1} o={{ ...EK_JOINED, brow: 0.8, browTilt: -10, smile: -0.2 }} />
        <Ar id="a1" x={940} y={1620} s={1.35} facing={-1} o={{ sF: 14, eF: 20, lookX: 1, brow: 0.4 }} prop={<Bow6 s={0.7} rot={6} />} />
        <rect width={W} height={H} fill="#0A0812" opacity={0.45} />
        <Vignette o={0.65} c="#060410" />
      </g>
    ),
    html: <Caption text="एक गुरु… अपने शिष्य का अंगूठा क्यों माँग रहा है?" keys={["क्यों", "अंगूठा"]} />,
  },
  // 02 · TITLE
  {
    svg: (
      <g>
        <rect width={W} height={H} fill="#100A06" />
        <circle cx={540} cy={820} r={760} fill="#3A2A10" opacity={0.8} filter="url(#k7Blur22)" />
        <g opacity={0.4}>
          <Forest7 f={F} tod="dusk" beams={0} mist={0.2} dense={0} />
        </g>
        <path d="M0 1500C300 1460 700 1540 1080 1480L1080 1920L0 1920Z" fill="#0C0704" />
      </g>
    ),
    html: <TitleText />,
  },
  // 03 · L3 rewind: the gurukul, young Ekalavya at the edge, princes' targets beyond.
  {
    svg: (
      <g>
        <Gurukul f={F} />
        <Target x={820} y={1260} s={0.9} arrows={4} />
        <Ek id="e3" x={300} y={1680} s={1.5} facing={1} o={{ sF: 30, eF: 50, lean: 10, head: 14, brow: 0.5, browTilt: -6, smile: 0.2, lookX: 1, lookY: -0.3 }} />
        <Vignette o={0.3} c="#1A2A10" />
      </g>
    ),
    html: (
      <>
        <Chip text="⏪ पहले… द्रोण के गुरुकुल में" y={560} />
        <Caption text="पर ये हुआ क्यों? एकलव्य… निषादों का राजकुमार… धनुर्विद्या सीखने द्रोण के पास आया था।" keys={["एकलव्य", "द्रोण"]} />
      </>
    ),
  },
  // 04 · L4 the plea, close.
  {
    svg: (
      <g>
        <Gurukul f={F} />
        <Ek id="e4" x={480} y={1790} s={2.3} facing={1} o={{ ...EK_JOINED, talk: 0.5, brow: 0.7, browTilt: -10, lookY: -0.5 }} />
        <Vignette o={0.35} c="#1A2A10" />
      </g>
    ),
    html: (
      <>
        <Caption who="एकलव्य" text="गुरुदेव, मुझे अपना शिष्य बना लीजिए।" keys={["शिष्य"]} />
      </>
    ),
  },
  // 05 · L5 the refusal: Drona half-turned away, the archery ground bright behind him.
  {
    svg: (
      <g>
        <Gurukul f={F} />
        <Target x={170} y={1300} s={0.85} arrows={3} />
        <Dr id="d5" x={560} y={1740} s={2.3} facing={1} o={{ sF: 30, eF: 40, head: -4, brow: 0.6, browTilt: 8, lookX: -0.9, lookY: 0, talk: 0.5, smile: -0.2 }} />
        <Vignette o={0.4} c="#1A2A10" />
      </g>
    ),
    html: (
      <>
        <Caption who="द्रोणाचार्य" text="नहीं। तुम निषाद हो… मेरे राजकुमार शिष्यों से भी आगे निकल जाओगे।" keys={["नहीं।", "निषाद"]} />
      </>
    ),
  },
  // 06 · L6 the clay guru: Ekalavya bows to the idol, then practices before it.
  {
    svg: (
      <g>
        <Forest7 f={F} tod="day" beams={1} mist={0.4} />
        <ClayGuru x={230} y={1440} s={1.15} glow={0.5} />
        <Target x={860} y={1420} s={0.8} arrows={6} />
        <Ek id="e6" x={610} y={1740} s={1.6} facing={-1} o={{ sF: 64, eF: 94, wF: 8, sB: 58, eB: 96, wB: 8, lean: 8, head: 12, brow: 0.35, browTilt: -6, smile: 0.3, lookX: -0.9, lookY: 0.3 }} prop={<Bow6 s={0.8} rot={-6} />} />
        <Vignette o={0.3} c="#0E1A08" />
      </g>
    ),
    html: (
      <>
        <Caption text="एकलव्य चुपचाप वन में चला गया… मिट्टी से द्रोण की मूर्ति बनाई, और उसे ही गुरु मानकर प्रतिदिन अभ्यास करने लगा।" keys={["मूर्ति", "अभ्यास"]} />
      </>
    ),
  },
  // 07 · L7 the hunt: the princes' chariots roll in, the dog trotting behind.
  {
    svg: (
      <g>
        <Forest7 f={F} tod="day" beams={0.7} mist={0.3} dense={0} />
        <g transform="translate(330 1680)">
          <Ratha f={F} s={0.9} facing={1} metal="gold" banner="sunmoon" />
        </g>
        <Ar id="a7" x={300} y={1420} s={0.95} facing={1} o={{ sF: 20, eF: 26, lookX: 1, smile: 0.2 }} />
        <Dog x={720} y={1560} s={1.0} facing={1} mode="sit" f={F} />
        <Vignette o={0.3} c="#0E1A08" />
      </g>
    ),
    html: <Caption text="एक दिन पांडव और कौरव शिकार पर निकले… साथ में एक कुत्ता।" keys={["शिकार", "कुत्ता"]} />,
  },
  // 08 · L8 the bark and the seven arrows: the mouth sealed mid-bark, the dog alive and affronted.
  {
    svg: (
      <g>
        <Forest7 f={F} tod="day" beams={0.8} mist={0.3} dense={0} />
        <Ek id="e8" x={810} y={1690} s={1.55} facing={-1} o={{ ...ARCHER }} prop={<Bow6 s={1.05} draw={0.5} arrow={1} />} />
        <Dog x={290} y={1500} s={1.5} facing={1} mode="sealed" f={F} />
        <Vignette o={0.35} c="#0E1A08" />
      </g>
    ),
    html: <Caption text="कुत्ता भौंका… और मुँह बंद होने से पहले, उसमें सात बाण समा चुके थे।" keys={["सात", "बाण"]} />,
  },
  // 09 · L9 Arjuna crouches by the dog, amazed.
  {
    svg: (
      <g>
        <Forest7 f={F} tod="day" beams={0.7} mist={0.25} dense={0} />
        <Dog x={600} y={1480} s={1.55} facing={1} mode="sealed" f={F} />
        <Ar id="a9" x={330} y={1760} s={1.9} facing={1} o={{ lean: 22, head: 16, sF: 55, eF: 90, lookX: 1, lookY: 0.4, brow: 0.9, browTilt: -4, talk: 0.6, smile: 0 }} />
        <Vignette o={0.35} c="#0E1A08" />
      </g>
    ),
    html: <Caption who="अर्जुन" text="सात बाण… वो भी सिर्फ़ आवाज़ सुनकर? ये कौन है?" keys={["सात", "आवाज़"]} />,
  },
  // 10 · L10 Ekalavya revealed: ceaselessly shooting, grim.
  {
    svg: (
      <g>
        <Forest7 f={F} tod="golden" beams={0.8} mist={0.4} />
        <Target x={220} y={1440} s={0.95} arrows={9} />
        <Ek id="e10" x={620} y={1760} s={1.9} facing={-1} o={{ ...ARCHER, talk: 0.4 }} prop={<Bow6 s={1.1} draw={0.85} arrow={1} />} />
        <Vignette o={0.4} c="#1A0E06" />
      </g>
    ),
    html: <Caption who="एकलव्य" text="मैं एकलव्य… निषाद नरेश हिरण्यधनु का पुत्र… और द्रोणाचार्य का शिष्य।" keys={["एकलव्य", "द्रोणाचार्य"]} />,
  },
  // 11 · L12 the argument: Arjuna, hurt pride, before a still Drona.
  {
    svg: (
      <g>
        <Gurukul f={F} />
        <Dr id="d11" x={760} y={1680} s={1.6} facing={-1} o={{ sF: 18, eF: 24, head: 4, brow: 0.4, lookX: 1, lookY: 0.2, smile: -0.1 }} />
        <Ar id="a11" x={350} y={1760} s={1.9} facing={1} o={{ sF: 60, eF: 70, wF: -10, lean: 8, head: -2, brow: 0.9, browTilt: 10, talk: 0.7, smile: -0.4, lookX: 1, fist: 0.6 }} />
        <Vignette o={0.4} c="#1A2A10" />
      </g>
    ),
    html: (
      <>
        <Caption who="अर्जुन" text="आपने कहा था… आपका कोई शिष्य मुझ-सा नहीं होगा। तो एकलव्य कौन है?" keys={["मुझ-सा", "एकलव्य"]} />
      </>
    ),
  },
  // 12 · L13 Drona leads Arjuna into the deep forest.
  {
    svg: (
      <g>
        <Forest7 f={F} tod="golden" beams={0.6} mist={0.55} />
        <Dr id="d12" x={420} y={1720} s={1.7} facing={1} o={{ sF: 26, eF: 30, sB: -2, eB: 16, lean: 4, head: 2, brow: 0.5, lookX: 1 }} />
        <Ar id="a12" x={700} y={1780} s={1.55} facing={1} o={{ sF: 20, eF: 26, lean: 3, head: 6, brow: 0.6, browTilt: 4, lookX: 1, smile: -0.2 }} prop={<Bow6 s={0.75} rot={8} />} />
        <Vignette o={0.45} c="#140E06" />
      </g>
    ),
    html: <Caption text="द्रोण कुछ पल सोचते रहे… फिर अर्जुन को साथ लेकर एकलव्य के पास गए।" keys={["सोचते", "एकलव्य"]} />,
  },
  // 13 · L14 Ekalavya prostrates, joyful — he does not know why they came.
  {
    svg: (
      <g>
        <Forest7 f={F} tod="golden" beams={0.9} mist={0.3} dense={0} />
        <ClayGuru x={840} y={1470} s={0.8} glow={0.3} />
        <Dr id="d13" x={640} y={1640} s={1.55} facing={-1} o={{ sF: 16, eF: 22, brow: 0.45, lookX: 1, lookY: 0.5, smile: 0 }} />
        <Ar id="a13" x={880} y={1560} s={1.15} facing={-1} o={{ sF: 12, eF: 18, lookX: 1, lookY: 0.4, brow: 0.3 }} />
        <Ek id="e13" x={370} y={1750} s={1.6} facing={1} o={{ lean: 24, head: 20, sF: 58, eF: 110, wF: 8, sB: 52, eB: 112, wB: 8, brow: 0.3, browTilt: -8, smile: 0.6, lookX: 0.8, lookY: 0.7, talk: 0.5 }} />
        <Vignette o={0.4} c="#140E06" />
      </g>
    ),
    html: <Caption who="एकलव्य" text="गुरुदेव! आप स्वयं आए? आज्ञा कीजिए।" keys={["गुरुदेव", "आज्ञा"]} />,
  },
  // 14 · L15 the demand lands again — close two-shot, heavier now.
  {
    svg: (
      <g>
        <Forest7 f={F} tod="golden" beams={0.4} mist={0.2} dense={0} />
        <Dr id="d14" x={620} y={1720} s={2.2} facing={-1} o={{ ...DRONA_COLD, talk: 0.6, brow: 0.7, browTilt: 8 }} />
        <Ek id="e14" x={290} y={1780} s={1.9} facing={1} o={{ ...EK_JOINED, brow: 0.85, browTilt: -12, smile: -0.15, blink: 0.1 }} />
        <Vignette o={0.55} c="#0E0804" />
      </g>
    ),
    html: <Caption who="द्रोणाचार्य" text="शिष्य हो? तो दक्षिणा दो… दाहिने हाथ का अंगूठा।" keys={["दक्षिणा", "अंगूठा"]} />,
  },
  // 15 · L16 the serene face, then the cutaway: birds burst up through the canopy. The act is never shown.
  {
    svg: (
      <g>
        <Forest7 f={F} tod="dusk" beams={0} mist={0.4} dense={0} />
        {Array.from({ length: 12 }, (_, i) => (
          <g key={i} transform={`translate(${180 + i * 68} ${620 - (i % 4) * 60})`}>
            <path d="M-16 0Q0 -12 16 0" stroke="#0E0A14" strokeWidth={5} fill="none" />
            <path d="M-30 8Q-14 -2 0 4M0 4Q14 -2 30 8" stroke="#0E0A14" strokeWidth={4} fill="none" opacity={0.7} />
          </g>
        ))}
        <Ek id="e15" x={540} y={1880} s={2.6} facing={1} o={{ lean: -2, head: -6, sF: 10, eF: 14, brow: 0.25, browTilt: 0, smile: 0.35, lookX: 0.2, lookY: -0.7, blink: 0.3 }} />
        <Vignette o={0.6} c="#060410" />
      </g>
    ),
    html: <Caption text="एकलव्य ने एक पल नहीं सोचा।" keys={["एक", "पल"]} />,
  },
  // 16 · L17 the wrapped hand on the bow; one slow arrow at the target.
  {
    svg: (
      <g>
        <Forest7 f={F} tod="day" beams={0.7} mist={0.3} dense={0} />
        <Target x={780} y={1440} s={0.95} arrows={1} spread={0.9} />
        <WrappedHand x={400} y={1560} s={2.4} />
        <path d="M420 1500L740 1330" stroke="#6A3A1C" strokeWidth={5} strokeDasharray="14 10" opacity={0.7} />
        <Vignette o={0.45} c="#0E1A08" />
      </g>
    ),
    html: (
      <>
        <Chip text="अंगूठा कट चुका था…" y={560} />
        <Caption text="और बाणों की वो बिजली-सी रफ़्तार भी साथ कट गई।" keys={["रफ़्तार", "कट"]} />
      </>
    ),
  },
  // 17 · L18 Arjuna's face: relief, and under it a shadow.
  {
    svg: (
      <g>
        <Forest7 f={F} tod="golden" beams={0.4} mist={0.2} dense={0} />
        <Ar id="a17" x={520} y={1820} s={2.7} facing={1} o={{ lean: 0, head: 4, sF: 14, eF: 18, brow: 0.45, browTilt: -4, smile: 0.3, lookX: 0.3, lookY: 0.4 }} />
        <rect width={W} height={H} fill="#101830" opacity={0.22} />
        <Vignette o={0.55} c="#0E0804" />
      </g>
    ),
    html: <Caption text="और अर्जुन की चिंता मिट गई।" keys={["चिंता"]} />,
  },
  // 18 · L19 the seed: a far arena at dusk, a lone silhouette with a bow — unnamed (Karna, Ep8).
  {
    svg: (
      <g>
        <ArenaDusk f={F} />
        <g transform="translate(540 1640)" opacity={0.95}>
          <path d="M-30 0C-34 -120 -28 -240 -16 -300L16 -300C28 -240 34 -120 30 0Z" fill="#0E0A16" />
          <circle cx={0} cy={-336} r={34} fill="#0E0A16" />
          <path d="M-10 -360C-30 -380 -34 -410 -20 -428" stroke="#0E0A16" strokeWidth={10} fill="none" />
          <path d="M40 -380C80 -320 84 -240 44 -170L52 -170C92 -240 88 -320 48 -380Z" fill="#0E0A16" />
          <path d="M-60 -300C-100 -240 -100 -160 -60 -100" stroke="#0E0A16" strokeWidth={12} fill="none" />
        </g>
        <ellipse cx={540} cy={1300} rx={300} ry={240} fill="#FF7A3A" opacity={0.12} filter="url(#k7Blur22)" />
        <Vignette o={0.55} c="#0A0610" />
      </g>
    ),
    html: (
      <>
        <Stamp text={[p("अभी खत्म "), p("नहीं…", true)]} y={470} size={96} sub="अर्जुन की ईर्ष्या · जारी रहेगी" />
        <Caption text="पर ये ईर्ष्या यहीं खत्म नहीं हुई… एक दिन अर्जुन के सामने कर्ण खड़ा होगा।" keys={["कर्ण"]} />
      </>
    ),
  },
  // 19 · L20 feature: अपनी भाषा में.
  {
    svg: (
      <g>
        <rect width={W} height={H} fill="#FFF4E4" />
        <circle cx={540} cy={900} r={700} fill="#FFE0B0" opacity={0.6} filter="url(#k7Blur22)" />
        <g opacity={0.1}>
          <ClayGuru x={220} y={1780} s={0.9} />
          <Target x={880} y={1800} s={0.8} arrows={4} />
        </g>
      </g>
    ),
    html: <ChatCard />,
  },
  // 20 · End card.
  {
    svg: (
      <g>
        <rect width={W} height={H} fill="#FFF4E4" />
        <circle cx={540} cy={800} r={760} fill="#FFE0B0" opacity={0.6} filter="url(#k7Blur22)" />
      </g>
    ),
    html: <EndText />,
  },
];

export const Bharata7Board: React.FC = () => {
  const i = Math.min(panels.length - 1, useCurrentFrame());
  const pn = panels[i];
  return (
    <AbsoluteFill style={{ background: "#100A06", overflow: "hidden" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <RigDefs />
        <SetDefs />
        <NvDefs />
        <N2Defs />
        <BhDefs />
        <ChDefs />
        <W5Defs />
        <W6Defs />
        <W7Defs />
        {pn.svg}
      </svg>
      {pn.html}
      <Chrome f={F} brand={1} panel={0} />
      <div style={{ position: "absolute", right: 24, bottom: 18, fontFamily: JAKARTA, fontWeight: 800, fontSize: 22, color: "rgba(255,255,255,0.55)", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>EP7 · {String(i).padStart(2, "0")}</div>
    </AbsoluteFill>
  );
};
