import * as THREE from "three";
import { clamp01, easeInOut, isV5, lerp } from "./theme";

export type V3 = [number, number, number];
export const LIGHT: V3 = [-0.86, 0.26, 0.38];
export const MOTHER_R = 1.6;

// v4: two platforms only (GrovIT is no longer shown)
export type MoonId = "jyotiq" | "karmeq";
export const MOONS: Record<MoonId, { r: number; orbit: number; incl: number; w: number; theta0: number }> = {
  // slow, opposite drifts so both moons stay in front of the planet for the whole products scene
  jyotiq: { r: 0.5, orbit: 3.6, incl: 0.1, w: 0.025, theta0: Math.PI / 2 + 0.5 },
  karmeq: { r: 0.56, orbit: 5.0, incl: -0.08, w: -0.018, theta0: Math.PI / 2 - 0.5 },
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
export const systemCam = (t: number, k: { a: number; jy: number; km: number; back: number }): Cam => {
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
