import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { SANS } from "../theme";
import { CORMORANT, DEVA } from "./fonts";
import { ICONS, StatusBar, SysNav } from "./playStore";

/* Device-px (724 x 1568) rebuild of the Jyotiq Android app from Ayush's
   screenshots: Home (diya, "Namaste, <name>", ask box) with the Samsung-style
   dark keyboard, and the chat thread after sending. */

const BG = "#15120E";
const CREAM = "#EADBB4";
const MUTED = "#8D8676";
const GOLD = "#D9BE6C";

/* ------------------------------------------------------------------ */
/* Keyboard                                                            */
/* ------------------------------------------------------------------ */

export const KB_TOP = 880;
const ROWS = ["1234567890", "qwertyuiop", "asdfghjkl", "zxcvbnm"];
const KEY_W = 64.4;
const GAP = 7.6;
const ROW_Y = [968, 1060, 1154, 1248];
const KEY_H = 84;

/** Centre of the key for a character (device px, keyboard shown), or null. */
export const keyCenter = (ch: string): { x: number; y: number } | null => {
  const c = ch.toLowerCase();
  if (c === " ") return { x: 362, y: 1342 + KEY_H / 2 };
  for (let r = 0; r < ROWS.length; r++) {
    const i = ROWS[r].indexOf(c);
    if (i < 0) continue;
    const n = ROWS[r].length;
    const left = r === 3 ? 8 + (KEY_W + GAP) * 1.5 : 8 + ((10 - n) * (KEY_W + GAP)) / 2;
    return { x: left + i * (KEY_W + GAP) + KEY_W / 2, y: ROW_Y[r] + KEY_H / 2 };
  }
  return null;
};

const Key: React.FC<{ x: number; y: number; w: number; label: React.ReactNode; dark?: boolean; lit?: number; size?: number }> = ({ x, y, w, label, dark, lit = 0, size = 34 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: KEY_H,
      borderRadius: 12,
      background: lit > 0 ? `rgba(${44 + 50 * lit},${44 + 50 * lit},${48 + 50 * lit},1)` : dark ? "#222224" : "#2C2C2E",
      color: "#F2F2F2",
      fontSize: size,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: SANS,
    }}
  >
    {label}
  </div>
);

