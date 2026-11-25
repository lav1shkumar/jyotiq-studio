import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadMono } from "@remotion/google-fonts/SpaceMono";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";

/* Jyotiq Diwali 2026 post: "The Moon took the night off, so your diya could shine."
   Diwali falls on Amavasya (8 Nov 2026): the one night the sky has no Moon, so every light is one we lit.
   An empty dotted Moon with a pinned "Out of office" note from Chandra. Art: diwali-moon-post/public/img/bg.jpg (9:16).
   Two formats from one layout: post 1080x1350 (feed, 4:5) and story 1080x1920.
   Render with --public-dir=../diwali-moon-post/public. */

const OSW = loadOswald("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily;
const PLAY = loadPlayfair("italic", { weights: ["700"], subsets: ["latin"] }).fontFamily;
const MONO = loadMono("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily;
const SANS = loadJakarta("normal", { weights: ["500", "700", "800"], subsets: ["latin"] }).fontFamily;
const HAND = loadCaveat("normal", { weights: ["600", "700"], subsets: ["latin"] }).fontFamily;

const GOLD = "#F3C969";
const CREAM = "#FFF4DE";
const PAPER = "#F6EBD6";
const INK = "#231A12";
const RED = "#D7362B";

type Fmt = "post" | "story";
const L = {
  post: { h: 1350, bgY: -250, label: 46, head: 92, moon: [860, 500], moonR: 90, note: [600, 610], sub: 470, brand: 1140 },
  story: { h: 1920, bgY: 0, label: 150, head: 210, moon: [850, 640], moonR: 105, note: [590, 770], sub: 600, brand: 1470 },
};

const EmptyMoon: React.FC<{ cx: number; cy: number; r: number }> = ({ cx, cy, r }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <circle cx={cx} cy={cy} r={r + 26} fill="rgba(243,201,105,0.06)" />
    <circle cx={cx} cy={cy} r={r} fill="rgba(255,244,222,0.04)" stroke="rgba(255,244,222,0.75)" strokeWidth={4} strokeDasharray="3 15" strokeLinecap="round" />
  </svg>
);

const OOO: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 330, transform: "rotate(-5deg)" }}>
    <div style={{ position: "absolute", left: 120, top: -16, width: 96, height: 32, background: "rgba(233,214,170,0.9)", transform: "rotate(4deg)", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
    <div style={{ background: PAPER, color: INK, padding: "20px 24px 16px", boxShadow: "0 10px 24px rgba(0,0,0,0.5)", backgroundImage: "repeating-linear-gradient(0deg, rgba(120,90,50,0.05) 0 2px, rgba(0,0,0,0) 2px 30px)" }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 21, letterSpacing: 2, color: RED }}>OUT OF OFFICE</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, lineHeight: 1.05, marginTop: 6 }}>Taking Amavasya off so the diyas get the stage. Back on Pratipada.</div>
      <div style={{ fontFamily: HAND, fontWeight: 600, fontSize: 34, textAlign: "right", marginTop: 4 }}>— Chandra 🌙</div>
    </div>
  </div>
);

export const MoonPost: React.FC<{ fmt: Fmt }> = ({ fmt }) => {
  const l = L[fmt];
  return (
    <AbsoluteFill style={{ background: "#151033", overflow: "hidden" }}>
      <Img src={staticFile("img/bg.jpg")} style={{ position: "absolute", left: 0, top: l.bgY, width: 1080, height: 1920, objectFit: "cover" }} />
      {/* soft dark at the top for the type */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: l.sub + 120, background: "linear-gradient(180deg, rgba(10,8,30,0.55), rgba(10,8,30,0))" }} />

      {/* Jyotiq tag */}
      <div style={{ position: "absolute", right: 40, top: l.label - 12, display: "flex", alignItems: "center", gap: 10, background: "rgba(12,10,7,0.85)", border: `2px solid ${GOLD}`, borderRadius: 40, padding: "8px 20px 8px 10px" }}>
        <Img src={staticFile("brand/logo-icon.png")} style={{ height: 40 }} />
        <span style={{ fontFamily: OSW, fontWeight: 700, fontSize: 26, letterSpacing: 3, color: GOLD }}>JYOTIQ</span>
      </div>
      <div style={{ position: "absolute", left: 50, top: l.label, fontFamily: MONO, fontSize: 21, letterSpacing: 2, color: "rgba(255,244,222,0.85)" }}>8 NOV 2026 · DIWALI · AMAVASYA</div>

      <div style={{ position: "absolute", left: 46, top: l.head, width: 990 }}>
        <div style={{ fontFamily: PLAY, fontStyle: "italic", fontWeight: 700, fontSize: 132, lineHeight: 1, color: GOLD, textShadow: "0 0 40px rgba(243,201,105,0.45), 0 4px 0 rgba(0,0,0,0.35)" }}>Happy Diwali</div>
        <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 64, lineHeight: 1.06, color: CREAM, textTransform: "uppercase", marginTop: 18, textShadow: "0 3px 0 rgba(0,0,0,0.35)" }}>
          The Moon took the night off,<br /><span style={{ color: GOLD }}>so your diya could shine.</span>
        </div>
      </div>

      <div style={{ position: "absolute", left: 50, top: l.sub, width: 440, fontFamily: SANS, fontWeight: 500, fontSize: 28, lineHeight: 1.4, color: "rgba(255,244,222,0.92)", textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}>
        Diwali falls on <b style={{ fontWeight: 800, color: CREAM }}>Amavasya</b>, the one night the sky lights no lamp. Every light you see tonight, <b style={{ fontWeight: 800, color: GOLD }}>we lit ourselves.</b>
      </div>

      <EmptyMoon cx={l.moon[0]} cy={l.moon[1]} r={l.moonR} />
      <OOO x={l.note[0]} y={l.note[1]} />

      {/* brand line */}
      <div style={{ position: "absolute", left: 520, top: l.brand, width: 520, background: "rgba(12,10,7,0.9)", border: `2px solid ${GOLD}`, borderRadius: 22, padding: "16px 22px", color: CREAM, boxShadow: "0 12px 30px rgba(0,0,0,0.5)" }}>
        <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 28, whiteSpace: "nowrap" }}>May your chart shine as bright ✨</div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, marginTop: 6, color: GOLD }}>Ask Jyotiq · first question free</div>
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 20, marginTop: 4, color: "rgba(255,244,222,0.8)" }}>www.jyotiq.ai · link in bio</div>
      </div>
    </AbsoluteFill>
  );
};

export const MoonPostFeed: React.FC = () => <MoonPost fmt="post" />;
export const MoonPostStory: React.FC = () => <MoonPost fmt="story" />;
