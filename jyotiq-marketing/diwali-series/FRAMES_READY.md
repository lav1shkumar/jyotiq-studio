# पाँच दीये: frames status (31 Oct 2026, 07:25 IST)

Days 2-5 have every frame built and reviewed on a placeholder clock (estimated from the script at Day 1's speaking rate). Every animation is tied to word cues, so the real takes re-time each scene automatically.

| Day | State | Placeholder length | Remotion comp | Review stills |
|---|---|---|---|---|
| 1 · धनतेरस | Delivered | 58.2 s | DiwaliD1 | diwali-d1/final/Diwali_D1_Dhanteras_1080x1920.mp4 |
| 2 · छोटी दिवाली | Frames ready | 58.5 s | DiwaliD2 | diwali-d2/review/sheet_a.png, sheet_b.png |
| 3 · दिवाली | Frames ready | 59.5 s | DiwaliD3 | diwali-d3/review/sheet_a.png, sheet_b.png |
| 4 · गोवर्धन पूजा | Frames ready | 60.5 s (over 60) | DiwaliD4 | diwali-d4/review/sheet_a.png, sheet_b.png |
| 5 · भाई दूज | Frames ready | 57.4 s | DiwaliD5 | diwali-d5/review/sheet_a.png, sheet_b.png |

Day 4: if the real takes also run past 60 s, apply a pitch-preserving atempo of about 1.03 to the narrator lines in its vo_prep. Generating Day 4's Kaal lines at ElevenLabs speed 1.05 avoids that.

## What each day needs once its takes are uploaded

1. `jyotiq-marketing/diwali-series/transcribe.sh` (local whisper, one shared `stt/` folder for Days 2-5).
2. Intake: `diwali-d2/intake.py --apply` (Days 3-5: copy Day 2's with that day's 8 lines and voice routing).
3. Copy `diwali-d1/audio/vo/jyotiq_signoff.mp3` (the Ep2 sign-off) into the day's `audio/vo`.
4. Voice prep: `video/scripts/diwali_d2_vo_prep.py` (Days 3-5: copy Day 2's).
5. `video/scripts/diwali_dN_audio.py` without `--placeholder`. This rewrites the day's timing.ts and voData.ts from the real takes.
6. Score and mix in Day 1's way (see `diwali-d1/REPORT.md`), writing `video/public/jyotiq/diwali/dN/mix.wav`. Then set `HAS_MIX = true` in `dN/DiwaliDN.tsx`.
7. Render with copies of `diwali-d1/render_final.sh` and `review.sh`. Reuse `$KIROCREW_SCRATCH/bundle_series` (one bundle only; the disk is nearly full), and add a guard that refuses to render a placeholder timing.ts.
8. Viewer review of the master, fixes, then delivery.

## Open items for Ayush

- Voices: create Jyotiq Yamraj (Days 2 and 5), Jyotiq Lakshmi (Day 3) and Jyotiq Krishna (Day 4) in Voice Design, then generate the 32 lines in `ELEVENLABS_D2-D5.md`.
- Day 5 names हिंदी, पंजाबी, गुजराती, मराठी and English (voice line 08 and the on-screen language card). Confirm they are all live in the app. No count of languages is shown on screen.
- Optional: screen recordings of the Hora notification, the Dasha, Gochar and language-switch screens. Without them, each day shows a drawn feature card over the real home-screen clip.
- Disk: 2.5 GB free at 07:17. The old Manthan ep3-ep8 render bundles (about 2 GB each) can be cleared once he says so.
