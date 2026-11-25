# Jyotiq Brand Bible (for Reel work)

Compiled 19 Oct 2026 (IST). Sources: the UAT web app bundle at jyotiq-site-uat.astroraag.com/chat (read directly — the page is a JavaScript app, so a plain page fetch shows nothing), the production bundle at jyotiq.astroraag.com/chat, the live public packages API (UAT + prod), the logo files, and the verified audit in `/Users/ayushrajput/.kiro/crew/workspace/jyotiq-marketing/Jyotiq-Instagram-Growth-Strategy.md` (13 Oct 2026).
Not possible: a visual render of the site (the in-app browser isn't set up on this Mac), and logged-in screens (no account used). Visual notes on the UI come from the CSS + code, not screenshots.

## 1. What Jyotiq is
- AI Vedic astrology chat by AstroRaaga AI Solutions (sister products: Karmeq = human Acharya platform, Grovit). Web app + Android (Play: com.app.jyotiq) + iOS (verified live earlier).
- Promise: ask any real life question; the answer is synthesized from YOUR exact birth chart (kundli, dashas, transits) — not generic sun-sign content.
- Name = Jyoti (light, as in Jyotish = "science of light") + IQ (intelligence). Home-screen mantra: "तमसो मा ज्योतिर्गमय — From darkness, lead me to light". Greeting "Namaste".
- Instagram: @jyotiq_. LinkedIn: company/astroraag.
- Legal framing (Terms): AI-generated astrological, tarot and spiritual insights for entertainment and informational purposes only; not financial/medical/legal/psychological advice.

## 2. How it works (user flow)
1. Sign up: phone OTP (Firebase), email OTP or Google. Guest mode exists ("Continue as Guest"); some content is "locked for guests".
2. Profile: name, date of birth, time of birth, birth country + city ("Align Your Coordinates"). Location can be detected live; default Delhi.
3. Welcome gift: "1 Flame Credited! A free flame has been added… to get you started on your cosmic journey."
4. Ask the Stars: type a question (max 99 words) or pick one of 8 guidance categories. The app may ask "Cosmic Clarification" follow-up questions and a planning horizon (short ≤3 months / mid ≤1 year / long ≤3 years).
5. While it thinks, it shows an 8-step analysis animation:
   Houses & Karakas → Lagna, Lagnesh & Chandra Kundali → Yogas & Doshas → Shadbala & Ashtakavarga → Jaimini (Karakamsha) → Dasha, Transit & Char Dasha (Vimshottari) → Nakshatra alignment (27 nakshatras) → Cosmic Synthesis ("Astro Pandit is synthesizing your personal guidance…").
6. Answer layout: YOUR QUESTION / YOUR ASTROLOGICAL PROFILE / YOUR BIRTH CHART → findings, "probability window", "strongest factors", "actionable takeaway", then Deeper Insight and Sacred Remedies (gemstones, mantras e.g. "Om Suryaya Namaha", rituals).
7. Monetisation: Flames (Sacred Flames). 1 Flame = 1 question; unlocking Sacred Remedies = 1 Flame; detailed analysis also gated. UAT only (not on prod yet): "Official 2-Page JyotiQ Assessment Report" PDF for 10 Flames (birth chart, key verdict, exact time windows, personalised remedies + daily mantras).
8. Seek Deeper Guidance: book human consultations — Astrology, Vastu, Hawan & Pooja, Gemstones, Numerology, PLR (past-life regression), Tarot (links to AstroRaaga).

## 3. Features list
- Home / Daily Insights: Today's Panchang (tithi, nakshatra, vaar, yog, karana), closest Shubh Muhurat, live Hora timings, Upcoming festivals & rituals, Quote of the Day, Vedic Wisdom, Most Asked Questions, "Where Does Your Light Fall?".
- 8 guidance experts (each is an "agent" persona — strong character material):
  General Advisor (life purpose, daily guidance, clarity) · Love Expert (relationships, partnerships, marriage timing) · Health Consultant (well-being, healing, vitality) · Wealth Advisor (prosperity, investments, assets) · Career Expert (profession, business growth, job search) · Travel Advisor (journeys, relocation, foreign lands) · Education Guide (academics, exams) · Family Advisor (domestic harmony, relatives).
- Kundali dashboard: North Indian chart; 16 divisional charts D1–D60 (D1 birth chart, D9 Navamsha spouse/dharma, D10 career, D60 past karma…); planets/houses/doshas/yogas/Ashtakavarga tabs; Vimshottari Mahadasha/Antardasha/Pratyantardasha timeline; live transits; Shadbala planetary strength; Jaimini AmK (career).
- Yogas/doshas the app names: Gaja Kesari, Budhaditya, Chandra-Mangala, Vipreet Raja Yoga; Manglik/Mangal Dosha, Pitra Dosha.
- Tarot card draw ("Draw another card for guidance").
- Past readings with transcripts, reports library, transaction ledger ("Sacred Ledger") with receipts.
- Languages: English, Hindi, Marathi, Punjabi, Bengali, Gujarati, Portuguese, Spanish. Light and dark theme. Guided walkthroughs.
- Payments: Razorpay (₹), Stripe ($).

Example questions straight from the app (good hook material):
"When is the next Shubh Muhurat for starting a business?" · "Which career path aligns with my Kundali's sun sign?" · "How does the current Saturn transit affect my health?" · "What does the Moon and Mars combo in my 7th house mean?" · "Are there any strong financial gains expected this year?" · "Which gemstone is most suitable for my Mahadasha?"

## 4. Pricing (live API, 19 Oct 2026)
| Pack | Production | UAT (possibly upcoming) |
|---|---|---|
| Unit | ₹5 = 1 Flame | same |
| Starter | ₹95 = 20 Flames (₹4.75 each) | ₹105 = 25 Flames (₹4.20 each) |
| Popular | ₹248 = 50 + 10 bonus = 60 (₹4.13 each) | same |
| Enterprise | ₹995 = 200 + 25 bonus = 225 (₹4.42 each) | same |
- All packs carry validityDays 365, which conflicts with the in-app "Flames never expire!". Popular says "10% bonus" (actually 20%); Enterprise says "20% bonus" (actually 12.5%). Don't repeat these claims in Reels until fixed.
- Safe headline: "Pehla sawaal free. Phir ₹5 per sawaal." Use production prices only.

## 5. Audience, positioning, tone (from the 13 Oct strategy, still valid)
- Primary: 22–32, metro + tier-2, Hinglish speakers, life-stage deciders (marriage, love, ex, job switch). Secondary: 26–45 hustlers/business owners (Hindi-first, muhurat, career, money). Later: 38–55 family deciders.
- Problem owned: "One big question I can't ask at home, don't want to pay ₹500 for a call, and Google is generic — I want a straight answer for my chart, now, privately." Clarity before the conversation.
- Positioning: the Vedic astrology chat that answers YOUR question from YOUR kundli, in your language, ₹5 a question, first one free; no per-minute meter; human Acharyas a step away.
- Taglines in use/test: "Jyotiq se pucho" (CTA), "Ek sawaal. Saaf jawab.", "Sawaal aapka, kundli aapki."
- Voice: calm, honest didi/bhaiya who knows Jyotish; warm, lightly witty Hinglish. In-app copy is grander and "cosmic" ("cosmic engines", "align your coordinates", "sacred flames") — for Reels keep the mythic flavour in visuals, plain words in text.
- Rules: say "guidance / your chart suggests", never "guarantee / you WILL / 100% accurate". No fear selling ("dosha ka khatra", "turant upay"). Never mock astrologers, believers or deities. Don't attack human gurus.

## 6. Visual identity
Logo (files: `jyotiq-logo-site.png` 444x511 transparent — use this one for production; `jyotiq-logo-shared-black.png` is your 166x158 screenshot, too small for video):
- Symbol: a brain drawn as circuit lines (AI/IQ) with "IQ" inside the right hemisphere, floating above a line-art diya with a flame. Meaning: the light of Jyotish + machine intelligence. Small sparkles/stars around the brain.
- Wordmark "JYOTIQ": rounded, heavy geometric sans in caps, with a gold five-point star on the Q's tail.
- Colours sampled from the logo file:
  - Brain gradient: cyan #40D8E8 (top) → periwinkle #68B0E8 → violet #9888D8 (IQ) → peach-pink #F8A8A0 (bottom).
  - Diya: soft gold line #F8D080, flame yellow #F8D060.
  - Wordmark gradient left→right: magenta-pink #E05088 → coral #E86070 → orange #F07858 → amber #F0A048 → gold #F0B848; star #F0A848.
  - Background: black (as shared).
- Web app UI palette (from CSS): brand gold #DFB15B (hover #F3DB9D), amber #F99C00 / #D97706, deep browns #461901 / #7B3306, near-black warm backgrounds #0C0A07 / #110E0A / #12100C, light theme creams #FEF3C6 / #FBF7F0 / #FFFBEB. Loader colour #A87232 on #0C0A07.
- Fonts in the app: Playfair Display (serif headings) + Plus Jakarta Sans (body/UI). The logo wordmark is a different rounded sans (exact font not determinable; assumption: a custom/bold rounded geometric font).
- UI motifs: orbit rings rotating (dashaOrbit 20–28s), radar sweep, moon pulse, scan pulse, ✦ sparkle glyph, 🔥 flame as currency icon.
- Note the split: the logo is neon AI gradient; the app is temple gold-on-black. For Reels: warm black base + diya gold for the world/lighting, logo gradient only on the logo, end card and key highlights.
- Mascot: the brain-diya "Jyoti" (already used on the IG feed) — good for a cute recurring sidekick, not for serious answers.

## 7. Astrology working knowledge (for Jyotiq Reels)
### Navagraha — role, look and props for character design
| Graha | Governs (karaka) | Day | Colour | Traditional look / vahana | Gem | Mantra (in-app style) |
|---|---|---|---|---|---|---|
| Surya (Sun) | soul, father, authority, government, confidence | Sunday | red/saffron, gold | radiant crown + halo, lotus in hands, chariot of 7 horses (charioteer Aruna) | Ruby | Om Suryaya Namaha |
| Chandra (Moon) | mind, mother, emotions, peace | Monday | white/silver | crescent on head, white robes, chariot drawn by antelope/white horses | Pearl | Om Chandraya Namaha |
| Mangal (Mars) | energy, courage, siblings, land, police/army, conflict | Tuesday | red | red-skinned warrior, four arms, trident/spear/mace, rides a ram | Red Coral | Om Angarakaya Namaha |
| Budh (Mercury) | intellect, speech, business, communication | Wednesday | green | young, green, sword + shield, rides a lion (or chariot) | Emerald | Om Budhaya Namaha |
| Guru/Brihaspati (Jupiter) | wisdom, teachers, children, wealth, marriage (for women) | Thursday | yellow | guru of the devas, yellow robes, book/rosary/staff, rides an elephant | Yellow Sapphire | Om Gurave Namaha |
| Shukra (Venus) | love, beauty, luxury, arts, marriage, vehicles | Friday | white/pastel | guru of the asuras, white, elegant, rides a white horse | Diamond | Om Shukraya Namaha |
| Shani (Saturn) | karma, justice, discipline, delay, hard work, longevity | Saturday | dark blue/black | dark-skinned, stern, staff/bow, rides a crow (sometimes vulture); slow, limping; son of Surya and Chhaya | Blue Sapphire | Om Shanaischaraya Namaha |
| Rahu (north node) | obsession, illusion, foreign, tech, sudden rise, ambition | — | smoky | only a head (severed by Vishnu's Sudarshan chakra during the churning of the ocean), dragon/serpent energy, rides a lion/tiger | Hessonite (Gomed) | Om Rahave Namaha |
| Ketu (south node) | detachment, moksha, past lives, secrets, intuition, sudden cuts | — | smoky grey | headless body / serpent's tail, flag/banner, rides a vulture/eagle | Cat's eye | Om Ketave Namaha |
Iconography note: Ketu = headless; Rahu = head only. Using these cues fixes the "who is purple hair?" confusion from the @astrokarak reference.

### Core building blocks
- 12 rashis (signs): Mesh, Vrishabh, Mithun, Kark, Simha, Kanya, Tula, Vrishchik, Dhanu, Makar, Kumbh, Meen. Indians usually mean Moon sign (Chandra Rashi) by "rashi"; Jyotiq also stresses Lagna (ascendant).
- 12 bhavas (houses): 1 self/body, 2 wealth/family/speech, 3 courage/siblings, 4 home/mother/vehicles, 5 children/intellect/romance, 6 enemies/disease/jobs/debts, 7 marriage/partnership, 8 longevity/secrets/sudden events, 9 luck/dharma/father/guru, 10 career/status, 11 gains/friends, 12 losses/foreign/moksha.
- 27 nakshatras (Ashwini … Revati), each with a deity and ruling planet; the Moon's nakshatra at birth sets the dasha sequence.
- Vimshottari dasha (120-year cycle): Ketu 7, Venus 20, Sun 6, Moon 10, Mars 7, Rahu 18, Jupiter 16, Saturn 19, Mercury 17 years → Mahadasha / Antardasha / Pratyantardasha. "Mahadasha" questions are common.
- Gochar (transits): current planet movement over the natal chart. Sade Sati = Saturn's ~7.5-year transit over the 12th, 1st and 2nd from the Moon; Shani ki dhaiyya; Saturn return. Topical but fear-prone — frame as "discipline phase", not doom.
- Divisional charts: D1 Rashi, D9 Navamsha (marriage/dharma), D10 Dashamsha (career), D60 (past karma) etc.
- Yogas: Gaja Kesari (Jupiter–Moon; wisdom/fame), Budhaditya (Sun–Mercury; intellect), Chandra-Mangala (Moon–Mars; wealth drive), Raja yogas, Vipreet Raja (rise through adversity).
- Doshas: Mangal/Manglik (Mars in 1, 2, 4, 7, 8, 12 — marriage-matching worry), Pitra dosha, Kaal Sarp. Handle gently; never sell fear.
- Panchang (5 limbs): tithi, vaar, nakshatra, yoga, karana. Muhurat = auspicious window (shaadi, griha pravesh, business start). Hora = planetary hour.
- Jaimini: chara karakas — Atmakaraka (soul), Amatyakaraka/AmK (career), Darakaraka (spouse); Karakamsha.
- Shadbala (6-fold planetary strength), Ashtakavarga (house scores).
- Remedies (upay): mantra jaap, gemstones, daan (charity) on the planet's day, fasting, pooja/hawan, seva. Jyotiq gates "Sacred Remedies" behind 1 Flame.
- Kundli Milan / Guna Milan (36 gunas) — marriage matching; very high-interest topic in India (not a named Jyotiq feature — don't claim it).

### Story hooks that map to Jyotiq
- "Graha squad" concept (from the reference): each planet has one job → turn into "your 9 grahas are a team; Jyotiq reads the whole team for your question".
- The 8-step analysis animation is a ready-made "what happens in 10 seconds after you ask" montage.
- The 8 expert agents can be a cast (Love Expert, Career Expert…), each tied to a graha: Love → Shukra, Career → Shani/Surya (10th house), Wealth → Guru, Health → Surya/Mangal, Education → Budh/Guru, Travel → Rahu/Chandra (12th/9th), Family → Chandra (4th).
- Time-sensitive claims (which sign Saturn/Jupiter/Rahu is in this month) must be checked live in the app's Transit tab or a current Panchang before a Reel uses them.

## 8. Reel production rules for Jyotiq
- 1080x1920, 30fps. Never open on a black first frame; open on the one lit element (diya flame / phone glow). Hook text in the middle third, clear of the bottom ~250px and the right rail; must survive sound-off.
- Show the real UI (screen recording) for proof; captions hand-burned, never model-rendered text.
- CTA: "Jyotiq se pucho" + first question free + ₹5 per question; link to production `jyotiq.astroraag.com/chat` (never the UAT URL) and Play/App Store.
- Deities with dignity: heroic, calm, accurate iconography; no comedy at the gods' expense; neutral villains.
- Small disclaimer on any prediction-like claim: "Guidance only, for entertainment and information."
