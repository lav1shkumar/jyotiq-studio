#!/bin/bash
# App frames for S12: the clean part of the app recording (home screen, then typing "Open my kundali...").
# 2.0-9.6 s only. From ~10 s the app shows the timeframe sheet and from ~12 s a paywall with prices.
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="$KIROCREW_SCRATCH/appframes"
mkdir -p "$OUT"
ffmpeg -v error -y -ss 2.0 -i "$HERE/../assets/src/app.mp4" -t 7.6 \
  -vf "fps=30,scale=440:-2:flags=lanczos" -q:v 2 -start_number 0 "$OUT/af_%04d.jpg"
echo "APPFRAMES_OK $(ls "$OUT" | wc -l | tr -d ' ') frames"
