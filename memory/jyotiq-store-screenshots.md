---
name: jyotiq-store-screenshots
description: "Play Store + App Store listing screenshots for the Jyotiq app, built 18 Nov 2026 in workspace/jyotiq-store-screenshots (prep.py → build.py HTML/Chrome)"
metadata:
  node_type: memory
  type: project
  originSessionId: c25ad095-2902-4622-8cea-a1c484844d4f
  modified: 2026-11-18T12:42:30.605Z
---

18 Nov 2026: Ayush sent 18 phone screenshots of the new Jyotiq app (UAT 2.2.0-63 APK) and two Netflix Play listing images as the style reference. He asked for feature-highlight store images for both Play and iOS. The build is in `~/.kiro/crew/workspace/jyotiq-store-screenshots`:
- `prep.py` cuts the Android bars, upscales 2x, and replaces "Ayush!" with "Priya!" in Playfair Bold.
- `build.py` builds 8 slides: a saffron gradient, a kicker pill, a Playfair headline with one gold word, a Lato sub-line, and a drawn phone frame. It outputs play 1080x1920 + feature graphic 1024x500, ios69 1320x2868 and ios65 1284x2778.
- `sheet.py` makes contact sheets.

The APK is a Flutter app. Unzipping `assets/flutter_assets/assets/` gives the real fonts (PlayfairDisplay, Lato, Baskervville wordmark) and the 3D art (jyotiq-logo.png, flame.webp, welcome-*.png). Gotcha: `home_screen/kundali-chart.webp` is an eye/galaxy image. The kundali scroll is `welcome-vedic-guide.png`.

**How to apply:** for new app versions or a Hindi copy set, swap `src/raw` or edit `SLIDES` and re-run; it renders in about 2 min. Related: [[jyotiq-static-posts]].
