import React from "react";
import { World } from "../kit";
import { blinkAt, pose, Puppet, Who } from "../rig";
import { Motes, Stars, Vignette } from "../sets";
import { H, ramp, track, W } from "../style";
import { Kneeler } from "./armies4";
import { Cobra, PoisonDrop, Scorpion } from "./creatures4";
import { Backdrop, Couple, LIPS_ARM, Shot, SHIVA_FACE } from "./scenes4c";
import { CUES, LINES, SCENES } from "./timing";

/* Episode 4 scenes, part D: Neelkanth, the spilled drops. */

const THROAT: [number, number] = [568, 1264];
const DAWN = 0.65;

/** 873-1094: the poison stays in his throat, which turns blue; on "नीलकंठ" a heroic pull-back. */
export const NeelkanthScene: React.FC<{ f: number }> = ({ f }) => {
  const blue = track(f, [[CUES.kanth, 0.35], [CUES.thahar + 6, 1, "io"]]);
  const ring = ramp(f, CUES.thahar - 2, CUES.thahar + 24, "out");
  const wide = ramp(f, CUES.neelkanth - 4, CUES.neelkanth + 34, "io");
  const end07 = LINES["07_narrator"][1];
  // the light pulses with each tap of the 'नीलकंठ' echo (score: line end + 0.05 s, +0.97 s, +1.89 s)
  const tap = [0.05, 0.97, 1.89].reduce((m, d, i) => {
    const at = end07 + d * 30;
    return Math.max(m, f >= at ? Math.exp(-(f - at) / 8) * (1 - 0.3 * i) : 0);
  }, 0);
  const cx = track(wide, [[0, 575 - 3 * ramp(f, CUES.thahar, CUES.neelkanth, "io")], [1, 600]]);
  const cy = track(wide, [[0, 1240 - 48 * ramp(f, CUES.thahar, CUES.neelkanth, "io")], [1, 1330]]);
  const z = track(wide, [[0, 3.4 - 0.35 * ramp(f, CUES.thahar, CUES.neelkanth, "io")], [1, 1.22]]);
  const bow = ramp(f, CUES.neelkanth, CUES.neelkanth + 20, "io");
  const hold = ramp(f, CUES.kanth, CUES.thahar, "io") * (1 - wide);
  const touch = ramp(f, CUES.thahar - 12, CUES.thahar + 8, "io");
  // the poison held in the throat: sparks spiralling in, thin glowing veins that breathe
  const sparks = Array.from({ length: 18 }, (_, i) => {
    const k = (f * 0.022 + i / 18) % 1;
    const r = 150 * (1 - k);
    const ang = i * 2.1 + f * 0.09 + k * 4;
    return { x: THROAT[0] + Math.cos(ang) * r, y: THROAT[1] + Math.sin(ang) * r * 0.7, o: Math.sin(Math.PI * k), s: 2 + 3 * (1 - k) };
  });
  const veins = [
    "M568 1264C552 1258 540 1262 530 1252", "M568 1264C584 1256 596 1260 606 1248",
    "M568 1264C560 1276 548 1280 542 1292", "M568 1264C578 1276 590 1282 598 1292",
    "M568 1264C566 1250 572 1240 568 1230",
  ];
  const breathe = 0.6 + 0.4 * Math.sin(f / 6);
  return (
    <World>
      <Backdrop f={f} cx={cx} cy={cy} z={z} dawn={DAWN} id="nk4b" />
      <Shot cx={cx} cy={cy} z={z}>
        <circle cx={SHIVA_FACE[0]} cy={SHIVA_FACE[1] - 30} r={230} fill="#FFF1C8" opacity={0.12 + 0.25 * wide + 0.25 * tap} filter="url(#mBlur8)" />
        <Couple
          f={f}
          shiva={{ eyes: 1 - ramp(f, CUES.kanth, CUES.kanth + 10) + ramp(f, CUES.neelkanth - 10, CUES.neelkanth + 6, "io"), halo: 1 + 0.4 * tap, throat: blue, p: { lookX: 0.4, head: -2, smile: 0.35 } }}
          parvati={{ reach: 1 + 0.14 * touch * (1 - wide), lookX: 0.8, smile: 0.5, lookDown: 0.2 + 0.25 * touch * (1 - wide) }}
          trishulGlow={0.4 + 0.6 * wide}
        />
        <g opacity={hold}>
          {veins.map((d) => (
            <path key={d} d={d} stroke="#9FF4FF" strokeWidth={1.6} fill="none" strokeLinecap="round" opacity={0.75 * blue * breathe} />
          ))}
          {sparks.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={p.s} fill={i % 3 ? "#40D8E8" : "#E6FDFF"} opacity={0.85 * p.o} />
          ))}
        </g>
        <ellipse cx={THROAT[0]} cy={THROAT[1]} rx={20 + 120 * ring} ry={14 + 80 * ring} fill="none" stroke="#9FF4FF" strokeWidth={6 * (1 - ring) + 0.5} opacity={ring > 0 ? 0.9 * (1 - ring) : 0} />
        {/* the snow ledge in front, and devtas and asuras bowing together */}
        <path d="M-300 1600C200 1580 900 1590 1500 1610L1500 2400L-300 2400Z" fill="#D7DFF2" opacity={wide} />
        {([
          ["bali", 170, 0.5],
          ["indra", 400, 0.52],
          ["swarbhanu", 640, 0.48],
          ["agni", 860, 0.48],
          ["surya", 1040, 0.5],
        ] as const).map(([who, x, s], i) => (
          <g key={who} opacity={wide}>
            <Kneeler m={{ who: who as Who, id: `nk${who}`, x, base: 1830, s, facing: i % 2 ? -1 : 1 }} f={f} bow={0.2 + 0.7 * bow} extra={{ lookY: -0.3, brow: 0.4, smile: 0.2 }} />
          </g>
        ))}
      </Shot>
      <Motes f={f} n={40} seed="nk4m" color="#FFE6A3" dir={-1} speed={0.45} size={2.8} o={0.4 + 0.4 * wide} />
      <rect width={W} height={H} fill="#9FF4FF" opacity={0.1 * tap} />
      <Vignette o={0.5} />
    </World>
  );
};

