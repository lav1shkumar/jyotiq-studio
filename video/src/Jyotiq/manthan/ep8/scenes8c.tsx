import React from "react";
import { ROZHA } from "../graphics";
import { World } from "../kit";
import { Cosmos } from "../scenesA";
import { Motes, Vignette } from "../sets";
import { ramp, track } from "../style";
import { Brahma8, KetuBody7, KetuForm, KetuGlow8, Rahu8 } from "./cast8";
import { prog8 } from "./kit8";
import { PairSky8 } from "./scenes8a";
import { BEATS, CUES, SCENES } from "./timing";

/*
 * Scenes 6-10.
 *  ketu:   split-screen. Left: Rahu's head, red and hungry, still glaring at the sky. Right: the headless body,
 *          perfectly still; Ketu has no mouth, so his voice (06_ketu) glows from the chest (KetuGlow8).
 *  brahma: Brahma as gold light (Brahma8) appears above; on 'ग्रहों' the body rises toward him and on the name
 *          ('केतु') it dissolves into the silver comet graha के with a serpent hood (series iconography).
 *  pair:   Episode 7's sky (PairSky8): रा and के opposite each other; labels are HTML.
 *  answer: back to the hook's framing (body s 1.3 at y 1520, Rahu's head small above) so the reel loops;
 *          the chest glow rises into a third-eye light by 'जानता है'.
 *  end:    a dim Cosmos bed under the end card and kundali.
 * Chest of KetuBody7 = neck cut (y - 218 s) + 110 s.
 */

const chestY = (y: number, s: number) => y - 218 * s + 110 * s;

const Glyph: React.FC<{ t: string; size: number; color: string }> = ({ t, size, color }) => (
  <text x={0} y={size * 0.36} textAnchor="middle" fontSize={size} fill={color} fontFamily={ROZHA}>
    {t}
  </text>
);

export const KetuScene8: React.FC<{ f: number }> = ({ f }) => {
  const [a] = SCENES.ketu;
  const open = ramp(f, a, a + 10, "out");
  const body = { x: 800, y: 1300, s: 1.35 }; // neck cut at ~1006, level with Rahu's throat (~1045) on the left
  return (
    <World>
      <Cosmos f={f} z={1.04} />
      <clipPath id="k8-left">
        <rect x={0} y={0} width={540} height={1920} />
      </clipPath>
      <clipPath id="k8-right">
        <rect x={540} y={0} width={540} height={1920} />
      </clipPath>
      <g clipPath="url(#k8-left)">
        <rect x={0} y={0} width={540} height={1920} fill="#3A0E18" opacity={0.45} />
        <ellipse cx={270} cy={950} rx={320} ry={380} fill="#C8344A" opacity={0.22} filter="url(#mBlur8)" />
        <Rahu8 id="k8rahu" at={{ x: 270 - 120 * (1 - open), y: 950 }} s={1.7} f={f} throat={0.6} rage={1} lookX={0.6} />
      </g>
      <g clipPath="url(#k8-right)">
        <rect x={540} y={0} width={540} height={1920} fill="#0C1430" opacity={0.45} />
        <KetuBody7 id="k8body" f={f * 0.4} x={body.x + 120 * (1 - open)} y={body.y} s={body.s} facing={-1} />
        <KetuGlow8 cx={body.x + 120 * (1 - open)} cy={chestY(body.y, body.s)} s={1.1} f={f} line="06_ketu" base={0.2} />
      </g>
      <rect x={537} y={0} width={6} height={1920} fill="#FFD36B" opacity={0.8 * open} />
      <Vignette o={0.7} />
    </World>
  );
};

