import React from "react";
import { LOOKS, Who } from "./rig";
import { P, wob } from "./style";

/* Non-puppet beings: Airavata (Indra's white elephant, four tusks) and
   Vishnu on Shesha (frontal, luminous). Same flat-vector language as the
   rig: base colour + cel shadow + warm rim, gold gradients from RigDefs. */

/* ------------------------------------------------------------------ */
/* Airavata                                                            */
/* ------------------------------------------------------------------ */

const EL = { base: "#F1ECE4", shade: "#D2C9BD", deep: "#AEA396", rim: "#FFF9EF", pink: "#E7B7AE", line: "#8C8072" };

/** Where a rider's waist sits, in Airavata local units. */
export const AIRAVATA_SEAT: [number, number] = [70, -470];

type V = [number, number];
const trunkChain = (t: number, sway: number, curl: number): V[] => {
  const segs = [52, 48, 44, 40, 34, 28, 22];
  let a = 78; // degrees from +x, pointing down-forward
  let p: V = [352, -330];
  const pts: V[] = [p];
  segs.forEach((L, i) => {
    a += 4 + curl * (i > 3 ? 16 : 2) + Math.sin(t / 22 - i * 0.7) * sway * (2 + i * 1.2);
    const r = (a * Math.PI) / 180;
    p = [p[0] + Math.cos(r) * L, p[1] + Math.sin(r) * L];
    pts.push(p);
  });
  return pts;
};

const Leg: React.FC<{ x: number; step: number; far?: boolean; fore?: boolean }> = ({ x, step, far, fore }) => {
  const c = far ? EL.shade : EL.base;
  const lift = Math.max(0, step) * 26;
  return (
    <g transform={`translate(${x} -230) rotate(${step * (fore ? 10 : -8)})`}>
      <path d={`M-46 0C-50 70 -48 150 -44 ${222 - lift}L44 ${222 - lift}C48 150 50 70 46 0Z`} fill={c} />
      <path d={`M-46 0C-50 70 -48 150 -44 ${222 - lift}L-24 ${222 - lift}C-28 150 -28 70 -24 0Z`} fill={EL.deep} opacity={far ? 0.5 : 0.35} />
      <path d={`M-44 ${168 - lift}Q0 ${180 - lift} 44 ${168 - lift}L44 ${182 - lift}Q0 ${194 - lift} -44 ${182 - lift}Z`} fill="url(#mGold)" opacity={far ? 0.7 : 1} />
      {[-26, 0, 26].map((nx) => (
        <ellipse key={nx} cx={nx} cy={218 - lift} rx={11} ry={6} fill="#E9E1D3" opacity={0.9} />
      ))}
    </g>
  );
};

