---
name: jyotiq-reels
description: Ayush's house playbook for Jyotiq Instagram reels and series videos (Manthan, Paanch Diye / Diwali, Katha and other 9:16 mythology / jyotish shorts) built in Remotion at ~/.kiro/crew/workspace/video. Use whenever Ayush asks to plan, script, voice, build, mix, render or review a reel, an episode, a series day, an ElevenLabs voice pack, or anything under manthan-ep*, diwali-d*, or video/src/Jyotiq. Learned from his finished Kiro projects; read it before the generic remotion-* or hyperframes skills, which it builds on.
---

# Jyotiq reels: the house playbook

Distilled from Ayush's finished Kiro builds (Manthan Ep1-9, Diwali "पाँच दीये" D1-D5, anime-ads).
These are the standards he has already approved. Follow them unless he says otherwise.

## Where things live

- Remotion project: `/Users/ayushrajput/.kiro/crew/workspace/video` (Remotion 4.0.5xx, React 19, TS). Details: [references/workspace.md](references/workspace.md).
- Episode folders: `~/.kiro/crew/workspace/<series>-<ep>/` (`manthan-ep9/`, `diwali-d1/`), each holding `SCRIPT.md`, `PLAN.md`, `ELEVENLABS.md`, `REPORT.md`, `audio/{stt,vo,stems}`, `render/`, `review/`, `final/`, and shell helpers (`transcribe.sh`, `render_final.sh`, `review.sh`, `stills.sh`, `intake.py`).
- Code per episode: `video/src/Jyotiq/<series>/<ep>/` (e.g. `manthan/ep7/`, `diwali/d1/`). Assets: `video/public/jyotiq/<series>/<ep>/`. Audio scripts: `video/scripts/<series>_<ep>_{vo_prep,audio,score}.py`.
- HyperFrames experiment: `~/.kiro/crew/workspace/anime-ads/` (HTML + GSAP; follow its CLAUDE.md and the hyperframes skills there).

## Hard rules

- **Never edit an earlier episode's files.** Import them read-only (rig, sets, characters, graphics, score helpers) and copy into new episode names. `video/src/Root.tsx` is shared: re-read it right before editing and add only the new import and `<Composition>`.
- **Never change an approved script line's words.** The per-line picture plan in SCRIPT.md is binding.
- **Gods shown with dignity.** No gore, no fear-selling in jyotish closes (Yamraj calm, Rahu/Shani never scary).
- **No "AI-assisted" text in frame.** Remind Ayush to switch on Instagram's AI label when posting (India IT Rules, since 20 Feb 2026).
- **One heavy job at a time** (8 GB M1): before any whisper run, Remotion still/render or big ffmpeg encode, `pgrep -fl "[r]emotion|[c]hrome-headless|[w]hisper-cli"` must be empty. Remotion always `--concurrency=1`. Long jobs run with `nohup caffeinate -is ... &` and are watched through their log file.
- Multi-line Python goes in a file run with `/usr/local/bin/python3` (stdlib only, no numpy) or the audio venv (numpy, for score synthesis), never long heredocs. Never `rm -rf` an absolute path.
- Animation is a pure function of `useCurrentFrame()`; no timers, CSS transitions, `Math.random()` (use seeded noise).
- When a creative choice is uncertain, make the strongest editorial choice, note it as an assumption in the report, and keep building. Ask Ayush only about a missing or misread voice take (once, with the exact words), and keep building meanwhile.

## Format standard

- 9:16, **1080x1920** native (`--scale=1`), 30 fps CFR. Reels are **under 60 s**: aim 54-58.5 s, hard cap `TOTAL < 1800` frames (series target < 1755).
- Master: H.264 High, yuv420p, bt709, CRF 12, AAC-LC 320k 48 kHz stereo, `+faststart`. A `_share.mp4` copy (CRF 18, maxrate 6M, AAC 192k) only when the master is over 50 MB.
- Audio: master **-14 LUFS integrated, true peak <= -1.5 dBFS**. Dialogue levelled to -18 LUFS; every line at least 11.5 LU over the bed (median about 13); bed ducks under each line; carve 2-4 kHz under dialogue.
- Instagram safe areas: nothing important in the bottom ~250 px or the right rail; captions end above y 1670 and sit at least 25 px from name cards, never over faces or the hook plate.

## Retention and storytelling

