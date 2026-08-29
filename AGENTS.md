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
- `src/scripts/audio-engine.ts` — AudioContext, stem buffers, bar/beat grid. Never touches the DOM. All stems start on one timestamp and loop together; entrance plays `inst` alone through a lowpass (`entranceLowpassHz`) at reduced gain (`entranceGain`), then from `buildStartBar` over `buildBars` the bass/pluck ramp in while the filter opens and full gain returns (once — later loop passes stay full mix).
- First screen is near-black; during `entrance-playing` each ocean layer fades in on a bar-locked stagger (`--bar-s` in `src/styles/ocean.css`). Silent entry skips the stagger.
- `src/scripts/entrance-controller.ts` — state machine (idle → loading-audio → entrance-playing → entering → main / silent), schedules visual release against the AudioContext clock.
- `src/styles/ocean.css` — the single persistent scene (sky/horizon/sea/wind/grain). States via `body[data-state]`; sections never replace the scene.

## Audio notes

- `/public/music/260823_{inst,bass,pluck_osti}.{opus,m4a}` — sample-aligned 48kHz stereo stems, ~97.56s ≈ 50 bars @ 123 BPM, FL Studio Wrap Remainder export (seamless loop). Opus is primary; m4a (AAC) is the fallback for old iOS Safari (`decodeAudioData` can't handle Ogg Opus before 18.4). The engine picks the format via `canPlayType`, with a decode-failure retry path. `260823_full.opus` is the reference mix, unused by the site.
- Build timing: `buildStartBar: 8` (≈15.6s). bass/pluck fade in over `buildBars: 1`; the lowpass/gain release ramps more slowly over `releaseRampBars: 4`. Visual release (`--release-s`) matches `buildBars`; the ocean layer stagger is spread across the 8 entrance bars.
- The engine re-derives `secondsPerBeat` from `buffer.duration / barsPerLoop` so the bar grid stays phase-locked to the loop. If the track changes, update `barsPerLoop`/`bpm` in `src/config/album.ts`.

## Design judgement criteria

See doc §20: effects must reinforce "sunset sea + occasional wind", never overpower the first-kick moment, prefer variation of existing material over new effects.
