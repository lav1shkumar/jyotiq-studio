import React from "react";
import { Img } from "remotion";
import { C, easeInOut, KARLA, line, MARCELLUS, money, prog, rnd, sc, word, JY, KM, CE } from "../theme";
import { Accent, asset, Headline, Icon, In, Label, Painting, Paper, useWinT, v7img } from "../ui";

/* ================= 01 · Introduction (v7): three names big, each glowing in its planet colour; three revenue engines;
   mission and vision over a soft painting ================= */
const Brand: React.FC<{ t: number; t0: number; logo: string; round?: boolean; name: string; sub: string; glow: string; size: number; engines: string[]; tE: number }> = ({ t, t0, logo, round, name, sub, glow, size, engines, tE }) => {
  const p = prog(t, t0, 0.9);
  const pulse = 1 + 0.05 * Math.sin(t * 2.2 + size);
  return (
    <In t0={t0} dy={20} dur={0.9}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 520 }}>
        <div style={{ position: "relative", width: size, height: size }}>
          <div style={{ position: "absolute", left: -size * 0.45, top: -size * 0.45, width: size * 1.9, height: size * 1.9, borderRadius: "50%", opacity: p, transform: `scale(${pulse})`, background: `radial-gradient(circle, ${glow}88 0%, ${glow}33 38%, ${glow}00 68%)` }} />
          <Img src={logo} style={{ position: "relative", width: size, height: size, borderRadius: round ? size / 2 : 0, objectFit: "contain", boxShadow: round ? `0 18px 40px ${glow}55` : undefined }} />
        </div>
        <div style={{ fontFamily: MARCELLUS, fontSize: 52, color: C.ink, marginTop: 20, lineHeight: 1 }}>{name}</div>
        <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 18, letterSpacing: "0.16em", textTransform: "uppercase", color: glow, marginTop: 10 }}>{sub}</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginTop: 14 }}>
          {engines.map((e, i) => (
            <div key={e} style={{ opacity: prog(t, tE + i * 0.35, 0.5), transform: `translateY(${(1 - prog(t, tE + i * 0.35, 0.5)) * 8}px)`, padding: "8px 18px", borderRadius: 999, background: `${glow}14`, border: `1.5px solid ${glow}66`, fontFamily: KARLA, fontWeight: 700, fontSize: 21, color: C.ink, whiteSpace: "nowrap" }}>
              {e}
            </div>
          ))}
        </div>
      </div>
    </In>
  );
};

