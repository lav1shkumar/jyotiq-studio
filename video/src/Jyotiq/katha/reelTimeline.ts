import { z } from "zod";

/* "The war that never happened": Jyotiq katha promo Reel, 1080x1920 @ 30 fps.
   Same look as JyotiqKathaTest (flat Indian miniature, cut-out puppets).
   No song and no background music: only synthesized sound effects
   (scripts/katha_audio.py reads CUES below). */

export const FPS = 30;

/** Scene table: [from, to) in reel frames. Retimed (v2) to fit the ElevenLabs
    voice takes; the silent v1 cut was hook 72 / court 258 / days 110 /
    peace 126 / today 120 / pocket 114 / app 135 / cta 130 = 1065 frames. */
export const SC = {
  hook: [0, 104], // general: "kal subah... hamla!", king: "ruko." + turns
  court: [104, 402], // whip pan, the question, the kundali, "Mangal kamzor hai... teen din rukiye, rajan"
  days: [402, 512], // 3-day time-lapse, messenger runs in (gasp)
  peace: [512, 694], // "hamare raja... shanti chahte hain!", crowd "maharaj ki jai!" x2, moral, roll-up
  today: [694, 830], // modern rooftop, Meera's three whispered questions
  pocket: [830, 982], // Jyotishi appears laughing, "chinta mat karo... ab main tumhare phone mein hoon"
  app: [982, 1102], // Jyotiq app: Meera whispers while typing, send, "Aligning the stars..."
  cta: [1102, 1402], // end card: Jyotishi + Meera voice the CTA, elements reveal on their words
} as const;
export type SceneId = keyof typeof SC;
export const TOTAL = SC.cta[1];
export const seqOf = (k: SceneId) => ({ from: SC[k][0], durationInFrames: SC[k][1] - SC[k][0] });

/* Choreography warps: [v1 local frame, v2 local frame] anchors, piecewise
   linear. Each scene keeps its v1 keyframes and reads them through
   `warp(...)`, so poses and moves are unchanged, only re-spaced around the
   voices. Idle motion (bob, sway, flicker, petals) runs on real frames. */
type Anchors = [number, number][];
export const WARP: Record<"hook" | "court" | "peace" | "roof" | "app", Anchors> = {
  hook: [[0, 0], [24, 24], [26, 51], [34, 59], [48, 80], [56, 88], [58, 90], [72, 104]],
  court: [[0, 0], [190, 190], [236, 276], [258, 298]],
  peace: [[0, 0], [12, 12], [26, 34], [36, 62], [46, 76], [90, 146], [96, 152], [126, 182]],
  // rooftop clock r: r = 0 is 30 frames before `today` starts (under the roll-up)
  roof: [[0, 0], [70, 70], [116, 126], [126, 136], [146, 162], [156, 172], [168, 184], [184, 238], [198, 252], [264, 318]],
  app: [[0, 0], [80, 80], [135, 120]],
};

/** v2 local frame -> v1 local frame (the clock the scene's keyframes were written in). */
export const warp = (k: keyof typeof WARP, n: number): number => {
  const a = WARP[k];
  if (n <= a[0][1]) return a[0][0] + (n - a[0][1]);
  for (let i = 1; i < a.length; i++) {
    if (n <= a[i][1]) {
      const [o0, n0] = a[i - 1];
      const [o1, n1] = a[i];
      return o0 + ((n - n0) * (o1 - o0)) / (n1 - n0);
    }
  }
  const [oL, nL] = a[a.length - 1];
  return oL + (n - nL);
};

/** Rooftop clock origin (reel frame): 30 frames before `today`, under the scroll roll-up. */
export const ROOF0 = SC.today[0] - 30;
export const ROOF_LEN = SC.pocket[1] - ROOF0;

/* Cue sheet in REEL frames (v2 timeline), read by scripts/katha_audio.py as
   JSON (keep keys quoted, no trailing commas). Bubble/chip/CTA pops sit on
   the voice placements in scripts/katha_vo_mix.py. */
// CUES-JSON-BEGIN
export const CUES = {
  "dhum": [[0, 1.0], [1102, 0.9], [274, 0.5]],
  "sword": [[0, 1.0], [14, 0.5]],
  "pop": [[5, 0.9], [59, 0.7], [150, 0.7], [276, 0.8], [516, 0.6], [726, 0.8], [758, 0.8], [787, 0.8], [920, 0.6], [1191, 0.7], [1247, 0.7], [1313, 0.8]],
  "flip": 86,
  "whoosh": [[102, 0.9], [414, 0.5], [444, 0.5], [474, 0.5], [680, 0.6], [972, 0.9], [1107, 0.5]],
  "rustle": [228, 246],
  "shimmer": [[246, 0.7], [836, 1.0], [926, 0.9], [1050, 0.6], [1112, 0.9]],
  "bell": [[254, 0.6], [576, 0.9], [1386, 0.7]],
  "steps": [476, 510, 5],
  "cheer": [577, 668, 0.6],
  "roll": [664, 694],
  "crickets": [694, 982],
  "ding": [[576, 0.6], [942, 0.8], [1046, 0.7], [1293, 0.8]],
  "taps": [1000, 1036, 30],
  "send": 1042
};
// CUES-JSON-END

/* ------------------------------------------------------------------ */
/* Copy (every on-screen line is a prop)                               */
/* ------------------------------------------------------------------ */

export const kathaReelSchema = z.object({
  hook: z.array(z.string()).length(2),
  shout: z.string(),
  wait: z.string(),
  narr1: z.string(),
  ask: z.string(),
  narr2: z.string(),
  ruling: z.string(),
  narr3: z.string(),
  narr4: z.string(),
  peaceLine: z.string(),
  moral: z.string(),
  narr5: z.string(),
  chips: z.array(z.string()).length(3),
  narr6: z.string(),
  question: z.string(),
  narr7: z.string(),
  userName: z.string(),
  ctaLines: z.array(z.string()).length(2),
  ctaFree: z.string(),
  ctaNote: z.string(),
  /** "mix" = ElevenLabs voices + ducked SFX (final), "sfx" = effects only, "none" = silent. */
  audio: z.enum(["mix", "sfx", "none"]),
});
export type KathaReelProps = z.infer<typeof kathaReelSchema>;

export const KATHA_REEL_DEFAULTS: KathaReelProps = {
  hook: ["This king stopped a WAR", "with just one question."],
  shout: "ATTACK\nAT DAWN!",
  wait: "Wait.",
  narr1: "Before any war, the king turned\nto one man: his Raj Jyotishi.",
  ask: "What do my stars say?",
  narr2: "The Jyotishi opened\nthe king's kundali...",
  ruling: "Mangal is weak.\nWait three days.",
  narr3: "So the king waited.",
  narr4: "On the third day, a messenger\ncame from the enemy...",
  peaceLine: "Our king offers\nPEACE!",
  moral: "No war. No bloodshed.\nJust the right timing.",
  narr5: "Today, your decisions\nare just as big.",
  chips: ["Should I switch jobs?", "Is he the one?", "Should I move abroad?"],
  narr6: "Your own Raj Jyotishi\nnow lives in your phone.",
  question: "Should I switch jobs this year?",
  narr7: "Ask Jyotiq anything.\nIt reads your kundali.",
  userName: "Meera",
  ctaLines: ["Before your next big decision,", "ask Jyotiq."],
  ctaFree: "Your 1st question is FREE",
  ctaNote: "Download from the link in bio",
  audio: "mix",
};
