import React from "react";
import { Img } from "remotion";
import { C, easeInOut, KARLA, lerp, line, MARCELLUS, money, prog, rnd, sc, word, isV5 } from "../theme";
import { Accent, asset, Card, Count, Draw, Headline, Icon, In, Label, Paper, useWinT, v7img } from "../ui";

/* ================= 08 · Traction ================= */
export const TractionBoard: React.FC = () => {
  const t = useWinT();
  const a = sc("traction").start;
  const tiles = [
    { to: 2000, suf: "+", k: "Downloads", s: "Android & iOS · India", icon: "sms", col: C.saffron, t0: word("traction_2", "two") - 0.2, hi: 0 },
    { to: 1000, suf: "+", k: "Registered users", s: "about half of installs", icon: "users", col: C.amber, t0: word("traction_2", "thousand", 1) - 0.2, hi: 0 },
    { to: 10000, suf: "+", k: "Questions asked", s: "≈ 10 per registered user", icon: "question", col: C.mercury, t0: word("traction_2", "ten") - 0.2, hi: word("traction_2", "ten") },
    { to: 10, suf: "", k: "Verified advisors", s: "onboarded on KarmEQ", icon: "shield", col: C.teal, t0: word("traction_2", "verified") - 0.3, hi: word("traction_2", "verified") },
  ];
  const targets = [
    { v: "50,000", k: "users", w: "fifty", col: C.saffron, icon: "users" },
    { v: "20", k: "partnerships", w: "twenty", col: C.jupiter, icon: "temple" },
    { v: "API", k: "enterprise integrations", w: "enterprise", col: C.sky, icon: "bolt" },
  ];
  return (
    <>
      <Paper />
      <div style={{ position: "absolute", left: 160, top: 88 }}>
        <In t0={a + 0.4}>
          <Label>11 · Traction & growth dashboard</Label>
        </In>
        <In t0={line("traction_1").start} dur={0.9} style={{ marginTop: 0 }}>
          <Headline size={44}>
            Where it stands. <Accent>Where it is going</Accent>.
          </Headline>
        </In>
      </div>
      <div style={{ position: "absolute", left: 160, top: 206 }}>
        <In t0={line("traction_2").start - 0.4} dy={10}>
          <div style={{ fontFamily: MARCELLUS, fontSize: 40, color: C.ink }}>
            Current <Accent>position</Accent>
          </div>
        </In>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 268, display: "grid", gridTemplateColumns: "repeat(4, 400px)", justifyContent: "center", gap: 30 }}>
        {tiles.map((s, ti) => {
          const scr = ["06", "11", "14", ""][ti];
          const glow = s.hi ? prog(t, s.hi - 0.1, 0.4) * (1 - 0.6 * prog(t, s.hi + 1.6, 0.6)) : 0;
          return (
            <In key={s.k} t0={s.t0} dy={22}>
              <Card style={{ position: "relative", overflow: "hidden", padding: "26px 28px", height: 250, boxSizing: "border-box", borderColor: glow > 0 ? s.col : C.goldHair, boxShadow: glow > 0 ? `0 0 ${40 * glow}px ${s.col}55, 0 24px 60px rgba(124,45,18,0.09)` : undefined, transform: `scale(${1 + 0.04 * glow})` }}>
                {/* v7: the matching real screen behind the number */}
                {scr && <Img src={asset(`v7/screens/jy_${scr}.png`)} style={{ position: "absolute", right: -20, top: 20, width: 170, borderRadius: 18, opacity: 0.22, transform: "rotate(6deg)" }} />}
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 50, height: 50, borderRadius: 15, background: `${s.col}1C`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={s.icon} size={27} color={s.col} />
                  </div>
                  <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 25, color: C.ink }}>{s.k}</div>
                </div>
                <div style={{ fontFamily: MARCELLUS, fontSize: 74, color: C.ink, marginTop: 18, lineHeight: 1 }}>
                  <Count to={Number(s.to)} t={t} t0={s.t0} dur={1.2} prefix="" suffix={s.suf} />
                </div>
                <div style={{ fontFamily: KARLA, fontSize: 20, color: C.ink3, marginTop: 10 }}>{s.s}</div>
              </Card>
            </In>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center" }}>
        <In t0={line("traction_3").start - 0.2} dy={10}>
          <div style={{ fontFamily: MARCELLUS, fontSize: 40, color: C.ink }}>
            Projected growth → <Accent>Targets</Accent>
          </div>
        </In>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <Draw d="M260 540 C 600 600, 1300 600, 1660 540" p={prog(t, line("traction_3").start - 0.4, 1.4, easeInOut)} stroke="rgba(234,88,12,0.45)" width={2.4} dash="6 10" />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 630, display: "flex", justifyContent: "center", gap: 36 }}>
        {targets.map((g) => {
          const t0 = word("traction_3", g.w) - 0.25;
          const p = prog(t, t0, 0.7);
          return (
            <In key={g.k} t0={t0} dy={24} dur={0.7}>
              <div style={{ width: 460, height: 250, boxSizing: "border-box", padding: "28px 32px", borderRadius: 26, background: `linear-gradient(160deg, ${C.card} 0%, ${g.col}12 100%)`, border: `2px dashed ${g.col}88`, boxShadow: `0 0 ${30 * p}px ${g.col}22` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Icon name={g.icon} size={28} color={g.col} />
                  <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 16, letterSpacing: "0.18em", color: g.col }}>TARGET</div>
                </div>
                <div style={{ fontFamily: MARCELLUS, fontSize: 84, color: C.ink, lineHeight: 1, marginTop: 18 }}>{g.v}</div>
                <div style={{ fontFamily: KARLA, fontWeight: 600, fontSize: 25, color: C.ink2, marginTop: 10 }}>{g.k}</div>
              </div>
            </In>
          );
        })}
      </div>
    </>
  );
};