export const MissionBoard: React.FC = () => {
  const t = useWinT();
  const a = sc("mission").start;
  const tM = word("mission_2", "mission");
  const tV = word("mission_2", "vision");
  const tK = word("mission_1", "karmik");
  const tJ = word("mission_1", "jyotik");
  return (
    <>
      <Paper />
      <div style={{ position: "absolute", left: 0, right: 0, top: 124, textAlign: "center" }}>
        <In t0={word("mission_1", "technology") - 0.25} dur={0.9}>
          <Headline size={50}>
            The technology <Accent>backbone</Accent> of the spiritual-services economy.
          </Headline>
        </In>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 210, display: "flex", justifyContent: "center", alignItems: "flex-start", gap: 30 }}>
        <Brand t={t} t0={tK - 0.3} logo={asset("brand/karmeq_4x.png")} round name="KarmEQ" sub="" glow={KM} size={150} engines={[]} tE={tK + 0.4} />
        <Brand t={t} t0={a - 0.7} logo={asset("brand/icon_4x.png")} name="AstroRaaga" sub="" glow={C.saffron} size={170} engines={[]} tE={0} />
        <Brand t={t} t0={tJ - 0.3} logo={asset("v7/jyotiq_ring.png")} round name="JyotiQ" sub="" glow={JY} size={150} engines={[]} tE={tJ + 0.4} />
      </div>
      {/* v8 (Amit sir): the missing layer: AstroRaaga's own proprietary marketing content engine */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", justifyContent: "center" }}>
        <In t0={word("mission_1", "content") - 0.4} dy={14} dur={0.8}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 22px", borderRadius: 999, background: `${CE}14`, border: `1.5px solid ${CE}77`, boxShadow: `0 0 34px ${CE}33` }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, #9FD3FF, ${CE} 60%, #1B4E80)` }} />
            <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 21, color: C.ink, whiteSpace: "nowrap" }}>Proprietary marketing content engine</div>
          </div>
        </In>
      </div>
      {/* mission and vision over a soft diya painting */}
      <div style={{ position: "absolute", left: 150, right: 150, top: 650, height: 300 }}>
        <In t0={tM - 0.6} dur={1.0} dy={0} style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 30, overflow: "hidden", border: `1.5px solid ${C.goldHair}` }}>
            <Img src={v7img("courtyard", "family")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 40%", opacity: 0.55, transform: `scale(${1.04 + 0.02 * prog(t, tM, 8)})` }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(255,245,226,0.94) 0%, rgba(255,245,226,0.78) 50%, rgba(255,245,226,0.94) 100%)" }} />
          </div>
        </In>
        <div style={{ position: "absolute", inset: 0, display: "flex", gap: 60, padding: "40px 56px", boxSizing: "border-box" }}>
          {[
            { k: "Mission", txt: "Make trusted, personalised guidance accessible to everyone.", t0: tM - 0.25, icon: "spark", col: C.saffron },
            { k: "Vision", txt: "Become the world's most trusted human guidance ecosystem.", t0: tV - 0.25, icon: "globe", col: C.goldDeep },
          ].map((c) => (
            <div key={c.k} style={{ flex: 1 }}>
              <In t0={c.t0} dy={20}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 18, background: `${c.col}1F`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={c.icon} size={30} color={c.col} />
                  </div>
                  <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 24, letterSpacing: "0.2em", textTransform: "uppercase", color: C.goldDeep }}>{c.k}</div>
                </div>
                <div style={{ fontFamily: MARCELLUS, fontSize: 44, lineHeight: 1.25, color: C.ink, marginTop: 22 }}>{c.txt}</div>
              </In>
            </div>
          ))}
        </div>
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

const NINE = ["Fragmented market", "Generic predictions", "No price transparency", "Unverified experts", "Nothing is remembered", "No unified platform (USP)"];

