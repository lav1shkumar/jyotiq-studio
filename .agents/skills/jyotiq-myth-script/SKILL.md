---
name: jyotiq-myth-script
description: Writes voiceover scripts (80 seconds max, Jyotiq sign-off included) for Jyotiq mythological storytelling reels, and stores the visual direction for later production in the style of an Indian mythological TV drama. Script only by default; production waits for an explicit request. Use whenever Ayush gives a mythological story, deity, epic incident, festival, vrat katha, Purana or Ramayana/Mahabharata passage, or a topic and asks for a reel script, katha, voiceover, hooks, or "write the next story", even if he does not say "skill". Also use when he asks to start production on an approved mythology script, so the production gate below is applied. Comes before jyotiq-reels, because this skill owns the story and script stage, and jyotiq-reels owns the Remotion build after production is approved.
---

# Jyotiq mythological story reels

Jyotiq is an astrology guidance product that people use through chat. These reels tell one mythological incident well, so that a viewer with no background in Hindu mythology is moved by it and understands it. The reel then ends with a short, honest introduction to Jyotiq.

The skill has two stages, each behind its own gate. Most requests only ever reach Stage 1.

| Stage | What happens | Starts when |
|---|---|---|
| 1. Script | Hooks, one voiceover script, word count and duration, source note | Ayush gives a topic, story, festival or passage |
| 2. Production | Reference sheets, three visual tests, then storyboard, prompts and Remotion plan | Ayush **explicitly asks for production** on a script he has **approved** |

## Gate rules (read first)

- During Stage 1, produce **text only**. Do not generate images, video, voiceover or music, and do not write Remotion code, a storyboard, shot lists, image prompts or motion prompts. Do not call any paid generation tool (Veo, Runway, ElevenLabs, HF Spaces) or open the jyotiq-reels build flow.
- **Approving a script does not start production.** "Script final hai", "approved" or "looks good" approve only the words. Stage 2 needs a separate, explicit request such as "start production" or "visuals banao". If the request is unclear, ask.
- In Stage 2, work one step at a time and wait for approval after each: reference sheets → three visual tests → whatever he asks for next (storyboard, image prompts, motion prompts, Remotion editing plan). Spending money still follows the standing rule: ask before any paid generation.
- **Do not choose a story yourself.** If the skill is invoked without a topic, ask for one, or for a source passage.

These gates exist because Ayush reviews the story before anything costly gets made, and a story change after visuals exist throws work away.

---

## Stage 1: the script

### 1. Understand the incident

- Use Ayush's source passage if he gives one. It is the primary text.
- When research tools are available (WebSearch, a web-fetch agent), check the central incident against reliable sources: the text itself or a reputable translation, scholarly or encyclopaedic references, and established temple or tradition sources. Two minutes of checking is enough; this is not a research report.
- Classify what you are telling as **scriptural** (name the text, e.g. Valmiki Ramayana, Bhagavata Purana, Shiva Purana), **regional or later tradition** (e.g. Ramcharitmanas, Krittivasi Ramayana, a temple legend), **folk tradition**, or **creative dramatisation** (feelings, gestures, or pauses the sources do not state).
- If tellings differ in a way that changes the story, pick one and say which in the source note. Do not blend versions without saying so.

### 2. Find the single incident

Pick **one** moment with stakes, such as a choice, a curse, a test, a loss, or a refusal. A reel covering a whole avatar's life or a whole war will be thin. Ask: *what one question will the viewer want answered?* Raise that question in the first 10–15 seconds, and make the ending answer it.

### 3. Write the hooks

Write three short alternative hooks (one or two spoken lines each, about 5 seconds). Each should open on conflict, a surprising event, a hard choice or an emotional consequence. For example:
- an action in progress: "जिस दिन सीता ने धरती से वापस ले जाने को कहा…"
- a choice: "एक माँ को चुनना था—बेटे की जान, या अपना वचन।"
- a consequence first: "एक श्राप की वजह से इंद्र का सारा वैभव समुद्र में डूब गया।"

Avoid "नमस्कार दोस्तों", "क्या आप जानते हैं…?", "आज हम आपको बताएँगे", "आप यकीन नहीं करेंगे" and other clickbait, and any hook that gives away the ending. Recommend one, with a one-sentence reason.

### 4. Write the voiceover

Craft rules:
- **Introduce only who is needed.** Give each essential character one clear identity tag the first time they appear ("देवताओं के राजा इंद्र", "ऋषि दुर्वासा, जिनका क्रोध प्रसिद्ध था"). Leave out the genealogy, the extra names and the backstory nobody needs.
- **Cause and effect.** Each sentence follows from the one before: because of this, that happened. Cut any sentence that does not move the story, deepen the feeling, or set up the payoff.
- **Spoken language.** Use conversational Hindi in Devanagari unless Ayush asks for another language. Use everyday words, with Sanskrit terms only where they carry meaning, and explain them in passing. Write short sentences that a narrator can say in one breath.
- **Storyteller voice.** Sound like a grandparent or a gifted kathakaar telling the story at night, not a textbook, a pravachan, a motivational speech or an advert. No moral lecture at the end. Let the story carry the meaning.
- **Earned emotion.** Use emotions the story itself holds: devotion, fear, humiliation, love, sacrifice, pride, loss, hope. Avoid invented gore, "shocking" framing, or adjectives piled on to sound dramatic.
- **Pauses.** Mark intended dramatic pauses with `…` or a line break. Use them for weight, not filler.
- **Resolution before brand.** The story fully lands, with the question answered, before Jyotiq appears.

