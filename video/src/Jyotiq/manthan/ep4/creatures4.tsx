import React from "react";

/*
 * Episode 4 creatures for "जो बूँदें छलकीं, वो साँपों और बिच्छुओं में समा गईं": a small cobra in
 * Vasuki's colours (Episodes 2-3) and a scorpion, both drawn in the series' cut-out style (flat fill,
 * shade + highlight, dark outline via mCut). `glow` 0..1 = the spilled Halahala soaking into them.
 */
const VK = { body: "#1F5A5A", shade: "#143C3E", belly: "#E9D9A6", hi: "#6FC4B6", line: "#0A1F21" };
const CY = "#40D8E8";

/** Cobra: coiled on the ground, neck raised, hood spread. Origin at the coil's centre on the ground. */
export const Cobra: React.FC<{ f: number; s?: number; glow?: number; rise?: number; facing?: number }> = ({ f, s = 1, glow = 0, rise = 1, facing = 1 }) => {
  const sway = Math.sin(f / 14) * 4 * rise;
  const hx = 18 + sway;
  const hy = -40 - 80 * rise;
  const neck = `M10 -14C24 -30 ${hx - 14} ${hy + 50} ${hx} ${hy + 14}`;
  const flick = Math.sin(f / 5) > 0.7;
  return (
    <g transform={`scale(${facing * s} ${s})`}>
      {glow > 0 ? (
        <g opacity={0.5 * glow}>
          <ellipse cx={0} cy={-8} rx={70} ry={22} fill={CY} filter="url(#mBlur8)" />
          <ellipse cx={hx} cy={hy} rx={34} ry={40} fill={CY} filter="url(#mBlur8)" />
        </g>
      ) : null}
      <g filter="url(#mCut)" strokeLinecap="round" fill="none">
        {/* the coil on the ground: two loops */}
        <path d="M-56 -6C-56 -22 -20 -28 6 -26C40 -24 58 -14 54 -4C50 6 18 10 -10 8C-40 6 -60 2 -56 -6Z" stroke={VK.line} strokeWidth={17} />
        <path d="M-56 -6C-56 -22 -20 -28 6 -26C40 -24 58 -14 54 -4C50 6 18 10 -10 8C-40 6 -60 2 -56 -6Z" stroke={VK.body} strokeWidth={13} />
        <path d="M-40 -10C-36 -18 -10 -20 8 -18C30 -16 40 -10 38 -6" stroke={VK.line} strokeWidth={14} />
        <path d="M-40 -10C-36 -18 -10 -20 8 -18C30 -16 40 -10 38 -6" stroke={VK.body} strokeWidth={10} />
        <path d="M-52 -10C-48 -20 -16 -26 8 -24C36 -22 50 -14 50 -8" stroke={VK.hi} strokeWidth={2.5} opacity={0.55} />
        <path d="M-56 -6C-56 -22 -20 -28 6 -26C40 -24 58 -14 54 -4" stroke={VK.shade} strokeWidth={13} strokeDasharray="0.1 11" opacity={0.6} />
        {/* the raised neck */}
        <path d={neck} stroke={VK.line} strokeWidth={15} />
        <path d={neck} stroke={VK.body} strokeWidth={11} />
        <path d={`M14 -18C26 -32 ${hx - 10} ${hy + 50} ${hx + 2} ${hy + 18}`} stroke={VK.belly} strokeWidth={4} opacity={0.75} />
        {/* the hood */}
        <g transform={`translate(${hx} ${hy}) rotate(${sway * 1.5})`}>
          <path d="M0 26C-18 22 -32 6 -32 -14C-32 -34 -18 -48 0 -50C18 -48 32 -34 32 -14C32 6 18 22 0 26Z" fill={VK.body} stroke={VK.line} strokeWidth={3} />
          <path d="M0 18C-10 14 -18 4 -18 -10C-18 -24 -10 -34 0 -35C10 -34 18 -24 18 -10C18 4 10 14 0 18Z" fill={VK.belly} opacity={0.85} />
          {glow > 0 ? <path d="M0 26C-18 22 -32 6 -32 -14C-32 -34 -18 -48 0 -50C18 -48 32 -34 32 -14C32 6 18 22 0 26Z" fill="none" stroke={CY} strokeWidth={3} opacity={glow} /> : null}
          <path d="M-11 -44C-11 -56 -5 -63 0 -63C5 -63 11 -56 11 -44Z" fill={VK.body} stroke={VK.line} strokeWidth={2.6} />
          <circle cx={-5} cy={-53} r={2.2} fill={glow > 0.4 ? CY : "#FFC23D"} />
          <circle cx={5} cy={-53} r={2.2} fill={glow > 0.4 ? CY : "#FFC23D"} />
          {flick ? <path d="M0 -63L0 -72M0 -72L-4 -77M0 -72L4 -77" stroke="#C2304A" strokeWidth={2} /> : null}
        </g>
      </g>
    </g>
  );
};

const SC = { body: "#2A1630", shade: "#160A1C", hi: "#5A3A66", line: "#0B050E" };

