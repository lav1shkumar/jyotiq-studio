import React from "react";
import "../ep1/cast";
import "../ep2/cast2";
import "../ep3/cast3";
import "../ep4/cast4";
import "../ep5/cast5";
import { LOOKS, type Pose, type Who } from "../../manthan/rig";
import { P } from "../../manthan/style";
import { LK0, type Palette } from "../ep5/kunti";

/*
 * भारत Ep6 cast, from the Udyoga Parva text (Ganguli sec. 179-189). New rig LOOKS keys only; earlier files are read-only.
 *  bhParashurama: "wearing matted-locks on his head and attired in deer-skins ... his bow in hand ... a sword and a battle-axe"
 *    (sec. 179), "resembled a blazing fire". A mighty, mature ascetic-warrior: warm brown skin, dark grey jata, a full beard,
 *    tripundra, rudraksha, the sacred thread, a deer-skin stole over an ochre valkala dhoti, leather finger guards (sec. 182).
 *  bhBhishma6: on the day of the duel "clad in white, with also a white head-gear, all my adornments were white", "a coat of
 *    mail, white in hue", "the bow I took was also white" (sec. 181). So: the Ep2-3 Devavrata face a few years older (thin
 *    moustache), a white pagri with a pearl sarpech, white silk dhoti and stole with silver borders, pearl haars, silver kadas,
 *    a white-and-silver kavach (BhishmaKavach overlay) and a white bow (Bow6 white).
 *  bhNarada: the text (Shalya Parva) gives him "a circle of matted locks" and "a shining golden garment", with the kacchapi
 *    vina: fair skin, a jata knot, gold dhoti and stole, a tulsi-rudraksha mala, the urdhva tilak.
 *  bhPitri: Parashurama's forefathers (Jamadagni, Richika): old white-haired rishis, drawn as translucent smoke figures.
 *  bhAkritavrana: Parashurama's friend and charioteer, "well-versed in the Vedas": an older ascetic with a white jata.
 *  AMBA6: Amba now, in the forest hermitage: the Ep3 face, a dull maroon sari, no crown, few ornaments.
 */
type Look = (typeof LOOKS)[Who];
const L = LOOKS as unknown as Record<string, Look>;

L.bhParashurama = {
  ...L.bhVyasa,
  skin: "#B47A50",
  skinShade: "#8E5A38",
  skinLine: "#4E2C18",
  rim: "#FFC890",
  sclera: "#FFF4E2",
  iris: "#1E1008",
  glowColor: "#FF6A1A",
  lid: 0.26,
  brow: "#2A221C",
  browW: 9,
  hair: "jata",
  hairColor: "#3A3028",
  hairShade: "#1C1612",
  beard: "full",
  moustache: "sage",
  beardColor: "#4A4038",
  crown: undefined,
  tilak: "tripundra",
  thread: true,
  necklaces: 0,
  rudraksha: true,
  stole: ["#B8874E", "#6A4422"],
  dhoti: ["#C06A24", "#984E16", "#5E3010"],
  armlet: false,
  bracelet: "#4A3020",
  anklet: false,
  earring: "rudraksha",
  chest: 1.16,
};
L.bhBhishma6 = {
  ...L.bhDevavrata,
  skin: "#DDA676",
  skinShade: "#BA8252",
  lid: 0.14,
  browW: 6,
  moustache: "thin",
  beardColor: "#1A110C",
  crown: "pagri",
  turban: ["#F7F4EC", "#CFC9BA"],
  plume: "sarpech",
  necklaces: 3,
  pearls: true,
  stole: ["#F7F4EC", "#B9C0CA"],
  dhoti: ["#F7F4EC", "#D7D1C3", "#B9C0CA"],
  armlet: true,
  bracelet: "#D9DDE3",
  anklet: true,
  earring: "kundala",
  chest: 1.08,
};
L.bhNarada = {
  ...L.deva,
  skin: "#EBC296",
  skinShade: "#C99A6C",
  skinLine: "#86583A",
  rim: "#FFF0D0",
  iris: "#2A1A10",
  lid: 0.1,
  brow: "#1E140E",
  browW: 5,
  hair: "jata",
  hairColor: "#24180F",
  hairShade: "#120C08",
  beard: undefined,
  moustache: undefined,
  crown: undefined,
  tilak: "urdhva",
  thread: true,
  necklaces: 1,
  pearls: false,
  rudraksha: true,
  stole: ["#E9B949", "#A8781E"],
  dhoti: ["#F2C95E", "#CB9C36", "#A8781E"],
  armlet: false,
  bracelet: "#E8B24A",
  anklet: false,
  earring: "kundala",
  chest: 0.98,
};
L.bhPitri = {
  ...L.durvasa,
  skin: "#C9B8A6",
  skinShade: "#A8968A",
  rim: "#FFFFFF",
  hair: "jata",
  hairColor: "#EEEAE2",
  hairShade: "#BDB6A8",
  beard: "sage",
  beardColor: "#F2EEE6",
  stole: ["#E8E2D6", "#BDB6A8"],
  dhoti: ["#E8E2D6", "#C8C0B2", "#A89E90"],
};
L.bhAkritavrana = {
  ...L.durvasa,
  skin: "#A8785A",
  skinShade: "#86583E",
  hair: "jata",
  hairColor: "#D8D2C8",
  hairShade: "#A8A296",
  beard: "sage",
  beardColor: "#E2DDD4",
  stole: ["#9A6A3A", "#5A3A1E"],
  dhoti: ["#C8A070", "#A07E52", "#6A4A2A"],
};
export const PARASHURAMA = "bhParashurama" as Who;
export const BHISHMA6 = "bhBhishma6" as Who;
export const NARADA = "bhNarada" as Who;
export const PITRI = "bhPitri" as Who;
export const AKRITAVRANA = "bhAkritavrana" as Who;