/** 1094-1240: the drops that spilled become serpents and scorpions; Swarbhanu watches. */
const DROP_CUT = CUES.drops + 25; // the hand -> the snow below
const WATCH_CUT = CUES.sama - 9; // the snow -> Swarbhanu

export const DropsScene: React.FC<{ f: number }> = ({ f }) => {
  if (f < DROP_CUT) {
    // close on his hand at the lips: three drops slip from it and fall, the camera tilts down after them
    const tilt = ramp(f, CUES.drops, DROP_CUT, "in");
    const cx = 600;
    const cy = 1250 + 380 * tilt;
    const z = 2.6;
    const drops = [CUES.drops - 6, CUES.drops + 4, CUES.drops + 12].map((t0, i) => {
      const t = Math.max(0, f - t0);
      return { x: 612 + i * 14, y: 1290 + 0.5 * 0.32 * t * t, on: f >= t0, s: 1 + 0.3 * Math.min(1, t / 10) };
    });
    return (
      <World>
        <Backdrop f={f} cx={cx} cy={cy} z={z} dawn={DAWN} id="dp4b" />
        <Shot cx={cx} cy={cy} z={z}>
          <Couple f={f} shiva={{ eyes: 0, halo: 1, throat: 1, p: { ...LIPS_ARM, eF: LIPS_ARM.eF - 20 * tilt, head: -2, smile: 0.3 } }} parvati={{ reach: 1, lookX: 0.8, smile: 0.4 }} trishulGlow={0.6} />
          {drops.map((d, i) =>
            d.on ? (
              <g key={i} transform={`translate(${d.x} ${d.y})`}>
                <PoisonDrop r={6} stretch={d.s} />
              </g>
            ) : null,
          )}
        </Shot>
        <Vignette o={0.55} />
      </World>
    );
  }
  if (f < WATCH_CUT) {
    // moonlit snow below: the drops land; a cobra rises from one, a scorpion crawls out of another
    const z = track(f, [[DROP_CUT, 1.0], [WATCH_CUT, 1.12, "io"]]);
    const land1 = DROP_CUT + 4;
    const land2 = CUES.scorpions - 10;
    const splash = (at: number) => ramp(f, at, at + 18, "out");
    const rise = ramp(f, CUES.snakes - 8, CUES.snakes + 12, "out");
    const crawl = ramp(f, CUES.scorpions - 4, WATCH_CUT + 10, "in");
    const fall = (at: number) => Math.max(0, Math.min(1, 1 - (at - f) / 14));
    return (
      <World>
        <defs>
          <linearGradient id="dp4sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1A2350" />
            <stop offset="1" stopColor="#3C4E8A" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#dp4sky)" />
        <Stars f={f} n={40} y1={700} seed="dp4s" o={0.6} />
        <g transform={`translate(540 1100) scale(${z}) translate(-540 -1100)`}>
          <path d="M-200 900C200 860 700 880 1300 900L1300 2200L-200 2200Z" fill="#C9D5EE" />
          <path d="M-200 900C200 860 700 880 1300 900" stroke="#F2F6FF" strokeWidth={8} fill="none" />
          <path d="M-200 1300C300 1270 800 1330 1300 1290L1300 2200L-200 2200Z" fill="#B4C2E4" opacity={0.6} />
          {/* drop 1 -> cobra */}
          {f < land1 ? (
            <g transform={`translate(380 ${700 + 560 * fall(land1)})`}>
              <PoisonDrop r={12} stretch={1.6} />
            </g>
          ) : null}
          <ellipse cx={380} cy={1262} rx={20 + 130 * splash(land1)} ry={6 + 30 * splash(land1)} fill="none" stroke="#40D8E8" strokeWidth={5} opacity={f >= land1 ? 0.9 * (1 - splash(land1)) : 0} />
          <ellipse cx={380} cy={1262} rx={70} ry={18} fill="#40D8E8" opacity={f >= land1 ? 0.35 : 0} filter="url(#mBlur8)" />
          {rise > 0 ? (
            <g transform="translate(380 1262)">
              <Cobra f={f} s={2.1 * (0.5 + 0.5 * rise)} glow={1 - 0.3 * ramp(f, CUES.snakes + 20, WATCH_CUT)} rise={rise} />
            </g>
          ) : null}
          {/* drop 2 -> scorpion */}
          {f < land2 ? (
            <g transform={`translate(740 ${720 + 640 * fall(land2)})`}>
              <PoisonDrop r={10} stretch={1.5} />
            </g>
          ) : null}
          <ellipse cx={740} cy={1380} rx={20 + 120 * splash(land2)} ry={6 + 28 * splash(land2)} fill="none" stroke="#40D8E8" strokeWidth={5} opacity={f >= land2 ? 0.9 * (1 - splash(land2)) : 0} />
          {f >= land2 + 4 ? (
            <g transform={`translate(${740 - 160 * crawl} 1380)`}>
              <Scorpion f={f} s={2.0} glow={1} walk={crawl > 0 ? 1 : 0} facing={-1} />
            </g>
          ) : null}
        </g>
        <Motes f={f} n={24} seed="dp4m" color="#40D8E8" dir={-1} speed={0.4} size={2.4} o={0.5} />
        <Vignette o={0.55} />
      </World>
    );
  }
  // Swarbhanu watches from behind a rock: silent, his slit eyes narrowing (he will remember this)
  const narrow = ramp(f, CUES.sama - 4, CUES.sama + 14, "io");
  const z = track(f, [[WATCH_CUT, 1.0], [SCENES.drops[1] + 10, 1.06, "io"]]);
  const q = pose({ lean: 6, head: -4, sF: 30, eF: 70, sB: 20, eB: 60, lookX: 0.9, lookY: 0.5, brow: 0.2, browTilt: 8 + 10 * narrow, smile: 0.1 + 0.2 * narrow, glow: 0.25 * narrow, blink: Math.max(0.3 * narrow, blinkAt("dpsw", f) * (1 - narrow)) });
  return (
    <World>
      <rect width={W} height={H} fill="#1E2858" />
      <Stars f={f} n={30} y1={900} seed="dp4w" o={0.5} />
      <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
        <ellipse cx={200} cy={1500} rx={420} ry={260} fill="#40D8E8" opacity={0.38} filter="url(#mBlur8)" />
        <ellipse cx={640} cy={860} rx={300} ry={380} fill="#5FC8E0" opacity={0.22} filter="url(#mBlur8)" />
        <Puppet id="dpsw" who={"swarbhanu" as Who} at={{ x: 700, y: 1360, s: 1.9, facing: -1 }} p={q} t={f} noLegs />
        {/* the rock he hides behind, lit cyan from the left */}
        <path d="M300 1520C380 1380 560 1340 760 1360C960 1380 1140 1440 1180 1600L1180 2000L280 2000Z" fill="#1C2448" />
        <path d="M300 1520C380 1380 560 1340 760 1360" stroke="#40D8E8" strokeWidth={6} fill="none" opacity={0.6} />
      </g>
      <Vignette o={0.7} />
    </World>
  );
};
