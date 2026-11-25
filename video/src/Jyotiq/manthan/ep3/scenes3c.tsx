import React from "react";
import { shake, World } from "../kit";
import { Cam, KshiraSagar, Layer, Motes, Vignette } from "../sets";
import { H, ramp, track, W } from "../style";
import { KurmaFull } from "./kurma";
import { Boil as BoilFx, HalahalaColumn, SmokeDrift, Wither } from "./fx";
import { ChurnStage } from "./stage3";
import { CUES } from "./timing";
import { talk3 } from "./kit3";
import { Kailash } from "./kailash";
import { EndKundali3 } from "./gfx3";

/* Episode 3 scenes, part C: the ocean boils, the Halahala rises, Kailash, and the end card bed. */

/** 2131-2203: no line - the ocean of milk starts to boil and darken; Mandar on Kurma far off on the horizon. */
export const Boil: React.FC<{ f: number }> = ({ f }) => {
  const k = ramp(f, 2131, 2203, "in");
  const cam: Cam = { x: 0, y: 200, z: track(f, [[2131, 1.15], [2203, 1.3, "io"]]) };
  const wave = Math.sin(f / 11);
  return (
    <World>
      <KshiraSagar f={f} cam={cam} glow={0.08} swell={0.3 + 0.7 * k} />
      <Layer cam={cam} depth={0.5}>
        <g transform="translate(540 1086) scale(0.17)">
          <KurmaFull id="bo" t={f} glow={0.4} eye={1} headLift={0.6} mountainScale={0.6} />
        </g>
        <path d={`M-100 1150C240 ${1142 + wave * 4} 760 ${1158 - wave * 4} 1180 1150L1180 1300L-100 1300Z`} fill="#E6E0F0" opacity={0.9} />
      </Layer>
      <rect width={W} height={H} fill="#14205A" opacity={0.5 + 0.06 * k} />
      <Layer cam={cam} depth={0.7}>
        {/* the poison spreads out from under the mountain as a dark swirl, steam lifting off the sea
            (starts already dark so the cut from the Hold scene never flashes pale) */}
        <ellipse cx={540} cy={1250} rx={220 + 320 * k} ry={60 + 100 * k} fill="#0B1240" opacity={0.35 + 0.25 * k} filter="url(#mBlur8)" />
        <BoilFx cx={540} cy={1185} w={520} h={90} level={0.3 + 0.7 * k} f={f} seed="boilfar" />
        <SmokeDrift x0={0} y0={1180} w={1080} h={420} density={0.25 + 0.35 * k} f={f} seed="steam3" tint="#8C88B8" dir={-1} />
      </Layer>
      <Layer cam={cam} depth={1}>
        <BoilFx cx={540} cy={1600} w={1000} h={460} level={0.4 + 0.6 * ramp(f, 2131, 2180)} f={f} seed="boil3" />
      </Layer>
      <Vignette o={0.7} />
    </World>
  );
};

