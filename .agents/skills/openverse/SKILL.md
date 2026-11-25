---
name: openverse
description: Search and download free, openly licensed images and audio (Creative Commons and public domain, from Wikimedia, Flickr, Freesound, museums and more) through the free Openverse API, with license checks safe for commercial reels and a credits log. Use when a video, reel or design needs stock photos, textures, reference images, sound effects, ambience or music without generating them, or when the user mentions Openverse, Creative Commons or free stock media.
---

# Openverse

Openverse (openverse.org, run by WordPress.org) indexes 800M+ openly licensed images and audio files. The API is free. No key is needed: anonymous use allows **20 requests/min and 200/day** (headers `x-ratelimit-available-anon_*`). Registering gives slightly higher limits (see the end).

Openverse only indexes; each file's license comes from its creator. **Always check the license per file and keep the attribution.**

## Licenses for commercial work (Jyotiq reels are commercial)

| License | Commercial use | Edit/remix | Credit needed |
|---|---|---|---|
| `cc0`, `pdm` (public domain) | yes | yes | no (credit anyway as courtesy) |
| `by` | yes | yes | **yes** |
| `by-sa` | yes | yes, but derivatives must share alike | **yes**; avoid for reels unless the user accepts SA |
| `by-nd` | yes | **no** edits, cropping counts as edit | avoid |
| anything with `nc` | **no** | — | never use for Jyotiq |

Default filter for reels: `license_type=commercial,modification` (returns only cc0, pdm, by, by-sa). Prefer `license=cc0,pdm,by` to skip share-alike.

## Search

```bash
# Images
curl -s 'https://api.openverse.org/v1/images/?q=diya%20lamp&license=cc0,pdm,by&page_size=20&aspect_ratio=tall&size=large&mature=false'
# Audio (sound effects, ambience, music)
curl -s 'https://api.openverse.org/v1/audio/?q=temple%20bell&license=cc0,pdm,by&page_size=20&length=short'
# One item, and related items
curl -s 'https://api.openverse.org/v1/images/<id>/'
curl -s 'https://api.openverse.org/v1/images/<id>/related/'
# Current usage
curl -s 'https://api.openverse.org/v1/rate_limit/'
```

Useful params:
- Images: `aspect_ratio=tall|wide|square`, `size=small|medium|large`, `extension=jpg,png,svg`, `category=photograph|illustration|digitized_artwork`, `source=wikimedia,flickr,met,smithsonian...`.
- Audio: `length=shortest|short|medium|long`, `extension=mp3,wav,flac,ogg`, `source=freesound,jamendo,...`. `category=music|sound_effect|...` exists, but most Freesound items have no category, so `sound_effect` returns almost nothing (tested Nov 2026): for SFX, search by words (`q=temple bell`) with `length=short` instead.
- Both: `q`, `page`, `page_size` (max 20 anonymous), `license`, `license_type`, `mature=false`.

Each result carries `url` (the file), `thumbnail`, `license`, `license_version`, `creator`, `foreign_landing_url` and a ready-made `attribution` string. Audio also has `duration` (ms).

## Download with a credits log

Download only the files you will actually use (the terms forbid scraping and bulk harvesting). Use `curl -L --fail` into the project's assets folder (for Jyotiq: `video/public/jyotiq/<series>/<ep>/`), then append the item to `CREDITS.md` in the episode folder:

```
- <filename>: <attribution string from the API> (<foreign_landing_url>)
```

Before using a file, `ffprobe` audio for duration and loudness; Freesound previews are 128 kbps MP3, and the full-quality file lives at `foreign_landing_url` (may need a Freesound login).

## Reel workflow

1. Search with the commercial filter, look at thumbnails (download a few thumbs to the scratchpad and Read them) before choosing.
2. Prefer cc0 / pdm. For `by`, put the credit in the Instagram caption or a "Credits" line in the end card, and in the episode REPORT.md.
3. Treat the image as a plate or texture behind original graphics; never present a stock photo of a real person as a god or a customer.
4. Remember 4-5 calls per search session at most for a cue; at 200/day, batch your searches.

## Higher limits (optional)

Register once for a client id and secret (asks for an app name, description and email, so ask the user first):
`POST https://api.openverse.org/v1/auth_tokens/register/` with `{"name","description","email"}`, verify the email, then get a token from `POST /v1/auth_tokens/token/` (`grant_type=client_credentials`) and send `Authorization: Bearer <token>`. Store the secret in an env var, never in project files.

Terms: no scraping, respect the limits, no using several machines to get around them.
