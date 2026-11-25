import React from "react";
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { vnoise } from "../fight/rig";
import { clamp, DirBlur, easeIn, easeInOut, easeOut, lerp, prog, Word } from "../motion";
import { Line, Lines } from "../reelKit";
import { useTheme } from "../theme";
import { FocusLines, Shockwave, sparklePath, Sparks, SpeedLines } from "./anime";
import { AsksContent } from "./s4Asks";
import { kick, SC } from "./timeline";

/* ================================================================== */
/* S5  reel 466-624. The whole house frame (S4) collapses into a ball  */
/* (0-15), drops and hop-rolls right (16-61) while JYOTIQ flies in      */
/* from the right; they clash on the 13.98 s hit (61). The ball bursts */
/* into stars that the logo absorbs; the brand line builds above.      */
/* ================================================================== */

export const LOGO = { cx: 540, cy: 1150, h: 520, w: (520 * 444) / 511 };
const R = 170;
const REST_Y = 1180; // ball centre on the floor
const FLOOR_Y = REST_Y + R;
const LAND = [16, 31, 45];
const HOPS = [88, 54];
const IMPACT = 61;
const X0 = 190;
const X1 = 370; // ball's right edge meets the logo's lamp at x 540
const LOGO_HIT = 676;
const S4_LAST = SC.asks[1] - SC.asks[0] - 1;

const ballAt = (g: number) => {
  if (g < 15) {
    const k = prog(g, 0, 15, easeInOut);
    return { x: lerp(540, X0, k), y: lerp(960, REST_Y - 60, k) };
  }
  if (g < LAND[0]) return { x: X0, y: lerp(REST_Y - 60, REST_Y, (g - 15) / (LAND[0] - 15)) };
  const x = interpolate(g, [LAND[0], IMPACT], [X0, X1], { ...clamp, easing: (t) => t * (0.7 + 0.3 * t) });
  let y = REST_Y;
  if (g >= LAND[0] && g < LAND[1]) y -= HOPS[0] * Math.sin((Math.PI * (g - LAND[0])) / (LAND[1] - LAND[0]));
  else if (g >= LAND[1] && g < LAND[2]) y -= HOPS[1] * Math.sin((Math.PI * (g - LAND[1])) / (LAND[2] - LAND[1]));
  return { x, y };
};

const squashAt = (g: number) => {
  let s = 0;
  for (const l of LAND) if (g >= l) s += Math.exp(-(g - l) / 2.2) * Math.min(1, (g - l + 1) / 1.5);
  return Math.min(1, s);
};

const EMPH = /^(jyotiq|real|reason|kundali|future\.?)$/i;
const toLine = (text: string, at: number, size: number): Line => ({
  size,
  words: text.split(" ").map((t, i): Word => ({
    t,
    at: at + i * 3,
    color: EMPH.test(t) ? "#DFB15B" : undefined,
    italic: /^(jyotiq|future\.?)$/i.test(t),
  })),
});
const LINE_AT = [19, IMPACT, 90, 108, 124, 132];
const LINE_SIZE = [80, 80, 60, 60, 60, 96];

