import React from "react";
import { Img } from "remotion";
import { C, easeInOut, KARLA, line, MARCELLUS, money, prog, rnd, sc, word, isV5 } from "../theme";
import { Accent, asset, Card, Count, Draw, Headline, Icon, In, Label, Orb, Paper, Pill, useWinT } from "../ui";

/* ================= 08 · Traction ================= */
export const TractionBoard: React.FC = () => {
  const t = useWinT();
  const a = sc("traction").start;
  const tiles = [
    { to: 2000, suf: "+", k: "Downloads", s: "Android & iOS · India", icon: "sms", col: C.saffron, t0: word("traction_2", "two") - 0.2, hi: 0 },
    { to: 1000, suf: "+", k: "Registered users", s: "about half of installs", icon: "users", col: C.amber, t0: word("traction_2", "thousand", 1) - 0.2, hi: 0 },
    { to: 10000, suf: "+", k: "Questions asked", s: "≈ 10 per registered user", icon: "question", col: C.violet, t0: word("traction_2", "ten") - 0.2, hi: word("traction_2", "ten") },
    { to: 10, suf: "", k: "Verified advisors", s: "onboarded on KarmEQ", icon: "shield", col: C.teal, t0: word("traction_2", "verified") - 0.3, hi: word("traction_2", "verified") },
  ];
  const targets = [
    { v: "50,000", k: "users", w: "fifty", col: C.saffron, icon: "users" },
    { v: "20", k: "partnerships", w: "twenty", col: C.green, icon: "temple" },
    { v: "API", k: "enterprise integrations", w: "enterprise", col: C.sky, icon: "bolt" },
  ];
  return (
    <>
      <Paper />
      <div style={{ position: "absolute", left: 100, top: 60 }}>
        <In t0={a + 0.4}>
          <Label>11 · Traction & growth dashboard</Label>
        </In>
        <In t0={line("traction_1").start} dur={0.9} style={{ marginTop: 12 }}>
          <Headline size={52}>
            Where it stands. <Accent>Where it is going</Accent>.
          </Headline>
        </In>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "grid", gridTemplateColumns: "repeat(4, 400px)", justifyContent: "center", gap: 30 }}>
        {tiles.map((s) => {
          const glow = s.hi ? prog(t, s.hi - 0.1, 0.4) * (1 - 0.6 * prog(t, s.hi + 1.6, 0.6)) : 0;
          return (
            <In key={s.k} t0={s.t0} dy={22}>
              <Card style={{ padding: "26px 28px", height: 250, boxSizing: "border-box", borderColor: glow > 0 ? s.col : C.goldHair, boxShadow: glow > 0 ? `0 0 ${40 * glow}px ${s.col}55, 0 24px 60px rgba(124,45,18,0.09)` : undefined, transform: `scale(${1 + 0.04 * glow})` }}>
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
          <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 19, letterSpacing: "0.18em", color: C.goldDeep }}>CURRENT POSITION → PROJECTED GROWTH · TARGETS</div>
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

/* ================= 09 · Competition: others own one piece ================= */
const PLAYERS = [
  { k: "Astrology apps", w: "astrology", x: 470, y: 500, r: 190, rev: "Astrotalk FY26 $192M · AstroSage", piece: "Readings & calls", col: ["#FB923C", "#C2410C"] },
  { k: "Wellness apps", w: "wellness", x: 930, y: 400, r: 128, rev: "meditation, yoga, sleep", piece: "Wellness", col: ["#6EE7B7", "#059669"] },
  { k: "Coaching platforms", w: "coaching", x: 1240, y: 650, r: 128, rev: "life & career coaching", piece: "Coaching", col: ["#C4B5FD", "#7C3AED"] },
  { k: "Online communities", w: "communities", x: 1590, y: 420, r: 132, rev: "groups, forums, creators", piece: "Belonging", col: ["#7DD3FC", "#0284C7"] },
];

export const CompeteBoard: React.FC = () => {
  const t = useWinT();
  const a = sc("compete").start;
  const tConnect = word("compete_2", "connect");
  const thread = prog(t, tConnect - 0.4, 1.6, easeInOut);
  const hub = { x: 960, y: 900 };
  return (
    <>
      <Paper />
      <div style={{ position: "absolute", left: 100, top: 60 }}>
        <In t0={a + 0.4}>
          <Label>12 · Competitive landscape</Label>
        </In>
        <In t0={line("compete_1").start} dur={0.9} style={{ marginTop: 12 }}>
          <Headline size={52}>
            Others own one piece. <Accent>AstroRaaga connects them.</Accent>
          </Headline>
        </In>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {PLAYERS.map((p, i) => (
          <Draw key={i} d={`M${p.x} ${p.y + p.r} Q${(p.x + hub.x) / 2} ${hub.y - 40} ${hub.x} ${hub.y}`} p={thread} stroke="rgba(200,150,46,0.85)" width={3} />
        ))}
      </svg>
      {PLAYERS.map((p) => {
        const tIn = word("compete_1", p.w) - 0.25;
        const s = prog(t, tIn, 0.7);
        const tp = prog(t, word("compete_2", "piece") + 0.1 + PLAYERS.indexOf(p) * 0.15, 0.5);
        return (
          <div key={p.k}>
            <div style={{ position: "absolute", left: p.x - p.r, top: p.y - p.r, width: p.r * 2, height: p.r * 2, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, ${p.col[0]}, ${p.col[1]})`, transform: `scale(${s})`, opacity: 0.92, boxShadow: "0 20px 50px rgba(234,88,12,0.18)" }} />
            <div style={{ position: "absolute", left: p.x, top: p.y, transform: "translate(-50%, -50%)", opacity: s, textAlign: "center", width: p.r * 2.2 }}>
              <div style={{ fontFamily: MARCELLUS, fontSize: p.r > 150 ? 44 : 25, color: "#FFF8EE", textShadow: "0 3px 14px rgba(124,45,18,0.4)", lineHeight: 1.1 }}>{p.k}</div>
            </div>
            <div style={{ position: "absolute", left: p.x, top: p.y + p.r + 14, transform: "translateX(-50%)", opacity: s, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ fontFamily: KARLA, fontWeight: 600, fontSize: 19, color: C.ink2, whiteSpace: "nowrap" }}>{p.rev}</div>
              <div style={{ opacity: tp, transform: `scale(${0.8 + 0.2 * tp})`, padding: "6px 14px", borderRadius: 999, background: C.card, border: `1.5px solid ${C.goldHair}`, fontFamily: KARLA, fontWeight: 700, fontSize: 18, color: C.ink, whiteSpace: "nowrap" }}>
                Owns: {p.piece}
              </div>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: hub.x - 60, top: hub.y - 60, opacity: thread }}>
        <Orb size={120} t={t} glow={0.5} />
      </div>
      <div style={{ position: "absolute", left: hub.x + 80, top: hub.y - 22, opacity: thread }}>
        <Pill size={22}>AstroRaaga: verified experts · own intelligence · one journey</Pill>
      </div>
      <div style={{ position: "absolute", left: 100, bottom: 100, width: 600, fontFamily: KARLA, fontSize: 16, color: C.ink3, opacity: prog(t, tConnect + 0.6, 0.6) }}>
        Categories are directional. Astrotalk FY26 consolidated operating revenue ₹1,823 Cr (Moneycontrol), ₹95 = $1.
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
  { k: "Personal context", s: "Every interaction deepens the user's profile.", icon: "users", w: "personal", col: C.violet },
  { k: "Verified experts", s: "A vetted network that is hard to copy at scale.", icon: "shield", w: "verified", col: C.green },
  { k: "Owned distribution", s: "Temples, creators and referrals, not rented ads.", icon: "temple", w: "distribution", col: C.saffron },
  { k: "Continuity engine", s: "Keeps people engaged between sessions.", icon: "reset", w: "continuity", col: C.teal },
];

export const MoatBoard: React.FC = () => {
  const t = useWinT();
  const a = sc("moat").start;
  const cx = 400;
  const cy = 650;
  const R = 230;
  return (
    <>
      <Paper tint="rgba(200,150,46,0.08)" />
      <div style={{ position: "absolute", left: 100, top: 60, width: 1500 }}>
        <In t0={a + 0.4}>
          <Label>13 · Long-term vision & competitive advantage</Label>
        </In>
        <In t0={line("moat_1").start} dur={0.9} style={{ marginTop: 12 }}>
          <Headline size={50}>
            AI for <Accent>knowledge</Accent>. Humans for <Accent>wisdom</Accent>.
          </Headline>
        </In>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <Draw d={`M${cx} ${cy - R} A${R} ${R} 0 1 1 ${cx} ${cy + R} A${R} ${R} 0 1 1 ${cx} ${cy - R}`} p={prog(t, line("moat_1").start + 0.3, 2.2, easeInOut)} stroke="rgba(200,150,46,0.7)" width={3} />
      </svg>
      <div style={{ position: "absolute", left: cx - 75, top: cy - 75 }}>
        <In t0={line("moat_1").start + 0.3} s0={0.7} dy={0}>
          <Orb size={150} t={t} glow={0.4 + 0.3 * prog(t, line("moat_3").end - 0.4, 0.8)} />
        </In>
      </div>
      {JOURNEY.map((j, i) => {
        const an = (i / JOURNEY.length) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(an) * R;
        const y = cy + Math.sin(an) * R;
        const col = j.s === "live" ? C.green : j.s === "next" ? C.gold : C.saffron;
        return (
          <div key={j.k} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)" }}>
            <In t0={line("moat_1").start + 0.6 + i * 0.15} dy={0} s0={0.6} dur={0.5}>
              <div style={{ opacity: 0.45 + 0.55 * prog(t, word("moat_3", j.k.split(" ")[0].toLowerCase()) - 0.15, 0.4), transform: `scale(${1 + 0.12 * Math.sin(Math.PI * prog(t, word("moat_3", j.k.split(" ")[0].toLowerCase()) - 0.15, 0.8))})`, padding: "8px 14px", borderRadius: 999, background: C.card, border: `2px solid ${col}`, fontFamily: KARLA, fontWeight: 700, fontSize: 18, color: C.ink, whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(124,45,18,0.08)" }}>{j.k}</div>
            </In>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 160, top: 930, display: "flex", gap: 20, fontFamily: KARLA, fontSize: 17, color: C.ink3, opacity: prog(t, line("moat_1").start + 1.6, 0.5) }}>
        {[
          [C.green, "Live"],
          [C.gold, "Planned"],
          [C.saffron, "Future"],
        ].map(([c, k]) => (
          <span key={k}>
            <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 5, background: c, marginRight: 6 }} />
            {k}
          </span>
        ))}
      </div>
      <div style={{ position: "absolute", left: 790, top: 300 }}>
        <In t0={line("moat_1").start + 1.0}>
          <div style={{ fontFamily: KARLA, fontSize: 24, color: C.ink2, marginBottom: 18 }}>Astrology is the entry point. Human transformation is the opportunity.</div>
          <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 18, letterSpacing: "0.18em", color: C.goldDeep }}>FOUR PILLARS · THE MOAT COMPOUNDS</div>
        </In>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 470px)", gap: 26, marginTop: 20 }}>
          {PILLARS.map((p) => (
            <In key={p.k} t0={line("moat_1").start + 1.4 + PILLARS.indexOf(p) * 0.3} dy={18}>
              <Card style={{ padding: "26px 28px", height: 230, boxSizing: "border-box" }}>
                <div style={{ width: 54, height: 54, borderRadius: 16, background: `${p.col}1C`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={p.icon} size={30} color={p.col} />
                </div>
                <div style={{ fontFamily: MARCELLUS, fontSize: 34, color: C.ink, marginTop: 16 }}>{p.k}</div>
                <div style={{ fontFamily: KARLA, fontSize: 20, color: C.ink2, marginTop: 6, lineHeight: 1.3 }}>{p.s}</div>
              </Card>
            </In>
          ))}
        </div>
      </div>
    </>
  );
};

/* ================= 11 · The ask ================= */
const FUNDS = [
  { k: "Marketing + sales", v: 40, usd: "$400K", c: C.saffron, w: "forty" },
  { k: "Tech and AI", v: 30, usd: "$300K", c: C.violet, w: "thirty" },
  { k: "Wages", v: 20, usd: "$200K", c: C.green, w: "twenty" },
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
          <div style={{ fontFamily: KARLA, fontWeight: 600, fontSize: 30, color: C.ink2, letterSpacing: "0.04em" }}>Raising</div>
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
      <Paper />
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center" }}>
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
