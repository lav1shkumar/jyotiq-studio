import React from "react";
import { Img, staticFile } from "remotion";
import { CINZEL, JAKARTA, PLAYFAIR, ROZHA } from "../../manthan/graphics";
import { P, ramp, track } from "../../manthan/style";
import { PILL } from "./endD";

/* Shared hook plate and series title for Diwali Days 2-5, in Day 1's exact style (d1/gfxD1.tsx HookPlateD1 and
   TitleCardD1). Day 1 review lessons built in: the plate is fully gone by `out` (the end of the hook), so it never
   sits under the title; the title has its own dark plate, and every text above a plate is position: relative. */

export const HookPlate: React.FC<{
  f: number;
  out: number;
  l1: React.ReactNode;
  l2: React.ReactNode;
  l2Size?: number;
  glow?: number; // 0..1, extra warm glow on line 2
  top?: number;
  children?: React.ReactNode; // the chip row
}> = ({ f, out, l1, l2, l2Size = 92, glow = 0, top = 640, children }) => {
  if (f > out) return null;
  const o = 1 - ramp(f, out - 8, out, "in");
  const settle = track(f, [[0, 1.04], [10, 1.0, "out"]]);
  return (
    <div style={{ position: "absolute", left: 0, top, width: 1080, display: "flex", flexDirection: "column", alignItems: "center", opacity: o }}>
      <div style={{ position: "absolute", left: 40, top: -40, width: 1000, height: 440, borderRadius: 220, background: "radial-gradient(ellipse at center, rgba(22,8,6,0.86) 0%, rgba(22,8,6,0.62) 55%, rgba(22,8,6,0) 100%)" }} />
      <div style={{ position: "relative", fontFamily: ROZHA, fontSize: 78, lineHeight: 1.12, color: "#F6EBD6", transform: `scale(${settle})`, textShadow: "0 0 26px rgba(20,8,4,0.9), 0 5px 0 #1A0A06", whiteSpace: "nowrap" }}>
        {l1}
      </div>
      <div
        style={{
          position: "relative", fontFamily: ROZHA, fontSize: l2Size, lineHeight: 1.14, marginTop: 4, color: "#FFD36B", transform: `scale(${settle})`, whiteSpace: "nowrap",
          textShadow: `0 0 ${34 + 30 * glow}px rgba(255,201,77,${0.6 + 0.35 * glow}), 0 6px 0 #4A2A08, 0 0 18px rgba(20,8,4,0.95), 0 6px 0 #1A0A06`,
        }}
      >
        {l2}
      </div>
      {children ? <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 22, marginTop: 34, height: 110 }}>{children}</div> : null}
    </div>
  );
};

/** A pill in the hook row. It holds its place in the layout from frame 0 (no reflow) and pops in at `at`. */
export const HookChip: React.FC<{ f: number; at: number; children: React.ReactNode }> = ({ f, at, children }) => {
  const c = ramp(f, at - 2, at + 6, "out");
  const pop = track(f - at + 2, [[0, 0.7], [6, 1.1, "out"], [10, 1, "io"]]);
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12, padding: "10px 28px 12px", borderRadius: 50, ...PILL, opacity: c, transform: `scale(${c > 0 ? pop : 0.7})` }}>
      {children}
    </div>
  );
};

/** The '?' pill: at rest from frame 0, it pops at `at` (the spoken 'क्यों') and keeps pulsing. */
export const QPill: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const q = ramp(f, at, at + 8, "out");
  const pop = track(f - at, [[0, 1], [6, 1.22, "out"], [10, 1.1, "io"]]);
  const pulse = (q > 0 ? pop : 1) * (1 + q * 0.05 * Math.sin(f / 3));
  return (
    <div
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", width: 112, height: 88, borderRadius: 50, ...PILL,
        border: `${3 + q}px solid rgba(255,201,77,${0.7 + 0.3 * q})`,
        boxShadow: `0 0 ${12 + 30 * q}px rgba(255,201,77,${0.25 + 0.5 * q})`,
        transform: `scale(${pulse})`,
      }}
    >
      <span style={{ fontFamily: CINZEL, fontWeight: 900, fontSize: 62, color: "#FFD36B" }}>?</span>
    </div>
  );
};

