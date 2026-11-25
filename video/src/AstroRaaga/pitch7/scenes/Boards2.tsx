import React from "react";
import { C, easeInOut, KARLA, line, MARCELLUS, prog, sc, word, JY, KM } from "../theme";
import { Accent, BrandIcon, Card, Draw, Headline, Icon, In, Label, Orb, Paper, Pill, useWinT, v7img } from "../ui";
import { Img } from "remotion";
import WORLD from "../worlddots.json";

/* ================= 04 · Market: India, North America, Latin America ================= */
const DOTS = WORLD.dots as [number, number, number][];
const REG_COL = ["", C.saffron, C.sky, C.green];

const Nested: React.FC<{ t: number; tT: number; tS: number; tO: number }> = ({ t, tT, tS, tO }) => {
  const rows = [
    { r: 112, col: C.saffron, a: 0.1, t0: tT, k: "ADOPTION", v: "958M online", s: "India, 2025 (IAMAI–Kantar)" },
    { r: 66, col: C.saffronDeep, a: 0.16, t0: tS, k: "LEADER", v: "$192M · ₹1,823 Cr", s: "Astrotalk revenue, FY26" },
    { r: 28, col: C.goldDeep, a: 0.32, t0: tO, k: "TARGET", v: "$829K · ₹7.9 Cr", s: "AstroRaaga India, Year 3 run rate" },
  ];
  return (
    <div style={{ position: "absolute", left: 1290, top: 540, width: 610, height: 400 }}>
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
      <div style={{ position: "absolute", left: 244, top: 90, display: "flex", flexDirection: "column", gap: 14 }}>
        {rows.map((r) => (
          <In key={r.k} t0={r.t0} dy={10} dur={0.6}>
            <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 18, letterSpacing: "0.14em", color: r.col }}>{r.k}</div>
            <div style={{ fontFamily: MARCELLUS, fontSize: 38, color: C.ink, lineHeight: 1.1, whiteSpace: "nowrap" }}>{r.v}</div>
            <div style={{ fontFamily: KARLA, fontSize: 19, color: C.ink3, whiteSpace: "nowrap" }}>{r.s}</div>
          </In>
        ))}
      </div>
    </div>
  );
};

const RegionCard: React.FC<{ x: number; y: number; t0: number; phase: string; name: string; value?: string; sub: string; col: string }> = ({ x, y, t0, phase, name, value, sub, col }) => (
  <div style={{ position: "absolute", left: x, top: y }}>
    <In t0={t0} dy={14}>
      <Card style={{ padding: "22px 26px", width: 380, borderColor: `${col}66` }}>
        <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 18, letterSpacing: "0.14em", color: col }}>{phase}</div>
        <div style={{ fontFamily: MARCELLUS, fontSize: 46, color: C.ink, marginTop: 4 }}>{name}</div>
        {value && <div style={{ fontFamily: MARCELLUS, fontSize: 34, color: col, marginTop: 6 }}>{value}</div>}
        <div style={{ fontFamily: KARLA, fontSize: 21, color: C.ink2, marginTop: 6, lineHeight: 1.3 }}>{sub}</div>
      </Card>
    </In>
  </div>
);

