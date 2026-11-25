import React from "react";
import { Img, staticFile } from "remotion";
import { loadFont as loadMukta } from "@remotion/google-fonts/Mukta";
import { JAKARTA, PLAYFAIR, ROZHA } from "../../manthan/graphics";

/*
 * नवग्रह जन्म: the new Jyotiq reel look, taken from the jyotiq.ai home page (12 Nov 2026):
 * a warm cream page, saffron-to-red headline gradient, gold, lavender clouds, lotus pink and leaf green.
 * Site art lives in public/jyotiq/site (logo-navbar, hero-left/right, s1 phone, app5 kundli, app3 report, fire).
 *
 * Fixed chrome on every frame of every reel (Ayush + founder, 12 Nov 2026):
 *  - top-left: the Jyotiq brand bug (new logo + wordmark);
 *  - top-right: the APP PANEL, a fixed rectangle showing the app download. Same size, place and look all reel.
 * Characters and key art stay out of both (see KEEP_OUT), out of the caption band and the bottom 250 px.
 */

export const MUKTA = loadMukta("normal", { weights: ["500", "700", "800"], subsets: ["devanagari", "latin"] }).fontFamily;
export { JAKARTA, PLAYFAIR, ROZHA };

export const S = {
  cream: "#FFF8EE",
  cream2: "#FDEFD9",
  peach: "#FBE2C4",
  sand: "#F3D3A6",
  saffron: "#F28C28",
  orange: "#F5761A",
  red: "#E0482B",
  brown: "#3A1F12",
  brownMid: "#7A3E1D",
  gold: "#E8B04A",
  goldLight: "#FFE3A1",
  goldDeep: "#A8701E",
  lavender: "#D9CCEB",
  lavenderDeep: "#9C8CCB",
  lotus: "#F49AB4",
  lotusDeep: "#D9467A",
  leaf: "#6E9B3A",
  leafDark: "#3F6B22",
  chhaya: "#4A3A78",
  shani: "#2E3A66",
};

/** The site's headline gradient (saffron -> red), for accent words. */
export const GRAD = `linear-gradient(90deg, ${S.saffron} 0%, ${S.orange} 45%, ${S.red} 100%)`;
export const gradText: React.CSSProperties = {
  background: GRAD,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

/* ------------------------------------------------------------------ */
/* Layout zones (1080 x 1920)                                          */
/* ------------------------------------------------------------------ */

export const BRAND = { x: 36, y: 150, w: 300, h: 104 };
export const PANEL = { x: 800, y: 150, w: 246, h: 318 };
/** Caption chip sits in this band; its bottom edge never passes CAP_BOTTOM. */
export const CAP_TOP = 1462;
export const CAP_BOTTOM = 1650;
/** Characters / key art keep out of these (x, y, w, h). */
export const KEEP_OUT = [
  { ...BRAND, label: "Brand" },
  { x: PANEL.x - 24, y: PANEL.y - 24, w: PANEL.w + 48, h: PANEL.h + 48, label: "App panel" },
  { x: 0, y: 1670, w: 1080, h: 250, label: "IG bottom UI" },
];

/* ------------------------------------------------------------------ */
/* Fixed chrome                                                        */
/* ------------------------------------------------------------------ */

/** Top-left: new site logo + "Jyotiq / by AstroRaaga", on a soft cream pill so it reads on any scene. */
/**
 * The Manthan series logo (Ayush, 12 Nov 2026: keep the logo used in every Manthan episode): the brain-diya
 * icon (logo-icon.png) + "Jyotiq" in Playfair gold, exactly as manthan/graphics BrandBug, set on a dark warm
 * glass pill so the gold still reads over the cream site-look scenes. The opener's logo lands on BUG_ICON.
 */
const ICON_H = 84;
export const BUG_ICON = { l: BRAND.x + 20, t: BRAND.y + (BRAND.h - ICON_H) / 2, w: ICON_H * (444 / 366), h: ICON_H };
export const BrandBug2: React.FC<{ o?: number }> = ({ o = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: BRAND.x,
      top: BRAND.y,
      height: BRAND.h,
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "0 30px 0 20px",
      borderRadius: 60,
      background: "radial-gradient(120% 140% at 20% 50%, rgba(36,22,40,0.94) 0%, rgba(14,10,18,0.92) 100%)",
      border: "2px solid rgba(223,177,91,0.75)",
      boxShadow: "0 8px 22px rgba(58,31,18,0.25)",
      opacity: o,
    }}
  >
    <Img src={staticFile("jyotiq/logo-icon.png")} style={{ width: BUG_ICON.w, height: BUG_ICON.h, objectFit: "contain" }} />
    <div style={{ fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 42, color: "#F3DB9D", letterSpacing: 2 }}>Jyotiq</div>
  </div>
);

