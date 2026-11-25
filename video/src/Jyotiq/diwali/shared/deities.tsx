import React from "react";
import { P } from "../../manthan/style";

/* Diwali series deities. Copied from Manthan Ep6's DhanvantariStanding (itself Episode 1-2's Vishnu frame) and
   parameterised, so Yamraj, Krishna and Ram share the series' exact face, proportions and finish while each reads
   as his own figure (skin, dhoti, crown, tilak, arms and props). The Manthan files are untouched.
   Origin = between the feet on the ground. The upper body uses Episode 1's coordinates shifted up by 360.
   handL/handR are the lower hands' targets in those upper-body coordinates (viewer-left / viewer-right).
   smile 0..1, speak 0..1 (mouth), closed 0..1 (eyes), halo 0..1. Needs RigDefs (mGold, mBlur8) in the svg. */

type T2 = [number, number];

export type DeityLook = {
  skin: string;
  skinShade: string;
  skinLine: string;
  rim: string;
  hair: string;
  dhoti: [string, string, string]; // cloth, shade, fold lines
  hem: string;
  sash: [string, string]; // uttariya from the left shoulder: colour, highlight
  garland: "vana" | "flowers" | "none";
  crown: "short" | "tall" | "peacock";
  tilak: "urdhva" | "red" | "none";
  arms: 2 | 4;
};

export const YAMRAJ: DeityLook = {
  skin: "#3F5A5E", skinShade: "#2C4044", skinLine: "#142224", rim: "#A8D8CE", hair: "#0B1416",
  dhoti: ["#A3202A", "#7A141C", "#C84A50"], hem: "#F2C25A", sash: ["#C8892A", "#F2C25A"],
  garland: "flowers", crown: "tall", tilak: "red", arms: 2,
};
export const KRISHNA: DeityLook = {
  skin: "#3E6FD8", skinShade: "#2A4EA6", skinLine: "#1A2F6A", rim: "#BFE0FF", hair: "#0E1022",
  dhoti: ["#F2C230", "#C8961E", "#E8A92A"], hem: "#E3264A", sash: ["#E8892A", "#F6B05A"],
  garland: "vana", crown: "peacock", tilak: "urdhva", arms: 2,
};
export const RAM: DeityLook = {
  skin: "#3B7F8C", skinShade: "#2A5E68", skinLine: "#163840", rim: "#BFEFF0", hair: "#0E1022",
  dhoti: ["#F2C230", "#C8961E", "#E8A92A"], hem: "#B3262E", sash: ["#B3262E", "#E8505A"],
  garland: "vana", crown: "tall", tilak: "urdhva", arms: 2,
};

const Arm: React.FC<{ L: DeityLook; from: T2; to: T2; w?: number; pinky?: boolean }> = ({ L, from, to, w = 34, pinky }) => {
  const mid: T2 = [(from[0] + to[0]) / 2 + (to[1] - from[1]) * 0.08, (from[1] + to[1]) / 2];
  return (
    <g>
      <path d={`M${from[0]} ${from[1]}Q${mid[0]} ${mid[1]} ${to[0]} ${to[1]}`} stroke={L.skin} strokeWidth={w} strokeLinecap="round" fill="none" />
      <path d={`M${from[0]} ${from[1]}Q${mid[0]} ${mid[1]} ${to[0]} ${to[1]}`} stroke={L.rim} strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.45} transform="translate(-8 -4)" />
      <circle cx={mid[0]} cy={mid[1] - 10} r={w * 0.42} fill="url(#mGold)" opacity={0.95} />
      <path d={`M${to[0] - w * 0.5} ${to[1] + 4}L${to[0] + w * 0.5} ${to[1] + 4}`} stroke="url(#mGold)" strokeWidth={8} />
      <ellipse cx={to[0]} cy={to[1] - w * 0.45} rx={w * 0.5} ry={w * 0.62} fill={L.skin} />
      {pinky ? (
        // the little finger raised straight up (Govardhan)
        <g>
          <rect x={to[0] - 5} y={to[1] - w * 1.05 - 46} width={10} height={50} rx={5} fill={L.skin} stroke={L.skinLine} strokeWidth={2} />
          <ellipse cx={to[0]} cy={to[1] - w * 1.05 - 42} rx={4} ry={3} fill={L.rim} opacity={0.7} />
        </g>
      ) : null}
    </g>
  );
};

