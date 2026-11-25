import React from "react";
import { blinkAt } from "../rig";
import { P } from "../style";

/*
 * Mata Parvati for Episode 4. The rig has no female body, so she is drawn here with the rig's own
 * construction: the same FACE outline, the same almond eye (sclera, iris, highlight, lid, kajal), the
 * same cel-shade crescent and rim gradient, the same arm geometry (shoulder -> elbow -> wrist pins) and
 * the series outline filter (mCut). Coordinates match the rig: origin at the waist, facing +x.
 */
const PV = {
  skin: "#EDBE8C", skinShade: "#CF9666", skinLine: "#8E5631", rim: "#FFE6C2",
  hair: "#140D12", hairHi: "#3A2A36", sari: "#B3262E", sariShade: "#7E1520", choli: "#8C1A2A",
  iris: "#3A2014", sclera: "#FBF4EA",
};
const FACE =
  "M-40 -96C-42 -130 -16 -152 14 -152C44 -152 62 -130 62 -98C62 -84 61 -74 60 -64C58 -40 50 -18 30 -8C18 -2 2 -2 -10 -8C-26 -16 -38 -34 -40 -56Z";
const ALMOND = "M-14 0C-9 -8 8 -9 14 -2C8 5 -8 6 -14 0Z";
const UA = 94;
const FA = 86;
const UPPER = `M-15 -6C-17 30 -15 66 -11 ${UA}L11 ${UA}C14 66 16 30 14 -6C9 -14 -10 -14 -15 -6Z`;
const FORE = `M-11 -2C-12 28 -10 58 -8 ${FA}L8 ${FA}C10 58 12 28 11 -2Z`;
const HAND = "M-10 -4C-13 12 -11 28 -3 36C4 41 12 36 13 26C15 15 13 4 11 -4Z";
const THUMB = "M8 6C19 6 24 15 19 22C15 25 10 20 9 15Z";
const SH: [number, number] = [34, -186];
const NECK: [number, number] = [6, -206];
const HEAD_S = 0.8;

const Eye: React.FC<{ cx: number; s: number; open: number; lookX: number; far?: boolean; id: string }> = ({ cx, s, open, lookX, far, id }) => {
  const ix = lookX * 3.6;
  return (
    <g transform={`translate(${cx} -82) scale(${s * (far ? 0.88 : 1)} ${s})`}>
      <g transform={`scale(1 ${Math.max(0.06, open)})`}>
        <path d={ALMOND} fill={PV.sclera} />
        <clipPath id={`${id}-e${cx}`}>
          <path d={ALMOND} />
        </clipPath>
        <g clipPath={`url(#${id}-e${cx})`}>
          <circle cx={ix} cy={0.5} r={6.9} fill={PV.iris} />
          <circle cx={ix} cy={0.5} r={3.2} fill="#0B0705" />
          <circle cx={ix + 2.2} cy={-1.9} r={1.7} fill="#FFFFFF" opacity={0.95} />
          <rect x={-16} y={-12} width={32} height={7.5} fill={PV.skinShade} />
        </g>
      </g>
      {/* kajal and lashes */}
      <path d={open > 0.3 ? "M-15 0C-9 -9 9 -10 16 -3" : "M-14 0C-6 4 6 4 14 0"} stroke="#140A08" strokeWidth={3.4} fill="none" strokeLinecap="round" />
      {open > 0.3 ? <path d="M15 -3L20 -7M12 -6L16 -11" stroke="#140A08" strokeWidth={2} strokeLinecap="round" /> : null}
      {open > 0.3 ? <path d="M-12 3C-4 6 6 6 12 2" stroke="#140A08" strokeWidth={1.2} fill="none" opacity={0.45} /> : null}
    </g>
  );
};

