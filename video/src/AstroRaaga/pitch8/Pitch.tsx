import React from "react";
import { AbsoluteFill, Audio, Img, useCurrentFrame } from "remotion";
import { HubBoard } from "./scenes/Hub";
import { MissionBoard, ProblemBoard, WhyBoard } from "./scenes/Boards1";
import { GtmBoard, MarketBoard, ModelBoard, RoadmapBoard } from "./scenes/Boards2";
import { GoalsBoard, SegmentBoard } from "./scenes/Boards4";
import { AskBoard, CompeteBoard, MoatBoard, TeamBoard, TractionBoard } from "./scenes/Boards3";
import { Open } from "./scenes/Open";
import { C, Cur, easeInOut, easeSoft, FPS, KARLA, line, prog, sc, SegLayout, setCur, setSeg, vo, word } from "./theme";
import { Accent, asset, Headline, Label, SECTIONS, Win } from "./ui";
import { BoardDef, World } from "./MelaMap";

const boards = (): BoardDef[] => {
  const end = (id: string) => sc(id).end;
  return [
    { id: "mission", open: "mission", freeze: end("mission"), render: () => <MissionBoard /> },
    { id: "team", open: "team", freeze: end("team"), render: () => <TeamBoard /> },
    { id: "problem", open: "problem", freeze: end("problem"), render: () => <ProblemBoard /> },
    { id: "why", open: "why", freeze: end("why"), render: () => <WhyBoard /> },
    { id: "hub", open: "solution", freeze: vo().total + 1, render: () => <HubBoard /> },
    { id: "segment", open: "segment", freeze: end("segment"), render: () => <SegmentBoard /> },
    { id: "goals", open: "goals", freeze: end("goals"), render: () => <GoalsBoard /> },
    { id: "market", open: "market", freeze: end("market"), render: () => <MarketBoard /> },
    { id: "gtm", open: "gtm", freeze: end("gtm"), render: () => <GtmBoard /> },
    { id: "model", open: "model", freeze: end("model") + 30, render: () => <ModelBoard /> },
    { id: "roadmap", open: "roadmap", freeze: end("roadmap"), render: () => <RoadmapBoard /> },
    { id: "traction", open: "traction", freeze: end("traction"), render: () => <TractionBoard /> },
    { id: "compete", open: "compete", freeze: end("compete"), render: () => <CompeteBoard /> },
    { id: "moat", open: "moat", freeze: end("moat"), render: () => <MoatBoard /> },
    { id: "ask", open: "ask", freeze: vo().total + 1, render: () => <AskBoard /> },
  ];
};

/* screen-space captions over the wide shots of the mela */
const Caption: React.FC<{ t: number; a: number; b: number; label: string; children: React.ReactNode; sub?: React.ReactNode }> = ({ t, a, b, label, children, sub }) => {
  const pin = prog(t, a, 1.0, easeSoft);
  const pout = prog(t, b, 0.7, easeSoft);
  const p = pin * (1 - pout);
  if (p <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: 120, opacity: p, transformOrigin: "0% 0%", transform: `translateY(${(1 - pin) * 8}px) scale(${(0.9 + 0.1 * pin) * (1 + 0.05 * pout)})` }}>
      <div style={{ padding: "30px 40px 32px", borderRadius: 28, background: "rgba(255,250,241,0.88)", border: `1.5px solid ${C.goldHair}`, boxShadow: "0 24px 60px rgba(124,45,18,0.12)", backdropFilter: "blur(10px)" }}>
        <Label>{label}</Label>
        <div style={{ marginTop: 14 }}>{children}</div>
        {sub && <div style={{ marginTop: 16 }}>{sub}</div>}
      </div>
    </div>
  );
};

