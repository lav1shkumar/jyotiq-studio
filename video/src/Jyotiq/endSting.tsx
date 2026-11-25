import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

// Jyotiq brand end-sting, 480x864 (matches the testimonial source).
// Deep-indigo night palette + gold accents, reusing the client's own logo-full.png.
// Beats: starfield + zodiac ring breathe in -> logo lifts & settles -> wordmark glow ->
//        tagline fade -> gentle hold.

const BG_TOP = "#140a2e";
const BG_BOT = "#0a0618";
const GOLD = "#e6b45a";
const GOLD_SOFT = "rgba(230,180,90,0.55)";

const Star: React.FC<{ x: number; y: number; r: number; delay: number; tw: number }> = ({
  x,
  y,
  r,
  delay,
  tw,
}) => {
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [delay, delay + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const twinkle = 0.55 + 0.45 * Math.sin((frame + tw) / 11);
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: r,
        height: r,
        borderRadius: "50%",
        background: "#fff",
        opacity: appear * twinkle * 0.9,
        boxShadow: `0 0 ${r * 2}px rgba(255,255,255,0.7)`,
      }}
    />
  );
};

export const JyotiqEndSting: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  // Zodiac ring breathe-in
  const ringIn = spring({ frame, fps, config: { damping: 200, mass: 1.1 } });
  const ringScale = interpolate(ringIn, [0, 1], [0.7, 1]);
  const ringOpacity = interpolate(frame, [6, 34], [0, 0.35], {
    extrapolateRight: "clamp",
  });
  const ringSpin = interpolate(frame, [0, durationInFrames], [0, 26]);

  // Logo lift + settle
  const logoSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 18, mass: 0.9, stiffness: 90 },
  });
  const logoY = interpolate(logoSpring, [0, 1], [34, 0]);
  const logoScale = interpolate(logoSpring, [0, 1], [0.86, 1]);
  const logoOpacity = interpolate(frame, [8, 26], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Glow pulse behind logo after it settles
  const glowPulse =
    0.4 + 0.3 * Math.max(0, Math.sin((frame - 30) / 14)) * (frame > 30 ? 1 : 0);

  // Tagline fade
  const tagOpacity = interpolate(frame, [42, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tagY = interpolate(frame, [42, 60], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Whole-sting gentle fade-in from the video (first 10f) and no hard cut out
  const masterIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  const ringSize = width * 1.15;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 90% at 50% 38%, ${BG_TOP} 0%, ${BG_BOT} 100%)`,
        opacity: masterIn,
      }}
    >
      {/* Starfield */}
      <Star x={16} y={14} r={3} delay={2} tw={0} />
      <Star x={78} y={10} r={2} delay={6} tw={30} />
      <Star x={88} y={26} r={3} delay={10} tw={60} />
      <Star x={24} y={30} r={2} delay={4} tw={90} />
      <Star x={67} y={40} r={2} delay={12} tw={20} />
      <Star x={10} y={48} r={2} delay={8} tw={50} />
      <Star x={90} y={52} r={3} delay={14} tw={70} />
      <Star x={34} y={8} r={2} delay={16} tw={40} />
      <Star x={54} y={16} r={2} delay={9} tw={80} />
      <Star x={44} y={64} r={2} delay={18} tw={25} />
      <Star x={82} y={70} r={2} delay={11} tw={55} />
      <Star x={19} y={68} r={2} delay={7} tw={95} />

      {/* Zodiac ring accent */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: ringSize,
            height: ringSize,
            borderRadius: "50%",
            border: `1px solid ${GOLD_SOFT}`,
            opacity: ringOpacity,
            transform: `translateY(-6%) scale(${ringScale}) rotate(${ringSpin}deg)`,
            boxShadow: `inset 0 0 60px rgba(230,180,90,0.08)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: ringSize * 0.72,
            height: ringSize * 0.72,
            borderRadius: "50%",
            border: `1px dashed rgba(230,180,90,0.25)`,
            opacity: ringOpacity,
            transform: `translateY(-6%) scale(${ringScale}) rotate(${-ringSpin * 1.4}deg)`,
          }}
        />
      </AbsoluteFill>

      {/* Logo + glow */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          transform: `translateY(-5%)`,
        }}
      >
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              inset: "-18% -18%",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(230,180,90,0.35) 0%, rgba(230,180,90,0) 68%)",
              opacity: glowPulse,
              filter: "blur(4px)",
            }}
          />
          <Img
            src={staticFile("jyotiq/logo-full.png")}
            style={{
              width: 230,
              height: "auto",
              transform: `translateY(${logoY}px) scale(${logoScale})`,
              opacity: logoOpacity,
              filter: "drop-shadow(0 6px 20px rgba(0,0,0,0.5))",
            }}
          />
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: 26,
            opacity: tagOpacity,
            transform: `translateY(${tagY}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: GOLD,
              fontFamily:
                "'Georgia', 'Playfair Display', 'Times New Roman', serif",
              fontSize: 22,
              letterSpacing: 1.5,
              fontStyle: "italic",
              textShadow: "0 2px 10px rgba(0,0,0,0.6)",
            }}
          >
            Clarity in every decision
          </div>
          <div
            style={{
              marginTop: 10,
              color: "rgba(255,255,255,0.75)",
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              fontSize: 13,
              letterSpacing: 4,
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            Download Jyotiq
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
