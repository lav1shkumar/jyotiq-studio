---
name: jyotiq-diwali-story-series
description: "Diwali story-style reel series; Day 3 (Bharat, Kaal narrating) is built in workspace/diwali-story-d3 with painted GCP art, Veo clips and a code-driven edit"
metadata:
  node_type: memory
  type: project
  originSessionId: 1774002e-603f-4665-b7aa-77df28913ce5
  modified: 2026-11-06T19:36:35.884Z
---

Day 3 of the Diwali story series was finished 2026-11-07 at `~/.kiro/crew/workspace/diwali-story-d3/` (code in `video/src/Jyotiq/diwali/story3/`, composition `DiwaliStory3`, 141.7 s). The script for all five days is `jyotiq-marketing/diwali-series-v2/DIWALI_STORY_SCRIPT.md`. Ayush lifted the 60 s cap for this reel only.

**Why:** Ayush asked for a reel with better visuals and editing than a reference he supplied, with painted art instead of the flat anime rig. The approach (gemini-3-pro-image stills, Veo image-to-video, Remotion overlays, cue-driven mix in `mix.py`) is reusable for the other days. No feedback from Ayush on the result yet.

**How to apply:** For another day in this series, copy this folder's scripts and `story3/gfx.tsx`. Never say "kal" in a Day 3 tease: Govardhan is two days after Diwali in 2026. Check Veo clips frame by frame, since it invented a fire explosion from a calm prompt. See [[veo-vertex-route]] and [[elevenlabs-save-credits]].

Render lesson for this 8 GB Mac with a nearly full disk: Remotion holds a chunk's frames in temp until it encodes (about 1.7 MB per frame with grain), so 532-frame chunks filled the disk. Use chunks of about 120 frames, `--public-dir` with a small folder, and `cp -c` clones into the bundle.

Day 4 (Govardhan, 2026-11-07) is in `~/.kiro/crew/workspace/diwali-story-d4/` (code `video/src/Jyotiq/diwali/story4/`, comp `DiwaliStory4`, 63.8 s). Ayush asked for the *exact concept* of his reference reel (kilavde 3.mp4: paper-collage diorama art, English two-colour headlines, FIG labels, calendar tease) and **no Veo**: GCP stills in a paper-cutout style plus Remotion motion only. Music is an original ElevenLabs score with sections cut to the cues; effects mix ElevenLabs takes with earshot's free bank. The hook got silences inserted into the voice (`INSERT` in `vo_prep.py`) so big hits land between words. `remotion render --sequence` refuses an output path containing a dot (`.kiro`), so render stills into the scratchpad.

2026-11-08: Ayush had the Day 4 hook voice changed from "एक सात साल के बच्चे ने" to "एक छोटे बच्चे ने" (audio-only: spliced a new take into audio/prep/01_kaal.wav at the same length, re-ran mix.py, re-muxed onto the existing video; originals backed up in diwali-story-d4/fix_chote/). Same day he asked for the headline to match: now "A LITTLE CHILD / STOPPED INDRA'S PUJA" (patched in Story4.tsx, Boards.tsx and the render bundle, chunks 0-1 re-rendered). Then the "KRISHNA · AGE 7" label became just "KRISHNA" (same patch route). Ayush says everything else is right.

2026-11-09: Day 5 (Bhai Dooj) script v2 drafted at `~/.kiro/crew/workspace/diwali-story-d5/SCRIPT_v2.md` (voice text in `vo_draft_v2.txt`, ~149 words, ~65 s), next to the untouched 7 Nov `SCRIPT.md`. Hook: "DEATH IS COMING / FOR DINNER." with "साल में एक दिन, यमराज किसी को लेने नहीं निकलते... किसी के घर खाना खाने जाते हैं। और वो दिन, आज है।" Script only; not voiced or approved yet. The "आज" means posting on Bhai Dooj itself.

2026-11-09: Day 5 was built the same day in `~/.kiro/crew/workspace/diwali-story-d5/`: code in `video/src/Jyotiq/diwali/story5/`, composition `DiwaliStory5`, 80.6 s, build script `SCRIPT_v3.md`; see `REPORT.md` and `REVERSE.md`. Ayush gave two references:
- A comic picture of Yama and Yamuna, and he wants them "exact these". Yama is lavender-skinned with a horned gold crown, a lime dhoti and a pink drape. Yamuna wears a white saree with a striped pallu. The style is rough marker lines on a pastel sunburst.
- kilavde 5.mp4, whose animation is stills only: plates plus cut-outs.

Approach:
- `gen_img.py` with the reference crops as refs. Characters are drawn on flat #00FF00 and keyed by `key.py` (largest connected component; despill only near edges, or the green dhoti turns olive).
- The image model copies the reference artist's signature: check every plate and paint it out with `unsign.py`.
- No Veo and no video generation.
- Use `python3` for the API scripts: /usr/local/bin/python3 fails SSL.
- Stills preview: `node video/scripts/diwali_story5_stills.mjs <frames>`.

Voices: Kaal narrates, Mohini is Yamuna, the Jyotiq Yamraj voice is Yama. The app bridge is "कब?".
