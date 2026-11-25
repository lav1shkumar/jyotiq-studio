import React from "react";
import { LOOKS, type Who } from "../manthan/rig";
import { P } from "../manthan/style";

/*
 * गुरु तेग़ बहादुर जी · शहीदी दिवस (24 Nov 2026). Cast for the Manthan cut-out rig, added under new LOOKS keys.
 * Period dress, Punjab and Delhi 1635–1675 (see workspace/gurpurab-tegh-bahadur/CAST-AND-LOCATIONS.md):
 *  gtTyagMal   teen Tyag Mal at Kartarpur (1635): kesari dastar, cream chola, kesari kamarkasa, iron kara, no beard.
 *  gtHargobind Guru Hargobind Sahib (~40): navy dastar with a white kalgi on a jewelled clasp, full black beard,
 *              maroon chola with gold trim and a gold kamarkasa, pearl string; two swords (miri-piri) drawn by the scene.
 *  gtTegh      Guru Tegh Bahadur ji (~54, 1675): kesari dastar, long white-grey beard, white chola, kesari kamarkasa and shawl.
 *  gtGobind    Bal Gobind Rai (~9): small blue dastar, kesari chola, white sash; drawn at a smaller scale.
 *  gtKirpaRam  Pandit Kirpa Ram (Kashmiri, ~50): white safa, saffron urdhva tilak, brown woollen pheran, red-bordered shawl.
 *  gtPandit    a second Pandit (grey pheran) for the delegation.
 *  gtAfsar     the Mughal officer: cream pagri with a sarpech, green jama with gold trim, red patka, pearls, short beard.
 *  gtSikhRider / gtMughalRider  soldiers for the battle.
 */
type Look = (typeof LOOKS)[Who];
const L = LOOKS as unknown as Record<string, Look>;
const base = LOOKS.indra;
const KARA = "#AEB4BE";

L.gtTyagMal = {
  ...base,
  skin: "#E2AA7A", skinShade: "#C08656", skinLine: "#82502E", rim: "#FFE6BC",
  iris: "#2A1A10", lid: 0.08, brow: "#1A110C", browW: 5,
  hair: "covered", hairColor: "#1A110C", hairShade: "#0C0806",
  moustache: undefined, beard: undefined, crown: "dastar", turban: ["#E8892A", "#B5621A"], plume: undefined,
  tilak: undefined, thread: false, necklaces: 0, pearls: false, rudraksha: false, stole: undefined,
  robe: { cloth: "#F2EADA", shade: "#CFC2A6", trim: "#C8902E", sash: "#E8892A", shoe: "#5A2A14" },
  armlet: false, bracelet: KARA, anklet: false, earring: "none", chest: 0.94,
};

L.gtHargobind = {
  ...base,
  skin: "#D69A6A", skinShade: "#B47A4C", skinLine: "#6E4426", rim: "#FFE0B0",
  iris: "#24160C", lid: 0.18, brow: "#120C08", browW: 6,
  hair: "covered", hairColor: "#120C08", hairShade: "#060403",
  beard: "full", moustache: "sage", beardColor: "#140E0A",
  crown: "dastar", turban: ["#24306A", "#141C44"], plume: "kalgi",
  tilak: undefined, thread: false, necklaces: 0, pearls: true, rudraksha: false, stole: undefined,
  robe: { cloth: "#7A1E2E", shade: "#56121F", trim: "#E3B341", sash: "#C8902E", shoe: "#3A1A0C" },
  armlet: false, bracelet: KARA, anklet: false, earring: "none", chest: 1.1,
};

L.gtTegh = {
  ...base,
  skin: "#D29A6E", skinShade: "#B07850", skinLine: "#6A4428", rim: "#FFE6C4",
  iris: "#2A1A10", lid: 0.32, brow: "#E6E0D6", browW: 6,
  hair: "covered", hairColor: "#DAD4CA", hairShade: "#A8A094",
  beard: "full", moustache: "sage", beardColor: "#ECE8E0",
  crown: "dastar", turban: ["#D9782A", "#A5541A"], plume: undefined,
  tilak: undefined, thread: false, necklaces: 0, pearls: false, rudraksha: false,
  stole: ["#E08A34", "#B85E1C"],
  robe: { cloth: "#F6F2E8", shade: "#D6CEBE", trim: "#D9A23A", sash: "#D9782A", shoe: "#4A2412" },
  armlet: false, bracelet: KARA, anklet: false, earring: "none", chest: 1.04,
};

