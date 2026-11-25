import React from "react";
import { C, easeInOut, KARLA, line, MARCELLUS, money, prog, sc, word } from "../theme";
import { Accent, Card, Count, Draw, Headline, Icon, In, Label, Orb, Paper, Pill, useWinT } from "../ui";
import WORLD from "../worlddots.json";

/* ================= 04 · Market: India, North America, Latin America ================= */
const DOTS = WORLD.dots as [number, number, number][];
const REG_COL = ["", C.saffron, C.sky, C.green];

const Nested: React.FC<{ t: number; tT: number; tS: number; tO: number }> = ({ t, tT, tS, tO }) => {
  const rows = [
    { r: 112, col: C.saffron, a: 0.1, t0: tT, k: "TAM", v: money("₹17,100 Cr", "$1.8B"), s: "Digital astrology, India, 2030" },
    { r: 66, col: C.saffronDeep, a: 0.16, t0: tS, k: "SAM", v: money("₹1,637 Cr", "$173M"), s: "Earned today by the five leaders" },
    { r: 28, col: C.goldDeep, a: 0.32, t0: tO, k: "SOM", v: money("₹25 Cr", "$2.6M"), s: "Our goal by 2029" },
  ];
  return (
    <div style={{ position: "absolute", left: 1340, top: 450, width: 560, height: 380 }}>
      <In t0={tT - 0.5}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginLeft: 80 }}>
          <div style={{ fontFamily: MARCELLUS, fontSize: 42, color: C.ink }}>India</div>
          <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 16, letterSpacing: "0.18em", color: C.goldDeep }}>PHASE 1 · NOW</div>
        </div>
      </In>
      {rows.map((r) => {
        const p = prog(t, r.t0 - 0.1, 0.8);
        return <div key={r.k} style={{ position: "absolute", left: 112 - r.r, top: 330 - 2 * r.r, width: 2 * r.r, height: 2 * r.r, borderRadius: "50%", background: `${r.col}${Math.round(r.a * 255).toString(16).padStart(2, "0")}`, border: `2px solid ${r.col}`, transform: `scale(${p})`, transformOrigin: "50% 100%", opacity: p }} />;
      })}
      <div style={{ position: "absolute", left: 244, top: 100, display: "flex", flexDirection: "column", gap: 12 }}>
        {rows.map((r) => (
          <In key={r.k} t0={r.t0} dy={10} dur={0.6}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, whiteSpace: "nowrap" }}>
              <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 14, letterSpacing: "0.14em", color: r.col, width: 40 }}>{r.k}</div>
              <div style={{ fontFamily: MARCELLUS, fontSize: 28, color: C.ink, lineHeight: 1.1 }}>{r.v}</div>
            </div>
            <div style={{ fontFamily: KARLA, fontSize: 14, color: C.ink3, whiteSpace: "nowrap", marginLeft: 50 }}>{r.s}</div>
          </In>
        ))}
      </div>
    </div>
  );
};

const RegionCard: React.FC<{ x: number; y: number; t0: number; phase: string; name: string; value?: string; sub: string; col: string }> = ({ x, y, t0, phase, name, value, sub, col }) => (
  <div style={{ position: "absolute", left: x, top: y }}>
    <In t0={t0} dy={14}>
      <Card style={{ padding: "22px 26px", width: 340, borderColor: `${col}66` }}>
        <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 15, letterSpacing: "0.16em", color: col }}>{phase}</div>
        <div style={{ fontFamily: MARCELLUS, fontSize: 38, color: C.ink, marginTop: 4 }}>{name}</div>
        {value && <div style={{ fontFamily: MARCELLUS, fontSize: 34, color: col, marginTop: 6 }}>{value}</div>}
        <div style={{ fontFamily: KARLA, fontSize: 18, color: C.ink2, marginTop: 6, lineHeight: 1.3 }}>{sub}</div>
      </Card>
    </In>
  </div>
);

