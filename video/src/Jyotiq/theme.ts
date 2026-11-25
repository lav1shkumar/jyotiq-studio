import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";
import { createContext, useContext } from "react";
import { z } from "zod";

// Jyotiq's own type pairing (read from jyotiq.astroraag.com's stylesheet):
// Playfair Display for headings, Plus Jakarta Sans for UI/body.
const playfair = loadPlayfair("normal", {
  weights: ["500", "600", "700", "800"],
  subsets: ["latin"],
});
const jakarta = loadJakarta("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});
loadJakarta("italic", { weights: ["400"], subsets: ["latin"] });

export const SERIF = playfair.fontFamily;
export const SANS = jakarta.fontFamily;

export const W = 1920;
export const H = 1080;
export const FPS = 30;
export const TOTAL = 991; // 33.03 s, same as the reference + its audio track

// Beat boundaries in frames. Cuts sit on the reference's audio hits so the
// reused track lands exactly as it did in the Luffy video.
export const BEATS = {
  hook: [0, 90],
  entry: [90, 198],
  ask: [198, 318],
  progress: [318, 465],
  tour: [465, 630],
  aha: [630, 760],
  star: [760, 870],
  end: [870, 991],
} as const;

export const paletteIds = ["midnight", "indigo", "dawn", "neon"] as const;
export type PaletteId = (typeof paletteIds)[number];

export type Palette = {
  id: PaletteId;
  name: string;
  note: string;
  dark: boolean;
  bg: string;
  glow: string;
  vignette: string;
  dust: string;
  surface: string;
  surface2: string;
  border: string;
  gold: string; // accent for headings, borders, kinetic words
  goldSoft: string; // pale highlight
  ctaFrom: string;
  ctaTo: string;
  onCta: string;
  ribbon: [string, string, string, string];
  text: string;
  muted: string;
  faint: string;
  star: string;
  shadow: string;
};

export const PALETTES: Record<PaletteId, Palette> = {
  // 1. Exactly the Jyotiq app's dark theme (#0C0A07 bg, brand-gold #DFB15B,
  //    gold -> amber CTA). Recommended.
  midnight: {
    id: "midnight",
    name: "Midnight Diya",
    note: "Jyotiq app dark theme",
    dark: true,
    bg: "#0C0A07",
    glow: "rgba(223,177,91,0.17)",
    vignette: "rgba(0,0,0,0.65)",
    dust: "#F3DB9D",
    surface: "#13110D",
    surface2: "#1A160F",
    border: "#3A2C1B",
    gold: "#DFB15B",
    goldSoft: "#F3DB9D",
    ctaFrom: "#DFB15B",
    ctaTo: "#FE9A00",
    onCta: "#1A1206",
    ribbon: ["#A87232", "#C9862E", "#DFB15B", "#F3DB9D"],
    text: "#F5ECDD",
    muted: "#A08F74",
    faint: "#4A3F2E",
    star: "#F5B93A",
    shadow: "rgba(0,0,0,0.6)",
  },
  // 2. Night sky: AstroRaaga's purple banner + saffron gold.
  indigo: {
    id: "indigo",
    name: "Cosmic Indigo",
    note: "AstroRaaga purple + saffron",
    dark: true,
    bg: "#0E0920",
    glow: "rgba(124,77,255,0.24)",
    vignette: "rgba(4,2,12,0.7)",
    dust: "#E9DDFF",
    surface: "#170F31",
    surface2: "#1F163F",
    border: "#36295E",
    gold: "#F5B942",
    goldSoft: "#FFE2A3",
    ctaFrom: "#F5B942",
    ctaTo: "#F97316",
    onCta: "#1B1030",
    ribbon: ["#E8770F", "#F28A1E", "#F5B942", "#FFE2A3"],
    text: "#F3EEFF",
    muted: "#A397C7",
    faint: "#3D3360",
    star: "#F5B942",
    shadow: "rgba(3,1,10,0.65)",
  },
  // 3. Light: Jyotiq's own light theme (#FBF7F0 + bronze #A87232). Closest to
  //    the reference video's off-white look.
  dawn: {
    id: "dawn",
    name: "Temple Dawn",
    note: "Jyotiq light theme",
    dark: false,
    bg: "#FBF7F0",
    glow: "rgba(223,177,91,0.20)",
    vignette: "rgba(168,114,50,0.10)",
    dust: "#DFB15B",
    surface: "#FFFFFF",
    surface2: "#FDFAF5",
    border: "#EAD9BC",
    gold: "#A87232",
    goldSoft: "#DFB15B",
    ctaFrom: "#DFB15B",
    ctaTo: "#FE9A00",
    onCta: "#2A1606",
    ribbon: ["#B8741F", "#D08A26", "#E9A93F", "#F6D58E"],
    text: "#2A1E12",
    muted: "#8E7A62",
    faint: "#E3D6C2",
    star: "#E39A1E",
    shadow: "rgba(120,80,30,0.16)",
  },
  // 4. The logo's neon brain gradient (pink -> violet -> cyan) on black.
  neon: {
    id: "neon",
    name: "Neon Mystic",
    note: "Logo brain gradient",
    dark: true,
    bg: "#08060E",
    glow: "rgba(168,121,255,0.22)",
    vignette: "rgba(0,0,0,0.7)",
    dust: "#C9B6FF",
    surface: "#120E1C",
    surface2: "#191426",
    border: "#2E2542",
    gold: "#FF6FAE",
    goldSoft: "#C9A6FF",
    ctaFrom: "#FF4F9A",
    ctaTo: "#A879FF",
    onCta: "#FFFFFF",
    ribbon: ["#FF4F9A", "#D85FD0", "#A879FF", "#5EC8F5"],
    text: "#F2F0FA",
    muted: "#A59CBD",
    faint: "#3A3150",
    star: "#F5B93A",
    shadow: "rgba(0,0,0,0.65)",
  },
};

export const ThemeCtx = createContext<Palette>(PALETTES.midnight);
export const useTheme = (): Palette => useContext(ThemeCtx);

export const jyotiqSchema = z.object({
  palette: z.enum(paletteIds),
  withAudio: z.boolean(),
});
export type JyotiqProps = z.infer<typeof jyotiqSchema>;