const Head: React.FC<{ id: string; f: number; open: number; lookX: number; smile: number }> = ({ id, f, open, lookX, smile }) => {
  const sm = smile * 3;
  return (
    <g>
      {/* the bun (juda) with a jasmine ring, behind the head */}
      <circle cx={-40} cy={-118} r={30} fill={PV.hair} />
      <path d="M-62 -128C-50 -146 -28 -148 -16 -134" stroke={PV.hairHi} strokeWidth={4} fill="none" opacity={0.7} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i / 8) * Math.PI * 2 + 0.3;
        return <circle key={i} cx={-40 + 33 * Math.cos(a)} cy={-118 + 33 * Math.sin(a)} r={4.4} fill="#FFFDF2" stroke="#E8E1C8" strokeWidth={1} />;
      })}
      {/* ear and jhumka */}
      <ellipse cx={-36} cy={-76} rx={9} ry={15} fill={PV.skinShade} />
      <g transform={`translate(-36 -58) rotate(${Math.sin(f / 16) * 6})`}>
        <path d="M0 0L0 6" stroke={P.goldDark} strokeWidth={2} />
        <path d="M-8 16C-8 8 -4 5 0 5C4 5 8 8 8 16Z" fill="url(#mGold)" />
        {[-6, -2, 2, 6].map((x) => <circle key={x} cx={x} cy={18} r={1.6} fill="#FFF9EE" />)}
      </g>
      {/* face, same outline and cel shading as the rig, a touch narrower */}
      <g transform="translate(10 0) scale(0.95 1) translate(-10 0)">
        <clipPath id={`${id}-fc`}>
          <path d={FACE} />
        </clipPath>
        <linearGradient id={`${id}-fg`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={PV.skinShade} stopOpacity={0.8} />
          <stop offset="0.42" stopColor={PV.skinShade} stopOpacity={0} />
          <stop offset="0.86" stopColor={PV.rim} stopOpacity={0} />
          <stop offset="1" stopColor={PV.rim} stopOpacity={0.5} />
        </linearGradient>
        <path d={FACE} fill={PV.skin} />
        <g clipPath={`url(#${id}-fc)`}>
          <rect x={-50} y={-160} width={116} height={160} fill={`url(#${id}-fg)`} />
          <path d="M-42 -100C-44 -130 -26 -150 -4 -152C-22 -136 -28 -110 -26 -80C-24 -50 -14 -26 6 -8C-16 -10 -36 -28 -40 -56Z" fill={PV.skinShade} opacity={0.5} />
          <ellipse cx={46} cy={-56} rx={11} ry={7} fill="#E0685A" opacity={0.2} />
        </g>
      </g>
      <Eye cx={6} s={1} open={open} lookX={lookX} id={id} />
      <Eye cx={40} s={0.92} open={open} lookX={lookX} far id={id} />
      {/* thin arched brows */}
      <path d="M-8 -96C-2 -103 10 -104 19 -98" stroke={PV.hair} strokeWidth={3.4} fill="none" strokeLinecap="round" />
      <path d="M32 -98C38 -103 46 -103 52 -98" stroke={PV.hair} strokeWidth={3} fill="none" strokeLinecap="round" />
      {/* nose and nath */}
      <path d="M26 -84C29 -72 34 -64 35 -58C31 -53 26 -54 22 -57" stroke={PV.skinLine} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <circle cx={33} cy={-55} r={5.5} fill="none" stroke="url(#mGold)" strokeWidth={2} />
      <circle cx={30} cy={-50} r={1.6} fill="#C8102E" />
      {/* lips */}
      <path d={`M12 ${-37 - sm}Q24 ${-35 + sm * 0.4} 35 ${-38 - sm}`} stroke="#A82A3E" strokeWidth={3.4} fill="none" strokeLinecap="round" />
      <path d={`M16 ${-33 - sm * 0.3}Q24 ${-30} 31 ${-33 - sm * 0.3}`} stroke="#C2434A" strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.6} />
      {/* bindi */}
      <circle cx={24} cy={-108} r={3.6} fill="#C8102E" />
      <circle cx={24} cy={-115} r={1.4} fill={P.gold} />
      {/* hair: centre parting with sindoor, swept back over the ear */}
      <path d="M-40 -96C-42 -136 -12 -156 16 -154C44 -152 62 -134 63 -110C50 -124 34 -132 18 -132C2 -130 -20 -122 -40 -96Z" fill={PV.hair} />
      <path d="M-40 -96C-46 -84 -46 -72 -40 -64L-34 -66C-38 -76 -36 -88 -30 -98Z" fill={PV.hair} />
      <path d="M18 -152L18 -134" stroke="#D81E3A" strokeWidth={3} strokeLinecap="round" />
      <path d="M-20 -146C0 -154 30 -152 48 -140" stroke={PV.hairHi} strokeWidth={3} fill="none" opacity={0.6} />
      {/* small gold mukut with a ruby */}
      <g transform="translate(14 -154)">
        <path d="M-30 6C-14 0 14 0 30 6L26 -6L16 -2L8 -18L0 -4L-8 -18L-16 -2L-26 -6Z" fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={1.2} />
        <circle cx={0} cy={-8} r={3.4} fill="#C8102E" />
        <path d="M-28 6C-12 2 12 2 28 6" stroke="#FFF9EE" strokeWidth={2} strokeDasharray="0.1 5" strokeLinecap="round" />
      </g>
      {/* maang tikka */}
      <path d="M18 -134L18 -124" stroke={P.gold} strokeWidth={1.4} />
      <circle cx={18} cy={-121} r={3} fill="url(#mGold)" />
    </g>
  );
};

