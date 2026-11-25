#!/usr/bin/env python3
"""Small Runway API client (stdlib only). Reads the key from RUNWAYML_API_SECRET and never prints it.

  runway.py balance
  runway.py image  --prompt "..." --ratio 1080:1920 --out key.jpg [--model gen4_image] [--ref path_or_url[=tag] ...] [--seed N]
  runway.py video  --image key.jpg --prompt "..." --ratio 720:1280 --duration 3 --out clip.mp4 [--model gen4_turbo] [--seed N]
  runway.py wait   TASK_ID --out file

Every generation prints the task id first, so a dropped poll can be resumed with `wait`.
"""
import argparse
import base64
import json
import mimetypes
import os
import sys
import time
import urllib.error
import urllib.request

API = "https://api.dev.runwayml.com"
VERSION = "2024-11-06"


def key():
    k = os.environ.get("RUNWAYML_API_SECRET")
    if not k:
        sys.exit("RUNWAYML_API_SECRET is not set. Add `export RUNWAYML_API_SECRET=...` to ~/.zshrc and restart.")
    return k


def call(method, path, body=None):
    req = urllib.request.Request(API + path, method=method, data=json.dumps(body).encode() if body else None)
    req.add_header("Authorization", "Bearer " + key())
    req.add_header("X-Runway-Version", VERSION)
    req.add_header("Content-Type", "application/json")
    req.add_header("User-Agent", "claude-runway-skill/1.0")
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        sys.exit(f"HTTP {e.code} on {method} {path}: {e.read().decode(errors='replace')[:800]}")


def media_uri(src):
    """HTTPS URLs pass through; local files become data URIs (fine for images up to a few MB)."""
    if src.startswith(("https://", "runway://", "data:")):
        return src
    mime = mimetypes.guess_type(src)[0] or "image/jpeg"
    with open(src, "rb") as f:
        return f"data:{mime};base64," + base64.b64encode(f.read()).decode()


def wait(task_id, out):
    delay = 5
    while True:
        t = call("GET", f"/v1/tasks/{task_id}")
        status = t.get("status")
        print(f"  {status} {round(100 * t.get('progress', 0))}%", flush=True)
        if status == "SUCCEEDED":
            break
        if status in ("FAILED", "CANCELLED"):
            sys.exit(f"task {status}: {t.get('failureCode')} {t.get('failure')}")
        time.sleep(delay)
        delay = min(delay + 2, 15)
    urls = t["output"]
    base, ext = os.path.splitext(out)
    for i, url in enumerate(urls):
        dest = out if i == 0 else f"{base}_{i}{ext}"
        urllib.request.urlretrieve(url, dest)
        print("saved", dest)
    cost = (t.get("cost") or {}).get("credits")
    if cost is not None:
        print("credits", cost)


def start(path, body, out):
    task = call("POST", path, body)
    print("task", task["id"], flush=True)
    wait(task["id"], out)


def main():
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("balance")
    im = sub.add_parser("image")
    im.add_argument("--prompt", required=True)
    im.add_argument("--ratio", default="1080:1920")
    im.add_argument("--model", default="gen4_image")
    im.add_argument("--ref", action="append", default=[], help="path or URL, optionally =tag (use @tag in the prompt)")
    im.add_argument("--seed", type=int)
    im.add_argument("--out", required=True)
    vd = sub.add_parser("video")
    vd.add_argument("--image", required=True)
    vd.add_argument("--prompt", required=True)
    vd.add_argument("--ratio", default="720:1280")
    vd.add_argument("--duration", type=int, default=5)
    vd.add_argument("--model", default="gen4_turbo")
    vd.add_argument("--seed", type=int)
    vd.add_argument("--out", required=True)
    wt = sub.add_parser("wait")
    wt.add_argument("task_id")
    wt.add_argument("--out", required=True)
    a = p.parse_args()

    if a.cmd == "balance":
        org = call("GET", "/v1/organization")
        print("credits", org.get("creditBalance"))
    elif a.cmd == "image":
        body = {"model": a.model, "promptText": a.prompt, "ratio": a.ratio}
        refs = []
        for r in a.ref:
            src, _, tag = r.partition("=")
            refs.append({"uri": media_uri(src), **({"tag": tag} if tag else {})})
        if refs:
            body["referenceImages"] = refs
        if a.seed is not None:
            body["seed"] = a.seed
        start("/v1/text_to_image", body, a.out)
    elif a.cmd == "video":
        body = {"model": a.model, "promptText": a.prompt, "ratio": a.ratio, "duration": a.duration,
                "promptImage": [{"uri": media_uri(a.image), "position": "first"}]}
        if a.seed is not None:
            body["seed"] = a.seed
        start("/v1/image_to_video", body, a.out)
    else:
        wait(a.task_id, a.out)


if __name__ == "__main__":
    main()
