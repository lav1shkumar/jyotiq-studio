import React from "react";
import { Img } from "remotion";
import { C, easeInOut, KARLA, line, MARCELLUS, prog, SCENES, word } from "../theme";
import { Accent, asset, Card, Count, Draw, Headline, Icon, In, Label, Paper, Pill, Scene, useWinT } from "../ui";

/* ---------- traction ---------- */
export const TractionScene: React.FC = () => {
  const t = useWinT();
  const [a, b] = SCENES.traction;
  const s15 = line("s15");
  const tDl = word("s15", "two") - 0.15;
  const tQ = word("s15", "ten") - 0.15;
  const stats = [
    { to: 2000, k: "App downloads", s: "Android & iOS, India", icon: "sms", t0: tDl, col: C.saffron },
    { to: 1000, k: "Registered users", s: "About half of installs", icon: "users", t0: tDl + 0.55, col: C.amber },
    { to: 10000, k: "Questions asked", s: "≈ 10 per registered user", icon: "question", t0: tQ, col: C.violet },
    { to: 10, k: "Verified advisors", s: "Onboarded on KarmEQ", icon: "shield", t0: tQ + 0.6, col: C.green },
  ];
  return (
    <Scene a={a} b={b}>
      <Paper />
      <div style={{ position: "absolute", left: 140, top: 150 }}>
        <In t0={a + 0.2}>
          <Label>Early traction</Label>
        </In>
        <In t0={s15.start} dur={0.9} style={{ marginTop: 22 }}>
          <Headline size={72}>
            The early <Accent>signal</Accent>.
          </Headline>
        </In>
      </div>
      <div style={{ position: "absolute", left: 140, right: 140, top: 430, display: "flex", gap: 26 }}>
        {stats.map((s) => (
          <div key={s.k} style={{ width: 390, flexShrink: 0 }}>
          <In t0={s.t0} dy={24}>
            <Card style={{ padding: "34px 30px", height: 300, boxSizing: "border-box" }}>
              <div style={{ width: 58, height: 58, borderRadius: 18, background: `${s.col}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={s.icon} size={30} color={s.col} />
              </div>
              <div style={{ fontFamily: MARCELLUS, fontSize: 84, color: C.ink, marginTop: 22, lineHeight: 1 }}>
                <Count to={s.to} t={t} t0={s.t0} dur={1.1} suffix="+" />
              </div>
              <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 27, color: C.ink, marginTop: 14 }}>{s.k}</div>
              <div style={{ fontFamily: KARLA, fontSize: 21, color: C.ink3, marginTop: 4 }}>{s.s}</div>
            </Card>
          </In>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 140, top: 790 }}>
        <In t0={tQ + 1.0} dy={10}>
          <Pill size={22} icon={<Icon name="growth" size={22} color={C.saffron} />}>
            Next milestone: turning engagement into paid conversion
          </Pill>
        </In>
      </div>
    </Scene>
  );
};

/* ---------- plan to 2029 ---------- */
export const PlanScene: React.FC = () => {
  const t = useWinT();
  const [a, b] = SCENES.plan;
  const s16 = line("s16");
  const tUsers = word("s16", "quarter") - 0.2;
  const tAdv = word("s16", "two") - 0.15;
  const tRev = word("s16", "twenty-five") - 0.15;
  const W = 880;
  const H = 480;
  const pts: [number, number, string, string][] = [
    [80, H - 70, "10K", "18 months"],
    [440, H - 150, "50K", "Year 2"],
    [820, 40, "250K", "2029"],
  ];
  const d = `M0 ${H - 40} C40 ${H - 60}, 60 ${H - 68}, 80 ${H - 70} C260 ${H - 100}, 340 ${H - 130}, 440 ${H - 150} C620 ${H - 190}, 720 ${H - 300}, 820 40`;
  const p = prog(t, tUsers - 0.6, 1.8, easeInOut);
  return (
    <Scene a={a} b={b}>
      <Paper tint="rgba(5,150,105,0.07)" />
      <div style={{ position: "absolute", left: 140, top: 150, width: 640 }}>
        <In t0={a + 0.2}>
          <Label>The plan</Label>
        </In>
        <In t0={s16.start} dur={0.9} style={{ marginTop: 22 }}>
          <Headline size={78}>
            By <Accent>2029</Accent>.
          </Headline>
        </In>
        <div style={{ marginTop: 46, display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            { v: "250,000", k: "users", t0: tUsers, icon: "users", c: C.saffron },
            { v: "2,000+", k: "verified advisors", t0: tAdv, icon: "shield", c: C.green },
            { v: "₹25 Cr", k: "annual revenue", t0: tRev, icon: "growth", c: C.violet },
          ].map((r) => (
            <In key={r.k} t0={r.t0} dx={-24} dy={0}>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: `${r.c}16`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={r.icon} size={28} color={r.c} />
                </div>
                <div style={{ fontFamily: MARCELLUS, fontSize: 56, color: C.ink }}>{r.v}</div>
                <div style={{ fontFamily: KARLA, fontSize: 28, color: C.ink2 }}>{r.k}</div>
              </div>
            </In>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 900, top: 290 }}>
        <svg width={W + 60} height={H + 80} style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="pl" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="rgba(5,150,105,0.22)" />
              <stop offset="1" stopColor="rgba(5,150,105,0)" />
            </linearGradient>
            <clipPath id="plc">
              <rect x={0} y={-40} width={W * p} height={H + 80} />
            </clipPath>
          </defs>
          <line x1={0} x2={W} y1={H - 30} y2={H - 30} stroke="rgba(44,24,16,0.18)" strokeWidth={1.5} />
          <g clipPath="url(#plc)">
            <path d={`${d} L820 ${H - 30} L0 ${H - 30} Z`} fill="url(#pl)" />
          </g>
          <Draw d={d} p={p} stroke={C.green} width={3.5} />
          {pts.map(([x, y, v, lbl], i) => {
            const q = prog(t, tUsers - 0.6 + 1.8 * (x / 820) * 0.9, 0.4);
            return (
              <g key={v} opacity={q}>
                <circle cx={x} cy={y} r={18 * q} fill="rgba(5,150,105,0.14)" />
                <circle cx={x} cy={y} r={8} fill="#fff" stroke={C.green} strokeWidth={4} />
                <text x={x} y={y - 30} textAnchor="middle" fontFamily={MARCELLUS} fontSize={i === 2 ? 44 : 32} fill={C.ink}>
                  {v}
                </text>
                <text x={x} y={H + 4} textAnchor="middle" fontFamily={KARLA} fontSize={21} fill={C.ink3}>
                  {lbl}
                </text>
              </g>
            );
          })}
          <text x={0} y={-50} fontFamily={KARLA} fontWeight={700} fontSize={19} letterSpacing="0.16em" fill={C.ink3}>
            USERS · COMPANY PLAN
          </text>
        </svg>
      </div>
    </Scene>
  );
};

/* ---------- team ---------- */
const PW = 360;
const PH = 480;
const Member: React.FC<{
  t: number;
  t0: number;
  photo: string;
  name: string;
  role: string;
  tint: [string, string];
  chips: { k: string; t0: number }[];
}> = ({ t, t0, photo, name, role, tint, chips }) => {
  const reveal = prog(t, t0 + 0.1, 1.1, easeInOut);
  const kb = 1.07 - 0.07 * prog(t, t0, 7, easeInOut);
  return (
    <div style={{ width: 860, flexShrink: 0 }}>
      <In t0={t0} dy={24}>
        <Card style={{ padding: 26, display: "flex", gap: 34, alignItems: "center" }}>
          {/* portrait in an arch, like the mela gate */}
          <div
            style={{
              position: "relative",
              width: PW,
              height: PH,
              flexShrink: 0,
              borderRadius: `${PW / 2}px ${PW / 2}px 22px 22px`,
              overflow: "hidden",
              background: `linear-gradient(180deg, ${tint[0]} 0%, ${tint[1]} 100%)`,
              boxShadow: "0 18px 44px rgba(124,45,18,0.16)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 60%)",
              }}
            />
            <Img
              src={asset(photo)}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "50% 100%",
                transform: `scale(${kb}) translateY(${(1 - reveal) * 30}px)`,
                transformOrigin: "50% 35%",
                opacity: reveal,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 9,
                borderRadius: `${PW / 2 - 9}px ${PW / 2 - 9}px 15px 15px`,
                border: "1.5px solid rgba(255,248,236,0.75)",
                pointerEvents: "none",
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>
            <div style={{ fontFamily: MARCELLUS, fontSize: 42, color: C.ink, lineHeight: 1.05, whiteSpace: "nowrap" }}>{name}</div>
            <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 18, letterSpacing: "0.18em", color: C.rust, marginTop: 12 }}>{role}</div>
            <div style={{ width: 56, height: 2, background: C.goldHair, marginTop: 22, marginBottom: 24 }} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12, minHeight: 4 * 56 + 3 * 12 }}>
              {chips.map((c) => (
                <In key={c.k} t0={c.t0} dy={8} dur={0.5}>
                  <div
                    style={{
                      padding: "10px 18px",
                      borderRadius: 999,
                      background: "rgba(234,88,12,0.07)",
                      border: `1.5px solid ${C.goldHair}`,
                      fontFamily: KARLA,
                      fontWeight: 600,
                      fontSize: 22,
                      color: C.ink,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.k}
                  </div>
                </In>
              ))}
            </div>
          </div>
        </Card>
      </In>
    </div>
  );
};

export const TeamScene: React.FC = () => {
  const t = useWinT();
  const [a, b] = SCENES.team;
  const s17 = line("s17");
  const tAmit = word("s17", "amit");
  const tShi = word("s17", "doctor");
  return (
    <Scene a={a} b={b}>
      <Paper />
      <div style={{ position: "absolute", left: 0, right: 0, top: 112, textAlign: "center" }}>
        <In t0={a + 0.2}>
          <Label style={{ justifyContent: "center" }}>The team</Label>
        </In>
        <In t0={s17.start} dur={0.9} style={{ marginTop: 20 }}>
          <Headline size={62}>
            Technology and <Accent>human experience</Accent>, under one roof.
          </Headline>
        </In>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 350, display: "flex", justifyContent: "center", gap: 36 }}>
        <Member
          t={t}
          t0={tAmit - 0.3}
          photo="team/amit.png"
          name="Amit Kaushik"
          role="FOUNDER & CEO"
          tint={["#FDF0DC", "#F5C28A"]}
          chips={[
            { k: "22+ years building platforms", t0: word("s17", "twenty-two") },
            { k: "Fiserv · Intuit · Infosys", t0: word("s17", "fiserv") },
            { k: "MBA, Thunderbird", t0: word("s17", "intuit") + 0.3 },
            { k: "Practitioner of Vedic sciences", t0: word("s17", "intuit") + 0.55 },
          ]}
        />
        <Member
          t={t}
          t0={tShi - 0.3}
          photo="team/shishira.png"
          name="Dr. Shishira Sharma"
          role="CO-FOUNDER & COO"
          tint={["#FDF0DC", "#F5C28A"]}
          chips={[
            { k: "20+ years in wellness", t0: word("s17", "twenty", 1) },
            { k: "PLR therapist & life coach", t0: word("s17", "healing") },
            { k: "Operations & community", t0: word("s17", "transformation") },
          ]}
        />
      </div>
    </Scene>
  );
};
