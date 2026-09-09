/**
 * Temporary site config (handoff doc §22).
 * Replace values as soon as real content is confirmed.
 */
export const album = {
	artist: "Sappho",
	title: "[TBD]",
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
		 * Sample-aligned stems (48kHz, ~97.56s each). Base paths only —
		 * the engine appends the first decodable extension from
		 * `formats` (Opus for modern browsers, AAC/m4a for old iOS
		 * Safari where decodeAudioData can't handle Ogg Opus).
		 *
		 * Arrangement build: inst plays alone from the loop start;
		 * bass + pluck fade in from `buildStartBar` (0-based, ≈15.61s)
		 * over `buildBars` bars. Afterwards all three loop at full gain.
		 */
		stemBase: {
			inst: "/music/260823_inst",
			bass: "/music/260823_bass",
			pluck: "/music/260823_pluck_osti",
		},
		formats: ["opus", "m4a"],
		buildStartBar: 8,
		/** bass/pluck fade-in length (bars), from buildStartBar. */
		buildBars: 1,
		/**
		 * Entrance tension on top of the inst-only arrangement: the whole
		 * mix runs through a lowpass at reduced gain until the build,
		 * where the filter opens and full gain returns. This brightening
		 * is deliberately slower than the stem fade-in (`buildBars`).
		 */
		releaseRampBars: 4,
		entranceLowpassHz: 450,
		entranceGain: 0.7,
	},

	concept: [
		"We were never meant to stay, but something always does.",
		"過ぎ去る時のなかで、決して消えない何か。",
	],

	tracks: [
		"Sappho feat. まより - Ephemeris (Intro Ver.)",
		"Sappho - Metropolitan Hills",
		"Sappho feat. まより - Ephemeris",
		"Sappho - A Legacy Of Stars",
		"Sappho - Starry Night",
		"Sappho - Frosty Memories",
		"Sappho - [Remix from to be disclosed]",
		"Sappho - [Remix from to be disclosed]",
		"Sappho feat. まより - Ephemeris (Outro Ver.)",
		"Sappho feat. まより - Ephemeris (Unmastered Inst.)",
	],

	eventInfo: {
		date: "2026-10-25",
		event: "M3 2026 Autumn",
		venue: "東京流通センター(TRC) 第一展示場",
		booth: "G-21a",
		price: "[To be disclosed]",
		format: "CD",
	},

	credits: [
		{ role: "Composition", name: "Sappho" },
		{ role: "Arrangement", name: "Sappho" },
		{ role: "Remix", name: "Phenom, BLACKNYAO" },
		{ role: "Vocal", name: "まより" },
		{ role: "Lyrics", name: "紅葉月城" },
		{ role: "Illustration", name: "[To be disclosed]" },
		{ role: "Special thanks to", name: "Avery Berman" },
	],

	/** Only confirmed links are rendered. */
	links: [] as { label: string; url: string }[],
};
