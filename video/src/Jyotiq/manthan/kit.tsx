import React from "react";
import { RigDefs } from "./rig";
import { SetDefs } from "./sets";
import { H, ramp, rnd, W } from "./style";

/* Shared scene helpers for Episode 1. */

export type Range = readonly [number, number];
export const inRange = (f: number, r: Range, pre = 14, post = 14) => f >= r[0] - pre && f < r[1] + post;
export const fadeIn = (f: number, r: Range, x = 12) => (x <= 0 ? (f >= r[0] ? 1 : 0) : ramp(f, r[0] - x, r[0], "io"));
export const bump = (f: number, a: number, b: number) => (f > a && f < b ? Math.sin((Math.PI * (f - a)) / (b - a)) : 0);
export const shake = (f: number, at: number, dur: number, amp: number): [number, number] => {
  const t = f - at;
  if (t < 0 || t > dur) return [0, 0];
  const k = (1 - t / dur) * amp;
  return [(rnd(`shx${f}`) - 0.5) * 2 * k, (rnd(`shy${f}`) - 0.5) * 2 * k];
};

export const World: React.FC<{ children: React.ReactNode; dx?: number; dy?: number }> = ({ children, dx = 0, dy = 0 }) => (
  <svg width={W} height={H} viewBox={`${-dx} ${-dy} ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
    <RigDefs />
    <SetDefs />
    {children}
  </svg>
);

/** Cross-legged lap for a seated puppet, in the puppet's waist frame. */
export const Lap: React.FC<{ cloth: string; border: string; skin: string }> = ({ cloth, border, skin }) => (
  <g>
    <path d="M-80 4C-120 30 -130 80 -96 100C-40 120 60 120 110 100C140 80 120 30 80 4Z" fill={cloth} />
    <path d="M-96 100C-40 120 60 120 110 100" stroke={border} strokeWidth={8} fill="none" />
    <path d="M70 92C90 84 116 86 124 98C116 108 92 110 72 104Z" fill={skin} />
    <path d="M-50 -10L54 -10L55 12L-51 12Z" fill="url(#mGold)" />
  </g>
);

