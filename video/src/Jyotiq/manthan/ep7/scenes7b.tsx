import React from "react";
import { ImpostorSmoke, SVARDEVA } from "../ep6/cast6";
import { MohiniStanding } from "../ep6/mohini";
import { AmritCup } from "../ep6/props6";
import { World } from "../kit";
import { handToWorld, pose, Puppet } from "../rig";
import { Kalash, KshiraSagar, Motes, Vignette } from "../sets";
import { H, ramp, track, W } from "../style";
import { cue7, span7 } from "./kit7";
import { DevaRow7, ROW, ROW_EYE_Y } from "./row7";
import { BEATS, SCENES } from "./timing";

type P2 = [number, number];

/*
 * Episode 7, scene 2, over line 02 ("देवताओं की पंक्ति में छिपा बैठा था... असुर स्वर्भानु।").
 * Picks up exactly where TitleBed7 leaves the frame: the same dim Kshira Sagar and devas' row, which rises from
 * its title position (shifted 290 px down) into place over the first 20 frames while the camera pushes in on
 * the impostor's face (1.04 to 1.3) with a slight drift. Surya and Chandra smile, unaware. On 'स्वर्भानु' the red
 * glint flashes in his slit eyes, the smoke at his feet swells and a soft violet pulse washes the frame; the
 * name card (NameCard7, HTML) lands on the same cue in the empty sky above them.
 * Placeholder defaults: row 150-270, 'स्वर्भानु' 235.
 */
export const RowScene7: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = span7(SCENES, "row", [150, 270]);
  const sv = cue7("svarbhanu", 235);
  const shift = 290 * (1 - ramp(f, a, a + 20, "out"));
  const z = track(f, [[a, 1.04], [b, 1.3, "io"]]);
  const drift = track(f, [[a, 0], [b, -20, "io"]]);
  const fx = 540;
  const fy = ROW_EYE_Y + 40; // the impostor's face
  const glint = Math.max(0, 1 - Math.abs(f - sv - 4) / 8);
  const pulse = Math.max(0, 1 - Math.abs(f - sv - 2) / 12);
  return (
    <World>
      <g transform={`translate(${fx + drift} ${fy}) scale(${z}) translate(${-fx} ${-fy})`}>
        <KshiraSagar f={f} cam={{ x: 0, y: 0, z: 1.05 }} glow={0.3} swell={0.3} />
        <rect x={-200} width={W + 400} height={H} fill="#0A0814" opacity={0.5} />
        <g transform={`translate(0 ${shift})`}>
          <ellipse cx={540} cy={1300} rx={520} ry={600} fill="#FFE6A3" opacity={0.14} filter="url(#mBlur8)" />
          <DevaRow7 id="rs7" f={f} glint={glint} smoke={0.8 + 0.2 * pulse} />
        </g>
        <Motes f={f} n={14} seed="rs7m" color="#C9B4FF" dir={-1} speed={0.4} size={3} o={0.5} />
      </g>
      <rect width={W} height={H} fill="#5A2A9A" opacity={0.18 * pulse} />
      <Vignette o={0.75} />
    </World>
  );
};

const mixP = (a: P2, b: P2, k: number): P2 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
/** p rotated by deg (SVG sense, clockwise +) about c. */
const rotAbout = (p: P2, c: P2, deg: number): P2 => {
  const r = (deg * Math.PI) / 180;
  const dx = p[0] - c[0];
  const dy = p[1] - c[1];
  return [c[0] + dx * Math.cos(r) - dy * Math.sin(r), c[1] + dx * Math.sin(r) + dy * Math.cos(r)];
};

/** The amrit leaving the kalash lip and falling into the cup: a quadratic arc drawn to fraction t, with a glow. */
const PourStream7: React.FC<{ a: P2; b: P2; dir: number; t: number; f: number }> = ({ a, b, dir, t, f }) => {
  if (t <= 0.01) return null;
  const c: P2 = [a[0] + dir * 46, a[1] + 8];
  const d = `M${a[0]} ${a[1]}Q${c[0]} ${c[1]} ${b[0]} ${b[1]}`;
  const shimmer = 0.85 + 0.15 * Math.sin(f / 2);
  return (
    <g>
      <path d={d} pathLength={1} strokeDasharray={`${t} 1`} stroke="#FFC94D" strokeWidth={22} fill="none" strokeLinecap="round" opacity={0.45 * shimmer} filter="url(#mBlur8)" />
      <path d={d} pathLength={1} strokeDasharray={`${t} 1`} stroke="#FFF3C9" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.95} />
    </g>
  );
};

