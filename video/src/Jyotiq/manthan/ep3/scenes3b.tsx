import React from "react";
import { shake, World } from "../kit";
import { Cam, Vignette } from "../sets";
import { ramp, rnd, track, W, H } from "../style";
import { ChurnStage } from "./stage3";
import { talk3 } from "./kit3";
import { CUES } from "./timing";

/* Episode 3 scenes, part B: Bali's command, the churn, Vasuki's fire, smoke vs rain, the realisation. */

/** Anime impact: radial speed lines around a point (screen space). o 0..1. */
export const SpeedLines: React.FC<{ cx: number; cy: number; o: number; seed: string }> = ({ cx, cy, o, seed }) =>
  o < 0.01 ? null : (
    <g opacity={o}>
      {Array.from({ length: 28 }).map((_, i) => {
        const a = ((i * 360) / 28 + rnd(`${seed}a${i}`) * 8) * (Math.PI / 180);
        const r1 = 300 + rnd(`${seed}r${i}`) * 120;
        const r2 = 1500;
        const w = 0.012 + rnd(`${seed}w${i}`) * 0.012;
        const p = (r: number, da: number) => `${(cx + Math.cos(a + da) * r).toFixed(1)} ${(cy + Math.sin(a + da) * r).toFixed(1)}`;
        return <path key={i} d={`M${p(r1, 0)}L${p(r2, w)}L${p(r2, -w)}Z`} fill="#FFFFFF" opacity={0.75} />;
      })}
    </g>
  );

/** 914-1011: "असुरो! पूरी शक्ति से खींचो!" - impact frame on Bali, then the asuras heave. */
export const BaliCall: React.FC<{ f: number }> = ({ f }) => {
  const [sx, sy] = shake(f, CUES.baliHit, 12, 18);
  // faces sit near y 1040 on screen so the caption (y 1300) never covers them
  const cam: Cam = { x: -350, y: 560, z: track(f, [[914, 2.1], [1011, 1.9, "io"]]) };
  const heave = track(f, [[914, 0.3], [CUES.pull, 0.5, "io"], [CUES.pull + 20, 0.85, "io"]]);
  const flash = ramp(f, CUES.baliHit, CUES.baliHit + 1) * (1 - ramp(f, CUES.baliHit + 2, CUES.baliHit + 8));
  const lines = ramp(f, CUES.baliHit, CUES.baliHit + 1) * (1 - ramp(f, CUES.baliHit + 6, CUES.baliHit + 14));
  return (
    <World dx={sx} dy={sy}>
      <ChurnStage
        f={f}
        cam={cam}
        fx={{
          heave,
          spin: (0.15 + 0.35 * ramp(f, CUES.pull, CUES.pull + 20)) * Math.sin(f / 13),
          glow: 0.25,
          expr: {
            ba: { talk: talk3("05_bali", f), browTilt: 18, glow: 0.4, lookX: 0.6, head: -8 },
            sw: { browTilt: 10, lookX: -0.4 },
          },
        }}
      />
      <SpeedLines cx={460} cy={1040} o={lines} seed="bali" />
      <rect width={W} height={H} fill="#FFFFFF" opacity={0.65 * flash} />
      <Vignette o={0.6} />
    </World>
  );
};

/** 1011-1251: "मंथन फिर शुरू हुआ..." - the churn resumes wide; on "वासुकि" push in on his head as his breath heats. */
export const Churn: React.FC<{ f: number }> = ({ f }) => {
  const push = ramp(f, CUES.vasukiLook, CUES.vasukiLook + 48, "io");
  const cam: Cam = {
    x: -300 * push,
    y: track(f, [[1011, 0], [CUES.vasukiLook, 80, "io"]]) * (1 - push) + 380 * push,
    z: track(f, [[1011, 1.0], [CUES.vasukiLook, 1.08, "io"]]) * (1 - push) + 1.5 * push,
  };
  const breath = ramp(f, CUES.breathGlow, CUES.breathGlow + 40, "io");
  return (
    <World>
      <ChurnStage
        f={f}
        cam={cam}
        fx={{ heave: 0.7, spin: 0.6 * Math.sin(f / 13), glow: 0.3, heat: 0.3 * breath, vasuki: { smoke: 0.6 * breath, eye: 1, tongue: 0.4 } }}
      />
      <Vignette o={0.55} />
    </World>
  );
};

