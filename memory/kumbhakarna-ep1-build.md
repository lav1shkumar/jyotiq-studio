---
name: kumbhakarna-ep1-build
description: "Kumbhakarna–Indra Ep1 (Mode A, Puranikathaye look) rendered 19 Nov in workspace/kumbhakarna-ep1; Aarush voice; QA-against-reference pipeline"
metadata:
  node_type: memory
  type: project
  originSessionId: 885e07a7-c4a5-4bf5-8219-c6f5e808cc98
  modified: 2026-11-19T06:58:01.261Z
---

Rendered on 2026-11-19 in `~/.kiro/crew/workspace/kumbhakarna-ep1/`; see REPORT.md there. The final is 71.4 s in Mode A:
- square scene in a black 9:16 canvas
- white DIN Condensed title
- yellow-green italic English subtitles
- Hindi narration

Ayush asked for an exact match to Kilavde7 (@puranikathaye), with the rule: "if 1% differs, stop and rebuild". [[jyotiq-puranikathaye-stage-look]]

**Why:** he rejected his own GPT-made character images as glossy, and authorised GCP plus unlimited ElevenLabs credits for this episode.

**How to apply, for the next episode:**
- **QA tools to reuse:**
  - `look_qa.py`: image metrics against the reference frames, scene band only.
  - `grade.py`: film-transfer grade, with per-shot softness tuned on the actual Veo clip.
  - earshot `timeline --cues`: hit sync and silence drops.
  - a band-balance check against the reference.
- **Frames:** generate square (1:1). For Veo, outpaint to 16:9 and paste the approved square back over the centre.
- **Voice:**
  - Narrator: **Aarush - TV-Style Mythology Narrator** (`B0YnTm3yPeqwfHHYNcT2`). He won a measured 9-voice audition; Ayush M was the highest-pitched voice.
  - Record 3 takes and comp per line with `vo_comp.py`.
- **Picture:**
  - Gemini gives elephants two tusks, so lock Airavat to two.
  - Veo invents fireballs and duplicate props: name them in the negative prompt.
  - Vertex blocked a Brahma close-up twice; fall back to a still push-in.
- **Mix and edit:**
  - Hits must land in narration gaps. Hold the first frame as a tableau so the strike follows the line, then drop everything for 0.5 s first.
  - ElevenLabs music with "rolled-off / lo-fi" wording comes out sub-bass mud. Ask for mid-register Indian instruments and darken in the mix.
  - Run assemble with the earshot venv Python: system Pillow has no raqm, so Devanagari breaks.
- **Spend:** the Veo ledger stood at ₹19,545 of ₹22,000 after this episode.
