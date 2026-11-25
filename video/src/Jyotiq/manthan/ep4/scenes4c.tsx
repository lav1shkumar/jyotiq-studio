import React from "react";
import { World } from "../kit";
import { handToWorld, pose, Pose } from "../rig";
import { Motes, Vignette } from "../sets";
import { ramp, track } from "../style";
import { KailashBg } from "./kailash4";
import { PoisonOrb, ShivaSeated, Trishul } from "./cast4";
import { ParvatiProps, ParvatiSeated } from "./parvati";
import { PALM_POSE, palmWorld, PoisonStreams, SH_AT } from "./scenes4a";
import { talk4 } from "./kit4";
import { CUES, SCENES } from "./timing";

/* Episode 4 scenes, part C: Mahadev and Bhavani. */

export const PV_AT = { x: 748, y: 1452, s: 0.72, facing: -1 };
export const SHIVA_FACE: [number, number] = [572, 1200];
export const PARVATI_FACE: [number, number] = [750, 1258];

/** World camera: world point (cx, cy) at the frame centre, zoom z. */
export const Shot: React.FC<{ cx: number; cy: number; z: number; children: React.ReactNode }> = ({ cx, cy, z, children }) => (
  <g transform={`translate(540 960) scale(${z}) translate(${-cx} ${-cy})`}>{children}</g>
);

/** Kailash behind the couple with half the camera's motion (parallax). */
export const Backdrop: React.FC<{ f: number; cx: number; cy: number; z: number; dawn?: number; id: string }> = ({ f, cx, cy, z, dawn = 0, id }) => (
  <Shot cx={540 + (cx - 540) * 0.5} cy={960 + (cy - 960) * 0.5} z={1 + (z - 1) * 0.5}>
    <KailashBg f={f} dawn={dawn} id={id} />
  </Shot>
);

export type CoupleProps = {
  f: number;
  shiva?: Partial<React.ComponentProps<typeof ShivaSeated>> & { p?: Partial<Pose> };
  parvati?: Partial<ParvatiProps>;
  trishulGlow?: number;
};

/** Mahadev and Parvati seated together on Kailash, the trishul planted behind them. */
export const Couple: React.FC<CoupleProps> = ({ f, shiva = {}, parvati = {}, trishulGlow = 0 }) => (
  <g>
    <g transform="translate(712 1530) scale(0.8)">
      <Trishul f={f} glow={trishulGlow} />
    </g>
    <ParvatiSeated id="pv4" f={f} {...PV_AT} part="body" {...parvati} />
    <ShivaSeated id="sh4" f={f} {...SH_AT} {...shiva} />
    <ParvatiSeated id="pv4" f={f} {...PV_AT} part="arm" {...parvati} />
  </g>
);

/** 412-551: his eyes open; on "भवानी" he turns to her and speaks. */
export const ShivaScene: React.FC<{ f: number }> = ({ f }) => {
  const eyes = ramp(f, CUES.eyesOpen, CUES.eyesOpen + 14, "io");
  const turn = ramp(f, CUES.bhavani - 2, CUES.bhavani + 10, "io");
  const pull = ramp(f, CUES.bhavani, CUES.bhavani + 30, "io");
  const cx = track(pull, [[0, SHIVA_FACE[0]], [1, 652]]);
  const cy = track(pull, [[0, SHIVA_FACE[1] + 10], [1, 1250]]);
  const z = track(pull, [[0, 3.0], [1, 2.0]]) * (1 + 0.03 * ramp(f, CUES.bhavani + 30, SCENES.shiva[1], "io"));
  return (
    <World>
      <Backdrop f={f} cx={cx} cy={cy} z={z} id="sc4b" />
      <Shot cx={cx} cy={cy} z={z}>
        <Couple
          f={f}
          shiva={{ eyes, halo: 0.6 + 0.3 * eyes, throat: 0, talk: talk4("04_shiva", f), p: { lookX: 0.2 + 0.7 * turn, head: 4 * turn, smile: 0.3 } }}
          parvati={{ reach: 0, lookX: 0.8, smile: 0.4 }}
        />
      </Shot>
      <Motes f={f} n={20} seed="sc4m" color="#CFE7FF" dir={-1} speed={0.25} size={2.4} o={0.5 * eyes} />
      <Vignette o={0.55} />
    </World>
  );
};

/* ------------------------------------------------------------------ */
/* The palm and the drink                                              */
/* ------------------------------------------------------------------ */

