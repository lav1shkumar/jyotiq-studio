---
name: jyotiq-father-trail-reel
description: "English global Jyotiq reel \"The Father Who Marked the Trail\" (Japanese folktale, ink-wash Veo style) built 2026-11-08 in workspace/father-trail"
metadata:
  node_type: memory
  type: project
  originSessionId: 31bc3311-0ed8-4fb9-adc2-98a873bba984
  modified: 2026-11-08T08:14:36.090Z
---

Built 2026-11-08 in `~/.kiro/crew/workspace/father-trail/` (code `video/src/Jyotiq/fathertrail/`, comp `FatherTrail`, 79.6 s, git branch `jyotiq/father-trail-reel` in the home repo). First English reel for a worldwide audience: story #3 picked from Dorson's *Folktales Told around the World* (p. 243). Ayush gave a reference reel (`~/Downloads/Japanese reel .mp4`: sumi-e moving paintings, one serif caption sentence in the upper-middle sky, soft dissolves, calm narrator, real-world CTA) and asked for the same visuals and edit.

**Why:** Ayush wants the brand to go global through emotional folktales from around the world, closing on Jyotiq.

**How to apply:** For the next story in this style, copy this folder (gen_img.py with `_style` in shots.json and a `char` reference image, gen_veo.py, vo_prep.py in English, gen_music.py, mix_simple.py, screen_quad.py for the hands-holding-phone shot). Ayush chose Kaal for the English voice and approved paid Veo (about Rs 1,600 for this reel). Lessons: wrap every OffthreadVideo in a `<Sequence from={start}>` or clips play on the composition clock; check each Veo clip's last second (s04's hand dissolved); Python 3.14 needs `SSL_CERT_FILE=/etc/ssl/cert.pem` for API calls. See [[jyotiq-diwali-story-series]], [[veo-vertex-route]], [[elevenlabs-save-credits]].