export const MarketBoard: React.FC = () => {
  const t = useWinT();
  const a = sc("market").start;
  const l2 = line("market_2");
  const l3 = line("market_3");
  const tLat = word("market_3", "latin");
  const hi = (r: number) => (r === 1 ? prog(t, l2.start - 0.2, 0.8) : r === 2 ? prog(t, l3.start - 0.2, 0.8) : r === 3 ? prog(t, tLat - 0.3, 0.8) : 0);
  const mapIn = prog(t, a + 0.3, 1.6, easeInOut);
  const h = [hi(1), hi(2), hi(3)];
  return (
    <>
      <Paper tint="rgba(2,132,199,0.06)" />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {DOTS.map(([x, y, r], i) => {
          const on = Math.min(1, Math.max(0, (mapIn * 2.2 - x / 1920) * 2));
          if (on <= 0) return null;
          const hl = r ? h[r - 1] : 0;
          return <circle key={i} cx={x} cy={y} r={hl > 0 ? 4.2 + 1.2 * hl : 4} fill={hl > 0 ? REG_COL[r] : "#D8C8AA"} opacity={on * (hl > 0 ? 0.55 + 0.45 * hl : 0.75)} />;
        })}
        {/* pulse rings on the highlighted regions */}
        {[1, 2, 3].map((r) => {
          const p = h[r - 1];
          if (p <= 0) return null;
          const c = (WORLD.centroid as Record<string, number[]>)[String(r)];
          const ph = (t * 0.7) % 1;
          return <circle key={r} cx={c[0]} cy={c[1]} r={30 + 90 * ph} fill="none" stroke={REG_COL[r]} strokeWidth={3} opacity={p * (1 - ph) * 0.7} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: 90, top: 60 }}>
        <In t0={a + 0.4}>
          <Label>The market</Label>
        </In>
        <In t0={line("market_1").start} dur={0.9} style={{ marginTop: 12 }}>
          <Headline size={50}>
            India first. North America next. <Accent>Latin America</Accent> after.
          </Headline>
        </In>
      </div>
      <Nested t={t} tT={word("market_2", "digital")} tS={word("market_2", "five")} tO={word("market_2", "goal")} />
      <RegionCard x={60} y={505} t0={l3.start} col={C.sky} phase="PHASE 2 · FROM H2 2027" name="North America" value={money("₹28,500 Cr", "$3B")} sub="US online astrology market today" />
      <RegionCard x={830} y={700} t0={tLat - 0.1} col={C.green} phase="PHASE 3 · AFTER NORTH AMERICA" name="Latin America" sub="Market sizing under way" />
      <div style={{ position: "absolute", left: 90, bottom: 40, fontFamily: KARLA, fontSize: 16, color: C.ink3, opacity: prog(t, l3.end, 0.6) }}>
        Indicative sizing from the investor deck (Nov 2026). Phase timings are proposals.
      </div>
    </>
  );
};

/* ================= 05 · Go-to-market: our own content engine, the channels, today's funnel ================= */
const CHANNELS = [
  { k: "Content engine", s: "Instagram & YouTube", icon: "play", w: "content", col: C.saffron },
  { k: "Partnerships", s: "Priests, temples, astrologers", icon: "temple", w: "partnerships", col: C.gold },
  { k: "Creator network", s: "Real stories, wider reach", icon: "users", w: "creator", col: C.violet },
  { k: "Referral programme", s: "Users become advocates", icon: "gift", w: "referral", col: C.green },
  { k: "NRI campaigns", s: "The Indian diaspora", icon: "globe", w: "diaspora", col: C.sky },
];

export const GtmBoard: React.FC = () => {
  const t = useWinT();
  const a = sc("gtm").start;
  const l1 = line("gtm_1");
  const l3 = line("gtm_3");
  const hx = 360;
  const hy = 600;
  const funnel = [
    { k: "Downloads", v: 2000, s: "App installs", pct: 1, t0: word("gtm_3", "two") - 0.15 },
    { k: "Registered", v: 1000, s: "≈ 50 %", pct: 0.5, t0: word("gtm_3", "thousand", 1) - 0.15 },
    { k: "Consultations", v: 15, s: "≈ 1.5 % · first paid", pct: 0.06, t0: word("gtm_3", "paid") - 0.2 },
  ];
  return (
    <>
      <Paper tint="rgba(5,150,105,0.06)" />
      <div style={{ position: "absolute", left: 90, top: 60 }}>
        <In t0={a + 0.4}>
          <Label>Go-to-market</Label>
        </In>
        <In t0={l1.start} dur={0.9} style={{ marginTop: 12 }}>
          <Headline size={50}>
            Build our own distribution <Accent>before</Accent> buying traffic.
          </Headline>
        </In>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {CHANNELS.map((c, i) => {
          const y = 300 + i * 132;
          const p = prog(t, word("gtm_2", c.w) - 0.3, 0.9, easeInOut);
          return <Draw key={c.k} d={`M${hx + 120} ${hy} C${hx + 260} ${hy}, ${hx + 260} ${y + 40}, ${hx + 400} ${y + 40}`} p={p} stroke="rgba(200,150,46,0.7)" width={2.6} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: hx - 120, top: hy - 120 }}>
        <In t0={l1.start + 0.4} s0={0.7} dy={0}>
          <Orb size={240} t={t} glow={0.45} />
        </In>
      </div>
      <div style={{ position: "absolute", left: hx - 170, top: hy + 140, width: 340, textAlign: "center" }}>
        <In t0={l1.start + 0.7}>
          <div style={{ fontFamily: MARCELLUS, fontSize: 32, color: C.ink, lineHeight: 1.15 }}>Our own content engine</div>
          <div style={{ fontFamily: KARLA, fontSize: 18, color: C.ink3, marginTop: 6 }}>proprietary social-media marketing</div>
        </In>
      </div>
      {CHANNELS.map((c, i) => (
        <div key={c.k} style={{ position: "absolute", left: hx + 410, top: 300 + i * 132 }}>
          <In t0={word("gtm_2", c.w) - 0.2} dx={-20} dy={0}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, width: 470, padding: "14px 20px", borderRadius: 20, background: C.card, border: `1.5px solid ${C.goldHair}`, boxShadow: "0 14px 32px rgba(124,45,18,0.07)" }}>
              <div style={{ width: 50, height: 50, borderRadius: 15, background: `${c.col}1C`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={c.icon} size={28} color={c.col} />
              </div>
              <div>
                <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 25, color: C.ink }}>{c.k}</div>
                <div style={{ fontFamily: KARLA, fontSize: 18, color: C.ink3 }}>{c.s}</div>
              </div>
            </div>
          </In>
        </div>
      ))}
      {/* today's funnel */}
      <div style={{ position: "absolute", left: 1330, top: 310, width: 520 }}>
        <In t0={l3.start - 0.2}>
          <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 17, letterSpacing: "0.18em", color: C.goldDeep }}>TODAY'S FUNNEL · ACTUAL</div>
        </In>
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 18 }}>
          {funnel.map((f) => {
            const p = prog(t, f.t0, 0.9, easeInOut);
            return (
              <div key={f.k} style={{ opacity: Math.min(1, p * 3) }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                  <div style={{ fontFamily: MARCELLUS, fontSize: 46, color: C.ink }}>
                    <Count to={f.v} t={t} t0={f.t0} dur={1.0} suffix="+" />
                  </div>
                  <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 22, color: C.ink2 }}>{f.k}</div>
                  <div style={{ fontFamily: KARLA, fontSize: 18, color: C.ink3 }}>{f.s}</div>
                </div>
                <div style={{ height: 16, borderRadius: 8, background: "rgba(200,150,46,0.14)", marginTop: 8, overflow: "hidden" }}>
                  <div style={{ width: `${Math.max(3, f.pct * 100) * p}%`, height: "100%", borderRadius: 8, background: `linear-gradient(90deg, ${C.saffron}, ${C.amber})` }} />
                </div>
              </div>
            );
          })}
        </div>
        <In t0={word("gtm_3", "closing") - 0.1} style={{ marginTop: 22 }}>
          <div style={{ fontFamily: KARLA, fontSize: 21, color: C.ink2, lineHeight: 1.35 }}>The gap between registering and paying is the first thing these channels will close.</div>
        </In>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 52, display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", padding: "0 120px" }}>
        {["CAC", "Cost per install", "Activation", "First paid conversion", "Repeat consultations", "D30 retention", "Referral share"].map((k, i) => (
          <div key={k} style={{ opacity: prog(t, l3.end + 0.1 + i * 0.07, 0.4), padding: "8px 16px", borderRadius: 999, border: `1.5px solid ${C.goldHair}`, background: C.card, fontFamily: KARLA, fontWeight: 600, fontSize: 18, color: C.ink2 }}>
            {k}
          </div>
        ))}
      </div>
    </>
  );
};

