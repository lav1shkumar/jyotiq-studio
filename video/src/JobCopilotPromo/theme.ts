import { loadFont } from "@remotion/google-fonts/Inter";
import { z } from "zod";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const FONT = fontFamily;

export const C = {
  bg: "#0B0D12",
  surface: "#12151C",
  surface2: "#171B24",
  border: "#232838",
  text: "#E8EAF0",
  muted: "#8A93A6",
  indigo: "#6366F1",
  cyan: "#22D3EE",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
} as const;

export const GRADIENT = `linear-gradient(90deg, ${C.indigo}, ${C.cyan})`;

// Canvas: 4:5 portrait, fills the LinkedIn mobile feed.
export const W = 1080;
export const H = 1350;
export const FPS = 30;
export const TOTAL_FRAMES = 1800;

// Cross-fade length between scenes, in frames.
export const FADE = 10;

// Side margin for scene content. Scenes push in to 1.04x, which moves edges
// outward by ~22px, so 110px keeps everything >= 80px from the frame edge.
export const CONTENT_X = 110;
export const CONTENT_W = W - 2 * CONTENT_X;

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Owner-supplied facts. Anything left empty/null is omitted from the video
// rather than invented.
export const jobCopilotSchema = z.object({
  productName: z.string(),
  manualMinutes: z.number().nullable(),
  toolSeconds: z.number().nullable(),
});

export type JobCopilotProps = z.infer<typeof jobCopilotSchema>;

export const hasTimes = (p: JobCopilotProps): boolean =>
  p.manualMinutes !== null && p.toolSeconds !== null;
