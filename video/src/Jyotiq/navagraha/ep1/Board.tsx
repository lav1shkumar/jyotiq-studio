import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { AppStoreButton, PlayButton } from "../../katha/reelKit";
import { Puppet, RigDefs, pose } from "../../manthan/rig";
import { SetDefs } from "../../manthan/sets";
import { SHANI, VISHVA, YAMA } from "./cast";
import {
  Caption,
  Chrome,
  GRAD,
  Guides,
  HookPlate,
  JAKARTA,
  MUKTA,
  NameChip,
  Part,
  Pill,
  Presents,
  S,
  TwoTone,
  gradText,
} from "./look";
import { NvOpen, nvOpenBug } from "./open";
import { SanjnaStanding } from "./sanjna";
import { CurseSmoke, ForestSet, H, NvDefs, PalaceSet, SunRays, SvgImage, TejShards, W, WorkshopSet } from "./world";

/*
 * नवग्रह जन्म Ep1 · सूर्य: STORYBOARD. One composition frame = one storyboard panel (render with --sequence).
 * Script: workspace/navagraha-ep1/SCRIPT.md (v2). Every panel carries the fixed chrome (brand bug top-left,
 * app panel top-right); characters stay in the character stage, clear of both, of the caption band and of
 * the bottom 250 px. Panel 16 shows the layout zones.
 */

const T = 40; // the animation time each still is drawn at

const Stage: React.FC<{ svg: React.ReactNode; html?: React.ReactNode; bg?: string; chrome?: boolean; brand?: number }> = ({ svg, html, bg = S.cream, chrome = true, brand = 1 }) => {
  return (
    <AbsoluteFill style={{ background: bg }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <RigDefs />
        <SetDefs />
        <NvDefs />
        {svg}
      </svg>
      {html}
      {chrome ? <Chrome f={T} brand={brand} /> : null}
    </AbsoluteFill>
  );
};

const p = (t: string, hi = false): Part => ({ t, hi });

/** Chhaya = Sanjna's figure through the violet shadow filter, with a soft violet aura. */
const Chhaya: React.FC<React.ComponentProps<typeof SanjnaStanding>> = (props) => (
  <g>
    <ellipse cx={props.x} cy={props.y - 360 * (props.s ?? 0.43)} rx={300 * (props.s ?? 0.43)} ry={560 * (props.s ?? 0.43)} fill="url(#nvViolet)" />
    <g filter="url(#nvChhaya)">
      <SanjnaStanding {...props} />
    </g>
  </g>
);

/* ------------------------------------------------------------------ */
/* Panels                                                              */
/* ------------------------------------------------------------------ */

/** The first story scene: Sanjna leaving through the dusk doorway, her long shadow on the floor behind her. */
const HookScene: React.FC = () => (
  <>
    <PalaceSet f={T} door dusk />
    <g transform="translate(540 1404) scale(1.05 -0.9)" filter="url(#nvSil)" opacity={0.8}>
      <SanjnaStanding id="hookShadow" f={T} x={0} y={0} s={0.52} eyes={0} />
    </g>
    <SanjnaStanding id="hookSanjna" f={T} x={540} y={1404} s={0.52} eyes={1} lookY={0.4} smile={-0.1} />
  </>
);

// O1-O3 OPENING (0-5 s): the Manthan-series Jyotiq brand open (ReelOpen motion, no Veo footage) playing over the
// dimmed first scene: motes gather into the diya flame, the logo is lit, then shrinks into the corner bug and a
// bloom opens onto the hook. The stills are the opening at 0.7 s, 2.1 s and 3.3 s.
const Opening: React.FC<{ at: number }> = ({ at }) => <Stage svg={<HookScene />} html={<NvOpen f={at} />} brand={nvOpenBug(at)} />;
const O1: React.FC = () => <Opening at={20} />;
const O2: React.FC = () => <Opening at={64} />;
const O3: React.FC = () => <Opening at={100} />;

// 01 HOOK (as the bloom clears, ~3.5 s): the hook plate over the first scene.
const P01: React.FC = () => (
  <Stage
    svg={<HookScene />}
    html={
      <>
        <Presents y={168} />
        <HookPlate y={560} size={78} lines={[[p("एक पत्नी पति को")], [p("छोड़कर चली गई…", true)]]} chip="पीछे क्या छोड़ गई?" />
      </>
    }
  />
);

// 02 "पीछे छोड़ गई… अपनी परछाईं।" The shadow stands up as Chhaya; Sanjna is a small figure in the doorway.
const P02: React.FC = () => (
  <Stage
    svg={
      <>
        <PalaceSet f={T} door dusk />
        <g opacity={0.55}>
          <SanjnaStanding id="p2Sanjna" f={T} x={600} y={1250} s={0.3} />
        </g>
        <Chhaya id="p2Chhaya" f={T} x={330} y={1450} s={0.84} eyes={1} smile={0.1} lookX={0.3} />
      </>
    }
    html={<Caption parts={[p("पीछे छोड़ गई… अपनी "), p("परछाईं", true), p("।")]} />}
  />
);

// 03 TITLE: Jyotiq presents · नवग्रह जन्म · एपिसोड 1 · सूर्य, in the jyotiq.ai hero look.
const P03: React.FC = () => (
  <Stage
    svg={
      <>
        <rect width={W} height={H} fill="url(#nvSkyPalace)" />
        <circle cx={540} cy={900} r={560} fill="url(#nvWarm)" opacity={0.9} />
        <SvgImage file="jyotiq/site/hero-right-image.png" x={170} y={500} width={740} height={740 * (1293 / 1216)} />
        <SvgImage file="jyotiq/site/hero-left-image.png" x={-90} y={1450} width={500} height={500 * (1216 / 1294)} opacity={0.95} />
        <SvgImage file="jyotiq/site/app5.png" x={700} y={1530} width={420} height={420 * (1024 / 1536)} opacity={0.9} />
      </>
    }
    html={
      <>
        <Presents y={168} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 1200, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ padding: "8px 40px 18px", borderRadius: 40, background: "rgba(255,248,238,0.88)" }}>
            <TwoTone parts={[p("नवग्रह "), p("जन्म", true)]} size={150} />
          </div>
          <div style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 38, color: S.brownMid }}>नौ ग्रह · नौ जन्म-कथाएँ</div>
        </div>
        <Pill text="एपिसोड 1 · सूर्य" y={1475} center size={44} />
      </>
    }
  />
);

