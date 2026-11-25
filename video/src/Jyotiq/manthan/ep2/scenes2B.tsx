import React from "react";
import { SeatedLegs } from "../beings";
import { shake, World } from "../kit";
import { blinkAt, handToWorld, idle, Pose, pose, Puppet, Who } from "../rig";
import { AsuraCourt, Cam, Kalash, Layer, Vignette } from "../sets";
import { P, ramp, rnd, track } from "../style";
import { mouth } from "./talk2";
import { CUES } from "./timing";

/* Episode 2 court, part 1 (452-802).
   452-600 wide: the devtas stand unarmed before Bali's throne; at "spears" the guards lower their spears.
   600-676 Indra's empty hands, spear tips at his chest ("Nihatthe."); thunder flash before Bali speaks.
   676-745 Bali: "रुको!" - impact frame on his raised palm.
   745-802 back to the wide: the guards lift their spears on his word. */

const Spear2: React.FC<{ tilt?: number }> = ({ tilt = 0 }) => (
  <g transform={`rotate(${tilt})`}>
    <rect x={-4} y={-330} width={8} height={560} rx={3} fill="#3A2414" />
    <path d="M0 -400L16 -330L-16 -330Z" fill="#B8C2CC" />
    <path d="M0 -400L4 -330L-4 -330Z" fill="#EEF3F7" />
    <path d="M-14 -330H14" stroke={P.gold} strokeWidth={5} />
  </g>
);

/** Anime focus lines converging on (cx, cy). */
const FocusLines: React.FC<{ cx: number; cy: number; o: number; seed: string }> = ({ cx, cy, o, seed }) => (
  <g opacity={o}>
    {new Array(40).fill(0).map((_, i) => {
      const a = (i / 40) * Math.PI * 2 + rnd(`${seed}${i}`) * 0.1;
      const r0 = 300 + rnd(`${seed}r${i}`) * 200;
      const w = 0.012 + rnd(`${seed}w${i}`) * 0.018;
      const q = (r: number, da: number) => `${(cx + Math.cos(a + da) * r).toFixed(0)} ${(cy + Math.sin(a + da) * r).toFixed(0)}`;
      return <path key={i} d={`M${q(r0, 0)}L${q(1700, -w)}L${q(1700, w)}Z`} fill="#FFE7B0" opacity={0.45} />;
    })}
  </g>
);

/** Bali seated on his throne (AsuraCourt's throne layer, depth 0.3), facing the devtas on the left. */
export const BALI_SEAT = { x: 540, y: 1116, s: 0.5, facing: -1 };
export const BaliThrone: React.FC<{ id: string; f: number; p: Pose }> = ({ id, f, p }) => (
  <>
    <g transform={`translate(${BALI_SEAT.x} ${BALI_SEAT.y}) scale(${-BALI_SEAT.s} ${BALI_SEAT.s})`}>
      <SeatedLegs who="bali" />
    </g>
    <Puppet id={id} who="bali" at={BALI_SEAT} p={p} t={f} noLegs />
  </>
);

const GUARDS = [
  { x: 770, s: 0.66, seed: "g1" },
  { x: 935, s: 0.66, seed: "g2" },
];
export const COURT_DEVTAS: { who: Who; x: number; s: number; seed: string }[] = [
  { who: "agni", x: 150, s: 0.7, seed: "da" },
  { who: "surya", x: 285, s: 0.71, seed: "ds" },
  { who: "indra", x: 420, s: 0.72, seed: "di" },
];

const CW0: Cam = { x: 20, y: 60, z: 1.06 };
const CW1: Cam = { x: 30, y: 130, z: 1.26 };

