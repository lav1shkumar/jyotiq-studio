import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { C, clamp01, ease, easeInOut, KARLA, lerp, line, MARCELLUS, prog, rnd, SCENES, word } from "../theme";
import { Accent, Body, Burst, Card, Count, Draw, Headline, Icon, In, Label, Orb, Paper, Scene, useWinT } from "../ui";
import { openPlanetXY } from "./Open";

/* ---------- the mela gate (line art) ---------- */
const bunting = (i: number, n: number) => {
  // point on the quadratic M110 300 Q350 380 590 300
  const u = (i + 0.5) / n;
  const x = (1 - u) * (1 - u) * 110 + 2 * (1 - u) * u * 350 + u * u * 590;
  const y = (1 - u) * (1 - u) * 300 + 2 * (1 - u) * u * 380 + u * u * 300;
  return [x, y];
};

const Gate: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const d = (k: number, dur = 0.9) => prog(t, t0 + k, dur, easeInOut);
  const ink = "rgba(44,24,16,0.55)";
  const flags = 13;
  return (
    <svg width={700} height={640} viewBox="0 0 700 640" style={{ overflow: "visible" }}>
      <Draw d="M30 600 H670" p={d(0)} stroke={ink} width={2} />
      {/* pillars */}
      <Draw d="M110 600 V230 H180 V600" p={d(0.1)} stroke={ink} width={2.2} />
      <Draw d="M520 600 V230 H590 V600" p={d(0.15)} stroke={ink} width={2.2} />
      <Draw d="M96 230 H194 V205 H96 Z" p={d(0.3, 0.6)} stroke={ink} width={2} />
      <Draw d="M506 230 H604 V205 H506 Z" p={d(0.32, 0.6)} stroke={ink} width={2} />
      <Draw d="M96 600 V586 H194 V600 M506 600 V586 H604 V600" p={d(0.2, 0.6)} stroke={ink} width={2} />
      <Draw d="M128 260 V560 M162 260 V560 M538 260 V560 M572 260 V560" p={d(0.45, 0.8)} stroke="rgba(44,24,16,0.22)" width={1.5} />
      {/* arches */}
      <Draw d="M145 205 C145 40, 555 40, 555 205" p={d(0.45, 1.0)} stroke={ink} width={2.4} />
      <Draw d="M180 232 C180 100, 520 100, 520 232" p={d(0.6, 1.0)} stroke="rgba(44,24,16,0.35)" width={1.8} />
      {/* finial */}
      <Draw d="M318 78 Q350 22 382 78 Z M350 22 V4 M343 10 H357" p={d(0.9, 0.7)} stroke={ink} width={2} />
      {/* bunting */}
      <Draw d="M110 300 Q350 380 590 300" p={d(0.8, 0.9)} stroke="rgba(44,24,16,0.4)" width={1.6} />
      {Array.from({ length: flags }).map((_, i) => {
        const [x, y] = bunting(i, flags);
        const p = prog(t, t0 + 1.0 + i * 0.05, 0.5, ease);
        const col = [C.saffron, C.green, C.amber][i % 3];
        return <path key={i} d={`M${x - 12} ${y} L${x + 12} ${y} L${x} ${y + 26 * p} Z`} fill={col} opacity={0.85 * p} />;
      })}
      {/* bells */}
      {[230, 350, 470].map((x, i) => {
        const p = prog(t, t0 + 1.25 + i * 0.1, 0.6);
        const sw = Math.sin(t * 2.4 + i) * 3 * p;
        return (
          <g key={x} opacity={p} transform={`rotate(${sw} ${x} 128)`}>
            <line x1={x} y1={i === 1 ? 64 : 104} x2={x} y2={150} stroke="rgba(44,24,16,0.4)" strokeWidth={1.4} />
            <path d={`M${x - 11} 166 Q${x - 11} 148 ${x} 148 Q${x + 11} 148 ${x + 11} 166 Z`} fill={C.gold} />
          </g>
        );
      })}
      {/* lamps on the pillars */}
      {[145, 555].map((x, i) => {
        const p = prog(t, t0 + 1.4 + i * 0.1, 0.7);
        const fl = 1 + 0.08 * Math.sin(t * 9 + i * 2);
        return (
          <g key={x} opacity={p}>
            <circle cx={x} cy={186} r={26 * fl} fill="rgba(245,158,11,0.18)" />
            <path d={`M${x} ${172 - 6 * fl} Q${x + 8} 186 ${x} 192 Q${x - 8} 186 ${x} ${172 - 6 * fl} Z`} fill={C.saffron} />
          </g>
        );
      })}
    </svg>
  );
};

