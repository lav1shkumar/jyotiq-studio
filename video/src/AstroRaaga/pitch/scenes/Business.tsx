import React from "react";
import { AbsoluteFill } from "remotion";
import { C, ease, easeInOut, KARLA, lerp, line, MARCELLUS, prog, SCENES, word } from "../theme";
import { Accent, Body, Burst, Card, Draw, Headline, Icon, In, Label, Orb, Paper, Pill, Scene, useWinT } from "../ui";

/* ---------- market ---------- */
const curve = (w: number, h: number, k: number) => {
  // smooth rising curve from (0,h*0.82) to (w, h*0.12)
  const pts: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const u = i / 60;
    const y = h * (0.84 - 0.72 * Math.pow(u, k)) + Math.sin(u * 9) * 6 * (1 - u);
    pts.push(`${(u * w).toFixed(1)} ${y.toFixed(1)}`);
  }
  return "M" + pts.join(" L");
};

export const MarketScene: React.FC = () => {
  const t = useWinT();
  const [a, b] = SCENES.market;
  const s11 = line("s11");
  const tIndia = word("s11", "india");
  const tUS = word("s11", "us");
  const W = 900;
  const H = 520;
  const p = prog(t, tIndia - 0.2, 2.6, easeInOut);
  const d = curve(W, H, 1.7);
  const endY = H * (0.84 - 0.72);
  return (
    <Burst x={960} y={540} t0={a} dur={1.0}>
      <Scene a={a} b={b} noIn>
        <Paper tint="rgba(124,58,237,0.07)" />
        <div style={{ position: "absolute", left: 140, top: 150, width: 680 }}>
          <In t0={a + 0.25}>
            <Label>The market</Label>
          </In>
          <In t0={s11.start} dur={0.9} style={{ marginTop: 26 }}>
            <Headline size={74}>
              Big, digital, and <Accent>growing</Accent>.
            </Headline>
          </In>
          <div style={{ marginTop: 50, display: "flex", flexDirection: "column", gap: 22 }}>
            <In t0={tIndia + 0.4} dx={-30} dy={0}>
              <Card style={{ padding: "26px 30px", width: 600 }}>
                <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 20, letterSpacing: "0.16em", color: C.rust }}>INDIA · DIGITAL ASTROLOGY · 2030</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 8 }}>
                  <div style={{ fontFamily: MARCELLUS, fontSize: 72, color: C.ink }}>$1.8B</div>
                  <div style={{ fontFamily: KARLA, fontSize: 28, color: C.ink2 }}>₹17,100 Cr</div>
                </div>
              </Card>
            </In>
            <In t0={tUS - 0.1} dx={-30} dy={0}>
              <Card style={{ padding: "26px 30px", width: 600 }}>
                <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 20, letterSpacing: "0.16em", color: C.violet }}>UNITED STATES · ONLINE ASTROLOGY · TODAY</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 8 }}>
                  <div style={{ fontFamily: MARCELLUS, fontSize: 72, color: C.ink }}>$3B</div>
                  <div style={{ fontFamily: KARLA, fontSize: 28, color: C.ink2 }}>₹28,500 Cr</div>
                </div>
              </Card>
            </In>
          </div>
        </div>
        <div style={{ position: "absolute", left: 900, top: 250 }}>
          <svg width={W + 40} height={H + 80} style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="mk" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="rgba(245,158,11,0.32)" />
                <stop offset="1" stopColor="rgba(245,158,11,0)" />
              </linearGradient>
              <clipPath id="mkc">
                <rect x={0} y={-20} width={W * p} height={H + 40} />
              </clipPath>
            </defs>
            {[0.25, 0.5, 0.75].map((g) => (
              <line key={g} x1={0} x2={W} y1={H * g} y2={H * g} stroke="rgba(44,24,16,0.07)" strokeWidth={1.5} />
            ))}
            <line x1={0} x2={W} y1={H * 0.9} y2={H * 0.9} stroke="rgba(44,24,16,0.18)" strokeWidth={1.5} />
            <g clipPath="url(#mkc)">
              <path d={`${d} L${W} ${H * 0.9} L0 ${H * 0.9} Z`} fill="url(#mk)" />
            </g>
            <Draw d={d} p={p} stroke={C.saffron} width={3.5} />
            <text x={0} y={H * 0.9 + 44} fontFamily={KARLA} fontSize={22} fill={C.ink3}>
              Today
            </text>
            <text x={W} y={H * 0.9 + 44} fontFamily={KARLA} fontSize={22} fill={C.ink3} textAnchor="end">
              2030
            </text>
            {p > 0.98 && (
              <g opacity={prog(t, tIndia + 2.4, 0.4)}>
                <circle cx={W} cy={endY} r={20} fill="rgba(234,88,12,0.15)" />
                <circle cx={W} cy={endY} r={9} fill="#fff" stroke={C.saffron} strokeWidth={4} />
              </g>
            )}
          </svg>
          <div style={{ position: "absolute", left: W - 210, top: endY - 92, opacity: prog(t, tIndia + 2.5, 0.5) }}>
            <Pill dark size={22}>
              $1.8B by 2030
            </Pill>
          </div>
        </div>
        <div style={{ position: "absolute", right: 140, bottom: 108, opacity: prog(t, tUS, 0.5) * 0.9 }}>
          <Body size={18} color={C.ink3}>
            Indicative sizing, investor deck Nov 2026
          </Body>
        </div>
      </Scene>
    </Burst>
  );
};

