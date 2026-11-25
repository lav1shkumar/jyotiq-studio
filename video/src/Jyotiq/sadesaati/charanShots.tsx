import React from "react";
import { AbsoluteFill, Easing } from "remotion";
import { NebulaPlate, PHASES, ramp, s } from "./charanKit";

const TAN = PHASES[1].color;
const GLOW = `drop-shadow(0 0 8px ${TAN}) drop-shadow(0 0 22px ${TAN})`;

/** S6 (VO 34.15-44.41 s): भाग-दौड़ -> थकान -> WFH ends -> long daily journey. f = local frame. */
export const CommuteShot: React.FC<{ f: number }> = ({ f }) => {
  const A = s(0.28); // भाग-दौड़
  const B = s(1.59); // थकान और सेहत
  const C = s(4.51); // वर्क फ्रॉम होम ...
  const OFF = s(6.3); // ... समाप्त होना
  const D = s(7.25); // हर दिन लंबा सफ़र
  const streaks = ramp(f, A, A + 8) * ramp(f, B, B + 10, 1, 0);
  const pulse = ramp(f, B, B + 10) * ramp(f, C - 8, C, 1, 0);
  const pulseDraw = ramp(f, B, B + 34, 0, 1, Easing.out(Easing.cubic));
  const house = ramp(f, C - 4, C + 8) * ramp(f, D - 8, D, 1, 0);
  const lamp = ramp(f, OFF, OFF + 5, 1, 0.08, Easing.linear);
  const road = ramp(f, D - 6, D + 12);
  const travel = f < D ? 0 : ((f - D) / 60) % 1;
  return (
    <AbsoluteFill>
      <NebulaPlate f={f} seed={11} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, filter: GLOW }}>
        <g opacity={streaks}>
          {[360, 540, 720].map((x, i) => {
            const y = 1240 - ((f * (16 + i * 4) + i * 330) % 980);
            return <line key={x} x1={x} y1={y} x2={x} y2={y + 170} stroke={TAN} strokeWidth={6} strokeLinecap="round" />;
          })}
        </g>
        <path
          d="M 110 780 L 380 780 L 420 780 L 455 690 L 500 880 L 540 780 L 970 780"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - pulseDraw}
          fill="none"
          stroke={TAN}
          strokeWidth={6}
          strokeLinejoin="round"
          opacity={pulse}
        />
        <g opacity={house} fill="none" stroke={TAN} strokeWidth={6} strokeLinejoin="round">
          <polyline points="370,720 540,570 710,720" />
          <rect x={400} y={720} width={280} height={260} rx={6} />
          <rect x={470} y={775} width={140} height={110} rx={4} fill={TAN} fillOpacity={0.9 * lamp} />
          <line x1={540} y1={775} x2={540} y2={885} />
          <line x1={470} y1={830} x2={610} y2={830} />
        </g>
        <g opacity={road} fill="none" stroke={TAN} strokeLinecap="round">
          <line x1={150} y1={1300} x2={520} y2={520} strokeWidth={6} />
          <line x1={930} y1={1300} x2={560} y2={520} strokeWidth={6} />
          <line x1={540} y1={1290} x2={540} y2={540} strokeWidth={5} strokeDasharray="44 56" strokeDashoffset={-f * 7} />
          <ellipse cx={540} cy={515} rx={150} ry={22} strokeWidth={3} opacity={0.6} />
          <circle cx={540} cy={1260 - travel * 720} r={22 - travel * 16} fill="#FFE2C4" stroke="none" opacity={1 - travel * 0.6} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const DHAN = PHASES[2].color;
const GLOW_D = `drop-shadow(0 0 8px ${DHAN}) drop-shadow(0 0 22px ${DHAN})`;