/** 1251-1429: "धीरे... मेरी साँसों में आग है..." - close on Vasuki; a flicker of fire on "आग", the full burst after the line. */
export const VasukiFire: React.FC<{ f: number }> = ({ f }) => {
  const [sx, sy] = shake(f, CUES.fireBurst, 14, 14);
  const cam: Cam = { x: -330, y: 420, z: track(f, [[1251, 1.8], [1429, 1.95, "io"]]) };
  const strain = ramp(f, 1251, 1290);
  const flicker = ramp(f, CUES.fireWord, CUES.fireWord + 10) * 0.45 * (1 - ramp(f, CUES.fireWord + 30, CUES.fireWord + 45));
  const burst = ramp(f, CUES.fireBurst - 2, CUES.fireBurst + 4);
  const recoil = ramp(f, CUES.fireBurst, CUES.fireBurst + 8);
  return (
    <World dx={sx} dy={sy}>
      <ChurnStage
        f={f}
        cam={cam}
        fx={{
          heave: 0.75,
          spin: 0.6 * Math.sin(f / 13),
          glow: 0.25,
          fire: Math.max(flicker, burst),
          heat: 0.35 + 0.5 * recoil,
          vasuki: { smoke: 0.8, tongue: 0.3 + 0.7 * talk3("07_vasuki", f), eye: 1 - 0.25 * strain },
          // the asuras flinch away from the fire (forward, toward the mountain)
          expr: { sw: { lean: -10 + 18 * recoil, browTilt: -10 * recoil, lookX: -0.5 }, ba: { lean: -10 + 14 * recoil, browTilt: -6 * recoil } },
        }}
      />
      <Vignette o={0.6} />
    </World>
  );
};

/** 1429-1614: Swarbhanu coughing in the smoke: "आँखें जल रही हैं... ये धुआँ सिर्फ़ हमारी तरफ़ क्यों आ रहा है?" */
export const Smoke: React.FC<{ f: number }> = ({ f }) => {
  const cam: Cam = { x: -260, y: 575, z: track(f, [[1429, 2.3], [1614, 2.45, "io"]]) };
  const look = ramp(f, CUES.smokeWord - 4, CUES.smokeWord + 10, "io"); // he lifts his head and looks at the devta side
  return (
    <World>
      <ChurnStage
        f={f}
        cam={cam}
        fx={{
          heave: 0.6,
          spin: 0.6 * Math.sin(f / 13),
          glow: 0.2,
          fire: 0.3 * (1 - ramp(f, 1429, 1450)),
          heat: 0.9,
          fade: { sw: 0.25, ba: 0.25, aS: 0.2 },
          vasuki: { smoke: 0.9 },
          expr: {
            sw: {
              talk: talk3("08_swarbhanu", f),
              blink: 0.6 * (1 - look) + 0.1 * look,
              browTilt: -14 * (1 - look) + 14 * look,
              head: 10 * (1 - look) - 6 * look,
              lean: 6 * (1 - look) - 8 * look,
              lookX: 0.9 * look,
            },
            ba: { blink: 0.5, browTilt: -10, head: 8 },
          },
        }}
      />
      <Vignette o={0.65} />
    </World>
  );
};