export const CourtWide: React.FC<{ f: number }> = ({ f }) => {
  const second = f >= CUES.baliHalt; // the return to the wide after Bali's command
  const k = second ? 1 : ramp(f, 452, 600, "io");
  const cam: Cam = {
    x: CW0.x + (CW1.x - CW0.x) * k,
    y: CW0.y + (CW1.y - CW0.y) * k,
    z: CW0.z + (CW1.z - CW0.z) * k + (second ? 0.03 * ramp(f, 745, 802) : 0),
  };
  const tilt = 62 * ramp(f, CUES.spears, CUES.spears + 14, "out") - 62 * ramp(f, 750, 772, "io");
  const look = second ? ramp(f, 752, 776, "io") : 0;
  const id = second ? "b" : "a";
  const bali = pose({
    ...idle("bali-c", f, 0.4),
    blink: blinkAt("bali-c", f),
    sF: second ? 72 : 22,
    eF: second ? 18 : 58,
    sB: 28,
    eB: 70,
    browTilt: 12,
    lookX: 0.8,
    talk: mouth("bali", f),
  });
  return (
    <World>
      <AsuraCourt f={f} cam={cam} />
      <Layer cam={cam} depth={0.3}>
        <BaliThrone id={`cw${id}-bali`} f={f} p={bali} />
      </Layer>
      <Layer cam={cam} depth={0.65}>
        {GUARDS.map((g) => (
          <Puppet
            key={g.seed}
            id={`cw${id}-${g.seed}`}
            who="asura"
            at={{ x: g.x, y: 1640 - 252 * g.s, s: g.s, facing: -1 }}
            p={pose({ ...idle(g.seed, f, 0.5), blink: blinkAt(g.seed, f), sF: 34, eF: 70, browTilt: 16, lookX: 0.6 })}
            t={f}
            prop={<Spear2 tilt={tilt} />}
            upright
          />
        ))}
      </Layer>
      <Layer cam={cam} depth={0.9}>
        {COURT_DEVTAS.map((d) => (
          <Puppet
            key={d.seed}
            id={`cw${id}-${d.seed}`}
            who={d.who}
            at={{ x: d.x, y: 1800 - 252 * d.s, s: d.s, facing: 1 }}
            p={pose({
              ...idle(d.seed, f, 0.4),
              blink: blinkAt(d.seed, f),
              head: 10 - 8 * look,
              sF: 6,
              eF: 10,
              sB: -4,
              eB: 12,
              browTilt: -6,
              lookX: 0.7,
              lookY: 0.25 - 0.3 * look,
            })}
            t={f}
          />
        ))}
      </Layer>
      <Vignette o={0.9} />
    </World>
  );
};

export const IndraUnarmed: React.FC<{ f: number }> = ({ f }) => {
  const z = 1 + 0.05 * ramp(f, 600, 676);
  const th = CUES.baliHalt - 16; // thunder crack in the mix
  const flash = f >= th && f < th + 6 ? 0.65 * (1 - (f - th) / 6) : 0;
  const slide = ramp(f, 598, 622, "out");
  const p = pose({
    ...idle("iu", f, 0.5),
    blink: blinkAt("iu", f),
    head: 9,
    lean: 3,
    sF: 36,
    eF: 64,
    wF: -24,
    sB: 30,
    eB: 60,
    wB: -20,
    fist: 0,
    browTilt: -8,
    lookX: 0.5,
    lookY: 0.35,
  });
  return (
    <World>
      <AsuraCourt f={f} cam={{ x: -240, y: 160, z: 1.8 }} />
      <rect width={1080} height={1920} fill="#12060E" opacity={0.35} />
      <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
        {[0, 1].map((i) => (
          <g key={i} transform={`translate(${1660 - 260 * slide - i * 40} ${990 + i * 150}) rotate(-90) scale(1.5)`}>
            <Spear2 />
          </g>
        ))}
        <Puppet id="iu-indra" who="indra" at={{ x: 330, y: 1300, s: 1.85, facing: 1 }} p={p} t={f} />
      </g>
      {flash > 0 ? <rect width={1080} height={1920} fill="#F4F0FF" opacity={flash} /> : null}
      <Vignette o={0.95} />
    </World>
  );
};

export const BaliHalt: React.FC<{ f: number }> = ({ f }) => {
  const t0 = CUES.baliHalt;
  const raise = ramp(f, t0 - 4, t0 + 3, "out");
  const cam: Cam = { x: 0, y: 200, z: 4.2 + 0.25 * ramp(f, t0, 745, "io") };
  const [sx, sy] = shake(f, t0, 14, 14);
  const hit = f >= t0 && f < t0 + 4 ? 1 - (f - t0) / 4 : 0;
  const lines = f >= t0 ? Math.max(0, 1 - (f - t0) / 22) : 0;
  const p = pose({
    ...idle("bali-h", f, 0.3),
    blink: f > t0 + 30 ? blinkAt("bali-h", f) : 0,
    sF: 30 + 136 * raise,
    eF: 50 - 42 * raise,
    wF: -22 * raise,
    sB: 30,
    eB: 70,
    fist: 0,
    browTilt: 16,
    brow: 0.3 * raise,
    glow: 0.25 + 0.55 * hit,
    lookX: 0.9,
    talk: mouth("bali", f),
  });
  // Raised palm on screen (throne layer depth 0.3), for the impact effects.
  const hw = handToWorld(p, BALI_SEAT, true);
  const zd = 1 + (cam.z - 1) * 0.3;
  const px = (hw[0] - 540 - cam.x * 0.3) * zd + 540;
  const py = (hw[1] - 960 - cam.y * 0.3) * zd + 960;
  return (
    <World dx={sx} dy={sy}>
      <AsuraCourt f={f} cam={cam} />
      <Layer cam={cam} depth={0.3}>
        <BaliThrone id="bh-bali" f={f} p={p} />
      </Layer>
      {lines > 0 ? <FocusLines cx={px} cy={py} o={0.85 * lines} seed="bh" /> : null}
      {f >= t0 && f < t0 + 16 ? (
        <circle cx={px} cy={py} r={40 + (f - t0) * 46} fill="none" stroke="#FFE7B0" strokeWidth={14 * (1 - (f - t0) / 16)} opacity={1 - (f - t0) / 16} />
      ) : null}
      {hit > 0 ? <rect width={1080} height={1920} fill="#FFF6E4" opacity={0.8 * hit} /> : null}
      <Vignette o={0.95} />
    </World>
  );
};

