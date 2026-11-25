import React from "react";
import { P } from "../style";

/* Episode 2 beings: Vasuki (the serpent rope) and Mandar Parvat (the churning rod). */

export type V2 = { x: number; y: number };

const VK = { body: "#1F5A5A", shade: "#143C3E", belly: "#E9D9A6", scale: "#0E2E30", hi: "#6FC4B6", line: "#0A1F21" };
const hash = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/** Catmull-Rom curve through control points, sampled n times. */
export const spline = (cp: V2[], n: number): V2[] => {
  const out: V2[] = [];
  const seg = cp.length - 1;
  for (let i = 0; i < n; i++) {
    const u = (i / (n - 1)) * seg;
    const k = Math.min(seg - 1, Math.floor(u));
    const t = u - k;
    const p0 = cp[Math.max(0, k - 1)];
    const p1 = cp[k];
    const p2 = cp[k + 1];
    const p3 = cp[Math.min(cp.length - 1, k + 2)];
    const t2 = t * t;
    const t3 = t2 * t;
    const f = (a: number, b: number, c: number, d: number) =>
      0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
    out.push({ x: f(p0.x, p1.x, p2.x, p3.x), y: f(p0.y, p1.y, p2.y, p3.y) });
  }
  return out;
};

/** Helix around a vertical mountain. front[i] says whether sample i passes in front of it. */
export const coil = (cx: number, yTop: number, yBot: number, halfW: (y: number) => number, turns: number, n: number, th0 = Math.PI / 2) => {
  const pts: V2[] = [];
  const front: boolean[] = [];
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1);
    const th = th0 + u * turns * 2 * Math.PI;
    const y = yBot + (yTop - yBot) * u + Math.cos(th) * 16; // front loops sit a little lower
    pts.push({ x: cx + Math.sin(th) * (halfW(y) + 24), y });
    front.push(Math.cos(th) > 0);
  }
  return { pts, front };
};

/** Contiguous runs of front/back samples, overlapped by one sample so the seams close. */
export const runs = (front: boolean[]) => {
  const out: { i0: number; i1: number; front: boolean }[] = [];
  let start = 0;
  for (let i = 1; i <= front.length; i++) {
    if (i === front.length || front[i] !== front[start]) {
      out.push({ i0: Math.max(0, start - 1), i1: Math.min(front.length - 1, i), front: front[start] });
      start = i;
    }
  }
  return out;
};

const normalAt = (s: V2[], i: number) => {
  const a = s[Math.max(0, i - 1)];
  const b = s[Math.min(s.length - 1, i + 1)];
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  return { tx: dx / len, ty: dy / len, nx: -dy / len, ny: dx / len };
};

/** Closed ribbon along samples i0..i1 with half-width rad(i) and sideways offset off(i). */
const ribbon = (s: V2[], i0: number, i1: number, rad: (i: number) => number, off: (i: number) => number = () => 0) => {
  const L: string[] = [];
  const R: string[] = [];
  for (let i = i0; i <= i1; i++) {
    const { nx, ny } = normalAt(s, i);
    const r = rad(i);
    const cx = s[i].x + nx * off(i);
    const cy = s[i].y + ny * off(i);
    L.push(`${(cx + nx * r).toFixed(1)} ${(cy + ny * r).toFixed(1)}`);
    R.push(`${(cx - nx * r).toFixed(1)} ${(cy - ny * r).toFixed(1)}`);
  }
  return `M${L.join("L")}L${R.reverse().join("L")}Z`;
};

