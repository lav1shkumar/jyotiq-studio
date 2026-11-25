#!/bin/bash
# Copies the source files for Kumara reel 1 ("शनि देव साँवले क्यों हैं?") from the dashboard
# uploads folder into this project under clear names, so the project is self-contained.
set -euo pipefail
P="$(cd "$(dirname "$0")/.." && pwd)"
U=/Users/ayushrajput/.kiro/crew/uploads
B=/Users/ayushrajput/.kiro/crew/workspace/jyotiq-marketing/brand
A="$P/assets/src"
V="$P/audio/src"
mkdir -p "$A" "$V" "$P/renders"

one() { # $1 = upload hash prefix, $2 = destination path
  local m=( "$U"/"$1"_* )
  if [ ! -e "${m[0]}" ]; then echo "missing upload $1" >&2; exit 1; fi
  cp "${m[0]}" "$2"
}

# Images generated for this reel (Nano Banana Pro, 1171x1568)
one 8ac8f623e55a485bb19c78a7b866b7a8 "$A/kumaras.jpg"      # 2x2 sheet: सनक, सनन्दन / सनातन, सनत्कुमार
one 0865a326ad984fb898e60eb58d405b2f "$A/surya.jpg"
one d4bc0ea3d30d495b82a2714660cce853 "$A/sanjna.jpg"       # standing, shielding her eyes
one 64cc87a214e1496cb469e9937398e772 "$A/chhaya.jpg"       # same woman, meditating
one 01adbe7d22c640b3bc96f301778828b9 "$A/shiva.jpg"
one c68c9f0f4c4d446c90a74f51f7bcdaae "$A/pearl_plate.jpg"
one 1997a889221b4b85baf57d07be39b8c0 "$A/cloud_plate.jpg"
one 1b57931b702944ee9710be6956b0cda1 "$A/scale.jpg"

# Reused from earlier reels
one b495d9870228444fa2a7a54b0c847042 "$A/shani.jpg"        # मन को संभालो set
one 9b88a3489dea457f9dc917dd382a6f0d "$A/sun_emblem.jpg"   # बुध reel
one da38a831aaf0411a8c9a5f40a687af6c "$A/paper.jpg"
one 18719c3c703b46ed81047d66151de0c9 "$A/app.mp4"          # Jyotiq app screen recording
cp "$B/jyotiq-logo-site.png" "$A/logo_site.png"

# Voice lines (ElevenLabs v4), one file per script line. Line 7 was uploaded twice as identical files.
one 2c3935524c544b15ab746e9dfc9de124 "$V/L01_sanatkumara.mp3"
one f235f70679ef40b9b5a3d6a83950adcc "$V/L02_sanaka.mp3"
one 5690bd2302a84562ba0fa764b41a949e "$V/L03_sanandana.mp3"
one 790d4fe8b4074557a0ea9412575ce4a9 "$V/L04_sanatana.mp3"
one 059a09fdb8cc4753999c476b8f14c68f "$V/L05_sanatkumara.mp3"
one 01ba67f30aba407fa33d150a828d0813 "$V/L06_sanaka.mp3"
one ba42752830b048279bc2a053c15333ac "$V/L07_sanandana.mp3"
one 519113457aab4313b09a2b9f6731a616 "$V/L08_sanatana.mp3"
one 613ccbaa47354bc887e0ce306d1f7c14 "$V/L09_sanatkumara.mp3"
one b6b27782df054e8ca98ebf2b51c108cc "$V/L10_sanaka.mp3"
one 7cd5fccb6a8944b6b0618fb295a028e5 "$V/L11_sanatkumara.mp3"
one d6ab18ff31734099a7aa92f0f44c091f "$V/L12_sanatana.mp3"

ls -l "$A" "$V"
echo IMPORT_OK
