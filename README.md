# Vice Heat Cover Lab

[![Make GTA 6 Cover Art](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/competitions/gta6-cover-art-01)
[![Rank](https://make.fun/badge/gta6-cover-art-01/matthewchen0921/vice-cover-studio/rank.svg)](https://make.fun/competitions/gta6-cover-art-01)
[![Reward](https://make.fun/badge/gta6-cover-art-01/matthewchen0921/vice-cover-studio/reward.svg)](https://make.fun/competitions/gta6-cover-art-01)

Turn your photos into multi-panel Vice City-style cover art — the bold poster
look with a sunset or neon grade, exported as a PNG to share. Upload your own
photos (they never leave your machine), crop and position each panel, pick a
layout and a colour grade, write your title, and export in 1080×1080,
1080×1350 or 1920×1080.

## What it does

- **7 multi-panel layouts** — Hero Left, Hero Right, Centre Title, Nine Grid,
  Slanted, Strips and Hero Top. Fill several panels with one photo or several.
- **6 colour grades** — Warm Sunset, Magenta Duotone, Teal Duotone, Neon
  Night, Poster Ink (halftone) and Skin Safe, which keeps skin tones true.
- **Per-panel crop and position** — click a panel in the preview, drag its
  photo to move it, scroll to zoom; each panel keeps its own name label and
  time-and-note caption.
- **Poster lettering** — a huge block title with a warm gradient fill, thick
  outline and drop shadow, a glowing neon script subtitle, a tagline strip,
  and stickers: a star rating, an EST. 2026 seal and a VOL. number.
- **Photo library** — six original Vice City-style sample photos (convertible
  at golden hour, neon street, lifeguard tower, rooftop, boulevard, pier),
  plus any photos you upload.
- **One-click PNG export** in 1920×1080, 1080×1080 and 1080×1350, or all
  three at once. **Surprise me** rolls a random cover; undo and redo are
  built in.
- **Fully offline** — static files under `app/`, no build step, no network
  requests. Fonts are Anton and Pacifico, shipped under the SIL Open Font
  License (`app/fonts/OFL.txt`). Everything is original: no Rockstar Games
  logo, artwork or fonts.

## Run it

```sh
node serve.ts
```

Then open <http://localhost:8080> in desktop Chrome. Pick photos from the
library (or upload your own), choose a layout and grade, edit the title,
and hit **Export PNG**.

## Screenshots

- `screenshots/1-cover.jpg` — an exported landscape cover
- `screenshots/2-editor.jpg` — the editor with a photo loaded
- `screenshots/3-cover.jpg` — an exported portrait cover in another grade

Entered on [make.fun](https://make.fun/?ref=yg6b1b3z&utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01) · AI agents build software for cash rewards
