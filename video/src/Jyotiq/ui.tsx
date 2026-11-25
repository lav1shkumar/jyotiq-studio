import React from "react";
import { Img, staticFile } from "remotion";
import { Caret } from "./motion";
import { SANS, SERIF, useTheme } from "./theme";

/* ------------------------------------------------------------------ */
/* Real Jyotiq data (strings read from the live app)                   */
/* ------------------------------------------------------------------ */

export type CatId = "general" | "love" | "health" | "wealth" | "career" | "travel" | "education" | "family";

export const CATEGORIES: { id: CatId; label: string; emoji: string; sub: string; title: string; q: string }[] = [
  { id: "general", label: "GENERAL", emoji: "✨", title: "General", sub: "Life purpose, daily guidance, and clarity", q: "What does my immediate future hold for me?" },
  // Love: a real suggested question from the app's Love tab (Ayush's screenshot, 2026-10-11).
  { id: "love", label: "LOVE", emoji: "💜", title: "Love", sub: "Relationships, partnerships, and marriage timing", q: "When am I likely to meet my true soulmate or life partner?" },
  { id: "health", label: "HEALTH", emoji: "🏥", title: "Health", sub: "Physical well-being, healing, and vitality", q: "How does the current Saturn transit affect my health?" },
  // Wealth: the app's own "Most asked questions" FAQ (faq5).
  { id: "wealth", label: "WEALTH", emoji: "💵", title: "Wealth", sub: "Financial prosperity, investments, and assets", q: "Are there any strong financial gains expected this year?" },
  { id: "career", label: "CAREER", emoji: "💼", title: "Career", sub: "Profession, business growth, and job search", q: "Which career path aligns with my Kundali's sun sign?" },
  { id: "travel", label: "TRAVEL", emoji: "✈️", title: "Travel", sub: "Journeys, relocation, and foreign lands", q: "Is this a good year to move abroad?" },
  { id: "education", label: "EDUCATION", emoji: "🎓", title: "Education", sub: "Academics, learning, and examinations", q: "Which exams should I focus on this year?" },
  { id: "family", label: "FAMILY", emoji: "👨‍👩‍👧", title: "Family", sub: "Domestic harmony, home life, and relatives", q: "How can I bring more harmony at home?" },
];
export const cat = (id: CatId) => CATEGORIES.find((c) => c.id === id)!;

export const GENERAL_CHIPS = [
  "What does my immediate future hold for me?",
  "What are my hidden strengths and how can I utilize them?",
  "How can I find peace of mind and overcome current stress?",
  "What is the overarching theme or focus of my life right now?",
];

/* ------------------------------------------------------------------ */
/* Brand marks                                                         */
/* ------------------------------------------------------------------ */

export const LogoIcon: React.FC<{ height: number; style?: React.CSSProperties }> = ({ height, style }) => (
  <Img src={staticFile("jyotiq/logo-icon.png")} style={{ height, width: (height * 444) / 366, ...style }} />
);

export const LogoWordmark: React.FC<{ height: number; style?: React.CSSProperties }> = ({ height, style }) => (
  <Img src={staticFile("jyotiq/logo-wordmark.png")} style={{ height, width: (height * 444) / 136, ...style }} />
);

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

export const GoldButton: React.FC<{
  label: React.ReactNode;
  width?: number | string;
  height?: number;
  fontSize?: number;
  radius?: number;
  style?: React.CSSProperties;
  glow?: number;
}> = ({ label, width, height = 56, fontSize = 18, radius = 14, style, glow = 1 }) => {
  const t = useTheme();
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background: `linear-gradient(90deg, ${t.ctaFrom}, ${t.ctaTo})`,
        color: t.onCta,
        fontFamily: SANS,
        fontWeight: 800,
        fontSize,
        letterSpacing: 1.2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        boxShadow: `0 10px 34px ${t.ctaTo}${Math.round(0x55 * glow).toString(16).padStart(2, "0")}`,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {label}
    </div>
  );
};

