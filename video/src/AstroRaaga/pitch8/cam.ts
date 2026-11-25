import * as THREE from "three";
import { clamp01, easeInOut, isV5, lerp } from "./theme";

export type V3 = [number, number, number];
export const LIGHT: V3 = [-0.86, 0.26, 0.38];
export const MOTHER_R = 1.6;

// v4: two platforms only (GrovIT is no longer shown)
export type MoonId = "jyotiq" | "karmeq" | "engine";
export const MOONS: Record<MoonId, { r: number; orbit: number; incl: number; w: number; theta0: number }> = {
  // slow, opposite drifts so both moons stay in front of the planet for the whole products scene
  jyotiq: { r: 0.5, orbit: 3.1, incl: 0.1, w: 0.025, theta0: Math.PI / 2 + 0.5 },
  karmeq: { r: 0.56, orbit: 5.0, incl: -0.08, w: -0.018, theta0: Math.PI / 2 - 0.5 },
  // v8 (Amit sir): a third orbit between them: the Earth = AstroRaaga's proprietary marketing content engine
  engine: { r: 0.42, orbit: 4.05, incl: 0.06, w: 0.02, theta0: Math.PI / 2 - 2.05 },
};
let T0 = 100;
export const setMoonEpoch = (t: number) => {
  T0 = t;
};

export const moonPos = (id: MoonId, t: number): V3 => {
  const m = MOONS[id];
  const th = m.theta0 + m.w * (t - T0);
  const x = m.orbit * Math.cos(th);
  const z = m.orbit * Math.sin(th);
  return [x, z * Math.sin(m.incl), z];
};

export type Cam = { pos: V3; look: V3; fov: number };
const mix3 = (a: V3, b: V3, p: number): V3 => [lerp(a[0], b[0], p), lerp(a[1], b[1], p), lerp(a[2], b[2], p)];
const mixCam = (a: Cam, b: Cam, p: number): Cam => ({ pos: mix3(a.pos, b.pos, p), look: mix3(a.look, b.look, p), fov: lerp(a.fov, b.fov, p) });
const seg = (t: number, a: number, b: number) => easeInOut(clamp01((t - a) / (b - a)));

/** Camera for the opening: one long, gentle approach on log distance (v3 fix), then a slow drift. */
export const openCam = (t: number): Cam => {
  const far: Cam = { pos: [0, 0.2, 420], look: [0, 0, 0], fov: 32 };
  const near0: Cam = { pos: [1.0, 0.7, 6.9], look: [-2.05, 0.05, 0], fov: 34 };
  const drift: Cam = { pos: [2.4, 0.9, 6.3], look: [-1.9, 0.0, 0], fov: 34 };
  const near = mixCam(near0, drift, easeInOut(clamp01((t - 5.0) / 9.0)));
  const u = clamp01((t - 1.6) / 7.4);
  const p = u * u * (3 - 2 * u);
  const dn = Math.hypot(near.pos[0] - near.look[0], near.pos[1] - near.look[1], near.pos[2] - near.look[2]);
  const d = Math.exp(lerp(Math.log(420), Math.log(dn), p));
  const c = mixCam(far, near, p);
  const dir = [c.pos[0] - c.look[0], c.pos[1] - c.look[1], c.pos[2] - c.look[2]];
  const n = Math.hypot(dir[0], dir[1], dir[2]);
  return { ...c, pos: [c.look[0] + (dir[0] / n) * d, c.look[1] + (dir[1] / n) * d, c.look[2] + (dir[2] / n) * d] };
};

/** v7 opening (Amit sir): the Sun fills the frame from frame 1, then the camera pulls back and rises to reveal the
 *  solar system (five planets in the planet colour system); the Sun settles right of centre for the title. */
