/**
 * भारत · विशेष — "जब मेरे बाणों की वर्षा होगी" · HOOK VISUAL TEST (no audio yet).
 * 0–120   S1 Arjuna close-up, Gandiva drawn skyward: "राजकुमार, लगाम थामिए… / जब मेरे बाणों की वर्षा होगी…" → release + flash
 * 120–210 S2 arrow storm crosses the sun, the sky darkens: "…तब देखिएगा।"
 * 210–300 S3 wide: one chariot against the whole Kaurava army: "महल की नृत्य-गुरु बृहन्नला… अकेले पूरी कौरव सेना से?"
 * 300–360 S4 title over the wide
 */
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadTiro } from "@remotion/google-fonts/TiroDevanagariHindi";
import { ArjunaCloseUp, ArjunaDefs } from "./arjuna";
import { ArrowStorm, Army, H, HeroChariotFar, P, Plain, Sky, W, WorldDefs, ease, inv, lerp } from "./world";

const { fontFamily: TIRO } = loadTiro();

export const SPECIAL_HOOK_FRAMES = 360;

const Caption: React.FC<{ f: number; a: number; b: number; text: string; tag?: string; y?: number; size?: number }> = ({ f, a, b, text, tag, y = 1250, size = 60 }) => {
  if (f < a - 2 || f > b + 6) return null;
  const o = Math.min(inv(f, a - 2, a + 6), 1 - inv(f, b - 2, b + 6));
  const rise = (1 - ease(inv(f, a - 2, a + 10))) * 14;
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: y + rise, textAlign: "center", opacity: o }}>
      <div
        style={{
          fontFamily: TIRO,
          fontSize: size,
          lineHeight: 1.32,
          color: "#fff8ec",
          textShadow: "0 2px 18px rgba(40,18,6,0.85), 0 0 4px rgba(40,18,6,0.6)",
          whiteSpace: "pre-line",
        }}
      >
        {text}
      </div>
      {tag ? (
        <div style={{ display: "inline-block", marginTop: 26, padding: "6px 18px", background: "rgba(36,20,10,0.55)", border: "1px solid rgba(255,222,170,0.35)", borderRadius: 4, fontFamily: TIRO, fontSize: 28, letterSpacing: 3, color: "#f6dfb6" }}>
          {tag}
        </div>
      ) : null}
    </div>
  );
};

const BrandBug: React.FC = () => (
  <div style={{ position: "absolute", left: 44, top: 70, display: "flex", alignItems: "center", gap: 14, padding: "8px 20px 8px 8px", borderRadius: 44, background: "rgba(30,16,8,0.45)", border: "1px solid rgba(255,220,160,0.35)" }}>
    <Img src={staticFile("jyotiq/logo-zodiac.png")} style={{ width: 62, height: 62, borderRadius: 31 }} />
    <div style={{ fontFamily: TIRO, fontSize: 34, color: "#fff2da" }}>Jyotiq</div>
  </div>
);

const Flash: React.FC<{ f: number; at: number; len?: number; color?: string }> = ({ f, at, len = 10, color = "#fff6e0" }) => {
  const o = f >= at && f < at + len ? 1 - (f - at) / len : 0;
  return o > 0 ? <AbsoluteFill style={{ background: color, opacity: o }} /> : null;
};

// ---------- S1: close-up ----------
const ShotCloseUp: React.FC<{ f: number }> = ({ f }) => {
  const draw = lerp(0.82, 1, ease(inv(f, 0, 96)));
  const released = f >= 108 ? inv(f, 108, 124) : 0;
  const push = 1 + 0.0016 * f + (f > 60 ? 0.003 * (f - 60) : 0);
  const kick = f >= 108 && f < 116 ? (f % 2 ? 1 : -1) * (116 - f) * 2.4 : 0;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <WorldDefs />
      <ArjunaDefs />
      <g transform={`translate(${W / 2 + kick},${H * 0.55}) scale(${push}) translate(${-W / 2},${-H * 0.55})`}>
        <Sky sunX={880} sunY={600} f={f + 200} />
        {/* far battlefield below, out of focus */}
        <g filter="url(#sp-blur10)">
          <Plain horizon={1500} f={f} sunX={880} />
          <Army horizon={1500} front={1640} x0={500} x1={1200} f={f} rows={9} sFront={1.1} seed={9} />
        </g>
        {/* ape banner behind, soft */}
        <g filter="url(#sp-blur4)" opacity={0.95}>
          <line x1={150} y1={1920} x2={150} y2={260} stroke={P.goldDark} strokeWidth={14} />
          <path d={`M156,280 C230,${270 + Math.sin(f / 5) * 12} 300,${300 + Math.sin(f / 6) * 14} 380,${290 + Math.sin(f / 5 + 1) * 12} L372,${430 + Math.sin(f / 6) * 12} C300,${440 + Math.sin(f / 5) * 10} 230,${420} 156,430 Z`} fill="url(#sp-gold)" />
        </g>
        <g transform="translate(-300,-430) scale(1.36)">
          <ArjunaCloseUp f={f} draw={draw} released={released} />
        </g>
        {/* arrow leaving */}
        {released > 0 && (
          <g opacity={1 - released}>
            <line x1={700} y1={760} x2={1100} y2={640} stroke="#fff3c8" strokeWidth={10} opacity={0.6} filter="url(#sp-blur4)" />
          </g>
        )}
      </g>
      {/* warm vignette */}
      <rect width={W} height={H} fill="url(#sp-vig)" />
      <defs>
        <radialGradient id="sp-vig" cx="0.5" cy="0.45" r="0.75">
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#1a0a04" stopOpacity="0.55" />
        </radialGradient>
      </defs>
    </svg>
  );
};

