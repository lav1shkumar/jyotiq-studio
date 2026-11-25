import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, clamp, CONTENT_W, CONTENT_X, GRADIENT, hasTimes, JobCopilotProps } from "./theme";
import {
  AppWindow,
  Caption,
  Card,
  CheckIcon,
  Counter,
  Cursor,
  FlagIcon,
  FunnelBar,
  LockIcon,
  PushIn,
  ScoreBar,
  Toast,
  useEnter,
} from "./ui";

export type SceneProps = { dur: number; p: JobCopilotProps };

const gradientText: React.CSSProperties = {
  backgroundImage: GRADIENT,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

const rise = (p: number, dist = 24): React.CSSProperties => ({
  opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
  transform: `translateY(${interpolate(p, [0, 1], [dist, 0])}px)`,
});

/* ================================================================== */
/* 1. HOOK  (0:00-0:04)                                                */
/* ================================================================== */
export const HookScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const slam = useEnter(34, 14);
  const button = useEnter(62, 20);
  const glow = 0.5 + 0.5 * Math.sin(frame / 9);
  return (
    <PushIn durationInFrames={dur}>
      <AbsoluteFill style={{ padding: `0 ${CONTENT_X}px`, justifyContent: "center" }}>
        {/* Line 1 is fully visible at frame 0 so the first frame works as a thumbnail. */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: -2.5,
            color: C.text,
            width: CONTENT_W,
          }}
        >
          Everyone&apos;s building bots that auto-apply to 1,000 jobs.
        </div>
        <div
          style={{
            marginTop: 44,
            fontSize: 98,
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 1.05,
            opacity: interpolate(slam, [0, 0.3], [0, 1], clamp),
            transform: `scale(${interpolate(slam, [0, 1], [1.18, 1])})`,
            transformOrigin: "left center",
            ...gradientText,
          }}
        >
          I built the opposite.
        </div>
        <div style={{ marginTop: 90, display: "flex", flexDirection: "column", alignItems: "center", ...rise(button) }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "30px 56px",
              borderRadius: 999,
              background: C.surface2,
              border: `2px solid rgba(34,211,238,${0.45 + 0.3 * glow})`,
              boxShadow: `0 0 ${34 + 24 * glow}px rgba(34,211,238,${0.22 + 0.18 * glow})`,
            }}
          >
            <LockIcon size={42} color={C.warning} />
            <span style={{ fontSize: 38, fontWeight: 700, color: C.text }}>Submit application</span>
          </div>
          <div style={{ marginTop: 22, fontSize: 26, color: C.muted, fontWeight: 500 }}>
            Only a human can press this.
          </div>
        </div>
      </AbsoluteFill>
    </PushIn>
  );
};

/* ================================================================== */
/* 2. PROBLEM  (0:04-0:10)                                             */
/* ================================================================== */
const FORM_FIELDS = [
  "First name", "Last name", "Email", "Phone", "Current city", "LinkedIn URL",
  "GitHub URL", "Portfolio", "College", "Degree", "Graduation year", "CGPA",
  "Current company", "Current role", "Notice period", "Current CTC", "Expected CTC",
  "Work authorization", "Willing to relocate?", "Preferred location",
  "How did you hear about us?", "Cover letter", "Resume", "Certifications",
  "Languages", "Gender (optional)", "I confirm this information is true",
];

