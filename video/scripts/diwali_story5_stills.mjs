// Day 5 picture review: bundle once, render key frames in one browser at 0.4 scale, into review/stills/.
// Usage (from the video folder): node ../diwali-story-d5/stills.mjs 0 60 148 ...
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
const EP = "/Users/ayushrajput/.kiro/crew/workspace/diwali-story-d5";
const OUT = path.join(EP, "review/stills");
fs.mkdirSync(OUT, { recursive: true });
const frames = process.argv.slice(2).map(Number);
const serveUrl = process.env.BUNDLE || await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.join(EP, "public"), outDir: path.join(EP, "render/bundle") });
const browser = await openBrowser("chrome");
const composition = await selectComposition({ serveUrl, id: "DiwaliStory5", puppeteerInstance: browser });
for (const f of frames) {
  await renderStill({ serveUrl, composition, frame: f, output: path.join(OUT, `f_${String(f).padStart(4, "0")}.jpg`), imageFormat: "jpeg", jpegQuality: 85, scale: 0.4, puppeteerInstance: browser });
  console.log("still", f);
}
await browser.close({ silent: true });
console.log("DONE", serveUrl);
