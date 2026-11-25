import React from "react";
import { AbsoluteFill, Freeze, useCurrentFrame } from "remotion";
import { AppBadge, BrandTab, Border, CaptionCard, Cue, Grain } from "./frame";
import { PATRI_CHART, Patri, Place, Pose, Puppet, REST, headToWorld, propToWorld } from "./puppet";
import { Crowd, Ground, Palace, SetDefs, Sky } from "./set";
import { BAND, CORMORANT, H, W, ramp, rnd, sparkle, track, wob } from "./style";

/* Style test for a Jyotiq "katha" (story) Reel: the Raj Jyotishi shows the
   king his janam patri. 1080x1920, 30 fps, 6 s. */

export const KATHA_FRAMES = 180;

const J_AT: Place = { x: 270, y: 1400, s: 1.16, facing: 1 };
const R_AT: Place = { x: 828, y: 1385, s: 1.22, facing: -1 };

const CUES: Cue[] = [
  { from: 4, to: 88, text: "Every king kept a Raj Jyotishi\nin his court." },
  { from: 88, to: 9999, text: "Before every big decision, he asked:\nwhat do my stars say?" },
];

/** Soft contact shadow on the sand under a puppet's feet. */
const FootShadow: React.FC<{ at: Place; w: number }> = ({ at, w }) => (
  <ellipse cx={at.x} cy={at.y + 272 * at.s} rx={w * at.s} ry={13 * at.s} fill="#7A3A12" opacity={0.2} />
);

/** 6-frame blink centred on each frame in `at`. */
const blinkAt = (f: number, at: number[]): number => Math.max(0, ...at.map((a) => 1 - Math.abs(f - a) / 3));

const jPose = (f: number): Pose => {
  const talking = f >= 100 && f <= 158;
  return {
    ...REST,
    lean: track(f, [[0, 1], [28, 1], [54, 5, "out"]]),
    head: track(f, [[0, -2], [30, -2], [54, -5]]) + (talking ? wob("jn", f / 6) * 2.2 : 0),
    sF: track(f, [[0, 8], [28, 8], [54, 64, "back"]]),
    eF: track(f, [[0, 12], [28, 12], [54, 38, "back"]]),
    wF: track(f, [[0, 0], [28, 0], [54, -10]]),
    sB: -6,
    eB: 16,
    bob: Math.sin(f / 13) * 1.6,
    sway: Math.sin(f / 21) * 0.6,
    blink: blinkAt(f, [46, 168]),
    talk: talking ? Math.max(0, wob("jt", f / 2.3)) : 0,
    lookX: 1,
    lookY: 0,
  };
};

const rPose = (f: number): Pose => {
  const twirl = f > 122 ? Math.sin((f - 122) / 4.5) * 7 * ramp(f, 122, 132) : 0;
  return {
    ...REST,
    lean: track(f, [[0, -2], [96, -2], [122, 3]]),
    head: track(f, [[0, 0], [60, 0], [78, 6]]),
    sF: track(f, [[0, 6], [96, 6], [122, 72, "out"]]),
    eF: track(f, [[0, 10], [96, 10], [122, 142, "out"]]),
    wF: track(f, [[0, 0], [96, 0], [122, 10]]) + twirl,
    sB: -20,
    eB: 70,
    bob: Math.sin(f / 15 + 1) * 1.4,
    sway: Math.sin(f / 24 + 2) * 0.5,
    blink: blinkAt(f, [34, 140]),
    brow: track(f, [[0, 0], [108, 0], [116, 1, "back"], [150, 1], [170, 0.4]]),
    lookX: track(f, [[0, 1], [58, 1], [72, 0.4]]),
    lookY: track(f, [[0, 0], [58, 0], [72, 0.9]]),
  };
};

const cubic = (p0: number[], p1: number[], p2: number[], p3: number[], t: number): [number, number] => {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
};