export const openCam7 = (t: number): Cam => {
  const c0: Cam = { pos: [0.5, 0.22, 7.4], look: [0, 0, 0], fov: 34 };
  const c1: Cam = { pos: [2.2, 8.2, 25.5], look: [-5.2, -0.9, 0], fov: 34 };
  const c2: Cam = { pos: [3.4, 8.8, 24.6], look: [-5.2, -0.9, 0], fov: 34 };
  const push = clamp01(t / 1.8);
  const pre: Cam = { ...c0, pos: [c0.pos[0], c0.pos[1], lerp(7.4, 7.0, push * push * (3 - 2 * push))] };
  const u = clamp01((t - 1.6) / 8.8);
  const p = u * u * u * (u * (u * 6 - 15) + 10); // smootherstep: slow start, long glide
  const lk = easeInOut(clamp01((t - 1.8) / 5.6)); // the Sun slides right early, before the title arrives
  const end = mixCam(c1, c2, easeInOut(clamp01((t - 10.4) / 8)));
  const look = mix3(pre.look, end.look, lk);
  const d0 = Math.hypot(pre.pos[0] - pre.look[0], pre.pos[1] - pre.look[1], pre.pos[2] - pre.look[2]);
  const d1 = Math.hypot(end.pos[0] - end.look[0], end.pos[1] - end.look[1], end.pos[2] - end.look[2]);
  const d = Math.exp(lerp(Math.log(d0), Math.log(d1), p));
  const dirA = [pre.pos[0] - pre.look[0], pre.pos[1] - pre.look[1], pre.pos[2] - pre.look[2]].map((v) => v / d0);
  const dirB = [end.pos[0] - end.look[0], end.pos[1] - end.look[1], end.pos[2] - end.look[2]].map((v) => v / d1);
  const dir = [lerp(dirA[0], dirB[0], p), lerp(dirA[1], dirB[1], p), lerp(dirA[2], dirB[2], p)];
  const n = Math.hypot(dir[0], dir[1], dir[2]);
  return { pos: [look[0] + (dir[0] / n) * d, look[1] + (dir[1] / n) * d, look[2] + (dir[2] / n) * d], look, fov: 34 };
};

/** v8 (Amit sir): a true solar system for the opening, no names: six orbits (Mercury, Venus, Earth, Mars, Jupiter,
 *  Saturn); the Moon circles the Earth, and Rahu and Ketu are the two shadow points on the Moon's orbit. */
export type PlanetId = "mercury" | "venus" | "earth" | "mars" | "jupiter" | "saturn";
export const PLANETS: Record<PlanetId, { orbit: number; r: number; w: number; th0: number; incl: number; kind: number; tIn: number }> = {
  // angles chosen so no planet crosses the camera's pull-back path
  mercury: { orbit: 2.5, r: 0.22, w: 0.2, th0: -2.0, incl: 0.03, kind: 5, tIn: 3.8 },
  venus: { orbit: 3.5, r: 0.32, w: 0.15, th0: 3.7, incl: -0.02, kind: 10, tIn: 4.3 },
  earth: { orbit: 4.7, r: 0.34, w: 0.11, th0: 0.35, incl: 0.0, kind: 11, tIn: 4.8 },
  mars: { orbit: 5.9, r: 0.27, w: 0.085, th0: 4.35, incl: 0.025, kind: 12, tIn: 5.3 },
  jupiter: { orbit: 7.4, r: 0.66, w: 0.06, th0: 2.75, incl: -0.02, kind: 0, tIn: 5.8 },
  saturn: { orbit: 9.0, r: 0.54, w: 0.045, th0: 4.85, incl: 0.025, kind: 7, tIn: 6.3 },
};
export const planetPos = (id: PlanetId, t: number): V3 => {
  const m = PLANETS[id];
  const th = m.th0 + m.w * t;
  const x = m.orbit * Math.cos(th);
  const z = m.orbit * Math.sin(th);
  return [x, z * Math.sin(m.incl), z];
};
/** The Moon's orbit round the Earth (tilted), and the two nodes on it where Rahu and Ketu sit. */
export const MOON = { orbit: 0.82, r: 0.1, w: 0.55, tilt: 0.42, node: 0.9 };
export const moonOrbitPt = (t: number, th: number): V3 => {
  const E = planetPos("earth", t);
  const x = MOON.orbit * Math.cos(th);
  const z = MOON.orbit * Math.sin(th);
  // tilt the orbit about the line of nodes (angle MOON.node), so the nodes are where it crosses the ecliptic
  const c = Math.cos(MOON.node), s = Math.sin(MOON.node);
  const a = x * c + z * s; // along the nodes
  const b = -x * s + z * c; // across
  const y = b * Math.sin(MOON.tilt);
  const bb = b * Math.cos(MOON.tilt);
  return [E[0] + a * c - bb * s, E[1] + y, E[2] + a * s + bb * c];
};
export const moonPosOpen = (t: number): V3 => moonOrbitPt(t, 1.2 + MOON.w * t);
export const nodePos = (t: number, which: "rahu" | "ketu"): V3 => moonOrbitPt(t, MOON.node + (which === "ketu" ? Math.PI : 0));