export const S5Ball: React.FC<{ brandLine: string[] }> = ({ brandLine }) => {
  const g = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();
  const G = SC.ball[0] + g;

  // collapse: visible box shrinks from the full frame to a 300 px circle
  const k = prog(g, 0, 15, easeIn);
  const kr = prog(g, 3, 15, easeOut);
  const sc = lerp(1, 0.42, k);
  const wv = lerp(1080, (2 * R) / 0.42, k);
  const hv = lerp(1920, (2 * R) / 0.42, k);
  const rv = lerp(0, R / 0.42, kr);
  const b = ballAt(g);
  const roll = g < LAND[0] ? 90 * k : 90 + ((b.x - X0) / R) * (180 / Math.PI) * 3;
  const sq = squashAt(g);
  const burst = prog(g, IMPACT, IMPACT + 6);
  const ballOn = g < IMPACT + 6;
  const sphere = prog(g, 8, 15);

  // logo: flies in from the right, clash, carries on to the centre
  const lx = g < IMPACT ? interpolate(g, [44, IMPACT], [1560, LOGO_HIT], { ...clamp, easing: easeIn }) : interpolate(g, [IMPACT, IMPACT + 16], [LOGO_HIT, LOGO.cx], { ...clamp, easing: easeOut });
  const lvx = g >= 44 && g < IMPACT ? Math.abs(interpolate(g + 1, [44, IMPACT], [1560, LOGO_HIT], { ...clamp, easing: easeIn }) - lx) : 0;
  const recoil = g >= IMPACT ? Math.exp(-(g - IMPACT) / 6) : 0;
  const float = (1 - prog(g, 120, 150)) * Math.sin(g / 9) * 8;
  const glow = 0.45 + 0.4 * kick(G, 6) + 0.6 * Math.exp(-Math.max(0, g - IMPACT) / 8) * (g >= IMPACT ? 1 : 0);

  let amp = 0;
  if (g >= IMPACT) amp += 30 * Math.exp(-(g - IMPACT) / 4);
  for (const l of LAND) if (g >= l) amp += 7 * Math.exp(-(g - l) / 3);
  const sx = amp * vnoise("s5x", g * 0.9);
  const sy = amp * vnoise("s5y", g * 0.9 + 17);
  const invert = g === IMPACT || g === IMPACT + 1;
  const textOut = prog(g, 146, 157, easeIn);

  // stars thrown out of the ball, then pulled into the logo
  const stars = g >= IMPACT && g < IMPACT + 40
    ? new Array(36).fill(0).map((_, i) => {
        const r = (s: string) => random(`bst-${i}-${s}`);
        const a = r("a") * Math.PI * 2;
        const out = 120 + r("d") * 260;
        const u = (g - IMPACT) / 40;
        const fly = easeOut(Math.min(1, u * 2.2));
        const pull = easeIn(Math.max(0, (u - 0.35) / 0.65));
        const ox = X1 + Math.cos(a) * out * fly;
        const oy = REST_Y + Math.sin(a) * out * fly;
        return { x: lerp(ox, LOGO.cx, pull), y: lerp(oy, LOGO.cy - 60, pull), s: (10 + r("s") * 18) * (1 - pull * 0.7), o: 1 - Math.max(0, (u - 0.85) / 0.15), rot: g * (6 + r("r") * 10) };
      })
    : [];

  const lines = brandLine.slice(0, 6).map((txt, i) => toLine(txt, LINE_AT[i] ?? 132, LINE_SIZE[i] ?? 60));

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translate(${sx.toFixed(2)}px, ${sy.toFixed(2)}px)` }}>
        {/* floor light */}
        {g >= 10 ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: FLOOR_Y - 2,
              height: 4,
              background: `linear-gradient(90deg, transparent, ${t.gold}aa 30%, ${t.goldSoft} 50%, ${t.gold}aa 70%, transparent)`,
              opacity: prog(g, 10, 18) * (1 - prog(g, IMPACT + 10, IMPACT + 30)),
              boxShadow: `0 0 30px ${t.gold}`,
            }}
          />
        ) : null}
        {/* ball shadow */}
        {g >= 12 && ballOn ? (
          <div
            style={{
              position: "absolute",
              left: b.x - R * 0.9,
              top: FLOOR_Y - 16,
              width: R * 1.8,
              height: 32,
              borderRadius: "50%",
              background: "radial-gradient(ellipse at center, rgba(0,0,0,0.55), transparent 70%)",
              transform: `scale(${1 - (REST_Y - b.y) / 260})`,
              opacity: 1 - burst,
            }}
          />
        ) : null}

        {/* the house, shrinking into a ball */}
        {ballOn ? (
          <div
            style={{
              position: "absolute",
              left: b.x - (wv * sc) / 2,
              top: b.y - (hv * sc) / 2,
              width: wv * sc,
              height: hv * sc,
              borderRadius: rv * sc,
              overflow: "hidden",
              transform: `scale(${(1 + 0.2 * sq) * (1 + 0.4 * burst)}, ${(1 - 0.2 * sq) * (1 + 0.4 * burst)})`,
              transformOrigin: "50% 100%",
              opacity: 1 - burst,
              boxShadow: sphere > 0 ? `0 0 ${50 * sphere}px rgba(255,120,170,${0.45 * sphere})` : undefined,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: (wv * sc) / 2 - 540,
                top: (hv * sc) / 2 - 960,
                width: 1080,
                height: 1920,
                transform: `scale(${sc}) rotate(${roll.toFixed(2)}deg)`,
                transformOrigin: "540px 960px",
              }}
            >
              <AsksContent f={S4_LAST + g} fps={fps} />
            </div>
            {sphere > 0 ? (
              <>
                <AbsoluteFill style={{ opacity: sphere, background: "radial-gradient(circle at 34% 28%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 22%, transparent 42%)" }} />
                <AbsoluteFill style={{ opacity: sphere, background: "radial-gradient(circle at 50% 50%, transparent 52%, rgba(30,0,16,0.7) 100%)" }} />
                <AbsoluteFill style={{ opacity: sphere, borderRadius: "50%", boxShadow: "inset 0 0 0 5px rgba(255,230,190,0.55)" }} />
              </>
            ) : null}
          </div>
        ) : null}

        {/* JYOTIQ flying in */}
        {g >= 44 ? (
          <>
            {g < IMPACT ? <SpeedLines f={g} angle={180} count={40} opacity={0.55} speed={150} seed="lg" /> : null}
            <DirBlur
              x={Math.min(26, lvx * 0.35)}
              style={{
                position: "absolute",
                left: lx - LOGO.w / 2,
                top: LOGO.cy - LOGO.h / 2 + float,
                width: LOGO.w,
                height: LOGO.h,
                transform: `rotate(${(-7 * recoil).toFixed(2)}deg) scale(${1 + 0.12 * recoil}, ${1 - 0.08 * recoil})`,
                transformOrigin: "50% 80%",
              }}
            >
              <div style={{ position: "absolute", inset: -60, borderRadius: "50%", background: `radial-gradient(circle at 50% 45%, ${t.gold}55, transparent 65%)`, opacity: glow }} />
              <Img src={staticFile("jyotiq/logo-full.png")} style={{ position: "relative", width: LOGO.w, height: LOGO.h }} />
            </DirBlur>
          </>
        ) : null}

        {stars.map((s, i) => (
          <svg key={i} width={s.s * 2} height={s.s * 2} viewBox={`${-s.s} ${-s.s} ${s.s * 2} ${s.s * 2}`} style={{ position: "absolute", left: s.x - s.s, top: s.y - s.s, opacity: s.o, overflow: "visible", transform: `rotate(${s.rot}deg)` }}>
            <path d={sparklePath(s.s)} fill={i % 3 ? "#FFE7A8" : "#FFFFFF"} style={{ filter: "drop-shadow(0 0 6px #FFD45A)" }} />
          </svg>
        ))}
      </AbsoluteFill>

      {g >= 3 && g < 15 ? <FocusLines f={g} cx={b.x} cy={b.y} rx={160 + 300 * (1 - k)} ry={200 + 500 * (1 - k)} color="#FFFFFF" opacity={0.55} count={100} seed="suck" /> : null}
      {g >= IMPACT && g < IMPACT + 10 ? <FocusLines f={g} cx={540} cy={1150} rx={300} ry={420} color="#FFE7A8" opacity={0.7 * (1 - (g - IMPACT) / 10)} /> : null}
      <Shockwave f={g} at={IMPACT} x={540} y={REST_Y} size={1.3} />
      <Sparks f={g} at={IMPACT} x={540} y={REST_Y} count={50} power={1.3} dur={24} seed="clash" />
      {invert ? <AbsoluteFill style={{ backdropFilter: "invert(1) grayscale(1) contrast(1.9)", WebkitBackdropFilter: "invert(1) grayscale(1) contrast(1.9)" }} /> : null}
      {g === IMPACT + 2 ? <AbsoluteFill style={{ background: "#FFF8EC", opacity: 0.35 }} /> : null}

      {/* brand line */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 286, opacity: 1 - textOut, filter: textOut > 0 ? `blur(${textOut * 14}px)` : undefined, transform: `translateY(${-60 * textOut}px)` }}>
        <Lines lines={lines} />
      </div>
    </AbsoluteFill>
  );
};