L.gtGobind = {
  ...base,
  skin: "#E8B286", skinShade: "#C88E62", skinLine: "#8A5634", rim: "#FFEAC8",
  iris: "#2A1A10", lid: 0.02, brow: "#1A110C", browW: 4,
  hair: "covered", hairColor: "#1A110C", hairShade: "#0C0806",
  beard: undefined, moustache: undefined, crown: "dastar", turban: ["#2446A8", "#173278"], plume: undefined,
  tilak: undefined, thread: false, necklaces: 0, pearls: false, rudraksha: false, stole: undefined,
  robe: { cloth: "#EE9A3A", shade: "#C47424", trim: "#F6E2A8", sash: "#F4EEDF", shoe: "#5A2A14" },
  armlet: false, bracelet: KARA, anklet: false, earring: "none", chest: 0.86,
};

L.gtKirpaRam = {
  ...base,
  skin: "#EAC6A0", skinShade: "#C8A07A", skinLine: "#8A6446", rim: "#FFF0DA",
  iris: "#3A2616", lid: 0.24, brow: "#6A5A4E", browW: 6,
  hair: "covered", hairColor: "#7A6A5E", hairShade: "#4A3E36",
  beard: undefined, moustache: "thin", beardColor: "#8A7A6E",
  crown: "safa", turban: ["#F6F3EC", "#D2CCC0"], plume: undefined,
  tilak: "urdhva", thread: false, necklaces: 0, pearls: false, rudraksha: true,
  stole: ["#EDE2CA", "#A0262E"],
  robe: { cloth: "#8A6A4C", shade: "#664C34", trim: "#C8A468", shoe: "#3A2414" },
  armlet: false, bracelet: "#8A6A3A", anklet: false, earring: "none", chest: 1.0,
};

L.gtPandit = {
  ...L.gtKirpaRam,
  skin: "#E2BA92", skinShade: "#C0946C",
  brow: "#2A1E16", hairColor: "#2A1E16", moustache: "curl", beardColor: "#2A1E16", lid: 0.16,
  stole: ["#E6D6B8", "#2E5A8A"],
  robe: { cloth: "#7E7A70", shade: "#5E5A52", trim: "#BBA676", shoe: "#3A2414" },
};

L.gtAfsar = {
  ...base,
  skin: "#CFA078", skinShade: "#A97C56", skinLine: "#6A4630", rim: "#FFDDB6",
  iris: "#1A100A", lid: 0.36, brow: "#0E0906", browW: 8,
  hair: "covered", hairColor: "#0E0906", hairShade: "#050302",
  beard: "goatee", moustache: "curl", beardColor: "#120C08",
  crown: "pagri", turban: ["#F2E6C8", "#C6B48A"], plume: "sarpech",
  tilak: undefined, thread: false, necklaces: 1, pearls: true, rudraksha: false, stole: undefined,
  robe: { cloth: "#2E6A5A", shade: "#1C4A3E", trim: "#E8C060", sash: "#B3182E", shoe: "#2A120A", open: true },
  armlet: false, bracelet: P.gold, anklet: false, earring: "none", chest: 1.12,
};

L.gtSikhRider = { ...L.gtTyagMal, skin: "#C88E62", skinShade: "#A06C44", beard: "full", moustache: "sage", beardColor: "#140E0A", turban: ["#1E2E6A", "#121C44"], chest: 1.08 };
L.gtMughalRider = {
  ...L.gtAfsar,
  plume: undefined, pearls: false, necklaces: 0, turban: ["#7A6A52", "#56482F"],
  robe: { cloth: "#5E5444", shade: "#40382C", trim: "#9A8A6A", sash: "#6A1A1A", shoe: "#2A120A" },
};