/* ------------------------------------------------------------------ */
/* Court, part 2 (802-1473)                                            */
/* ------------------------------------------------------------------ */

/** 802-1033 Indra bows, then offers: "Aao, milkar Ksheer Sagar mathein... aur amrit baant lein." */
export const IndraBow: React.FC<{ f: number }> = ({ f }) => {
  const b0 = CUES.indraBow;
  const bow = ramp(f, b0, b0 + 14, "io") - ramp(f, b0 + 40, b0 + 60, "io");
  const offer = ramp(f, CUES.amritShare - 10, CUES.amritShare + 4, "out");
  const z = 1 + 0.06 * ramp(f, b0, 1033);
  const at = { x: 360, y: 1250, s: 1.6, facing: 1 };
  const p = pose({
    ...idle("ib", f, 0.5),
    blink: blinkAt("ib", f),
    lean: 4 + 18 * bow,
    head: 3 + 14 * bow,
    // anjali (joined hands) -> an open hand inviting on "Aao" -> both palms up on "baant lein"
    sF: track(f, [[b0, 30], [862, 30], [884, 58, "io"], [CUES.amritShare - 10, 58], [CUES.amritShare + 4, 44, "out"]]),
    eF: track(f, [[b0, 100], [862, 100], [884, 22, "io"], [CUES.amritShare - 10, 22], [CUES.amritShare + 4, 52, "out"]]),
    wF: -10 - 20 * offer,
    sB: track(f, [[b0, 34], [862, 34], [884, 10, "io"], [CUES.amritShare - 10, 10], [CUES.amritShare + 4, 30, "out"]]),
    eB: track(f, [[b0, 100], [862, 100], [884, 30, "io"], [CUES.amritShare - 10, 30], [CUES.amritShare + 4, 56, "out"]]),
    wB: -10 - 20 * offer,
    fist: 0,
    browTilt: -4 + 4 * ramp(f, 870, 884),
    smile: 0.15 * offer,
    lookX: 0.8,
    lookY: 0.1 * bow,
    talk: mouth("indra", f),
  });
  const hand = handToWorld(p, at, true);
  const kal = ramp(f, CUES.amritShare - 4, CUES.amritShare + 12, "out");
  return (
    <World>
      <AsuraCourt f={f} cam={{ x: -200, y: 120, z: 1.6 }} />
      <rect width={1080} height={1920} fill="#12060E" opacity={0.3} />
      <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
        <Puppet id="ib-indra" who="indra" at={at} p={p} t={f} />
        {kal > 0 ? (
          <g transform={`translate(${hand[0] + 24} ${hand[1] - 30 - 40 * kal}) scale(${0.45 * kal})`} opacity={kal}>
            <Kalash f={f} glow={1} />
          </g>
        ) : null}
      </g>
      <Vignette o={0.95} />
    </World>
  );
};

/** 1033-1271 Swarbhanu at Bali's ear: "Maharaj... aaj amrit baantenge? Zaroor koi chaal hai." */
const SWB_WHISPER = { x: 650, y: 1250 - 252 * 0.5, s: 0.5, facing: -1 };
const Glint: React.FC<{ x: number; y: number; k: number; f: number }> = ({ x, y, k, f }) => (
  <g transform={`translate(${x} ${y}) rotate(${f * 4}) scale(${0.35 + 0.75 * k})`} opacity={k}>
    <path d="M0 -40L6 -6L40 0L6 6L0 40L-6 6L-40 0L-6 -6Z" fill="#FFF3C4" />
    <circle r={8} fill="#FFFFFF" />
  </g>
);

