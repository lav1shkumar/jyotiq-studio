---
name: navagraha-ep1-build
description: नवग्रह जन्म Ep1 (Surya) full reel rendered 12 Nov 2026 in workspace/navagraha-ep1; template pipeline for every next Navagraha episode
metadata:
  node_type: memory
  type: project
  originSessionId: a59f93ce-d72b-4f5a-baf6-e4fe95a1df20
  modified: 2026-11-12T12:08:43.279Z
---

Rendered 2026-11-12: `navagraha-ep1/final/Navagraha_Ep1_Surya_1080x1920.mp4`.
- 45 s, -14.1 LUFS, true peak -1.8 dBTP; details in REPORT.md and CAPTION.md.
- Composition `NavagrahaEp1` in `video/src/Jyotiq/navagraha/ep1/Episode1.tsx`, with the motion kit in `anim.tsx`.
- Ayush asked for "hook over opening", best motion graphics, viral treatment and strong background sound. Awaiting his review.

Pipeline that worked:
- **Voice:** no takes were uploaded, so `gen_vo.py` made one ElevenLabs v3 take with the Ayush M narrator `HqRQSXEwwdjbY3dgUSzb` (288 credits).
  - Run it with `/usr/bin/python3`; `/usr/local/bin/python3` has no CA certificates.
  - This narrator is fast, about 2.4 words/s, so 111 words gave a 45 s reel.
- **Timing:** Whisper word times drifted up to 0.7 s on this take, so `tools/vo_prep.py` cuts on measured silences (a PHRASES table) and writes `timing.ts`.
- **Score and mix:** `video/scripts/navagraha_ep1_{score,mix}.py`. Run them with the earshot venv (`/Users/ayushrajput/earshot/.venv/bin/python`, which has numpy).
- **Render:** `render_final.sh` with `--public-dir=render/public` (APFS `cp -c` clones of only the files used) and 12 chunks. About 9 min in total.
  - The default bundle copies the 2.2 GB `public/` folder and filled the disk.
- **Check:** `earshot timeline <mp4> --cues audio/cues.json` caught soft cut accents. Every cut now gets a whip plus a low cut-hit.

**Why:** the next Navagraha episodes (Shani is Ep2) should reuse this pipeline rather than rediscover it.

**How to apply:** copy the episode folder's tools and scripts and change the paths. Keep the hook plate over NvOpen from frame 0. See [[jyotiq-reel-layout-site-look]] and [[jyotiq-feature-endings]].

2026-11-13 v2: `final/Navagraha_Ep1_Surya_v2_1080x1920.mp4` (v1 kept). Ayush wanted the series point said ("Jyotiq presents नवग्रह जन्म"), Kaal as narrator, other characters in their own ElevenLabs voices (Surya = Neel), and a more INTENSE score that still never covers the voice. Done with a `pulse()` stem (low string spiccato + frame drum + pakhawaj on a 100 bpm grid, intensity curve per scene, lowpass 2.4 kHz), TARGET_GAP 12, music duck -7 dB, and per-phrase bed riding in the mix (every phrase >= 12.3 LU). render_final.sh / review.sh take FINAL_NAME and BUNDLE_NAME env vars. Reuse this score + mix level for later episodes.