export const AMBA6: Palette = {
  ...LK0,
  skin: "#E2AE86",
  skinShade: "#C48C66",
  skinLine: "#7A4A30",
  rim: "#FFE2C8",
  sari: "#7E1E2A",
  sariShade: "#5A121C",
  sariHi: "#A8404A",
  choli: "#B8862E",
  lip: "#9A2A3A",
  hair: "#120C0A",
  border: "#C9A24A",
};

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */

/** Parashurama's parashu: a long ash haft bound in gold and leather, a broad crescent blade. Origin = the grip; blade up. */
export const Parashu: React.FC<{ s?: number; rot?: number; glow?: number }> = ({ s = 1, rot = 0, glow = 0 }) => (
  <g transform={`rotate(${rot}) scale(${s})`}>
    {glow > 0.01 ? <ellipse cx={34} cy={-250} rx={110} ry={90} fill="#FF8A2A" opacity={0.45 * glow} filter="url(#mBlur8)" /> : null}
    <path d="M-7 120L-7 -300L7 -300L7 120Z" fill="#6A3E1E" />
    <path d="M2 120L2 -300L7 -300L7 120Z" fill="#3E220E" opacity={0.6} />
    {[-40, 0, 40].map((y) => <rect key={y} x={-9} y={y - 7} width={18} height={14} rx={3} fill="#3A2012" />)}
    {[-210, -170].map((y) => <rect key={y} x={-10} y={y - 6} width={20} height={12} rx={3} fill="url(#mGold)" />)}
    <path d="M6 -300C40 -330 92 -322 112 -290C126 -262 120 -222 100 -196C82 -214 52 -222 6 -214Z" fill="#C9CCD2" stroke="#5A5E66" strokeWidth={4} />
    <path d="M100 -196C116 -222 120 -262 108 -288" stroke="#FFFFFF" strokeWidth={5} fill="none" opacity={0.8} />
    <path d="M14 -292C40 -306 70 -300 86 -282" stroke="#8A8E96" strokeWidth={3} fill="none" opacity={0.7} />
    <path d="M-6 -300C-22 -312 -30 -296 -22 -282C-16 -272 -8 -270 -6 -262Z" fill="#9A9EA6" stroke="#5A5E66" strokeWidth={3} />
    <circle cx={30} cy={-258} r={7} fill="url(#mGold)" />
    <path d="M0 -300L0 -330" stroke="url(#mGold)" strokeWidth={8} strokeLinecap="round" />
  </g>
);