export const ProblemBoard: React.FC = () => {
  const t = useWinT();
  const a = sc("problem").start;
  const T = [
    word("problem_2", "market"),
    word("problem_2", "predictions"),
    word("problem_2", "prices"),
    word("problem_2", "experts"),
    word("problem_3", "personalisation"),
    line("problem_4").start,
  ];
  const tNine = line("problem_4").end + 0.35;
  const flick = Math.floor(t * 3) % 4;
  return (
    <>
      <Paper tint="rgba(225,29,72,0.07)" />
      <div style={{ position: "absolute", left: 100, top: 60 }}>
        <In t0={a + 0.4}>
          <Label>03 · The problem</Label>
        </In>
        <In t0={line("problem_1").start} dur={0.9} style={{ marginTop: 14 }}>
          <Headline size={56}>
            Walk through the mela, and the <Accent>problems</Accent> are everywhere.
          </Headline>
        </In>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 215, display: "grid", gridTemplateColumns: "repeat(3, 470px)", justifyContent: "center", columnGap: 50, rowGap: 40 }}>
        <PainCard t0={T[0] - 0.25} tone={C.rose} icon="chat" title="Fragmented market" sub="a different answer at every stall">
          <Bubble t={t} t0={T[0] + 0.2} x={0} y={10} txt="Yes, this year!" tone={C.rose} />
          <Bubble t={t} t0={T[0] + 0.5} x={200} y={0} txt="No, wait." tone={C.violet} />
          <Bubble t={t} t0={T[0] + 0.8} x={90} y={62} txt="Do a costly puja" tone={C.saffron} />
        </PainCard>
        <PainCard t0={T[1] - 0.25} tone={C.violet} icon="mail" title="Generic predictions" sub="the same reading for everyone">
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
        <PainCard t0={T[2] - 0.25} tone={C.amber} icon="tag" title="Lack of transparency" sub="rates change, totals surprise">
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
        <PainCard t0={T[4] - 0.25} tone={C.teal} icon="reset" title="Limited personalisation" sub="nothing is remembered">
          <div style={{ position: "absolute", left: 0, top: 20, display: "flex", alignItems: "center", gap: 16, opacity: prog(t, T[4] + 0.3, 0.5) }}>
            <div style={{ transform: `rotate(${-prog(t, T[4] + 0.3, 1.6, easeInOut) * 720}deg)` }}>
              <Icon name="reset" size={56} color={C.teal} />
            </div>
            <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 30, color: C.ink }}>
              History: <span style={{ color: C.teal }}>0 sessions</span>
            </div>
          </div>
        </PainCard>
        {/* v7 (Amit sir): the USP is the hero card: spiritual professionals have no tech platform to grow */}
        <div style={{ position: "relative", zIndex: 2, transformOrigin: "50% 50%", transform: `scale(${1 + 0.08 * prog(t, T[5] + 0.2, 0.8, easeInOut)})` }}>
          <div style={{ position: "absolute", inset: -10, borderRadius: 34, opacity: prog(t, T[5] + 0.2, 0.8), boxShadow: `0 0 0 4px ${C.saffron}, 0 0 60px rgba(234,88,12,${0.35 + 0.15 * Math.sin(t * 3)})` }} />
          <PainCard t0={T[5] - 0.25} tone={C.saffron} icon="bolt" title="No unified platform" sub="for spiritual professionals to grow">
            <div style={{ position: "absolute", left: 0, top: -16, display: "flex", flexWrap: "wrap", gap: 6, width: 414 }}>
              {["Priests", "Astrologers", "Numerologists", "Vastu", "Tarot"].map((k, i) => {
                const p = prog(t, T[5] + 0.3 + i * 0.16, 0.4);
                return (
                  <div key={k} style={{ opacity: p, transform: `translateY(${(1 - p) * 8}px)`, padding: "5px 11px", borderRadius: 999, background: "#FFF3E6", border: `1.5px solid ${C.saffron}55`, fontFamily: KARLA, fontWeight: 700, fontSize: 16, color: C.saffronDeep }}>{k}</div>
                );
              })}
            </div>
            <div style={{ position: "absolute", left: 0, bottom: 0, display: "flex", alignItems: "center", gap: 10, opacity: prog(t, T[5] + 1.4, 0.5), padding: "8px 16px", borderRadius: 12, background: C.black, fontFamily: KARLA, fontWeight: 700, fontSize: 20, color: "#FFF4E2", letterSpacing: "0.06em" }}>
              <span style={{ color: C.amber }}>USP</span> The gap AstroRaaga fills
            </div>
          </PainCard>
        </div>
      </div>
      <div style={{ position: "absolute", left: 100, right: 100, top: 920 }}>
        <In t0={tNine - 0.1} dy={10}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 18, letterSpacing: "0.18em", color: C.goldDeep, marginRight: 8 }}>SIX PAIN POINTS</div>
            {NINE.map((n, i) => (
              <div key={n} style={{ opacity: prog(t, tNine + i * 0.06, 0.35), padding: "7px 14px", borderRadius: 999, border: `1.5px solid ${i === 5 ? C.saffron : C.goldHair}`, background: i === 5 ? "#FFF0E0" : C.card, fontFamily: KARLA, fontWeight: i === 5 ? 800 : 600, fontSize: i === 5 ? 20 : 17, color: i === 5 ? C.saffronDeep : C.ink2 }}>
                {n}
              </div>
            ))}
          </div>
        </In>
      </div>
    </>
  );
};

/* ================= 03 · Why solve it (v7, 3 beats): (a) demand rises, (b) the curve breaks into a scatter with no centre,
   (c) the plot moves up and a calm, safe scene arrives for "personal, transparent, trusted" ================= */
const CURVE = (u: number): [number, number] => [1030 + u * 760, 820 - (Math.pow(u, 1.7) * 470 + Math.sin(u * 9) * 10 * u)];
const DOTS = Array.from({ length: 42 }, (_, i) => ({ u: i / 41, sx: 1010 + rnd(i * 5 + 2) * 800, sy: 250 + rnd(i * 5 + 3) * 560, c: [C.saffron, C.rose, C.rahu, C.teal, C.mercury, C.gold, C.sky][i % 7] }));

