import React from "react";
import { Img, staticFile } from "remotion";
import { BAND, C, CORMORANT, H, ramp, sparkle, W } from "./style";

/* Picture frame + on-screen type: painted border, caption card, Jyotiq tab,
   app badge and a paper grain over the picture. */

export const Border: React.FC = () => {
  const B = BAND;
  const motifs: { x: number; y: number; k: number }[] = [];
  const nx = 20;
  for (let i = 1; i < nx; i++) {
    const x = 25 + (i * (W - 50)) / nx;
    motifs.push({ x, y: 25, k: i }, { x, y: H - 25, k: i });
  }
  const ny = 36;
  for (let i = 1; i < ny; i++) {
    const y = 25 + (i * (H - 50)) / ny;
    motifs.push({ x: 25, y, k: i }, { x: W - 25, y, k: i });
  }
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <g id="kRosette">
          {new Array(8).fill(0).map((_, i) => (
            <ellipse key={i} cy={-7.5} rx={3.6} ry={6.5} transform={`rotate(${i * 45})`} fill="#E2B04A" />
          ))}
          <circle r={3.8} fill="#F6D88A" stroke="#A9741F" strokeWidth={1} />
        </g>
        <path id="kStar" d={sparkle(11)} fill="#F2C861" />
      </defs>
      <path fillRule="evenodd" d={`M0 0H${W}V${H}H0Z M${B} ${B}V${H - B}H${W - B}V${B}Z`} fill={C.band} />
      <rect x={7} y={7} width={W - 14} height={H - 14} fill="none" stroke={C.gold} strokeWidth={2.5} />
      <rect x={B - 4} y={B - 4} width={W - 2 * B + 8} height={H - 2 * B + 8} fill="none" stroke={C.gold} strokeWidth={4} />
      <rect x={B} y={B} width={W - 2 * B} height={H - 2 * B} fill="none" stroke="#3A0E12" strokeWidth={2} />
      {motifs.map((m, i) => (
        <use key={i} href={m.k % 2 ? "#kStar" : "#kRosette"} x={m.x} y={m.y} />
      ))}
      {[
        [25, 25],
        [W - 25, 25],
        [25, H - 25],
        [W - 25, H - 25],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(1.5)`}>
          <use href="#kRosette" />
        </g>
      ))}
    </svg>
  );
};

export type Cue = { from: number; to: number; text: string };

/** Parchment caption card; the card enters once, lines cross-fade inside it. */
export const CaptionCard: React.FC<{ f: number; cues: Cue[] }> = ({ f, cues }) => {
  const start = cues[0].from;
  const pop = ramp(f, start, start + 10, "back");
  const op = ramp(f, start, start + 6, "out");
  return (
    <div
      style={{
        position: "absolute",
        left: 140,
        top: 1500,
        width: 800,
        height: 162,
        opacity: op,
        transform: `translateY(${(1 - pop) * 28}px) scale(${0.94 + 0.06 * pop})`,
        transformOrigin: "50% 100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: C.paper,
          borderRadius: 16,
          boxShadow: "0 10px 22px rgba(58,22,7,0.38)",
        }}
      />
      <div style={{ position: "absolute", inset: 9, border: `2.5px solid ${C.paperEdge}`, borderRadius: 10 }} />
      <div style={{ position: "absolute", inset: 15, border: `1px solid ${C.paperEdge}`, borderRadius: 7, opacity: 0.75 }} />
      {[1, 781].map((x) => (
        <div
          key={x}
          style={{ position: "absolute", left: x, top: 72, width: 18, height: 18, background: C.paperEdge, transform: "rotate(45deg)" }}
        />
      ))}
      {cues.map((c, i) => {
        const o = ramp(f, c.from, c.from + 8, "out") * (1 - ramp(f, c.to - 6, c.to, "in"));
        if (o <= 0.001) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: "0 48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              whiteSpace: "pre-line",
              fontFamily: CORMORANT,
              fontWeight: 700,
              fontSize: 47,
              lineHeight: 1.14,
              color: C.text,
              opacity: o,
              transform: `translateY(${(1 - ramp(f, c.from, c.from + 10, "out")) * 10}px)`,
            }}
          >
            {c.text}
          </div>
        );
      })}
    </div>
  );
};

/** Jyotiq name plate on the bottom border: an indigo arch, not a flat bar. */
export const BrandTab: React.FC = () => (
  <div style={{ position: "absolute", left: 390, top: 1834, width: 300, height: 86 }}>
    <svg width={300} height={86} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <path
        d="M2 86V42Q2 26 18 24Q120 16 150 2Q180 16 282 24Q298 26 298 42V86Z"
        fill="#1E1446"
        stroke={C.gold}
        strokeWidth={3}
        style={{ filter: "drop-shadow(0 -3px 6px rgba(0,0,0,0.35))" }}
      />
      <path d="M12 86V45Q12 33 24 32Q122 25 150 13Q178 25 276 32Q288 33 288 45V86" fill="none" stroke={C.gold} strokeWidth={1.2} opacity={0.7} />
      <path d={sparkle(8)} transform="translate(214 44)" fill="#F2C861" />
    </svg>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 26,
        textAlign: "center",
        fontFamily: CORMORANT,
        fontStyle: "italic",
        fontWeight: 500,
        fontSize: 48,
        lineHeight: 1,
        color: "#F6D88A",
        letterSpacing: 1,
      }}
    >
      Jyotiq
    </div>
  </div>
);

/** The app icon, like a channel badge in the sky corner. */
export const AppBadge: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 912,
      top: 78,
      width: 98,
      height: 98,
      borderRadius: 22,
      background: "radial-gradient(circle at 50% 38%, #2A1D57 0%, #0E0920 75%)",
      border: `2.5px solid ${C.gold}`,
      boxShadow: "0 6px 14px rgba(20,10,40,0.35)",
      overflow: "hidden",
    }}
  >
    <Img src={staticFile("jyotiq/logo-icon.png")} style={{ position: "absolute", left: 6, top: 10, width: 86, height: 74, objectFit: "contain" }} />
  </div>
);

/** Paper grain over the picture area. */
export const Grain: React.FC = () => (
  <svg
    width={W}
    height={H}
    style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", opacity: 0.1, pointerEvents: "none" }}
  >
    <filter id="kGrain">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={2} seed={7} stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect x={BAND} y={BAND} width={W - 2 * BAND} height={H - 2 * BAND} filter="url(#kGrain)" />
  </svg>
);
