#!/usr/bin/env python3
"""Free AI images and video through Hugging Face ZeroGPU Spaces (gradio_client).

Run with ~/hfvideo/.venv/bin/python. Uses HF_TOKEN from the environment when set (bigger daily GPU quota);
works anonymously with a small quota. Never prints the token.

  hfv.py image --prompt "..." --w 768 --h 1344 --out key.png [--seed N]
  hfv.py video --image key.png --prompt "..." --seconds 3 --out clip.mp4 [--engine wan|ltx] [--seed N]
"""
import argparse
import os
import shutil
import sys

from gradio_client import Client, handle_file
from huggingface_hub import get_token

FLUX = "black-forest-labs/FLUX.1-schnell"
WAN = "zerogpu-aoti/wan2-2-fp8da-aoti-faster"
LTX = "Lightricks/ltx-video-distilled"


def client(space):
    token = os.environ.get("HF_TOKEN") or get_token()  # env var, else the token saved by `hf auth login`
    print(f"space {space} ({'token' if token else 'anonymous'})", flush=True)
    return Client(space, token=token, verbose=False)


def save(result, out):
    path = result["video"] if isinstance(result, dict) and "video" in result else result
    if isinstance(path, dict):
        path = path.get("path")
    shutil.copy(path, out)
    print("saved", out)


def main():
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)
    im = sub.add_parser("image")
    im.add_argument("--prompt", required=True)
    im.add_argument("--w", type=int, default=768)
    im.add_argument("--h", type=int, default=1344)
    im.add_argument("--steps", type=int, default=4)
    im.add_argument("--seed", type=int)
    im.add_argument("--out", required=True)
    vd = sub.add_parser("video")
    vd.add_argument("--image", required=True)
    vd.add_argument("--prompt", required=True)
    vd.add_argument("--seconds", type=float, default=3.0)
    vd.add_argument("--engine", choices=["wan", "ltx"], default="wan")
    vd.add_argument("--seed", type=int)
    vd.add_argument("--w", type=int, default=480, help="ltx only")
    vd.add_argument("--h", type=int, default=832, help="ltx only")
    vd.add_argument("--out", required=True)
    a = p.parse_args()
    rand = a.seed is None
    seed = a.seed or 0

    try:
        if a.cmd == "image":
            img, used = client(FLUX).predict(a.prompt, seed, rand, a.w, a.h, a.steps, api_name="/infer")
            save(img, a.out)
        elif a.engine == "wan":
            # Wan 2.2 14B image-to-video (fast, 4-8 steps); output size follows the input image
            vid, used = client(WAN).predict(handle_file(a.image), a.prompt, 6,
                                            "static, blurry, low quality, subtitles, text, watermark, distorted",
                                            a.seconds, 1, 1, seed, rand, api_name="/generate_video")
            save(vid, a.out)
        else:
            vid, used = client(LTX).predict(a.prompt, "worst quality, inconsistent motion, blurry, jittery, distorted",
                                            handle_file(a.image), None, a.h, a.w, "image-to-video", a.seconds, 9,
                                            seed, rand, 1, True, api_name="/image_to_video")
            save(vid, a.out)
        print("seed", int(used))
    except Exception as e:  # quota and queue errors come back as AppError text
        msg = str(e)
        if "quota" in msg.lower() or "gpu" in msg.lower():
            sys.exit(f"Space refused (likely the free GPU quota): {msg[:400]}\nSet HF_TOKEN, wait for the quota to reset, or try --engine ltx.")
        sys.exit(f"Space error: {msg[:600]}")


if __name__ == "__main__":
    main()