/*
 * Episode 7, scene 3, over line 03 ("मोहिनी ने अमृत डाला... और उसने घूँट भर लिया।") and the sip beat.
 * A closer two-shot: the disguised Svarbhanu on the viewer's left holding his cup low, a sly smile; Mohini on
 * the right raises the kalash from her chest and tips it to -70 deg over his cup, leaning in (the kalash sits in
 * her rotated group so her hands stay on it), and from 'डाला' the glowing amrit arcs from the kalash lip (its
 * mouth is at local (0, -160) in sets.tsx) down into the cup. He lifts the cup to his lips (the cup rides
 * handToWorld of the arm pose), and on 'घूँट' tips it and closes his eyes. On the sip beat a gold glow runs from
 * his mouth down to the neck and throbs there: the amrit has reached his throat. Slow push in.
 * Placeholder defaults: pour 270-390, 'डाला' 300, 'घूँट' 345, sip beat 378-390.
 */
export const PourScene7: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = span7(SCENES, "pour", [270, 390]);
  const [s0] = span7(BEATS, "sip", [378, 390]);
  const dala = cue7("dala", 300);
  const ghoont = cue7("ghoont", 345);
  const z = track(f, [[a, 1.0], [b, 1.12, "io"]]);
  // Mohini: kalash upright at her chest, then tipped over his cup; her wrists follow the kalash
  const ms = 0.9;
  const mx = 760;
  const my = 1720;
  // the pour, the fill and the lift all fit between 'डाला' and 'घूँट' (only 24 frames apart on the real takes:
  // the first art-test timing had 45, and a fixed 'dala + 30' lift start inverted the ramp)
  const g = Math.max(12, ghoont - dala);
  const fillEnd = dala + Math.round(0.5 * g);
  const tilt = ramp(f, a + 6, dala - 2, "out") * (1 - ramp(f, fillEnd + 2, fillEnd + 16, "out"));
  const ks = 0.42;
  const K = mixP([730, 1300], [700, 1230], tilt); // kalash base, before her lean
  const kDeg = -70 * tilt;
  const lean = -6 * tilt;
  const hands: [P2, P2] = [mixP([-73, -494], [-117, -550], tilt), mixP([7, -494], [-67, -544], tilt)];
  const kr = (kDeg * Math.PI) / 180;
  const lip = rotAbout([K[0] + 160 * ks * Math.sin(kr), K[1] - 160 * ks * Math.cos(kr)], [mx, my], lean);
  // the disguised Svarbhanu: cup held low while it fills, lifted to his lips by 'घूँट'
  const at = { x: 330, y: 1560, s: 1.2, facing: 1 };
  const lift = ramp(f, fillEnd + 2, Math.max(fillEnd + 6, ghoont), "out");
  const sip = ramp(f, ghoont - 4, ghoont + 6, "out");
  const p = pose({ sF: 25 + 63 * lift, eF: 55 + 96 * lift, smile: 0.3 + 0.3 * sip, lookX: 0.6, blink: 0.7 * sip });
  const [cx, cy] = handToWorld(p, at);
  const cs = 0.9;
  const fill = ramp(f, dala + 2, fillEnd, "out");
  const reach = ramp(f, dala - 2, dala + 5, "out");
  const streamO = 1 - ramp(f, fillEnd, fillEnd + 6, "out");
  // the sip beat: a gold glow runs from his mouth to the neck, then throbs there
  const mouth: P2 = [at.x + 25 * at.s, at.y - 255 * at.s];
  const neck: P2 = [at.x + 6 * at.s, at.y - 224 * at.s];
  const run = ramp(f, s0, s0 + 8, "out");
  const glowOn = f >= s0;
  const gx = mouth[0] + (neck[0] - mouth[0]) * run;
  const gy = mouth[1] + (neck[1] - mouth[1]) * run;
  const throb = 0.7 + 0.3 * Math.sin((f - s0) / 2.5);
  return (
    <World>
      <g transform={`translate(480 1300) scale(${z}) translate(-480 -1300)`}>
        <KshiraSagar f={f} cam={{ x: 0, y: 0, z: 1 }} glow={0.45} swell={0.3} />
        <rect x={-200} width={W + 400} height={H} fill="#1A0F2A" opacity={0.35} />
        <ellipse cx={600} cy={1300} rx={480} ry={520} fill="#FFF3C9" opacity={0.16} filter="url(#mBlur8)" />
        <g transform={`rotate(${lean} ${mx} ${my})`}>
          <MohiniStanding id="po7m" f={f} x={mx} y={my} s={ms} hands={hands} smile={0.6} glow={0.3} lookX={-0.5} />
          <g transform={`translate(${K[0]} ${K[1]}) rotate(${kDeg})`}>
            <Kalash f={f} glow={0.7} s={ks} />
          </g>
        </g>
        <Puppet id="po7sv" who={SVARDEVA} at={at} p={p} t={f} />
        <g transform={`translate(${at.x} ${at.y + 240 * at.s})`}>
          <ImpostorSmoke f={f} amount={0.6} w={150} />
        </g>
        <g transform={`rotate(${-35 * sip} ${cx} ${cy})`}>
          <AmritCup x={cx} y={cy} s={cs} f={f} fill={fill} />
        </g>
        {streamO > 0.01 ? (
          <g opacity={streamO}>
            <PourStream7 a={lip} b={[cx, cy - 40 * cs]} dir={-1} t={reach} f={f} />
          </g>
        ) : null}
        {glowOn ? (
          <g>
            <circle cx={gx} cy={gy} r={24} fill="#FFD36B" opacity={0.9 * (1 - 0.4 * run)} filter="url(#mBlur8)" />
            <circle cx={gx} cy={gy} r={8} fill="#FFF3C9" />
            <ellipse cx={neck[0]} cy={neck[1]} rx={62 * at.s} ry={22 * at.s} fill="#FFD36B" opacity={0.8 * run * throb} filter="url(#mBlur8)" />
            <ellipse cx={neck[0]} cy={neck[1]} rx={30 * at.s} ry={8 * at.s} fill="#FFF3C9" opacity={0.7 * run * throb} />
          </g>
        ) : null}
        <Motes f={f} n={18} seed="po7mo" color="#FFE6A3" dir={-1} speed={0.5} size={3} o={0.6} />
      </g>
      <Vignette o={0.65} />
    </World>
  );
};

