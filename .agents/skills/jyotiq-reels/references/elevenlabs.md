# ElevenLabs voice pack format (ELEVENLABS.md)

Model: **Eleven v3**. One take per line, file named after its label (`02_narrator.mp3`), dropped into `<episode>/audio/vo/`.

Saved voices: **Kaal** (narrator), Indra, Bali, Jyotiq Dhanvantari and others made per episode. The sign-off is reused from Manthan Ep2.

## New character voice (Voice Design)

Give a prompt and a preview text in Hindi, then name the saved voice "Jyotiq <Name>". Example:

```
Original Indian male voice, around 70 years old, a wise and powerful sage. Deep, resonant and slightly gravelly, with calm authority and quiet confidence. Slow, clear, Sanskrit-trained Hindi diction. Commanding when needed, never shouting. Clean studio recording.
```

Always say "Original" voice (never imitate a real person). If an upload is only the Voice Design preview text, report it as unused.

## Lines

Group by speaker, each label as a heading line followed by a fenced block with the exact Devanagari line and v3 audio tags:

```
[shocked] वज्र गिरा... बलि की साँसें थम गईं। [mysterious] पर अगली सुबह... वो फिर खड़ा था!
```

Useful tags from past packs: `[shocked] [mysterious] [tense] [grave] [low, sad] [awed] [revealing] [warm] [curious] [gentle] [furious, shouting] [calm, powerful] [commanding] [weak, then rising]`. Use `...` for dramatic pauses.

## Sound effects (optional)

Name, then a one-line prompt with a duration, e.g.

```
Massive divine lightning bolt striking the ground, sharp thunder crack with a deep rumbling boom, 2 seconds
```

Most recent episodes synthesize SFX in the score script instead; use ElevenLabs SFX only when Ayush wants them.

## Voice IDs and cost

Kaal: `sOZQ1ppVsWN9p0pWlPgY`. Half-price Hindi models: `eleven_v4_turbo`, `eleven_flash_v2_5` (x0.5); `eleven_v3` is x1. Get balance, voices and previews through free read calls before generating. Keep tests short and one take per line.