/** A bow in white lacquer with silver bindings (Bhishma, sec. 181), or the ascetic's dark bow. Origin = the grip. */
export const Bow6: React.FC<{ s?: number; rot?: number; draw?: number; white?: boolean; arrow?: number; astra?: number }> = ({ s = 1, rot = 0, draw = 0, white = false, arrow = 0, astra = 0 }) => {
  const wood = white ? "#F4F1E8" : "#4A2810";
  const edge = white ? "#AEB6C2" : "#E8B24A";
  const nock = -20 - 70 * draw;
  return (
    <g transform={`rotate(${rot}) scale(${s})`}>
      <path d="M0 -220C-6 -208 -2 -186 10 -164C36 -110 40 -44 14 -6L14 6C40 44 36 110 10 164C-2 186 -6 208 0 220" stroke={white ? "#8A929E" : "#2A1608"} strokeWidth={15} fill="none" strokeLinecap="round" />
      <path d="M0 -220C-6 -208 -2 -186 10 -164C36 -110 40 -44 14 -6L14 6C40 44 36 110 10 164C-2 186 -6 208 0 220" stroke={wood} strokeWidth={10} fill="none" strokeLinecap="round" />
      <path d="M0 -220C-6 -208 -2 -186 10 -164C36 -110 40 -44 14 -6" stroke={edge} strokeWidth={3} fill="none" opacity={0.9} transform="translate(3 0)" />
      {[-140, -70, 70, 140].map((y) => <rect key={y} x={Math.abs(y) > 100 ? 12 : 26} y={y - 4} width={12} height={8} rx={2} fill={white ? "#C9CED6" : "url(#mGold)"} />)}
      <rect x={6} y={-18} width={18} height={36} rx={4} fill={white ? "#D9DDE3" : "#8E1E2A"} stroke={white ? "#8A929E" : P.goldDeep} strokeWidth={1.5} />
      <path d={`M0 -220L${nock} 0L0 220`} stroke="#F4EEDA" strokeWidth={2.6} fill="none" />
      {arrow > 0.01 ? (
        <g opacity={arrow}>
          {astra > 0.01 ? <ellipse cx={nock + 150} cy={0} rx={230} ry={46} fill="#7FB8FF" opacity={0.5 * astra} filter="url(#mBlur8)" /> : null}
          <path d={`M${nock} 0L${nock + 330} 0`} stroke={astra > 0.01 ? "#DDEBFF" : "#6A3A1C"} strokeWidth={5} />
          <path d={`M${nock + 330} 0L${nock + 300} -12L${nock + 306} 0L${nock + 300} 12Z`} fill={astra > 0.01 ? "#FFFFFF" : "#C9CCD2"} />
          <path d={`M${nock} 0L${nock + 24} -12L${nock + 34} 0L${nock + 24} 12Z`} fill="#E8E2D2" />
        </g>
      ) : null}
    </g>
  );
};

/** Narada's kacchapi vina: a long dandi with a tortoise-shell resonator below and a small gourd above. Origin = the grip. */
export const Veena: React.FC<{ s?: number; rot?: number; glow?: number }> = ({ s = 1, rot = -14, glow = 0 }) => (
  <g transform={`rotate(${rot}) scale(${s})`}>
    {glow > 0.01 ? <ellipse cy={-40} rx={80} ry={240} fill="#FFE7A0" opacity={0.35 * glow} filter="url(#mBlur8)" /> : null}
    <path d="M-8 150L-8 -250L8 -250L8 150Z" fill="#7A3E18" />
    <path d="M3 150L3 -250L8 -250L8 150Z" fill="#4A220C" opacity={0.6} />
    <ellipse cy={180} rx={58} ry={46} fill="#8A4A1E" stroke="#4A220C" strokeWidth={4} />
    <path d="M-40 168C-20 150 20 150 40 168" stroke="#E8B24A" strokeWidth={3} fill="none" />
    <path d="M-44 190C-20 176 20 176 44 190" stroke="#E8B24A" strokeWidth={3} fill="none" opacity={0.7} />
    <circle cy={-232} r={34} fill="#B8742E" stroke="#5A320E" strokeWidth={3} />
    <circle cy={-232} r={12} fill="#E8B24A" />
    {[-180, -120, -60, 0, 60, 120].map((y) => <rect key={y} x={-10} y={y} width={20} height={4} rx={1} fill="#E8B24A" />)}
    {[-3, 3].map((x) => <path key={x} d={`M${x} 160L${x} -250`} stroke="#FFF4D0" strokeWidth={1.2} opacity={0.9} />)}
    <path d="M0 -266L0 -290" stroke="url(#mGold)" strokeWidth={6} strokeLinecap="round" />
  </g>
);

/** Leather finger guards / a small round shield etc. are left to the rig. A sword on the hip (Parashurama carries one, sec. 179). */
export const Sword: React.FC<{ s?: number; rot?: number }> = ({ s = 1, rot = 30 }) => (
  <g transform={`rotate(${rot}) scale(${s})`}>
    <path d="M-5 0L5 0L4 150C2 160 -2 160 -4 150Z" fill="#5A3A22" stroke="#2E1C10" strokeWidth={2} />
    <rect x={-16} y={-6} width={32} height={8} rx={3} fill="url(#mGold)" />
    <path d="M-4 -6L4 -6L4 -40L-4 -40Z" fill="#3A2416" />
    <circle cy={-44} r={6} fill="url(#mGold)" />
  </g>
);

