import React from "react";
import { Puppet, pose, Pose } from "../rig";
import { P } from "../style";
import type { V2 } from "./beings2";

/*
 * Episode 2 beings, part 2: Vishnu standing at the churning, Swarbhanu's head alone (Rahu),
 * and Kurma's shell glowing under the ocean of milk.
 * Vishnu's pieces are copied from Episode 1's beings.tsx (same palette and drawing) so his
 * look is identical; that file is left untouched.
 */

type T2 = [number, number];
const VB = { skin: "#3E6FD8", skinShade: "#2A4EA6", skinLine: "#1A2F6A", rim: "#BFE0FF" };

const Chakra: React.FC<{ t: number; r?: number }> = ({ t, r = 42 }) => (
  <g transform={`rotate(${t * 9})`}>
    <circle r={r + 12} fill="#FFB43D" opacity={0.35} filter="url(#mBlur8)" />
    {new Array(16).fill(0).map((_, i) => (
      <path key={i} d={`M0 ${-r - 2}L6 ${-r - 14}L-2 ${-r - 2}Z`} transform={`rotate(${i * 22.5})`} fill="#FFD36B" />
    ))}
    <circle r={r} fill="none" stroke="url(#mGold)" strokeWidth={9} />
    <circle r={r * 0.32} fill="url(#mGold)" />
    {new Array(8).fill(0).map((_, i) => (
      <path key={i} d={`M0 ${-r * 0.32}L0 ${-r + 4}`} transform={`rotate(${i * 45})`} stroke={P.goldLight} strokeWidth={4} />
    ))}
    <circle r={6} fill="#FFF6D8" />
  </g>
);

const Shankha: React.FC = () => (
  <g>
    <path d="M-22 18C-34 -6 -24 -40 4 -46C30 -50 42 -26 36 -4C30 18 10 30 -22 18Z" fill="#FBF6EC" />
    <path d="M-22 18C-30 28 -36 40 -30 46C-20 40 -14 30 -12 20Z" fill="#EFE6D4" />
    <path d="M4 -46C8 -30 6 -12 -4 4M18 -40C22 -24 18 -6 8 8M-10 -38C-10 -22 -14 -6 -18 6" stroke="#D8C9AE" strokeWidth={2.5} fill="none" />
    <path d="M-28 -2C-12 -8 14 -10 34 -6" stroke={P.gold} strokeWidth={4} fill="none" />
  </g>
);

const Arm4: React.FC<{ from: T2; to: T2; w?: number }> = ({ from, to, w = 34 }) => {
  const mid: T2 = [(from[0] + to[0]) / 2 + (to[1] - from[1]) * 0.08, (from[1] + to[1]) / 2];
  return (
    <g>
      <path d={`M${from[0]} ${from[1]}Q${mid[0]} ${mid[1]} ${to[0]} ${to[1]}`} stroke={VB.skin} strokeWidth={w} strokeLinecap="round" fill="none" />
      <path d={`M${from[0]} ${from[1]}Q${mid[0]} ${mid[1]} ${to[0]} ${to[1]}`} stroke={VB.rim} strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.45} transform="translate(-8 -4)" />
      <circle cx={mid[0]} cy={mid[1] - 10} r={w * 0.42} fill="url(#mGold)" opacity={0.95} />
      <path d={`M${to[0] - w * 0.5} ${to[1] + 4}L${to[0] + w * 0.5} ${to[1] + 4}`} stroke="url(#mGold)" strokeWidth={8} />
      <ellipse cx={to[0]} cy={to[1] - w * 0.45} rx={w * 0.5} ry={w * 0.62} fill={VB.skin} />
    </g>
  );
};

/**
 * Vishnu standing. Origin = between the feet on the ground. Upper body uses Episode 1's
 * coordinates shifted up by 360. handL/handR are the lower hands' targets in those
 * upper-body coordinates (default: relaxed). smile 0..1, closed 0..1 (eyes), halo 0..1.
 */
