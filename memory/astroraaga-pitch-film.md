---
name: astroraaga-pitch-film
description: "AstroRaaga company pitch film (JyotiQ + KarmEQ, GrovIT engine), concepts stage since 2026-11-14; ask amount and GrovIT placement unresolved"
metadata:
  node_type: memory
  type: project
  originSessionId: f80d6721-9771-495f-8297-630e79159934
  modified: 2026-11-14T08:59:10.322Z
---

On 2026-11-14 Ayush (speaker 2 in the call) relayed founder Amit Kaushik's brief: a 1-2 min explainer/reel/pitch video for AstroRaaga AI Solutions, later a 12-15 min version, due in about a week. The astrology company covers only JyotiQ (AI) and KarmEQ (human), with GrovIT as the distribution engine; the other products move to a new company (working name "Agni"). It follows deck order: company, problem, solution, product, market, competitors, revenue, GTM, projection, team, ask. Amit's idea is that an investor walks through a mela (Meerut Nauchandi), each stall one slide; Inside Out structure is a reference only.

Concepts are in `workspace/astroraaga-pitch-film/CONCEPTS.md`. On 14 Nov Ayush picked concept A (plain mela, no diya-girl thread; string lights connect the stalls as the solution). The same day 16 painted 16:9 frames were made on Vertex (`gen_img.py shots.json`, about ₹425; ledger ₹10,870). They are in `public/img/f01–f16.jpg`, with `out/MelaBoard.jpg` from `sheet.py` and FrameJam review `rev_c64ba69353`. Signs, numbers and screens are left blank for the edit. Known flaws: f11 has painted text ('CALL COUNTER', a garbled 'KGNG'), and f05 already shows string lights, so it is too close to f06. The redo needs his OK on spend. References are passed as style-only because f03 v1 copied the gate.

Unresolved: the ask (the deck says ₹1 Cr; the call said "10 Cr minimum", about $1M); whether GrovIT is ours or belongs to Agni; a possible rename of AstroRaaga; market numbers marked "pending validation" in the deck.

**Why:** investors check these facts, and the founder is still changing names and the amount.
**How to apply:** only validated deck numbers go on screen, the ask stays a placeholder until confirmed, and the company name sits on one swappable lockup. This is concepts only per [[karmeq-concepts-not-builds]]; earlier film work is in [[jyotiq-investor-film]].

**15 Nov update (video build):** Ayush now wants the actual 1–2 min intro pitch film (emailed to investors first; a 13–14 min version follows), keeping the mela concept but in the motion style of an ElevenLabs "ElevenAgents" reel (`~/Downloads/Eleven labs copy.mp4`: off-white canvas, small UI cards, hairline lines, gradient orbs, frosted glass, morph transitions, calm low male VO at ~120 wpm, soft modern electronic music with UI pops), plus 3D planets like `~/Downloads/3d motions.mp4` (Sketchfab "Theia Prime" planets) to show AstroRaaga as the parent planet with JyotiQ, KarmEQ and GrovIT as its three moons. Decisions: 16:9; ask = ₹10 Cr (the deck's use-of-funds rupee split is for ₹1 Cr, so show percentages only); ElevenLabs voice + music approved (one take, ask before retakes); logos downloaded from astroraag.com into `video/public/astroraaga-pitch/brand/`. Site look: Marcellus + Karla, bold Georgia-style serif section titles with saffron-gradient italic accents (#c2410c → #f59e0b), cream bg ~#fdf9ef, saffron #ea580c, gold #d4a94a, brown #2c1810, KarmEQ green #059669, JyotiQ violet #7c3aed. astroraaga.com (the deck's URL and email domain) does not resolve; the live site is astroraag.com.