/**
 * Bhishma's white coat of mail, drawn over the rig torso in its own frame (same transform as the Puppet). Use with poses that
 * keep the front arm off the chest. Scales lamellar plates in silver-white with a gold-free silver trim.
 */
export const BhishmaKavach: React.FC<{ x: number; y: number; s: number; facing: number; p: Pose; k?: number }> = ({ x, y, s, facing, p, k = 1.08 }) => {
  const d = `M${-38 * k} -10C${-42 * k} -54 ${-58 * k} -112 ${-62 * k} -158C${-64 * k} -186 ${-46 * k} -203 ${-18 * k} -206L${26 * k} -206C${54 * k} -204 ${70 * k} -188 ${68 * k} -160C${64 * k} -112 ${50 * k} -56 ${44 * k} -10Z`;
  return (
    <g transform={`translate(${x} ${y + p.bob}) scale(${facing * s} ${s}) rotate(${p.sway})`}>
      <g transform={`rotate(${p.lean})`}>
        <clipPath id={`kv-${x}-${y}`}>
          <path d={d} />
        </clipPath>
        <path d={d} fill="#E9ECF0" stroke="#8A929E" strokeWidth={3} />
        <g clipPath={`url(#kv-${x}-${y})`}>
          {Array.from({ length: 9 }, (_, r) =>
            Array.from({ length: 8 }, (_, c) => {
              const cx = -70 + c * 20 + (r % 2) * 10;
              const cy = -196 + r * 22;
              return <path key={`${r}-${c}`} d={`M${cx - 10} ${cy}Q${cx} ${cy + 18} ${cx + 10} ${cy}`} stroke="#A8B0BC" strokeWidth={2} fill="none" />;
            }),
          )}
          <path d={`M-80 -220C-40 -170 -30 -80 -36 10L-90 10Z`} fill="#8A929E" opacity={0.35} />
          <path d={`M${58 * k} -210C${72 * k} -160 ${60 * k} -80 ${46 * k} 6L${90 * k} 6L${90 * k} -220Z`} fill="#FFFFFF" opacity={0.5} />
        </g>
        <path d={`M${-30 * k} -200C${-10 * k} -176 ${30 * k} -176 ${50 * k} -200`} stroke="#C9CED6" strokeWidth={10} fill="none" strokeLinecap="round" />
        <circle cx={10} cy={-150} r={16} fill="#F7F4EC" stroke="#8A929E" strokeWidth={3} />
        <circle cx={10} cy={-150} r={7} fill="#FFFFFF" />
        <path d={`M${-40 * k} -14L${46 * k} -14`} stroke="#C9CED6" strokeWidth={12} strokeLinecap="round" />
      </g>
    </g>
  );
};

/**
 * A war chariot (ratha), side view, facing +x: an open car with a carved rail on one big spoked wheel, the pole running out of
 * frame to the right (the horses stay out of frame: no hand-drawn animals). `metal`: silver (Bhishma's car "made of silver",
 * covered in tiger-skin) or gold (Parashurama's car "decked all over with ornaments of gold"). `banner`: Bhishma's palm
 * standard (tala-dhvaja) or Parashurama's "device of the sun and the moon". Origin = the ground under the wheel.
 */
