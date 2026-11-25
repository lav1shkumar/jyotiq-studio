import React from "react";
import { shake, World } from "../kit";
import { blinkAt, idle, pose, Puppet, Who } from "../rig";
import { AsuraCourt, Cam, Layer, Vignette } from "../sets";
import { ramp, rnd } from "../style";
import { Mandar } from "./beings2";
import { SandhiArt } from "./graphics2";
import { MandarRange } from "./sets2";
import { CUES, SCENES } from "./timing";

/* Episode 2: the truce and the uprooting (1473-1815).
   1473-1643 "Shastra kehte hain... shatru se bhi sandhi ki jaati hai": Indra and Bali step together and
             clasp forearms on "sandhi"; freeze, warm flash, gold संधि line-art draws on.
   1643-1815 "Aur dono ne milkar jad se ukhaad diya... Mandarachal Parvat!": both sides strain under
             Mandar; on "ukhaad" the roots tear (crater, dust, shake); the mountain rises over their
             hands and the camera pulls back to show it whole on "Mandarachal". */

const Rays: React.FC<{ x: number; y: number; o: number; f: number; n?: number; len?: number }> = ({ x, y, o, f, n = 16, len = 900 }) => (
  <g transform={`translate(${x} ${y}) rotate(${f * 0.4})`} opacity={o}>
    {new Array(n).fill(0).map((_, i) => (
      <path key={i} d={`M-14 -40L0 -${len}L14 -40Z`} fill="#FFD36B" transform={`rotate(${(i * 360) / n})`} />
    ))}
  </g>
);

export const SandhiClasp: React.FC<{ f: number }> = ({ f }) => {
  const c0 = CUES.clasp;
  const fz = Math.min(f, c0);
  const frozen = ramp(f, c0, c0 + 3);
  const walk = ramp(fz, SCENES.sandhi[0], c0 - 16, "io");
  const reach = ramp(fz, c0 - 16, c0, "out");
  const cam: Cam = { x: 0, y: 120 + 30 * walk, z: 1.45 + 0.12 * walk };
  const flash = f >= c0 && f < c0 + 4 ? 1 - (f - c0) / 4 : 0;
  const step = -Math.abs(Math.sin(walk * Math.PI * 3)) * 10 * (1 - reach);
  const arm = { sF: 10 + 72 * reach, eF: 24 - 18 * reach, wF: 0, fist: reach };
  const ind = pose({ ...idle("sc-i", fz, 0.4), blink: blinkAt("sc-i", fz), ...arm, sB: -4, eB: 12, head: -2, smile: 0.2 * reach, lookX: 0.8, browTilt: 4 });
  const bal = pose({ ...idle("sc-b", fz, 0.4), blink: blinkAt("sc-b", fz), ...arm, sB: -4, eB: 12, head: -2, smile: 0.35 * reach, lookX: 0.8, browTilt: 6 });
  const S = 1.25;
  // Shoulders end ~380 px apart so each hand lands on the other's forearm.
  const ix = 200 + 100 * walk;
  const bx = 880 - 100 * walk;
  return (
    <World>
      <AsuraCourt f={fz} cam={cam} />
      <rect width={1080} height={1920} fill="#24163F" opacity={0.45 * frozen} />
      {frozen > 0 ? <Rays x={540} y={1045} o={0.35 * frozen} f={f} /> : null}
      <Puppet id="sc-indra" who="indra" at={{ x: ix, y: 1240 + step, s: S, facing: 1 }} p={ind} t={fz} />
      <Puppet id="sc-bali" who="bali" at={{ x: bx, y: 1240 + step, s: S, facing: -1 }} p={bal} t={fz} />
      {frozen > 0 ? (
        <g opacity={frozen}>
          <SandhiArt f={f} d={ramp(f, c0 + 2, c0 + 30, "io")} x={540} y={400} />
        </g>
      ) : null}
      {flash > 0 ? <rect width={1080} height={1920} fill="#FFF2CC" opacity={0.8 * flash} /> : null}
      <Vignette o={0.95} />
    </World>
  );
};

/* ------------------------------------------------------------------ */

const UP = { x: 540, base: 1640, sx: 0.95, sy: 0.95 };
// Four lift from under the mountain with arms up; the two outer ones brace its flanks at an angle.
const LIFTERS: { who: Who; x: number; face: 1 | -1; seed: string; brace?: boolean }[] = [
  { who: "asuraSlate", x: 235, face: 1, seed: "u1", brace: true },
  { who: "swarbhanu", x: 360, face: 1, seed: "u2" },
  { who: "bali", x: 460, face: 1, seed: "u3" },
  { who: "indra", x: 620, face: -1, seed: "u4" },
  { who: "surya", x: 720, face: -1, seed: "u5" },
  { who: "agni", x: 845, face: -1, seed: "u6", brace: true },
];

