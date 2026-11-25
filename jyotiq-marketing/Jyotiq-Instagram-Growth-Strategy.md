# Jyotiq: Organic Instagram Growth & Marketing Strategy

Prepared 13 Oct 2026 (IST) for @jyotiq_ / AstroRaaga AI Solutions. Every fact here was checked on or before this date.

**How to read the labels**

| Label | Meaning |
|---|---|
| [VERIFIED] | I checked it myself: your screenshots, the live web app code, the live pricing API or the Play Store listing |
| [REPORTED] | Comes from a cited third party (news, company page, research firm). It is only as good as that source |
| [ESTIMATE] | My calculation or a vendor's estimate, with the assumptions stated |
| [HYPOTHESIS] | A reasoned guess that still needs testing |
| [CONFIRM] | Something your team has to confirm before it goes into any marketing copy |

**What I could and could not inspect**

- Instagram: logged-out access shows only a login wall, so **I watched none of your Reels**. I did not see audio, captions, hooks after the first frame, retention or comments. The audit uses your two grid screenshots (88 Reel covers with public view counts) and the profile header. Everything I say about a Reel is based on its cover.
- Competitors' Instagram accounts: also behind the login wall. Claims about their content come from cited press or third-party data, never from feeds I watched. Section 3.3 gives a 15-minute checklist to verify them yourselves.
- Web app: the page renders in JavaScript, so a plain fetch returned nothing. Instead I read the production and UAT bundles' user-facing text, the public pricing endpoint the Plans page calls, the Play Store listing, and product screenshots you shared earlier. I did not create an account, ask a question or read a real answer, so **answer quality is unverified**.

---

## 1. Executive summary

**The biggest opportunity: make the answer the advertisement.** Jyotiq sells a specific answer to a specific life question. Most of the account so far has sold the *app* instead, through download badges, "1 Flame = 1 Question @ ₹5", "not an ordinary AI app" claims and festival greetings. The few Reels that put the viewer's own inner question on screen are the account's biggest identifiable hits:

- "Astrology guidance chahiye… but confused kaha se start kare?": 5,139 views
- "Wondering when your financial struggles will finally end?": 2,308 views

The account median is about 125 views [VERIFIED from the grid]. If those two hits were organic and not boosted [CONFIRM], they did 18 to 41 times the median.

Indian astrology demand is concentrated in a few questions:

