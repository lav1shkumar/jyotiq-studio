# Jyotiq "Shooter Gaadi" Reel — timing sheet + storyboard (v1)

Composition target: Remotion project `/Users/ayushrajput/.kiro/crew/workspace/video`, new folder `src/Jyotiq/shooter/`, 1080x1920, 30 fps. Reuses the existing kits (phoneKit, appScreens, anime effects, Patri kundli, reelKit, fonts).

## Audio facts (measured)
- Uploaded MP3 is 59.09 s, but 0.00–44.37 s is pure digital silence (-91 dB). Real audio = 44.37–59.09 s (14.72 s), loud master (-8.6 LUFS).
- Trimmed copy: `public/jyotiq/shooter/song-clip.wav` (starts at the first sound).
- Tempo ≈ 102–103 BPM (beat ≈ 0.585 s, bar ≈ 2.34 s). Kick pairs every 2 beats. Each lyric line ≈ 1 bar.
- Lyrics (Haryanvi, transcribed locally with whisper large-v3-turbo; spelling approximate):

| Clip time (s) | Line |
|---|---|
| 0.00–2.84 | "Jod saange panarya karda" |
| 2.84–5.33 | "Minute mein kacche dhaage karda" ← Shani cut |
| 5.33–7.50 | "Jigra body mein" |
| 7.50–9.54 | "Shooter gaadi mein" ← convoy cut |
| 9.54–11.87 | "Noton mein rabad na dekhya" |
| 11.87–14.72 | "Maare khule khaate hain…" (clip ends mid-phrase) |

## Reel timeline (pre-roll 2.40 s, so song starts at 2.40)
| Reel time | Scene | Beat |
|---|---|---|
| 0.00–2.40 | S1a cold open (SFX only): night bedroom, phone glow is the first lit element; kid's furious/stressed face; taps the JYOTIQ icon; logo splash | hook text |
| 2.40–5.24 | S1b song in: kid types "Mere saath hi aisa kyun hota hai?!"; Jyotiq reads his kundli (Shani + Mangal glow); answer card; kid's face cycles on the beat: furious → crying → confused → weird-happy | lyric line 1 |
| 5.24 | Whip-pan cut on "minute" | |
| 5.24–9.90 | S2 Shani Lok: Shani Dev (blue, crown, crow on the tank) on a running Bullet, big mysterious grin, twirls moustache; "jigra body mein" = flex + wheelie | lines 2–3 |
| 9.90 | Cut on "shooter": kid's Jyotiq kundli chart — planets pop out of their houses | |
| 9.90–17.12 | S3 cosmic highway convoy: the other 8 grahas in cars, vibing; "noton mein rabad" = Guru's cash gag; "khule khaate" = all wave | lines 4–6 |
| 17.12 | Audio ends → HOLD for Ayush's outro input | |

## Cast (anime archetypes, Indian-movie relatable, no real actor likeness)
- Kid "Chintu" (~10): huge anime eyes, cowlick, oversized T-shirt, phone. Chibi emotion symbols (anger vein, sweat drop, tear streams, scribble cloud, blush).
- Shani Dev: blue skin, gold crown, black handlebar moustache, mysterious grin, dark robe + iron armlets; black-blue Bullet-style bike (no brand marks) with diya decal; crow pillion; Shani Lok = indigo sky, ringed planet, iron spires.
- Surya: red-gold open jeep, aviators, halo crown, "cop-hero" swagger.
- Chandra: white convertible, crescent crown, open-arms romantic hero pose.
- Mangal: red muscle car, spiked crown, action-hero (car stunt jump).
- Budh: green mini car, round glasses, tablet, nerd genius.
- Guru: yellow vintage sedan, white beard, wise elder fanning notes.
- Shukra: pink/white cabriolet, diva sunglasses, mirror selfie.
- Rahu + Ketu: black jeep — Rahu is only a head in shades on the dashboard; Ketu is the headless body driving, waving a smoke flag.

## Branding throughout
JYOTIQ logo bug top-right on every scene; logo splash on app open; real Jyotiq-style app UI (gold on black); diya decal on Shani's bike tank; number plates "JYOTIQ"; cosmic billboard with logo in S3; outro to follow.

## v2 (2026-10-20) — extended song, slower opening, crying meme, new ending, lockup
Composition `JyotiqShooterReelV2` (803 f, 26.77 s), clock in `timing2.ts`, audio `scripts/shooter_audio_v2.py` -> `mix-v2.wav`.
- Song = `song-full.wav` (extended MP3, same 44.37 s trim, 18.38 s). First 14.72 s identical to v1. Tail (whisper DTW): "kah se aate hain" at 13.96 s and 16.54 s; stops dead on "aate" at 18.377 s.
- Opening re-paced: POV phone 0-66 (tap 34), kid typing 66-114, kundli read 114-147, song in at 147 on the furious smash-cut; cry 163-198 (meme wails on the kicks at 163 + 176, punch-in), confused 198, weird 212, Shani 232. Shani + convoy = v1 art at f - 75.
- New ending: dance floor 582 (beats 582/600/617/635), swirl + pull-back 635-652, phone reveal 652-698 with "kha se / aate hai" at 643/655/667/687.
- Lockup 698-803 (Cantina-style sticker slam, baked to `public/jyotiq/shooter/sticker-wordmark@2x.png` by `JyotiqStickerBake`). Brand VO slot from f704 (23.47 s), ~2 s: drop `public/jyotiq/shooter/vo/brand-vo.wav|mp3`, rerun the audio script, remux.
- Output: `out/jyotiq/shooter/jyotiq-shooter-reel-v2-9x16.mp4`.
