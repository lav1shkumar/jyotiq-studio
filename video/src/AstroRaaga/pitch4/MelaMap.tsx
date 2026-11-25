import React from "react";
import { AbsoluteFill } from "remotion";
import { C, clamp01, easeInOut, KARLA, MARCELLUS, prog, rnd, sc, word } from "./theme";
import { AtTime, asset, useWinT } from "./ui";
import { BH, BoardId, boardPos, BW, camAt, moves, RING, RX, RY, View, viewScale } from "./world";
import { Img } from "remotion";

/* ---------------------------------------------------------------------------------------------
 * Mela-wide timings (from the voice): when the lights join (solution) and when everything glows (ask)
 * ------------------------------------------------------------------------------------------- */
const lightsJoin = (t: number) => prog(t, sc("solution").start + 0.9, 3.4, easeInOut);
const allGlow = (t: number) => prog(t, word("ask_1", "light") + 0.3, 2.2, easeInOut);
const crowdIn = (t: number) => prog(t, sc("mela").start + 0.6, 4.0, easeInOut);

/* ---------- ground: paper, a soft golden centre, the ring lane ---------- */
const Ground: React.FC = () => (
  <>
    <div
      style={{
        position: "absolute",
        left: -8200,
        top: -5600,
        width: 16400,
        height: 11400,
        background: `radial-gradient(ellipse 5200px 3400px at 50% 49%, #FFF6E2 0%, ${C.bg} 55%, #F9EEDA 100%)`,
      }}
    />
    <Img src={asset("grain.png")} style={{ position: "absolute", left: -8200, top: -5600, width: 16400, height: 11400, opacity: 0.05, mixBlendMode: "multiply" }} />
  </>
);

const ellipsePath = (rx: number, ry: number) => `M${-rx} 0 A${rx} ${ry} 0 1 0 ${rx} 0 A${rx} ${ry} 0 1 0 ${-rx} 0 Z`;

/* tents (the thousands of advisors) and crowd dots (the millions of seekers), placed once */
type Tent = { x: number; y: number; s: number; c: string; d: number };
const TENT_COL = ["#EA580C", "#E11D48", "#7C3AED", "#059669", "#0284C7", "#C8962E", "#C2410C"];
const awayFromBoards = (x: number, y: number, pad: number) =>
  [...RING.map((r) => boardPos(r.id)), [0, 0] as [number, number]].every(([bx, by]) => Math.abs(x - bx) > BW / 2 + pad || Math.abs(y - by) > BH / 2 + pad + 260);
const TENTS: Tent[] = (() => {
  const out: Tent[] = [];
  for (let i = 0; out.length < 150 && i < 4000; i++) {
    const a = rnd(i * 3 + 1) * Math.PI * 2;
    const band = rnd(i * 3 + 2);
    // inside the ring (between hub and lane) or just outside it
    const r = band < 0.62 ? 0.3 + 0.55 * rnd(i * 7 + 3) : 1.16 + 0.22 * rnd(i * 7 + 4);
    const x = Math.cos(a) * RX * r;
    const y = Math.sin(a) * RY * r;
    if (!awayFromBoards(x, y, 140)) continue;
    if (out.some((o) => Math.hypot(o.x - x, o.y - y) < 330)) continue;
    out.push({ x, y, s: 150 + rnd(i) * 90, c: TENT_COL[i % TENT_COL.length], d: Math.hypot(x / RX, y / RY) });
  }
  return out;
})();
const CROWD: { x: number; y: number; c: string; r: number; ph: number; d: number }[] = (() => {
  const out = [];
  const cols = ["#EA580C", "#F59E0B", "#E11D48", "#7C3AED", "#0E7490", "#059669", "#8C7660"];
  for (let i = 0; i < 1500; i++) {
    const a = rnd(i * 5 + 11) * Math.PI * 2;
    const lane = rnd(i * 5 + 12) < 0.55;
    const r = lane ? 1 + (rnd(i * 5 + 13) - 0.5) * 0.12 : 0.22 + rnd(i * 5 + 14) * 1.2;
    const x = Math.cos(a) * RX * r;
    const y = Math.sin(a) * RY * r;
    if (!awayFromBoards(x, y, 40)) continue;
    out.push({ x, y, c: cols[i % cols.length], r: 9 + rnd(i) * 6, ph: rnd(i * 9) * 6.28, d: Math.hypot(x / RX, y / RY) });
  }
  return out;
})();

