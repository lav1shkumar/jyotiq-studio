/** भारत · विशेष props: the shami tree at the cremation ground, cattle, the sammohana wave, crown shatter, the Jyotiq dasha phone. */
import React from "react";
import { Img, staticFile } from "remotion";
import { P, clamp, lerp, rng } from "./world";

/** The shami tree on the cremation ground (Virata XLI): weapons bound in cloth "like a corpse" high in the branches. */
export const ShamiTree: React.FC<{ f: number; open?: number; glow?: number }> = ({ f, open = 0, glow = 0 }) => {
  const r = rng(77);
  const leaves = Array.from({ length: 70 }, () => ({ x: 120 + r() * 840, y: 260 + r() * 520, s: 40 + r() * 70, k: r() }));
  const sway = Math.sin(f / 30) * 4;
  return (
    <g>
      {/* ground: ash and stones of the cremation ground */}
      <ellipse cx={540} cy={1500} rx={760} ry={160} fill="#3a2a22" opacity={0.6} />
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i} transform={`translate(${160 + i * 150},${1480 + (i % 2) * 40})`}>
          <ellipse cx={0} cy={0} rx={60} ry={14} fill="#5a4a40" />
          <ellipse cx={0} cy={-4} rx={40} ry={8} fill="#8a7a6a" opacity={0.6} />
        </g>
      ))}
      {/* trunk: gnarled */}
      <path d="M500,1500 C510,1300 470,1150 500,980 C520,880 480,800 440,700 L480,690 C530,790 560,870 550,980 C540,1100 600,1300 600,1500 Z" fill="#3a2414" />
      <path d="M520,1000 C620,900 720,820 800,720 L812,736 C740,840 650,930 548,1030 Z" fill="#3a2414" />
      <path d="M500,960 C420,880 330,820 240,780 L236,796 C320,840 410,900 490,990 Z" fill="#3a2414" />
      <path d="M530,1500 C540,1300 510,1150 530,990" stroke="#5a3a20" strokeWidth={6} fill="none" opacity={0.6} />
      {/* canopy: feathery small-leaved clusters */}
      <g transform={`rotate(${sway * 0.3},540,1000)`}>
        {leaves.map((l, i) => (
          <ellipse key={i} cx={l.x} cy={l.y} rx={l.s} ry={l.s * 0.55} fill={l.k > 0.6 ? "#6f7a3a" : l.k > 0.3 ? "#55602c" : "#3e4a22"} opacity={0.92} />
        ))}
        {leaves.slice(0, 30).map((l, i) => (
          <ellipse key={`h${i}`} cx={l.x + 10} cy={l.y - 10} rx={l.s * 0.5} ry={l.s * 0.25} fill="#c9b060" opacity={0.35} />
        ))}
        {/* the bundle: long, wrapped in cloth and bound with rope */}
        <g transform={`translate(640,820) rotate(-18)`}>
          <ellipse cx={0} cy={0} rx={200} ry={60} fill="#fff4c8" opacity={glow * 0.8} filter="url(#sp-blur24)" />
          <rect x={-170} y={-34} width={340} height={68} rx={30} fill={open > 0 ? "#c8b898" : "#b8a888"} opacity={1 - open * 0.7} />
          {[-120, -60, 0, 60, 120].map((bx) => (
            <rect key={bx} x={bx - 4} y={-38} width={8} height={76} fill="#6a5030" opacity={1 - open} />
          ))}
          {open > 0 && (
            <g opacity={open}>
              <path d="M-200,10 C-100,-90 100,-90 200,10" stroke="url(#sp-goldH)" strokeWidth={14} fill="none" />
              <path d="M-200,10 L200,10" stroke="#fff4dc" strokeWidth={2} />
              <circle cx={-200} cy={10} r={8} fill={P.gold} />
              <circle cx={200} cy={10} r={8} fill={P.gold} />
            </g>
          )}
        </g>
      </g>
      {/* rays from the Gandiva */}
      {glow > 0 && (
        <g opacity={glow} filter="url(#sp-blur24)">
          {Array.from({ length: 10 }, (_, i) => (
            <polygon key={i} transform={`translate(640,820) rotate(${i * 36 + f})`} points="0,0 900,-40 900,40" fill="#fff0c0" opacity={0.25} />
          ))}
        </g>
      )}
    </g>
  );
};

/** A herd of humped white cattle (Virata's kine) drawn small for wides. */
export const Cattle: React.FC<{ x0: number; x1: number; y: number; s: number; f: number; n?: number; seed?: number; flee?: number }> = ({ x0, x1, y, s, f, n = 40, seed = 8, flee = 0 }) => {
  const r = rng(seed);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x = lerp(x0, x1, r()) + flee * Math.sin(i) * 40;
        const yy = y + r() * 120 * s;
        const sc = s * (0.7 + (yy - y) / (240 * s) * 0.5);
        const dir = r() > 0.5 ? 1 : -1;
        const step = Math.sin(f / 5 + i) * 2;
        const c = r() > 0.25 ? "#f2ece2" : "#c9a882";
        return (
          <g key={i} transform={`translate(${x},${yy}) scale(${sc * dir},${sc})`}>
            <ellipse cx={0} cy={-26} rx={30} ry={14} fill={c} />
            <path d="M-6,-40 C0,-50 10,-48 12,-38 Z" fill={c} />
            <path d="M26,-32 C36,-40 46,-40 50,-30 C48,-22 40,-20 30,-22 Z" fill={c} />
            <path d="M40,-40 l4,-10 M46,-38 l8,-8" stroke="#8a7a60" strokeWidth={2.4} />
            {[-20, -10, 14, 22].map((lx, k) => (
              <line key={k} x1={lx} y1={-16} x2={lx + (k % 2 ? step : -step)} y2={0} stroke={c} strokeWidth={4} />
            ))}
            <path d="M-30,-28 q-8,10 -4,22" stroke={c} strokeWidth={2} fill="none" />
          </g>
        );
      })}
    </g>
  );
};