const Overlays: React.FC = () => {
  const t = useCurrentFrame() / FPS;


  const tAsk = line("ask_2").end;
  const chip = (txt: string, t0: number) => (
    <div style={{ opacity: prog(t, t0, 0.5), display: "inline-flex", padding: "10px 18px", borderRadius: 999, background: C.card, border: `1.5px solid ${C.goldHair}`, fontFamily: KARLA, fontWeight: 700, fontSize: 24, color: C.ink, marginRight: 12 }}>{txt}</div>
  );
  return (
    <>
      <Caption t={t} a={word("mela_1", "giant") - 0.25} b={sc("problem").start - 0.5} label="03 · The market today"
        sub={
          <div>
            {chip("Millions of seekers", word("mela_2", "millions") - 0.1)}
            {chip("Thousands of advisors", word("mela_2", "thousands") - 0.1)}
            <div style={{ marginTop: 14, fontFamily: KARLA, fontWeight: 700, fontSize: 22, color: C.saffronDeep, opacity: prog(t, word("mela_2", "grows") - 0.15, 0.5) }}>And it grows every single day.</div>
          </div>
        }>
        <Headline size={76}>
          A giant <Accent>mela</Accent>.
        </Headline>
      </Caption>
      <Caption t={t} a={word("solution_1", "connects") - 0.2} b={line("solution_2").start - 0.2} label="The solution">
        <Headline size={64}>
          One integrated <Accent>ecosystem</Accent>.
        </Headline>
      </Caption>
      <Caption t={t} a={tAsk + 0.9} b={sc("close").start - 0.1} label="Funding">
        <Headline size={56}>
          Light up the <Accent>whole mela</Accent>.
        </Headline>
      </Caption>
    </>
  );
};

const SECTION_OF: Record<string, number> = {
  welcome: 0, mission: 0, team: 1, mela: 2, problem: 2, why: 2, solution: 3, products: 3, segment: 4, goals: 5, market: 6, gtm: 7, model: 8, roadmap: 9, traction: 10, compete: 11, moat: 12, ask: 13, close: 13,
};

const Chrome: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const a = sc("mission").start + 0.6;
  const b = sc("close").start + 0.4;
  if (t < a - 0.2 || t > b + 0.6) return null;
  const order = Object.keys(vo().scenes);
  let active = 0;
  for (const s of order) if (t >= sc(s).start) active = SECTION_OF[s] ?? active;
  const fade = prog(t, a, 0.6) * (1 - prog(t, b, 0.6));
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      {/* v7 (Amit sir): the section timeline sits at the TOP, bigger; the active section bright, the rest dimmed */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 22, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "12px 30px", borderRadius: 999, background: "rgba(255,247,232,0.92)", border: `1.5px solid ${C.goldHair}`, boxShadow: "0 10px 30px rgba(124,45,18,0.08)", backdropFilter: "blur(8px)" }}>
          {SECTIONS.map((s, i) => {
            const on = i === active;
            return (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, opacity: on ? 1 : i < active ? 0.55 : 0.38 }}>
                <div style={{ width: on ? 11 : 7, height: on ? 11 : 7, borderRadius: 6, background: on ? C.saffron : i < active ? C.gold : "rgba(140,118,96,0.6)", boxShadow: on ? "0 0 14px rgba(234,88,12,0.75)" : undefined }} />
                <div style={{ fontFamily: KARLA, fontWeight: on ? 800 : 600, fontSize: on ? 25 : 18, letterSpacing: "0.03em", color: on ? C.ink : C.ink2, whiteSpace: "nowrap" }}>{s}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", right: 40, bottom: 28, display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", borderRadius: 999, background: "rgba(255,247,232,0.86)", border: `1px solid ${C.goldHair}`, opacity: 0.9 }}>
        <Img src={asset("brand/icon_4x.png")} style={{ height: 24 }} />
        <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 14, letterSpacing: "0.16em", color: C.ink2 }}>ASTRORAAGA · INVESTOR PREVIEW</div>
      </div>
    </AbsoluteFill>
  );
};

export const PitchV8: React.FC<{ cur: Cur; withAudio?: boolean; seg?: SegLayout }> = ({ cur, withAudio = false, seg = "stack" }) => {
  setCur(cur);
  setSeg(seg);
  const worldIn = sc("mission").start - 0.15;
  const f = useCurrentFrame() / FPS;
  const worldFade = prog(f, worldIn, 0.7, easeInOut);
  const B = React.useMemo(() => boards(), [cur, seg]);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Win a={0} b={worldIn + 0.8} name="welcome">
        <Open />
      </Win>
      <Win a={worldIn} b={vo().total + 1} name="mela">
        <AbsoluteFill style={{ opacity: worldFade }}>
          <World boards={B} />
        </AbsoluteFill>
      </Win>
      <Overlays />
      <Chrome />
      {withAudio && <Audio src={asset(`audio/v8_mix_${cur}.wav`)} />}
    </AbsoluteFill>
  );
};