/** Vasuki's body between samples i0..i1 (tail = sample 0, head = last). R = widest half-width. */
export const SerpentBody: React.FC<{ s: V2[]; i0?: number; i1?: number; R: number }> = ({ s, i0 = 0, i1, R }) => {
  const last = s.length - 1;
  const end = i1 ?? last;
  const rad = (i: number) => {
    const g = i / last;
    return R * (0.18 + 0.82 * Math.min(1, g / 0.32)) * (g > 0.97 ? 0.9 : 1);
  };
  const chev: string[] = [];
  for (let i = Math.max(i0, 2); i <= end; i += 6) {
    const { tx, ty, nx, ny } = normalAt(s, i);
    const r = rad(i);
    const p = s[i];
    chev.push(
      `M${(p.x + nx * r * 0.72).toFixed(1)} ${(p.y + ny * r * 0.72).toFixed(1)}` +
        `L${(p.x + tx * r * 0.42).toFixed(1)} ${(p.y + ty * r * 0.42).toFixed(1)}` +
        `L${(p.x - nx * r * 0.72).toFixed(1)} ${(p.y - ny * r * 0.72).toFixed(1)}`,
    );
  }
  const bands = [0.88, 0.93].map((g) => Math.round(g * last)).filter((i) => i >= i0 && i + 2 <= end);
  return (
    <g>
      <path d={ribbon(s, i0, end, (i) => rad(i) + 3)} fill={VK.line} />
      <path d={ribbon(s, i0, end, rad)} fill={VK.body} />
      <path d={ribbon(s, i0, end, (i) => rad(i) * 0.4, (i) => -rad(i) * 0.55)} fill={VK.shade} opacity={0.7} />
      <path d={ribbon(s, i0, end, (i) => rad(i) * 0.3, (i) => rad(i) * 0.58)} fill={VK.belly} />
      <path d={ribbon(s, i0, end, (i) => rad(i) * 0.14, (i) => -rad(i) * 0.18)} fill={VK.hi} opacity={0.45} />
      <path d={chev.join("")} stroke={VK.scale} strokeWidth={2.4} fill="none" opacity={0.55} strokeLinejoin="round" />
      {bands.map((i) => (
        <path key={i} d={ribbon(s, i, i + 2, (k) => rad(k) + 1.5)} fill="url(#mGold)" />
      ))}
    </g>
  );
};

/** Head angle (degrees) so the head's local "up" follows the body's last tangent. */
export const headAngle = (s: V2[]) => {
  const a = s[s.length - 3];
  const b = s[s.length - 1];
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI + 90;
};

