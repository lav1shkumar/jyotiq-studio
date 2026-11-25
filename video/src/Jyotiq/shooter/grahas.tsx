import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FocusLines, Shockwave, SpeedLines, StarDust } from "../bbreel/anime";
import { CORMORANT, DEVA } from "../bbreel/fonts";
import { PhoneFrame } from "../bbreel/phoneKit";
import { StatusBar, SysNav } from "../bbreel/playStore";
import { SANS } from "../theme";
import { KundliChart } from "./kid";
import { Bullet, Crow, Shani } from "./shani";
import { INK, NameTag, Shades, Slam, starPath } from "./prims";
import { KICKS, SC, hit, kickPulse, ramp, shake, track, wob } from "./timing";

/* S3 — "shooter gaadi mein": the rest of the kid's kundli leaves the Jyotiq
   chart and rolls out as a convoy on the Graha Expressway. Four cars, two
   grahas each, every one a movie archetype, then the whole squad. */

/* ------------------------------------------------------------------ */
/* Characters (front-facing busts, local origin = seat, head at y -230) */
/* ------------------------------------------------------------------ */

type Face = "cool" | "romantic" | "fierce" | "nerd" | "wise" | "diva" | "rahu";
type Crown = "sun" | "moon" | "spike" | "turban" | "tiara" | "none";
type Arms = "drive" | "wide" | "notes" | "selfie" | "tablet" | "flag" | "none";
export type Spec = {
  skin: string;
  shade: string;
  light: string;
  outfit: string;
  outfitD: string;
  trim: string;
  hair: string;
  face: Face;
  crown: Crown;
  arms: Arms;
  beard?: boolean;
  stache?: boolean;
  longHair?: boolean;
  headless?: boolean;
  headOnly?: boolean;
};

export const CAST: Record<string, Spec> = {
  surya: { skin: "#F2A65A", shade: "#D27C34", light: "#FFD29A", outfit: "#D9442B", outfitD: "#A82A16", trim: "#F2C14E", hair: "#3A1A08", face: "cool", crown: "sun", arms: "drive", stache: true },
  chandra: { skin: "#F4ECFF", shade: "#C9BDE8", light: "#FFFFFF", outfit: "#E6EEFF", outfitD: "#AFC0E8", trim: "#C9D6FF", hair: "#2A2850", face: "romantic", crown: "moon", arms: "wide", longHair: true },
  guru: { skin: "#F0B86A", shade: "#CC8E40", light: "#FFDBA0", outfit: "#F2C531", outfitD: "#C99A12", trim: "#FFFFFF", hair: "#F4F1EA", face: "wise", crown: "turban", arms: "notes", beard: true },
  shukra: { skin: "#FFE3EE", shade: "#E8B4C8", light: "#FFFFFF", outfit: "#FFFFFF", outfitD: "#E7C9D8", trim: "#FF7AB6", hair: "#2B1430", face: "diva", crown: "tiara", arms: "selfie", longHair: true },
  mangal: { skin: "#E0473A", shade: "#B02A20", light: "#FF8A72", outfit: "#7A1010", outfitD: "#4E0808", trim: "#F2C14E", hair: "#1A0606", face: "fierce", crown: "spike", arms: "drive" },
  budh: { skin: "#4FC97A", shade: "#2F9A56", light: "#94F0B4", outfit: "#1F7A4A", outfitD: "#145A34", trim: "#F2C14E", hair: "#123A24", face: "nerd", crown: "none", arms: "tablet" },
  ketu: { skin: "#9A8C84", shade: "#6E625C", light: "#C9BCB4", outfit: "#3A3346", outfitD: "#25202E", trim: "#C9B9A6", hair: "#000", face: "cool", crown: "none", arms: "flag", headless: true },
  rahu: { skin: "#A08CD8", shade: "#7462AE", light: "#D6C8FF", outfit: "#000", outfitD: "#000", trim: "#C9B9FF", hair: "#140E24", face: "rahu", crown: "none", arms: "none", headOnly: true },
};