/** Scorpion: claws forward, tail curled over the back, legs in a walk cycle. Origin at the body centre on the ground. */
export const Scorpion: React.FC<{ f: number; s?: number; glow?: number; walk?: number; facing?: number }> = ({ f, s = 1, glow = 0, walk = 1, facing = 1 }) => {
  const step = (i: number) => Math.sin(f / 3 + i * 1.6) * 7 * walk;
  const tailCurl = Math.sin(f / 18) * 0.06;
  // tail: five segments arcing up and forward over the back, then the bulb and the sting
  const tail = Array.from({ length: 6 }, (_, i) => {
    const a = Math.PI * (1.05 - (0.95 + tailCurl) * (i / 5));
    return [-28 + 44 * Math.cos(a) - 6, -8 - 46 * Math.sin(a) * (0.55 + 0.1 * i)];
  });
  const tip = tail[5];
  return (
    <g transform={`scale(${facing * s} ${s})`}>
      {glow > 0 ? <ellipse cx={0} cy={-18} rx={70} ry={40} fill={CY} opacity={0.35 * glow} filter="url(#mBlur8)" /> : null}
      <g filter="url(#mCut)" strokeLinecap="round" fill="none">
        {/* legs: four pairs */}
        {[-16, -4, 8, 20].map((x, i) => (
          <g key={x}>
            <path d={`M${x} -6L${x - 8 + step(i)} 6L${x - 14 + step(i)} 14`} stroke={SC.line} strokeWidth={5} />
            <path d={`M${x} -6L${x - 8 + step(i)} 6L${x - 14 + step(i)} 14`} stroke={SC.body} strokeWidth={3} />
            <path d={`M${x + 2} -10L${x + 10 - step(i + 2)} 2L${x + 16 - step(i + 2)} 12`} stroke={SC.line} strokeWidth={4.5} opacity={0.85} />
          </g>
        ))}
        {/* the tail */}
        {tail.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={7.5 - i * 0.6} fill={SC.body} stroke={SC.line} strokeWidth={2.2} />
        ))}
        <path d={`M${tip[0]} ${tip[1]}C${tip[0] + 10} ${tip[1] - 4} ${tip[0] + 16} ${tip[1] + 4} ${tip[0] + 12} ${tip[1] + 12}`} stroke={glow > 0.3 ? CY : "#C2304A"} strokeWidth={4} />
        <circle cx={tip[0] + 2} cy={tip[1]} r={6} fill={SC.hi} stroke={SC.line} strokeWidth={2} />
        {/* body: carapace + segments */}
        <path d="M-34 -8C-34 -20 -12 -26 12 -24C30 -22 40 -16 40 -8C40 0 24 4 4 4C-18 4 -34 2 -34 -8Z" fill={SC.body} stroke={SC.line} strokeWidth={2.6} />
        {[-20, -8, 4, 16].map((x) => (
          <path key={x} d={`M${x} -22C${x + 2} -14 ${x + 2} -6 ${x} 2`} stroke={SC.shade} strokeWidth={2} />
        ))}
        <path d="M-28 -14C-10 -22 16 -22 34 -14" stroke={SC.hi} strokeWidth={2.4} opacity={0.6} />
        {/* claws */}
        {[-1, 1].map((side) => (
          <g key={side}>
            <path d={`M36 ${-10 + side * 4}L52 ${-16 + side * 10}L64 ${-12 + side * 14}`} stroke={SC.line} strokeWidth={6} />
            <path d={`M36 ${-10 + side * 4}L52 ${-16 + side * 10}L64 ${-12 + side * 14}`} stroke={SC.body} strokeWidth={4} />
            <path d={`M62 ${-14 + side * 14}C72 ${-22 + side * 14} 84 ${-16 + side * 14} 80 ${-8 + side * 14}C74 ${-10 + side * 14} 70 ${-10 + side * 14} 66 ${-8 + side * 14}Z`} fill={SC.body} stroke={SC.line} strokeWidth={2.2} />
          </g>
        ))}
        {glow > 0 ? <path d="M-34 -8C-34 -20 -12 -26 12 -24C30 -22 40 -16 40 -8" stroke={CY} strokeWidth={2.4} opacity={glow} /> : null}
        <circle cx={34} cy={-14} r={1.8} fill={glow > 0.4 ? CY : "#FF5A2A"} />
      </g>
    </g>
  );
};

/** A falling drop of Halahala: a cyan teardrop with a short trail. `stretch` lengthens it while it falls. */
export const PoisonDrop: React.FC<{ r?: number; stretch?: number; glow?: number }> = ({ r = 9, stretch = 1, glow = 1 }) => (
  <g>
    <ellipse cx={0} cy={0} rx={r * 2.4} ry={r * 2.4 * stretch} fill={CY} opacity={0.22 * glow} filter="url(#mBlur8)" />
    <path d={`M0 ${-r * 3 * stretch}C${r * 0.4} ${-r * 1.2} ${r} ${-r * 0.4} ${r} ${r * 0.3}C${r} ${r} ${r * 0.5} ${r * 1.3} 0 ${r * 1.3}C${-r * 0.5} ${r * 1.3} ${-r} ${r} ${-r} ${r * 0.3}C${-r} ${-r * 0.4} ${-r * 0.4} ${-r * 1.2} 0 ${-r * 3 * stretch}Z`} fill="#0E2A44" />
    <path d={`M0 ${-r * 1.6 * stretch}C${r * 0.25} ${-r * 0.6} ${r * 0.6} ${-r * 0.1} ${r * 0.6} ${r * 0.35}C${r * 0.6} ${r * 0.8} ${-r * 0.6} ${r * 0.8} ${-r * 0.6} ${r * 0.35}C${-r * 0.6} ${-r * 0.1} ${-r * 0.25} ${-r * 0.6} 0 ${-r * 1.6 * stretch}Z`} fill={CY} opacity={0.85} />
    <circle cx={-r * 0.3} cy={r * 0.1} r={r * 0.22} fill="#E6FDFF" />
    {stretch > 1.2 ? <path d={`M0 ${-r * 3 * stretch}L0 ${-r * 7 * stretch}`} stroke={CY} strokeWidth={r * 0.35} opacity={0.35} strokeLinecap="round" /> : null}
  </g>
);
