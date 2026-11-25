import React from "react";
import { C, easeInOut, KARLA, line, MARCELLUS, prog, sc, segLayout, word, JY, KM } from "../theme";
import { AbsoluteFill, Img } from "remotion";
import { Accent, asset, BrandIcon, Card, Draw, Headline, Icon, In, Label, Paper, useWinT, v7img } from "../ui";

/* ================= 05 · Market segmentation & pain-point matrix (v6) =================
 * Values are the deck's Year 3 retained-revenue targets per engine (illustrative run rate, ₹95 = $1), not market size:
 * SaaS 3,000 × ₹1,000/mo = ₹3.6 Cr; marketplace 30,000 × ₹2,500 × 25 % = ₹1.875 Cr; JyotiQ 20,000 × ₹1,200 = ₹2.4 Cr;
 * North America $150K + $150K. Astrotalk FY26 ₹1,823 Cr is reported revenue (Moneycontrol). */
const ROWS = [
  { w: "professionals", img: ["pandit", "pandit"], seg: "Spiritual professionals", segS: "priests, astrologers, numerologists, vastu, tarot", col: KM,
    pain: "No tech platform to run and grow their practice", ans: "KarmEQ software", which: "karmeq" as const },
  { w: "families", img: ["family", "family"], seg: "Families", segS: "pujas, havans, rituals", col: C.saffron,
    pain: "Finding and booking a trusted priest is hard", ans: "KarmEQ marketplace", which: "karmeq" as const },
  { w: "seekers", img: ["seeker", "seeker"], seg: "Seekers", segS: "personal questions, any time", col: JY,
    pain: "Generic predictions, unclear prices", ans: "JyotiQ intelligence", which: "jyotiq" as const },
  { w: "diaspora", img: ["nri", "family"], seg: "Diaspora abroad", segS: "US and Canada", col: C.sky,
    pain: "Few trusted services far from home", ans: "KarmEQ + JyotiQ", which: "karmeq" as const },
];

/* ================= 05 · Four layers, four pain points (v7): one painted tile per layer, one pain line, one answer.
   Two layouts for Amit sir: "stack" (layers) and "grid" (2x2). The $ table is gone. ================= */
const Answer: React.FC<{ r: (typeof ROWS)[number]; p: number; size?: number }> = ({ r, p, size = 24 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: p, transform: `translateX(${(1 - p) * 16}px)` }}>
    <div style={{ fontFamily: KARLA, fontWeight: 800, fontSize: size, color: C.saffron }}>→</div>
    <BrandIcon which={r.which} size={size * 1.8} />
    <div style={{ fontFamily: KARLA, fontWeight: 800, fontSize: size, color: C.ink, whiteSpace: "nowrap" }}>{r.ans}</div>
  </div>
);