/** The series title on its own dark plate: Jyotiq presents · पाँच दीये · PAANCH DIYE · DIN n · <hi> · <en>. */
export const SeriesTitle: React.FC<{ f: number; at: number; out: number; din: number; hi: string; en: string; top?: number }> = ({
  f, at, out, din, hi, en, top = 300,
}) => {
  const t = f - at;
  if (t < -2 || f > out + 10) return null;
  const a = ramp(t, 0, 6, "out");
  const b = ramp(t, 2, 10, "out");
  const c = ramp(t, 6, 14, "out");
  const o = 1 - ramp(f, out - 6, out + 10, "in");
  const push = 1 + 0.03 * ramp(f, at, out + 10, "lin");
  return (
    <div style={{ position: "absolute", left: 0, top, width: 1080, opacity: o, display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${push})` }}>
      <div style={{ position: "absolute", left: 20, top: -70, width: 1040, height: 640, borderRadius: 320, background: "radial-gradient(ellipse at center, rgba(14,10,32,0.88) 0%, rgba(14,10,32,0.66) 55%, rgba(14,10,32,0) 100%)" }} />
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16, opacity: a, marginBottom: 20 }}>
        <Img src={staticFile("jyotiq/logo-icon.png")} style={{ width: 84, height: 70, objectFit: "contain" }} />
        <div style={{ fontFamily: PLAYFAIR, fontWeight: 600, fontSize: 38, color: P.jGoldLight, letterSpacing: 4 }}>Jyotiq presents</div>
      </div>
      <div style={{ position: "relative", fontFamily: ROZHA, fontSize: 176, lineHeight: 1, color: "#FFD36B", opacity: b, transform: `scale(${0.88 + 0.12 * b})`, textShadow: "0 0 40px rgba(255,201,77,0.55), 0 8px 0 #5A3208" }}>पाँच दीये</div>
      <div style={{ position: "relative", fontFamily: CINZEL, fontWeight: 900, fontSize: 60, letterSpacing: 16, color: "#F6EBD6", opacity: b, marginTop: 8 }}>PAANCH DIYE</div>
      <div style={{ position: "relative", width: 520 * c, height: 3, background: `linear-gradient(90deg, transparent, ${P.gold}, transparent)`, margin: "22px 0" }} />
      <div style={{ position: "relative", fontFamily: JAKARTA, fontWeight: 700, fontSize: 38, color: P.jGoldLight, opacity: c, letterSpacing: 2, whiteSpace: "nowrap" }}>
        DIN {din} · <span style={{ fontFamily: ROZHA, fontWeight: 400, fontSize: 48 }}>{hi}</span> · {en}
      </div>
      <div style={{ position: "relative", fontFamily: JAKARTA, fontWeight: 600, fontSize: 34, color: "#F3DB9D", opacity: c, marginTop: 12 }}>Diwali ke 5 din, 5 raaz</div>
    </div>
  );
};

/** A centred pill chip that pops in at `at` and fades by `out` (Day 1's ChipD1). */
export const Chip: React.FC<{ f: number; at: number; out: number; top: number; children: React.ReactNode; border?: string }> = ({
  f, at, out, top, children, border = "rgba(255,211,107,0.9)",
}) => {
  const t = f - at;
  if (t < 0 || f > out + 8) return null;
  const o = ramp(t, 0, 6, "out") * (1 - ramp(f, out - 4, out + 8, "in"));
  const pop = track(t, [[0, 0.7], [6, 1.1, "out"], [10, 1, "io"]]);
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top, display: "flex", justifyContent: "center", opacity: o }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 28px 11px", borderRadius: 40, ...PILL, border: `2.5px solid ${border}`, boxShadow: "0 0 24px rgba(255,211,107,0.4)", transform: `scale(${pop})` }}>
        {children}
      </div>
    </div>
  );
};

export const ChipText: React.FC<{ children: React.ReactNode; gold?: boolean; size?: number }> = ({ children, gold, size = 46 }) => (
  <span style={{ fontFamily: ROZHA, fontSize: size, lineHeight: 1.1, color: gold ? "#FFD36B" : "#FFF6E4" }}>{children}</span>
);
