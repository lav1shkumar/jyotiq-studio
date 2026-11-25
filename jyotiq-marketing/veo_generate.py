#!/usr/bin/env python3
"""Generate one video with Veo on Vertex AI, using your gcloud sign-in (ADC).

Example:
  python3 veo_generate.py "A brass oil lamp flickering at dusk" -o lamp.mp4 --seconds 4
"""
import argparse
import base64
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request

PROJECT = "project-5ebf90c0-78ab-479a-93b"
LOCATION = "us-central1"
GCLOUD = os.path.expanduser("~/google-cloud-sdk/bin/gcloud")

# Spending stop. No new clip starts if it would take the running total past
# LIMIT_INR. This keeps about Rs 2,000 of the Rs 24,062.98 trial credit unused.
LIMIT_INR = 22000
# Deliberately high estimates, not confirmed prices or real billing data.
INR_PER_USD = 100
USD_PER_SECOND = {"veo-3.1-fast-generate-001": 0.15, "veo-3.1-generate-001": 0.40}
LEDGER = os.environ.get("VEO_LEDGER", os.path.expanduser("~/.veo_spend.json"))
# The first test clip ran before this stop existed: 4 s on the Fast model.
STARTING_SPEND_INR = 60.0


def spent_so_far():
    if not os.path.exists(LEDGER):
        return STARTING_SPEND_INR
    with open(LEDGER) as ledger:
        return json.load(ledger)["spent_inr"]


def check_budget(model, seconds):
    """Return (estimated cost, new total), or stop if over the limit."""
    if model not in USD_PER_SECOND:
        sys.exit(f"Stopped: no price estimate for {model}, so nothing was generated.")
    cost = seconds * USD_PER_SECOND[model] * INR_PER_USD
    spent = spent_so_far()
    if spent + cost > LIMIT_INR:
        sys.exit(
            f"Stopped by spending limit: Rs {spent:,.0f} used + Rs {cost:,.0f} for this clip "
            f"is over Rs {LIMIT_INR:,}. Nothing was generated."
        )
    return cost, spent + cost


def record_spend(total):
    with open(LEDGER, "w") as ledger:
        json.dump({"spent_inr": total}, ledger)


def token():
    binary = GCLOUD if os.path.exists(GCLOUD) else "gcloud"
    return subprocess.check_output(
        [binary, "auth", "application-default", "print-access-token"],
        stderr=subprocess.DEVNULL,
        text=True,
    ).strip()


def post(url, body):
    request = urllib.request.Request(
        url,
        data=json.dumps(body).encode(),
        headers={
            "Authorization": f"Bearer {token()}",
            "x-goog-user-project": PROJECT,
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            return json.load(response)
    except urllib.error.HTTPError as error:
        sys.exit(f"Request failed ({error.code}): {error.read().decode()[:1000]}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("prompt")
    parser.add_argument("-o", "--out", default="veo_clip.mp4")
    parser.add_argument("--model", default="veo-3.1-fast-generate-001")
    parser.add_argument("--seconds", type=int, default=4, choices=[4, 6, 8])
    parser.add_argument("--aspect", default="9:16", choices=["9:16", "16:9"])
    parser.add_argument("--resolution", default="720p", choices=["720p", "1080p"])
    parser.add_argument("--audio", action="store_true", help="also generate sound")
    parser.add_argument("--dry-run", action="store_true", help="check the limit, generate nothing")
    args = parser.parse_args()

    cost, new_total = check_budget(args.model, args.seconds)
    print(f"Estimate: Rs {cost:,.0f} this clip, Rs {new_total:,.0f} of Rs {LIMIT_INR:,} after it.")
    if args.dry_run:
        print("Dry run: nothing generated.")
        return

    base = (
        f"https://{LOCATION}-aiplatform.googleapis.com/v1/projects/{PROJECT}"
        f"/locations/{LOCATION}/publishers/google/models/{args.model}"
    )
    operation = post(
        f"{base}:predictLongRunning",
        {
            "instances": [{"prompt": args.prompt}],
            "parameters": {
                "sampleCount": 1,
                "durationSeconds": args.seconds,
                "aspectRatio": args.aspect,
                "resolution": args.resolution,
                "generateAudio": args.audio,
            },
        },
    )
    # Count it as soon as the job is accepted, since it may be billed even if waiting fails.
    record_spend(new_total)
    print("Started. Waiting for Veo...", flush=True)

    deadline = time.time() + 480
    while time.time() < deadline:
        time.sleep(15)
        status = post(f"{base}:fetchPredictOperation", {"operationName": operation["name"]})
        if not status.get("done"):
            continue
        if "error" in status:
            sys.exit(f"Veo error: {json.dumps(status['error'])[:1000]}")
        result = status.get("response", {})
        videos = result.get("videos", [])
        if not videos:
            sys.exit(f"No video returned: {json.dumps(result)[:1000]}")
        with open(args.out, "wb") as output:
            output.write(base64.b64decode(videos[0]["bytesBase64Encoded"]))
        print(f"Saved {args.out}")
        return
    sys.exit("Timed out after 8 minutes. The job may still finish and be billed.")


if __name__ == "__main__":
    main()
