import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caret, clamp, DirBlur, easeIn, easeInOut, easeOut, Glint, Hand, lerp, pop, prog, Star5, typed } from "./motion";
import { Lines, RCX, RCY } from "./reelKit";
import { SANS, SERIF, useTheme } from "./theme";
import { CatId, FeatureCard, LogoIcon, LogoWordmark } from "./ui";
import {
  BubbleUser,
  CHAT_M,
  ChatHomeMobile,
  DASH,
  DASH_BTN,
  DASH_CH,
  DASH_CW,
  dashCard,
  DashboardMobile,
  HorizonBubbleMobile,
  HZ_CHIP,
  sendCenter,
  tabCenter,
  TypingBubble,
} from "./uiReel";

/* 9:16 Reel, beats R5-R8 (local frames; see reelA.tsx for the beat grid). */

const center: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const TY = 930;

/* ================================================================== */
/* R5  15.5 - 21.0 s  feed scroll -> pull back to the dashboard ->     */
/*                    push into Career, tap View Remedy -> scatter      */
/* ================================================================== */

const TARGET: CatId = "career";
const TC = dashCard(0, 1);
const TCX = TC.x + DASH_CW / 2;
const TCY = TC.y + DASH_CH / 2;
const S0 = 2.0;
const scrollOff = (f: number) => interpolate(f, [0, 24], [1500, 0], { ...clamp, easing: easeOut });

