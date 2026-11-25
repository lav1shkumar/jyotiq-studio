import React from "react";
import { CAP_BOTTOM, CAP_TOP, GRAD, MUKTA, S, gradText } from "../../navagraha/ep1/look";
import { outBack, outCubic, prog } from "../../navagraha/ep1/anim";
import { PHRASES, WORDS } from "./timing";

/* क्या होता अगर… Ep2: the karaoke caption copied from navagraha/ep2/anim2.tsx (KCaption2), bound to this reel's clock. */

/* Karaoke captions (this reel's clock) */
const KEY = new Set(["शनि", "श्राप", "अनिष्ट", "पार्वती", "पुत्र", "कनखियों", "पल", "सिर…", "विष्णु", "गजानन।", "विक्रमादित्य", "आख़िरी", "लोहे", "जानोगे।", "साढ़े", "साती", "कलंक", "राज-पाट", "लौटा", "दुख…", "दंड", "हिसाब", "कुंडली", "गोचर", "ज्योतिक़"]);

/** Bottom caption: one phrase per page, every word visible; the spoken word sits on the saffron gradient. */
export const KCaptionQ: React.FC<{ f: number; hide?: number[]; bottom?: number }> = ({ f, hide = [], bottom = CAP_BOTTOM }) => {
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


