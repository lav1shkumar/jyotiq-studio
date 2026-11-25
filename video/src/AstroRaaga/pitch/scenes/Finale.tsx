import React from "react";
import { Img } from "remotion";
import { C, easeInOut, KARLA, lerp, line, MARCELLUS, prog, rnd, SCENES, word } from "../theme";
import { Accent, asset, Draw, Headline, In, Label, Paper, Pill, Scene, useWinT } from "../ui";

const FUNDS = [
  { k: "Product & intelligence", v: 30, c: C.violet },
  { k: "Growth & marketing", v: 30, c: C.saffron },
  { k: "Advisor network", v: 15, c: C.green },
  { k: "Team", v: 15, c: C.amber },
  { k: "Operations", v: 10, c: C.rust },
];

/** The last lamp of the mela (line art) that lights on "light up". */
const Lamp: React.FC<{ t: number; t0: number; tLight: number }> = ({ t, t0, tLight }) => {
  const d = (k: number, dur = 0.8) => prog(t, t0 + k, dur, easeInOut);
  const lit = prog(t, tLight, 0.6);
  const fl = 1 + 0.07 * Math.sin(t * 11) + 0.04 * Math.sin(t * 17);
  const ink = "rgba(44,24,16,0.55)";
  return (
    <svg width={360} height={520} viewBox="0 0 360 520" style={{ overflow: "visible" }}>
      {lit > 0 && <circle cx={180} cy={120} r={190 * lit} fill={`rgba(245,158,11,${0.16 * lit})`} />}
      <Draw d="M110 500 H250 M130 500 Q130 470 180 462 Q230 470 230 500" p={d(0)} stroke={ink} width={2.2} />
      <Draw d="M180 462 V250 M168 440 H192 M166 380 H194 M168 320 H192" p={d(0.15)} stroke={ink} width={2.2} />
      <Draw d="M80 230 Q180 290 280 230 Q260 200 180 196 Q100 200 80 230 Z" p={d(0.3)} stroke={ink} width={2.2} />
      <Draw d="M100 222 Q180 262 260 222" p={d(0.45)} stroke="rgba(44,24,16,0.3)" width={1.6} />
      <Draw d="M180 196 V172" p={d(0.55, 0.4)} stroke={ink} width={2} />
      {lit > 0 && (
        <g transform={`translate(180 ${168}) scale(${lit * fl})`}>
          <path d="M0 -70 Q26 -24 0 0 Q-26 -24 0 -70 Z" fill="url(#flame)" />
          <path d="M0 -40 Q10 -18 0 -4 Q-10 -18 0 -40 Z" fill="#FFF7E0" />
        </g>
      )}
      <defs>
        <radialGradient id="flame" cx="0.5" cy="0.75" r="0.8">
          <stop offset="0" stopColor="#FFF3C4" />
          <stop offset="0.45" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#EA580C" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export const AskScene: React.FC = () => {
  const t = useWinT();
  const [a, b] = SCENES.ask;
  const s18 = line("s18");
  const tLight = word("s18", "light") - 0.05;
  const lampX = 1430;
  const lampY = 250;
  return (
    <Scene a={a} b={b} outDur={0.5}>
      <Paper />
      {/* the whole mela lights up: bulbs radiating from the lamp */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 70 }).map((_, i) => {
          const an = rnd(i) * Math.PI * 2;
          const rr = 260 + rnd(i + 70) * 900;
          const x = lampX + 180 + Math.cos(an) * rr;
          const y = lampY + 120 + Math.sin(an) * rr * 0.62;
          const p = prog(t, tLight + 0.1 + rr / 1400, 0.4);
          const tw = 0.65 + 0.35 * Math.sin(t * 5 + i);
          return (
            <g key={i} opacity={p}>
              <circle cx={x} cy={y} r={11} fill={`rgba(245,158,11,${0.16 * tw})`} />
              <circle cx={x} cy={y} r={3.4} fill={C.amber} />
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: lampX, top: lampY }}>
        <Lamp t={t} t0={a + 0.1} tLight={tLight} />
      </div>
      <div style={{ position: "absolute", left: 140, top: 200, width: 1100 }}>
        <In t0={a + 0.2}>
          <Label>The ask</Label>
        </In>
        <In t0={s18.start - 0.05} dur={0.9} style={{ marginTop: 26 }}>
          <div style={{ fontFamily: KARLA, fontWeight: 600, fontSize: 30, color: C.ink2, letterSpacing: "0.04em" }}>Raising</div>
          <Headline size={170} style={{ lineHeight: 1 }}>
            <Accent>₹10 Cr</Accent>
          </Headline>
        </In>
        <In t0={tLight - 0.1} dur={0.8} style={{ marginTop: 14 }}>
          <Headline size={46} color={C.ink2}>
            to light up the whole mela.
          </Headline>
        </In>
        <In t0={s18.start + 0.6} dur={0.8} style={{ marginTop: 50 }}>
          <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 19, letterSpacing: "0.18em", color: C.ink3, marginBottom: 14 }}>USE OF FUNDS</div>
          <div style={{ display: "flex", width: 1040, height: 18, borderRadius: 9, overflow: "hidden", background: "rgba(44,24,16,0.06)" }}>
            {FUNDS.map((f, i) => {
              const p = prog(t, s18.start + 0.7 + i * 0.12, 0.5);
              return <div key={f.k} style={{ width: `${f.v * p}%`, background: f.c, marginRight: 3 }} />;
            })}
          </div>
          <div style={{ display: "flex", gap: 26, marginTop: 16, flexWrap: "wrap" }}>
            {FUNDS.map((f, i) => (
              <div key={f.k} style={{ display: "flex", alignItems: "center", gap: 8, opacity: prog(t, s18.start + 0.8 + i * 0.12, 0.4) }}>
                <div style={{ width: 10, height: 10, borderRadius: 5, background: f.c }} />
                <div style={{ fontFamily: KARLA, fontSize: 21, color: C.ink }}>
                  <b>{f.v}%</b> {f.k}
                </div>
              </div>
            ))}
          </div>
        </In>
      </div>
    </Scene>
  );
};