/** S7 (VO 47.74-52.35 s): नए घर की ज़िम्मेदारी -> माता-पिता की सेवा. f = local frame. */
export const HomeShot: React.FC<{ f: number }> = ({ f }) => {
  const A = s(0.27);
  const B = s(2.24);
  const draw = ramp(f, A, A + 26, 0, 1, Easing.out(Easing.cubic));
  const house = ramp(f, B, B + 10, 1, 0.4);
  const care = ramp(f, B, B + 12);
  const flick = (i: number) => 0.85 + 0.15 * Math.sin(f / 2.3 + i * 1.7);
  return (
    <AbsoluteFill>
      <NebulaPlate f={f} seed={23} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, filter: GLOW_D }}>
        <g opacity={house} fill="none" stroke={DHAN} strokeWidth={6} strokeLinejoin="round">
          <path d="M 300 760 L 540 560 L 780 760 L 780 1060 L 300 1060 Z" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
          {[0, 1, 2].map((i) => (
            <rect key={i} x={355 + i * 135} y={810} width={100} height={90} rx={4} fill={DHAN} fillOpacity={0.85 * ramp(f, A + 18 + i * 7, A + 24 + i * 7)} />
          ))}
          <rect x={495} y={940} width={90} height={120} rx={4} opacity={draw} />
        </g>
        <g opacity={care}>
          {[420, 620].map((x, i) => (
            <g key={x}>
              <path d={`M ${x - 46} 1150 Q ${x} 1205 ${x + 46} 1150 Z`} fill="none" stroke={DHAN} strokeWidth={6} />
              <ellipse cx={x} cy={1122 - 4 * flick(i)} rx={13} ry={30 * flick(i)} fill="#FFE7B0" />
            </g>
          ))}
          <path
            d="M 820 1220 L 820 910 Q 820 870 785 870 Q 750 870 750 905"
            fill="none"
            stroke={DHAN}
            strokeWidth={7}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - ramp(f, B + 6, B + 28)}
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** S9 (VO 56.19-64.9 s): भार कितना भारी -> जन्म कुंडली -> चल रही दशा. f = local frame. */
export const KundliShot: React.FC<{ f: number }> = ({ f }) => {
  const A = s(0.28);
  const B = s(3.98);
  const C = s(5.96);
  const scaleO = ramp(f, A, A + 10) * ramp(f, B - 6, B + 6, 1, 0);
  const tilt = 9 * Math.sin((f - A) / 14);
  const kd = ramp(f, B, B + 30, 0, 1, Easing.out(Easing.cubic));
  const ring = ramp(f, C, C + 12);
  const rot = (f - C) * 0.9;
  const dot = ((f - C) / 90) * Math.PI * 2 - Math.PI / 2;
  const [cx, cy, K, R] = [540, 840, 300, 460];
  const kundli = `M ${cx - K} ${cy - K} H ${cx + K} V ${cy + K} H ${cx - K} Z M ${cx - K} ${cy - K} L ${cx + K} ${cy + K} M ${cx + K} ${cy - K} L ${cx - K} ${cy + K} M ${cx} ${cy - K} L ${cx + K} ${cy} L ${cx} ${cy + K} L ${cx - K} ${cy} Z`;
  return (
    <AbsoluteFill>
      <NebulaPlate f={f} seed={31} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, filter: GLOW_D }}>
        <g opacity={scaleO} fill="none" stroke={DHAN} strokeWidth={6} strokeLinecap="round">
          <line x1={540} y1={600} x2={540} y2={1080} />
          <line x1={440} y1={1080} x2={640} y2={1080} />
          <circle cx={540} cy={585} r={14} fill={DHAN} />
          <g transform={`rotate(${tilt} 540 640)`}>
            <line x1={300} y1={640} x2={780} y2={640} />
            {[300, 780].map((x, i) => (
              <g key={x} transform={`rotate(${-tilt} ${x} 640)`}>
                <line x1={x} y1={640} x2={x - 70} y2={790} />
                <line x1={x} y1={640} x2={x + 70} y2={790} />
                <path d={`M ${x - 95} 790 Q ${x} 860 ${x + 95} 790 Z`} fill={DHAN} fillOpacity={0.18 + i * 0.1} />
              </g>
            ))}
          </g>
        </g>
        <path
          d={kundli}
          fill="none"
          stroke={DHAN}
          strokeWidth={5}
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - kd}
          opacity={kd > 0 ? 1 : 0}
        />
        <g opacity={ring}>
          <circle cx={cx} cy={cy} r={R} fill="none" stroke={DHAN} strokeWidth={3} strokeDasharray="18 22" transform={`rotate(${rot} ${cx} ${cy})`} />
          <circle cx={cx + R * Math.cos(dot)} cy={cy + R * Math.sin(dot)} r={16} fill="#FFF1C9" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