/** Vasuki's head seen from the front: royal hood, nagamani, glowing eyes. */
export const VasukiHead: React.FC<{
  at: V2;
  ang: number;
  s?: number;
  t: number;
  hood?: number;
  eye?: number;
  tongue?: number;
  smoke?: number;
  gem?: number;
}> = ({ at, ang, s = 1, t, hood = 1, eye = 1, tongue = 0, smoke = 0, gem = 1 }) => {
  const gl = 0.6 + 0.4 * Math.sin(t / 8);
  const spread = 0.55 + 0.45 * hood;
  return (
    <g transform={`translate(${at.x} ${at.y}) rotate(${ang}) scale(${s})`}>
      <g transform={`scale(${spread} 1)`}>
        <path d="M-16 40C-22 0 -88 -20 -96 -80C-104 -150 -52 -196 0 -196C52 -196 104 -150 96 -80C88 -20 22 0 16 40Z" fill={VK.line} />
        <path d="M-12 36C-18 0 -82 -22 -89 -80C-96 -144 -48 -188 0 -188C48 -188 96 -144 89 -80C82 -22 18 0 12 36Z" fill={VK.body} />
        <path d="M-8 30C-12 0 -56 -24 -60 -76C-64 -126 -30 -160 0 -160C30 -160 64 -126 60 -76C56 -24 12 0 8 30Z" fill={VK.belly} />
        <path
          d="M-30 -96C-44 -96 -48 -116 -34 -122C-22 -126 -12 -112 0 -112C12 -112 22 -126 34 -122C48 -116 44 -96 30 -96C18 -96 12 -106 0 -106C-12 -106 -18 -96 -30 -96Z"
          fill={VK.shade} opacity={0.8}
        />
        {[-44, -14, 14].map((y) => (
          <path key={y} d={`M-40 ${y}Q0 ${y + 12} 40 ${y}`} stroke={VK.scale} strokeWidth={2.5} fill="none" opacity={0.45} />
        ))}
        <path d="M-89 -80C-96 -144 -48 -188 0 -188C48 -188 96 -144 89 -80" stroke="url(#mGold)" strokeWidth={5} fill="none" />
      </g>
      <g transform="translate(0 -184) scale(1.35)">
        <path d="M-34 4C-40 -30 -24 -62 0 -66C24 -62 40 -30 34 4C24 18 -24 18 -34 4Z" fill={VK.body} stroke={VK.line} strokeWidth={3} />
        <path d="M-20 0C-22 -20 -12 -40 0 -42C12 -40 22 -20 20 0C12 8 -12 8 -20 0Z" fill={VK.hi} opacity={0.32} />
        {[-1, 1].map((sd) => (
          <g key={sd} transform={`translate(${sd * 16} -22)`}>
            <ellipse rx={8.5} ry={6 * eye + 0.6} fill="#FFC23D" filter="url(#mGlow)" opacity={0.6 + 0.4 * gl} />
            <ellipse rx={1.9} ry={5 * eye + 0.3} fill="#140A02" />
          </g>
        ))}
        <path d="M-7 8L-4 10M7 8L4 10" stroke={VK.line} strokeWidth={2.4} strokeLinecap="round" />
        {tongue > 0.02 ? (
          <path
            d={`M0 14L0 ${14 + 24 * tongue}M0 ${14 + 24 * tongue}L-6 ${20 + 30 * tongue}M0 ${14 + 24 * tongue}L6 ${20 + 30 * tongue}`}
            stroke="#D9283A" strokeWidth={2.6} strokeLinecap="round" fill="none"
          />
        ) : null}
        {/* nagamani: the serpent king's jewel */}
        <g transform="translate(0 -56)" opacity={gem}>
          <circle r={18} fill="#FF4D6D" opacity={0.4 * gl} filter="url(#mBlur8)" />
          <path d="M0 -13L11 0L0 13L-11 0Z" fill="url(#mGold)" />
          <path d="M0 -9L7.5 0L0 9L-7.5 0Z" fill="#FF3D63" />
          <path d="M0 -9L7.5 0L0 0Z" fill="#FFFFFF" opacity={0.45} />
        </g>
        {/* smoke from the nostrils: the hint that fire waits in this serpent's breath */}
        {smoke > 0.01 ? (
          <g opacity={smoke}>
            {[-1, 1].map((sd, k) => {
              const w = Math.sin(t / 7 + k * 2.1) * 5;
              return (
                <g key={sd}>
                  <path d={`M${sd * 6} 9C${sd * 22 + w} 14 ${sd * 40 + w} 8 ${sd * 52 + w} -2C${sd * 60 + w} -8 ${sd * 70} -6 ${sd * 78 + w} -14`} stroke="#B9ABA4" strokeWidth={7} strokeLinecap="round" fill="none" opacity={0.42} />
                  <path d={`M${sd * 6} 9C${sd * 18 + w} 13 ${sd * 30 + w} 10 ${sd * 38 + w} 2`} stroke="#E8A06A" strokeWidth={3.5} strokeLinecap="round" fill="none" opacity={0.55} />
                </g>
              );
            })}
          </g>
        ) : null}
      </g>
    </g>
  );
};

/* ---------------------------------------------------------------------- Mandar */

/** Half-width of Mandar at height y (origin at the base centre, y negative upward). */
export const mandarHalfW = (y: number) => 270 * Math.pow(Math.max(0, 1 + y / 1250), 0.9);

