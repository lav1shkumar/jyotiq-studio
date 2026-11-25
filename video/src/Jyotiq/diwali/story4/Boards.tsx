import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadMono } from "@remotion/google-fonts/SpaceMono";
import { loadFont as loadMukta } from "@remotion/google-fonts/Mukta";

/* Day 4 storyboard: one key frame per video frame, in the reference's collage-diorama language.
   Render with --public-dir=../diwali-story-d4/public. */

const OSW = loadOswald("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily;
const MONO = loadMono("normal", { weights: ["400", "700"], subsets: ["latin"] }).fontFamily;
const MUKTA = loadMukta("normal", { weights: ["700", "800"], subsets: ["devanagari", "latin"] }).fontFamily;

const CREAM = "#F6EBD6";
const RED = "#FF5B3A";
const INK = "#16130F";
const PAPER = "#EFE3C8";

const Bg: React.FC<{ src: string; scale?: number; x?: number; y?: number; dim?: number; blur?: number }> = ({ src, scale = 1, x = 0, y = 0, dim = 0, blur = 0 }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <Img src={staticFile(`img/${src}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translate(${x}px,${y}px) scale(${scale})`, filter: blur ? `blur(${blur}px)` : undefined }} />
    {/* sky shade behind the headline, as in the reference */}
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(14,18,40,0.78) 0%, rgba(14,18,40,0.35) 16%, rgba(0,0,0,0) 28%)" }} />
    {dim ? <AbsoluteFill style={{ background: `rgba(8,8,14,${dim})` }} /> : null}
  </AbsoluteFill>
);

/* faint layout guides the reference keeps on screen */
const Guides: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {[360, 720].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.07)" }} />)}
    <div style={{ position: "absolute", left: 0, right: 0, top: 108, height: 1, background: "rgba(255,255,255,0.10)" }} />
  </AbsoluteFill>
);

const TopStrip: React.FC<{ scene: string; fig: number }> = ({ scene, fig }) => (
  <>
    <div style={{ position: "absolute", left: 40, top: 70, fontFamily: MONO, fontSize: 21, letterSpacing: 2, color: "rgba(246,235,214,0.75)" }}>{scene}</div>
    <div style={{ position: "absolute", right: 40, top: 112, fontFamily: MONO, fontSize: 19, letterSpacing: 2, color: "rgba(246,235,214,0.7)" }}>FIG. {fig}</div>
    {/* torn-paper series tag, carries the brand */}
    <div style={{
      position: "absolute", right: 34, top: 44, padding: "10px 18px 12px", background: PAPER, color: INK, fontFamily: MONO, fontWeight: 700, fontSize: 21, letterSpacing: 1.5,
      clipPath: "polygon(0 6%, 8% 0, 22% 5%, 40% 0, 61% 4%, 80% 0, 100% 5%, 98% 50%, 100% 95%, 84% 100%, 63% 95%, 41% 100%, 20% 95%, 4% 100%, 1% 52%)",
      boxShadow: "0 4px 10px rgba(0,0,0,0.35)", display: "flex", alignItems: "center", gap: 10,
    }}>
      <Img src={staticFile("jyotiq/logo-icon.png")} style={{ height: 26 }} />JYOTIQ · DIWALI · DAY 4/5
    </div>
  </>
);

const Headline: React.FC<{ a: string; b?: string; bColor?: string; size?: number }> = ({ a, b, bColor = RED, size = 104 }) => (
  <div style={{ position: "absolute", left: 40, top: 150, right: 40, fontFamily: OSW, fontWeight: 700, fontSize: size, lineHeight: 1.0, textTransform: "uppercase", textShadow: "0 4px 0 rgba(0,0,0,0.35), 0 0 30px rgba(0,0,0,0.35)" }}>
    <div style={{ color: CREAM }}>{a}</div>
    {b ? <div style={{ color: bColor }}>{b}</div> : null}
  </div>
);

/* black chip label with a thin leader line to the thing it names */
const Label: React.FC<{ x: number; y: number; text: string; tx?: number; ty?: number; color?: string }> = ({ x, y, text, tx, ty, color = INK }) => (
  <>
    {tx !== undefined && ty !== undefined ? (
      <svg style={{ position: "absolute", left: 0, top: 0 }} width={1080} height={1920}>
        <line x1={x} y1={y} x2={tx} y2={ty} stroke={CREAM} strokeWidth={3} />
        <circle cx={tx} cy={ty} r={7} fill={CREAM} />
      </svg>
    ) : null}
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", background: color, color: CREAM, fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 1.5, padding: "8px 14px", whiteSpace: "nowrap", boxShadow: "0 4px 10px rgba(0,0,0,0.4)" }}>{text}</div>
  </>
);