/* ---------- competition ---------- */
const TENTS = [
  { x: 560, label: "Calls & chat", who: "Astrotalk · InstaAstro · Astroyogi", col: "rgba(234,88,12,0.10)", ring: "rgba(234,88,12,0.35)" },
  { x: 960, label: "Puja booking", who: "Sri Mandir · Vama", col: "rgba(212,169,74,0.13)", ring: "rgba(212,169,74,0.5)" },
  { x: 1360, label: "Horoscope apps", who: "Co-Star · The Pattern · Nebula", col: "rgba(124,58,237,0.08)", ring: "rgba(124,58,237,0.3)" },
];

export const CompeteScene: React.FC = () => {
  const t = useWinT();
  const [a, b] = SCENES.compete;
  const s12 = line("s12");
  const tPieces = word("s12", "we") - 0.1;
  const thread = prog(t, tPieces, 1.4, easeInOut);
  const yC = 600;
  const R = 175;
  const yT = yC + 112;
  const fy = (x: number) => yT + 36 * Math.sin(((x - 240) / 1450) * Math.PI * 3.5);
  const d = "M" + Array.from({ length: 121 }, (_, k) => { const x = 240 + (1450 * k) / 120; return `${x.toFixed(1)} ${fy(x).toFixed(1)}`; }).join(" L");
  const ox = lerp(240, 1690, thread);
  const oy = fy(ox);
  return (
    <Scene a={a} b={b}>
      <Paper />
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center" }}>
        <In t0={a + 0.2}>
          <Label style={{ justifyContent: "center" }}>Competition</Label>
        </In>
        <In t0={s12.start} dur={0.9} style={{ marginTop: 22 }}>
          <Headline size={72}>
            Others own one piece. <Accent>We connect the pieces.</Accent>
          </Headline>
        </In>
      </div>
      {TENTS.map((tn, i) => {
        const t0 = word("s12", ["calls", "pujas", "horoscopes"][i]) - 0.2;
        const lit = prog(t, tPieces + 0.25 + i * 0.35, 0.5);
        return (
          <div key={tn.label} style={{ position: "absolute", left: tn.x - R, top: yC - R }}>
            <In t0={t0} dur={0.7} s0={0.85}>
              <div
                style={{
                  width: R * 2,
                  height: R * 2,
                  borderRadius: "50%",
                  background: tn.col,
                  border: `2px solid ${tn.ring}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: lit > 0 ? `0 0 ${50 * lit}px rgba(245,158,11,${0.35 * lit})` : undefined,
                }}
              >
                <div style={{ fontFamily: MARCELLUS, fontSize: 38, color: C.ink }}>{tn.label}</div>
                <div style={{ fontFamily: KARLA, fontSize: 20, color: C.ink2, marginTop: 10, textAlign: "center", maxWidth: 260 }}>{tn.who}</div>
              </div>
            </In>
          </div>
        );
      })}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <Draw d={d} p={thread} stroke="rgba(234,88,12,0.75)" width={3} />
      </svg>
      {thread > 0 && thread < 1 && (
        <div style={{ position: "absolute", left: ox - 28, top: oy - 28 }}>
          <Orb size={56} t={t} glow={0.6} />
        </div>
      )}
      {thread >= 1 && (
        <div style={{ position: "absolute", left: 1690 - 34, top: fy(1690) - 34 }}>
          <Orb size={68} t={t} glow={0.6} />
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: yC + R + 70, display: "flex", justifyContent: "center" }}>
        <In t0={tPieces + 1.2} dy={14}>
          <Pill dark size={25} icon={<Icon name="spark" size={24} color="#FDBA74" />}>
            AstroRaaga: guidance, experts and follow-up in one continuing journey
          </Pill>
        </In>
      </div>
    </Scene>
  );
};

/* ---------- go to market ---------- */
const CHANNELS = [
  { k: "Content engine", sub: "Instagram · YouTube", icon: "play", w: "content" },
  { k: "Temples & astrologers", sub: "Trusted supply", icon: "temple", w: "temple" },
  { k: "Creator network", sub: "Real stories", icon: "users", w: "creators" },
  { k: "Referrals", sub: "Users as advocates", icon: "gift", w: "referrals" },
  { k: "NRI diaspora", sub: "US · UK · Gulf", icon: "globe", w: "diaspora" },
];

export const GtmScene: React.FC = () => {
  const t = useWinT();
  const [a, b] = SCENES.gtm;
  const s13 = line("s13");
  const xs = [300, 630, 960, 1290, 1620];
  const rootY = 400;
  const leafY = 640;
  return (
    <Scene a={a} b={b}>
      <Paper />
      <div style={{ position: "absolute", left: 140, top: 120 }}>
        <In t0={a + 0.2}>
          <Label>Go-to-market</Label>
        </In>
        <In t0={s13.start} dur={0.9} style={{ marginTop: 22 }}>
          <Headline size={68}>
            Distribution <Accent>before</Accent> paid traffic.
          </Headline>
        </In>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {xs.map((x, i) => (
          <Draw
            key={x}
            d={`M960 ${rootY + 34} C960 ${rootY + 130}, ${x} ${leafY - 140}, ${x} ${leafY - 46}`}
            p={prog(t, word("s13", CHANNELS[i].w) - 0.45, 0.6, easeInOut)}
            stroke="rgba(44,24,16,0.22)"
            width={2}
          />
        ))}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: rootY - 34, display: "flex", justifyContent: "center" }}>
        <In t0={word("s13", "distribution") - 0.1} dy={12} s0={0.9}>
          <Pill dark size={27} icon={<Icon name="growth" size={26} color="#FDBA74" />}>
            Owned distribution
          </Pill>
        </In>
      </div>
      {CHANNELS.map((c, i) => (
        <div key={c.k} style={{ position: "absolute", left: xs[i] - 150, top: leafY - 46, width: 300, display: "flex", justifyContent: "center" }}>
          <In t0={word("s13", c.w) - 0.2} dy={16} s0={0.9}>
            <Card style={{ width: 290, padding: "22px 20px", textAlign: "center" }}>
              <div style={{ width: 60, height: 60, margin: "0 auto", borderRadius: 18, background: "rgba(234,88,12,0.09)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={c.icon} size={30} color={C.saffronDeep} />
              </div>
              <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 26, color: C.ink, marginTop: 14 }}>{c.k}</div>
              <div style={{ fontFamily: KARLA, fontSize: 20, color: C.ink2, marginTop: 4 }}>{c.sub}</div>
            </Card>
          </In>
        </div>
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: 880, display: "flex", justifyContent: "center", gap: 14 }}>
        {["CAC", "Activation", "First paid conversion", "D30 retention", "Referral share"].map((k, i) => (
          <In key={k} t0={word("s13", "diaspora") + 0.25 + i * 0.08} dy={8} dur={0.5}>
            <div style={{ padding: "8px 16px", borderRadius: 999, border: `1.5px solid ${C.goldHair}`, fontFamily: KARLA, fontWeight: 600, fontSize: 19, color: C.ink2, background: "rgba(255,255,255,0.6)" }}>
              {k}
            </div>
          </In>
        ))}
      </div>
    </Scene>
  );
};

/* ---------- business model: the giant wheel ---------- */
const CABINS = [
  { k: "Question", s: "JyotiQ tokens", L: "Q", col: C.violet },
  { k: "Consultation", s: "KarmEQ commission", L: "C", col: C.green },
  { k: "Programme", s: "Courses & plans · next", L: "P", col: C.saffron },
  { k: "Community", s: "Membership · next", L: "M", col: C.amber },
  { k: "Repeat", s: "Lifetime value", L: "R", col: C.rust },
];

export const ModelScene: React.FC = () => {
  const t = useWinT();
  const [a, b] = SCENES.model;
  const s14 = line("s14");
  const cx = 1240;
  const cy = 560;
  const R = 300;
  const spin = (t - a) * 0.12 + prog(t, a, 1.2, ease) * 0.6;
  const hi = [word("s14", "pay-per-question"), word("s14", "consultation"), word("s14", "programmes")];
  const draw = prog(t, a + 0.2, 1.2, easeInOut);
  return (
    <Scene a={a} b={b}>
      <Paper />
      <div style={{ position: "absolute", left: 140, top: 150, width: 640 }}>
        <In t0={a + 0.2}>
          <Label>Business model</Label>
        </In>
        <In t0={s14.start} dur={0.9} style={{ marginTop: 22 }}>
          <Headline size={72}>
            One seeker, <Accent>many orders</Accent>.
          </Headline>
        </In>
        <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { k: "Pay-per-question tokens", s: "JyotiQ · live", c: C.violet, t0: hi[0] },
            { k: "Consultation commission", s: "KarmEQ · live", c: C.green, t0: hi[1] },
            { k: "Programmes & memberships", s: "Planned next", c: C.saffron, t0: hi[2] },
          ].map((r) => (
            <In key={r.k} t0={r.t0 - 0.1} dx={-24} dy={0}>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ width: 14, height: 14, borderRadius: 7, background: r.c, boxShadow: `0 0 14px ${r.c}88` }} />
                <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 30, color: C.ink }}>{r.k}</div>
                <div style={{ fontFamily: KARLA, fontSize: 22, color: C.ink3 }}>{r.s}</div>
              </div>
            </In>
          ))}
        </div>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <Draw d={`M${cx - R} ${cy} A${R} ${R} 0 1 1 ${cx + R} ${cy} A${R} ${R} 0 1 1 ${cx - R} ${cy}`} p={draw} stroke="rgba(44,24,16,0.28)" width={2.4} />
        <Draw d={`M${cx - R * 0.72} ${cy} A${R * 0.72} ${R * 0.72} 0 1 1 ${cx + R * 0.72} ${cy} A${R * 0.72} ${R * 0.72} 0 1 1 ${cx - R * 0.72} ${cy}`} p={draw} stroke="rgba(212,169,74,0.45)" width={1.6} />
        {Array.from({ length: 10 }).map((_, i) => {
          const an = spin + (i / 10) * Math.PI * 2;
          return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(an) * R} y2={cy + Math.sin(an) * R} stroke="rgba(44,24,16,0.12)" strokeWidth={1.4} opacity={draw} />;
        })}
        {/* stand */}
        <Draw d={`M${cx} ${cy} L${cx - 170} ${cy + R + 130} M${cx} ${cy} L${cx + 170} ${cy + R + 130} M${cx - 230} ${cy + R + 130} H${cx + 230}`} p={draw} stroke="rgba(44,24,16,0.3)" width={2.2} />
      </svg>
      <div style={{ position: "absolute", left: cx - 80, top: cy - 80, width: 160, height: 160, borderRadius: 80, display: "flex", alignItems: "center", justifyContent: "center", opacity: draw }}>
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
        const glow = i < 3 ? prog(t, hi[i] - 0.05, 0.3) * (1 - prog(t, (hi[i + 1] ?? b) - 0.1, 0.5) * 0.6) : 0;
        return (
          <div key={c.k} style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -20%)" }}>
            <In t0={a + 0.5 + i * 0.12} dur={0.6} s0={0.6} dy={0}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 20px 12px 12px",
                  borderRadius: 20,
                  background: C.card,
                  border: `1.5px solid ${glow > 0 ? c.col : C.goldHair}`,
                  boxShadow: glow > 0 ? `0 0 ${36 * glow}px ${c.col}66, 0 14px 30px rgba(124,45,18,0.1)` : "0 14px 30px rgba(124,45,18,0.1)",
                  transform: `scale(${1 + 0.08 * glow})`,
                  whiteSpace: "nowrap",
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 13, background: c.col, color: "#fff", fontFamily: MARCELLUS, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.L}</div>
                <div>
                  <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 23, color: C.ink }}>{c.k}</div>
                  <div style={{ fontFamily: KARLA, fontSize: 17, color: C.ink3 }}>{c.s}</div>
                </div>
              </div>
            </In>
          </div>
        );
      })}
    </Scene>
  );
};

export const _b = [AbsoluteFill];
