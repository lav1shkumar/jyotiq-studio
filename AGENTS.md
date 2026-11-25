# Jyotiq content studio (Devin Cloud): rules for the agent

You work for Ayush, who makes Hindi (and some English) mythology and jyotish reels, carousels and posts for the
Jyotiq astrology app (jyotiq.ai), plus pitch films for AstroRaaga and concepts for Karmeq.

This repo is the **cloud copy** of his studio. The full studio (32 GB: old renders, voice takes, footage) stays on
his Mac. Here you have the code, the brand kit, every skill and every project note.

## First run on a new machine
`bash setup.sh` (installs Node 24, Remotion's Chrome, ffmpeg, fonts, Python venv with earshot, whisper.cpp, and
links the Mac paths the old scripts use: `~/.kiro/crew/workspace`, `~/.claude/skills`, `~/.veo_spend.json`,
`/Users/ayushrajput`). Python with numpy/earshot/gradio_client: `~/studio-venv/bin/python`.

## Where things are
| What | Path |
|---|---|
| Shared Remotion project (all compositions, `src/Root.tsx`) | `video/` |
| Brand kit: look, panel, bug, open | `video/src/Jyotiq/navagraha/ep1/look.tsx`, `open.tsx`, `video/src/Jyotiq/brandopen/` |
| Logos (zodiac-wheel logo = current) | `video/public/jyotiq/logo-zodiac.png` |
| Skills (51) — read the matching SKILL.md first | `.agents/skills/` |
| Project notes, one per reel/series/rule (index `MEMORY.md`) | `memory/` |
| Feature rotation, painted-deity style, Veo/Gemini scripts | `jyotiq-marketing/` |
| Example episode folder (scripts, board, render, caption, report) | `templates/episode/` (copied from Bharata Ep6) |
| Spend ledger (Vertex) | `spend-ledger.json` (linked to `~/.veo_spend.json`) |
| New work | `episodes/<name>/` — one folder per reel or post |

Before working on a series, read its note in `memory/`. After finishing, update that note (or add one + a line in
`memory/MEMORY.md`) and commit it, so the next session knows.

Heavy media that only exists on the Mac (old voice takes, Manthan/testimonial footage, earlier episode mixes) is not
here. If a task needs it, say which files and ask Ayush to upload them — don't regenerate paid audio to replace them.

## Which skill to read first
| Task | Read |
|---|---|
| Mythology story → reel script | `jyotiq-myth-script` (script only until Ayush says "start production") |
| Building / voicing / mixing / rendering a reel | `jyotiq-reels`, then `remotion-best-practices` and `remotion-*` |
| Free AI images/video | `hf-video` (needs `HF_TOKEN` on cloud) |
| Paid AI video | Veo on Vertex — only if `GCP_SA_KEY_JSON` is set, and ask first; otherwise list the shots for Ayush to run on his Mac |
| Voice, music, SFX | `text-to-speech`, `music`, `sound-effects`, `speech-to-text` (ElevenLabs) |
| Judging any audio | `earshot` (you cannot hear; quote its numbers) |
| Real soundtracks | `real-sound` · Stock media: `openverse` |
| HTML-based video | `hyperframes*` · Cartoon 3D short: `cartoon-3d-short` |
| Story craft / reels growth | `storytelling`, `viral-instagram-reels`, `cinematography`, `character-design` |

## Delivering to Ayush
Renders never go in git. Upload the finished MP4 (and carousel PNGs) as a GitHub Release asset
(`gh release create <episode>-v1 path/to/final.mp4 --notes-file episodes/<name>/REPORT.md`) and also attach it in
the Devin chat. Commit the source, `SCRIPT.md`, `BOARD.md`, `CAPTION.md`, `REPORT.md` and the memory note.
Open a PR per episode; don't push to `main` directly.

## Hard rules (Ayush has approved every one of these)

**Approval gates**
- Mythology: script first (3 hooks, 1 recommended, voiceover ≤ 80 s, word count, source note). No images, voice,
  video or code until Ayush says to start production. "Approved" means the script only.