const TentShape: React.FC<{ tt: Tent; on: number; glow: number }> = ({ tt, on, glow }) => {
  if (on <= 0) return null;
  const s = tt.s * (0.6 + 0.4 * on);
  return (
    <g transform={`translate(${tt.x} ${tt.y}) scale(${s / 100})`} opacity={on}>
      <ellipse cx={0} cy={44} rx={56} ry={10} fill="rgba(124,45,18,0.08)" />
      <path d="M-46 40 L-46 4 L46 4 L46 40 Z" fill="#FFF8EC" stroke={tt.c} strokeWidth={3} />
      <path d="M-56 6 L0 -42 L56 6 Z" fill={tt.c} opacity={0.9} />
      <path d="M-28 6 L0 -42 L-10 6 Z M10 6 L0 -42 L28 6 Z" fill="#FFF3DD" opacity={0.75} />
      <path d="M0 -42 L0 -62 L18 -56 L0 -50" fill={C.gold} stroke={C.gold} strokeWidth={2} />
      <rect x={-12} y={18} width={24} height={22} rx={3} fill={tt.c} opacity={0.35} />
      {glow > 0 && <circle cx={0} cy={-6} r={40} fill={`rgba(245,158,11,${0.22 * glow})`} />}
    </g>
  );
};

/* string lights along the ring lane and the spokes to the hub */
const Lights: React.FC<{ t: number; v: View }> = ({ t, v }) => {
  const join = lightsJoin(t);
  const glow = allGlow(t);
  const N = 220;
  const bulbs: React.ReactNode[] = [];
  for (let i = 0; i < N; i++) {
    const u = i / N;
    const a = u * Math.PI * 2 + Math.PI / 2; // start at the gate (bottom) and go round
    const sag = 60 * Math.abs(Math.sin(u * Math.PI * 24));
    const x = Math.cos(a) * (RX + 0) ;
    const y = Math.sin(a) * RY + sag - 380;
    if (!inView(v, x, y, 120)) continue;
    const lit = clamp01((join * 1.08 - u) * 14);
    const tw = 0.7 + 0.3 * Math.sin(t * 4 + i * 1.7);
    bulbs.push(
      <g key={i}>
        {lit > 0 && <circle cx={x} cy={y} r={34 + 16 * glow} fill={`rgba(245,158,11,${(0.16 + 0.18 * glow) * lit * tw})`} />}
        <circle cx={x} cy={y} r={11} fill={lit > 0 ? (lit > 0.5 ? "#FFC85A" : "#F5D9A0") : "#E9DCC4"} />
      </g>,
    );
  }
  // the lane's string, drawn as a scalloped line
  let d = "";
  for (let i = 0; i <= 480; i++) {
    const u = i / 480;
    const a = u * Math.PI * 2 + Math.PI / 2;
    const sag = 60 * Math.abs(Math.sin(u * Math.PI * 24));
    d += `${i ? "L" : "M"}${(Math.cos(a) * RX).toFixed(0)} ${(Math.sin(a) * RY + sag - 380).toFixed(0)} `;
  }
  // spokes: each stall to the hub, with bulbs, drawn as the lights join
  const spokes = RING.map((r, k) => {
    const [bx, by] = boardPos(r.id);
    const p = clamp01(join * 1.6 - 0.4 - k * 0.02);
    const sx = bx * 0.8;
    const sy = by * 0.8;
    const ex = bx * 0.17;
    const ey = by * 0.2;
    const pts = Array.from({ length: 9 }, (_, j) => j / 8).filter((v) => v <= p);
    return (
      <g key={r.id}>
        <line x1={sx} y1={sy} x2={sx + (ex - sx) * p} y2={sy + (ey - sy) * p} stroke="rgba(200,150,46,0.55)" strokeWidth={6} strokeDasharray="22 18" />
        {pts.map((v, j) => (
          <g key={j}>
            <circle cx={sx + (ex - sx) * v} cy={sy + (ey - sy) * v} r={30 + 12 * glow} fill={`rgba(245,158,11,${0.18 + 0.16 * glow})`} />
            <circle cx={sx + (ex - sx) * v} cy={sy + (ey - sy) * v} r={10} fill="#FFC85A" />
          </g>
        ))}
      </g>
    );
  });
  return (
    <svg style={{ position: "absolute", left: -8200, top: -5600, overflow: "visible" }} width={16400} height={11400} viewBox="-8200 -5600 16400 11400">
      <path d={ellipsePath(RX, RY)} fill="none" stroke="rgba(226,196,140,0.32)" strokeWidth={300} />
      <path d={ellipsePath(RX + 150, RY + 150)} fill="none" stroke="rgba(200,150,46,0.35)" strokeWidth={5} strokeDasharray="30 26" />
      <path d={ellipsePath(RX - 150, RY - 150)} fill="none" stroke="rgba(200,150,46,0.35)" strokeWidth={5} strokeDasharray="30 26" />
      {[1500, 2100].map((r) => (
        <ellipse key={r} cx={0} cy={0} rx={r * 1.45} ry={r} fill="none" stroke="rgba(200,150,46,0.22)" strokeWidth={5} strokeDasharray="8 22" />
      ))}
      {spokes}
      <path d={d} fill="none" stroke="rgba(140,118,96,0.45)" strokeWidth={4} />
      {bulbs}
    </svg>
  );
};

