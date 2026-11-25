---
name: jyotiq-sikh-gurpurab-reels
description: "Sikh Guru reels — no astrology feature ending, dialogue-led puppet build; Guru Tegh Bahadur Shaheedi Diwas reel built 24 Nov 2026 (Ayush chose faces shown)"
metadata:
  node_type: memory
  type: project
  originSessionId: 598182f2-793f-40df-b9f6-987691ab52cf
  modified: 2026-11-24T10:47:14.922Z
---

24 Nov 2026 (Guru Nanak Jayanti + Guru Tegh Bahadur Shaheedi Diwas): Ayush first approved a Saidpur/Guru Nanak script (workspace/gurpurab-saidpur), then switched to Guru Tegh Bahadur and had the full reel built: `workspace/gurpurab-tegh-bahadur` (SCRIPT.md, REPORT.md, gen_vo.py, gen_audio.py, tools/, render_final.sh), code `video/src/Jyotiq/gurpurab/` (`GuruTeghReel`, cast.tsx, world.tsx, Sheet.tsx).

Decisions and rules:
- Ending: simple sign-off "ऐसी ही साखियों के लिए, ज्योतिक़।", no astrology feature (Guru Nanak's bani questions astrology). Martyrdom day = "नमन", not "बधाइयाँ".
- Ayush **chose to show the Gurus' faces** after being told of the SGPC objection — his call; don't re-argue, but mention the risk once.
- Ayush wants a real fight in the first seconds; pick sakhis with historical action (Kartarpur 1635 renaming) rather than inventing fights. Never show a Guru fighting where history says he didn't.
- No captions/subtitles/chips on picture for this format (his brief); brand bug + end card only.
- Rig (manthan/rig.tsx) now has opt-in `robe`, `dastar`/`pagri`/`safa` turbans, `plume`, full beard, covered hair, no earring — reusable for any Mughal-era/Sikh/Rajput cast.
- No kirtan/Gurbani melody or harmonium as background score.

**Why:** Sikh-history content draws close scrutiny; Ayush prioritises an action hook and intense score.
**How to apply:** for the next Gurpurab or Mughal-era reel, copy gurpurab-tegh-bahadur tools and gurpurab/ code; follows [[jyotiq-myth-script-skill]], [[bharata-ep1-build]] pipeline, exception to [[jyotiq-feature-endings]].