/* the ending: the ecosystem (AstroRaaga and its three products) opens an orbit for the investor */
const CX = 960;
const CY = 330;
const TILT = (-7 * Math.PI) / 180;
const ORBITS = [
  // th0/w chosen so no moon passes behind the logo while the card is on screen
  { name: "JyotiQ", rx: 360, ry: 100, col: C.violet, r: 14, th0: 1.9, w: 0.14 },
  { name: "KarmEQ", rx: 500, ry: 135, col: C.green, r: 16, th0: 0.2, w: 0.12 },
  { name: "GrovIT", rx: 640, ry: 172, col: C.teal, r: 13, th0: 3.6, w: 0.09 },
];
const YOU = { rx: 790, ry: 214 };
const onOrbit = (rx: number, ry: number, th: number): [number, number] => {
  const x = rx * Math.cos(th);
  const y = ry * Math.sin(th);
  return [CX + x * Math.cos(TILT) - y * Math.sin(TILT), CY + x * Math.sin(TILT) + y * Math.cos(TILT)];
};
const ellipse = (rx: number, ry: number) => {
  // as a path starting at the far right, so Draw can trace it
  const n = 72;
  let d = "";
  for (let i = 0; i <= n; i++) {
    const [x, y] = onOrbit(rx, ry, (i / n) * Math.PI * 2);
    d += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d;
};

const Planet: React.FC<{ x: number; y: number; r: number; col: string; glow: number }> = ({ x, y, r, col, glow }) => (
  <div
    style={{
      position: "absolute",
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: "50%",
      background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${col} 45%, ${col} 100%)`,
      boxShadow: `0 0 ${10 + 26 * glow}px ${col}${glow > 0.5 ? "AA" : "66"}`,
    }}
  />
);

export const CloseScene: React.FC = () => {
  const t = useWinT();
  const [a] = SCENES.close;
  const s19 = line("s19");
  const tPartner = word("s19", "partner");
  const tBe = word("s19", "be");
  const tTog = word("s19", "together");
  const tChange = word("s19", "change");
  const lock = prog(t, s19.start - 0.1, 1.0);
  const bloom = prog(t, s19.start - 0.25, 1.4) + 0.35 * Math.sin(Math.PI * prog(t, tChange - 0.05, 1.2, easeInOut));
  const push = lerp(1, 1.035, prog(t, s19.start, 125 - s19.start, easeInOut));
  const lit = Math.sin(Math.PI * prog(t, tChange - 0.05, 1.0, easeInOut));
  // the investor's orbit: drawn on "Partner", the gold orb arrives along it and keeps orbiting
  const youDraw = prog(t, tPartner - 0.25, 1.1, easeInOut);
  const youIn = prog(t, tPartner + 0.15, 1.3, easeInOut);
  const youTh = 0.62 - 0.9 * (1 - youIn) + 0.06 * (t - tPartner);
  const [yx, yy] = onOrbit(YOU.rx, YOU.ry, youTh);
  return (
    <Scene a={a} b={125.5} noOut inDur={0.5}>
      <Paper />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${push})` }}>
        {/* warm bloom behind the lockup */}
        <div
          style={{
            position: "absolute",
            left: CX - 760,
            top: CY - 400,
            width: 1520,
            height: 800,
            borderRadius: "50%",
            opacity: Math.min(1, bloom) * 0.9,
            transform: `scale(${0.6 + 0.4 * Math.min(1, bloom)})`,
            background: "radial-gradient(ellipse at center, rgba(245,158,11,0.22) 0%, rgba(234,88,12,0.08) 38%, rgba(0,0,0,0) 70%)",
          }}
        />
        {/* orbits */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {ORBITS.map((o, i) => (
            <Draw key={o.name} d={ellipse(o.rx, o.ry)} p={prog(t, s19.start + 0.35 + i * 0.18, 1.3, easeInOut)} stroke={`rgba(212,169,74,${0.5 + 0.3 * lit})`} width={1.6} />
          ))}
          <path d={ellipse(YOU.rx, YOU.ry)} fill="none" stroke={`rgba(234,88,12,${0.55 * youDraw})`} strokeWidth={2} strokeDasharray="7 11" strokeDashoffset={-t * 14} pathLength={1000} style={{ clipPath: `inset(0 ${(1 - youDraw) * 100}% 0 0)` }} />
        </svg>
        {/* a soft paper halo so the orbits pass behind the logo cleanly */}
        <div style={{ position: "absolute", left: CX - 330, top: CY - 120, width: 660, height: 240, borderRadius: "50%", background: "radial-gradient(ellipse at center, rgba(250,244,234,0.95) 0%, rgba(250,244,234,0.85) 45%, rgba(250,244,234,0) 72%)" }} />
        {/* the three products */}
        {ORBITS.map((o, i) => {
          const p = prog(t, s19.start + 0.7 + i * 0.2, 0.6);
          const [x, y] = onOrbit(o.rx, o.ry, o.th0 + o.w * (t - a));
          const sc = p * (1 + 0.25 * lit);
          return (
            <div key={o.name} style={{ position: "absolute", left: 0, top: 0, opacity: p }}>
              <div style={{ position: "absolute", left: x, top: y, transform: `scale(${sc})` }}>
                <Planet x={0} y={0} r={o.r} col={o.col} glow={lit} />
              </div>
              {/* the label sits on the side away from the logo */}
              <div
                style={{
                  position: "absolute",
                  left: x < CX ? x - o.r - 12 : x + o.r + 12,
                  top: y - 12,
                  transform: x < CX ? "translateX(-100%)" : undefined,
                  fontFamily: KARLA,
                  fontWeight: 700,
                  fontSize: 19,
                  letterSpacing: "0.06em",
                  color: o.col,
                  whiteSpace: "nowrap",
                }}
              >
                {o.name}
              </div>
            </div>
          );
        })}
        {/* the investor's place in the ecosystem */}
        {youIn > 0 && (
          <div style={{ position: "absolute", left: 0, top: 0, opacity: youIn }}>
            <div
              style={{
                position: "absolute",
                left: yx - 34,
                top: yy - 34,
                width: 68,
                height: 68,
                borderRadius: "50%",
                border: "2px solid rgba(245,158,11,0.55)",
                transform: `scale(${1 + 0.18 * Math.sin(t * 3)})`,
              }}
            />
            <div style={{ position: "absolute", left: yx, top: yy, transform: `scale(${1 + 0.3 * lit})` }}>
              <Planet x={0} y={0} r={20} col={C.amber} glow={0.6 + 0.4 * lit} />
            </div>
            <div style={{ position: "absolute", left: yx + 44, top: yy - 22 }}>
              <Pill size={24}>You</Pill>
            </div>
          </div>
        )}
        {/* logo */}
        <div style={{ position: "absolute", left: 0, right: 0, top: CY - 68, display: "flex", justifyContent: "center" }}>
          <div style={{ opacity: lock, transform: `translateY(${(1 - lock) * 24}px) scale(${0.94 + 0.06 * lock})`, filter: lock < 1 ? `blur(${(1 - lock) * 12}px)` : undefined }}>
            <Img src={asset("brand/logo_4x.png")} style={{ width: 440 }} />
          </div>
        </div>
        {/* the invitation */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 600, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <In t0={tPartner - 0.1} dur={0.8}>
            <Label style={{ justifyContent: "center" }}>Partner with us</Label>
          </In>
          <In t0={tBe - 0.12} dur={0.9} style={{ marginTop: 22 }}>
            <Headline size={64}>
              Be part of this <Accent>ecosystem</Accent>.
            </Headline>
          </In>
          <In t0={tTog - 0.12} dur={0.9} style={{ marginTop: 6 }}>
            <Headline size={64}>
              Together, let's bring the <Accent>change</Accent>.
            </Headline>
          </In>
          <In t0={tChange + 0.55} dur={0.8} style={{ marginTop: 40 }}>
            <Pill dark size={26}>
              astroraag.com
            </Pill>
          </In>
        </div>
      </div>
    </Scene>
  );
};

export const _f = [MARCELLUS, KARLA];