export const VishnuStanding: React.FC<{
  t: number;
  smile?: number;
  speak?: number;
  closed?: number;
  halo?: number;
  handL?: T2;
  handR?: T2;
}> = ({ t, smile = 0.3, speak = 0, closed = 0, halo = 0.6, handL = [-140, -96], handR = [140, -96] }) => {
  const hl = (0.55 + 0.25 * Math.sin(t / 20)) * halo;
  const shut = closed > 0.5;
  return (
    <g>
      {/* standing legs in pitambara (yellow silk) */}
      <ellipse cx={-34} cy={-8} rx={30} ry={11} fill={VB.skinShade} />
      <ellipse cx={34} cy={-8} rx={30} ry={11} fill={VB.skin} />
      <rect x={-46} y={-40} width={24} height={30} fill={VB.skinShade} />
      <rect x={22} y={-40} width={24} height={30} fill={VB.skin} />
      <path d="M-50 -26Q-34 -20 -18 -26M18 -26Q34 -20 50 -26" stroke="url(#mGold)" strokeWidth={6} fill="none" />
      <path d="M-92 -392C-100 -260 -96 -130 -88 -36L88 -36C96 -130 100 -260 92 -392Z" fill="#F2B51C" />
      <path d="M-92 -392C-100 -260 -96 -130 -88 -36L-40 -36C-52 -140 -58 -270 -56 -392Z" fill="#D99A10" opacity={0.6} />
      <path d="M-10 -380C-14 -260 -12 -140 -8 -40M22 -380C26 -260 28 -140 32 -40" stroke="#C98A0E" strokeWidth={3} fill="none" opacity={0.6} />
      <path d="M-88 -36L88 -36L86 -52L-86 -52Z" fill={P.crimson} />
      <path d="M-96 -398Q0 -382 96 -398L96 -372Q0 -356 -96 -372Z" fill="url(#mGold)" />
      <g transform="translate(0 -360)">
        {/* halo behind the head */}
        <g transform={`translate(0 -360) rotate(${t * 0.25})`} opacity={hl}>
          <circle r={170} fill="none" stroke="#FFE6A3" strokeWidth={3} />
          {new Array(20).fill(0).map((_, i) => (
            <ellipse key={i} cx={0} cy={-158} rx={6} ry={13} transform={`rotate(${i * 18})`} fill="none" stroke="#FFE6A3" strokeWidth={2} />
          ))}
        </g>
        <circle cx={0} cy={-360} r={150} fill="#FFF3C9" opacity={0.25 * hl} filter="url(#mBlur8)" />
        {/* upper arms: chakra (viewer-left), shankha (viewer-right) */}
        <Arm4 from={[-92, -240]} to={[-196, -420]} />
        <Arm4 from={[92, -240]} to={[196, -420]} />
        <g transform="translate(-200 -462)">
          <Chakra t={t} />
        </g>
        <g transform="translate(206 -456) rotate(-20)">
          <Shankha />
        </g>
        {/* torso */}
        <path d="M-74 -30C-86 -120 -96 -196 -104 -250C-64 -284 64 -284 104 -250C96 -196 86 -120 74 -30Z" fill={VB.skin} />
        <path d="M-74 -30C-86 -120 -96 -196 -104 -250C-90 -262 -76 -268 -62 -272C-70 -200 -70 -110 -50 -30Z" fill={VB.skinShade} opacity={0.6} />
        <path d="M96 -250C88 -190 80 -110 70 -30" stroke={VB.rim} strokeWidth={4} opacity={0.5} fill="none" />
        {/* vanamala + sacred thread + Kaustubha */}
        <path d="M-84 -262C-110 -120 -60 20 0 40C60 20 110 -120 84 -262" stroke="#3F8C41" strokeWidth={9} fill="none" />
        {new Array(15).fill(0).map((_, i) => {
          const u = i / 14;
          const x = Math.sin(Math.PI * u - Math.PI / 2) * 96 * (1 - 0.15 * Math.sin(Math.PI * u));
          const y = -262 + 300 * Math.sin(Math.PI * u) * 0.98;
          return <circle key={i} cx={x} cy={y} r={7} fill={i % 2 ? "#FFFFFF" : "#F7C1D6"} />;
        })}
        <path d="M-80 -256C-40 -170 10 -90 66 -34" stroke="#F6EEDB" strokeWidth={3.5} fill="none" />
        <path d="M-70 -258C-40 -214 40 -214 70 -258" stroke="url(#mGold)" strokeWidth={8} fill="none" />
        <circle cx={0} cy={-206} r={15} fill={P.goldDeep} />
        <circle cx={0} cy={-206} r={12} fill="#E3264A" />
        <circle cx={0} cy={-206} r={12} fill="url(#mGem)" />
        {/* lower arms: free to grip the serpent */}
        <Arm4 from={[-96, -236]} to={handL} w={32} />
        <Arm4 from={[96, -236]} to={handR} w={32} />
        {/* neck + head */}
        <path d="M-24 -300L24 -300L28 -262L-28 -262Z" fill={VB.skin} />
        <path d="M-64 -350C-66 -410 -38 -440 0 -440C38 -440 66 -410 64 -350C62 -300 34 -282 0 -282C-34 -282 -62 -300 -64 -350Z" fill={VB.skin} />
        <path d="M-64 -350C-66 -410 -38 -440 0 -440C-28 -420 -40 -380 -36 -330C-34 -306 -24 -292 -10 -284C-40 -288 -62 -308 -64 -350Z" fill={VB.skinShade} opacity={0.5} />
        <path d="M-62 -380C-86 -340 -96 -290 -80 -250C-66 -270 -60 -310 -58 -340ZM62 -380C86 -340 96 -290 80 -250C66 -270 60 -310 58 -340Z" fill="#0E1022" />
        {[-24, 24].map((x) => (
          <g key={x}>
            {shut ? (
              <path d={`M${x - 15} -360C${x - 6} -354 ${x + 6} -354 ${x + 15} -360`} stroke="#0B1030" strokeWidth={4} fill="none" strokeLinecap="round" />
            ) : (
              <g>
                <path d={`M${x - 15} -362C${x - 6} -370 ${x + 6} -370 ${x + 15} -362C${x + 6} -357 ${x - 6} -357 ${x - 15} -362Z`} fill="#F4F7FF" />
                <path d={`M${x - 15} -362C${x - 6} -368 ${x + 6} -368 ${x + 15} -362`} stroke="#0B1030" strokeWidth={4} fill="none" strokeLinecap="round" />
                <circle cx={x} cy={-360} r={4} fill="#0B1030" />
              </g>
            )}
            <path d={`M${x - 16} -380C${x - 6} -387 ${x + 6} -387 ${x + 16} -380`} stroke="#0B1030" strokeWidth={4} fill="none" strokeLinecap="round" />
          </g>
        ))}
        <path d="M0 -356L-6 -330C-2 -326 4 -326 8 -330" stroke={VB.skinLine} strokeWidth={3} fill="none" strokeLinecap="round" />
        <path d={`M-17 -311Q0 ${-303 + smile * 9 + speak * 5} 17 -311`} stroke="#8E1B3A" strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d="M-10 -376C-12 -396 -10 -410 -8 -420M10 -376C12 -396 10 -410 8 -420" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" />
        <path d="M0 -382L0 -416" stroke="#E3264A" strokeWidth={4} strokeLinecap="round" />
        {[-66, 66].map((x) => (
          <g key={x} transform={`translate(${x} -330)`}>
            <path d="M-10 -10C-16 4 -10 18 0 22C10 18 16 4 10 -10Z" fill="url(#mGold)" />
            <circle cy={4} r={4} fill="#E3264A" />
          </g>
        ))}
        <path d="M-56 -436L56 -436L44 -560L0 -604L-44 -560Z" fill="url(#mGold)" />
        <path d="M-50 -470L50 -470M-46 -520L46 -520" stroke={P.goldDeep} strokeWidth={3} />
        <path d="M-62 -426Q0 -416 62 -426L62 -444Q0 -434 -62 -444Z" fill="url(#mGold)" />
        {[-36, 0, 36].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy={-494} r={i === 1 ? 11 : 7} fill={P.goldDeep} />
            <circle cx={x} cy={-494} r={i === 1 ? 9 : 5.5} fill={i === 1 ? "#E3264A" : "#2E7BFF"} />
          </g>
        ))}
      </g>
    </g>
  );
};

