---
name: kyahota-ep2-shani-build
description: "क्या होता अगर… Ep2 शनि की टेढ़ी नज़र" reel rendered 14 Nov 2026 on the Navagraha kit; what-if series recipe, fixes, namaste IK pose
metadata:
  type: project
---
"क्या होता अगर…" (what-if) series. Ep2, Shani, was rendered on 14 Nov 2026. Master: `~/.kiro/crew/workspace/kya-hota-agar-ep2/final/KyaHotaAgar_Ep2_Shani_1080x1920.mp4` (59.2 s, -14.1 LUFS, TP -2.7). REPORT.md is in the same folder.
Ep1 "क्या होता अगर ग्रह ही न होते?" (Free Kundali ending) is **script only**, at `jyotiq-marketing/kya-hota-agar/ep1-grah/SCRIPT.md`. The Ep2 end card teases it.

**Recipe to reuse:**
- Code: `video/src/Jyotiq/kyahota/ep2/` (Episode, cast, parvati, art, kit). Composition `KyaHotaEp2`.
- Score and mix: `video/scripts/kyahota_ep2_{score,mix}.py`.
- The structure is hook → squeezed NvOpen starter (OPEN_A = B(2)-3 to OPEN_B = A(3)-6) → story; the brand sonic is time-squeezed the same way with atempo in the mix.
- For a fiery open: the fire() noise texture, the pulse at full drive from frame 0, an accelerating pakhawaj loop, a crack and sub boom on the lens crack.

**Lessons:**
- **Namaste on the rig** needs IK. `{ sF: -33, eF: 137, wF: 66, sB: 15, eB: 94, wB: 61 }` makes the palms meet at the sternum. Earlier tries read as raised palms or a fist.
- **Panning across two copies of a set:** offset the second copy by the full W (1080), not 1020, and draw it first, or a seam strip shows.
- **Props and characters:** a prop placed behind a standing character (a seat) reads as a jetpack; put it beside them.
- **Shared machine:** another session (chhathi-maiya) can be rendering at the same time. Wait for `pgrep` to be empty before heavy jobs.

Veo was allowed by Ayush (animated-series look only, used sparingly) but was not used. See [[veo-vertex-route]] and [[navagraha-ep2-build]].