export const ProblemScene: React.FC<SceneProps> = ({ dur, p }) => {
  const frame = useCurrentFrame();
  const ROW = 96;
  const scroll = interpolate(frame, [12, 168], [0, -(FORM_FIELDS.length * ROW - 700)], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const caret = Math.floor(frame / 15) % 2 === 0 ? 1 : 0;
  return (
    <>
      <PushIn durationInFrames={dur}>
        <AppWindow width={CONTENT_W} height={900} style={{ position: "absolute", left: CONTENT_X, top: 120 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              padding: "28px 36px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 22, color: C.muted, fontWeight: 500 }}>Job application</div>
                <div style={{ fontSize: 32, color: C.text, fontWeight: 700 }}>Please complete all fields</div>
              </div>
              <div
                style={{
                  padding: "10px 22px",
                  borderRadius: 14,
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  display: "flex",
                  alignItems: "baseline",
                  gap: 10,
                }}
              >
                <Counter to={27} from={12} until={150} style={{ fontSize: 44, fontWeight: 800, color: C.text }} />
                <span style={{ fontSize: 24, color: C.muted, fontWeight: 600 }}>fields</span>
              </div>
            </div>
            <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
              <div style={{ transform: `translateY(${scroll}px)` }}>
                {FORM_FIELDS.map((label, i) => (
                  <div key={label} style={{ height: ROW, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "baseline", marginBottom: 8 }}>
                      <span style={{ fontSize: 18, color: C.indigo, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span style={{ fontSize: 24, color: C.muted, fontWeight: 500 }}>{label}</span>
                    </div>
                    <div
                      style={{
                        height: 50,
                        borderRadius: 10,
                        background: C.bg,
                        border: `1px solid ${C.border}`,
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: 16,
                      }}
                    >
                      {i === 0 ? <div style={{ width: 2, height: 26, background: C.text, opacity: caret }} /> : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AppWindow>
      </PushIn>
      <Caption
        lines={
          hasTimes(p)
            ? ["Every application. 27 fields.", `${p.manualMinutes} minutes each.`]
            : ["Every application.", "Same 27 fields."]
        }
        from={8}
        to={92}
      />
      <Caption lines={["Most of that time", "isn't thinking. It's typing."]} from={94} to={dur} />
    </>
  );
};

/* ================================================================== */
/* 3. DISCOVER  (0:10-0:20)                                            */
/* ================================================================== */
const COMPANIES = [
  "Northwind Analytics", "Contoso Pharma", "Fabrikam Consulting", "Tailspin Payments",
  "Litware Insights", "Adatum Health", "Proseware Labs", "Woodgrove Bank",
];

export const DiscoverScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 6);
  const counterCard = useEnter(34, 20);
  return (
    <>
      <PushIn durationInFrames={dur}>
        <AppWindow width={CONTENT_W} height={930} style={{ position: "absolute", left: CONTENT_X, top: 100 }}>
          <div style={{ position: "absolute", inset: 0, padding: "30px 36px", display: "flex", flexDirection: "column", gap: 26 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  background: C.cyan,
                  boxShadow: `0 0 ${10 + 12 * pulse}px ${C.cyan}`,
                }}
              />
              <span style={{ fontSize: 32, fontWeight: 700, color: C.text }}>Scanning 52 target companies</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {[...COMPANIES, "+44 more"].map((name, i) => {
                const chip = spring({ frame: frame - (8 + i * 5), fps, durationInFrames: 16, config: { damping: 200 } });
                return (
                  <div
                    key={name}
                    style={{
                      padding: "10px 18px",
                      borderRadius: 12,
                      background: name.startsWith("+") ? "transparent" : C.bg,
                      border: `1px solid ${name.startsWith("+") ? C.indigo : C.border}`,
                      fontSize: 22,
                      fontWeight: 500,
                      color: name.startsWith("+") ? C.indigo : C.muted,
                      ...rise(chip, 12),
                    }}
                  >
                    {name}
                  </div>
                );
              })}
            </div>
            <Card style={{ padding: "22px 30px", background: C.bg, ...rise(counterCard) }}>
              <div style={{ fontSize: 24, color: C.muted, fontWeight: 500 }}>Job postings found</div>
              <Counter
                to={725}
                from={40}
                until={130}
                style={{ fontSize: 112, fontWeight: 800, color: C.text, letterSpacing: -3, lineHeight: 1.05 }}
              />
            </Card>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <FunnelBar label="postings scanned" value={725} widthPct={100} color={C.indigo} appearAt={146} />
              <FunnelBar label="India entry-level" value={39} widthPct={70} color={C.cyan} appearAt={176} />
              <FunnelBar label="strong matches (7+/10)" value={6} widthPct={52} color={C.success} appearAt={206} />
            </div>
          </div>
        </AppWindow>
      </PushIn>
      <Caption lines={["It reads 725 job posts", "so I don't have to."]} from={70} to={dur} />
    </>
  );
};

/* ================================================================== */
/* 4. RANK  (0:20-0:30)                                                */
/* ================================================================== */
type JobCardData = { title: string; org: string; score: number; note?: string; delay: number };

const JobCard: React.FC<{ d: JobCardData; expand?: number; dim?: number }> = ({ d, expand = 0, dim = 1 }) => {
  const enter = useEnter(d.delay, 18);
  const color = d.score >= 7 ? C.success : C.danger;
  const expandedHeight = interpolate(expand, [0, 1], [0, 184]);
  return (
    <Card
      style={{
        padding: "20px 28px",
        opacity: interpolate(enter, [0, 0.4], [0, 1], clamp) * dim,
        transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
        border: d.score >= 7 ? `1px solid ${C.success}55` : `1px solid ${C.border}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 32, fontWeight: 700, color: C.text }}>{d.title}</div>
          <div style={{ marginTop: 6, fontSize: 22, color: C.muted, display: "flex", gap: 14, alignItems: "center" }}>
            <span>{d.org}</span>
            {d.note ? (
              <span
                style={{
                  padding: "3px 12px",
                  borderRadius: 8,
                  background: `${C.danger}1F`,
                  color: C.danger,
                  fontSize: 20,
                  fontWeight: 600,
                }}
              >
                {d.note}
              </span>
            ) : null}
          </div>
        </div>
        <div style={{ fontSize: 46, fontWeight: 800, color, fontVariantNumeric: "tabular-nums" }}>{d.score}/10</div>
      </div>
      <div style={{ marginTop: 14 }}>
        <ScoreBar label="Match score" valueText="" fraction={d.score / 10} color={color} appearAt={d.delay + 16} />
      </div>
      <div style={{ height: expandedHeight, overflow: "hidden" }}>
        <div style={{ paddingTop: 20, borderTop: `1px solid ${C.border}`, marginTop: 18, display: "flex", flexDirection: "column", gap: 20 }}>
          <ScoreBar label="Skill match" valueText="9/10" fraction={0.9} color={C.success} appearAt={160} height={14} />
          <ScoreBar label="Experience" valueText="asks 2.5 yrs" fraction={0.3} color={C.warning} appearAt={176} height={14} />
        </div>
      </div>
    </Card>
  );
};

export const RankScene: React.FC<SceneProps> = ({ dur }) => {
  const expand = useEnter(148, 22);
  const dim = interpolate(expand, [0, 1], [1, 0.42]);
  const eyebrow = useEnter(4, 14);
  return (
    <>
      <PushIn durationInFrames={dur}>
        <AbsoluteFill style={{ padding: `100px ${CONTENT_X}px 0`, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 24, letterSpacing: 4, fontWeight: 700, color: C.muted, ...rise(eyebrow, 10) }}>
            SCORING EVERY FULL DESCRIPTION
          </div>
          <JobCard
            d={{ title: "Tele-caller – Associate", org: "Wingtip Finance · Noida", score: 0, note: "call-centre work", delay: 10 }}
            dim={dim}
          />
          <JobCard
            d={{ title: "Customer Support Associate", org: "Tailspin Payments · Bengaluru", score: 0, note: "support work", delay: 22 }}
            dim={dim}
          />
          <JobCard
            d={{ title: "Associate Consultant – Analytics", org: "Northwind Analytics · Bengaluru", score: 9, delay: 34 }}
            expand={expand}
          />
        </AbsoluteFill>
      </PushIn>
      <Caption lines={["It reads the whole", "description, not the title."]} from={16} to={146} />
      <Caption lines={["And it tells me when", "I'm under-qualified."]} from={150} to={dur} />
    </>
  );
};

/* ================================================================== */
/* 5. PREFILL  (0:30-0:44)                                             */
/* ================================================================== */
type RowState = "typing" | "done" | "empty";

const FormRow: React.FC<{
  label: string;
  value: React.ReactNode;
  state: RowState;
  flagged?: { tag: string; at: number };
}> = ({ label, value, state, flagged }) => {
  const flag = useEnter(flagged ? flagged.at : 99999, 16);
  const frame = useCurrentFrame();
  const glow = 0.5 + 0.5 * Math.sin(frame / 7);
  const isFlag = flagged && frame >= flagged.at;
  const border = isFlag ? `${C.warning}` : state === "done" ? `${C.success}66` : C.border;
  return (
    <div style={{ display: "flex", alignItems: "center", height: 52, gap: 18 }}>
      <div style={{ width: 210, fontSize: 23, color: C.muted, fontWeight: 500, flexShrink: 0 }}>{label}</div>
      <div
        style={{
          flex: 1,
          height: 50,
          borderRadius: 10,
          background: C.bg,
          border: `1.5px solid ${border}`,
          boxShadow: isFlag ? `0 0 ${10 + 12 * glow}px ${C.warning}55` : "none",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          fontSize: 25,
          color: C.text,
          fontWeight: 500,
          gap: 12,
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        <div style={{ flex: 1, overflow: "hidden" }}>{value}</div>
        {state === "done" && !flagged ? <CheckIcon size={26} color={C.success} /> : null}
        {flagged ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 12px",
              borderRadius: 8,
              background: `${C.warning}22`,
              color: C.warning,
              fontSize: 20,
              fontWeight: 700,
              opacity: flag,
            }}
          >
            <FlagIcon size={20} color={C.warning} />
            {flagged.tag}
          </div>
        ) : null}
      </div>
    </div>
  );
};

const TYPED_FIELDS: { label: string; value: string }[] = [
  { label: "Name", value: "Ayush T." },
  { label: "Email", value: "you@example.com" },
  { label: "Phone", value: "+91 98XXX XXXXX" },
  { label: "College", value: "GGSIPU, New Delhi" },
  { label: "Graduation year", value: "2027" },
  { label: "LinkedIn", value: "linkedin.com/in/your-name" },
  { label: "Current city", value: "New Delhi" },
];

export const PrefillScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const START = 28;
  const STEP = 24;
  const CPS = 2; // characters per frame
  const resumeAt = START + TYPED_FIELDS.length * STEP + 10;
  const moreAt = resumeAt + 22;
  const resume = useEnter(resumeAt, 16);
  const more = useEnter(moreAt, 16);
  const filled = interpolate(frame, [START, moreAt + 10], [0, 24], clamp);
  return (
    <>
      <PushIn durationInFrames={dur}>
        <AppWindow width={CONTENT_W} height={940} style={{ position: "absolute", left: CONTENT_X, top: 100 }}>
          <div style={{ position: "absolute", inset: 0, padding: "24px 32px", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 22, color: C.muted, fontWeight: 500 }}>Northwind Analytics</div>
                <div style={{ fontSize: 30, color: C.text, fontWeight: 700 }}>Associate Consultant – Analytics</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: C.text, fontVariantNumeric: "tabular-nums" }}>
                  {Math.round(filled)} <span style={{ color: C.muted, fontWeight: 600, fontSize: 22 }}>of 27 fields filled</span>
                </div>
                <div style={{ marginTop: 8, width: 250, height: 8, borderRadius: 4, background: C.bg, marginLeft: "auto" }}>
                  <div style={{ width: `${(filled / 27) * 100}%`, height: "100%", borderRadius: 4, backgroundImage: GRADIENT }} />
                </div>
              </div>
            </div>
            {TYPED_FIELDS.map((f, i) => {
              const t0 = START + i * STEP;
              const chars = Math.max(0, Math.floor((frame - t0) * CPS));
              const text = f.value.slice(0, chars);
              const state: RowState = chars <= 0 ? "empty" : chars < f.value.length ? "typing" : "done";
              const caret = state === "typing" ? <span style={{ color: C.cyan }}>|</span> : null;
              return (
                <FormRow
                  key={f.label}
                  label={f.label}
                  state={state}
                  value={
                    <span>
                      {text}
                      {caret}
                    </span>
                  }
                />
              );
            })}
            <FormRow
              label="Resume"
              state={frame >= resumeAt + 8 ? "done" : "empty"}
              value={
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "4px 14px",
                    borderRadius: 8,
                    background: `${C.indigo}26`,
                    color: C.text,
                    fontSize: 22,
                    fontWeight: 600,
                    opacity: resume,
                  }}
                >
                  PDF · Ayush_T_Resume.pdf
                </span>
              }
            />
            <div
              style={{
                height: 44,
                display: "flex",
                alignItems: "center",
                gap: 12,
                paddingLeft: 228,
                fontSize: 22,
                color: C.success,
                fontWeight: 600,
                opacity: more,
              }}
            >
              <CheckIcon size={24} color={C.success} /> +16 more fields filled from your profile
            </div>
            <FormRow label="Notice period" state="empty" value={<span />} flagged={{ tag: "needs you", at: 260 }} />
            <FormRow
              label="Consent"
              state="empty"
              value={<span style={{ color: C.muted, fontSize: 22 }}>☐ I confirm this is true</span>}
              flagged={{ tag: "yours to tick", at: 282 }}
            />
            <FormRow
              label="CAPTCHA"
              state="empty"
              value={<span style={{ color: C.muted, fontSize: 22 }}>Verification check</span>}
              flagged={{ tag: "yours to solve", at: 304 }}
            />
          </div>
        </AppWindow>
      </PushIn>
      <Caption lines={["It fills what it knows."]} from={24} to={236} />
      <Caption lines={["Flags what it doesn't.", "Never guesses."]} from={240} to={dur} />
    </>
  );
};

/* ================================================================== */
/* 6. THE HUMAN CLICK  (0:44-0:52)                                     */
/* ================================================================== */
export const HumanClickScene: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const PHASE2 = 124;
  const phase1 = interpolate(frame, [PHASE2 - 6, PHASE2 + 6], [1, 0], clamp);
  const phase2 = interpolate(frame, [PHASE2, PHASE2 + 12], [0, 1], clamp);

  // Phase 1: human cursor travels to Submit and clicks at frame 84.
  const CLICK = 84;
  const move = interpolate(frame, [26, 78], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const cx = interpolate(move, [0, 1], [880, 700]);
  const cy = interpolate(move, [0, 1], [1010, 668]);
  const pressed = frame >= CLICK && frame < CLICK + 8;
  const submitted = frame >= CLICK + 6;
  const headline = useEnter(10, 18);
  const card = useEnter(4, 18);

  // Phase 2: tracker card slides from "Autofilled" to "Submitted".
  const slide = interpolate(frame, [150, 176], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const COL_W = (CONTENT_W - 40) / 2;
  const confirmed = frame >= 184 ? 1 : 0;
  const tile = useEnter(160, 18);

  return (
    <>
      <PushIn durationInFrames={dur}>
        {/* Phase 1 */}
        <AbsoluteFill style={{ opacity: phase1 }}>
          <div
            style={{
              position: "absolute",
              left: CONTENT_X,
              top: 150,
              width: CONTENT_W,
              fontSize: 70,
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 1.08,
              color: C.text,
              ...rise(headline),
            }}
          >
            The last click is <span style={gradientText}>always mine.</span>
          </div>
          <div style={{ position: "absolute", left: CONTENT_X, top: 360, width: CONTENT_W, display: "flex", justifyContent: "center" }}>
            {frame >= CLICK + 10 ? <Toast text="Submitted — confirmed by you" appearAt={CLICK + 10} /> : null}
          </div>
          <Card style={{ position: "absolute", left: CONTENT_X, top: 470, width: CONTENT_W, padding: "34px 38px", ...rise(card) }}>
            <div style={{ fontSize: 24, color: C.muted, fontWeight: 500 }}>Ready for your review</div>
            <div style={{ marginTop: 6, fontSize: 32, color: C.text, fontWeight: 700 }}>
              24 filled <span style={{ color: C.muted }}>·</span> <span style={{ color: C.warning }}>3 flagged for you</span>
            </div>
            <div
              style={{
                marginTop: 30,
                height: 96,
                borderRadius: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                fontSize: 36,
                fontWeight: 800,
                color: "#FFFFFF",
                backgroundImage: submitted ? `linear-gradient(90deg, ${C.success}, #16A34A)` : GRADIENT,
                transform: `scale(${pressed ? 0.96 : 1})`,
                boxShadow: submitted ? `0 0 40px ${C.success}55` : "0 0 40px rgba(99,102,241,0.35)",
              }}
            >
              {submitted ? (
                <>
                  <CheckIcon size={38} color="#FFFFFF" /> Submitted
                </>
              ) : (
                "Submit application"
              )}
            </div>
          </Card>
          <Cursor x={cx} y={cy} pressed={pressed} />
        </AbsoluteFill>

        {/* Phase 2 */}
        <AbsoluteFill style={{ opacity: phase2, padding: `130px ${CONTENT_X}px 0` }}>
          <div style={{ fontSize: 24, letterSpacing: 4, fontWeight: 700, color: C.muted }}>APPLICATION TRACKER</div>
          <div style={{ position: "relative", marginTop: 26, display: "flex", gap: 40, height: 420 }}>
            {["Autofilled", "Submitted"].map((col) => (
              <div
                key={col}
                style={{
                  width: COL_W,
                  borderRadius: 18,
                  border: `1px dashed ${C.border}`,
                  background: "rgba(18,21,28,0.6)",
                  padding: "22px 22px",
                }}
              >
                <div style={{ fontSize: 26, fontWeight: 700, color: col === "Submitted" ? C.success : C.muted }}>{col}</div>
              </div>
            ))}
            <Card
              style={{
                position: "absolute",
                top: 84,
                left: 22 + slide * (COL_W + 40),
                width: COL_W - 44,
                padding: "22px 24px",
                border: `1px solid ${slide > 0.99 ? C.success + "88" : C.border}`,
              }}
            >
              <div style={{ fontSize: 26, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>Associate Consultant – Analytics</div>
              <div style={{ marginTop: 6, fontSize: 21, color: C.muted }}>Northwind Analytics</div>
              <div
                style={{
                  marginTop: 16,
                  display: "inline-block",
                  padding: "5px 12px",
                  borderRadius: 8,
                  fontSize: 19,
                  fontWeight: 700,
                  color: slide > 0.99 ? C.success : C.muted,
                  background: slide > 0.99 ? `${C.success}22` : C.bg,
                }}
              >
                {slide > 0.99 ? "Human-confirmed" : "Awaiting your review"}
              </div>
            </Card>
          </div>
          <Card style={{ marginTop: 34, padding: "26px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", ...rise(tile) }}>
            <span style={{ fontSize: 30, fontWeight: 700, color: C.text }}>Human-confirmed submissions</span>
            <span style={{ fontSize: 64, fontWeight: 800, color: C.success, fontVariantNumeric: "tabular-nums" }}>{confirmed}</span>
          </Card>
        </AbsoluteFill>
      </PushIn>
      <Caption lines={["Recruiters can spot a bot."]} from={100} to={170} />
      <Caption lines={["They can't spot a", "well-prepared human."]} from={172} to={dur} />
    </>
  );
};

/* ================================================================== */
/* 7. CLOSE  (0:52-1:00)                                               */
/* ================================================================== */
const StatRow: React.FC<{ big: string; label: string; delay: number; color?: string }> = ({ big, label, delay, color }) => {
  const p = useEnter(delay, 18);
  return (
    <Card style={{ padding: "24px 32px", display: "flex", alignItems: "baseline", gap: 22, ...rise(p) }}>
      <span style={{ fontSize: 60, fontWeight: 800, color: color ?? C.text, fontVariantNumeric: "tabular-nums", letterSpacing: -1.5 }}>
        {big}
      </span>
      <span style={{ fontSize: 30, fontWeight: 600, color: C.muted }}>{label}</span>
    </Card>
  );
};

export const CloseScene: React.FC<SceneProps> = ({ dur, p }) => {
  const frame = useCurrentFrame();
  const phase1 = interpolate(frame, [146, 160], [1, 0], clamp);
  // Final line is fully in by frame 178 and then held, unchanged, for the last 60 frames.
  const finalIn = interpolate(frame, [158, 178], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const name = useEnter(58, 18);
  const byline = useEnter(72, 18);
  const stats: { big: string; label: string; color?: string }[] = [];
  if (hasTimes(p)) stats.push({ big: `${p.manualMinutes} min → ${p.toolSeconds} s`, label: "per application" });
  stats.push({ big: "725", label: "job posts read" });
  stats.push({ big: "0", label: "auto-submits", color: C.success });

  return (
    <PushIn durationInFrames={dur}>
      <AbsoluteFill style={{ opacity: phase1, padding: `0 ${CONTENT_X}px`, justifyContent: "center", gap: 22 }}>
        {stats.map((s, i) => (
          <StatRow key={s.label} big={s.big} label={s.label} color={s.color} delay={6 + i * 12} />
        ))}
        <div style={{ marginTop: 34 }}>
          {p.productName.trim() ? (
            <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -3, ...gradientText, ...rise(name) }}>{p.productName}</div>
          ) : null}
          <div style={{ marginTop: 10, fontSize: 32, fontWeight: 600, color: C.text, ...rise(byline) }}>
            Built by Ayush Tanwar <span style={{ color: C.muted }}>· final-year CSE (Data Science)</span>
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: finalIn,
          padding: `0 ${CONTENT_X}px`,
          justifyContent: "center",
          transform: `translateY(${interpolate(finalIn, [0, 1], [20, 0])}px)`,
        }}
      >
        <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.12, letterSpacing: -2.5, color: C.text }}>
          Would you trust a tool
          <br />
          that applies <span style={gradientText}>FOR you</span> —
          <br />
          or one that makes
          <br />
          <span style={gradientText}>YOU faster?</span>
        </div>
        <div style={{ marginTop: 44, fontSize: 28, fontWeight: 600, color: C.muted }}>
          Ayush Tanwar · final-year CSE (Data Science)
        </div>
      </AbsoluteFill>
    </PushIn>
  );
};