// 04 "पति थे सूर्य।" Surya before his blazing sun-wheel.
const P04: React.FC<{ guides?: boolean }> = ({ guides }) => (
  <Stage
    svg={
      <>
        <PalaceSet f={T} blaze={0.9} />
        <Puppet id="p4Surya" who="surya" at={{ x: 560, y: 1158, s: 1.12, facing: 1 }} p={pose({ sF: 30, eF: 50, wF: -10, lookX: 0.3, smile: 0.3, glow: 0.25 })} t={T} />
      </>
    }
    html={
      <>
        <NameChip hi="सूर्य" en="SURYA" tag="अदिति के पुत्र · जगत की रोशनी" y={520} />
        <Caption parts={[p("पति थे "), p("सूर्य", true), p("।")]} />
        {guides ? <Guides /> : null}
      </>
    }
  />
);

// 05 "पत्नी, संज्ञा।"
const P05: React.FC = () => (
  <Stage
    svg={
      <>
        <PalaceSet f={T} blaze={0.4} wheel={{ x: 260, y: 560, w: 560 }} />
        <SanjnaStanding id="p5Sanjna" f={T} x={540} y={1450} s={0.86} smile={0.5} halo={0} />
      </>
    }
    html={
      <>
        <NameChip hi="संज्ञा" en="SANJNA" tag="देव-शिल्पी विश्वकर्मा की पुत्री" y={520} icon="✿" />
        <Caption parts={[p("पत्नी, "), p("संज्ञा", true), p("।")]} />
      </>
    }
  />
);