/* ================= 06 · Business model: the giant wheel ================= */
const CABINS = [
  { L: "Q", k: "Question", s: "JyotiQ · pay per question", col: C.violet, live: true },
  { L: "C", k: "Consultation", s: "KarmEQ · commission", col: C.green, live: true },
  { L: "P", k: "Programmes", s: "Courses & plans", col: C.saffron, live: false },
  { L: "M", k: "Community", s: "Member belonging", col: C.sky, live: false },
  { L: "R", k: "Repeat", s: "Lifetime engagement", col: C.gold, live: false },
];

export const ModelBoard: React.FC = () => {
  const t = useWinT();
  const a = sc("model").start;
  const cx = 1180;
  const cy = 540;
  const R = 300;
  const spin = (t - a) * 0.1 + 0.4;
  const draw = prog(t, a + 0.3, 1.2, easeInOut);
  const hiT = [word("model_2", "question"), word("model_2", "consultation"), word("model_2", "programmes"), word("model_2", "community"), word("model_2", "lifetime")];
  return (
    <>
      <Paper tint="rgba(124,58,237,0.06)" />
      <div style={{ position: "absolute", left: 110, top: 200, width: 600 }}>
        <In t0={a + 0.4}>
          <Label>Business model</Label>
        </In>
        <In t0={line("model_1").start} dur={0.9} style={{ marginTop: 20 }}>
          <Headline size={66}>
            One seeker. <Accent>Many orders.</Accent>
          </Headline>
        </In>
        <In t0={word("model_1", "high") - 0.1} style={{ marginTop: 18 }}>
          <div style={{ fontFamily: KARLA, fontSize: 28, color: C.ink2 }}>A high lifetime value.</div>
        </In>
        <div style={{ marginTop: 40, display: "flex", gap: 20 }}>
          <In t0={hiT[0]}>
            <Pill size={20} icon={<div style={{ width: 10, height: 10, borderRadius: 5, background: C.green }} />}>Live today</Pill>
          </In>
          <In t0={hiT[2]}>
            <Pill size={20} icon={<div style={{ width: 10, height: 10, borderRadius: 5, background: C.goldLight }} />}>Coming next</Pill>
          </In>
        </div>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <Draw d={`M${cx - R} ${cy} A${R} ${R} 0 1 1 ${cx + R} ${cy} A${R} ${R} 0 1 1 ${cx - R} ${cy}`} p={draw} stroke="rgba(200,150,46,0.7)" width={3} />
        <Draw d={`M${cx - R * 0.72} ${cy} A${R * 0.72} ${R * 0.72} 0 1 1 ${cx + R * 0.72} ${cy} A${R * 0.72} ${R * 0.72} 0 1 1 ${cx - R * 0.72} ${cy}`} p={draw} stroke="rgba(200,150,46,0.4)" width={1.8} />
        {Array.from({ length: 10 }).map((_, i) => {
          const an = spin + (i / 10) * Math.PI * 2;
          return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(an) * R} y2={cy + Math.sin(an) * R} stroke="rgba(200,150,46,0.3)" strokeWidth={1.6} opacity={draw} />;
        })}
        <Draw d={`M${cx} ${cy} L${cx - 170} ${cy + R + 140} M${cx} ${cy} L${cx + 170} ${cy + R + 140} M${cx - 240} ${cy + R + 140} H${cx + 240}`} p={draw} stroke="rgba(140,118,96,0.55)" width={2.6} />
      </svg>
      <div style={{ position: "absolute", left: cx - 80, top: cy - 80, width: 160, height: 160, display: "flex", alignItems: "center", justifyContent: "center", opacity: draw }}>
        <Orb size={150} t={t} glow={0.4} />
        <div style={{ position: "absolute", fontFamily: KARLA, fontWeight: 700, fontSize: 22, color: "#fff", textAlign: "center", lineHeight: 1.1, textShadow: "0 2px 10px rgba(124,45,18,0.6)" }}>
          One
          <br />
          seeker
        </div>
      </div>
      {CABINS.map((c, i) => {
        const an = spin + (i / 5) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(an) * R;
        const y = cy + Math.sin(an) * R;
        const glow = prog(t, hiT[i] - 0.05, 0.3) * (1 - 0.5 * prog(t, (hiT[i + 1] ?? hiT[i] + 1.2) - 0.1, 0.5));
        return (
          <div key={c.k} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -20%)" }}>
            <In t0={a + 0.6 + i * 0.12} dur={0.6} s0={0.6} dy={0}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px 12px 12px", borderRadius: 20, background: C.card, border: `1.5px solid ${glow > 0 ? c.col : C.goldHair}`, boxShadow: glow > 0 ? `0 0 ${36 * glow}px ${c.col}66, 0 14px 30px rgba(124,45,18,0.1)` : "0 14px 30px rgba(124,45,18,0.1)", transform: `scale(${1 + 0.08 * glow})`, whiteSpace: "nowrap", opacity: c.live ? 1 : 0.88 }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: c.col, color: "#fff", fontFamily: MARCELLUS, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.L}</div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 23, color: C.ink }}>{c.k}</div>
                    <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 12, letterSpacing: "0.14em", padding: "3px 7px", borderRadius: 999, background: c.live ? `${C.green}1A` : `${C.gold}1F`, color: c.live ? C.green : C.goldDeep }}>{c.live ? "LIVE" : "NEXT"}</div>
                  </div>
                  <div style={{ fontFamily: KARLA, fontSize: 17, color: C.ink3 }}>{c.s}</div>
                </div>
              </div>
            </In>
          </div>
        );
      })}
    </>
  );
};

