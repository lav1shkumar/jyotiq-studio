import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, easeInOut, easeOut, lerp, pop, prog } from "../motion";
import { SANS, SERIF } from "../theme";
import { sparklePath } from "./anime";
import { ChatScreen, HomeScreen, sendCenterDev } from "./appScreens";
import { dev, FingersFront, K, PalmBack, PhoneFrame, Ripple, Thumb } from "./phoneKit";
import { PlayStoreScreen, SplashScreen } from "./playStore";
import { LOGO } from "./s5Ball";

/* ================================================================== */
/* S6  reel 624-868. A hand brings the phone up; the JYOTIQ logo from  */
/* S5 drops into the Play Store result (match cut). Install on 19.28 s,*/
/* "Open" on 20.09 s, tap Open, splash, home, tap the ask box on       */
/* 22.89 s, the question types, send on 24.37 s, chat thread.          */
/*   local h = reel frame - 624                                         */
/* ================================================================== */

const H = {
  install: 62,
  dlEnd: 87,
  open: 108,
  splash: 110,
  home: 150,
  input: 173,
  typeFrom: 176,
  typeTo: 212,
  send: 215,
};

type Cam = { h: number; x: number; y: number; z: number };
const CAMS: Cam[] = [
  { h: 0, x: 540, y: 960, z: 1 },
  { h: 50, x: 540, y: 960, z: 1 },
  { h: 64, x: 560, y: 830, z: 1.62 },
  { h: 110, x: 560, y: 830, z: 1.62 },
  { h: 130, x: 540, y: 960, z: 1 },
  { h: 176, x: 540, y: 960, z: 1 },
  { h: 190, x: 540, y: 1150, z: 1.4 },
  { h: 216, x: 540, y: 1150, z: 1.4 },
  { h: 236, x: 540, y: 905, z: 1.14 },
];
const camAt = (h: number) => {
  if (h <= CAMS[0].h) return CAMS[0];
  for (let i = 1; i < CAMS.length; i++) {
    if (h < CAMS[i].h) {
      const a = CAMS[i - 1];
      const b = CAMS[i];
      const t = easeInOut((h - a.h) / (b.h - a.h));
      return { h, x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), z: lerp(a.z, b.z, t) };
    }
  }
  return CAMS[CAMS.length - 1];
};

type Pt = { x: number; y: number };
type Pose = { h: number; B: Pt; T: Pt; press?: number };
const p = (x: number, y: number): Pt => ({ x, y });
const REST: [Pt, Pt] = [p(968, 1830), p(790, 1470)];
const AWAY_R: [Pt, Pt] = [p(1250, 1050), p(1010, 900)];
const HIDE: [Pt, Pt] = [p(1010, 2350), p(900, 1960)];
const INSTALL_T = dev(534, 356);
const OPEN_T = dev(583, 356);
const INPUT_T = dev(580, 1053);
const SEND_T = dev(sendCenterDev(1).x, sendCenterDev(1).y);
const pose = (h: number, [B, T]: [Pt, Pt], press = 0): Pose => ({ h, B, T, press });
const POSES: Pose[] = [
  pose(0, REST),
  pose(54, REST),
  pose(60, [p(998, 1009), p(INSTALL_T.x, INSTALL_T.y - 14)]),
  pose(62, [p(998, 1009), INSTALL_T], 1),
  pose(64, [p(998, 1009), INSTALL_T]),
  pose(72, AWAY_R),
  pose(100, AWAY_R),
  pose(106, [p(1010, 1015), p(OPEN_T.x, OPEN_T.y - 14)]),
  pose(108, [p(1010, 1015), OPEN_T], 1),
  pose(110, [p(1010, 1015), OPEN_T]),
  pose(120, REST),
  pose(166, REST),
  pose(171, [REST[0], p(INPUT_T.x, INPUT_T.y - 14)]),
  pose(173, [REST[0], INPUT_T], 1),
  pose(175, [REST[0], INPUT_T]),
  pose(182, HIDE),
  pose(207, HIDE),
  pose(213, [p(1047, 1536), p(SEND_T.x, SEND_T.y - 14)]),
  pose(215, [p(1047, 1536), SEND_T], 1),
  pose(217, [p(1047, 1536), SEND_T]),
  pose(226, HIDE),
];
const thumbAt = (h: number) => {
  if (h <= POSES[0].h) return { B: POSES[0].B, T: POSES[0].T, press: 0 };
  for (let i = 1; i < POSES.length; i++) {
    if (h < POSES[i].h) {
      const a = POSES[i - 1];
      const b = POSES[i];
      const t = easeInOut((h - a.h) / (b.h - a.h));
      return { B: p(lerp(a.B.x, b.B.x, t), lerp(a.B.y, b.B.y, t)), T: p(lerp(a.T.x, b.T.x, t), lerp(a.T.y, b.T.y, t)), press: lerp(a.press ?? 0, b.press ?? 0, t) };
    }
  }
  const last = POSES[POSES.length - 1];
  return { B: last.B, T: last.T, press: 0 };
};

