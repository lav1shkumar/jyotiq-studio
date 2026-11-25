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
  | "mission" | "team" | "problem" | "why" | "segment" | "goals" | "market" | "gtm" | "model" | "roadmap" | "traction" | "compete" | "moat" | "ask" | "hub";

// ring angle (degrees, screen space: 90 = bottom) and the stall's number and sign
export const RING: { id: Exclude<BoardId, "hub">; deg: number; sign: string; tone: string }[] = ([
  ["mission", "Introduction", "#EA580C"],
  ["team", "The team", "#059669"],
  ["problem", "The problem", "#E11D48"],
  ["why", "Why build it", "#C2410C"],
  ["segment", "Segments", "#0284C7"],
  ["goals", "Purpose & goals", "#A87719"],
  ["market", "Market", "#0284C7"],
  ["gtm", "Go-to-market", "#059669"],
  ["model", "Business model", "#7C3AED"],
  ["roadmap", "Roadmap", "#0E7490"],
  ["traction", "Traction", "#EA580C"],
  ["compete", "Competition", "#9A3412"],
  ["moat", "Long-term vision", "#A87719"],
  ["ask", "Funding", "#C2410C"],
] as const).map(([id, sign, tone], i) => ({ id, sign, tone, deg: (90 + (i * 360) / 14) % 360 }));

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
    // v6.1: no part-of-slide close-ups; every slide stays fully in frame (they cut edges and showed empty areas)
    if (soft) return;
    const nd = isV5() ? (soft ? Math.max(dur * 1.3, 1.5) : dur * 1.2) : dur;
    M.push({ t: t - (nd - dur) / 2, dur: nd, to, soft });
  };
  const S = (id: string) => sc(id);

  // v6 order (Amit sir, 20 Nov): intro → team → mela/problem → solution/products (hub) → segments → goals → market …
  // 02 team: founders one by one, then the whole team
  go(S("team").start - 0.25, 2.6, onBoard("team"));
  go(word("team_2", "amit") - 0.45, 1.2, onBoard("team", 560, 560, 1200), true);
  go(word("team_3", "doctor") - 0.45, 1.3, onBoard("team", 1360, 560, 1200), true);
  go(line("team_4").start - 0.3, 1.4, onBoard("team"), true);
  // 03 the giant mela (big zoom out), then the problem card by card
  go(S("mela").start + 0.15, 3.4, WIDE);
  go(S("problem").start - 0.2, 2.4, onBoard("problem"));
  const P = [
    ["problem_2", "market", 440, 360],
    ["problem_2", "predictions", 960, 360],
    ["problem_2", "prices", 1480, 360],
    ["problem_2", "experts", 440, 690],
    ["problem_3", "personalisation", 960, 690],
    ["problem_4", "spiritual", 1480, 690],
  ] as const;
  P.forEach(([l, w, x, y]) => go(word(l, w) - 0.45, 1.1, onBoard("problem", x, y, 1180), true));
  go(line("problem_4").end + 0.15, 1.3, onBoard("problem"), true);
  go(S("why").start - 0.1, 2.4, onBoard("why"));
  // 04 the solution: out over the whole mela as the lights join, then into the hub (products inside it)
  go(S("solution").start - 0.1, 2.8, WIDE);
  go(line("solution_2").start - 0.7, 2.6, onBoard("hub"));
  // 05 segments: the matrix, row by row
  go(S("segment").start - 0.2, 2.7, onBoard("segment"));
  go(word("segment_2", "professionals") - 0.5, 1.3, onBoard("segment", 960, 400, 1500), true);
  go(word("segment_2", "seekers") - 0.5, 1.3, onBoard("segment", 960, 700, 1500), true);
  go(line("segment_3").start - 0.2, 1.3, onBoard("segment"), true);
  // 06 purpose & product goals
  go(S("goals").start - 0.2, 2.5, onBoard("goals"));
  go(line("goals_2").start - 0.3, 1.3, onBoard("goals", 960, 640, 1780), true);
  go(line("goals_2").end + 0.2, 1.2, onBoard("goals"), true);
  // 07 market: India, the American continent, then what follows
  go(S("market").start - 0.2, 2.7, onBoard("market"));
  go(line("market_2").start - 0.4, 1.4, onBoard("market", 1450, 560, 1000), true);
  go(line("market_3").start - 0.4, 1.6, onBoard("market", 420, 520, 1100), true);
  go(line("market_4").start - 0.4, 1.4, onBoard("market"), true);
  // 08 go-to-market
  go(S("gtm").start - 0.2, 2.6, onBoard("gtm"));
  go(line("gtm_2").start - 0.3, 1.3, onBoard("gtm", 700, 600, 1450), true);
  go(line("gtm_3").start - 0.3, 1.3, onBoard("gtm", 1450, 600, 1150), true);
  go(line("gtm_3").end + 0.2, 1.2, onBoard("gtm"), true);
  // 09 business model: the wheel
  go(S("model").start - 0.2, 2.5, onBoard("model"));
  go(word("model_2", "subscriptions") - 0.5, 1.2, onBoard("model", 1180, 470, 1250), true);
  go(word("model_2", "marketing") - 0.5, 1.2, onBoard("model"), true);
  // 10 roadmap: quarters, then the Year 3 revenue
  go(S("roadmap").start - 0.2, 2.5, onBoard("roadmap"));
  go(line("roadmap_2").start - 0.2, 1.3, onBoard("roadmap", 960, 420, 1700), true);
  go(line("roadmap_3").start - 0.3, 1.3, onBoard("roadmap", 960, 760, 1600), true);
  go(line("roadmap_3").end + 0.2, 1.2, onBoard("roadmap"), true);
  // 11 traction, 12 competition
  go(S("traction").start - 0.2, 2.4, onBoard("traction"));
  go(line("traction_3").start - 0.3, 1.3, onBoard("traction", 960, 760, 1500), true);
  go(line("traction_3").end + 0.2, 1.2, onBoard("traction"), true);
  go(S("compete").start - 0.2, 2.4, onBoard("compete"));
  // 13 long-term vision: the pillars, then the journey
  go(S("moat").start - 0.2, 2.4, onBoard("moat"));
  go(line("moat_2").start - 0.2, 1.3, onBoard("moat", 1290, 560, 1250), true);
  go(line("moat_3").start - 0.3, 1.4, onBoard("moat", 700, 700, 1500), true);
  go(line("moat_3").end + 0.1, 1.2, onBoard("moat"), true);
  // 14 funding, then out as the whole mela lights up
  go(S("ask").start - 0.2, 2.4, onBoard("ask"));
  go(word("ask_2", "forty") - 0.4, 1.3, onBoard("ask", 760, 600, 1560), true);
  go(line("ask_2").end + 0.2, 2.8, WIDE);
  // close: back to the AstroRaaga hub
  go(S("close").start - 0.1, 3.0, onBoard("hub"));
  return M;
};

const START: View = onBoard("mission");

/** Camera at film time t; a slow push-in while it holds still. */
const drift = (v: View, since: number, t: number): View => {
  // gentle push-in while holding: up to 2.5 % over 8 s
  const k = Math.max(0, Math.min(1, (t - since) / 8));
  return { ...v, w: v.w * lerp(1, isV5() ? 0.98 : 0.975, k * k * (3 - 2 * k)) }; // v7: 2 %, so headlines never drift under the top timeline
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