// 06 "संज्ञा प्रेम करती थीं… पर सूर्य का तेज सह नहीं पाती थीं।"
const P06: React.FC = () => (
  <Stage
    svg={
      <>
        <PalaceSet f={T} blaze={0.3} wheel={{ x: 60, y: 600, w: 420 }} />
        <SunRays x={300} y={820} r={150} k={1} f={T} n={32} />
        <Puppet id="p6Surya" who="surya" at={{ x: 290, y: 1130, s: 1.18, facing: 1 }} p={pose({ sF: 20, eF: 40, lookX: 0.8, smile: 0.4, glow: 0.4 })} t={T} />
        <SanjnaStanding id="p6Sanjna" f={T} x={790} y={1450} s={0.8} hands={[[-58, -440], [36, -706]]} openR eyes={0.25} lookX={-0.6} smile={-0.2} />
        <rect width={W} height={H} fill="#FFF3C9" opacity={0.18} />
      </>
    }
    html={<Caption parts={[p("संज्ञा प्रेम करती थीं… पर सूर्य का "), p("तेज", true), p(" सह नहीं पाती थीं।")]} />}
  />
);

// 07 "तो परछाईं से बनाई छाया, हूबहू अपने जैसी।" The shadow rises off the floor into Chhaya.
const P07: React.FC = () => (
  <Stage
    svg={
      <>
        <PalaceSet f={T} blaze={0.2} wheel={{ x: 300, y: 600, w: 480 }} />
        <path d="M720 1452C600 1470 460 1468 330 1452" stroke={S.chhaya} strokeWidth={30} strokeLinecap="round" opacity={0.45} />
        <SanjnaStanding id="p7Sanjna" f={T} x={740} y={1452} s={0.78} hands={[[-150, -520], [58, -440]]} lookX={-0.8} smile={0.1} />
        <Chhaya id="p7Chhaya" f={T} x={320} y={1452} s={0.78} eyes={0.6} lookX={0.6} smile={0} />
      </>
    }
    html={
      <>
        <NameChip hi="छाया" en="CHHAYA" tag="संज्ञा की परछाईं से बनी" y={520} icon="◐" />
        <Caption parts={[p("तो परछाईं से बनाई "), p("छाया", true), p(", हूबहू अपने जैसी।")]} />
      </>
    }
  />
);

// 08 "और ख़ुद वन में तप करने चली गईं।"
const P08: React.FC = () => (
  <Stage
    svg={
      <>
        <ForestSet f={T} sun={0.45} />
        <SanjnaStanding id="p8Sanjna" f={T} x={540} y={1470} s={0.8} hands={[[-12, -548], [12, -548]]} eyes={0} halo={0.7} smile={0.25} />
      </>
    }
    html={<Caption parts={[p("और ख़ुद "), p("वन में तप", true), p(" करने चली गईं।")]} />}
  />
);

// 09 "सच खुला, जब छाया ने संज्ञा के बेटे यम को श्राप दिया।"
const P09: React.FC = () => (
  <Stage
    svg={
      <>
        <PalaceSet f={T} blaze={0.15} dusk wheel={{ x: 300, y: 600, w: 480 }} />
        <rect width={W} height={H} fill={S.chhaya} opacity={0.12} />
        <Chhaya id="p9Chhaya" f={T} x={320} y={1452} s={0.82} hands={[[-58, -440], [200, -610]]} openR eyes={1} lookX={0.9} smile={-0.6} />
        <CurseSmoke x0={492} y0={950} x1={765} y1={1118} f={T} k={1} />
        <Puppet id="p9Yama" who={YAMA} at={{ x: 790, y: 1290, s: 0.62, facing: -1 }} p={pose({ lean: -10, sF: 95, eF: 60, wF: 20, brow: 0.8, browTilt: -12, lookX: 0.6, smile: -0.5 })} t={T} />
      </>
    }
    html={
      <>
        <NameChip hi="यम" en="YAMA" tag="संज्ञा के पुत्र" y={520} icon="✦" />
        <Caption parts={[p("सच खुला, जब छाया ने संज्ञा के बेटे यम को "), p("श्राप", true), p(" दिया।")]} />
      </>
    }
  />
);

// 10 "कोई माँ अपने बेटे को श्राप नहीं देती।" Surya, close: the realisation.
const P10: React.FC = () => (
  <Stage
    svg={
      <>
        <PalaceSet f={T} blaze={0.5} wheel={{ x: -120, y: 520, w: 900 }} />
        <rect width={W} height={H} fill="#FFF8EE" opacity={0.25} />
        <Puppet id="p10Surya" who="surya" at={{ x: 470, y: 1560, s: 2.3, facing: 1 }} p={pose({ head: 6, brow: 0.6, browTilt: 10, lookX: 0.9, smile: -0.3, glow: 0.35, sF: 4, eF: 8 })} t={T} />
      </>
    }
    html={<Caption parts={[p("कोई माँ अपने बेटे को "), p("श्राप नहीं देती", true), p("।")]} />}
  />
);

