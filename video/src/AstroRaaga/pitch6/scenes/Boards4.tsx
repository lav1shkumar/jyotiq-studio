import React from "react";
import { C, easeInOut, KARLA, line, MARCELLUS, prog, sc, word } from "../theme";
import { Accent, BrandIcon, Card, Draw, Headline, Icon, In, Label, Paper, Pill, useWinT } from "../ui";

/* ================= 05 · Market segmentation & pain-point matrix (v6) =================
 * Values are the deck's Year 3 retained-revenue targets per engine (illustrative run rate, ₹95 = $1), not market size:
 * SaaS 3,000 × ₹1,000/mo = ₹3.6 Cr; marketplace 30,000 × ₹2,500 × 25 % = ₹1.875 Cr; JyotiQ 20,000 × ₹1,200 = ₹2.4 Cr;
 * North America $150K + $150K. Astrotalk FY26 ₹1,823 Cr is reported revenue (Moneycontrol). */
const ROWS = [
  { w: "professionals", seg: "Spiritual professionals", segS: "astrologers, priests, practices", icon: "users", col: C.green,
    pain: "Clients, bookings, calculations and marketing spread across separate tools", players: "AstroSage tools · generic CRMs",
    usd: "$379K", inr: "₹3.6 Cr", ans: "KarmEQ business software", ansS: "subscriptions + white-label", which: "karmeq" as const },
  { w: "families", seg: "Families booking rituals", segS: "pujas, havans, priests", icon: "temple", col: C.saffron,
    pain: "Inconsistent discovery, booking and fulfilment", players: "Sri Mandir · Vama",
    usd: "$197K", inr: "₹1.9 Cr", ans: "KarmEQ marketplace", ansS: "verified providers, retained fee", which: "karmeq" as const },
  { w: "seekers", seg: "Guidance seekers", segS: "personal questions, any time", icon: "question", col: C.violet,
    pain: "Generic predictions, unclear pricing, unverified experts", players: "Astrotalk (FY26 ₹1,823 Cr) · Astroyogi",
    usd: "$253K", inr: "₹2.4 Cr", ans: "JyotiQ intelligence", ansS: "paid, personalised Vedic guidance", which: "jyotiq" as const },
  { w: "diaspora", seg: "Indian diaspora", segS: "US and Canada", icon: "globe", col: C.sky,
    pain: "Few trusted providers far from home", players: "Local priests · Co-Star · Nebula",
    usd: "$300K", inr: "₹2.85 Cr", ans: "KarmEQ + JyotiQ abroad", ansS: "remote and local services", which: "karmeq" as const },
];
const COLS = [
  { k: "Segment", w: 360 },
  { k: "Pain point", w: 420 },
  { k: "Existing players", w: 330 },
  { k: "Year 3 value · USD / INR", w: 250 },
  { k: "AstroRaaga answer", w: 360 },
];
const X0 = 100;
const GAP = 0;
const colX = (i: number) => X0 + COLS.slice(0, i).reduce((s, c) => s + c.w + GAP, 0);
const TOP = 268;
const RH = 158;