const Head: React.FC<{ s: Spec; f: number; seed: string }> = ({ s, f, seed }) => {
  const blink = Math.floor(f + wob(seed, 1) * 40) % 47 > 44;
  const eyes = () => {
    switch (s.face) {
      case "cool":
        return <Shades x={0} y={-6} w={124} kind="aviator" />;
      case "diva":
        return <Shades x={0} y={-6} w={130} kind="star" lens="#3A0A2A" frame="#FF7AB6" />;
      case "rahu":
        return <Shades x={0} y={-10} w={140} kind="visor" lens="#120A22" frame="#C9B9FF" />;
      case "romantic":
        return (
          <g fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round">
            <path d="M-46 -4 Q-30 -20 -14 -4" />
            <path d="M14 -4 Q30 -20 46 -4" />
          </g>
        );
      case "wise":
        return (
          <g fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round">
            <path d="M-46 -2 Q-30 -12 -14 -2" />
            <path d="M14 -2 Q30 -12 46 -2" />
          </g>
        );
      case "nerd":
        return (
          <g>
            {[-30, 30].map((x) => (
              <g key={x}>
                <circle cx={x} cy={-4} r={22} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
                <circle cx={x + 3} cy={-2} r={blink ? 1 : 9} fill={INK} />
              </g>
            ))}
            <path d="M-8 -6 L8 -6" stroke={INK} strokeWidth={6} />
          </g>
        );
      case "fierce":
      default:
        return (
          <g>
            {[-1, 1].map((sd) => (
              <g key={sd}>
                <path d={`M${sd * 12} -10 L${sd * 52} -18 L${sd * 48} 6 Q${sd * 30} 12 ${sd * 14} 6Z`} fill="#FFFFFF" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
                <circle cx={sd * 30} cy={-4} r={6} fill={INK} />
                <path d={`M${sd * 10} -30 L${sd * 56} -40`} stroke={INK} strokeWidth={10} strokeLinecap="round" />
              </g>
            ))}
          </g>
        );
    }
  };
  const mouth = () => {
    switch (s.face) {
      case "romantic":
        return <path d="M-22 40 Q0 58 22 40" fill="#C2476A" stroke={INK} strokeWidth={5} />;
      case "wise":
        return <path d="M-18 44 Q0 52 18 44" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />;
      case "nerd":
        return <path d="M-24 40 Q0 62 24 40 Z" fill="#FFFFFF" stroke={INK} strokeWidth={5} />;
      case "diva":
        return <path d="M-20 40 Q0 30 20 40 Q0 58 -20 40Z" fill="#E8286A" stroke={INK} strokeWidth={4} />;
      case "rahu":
        return (
          <g>
            <path d="M-56 30 Q0 90 56 30 Q0 64 -56 30Z" fill="#2A0A20" stroke={INK} strokeWidth={6} />
            <path d="M-36 40 L-30 58 L-24 44 M24 44 L30 58 L36 40" fill="#FFFFFF" stroke={INK} strokeWidth={3} />
          </g>
        );
      case "fierce":
        return (
          <g>
            <path d="M-40 30 Q0 70 40 30 Q0 46 -40 30Z" fill="#3A0A10" stroke={INK} strokeWidth={5} />
            <path d="M-34 32 Q0 46 34 32 L30 40 Q0 52 -30 40Z" fill="#FFFFFF" />
          </g>
        );
      default:
        return (
          <g>
            <path d="M-34 32 Q4 60 38 30 Q6 44 -34 32Z" fill="#3A0A10" stroke={INK} strokeWidth={5} />
            <path d="M-28 34 Q4 48 32 32 L30 38 Q4 52 -26 40Z" fill="#FFFFFF" />
          </g>
        );
    }
  };
  return (
    <g>
      {/* halos / crowns behind */}
      {s.crown === "sun" ? (
        <g transform={`rotate(${f * 3})`}>
          {new Array(14).fill(0).map((_, i) => (
            <path key={i} d={`M0 -96 L10 -150 L0 -136 L-10 -150Z`} transform={`rotate(${i * (360 / 14)})`} fill="#FFB82E" stroke={INK} strokeWidth={4} />
          ))}
          <circle r={104} fill="none" stroke="#FFD45A" strokeWidth={10} opacity={0.8} />
        </g>
      ) : null}
      {s.longHair ? <path d="M-74 -40 C-96 40 -90 120 -60 150 L60 150 C90 120 96 40 74 -40Z" fill={s.hair} stroke={INK} strokeWidth={5} /> : null}
      {s.face === "rahu" ? (
        <g opacity={0.8}>
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${-20 + i * 20} 70 C${-60 + i * 30 + Math.sin(f / 3 + i) * 20} 120 ${-100 + i * 40} 150 ${-140 + i * 50} ${170 + Math.sin(f / 2 + i) * 16}`} fill="none" stroke="#9C8CFF" strokeWidth={16 - i * 4} strokeLinecap="round" opacity={0.5} />
          ))}
        </g>
      ) : null}
      {/* ears */}
      <ellipse cx={-70} cy={6} rx={14} ry={22} fill={s.skin} stroke={INK} strokeWidth={5} />
      <ellipse cx={70} cy={6} rx={14} ry={22} fill={s.skin} stroke={INK} strokeWidth={5} />
      {/* face */}
      <path d="M-68 -30 C-68 -96 -36 -112 0 -112 C36 -112 68 -96 68 -30 C68 30 50 72 22 86 C10 92 -10 92 -22 86 C-50 72 -68 30 -68 -30Z" fill={s.skin} stroke={INK} strokeWidth={6} />
      <path d="M-62 20 C-50 60 -30 80 -6 88 C-30 70 -46 46 -52 14Z" fill={s.shade} opacity={0.85} />
      <path d="M36 -98 C56 -84 64 -60 64 -36" fill="none" stroke={s.light} strokeWidth={8} strokeLinecap="round" opacity={0.8} />
      {/* blush */}
      {s.face === "romantic" || s.face === "diva" ? (
        <>
          <ellipse cx={-40} cy={24} rx={16} ry={8} fill="#FF7A9A" opacity={0.7} />
          <ellipse cx={40} cy={24} rx={16} ry={8} fill="#FF7A9A" opacity={0.7} />
        </>
      ) : null}
      {/* hair top */}
      {s.crown !== "turban" ? (
        <path d="M-72 -26 C-80 -110 -30 -136 4 -134 C46 -132 80 -104 72 -26 L58 -66 L40 -40 L26 -84 L4 -50 L-18 -88 L-34 -48 L-52 -78Z" fill={s.hair} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      ) : null}
      {eyes()}
      {/* nose */}
      <path d="M-2 10 Q8 22 0 28" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" opacity={0.6} />
      {s.beard ? <path d="M-60 20 C-60 120 -20 170 0 190 C20 170 60 120 60 20 C40 50 -40 50 -60 20Z" fill={s.hair} stroke={INK} strokeWidth={5} /> : null}
      {mouth()}
      {s.stache ? <path d="M-34 30 C-20 18 -6 22 0 28 C6 22 20 18 34 30 C20 26 8 34 0 32 C-8 34 -20 26 -34 30Z" fill="#2A1206" stroke={INK} strokeWidth={3} /> : null}
      {s.beard ? <path d="M-30 32 C-14 24 14 24 30 32 C14 30 -14 30 -30 32Z" fill={s.hair} stroke={INK} strokeWidth={4} /> : null}
      {/* crowns on top */}
      {s.crown === "sun" ? (
        <g transform="translate(0 -112)">
          <path d="M-58 10 L-44 -40 L-22 -10 L0 -62 L22 -10 L44 -40 L58 10Z" fill="url(#g-gold)" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <circle cx={0} cy={-6} r={12} fill="#E8283C" stroke={INK} strokeWidth={4} />
        </g>
      ) : null}
      {s.crown === "moon" ? (
        <g transform="translate(0 -128)">
          <path d="M-40 10 C-40 -40 40 -40 40 10 C24 -20 -24 -20 -40 10Z" fill="#E6EEFF" stroke={INK} strokeWidth={5} />
          <path d="M-14 -40 C-40 -62 -20 -100 14 -104 C-6 -90 -10 -60 10 -46 C0 -40 -8 -38 -14 -40Z" fill="#FFF7C8" stroke={INK} strokeWidth={5} />
        </g>
      ) : null}
      {s.crown === "spike" ? (
        <g transform="translate(0 -104)">
          <path d="M-70 14 L-62 -40 L-40 -4 L-20 -60 L0 -10 L20 -60 L40 -4 L62 -40 L70 14Z" fill="url(#g-gold)" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <rect x={-72} y={8} width={144} height={18} rx={6} fill="#E8283C" stroke={INK} strokeWidth={4} />
        </g>
      ) : null}
      {s.crown === "turban" ? (
        <g transform="translate(0 -96)">
          <path d="M-80 20 C-90 -60 -30 -90 0 -90 C40 -90 92 -60 80 20 C50 0 -50 0 -80 20Z" fill="#F2C531" stroke={INK} strokeWidth={5} />
          <path d="M-70 4 C-30 -40 30 -40 76 -6 M-74 -24 C-20 -64 40 -60 70 -40" fill="none" stroke="#C99A12" strokeWidth={6} />
          <circle cx={0} cy={-30} r={14} fill="#E8283C" stroke={INK} strokeWidth={4} />
          <path d="M0 -44 C10 -80 30 -96 40 -110" fill="none" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" />
        </g>
      ) : null}
      {s.crown === "tiara" ? (
        <g transform="translate(0 -118)">
          <path d={starPath(0, 0, 26, 11, 5)} fill="#FFD6EA" stroke={INK} strokeWidth={4} />
          <path d="M-54 22 Q0 -4 54 22" fill="none" stroke="#FF7AB6" strokeWidth={8} />
        </g>
      ) : null}
    </g>
  );
};

/** Bust at the seat origin; head centre at (0, -230). */
export const Bust: React.FC<{ s: Spec; f: number; seed: string; bob?: number; danceArms?: [number, number, number, number] }> = ({ s, f, seed, bob = 0, danceArms }) => {
  const hy = -230 - bob * 14;
  const sway = Math.sin(f / 4 + wob(seed, 2) * 3) * 4;
  if (s.headOnly) {
    const bounce = -Math.abs(Math.sin(f / 3.4)) * 34 - bob * 24;
    return (
      <g transform={`translate(${sway} ${-210 + bounce}) rotate(${Math.sin(f / 3.4) * 12}) scale(1.3)`}>
        <circle r={120} fill="#C9B9FF" opacity={0.25} />
        <Head s={s} f={f} seed={seed} />
      </g>
    );
  }
  const arm = (x0: number, y0: number, x1: number, y1: number, bend: number, key: string) => {
    const mx = (x0 + x1) / 2 + bend;
    const my = (y0 + y1) / 2 + Math.abs(bend) * 0.4;
    return (
      <g key={key}>
        <path d={`M${x0} ${y0} Q${mx} ${my} ${x1} ${y1}`} fill="none" stroke={INK} strokeWidth={40} strokeLinecap="round" />
        <path d={`M${x0} ${y0} Q${mx} ${my} ${x1} ${y1}`} fill="none" stroke={s.outfit} strokeWidth={30} strokeLinecap="round" />
        <circle cx={x1} cy={y1} r={20} fill={s.skin} stroke={INK} strokeWidth={5} />
      </g>
    );
  };
  const arms = () => {
    switch (s.arms) {
      case "drive":
        return [arm(-62, -110, 40 + sway, -40, -30, "a"), arm(62, -110, 110 + sway, -50, 20, "b")];
      case "wide": {
        const w = Math.sin(f / 3) * 8;
        return [arm(-62, -110, -190, -300 + w, -40, "a"), arm(62, -110, 190, -300 - w, 40, "b")];
      }
      case "notes": {
        const fan = Math.sin(f / 1.6) * 20;
        return [
          arm(-62, -110, -140, -230 + fan, -30, "a"),
          arm(62, -110, 150, -240 - fan, 30, "b"),
          <g key="n1" transform={`translate(-150 ${-250 + fan}) rotate(${-30 + fan})`}>
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={-16} y={-70} width={32} height={70} rx={4} fill="#8FD18A" stroke="#245A22" strokeWidth={3} transform={`rotate(${(i - 2) * 16})`} />
            ))}
          </g>,
          <g key="n2" transform={`translate(160 ${-260 - fan}) rotate(${30 - fan})`}>
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={-16} y={-70} width={32} height={70} rx={4} fill="#F2A7C8" stroke="#7A2A50" strokeWidth={3} transform={`rotate(${(i - 2) * 16})`} />
            ))}
          </g>,
        ];
      }
      case "selfie":
        return [
          arm(-62, -110, 30, -40, -30, "a"),
          arm(62, -110, 170, -330, 30, "b"),
          <g key="ph" transform="translate(176 -380) rotate(12)">
            <rect x={-26} y={-46} width={52} height={92} rx={10} fill="#141420" stroke={INK} strokeWidth={4} />
            <rect x={-20} y={-38} width={40} height={74} rx={6} fill="#FFB3D9" />
          </g>,
        ];
      case "tablet":
        return [
          arm(-62, -110, -40, -80, -30, "a"),
          arm(62, -110, 50, -86, 30, "b"),
          <g key="tb" transform="translate(0 -96) rotate(-6)">
            <rect x={-70} y={-50} width={140} height={96} rx={10} fill="#141420" stroke={INK} strokeWidth={5} />
            <rect x={-62} y={-42} width={124} height={80} rx={6} fill="#0E1A12" />
            <path d="M-50 20 C-20 -20 10 30 50 -24" fill="none" stroke="#F2C14E" strokeWidth={5} strokeDasharray="8 6" />
            <circle cx={50} cy={-24} r={7} fill="#E8283C" />
          </g>,
        ];
      case "flag": {
        const wv = (k: number) => Math.sin(f / 2 + k) * 18;
        return [
          arm(-62, -110, 40 + sway, -40, -30, "a"),
          arm(62, -110, 150, -300, 30, "b"),
          <g key="fl" transform="translate(150 -300)">
            <path d="M0 0 L0 -260" stroke="#3A2A1A" strokeWidth={10} strokeLinecap="round" />
            <path d={`M0 -260 C60 ${-270 + wv(0)} 120 ${-240 + wv(1)} 190 ${-256 + wv(2)} C170 ${-210 + wv(3)} 160 ${-190 + wv(2)} 196 ${-160 + wv(1)} C120 ${-160 + wv(0)} 60 ${-190 + wv(3)} 0 -170Z`} fill="#3A3346" stroke={INK} strokeWidth={5} />
            <image href={staticFile("jyotiq/logo-icon.png")} x={50} y={-252} width={92} height={76} />
          </g>,
        ];
      }
      default:
        return [];
    }
  };
  const armsList = danceArms
    ? [arm(-62, -110, danceArms[0], danceArms[1], danceArms[0] < -62 ? -40 : 30, "a"), arm(62, -110, danceArms[2], danceArms[3], danceArms[2] > 62 ? 40 : -30, "b")]
    : arms();
  return (
    <g transform={`translate(${sway * 0.5} 0)`}>
      {/* torso */}
      <path d="M-86 0 C-96 -70 -90 -130 -62 -150 C-30 -166 30 -166 62 -150 C90 -130 96 -70 86 0Z" fill={s.outfit} stroke={INK} strokeWidth={6} />
      <path d="M-86 0 C-96 -70 -90 -130 -62 -150 C-70 -100 -72 -40 -64 0Z" fill={s.outfitD} />
      <path d="M-40 -158 Q0 -110 40 -158" fill="none" stroke={s.trim} strokeWidth={10} />
      {/* neck */}
      {s.headless ? (
        <g>
          <ellipse cx={0} cy={-160} rx={30} ry={12} fill="#2A2232" stroke={INK} strokeWidth={5} />
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${-14 + i * 14} -164 C${-30 + i * 20 + Math.sin(f / 2 + i) * 16} -220 ${-10 + i * 10} -260 ${-30 + i * 24 + Math.sin(f / 3 + i) * 20} -320`} fill="none" stroke="#B4A2DE" strokeWidth={14 - i * 3} strokeLinecap="round" opacity={0.55} />
          ))}
        </g>
      ) : (
        <>
          <path d="M-22 -150 L-24 -128 L24 -128 L22 -150Z" fill={s.shade} />
          <g transform={`translate(0 ${hy}) rotate(${sway * 0.8})`}>
            <Head s={s} f={f} seed={seed} />
          </g>
        </>
      )}
      {armsList}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Cars (side view, facing right, origin = ground centre)              */