export const SegmentBoard: React.FC = () => {
  const t = useWinT();
  const a = sc("segment").start;
  const tAns = line("segment_3").start;
  const tRow = ROWS.map((r) => word("segment_2", r.w) - 0.25);
  const grid = segLayout() === "grid";
  return (
    <>
      <Paper tint="rgba(2,132,199,0.05)" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 104, textAlign: "center" }}>
        <In t0={a + 0.4}>
          <Label style={{ justifyContent: "center" }}>05 · Four layers</Label>
        </In>
        {/* v8.1: each part of the headline arrives as it is spoken */}
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 4 }}>
          <In t0={word("segment_1", "four") - 0.2} dur={0.9}>
            <Headline size={56}>Four layers.</Headline>
          </In>
          <In t0={word("segment_3", "pain") - 0.2} dur={0.9}>
            <Headline size={56}>Four pain points.</Headline>
          </In>
          <In t0={word("segment_3", "answer") - 0.2} dur={0.9}>
            <Headline size={56}>
              <Accent>One answer each</Accent>.
            </Headline>
          </In>
        </div>
      </div>
      {ROWS.map((r, i) => {
        const on = prog(t, tRow[i], 0.8);
        const ans = prog(t, tAns + 0.25 + i * 0.3, 0.6);
        const hi = prog(t, tRow[i], 0.4) * (1 - prog(t, tRow[i + 1] ?? tAns, 0.5));
        const src = v7img(r.img[0], r.img[1]);
        if (grid) {
          const x = 150 + (i % 2) * 830;
          const y = 250 + Math.floor(i / 2) * 400;
          return (
            <div key={r.w} style={{ position: "absolute", left: x, top: y }}>
              <In t0={tRow[i]} dy={30} dur={0.9}>
                <div style={{ width: 790, height: 370, borderRadius: 28, overflow: "hidden", position: "relative", background: C.card, border: `2px solid ${r.col}${hi > 0.5 ? "AA" : "55"}`, boxShadow: `0 26px 60px ${r.col}22` }}>
                  <Img src={src} style={{ position: "absolute", left: 0, top: 0, width: 330, height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.04 * on})` }} />
                  <div style={{ position: "absolute", left: 360, top: 34, right: 26 }}>
                    <div style={{ fontFamily: MARCELLUS, fontSize: 44, color: C.ink, lineHeight: 1 }}>{r.seg}</div>
                    <div style={{ fontFamily: KARLA, fontSize: 19, color: r.col, fontWeight: 700, marginTop: 8 }}>{r.segS}</div>
                    <div style={{ fontFamily: KARLA, fontSize: 26, lineHeight: 1.3, color: C.ink2, marginTop: 22, opacity: prog(t, tRow[i] + 0.4, 0.5) }}>
                      <span style={{ color: C.red, fontWeight: 800 }}>✕ </span>
                      {r.pain}
                    </div>
                    <div style={{ marginTop: 26 }}>
                      <Answer r={r} p={ans} size={24} />
                    </div>
                  </div>
                </div>
              </In>
            </div>
          );
        }
        // stacked layers: each layer a band, set in a little more, so they read as one stack
        const y = 232 + i * 192;
        const x = 150 + i * 24;
        return (
          <div key={r.w} style={{ position: "absolute", left: x, top: y }}>
            <In t0={tRow[i]} dx={-30} dy={0} dur={0.9}>
              <div style={{ width: 1640 - i * 48, height: 176, borderRadius: 26, overflow: "hidden", position: "relative", background: C.card, border: `2px solid ${r.col}${hi > 0.5 ? "AA" : "55"}`, boxShadow: `0 ${18 + i * 4}px 48px ${r.col}22` }}>
                <Img src={src} style={{ position: "absolute", left: 0, top: 0, width: 330, height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.04 * on})` }} />
                <div style={{ position: "absolute", left: 250, top: 0, width: 90, height: "100%", background: `linear-gradient(90deg, rgba(255,253,249,0) 0%, ${C.card} 100%)` }} />
                <div style={{ position: "absolute", left: 370, top: 30, width: 480 }}>
                  <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 16, letterSpacing: "0.2em", color: r.col }}>LAYER {i + 1}</div>
                  <div style={{ fontFamily: MARCELLUS, fontSize: 40, color: C.ink, lineHeight: 1.05, marginTop: 6, whiteSpace: "nowrap" }}>{r.seg}</div>
                  <div style={{ fontFamily: KARLA, fontSize: 18, color: C.ink3, marginTop: 4, whiteSpace: "nowrap" }}>{r.segS}</div>
                </div>
                <div style={{ position: "absolute", left: 860, top: 50, width: 360, fontFamily: KARLA, fontSize: 25, lineHeight: 1.3, color: C.ink2, opacity: prog(t, tRow[i] + 0.4, 0.5) }}>
                  <span style={{ color: C.red, fontWeight: 800 }}>✕ </span>
                  {r.pain}
                </div>
                <div style={{ position: "absolute", right: 34, top: 60, display: "flex", justifyContent: "flex-end" }}>
                  <Answer r={r} p={ans} size={23} />
                </div>
              </div>
            </In>
          </div>
        );
      })}
    </>
  );
};

/* ================= 06 · Mission, vision & product goals (v6) ================= */
const GOALS = [
  { w: "karmik", which: "karmeq" as const, k: "KarmEQ", goal: "The operating system for every spiritual professional", col: KM, items: ["Manage · Practice · Grow", "Direct services marketplace"] },
  { w: "jyotik", which: "jyotiq" as const, k: "JyotiQ", goal: "The most trusted personal guide", col: JY, items: ["Personalised Vedic intelligence", "Chat now, live calling next"] },
  { w: "share", which: null, k: "Shared technology", goal: "One proprietary layer and one content engine", col: C.saffron, items: ["Vedic calculations & workflows", "Marketing content engine for both"] },
];

/** v7 motion grammar (Amit sir): the goal's text drops back and the product's screen zooms to the front, then out. */
const FrontScreen: React.FC<{ t: number; t0: number; t1: number; children: React.ReactNode }> = ({ t, t0, t1, children }) => {
  const pin = prog(t, t0, 0.8, easeInOut);
  const pout = prog(t, t1, 0.7, easeInOut);
  const p = pin * (1 - pout);
  if (p <= 0) return null;
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: p, transform: `scale(${0.8 + 0.2 * pin + 0.06 * pout})` }}>{children}</div>
  );
};

