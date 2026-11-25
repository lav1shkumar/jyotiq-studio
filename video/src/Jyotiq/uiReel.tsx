import React from "react";
import { Caret } from "./motion";
import { SANS, SERIF, useTheme } from "./theme";
import { AppWindow, cat, CATEGORIES, CatId, Chip, FeatureCard, HORIZONS, LogoIcon, LogoWordmark } from "./ui";

/* Phone-width (1000 px) rebuilds of the Jyotiq screens for the 9:16 Reel.
   Copy comes from the live app and Ayush's screenshots of /chat (General tab,
   Love tab, and the typed question "When will I get married?"). */

export const CHIPS: Record<"general" | "love", string[]> = {
  general: [
    "What does my immediate future hold for me?",
    "What are my hidden strengths and how can I utilize them?",
    "How can I find peace of mind and overcome current stress?",
  ],
  love: [
    "When am I likely to meet my true soulmate or life partner?",
    "Is my current partner truly compatible with me long-term?",
    "Will my love life become more stable and fulfilling soon?",
  ],
};

/* ------------------------------------------------------------------ */
/* Top bar                                                             */
/* ------------------------------------------------------------------ */

export const MobileTopBar: React.FC<{ width: number; flames?: number }> = ({ width, flames = 1 }) => {
  const t = useTheme();
  const pill: React.CSSProperties = {
    height: 58,
    padding: "0 20px",
    borderRadius: 16,
    border: `2px solid ${t.border}`,
    background: t.surface2,
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: t.gold,
    fontWeight: 700,
    fontSize: 25,
  };
  return (
    <div
      style={{
        width,
        height: 118,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "0 34px",
        borderBottom: `2px solid ${t.border}`,
        boxSizing: "border-box",
        fontFamily: SANS,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <LogoIcon height={60} />
        <LogoWordmark height={22} style={{ marginTop: -3 }} />
      </div>
      <div style={{ flex: 1 }} />
      <div style={pill}>English ⌄</div>
      <div style={pill}>
        {flames} <span style={{ fontSize: 24 }}>🔥</span>
        <span
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            background: t.gold,
            color: t.onCta,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            fontWeight: 800,
          }}
        >
          +
        </span>
      </div>
      <div
        style={{
          width: 58,
          height: 58,
          borderRadius: 29,
          border: `2.5px solid ${t.gold}`,
          background: t.surface2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        <svg viewBox="0 0 24 24" width={32} height={32} aria-hidden>
          <circle cx={12} cy={8.5} r={4} fill={t.gold} />
          <path d="M4 20.5c0-4.2 3.6-6.8 8-6.8s8 2.6 8 6.8" fill={t.gold} />
        </svg>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Category tabs (horizontal scroll row, as on the phone)              */
/* ------------------------------------------------------------------ */

export const TAB = { w: 176, h: 112, gap: 14, pad: 36, top: 146 };
/** Centre of tab i in ChatHomeMobile coordinates. */
export const tabCenter = (i: number) => ({ x: TAB.pad + i * (TAB.w + TAB.gap) + TAB.w / 2, y: TAB.top + TAB.h / 2 });

const TabTile: React.FC<{ id: CatId; selected: boolean; glow: number }> = ({ id, selected, glow }) => {
  const t = useTheme();
  const c = cat(id);
  return (
    <div
      style={{
        width: TAB.w,
        height: TAB.h,
        flexShrink: 0,
        borderRadius: 20,
        background: t.surface2,
        border: `2.5px solid ${selected ? t.gold : t.border}`,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 21,
        letterSpacing: 0.8,
        color: selected ? t.gold : t.text,
        boxShadow: glow > 0 ? `0 0 ${44 * glow}px ${t.gold}88` : undefined,
      }}
    >
      <span style={{ fontSize: 32, lineHeight: 1 }}>{c.emoji}</span>
      {c.label}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Ask box                                                             */
/* ------------------------------------------------------------------ */

export const ASK = { top: 598, left: 40, h: 110, send: 86, inset: 12 };
export const sendCenter = (width: number) => ({
  x: width - ASK.left - ASK.inset - ASK.send / 2,
  y: ASK.top + ASK.h / 2,
});

export const AskInputMobile: React.FC<{ text: string; width: number; caret?: boolean; sendGlow?: number; press?: number }> = ({
  text,
  width,
  caret,
  sendGlow = 0,
  press = 0,
}) => {
  const t = useTheme();
  const lit = Math.min(1, sendGlow);
  return (
    <div
      style={{
        width,
        height: ASK.h,
        borderRadius: ASK.h / 2,
        border: `2.5px solid ${t.gold}${text ? "cc" : "88"}`,
        background: t.dark ? "rgba(0,0,0,0.4)" : t.surface,
        boxShadow: `0 0 ${text ? 34 : 18}px ${t.gold}${text ? "33" : "1f"}`,
        display: "flex",
        alignItems: "center",
        padding: `0 ${ASK.inset}px 0 40px`,
        boxSizing: "border-box",
        fontFamily: SANS,
        fontSize: 31,
      }}
    >
      <div style={{ flex: 1, color: text ? t.text : t.muted, whiteSpace: "nowrap", overflow: "hidden" }}>
        {text || "Ask the stars your question..."}
        {caret ? <Caret height={36} color={t.gold} style={{ marginLeft: 4 }} /> : null}
      </div>
      <div
        style={{
          width: ASK.send,
          height: ASK.send,
          borderRadius: ASK.send / 2,
          flexShrink: 0,
          background: lit > 0 ? `linear-gradient(135deg, ${t.goldSoft}, ${t.ctaFrom} 55%, ${t.ctaTo})` : `${t.gold}55`,
          opacity: 0.55 + 0.45 * lit,
          color: t.onCta,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: lit > 0 ? `0 0 ${(26 + 30 * press) * lit}px ${t.ctaTo}` : undefined,
          transform: `scale(${1 - 0.1 * press})`,
        }}
      >
        <svg viewBox="0 0 24 24" width={40} height={40} aria-hidden>
          <path d="M12 19V5M5.5 11.5L12 5l6.5 6.5" fill="none" stroke={t.onCta} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Suggested-question pills + "Seek deeper guidance"                   */
/* ------------------------------------------------------------------ */

const PillStack: React.FC<{ chips: string[]; style?: React.CSSProperties }> = ({ chips, style }) => {
  const t = useTheme();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, ...style }}>
      {chips.map((q) => (
        <div
          key={q}
          style={{
            maxWidth: 900,
            padding: "17px 30px",
            borderRadius: 44,
            border: `2px solid ${t.border}`,
            background: t.surface2,
            color: t.gold,
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 26,
            lineHeight: 1.3,
            textAlign: "center",
            boxSizing: "border-box",
          }}
        >
          {q}
        </div>
      ))}
    </div>
  );
};

const SeekDeeper: React.FC<{ width: number }> = ({ width }) => {
  const t = useTheme();
  const items: [string, string][] = [
    ["✪", "ASTROLOGY"],
    ["🏠", "VASTU"],
    ["🔥", "HAWAN & POOJA"],
    ["💎", "GEMSTONES"],
  ];
  return (
    <div style={{ width, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: SANS }}>
      <div style={{ color: t.muted, fontWeight: 800, fontSize: 22, letterSpacing: 3 }}>SEEK DEEPER GUIDANCE</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 24 }}>
        {items.map(([icon, label]) => (
          <div key={label} style={{ width: 214, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 92,
                height: 92,
                borderRadius: 46,
                background: t.surface2,
                border: `2px solid ${t.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 38,
                color: t.gold,
              }}
            >
              {icon}
            </div>
            <div style={{ color: t.text, opacity: 0.85, fontWeight: 800, fontSize: 19, letterSpacing: 1 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* The /chat screen at phone width                                     */
/* ------------------------------------------------------------------ */

export const CHAT_M = { w: 1000, h: 1340 };

export const ChatHomeMobile: React.FC<{
  from: "general" | "love";
  to: "general" | "love";
  swap: number; // 0 = showing `from`, 1 = showing `to`
  text: string;
  caret?: boolean;
  sendGlow?: number;
  sendPress?: number;
  tabGlow?: number;
}> = ({ from, to, swap, text, caret, sendGlow, sendPress, tabGlow = 0 }) => {
  const t = useTheme();
  const W = CHAT_M.w;
  const selected = swap > 0 ? to : from;
  return (
    <AppWindow w={W} h={CHAT_M.h}>
      <div style={{ position: "absolute", inset: 0, fontFamily: SANS }}>
        <MobileTopBar width={W} />
        <div style={{ position: "absolute", top: TAB.top, left: 0, width: W, overflow: "hidden" }}>
          <div style={{ display: "flex", gap: TAB.gap, paddingLeft: TAB.pad }}>
            {CATEGORIES.map((c) => (
              <TabTile key={c.id} id={c.id} selected={c.id === selected} glow={c.id === to ? tabGlow : 0} />
            ))}
          </div>
        </div>
        {/* subtitle swaps with the tab */}
        <div style={{ position: "absolute", top: 296, left: 0, width: W, height: 40, color: t.muted, fontStyle: "italic", fontSize: 27 }}>
          <div style={{ position: "absolute", inset: 0, textAlign: "center", opacity: 1 - swap, transform: `translateY(${-12 * swap}px)` }}>
            {cat(from).sub}
          </div>
          <div style={{ position: "absolute", inset: 0, textAlign: "center", opacity: swap, transform: `translateY(${12 * (1 - swap)}px)` }}>
            {cat(to).sub}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: 350,
            left: 0,
            width: W,
            textAlign: "center",
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 92,
            lineHeight: 1.06,
            letterSpacing: -1,
            color: t.gold,
            textShadow: `0 0 40px ${t.gold}33`,
          }}
        >
          What would you
          <br />
          like to know?
        </div>
        <div style={{ position: "absolute", top: ASK.top, left: ASK.left }}>
          <AskInputMobile text={text} width={W - 2 * ASK.left} caret={caret} sendGlow={sendGlow} press={sendPress} />
        </div>
        <div style={{ position: "absolute", top: 752, left: 0, width: W }}>
          <PillStack
            chips={CHIPS[from]}
            style={{ position: "absolute", left: 0, right: 0, opacity: 1 - swap, transform: `translateY(${-16 * swap}px)` }}
          />
          <PillStack
            chips={CHIPS[to]}
            style={{ position: "absolute", left: 0, right: 0, opacity: swap, transform: `translateY(${16 * (1 - swap)}px)` }}
          />
        </div>
        <div style={{ position: "absolute", top: 1118, left: 0 }}>
          <SeekDeeper width={W} />
        </div>
      </div>
    </AppWindow>
  );
};

/* ------------------------------------------------------------------ */
/* Home: "Guidance categories" dashboard, 2 columns                    */
/* ------------------------------------------------------------------ */

export const DASH = { w: 1000, h: 1760, cs: 1.2, gapX: 28, gapY: 22, top: 318 };
export const DASH_CW = 360 * DASH.cs;
export const DASH_CH = 280 * DASH.cs;
const DASH_GX = (DASH.w - (2 * DASH_CW + DASH.gapX)) / 2;
export const DASH_GRID: CatId[][] = [
  ["love", "career"],
  ["wealth", "health"],
  ["travel", "education"],
  ["family", "general"],
];
export const dashCard = (r: number, c: number) => ({
  x: DASH_GX + c * (DASH_CW + DASH.gapX),
  y: DASH.top + r * (DASH_CH + DASH.gapY),
});
/** "View Remedy" button centre inside a dashboard card (FeatureCard layout x the 1.2 scale). */
export const DASH_BTN = { dx: 74 * DASH.cs, dy: 192 * DASH.cs };

export const DashboardMobile: React.FC<{ target: CatId; highlight: number; press: number }> = ({ target, highlight, press }) => {
  const t = useTheme();
  return (
    <div style={{ position: "relative", width: DASH.w, height: DASH.h }}>
      <AppWindow w={DASH.w} h={DASH.h}>
        <MobileTopBar width={DASH.w} />
        <div style={{ position: "absolute", left: DASH_GX + 4, top: 150, fontFamily: SANS }}>
          <div style={{ color: t.gold, fontWeight: 800, fontSize: 21, letterSpacing: 3 }}>GUIDANCE CATEGORIES</div>
          <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 52, color: t.text, marginTop: 6, letterSpacing: -0.5 }}>
            What would you like to know?
          </div>
          <div style={{ color: t.muted, fontSize: 23, marginTop: 4 }}>Click a category card for instant domain readings.</div>
        </div>
      </AppWindow>
      {DASH_GRID.map((row, r) =>
        row.map((id, c) => {
          const p = dashCard(r, c);
          return (
            <div key={id} style={{ position: "absolute", left: p.x, top: p.y, width: DASH_CW, height: DASH_CH }}>
              <div style={{ transform: `scale(${DASH.cs})`, transformOrigin: "0 0" }}>
                <FeatureCard id={id} highlight={id === target ? highlight : 0} press={id === target ? press : 0} />
              </div>
            </div>
          );
        }),
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Chat thread at phone width                                          */
/* ------------------------------------------------------------------ */

export const BubbleUser: React.FC<{ text: string }> = ({ text }) => {
  const t = useTheme();
  return (
    <div
      style={{
        padding: "24px 34px",
        borderRadius: "32px 32px 8px 32px",
        background: `linear-gradient(135deg, ${t.gold}3a, ${t.gold}1a)`,
        border: `2px solid ${t.gold}88`,
        color: t.text,
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 36,
        whiteSpace: "nowrap",
        boxShadow: `0 18px 50px ${t.shadow}`,
      }}
    >
      {text}
    </div>
  );
};

const JyotiqAvatar: React.FC = () => {
  const t = useTheme();
  return (
    <div
      style={{
        width: HZ.avatar,
        height: HZ.avatar,
        borderRadius: HZ.avatar / 2,
        background: t.surface2,
        border: `2px solid ${t.gold}88`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxSizing: "border-box",
      }}
    >
      <LogoIcon height={60} />
    </div>
  );
};

/** "Consulting the stars..." with bouncing dots (frame-driven). */
export const TypingBubble: React.FC<{ frame: number }> = ({ frame }) => {
  const t = useTheme();
  return (
    <div style={{ display: "flex", gap: HZ.gap, alignItems: "center", fontFamily: SANS }}>
      <JyotiqAvatar />
      <div
        style={{
          padding: "22px 30px",
          borderRadius: "8px 30px 30px 30px",
          background: t.surface,
          border: `2px solid ${t.border}`,
          display: "flex",
          alignItems: "center",
          gap: 16,
          color: t.muted,
          fontSize: 28,
          fontStyle: "italic",
        }}
      >
        Consulting the stars
        <span style={{ display: "flex", gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: 11,
                height: 11,
                borderRadius: 6,
                background: t.gold,
                transform: `translateY(${-7 * Math.max(0, Math.sin((frame - i * 3) / 2.2))}px)`,
              }}
            />
          ))}
        </span>
      </div>
    </div>
  );
};

/* Fixed geometry so R6 knows exactly where "Upto 1 Year" sits (the tap and the morph start there). */
export const HZ = {
  avatar: 96,
  gap: 20,
  border: 2,
  padX: 32,
  padTop: 30,
  titleLH: 54,
  subGap: 8,
  subLH: 38,
  chipsGap: 24,
  chipW: [252, 206, 226],
  chipH: 72,
  chipGapX: 16,
  font: 27,
};
export const HZ_CHIP = {
  x: HZ.avatar + HZ.gap + HZ.border + HZ.padX + HZ.chipW[0] + HZ.chipGapX + HZ.chipW[1] / 2,
  y: HZ.border + HZ.padTop + HZ.titleLH + HZ.subGap + HZ.subLH + HZ.chipsGap + HZ.chipH / 2,
  w: HZ.chipW[1],
  h: HZ.chipH,
};

export const HorizonBubbleMobile: React.FC<{ chipActive?: number; chipPress?: number; hideChip?: number }> = ({
  chipActive = -1,
  chipPress = 0,
  hideChip = -1,
}) => {
  const t = useTheme();
  return (
    <div style={{ display: "flex", gap: HZ.gap, alignItems: "flex-start", fontFamily: SANS }}>
      <JyotiqAvatar />
      <div
        style={{
          padding: `${HZ.padTop}px ${HZ.padX}px 32px`,
          borderRadius: "8px 32px 32px 32px",
          background: t.surface,
          border: `${HZ.border}px solid ${t.border}`,
          boxShadow: `0 24px 70px ${t.shadow}`,
        }}
      >
        <div style={{ color: t.gold, fontFamily: SERIF, fontWeight: 700, fontSize: 44, lineHeight: `${HZ.titleLH}px`, whiteSpace: "nowrap" }}>
          Select Planning Horizon
        </div>
        <div style={{ color: t.text, opacity: 0.8, fontSize: 28, marginTop: HZ.subGap, lineHeight: `${HZ.subLH}px`, whiteSpace: "nowrap" }}>
          Choose your perspective:
        </div>
        <div style={{ display: "flex", gap: HZ.chipGapX, marginTop: HZ.chipsGap }}>
          {HORIZONS.map((h, i) => (
            <Chip
              key={h}
              text={h}
              size={HZ.font}
              active={i === chipActive}
              style={{
                width: HZ.chipW[i],
                height: HZ.chipH,
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
