import { album } from "../config/album";

type StemName = keyof typeof album.audio.stemBase;
const STEM_NAMES = Object.keys(album.audio.stemBase) as StemName[];

const FORMAT_MIME: Record<string, string> = {
	opus: 'audio/ogg; codecs="opus"',
	m4a: 'audio/mp4; codecs="mp4a.40.2"',
};

/**
 * AudioEngine — owns the AudioContext, stem loading and musical timing.
 * It never touches the DOM; the entrance controller only reads its clock.
 *
 * Multi-stem arrangement (handoff doc §5–6):
 * - All stems start on the same AudioContext timestamp and loop together.
 * - Entrance tension: only `inst` is audible; `bass` and `pluck` play
 *   muted (gain 0) on the same timeline so sync can never drift.
 * - Release: their gains ramp up from bar `buildStartBar` over
 *   `buildBars` bars — once. Later loop passes keep all stems at 1.
 */
export class AudioEngine {
	private ctx: AudioContext | null = null;
	private buffers = new Map<StemName, AudioBuffer>();
	private fetchPromises = new Map<StemName, Promise<ArrayBuffer>>();
	private format: string | null = null;

	private gains = new Map<StemName, GainNode>();
	private mixBus: GainNode | null = null;
	private filter: BiquadFilterNode | null = null;
	private masterGain: GainNode | null = null;

	/** AudioContext time at which the current loop pass started. */
	private loopStartedAt = 0;
	private loopDuration = 0;
	private playing = false;
	private muted = false;

	/** Refined from decoded buffers on load; bpm is the fallback. */
	private secondsPerBeat = 60 / album.bpm;

	get secondsPerBar(): number {
		return this.secondsPerBeat * album.beatsPerBar;
	}

	get isPlaying(): boolean {
		return this.playing;
	}

	get isMuted(): boolean {
		return this.muted;
	}

	/**
	 * Create/resume the AudioContext. Must be called inside a user gesture
	 * before playback, but prefetch() may run earlier.
	 */
	private ensureContext(): AudioContext {
		if (!this.ctx) {
			this.ctx = new AudioContext();
		}
		if (this.ctx.state === "suspended") {
			void this.ctx.resume();
		}
		return this.ctx;
	}

	/**
	 * Pick the first container/codec the browser can decode. Ogg Opus
	 * wins where supported; old iOS Safari (< 18.4) can't decode it and
	 * falls through to AAC/m4a.
	 *
	 * Debug override: `?format=m4a` (or `opus`) forces a format, e.g. to
	 * test the fallback path in Chrome.
	 */
	private pickFormat(): string {
		const forced = new URLSearchParams(location.search).get("format");
		if (forced && (album.audio.formats as readonly string[]).includes(forced)) {
			console.info(`Audio format forced by query param: ${forced}`);
			return forced;
		}
		const probe = document.createElement("audio");
		for (const fmt of album.audio.formats) {
			if (probe.canPlayType(FORMAT_MIME[fmt] ?? fmt) !== "") return fmt;
		}
		return album.audio.formats[album.audio.formats.length - 1];
	}

	/** Start fetching all stems ahead of time (idle prefetch). No decode yet. */
	prefetch(): void {
		if (!this.format) this.format = this.pickFormat();
		for (const name of STEM_NAMES) {
			if (!this.fetchPromises.has(name)) {
				this.fetchPromises.set(
					name,
					fetch(`${album.audio.stemBase[name]}.${this.format}`).then((res) => {
						if (!res.ok) throw new Error(`Stem "${name}" fetch failed: ${res.status}`);
						return res.arrayBuffer();
					}),
				);
			}
		}
	}

	/**
	 * Fetch + decode every stem. If decode fails (canPlayType is
	 * occasionally optimistic), drop everything and retry with the next
	 * format in the list.
	 */
	async load(): Promise<void> {
		const ctx = this.ensureContext();
		if (!this.format) this.format = this.pickFormat();
		const formats = album.audio.formats;

		for (let i = formats.indexOf(this.format); i < formats.length; i++) {
			if (this.format !== formats[i]) {
				this.format = formats[i];
				this.fetchPromises.clear();
			}
			this.prefetch();
			try {
				await Promise.all(
					STEM_NAMES.map(async (name) => {
						const data = await this.fetchPromises.get(name)!;
						this.buffers.set(name, await ctx.decodeAudioData(data));
					}),
				);
				break;
			} catch (err) {
				if (i === formats.length - 1) throw err;
				console.warn(`Stem format "${formats[i]}" failed, trying "${formats[i + 1]}":`, err);
				this.buffers.clear();
			}
		}

		const inst = this.buffers.get("inst")!;
		this.loopDuration = inst.duration;
		// Phase-lock the bar grid to the actual loop length so the grid
		// can never drift against the audio, no matter how long it loops.
		this.secondsPerBeat = this.loopDuration / (album.barsPerLoop * album.beatsPerBar);
	}

