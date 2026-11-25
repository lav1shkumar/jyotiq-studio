---
name: jyotiq-ram-rajyabhishek-reel
description: Ram Rajyabhishek reel (Kilavde6 TV-serial look) built 2026-11-09 in workspace/ram-rajyabhishek; reusable Veo + ffmpeg pipeline
metadata:
  node_type: memory
  type: project
  originSessionId: 47a10973-162f-4e7d-982d-c81f2845ca5a
  modified: 2026-11-09T16:18:17.641Z
---

Built 2026-11-09 in `~/.kiro/crew/workspace/ram-rajyabhishek/` on the git branch `jyotiq/ram-rajyabhishek-reel`. It is a 64.5 s reel, final at `final/*_share.mp4`. The script came from [[jyotiq-myth-script-skill]]: Dasharatha's astrologers warn of Sun, Mars and Rahu, he rushes the coronation to Pushya, and Kaikeyi's boons follow.

Ayush's reference was `~/Downloads/Kilavde6.mp4` (@theepictalesindia). He rejected painterly or illustrated frames and wants the "same old television style": **photographic** stills of costumed actors with painted-backdrop skies, Veo clips where the characters act, one narrator, and no captions. He asked for a narrator voice close to the reference's.

**Why:** he wants each reel to look like that account but be better than it.

**How to apply:** for the next reel in this look, copy `gen_img.py` (its STYLE text), `gen_veo.py`, `gen_vo.py`, `gen_music.py` and `assemble.py`, which is ffmpeg only, no Remotion.
- Use frames grabbed from the reference as refs, cropped to remove the watermark. Never feed illustrated sheets back in, because they turn every frame into drawings.
- Veo refuses some faces (a close-up of the old king) and filters deathbed scenes even with soft wording. Use a still push-in for those shots.
- Check every Veo still for compositions copied from the reference refs.
- Narrator: the shared voice "Ayush M - Deep Mythology Narrator" `HqRQSXEwwdjbY3dgUSzb`, called by its ID because the key can't add voices. Ayush gave Veo spend approval for this reel only. See [[veo-vertex-route]].