/*
 * Episode 7, scene 4, over line 04 ("तभी सूर्य और चंद्र ने पहचान लिया... ये असुर है!").
 * Back on the devas' row, framed wide enough for all three: Surya and Chandra turn on the impostor from
 * 'पहचान' (smiles drop, brows down, eyes on him) while the amrit still glows in his throat. On 'ये असुर है!' the
 * camera punches in with a shake, his eyes flash red, the smoke at his feet surges and a red pulse hits the
 * frame; AlertRing7 (HTML) circles him on the same cue.
 * Placeholder defaults: alert 390-480, 'पहचान' 420, 'ये असुर है' 455.
 */
export const AlertScene7: React.FC<{ f: number }> = ({ f }) => {
  const [a, b] = span7(SCENES, "alert", [390, 480]);
  const pehchan = cue7("pehchan", 420);
  const asurHai = cue7("asurHai", 455);
  const recoil = ramp(f, pehchan - 6, pehchan + 8, "out");
  const hit = Math.max(0, 1 - Math.abs(f - asurHai - 2) / 8);
  const z = track(f, [[a, 1.08], [asurHai - 2, 1.12, "io"], [asurHai + 6, 1.24, "io"], [b, 1.27, "io"]]);
  const sx = hit * Math.sin(f * 2.7) * 12;
  const sy = hit * Math.cos(f * 3.1) * 9;
  const surge = ramp(f, asurHai, asurHai + 10, "out");
  const point = ramp(f, asurHai - 8, asurHai, "out"); // both devas raise an arm at him as the line lands
  const glint = Math.min(1, Math.max(0, 1 - Math.abs(f - asurHai - 3) / 10) + 0.4 * surge);
  const neckX = ROW.X_IMP + 6 * ROW.S;
  const neckY = ROW.HIPS - 224 * ROW.S;
  const fy = ROW_EYE_Y + 60;
  return (
    <World>
      <g transform={`translate(${540 + sx} ${fy + sy}) scale(${z}) translate(-540 ${-fy})`}>
        <KshiraSagar f={f} cam={{ x: 0, y: 0, z: 1.05 }} glow={0.3} swell={0.3} />
        <rect x={-200} width={W + 400} height={H} fill="#0A0814" opacity={0.45} />
        <ellipse cx={540} cy={1300} rx={520} ry={600} fill="#FFE6A3" opacity={0.14} filter="url(#mBlur8)" />
        <DevaRow7 id="al7" f={f} recoil={recoil} point={point} glint={glint} smoke={0.8 + 0.2 * surge} />
        {/* the amrit still glowing in his throat since the sip */}
        <ellipse cx={neckX} cy={neckY} rx={34} ry={12} fill="#FFD36B" opacity={0.35 + 0.15 * Math.sin(f / 3)} filter="url(#mBlur8)" />
        <Motes f={f} n={14} seed="al7m" color="#C9B4FF" dir={-1} speed={0.4} size={3} o={0.5} />
      </g>
      <rect width={W} height={H} fill="#8A0F1E" opacity={0.28 * hit} />
      <Vignette o={0.75} />
    </World>
  );
};