/** Yamraj's danda: a tall staff with a fluted gada head. Origin at the grip. */
export const Danda: React.FC = () => (
  <g>
    <rect x={-6} y={-330} width={12} height={560} rx={6} fill="#5A3A1E" stroke="#2A1A0C" strokeWidth={2} />
    <path d="M-2 -320L-2 220" stroke="#C8892A" strokeWidth={2} opacity={0.6} />
    <rect x={-14} y={-344} width={28} height={14} rx={3} fill="url(#mGold)" />
    <ellipse cx={0} cy={-384} rx={34} ry={42} fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={3} />
    {[-16, 0, 16].map((dx) => (
      <path key={dx} d={`M${dx} -424C${dx * 1.3} -400 ${dx * 1.3} -366 ${dx} -344`} stroke={P.goldDeep} strokeWidth={2} fill="none" opacity={0.7} />
    ))}
    <path d="M-8 -424L0 -456L8 -424Z" fill="url(#mGold)" />
  </g>
);

/** Krishna's flute (bansuri), held horizontally; origin at its middle. */
export const Bansuri: React.FC = () => (
  <g>
    <rect x={-150} y={-7} width={300} height={14} rx={7} fill="#8A5A2A" stroke="#4A2A10" strokeWidth={2} />
    {[-110, -80, -50, -20, 10, 40].map((x) => (
      <circle key={x} cx={x} cy={0} r={3} fill="#2A1608" />
    ))}
    <rect x={-150} y={-7} width={14} height={14} fill="url(#mGold)" />
    <rect x={136} y={-7} width={14} height={14} fill="url(#mGold)" />
    <path d="M60 7C70 30 78 52 72 70" stroke="#E3264A" strokeWidth={4} fill="none" />
  </g>
);

const PeacockFeather: React.FC<{ t: number }> = ({ t }) => (
  <g transform={`rotate(${10 + Math.sin(t / 30) * 3})`}>
    <path d="M0 0C4 -40 6 -80 4 -120" stroke="#2E7A4A" strokeWidth={4} fill="none" />
    <ellipse cx={4} cy={-128} rx={22} ry={34} fill="#1E8A6A" />
    <ellipse cx={4} cy={-126} rx={14} ry={22} fill="#2A5ED8" />
    <ellipse cx={4} cy={-124} rx={7} ry={11} fill="#F2C25A" />
    <ellipse cx={4} cy={-122} rx={3.5} ry={5} fill="#0E1022" />
  </g>
);