// 11 "सूर्य ससुर विश्वकर्मा के पास गए… और अपना तेज कम करवाया।"
const P11: React.FC = () => (
  <Stage
    svg={
      <>
        <WorkshopSet f={T} />
        <TejShards x={620} y={860} f={T} />
        <Puppet id="p11Surya" who="surya" at={{ x: 640, y: 1130, s: 1.05, facing: -1 }} p={pose({ lean: 4, head: 4, sF: 10, eF: 20, lookX: 0.6, smile: 0.1, glow: 0.2 })} t={T} />
        <Puppet id="p11Vishva" who={VISHVA} at={{ x: 250, y: 1130, s: 1.08, facing: 1 }} p={pose({ sF: 80, eF: 40, wF: -10, fist: 1, lookX: 0.8, smile: 0.2 })} t={T} />
      </>
    }
    html={
      <>
        <NameChip hi="विश्वकर्मा" en="VISHVAKARMA" tag="देव-शिल्पी · संज्ञा के पिता" y={520} icon="⚒" />
        <Caption parts={[p("सूर्य ससुर "), p("विश्वकर्मा", true), p(" के पास गए… और अपना तेज कम करवाया।")]} />
      </>
    }
  />
);

// 12 "जिस तेज के आगे संसार झुकता है… उसे प्रेम के लिए कम होने दिया।" The reunion in the forest.
const P12: React.FC = () => (
  <Stage
    svg={
      <>
        <ForestSet f={T} sun={0.7} />
        <SunRays x={320} y={760} r={70} k={0.4} f={T} n={20} />
        <Puppet id="p12Surya" who="surya" at={{ x: 330, y: 1190, s: 1.1, facing: 1 }} p={pose({ sF: 40, eF: 30, wF: -20, lookX: 0.8, smile: 0.6 })} t={T} />
        <SanjnaStanding id="p12Sanjna" f={T} x={770} y={1470} s={0.78} hands={[[-150, -500], [58, -440]]} openR={false} lookX={-0.7} smile={0.7} />
      </>
    }
    html={<Caption parts={[p("जिस तेज के आगे संसार झुकता है… उसे "), p("प्रेम", true), p(" के लिए कम होने दिया।")]} />}
  />
);

// 13 "पर छाया का भी एक बेटा था… शनि।" The tease.
const P13: React.FC = () => (
  <Stage
    svg={
      <>
        <PalaceSet f={T} blaze={0.08} dusk wheel={{ x: 300, y: 600, w: 480 }} />
        <rect width={W} height={H} fill={S.shani} opacity={0.32} />
        <Chhaya id="p13Chhaya" f={T} x={360} y={1452} s={0.82} hands={[[-58, -440], [150, -470]]} lookX={0.6} smile={0.2} />
        <Puppet id="p13Shani" who={SHANI} at={{ x: 720, y: 1290, s: 0.64, facing: -1 }} p={pose({ lookX: -0.2, smile: 0, glow: 0.7, brow: 0.2 })} t={T} />
      </>
    }
    html={
      <>
        <Pill text="अगला एपिसोड: शनि ▸" y={540} center dark size={40} />
        <Caption parts={[p("पर छाया का भी एक बेटा था… "), p("शनि", true), p("।")]} />
      </>
    }
  />
);

