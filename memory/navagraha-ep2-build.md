---
name: navagraha-ep2-build
description: नवग्रह जन्म Ep2 (Shani) rendered 13 Nov 2026 on the Ep1 v2 kit; Shiva look added; how a new episode is built from Ep1
metadata:
  type: project
---

2026-11-13: Ayush asked for "the 2nd episode" right after Ep1 v2 (the Ep1 v2 notes — series intro, Kaal narrator, character voices, intense score — apply to every episode). Ep2 Shani final: `workspace/navagraha-ep2/final/Navagraha_Ep2_Shani_1080x1920.mp4`, 54.1 s.

**How to build the next episode fast (Ep2 took one session):** script with the series line after the hook + one character line in its own voice → `gen_vo.py` (one take each) → whisper + `tools/sil_dump.py` → SEQ table in `tools/vo_prep.py` → `video/src/Jyotiq/navagraha/epN/` importing Ep1's anim/look/open/sanjna/world/cast read-only (only KCaption must be copied, it binds to timing) → `navagraha_epN_score.py` (copy of Ep2's: helpers + re-cued stems + pulse) and `_mix.py` (per-phrase riding keeps >= 12.3 LU) → `render_final.sh` (~7 min for 1600 frames).

Shiva = rig look `nvShiva` in ep2/cast2.tsx (no crown so the rig's jata crescent shows; trishul as backProp; abhaya = sF 30, eF 135). Arm angles: forearm angle = sF + eF; ~105/120 reads as a salute.
Ep3 = चंद्र (Ayush, 13 Nov): Atri birth story, Harivamsa 1.25; script in workspace/navagraha-ep3/SCRIPT.md awaiting approval; Ep2 end card teases "अगला एपिसोड: चंद्र". See [[navagraha-ep1-build]], [[jyotiq-feature-endings]].
