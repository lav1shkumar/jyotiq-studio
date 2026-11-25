import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { MoonId, moonPos, project, setMoonEpoch, systemCam } from "../cam";
import { Cosmos } from "../Cosmos";
import { C, CE, easeInOut, JY, KARLA, KM, lerp, line, MARCELLUS, prog, rnd, sc, word, wordEnd } from "../theme";
import { Accent, asset, BrandIcon, Card, Draw, Headline, Icon, In, Label, Orb, Paper, Pill, useWinT, v7img } from "../ui";

/* ---------------- solution (v7): the AstroRaaga logo at the centre, five nodes that close into a glowing 5-point star ----
   (node names follow the 21 Nov plan; "needs confirmation" with Amit sir) */
const DIMS = [
  { k: "Discovery", s: "ask JyotiQ anything", w: "discovery", icon: "question", col: C.mercury },
  { k: "Guidance", s: "KarmEQ · personal, verified advice", w: "guidance", icon: "chat", col: C.saffron },
  { k: "Booking", s: "KarmEQ · experts, pujas, havans", w: "booking", icon: "temple", col: C.jupiter },
  { k: "Community", s: "seekers and professionals", w: "community", icon: "users", col: C.saturn },
  { k: "Transformation", s: "lasting change", w: "transformation", icon: "spark", col: C.ketu },
];
const SCX = 960;
const SCY = 660;
const DPOS: [number, number][] = DIMS.map((_, i) => {
  const an = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
  return [SCX + Math.cos(an) * 400, SCY + Math.sin(an) * 285];
});

