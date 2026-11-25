import * as THREE from "three";
import { clamp01, easeInOut, lerp } from "./theme";

export type V3 = [number, number, number];
export const LIGHT: V3 = [-0.86, 0.26, 0.38];

export const MOTHER_R = 1.6;
export type MoonId = "jyotiq" | "karmeq" | "grovit";
export const MOONS: Record<MoonId, { r: number; orbit: number; incl: number; w: number; theta0: number }> = {
  // theta0 = orbit angle at T0 (the wide "three products" shot); pi/2 = straight toward the camera
  jyotiq: { r: 0.44, orbit: 3.5, incl: 0.1, w: 0.1, theta0: Math.PI / 2 + 0.9 },
  karmeq: { r: 0.5, orbit: 4.7, incl: -0.07, w: 0.075, theta0: Math.PI / 2 - 0.55 },
  grovit: { r: 0.4, orbit: 5.9, incl: 0.16, w: 0.06, theta0: Math.PI / 2 - 1.35 },
};
const T0 = 37.5;

export const moonPos = (id: MoonId, t: number): V3 => {
  const m = MOONS[id];
  const th = m.theta0 + m.w * (t - T0);
  const x = m.orbit * Math.cos(th);
  const z = m.orbit * Math.sin(th);
  return [x, z * Math.sin(m.incl), z];
};

type Cam = { pos: V3; look: V3; fov: number };
const mix3 = (a: V3, b: V3, p: number): V3 => [lerp(a[0], b[0], p), lerp(a[1], b[1], p), lerp(a[2], b[2], p)];
const mixCam = (a: Cam, b: Cam, p: number): Cam => ({ pos: mix3(a.pos, b.pos, p), look: mix3(a.look, b.look, p), fov: lerp(a.fov, b.fov, p) });
const seg = (t: number, a: number, b: number) => easeInOut(clamp01((t - a) / (b - a)));

const focusCam = (id: MoonId, t: number): Cam => {
  const M = moonPos(id, t);
  const D = MOONS[id].r * 7.4;
  const dir: V3 = [0.18, 0.2, 1];
  const n = Math.hypot(...dir);
  return {
    pos: [M[0] + (dir[0] / n) * D, M[1] + (dir[1] / n) * D, M[2] + (dir[2] / n) * D],
    look: [M[0] - 0.3 * D, M[1] + 0.02 * D, M[2]],
    fov: 34,
  };
};

/** Camera for the opening (planet appears out of a point of light). */
export const openCam = (t: number): Cam => {
  const far: Cam = { pos: [0, 0.2, 420], look: [0, 0, 0], fov: 32 };
  const near0: Cam = { pos: [1.0, 0.7, 6.9], look: [-2.05, 0.05, 0], fov: 34 };
  const drift: Cam = { pos: [2.4, 0.9, 6.3], look: [-1.9, 0.0, 0], fov: 34 };
  // the resting shot already drifts while the approach lands, so there is no stop-start
  const near = mixCam(near0, drift, easeInOut(clamp01((t - 5.0) / 9.0)));
  // one long, gentle approach (2.2 s to 9.4 s) on log distance: the planet's size grows at a
  // steady rate (about 2.4x per second at the fastest) instead of ballooning in half a second
  const u = clamp01((t - 2.2) / 7.2);
  const p = u * u * (3 - 2 * u);
  const dn = Math.hypot(near.pos[0] - near.look[0], near.pos[1] - near.look[1], near.pos[2] - near.look[2]);
  const d = Math.exp(lerp(Math.log(420), Math.log(dn), p));
  const c = mixCam(far, near, p);
  const dir = [c.pos[0] - c.look[0], c.pos[1] - c.look[1], c.pos[2] - c.look[2]];
  const n = Math.hypot(dir[0], dir[1], dir[2]);
  return { ...c, pos: [c.look[0] + (dir[0] / n) * d, c.look[1] + (dir[1] / n) * d, c.look[2] + (dir[2] / n) * d] };
};

/** The AstroRaaga planet's radius in pixels on the 1920x1080 frame (opening camera). */
export const openPlanetPx = (t: number) => {
  const c = openCam(t);
  const d = Math.hypot(c.pos[0], c.pos[1], c.pos[2]);
  return (MOTHER_R / (d * Math.tan(((c.fov / 2) * Math.PI) / 180))) * 540;
};

const WIDE0: Cam = { pos: [0, 3.0, 15.5], look: [0, -0.35, 0], fov: 36 };
const WIDE1: Cam = { pos: [0.6, 3.4, 13.2], look: [0, -0.3, 0], fov: 36 };
const WIDE2: Cam = { pos: [0, 6.2, 17.5], look: [0, -0.8, 0], fov: 36 };

/** Camera for the product system (film seconds). */
export const systemCam = (t: number): Cam => {
  const wide = mixCam(WIDE0, WIDE1, seg(t, 35.0, 39.2));
  if (t < 39.0) return wide;
  if (t < 45.2) return mixCam(wide, focusCam("jyotiq", t), seg(t, 39.0, 40.4));
  if (t < 50.0) return mixCam(focusCam("jyotiq", t), focusCam("karmeq", t), seg(t, 45.2, 46.5));
  if (t < 54.6) return mixCam(focusCam("karmeq", t), focusCam("grovit", t), seg(t, 50.0, 51.3));
  return mixCam(focusCam("grovit", t), WIDE2, seg(t, 54.6, 56.4));
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