- **Frame 0 is lit, never black**, and the hook text is complete from frame 0 in the middle third, readable with sound off in under 1 s. A poll/question chip opens a loop the story closes by about 12 s.
- A cut or camera beat every 1.5-3 s; nothing holds over 3 s without movement (add slow pushes to near-still shots). Cut on word onsets or score hits.
- Use **match cuts** across scenes (coin glint to sea light, amrit kalash to brass kalash, diya flame to the kundali's graha glow).
- Series devices: a recurring progress motif (e.g. the diya row), a name card on first mention (`धन्वंतरि · DHANVANTARI`), chips for facts, the kundali with the episode's graha lighting up, and a next-episode tease on the last frame.
- Captions: bottom captions with word highlight driven by the take's Whisper word timestamps.

## Branding (end card and throughout)

- Jyotiq BrandBug in the corner through the story (hidden under title and end cards).
- End block: logo, "Jyotiq se pucho", "Pehla sawaal free · phir ₹5 per sawaal", www.jyotiq.ai, Play / App Store badges, "App ka link profile (bio) mein" with an animated arrow, disclaimer "Guidance only, for entertainment and information.", plus a comment prompt ("Comment karo: …?").
- Voiced sign-off "ज्योतिक़ से पूछिए। पहला सवाल फ़्री।" is reused from the Manthan Ep2 recording unless a new take arrives.
- App screen recording: use only the home screen / typing section, never the paywall with prices.

## Look

Flat anime style of Manthan: bold shapes, soft gradients, rim light, the `manthan/style.ts` palette; warmer festival palettes (amber, marigold, diya gold) for Diwali. Present-day people as warm rim-lit silhouettes with readable profiles; myth figures fully drawn with the shared rig (`manthan/rig.tsx`: `Puppet`, `pose`, `idle`, `blinkAt`, `talkAt`). Lip-sync speaking characters from the per-frame loudness envelope in `voData.ts`.

## The pipeline (one small step at a time, with a still check per new art piece)

1. **Script** (`SCRIPT.md`): table of `# | Who | Line | Picture`, ElevenLabs v3 audio tags in brackets (`[shocked]`, `[warm]`, `[curious]`), about 94 spoken words for ~58 s, hook first, sources cited (Bhagavata etc.), a "cut this line first if long" note.
2. **Voice pack** (`ELEVENLABS.md`): see [references/elevenlabs.md](references/elevenlabs.md).
3. **Plan** (`PLAN.md`): target and specs, paths, audio layers and score cues per line, scene table, characters and art (reused vs new), retention, branding, numbered steps, viewer-eye checklist, rules.
4. **Intake**: transcribe every uploaded take locally with whisper.cpp (Hindi, word timestamps), match takes to lines; newest take wins unless its transcript has a wrong word. Report duplicates (same md5) and Voice-Design-preview files as unused.
5. **VO prep**: trim silence (short natural pad), cap inner pauses at 0.35 s (more on dramatic beats), 48 kHz stereo WAVs, per-frame loudness envelope into `voData.ts`.
6. **Timeline**: lay takes end to end in script order with silent picture beats; find cue words from transcripts (accept several Whisper spellings, e.g. धन्तेरस / धन्वन्तरी / जोतिश); write `timing.ts` with `TOTAL`. If over the cap: fold the title into the hook, cap gaps at 0.30 s, shorten the end hold, then move voiced extras to on-screen text. Never cut other scripted words.
7. **Art and graphics**, one new piece per cycle with a still (`npx remotion still <Comp> out/x.png --frame=N --concurrency=1`).
8. **Scenes**, Root registration, `npm run lint` (eslint + tsc), stills at the hook, every cue beat and the end card, then a **third-person viewer review** and fixes.
9. **Score and mix**: original synthesized score (no samples, imitates no existing music) on the series helpers: tanpura Sa-Pa (Sa = A) throughout, santoor, temple bells, Kaal drone and time-whoosh, plus an episode palette; mix over up to 4 calibration passes.
10. **Render** chunked and resumable, then **review**. Commands: [references/pipeline.md](references/pipeline.md).
11. **Deliver** with a `REPORT.md`: master path and specs, scene-by-scene table with times, audio layers and mix numbers, branding, review fixes, assumptions, used/unused takes, and the "before posting" list (AI label, posting date from Drik Panchang, bio line).

## Viewer-eye checklist (before delivery)

- Frame 0 lit; hook readable sound-off in under 1 s; the poll strike lands on its word.
- Every word audible over the score; no clipped word edges; no dead air over 0.4 s.
- Every cut on a beat; nothing static over 3 s.
- Captions clear of faces, name cards, the hook plate, the bottom 250 px and the right rail.
- Characters read as themselves (check silhouettes, mounts, weapons: past fixes include a ram that should be a buffalo, a "balloon" staff that should be a gada, a hooded grandmother who needed a lit face).
- Text from one shot never lingers over the next cut.
- Branding present, no AI text, tease legible on the last frame.
- `review/blackfreeze.txt` empty, loudness and true peak within spec, contact sheets look right.