/** 2203-2426: "और तभी... अमृत से पहले, सागर से कुछ और निकला।" - the Halahala column erupts beside Mandar; everyone freezes. */
export const Rise: React.FC<{ f: number }> = ({ f }) => {
  const rise = ramp(f, CUES.emerge - 20, CUES.column + 6, "out");
  const build = ramp(f, 2203, CUES.emerge, "in"); // the tremor and camera push escalate toward the eruption
  const stir = ramp(f, 2203, CUES.emerge); // linear, so the glow and bubbles read from the first second of the shot
  const pulse = 0.75 + 0.25 * Math.sin(f / 4.5); // a slow heartbeat in the glow: something alive under the sea
  const shock = ramp(f, CUES.column - 4, CUES.column + 10);
  const [ex, ey] = shake(f, CUES.column, 16, 18);
  const tremor = build * (1 - rise);
  const sx = ex + Math.sin(f * 1.7) * 2.5 * tremor;
  const sy = ey + Math.cos(f * 2.3) * 2.5 * tremor;
  const flash = ramp(f, CUES.column, CUES.column + 2) * (1 - ramp(f, CUES.column + 3, CUES.column + 14));
  const cam: Cam = {
    x: track(f, [[2203, 60], [CUES.emerge, 170, "io"], [CUES.column + 24, 60, "io"]]),
    y: track(f, [[2203, 60], [CUES.emerge, 60], [CUES.column + 24, -220, "io"]]),
    z: track(f, [[2203, 1.1], [CUES.emerge, 1.24, "io"], [CUES.column + 24, 1.0, "io"]]),
  };
  const alarm = Math.max(0.4 * stir, shock); // brows lift as the sea stirs, full fear at the eruption
  const fear = { lookY: -0.8 * shock, brow: alarm, browTilt: -8 * alarm, talk: 0.35 * shock };
  return (
    <World dx={sx} dy={sy}>
      <ChurnStage
        f={f}
        cam={cam}
        fx={{
          heave: 0.7 - 0.4 * shock,
          spin: 0.5 * (1 - shock) * Math.sin(f / 13),
          glow: 0.05,
          heat: 0.4,
          vasuki: { smoke: 0.5, eye: 1 },
          expr: { in: fear, su: fear, ag: fear, ba: fear, sw: fear, aS: fear },
        }}
      />
      <rect width={W} height={H} fill="#0B1240" opacity={0.45} />
      <Layer cam={cam} depth={0.75}>
        {/* the build-up: a cyan glow and boiling under the surface where the column will break out */}
        <ellipse cx={860} cy={1222} rx={90 + 200 * stir} ry={18 + 40 * stir} fill="#40D8E8" opacity={(0.25 + 0.45 * stir) * pulse * (1 - 0.5 * rise)} filter="url(#mBlur8)" />
        <BoilFx cx={860} cy={1226} w={380} h={70} level={0.35 + 0.65 * stir} f={f} seed="risebo" />
        <g transform="translate(860 1220)">
          <HalahalaColumn height={1050} rise={rise} f={f} w={150} seed="hh3" />
        </g>
        {/* sink the column's base into the sea: dark water band + foam ring */}
        <path d={`M560 1218C680 ${1206 + Math.sin(f / 7) * 6} 1040 ${1230 - Math.sin(f / 7) * 6} 1180 1214L1180 1300L560 1300Z`} fill="#6E74A0" opacity={rise > 0.01 ? 0.85 : 0} />
        <ellipse cx={860} cy={1218} rx={60 + 170 * rise} ry={10 + 22 * rise} fill="none" stroke="#DFFBFF" strokeWidth={6} opacity={0.8 * rise} />
        <ellipse cx={860} cy={1222} rx={40 + 120 * rise} ry={6 + 14 * rise} fill="#BFF6FF" opacity={0.35 * rise} filter="url(#mBlur8)" />
      </Layer>
      <rect width={W} height={H} fill="#40D8E8" opacity={0.08 * rise} />
      <rect width={W} height={H} fill="#DFFBFF" opacity={0.55 * flash} />
      <Vignette o={0.7} />
    </World>
  );
};

/** Cyan poison light from the column (upper right) over a darkened frame. */
const PoisonGrade: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <defs>
      <radialGradient id="e3poison" cx="0.85" cy="0.15" r="0.9">
        <stop offset="0" stopColor="#40D8E8" stopOpacity={0.35 + 0.08 * Math.sin(f / 6)} />
        <stop offset="0.6" stopColor="#40D8E8" stopOpacity={0.06} />
        <stop offset="1" stopColor="#0B1240" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill="#0B1240" opacity={0.4} />
    <rect width={W} height={H} fill="url(#e3poison)" />
  </g>
);

/** 2426-2638: Indra's whisper "ये... हलाहल है।", then Swarbhanu, afraid for once: "ये तो सबको जला देगा... देवता भी, असुर भी!" */
export const Halahala: React.FC<{ f: number }> = ({ f }) => {
  const indraShot = f < 2499;
  const cam: Cam = indraShot
    ? { x: 415, y: 590, z: track(f, [[2426, 2.3], [2499, 2.5, "io"]]) }
    : { x: -300, y: 533, z: track(f, [[2499, 2.9], [2638, 3.15, "io"]]) };
  const wither = ramp(f, CUES.fear, CUES.asura + 20, "io");
  return (
    <World>
      <ChurnStage
        f={f}
        cam={cam}
        fx={{
          heave: 0.2,
          glow: 0.05,
          heat: indraShot ? 0 : 0.35,
          vasuki: { smoke: 0.4 },
          expr: {
            in: { talk: talk3("13_indra", f), brow: 1, browTilt: -14, lookY: -0.7, smile: -0.4 },
            sw: { talk: talk3("14_swarbhanu", f), brow: 1, browTilt: -16, lookY: -0.6, smile: -0.5 },
            ba: { brow: 1, browTilt: -10, lookY: -0.6 },
            su: { brow: 1, browTilt: -10, lookY: -0.6 },
          },
        }}
      />
      <PoisonGrade f={f} />
      {!indraShot ? (
        <g transform="translate(0 1990) scale(1.3)">
          <Wither w={830} amount={wither} f={f} seed="wi3" />
        </g>
      ) : null}
      <Vignette o={0.72} />
    </World>
  );
};