const inView = (v: View, x: number, y: number, pad: number) => {
  const s = viewScale(v);
  return Math.abs(x - v.x) < 960 / s + pad && Math.abs(y - v.y) < 540 / s + pad;
};

const Field: React.FC<{ t: number; v: View }> = ({ t, v }) => {
  const ci = crowdIn(t);
  const glow = allGlow(t);
  return (
    <svg style={{ position: "absolute", left: -8200, top: -5600, overflow: "visible" }} width={16400} height={11400} viewBox="-8200 -5600 16400 11400">
      {CROWD.map((p, i) => {
        const on = clamp01((ci * 1.3 - p.d * 0.6) * 4);
        if (on <= 0 || !inView(v, p.x, p.y, 60)) return null;
        return <circle key={i} cx={p.x + Math.sin(t * 0.5 + p.ph) * 26} cy={p.y + Math.cos(t * 0.4 + p.ph) * 18} r={p.r} fill={p.c} opacity={0.55 * on} />;
      })}
      {TENTS.map((tt, i) =>
        inView(v, tt.x, tt.y, 300) ? <TentShape key={i} tt={tt} on={clamp01((ci * 1.4 - tt.d * 0.55 - rnd(i) * 0.2) * 3)} glow={glow} /> : null,
      )}
    </svg>
  );
};

/* the gate around the welcome stall */
const Gate: React.FC<{ t: number }> = ({ t }) => {
  const [gx, gy] = boardPos("mission");
  const glow = allGlow(t);
  return (
    <svg style={{ position: "absolute", left: gx - 1700, top: gy - 1500, overflow: "visible" }} width={3400} height={2300}>
      <g fill="none" stroke={C.gold} strokeWidth={10} strokeLinecap="round">
        <path d="M180 2250 V700 M3220 2250 V700" />
        <path d="M120 700 H380 M3020 700 H3280" />
        <path d="M180 700 Q1700 -120 3220 700" />
        <path d="M330 760 Q1700 60 3070 760" strokeWidth={5} opacity={0.6} />
      </g>
      {Array.from({ length: 21 }).map((_, i) => {
        const u = i / 20;
        const x = 180 + u * 3040;
        const y = 700 - Math.sin(u * Math.PI) * 620 + 60;
        return <path key={i} d={`M${x - 40} ${y} L${x + 40} ${y} L${x} ${y + 70} Z`} fill={TENT_COL[i % TENT_COL.length]} opacity={0.85} />;
      })}
      <rect x={1290} y={130} width={820} height={130} rx={65} fill={C.card} stroke={C.gold} strokeWidth={6} />
      <text x={1700} y={218} textAnchor="middle" fontFamily={MARCELLUS} fontSize={76} fill={C.ink}>
        AstroRaaga Mela
      </text>
      {[180, 3220].map((x) => (
        <g key={x}>
          <circle cx={x} cy={640} r={50 + 20 * glow} fill={`rgba(245,158,11,${0.3 + 0.3 * glow})`} />
          <circle cx={x} cy={640} r={22} fill="#FFC85A" />
        </g>
      ))}
    </svg>
  );
};

/* ---------- a stall: canopy, bulbs, board, curtain ---------- */
const scallops = (w: number, n: number, y: number, depth: number) => {
  let d = `M0 ${y}`;
  for (let i = 0; i < n; i++) {
    const x0 = (i / n) * w;
    const x1 = ((i + 1) / n) * w;
    d += ` Q${(x0 + x1) / 2} ${y + depth} ${x1} ${y}`;
  }
  return d;
};

