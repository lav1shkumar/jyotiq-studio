/**
 * The AstroRaaga mela as one map. Each deck section is a stall (a 1920x1080 "board") on a ring around the
 * AstroRaaga hub at the centre. The camera is a 2D view {x, y, w}: the world point at the centre of the frame
 * and the world width shown (w = 1920 means a board fills the frame). Moves use van Wijk & Nuij smooth zoom
 * (the d3.interpolateZoom maths): zoom out, travel, zoom in.
 */
import { easeInOut, easeSoft, isV5, lerp, line, sc, word } from "./theme";

export const BW = 1920;
export const BH = 1080;
export const RX = 5800;
export const RY = 3600;

export type BoardId =
  | "mission" | "problem" | "why" | "market" | "gtm" | "model" | "roadmap" | "traction" | "compete" | "moat" | "ask" | "team" | "hub";

// ring angle (degrees, screen space: 90 = bottom) and the stall's number and sign
export const RING: { id: Exclude<BoardId, "hub">; deg: number; sign: string; tone: string }[] = [
  { id: "mission", deg: 90, sign: "Welcome", tone: "#EA580C" },
  { id: "problem", deg: 120, sign: "The problem", tone: "#E11D48" },
  { id: "why", deg: 150, sign: "Why solve it", tone: "#C2410C" },
  { id: "market", deg: 180, sign: "Market", tone: "#0284C7" },
  { id: "gtm", deg: 210, sign: "Go-to-market", tone: "#059669" },
  { id: "model", deg: 240, sign: "Business model", tone: "#7C3AED" },
  { id: "roadmap", deg: 270, sign: "Roadmap", tone: "#0E7490" },
  { id: "traction", deg: 300, sign: "Traction", tone: "#EA580C" },
  { id: "compete", deg: 330, sign: "Competition", tone: "#9A3412" },
  { id: "moat", deg: 0, sign: "Our edge", tone: "#A87719" },
  { id: "ask", deg: 30, sign: "The ask", tone: "#C2410C" },
  { id: "team", deg: 60, sign: "The team", tone: "#059669" },
];

export const boardPos = (id: BoardId): [number, number] => {
  if (id === "hub") return [0, 0];
  const r = RING.find((b) => b.id === id)!;
  const a = (r.deg * Math.PI) / 180;
  return [RX * Math.cos(a), RY * Math.sin(a)];
};

export type View = { x: number; y: number; w: number };
export const WIDE: View = { x: 0, y: 0, w: 16600 };

/** A view onto a board; (lx, ly) is a point in the board's own 1920x1080 coordinates, w the width shown. */
export const onBoard = (id: BoardId, lx = BW / 2, ly = BH / 2, w = BW): View => {
  const [x, y] = boardPos(id);
  // keep a close-up inside the board, so the frame never shows the board's edge
  const h = (w * BH) / BW;
  const cx = Math.max(w / 2, Math.min(BW - w / 2, lx));
  const cy = Math.max(h / 2, Math.min(BH - h / 2, ly));
  return { x: x + cx - BW / 2, y: y + cy - BH / 2, w };
};

// ---------- van Wijk & Nuij smooth zoom ----------
const RHO = 1.25;
const zoomPath = (a: View, b: View) => {
  const rho2 = RHO * RHO;
  const rho4 = rho2 * rho2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const d2 = dx * dx + dy * dy;
  if (d2 < 1e-6) {
    const S = Math.log(b.w / a.w) / RHO;
    return (t: number): View => ({ x: a.x + t * dx, y: a.y + t * dy, w: a.w * Math.exp(RHO * t * S) });
  }
  const d1 = Math.sqrt(d2);
  const b0 = (b.w * b.w - a.w * a.w + rho4 * d2) / (2 * a.w * rho2 * d1);
  const b1 = (b.w * b.w - a.w * a.w - rho4 * d2) / (2 * b.w * rho2 * d1);
  const r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0);
  const r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
  const S = (r1 - r0) / RHO;
  return (t: number): View => {
    const s = t * S;
    const cr0 = Math.cosh(r0);
    const u = (a.w / (rho2 * d1)) * (cr0 * Math.tanh(RHO * s + r0) - Math.sinh(r0));
    return { x: a.x + u * dx, y: a.y + u * dy, w: (a.w * cr0) / Math.cosh(RHO * s + r0) };
  };
};

type Move = { t: number; dur: number; to: View; soft?: boolean };