export const openPlanetPx = (t: number) => {
  const c = openCam(t);
  const d = Math.hypot(c.pos[0], c.pos[1], c.pos[2]);
  return (MOTHER_R / (d * Math.tan(((c.fov / 2) * Math.PI) / 180))) * 540;
};

/** v5.1 KarmEQ close-up: look along the orbit, with the Sun out of frame on the right (it only rims the planet),
 *  so KarmEQ is the subject and not half-hidden behind the Sun. */
const orbitCam = (M: V3, D: number): Cam => {
  const rl = Math.hypot(M[0], M[2]) || 1;
  const u: V3 = [M[0] / rl, 0, M[2] / rl];
  let best: Cam | null = null;
  for (const sgn of [1, -1]) {
    const tg: V3 = [-u[2] * sgn, 0, u[0] * sgn];
    const d0: V3 = [tg[0] + 0.3 * u[0], 0.2, tg[2] + 0.3 * u[2]];
    const dn = Math.hypot(...d0);
    const d: V3 = [d0[0] / dn, d0[1] / dn, d0[2] / dn];
    const P: V3 = [M[0] + d[0] * D, M[1] + d[1] * D, M[2] + d[2] * D];
    const f = new THREE.Vector3(-d[0], -d[1], -d[2]);
    const r = new THREE.Vector3().crossVectors(f, new THREE.Vector3(0, 1, 0)).normalize();
    const sunRight = new THREE.Vector3(-P[0], -P[1], -P[2]).dot(r) > 0;
    const cam: Cam = { pos: P, look: [M[0] - r.x * 0.3 * D, M[1] + 0.02 * D, M[2] - r.z * 0.3 * D], fov: 34 };
    if (sunRight) return cam;
    best = cam;
  }
  return best!;
};

const focusCam = (id: MoonId, t: number): Cam => {
  const M = moonPos(id, t);
  const D = MOONS[id].r * 8.4; // v5.1: a calmer close-up, the moon no longer fills the frame
  if (id === "karmeq" && isV5()) return orbitCam(M, D);
  const dir: V3 = [0.2, 0.18, 1];
  const n = Math.hypot(...dir);
  return {
    pos: [M[0] + (dir[0] / n) * D, M[1] + (dir[1] / n) * D, M[2] + (dir[2] / n) * D],
    // the moon sits right of centre; its card goes on the left
    look: [M[0] - 0.42 * D, M[1] + 0.02 * D, M[2]],
    fov: 34,
  };
};

const WIDE_A: Cam = { pos: [0, 2.6, 13.6], look: [0, -0.2, 0], fov: 36 };
const WIDE_B: Cam = { pos: [0.5, 2.9, 12.4], look: [0, -0.15, 0], fov: 36 };
const WIDE_C: Cam = { pos: [0, 4.4, 14.8], look: [0, -0.6, 0], fov: 36 };

/** Camera for the product system; `k` holds the times (film s) when it focuses each moon and returns. */
export const systemCam = (t: number, k: { a: number; jy: number; km: number; back: number; eng?: number }): Cam => {
  const wide = mixCam(WIDE_A, WIDE_B, seg(t, k.a, k.jy));
  if (t < k.jy - 0.4) return wide;
  if (t < k.km - 0.4) return mixCam(wide, focusCam("jyotiq", t), seg(t, k.jy - 0.4, k.jy + 2.2));
  if (t < k.back - 0.3) {
    // v5.1: an arc, not a slide: pull back toward the wide shot mid-move, then zoom into KarmEQ
    const p = seg(t, k.km - 0.4, k.km + 2.6);
    return mixCam(mixCam(focusCam("jyotiq", t), focusCam("karmeq", t), p), WIDE_B, Math.sin(Math.PI * p) * 0.55);
  }
  return mixCam(focusCam("karmeq", t), WIDE_C, seg(t, k.back - 0.3, k.back + 2.6));
};

const tmp = new THREE.PerspectiveCamera(34, 16 / 9, 0.05, 1000);
/** Project a world point to pixels on the 1920x1080 frame for camera c. */
export const project = (c: Cam, p: V3): [number, number, number] => {
  tmp.fov = c.fov;
  tmp.position.set(...c.pos);
  tmp.lookAt(new THREE.Vector3(...c.look));
  tmp.updateMatrixWorld();
  tmp.updateProjectionMatrix();
  const v = new THREE.Vector3(...p).project(tmp);
  return [(v.x * 0.5 + 0.5) * 1920, (-v.y * 0.5 + 0.5) * 1080, v.z];
};