export const MarketBoard: React.FC = () => {
  const t = useWinT();
  const a = sc("market").start;
  const l2 = line("market_2");
  const l3 = line("market_3");
  const l4 = line("market_4");
  const tLat = word("market_4", "latin");
  const hi = (r: number) => (r === 1 ? prog(t, l2.start - 0.2, 0.8) : r === 2 ? prog(t, l3.start - 0.2, 0.8) : r === 3 ? prog(t, tLat - 0.3, 0.8) : 0);
  void l4;
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
      <div style={{ position: "absolute", left: 90, top: 76 }}>
        <In t0={a + 0.4}>
          <Label>07 · Market opportunity & geographic expansion</Label>
        </In>
        <In t0={line("market_1").start} dur={0.9} style={{ marginTop: 12 }}>
          <Headline size={50}>
            India first. Then the <Accent>American continent</Accent>.
          </Headline>
        </In>
      </div>
      <Nested t={t} tT={word("market_2", "nine")} tS={word("market_2", "astrotalk")} tO={word("market_2", "year", 1)} />
      <RegionCard x={60} y={500} t0={l3.start} col={C.sky} phase="PHASE 2 · US, THEN CANADA" name="North America" value="$300K / yr target" sub="5.2M Indian-origin people in the US (Pew, 2023) · 830K Hindus in Canada (Census 2021)" />
      <RegionCard x={1290} y={160} t0={word("market_4", "subcontinent") - 0.2} col={C.saffronDeep} phase="PHASE 3 · ONCE PROVEN" name="Indian subcontinent" sub="Nepal, Bangladesh, Sri Lanka" />
      <RegionCard x={760} y={720} t0={tLat - 0.1} col={C.green} phase="PHASE 3 · ONCE PROVEN" name="Latin America" sub="The rest of the American continent" />
      <div style={{ position: "absolute", left: 90, bottom: 100, fontFamily: KARLA, fontSize: 16, color: C.ink3, opacity: prog(t, l4.end, 0.6) }}>
        Indicators show reach and paid demand, not AstroRaaga's TAM. Year 3 figures are illustrative run-rate targets (₹95 = $1).
      </div>
    </>
  );
};

/* ================= 05 · Go-to-market: our own content engine, the channels, today's funnel ================= */
const CHANNELS = [
  { k: "Direct outreach", s: "Astrologers in Delhi NCR", icon: "phone", w: "direct", col: C.saffron },
  { k: "Professional communities", s: "Hindi & English markets", icon: "users", w: "communities", col: C.violet },
  { k: "Partnerships", s: "Priests and temples", icon: "temple", w: "partnerships", col: C.gold },
  { k: "Referrals", s: "Users become advocates", icon: "gift", w: "referrals", col: C.green },
  { k: "Own content engine", s: "Instagram & YouTube", icon: "play", w: "content", col: C.sky },
];

export const GtmBoard: React.FC = () => {
  const t = useWinT();
  const a = sc("gtm").start;
  const l1 = line("gtm_1");
  const l3 = line("gtm_3");
  const hx = 360;
  const hy = 600;
  const metros = [
    { k: "Dallas–Fort Worth", s: "US pilot", t0: word("gtm_3", "dallas") - 0.15, col: C.sky },
    { k: "New Jersey · Edison", s: "US pilot", t0: word("gtm_3", "jersey") - 0.2, col: C.sky },
    { k: "San Francisco Bay Area", s: "US pilot", t0: word("gtm_3", "bay") - 0.2, col: C.sky },
    { k: "Greater Toronto", s: "Canada, after US proof", t0: word("gtm_3", "toronto") - 0.15, col: C.green },
  ];
  return (
    <>
      <Paper tint="rgba(5,150,105,0.06)" />
      <div style={{ position: "absolute", left: 90, top: 84 }}>
        <In t0={a + 0.4}>
          <Label>08 · Go-to-market strategy</Label>
        </In>
        <In t0={l1.start} dur={0.9} style={{ marginTop: 12 }}>
          <Headline size={50}>
            <Accent>Distribution-led</Accent> growth.
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
          <div style={{ fontFamily: MARCELLUS, fontSize: 32, color: C.ink, lineHeight: 1.15 }}>Delhi NCR beachhead</div>
          <div style={{ fontFamily: KARLA, fontSize: 18, color: C.ink3, marginTop: 6 }}>professionals first, then consumers</div>
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
      {/* North America pilots */}
      <div style={{ position: "absolute", left: 1330, top: 300, width: 520 }}>
        <In t0={l3.start - 0.2}>
          <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 17, letterSpacing: "0.18em", color: C.goldDeep }}>NORTH AMERICA · PHASED PILOTS</div>
        </In>
        <svg width={60} height={460} style={{ position: "absolute", left: 22, top: 70 }}>
          <Draw d="M8 10 V420" p={prog(t, metros[0].t0, metros[3].t0 - metros[0].t0 + 0.5, easeInOut)} stroke="rgba(2,132,199,0.45)" width={3} dash="5 9" />
        </svg>
        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 22 }}>
          {metros.map((m) => (
            <In key={m.k} t0={m.t0} dx={-16} dy={0} dur={0.6}>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ width: 22, height: 22, borderRadius: 11, background: m.col, boxShadow: `0 0 0 7px ${m.col}22` }} />
                <div style={{ padding: "14px 20px", borderRadius: 18, background: C.card, border: `1.5px solid ${m.col}44`, boxShadow: "0 12px 28px rgba(124,45,18,0.07)", minWidth: 380 }}>
                  <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 25, color: C.ink }}>{m.k}</div>
                  <div style={{ fontFamily: KARLA, fontSize: 18, color: m.col }}>{m.s}</div>
                </div>
              </div>
            </In>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 110, display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", padding: "0 120px" }}>
        {["Acquire", "Activate", "Retain", "Acquisition cost", "Repeat paid use", "CAC payback"].map((k, i) => (
          <div key={k} style={{ opacity: prog(t, word("gtm_3", "measured") + i * 0.08, 0.4), padding: "8px 16px", borderRadius: 999, border: `1.5px solid ${C.goldHair}`, background: C.card, fontFamily: KARLA, fontWeight: 600, fontSize: 18, color: C.ink2 }}>
            {k}
          </div>
        ))}
      </div>
    </>
  );
};