/**
 * Swarbhanu's head alone, the future Rahu: his own puppet clipped at the neck, with dark smoke
 * hanging where the body was. `at` = head centre in world space; s = puppet scale.
 */
export const RahuHead: React.FC<{ id: string; at: V2; s: number; t: number; p?: Partial<Pose>; smoke?: number }> = ({ id, at, s, t, p = {}, smoke = 1 }) => {
  const cid = `rahu-${id}`;
  return (
    <g>
      <defs>
        <clipPath id={cid}>
          <ellipse cx={at.x} cy={at.y - 70 * s} rx={112 * s} ry={140 * s} />
        </clipPath>
      </defs>
      {smoke > 0.01 ? (
        <g opacity={smoke}>
          {[-2, -1, 0, 1, 2].map((k) => {
            const w = Math.sin(t / 9 + k * 1.7) * 10 * s;
            const x = at.x + k * 16 * s;
            const y0 = at.y + 52 * s;
            const len = (58 + (2 - Math.abs(k)) * 22) * s;
            const curl = k * 14 * s;
            const d = `M${x} ${y0}C${x + w} ${y0 + len * 0.4} ${x + curl - w} ${y0 + len * 0.7} ${x + curl * 1.6 + w} ${y0 + len}`;
            return (
              <g key={k}>
                <path d={d} stroke="#2A1B44" strokeWidth={(40 - Math.abs(k) * 6) * s} strokeLinecap="round" fill="none" opacity={0.35} />
                <path d={d} stroke="#140C22" strokeWidth={(22 - Math.abs(k) * 4) * s} strokeLinecap="round" fill="none" opacity={0.7} />
              </g>
            );
          })}
          <ellipse cx={at.x} cy={at.y + 58 * s} rx={62 * s} ry={22 * s} fill="#140C22" opacity={0.85} />
        </g>
      ) : null}
      <g clipPath={`url(#${cid})`}>
        <Puppet id={id} who="swarbhanu" at={{ x: at.x - 29 * s, y: at.y + 289 * s, s, facing: 1 }} p={pose({ sF: 6, eF: 8, ...p })} t={t} />
      </g>
    </g>
  );
};

