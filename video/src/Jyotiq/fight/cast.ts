import { FigureSpec } from "./rig";
import { FLOOR } from "./set";

/* Choreography, frames @30 fps. The original's 0.6 s of standing around is
   cut: frame 0 is already the standoff.
     0-17   A jabs a finger at B, B keeps his hands up
     17-22  A winds up
     22     SHOVE (main hit) - B flies back into D
     24-42  C springs off the platform and grabs A from behind; E steps between
     47     A breaks free, second collision over E's arms
     40-70  J walks in from the right, G rushes in from the sofa
     88     freeze; 90 / 96 / 102 TV-drama zoom hits; 108 end */

export const HIT1 = 22;
export const HIT2 = 47;
export const FREEZE = 88;
export const DRAMA = [90, 96, 102];
export const HOOK_FRAMES = 108;

const TONE = { back: "#331638", mid: "#22102A", front: "#170A1C", fg: "#0E0510" };

/** A: the aggressor. Black tee, red shorts. */
export const A: FigureSpec = {
  id: "A", facing: 1, floor: FLOOR.front, scale: 1, tone: TONE.front, hair: "short",
  bottom: "#B3172F", shorts: true, build: 1.05,
  keys: [
    { f: 0, x: 400, lean: 10, head: 4, sF: 92, eF: 4, sB: -18, eB: 20, hF: 14, kF: 6, hB: -16, kB: 10 },
    { f: 5, e: "out", sF: 101, lean: 13 },
    { f: 9, sF: 90, lean: 9 },
    { f: 13, e: "out", sF: 103, lean: 14 },
    { f: 17, x: 392, lean: -6, sF: 55, eF: 95, sB: 40, eB: 95, hF: 10, kF: 22, hB: -14, kB: 24 },
    { f: HIT1, e: "snap", x: 452, lean: 22, sF: 88, eF: 6, sB: 82, eB: 10, hF: 30, kF: 14, hB: -26, kB: 2 },
    { f: 28, x: 470, lean: 16, sF: 80, eF: 20, sB: 70, eB: 25 },
    { f: 36, x: 486, lean: 18, sF: 96, eF: 10, sB: 60 },
    { f: 42, e: "out", x: 468, lean: 4 },
    { f: HIT2, e: "snap", x: 496, lean: 20, sF: 104, eF: 4, sB: 86, eB: 8 },
    { f: 56, x: 452, lean: -6, sF: 112, eF: 12, sB: 30, eB: 40, hF: 18, hB: -20 },
    { f: 70, x: 440, lean: 6, sF: 98 },
    { f: 80, x: 456, lean: 12, sF: 106 },
    { f: FREEZE, x: 448, lean: 8, sF: 100 },
  ],
  jit: [[42, FREEZE, 1]],
};

/** B: the one who gets shoved. Blue cardigan. */
export const B: FigureSpec = {
  id: "B", facing: -1, floor: FLOOR.front, scale: 1, tone: TONE.front, hair: "quiff",
  top: "#3D63A8", sleeves: "long",
  keys: [
    { f: 0, x: 650, lean: -6, head: -4, sF: 62, eF: 48, sB: 18, eB: 30, hF: 8, kF: 6, hB: -10, kB: 8 },
    { f: 6, sF: 70, eF: 40, lean: -8 },
    { f: 12, sF: 58, eF: 55 },
    { f: HIT1, lean: -4 },
    { f: 26, e: "snap", x: 752, lean: -28, head: -14, sF: 150, eF: 30, sB: 120, eB: 40, hF: 34, kF: 34, hB: -24, kB: 8, lift: 14 },
    { f: 32, e: "out", x: 772, lean: -14, head: -6, sF: 100, sB: 60, hF: 14, kF: 10, hB: -18, kB: 6, lift: 0 },
    { f: 40, x: 742, lean: 14, sF: 96, eF: 10, sB: 70, eB: 20 },
    { f: HIT2, e: "snap", x: 716, lean: 20, sF: 104, eF: 4 },
    { f: 56, x: 748, lean: 4, sF: 112, eF: 14 },
    { f: 70, x: 736, lean: 10, sF: 100 },
    { f: FREEZE, x: 742, lean: 9, sF: 104 },
  ],
  jit: [[34, FREEZE, 1]],
};

