import React from "react";
import { AbsoluteFill, Audio, Freeze, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { z } from "zod";
import { ChatScreen, HomeScreen } from "../bbreel/appScreens";
import { PhoneFrame } from "../bbreel/phoneKit";
import { AppBadge, Border, BrandTab, Grain } from "./frame";
import { PATRI_CHART, Patri, PhoneProp, Place, Pose, Puppet, REST, Talwar, WhiteFlag, headToWorld, propToWorld } from "./puppet";
import { AppStoreButton, Bubble, DayTag, Flash, FreeRibbon, HookBanner, NCue, Narration, Petals, PlayButton, Roller, Shout, SparkBurst, Streaks, Chip, env } from "./reelKit";
import { KATHA_REEL_DEFAULTS, KathaReelProps, ROOF0, ROOF_LEN, SC, seqOf, warp } from "./reelTimeline";
import { voOff, voOn, voTalk } from "./voTiming";
import { Mandala, NearSkyline, NightSky, FarSkyline, Terrace } from "./rooftop";
import { Crowd, Ground, Palace, SetDefs, Sky } from "./set";
import { BAND, C, CORMORANT, H, W, ramp, sparkle, track, wob } from "./style";

/* "The war that never happened": the katha style test grown into a full
   Jyotiq promo Reel. See reelTimeline.ts for the scene table and copy. */

/* ------------------------------------------------------------------ */
/* Camera + world                                                      */
/* ------------------------------------------------------------------ */

type Cam = { z: number; x: number; y: number };
const CAM0: Cam = { z: 1, x: 0, y: 0 };

/** Screen position of a world point on a layer with parallax p. */
const toScreen = (c: Cam, w: [number, number], p = 1): [number, number] => [
  540 + c.z * (w[0] - c.x * p - 540),
  1180 + c.z * (w[1] - c.y * p - 1180),
];

const World: React.FC<{ uid: string; cam: Cam; blur?: number; layers: [number, React.ReactNode][] }> = ({ uid, cam, blur = 0, layers }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
    <SetDefs />
    <clipPath id={`${uid}-inner`}>
      <rect x={BAND} y={BAND} width={W - 2 * BAND} height={H - 2 * BAND} />
    </clipPath>
    {blur > 0.5 ? (
      <filter id={`${uid}-whip`} x="-5%" y="0" width="110%" height="100%">
        <feGaussianBlur stdDeviation={`${blur} 0`} />
      </filter>
    ) : null}
    <g clipPath={`url(#${uid}-inner)`}>
      <g filter={blur > 0.5 ? `url(#${uid}-whip)` : undefined} transform={`translate(540 1180) scale(${cam.z}) translate(-540 -1180)`}>
        {layers.map(([p, node], i) => (
          <g key={i} transform={`translate(${-cam.x * p} ${-cam.y * p})`}>
            {node}
          </g>
        ))}
      </g>
    </g>
  </svg>
);

const FootShadow: React.FC<{ at: Place; w: number; o?: number }> = ({ at, w, o = 0.2 }) => (
  <ellipse cx={at.x} cy={at.y + 272 * at.s} rx={w * at.s} ry={13 * at.s} fill="#2A1206" opacity={o} />
);

/** 6-frame blink centred on each frame in `at`. */
const blinkAt = (f: number, at: number[]): number => Math.max(0, ...at.map((a) => 1 - Math.abs(f - a) / 3));
const MOUTH: [number, number] = [60, -50];

const cubic = (p0: number[], p1: number[], p2: number[], p3: number[], t: number): [number, number] => {
  const u = 1 - t;
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ];
};

