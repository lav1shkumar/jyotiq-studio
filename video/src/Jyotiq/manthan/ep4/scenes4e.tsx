import React from "react";
import { shake, World } from "../kit";
import { blinkAt, pose, Puppet, Who } from "../rig";
import { Cam, Motes, Vignette } from "../sets";
import { H, ramp, rnd, track, W } from "../style";
import { ChurnStage } from "../ep3/stage3";
import { KailashBg } from "./kailash4";
import { talk4 } from "./kit4";
import { CUES, SCENES } from "./timing";

/* Episode 4 scenes, part E: "हर हर महादेव!" and the end bed. */

type Member = { who: Who; id: string; x: number; base: number; s: number; facing: number; line?: string };

const FRONT: Member[] = [
  { who: "bali", id: "chb", x: 330, base: 1800, s: 0.66, facing: 1, line: "09_bali" },
  { who: "indra", id: "chi", x: 750, base: 1810, s: 0.66, facing: -1, line: "09_indra" },
];
const CROWD: Member[] = [
  { who: "swarbhanu", id: "chs", x: 120, base: 1640, s: 0.46, facing: 1 },
  { who: "asuraJade", id: "chj", x: 250, base: 1600, s: 0.4, facing: 1 },
  { who: "asuraSlate", id: "chl", x: 400, base: 1620, s: 0.42, facing: 1 },
  { who: "asuraIron", id: "chr", x: 520, base: 1580, s: 0.36, facing: 1 },
  { who: "chandra", id: "chc", x: 600, base: 1590, s: 0.38, facing: -1 },
  { who: "agni", id: "cha", x: 700, base: 1630, s: 0.42, facing: -1 },
  { who: "surya", id: "chu", x: 860, base: 1610, s: 0.44, facing: -1 },
  { who: "vayu", id: "chv", x: 980, base: 1640, s: 0.44, facing: -1 },
  { who: "deva", id: "chd", x: 470, base: 1540, s: 0.32, facing: -1 },
  { who: "asura", id: "chz", x: 820, base: 1540, s: 0.32, facing: 1 },
];

/** 1240-1338: devtas and asuras together, arms raised: "हर हर महादेव!"; the conch, and light from the peak. */
export const ChantScene: React.FC<{ f: number }> = ({ f }) => {
  const [a] = SCENES.chant;
  const up = ramp(f, a, a + 10, "out");
  const pumpAt = [CUES.chant, CUES.chant + 13, CUES.chant + 26];
  const pump = (seed: string) => pumpAt.reduce((m, p) => Math.max(m, f >= p - 1 + rnd(seed) * 2 ? Math.exp(-(f - p) / 5) : 0), 0);
  const burst = ramp(f, CUES.conch - 2, CUES.conch + 30, "out");
  const [sx, sy] = shake(f, CUES.conch, 14, 10);
  const cam: Cam = { x: 0, y: 0, z: track(f, [[a, 1.02], [SCENES.chant[1], 1.1, "io"]]) };
  const z = cam.z;
  const member = (m: Member, k: number) => {
    const pm = pump(m.id);
    const q = pose({
      sF: 18 + (150 + 12 * pm) * up * k, eF: 30 - 18 * up, wF: -10,
      sB: -6 + (140 + 10 * pm) * up * k, eB: 26 - 14 * up,
      lean: -4 * up, head: -6 * up, lookY: -0.5 * up, smile: 0.7 * up, brow: 0.5, browTilt: -2,
      bob: -6 * pm, talk: m.line ? talk4(m.line, f) : 0.5 * pm, blink: blinkAt(m.id, f),
    });
    return <Puppet key={m.id} id={m.id} who={m.who} at={{ x: m.x, y: m.base - 245 * m.s, s: m.s, facing: m.facing }} p={q} t={f} />;
  };
  return (
    <World dx={sx} dy={sy}>
      <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
        <KailashBg f={f} dawn={0.65 + 0.2 * burst} id="ch4b" />
        {/* the conch's light: rays from the peak */}
        <g opacity={burst * (1 - 0.5 * ramp(f, CUES.conch + 20, SCENES.chant[1] + 10))}>
          {Array.from({ length: 14 }, (_, i) => {
            const ang = (i / 14) * Math.PI * 2;
            const r = 200 + 900 * burst;
            return <path key={i} d={`M540 640L${540 + Math.cos(ang - 0.06) * r} ${640 + Math.sin(ang - 0.06) * r}L${540 + Math.cos(ang + 0.06) * r} ${640 + Math.sin(ang + 0.06) * r}Z`} fill="#FFF1C8" opacity={0.35} />;
          })}
          <circle cx={540} cy={640} r={80 + 260 * burst} fill="#FFF6D8" opacity={0.5} filter="url(#mBlur8)" />
        </g>
        <path d="M-200 1520C200 1490 800 1500 1300 1520L1300 2100L-200 2100Z" fill="#D7DFF2" />
        <path d="M-200 1520C200 1490 800 1500 1300 1520" stroke="#F2F6FF" strokeWidth={6} fill="none" />
        {CROWD.map((m) => member(m, 0.92))}
        {FRONT.map((m) => member(m, 1))}
      </g>
      <Motes f={f} n={40} seed="ch4m" color="#FFE6A3" dir={-1} speed={0.6} size={3} o={0.6} />
      <rect width={W} height={H} fill="#FFF6D8" opacity={0.45 * (1 - ramp(f, CUES.conch, CUES.conch + 10, "out")) * (f >= CUES.conch ? 1 : 0)} />
      <Vignette o={0.45} />
    </World>
  );
};

/** 1338-1761: the churning resumes, a gold glow rising under the sea (Lakshmi is coming), dimmed under the end card. */
export const EndBed4: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.end;
  const cam: Cam = { x: 0, y: 0, z: track(f, [[a, 1.0], [b, 1.07, "io"]]) };
  const gold = 0.6 + 0.4 * Math.sin(f / 14);
  return (
    <World>
      <ChurnStage f={f} cam={cam} fx={{ heave: 0.6, spin: 0.45 * Math.sin(f / 13), glow: 0.9, vasuki: { eye: 1 } }} />
      <ellipse cx={540} cy={1560} rx={520} ry={160} fill="#FFD36B" opacity={0.35 * gold} filter="url(#mBlur8)" />
      <ellipse cx={540} cy={1560} rx={220} ry={60} fill="#FFF1C8" opacity={0.3 * gold} filter="url(#mBlur8)" />
      <Motes f={f} n={36} seed="eb4m" color="#FFE6A3" dir={-1} speed={0.5} size={3} o={0.7} />
      <rect width={W} height={H} fill="#0C0A07" opacity={ramp(f, CUES.endCard, CUES.endCard + 14) * 0.58} />
      <Vignette o={0.7} />
    </World>
  );
};
