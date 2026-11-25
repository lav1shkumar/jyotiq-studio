import React from "react";
import { AbsoluteFill } from "remotion";
import { MoonId, MOONS, moonPos, project, systemCam } from "../cam";
import { Cosmos } from "../Cosmos";
import { C, clamp01, ease, KARLA, line, MARCELLUS, prog, SCENES, word } from "../theme";
import { Accent, BrandIcon, Burst, Card, Icon, In, Label, TypeText, useWinT } from "../ui";

const GlassCard: React.FC<{ t0: number; t1: number; children: React.ReactNode; width?: number }> = ({ t0, t1, children, width = 660 }) => (
  <div style={{ position: "absolute", left: 140, top: 210 }}>
    <In t0={t0} t1={t1} dur={0.8} dx={-40} dy={0}>
      <Card glass style={{ width, padding: 38, background: "rgba(20,14,30,0.42)" }}>
        {children}
      </Card>
    </In>
  </div>
);

const Head: React.FC<{ which: "jyotiq" | "karmeq" | "grovit"; name: string; role: string; tint: string }> = ({ which, name, role, tint }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
    <BrandIcon which={which} size={74} />
    <div>
      <div style={{ fontFamily: MARCELLUS, fontSize: 50, color: "#FFF6EA", lineHeight: 1 }}>{name}</div>
      <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 18, letterSpacing: "0.2em", textTransform: "uppercase", color: tint, marginTop: 8 }}>{role}</div>
    </div>
  </div>
);

const Row: React.FC<{ t: number; t0: number; children: React.ReactNode; tint: string }> = ({ t, t0, children, tint }) => {
  const p = prog(t, t0, 0.45);
  const done = prog(t, t0 + 0.35, 0.3);
  if (p <= 0) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16, opacity: p, transform: `translateY(${(1 - p) * 10}px)` }}>
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
          border: `2px solid ${tint}`,
          background: done > 0.5 ? tint : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {done > 0.5 && <Icon name="check" size={20} color="#140E1E" sw={3} />}
      </div>
      <div style={{ fontFamily: KARLA, fontSize: 26, color: "#F3E9F9" }}>{children}</div>
    </div>
  );
};

const MoonLabel: React.FC<{ id: MoonId; t: number; t0: number; t1: number; name: string; role: string; which: "jyotiq" | "karmeq" | "grovit"; dy?: number }> = ({
  id,
  t,
  t0,
  t1,
  name,
  role,
  which,
  dy = 0,
}) => {
  const c = systemCam(t);
  const [x, y] = project(c, moonPos(id, t));
  const p = prog(t, t0, 0.6) * (1 - prog(t, t1, 0.4));
  if (p <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y + 72 + dy, transform: `translate(-50%, ${(1 - p) * 10}px)`, opacity: p }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 18px 10px 10px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.08)",
          border: "1.5px solid rgba(255,255,255,0.22)",
          backdropFilter: "blur(14px)",
          whiteSpace: "nowrap",
        }}
      >
        <BrandIcon which={which} size={40} />
        <div>
          <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 24, color: "#FFF6EA", lineHeight: 1.05 }}>{name}</div>
          <div style={{ fontFamily: KARLA, fontSize: 17, color: "rgba(255,240,220,0.7)" }}>{role}</div>
        </div>
      </div>
    </div>
  );
};

const JOURNEY = [
  { k: "Question", icon: "question" },
  { k: "JyotiQ answers", icon: "bolt" },
  { k: "GrovIT follows up", icon: "chat" },
  { k: "KarmEQ expert", icon: "users" },
  { k: "GrovIT keeps them close", icon: "reset" },
];