export const DeityStanding: React.FC<{
  L: DeityLook;
  t: number;
  smile?: number;
  speak?: number;
  closed?: number;
  halo?: number;
  handL?: T2;
  handR?: T2;
  pinkyL?: boolean;
  /** drawn at the upper-body hand targets (after the arms, before the head) */
  inHandL?: React.ReactNode;
  inHandR?: React.ReactNode;
  /** four-armed forms only: items in the upper hands */
  upperL?: React.ReactNode;
  upperR?: React.ReactNode;
}> = ({ L, t, smile = 0.3, speak = 0, closed = 0, halo = 0.6, handL = [-140, -96], handR = [140, -96], pinkyL, inHandL, inHandR, upperL, upperR }) => {
  const hl = (0.55 + 0.25 * Math.sin(t / 20)) * halo;
  const shut = closed > 0.5;
  const [cl, cs, cf] = L.dhoti;
  return (
    <g>
      {/* legs and dhoti */}
      <ellipse cx={-34} cy={-8} rx={30} ry={11} fill={L.skinShade} />
      <ellipse cx={34} cy={-8} rx={30} ry={11} fill={L.skin} />
      <rect x={-46} y={-40} width={24} height={30} fill={L.skinShade} />
      <rect x={22} y={-40} width={24} height={30} fill={L.skin} />
      <path d="M-50 -26Q-34 -20 -18 -26M18 -26Q34 -20 50 -26" stroke="url(#mGold)" strokeWidth={6} fill="none" />
      <path d="M-92 -392C-100 -260 -96 -130 -88 -36L88 -36C96 -130 100 -260 92 -392Z" fill={cl} />
      <path d="M-92 -392C-100 -260 -96 -130 -88 -36L-40 -36C-52 -140 -58 -270 -56 -392Z" fill={cs} opacity={0.6} />
      <path d="M-10 -380C-14 -260 -12 -140 -8 -40M22 -380C26 -260 28 -140 32 -40" stroke={cf} strokeWidth={3} fill="none" opacity={0.6} />
      <path d="M-88 -36L88 -36L86 -52L-86 -52Z" fill={L.hem} />
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
        {L.arms === 4 ? (
          <g>
            <Arm L={L} from={[-92, -240]} to={[-196, -420]} />
            <Arm L={L} from={[92, -240]} to={[196, -420]} />
            {upperL ? <g transform="translate(-200 -462)">{upperL}</g> : null}
            {upperR ? <g transform="translate(206 -456)">{upperR}</g> : null}
          </g>
        ) : null}
        {/* torso */}
        <path d="M-74 -30C-86 -120 -96 -196 -104 -250C-64 -284 64 -284 104 -250C96 -196 86 -120 74 -30Z" fill={L.skin} />
        <path d="M-74 -30C-86 -120 -96 -196 -104 -250C-90 -262 -76 -268 -62 -272C-70 -200 -70 -110 -50 -30Z" fill={L.skinShade} opacity={0.6} />
        <path d="M96 -250C88 -190 80 -110 70 -30" stroke={L.rim} strokeWidth={4} opacity={0.5} fill="none" />
        {/* garland */}
        {L.garland !== "none" ? (
          <g>
            <path d="M-84 -262C-110 -120 -60 20 0 40C60 20 110 -120 84 -262" stroke={L.garland === "vana" ? "#3F8C41" : "#B3262E"} strokeWidth={9} fill="none" />
            {new Array(15).fill(0).map((_, i) => {
              const u = i / 14;
              const x = Math.sin(Math.PI * u - Math.PI / 2) * 96 * (1 - 0.15 * Math.sin(Math.PI * u));
              const y = -262 + 300 * Math.sin(Math.PI * u) * 0.98;
              const c = L.garland === "vana" ? (i % 2 ? "#FFFFFF" : "#F7C1D6") : i % 2 ? "#F2C25A" : "#E8505A";
              return <circle key={i} cx={x} cy={y} r={7} fill={c} />;
            })}
          </g>
        ) : null}
        <path d="M-80 -256C-40 -170 10 -90 66 -34" stroke="#F6EEDB" strokeWidth={3.5} fill="none" />
        <path d="M-70 -258C-40 -214 40 -214 70 -258" stroke="url(#mGold)" strokeWidth={8} fill="none" />
        <path d="M-88 -258C-40 -180 20 -100 74 -40" stroke={L.sash[0]} strokeWidth={16} fill="none" strokeLinecap="round" />
        <path d="M-82 -252C-36 -178 22 -102 72 -48" stroke={L.sash[1]} strokeWidth={4} fill="none" opacity={0.7} />
        {/* lower arms */}
        <Arm L={L} from={[-96, -236]} to={handL} w={32} pinky={pinkyL} />
        <Arm L={L} from={[96, -236]} to={handR} w={32} />
        {inHandL ? <g transform={`translate(${handL[0]} ${handL[1] - 14})`}>{inHandL}</g> : null}
        {inHandR ? <g transform={`translate(${handR[0]} ${handR[1] - 14})`}>{inHandR}</g> : null}
        {/* neck + head */}
        <path d="M-24 -300L24 -300L28 -262L-28 -262Z" fill={L.skin} />
        <path d="M-64 -350C-66 -410 -38 -440 0 -440C38 -440 66 -410 64 -350C62 -300 34 -282 0 -282C-34 -282 -62 -300 -64 -350Z" fill={L.skin} />
        <path d="M-64 -350C-66 -410 -38 -440 0 -440C-28 -420 -40 -380 -36 -330C-34 -306 -24 -292 -10 -284C-40 -288 -62 -308 -64 -350Z" fill={L.skinShade} opacity={0.5} />
        <path d="M-62 -380C-86 -340 -96 -290 -80 -250C-66 -270 -60 -310 -58 -340ZM62 -380C86 -340 96 -290 80 -250C66 -270 60 -310 58 -340Z" fill={L.hair} />
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
        <path d="M0 -356L-6 -330C-2 -326 4 -326 8 -330" stroke={L.skinLine} strokeWidth={3} fill="none" strokeLinecap="round" />
        {/* mouth: the smile curve opens into a soft oval as he speaks */}
        <path d={`M-17 -311Q0 ${-303 + smile * 9 + speak * 5} 17 -311`} stroke="#8E1B3A" strokeWidth={4} fill="none" strokeLinecap="round" />
        {speak > 0.08 ? <ellipse cx={0} cy={-306 + speak * 3} rx={9 + 3 * speak} ry={2 + 7 * speak} fill="#5A0E22" opacity={0.9} /> : null}
        {L.tilak === "urdhva" ? (
          <g>
            <path d="M-10 -376C-12 -396 -10 -410 -8 -420M10 -376C12 -396 10 -410 8 -420" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" />
            <path d="M0 -382L0 -416" stroke="#E3264A" strokeWidth={4} strokeLinecap="round" />
          </g>
        ) : L.tilak === "red" ? (
          <path d="M0 -384L0 -414" stroke="#E3264A" strokeWidth={6} strokeLinecap="round" />
        ) : null}
        {[-66, 66].map((x) => (
          <g key={x} transform={`translate(${x} -330)`}>
            <path d="M-10 -10C-16 4 -10 18 0 22C10 18 16 4 10 -10Z" fill="url(#mGold)" />
            <circle cy={4} r={4} fill="#E3264A" />
          </g>
        ))}
        {/* crown */}
        {L.crown === "tall" ? (
          <g>
            <path d="M-54 -436L54 -436L50 -540L22 -570L0 -610L-22 -570L-50 -540Z" fill="url(#mGold)" />
            <path d="M-52 -470L52 -470M-51 -506L51 -506M-40 -544L40 -544" stroke={P.goldDeep} strokeWidth={3} />
          </g>
        ) : (
          <g>
            <path d="M-54 -436L54 -436L46 -500L0 -530L-46 -500Z" fill="url(#mGold)" />
            <path d="M-50 -462L50 -462M-47 -488L47 -488" stroke={P.goldDeep} strokeWidth={3} />
          </g>
        )}
        <path d="M-62 -426Q0 -416 62 -426L62 -444Q0 -434 -62 -444Z" fill="url(#mGold)" />
        {[-34, 0, 34].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy={-476} r={i === 1 ? 9 : 6} fill={P.goldDeep} />
            <circle cx={x} cy={-476} r={i === 1 ? 7 : 4.5} fill={i === 1 ? "#E3264A" : "#1E9A6A"} />
          </g>
        ))}
        {L.crown === "peacock" ? (
          <g transform="translate(28 -510)">
            <PeacockFeather t={t} />
          </g>
        ) : null}
      </g>
    </g>
  );
};