- Karmeq: give concepts he can shoot himself (hook, script, shot list, fact check). Don't build unless he asks.
- Workflow for reels: all frames / storyboard first → Ayush gives changes → then build.
- Character avatars (Ram, Sita…): give him prompts; he makes images in his own tools. Don't spend GCP on them.

**Money**
- ElevenLabs: free calls first (voices, previews, subscription), shortest test line, ONE take per line, say the
  expected credits before a batch, ask before any retake, reuse existing takes.
- Vertex / Veo / Gemini image: ask before every spend. Log every call in `spend-ledger.json` (= `~/.veo_spend.json`); commit it after every spend (high estimates).
  Hard stop at ₹22,000 spent (keep ₹2,000 of credit). Check the running total before each batch.
- Free first: `hf-video` for everyday footage, PIL/HTML/ffmpeg for graphics, synthesized score.

**Wording**
- Before any voice take, re-read every Hindi line and caption as an outside viewer and fix unnatural phrasing
  (example fix: "अंबा का मन राजा शाल्व पर था", not "…को दे चुका था"). Flag fixes in approved scripts; don't voice silently.
- Narration is third person. Scripts time at ~2 Hindi words per second (30 s ≈ 60 words).
- Never reuse a reel's lines in a same-day carousel/post.
- Gods with dignity: no gore, no fear-selling (Shani, Rahu, Yamraj are never scary). Characters from scripture
  (Valmiki: Ram is dark śyāma, never blue; Sita golden-skinned in yellow silk), not TV-serial looks, unless Ayush picks a TV look.

**Brand (from 12 Nov, logo updated 24 Nov 2026)**
- Every reel opens with the brand open and a "JYOTIQ PRESENTS / ज्योतिक़ प्रस्तुत करता है" lockup, hook from frame 0.
- Zodiac-wheel logo `video/public/jyotiq/logo-zodiac.png` in a top-left bug on every frame and large on the end card.
- Fixed app-download panel top-right on every frame. Characters stay out of the bug, the panel, the caption band
  (y 1462–1650) and the bottom 250 px. Kit: `video/src/Jyotiq/navagraha/ep1/look.tsx`, open: `navagraha/ep1/open.tsx`.
  (Bharata/Mahabharat series and Sikh Gurpurab reels have their own exceptions — read their notes.)
- Every reel ends on ONE app feature that fits the story (dasha, gochar, free kundali, hora alerts, panchang,
  own language, chat). Rotate using `jyotiq-marketing/FEATURE-LOG.md`. No language count in VO. Marriage "कब", never "किससे".
  Don't voice "पहला सवाल फ़्री" until Ayush confirms it. Sikh Gurpurab reels: no astrology feature.
- No "AI-assisted" text in frame; remind Ayush to switch on Instagram's AI label.
- Facts on screen only when checked (planet positions: compute with PyEphem + Lahiri; dates: Drik Panchang).
  Investor/pitch films: no invented numbers; unconfirmed figures stay placeholders.

**Machine (cloud VM)**
- Remotion: start with `--concurrency=2`; drop to 1 if the VM runs out of memory. One heavy job at a time.
- Watch free disk (`df -h`); delete intermediate frames inside the episode folder when done.
- Never edit an earlier episode's files: copy into a new episode folder. `video/src/Root.tsx` is shared —
  re-read it right before editing, add only the new import and `<Composition>`.
- Never `rm -rf` an absolute path.

**Format**
- Reels 1080×1920, 30 fps, H.264 CRF 12, AAC 320k. Audio −14 LUFS, true peak ≤ −1.5 dBFS, dialogue well over the bed.
- Carousels 1080×1350 (or 2160×2700 "ultra HD"), built via HTML → headless Chrome screenshot, with `CAPTION.md`.
- Deliver with a `REPORT.md` / `CAPTION.md` that includes a "before posting" list.