**Build (14–15 Nov):** Remotion code in `video/src/AstroRaaga/pitch/` (composition `AstroRaagaPitch`, 1920x1080, 3750 f = 125 s): `theme.ts` (palette, SCENES windows, `word()` lookups into `vo.json`), `ui.tsx` (Win/Scene/In/Burst/Orb/Label/Accent/Crumbs/Icon kit), `cam.ts` + `Cosmos.tsx` (three.js via @remotion/three: procedural gas-giant AstroRaaga with ring, violet JyotiQ / green KarmEQ / teal GrovIT moons, stars; render needs `--gl=angle`), scenes in `scenes/`. Voice: ElevenLabs Brian `nPczCjzI2devNBz1zQrb`, multilingual_v2, one take (~855 credits) with timestamps, then `vo/tighten.py` (gaps 0.42 s, atempo 1.04 → 122 s). Score: ElevenLabs music_v2_5 composition plan (`music/gen_music.py`, D minor, 125 s). Mix: `audio/mix.py` (earshot launch kit retuned to D minor, 160 cues, music -14 dB and -9 dB word-level duck → voice ≥12.3 LU over bed, -16 LUFS). Stills: `astroraaga-pitch-film/stills.sh <frames>`; preview: `preview.sh` (half-res, about 5 min); master: `render_final.sh` → `final/`.

**v1 delivered 14 Nov 2026:** `astroraaga-pitch-film/final/AstroRaaga_Investor_Intro_v1_1080p.mp4` (2:05, 50 MB) + `_email.mp4` (16 MB) + `.srt`; FrameJam review `rev_cd291480f9`, no comments yet. earshot critique: launch-grade (20/23, p_real 0.95). Open: ₹10 Cr vs the deck's ₹1 Cr plan; market numbers unvalidated; runs 2:05 (asked for 1–2 min).

**v2 (14 Nov):** Ayush heard "a strange woman's voice" in the background: the ElevenLabs score had wordless vocal chops (AST Speech 0.58–0.69 at 0:16–0:34 and 1:52–1:59). Fixed for free with Demucs htdemucs_ft in `~/demucs-venv` (script in the session scratchpad, `music/score_novocals.wav`); mix.py lifts the music 2.5–3.5 dB where the vocals were removed. Lesson: check ElevenLabs Music output for vocals (earshot AST "Speech") before mixing, even with "vocals" in negative_styles. The 0:28 scene now names the deck's five leaders on the bubbles. Output `final/AstroRaaga_Investor_Intro_v2_1080p.mp4` (+ `_email`), FrameJam v2 on `rev_cd291480f9`.

**v3 (14 Nov):** Ayush's notes and the fixes:
- **0:28 bubbles:** the big circle is now the combined ₹1,637 Cr ("TOP 5 COMBINED … a year"), with five satellite circles; Astrotalk is the largest satellite, because Astrotalk is not the parent of the others.
- **0:05 planet:** the "odd" move was a steep ease that took the planet from a dot to full size in about 0.6 s. `cam.ts` `openCam` is now one smoothstep log-dolly from 2.2 to 9.4 s, and the point of light fades by the planet's pixel size (`openPlanetPx`).
- **Team frame:** real photos of Amit and Dr. Shishira, cut out with macOS Vision (`VNGenerateForegroundInstanceMaskRequest`; swift script in the scratchpad), in arch frames. Files are `public/astroraaga-pitch/team/*.png`.
- **Ending (investor CTA):** a new s19 voice line, "AstroRaaga. Partner with us. Be part of this ecosystem, and together, let's bring the change." It came from `vo/gen_end.py` (one take; previous_text = s18) and was spliced in by `vo/splice_end.py`; the v2 voice is kept as `vo_tight_v2.wav` / `vo_v2.json`. The close card shows the logo with the three product orbits, plus a dashed outer orbit where a gold "You" orb arrives on "Partner".
- Only changed chunks were re-rendered (0, 1, 2, 8, 9; old ones in `render/chunks/v2/`). Output: `final/..._v3_1080p.mp4` + `_v3.srt`.

