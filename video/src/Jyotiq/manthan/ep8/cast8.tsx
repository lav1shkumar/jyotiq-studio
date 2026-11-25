import React from "react";
import { RahuHead } from "../ep2/beings3";
import { EclipseSun, GrahaOrb, KetuForm, SudarshanChakra } from "../ep7/cast7";
import { KetuBody7 } from "../ep7/scenes7d";
import { talk8 } from "./kit8";

/*
 * Episode 8 cast. Episode 7 files are imported read-only so the characters stay identical:
 *  - Rahu's head: the series RahuHead (Episode 2) with the Episode 7 throat glow, lip-synced to the
 *    Episode 8 voice envelope (Episode 7's RahuSpeaking reads Episode 7's own takes, so it is rebuilt here).
 *  - Ketu's body: KetuBody7 (Swarbhanu's puppet cut at the neck, gold glow at the cut, smoke rising).
 *  - Ketu's graha: KetuForm (silver-blue comet orb), GrahaOrb for रा, SudarshanChakra, EclipseSun.
 */
export { EclipseSun, GrahaOrb, KetuBody7, KetuForm, SudarshanChakra };

export const Rahu8: React.FC<{
  id: string;
  at: { x: number; y: number };
  s: number;
  f: number;
  line?: string;
  throat?: number;
  rage?: number;
  lookX?: number;
}> = ({ id, at, s, f, line, throat = 0.6, rage = 0.7, lookX = 0.2 }) => {
  const talk = line ? talk8(line, f) : 0;
  const tg = Math.max(0, Math.min(1, throat)) * (0.8 + 0.2 * Math.sin(f / 6));
  return (
    <g>
      <RahuHead
        id={id}
        at={at}
        s={s}
        t={f}
        p={{ talk, smile: 0.85 - 0.4 * talk, browTilt: 8 + 6 * rage, lookX, glow: 0.4 + 0.6 * rage, bob: 0, head: 0 }}
        smoke={1}
      />
      {tg > 0.01 ? (
        <g opacity={tg}>
          <ellipse cx={at.x - 6 * s} cy={at.y + 56 * s} rx={34 * s} ry={9 * s} fill="#FFD27A" opacity={0.5} filter="url(#mBlur8)" />
          <ellipse cx={at.x - 6 * s} cy={at.y + 56 * s} rx={16 * s} ry={4 * s} fill="#FFF1C2" opacity={0.75} />
        </g>
      ) : null}
    </g>
  );
};

/**
 * Ketu's voice made visible: he has no mouth, so his chest glows with the voice envelope of `line`
 * (06_ketu) and slow silver rings breathe out from it. `third` 0..1 lifts the glow up into a
 * third-eye light above the neck cut (the answer in line 09). cx/cy = chest centre.
 */
export const KetuGlow8: React.FC<{ cx: number; cy: number; s: number; f: number; line?: string; base?: number; third?: number }> = ({
  cx, cy, s, f, line, base = 0.25, third = 0,
}) => {
  const v = Math.max(base, line ? talk8(line, f) : 0);
  const ty = cy - third * 250 * s;
  return (
    <g>
      <circle cx={cx} cy={ty} r={(60 + 70 * v) * s} fill="#9FB3D9" opacity={0.25 + 0.35 * v} filter="url(#mBlur8)" />
      <circle cx={cx} cy={ty} r={(16 + 14 * v) * s} fill="#EAF1FF" opacity={0.55 + 0.4 * v} />
      {[0, 1, 2].map((i) => {
        const u = (((f / 45 + i / 3) % 1) + 1) % 1;
        return <circle key={i} cx={cx} cy={ty} r={(30 + 150 * u) * s} fill="none" stroke="#CFDBF5" strokeWidth={2.5 * s} opacity={(0.15 + 0.45 * v) * (1 - u)} />;
      })}
      {third > 0.01 ? (
        <g opacity={third}>
          <path d={`M${cx} ${ty - 34 * s} Q${cx + 22 * s} ${ty} ${cx} ${ty + 34 * s} Q${cx - 22 * s} ${ty} ${cx} ${ty - 34 * s}Z`} fill="#FFFFFF" opacity={0.9} />
          <circle cx={cx} cy={ty} r={7 * s} fill="#2A1B44" />
        </g>
      ) : null}
    </g>
  );
};

/**
 * Brahma as light: a dignified gold silhouette (three of the four faces visible: front and two
 * profiles, a tall crown) seated on a lotus inside a radiant halo. No facial detail is drawn; he is
 * light, not a puppet. k 0..1 fades him in (rays first, then the figure); cx/cy = figure centre.
 */
