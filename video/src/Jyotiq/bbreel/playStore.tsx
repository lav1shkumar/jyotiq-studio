import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { SANS } from "../theme";
import { CORMORANT } from "./fonts";

/* Device-px (724 x 1568) rebuilds of Ayush's phone screenshots: the Play
   Store search result for "jyotiq" and the Jyotiq splash. Status bar is a
   clean one (no notifications, full battery); no "Did you mean" line and no
   third-party "Limited-time events" row. */

export const Ic: React.FC<{ d: string; x: number; y: number; size: number; color: string }> = ({ d, x, y, size, color }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{ position: "absolute", left: x - size / 2, top: y - size / 2 }}>
    <path d={d} fill={color} />
  </svg>
);

export const ICONS = {
  back: "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z",
  search: "M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
  mic: "M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z",
  check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
  caret: "M7 10l5 5 5-5z",
  download: "M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z",
  star: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
  games: "M21.58 16.09l-1.09-7.66A3.996 3.996 0 0016.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.27 1.8-.75L9 16h6l2.25 2.25c.48.48 1.13.75 1.8.75 1.56 0 2.75-1.37 2.53-2.91zM11 11H9v2H8v-2H6v-1h2V8h1v2h2v1zm4-1c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z",
  apps: "M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z",
  book: "M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z",
  person: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
  home: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
  chat: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z",
  sparkle: "M9 2l1.8 5.2L16 9l-5.2 1.8L9 16l-1.8-5.2L2 9l5.2-1.8L9 2zm9 9l.9 2.6L21.5 14.5l-2.6.9L18 18l-.9-2.6-2.6-.9 2.6-.9L18 11z",
  up: "M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z",
  flame: "M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z",
  calendar: "M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7z",
};

/** Clean Android status bar, 80 device px. */
export const StatusBar: React.FC<{ time?: string; color?: string }> = ({ time = "10:30", color = "#F2F2F2" }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 724, height: 80, fontFamily: SANS, color }}>
    <div style={{ position: "absolute", left: 40, top: 22, fontSize: 30, fontWeight: 600 }}>{time}</div>
    <svg viewBox="0 0 120 30" width={150} height={38} style={{ position: "absolute", right: 34, top: 22 }}>
      <path d="M2 11 Q14 1 26 11 L23 14 Q14 6 5 14 Z M8 17 Q14 12 20 17 L14 23 Z" fill={color} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={36 + i * 7} y={22 - i * 5} width={5} height={6 + i * 5} rx={1} fill={color} />
      ))}
      <rect x={72} y={4} width={42} height={22} rx={8} fill="none" stroke={color} strokeWidth={2.4} />
      <rect x={76} y={8} width={30} height={14} rx={4} fill={color} />
      <rect x={115} y={11} width={3} height={8} rx={1} fill={color} />
    </svg>
  </div>
);

/** Three-button Android nav bar. */
export const SysNav: React.FC<{ top: number; bg: string; down?: boolean }> = ({ top, bg, down }) => (
  <div style={{ position: "absolute", left: 0, top, width: 724, height: 1568 - top, background: bg }}>
    <svg viewBox="0 0 724 78" width={724} height={78} style={{ position: "absolute", left: 0, top: 0 }}>
      <g fill="none" stroke="#D8D8D8" strokeWidth={4} strokeLinecap="round">
        <path d="M150 26v26M162 26v26M174 26v26" />
        <rect x={340} y={21} width={42} height={36} rx={14} />
        {down ? <path d="M548 32l18 16 18-16" /> : <path d="M574 24l-18 15 18 15" />}
      </g>
    </svg>
  </div>
);

export const AppIcon: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.23, background: "radial-gradient(circle at 50% 40%, #1C1712, #070605 75%)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
    <Img src={staticFile("jyotiq/logo-full.png")} style={{ height: size * 0.88, width: (size * 0.88 * 444) / 511 }} />
  </div>
);

export type InstallPhase = "idle" | "downloading" | "done";