/** The sammohana weapon: a violet-white ring wave sweeping out over the army. */
export const SleepWave: React.FC<{ cx: number; cy: number; p: number }> = ({ cx, cy, p }) => {
  if (p <= 0 || p >= 1.3) return null;
  return (
    <g>
      {[0, 0.12, 0.24].map((d, i) => {
        const q = clamp(p - d);
        if (q <= 0) return null;
        return (
          <ellipse key={i} cx={cx} cy={cy} rx={q * 1400} ry={q * 360} fill="none" stroke={i === 0 ? "#f4f0ff" : "#b9a6ff"} strokeWidth={40 * (1 - q) + 6} opacity={(1 - q) * 0.85} filter="url(#sp-blur10)" />
        );
      })}
      <ellipse cx={cx} cy={cy} rx={p * 900} ry={p * 220} fill="#d9ccff" opacity={0.25 * (1 - clamp(p))} filter="url(#sp-blur24)" />
    </g>
  );
};

/** Gold shards of a broken crown flying apart. */
export const CrownShatter: React.FC<{ x: number; y: number; p: number; s?: number }> = ({ x, y, p, s = 1 }) => {
  if (p <= 0) return null;
  const r = rng(91);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <circle cx={0} cy={0} r={60 + p * 200} fill="#fff6d0" opacity={Math.max(0, 0.9 - p * 1.6)} filter="url(#sp-blur10)" />
      {Array.from({ length: 22 }, (_, i) => {
        const a = r() * Math.PI * 2;
        const v = 180 + r() * 420;
        const px = Math.cos(a) * v * p;
        const py = Math.sin(a) * v * p + 600 * p * p;
        const rot = r() * 720 * p;
        const sz = 10 + r() * 26;
        return <path key={i} transform={`translate(${px},${py}) rotate(${rot})`} d={`M0,${-sz} L${sz * 0.6},0 L0,${sz * 0.7} L${-sz * 0.5},0 Z`} fill={i % 4 === 0 ? "#c0232e" : i % 5 === 0 ? "#2f9a52" : "url(#sp-gold)"} />;
      })}
    </g>
  );
};

/** The Jyotiq app moment: a phone showing a dasha timeline (illustrative, no invented numbers). */
export const DashaPhone: React.FC<{ x: number; y: number; s: number; p: number; f: number }> = ({ x, y, s, p, f }) => {
  const bars = [
    { n: "शनि", c: "#4a5a9a" },
    { n: "बुध", c: "#2f9a52" },
    { n: "केतु", c: "#8a5a3a" },
    { n: "शुक्र", c: "#e0a0c0" },
    { n: "सूर्य", c: "#f2a020" },
  ];
  const hi = Math.floor(f / 18) % bars.length;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} opacity={clamp(p * 1.5)}>
      <rect x={-210} y={-420} width={420} height={840} rx={56} fill="#140c08" stroke="#f3c24f" strokeWidth={4} />
      <rect x={-188} y={-396} width={376} height={792} rx={40} fill="#fff6e6" />
      <foreignObject x={-170} y={-372} width={340} height={80}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Img src={staticFile("jyotiq/logo-zodiac.png")} style={{ width: 56, height: 56, borderRadius: 28 }} />
          <div style={{ fontFamily: "sans-serif", fontWeight: 800, fontSize: 30, color: "#3a1a0a" }}>Jyotiq</div>
        </div>
      </foreignObject>
      <text fontFamily="Tiro Devanagari Hindi" x={0} y={-230} textAnchor="middle" fontSize={44} fontWeight={800} fill="#3a1a0a">आपकी दशा</text>
      <text fontFamily="Tiro Devanagari Hindi" x={0} y={-186} textAnchor="middle" fontSize={24} fill="#7a5a3a">विंशोत्तरी · फ़्री</text>
      {bars.map((b, i) => {
        const w = clamp(p * 2 - i * 0.15) * 300;
        return (
          <g key={i} transform={`translate(-150,${-130 + i * 92})`}>
            <rect x={0} y={0} width={300} height={62} rx={14} fill="#f1e4cf" />
            <rect x={0} y={0} width={w} height={62} rx={14} fill={b.c} opacity={i === hi ? 1 : 0.75} />
            <text fontFamily="Tiro Devanagari Hindi" x={20} y={42} fontSize={30} fontWeight={700} fill="#fff">{b.n}</text>
            {i === hi && <rect x={-6} y={-6} width={312} height={74} rx={18} fill="none" stroke="#f3c24f" strokeWidth={5} />}
          </g>
        );
      })}
    </g>
  );
};
