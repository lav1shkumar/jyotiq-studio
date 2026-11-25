import { SONG_AT as V1_SONG_AT } from "./timing";

/* Jyotiq "Shooter Gaadi" Reel v2 clock.
   Song = public/jyotiq/shooter/song-full.wav: Ayush's extended MP3 trimmed at the same
   point as v1 (44.37 s of leading silence), 18.377 s of real audio. Its first 14.72 s
   are the v1 clip (cross-correlation 0.98-0.99, 0.7 ms offset), so every v1 lyric/kick
   time still holds. New tail, measured locally (whisper large-v3-turbo DTW + an energy
   scan): "kah se aate hain" at 13.96 s and again at 16.54 s, strong beats at
   14.50 / 15.10 / 15.67 / 16.27 / 16.83 / 17.43 / 18.00, and the file stops dead on
   "aate" at 18.377 s (the last "hain" is never sung). */

/** Song start (reel frame). v1 was 72 (2.40 s); the slower opening needs 4.90 s. */
export const SONG_AT2 = 147;
/** v1's song-locked scenes (Shani, convoy) render unchanged at f - SHIFT. */
export const SHIFT = SONG_AT2 - V1_SONG_AT; // 75
const s2 = (sec: number) => SONG_AT2 + Math.round(sec * 30);

/** Kid scene, re-paced: each beat gets time to read. */
export const K2 = {
  phone: 0, // POV phone + hook caption
  tap: 34, // thumb taps the Jyotiq icon
  splash: 42, // logo splash (full by 50, held to 66)
  face: 66, // the kid types in a panic
  typeFrom: 72,
  sent: 104, // question flies off
  read: 114, // Jyotiq reads the kundli (Shani + Mangal light up)
  react: s2(0), // 147 song in on the FURIOUS smash-cut
  cry: s2(0.53), // 163 crying face + meme wail 1 (kick)
  cry2: s2(0.98), // 176 punch-in + meme wail 2 (kick)
  confused: s2(1.7), // 198
  weird: s2(2.15), // 212
  shani: s2(2.84), // 232 "minute" -> Shani (v1 157 + SHIFT)
};

/** New "kah se aate hain" ending. */
export const E2 = {
  dance: s2(14.5), // 582 energy jump: cut to the graha dance floor
  beats: [14.5, 15.1, 15.67, 16.27, 16.83, 17.43, 18.0].map(s2), // 582 600 617 635 652 670 687
  converge: s2(16.27), // 635 grahas swirl into the phone (camera pulls back)
  reveal: s2(16.83), // 652 boy's hand + phone, grahas dancing on screen
  words: { kha: s2(16.54), se: s2(16.94), aate: s2(17.34), hai: s2(18.0) }, // 643 655 667 687
  lock: s2(18.377), // 698 song ends -> Cantina-style lockup slam
};
export const LOCK_LEN = 105; // 3.5 s lockup
/** Brand VO slot (Ayush's ElevenLabs line): starts 0.2 s after the slam, ~2 s budget. */
export const VO_AT = E2.lock + 6; // 704
export const VO_MAX = 60;
export const TOTAL2 = E2.lock + LOCK_LEN; // 803 = 26.77 s