const hexPath = (cx: number, cy: number, r: number) => {
  const pts = new Array(6).fill(0).map((_, i) => {
    const a = (Math.PI / 3) * i;
    return `${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`;
  });
  return `M${pts.join("L")}Z`;
};

/** Kurma's shell glowing under the milk, with one calm eye. Origin = shell centre. */
export const KurmaGlow: React.FC<{ id: string; t: number; glow?: number; eye?: number }> = ({ id, t, glow = 1, eye = 1 }) => {
  const pulse = 0.75 + 0.25 * Math.sin(t / 14);
  const r = 74;
  const cells: { x: number; y: number }[] = [];
  for (let c = -5; c <= 5; c++) {
    for (let rw = -3; rw <= 3; rw++) {
      cells.push({ x: c * 1.5 * r, y: rw * Math.sqrt(3) * r + (c % 2 ? (Math.sqrt(3) / 2) * r : 0) });
    }
  }
  return (
    <g opacity={glow}>
      <defs>
        <radialGradient id={`kg-${id}`} cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#7FD3FF" />
          <stop offset="0.55" stopColor="#2F6E9C" />
          <stop offset="1" stopColor="#173A5A" />
        </radialGradient>
        <clipPath id={`kc-${id}`}>
          <ellipse cx={0} cy={0} rx={520} ry={240} />
        </clipPath>
      </defs>
      <ellipse cx={0} cy={0} rx={640} ry={330} fill="#FFE29A" opacity={0.28 * pulse} filter="url(#mBlur8)" />
      <ellipse cx={0} cy={0} rx={520} ry={240} fill={`url(#kg-${id})`} />
      <g clipPath={`url(#kc-${id})`}>
        {cells.map((c, i) => (
          <path key={i} d={hexPath(c.x, c.y, r - 6)} fill="#FFE6A3" fillOpacity={0.06 + 0.06 * ((i * 7) % 3)} stroke="#FFD27A" strokeWidth={4} strokeOpacity={0.55 * pulse} />
        ))}
      </g>
      <ellipse cx={0} cy={0} rx={520} ry={240} fill="none" stroke="#FFD27A" strokeWidth={8} opacity={0.7 * pulse} />
      {/* head emerging at the front, one calm eye */}
      <g transform="translate(560 40)">
        <ellipse cx={0} cy={0} rx={96} ry={72} fill="#2F6E9C" />
        <ellipse cx={-10} cy={-14} rx={70} ry={40} fill="#4F92C0" opacity={0.6} />
        <g transform="translate(26 -14)">
          <path d={`M-22 0C-10 ${-12 * eye - 1} 10 ${-12 * eye - 1} 22 0C10 ${10 * eye + 1} -10 ${10 * eye + 1} -22 0Z`} fill="#FFE6A3" filter="url(#mGlow)" />
          <ellipse cx={0} cy={0} rx={6} ry={7 * eye + 0.5} fill="#1A1206" />
          <path d="M-24 -2C-10 -14 10 -14 24 -2" stroke="#173A5A" strokeWidth={5} fill="none" strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
};