const REST_ARM = { sF: 18, eF: -10, wF: -6 };
const BASE_P = { sB: -16, eB: 44, wB: 10 };
/** Front-arm angles that put the hand's prop origin on a world point (grid search, solved once). */
const solveArm = (target: [number, number], wF: number) => {
  let best = { sF: 0, eF: 0, d: 1e9 };
  for (let sF = -40; sF <= 150; sF += 2) {
    for (let eF = 0; eF <= 160; eF += 2) {
      const [x, y] = handToWorld(pose({ ...BASE_P, sF, eF, wF }), SH_AT, true);
      const d = (x - target[0]) ** 2 + (y - target[1]) ** 2;
      if (d < best.d) best = { sF, eF, d };
    }
  }
  return { sF: best.sF, eF: best.eF, wF };
};
// the mouth sits at head (24, -37): world ~ (581, 1229); the orb rides ~40 px above the palm
export const LIPS_ARM = solveArm([592, 1262], -40);
const mixArm = (a: { sF: number; eF: number; wF: number }, b: { sF: number; eF: number; wF: number }, k: number) => ({
  sF: a.sF + (b.sF - a.sF) * k,
  eF: a.eF + (b.eF - a.eF) * k,
  wF: a.wF + (b.wF - a.wF) * k,
});
/** Heartbeat hits, the same schedule as manthan_ep4_score.py's drums (lub at t, dub at t + 0.2 s). */
const BEATS_PALM: number[] = (() => {
  const out: number[] = [];
  let t = SCENES.palm[0] / 30;
  let iv = 0.95;
  while (t < CUES.drink / 30 - 0.3) {
    out.push(t * 30, (t + 0.2) * 30);
    iv = Math.max(0.48, iv * 0.93);
    t += iv;
  }
  return out;
})();
const heartbeat = (f: number) => BEATS_PALM.reduce((m, b) => Math.max(m, f >= b ? Math.exp(-(f - b) / 3) : 0), 0);

/** 679-813: he raises his palm, the poison streams into it, he lifts it to his lips. */
export const PalmScene: React.FC<{ f: number }> = ({ f }) => {
  const raise = ramp(f, SCENES.palm[0] + 2, CUES.hatheli, "io");
  const lift = ramp(f, CUES.uthaya, CUES.pee + 4, "io");
  const arm = lift > 0 ? mixArm(PALM_POSE, LIPS_ARM, lift) : mixArm(REST_ARM, PALM_POSE, raise);
  const gather = ramp(f, CUES.gather - 8, CUES.hatheli + 6, "io") * (1 - ramp(f, CUES.uthaya, CUES.uthaya + 14, "io"));
  const orb = 0.2 + 1.4 * ramp(f, CUES.gather, CUES.uthaya, "io");
  const [px, py] = palmWorld();
  const hb = heartbeat(f);
  const dark = ramp(f, SCENES.palm[0], CUES.hatheli, "io");
  const cx = 610 + 20 * lift;
  const cy = track(f, [[SCENES.palm[0], 1280], [CUES.drink, 1235, "io"]]);
  const z = track(f, [[SCENES.palm[0], 1.85], [CUES.drink, 2.35, "in"]]) * (1 + 0.012 * hb);
  return (
    <World>
      <Backdrop f={f} cx={cx} cy={cy} z={z} id="pa4b" />
      <rect width={1080} height={1920} fill="#0B1240" opacity={0.35 * dark} />
      <Shot cx={cx} cy={cy} z={z}>
        <PoisonStreams f={f} to={[px, py - 30]} k={gather} n={8} spread={700} />
        <Couple
          f={f}
          shiva={{ eyes: 1 - 0.6 * lift, halo: 0.7, throat: 0, p: { ...arm, head: -4 + 4 * lift, lookX: 0.5, lookY: 0.4 - 0.6 * lift, smile: 0.1 }, prop: <PoisonOrb f={f} k={orb} /> }}
          parvati={{ reach: 1 - ramp(f, SCENES.palm[0], CUES.hatheli, "io"), lookX: 0.8, smile: 0.1, lookDown: 0.2 }}
        />
      </Shot>
      <rect width={1080} height={1920} fill="#40D8E8" opacity={0.06 * dark + 0.05 * hb} />
      <Motes f={f} n={30} seed="pa4m" color="#40D8E8" dir={-1} speed={0.7} size={2.6} o={0.6 * gather} />
      <Vignette o={0.6 + 0.1 * dark} />
    </World>
  );
};

