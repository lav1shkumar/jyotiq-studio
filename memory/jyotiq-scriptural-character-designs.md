---
name: jyotiq-scriptural-character-designs
description: "Since 11 Nov 2026 Jyotiq deity/Ramayana characters follow Valmiki text, not TV-serial look; Ayush makes avatars on his own image subscription, no GCP spend"
metadata:
  node_type: memory
  type: project
  originSessionId: 29d14b0c-febb-47ca-92c4-c9eaf88ec8e3
  modified: 2026-11-11T07:33:31.134Z
---

On the 10 Nov 2026 call, founder Amit Kaushik asked for Jyotiq's own reusable character designs (Ram, Sita, Krishna, Shiv, etc.) built from what the scriptures describe, not from TV serials (Ramanand Sagar, @theepictalesindia). He also wants a recognisable "Jyotiq" look, with the logo and brand at the start and end of every reel. This replaces the Kilavde6 TV-serial look in [[jyotiq-ram-rajyabhishek-reel]].

The research is done: a character bible and cast prompts made on 11 Nov in a session scratch folder (jyotiq-ramayana-character-bible.md and jyotiq-cast-prompts.md).

Key rules from Valmiki:
- Ram has dark śyāma skin and is never blue. He is 25 at the exile. Long arms, broad shoulders.
- Sita has golden skin and wears yellow silk (pīta kauśeya). She is 18 at the exile.
- In exile scenes Ram is never shown without Sita and Lakshman.
- Kaikeyi is a calm, oath-binding queen, never a screaming one.
- Lighting is flame, sun, moon and gem-glow only ("Jyotiq light").

**Why:** the founder wants brand distinctness. Ayush said 11 Nov: "I will make them from my own subscription, don't charge GCP".

**How to apply:** for character avatars, give Ayush prompts. Don't generate images on Vertex or Veo unless he asks for it explicitly ([[veo-vertex-route]]). Tag what comes from Valmiki and what comes from a later tradition (Tulsidas, folk). Ask for the Gita Press Valmiki Ramayana when a verse needs confirming.

**Reel opening (11 Nov 2026):** a 5 s "Jyotiq light" open, `JyotiqReelOpen` in `video/src/Jyotiq/brandopen/ReelOpen.tsx`, final in `workspace/jyotiq-brand-open/final/`.
- Motes of light gather over the Ayodhya ghat, the diya flame lights the logo, then the logo shrinks into the BrandBug as the first shot begins.
- The sonic logo is synthesized for free (`video/scripts/brandopen_sonic.py`).
- Ayush made his own Ayodhya, Lanka and cast images in another tool; they are in `jyotiq-brand-open/ref/`. Use them as Veo first frames instead of generating new visuals. He later allowed paid Veo for this.