export const SegmentBoard: React.FC = () => {
  const t = useWinT();
  const a = sc("segment").start;
  const tAns = line("segment_3").start;
  const tRow = ROWS.map((r) => word("segment_2", r.w) - 0.25);
  const grid = prog(t, line("segment_1").start + 0.2, 1.4, easeInOut);
  return (
    <>
      <Paper tint="rgba(2,132,199,0.05)" />
      <div style={{ position: "absolute", left: 100, top: 60 }}>
        <In t0={a + 0.4}>
          <Label>05 · Market segmentation & pain-point matrix</Label>
        </In>
        <In t0={line("segment_1").start} dur={0.9} style={{ marginTop: 12 }}>
          <Headline size={52}>
            Four layers. Four pain points. <Accent>One answer each</Accent>.
          </Headline>
        </In>
      </div>
      {/* header row */}
      {COLS.map((c, i) => (
        <div key={c.k} style={{ position: "absolute", left: colX(i) + 18, top: TOP - 46, width: c.w - 30, opacity: prog(t, line("segment_1").start + 0.4 + i * 0.1, 0.5) }}>
          <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 16, letterSpacing: "0.16em", textTransform: "uppercase", color: i === 4 ? C.saffronDeep : C.goldDeep }}>{c.k}</div>
        </div>
      ))}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {ROWS.map((_, i) => (
          <Draw key={i} d={`M${X0} ${TOP + i * RH} H${colX(5)}`} p={grid} stroke="rgba(200,150,46,0.35)" width={1.5} />
        ))}
        <Draw d={`M${X0} ${TOP + 4 * RH} H${colX(5)}`} p={grid} stroke="rgba(200,150,46,0.35)" width={1.5} />
        {/* the answer column is a lit lane */}
      </svg>
      <div style={{ position: "absolute", left: colX(4) + 4, top: TOP + 6, width: COLS[4].w - 4, height: 4 * RH - 12, borderRadius: 22, background: "rgba(234,88,12,0.06)", border: `1.5px solid rgba(234,88,12,0.25)`, opacity: prog(t, tAns - 0.2, 0.8) }} />
      {ROWS.map((r, i) => {
        const y = TOP + i * RH;
        const on = prog(t, tRow[i], 0.6);
        const hi = prog(t, tRow[i], 0.4) * (1 - prog(t, tRow[i + 1] ?? tAns, 0.5));
        const ans = prog(t, tAns + 0.25 + i * 0.28, 0.6);
        return (
          <div key={r.w}>
            {/* row highlight while it is being named */}
            <div style={{ position: "absolute", left: X0, top: y + 4, width: colX(4) - X0 - 8, height: RH - 8, borderRadius: 18, background: `${r.col}0F`, opacity: hi }} />
            <div style={{ position: "absolute", left: colX(0) + 18, top: y + 28, display: "flex", alignItems: "center", gap: 14, opacity: on, transform: `translateX(${(1 - on) * -16}px)` }}>
              <div style={{ width: 54, height: 54, borderRadius: 16, background: `${r.col}1C`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={r.icon} size={30} color={r.col} />
              </div>
              <div>
                <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 25, color: C.ink, lineHeight: 1.1 }}>{r.seg}</div>
                <div style={{ fontFamily: KARLA, fontSize: 18, color: C.ink3, marginTop: 4 }}>{r.segS}</div>
              </div>
            </div>
            <div style={{ position: "absolute", left: colX(1) + 18, top: y + 30, width: COLS[1].w - 40, opacity: prog(t, tRow[i] + 0.25, 0.5), fontFamily: KARLA, fontSize: 21, lineHeight: 1.3, color: C.ink2 }}>
              <span style={{ color: C.red, fontWeight: 700 }}>✕ </span>
              {r.pain}
            </div>
            <div style={{ position: "absolute", left: colX(2) + 18, top: y + 30, width: COLS[2].w - 36, opacity: prog(t, tRow[i] + 0.45, 0.5), fontFamily: KARLA, fontWeight: 600, fontSize: 20, lineHeight: 1.35, color: C.ink }}>
              {r.players}
            </div>
            <div style={{ position: "absolute", left: colX(3) + 18, top: y + 22, opacity: prog(t, tRow[i] + 0.6, 0.5), transform: `scale(${0.9 + 0.1 * prog(t, tRow[i] + 0.6, 0.5)})`, transformOrigin: "0% 50%" }}>
              <div style={{ fontFamily: MARCELLUS, fontSize: 42, color: C.ink, lineHeight: 1 }}>{r.usd}</div>
              <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 20, color: C.goldDeep, marginTop: 8 }}>{r.inr} / yr</div>
            </div>
            <div style={{ position: "absolute", left: colX(4) + 22, top: y + 30, display: "flex", alignItems: "center", gap: 12, opacity: ans, transform: `translateX(${(1 - ans) * 20}px)` }}>
              <BrandIcon which={r.which} size={46} />
              <div>
                <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 22, color: C.ink, whiteSpace: "nowrap" }}>{r.ans}</div>
                <div style={{ fontFamily: KARLA, fontSize: 17, color: C.ink3, whiteSpace: "nowrap" }}>{r.ansS}</div>
              </div>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 100, right: 100, top: TOP + 4 * RH + 22, fontFamily: KARLA, fontSize: 16, color: C.ink3, opacity: prog(t, tAns + 1.4, 0.6) }}>
        Year 3 value = AstroRaaga's illustrative retained-revenue target per engine (₹95 = $1), not market size. Bottom-up TAM / SAM research is in progress.
      </div>
    </>
  );
};