export const Keyboard: React.FC<{ litChar: string; lit: number }> = ({ litChar, lit }) => {
  const lc = litChar.toLowerCase();
  const keys: React.ReactNode[] = [];
  ROWS.forEach((row, r) => {
    const n = row.length;
    const left = r === 3 ? 8 + (KEY_W + GAP) * 1.5 : 8 + ((10 - n) * (KEY_W + GAP)) / 2;
    row.split("").forEach((ch, i) => {
      keys.push(<Key key={`${r}${ch}`} x={left + i * (KEY_W + GAP)} y={ROW_Y[r] - KB_TOP} w={KEY_W} label={r === 0 ? ch : ch.toUpperCase()} lit={lc === ch ? lit : 0} />);
    });
  });
  const y3 = ROW_Y[3] - KB_TOP;
  const y4 = 1342 - KB_TOP;
  return (
    <div style={{ position: "absolute", left: 0, top: KB_TOP, width: 724, height: 1568 - KB_TOP, background: "#111113" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 724, height: 80, display: "flex", justifyContent: "space-around", alignItems: "center", color: "#C8C8C8", fontSize: 34 }}>
        <span>☺</span>
        <span>文A</span>
        <span>⚙</span>
        <span>▣</span>
        <span>⋯</span>
      </div>
      {keys}
      <Key x={8} y={y3} w={KEY_W * 1.4} label="⇧" dark size={36} />
      <Key x={724 - 8 - KEY_W * 1.4} y={y3} w={KEY_W * 1.4} label="⌫" dark size={34} />
      <Key x={8} y={y4} w={KEY_W * 1.4} label="!#1" dark size={28} />
      <Key x={8 + KEY_W * 1.4 + GAP} y={y4} w={KEY_W} label="," dark />
      <Key x={8 + KEY_W * 2.4 + GAP * 2} y={y4} w={724 - 16 - KEY_W * 4.8 - GAP * 4 - KEY_W} label={<span style={{ fontSize: 24, color: "#BDBDBD" }}>English(India)</span>} lit={lc === " " ? lit : 0} />
      <Key x={724 - 8 - KEY_W * 2.4 - GAP} y={y4} w={KEY_W} label="." dark />
      <Key x={724 - 8 - KEY_W * 1.4} y={y4} w={KEY_W * 1.4} label={<span style={{ fontSize: 28, color: "#7FB2FF" }}>Send</span>} dark />
      <SysNav top={1470 - KB_TOP} bg="#111113" down />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */

const Diya: React.FC<{ t: number }> = ({ t }) => {
  const fl = 1 + 0.035 * Math.sin(t / 2.3) + 0.02 * Math.sin(t / 1.3);
  return (
    <svg width={724} height={360} viewBox="0 240 724 360" style={{ position: "absolute", left: 0, top: 240 }}>
      <defs>
        <radialGradient id="hdglow" cx="362" cy="460" r="230" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8A5A16" stopOpacity="0.5" />
          <stop offset="1" stopColor="#8A5A16" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hdflame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE680" />
          <stop offset="0.55" stopColor="#F6A82A" />
          <stop offset="1" stopColor="#E77A1C" />
        </linearGradient>
        <linearGradient id="hdlamp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F0CF7A" />
          <stop offset="1" stopColor="#B98A35" />
        </linearGradient>
      </defs>
      <circle cx={362} cy={460} r={230} fill="url(#hdglow)" />
      <g transform={`translate(362 515) scale(${1 / fl} ${fl}) translate(-362 -515)`}>
        <path d="M362 318 C392 380 418 432 408 470 C400 500 380 514 362 515 C344 514 324 500 316 470 C306 432 332 380 362 318 Z" fill="url(#hdflame)" />
        <path d="M362 392 C378 428 388 458 382 478 C377 496 368 503 362 503 C356 503 347 496 342 478 C336 458 346 428 362 392 Z" fill="#FFF7D6" opacity={0.92} />
      </g>
      <path d="M250 520 Q362 612 474 520 Q446 568 362 572 Q278 568 250 520 Z" fill="url(#hdlamp)" />
      <path d="M262 524 Q362 596 462 524" fill="none" stroke="#FFF0C4" strokeWidth={3} opacity={0.7} />
      <ellipse cx={362} cy={584} rx={58} ry={11} fill="#C79A44" />
    </svg>
  );
};

export const HomeScreen: React.FC<{
  t: number;
  name: string;
  flames: number;
  typed: string;
  caret: boolean;
  focus: number;
  kb: number;
  litChar: string;
  lit: number;
  sendPress: number;
  sendGlow: number;
}> = ({ t, name, flames, typed, caret, focus, kb, litChar, lit, sendPress, sendGlow }) => {
  const scroll = 300 * kb;
  const lines = typed.length > 30 ? 2 : 1;
  const boxH = lines === 2 ? 158 : 113;
  const boxBottom = 1110;
  return (
    <AbsoluteFill style={{ background: BG, fontFamily: SANS, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: -scroll, width: 724, height: 1568 }}>
        {/* top row */}
        <div style={{ position: "absolute", left: 22, top: 96, display: "flex", alignItems: "center", gap: 10, color: CREAM, fontSize: 40, fontWeight: 600 }}>
          <svg viewBox="0 0 24 24" width={42} height={42}>
            <path d={ICONS.flame} fill="#E0A63E" />
          </svg>
          {flames}
        </div>
        <div style={{ position: "absolute", left: 180, top: 88, height: 70, padding: "0 28px", borderRadius: 22, border: "2.5px solid #6B5A36", color: CREAM, fontSize: 30, fontWeight: 600, display: "flex", alignItems: "center", boxSizing: "border-box" }}>English</div>
        <div style={{ position: "absolute", left: 338, top: 88, height: 70, width: 248, borderRadius: 22, background: GOLD, color: "#1A1206", fontSize: 30, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>+ Buy Flames</div>
        <div style={{ position: "absolute", left: 604, top: 88, height: 70, width: 180, borderRadius: 22, border: "2.5px solid #6B5A36", color: CREAM, fontSize: 30, fontWeight: 600, display: "flex", alignItems: "center", paddingLeft: 22, gap: 10, boxSizing: "border-box" }}>
          <svg viewBox="0 0 24 24" width={30} height={30}>
            <path d={ICONS.calendar} fill={CREAM} />
          </svg>
          Co
        </div>
        <Diya t={t} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 618, textAlign: "center", fontFamily: DEVA, fontSize: 28, color: "#9B9384" }}>तमसो मा ज्योतिर्गमय</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 672, textAlign: "center", fontFamily: CORMORANT, fontWeight: 600, fontSize: 56, color: CREAM }}>
          Namaste, <span style={{ color: "#E8A93A" }}>{name}</span>
        </div>
        <div style={{ position: "absolute", left: 50, width: 624, top: 762, textAlign: "center", fontStyle: "italic", fontSize: 28, lineHeight: 1.45, color: MUTED }}>“Arise, awake, and stop not until the goal is achieved.”</div>
        <div style={{ position: "absolute", left: 22, top: 850, fontFamily: CORMORANT, fontStyle: "italic", fontWeight: 500, fontSize: 30, color: MUTED }}>~ Swami Vivekananda</div>
        {/* ask box */}
        <div
          style={{
            position: "absolute",
            left: 16,
            top: boxBottom - boxH,
            width: 692,
            height: boxH,
            borderRadius: 26,
            background: "#1E1A14",
            border: `2.5px solid ${focus > 0 ? `rgba(217,190,108,${0.35 + 0.65 * focus})` : "#4A3F2B"}`,
            boxShadow: focus > 0 ? `0 0 ${26 * focus}px rgba(217,190,108,0.35)` : undefined,
            boxSizing: "border-box",
          }}
        >
          <div style={{ position: "absolute", left: 26, top: lines === 2 ? 24 : 34, width: 548, fontSize: 31, lineHeight: 1.4, color: typed ? "#F5ECDD" : MUTED }}>
            {typed || "Type your question..."}
            {caret ? <span style={{ display: "inline-block", width: 3, height: 36, background: GOLD, verticalAlign: "middle", marginLeft: 2, opacity: Math.floor(t / 7) % 2 ? 0 : 1 }} /> : null}
          </div>
          <div
            style={{
              position: "absolute",
              right: 13,
              bottom: 12,
              width: 86,
              height: 86,
              borderRadius: 20,
              background: GOLD,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${1 - 0.1 * sendPress})`,
              boxShadow: sendGlow > 0 ? `0 0 ${40 * sendGlow}px rgba(255,214,120,0.85)` : "0 6px 18px rgba(0,0,0,0.4)",
            }}
          >
            <svg viewBox="0 0 24 24" width={44} height={44}>
              <path d={ICONS.up} fill="#1A1206" />
            </svg>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1206, textAlign: "center", fontFamily: CORMORANT, fontWeight: 600, fontSize: 48, color: CREAM }}>Where Does Your Light Fall?</div>
        <div style={{ position: "absolute", left: 62, top: 1292, width: 96, height: 80, borderRadius: 20, background: "#7A5530" }} />
        <div style={{ position: "absolute", left: 168, top: 1292, width: 270, height: 80, borderRadius: 20, background: "#3A2C1E" }} />
        <div style={{ position: "absolute", left: 484, top: 1292, width: 176, height: 80, borderRadius: 20, background: "#1D2B44" }} />
      </div>
      {/* bottom nav (hidden behind the keyboard when it is up) */}
      <div style={{ position: "absolute", left: 0, top: 1335, width: 724, height: 135, background: "#1A1611", borderTop: "2px solid #2A241B", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
        {[
          ["Home", ICONS.home],
          ["Chat", ICONS.chat],
          ["Kundali", ICONS.sparkle],
          ["Profile", ICONS.person],
        ].map(([label, d], i) => (
          <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, fontSize: 25, fontWeight: 600, color: i === 0 ? "#E8C77A" : "#6E6656" }}>
            <svg viewBox="0 0 24 24" width={46} height={46}>
              <path d={d} fill={i === 0 ? "#E8C77A" : "#6E6656"} />
            </svg>
            {label}
          </div>
        ))}
      </div>
      <SysNav top={1470} bg="#000000" />
      {kb > 0 ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: 724, height: 1568, transform: `translateY(${(1 - kb) * (1568 - KB_TOP)}px)` }}>
          <Keyboard litChar={litChar} lit={lit} />
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 0, top: 0, width: 724, height: 80, background: BG }} />
      <StatusBar />
    </AbsoluteFill>
  );
};

/** Centre of the ask box's send button (device px) for a keyboard state 0..1. */
export const sendCenterDev = (kb: number) => ({ x: 652, y: 1053 - 300 * kb });

/* ------------------------------------------------------------------ */
/* Chat thread                                                         */
/* ------------------------------------------------------------------ */

export const ChatScreen: React.FC<{ t: number; question: string; flyIn: number; reply: number; flames: number }> = ({ t, question, flyIn, reply, flames }) => {
  const dots = [0, 1, 2].map((i) => 0.35 + 0.65 * Math.max(0, Math.sin(t / 3 - i * 0.9)));
  return (
    <AbsoluteFill style={{ background: BG, fontFamily: SANS }}>
      <StatusBar />
      <div style={{ position: "absolute", left: 0, top: 80, width: 724, height: 100, borderBottom: "2px solid #2A241B", display: "flex", alignItems: "center", gap: 16, paddingLeft: 26, boxSizing: "border-box" }}>
        <svg viewBox="0 0 24 24" width={42} height={42}>
          <path d={ICONS.back} fill={CREAM} />
        </svg>
        <Img src={staticFile("jyotiq/logo-icon.png")} style={{ width: 70, height: 58 }} />
        <div style={{ fontFamily: CORMORANT, fontWeight: 700, fontSize: 44, color: CREAM, letterSpacing: 2 }}>Jyotiq</div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: CREAM, fontSize: 34, fontWeight: 600, marginRight: 30 }}>
          <svg viewBox="0 0 24 24" width={36} height={36}>
            <path d={ICONS.flame} fill="#E0A63E" />
          </svg>
          {flames}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 26,
          top: 230,
          maxWidth: 600,
          padding: "26px 32px",
          borderRadius: "32px 32px 8px 32px",
          background: "linear-gradient(160deg, #E8CD82, #C9A44E)",
          color: "#1A1206",
          fontSize: 37,
          fontWeight: 600,
          lineHeight: 1.38,
          boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
          transform: `translateY(${(1 - flyIn) * 760}px) scale(${0.86 + 0.14 * flyIn})`,
          transformOrigin: "100% 100%",
          opacity: Math.min(1, flyIn * 3),
        }}
      >
        {question}
      </div>
      {reply > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 26,
            top: 448,
            padding: "24px 32px",
            borderRadius: "32px 32px 32px 8px",
            background: "#1E1A14",
            border: "2px solid #4A3F2B",
            display: "flex",
            alignItems: "center",
            gap: 18,
            color: CREAM,
            fontSize: 35,
            opacity: Math.min(1, reply * 1.5),
            transform: `translateY(${(1 - reply) * 30}px)`,
          }}
        >
          <Img src={staticFile("jyotiq/logo-icon.png")} style={{ width: 62, height: 51 }} />
          <span style={{ fontStyle: "italic", color: "#C9B78A" }}>Aligning the stars</span>
          <span style={{ display: "flex", gap: 8 }}>
            {dots.map((o, i) => (
              <span key={i} style={{ width: 12, height: 12, borderRadius: 6, background: GOLD, opacity: o }} />
            ))}
          </span>
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 16, top: 1340, width: 692, height: 110, borderRadius: 26, background: "#1E1A14", border: "2.5px solid #4A3F2B", boxSizing: "border-box", color: MUTED, fontSize: 31, display: "flex", alignItems: "center", paddingLeft: 26 }}>
        Type your question...
      </div>
      <SysNav top={1470} bg="#000000" />
    </AbsoluteFill>
  );
};