export const GateScene: React.FC = () => {
  const t = useWinT();
  const [a, b] = SCENES.gate;
  const s3 = line("s03");
  const { x, y } = openPlanetXY(a);
  return (
    <Burst x={x} y={y} t0={a - 0.15} dur={1.0}>
      <Scene a={a} b={b} noIn outDur={0.45}>
        <Paper />
        <div style={{ position: "absolute", left: 170, top: 330 }}>
          <In t0={a + 0.35}>
            <Label>The guidance market today</Label>
          </In>
          <In t0={s3.start + 0.25} dur={0.9} style={{ marginTop: 36 }}>
            <Headline size={124}>
              A giant <Accent>mela</Accent>.
            </Headline>
          </In>
          <In t0={word("s03", "works") - 0.1} dur={0.9} style={{ marginTop: 30 }}>
            <Body size={32} style={{ maxWidth: 640 }}>
              Millions of seekers. Thousands of advisors. Every stall on its own.
            </Body>
          </In>
        </div>
        <div style={{ position: "absolute", left: 1010, top: 250, transform: `scale(${lerp(0.96, 1.04, prog(t, a, b - a, easeInOut))})`, transformOrigin: "350px 400px" }}>
          <Gate t={t} t0={a + 0.4} />
          {/* the planet, now an orb, rests in the arch */}
          <div style={{ position: "absolute", left: 350 - 46, top: 150 - 46 + 12 * Math.sin(t * 1.4) }}>
            <In t0={a + 0.1} dur={0.8} s0={0.4} dy={-30}>
              <Orb size={92} t={t} />
            </In>
          </div>
        </div>
      </Scene>
    </Burst>
  );
};

/* ---------- the problem: scattered stalls ---------- */
const Tent: React.FC<{ s?: number; flag?: string; lit?: number }> = ({ s = 1, flag = C.saffron, lit = 0 }) => (
  <svg width={64 * s} height={64 * s} viewBox="0 0 64 64" style={{ overflow: "visible" }}>
    {lit > 0 && <circle cx={32} cy={36} r={30} fill={`rgba(245,158,11,${0.22 * lit})`} />}
    <path d="M30 8 V-2 L39 1.5 L30 5" fill={flag} stroke="none" />
    <path d="M6 28 L32 8 L58 28 Z" fill="#FFFDF8" stroke="rgba(44,24,16,0.55)" strokeWidth={1.6} strokeLinejoin="round" />
    <path d="M6 28 Q12.5 34 19 28 Q25.5 34 32 28 Q38.5 34 45 28 Q51.5 34 58 28" fill="none" stroke="rgba(44,24,16,0.45)" strokeWidth={1.4} />
    <path d="M11 31 V56 H53 V31" fill="#FFFDF8" stroke="rgba(44,24,16,0.5)" strokeWidth={1.6} />
    <path d="M27 56 V42 Q32 37 37 42 V56" fill="rgba(234,88,12,0.12)" stroke="rgba(44,24,16,0.45)" strokeWidth={1.4} />
  </svg>
);

export const STALLS: [number, number][] = [
  [200, 470], [420, 400], [640, 455], [860, 395], [300, 640], [530, 600], [750, 650], [960, 590], [180, 820], [420, 800], [660, 840], [900, 790],
];
const ANSWERS = [
  { i: 1, text: "Marriage in 2027", col: C.saffron },
  { i: 3, text: "Not before 2029", col: C.violet },
  { i: 5, text: "Wear a ruby", col: C.green },
  { i: 7, text: "Book a puja first", col: C.rust },
];