/* ================= 06 · Mission, vision & product goals (v6) ================= */
const GOALS = [
  { w: "karmik", which: "karmeq" as const, k: "KarmEQ", goal: "The operating system for every spiritual professional", col: C.green, items: ["Manage · Practice · Grow", "Direct services marketplace"] },
  { w: "jyotik", which: "jyotiq" as const, k: "JyotiQ", goal: "The most trusted personal guide", col: C.violet, items: ["Personalised Vedic intelligence", "Chat now, live calling next"] },
  { w: "share", which: null, k: "Shared technology", goal: "One proprietary layer under both products", col: C.saffron, items: ["Vedic calculations & workflows", "CRM, scheduling, payments, analytics"] },
];

export const GoalsBoard: React.FC = () => {
  const t = useWinT();
  const a = sc("goals").start;
  const l1 = line("goals_1");
  return (
    <>
      <Paper tint="rgba(200,150,46,0.07)" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <In t0={a + 0.4}>
          <Label style={{ justifyContent: "center" }}>06 · Mission, vision & product goals</Label>
        </In>
        <In t0={l1.start} dur={0.9} style={{ marginTop: 16 }}>
          <Headline size={58}>
            Guidance that <Accent>transforms lives</Accent>.
          </Headline>
        </In>
        <In t0={word("goals_1", "care") - 0.2} dur={0.8} style={{ marginTop: 10 }}>
          <div style={{ fontFamily: KARLA, fontSize: 28, color: C.ink2 }}>Offered with care. Never sold through fear.</div>
        </In>
        <In t0={word("goals_1", "fear") + 0.2} dur={0.8} style={{ marginTop: 24 }}>
          <div style={{ display: "flex", gap: 14 }}>
            <Pill size={20} icon={<Icon name="spark" size={20} color={C.saffron} />}>Mission: trusted guidance, for everyone</Pill>
            <Pill size={20} icon={<Icon name="globe" size={20} color={C.gold} />}>Vision: the world's most trusted human guidance ecosystem</Pill>
          </div>
        </In>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <Draw d="M380 470 H1540" p={prog(t, line("goals_2").start, 1.6, easeInOut)} stroke="rgba(200,150,46,0.55)" width={2.4} dash="6 10" />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 440, display: "flex", justifyContent: "center", gap: 44 }}>
        {GOALS.map((g, i) => {
          const t0 = word("goals_2", g.w) - 0.25;
          return (
            <div key={g.k} style={{ width: 520 }}>
              <In t0={t0} dy={26}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
                  <div style={{ width: 60, height: 60, borderRadius: 30, background: g.col, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MARCELLUS, fontSize: 30, boxShadow: `0 0 0 10px ${g.col}22` }}>{i + 1}</div>
                </div>
                <Card style={{ padding: "30px 34px", height: 400, boxSizing: "border-box", borderColor: `${g.col}55` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {g.which ? (
                      <BrandIcon which={g.which} size={56} />
                    ) : (
                      <div style={{ width: 56, height: 56, borderRadius: 16, background: `${g.col}1C`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon name="bolt" size={30} color={g.col} />
                      </div>
                    )}
                    <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 20, letterSpacing: "0.16em", textTransform: "uppercase", color: g.col }}>{g.k}</div>
                  </div>
                  <div style={{ fontFamily: MARCELLUS, fontSize: 38, lineHeight: 1.22, color: C.ink, marginTop: 22 }}>{g.goal}</div>
                  <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 10 }}>
                    {g.items.map((it, k) => (
                      <div key={it} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: KARLA, fontSize: 21, color: C.ink2, opacity: prog(t, t0 + 0.5 + k * 0.2, 0.4) }}>
                        <div style={{ width: 7, height: 7, borderRadius: 4, background: g.col }} />
                        {it}
                      </div>
                    ))}
                  </div>
                </Card>
              </In>
            </div>
          );
        })}
      </div>
    </>
  );
};
