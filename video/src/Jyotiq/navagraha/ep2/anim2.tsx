import React from "react";
import { Easing } from "remotion";
import { GRAD, JAKARTA, MUKTA, S, gradText } from "../ep1/look";
import { CAP_BOTTOM, CAP_TOP } from "../ep1/look";
import { lerp, outBack, outCubic, prog, rnd } from "../ep1/anim";
import { KUNDALI_HOUSES } from "../ep1/anim";
import { PHRASES, WORDS } from "./timing";

/*
 * नवग्रह जन्म Ep2 motion kit: the karaoke caption bound to Ep2's clock (copied from Ep1's KCaption), and the
 * new graphics for the Shani story: Kailash, the trishul sign, Shani's glance, the nine-graha ring, the scales
 * of karma and a Shani kundali for the gochar ending. Pure functions of the frame.
 */

/* Karaoke captions (Ep2 clock) */
const KEY = new Set(["सूर्य।", "सूर्य", "शनि।", "शनि", "छाया", "तप", "शक", "अपमान", "नज़र", "तेज", "शिव", "सच", "वर", "नवग्रहों", "न्याय।", "कुंडली", "गोचर,", "फ़्री", "ज्योतिक़", "नहीं।"]);

/** Bottom caption: one phrase per page, every word visible; the spoken word sits on the saffron gradient. */
export const KCaption2: React.FC<{ f: number; hide?: number[]; bottom?: number }> = ({ f, hide = [], bottom = CAP_BOTTOM }) => {
  let pi = -1;
  for (let i = 0; i < PHRASES.length; i++) {
    const p = PHRASES[i];
    const next = PHRASES[i + 1];
    const end = Math.min(next ? next.a - 2 : 1e9, p.b + 16);
    if (f >= p.a - 2 && f < end) pi = i;
  }
  if (pi < 0 || hide.includes(pi)) return null;
  const P = PHRASES[pi];
  const ws = WORDS.filter((w) => w.p === pi);
  const pop = prog(f, P.a - 2, P.a + 5, outBack);
  const nextA = PHRASES[pi + 1] ? PHRASES[pi + 1].a - 2 : 1e9;
  const fadeOut = 1 - prog(f, Math.min(P.b + 10, nextA - 4), Math.min(P.b + 16, nextA), outCubic);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: CAP_TOP, height: bottom - CAP_TOP, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div
        style={{
          maxWidth: 860,
          padding: "16px 26px 20px",
          borderRadius: 30,
          background: "rgba(255,255,255,0.95)",
          border: `2.5px solid ${S.goldLight}`,
          boxShadow: "0 10px 26px rgba(58,31,18,0.22)",
          textAlign: "center",
          fontFamily: MUKTA,
          fontWeight: 700,
          fontSize: 50,
          lineHeight: 1.3,
          color: S.brown,
          opacity: Math.min(1, pop * 1.4) * fadeOut,
          transform: `scale(${0.88 + 0.12 * pop})`,
          transformOrigin: "50% 100%",
        }}
      >
        {ws.map((w, i) => {
          const cur = f >= w.a - 1 && f < (ws[i + 1] ? ws[i + 1].a - 1 : w.b + 12);
          const said = f >= w.a - 1;
          const key = KEY.has(w.w);
          const k = cur ? prog(f, w.a - 1, w.a + 3, outBack) : 0;
          return (
            <React.Fragment key={i}>
              <span
                style={{
                  display: "inline-block",
                  padding: "0 8px",
                  margin: "2px 0",
                  borderRadius: 14,
                  background: cur ? GRAD : "transparent",
                  color: cur ? "#FFFFFF" : undefined,
                  opacity: said ? 1 : 0.45,
                  transform: `scale(${1 + 0.08 * k})`,
                  boxShadow: cur ? "0 6px 14px rgba(224,72,43,0.35)" : undefined,
                  ...(key && !cur ? { ...gradText, fontWeight: 800 } : {}),
                }}
              >
                {w.w}
              </span>{" "}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};


/** Kailash: a cool dawn sky, snow peaks in three layers, drifting mist. */
export const KailashSet: React.FC<{ f: number; glow?: number }> = ({ f, glow = 0.5 }) => (
  <g>
    <rect width={1080} height={1920} fill="url(#n2Kailash)" />
    <circle cx={540} cy={640} r={420} fill="#FFFFFF" opacity={0.25 + 0.25 * glow} filter="url(#nvBlur20)" />
    <path d="M-40 1060L180 760L300 880L540 520L760 860L880 760L1120 1060Z" fill="#DCE5F2" />
    <path d="M540 520L610 640L570 620L540 700L505 615L470 650Z" fill="#FFFFFF" />
    <path d="M180 760L230 830L200 820L180 860L160 815Z M880 760L930 830L900 820L880 860L860 815Z" fill="#FFFFFF" />
    <path d="M-40 1160L260 960L420 1060L620 900L860 1080L1120 960L1120 1920L-40 1920Z" fill="#B9C7DC" />
    <path d="M-40 1300C200 1240 420 1280 600 1250C800 1220 960 1260 1120 1240L1120 1920L-40 1920Z" fill="#E9EEF6" />
    <path d="M-40 1420C240 1380 460 1410 640 1390C820 1370 980 1400 1120 1390L1120 1920L-40 1920Z" fill="#F6F8FC" />
    {[0, 1, 2].map((i) => (
      <ellipse key={i} cx={((f * (0.6 + 0.2 * i) + i * 400) % 1500) - 200} cy={1180 + i * 90} rx={300} ry={36} fill="#FFFFFF" opacity={0.45} filter="url(#nvBlur6)" />
    ))}
  </g>
);

/** Shiva's trishul as a glowing sign (in the sky during Chhaya's tapas). */
export const Trishul: React.FC<{ x: number; y: number; s?: number; o?: number; f: number }> = ({ x, y, s = 1, o = 1, f }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <circle r={150} fill="#FFFFFF" opacity={0.35 + 0.1 * Math.sin(f / 8)} filter="url(#nvBlur20)" />
    <g fill="none" stroke="#F6F0FF" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round">
      <path d="M0 -150L0 190" />
      <path d="M-70 -120C-74 -40 -40 -10 0 -10C40 -10 74 -40 70 -120" />
      <path d="M0 -150L-16 -110M0 -150L16 -110" />
      <path d="M-70 -120L-84 -96M70 -120L84 -96" />
    </g>
    <path d="M-26 40C-40 60 -40 90 -26 100C-12 90 -12 60 -26 40Z" fill="#F6F0FF" opacity={0.8} />
    <circle cx={22} cy={70} r={18} fill="none" stroke="#F6F0FF" strokeWidth={6} />
  </g>
);

/** Shani's glance: two cool beams from the eyes to a target, drawn on over [a, a + 10]. */
export const GlanceBeam: React.FC<{ f: number; a: number; b: number; x0: number; y0: number; x1: number; y1: number }> = ({ f, a, b, x0, y0, x1, y1 }) => {
  const u = prog(f, a, a + 10, outCubic);
  const o = 1 - prog(f, b - 8, b);
  if (u <= 0 || o <= 0) return null;
  const x = lerp(x0, x1, u);
  const y = lerp(y0, y1, u);
  const w = 26 + 8 * Math.sin(f / 2);
  return (
    <g opacity={o}>
      <path d={`M${x0} ${y0 - 6}L${x} ${y - w}L${x} ${y + w}L${x0} ${y0 + 6}Z`} fill="#AFC2FF" opacity={0.35} filter="url(#nvBlur6)" />
      <line x1={x0} y1={y0} x2={x} y2={y} stroke="#E4EAFF" strokeWidth={6} strokeLinecap="round" opacity={0.9} />
      <circle cx={x0} cy={y0} r={18} fill="#E4EAFF" opacity={0.9} filter="url(#nvBlur6)" />
    </g>
  );
};

const GRAHA = [
  ["#F5A623", "सू"], ["#E8E4D8", "चं"], ["#E0482B", "मं"], ["#6E9B3A", "बु"], ["#F2C14E", "गु"], ["#F49AB4", "शु"], ["#2E3A66", "श"], ["#5B4A8A", "रा"], ["#8C6B4A", "के"],
] as const;
/** The nine grahas in a slowly turning ring; Shani's seat (index 6) lights and grows over [lit, lit + 12]. */
export const NavagrahaRing: React.FC<{ f: number; at: number; lit: number; x: number; y: number; r: number }> = ({ f, at, lit, x, y, r }) => {
  const on = prog(f, lit - 2, lit + 12, outBack);
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill="none" stroke="#E8D9A8" strokeWidth={4} opacity={0.6 * prog(f, at, at + 12)} strokeDasharray="6 14" transform={`rotate(${f * 0.3})`} />
      {GRAHA.map(([c, t], i) => {
        const k = prog(f, at + i * 2, at + i * 2 + 10, outBack);
        const ang = (i / 9) * Math.PI * 2 - Math.PI / 2 + f * 0.004;
        const me = i === 6;
        const rr = (me ? 46 + 26 * on : 40) * k;
        return (
          <g key={i} transform={`translate(${r * Math.cos(ang)} ${r * Math.sin(ang)})`} opacity={me ? 1 : 0.55 + 0.45 * (1 - on)}>
            {me && on > 0 ? <circle r={rr * 2} fill="#8FA8FF" opacity={0.35 * on} filter="url(#nvBlur20)" /> : null}
            <circle r={rr} fill={c} stroke="#FFFFFF" strokeWidth={me ? 6 : 4} />
            {me && on > 0 ? <ellipse rx={rr * 1.5} ry={rr * 0.38} fill="none" stroke="#C9D3FF" strokeWidth={5} transform="rotate(-16)" opacity={on} /> : null}
            <text y={rr * 0.36} textAnchor="middle" fontFamily={MUKTA} fontWeight={800} fontSize={rr * 0.95} fill={i === 1 || i === 4 ? S.brown : "#FFFFFF"}>
              {t}
            </text>
          </g>
        );
      })}
    </g>
  );
};

/** The scales of karma, gold, swinging into balance over [at, at + 30]. */
export const Scales: React.FC<{ f: number; at: number; x: number; y: number; s?: number }> = ({ f, at, x, y, s = 1 }) => {
  const k = prog(f, at - 2, at + 10, outBack);
  if (k <= 0) return null;
  const sw = 14 * Math.exp(-Math.max(0, f - at) / 14) * Math.cos((f - at) / 3.2);
  const pan = (px: number, dy: number) => (
    <g transform={`translate(${px} ${dy})`}>
      <path d="M0 0L-60 130M0 0L60 130" stroke={S.goldDeep} strokeWidth={4} />
      <path d="M-80 130C-60 170 60 170 80 130Z" fill={S.gold} stroke={S.goldDeep} strokeWidth={4} />
    </g>
  );
  const a = (sw * Math.PI) / 180;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * k})`} opacity={Math.min(1, k)}>
      <circle cy={60} r={260} fill="#FFE6A3" opacity={0.35} filter="url(#nvBlur20)" />
      <rect x={-10} y={-20} width={20} height={300} fill={S.goldDeep} rx={8} />
      <path d="M-90 290L90 290L60 260L-60 260Z" fill={S.gold} stroke={S.goldDeep} strokeWidth={4} />
      <circle cy={-30} r={20} fill={S.gold} stroke={S.goldDeep} strokeWidth={4} />
      <g transform={`rotate(${sw})`}>
        <rect x={-210} y={-12} width={420} height={16} rx={8} fill={S.gold} stroke={S.goldDeep} strokeWidth={4} />
      </g>
      {pan(-200 * Math.cos(a), -200 * Math.sin(a))}
      {pan(200 * Math.cos(a), 200 * Math.sin(a))}
    </g>
  );
};

/** Kundali for the gochar ending: Ep1's chart, but the moving graha is Shani (indigo, ringed, "श"). */
export const ShaniKundali: React.FC<{ f: number; at: number; x: number; y: number; size: number; hops: { at: number; house: number }[] }> = ({ f, at, x, y, size, hops }) => {
  const u = prog(f, at, at + 24, Easing.inOut(Easing.cubic));
  const s = size;
  const L = (d: string, w = 6, c: string = S.goldDeep) => <path d={d} stroke={c} strokeWidth={w} fill="none" pathLength={1} strokeDasharray={`${u} 1`} strokeLinecap="round" />;
  let hx = KUNDALI_HOUSES[hops[0].house][0];
  let hy = KUNDALI_HOUSES[hops[0].house][1];
  for (let i = 1; i < hops.length; i++) {
    const v = prog(f, hops[i].at - 9, hops[i].at, Easing.inOut(Easing.cubic));
    if (v > 0) {
      const [px, py] = KUNDALI_HOUSES[hops[i - 1].house];
      const [nx, ny] = KUNDALI_HOUSES[hops[i].house];
      hx = lerp(px, nx, v);
      hy = lerp(py, ny, v) - Math.sin(v * Math.PI) * 0.06;
    }
  }
  const pIn = prog(f, hops[0].at - 6, hops[0].at + 4, outBack);
  const settle = hops[hops.length - 1].at;
  const glow = prog(f, settle, settle + 10) * (0.75 + 0.25 * Math.sin((f - settle) / 4));
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-12} y={-12} width={s + 24} height={s + 24} rx={28} fill="#FFFFFF" opacity={0.9 * Math.min(1, u * 3)} stroke={S.goldLight} strokeWidth={4} />
      <rect x={0} y={0} width={s} height={s} fill="#FFF6E2" opacity={Math.min(1, u * 3)} />
      {L(`M0 0L${s} 0L${s} ${s}L0 ${s}Z`, 8)}
      {L(`M0 0L${s} ${s}M${s} 0L0 ${s}`)}
      {L(`M${s / 2} 0L${s} ${s / 2}L${s / 2} ${s}L0 ${s / 2}Z`)}
      {KUNDALI_HOUSES.map(([hx2, hy2], i) => (
        <text key={i} x={hx2 * s} y={hy2 * s + 12} textAnchor="middle" fontFamily={JAKARTA} fontWeight={700} fontSize={30} fill={S.brownMid} opacity={0.35 * prog(f, at + 14 + i, at + 20 + i)}>
          {i + 1}
        </text>
      ))}
      {pIn > 0 ? (
        <g transform={`translate(${hx * s} ${hy * s - 6}) scale(${pIn})`}>
          <circle r={86} fill="#8FA8FF" opacity={0.25 + 0.3 * glow} filter="url(#nvBlur6)" />
          <circle r={40} fill={S.shani} stroke="#C9D3FF" strokeWidth={4} />
          <ellipse rx={66} ry={16} fill="none" stroke="#C9D3FF" strokeWidth={6} transform="rotate(-16)" />
          <text y={13} textAnchor="middle" fontFamily={MUKTA} fontWeight={800} fontSize={38} fill="#FFFFFF">
            श
          </text>
          {glow > 0.02 ? <circle r={100} fill="none" stroke="#7F93E0" strokeWidth={5} opacity={glow} strokeDasharray="10 10" transform={`rotate(${-f * 2})`} /> : null}
        </g>
      ) : null}
    </g>
  );
};

export const N2Defs: React.FC = () => (
  <defs>
    <linearGradient id="n2Kailash" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#C9D6F0" />
      <stop offset="0.45" stopColor="#F3E9F4" />
      <stop offset="1" stopColor="#FFF4E6" />
    </linearGradient>
    <linearGradient id="n2Cosmos" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#1C2350" />
      <stop offset="0.6" stopColor="#2E3A66" />
      <stop offset="1" stopColor="#4A3A78" />
    </linearGradient>
    <radialGradient id="n2Heat" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
      <stop offset="0.4" stopColor="#FFE08A" stopOpacity="0.6" />
      <stop offset="1" stopColor="#FFB23D" stopOpacity="0" />
    </radialGradient>
  </defs>
);

export { rnd };
