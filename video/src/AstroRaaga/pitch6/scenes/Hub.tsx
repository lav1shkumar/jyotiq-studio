import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { MoonId, moonPos, project, setMoonEpoch, systemCam } from "../cam";
import { Cosmos } from "../Cosmos";
import { C, easeInOut, KARLA, lerp, line, MARCELLUS, prog, rnd, sc, word, isV5 } from "../theme";
import { Accent, asset, BrandIcon, Card, Draw, Headline, Icon, In, Label, Orb, Paper, Pill, TypeText, useWinT } from "../ui";

/* ---------------- solution: one hub, the dimensions around it ---------------- */
const DIMS = [
  { k: "Discovery", s: "ask JyotiQ anything", w: "discovery", icon: "question", col: C.violet },
  { k: "Action", s: "book experts, pujas, havans", w: "action", icon: "users", col: C.green },
  { k: "Education", s: "learn and understand", w: "education", icon: "star", col: C.sky },
  { k: "Transformation", s: "lasting change", w: "transformation", icon: "spark", col: C.saffron },
];

// the four steps sit on an arc under the hub: discovery → action → education → transformation
const DPOS: [number, number][] = [
  [330, 520],
  [690, 860],
  [1230, 860],
  [1590, 520],
];

const SolutionLayer: React.FC<{ t: number }> = ({ t }) => {
  const tD = DIMS.map((d) => word("solution_3", d.w) - 0.3);
  const cx = 960;
  const cy = 610;
  return (
    <AbsoluteFill>
      <Paper />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center" }}>
        <In t0={line("solution_2").start - 0.4}>
          <Label style={{ justifyContent: "center" }}>04 · The solution</Label>
        </In>
        <In t0={line("solution_2").start - 0.1} dur={0.9} style={{ marginTop: 16 }}>
          <Headline size={54}>
            From uncertainty to <Accent>clarity</Accent>.
          </Headline>
        </In>
        <In t0={word("solution_2", "from", 1) - 0.1} dur={0.9} style={{ marginTop: 4 }}>
          <Headline size={54}>
            From fragmentation to <Accent>transformation</Accent>.
          </Headline>
        </In>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {DIMS.map((d, i) => {
          const [x, y] = DPOS[i];
          const p = prog(t, tD[i], 0.9, easeInOut);
          const [nx, ny] = DPOS[i + 1] ?? DPOS[i];
          const q = i < DIMS.length - 1 ? prog(t, tD[i + 1] - 0.2, 0.8, easeInOut) : 0;
          return (
            <g key={d.k}>
              <Draw d={`M${cx} ${cy} L${x} ${y}`} p={p} stroke="rgba(200,150,46,0.55)" width={2.2} />
              {i < DIMS.length - 1 && <Draw d={`M${x} ${y} Q${(x + nx) / 2} ${Math.max(y, ny) + 120} ${nx} ${ny}`} p={q} stroke="rgba(234,88,12,0.6)" width={2.8} dash="6 9" />}
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: cx - 120, top: cy - 120 }}>
        <In t0={line("solution_2").start} dur={0.9} s0={0.7} dy={0}>
          <Orb size={240} t={t} glow={0.5} />
        </In>
      </div>
      <div style={{ position: "absolute", left: cx - 200, top: cy + 136, width: 400, textAlign: "center" }}>
        <In t0={line("solution_2").start + 0.3}>
          <div style={{ fontFamily: MARCELLUS, fontSize: 40, color: C.ink }}>AstroRaaga</div>
        </In>
      </div>
      {DIMS.map((d, i) => {
        const [x, y] = DPOS[i];
        const t0 = tD[i] + 0.3;
        return (
          <div key={d.k} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)" }}>
            <In t0={t0} dy={10} dur={0.6}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 24px 16px 16px", borderRadius: 22, background: C.card, border: `2px solid ${d.col}66`, boxShadow: `0 16px 34px ${d.col}1F`, whiteSpace: "nowrap" }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: `${d.col}1C`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={d.icon} size={28} color={d.col} />
                </div>
                <div>
                  <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 28, color: C.ink }}>
                    <span style={{ color: d.col, marginRight: 8 }}>{i + 1}</span>
                    {d.k}
                  </div>
                  <div style={{ fontFamily: KARLA, fontSize: 18, color: C.ink3 }}>{d.s}</div>
                </div>
              </div>
            </In>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------- products: the parent planet with two moons (light theme) ---------------- */
const Row: React.FC<{ t: number; t0: number; tint: string; children: React.ReactNode }> = ({ t, t0, tint, children }) => {
  const p = prog(t, t0, 0.45);
  const done = prog(t, t0 + 0.35, 0.3);
  if (p <= 0) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14, opacity: p, transform: `translateY(${(1 - p) * 10}px)` }}>
      <div style={{ width: 30, height: 30, borderRadius: 15, border: `2px solid ${tint}`, background: done > 0.5 ? tint : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {done > 0.5 && <Icon name="check" size={20} color="#fff" sw={3} />}
      </div>
      <div style={{ fontFamily: KARLA, fontSize: 25, color: C.ink }}>{children}</div>
    </div>
  );
};

const ProductCard: React.FC<{ t0: number; t1: number; children: React.ReactNode }> = ({ t0, t1, children }) => (
  <div style={{ position: "absolute", left: 120, top: 200 }}>
    <In t0={t0} t1={t1} dur={0.8} dx={-40} dy={0}>
      <Card style={{ width: 640, padding: 36, background: "rgba(255,253,249,0.94)" }}>{children}</Card>
    </In>
  </div>
);

const Head: React.FC<{ which: "jyotiq" | "karmeq"; name: string; role: string; tint: string }> = ({ which, name, role, tint }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
    <BrandIcon which={which} size={74} />
    <div>
      <div style={{ fontFamily: MARCELLUS, fontSize: 48, color: C.ink, lineHeight: 1 }}>{name}</div>
      <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 18, letterSpacing: "0.2em", textTransform: "uppercase", color: tint, marginTop: 8 }}>{role}</div>
    </div>
  </div>
);

const MoonTag: React.FC<{ id: MoonId | "mother"; t: number; k: Parameters<typeof systemCam>[1]; show: number; name: string; role: string; which?: "jyotiq" | "karmeq" }> = ({ id, t, k, show, name, role, which }) => {
  if (show <= 0) return null;
  const c = systemCam(t, k);
  const [x, y] = project(c, id === "mother" ? [0, -1.75, 0] : moonPos(id, t));
  return (
    <div style={{ position: "absolute", left: x, top: y + (id === "mother" ? 30 : 64), transform: `translate(-50%, ${(1 - show) * 10}px)`, opacity: show }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: which ? "9px 18px 9px 9px" : "10px 22px", borderRadius: 999, background: "rgba(255,253,249,0.92)", border: `1.5px solid ${C.goldHair}`, boxShadow: "0 12px 28px rgba(124,45,18,0.1)", whiteSpace: "nowrap" }}>
        {which && <BrandIcon which={which} size={40} />}
        <div>
          <div style={{ fontFamily: which ? KARLA : MARCELLUS, fontWeight: which ? 700 : 400, fontSize: which ? 23 : 30, color: C.ink, lineHeight: 1.05 }}>{name}</div>
          {role && <div style={{ fontFamily: KARLA, fontSize: 16, color: C.ink3 }}>{role}</div>}
        </div>
      </div>
    </div>
  );
};

const ProductsLayer: React.FC<{ t: number }> = ({ t }) => {
  const a = sc("products").start;
  const l2 = line("products_2");
  const l3 = line("products_3");
  const l4 = line("products_4");
  const k = { a, jy: l2.start - 0.8, km: l3.start - 0.8, back: l4.start - 0.5 };
  setMoonEpoch(a);
  const wideA = prog(t, a + 1.2, 0.7) * (1 - prog(t, k.jy, 0.5));
  const wideB = prog(t, k.back + 1.2, 0.7);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(1400px 900px at 50% 52%, #FFFDF7 0%, ${C.bg} 60%, #F8EBD3 100%)` }} />
      <Cosmos mode="system" k={k} epoch={a} />
      {/* headline in the wide shots */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", opacity: Math.max(wideA, wideB), transformOrigin: "50% 0%", transform: `scale(${0.92 + 0.08 * Math.max(wideA, wideB)})` }}>
        <Label style={{ justifyContent: "center" }}>04 · The products</Label>
        <Headline size={54} style={{ marginTop: 14 }}>
          One technology foundation. <Accent>Two products</Accent>.
        </Headline>
      </div>
      <MoonTag id="mother" t={t} k={k} show={Math.max(wideA, wideB)} name="AstroRaaga" role="" />
      <MoonTag id="jyotiq" t={t} k={k} show={Math.max(wideA, wideB)} name="JyotiQ" role="Personal astrology intelligence" which="jyotiq" />
      <MoonTag id="karmeq" t={t} k={k} show={Math.max(wideA, wideB)} name="KarmEQ" role="Business software + marketplace" which="karmeq" />
      {/* JyotiQ */}
      <ProductCard t0={l2.start - 0.1} t1={l3.start - 0.7}>
        <Head which="jyotiq" name="JyotiQ" role="Consumer intelligence" tint={C.violet} />
        <div style={{ marginTop: 26, padding: "16px 20px", borderRadius: 16, background: "#F6F0FF", border: `1.5px solid ${C.violet}33`, fontFamily: KARLA, fontSize: 25, color: C.ink, minHeight: 34 }}>
          <TypeText text="Will I get the job I applied for?" t={t} t0={l2.start + 0.3} cps={24} />
        </div>
        <Row t={t} t0={word("products_2", "personalised") - 0.2} tint={C.violet}>
          Reads the seeker's birth chart
        </Row>
        <Row t={t} t0={word("products_2", "vedic") - 0.1} tint={C.violet}>
          A personalised Vedic reading
        </Row>
        <Row t={t} t0={word("products_2", "seconds") - 0.1} tint={C.violet}>
          Answered in about 5 seconds
        </Row>
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <Pill size={19} icon={<Icon name="question" size={20} color={C.violet} />}>Paid chat & guidance</Pill>
          <Pill size={19}>Live calling next</Pill>
        </div>
      </ProductCard>
      {/* KarmEQ */}
      <ProductCard t0={isV5() ? Math.max(l3.start - 0.1, k.km + 2.1) : l3.start - 0.1} t1={l4.start - 0.6}>
        <Head which="karmeq" name="KarmEQ" role="Business software + marketplace" tint={C.green} />
        <div style={{ marginTop: 24, fontFamily: KARLA, fontWeight: 700, fontSize: 15, letterSpacing: "0.18em", color: C.goldDeep, opacity: prog(t, word("products_3", "professionals") - 0.2, 0.4) }}>FOR PROFESSIONALS</div>
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          {["Manage", "Practice", "Grow"].map((k, i) => (
            <div key={k} style={{ opacity: prog(t, word("products_3", "software") - 0.2 + i * 0.18, 0.4), padding: "10px 18px", borderRadius: 14, background: "#EEF8F3", border: `1.5px solid ${C.green}44`, fontFamily: KARLA, fontWeight: 700, fontSize: 22, color: C.green }}>
              {k}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 22, fontFamily: KARLA, fontWeight: 700, fontSize: 15, letterSpacing: "0.18em", color: C.goldDeep, opacity: prog(t, word("products_3", "families") - 0.2, 0.4) }}>FOR FAMILIES · MARKETPLACE</div>
        <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
          {[
            ["pujas", "Pujas", "temple"],
            ["havans", "Havans", "spark"],
            ["verified", "Verified experts", "shield"],
          ].map(([w, k2, icon]) => (
            <div key={k2} style={{ opacity: prog(t, word("products_3", w) - 0.15, 0.4), display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 999, border: `1.5px solid ${C.green}55`, fontFamily: KARLA, fontWeight: 700, fontSize: 20, color: C.green }}>
              <Icon name={icon} size={20} color={C.green} />
              {k2}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 22, padding: "16px 0", borderRadius: 16, textAlign: "center", fontFamily: KARLA, fontWeight: 700, fontSize: 24, color: "#fff", background: prog(t, l3.end - 0.6, 0.3) > 0.5 ? C.green : C.saffron }}>
          {prog(t, l3.end - 0.6, 0.3) > 0.5 ? "Puja booked ✓" : "Book a puja"}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <Pill size={19} icon={<Icon name="users" size={20} color={C.green} />}>Subscriptions + retained booking fee</Pill>
        </div>
      </ProductCard>
      {/* together */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 100, display: "flex", justifyContent: "center" }}>
        <In t0={word("products_4", "together") - 0.1}>
          <Pill size={26} icon={<Orb size={30} t={t} glow={0.2} />}>
            Together: the Intelligent Human Guidance Ecosystem
          </Pill>
        </In>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- close: the ecosystem opens an orbit for the investor ---------------- */
const CX = 960;
const CY = 330;
const TILT = (-7 * Math.PI) / 180;
const ORBITS = [
  { name: "JyotiQ", rx: 380, ry: 104, col: C.violet, r: 16, th0: 1.9, w: 0.14 },
  { name: "KarmEQ", rx: 560, ry: 150, col: C.green, r: 18, th0: 0.25, w: 0.11 },
];
const YOU = { rx: 780, ry: 210 };
const onOrbit = (rx: number, ry: number, th: number): [number, number] => {
  const x = rx * Math.cos(th);
  const y = ry * Math.sin(th);
  return [CX + x * Math.cos(TILT) - y * Math.sin(TILT), CY + x * Math.sin(TILT) + y * Math.cos(TILT)];
};
const ellipse = (rx: number, ry: number) => {
  let d = "";
  for (let i = 0; i <= 72; i++) {
    const [x, y] = onOrbit(rx, ry, (i / 72) * Math.PI * 2);
    d += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d;
};
const Ball: React.FC<{ r: number; col: string; glow: number }> = ({ r, col, glow }) => (
  <div style={{ position: "absolute", left: -r, top: -r, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${col} 45%, ${col} 100%)`, boxShadow: `0 0 ${10 + 26 * glow}px ${col}${glow > 0.5 ? "AA" : "66"}` }} />
);

const CloseLayer: React.FC<{ t: number }> = ({ t }) => {
  const a = sc("close").start;
  const l = line("close_1");
  const tPartner = word("close_1", "partner");
  const tBe = word("close_1", "be");
  const tTog = word("close_1", "together");
  const tChange = word("close_1", "change");
  const lock = prog(t, l.start - 0.1, 1.0);
  const lit = Math.sin(Math.PI * prog(t, tChange - 0.05, 1.0, easeInOut));
  const bloom = Math.min(1, prog(t, l.start - 0.25, 1.4) + 0.35 * lit);
  const youDraw = prog(t, tPartner - 0.25, 1.1, easeInOut);
  const youIn = prog(t, tPartner + 0.15, 1.3, easeInOut);
  const youTh = 0.62 - 0.9 * (1 - youIn) + 0.06 * (t - tPartner);
  const [yx, yy] = onOrbit(YOU.rx, YOU.ry, youTh);
  return (
    <AbsoluteFill>
      <Paper />
      <div style={{ position: "absolute", left: CX - 760, top: CY - 400, width: 1520, height: 800, borderRadius: "50%", opacity: bloom * 0.9, transform: `scale(${0.6 + 0.4 * bloom})`, background: "radial-gradient(ellipse at center, rgba(245,158,11,0.22) 0%, rgba(234,88,12,0.08) 38%, rgba(0,0,0,0) 70%)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {ORBITS.map((o, i) => (
          <Draw key={o.name} d={ellipse(o.rx, o.ry)} p={prog(t, l.start + 0.35 + i * 0.18, 1.3, easeInOut)} stroke={`rgba(200,150,46,${0.55 + 0.3 * lit})`} width={1.8} />
        ))}
        <path d={ellipse(YOU.rx, YOU.ry)} fill="none" stroke={`rgba(234,88,12,${0.55 * youDraw})`} strokeWidth={2} strokeDasharray="7 11" strokeDashoffset={-t * 14} style={{ clipPath: `inset(0 ${(1 - youDraw) * 100}% 0 0)` }} />
      </svg>
      <div style={{ position: "absolute", left: CX - 330, top: CY - 120, width: 660, height: 240, borderRadius: "50%", background: `radial-gradient(ellipse at center, ${C.bg}F2 0%, ${C.bg}D9 45%, rgba(255,250,241,0) 72%)` }} />
      {ORBITS.map((o, i) => {
        const p = prog(t, l.start + 0.7 + i * 0.2, 0.6);
        const [x, y] = onOrbit(o.rx, o.ry, o.th0 + o.w * (t - a));
        return (
          <div key={o.name} style={{ position: "absolute", left: 0, top: 0, opacity: p }}>
            <div style={{ position: "absolute", left: x, top: y, transform: `scale(${p * (1 + 0.25 * lit)})` }}>
              <Ball r={o.r} col={o.col} glow={lit} />
            </div>
            <div style={{ position: "absolute", left: x < CX ? x - o.r - 12 : x + o.r + 12, top: y - 12, transform: x < CX ? "translateX(-100%)" : undefined, fontFamily: KARLA, fontWeight: 700, fontSize: 20, letterSpacing: "0.06em", color: o.col, whiteSpace: "nowrap" }}>
              {o.name}
            </div>
          </div>
        );
      })}
      {youIn > 0 && (
        <div style={{ position: "absolute", left: 0, top: 0, opacity: youIn }}>
          <div style={{ position: "absolute", left: yx - 34, top: yy - 34, width: 68, height: 68, borderRadius: "50%", border: "2px solid rgba(245,158,11,0.55)", transform: `scale(${1 + 0.18 * Math.sin(t * 3)})` }} />
          <div style={{ position: "absolute", left: yx, top: yy, transform: `scale(${1 + 0.3 * lit})` }}>
            <Ball r={20} col={C.amber} glow={0.6 + 0.4 * lit} />
          </div>
          <div style={{ position: "absolute", left: yx + 44, top: yy - 22 }}>
            <Pill size={24}>You</Pill>
          </div>
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: CY - 68, display: "flex", justifyContent: "center" }}>
        <div style={{ opacity: lock, transform: `translateY(${(1 - lock) * 24}px) scale(${0.94 + 0.06 * lock})`, filter: lock < 1 ? `blur(${(1 - lock) * 12}px)` : undefined }}>
          <Img src={asset("brand/logo_4x.png")} style={{ width: 440 }} />
        </div>
      </div>
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
    </AbsoluteFill>
  );
};

/* ---------------- the hub board: solution → products → close ---------------- */
export const HubBoard: React.FC = () => {
  const t = useWinT();
  const pA = sc("products").start;
  const cA = sc("close").start;
  const toProducts = prog(t, pA - 0.3, 1.2, easeInOut);
  const toClose = prog(t, cA - 1.8, 1.2, easeInOut);
  return (
    <AbsoluteFill>
      {toProducts < 1 && (
        <AbsoluteFill style={{ opacity: 1 - toProducts, transform: `scale(${lerp(1, 1.5, toProducts)})`, transformOrigin: "960px 610px" }}>
          <SolutionLayer t={t} />
        </AbsoluteFill>
      )}
      {toProducts > 0 && toClose < 1 && (
        <AbsoluteFill style={{ opacity: toProducts * (1 - toClose) }}>
          <ProductsLayer t={t} />
        </AbsoluteFill>
      )}
      {toClose > 0 && (
        <AbsoluteFill style={{ opacity: toClose }}>
          <CloseLayer t={t} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const _h = [rnd];