// ---------- S2: arrow storm across the sun ----------
const ShotStorm: React.FC<{ f: number }> = ({ f }) => {
  const dim = 0.75 * ease(inv(f, 10, 70));
  const push = 1.06 + 0.0012 * f;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <WorldDefs />
      <g transform={`translate(${W / 2},${H * 0.6}) scale(${push}) translate(${-W / 2},${-H * 0.6})`}>
        <Sky sunX={560} sunY={1020} f={f + 400} dim={dim} rays={1 - dim} />
        <Plain horizon={1300} f={f} sunX={560} dim={dim * 0.8} />
        <Army horizon={1300} front={1520} x0={-120} x1={1200} f={f} rows={14} sFront={1.7} seed={4} bhishma />
        <ArrowStorm f={f} n={1300} from={[-260, 1700]} to={[700, 1420]} spread={900} apex={1250} dur={46} launch={60} scale={1.15} seed={11} />
        <ArrowStorm f={f - 6} n={500} from={[-200, 1900]} to={[900, 1500]} spread={700} apex={900} dur={34} launch={50} scale={1.8} seed={12} />
      </g>
    </svg>
  );
};

// ---------- S3: lone chariot vs the army ----------
const ShotWide: React.FC<{ f: number; dimTitle?: number }> = ({ f, dimTitle = 0 }) => {
  const glide = ease(inv(f, 0, 150));
  const camX = lerp(40, -30, glide);
  const scale = lerp(1.12, 1.0, glide);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <WorldDefs />
      <g transform={`translate(${W / 2 + camX},${H * 0.62}) scale(${scale}) translate(${-W / 2},${-H * 0.62})`}>
        <Sky sunX={560} sunY={800} f={f + 600} />
        <circle cx={560} cy={800} r={150} fill="#fff6dc" opacity={0.55} filter="url(#sp-blur24)" />
        <Plain horizon={880} f={f} sunX={560} />
        <Army horizon={880} front={1120} x0={-160} x1={1240} f={f} rows={18} sFront={1.6} seed={3} bhishma />
        {/* haze band over the far rows */}
        <rect x={-200} y={820} width={W + 400} height={140} fill={P.haze} opacity={0.35} filter="url(#sp-blur24)" />
        <HeroChariotFar x={540} y={1640} s={1.35} f={f} />
      </g>
      <rect width={W} height={H} fill="#140804" opacity={dimTitle * 0.5} />
    </svg>
  );
};

export const BharataSpecialHook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#1a0e08" }}>
      {f < 120 && <ShotCloseUp f={f} />}
      {f >= 120 && f < 210 && <ShotStorm f={f - 120} />}
      {f >= 210 && <ShotWide f={f - 210} dimTitle={inv(f, 300, 320)} />}
      <Flash f={f} at={108} len={8} />
      <Flash f={f} at={210} len={6} color="#fff2d0" />

      <Caption f={f} a={4} b={44} text="राजकुमार, लगाम थामिए…" />
      <Caption f={f} a={48} b={116} text={"जब मेरे बाणों की वर्षा होगी…"} size={68} />
      <Caption f={f} a={132} b={205} text="…तब देखिएगा।" size={72} />
      <Caption f={f} a={216} b={298} text={"महल की नृत्य-गुरु बृहन्नला…\nअकेले पूरी कौरव सेना से?"} tag="महाभारत · विराट पर्व" />

      {f >= 300 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", opacity: ease(inv(f, 302, 322)), transform: `scale(${lerp(1.08, 1, ease(inv(f, 302, 340)))})` }}>
          <div style={{ fontFamily: TIRO, fontSize: 40, letterSpacing: 10, color: "#f3d39a" }}>भारत · विशेष</div>
          <div style={{ width: 220, height: 2, background: "linear-gradient(90deg,transparent,#f3c24f,transparent)", margin: "22px auto" }} />
          <div style={{ fontFamily: TIRO, fontSize: 84, lineHeight: 1.25, color: "#fff4dc", textShadow: "0 4px 30px rgba(60,20,0,0.9)", whiteSpace: "pre-line" }}>{"जब मेरे बाणों की\nवर्षा होगी"}</div>
        </div>
      )}
      <BrandBug />
    </AbsoluteFill>
  );
};