/** Gold "star-thread" from `from` to `to` (world px), lanes start at `start`, then a burst. */
const StarThread: React.FC<{ f: number; start: number; from: [number, number]; to: [number, number] }> = ({ f, start, from, to }) => {
  const [sx, sy] = from;
  const [tx, ty] = to;
  const lanes = [
    { c1: [sx - 30, sy - 170], c2: [tx - 200, ty + 50], w: 6, col: "#F6D78A", d: 0 },
    { c1: [sx + 100, sy - 50], c2: [tx - 50, ty + 170], w: 3.5, col: "#FFF8E6", d: 4 },
    { c1: [sx + 10, sy - 240], c2: [tx - 130, ty - 50], w: 4.5, col: "#F2A33A", d: 8 },
  ];
  const seg = 0.34;
  const burst = ramp(f, start + 28, start + 50, "out");
  return (
    <g>
      {lanes.map((l, i) => {
        const pr = ramp(f, start + l.d, start + 26 + l.d, "io");
        if (pr <= 0 || pr >= 1) return null;
        const p = pr * (1 + seg);
        const d = `M${sx} ${sy}C${l.c1[0]} ${l.c1[1]} ${l.c2[0]} ${l.c2[1]} ${tx} ${ty}`;
        return (
          <g key={i}>
            <path d={d} fill="none" stroke={l.col} strokeWidth={l.w} strokeLinecap="round" pathLength={1} strokeDasharray={`${seg} 2`} strokeDashoffset={seg - p} />
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

/* ------------------------------------------------------------------ */
/* S1 Hook: the general wants war, the king says wait                  */
/* ------------------------------------------------------------------ */

const R1: Place = { x: 300, y: 1400, s: 1.18, facing: 1 };
const S1: Place = { x: 790, y: 1395, s: 1.24, facing: -1 };

const HookScene: React.FC<{ uid: string; P: KathaReelProps }> = ({ uid, P }) => {
  const n = useCurrentFrame(); // hook starts at reel frame 0, so n is also the reel frame
  const h = warp("hook", n); // v1 choreography clock
  const shout0 = voOn("L1");
  const shout1 = voOff("L1");
  const ruko0 = voOn("L2");
  const shake = n >= shout0 && n < shout1 + 2 ? Math.sin(n * 1.9) * 4 : 0;
  const sp: Pose = {
    ...REST,
    lean: -5,
    head: track(h, [[0, -8], [34, -8], [44, -2]]),
    sF: track(h, [[0, 124], [6, 152, "back"], [34, 152], [46, 120]]) + shake,
    eF: track(h, [[0, 30], [6, 20, "back"], [34, 20], [46, 30]]),
    wF: 8,
    sB: -14,
    eB: 60,
    bob: Math.sin(n / 5) * 1.5,
    talk: voTalk("L1", n),
    browTilt: 16,
    brow: track(h, [[0, 0], [36, 0], [42, 0.6]]),
  };
  const rp: Pose = {
    ...REST,
    lean: track(h, [[0, 0], [26, 0], [34, 4]]),
    sF: track(h, [[0, 6], [26, 6], [34, 74, "back"], [48, 74], [56, 10]]),
    eF: track(h, [[0, 10], [26, 10], [34, 26, "back"], [48, 26], [56, 10]]),
    wF: track(h, [[0, 0], [26, 0], [34, -38, "back"], [48, -38], [56, 0]]),
    talk: voTalk("L2", n),
    browTilt: 8,
    blink: blinkAt(h, [18]),
  };
  const R = { ...R1, facing: track(h, [[0, 1], [48, 1], [56, -1]]) };
  const cam: Cam = {
    z: track(h, [[0, 1.16], [24, 1.02, "out"]]),
    x: track(h, [[0, 150], [24, 40, "out"], [58, 40], [72, -420, "in"]]),
    y: track(h, [[0, -50], [24, 0, "out"]]),
  };
  const whip = ramp(h, 58, 72, "in");
  const glint = Math.max(0, 1 - Math.abs(h - 7) / 6);
  const sm = toScreen(cam, headToWorld(MOUTH, sp, S1));
  const rm = toScreen(cam, headToWorld(MOUTH, rp, R));
  return (
    <AbsoluteFill>
      <World
        uid={`${uid}h`}
        cam={cam}
        blur={whip * 40}
        layers={[
          [0.15, <Sky f={n} />],
          [0.35, <Palace f={n} />],
          [0.45, <Ground />],
          [0.6, <Crowd f={n} />],
          [
            1,
            <g>
              <FootShadow at={R} w={110} />
              <FootShadow at={S1} w={120} />
              <Puppet id={`${uid}h-raja`} kind="raja" at={R} p={rp} t={n} />
              <Puppet id={`${uid}h-sena`} kind="senapati" at={S1} p={sp} t={n} prop={<Talwar glint={glint} />} upright={false} />
            </g>,
          ],
        ]}
      />
      <Streaks f={n} amount={whip} />
      <HookBanner f={n} lines={P.hook} out={ramp(h, 58, 66, "in")} />
      <Shout x={sm[0]} y={sm[1]} cx={360} cy={712} rx={236} ry={132} text={P.shout} vis={env(n, shout0 - 1, shout1 + 6, 5, 5)} f={n} />
      <Bubble x={rm[0]} y={rm[1]} text={P.wait} vis={env(n, ruko0 - 2, 90, 5, 5)} dx={60} lift={230} size={60} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* S2 Court: the question, the kundali, the ruling                     */
/* ------------------------------------------------------------------ */

const J2: Place = { x: 270, y: 1400, s: 1.16, facing: 1 };
const R2: Place = { x: 828, y: 1385, s: 1.22, facing: -1 };
const CHART_C: [number, number] = [PATRI_CHART.x + PATRI_CHART.s / 2, PATRI_CHART.y + PATRI_CHART.s / 2];

/** h = v1 choreography clock, n = real scene frame (idle motion + voice lookups). */
const jCourt = (h: number, n: number): Pose => {
  const rf = n + SC.court[0];
  const talking = rf >= voOn("L4") && rf < voOff("L4");
  return {
    ...REST,
    lean: track(h, [[0, 1], [100, 1], [126, 5, "out"]]),
    head: track(h, [[0, -2], [100, -2], [126, -5]]) + (talking ? wob("jn", n / 6) * 2.2 : 0),
    sF: track(h, [[0, 8], [100, 8], [126, 64, "back"]]),
    eF: track(h, [[0, 12], [100, 12], [126, 38, "back"]]),
    wF: track(h, [[0, 0], [100, 0], [126, -10]]),
    sB: -6,
    eB: 16,
    bob: Math.sin(n / 13) * 1.6,
    sway: Math.sin(n / 21) * 0.6,
    blink: blinkAt(h, [60, 150, 246]),
    talk: voTalk("L4", rf),
  };
};

const rCourt = (h: number, n: number): Pose => ({
  ...REST,
  lean: track(h, [[0, -2], [200, -2], [226, 3]]),
  head: track(h, [[0, 0], [130, 0], [150, 6], [236, 6], [242, 12], [250, 5]]),
  sF: track(h, [[0, 6], [44, 6], [54, 40, "out"], [90, 40], [104, 6], [204, 6], [228, 72, "out"]]),
  eF: track(h, [[0, 10], [44, 10], [54, 40, "out"], [90, 40], [104, 10], [204, 10], [228, 142, "out"]]),
  wF: track(h, [[0, 0], [44, 0], [54, -30], [90, -30], [104, 0], [204, 0], [228, 10]]),
  sB: -20,
  eB: 70,
  bob: Math.sin(n / 15 + 1) * 1.4,
  sway: Math.sin(n / 24 + 2) * 0.5,
  blink: blinkAt(h, [30, 120, 214]),
  brow: track(h, [[0, 0], [194, 0], [202, 1, "back"], [236, 1], [250, 0.3]]),
  talk: voTalk("L3", n + SC.court[0]),
  lookX: track(h, [[0, 1], [130, 1], [144, 0.4]]),
  lookY: track(h, [[0, 0], [130, 0], [144, 0.9]]),
});

const CourtScene: React.FC<{ uid: string; P: KathaReelProps }> = ({ uid, P }) => {
  const n = useCurrentFrame();
  const h = warp("court", n);
  const base = SC.court[0];
  const jp = jCourt(h, n);
  const rp = rCourt(h, n);
  const chartW = propToWorld(CHART_C, jp, J2);
  const settled = propToWorld(CHART_C, jCourt(170, 170), J2);
  const push = ramp(h, 140, 178, "io") * (1 - 0.45 * ramp(h, 236, 258, "io"));
  const whipIn = 1 - ramp(h, 0, 10, "out");
  const cam: Cam = {
    z: 1 + 0.3 * push,
    x: (settled[0] - 540) * push + 420 * whipIn,
    y: (settled[1] - 1180 + 60) * push,
  };
  const jm = toScreen(cam, headToWorld(MOUTH, jp, J2));
  const rm = toScreen(cam, headToWorld(MOUTH, rp, R2));
  const glow = ramp(h, 158, 172, "out") * (0.75 + 0.25 * Math.sin(n / 5));
  const idle = n + SC.hook[1]; // continue the hook's idle clock across the cut
  return (
    <AbsoluteFill>
      <World
        uid={`${uid}c`}
        cam={cam}
        blur={whipIn * 40}
        layers={[
          [0.15, <Sky f={idle} />],
          [0.35, <Palace f={idle} />],
          [0.45, <Ground />],
          [0.6, <Crowd f={idle} />],
          [
            1,
            <g>
              <FootShadow at={J2} w={100} />
              <FootShadow at={R2} w={120} />
              <Puppet id={`${uid}c-raja`} kind="raja" at={R2} p={rp} t={n} />
              <Puppet
                id={`${uid}c-jy`}
                kind="jyotishi"
                at={J2}
                p={jp}
                t={n}
                prop={
                  <Patri
                    id={`${uid}c-patri`}
                    unroll={ramp(h, 122, 142, "out")}
                    draw={ramp(h, 134, 164, "lin")}
                    glyphs={ramp(h, 150, 170, "lin")}
                    glow={glow}
                    mark={ramp(h, 176, 190, "back") * (0.85 + 0.15 * Math.sin(n / 3))}
                  />
                }
              />
              <StarThread f={h} start={198} from={chartW} to={headToWorld([50, -86], rp, R2)} />
            </g>,
          ],
        ]}
      />
      <Streaks f={n} amount={whipIn} />
      <Bubble x={rm[0]} y={rm[1]} text={P.ask} vis={env(n, voOn("L3") - base - 2, voOff("L3") - base + 9)} dx={-110} lift={230} />
      <Bubble x={jm[0]} y={jm[1]} text={P.ruling} vis={env(n, voOn("L4") - base - 2, voOff("L4") - base + 10)} dx={150} lift={230} size={48} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* S3 Days: time-lapse, the messenger runs in                          */
/* ------------------------------------------------------------------ */

const DaysScene: React.FC<{ uid: string }> = ({ uid }) => {
  const h = useCurrentFrame();
  const cyc = Math.min(3, (h / 78) * 3);
  const u = cyc - Math.floor(cyc);
  const night = 0.5 - 0.5 * Math.cos(2 * Math.PI * u);
  const th = 2 * Math.PI * u;
  const sun: [number, number] = [540 + 1000 * Math.sin(th), 1100 - 1000 * Math.cos(th)];
  const moon: [number, number] = [540 - 1000 * Math.sin(th), 1100 + 1000 * Math.cos(th)];
  const day = Math.min(3, Math.floor(cyc) + 1);
  const run = 1 - ramp(h, 100, 108, "out");
  const D: Place = { x: track(h, [[0, -220], [74, -220], [104, 320, "out"]]), y: 1400, s: 1.16, facing: 1 };
  const ph = h * 0.9;
  const dp: Pose = {
    ...REST,
    lean: 4 + 12 * run,
    head: -4,
    sF: 134 + 6 * Math.sin(ph) * run,
    eF: 18,
    sB: -30 * Math.sin(ph) * run,
    eB: 40,
    bob: -Math.abs(Math.sin(ph)) * 16 * run,
    talk: h > 100 ? 0.4 : 0,
  };
  const cam: Cam = { z: 1 + 0.04 * ramp(h, 0, 110, "lin"), x: 0, y: 0 };
  return (
    <AbsoluteFill>
      <World
        uid={`${uid}d`}
        cam={cam}
        layers={[
          [0.15, <Sky f={h} night={night} sun={sun[1] < 1000 ? sun : null} moon={moon[1] < 1000 ? moon : null} />],
          [0.35, <Palace f={h} night={night} />],
          [0.45, <Ground night={night} />],
          [0.6, <Crowd f={h} night={night} />],
          [
            1,
            <g>
              {h > 74
                ? [0, 1, 2, 3].map((i) => {
                    const age = (h - 74 - i * 7) / 14;
                    if (age < 0 || age > 1 || run < 0.5) return null;
                    return <circle key={i} cx={D.x - 80 - age * 50} cy={1700 - age * 20} r={14 + age * 22} fill="#E7B07A" opacity={0.5 * (1 - age)} />;
                  })
                : null}
              <FootShadow at={D} w={100} />
              <Puppet id={`${uid}d-dut`} kind="dut" at={D} p={dp} t={h} prop={<WhiteFlag t={h} />} />
            </g>,
          ],
        ]}
      />
      <DayTag n={day} flip={ramp(h, (day - 1) * 26, (day - 1) * 26 + 6, "back")} vis={env(h, 2, 84, 6, 8)} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* S4 Peace: the offer, the cheering court, the moral                  */
/* ------------------------------------------------------------------ */

const D4: Place = { x: 320, y: 1400, s: 1.16, facing: 1 };

const PeaceScene: React.FC<{ uid: string; P: KathaReelProps }> = ({ uid, P }) => {
  const n = useCurrentFrame();
  const h = warp("peace", n);
  const base = SC.peace[0];
  const dp: Pose = {
    ...REST,
    lean: track(h, [[0, 4], [12, 16]]),
    head: track(h, [[0, -4], [12, 6], [40, 6], [52, -2]]),
    sF: 132,
    eF: 16,
    sB: -10,
    eB: 30,
    bob: Math.sin(n / 4) * 2 * (1 - ramp(h, 0, 20)),
    talk: voTalk("L5", n + base),
    smile: ramp(h, 44, 54),
    blink: blinkAt(h, [60, 110]),
  };
  const rp: Pose = {
    ...REST,
    lean: track(h, [[0, -2], [40, -2], [52, -6]]),
    head: track(h, [[0, 0], [40, 0], [52, -6]]),
    sF: track(h, [[0, 6], [36, 6], [48, 46, "back"]]),
    eF: track(h, [[0, 10], [36, 10], [48, 8]]),
    wF: track(h, [[0, 0], [36, 0], [48, -24]]),
    sB: track(h, [[0, -20], [36, -20], [48, -40, "back"]]),
    eB: track(h, [[0, 70], [36, 70], [48, 20]]),
    smile: ramp(h, 30, 42),
    brow: track(h, [[0, 0], [26, 0], [32, 1, "back"], [70, 0.4]]),
    blink: blinkAt(h, [20, 96]),
  };
  const cheer = ramp(h, 36, 46) * (1 - 0.6 * ramp(h, 90, 120));
  const cam: Cam = { z: 1 + 0.03 * ramp(n, 0, SC.peace[1] - base, "lin"), x: 0, y: 0 };
  const dm = toScreen(cam, headToWorld(MOUTH, dp, D4));
  return (
    <AbsoluteFill>
      <World
        uid={`${uid}p`}
        cam={cam}
        layers={[
          [0.15, <Sky f={n} />],
          [0.35, <Palace f={n} />],
          [0.45, <Ground />],
          [0.6, <Crowd f={n} cheer={cheer} />],
          [
            1,
            <g>
              <FootShadow at={D4} w={100} />
              <FootShadow at={R2} w={120} />
              <Puppet id={`${uid}p-raja`} kind="raja" at={R2} p={rp} t={n} />
              <Puppet id={`${uid}p-dut`} kind="dut" at={D4} p={dp} t={n} prop={<WhiteFlag t={n} />} />
            </g>,
          ],
        ]}
      />
      <Petals f={n} from={voOn("L6") - base} />
      <Bubble x={dm[0]} y={dm[1]} text={P.peaceLine} vis={env(n, voOn("L5") - base - 2, voOff("L5") - base + 8)} dx={150} lift={240} size={52} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* S5 + S6 Rooftop: today's questions, the Raj Jyotishi in your phone  */
/* ------------------------------------------------------------------ */

const M5: Place = { x: 400, y: 1400, s: 1.16, facing: 1 };
const J5: Place = { x: 800, y: 1400, s: 1.16, facing: -1 };

/** r = v1 rooftop clock, n = real rooftop frame (n = 0 at ROOF0). */
const mRoof = (r: number, n: number): Pose => ({
  ...REST,
  lean: 2,
  head: track(r, [[0, 12], [60, 12], [70, -6], [116, -6], [126, 10], [156, 10], [166, 0], [232, 0], [242, 8]]) + (r > 30 && r < 60 ? Math.sin(n / 3) * 2 : 0),
  sF: 38,
  eF: 92,
  wF: 0,
  sB: -6,
  eB: 14,
  bob: Math.sin(n / 16) * 1.4,
  sway: Math.sin(n / 23) * 0.5,
  blink: blinkAt(r, [44, 104, 150, 210]),
  brow: track(r, [[0, 0], [156, 0], [162, 1, "back"], [200, 0.6], [236, 0]]),
  browTilt: track(r, [[0, 0], [30, -14], [156, -14], [164, 0]]),
  smile: ramp(r, 232, 244),
  lookX: track(r, [[0, 0.6], [156, 0.6], [164, 1]]),
  lookY: track(r, [[0, 0.8], [60, 0.8], [70, -0.8], [116, -0.8], [126, 0.8], [156, 0.8], [164, 0], [232, 0], [240, 0.9]]),
});

const jRoof = (r: number, n: number): Pose => {
  const rf = n + ROOF0;
  const laugh = voOn("L8", 0);
  const secret = voOn("L8", 2); // "ab main tumhare phone mein hoon": the wink lands on it
  const talking = rf >= laugh && rf < voOff("L8");
  return {
    ...REST,
    lean: 3,
    head: -2 + (talking ? wob("jr", n / 6) * 2 : 0),
    sF: track(r, [[0, 8], [184, 8], [198, 60, "back"]]),
    eF: track(r, [[0, 12], [184, 12], [198, 18, "back"]]),
    wF: track(r, [[0, 0], [184, 0], [198, -24]]),
    sB: -6,
    eB: 16,
    bob: Math.sin(n / 13) * 1.6,
    sway: Math.sin(n / 21) * 0.6,
    wink: rf >= secret + 1 && rf < secret + 13 ? 1 : 0,
    smile: ramp(rf, laugh - 2, laugh + 8) * 0.8,
    blink: blinkAt(r, [226]),
    talk: voTalk("L8", rf),
  };
};

const CHIP_POS: [number, number][] = [
  [380, 690],
  [640, 800],
  [420, 905],
];

const RooftopScene: React.FC<{ uid: string; P: KathaReelProps }> = ({ uid, P }) => {
  const n = useCurrentFrame();
  const r = warp("roof", n);
  const mp = mRoof(r, n);
  const jp = jRoof(r, n);
  const phoneW = propToWorld([0, -38], mp, M5);
  const center = ramp(r, 230, 248, "io");
  const zoom = ramp(r, 236, 264, "in");
  const cam: Cam = {
    z: 1.02 * Math.pow(9, zoom),
    x: (phoneW[0] - 540) * center,
    y: (phoneW[1] - 1180) * center,
  };
  const appear = ramp(r, 156, 168, "back");
  const phoneGlow = ramp(r, 222, 232) * (0.85 + 0.15 * Math.sin(n / 3));
  const handW = propToWorld([0, 10], jp, J5);
  const jChest = toScreen(cam, [J5.x, J5.y - 150]);
  const born = voOn("L8", 0) - ROOF0; // the Jyotishi materialises on his laugh
  return (
    <AbsoluteFill>
      <World
        uid={`${uid}r`}
        cam={cam}
        layers={[
          [0.1, <NightSky f={n} />],
          [0.25, <FarSkyline />],
          [0.45, <NearSkyline />],
          [
            1,
            <g>
              <Terrace f={n} />
              <FootShadow at={M5} w={100} o={0.35} />
              <Puppet id={`${uid}r-meera`} kind="meera" at={M5} p={mp} t={n} prop={<PhoneProp glow={phoneGlow} logo={ramp(r, 228, 238)} />} />
              {appear > 0.01 ? (
                <g opacity={Math.min(1, appear * 1.4)} transform={`translate(${J5.x} ${J5.y}) scale(${0.7 + 0.3 * appear}) translate(${-J5.x} ${-J5.y})`}>
                  <ellipse cx={J5.x} cy={J5.y - 150} rx={190} ry={330} fill="url(#kAura)" opacity={0.55} />
                  <FootShadow at={J5} w={100} o={0.35} />
                  <Puppet id={`${uid}r-jy`} kind="jyotishi" at={J5} p={jp} t={n} />
                </g>
              ) : null}
              <StarThread f={r} start={198} from={handW} to={phoneW} />
            </g>,
          ],
        ]}
      />
      {P.chips.map((c, i) => {
        const q = voOn("L7", i) - ROOF0; // chip pops as Meera whispers that question
        return (
          <Chip
            key={i}
            x={CHIP_POS[i][0]}
            y={CHIP_POS[i][1]}
            text={c}
            pop={ramp(n, q - 1, q + 11, "back")}
            out={ramp(n, born - 16 + i * 3, born - 4 + i * 3, "in")}
            f={n}
            seed={i}
          />
        );
      })}
      <SparkBurst x={jChest[0]} y={jChest[1]} t={ramp(n, born - 8, born + 18, "out")} n={14} r={200} />
      <Flash o={ramp(r, 254, 264, "in")} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* S7 App: the real Jyotiq screens                                     */
/* ------------------------------------------------------------------ */

const AppScene: React.FC<{ uid: string; P: KathaReelProps }> = ({ uid, P }) => {
  const fr = useCurrentFrame();
  const a = warp("app", fr);
  const q = P.question;
  const typeFrom = 18;
  const typeTo = 54;
  const send = 60;
  const kb = ramp(a, 10, 18, "out") * (1 - ramp(a, send, send + 6));
  const n = Math.round(interpolate(a, [typeFrom, typeTo], [0, q.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const perChar = (typeTo - typeFrom) / Math.max(1, q.length);
  const litChar = n > 0 && a <= typeTo + 1 ? q[n - 1] : "";
  const lit = litChar ? Math.max(0, 1 - ((a - typeFrom) / perChar - (n - 1)) * 0.8) : 0;
  const chatIn = ramp(a, send + 1, send + 6);
  const ps = track(a, [[0, 2.9], [14, 0.92, "out"]]);
  const press = a >= send - 1 && a < send + 2 ? 1 : 0;
  return (
    <AbsoluteFill>
      <World
        uid={`${uid}a`}
        cam={CAM0}
        layers={[
          [0.1, <NightSky f={fr + ROOF_LEN} />],
          [0.45, <g opacity={0.7}><NearSkyline /></g>],
          [1, <Mandala f={fr} cx={540} cy={920} r={500} opacity={0.45 * ramp(a, 6, 20)} />],
          [1, <g opacity={0.9}><Terrace f={fr + ROOF_LEN} /></g>],
        ]}
      />
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `translate(0px, ${920 - 1164}px) scale(${ps})`, transformOrigin: "540px 1164px" }}>
        <svg width={W} height={2400} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path d="M196 1560C176 1700 226 1960 306 2100L820 2100C900 1960 930 1760 900 1600Z" fill="#C98F62" stroke="#8A5A38" strokeWidth={5} />
          <path d="M270 1990L860 1990L900 2300L230 2300Z" fill="#E3A72F" stroke="#B9831C" strokeWidth={5} />
          <path d="M262 2010H866" stroke="#8E2420" strokeWidth={8} />
        </svg>
        <PhoneFrame>
          {a < send + 6 ? (
            <AbsoluteFill style={{ opacity: 1 - chatIn }}>
              <HomeScreen
                t={a}
                name={P.userName}
                flames={1}
                typed={q.slice(0, n)}
                caret={a >= 12 && a < send + 1}
                focus={ramp(a, 10, 16)}
                kb={kb}
                litChar={litChar}
                lit={lit}
                sendPress={press}
                sendGlow={a >= typeTo ? ramp(a, typeTo, typeTo + 3) * (a < send + 6 ? 1 : 0) : 0}
              />
            </AbsoluteFill>
          ) : null}
          {a >= send + 1 ? (
            <AbsoluteFill style={{ opacity: chatIn }}>
              <ChatScreen t={a} question={q} flyIn={ramp(a, send + 1, send + 13, "out")} reply={ramp(a, send + 13, send + 19)} flames={0} />
            </AbsoluteFill>
          ) : null}
        </PhoneFrame>
        <svg width={W} height={2400} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {[1250, 1336, 1422].map((y) => (
            <rect key={y} x={190} y={y} width={70} height={62} rx={31} fill="#C98F62" stroke="#8A5A38" strokeWidth={5} />
          ))}
          <rect x={834} y={1410} width={62} height={210} rx={31} fill="#C98F62" stroke="#8A5A38" strokeWidth={5} transform="rotate(14 865 1515)" />
        </svg>
      </div>
      <Flash o={1 - ramp(a, 0, 10, "out")} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* S8 CTA                                                              */
/* ------------------------------------------------------------------ */

const JC: Place = { x: 205, y: 1560, s: 1, facing: 1 };
const MC: Place = { x: 875, y: 1575, s: 1, facing: -1 };

const CtaScene: React.FC<{ uid: string; P: KathaReelProps }> = ({ uid, P }) => {
  const c = useCurrentFrame();
  const base = SC.cta[0];
  const rf = c + base;
  // reveals land on the words: "...Jyotiq se poochho" / "pehla sawaal..." / "Jyotiq ko abhi Play Store se..."
  const l2 = voOn("L10", 1) - base;
  const rb = voOn("L11", 0) - base;
  const bt = voOn("L11", 1) - base;
  const jTalking = rf >= voOn("L10") && rf < voOff("L10");
  const rise = track(c, [[0, 420], [18, 0, "out"]]);
  const J = { ...JC, y: JC.y + rise };
  const M = { ...MC, y: MC.y + rise };
  const jp: Pose = {
    ...REST,
    lean: 4,
    head: -6 + (jTalking ? wob("jc", c / 6) * 2 : 0),
    sF: 146,
    eF: 4,
    wF: 0,
    smile: 0.8,
    bob: Math.sin(c / 12) * 1.5,
    blink: blinkAt(c, [70, 170]),
    talk: voTalk("L10", rf),
  };
  const mp: Pose = {
    ...REST,
    head: -4,
    sF: 70,
    eF: 60,
    smile: 1,
    bob: Math.sin(c / 14 + 1) * 1.5,
    blink: blinkAt(c, [90, 200]),
    lookX: 0,
    lookY: 0,
    talk: voTalk("L11", rf),
  };
  const pop = (a: number, b: number) => ramp(c, a, b, "back");
  const logo = pop(2, 14);
  const card = pop(4, 16);
  const line2 = pop(l2 - 2, l2 + 8);
  const ribbon = pop(rb - 2, rb + 8);
  const btn = pop(bt - 2, bt + 8);
  const glow = c > bt + 8 ? 0.6 + 0.4 * Math.sin((c - bt - 8) / 5) : 0;
  // The voice names only the Play Store, so the App Store badge lands as a second beat 0.2 s later
  // and then pulses in phase with Google Play.
  const ap = bt + 6;
  const btnA = pop(ap - 2, ap + 8);
  const glowA = glow * ramp(c, ap + 4, ap + 12);
  const idle = c + ROOF_LEN + (SC.app[1] - SC.app[0]);
  return (
    <AbsoluteFill>
      <World
        uid={`${uid}t`}
        cam={CAM0}
        layers={[
          [0.1, <NightSky f={idle} />],
          [0.45, <g opacity={0.8}><NearSkyline /></g>],
          [
            1,
            <g>
              <Mandala f={c + SC.app[1] - SC.app[0]} cx={540} cy={760} r={470} opacity={0.4} />
              <Terrace f={idle} />
              <FootShadow at={J} w={100} o={0.35} />
              <FootShadow at={M} w={100} o={0.35} />
              <Puppet id={`${uid}t-jy`} kind="jyotishi" at={J} p={jp} t={c} point />
              <Puppet id={`${uid}t-meera`} kind="meera" at={M} p={mp} t={c} prop={<PhoneProp glow={0.9} logo={1} />} />
            </g>,
          ],
        ]}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: 118, display: "flex", justifyContent: "center", opacity: Math.min(1, logo * 1.5), transform: `scale(${0.6 + 0.4 * logo})` }}>
        <Img src={staticFile("jyotiq/logo-full.png")} style={{ width: 262, height: 302 }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 100,
          width: 880,
          top: 452,
          height: 250,
          opacity: Math.min(1, card * 1.5),
          transform: `scale(${0.85 + 0.15 * card})`,
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: C.paper, borderRadius: 18, boxShadow: "0 14px 30px rgba(0,0,0,0.5)" }} />
        <div style={{ position: "absolute", inset: 10, border: `2.5px solid ${C.paperEdge}`, borderRadius: 12 }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: CORMORANT, fontWeight: 700, color: C.text, lineHeight: 1.05 }}>
          <div style={{ fontSize: 56 }}>{P.ctaLines[0]}</div>
          <div style={{ fontSize: 98, color: "#B3171E", opacity: Math.min(1, line2 * 1.5), transform: `scale(${0.6 + 0.4 * line2})` }}>{P.ctaLines[1]}</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 728, display: "flex", justifyContent: "center", opacity: Math.min(1, ribbon * 1.5), transform: `scale(${0.7 + 0.3 * ribbon})` }}>
        <FreeRibbon text={P.ctaFree} />
      </div>
      {/* Store badges side by side, same height, scaled as a pair to stay inside x≈140-940. */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 846, display: "flex", justifyContent: "center", gap: 28, transform: "scale(0.86)" }}>
        <div style={{ opacity: Math.min(1, btn * 1.5), transform: `scale(${(0.8 + 0.2 * btn) * (1 + 0.025 * glow)})` }}>
          <PlayButton glow={glow} />
        </div>
        <div style={{ opacity: Math.min(1, btnA * 1.5), transform: `scale(${(0.8 + 0.2 * btnA) * (1 + 0.025 * glowA)})` }}>
          <AppStoreButton glow={glowA} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1012,
          textAlign: "center",
          fontFamily: CORMORANT,
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: 46,
          color: "#F6E7C8",
          textShadow: "0 3px 10px rgba(0,0,0,0.6)",
          opacity: ramp(c, bt + 28, bt + 38),
        }}
      >
        {P.ctaNote}
      </div>
      <SparkBurst x={345} y={912} t={ramp(c, bt + 4, bt + 28, "out")} n={12} r={210} />
      <SparkBurst x={757} y={912} t={ramp(c, ap + 4, ap + 28, "out")} n={12} r={210} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Reel                                                                */
/* ------------------------------------------------------------------ */

const narration = (P: KathaReelProps): NCue[] => [
  { from: 112, to: 174, text: P.narr1 },
  { from: 216, to: 272, text: P.narr2 },
  { from: 406, to: 466, text: P.narr3 },
  { from: 476, to: 524, text: P.narr4 },
  { from: 626, to: 672, text: P.moral }, // after the first "maharaj ki jai!"
  { from: 696, to: 775, text: P.narr5 },
  { from: 846, to: 958, text: P.narr6 },
  { from: 1054, to: 1099, text: P.narr7 },
];

export const JyotiqKathaReel: React.FC<KathaReelProps & { uid?: string }> = ({ uid = "r", ...P }) => {
  const f = useCurrentFrame();
  const rollA = SC.peace[1] - 30;
  const rolling = f >= rollA && f < SC.peace[1];
  const rollY = 1870 - 1820 * ramp(f, rollA, SC.peace[1], "io");
  return (
    <AbsoluteFill style={{ background: C.band }}>
      <Sequence {...seqOf("hook")} name="S1 Hook">
        <HookScene uid={uid} P={P} />
      </Sequence>
      <Sequence {...seqOf("court")} name="S2 Court">
        <CourtScene uid={uid} P={P} />
      </Sequence>
      <Sequence {...seqOf("days")} name="S3 Three days">
        <DaysScene uid={uid} />
      </Sequence>
      <Sequence from={ROOF0} durationInFrames={SC.pocket[1] - ROOF0} name="S5-S6 Rooftop">
        <RooftopScene uid={uid} P={P} />
      </Sequence>
      <Sequence {...seqOf("peace")} name="S4 Peace">
        <AbsoluteFill style={{ clipPath: rolling ? `inset(0px 0px ${H - rollY}px 0px)` : undefined }}>
          <PeaceScene uid={uid} P={P} />
        </AbsoluteFill>
      </Sequence>
      {rolling ? <Roller y={rollY} /> : null}
      <Sequence {...seqOf("app")} name="S7 App">
        <AppScene uid={uid} P={P} />
      </Sequence>
      <Sequence {...seqOf("cta")} name="S8 CTA">
        <CtaScene uid={uid} P={P} />
      </Sequence>
      <Grain />
      <Narration f={f} cues={narration(P)} />
      <Border />
      <AppBadge />
      <BrandTab />
      {P.audio === "mix" ? <Audio src={staticFile("jyotiq/katha/mix-elevenlabs.wav")} /> : null}
      {P.audio === "sfx" ? <Audio src={staticFile("jyotiq/katha/sfx.wav")} /> : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Review sheet: 12 frames at quarter size                             */
/* ------------------------------------------------------------------ */

export const KATHA_REEL_SHEET = [4, 46, 66, 165, 300, 352, 505, 548, 600, 760, 880, 1230];
export const kathaSheetSchema = z.object({ list: z.array(z.number()).optional() });

export const JyotiqKathaReelSheet: React.FC<{ list?: number[] }> = ({ list = KATHA_REEL_SHEET }) => {
  const P: KathaReelProps = { ...KATHA_REEL_DEFAULTS, audio: "none" };
  return (
    <AbsoluteFill style={{ background: "#1A1210", flexDirection: "row", flexWrap: "wrap", gap: 12, padding: 12, alignContent: "flex-start" }}>
      {list.map((fr) => (
        <div key={fr} style={{ width: 270, height: 480, position: "relative", overflow: "hidden" }}>
          <div style={{ width: W, height: H, transform: "scale(0.25)", transformOrigin: "0 0", position: "absolute" }}>
            <Freeze frame={fr}>
              <JyotiqKathaReel {...P} uid={`s${fr}`} />
            </Freeze>
          </div>
          <div style={{ position: "absolute", left: 6, top: 6, padding: "1px 8px", background: "rgba(0,0,0,0.65)", color: "#fff", fontFamily: CORMORANT, fontSize: 22, borderRadius: 5 }}>
            {fr}
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