	private buildGraph(): void {
		const ctx = this.ctx!;
		this.masterGain = ctx.createGain();
		this.masterGain.gain.value = this.muted ? 0 : 1;
		this.masterGain.connect(ctx.destination);
		// stem gains -> mixBus (entrance gain) -> lowpass -> master
		this.filter = ctx.createBiquadFilter();
		this.filter.type = "lowpass";
		this.filter.Q.value = 0.7;
		this.filter.connect(this.masterGain);
		this.mixBus = ctx.createGain();
		this.mixBus.connect(this.filter);
		for (const name of STEM_NAMES) {
			const gain = ctx.createGain();
			gain.connect(this.mixBus);
			this.gains.set(name, gain);
		}
	}

	/** Start every stem on the same timestamp so they stay sample-aligned. */
	private startSources(at: number, initialGains: Record<StemName, number>): void {
		const ctx = this.ctx!;
		for (const name of STEM_NAMES) {
			const source = ctx.createBufferSource();
			source.buffer = this.buffers.get(name)!;
			source.loop = true; // whole file — exported with wrap remainder
			source.connect(this.gains.get(name)!);
			this.gains.get(name)!.gain.setValueAtTime(initialGains[name], at);
			source.start(at);
		}
		this.loopStartedAt = at;
		this.playing = true;
	}

	/**
	 * Entrance: inst alone carries the tension; bass + pluck are on the
	 * same timeline at gain 0, then fade in over the build bars.
	 * Returns the loop start time and the build (release) time.
	 */
	async startEntrance(): Promise<{ startAt: number; buildAt: number }> {
		if (this.buffers.size === 0) await this.load();
		this.ensureContext();
		if (!this.masterGain) this.buildGraph();

		const startAt = this.ctx!.currentTime + 0.08;
		// Tension: muffled lowpass + reduced gain on the whole mix bus.
		this.filter!.frequency.setValueAtTime(album.audio.entranceLowpassHz, startAt);
		this.mixBus!.gain.setValueAtTime(album.audio.entranceGain, startAt);
		this.startSources(startAt, { inst: 1, bass: 0, pluck: 0 });

		const buildAt = startAt + album.audio.buildStartBar * this.secondsPerBar;
		const buildEnd = buildAt + album.audio.buildBars * this.secondsPerBar;
		for (const name of ["bass", "pluck"] as const) {
			const gain = this.gains.get(name)!.gain;
			gain.setValueAtTime(0, buildAt);
			gain.linearRampToValueAtTime(1, buildEnd);
		}
		// Release: the filter opens and full gain returns over a longer,
		// slower ramp than the stem fade-in, so the brightness blooms
		// gradually after the arrangement arrives.
		const releaseEnd = buildAt + album.audio.releaseRampBars * this.secondsPerBar;
		this.filter!.frequency.setValueAtTime(album.audio.entranceLowpassHz, buildAt);
		this.filter!.frequency.exponentialRampToValueAtTime(19000, releaseEnd);
		this.mixBus!.gain.setValueAtTime(album.audio.entranceGain, buildAt);
		this.mixBus!.gain.linearRampToValueAtTime(1, releaseEnd);
		return { startAt, buildAt };
	}

	/** Late join from silent mode: full mix from the loop start. */
	async startFullMix(): Promise<number> {
		if (this.buffers.size === 0) await this.load();
		this.ensureContext();
		if (!this.masterGain) this.buildGraph();

		const startAt = this.ctx!.currentTime + 0.08;
		this.filter!.frequency.setValueAtTime(19000, startAt);
		this.mixBus!.gain.setValueAtTime(1, startAt);
		this.startSources(startAt, { inst: 1, bass: 1, pluck: 1 });
		return startAt;
	}

	mute(): void {
		this.muted = true;
		if (this.ctx && this.masterGain) {
			this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.03);
		}
	}

	unmute(): void {
		this.muted = false;
		if (this.ctx && this.masterGain) {
			this.masterGain.gain.setTargetAtTime(1, this.ctx.currentTime, 0.03);
		}
	}

	async pause(): Promise<void> {
		if (this.ctx?.state === "running") await this.ctx.suspend();
	}

	async resume(): Promise<void> {
		if (this.ctx?.state === "suspended") await this.ctx.resume();
	}

	/** Seconds into the current loop pass. */
	getCurrentTime(): number {
		if (!this.ctx || !this.playing || this.loopDuration === 0) return 0;
		const elapsed = this.ctx.currentTime - this.loopStartedAt;
		return ((elapsed % this.loopDuration) + this.loopDuration) % this.loopDuration;
	}

	/** Absolute AudioContext time of the next beat boundary. */
	getNextBeatTime(): number {
		return this.nextGridTime(this.secondsPerBeat);
	}

	/** Absolute AudioContext time of the next bar (downbeat). */
	getNextBarTime(): number {
		return this.nextGridTime(this.secondsPerBar);
	}

	/** Seconds from now until an absolute AudioContext time (for scheduling UI). */
	timeUntil(audioTime: number): number {
		if (!this.ctx) return 0;
		return audioTime - this.ctx.currentTime;
	}

	private nextGridTime(grid: number): number {
		if (!this.ctx || !this.playing || this.loopDuration === 0) return 0;
		const pos = this.getCurrentTime();
		const next = (Math.floor(pos / grid) + 1) * grid;
		return this.ctx.currentTime + (next - pos);
	}
}

export const audioEngine = new AudioEngine();
