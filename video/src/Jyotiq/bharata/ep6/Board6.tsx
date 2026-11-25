import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { AppStoreButton, PlayButton } from "../../katha/reelKit";
import { Puppet, RigDefs, blinkAt, idle, pose, type Pose, type Who } from "../../manthan/rig";
import { SetDefs } from "../../manthan/sets";
import { CAP_BOTTOM, CAP_TOP, Chrome, GRAD, HookPlate, JAKARTA, MUKTA, NameChip, Presents, ROZHA, S, TwoTone, gradText, type Part } from "../../navagraha/ep1/look";
import { NvDefs } from "../../navagraha/ep1/world";
import { N2Defs } from "../../navagraha/ep2/anim2";
import { ChDefs } from "../../chhath/world";
import { BhDefs } from "../ep1/world";
import { Vasu } from "../ep1/cast";
import { W5Defs } from "../ep5/world5";
import { Kanya } from "../ep5/kunti";
import { AKRITAVRANA, AMBA6, BHISHMA6, BhishmaKavach, Bow6, NARADA, PARASHURAMA, PITRI, Parashu, Ratha, Sword, Veena } from "./cast6";
import { ArrowClash, ArrowSky, Ashram, AstraClash, Kurukshetra, PrasvapaGlow, Smoke, StarSky, Tent, W6Defs } from "./world6";

/*
 * भारत · BHARATA Episode 6 · गुरु से युद्ध: STORYBOARD (one still per script beat, frame i = board panel i).
 * Looks follow the Udyoga Parva text (see cast6.tsx / world6.tsx headers). This is the frame design pass before audio:
 * captions show the planned line; motion, timing and the VO clock come later.
 */
export const BOARD6_FRAMES = 22;
const W = 1080;
const H = 1920;
const F = 60; // a fixed "life" frame for idles, flames and banners
const p = (t: string, hi = false): Part => ({ t, hi });

type ManArgs = { id: string; who: Who; x: number; y: number; s: number; facing?: number; o?: Partial<Pose>; prop?: React.ReactNode; backProp?: React.ReactNode; f?: number };
const Man: React.FC<ManArgs> = ({ id, who, x, y, s, facing = 1, o = {}, prop, backProp, f = F }) => (
  <Puppet id={id} who={who} at={{ x, y, s, facing }} p={pose({ ...idle(id, f, 0.6), blink: blinkAt(id, f), ...o })} t={f} prop={prop} backProp={backProp} />
);
/** Bhishma in white with the kavach drawn over the torso. */
const Bhishma: React.FC<Omit<ManArgs, "who"> & { armour?: boolean }> = ({ armour = true, ...a }) => {
  const ps = pose({ ...idle(a.id, a.f ?? F, 0.6), blink: blinkAt(a.id, a.f ?? F), ...(a.o ?? {}) });
  return (
    <g>
      <Puppet id={a.id} who={BHISHMA6} at={{ x: a.x, y: a.y, s: a.s, facing: a.facing ?? 1 }} p={ps} t={a.f ?? F} prop={a.prop} backProp={a.backProp} />
      {armour ? <BhishmaKavach x={a.x} y={a.y} s={a.s} facing={a.facing ?? 1} p={ps} /> : null}
    </g>
  );
};
const Rama: React.FC<Omit<ManArgs, "who">> = (a) => <Man {...a} who={PARASHURAMA} />;

const Vignette: React.FC<{ o?: number; c?: string }> = ({ o = 0.55, c = "#0A0612" }) => (
  <g opacity={o}>
    <radialGradient id="b6Vig" cx="0.5" cy="0.5" r="0.75">
      <stop offset="0.55" stopColor={c} stopOpacity="0" />
      <stop offset="1" stopColor={c} stopOpacity="0.9" />
    </radialGradient>
    <rect width={W} height={H} fill="url(#b6Vig)" />
  </g>
);
const FireGlow: React.FC<{ x: number; y: number; r?: number; o?: number }> = ({ x, y, r = 420, o = 0.35 }) => <circle cx={x} cy={y} r={r} fill="#FF7A2A" opacity={o} filter="url(#k6Blur24)" />;

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
/** The day counter that runs through the fight (retention device): "दिन N / 23". */
const DayCounter: React.FC<{ n: number; y?: number; red?: boolean }> = ({ n, y = 470, red }) => (
  <div style={{ position: "absolute", right: 46, top: y, display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 22px 14px", borderRadius: 26, background: "rgba(26,10,10,0.86)", border: `3px solid ${red ? "#FF6A3A" : S.gold}`, boxShadow: "0 10px 24px rgba(0,0,0,0.4)" }}>
    <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 20, letterSpacing: 4, color: S.goldLight }}>युद्ध · DAY</div>
    <div style={{ fontFamily: ROZHA, fontSize: 92, lineHeight: 1, color: red ? "#FF8A5A" : "#FFE3A1" }}>
      {n}
      <span style={{ fontFamily: MUKTA, fontSize: 34, color: "#FFF3DA", opacity: 0.7 }}> / 23</span>
    </div>
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
const Name: React.FC<{ hi: string; en: string; tag: string; icon?: string; y?: number }> = ({ y = 520, ...n }) => <NameChip {...n} y={y} />;

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
      <div style={{ marginTop: 24, padding: "12px 34px", borderRadius: 40, background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 44 }}>Episode 6 · गुरु से युद्ध</div>
    </div>
  </div>
);