export const Airavata: React.FC<{
  t: number;
  step?: number; // walk phase driver (radians); 0 = standing
  walk?: number; // 0..1 walk amount
  flap?: number; // ear flap 0..1
  trunkSway?: number;
  trunkCurl?: number; // 0 hanging .. 1 curled up
  rider?: React.ReactNode; // drawn between the far and near side
  riderLegs?: React.ReactNode;
}> = ({ t, step = 0, walk = 0, flap = 0, trunkSway = 1, trunkCurl = 0, rider, riderLegs }) => {
  const s1 = Math.sin(step) * walk;
  const s2 = Math.sin(step + Math.PI) * walk;
  const bob = Math.abs(Math.sin(step)) * 6 * walk;
  const ear = flap * 14 + Math.sin(t / 16) * 3;
  const pts = trunkChain(t, trunkSway, trunkCurl);
  const widths = [50, 46, 40, 34, 28, 22, 17, 13];
  return (
    <g transform={`translate(0 ${-bob})`}>
      {/* far legs */}
      <Leg x={140} step={s2} far fore />
      <Leg x={-190} step={s1} far />
      {/* tail */}
      <path d={`M-262 -350C${-292 + wob("tail", t / 30) * 10} -300 ${-288 + wob("tail", t / 30) * 14} -250 -280 -220`} stroke={EL.shade} strokeWidth={9} fill="none" strokeLinecap="round" />
      {/* body */}
      <path d="M-262 -270C-276 -392 -168 -470 -20 -472C126 -474 206 -430 236 -350C254 -300 246 -238 214 -206L-232 -206C-256 -222 -262 -246 -262 -270Z" fill={EL.base} />
      <path d="M-262 -270C-270 -330 -246 -390 -200 -430C-224 -370 -230 -300 -214 -206L-232 -206C-256 -222 -262 -246 -262 -270Z" fill={EL.shade} opacity={0.8} />
      <path d="M-210 -230C-60 -200 80 -200 214 -222L214 -206L-232 -206Z" fill={EL.deep} opacity={0.35} />
      <path d="M-120 -464C-40 -476 80 -474 150 -440" stroke={EL.rim} strokeWidth={10} fill="none" opacity={0.8} strokeLinecap="round" />
      {/* royal blanket (jhool) with gold border + tassels */}
      <path d="M-170 -452C-90 -470 60 -470 150 -444L176 -300C70 -280 -100 -280 -200 -300Z" fill={P.crimson} />
      <path d="M-160 -436C-80 -452 60 -452 142 -428L162 -318C64 -300 -92 -300 -186 -318Z" fill="none" stroke={P.gold} strokeWidth={6} />
      <path d="M-200 -300C-100 -280 70 -280 176 -300" stroke="url(#mGold)" strokeWidth={14} fill="none" />
      {new Array(11).fill(0).map((_, i) => {
        const x = -186 + i * 34;
        const sw = wob(`tas${i}`, t / 25) * 3;
        return (
          <g key={i}>
            <path d={`M${x} -292L${x + sw} -262`} stroke={P.goldDark} strokeWidth={3} />
            <path d={`M${x - 6 + sw} -268L${x + 6 + sw} -268L${x + 3 + sw} -246L${x - 3 + sw} -246Z`} fill={P.gold} />
          </g>
        );
      })}
      {[-110, -20, 70].map((x) => (
        <g key={x} transform={`translate(${x} -380)`}>
          <circle r={16} fill="none" stroke={P.gold} strokeWidth={4} />
          <circle r={6} fill={P.gold} />
        </g>
      ))}
      {/* seat cushion */}
      <path d="M10 -474C40 -490 110 -490 140 -470L136 -452C100 -462 50 -462 14 -454Z" fill={P.maroon} stroke={P.gold} strokeWidth={3} />
      {rider}
      {/* head */}
      <path d="M176 -462C226 -516 330 -506 356 -426C372 -368 360 -306 330 -276C306 -252 262 -252 238 -276C200 -310 168 -380 176 -462Z" fill={EL.base} />
      <path d="M236 -500C300 -514 346 -480 356 -426" stroke={EL.rim} strokeWidth={8} fill="none" opacity={0.8} strokeLinecap="round" />
      {/* trunk: FK chain, tapered */}
      {pts.slice(0, -1).map((a, i) => {
        const b = pts[i + 1];
        const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
        const nx = -Math.sin(ang);
        const ny = Math.cos(ang);
        const w0 = widths[i] / 2;
        const w1 = widths[i + 1] / 2;
        return (
          <g key={i}>
            <path
              d={`M${a[0] + nx * w0} ${a[1] + ny * w0}L${b[0] + nx * w1} ${b[1] + ny * w1}L${b[0] - nx * w1} ${b[1] - ny * w1}L${a[0] - nx * w0} ${a[1] - ny * w0}Z`}
              fill={EL.base}
            />
            <circle cx={b[0]} cy={b[1]} r={w1} fill={EL.base} />
            <path d={`M${a[0] - nx * w0 * 0.7} ${a[1] - ny * w0 * 0.7}L${b[0] - nx * w1 * 0.7} ${b[1] - ny * w1 * 0.7}`} stroke={EL.line} strokeWidth={1.6} opacity={0.35} />
            {/* wrinkles */}
            <path d={`M${(a[0] + b[0]) / 2 + nx * w0 * 0.8} ${(a[1] + b[1]) / 2 + ny * w0 * 0.8}L${(a[0] + b[0]) / 2 - nx * w0 * 0.5} ${(a[1] + b[1]) / 2 - ny * w0 * 0.5}`} stroke={EL.line} strokeWidth={1.8} opacity={0.3} />
          </g>
        );
      })}
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={7} fill={EL.pink} />
      {/* four tusks: far pair (darker) + near pair */}
      {[
        { x: 300, y: -300, s: 1.15, c: "#E2D6BC" },
        { x: 312, y: -286, s: 1.0, c: "#E2D6BC" },
        { x: 330, y: -304, s: 1.4, c: "#FFF8E8" },
        { x: 340, y: -288, s: 1.2, c: "#FFF8E8" },
      ].map((k, i) => (
        <g key={i} transform={`translate(${k.x} ${k.y}) scale(${k.s})`}>
          <path d="M0 0C34 22 78 22 112 -14C94 28 40 38 -4 18Z" fill={k.c} />
          <path d="M2 8C36 26 76 24 104 -4" stroke="#C9B994" strokeWidth={1.6} fill="none" opacity={0.6} />
          <path d="M8 6C24 14 30 16 34 15" stroke={P.gold} strokeWidth={5} />
        </g>
      ))}
      {/* jeweled head plate (mukha-patta) */}
      <path d="M232 -500C268 -510 312 -500 330 -470C340 -430 336 -380 330 -342L306 -300C296 -350 280 -400 252 -440C244 -460 236 -480 232 -500Z" fill="url(#mGold)" />
      <path d="M250 -480C276 -486 304 -478 316 -458" stroke="#FFF0BF" strokeWidth={2.4} fill="none" />
      {[
        [290, -470, 7, "#D9283A"],
        [306, -428, 6, "#2E7BFF"],
        [312, -384, 5, "#D9283A"],
        [314, -344, 4.5, "#2E7BFF"],
      ].map(([x, y, r, c], i) => (
        <g key={i}>
          <circle cx={x as number} cy={y as number} r={(r as number) + 1.6} fill={P.goldDeep} />
          <circle cx={x as number} cy={y as number} r={r as number} fill={c as string} />
        </g>
      ))}
      {/* eye */}
      <path d="M268 -396C276 -404 290 -404 296 -396C290 -390 276 -390 268 -396Z" fill="#2A1A12" />
      <circle cx={285} cy={-397} r={1.8} fill="#FFFFFF" />
      <path d="M266 -400C276 -410 292 -410 300 -400" stroke={EL.line} strokeWidth={2} fill="none" />
      {/* ear */}
      <g transform={`translate(206 -446) rotate(${-ear})`}>
        <path d="M0 0C-70 -10 -122 30 -118 112C-114 172 -60 192 -20 170C8 152 16 92 10 30Z" fill={EL.base} />
        <path d="M-6 16C-60 12 -96 44 -94 108C-92 150 -58 164 -32 150C-10 138 -2 88 -4 34Z" fill={EL.shade} />
        <path d="M-20 40C-56 44 -74 76 -70 112" stroke={EL.pink} strokeWidth={5} fill="none" opacity={0.5} strokeLinecap="round" />
        <path d="M0 0C-70 -10 -122 30 -118 112C-114 172 -60 192 -20 170" stroke="url(#mGold)" strokeWidth={6} fill="none" />
      </g>
      {/* necklace of bells */}
      <path d="M190 -300C214 -268 262 -250 300 -258" stroke="url(#mGold)" strokeWidth={6} fill="none" />
      {[206, 236, 268].map((x, i) => (
        <path key={x} d={`M${x - 7} ${-276 + i * 6}Q${x} ${-292 + i * 6} ${x + 7} ${-276 + i * 6}L${x + 8} ${-262 + i * 6}L${x - 8} ${-262 + i * 6}Z`} fill={P.gold} />
      ))}
      {/* near legs */}
      <Leg x={190} step={s1} fore />
      <Leg x={-150} step={s2} />
      {riderLegs}
    </g>
  );
};