const Pain: React.FC<{ t0: number; icon: string; title: string; sub: string; t: number; tone?: string }> = ({ t0, icon, title, sub, t, tone = C.red }) => {
  const on = prog(t, t0 + 0.25, 0.4);
  return (
    <In t0={t0} dur={0.65} dx={40} dy={0}>
      <Card style={{ width: 620, padding: "24px 28px", display: "flex", alignItems: "center", gap: 22, marginBottom: 18 }}>
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 18,
            background: `rgba(185,28,28,${0.06 + 0.04 * on})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: tone,
          }}
        >
          <Icon name={icon} size={30} color={tone} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 29, color: C.ink }}>{title}</div>
          <div style={{ fontFamily: KARLA, fontSize: 22, color: C.ink2, marginTop: 4 }}>{sub}</div>
        </div>
        {/* toggle, ElevenLabs-guardrail style, stuck "off" */}
        <div style={{ width: 54, height: 30, borderRadius: 15, background: "rgba(44,24,16,0.12)", position: "relative" }}>
          <div style={{ position: "absolute", top: 4, left: 4 + 2 * on, width: 22, height: 22, borderRadius: 11, background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }} />
        </div>
      </Card>
    </In>
  );
};

export const ProblemScene: React.FC = () => {
  const t = useWinT();
  const [a, b] = SCENES.problem;
  const tThousand = word("s04", "thousands");
  const tDiff = word("s04", "different");
  const tPrice = word("s04", "prices");
  const tNothing = word("s04", "nothing");
  const tTrust = word("s04", "seekers");
  const forget = prog(t, tNothing + 0.1, 0.6);
  return (
    <Scene a={a} b={b}>
      <Paper />
      <div style={{ position: "absolute", left: 140, top: 120 }}>
        <In t0={a + 0.2}>
          <Label>The problem</Label>
        </In>
        <In t0={a + 0.35} dur={0.8} style={{ marginTop: 24 }}>
          <Headline size={68}>
            A different answer <Accent>at every stall</Accent>.
          </Headline>
        </In>
      </div>
      {/* thousands: a faint field of tiny stalls */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 260 }).map((_, i) => {
          const x = 110 + rnd(i) * 1000;
          const y = 330 + rnd(i + 900) * 660;
          const p = prog(t, tThousand + rnd(i + 50) * 0.9, 0.5);
          return <circle key={i} cx={x} cy={y} r={2.2} fill={C.ink} opacity={0.12 * p} />;
        })}
      </svg>
      {STALLS.map(([x, y], i) => (
        <div key={i} style={{ position: "absolute", left: x - 32, top: y - 32 }}>
          <In t0={tThousand - 0.15 + i * 0.045} dur={0.55} s0={0.5} dy={14}>
            <Tent flag={[C.saffron, C.green, C.amber, C.violet][i % 4]} />
          </In>
        </div>
      ))}
      {ANSWERS.map((an, k) => {
        const [x, y] = STALLS[an.i];
        return (
          <div key={an.i} style={{ position: "absolute", left: x - 20, top: y - 104 }}>
            <In t0={tDiff - 0.2 + k * 0.22} t1={tNothing + 0.15} dur={0.5} s0={0.7} dy={10}>
              <div
                style={{
                  padding: "10px 18px",
                  borderRadius: 16,
                  borderBottomLeftRadius: 4,
                  background: "#fff",
                  border: `1.5px solid ${an.col}55`,
                  boxShadow: "0 10px 26px rgba(124,45,18,0.12)",
                  fontFamily: KARLA,
                  fontWeight: 600,
                  fontSize: 22,
                  color: an.col,
                  whiteSpace: "nowrap",
                }}
              >
                {an.text}
              </div>
            </In>
          </div>
        );
      })}
      {/* history resets: little "0 sessions" tag at a stall */}
      <div style={{ position: "absolute", left: 470, top: 690, opacity: forget * (1 - prog(t, b - 0.8, 0.4)) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: KARLA, fontWeight: 600, fontSize: 20, color: C.ink2 }}>
          <Icon name="reset" size={20} color={C.ink2} /> History: 0 sessions
        </div>
      </div>
      <div style={{ position: "absolute", left: 1170, top: 330 }}>
        <Pain t={t} t0={tDiff - 0.1} icon="alert" title="Generic predictions" sub="The same template for everyone" />
        <Pain t={t} t0={tPrice - 0.1} icon="tag" title="Unclear pricing" sub="Opaque per-minute rates" />
        <Pain t={t} t0={tNothing - 0.1} icon="reset" title="No continuity" sub="Every chat starts from zero" />
        <Pain t={t} t0={tTrust - 0.15} icon="question" title="Unverified experts" sub="No way to know whom to trust" />
      </div>
    </Scene>
  );
};

/* ---------- scale, scatter, then one journey ---------- */
// centre: the market the five leaders share (combined revenue); around it the five leaders named in the
// investor deck (slide 8), Astrotalk the largest of them
const BUBBLES = [
  { x: 1250, y: 560, r: 235, c: ["#F59E0B", "#EA580C"], name: "" },
  { x: 850, y: 330, r: 110, c: ["#FB923C", "#C2410C"], name: "Astrotalk" },
  { x: 1660, y: 270, r: 84, c: ["#FDBA74", "#F97316"], name: "InstaAstro" },
  { x: 820, y: 770, r: 74, c: ["#FCD34D", "#F59E0B"], name: "Astroyogi" },
  { x: 1580, y: 860, r: 70, c: ["#FDBA74", "#C2410C"], name: "Sri Mandir" },
  { x: 1800, y: 590, r: 56, c: ["#FDE68A", "#D97706"], name: "Vama" },
];
// where the bubbles scatter to (and become stalls on the path)
const NODES: [number, number][] = [
  [260, 300], [520, 760], [780, 260], [1080, 820], [1400, 300], [1660, 740], [360, 900], [1560, 960], [200, 600], [1760, 470],
];
const PATH_ORDER = [8, 0, 1, 2, 3, 4, 5, 9];

export const ScaleScene: React.FC = () => {
  const t = useWinT();
  const [a, b] = SCENES.scale;
  const tNum = word("s05", "sixteen");
  const tFive = word("s05", "five");
  const tScatter = word("s05", "scattered") - 0.35;
  const s6 = line("s06");
  const scatter = prog(t, tScatter, 1.4, easeInOut);
  const join = prog(t, s6.start - 0.1, 1.8, easeInOut);
  const orbIn = prog(t, s6.start + 0.9, 1.0);
  const numOut = prog(t, tScatter, 0.5);
  // path through the scattered stalls toward the centre orb
  const pts = PATH_ORDER.map((i) => NODES[i]);
  let dPath = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    dPath += ` C${x0 + (x1 - x0) * 0.5} ${y0}, ${x0 + (x1 - x0) * 0.5} ${y1}, ${x1} ${y1}`;
  }
  const spokes = NODES.map(([x, y]) => `M${x} ${y} Q${(x + 960) / 2} ${y < 540 ? y + 120 : y - 120} 960 540`);
  return (
    <Scene a={a} b={b} outDur={0.3}>
      <Paper />
      <div style={{ position: "absolute", left: 140, top: 120 }}>
        <In t0={a + 0.2} t1={s6.start - 0.35}>
          <Label>The market is real</Label>
        </In>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: 24 }}>
            <In t0={tScatter + 0.25} t1={s6.start - 0.35} dur={0.8}>
              <Headline size={68} style={{ whiteSpace: "nowrap" }}>
                Still <Accent>scattered</Accent>.
              </Headline>
            </In>
          </div>
          <div style={{ position: "absolute", top: -40 }}>
            <In t0={s6.start - 0.1} dur={0.8}>
              <Label>The solution</Label>
            </In>
          </div>
          <div style={{ position: "absolute", top: 24 }}>
            <In t0={s6.start + 0.05} dur={0.9}>
              <Headline size={68} style={{ whiteSpace: "nowrap" }}>
                One <Accent>journey</Accent>.
              </Headline>
            </In>
          </div>
        </div>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {/* threads between bubbles that break when scattering */}
        {BUBBLES.slice(1).map((bb, i) => {
          // from edge to edge, so the thread never shows through the (slightly see-through) circles
          const x0 = lerp(BUBBLES[0].x, NODES[0][0], scatter);
          const y0 = lerp(BUBBLES[0].y, NODES[0][1], scatter);
          const r0 = lerp(BUBBLES[0].r, 16, scatter);
          const x1 = lerp(bb.x, NODES[i + 1][0], scatter);
          const y1 = lerp(bb.y, NODES[i + 1][1], scatter);
          const r1 = lerp(bb.r, 16, scatter);
          const L = Math.hypot(x1 - x0, y1 - y0) || 1;
          const ux = (x1 - x0) / L;
          const uy = (y1 - y0) / L;
          return (
            <line
              key={i}
              x1={x0 + ux * r0}
              y1={y0 + uy * r0}
              x2={x1 - ux * r1}
              y2={y1 - uy * r1}
              stroke={C.hair}
              strokeWidth={1.6}
              strokeDasharray={scatter > 0.05 ? "6 10" : undefined}
              opacity={prog(t, a + 0.6, 0.6) * (1 - scatter)}
            />
          );
        })}
        {/* the joining path: string lights */}
        <Draw d={dPath} p={join} stroke="rgba(234,88,12,0.55)" width={2.4} />
        {spokes.map((d, i) => (
          <Draw key={i} d={d} p={prog(t, s6.start + 0.5 + i * 0.05, 1.0, easeInOut)} stroke="rgba(212,169,74,0.55)" width={1.6} />
        ))}
        {/* bulbs along the path */}
        {Array.from({ length: 40 }).map((_, i) => {
          const u = i / 39;
          if (join <= 0 || u > join) return null;
          const seg = Math.min(pts.length - 2, Math.floor(u * (pts.length - 1)));
          const f = u * (pts.length - 1) - seg;
          const [x0, y0] = pts[seg];
          const [x1, y1] = pts[seg + 1];
          // cubic with the same handles as the path
          const cx = (1 - f) ** 3 * x0 + 3 * (1 - f) ** 2 * f * (x0 + (x1 - x0) * 0.5) + 3 * (1 - f) * f * f * (x0 + (x1 - x0) * 0.5) + f ** 3 * x1;
          const cy = (1 - f) ** 3 * y0 + 3 * (1 - f) ** 2 * f * y0 + 3 * (1 - f) * f * f * y1 + f ** 3 * y1;
          const tw = 0.6 + 0.4 * Math.sin(t * 6 + i);
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={10} fill={`rgba(245,158,11,${0.18 * tw})`} />
              <circle cx={cx} cy={cy} r={3.6} fill={C.amber} />
            </g>
          );
        })}
      </svg>
      {/* bubbles that become stalls */}
      {BUBBLES.map((bb, i) => {
        const node = NODES[i];
        const x = lerp(bb.x, node[0], scatter);
        const y = lerp(bb.y, node[1], scatter);
        const r = lerp(bb.r, 16, scatter);
        const p = prog(t, a + 0.25 + i * 0.12, 0.8);
        const lit = prog(t, s6.start + 0.3 + i * 0.12, 0.6);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - r,
              top: y - r,
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              transform: `scale(${p})`,
              background: `radial-gradient(circle at 35% 30%, ${bb.c[0]}, ${bb.c[1]})`,
              opacity: lerp(i === 0 ? 0.95 : 0.85, 0.55 + 0.45 * lit, scatter),
              boxShadow: `0 20px 50px rgba(234,88,12,${0.18 + 0.3 * lit})`,
            }}
          />
        );
      })}
      {/* the players' names (on "five biggest players") */}
      {BUBBLES.slice(1).map((bb, i) => {
        const t0 = tFive - 0.1 + i * 0.16;
        const p = prog(t, t0, 0.55) * (1 - prog(t, tScatter - 0.05, 0.4));
        if (p <= 0) return null;
        return (
          <div
            key={bb.name}
            style={{
              position: "absolute",
              left: bb.x,
              top: bb.y + bb.r + 16,
              transform: `translate(-50%, 0) translateY(${(1 - p) * 10}px)`,
              opacity: p,
              whiteSpace: "nowrap",
            }}
          >
            <div
              style={{
                padding: i === 0 ? "9px 22px" : "8px 18px",
                borderRadius: 999,
                background: "rgba(255,253,248,0.92)",
                border: `1.5px solid ${C.goldHair}`,
                boxShadow: "0 10px 24px rgba(124,45,18,0.08)",
                fontFamily: KARLA,
                fontWeight: 700,
                fontSize: i === 0 ? 28 : 25,
                color: C.ink,
              }}
            >
              {bb.name}
            </div>
          </div>
        );
      })}
      {/* the combined number, inside the big circle */}
      <div
        style={{
          position: "absolute",
          left: BUBBLES[0].x,
          top: BUBBLES[0].y,
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          whiteSpace: "nowrap",
          opacity: prog(t, tNum - 0.3, 0.5) * (1 - numOut),
          filter: numOut > 0 ? `blur(${numOut * 8}px)` : undefined,
        }}
      >
        <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 19, letterSpacing: "0.2em", color: "rgba(255,248,238,0.86)", marginBottom: 10 }}>TOP 5 COMBINED</div>
        <div style={{ fontFamily: MARCELLUS, fontSize: 82, color: "#FFF8EE", lineHeight: 1, textShadow: "0 4px 22px rgba(124,45,18,0.35)" }}>
          <Count to={1637} t={t} t0={tNum - 0.2} dur={1.4} prefix="₹" suffix=" Cr" />
        </div>
        <div style={{ fontFamily: KARLA, fontWeight: 600, fontSize: 24, color: "rgba(255,248,238,0.9)", marginTop: 12 }}>a year</div>
      </div>
      {/* extra stall nodes appear on scatter */}
      {NODES.slice(BUBBLES.length).map(([x, y], i) => {
        const p = prog(t, tScatter + 0.4 + i * 0.08, 0.6);
        const lit = prog(t, s6.start + 0.5 + i * 0.1, 0.6);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 14,
              top: y - 14,
              width: 28,
              height: 28,
              borderRadius: 14,
              transform: `scale(${p})`,
              background: lit > 0 ? `radial-gradient(circle at 35% 30%, #FCD34D, #EA580C)` : "#E7DCCB",
              opacity: 0.6 + 0.4 * lit,
              boxShadow: lit > 0 ? `0 0 24px rgba(245,158,11,${0.5 * lit})` : undefined,
            }}
          />
        );
      })}
      {/* left: what the number is */}
      <div
        style={{
          position: "absolute",
          left: 140,
          top: 340,
          opacity: prog(t, tFive - 0.2, 0.6) * (1 - numOut),
          transform: `translateY(${(1 - prog(t, tFive - 0.2, 0.6)) * 16}px)`,
          filter: numOut > 0 ? `blur(${numOut * 8}px)` : undefined,
        }}
      >
        <Headline size={60} style={{ lineHeight: 1.12 }}>
          Earned in a year
          <br />
          by the five
          <br />
          <Accent>biggest players</Accent>.
        </Headline>
        <div style={{ fontFamily: KARLA, fontSize: 19, color: C.ink3, marginTop: 26 }}>Combined annual revenue · FY25–26</div>
      </div>
      {/* centre orb: the journey's destination */}
      <div style={{ position: "absolute", left: 960 - 90, top: 540 - 90, transform: `scale(${orbIn})`, opacity: orbIn }}>
        <Orb size={180} t={t} glow={0.6} />
      </div>
    </Scene>
  );
};

export const _unused = [clamp01, interpolate, AbsoluteFill];
