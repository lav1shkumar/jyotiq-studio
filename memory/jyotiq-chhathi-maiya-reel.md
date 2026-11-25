---
name: jyotiq-chhathi-maiya-reel
description: "Chhathi Maiya katha reel (80 s, Manthan rig) rendered 14 Nov 2026; designed voices, per-scene ElevenLabs music cues, auto-ducking mix.py"
metadata:
  node_type: memory
  type: project
  originSessionId: f051acd8-dac5-4221-82fd-507e9a44e19d
  modified: 2026-11-14T01:03:42.402Z
---

छठी मैया की कथा (Priyavrat + Shashthi Devi, Brahmavaivarta) rendered 14 Nov 2026: workspace/chhathi-maiya/final/Chhathi_Maiya_Katha_1080x1920.mp4 (80.7 s, -13.9 LUFS, TP -2.7). Code in video/src/Jyotiq/chhath (Episode.tsx, devi.tsx with palette context, cast.tsx Baby/Cat, world.tsx ghat sets). Feature ending: पंचांग.

Reusable pieces:
- Designed ElevenLabs voices: Priyavrat 4DpQG6OJkHqbYL08OMMS, Malini vLg0yvPPEwypHrHFoC88, Shashthi 7gB2IBbjbSKiB9tlBRfX; Kaal narrates.
- Music: ElevenLabs Music v2.5 one cue per scene (gen_music2.py, strictly instrumental + negative styles for vocals/chants); a single long track came back with speech-like parts. Short cues are time-stretched (atempo) in the mix, not looped.
- tools/mix.py: per-phrase gap check (>=12.5 LU), one duck correction per scene per pass, ambience ducked -12 dB under speech, loudnorm two-pass. Put big SFX (sky crack, baby cry) in their own silent beats from vo_prep.py, never on a line.
- render_final.sh / review.sh copied from navagraha-ep2 with TOTAL guard 2440 and 16 chunks.

Related: [[jyotiq-reel-layout-site-look]], [[navagraha-ep1-build]], [[elevenlabs-save-credits]].