/* ================= 12 · Competition (v7, Amit sir): the temple metaphor. Each kind of player owns one corner of the mela;
   AstroRaaga is the temple at the centre that connects them all. ================= */
const PLAYERS = [
  { k: "Astrology apps", w: "astrology", x: 330, y: 330, sub: "Astrotalk · AstroSage", piece: "Readings & calls", col: C.saffron },
  { k: "Wellness apps", w: "wellness", x: 1590, y: 330, sub: "meditation, yoga, sleep", piece: "Wellness", col: C.mercury },
  { k: "Coaching platforms", w: "coaching", x: 330, y: 820, sub: "life & career coaching", piece: "Coaching", col: C.rahu },
  { k: "Online communities", w: "communities", x: 1590, y: 820, sub: "groups, forums, creators", piece: "Belonging", col: C.sky },
];

export const CompeteBoard: React.FC = () => {
  const t = useWinT();
  const a = sc("compete").start;
  const tConnect = word("compete_2", "connect");
  const thread = prog(t, tConnect - 0.4, 1.6, easeInOut);
  const hub = { x: 960, y: 560 };
  return (
    <>
      <Paper />
      {/* the temple ecosystem painting */}
      <div style={{ position: "absolute", left: 100, top: 200, width: 1720, height: 800, borderRadius: 34, overflow: "hidden", border: `1.5px solid ${C.goldHair}`, boxShadow: "0 30px 80px rgba(124,45,18,0.15)" }}>
        <In t0={a + 0.2} dy={0} dur={1.2} style={{ width: "100%", height: "100%" }}>
          <Img src={v7img("temple", "family")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.08 - 0.05 * prog(t, a, 18)})` }} />
        </In>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 45%, rgba(255,245,226,0) 30%, rgba(255,245,226,${0.35 + 0.3 * thread}) 100%)` }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 104, textAlign: "center" }}>
        <In t0={a + 0.4}>
          <Label style={{ justifyContent: "center" }}>12 · Competitive landscape</Label>
        </In>
        <In t0={line("compete_1").start} dur={0.9} style={{ marginTop: 4 }}>
          <Headline size={54}>
            Others own one piece. <Accent>AstroRaaga connects them.</Accent>
          </Headline>
        </In>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {PLAYERS.map((p, i) => (
          <Draw key={i} d={`M${p.x} ${p.y} Q${(p.x + hub.x) / 2} ${(p.y + hub.y) / 2 - 60} ${hub.x} ${hub.y}`} p={thread} stroke="rgba(245,158,11,0.95)" width={4} />
        ))}
      </svg>
      {PLAYERS.map((p, i) => {
        const tIn = word("compete_1", p.w) - 0.25;
        const s = prog(t, tIn, 0.7);
        const tp = prog(t, word("compete_2", "piece") + 0.1 + i * 0.15, 0.5);
        return (
          <div key={p.k} style={{ position: "absolute", left: p.x, top: p.y, transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * s})`, opacity: s }}>
            <div style={{ padding: "18px 24px", borderRadius: 22, background: "rgba(255,253,249,0.95)", border: `2.5px solid ${p.col}`, boxShadow: `0 18px 40px ${p.col}33`, textAlign: "center", whiteSpace: "nowrap" }}>
              <div style={{ fontFamily: MARCELLUS, fontSize: 38, color: C.ink, lineHeight: 1 }}>{p.k}</div>
              <div style={{ fontFamily: KARLA, fontWeight: 600, fontSize: 19, color: C.ink3, marginTop: 6 }}>{p.sub}</div>
              <div style={{ opacity: tp, marginTop: 10, display: "inline-block", padding: "5px 14px", borderRadius: 999, background: `${p.col}18`, fontFamily: KARLA, fontWeight: 800, fontSize: 19, color: C.ink }}>Owns: {p.piece}</div>
            </div>
          </div>
        );
      })}
      {/* AstroRaaga: the temple at the centre */}
      <div style={{ position: "absolute", left: hub.x, top: hub.y, transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * thread})`, opacity: thread }}>
        <div style={{ position: "absolute", left: -140, top: -140, width: 280, height: 280, borderRadius: "50%", background: `radial-gradient(circle, rgba(245,158,11,${0.5 + 0.15 * Math.sin(t * 3)}) 0%, rgba(245,158,11,0) 70%)` }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "18px 26px", borderRadius: 26, background: "rgba(255,253,249,0.96)", border: `3px solid ${C.saffron}`, boxShadow: "0 24px 60px rgba(234,88,12,0.35)" }}>
          <Img src={asset("brand/icon_4x.png")} style={{ width: 84, height: 84, objectFit: "contain" }} />
          <div style={{ fontFamily: MARCELLUS, fontSize: 40, color: C.ink, lineHeight: 1 }}>AstroRaaga</div>
          <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 18, color: C.ink2 }}>verified experts · own intelligence · one journey</div>
        </div>
      </div>
    </>
  );
};

