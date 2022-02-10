import { trigger } from "./event";
import {
	getClosestMeasureStart,
	getCurrentTimeSignature,
	getNoteDurationForTimeSignature,
	TimeSignature,
} from "./music";
import { ChordNotation, NoteNotation, RestNotation, Notation, TempoNotation, TimeSignatureNotation } from "./parser";

declare var Tone: any;

const sampler = new Tone.Sampler({
	urls: {
		A0: "A0.mp3",
		C1: "C1.mp3",
		"D#1": "Ds1.mp3",
		"F#1": "Fs1.mp3",
		A1: "A1.mp3",
		C2: "C2.mp3",
		"D#2": "Ds2.mp3",
		"F#2": "Fs2.mp3",
		A2: "A2.mp3",
		C3: "C3.mp3",
		"D#3": "Ds3.mp3",
		"F#3": "Fs3.mp3",
		A3: "A3.mp3",
		C4: "C4.mp3",
		"D#4": "Ds4.mp3",
		"F#4": "Fs4.mp3",
		A4: "A4.mp3",
		C5: "C5.mp3",
		"D#5": "Ds5.mp3",
		"F#5": "Fs5.mp3",
		A5: "A5.mp3",
		C6: "C6.mp3",
		"D#6": "Ds6.mp3",
		"F#6": "Fs6.mp3",
		A6: "A6.mp3",
		C7: "C7.mp3",
		"D#7": "Ds7.mp3",
		"F#7": "Fs7.mp3",
		A7: "A7.mp3",
		C8: "C8.mp3",
	},
	release: 10,
	baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();

const DEFAULT_BPM = 120;
const DEFAULT_BIM = 4;
const DEFAULT_BEAT_NOTE = 4;
Tone.Transport.bpm.value = DEFAULT_BPM;
Tone.Transport.pause();

class Player {
	// Music
	private music?: Notation[][];
	private duration: number = 0;
	private timeSignatures: TimeSignature[] = [];

	// Play State
	private _isPlaying: boolean = false;
	private startTime: number = 0;
	private pollInterval?: number;

	constructor() {
		Tone.Transport.stop();
	}

	initialise() {
		Tone.start();
	}

	loadMusic(music: Notation[][]) {
		Tone.Transport.stop();
		Tone.Transport.cancel();

		this.music = music;
		this.duration = 0;
		const timeSignatures: TimeSignature[] = [
			{ time: 0, beatsPerMinute: DEFAULT_BPM, beatsInMeasure: DEFAULT_BIM, beatNote: DEFAULT_BEAT_NOTE },
		];
		this.timeSignatures = timeSignatures;

		let bpm: number; // Beats per minute.
		let bps: number; // Beats per second.
		let bim: number; // Beats in measure.
		let beatNote: number;
		let timeOffset: number; // Offset from start of the song in seconds.
		let lastTempoChange: number = -1;
		let lastSignatureChange = -1;

		/**
		 * Queues the provided note on the transport.
		 *
		 * @param note The note to queue.
		 * @param incrementTime Whether to increment the time for future notes.
		 */
		function queueNote(note: NoteNotation, incrementTime: boolean = true) {
			let pitch = note.pitch || "";

			const noteDuration = getNoteDurationForTimeSignature(
				note.duration,
				getCurrentTimeSignature(timeOffset, timeSignatures)
			);

			Tone.Transport.schedule(() => {
				sampler.triggerAttackRelease(`${note.tone}${pitch}${note.octave}`, noteDuration);
			}, timeOffset);

			if (incrementTime) {
				timeOffset += noteDuration;
			}
		}

		music.forEach((track) => {
			bpm = DEFAULT_BPM;
			bps = bpm / 60;
			bim = DEFAULT_BIM;
			beatNote = DEFAULT_BEAT_NOTE;
			timeOffset = 0;

			track.forEach((symbol) => {
				if (symbol.type === "note") {
					queueNote(symbol as NoteNotation);
				} else if (symbol.type === "chord") {
					const chord = symbol as ChordNotation;

					for (let i = 0; i < chord.notes.length; i++) {
						queueNote(chord.notes[i] as NoteNotation, i === chord.notes.length - 1);
					}
				} else if (symbol.type === "rest") {
					const rest = symbol as RestNotation;
					const restDuration = getNoteDurationForTimeSignature(
						rest.duration,
						getCurrentTimeSignature(timeOffset, timeSignatures)
					);
					timeOffset += restDuration;
				} else if (symbol.type === "tempo-change") {
					const tempoChange = symbol as TempoNotation;
					bpm = tempoChange.tempo;

					let changeTime = getClosestMeasureStart(timeOffset, timeSignatures);

					if (changeTime > lastTempoChange) {
						lastTempoChange = changeTime;
						const signatureRange = { time: changeTime, beatsPerMinute: bpm, beatsInMeasure: bim, beatNote };
						if (changeTime === 0) {
							timeSignatures[0] = signatureRange;
						} else {
							timeSignatures.push(signatureRange);
						}
					}
				} else if (symbol.type === "time-signature-change") {
					const timeSignatureChange = symbol as TimeSignatureNotation;
					if (timeSignatureChange.beatsInMeasure) {
						bim = timeSignatureChange.beatsInMeasure;
					}
					if (timeSignatureChange.beatNote) {
						beatNote = timeSignatureChange.beatNote;
					}

					let changeTime = getClosestMeasureStart(timeOffset, timeSignatures);

					if (changeTime > lastSignatureChange) {
						lastSignatureChange = changeTime;
						const signatureRange = { time: changeTime, beatsPerMinute: bpm, beatsInMeasure: bim, beatNote };
						if (changeTime === 0) {
							timeSignatures[0] = signatureRange;
						} else {
							timeSignatures.push(signatureRange);
						}
					}
				}
			});

			if (timeOffset > this.duration) {
				this.duration = timeOffset;
			}
		});
	}

	playMusic() {
		this._isPlaying = true;
		Tone.Transport.start();
		Tone.Transport.seconds = this.startTime;

		this.pollInterval = window.setInterval(this.poll.bind(this), 1);
	}

	pauseMusic() {
		this.startTime = this.getTime();
		this.stopMusic();
	}

	stopMusic() {
		this._isPlaying = false;
		Tone.Transport.pause();

		// Manually trigger event to update caret to the new position.
		trigger("player:playing");

		if (this.pollInterval) {
			window.clearInterval(this.pollInterval);
			this.pollInterval = undefined;
		}
	}

	isPlaying(): boolean {
		return this._isPlaying;
	}

	poll() {
		if (Tone.Transport.seconds > this.duration) {
			this.stopMusic();
		}
		trigger("player:playing");
	}

	getTime() {
		if (this._isPlaying) {
			return Tone.Transport.seconds;
		} else {
			return this.startTime;
		}
	}

	getTimeInMeasures() {
		let measureCount = 0;
		let measureLength = 0;
		let timeSignatures = [...this.timeSignatures];
		let currentTime = this.getTime();
		if (currentTime > this.duration) {
			currentTime = this.duration;
		}

		let time = 0;
		while (true) {
			const newTimeSignature = timeSignatures.find((timeSignature) => {
				return time >= timeSignature.time;
			});

			if (newTimeSignature) {
				measureLength = newTimeSignature.beatsInMeasure / (newTimeSignature.beatsPerMinute / 60);
			}

			if (currentTime - time >= measureLength) {
				measureCount++;
				time += measureLength;
			} else if (currentTime - time > 0) {
				measureCount += (currentTime - time) / measureLength;
				break;
			} else {
				break;
			}
		}

		return measureCount;
	}

	/**
	 * Sets the time of the transport in seconds.
	 *
	 * @param time Time in seconds.
	 */
	setTime(time: number) {
		// If the time is greater than the duration of the song, set it to the start.
		if (time >= this.duration) {
			time = 0;
		}

		Tone.Transport.seconds = time;
		if (!this._isPlaying) {
			this.startTime = time;
		}
	}

	/**
	 * Sets the time of the transport in measures, accounting for variable measure lengths.
	 * @param measures Time in measures.
	 */
	setTimeInMeasures(measures: number) {
		let secondsCount = 0;
		let measureLength = 0;
		let timeSignatures = [...this.timeSignatures];

		while (true) {
			const newTimeSignature = timeSignatures.find((timeSignature) => {
				return secondsCount >= timeSignature.time;
			});

			if (newTimeSignature) {
				measureLength = newTimeSignature.beatsInMeasure / (newTimeSignature.beatsPerMinute / 60);
			}

			if (measures > 1) {
				measures--;
				secondsCount += measureLength;
			} else if (measures > 0) {
				secondsCount += measureLength * measures;
				break;
			} else {
				break;
			}
		}

		this.setTime(secondsCount);
	}

	playNote(note: string) {
		sampler.triggerAttack(note);
	}

	releaseNote(note: string) {
		sampler.triggerRelease(note);
	}
}

export const player = new Player();
