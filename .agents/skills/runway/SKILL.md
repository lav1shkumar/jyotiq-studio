---
name: runway
description: Generate AI images and video clips with the Runway API (gen4_image keyframes, gen4_turbo / gen4.5 image-to-video, plus Kling, Veo, Seedance and other models Runway hosts) and cut them into ads and reels. Use when the user asks for Runway, AI video ads, product ads, cinematic AI shots, image-to-video, or realistic footage that Blender or Remotion can't make. Covers the key, costs, prompts, the helper script, and finishing in Remotion/ffmpeg.
---

# Runway API

Runway's developer API (docs: https://docs.dev.runwayml.com) generates video and images as async tasks. The helper `scripts/runway.py` (Python stdlib, no install) handles the version header, polling with backoff and downloads.

## Key (the user sets it, never Claude)

- The user signs up at https://dev.runway.com, buys API credits there (separate from a Runway app subscription) and creates a key.
- The user adds `export RUNWAYML_API_SECRET=...` to `~/.zshrc` and restarts the app. Never ask for the key in chat, never echo or log it, never write it into project files.
- Check without revealing: `[ -n "$RUNWAYML_API_SECRET" ] && echo set`. Balance: `python3 ~/.claude/skills/runway/scripts/runway.py balance`.

## Commands

```bash
R=~/.claude/skills/runway/scripts/runway.py
python3 $R balance
# keyframe image (1080x1920 portrait); --ref adds up to 3 reference images, tag them and use @tag in the prompt
python3 $R image --prompt "..." --ratio 1080:1920 --out key.jpg [--ref logo.png=logo] [--seed 7]
# animate it (gen4_turbo: any duration 2-10 s; portrait ratio 720:1280)
python3 $R video --image key.jpg --prompt "..." --ratio 720:1280 --duration 3 --out clip.mp4
# resume a task whose poll was interrupted
python3 $R wait <task-id> --out clip.mp4
```

Every run prints `task <id>` first and `credits <n>` at the end. Output URLs expire in 24-48 h; the script downloads at once.

## Rules from Runway's docs (Nov 2026)

- Base `https://api.dev.runwayml.com`, header `X-Runway-Version: 2024-11-06`, `Authorization: Bearer`.
- Bodies are per model: `ratio`, `duration` and fields differ by `model`. Before using any model other than the ones below, read its section in https://docs.dev.runwayml.com/api.md (a `.md` copy of every docs page exists). Never invent model ids; `gen3a_turbo` and `gen4_aleph` are retired.
- `gen4_turbo` image-to-video: ratios `1280:720`, `720:1280`, `1104:832`, `832:1104`, `960:960`, `1584:672`; duration 2-10; prompt optional (max 1000 chars).
- `gen4.5` image-to-video: same ratios, duration 2-10, prompt required. Also does text-to-video.
- `gen4_image` / `gen4_image_turbo`: ratios include `1080:1920`, `720:1280`; `gen4_image_turbo` requires 1-3 `referenceImages`. Tags are 3-16 chars, letters/digits/underscore.
- Inputs are auto-cropped to the target ratio: make keyframes in the same aspect as the video.
- Moderation failures come back as a `FAILED` task, still cost credits, and repeated ones can suspend the account. Keep prompts clean; no real public figures.
- Recipes (`/v1/recipes/product_ad`, `product_ugc`, `multi_shot_video`, `ad_localization`) wrap several steps for product ads; read the recipes bundle before using one.

## Cost (check https://docs.dev.runwayml.com/guides/pricing.md before quoting; 1 credit = $0.01)

| Model | Credits | Use |
|---|---|---|
| `gen4_image` | 5 (720p) / 8 (1080p) per image | keyframes |
| `gen4_image_turbo` | 2 per image | cheap variations with references |
| `gen4_turbo` | 5 per second | default image-to-video, drafts and most shots |
| `gen4.5` | 12 per second | hero shots, better motion and prompt following |
| `veo3.1_fast` | 10 / 15 per second (no audio / audio) | when native sound is wanted |

Tell the user the expected credits before a batch; a 3 s test is about 23 credits, a 30 s ad of six 5 s shots about $2-5 with retakes.

## Ad workflow

1. **Brief:** product, one message, hook, CTA, format (1080x1920, 30 fps for reels). For Jyotiq follow the `jyotiq-reels` skill's branding, safe areas and loudness.
2. **Shot list:** 1.5-3 s per shot, one motion per shot. Write each prompt as: subject, action, camera move, light, lens/style. Example: "A brass diya flame flickers on a dark wooden table, warm smoke rises, slow push-in, shallow depth of field, cinematic night light."
3. **Keyframes first** (`image`, 1080:1920), look at them (Read the jpg), regenerate cheap before animating. Use the real logo/product photo as `--ref` so it stays on-model; still put exact logos and text in the edit, not in the AI image (AI text is unreliable).
4. **Animate** with `gen4_turbo` 720:1280; upgrade the best shots to `gen4.5` if needed. Keep the seed to iterate on the same take.
5. **Finish:** scale clips to 1080x1920 (`ffmpeg -vf scale=1080:1920:flags=lanczos`), add text, logo, CTA and captions in Remotion (Homebrew ffmpeg here has no drawtext), add VO (ElevenLabs), music/SFX (openverse, earshot), master at -14 LUFS, true peak <= -1.5 dBFS.
6. **Review** a contact sheet, check frame 0 is lit and the hook reads sound-off, then deliver. Remind the user to switch on Instagram's AI label.

Keep a `RUNWAY.md` in the project folder with each task id, model, seed, prompt and credits, so takes can be reproduced.