const Hood8: React.FC<{ x: number; y: number; s: number; k: number }> = ({ x, y, s, k }) =>
  k <= 0.01 ? null : (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={k}>
      {/* a cobra rising from the orb: a tall hood, narrow at the neck, the small head on top; no face markings */}
      <path d="M0 -110 C56 -110 86 -50 76 10 C68 52 30 80 13 104 L-13 104 C-30 80 -68 52 -76 10 C-86 -50 -56 -110 0 -110Z" fill="#2A1B44" stroke="#9FB3D9" strokeWidth={5} />
      <path d="M0 -84 C36 -84 56 -40 50 6 C46 36 20 56 0 70 C-20 56 -46 36 -50 6 C-56 -40 -36 -84 0 -84Z" fill="#3B2A63" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${-12 + i * 2} ${40 + i * 18} Q0 ${46 + i * 18} ${12 - i * 2} ${40 + i * 18}`} stroke="#9FB3D9" strokeWidth={3} fill="none" opacity={0.5} />
      ))}
      <ellipse cx={0} cy={-122} rx={22} ry={16} fill="#2A1B44" stroke="#9FB3D9" strokeWidth={4} />
      <circle cx={-8} cy={-125} r={3} fill="#EAF1FF" />
      <circle cx={8} cy={-125} r={3} fill="#EAF1FF" />
    </g>
  );

export const BrahmaScene8: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.brahma;
  const bk = ramp(f, CUES.brahma - 12, CUES.brahma + 18, "out");
  const rise = ramp(f, CUES.graha, CUES.ketuName, "io");
  const dis = ramp(f, CUES.ketuName - 4, CUES.ketuName + 10, "out");
  const fly = prog8(f, BEATS.rise[0], BEATS.rise[1]);
  const bodyY = 1600 - 320 * rise;
  const orb = { x: 540 + 120 * fly, y: chestY(bodyY, 1.1) - 40 - 180 * fly };
  const z = track(f, [[a, 1.0], [CUES.ketuName, 1.04, "io"], [b, 1.08, "io"]]);
  return (
    <World>
      <g transform={`translate(540 960) scale(${z}) translate(-540 -960)`}>
        <Cosmos f={f} z={1.04} />
        <rect x={0} y={0} width={1080} height={1920} fill="#FFC94D" opacity={0.08 * bk} />
        <Brahma8 cx={540} cy={470} s={0.85} f={f} k={bk} />
        <g opacity={1 - dis}>
          <KetuBody7 id="br8body" f={f} x={540} y={bodyY} s={1.1} facing={1} />
        </g>
        {dis > 0 ? (
          <g>
            <circle cx={orb.x} cy={orb.y} r={200 * (1 - dis) + 60} fill="#CFDBF5" opacity={0.5 * (1 - dis)} filter="url(#mBlur8)" />
            <KetuForm x={orb.x} y={orb.y} r={115} f={f} k={dis} tail={dis} tailDeg={130}>
              <Glyph t="के" size={110} color="#EAF1FF" />
            </KetuForm>
            <Hood8 x={orb.x} y={orb.y - 115 - 100} s={1.0} k={ramp(f, CUES.ketuName + 6, CUES.ketuName + 18, "out")} />
          </g>
        ) : null}
        <Motes f={f} n={34} seed="br8m" color="#FFE6A3" dir={-1} speed={0.7} size={3} o={0.6 * bk} />
      </g>
      <Vignette o={0.65} />
    </World>
  );
};

export const PairScene8: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.pair;
  const z = track(f, [[a, 1.1], [b, 1.0, "io"]]);
  return (
    <World>
      <PairSky8 f={f} z={z} />
      <Motes f={f} n={30} seed="pr8m" color="#CFDBF5" dir={-1} speed={0.4} size={3} o={0.5} />
      <Vignette o={0.7} />
    </World>
  );
};

export const AnswerScene8: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.answer;
  const body = { x: 540, y: 1520, s: 1.3 };
  const third = ramp(f, CUES.sirZaroor, CUES.jaanta + 6, "io");
  const head = ramp(f, CUES.jawab - 10, b, "out"); // Rahu's head drifts back in: the last frame matches frame 0
  const z = track(f, [[a, 1.06], [CUES.jawab, 1.02, "io"], [b, 1.0, "io"]]);
  const neckY = body.y - 218 * body.s;
  return (
    <World>
      <g transform={`translate(540 ${neckY}) scale(${z}) translate(-540 ${-neckY})`}>
        <Cosmos f={f} z={1.04} />
        <ellipse cx={540} cy={1100} rx={480} ry={560} fill="#3A2160" opacity={0.4} filter="url(#mBlur8)" />
        <ellipse cx={body.x + 8} cy={neckY} rx={110} ry={34} fill="#FFD27A" opacity={0.22} filter="url(#mBlur8)" />
        <KetuBody7 id="an8body" f={f} x={body.x} y={body.y} s={body.s} facing={1} />
        <KetuGlow8 cx={body.x + 8} cy={chestY(body.y, body.s)} s={1.2} f={f} base={0.35} third={third} />
        <g opacity={head}>
          <Rahu8 id="an8rahu" at={{ x: 560, y: 400 }} s={1.25} f={f} throat={1} rage={0.5} lookX={-0.3} />
        </g>
        <Motes f={f} n={30} seed="an8m" color="#FFE6A3" dir={-1} speed={0.5} size={3} o={0.6} />
      </g>
      <Vignette o={0.78} />
    </World>
  );
};

export const EndBed8: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = SCENES.end;
  const z = track(f, [[a, 1.0], [b, 1.12, "io"]]);
  return (
    <World>
      <g transform={`translate(540 960) scale(${z}) rotate(${(f - a) * 0.02}) translate(-540 -960)`}>
        <Cosmos f={f} z={1.04} />
      </g>
      <rect x={0} y={0} width={1080} height={1920} fill="#0A0818" opacity={0.55} />
      <ellipse cx={540} cy={800} rx={420} ry={420} fill="#9FB3D9" opacity={0.08 + 0.05 * Math.sin(f / 12)} filter="url(#mBlur8)" />
      <Motes f={f} n={40} seed="ed8m" color="#CFDBF5" dir={-1} speed={0.6} size={4} o={0.6} />
      <Vignette o={0.7} />
    </World>
  );
};
