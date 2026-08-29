# M3 Booth — Sappho Sound album promo site

Single-page interactive microsite for the M3 2026 Autumn album (event: 2026-10-25).
Handoff spec: `docs/M3_2026_Autumn_Album_Promotion_Site_Handoff_v0.2.md`.

## Stack

- Astro 5 + `@astrojs/cloudflare` adapter, deployed via Wrangler (`wrangler.json`).
- Vanilla TypeScript client scripts only — no UI framework, no state library.

## Commands

- `npm run dev` — dev server (localhost:4321)
- `npm run build` — production build
- `npm run check` — build + `tsc` + `wrangler deploy --dry-run`
- `npm run deploy` — `wrangler deploy`

## Key structure

- `src/config/album.ts` — all site content/audio config (BPM, entrance bars, tracklist, credits, links). Edit content here, not in components.
- `src/scripts/audio-engine.ts` — AudioContext, stem buffers, bar/beat grid. Never touches the DOM. All stems start on one timestamp and loop together; entrance plays `inst` alone, then `bass`+`pluck` ramp in from `buildStartBar` over `buildBars` (once — later loop passes stay full mix).
- `src/scripts/entrance-controller.ts` — state machine (idle → loading-audio → entrance-playing → entering → main / silent), schedules visual release against the AudioContext clock.
- `src/styles/ocean.css` — the single persistent scene (sky/horizon/sea/wind/grain). States via `body[data-state]`; sections never replace the scene.

## Audio notes

- `/public/music/260823_{inst,bass,pluck_osti}.opus` — sample-aligned 48kHz stereo Opus stems, all exactly 97.567458s ≈ 50 bars @ 123 BPM, FL Studio Wrap Remainder export (seamless loop). `260823_full.opus` is the reference mix, currently unused by the site.
- Build timing: `buildStartBar: 8` (≈15.61s), `buildBars: 1` — visual release (`--release-s`) matches the build length.
- The engine re-derives `secondsPerBeat` from `buffer.duration / barsPerLoop` so the bar grid stays phase-locked to the loop. If the track changes, update `barsPerLoop`/`bpm` in `src/config/album.ts`.

## Design judgement criteria

See doc §20: effects must reinforce "sunset sea + occasional wind", never overpower the first-kick moment, prefer variation of existing material over new effects.