export const WhyBoard: React.FC = () => {
  const t = useWinT();
  const a = sc("why").start;
  const t1 = line("why_1").start;
  const tB = word("why_1", "but");
  const t2 = line("why_2").start;
  const draw = prog(t, t1 - 0.2, 1.8, easeInOut);
  const scat = prog(t, tB - 0.1, 1.6, easeInOut);
  const up = prog(t, t2 - 0.3, 1.4, easeInOut);
  const path = Array.from({ length: 61 }, (_, i) => {
    const [x, y] = CURVE(i / 60);
    return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  return (
    <>
      <Paper />
      <div style={{ position: "absolute", left: 120, top: 200, width: 820 }}>
        <In t0={a + 0.3}>
          <Label>03 · Why AstroRaaga needs to be built</Label>
        </In>
        <In t0={t1} dur={0.9} style={{ marginTop: 24 }}>
          <Headline size={68}>Demand is growing.</Headline>
        </In>
        <In t0={tB - 0.1} dur={0.9} style={{ marginTop: 8 }}>
          <Headline size={68}>
            The experience stays <Accent>fragmented</Accent>.
          </Headline>
        </In>
        <In t0={t2 - 0.1} dur={0.8} style={{ marginTop: 40 }}>
          <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 30, color: C.saffronDeep }}>That is why AstroRaaga needs to be built.</div>
        </In>
        <In t0={word("why_2", "seekers") - 0.15} dur={0.8} style={{ marginTop: 18 }}>
          <div style={{ fontFamily: KARLA, fontSize: 30, color: C.ink2 }}>Seekers deserve guidance that is</div>
        </In>
        <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
          {[
            ["personal", "Personal", C.saffron],
            ["transparent", "Transparent", C.sky],
            ["trusted", "Trusted", C.mercury],
          ].map(([w, k, col]) => (
            <In key={k} t0={word("why_2", w) - 0.15} dy={12} dur={0.5}>
              <div style={{ padding: "12px 24px", borderRadius: 999, background: `${col}14`, border: `1.5px solid ${col}66`, fontFamily: KARLA, fontWeight: 700, fontSize: 28, color: col }}>{k}</div>
            </In>
          ))}
        </div>
      </div>
      {/* the chart: up and to the right in beat (c) */}
      <div style={{ position: "absolute", inset: 0, transformOrigin: "1820px 160px", transform: `scale(${1 - 0.5 * up})` }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <linearGradient id="whyFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgba(234,88,12,0.22)" />
              <stop offset="1" stopColor="rgba(234,88,12,0)" />
            </linearGradient>
          </defs>
          <path d="M1030 300 V820 H1800" fill="none" stroke="rgba(140,118,96,0.35)" strokeWidth={2} opacity={prog(t, t1 - 0.4, 0.6) * (1 - scat)} />
          <path d={`${path} L1790 820 L1030 820 Z`} fill="url(#whyFill)" opacity={draw * (1 - scat)} />
          <path d={path} pathLength={1} fill="none" stroke={C.saffron} strokeWidth={6} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - draw} opacity={1 - scat} />
          {DOTS.map((d, i) => {
            const [cx, cy] = CURVE(d.u);
            const k = prog(t, tB - 0.1 + rnd(i) * 0.5, 1.3, easeInOut);
            const x = cx + (d.sx - cx) * k;
            const y = cy + (d.sy - cy) * k + Math.sin(t * 0.9 + i) * 5 * k;
            const vis = Math.min(1, scat * 3) * (draw >= d.u ? 1 : 0);
            return <circle key={i} cx={x} cy={y} r={6 + 6 * k} fill={k > 0.3 ? d.c : C.saffron} opacity={vis * (0.55 + 0.4 * k)} />;
          })}
        </svg>
      </div>
      {/* beat (c): calm, safe, trusted */}
      <div style={{ position: "absolute", left: 1000, top: 440 }}>
        <In t0={t2 + 0.1} dur={1.1} dy={30}>
          <Painting src={v7img("courtyard", "seeker")} w={820} h={470} zoom={1.02 + 0.03 * prog(t, t2, 6)} />
        </In>
      </div>
    </>
  );
};