/* ================= 07 · Roadmap: three phases, three years of revenue ================= */
const PHASES = [
  { k: "Launch & grow", d: "Nov 2026 – May 2027", items: ["KarmEQ v2", "SEO & performance marketing", "NRI onboarding", "First temple & creator partners"], col: C.saffron },
  { k: "Global scale", d: "Jun – Nov 2027", items: ["JyotiQ in new markets", "10+ languages", "100+ advisors"], col: C.sky },
  { k: "Ecosystem", d: "Dec 2027 – May 2028", items: ["Temple partnerships", "Offline guidance centres", "Courses & heritage tourism"], col: C.green },
];

export const RoadmapBoard: React.FC = () => {
  const t = useWinT();
  const a = sc("roadmap").start;
  const l2 = line("roadmap_2");
  const l3 = line("roadmap_3");
  const pT = [l2.start - 0.1, word("roadmap_2", "scale") - 0.2, word("roadmap_2", "then") - 0.2];
  const years = [
    { y: "2027", base: 0.5, down: 0.19, lab: money("₹0.5 Cr", "$53K"), t0: word("roadmap_3", money("half", "fifty")) - 0.2 },
    { y: "2028", base: 5, down: 1.88, lab: money("₹5 Cr", "$0.53M"), t0: word("roadmap_3", money("five", "half")) - 0.2 },
    { y: "2029", base: 25, down: 9.38, lab: money("₹25 Cr", "$2.6M"), t0: word("roadmap_3", money("twenty-five", "two")) - 0.2 },
  ];
  const H = 300;
  return (
    <>
      <Paper tint="rgba(14,116,144,0.06)" />
      <div style={{ position: "absolute", left: 100, top: 60 }}>
        <In t0={a + 0.4}>
          <Label>Product & financial roadmap</Label>
        </In>
        <In t0={line("roadmap_1").start} dur={0.9} style={{ marginTop: 12 }}>
          <Headline size={50}>
            18 months of product. <Accent>Three years</Accent> of revenue.
          </Headline>
        </In>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <Draw d="M140 250 H1780" p={prog(t, l2.start - 0.3, 3.2, easeInOut)} stroke="rgba(200,150,46,0.6)" width={3} />
      </svg>
      <div style={{ position: "absolute", left: 140, top: 228, display: "flex", gap: 40 }}>
        {PHASES.map((ph, i) => (
          <div key={ph.k} style={{ width: 520 }}>
            <In t0={pT[i]} dy={18}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: ph.col, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MARCELLUS, fontSize: 24, boxShadow: `0 0 0 8px ${ph.col}22` }}>{i + 1}</div>
              <Card style={{ marginTop: 20, padding: "22px 26px", minHeight: 200, boxSizing: "border-box" }}>
                <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 16, letterSpacing: "0.14em", color: ph.col }}>{ph.d.toUpperCase()}</div>
                <div style={{ fontFamily: MARCELLUS, fontSize: 34, color: C.ink, marginTop: 4 }}>{ph.k}</div>
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                  {ph.items.map((it) => (
                    <div key={it} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: KARLA, fontSize: 20, color: C.ink2 }}>
                      <div style={{ width: 6, height: 6, borderRadius: 3, background: ph.col }} />
                      {it}
                    </div>
                  ))}
                </div>
              </Card>
            </In>
          </div>
        ))}
      </div>
      {/* growth assumptions */}
      <div style={{ position: "absolute", left: 140, top: 640, width: 560 }}>
        <In t0={l3.start - 0.3}>
          <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 17, letterSpacing: "0.18em", color: C.goldDeep }}>THE PLAN BEHIND IT</div>
          {[
            ["Users", "10,000 → 50,000 → 250,000"],
            ["Advisors", "100+ → 500+ → 2,000+"],
            ["Paying share", "10 % → 20 % → 20 %"],
          ].map(([k, v]) => (
            <div key={k} style={{ marginTop: 16 }}>
              <div style={{ fontFamily: KARLA, fontSize: 19, color: C.ink3 }}>{k}</div>
              <div style={{ fontFamily: MARCELLUS, fontSize: 32, color: C.ink }}>{v}</div>
            </div>
          ))}
        </In>
      </div>
      {/* revenue bars, base vs downside */}
      <div style={{ position: "absolute", left: 820, top: 610, width: 980, height: 400 }}>
        <In t0={l3.start - 0.3}>
          <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 17, letterSpacing: "0.18em", color: C.goldDeep }}>REVENUE · BASE PLAN {money("(₹ CRORE)", "(USD)")}</div>
        </In>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, height: H, display: "flex", alignItems: "flex-end", justifyContent: "space-around" }}>
          {years.map((y) => {
            const p = prog(t, y.t0, 0.9, easeInOut);
            return (
              <div key={y.y} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 220 }}>
                <div style={{ fontFamily: MARCELLUS, fontSize: 36, color: C.ink, opacity: p, marginBottom: 10 }}>{y.lab}</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: H - 70 }}>
                  <div style={{ width: 70, height: Math.max(4, ((H - 70) * y.base) / 25) * p, borderRadius: "10px 10px 0 0", background: `linear-gradient(180deg, ${C.amber}, ${C.saffron})` }} />
                  <div style={{ width: 34, height: Math.max(3, ((H - 70) * y.down) / 25) * p, borderRadius: "8px 8px 0 0", background: "rgba(200,150,46,0.35)" }} />
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", justifyContent: "space-around" }}>
          {years.map((y) => (
            <div key={y.y} style={{ width: 220, textAlign: "center", fontFamily: KARLA, fontWeight: 700, fontSize: 22, color: C.ink2 }}>
              {y.y}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", right: 0, top: 0, display: "flex", gap: 18, fontFamily: KARLA, fontSize: 16, color: C.ink3, opacity: prog(t, years[2].t0 + 0.6, 0.5) }}>
          <span>
            <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 3, background: C.saffron, marginRight: 6 }} />
            Base
          </span>
          <span>
            <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 3, background: "rgba(200,150,46,0.35)", marginRight: 6 }} />
            Downside
          </span>
        </div>
      </div>
    </>
  );
};
