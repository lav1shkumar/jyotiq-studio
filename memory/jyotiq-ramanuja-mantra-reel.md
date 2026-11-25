---
name: jyotiq-ramanuja-mantra-reel
description: "Ramanuja Tirukoshtiyur mantra reel, comic-book style; frames stage in workspace/ramanuja-mantra since 2026-11-10"
metadata:
  node_type: memory
  type: project
  originSessionId: 2df26021-a941-4203-a9b1-c29bfa961e71
  modified: 2026-11-10T04:48:08.363Z
---

Ramanuja reel (Tirukoshtiyur Nambi, mantra shouted from the temple tower) lives in `~/.kiro/crew/workspace/ramanuja-mantra`. Hindi script (144 words, ~76 s, simple Jyotiq sign-off) was written on 2026-11-10; Ayush moved straight to frames, so treat it as accepted.

Ayush asked for an **original Indian comic-book look** for this reel (not the live-action TV look in [[jyotiq-myth-script-skill]]), with Veo later for characters talking and walking. He will review frames before asking for the full video.

State on 2026-11-10: all 13 frames in `final_frames/` (1080x1920), sheet `review_sheet_13.jpg`. Ayush approved the look of the 6 free FLUX frames (01, 02, 03, 09, 10, 11) and said he wants that exact look (rough ink, flat colour, paper grain). He rejected cleaner, polished character sheets. The other 7 were made with Vertex `gemini-3-pro-image` (`gen_img.py shots.json`) using those 6 frames as style refs (`style/`). About Rs 300 spent on this, approved by him.

Reel rendered 2026-11-10: `final/ramanuja_mantra_reel.mp4` (67 s). Pipeline: `gen_veo.py` (comic-look Veo prompts, 13 clips, Veo Fast keeps the flat ink look well), `gen_vo.py`, `gen_music.py`, `assemble.py` (xfade comic transitions, paper grain, top-left badge, PIL end card with Kiro's gold store buttons). Ayush wants: no captions, Jyotiq badge top-left, story bridged to Jyotiq at the end, jyotiq.ai plus Play Store and App Store. Total Vertex ledger after this reel about Rs 9,400.

**Why:** he asked for Amar Chitra Katha scans first; those are copyrighted, so the reel uses our own art.
**How to apply:** reuse this folder's scripts as the template for the next comic-style Jyotiq reel; ask before any paid generation ([[veo-vertex-route]]).