const ICON_W = dev(80, 356);
const ICON_LOGO_H = 112 * 0.88 * K;

const Kicker: React.FC<{ children: React.ReactNode; o: number; top: number }> = ({ children, o, top }) =>
  o > 0.001 ? (
    <div style={{ position: "absolute", left: 60, right: 60, top, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: Math.min(1, o), transform: `translateY(${(1 - Math.min(1, o)) * 24}px)` }}>{children}</div>
  ) : null;

export const S6Phone: React.FC<{ question: string; userName: string; showName: string }> = ({ question, userName, showName }) => {
  const h = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rise = spring({ frame: h, fps, config: { damping: 15, stiffness: 110, mass: 0.9 } });
  const riseY = 1350 * (1 - rise);
  const riseRot = -8 * (1 - rise);
  const cam = camAt(h);
  const th = thumbAt(h);

  // install
  const phase = h < H.install + 1 ? "idle" : h < H.dlEnd ? "downloading" : "done";
  const dl = easeInOut(prog(h, H.install + 1, H.dlEnd - 1, (x) => x));
  const doneGlow = h >= H.dlEnd ? Math.exp(-(h - H.dlEnd) / 7) : 0;
  const press = (at: number) => (h >= at - 1 && h < at + 2 ? 1 : 0);

  // app open: icon rect expands to the full screen
  const ex = easeInOut(prog(h, H.splash, H.splash + 11, (x) => x));
  const clipT = lerp(300, 0, ex);
  const clipL = lerp(24, 0, ex);
  const clipR = lerp(724 - 136, 0, ex);
  const clipB = lerp(1568 - 412, 0, ex);
  const clipRad = lerp(26, 0, ex);
  const homeIn = prog(h, H.home, H.home + 6);

  // typing
  const kb = easeOut(prog(h, H.input + 1, H.input + 10, (x) => x));
  const nTyped = Math.round(interpolate(h, [H.typeFrom, H.typeTo], [0, question.length], clamp));
  const typed = question.slice(0, nTyped);
  const perChar = (H.typeTo - H.typeFrom) / Math.max(1, question.length);
  const litChar = nTyped > 0 && h <= H.typeTo + 1 ? question[nTyped - 1] : "";
  const lit = litChar ? 1 - ((h - H.typeFrom) / perChar - (nTyped - 1)) * 0.8 : 0;
  const chatIn = prog(h, H.send + 1, H.send + 6);
  const flyIn = easeOut(prog(h, H.send + 1, H.send + 13, (x) => x));
  const reply = prog(h, H.send + 13, H.send + 19);

  // logo match cut from S5 into the store icon
  const lf = easeInOut(prog(h, 0, 26, (x) => x));
  const target = { x: ICON_W.x, y: ICON_W.y + riseY };
  const lgx = lerp(LOGO.cx, target.x, lf);
  const lgy = lerp(LOGO.cy, target.y, lf);
  const lgh = lerp(LOGO.h, ICON_LOGO_H, lf);

  const k1 = prog(h, 26, 36) * (1 - prog(h, 50, 58));
  const k2 = prog(h, H.home + 4, H.home + 14);
  const k2b = pop(h, fps, H.home + 12, 12);

  const screen = (
    <>
      {h < H.splash + 12 ? <PlayStoreScreen phase={phase} dl={dl} installPress={press(H.install)} openPress={press(H.open)} doneGlow={doneGlow} showIcon={h >= 26} /> : null}
      {h >= H.splash && h < H.home + 6 ? (
        <AbsoluteFill style={{ clipPath: `inset(${clipT}px ${clipR}px ${clipB}px ${clipL}px round ${clipRad}px)`, opacity: 1 - homeIn }}>
          <SplashScreen t={h - H.splash} />
        </AbsoluteFill>
      ) : null}
      {h >= H.home && h < H.send + 6 ? (
        <AbsoluteFill style={{ opacity: homeIn }}>
          <HomeScreen
            t={h}
            name={userName}
            flames={1}
            typed={typed}
            caret={h >= H.input + 2 && h < H.send + 1}
            focus={prog(h, H.input, H.input + 6)}
            kb={h > H.send ? 1 - prog(h, H.send, H.send + 6) : kb}
            litChar={litChar}
            lit={Math.max(0, lit)}
            sendPress={press(H.send)}
            sendGlow={h >= H.typeTo ? Math.min(1, prog(h, H.typeTo, H.typeTo + 3)) * (h < H.send + 6 ? 1 : 0) : 0}
          />
        </AbsoluteFill>
      ) : null}
      {h >= H.send + 1 ? (
        <AbsoluteFill style={{ opacity: chatIn }}>
          <ChatScreen t={h} question={question} flyIn={flyIn} reply={reply} flames={1} />
        </AbsoluteFill>
      ) : null}
    </>
  );

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${(540 - cam.x * cam.z).toFixed(2)}px, ${(960 - cam.y * cam.z).toFixed(2)}px) scale(${cam.z.toFixed(4)})`, transformOrigin: "0 0" }}>
        <AbsoluteFill style={{ transform: `translateY(${riseY.toFixed(2)}px) rotate(${riseRot.toFixed(3)}deg)`, transformOrigin: "540px 1900px" }}>
          <PalmBack />
          <PhoneFrame>{screen}</PhoneFrame>
          <FingersFront />
          {[H.install, H.open, H.input, H.send].map((at) => {
            const tgt = at === H.install ? INSTALL_T : at === H.open ? OPEN_T : at === H.input ? INPUT_T : SEND_T;
            return <Ripple key={at} x={tgt.x} y={tgt.y} t={h - at} />;
          })}
          <Thumb B={th.B} T={th.T} press={th.press} w={110} />
        </AbsoluteFill>
      </AbsoluteFill>

      {/* JYOTIQ logo flying from the S5 end card into the Play Store icon */}
      {h < 26 ? (
        <div style={{ position: "absolute", left: lgx - (lgh * 444) / 511 / 2, top: lgy - lgh / 2, width: (lgh * 444) / 511, height: lgh, filter: `drop-shadow(0 0 ${30 * (1 - lf)}px rgba(223,177,91,0.6))` }}>
          <Img src={staticFile("jyotiq/logo-full.png")} style={{ width: "100%", height: "100%" }} />
        </div>
      ) : null}
      {h >= 25 && h < 40 ? (
        <svg width={160} height={160} viewBox="-80 -80 160 160" style={{ position: "absolute", left: target.x - 80, top: target.y - 80, opacity: 1 - prog(h, 28, 40), transform: `scale(${0.6 + prog(h, 25, 34)}) rotate(${h * 6}deg)`, overflow: "visible" }}>
          <path d={sparklePath(64)} fill="#FFF3D0" style={{ filter: "drop-shadow(0 0 10px #FFD45A)" }} />
        </svg>
      ) : null}

      {k2 * prog(cam.z, 1.02, 1.2, (x) => x) > 0.001 ? (
        <AbsoluteFill
          style={{
            background: "linear-gradient(180deg, rgba(10,8,5,0.96) 0px, rgba(10,8,5,0.9) 470px, rgba(10,8,5,0) 660px)",
            opacity: k2 * prog(cam.z, 1.02, 1.2, (x) => x),
          }}
        />
      ) : null}
      <Kicker o={k1} top={330}>
        <div style={{ padding: "14px 30px", borderRadius: 22, background: "rgba(12,10,7,0.86)", border: "2px solid #DFB15B66", display: "flex", alignItems: "center", gap: 16, fontFamily: SANS, fontWeight: 700, fontSize: 44, color: "#F5ECDD" }}>
          <svg viewBox="0 0 24 24" width={46} height={46}>
            <path d="M5 3.5v17l14-8.5z" fill="#DFB15B" />
          </svg>
          Search <span style={{ color: "#DFB15B" }}>JYOTIQ</span> on Play Store
        </div>
      </Kicker>
      <Kicker o={k2} top={276}>
        <div
          style={{
            padding: "12px 30px",
            borderRadius: 999,
            background: "linear-gradient(90deg, #DFB15B, #FE9A00)",
            color: "#1A1206",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 38,
            letterSpacing: 1,
            boxShadow: "0 10px 30px rgba(254,154,0,0.35)",
            transform: `scale(${0.85 + 0.15 * Math.min(1, k2b)})`,
          }}
        >
          🔥 1st CONSULTATION FREE
        </div>
        <div style={{ textAlign: "center", fontFamily: SERIF, fontWeight: 700, fontSize: 54, lineHeight: 1.1, letterSpacing: -0.5, color: "#F5ECDD", textShadow: "0 4px 18px rgba(0,0,0,0.85)", opacity: Math.min(1, k2b * 1.4) }}>
          Ask your favourite {showName}
          <br />
          contestant&apos;s <span style={{ color: "#DFB15B", fontStyle: "italic" }}>kundali</span>
        </div>
      </Kicker>
    </AbsoluteFill>
  );
};
