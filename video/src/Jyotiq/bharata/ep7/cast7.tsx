import React from "react";
import "../ep1/cast";
import "../ep2/cast2";
import "../ep3/cast3";
import { LOOKS, type Who } from "../../manthan/rig";

/*
 * भारत Ep7 cast: एकलव्य का अंगूठा (Adi Parva, Ganguli sec. CXXXIV). New rig LOOKS keys only; earlier files read-only.
 *  bhEkalavya: the Nishada prince, "of dark hue ... dressed in black and bearing matted locks on head" (the forest state,
 *    kept as one design through the episode for continuity). Young — no beard; lean; dark charcoal-black cloth, forest
 *    beads, NO sacred thread (the story is exactly about who was allowed one). His bow is the plain dark Bow6.
 *  bhDrona: the royal preceptor of Hastinapur, a Bharadwaj brahmin warrior-teacher: older, stern, heavy-lidded; white-grey
 *    jata tied back, full pale beard, cream-ivory robe with a saffron sash, rudraksha, the sacred thread he teaches within.
 *  bhArjuna: the young Kuru prince — dusky as the epic describes him, kirita crown, gold, deep-blue silk; no beard yet;
 *    proud, wounded eyes. His bow is the dark Bow6 with gold edging.
 *  Props: ClayGuru (the मिट्टी की मूर्ति of Drona), Dog (the hunting pariah dog, alive and unhurt, mouth propped by the
 *    seven arrows — no blood, per the text it runs back), Target (straw archery butt). Bows/chariots: ep6 kit read-only.
 */
type Look = (typeof LOOKS)[Who];
const L = LOOKS as unknown as Record<string, Look>;

L.bhEkalavya = {
  ...L.deva,
  skin: "#7E4E30",
  skinShade: "#5E3820",
  skinLine: "#3A2010",
  rim: "#E8B080",
  sclera: "#FFF4E4",
  iris: "#160C06",
  glowColor: "#FFB23A",
  lid: 0.06,
  brow: "#140C08",
  browW: 5,
  hair: "jata",
  hairColor: "#181008",
  hairShade: "#0A0604",
  beard: undefined,
  moustache: undefined,
  crown: undefined,
  tilak: undefined,
  thread: false,
  necklaces: 1,
  pearls: false,
  rudraksha: false,
  stole: ["#3A3430", "#221E1A"],
  dhoti: ["#2E2A26", "#1C1815", "#4E4640"],
  armlet: false,
  bracelet: "#5E4A2E",
  anklet: false,
  earring: "none",
  chest: 0.9,
};
L.bhDrona = {
  ...L.durvasa,
  skin: "#C89A72",
  skinShade: "#A4785A",
  skinLine: "#6E4A34",
  rim: "#FFE8C8",
  sclera: "#F8F2E4",
  iris: "#2E1C10",
  glowColor: "#FFB23A",
  lid: 0.34,
  brow: "#DCD4C4",
  browW: 9,
  hair: "jata",
  hairColor: "#D8D2C6",
  hairShade: "#A29A8C",
  beard: "full",
  moustache: "sage",
  beardColor: "#E8E2D6",
  crown: undefined,
  tilak: "tripundra",
  thread: true,
  necklaces: 0,
  rudraksha: true,
  pearls: false,
  robe: { cloth: "#F2E9D6", shade: "#CFC2AA", trim: "#C8882E", sash: "#B8762E", open: false },
  stole: ["#F2E9D6", "#C9BCA2"],
  dhoti: ["#EFE6D2", "#CFC2AA", "#C8882E"],
  armlet: false,
  bracelet: "#8A6A3A",
  anklet: false,
  earring: "rudraksha",
  chest: 1.1,
};
L.bhArjuna = {
  ...L.deva,
  skin: "#9A6238",
  skinShade: "#7A4626",
  skinLine: "#4E2812",
  rim: "#FFCE9E",
  sclera: "#FFF6E8",
  iris: "#1E1008",
  glowColor: "#9FD8FF",
  lid: 0.12,
  brow: "#120C06",
  browW: 6,
  hair: "royal",
  hairColor: "#16100A",
  hairShade: "#080503",
  beard: undefined,
  moustache: undefined,
  crown: "kirita",
  tilak: "urdhva",
  thread: true,
  necklaces: 2,
  pearls: true,
  rudraksha: false,
  stole: ["#1F3E8A", "#F2C14E"],
  dhoti: ["#2A4DA0", "#1A3268", "#F2C14E"],
  armlet: true,
  bracelet: "#E8B24A",
  anklet: true,
  earring: "kundala",
  chest: 1.0,
};
export const EKALAVYA = "bhEkalavya" as Who;
export const DRONA = "bhDrona" as Who;
export const ARJUNA = "bhArjuna" as Who;

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */

/**
 * The clay image of Drona that Ekalavya makes and worships (sec. CXXXIV): a crude hand-shaped terracotta figure of a
 * teacher — rounded cone torso, stub arms joined in front, a ball head with a white tripundra dab — set on a mud-and-stone
 * platform under the tree, with marigold offerings. Origin = the base centre.
 */
export const ClayGuru: React.FC<{ x: number; y: number; s?: number; glow?: number }> = ({ x, y, s = 1, glow = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {glow > 0.01 ? <ellipse cx={0} cy={-130} rx={130} ry={150} fill="#FFD88A" opacity={0.35 * glow} filter="url(#k6Blur24)" /> : null}
    {/* platform: flat stones on a mud mound */}
    <ellipse cx={0} cy={0} rx={150} ry={26} fill="#6E4A2E" />
    <ellipse cx={0} cy={-8} rx={128} ry={20} fill="#8A6240" />
    <ellipse cx={0} cy={-14} rx={104} ry={14} fill="#A87E56" />
    {/* the figure */}
    <g transform="translate(0 -20)">
      {/* torso: a rounded clay cone */}
      <path d="M-52 0C-56 -60 -46 -120 -30 -152C-18 -172 18 -172 30 -152C46 -120 56 -60 52 0Z" fill="#B4642A" stroke="#7A3E18" strokeWidth={4} />
      <path d="M-52 0C-56 -60 -46 -120 -30 -152C-18 -172 0 -174 0 -174L0 0Z" fill="#96501F" opacity={0.55} />
      {/* crude fold marks */}
      {[-100, -70, -40].map((yy) => <path key={yy} d={`M-34 ${yy}Q0 ${yy + 16} 34 ${yy}`} stroke="#7A3E18" strokeWidth={3} fill="none" opacity={0.5} />)}
      {/* stub arms joined in front (anjali) */}
      <path d="M-40 -96C-24 -80 -10 -74 0 -74C10 -74 24 -80 40 -96" stroke="#8A4A1E" strokeWidth={17} fill="none" strokeLinecap="round" />
      <circle cx={0} cy={-72} r={13} fill="#B4642A" stroke="#7A3E18" strokeWidth={3} />
      {/* head */}
      <circle cx={0} cy={-188} r={40} fill="#B4642A" stroke="#7A3E18" strokeWidth={4} />
      <path d="M-34 -196A40 40 0 0 1 0 -228L0 -148A40 40 0 0 1 -34 -196Z" fill="#96501F" opacity={0.45} />
      {/* white ash tripundra dabbed on the clay forehead */}
      {[-206, -196, -186].map((yy) => <path key={yy} d={`M-18 ${yy}Q0 ${yy + 6} 18 ${yy}`} stroke="#F4EEDF" strokeWidth={4.5} fill="none" strokeLinecap="round" />)}
      {/* eye dabs */}
      <circle cx={-13} cy={-172} r={3.4} fill="#3A1E0C" />
      <circle cx={13} cy={-172} r={3.4} fill="#3A1E0C" />
      {/* marigold offerings at the feet */}
      {[[-56, -2], [-30, 4], [34, 2], [58, -4], [4, 6]].map(([fx, fy], i) => (
        <g key={i} transform={`translate(${fx} ${fy})`}>
          <circle r={9} fill="#F2A93B" />
          <circle r={4.5} fill="#D4741E" />
        </g>
      ))}
    </g>
  </g>
);

/**
 * The hunting party's pariah dog (sec. CXXXIV): tan, pointed ears, curled tail. `mode` "bark" = mouth open mid-bark;
 * "sealed" = the seven arrows prop the open mouth in a fan — the dog is alive and unhurt (in the text it runs back to the
 * princes), eyes wide and affronted, no blood anywhere. Origin = the ground under the front paws; faces +x when facing=1.
 */
export const Dog: React.FC<{ x: number; y: number; s?: number; facing?: number; mode?: "sit" | "bark" | "sealed"; f?: number }> = ({ x, y, s = 1, facing = 1, mode = "sit", f = 60 }) => {
  const tan = "#C89A5E";
  const shade = "#9A7240";
  const lite = "#DDBB8A";
  const dark = "#3A2410";
  const headTilt = mode === "bark" ? -10 : mode === "sealed" ? 4 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${facing * s} ${s})`}>
      {/* curled tail over the rump */}
      <path d="M-146 -108C-188 -118 -204 -154 -188 -178C-176 -194 -152 -188 -154 -168" stroke={tan} strokeWidth={17} fill="none" strokeLinecap="round" />
      <path d="M-146 -108C-188 -118 -204 -154 -188 -178" stroke={shade} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.5} />
      {/* far legs */}
      <path d="M-92 -66L-96 0L-80 0L-74 -64Z" fill={shade} />
      <path d="M-16 -64L-18 0L-2 0L0 -62Z" fill={shade} />
      {/* body */}
      <path d="M-152 -96C-150 -124 -110 -136 -60 -136C-10 -136 22 -126 34 -104C42 -88 38 -70 24 -58C-8 -48 -96 -48 -124 -56C-144 -64 -154 -78 -152 -96Z" fill={tan} stroke={shade} strokeWidth={3} />
      <path d="M-152 -96C-150 -124 -110 -136 -60 -136C-24 -136 4 -130 22 -118C-30 -126 -110 -122 -148 -92Z" fill={shade} opacity={0.55} />
      <path d="M-124 -56C-96 -48 -8 -48 24 -58C20 -52 12 -46 0 -44L-110 -44C-118 -48 -122 -52 -124 -56Z" fill={lite} opacity={0.8} />
      {/* near legs */}
      <path d="M-112 -62L-116 0L-98 0L-92 -62Z" fill={tan} stroke={shade} strokeWidth={2.5} />
      <path d="M2 -62L0 0L18 0L20 -60Z" fill={tan} stroke={shade} strokeWidth={2.5} />
      {/* neck rising to the head */}
      <path d="M18 -116C30 -140 44 -158 60 -170L88 -144C72 -128 58 -108 48 -84L18 -70Z" fill={tan} stroke={shade} strokeWidth={2.5} />
      {/* head */}
      <g transform={`translate(84 -178) rotate(${headTilt})`}>
        <ellipse cx={0} cy={0} rx={40} ry={35} fill={tan} stroke={shade} strokeWidth={3} />
        {/* ears: pointed */}
        <path d="M-20 -26L-32 -68L2 -38Z" fill={tan} stroke={shade} strokeWidth={3} strokeLinejoin="round" />
        <path d="M-16 -32L-24 -56L-2 -40Z" fill="#8A5A30" />
        <path d="M8 -30L18 -64L30 -28Z" fill={shade} stroke={shade} strokeWidth={2} strokeLinejoin="round" />
        {/* muzzle toward +x */}
        {mode === "sealed" ? (
          <g>
            {/* jaws propped open */}
            <path d="M22 -12C44 -16 60 -10 66 -2L64 2C52 0 38 2 28 6Z" fill={tan} stroke={shade} strokeWidth={2.5} />
            <path d="M24 8C40 10 56 8 64 3C62 14 48 22 34 20C26 18 22 13 24 8Z" fill={lite} stroke={shade} strokeWidth={2.5} />
            <ellipse cx={46} cy={4} rx={14} ry={8} fill="#5A2018" />
            {/* seven arrows fanned through the open mouth, feathered ends out */}
            {[-56, -38, -20, -2, 16, 34, 52].map((a, i) => (
              <g key={i} transform={`translate(46 3) rotate(${a})`}>
                <path d="M0 0L64 0" stroke="#6A3A1C" strokeWidth={3.6} />
                <path d="M64 0L78 -7L74 0L78 7Z" fill="#E8E2D2" stroke="#B8AE9A" strokeWidth={0.8} />
              </g>
            ))}
            <circle cx={60} cy={-6} r={6} fill={dark} />
          </g>
        ) : (
          <g>
            <path d="M22 -12C44 -18 60 -12 66 -4C58 2 40 4 28 2Z" fill={tan} stroke={shade} strokeWidth={2.5} />
            {mode === "bark" ? (
              <g>
                <path d="M26 2C42 4 56 2 64 -2C62 12 48 20 34 17C27 13 24 7 26 2Z" fill={lite} stroke={shade} strokeWidth={2.5} />
                <ellipse cx={46} cy={6} rx={12} ry={6.5} fill="#5A2018" />
              </g>
            ) : null}
            <circle cx={62} cy={-7} r={6} fill={dark} />
          </g>
        )}
        {/* eye: wide and affronted in sealed, plain otherwise */}
        <circle cx={6} cy={-8} r={mode === "sealed" ? 8 : 6.5} fill="#FFF8EC" stroke={dark} strokeWidth={2} />
        <circle cx={7.5} cy={-8} r={3.4} fill={dark} />
        {mode !== "sit" ? <path d="M-4 -20L14 -25" stroke={dark} strokeWidth={3.2} strokeLinecap="round" /> : null}
      </g>
      {/* bark marks */}
      {mode === "bark" ? (
        <g stroke="#FFF4D0" strokeWidth={5} strokeLinecap="round" opacity={0.85}>
          {[[168, -215, 188, -232], [172, -190, 196, -196], [166, -165, 186, -156]].map(([x0, y0, x1, y1], i) => (
            <path key={i} d={`M${x0} ${y0}L${x1} ${y1}`} opacity={1 - ((Math.floor(f / 6) + i) % 3) * 0.3} />
          ))}
        </g>
      ) : null}
    </g>
  );
};

/** A straw archery butt on a wooden stand: concentric rings, arrows clustered in the gold. Origin = the ground centre. */
export const Target: React.FC<{ x: number; y: number; s?: number; arrows?: number; spread?: number }> = ({ x, y, s = 1, arrows = 5, spread = 0.3 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-8 -10L-52 90M8 -10L52 90M0 -4L0 92" stroke="#5A3A22" strokeWidth={11} strokeLinecap="round" />
    <circle cy={-110} r={92} fill="#C8A46A" stroke="#8A6A3A" strokeWidth={5} />
    <circle cy={-110} r={92} fill="none" stroke="#6A4A26" strokeWidth={3} strokeDasharray="5 9" opacity={0.6} />
    <circle cy={-110} r={66} fill="#E8D9A8" stroke="#8A6A3A" strokeWidth={3} />
    <circle cy={-110} r={40} fill="#C8552E" stroke="#8A3A1E" strokeWidth={3} />
    <circle cy={-110} r={17} fill="#F2C14E" stroke="#B8862E" strokeWidth={2.5} />
    {Array.from({ length: arrows }, (_, i) => {
      const a = (i - (arrows - 1) / 2) * 9 * (0.6 + spread) + ((i * 37) % 7) - 3;
      const rr = i === 0 ? 4 : 8 + ((i * 29) % 26) * spread;
      const aa = (i * 2.4) % (Math.PI * 2);
      const ax = Math.cos(aa) * rr;
      const ay = -110 + Math.sin(aa) * rr * 0.8;
      return (
        <g key={i} transform={`translate(${ax} ${ay}) rotate(${a})`}>
          <path d="M60 0L0 0" stroke="#6A3A1C" strokeWidth={3.6} />
          <path d="M60 0L74 -8L70 0L74 8Z" fill="#E8E2D2" stroke="#B8AE9A" strokeWidth={0.8} />
          <path d="M0 0L-7 -4L-4 0L-7 4Z" fill="#3A2010" />
        </g>
      );
    })}
  </g>
);

/** Ekalavya's cloth-wrapped right hand on the bow, after: a bandaged fist gripping the dark bow grip. */
export const WrappedHand: React.FC<{ x: number; y: number; s?: number; facing?: number }> = ({ x, y, s = 1, facing = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${facing * s} ${s})`}>
    {/* bow grip behind the hand */}
    <path d="M-4 -160C6 -100 8 -40 -2 30" stroke="#4A2810" strokeWidth={13} fill="none" strokeLinecap="round" />
    <path d="M-4 -160C6 -100 8 -40 -2 30" stroke="#2A1608" strokeWidth={4} fill="none" opacity={0.5} />
    {/* the wrapped hand: white cloth strips over the fist, the thumb stump covered */}
    <path d="M-34 -84C-30 -112 -8 -126 14 -118C36 -110 42 -84 34 -60C26 -38 2 -30 -16 -40C-32 -50 -38 -64 -34 -84Z" fill="#EFE7D6" stroke="#B8AC96" strokeWidth={3} />
    {[-100, -86, -72, -58].map((yy, i) => (
      <path key={i} d={`M-30 ${yy}C-10 ${yy - 10} 14 ${yy - 8} 32 ${yy - 2}`} stroke="#CFC4AE" strokeWidth={5} fill="none" opacity={0.9} />
    ))}
    {/* the wrap tail fluttering */}
    <path d="M30 -60C46 -52 52 -38 50 -24" stroke="#EFE7D6" strokeWidth={7} fill="none" strokeLinecap="round" />
    <path d="M-20 -116C-12 -122 4 -124 14 -118" stroke="#B8AC96" strokeWidth={2.5} fill="none" />
  </g>
);