/** A rider's seated lower body (dhoti lap + hanging shin), in the rider's waist frame. */
export const SeatedLegs: React.FC<{ who: Who; swing?: number }> = ({ who, swing = 0 }) => {
  const L = LOOKS[who];
  const [cloth, shade, border] = L.dhoti;
  return (
    <g>
      <path d="M-48 0L50 -4C78 6 96 24 96 46L70 60C40 52 -10 50 -46 40Z" fill={cloth} />
      <path d="M-46 30C-10 42 40 48 70 58" stroke={border} strokeWidth={6} fill="none" />
      <path d="M-48 0L-20 -2C-26 14 -30 28 -46 40Z" fill={shade} opacity={0.6} />
      <g transform={`translate(80 46) rotate(${8 + swing})`}>
        <path d="M-16 0L18 0C20 50 18 90 16 118L-12 118C-16 90 -18 50 -16 0Z" fill={cloth} />
        <path d="M-14 104L16 104" stroke={border} strokeWidth={8} />
        <path d="M-10 118L14 118C18 128 26 134 40 138C46 140 46 148 40 150L-8 150C-14 142 -14 128 -10 118Z" fill={L.skin} />
        <path d="M-12 124Q2 130 16 124" stroke="url(#mGold)" strokeWidth={4} fill="none" />
      </g>
      <path d="M-50 -10L54 -10L55 12L-51 12Z" fill="url(#mGold)" />
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Vishnu on Shesha (frontal, luminous)                                */
/* ------------------------------------------------------------------ */

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

const Gada: React.FC = () => (
  <g>
    <rect x={-5} y={-20} width={10} height={250} rx={4} fill="url(#mGoldDark)" />
    <circle cx={0} cy={-46} r={34} fill="url(#mGold)" />
    <path d="M-34 -46H34M0 -80V-12" stroke={P.goldDeep} strokeWidth={3} opacity={0.6} />
    <circle cx={0} cy={-46} r={10} fill="#D9283A" />
  </g>
);

const Lotus: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    {[-50, -25, 0, 25, 50].map((a, i) => (
      <path key={a} d="M0 0C-12 -18 -10 -44 0 -58C10 -44 12 -18 0 0Z" transform={`rotate(${a})`} fill={i % 2 ? "#F48FB1" : "#EC6F9A"} />
    ))}
    <path d="M0 0C-8 -14 -6 -34 0 -46C6 -34 8 -14 0 0Z" fill="#FFC2D6" />
  </g>
);

const Hood: React.FC<{ glow: number }> = ({ glow }) => (
  <g>
    <path d="M-10 70C-14 40 -46 20 -48 -10C-50 -40 -28 -58 0 -58C28 -58 50 -40 48 -10C46 20 14 40 10 70Z" fill="#2F4D68" />
    <path d="M-5 64C-7 38 -26 22 -27 -6C-27 -26 -14 -40 0 -40C14 -40 27 -26 27 -6C26 22 7 38 5 64Z" fill="#E7D7A4" />
    {[-24, -10, 4, 18, 32, 46].map((y) => (
      <path key={y} d={`M-20 ${y}Q0 ${y + 5} 20 ${y}`} stroke="#B89A55" strokeWidth={1.8} fill="none" opacity={0.7} />
    ))}
    <path d="M-12 -56C-14 -72 -6 -82 0 -82C6 -82 14 -72 12 -56C6 -52 -6 -52 -12 -56Z" fill="#2F4D68" />
    <circle cx={-5} cy={-68} r={2.4} fill="#FFE07A" opacity={0.6 + 0.4 * glow} />
    <circle cx={5} cy={-68} r={2.4} fill="#FFE07A" opacity={0.6 + 0.4 * glow} />
  </g>
);

const Arm4: React.FC<{ from: V; to: V; w?: number }> = ({ from, to, w = 34 }) => {
  const mid: V = [(from[0] + to[0]) / 2 + (to[1] - from[1]) * 0.08, (from[1] + to[1]) / 2];
  return (
    <g>
      <path d={`M${from[0]} ${from[1]}Q${mid[0]} ${mid[1]} ${to[0]} ${to[1]}`} stroke={VB.skin} strokeWidth={w} strokeLinecap="round" fill="none" />
      <path d={`M${from[0]} ${from[1]}Q${mid[0]} ${mid[1]} ${to[0]} ${to[1]}`} stroke={VB.rim} strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.45} transform="translate(-8 -4)" />
      <circle cx={mid[0]} cy={mid[1] - 10} r={w * 0.42} fill="url(#mGold)" opacity={0.95} />
      <path d={`M${to[0] - w * 0.5} ${to[1] + 4}L${to[0] + w * 0.5} ${to[1] + 4}`} stroke="url(#mGold)" strokeWidth={8} />
      <ellipse cx={to[0]} cy={to[1] - w * 0.45} rx={w * 0.5} ry={w * 0.62} fill={VB.skin} />
      <path d={`M${to[0] - w * 0.3} ${to[1] - w * 0.9}C${to[0] - w * 0.2} ${to[1] - w * 1.2} ${to[0] + w * 0.2} ${to[1] - w * 1.2} ${to[0] + w * 0.3} ${to[1] - w * 0.9}`} stroke={VB.skinLine} strokeWidth={2} fill="none" opacity={0.6} />
    </g>
  );
};