/* ================= 06 · Business model: the giant wheel ================= */
const CABINS = [
  { L: "S", k: "Subscriptions", s: "KarmEQ · professionals", col: KM, live: true },
  { L: "T", k: "AI tokens", s: "JyotiQ · per question", col: JY, live: true },
  { L: "W", k: "White-label licensing", s: "B2B · businesses", col: C.saffron, live: false },
  { L: "A", k: "Enterprise APIs", s: "B2B · integrations", col: C.sky, live: false },
  { L: "X", k: "Cross-selling", s: "Across the whole journey", col: C.gold, live: false },
];

export const ModelBoard: React.FC = () => {
  const t = useWinT();
  const a = sc("model").start;
  const cx = 1180;
  const cy = 540;
  const R = 300;
  const spin = (t - a) * 0.1 + 0.4;
  const draw = prog(t, a + 0.3, 1.2, easeInOut);
  const hiT = [word("model_2", "subscriptions"), word("model_2", "tokens"), word("model_2", "licensing"), word("model_2", "enterprise"), word("model_2", "cross")];
  return (
    <>
      <Paper tint="rgba(124,58,237,0.06)" />
      <div style={{ position: "absolute", left: 110, top: 200, width: 600 }}>
        <In t0={a + 0.4}>
          <Label style={{ whiteSpace: "nowrap" }}>09 · Business model & revenue streams</Label>
        </In>
        <In t0={line("model_1").start} dur={0.9} style={{ marginTop: 20 }}>
          <Headline size={66}>
            One seeker. <Accent>Many orders.</Accent>
          </Headline>
        </In>
        <In t0={word("model_1", "five") - 0.1} style={{ marginTop: 18 }}>
          <div style={{ fontFamily: KARLA, fontSize: 28, color: C.ink2 }}>Five revenue streams.</div>
        </In>
        <div style={{ marginTop: 40, display: "flex", gap: 20 }}>
          <In t0={hiT[0]}>
            <Pill size={20} icon={<div style={{ width: 10, height: 10, borderRadius: 5, background: C.green }} />}>Launch streams</Pill>
          </In>
          <In t0={hiT[2]}>
            <Pill size={20} icon={<div style={{ width: 10, height: 10, borderRadius: 5, background: C.goldLight }} />}>B2B and scale streams</Pill>
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
                    <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 12, letterSpacing: "0.14em", padding: "3px 7px", borderRadius: 999, background: c.live ? `${C.green}1A` : `${C.gold}1F`, color: c.live ? C.green : C.goldDeep }}>{c.live ? "FIRST" : "NEXT"}</div>
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