const DustBurst: React.FC<{ k: number; x: number; y: number }> = ({ k, x, y }) => (
  <g filter="url(#mBlur8)">
    {new Array(18).fill(0).map((_, i) => {
      const side = i % 2 ? 1 : -1;
      const t = Math.min(1, k * (0.6 + 0.8 * rnd(`db${i}`)));
      const px = x + side * (120 + 380 * t * (0.4 + rnd(`dx${i}`)));
      const py = y - 20 - 160 * t * rnd(`dy${i}`);
      const r = 40 + 120 * t * (0.5 + rnd(`dr${i}`));
      return <circle key={i} cx={px} cy={py} r={r} fill={i % 3 ? "#B88A62" : "#D9B58C"} opacity={0.75 * (1 - t) + 0.1} />;
    })}
  </g>
);

export const Uproot: React.FC<{ f: number }> = ({ f }) => {
  const t0 = CUES.tear;
  const strain = ramp(f, CUES.uproot, CUES.uproot + 20);
  const jolt = ramp(f, t0, t0 + 4, "out");
  const lift = ramp(f, t0 + 4, CUES.mandar + 14, "io");
  const base = UP.base - 50 * jolt - 250 * lift;
  const tremble = f < t0 ? Math.sin(f * 1.7) * 2.5 * strain : 0;
  const [sx, sy] = shake(f, t0, 18, 18);
  const pull = ramp(f, CUES.mandar - 20, CUES.mandar + 30, "io");
  const cam: Cam = { x: 0, y: 400 * (1 - pull) + 40, z: 1.35 - 0.33 * pull };
  const dust = Math.max(0, 0.25 * strain + 0.6 * ramp(f, t0, t0 + 10) - 0.45 * ramp(f, t0 + 30, t0 + 100));
  const burst = ramp(f, t0, t0 + 40);
  return (
    <World dx={sx} dy={sy}>
      <MandarRange f={f} cam={cam} dust={dust} />
      <Layer cam={cam} depth={0.85}>
        {jolt > 0 ? (
          <g opacity={jolt}>
            <ellipse cx={UP.x} cy={1590} rx={290} ry={38} fill="#140A10" />
            {new Array(9).fill(0).map((_, i) => {
              const a = Math.PI * (0.05 + (0.9 * i) / 8);
              const L = 160 + 120 * rnd(`ck${i}`);
              return (
                <path
                  key={i}
                  d={`M${UP.x + Math.cos(a) * 280} ${1590 + Math.sin(a) * 32}l${Math.cos(a) * L * 0.5} ${Math.sin(a) * 18}l${Math.cos(a) * L * 0.5} ${Math.sin(a) * 26}`}
                  stroke="#140A10"
                  strokeWidth={6}
                  fill="none"
                />
              );
            })}
          </g>
        ) : null}
        <g transform={`translate(${UP.x + tremble} ${base}) scale(${UP.sx} ${UP.sy})`}>
          <Mandar t={f} roots={jolt} glow={0.4 + 0.6 * ramp(f, CUES.mandar, CUES.mandar + 10)} />
        </g>
        {/* ground in front of the mountain's foot, so it starts buried */}
        <path d="M-200 1572Q540 1540 1280 1572L1280 2100L-200 2100Z" fill="#2B1C28" />
        <path d="M-200 1572Q540 1540 1280 1572" stroke="#E8A06A" strokeWidth={4} opacity={0.35} fill="none" />
        {LIFTERS.map((m) => (
          <Puppet
            key={m.seed}
            id={`up-${m.seed}`}
            who={m.who}
            at={{ x: m.x + (f < t0 ? Math.sin(f * 2.1 + m.x) * 1.5 * strain : 0), y: 1650 - 252 * 0.46, s: 0.46, facing: m.face }}
            p={pose({
              ...idle(m.seed, f, 0.3),
              blink: blinkAt(m.seed, f),
              lean: m.brace ? 16 + 4 * strain : 6 + 4 * strain,
              head: m.brace ? -4 : -12,
              sF: m.brace ? 118 + 20 * lift : 150 + 14 * lift,
              eF: m.brace ? 14 : 22 - 12 * lift,
              wF: -10,
              sB: m.brace ? 108 + 20 * lift : 140 + 14 * lift,
              eB: m.brace ? 18 : 26 - 12 * lift,
              wB: -10,
              fist: 0,
              browTilt: 14 * strain,
              lookX: 0.6,
              lookY: -0.6,
            })}
            t={f}
          />
        ))}
        {burst > 0 && burst < 1 ? <DustBurst k={burst} x={UP.x} y={1600} /> : null}
      </Layer>
      <Vignette o={0.85} />
    </World>
  );
};
