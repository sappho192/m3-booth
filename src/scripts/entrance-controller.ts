import { album } from "../config/album";
import { audioEngine } from "./audio-engine";

/**
 * EntranceController — owns the experience state machine and all DOM
 * transitions. Musical timing comes from AudioEngine; visuals are
 * scheduled against the AudioContext clock, not frame-based timers.
 */

type ExperienceState =
	| "idle"
	| "loading-audio"
	| "entrance-playing"
	| "entering"
	| "main"
	| "silent";

class EntranceController {
	private state: ExperienceState = "idle";

	private els = {
		entrance: document.querySelector<HTMLElement>("#entrance")!,
		soundBtn: document.querySelector<HTMLButtonElement>("#enter-sound")!,
		silentBtn: document.querySelector<HTMLButtonElement>("#enter-silent")!,
		status: document.querySelector<HTMLElement>("#entrance-status")!,
		audioControl: document.querySelector<HTMLButtonElement>("#audio-control")!,
	};

	init(): void {
		document.body.classList.add("scroll-locked");
		this.setTimingVariables();
		this.els.soundBtn.addEventListener("click", () => void this.enterWithSound());
		this.els.silentBtn.addEventListener("click", () => this.enterSilently());
		this.els.audioControl.addEventListener("click", () => void this.toggleAudio());

		// §16: fetch the stems while the entrance is idle; decode only
		// after the user chooses sound.
		const prefetch = () => audioEngine.prefetch();
		if ("requestIdleCallback" in window) {
			window.requestIdleCallback(prefetch, { timeout: 4000 });
		} else {
			setTimeout(prefetch, 1500);
		}
	}

	private setTimingVariables(): void {
		const bar = (60 / album.bpm) * album.beatsPerBar;
		const root = document.documentElement.style;
		root.setProperty("--bar-s", `${bar.toFixed(3)}s`);
		root.setProperty("--pulse-s", `${(bar * album.visualPulseBars).toFixed(3)}s`);
		// The visual release lasts exactly as long as the audio build, so
		// the fade-in and the Hero completion read as one event.
		root.setProperty("--release-s", `${(bar * album.audio.buildBars).toFixed(3)}s`);
	}

	private setState(next: ExperienceState): void {
		this.state = next;
		document.body.dataset.state = next === "silent" ? "main" : next;
		this.updateAudioControl();
	}

	private async enterWithSound(): Promise<void> {
		if (this.state !== "idle") return;
		this.setState("loading-audio");
		this.els.soundBtn.disabled = true;
		this.els.status.textContent = "LOADING SOUND...";

		try {
			const { buildAt } = await audioEngine.startEntrance();
			this.setState("entrance-playing");
			this.els.status.textContent = "";
			this.scheduleRelease(buildAt);
		} catch (err) {
			// Audio failure must never block the site (§16).
			console.warn("Audio unavailable, entering silently:", err);
			this.enterSilently();
		}
	}

	/**
	 * The release lands on the build downbeat: bass + pluck start fading
	 * in and the Hero starts completing on the same bar boundary.
	 */
	private scheduleRelease(buildAt: number): void {
		setTimeout(() => this.revealMain(), Math.max(0, audioEngine.timeUntil(buildAt) * 1000));
	}

	private revealMain(): void {
		this.setState("entering");
		this.els.entrance.classList.add("is-leaving");
		document.body.classList.remove("scroll-locked");
		// Settle into main once the release-length transition finishes.
		const releaseMs = audioEngine.secondsPerBar * album.audio.buildBars * 1000;
		setTimeout(() => this.setState("main"), releaseMs + 100);
	}

	private enterSilently(): void {
		if (this.state !== "idle" && this.state !== "loading-audio") return;
		this.els.entrance.classList.add("is-leaving");
		document.body.classList.remove("scroll-locked");
		this.setState("silent");
	}

	private async toggleAudio(): Promise<void> {
		if (this.state === "silent" && !audioEngine.isPlaying) {
			this.els.audioControl.disabled = true;
			try {
				await audioEngine.startFullMix();
			} catch (err) {
				console.warn("Audio unavailable:", err);
			}
			this.els.audioControl.disabled = false;
			this.updateAudioControl();
			return;
		}
		if (audioEngine.isMuted) {
			audioEngine.unmute();
		} else {
			audioEngine.mute();
		}
		this.updateAudioControl();
	}

	private updateAudioControl(): void {
		const btn = this.els.audioControl;
		const playing = audioEngine.isPlaying && !audioEngine.isMuted;
		btn.setAttribute("aria-pressed", String(playing));
		btn.querySelector("[data-icon]")!.textContent = playing ? "❚❚" : "♪";
		btn.querySelector("[data-label]")!.textContent = playing ? "PREVIEW" : "PREVIEW OFF";
	}
}

export function initEntrance(): void {
	new EntranceController().init();
}