Accuracy rules:
- Do not invent quotations, shlokas, divine pronouncements or exact numbers. If a character speaks, either paraphrase what the source says ("दुर्वासा ने श्राप दिया कि…") or attribute it plainly, and keep any wording that is dramatisation to a minimum, marked in the source note.
- Do not state myth as historical fact ("5000 साल पहले ठीक इसी जगह…") unless the tradition itself says so, and even then frame it as the tradition's claim.
- Do not invent a link between the story and astrology. If the source involves planets, nakshatras or muhurta, that link can be used. Otherwise do not add one.

### 5. The Jyotiq ending (5–12 seconds)

There are two modes. Pick the one that is honest for this story.

**Feature mode (the default since the founder's 30 Oct 2026 call).** Every reel ends on **one** Jyotiq app feature that fits that day's story, instead of a bare "ज्योतिक़ से पूछो". Read the feature table and fact checks in `~/.kiro/crew/workspace/jyotiq-marketing/founder-notes/2026-10-30-amit-call-features-diwali.md` (sections 3 and 9) before writing the ending.
- Find the everyday problem inside the story (a sudden change, work stuck at the last minute, a bad day for a decision, pride in one's own language), turn it toward the viewer in one line, then name the feature that lets them check it. Founder's pitch: much of Jyotiq is free and needs no question: "डाउनलोड कीजिए और चेक कीजिए।"
- Story moment → feature: sudden life change, enemy turned ally → **दशा**. Almost done, then stuck at the last minute → **गोचर** (Shani, Rahu, Ketu, Guru). A graha's nature or strength → **फ़्री कुंडली** (16 वर्ग charts). Timing, the right hour → **होरा notifications with mantra**. A decision on the wrong day → **आज अनुकूल/प्रतिकूल, क्या करें/टालें**. Tithi, vrat, festival → **पंचांग**. One's own language → **अपनी भाषा में**. A personal dilemma → a chat question.
- Rotate features. Check `~/.kiro/crew/workspace/jyotiq-marketing/FEATURE-LOG.md` and don't repeat the previous reel's feature. Add the new reel's feature to that log.
- The feature line is an invitation to check the viewer's own chart. Never claim that a dasha or gochar caused the event in the myth unless the source says so.
- Marriage: say "कब", never "किससे" (the bio says "शादी कब होगी"). Jyotiq doesn't tell you who you will marry.
- Don't put a language count in the voiceover. The site lists 8 languages (checked 12 Nov 2026) but the founder said 6, so it isn't settled. "आपकी अपनी भाषा में" is safe.
- Length: a feature ending takes 10–18 words. Under a 60 s series cap it has to fit in that.

**Simple sign-off**, used only when no feature fits honestly:
> "ऐसी ही कथाओं के लिए, ज्योतिक़।"

Either way:
- Jyotiq offers **guidance**. Do not promise outcomes or certainty ("आपका भविष्य बदल देगा", "सही जवाब मिलेगा").
- Do not suggest that a deity, sage or scripture endorses or foretold Jyotiq, and do not put Jyotiq inside the story world.
- The previously approved voiced sign-off is "ज्योतिक़ से पूछिए। पहला सवाल फ़्री।" Use it only if the offer is still current. The new site (jyotiq.ai/jyotiqai, checked 12 Nov 2026) says only "1 Flame per question, as low as ₹5" and "2-page report at ₹25", with no free first question. Until Ayush confirms, prefer "फ़्री में देखिए" about free features. Do not invent new pricing or offers.

### 6. Budget the time

The 80 seconds include the Jyotiq ending. Plan with a calm storytelling pace rather than a rushed one:

- **Hindi narration:** about 2 words per second (30 s ≈ 60 words).
- **English narration:** about 2.3 words per second.
- Add about 0.7 s for each marked dramatic pause.
- Estimated duration = words ÷ pace + pauses. **Stay at or under 78 s** so the edit has room. For Hindi that usually means about 130–145 words in total with a few pauses.
- **Series reels in the Manthan format** (Manthan, नवग्रह जन्म) have the house cap of under 60 s. Aim for about 105–112 Hindi words in total, including the feature ending.
- If it runs over, cut lines. Do not ask for faster delivery. The first things to cut are backstory, a second adjective, and any line that restates an earlier one.

Count words by splitting on whitespace (Devanagari danda and `…` are not words). Report the count and the estimate, and show the arithmetic briefly.

### 7. Return exactly this

```
## Hooks
1. …
2. …
3. …

**Recommended: #N.** <one sentence on why>

## Voiceover
<the full script, hook first, Jyotiq ending last.
 Spoken words only, no scene directions, no [brackets], no camera notes.
 Line breaks and … for pauses are fine.>

## Length
Words: N (story N1 + Jyotiq N2) · Pauses: P · Estimated duration: ~S s at <pace>

## Feature
<the one app feature the ending shows> · <the story moment it hangs on> · free or paid

## Source note
- Incident and source: <text / tradition, with type: scriptural / regional / folk>
- Version chosen: <only if versions differ materially, and why>
- Dramatisation: <what is imagined: feelings, gestures, any paraphrased speech>
- Uncertainty: <anything not verified, or "verified against …">
```

Leave out a storyboard, visual notes, music cues, any promise that the reel will go viral, and research notes inside the voiceover. Keep the source note short, three to six bullets. End by asking whether to revise the script or approve it, and remind him that approval does not start production.

### Revisions

When Ayush gives feedback, change only what he asked about and keep the lines he approved word for word. Return the full revised voiceover with an updated length line. Return new hooks only if the opening changed.

---

## Stage 2: production (only on explicit request after approval)

Read [references/visual-direction.md](references/visual-direction.md) before doing anything in this stage. It holds the visual target, palette, the things to avoid, the consistency rules, and the step-by-step production workflow with an approval after each step. When the plan reaches the actual build, hand over to the `jyotiq-reels` skill (Remotion workspace, house rules, audio pipeline) and follow it.