export const SystemScene: React.FC = () => {
  const t = useWinT();
  const [a, b] = SCENES.system;
  const s7 = line("s07");
  const s8 = line("s08");
  const s9 = line("s09");
  const s10 = line("s10");
  const parentXY = project(systemCam(t), [0, 0, 0]);
  const jp = { violet: "#C4B5FD", green: "#6EE7B7", teal: "#67E8F9" };
  const tBack = word("s10", "brings") - 0.6;
  return (
    <Burst x={960} y={540} t0={a} dur={1.0} color="rgba(255,170,90,0.9)">
      <AbsoluteFill>
        <Cosmos mode="system" />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)" }} />
        {/* s07: one parent, three products */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 96, textAlign: "center" }}>
          <In t0={s7.start - 0.2} t1={s8.start - 0.6}>
            <Label light style={{ justifyContent: "center" }}>
              The products
            </Label>
          </In>
          <In t0={s7.start} t1={s8.start - 0.6} dur={0.9} style={{ marginTop: 20 }}>
            <div style={{ fontFamily: MARCELLUS, fontSize: 62, color: "#FFF4E2" }}>
              One parent platform. <Accent light>Three connected products.</Accent>
            </div>
          </In>
        </div>
        {(() => {
          const p = prog(t, s7.start + 0.2, 0.6) * (1 - prog(t, s8.start - 0.6, 0.4));
          return p > 0 ? (
            <div
              style={{
                position: "absolute",
                left: parentXY[0],
                top: parentXY[1] + 190,
                transform: "translateX(-50%)",
                opacity: p,
                fontFamily: MARCELLUS,
                fontSize: 34,
                color: "#FFE2BF",
                letterSpacing: "0.06em",
              }}
            >
              AstroRaaga
            </div>
          ) : null;
        })()}
        <MoonLabel id="jyotiq" which="jyotiq" t={t} t0={word("s07", "three") - 0.1} t1={s8.start - 0.5} name="JyotiQ" role="AI guidance" />
        <MoonLabel id="karmeq" which="karmeq" t={t} t0={word("s07", "three") + 0.15} t1={s8.start - 0.5} name="KarmEQ" role="Human experts" />
        <MoonLabel id="grovit" which="grovit" t={t} t0={word("s07", "three") + 0.4} t1={s8.start - 0.5} name="GrovIT" role="Growth engine" dy={-4} />

        {/* s08 JyotiQ */}
        <GlassCard t0={s8.start - 0.2} t1={s9.start - 0.55}>
          <Head which="jyotiq" name="JyotiQ" role="AI guidance · instant" tint={jp.violet} />
          <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-end" }}>
            <div
              style={{
                maxWidth: 470,
                padding: "16px 22px",
                borderRadius: 22,
                borderBottomRightRadius: 6,
                background: "rgba(255,255,255,0.92)",
                fontFamily: KARLA,
                fontSize: 27,
                color: C.ink,
                opacity: prog(t, s8.start + 0.1, 0.3),
              }}
            >
              <TypeText text="Will I get the job I applied for?" t={t} t0={s8.start + 0.2} cps={34} />
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <Row t={t} t0={word("s08", "answers") - 0.1} tint={jp.violet}>
              Birth chart read
            </Row>
            <Row t={t} t0={word("s08", "personalised") - 0.1} tint={jp.violet}>
              Dasha and transits checked
            </Row>
            <Row t={t} t0={word("s08", "vedic") + 0.1} tint={jp.violet}>
              A personal Vedic reading
            </Row>
          </div>
          <div style={{ marginTop: 26, display: "flex", gap: 12 }}>
            <In t0={word("s08", "seconds") - 0.2} dy={8} dur={0.5}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 999, background: "rgba(196,181,253,0.16)", color: jp.violet, fontFamily: KARLA, fontWeight: 700, fontSize: 22 }}>
                <Icon name="bolt" size={20} color={jp.violet} /> Answered in ~5 seconds
              </div>
            </In>
            <In t0={word("s08", "seconds") + 0.05} dy={8} dur={0.5}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 999, background: "rgba(255,255,255,0.08)", color: "#EDE4F7", fontFamily: KARLA, fontWeight: 600, fontSize: 22 }}>
                Pay per question
              </div>
            </In>
          </div>
        </GlassCard>

        {/* s09 KarmEQ */}
        <GlassCard t0={s9.start - 0.25} t1={s10.start - 0.55}>
          <Head which="karmeq" name="KarmEQ" role="Human expertise · 1-on-1" tint={jp.green} />
          <div style={{ marginTop: 30, display: "flex", alignItems: "center", gap: 20, padding: 22, borderRadius: 22, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.12)" }}>
            <div style={{ width: 84, height: 84, borderRadius: 42, background: "linear-gradient(135deg,#FCD34D,#EA580C)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="users" size={40} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 28, color: "#FFF6EA" }}>Vedic astrologer</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, opacity: prog(t, word("s09", "verified") - 0.1, 0.4) }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: "rgba(110,231,183,0.18)", color: jp.green, fontFamily: KARLA, fontWeight: 700, fontSize: 19 }}>
                  <Icon name="shield" size={18} color={jp.green} /> Verified
                </div>
                <div style={{ fontFamily: KARLA, fontSize: 19, color: "rgba(255,240,220,0.7)" }}>Hindi · English</div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
            {[
              ["phone", "Audio"],
              ["video", "Video"],
              ["pin", "Offline"],
            ].map(([ic, k], i) => (
              <In key={k} t0={word("s09", "one") - 0.4 + i * 0.12} dy={8} dur={0.45}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 999, background: "rgba(255,255,255,0.08)", color: "#F0FFF8", fontFamily: KARLA, fontWeight: 600, fontSize: 22 }}>
                  <Icon name={ic} size={20} color={jp.green} /> {k}
                </div>
              </In>
            ))}
          </div>
          {(() => {
            const tp = word("s09", "books");
            const press = prog(t, tp, 0.15) * (1 - prog(t, tp + 0.18, 0.25));
            return (
              <div
                style={{
                  marginTop: 26,
                  padding: "18px 0",
                  textAlign: "center",
                  borderRadius: 999,
                  background: "linear-gradient(90deg,#047857,#059669)",
                  color: "#fff",
                  fontFamily: KARLA,
                  fontWeight: 700,
                  fontSize: 26,
                  transform: `scale(${1 - press * 0.04})`,
                  boxShadow: `0 ${14 - press * 8}px 34px rgba(5,150,105,0.45)`,
                  opacity: prog(t, s9.start + 0.3, 0.5),
                }}
              >
                {t > tp + 0.25 ? "Consultation booked ✓" : "Book consultation"}
              </div>
            );
          })()}
        </GlassCard>

        {/* s10 GrovIT */}
        <GlassCard t0={s10.start - 0.25} t1={tBack}>
          <Head which="grovit" name="GrovIT" role="Growth engine · behind both" tint={jp.teal} />
          <svg width={584} height={120} style={{ display: "block", marginTop: 18 }}>
            {[92, 292, 492].map((x, i) => (
              <path
                key={x}
                d={`M292 8 C292 60, ${x} 50, ${x} 112`}
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - prog(t, s10.start + 0.5 + i * 0.15, 0.8)}
                fill="none"
                stroke="rgba(103,232,249,0.55)"
                strokeWidth={2}
              />
            ))}
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: -6 }}>
            {[
              ["chat", "WhatsApp", "whatsapp"],
              ["sms", "SMS", "sms"],
              ["mail", "Email", "email"],
            ].map(([ic, k, w]) => (
              <In key={k} t0={word("s10", w) - 0.15} dy={10} dur={0.5} s0={0.8}>
                <div style={{ width: 184, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 70, height: 70, borderRadius: 20, background: "#0B0910", border: "1.5px solid rgba(103,232,249,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={ic} size={32} color="#E0FBFF" />
                  </div>
                  <div style={{ fontFamily: KARLA, fontWeight: 600, fontSize: 22, color: "#E9FDFF" }}>{k}</div>
                </div>
              </In>
            ))}
          </div>
          <In t0={word("s10", "email") + 0.35} dy={12} dur={0.6} style={{ marginTop: 26 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderRadius: 18, background: "rgba(255,255,255,0.92)", color: C.ink, fontFamily: KARLA, fontSize: 24 }}>
              <Icon name="chat" size={24} color={C.teal} />
              <span>Your follow-up reading is ready. Talk to an expert?</span>
            </div>
          </In>
        </GlassCard>

        {/* the full journey */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 128, display: "flex", justifyContent: "center" }}>
          <In t0={tBack + 0.2} dur={0.8} t1={b - 0.7}>
            <Label light style={{ justifyContent: "center" }}>
              One continuing journey
            </Label>
          </In>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
          {JOURNEY.map((j, i) => {
            const t0 = tBack + 0.2 + i * 0.22;
            const active = clamp01((t - (tBack + 1.4)) / 0.4) > 0 && Math.floor(((t - (tBack + 1.4)) / 0.45) % 5) === i;
            return (
              <React.Fragment key={j.k}>
                {i > 0 && (
                  <div style={{ width: 46, height: 2, background: "rgba(255,220,170,0.45)", opacity: prog(t, t0 - 0.1, 0.4) * (1 - prog(t, b - 0.7, 0.4)) }} />
                )}
                <In t0={t0} dur={0.55} dy={12} t1={b - 0.7}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "13px 20px",
                      borderRadius: 999,
                      background: active ? "rgba(245,158,11,0.9)" : "rgba(255,255,255,0.09)",
                      border: "1.5px solid rgba(255,220,170,0.3)",
                      color: active ? "#1C150E" : "#FFF1DE",
                      fontFamily: KARLA,
                      fontWeight: 700,
                      fontSize: 23,
                      boxShadow: active ? "0 0 30px rgba(245,158,11,0.6)" : undefined,
                    }}
                  >
                    <Icon name={j.icon} size={22} color={active ? "#1C150E" : "#FDBA74"} /> {j.k}
                  </div>
                </In>
              </React.Fragment>
            );
          })}
        </div>
      </AbsoluteFill>
    </Burst>
  );
};

export const _u = [ease, MOONS];
