# Putting Jyotiq on Devin Cloud: what Ayush does

This folder (`~/.kiro/crew/workspace/jyotiq-cloud`) is a slim copy of the studio (~120 MB): the Remotion code,
brand kit, all 51 skills, all project notes, the marketing docs and an example episode. No renders, no old voice
takes, no keys.

## 1. Push it to a private GitHub repo
```bash
cd ~/.kiro/crew/workspace/jyotiq-cloud
gh repo create jyotiq-studio --private --source . --push
```
(or create an empty private repo on github.com and `git remote add origin … && git push -u origin main`)

## 2. Connect the repo in Devin
Devin → Settings → Repositories / GitHub → give Devin access to `jyotiq-studio`.

## 3. Add secrets (Devin → Settings → Secrets)
| Name | Value | Needed? |
|---|---|---|
| `ELEVENLABS_API_KEY` | your ElevenLabs key (same one in `~/.zshrc`) | Yes, for voice/music/SFX |
| `HF_TOKEN` | free token from huggingface.co → Settings → Access Tokens (read) | Yes, for free AI footage |
| `GCP_SA_KEY_JSON` | the whole JSON of a Vertex service-account key | Optional. Your org blocks API keys and may block SA keys too. Skip it → Veo stays on the Mac |

Never put these in the repo.

## 4. Machine setup (Devin → repo → Environment / Setup)
Setup command: `bash setup.sh` — then save the machine snapshot so it doesn't reinstall every session.

## 5. First prompt to Devin
> Read AGENTS.md and memory/MEMORY.md. Then [your task, e.g. "write the script for Bharata Ep7 Ekalavya"].

## Things to know
- **Spend:** `spend-ledger.json` says ₹19,670 spent of the ₹22,000 stop, so only ~₹2,330 of Vertex is left.
- **Old media isn't in the cloud.** If Devin needs an earlier episode's voice takes or footage, upload just those files.
- **Getting reels back:** Devin uploads the MP4 as a GitHub Release and attaches it in chat.
- **Keeping both in sync:** notes Devin updates land in `memory/` in the repo. To bring them back to the Mac:
  `git pull` in this folder.
- Cloud sessions cost Devin ACUs; renders on a cloud VM are slower to watch but don't tie up your 8 GB Mac.
