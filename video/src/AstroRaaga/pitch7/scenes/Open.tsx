import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { openCam7, PlanetId, PLANETS, planetPos, project } from "../cam";
import { Cosmos } from "../Cosmos";
import { easeInOut, KARLA, line, MARCELLUS, prog, sc, word } from "../theme";
import { Accent, asset, Icon, In, Label, useWinT } from "../ui";

const Chip: React.FC<{ icon: string; children: React.ReactNode }> = ({ icon, children }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "14px 24px", borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,220,170,0.28)", color: "#FFEFD9", fontFamily: KARLA, fontWeight: 600, fontSize: 25, backdropFilter: "blur(12px)" }}>
    <Icon name={icon} size={24} color="#FDBA74" />
    {children}
  </div>
);

/** Welcome: the Sun grows behind the AstroRaaga planet; "Welcome to the world of AstroRaaga". */
void [easeInOut];
export const Open: React.FC = () => {
  const t = useWinT();
  const l1 = line("welcome_1");
  const tEco = word("welcome_2", "intelligent");
  // v7: the Sun is there from frame 1; the camera pulls back to the solar system (openCam7)
  const cam = openCam7(t);
  const [px, py] = project(cam, [0, 0, 0]);
  // the hand-over to the light mela: the sun floods the frame with warm light
  const flood = prog(t, sc("mission").start - 1.1, 1.1, easeInOut);
  return (
    <AbsoluteFill>
      <Cosmos mode="open" />
      {/* v7: the planet colour system, named once (Amit sir) */}
      {(Object.keys(PLANETS) as PlanetId[]).map((id, i) => {
        void PLANETS[id];
        const tl = 5.8 + 1.45 * i;
        const [x, y, z] = project(cam, planetPos(id, t));
        // each label in turn, so they never crowd each other
        const op = prog(t, tl, 0.45) * (1 - prog(t, tl + 1.35, 0.45));
        if (op <= 0 || z > 1) return null;
        const TAG: Record<PlanetId, [string, string, string]> = {
          mercury: ["Mercury", "money · JyotiQ", "#86EFAC"],
          jupiter: ["Jupiter", "wisdom · KarmEQ", "#FCD34D"],
          saturn: ["Saturn", "discipline · team", "#A5B4FC"],
          rahu: ["Rahu", "AI & intelligence", "#C4B5FD"],
          ketu: ["Ketu", "spirituality", "#FFF4D6"],
        };
        const [name, role, col] = TAG[id];
        return (
          <div key={id} style={{ position: "absolute", left: x, top: y + 26, transform: "translateX(-50%)", opacity: op * 0.92, textAlign: "center", whiteSpace: "nowrap" }}>
            <div style={{ fontFamily: KARLA, fontWeight: 700, fontSize: 21, letterSpacing: "0.14em", textTransform: "uppercase", color: col }}>{name}</div>
            <div style={{ fontFamily: KARLA, fontSize: 18, color: "rgba(255,240,220,0.75)" }}>{role}</div>
          </div>
        );
      })}
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(5,4,10,0.82) 0%, rgba(5,4,10,0.55) 38%, rgba(5,4,10,0) 62%)", opacity: prog(t, l1.start - 0.4, 1.2) }} />
      <div style={{ position: "absolute", left: 150, top: 270, width: 800 }}>
        <In t0={l1.start - 0.1} dur={1.0} dy={20}>
          <Label light>Welcome to the world of</Label>
        </In>
        <In t0={word("welcome_1", "astroraaga") - 0.2} dur={1.1} dy={24} style={{ marginTop: 30 }}>
          <Img src={asset("brand/logo_white_4x.png")} style={{ width: 600 }} />
        </In>
        <In t0={tEco - 0.15} dur={0.9} style={{ marginTop: 40 }}>
          <div style={{ fontFamily: MARCELLUS, fontSize: 58, lineHeight: 1.14, color: "#FFF4E2", whiteSpace: "nowrap" }}>
            The Intelligent
            <br />
            <Accent light>Human Guidance</Accent> Ecosystem
          </div>
        </In>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 40 }}>
          <In t0={word("welcome_2", "ancient") - 0.1} dur={0.7} dy={16}>
            <Chip icon="spark">Ancient wisdom</Chip>
          </In>
          <In t0={word("welcome_2", "technology") - 0.3} dur={0.7} dy={16}>
            <Chip icon="bolt">Intelligent technology</Chip>
          </In>
          <In t0={word("welcome_2", "trusted") - 0.1} dur={0.7} dy={16}>
            <Chip icon="shield">Trusted human experts</Chip>
          </In>
        </div>
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 60% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none" }} />
      {flood > 0 && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at ${px - 120}px ${py - 140}px, #FFFDF6 0%, #FFF3D6 ${18 + 50 * flood}%, rgba(255,236,200,${flood}) ${40 + 60 * flood}%, rgba(255,250,241,${flood}) 100%)`,
            opacity: Math.min(1, flood * 1.6),
          }}
        />
      )}
    </AbsoluteFill>
  );
};