/* ------------------------------------------------------------------ */

type CarKind = "jeep" | "vintage" | "muscle" | "thar";
const CAR: Record<CarKind, { body: string; dark: string; trim: string; wheel: number; seats: [number, number] }> = {
  jeep: { body: "#D9442B", dark: "#9E2A16", trim: "#F2C14E", wheel: 92, seats: [130, -150] },
  vintage: { body: "#F4CF5A", dark: "#C99A22", trim: "#FFFFFF", wheel: 84, seats: [150, -150] },
  muscle: { body: "#C0122A", dark: "#7A0818", trim: "#111111", wheel: 90, seats: [90, -130] },
  thar: { body: "#1C1A26", dark: "#0C0B12", trim: "#B4A2DE", wheel: 98, seats: [130, -150] },
};

const CarWheel: React.FC<{ x: number; r: number; spin: number; white?: boolean }> = ({ x, r, spin, white }) => (
  <g transform={`translate(${x} ${-r})`}>
    <circle r={r} fill="#0C0B12" stroke={INK} strokeWidth={6} />
    {white ? <circle r={r * 0.72} fill="none" stroke="#F7F3E8" strokeWidth={12} /> : null}
    <circle r={r * 0.55} fill="url(#g-chrome)" stroke={INK} strokeWidth={5} />
    <g transform={`rotate(${spin})`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M0 0 L${r * 0.5} -8 L${r * 0.5} 8Z`} transform={`rotate(${i * 72})`} fill="#5A6078" opacity={0.85} />
      ))}
    </g>
    <circle r={r * 0.16} fill="#2A2A3A" />
    <path d={`M${-r * 0.8} ${-r * 0.4} A${r * 0.9} ${r * 0.9} 0 0 1 ${-r * 0.2} ${-r * 0.86}`} fill="none" stroke="#6A6A8A" strokeWidth={5} opacity={0.7} />
  </g>
);

const JqDecal: React.FC<{ x: number; y: number; s?: number; dark?: boolean }> = ({ x, y, s = 1, dark }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <text x={0} y={0} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={58} letterSpacing={4} fill="url(#g-jq)" stroke={dark ? "#FFFFFF" : INK} strokeWidth={dark ? 2 : 3}>
      JYOTIQ
    </text>
    <path d={starPath(118, -40, 16, 6, 5)} fill="#F0B848" stroke={INK} strokeWidth={2} />
  </g>
);

export const Car: React.FC<{ kind: CarKind; f: number; children?: React.ReactNode; front?: React.ReactNode }> = ({ kind, f, children, front }) => {
  const c = CAR[kind];
  const spin = f * 36;
  const r = c.wheel;
  const body = () => {
    switch (kind) {
      case "jeep":
        return (
          <>
            <path d="M-420 -110 L-420 -260 L-260 -270 L330 -270 L420 -226 L430 -110 Z" fill={c.body} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
            <path d="M-420 -150 L430 -150" stroke={c.dark} strokeWidth={26} />
            <path d="M-420 -196 L430 -196" stroke={c.trim} strokeWidth={10} />
            <path d="M-300 -270 L-280 -470 L-240 -470 L-260 -270" fill={c.dark} stroke={INK} strokeWidth={5} />
            <path d="M-280 -470 L-60 -470" stroke={c.dark} strokeWidth={22} strokeLinecap="round" />
            <path d="M210 -270 L250 -420 L270 -420 L240 -270" fill="#B7E6FF" opacity={0.6} stroke={INK} strokeWidth={5} />
            <circle cx={-450} cy={-230} r={70} fill="#0C0B12" stroke={INK} strokeWidth={6} />
            <circle cx={-450} cy={-230} r={34} fill="url(#g-chrome)" />
          </>
        );
      case "vintage":
        return (
          <>
            <path d="M-440 -120 C-450 -200 -400 -240 -320 -244 L-120 -250 C-60 -300 120 -300 200 -250 L340 -240 C420 -236 450 -190 446 -120 Z" fill={c.body} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
            <path d="M-430 -160 C-200 -176 200 -176 440 -160" fill="none" stroke={c.trim} strokeWidth={10} />
            <path d="M-450 -116 L-480 -116 L-480 -96 L-440 -96Z M446 -116 L480 -116 L480 -96 L440 -96Z" fill="url(#g-chrome)" stroke={INK} strokeWidth={4} />
            <path d="M160 -252 L200 -360 L216 -360 L186 -252" fill="#B7E6FF" opacity={0.6} stroke={INK} strokeWidth={5} />
          </>
        );
      case "muscle":
        return (
          <>
            <path d="M-430 -110 L-420 -210 L-300 -232 L-120 -236 C-40 -300 120 -300 170 -240 L420 -206 L440 -110 Z" fill={c.body} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
            <path d="M-420 -200 L440 -190" stroke="#111" strokeWidth={22} />
            <path d="M-410 -150 C-300 -170 -250 -120 -170 -150 C-120 -170 -80 -140 -40 -150" fill="none" stroke="#FFB02E" strokeWidth={14} strokeLinecap="round" />
            <path d="M-440 -230 L-470 -280 L-380 -280 L-360 -232Z" fill="#111" stroke={INK} strokeWidth={5} />
            <path d="M-110 -238 C-40 -290 110 -292 160 -242Z" fill="#B7E6FF" opacity={0.55} stroke={INK} strokeWidth={5} />
          </>
        );
      case "thar":
      default:
        return (
          <>
            <path d="M-420 -110 L-424 -280 L330 -280 L420 -236 L430 -110 Z" fill={c.body} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
            <path d="M-424 -210 L430 -210" stroke={c.trim} strokeWidth={8} />
            <path d="M-360 -280 L-340 -500 L260 -500 L300 -280" fill="none" stroke="#2A2638" strokeWidth={18} strokeLinejoin="round" />
            <path d="M-120 -500 L-120 -280" stroke="#2A2638" strokeWidth={14} />
            <path d="M260 -280 L290 -420" stroke="#B7E6FF" strokeWidth={6} opacity={0.6} />
            {/* smoke trail */}
            {[0, 1, 2, 3].map((i) => {
              const age = (f * 0.8 + i * 6) % 24;
              return <circle key={i} cx={-460 - age * 22} cy={-150 - age * 4} r={30 + age * 4} fill="#7E6AA8" opacity={0.4 * (1 - age / 24)} />;
            })}
          </>
        );
    }
  };
  return (
    <g>
      <ellipse cx={0} cy={0} rx={480} ry={26} fill="#000" opacity={0.45} />
      {children /* seated characters sit behind the door line */}
      {body()}
      {/* headlight + tail light */}
      <ellipse cx={kind === "vintage" ? 430 : 418} cy={-188} rx={18} ry={26} fill="#FFF6D6" stroke={INK} strokeWidth={4} />
      <rect x={-432} y={-200} width={16} height={34} rx={4} fill="#FF4A4A" stroke={INK} strokeWidth={3} />
      <JqDecal x={-60} y={kind === "muscle" ? -112 : -116} s={kind === "vintage" ? 0.9 : 1} dark={kind === "thar"} />
      <CarWheel x={-270} r={r} spin={spin} white={kind === "vintage"} />
      <CarWheel x={280} r={r} spin={spin} white={kind === "vintage"} />
      {front}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* Graha Expressway                                                    */
/* ------------------------------------------------------------------ */

const Highway: React.FC<{ f: number; ground: number; speed: number; billboard?: boolean; gantry?: number }> = ({ f, ground, speed, billboard = true, gantry = -1 }) => {
  const off = (f * speed) % 300;
  const bbX = 1300 - ((f - SC.carA) * 14) % 2200;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #1A0B3D 0%, #3A1468 30%, #8A2A82 56%, #F0607A 74%, #FFB061 86%, #3A1A40 100%)" }} />
      <StarDust f={f} count={90} opacity={0.75} seed="hw" />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {/* floating planets */}
        <g transform={`translate(${170 + Math.sin(f / 40) * 10} 520)`}>
          <circle r={90} fill="#E9C28A" />
          {[-50, -20, 10, 40].map((y, i) => (
            <path key={i} d={`M${-Math.sqrt(8100 - y * y)} ${y} L${Math.sqrt(8100 - y * y)} ${y}`} stroke={i % 2 ? "#C98A56" : "#F6DEB2"} strokeWidth={14} />
          ))}
          <ellipse cx={-30} cy={30} rx={18} ry={10} fill="#B5562E" />
        </g>
        <circle cx={900} cy={760} r={46} fill="#E8583A" />
        <circle cx={884} cy={748} r={46} fill="#FF8A62" opacity={0.5} />
        <circle cx={760} cy={380} r={34} fill="#F3F0FF" />
        {/* temple city */}
        {new Array(9).fill(0).map((_, i) => {
          const x = ((i * 170 - f * 4) % 1530) + (i * 170 - f * 4 < 0 ? 1530 : 0) - 200;
          const h = 160 + ((i * 97) % 140);
          return <path key={i} d={`M${x} ${ground - 300} l0 ${-h * 0.5} l40 ${-h * 0.2} l30 ${-h * 0.3} l30 ${h * 0.3} l40 ${h * 0.2} l0 ${h * 0.5}Z`} fill="#3A1446" opacity={0.85} />;
        })}
      </svg>
      {/* billboard */}
      {billboard ? (
        <div style={{ position: "absolute", left: bbX, top: ground - 760, width: 560, height: 300 }}>
          <div style={{ position: "absolute", left: 270, top: 290, width: 20, height: 330, background: "#1A0E24" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: "linear-gradient(160deg, #1A140C, #0C0A07)", border: "8px solid #F2C14E", boxShadow: "0 0 40px rgba(242,193,78,0.6)", display: "flex", alignItems: "center", gap: 18, padding: "0 26px", boxSizing: "border-box" }}>
            <Img src={staticFile("jyotiq/logo-full.png")} style={{ width: 170, height: 196 }} />
            <div style={{ fontFamily: SANS, color: "#F5ECDD", fontWeight: 800, fontSize: 40, lineHeight: 1.15 }}>
              Kundli ka
              <br />
              <span style={{ color: "#F2C14E" }}>GPS</span> 🔥
              <div style={{ fontSize: 26, color: "#C9B78A", marginTop: 8 }}>Pehla sawaal FREE</div>
            </div>
          </div>
        </div>
      ) : null}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="hw-road" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3A2A4A" />
            <stop offset="1" stopColor="#120A1A" />
          </linearGradient>
        </defs>
        {/* guard rail */}
        <rect x={-20} y={ground - 150} width={1120} height={20} fill="#C9B9FF" opacity={0.7} />
        {new Array(8).fill(0).map((_, i) => (
          <rect key={i} x={((i * 160 - f * speed * 0.8) % 1280) + (i * 160 - f * speed * 0.8 < 0 ? 1280 : 0) - 100} y={ground - 150} width={14} height={90} fill="#8A7AB8" />
        ))}
        <rect x={-20} y={ground - 70} width={1120} height={1920 - ground + 90} fill="url(#hw-road)" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={i * 300 - off - 150} y={ground + 70} width={170} height={14} rx={7} fill="#F2C14E" />
        ))}
        <g filter="url(#f-blurx)">
          {new Array(12).fill(0).map((_, i) => (
            <rect key={i} x={((i * 211 - f * speed * 1.3) % 1300) + (i * 211 - f * speed * 1.3 < 0 ? 1300 : 0) - 120} y={ground - 40 + ((i * 61) % 260)} width={90} height={4} fill="#FFFFFF" opacity={0.25} />
          ))}
        </g>
      </svg>
      {/* overhead gantry */}
      {gantry >= 0 ? (
        <div style={{ position: "absolute", left: 1080 - gantry, top: ground - 760, width: 900 }}>
          <div style={{ position: "absolute", left: 0, top: 120, width: 24, height: 880, background: "#24183A" }} />
          <div style={{ position: "absolute", left: 860, top: 120, width: 24, height: 880, background: "#24183A" }} />
          <div style={{ position: "absolute", left: 0, top: 0, width: 884, height: 150, borderRadius: 12, background: "#0D5A3A", border: "6px solid #FFFFFF", display: "flex", alignItems: "center", gap: 20, padding: "0 22px", boxSizing: "border-box", boxShadow: "0 12px 30px rgba(0,0,0,0.5)" }}>
            <Img src={staticFile("jyotiq/logo-icon.png")} style={{ width: 120, height: 99 }} />
            <div style={{ fontFamily: SANS, fontWeight: 800, color: "#FFFFFF", fontSize: 46, lineHeight: 1.05 }}>
              GRAHA EXPRESSWAY
              <div style={{ fontSize: 30, color: "#FFE9A3" }}>Kundli Junction · via JYOTIQ ➜</div>
            </div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Kundli launch (phone)                                              */
/* ------------------------------------------------------------------ */

const KundaliScreen: React.FC<{ f: number; lift: number }> = ({ f, lift }) => (
  <AbsoluteFill style={{ background: "#15120E", fontFamily: SANS }}>
    <StatusBar time="11:59" />
    <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: CORMORANT, fontWeight: 700, fontSize: 56, color: "#EADBB4" }}>My Kundali</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center", fontFamily: DEVA, fontSize: 30, color: "#9B9384" }}>जन्म कुंडली · D1</div>
    <div style={{ position: "absolute", left: 62, top: 290 }}>
      <KundliChart size={600} draw={1} glyphs={1} hide={["sa"]} hot={["su", "mo", "ma", "me", "ju", "ve", "ra", "ke"]} pulse={0.5 + 0.5 * Math.sin(f / 1.4)} lift={() => Math.min(1.2, lift * 1.6)} />
    </div>
    <div style={{ position: "absolute", left: 40, right: 40, top: 950, padding: "18px 24px", borderRadius: 20, border: "3px solid #6FA8FF", color: "#BFD7FF", fontSize: 34, fontWeight: 800, background: "rgba(111,168,255,0.12)", textAlign: "center" }}>
      🪐 Sa · house 1 — <span style={{ color: "#F2C14E" }}>out on a ride 🏍️</span>
    </div>
    <div style={{ position: "absolute", left: 40, right: 40, top: 1070, textAlign: "center", color: "#8D8676", fontSize: 30, fontWeight: 700 }}>Tap a graha to see what it’s up to</div>
    <SysNav top={1490} bg="#000" />
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* Shots                                                               */
/* ------------------------------------------------------------------ */

const carShot = (f: number, at: number, ground = 1420) => {
  const enter = ramp(f, at, at + 8, "out");
  return { x: 540 - (1 - enter) * 700, ground, enter };
};

const Seat: React.FC<{ x: number; y: number; children: React.ReactNode }> = ({ x, y, children }) => <g transform={`translate(${x} ${y})`}>{children}</g>;

const bobAt = (f: number, from: number) => kickPulse(f, from, from + 200, 9);

export const S3Convoy: React.FC<{ f: number }> = ({ f }) => {
  /* Launch: the kundli on the phone, grahas jump out */
  if (f < SC.carA) {
    const lift = ramp(f, SC.kundli + 6, SC.carA, "in");
    const push = ramp(f, SC.kundli, SC.carA, "in");
    return (
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 46%, #3A2608 0%, #0C0A07 70%)", overflow: "hidden" }}>
        <FocusLines f={f} cx={540} cy={1000} rx={480} ry={720} color="#F2C14E" opacity={0.25 + 0.4 * push} count={90} seed="kl" />
        <div style={{ position: "absolute", inset: 0, transform: `translateY(-300px) scale(${1.16 + 0.5 * push})`, transformOrigin: "540px 1150px" }}>
          <PhoneFrame>
            <KundaliScreen f={f} lift={lift} />
          </PhoneFrame>
        </div>
        <Slam f={f} at={SC.kundli} dur={SC.carA - SC.kundli + 2} text="SHOOTER" size={118} y={270} fill="#FFE27A" stroke="#1B1026" rot={-6} />
        <Slam f={f} at={SC.kundli + 4} dur={SC.carA - SC.kundli - 2} text="GAADI 🔥" size={118} y={420} fill="#FFFFFF" stroke="#1B1026" rot={-6} sub="…aur baaki grah bhi" subColor="#F2C14E" />
        {f > SC.carA - 4 ? <AbsoluteFill style={{ background: "#FFFFFF", opacity: 0.65 * ramp(f, SC.carA - 4, SC.carA) }} /> : null}
      </AbsoluteFill>
    );
  }

  const kp = kickPulse(f, SC.carA, SC.end, 7);
  const sh = shake(f, kp * 0.35, "s3");
  let content: React.ReactNode = null;
  let tags: React.ReactNode = null;
  let extra: React.ReactNode = null;

  if (f < SC.carC) {
    const { x, ground } = carShot(f, SC.carA);
    const bob = bobAt(f, SC.carA);
    content = (
      <g transform={`translate(${x} ${ground + Math.sin(f / 2.2) * 4})`}>
        <Car kind="jeep" f={f}>
          <Seat x={CAR.jeep.seats[0]} y={-170}>
            <Bust s={CAST.surya} f={f} seed="su" bob={bob} />
          </Seat>
          <Seat x={CAR.jeep.seats[1]} y={-250}>
            <Bust s={CAST.chandra} f={f} seed="mo" bob={bob * 0.6} />
          </Seat>
        </Car>
      </g>
    );
    tags = (
      <>
        <NameTag f={f} at={SC.carA + 6} x={720} y={560} name="SURYA" tag="☀️ Boss mode ON" color="#FFB02E" />
        <NameTag f={f} at={SC.carA + 14} x={330} y={420} name="CHANDRA" tag="🌙 Mood swings" color="#C9D6FF" />
      </>
    );
    extra = (
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {new Array(10).fill(0).map((_, i) => {
          const t = ((f - SC.carA) * 0.06 + i * 0.1) % 1;
          return <path key={i} d={starPath(390 - t * 500 + i * 30, 900 - t * 200 - (i % 3) * 60, 16, 6, 4)} fill="#FFF7C8" opacity={1 - t} />;
        })}
      </svg>
    );
  } else if (f < SC.carB) {
    const { x, ground } = carShot(f, SC.carC);
    const bob = bobAt(f, SC.carC);
    content = (
      <g transform={`translate(${x} ${ground + Math.sin(f / 2.4) * 3})`}>
        <Car kind="vintage" f={f}>
          <Seat x={CAR.vintage.seats[0]} y={-170}>
            <Bust s={CAST.shukra} f={f} seed="ve" bob={bob} />
          </Seat>
          <Seat x={CAR.vintage.seats[1]} y={-190}>
            <Bust s={CAST.guru} f={f} seed="ju" bob={bob} />
          </Seat>
        </Car>
      </g>
    );
    tags = (
      <>
        <NameTag f={f} at={SC.carC + 4} x={330} y={470} name="GURU" tag="💸 Paisa hi paisa" color="#FFD45A" />
        <NameTag f={f} at={SC.carC + 12} x={740} y={560} name="SHUKRA" tag="✨ Main character" color="#FF9ACB" />
      </>
    );
    extra = (
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {new Array(18).fill(0).map((_, i) => {
          const t = ((f - SC.carC) * 0.045 + i / 18) % 1;
          const x0 = 380 - t * 520 + Math.sin(i * 2.1) * 60;
          const y0 = 1000 - t * 480 + Math.sin(f / 3 + i) * 30 + (i % 4) * 40;
          return <rect key={i} x={x0} y={y0} width={58} height={30} rx={4} fill={i % 2 ? "#8FD18A" : "#F2A7C8"} stroke={INK} strokeWidth={3} transform={`rotate(${f * 9 + i * 40} ${x0 + 29} ${y0 + 15})`} opacity={t < 0.05 ? t * 20 : 1} />;
        })}
      </svg>
    );
  } else if (f < SC.carD) {
    const { x, ground } = carShot(f, SC.carB);
    const bob = bobAt(f, SC.carB);
    const jump = track(f, [
      [408, 0],
      [416, 1, "out"],
      [424, 0.9, "io"],
      [428, 0, "in"],
    ]);
    content = (
      <g transform={`translate(${x} ${ground - jump * 260}) rotate(${-9 * jump})`}>
        <Car kind="muscle" f={f}>
          <Seat x={CAR.muscle.seats[0]} y={-150}>
            <Bust s={CAST.mangal} f={f} seed="ma" bob={bob + jump} />
          </Seat>
          <Seat x={CAR.muscle.seats[1]} y={-150}>
            <Bust s={CAST.budh} f={f} seed="me" bob={bob + jump * 1.4} />
          </Seat>
        </Car>
      </g>
    );
    tags = (
      <>
        <NameTag f={f} at={SC.carB + 4} x={720} y={560} name="MANGAL" tag="🔥 Stunt master" color="#FF7A6A" />
        <NameTag f={f} at={SC.carB + 12} x={330} y={470} name="BUDH" tag="🧠 GPS on" color="#7EF0A8" />
      </>
    );
    extra = (
      <>
        <FocusLines f={f} cx={540} cy={1200} rx={500} ry={560} color="#FFFFFF" opacity={0.45 * jump} count={80} seed="jp" />
        <Shockwave f={f} at={428} x={540} y={1420} size={1.1} color="#FFD45A" />
      </>
    );
  } else if (f < SC.squad) {
    const { x, ground } = carShot(f, SC.carD);
    const bob = bobAt(f, SC.carD);
    content = (
      <g transform={`translate(${x} ${ground + Math.sin(f / 2) * 4})`}>
        <Car kind="thar" f={f}>
          <Seat x={CAR.thar.seats[0]} y={-170}>
            <Bust s={CAST.ketu} f={f} seed="ke" bob={bob} />
          </Seat>
          <Seat x={CAR.thar.seats[1]} y={-150}>
            <Bust s={CAST.rahu} f={f} seed="ra" bob={bob} />
          </Seat>
        </Car>
      </g>
    );
    tags = (
      <>
        <NameTag f={f} at={SC.carD + 4} x={300} y={560} name="RAHU" tag="🙂 Sirf sir" color="#B4A2DE" />
        <NameTag f={f} at={SC.carD + 12} x={720} y={480} name="KETU" tag="🕺 Sirf dhad" color="#C9B9A6" />
      </>
    );
  } else {
    /* Squad: everyone on the expressway, gantry overhead */
    const g = (f - SC.squad) * 30;
    const enter = ramp(f, SC.squad, SC.squad + 10, "out");
    const bobAll = bobAt(f, SC.squad);
    const pose = ramp(f, 494, 499, "back");
    const lane = (kind: CarKind, a: Spec, ak: string, b: Spec, bk: string, x: number, y: number, sc: number, ph: number) => (
      <g transform={`translate(${x + (1 - enter) * -600} ${y + Math.sin(f / 2.3 + ph) * 3}) scale(${sc})`}>
        <Car kind={kind} f={f}>
          <Seat x={CAR[kind].seats[0]} y={kind === "muscle" ? -150 : -170}>
            <Bust s={a} f={f} seed={ak} bob={bobAll + pose} />
          </Seat>
          <Seat x={CAR[kind].seats[1]} y={kind === "jeep" ? -250 : -160}>
            <Bust s={b} f={f} seed={bk} bob={bobAll + pose} />
          </Seat>
        </Car>
      </g>
    );
    content = (
      <>
        {lane("jeep", CAST.surya, "su", CAST.chandra, "mo", 270, 1090, 0.42, 0)}
        {lane("vintage", CAST.shukra, "ve", CAST.guru, "ju", 800, 1110, 0.42, 1)}
        {lane("thar", CAST.ketu, "ke", CAST.rahu, "ra", 260, 1370, 0.5, 2)}
        {lane("muscle", CAST.mangal, "ma", CAST.budh, "me", 820, 1390, 0.5, 3)}
        {/* Shani leads the convoy on his Bullet */}
        <g transform={`translate(${600 + (1 - enter) * 700} ${1660 + Math.sin(f / 2.9) * 3}) scale(0.52)`}>
          <ellipse cx={0} cy={-4} rx={520} ry={34} fill="#000" opacity={0.5} />
          <Bullet f={f} flame={1.2 + 0.5 * bobAll} />
          <Shani f={f} twirl={pose} curl={1} glint={hit(f, 494, 10)} flex={pose * 0.6} />
          <Crow f={f} caw={hit(f, 494, 8)} />
        </g>
      </>
    );
    extra = (
      <>
        <Shockwave f={f} at={494} x={600} y={1500} size={0.55} color="#FFFFFF" dur={10} />
        {hit(f, 494, 6) > 0 ? <AbsoluteFill style={{ background: "#FFFFFF", opacity: hit(f, 494, 6) * 0.4 }} /> : null}
      </>
    );
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, transform: `translate(${sh.x}px, ${sh.y}px) scale(${1.02 + 0.03 * pose})`, transformOrigin: "540px 1200px" }}>
          <Highway f={f} ground={1100} speed={40} billboard={false} gantry={Math.min(980, g + 200)} />
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {content}
          </svg>
        </div>
        <SpeedLines f={f} angle={180} count={30} color="#FFFFFF" opacity={0.22} speed={-110} seed="sq" />
        {extra}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${sh.x}px, ${sh.y}px) rotate(${sh.r}deg) scale(1.12)`, transformOrigin: "540px 1330px" }}>
        <Highway f={f} ground={1420} speed={52} billboard={f < SC.carC} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {content}
        </svg>
        {extra}
      </div>
      <SpeedLines f={f} angle={180} count={30} color="#FFFFFF" opacity={0.25} speed={-110} seed="cv" />
      {tags}
      {KICKS.filter((k) => k >= SC.carA && k < SC.squad).map((k) => (hit(f, k, 4) > 0 ? <AbsoluteFill key={k} style={{ background: "#FFFFFF", opacity: hit(f, k, 4) * 0.12 }} /> : null))}
    </AbsoluteFill>
  );
};
