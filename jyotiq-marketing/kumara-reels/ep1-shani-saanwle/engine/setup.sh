#!/bin/bash
# One-time setup for the reel engine. Safe to re-run: an existing venv and fonts are reused.
# The venv lives in session scratch (machine-specific, rebuilt in ~1 min); fonts live in the project.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
VENV="${KIROCREW_SCRATCH:?KIROCREW_SCRATCH not set}/venv"

if [ ! -x "$VENV/bin/python" ]; then
  /usr/local/bin/python3 -m venv "$VENV"
fi
"$VENV/bin/pip" install --quiet --disable-pip-version-check --only-binary=:all: numpy==2.3.4 pillow==12.0.0

mkdir -p "$HERE/fonts"
BASE=https://raw.githubusercontent.com/google/fonts/main/ofl
for f in rozhaone/RozhaOne-Regular.ttf \
         mukta/Mukta-Regular.ttf mukta/Mukta-Medium.ttf mukta/Mukta-SemiBold.ttf mukta/Mukta-Bold.ttf mukta/Mukta-ExtraBold.ttf \
         poppins/Poppins-Regular.ttf poppins/Poppins-Medium.ttf poppins/Poppins-SemiBold.ttf; do
  out="$HERE/fonts/$(basename "$f")"
  [ -s "$out" ] || curl -sSfL --max-time 60 -o "$out" "$BASE/$f"
done

"$VENV/bin/python" -c "import numpy, PIL; print('numpy', numpy.__version__, 'pillow', PIL.__version__)"
ls -l "$HERE/fonts"
echo SETUP_OK
