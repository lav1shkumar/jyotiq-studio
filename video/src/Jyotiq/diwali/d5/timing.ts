// PLACEHOLDER timing estimated from the script (diwali_d5_audio.py --placeholder); re-run without it once the takes are in.
export const FPS = 30;
export const TOTAL = 1723;
export type Range = readonly [number, number];
/** Dialogue take -> [start, end) frames on the reel clock. */
export const LINES: Record<string, Range> = {
  "01_narrator": [4, 230],
  "02_narrator": [246, 427],
  "03_narrator": [430, 641],
  "04_yamraj": [645, 856],
  "05_narrator": [859, 980],
  "06_narrator": [1007, 1218],
  "07_narrator": [1221, 1417],
  "08_narrator": [1420, 1616],
  "jyotiq_signoff": [1620, 1711],
};
/** Silent picture beats. */
export const BEATS: Record<string, Range> = {
  title: [234, 244],
  glow: [980, 1004],
  hold: [1711, 1723],
};
export const SCENES: Record<string, Range> = {
  hook: [0, 234],
  title: [234, 246],
  yamuna: [246, 427],
  welcome: [427, 642],
  yama: [642, 856],
  name: [856, 1004],
  map: [1004, 1218],
  langs: [1218, 1417],
  app: [1417, 1620],
  end: [1620, 1723],
};
export const CUES: Record<string, number> = {
  devta01: 34,
  behan01: 125,
  khana01: 170,
  rewind: 226,
  titleHit: 238,
  yamuna02: 246,
  barson02: 261,
  cap02b: 367,
  vyast02: 412,
  aaye03: 445,
  tilak03: 506,
  aarti03: 536,
  cap03b: 566,
  yama04: 645,
  tilak04: 751,
  cap04b: 781,
  bhay04: 811,
  dwitiya05: 935,
  dooj05: 965,
  glow: 980,
  bhasha06: 1037,
  bhaubeej06: 1113,
  bhai06a: 1128,
  bhai06b: 1158,
  bhai06c: 1188,
  ek07: 1236,
  anek07: 1266,
  cap07b: 1281,
  apni07: 1372,
  hindi08: 1420,
  punjabi08: 1435,
  gujarati08: 1450,
  marathi08: 1465,
  english08: 1480,
  cap08b: 1541,
  signoff: 1620,
  offer: 1665,
  brandChime: 1713,
};
