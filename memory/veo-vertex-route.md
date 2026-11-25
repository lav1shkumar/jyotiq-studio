---
name: veo-vertex-route
description: Paid Veo 3.1 access through Vertex AI works on this Mac using gcloud ADC; API keys are blocked by org policy on the project
metadata:
  node_type: memory
  type: reference
  originSessionId: 3eae1cf2-266b-4aa2-b396-78ff16cd1a8e
  modified: 2026-11-06T17:14:04.402Z
---

Veo on Vertex AI was confirmed working on 2026-11-06 in project `project-5ebf90c0-78ab-479a-93b`, region `us-central1`.

- Auth: Application Default Credentials. API keys are disallowed by org policy on this project, so don't suggest them.
- gcloud lives at `~/google-cloud-sdk/bin/gcloud` (Google's installer). The Homebrew `gcloud-cli` cask failed on Python 3.14.
- Available models: `veo-3.1-fast-generate-001` (tested) and `veo-3.1-generate-001` (returned 200, not generated with). Older and preview IDs returned 404.
- User wants spending to stop with ₹2,000 of credit left. Veo clips should go through a script with a running total (₹22,000 limit, tracked in `~/.veo_spend.json`, using high estimates rather than billing data).
- Trial credit was about ₹24,000 with 68 days left as of 2026-11-06. Whether it covers Veo was not confirmed.

Google Flow itself has no official public API that I could find. [[free-ai-video-route]] stays the default for everyday footage, so ask before spending on Veo.