/* ================= 10 · Roadmap (v7, Amit sir): Year 1 / 2 / 3 with KarmEQ and JyotiQ as parallel tracks; white-label API
   removed (B2B priest connectivity instead); a picture that changes with each year; the Year 3 run rate (to verify before
   release); then "beyond Year 3": spiritual tourism.
 * Year 3 run rate from the deck: KarmEQ India SaaS ₹3.6 Cr, marketplace ₹1.875 Cr, JyotiQ India ₹2.4 Cr (= ₹7.875 Cr, $829K at ₹95)
 * plus North America $150K KarmEQ + $150K JyotiQ. Illustrative, not an audited forecast. */
const YEARS = [
  { y: "Year 1", k: "Validate · India", col: C.saffron },
  { y: "Year 2", k: "Retention & margin", col: C.teal },
  { y: "Year 3", k: "Scale · US, then Canada", col: C.goldDeep },
];
type Cell = { k: string; chips: string[]; extra?: string };
const TRACKS: { which: "karmeq" | "jyotiq"; name: string; col: string; cells: Cell[] }[] = [
  { which: "karmeq" as const, name: "KarmEQ", col: KM, cells: [
    { k: "Subscriptions + puja marketplace", chips: ["Q1 · 5 pandits", "Q2 · 12", "Q3 · + numerologists", "Q4 · + vastu"], extra: "B2B priest connectivity" },
    { k: "Deeper retention, more categories", chips: ["Margin per booking", "Repeat families"] },
    { k: "US marketplace, then Canada", chips: ["Diaspora pujas", "Local + remote priests"] },
  ] },
  { which: "jyotiq" as const, name: "JyotiQ", col: JY, cells: [
    { k: "Paid JyotiQ live in India", chips: ["Paid chat & guidance", "Hindi + English"] },
    { k: "Retention & personal context", chips: ["Remembers every seeker", "Live calling"] },
    { k: "US & Canada seekers", chips: ["Diaspora guidance", "Shared tech layer"] },
  ] },
];
const COLX = [420, 900, 1380];
const COLW = 450;

