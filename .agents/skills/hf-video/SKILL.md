---
name: hf-video
description: Free AI image and video generation through Hugging Face ZeroGPU Spaces (FLUX.1-schnell keyframes, Wan 2.2 and LTX-Video image-to-video) called from Claude with gradio_client. Use when the user wants AI footage, AI ad shots or image-to-video without paying (no Runway/fal credits), or mentions Hugging Face, Spaces, Wan, LTX or FLUX. Covers the free token, daily GPU quota, the helper script and finishing.
---

# Free AI video with Hugging Face Spaces

Spaces are free hosted demos. ZeroGPU Spaces lend a shared GPU per call, so they cost nothing but have a **daily GPU-time quota** and queues. The helper runs locally on the 8 GB Mac; the heavy work happens on Hugging Face.

## Setup (done once)

- Python env: `~/hfvideo/.venv` with `gradio_client` (already installed). Always run the script with `~/hfvideo/.venv/bin/python`.
- Account and token: **the user** signs up at https://huggingface.co/join, then creates a token at https://huggingface.co/settings/tokens (type "Read" is enough), and adds `export HF_TOKEN=...` to `~/.zshrc`, then restarts the app. Never ask for the token in chat, never print it. Check with `[ -n "$HF_TOKEN" ] && echo set`.
- Alternative that needs no shell file: the user runs `~/hfvideo/.venv/bin/hf auth login` in their own terminal and pastes the token there; the script reads the saved login. Check with `~/hfvideo/.venv/bin/hf auth whoami`.
- Without a token calls still work anonymously, with a much smaller quota. A free account gets a few minutes of ZeroGPU time per day; HF PRO ($9/month) gives far more. The quota resets about 24 h after use.

## Commands

```bash
H="$HOME/hfvideo/.venv/bin/python $HOME/.claude/skills/hf-video/scripts/hfv.py"
# keyframe (FLUX.1-schnell, about 2-5 s of GPU); portrait 768x1344 is close to 9:16
$H image --prompt "..." --w 768 --h 1344 --out key.png [--seed 7]
# animate it with Wan 2.2 (best quality, about 1-2 min of GPU for 3 s)
$H video --image key.png --prompt "..." --seconds 3 --out clip.mp4
# or LTX-Video distilled (faster, lower quality, good fallback when Wan is busy or the quota is low)
$H video --engine ltx --image key.png --prompt "..." --seconds 3 --w 480 --h 832 --out clip.mp4
```

The script prints the Space, the seed used and the saved path. Re-run with `--seed` to iterate on the same take.

## Spaces used (checked Nov 2026, all RUNNING on zero-a10g)

| Job | Space | Notes |
|---|---|---|
| Image | `black-forest-labs/FLUX.1-schnell` | `/infer(prompt, seed, randomize_seed, width, height, steps)` |
| Image to video | `zerogpu-aoti/wan2-2-fp8da-aoti-faster` | Wan 2.2 I2V; `/generate_video(input_image, prompt, steps, negative_prompt, duration_seconds, guidance, guidance_2, seed, randomize_seed)`; duration up to about 5 s; output size follows the image |
| Image/text to video | `Lightricks/ltx-video-distilled` | `/image_to_video` and `/text_to_video`; up to 1280 px sides |

Spaces change or break without notice. If one fails, check its status (`curl -s https://huggingface.co/api/spaces/<id>` → `runtime.stage`), read its current inputs with `Client("<id>").view_api()`, and look for alternatives (`https://huggingface.co/api/spaces?search=wan2&sort=likes&direction=-1`). Update the table and the script when a Space moves.

## Making ads with it

1. Keyframes with FLUX at 768x1344; look at each (Read the png) and regenerate before animating, since video costs much more quota.
2. One simple motion per shot ("flame flickers, sparks rise, slow push-in"). Wan follows camera words well; avoid asking for text, logos or hands doing detailed work.
3. Upscale and fit: `ffmpeg -i clip.mp4 -vf "scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920,fps=30" -c:v libx264 -crf 16 clip_1080.mp4`. Clips come out around 16 fps (Wan) or 24-30 fps (LTX); `fps=30` duplicates frames, `minterpolate=fps=30` smooths them more.
4. Put the real logo, text, captions and CTA on top in Remotion (Homebrew ffmpeg has no drawtext); sound from openverse / earshot / ElevenLabs; master at -14 LUFS. For Jyotiq follow the `jyotiq-reels` skill.
5. Licences: FLUX.1-schnell and Wan 2.2 are Apache-2.0 (commercial use fine). LTX-Video has its own open-weights licence with commercial conditions: read the model card before using LTX output in a paid ad. Remind the user to switch on Instagram's AI label.