export const Ratha: React.FC<{ f: number; s?: number; facing?: number; metal: "silver" | "gold"; banner: "palm" | "sunmoon"; umbrella?: boolean; part?: "all" | "back" | "front" }> = ({ f, s = 1, facing = 1, metal, banner, umbrella = false, part = "all" }) => {
  const m = metal === "silver" ? { a: "#E4E7EC", b: "#AEB6C2", c: "#6E7682" } : { a: "#F2C14E", b: "#C8901E", c: "#7A520E" };
  const flap = Math.sin(f / 7) * 8;
  return (
    <g transform={`scale(${facing * s} ${s})`}>
      {part !== "front" ? (<g>
      {/* flag staff + banner */}
      <path d="M-150 -300L-150 -820" stroke="#5A3A22" strokeWidth={10} />
      <path d="M-150 -820L-150 -840" stroke="url(#mGold)" strokeWidth={14} strokeLinecap="round" />
      <path d={`M-146 -810L${-20 + flap} -790L${-40 + flap * 0.6} -755L${-20 + flap} -720L-146 -700Z`} fill={banner === "palm" ? "#F4F1E8" : "#B3262E"} stroke={banner === "palm" ? "#AEB6C2" : "#F2C14E"} strokeWidth={3} />
      {banner === "palm" ? (
        <g transform="translate(-88 -755)">
          <path d="M0 30L0 -14" stroke="#3E6A2E" strokeWidth={5} />
          {[-60, -30, 0, 30, 60].map((a) => <path key={a} d="M0 -14C10 -30 22 -36 34 -36" stroke="#3E6A2E" strokeWidth={5} fill="none" transform={`rotate(${a - 90} 0 -14)`} />)}
          {[[-26, -30], [26, -30], [-30, 6], [30, 6], [0, -44]].map(([sx, sy], i) => <circle key={i} cx={sx} cy={sy} r={3.5} fill="#C9A24A" />)}
        </g>
      ) : (
        <g transform="translate(-86 -755)">
          <circle cx={-14} r={18} fill="#FFD36A" />
          {Array.from({ length: 8 }, (_, i) => <path key={i} d="M-14 -22L-11 -30L-17 -30Z" fill="#FFD36A" transform={`rotate(${i * 45} -14 0)`} />)}
          <path d="M26 -18A18 18 0 1 0 26 18A13 13 0 1 1 26 -18Z" fill="#F4F0E0" />
        </g>
      )}
      {umbrella ? (
        <g transform="translate(-40 -560)">
          <path d="M0 0L0 240" stroke="#D9DDE3" strokeWidth={8} />
          <path d="M-130 30C-110 -40 110 -40 130 30Z" fill="#F7F4EC" stroke="#AEB6C2" strokeWidth={4} />
          {[-90, -45, 0, 45, 90].map((x) => <path key={x} d={`M0 -26L${x} 26`} stroke="#CFC9BA" strokeWidth={2} />)}
          {Array.from({ length: 11 }, (_, i) => <circle key={i} cx={-125 + i * 25} cy={36} r={5} fill="#FFFFFF" stroke="#C9CED6" strokeWidth={1.5} />)}
          <circle cy={-34} r={9} fill="#D9DDE3" />
        </g>
      ) : null}
      </g>) : null}
      {part !== "back" ? (<g>
      {/* car body */}
      <path d="M-250 -150L190 -150L230 -300L-220 -330Z" fill={m.b} stroke={m.c} strokeWidth={5} />
      <path d="M-240 -170L180 -170L210 -285L-212 -312Z" fill={m.a} />
      {Array.from({ length: 9 }, (_, i) => (
        <g key={i}>
          <path d={`M${-200 + i * 46} -176L${-196 + i * 46} -300`} stroke={m.c} strokeWidth={4} opacity={0.6} />
          <circle cx={-198 + i * 46} cy={-238} r={9} fill={m.b} stroke={m.c} strokeWidth={2} />
        </g>
      ))}
      {metal === "silver" ? (
        // tiger-skin cover on the rail (sec. 181)
        <g>
          <path d="M-246 -150L186 -150L196 -196L-238 -200Z" fill="#E8962E" />
          {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-220 + i * 36} -150C${-214 + i * 36} -168 ${-222 + i * 36} -184 ${-212 + i * 36} -198`} stroke="#2A1608" strokeWidth={6} fill="none" />)}
        </g>
      ) : (
        <path d="M-246 -150L186 -150L196 -196L-238 -200Z" fill="#9A1E2A" stroke="#F2C14E" strokeWidth={4} />
      )}
      <path d="M-250 -150L190 -150" stroke={m.c} strokeWidth={8} />
      {/* pole to the (off-frame) horses */}
      <path d="M180 -160C320 -150 520 -170 900 -210" stroke="#5A3A22" strokeWidth={16} fill="none" />
      <path d="M180 -160C320 -150 520 -170 900 -210" stroke={m.b} strokeWidth={5} fill="none" strokeDasharray="30 50" />
      {/* the wheel */}
      <g transform="translate(-30 -150)">
        <circle r={150} fill="none" stroke="#3A2414" strokeWidth={22} />
        <circle r={150} fill="none" stroke={m.b} strokeWidth={8} />
        {Array.from({ length: 12 }, (_, i) => <path key={i} d="M0 0L0 -140" stroke="#4A2E1A" strokeWidth={9} transform={`rotate(${i * 30})`} />)}
        <circle r={30} fill={m.a} stroke={m.c} strokeWidth={5} />
        <circle r={10} fill={m.c} />
      </g>
      </g>) : null}
    </g>
  );
};
