#!/bin/bash
# Transcribe every Diwali Day 2-5 take Ayush uploads: each .mp3 in uploads newer than the voice pack
# (ELEVENLABS_D2-D5.md) that has no transcript yet. Hindi, word timestamps, locally with whisper.cpp, so the audio
# never leaves this Mac. Copied from diwali-d1/transcribe.sh; one shared transcript folder (stt/) feeds each day's
# intake.py, which picks out its own lines by their words.
# Usage (after checking no other heavy job runs):
#   nohup caffeinate -is bash /Users/ayushrajput/.kiro/crew/workspace/jyotiq-marketing/diwali-series/transcribe.sh \
#     > /Users/ayushrajput/.kiro/crew/workspace/jyotiq-marketing/diwali-series/stt/run.log 2>&1 &
# Takes already transcribed are skipped, so it is safe to re-run. The 16 kHz wavs go to session scratch; the model
# lives in session scratch too and is downloaded again when missing (the scratch moves on a runtime restart).
set -uo pipefail
UP=/Users/ayushrajput/.kiro/crew/uploads
SERIES=/Users/ayushrajput/.kiro/crew/workspace/jyotiq-marketing/diwali-series
MARK="$SERIES/ELEVENLABS_D2-D5.md"
OUT="$SERIES/stt"
WAV="$KIROCREW_SCRATCH/stt_wav"
MODELS="$KIROCREW_SCRATCH/models"
MODEL="$MODELS/ggml-large-v3-turbo-q5_0.bin"
mkdir -p "$MODELS" "$OUT" "$WAV"
if [ ! -s "$MODEL" ]; then
  echo "downloading model $(date +%T)"
  curl -L --fail -sS -o "$MODEL.part" \
    https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3-turbo-q5_0.bin || { echo "FAILED: model download"; exit 1; }
  mv "$MODEL.part" "$MODEL"
  echo "model ready $(date +%T)"
fi
n=0
while IFS= read -r f; do
  b=$(basename "$f" .mp3)
  key="${b:0:8}"
  if [ ! -s "$OUT/$key.wav.json" ]; then
    ffmpeg -v error -y -i "$f" -ar 16000 -ac 1 "$WAV/$key.wav" || { echo "FAILED: ffmpeg $b"; continue; }
    whisper-cli -m "$MODEL" -l hi -t 4 -dtw large.v3.turbo -ojf -np -f "$WAV/$key.wav" -of "$OUT/$key.wav" > /dev/null 2>&1 \
      || { echo "FAILED: whisper $b"; continue; }
  fi
  n=$((n + 1))
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  printf '%s\t%s\t%ss\t' "$key" "${b:33}" "$dur"
  /usr/local/bin/python3 -c 'import json,sys; d=json.load(open(sys.argv[1])); print(" | ".join("[%s-%s] %s" % (s["timestamps"]["from"][3:11], s["timestamps"]["to"][3:11], s["text"].strip()) for s in d["transcription"]))' "$OUT/$key.wav.json"
done < <(find "$UP" -maxdepth 1 -type f -name '*.mp3' -newer "$MARK" | sort)
echo "TRANSCRIBE DONE: $n takes $(date +%T)"
