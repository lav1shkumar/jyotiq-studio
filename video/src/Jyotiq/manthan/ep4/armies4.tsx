import React from "react";
import { blinkAt, LOOKS, pose, Pose, Puppet, Who } from "../rig";
import { rnd } from "../style";

/*
 * Episode 4 crowd helpers on the series rig (rig.tsx). The rig's lower body is a standing dhoti, so
 * running and kneeling legs are drawn here in each character's own dhoti colours (LOOKS[who].dhoti),
 * then the rig draws everything above the waist (noLegs). Rig units: origin at the waist, a standing
 * figure's soles at +245 (Episode 3's `base` convention: origin y = base - 245 * s).
 */
type V2 = [number, number];
const rad = (d: number) => (d * Math.PI) / 180;
const along = (o: V2, deg: number, len: number): V2 => [o[0] + Math.sin(rad(deg)) * len, o[1] + Math.cos(rad(deg)) * len];

export type Member = { who: Who; id: string; x: number; base: number; s: number; facing: number; prop?: React.ReactNode };

const Leg: React.FC<{ who: Who; hip: V2; thigh: number; shin: number; back?: boolean }> = ({ who, hip, thigh, shin, back }) => {
  const L = LOOKS[who];
  const [cloth, shade, border] = L.dhoti;
  const knee = along(hip, thigh, 108);
  const ankle = along(knee, shin, 100);
  const c = back ? shade : cloth;
  const toe: V2 = [ankle[0] + 34, ankle[1] + 6];
  return (
    <g strokeLinecap="round" fill="none">
      <path d={`M${hip[0]} ${hip[1]}L${knee[0]} ${knee[1]}`} stroke={c} strokeWidth={46} />
      <path d={`M${knee[0]} ${knee[1]}L${ankle[0]} ${ankle[1]}`} stroke={c} strokeWidth={30} />
      <path d={`M${knee[0]} ${knee[1]}L${ankle[0]} ${ankle[1]}`} stroke={border} strokeWidth={30} strokeDasharray={`0 70 8 100`} opacity={0.85} />
      <path d={`M${ankle[0] - 6} ${ankle[1] - 4}L${toe[0]} ${toe[1]}`} stroke={back ? L.skinShade : L.skin} strokeWidth={15} />
    </g>
  );
};

/** Two legs in mid-stride. ph = stride phase (radians). */
export const RunLegs: React.FC<{ who: Who; ph: number }> = ({ who, ph }) => {
  const legAt = (p: number): [number, number] => {
    const thigh = 36 * Math.sin(p);
    const bend = 14 + 64 * (0.5 + 0.5 * Math.cos(p)) * (Math.sin(p) > -0.2 ? 1 : 0.4);
    return [thigh, thigh - bend];
  };
  const [tb, sb] = legAt(ph + Math.PI);
  const [tf, sf] = legAt(ph);
  const L = LOOKS[who];
  return (
    <g>
      <Leg who={who} hip={[-6, 6]} thigh={tb} shin={sb} back />
      <Leg who={who} hip={[10, 6]} thigh={tf} shin={sf} />
      <path d="M-50 -10L54 -10L55 12L-51 12Z" fill="url(#mGold)" />
      <path d="M-46 12C-30 30 30 30 50 12" fill={L.dhoti[0]} />
    </g>
  );
};

/** Kneeling on both knees, shins flat behind on the ground (ground at +118). */
export const KneelLegs: React.FC<{ who: Who }> = ({ who }) => {
  const L = LOOKS[who];
  const [cloth, shade, border] = L.dhoti;
  return (
    <g strokeLinecap="round">
      {/* back shin and foot */}
      <path d="M-4 104L-96 110" stroke={shade} strokeWidth={30} fill="none" />
      <path d="M-96 110L-126 114" stroke={L.skinShade} strokeWidth={14} fill="none" />
      {/* thighs down to the knees, front shin along the ground */}
      <path d="M-48 2C-56 40 -50 80 -40 106L44 112C52 80 56 40 52 2Z" fill={cloth} />
      <path d="M-48 2C-56 40 -50 80 -40 106L-10 108C-20 80 -22 40 -18 2Z" fill={shade} opacity={0.7} />
      <path d="M30 104L-70 114" stroke={cloth} strokeWidth={30} fill="none" />
      <path d="M-70 114L-104 118" stroke={L.skin} strokeWidth={14} fill="none" />
      <path d="M-40 106L44 112" stroke={border} strokeWidth={8} fill="none" />
      <path d="M-50 -10L54 -10L55 12L-51 12Z" fill="url(#mGold)" />
    </g>
  );
};

export const runPose = (seed: string, f: number, k = 1): { p: Partial<Pose>; ph: number } => {
  const ph = f / 4.4 + rnd(seed) * 6.28;
  const sw = Math.sin(ph);
  return {
    ph,
    p: {
      lean: 13 * k, bob: -Math.abs(Math.cos(ph)) * 9 * k,
      sF: -38 * sw * k, eF: 62 - 18 * sw, sB: 38 * sw * k, eB: 62 + 18 * sw,
      head: -5, lookX: 0.9, lookY: -0.3, brow: 0.5, browTilt: -10,
    },
  };
};

/** A running crowd member (stride driven by f). */
export const Runner: React.FC<{ m: Member; f: number; k?: number; extra?: Partial<Pose>; drain?: number }> = ({ m, f, k = 1, extra = {}, drain = 0 }) => {
  const { p, ph } = runPose(m.id, f, k);
  const q = pose({ ...p, ...extra, blink: blinkAt(m.id, f) });
  const at = { x: m.x, y: m.base - 245 * m.s, s: m.s, facing: m.facing };
  return (
    <g>
      <g transform={`translate(${at.x} ${at.y + q.bob}) scale(${at.facing * at.s} ${at.s})`} filter="url(#mCut)">
        <RunLegs who={m.who} ph={ph} />
      </g>
      <Puppet id={m.id} who={m.who} at={at} p={q} t={f} prop={m.prop} noLegs drain={drain} />
    </g>
  );
};

/** A kneeling crowd member, hands joined; `bow` 0..1 leans forward, `talk` drives the mouth. */
export const Kneeler: React.FC<{ m: Member; f: number; bow?: number; talk?: number; extra?: Partial<Pose>; drain?: number }> = ({ m, f, bow = 0, talk = 0, extra = {}, drain = 0 }) => {
  const q = pose({
    lean: 4 + 12 * bow, bob: Math.sin(f / 24 + rnd(m.id) * 6) * 1.5, sway: 0,
    sF: 54, eF: 116, wF: -24, sB: 46, eB: 112, wB: -20,
    head: 2 + 8 * bow, lookX: 0.7, lookY: -0.5 * (1 - bow), brow: 0.6, browTilt: -12, talk,
    ...extra, blink: blinkAt(m.id, f),
  });
  const at = { x: m.x, y: m.base - 118 * m.s, s: m.s, facing: m.facing };
  return (
    <g>
      <g transform={`translate(${at.x} ${at.y + q.bob}) scale(${at.facing * at.s} ${at.s})`} filter="url(#mCut)">
        <KneelLegs who={m.who} />
      </g>
      <Puppet id={m.id} who={m.who} at={at} p={q} t={f} prop={m.prop} noLegs drain={drain} />
    </g>
  );
};