export const TYAG = "gtTyagMal" as Who;
export const HARGOBIND = "gtHargobind" as Who;
export const TEGH = "gtTegh" as Who;
export const GOBIND = "gtGobind" as Who;
export const KIRPA = "gtKirpaRam" as Who;
export const PANDIT = "gtPandit" as Who;
export const AFSAR = "gtAfsar" as Who;
export const SIKH_RIDER = "gtSikhRider" as Who;
export const MUGHAL_RIDER = "gtMughalRider" as Who;

/** A curved talwar (tegha). Origin = the grip; blade points up at rot 0. */
export const Talwar: React.FC<{ s?: number; rot?: number; flash?: number }> = ({ s = 1, rot = 0, flash = 0 }) => (
  <g transform={`rotate(${rot}) scale(${s})`}>
    <path d="M-4 -14C-6 -80 4 -150 34 -206C14 -150 6 -84 6 -14Z" fill="#D8DDE4" stroke="#7A828E" strokeWidth={2} />
    <path d="M0 -20C0 -80 8 -144 30 -196" stroke="#FFFFFF" strokeWidth={2} fill="none" opacity={0.7 + 0.3 * flash} />
    {flash > 0.01 ? <ellipse cx={16} cy={-120} rx={30} ry={90} fill="#FFFFFF" opacity={0.45 * flash} filter="url(#mBlur8)" /> : null}
    <rect x={-22} y={-18} width={44} height={8} rx={3} fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={1.2} />
    <rect x={-6} y={-10} width={12} height={36} rx={4} fill="#3A2012" />
    <circle cy={30} r={8} fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={1.2} />
  </g>
);

/** A round leather dhal (shield) with four brass bosses. Origin = centre. */
export const Dhal: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <circle r={52} fill="#4A2A16" stroke="#2A160A" strokeWidth={3} />
    <circle r={44} fill="none" stroke="#7A4A26" strokeWidth={2} />
    {[45, 135, 225, 315].map((a) => (
      <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 20} cy={Math.sin((a * Math.PI) / 180) * 20} r={6} fill="url(#mGold)" stroke={P.goldDeep} strokeWidth={1} />
    ))}
    <circle r={8} fill="url(#mGold)" />
  </g>
);

/** A sheathed sword hanging from the sash (for Guru Hargobind's miri-piri pair). Origin = the hilt. */
export const SheathedSword: React.FC<{ s?: number; rot?: number }> = ({ s = 1, rot = 0 }) => (
  <g transform={`rotate(${rot}) scale(${s})`}>
    <path d="M-6 10C-8 70 -2 130 20 186L30 182C10 126 6 70 8 10Z" fill="#3A1A10" stroke="#1E0C06" strokeWidth={1.5} />
    <path d="M-4 60L8 60M-2 120L12 118M16 172L28 168" stroke="url(#mGold)" strokeWidth={4} />
    <rect x={-16} y={2} width={32} height={8} rx={3} fill="url(#mGold)" />
    <rect x={-5} y={-24} width={10} height={28} rx={3} fill="#2A160C" />
    <circle cy={-28} r={6} fill="url(#mGold)" />
  </g>
);

/** A wooden mala (prayer beads) held in the hand. Origin = the grip. */
export const Mala: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <path d={`M0 0C-14 20 -16 50 0 66C16 50 14 20 0 0`} stroke="#6A3A1C" strokeWidth={6} strokeDasharray="0.1 8" strokeLinecap="round" fill="none" transform={`rotate(${Math.sin(f / 20) * 4})`} />
    <circle cy={70} r={5} fill="#E08A34" />
  </g>
);

/** A katar (push dagger) tucked in the officer's patka. Origin = the grip. */
export const Katar: React.FC<{ s?: number; rot?: number }> = ({ s = 1, rot = 0 }) => (
  <g transform={`rotate(${rot}) scale(${s})`}>
    <path d="M-8 -10L0 -70L8 -10Z" fill="#CDD2DA" stroke="#6A727E" strokeWidth={1.4} />
    <rect x={-12} y={-10} width={24} height={6} fill="url(#mGold)" />
    <path d="M-12 -4L-12 22M12 -4L12 22" stroke="url(#mGold)" strokeWidth={4} />
    <path d="M-12 8L12 8M-12 16L12 16" stroke="url(#mGold)" strokeWidth={3} />
  </g>
);