- On one platform's data, marriage timing and compatibility are 42% of women's queries and love is another 28% ([Storyboard18, 11 Mar 2026](https://www.storyboard18.com/digital/young-indian-women-lead-digital-astrology-platforms-for-guidance-ws-l-91803.htm)).
- At Astrotalk, relationships and marriage are about 25% of Indian consultations and career/business about 18% ([Storyboard18, 21 Mar 2026](https://www.storyboard18.com/brand-marketing/marriages-in-india-breakups-in-new-york-astrotalk-astrology-data-shows-cultural-divide-92808.htm)).

Jyotiq's product is already organised around exactly these questions: Love, Career, Wealth and the rest [VERIFIED].

**What to do, in one line:** build two or three recognisable Hinglish series around India's top life questions (shaadi, relationships, career, money). Show the real Jyotiq screen answering a real question, use real faces, and test hooks cheaply on non-followers with Trial Reels. At the same time, fix the leaks that stop attention from turning into usage.

**Five things to fix this week (all verified):**

1. **The bio link skips the web chat.** `tr.ee/pQfk4W` redirects straight to the Google Play listing. iPhone users, and anyone who doesn't want to install an app, hit a dead end, even though the web chat has a guest mode.
2. **The pricing story contradicts itself.** Onboarding says "Purchased Flames never expire!", but every live package has `validityDays: 365`.
   - The Popular Pack says "10% bonus tokens" but gives 20%.
   - The Enterprise Pack says "20% bonus tokens" but gives 12.5%, and it costs more per question (₹4.42) than the Popular Pack (₹4.13).
   - In India this is misleading-advertising territory: CCPA's 2022 guidelines ([Khaitan summary](https://khaitanco.com/sites/default/files/2022-06/Ergo_11062022.pdf)) and the 2023 dark-patterns guidelines ([Indian Express, Dec 2023](https://indianexpress.com/article/india/center-notifies-guidelines-against-dark-patterns-mislead-buyers-9049966/)).
3. **AI-generated people may be costing reach.** Many covers show photoreal people who look AI-generated [CONFIRM]. Since 31 Aug 2026 Instagram labels "AI generated profiles", and unlabelled ones it detects can become non-recommendable to non-followers ([Mondaq, 12 Oct 2026](https://www.mondaq.com/india/social-media/1853738/instagrams-2026-ai-labelling-rules)). India's synthetic-content rules have been in force since 20 Feb 2026 ([Lexology](https://www.lexology.com/library/detail.aspx?g=3e894ffc-4e0b-4487-a5e9-015d490d45d3)).
   - Your newest 18 Reels have a median of about 62 views, against about 132 to 141 earlier [VERIFIED from the grid].
   - Whether the label policy is a cause is a [HYPOTHESIS] worth checking in Account Status today.
4. **Covers fight the grid.** The profile grid is now 3:4 (your screenshot shows it). Bottom-edge text like "1 Flame = 1 Question" is cropped or covered by the view counter, and many covers carry no hook at all.
5. **UAT pollutes your analytics.** The UAT and production sites load the same GA4 property (the tag labelled "prod"), so test traffic is mixed into real data. The site also has no meta description or OpenGraph tags, so links shared on WhatsApp or in DMs get a bare preview. That matters because DM shares are Instagram's strongest signal for reaching new people.

**What not to promise:** no view counts, follower targets or revenue figures. The plan is built to *learn* within 90 days which two formats reliably beat your own median, and to measure Reel → chat → purchase conversion before any paid spend.

---

## 2. Product and Instagram audit

### 2.1 What Jyotiq is, from the product itself [VERIFIED]

| Area | What I found | Source |
|---|---|---|
| Promise | "Ask any real question about your life and our smart prediction engine reads your actual birth chart… rooted in Vedic Jyotish, not daily sun-sign content." In-app: "Every response is synthesized using your exact birth chart." | Play listing; app onboarding text |
| Chat | Eight tabs: General, Love, Health, Wealth, Career, Travel, Education, Family. Each has a tagline (Love: "Relationships, partnerships, and marriage timing") and six starter questions, e.g. "Will an ex-partner return to my life, or should I move on?" | Your screenshots; app bundle |
| Most-asked prompts | Shubh muhurat for starting a business; career path by Kundali; Saturn transit and health; Moon+Mars in 7th house; financial gains this year; gemstone for my Mahadasha | App bundle (FAQ strings) |
| Kundali | Chandra Rashi, Lagna, Nakshatra; 16 divisional charts (D1–D60); Vimshottari dashas; live transits. Birth date, **birth time (required)**, country and city | App bundle |
| Languages (interface) | English, Hindi, Marathi, Punjabi, Bengali, Gujarati (plus Portuguese) | App bundle. **[CONFIRM]** whether answers come back in the chosen language |
| Access | Email/phone login, Google sign-in, **Continue as Guest** | Screenshot; bundle |
| Free trial | "1 Flame Credited! A free flame has been added…" on signup | Screenshot; bundle. **[CONFIRM]** whether guests get it |
| Deeper help | "Seek deeper guidance": consultations with astrologers, Vastu, Hawan & Pooja, Gemstones, Numerology, PLR, Tarot, linking to AstroRaaga, which also runs Karmeq ("Human Expertise Platform… verified Vedic Acharyas") | Bundle; AstroRaaga home screenshot |
| Payments | Razorpay in ₹, Stripe in $. Receipt code splits price ÷ 1.18, so prices look GST-inclusive | Bundle. **[CONFIRM]** before saying "GST included" |
| Disclaimer | Terms: "AI-generated astrological, tarot, and spiritual insights… for **entertainment and informational purposes only**… not professional financial, medical, legal, or psychological advice." | Bundle |
| Play Store | 100+ downloads, 5.0★ from 9 reviews, Lifestyle category, rated 3+, updated 4 Oct 2026. Description is two sentences with a typo ("ruled-based"). Support contact is one employee's personal email | [Play listing](https://play.google.com/store/apps/details?id=com.app.jyotiq), 13 Oct 2026 |

**Live prices (public packages endpoint, region = India, 13 Oct 2026) [VERIFIED]:**

| Pack | Price | Flames | Price per question | Copy shown | Issue |
|---|---|---|---|---|---|
| Unit | ₹5 | 1 | ₹5.00 | "1 AI consultation" | none |
| Starter | ₹95 | 20 | ₹95 ÷ 20 = ₹4.75 | "Perfect for trying out" | none |
| Popular | ₹248 | 50 + 10 bonus = 60 | ₹248 ÷ 60 = ₹4.13 | "10% bonus tokens" | 10 ÷ 50 = **20%**, not 10% |
| Enterprise | ₹995 | 200 + 25 bonus = 225 | ₹995 ÷ 225 = ₹4.42 | "20% bonus tokens", "API access", "for astrology professionals" | 25 ÷ 200 = **12.5%**. Worse value than Popular. Business pack on a consumer screen |
| All packs | | | | `validityDays: 365` | Contradicts "Purchased Flames never expire!" |

The usable headline price: **₹5 per question, ₹4.13–4.75 in packs.** That is impulse-level money. For context, Astrotalk's own pricing page says a typical session runs ₹500–1,500 ([Astrotalk pricing](https://astrotalk.com/pricing)).

### 2.2 Conversion friction found in the product

| Friction | Why it matters | Fix (recommendation) |
|---|---|---|
| Bio link opens Play Store (Android) | An extra install step. iPhone users dead-end | Link 1: production web chat (`jyotiq.astroraag.com/chat` with UTM tags). Links 2 and 3: Play and App Store [CONFIRM iOS is live] |
| "Align Your Coordinates… so the cosmic engines calculate your charts" plus a live-location request | Jargon, and a privacy flag before any value is delivered. Unclear why location is needed | Plain copy: "Location helps us use the right local time for your chart." Offer "type your city" first |
| Birth time required | Many users don't know theirs; they quit at the form | Content that explains how to find it (Concept 18). [CONFIRM] whether an approximate-time option exists |
| Flames jargon | "Flame" means nothing to a new user | Say "₹5 per question" first; explain "1 Flame = 1 question" second |
| Pack contradictions (above) | Risk of misleading ads; damages trust | Fix copy and validity before any pricing content goes out |
| Follow-up cost unclear | "Chat" suggests a conversation, but each question costs a Flame | [CONFIRM] whether follow-ups and clarifying messages cost a Flame, and say so before the user types |
| No OG/meta tags; UAT shares the prod GA4 property | Bare link previews in WhatsApp and DMs; analytics you can't trust | Add OG title, description and image; give UAT its own property or remove the tag |
| User-facing link to UAT | Your brief cites `jyotiq-site-uat…`. UAT isn't meant for the public | Use only the production URL in public links |

### 2.3 Profile audit (from your screenshot) [VERIFIED]

- **Name field:** "Jyotiq". Instagram search weighs the name and username, and this carries no keyword. Suggested: "Jyotiq • Kundli Chat" or "Jyotiq | Vedic Astrology Chat" (both under 30 characters).
- **Bio:** "AI-powered Vedic Astrology Guidance / Ask about Love | Career | Marriage | Finance / 🎁First Question FREE! / Get Instant… more". It's clear, but the last line is cut off, and nothing says what happens after the free question. The rewrite is in Section 10.
- **Highlights:** only "Feedback". There is nothing on how it works, pricing, privacy or real answers.
- **Category:** Product/service. That's fine; "App page" is an alternative.
- **Posting volume:** 109 posts, 88 of them Reels, since the 19 April 2026 launch, which works out to roughly 3.4 Reels a week. Volume isn't the problem; format and consistency are.
- **Followers:** 208. Trial Reels need 200+ followers on a professional account ([creatorflow, citing Instagram Help, Sep 2026](https://creatorflow.so/blog/instagram-trial-reels/)), so **you have just become eligible**. Broadcast channels and Live need 1,000 ([Newsweek, Mar 2026](https://www.newsweek.com/instagram-makes-a-major-change-users-have-been-waiting-for-11603501)).

### 2.4 What the 88 Reel covers show

**Numbers [VERIFIED from the grid].** 81 of the 88 view counts were legible.

- Median 125 views. Middle half: 59–168.
- The six biggest Reels (10,000; 5,139; 2,308; 1,746; 1,518; 1,012) hold 21,723 of 30,694 visible views, or **71%**.
- By recency:
  - Newest 18 Reels: median about 62 views.
  - Next 24: 132.
  - Oldest 39 (legible ones): 141.

**By content cluster** (my classification from covers; small samples, so treat as directional):

| Cluster | n (legible) | Median views | Notes |
|---|---|---|---|
| Launch countdown (3-2-1, launch offer) | 5 | 316 | Launch-week audience of friends and network. Not repeatable |
| Festival / devotional art | 13 | 141 | Steady but flat. One heritage outlier (1,518) |
| Cartoon / 3D meme posters | 10 of 14 | 123 | Good insights (shaadi pressure, "premium confusion", red flag/green flag) packed into dense posters |
| Photoreal "relatable scene" | 25 | 101 | Lowest floor, highest ceiling. Holds 3 of the top 4 (10k, 5,139, 2,308) and 487 |
| ↳ scene **with** an inner-question/quote on the cover | 10 | 144 | e.g. "confused kaha se start kare?", "financial struggles…", "We need to talk 😬" |
| ↳ scene **without** text | 15 | 92 | Mostly the newest Reels |
| Product / price / brand posters | 19 of 22 | 95 | "Download", "1 Flame = 1 Question @ ₹5", logo, "Ask. Chat. Discover." (24 views) |
| Cosmic visuals and "not an ordinary AI" claims | 9 | 42 | "This is NOT random AI astrology App" (42), "यह कोई सामान्य AI ज्योतिष ऐप नहीं है" (19), "Think again" (30) |

**Patterns:**

- **Inner-monologue questions win.** The hits use first-person or "you" questions that mirror what the viewer is already thinking. That matches the product exactly, because the user types a question. [HYPOTHESIS, strong]
- **Claims and badges lose.** Telling people Jyotiq is "not ordinary" or showing "Download" and price badges performs worst. Viewers scroll past ads. [HYPOTHESIS, strong]
- **Text-less covers underperform.** Text-less covers have a median of 92, against 144 for covers with an inner question. Covers need a hook, placed in the middle third so the 3:4 grid crop and the view counter don't hide it.
- **No visual system.** I count at least six unrelated styles (photoreal AI people, Pixar-style 3D, devotional paintings, neon logo, gold-on-purple posters, Devanagari banners), so the grid builds no recognition. The web app has a clear identity (midnight black, diya gold, Playfair Display and Plus Jakarta Sans fonts [VERIFIED in the site's HTML]) that the feed doesn't use.
- **The real product barely appears.** Several phone screens look like mock-ups, not the real interface. One shows "Daily Horoscope… Good things are coming your way today", which contradicts the Play promise of "not daily sun-sign content" [CONFIRM whether this screen exists in the Android app].
- **Outliers need checking.** Check whether the 10k, 1,746 (logo) and 1,518 (sage) Reels were boosted [CONFIRM in Insights → Ads]. Paid views distort every comparison.
- **Two compliance flags:**
  - "Client Testimonials" (99 views): if any faces, voices or quotes are not real, consenting customers, take it down (CCPA endorsement rules; ASCI).
  - "Instagram Guru vs JYOTIQ AI Astrology: who will you trust?" frames human gurus as untrustworthy. That alienates an audience that trusts astrologers, and it clashes with AstroRaaga's own Acharya platform.

### 2.5 Reel-by-Reel cover audit

Order matches the grid: #1 is the newest, top-left, reading left to right. Views are as shown publicly; "?" means illegible. Verdicts: **Repeat** (do more of this), **Remake** (keep the idea, change the execution), **Reduce** (keep only with a new angle), **Stop**.

| # | Cover (scene / text) | Lang | Views | Cluster | Likely goal | Verdict and why |
|---|---|---|---|---|---|---|
| 1 | Navratri kalash — "Navratri begins" | EN | 105 | Festival | Reach | Reduce. Greeting cards are commodity content; use festival utility instead |
| 2 | Woman at laptop, red ✗ — "1. Job change" | EN | 28 | Scene | Engagement | Remake. List number with no stakes; lead with the inner question |
| 3 | Woman to camera holding Jyotiq phone — "4 steps to personal astrology" | EN | 64 | Scene (talking head) | Education | Remake with a real person and real UI |
| 4 | Woman on phone at night — "'We need to talk.' 😬" | EN | 209 | Scene + quote | Reach | Repeat the relationship-anxiety quote hook |
| 5 | Phone: "Daily Horoscope… Good things are coming" | EN | 91 | Product | Product | Stop. A generic horoscope contradicts the promise |
| 6 | Woman at laptop — "When is the right time for a career change?" | EN | 33 | Scene + question | Product | Remake. Brand-voice question; make it first-person and specific |
| 7 | Woman in bed, phone showing app | — | 19 | Scene | — | Stop. No hook |
| 8 | Stressed woman, city window | — | 166 | Scene | Reach | Remake with an inner-question overlay |
| 9 | Woman in bed smiling at phone | — | 112 | Scene | Reach | Remake |
| 10 | Split face ✗/✓, zodiac wheel — "MYTH vs FACT" | EN | 37 | Scene/education | Engagement | Remake. Name the actual myth ("Manglik = problem?") |
| 11 | Hand holding phone, Jyotiq splash | — | 30 | Product | Brand | Stop |
| 12 | Woman by window at night | — | 101 | Scene | Reach | Remake as a "2 AM Thoughts" episode |
| 13 | Three friends shocked at a phone | — | 62 | Scene | Reach | Remake as a "friends react to the answer" skit |
| 14 | Man with phone, floating icons | — | 61 | Scene | — | Remake |
| 15 | Couple with Ganesha idol | — | 20 | Festival | Reach | Stop |
| 16 | Man in crowd at sunset | — | 92 | Scene | — | Remake |
| 17 | Man close-up, serious | — | 37 | Scene | — | Stop |
| 18 | Woman in kurta, hand raised, to camera | — | 48 | Scene (talking head) | Education | Remake with a real creator |
| 19 | Krishna, moon over water | — | 168 | Devotional | Reach | Reduce. Only with a meaning or explainer angle |
| 20 | Kids — "Happy Raksha Bandhan" | EN | 62 | Festival | Reach | Stop |
| 21 | Stars/chart — "What if your birth chart already knows your next move?" + Download | EN | 59 | Cosmic/claim | Product | Remake. Good question, but the Download badge kills it |
| 22 | Figure facing glowing grid | — | 19 | Cosmic | — | Stop |
| 23 | 3D office — "Monday: I love my job" | EN | 117 | Meme | Reach | Remake as live action |
| 24 | Saturn in space | — | 1,012 | Cosmic | Reach | Check whether boosted; remake as a calm "Shani gochar" explainer |
| 25 | Cartoon woman, sticky notes | — | 36 | Meme | — | Stop |
| 26 | Neon brain + diya logo | — | 36 | Product | Brand | Stop |
| 27 | Cartoon — "Monday Motivation? Ya Monday Depression?" | Hinglish | 33 | Meme | Reach | Stop (repeats #48) |
| 28 | Shiva with trishul, temple | — | 133 | Devotional | Reach | Reduce |
| 29 | Venus/Lakshmi — "Friday is ruled by Venus… Download JYOTIQ" | EN | 127 | Festival/education | Product | Remake as "Jyotish in 30s: weekdays and planets", no badge |
| 30 | Woman thinking — "Confused about life's next step?… First Chat FREE… Download" | EN | 126 | Poster | Product | Remake. Keep the question; the offer belongs on the end card |
| 31 | "Is Sawan, dil ki uljhan suljhaiye… first chat FREE" | Hinglish | 141 | Festival poster | Product | Reduce |
| 32 | Man in dark room on phone | — | 132 | Scene | Reach | Repeat as "2 AM Thoughts" with hook text |
| 33 | Woman in saree — "First Chat FREE!" | EN | 132 | Poster | Product | Remake. An offer is a weak hook |
| 34 | Two teenage boys | — | 39 | Scene | — | Stop. Under-18 look doesn't match the 18+ audience |
| 35 | Smiling man in kurta and shawl with a book | — | 136 | Scene | Trust | Remake as a real "Acharya" format (Script 10) |
| 36 | Sage in mountains — "Guru mil jaaye…" | Hinglish | 173 | Devotional | Reach | Remake. The longing for a guide is a usable hook |
| 37 | Two 3D kids + "JyotiQ" | — | 249 | Meme/mascot | Brand | Test the mascot in Stories |
| 38 | "Ask. Chat. Discover." + Download | EN | 24 | Poster | Product | Stop |
| 39 | Vishnu on Sheshnag | — | 174 | Devotional | Reach | Reduce |
| 40 | "Gupt Navratri… First Chat FREE" | EN | 136 | Festival poster | Product | Reduce |
| 41 | "Seek Lord Ganesha's blessings this Wednesday… Download" | EN | 180 | Devotional poster | Product | Reduce |
| 42 | "Every win starts with a plan — Them vs You" (football) | EN | 134 | Topical | Reach | Stop. Off-brand |
| 43 | Woman with phone — "First Chat F[REE]" | EN | 143 | Poster | Product | Remake |
| 44 | Woman with bubbles — "अब हर सवाल का जवाब, सिर्फ एक चैट में" | Hindi | 191 | Poster | Product | Remake with real UI; keep Hindi as a tested language |
| 45 | Jagannath — "रथ यात्रा…" | Hindi | 187 | Festival | Reach | Reduce |
| 46 | Cartoon — "'Shaadi kar lo.' 'Ignore kar lo.'… Bas ek sensible ANSWER chahiye tha… JYOTIQ se pucho" | Hinglish | ? | Meme poster | Product | Remake as live action. Strong insight: everyone advises, nobody answers |
| 47 | "Red flag ko green flag samajhne ki Olympic chal rahi hai kya?" | Hinglish | ? | Meme | Reach | Remake as live action (Concept 14) |
| 48 | Infographic — "Monday Motivation? Ya Monday Depression?… Career confusion is real" | Hinglish | ? | Meme poster | Product | Stop (duplicate) |
| 49 | "Instagram Guru vs JYOTIQ AI Astrology — who will you trust with your future" | EN | ~129 | Comparative | Reach | Stop. Anti-guru framing |
| 50 | "2 AM thoughts ka solution ab sirf 1 sawaal mein" | Hinglish | 87 | Meme | Product | Repeat as a series (Script 5) |
| 51 | Neon logo — "Download JYOTIQ — Google Play" | EN | 88 | Product | Install | Stop |
| 52 | Businessman — "Sales down. Stress up. 'Business grow kab hoga?' JYOTIQ se pucho" | Hinglish | 150 | Meme poster | Product | Remake for the business segment (Concept 19) |
| 53 | Cartoon brain — "Main hoon JYOTIQ… aaj ek aur confusion door karte hain!" | Hinglish | 112 | Mascot | Brand | Test the mascot in Stories |
| 54 | "Client Testimonials" | EN | 99 | Testimonial | Trust | [CONFIRM] it is real and consented, or take it down |
| 55 | Cartoon — "'I like you' / 'not ready for commitment'… PREMIUM CONFUSION" | EN/Hinglish | 150 | Meme poster | Reach | Remake as live action. Situationships are top-tier relatable |
| 56 | Parents + son — "Indian parents: Shaadi kab karoge? Me: Abhi JYOTIQ se puch leta hu" | Hinglish | ? | Meme | Reach | Remake as live action (Concept 13). Highest-potential idea on the grid |
| 57 | Man, neon street — "Still taking important decisions blindly?" | EN | 164 | Scene + question | Reach | Repeat the question hook |
| 58 | Woman at office window with a man | — | 10k | Scene | ? | Check whether boosted and pull its caption and audio. If organic, reverse-engineer it |
| 59 | Woman with phone — "Sab kuch try kar liya… ab ek baar JYOTIQ se puch lo — 1 Flame = 1 Question @ Rs 5" | Hinglish | 64 | Price poster | Product | Stop the poster. The "Sab kuch try kar liya" hook is worth a test |
| 60 | Hand with chat UI — "And get astrology-based answers instantly" | EN | 126 | Product | Product | Remake as a real screen recording |
| 61 | "वेदों का ज्ञान, AI की शक्ति — JYOTIQ… ₹5" | Hindi | ? | Claim poster | Brand | Stop |
| 62 | Neon brain + diya logo | — | 1,746 | Product | Brand | Check whether boosted |
| 63 | "वैदिक ज्योतिष… 1 फ्लेम = 1 प्रश्न @ Rs 5" | Hindi | ? | Price poster | Product | Stop |
| 64 | Woman in bed smiling — "'JYOTIQ' download kiya kya…" | Hinglish | 145 | Scene + quote | Reach | Remake as a real friend-to-friend skit |
| 65 | Sage — "वैदिक ज्योतिष का मार्गदर्शन, अब हर पल आपके साथ… ₹5" | Hindi | 170 | Poster | Brand | Reduce |
| 66 | Woman on bed with phone — "Astrology guidance chahiye… but confused kaha se start kare?" | Hinglish | 5,139 | Scene + question | Reach | **Repeat and remake.** Best identifiable hook (Concept 11) |
| 67 | Cosmic phone — "Vedic insights. One intelligent app." | EN | ~141 | Claim | Brand | Stop |
| 68 | Sage at temple — "For centuries, Vedic Astrology has guided human lives" | EN | 1,518 | Heritage | Reach | Check whether boosted; remake as a heritage explainer with a real presenter |
| 69 | Sage + AI head — "Vedic astrology. The speed of AI." | EN | ~140 | Claim | Brand | Stop |
| 70 | "वैदिक ज्योतिष सिर्फ भविष्यवाणी नहीं, जीवन का मार्गदर्शन" | Hindi | 92 | Claim poster | Brand | Stop the poster; the line itself is good positioning |
| 71 | Phone with app UI on dark | — | 95 | Product | Product | Remake as real UI with a question |
| 72 | "Every answer rooted in Vedic wisdom… Link in bio" | EN | 108 | Claim poster | Product | Stop |
| 73 | Woman praying at home altar | — | 25 | Scene | — | Stop |
| 74 | Hologram brain — "यह कोई सामान्य AI ज्योतिष ऐप नहीं है" | Hindi | 19 | Claim | Brand | Stop |
| 75 | Sage + AI — "जहां ज्योतिष के वैदिक सिद्धांत…" | Hindi | 38 | Claim | Brand | Stop |
| 76 | Man in cosmic grid — "This is NOT random AI astrology App" | EN | 42 | Claim | Brand | Stop |
| 77 | Infographic — "Why you should use Jyotiq" | EN | ? | Product | Product | Stop as a Reel; move to a Highlight or carousel |
| 78 | Man at desk with tea — "Wondering when your financial struggles will finally end?" | EN | 2,308 | Scene + question | Reach | **Repeat and remake** (Concept 12) |
| 79 | Cosmic phone — "Think Jyotiq is just another basic AI chatbot? Think again." | EN | 30 | Claim | Brand | Stop |
| 80 | "We are here for you" feature list | EN | 45 | Poster | Brand | Stop |
| 81 | Two women, one consoling the other | — | 487 | Scene | Reach | Repeat the friendship/support emotion, with a hook line |
| 82 | Handshake — "We are here for you. Just ask." | EN | 60 | Poster | Brand | Stop |
| 83 | Flame in the dark — "1 Flame = 1 Question" | EN | 125 | Price | Product | Remake as a pricing explainer (Script 7) |
| 84 | "Full insights coming today — 19 April" | EN | 353 | Launch | Launch | n/a |
| 85 | "Jyotiq launching — 1 day left" | EN | 316 | Launch | Launch | n/a |
| 86 | "Launch offer… Get 1 flame free… ask one question for free" | EN | 402 | Launch | Launch | n/a |
| 87 | "2 days to go!" | EN | 286 | Launch | Launch | n/a |
| 88 | "3 day to go!" (typo) | EN | 281 | Launch | Launch | n/a |

**What this audit can't tell you, and how to get it.** For the 15 most recent Reels and the 6 outliers, export from Insights:

- views and reach
- % non-follower reach
- skip rate (the share of viewers who swipe away in the first 3 seconds; in Reels Insights since Aug 2025, per [Sprout Social](https://support.sproutsocial.com/hc/en-us/articles/44454470746253-New-Instagram-and-Facebook-Reels-metrics))
- average watch time
- shares (sends), saves, comments, follows
- profile visits and external link taps
- whether the Reel was boosted

Add one column for the first 3 seconds (what's on screen and what's said) and one for audio (trending, original or voiceover). Twenty minutes of this turns my cover-level hypotheses into evidence.

### 2.6 Biggest gaps and missed opportunities

1. **No recurring series.** Nothing a viewer can recognise and come back for. Eighty-eight one-offs build no habit.
2. **The answer is never shown.** The product's best proof, a specific answer from your own chart, is invisible. Competitors with far bigger budgets can't copy *your* answers.
3. **No human face of the brand.** No founder, team member, astrologer or real user. In his 2025 year-end note, Instagram's head said AI has killed the polished aesthetic and that authenticity and provenance will matter more as feeds fill with synthetic media ([Business Insider, Jan 2026](https://www.businessinsider.com/instagram-head-ai-images-polished-feed-dead-adam-mosseri-2026-1)).
4. **The #1 demand isn't owned.** Marriage timing ("shaadi kab hogi?") is the single biggest astrology question in India, and there is no "Shaadi Kab?" franchise yet.
5. **No education for search.** Since 10 Jul 2025 public posts from professional accounts can appear in Google results ([Forbes](https://www.forbes.com/sites/chelseatobin/2025/07/10/what-google-indexing-instagram-means-for-your-business-visibility/)), and explainers like "Sade Sati kya hai" or "Manglik dosha" are searched constantly. You have none.
6. **No conversation loop.** No question stickers, no comment-to-episode loop, no replies to comments with Reels.
7. **The human hybrid is unused.** AstroRaaga's verified Acharyas could vouch for Jyotiq: "AI for the quick question, an Acharya for the big one." That's a hybrid that pure AI apps can't offer. Right now the feed attacks "Instagram gurus" instead.
8. **Price clarity sits on the cover instead of in the journey.** "₹5" appears on dozens of covers, but no Reel actually explains what you get for it.

---

## 3. Competitor and successful-brand research

### 3.1 Market context: the category is booming and crowded

- **Demand is growing fast.**
  - Astrology-app downloads in India: 15 crore in Jan–Sep 2026, up 75% year on year. Religious and spiritual apps added another 14.6 crore, up 47%. Source: Sensor Tower via [Economic Times, 10 Oct 2026](https://economictimes.indiatimes.com/news/india/indias-app-economy-goes-spiritual-religious-and-astrology-apps-clock-nearly-30-crore-downloads-in-nine-months/articleshow/134852101.cms) [REPORTED].
  - Monthly active users across religion, spirituality and astrology apps: about 80 million in 2026, twice the 2023 level ([New Indian Express, 29 Sep 2026](https://www.newindianexpress.com/business/2026/Sep/29/divine-intervention-astrology-platforms-draw-big-money), citing Sensor Tower) [REPORTED].
  - Average daily time in astrology apps: 3.5 minutes in Q1 2022, 5.3 minutes in Q1 2026 ([Times of India, Oct 2026](https://timesofindia.indiatimes.com/business/india-business/religious-spiritual-astrology-apps-see-nearly-30cr-downloads-in-jan-sept/articleshow/134842601.cms)) [REPORTED].
- **The money is with human-astrologer marketplaces**, all per NIE above [REPORTED]:

  | Company | Revenue | Notes |
  |---|---|---|
  | Astrotalk | ₹1,176 cr operating revenue, FY25 | Profit before tax ₹285 cr; unicorn in Aug 2026 |
  | InstaAstro | ₹111 cr, FY26 | |
  | Astroyogi | ₹96.3 cr, FY25 | |
  | AstroSage | ₹84 cr, FY25 | |

  Market-size figures vary widely. An investor-cited Redseer estimate puts Indian astrology at $12.5B (NIE). A vendor estimate puts the *app* market at $163M in 2024, rising to $1.8B by 2030 ([MarkNtel](https://www.marknteladvisors.com/press-release/india-astrology-app-market-growth)) [ESTIMATE].
- **Who asks, and about what.**
  - On iMeUsWe's platform, women are 60.3% of astrology users, 63% of those women are 18–30, and 25–30 is the largest group. Their queries break down as: marriage timing and compatibility 42%, love 28%, career 14%, children 7%, in-laws 5%, money and property 4% ([Storyboard18, 11 Mar 2026](https://www.storyboard18.com/digital/young-indian-women-lead-digital-astrology-platforms-for-guidance-ws-l-91803.htm)). That is one platform, not the market [REPORTED].
  - Astrotalk (12M+ consultations, Apr 2025–Mar 2026): relationships and marriage about 25% of Indian queries, mainly *when*, *with whom* and *how*; career and business about 18% ([Storyboard18, 21 Mar 2026](https://www.storyboard18.com/brand-marketing/marriages-in-india-breakups-in-new-york-astrotalk-astrology-data-shows-cultural-divide-92808.htm)) [REPORTED].
- **AI entrants are arriving with money and distribution.**
  - Reva: its Play package name (`in.mohalla.reva`) points to ShareChat's parent, Mohalla Tech [not independently confirmed].
  - Zupee's Neo Astro and Balaji Telefilms' AstroVani, both Nov 2025 ([Storyboard18](https://www.storyboard18.com/gaming-news/zupee-enters-into-astrology-via-neo-astro-app-84564.htm), [Storyboard18](https://www.storyboard18.com/digital/balaji-telefilms-enters-astrology-space-with-launch-of-astrovani-app-83919.htm)).
  - Melooha, AstroSage AI, Vaya, AstroSure AI and HiAstro ([Mint, Feb 2026](https://www.livemint.com/companies/start-ups/india-ai-astrology-startups-disrupting-faith-tech-market-investment-11772173403034.html)).
  - The Play listing for "Astro AI" promises an answer "from your own janam kundli, not a generic sun sign prediction" in 11 languages, with voice calls ([Play](https://play.google.com/store/apps/details?id=com.astroaiapp)). That's almost word for word Jyotiq's own Play promise. **"AI that reads your real chart" is now table stakes, not a differentiator.**
- **General AI is free.** OpenAI made ChatGPT Go free for 12 months for Indian users who signed up from 4 Nov 2025 ([Mashable India](https://in.mashable.com/tech/101975/chatgpt-go-is-now-free-in-india-for-a-year-what-you-get-how-to-get-it-today)).

**Implication:** Jyotiq can't outspend Astrotalk, out-distribute ShareChat or under-price ChatGPT. It can be the most *specific*, *transparent* and *trustworthy* voice in the feed, and show its answers in public where competitors show ads.

### 3.2 Brand-by-brand

Evidence strength: **Strong** means company financials or reputable press. **Medium** means company self-claims or a single study. **Weak** means third-party blogs or anecdote.

#### 1. Astrotalk: the human-astrologer marketplace leader (direct)
- **Model:** paid per-minute chat and call with 20,000+ astrologers ([Storyboard18](https://www.storyboard18.com/brand-marketing/marriages-in-india-breakups-in-new-york-astrotalk-astrology-data-shows-cultural-divide-92808.htm)). First chat or call free for new users ([Astrotalk](https://astrotalk.com/astrology-blog/is-astrotalk-free-a-complete-guide/)). Its e-commerce store (rudraksha, crystals, gemstones) made over ₹140 cr in 2025 (NIE). Strong.
- **Marketing mechanisms:**
  - **Bought growth.** Marketing spend rose from ₹75 cr in FY23 to ₹163 cr in FY24 ([Mint, 8 Jan 2025](https://www.livemint.com/companies/astrotalk-astrologers-funding-marketing-spending-digital-age-astrosage-astroyogi-astrology-consultations-google-play-11736335144276.html)). Strong.
  - **A free trial with a meter.** Mint's reporter got a 2-minute free chat that ended with "Please recharge once, so I can help you". Astrologers described pressure to stretch chats (same article). Strong.
  - **Dilemma storytelling.** A Nitesh Tiwari-directed campaign framed astrology around everyday relationship and career dilemmas, as emotional wellness ([ETBrandEquity, Mar 2026](https://brandequity.economictimes.indiatimes.com/news/research/advertising/astrotalk-brings-everyday-dilemmas-to-life-in-new-ad-campaign/129899380)). Strong.
  - **Self-aware humour.** A billboard roasting its own ad frequency ([media4growth, Oct 2026](https://www.media4growth.com/showcase/campaigns/astrotalk-turns-its-most-common-roast-into-an-ooh-campaign-86820)). Medium.
  - **Data PR.** Aggregated consultation insights ("marriages in India, breakups in New York") earn press coverage. Strong.
- **Learn:** dilemma storytelling, data-led PR, self-aware humour.
- **Avoid:** timers, "recharge" pressure, remedy upsells and ad saturation. Jyotiq's per-question price is a direct counter-position: **no meter running.**

#### 2. InstaAstro: the fast-growing challenger (direct)
- **Model:** consultations plus Pooja Seva and spiritual commerce. Revenue grew from ₹52 cr (FY25) to ₹111 cr (FY26). It raised $12M in Aug 2026 for "AI-led product development, multilingual support, Pooja Seva and spiritual commerce", and international markets are about 25% of revenue (NIE; [Inc42](https://inc42.com/buzz/instaastro-bags-12-mn-to-build-ai-tools-expand-online-pooja-services/)). Strong.
- **Learn:** multilingual support is where challengers are investing, and Jyotiq's interface already supports six Indian languages.
- **Avoid:** breadth for its own sake. Stay the clearest "one question, one answer" product.

#### 3. Astroyogi: bootstrapped and going vernacular (direct)
- **Model:** a consultation marketplace with 5,000+ astrologers ([App Store](https://apps.apple.com/np/app/astroyogi-chat-with-astrologer/id1475620580)). Revenue ₹85 cr in FY24 ([Entrackr, Feb 2025](https://entrackr.com/fintrackr/astroyogi-surpasses-rs-85-cr-revenue-in-fy24-with-sound-economics-8696005)) and ₹96.3 cr in FY25 (Tracxn via NIE). It targets younger users with personalised vernacular content beyond the metros (ETRetail, Aug 2025). Medium.
- **Learn:** vernacular content and tier-2/3 India are where growth is.
- **Avoid:** spreading into retail before product-market fit.

#### 4. AstroSage: free tools as the front door (direct)
- **Model:** free Kundli, horoscope and panchang tools, then paid astrologers and an AI astrologer. Revenue ₹84 cr in FY25, up 40% (NIE). It claims 1.2M daily users ([AstroSage](https://astrosage.com/about-us.asp); self-claimed, Medium). Sensor Tower names AstroSage Kundli among the fast-growing AI astrology platforms of 2026 (ET).
- **Learn:** a free utility earns search traffic and repeat visits. Jyotiq's Kundali (Chandra Rashi, Lagna, Nakshatra, dashas) can be the free hook: "Find your Chandra Rashi in 60 seconds." [CONFIRM it's free]
- **Avoid:** daily sun-sign horoscopes, which contradict Jyotiq's own promise.

#### 5. Sri Mandir (AppsForBharat): the devotional calendar (adjacent)
- **Model:** online pujas and offerings at 70+ temples, plus devotional content. 40M+ downloads, and 1.2M users did 5.2M pujas in a year ([Entrackr, Jun 2025](https://entrackr.com/news/appsforbharat-raises-20-mn-in-series-c-round-9451578)). About 3.5M monthly users ([TechCrunch, 30 Jun 2025](https://techcrunch.com/2025/06/30/sri-mandir-keeps-investors-hooked-as-digital-devotion-grows/)). Strong.
- **Mechanism:** the ritual calendar gives users a built-in reason to come back, and each moment is tied to something to *do*.
- **Learn:** festivals work when they carry utility ("what to do, when, why"). Jyotiq's festival greeting cards plateau around a 141 median.
- **Avoid:** generic AI deity art. It's everywhere and doesn't build brand.

#### 6. AI-native astrology entrants: Reva, Astro AI, Om.AI, Melooha, Neo Astro, AstroVani (direct)
- **Model:** AI chat on top of a computed kundli, often free or freemium. Some offer voice calls (Astro AI) and many languages.
- **Mechanism:** distribution from the parent company (ShareChat, Zupee, Balaji). Product claims converge on "your real chart, not your sun sign". Medium.
- **Learn:** you won't win on the claim. Win on four things:
  - the price story (per question, no meter);
  - visible answer quality;
  - human backing (AstroRaaga's Acharyas);
  - a recognisable personality.
- **Avoid:** "most accurate AI" claim wars.

#### 7. Co-Star: product output as content (global)
- **Model:** AI-written personalised horoscopes and social birth charts. About 4.3M monthly users; acquired by Midjourney ([TechCrunch, 24 Jul 2026](https://techcrunch.com/2026/07/24/midjourney-acquired-the-astrology-app-co-star/)). Strong.
- **Mechanism:** blunt, oddly specific push notifications that users screenshot and post as memes ([Daily Dot, 2021](https://dailydot.com/co-star-astrology-app-push-notifications-memes); [The Verge, 2019](https://www.theverge.com/2019/10/4/20879631/co-star-astrology-app-zodiac-signs)). The product's voice *became* its distribution. Strong.
- **Learn:** make answers screenshot-worthy. For example:
  - a recurring "Jyotiq ne kaha…" one-liner format on Instagram;
  - a short one-line summary at the end of each answer that users want to share [product suggestion, not a current feature].
- **Avoid:** Co-Star's cold, sometimes harsh tone. People asking about marriage and money in India need warmth.

#### 8. CHANI: education plus community, paid for (global)
- **Model:** subscription at $11.99/month or $107.99/year ([CHANI help](https://chaninicholas.zendesk.com/hc/en-us/articles/1500001732281-App-Pricing)). About 2M downloads ([Inc., Nov 2025](https://www.inc.com/gabrielle-bienasz/how-this-company-uses-astrology-to-make-business-decisions/91254002)). Profitable soon after launch, with about 250k average active users ([Inc., Aug 2024](https://www.inc.com/gabrielle-bienasz/how-can-chani-afford-to-give-its-employees-7-weeks-of-paid-vacation.html)). Medium.
- **Mechanism:** a consistent teaching voice plus an owned channel. Its email programme treats a 50% open rate as the bar ([Mailchimp case study](https://mailchimp.com/case-studies/chani-email-marketing-customer-loyalty/)).
- **Learn:** teaching builds the trust people pay for. Pair Instagram with a channel you own (a WhatsApp channel or email) for repeat visits.
- **Avoid:** importing a US brand voice wholesale.

#### 9. Nebula (OBRIO): the paid machine, and claims to avoid (global)
- **Model:** advisor marketplace plus horoscopes. 30M users and $50M ARR in 2023 ([tech.eu, Dec 2023](https://tech.eu/2023/12/05/obrio/)). Medium.
- **What not to copy:** its App Store copy claims "93.4% prediction accuracy, as rated by real users" and says its advisors "have the solution" ([App Store](https://apps.apple.com/au/app/nebula-horoscope-astrology/id1459969523)).
  - Accuracy percentages and promised solutions are high-risk under India's CCPA 2022 guidelines and the ASCI code.
  - They also contradict Jyotiq's own Terms ("entertainment and informational purposes only").

#### 10. The Pattern: genuine reaction as virality (global)
- **Mechanism:** Channing Tatum's 2019 reaction video ("How do you know what you know about me, Pattern?") spread widely ([The Times](https://www.thetimes.com/business-money/technology/article/why-the-pattern-astrology-app-founder-lisa-donovan-is-the-millennial-mystic-meg-chdsx3jw9)). "Bonds" let people compare charts with others ([W Magazine](https://www.wmagazine.com/culture/the-pattern-founder-lisa-donovan-connect-dating-app-summer-romance-astrology-reading)). Medium.
- **Learn:**
  - Real people reacting to their *own* reading is shareable (Concept 27, with consent).
  - Compatibility content pulls in a second person.
- **Avoid:** "scarily accurate" claims and staged reactions.

#### 11. Cal AI: a creator system plus relentless testing (consumer AI)
- **Model:** an AI calorie-tracking app. About $40M revenue in 12 months, then acquired by MyFitnessPal in Mar 2026 ([Inc., Mar 2026](https://www.inc.com/ben-sherry/he-built-an-ai-app-in-high-school-made-40m-and-sold-to-myfitnesspal-now-hes-aiming-even-bigger/91307748)). Strong.
- **Mechanism:**
  - A large network of short-form creators, reportedly on retainers ([third-party report](https://onghost.com/reports/calai); Weak).
  - Systematic conversion testing: 123 paywall experiments ([Superwall case study](https://superwall.com/case-studies/cal-ai); Medium).
- **Learn:**
  - Give creators repeatable briefs and put the winners on retainer.
  - Run the whole Reel → chat → purchase path as an experiment programme.
- **Avoid:** US-scale volume, and creator content that isn't disclosed (ASCI).

#### 12. ChatGPT and general AI: the substitute
- **Evidence:** the free ChatGPT Go offer above. There's also an anecdote of an Indian user asking ChatGPT to predict their marriage from a palm photo ([Garimella, 2026](https://kirangarimella.substack.com/p/the-local-lives-of-a-global-chatbot)). Weak for prevalence, but the behaviour is plausible.
- **Learn:** "Ask an AI" costs nothing, so show on screen what a general chatbot doesn't do by default:
  - compute the actual chart (Lagna, dashas, transits);
  - answer within Jyotish frameworks, in Indian family context.
- **Avoid:** attacking ChatGPT. Show, don't claim.

#### 13. India's big astrology creators: format benchmark, brand-safety warning
- **Data:** Modash's list of top Indian astrology accounts (Sep 2026) shows:
  - 105k–368k followers, with an estimated 17–27% fake followers;
  - content heavy on totke and remedies, plus WhatsApp-consultation funnels.
- **Formats with big play counts:**
  - a rashi-wise "this year will be good for these three rashis" Reel: 306.5k plays;
  - a ritual-meaning explainer on why the Arundhati nakshatra is shown at weddings: 245k plays.
- Source: [Modash](https://www.modash.io/find-influencers/india/astrology). Third-party estimates, not verified on-platform; Weak to Medium.
- **Learn:** rashi-wise "send to your friend" lists and ritual-meaning explainers have proven pull.
- **Avoid:** fear-and-remedy tone and inflated audiences. Vet every creator (Section 9.6).

### 3.3 Fifteen-minute competitor check (do this yourselves; I couldn't)

For Astrotalk, InstaAstro, AstroSage, Sri Mandir and two AI entrants, open their official Instagram Reels tab and log their **last 12 Reels**:

- the text and first frame in the first 2 seconds;
- format (skit, talking head, screen recording, meme, devotional);
- whether the person on screen is real or AI;
- language;
- CTA;
- views.

Also note their pinned Reels and where their bio link goes. That turns Section 3.2's press-based mechanisms into a feed-level picture.

### 3.4 Mechanisms worth borrowing, and how Jyotiq adapts them

| Mechanism | Who shows it | Evidence | Jyotiq adaptation | Effort |
|---|---|---|---|---|
| Everyday-dilemma storytelling | Astrotalk (Tiwari campaign) | Strong | "Shaadi Kab?" and POV skits in Hinglish | Low |
| Product output as shareable content | Co-Star | Strong | Real answers on screen; a "Jyotiq ne kaha…" one-liner format | Low |
| Free utility as the front door | AstroSage, Sri Mandir | Medium | Free Kundali / Chandra Rashi hook, plus calm explainers | Low–Med |
| Teaching builds trust | CHANI | Medium | "Jyotish in 30 Seconds" series | Low |
| Genuine personal reaction | The Pattern | Medium | Consented reactions from real users | Med |
| Creator system plus disciplined testing | Cal AI | Medium | 3-creator pilot, retainers for winners, a testing programme | Med |
| Data PR | Astrotalk | Strong | Monthly anonymised "what India asked Jyotiq" | Med (needs data and a privacy review) |
| Free first question → paid | Category-wide | Strong | Keep it, but lead with transparency: no timer, ₹5 a question | Low |

**Not to borrow:** accuracy claims (Nebula), fear and remedy selling (category creators), timer pressure (Astrotalk, per Mint), anti-guru framing (your own #49), and staged testimonials.

---

## 4. What's working on Instagram right now, and what fits Jyotiq

### 4.1 Platform mechanics that matter for a 208-follower account

| Mechanic | What's known | Source | What it means for Jyotiq |
|---|---|---|---|
| Ranking signals | Instagram's head named watch time, likes per reach and **sends per reach** (DM shares) as the key signals (Jan 2025). Sends matter most for reaching non-followers | Secondary summaries, e.g. [eclincher, 2026](https://www.eclincher.com/articles/how-the-instagram-algorithm-works-in-2026) [REPORTED] | Build content people forward ("send this to your Tula friend", "this is literally my mom") |
| Skip rate | Reels Insights show the % of viewers who skip within 3 seconds (since Aug 2025) | [Sprout Social support](https://support.sproutsocial.com/hc/en-us/articles/44454470746253-New-Instagram-and-Facebook-Reels-metrics) | Your hook metric. The first frame and first line decide everything |
| Trial Reels | Shown only to non-followers, for up to 72 hours. Professional accounts need 200+ followers | [creatorflow, Sep 2026](https://creatorflow.so/blog/instagram-trial-reels/) [REPORTED] | You're eligible at 208. Use them to A/B test hooks without cluttering the grid |
| Hashtags | Capped at 5 per post since Dec 2025. They categorise; they don't boost reach | [Indian Express, 21 Dec 2025](https://indianexpress.com/article/technology/social/posting-on-instagram-you-can-now-use-only-five-hashtags-per-post-and-reel-10429929/) | Use 1 branded, 1 series and 2–3 topic tags. Stop stuffing |
| Originality | Originals are recommended over reposts. The aggregator crackdown widened in Apr 2026 | [Instagram Creators](https://creators.instagram.com/blog/recommendations-and-originality); [TechCrunch, 30 Apr 2026](https://techcrunch.com/2026/04/30/instagram-restricts-reach-of-content-aggregators-in-new-crackdown) | Shoot your own; don't repost trend clips |
| AI labels | "AI info" is applied when AI is detected or disclosed. From 31 Aug 2026 there's an "AI generated profile" label, and unlabelled AI-person profiles may be pulled from recommendations | [Meta Transparency](https://transparency.meta.com/governance/tracking-impact/labeling-ai-content); [Mondaq, 12 Oct 2026](https://www.mondaq.com/india/social-media/1853738/instagrams-2026-ai-labelling-rules) | Label every Reel with realistic AI people, and shift to real faces |
| Search | Public posts from professional accounts can show up in Google (since 10 Jul 2025) | [Forbes](https://www.forbes.com/sites/chelseatobin/2025/07/10/what-google-indexing-instagram-means-for-your-business-visibility/) | Keyword-rich first caption line and on-screen text: "Sade Sati kya hai", "Shaadi kab hogi" |
| Authenticity | Instagram's head: "the polished aesthetic is dead" (Dec 2025 note) | [Business Insider, Jan 2026](https://www.businessinsider.com/instagram-head-ai-images-polished-feed-dead-adam-mosseri-2026-1) | Phone-shot, natural light, real UI beats glossy AI renders |
| Grid | Profile thumbnails are 3:4 (visible in your screenshot) | [VERIFIED] | Design covers at 1080×1920 but keep all text inside the central 1080×1440, and in the middle third |
| Free editing | Meta's Edits app: free, no watermark | [Meta newsroom, Apr 2025](https://about.fb.com/news/2025/04/introducing-edits-streamlined-video-creation-app/) | Default editor for the team |

### 4.2 Formats assessed for fit (validated where possible)

| Format | Evidence it works | Fit with Jyotiq | Risk | Verdict |
|---|---|---|---|---|
| **Inner-question hook → real answer on screen** | Your two biggest identifiable hits used inner-question covers [VERIFIED]. The product *is* a question box | Perfect. Demo and hook in one | Answer quality is on public display ([CONFIRM] quality first) | **Test now (core)** |
| **POV / micro-skit on shaadi pressure, situationships, job stress** | Marriage, love and career dominate queries (Storyboard18 ×2). Astrotalk's dilemma campaign. ShareChat's parent is putting ₹100 cr into AI micro-dramas ([ETBrandEquity, Aug 2026](https://brandequity.economictimes.indiatimes.com/news/business-of-brands/mohalla-tech-to-invest-inr-100-cr-to-scale-ai-led-micro-drama-production/132856241)), a sign of format demand | High. Your meme posters already carry these insights | Execution quality; cringe | **Test now** |
| **Myth vs fact / calm explainers** (Sade Sati, Manglik, Mahadasha) | Google indexing; saves. Fear content is a growing brand-safety concern ([Storyboard18, Mar 2026](https://www.storyboard18.com/digital/algorithm-of-fear-rise-of-horror-and-black-magic-misinformation-on-social-media-triggers-brand-safety-concerns-91140.htm)), which leaves room for a calm voice | High. Builds trust and search presence | Accuracy; needs Jyotish review | **Test now** |
| **Rashi-wise "send to your friend" lists** | A rashi list reached 306.5k plays on a 113k account (Modash; third-party) | Medium-high, if framed as reflection, with "your chart is the full story" | Generic sun-sign drift | **Test weekly** (Chandra rashi only) |
| **Creator talking head (real person)** | Authenticity push (above). 93% of brands prioritise Instagram for creator work ([Kofluence via Storyboard18](https://www.storyboard18.com/how-it-works/93-brands-prioritise-instagram-as-84-creators-monetise-best-through-short-form-video-kofluence-report-98028.htm)) | High. You have no face today | Cost; creator fit | **Test now** (against AI) |
| **Comment-driven episodes / reply-with-Reel** | Series logic, no hard data [HYPOTHESIS] | High once comments start | Personal data in public comments | **Phase 2** |
| **Expert reaction ("Acharya checks Jyotiq")** | The Pattern's reaction virality; AI-trust gap [HYPOTHESIS] | Unique to AstroRaaga | The Acharya disagreeing is the point, not a bug | **Phase 2** |
| **Faceless text + B-roll + voiceover** | Your current default, ~100 median [VERIFIED] | Fine for explainers if it shows real UI | Low distinctiveness | **Keep, upgraded** |
| **AI UGC / virtual host** | Cheap and fast. But label rules (Instagram, MeitY, ASCI) and the authenticity push weigh against it | Medium at best | Reach penalty if unlabelled; trust | **Small labelled test only** |
| **Memes / cartoon posters** | Your median is 123; the ideas are good, the execution is static | Ideas yes, posters no | Dense text, low watch time | **Remake as live action** |
| **Festival greeting cards** | Your median is 141, flat; commodity content | Low | Generic AI deity art | **Only festival *utility*** |

### 4.3 The eight formats to test first, in priority order

1. **"₹5 Ka Sawaal".** One real question, the real Jyotiq screen, the answer highlighted. Tests whether showing the product beats promoting it.
2. **"Shaadi Kab?" POV skits.** Tests reach and sends on the biggest demand category.
3. **"Jyotish in 30 Seconds" myth/fact.** Tests saves, search and trust.
4. **"2 AM Thoughts".** A faceless late-night confessional with a fixed template. Tests whether a recognisable series grows follows.
5. **"Rashi Hafta".** Weekly Chandra-rashi reflection cards. Tests sends.
6. **Human creator vs labelled AI avatar vs faceless**, same script. Tests production mode.
7. **Pricing explainer** ("₹5 mein kya milta hai?"). Tests link-tap-to-purchase conversion.
8. **"Acharya checks Jyotiq"** (Phase 2). Tests trust.

---

## 5. Positioning and target audience

### 5.1 Audience segments

| | **Primary: "Life-stage deciders"** | **Secondary A: "Hustlers and owners"** | **Secondary B: "Family deciders"** (later) |
|---|---|---|---|
| Who | Women and men 22–32, metro and tier-2, North/West/Central India over-represented. Hinglish speakers | 26–45, salaried switchers and small-business owners, Hindi-first | 38–55, parents deciding on children's marriage and education |
| Why them | Women 18–30 lead digital astrology use; marriage and love are 70% of women's queries (iMeUsWe). Marriage plus career are about 43% of Astrotalk's Indian consultations | Career and business are about 18% of Astrotalk's queries. Your app's own most-asked prompts include "Shubh muhurat for starting a business" and "financial gains this year" | Large spend, but more reachable on Facebook and WhatsApp |
| Use cases | "Shaadi kab hogi?", "Is he right for me?", "Ex wapas aayega?", "Job switch now?" | "Business kab grow karega?", "Is this a good time to switch?", muhurat | Children's marriage timing, education stream |
| Content they consume | Relatable POV skits, situationship humour, late-night feels, quick explainers | Hindi explainers, motivation, practical timing | Hindi devotional/cultural content, festival utility |
| Willingness to pay | Low per purchase, high frequency. ₹5 is impulse money | Higher, for "big decision" questions | Highest, but prefers a human expert |
| Barriers | "Can an AI really read my chart?", privacy of birth details, not knowing birth time, fear of being judged or upsold | Distrust of "online gurus", wants proof | Low trust in AI; prefers a pandit-ji |

**Priority for the 90 days:** Primary (about 70% of content), Secondary A (about 25%), Secondary B (about 5%, via Facebook cross-posting of Hindi explainers only).

### 5.2 The problem to own

> "I have one big question about my life, and I can't ask it at home, I don't want to pay ₹500 for a call, and Google gives me generic articles. I want a straight answer for *my* chart, right now, privately."

The motivation is reducing uncertainty before a decision or a conversation with family. That frames Jyotiq as **clarity before the conversation**, not prediction as entertainment.

### 5.3 Positioning statement

> **For** young Indians facing a big life question about marriage, love, career or money,
> **Jyotiq is** the Vedic astrology chat that gives a clear answer to *your* question from *your* birth chart, in your language, at **₹5 a question with the first one free**.
> **Unlike** per-minute astrologer apps, there's no meter running. **Unlike** general chatbots, Jyotiq calculates your actual kundli (dashas, transits) before answering. **And when** a question needs a human, AstroRaaga's verified Acharyas are a step away.

**Tagline options to test:** "Jyotiq se pucho" (already in your content, so keep it as the CTA). "Ek sawaal. Saaf jawab." "Sawaal aapka, kundli aapki."

**[CONFIRM] before you use any part of this publicly:**

- "in your language": that answers really come back in Hindi and the other languages;
- "calculates your actual kundli": consistent with your own onboarding copy;
- "Acharyas are a step away": that the "Seek deeper guidance" path really leads to AstroRaaga consultations.

### 5.4 Differentiation, stated honestly

| Versus | Their strength | Jyotiq's honest edge | Don't say |
|---|---|---|---|
| Human astrologers and marketplaces | Human judgement and trust; deep consults | Per-question pricing with no timer; instant at 2 AM; no awkwardness asking a "silly" or private question; a human handoff available | "Gurus are fake" or "better than astrologers" |
| Astrology apps (horoscopes, kundli tools) | Free daily content and tools | Answers *your* specific question rather than a generic rashifal | "Most accurate app" |
| ChatGPT and general AI | Free and familiar | Computes the chart first (dashas, 16 divisional charts, transits); Jyotish frameworks; built for Indian life questions | "ChatGPT can't do astrology" |
| Other AI astrology apps | Scale, voice, free tiers | Visible answer quality, transparent ₹5 pricing, AstroRaaga's human backing, a recognisable voice | "Only true Vedic AI" |

### 5.5 Brand voice, visual style, personality

- **Personality:** "the calm, honest didi or bhaiya who knows Jyotish." Warm, a little witty in Hinglish, never preachy, never fearful. Talks *with* people about their dilemma, not *at* them about planets.
- **Voice rules:**
  - Say "guidance"; never say "guarantee".
  - Say "your chart suggests…"; never say "you WILL…".
  - No fear words ("dosha ka khatra", "turant upay karo").
  - Humour is aimed at the situation (nosy relatives, situationships), never at believers or astrologers.
- **Language:**
  - Hinglish in Roman script by default (primary segment).
  - Hindi in Devanagari for explainers aimed at Secondary A and B, and for festival utility.
  - English as a test arm and for NRIs.
- **Visual system:** match the product.
  - Colours: midnight black (#0B0B0F range) and diya gold.
  - Fonts: Playfair Display for hooks, Plus Jakarta Sans for body text (the fonts your web app already loads).
  - Imagery: real faces in natural light, real screen recordings.
  - AI visuals only for cosmic metaphors (planets, sky), labelled when they show realistic people.
- **Series templates:** each series gets a fixed cover layout and colour accent so the grid reads as franchises: gold for "₹5 Ka Sawaal", rose for "Shaadi Kab?", indigo for "2 AM Thoughts", saffron for "Jyotish in 30s". Use the same safe areas every time.
- **Mascot:** the brain-diya "Jyoti" (already on #53 and #37) works for Stories, stickers and the "what Jyotiq won't do" Reel. Keep it out of serious answers.

### 5.6 Communicating ₹5 per Flame without sounding expensive or confusing

**Principles:**

1. **Price before jargon.** Say "₹5 per question" first; "1 Flame = 1 question" comes second, once.
2. **Start with free.** Your first question costs nothing. Say what's required to get it (sign-up and birth details) [CONFIRM the guest rules], as the free-claim rules expect.
3. **Contrast the *model*, not a competitor.** "Koi per-minute meter nahi" is true and verifiable. Don't name Astrotalk.
4. **Show the pack maths once it's fixed:**
   - 20 questions for ₹95 means ₹95 ÷ 20 = ₹4.75 each.
   - 60 questions for ₹248 means ₹248 ÷ 60 = ₹4.13 each.
5. **Never use** "never expire" (until reconciled with the 365-day validity), "limited offer" (unless it really is), "guaranteed answers" or "100% accurate".
6. **If follow-ups cost a Flame, say so before the first answer** [CONFIRM]. Surprise charges kill repeat use and can count as drip pricing under the 2023 dark-patterns guidelines.

**Lines to test (Hinglish):**

- "Pehla sawaal free. Phir ₹5 per sawaal. Koi meter nahi." (default)
- "Ek sawaal, ek poora jawab — ₹5." (product-focused)
- "₹5. Cutting chai se bhi kam." (humour; a fair comparison in most cities, but test whether it cheapens the brand)
- "Bada sawaal? ₹5 se shuru." (Secondary A)

---

## 6. Content pillars and recurring series

### 6.1 Pillars

| Pillar | Job it does | Share of Reels | Primary metric | Examples |
|---|---|---|---|---|
| **P1 Sawaal-Jawab** (product as content) | Shows exactly what you get; converts | 30% | Link taps per 1k reach; chat starts | "₹5 Ka Sawaal", pricing explainer |
| **P2 Dil Ki Baat** (relatable stories) | Non-follower reach and sends | 30% | Sends per 1k reach; non-follower % | "Shaadi Kab?", "2 AM Thoughts", POV skits |
| **P3 Jyotish, Simply** (calm education) | Trust, saves, Google and Instagram search | 20% | Saves per 1k; 28-day views | "Jyotish in 30 Seconds", myth or fact |
| **P4 Rashi & Samay** (calendar and utility) | Weekly habit; festival moments with a use | 10% | Sends and saves per 1k; returning viewers | "Rashi Hafta", festival utility |
| **P5 Bharosa** (proof and trust) | Removes objections: AI, price, privacy | 10% | Profile visit → link tap rate | "Acharya checks Jyotiq", "what Jyotiq won't do", real reactions |

### 6.2 Recurring series

| Series | Format | Length | Cadence | Cover template | Who makes it | Keep going if… | Stop if… |
|---|---|---|---|---|---|---|---|
| **₹5 Ka Sawaal** | Real UI screen recording + voiceover; one real question, answer highlighted | 20–30s | 1–2/week | Gold band, the question in quotes | Content lead + editor | Link taps/1k ≥ 1.5× trailing median over 4 episodes | Below median on link taps and skip rate after 4 |
| **Shaadi Kab?** | Hinglish POV skit; ends in a question asked to Jyotiq | 15–25s | 1/week | Rose band, "Ep N" | Creator or team actor | Sends/1k ≥ 1.5× median | 3 episodes below median on sends and skip rate |
| **Jyotish in 30 Seconds** | Talking-head explainer or myth/fact (real presenter) | 25–35s | 1/week | Saffron band, term in Hindi + English | Presenter (Acharya or team) + Jyotish reviewer | Saves/1k ≥ 1.5× median | 4 episodes below median on saves |
| **2 AM Thoughts** | Faceless POV, phone glow, typed thought, Jyotiq prompt | 12–18s | 1/week (9–11 PM) | Indigo, timestamp "2:07 AM" | Team phone | Follows/1k and comments/1k above median | 4 below median |
| **Rashi Hafta** | 12 quick rashi cards (Reel) + carousel twin | 15–20s | Weekly, Monday | 12-tile grid | Content lead | Sends/1k top-quartile | Sends below median for 3 weeks |
| **Acharya Checks** (Phase 2) | A real Acharya reviews Jyotiq's answer on a demo chart, unscripted | 35–45s | Fortnightly | Split cover: Acharya + phone | AstroRaaga Acharya [CONFIRM availability] | Link taps/1k and positive comment sentiment | Negative sentiment or ≤ median twice |
| **Aaj ka Sawaal** (Stories) | Question sticker, polls, answers to the best questions | 3–5 frames/day | Daily | Brand Story frame | Content lead | Replies per day trending up | — |

**Weekly grid for Phase 1** (4 main Reels, 1 carousel, 2 Trial Reels, Stories every day):

| Day | Main post | Notes |
|---|---|---|
| Mon | Rashi Hafta (carousel + Story) | Low effort; drives saves and sends |
| Tue | ₹5 Ka Sawaal (Reel) | Plus a Trial Reel variant of its hook |
| Wed | Jyotish in 30 Seconds (Reel) | |
| Thu | Shaadi Kab? (Reel) | Plus a Trial Reel variant |
| Fri | Stories: best comments answered + link sticker | |
| Sat | 2 AM Thoughts (Reel, 9:30–10:30 PM) | |
| Sun | Stories only (polls) | |

**Posting times:** start with 12:30–2:00 PM and 8:30–10:30 PM IST, then switch to your own Insights "most active times" after 3 weeks. One AI-astrology platform reports usage peaking at 1–3 PM and 9–11 PM ([iMeUsWe blog](https://www.imeuswe.in/blogs/astrology/how-indians-are-turning-to-ai-astrologers-for-real-time-life-guidance)). That's a single company's data [REPORTED].

**Team and effort [ESTIMATE]:**

- One content lead (scripts, posting, community; about 12–15 hours/week).
- One part-time editor (about 8–10 hours/week for 4 Reels plus 2 trial variants).
- One on-camera person (team member or creator).
- A product owner for real screen recordings and answer QA (about 1–2 hours/week).
- A Jyotish reviewer to check every explainer (about 30 minutes/week).

---

## 7. 90-day organic growth roadmap

### Days 1–30: Foundation and testing

| What | Detail | Who |
|---|---|---|
| Fix the leaks (week 1) | Bio link to the web chat; name, bio and highlights; pricing contradictions; AI-label audit; GA4 split; OG tags. Full order in Section 12 | Content lead + product |
| Baseline | Export 30-day Insights; trailing medians per metric (Section 11) | Content lead |
| Series pilots | ₹5 Ka Sawaal, Shaadi Kab?, Jyotish in 30s, 2 AM Thoughts (Reels) + Rashi Hafta (carousel) | Team |
| Volume | 4 main Reels/week + 2 Trial Reels/week (hook variants) + daily Stories, about 12 main and 6 trial by day 30 | Team |
| Production-mode test (weeks 3–5) | 3 scripts × 3 modes (real creator / labelled AI avatar / faceless) as Trial Reels (Section 9.4) | Content lead + 1 creator |
| Creator pilot | Brief 3 nano/micro creators with the same brief (Shaadi Kab? episode), Paid Partnership label on | Content lead |
| Distribution | Reply to every comment within 60 minutes. Share each Reel to Stories with a link sticker to the web chat (UTM per Reel). Pin the best 3 | Content lead |
| Assessment | Weekly 30-minute review on the dashboard. Rule: compare *rates* (per 1k reach) against the trailing median, at the same age (72 hours and 7 days) | Content lead |

**Exit gate at day 30:** dashboard live; at least 12 main and 6 trial Reels published; **2 formats** flagged as promising (beating the trailing median on at least 2 of skip rate, sends/1k and link taps/1k); first measured link tap → chat start rate.

### Days 31–60: Optimisation

| What | Detail |
|---|---|
| Double down | 60% of output goes to the top 2 formats. Each winning concept gets 3 hook variants via Trial Reels; the best becomes the grid version |
| Hooks and storytelling | Rewrite openings with skip-rate data: first frame lit (never black), question visible within 1 second, voiceover starting by 0.5 seconds |
| Series 2.0 | Launch comment-driven episodes ("aapka sawaal → agla episode") and reply-with-Reel to the best comments (anonymised). Pilot "Acharya Checks" (2 episodes) |
| Audience participation | Daily Story question sticker; weekly "Aapke sawaal" Story answers; polls that feed the next week's topics |
| Profile → web conversion tests | Bio link A/B over 2 weeks each: web chat (Love tab) vs web chat (General) vs Play Store. Compare link taps → chat starts → first answers |
| Price framing tests | Captions and end cards: "Pehla sawaal free" vs "₹5 per sawaal, koi meter nahi" vs "20 sawaal ₹95" |
| Creator round 2 | Keep the best 1–2 creators on a 4-Reel monthly retainer. Use Collab posts for shared distribution |
| Product asks (marketing-critical) | Pricing copy fixed; follow-up cost stated; a shareable one-line answer summary (Co-Star lesson) [product idea]; OG share card |

**Exit gate at day 60:** at least 1 series with sends/1k or link taps/1k above the trailing median across 4+ episodes; full funnel measured (link tap → chat start → first answer → second question → purchase), with UTMs per series.

### Days 61–90: Scaling

| What | Detail |
|---|---|
| Expand winners | 5–6 Reels/week. Winning series go to twice weekly; losing ones get cut |
| Repeatable workflow | Monthly script bank of 40 questions from comments, DMs, Story replies and anonymised question trends. Fortnightly batch-shoot day (8–10 Reels). Cover and caption templates in Edits/CapCut; checklist QA |
| Creator programme | 2–3 creators on retainer (one per segment), each with a series they own (e.g. a creator becomes the face of "Shaadi Kab?") |
| Repurpose | Same masters to YouTube Shorts and Facebook Reels (Secondary B lives on Facebook); best explainers to carousels |
| Owned channel | Test a WhatsApp channel or email for weekly "Rashi Hafta" and new episodes. Instagram channels and Live unlock at 1,000 followers |
| Data PR (if privacy-approved) | Monthly "Is mahine India ne Jyotiq se kya poocha": aggregated, anonymised category shares only. Pitch to Storyboard18, ETBrandEquity and Inc42 |
| Paid-readiness | Pick the 3 creatives with the best link-tap and chat-start rates; get creator permission for partnership ads; write down the CAC you can afford from the measured purchase rate (Section 11.4) |

**Exit gate at day 90:** 2–3 proven series with a production cost per Reel you can sustain; a measured funnel; a written decision on whether, and how, to start a small paid test.

---

## 8. Thirty Reel concepts and ten production-ready scripts

### 8.1 Production standards (apply to every concept)

- **Format:** 1080×1920, 9:16, 30 fps. Edit in Edits or CapCut. Burn captions in by hand; never let a video model render on-screen text.
- **First frame:**
  - Never black or near-black. Open on the one lit thing (phone glow, a face, a lamp), with darkness around it.
  - The hook text is visible by 1.0 second and readable with the sound off.
- **Safe areas:**
  - Keep text in the middle third.
  - Keep it clear of the bottom ~250 px (caption and UI overlay) and the right ~150 px (buttons).
  - The cover's key text sits inside the central 1080×1440, for the 3:4 grid.
- **Real product only:**
  - Screen-record the real production app or web app; no mock-up phones.
  - When a chart is involved, use a **"Demo kundli"** made from fictional birth details, and show a small label: "Demo kundli • details fictional".
  - The voiceover may only describe what the on-screen answer actually says. **Never rewrite or invent Jyotiq's answer.**
- **Standard disclaimer** (in the caption, and on screen for prediction content): "Jawab Jyotish parampara par aadharit guidance hai, guarantee nahi. Health, legal ya paise ke faislon ke liye expert se milein." It mirrors your Terms.
- **AI:**
  - Any realistic AI-generated person or voice gets Instagram's AI label, plus on-screen text: "AI-generated character".
  - AI is never used for a testimonial.
- **Paid creators:** Instagram's Paid Partnership label, plus "#ad" or "Paid partnership with @jyotiq_" at the *start* of the caption (ASCI influencer guidelines 1.2–1.4, [PDF](https://www.ascionline.in/social/wp-content/uploads/2025/04/ASCI-Influencer-Guidelines.pdf)).
- **Hashtags:** at most 5. One branded (#JyotiqSePucho), one series tag, two or three topic tags (#VedicAstrology, #Kundli, #AstrologyInHindi…).
- **Audio:** original voiceover or dialogue first. If you use trending audio, keep it under 20% volume.
- **Reuse:** the 9:16 Reel we built earlier already shows the real Love → "When will I get married?" → gold send flow (`/Users/ayushrajput/.kiro/crew/workspace/video/out/jyotiq/jyotiq-reel-9x16.mp4`). Pin it as the "How it works" Reel in week 1, and lift its UI shots for Script 1. **Before posting, swap its soundtrack.** It reuses the reference launch video's audio, which risks copyright muting and fails Instagram's originality preference. Use original sound or Instagram's licensed library.

### 8.2 Concept index (all 30)

| # | Concept (hook gist) | Series / pillar | Objective | Segment | Production mode | Success metric |
|---|---|---|---|---|---|---|
| 1 | "Shaadi kab hogi?", real answer on screen | ₹5 Ka Sawaal / P1 | Conversion | Primary | Faceless screen recording + voiceover | Link taps per 1k reach |
| 2 | Mummy's 11 PM "rishta" message | Shaadi Kab? / P2 | Reach | Primary | Creator skit | Sends per 1k |
| 3 | Sade Sati: understand it, don't fear it | Jyotish in 30s / P3 | Saves, search | All | Real presenter | Saves per 1k |
| 4 | "Manglik = problem?" Myth ya fact | Jyotish in 30s / P3 | Comments | Primary | Two-actor skit | Comments per 1k |
| 5 | 2 AM Thoughts, Ep 1 | 2 AM Thoughts / P2 | Follows | Primary | Faceless | Follows per 1k |
| 6 | "Job switch karun ya ruk jaun?" | ₹5 Ka Sawaal / P1 | Conversion | Sec. A | Faceless + hands | Link taps per 1k |
| 7 | "₹5 mein kya milta hai?" | P5 Bharosa | Conversion | All | Presenter or faceless | Link tap → purchase |
| 8 | "Jyotiq kya NAHI karega" | P5 Bharosa | Trust | All | Mascot animation | Profile visit → link tap |
| 9 | Rashi Hafta, Ep 1 | Rashi Hafta / P4 | Sends | Primary | Template | Sends per 1k |
| 10 | "Acharya-ji ne Jyotiq ka jawab check kiya" | Acharya Checks / P5 | Trust | All | Real Acharya | Link taps per 1k + sentiment |
| 11 | "Astrology guidance chahiye… shuru kahan se?" (remake of the 5,139 hit) | ₹5 Ka Sawaal / P1 | Conversion | Primary | Creator + UI | Link taps per 1k |
| 12 | "Paison ki tension kab khatam hogi?" (remake of the 2,308 hit) | ₹5 Ka Sawaal / P1 | Conversion | Sec. A | Faceless + UI | Link taps per 1k |
| 13 | "Indian parents: Shaadi kab karoge?" (live action) | Shaadi Kab? / P2 | Reach | Primary | Creator skit | Sends per 1k |
| 14 | "Red flag ko green flag samajhne ki Olympics" | P2 | Reach | Primary | Creator skit | Sends per 1k |
| 15 | "Ex wapas aayega… ya move on karun?" | ₹5 Ka Sawaal / P1+P2 | Engagement | Primary | Faceless + UI | Comments and saves per 1k |
| 16 | Lagna vs Rashi vs Sun sign in 20 seconds | Jyotish in 30s / P3 | Search, saves | All | Presenter + graphics | Saves per 1k |
| 17 | "Mahadasha kya hai? Aapki kaunsi chal rahi hai?" | Jyotish in 30s / P3 | Saves → Kundali | All | Presenter + UI | Saves, link taps |
| 18 | "Birth time nahi pata? 3 jagah dhoondo" | P3 utility | Friction removal | All | Presenter | Saves; form completion |
| 19 | "Business ka shubh muhurat kab?" (Hindi) | ₹5 Ka Sawaal / P1 | Conversion | Sec. A | Faceless + UI | Link taps per 1k |
| 20 | Shani gochar and career, calmly (remake of the 1,012 Saturn post) | Jyotish in 30s / P3 | Reach, saves | All | Presenter + labelled Saturn visual | Saves per 1k |
| 21 | "Videsh jaane ka yog hai?" | ₹5 Ka Sawaal / P1 | Conversion | Primary / NRI | Faceless + UI (Travel tab) | Link taps per 1k |
| 22 | POV: your best friend's wedding just got fixed | P2 | Reach | Primary | Creator skit | Sends per 1k |
| 23 | "Comment your Chandra rashi" → replies | Rashi Hafta / P4 | Comments | Primary | Template replies | Comments per 1k |
| 24 | Kundli's 12 houses in 12 seconds | Jyotish in 30s / P3 | Saves | All | Motion graphics | Saves per 1k |
| 25 | Everyone's advice vs one sensible answer (remake of #46) | P2 | Reach | Primary | Creator skit | Sends per 1k |
| 26 | Behind the answer: how Jyotiq builds a reply | P5 | Trust | All | Screen recording + product person | Profile visit → link tap |
| 27 | First question, first reaction (real users) | P5 | Social proof | Primary | Real consenting users | Sends, link taps |
| 28 | Rahu-Ketu without the fear | Jyotish in 30s / P3 | Saves | All | Presenter | Saves per 1k |
| 29 | "Is mahine India ne Jyotiq se kya poocha" | P5 data PR | Trust, PR | All | Motion graphics | Shares, press pickups |
| 30 | "Bachche ki padhai: kaunsa stream?" (Hindi; Facebook too) | ₹5 Ka Sawaal / P1 | Conversion | Sec. B | Faceless + UI (Education tab) | Link taps per 1k |

**Mix by objective:**

| Objective | Concepts |
|---|---|
| Reach | 2, 9, 13, 14, 20, 22, 25 |
| Engagement | 4, 5, 15, 23 |
| Product demonstration | 1, 6, 11, 12, 19, 21, 30 |
| Education | 3, 16, 17, 18, 24, 28 |
| Trust and conversion | 7, 8, 10, 26, 27, 29 |

### 8.3 Production-ready scripts (1–10)

---

#### Script 1: ₹5 Ka Sawaal #1, "Shaadi kab hogi?"

| Field | Detail |
|---|---|
| Pillar / objective | P1 Sawaal-Jawab. Conversion (link taps → chat starts), with saves secondary |
| Audience and insight | Women and men 23–30. Marriage timing is the single biggest astrology question in India (42% of women's queries on iMeUsWe; about a quarter of Astrotalk's Indian consultations). People want a private, specific answer without a ₹500 call |
| Hook | Typed on screen: "When will I get married?", under the text "Har ghar ka sawaal 👇". Avoid "India ka #1 sawaal": a superlative needs substantiation under the ASCI code, and the data here is platform-level, not national |
| Duration / style | 22–25s. Screen recording with slow push-ins, gold underline highlights, kinetic text, UI-click sound effects, a soft ambient bed |
| How Jyotiq appears | The real Love tab → typed question → gold send → the real answer, scrolled |
| Production mode | Faceless screen recording + a team voiceover (warm female, Hinglish) |
| Hypothesis → metric | A real answer on screen gets **≥2× the account median link-tap rate** of the old poster Reels, with skip rate at or below the median. Measure link taps per 1k reach, UTM chat starts and saves per 1k |

| Time | Visual | On-screen text | Audio / voiceover |
|---|---|---|---|
| 0.0–1.5s | Close-up of a hand holding a phone in a lamp-lit room; Jyotiq Love tab glowing, cursor blinking in "Ask the stars your question…" | **Har ghar ka sawaal 👇** | Room tone; soft tick |
| 1.5–4.0s | Thumb types "When will I get married?" | Hinglish subtitle: *Shaadi kab hogi?* | VO: "Har ghar mein poocha jaata hai…" |
| 4.0–6.0s | Taps the gold send button; loading state | Small, top-left until 16s: *Demo kundli • details fictional* | VO: "…par seedha jawab kabhi nahi milta." |
| 6.0–15.0s | Real answer, slow scroll; gold underline on 2 lines that cite chart factors | Pull-quote of one highlighted line, **verbatim** | VO: "Jyotiq pehle aapki kundli dekhta hai — jaise is jawab mein [say only what the highlighted lines reference]." |
| 15.0–20.0s | Midnight card, diya-gold type | **Ek sawaal. Ek poora jawab. ₹5.** then **Pehla sawaal free.** | VO: "Koi per-minute meter nahi. Pehla sawaal free, phir ₹5 per sawaal." |
| 20.0–24.0s | Real Love tab with its 6 suggested questions | **Aapka sawaal kya hai? 👉 Link in bio** · tiny: *Guidance hai, guarantee nahi.* | VO: "Aapka sawaal kya hai?" Music resolves |

**Caption**

```
Shaadi kab hogi? 💍 Har ghar mein poocha jaane wala sawaal.
Is demo mein dekho Jyotiq kundli se jawab kaise deta hai.
Pehla sawaal free, phir ₹5 per sawaal — koi per-minute meter nahi.
👉 Apna sawaal pucho: link in bio
(Demo kundli, details fictional. Jawab Jyotish parampara par aadharit guidance hai, guarantee nahi.)
#JyotiqSePucho #ShaadiKabHogi #VedicAstrology #Kundli #MarriageAstrology
```

Cover: the gold "₹5 Ka Sawaal" band plus **"Shaadi kab hogi?"** in Playfair, centred in the middle third.

---

#### Script 2: Shaadi Kab? Ep 1, "Mummy ka 11 baje wala rishta"

| Field | Detail |
|---|---|
| Pillar / objective | P2 Dil Ki Baat. Reach and sends to non-followers |
| Audience and insight | 23–30, both genders. Parental marriage pressure is universal, funny and *forwardable* ("literally my mom") |
| Hook | Her face lit by the phone, plus a chat bubble: "Mummy (11:04 PM): Beta, ek photo bheji hai 🙂". Text: "POV: 11 baje mummy ka 'rishta' message" |
| Duration / style | 18–21s. Phone-shot, a bedside lamp for light, natural acting, jump cuts. No glossy grade |
| How Jyotiq appears | She opens the real app and types a question. The answer is **not shown** (variant A) or shows **one highlighted line** (variant B). Test both as Trial Reels |
| Production mode | A real creator (24–28, Hinglish) plus an off-screen "mummy" voice. If the creator is paid: Paid Partnership label + #ad up front. It's a skit, so never caption it as a real customer story |
| Hypothesis → metric | Family-pressure skits earn **sends per 1k ≥1.5× median** and a higher non-follower share than the old meme posters. Measure sends per 1k, % non-follower reach and follows per 1k |

| Time | Visual | On-screen text | Audio |
|---|---|---|---|
| 0.0–1.5s | Her face lit by the phone in bed; the phone buzzes; generic chat bubble pops in (not WhatsApp branding) | **POV: 11 baje mummy ka "rishta" message** | Buzz sound effect |
| 1.5–5.0s | She stares at the ceiling, starts typing "Mummy main…", deletes it | — | Inner voiceover: "Haan bolun? Na bolun? Kab tak 'abhi nahi' bolun?" |
| 5.0–9.0s | A voice note plays from the phone; she covers her face | Subtitles | Mom (voice note): "Sharma aunty keh rahi thi is saal tumhara yog hai…" |
| 9.0–13.0s | She sighs and opens Jyotiq (real UI) → Love tab | **Jo mummy se nahi pooch sakte…** | Soft beat drops in |
| 13.0–17.0s | Types "Is this the right time for me to get married?" → send → reads | **…Jyotiq se pucho.** | — |
| 17.0–21.0s | She smiles faintly and replies to mom: "Mummy, kal baat karte hain ❤️" | **Shaadi Kab? · Ep 1** · *Apni story comment karo 👇* | Music button |

**Caption**

```
Mummy ka 11 baje wala "rishta" message 😅 aur hamara "abhi nahi"…
Shaadi Kab? — Episode 1. Apni shaadi-pressure story comment karo (naam/details mat likhna) — agla episode usi pe.
Jab sawaal dil mein ho, Jyotiq se pucho — pehla sawaal free (link in bio).
Us dost ko bhejo jiski mummy bhi yahi karti hain 👀
#ShaadiKab #IndianParents #JyotiqSePucho #RelatableReels #VedicAstrology
```

Male variant (Ep 2): "Papa: Beta, Gupta ji ki beti CA hai 🙂". Same structure.

---

#### Script 3: Jyotish in 30 Seconds, "Sade Sati: darr nahi, samajh"

| Field | Detail |
|---|---|
| Pillar / objective | P3 Jyotish, Simply. Saves, search discovery, trust |
| Audience and insight | Everyone. "Sade Sati" is a term people hear and fear; most explanations online either scare or sell. A calm, accurate 30 seconds is rare |
| Hook | "'Sade Sati shuru ho gayi' sunke darr gaye? 🪐 30 second do." |
| Duration / style | 30–33s. Real presenter mid-shot by a window, with simple house-wheel graphics. Calm pacing. **A Jyotish reviewer signs off the script** |
| How Jyotiq appears | The real Kundali screen showing Chandra Rashi and the running dasha, then the chat with a typed question [CONFIRM the screen shows both] |
| Production mode | Real presenter: an AstroRaaga Acharya or a trained team member ("Didi" persona). Faceless with voiceover as a fallback |
| Hypothesis → metric | Calm explainers earn **saves per 1k ≥1.5× median** and keep gaining views for weeks (search). Measure saves per 1k, 28-day views vs 7-day views, profile visits |

| Time | Visual | On-screen text | Presenter |
|---|---|---|---|
| 0–2s | Presenter holds the phone up; a labelled Saturn illustration behind | **"Sade Sati shuru ho gayi" sunke darr gaye? 🪐** | "Sade Sati ka naam sunke darr lagta hai? 30 second do." |
| 2–10s | Graphic: a Chandra-rashi wheel, with Saturn stepping through 3 houses | **Chandra rashi se 12th → 1st → 2nd** · *har ghar ≈ 2.5 saal = ≈ 7.5 saal* | "Sade Sati tab hoti hai jab Shani aapki Chandra rashi se baarahven, pehle aur doosre ghar se guzarta hai. Har ghar mein lagbhag dhaai saal — total kareeb saade saat saal." |
| 10–20s | Back to camera | **'Sab bura'? Nahi.** | "Iska matlab sab kuch bura nahi hota. Parampara mein Shani ko mehnat, anushasan aur zimmedari ka grah maana gaya hai. Asar poori kundli pe depend karta hai — Shani ki apni sthiti, aapki dasha, aur baaki grah." |
| 20–28s | Real UI: Kundali (Chandra Rashi, dasha), then the chat typing "Shani ka mere career pe kya asar hai?" | **Apni Chandra rashi + dasha → Jyotiq Kundali** | "Apni Chandra rashi aur chal rahi dasha Jyotiq ke Kundali mein dekho — aur seedha poocho." |
| 28–32s | Presenter smiles | **Save karo 🔖 Darr nahi, samajh.** · *Guidance hai, guarantee nahi.* | "Save kar lo — kisi ko darte dekho toh bhej dena." |

**Caption**

```
Sade Sati kya hai? 🪐 Jab Shani aapki Chandra rashi se 12th, 1st aur 2nd bhav se guzarta hai — kul milakar lagbhag 7.5 saal.
Asar poori kundli pe depend karta hai: Shani ki sthiti, aapki dasha, baaki grah. Darr nahi, samajh zaroori hai.
Apni Chandra rashi aur dasha dekhne ke liye: link in bio.
(Jyotish parampara par aadharit jaankari — guarantee nahi.)
#SadeSati #Shani #JyotishInHindi #VedicAstrology #JyotiqSePucho
```

---

#### Script 4: Jyotish in 30 Seconds, "Manglik = shaadi mein problem? Myth ya Fact?"

| Field | Detail |
|---|---|
| Pillar / objective | P3 / P2. Comments and sends |
| Audience and insight | 23–32 and their families. The "Manglik" label creates real anxiety in rishta talks. Families argue about it, and people want a balanced view they can show at home |
| Hook | Bua-ji at the dining table: "Ladki Manglik hai? Phir toh rishta mushkil hai!" plus "Myth ya Fact? 🤔" |
| Duration / style | 26–28s. Home-set comedy into an explainer. Two actors, warm and respectful; nobody is mocked |
| How Jyotiq appears | The real Love tab suggested question: "Is my current partner truly compatible with me long-term?" |
| Production mode | Two real actors (a creator plus a family member works). A Jyotish reviewer signs off |
| Hypothesis → metric | A contested family topic in myth/fact form earns **comments per 1k ≥2× median** without negative sentiment. Measure comments per 1k, sends per 1k, comment sentiment (manual tag) |

| Time | Visual | On-screen text | Audio |
|---|---|---|---|
| 0–2s | Bua-ji with a plate of laddoos, mid-sentence | **"Ladki Manglik hai? Phir toh mushkil hai!"** · **Myth ya Fact? 🤔** | Bua-ji line |
| 2–4s | Niece looks to camera, one eyebrow up | **Ruko bua-ji ✋** | Record-scratch sound effect |
| 4–12s | Niece explains; graphic of a kundli with houses 1, 4, 7, 8, 12 glowing | **Mangal: 1, 4, 7, 8, 12 bhav** | "Jab Mangal kundli ke kuch khaas bhavon mein hota hai — aam taur pe 1, 4, 7, 8 ya 12 — use Mangal dosha kehte hain." |
| 12–20s | Niece to camera | **Parihar = cancellation bhi hote hain** | "Par classical Jyotish mein iske kai parihar — yaani cancellation — bhi bataye gaye hain. Aur shaadi ka faisla ek label se nahi, poori kundli aur do logon ki baat-cheet se hota hai." |
| 20–24s | Real UI: Love tab → taps the compatibility suggestion | **Na poora myth, na poora fact → poori kahani dekho** | "Toh jawab? Poori kahani dekho." |
| 24–28s | Bua-ji, laddoo in hand, half-convinced | **Aap kya kehte ho — Myth ya Fact? 👇** · *Guidance hai, guarantee nahi.* | Bua-ji: "Achha… toh kundli dikhao." (laughs) |

**Caption**

```
Manglik hona = shaadi mein problem? 🤔
Mangal dosha ki aadhi baat sab jaante hain — parihar (cancellation) wali baat kam log.
Comment karo: Myth ya Fact? Aur us cousin ko bhejo jiske ghar mein yeh behes chal rahi hai 😅
Apni kundli ke hisaab se sawaal: link in bio.
#Manglik #MangalDosha #KundliMilan #VedicAstrology #JyotiqSePucho
```

Moderation: hide or delete abusive comments, and pin a calm, factual reply.

---

#### Script 5: 2 AM Thoughts, Ep 1

| Field | Detail |
|---|---|
| Pillar / objective | P2 Dil Ki Baat. Follows and comments (building a series habit) |
| Audience and insight | 20–30. Late-night overthinking about relationships is near-universal; your "2 AM thoughts" poster (#50) had the right instinct in the wrong format |
| Hook | A glowing Notes screen with the timestamp "2:07 AM". Typed: *"Kya main sach mein usse pyaar karti hoon… ya bas aadat ho gayi hai?"* |
| Duration / style | 14–15s. Faceless POV under a blanket; the phone glow lights hands and fabric (never a black frame). Keyboard sounds, room tone, one soft piano note at the end |
| How Jyotiq appears | She switches to Jyotiq → Love tab → taps the suggestion "How can I improve communication and harmony in my current relationship?" → loading. **Cut before the answer** |
| Production mode | Faceless, shot on a team phone. Later episodes use audience-submitted thoughts, *with DM permission*, anonymised and labelled "Ek follower ka sawaal (anonymous, permission se)" |
| Hypothesis → metric | A fixed-template late-night series earns **follows per 1k and comments per 1k above median**, and a growing share of returning viewers by Ep 4. Measure follows per 1k, comments per 1k, % follower views across episodes |

| Time | Visual | On-screen text | Audio |
|---|---|---|---|
| 0.0–1.0s | Phone screen glowing in the dark, Notes open | **2:07 AM** | Fan hum |
| 1.0–5.0s | Thought being typed, letter by letter (enlarged) | The typed thought is the hook | Keyboard taps |
| 5.0–8.0s | Select all → delete. Switches to Jyotiq → Love tab | — | — |
| 8.0–12.0s | Taps the suggested question → send → loading shimmer | **Kuch sawaal raat ko hi aate hain.** | — |
| 12.0–15.0s | Indigo end card | **Jawab bhi mil sakta hai 🌙** · **2 AM Thoughts · Ep 1** · *Aapka 2 AM sawaal? Comment karo (bina naam ke)* | Piano note |

**Caption**

```
2 AM thoughts 🌙 Woh sawaal jo din mein nahi aate.
Aapka 2 AM sawaal comment karo — naam ya personal details mat likhna. Kuch sawaal agle episodes mein (anonymous).
Jab mann ho, Jyotiq se pucho — link in bio.
#2AMThoughts #Overthinking #RelationshipThoughts #JyotiqSePucho #VedicAstrology
```

Post time: Saturday, 9:30–10:30 PM.

---

#### Script 6: ₹5 Ka Sawaal #2, "Job switch karun ya ruk jaun?"

| Field | Detail |
|---|---|
| Pillar / objective | P1. Conversion for the career segment |
| Audience and insight | 24–35 salaried professionals. Career and business are about 18% of Astrotalk's Indian consultations. Many people sit on a resignation draft for months |
| Hook | A glowing laptop with an email draft, "Subject: Resignation", and the cursor hovering over Send. Text: "Resignation 3 mahine se Drafts mein? 😶" |
| Duration / style | 22–24s. Dim room lit by the screen; real UI; gold highlights |
| How Jyotiq appears | Career tab → "Is this a good time for me to change my job?" → real answer (demo kundli) |
| Production mode | Faceless hands + male Hinglish voiceover |
| Hypothesis → metric | A career demo gets a **link-tap rate within ±20% of Script 1**, which validates Secondary A. Measure link taps per 1k, and chat starts via a career-specific link if the app supports a category URL [CONFIRM] |

| Time | Visual | On-screen text | Voiceover |
|---|---|---|---|
| 0–2s | Laptop draft email glowing; cursor blinks over Send | **Resignation 3 mahine se Drafts mein? 😶** | Room tone |
| 2–5s | Hand closes the laptop and picks up the phone | — | "Chhodun? Ya ek saal aur ruk jaun?" |
| 5–9s | Real Career tab → types the question → send | *Demo kundli • details fictional* | "Ek sawaal. Seedha." |
| 9–17s | Answer scrolls; 2 lines underlined; pull-quote **verbatim** | Pull-quote | "Jyotiq kundli se dekhta hai — [say only what the highlighted lines reference]." |
| 17–21s | Midnight card | **Faisla aapka. Clarity ₹5 mein.** · *Pehla sawaal free* | "Faisla aapka. Pehla sawaal free, phir ₹5." |
| 21–24s | Career tab with its suggestions | **Aapka career sawaal? 👉 Link in bio** · *Guidance hai — career/financial advice nahi* | — |

**Caption**

```
Job switch karun ya ruk jaun? 💼 Draft mein pada resignation aur confused dil…
Is demo mein dekho Jyotiq career ka sawaal kundli se kaise dekhta hai.
Pehla sawaal free, phir ₹5 — koi meter nahi. Link in bio.
(Demo kundli. Jyotish guidance hai, career ya financial advice nahi.)
#CareerAstrology #JobChange #VedicAstrology #JyotiqSePucho #Kundli
```

---

#### Script 7: "₹5 mein kya milta hai?" (pricing, saaf-saaf)

| Field | Detail |
|---|---|
| Pillar / objective | P5 Bharosa. Conversion: removes price confusion and "hidden charges" fear |
| Audience and insight | Anyone who reached the profile. "Flames" is jargon, and people expect meters and timers from astrology apps (Mint described a 2-minute free chat ending in "please recharge") |
| Hook | Presenter holds the phone up to the camera showing the Flame counter: "Astrology app pe paisa kaise katta hai? 🤔 Jyotiq pe — saaf-saaf:" |
| Duration / style | 22–23s. Presenter plus real UI inserts; numbered kinetic text |
| How Jyotiq appears | The "1 Flame Credited!" modal, the header Flame counter, the Plans page (Starter Pack) |
| Production mode | A real team member to camera (builds trust), or faceless with voiceover |
| **Pre-requisites** | Pricing copy fixed (no "never expire" until reconciled; bonus % corrected). The follow-up rule confirmed. "GST included" said only if confirmed. "No subscription" said only if confirmed [CONFIRM] |
| Hypothesis → metric | Plain pricing **raises the purchase rate among chat starters** from Instagram and cuts "price?" DMs. Measure purchase rate of the UTM cohort, link taps per 1k and "price?" DM count per week |

| Time | Visual | On-screen text | Presenter |
|---|---|---|---|
| 0–2s | Presenter holds the phone with the Flame counter visible | **Astrology app pe paisa kaise katta hai? 🤔** | "Jyotiq pe — saaf-saaf batata hoon." |
| 2–6s | Real signup → "1 Flame Credited!" | **1️⃣ Sign up → pehla sawaal FREE** | "Sign up karte hi ek Flame free — yaani pehla sawaal free." |
| 6–11s | Asking a question; counter goes from 1 to 0 | **2️⃣ 1 Flame = 1 sawaal = ₹5** | "Har sawaal ek Flame — ₹5. Koi per-minute meter nahi, koi timer nahi." |
| 11–16s | Plans page, Starter Pack | **3️⃣ 20 sawaal = ₹95 (₹4.75 each)** | "Zyada poochna hai? Bees sawaal pachaanve rupaye mein." |
| 16–19s | Text card (use whichever is TRUE) | **Follow-up = 1 Flame** *or* **Clarifying sawaal free** | "Follow-up ka rule bhi pehle se saaf." |
| 19–23s | Presenter | **Pehle free sawaal se try karo 👉 Link in bio** | "Pehla sawaal free hai — try karke dekho." |

**Caption**

```
Jyotiq pe paise kaise lagte hain? 🔥 Saaf-saaf:
1️⃣ Sign up → pehla sawaal free
2️⃣ 1 Flame = 1 sawaal = ₹5
3️⃣ 20 sawaal ka pack ₹95
Koi per-minute meter nahi. Link in bio.
#JyotiqSePucho #AstrologyApp #VedicAstrology #Kundli #AstrologyInHindi
```

---

#### Script 8: "Jyotiq kya NAHI karega" (trust)

| Field | Detail |
|---|---|
| Pillar / objective | P5 Bharosa. Trust, and a clear stand against fear-selling |
| Audience and insight | Sceptics and anyone burned by "dosha hai, upay karo" pitches. Fear-led astrology content is under brand-safety scrutiny (Storyboard18, Mar 2026) |
| Hook | The glowing brain-diya mascot "Jyoti" (lit on a midnight background): "Ek AI astrologer ka confession 🙊 Main yeh 4 kaam NAHI karta" |
| Duration / style | 21–22s. Simple 2D mascot animation, four ✗ cards, one ✓ card, playful voice |
| How Jyotiq appears | A real UI clip of a question → answer on the last card |
| Production mode | Faceless animation (Edits/CapCut keyframes on the existing logo art) plus a voiceover |
| **Pre-requisite** | QA 20 real answers across all 8 categories. If any answer uses fear language or pushes gemstones or pooja as a fix, correct the product first or drop card 1 |
| Hypothesis → metric | "What we don't do" content **lifts profile-visit → link-tap conversion**. Measure that ratio for 7 days after posting vs the 7 days before, saves per 1k and comment sentiment |

| Time | Visual | On-screen text | Voiceover (mascot) |
|---|---|---|---|
| 0–2s | Jyoti glows on the midnight background | **Ek AI astrologer ka confession 🙊** · **Main yeh 4 kaam NAHI karta** | "Confession time!" |
| 2–6s | ✗ card 1 | **❌ Darr nahi bechta** · *"Bada dosha hai, turant upay karo" — nahi* | "Darr nahi bechta. Yeh mera style nahi." |
| 6–10s | ✗ card 2 | **❌ Guarantee nahi deta** | "Jyotish guidance hai, gaarantee nahi." |
| 10–14s | ✗ card 3 | **❌ Doctor, vakeel ya financial advisor nahi hoon** | "Health, legal ya paise ke bade faisle — expert se milo." |
| 14–18s | ✗ card 4 | **❌ Per-minute meter nahi chalata** · *1 sawaal = ₹5* | "Ek sawaal, ek jawab, paanch rupaye." |
| 18–22s | ✓ card + real UI clip | **✅ Aapki kundli se, aapke sawaal ka seedha jawab** · **Pehla sawaal free 👉 Link in bio** | "Jo karta hoon — seedha jawab." |

**Caption**

```
Ek AI astrologer ke 4 "NAHI" 🙊
❌ Darr nahi ❌ Guarantee nahi ❌ Doctor/vakeel/financial advisor ki jagah nahi ❌ Per-minute meter nahi
✅ Aapki kundli se, aapke sawaal ka seedha jawab. Pehla sawaal free — link in bio.
#JyotiqSePucho #VedicAstrology #AstrologyInHindi #Kundli #HonestAstrology
```

---

#### Script 9: Rashi Hafta, Ep 1 ("Is hafte har rashi ke liye ek sawaal")

| Field | Detail |
|---|---|
| Pillar / objective | P4. Sends ("send to your Tula friend"), saves and a weekly return habit |
| Audience and insight | 20–35. Rashi-wise lists are a proven high-play format in Indian astrology Instagram (Modash data). Jyotiq turns the format into **reflection, not prediction**, and points people to the chart for the full picture |
| Hook | "Apni Chandra rashi pe ruko ✋ aur screenshot lo 📸" |
| Duration / style | 19–20s: a 1.5s intro, twelve 1.2s cards, a 3s outro. Carousel twin of 13 slides. Same template every Monday |
| How Jyotiq appears | Outro: the real Kundali screen showing Chandra Rashi [CONFIRM] |
| Production mode | Template (Edits/Canva). No faces needed |
| Note | The lines draw on traditional sign traits as *reflective questions*. Label the post "Reflection, prediction nahi". Always say **Chandra** rashi (the Vedic default), not the sun sign |
| Hypothesis → metric | Rashi lists produce the **account's top-quartile sends per 1k**. Measure sends per 1k, saves per 1k (carousel) and follows per 1k |

**Card text (one per 1.2s; rashi name in Hindi plus English and the symbol):**

| Rashi | Line |
|---|---|
| ♈ Mesh (Aries) | "Kya main jaldbaazi mein faisle le raha/rahi hoon?" |
| ♉ Vrishabh (Taurus) | "Comfort zone mujhe rok toh nahi raha?" |
| ♊ Mithun (Gemini) | "Overthinking kam karke ek baat clearly kahun?" |
| ♋ Kark (Cancer) | "Sabka khayal rakhte-rakhte apna khayal kab?" |
| ♌ Simha (Leo) | "Mujhe tareef chahiye ya sach mein progress?" |
| ♍ Kanya (Virgo) | "Perfect ka intezaar karun ya shuru karun?" |
| ♎ Tula (Libra) | "Sabko khush rakhne mein khud ko bhool toh nahi raha/rahi?" |
| ♏ Vrishchik (Scorpio) | "Kisi pe bharosa karun — ya pehle khud pe?" |
| ♐ Dhanu (Sagittarius) | "Azaadi chahiye ya bas bhaagna hai?" |
| ♑ Makar (Capricorn) | "Kaam ke alawa zindagi mein kya hai?" |
| ♒ Kumbh (Aquarius) | "Sabse alag rehna — choice hai ya dar?" |
| ♓ Meen (Pisces) | "Sapne dekh raha/rahi hoon ya unpe kaam bhi?" |

Outro (16.5–19.5s): **"Rashi sirf headline hai. Poori kahani aapki kundli mein."** · *Chandra rashi nahi pata? Jyotiq Kundali mein dekho 👉 link in bio* · "Apne Tula dost ko bhejo 😄"

**Caption** (all 12 lines, then):

```
Rashi Hafta • Ep 1 — har Chandra rashi ke liye is hafte ka ek sawaal (reflection, prediction nahi).
Rashi sirf headline hai — poori kahani aapki kundli mein. Chandra rashi dekhne ke liye: link in bio.
Us dost ko bhejo jiski rashi Tula hai 😄
#RashiHafta #ChandraRashi #Rashifal #VedicAstrology #JyotiqSePucho
```

---

#### Script 10: "Acharya-ji ne Jyotiq ka jawab check kiya"

| Field | Detail |
|---|---|
| Pillar / objective | P5 Bharosa. Credibility with AI sceptics; reach through a healthy debate |
| Audience and insight | Everyone who trusts human Jyotishis more than AI, which is most of the market. An honest expert review, *including disagreement*, is more convincing than any claim |
| Hook | An Acharya at his desk with a phone and a panchang: "Mujhe kaha gaya AI ka jawab check karo. Chaliye dekhte hain." Text: "Humne ek Acharya ko AI ka jawab check karne diya 👀" |
| Duration / style | 40–43s. Natural light, two angles (face plus over-the-shoulder on the phone). **Unscripted review** |
| How Jyotiq appears | Demo kundli; the Love suggestion "When am I likely to meet my true soulmate or life partner?" → the real answer |
| Production mode | A real Acharya from AstroRaaga's network [CONFIRM availability] or an independent astrologer, with the relationship disclosed |
| Integrity rules | Don't script his verdict. Don't cut his disagreements. Disclose the AstroRaaga relationship in the caption and on screen |
| Hypothesis → metric | Expert review **raises link taps per 1k from non-followers** and draws mostly positive comments. Measure link taps per 1k, % positive vs negative comments (manual tag) and saves per 1k |

| Time | Visual | On-screen text | Audio |
|---|---|---|---|
| 0–2s | Acharya at the desk, phone in hand | **Humne ek Acharya ko AI ka jawab check karne diya 👀** | Acharya: "Chaliye dekhte hain." |
| 2–8s | Over-the-shoulder: demo kundli; taps the suggestion → send | *Demo kundli • details fictional* | Reads the question aloud |
| 8–20s | Answer on screen; he points at a line, which gets highlighted verbatim | Highlighted line | [Unscripted: what he finds right and why] |
| 20–32s | To camera | **Jahan sehmat ✅ / Jahan main aur dekhta 🔍** | [Unscripted: one addition or disagreement] |
| 32–40s | To camera | **Chhota sawaal? Jyotiq. Gehri baat? Acharya se vistaar.** (only if the consult path exists) | "AI jaldi disha deta hai. Bade faislon mein poori kundli ka vistaar se vichaar karein." (his own words if different) |
| 40–43s | End card | **Aap kya sochte ho? 👇** · *Link in bio* | — |

**Caption**

```
Humne AstroRaaga se jude ek Acharya ko Jyotiq ka jawab check karne diya — bina script ke. Kahan sehmat, kahan nahi — poora dekho.
(Demo kundli, details fictional. Acharya-ji AstroRaaga network se jude hain.)
Aap kya sochte ho — AI + Acharya? Comment karo.
#JyotiqSePucho #VedicAstrology #Jyotish #AIAstrology #Kundli
```

---

### 8.4 Concepts 11–30 (brief-ready)

Same production standards as 8.1. **Product-truth notes:**

- For any compatibility concept (4, 14), don't imply two-chart kundli milan unless the app takes the partner's birth details [CONFIRM].
- Concept 30 assumes you can ask about another person's chart [CONFIRM].

**11. "Astrology guidance chahiye… par shuru kahan se?" (remake of the 5,139 hit)**
- **Pillar / objective:** P1, conversion. **Audience / insight:** curious first-timers stall because they don't know how it works.
- **Hook:** the original line, on a lit phone-in-bed first frame.
- **Script:** "Shuru kahan se? 3 steps. Ek — birth details: date, time, jagah. Do — topic chuno: Love, Career, Wealth… Teen — apna sawaal likho. Bas. Pehla sawaal free."
- **Visual plan:** creator in bed (0–2s) → real birth form → tabs → typing → loading → end card.
- **Format:** 20s, numbered kinetic text. **Caption / CTA:** "Shuru kahan se? 3 steps… Pehla sawaal free — link in bio."
- **Jyotiq:** real birth form plus tabs. **Mode:** creator + screen recording.
- **Hypothesis / metric:** a remake of the best hook with a real walkthrough beats the account's link-tap median by ≥2×. Measure link taps per 1k.

**12. "Paison ki tension kab khatam hogi?" (remake of the 2,308 hit)**
- **Pillar / objective:** P1, conversion. **Audience / insight:** money stress is constant, and people want timing and reassurance, not stock tips.
- **Hook:** desk lamp, tea, generic payment notifications; "Paison ki tension kab khatam hogi? 😮‍💨"
- **Script:** "EMI, rent, kharche… aur ek hi sawaal." → Wealth tab → "When will my financial situation improve?" → highlighted lines → "Jyotiq timing aur disha dikhata hai — investment advice nahi."
- **Visual plan:** lit desk → notifications → UI → end card. **Format:** 22s; the disclaimer gets equal visual weight.
- **Caption / CTA:** "…Investment advice nahi, Jyotish guidance. Pehla sawaal free."
- **Jyotiq:** Wealth tab, demo kundli. **Mode:** faceless hands + male voiceover.
- **Hypothesis / metric:** money questions convert as well as marriage ones. Link taps per 1k vs Script 1.

**13. "Indian parents: Shaadi kab karoge?" (live-action remake of #56)**
- **Pillar / objective:** P2, reach. **Audience / insight:** the family-dinner interrogation everyone recognises.
- **Hook:** Papa mid-bite: "Beta, shaadi kab karoge?" plus "Har family dinner ka main course 😅"
- **Script:** Son: "Papa, abhi career…" Mom: "Career toh chalta rahega!" Son (aside): "Jo jawab mere paas nahi…" He opens Jyotiq under the table, Mom peeks: "Kya dekh raha hai?" — "Kundli, mummy." — "Achha! Mujhe bhi dikhana." (twist)
- **Visual plan:** 3 dinner-table shots plus a UI insert. **Format:** 22s, comic timing.
- **Caption / CTA:** "Us sibling ko bhejo jisse yahi poocha jaata hai 😅"
- **Jyotiq:** real Love tab insert. **Mode:** 2–3 actor family skit.
- **Hypothesis / metric:** sends per 1k ≥1.5× median; % non-follower reach.

**14. "Red flag ko green flag samajhne ki Olympics" (remake of #47)**
- **Pillar / objective:** P2, reach. **Audience / insight:** friends roasting each other's dating choices.
- **Hook:** Friend B waves a green flag: "Woh 3 din reply nahi karta… par busy hai na 🚩➡️✅" plus "Gold medal pakka 🥇"
- **Script:** A lists red flags, B reframes each one. A: "Ek kaam kar — Jyotiq se pooch." B taps "Is my current partner truly compatible with me long-term?", reads, and slowly lowers the green flag.
- **Visual plan:** 2-shot, flag props, UI insert. **Format:** 18–20s.
- **Caption / CTA:** "Bhejo us dost ko jo Olympics mein hai 🥇🚩"
- **Jyotiq:** real Love suggestion. **Mode:** 2 creators.
- **Hypothesis / metric:** sends per 1k.

**15. "Ex wapas aayega… ya move on karun?"**
- **Pillar / objective:** P1+P2, engagement. **Audience / insight:** heartbreak; this exact question is one of the app's own Love suggestions.
- **Hook:** a generic chat screen showing "last seen 1:12 AM" plus "Ex wapas aayega… ya move on karun? 💔"
- **Script:** gentle voiceover: "Har raat yahi sawaal…" → taps the suggestion → highlighted lines verbatim → "Jawab jo bhi ho — pehle apna khayal."
- **Visual plan:** faceless phone, soft light. **Format:** 20s, slow.
- **Caption / CTA:** "Kisi dost ko iski zarurat hai? Bhej do 🤍 Agar bahut pareshan ho, kisi apne ya counsellor se baat karo."
- **Jyotiq:** real suggestion. **Mode:** faceless.
- **Hypothesis / metric:** saves and comments per 1k; sentiment tracked so there's no exploitative tone.

**16. Lagna vs Rashi vs Sun sign in 20 seconds**
- **Pillar / objective:** P3, search and saves. **Audience / insight:** "Instagram pe Leo, kundli mein Kark?" confusion.
- **Hook:** "Instagram pe Leo, kundli mein Kark? 🤯"
- **Script:** "Sun sign: janam ke waqt Surya kahan tha. Chandra rashi: Chandrama kahan tha — Vedic rashifal isi se. Lagna: janam ke waqt purab mein uday hoti rashi — iske liye exact time chahiye. Aur Vedic Jyotish sidereal zodiac use karta hai, isliye Surya rashi bhi Western se alag aa sakti hai."
- **Visual plan:** presenter plus 3 icons → Kundali screen showing Chandra Rashi and Lagna. **Format:** 22s.
- **Caption / CTA:** keyword-rich ("Lagna kya hai, Chandra rashi kya hai…"); "Apni teeno dekho — link in bio."
- **Jyotiq:** Kundali [CONFIRM free]. **Mode:** presenter + graphics.
- **Hypothesis / metric:** saves per 1k; 28-day long tail.

**17. "Mahadasha kya hai? Aapki kaunsi chal rahi hai?"**
- **Pillar / objective:** P3 → Kundali. **Audience / insight:** "Rahu ki mahadasha chal rahi hai" is said like a diagnosis.
- **Hook:** "'Rahu ki mahadasha chal rahi hai' — matlab? ⏳"
- **Script:** "Vimshottari dasha 120 saal ka cycle hai: Ketu 7, Shukra 20, Surya 6, Chandra 10, Mangal 7, Rahu 18, Guru 16, Shani 19, Budh 17. Pehli dasha janam ke waqt Chandrama ke nakshatra se tay hoti hai; har mahadasha ke andar antardasha."
- **Visual plan:** presenter plus a timeline graphic → real dasha screen → question typed: "Is dasha mein career kaisa rahega?" **Format:** 30s.
- **Caption / CTA:** "Apni dasha dekho — link in bio."
- **Jyotiq:** Kundali dashas (verified feature). **Mode:** presenter.
- **Hypothesis / metric:** saves per 1k plus link taps.

**18. "Birth time nahi pata? 3 jagah dhoondo"**
- **Pillar / objective:** P3 utility; removes the #1 form blocker (birth time is required). **Audience / insight:** many users don't know their time.
- **Hook:** "Kundli banani hai par birth time nahi pata? 🕰️"
- **Script:** "1 — birth certificate ya hospital record. 2 — ghar ki janam patri, purani diary, family purohit. 3 — mummy-papa ya nani se 'kis waqt ke aas-paas'. Kyun zaroori? Lagna lagbhag har 2 ghante mein badalta hai — time jitna sahi, kundli utni sahi."
- **Visual plan:** presenter with props (a certificate, an old diary). **Format:** 22s.
- **Caption / CTA:** "Save karo, phir kundli banao — link in bio."
- **Jyotiq:** birth form. **Mode:** presenter.
- **Hypothesis / metric:** saves; birth-form completion rate (instrument it).

**19. "नया काम शुरू करना है? शुभ मुहूर्त कब?" (Hindi)**
- **Pillar / objective:** P1, conversion. **Audience / insight:** this is the app's #1 "most asked" prompt; Secondary A, Hindi-first.
- **Hook:** a diya and a new shop shutter half-raised; text in Devanagari.
- **Script (Hindi voiceover):** "दुकान, स्टार्टअप या नया प्रोजेक्ट — सही शुरुआत कब?" → real UI (Hindi interface) → "मेरे लिए नया बिज़नेस शुरू करने का शुभ मुहूर्त कब है?" → highlighted lines verbatim → "पहला सवाल फ्री, फिर ₹5।"
- **Visual plan:** lit diya first frame → UI → end card. **Format:** 22s, Hindi captions.
- **Caption / CTA:** Hindi caption plus disclaimer. **Jyotiq:** Hindi UI [CONFIRM Hindi answers]. **Mode:** faceless + male Hindi voiceover.
- **Hypothesis / metric:** Hindi link-tap rate vs Hinglish demos (the language test).

**20. "Shani gochar aur career — darr ke bina" (remake of the 1,012 Saturn post)**
- **Pillar / objective:** P3, reach and saves. **Audience / insight:** Saturn imagery stops thumbs, and fear surrounds Shani.
- **Hook:** a labelled AI Saturn illustration plus "Shani ka naam sunke darr? 🪐"
- **Script:** "Gochar = grahon ka abhi ka transit. Shani ek rashi mein lagbhag dhaai saal rehta hai — dheere chalta hai, isliye asar lamba lagta hai. Career pe asar aapke 10th ghar, dasha aur Shani ki janam-sthiti pe depend karta hai — sabke liye ek jaisa nahi."
- **Visual plan:** presenter over the visual → real transits screen → question. **Format:** 28s.
- **Caption / CTA:** "Apna sawaal: 'Shani ka gochar mere career pe kya asar daal raha hai?' — link in bio."
- **Jyotiq:** live transits (verified feature). **Mode:** presenter + labelled AI visual.
- **Hypothesis / metric:** saves per 1k.

**21. "Videsh jaane ka yog hai?"**
- **Pillar / objective:** P1, conversion. **Audience / insight:** study and work abroad is a huge aspiration for 20–30s; the Travel tab exists.
- **Hook:** a passport and visa form under a lamp: "Videsh jaane ka yog hai? ✈️"
- **Script:** "IELTS ho gaya, applications bhi… par mann mein ek sawaal." → Travel tab → "Do I have chances of settling abroad?" → highlighted lines → "Mehnat aapki, disha kundli se."
- **Visual plan:** lit desk → UI → end card. **Format:** 20s.
- **Caption / CTA:** "Pehla sawaal free — link in bio."
- **Jyotiq:** Travel tab. **Mode:** faceless.
- **Hypothesis / metric:** link taps per 1k; Travel-tab chat share.

**22. "POV: Best friend ki shaadi fix ho gayi… aur tum? 🙂"**
- **Pillar / objective:** P2, reach. **Audience / insight:** FOMO plus friendship, very forwardable.
- **Hook:** a generic group chat: "GUYS!!! Meri shaadi fix ho gayi 💍"
- **Script:** she types "Congratulations!!! 😍🎉", stares, then mom texts: "Dekha? Sabki ho rahi hai." She laughs and opens the Love tab: "When am I likely to meet my true soulmate or life partner?" Text: "Apna time bhi aayega… par kab? 👀"
- **Visual plan:** face lit by the phone → chat → UI. **Format:** 16s.
- **Caption / CTA:** "Us best friend ko bhejo jiski shaadi fix ho gayi 😭💍"
- **Jyotiq:** Love suggestion. **Mode:** creator.
- **Hypothesis / metric:** sends per 1k.

**23. "Comment karo apni Chandra rashi 👇"**
- **Pillar / objective:** P4, comments. **Audience / insight:** rashi identity plus Instagram's reply-with-Reel feature.
- **Hook:** "Har rashi ko ek reply Reel milega."
- **Script:** Ep 0 is a 10s ask. Then 12 reply Reels (8–10s each, Rashi Hafta template) answering commenters' rashis with a trait-based reflection plus "Poori kahani aapki kundli mein".
- **Visual plan:** template. **Format:** 10s ask plus 8–10s replies.
- **Caption / CTA:** "Rashi comment karo (aur kuch personal nahi)."
- **Jyotiq:** Kundali on the end card. **Mode:** template.
- **Hypothesis / metric:** comments per 1k on Ep 0; reply-Reel views per follower.

**24. "Kundli ke 12 ghar — 12 second mein 🏠"**
- **Pillar / objective:** P3, saves. **Audience / insight:** people hear "7th house" without knowing what it means.
- **Script (one per second):** 1 Swayam · 2 Dhan/parivaar · 3 Saahas/bhai-behen · 4 Ghar/maa · 5 Santaan/shiksha · 6 Swasthya/shatru/seva · 7 Vivaah/partnership · 8 Badlav/aayu · 9 Bhagya/dharm · 10 Karm/career · 11 Laabh · 12 Vyay/videsh. End: "Save karo — agli baar '7th house' suno toh samajh aayega."
- **Visual plan:** 12-tile motion graphic. **Format:** 15s, plus a carousel twin.
- **Caption / CTA:** keyword list plus "Apni kundli — link in bio." **Jyotiq:** end card. **Mode:** motion graphics.
- **Hypothesis / metric:** saves per 1k.

**25. "Sabke paas advice hai… 🙄" (remake of #46)**
- **Pillar / objective:** P2, reach. **Audience / insight:** contradictory advice from everyone.
- **Hook:** rapid cuts: "Shaadi kar lo!" "Abhi mat karo!" "Job chhod do!" "Pagal ho kya?"
- **Script:** one actor in four outfits (chacha, aunty, friend, colleague); the protagonist covers their ears; silence; types the General suggestion "What is the overarching theme or focus of my life right now?" Text: "Bas ek sensible jawab chahiye tha." → "Jyotiq se pucho."
- **Visual plan:** quick cuts → calm UI shot. **Format:** 16s.
- **Caption / CTA:** "Us dost ko bhejo jise sab advice dete hain 😅"
- **Jyotiq:** General suggestion. **Mode:** creator (multi-role).
- **Hypothesis / metric:** sends per 1k.

**26. "Jyotiq jawab kaise banata hai? 🔍"**
- **Pillar / objective:** P5, trust. **Audience / insight:** "AI kuch bhi bol deta hai" scepticism.
- **Script:** a product team member walks through birth details → chart calculation (Lagna, Chandra rashi, nakshatra, dashas, transits) → category → answer. **Describe only the real pipeline** [CONFIRM what can be shared]. End: "Isliye birth time zaroori hai."
- **Visual plan:** presenter plus screen recording. **Format:** 30–40s.
- **Caption / CTA:** "Sawaal? Comment karo — hum jawab denge."
- **Jyotiq:** Kundali plus chat. **Mode:** a real product person.
- **Hypothesis / metric:** profile visit → link tap; saves.

**27. "Pehla sawaal, pehla reaction 👀" (real users only)**
- **Pillar / objective:** P5, social proof. **Audience / insight:** The Pattern effect; genuine reactions persuade.
- **Script:** vox-pop at a college, café or office ("Ek sawaal free mein poochoge?"); the person asks their own question and reacts. Unscripted.
- **Visual plan:** handheld street interviews. **Format:** 20–30s.
- **Caption / CTA:** "Aap kya poochte? 👇"
- **Jyotiq:** their phone or your demo phone (never show their birth data). **Mode:** real people with a **written consent form**. If anyone is paid or given anything, disclose it (ASCI material connection).
- **Hypothesis / metric:** sends and link taps per 1k.

**28. "Rahu-Ketu: 'chhaya grah' ka asli matlab 🌗"**
- **Pillar / objective:** P3, saves. **Audience / insight:** Rahu and Ketu are feared and misunderstood.
- **Script:** "Rahu aur Ketu Chandrama ki kaksha ke do bindu hain — lunar nodes — isliye chhaya grah. Hamesha ek-doosre ke theek saamne, ulti disha mein chalte hain; ek rashi mein lagbhag 18 mahine. Parampara mein Rahu ichha aur bhatkav se, Ketu vairagya aur antardrishti se jude hain. Asar kundli mein sthiti pe depend karta hai."
- **Visual plan:** presenter plus an orbit graphic. **Format:** 28s.
- **Caption / CTA:** "Save karo — link in bio pe apni kundli."
- **Jyotiq:** Kundali. **Mode:** presenter.
- **Hypothesis / metric:** saves per 1k.

**29. "Is mahine India ne Jyotiq se kya poocha 📊"** (monthly data PR)
- **Pillar / objective:** P5, trust and PR. **Audience / insight:** Astrotalk's aggregated-data stories earn press.
- **Script:** an animated bar chart of category shares (Love, Career, Wealth…) plus the sample size, with **no personal data**. End: "Aapka sawaal kis category mein hai?"
- **Visual plan:** motion graphics. **Format:** 20s, plus a carousel and a press note.
- **Caption / CTA:** "Aapka sawaal? 👇"
- **Jyotiq:** brand end card. **Mode:** graphics.
- **Pre-requisites:** a privacy review and enough volume to aggregate meaningfully.
- **Hypothesis / metric:** shares per 1k; press pickups.

**30. "10वीं के बाद कौन सी स्ट्रीम? 🎓" (Hindi, parents; cross-post to Facebook Reels)**
- **Pillar / objective:** P1, conversion. **Audience / insight:** Secondary B; the Education tab.
- **Hook:** a parent looking at a Class-10 marksheet under a lamp.
- **Script (Hindi voiceover):** "साइंस, कॉमर्स या आर्ट्स…" → Education tab → "मेरे बच्चे के लिए कौन सी पढ़ाई की दिशा बेहतर रहेगी?" → highlighted lines → "फैसला बच्चे की रुचि और मेहनत से — Jyotiq बस एक दिशा देता है।"
- **Visual plan:** lit marksheet → UI → end card. **Format:** 22s.
- **Caption / CTA:** Hindi caption plus disclaimer. **Jyotiq:** Education tab [CONFIRM you can ask about another person's chart]. **Mode:** faceless + Hindi voiceover.
- **Hypothesis / metric:** link taps per 1k on Instagram vs Facebook.

---

## 9. AI UGC and creator marketing plan

### 9.1 Verdict: useful as a tool, risky as a face

| | Real human creators | AI UGC / avatar (labelled) | Faceless (screen + text + voiceover) |
|---|---|---|---|
| Cost per Reel | ₹2,000–8,000 for nano, ₹10,000–75,000 for micro ([Tring estimates](https://www.tring.co.in/brands/blogs/influencer-marketing-cost-in-india-list)) [ESTIMATE] | Roughly ₹300–1,000 in tool credits plus editing time [ESTIMATE] | Editing time only |
| Speed | Days | Hours | Hours |
| Trust in a trust-based category | Highest | Lowest. Viewers already doubt AI astrology, and an AI *person* doubles that | Medium, if it shows the real product |
| Platform and legal risk | Disclosure (ASCI) | AI labels (Instagram), synthetic-content rules (MeitY), virtual-influencer disclosure (ASCI). Unlabelled AI people can lose recommendations | Low |
| Best for | First-person skits, reactions, explainers with a face | Labelled fictional skits, b-roll, cosmic visuals, mascot animation, quick script tests | Product demos, pricing, Rashi lists |
| Never for | Fake testimonials | **Testimonials, "my experience" stories, anything that could pass as a real customer** | — |

Recommendation:

- Use **real humans for faces and voice**.
- Use **AI for visuals and speed**.
- Run one small, labelled AI-avatar test, so the decision rests on data rather than preference.

### 9.2 The compliance rules (as of 13 Oct 2026)

- **Instagram:**
  - "AI info" labels are applied when AI is detected or when the creator discloses it ([Meta](https://transparency.meta.com/governance/tracking-impact/labeling-ai-content)).
  - Since 31 Aug 2026 there is also an **"AI generated profile"** label for profiles featuring AI-generated people. Unlabelled profiles it detects can become non-recommendable to non-followers ([Mondaq, 12 Oct 2026](https://www.mondaq.com/india/social-media/1853738/instagrams-2026-ai-labelling-rules)).
- **India, IT Rules (synthetic information):** in force since 20 Feb 2026. They cover audio and video made to look real. Large platforms must collect user declarations and label synthetic content ([Lexology](https://www.lexology.com/library/detail.aspx?g=3e894ffc-4e0b-4487-a5e9-015d490d45d3)). **Practical rule:** tick Instagram's AI disclosure for every Reel with realistic AI people or voices.
- **ASCI:**
  - Influencer guideline 1.4: *"A virtual influencer must additionally disclose to consumers that they are not interacting with a real human being… upfront and prominent."*
  - Guideline 1.2: a disclosure in the bio, at the end of a video or behind "more" doesn't count.
  - ASCI's new AI-labelling guidelines for ads (published Sep 2026, effective about three months later) require labels when synthetic content could materially influence consumers, e.g. virtual influencers, voice replication and synthetic product demos ([ET, Oct 2026](https://economictimes.com/industry/services/advertising/asci-issues-ai-labelling-guidelines-for-ads-rules-to-take-effect-in-three-months/articleshow/134642226.cms)).
- **CCPA 2022 guidelines:** endorsements must reflect genuine opinion and experience ([Khaitan summary](https://khaitanco.com/sites/default/files/2022-06/Ergo_11062022.pdf)). An AI actor saying "Jyotiq ne meri life badal di" is a fabricated endorsement. **Never.**

**House rules:**

1. Every realistic AI character carries Instagram's AI label plus on-screen text, "AI-generated character", in the first 3 seconds.
2. AI characters appear only in clearly fictional skits ("Ek kahani…"), never as customers.
3. No cloned real voices or faces without written consent.
4. Product screens are always real recordings, never generated.

### 9.3 Personas to test

| Persona | Age / look | Voice and language | Personality and delivery | Content | Human or AI |
|---|---|---|---|---|---|
| **Riya**, the honest overthinker | 25; Noida/Delhi working woman; kurta-and-jeans or office casual; natural makeup | Hinglish, North Indian, quick, expressive | Funny, self-aware, warm; breaks the fourth wall | Shaadi Kab?, 2 AM Thoughts, situationship skits | **Human creator** first. AI version only in the A/B test, labelled |
| **Arjun**, the practical hustler | 29; Indore/Jaipur; shirt, small-business or corporate setting | Hindi-first Hinglish, calm and earnest | Practical, a little dry humour | Career, money, muhurat demos | Human (team member or creator); voiceover for faceless demos |
| **Didi**, the calm explainer | 32–38; saree or kurta; home altar or bookshelf; natural window light | Clear Hindi/Hinglish, slow and kind | A teacher, never scary; "darr nahi, samajh" | Jyotish in 30s, myth/fact, Acharya-adjacent | **A real person**, ideally an AstroRaaga Acharya or a team member with Jyotish knowledge |
| **Jyoti**, the mascot | The brain-diya logo, animated | Playful voiceover (team) | Cheeky but kind | Stories, "what Jyotiq won't do", reactions | Animation (not a realistic human, so no deepfake issue). Still disclose that it's a character |

**Language: when to use what**

| Language | Use for | Why |
|---|---|---|
| **Hinglish, Roman script** (default) | Primary 22–32 skits and demos | How this audience texts and talks. Your best covers were Hinglish and English |
| **Hindi, Devanagari** | Explainers for Secondary A/B, festival utility, muhurat, education for parents, Facebook cross-posts | Tier-2/3 and 30+ audiences; Astroyogi's vernacular push points the same way |
| **English** | A/B arm, NRI-leaning content (Travel) | A test, not the default |
| **Marathi / Gujarati / Punjabi / Bengali** | Phase 3 tests only, *after* confirming answers come back in those languages | The interface already has these translations |

### 9.4 A fair test: human vs AI avatar vs faceless

- **Design:** take 3 scripts (Script 2, a Shaadi Kab? skit; Script 3, the Sade Sati explainer; Script 1, the demo). Make each in 3 modes:
  1. a real creator;
  2. a labelled AI avatar (HeyGen avatar, or a Higgsfield character with Soul ID);
  3. faceless (screen recording, text and voiceover).

  That's **9 Reels**.
- **Control:** keep everything else identical: script, length (±1s), cover template, caption, hashtags, audio bed and CTA.
- **Distribution:** post all 9 as **Trial Reels** (non-followers only, so your followers don't skew results), at the same weekday and time slot, across 3 weeks. One script per week, all three modes in the same week, 90 minutes apart.
- **Read at 72 hours (Trial Reel window) and 7 days:** skip rate, average watch time ÷ length, sends per 1k, saves per 1k, profile visits per 1k, comment sentiment (count comments that say or imply "fake", "AI", "cringe").
- **Decision rule:**
  - If the AI avatar is **≥ the human version on skip rate and sends** across at least 2 of the 3 scripts, *and* draws no clear negative-sentiment signal, allow AI avatars for explainers and Trial Reel hook tests.
  - Otherwise, keep humans for faces and use AI only for visuals.
  - With samples this small, treat any gap under ~25% as a tie [ESTIMATE].

### 9.5 Tools, workflow and costs

| Tool | Use | Current price | ≈ ₹ / month (assumes ₹88 per US$; check today's rate) |
|---|---|---|---|
| **Edits** (Meta) / CapCut | Edit, captions, templates | Free | ₹0 |
| **Higgsfield** Plus | Soul ID characters, image-to-video (Kling, Seedance, Veo), cosmic b-roll | $59/mo monthly, $47/mo annual, 1,200 credits; credits expire monthly ([Kive, Aug 2026](https://kive.ai/learn/is-higgsfield-worth-it)) | ≈ ₹5,200 |
| **HeyGen** Creator | Talking-avatar test | $29/mo, 600 credits; photoreal Avatar IV ≈ 20 credits/min, so about 30 minutes/month ([HeyGen FAQ](https://www.heygen.com/faq); [eesel](https://www.eesel.ai/blog/heygen-pricing)) | ≈ ₹2,550 |
| Arcads (optional, skip in the pilot) | Library AI actors for ad-style UGC | About $110/mo for ~10 videos ([eesel](https://www.eesel.ai/blog/arcads-ai-pricing)) | ≈ ₹9,700 |
| Voice | Team voiceover on a phone with a lapel mic (₹1,000–2,000 one-off) | — | ₹0 recurring |

**AI production workflow** (for labelled skits and b-roll):

1. **Build the character.** Create the character once in Soul with a **Soul ID**, and reuse it in every clip so the face stays consistent. Lock rooms and props with reference elements.
2. **Generate shots.** Make each start frame as a photoreal 9:16 still, then run image-to-video:
   - low motion intensity (about 1–3 of 10);
   - **"Enhance prompt" OFF**: it's the main source of the cheesy "AI motivational" look;
   - generate 5 seconds and keep the steady middle 2 (drop the first ~8 frames);
   - once a take works, lock the seed;
   - budget 4–6 generations per shot, and choose on stillness, not prettiness.
3. **Route by shot type.** Talking faces: Seedance. Motion and vertical: Kling. B-roll: Veo or Sora.
4. **Finish.** Do dialogue in a lip-sync tool. Upscale as the very last step. Export 1080×1920 at 30 fps, never 60 and no frame interpolation. Keep room tone.
5. **Avoid the AI tells:** perfect studio lighting, symmetrical faces, unmotivated push-ins, characters who never blink.
6. **Never let the model render text.** Burn captions in by hand.

**Repurposing:**

- Every master Reel becomes a YouTube Short (same file), a Facebook Reel (especially Hindi explainers), a 3–5 slide carousel (Rashi Hafta, 12 houses, Mahadasha), and 1–2 Story frames with a link sticker.
- Save every winning script into the script bank with its metrics.

### 9.6 Real-creator programme

**Creator categories to look into** (nano 1k–10k, micro 10k–80k, India audience ≥80%, 18–34):

1. Hinglish relationship and situationship skit creators.
2. Corporate and office-life humour (Gurugram, Noida, Bengaluru, Pune).
3. Desi family comedy (parents vs kids, "shaadi kab").
4. Working-women lifestyle creators who talk openly about marriage pressure.
5. Wedding planners and bridal creators (muhurat and marriage-timing tie-ins).
6. Calm Jyotish or cultural explainers who **don't** sell totke, fear or gemstones.

**Why no names yet:** I couldn't verify any specific micro-creator on Instagram (login wall), so I'm not naming any.

- Third-party data shows the biggest Indian astrology accounts carry an estimated 17–27% fake followers and lean on remedies and WhatsApp-consult funnels ([Modash, Sep 2026](https://www.modash.io/find-influencers/india/astrology)).
- That's exactly why vetting matters more than size.
- As a *format* reference only (not a collaboration pick): Modash shows @jayanthnag ("Modern Pandit") with ritual-meaning wedding explainers averaging about 75k plays. Verify before contacting.

**How to find them:**

- Instagram search for keyword Reels: "shaadi kab karoge", "situationship", "office life", "sade sati".
- Look at the "Suggested for you" chains on profiles that fit.
- Use Instagram's creator marketplace if available to you, or a discovery tool's free tier.

**Vetting checklist** (ask for Insights screenshots):

- India audience ≥80% and age 18–34 ≥60%.
- Median views of the last 12 Reels, not the top ones.
- Comments that are real conversation rather than emoji spam.
- No totke, black-magic or fear content.
- No "100% accurate" or "guaranteed" claims.
- Past paid posts properly labelled.
- Willing to use Instagram's Paid Partnership label and an upfront "#ad".

**Collaboration formats:**

- **Collab post** (co-authored, appears on both grids). Default.
- **Recurring series face.** A creator *owns* "Shaadi Kab?" for a month (4 episodes on retainer, the Cal AI lesson scaled down).
- **"Creator asks their real question".** Only if it really is their question and their experience. Disclose that it's paid, and never script an outcome.
- **Partnership-ad permission** for later paid use of winning posts.

**Budget and rates [ESTIMATE]:**

- Pilot: 3 nano creators at ₹3,000–8,000 per Reel, so ₹9,000–24,000 for 3 Reels.
- Retain the best one for 4 Reels a month: ₹12,000–30,000.
- Give each creator a unique UTM link so chats can be attributed.

**30-day pilot budget [ESTIMATE]:**

| Item | ₹ |
|---|---|
| Higgsfield Plus + HeyGen Creator | ≈ 7,750 |
| 3 nano-creator Reels | 9,000–24,000 |
| Props and lapel mic | 2,000–3,000 |
| **Total cash** (excludes team time and editor salary) | **≈ 19,000–35,000** |

---

## 10. Organic distribution and conversion system

### 10.1 Profile, rewritten

- **Name field:** `Jyotiq • Kundli Chat`. Alternative: `Jyotiq | Vedic Astrology Chat`.
- **Bio** (about 125 characters):
  ```
  Apna sawaal pucho, kundli se jawab 🔥
  Shaadi • Love • Career • Paisa
  Pehla sawaal FREE, phir ₹5/sawaal
  👇 Web pe chat — download zaroori nahi
  ```
  English variant to test later: "Ask any life question. Get a Vedic answer from your own chart. 1st question free, then ₹5."
- **Links:**
  1. Production web chat: `https://jyotiq.astroraag.com/chat?utm_source=instagram&utm_medium=bio&utm_campaign=profile`
  2. Android app (Play)
  3. iOS app [CONFIRM it's live]
  4. Plans page ("Pricing, saaf-saaf")
- **Highlights:** How it works · ₹5 Pricing · Real answers (Script 1 cut-downs) · Privacy (what you store and why, [CONFIRM]) · FAQ (birth time, follow-ups, languages) · Feedback (keep).
- **Pinned Reels:**
  1. The existing 9:16 Jyotiq Reel as "How it works".
  2. "₹5 Ka Sawaal: Shaadi kab hogi?"
  3. Your best skit once you have one.

### 10.2 Getting found: search, captions, hashtags, covers

**Keyword map.** Put the keyword in four places: the first line of on-screen text, the first line of the caption, the alt text, and spoken out loud in the voiceover.

| Topic | Hinglish / Hindi | English |
|---|---|---|
| Marriage | shaadi kab hogi, love marriage yog, kundli milan, शादी कब होगी | when will I get married, marriage astrology |
| Relationship | ex wapas aayega, partner compatibility, situationship | ex coming back astrology, compatibility |
| Career | job change kab, career astrology in hindi, naukri yog | career change astrology |
| Money | paisa kab aayega, dhan yog | financial astrology |
| Concepts | sade sati kya hai, manglik dosha, mahadasha, rahu ketu, lagna kya hai, chandra rashi | vedic astrology explained |
| Utility | shubh muhurat, birth time kaise pata kare | auspicious time |

**Caption formula:**

1. A first line that states the keyword as a question.
2. Two lines of value.
3. The CTA.
4. The disclaimer.
5. At most 5 hashtags: #JyotiqSePucho + series tag + 2–3 topic tags.

**Covers:**

- Series band and colour.
- A 3–6 word question in Playfair Display, in the central 1080×1440, middle third.
- **No download badges and no prices on covers.**

### 10.3 Community engagement playbook

- **First 60 minutes after posting:** reply to every comment. Pin the best question. Share the Reel to Stories with a link sticker (UTM `utm_medium=story&utm_content=<reel-id>`).
- **Reply with Reels** to the best comment questions, anonymised, never with personal data. That's your comment → episode loop.
- **DMs:** saved replies for "price?", "kaise use karein?" and "birth time nahi pata". Each gives the direct web-chat link with UTM `utm_medium=dm`.
  - Comment-keyword automations ("Comment KUNDLI for the link") through Meta-approved tools are fine **sparingly**: one keyword per month, and the DM must deliver what was promised.
  - Never ask people to post birth details in comments.
- **Story week:**

  | Day | Story content |
  |---|---|
  | Mon | Rashi poll |
  | Tue | "Aaj ka sawaal" question box |
  | Wed | Behind the scenes |
  | Thu | This-or-that polls (Love vs Career) |
  | Fri | Answers to the best questions + link sticker |
  | Sat | 2 AM Thoughts teaser |
  | Sun | Quiet utility (panchang-style tip, verified by the reviewer) |

- **Collaborations:**
  - Collab posts with creators.
  - Cross-promotion with AstroRaaga's own accounts. Karmeq Acharyas can feature in "Acharya Checks".
  - From Phase 2, one reciprocal Collab per month with a non-competing creator (weddings, office humour).
- **Cross-posting:** YouTube Shorts and Facebook Reels from day 1 (same files; Hindi explainers on Facebook for Secondary B).

### 10.4 The customer journey and how to remove friction

| Stage | What they need | Current friction [VERIFIED] | Fix | Metric |
|---|---|---|---|---|
| **Reel** | A question they recognise within 1 second | Text-less or poster covers; claims instead of value | Inner-question hooks; real answers on screen | Skip rate; sends per 1k |
| **Profile visit** | "What is this, what does it cost, what do I tap?" | Bio cut off; nothing explains pricing; only a Feedback highlight | New bio, pinned 3, highlights | Profile visits per 1k; link taps ÷ profile visits |
| **Website / chat** | Start without an install | Bio link goes to Play Store only | Link 1 = web chat (Love tab if deep links work [CONFIRM]) | Link taps → chat starts |
| **First meaningful interaction** (define it as: *user receives an answer to their own question, not just a suggestion, and stays 20+ seconds or asks a follow-up*) | A frictionless form; a specific, non-generic answer | Jargon location modal; birth time required; guest free-Flame rule unclear [CONFIRM]; unclear follow-up cost | Plain copy; a birth-time helper (Concept 18); state the follow-up rule up front; QA answer quality weekly | Chat start → answer received → 20s+ dwell |
| **Repeat usage** | A reason to come back | No owned channel; nothing pulls people back | Series cadence; a WhatsApp channel test in Phase 3; "ask a follow-up for ₹5" prompt [product] | % who ask a 2nd question within 7 days |
| **Paid Flames** | Trust that ₹5 is fair and nothing is hidden | Pack copy errors; "never expire" vs 365 days; Enterprise pack confusion | Fix the copy; a 3-pack consumer ladder (₹5 / ₹95 / ₹248); move Enterprise off the consumer screen | Chat start → purchase; repeat purchase |

*"The first consultation is marketing. The second one is a business."* That's InstaAstro's investor, quoted in [NIE, Sep 2026](https://www.newindianexpress.com/business/2026/Sep/29/divine-intervention-astrology-platforms-draw-big-money). Treat the second question as the North Star behind the vanity metrics.

### 10.5 CTA library

**Use:**

- "Pehla sawaal free — link in bio."
- "Us dost ko bhejo jo…"
- "Save karo, kaam aayega."
- "Apna sawaal comment karo (naam/details mat likhna) — agla episode usi pe."
- "Myth ya Fact? Comment karo."
- "Apni Chandra rashi dekho — link in bio."

**Avoid:**

- "Comment YES for blessings" and "Share to 5 people or…" (engagement bait or fear chains).
- "Offer ends tonight" when it doesn't (false urgency is a listed dark pattern).
- "100% accurate", "guaranteed", "life badal degi".
- Fake testimonials or fake "users online" counters.
- Hashtag stuffing (capped at 5 anyway).
- Buying followers or engagement pods.

---

## 11. Measurement framework

### 11.1 Weekly dashboard (one row per Reel, plus a weekly total)

| Metric | Definition | Source | What it tells you |
|---|---|---|---|
| Reach; **% non-follower reach** | Accounts reached; share who don't follow you | Insights | Whether Instagram is testing you beyond your 208 followers |
| **Skip rate** | % of viewers who swipe away in the first 3 seconds | Insights (Reels) | Hook strength (lower is better) |
| **Hold** | Average watch time ÷ Reel length | Insights | Whether the middle earns the end |
| **Sends per 1k** | Shares ÷ reach × 1,000 | Insights | Forwardability. The strongest non-follower signal |
| Saves per 1k | Saves ÷ reach × 1,000 | Insights | Utility (explainers, rashi lists) |
| Comments per 1k; likes per 1k | ÷ reach × 1,000 | Insights | Conversation; approval (likes per reach is a named signal) |
| Follows per 1k | Follows from the Reel ÷ reach × 1,000 | Insights | Series pull |
| Profile visits per 1k | ÷ reach × 1,000 | Insights | Curiosity created |
| **Link taps ÷ profile visits** | External link taps ÷ profile visits | Insights (profile) | Whether the profile converts |
| Chat starts | First question submitted from Instagram UTMs | GA4 | Landing works |
| First answers | Answer delivered ÷ chat starts | GA4 / backend | Product delivers |
| **Second question within 7 days** | Users asking a 2nd question ÷ first answers | Backend | Early retention: your North Star |
| Purchases; conversion | Purchasers ÷ chat starts; revenue per chat start | GA4 purchase event (exists) / Razorpay | Monetisation |
| Cost per purchaser (organic) | Production cash ÷ attributed purchasers | Sheet | Efficiency, and the baseline for paid |

### 11.2 Instrumentation (week 1)

- **GA4:**
  - Your bundle already sends `wallet_opened`, `package_selected`, `begin_checkout` and `purchase` [VERIFIED].
  - Add or confirm `question_submitted` (chat start), `answer_received`, `signup_completed`, `birth_details_saved` and `second_question`.
  - Give UAT its own GA4 property (today both sites load the production one).
- **UTM convention:** `utm_source=instagram`, `utm_medium=bio|story|dm|creator`, `utm_campaign=<series>`, `utm_content=<reel-id or creator>`.
- **One optional question after the first answer:** "Aapne Jyotiq ke baare mein kahan suna?" (Instagram Reel / Story / friend / Play Store / other). It catches dark social, the WhatsApp forwards UTMs miss.
- **Weekly export:** Insights per Reel at **72 hours** and **7 days**, pasted into the sheet. Flag boosted posts and keep them out of benchmarks.

### 11.3 Comparing Reels fairly

1. **Compare rates, not counts:** per 1k reach, and hold as % of length.
2. **Compare at the same age:** 72 hours and 7 days.
3. **Benchmark against your own trailing median** (last 10 non-boosted Reels), per metric. Never against other accounts.
4. **Compare within a format first** (skit vs skit), then across formats on downstream metrics (link taps, chat starts).
5. **Mind small numbers.** At about 125 views, one share is 0.8% of views. Judge a *format* after at least 3 posts. Single posts are anecdotes. Trial Reels give cleaner non-follower samples.
6. **Separate follower and non-follower reach** when reading likes and comments. Followers inflate them.

### 11.4 Decision rules

| Decision | Rule |
|---|---|
| **Repeat / double down** | ≥2 of the 3 core rates (skip rate, sends per 1k, link taps per 1k) beat the trailing median by ≥30% across ≥3 executions |
| **Improve the hook** | Downstream is good (link taps, saves) but skip rate is worse than median. Test 3 new openings via Trial Reels |
| **Improve the ending / CTA** | Skip rate and hold are good, but link taps and follows are weak. Change the end card, CTA or caption |
| **Discontinue** | Below median on all three core rates after 3–4 executions, or a clear negative-sentiment pattern |
| **Ready for paid** | 2+ formats meet "Repeat"; chat start → purchase measured on at least ~100 Instagram-attributed chat starts [ESTIMATE threshold]; you know your affordable CAC (below) |

**Affordable-CAC worked example** (made-up numbers, to show the method, not a forecast):

- Suppose 6 of 100 Instagram chat starters buy within 30 days. That's 6 ÷ 100 = 6%.
- Suppose each buyer spends ₹130 on average in that period.
- Revenue per chat start = 6% × ₹130 = ₹7.80.
- If you accept spending up to 50% of 30-day revenue on acquisition, the maximum cost per chat start is ₹7.80 × 50% = ₹3.90.
- Replace these with your measured numbers before any ad goes live.

### 11.5 Testing framework

| What to test | How | Variants | Run for | Decide on |
|---|---|---|---|---|
| **Hooks** (first frame and first line) | Trial Reels, identical body | 3 per concept | 72 hours each; ≥3 concepts | Skip rate, hold |
| **Length** | Same concept cut to 15s / 25s / 40s | 3 | 2 weeks, 3 concepts | Hold, sends per 1k |
| **Production mode** | Section 9.4 | 3 | 3 weeks | Skip rate, sends, sentiment |
| **Language** | Hinglish vs Hindi vs English (same visuals; voiceover and captions swapped) | 3 | 3 weeks, 3 concepts | Skip rate, link taps |
| **CTA** | "Link in bio" vs "comment keyword → DM" vs "save/send" | 3 | 4 executions each | Link taps, chat starts |
| **Creator style** | Creator A vs B vs team, same brief | 2–3 | 1 episode each, then the best 2 for 2 more | Sends, link taps |
| **Price framing** | "Pehla sawaal free" vs "₹5, koi meter nahi" vs "20 sawaal ₹95" | 3 | 4 executions each | Chat start → purchase (UTM cohort) |
| **Landing** | Bio link: web chat (Love) vs web chat (General) vs Play | 2–3 | 2 weeks each | Link taps → chat starts → first answers |

**Rules:**

- Change one variable at a time.
- At least 3 executions per arm.
- Work in 2-week sprints.
- Log every test in a sheet (hypothesis, variable, result, decision) so winners become templates.

**Weekly 30-minute review:**

1. Update the sheet.
2. Name the top 2 and bottom 2 Reels and why.
3. Make one decision per series (repeat, improve or stop).
4. Pick next week's 2 tests.

---

## 12. The first seven days, in execution order

**Day 1: stop the leaks**

1. Change bio link 1 to the production web chat with UTM. Add Play (and App Store, if live) as links 2 and 3.
2. Rewrite the name field and bio (Section 10.1).
3. Pin the existing 9:16 Jyotiq Reel as "How it works".
4. Open **Account Status** and check recommendation eligibility. Note any AI labels on posts or on the profile.
5. Archive "Client Testimonials" unless you can prove it's real and consented. Archive "Instagram Guru vs JYOTIQ".
6. Pause every queued poster, download-badge or claim Reel.

**Day 2: product truth (send to the product team)**

7. Reconcile "Purchased Flames never expire!" with `validityDays: 365`.
   - Fix the bonus-% copy (Popular is 20%, Enterprise 12.5%).
   - Take the Enterprise Pack off the consumer screen, or reprice it so it isn't worse value than Popular.
8. Fix the Play typo ("ruled-based"), lengthen the store description, and replace the personal support email with a role address.
9. Add OG/meta tags; give UAT its own GA4 property.
10. Answer the Appendix A confirmations. These four block scripts: guest free Flame, follow-up cost, Hindi answers, whether Kundali is free.

**Day 3: measurement**

11. Export 30 days of Insights per Reel, flag boosted posts, and compute trailing medians.
12. Build the dashboard sheet (Section 11.1) and the UTM convention. Verify on production that `question_submitted`, `answer_received` and `purchase` fire.
13. Create the "How it works", "₹5 Pricing" and "FAQ" highlights from real screens.

**Day 4: production prep**

14. Build the series cover and caption templates (Playfair Display + Plus Jakarta Sans, midnight and diya gold, safe areas).
15. Create a demo-kundli profile (fictional details). QA 20 real answers across the 8 categories for quality and fear language. This blocks Scripts 1, 6 and 8.
16. Lock Scripts 1, 2, 3 and 5 plus 2 hook variants each for Scripts 1 and 2. The Jyotish reviewer signs off Script 3.

**Day 5: batch shoot and edit**

17. Screen-record Scripts 1 and 6. Shoot Script 2 (creator or team), Script 3 (presenter) and Script 5 (faceless).
18. Edit Scripts 1 and 2 plus their Trial Reel variants.

**Day 6: publish**

19. Post Script 1 at about 12:30–2:00 PM. Post its 2 hook variants as Trial Reels.
20. Story: "Aaj ka sawaal" question sticker plus a link sticker. Reply to every comment within 60 minutes.
21. Post Script 5 (2 AM Thoughts, Ep 1) at 9:30–10:30 PM.

**Day 7: creators and the first read**

22. Shortlist 10 creators (Section 9.6), brief 5, and aim to book 3 for weeks 2–3 with UTM links and Paid Partnership labels.
23. First 30-minute review: the 24–48 hour reads on everything posted (skip rate, sends per 1k, link taps). Log them and lock week 2:
    - Script 9 (carousel) first;
    - then Script 2, Script 3 and Script 6;
    - Script 5 Ep 2 on the weekend.

---

## Final prioritised action plan

### What Jyotiq should start doing immediately

1. **Send Instagram traffic to the web chat, not the Play Store**, and track it with UTMs.
2. **Show the real answer.** "₹5 Ka Sawaal" screen-recorded demos with demo kundlis, never mock-ups.
3. **Launch recognisable series:** Shaadi Kab?, Jyotish in 30 Seconds, 2 AM Thoughts and Rashi Hafta, each with fixed templates.
4. **Put real faces on the brand:** a creator for skits, an Acharya or "Didi" for explainers, the team for pricing.
5. **Test hooks on non-followers with Trial Reels** (you just crossed the 200-follower threshold).
6. **Explain pricing plainly:** free first question, then ₹5 a question, no meter. Do this *after* fixing the contradictions.
7. **Label every realistic AI person** (Instagram AI disclosure plus on-screen text), and disclose every paid creator upfront.
8. **Measure the second question**, not just views.

### What Jyotiq should stop doing or avoid

1. Download badges, price stickers and "Flame" jargon on covers.
2. "Not an ordinary AI app" and "Think again" claims (your lowest performers, median 42).
3. Anti-guru or anti-astrologer comparisons.
4. Generic festival greeting cards and AI deity art. Keep festivals only as utility.
5. Mock-up phone screens and generic "daily horoscope" visuals that contradict the "not sun-sign content" promise.
6. Unlabelled AI people, AI "testimonials", and anything framed as a real customer when it isn't.
7. Accuracy percentages, guarantees, fear language, and false urgency ("launch offer ends tonight" when it doesn't).
8. "Purchased Flames never expire" until it matches the 365-day validity in the system.

### What to test first, before spending on paid marketing

1. **Hook style:** inner question vs POV vs myth/fact (Trial Reels, skip rate).
2. **Product-demo vs skit** on downstream conversion: link taps → chat starts.
3. **Production mode:** human creator vs labelled AI avatar vs faceless (Section 9.4).
4. **Language:** Hinglish vs Hindi on skip rate and link taps.
5. **Price framing:** free-first vs ₹5-no-meter vs pack, on chat start → purchase.
6. **Landing:** web chat vs Play Store on chats per link tap.
7. **Product side:** first-answer quality and the follow-up rule vs the second-question rate. If people don't come back after the first answer, no content strategy fixes that.

**Paid gate:** start a small paid test only after 2+ formats pass the "Repeat" rule *and* you have a measured chat start → purchase rate on Instagram traffic. Then put money behind the proven creatives (with partnership-ad permission), not new ones.

---

## Appendix A: confirm before these claims or scripts go live

| # | Question | Blocks |
|---|---|---|
| 1 | Do guests get the free Flame, or only signed-up users? | Bio, all "pehla sawaal free" CTAs |
| 2 | Does a follow-up or clarifying message cost a Flame? | Script 7, journey copy |
| 3 | Do answers come back in Hindi and the other UI languages? | Hindi concepts 19 and 30, positioning line |
| 4 | Is the iOS app live? | Bio links |
| 5 | Never expire vs 365-day validity: which is true? | All pricing content |
| 6 | Bonus % copy and the Enterprise Pack fix | Script 7 |
| 7 | Is Kundali (Chandra Rashi, Lagna, dashas) free to view? | Scripts 3 and 9, Concepts 16 and 17 |
| 8 | Do answers name the chart factors (houses, dasha, transits)? | Scripts 1 and 6 voiceover |
| 9 | Do any answers use fear language or push remedies? | Script 8 |
| 10 | Which past Reels were boosted? Who appears in the Reels (AI or real)? | The audit's baselines |
| 11 | Is "Client Testimonials" real and consented? | Keep or archive |
| 12 | Can an AstroRaaga Acharya appear (and is the "deeper guidance" handoff live)? | Script 10, positioning |
| 13 | Can users ask about another person's chart, or enter partner details? | Concepts 4, 14 and 30 |
| 14 | What is stored about users and their birth details? Is a "privacy" claim supportable? | Privacy highlight |
| 15 | Does the chat accept deep links to a tab or category (e.g. Love)? | Landing tests |
