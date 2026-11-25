import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caret, clamp, DirBlur, easeIn, easeInOut, easeOut, Glint, Hand, lerp, pop, prog, Star5, typed, Words } from "./motion";
import { SANS, SERIF, useTheme } from "./theme";
import {
  AppWindow,
  CatId,
  ChatHome,
  FeatureCard,
  HorizonBubble,
  HORIZON_CHIPS_LEFT,
  HORIZON_CHIPS_TOP,
  HORIZON_GAP,
  HORIZON_H,
  HORIZON_W,
  JyotiqNav,
  LogoIcon,
  LogoWordmark,
  UserBubble,
} from "./ui";

const center: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

/* ================================================================== */
/* B5  15.5 - 21.0 s  carousel -> pull back to the app -> tap Career   */
/*                    -> cards scatter, "Across your life."            */
/* ================================================================== */

const DW = 1640;
const DH = 920;
const CW = 360;
const CH = 280;
const GAP = 32;
const GX = (DW - (4 * CW + 3 * GAP)) / 2;
const GY = 300;
const ROW1: CatId[] = ["love", "career", "wealth", "health"];
const ROW2: CatId[] = ["travel", "education", "family", "general"];
const cardXY = (r: number, c: number) => ({ x: GX + c * (CW + GAP), y: GY + r * (CH + GAP) });
const S0 = 1.56; // carousel scale: dashboard cards fill ~560 px on screen

const slideOff = (f: number) => interpolate(f, [0, 22], [1500, 0], { ...clamp, easing: easeOut });