/** Mandar Parvat: golden rock spire with forest bands. crack/roots for the uprooting. */
export const Mandar: React.FC<{ t: number; crack?: number; roots?: number; glow?: number }> = ({ t, crack = 0, roots = 0, glow = 0.5 }) => {
  const sil = "M-270 0C-240 -260 -170 -620 -90 -1000C-60 -1150 -30 -1240 0 -1250C30 -1240 60 -1150 90 -1000C170 -620 240 -260 270 0Z";
  const shade = "M0 -1250C30 -1240 60 -1150 90 -1000C170 -620 240 -260 270 0L60 0C80 -320 50 -760 0 -1250Z";
  const strata = [-1060, -900, -740, -580, -420, -260, -110];
  const forests = [-960, -800, -640, -480, -320, -150];
  const gl = 0.7 + 0.3 * Math.sin(t / 10);
  return (
    <g>
      {roots > 0.01 ? (
        <g opacity={roots}>
          {Array.from({ length: 9 }).map((_, i) => {
            const x = -220 + i * 55;
            const len = 60 + hash(i) * 90;
            const sw = Math.sin(t / 9 + i) * 8;
            return <path key={i} d={`M${x} -6C${x + 10} ${len * 0.4} ${x - 14 + sw} ${len * 0.7} ${x + sw} ${len}`} stroke="#5A3A1E" strokeWidth={10 - (i % 3) * 2} strokeLinecap="round" fill="none" />;
          })}
          <path d="M-250 -10Q0 60 250 -10L230 20Q0 80 -230 20Z" fill="#6E4A2A" />
        </g>
      ) : null}
      <path d={sil} fill="#B08A43" />
      <path d={shade} fill="#7E5E2A" opacity={0.85} />
      <path d="M-270 0C-240 -260 -170 -620 -90 -1000C-60 -1150 -30 -1240 0 -1250" stroke="#E9C77A" strokeWidth={6} fill="none" opacity={0.6} />
      {strata.map((y) => {
        const w = mandarHalfW(y);
        return <path key={y} d={`M${-w * 0.96} ${y}Q${-w * 0.2} ${y + 26} ${w * 0.96} ${y - 6}`} stroke="#E2B45A" strokeWidth={4} fill="none" opacity={0.45} />;
      })}
      {forests.map((y, b) => {
        const w = mandarHalfW(y);
        const count = 4 + Math.round(w / 60);
        return (
          <g key={y}>
            {Array.from({ length: count }).map((_, i) => {
              const x = -w * 0.86 + (i / Math.max(1, count - 1)) * w * 1.7 + (hash(b * 31 + i) - 0.5) * 14;
              const r = 14 + hash(b * 17 + i) * 12 + w * 0.02;
              return (
                <g key={i} transform={`translate(${x.toFixed(1)} ${(y - 6 + hash(i + b) * 10).toFixed(1)})`}>
                  <circle cx={-r * 0.6} cy={0} r={r * 0.8} fill="#284E2A" />
                  <circle cx={r * 0.6} cy={0} r={r * 0.8} fill="#284E2A" />
                  <circle cx={0} cy={-r * 0.5} r={r} fill="#356B36" />
                  <circle cx={-r * 0.3} cy={-r * 0.8} r={r * 0.45} fill="#4F8F45" opacity={0.8} />
                </g>
              );
            })}
          </g>
        );
      })}
      <ellipse cx={0} cy={-1180} rx={70} ry={50} fill="#FFE7A0" opacity={0.35 * glow * gl} filter="url(#mBlur8)" />
      <path d="M-46 -1170C-24 -1226 24 -1226 46 -1170C22 -1150 -22 -1150 -46 -1170Z" fill="#FFE7A0" opacity={0.92} />
      <path d="M-20 -1200C-8 -1222 8 -1222 20 -1200" stroke={P.gold} strokeWidth={4} fill="none" />
      {crack > 0.01 ? (
        <g opacity={crack}>
          <path d="M-200 -40L-160 -120L-180 -190L-120 -260L-140 -330M60 -20L90 -110L60 -170L110 -250M180 -60L150 -140L200 -210" stroke="#2A1A0C" strokeWidth={7} strokeLinejoin="round" fill="none" />
          <path d="M-200 -40L-160 -120L-180 -190L-120 -260M60 -20L90 -110L60 -170" stroke="#FFD27A" strokeWidth={2} strokeLinejoin="round" fill="none" opacity={0.6} />
        </g>
      ) : null}
    </g>
  );
};