/** Gold "star-thread" from the kundali to the king, then a sparkle burst. */
const Magic: React.FC<{ f: number; from: [number, number]; to: [number, number] }> = ({ f, from, to }) => {
  const [sx, sy] = from;
  const [tx, ty] = to;
  const lanes = [
    { c1: [sx - 30, sy - 170], c2: [tx - 200, ty + 50], w: 6, col: "#F6D78A", d: 0 },
    { c1: [sx + 100, sy - 50], c2: [tx - 50, ty + 170], w: 3.5, col: "#FFF8E6", d: 5 },
    { c1: [sx + 10, sy - 240], c2: [tx - 130, ty - 50], w: 4.5, col: "#F2A33A", d: 9 },
  ];
  const seg = 0.34;
  const burst = ramp(f, 120, 142, "out");
  return (
    <g>
      {/* rising gold dust off the chart */}
      {new Array(16).fill(0).map((_, i) => {
        const born = 92 + i * 5;
        const age = (f - born) / 46;
        if (age < 0 || age > 1) return null;
        const x = sx + (rnd(`dx${i}`) - 0.5) * 120 + wob(`dw${i}`, f / 9) * 10;
        const y = sy + 30 - age * 150;
        return <circle key={i} cx={x} cy={y} r={1.6 + rnd(`dr${i}`) * 2.4} fill="#FFE9A8" opacity={Math.sin(age * Math.PI) * 0.9} />;
      })}
      {lanes.map((l, i) => {
        const pr = ramp(f, 90 + l.d, 120 + l.d, "io");
        if (pr <= 0 || pr >= 1) return null;
        const p = pr * (1 + seg);
        const d = `M${sx} ${sy}C${l.c1[0]} ${l.c1[1]} ${l.c2[0]} ${l.c2[1]} ${tx} ${ty}`;
        return (
          <g key={i}>
            <path d={d} fill="none" stroke={l.col} strokeWidth={l.w} strokeLinecap="round" pathLength={1} strokeDasharray={`${seg} 2`} strokeDashoffset={seg - p} opacity={0.95} />
            {[0, 1, 2, 3].map((j) => {
              const t = p - j * 0.07;
              if (t < 0 || t > 1) return null;
              const [x, y] = cubic([sx, sy], l.c1, l.c2, [tx, ty], t);
              const r = (j === 0 ? 13 : 8 - j) * (0.8 + 0.2 * Math.sin(f / 2 + j));
              return <path key={j} d={sparkle(r)} transform={`translate(${x} ${y}) rotate(${f * 6 + j * 30})`} fill={j === 0 ? "#FFFFFF" : "#FFE39A"} />;
            })}
          </g>
        );
      })}
      {burst > 0 && burst < 1 ? (
        <g opacity={1 - burst}>
          <circle cx={tx} cy={ty} r={14 + burst * 70} fill="none" stroke="#FFE39A" strokeWidth={4 * (1 - burst) + 1} />
          {new Array(10).fill(0).map((_, i) => {
            const a = (i / 10) * Math.PI * 2 + 0.3;
            const r = 20 + burst * 90;
            return <path key={i} d={sparkle(9 - burst * 4)} transform={`translate(${tx + Math.cos(a) * r} ${ty + Math.sin(a) * r})`} fill="#FFF3C4" />;
          })}
        </g>
      ) : null}
    </g>
  );
};

export const KathaTest: React.FC<{ uid?: string }> = ({ uid = "k" }) => {
  const f = useCurrentFrame();
  const jp = jPose(f);
  const rp = rPose(f);

  const unroll = ramp(f, 50, 70, "out");
  const draw = ramp(f, 62, 92, "lin");
  const glyphs = ramp(f, 80, 100, "lin");
  const glow = ramp(f, 86, 100, "out") * (0.75 + 0.25 * Math.sin(f / 5));

  const chartC: [number, number] = [PATRI_CHART.x + PATRI_CHART.s / 2, PATRI_CHART.y + PATRI_CHART.s / 2];
  const from = propToWorld(chartC, jp, J_AT);
  const to = headToWorld([50, -86], rp, R_AT);

  // Camera: settle in, then a slow push with parallax drift.
  const z = track(f, [[0, 1.06], [30, 1, "out"], [180, 1.035, "io"]]);
  const camX = track(f, [[0, 22], [180, -22, "io"]]);
  const lay = (p: number) => `translate(${-camX * p} 0)`;

  return (
    <AbsoluteFill style={{ background: "#5C181D" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <SetDefs />
        <clipPath id="kInner">
          <rect x={BAND} y={BAND} width={W - 2 * BAND} height={H - 2 * BAND} />
        </clipPath>
        <g clipPath="url(#kInner)">
          <g transform={`translate(540 1180) scale(${z}) translate(-540 -1180)`}>
            <g transform={lay(0.15)}>
              <Sky f={f} />
            </g>
            <g transform={lay(0.35)}>
              <Palace f={f} />
            </g>
            <g transform={lay(0.45)}>
              <Ground />
            </g>
            <g transform={lay(0.6)}>
              <Crowd f={f} />
            </g>
            <g transform={lay(1)}>
              <FootShadow at={J_AT} w={100} />
              <FootShadow at={R_AT} w={120} />
              <Puppet id={`${uid}-raja`} kind="raja" at={R_AT} p={rp} t={f} />
              <Puppet
                id={`${uid}-jy`}
                kind="jyotishi"
                at={J_AT}
                p={jp}
                t={f}
                prop={<Patri id={`${uid}-patri`} unroll={unroll} draw={draw} glyphs={glyphs} glow={glow} />}
              />
              <Magic f={f} from={from} to={to} />
            </g>
          </g>
        </g>
      </svg>
      <Grain />
      <Border />
      <AppBadge />
      <CaptionCard f={f} cues={CUES} />
      <BrandTab />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Review sheet                                                        */
/* ------------------------------------------------------------------ */

export const KATHA_SHEET = [12, 64, 104, 150];

/** Four frames side by side at half size. Render frame 0 with `remotion still`. */
export const KathaTestSheet: React.FC = () => (
  <AbsoluteFill style={{ background: "#1A1210", flexDirection: "row", gap: 16, padding: 16 }}>
    {KATHA_SHEET.map((fr) => (
      <div key={fr} style={{ width: 540, height: 960, position: "relative", overflow: "hidden" }}>
        <div style={{ width: 1080, height: 1920, transform: "scale(0.5)", transformOrigin: "0 0", position: "absolute" }}>
          <Freeze frame={fr}>
            <KathaTest uid={`s${fr}`} />
          </Freeze>
        </div>
        <div
          style={{
            position: "absolute",
            left: 10,
            top: 10,
            padding: "2px 10px",
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            fontFamily: CORMORANT,
            fontSize: 26,
            borderRadius: 6,
          }}
        >
          f{fr}
        </div>
      </div>
    ))}
  </AbsoluteFill>
);