const Canopy: React.FC<{ tone: string; sign: string; num: string; lit: number; glow: number; t: number }> = ({ tone, sign, num, lit, glow, t }) => {
  const W = 2140;
  const n = 14;
  const stripes = Array.from({ length: n }, (_, i) => (
    <path key={i} d={`M${(i / n) * W} 40 L${((i + 1) / n) * W} 40 L${((i + 1) / n) * W} 230 Q${((i + 0.5) / n) * W} 300 ${(i / n) * W} 230 Z`} fill={i % 2 ? "#FFF4E0" : tone} opacity={i % 2 ? 1 : 0.92} />
  ));
  return (
    <svg width={W} height={330} style={{ position: "absolute", left: -110, top: -300, overflow: "visible" }}>
      <path d={`M-20 40 L${W + 20} 40 L${W - 60} -40 L60 -40 Z`} fill={tone} opacity={0.95} />
      {stripes}
      <path d={scallops(W, n, 230, 70)} fill="none" stroke={C.gold} strokeWidth={4} />
      {Array.from({ length: n + 1 }).map((_, i) => {
        const x = (i / n) * W;
        const tw = 0.7 + 0.3 * Math.sin(t * 5 + i);
        return (
          <g key={i}>
            {lit > 0 && <circle cx={x} cy={238} r={30 + 14 * glow} fill={`rgba(245,158,11,${(0.25 + 0.2 * glow) * lit * tw})`} />}
            <circle cx={x} cy={238} r={11} fill={lit > 0.3 ? "#FFC85A" : "#EADFC9"} />
          </g>
        );
      })}
      <g transform={`translate(${W / 2} 92)`}>
        <rect x={-430} y={-62} width={860} height={124} rx={62} fill={C.card} stroke={C.gold} strokeWidth={5} />
        <text x={0} y={22} textAnchor="middle" fontFamily={KARLA} fontWeight={700} fontSize={56} letterSpacing="7" fill={C.ink}>
          <tspan fill={C.goldDeep}>{num}</tspan>
          <tspan dx={22}>{sign.toUpperCase()}</tspan>
        </text>
      </g>
    </svg>
  );
};

const Curtain: React.FC<{ tone: string; sign: string; lift: number }> = ({ tone, sign, lift }) => {
  if (lift >= 1) return null;
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${-lift * 100}%)` }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(90deg, #FFF3DE 0px, #FFF3DE 70px, #F9E6C6 70px, #F9E6C6 140px)`,
        }}
      />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 34, background: tone, opacity: 0.85 }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: MARCELLUS, fontSize: 150, color: C.goldDeep, opacity: 0.85 }}>{sign}</div>
      </div>
    </div>
  );
};

export type BoardDef = {
  id: BoardId;
  /** scene that opens the stall (curtain lifts just before it) */
  open: string;
  /** content time is frozen at this film time once the scene is over */
  freeze: number;
  render: () => React.ReactNode;
};

const Stall: React.FC<{ def: BoardDef; t: number; view: View; num: string; tone: string; sign: string }> = ({ def, t, view, num, tone, sign }) => {
  const [bx, by] = boardPos(def.id);
  // cull stalls that are off screen
  const s = viewScale(view);
  const halfW = 960 / s;
  const halfH = 540 / s;
  if (Math.abs(bx - view.x) > halfW + 1300 || Math.abs(by - view.y) > halfH + 1100) return null;
  const openAt = sc(def.open).start;
  const lift = prog(t, openAt - 0.9, 1.1, easeInOut);
  const lit = Math.max(prog(t, openAt - 0.2, 0.8), lightsJoin(t) > 0.98 ? 1 : 0);
  const glow = allGlow(t);
  const bt = Math.min(t, def.freeze);
  return (
    <div style={{ position: "absolute", left: bx - BW / 2, top: by - BH / 2, width: BW, height: BH }}>
      <div style={{ position: "absolute", left: 40, right: 40, bottom: -70, height: 90, borderRadius: "50%", background: "rgba(124,45,18,0.10)", filter: "blur(18px)" }} />
      <Canopy tone={tone} sign={sign} num={num} lit={lit} glow={glow} t={t} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 22,
          overflow: "hidden",
          border: `3px solid ${C.gold}`,
          boxShadow: `0 30px 80px rgba(124,45,18,0.14), 0 0 ${120 * glow}px rgba(245,158,11,${0.35 * glow})`,
          background: C.bg,
        }}
      >
        {lift > 0 && <AtTime t={bt}>{def.render()}</AtTime>}
        <Curtain tone={tone} sign={sign} lift={lift} />
      </div>
    </div>
  );
};

/* ---------- the world ---------- */
export const World: React.FC<{ boards: BoardDef[]; overlay?: React.ReactNode }> = ({ boards, overlay }) => {
  const t = useWinT();
  const M = React.useMemo(() => moves(), []);
  const v = camAt(t, M);
  const s = viewScale(v);
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, transform: `translate(960px, 540px) scale(${s}) translate(${-v.x}px, ${-v.y}px)` }}>
        <Ground />
        <Lights t={t} v={v} />
        <Field t={t} v={v} />
        <Gate t={t} />
        {boards.map((b) => {
          const r = RING.find((x) => x.id === b.id);
          const n = r ? RING.indexOf(r) + 1 : 0;
          return (
            <Stall
              key={b.id}
              def={b}
              t={t}
              view={v}
              num={b.id === "hub" ? "" : String(n).padStart(2, "0")}
              tone={r ? r.tone : C.gold}
              sign={r ? r.sign : "AstroRaaga"}
            />
          );
        })}
      </div>
      {overlay}
    </AbsoluteFill>
  );
};
