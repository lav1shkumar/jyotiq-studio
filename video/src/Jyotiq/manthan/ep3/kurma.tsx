import React from "react";
import { Mandar } from "../ep2/beings2";

/*
 * Episode 3 beings, part 1: Kurma, Vishnu's tortoise avatar, carrying Mandar.
 * The look grows straight out of Episode 2's KurmaGlow (ep2/beings3.tsx): the same hex
 * shell cells (gold #FFD27A strokes), the same blue radial fill (#7FD3FF -> #2F6E9C ->
 * #173A5A), the same head colours and the same calm almond eye. Vishnu's urdhva tilak
 * (as in rig.tsx) marks the head as divine. Episode 2's file is imported from, never edited.
 * Scale: the shell is far wider than Mandar (the mountain rides on it like a hill on an island).
 */

const K = {
  hi: "#7FD3FF",
  mid: "#2F6E9C",
  deep: "#173A5A",
  skin: "#2F6E9C",
  skinHi: "#4F92C0",
  line: "#173A5A",
  gold: "#FFD27A",
  goldPale: "#FFE6A3",
  halo: "#FFE29A",
  milk: "#F4F1EA",
};

const hexPath = (cx: number, cy: number, r: number) => {
  const pts = Array.from({ length: 6 }).map((_, i) => {
    const a = (Math.PI / 3) * i;
    return `${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`;
  });
  return `M${pts.join("L")}Z`;
};

const HEX_R = 124;
const CELLS = (() => {
  const out: { x: number; y: number; i: number }[] = [];
  let i = 0;
  for (let c = -8; c <= 8; c++) {
    for (let rw = -4; rw <= 4; rw++) {
      out.push({ x: c * 1.5 * HEX_R, y: rw * Math.sqrt(3) * HEX_R + (c % 2 ? (Math.sqrt(3) / 2) * HEX_R : 0), i: i++ });
    }
  }
  return out;
})();

/** Kurma's calm almond eye (same shape as KurmaGlow's, drawn at any size). open 0..1. */
const Eye: React.FC<{ open: number; s?: number; glow?: number }> = ({ open, s = 1, glow = 1 }) => {
  const o = Math.max(0.04, open);
  return (
    <g transform={`scale(${s})`}>
      <path d={`M-22 0C-10 ${-12 * o - 1} 10 ${-12 * o - 1} 22 0C10 ${10 * o + 1} -10 ${10 * o + 1} -22 0Z`} fill={K.goldPale} filter={glow > 0.5 ? "url(#mGlow)" : undefined} />
      <ellipse cx={0} cy={0} rx={6} ry={7 * o + 0.5} fill="#1A1206" />
      <circle cx={-2.5} cy={-3 * o} r={1.6 * o} fill="#FFFFFF" opacity={0.9} />
      <path d="M-24 -2C-10 -14 10 -14 24 -2" stroke={K.line} strokeWidth={5} fill="none" strokeLinecap="round" />
    </g>
  );
};

export const KURMA_DOME_H = 520; // dome height; the shell's rim (waterline) is at y = 520
export const KURMA_RX = 900; // half-width of the shell

/** Height of the dome surface at x (origin = dome top, y grows downward). */
export const kurmaDomeY = (x: number) => KURMA_DOME_H * (1 - Math.sqrt(Math.max(0, 1 - (x / KURMA_RX) ** 2)));

/**
 * Kurma seen from the side, rising out of the milk with Mandar on his back.
 * Origin = top of the shell dome. Shell spans x -900..900 (rim at y 520), head reaches x ~ +1400.
 * eye 0..1, glow 0..1 divine halo, wet 0..1 milk streaming off the shell, headLift 0..1,
 * mountainScale = Mandar's size on the shell (scenes that draw Mandar themselves pass mountain={false}).
 */
