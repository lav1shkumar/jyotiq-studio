# The Remotion workspace (ported from Ayush's Kiro `remotion` skill)

Project: `/Users/ayushrajput/.kiro/crew/workspace/video`. Always run project commands from inside it.

- If `node`/`npx` fail with `env: node: No such file or directory`, prefix the command with `export PATH="/usr/local/bin:$PATH";`. Node 24 and npm 11 are confirmed working.
- Layout: `src/index.ts` (registerRoot), `src/Root.tsx` (every `<Composition>`, shared by all series), `src/Jyotiq/...` (series code: `manthan/`, `diwali/`, `katha/`, `bbreel/`, shared `theme.ts`, `ui.tsx`, `motion.tsx`, `reelKit.tsx`, `endSting.tsx`), `public/` (`staticFile()` root), `scripts/` (Python audio pipeline), `remotion.config.ts` (rspack, jpeg frames, Tailwind v4), `out/`.
- A composition does not exist to preview or render until it is registered in `Root.tsx`. Prefer zod-typed props.

## Commands

```bash
cd /Users/ayushrajput/.kiro/crew/workspace/video
npm run dev                                   # Remotion Studio, http://localhost:3000 (keep in background)
npx remotion compositions                     # list ids
npx remotion still <Comp> out/frame.png --frame=75 --concurrency=1   # cheap visual check
npx remotion render <Comp> out/video.mp4 --concurrency=1 --scale=0.5 # quick low-RAM preview render
npm run lint                                  # eslint src && tsc; run after every .tsx edit
```

## Memory

The Mac has 8 GB and often under 2 GB free. Prefer single stills for validation; full renders use `--concurrency=1` and the chunked `render_final.sh` (see pipeline.md). `render --sequence` needs a dot-free relative output dir.

## Reuse map (read-only imports)

- Characters and rig: `manthan/rig.tsx` (`Puppet`, `pose`, `idle`, `blinkAt`, `talkAt`, `RigDefs`, `Vajra`, `handToWorld`), cast: indra, surya, chandra, agni, vayu, deva, swarbhanu, bali, asura generals.
- Beings: `manthan/ep2/beings2.tsx` (Vasuki body/head, Mandar), `ep2/beings3.tsx` (Vishnu, KurmaGlow), `ep6/dhanvantari.tsx`, `ep5/lakshmi.tsx`.
- Sets: `manthan/sets.tsx` (`KshiraSagar`, `Layer`, `Motes`, `Stars`), `ep2/sets2.tsx`, `churn.tsx`.
- Motion helpers: `manthan/kit.tsx`, `style.ts` (`World`, `shake`, `bump`, `fadeIn`, `inRange`, `W`, `H`, palette `P`).
- Graphics: `manthan/graphics.tsx` (`NameCard`, `BrandBug`, `KundaliGrid`, fonts `CINZEL`, `ROZHA`, `JAKARTA`), latest captions/end-card block in `ep7/gfx7.tsx`, lip-sync pattern in `ep7/voData.ts`.
- Score DSP helpers: `scripts/manthan_ep4_score.py` (tanpura_pluck, bell, choir_note, string_note, drum, make_ir, ...); instruments in `manthan_ep7_score.py`.

Series layout to keep in Manthan: Vasuki's head on the LEFT with the asuras, tail on the RIGHT with the devtas.