/** 813-873: he drinks; a ring of light; the poison's dark leaves the sky and the colour returns. */
export const DrinkScene: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.drink;
  const sip = ramp(f, a, a + 22, "io");
  const flash = ramp(f, a - 2, a + 1) * (1 - ramp(f, a + 2, a + 12, "out"));
  const back = ramp(f, CUES.colourBack - 6, b, "io");
  const ring = ramp(f, CUES.colourBack - 4, CUES.colourBack + 26, "out");
  const z = track(f, [[a, 3.2], [b, 2.6, "io"]]);
  const [cx, cy] = [SHIVA_FACE[0] + 8, SHIVA_FACE[1] + 30];
  return (
    <World>
      <Backdrop f={f} cx={cx} cy={cy} z={z} dawn={0.65 * back} id="dr4b" />
      <rect width={1080} height={1920} fill="#0B1240" opacity={0.35 * (1 - back)} />
      <Shot cx={cx} cy={cy} z={z}>
        <ellipse cx={SHIVA_FACE[0]} cy={SHIVA_FACE[1] - 20} rx={60 + 520 * ring} ry={60 + 520 * ring} fill="none" stroke="#FFF1C8" strokeWidth={10 * (1 - ring) + 1} opacity={0.8 * (1 - ring) * (ring > 0 ? 1 : 0)} />
        <Couple
          f={f}
          shiva={{
            eyes: 0, halo: 0.7 + 0.5 * back, throat: 0.35 * back,
            p: { ...LIPS_ARM, head: 2 - 4 * back, lookY: -0.2, smile: 0.25 * back },
            prop: sip < 1 ? <PoisonOrb f={f} k={1.6 * (1 - sip)} /> : undefined,
          }}
          parvati={{ reach: 0.6 * back, lookX: 0.8, smile: 0.2 + 0.3 * back }}
        />
        <circle cx={SHIVA_FACE[0] + 10} cy={SHIVA_FACE[1] + 40} r={90} fill="#40D8E8" opacity={0.3 * (1 - sip) + 0.15 * (1 - back)} filter="url(#mBlur8)" />
      </Shot>
      <Motes f={f} n={30} seed="dr4m" color="#FFE6A3" dir={-1} speed={0.5} size={2.6} o={0.6 * back} />
      <Vignette o={0.55} />
      <rect width={1080} height={1920} fill="#E6FDFF" opacity={0.85 * flash} />
    </World>
  );
};

/** 551-679: Parvati knew his power (a gold shakti glow); on "हाँ" her hand goes to his shoulder and she nods. */
export const ParvatiScene: React.FC<{ f: number }> = ({ f }) => {
  const shakti = ramp(f, CUES.shakti - 6, CUES.shakti + 14, "io") * (1 - 0.4 * ramp(f, CUES.haan + 10, SCENES.parvati[1], "io"));
  const reach = ramp(f, CUES.haan - 30, CUES.haan, "io");
  const nod = Math.max(0, Math.sin(Math.PI * Math.min(1, Math.max(0, (f - CUES.haan + 2) / 16)))) * 0.9;
  const wide = ramp(f, CUES.haan - 24, CUES.haan + 6, "io");
  const cx = track(wide, [[0, PARVATI_FACE[0] - 10], [1, 662]]);
  const cy = track(wide, [[0, PARVATI_FACE[1] + 20], [1, 1255]]);
  const z = track(wide, [[0, 2.9], [1, 2.05]]);
  return (
    <World>
      <Backdrop f={f} cx={cx} cy={cy} z={z} id="pc4b" />
      <Shot cx={cx} cy={cy} z={z}>
        {/* her shakti: a warm gold glow behind her */}
        <circle cx={PARVATI_FACE[0]} cy={PARVATI_FACE[1] - 10} r={120} fill="#FFD36B" opacity={0.35 * shakti} filter="url(#mBlur8)" />
        <circle cx={PARVATI_FACE[0]} cy={PARVATI_FACE[1] - 10} r={70} fill="none" stroke="#FFE6A3" strokeWidth={2} opacity={0.4 * shakti} />
        <Couple
          f={f}
          shiva={{ eyes: 1, halo: 0.8, throat: 0, p: { lookX: 0.9, head: 4, smile: 0.35 } }}
          parvati={{ reach, nod, lookX: 0.8, smile: 0.45 + 0.15 * reach, lookDown: 0.3 * nod }}
        />
      </Shot>
      <Motes f={f} n={24} seed="pc4m" color="#FFE6A3" dir={-1} speed={0.3} size={2.6} o={0.6 * shakti} />
      <Vignette o={0.55} />
    </World>
  );
};