/** The film's camera moves (film seconds), built from the voice timing so both versions stay in sync. */
export const moves = (): Move[] => {
  const M: Move[] = [];
  // v5.1: slower, smoother camera: close-ups take 30 % longer (at least 1.5 s), board-to-board travels 20 % longer;
  // each starts earlier by half the extra so it still lands on its word
  const go = (t: number, dur: number, to: View, soft = false) => {
    const nd = isV5() ? (soft ? Math.max(dur * 1.3, 1.5) : dur * 1.2) : dur;
    M.push({ t: t - (nd - dur) / 2, dur: nd, to, soft });
  };
  const S = (id: string) => sc(id);

  // mission board after the welcome; then the giant mela (big zoom out)
  go(S("mela").start + 0.15, 3.4, WIDE);
  // the problem: into its stall, then card by card (a slower walk)
  go(S("problem").start - 0.2, 2.4, onBoard("problem"));
  const P = [
    ["problem_2", "every", 440, 360],
    ["problem_2", "readings", 960, 360],
    ["problem_2", "prices", 1480, 360],
    ["problem_2", "experts", 440, 690],
    ["problem_3", "every", 960, 690],
    ["problem_4", "too", 1480, 690],
  ] as const;
  P.forEach(([l, w, x, y]) => go(word(l, w) - 0.45, 1.1, onBoard("problem", x, y, 1180), true));
  go(line("problem_4").end + 0.15, 1.3, onBoard("problem"), true);
  // why
  go(S("why").start - 0.1, 2.4, onBoard("why"));
  // the solution: out over the whole mela as the lights join, then into the hub
  go(S("solution").start - 0.1, 2.8, WIDE);
  go(line("solution_2").start - 0.7, 2.6, onBoard("hub"));
  // products: the hub stays framed; the 3D camera inside does the moon zooms
  // market: India, North America, Latin America
  go(S("market").start - 0.2, 2.7, onBoard("market"));
  go(line("market_2").start - 0.4, 1.4, onBoard("market", 1450, 560, 1000), true);
  go(line("market_3").start - 0.4, 1.6, onBoard("market", 420, 480, 1100), true);
  go(word("market_3", "latin") - 0.6, 1.4, onBoard("market", 760, 740, 1100), true);
  go(line("market_3").end + 0.4, 1.3, onBoard("market"), true);
  // go-to-market: the engine and its channels, then the funnel
  go(S("gtm").start - 0.2, 2.6, onBoard("gtm"));
  go(line("gtm_2").start - 0.3, 1.3, onBoard("gtm", 700, 600, 1450), true);
  go(line("gtm_3").start - 0.3, 1.3, onBoard("gtm", 1450, 600, 1150), true);
  go(line("gtm_3").end + 0.2, 1.2, onBoard("gtm"), true);
  // business model: the wheel, cabin by cabin
  go(S("model").start - 0.2, 2.5, onBoard("model"));
  go(word("model_2", "question") - 0.5, 1.2, onBoard("model", 1180, 470, 1250), true);
  go(word("model_2", "programmes") - 0.5, 1.2, onBoard("model"), true);
  // roadmap: the timeline, then the revenue bars
  go(S("roadmap").start - 0.2, 2.5, onBoard("roadmap"));
  go(line("roadmap_2").start - 0.2, 1.3, onBoard("roadmap", 960, 500, 1800), true);
    go(line("roadmap_3").end + 0.2, 1.2, onBoard("roadmap"), true);
  // traction, competition
  go(S("traction").start - 0.2, 2.4, onBoard("traction"));
  go(S("compete").start - 0.2, 2.4, onBoard("compete"));
  // our edge
  go(S("moat").start - 0.2, 2.4, onBoard("moat"));
  go(line("moat_2").start - 0.2, 1.3, onBoard("moat", 1290, 600, 1250), true);
  go(line("moat_2").end + 0.1, 1.2, onBoard("moat"), true);
  // the ask, then out as the whole mela lights up
  go(S("ask").start - 0.2, 2.4, onBoard("ask"));
  go(word("ask_1", "light") + 0.25, 2.6, WIDE);
  // the team: founders one by one, then the whole team
  go(S("team").start - 0.25, 2.6, onBoard("team"));
  go(word("team_2", "amit") - 0.45, 1.2, onBoard("team", 560, 560, 1200), true);
  go(word("team_3", "doctor") - 0.45, 1.3, onBoard("team", 1360, 560, 1200), true);
  go(line("team_4").start - 0.3, 1.4, onBoard("team"), true);
  // close: back to the AstroRaaga hub
  go(S("close").start - 0.4, 3.0, onBoard("hub"));
  return M;
};

const START: View = onBoard("mission");

/** Camera at film time t; a slow push-in while it holds still. */
const drift = (v: View, since: number, t: number): View => {
  // gentle push-in while holding: up to 2.5 % over 8 s
  const k = Math.max(0, Math.min(1, (t - since) / 8));
  return { ...v, w: v.w * lerp(1, isV5() ? 0.96 : 0.975, k * k * (3 - 2 * k)) };
};

export const camAt = (t: number, M: Move[]): View => {
  let v = START;
  let held = 0;
  for (const m of M) {
    const t0 = Math.max(m.t, held); // a move never starts before the previous one has landed
    if (t < t0) break;
    const from = drift(v, held, t0);
    if (t < t0 + m.dur) {
      const p = (m.soft && !isV5() ? easeSoft : easeInOut)(Math.min(1, (t - t0) / m.dur));
      return zoomPath(from, m.to)(p);
    }
    v = m.to;
    held = t0 + m.dur;
  }
  return drift(v, held, t);
};

export const viewScale = (v: View) => BW / v.w;
