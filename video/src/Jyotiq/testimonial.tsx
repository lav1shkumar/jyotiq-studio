import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import captionsData from "../../public/jyotiq/testimonial/captions.json";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "800"],
});

type Chunk = { start: number; end: number; text: string };
export const CAPTIONS = captionsData as Chunk[];

const GOLD = "#e6b45a";

// Words to colour-accent in the caption (brand + topical keywords)
const ACCENT = new Set([
  "jyotiq",
  "kundali",
  "planetary",
  "planet",
  "chart",
  "remedies",
  "health",
  "wellness",
  "marriage",
  "career",
]);

export const Caption: React.FC<{ chunk: Chunk }> = ({ chunk }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const inAt = chunk.start;
  const outAt = chunk.end;
  if (t < inAt - 0.2 || t > outAt + 0.2) return null;

  // pop-in spring + fade
  const popSpring = spring({
    frame: frame - Math.round(inAt * fps),
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 140 },
  });
  const scale = interpolate(popSpring, [0, 1], [0.86, 1]);
  const fadeIn = interpolate(t, [inAt, inAt + 0.1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(t, [outAt - 0.12, outAt], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);

  const words = chunk.text.split(" ");

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 150,
        display: "flex",
        justifyContent: "center",
        padding: "0 34px",
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 8px",
          maxWidth: 420,
        }}
      >
        {words.map((w, i) => {
          const clean = w.replace(/[.,?!]/g, "").toLowerCase();
          const accent = ACCENT.has(clean);
          return (
            <span
              key={i}
              style={{
                fontFamily,
                fontWeight: accent ? 800 : 700,
                fontSize: 27,
                lineHeight: 1.18,
                color: accent ? GOLD : "#ffffff",
                textShadow:
                  "0 2px 6px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.9)",
                WebkitTextStroke: "0.5px rgba(40,22,10,0.55)",
                letterSpacing: 0.2,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const JyotiqTestimonial: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Corner watermark: fade in over first 1s, gentle persistent, fade near very end
  const wmIn = interpolate(frame, [12, 36], [0, 0.72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wmOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames - 2],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const wmOpacity = wmIn * wmOut;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo
        src={staticFile("jyotiq/testimonial/stage_planets.mp4")}
      />

      {/* soft bottom gradient scrim so captions always read */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 300,
          background:
            "linear-gradient(to top, rgba(10,6,24,0.55) 0%, rgba(10,6,24,0.22) 45%, rgba(10,6,24,0) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Captions */}
      {CAPTIONS.map((c, i) => (
        <Caption key={i} chunk={c} />
      ))}

      {/* Corner Jyotiq watermark (brand app-icon style) */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 14,
          opacity: wmOpacity,
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))",
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 14,
            background:
              "linear-gradient(145deg, rgba(26,16,52,0.82), rgba(12,8,28,0.82))",
            border: `1px solid ${GOLD}66`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img
            src={staticFile("jyotiq/logo-icon.png")}
            style={{ width: 38, height: "auto" }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