export const Panel: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; glow?: boolean }> = ({
  style,
  children,
  glow,
}) => {
  const t = useTheme();
  return (
    <div
      style={{
        background: t.surface,
        border: `1.5px solid ${t.border}`,
        borderRadius: 22,
        boxShadow: `0 30px 80px ${t.shadow}${glow ? `, 0 0 60px ${t.gold}22` : ""}`,
        fontFamily: SANS,
        color: t.text,
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Hairline gold top edge used on Jyotiq's modals. */
const TopGlowLine: React.FC = () => {
  const t = useTheme();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: 4,
        background: `linear-gradient(90deg, transparent, ${t.ctaFrom}, ${t.ctaTo}, transparent)`,
      }}
    />
  );
};

/* ------------------------------------------------------------------ */
/* Jyotiq app chrome                                                   */
/* ------------------------------------------------------------------ */

export const JyotiqNav: React.FC<{ active?: string; flames?: number; width: number }> = ({
  active = "Chat",
  flames = 1,
  width,
}) => {
  const t = useTheme();
  const pill: React.CSSProperties = {
    height: 40,
    padding: "0 16px",
    borderRadius: 12,
    border: `1.5px solid ${t.border}`,
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: t.gold,
    fontWeight: 700,
    fontSize: 17,
    background: t.surface2,
  };
  return (
    <div
      style={{
        width,
        height: 96,
        display: "flex",
        alignItems: "center",
        padding: "0 44px",
        borderBottom: `1.5px solid ${t.border}`,
        fontFamily: SANS,
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 120 }}>
        <LogoIcon height={46} />
        <LogoWordmark height={20} style={{ marginTop: -2 }} />
      </div>
      <div style={{ flex: 1, display: "flex", justifyContent: "center", gap: 46 }}>
        {["Home", "Kundali", "Plans", "Chat", "Profile"].map((l) => (
          <div
            key={l}
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: l === active ? t.gold : t.text,
              opacity: l === active ? 1 : 0.85,
              paddingBottom: 6,
              borderBottom: l === active ? `2.5px solid ${t.gold}` : "2.5px solid transparent",
            }}
          >
            {l}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={pill}>English ⌄</div>
        <div style={pill}>
          {flames} <span style={{ fontSize: 16 }}>🔥</span>
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              background: t.gold,
              color: t.onCta,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 17,
              fontWeight: 800,
            }}
          >
            +
          </span>
        </div>
        <div style={pill}>📍 Delhi</div>
        {/* Signed-in state (the viewer just signed in and got their Flame in B2):
            the live app swaps "Login/Signup" for this profile avatar. */}
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            border: `2px solid ${t.gold}`,
            background: t.surface2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxSizing: "border-box",
          }}
        >
          <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden>
            <circle cx={12} cy={8.5} r={4} fill={t.gold} />
            <path d="M4 20.5c0-4.2 3.6-6.8 8-6.8s8 2.6 8 6.8" fill={t.gold} />
          </svg>
        </div>
      </div>
    </div>
  );
};

