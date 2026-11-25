---
name: free-ai-video-route
description: "Ayush's free AI video setup — hf-video skill (HF ZeroGPU Spaces: FLUX keyframes, Wan 2.2 I2V) works anonymously; Runway key never reached the shell"
metadata:
  node_type: memory
  type: project
  originSessionId: 90949317-36ad-460b-a9e0-43aa0abea761
  modified: 2026-11-03T21:37:23.870Z
---

As of 2026-11-04 the user prefers free tools. The `hf-video` skill (`~/.claude/skills/hf-video`, venv `~/hfvideo/.venv`) made a good 3 s diya clip anonymously in 42 s (FLUX.1-schnell → Wan 2.2, 480x832 @16 fps, upscaled to 1080x1920/30).

The `runway` skill exists too, but the user's RUNWAYML_API_SECRET was empty (launchctl var set with no value) and they switched to free options.

**Why:** cost matters; 8 GB M1 can't run video models locally.
**How to apply:** default AI-footage requests to hf-video; offer Runway only for paid quality. Finish ads per [[jyotiq-video-work]].