const Ring: React.FC<{ x: number; y: number; rx: number; ry: number }> = ({ x, y, rx, ry }) => (
  <svg style={{ position: "absolute", left: 0, top: 0 }} width={1080} height={1920}>
    <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="none" stroke={RED} strokeWidth={7} transform={`rotate(-8 ${x} ${y})`} />
  </svg>
);

const Reticle: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 70 }) => (
  <svg style={{ position: "absolute", left: 0, top: 0 }} width={1080} height={1920}>
    <circle cx={x} cy={y} r={r} fill="none" stroke={RED} strokeWidth={5} />
    <circle cx={x} cy={y} r={r * 0.45} fill="none" stroke={RED} strokeWidth={3} />
    {[[0, -1], [0, 1], [-1, 0], [1, 0]].map(([dx, dy], i) => (
      <line key={i} x1={x + dx * r * 0.75} y1={y + dy * r * 0.75} x2={x + dx * r * 1.35} y2={y + dy * r * 1.35} stroke={RED} strokeWidth={5} />
    ))}
  </svg>
);

const Note: React.FC<{ x: number; y: number; text: string; rot?: number; size?: number }> = ({ x, y, text, rot = -3, size = 40 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg)`, background: PAPER, color: INK, fontFamily: OSW, fontWeight: 700, fontSize: size, padding: "10px 26px", textTransform: "uppercase", boxShadow: "0 8px 18px rgba(0,0,0,0.45)", whiteSpace: "nowrap" }}>{text}</div>
);

/* November 2026 wall calendar: 1 Nov is a Sunday */
const Calendar: React.FC<{ x: number; y: number; w?: number; ticks: number[]; ring: number; ringNote?: string }> = ({ x, y, w = 760, ticks, ring, ringNote }) => {
  const cell = w / 7;
  const cells = Array.from({ length: 30 }, (_, i) => i + 1);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, background: "#F4ECDD", boxShadow: "0 18px 40px rgba(0,0,0,0.5)", transform: "rotate(-2deg)" }}>
      <div style={{ background: "#C7352A", color: CREAM, fontFamily: OSW, fontWeight: 700, fontSize: 74, padding: "14px 30px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span>NOVEMBER</span><span style={{ fontSize: 40 }}>2026</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "14px 0 6px", fontFamily: MONO, fontSize: 20, color: "#7a6f60", textAlign: "center" }}>
        {"SMTWTFS".split("").map((d, i) => <div key={i}>{d}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", paddingBottom: 26 }}>
        {cells.map((d) => (
          <div key={d} style={{ height: cell * 0.82, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: OSW, fontWeight: 700, fontSize: 40, color: d === 8 || d === 15 || d === 22 || d === 29 || d === 1 ? "#C7352A" : INK }}>
            {d === ring ? <div style={{ position: "absolute", inset: 6, border: `5px solid ${RED}`, borderRadius: 10, background: "rgba(255,201,77,0.35)" }} /> : null}
            <span style={{ position: "relative" }}>{d}</span>
            {ticks.includes(d) ? <svg style={{ position: "absolute", inset: 0 }} viewBox="0 0 100 100"><path d="M18 52 L42 76 L86 22" stroke={RED} strokeWidth={11} fill="none" strokeLinecap="round" /></svg> : null}
            {d === ring && ringNote ? <div style={{ position: "absolute", bottom: -2, fontFamily: MONO, fontSize: 12, color: INK }}>{ringNote}</div> : null}
          </div>
        ))}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 18, color: "#7a6f60", padding: "0 26px 20px" }}>PANCHANG: NEW DELHI · DRIK</div>
    </div>
  );
};

const Parchment: React.FC<{ x: number; y: number; w: number; children: React.ReactNode; rot?: number }> = ({ x, y, w, children, rot = -2 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, background: "linear-gradient(160deg,#F3E6C6,#E3CFA2)", padding: "30px 40px", boxShadow: "0 18px 40px rgba(0,0,0,0.5)", transform: `rotate(${rot}deg)`, color: INK }}>{children}</div>
);

const Meter: React.FC<{ x: number; y: number; label: string; pct: number }> = ({ x, y, label, pct }) => (
  <div style={{ position: "absolute", left: x, top: y }}>
    <div style={{ fontFamily: MONO, fontSize: 22, color: CREAM, letterSpacing: 2, marginBottom: 10 }}>{label}</div>
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ width: 560, height: 26, border: `3px solid ${CREAM}`, padding: 3 }}><div style={{ width: `${pct}%`, height: "100%", background: pct > 60 ? RED : CREAM }} /></div>
      <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 64, color: pct > 60 ? RED : CREAM }}>{pct}%</div>
    </div>
  </div>
);

/* drawn phone: rises into the scene; stage 0 = installing Jyotiq, 1 = example Gochar screen */
const Phone: React.FC<{ stage: 0 | 1; y?: number }> = ({ stage, y = 820 }) => (
  <div style={{ position: "absolute", left: 540 - 250, top: y, width: 500, height: 1000, borderRadius: 64, background: "#0d0d12", padding: 16, boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 3px #3a3a44 inset", transform: "rotate(-4deg)" }}>
    <div style={{ width: "100%", height: "100%", borderRadius: 50, overflow: "hidden", background: "linear-gradient(180deg,#1b1530,#0f0b1c)", position: "relative" }}>
      <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", width: 120, height: 32, borderRadius: 20, background: "#000" }} />
      {stage === 0 ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 34 }}>
          <div style={{ position: "relative", width: 220, height: 220 }}>
            <svg width={220} height={220} style={{ position: "absolute" }}>
              <circle cx={110} cy={110} r={100} stroke="rgba(255,255,255,0.15)" strokeWidth={10} fill="none" />
              <circle cx={110} cy={110} r={100} stroke="#FFC94D" strokeWidth={10} fill="none" strokeDasharray={`${2 * Math.PI * 100 * 0.72} 999`} transform="rotate(-90 110 110)" strokeLinecap="round" />
            </svg>
            <Img src={staticFile("jyotiq/logo-icon.png")} style={{ position: "absolute", left: 40, top: 50, width: 140 }} />
          </div>
          <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 56, color: CREAM }}>JYOTIQ</div>
          <div style={{ fontFamily: MONO, fontSize: 24, color: "#FFC94D", letterSpacing: 2 }}>INSTALLING… 72%</div>
          <div style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 30, color: "rgba(246,235,214,0.8)" }}>फ़्री · आपकी भाषा में</div>
        </AbsoluteFill>
      ) : (
        <div style={{ padding: "80px 34px 0", color: CREAM }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Img src={staticFile("jyotiq/logo-icon.png")} style={{ height: 44 }} />
            <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 38 }}>गोचर · TODAY</div>
          </div>
          <div style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 28, color: "rgba(246,235,214,0.75)", margin: "16px 0 26px" }}>इस वक़्त आसमान में कौन सा ग्रह कहाँ?</div>
          {[["शनि", "मीन", "#7FA6FF"], ["राहु", "कुंभ", "#B48CFF"], ["केतु", "सिंह", "#FF9A6B"], ["आपका चंद्र", "—", "#FFC94D"]].map(([g, r, c]) => (
            <div key={g} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 22px", marginBottom: 14, borderRadius: 18, background: "rgba(255,255,255,0.07)", border: `2px solid ${c}55` }}>
              <span style={{ fontFamily: MUKTA, fontWeight: 800, fontSize: 38, color: c }}>{g}</span>
              <span style={{ fontFamily: MUKTA, fontWeight: 700, fontSize: 34 }}>{r}</span>
            </div>
          ))}
          <div style={{ marginTop: 24, textAlign: "center", fontFamily: MONO, fontSize: 20, color: "rgba(246,235,214,0.55)", letterSpacing: 2 }}>EXAMPLE SCREEN</div>
        </div>
      )}
    </div>
  </div>
);

const EndBlock: React.FC = () => (
  <div style={{ position: "absolute", left: 60, right: 60, bottom: 280, display: "flex", alignItems: "center", gap: 26, background: "rgba(10,8,20,0.82)", padding: "24px 30px", borderRadius: 24, border: "2px solid rgba(255,201,77,0.5)" }}>
    <Img src={staticFile("jyotiq/logo-icon.png")} style={{ height: 96 }} />
    <div>
      <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 46, color: CREAM }}>JYOTIQ · <span style={{ color: "#FFC94D" }}>GOCHAR FREE</span></div>
      <div style={{ fontFamily: MONO, fontSize: 24, color: "rgba(246,235,214,0.8)" }}>www.jyotiq.ai · app link in bio ↑</div>
      <div style={{ fontFamily: MONO, fontSize: 17, color: "rgba(246,235,214,0.55)", marginTop: 6 }}>Guidance only, for entertainment and information.</div>
    </div>
  </div>
);

const Rain: React.FC<{ n?: number; op?: number }> = ({ n = 140, op = 0.45 }) => (
  <svg style={{ position: "absolute", left: 0, top: 0 }} width={1080} height={1920}>
    {Array.from({ length: n }, (_, i) => {
      const x = (i * 97.3) % 1120 - 20;
      const y = (i * 211.7) % 1920;
      return <line key={i} x1={x} y1={y} x2={x - 14} y2={y + 70} stroke={`rgba(220,230,255,${op})`} strokeWidth={2.4} />;
    })}
  </svg>
);

const PANELS: React.FC[] = [
  // 1 · hook, 0-3 s
  () => (<>
    <Bg src="s01_puja" scale={1.06} y={20} />
    <Headline a="A LITTLE CHILD" b="STOPPED INDRA'S PUJA" />
    <Ring x={565} y={1272} rx={72} ry={88} />
    <Label x={330} y={1720 - 60} text="KRISHNA" tx={640} ty={1380} />
    <Label x={820} y={560} text="INDRA · KING OF GODS" tx={740} ty={470} />
    <Label x={250} y={1170} text="INDRA'S BHOG" tx={420} ty={1440} />
  </>),
  // 2 · series calendar
  () => (<>
    <Bg src="s03_hill" dim={0.35} blur={3} />
    <Headline a="DAY 4 OF 5" b="GOVARDHAN PUJA" />
    <Calendar x={160} y={500} ticks={[6, 7, 8]} ring={10} ringNote="GOVARDHAN" />
    <Note x={540} y={1400} text="WHY 56 DISHES?" />
  </>),
  // 3 · Krishna's question
  () => (<>
    <Bg src="s03_hill" scale={1.08} y={-40} />
    <Headline a="WHO FEEDS BRAJ?" b="NOT INDRA" />
    <Label x={760} y={640} text="GRASS ← THE HILL" tx={820} ty={900} />
    <Label x={230} y={1080} text="MILK ← THE COWS" tx={200} ty={1270} />
  </>),
  // 4 · bhog goes to the hill
  () => (<>
    <Bg src="s04_bhog" scale={1.04} />
    <Headline a="INDRA'S BHOG," b="SENT TO A HILL" />
    <Label x={880} y={560} text="GOVARDHAN" tx={900} ty={760} />
    <svg style={{ position: "absolute", left: 0, top: 0 }} width={1080} height={1920}>
      <path d="M300 1250 C 520 1150, 760 1280, 900 1380" stroke={RED} strokeWidth={6} strokeDasharray="18 14" fill="none" />
      <path d="M880 1350 L905 1385 L862 1392" stroke={RED} strokeWidth={6} fill="none" />
    </svg>
  </>),
  // 5 · Indra's answer
  () => (<>
    <Bg src="s05_indra" scale={1.05} />
    <Rain />
    <Headline a="INDRA'S ANSWER:" b="PRALAY" />
    <Label x={260} y={760} text="VAJRA" tx={410} ty={830} />
    <Label x={850} y={1500} text="AIRAVATA" tx={700} ty={1280} />
    <div style={{ position: "absolute", left: 30, top: 1520, width: 800, height: 150, background: "rgba(8,10,24,0.7)" }} />
    <Meter x={60} y={1540} label="RAIN OVER BRAJ" pct={100} />
  </>),
  // 6 · Braj going under
  () => (<>
    <Bg src="s06_flood" scale={1.06} />
    <Rain n={170} op={0.5} />
    <Headline a="BRAJ IS" b="GOING UNDER" />
    <Label x={240} y={1600} text="WATER ↑" tx={330} ty={1500} />
  </>),
  // 7 · the lift
  () => (<>
    <Bg src="s07_lift" scale={1.02} />
    <Rain n={60} op={0.35} />
    <Headline a="ONE HAND." b="LIKE A MUSHROOM" />
    <Reticle x={600} y={1112} r={58} />
    <Label x={830} y={1020} text="BHAGAVATA 10.25.19" />
  </>),
  // 8 · seven days
  () => (<>
    <Bg src="s07_lift" scale={1.12} y={60} dim={0.45} />
    <Headline a="7 DAYS." b="NOT ONE BITE" />
    <Parchment x={190} y={560} w={700}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 2, color: "#7a3b20", marginBottom: 14 }}>HOLDING GOVARDHAN</div>
      {[1, 2, 3, 4, 5, 6, 7].map((d) => (
        <div key={d} style={{ display: "flex", alignItems: "center", gap: 20, fontFamily: OSW, fontWeight: 700, fontSize: 52, lineHeight: 1.25 }}>
          <span style={{ color: RED, width: 50 }}>✓</span>DAY {d}<span style={{ fontFamily: MONO, fontSize: 22, color: "#7a6f60", marginLeft: "auto" }}>{d === 7 ? "STILL STANDING" : "NO FOOD"}</span>
        </div>
      ))}
    </Parchment>
  </>),
  // 9 · the storm gives up
  () => (<>
    <Bg src="s08_clear" scale={1.04} />
    <Headline a="DAY 7:" b="INDRA PULLS BACK" />
    <Label x={760} y={560} text="CLOUDS WITHDRAWN" tx={600} ty={760} />
  </>),
  // 10 · a mother's math
  () => (<>
    <Bg src="s09_yashoda" scale={1.04} />
    <Headline a="A MOTHER'S MATH:" b="7 × 8 = 56" />
    <Parchment x={90} y={420} w={560} rot={-3}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 20, letterSpacing: 2, color: "#7a3b20", marginBottom: 10 }}>YASHODA · AS IT'S TOLD</div>
      <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 46, lineHeight: 1.25 }}>8 MEALS A DAY</div>
      <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 46, lineHeight: 1.25 }}>× 7 DAYS MISSED</div>
      <div style={{ height: 4, background: INK, margin: "10px 0" }} />
      <div style={{ fontFamily: OSW, fontWeight: 700, fontSize: 64, color: RED }}>= 56 BHOG</div>
    </Parchment>
    <Reticle x={830} y={1150} r={62} />
  </>),
  // 11 · the 56 today
  () => (<>
    <Bg src="s10_annakut" scale={1.03} />
    <Headline a="EVERY GOVARDHAN PUJA:" b="56 BHOG" size={92} />
    <Label x={300} y={1080} text="ANNAKUT" tx={480} ty={1240} />
    <Note x={760} y={1520} text="SEND THIS TO YOUR MAA" rot={3} size={36} />
  </>),
  // 12 · the phone rises: Jyotiq installs
  () => (<>
    <Bg src="s10_annakut" scale={1.12} y={60} dim={0.4} blur={4} />
    <Headline a="EVERY STORM" b="HAS ITS TIME" />
    <Phone stage={0} y={560} />
  </>),
  // 13 · Gochar on the phone
  () => (<>
    <Bg src="s10_annakut" scale={1.12} y={60} dim={0.5} blur={4} />
    <Headline a="WHERE ARE YOUR PLANETS" b="RIGHT NOW?" size={88} />
    <Phone stage={1} y={440} />
    <Note x={540} y={1560} text="GOCHAR · FREE ON JYOTIQ" rot={-2} size={40} />
  </>),
  // 14 · next-day tease + end block
  () => (<>
    <Bg src="s11_bhaidooj" scale={1.04} dim={0.15} />
    <Headline a="NEXT: DAY 5" b="BHAI DOOJ" />
    <Note x={540} y={420} text="A SISTER VS YAMA" rot={-3} size={44} />
    <Note x={760} y={1320} text="FOLLOW FOR DAY 5" rot={2} size={44} />
    <EndBlock />
  </>),
];

export const D4_PANELS = PANELS.length;
const SCENE = [
  "BRAJ · INDRA PUJA", "SERIES · PANCHANG", "BRAJ · THE QUESTION", "BRAJ · THE OFFERING", "THE SKY · INDRA", "BRAJ · THE FLOOD", "GOVARDHAN · LIFTED",
  "GOVARDHAN · 7 DAYS", "BRAJ · DAY 7", "YASHODA'S KITCHEN", "TODAY · ANNAKUT", "TODAY · YOUR SKY", "TODAY · GOCHAR", "NEXT · WED 11 NOV",
];

export const BoardsD4: React.FC = () => {
  const f = useCurrentFrame();
  const i = Math.min(f, PANELS.length - 1);
  const P = PANELS[i];
  return (
    <AbsoluteFill style={{ background: "#0c0c14" }}>
      <P />
      <Guides />
      <TopStrip scene={SCENE[i]} fig={i + 1} />
    </AbsoluteFill>
  );
};