export const KurmaFull: React.FC<{
  id: string;
  t: number;
  eye?: number;
  glow?: number;
  wet?: number;
  headLift?: number;
  mountain?: boolean;
  mountainScale?: number;
  mandarGlow?: number;
  talk?: number; // 0..1 jaw opening (lip-sync)
  children?: React.ReactNode; // drawn between the shell and Mandar (e.g. the far half of Vasuki's coil)
}> = ({ id, t, eye = 1, glow = 1, wet = 0, headLift = 0, mountain = true, mountainScale = 0.6, mandarGlow = 0.5, talk = 0, children }) => {
  const pulse = 0.75 + 0.25 * Math.sin(t / 14);
  const dome = "M-900 520C-900 230 -520 0 0 0C520 0 900 230 900 520Z";
  const breathe = Math.sin(t / 22) * 6;
  const hy = 330 - headLift * 90 + breathe;
  return (
    <g>
      <defs>
        <radialGradient id={`kf-${id}`} cx="0.4" cy="0.2" r="0.9">
          <stop offset="0" stopColor={K.hi} />
          <stop offset="0.5" stopColor={K.mid} />
          <stop offset="1" stopColor={K.deep} />
        </radialGradient>
        <linearGradient id={`kfs-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={K.skinHi} />
          <stop offset="1" stopColor={K.deep} />
        </linearGradient>
        <clipPath id={`kd-${id}`}>
          <path d={dome} />
        </clipPath>
      </defs>
      {/* divine halo, like KurmaGlow's */}
      <ellipse cx={120} cy={360} rx={1250} ry={640} fill={K.halo} opacity={0.2 * glow * pulse} filter="url(#mBlur8)" />
      {/* back flipper */}
      <path d="M-680 520C-820 560 -1020 660 -1100 760C-1000 772 -820 712 -640 590Z" fill={`url(#kfs-${id})`} stroke={K.line} strokeWidth={8} />
      <path d="M-740 580C-850 630 -960 690 -1040 742" stroke={K.gold} strokeWidth={4} opacity={0.5} fill="none" />
      {/* neck */}
      <path d={`M780 350C900 320 1020 ${hy - 20} 1110 ${hy - 40}L1170 ${hy + 130}C1060 ${hy + 150} 930 520 800 540Z`} fill={`url(#kfs-${id})`} stroke={K.line} strokeWidth={8} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${880 + i * 60} ${370 + i * 2}C${900 + i * 60} ${410} ${900 + i * 60} ${450} ${880 + i * 60} ${500 - i * 6}`} stroke={K.line} strokeWidth={5} opacity={0.4} fill="none" />
      ))}
      {/* gold collar of a divine being */}
      <path d={`M1010 ${hy - 6}C990 ${hy + 50} 1000 ${hy + 110} 1040 ${hy + 150}`} stroke={K.gold} strokeWidth={14} fill="none" strokeLinecap="round" />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={1004 + (i - 2) * -3 + i * 6} cy={hy + 6 + i * 34} r={9} fill={K.goldPale} stroke="#A8701E" strokeWidth={3} />
      ))}
      <circle cx={1018} cy={hy + 74} r={13} fill="#D9283A" stroke={K.gold} strokeWidth={4} />
      {/* head */}
      <g transform={`translate(1240 ${hy + 40})`}>
        <ellipse cx={0} cy={0} rx={220} ry={160} fill={K.skin} stroke={K.line} strokeWidth={8} />
        <ellipse cx={-26} cy={-38} rx={160} ry={86} fill={K.skinHi} opacity={0.6} />
        {/* moonlit rim along the crown of the head, brow ridge over the eye, a calm smile line */}
        <path d="M-170 -96C-90 -160 60 -170 170 -100" stroke="#BFE0FF" strokeWidth={8} fill="none" opacity={0.55} strokeLinecap="round" />
        <path d="M-10 -92C30 -112 96 -112 130 -88" stroke={K.line} strokeWidth={9} fill="none" opacity={0.7} strokeLinecap="round" />
        <path d="M96 94C120 102 150 98 170 84" stroke={K.line} strokeWidth={5} fill="none" opacity={0.5} strokeLinecap="round" />
        {Array.from({ length: 5 }).map((_, i) => (
          <path key={i} d={hexPath(-120 + i * 52, 70 - (i % 2) * 30, 26)} fill="none" stroke={K.line} strokeWidth={4} opacity={0.3} />
        ))}
        {/* beak line and nostril; the jaw parts when Kurma speaks */}
        {talk > 0.02 ? (
          <path d={`M112 72C170 64 206 42 218 8L216 ${10 + 20 * talk}C204 ${50 + 20 * talk} 168 ${74 + 18 * talk} 112 ${80 + 8 * talk}Z`} fill="#0E1A2E" />
        ) : null}
        <path d="M120 70C170 62 206 40 218 8" stroke={K.line} strokeWidth={7} fill="none" strokeLinecap="round" />
        {talk > 0.02 ? <path d={`M118 ${80 + 8 * talk}C170 ${74 + 18 * talk} 204 ${50 + 20 * talk} 216 ${10 + 20 * talk}`} stroke={K.line} strokeWidth={6} fill="none" strokeLinecap="round" /> : null}
        <circle cx={190} cy={-30} r={9} fill={K.line} />
        {/* Vishnu's urdhva tilak on the brow */}
        <g transform="translate(120 -112) rotate(18)">
          <path d="M-12 26L-20 -30M12 26L20 -30" stroke="#FFF6E0" strokeWidth={9} strokeLinecap="round" />
          <path d="M0 22L0 -26" stroke="#D9283A" strokeWidth={9} strokeLinecap="round" />
        </g>
        <g transform="translate(56 -44)">
          <Eye open={eye} s={2.6} glow={glow} />
        </g>
      </g>
      {/* plastron edge under the dome */}
      <path d="M-930 520C-700 594 700 594 930 520C860 566 -860 566 -930 520Z" fill={K.deep} />
      <path d="M-930 520C-640 584 640 584 930 520" stroke={K.gold} strokeWidth={8} fill="none" opacity={0.75} />
      {/* domed shell */}
      <path d={dome} fill={`url(#kf-${id})`} />
      <g clipPath={`url(#kd-${id})`}>
        <g transform="translate(0 300) scale(1 0.8)">
          {CELLS.map((c) => (
            <path key={c.i} d={hexPath(c.x, c.y, HEX_R - 9)} fill={K.goldPale} fillOpacity={0.05 + 0.05 * ((c.i * 7) % 3)} stroke={K.gold} strokeWidth={6} strokeOpacity={0.6 * pulse} />
          ))}
        </g>
        {/* subtle gold kundali geometry on a front scute (Jyotiq tie-in) */}
        <g transform="translate(-450 300)" opacity={0.45 * pulse} stroke={K.gold} strokeWidth={5} fill="none">
          <rect x={-110} y={-74} width={220} height={148} />
          <path d="M-110 -74L110 74M110 -74L-110 74M0 -74L110 0L0 74L-110 0Z" />
        </g>
        {/* roundness: light from the upper left, shade toward the rim */}
        <ellipse cx={-300} cy={120} rx={440} ry={150} fill="#FFFFFF" opacity={0.1} />
        <path d="M-900 520C-900 380 -820 280 -690 220L-690 520Z" fill={K.deep} opacity={0.35} />
        <path d="M900 520C900 380 820 280 690 220L690 520Z" fill={K.deep} opacity={0.3} />
      </g>
      <path d={dome} fill="none" stroke={K.gold} strokeWidth={10} opacity={0.8 * pulse} />
      {/* marginal scutes along the rim */}
      {Array.from({ length: 21 }).map((_, i) => {
        const x = -860 + i * (1720 / 20);
        return <path key={i} d={`M${x - 40} 520L${x} 552L${x + 40} 520`} stroke={K.gold} strokeWidth={5} fill="none" opacity={0.55} />;
      })}
      {/* front flipper, over the plastron */}
      <path d="M560 540C650 640 690 780 660 900C760 840 810 700 760 560Z" fill={`url(#kfs-${id})`} stroke={K.line} strokeWidth={8} />
      <path d="M650 620C690 690 705 760 696 830" stroke={K.gold} strokeWidth={4} opacity={0.5} fill="none" />
      {/* milk streaming off the shell: thin broken runs that flow outward and down */}
      {wet > 0.01 ? (
        <g opacity={wet}>
          {Array.from({ length: 18 }).map((_, i) => {
            const x = -820 + i * (1640 / 17);
            const top = kurmaDomeY(x) + 10;
            const drift = (x / KURMA_RX) * 40;
            const len = 520 - top + 60 + ((i * 53) % 90);
            return (
              <path
                key={i}
                d={`M${x} ${top}C${x + drift * 0.3} ${top + len * 0.4} ${x + drift * 0.8} ${top + len * 0.8} ${x + drift} ${top + len}`}
                stroke={K.milk}
                strokeWidth={6 - (i % 3) * 1.5}
                strokeLinecap="round"
                strokeDasharray="70 34"
                strokeDashoffset={-t * 9 - i * 23}
                fill="none"
                opacity={0.5}
              />
            );
          })}
        </g>
      ) : null}
      {children}
      {mountain ? (
        <g transform={`translate(0 18) scale(${mountainScale})`}>
          <Mandar t={t} glow={mandarGlow} />
        </g>
      ) : null}
    </g>
  );
};

/** Extreme close-up of Kurma's eye opening. Origin = eye centre. open 0..1, flash 0..1 = gold rim flash. */
export const KurmaEye: React.FC<{ id: string; t: number; open: number; flash?: number; s?: number }> = ({ id, t, open, flash = 0, s = 1 }) => {
  const o = Math.max(0, Math.min(1, open));
  const lid = 1 - o;
  const pulse = 0.85 + 0.15 * Math.sin(t / 9);
  return (
    <g transform={`scale(${s})`}>
      <defs>
        <radialGradient id={`ke-${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFF4C8" />
          <stop offset="0.45" stopColor={K.goldPale} />
          <stop offset="0.8" stopColor="#E0A63E" />
          <stop offset="1" stopColor="#8A5A12" />
        </radialGradient>
        <radialGradient id={`ks-${id}`} cx="0.45" cy="0.4" r="0.7">
          <stop offset="0" stopColor={K.skinHi} />
          <stop offset="0.6" stopColor={K.skin} />
          <stop offset="1" stopColor={K.deep} />
        </radialGradient>
        <clipPath id={`kec-${id}`}>
          <path d={`M-300 0C-140 ${-170 * o - 6} 140 ${-170 * o - 6} 300 0C140 ${140 * o + 6} -140 ${140 * o + 6} -300 0Z`} />
        </clipPath>
      </defs>
      {/* scaled skin around the eye */}
      <rect x={-1200} y={-1400} width={2400} height={2800} fill={`url(#ks-${id})`} />
      {Array.from({ length: 15 }).map((_, r) =>
        Array.from({ length: 13 }).map((__, c) => {
          const x = -1200 + c * 200 + (r % 2) * 100;
          const y = -1400 + r * 200;
          if (Math.abs(y) < 260 && Math.abs(x) < 420) return null;
          return <path key={`${r}-${c}`} d={hexPath(x, y, 86)} fill="none" stroke={K.line} strokeWidth={6} opacity={0.35} />;
        }),
      )}
      {/* glow in the slit as it opens, then the gold rim flash */}
      <ellipse cx={0} cy={0} rx={380} ry={60 + 180 * o} fill={K.halo} opacity={(0.25 + 0.35 * o) * pulse} filter="url(#mBlur8)" />
      <g clipPath={`url(#kec-${id})`}>
        <rect x={-320} y={-200} width={640} height={400} fill="#FFF8E6" />
        <circle cx={0} cy={0} r={150} fill={`url(#ke-${id})`} />
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (Math.PI * 2 * i) / 24;
          return <path key={i} d={`M${Math.cos(a) * 62} ${Math.sin(a) * 62}L${Math.cos(a) * 140} ${Math.sin(a) * 140}`} stroke="#B07A1E" strokeWidth={4} opacity={0.45} />;
        })}
        <ellipse cx={0} cy={0} rx={52} ry={62} fill="#1A1206" />
        <circle cx={-34} cy={-40} r={18} fill="#FFFFFF" opacity={0.95} />
        <circle cx={30} cy={34} r={8} fill="#FFFFFF" opacity={0.6} />
        {/* lid shadow */}
        <path d="M-320 -200L320 -200L320 -40C140 -120 -140 -120 -320 -40Z" fill={K.deep} opacity={0.3 + 0.4 * lid} />
      </g>
      {/* lids */}
      <path d={`M-330 -4C-150 ${-176 * o - 12} 150 ${-176 * o - 12} 330 -4`} stroke={K.line} strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d={`M-300 6C-140 ${146 * o + 12} 140 ${146 * o + 12} 300 6`} stroke={K.line} strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.85} />
      <path d={`M-360 -40C-170 ${-230 * o - 40} 170 ${-230 * o - 40} 360 -40`} stroke={K.line} strokeWidth={10} fill="none" opacity={0.5} />
      {/* gold rim flash */}
      {flash > 0.01 ? (
        <path
          d={`M-300 0C-140 ${-170 * o - 6} 140 ${-170 * o - 6} 300 0C140 ${140 * o + 6} -140 ${140 * o + 6} -300 0Z`}
          fill="none"
          stroke={K.gold}
          strokeWidth={10 + 10 * flash}
          opacity={flash}
          filter="url(#mGlow)"
        />
      ) : null}
    </g>
  );
};