const PlayGlyph: React.FC<{ s?: number }> = ({ s = 22 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24">
    <path d="M4 2.5L14.5 12L4 21.5Z" fill="#34A853" />
    <path d="M4 2.5L17.8 9.9L14.5 12Z" fill="#4285F4" />
    <path d="M4 21.5L17.8 14.1L14.5 12Z" fill="#EA4335" />
    <path d="M17.8 9.9L21 12L17.8 14.1L14.5 12Z" fill="#FBBC04" />
  </svg>
);
const PhoneGlyph: React.FC<{ s?: number }> = ({ s = 22 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24">
    <rect x={6} y={2} width={12} height={20} rx={3} fill={S.brown} />
    <rect x={7.6} y={4.2} width={8.8} height={14} rx={1.2} fill={S.cream} />
    <circle cx={12} cy={20} r={0.9} fill={S.cream} />
  </svg>
);

/**
 * Top-right APP PANEL: the fixed rectangle (Ayush's white box). The site's phone art (s1: "Ask a Question",
 * on a gold pedestal with a lotus) and a download line. Identical on every frame; only a slow shimmer moves.
 */
export const AppPanel: React.FC<{ f: number; o?: number }> = ({ f, o = 1 }) => {
  const sh = ((f % 150) / 150) * 1.6 - 0.3; // shimmer sweep, once every 5 s
  return (
    <div
      style={{
        position: "absolute",
        left: PANEL.x,
        top: PANEL.y,
        width: PANEL.w,
        height: PANEL.h,
        borderRadius: 30,
        background: `linear-gradient(180deg, ${S.cream} 0%, ${S.cream2} 100%)`,
        border: `3px solid ${S.gold}`,
        boxShadow: "0 12px 30px rgba(122,62,29,0.28), inset 0 0 0 2px rgba(255,255,255,0.7)",
        overflow: "hidden",
        opacity: o,
      }}
    >
      <Img src={staticFile("jyotiq/site/s1.png")} style={{ position: "absolute", left: 8, top: 6, width: 230, height: 230 * (1360 / 1157) * 0.86, objectFit: "contain", objectPosition: "center top" }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 78,
          background: GRAD,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
        }}
      >
        <div style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: 27, color: "#FFFFFF", lineHeight: 1 }}>ऐप डाउनलोड करें</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: JAKARTA, fontWeight: 700, fontSize: 15, color: "#FFF4E2" }}>
          <PlayGlyph s={17} /> Google Play <span style={{ opacity: 0.7 }}>·</span> <PhoneGlyph s={17} /> App Store
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(115deg, transparent ${sh * 100 - 12}%, rgba(255,255,255,0.45) ${sh * 100}%, transparent ${sh * 100 + 12}%)`,
        }}
      />
    </div>
  );
};

export const Chrome: React.FC<{ f: number; brand?: number; panel?: number }> = ({ f, brand = 1, panel = 1 }) => (
  <>
    <BrandBug2 o={brand} />
    <AppPanel f={f} o={panel} />
  </>
);

/* ------------------------------------------------------------------ */
/* Text                                                                */
/* ------------------------------------------------------------------ */

/** "JYOTIQ PRESENTS" lockup, top centre between the brand bug and the app panel. */
export const Presents: React.FC<{ y?: number; o?: number }> = ({ y = 300, o = 1 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", opacity: o }}>
    <div
      style={{
        padding: "10px 30px",
        borderRadius: 40,
        background: "rgba(255,248,238,0.92)",
        border: `2px solid ${S.gold}`,
        boxShadow: "0 8px 20px rgba(122,62,29,0.18)",
        textAlign: "center",
      }}
    >
      <div style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 22, letterSpacing: 6, color: S.brownMid }}>JYOTIQ PRESENTS</div>
      <div style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 30, lineHeight: 1.15, ...gradText }}>ज्योतिक़ प्रस्तुत करता है</div>
    </div>
  </div>
);

/** One line of hook/title text: dark words + gradient accent words (the site hero's two-tone headline). */
export type Part = { t: string; hi?: boolean };
export const TwoTone: React.FC<{ parts: Part[]; size: number; weight?: number; font?: string; align?: "center" | "left" }> = ({
  parts,
  size,
  weight = 800,
  font = MUKTA,
  align = "center",
}) => (
  <div style={{ fontFamily: font, fontWeight: weight, fontSize: size, lineHeight: 1.18, textAlign: align, color: S.brown, letterSpacing: -0.5 }}>
    {parts.map((p, i) => (
      <span key={i} style={p.hi ? gradText : undefined}>
        {p.t}
      </span>
    ))}
  </div>
);

/** The hook plate: middle third, cream glass card, complete from frame 0. */
export const HookPlate: React.FC<{ lines: Part[][]; y?: number; size?: number; chip?: string }> = ({ lines, y = 760, size = 74, chip }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top: y, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
    <div
      style={{
        padding: "26px 34px 30px",
        borderRadius: 36,
        background: "rgba(255,248,238,0.9)",
        border: `3px solid ${S.goldLight}`,
        boxShadow: "0 18px 40px rgba(58,31,18,0.25)",
      }}
    >
      {lines.map((l, i) => (
        <TwoTone key={i} parts={l} size={size} />
      ))}
    </div>
    {chip ? (
      <div style={{ padding: "12px 30px", borderRadius: 40, background: GRAD, color: "#FFFFFF", fontFamily: MUKTA, fontWeight: 800, fontSize: 40, boxShadow: "0 10px 24px rgba(224,72,43,0.35)" }}>
        {chip}
      </div>
    ) : null}
  </div>
);

/** Bottom caption, in the site's "Popular Questions" chip style. `hi` words take the gradient. */
export const Caption: React.FC<{ parts: Part[]; bottom?: number }> = ({ parts, bottom = CAP_BOTTOM }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: CAP_TOP, height: bottom - CAP_TOP, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
    <div
      style={{
        maxWidth: 820,
        padding: "16px 30px 20px",
        borderRadius: 30,
        background: "rgba(255,255,255,0.94)",
        border: `2.5px solid ${S.goldLight}`,
        boxShadow: "0 10px 26px rgba(58,31,18,0.22)",
        textAlign: "center",
        fontFamily: MUKTA,
        fontWeight: 700,
        fontSize: 48,
        lineHeight: 1.22,
        color: S.brown,
      }}
    >
      {parts.map((p, i) => (
        <span key={i} style={p.hi ? { ...gradText, fontWeight: 800 } : undefined}>
          {p.t}
        </span>
      ))}
    </div>
  </div>
);

/** Name card on first mention: "सूर्य · SURYA" with a one-line tag, in the site's category-chip style. */
export const NameChip: React.FC<{ hi: string; en: string; tag: string; x?: number; y: number; icon?: string }> = ({ hi, en, tag, x = 60, y, icon = "☀" }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "14px 30px 14px 16px",
      borderRadius: 26,
      background: "rgba(255,255,255,0.95)",
      border: `2.5px solid ${S.gold}`,
      boxShadow: "0 10px 26px rgba(58,31,18,0.22)",
    }}
  >
    <div style={{ width: 62, height: 62, borderRadius: 31, background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontSize: 36 }}>{icon}</div>
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <span style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: 46, color: S.brown, lineHeight: 1.05 }}>{hi}</span>
        <span style={{ fontFamily: JAKARTA, fontWeight: 800, fontSize: 24, letterSpacing: 3, ...gradText }}>{en}</span>
      </div>
      <span style={{ fontFamily: MUKTA, fontWeight: 600, fontSize: 28, color: S.brownMid, lineHeight: 1.1 }}>{tag}</span>
    </div>
  </div>
);

/** A small pill (next-episode tease, feature tag). */
export const Pill: React.FC<{ text: string; x?: number; y: number; dark?: boolean; size?: number; center?: boolean }> = ({ text, x = 60, y, dark, size = 34, center }) => {
  const pill = (
    <div
      style={{
        padding: "12px 28px",
        borderRadius: 40,
        background: dark ? S.brown : GRAD,
        color: dark ? S.goldLight : "#FFFFFF",
        fontFamily: MUKTA,
        fontWeight: 800,
        fontSize: size,
        border: dark ? `2px solid ${S.gold}` : undefined,
        boxShadow: "0 10px 24px rgba(58,31,18,0.28)",
      }}
    >
      {text}
    </div>
  );
  return center ? (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center" }}>{pill}</div>
  ) : (
    <div style={{ position: "absolute", left: x, top: y }}>{pill}</div>
  );
};

/** Layout guide overlay: the keep-out zones, the caption band and Instagram's right rail. */
export const Guides: React.FC = () => {
  const box = (x: number, y: number, w: number, h: number, label: string, c: string) => (
    <div key={label} style={{ position: "absolute", left: x, top: y, width: w, height: h, border: `4px dashed ${c}`, background: `${c}22` }}>
      <div style={{ position: "absolute", left: 8, top: 6, fontFamily: JAKARTA, fontWeight: 800, fontSize: 22, color: c, background: "rgba(255,255,255,0.85)", padding: "2px 8px", borderRadius: 6 }}>{label}</div>
    </div>
  );
  return (
    <>
      {box(BRAND.x - 6, BRAND.y - 6, BRAND.w + 12, BRAND.h + 12, "BRAND (fixed)", "#C2185B")}
      {box(PANEL.x - 24, PANEL.y - 24, PANEL.w + 48, PANEL.h + 48, "APP PANEL (fixed)", "#C2185B")}
      {box(0, 0, 1080, 130, "IG top bar", "#455A64")}
      {box(960, 1050, 120, 620, "IG right rail", "#455A64")}
      {box(110, CAP_TOP, 860, CAP_BOTTOM - CAP_TOP, "CAPTION BAND", "#1565C0")}
      {box(0, 1670, 1080, 250, "IG bottom UI: nothing important", "#455A64")}
      {box(40, 520, 900, 930, "CHARACTER STAGE", "#2E7D32")}
    </>
  );
};