**v4 build (17 Nov):** Code is in `video/src/AstroRaaga/pitch4/` (compositions `AstroRaagaPitchV4INR` / `V4USD`, length taken from the voice).
- **Mela map:** one map (`world.ts` + `MelaMap.tsx`). Twelve 1920x1080 stall "boards" sit on a ring (RX 5800, RY 3600) around the AstroRaaga hub. The camera uses van Wijk smooth zoom (zoom out, travel, zoom in), and close-ups are clamped inside the board.
- **Stall behaviour:** a curtain lifts as each stall opens. Its content freezes once its scene ends, so visited stalls show their slide in the wide shots. Lights join at the solution, and everything glows on the ask.
- **Scenes:** in `scenes/Boards1-3.tsx`, `Hub.tsx` (solution → light-theme 3D planet with 2 moons → partner-orbit close) and `Open.tsx` (Sun sprite behind the planet, flood to the light map).
- **World map:** `worlddots.json` was built by `v4/tools/worlddots.py` from Natural Earth (world-atlas npm).
- **Voice:** Ranbir `9PvnT6XRzlljoaDG6Knu` (library voice; usable by id, but the key lacks voices_write). TTS text needs Devanagari ज्योतिक / कार्मिक and "C.O.O.", otherwise it reads 'Jotik' / 'comic' / 'CEO'. Built by `v4/gen_vo4.py` + `gen_fix4.py` → `assemble_vo.py` (tempo 1.05, scene gaps) → `pitch4/vo_<cur>.json`.
- **Music:** `gen_music4.py`, two parts. Demucs removed vocals again (part 1's vocal stem was only 5 dB under the music).
- **Mix:** `mix4.py <cur>` warps the score for USD with whole-bar edits plus a <4 % stretch.
- **Render:** stills via `v4/stills4.sh`; masters via `v4/render4.sh` (CUR=inr|usd).
- **Team:** founders' photos are in; the team of 20 is placeholder silhouettes until Ayush sends photos.

**v4 direction (Amit sir's calls, read 17 Nov):** a full restructure in the order of the 13 Nov deck (`deck/v2_13nov/deck.pptx`, text in `slides.txt`). The film may run 4–5 min.
- **Order:** Welcome ("Welcome to the world of AstroRaaga", with the Sun glowing behind the planet) → mission/vision → giant mela (emphasised) → problem (9 pain points, colourful, slower) → why solve it → solution → products → market (TAM/SAM/SOM for India, North America, Latin America; no rivals) → GTM ("our own content engine") → business model → roadmap 2027–29 → traction → competition (the only competitor scene) → moat → ask ₹10 Cr → meet the team (20-person team + group photo) → solar-system close.
- **Rules:** remove GrovIT everywhere (it moves to the other company); never say "AI" (JyotiQ = intelligence platform, KarmEQ = human expertise platform); light theme everywhere except the opening; gold, not light brown; zoom in/out on almost every scene; an Indian-accent narrator; two versions (₹10 Cr and $1M, at the deck's ₹95/$).
- **Files:** script-as-data in `v4/script_v4.py` → `SCRIPT_v4.md` + `lines_inr.json` / `lines_usd.json`. Voice previews are in `v4/voice_previews/`; candidates are Ranbir 9PvnT6XRzlljoaDG6Knu, Aaditya xMagNCpMgZ83QOEsHNre, Jeevan mCQMfsqGDT6IDkEKR20a, Shiv LrnwgcdTLxc99sutUxGU.
- **Waiting on Ayush:** script approval, a voice pick, the spend, and team photos.

**v4 delivered 17 Nov 2026:**
- **Files in `final/`:** `AstroRaaga_Investor_Film_v4_{inr,usd}_1080p.mp4` (5:44 / 5:48, ~276 MB masters), plus `_1080p_share.mp4` (70 MB, for links), `_720p_email.mp4` (23 MB, for attachments) and `.srt`. FrameJam v4 is on `rev_cd291480f9`.
- **Sound check (earshot):** launch-grade for both, at −15.3 LUFS.
- **Mix fixes:** a code-made D-minor drone fills the score's silent 3-s fade-in; MU_DB −18; voice EQ −1.5 dB at 1.8 kHz.
- **Re-render times:** INR took 75 min (chunks run slow when other jobs compete). Changing one scene → move its chunks to `render/old_chunks`, re-run `render4.sh` with a new BUNDLE_NAME, then `mux4.sh`.
- **Team:** 17 Nov Ayush said to skip the team-of-20 photos for now. The faces were removed; the founders stay, with one caption line, and the VO line is kept.
- **Still open:** ₹10 Cr vs the deck's ₹1 Cr; advisors 10+ vs the site's 50+; whether to show ₹50,000 revenue; Ayush to confirm the name pronunciations (`v4/vo/name_check_JyotiQ_KarmEQ_COO.mp3`).

**v5 brief (Amit sir's call, relayed 17 Nov evening):**
- **Four versions, all with an Indian accent (none American):** English $1M (needed first, for a US friend), English ₹10 Cr, Hindi as conversational Hinglish (not pure Hindi), and a friends-and-family version.
- **Friends-and-family version:** for about 20 people (family, acquaintances, team). Last slide: "We are raising a friends and family round, you all are invited". Terms: ₹10 Cr for 10 % (1 lakh shares), 6 months, minimum ₹10 lakh (1,000 shares), maximum ₹10 Cr. Graphic: many people (a Sardar ji, aunties, uncles, Americans, Indians) joining AstroRaaga and blessing it. Ayush will send the exact text.
- **Picture and content changes:**
  - Replace the ringed planet with the Sun everywhere, with things orbiting it like a solar system.
  - Drop the "Fiserv, Intuit, Infosys" explanation in team_2. Use short titles instead, e.g. "Building platforms that solve problems", "Digital transformation expert".
  - Some empty circles show at the start; Ayush will send screenshots.
- **Delivery:** upload all four to the AstroRaaga-email Google Drive and share with Amit sir and Dr. Shishira.
- **Voice:**
  - Ranbir Warm is listed as having a "neutral Indian accent", and multilingual_v2 neutralised it further.
  - Voice hunt is in `v4/voice_hunt/`: `library.json` (300 Indian-English library voices), `previews/` (12 free previews), `test/` (the welcome lines on **eleven_v4**: Vikrant y6Ao4Y93UrnTbmzdVlFc, Jeevan, Shiv, Raj wJ5MX7uuKXZwFqGdWM4N, Ruhaan siw1N9V8LmYeEWKyWBxv; cost 288 credits for 815 characters, about 0.35/char) and `listen/ALL_compare...mp3`.
  - The Voice Design prompt for Ayush is in `VOICE_DESIGN_PROMPT.md`.
  - The models list now includes eleven_v4 (1.0x) and eleven_v4_turbo (0.5x). 48.2k credits were left on 17 Nov.

**v5 $1M build (18 Nov):** "genuine Hindi voice" from Ayush means a **native Hindi speaker narrating in English** (authentic Indian accent, not US); the narration stays English. I first misread it and wrote a Hindi script (`v5_hin/`, unused, cue-tag system works if a Hindi film is ever asked for).
- **Voice:** Ayush picked **Raju - Clear, Natural and Warm `zT03pEAEi0VHKciJODfn`** (Hindi library voice) from 8 auditions in `v5/voice_test/ALL_8_voices_compare.mp3`; eleven_v4, language_code "en", one take per scene (`v5/gen_vo5.py`, 4,154 credits; Scribe read-back word-perfect). Ayush said to spend credits freely on this film.
- **Pipeline:** `v5/assemble_vo5.py` (TEMPO 1.03, 5:21) → `pitch4/vo_v5usd.json` + `v4/vo/vo_v5usd.wav`; `v4/mix4.py v5usd`; `v5/render5.sh` → `final/AstroRaaga_Investor_Film_v5_usd_1080p.mp4`. Composition `AstroRaagaPitchV5USD` (Cur "v5usd", money = USD); `isV5()` in theme.ts.
- **v5 picture:** AstroRaaga is a Sun (Cosmos kind 4 shader + `Corona` sprite, no ring; moons lit from the centre); team_2 drops Fiserv/Intuit/Infosys ("building platforms that solve real problems, and a digital transformation expert"; word aliases fiserv→platforms, infosys→digital).
- **Still open from the v5 brief:** ₹10 Cr English, Hinglish and friends-and-family versions; the "empty circles at the start" (no screenshots yet); Drive upload.

**v5.1 (18 Nov evening), Ayush's notes on v5:** voice cutting off; calmer, less "glittered" planets; zoom-in/out on titles; smoother transitions.
- **Cut-offs:** eleven_v4 `with-timestamps` alignment drifts up to 0.8 s, so 27/43 line cuts landed mid-word. Fix in `v5/assemble_vo5.py`: Scribe word times per scene take (`v5/stt_words.py` → `vo/stt/`), cuts at the quietest point between lines, kept only where the take is < −45 dB; run-on pairs (welcome 1+2, products 1+2, market 2+3, team 2+3) stay one piece. Lesson: never cut eleven_v4 takes by its alignment; check every edge's level.
- **Look (all behind `isV5()`):** Sun/KarmEQ/JyotiQ shaders calmer; moons lit half toward the Sun, half toward the camera; KarmEQ close-up looks along its orbit with the Sun out of frame (`orbitCam` in cam.ts); JyotiQ→KarmEQ move arcs out toward the wide shot; KarmEQ card waits for the camera to land.
- **Motion:** `In` reveals zoom from 90 % with easeSoft and zoom out 5 % on exit; captions and products headline scale too; mela moves 20–30 % longer (close-ups ≥ 1.5 s), drift push-in 4 %.
- Output `final/AstroRaaga_Investor_Film_v5.1_usd_1080p(.mp4|_share.mp4)`; ~5:09. Renders die when the internet drops (fonts load from Google): run render5.sh inside a curl-wait retry loop.

**v6 $1M (20 Nov), Amit sir's 14-slide order** from `~/Downloads/new investor pitch deck .docx` + Ayush's slide list: intro → team → problem → solution/products → segmentation matrix → mission/vision/product goals → market (India, subcontinent, Americas) → GTM → model (subscriptions, AI tokens, white-label, enterprise APIs, cross-selling) → roadmap (Y1 quarters, Y2–3, Year 3 run rate $1.13M = ₹7.875 Cr + $300K) → traction (targets 50,000 users, 20 partnerships, API integrations) → competition (astrology/wellness/coaching/community) → long-term vision + journey → funding $1M: 40 % marketing+sales, 30 % tech & AI, 20 % wages, 10 % ops & partnerships (Amit's split, overrides the docx 40/35/15/10).
- Narrator is third person ("AstroRaaga…/It…", never "we"); "AI" is now allowed (Amit's own words). KarmEQ = business software + services marketplace, JyotiQ = paid astrology intelligence (docx).
- Files: `v6/script_v6.py` → `lines_usd.json`/`SCRIPT_v6.md`; `gen_vo6.py` (Raju, 5.4k credits), `stt_words.py`, `assemble_vo6.py` (run with ~/demucs-venv python) → `pitch6/vo_v6usd.json` (6:28); `mix6.py` (earshot venv; score lengthened with 8-bar loops from part 2); `stills6.sh`; `run6.sh` → `render6.sh` → `final/AstroRaaga_Investor_Film_v6_usd_1080p(.mp4|_share.mp4)`. Code `video/src/AstroRaaga/pitch6/` (copy of pitch4; new `scenes/Boards4.tsx` = Segment + Goals boards; 14-stall ring), composition `AstroRaagaPitchV6USD`.
- Open: "50-user target" read as 50,000; Y1/Y2 revenue not in docx (shown as milestone gates); 40–45 % taken as 40 % so the split sums to 100.
- **v6.1 (20 Nov), Ayush's notes on v6:** white screen 5:44–5:47 and edges cut on many frames. Cause: soft close-ups on part of a slide (cut content; moat close-up waited on cards that came later). Fix: `go()` in pitch6/world.ts skips every soft move, so slides stay fully framed (drift push-in only); slide labels numbered 01–14; no "Our …" on screen; bottom content kept ≥100 px above the section bar; mix6 drops the matching whooshes. Lesson: before rendering, check stills every ~8 s for empty or cut frames. Output `final/AstroRaaga_Investor_Film_v6.1_usd_1080p(_share).mp4` via `v6/run61.sh`.

**v7 $1M (21 Nov), from Amit sir's 20 Nov review via the Claude Docs "Revision Plan" + `HANDOFF_v7.md`:** code `video/src/AstroRaaga/pitch7/` (comps `AstroRaagaPitchV7USD` and `...V7USDGrid`), pipeline in `astroraaga-pitch-film/v7/` (script_v7 → gen_vo7 → stt_words → assemble_vo7 → mix7 → stills7 → run7/render7 → render7_grid); full change list in `v7/CHANGES_v7.md`. Re-voiced only problem/solution/roadmap/ask (1.4k chars).
- Planet colour system: JyotiQ = Mercury green (`JY`), KarmEQ = Jupiter gold (`KM`), Saturn indigo = team, Rahu violet = AI, Ketu white-gold = wisdom; shader kinds 5/0/7/8/9 in Cosmos.tsx; `openCam7` = Sun from frame 1, then pull back to the solar system.
- Top section timeline replaces numbered labels (Label hides "NN · …" strings); keep headlines ≥ ~105 px from the top; drift push-in is 2 %.
- Painted images: free FLUX stand-ins via hf-video (anonymous quota gives ~3 images per window; no HF token set) in `v7/img/`; `v7img(name, fallback)` swaps automatically when Astra images with the same names land in `public/astroraaga-pitch/v7/img/`.
- JyotiQ app screens: `jyotiq-store-screenshots/src/screens/NN.png` — 06 home, 08 kundali, 18 chat, 14 categories (05 is the "Asking the cosmos" loader, not home).
- Open: traction numbers (2,000+ vs Play 100+; 10 vs 50+/142 experts), $1.13M run rate, white-label still in the model wheel, star-node names, KarmEQ admin screens.

**v8 $1M (22 Nov), Amit sir's call on v7** (transcript + screenshots from Ayush; "time stamps home" in the auto-transcript = TAM/SAM/SOM): code `video/src/AstroRaaga/pitch8/` (comp `AstroRaagaPitchV8USD`), pipeline `astroraaga-pitch-film/v8/` (script_v8 → gen_vo8 → stt_words → assemble_vo8 → mix8 → stills8 → run8); notes in `v8/FEEDBACK_v8.md`, changes in `v8/CHANGES_v8.md`. 7:24.
- His rules now: no planet names on screen (colours stay); the missing layer everywhere = AstroRaaga's proprietary marketing content engine (Earth blue `CE` #2F7FC1); years are 2027/2028/2029, not Year 1/2/3; no US city pilots (North America = next phase in parallel, Texas first); "AI tokens" → Tokenomics; no enterprise APIs; spiritual tourism by 2029, wellness/transformation beyond.
- Numbers: Ayush chose "2027 example only": 5,000 users, $500K India; advisors/partners 10 → 50 → 500. 2028/29 shown without figures. Market figures researched with sources on screen (Astrotalk ₹1,823 Cr FY26; TAM $60B IMARC; SAM ₹60,000 Cr RedSeer).
- India map: Natural Earth omits parts of J&K, so the GTM map is cropped at 32°N (never show that full outline in an Indian film). Data in `pitch8/india.json`.
- Website screenshots via Playwright (`~/applydesk/node_modules/playwright-core`) → `public/astroraaga-pitch/v7/web/`. Vertex images via `v8/img/gen_vertex.py` (Ayush OK'd Vertex for this film).
- Next: Amit sir wants the film turned into a PPT deck (Manas to help); a friends-and-family funding version later.
- **Pitch deck (23 Nov):** `astroraaga-pitch-film/deck/v8/AstroRaaga_Investor_Pitch_Deck_v8.pptx` (+ .pdf), 24 slides from the v8 film, generated by `build_deck.js` (pptxgenjs; modules in scratchpad, NODE_PATH) then `animate.py` (fade transitions + auto entrance animations on shapes named a<step><r|f|z>_). No LibreOffice/PowerPoint on this Mac: check slides by exporting through Keynote (osascript). Keynote ignores pptxgenjs placeholder styling and doesn't draw native charts, so titles are styled explicitly and charts are shapes. Clean 3D art from comps `AstroRaagaDeckSolar` / `AstroRaagaDeckSystem` (pitch8/DeckArt.tsx).