const ChatCard: React.FC = () => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
    <TwoTone parts={[p("एक तरफ़ गुरु… "), p("एक तरफ़ वचन", true)]} size={64} />
    <div style={{ width: 760, borderRadius: 48, background: "#FFF9F0", border: `4px solid ${S.goldLight}`, boxShadow: "0 24px 60px rgba(20,10,30,0.45)", padding: "26px 28px 30px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, borderBottom: "2px solid #F0E2CC", paddingBottom: 14 }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: "#1A1020", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Img src={staticFile("jyotiq/logo-full.png")} style={{ width: 44, height: 50, objectFit: "contain" }} />
        </div>
        <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 32, color: S.brown }}>Jyotiq</div>
      </div>
      <div style={{ alignSelf: "flex-end", maxWidth: 560, padding: "16px 22px", borderRadius: "28px 28px 6px 28px", background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 700, fontSize: 38, lineHeight: 1.3 }}>
        नई नौकरी का ऑफ़र है, पर पुरानी जगह से वादा किया था… क्या करूँ?
      </div>
      <div style={{ alignSelf: "flex-start", padding: "16px 26px", borderRadius: "28px 28px 28px 6px", background: "#F3E6D2", color: S.brown, fontFamily: MUKTA, fontWeight: 700, fontSize: 40 }}>● ● ●</div>
    </div>
    <div style={{ padding: "14px 32px", borderRadius: 28, background: "rgba(26,16,40,0.9)", border: `2.5px solid ${S.gold}`, color: "#FFF3DA", fontFamily: MUKTA, fontWeight: 800, fontSize: 42 }}>जब मन दो राहों पर अटके… ज्योतिक़ से पूछिए</div>
  </div>
);