// 14 FEATURE: "आपकी कुंडली में सूर्य कहाँ हैं? ज्योतिक़ डाउनलोड कीजिए, और फ़्री में देखिए।"
const P14: React.FC = () => (
  <Stage
    svg={
      <>
        <rect width={W} height={H} fill="url(#nvSkyPalace)" />
        <circle cx={540} cy={1050} r={600} fill="url(#nvWarm)" />
        <SvgImage file="jyotiq/site/app5.png" x={30} y={820} width={640} height={640 * (1024 / 1536)} />
        <SunRays x={318} y={1066} r={26} k={1} f={T} n={16} />
        <SvgImage file="jyotiq/site/s1.png" x={560} y={760} width={480} height={480 * (1360 / 1157)} />
      </>
    }
    html={
      <>
        <div style={{ position: "absolute", left: 60, right: 60, top: 530, display: "flex", justifyContent: "center" }}>
          <TwoTone parts={[p("आपकी कुंडली में "), p("सूर्य कहाँ हैं?", true)]} size={74} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center" }}>
          <div style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 36, color: S.brownMid }}>सवाल पूछने की भी ज़रूरत नहीं</div>
        </div>
        <Pill text="फ़्री कुंडली · ज्योतिक़ ऐप" y={1360} center size={44} />
        <Caption parts={[p("ज्योतिक़ डाउनलोड कीजिए", true), p(", और फ़्री में देखिए।")]} />
      </>
    }
  />
);

// 15 END CARD, in the site look: logo, download line, free features, store buttons, bio link, comment prompt.
const Chip: React.FC<{ t: string }> = ({ t }) => (
  <div style={{ padding: "10px 24px", borderRadius: 30, background: "#FFFFFF", border: `2.5px solid ${S.goldLight}`, fontFamily: MUKTA, fontWeight: 700, fontSize: 34, color: S.brown, boxShadow: "0 6px 14px rgba(58,31,18,0.12)" }}>
    {t}
  </div>
);
const P15: React.FC = () => (
  <Stage
    svg={
      <>
        <rect width={W} height={H} fill="url(#nvSkyPalace)" />
        <circle cx={540} cy={760} r={480} fill="url(#nvWarm)" />
        <SvgImage file="jyotiq/site/hero-left-image.png" x={-130} y={1500} width={470} height={470 * (1216 / 1294)} opacity={0.7} />
        <SvgImage file="jyotiq/site/hero-right-image.png" x={760} y={1520} width={400} height={400 * (1293 / 1216)} opacity={0.7} />
      </>
    }
    html={
      <div style={{ position: "absolute", left: 0, right: 0, top: 500, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div
          style={{
            width: 310,
            height: 310,
            borderRadius: 155,
            background: "radial-gradient(circle at 50% 40%, #2A1830 0%, #120C16 75%)",
            border: `4px solid ${S.gold}`,
            boxShadow: "0 16px 40px rgba(58,31,18,0.35), 0 0 40px rgba(255,214,140,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img src={staticFile("jyotiq/logo-full.png")} style={{ width: 210, height: 242, objectFit: "contain" }} />
        </div>
        <TwoTone parts={[p("ज्योतिक़ "), p("डाउनलोड कीजिए", true)]} size={80} />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, maxWidth: 940 }}>
          {["फ़्री कुंडली", "दशा", "गोचर", "पंचांग", "होरा"].map((t) => (
            <Chip key={t} t={t} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 18, transform: "scale(0.9)", marginTop: -6, marginBottom: -6 }}>
          <PlayButton glow={0.4} />
          <AppStoreButton glow={0.4} />
        </div>
        <div style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: 44, ...gradText }}>ऐप का लिंक बायो में ↑ · www.jyotiq.ai</div>
        <div style={{ padding: "14px 32px", borderRadius: 28, background: GRAD, color: "#FFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 40 }}>कमेंट करें: आपका सूर्य किस राशि में है?</div>
        <div style={{ padding: "12px 30px", borderRadius: 40, background: S.brown, color: S.goldLight, border: `2px solid ${S.gold}`, fontFamily: MUKTA, fontWeight: 800, fontSize: 40 }}>
          अगला एपिसोड: शनि ▸
        </div>
        <div style={{ fontFamily: JAKARTA, fontWeight: 600, fontSize: 24, color: S.brownMid, opacity: 0.85 }}>Guidance only, for entertainment and information.</div>
      </div>
    }
  />
);

// 16 LAYOUT GUIDE: panel 04 with the fixed zones drawn on.
const P16: React.FC = () => <P04 guides />;

export const PANELS: React.FC[] = [O1, O2, O3, P01, P02, P03, P04, P05, P06, P07, P08, P09, P10, P11, P12, P13, P14, P15, P16];

export const NavagrahaEp1Board: React.FC = () => {
  const f = useCurrentFrame();
  const Panel = PANELS[Math.max(0, Math.min(PANELS.length - 1, f))];
  return <Panel />;
};
