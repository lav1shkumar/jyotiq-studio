import React from "react";
import { blinkAt } from "../rig";
import { P } from "../style";

/*
 * Episode 5's treasures that walk: Kamadhenu, the wish-giving cow, and Uchchaihshravas, the white
 * horse of the ocean. Side-on, facing +x like the rig puppets, drawn in the series' flat cut-out
 * style (cel-shade crescent, warm rim, gold ornaments) under the outline filter (mCut).
 * Origin = the ground under the middle of the body; ~300 units tall at s = 1.
 */
type T2 = [number, number];
const KD = { body: "#F8F4EC", shade: "#D9D1C2", line: "#8C8270", rim: "#FFFFFF", muzzle: "#E9B9AE", tuft: "#E8E0D2" };
const UH = { body: "#F7F8FC", shade: "#C9CFE0", line: "#6E7590", mane: "#EEF2FF", maneShade: "#AEB8D6" };

const lerp = (a: T2, b: T2, u: number): T2 => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];

/** A two-segment leg hanging from (x, y): upper and lower parts on pins, gold hoof. */
const Leg: React.FC<{ x: number; y: number; a1: number; a2: number; fill: string; line: string; u?: number; l?: number; w?: number; band?: boolean }> = ({
  x, y, a1, a2, fill, line, u = 88, l = 74, w = 1, band = true,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${a1})`}>
    <path d={`M${-15 * w} 0C${-17 * w} ${u * 0.35} ${-12 * w} ${u * 0.7} ${-9 * w} ${u}L${9 * w} ${u}C${12 * w} ${u * 0.7} ${15 * w} ${u * 0.35} ${14 * w} 0Z`} fill={fill} stroke={line} strokeWidth={1.2} />
    <g transform={`translate(0 ${u}) rotate(${a2})`}>
      <circle r={9.5 * w} fill={fill} />
      <path d={`M${-8 * w} 0C${-9 * w} ${l * 0.4} ${-8 * w} ${l * 0.75} ${-7 * w} ${l}L${7 * w} ${l}C${8 * w} ${l * 0.75} ${9 * w} ${l * 0.4} ${8 * w} 0Z`} fill={fill} stroke={line} strokeWidth={1.2} />
      {band ? <path d={`M${-8 * w} ${l - 16}L${8 * w} ${l - 16}`} stroke="url(#mGold)" strokeWidth={5} /> : null}
      <path d={`M${-9 * w} ${l}L${9 * w} ${l}L${11 * w} ${l + 14}L${-11 * w} ${l + 14}Z`} fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={1} />
    </g>
  </g>
);

/** A soft gold-white aura behind a divine being. */
const Aura: React.FC<{ cx: number; cy: number; rx: number; ry: number; o: number }> = ({ cx, cy, rx, ry, o }) =>
  o > 0.01 ? <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#FFF3D2" opacity={0.45 * o} filter="url(#mBlur8)" /> : null;

/* ------------------------------------------------------------------ Kamadhenu */
export const Kamadhenu: React.FC<{ id: string; f: number; x: number; y: number; s?: number; facing?: number; glow?: number; walk?: number; nod?: number }> = ({
  id, f, x, y, s = 1, facing = 1, glow = 1, walk = 0, nod = 0,
}) => {
  const ph = f / 7;
  const sw = (k: number) => walk * 16 * Math.sin(ph + k);
  const tail = Math.sin(f / 14) * 9;
  const blink = blinkAt(`${id}-k`, f);
  const head = Math.sin(f / 24) * 2 + nod * 10;
  return (
    <g transform={`translate(${x} ${y}) scale(${facing * s} ${s})`}>
      <Aura cx={40} cy={-200} rx={330} ry={210} o={glow} />
      <g filter="url(#mCut)">
        {/* far legs (in shade) */}
        <Leg u={72} l={62} w={1.3} x={-104} y={-150} a1={-sw(Math.PI)} a2={Math.max(0, sw(Math.PI)) * 0.8} fill={KD.shade} line={KD.line} />
        <Leg u={72} l={62} w={1.3} x={88} y={-152} a1={sw(0)} a2={Math.max(0, -sw(0)) * 0.8} fill={KD.shade} line={KD.line} />
        {/* tail */}
        <g transform={`translate(-166 -244) rotate(${tail})`}>
          <path d="M0 0C-22 24 -28 74 -24 134" stroke={KD.body} strokeWidth={8} fill="none" strokeLinecap="round" />
          <ellipse cx={-24} cy={146} rx={10} ry={20} fill={KD.tuft} />
        </g>
        {/* body with the zebu hump */}
        <path d="M-170 -230C-176 -270 -140 -292 -90 -290L60 -286C80 -300 108 -306 128 -290C146 -276 150 -250 148 -226C146 -180 128 -146 100 -138L-130 -136C-160 -144 -172 -180 -170 -230Z" fill={KD.body} />
        <path d="M-168 -200C-150 -150 -120 -140 -90 -138L100 -138C124 -144 140 -170 146 -200C120 -180 60 -170 -20 -172C-90 -174 -140 -184 -168 -200Z" fill={KD.shade} opacity={0.65} />
        <path d="M-150 -276C-110 -290 20 -288 70 -290" stroke={KD.rim} strokeWidth={5} fill="none" opacity={0.8} />
        {/* the festival jhool on her back: crimson, gold border, tassels */}
        <path d="M-112 -292L58 -288C64 -250 60 -212 52 -188L-104 -190C-114 -222 -118 -256 -112 -292Z" fill={P.crimson} />
        <path d="M-104 -190L52 -188" stroke="url(#mGold)" strokeWidth={7} />
        <path d="M-112 -292L-104 -190M58 -288L52 -188" stroke="url(#mGold)" strokeWidth={5} />
        {[-80, -40, 0, 30].map((xx, i) => (
          <circle key={xx} cx={xx} cy={-250 + (i % 2) * 22} r={5} fill={P.goldLight} opacity={0.85} />
        ))}
        {[-96, -66, -36, -6, 24].map((xx) => (
          <g key={xx} transform={`translate(${xx} -186)`}>
            <path d="M0 0L0 10" stroke={P.goldDark} strokeWidth={2} />
            <circle cy={14} r={4} fill="#E3264A" />
          </g>
        ))}
        {/* near legs with gold anklets */}
        <Leg u={72} l={62} w={1.3} x={-122} y={-146} a1={sw(0)} a2={Math.max(0, -sw(0)) * 0.8} fill={KD.body} line={KD.line} />
        <Leg u={72} l={62} w={1.3} x={110} y={-146} a1={sw(Math.PI)} a2={Math.max(0, sw(Math.PI)) * 0.8} fill={KD.body} line={KD.line} />
        {/* neck, dewlap, head */}
        <g transform={`rotate(${head} 130 -270)`}>
          <path d="M120 -286C150 -284 176 -280 196 -268L210 -232C190 -216 168 -200 148 -196C150 -230 140 -262 120 -286Z" fill={KD.body} />
          <path d="M150 -200C160 -186 162 -160 150 -134C140 -150 132 -170 132 -196Z" fill={KD.shade} />
          {/* horns (gold), the far one darker */}
          <path d="M184 -300C176 -320 172 -340 178 -358C182 -340 186 -322 194 -304Z" fill="url(#mGoldDark)" />
          <path d="M196 -304C194 -326 200 -346 214 -360C208 -340 206 -322 208 -306Z" fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={1} />
          <path d="M188 -300C204 -310 226 -306 238 -292C252 -276 266 -250 268 -232C270 -220 262 -212 250 -212C236 -212 220 -216 210 -222C196 -232 184 -252 180 -270C178 -284 180 -294 188 -300Z" fill={KD.body} />
          <path d="M188 -300C184 -280 190 -246 210 -222C196 -232 184 -252 180 -270C178 -284 180 -294 188 -300Z" fill={KD.shade} opacity={0.6} />
          <path d="M250 -248C262 -246 270 -236 268 -226C266 -216 256 -212 246 -214C240 -226 242 -240 250 -248Z" fill={KD.muzzle} />
          <ellipse cx={261} cy={-232} rx={3} ry={2} fill="#7A4A40" />
          {/* ear */}
          <path d="M190 -292C172 -300 154 -298 146 -290C156 -282 172 -280 188 -284Z" fill={KD.body} stroke={KD.line} strokeWidth={1} />
          <path d="M184 -290C172 -294 162 -292 156 -289C164 -285 174 -284 184 -286Z" fill="#F0C4BA" />
          {/* gentle eye with lashes */}
          <g transform={`translate(222 -268) scale(1 ${Math.max(0.1, 1 - blink)})`}>
            <ellipse rx={7.5} ry={5.5} fill="#2A1A14" />
            <circle cx={2.4} cy={-1.6} r={1.8} fill="#FFFFFF" />
          </g>
          <path d="M213 -273C218 -278 226 -278 231 -273M229 -275L233 -279M224 -277L226 -282" stroke="#2A1A14" strokeWidth={1.8} fill="none" strokeLinecap="round" />
          {/* tilak */}
          <path d="M228 -298L232 -282" stroke="#C8102E" strokeWidth={4} strokeLinecap="round" />
          <circle cx={227} cy={-302} r={2.4} fill={P.gold} />
          {/* a garland of flowers and a gold bell at the neck */}
          {new Array(8).fill(0).map((_, i) => {
            const p = lerp([142, -282], [176, -204], i / 7);
            return <circle key={i} cx={p[0] + Math.sin(i) * 3} cy={p[1]} r={7} fill={i % 2 ? "#FFC23A" : "#E8304A"} stroke="#8A3A10" strokeWidth={0.8} />;
          })}
          <g transform="translate(168 -196)">
            <path d="M0 0L0 8" stroke={P.goldDark} strokeWidth={2} />
            <path d="M-8 22C-8 12 -5 8 0 8C5 8 8 12 8 22Z" fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={1} />
          </g>
        </g>
      </g>
    </g>
  );
};

/* ------------------------------------------------------------------ Uchchaihshravas */
/**
 * The white horse. rear 0 = standing, 1 = rearing (front legs folded high, body pitched up about the
 * hind feet); gallop adds a leg cycle; wind 0..1 streams the mane and tail.
 */
export const Uchchaihshravas: React.FC<{ id: string; f: number; x: number; y: number; s?: number; facing?: number; glow?: number; rear?: number; gallop?: number; wind?: number }> = ({
  id, f, x, y, s = 1, facing = 1, glow = 1, rear = 0, gallop = 0, wind = 0.6,
}) => {
  const r = Math.max(0, Math.min(1, rear));
  const ph = f / 4.5;
  const g = (k: number) => gallop * 24 * Math.sin(ph + k);
  const blink = blinkAt(`${id}-h`, f);
  const wv = (i: number) => Math.sin(f / 6 + i * 0.9) * (6 + 10 * wind);
  const crest0: T2 = [178, -384];
  const crest1: T2 = [100, -268];
  return (
    <g transform={`translate(${x} ${y}) scale(${facing * s} ${s})`}>
      <Aura cx={30} cy={-240} rx={320} ry={240} o={glow} />
      <g transform={`rotate(${-30 * r} -100 -10)`} filter="url(#mCut)">
        {/* far legs */}
        <Leg u={82} l={72} w={1.3} x={-88} y={-170} a1={18 * r + g(Math.PI)} a2={8 * r + Math.max(0, -g(Math.PI))} fill={UH.shade} line={UH.line} band={false} />
        <Leg u={82} l={72} w={1.3} x={86} y={-166} a1={-100 * r + g(0.6)} a2={135 * r + Math.max(0, g(0.6))} fill={UH.shade} line={UH.line} band={false} />
        {/* the flowing tail */}
        <g transform="translate(-150 -232)">
          <path d={`M0 0C-40 ${-8 + wv(1)} -80 ${12 + wv(2)} -96 ${52 + wv(3)}C-100 ${82 + wv(4)} -86 ${112 + wv(5)} -70 ${132 + wv(5)}C-66 ${92 + wv(3)} -50 ${50 + wv(2)} 0 22Z`} fill={UH.mane} stroke={UH.maneShade} strokeWidth={2} />
          <path d={`M-10 8C-44 ${10 + wv(2)} -70 ${40 + wv(3)} -78 ${90 + wv(4)}`} stroke={UH.maneShade} strokeWidth={3} fill="none" opacity={0.7} />
        </g>
        {/* body */}
        <path d="M-150 -220C-156 -258 -120 -272 -60 -270L90 -262C126 -260 146 -236 140 -204C134 -172 110 -152 76 -150L-110 -152C-140 -158 -150 -186 -150 -220Z" fill={UH.body} />
        <path d="M-148 -196C-130 -160 -104 -154 -80 -152L80 -150C108 -154 126 -170 136 -192C100 -178 40 -172 -30 -174C-90 -176 -126 -182 -148 -196Z" fill={UH.shade} opacity={0.7} />
        <path d="M-130 -262C-80 -272 20 -268 80 -262" stroke="#FFFFFF" strokeWidth={5} fill="none" opacity={0.9} />
        {/* crimson saddle cloth with gold border */}
        <path d="M-80 -270L30 -266C36 -236 32 -206 26 -184L-76 -186C-84 -214 -86 -244 -80 -270Z" fill={P.crimson} />
        <path d="M-76 -186L26 -184M-80 -270L-76 -186M30 -266L26 -184" stroke="url(#mGold)" strokeWidth={5} />
        <circle cx={-26} cy={-226} r={8} fill="url(#mGold)" />
        <circle cx={-26} cy={-226} r={4} fill="#E3264A" />
        {/* near legs */}
        <Leg u={82} l={72} w={1.3} x={-112} y={-170} a1={18 * r + g(0)} a2={8 * r + Math.max(0, -g(0))} fill={UH.body} line={UH.line} band={false} />
        <Leg u={82} l={72} w={1.3} x={108} y={-166} a1={-90 * r + g(Math.PI + 0.6)} a2={125 * r + Math.max(0, g(Math.PI + 0.6))} fill={UH.body} line={UH.line} band={false} />
        {/* neck and the jewelled collar */}
        <path d="M84 -262C110 -300 140 -340 172 -372L210 -350C186 -320 160 -270 140 -212C126 -236 108 -252 84 -262Z" fill={UH.body} />
        <path d="M140 -212C150 -262 170 -304 196 -340L210 -350C186 -320 160 -270 140 -212Z" fill={UH.shade} opacity={0.6} />
        <path d="M96 -252C118 -246 136 -232 146 -218" stroke="url(#mGold)" strokeWidth={9} fill="none" />
        {[0.2, 0.5, 0.8].map((u) => {
          const p = lerp([98, -251], [144, -220], u);
          return <circle key={u} cx={p[0]} cy={p[1]} r={4} fill="#E3264A" />;
        })}
        {/* head */}
        <path d="M170 -378C186 -392 206 -392 220 -380L268 -322C276 -310 270 -296 256 -294C240 -292 226 -298 214 -308L176 -342C164 -352 162 -368 170 -378Z" fill={UH.body} />
        <path d="M176 -342L214 -308C226 -298 240 -292 256 -294C236 -306 210 -330 190 -360Z" fill={UH.shade} opacity={0.5} />
        <path d="M178 -384L170 -416L192 -392Z" fill={UH.body} stroke={UH.line} strokeWidth={1.2} />
        <path d="M188 -388L186 -418L202 -392Z" fill={UH.shade} stroke={UH.line} strokeWidth={1.2} />
        <ellipse cx={253} cy={-306} rx={4} ry={3} fill="#4A4E66" />
        <path d="M262 -298C254 -296 246 -297 240 -300" stroke={UH.line} strokeWidth={1.6} fill="none" />
        <g transform={`translate(204 -364) rotate(40) scale(1 ${Math.max(0.1, 1 - blink)})`}>
          <ellipse rx={7} ry={5} fill="#1C1E2E" />
          <circle cx={2} cy={-1.5} r={1.7} fill="#FFFFFF" />
        </g>
        {/* gold bridle and the plume with a ruby */}
        <path d="M196 -382L246 -320M220 -312L262 -326M182 -360L232 -330" stroke="url(#mGold)" strokeWidth={4} fill="none" />
        <circle cx={232} cy={-330} r={4} fill="#E3264A" />
        <g transform="translate(184 -396) rotate(-20)">
          <path d="M0 0C-6 -20 -2 -40 10 -52C8 -34 10 -18 6 0Z" fill="#FFF3C9" stroke={P.gold} strokeWidth={1.5} />
          <circle cy={2} r={5} fill="url(#mGold)" />
          <circle cy={2} r={2.4} fill="#E3264A" />
        </g>
        {/* the streaming mane along the crest */}
        {new Array(7).fill(0).map((_, i) => {
          const b = lerp(crest0, crest1, i / 6);
          const w = wv(i);
          return (
            <path
              key={i}
              d={`M${b[0]} ${b[1]}C${b[0] - 22} ${b[1] - 18 + w * 0.5} ${b[0] - 58} ${b[1] - 10 + w} ${b[0] - 86} ${b[1] + 14 + w}C${b[0] - 58} ${b[1] + 6 + w * 0.6} ${b[0] - 30} ${b[1] + 8} ${b[0] - 4} ${b[1] + 16}Z`}
              fill={i % 2 ? UH.mane : "#FFFFFF"}
              stroke={UH.maneShade}
              strokeWidth={1.5}
            />
          );
        })}
        <path d={`M184 -392C172 -396 160 -392 156 ${-380 + wv(9) * 0.3}C168 -384 178 -382 186 -378Z`} fill={UH.mane} stroke={UH.maneShade} strokeWidth={1.2} />
      </g>
    </g>
  );
};