/* ================= 10 · Our edge: long-term vision and defensibility ================= */
const JOURNEY = [
  { k: "Discovery", s: "live" },
  { k: "Booking", s: "live" },
  { k: "Learning", s: "next" },
  { k: "Wellness", s: "next" },
  { k: "Community", s: "next" },
  { k: "Retreats", s: "next" },
  { k: "Lifetime loyalty", s: "future" },
];
const PILLARS = [
  { k: "Personal context", s: "Every interaction deepens the user's profile.", icon: "users", w: "personal", col: C.rahu },
  { k: "Verified experts", s: "A vetted network that is hard to copy at scale.", icon: "shield", w: "verified", col: C.ketu },
  { k: "Owned distribution", s: "Temples, creators and referrals, not rented ads.", icon: "temple", w: "distribution", col: C.saffron },
  { k: "Continuity engine", s: "Keeps people engaged between sessions.", icon: "reset", w: "continuity", col: C.teal },
];

export const MoatBoard: React.FC = () => {
  const t = useWinT();
  const l1 = line("moat_1");
  const l2 = line("moat_2");
  const l3 = line("moat_3");
  // v7 (Amit sir): AI side in Rahu violet, human side in Ketu white-gold (the rishi); then the pillars; then the journey as a river
  const fold = prog(t, l2.start - 0.4, 1.1, easeInOut);
  const river = prog(t, l3.start - 0.4, 1.1, easeInOut);
  const H = lerp(700, 190, fold);
  const NODES = Array.from({ length: 26 }, (_, i) => ({ x: 40 + rnd(i * 7 + 1) * 780, y: 30 + rnd(i * 7 + 2) * 640 }));
  return (
    <>
      <Paper tint="rgba(200,150,46,0.08)" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 112, textAlign: "center" }}>
        <In t0={l1.start - 0.2} dur={0.9}>
          <Headline size={54}>
            AI for <Accent>knowledge</Accent>. Humans for <Accent>wisdom</Accent>.
          </Headline>
        </In>
      </div>
      {/* the split */}
      <div style={{ position: "absolute", left: 100, top: 210, width: 1720, height: H, display: "flex", gap: 14 }}>
        <In t0={l1.start} dx={-40} dy={0} dur={0.9} style={{ flex: 1, height: "100%" }}>
          <div style={{ position: "relative", height: "100%", borderRadius: 30, overflow: "hidden", background: `radial-gradient(900px 600px at 40% 40%, #4C1D95 0%, #2E1065 55%, #1E0B45 100%)`, boxShadow: "0 30px 70px rgba(76,29,149,0.3)" }}>
            <svg width={860} height={700} style={{ position: "absolute", left: 0, top: 0, transform: `scale(${lerp(1, 0.7, fold)})`, transformOrigin: "50% 0%" }}>
              {NODES.map((n, i) => {
                const m = NODES[(i * 5 + 3) % NODES.length];
                const k = NODES[(i * 11 + 7) % NODES.length];
                const pulse = 0.35 + 0.35 * Math.sin(t * 2.2 + i);
                return (
                  <g key={i}>
                    <line x1={n.x} y1={n.y} x2={m.x} y2={m.y} stroke="#C4B5FD" strokeWidth={1.4} opacity={0.25 + 0.2 * pulse} />
                    <line x1={n.x} y1={n.y} x2={k.x} y2={k.y} stroke="#A78BFA" strokeWidth={1} opacity={0.18} />
                    <circle cx={n.x} cy={n.y} r={4 + 3 * pulse} fill="#DDD6FE" opacity={0.6 + 0.4 * pulse} />
                  </g>
                );
              })}
            </svg>
            <div style={{ position: "absolute", left: 50, bottom: lerp(50, 34, fold) }}>
              <div style={{ fontFamily: KARLA, fontWeight: 800, fontSize: 20, letterSpacing: "0.22em", color: "#C4B5FD" }}>RAHU · AI</div>
              <div style={{ fontFamily: MARCELLUS, fontSize: lerp(72, 46, fold), color: "#F5F3FF", lineHeight: 1 }}>Knowledge</div>
            </div>
          </div>
        </In>
        <In t0={word("moat_1", "humans") - 0.2} dx={40} dy={0} dur={0.9} style={{ flex: 1, height: "100%" }}>
          <div style={{ position: "relative", height: "100%", borderRadius: 30, overflow: "hidden", background: "#FFF4D6", boxShadow: "0 30px 70px rgba(184,145,58,0.3)" }}>
            <Img src={v7img("rishi", "pandit")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%", transform: `scale(${1.03 + 0.04 * prog(t, l1.start, 8)})` }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(255,244,214,0.92) 0%, rgba(255,244,214,0.2) 45%, rgba(255,244,214,0) 70%)" }} />
            <div style={{ position: "absolute", right: 50, bottom: lerp(50, 34, fold), textAlign: "right" }}>
              <div style={{ fontFamily: KARLA, fontWeight: 800, fontSize: 20, letterSpacing: "0.22em", color: C.ketu }}>KETU · HUMANS</div>
              <div style={{ fontFamily: MARCELLUS, fontSize: lerp(72, 46, fold), color: C.ink, lineHeight: 1 }}>Wisdom</div>
            </div>
          </div>
        </In>
      </div>
      {/* the four pillars */}
      <div style={{ position: "absolute", left: 100, top: 430, width: 1720, opacity: fold }}>
        <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 19, letterSpacing: "0.18em", color: C.goldDeep, textAlign: "center" }}>ASTROLOGY IS THE ENTRY POINT · HUMAN TRANSFORMATION IS THE OPPORTUNITY · THE MOAT COMPOUNDS</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginTop: 18 }}>
          {PILLARS.map((p) => (
            <In key={p.k} t0={word("moat_2", p.w) - 0.3} dy={18}>
              <Card style={{ padding: "22px 24px", height: 200, boxSizing: "border-box" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 50, height: 50, borderRadius: 15, background: `${p.col}1C`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={p.icon} size={28} color={p.col} />
                  </div>
                  <div style={{ fontFamily: MARCELLUS, fontSize: 32, color: C.ink, lineHeight: 1.05 }}>{p.k}</div>
                </div>
                <div style={{ fontFamily: KARLA, fontSize: 21, color: C.ink2, marginTop: 14, lineHeight: 1.3 }}>{p.s}</div>
              </Card>
            </In>
          ))}
        </div>
      </div>
      {/* the journey as a river past milestone plaques */}
      <div style={{ position: "absolute", left: 100, top: 712, width: 1720, height: 270, borderRadius: 28, overflow: "hidden", opacity: river, border: `1.5px solid ${C.goldHair}` }}>
        <Img src={v7img("river", "courtyard")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 60%", transform: `translateX(${-20 * prog(t, l3.start, 9)}px) scale(1.05)` }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(28,21,14,0.55), rgba(28,21,14,0.05))" }} />
        <svg width={1720} height={270} style={{ position: "absolute", inset: 0 }}>
          <Draw d="M40 200 C 300 150, 520 230, 800 180 S 1350 140, 1680 190" p={prog(t, l3.start, 2.4, easeInOut)} stroke="rgba(255,236,190,0.9)" width={5} />
        </svg>
        {JOURNEY.map((j, i) => {
          const x = 70 + i * 262;
          const tw = word("moat_3", j.k.split(" ")[0].toLowerCase());
          const on = prog(t, tw - 0.2, 0.4);
          const col = j.s === "live" ? C.mercury : j.s === "next" ? C.gold : C.saffron;
          return (
            <div key={j.k} style={{ position: "absolute", left: x, top: 40 + (i % 2) * 34, opacity: 0.35 + 0.65 * on, transform: `scale(${0.92 + 0.08 * on + 0.08 * Math.sin(Math.PI * prog(t, tw - 0.2, 0.8))})`, transformOrigin: "50% 100%" }}>
              <div style={{ padding: "10px 16px", borderRadius: 12, background: "rgba(255,250,240,0.95)", border: `2px solid ${col}`, boxShadow: "0 10px 24px rgba(28,21,14,0.25)", fontFamily: KARLA, fontWeight: 800, fontSize: 21, color: C.ink, whiteSpace: "nowrap" }}>{j.k}</div>
              <div style={{ width: 3, height: 34, background: "rgba(255,250,240,0.85)", margin: "0 auto" }} />
            </div>
          );
        })}
        <div style={{ position: "absolute", right: 24, bottom: 16, display: "flex", gap: 16, fontFamily: KARLA, fontWeight: 700, fontSize: 16, color: "#FFF4E2" }}>
          {[[C.mercury, "Live"], [C.gold, "Planned"], [C.saffron, "Future"]].map(([c, k]) => (
            <span key={k}>
              <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 5, background: c, marginRight: 6 }} />
              {k}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

/* ================= 11 · The ask ================= */
const FUNDS = [
  { k: "Marketing + sales", v: 40, usd: "$400K", c: C.saffron, w: "forty" },
  { k: "Tech and AI", v: 30, usd: "$300K", c: C.rahu, w: "thirty" },
  { k: "Wages", v: 20, usd: "$200K", c: C.saturn, w: "twenty" },
  { k: "Operations + partnerships", v: 10, usd: "$100K", c: C.gold, w: "ten" },
];

const Lamp: React.FC<{ t: number; t0: number; tLight: number }> = ({ t, t0, tLight }) => {
  const d = (k: number, dur = 0.8) => prog(t, t0 + k, dur, easeInOut);
  const lit = prog(t, tLight, 0.6);
  const fl = 1 + 0.07 * Math.sin(t * 11) + 0.04 * Math.sin(t * 17);
  const ink = "rgba(168,119,25,0.85)";
  return (
    <svg width={360} height={520} viewBox="0 0 360 520" style={{ overflow: "visible" }}>
      {lit > 0 && <circle cx={180} cy={120} r={190 * lit} fill={`rgba(245,158,11,${0.16 * lit})`} />}
      <Draw d="M110 500 H250 M130 500 Q130 470 180 462 Q230 470 230 500" p={d(0)} stroke={ink} width={2.6} />
      <Draw d="M180 462 V250 M168 440 H192 M166 380 H194 M168 320 H192" p={d(0.15)} stroke={ink} width={2.6} />
      <Draw d="M80 230 Q180 290 280 230 Q260 200 180 196 Q100 200 80 230 Z" p={d(0.3)} stroke={ink} width={2.6} />
      <Draw d="M100 222 Q180 262 260 222" p={d(0.45)} stroke="rgba(168,119,25,0.45)" width={1.8} />
      <Draw d="M180 196 V172" p={d(0.55, 0.4)} stroke={ink} width={2.2} />
      {lit > 0 && (
        <g transform={`translate(180 168) scale(${lit * fl})`}>
          <path d="M0 -70 Q26 -24 0 0 Q-26 -24 0 -70 Z" fill="url(#flame4)" />
          <path d="M0 -40 Q10 -18 0 -4 Q-10 -18 0 -40 Z" fill="#FFF7E0" />
        </g>
      )}
      <defs>
        <radialGradient id="flame4" cx="0.5" cy="0.75" r="0.8">
          <stop offset="0" stopColor="#FFF3C4" />
          <stop offset="0.45" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#EA580C" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export const AskBoard: React.FC = () => {
  const t = useWinT();
  const a = sc("ask").start;
  const l = line("ask_1");
  const tLight = word("ask_1", "light") - 0.05;
  return (
    <>
      <Paper />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 60 }).map((_, i) => {
          const an = rnd(i) * Math.PI * 2;
          const rr = 260 + rnd(i + 70) * 900;
          const x = 1610 + Math.cos(an) * rr;
          const y = 370 + Math.sin(an) * rr * 0.62;
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
      <div style={{ position: "absolute", left: 1430, top: 250 }}>
        <Lamp t={t} t0={a + 0.1} tLight={tLight} />
      </div>
      <div style={{ position: "absolute", left: 140, top: 200, width: 1100 }}>
        <In t0={a + 0.3}>
          <Label>14 · Funding needs</Label>
        </In>
        <In t0={l.start - 0.05} dur={0.9} style={{ marginTop: 26 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ fontFamily: KARLA, fontWeight: 600, fontSize: 30, color: C.ink2, letterSpacing: "0.04em" }}>Raising</div>
            {/* v7 (Amit sir): the round is Angel / Pre-seed */}
            <div style={{ padding: "8px 20px", borderRadius: 999, background: C.black, color: "#FFF4E2", fontFamily: KARLA, fontWeight: 700, fontSize: 24, letterSpacing: "0.12em", opacity: prog(t, word("ask_1", "angel") - 0.15, 0.5) }}>ANGEL / PRE-SEED ROUND</div>
          </div>
          <Headline size={150} style={{ lineHeight: 1 }}>
            <Accent>{money("₹10 Cr", "$1M")}</Accent>
          </Headline>
        </In>
        <In t0={tLight - 0.1} dur={0.8} style={{ marginTop: 14 }}>
          <Headline size={46} color={C.ink2}>
            to light up the whole mela.
          </Headline>
        </In>
        <div style={{ marginTop: 46 }}>
          <In t0={word("ask_2", "forty") - 0.5} dur={0.6}>
            <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 19, letterSpacing: "0.18em", color: C.goldDeep, marginBottom: 14 }}>USE OF FUNDS · $1M</div>
          </In>
          <div style={{ display: "flex", width: 1100, height: 26, borderRadius: 13, overflow: "hidden", background: "rgba(200,150,46,0.12)" }}>
            {FUNDS.map((f) => {
              const p = prog(t, word("ask_2", f.w) - 0.2, 0.8, easeInOut);
              return <div key={f.k} style={{ width: `${f.v * p}%`, background: f.c, marginRight: 3 }} />;
            })}
          </div>
          <div style={{ display: "flex", gap: 18, marginTop: 22 }}>
            {FUNDS.map((f) => {
              const p = prog(t, word("ask_2", f.w) - 0.1, 0.6);
              return (
                <div key={f.k} style={{ width: f.k.length > 14 ? 300 : 250, opacity: p, transform: `translateY(${(1 - p) * 14}px) scale(${0.92 + 0.08 * p})`, transformOrigin: "0% 0%" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <div style={{ fontFamily: MARCELLUS, fontSize: 56, color: f.c, lineHeight: 1 }}>{f.v}%</div>
                    <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 22, color: C.ink2 }}>{f.usd}</div>
                  </div>
                  <div style={{ fontFamily: KARLA, fontWeight: 600, fontSize: 22, color: C.ink, marginTop: 6 }}>{f.k}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

/* ================= 12 · The team ================= */
const PW = 300;
const PH = 400;
const Member: React.FC<{ t: number; t0: number; photo: string; name: string; role: string; chips: { k: string; t0: number }[] }> = ({ t, t0, photo, name, role, chips }) => {
  const reveal = prog(t, t0 + 0.1, 1.0, easeInOut);
  const kb = 1.07 - 0.07 * prog(t, t0, 7, easeInOut);
  return (
    <div style={{ width: 780, flexShrink: 0 }}>
      <In t0={t0} dy={24}>
        <Card style={{ padding: 24, display: "flex", gap: 30, alignItems: "center" }}>
          <div style={{ position: "relative", width: PW, height: PH, flexShrink: 0, borderRadius: `${PW / 2}px ${PW / 2}px 22px 22px`, overflow: "hidden", background: "linear-gradient(180deg, #FDF0DC 0%, #F5C28A 100%)", boxShadow: "0 18px 44px rgba(124,45,18,0.16)" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 60%)" }} />
            <Img src={asset(photo)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 100%", transform: `scale(${kb}) translateY(${(1 - reveal) * 30}px)`, transformOrigin: "50% 35%", opacity: reveal }} />
            <div style={{ position: "absolute", inset: 9, borderRadius: `${PW / 2 - 9}px ${PW / 2 - 9}px 15px 15px`, border: "1.5px solid rgba(255,248,236,0.75)" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>
            <div style={{ fontFamily: MARCELLUS, fontSize: 40, color: C.ink, lineHeight: 1.05, whiteSpace: "nowrap" }}>{name}</div>
            <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 17, letterSpacing: "0.18em", color: C.goldDeep, marginTop: 12 }}>{role}</div>
            <div style={{ width: 56, height: 2, background: C.goldHair, marginTop: 20, marginBottom: 22 }} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 11, minHeight: 4 * 52 + 3 * 11 }}>
              {chips.map((c) => (
                <In key={c.k} t0={c.t0} dy={8} dur={0.5}>
                  <div style={{ padding: "9px 16px", borderRadius: 999, background: "rgba(200,150,46,0.09)", border: `1.5px solid ${C.goldHair}`, fontFamily: KARLA, fontWeight: 600, fontSize: 21, color: C.ink, whiteSpace: "nowrap" }}>{c.k}</div>
                </In>
              ))}
            </div>
          </div>
        </Card>
      </In>
    </div>
  );
};

export const TeamBoard: React.FC = () => {
  const t = useWinT();
  const a = sc("team").start;
  const tAmit = word("team_2", "amit");
  const tShi = word("team_3", "doctor");
  return (
    <>
      {/* v7: Saturn (deep indigo) accent for discipline and the team */}
      <Paper tint="rgba(55,48,163,0.10)" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 84, textAlign: "center" }}>
        <In t0={a + 0.3}>
          <Label style={{ justifyContent: "center" }}>02 · Meet the team</Label>
        </In>
        <In t0={line("team_1").start} dur={0.9} style={{ marginTop: 14 }}>
          <Headline size={52}>
            Technology and <Accent>human experience</Accent>, under one roof.
          </Headline>
        </In>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 240, display: "flex", justifyContent: "center", gap: 40 }}>
        <Member
          t={t}
          t0={Math.min(tAmit - 0.5, line("team_1").start + 0.9)}
          photo="team/amit.png"
          name="Amit Kaushik"
          role="FOUNDER & CEO"
          chips={[
            { k: "22+ years building platforms", t0: word("team_2", "twenty-two") },
            { k: isV5() ? "Builds platforms that solve problems" : "Fiserv · Intuit · Infosys", t0: word("team_2", "fiserv") },
            { k: isV5() ? "Digital transformation expert" : "MBA, Thunderbird", t0: word("team_2", "infosys") + 0.1 },
            { k: "Practitioner of Vedic sciences", t0: word("team_2", "infosys") + 0.35 },
          ]}
        />
        <Member
          t={t}
          t0={Math.min(tShi - 0.5, line("team_1").start + 1.5)}
          photo="team/shishira.png"
          name="Dr. Shishira Sharma"
          role="CO-FOUNDER & COO"
          chips={[
            { k: "20+ years in wellness", t0: word("team_3", "twenty") },
            { k: "PLR therapist & life coach", t0: word("team_3", "healing") },
            { k: "Operations & community", t0: word("team_3", "transformation") },
          ]}
        />
      </div>
      {/* the wider team: a line of text for now (no group photo yet) */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 790, display: "flex", justifyContent: "center" }}>
        <In t0={word("team_4", "twenty") - 0.15} dy={10}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 30px", borderRadius: 999, background: C.card, border: `1.5px solid ${C.goldHair}`, boxShadow: "0 14px 34px rgba(124,45,18,0.08)" }}>
            <Icon name="users" size={26} color={C.saffron} />
            <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 24, color: C.ink }}>
              And a team of <span style={{ color: C.saffron }}>twenty</span>, building it every day
            </div>
          </div>
        </In>
      </div>
    </>
  );
};