export type ParvatiProps = {
  id: string;
  f: number;
  x: number;
  y: number;
  s?: number;
  facing?: number;
  nod?: number; // 0..1 a gentle nod forward
  reach?: number; // 0 hand in lap .. 1 hand on Shiva's shoulder
  smile?: number;
  eyes?: number; // 1 open, natural blinks
  lookX?: number;
  lookDown?: number;
  /** "body" = everything but the front arm (drawn behind Mahadev), "arm" = only the front arm (drawn over him). */
  part?: "all" | "body" | "arm";
};

/** Mata Parvati seated, legs folded to the side under a red-and-gold sari. (x, y) is the waist. */
export const ParvatiSeated: React.FC<ParvatiProps> = ({
  id, f, x, y, s = 0.74, facing = -1, nod = 0, reach = 0, smile = 0.45, eyes = 1, lookX = 0.7, lookDown = 0, part = "all",
}) => {
  const open = Math.min(eyes, 1 - (eyes > 0.95 ? blinkAt(`${id}-b`, f) : 0)) * (1 - 0.35 * lookDown);
  const breath = Math.sin(f / 28) * 1;
  const k = Math.max(0, Math.min(1, reach));
  const sA = 14 + 84 * k;
  const eA = 38 - 16 * k;
  const wA = -16 + 26 * k;
  const head = `translate(${NECK[0]} ${NECK[1]}) rotate(${-3 + 9 * nod + 4 * lookDown}) scale(${HEAD_S})`;
  const sari = "M-46 -6C-96 4 -122 50 -112 96C-60 108 70 108 170 98C188 76 176 34 140 12C96 -8 10 -12 -46 -6Z";
  return (
    <g transform={`translate(${x} ${y + breath}) scale(${facing * s} ${s})`} filter="url(#mCut)">
      {part !== "arm" ? (
      <g>
      {/* long hair falling behind the back shoulder */}
      <path d="M-34 -222C-58 -180 -70 -110 -64 -40C-60 -10 -44 0 -34 -14C-44 -70 -38 -150 -14 -214Z" fill={PV.hair} />
      {/* (the back arm stays hidden behind her in this 3/4 view) */}
      {/* seated sari, pleats fanned toward the front, gold border at the hem */}
      <clipPath id={`${id}-sari`}>
        <path d={sari} />
      </clipPath>
      <path d={sari} fill={PV.sari} />
      <g clipPath={`url(#${id}-sari)`}>
        <path d="M-120 30C-70 20 -30 50 -16 110L-130 110Z" fill={PV.sariShade} opacity={0.75} />
        {[40, 62, 84, 106, 128].map((px) => (
          <path key={px} d={`M${px} 10C${px + 6} 40 ${px + 4} 70 ${px + 12} 104`} stroke={PV.sariShade} strokeWidth={3} fill="none" opacity={0.7} />
        ))}
        <path d="M-116 88C-50 100 70 100 172 88" stroke="url(#mGold)" strokeWidth={11} fill="none" />
        <path d="M-116 76C-50 88 70 88 172 76" stroke={P.goldLight} strokeWidth={2} fill="none" opacity={0.7} />
      </g>
      {/* feet with alta peeking out at the front */}
      <path d="M150 92C162 86 180 88 188 96C182 102 162 104 150 100Z" fill={PV.skin} stroke={PV.skinLine} strokeWidth={1.4} />
      <path d="M152 99C162 102 178 101 186 97" stroke="#C8102E" strokeWidth={3} opacity={0.75} fill="none" />
      {/* torso: choli, then the pallu across it */}
      <path d="M-20 -232L26 -232L30 -186L-24 -186Z" fill={PV.skin} />
      <path d="M-20 -232L-4 -232C-6 -214 -4 -198 2 -186L-24 -186Z" fill={PV.skinShade} opacity={0.55} />
      <path d="M-30 0C-34 -44 -48 -104 -52 -150C-54 -176 -40 -192 -14 -196L22 -196C48 -194 60 -178 58 -152C54 -104 42 -46 36 0Z" fill={PV.skin} />
      <path d="M-52 -150C-54 -176 -40 -192 -14 -196L22 -196C48 -194 60 -178 58 -152C56 -136 52 -124 50 -116C20 -108 -20 -108 -48 -116C-50 -126 -52 -138 -52 -150Z" fill={PV.choli} />
      <path d="M-48 -116C-20 -108 20 -108 50 -116" stroke="url(#mGold)" strokeWidth={4} fill="none" />
      <path d="M-50 -100C-40 -60 -36 -30 -30 0L-46 0C-48 -40 -52 -80 -50 -100Z" fill={PV.skinShade} opacity={0.6} />
      {/* sari tucked at the waist */}
      <path d="M-34 -14C-10 -6 20 -6 42 -14L44 6C20 12 -10 12 -32 6Z" fill={PV.sari} />
      <path d="M-34 -14C-10 -6 20 -6 42 -14" stroke="url(#mGold)" strokeWidth={4} fill="none" />
      {/* the pallu: a wide drape from the back shoulder across the body to the front waist */}
      <path d="M-50 -198C-30 -160 0 -80 50 0L-2 8C-22 -50 -40 -120 -62 -172Z" fill={PV.sari} />
      <path d="M-50 -198C-30 -160 0 -80 50 0L42 -2C-2 -74 -24 -132 -34 -196Z" fill={PV.sariShade} opacity={0.35} />
      <path d="M-50 -198C-30 -160 0 -80 50 0" stroke="url(#mGold)" strokeWidth={7} fill="none" />
      <path d="M-62 -172C-40 -120 -22 -50 -2 8" stroke="url(#mGold)" strokeWidth={4.5} fill="none" />
      {[-150, -110, -70, -30].map((yy, i) => (
        <circle key={yy} cx={-44 + 10 * i + 14} cy={yy + 10} r={2.2} fill={P.goldLight} opacity={0.8} />
      ))}
      {/* mangalsutra and a pearl strand */}
      <path d="M-26 -192C-14 -160 22 -158 38 -190" stroke="#1A1014" strokeWidth={2.4} fill="none" />
      <circle cx={6} cy={-166} r={3.4} fill="url(#mGold)" />
      <path d="M-30 -194C-18 -170 26 -168 42 -192" stroke="#FFF9EE" strokeWidth={4.5} strokeDasharray="0.1 6.5" strokeLinecap="round" fill="none" />
      {/* the head */}
      <g transform={head}>
        <Head id={id} f={f} open={open} lookX={lookX} smile={smile} />
      </g>
      </g>
      ) : null}
      {/* the front arm: from the lap to Mahadev's shoulder */}
      {part !== "body" ? (
      <g transform={`translate(${SH[0]} ${SH[1]}) rotate(${-sA})`}>
        <path d={UPPER} fill={PV.skin} />
        <path d={`M6 -8C12 28 12 66 9 ${UA}L11 ${UA}C14 66 16 30 14 -6Z`} fill={PV.rim} opacity={0.35} />
        <path d="M-15 -6C-15 10 -14 18 -14 24L14 24C14 16 14 6 14 -6C9 -14 -10 -14 -15 -6Z" fill={PV.choli} />
        <path d="M-14 22L14 22" stroke="url(#mGold)" strokeWidth={3} />
        <g transform={`translate(0 ${UA}) rotate(${-eA})`}>
          <circle r={11.5} fill={PV.skin} />
          <path d={FORE} fill={PV.skin} />
          <path d={`M-10 ${FA - 20}L10 ${FA - 20}L10 ${FA - 14}L-10 ${FA - 14}Z`} fill="#C8102E" />
          <path d={`M-10 ${FA - 13}L10 ${FA - 13}L10 ${FA - 6}L-10 ${FA - 6}Z`} fill="url(#mGold)" />
          <g transform={`translate(0 ${FA}) rotate(${-wA})`}>
            <path d={HAND} fill={PV.skin} stroke={PV.skinLine} strokeWidth={1.4} />
            <path d={THUMB} fill={PV.skin} stroke={PV.skinLine} strokeWidth={1.4} />
            <circle cx={2} cy={30} r={2.6} fill="#C8102E" opacity={0.7} />
          </g>
        </g>
      </g>
      ) : null}
    </g>
  );
};