/** C: brown kurta, springs off the platform and holds A from behind. */
export const C: FigureSpec = {
  id: "C", facing: 1, floor: FLOOR.mid, scale: 0.88, tone: TONE.mid, hair: "curly",
  top: "#7A4426", sleeves: "long", skirt: { len: 0.42, flare: 16 }, filter: "rimMid",
  keys: [
    { f: 0, x: 150, seat: 1, seatH: 96, lean: 6, sF: 30, eF: 70, sB: 20, eB: 60, hF: 84, kF: 84, hB: 80, kB: 80 },
    { f: 24 },
    { f: 30, e: "out", seat: 0, x: 190, lean: 18, hF: 30, kF: 40, hB: -10, kB: 20, sF: 40, eF: 50, sB: -20 },
    { f: 36, x: 250, lean: 20, hF: 34, kF: 10, hB: -30, kB: 30, sF: 80, eF: 20, sB: 70, eB: 20 },
    { f: 42, e: "out", x: 300, lean: 10, sF: 80, eF: 40, sB: 76, eB: 44, hF: 16, kF: 6, hB: -18, kB: 6 },
    { f: 56, x: 285, lean: -14, sF: 76, eF: 44, sB: 70, eB: 48, hF: 4, kF: 14, hB: -24, kB: 4 },
    { f: 70, x: 296, lean: -6 },
    { f: FREEZE, x: 290, lean: -10 },
  ],
  react: [HIT1],
  jit: [[42, FREEZE, 1.1]],
};

/** D: catches B and holds him. */
export const D: FigureSpec = {
  id: "D", facing: -1, floor: FLOOR.mid, scale: 0.88, tone: TONE.mid, hair: "short", filter: "rimMid",
  keys: [
    { f: 0, x: 850, sF: 30, eF: 100, sB: 34, eB: 104, hF: 4, hB: -4 },
    { f: HIT1 },
    { f: 27, e: "out", x: 830, lean: 12, sF: 70, eF: 30, sB: 64, eB: 34, hF: 20, kF: 12, hB: -16, kB: 12 },
    { f: 33, e: "out", x: 836, lean: -6, sF: 80, eF: 40, sB: 76, eB: 44, hF: 8, kF: 6, hB: -10, kB: 6 },
    { f: 44, x: 826, lean: -12, sF: 74, eF: 54, sB: 70, eB: 56 },
    { f: FREEZE, x: 830, lean: -10 },
  ],
  react: [HIT1],
  jit: [[30, FREEZE, 0.9]],
};

/** E: orange tee, faces camera and spreads his arms between them. */
export const E: FigureSpec = {
  id: "E", facing: 1, floor: FLOOR.mid, scale: 0.88, tone: TONE.mid, hair: "short", view: "front",
  spread: 50, hipSpread: 24, top: "#C4562F", filter: "rimMid",
  keys: [
    { f: 0, x: 600, sF: 8, eF: 20, sB: -8, eB: -20, hF: 6, kF: 2, hB: -6, kB: 2 },
    { f: 26 },
    { f: 34, e: "out", x: 596, sF: 70, eF: 30, sB: -70, eB: -30 },
    { f: HIT2, e: "snap", x: 590, lean: -4, sF: 96, eF: 6, sB: -96, eB: -6 },
    { f: 60, sF: 88, sB: -84 },
    { f: FREEZE, sF: 92, sB: -90 },
  ],
  react: [HIT1],
  jit: [[34, FREEZE, 1]],
};

