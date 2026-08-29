/**
 * Temporary site config (handoff doc §22).
 * Replace values as soon as real content is confirmed.
 */
export const album = {
	artist: "Sappho Sound",
	title: "NEW ALBUM",
	subtitle: "",
	event: "M3 2026 Autumn",
	date: "2026-10-25",

	/**
	 * 260823_full.opus is 97.567s ≈ exactly 50 bars at 123 BPM.
	 * The audio engine re-derives secondsPerBar from the decoded buffer
	 * length and barsPerLoop so the bar grid stays phase-locked to the
	 * loop indefinitely. `bpm` is only used for pre-load estimates.
	 * TODO: confirm BPM / bar count against the DAW project.
	 */
	bpm: 123,
	beatsPerBar: 4,
	barsPerLoop: 50,
	entranceBars: 4,
	visualPulseBars: 2,

	audio: {
		/**
		 * Sample-aligned stems (all exactly 97.567458s, 48kHz Opus).
		 * Arrangement build: inst plays alone from the loop start;
		 * bass + pluck fade in from `buildStartBar` (0-based, ≈15.61s)
		 * over `buildBars` bars. Afterwards all three loop at full gain.
		 */
		stems: {
			inst: "/music/260823_inst.opus",
			bass: "/music/260823_bass.opus",
			pluck: "/music/260823_pluck_osti.opus",
		},
		buildStartBar: 8,
		buildBars: 1,
	},

	concept: [
		"노을 지는 바다를 바라보고 있는데, 이따금씩 바람이 불어오는 순간.",
		"Emotional progressive house — a short walk from the entrance into the sound.",
	],

	tracks: [
		{ title: "Track 01", note: "TBA" },
		{ title: "Track 02", note: "TBA" },
		{ title: "Track 03", note: "TBA" },
		{ title: "Track 04", note: "TBA" },
	],

	eventInfo: {
		date: "2026-10-25",
		event: "M3 2026 Autumn",
		venue: "TBA",
		booth: "TBA",
		price: "TBA",
		format: "TBA",
	},

	credits: [
		{ role: "Composition", name: "Sappho Sound" },
		{ role: "Arrangement", name: "Sappho Sound" },
		{ role: "Mixing", name: "TBA" },
		{ role: "Mastering", name: "TBA" },
		{ role: "Illustration", name: "TBA" },
		{ role: "Design", name: "Sappho Sound" },
	],

	/** Only confirmed links are rendered. */
	links: [] as { label: string; url: string }[],
};