export const GoalsBoard: React.FC = () => {
  const t = useWinT();
  const a = sc("goals").start;
  void line("goals_1");
  const tK = word("goals_2", "karmik");
  const tJ = word("goals_2", "jyotik");
  const tS = word("goals_2", "share");
  const front = Math.max(prog(t, tK + 0.5, 0.8, easeInOut) * (1 - prog(t, tJ - 0.3, 0.7, easeInOut)), prog(t, tJ + 0.5, 0.8, easeInOut) * (1 - prog(t, tS - 0.3, 0.7, easeInOut)));
  return (
    <>
      <Paper tint="rgba(200,150,46,0.07)" />
      <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 50%", transform: `scale(${1 - 0.06 * front})`, filter: front > 0.02 ? `blur(${5 * front}px)` : undefined, opacity: 1 - 0.55 * front }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <In t0={a + 0.4}>
          <Label style={{ justifyContent: "center" }}>06 · Mission, vision & product goals</Label>
        </In>
        <In t0={word("goals_1", "guidance") - 0.2} dur={0.9} style={{ marginTop: 16 }}>
          <Headline size={58}>
            Guidance that <Accent>transforms lives</Accent>.
          </Headline>
        </In>
        <In t0={word("goals_1", "care") - 0.2} dur={0.8} style={{ marginTop: 10 }}>
          <div style={{ fontFamily: KARLA, fontSize: 28, color: C.ink2 }}>Offered with care. Never sold through fear.</div>
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
      </div>
      <AbsoluteFill style={{ background: `rgba(255,245,226,${0.35 * front})` }} />
      <FrontScreen t={t} t0={tK + 0.5} t1={tJ - 0.3}>
        <div style={{ display: "flex", alignItems: "center", gap: 50 }}>
          {/* v8 (Amit sir): the real KarmEQ booking section on astroraag.com */}
          <div style={{ width: 860, borderRadius: 26, background: "#fff", border: `2px solid ${KM}55`, boxShadow: "0 50px 110px rgba(124,45,18,0.25)", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", background: "#F4EEE4", borderBottom: "1px solid #E6DCCC" }}>
              {["#F87171", "#FBBF24", "#34D399"].map((c) => <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />)}
              <div style={{ marginLeft: 14, flex: 1, padding: "6px 16px", borderRadius: 999, background: "#fff", fontFamily: KARLA, fontWeight: 600, fontSize: 18, color: C.ink2 }}>astroraag.com/services · book a puja or havan</div>
            </div>
            <div style={{ width: 860, height: 577, overflow: "hidden" }}>
              <Img src={asset("v7/web/booking.jpg")} style={{ width: 860, height: 577, transform: `scale(${1.03 - 0.03 * prog(t, tK + 0.5, 5)})`, transformOrigin: "50% 0%" }} />
            </div>
          </div>
          <div style={{ width: 480 }}>
            <div style={{ fontFamily: KARLA, fontWeight: 800, fontSize: 20, letterSpacing: "0.2em", color: KM }}>GOAL 1 · KARMEQ</div>
            <div style={{ fontFamily: MARCELLUS, fontSize: 52, lineHeight: 1.15, color: C.ink, marginTop: 14 }}>The operating system for every spiritual professional.</div>
          </div>
        </div>
      </FrontScreen>
      <FrontScreen t={t} t0={tJ + 0.5} t1={tS - 0.3}>
        <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
          <div style={{ width: 360, height: 750, borderRadius: 56, background: "#17110B", padding: 14, boxSizing: "border-box", boxShadow: `0 50px 110px rgba(44,24,16,0.3), 0 0 0 2px ${JY}55` }}>
            <div style={{ width: "100%", height: "100%", borderRadius: 44, overflow: "hidden" }}>
              <Img src={asset("v7/screens/jy_14.png")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0%" }} />
            </div>
          </div>
          <div style={{ width: 560 }}>
            <div style={{ fontFamily: KARLA, fontWeight: 800, fontSize: 20, letterSpacing: "0.2em", color: JY }}>GOAL 2 · JYOTIQ</div>
            <div style={{ fontFamily: MARCELLUS, fontSize: 56, lineHeight: 1.15, color: C.ink, marginTop: 14 }}>The most trusted personal guide.</div>
          </div>
        </div>
      </FrontScreen>
    </>
  );
};