/** 1614-1891: head side in poison smoke vs tail side under cool rain clouds. */
export const Split: React.FC<{ f: number }> = ({ f }) => {
  const toTail = ramp(f, CUES.tailSide - 6, CUES.tailSide + 30, "io");
  const rain = ramp(f, CUES.tailSide, CUES.tailSide + 30);
  // closer than the full wide, so the armies (not the sky) fill the frame; faces sit near screen y 1200
  const cam: Cam = { x: -120 + 240 * toTail, y: 380, z: track(f, [[1614, 1.5], [1891, 1.42, "io"]]) };
  const calm = ramp(f, CUES.rain - 10, CUES.rain + 20);
  const relief = { smile: 0.35 * calm, lookY: -0.5 * calm, browTilt: -4 * calm };
  return (
    <World>
      <ChurnStage
        f={f}
        cam={cam}
        fx={{
          heave: 0.7,
          spin: 0.6 * Math.sin(f / 13),
          glow: 0.25,
          heat: 0.85,
          rain,
          fade: { sw: 0.25, ba: 0.25, aS: 0.25, aJ: 0.2, aI: 0.2 },
          vasuki: { smoke: 0.9 },
          expr: { in: relief, su: relief, ag: relief, sw: { blink: 0.4, browTilt: 12 }, ba: { blink: 0.4, browTilt: -8 } },
        }}
      />
      {/* split-frame grade: hot left, cool right, soft seam */}
      <defs>
        <linearGradient id="e3split" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FF5A1F" stopOpacity={0.16} />
          <stop offset="0.45" stopColor="#FF5A1F" stopOpacity={0.06} />
          <stop offset="0.55" stopColor="#7FB8E6" stopOpacity={0.06 * rain} />
          <stop offset="1" stopColor="#7FB8E6" stopOpacity={0.18 * rain} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#e3split)" />
      <Vignette o={0.55} />
    </World>
  );
};

/** 1891-1994: "तो इसलिए मुस्कुराया था वो..." - slow push on Swarbhanu as he works out Vishnu's trick. */
export const Realise: React.FC<{ f: number }> = ({ f }) => {
  // tight on Swarbhanu's face (world ~240,1473 -> screen ~540,900)
  const cam: Cam = { x: -300, y: 600, z: track(f, [[1891, 3.4], [1994, 3.8, "io"]]) };
  const ring = ramp(f, CUES.smileWord, CUES.smileWord + 30, "out");
  return (
    <World>
      <ChurnStage
        f={f}
        cam={cam}
        fx={{
          heave: 0.6,
          spin: 0.5 * Math.sin(f / 13),
          glow: 0.2,
          heat: 0.7,
          fade: { sw: 0.2, ba: 0.25 },
          vasuki: { smoke: 0.8 },
          expr: { sw: { talk: talk3("10_swarbhanu", f), browTilt: 16, smile: -0.3, lookX: 0.9, blink: 0.15, head: -4 } },
        }}
      />
      {/* a faint gold ring: the memory of Vishnu's smile */}
      {ring > 0.01 && ring < 0.99 ? (
        <circle cx={540} cy={900} r={140 + 380 * ring} fill="none" stroke="#FFD27A" strokeWidth={6} opacity={0.6 * (1 - ring)} filter="url(#mGlow)" />
      ) : null}
      <Vignette o={0.72} />
    </World>
  );
};

/** 1994-2131: Bali holds on: "छोड़ना मत। अमृत के लिए ये आग भी सह लेंगे।" Then the sea begins to darken. */
export const Hold: React.FC<{ f: number }> = ({ f }) => {
  const cam: Cam = { x: -380, y: 524, z: track(f, [[1994, 2.2], [2131, 2.35, "io"]]) };
  const dark = ramp(f, CUES.afterBali - 6, CUES.afterBali + 10);
  return (
    <World>
      <ChurnStage
        f={f}
        cam={cam}
        fx={{
          heave: 0.85,
          spin: 0.6 * Math.sin(f / 13),
          glow: 0.2,
          heat: 0.7,
          fade: { ba: 0.15, sw: 0.25 },
          vasuki: { smoke: 0.8 },
          expr: { ba: { talk: talk3("11_bali", f), browTilt: 16, glow: 0.3, head: -6 }, sw: { browTilt: 14, lookX: 0.6 } },
        }}
      />
      <rect width={W} height={H} fill="#14205A" opacity={0.25 * dark} />
      <Vignette o={0.65} />
    </World>
  );
};
