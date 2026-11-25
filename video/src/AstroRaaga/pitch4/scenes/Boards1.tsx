import React from "react";
import { Img } from "remotion";
import { C, easeInOut, KARLA, line, MARCELLUS, money, prog, rnd, sc, word } from "../theme";
import { Accent, asset, Card, Headline, Icon, In, Label, Paper, useWinT } from "../ui";

/* ================= 01 · Welcome: mission and vision ================= */
export const MissionBoard: React.FC = () => {
  const a = sc("mission").start;
  const tM = word("mission_1", "mission");
  const tV = word("mission_2", "vision");
  return (
    <>
      <Paper />
      <div style={{ position: "absolute", left: 0, right: 0, top: 96, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <In t0={a + 0.3} dur={0.9}>
          <Img src={asset("brand/logo_4x.png")} style={{ width: 400 }} />
        </In>
        <In t0={a + 0.6} dur={0.9} style={{ marginTop: 26 }}>
          <Label style={{ justifyContent: "center" }}>The Intelligent Human Guidance Ecosystem</Label>
        </In>
      </div>
      <div style={{ position: "absolute", left: 150, right: 150, top: 380, display: "flex", gap: 56 }}>
        {[
          { k: "Our mission", txt: "Make trusted, personalised guidance accessible, by connecting ancient wisdom, intelligent technology and trusted human expertise.", t0: tM - 0.25, icon: "spark", col: C.saffron },
          { k: "Our vision", txt: "To be the world's most trusted human guidance ecosystem, from a first question to lasting transformation.", t0: tV - 0.25, icon: "globe", col: C.gold },
        ].map((c) => (
          <div key={c.k} style={{ flex: 1 }}>
            <In t0={c.t0} dy={26}>
              <Card style={{ padding: "40px 46px", height: 330, boxSizing: "border-box" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 18, background: `${c.col}1A`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={c.icon} size={30} color={c.col} />
                  </div>
                  <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 22, letterSpacing: "0.2em", textTransform: "uppercase", color: C.goldDeep }}>{c.k}</div>
                </div>
                <div style={{ fontFamily: MARCELLUS, fontSize: 38, lineHeight: 1.3, color: C.ink, marginTop: 26 }}>{c.txt}</div>
              </Card>
            </In>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center" }}>
        <In t0={line("mission_2").end - 0.6} dur={0.9}>
          <Headline size={48} color={C.ink2}>
            From questions, to guidance, to <Accent>transformation</Accent>.
          </Headline>
        </In>
      </div>
    </>
  );
};

/* ================= 02 · The problem: six colourful stall cards, then all nine ================= */
const PainCard: React.FC<{ t0: number; tone: string; icon: string; title: string; sub: string; children?: React.ReactNode }> = ({ t0, tone, icon, title, sub, children }) => (
  <In t0={t0} dy={30} dur={0.8}>
    <div
      style={{
        width: 470,
        height: 290,
        borderRadius: 26,
        background: C.card,
        border: `2px solid ${tone}55`,
        boxShadow: `0 24px 60px ${tone}22`,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div style={{ height: 10, background: tone }} />
      <div style={{ padding: "22px 28px 0", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 54, height: 54, borderRadius: 16, background: `${tone}1F`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={icon} size={30} color={tone} sw={2} />
        </div>
        <div>
          <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 30, color: C.ink }}>{title}</div>
          <div style={{ fontFamily: KARLA, fontSize: 20, color: C.ink3, marginTop: 2 }}>{sub}</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 28, right: 28, bottom: 24, height: 120 }}>{children}</div>
    </div>
  </In>
);

const Bubble: React.FC<{ t: number; t0: number; x: number; y: number; txt: string; tone: string }> = ({ t, t0, x, y, txt, tone }) => {
  const p = prog(t, t0, 0.5);
  if (p <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `scale(${0.6 + 0.4 * p})`, opacity: p, padding: "10px 18px", borderRadius: 18, background: `${tone}18`, border: `1.5px solid ${tone}66`, fontFamily: KARLA, fontWeight: 700, fontSize: 22, color: tone, whiteSpace: "nowrap" }}>
      {txt}
    </div>
  );
};

const NINE = ["Limited personalisation", "Lack of transparency", "No continuity", "Data fragmentation", "Generic predictions", "Unverified experts", "Unclear pricing", "Lack of ethical guidance", "Fear-led selling"];

export const ProblemBoard: React.FC = () => {
  const t = useWinT();
  const a = sc("problem").start;
  const T = [
    word("problem_2", "every"),
    word("problem_2", "readings"),
    word("problem_2", "prices"),
    word("problem_2", "experts"),
    word("problem_3", "every"),
    word("problem_4", "too"),
  ];
  const tNine = line("problem_4").end + 0.35;
  const flick = Math.floor(t * 3) % 4;
  return (
    <>
      <Paper tint="rgba(225,29,72,0.07)" />
      <div style={{ position: "absolute", left: 100, top: 60 }}>
        <In t0={a + 0.4}>
          <Label>The problem</Label>
        </In>
        <In t0={line("problem_1").start} dur={0.9} style={{ marginTop: 14 }}>
          <Headline size={56}>
            Walk through the mela, and the <Accent>problems</Accent> are everywhere.
          </Headline>
        </In>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 215, display: "grid", gridTemplateColumns: "repeat(3, 470px)", justifyContent: "center", columnGap: 50, rowGap: 40 }}>
        <PainCard t0={T[0] - 0.25} tone={C.rose} icon="chat" title="Different answers" sub="at every stall">
          <Bubble t={t} t0={T[0] + 0.2} x={0} y={10} txt="Yes, this year!" tone={C.rose} />
          <Bubble t={t} t0={T[0] + 0.5} x={200} y={0} txt="No, wait." tone={C.violet} />
          <Bubble t={t} t0={T[0] + 0.8} x={90} y={62} txt="Do a costly puja" tone={C.saffron} />
        </PainCard>
        <PainCard t0={T[1] - 0.25} tone={C.violet} icon="mail" title="Generic templates" sub="the same reading for everyone">
          {[0, 1, 2].map((k) => {
            const p = prog(t, T[1] + 0.15 + k * 0.22, 0.5);
            return (
              <div key={k} style={{ position: "absolute", left: 20 + k * 26, top: 8 + k * 16, width: 300, height: 76, borderRadius: 12, background: "#fff", border: `1.5px solid ${C.violet}44`, opacity: p, transform: `translateY(${(1 - p) * 10}px)`, padding: "10px 14px", boxSizing: "border-box" }}>
                <div style={{ fontFamily: KARLA, fontSize: 17, color: C.ink2 }}>"Dear seeker, the stars say…"</div>
                <div style={{ height: 6, width: 200, background: `${C.violet}22`, borderRadius: 3, marginTop: 10 }} />
              </div>
            );
          })}
        </PainCard>
        <PainCard t0={T[2] - 0.25} tone={C.amber} icon="tag" title="Unclear pricing" sub="rates change, totals surprise">
          {[0, 1, 2].map((k) => {
            const p = prog(t, T[2] + 0.2 + k * 0.2, 0.45);
            const vals = money("₹?/min|₹??|₹???", "$?/min|$??|$???").split("|");
            return (
              <div key={k} style={{ position: "absolute", left: k * 140, top: 18 + (k % 2) * 30, opacity: p, padding: "12px 18px", borderRadius: 14, background: "#FFF7E6", border: `1.5px dashed ${C.amber}`, fontFamily: KARLA, fontWeight: 700, fontSize: 26, color: C.saffronDeep, transform: `rotate(${(k - 1) * 4}deg)` }}>
                {vals[(k + flick) % 3]}
              </div>
            );
          })}
        </PainCard>
        <PainCard t0={T[3] - 0.25} tone={C.sky} icon="shield" title="Unverified experts" sub="who can you trust?">
          {[0, 1, 2, 3].map((k) => {
            const p = prog(t, T[3] + 0.2 + k * 0.15, 0.45);
            return (
              <div key={k} style={{ position: "absolute", left: k * 100, top: 14, opacity: p, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 62, height: 62, borderRadius: 31, background: `${C.sky}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="users" size={32} color={C.sky} />
                </div>
                <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 18, color: C.sky }}>?</div>
              </div>
            );
          })}
        </PainCard>
        <PainCard t0={T[4] - 0.25} tone={C.teal} icon="reset" title="No continuity" sub="every chat starts from zero">
          <div style={{ position: "absolute", left: 0, top: 20, display: "flex", alignItems: "center", gap: 16, opacity: prog(t, T[4] + 0.3, 0.5) }}>
            <div style={{ transform: `rotate(${-prog(t, T[4] + 0.3, 1.6, easeInOut) * 720}deg)` }}>
              <Icon name="reset" size={56} color={C.teal} />
            </div>
            <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 30, color: C.ink }}>
              History: <span style={{ color: C.teal }}>0 sessions</span>
            </div>
          </div>
        </PainCard>
        <PainCard t0={T[5] - 0.25} tone={C.red} icon="alert" title="Fear-led selling" sub="sold through fear, not care">
          <div style={{ position: "absolute", left: 0, top: 14, opacity: prog(t, T[5] + 0.3, 0.5), padding: "14px 20px", borderRadius: 16, background: "#FEF2F2", border: `1.5px solid ${C.red}55`, fontFamily: KARLA, fontWeight: 700, fontSize: 24, color: C.red, transform: `translateX(${Math.sin(t * 30) * 2 * prog(t, T[5] + 0.3, 0.3) * (1 - prog(t, T[5] + 1.2, 0.4))}px)` }}>
            "Pay now, or face bad luck!"
          </div>
        </PainCard>
      </div>
      <div style={{ position: "absolute", left: 100, right: 100, top: 920 }}>
        <In t0={tNine - 0.1} dy={10}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 18, letterSpacing: "0.18em", color: C.goldDeep, marginRight: 8 }}>NINE PAIN POINTS</div>
            {NINE.map((n, i) => (
              <div key={n} style={{ opacity: prog(t, tNine + i * 0.06, 0.35), padding: "7px 14px", borderRadius: 999, border: `1.5px solid ${C.goldHair}`, background: C.card, fontFamily: KARLA, fontWeight: 600, fontSize: 17, color: C.ink2 }}>
                {n}
              </div>
            ))}
          </div>
        </In>
      </div>
    </>
  );
};

/* ================= 03 · Why solve it: demand grows, the experience stays fragmented ================= */
const SCATTER = Array.from({ length: 16 }, (_, i) => ({ x: 1010 + rnd(i * 3) * 760, y: 230 + rnd(i * 3 + 1) * 560, c: [C.saffron, C.rose, C.violet, C.teal, C.green, C.gold][i % 6] }));

export const WhyBoard: React.FC = () => {
  const t = useWinT();
  const a = sc("why").start;
  const t2 = line("why_2").start;
  const apart = prog(t, line("why_1").start + 0.4, 3.5, easeInOut);
  return (
    <>
      <Paper />
      <div style={{ position: "absolute", left: 120, top: 200, width: 820 }}>
        <In t0={a + 0.3}>
          <Label>Why we need to solve this</Label>
        </In>
        <In t0={line("why_1").start} dur={0.9} style={{ marginTop: 24 }}>
          <Headline size={68}>Demand is growing.</Headline>
        </In>
        <In t0={word("why_1", "but") - 0.1} dur={0.9} style={{ marginTop: 8 }}>
          <Headline size={68}>
            The experience stays <Accent>fragmented</Accent>.
          </Headline>
        </In>
        <In t0={t2 - 0.1} dur={0.8} style={{ marginTop: 54 }}>
          <div style={{ fontFamily: KARLA, fontSize: 28, color: C.ink2 }}>Seekers deserve guidance that is</div>
        </In>
        <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
          {[
            ["personal", "Personal", C.saffron],
            ["transparent", "Transparent", C.sky],
            ["trusted", "Trusted", C.green],
          ].map(([w, k, col]) => (
            <In key={k} t0={word("why_2", w) - 0.15} dy={12} dur={0.5}>
              <div style={{ padding: "12px 24px", borderRadius: 999, background: `${col}14`, border: `1.5px solid ${col}66`, fontFamily: KARLA, fontWeight: 700, fontSize: 26, color: col }}>{k}</div>
            </In>
          ))}
        </div>
      </div>
      {/* scattered stalls drifting apart, the links between them breaking */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {SCATTER.slice(1).map((s, i) => {
          const p0 = SCATTER[i];
          const dx = (s.x - 1390) * apart * 0.18;
          const dy = (s.y - 510) * apart * 0.18;
          const ex = (p0.x - 1390) * apart * 0.18;
          const ey = (p0.y - 510) * apart * 0.18;
          return <line key={i} x1={p0.x + ex} y1={p0.y + ey} x2={s.x + dx} y2={s.y + dy} stroke="rgba(184,134,40,0.35)" strokeWidth={2} strokeDasharray="6 10" opacity={prog(t, a + 0.5, 0.6) * (1 - apart * 0.8)} />;
        })}
      </svg>
      {SCATTER.map((s, i) => {
        const p = prog(t, a + 0.3 + i * 0.05, 0.6);
        const x = s.x + (s.x - 1390) * apart * 0.18;
        const y = s.y + (s.y - 510) * apart * 0.18 + Math.sin(t * 0.8 + i) * 4;
        return (
          <div key={i} style={{ position: "absolute", left: x - 34, top: y - 34, opacity: p, transform: `scale(${0.6 + 0.4 * p})` }}>
            <svg width={68} height={68} viewBox="0 0 100 100">
              <path d="M10 55 L50 15 L90 55 Z" fill={s.c} opacity={0.9} />
              <rect x={18} y={55} width={64} height={34} fill="#FFF8EC" stroke={s.c} strokeWidth={4} />
            </svg>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 1180, top: 870 }}>
        <In t0={line("why_1").start + 1.2} dy={10}>
          <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 20, letterSpacing: "0.18em", color: C.goldDeep }}>STILL SCATTERED</div>
        </In>
      </div>
    </>
  );
};
