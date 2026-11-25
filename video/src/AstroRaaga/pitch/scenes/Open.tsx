import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { openCam, openPlanetPx, project } from "../cam";
import { Cosmos } from "../Cosmos";
import { C, clamp01, KARLA, line, MARCELLUS, prog, word } from "../theme";
import { Accent, asset, Icon, In, Label, TypeText, useWinT } from "../ui";

const Chip: React.FC<{ icon: string; children: React.ReactNode }> = ({ icon, children }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: "14px 24px",
      borderRadius: 999,
      background: "rgba(255,255,255,0.08)",
      border: "1.5px solid rgba(255,220,170,0.28)",
      color: "#FFEFD9",
      fontFamily: KARLA,
      fontWeight: 600,
      fontSize: 25,
      backdropFilter: "blur(12px)",
    }}
  >
    <Icon name={icon} size={24} color="#FDBA74" />
    {children}
  </div>
);

export const Open: React.FC = () => {
  const t = useWinT();
  const s1 = line("s01");
  const s2 = line("s02");
  // the first light: a warm point that becomes the planet
  const cam = openCam(t);
  const [px, py] = project(cam, [0, 0, 0]);
  // the point of light hands over to the planet as the planet grows (by its size on screen, not a fixed time)
  const rpx = openPlanetPx(t);
  const hand = clamp01((rpx - 12) / 44);
  const glow = (1 - hand * hand * (3 - 2 * hand)) * prog(t, 0.1, 1.2);
  const pulse = (1 + 0.06 * Math.sin(t * 3.1)) * (1 + Math.max(0, rpx - 8) / 30);
  const textOut = prog(t, s1.end + 0.5, 0.6);
  return (
    <AbsoluteFill>
      <Cosmos mode="open" />
      {/* first light */}
      <div
        style={{
          position: "absolute",
          left: px - 260,
          top: py - 260,
          width: 520,
          height: 520,
          borderRadius: "50%",
          opacity: glow,
          transform: `scale(${pulse})`,
          background: "radial-gradient(circle, rgba(255,248,230,1) 0%, rgba(255,214,150,0.85) 4%, rgba(245,158,11,0.35) 14%, rgba(234,88,12,0.08) 34%, rgba(0,0,0,0) 62%)",
          mixBlendMode: "screen",
        }}
      />
      {/* hook */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 690,
          textAlign: "center",
          fontFamily: MARCELLUS,
          fontSize: 66,
          color: "#FFF4E2",
          opacity: prog(t, s1.start - 0.2, 0.4) * (1 - textOut),
          filter: textOut > 0 ? `blur(${textOut * 10}px)` : undefined,
          letterSpacing: "0.005em",
        }}
      >
        <TypeText text="Every big decision begins with " t={t} t0={s1.start} cps={30} caret={false} />
        {t > s1.start + 30 / 30 ? (
          <span>
            <Accent light>
              <TypeText text="one question." t={t} t0={s1.start + 31 / 30} cps={20} />
            </Accent>
          </span>
        ) : null}
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(5,4,10,0.82) 0%, rgba(5,4,10,0.55) 38%, rgba(5,4,10,0) 62%)", opacity: prog(t, s2.start - 0.3, 1.2) }} />
      {/* brand */}
      <div style={{ position: "absolute", left: 150, top: 290, width: 760 }}>
        <In t0={s2.start + 0.1} dur={1.0} dy={20}>
          <Label light>Investor preview</Label>
        </In>
        <In t0={s2.start + 0.3} dur={1.1} dy={24} style={{ marginTop: 34 }}>
          <Img src={asset("brand/logo_white_4x.png")} style={{ width: 600 }} />
        </In>
        <In t0={word("s02", "intelligent") - 0.15} dur={0.9} style={{ marginTop: 40 }}>
          <div style={{ fontFamily: MARCELLUS, fontSize: 60, lineHeight: 1.14, color: "#FFF4E2", whiteSpace: "nowrap" }}>
            The Intelligent
            <br />
            <Accent light>Human Guidance</Accent> Ecosystem
          </div>
        </In>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 40 }}>
          <In t0={word("s02", "ancient") - 0.1} dur={0.7} dy={16}>
            <Chip icon="spark">Ancient wisdom</Chip>
          </In>
          <In t0={word("s02", "technology") - 0.35} dur={0.7} dy={16}>
            <Chip icon="bolt">Intelligent technology</Chip>
          </In>
          <In t0={word("s02", "trusted") - 0.1} dur={0.7} dy={16}>
            <Chip icon="shield">Trusted experts</Chip>
          </In>
        </div>
      </div>
      {/* vignette */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 60% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none" }} />
      <AbsoluteFill style={{ background: C.space, opacity: 1 - clamp01(t / 0.6) }} />
    </AbsoluteFill>
  );
};

/** Screen position of the AstroRaaga planet at the end of the opening (for the light-burst reveal). */
export const openPlanetXY = (t: number) => {
  const [x, y] = project(openCam(t), [0, 0, 0]);
  return { x, y };
};
