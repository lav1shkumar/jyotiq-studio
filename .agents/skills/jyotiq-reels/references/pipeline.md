# Pipeline commands (from diwali-d1 and manthan-ep7)

Copy the newest episode's helpers into the new episode folder and change only names and paths. Templates:
`diwali-d1/{transcribe.sh,intake.py,render_final.sh,review.sh,stills.sh}`, `video/scripts/diwali_d1_{vo_prep,audio,score}.py`.

## Transcribe takes (local, audio never leaves the Mac)

whisper.cpp (`/opt/homebrew/bin/whisper-cli`), model `ggml-large-v3-turbo-q5_0.bin`, Hindi, word timestamps:

```bash
ffmpeg -v error -y -i take.mp3 -ar 16000 -ac 1 take.wav
whisper-cli -m "$MODEL" -l hi -t 4 -dtw large.v3.turbo -ojf -np -f take.wav   # writes take.wav.json
```

Run the whole batch with `nohup caffeinate -is bash transcribe.sh > audio/stt/run.log 2>&1 &`; it ends with `TRANSCRIBE DONE`. Skip takes already transcribed so it is safe to re-run.

## Audio scripts

```bash
/usr/local/bin/python3 video/scripts/<ep>_vo_prep.py          # trims, levels, voData.ts
/usr/local/bin/python3 video/scripts/<ep>_audio.py --timing-only   # timing.ts (TOTAL), no mix
<venv-with-numpy>/bin/python video/scripts/<ep>_score.py       # stems into <ep>/audio/stems
/usr/local/bin/python3 video/scripts/<ep>_audio.py             # full mix -> public/.../mix.wav
```

## Final render (render_final.sh)

1. `npx remotion bundle src/index.ts --out-dir=<ep>/render/bundle` once: a frozen snapshot so edits by other sessions to shared files cannot change the episode mid-render.
2. Render 4 muted chunks, retry a failed chunk once after 30 s, keep finished chunks (resumable):
   ```bash
   npx remotion render "$BUNDLE" "$COMP" chunk_$i.part.mp4 --frames=$a-$b --scale=1 --concurrency=1 --muted \
     --codec=h264 --crf=12 --pixel-format=yuv420p --color-space=bt709 --image-format=png --overwrite
   ```
3. Concat with `-f concat -c copy`, then mux `mix.wav`: `-c:v copy -c:a aac -b:a 320k -ar 48000 -movflags +faststart -shortest`.
4. Measure with `ebur128=peak=true`; if the true peak is above -1.5 dBFS after AAC, re-mux once with gain `-1.6 - TP` dB.
5. Share copy only if the master is over 50 MB: `libx264 -preset slow -crf 18 -maxrate 6000k -bufsize 12000k`, bt709 tags, AAC 192k.

Guards before rendering: `timing.ts` has `TOTAL` under 1800, `mix.wav` exists. Start with `nohup caffeinate -is bash render_final.sh >> render/render.log 2>&1 &` and follow the log.

## Review (review.sh)

```bash
ffprobe -v error -show_entries stream=codec_name,profile,width,height,r_frame_rate,nb_frames,pix_fmt,color_space,sample_rate,channels:format=duration,size,bit_rate -of default=nw=1 "$F" > review/probe.txt
ffmpeg -hide_banner -i "$F" -vn -af ebur128=peak=true -f null - 2>&1 | sed -n '/Summary/,$p' > review/loudness.txt
ffmpeg -hide_banner -i "$F" -vf "blackdetect=d=0.1:pix_th=0.10,freezedetect=n=-60dB:d=1.0" -an -f null - 2>&1 | grep -E "black_|freeze_" > review/blackfreeze.txt
ffmpeg -v error -y -i "$F" -vf "select='not(mod(n-6\,72))',scale=270:480,tile=4x2" -frames:v 4 -fps_mode vfr review/sheet_%d.png
ffmpeg -v error -y -i "$F" -vf "select='eq(n\,0)+eq(n\,$LAST)',scale=540:960,tile=2x1" -frames:v 1 -fps_mode vfr review/firstlast.png
```

Look at the contact sheets and first/last frame yourself (Read the PNGs) against the viewer-eye checklist, fix, and re-render only the changed chunks (move those chunk files aside, set `BUNDLE_NAME=bundle2` after code fixes).