/** Play Store "jyotiq" search result. dl = 0..1 download progress. */
export const PlayStoreScreen: React.FC<{ phase: InstallPhase; dl: number; installPress: number; openPress: number; doneGlow: number; showIcon: boolean }> = ({
  phase,
  dl,
  installPress,
  openPress,
  doneGlow,
  showIcon,
}) => {
  const fg = "#E3E3E3";
  const sub = "#C4C7C5";
  const blue = "#A8C7FA";
  const ringR = 66;
  const circ = 2 * Math.PI * ringR;
  const mb = (12 * dl).toFixed(1);
  return (
    <AbsoluteFill style={{ background: "#131314", fontFamily: SANS }}>
      <StatusBar />
      {/* search row */}
      <Ic d={ICONS.back} x={58} y={123} size={44} color={fg} />
      <div style={{ position: "absolute", left: 108, top: 102, fontSize: 34, color: fg }}>jyotiq</div>
      <Ic d={ICONS.search} x={572} y={123} size={46} color={fg} />
      <Ic d={ICONS.mic} x={666} y={123} size={46} color={fg} />
      {/* filter chip */}
      <div style={{ position: "absolute", left: 24, top: 192, height: 64, padding: "0 22px", borderRadius: 16, background: "#004A77", color: "#C2E7FF", fontSize: 30, fontWeight: 500, display: "flex", alignItems: "center", gap: 12 }}>
        <svg viewBox="0 0 24 24" width={34} height={34}>
          <path d={ICONS.check} fill="#C2E7FF" />
        </svg>
        This device
        <svg viewBox="0 0 24 24" width={34} height={34}>
          <path d={ICONS.caret} fill="#C2E7FF" />
        </svg>
      </div>
      {/* app row */}
      <div style={{ position: "absolute", left: 24, top: 300, width: 112, height: 112 }}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${phase === "downloading" ? 0.78 : 1})`, transition: "none" }}>{showIcon ? <AppIcon size={112} /> : null}</div>
        {phase === "downloading" ? (
          <svg width={150} height={150} viewBox="0 0 150 150" style={{ position: "absolute", left: -19, top: -19 }}>
            <circle cx={75} cy={75} r={ringR} fill="none" stroke="#303134" strokeWidth={6} />
            <circle cx={75} cy={75} r={ringR} fill="none" stroke={blue} strokeWidth={6} strokeLinecap="round" strokeDasharray={`${circ * dl} ${circ}`} transform="rotate(-90 75 75)" />
          </svg>
        ) : null}
        {doneGlow > 0 ? <div style={{ position: "absolute", inset: -20, borderRadius: 40, boxShadow: `0 0 ${50 * doneGlow}px ${blue}`, opacity: doneGlow }} /> : null}
      </div>
      <div style={{ position: "absolute", left: 160, top: 316, fontSize: 31, fontWeight: 500, color: fg, letterSpacing: 0.5 }}>JYOTIQ</div>
      <div style={{ position: "absolute", left: 160, top: 360, fontSize: 26, color: sub }}>{phase === "downloading" ? (dl < 0.94 ? `${mb} MB of 12 MB` : "Installing…") : "Astroraaga"}</div>
      {phase === "idle" ? (
        <>
          <div
            style={{
              position: "absolute",
              left: 467,
              top: 316,
              width: 134,
              height: 80,
              borderRadius: "40px 10px 10px 40px",
              background: blue,
              color: "#062E6F",
              fontSize: 31,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${1 - 0.06 * installPress})`,
              filter: installPress > 0 ? `brightness(${1 + 0.25 * installPress})` : undefined,
            }}
          >
            Install
          </div>
          <div style={{ position: "absolute", left: 605, top: 316, width: 94, height: 80, borderRadius: "10px 40px 40px 10px", background: blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 24 24" width={44} height={44}>
              <path d={ICONS.caret} fill="#062E6F" />
            </svg>
          </div>
          <div style={{ position: "absolute", left: 497, top: 406, fontSize: 21, color: sub }}>In-app purchases</div>
        </>
      ) : (
        <div
          style={{
            position: "absolute",
            left: 467,
            top: 316,
            width: 232,
            height: 80,
            borderRadius: 40,
            background: phase === "done" ? blue : "transparent",
            border: phase === "done" ? "none" : `2.5px solid #8E918F`,
            boxSizing: "border-box",
            color: phase === "done" ? "#062E6F" : blue,
            fontSize: 31,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${1 - 0.06 * openPress})`,
          }}
        >
          {phase === "done" ? "Open" : "Cancel"}
        </div>
      )}
      {/* rating row */}
      <div style={{ position: "absolute", left: 0, top: 470, width: 724, height: 80, display: "flex", alignItems: "center", color: fg }}>
        {[
          { top: <>5.0 <span style={{ fontSize: 24 }}>★</span></>, bot: "9 reviews" },
          { top: <span style={{ border: `2.5px solid ${fg}`, borderRadius: 4, padding: "0 6px", fontSize: 26, fontWeight: 700 }}>3+</span>, bot: "Rated for 3+ ⓘ" },
          { top: <svg viewBox="0 0 24 24" width={36} height={36}><path d={ICONS.download} fill={fg} /></svg>, bot: "12 MB" },
        ].map((c, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, borderLeft: i ? "2px solid #444746" : undefined }}>
            <div style={{ fontSize: 30, fontWeight: 600, height: 40, display: "flex", alignItems: "center" }}>{c.top}</div>
            <div style={{ fontSize: 24, color: sub }}>{c.bot}</div>
          </div>
        ))}
      </div>
      {/* the store screenshots, cropped from Ayush's screen capture */}
      <Img src={staticFile("jyotiq/bbreel/play-shots.png")} style={{ position: "absolute", left: 24, top: 586, width: 700, height: 342 }} />
      <div style={{ position: "absolute", left: 28, top: 958, width: 670, fontSize: 28, lineHeight: 1.4, color: fg }}>Ask anything for deep clarity rooted in ancient rule-based astrological logic.</div>
      {/* bottom nav */}
      <div style={{ position: "absolute", left: 0, top: 1372, width: 724, height: 118, background: "#1E1F20", display: "flex", justifyContent: "space-around", alignItems: "center", color: sub, fontSize: 22 }}>
        {[
          ["Games", ICONS.games],
          ["Apps", ICONS.apps],
          ["Search", ICONS.search],
          ["Books", ICONS.book],
          ["You", ICONS.person],
        ].map(([label, d], i) => (
          <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: i === 2 ? "#C2E7FF" : sub, fontWeight: i === 2 ? 700 : 500 }}>
            <div style={{ width: 96, height: 50, borderRadius: 25, background: i === 2 ? "#004A77" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 24 24" width={38} height={38}>
                <path d={d} fill={i === 2 ? "#C2E7FF" : sub} />
              </svg>
            </div>
            {label}
          </div>
        ))}
      </div>
      <SysNav top={1490} bg="#1E1F20" />
    </AbsoluteFill>
  );
};

/** Jyotiq splash, `t` = frames since it appeared. */
export const SplashScreen: React.FC<{ t: number }> = ({ t }) => {
  const a = Math.min(1, t / 8);
  const dots = ".".repeat(1 + (Math.floor(t / 5) % 3));
  const breathe = 1 + 0.03 * Math.sin(t / 5);
  return (
    <AbsoluteFill style={{ background: "#15120E", fontFamily: SANS }}>
      <StatusBar />
      {[170, 230, 300].map((r, i) => (
        <div key={r} style={{ position: "absolute", left: 362 - r, top: 640 - r, width: r * 2, height: r * 2, borderRadius: "50%", border: "2px solid #2A231A", opacity: (0.9 - i * 0.25) * a, transform: `scale(${0.92 + 0.08 * a + 0.02 * Math.sin(t / 6 + i)})` }} />
      ))}
      <div style={{ position: "absolute", left: 362 - 130, top: 640 - 107, width: 260, height: 214, transform: `scale(${(0.85 + 0.15 * a) * breathe})`, filter: `drop-shadow(0 0 ${24 + 10 * Math.sin(t / 5)}px rgba(220,170,90,0.35))` }}>
        <Img src={staticFile("jyotiq/logo-icon.png")} style={{ width: 260, height: 214 }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 892, textAlign: "center", fontFamily: CORMORANT, fontWeight: 600, fontSize: 68, letterSpacing: 26, paddingLeft: 26, color: "#A8935C", opacity: a }}>JYOTIQ</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 988, textAlign: "center", fontSize: 27, letterSpacing: 1, color: "#6A6050", opacity: a }}>Vedic Wisdom, Modern Clarity</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1060, textAlign: "center", fontSize: 30, color: "#A08A55", opacity: Math.min(1, Math.max(0, (t - 6) / 6)) }}>
        Aligning your stars{dots}
      </div>
      <SysNav top={1470} bg="#000000" />
    </AbsoluteFill>
  );
};
