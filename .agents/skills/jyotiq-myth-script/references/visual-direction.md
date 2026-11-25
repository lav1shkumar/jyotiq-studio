# Visual direction and production workflow

Read this file only after Ayush has approved a script **and** explicitly asked for production. Until then it is stored guidance, not a to-do list.

## Target look

The look of an **Indian mythological television drama**: devotional-epic staging, with believable people in rich, physical sets. The aesthetic inspiration is reference frames Ayush shared from the Instagram account @theepictalesindia (a 93 s, 720×1280 sample was reviewed on 2026-11-09). Treat that account as a mood reference only:
- Do not claim to know its tools, models, prompts or workflow.
- Do not reproduce its watermark (a small round "epic tales" seal, bottom right), its logo, or its branding. Never put "epic tales" or a seal-like mark in a prompt.
- Do not copy its specific compositions shot for shot. Build Jyotiq's own frames for each story.

What the reference does well, and what we keep:
- 9:16 vertical frames with one clear subject: a sage pointing in anger, a king on a throne, a goddess offering a vessel.
- Grand but readable depth: a character in the foreground, a court or crowd in the middle ground, architecture or landscape behind.
- Heavily ornamented costume and jewellery that tells you at a glance who is royal, who is an ascetic, and who is divine.
- Big mythic set pieces (a mountain wrapped by a serpent, a cosmic turtle) used for the story's central image, not for every shot.

Where we deliberately push further than the reference: it often leans toward a glossy painted or poster finish with bright blue skies and seas. **Our target is more live-action**, with natural skin, warmer light and a more restrained palette, as set out below.

## Must have

- **People:** believable human performers with natural skin texture (pores, fine lines, slight unevenness), expressive faces and real emotion in the eyes and mouth. Age, build and complexion should suit each character.
- **Costume:** elaborate, character-appropriate crowns (mukut), jewellery, sacred markings (tilak, tripundra, vibhuti), rudraksha, and draped garments (dhoti, uttariya, saree, angavastram) with visible fabric weight, folds and zari work. Ascetics wear saffron and bark-cloth with matted hair; royals wear gold and silk; devas, asuras and rishis are clearly different from one another.
- **Environments that look built:** palace courtyards with carved pillars and silk canopies, forest ashrams with thatch, yajna kund and tulsi, riverbanks with ghats and diyas, carved stone temples, and brass objects (kalash, lamps, plates) with real patina, plus oil lamps.
- **Light:** warm and directional, from oil lamps, firelight, low sun or shafts through pillars. Faces are modelled by light and shadow, not lit flat.
- **Palette:** antique gold, cream, saffron, earthy red and natural green. Blues and night tones appear only where the story needs them (ocean, night, Vishnu or Krishna skin tone), and are kept deep rather than electric.
- **Coverage:** emotional close-ups, two-shots of characters reacting to each other, reaction shots from onlookers, and meaningful object details (a dropped garland, a vessel, a lamp flame, a footprint). Every shot should be doing something, not just presenting a character.
- **Divine effects:** restrained and story-driven, such as a soft aura on a deity at the moment of revelation, a single beam, or poison as dark smoke. Keep them to one effect per beat that needs it.
- **Consistency:** the same face, costume, jewellery, props and location from shot to shot. Keep screen direction stable (if Deva are on the left, they stay left), and keep the time of day and light direction continuous within a scene.

## Avoid

- Waxy, plastic, airbrushed or doll-like faces, and "AI beauty" sameness across characters.
- Generic Western or fantasy armour, Game-of-Thrones leather, and sci-fi metal.
- Neon colours, purple-teal grading, heavy bloom or glow, lens-flare spam.
- Random floating particles, sparkles, or fog with no source.
- Characters posing for the camera in every shot, front-on and expressionless.
- Text, watermarks, logos or signatures baked into generated frames.
- Graphic gore. Imply violence through reaction, aftermath or shadow.

## Production workflow (after explicit go-ahead)

Do each step, show it, and **wait for approval** before the next. Ask before any paid generation (Veo and other spend), and use the free route first where it can give the quality needed (see Ayush's memory notes on hf-video and Veo).

1. **Cast and location list.** Pull every character and location from the approved script, and propose a short visual brief for each (age, build, complexion, hair, costume, jewellery, markings, signature prop; for locations, architecture, time of day, light source). Text only.
2. **Reference sheets.** For each main character, a consistent reference: a front portrait, a three-quarter view, and a full-length costume shot. For each location, an establishing frame. These anchor every later shot.
3. **Three visual tests.** Three finished-quality frames from different beats of the script (for example the hook moment, the emotional peak and the resolution), to check that the look, faces and palette hold up. Revise until Ayush approves.
4. **Then, as Ayush requests:**
   - a **storyboard** mapping each voiceover line to shot(s), with shot size, action, emotion and duration;
   - **image prompts** per shot, reusing the reference-sheet descriptions word for word for consistency;
   - **motion prompts** per shot, with small, motivated movement (slow push-in, a turn of the head, a flickering lamp, cloth in the wind) rather than wild camera moves;
   - a **Remotion editing plan**, built and rendered through the `jyotiq-reels` skill (workspace, house rules, audio, Jyotiq end block).

### Prompt skeleton (for step 4)

```
Cinematic still from an Indian mythological television drama, vertical 9:16.
[Shot size] of [character from reference sheet: exact description], [action + emotion],
in [location from reference sheet], [time of day], lit by [warm motivated source],
palette of antique gold, cream, saffron, earthy red and natural green.
Natural skin texture, real fabric folds, physical set, shallow depth of field.
No text, no watermark, no logo, no neon, no floating particles, no glow.
```