const SolutionLayer: React.FC<{ t: number }> = ({ t }) => {
  const tD = DIMS.map((d) => word("solution_3", d.w) - 0.3);
  const tStar = wordEnd("solution_3", "transformation") + 0.05;
  const star = prog(t, tStar, 1.4, easeInOut);
  const glow = prog(t, tStar + 1.0, 1.0) * (0.75 + 0.25 * Math.sin(t * 2.6));
  // pentagram: each node to the one two steps on
  const starD = [0, 2, 4, 1, 3, 0].map((k, i) => `${i ? "L" : "M"}${DPOS[k][0].toFixed(1)} ${DPOS[k][1].toFixed(1)}`).join(" ");
  return (
    <AbsoluteFill>
      <Paper />
      <div style={{ position: "absolute", left: 0, right: 0, top: 104, textAlign: "center" }}>
        <In t0={line("solution_2").start - 0.4}>
          <Label style={{ justifyContent: "center" }}>04 · The solution</Label>
        </In>
        <In t0={line("solution_2").start - 0.1} dur={0.9} style={{ marginTop: 6 }}>
          <Headline size={52}>
            From uncertainty to <Accent>clarity</Accent>. From fragmentation to <Accent>transformation</Accent>.
          </Headline>
        </In>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="starGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>
        {DIMS.map((d, i) => {
          const [x, y] = DPOS[i];
          return <Draw key={d.k} d={`M${SCX} ${SCY} L${x} ${y}`} p={prog(t, tD[i], 0.9, easeInOut)} stroke="rgba(200,150,46,0.5)" width={2.2} />;
        })}
        {glow > 0 && <path d={starD} fill="none" stroke={`rgba(245,158,11,${0.55 * glow})`} strokeWidth={16} filter="url(#starGlow)" />}
        <Draw d={starD} p={star} stroke="rgba(234,88,12,0.85)" width={3.4} />
      </svg>
      {/* a paper halo keeps the star's lines off the logo and its name */}
      <div style={{ position: "absolute", left: SCX - 210, top: SCY - 175, width: 420, height: 360, borderRadius: "50%", opacity: prog(t, line("solution_2").start, 0.6), background: `radial-gradient(ellipse at center, ${C.bg} 0%, ${C.bg} 55%, rgba(255,245,226,0) 72%)` }} />
      <div style={{ position: "absolute", left: SCX - 170, top: SCY - 135, width: 340, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <In t0={line("solution_2").start} dur={0.9} s0={0.7} dy={0}>
          <div style={{ position: "relative", width: 150, height: 150 }}>
            <div style={{ position: "absolute", inset: -60, borderRadius: "50%", background: `radial-gradient(circle, rgba(245,158,11,${0.32 + 0.25 * glow}) 0%, rgba(245,158,11,0) 66%)` }} />
            <Img src={asset("brand/icon_4x.png")} style={{ position: "relative", width: 150, height: 150, objectFit: "contain" }} />
          </div>
        </In>
        <In t0={line("solution_2").start + 0.3} style={{ marginTop: 6, textAlign: "center" }}>
          <div style={{ fontFamily: MARCELLUS, fontSize: 46, color: C.ink, lineHeight: 1 }}>AstroRaaga</div>
        </In>
      </div>
      {DIMS.map((d, i) => {
        const [x, y] = DPOS[i];
        return (
          <div key={d.k} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)" }}>
            <In t0={tD[i] + 0.3} dy={10} dur={0.6}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 22px 14px 14px", borderRadius: 22, background: C.card, border: `2px solid ${d.col}66`, boxShadow: `0 16px 34px ${d.col}22, 0 0 ${30 * glow}px rgba(245,158,11,${0.35 * glow})`, whiteSpace: "nowrap" }}>
                <div style={{ width: 50, height: 50, borderRadius: 16, background: `${d.col}1C`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={d.icon} size={28} color={d.col} />
                </div>
                <div>
                  <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 28, color: C.ink }}>{d.k}</div>
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
  <div style={{ position: "absolute", left: 100, top: 150 }}>
    <In t0={t0} t1={t1} dur={0.8} dx={-40} dy={0}>
      <Card style={{ width: 660, padding: 36, background: "rgba(255,253,249,0.95)" }}>{children}</Card>
    </In>
  </div>
);

const Head: React.FC<{ which: "jyotiq" | "karmeq"; name: string; role: string; tint: string }> = ({ which, name, role, tint }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
    <BrandIcon which={which} size={112} />
    <div>
      <div style={{ fontFamily: MARCELLUS, fontSize: 76, color: C.ink, lineHeight: 0.95 }}>{name}</div>
      <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 19, letterSpacing: "0.18em", textTransform: "uppercase", color: tint, marginTop: 10 }}>{role}</div>
    </div>
  </div>
);

/** v7 "walk the product": a phone with the real JyotiQ screens, cross-fading on the voice. */
const Phone: React.FC<{ t: number; screens: { src: string; t0: number }[]; t0: number; t1: number; x: number; y: number; tint: string }> = ({ t, screens, t0, t1, x, y, tint }) => {
  let cur = 0;
  screens.forEach((sc0, i) => {
    if (t >= sc0.t0) cur = i;
  });
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      <In t0={t0} t1={t1} dur={0.9} dy={40}>
        <div style={{ position: "relative", width: 330, height: 690, borderRadius: 52, background: "#17110B", padding: 13, boxSizing: "border-box", boxShadow: `0 40px 90px rgba(44,24,16,0.28), 0 0 0 2px ${tint}55` }}>
          <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 40, overflow: "hidden", background: "#FFF8EE" }}>
            {screens.map((sc0, i) => {
              const p = i === 0 ? 1 : prog(t, sc0.t0, 0.5);
              if (i > cur + 1 || p <= 0) return null;
              return <Img key={sc0.src} src={sc0.src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0%", opacity: p, transform: `scale(${1.04 - 0.04 * p})` }} />;
            })}
          </div>
          <div style={{ position: "absolute", left: "50%", top: 22, width: 90, height: 24, marginLeft: -45, borderRadius: 12, background: "#17110B" }} />
        </div>
      </In>
    </div>
  );
};

/** v8 (Amit sir): KarmEQ foundation 1 shown on the real astroraag.com site (the Our Astrologers page). */
const WebPanel: React.FC<{ t: number; t0: number; t1: number; src: string; url: string; x: number; y: number; w: number; ratio: number; scroll?: [number, number] }> = ({ t, t0, t1, src, url, x, y, w, ratio, scroll }) => {
  const h = w / ratio;
  const sc0 = scroll ? prog(t, scroll[0], scroll[1], easeInOut) : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      <In t0={t0} t1={t1} dur={0.9} dy={30}>
        <div style={{ width: w, borderRadius: 22, background: "#fff", border: `2px solid ${KM}44`, boxShadow: "0 36px 80px rgba(124,45,18,0.2)", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", background: "#F4EEE4", borderBottom: "1px solid #E6DccC" }}>
            {["#F87171", "#FBBF24", "#34D399"].map((c) => <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />)}
            <div style={{ marginLeft: 14, flex: 1, padding: "6px 16px", borderRadius: 999, background: "#fff", fontFamily: KARLA, fontWeight: 600, fontSize: 18, color: C.ink2 }}>{url}</div>
          </div>
          <div style={{ position: "relative", width: w, height: h * (scroll ? 0.82 : 1), overflow: "hidden" }}>
            <Img src={src} style={{ position: "absolute", left: 0, top: -h * 0.18 * sc0, width: w, height: h, transform: `scale(${1.02 - 0.02 * prog(t, t0, 6)})`, transformOrigin: "50% 0%" }} />
          </div>
        </div>
      </In>
    </div>
  );
};

/** KarmEQ foundation 2: the marketplace for families (painted havan card in the site's service-card style). */
const MarketCard: React.FC<{ t: number; t0: number; t1: number; tBook: number }> = ({ t, t0, t1, tBook }) => {
  const booked = prog(t, tBook, 0.3) > 0.5;
  return (
    <div style={{ position: "absolute", left: 830, top: 250 }}>
      <In t0={t0} t1={t1} dur={0.9} dy={30}>
        <div style={{ width: 460, borderRadius: 28, background: C.card, border: `2px solid ${KM}55`, boxShadow: "0 36px 80px rgba(124,45,18,0.18)", overflow: "hidden" }}>
          <Img src={v7img("pandit", "pandit")} style={{ width: "100%", height: 280, objectFit: "cover", display: "block" }} />
          <div style={{ padding: "18px 22px 22px" }}>
            <div style={{ fontFamily: MARCELLUS, fontSize: 34, color: C.ink }}>Havan at home</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, fontFamily: KARLA, fontWeight: 700, fontSize: 18, color: C.mercury }}>
              <Icon name="shield" size={20} color={C.mercury} /> Verified pandit
            </div>
            <div style={{ marginTop: 16, padding: "14px 0", borderRadius: 14, textAlign: "center", fontFamily: KARLA, fontWeight: 800, fontSize: 22, color: "#fff", background: booked ? C.mercury : C.saffron }}>{booked ? "Booked ✓" : "Book a havan"}</div>
          </div>
        </div>
      </In>
    </div>
  );
};

const MoonTag: React.FC<{ id: MoonId | "mother"; t: number; k: Parameters<typeof systemCam>[1]; show: number; name: string; role: string; which?: "jyotiq" | "karmeq" }> = ({ id, t, k, show, name, role, which }) => {
  if (show <= 0) return null;
  const c = systemCam(t, k);
  const [x, y] = project(c, id === "mother" ? [0, -1.42, 0] : moonPos(id, t));
  return (
    <div style={{ position: "absolute", left: x, top: y + (id === "mother" ? 30 : id === "engine" ? -130 : 70), transform: `translate(-50%, ${(1 - show) * 10}px)`, opacity: show }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: which ? "10px 22px 10px 10px" : "12px 26px", borderRadius: 999, background: "rgba(255,253,249,0.94)", border: `1.5px solid ${C.goldHair}`, boxShadow: "0 12px 28px rgba(124,45,18,0.1)", whiteSpace: "nowrap" }}>
        {which && <BrandIcon which={which} size={54} />}
        {id === "engine" && <div style={{ width: 40, height: 40, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, #BFE3FF, ${CE} 55%, #1B4E80)`, boxShadow: `0 0 18px ${CE}88` }} />}
        <div>
          <div style={{ fontFamily: which || id === "engine" ? KARLA : MARCELLUS, fontWeight: which || id === "engine" ? 800 : 400, fontSize: id === "engine" ? 26 : which ? 32 : 40, color: C.ink, lineHeight: 1.05 }}>{name}</div>
          {role && <div style={{ fontFamily: KARLA, fontSize: 19, color: C.ink3 }}>{role}</div>}
        </div>
      </div>
    </div>
  );
};

/** v8: glowing links from the Sun to every orbit (the Milky Way beat). */
const Links: React.FC<{ t: number; k: Parameters<typeof systemCam>[1]; p: number }> = ({ t, k, p }) => {
  const c = systemCam(t, k);
  const [sx, sy] = project(c, [0, 0, 0]);
  const pts = (["jyotiq", "engine", "karmeq"] as MoonId[]).map((id) => project(c, moonPos(id, t)));
  const cols = [JY, CE, KM];
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <filter id="lkGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      {pts.map(([x, y], i) => (
        <g key={i} opacity={p * (0.75 + 0.25 * Math.sin(t * 2.4 + i))}>
          <line x1={sx} y1={sy} x2={x} y2={y} stroke={cols[i]} strokeWidth={10} filter="url(#lkGlow)" />
          <line x1={sx} y1={sy} x2={x} y2={y} stroke="#FFF4D6" strokeWidth={2} />
        </g>
      ))}
      {pts.map(([x, y], i) => {
        const [x2, y2] = pts[(i + 1) % 3];
        return <line key={`r${i}`} x1={x} y1={y} x2={x2} y2={y2} stroke="#FFE7B0" strokeWidth={1.6} strokeDasharray="6 10" strokeDashoffset={-t * 20} opacity={0.7 * p} />;
      })}
    </svg>
  );
};