export const RoadmapBoard: React.FC = () => {
  const t = useWinT();
  const a = sc("roadmap").start;
  const l2 = line("roadmap_2");
  const l3 = line("roadmap_3");
  const l4 = line("roadmap_4");
  const tY = [word("roadmap_2", "year"), word("roadmap_2", "year", 1), word("roadmap_2", "year", 2)];
  const tIn = word("roadmap_3", "eight") - 0.3;
  const tNA = word("roadmap_3", "plus") - 0.2;
  const yr = t < tY[1] - 0.2 ? 0 : t < tY[2] - 0.2 ? 1 : 2;
  const beyond = prog(t, l4.start - 0.2, 1.0, easeInOut);
  const PICS: [string, string, string][] = [
    ["pandit", "pandit", "Year 1 · India: professionals and families on KarmEQ, seekers on JyotiQ"],
    ["family", "family", "Year 2 · the same families come back"],
    ["nri", "family", "Year 3 · the diaspora in the US, then Canada"],
  ];
  return (
    <>
      <Paper tint="rgba(14,116,144,0.06)" />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 - 0.06 * beyond})`, filter: beyond > 0.02 ? `blur(${6 * beyond}px)` : undefined, opacity: 1 - 0.6 * beyond }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 104, textAlign: "center" }}>
          <In t0={a + 0.4}>
            <Label style={{ justifyContent: "center" }}>10 · Roadmap</Label>
          </In>
          <In t0={line("roadmap_1").start} dur={0.9} style={{ marginTop: 4 }}>
            <Headline size={54}>
              Year by year. <Accent>KarmEQ and JyotiQ</Accent>, side by side.
            </Headline>
          </In>
        </div>
        {/* year headers */}
        {YEARS.map((y, i) => (
          <div key={y.y} style={{ position: "absolute", left: COLX[i], top: 226, width: COLW }}>
            <In t0={tY[i] - 0.25} dy={12} dur={0.6}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 18px", borderRadius: 16, background: yr === i ? `${y.col}1F` : "rgba(255,253,249,0.7)", border: `2px solid ${yr === i ? y.col : C.goldHair}` }}>
                <div style={{ fontFamily: MARCELLUS, fontSize: 34, color: C.ink }}>{y.y}</div>
                <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 18, letterSpacing: "0.08em", color: y.col }}>{y.k}</div>
              </div>
            </In>
          </div>
        ))}
        {/* parallel tracks */}
        {TRACKS.map((tr, r) => {
          const y0 = 312 + r * 170;
          return (
            <div key={tr.name}>
              <div style={{ position: "absolute", left: 120, top: y0 + 26 }}>
                <In t0={l2.start - 0.2 + r * 0.2} dx={-20} dy={0}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <BrandIcon which={tr.which} size={64} />
                    <div style={{ fontFamily: MARCELLUS, fontSize: 42, color: C.ink }}>{tr.name}</div>
                  </div>
                </In>
              </div>
              <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                <Draw d={`M${COLX[0] - 20} ${y0 + 60} H${COLX[2] + COLW}`} p={prog(t, tY[0] - 0.2, tY[2] - tY[0] + 1.2, easeInOut)} stroke={`${tr.col}88`} width={3} />
              </svg>
              {tr.cells.map((c, i) => {
                const t0 = tY[i] + 0.15 + r * 0.25;
                return (
                  <div key={i} style={{ position: "absolute", left: COLX[i], top: y0 }}>
                    <In t0={t0} dy={16} dur={0.6}>
                      <div style={{ width: COLW, minHeight: 138, boxSizing: "border-box", padding: "16px 20px", borderRadius: 20, background: C.card, border: `2px solid ${tr.col}${yr === i ? "AA" : "44"}`, boxShadow: yr === i ? `0 18px 40px ${tr.col}26` : "0 10px 26px rgba(124,45,18,0.06)" }}>
                        <div style={{ fontFamily: KARLA, fontWeight: 800, fontSize: 24, color: C.ink, lineHeight: 1.15 }}>{c.k}</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                          {c.chips.map((ch, k) => (
                            <div key={ch} style={{ opacity: prog(t, t0 + 0.3 + k * 0.15, 0.4), padding: "4px 11px", borderRadius: 999, background: `${tr.col}14`, border: `1.5px solid ${tr.col}44`, fontFamily: KARLA, fontWeight: 700, fontSize: 16, color: C.ink2 }}>{ch}</div>
                          ))}
                          {c.extra && <div style={{ opacity: prog(t, t0 + 1.0, 0.4), padding: "4px 11px", borderRadius: 999, background: C.black, fontFamily: KARLA, fontWeight: 700, fontSize: 16, color: "#FFF4E2" }}>{c.extra}</div>}
                        </div>
                      </div>
                    </In>
                  </div>
                );
              })}
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 420, top: 652, fontFamily: KARLA, fontSize: 15, color: C.ink3, opacity: prog(t, tY[0] + 1.6, 0.5) }}>KarmEQ quarters are example targets from the founder's plan.</div>
        {/* the bottom half: a picture that changes with each year */}
        <div style={{ position: "absolute", left: 120, top: 690, width: 1000, height: 300, borderRadius: 26, overflow: "hidden", border: `1.5px solid ${C.goldHair}`, boxShadow: "0 24px 60px rgba(124,45,18,0.12)", opacity: prog(t, tY[0], 0.8) }}>
          {PICS.map(([n, fb, cap], i) => {
            const p = i === 0 ? 1 : prog(t, tY[i] - 0.2, 0.8);
            if (p <= 0) return null;
            return (
              <div key={n + i} style={{ position: "absolute", inset: 0, opacity: p }}>
                <Img src={v7img(n, fb)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.03 + 0.03 * prog(t, tY[i], 6)})` }} />
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "40px 26px 18px", background: "linear-gradient(0deg, rgba(28,21,14,0.72), rgba(28,21,14,0))", fontFamily: KARLA, fontWeight: 700, fontSize: 24, color: "#FFF4E2" }}>{cap}</div>
              </div>
            );
          })}
        </div>
        {/* Year 3 run rate (numbers to verify before release) */}
        <div style={{ position: "absolute", left: 1170, top: 690 }}>
          <In t0={l3.start - 0.3} dy={16}>
            <Card style={{ width: 630, height: 300, boxSizing: "border-box", padding: "24px 30px", borderColor: C.gold }}>
              <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 16, letterSpacing: "0.16em", color: C.goldDeep }}>YEAR 3 · ILLUSTRATIVE RUN RATE</div>
              <div style={{ fontFamily: MARCELLUS, fontSize: 68, color: C.ink, lineHeight: 1.05, marginTop: 6, opacity: prog(t, tNA + 0.6, 0.6) }}>
                <Accent>$1.13M</Accent>
              </div>
              {[
                ["India", 829, tIn, C.saffron],
                ["North America", 300, tNA, C.sky],
              ].map(([k, v, t0, col]) => {
                const p = prog(t, t0 as number, 0.8, easeInOut);
                return (
                  <div key={k as string} style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12 }}>
                    <div style={{ width: 150, fontFamily: KARLA, fontWeight: 700, fontSize: 20, color: C.ink2 }}>{k}</div>
                    <div style={{ width: ((v as number) / 829) * 300 * p, height: 26, borderRadius: 8, background: col as string }} />
                    <div style={{ fontFamily: MARCELLUS, fontSize: 28, color: C.ink, opacity: p }}>${v}K</div>
                  </div>
                );
              })}
            </Card>
          </In>
        </div>
      </div>
      {/* beyond Year 3: spiritual tourism (motion grammar: the roadmap drops back, the picture comes forward) */}
      {beyond > 0 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: beyond, transform: `scale(${0.82 + 0.18 * beyond})` }}>
          <div style={{ position: "relative", width: 1500, height: 760, borderRadius: 36, overflow: "hidden", boxShadow: "0 60px 140px rgba(44,24,16,0.35)", border: `2px solid ${C.goldHair}` }}>
            <Img src={v7img("ghats", "temple")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.05 * prog(t, l4.start, 9)})` }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(28,21,14,0.78) 0%, rgba(28,21,14,0.35) 48%, rgba(28,21,14,0) 75%)" }} />
            <div style={{ position: "absolute", left: 70, top: 110, width: 760 }}>
              <div style={{ fontFamily: KARLA, fontWeight: 800, fontSize: 22, letterSpacing: "0.22em", color: "#FCD34D" }}>BEYOND YEAR 3</div>
              <div style={{ fontFamily: MARCELLUS, fontSize: 78, lineHeight: 1.08, color: "#FFF4E2", marginTop: 16 }}>
                Spiritual <Accent light>tourism</Accent>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 34 }}>
                {[["ujjain", "Ujjain"], ["kashi", "Kashi"], ["rameshwaram", "Rameshwaram"]].map(([w, k]) => (
                  <div key={k} style={{ opacity: prog(t, word("roadmap_4", w) - 0.15, 0.4), display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 999, background: "rgba(255,244,226,0.14)", border: "1.5px solid rgba(255,220,170,0.5)", fontFamily: KARLA, fontWeight: 700, fontSize: 26, color: "#FFF4E2" }}>
                    <Icon name="pin" size={22} color="#FCD34D" />
                    {k}
                  </div>
                ))}
              </div>
              <div style={{ opacity: prog(t, word("roadmap_4", "puja") - 0.15, 0.5), display: "inline-flex", alignItems: "center", gap: 10, marginTop: 18, padding: "10px 20px", borderRadius: 999, background: "rgba(255,244,226,0.14)", border: "1.5px solid rgba(255,220,170,0.5)", fontFamily: KARLA, fontWeight: 700, fontSize: 26, color: "#FFF4E2" }}>
                <Icon name="gift" size={22} color="#FCD34D" /> Puja essentials, delivered home
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