export const Brahma8: React.FC<{ cx: number; cy: number; s: number; f: number; k?: number }> = ({ cx, cy, s, f, k = 1 }) => {
  if (k <= 0.01) return null;
  const rays = Math.min(1, k * 1.6);
  const fig = Math.max(0, Math.min(1, k * 1.6 - 0.6));
  const turn = f / 240;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <g opacity={rays} transform={`rotate(${turn * 57.3})`}>
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const L = i % 2 ? 420 : 560;
          return (
            <path key={i} d={`M0 0L${Math.cos(a - 0.04) * L} ${Math.sin(a - 0.04) * L}L${Math.cos(a + 0.04) * L} ${Math.sin(a + 0.04) * L}Z`} fill="#FFE7A0" opacity={i % 2 ? 0.16 : 0.24} />
          );
        })}
      </g>
      <circle r={300} fill="#FFC94D" opacity={0.28 * rays} filter="url(#mBlur8)" />
      <circle cy={-150} r={150} fill="none" stroke="#FFE7A0" strokeWidth={6} opacity={0.7 * fig} />
      <g opacity={fig}>
        {/* lotus seat */}
        {[-3, -2, -1, 0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${i * 46} 210 Q${i * 46 - 34} 150 ${i * 52} 120 Q${i * 46 + 34} 150 ${i * 46} 210Z`} fill={Math.abs(i) % 2 ? "#F7A8B8" : "#FFD1DA"} opacity={0.9} />
        ))}
        {/* body in light */}
        <path d="M-120 200 Q-130 40 -60 -40 L60 -40 Q130 40 120 200 Z" fill="#FFD36B" opacity={0.85} />
        <path d="M-60 -40 Q-150 30 -170 120" stroke="#FFE7A0" strokeWidth={26} strokeLinecap="round" fill="none" opacity={0.8} />
        <path d="M60 -40 Q150 30 170 120" stroke="#FFE7A0" strokeWidth={26} strokeLinecap="round" fill="none" opacity={0.8} />
        {/* three of the four faces (the fourth faces away): a crowned head in front and one either side */}
        {[-1, 1].map((d) => (
          <g key={d} transform={`translate(${d * 92} -104)`}>
            <ellipse cx={0} cy={0} rx={38} ry={46} fill="#FFDF8E" opacity={0.92} />
            <path d="M-28 -36 L-20 -96 L0 -116 L20 -96 L28 -36 Z" fill="#FFC94D" opacity={0.92} />
            <circle cx={0} cy={-98} r={6} fill="#FFFFFF" />
          </g>
        ))}
        <ellipse cx={0} cy={-120} rx={50} ry={60} fill="#FFE7A0" />
        <path d="M-40 -170 L-30 -250 L0 -280 L30 -250 L40 -170 Z" fill="#FFC94D" />
        <circle cx={0} cy={-255} r={9} fill="#FFFFFF" />
        <path d="M-56 -60 Q0 -10 56 -60" stroke="#FFFFFF" strokeWidth={8} fill="none" opacity={0.6} />
      </g>
    </g>
  );
};

/**
 * The amrit drop at the neck cut. p 0..1: 0 = one whole drop, then it pinches and splits; one half
 * rises with the head (up by `rise`), the other sinks into the body (down by `sink`). Each half keeps
 * a small gold trail so the eye follows it.
 */
export const SplitDrop8: React.FC<{ x: number; y: number; s: number; f: number; p: number; rise?: number; sink?: number }> = ({
  x, y, s, f, p, rise = 380, sink = 260,
}) => {
  const pinch = Math.min(1, p * 3);
  const move = Math.max(0, Math.min(1, (p - 0.33) / 0.67));
  const ease = 1 - (1 - move) ** 3;
  const glow = 0.85 + 0.15 * Math.sin(f / 5);
  const half = (dy: number, flip: number, key: string) => (
    <g key={key} transform={`translate(${x} ${y + dy})`}>
      {move > 0 ? <line x1={0} y1={0} x2={0} y2={-dy * 0.6} stroke="#FFD27A" strokeWidth={6 * s} opacity={0.35 * (1 - move * 0.5)} strokeLinecap="round" /> : null}
      <circle r={46 * s} fill="#FFB23D" opacity={0.35 * glow} filter="url(#mBlur8)" />
      <path
        d={`M0 ${-26 * s * flip} Q${22 * s} ${2 * s * flip} 0 ${22 * s * flip} Q${-22 * s} ${2 * s * flip} 0 ${-26 * s * flip}Z`}
        fill="#FFE08A"
        stroke="#FFF6D6"
        strokeWidth={2 * s}
      />
    </g>
  );
  if (pinch < 1) {
    // one drop, stretching vertically as it pinches
    return (
      <g transform={`translate(${x} ${y}) scale(${1 - 0.15 * pinch} ${1 + 0.6 * pinch})`}>
        <circle r={60 * s} fill="#FFB23D" opacity={0.4 * glow} filter="url(#mBlur8)" />
        <path d={`M0 ${-36 * s} Q${30 * s} 0 0 ${34 * s} Q${-30 * s} 0 0 ${-36 * s}Z`} fill="#FFE08A" stroke="#FFF6D6" strokeWidth={2 * s} />
      </g>
    );
  }
  return (
    <g>
      {move < 0.25 ? <circle cx={x} cy={y} r={(40 + 260 * move) * s} fill="none" stroke="#FFF1C2" strokeWidth={6 * s} opacity={1 - move * 4} /> : null}
      {half(-rise * ease, 1, "up")}
      {half(sink * ease, -1, "down")}
    </g>
  );
};