const ProductsLayer: React.FC<{ t: number }> = ({ t }) => {
  const a = sc("products").start;
  const l2 = line("products_2");
  const l3 = line("products_3");
  const l4 = line("products_4");
  const tEng = word("products_4", "content") - 0.6;
  const k = { a, jy: l2.start - 0.8, km: l3.start - 0.8, back: l4.start - 0.5, eng: tEng };
  // v8 (Amit sir): on "reaches every seeker" the view opens out to the Milky Way: everything connected and glowing
  const tMw = word("products_4", "reaches") - 0.4;
  const mw = prog(t, tMw, 1.6, easeInOut) * (1 - prog(t, sc("products").end - 0.9, 0.8));
  setMoonEpoch(a);
  const wideA = prog(t, a + 1.2, 0.7) * (1 - prog(t, k.jy, 0.5));
  const wideB = prog(t, k.back + 1.2, 0.7);
  const kmIn = Math.max(l3.start - 0.1, k.km + 2.1);
  const tFam = word("products_3", "families");
  const scr = (n: string) => asset(`v7/screens/jy_${n}.png`);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(1400px 900px at 50% 52%, #FFFDF7 0%, ${C.bg} 60%, #F8EBD3 100%)` }} />
      {mw > 0 && (
        <AbsoluteFill style={{ opacity: mw }}>
          <Img src={v7img("milkyway", "temple")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.18 - 0.14 * prog(t, tMw, 9)})` }} />
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(255,220,150,0.18) 0%, rgba(10,8,30,0.1) 55%, rgba(5,4,16,0.45) 100%)" }} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ transform: `scale(${1 - 0.16 * mw})`, transformOrigin: "50% 48%" }}>
        <Cosmos mode="system" k={k} epoch={a} />
        {mw > 0 && <Links t={t} k={k} p={mw} />}
      </AbsoluteFill>
      {/* headline in the wide shots */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 104, textAlign: "center", opacity: Math.max(wideA, wideB) * (1 - mw), transformOrigin: "50% 0%", transform: `scale(${0.92 + 0.08 * Math.max(wideA, wideB)})` }}>
        <Headline size={58}>
          One technology foundation. <Accent>Two products</Accent>.
        </Headline>
      </div>
      <AbsoluteFill style={{ transform: `scale(${1 - 0.16 * mw})`, transformOrigin: "50% 48%" }}>
        <MoonTag id="mother" t={t} k={k} show={Math.max(wideA, wideB)} name="AstroRaaga" role="" />
        <MoonTag id="jyotiq" t={t} k={k} show={wideB} name="JyotiQ" role="Personal astrology intelligence" which="jyotiq" />
        <MoonTag id="karmeq" t={t} k={k} show={wideB} name="KarmEQ" role="Software + marketplace" which="karmeq" />
        <MoonTag id="engine" t={t} k={k} show={prog(t, tEng + 0.5, 0.6)} name="Content engine" role="Proprietary marketing" />
      </AbsoluteFill>
      {mw > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 118, textAlign: "center", opacity: mw }}>
          <Headline size={56} color="#FFF4E2">
            Reaches every <Accent light>seeker</Accent>.
          </Headline>
          <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 18 }}>
            {[
              ["Professionals grow", CE, "professionals"],
              ["Every seeker reached", JY, "seeker"],
            ].map(([k2, col, w]) => (
              <div key={k2} style={{ opacity: prog(t, Math.max(tMw + 0.4, word("products_4", w) - 0.2), 0.5), padding: "8px 20px", borderRadius: 999, background: "rgba(255,250,240,0.12)", border: `1.5px solid ${col}`, fontFamily: KARLA, fontWeight: 700, fontSize: 22, color: "#FFF4E2", boxShadow: `0 0 22px ${col}66` }}>
                {k2}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* JyotiQ: talk the product, walk the product */}
      <ProductCard t0={l2.start - 0.1} t1={l3.start - 0.7}>
        <Head which="jyotiq" name="JyotiQ" role="Paid astrology intelligence" tint={JY} />
        {/* v8.1 (Amit sir): text only as it is spoken; no typing while the narrator says something else */}
        <Row t={t} t0={word("products_2", "paid") - 0.15} tint={JY}>
          Paid and personalised
        </Row>
        <Row t={t} t0={word("products_2", "vedic") - 0.15} tint={JY}>
          Vedic astrology intelligence
        </Row>
        <Row t={t} t0={word("products_2", "question") - 0.15} tint={JY}>
          Any question, answered in seconds
        </Row>
      </ProductCard>
      <Phone t={t} t0={l2.start + 0.2} t1={l3.start - 0.7} x={820} y={190} tint={JY}
        screens={[
          { src: scr("14"), t0: 0 },
          { src: scr("08"), t0: word("products_2", "personalised") - 0.2 },
          { src: scr("18"), t0: word("products_2", "seconds") - 0.4 },
        ]} />
      {/* KarmEQ: two foundations */}
      <ProductCard t0={kmIn} t1={l4.start - 0.6}>
        <Head which="karmeq" name="KarmEQ" role="For professionals and families" tint={KM} />
        <div style={{ marginTop: 26, fontFamily: KARLA, fontWeight: 800, fontSize: 18, letterSpacing: "0.16em", color: C.goldDeep, opacity: prog(t, word("products_3", "professionals") - 0.2, 0.4) }}>1 · SOFTWARE FOR EVERY SPIRITUAL PROFESSIONAL</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
          {["Priests", "Astrologers", "Numerologists", "Vastu", "Tarot"].map((k2, i) => (
            <div key={k2} style={{ opacity: prog(t, word("products_3", "software") - 0.3 + i * 0.14, 0.4), padding: "8px 16px", borderRadius: 999, background: `${KM}14`, border: `1.5px solid ${KM}55`, fontFamily: KARLA, fontWeight: 700, fontSize: 21, color: C.ink }}>
              {k2}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 26, fontFamily: KARLA, fontWeight: 800, fontSize: 18, letterSpacing: "0.16em", color: C.goldDeep, opacity: prog(t, tFam - 0.2, 0.4) }}>2 · MARKETPLACE FOR FAMILIES</div>
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          {[
            ["pujas", "Pujas", "temple"],
            ["havans", "Havans", "spark"],
            ["verified", "Verified experts", "shield"],
          ].map(([w, k2, icon]) => (
            <div key={k2} style={{ opacity: prog(t, word("products_3", w) - 0.15, 0.4), display: "flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 999, border: `1.5px solid ${KM}66`, fontFamily: KARLA, fontWeight: 700, fontSize: 21, color: C.ink }}>
              <Icon name={icon} size={20} color={KM} />
              {k2}
            </div>
          ))}
        </div>
      </ProductCard>
      <WebPanel t={t} t0={kmIn + 0.1} t1={word("products_3", "pujas") - 0.4} src={asset("v7/web/astrologers.jpg")} url="astroraag.com/astrologers" x={800} y={190} w={1000} ratio={2160 / 1300} />
      <MarketCard t={t} t0={word("products_3", "pujas") - 0.2} t1={l4.start - 0.6} tBook={l3.end - 0.5} />
      {/* together */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 100, display: "flex", justifyContent: "center" }}>
        <In t0={word("products_4", "intelligent") - 0.15}>
          <Pill size={28} icon={<Orb size={32} t={t} glow={0.2} />}>
            The Intelligent Human Guidance Ecosystem
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
  { name: "JyotiQ", rx: 360, ry: 98, col: JY, r: 16, th0: 1.9, w: 0.14 },
  { name: "Content engine", rx: 470, ry: 127, col: CE, r: 15, th0: 3.6, w: 0.12 },
  { name: "KarmEQ", rx: 580, ry: 156, col: KM, r: 18, th0: 0.25, w: 0.11 },
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
      {/* v8 (Amit sir): the universe, lit up, with AstroRaaga as its Sun */}
      <AbsoluteFill style={{ opacity: 0.22 * prog(t, l.start - 0.6, 1.6), mixBlendMode: "multiply" }}>
        <Img src={v7img("milkyway", "temple")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.5) saturate(0.8) brightness(1.5)", transform: `scale(${1.1 - 0.05 * prog(t, l.start, 10)})` }} />
      </AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 90 }, (_, i) => {
          const x = rnd(i * 3.1) * 1920;
          const y = rnd(i * 7.7 + 1) * 1080;
          const tw = 0.35 + 0.65 * Math.abs(Math.sin(t * (0.8 + rnd(i) * 1.6) + i));
          const r = 1 + rnd(i * 1.3) * 2.2;
          return <circle key={i} cx={x} cy={y} r={r} fill={i % 5 ? "#E0A83C" : "#F59E0B"} opacity={tw * 0.7 * prog(t, l.start - 0.3 + rnd(i) * 1.5, 0.8)} />;
        })}
      </svg>
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
        <In t0={tChange + 0.55} dur={0.8} style={{ marginTop: 34 }}>
          {/* v7 end card: the three names + the site and a QR code */}
          <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  ["KarmEQ SaaS", KM],
                  ["KarmEQ Marketplace", KM],
                  ["JyotiQ", JY],
                ].map(([k2, col]) => (
                  <div key={k2} style={{ padding: "8px 18px", borderRadius: 999, background: `${col}14`, border: `1.5px solid ${col}66`, fontFamily: KARLA, fontWeight: 800, fontSize: 22, color: C.ink }}>{k2}</div>
                ))}
              </div>
              <Pill dark size={26}>
                astroraag.com
              </Pill>
            </div>
            <Img src={asset("v7/qr_astroraag.png")} style={{ width: 150, height: 150, borderRadius: 16, border: `2px solid ${C.goldHair}` }} />
          </div>
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
        <AbsoluteFill style={{ opacity: 1 - toProducts, transform: `scale(${lerp(1, 1.5, toProducts)})`, transformOrigin: "960px 660px" }}>
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