/** The three lokas as gold rings, burnt in turn by the falling drop (b = burn 0..1 per ring). */
const Lokas: React.FC<{ f: number; burn: number[] }> = ({ f, burn }) => (
  <g>
    {[1100, 1350, 1600].map((y, i) => {
      const b = burn[i];
      return (
        <g key={i}>
          <ellipse cx={540} cy={y} rx={300 + i * 60} ry={56 + i * 10} fill="none" stroke={b > 0.5 ? "#2A2F4A" : "#E8B24A"} strokeWidth={6} opacity={0.75} />
          <ellipse cx={540} cy={y} rx={300 + i * 60} ry={56 + i * 10} fill="none" stroke="#40D8E8" strokeWidth={10} opacity={Math.sin(Math.PI * Math.min(1, b)) * 0.9} filter="url(#mGlow)" />
          {b > 0.2 ? <Motes f={f + i * 40} n={8} seed={`lk${i}`} color="#BFF6FF" dir={-1} speed={0.6} size={2.5} o={0.6 * (1 - b * 0.6)} /> : null}
        </g>
      );
    })}
  </g>
);

/** 2638-2871: "जिस विष की एक बूँद तीनों लोकों को जला दे... उसे पिएगा कौन?" - one drop burns the three worlds; then Kailash; freeze. */
export const Cliff: React.FC<{ f: number }> = ({ f }) => {
  if (f < CUES.kailash) {
    const y = track(f, [[2638, 120], [CUES.drop, 760, "out"], [CUES.kailash, 1760, "in"]]);
    const burn = [0, 1, 2].map((i) => ramp(f, 2700 + i * 22, 2730 + i * 22));
    return (
      <World>
        <rect width={W} height={H} fill="#070A1E" />
        <ellipse cx={540} cy={1000} rx={700} ry={900} fill="#1A2A6A" opacity={0.35} filter="url(#mBlur8)" />
        <Lokas f={f} burn={burn} />
        {/* the drop, with a glowing trail */}
        <path d={`M540 ${y - 260}L548 ${y - 20}L532 ${y - 20}Z`} fill="#40D8E8" opacity={0.25} filter="url(#mBlur8)" />
        <circle cx={540} cy={y} r={70} fill="#40D8E8" opacity={0.3} filter="url(#mBlur8)" />
        <path d={`M540 ${y - 46}C556 ${y - 18} 568 ${y} 568 ${y + 12}C568 ${y + 30} 554 ${y + 42} 540 ${y + 42}C526 ${y + 42} 512 ${y + 30} 512 ${y + 12}C512 ${y} 524 ${y - 18} 540 ${y - 46}Z`} fill="#14205A" stroke="#BFF6FF" strokeWidth={4} />
        <circle cx={532} cy={y + 10} r={7} fill="#BFF6FF" opacity={0.8} />
        <Vignette o={0.8} />
      </World>
    );
  }
  const fz = Math.min(f, CUES.freeze); // the cliffhanger freeze holds this frame
  const throat = ramp(fz, CUES.kailash + 8, CUES.kaun + 6, "io");
  const z = track(fz, [[CUES.kailash, 1.0], [CUES.freeze, 1.14, "io"]]);
  const frozen = ramp(f, CUES.freeze, CUES.freeze + 3);
  const border = ramp(f, CUES.freeze, CUES.freeze + 2) * (1 - ramp(f, CUES.freeze + 4, CUES.freeze + 14));
  return (
    <World>
      <g transform={`translate(560 1300) scale(${z}) translate(-560 -1300)`} style={{ filter: `saturate(${1 - 0.35 * frozen})` }}>
        <Kailash f={fz} throat={throat} moon={1} rim={1} id="cl" />
      </g>
      <rect x={10} y={10} width={W - 20} height={H - 20} fill="none" stroke="#FFD27A" strokeWidth={14} opacity={border} filter="url(#mGlow)" />
      <Vignette o={0.6} />
    </World>
  );
};

/** 2871-3440: the end-card bed: frozen Kailash, dimmed, with the kundali (Shani in the 10th) drawn in. */
export const EndBed3: React.FC<{ f: number }> = ({ f }) => (
  <World>
    <g transform="translate(560 1300) scale(1.14) translate(-560 -1300)" style={{ filter: "saturate(0.65)" }}>
      <Kailash f={CUES.freeze} throat={1} moon={1} rim={1} id="eb" />
    </g>
    <rect width={W} height={H} fill="#0C0A07" opacity={ramp(f, CUES.endCard, CUES.endCard + 14) * 0.62} />
    <EndKundali3 f={f} at={CUES.endCard} />
    <Vignette o={0.7} />
  </World>
);