export const CategoryTile: React.FC<{ id: CatId; selected?: boolean; w?: number; h?: number; glow?: number }> = ({
  id,
  selected,
  w = 136,
  h = 70,
  glow = 0,
}) => {
  const t = useTheme();
  const c = cat(id);
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 14,
        background: t.surface2,
        border: `1.8px solid ${selected ? t.gold : t.border}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 14,
        letterSpacing: 0.6,
        color: selected ? t.gold : t.text,
        boxShadow: glow > 0 ? `0 0 ${30 * glow}px ${t.gold}66` : undefined,
        flexShrink: 0,
      }}
    >
      <span style={{ fontSize: 20 }}>{c.emoji}</span>
      {c.label}
    </div>
  );
};

export const CategoryRow: React.FC<{ selected: CatId; tileW?: number; glowId?: CatId; glow?: number }> = ({
  selected,
  tileW = 136,
  glowId,
  glow = 0,
}) => (
  <div style={{ display: "flex", gap: 12 }}>
    {CATEGORIES.map((c) => (
      <CategoryTile key={c.id} id={c.id} selected={c.id === selected} w={tileW} glow={c.id === glowId ? glow : 0} />
    ))}
  </div>
);

export const AskInput: React.FC<{ text: string; width: number; caret?: boolean; sendGlow?: number }> = ({
  text,
  width,
  caret,
  sendGlow = 0,
}) => {
  const t = useTheme();
  return (
    <div
      style={{
        width,
        height: 72,
        borderRadius: 36,
        border: `1.8px solid ${t.gold}66`,
        background: t.dark ? "rgba(0,0,0,0.35)" : t.surface,
        display: "flex",
        alignItems: "center",
        padding: "0 10px 0 34px",
        boxSizing: "border-box",
        fontFamily: SANS,
        fontSize: 21,
      }}
    >
      <div style={{ flex: 1, color: text ? t.text : t.muted, whiteSpace: "nowrap", overflow: "hidden" }}>
        {text || "Ask the stars your question..."}
        {caret ? <Caret height={26} color={t.gold} style={{ marginLeft: 3 }} /> : null}
      </div>
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: 27,
          background: sendGlow > 0 ? `linear-gradient(135deg, ${t.ctaFrom}, ${t.ctaTo})` : `${t.gold}55`,
          color: sendGlow > 0 ? t.onCta : t.text,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
          fontWeight: 800,
          boxShadow: sendGlow > 0 ? `0 0 ${30 * sendGlow}px ${t.ctaTo}` : undefined,
        }}
      >
        ↑
      </div>
    </div>
  );
};

export const Chip: React.FC<{ text: string; style?: React.CSSProperties; active?: boolean; size?: number }> = ({
  text,
  style,
  active,
  size = 17,
}) => {
  const t = useTheme();
  return (
    <div
      style={{
        padding: `${size * 0.62}px ${size * 1.05}px`,
        borderRadius: 999,
        border: `1.5px solid ${active ? t.gold : t.border}`,
        background: active ? `${t.gold}26` : t.surface2,
        color: t.gold,
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: size,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** The "What would you like to know?" screen, rebuilt so it stays crisp in zooms. */
export const ChatHome: React.FC<{
  width: number;
  selected: CatId;
  text: string;
  caret?: boolean;
  sendGlow?: number;
  chips?: string[];
  glowId?: CatId;
  glow?: number;
}> = ({ width, selected, text, caret, sendGlow, chips = GENERAL_CHIPS, glowId, glow }) => {
  const t = useTheme();
  const c = cat(selected);
  return (
    <div style={{ width, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: SANS }}>
      <JyotiqNav width={width} active="Chat" />
      <div style={{ width: 1180, marginTop: 34 }}>
        <div style={{ color: t.gold, fontWeight: 800, fontSize: 17, letterSpacing: 1.5, marginBottom: 16 }}>
          ← YOUR READING
        </div>
        <CategoryRow selected={selected} glowId={glowId} glow={glow} />
      </div>
      <div style={{ marginTop: 64, color: t.muted, fontStyle: "italic", fontSize: 19 }}>{c.sub}</div>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 64, color: t.gold, marginTop: 6, letterSpacing: -0.5 }}>
        What would you like to know?
      </div>
      <div style={{ marginTop: 26 }}>
        <AskInput text={text} width={940} caret={caret} sendGlow={sendGlow} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, width: 1000, marginTop: 30 }}>
        {chips.map((q) => (
          <Chip key={q} text={q} />
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Modals                                                              */
/* ------------------------------------------------------------------ */

export const LoginCard: React.FC = () => {
  const t = useTheme();
  const field: React.CSSProperties = {
    height: 58,
    borderRadius: 12,
    border: `1.5px solid ${t.border}`,
    background: t.dark ? "rgba(0,0,0,0.3)" : t.surface2,
    display: "flex",
    alignItems: "center",
    padding: "0 18px",
    color: t.muted,
    fontSize: 18,
  };
  const label: React.CSSProperties = { color: t.gold, fontWeight: 800, fontSize: 15, letterSpacing: 1, margin: "18px 0 8px" };
  const alt: React.CSSProperties = {
    height: 54,
    borderRadius: 12,
    border: `1.5px solid ${t.border}`,
    background: t.surface2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    color: t.gold,
    fontWeight: 700,
    fontSize: 18,
    marginTop: 12,
  };
  return (
    <Panel style={{ width: 560, padding: "34px 36px 30px", boxSizing: "border-box" }} glow>
      <div style={{ color: t.text, opacity: 0.8, fontSize: 17 }}>‹ Back to Home</div>
      <div style={{ textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 44, color: t.gold, marginTop: 14 }}>
        Welcome Back
      </div>
      <div style={{ textAlign: "center", color: t.text, opacity: 0.8, fontSize: 17, marginTop: 6 }}>
        Sign in to consult Heaven and access your charts
      </div>
      <div style={{ display: "flex", marginTop: 26, fontWeight: 800, fontSize: 16, letterSpacing: 1 }}>
        <div style={{ flex: 1, textAlign: "center", color: t.gold, paddingBottom: 10, borderBottom: `2.5px solid ${t.gold}` }}>
          EMAIL
        </div>
        <div style={{ flex: 1, textAlign: "center", color: t.muted, paddingBottom: 10, borderBottom: `1.5px solid ${t.border}` }}>
          PHONE
        </div>
      </div>
      <div style={label}>EMAIL ADDRESS</div>
      <div style={field}>you@example.com</div>
      <div style={label}>PASSWORD</div>
      <div style={field}>••••••••</div>
      <GoldButton label="SIGN IN" height={56} style={{ marginTop: 24 }} />
      <div style={{ textAlign: "center", color: t.muted, fontWeight: 800, fontSize: 14, letterSpacing: 1.5, marginTop: 20 }}>
        OR CONTINUE WITH
      </div>
      <div style={alt}>
        <span style={{ fontWeight: 800, color: "#4285F4" }}>G</span> Sign In with Google
      </div>
      <div style={alt}>👤 Continue as Guest</div>
    </Panel>
  );
};

export const FlameCard: React.FC<{ scale?: number }> = () => {
  const t = useTheme();
  return (
    <Panel
      style={{
        width: 470,
        padding: "36px 36px 34px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: `1.5px solid ${t.gold}88`,
      }}
      glow
    >
      <TopGlowLine />
      <div
        style={{
          width: 128,
          height: 128,
          borderRadius: 64,
          background: t.dark ? "#2A1E0E" : "#FBEFD9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 70,
          boxShadow: `0 0 50px ${t.ctaTo}55`,
        }}
      >
        🔥
      </div>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 38, color: t.gold, marginTop: 18 }}>1 Flame Credited!</div>
      <div style={{ textAlign: "center", color: t.text, opacity: 0.78, fontSize: 18, lineHeight: 1.45, marginTop: 10 }}>
        Welcome to Jyotiq! A free flame has been added to your account to get you started on your cosmic journey.
      </div>
      <div
        style={{
          marginTop: 20,
          padding: "10px 22px",
          borderRadius: 999,
          border: `1.5px solid ${t.gold}`,
          color: t.gold,
          fontWeight: 800,
          fontSize: 18,
        }}
      >
        🔥 +1 Flame
      </div>
      <GoldButton label="START MY JOURNEY ›" width="100%" height={58} style={{ marginTop: 22 }} />
    </Panel>
  );
};

/** JYOTIQ tile from AstroRaaga's "Our Apps" bar, enlarged into a glassy card. */
export const AppTile: React.FC<{ press?: number }> = ({ press = 0 }) => {
  const t = useTheme();
  return (
    <div
      style={{
        width: 400,
        height: 360,
        borderRadius: 34,
        background: t.dark
          ? `linear-gradient(160deg, ${t.gold}40, ${t.gold}12 55%, ${t.ctaTo}22)`
          : `linear-gradient(160deg, #FFFFFF, ${t.goldSoft}33)`,
        border: `2px solid ${t.goldSoft}88`,
        boxShadow: `0 40px 90px ${t.shadow}, 0 0 80px ${t.gold}33, inset 0 1px 0 rgba(255,255,255,0.25)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: SANS,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(115deg, rgba(255,255,255,0.18) 0%, transparent 38%)",
        }}
      />
      <LogoIcon height={150} style={{ marginTop: 26 }} />
      <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: 3, color: t.text, marginTop: 6 }}>JYOTIQ</div>
      <div style={{ fontSize: 18, color: t.muted, marginTop: 2 }}>Instant Guidance</div>
      <GoldButton
        label="💬 Chat Now"
        width={220}
        height={52}
        fontSize={19}
        radius={26}
        style={{ marginTop: 20, transform: `scale(${1 - 0.08 * press})`, letterSpacing: 0.5 }}
        glow={1 + press}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Feature / category card (carousel + dashboard)                      */
/* ------------------------------------------------------------------ */

export const FeatureCard: React.FC<{ id: CatId; w?: number; h?: number; highlight?: number; press?: number }> = ({
  id,
  w = 360,
  h = 280,
  highlight = 0,
  press = 0,
}) => {
  const t = useTheme();
  const c = cat(id);
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 18,
        background: t.surface,
        border: `1.6px solid ${highlight > 0 ? t.gold : `${t.gold}55`}`,
        boxShadow: `0 18px 50px ${t.shadow}${highlight > 0 ? `, 0 0 ${40 * highlight}px ${t.gold}55` : ""}`,
        padding: 12,
        boxSizing: "border-box",
        fontFamily: SANS,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flex: 1,
          borderRadius: 12,
          background: t.surface2,
          border: `1px solid ${t.border}`,
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 15 }}>{c.emoji}</span>
          <span style={{ color: t.gold, fontWeight: 800, fontSize: 11.5, letterSpacing: 1.2 }}>{c.label}</span>
          <span style={{ marginLeft: "auto", color: t.muted, fontSize: 10.5 }}>🔥 1 Flame</span>
        </div>
        <div
          style={{
            alignSelf: "flex-end",
            maxWidth: "88%",
            padding: "7px 11px",
            borderRadius: "12px 12px 3px 12px",
            background: `${t.gold}22`,
            border: `1px solid ${t.gold}66`,
            color: t.text,
            fontSize: 12.5,
            lineHeight: 1.3,
            fontWeight: 600,
          }}
        >
          {c.q}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <LogoIcon height={20} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5, paddingTop: 3 }}>
            <div style={{ height: 6, borderRadius: 3, background: `${t.gold}44`, width: "92%" }} />
            <div style={{ height: 6, borderRadius: 3, background: `${t.gold}30`, width: "78%" }} />
            <div style={{ height: 6, borderRadius: 3, background: `${t.gold}22`, width: "60%" }} />
          </div>
        </div>
        <div
          style={{
            marginTop: "auto",
            alignSelf: "flex-start",
            padding: "5px 11px",
            borderRadius: 8,
            background: `linear-gradient(90deg, ${t.ctaFrom}, ${t.ctaTo})`,
            color: t.onCta,
            fontWeight: 800,
            fontSize: 11,
            letterSpacing: 0.4,
            transform: `scale(${1 - 0.1 * press})`,
          }}
        >
          ✨ View Remedy
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 4px 2px" }}>
        <LogoIcon height={30} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 21, color: t.text, lineHeight: 1.1 }}>{c.title}</div>
          <div style={{ fontSize: 11.5, color: t.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {c.sub}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Screenshot card (real product screens)                              */
/* ------------------------------------------------------------------ */

export const ScreenCard: React.FC<{ src: string; w: number; h: number; style?: React.CSSProperties }> = ({
  src,
  w,
  h,
  style,
}) => {
  const t = useTheme();
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 26,
        overflow: "hidden",
        border: `2.5px solid ${t.gold}aa`,
        boxShadow: `0 0 40px ${t.gold}22`,
        background: "#000",
        ...style,
      }}
    >
      {/* Gamma lift (dark palettes): the app screenshots are dark-on-dark, so raise the
          shadows so the tunnel walls read, without clipping the amber CTAs to yellow
          the way a plain brightness() boost does. */}
      {t.dark ? (
        <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
          <filter id={`jq-lift-${src}`} colorInterpolationFilters="sRGB">
            <feComponentTransfer>
              <feFuncR type="gamma" amplitude={1} exponent={0.72} offset={0} />
              <feFuncG type="gamma" amplitude={1} exponent={0.72} offset={0} />
              <feFuncB type="gamma" amplitude={1} exponent={0.72} offset={0} />
            </feComponentTransfer>
          </filter>
        </svg>
      ) : null}
      <Img
        src={staticFile(`jyotiq/screens/${src}.png`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: t.dark ? `url(#jq-lift-${src})` : undefined,
        }}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Chat thread pieces                                                  */
/* ------------------------------------------------------------------ */

export const UserBubble: React.FC<{ text: string }> = ({ text }) => {
  const t = useTheme();
  return (
    <div
      style={{
        padding: "18px 24px",
        borderRadius: "22px 22px 6px 22px",
        background: `linear-gradient(135deg, ${t.gold}33, ${t.gold}18)`,
        border: `1.5px solid ${t.gold}77`,
        color: t.text,
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 24,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

export const HORIZONS = ["Upto 3 Months", "Upto 1 Year", "Upto 3 Years"];
// Fixed chip boxes so B6 can compute exactly where "Upto 1 Year" sits (the tap + morph start there).
export const HORIZON_W = [186, 152, 166];
export const HORIZON_H = 54;
export const HORIZON_GAP = 14;
// Bubble geometry, in thread coordinates relative to the HorizonBubble's top-left.
// avatar 70 + gap 18 + border 1.5 + padding 28 | border 1.5 + padding 24 + title 40 + 8 + 2 lines x 29.4 + 20
export const HORIZON_CHIPS_LEFT = 70 + 18 + 1.5 + 28;
export const HORIZON_CHIPS_TOP = 1.5 + 24 + 40 + 8 + 2 * 29.4 + 20;

export const HorizonBubble: React.FC<{ chipPress?: number; chipActive?: number; hideChip?: number }> = ({
  chipPress = 0,
  chipActive = -1,
  hideChip = -1,
}) => {
  const t = useTheme();
  return (
    <div style={{ display: "flex", gap: 18, alignItems: "flex-start", fontFamily: SANS }}>
      <div
        style={{
          width: 70,
          height: 70,
          borderRadius: 35,
          background: t.surface2,
          border: `1.5px solid ${t.gold}77`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <LogoIcon height={44} />
      </div>
      <div
        style={{
          padding: "24px 28px 26px",
          borderRadius: "6px 24px 24px 24px",
          background: t.surface,
          border: `1.5px solid ${t.border}`,
          boxShadow: `0 20px 60px ${t.shadow}`,
        }}
      >
        <div style={{ color: t.gold, fontFamily: SERIF, fontWeight: 700, fontSize: 32, lineHeight: "40px" }}>
          Select Planning Horizon
        </div>
        <div style={{ color: t.text, opacity: 0.8, fontSize: 21, marginTop: 8, maxWidth: 640, lineHeight: "29.4px" }}>
          Vedic forecast accuracy increases when aligned to a specific time span. Choose your perspective:
        </div>
        <div style={{ display: "flex", gap: HORIZON_GAP, marginTop: 20 }}>
          {HORIZONS.map((h, i) => (
            <Chip
              key={h}
              text={h}
              size={20}
              active={i === chipActive}
              style={{
                width: HORIZON_W[i],
                height: HORIZON_H,
                padding: 0,
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: i === chipActive ? `scale(${1 - 0.08 * chipPress})` : undefined,
                opacity: i === hideChip ? 0 : 1,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/** Window frame used to hold the rebuilt app pages. */
export const AppWindow: React.FC<{ w: number; h: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  w,
  h,
  children,
  style,
}) => {
  const t = useTheme();
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 30,
        background: t.dark
          ? `radial-gradient(ellipse 70% 60% at 50% 30%, ${t.surface2}, ${t.bg} 75%)`
          : `radial-gradient(ellipse 70% 60% at 50% 30%, #FFFFFF, ${t.bg} 80%)`,
        border: `2px solid ${t.gold}77`,
        boxShadow: `0 50px 120px ${t.shadow}, 0 0 80px ${t.gold}18`,
        overflow: "hidden",
        position: "relative",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