/** Vishnu seated on Shesha's coils under the seven hoods. Origin = centre of the seat. */
export const VishnuOnShesha: React.FC<{ t: number; reveal: number; speak?: number }> = ({ t, reveal, speak = 0 }) => {
  const halo = 0.55 + 0.25 * Math.sin(t / 20) + 0.5 * speak;
  const hoods = 7;
  return (
    <g opacity={Math.min(1, reveal * 1.4)}>
      {/* mandala halo + rays */}
      <g transform={`translate(0 -360) rotate(${t * 0.25})`} opacity={0.9 * reveal}>
        {new Array(24).fill(0).map((_, i) => (
          <path key={i} d="M-10 -300L10 -300L3 -560L-3 -560Z" transform={`rotate(${i * 15})`} fill="#FFE9A6" opacity={0.18 * halo} />
        ))}
        <circle r={300} fill="none" stroke="#FFE6A3" strokeWidth={3} opacity={0.7} />
        <circle r={262} fill="none" stroke="#FFE6A3" strokeWidth={1.5} opacity={0.6} />
        {new Array(28).fill(0).map((_, i) => (
          <ellipse key={i} cx={0} cy={-281} rx={8} ry={17} transform={`rotate(${i * (360 / 28)})`} fill="none" stroke="#FFE6A3" strokeWidth={2} opacity={0.75} />
        ))}
      </g>
      <circle cx={0} cy={-360} r={200} fill="#FFF3C9" opacity={0.28 * halo * reveal} filter="url(#mBlur8)" />
      {/* Shesha's hoods canopy */}
      {new Array(hoods).fill(0).map((_, i) => {
        const a = -66 + (i * 132) / (hoods - 1);
        const r = (a * Math.PI) / 180;
        const x = Math.sin(r) * 205;
        const y = -440 - Math.cos(r) * 205;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${a * 0.85}) scale(${i === 3 ? 1.42 : 1.28})`}>
            <Hood glow={halo} />
          </g>
        );
      })}
      <path d="M-120 -330C-150 -250 -150 -120 -110 -20M120 -330C150 -250 150 -120 110 -20" stroke="#2F4D68" strokeWidth={46} fill="none" strokeLinecap="round" />
      {/* coils (throne) */}
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <ellipse cx={0} cy={40 + k * 60} rx={230 - k * 14} ry={48} fill="#2F4D68" />
          <path d={`M${-226 + k * 14} ${40 + k * 60}C-120 ${80 + k * 60} 120 ${80 + k * 60} ${226 - k * 14} ${40 + k * 60}`} stroke="#E7D7A4" strokeWidth={16} fill="none" />
          <path d={`M${-200 + k * 14} ${30 + k * 60}C-100 ${6 + k * 60} 100 ${6 + k * 60} ${200 - k * 14} ${30 + k * 60}`} stroke="#5D86A6" strokeWidth={6} fill="none" opacity={0.6} />
        </g>
      ))}
      {/* upper arms (behind torso): chakra (viewer-left), shankha (viewer-right) */}
      <Arm4 from={[-92, -240]} to={[-196, -420]} />
      <Arm4 from={[92, -240]} to={[196, -420]} />
      <g transform="translate(-200 -462)">
        <Chakra t={t} />
      </g>
      <g transform="translate(206 -456) rotate(-20)">
        <Shankha />
      </g>
      {/* gada resting on the coil (viewer-right) */}
      <g transform="translate(176 -40) rotate(6)">
        <Gada />
      </g>
      {/* seated lap: pitambara (yellow silk) */}
      <path d="M-190 40C-170 -14 -96 -36 0 -36C96 -36 170 -14 190 40C150 84 -150 84 -190 40Z" fill="#F2B51C" />
      <path d="M-190 40C-150 84 150 84 190 40" stroke={P.crimson} strokeWidth={10} fill="none" />
      <path d="M-120 -10C-70 10 -20 14 20 6M30 6C70 -4 110 -10 150 0" stroke="#C98A0E" strokeWidth={3} fill="none" opacity={0.7} />
      {/* torso */}
      <path d="M-74 -30C-86 -120 -96 -196 -104 -250C-64 -284 64 -284 104 -250C96 -196 86 -120 74 -30Z" fill={VB.skin} />
      <path d="M-74 -30C-86 -120 -96 -196 -104 -250C-90 -262 -76 -268 -62 -272C-70 -200 -70 -110 -50 -30Z" fill={VB.skinShade} opacity={0.6} />
      <path d="M96 -250C88 -190 80 -110 70 -30" stroke={VB.rim} strokeWidth={4} opacity={0.5} fill="none" />
      {/* vanamala (forest garland) + yajnopavita + Kaustubha */}
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
      {/* lower arms: abhaya hand with lotus (viewer-left), hand on gada (viewer-right) */}
      <Arm4 from={[-96, -236]} to={[-150, -100]} w={32} />
      <Arm4 from={[96, -236]} to={[168, -86]} w={32} />
      <g transform="translate(-152 -112)">
        <Lotus s={0.8} />
      </g>
      {/* neck + head */}
      <path d="M-24 -300L24 -300L28 -262L-28 -262Z" fill={VB.skin} />
      <path d="M-64 -350C-66 -410 -38 -440 0 -440C38 -440 66 -410 64 -350C62 -300 34 -282 0 -282C-34 -282 -62 -300 -64 -350Z" fill={VB.skin} />
      <path d="M-64 -350C-66 -410 -38 -440 0 -440C-28 -420 -40 -380 -36 -330C-34 -306 -24 -292 -10 -284C-40 -288 -62 -308 -64 -350Z" fill={VB.skinShade} opacity={0.5} />
      {/* hair curls at the shoulders */}
      <path d="M-62 -380C-86 -340 -96 -290 -80 -250C-66 -270 -60 -310 -58 -340ZM62 -380C86 -340 96 -290 80 -250C66 -270 60 -310 58 -340Z" fill="#0E1022" />
      {/* serene half-closed eyes, brows, nose, smile */}
      {[-24, 24].map((x) => (
        <g key={x}>
          <path d={`M${x - 15} -362C${x - 6} -370 ${x + 6} -370 ${x + 15} -362C${x + 6} -357 ${x - 6} -357 ${x - 15} -362Z`} fill="#F4F7FF" />
          <path d={`M${x - 15} -362C${x - 6} -368 ${x + 6} -368 ${x + 15} -362`} stroke="#0B1030" strokeWidth={4} fill="none" strokeLinecap="round" />
          <circle cx={x} cy={-360} r={4} fill="#0B1030" />
          <path d={`M${x - 16} -380C${x - 6} -387 ${x + 6} -387 ${x + 16} -380`} stroke="#0B1030" strokeWidth={4} fill="none" strokeLinecap="round" />
        </g>
      ))}
      <path d="M0 -356L-6 -330C-2 -326 4 -326 8 -330" stroke={VB.skinLine} strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d={`M-16 -310Q0 ${-300 + speak * 6} 16 -310`} stroke="#8E1B3A" strokeWidth={4} fill="none" strokeLinecap="round" />
      {/* urdhva pundra tilak */}
      <path d="M-10 -376C-12 -396 -10 -410 -8 -420M10 -376C12 -396 10 -410 8 -420" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" />
      <path d="M0 -382L0 -416" stroke="#E3264A" strokeWidth={4} strokeLinecap="round" />
      {/* makara kundala */}
      {[-66, 66].map((x) => (
        <g key={x} transform={`translate(${x} -330)`}>
          <path d="M-10 -10C-16 4 -10 18 0 22C10 18 16 4 10 -10Z" fill="url(#mGold)" />
          <circle cy={4} r={4} fill="#E3264A" />
        </g>
      ))}
      {/* kirita mukuta */}
      <path d="M-56 -436L56 -436L44 -560L0 -604L-44 -560Z" fill="url(#mGold)" />
      <path d="M-50 -470L50 -470M-46 -520L46 -520" stroke={P.goldDeep} strokeWidth={3} />
      <path d="M-62 -426Q0 -416 62 -426L62 -444Q0 -434 -62 -444Z" fill="url(#mGold)" />
      {[-36, 0, 36].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={-494} r={i === 1 ? 11 : 7} fill={P.goldDeep} />
          <circle cx={x} cy={-494} r={i === 1 ? 9 : 5.5} fill={i === 1 ? "#E3264A" : "#2E7BFF"} />
        </g>
      ))}
      {/* light that condenses into form during the reveal */}
      <ellipse cx={0} cy={-230} rx={260} ry={420} fill="#FFFBEA" opacity={Math.max(0, 1 - reveal) * 0.9} filter="url(#mBlur8)" />
    </g>
  );
};