export const Whisper: React.FC<{ f: number }> = ({ f }) => {
  const push = ramp(f, 1186, 1232, "io");
  const cam: Cam = { x: 40 + 70 * push, y: 120 - 40 * push, z: 3.9 + 0.7 * ramp(f, 1033, 1186, "io") + 0.8 * push };
  const glint = f >= CUES.trick ? Math.max(0, 1 - (f - CUES.trick) / 26) : 0;
  const lean = 16 - 4 * push;
  const sw = pose({
    ...idle("sw-w", f, 0.4),
    blink: f > 1180 ? 0 : blinkAt("sw-w", f),
    lean,
    head: 8,
    sF: 30,
    eF: 128, // hand raised beside his mouth, a whisper
    wF: -10,
    sB: 10,
    eB: 30,
    browTilt: 10 + 8 * push,
    smile: 0.25 + 0.35 * push,
    glow: 0.3 + 0.7 * glint,
    lookX: 0.9, // eyes past Bali, on the devtas
    talk: mouth("swarbhanu", f) * 0.7,
  });
  const bali = pose({
    ...idle("bali-w", f, 0.3),
    blink: blinkAt("bali-w", f),
    sF: 24,
    eF: 64,
    sB: 30,
    eB: 72,
    head: 4,
    browTilt: 6 + 6 * push,
    lookX: -0.2 + 0.9 * push,
  });
  const th = (lean * Math.PI) / 180;
  const s = SWB_WHISPER.s;
  const eye = { x: SWB_WHISPER.x - 51 * s - 289 * s * Math.sin(th), y: SWB_WHISPER.y - 289 * s * Math.cos(th) - 6 };
  return (
    <World>
      <AsuraCourt f={f} cam={cam} />
      <Layer cam={cam} depth={0.3}>
        <Puppet id="sw-whisper" who="swarbhanu" at={SWB_WHISPER} p={sw} t={f} />
        <BaliThrone id="bw-bali" f={f} p={bali} />
        {glint > 0 ? <Glint x={eye.x} y={eye.y} k={glint} f={f} /> : null}
      </Layer>
      <rect width={1080} height={1920} fill="#1A0612" opacity={0.25 * push} />
      <Vignette o={0.95} />
    </World>
  );
};

/** 1271-1473 Bali rises: "Chaal ho, toh bhi... amrit is jokhim ke laayak hai. Sandhi sweekar hai!" */
export const BaliAccept: React.FC<{ f: number }> = ({ f }) => {
  const r0 = CUES.baliRise;
  const a0 = CUES.baliAccept;
  const rise = ramp(f, r0, r0 + 18, "out");
  const acc = ramp(f, a0 - 4, a0 + 6, "out");
  const seal = f >= CUES.baliSeal ? Math.max(0, 1 - (f - CUES.baliSeal) / 8) : 0;
  const cam: Cam = { x: 0, y: 60, z: 5.0 + 0.25 * ramp(f, r0, a0 - 10, "io") + 0.5 * ramp(f, a0 - 10, CUES.baliSeal, "io") };
  const [sx, sy] = shake(f, CUES.baliSeal, 10, 10);
  const at = { x: 540, y: 1240 - 252 * 0.5 + 80 * (1 - rise), s: 0.5, facing: -1 };
  const p = pose({
    ...idle("bali-a", f, 0.4),
    blink: blinkAt("bali-a", f),
    lean: 10 * (1 - rise),
    head: -3 * acc,
    // a dismissive wave on "Chaal ho", a fist on "jokhim", the open hand raised on "Sandhi sweekar hai!"
    sF: track(f, [[r0, 20], [r0 + 20, 46, "io"], [1321, 46], [1336, 36, "io"], [a0 - 4, 36], [a0 + 6, 160, "out"]]),
    eF: track(f, [[r0, 60], [r0 + 20, 30, "io"], [1321, 30], [1336, 96, "io"], [a0 - 4, 96], [a0 + 6, 8, "out"]]),
    wF: -16,
    sB: 24,
    eB: 60,
    fist: track(f, [[1321, 0], [1336, 1], [a0 - 4, 1], [a0 + 4, 0]]),
    browTilt: 10 - 6 * acc,
    smile: 0.5 * acc,
    glow: 0.2 + 0.5 * acc,
    lookX: 0.8,
    talk: mouth("bali", f),
  });
  return (
    <World dx={sx} dy={sy}>
      <AsuraCourt f={f} cam={cam} />
      <Layer cam={cam} depth={0.3}>
        {acc > 0 ? (
          <g transform={`translate(540 1000) rotate(${f * 0.5})`} opacity={0.4 * acc}>
            {new Array(14).fill(0).map((_, i) => (
              <path key={i} d="M-10 -60L0 -330L10 -60Z" fill="#FFD36B" transform={`rotate(${i * (360 / 14)})`} />
            ))}
          </g>
        ) : null}
        <Puppet id="ba-bali" who="bali" at={at} p={p} t={f} />
      </Layer>
      {seal > 0 ? <rect width={1080} height={1920} fill="#FFE7A8" opacity={0.75 * seal} /> : null}
      <Vignette o={0.9} />
    </World>
  );
};
