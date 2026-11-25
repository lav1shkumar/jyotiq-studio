# पाँच दीये · Days 2-5 · frames-first build plan (31 Oct 2026)

Goal: build every frame of Days 2-5 now, on placeholder timing estimated from the script, so that when Ayush uploads a day's takes the remaining work is only align, mix, render and review. Day 1 is delivered (`diwali-d1/final/`).
Lines and voices: `jyotiq-marketing/diwali-series/ELEVENLABS_D2-D5.md` (the source of truth for the words; never change them without Ayush).
Reference build, read-only: Day 1, whose code is in `video/src/Jyotiq/diwali/d1/` (diya.tsx, counter.tsx, market.tsx, health.tsx, yamraj.tsx, gfxD1.tsx, scenesD1a-c.tsx, DiwaliD1.tsx), its scripts in `video/scripts/diwali_d1_{vo_prep,audio,score}.py`, and its folder `diwali-d1/` (intake.py, transcribe.sh, stills.sh, render_final.sh, review.sh, PLAN.md rules and checklist). Import Day 1 components; copy files only when a day needs a changed version.

## Order and priority
Day 2 (posts Sat 7 Nov), then Day 3 (Sun 8), Day 4 (Mon 9), Day 5 (Tue 10). If a day's takes arrive while another day is being built, finish the current step, then align and render that day first (its frames must already be ready).

