# भारत Ep6 · गुरु से युद्ध: build report (25 Nov 2026)

Master: `final/Bharata_Ep6_Guru_Se_Yuddh_1080x1920.mp4` (1080x1920, 30 fps, 97.5 s, 2926 frames, H.264 CRF 12, AAC 320k, 87 MB).
Share copy: `final/..._share.mp4` (38 MB). Audio: -14.0 LUFS integrated, true peak -3.9 dBFS. No black frames; one 2.1 s near-still on the chat card.
A Whisper pass on the master hears every line in order.

## Ayush's brief (25 Nov)
Fewer captions (Manthan-style), the new logo, full render, ElevenLabs credits not a concern, voice and score fully synced, a directed-film feel, a third-person check of every frame.

## Picture (video/src/Jyotiq/bharata/ep6/)
- `Episode6.tsx` (`Bharata6Reel`): 22 shots on the voice clock; keyframed motion (axe raise on "वध", overhead on "इक्कीस", the bow rising on "भीष्म", the pranam, the arrow on "लगा" and the fall, eight lights appearing, the Prasvapa draw, Narada's raised hand, the bow and axe lowering); a camera push or pull on every shot, with shakes on hits.
- Captions: Manthan Ep2 style. Short chunks (≤3 words), a colour per speaker, one gold keyword, at y 1500 (off faces). No name chips, no fact chips.
- Kept on screen: the hook card for the first ~1.5 s, the title card, a small day counter (1 → 20, then 23), the chat feature card and the end card.
- New zodiac-wheel logo (`logo-zodiac.png`) in the brand bug, the chat card and the end card.
- Looks follow the Udyoga Parva text (BOARD.md): Bhishma all in white on a silver car; Parashurama with jata, deerskin and axe; gold car with a sun-moon banner.

## Sound (mahabharat-ep6/)
- Voices (eleven_v3, 3 takes per line; Whisper picks the best): Kaal narrates; Bhishma = Jyotiq Devavrata; Amba = Jyotiq Amba. New parts were auditioned (Whisper + earshot): Parashurama = Shiv (z +5.3), Narada = Aarush (z +4.9; Neel scored higher but was Ep5's Surya), brahmanas = Cosmic Sage. No voice slots were deleted (library voices were strong enough). Line 7 got 3 extra takes (the first ones slurred "दीजिए").
- Score: ElevenLabs Music v2.5, 7 new cues (cold-open war drums; hermitage lament; solemn field; battle; dream; day-23 climax that pulls back on Narada; haunting aftermath) + Ep5's title hit and outro.
- SFX: 12 new (field at dawn, ashram morning, axe whooshes, arrow clashes, arrow hit, crowd gasp, war tent at night, divine arrival, astra charge, astra clash, sky halt, bow draw) + the Ep5 bank, about 50 cues on picture beats.
- Voice treatments: the brahmanas as a pitch-spread chorus with reverb; Narada with a sky echo; a light open-field slap on Parashurama.
- Mix (tools/mix.py): every line at least 12.3 LU over music + SFX (median 19).
- Credits: about 7.5k characters for voices plus the music cues.

## Third-person review fixes
Captions moved from y 1330 to 1500 (they covered Narada's and Bhishma's faces); a head-lag bug that dropped Parashurama's head in the refusal shot; the astra explosion moved off "तेईसवें दिन".

## Before posting
- Switch on Instagram's AI label.
- Caption: CAPTION.md.
- Comment prompt in frame: "भीष्म सही थे या परशुराम?"