/** J: dreadlocks, walks in from the right and reaches into the pile. */
export const J: FigureSpec = {
  id: "J", facing: -1, floor: FLOOR.mid, scale: 0.88, tone: TONE.mid, hair: "dreads", filter: "rimMid",
  keys: [
    { f: 0, x: 975, lean: 2, sF: 6, eF: 14, sB: -6 },
    { f: 40, lean: 8 },
    { f: 46, x: 930, lean: 10, hF: 24, kF: 10, hB: -22, kB: 22, sF: -20, sB: 22 },
    { f: 52, x: 880, hF: -20, kF: 24, hB: 24, kB: 6, sF: 22, sB: -20 },
    { f: 58, x: 830, hF: 24, kF: 10, hB: -22, kB: 22, sF: -20, sB: 22 },
    { f: 64, x: 772, hF: -18, kF: 22, hB: 22, kB: 6, sF: 30, sB: -10 },
    { f: 70, e: "out", x: 714, lean: 14, sF: 86, eF: 20, sB: 40, eB: 30, hF: 14, kF: 8, hB: -16, kB: 10 },
    { f: FREEZE, x: 702 },
  ],
  react: [HIT1],
  jit: [[70, FREEZE, 0.8]],
};

/** F: seated on the sofa, hands fly to her face. */
export const F: FigureSpec = {
  id: "F", facing: 1, floor: FLOOR.back, scale: 0.76, tone: TONE.back, hair: "long",
  skirt: { len: 0.7, flare: 10 }, spread: 4, filter: "rimBack", shadow: false,
  keys: [
    { f: 0, x: 250, seat: 1, seatH: 125, lean: 4, sF: 20, eF: 70, sB: 14, eB: 70, hF: 84, kF: 84, hB: 80, kB: 82 },
    { f: HIT1 },
    { f: 27, e: "out", lean: -10, head: -8, sF: 150, eF: 150, sB: 146, eB: 150 },
    { f: 60, lean: -4, sF: 140, eF: 145 },
  ],
};

/** G: gets off the sofa and rushes in behind the pile. */
export const G: FigureSpec = {
  id: "G", facing: 1, floor: FLOOR.back, scale: 0.76, tone: TONE.back, hair: "long",
  skirt: { len: 0.75, flare: 14 }, spread: 4, filter: "rimBack",
  keys: [
    { f: 0, x: 400, seat: 1, seatH: 125, lean: 6, sF: 16, eF: 60, sB: 10, eB: 60, hF: 84, kF: 84, hB: 82, kB: 84 },
    { f: 30 },
    { f: 36, e: "out", seat: 0, x: 420, lean: 14, hF: 24, kF: 30, hB: -8, kB: 16, sF: 50, eF: 40 },
    { f: 44, x: 450, lean: 6, hF: 10, kF: 6, hB: -10, kB: 6, sF: 20, eF: 30 },
    { f: 52, x: 490, lean: 18, hF: 26, kF: 10, hB: -24, kB: 26, sF: 70, eF: 20, sB: 60 },
    { f: 60, x: 530, hF: -18, kF: 26, hB: 24, kB: 6 },
    { f: 68, e: "out", x: 556, lean: 16, sF: 92, eF: 14, sB: 84, eB: 18, hF: 14, kF: 8, hB: -16, kB: 10 },
    { f: FREEZE, x: 552 },
  ],
  react: [HIT1],
  jit: [[66, FREEZE, 0.9]],
};

/** H: foreground, back to camera, sits on the floor through all of it. */
export const H: FigureSpec = {
  id: "H", facing: 1, floor: FLOOR.fg, scale: 1.3, tone: TONE.fg, hair: "bob", view: "front",
  spread: 46, hipSpread: 30, filter: "fg", shadow: false, idle: 0.6,
  keys: [{ f: 0, x: 250, seat: 1, seatH: 40, sF: 10, eF: 40, sB: -10, eB: -40, hF: 84, kF: 120, hB: 84, kB: 120 }],
};

/** Paint order, back to front. `layer` decides which set props sit between them. */
export const CAST = { back: [F, G], mid: [J, D, E, C], front: [A, B], fg: [H] };