## Per day: the same folders and files as Day 1
- Code `video/src/Jyotiq/diwali/dN/`, assets `video/public/jyotiq/diwali/dN/`, scripts `video/scripts/diwali_dN_*.py`, folder `diwali-dN/` (SCRIPT.md with the lines and the picture plan below, intake.py, transcribe.sh, stills.sh, render_final.sh, review.sh, REPORT.md), and compositions `DiwaliDN` plus `DiwaliDNTest` in the shared Root.tsx (re-read it right before each edit).
- **Placeholder clock:** `diwali_dN_audio.py --placeholder` writes `dN/timing.ts` from the script alone. Each line's length is its word count times Day 1's measured Kaal rate (about 0.53 s per word including pauses; Day 1's 98 words came to 52.3 s). Each cue word's frame is its word position times that rate, and the gaps and beats are as in Day 1. Also write `dN/voData.ts` with flat placeholder envelopes. Every scene and graphic reads only LINES, BEATS, SCENES and CUES, so the real takes re-time everything automatically.
- **Voice-ready checkpoint (per day):** all scenes drawn, the composition type-checks, and the stills sheet has been reviewed against the checklist. Mark it in the ledger as `dN: frames ready`.
- **When takes arrive:** run the same steps as Day 1: transcribe.sh, then intake.py (dry run, then --apply), then vo_prep, then `diwali_dN_audio.py --timing-only`, then stills, then the score (adapt diwali_d1_score.py to the day's cues and palette), then the mix, then render_final.sh, then review.sh, then deliver. Missing or misread take: tell Ayush once and keep going.

## Shared building blocks (make once, in `diwali/shared/`)
1. `deities.tsx`: full-colour deities made from the Manthan figures by palette swap, as `manthan-ep6/make_dhan.py` did. Write generator scripts in `diwali-series/` and never edit Manthan files.
   - **Yamraj:** from ep6/dhanvantari.tsx (Vishnu's frame). Deep shyama skin, a red-and-gold dhoti, a tall gold mukut, the danda in one hand, kind eyes, no noose.
   - **Krishna:** from Vishnu's frame with only the two lower arms. Blue skin, yellow pitambar, a peacock feather, a flute, a youthful face.
   - **Ram:** for the vimana (small, so a simplified version is fine). Bow, blue-green skin.
   - **Yamuna:** from ep4/parvati.tsx or ep6/mohini.tsx. Dark skin, a deep blue saree with silver wave borders, a lotus, on a tortoise.
   - **Lakshmi:** import ep5/lakshmi.tsx as it is.
   - Each takes `speak` (mouth 0..1) and blinks, as DhanvantariStanding does.
2. `fx.tsx`: a diya wave (lamps lighting across a map or a city in sequence), rain and lightning, a dawn sky ramp, the Kaal time-rewind (hourglass and clock hands), fireworks-free sparkles.
3. `charts.tsx`: the hora dial (24 hours, seven graha glyphs सू चं मं बु गु शु श in Chaldean order, the current hour highlighted), the dasha timeline (the nine mahadashas in Vimshottari years: केतु 7, शुक्र 20, सूर्य 6, चंद्र 10, मंगल 7, राहु 18, गुरु 16, शनि 19, बुध 17, with a moving marker), and the gochar wheel (12 rashis with शनि, राहु, केतु, गुरु moving along it).
4. `phone.tsx`: Day 1's AppPhone, generalised (src, start offset, chips). App footage: only the known recording (2.27-9.6 s of the `_11111111.mp4` upload). The feature-specific screens (hora notification, dasha, gochar, language switch) are drawn as a stylised notification or chip card *around* that real clip, never as a fake app screenshot. Ask Ayush once for real recordings of those four screens; swap them in if they arrive.
5. `endD.tsx`: the end card with the diya row (diyas 1..N lit) and the next day's tease art. Day 5's version lights all five and shows "पाँचों दीये जल गए · शुभ दीपावली".

## Day 2 · छोटी दिवाली · यम का दीया · diya 2 · Hora
| Line | Picture |
|---|---|
| 01 | Lit from frame 0: a doorstep at dusk with rangoli and a four-wick चौमुखा diya facing south, flame flickering, slow push. Hook plate in the middle third: "मृत्यु के देवता के लिए दीया?" with a chip "दक्षिण दिशा ↓" and a pulsing "?". A Kaal time-rewind (clock hands spinning back) into the legend. |
| title | "पाँच दीये · दिन 2 · छोटी दिवाली" over the night palace; diya row with 1 lit and 2 waiting. |
| 02 | A night palace (arches, curtains, lamp light). Prince and bride as legend silhouettes in the Day 1 rim-lit style. An astrologer's scroll with a small kundali; chip "चौथी रात". |
| 03 | The bride lays gold and silver at the threshold (reuse counter.tsx coins and stacks) and lamps light corner after corner (diya wave). |
| 04 | A dark, dignified cobra with gold eyes glides to the door, squints in the glare (a light flare), coils and listens; the sky ramps to dawn and it glides away. No fangs, no strike. |
| 05 | Yamraj close-up (full colour, calm, kind), lip-synced; gold text "समय से पहले नहीं". |
| 06 | Yamraj's figure dissolves into a turning Kaal wheel (time wheel); chip "यम = काल = समय". |
| 07 | The hora dial turning, with the current graha lighting up; chip "होरा = ग्रह का घंटा". |
| 08 | The phone (real clip) with a stylised notification sliding in: "मंगल होरा · ॐ कुं कुजाय नमः" (Amit's example); chip "होरा नोटिफिकेशन · फ़्री · Jyotiq"; "छोटी दिवाली की शुभकामनाएँ". |
| end | Diya 2 lights. Tease: a dark new moon beside the Sun in the Libra scales; "कल · तीसरा दीया · सबसे कम रोशनी की रात, सबसे बड़ा त्योहार क्यों?". Comment prompt "Comment karo: aapke ghar yam ka diya jalta hai?" and the Jyotiq block. |

## Day 3 · दिवाली · लक्ष्मी पूजा · diya 3 · Dasha
| Line | Picture |
|---|---|
| 01 | Lit from frame 0: a city on Diwali night glittering with diyas and fairy lights, seen from above. The camera tilts up into an empty, moonless sky. Hook plate: "सबसे कम रोशनी की रात... सबसे बड़ा त्योहार?" with chips "🌑 अमावस्या" and "☀ तुला". |
| 02 | A sky diagram: the new-moon disc (dark, thin rim) and a dim Sun inside the Libra scales; chips "चंद्र: अमावस्या" and "सूर्य: तुला · नीच". |
| 03 | Rishis (silhouettes) light the first diya, and a diya wave spreads across the land. |
| 04 | Lakshmi (ep5) appears on her lotus at a lit doorway (lip-sync if her rig has a mouth, otherwise a glow pulse on the voice); gold text "जहाँ दीया, वहाँ लक्ष्मी". |
| 05 | The Pushpak vimana (a gold flying temple; Ram, Sita and Lakshman small inside) over Ayodhya while the houses light up below in a diya wave. |
| 06 | A counter ticks 1 to 14 years, then turns into the dasha timeline with its marker sliding; chip "दशा = जीवन का दौर". |
| 07 | Dawn spreads over the dark sky; gold text "हर अंधेरा ख़त्म होता है". |
| 08 | The phone (real clip) with a stylised dasha card ("अभी: गुरु महादशा" as an example, labelled उदाहरण); chip "आपकी दशा · फ़्री · Jyotiq"; "दिवाली की हार्दिक शुभकामनाएँ". |
| end | Diya 3 lights. Tease: a hill balanced on a fingertip in silhouette; "कल · चौथा दीया · कृष्ण ने छोटी उंगली पे पहाड़ क्यों उठाया?". Comment prompt "Comment karo: aapki kaunsi dasha chal rahi hai?". |

## Day 4 · गोवर्धन · अन्नकूट · diya 4 · Gochar
| Line | Picture |
|---|---|
| 01 | Lit from frame 0: an Annakoot thali, a hill of mixed food on brass with diyas around it. Hook plate: "हर सब्ज़ी एक साथ... क्यों?" with chip "जवाब: एक पहाड़ के नीचे". Shape match: the food hill dissolves into the Govardhan hill. |
| 02 | Gokul village (huts, cows, villagers as silhouettes) offering to Indra in the sky; young Krishna points at the hill. |
| 03 | Indra on Airavata (Ep2 Indra puppet and Airavata, read-only) in storm clouds; lightning; sheets of rain. |
| 04 | Krishna lifts Govardhan on his little finger, with trees and rocks on it. Villagers and cows shelter underneath while rain splashes off the hill. |
| 05 | Krishna close-up, smiling, lip-synced; gold text "प्रकृति का सम्मान = रक्षा". |
| 06 | Under the hill everyone cooks together, and the food items fly into a mound that matches back to the hook's thali; chip "अन्न + कूट = अन्नकूट". |
| 07 | The gochar wheel with शनि, राहु, गुरु moving; chip "गोचर = ग्रहों की चाल". |
| 08 | The phone (real clip) with a stylised gochar card; chip "गोचर · फ़्री · Jyotiq"; "गोवर्धन पूजा की शुभकामनाएँ". |
| end | Diya 4 lights. Tease: Yamraj's silhouette walking to a doorway where a sister waits; "कल · पाँचवाँ दीया · यमराज अपनी बहन के घर क्यों गए?". |

## Day 5 · भाई दूज · यम द्वितीया · all five diyas · Your language
| Line | Picture |
|---|---|
| 01 | Lit from frame 0: Yamraj (full colour) at a humble doorway lit warm from inside. Hook plate: "मृत्यु के देवता... बहन के घर खाने पे?" |
| 02 | Yamuna (full colour, on her tortoise, by the river) looks down the road as seasons pass (time-lapse); Yamraj busy in the distance. |
| 03 | Warm close-ups: the tilak, the aarti thali circling, a leaf plate of food. |
| 04 | Yamraj close-up, moved, lip-synced; gold text "बहन का तिलक, भाई की रक्षा". |
| 05 | A title graphic "यम द्वितीया → भाई दूज". |
| 06 | A map of India where the names pop up by region: भाऊबीज (Maharashtra), ભાઈ બીજ (Gujarat), ভাইফোঁটা (Bengal), भाइटीका (Nepal), भाई दूज (north). |
| 07 | "त्योहार एक, भाषाएँ अनेक" with language chips in their own scripts: हिंदी · ਪੰਜਾਬੀ · ગુજરાતી · मराठी · English. |
| 08 | The phone (real clip) with a stylised language-picker card; the chips light one by one; "भाई दूज की हार्दिक शुभकामनाएँ". |
| end | All five diyas light one after another: "पाँचों दीये जल गए · शुभ दीपावली". Comment prompt "Comment karo: apni bhasha mein Bhai Dooj ka naam?", the Jyotiq block, "Follow karo, agli series ke liye". |

## Steps (one per cycle; about 50 cycles for all four days)
1. Shared blocks, one per cycle: deities generator (Yamraj, then Krishna, then Yamuna), fx, charts, phone, endD; each with a still in `diwali-series/previews/`.
2. For each day in order: SCRIPT.md (lines from the pack plus the table above), placeholder audio script and timing, new sets for that day (one per cycle), gfxDN, scenes A/B/C, the composition and its Root registration, type-check, then the stills sheet and a third-person review. Fix, then mark `dN: frames ready`.
3. Whenever a day's takes are in uploads: align, mix, render and deliver that day (Day 1 steps).
4. Exit: when all four days are `frames ready` (and any delivered days are verified), write a short series status note, record the ledger and stop the loop. Rendering waits for the voices.

## Rules (from Day 1, plus the disk lesson)
- One small step per cycle: about 3 tool calls and at most one heavy job. Run `pgrep -fl "[r]emotion|[c]hrome-headless|[w]hisper-cli"` before any heavy job. Poll with the file reader. No subagents. Python goes in files, never heredocs. Never rm -rf.
- **Disk:** a Remotion bundle copies all 2 GB of video/public. Keep ONE stills bundle (`$KIROCREW_SCRATCH/bundle_series`), rebuild it in place (`rm -r` on a relative path first), and check `df -h` before renders. Delete a day's render bundles once its master is verified.
- Never edit Manthan or Day 1 files except to export a helper (note it in the ledger). Re-read Root.tsx before editing it.
- Frame 0 always lit; hook text in the middle third; nothing important in the bottom 250 px or the right rail; captions never on faces; gods with dignity; no gore and no fear-selling (Yamraj is calm and kind, the serpent is not scary).
- No image links in the ledger. When a choice is uncertain, make the strongest editorial choice, note it and continue. Ask Ayush only about takes or recordings.