const EndChip: React.FC<{ t: string; on?: boolean }> = ({ t, on }) => (
  <div style={{ padding: "10px 24px", borderRadius: 30, background: on ? GRAD : "#FFFFFF", border: `2.5px solid ${S.goldLight}`, fontFamily: MUKTA, fontWeight: 700, fontSize: 34, color: on ? "#FFFFFF" : S.brown }}>{t}</div>
);
const EndText: React.FC = () => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 500, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
    <div style={{ padding: "16px 40px 20px", borderRadius: 34, background: "rgba(26,16,40,0.92)", border: `3px solid ${S.gold}`, textAlign: "center" }}>
      <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 24, letterSpacing: 6, color: S.goldLight }}>अगला एपिसोड · NEXT</div>
      <div style={{ fontFamily: ROZHA, fontSize: 84, lineHeight: 1.1, background: "linear-gradient(180deg, #FFF3C4 0%, #F6C14E 60%, #C07A1E 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>एकलव्य का अंगूठा</div>
      <div style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 34, color: "#FFF3DA" }}>“गुरु-दक्षिणा में… अंगूठा।”</div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 6 }}>
      <div style={{ width: 120, height: 120, borderRadius: 60, background: "radial-gradient(circle at 50% 40%, #2A1830 0%, #120C16 75%)", border: `3px solid ${S.gold}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Img src={staticFile("jyotiq/logo-full.png")} style={{ width: 82, height: 96, objectFit: "contain" }} />
      </div>
      <TwoTone parts={[p("ज्योतिक़ "), p("डाउनलोड कीजिए", true)]} size={66} />
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, maxWidth: 940 }}>
      {["सवाल पूछिए", "फ़्री कुंडली", "दशा", "गोचर", "पंचांग"].map((t, i) => (
        <EndChip key={t} t={t} on={i === 0} />
      ))}
    </div>
    <div style={{ display: "flex", gap: 18, transform: "scale(0.9)" }}>
      <PlayButton glow={0.5} />
      <AppStoreButton glow={0.5} />
    </div>
    <div style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: 42, ...gradText }}>ऐप का लिंक बायो में ↑ · www.jyotiq.ai</div>
    <div style={{ padding: "14px 32px", borderRadius: 28, background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 40 }}>कमेंट करें: भीष्म सही थे या परशुराम?</div>
    <div style={{ fontFamily: JAKARTA, fontWeight: 600, fontSize: 24, color: S.brownMid, opacity: 0.85 }}>Guidance only, for entertainment and information.</div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Panels                                                              */
/* ------------------------------------------------------------------ */

const RAMA_ROAR: Partial<Pose> = { sF: 118, eF: 28, wF: 0, sB: 30, eB: 50, lean: 4, head: -4, brow: 0.9, browTilt: 12, talk: 0.8, smile: -0.6, glow: 0.8, lookX: 1, fist: 1 };
const BHISHMA_CALM: Partial<Pose> = { sF: 18, eF: 30, sB: -10, eB: 14, lean: 0, head: 2, brow: 0.2, browTilt: 2, talk: 0.25, smile: 0, lookX: 1 };

type Panel = { svg: React.ReactNode; html?: React.ReactNode };

const panels: Panel[] = [
  // 00 · HOOK PLATE (frame 0): Parashurama raises the parashu at dawn; plate on top.
  {
    svg: (
      <g>
        <Kurukshetra f={F} tod="dawn" sunX={760} gods={0.6} />
        <FireGlow x={540} y={900} r={520} o={0.3} />
        <Rama id="r0" x={560} y={1520} s={2.3} facing={-1} o={RAMA_ROAR} prop={<Parashu s={0.72} glow={0.9} />} backProp={<Bow6 s={0.9} rot={8} />} />
        <Vignette o={0.55} c="#2A0A06" />
      </g>
    ),
    html: (
      <>
        <HookPlate y={380} size={66} lines={[[p("गुरु "), p("बनाम", true), p(" शिष्य")], [p("23 दिन… "), p("जीता कौन?", true)]]} chip="भीष्म और परशुराम का युद्ध" />
        <Caption who="परशुराम" text="भीष्म! अंबा को अपनाओ… वरना आज तुम्हारा वध होगा।" keys={["वध"]} />
      </>
    ),
  },
  // 01 · L1 Parashurama, close: the threat.
  {
    svg: (
      <g>
        <Kurukshetra f={F} tod="dawn" sunX={300} gods={0.4} />
        <FireGlow x={600} y={800} />
        <Rama id="r1" x={560} y={1760} s={2.6} facing={-1} o={{ ...RAMA_ROAR, sF: 46, eF: 100, wF: -10, talk: 0.7, fist: 1 }} prop={<Parashu s={0.68} glow={0.6} rot={-8} />} />
        <Vignette o={0.5} c="#2A0A06" />
      </g>
    ),
    html: (
      <>
        <Name hi="परशुराम" en="PARASHURAMA" tag="जमदग्नि-पुत्र · भीष्म के गुरु" icon="🪓" />
        <Caption who="परशुराम" text="भीष्म! अंबा को अपनाओ… वरना आज तुम्हारा वध होगा।" keys={["वध"]} />
      </>
    ),
  },
  // 02 · L2 Bhishma on the silver car, under the white umbrella, bow lowered, calm.
  {
    svg: (
      <g>
        <Kurukshetra f={F} tod="dawn" sunX={820} gods={0.5} />
        <g transform="translate(460 1700)">
          <Ratha f={F} s={1.25} facing={1} metal="silver" banner="palm" umbrella part="back" />
        </g>
        <Bhishma id="b2" x={430} y={1330} s={1.45} facing={1} o={BHISHMA_CALM} prop={<Bow6 s={0.85} white />} />
        <g transform="translate(460 1700)">
          <Ratha f={F} s={1.25} facing={1} metal="silver" banner="palm" part="front" />
        </g>
        <Vignette o={0.45} c="#1A0A10" />
      </g>
    ),
    html: (
      <>
        <Name hi="भीष्म" en="BHISHMA" tag="गंगा-पुत्र · प्रतिज्ञा के धनी" icon="🏹" />
        <Caption who="भीष्म" text="गुरुदेव… डर से मैं अपना वचन नहीं तोड़ूँगा।" keys={["वचन"]} />
      </>
    ),
  },
  // 03 · L3 Parashurama roars: "इक्कीस बार…"; the axe blazes; war sky.
  {
    svg: (
      <g>
        <Kurukshetra f={F} tod="war" sunX={540} gods={0} crowd={0} camp={false} />
        <FireGlow x={540} y={700} r={600} o={0.45} />
        <Rama id="r3" x={470} y={1700} s={2.4} facing={1} o={{ ...RAMA_ROAR, sF: 150, eF: 12, talk: 1, glow: 1 }} prop={<Parashu s={0.5} glow={1} />} />
        <Vignette o={0.6} c="#1A0404" />
      </g>
    ),
    html: <Caption who="परशुराम" text="मुझे ललकारोगे? मैंने इक्कीस बार धरती को क्षत्रियों से खाली किया है!" keys={["इक्कीस"]} />,
  },
  // 04 · L4 Bhishma, close: "तब… भीष्म पैदा नहीं हुआ था।" He lifts the white bow.
  {
    svg: (
      <g>
        <Kurukshetra f={F} tod="dawn" sunX={260} gods={0} crowd={0} />
        <circle cx={540} cy={820} r={520} fill="#FFF4E0" opacity={0.25} filter="url(#k6Blur24)" />
        <Bhishma id="b4" x={520} y={1760} s={2.9} facing={1} o={{ sF: 70, eF: 50, sB: -4, eB: 20, head: -2, brow: 0.5, browTilt: 6, smile: 0.15, talk: 0.3, lookX: 1 }} prop={<Bow6 s={0.9} white />} />
        <Vignette o={0.5} c="#10080A" />
      </g>
    ),
    html: <Caption who="भीष्म" text="तब… भीष्म पैदा नहीं हुआ था।" keys={["भीष्म"]} />,
  },
  // 05 · TITLE
  {
    svg: (
      <g>
        <rect width={W} height={H} fill="#140806" />
        <circle cx={540} cy={820} r={760} fill="#4A1A08" opacity={0.85} filter="url(#k6Blur24)" />
        <g opacity={0.5}>
          <g transform="translate(300 1700)">
            <Ratha f={F} s={0.9} facing={1} metal="silver" banner="palm" />
          </g>
          <g transform="translate(800 1700)">
            <Ratha f={F} s={0.9} facing={-1} metal="gold" banner="sunmoon" />
          </g>
        </g>
        <path d="M0 1500C300 1460 700 1540 1080 1480L1080 1920L0 1920Z" fill="#200A06" />
      </g>
    ),
    html: <TitleText />,
  },
  // 06 · L5 The hermitage: Amba seeks Parashurama ("पर ये हुआ क्यों?").
  {
    svg: (
      <g>
        <Ashram f={F} />
        <Man id="ak6" who={AKRITAVRANA} x={160} y={1560} s={1.0} facing={1} o={{ sF: 20, eF: 40, smile: 0.1, lookX: 1 }} />
        <Rama id="r6" x={760} y={1560} s={1.3} facing={-1} o={{ sF: 20, eF: 30, sB: -8, eB: 10, lookX: 1, brow: 0.3 }} prop={<Bow6 s={0.75} />} backProp={<Parashu s={0.8} rot={-6} />} />
        <Kanya pal={AMBA6} id="a6" f={F} x={420} y={1800} s={0.95} crown="none" plain hands={[[-14, -520], [14, -520]]} lookX={0.6} lookY={-0.2} smile={-0.5} sad={0.9} tears={0.5} tilt={4} />
        <Vignette o={0.3} c="#3A1A08" />
      </g>
    ),
    html: (
      <>
        <Chip text="⏪ पहले… अंबा, जिसे किसी ने नहीं अपनाया" y={560} />
        <Caption text="पर ये हुआ क्यों? जब अंबा को किसी ने नहीं अपनाया… वो परशुराम के पास गई।" keys={["क्यों?", "परशुराम"]} />
      </>
    ),
  },
  // 07 · L6 Amba kneels at his feet: "न्याय कीजिए।"
  {
    svg: (
      <g>
        <Ashram f={F} />
        <Rama id="r7" x={780} y={1700} s={1.9} facing={-1} o={{ sF: 40, eF: 70, wF: -10, lookX: 1, lookY: 0.5, brow: 0.4, browTilt: -4, smile: -0.2 }} backProp={<Parashu s={0.8} rot={-6} />} />
        <Kanya pal={AMBA6} id="a7" f={F} x={360} y={2060} s={1.3} crown="none" plain hands={[[-14, -520], [14, -520]]} lookX={0.7} lookY={-0.6} smile={-0.6} sad={1} tears={0.9} tilt={-6} lean={6} speak={0.5} />
        <Vignette o={0.35} c="#3A1A08" />
      </g>
    ),
    html: (
      <>
        <Name hi="अंबा" en="AMBA" tag="काशी की राजकुमारी" icon="✿" />
        <Caption who="अंबा" text="भगवन्… भीष्म ने मेरा जीवन उजाड़ दिया। न्याय कीजिए।" keys={["न्याय"]} />
      </>
    ),
  },
  // 08 · L7 Before the fight Bhishma steps down and touches his guru's feet.
  {
    svg: (
      <g>
        <Kurukshetra f={F} tod="dawn" sunX={540} gods={0.8} />
        <g transform="translate(150 1640)" opacity={0.95}>
          <Ratha f={F} s={0.9} facing={1} metal="silver" banner="palm" umbrella />
        </g>
        <Rama id="r8" x={760} y={1400} s={1.35} facing={-1} o={{ sF: 50, eF: 60, wF: -20, lookX: 1, lookY: 0.6, smile: 0.1, brow: 0.2 }} prop={<Bow6 s={0.8} />} />
        <Bhishma id="b8" x={420} y={1420} s={1.25} facing={1} o={{ lean: 16, head: 18, sF: 62, eF: 118, wF: 10, sB: 58, eB: 118, wB: 10, lookX: 0.5, lookY: 0.9, blink: 0.85, smile: 0.15, brow: 0.2 }} armour={false} />
        <Vignette o={0.4} c="#1A0A10" />
      </g>
    ),
    html: <Caption who="भीष्म" text="आशीर्वाद दीजिए, गुरुदेव।" keys={["आशीर्वाद"]} />,
  },
  // 09 · L8 "विजयी भव नहीं कहूँगा…": Parashurama steps back; his golden car behind him.
  {
    svg: (
      <g>
        <Kurukshetra f={F} tod="dawn" sunX={300} gods={0.6} />
        <g transform="translate(860 1640)">
          <Ratha f={F} s={0.95} facing={-1} metal="gold" banner="sunmoon" part="back" />
        </g>
        <Man id="ak9" who={AKRITAVRANA} x={900} y={1400} s={0.8} facing={-1} o={{ sF: 60, eF: 70, lookX: 1 }} />
        <g transform="translate(860 1640)">
          <Ratha f={F} s={0.95} facing={-1} metal="gold" banner="sunmoon" part="front" />
        </g>
        <Rama id="r9" x={600} y={1720} s={2.2} facing={-1} o={{ sF: 60, eF: 80, wF: -30, lookX: 1, brow: 0.6, browTilt: 8, smile: 0.15, talk: 0.6 }} prop={<Bow6 s={0.9} />} />
        <Vignette o={0.45} c="#1A0A06" />
      </g>
    ),
    html: <Caption who="परशुराम" text="विजयी भव नहीं कहूँगा… आज मैं तुम्हें हराने आया हूँ।" keys={["विजयी"]} />,
  },
  // 10 · L9 The fight: two chariots, arrows cut down in mid-air. Day counter.
  {
    svg: (
      <g>
        <Kurukshetra f={F} tod="day" sunX={540} gods={0.9} horizon={1120} />
        <ArrowSky f={F} k={0.5} />
        <g transform="translate(230 1720)">
          <Ratha f={F} s={0.95} facing={1} metal="silver" banner="palm" umbrella part="back" />
        </g>
        <Bhishma id="b10" x={210} y={1440} s={1.05} facing={1} o={{ sF: 92, eF: 0, sB: 86, eB: 120, lookX: 1, brow: 0.6, browTilt: 8 }} prop={<Bow6 s={0.8} white draw={0.8} arrow={1} />} />
        <g transform="translate(230 1720)">
          <Ratha f={F} s={0.95} facing={1} metal="silver" banner="palm" part="front" />
        </g>
        <g transform="translate(860 1720)">
          <Ratha f={F} s={0.95} facing={-1} metal="gold" banner="sunmoon" part="back" />
        </g>
        <Rama id="r10" x={880} y={1440} s={1.05} facing={-1} o={{ sF: 92, eF: 0, sB: 86, eB: 120, lookX: 1, brow: 0.8, browTilt: 12, glow: 0.4 }} prop={<Bow6 s={0.8} draw={0.8} arrow={1} />} />
        <g transform="translate(860 1720)">
          <Ratha f={F} s={0.95} facing={-1} metal="gold" banner="sunmoon" part="front" />
        </g>
        <ArrowClash f={F} x={545} y={1080} n={16} />
        <Vignette o={0.35} c="#2A0A06" />
      </g>
    ),
    html: (
      <>
        <DayCounter n={10} />
        <Caption text="एक दिन… दस दिन… बीस दिन…" keys={["दिन…"]} />
      </>
    ),
  },
  // 11 · L10 Parashurama's arrow strikes Bhishma's chest; he falls from the car.
  {
    svg: (
      <g>
        <Kurukshetra f={F} tod="war" sunX={760} gods={0.4} crowd={0.6} />
        <ArrowSky f={F} k={0.7} />
        <g transform="translate(560 1760)">
          <Ratha f={F} s={1.05} facing={1} metal="silver" banner="palm" umbrella />
        </g>
        <g transform="rotate(-38 420 1640)">
          <Bhishma id="b11" x={420} y={1540} s={1.3} facing={1} o={{ lean: -10, head: -20, sF: 140, eF: 40, sB: 120, eB: 60, blink: 0.8, talk: 0.4, smile: -0.5, brow: 0.8, browTilt: -10 }} />
        </g>
        <path d="M640 1150L470 1290" stroke="#5A3A22" strokeWidth={6} />
        <path d="M470 1290L486 1270L492 1284Z" fill="#C9CCD2" />
        {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={300 + i * 50} cy={1820 - (i % 3) * 30} r={60 + (i % 4) * 20} fill="#C89A6A" opacity={0.18} />)}
        <rect width={W} height={H} fill="#808080" opacity={0.35} style={{ mixBlendMode: "saturation" }} />
        <Vignette o={0.6} c="#1A0404" />
      </g>
    ),
    html: (
      <>
        <DayCounter n={20} red />
        <Caption text="फिर परशुराम का बाण भीष्म की छाती में लगा… और वो गिर पड़े।" keys={["छाती", "गिर"]} />
      </>
    ),
  },
  // 12 · L11 Night, the tent: Bhishma asleep on his right side; eight brahmanas of light appear (callback: Ep1's Vasus).
  {
    svg: (
      <g>
        <Tent f={F} lamp={1} blue={0.6} />
        <g transform="rotate(-90 540 1500)">
          <Bhishma id="b12" x={540} y={1500} s={1.15} facing={1} o={{ blink: 1, sF: 20, eF: 40, sB: -10, eB: 20, smile: 0, head: 6 }} armour={false} />
        </g>
        {Array.from({ length: 8 }, (_, i) => {
          const a = Math.PI * (0.1 + (0.8 * i) / 7);
          return (
            <g key={i} transform={`translate(${540 - Math.cos(a) * 400} ${1140 - Math.sin(a) * 420})`}>
              <Vasu f={F + i * 7} s={2.1} seed={i} />
            </g>
          );
        })}
        <circle cx={540} cy={900} r={420} fill="#FFF0C0" opacity={0.12} filter="url(#k6Blur24)" />
      </g>
    ),
    html: (
      <>
        <Chip text="🌙 उस रात… एक सपना" y={560} />
        <Caption text="उस रात… सपने में आठ ब्राह्मण आए।" keys={["सपने", "आठ"]} />
      </>
    ),
  },
  // 13 · L12 The brahmanas: "प्रस्वाप अस्त्र याद करो…": the sleepy-blue light settles in Bhishma's palm.
  {
    svg: (
      <g>
        <StarSky f={F} />
        {Array.from({ length: 8 }, (_, i) => {
          const a = Math.PI * (0.05 + (0.9 * i) / 7);
          return (
            <g key={i} transform={`translate(${540 - Math.cos(a) * 430} ${900 - Math.sin(a) * 380})`}>
              <Vasu f={F + i * 5} s={2.4} seed={i} />
            </g>
          );
        })}
        <Bhishma id="b13" x={540} y={1800} s={2.4} facing={1} o={{ sF: 60, eF: 70, wF: -20, lookX: 0.2, lookY: -0.8, head: -10, brow: 0.8, smile: 0.1 }} armour={false} />
        <PrasvapaGlow f={F} x={700} y={1180} r={90} />
        <Vignette o={0.45} c="#05051A" />
      </g>
    ),
    html: (
      <>
        <Chip text="प्रस्वाप · नींद का अस्त्र" y={560} />
        <Caption who="आठ ब्राह्मण" text="उठो, भीष्म। प्रस्वाप अस्त्र याद करो… पिछले जन्म में ये तुम्हारा था।" keys={["प्रस्वाप"]} />
      </>
    ),
  },
  // 14 · L13 Day 23: the Brahma-astras blaze in the sky; Bhishma draws the Prasvapa.
  {
    svg: (
      <g>
        <Kurukshetra f={F} tod="war" sunX={540} gods={0.3} crowd={0.5} />
        <AstraClash f={F} x={540} y={520} />
        <g transform="translate(340 1780)">
          <Ratha f={F} s={1.0} facing={1} metal="silver" banner="palm" umbrella part="back" />
        </g>
        <Bhishma id="b14" x={330} y={1480} s={1.3} facing={1} o={{ sF: 92, eF: 0, sB: 86, eB: 125, lookX: 1, brow: 0.8, browTilt: 10, glow: 0.3 }} prop={<Bow6 s={0.85} white draw={0.95} arrow={1} astra={1} />} />
        <g transform="translate(340 1780)">
          <Ratha f={F} s={1.0} facing={1} metal="silver" banner="palm" part="front" />
        </g>
        <Vignette o={0.5} c="#1A0404" />
      </g>
    ),
    html: (
      <>
        <DayCounter n={23} red />
        <Caption text="तेईसवें दिन भीष्म ने वो अस्त्र चढ़ाया… जो गुरु को रणभूमि में सुला देता।" keys={["तेईसवें", "सुला"]} />
      </>
    ),
  },
  // 15 · L14 Narada in the sky with the gods: "रुको, भीष्म!"
  {
    svg: (
      <g>
        <Kurukshetra f={F} tod="day" sunX={540} gods={1} horizon={1500} crowd={0} camp={false} />
        <g opacity={0.95}>
          <path d="M80 1500C120 1400 300 1380 380 1430C440 1360 640 1360 700 1430C780 1380 960 1400 1000 1500Z" fill="#FFF0DA" />
          <path d="M80 1500L1000 1500C960 1470 880 1460 820 1470C740 1450 640 1450 560 1466C470 1450 380 1452 300 1470C220 1460 140 1470 80 1500Z" fill="#E8D2B0" />
        </g>
        <circle cx={540} cy={900} r={380} fill="#FFF4D0" opacity={0.5} filter="url(#k6Blur24)" />
        <Man id="n15" who={NARADA} x={540} y={1470} s={2.0} facing={1} o={{ sF: 150, eF: 10, wF: -20, sB: 30, eB: 60, lookX: 0.1, lookY: 0.4, brow: 0.6, browTilt: -2, talk: 0.7 }} backProp={<Veena s={0.9} rot={-6} glow={0.6} />} />
        {[[150, 1040], [930, 1040], [230, 1260], [850, 1260]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`} opacity={0.85}>
            <circle cy={-50} r={34} fill="#FFF6D0" opacity={0.6} />
            <circle cy={-50} r={20} fill="#D49A6A" />
            <path d="M-14 -70L0 -94L14 -70Z" fill="#F2C14E" />
            <path d="M-30 0C-26 -28 -14 -40 0 -40C14 -40 26 -28 30 0Z" fill={i % 2 ? "#B3262E" : "#1F3E8A"} />
          </g>
        ))}
      </g>
    ),
    html: (
      <>
        <Name hi="नारद" en="NARADA" tag="देवर्षि · देवताओं के दूत" icon="🪕" />
        <Caption who="नारद" text="रुको, भीष्म! अपने गुरु का अपमान मत करो!" keys={["रुको,"]} />
      </>
    ),
  },
  // 16 · L15 Bhishma lowers his bow; Parashurama's forefathers in smoke stop the fight.
  {
    svg: (
      <g>
        <Kurukshetra f={F} tod="dusk" sunX={540} gods={0.5} crowd={0.4} />
        <Smoke f={F} x={760} y={1500} w={600} h={900} />
        {[[620, 1300], [790, 1240], [950, 1300]].map(([x, y], i) => (
          <g key={i} opacity={0.42}>
            <Man id={`pt${i}`} who={PITRI} x={x} y={y} s={1.05} facing={-1} o={{ sF: i === 1 ? 120 : 60, eF: 30, lookX: 1, smile: 0, brow: 0.3 }} />
          </g>
        ))}
        <Rama id="r16" x={780} y={1640} s={1.45} facing={-1} o={{ sF: 10, eF: 20, sB: -14, eB: 10, head: 10, lookX: 0.2, lookY: 0.7, brow: 0.5, browTilt: -6, smile: -0.3 }} prop={<Parashu s={0.85} rot={60} />} />
        <Bhishma id="b16" x={290} y={1640} s={1.45} facing={1} o={{ sF: 12, eF: 20, sB: -8, eB: 12, head: 4, lookX: 1, brow: 0.3, smile: 0.05 }} prop={<Bow6 s={0.8} white rot={30} />} />
        <Vignette o={0.45} c="#140A14" />
      </g>
    ),
    html: <Caption text="भीष्म रुक गए। और परशुराम के पितरों ने युद्ध रुकवा दिया।" keys={["रुक", "पितरों"]} />,
  },
  // 17 · L16 Parashurama to Amba, breathing hard: "भीष्म को नहीं हरा सका।"
  {
    svg: (
      <g>
        <Kurukshetra f={F} tod="dusk" sunX={260} gods={0} crowd={0.3} />
        <Rama id="r17" x={680} y={1760} s={2.5} facing={-1} o={{ sF: 30, eF: 60, wF: -20, head: 8, lookX: 1, lookY: 0.3, brow: 0.5, browTilt: -8, smile: -0.4, talk: 0.5, blink: 0.25 }} />
        <Kanya pal={AMBA6} id="a17" f={F} x={220} y={2050} s={1.25} crown="none" plain hands={[[-40, -440], [40, -440]]} lookX={0.8} lookY={-0.2} smile={-0.5} sad={0.8} tilt={6} />
        <Vignette o={0.5} c="#140A14" />
      </g>
    ),
    html: <Caption who="परशुराम" text="अंबा… मैंने पूरी शक्ति लगा दी। पर भीष्म को नहीं हरा सका।" keys={["हरा"]} />,
  },
  // 18 · L17 Amba, close, firelight: "तो अब मैं खुद… भीष्म की मृत्यु बनूँगी।"
  {
    svg: (
      <g>
        <rect width={W} height={H} fill="#120806" />
        <FireGlow x={300} y={1500} r={700} o={0.4} />
        {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${60 + i * 160} 1920L${80 + i * 160} 300`} stroke="#0A0604" strokeWidth={50 + (i % 3) * 20} opacity={0.6} />)}
        <Kanya pal={AMBA6} id="a18" f={F} x={540} y={2280} s={1.75} crown="none" plain hands={[[-40, -440], [60, -560]]} lookX={-0.1} lookY={0} smile={-0.7} sad={0.4} tilt={0} speak={0.4} />
        <Vignette o={0.6} c="#0A0402" />
      </g>
    ),
    html: <Caption who="अंबा" text="तो अब मैं खुद… भीष्म की मृत्यु बनूँगी।" keys={["मृत्यु"]} />,
  },
  // 19 · L18 Bhishma alone on the empty field at dusk: "तो फिर… उन्हें गिराएगा कौन?"
  {
    svg: (
      <g>
        <Kurukshetra f={F} tod="dusk" sunX={540} gods={0} crowd={0} camp={false} />
        <Bhishma id="b19" x={540} y={1700} s={1.5} facing={1} o={{ sF: 8, eF: 14, sB: -8, eB: 10, head: 6, lookX: 0.3, lookY: 0.3, smile: 0 }} prop={<Bow6 s={0.8} white rot={10} />} />
        <rect width={W} height={H} fill="#808080" opacity={0.25} style={{ mixBlendMode: "saturation" }} />
        <Vignette o={0.65} c="#0A0408" />
      </g>
    ),
    html: (
      <>
        <Stamp text={[p("गिराएगा "), p("कौन?", true)]} y={480} size={120} sub="भीष्म · जिन्हें कोई योद्धा नहीं हरा सका" />
        <Caption text="भीष्म को कोई योद्धा नहीं हरा सकता था। तो फिर… उन्हें गिराएगा कौन?" keys={["कौन?"]} />
      </>
    ),
  },
  // 20 · L19 Feature: chat question.
  {
    svg: (
      <g>
        <rect width={W} height={H} fill="#FFF4E4" />
        <circle cx={540} cy={900} r={700} fill="#FFE0B0" opacity={0.6} filter="url(#k6Blur24)" />
        <g opacity={0.12}>
          <g transform="translate(200 1900)">
            <Ratha f={F} s={0.8} facing={1} metal="silver" banner="palm" />
          </g>
          <g transform="translate(880 1900)">
            <Ratha f={F} s={0.8} facing={-1} metal="gold" banner="sunmoon" />
          </g>
        </g>
      </g>
    ),
    html: <ChatCard />,
  },
  // 21 · End card.
  {
    svg: (
      <g>
        <rect width={W} height={H} fill="#FFF4E4" />
        <circle cx={540} cy={800} r={760} fill="#FFE0B0" opacity={0.6} filter="url(#k6Blur24)" />
      </g>
    ),
    html: <EndText />,
  },
];

export const Bharata6Board: React.FC = () => {
  const i = Math.min(panels.length - 1, useCurrentFrame());
  const pn = panels[i];
  return (
    <AbsoluteFill style={{ background: "#140806", overflow: "hidden" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <RigDefs />
        <SetDefs />
        <NvDefs />
        <N2Defs />
        <BhDefs />
        <ChDefs />
        <W5Defs />
        <W6Defs />
        {pn.svg}
      </svg>
      {pn.html}
      <Chrome f={F} brand={1} panel={0} />
      <div style={{ position: "absolute", right: 24, bottom: 18, fontFamily: JAKARTA, fontWeight: 800, fontSize: 22, color: "rgba(255,255,255,0.55)", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>EP6 · {String(i).padStart(2, "0")}</div>
    </AbsoluteFill>
  );
};