export const B5Tour: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();

  const career = cardXY(0, 1);
  const ccx = career.x + CW / 2;
  const ccy = career.y + CH / 2;

  const a = prog(f, 30, 51, easeInOut); // pull back
  const b = prog(f, 56, 80, easeInOut); // push into Career
  const out = prog(f, 86, 96, easeIn);
  const off = slideOff(f);
  const vel = Math.abs(off - slideOff(f - 1));

  const s = lerp(lerp(S0, 0.84, a), 2.3, b) * (1 + 0.35 * out);
  const px = lerp(lerp(ccx - off / S0, DW / 2, a), ccx, b);
  const py = lerp(lerp(ccy, DH / 2, a), ccy + 10, b);
  const rx = lerp(lerp(0, 14, a), 6, b);
  const ry = lerp(lerp(0, -16, a), -7, b);
  const rz = lerp(lerp(0, 3, a), 1.5, b);
  const chrome = prog(f, 30, 46);

  // Cursor, in dashboard coordinates (moves with the camera).
  const btn = { x: career.x + 74, y: career.y + 189 };
  const cm = prog(f, 58, 74, easeOut);
  const hx = lerp(career.x + 330, btn.x + 4, cm);
  const hy = lerp(career.y + 420, btn.y + 4, cm);
  const press = interpolate(f, [76, 79, 83], [0, 1, 0], clamp);
  const ripple = interpolate(f, [78, 92], [0, 1], clamp);
  const lit = prog(f, 78, 84);

  const scatterTargets: { id: CatId; x: number; y: number; rz: number; ry: number }[] = [
    { id: "love", x: 330, y: 240, rz: -9, ry: 18 },
    { id: "career", x: 1600, y: 225, rz: 8, ry: -18 },
    { id: "wealth", x: 320, y: 865, rz: 7, ry: 16 },
    { id: "health", x: 1605, y: 860, rz: -8, ry: -16 },
  ];
  const lineOut = prog(f, 158, 165, easeIn);

  return (
    <AbsoluteFill>
      {f < 97 ? (
        <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: "960px 540px", opacity: 1 - out, filter: `blur(${out * 16}px)` }}>
          <DirBlur
            x={Math.min(40, vel * 0.55)}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: DW,
              height: DH,
              transformOrigin: "0 0",
              transformStyle: "preserve-3d",
              transform: `translate(960px, 540px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s}) translate(${-px}px, ${-py}px)`,
            }}
          >
            <div style={{ position: "absolute", left: 0, top: 0, opacity: chrome }}>
              <AppWindow w={DW} h={DH}>
                <JyotiqNav width={DW} active="Home" />
                <div style={{ position: "absolute", left: GX, top: 132, fontFamily: SANS }}>
                  <div style={{ color: t.gold, fontWeight: 800, fontSize: 16, letterSpacing: 3 }}>GUIDANCE CATEGORIES</div>
                  <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 46, color: t.text, marginTop: 6 }}>
                    What would you like to know?
                  </div>
                  <div style={{ color: t.muted, fontSize: 19, marginTop: 4 }}>
                    Click a category card for instant domain readings.
                  </div>
                </div>
              </AppWindow>
              {ROW2.map((id, c) => {
                const p = cardXY(1, c);
                return (
                  <div key={id} style={{ position: "absolute", left: p.x, top: p.y }}>
                    <FeatureCard id={id} w={CW} h={CH} />
                  </div>
                );
              })}
            </div>
            {ROW1.map((id, c) => {
              const p = cardXY(0, c);
              return (
                <div key={id} style={{ position: "absolute", left: p.x, top: p.y }}>
                  <FeatureCard id={id} w={CW} h={CH} highlight={id === "career" ? lit : 0} press={id === "career" ? press : 0} />
                </div>
              );
            })}
            {f >= 58 ? (
              <div style={{ position: "absolute", left: hx, top: hy, transform: `scale(${1 / s})`, transformOrigin: "0 0" }}>
                <Hand x={0} y={0} press={press} ripple={ripple} size={66} />
              </div>
            ) : null}
          </DirBlur>
        </AbsoluteFill>
      ) : null}

      {/* scatter */}
      {f >= 88 ? (
        <AbsoluteFill style={{ perspective: 1800, opacity: 1 - lineOut, filter: `blur(${lineOut * 10}px)` }}>
          {scatterTargets.map((c, i) => {
            const cfg = { damping: 16, stiffness: 110, mass: 0.9 };
            const p = spring({ frame: f - 88 - i * 2, fps, config: cfg });
            const p1 = spring({ frame: f - 89 - i * 2, fps, config: cfg });
            const drift = (f - 104) * 0.35;
            const x = lerp(960, c.x + (c.x < 960 ? -drift : drift), p);
            const y = lerp(540, c.y + (c.y < 540 ? -drift * 0.4 : drift * 0.4), p);
            const dx = Math.abs((c.x - 960) * (p - p1));
            const dy = Math.abs((c.y - 540) * (p - p1));
            return (
              <DirBlur
                key={c.id}
                x={Math.min(30, dx * 0.35)}
                y={Math.min(30, dy * 0.35)}
                style={{
                  position: "absolute",
                  left: x - (CW * 1.5) / 2,
                  top: y - (CH * 1.5) / 2,
                  transform: `rotateY(${c.ry * p}deg) rotateZ(${c.rz * p}deg) scale(${lerp(0.55, 1.5, p)})`,
                  opacity: Math.min(1, p * 3),
                }}
              >
                <div style={{ width: CW, height: CH, transform: "scale(1)", transformOrigin: "50% 50%" }}>
                  <FeatureCard id={c.id} w={CW} h={CH} />
                </div>
              </DirBlur>
            );
          })}
          <div style={center}>
            <Words
              size={112}
              words={[
                { t: "Across", at: 104, color: t.gold },
                { t: "your", at: 108, color: t.gold },
                { t: "life.", at: 113, color: t.text },
              ]}
            />
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* B6  21.0 - 25.3 s  ask a real question -> Jyotiq asks the horizon   */
/*                    -> tap "Upto 1 Year" -> "Your reading is ready"  */
/* ================================================================== */

const QUESTION = "Which career path aligns with my Kundali?";
const CHAT_W = 1500;
const CHAT_H = 900;
const BUBBLE_LEFT = 250; // HorizonBubble position inside the thread layer
const BUBBLE_TOP = 380;
// Centre + size of "Upto 1 Year" in thread coordinates, derived from the bubble's fixed layout.
const CHIP = {
  x: BUBBLE_LEFT + HORIZON_CHIPS_LEFT + HORIZON_W[0] + HORIZON_GAP + HORIZON_W[1] / 2,
  y: BUBBLE_TOP + HORIZON_CHIPS_TOP + HORIZON_H / 2,
  w: HORIZON_W[1],
  h: HORIZON_H,
};

const threadXf = (f: number) => {
  const k = prog(f, 58, 100, easeInOut);
  return { s: lerp(0.94, 1.12, k), tx: lerp(90, -110, k) };
};
const toScreen = (x: number, y: number, xf: { s: number; tx: number }) => ({
  x: 960 + (x - 960) * xf.s + xf.tx,
  y: 540 + (y - 540) * xf.s,
});

export const B6Aha: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();

  const drop = spring({ frame: f, fps, config: { damping: 15, stiffness: 95, mass: 0.9 } });
  const chatOut = prog(f, 57, 66, easeIn);
  const text = typed(QUESTION, f, 10, 1.3);
  const sendBtn = { x: 1183, y: 478 };
  const cm = prog(f, 36, 52, easeOut);
  const hx = lerp(1380, sendBtn.x + 4, cm);
  const hy = lerp(860, sendBtn.y + 4, cm);
  const press = interpolate(f, [52, 55, 59], [0, 1, 0], clamp);
  const ripple = interpolate(f, [54, 68], [0, 1], clamp);

  const xf = threadXf(f);
  const threadIn = prog(f, 58, 68);
  const threadOut = prog(f, 103, 115, easeIn);
  const chip = toScreen(CHIP.x, CHIP.y, xf);
  const cm2 = prog(f, 78, 95, easeOut);
  const h2x = lerp(1560, chip.x + 6, cm2);
  const h2y = lerp(1000, chip.y + 6, cm2);
  const press2 = interpolate(f, [96, 99, 103], [0, 1, 0], clamp);
  const ripple2 = interpolate(f, [98, 112], [0, 1], clamp);

  // morph chip -> success button (starts at the chip's pressed size so the hand-off is seamless)
  const m = prog(f, 101, 122, easeInOut);
  const pressScale = 1 - 0.08 * press2;
  const mw = lerp(CHIP.w * xf.s * pressScale, 820, m);
  const mh = lerp(CHIP.h * xf.s * pressScale, 128, m);
  const mx = lerp(chip.x, 960, m);
  const my = lerp(chip.y, 540, m);

  return (
    <AbsoluteFill>
      {f < 67 ? (
        <AbsoluteFill style={{ perspective: 2000, opacity: 1 - chatOut, filter: `blur(${chatOut * 14}px)` }}>
          <div
            style={{
              position: "absolute",
              left: 960 - CHAT_W / 2,
              top: 540 - CHAT_H / 2,
              width: CHAT_W,
              height: CHAT_H,
              transform: `translateY(${lerp(-1150, 0, drop)}px) rotateX(${lerp(48, 10, drop)}deg) rotateY(-8deg) rotateZ(-2deg) scale(${0.92 * (1 + 0.18 * chatOut)})`,
            }}
          >
            <AppWindow w={CHAT_W} h={CHAT_H}>
              <ChatHome
                width={CHAT_W}
                selected="career"
                text={text}
                caret={f < 56}
                sendGlow={interpolate(f, [52, 56], [0, 1], clamp)}
                chips={["When is the next Shubh Muhurat for starting a business?", "How does the current Saturn Transit affect my health?"]}
              />
            </AppWindow>
            {f >= 36 ? <Hand x={hx} y={hy} press={press} ripple={ripple} size={66} /> : null}
          </div>
        </AbsoluteFill>
      ) : null}

      {f >= 58 && f < 116 ? (
        <AbsoluteFill style={{ opacity: threadIn * (1 - threadOut), filter: `blur(${(1 - threadIn) * 12 + threadOut * 12}px)` }}>
          <AbsoluteFill style={{ transform: `translateX(${xf.tx}px) scale(${xf.s})`, transformOrigin: "960px 540px" }}>
            <div style={{ position: "absolute", right: 250, top: 250, opacity: prog(f, 58, 64) }}>
              <UserBubble text={QUESTION} />
            </div>
            <div
              style={{
                position: "absolute",
                left: BUBBLE_LEFT,
                top: BUBBLE_TOP,
                opacity: prog(f, 63, 70),
                transform: `translateY(${(1 - prog(f, 63, 72)) * 30}px)`,
              }}
            >
              <HorizonBubble chipActive={f >= 97 ? 1 : -1} chipPress={press2} hideChip={f >= 101 ? 1 : -1} />
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}

      {/* the chosen chip becomes the success button */}
      {f >= 101 ? (
        <div
          style={{
            position: "absolute",
            left: mx - mw / 2,
            top: my - mh / 2,
            width: mw,
            height: mh,
            borderRadius: mh / 2,
            overflow: "hidden",
            boxShadow: `0 ${lerp(0, 24, m)}px ${lerp(0, 70, m)}px ${t.ctaTo}55`,
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: `${t.gold}26`, border: `1.5px solid ${t.gold}`, borderRadius: mh / 2 }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(90deg, ${t.ctaFrom}, ${t.ctaTo})`,
              opacity: m,
            }}
          />
          <div
            style={{
              ...center,
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 20 * xf.s * pressScale,
              color: t.gold,
              opacity: 1 - prog(f, 101, 106),
            }}
          >
            Upto 1 Year
          </div>
          <div
            style={{
              ...center,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 46,
              letterSpacing: 0.3,
              color: t.onCta,
              whiteSpace: "nowrap",
              opacity: prog(f, 108, 117),
              filter: `blur(${(1 - prog(f, 108, 117)) * 8}px)`,
            }}
          >
            <span style={{ marginRight: 16 }}>✓</span>Your reading is ready
          </div>
        </div>
      ) : null}

      {f >= 76 && f < 118 ? (
        <Hand x={f < 101 ? h2x : chip.x + 6} y={f < 101 ? h2y : chip.y + 6} press={press2} ripple={ripple2} opacity={1 - prog(f, 108, 117)} size={66} />
      ) : null}
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* B7  25.3 - 29.0 s  button -> star -> bounces "Ask. Align. Answered." */
/* ================================================================== */

const LAND_Y = 418;
const WORDS = [
  { t: "Ask.", x: 430, at: 40 },
  { t: "Align.", x: 805, at: 58 },
  { t: "Answered.", x: 1340, at: 78 },
];

const starPos = (f: number): { x: number; y: number; on: boolean } => {
  if (f < 9) return { x: 960, y: 540, on: true };
  if (f < 30) {
    const u = prog(f, 9, 30, easeIn);
    return { x: lerp(960, 1780, u), y: lerp(540, -160, u) - Math.sin(Math.PI * u) * 90, on: true };
  }
  if (f < 32) return { x: -200, y: 0, on: false };
  if (f < 40) {
    const u = (f - 32) / 8;
    return { x: lerp(-90, WORDS[0].x, u), y: lerp(120, LAND_Y, u * u), on: true };
  }
  const hop = (u: number, x0: number, x1: number, peak: number) => ({
    x: lerp(x0, x1, u),
    y: LAND_Y - peak * 4 * u * (1 - u),
    on: true,
  });
  if (f < 58) return hop((f - 40) / 18, WORDS[0].x, WORDS[1].x, 250);
  if (f < 78) return hop((f - 58) / 20, WORDS[1].x, WORDS[2].x, 290);
  const u = Math.min(1, (f - 78) / 18);
  return { x: lerp(WORDS[2].x, 2000, u), y: lerp(LAND_Y, -80, u) - Math.sin(Math.PI * u) * 150, on: u < 1 };
};

export const B7Star: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();

  const c = prog(f, 0, 9, easeIn);
  const bw = lerp(820, 130, c);
  const bh = lerp(128, 130, c);
  const starIn = pop(f, fps, 7, 9);
  const lineOut = prog(f, 100, 110, easeIn);

  const landed = [40, 58, 78].map((l) => f >= l && f < l + 4);
  const squash = landed.some(Boolean) ? 1 - Math.min(...[40, 58, 78].map((l) => Math.abs(f - l - 1))) / 3 : 0;

  const st = starPos(f);
  const ghosts = [1, 2, 3, 4, 5, 6, 7, 8].map((k) => ({ k, p: starPos(f - k * 0.75) }));
  const spin = f * 7 + (f >= 9 && f < 30 ? 900 * prog(f, 9, 30, easeIn) : 0);

  return (
    <AbsoluteFill>
      {f < 12 ? (
        <div
          style={{
            position: "absolute",
            left: 960 - bw / 2,
            top: 540 - bh / 2,
            width: bw,
            height: bh,
            borderRadius: bh / 2,
            background: `linear-gradient(90deg, ${t.ctaFrom}, ${t.ctaTo})`,
            boxShadow: `0 24px 70px ${t.ctaTo}55`,
            opacity: 1 - prog(f, 8, 12),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 46,
              color: t.onCta,
              whiteSpace: "nowrap",
              opacity: 1 - prog(f, 0, 4),
            }}
          >
            <span style={{ marginRight: 16 }}>✓</span>Your reading is ready
          </span>
        </div>
      ) : null}

      {/* trail */}
      {f >= 9
        ? ghosts.map(({ k, p }) =>
            p.on ? (
              <div
                key={k}
                style={{
                  position: "absolute",
                  left: p.x - 55,
                  top: p.y - 55,
                  opacity: 0.32 * (1 - k / 9),
                  transform: `scale(${1 - k * 0.07}) rotate(${spin - k * 6}deg)`,
                }}
              >
                <Star5 size={110} color={t.star} glow={0} />
              </div>
            ) : null,
          )
        : null}
      {st.on && f >= 7 ? (
        <div
          style={{
            position: "absolute",
            left: st.x - 55,
            top: st.y - 55,
            transform: `scale(${Math.min(starIn, 1.25) * (1 + 0.25 * squash)}, ${Math.min(starIn, 1.25) * (1 - 0.28 * squash)}) rotate(${spin}deg)`,
          }}
        >
          <Star5 size={110} color={t.star} />
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
                top: 548,
                transform: `translate(-50%, -50%) translateY(${(1 - Math.min(p, 1)) * 26}px) scale(${0.72 + 0.28 * p})`,
                opacity: Math.min(1, p * 1.6),
                fontFamily: SERIF,
                fontWeight: 700,
                fontSize: 124,
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
/* B8  29.0 - 33.0 s  end card: icon + typed wordmark + URL            */
/* ================================================================== */

const ICON_H = 300;
const ICON_W = (ICON_H * 444) / 366;
const WM_H = 120;
const WM_W = (WM_H * 444) / 136;
// Visible (alpha) bounds of the PNGs, measured from the files: the icon carries wide
// transparent margins, so centring the image boxes left the lockup ~24px right of
// centre with a 128px optical gap. Centre the *visible* marks instead.
const ICON_VIS = { l: 87 / 444, r: 342 / 444, t: 16 / 366, b: 359 / 366 };
const WM_VIS = { l: 21 / 444, r: 419 / 444, t: 5 / 136, b: 116 / 136 };
const VIS_GAP = 64;
const ICON_TOP = 330;
const ICON_VIS_W = (ICON_VIS.r - ICON_VIS.l) * ICON_W;
const WM_VIS_W = (WM_VIS.r - WM_VIS.l) * WM_W;
const VIS_LEFT = 960 - (ICON_VIS_W + VIS_GAP + WM_VIS_W) / 2;
const LOCK_X = VIS_LEFT - ICON_VIS.l * ICON_W;
const WM_X = VIS_LEFT + ICON_VIS_W + VIS_GAP - WM_VIS.l * WM_W;
// Wordmark centred vertically on the icon's visible centre.
const ICON_VIS_CY = ICON_TOP + ((ICON_VIS.t + ICON_VIS.b) / 2) * ICON_H;
const WM_Y = ICON_VIS_CY - ((WM_VIS.t + WM_VIS.b) / 2) * WM_H;
const STEPS = [0, 0.214, 0.383, 0.574, 0.716, 0.79, 1];

export const B8End: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();

  const icon = pop(f, fps, 0, 12);
  const idx = f < 20 ? 0 : Math.min(6, Math.floor((f - 20) / 4) + 1);
  const frac = STEPS[idx];
  const glint = interpolate(f, [46, 52, 62], [0, 1.25, 0], clamp);
  const url = prog(f, 52, 66);
  const pill = prog(f, 60, 74);

  return (
    <AbsoluteFill>
      <div
        style={{
          ...center,
          background: `radial-gradient(ellipse 30% 34% at 50% 46%, ${t.gold}${t.dark ? "30" : "22"}, transparent 70%)`,
          opacity: 0.6 + 0.4 * Math.min(1, icon),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: LOCK_X,
          top: ICON_TOP,
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
        <div style={{ position: "absolute", left: WM_X + frac * WM_W + 8, top: WM_Y + 18 }}>
          <Caret height={WM_H * 0.72} color={t.gold} />
        </div>
      ) : null}
      {glint > 0 ? (
        <div
          style={{
            position: "absolute",
            left: WM_X + (400 / 444) * WM_W - 45,
            top: WM_Y + (22 / 136) * WM_H - 45,
            transform: `scale(${glint}) rotate(${f * 4}deg)`,
          }}
        >
          <Glint size={90} color="#FFF4C9" />
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 740,
          display: "flex",
          justifyContent: "center",
          opacity: pill,
          transform: `translateY(${(1 - pill) * 16}px)`,
        }}
      >
        <div
          style={{
            padding: "12px 26px",
            borderRadius: 999,
            border: `1.5px solid ${t.gold}aa`,
            color: t.gold,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 26,
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
          top: 940,
          textAlign: "center",
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 32,
          letterSpacing: 0.5,
          color: t.muted,
          opacity: url,
          transform: `translateY(${(1 - url) * 12}px)`,
        }}
      >
        jyotiq.astroraag.com
      </div>
    </AbsoluteFill>
  );
};