export const R5Tour: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();

  const a = prog(f, 30, 51, easeInOut); // pull back
  const b = prog(f, 56, 80, easeInOut); // push into Career
  const out = prog(f, 86, 96, easeIn);
  const off = scrollOff(f);
  const vel = Math.abs(off - scrollOff(f - 1));

  const s = lerp(lerp(S0, 0.94, a), 2.25, b) * (1 + 0.35 * out);
  const px = lerp(lerp(TCX, DASH.w / 2, a), TCX - 30, b);
  const py = lerp(lerp(TCY + off / S0, DASH.h / 2, a), TCY + 40, b);
  const rx = lerp(lerp(0, 12, a), 6, b);
  const ry = lerp(lerp(0, -12, a), -6, b);
  const rz = lerp(lerp(0, 2.5, a), 1.2, b);

  // cursor in dashboard coordinates (rides with the camera)
  const btn = { x: TC.x + DASH_BTN.dx, y: TC.y + DASH_BTN.dy };
  const cm = prog(f, 58, 74, easeOut);
  const hx = lerp(TC.x + 420, btn.x + 4, cm);
  const hy = lerp(TC.y + 560, btn.y + 4, cm);
  const press = interpolate(f, [76, 79, 83], [0, 1, 0], clamp);
  const ripple = interpolate(f, [78, 92], [0, 1], clamp);
  const lit = prog(f, 78, 84);

  const scatterTargets: { id: CatId; x: number; y: number; rz: number; ry: number }[] = [
    { id: "love", x: 250, y: 410, rz: -9, ry: 18 },
    { id: "career", x: 830, y: 390, rz: 8, ry: -18 },
    { id: "wealth", x: 245, y: 1490, rz: 7, ry: 16 },
    { id: "health", x: 835, y: 1505, rz: -8, ry: -16 },
  ];
  const lineOut = prog(f, 158, 165, easeIn);

  return (
    <AbsoluteFill>
      {f < 97 ? (
        <AbsoluteFill style={{ perspective: 2400, perspectiveOrigin: `${RCX}px ${RCY}px`, opacity: 1 - out, filter: `blur(${out * 16}px)` }}>
          <DirBlur
            y={Math.min(32, vel * 0.45)}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: DASH.w,
              height: DASH.h,
              transformOrigin: "0 0",
              transformStyle: "preserve-3d",
              transform: `translate(${RCX}px, ${RCY}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s}) translate(${-px}px, ${-py}px)`,
            }}
          >
            <DashboardMobile target={TARGET} highlight={lit} press={press} />
            {f >= 58 ? (
              <div style={{ position: "absolute", left: hx, top: hy, transform: `scale(${1 / s})`, transformOrigin: "0 0" }}>
                <Hand x={0} y={0} press={press} ripple={ripple} size={88} />
              </div>
            ) : null}
          </DirBlur>
        </AbsoluteFill>
      ) : null}

      {f >= 88 ? (
        <AbsoluteFill style={{ perspective: 1800, opacity: 1 - lineOut, filter: `blur(${lineOut * 10}px)` }}>
          {scatterTargets.map((c, i) => {
            const cfg = { damping: 16, stiffness: 110, mass: 0.9 };
            const p = spring({ frame: f - 88 - i * 2, fps, config: cfg });
            const p1 = spring({ frame: f - 89 - i * 2, fps, config: cfg });
            const drift = (f - 104) * 0.35;
            const x = lerp(RCX, c.x + (c.x < RCX ? -drift : drift), p);
            const y = lerp(TY, c.y + (c.y < TY ? -drift * 0.5 : drift * 0.5), p);
            const dx = Math.abs((c.x - RCX) * (p - p1));
            const dy = Math.abs((c.y - TY) * (p - p1));
            return (
              <DirBlur
                key={c.id}
                x={Math.min(30, dx * 0.35)}
                y={Math.min(30, dy * 0.35)}
                style={{
                  position: "absolute",
                  left: x - 180,
                  top: y - 140,
                  width: 360,
                  height: 280,
                  transform: `rotateY(${c.ry * p}deg) rotateZ(${c.rz * p}deg) scale(${lerp(0.55, 1.15, p)})`,
                  opacity: Math.min(1, p * 3),
                }}
              >
                <FeatureCard id={c.id} />
              </DirBlur>
            );
          })}
          <div style={{ ...center, top: TY - RCY, bottom: RCY - TY }}>
            <Lines
              lines={[
                { size: 150, words: [{ t: "Across", at: 104, color: t.gold }] },
                {
                  size: 150,
                  words: [
                    { t: "your", at: 108, color: t.gold },
                    { t: "life.", at: 113, color: t.text },
                  ],
                },
              ]}
            />
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* R6  21.0 - 25.3 s  the real ask flow from Ayush's screenshots:       */
/*     General tab -> tap LOVE -> type "When will I get married?" ->   */
/*     gold send -> Jyotiq asks the horizon -> tap "Upto 1 Year" ->    */
/*     "Your reading is ready"                                          */
/* ================================================================== */

const QUESTION = "When will I get married?";
const WIN_L = RCX - CHAT_M.w / 2;
const WIN_T = 290;
const LOVE = tabCenter(1);
const SEND = sendCenter(CHAT_M.w);

// thread layer (screen coordinates before the slow push-in); centred on the frame
const USER_T = 710;
const HB_L = 60;
const HB_T = 880;
const XF_O = { x: 540, y: 1000 };
const threadScale = (f: number) => lerp(0.97, 1.07, prog(f, 54, 104, easeInOut));
const toScreen = (x: number, y: number, s: number) => ({ x: XF_O.x + (x - XF_O.x) * s, y: XF_O.y + (y - XF_O.y) * s });
const BTN_W = 860;
const BTN_H = 140;

export const R6Aha: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();

  const drop = spring({ frame: f, fps, config: { damping: 15, stiffness: 95, mass: 0.9 } });
  const chatOut = prog(f, 53, 62, easeIn);

  // tap LOVE on the beat (local 18.4): the subtitle + suggestions swap to Love
  const swap = prog(f, 18, 26, easeOut);
  const tabGlow = interpolate(f, [18, 22, 44], [0, 1, 0.35], clamp);
  const text = typed(QUESTION, f, 25, 1.4);
  const sendGlow = interpolate(f, [25, 28], [0, 1], clamp);

  // hand (window coordinates, so it rides the window's tilt); taps the right side of
  // the LOVE tile and the send button so their labels stay readable
  const m1 = prog(f, 5, 16, easeOut);
  const m2 = prog(f, 27, 44, easeInOut);
  const hx = lerp(lerp(1080, LOVE.x + 52, m1), SEND.x + 6, m2);
  const hy = lerp(lerp(1250, LOVE.y - 8, m1), SEND.y + 8, m2);
  const press1 = interpolate(f, [16, 19, 23], [0, 1, 0], clamp);
  const press2 = interpolate(f, [46, 49, 53], [0, 1, 0], clamp);
  const ripple = f < 40 ? interpolate(f, [18, 32], [0, 1], clamp) : interpolate(f, [48, 62], [0, 1], clamp);

  // thread
  const ts = threadScale(f);
  const threadIn = prog(f, 54, 64);
  const threadOut = prog(f, 99, 111, easeIn);
  const chip = toScreen(HB_L + HZ_CHIP.x, HB_T + HZ_CHIP.y, ts);
  const c2 = prog(f, 72, 89, easeOut);
  // fingertip on the right end of "Upto 1 Year" so the label stays readable
  const tapX = chip.x + 58;
  const tapY = chip.y + 14;
  const h2x = lerp(1060, tapX, c2);
  const h2y = lerp(1720, tapY, c2);
  const press3 = interpolate(f, [91, 94, 98], [0, 1, 0], clamp);
  const ripple3 = interpolate(f, [93, 107], [0, 1], clamp);

  // chip -> success button (starts at the chip's pressed size, so the hand-off is seamless)
  const m = prog(f, 97, 118, easeInOut);
  const pressScale = 1 - 0.08 * press3;
  const mw = lerp(HZ_CHIP.w * ts * pressScale, BTN_W, m);
  const mh = lerp(HZ_CHIP.h * ts * pressScale, BTN_H, m);
  const mx = lerp(chip.x, RCX, m);
  const my = lerp(chip.y, RCY, m);

  return (
    <AbsoluteFill>
      {f < 63 ? (
        <AbsoluteFill style={{ perspective: 2200, opacity: 1 - chatOut, filter: `blur(${chatOut * 14}px)` }}>
          <div
            style={{
              position: "absolute",
              left: WIN_L,
              top: WIN_T,
              width: CHAT_M.w,
              height: CHAT_M.h,
              transform: `translateY(${lerp(-1900, 0, drop)}px) rotateX(${lerp(48, 7, drop)}deg) rotateY(-6deg) rotateZ(-1.5deg) scale(${0.94 * (1 + 0.18 * chatOut)})`,
            }}
          >
            <ChatHomeMobile
              from="general"
              to="love"
              swap={swap}
              text={text}
              caret={f >= 25 && f < 52}
              sendGlow={sendGlow}
              sendPress={press2}
              tabGlow={tabGlow}
            />
            {f >= 5 && f < 57 ? (
              <Hand x={hx} y={hy} press={Math.max(press1, press2)} ripple={ripple} opacity={1 - prog(f, 51, 57)} size={88} />
            ) : null}
          </div>
        </AbsoluteFill>
      ) : null}

      {f >= 54 && f < 112 ? (
        <AbsoluteFill style={{ opacity: threadIn * (1 - threadOut), filter: `blur(${(1 - threadIn) * 12 + threadOut * 12}px)` }}>
          <AbsoluteFill style={{ transform: `scale(${ts})`, transformOrigin: `${XF_O.x}px ${XF_O.y}px` }}>
            <div
              style={{
                position: "absolute",
                right: 90,
                top: USER_T,
                opacity: prog(f, 54, 60),
                transform: `translateY(${(1 - prog(f, 54, 62, easeOut)) * 60}px)`,
              }}
            >
              <BubbleUser text={QUESTION} />
            </div>
            {f >= 59 && f < 68 ? (
              <div style={{ position: "absolute", left: HB_L, top: HB_T, opacity: prog(f, 59, 62) * (1 - prog(f, 65, 68)) }}>
                <TypingBubble frame={f} />
              </div>
            ) : null}
            <div
              style={{
                position: "absolute",
                left: HB_L,
                top: HB_T,
                opacity: prog(f, 65, 71),
                transform: `translateY(${(1 - prog(f, 65, 74, easeOut)) * 34}px)`,
              }}
            >
              <HorizonBubbleMobile chipActive={f >= 92 ? 1 : -1} chipPress={press3} hideChip={f >= 97 ? 1 : -1} />
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}

      {f >= 97 ? (
        <div
          style={{
            position: "absolute",
            left: mx - mw / 2,
            top: my - mh / 2,
            width: mw,
            height: mh,
            borderRadius: mh / 2,
            overflow: "hidden",
            boxShadow: `0 ${lerp(0, 26, m)}px ${lerp(0, 80, m)}px ${t.ctaTo}55`,
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: `${t.gold}26`, border: `2px solid ${t.gold}`, borderRadius: mh / 2 }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${t.ctaFrom}, ${t.ctaTo})`, opacity: m }} />
          <div
            style={{
              ...center,
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 27 * ts * pressScale,
              color: t.gold,
              opacity: 1 - prog(f, 97, 102),
            }}
          >
            Upto 1 Year
          </div>
          <div
            style={{
              ...center,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 50,
              color: t.onCta,
              whiteSpace: "nowrap",
              opacity: prog(f, 104, 113),
              filter: `blur(${(1 - prog(f, 104, 113)) * 8}px)`,
            }}
          >
            <span style={{ marginRight: 18 }}>✓</span>Your reading is ready
          </div>
        </div>
      ) : null}

      {f >= 72 && f < 114 ? (
        <Hand
          x={f < 97 ? h2x : tapX}
          y={f < 97 ? h2y : tapY}
          press={press3}
          ripple={ripple3}
          opacity={1 - prog(f, 104, 113)}
          size={88}
        />
      ) : null}
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* R7  25.3 - 29.0 s  button -> star -> bounces down the stacked line   */
/*                    "Ask. / Align. / Answered."                       */
/* ================================================================== */

const STAR = 130;
const WORDS = [
  { t: "Ask.", x: 330, y: 600, at: 40 },
  { t: "Align.", x: 690, y: 920, at: 58 },
  { t: "Answered.", x: 540, y: 1240, at: 78 },
];
// star centre just above each word's cap height, so the squash reads as contact
const LAND = WORDS.map((w) => w.y - 142);
const REST = { x: 880, y: LAND[2] + 14 };

const starPos = (f: number): { x: number; y: number; on: boolean } => {
  if (f < 9) return { x: RCX, y: RCY, on: true };
  if (f < 30) {
    const u = prog(f, 9, 30, easeIn);
    return { x: lerp(RCX, 1260, u), y: lerp(RCY, -260, u) - Math.sin(Math.PI * u) * 120, on: true };
  }
  if (f < 32) return { x: -200, y: 0, on: false };
  if (f < 40) {
    const u = (f - 32) / 8;
    return { x: lerp(-110, WORDS[0].x, u), y: lerp(170, LAND[0], u * u), on: true };
  }
  const hop = (u: number, x0: number, x1: number, y0: number, y1: number, peak: number) => ({
    x: lerp(x0, x1, u),
    y: lerp(y0, y1, u) - peak * 4 * u * (1 - u),
    on: true,
  });
  if (f < 58) return hop((f - 40) / 18, WORDS[0].x, WORDS[1].x, LAND[0], LAND[1], 230);
  if (f < 78) return hop((f - 58) / 20, WORDS[1].x, WORDS[2].x, LAND[1], LAND[2], 250);
  // one small last hop to the end of "Answered.", where it stays like a sparkle on the word
  if (f < 90) return hop((f - 78) / 12, WORDS[2].x, REST.x, LAND[2], REST.y, 130);
  return { x: REST.x, y: REST.y, on: true };
};
const LANDS = [40, 58, 78, 90];

export const R7Star: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();

  const c = prog(f, 0, 9, easeIn);
  const bw = lerp(BTN_W, STAR, c);
  const bh = lerp(BTN_H, STAR, c);
  const starIn = pop(f, fps, 7, 9);
  const lineOut = prog(f, 100, 110, easeIn);

  const landed = LANDS.some((l) => f >= l && f < l + 4);
  const squash = landed ? 1 - Math.min(...LANDS.map((l) => Math.abs(f - l - 1))) / 3 : 0;

  const st = starPos(f);
  const ghosts = [1, 2, 3, 4, 5, 6, 7, 8].map((k) => ({ k, p: starPos(f - k * 0.75) }));
  const spinAt = (q: number) => q * 7 + (q >= 9 && q < 30 ? 900 * prog(q, 9, 30, easeIn) : q >= 30 ? 900 : 0);
  // once it settles on "Answered." it only turns slowly
  const spin = f < 90 ? spinAt(f) : spinAt(90) + (f - 90) * 1.5;
  const starOut = 1 - lineOut;

  return (
    <AbsoluteFill>
      {f < 12 ? (
        <div
          style={{
            position: "absolute",
            left: RCX - bw / 2,
            top: RCY - bh / 2,
            width: bw,
            height: bh,
            borderRadius: bh / 2,
            background: `linear-gradient(90deg, ${t.ctaFrom}, ${t.ctaTo})`,
            boxShadow: `0 26px 80px ${t.ctaTo}55`,
            opacity: 1 - prog(f, 8, 12),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 50, color: t.onCta, whiteSpace: "nowrap", opacity: 1 - prog(f, 0, 4) }}>
            <span style={{ marginRight: 18 }}>✓</span>Your reading is ready
          </span>
        </div>
      ) : null}

      {f >= 9
        ? ghosts.map(({ k, p }) =>
            p.on ? (
              <div
                key={k}
                style={{
                  position: "absolute",
                  left: p.x - STAR / 2,
                  top: p.y - STAR / 2,
                  opacity: 0.32 * (1 - k / 9) * starOut,
                  transform: `scale(${1 - k * 0.07}) rotate(${spin - k * 6}deg)`,
                }}
              >
                <Star5 size={STAR} color={t.star} glow={0} />
              </div>
            ) : null,
          )
        : null}
      {st.on && f >= 7 ? (
        <div
          style={{
            position: "absolute",
            left: st.x - STAR / 2,
            top: st.y - STAR / 2,
            opacity: starOut,
            filter: lineOut > 0 ? `blur(${lineOut * 16}px)` : undefined,
            transform: `scale(${Math.min(starIn, 1.25) * (1 + 0.25 * squash)}, ${Math.min(starIn, 1.25) * (1 - 0.28 * squash)}) rotate(${spin}deg)`,
          }}
        >
          <Star5 size={STAR} color={t.star} />
        </div>
      ) : null}

      <AbsoluteFill style={{ opacity: 1 - lineOut, filter: `blur(${lineOut * 22}px)` }}>
        {WORDS.map((w, i) => {
          const p = pop(f, fps, w.at, 11);
          if (f < w.at) return null;
          return (
            <div
              key={w.t}
              style={{
                position: "absolute",
                left: w.x,
                top: w.y,
                transform: `translate(-50%, -50%) translateY(${(1 - Math.min(p, 1)) * 30}px) scale(${0.72 + 0.28 * p})`,
                opacity: Math.min(1, p * 1.6),
                fontFamily: SERIF,
                fontWeight: 700,
                fontSize: 172,
                letterSpacing: -2,
                whiteSpace: "nowrap",
                color: i === 2 ? t.text : t.gold,
              }}
            >
              {w.t}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* R8  29.0 - 33.0 s  end card, stacked: icon / typed wordmark / CTA    */
/* ================================================================== */

const ICON_H = 400;
const ICON_W = (ICON_H * 444) / 366;
const WM_H = 160;
const WM_W = (WM_H * 444) / 136;
// visible (alpha) bounds measured from the PNGs, so the marks centre optically
const ICON_VIS = { l: 87 / 444, r: 342 / 444, t: 16 / 366, b: 359 / 366 };
const WM_VIS = { l: 21 / 444, r: 419 / 444, t: 5 / 136, b: 116 / 136 };
const ICON_CY = 690;
const WM_CY = 1000;
const ICON_X = RCX - ((ICON_VIS.l + ICON_VIS.r) / 2) * ICON_W;
const ICON_Y = ICON_CY - ((ICON_VIS.t + ICON_VIS.b) / 2) * ICON_H;
const WM_X = RCX - ((WM_VIS.l + WM_VIS.r) / 2) * WM_W;
const WM_Y = WM_CY - ((WM_VIS.t + WM_VIS.b) / 2) * WM_H;
const STEPS = [0, 0.214, 0.383, 0.574, 0.716, 0.79, 1];

export const R8End: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();

  const icon = pop(f, fps, 0, 12);
  const idx = f < 20 ? 0 : Math.min(6, Math.floor((f - 20) / 4) + 1);
  const frac = STEPS[idx];
  const glint = interpolate(f, [46, 52, 62], [0, 1.25, 0], clamp);
  const url = prog(f, 52, 66);
  const pill = prog(f, 60, 74);
  const k = WM_H / 120;

  return (
    <AbsoluteFill>
      <div
        style={{
          ...center,
          background: `radial-gradient(ellipse 520px 640px at 50% 44%, ${t.gold}${t.dark ? "30" : "22"}, transparent 70%)`,
          opacity: 0.6 + 0.4 * Math.min(1, icon),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: ICON_X,
          top: ICON_Y,
          transform: `scale(${0.6 + 0.4 * icon})`,
          transformOrigin: "50% 60%",
          opacity: Math.min(1, icon * 1.5),
        }}
      >
        <LogoIcon height={ICON_H} />
      </div>
      <div style={{ position: "absolute", left: WM_X, top: WM_Y, clipPath: `inset(-20% ${(1 - frac) * 100}% -20% 0)` }}>
        <LogoWordmark height={WM_H} />
      </div>
      {f >= 4 && f < 54 ? (
        <div style={{ position: "absolute", left: WM_X + frac * WM_W + 10, top: WM_Y + 18 * k }}>
          <Caret height={WM_H * 0.72} color={t.gold} />
        </div>
      ) : null}
      {glint > 0 ? (
        <div
          style={{
            position: "absolute",
            left: WM_X + (400 / 444) * WM_W - 55,
            top: WM_Y + (22 / 136) * WM_H - 55,
            transform: `scale(${glint}) rotate(${f * 4}deg)`,
          }}
        >
          <Glint size={110} color="#FFF4C9" />
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1165,
          display: "flex",
          justifyContent: "center",
          opacity: pill,
          transform: `translateY(${(1 - pill) * 18}px)`,
        }}
      >
        <div
          style={{
            padding: "16px 34px",
            borderRadius: 999,
            border: `2px solid ${t.gold}aa`,
            color: t.gold,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 36,
            background: `${t.gold}14`,
          }}
        >
          🔥 Start free with 1 Flame
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1300,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 42,
          letterSpacing: 0.5,
          color: t.muted,
          opacity: url,
          transform: `translateY(${(1 - url) * 14}px)`,
        }}
      >
        jyotiq.astroraag.com
      </div>
    </AbsoluteFill>
  );
};
