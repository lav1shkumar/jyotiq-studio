---
name: jyotiq-reel-layout-site-look
description: "From 12 Nov 2026 every Jyotiq reel uses the jyotiq.ai site look, a fixed top-right app-download panel, a top-left brand bug and a \"Jyotiq presents\" hook opener"
metadata:
  node_type: memory
  type: project
  originSessionId: a59f93ce-d72b-4f5a-baf6-e4fe95a1df20
  modified: 2026-11-12T09:37:23.225Z
---

Ayush and the founder set a new standard for every reel on 12 Nov 2026:
- **Look:** the new jyotiq.ai home page: warm cream, saffron-to-red headline gradient, gold, lavender clouds, lotus pink, leaf green. Site art (logo, sage hero, sun-wheel hero, phone "Ask a Question", kundli scroll, report, flame) is in `video/public/jyotiq/site/`, downloaded with Ayush's OK.
- **Logo:** always the Manthan-series logo (brain-diya `logo-icon.png` / `logo-full.png` + "Jyotiq" in gold Playfair), never the new golden site logo (Ayush, 12 Nov 2026). On light scenes, put it on a dark pill or badge so the thin lines read.
- **Opening:** every reel starts with the Manthan brand open (`brandopen/ReelOpen.tsx` motion: motes → diya flame → logo + wordmark → shrinks into the corner bug → bloom), WITHOUT the Veo footage, played over the reel's own first scene. Copy: `navagraha/ep1/open.tsx` (`NvOpen`, `nvOpenBug`, 150 frames, sonic.wav). The hook lands as the bloom clears (~3.5 s).
- **Fixed chrome on every frame:** brand bug top-left (Manthan logo, dark pill), and an APP PANEL rectangle top-right that shows the app download. The panel keeps the same size, place and look all reel; the position can be adjusted. In code: `src/Jyotiq/navagraha/ep1/look.tsx` (`Chrome`, `BRAND`, `PANEL`, `KEEP_OUT`).
- **Framing:** characters never cross the brand bug or the app panel. They also stay out of the caption band (y 1462–1650) and the bottom 250 px.
- **Opener:** a viral hook from frame 0 plus a "JYOTIQ PRESENTS / ज्योतिक़ प्रस्तुत करता है" lockup, then a title card in the site hero look.

**Why:** brand recall in every reel, and the app download is visible throughout, not only on the end card.

**How to apply:** build every new reel on the navagraha ep1 kit (copy it, don't edit older episodes). First build in this style: नवग्रह जन्म Ep1 storyboard, `NavagrahaEp1Board` (16 panels). Workflow: Ayush wants all frames first, then he gives changes, then he says what to build. Related: [[jyotiq-feature-endings]], [[jyotiq-reels]].

**Logo update (24 Nov 2026):** Ayush asked for the new Jyotiq logo "in every part of the video". Reels now use the app's zodiac-wheel logo (`video/public/jyotiq/logo-zodiac.png`, round-cut with alpha from dev-deepawali-carousel/src/logo-zodiac.png) in the top-left bug on every frame and large on the end card, not the old brain-diya `logo-icon.png` / `logo-full.png`. First used in `gurpurab/Episode.tsx` (`ZBug`). The shared `BrandBug2` in navagraha/ep1/look.tsx still has the old icon; swap per reel or update it when Ayush confirms for all series.
