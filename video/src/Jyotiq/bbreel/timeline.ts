import { z } from "zod";
import { beatPulse } from "../reelKit";

/* Bigg Boss x Jyotiq promo Reel, 1080x1920 @ 30 fps.

   0-108     the fight hook (fight/FightHook.tsx, untouched) over the real clip audio
   108-1099  public/audio.m4a (the Jyotiq Reel track) from its first sample, so
             every cut below sits on one of its measured onsets (reference/ANALYSIS.md):
             0.12 1.77 2.26 3.58 4.07 7.65 9.90 11.93 12.44 13.98 17.21 19.28
             20.09 22.89 24.37 25.33 27.94 29.66 s  ->  reel frame = 108 + s * 30 */

export const FPS = 30;
export const HOOK = 108;
/** Reel frame where the music track starts. */
export const M0 = HOOK;
export const TOTAL = M0 + 991;

export const SC = {
  hook: [0, 108],
  stars: [108, 215], // constellations: "It's not them. / It's their stars."
  clash: [215, 338], // MANGAL vs SHANI beam clash, the diya splits it, kundali draws
  asks: [338, 466], // the house again: everyone's question chip
  ball: [466, 624], // the house collapses into a ball, rolls into JYOTIQ, brand line
  phone: [624, 868], // hand + phone: Play Store install, open, type, send
  pitch: [868, 998], // "What does his kundali say?" / "Ask Jyotiq everything..."
  cta: [998, TOTAL], // end card
} as const;
export type SceneId = keyof typeof SC;
export const seqOf = (k: SceneId) => ({ from: SC[k][0], durationInFrames: SC[k][1] - SC[k][0] });

/** Kick envelope of the music at a REEL frame. */
export const kick = (f: number, decay = 5) => beatPulse(f - M0, decay);

/* Cue sheet, read by scripts/bbreel_audio.py as JSON (keep keys quoted, no
   trailing commas). All values are REEL frames. */
// CUES-JSON-BEGIN
export const CUES = {
  "freeze": 88,
  "dhum": [90, 96, 102],
  "impact": [[108, 0.45], [215, 0.85], [283, 0.6], [527, 1.0]],
  "whoosh": [[158, 0.25], [173, 0.3], [334, 0.45], [462, 0.6], [616, 0.5], [735, 0.35], [864, 0.45], [994, 0.35]],
  "beam": [230, 298],
  "absorb": 298,
  "chips": [352, 367, 383, 398, 413],
  "roll": [482, 527],
  "bounce": [482, 497, 511],
  "taps": [686, 732, 797, 839],
  "type": [800, 836, 52],
  "ding": 711,
  "shimmer": [[299, 0.8], [529, 1.1], [905, 0.6], [998, 1.0]],
  "burst": 946
};
// CUES-JSON-END

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */

export const bbReelSchema = z.object({
  /** Brand line opener (scene 5). */
  brandLine: z.array(z.string()),
  /** The question typed into the app (scene 6). */
  question: z.string(),
  /** Second half of the example, shown big over the kundali (scene 7). */
  kundaliLine: z.array(z.string()),
  showName: z.string(),
  userName: z.string(),
  cta: z.array(z.string()),
  /** "original" = the real clip audio under the hook, "synth" = the synthesized SFX bed. */
  hookAudio: z.enum(["original", "synth"]),
  withAudio: z.boolean(),
});
export type BBReelProps = z.infer<typeof bbReelSchema>;

export const BB_DEFAULTS: BBReelProps = {
  brandLine: [
    "Bigg Boss house",
    "clashes into Jyotiq",
    "to find out the real reason",
    "and kundali of everyone",
    "to get insight about",
    "the future.",
  ],
  question: "Will Nakul Dhull come back into the Bigg Boss house?",
  kundaliLine: ["What does his", "kundali say?"],
  showName: "Bigg Boss",
  userName: "Ayush",
  cta: ["Start your", "1st free question", "on Jyotiq app."],
  hookAudio: "original",
  withAudio: true,
};
