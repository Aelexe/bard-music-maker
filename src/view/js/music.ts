import { ChordNotation, Notation, NoteNotation, RestNotation, TempoNotation, TimeSignatureNotation } from "./parser";

export interface TimeSignature {
	time: number; // Time in seconds from which this time signature takes effect.
	beatsPerMinute: number;
	beatsInMeasure: number;
	beatNote: number;
}

/**
 * Class representing music to be played or displayed.
 */
export class Music {
	private _timeSignatures: TimeSignature[] = [];
	private _measures: Measure[] = [];

	constructor() {}

	public get measures() {
		return this._measures;
	}

	public get timeSignatures() {
		return this._timeSignatures;
	}
}

class MusicParser {
	// Constants
	private DEFAULT_BPM = 120;
	private DEFAULT_BIM = 4;
	private DEFAULT_BEAT_NOTE = 4;

	// Parsing
	private beatsPerMinute: number = this.DEFAULT_BPM;
	private beatsInMeasure: number = this.DEFAULT_BIM;
	private beatNote: number = this.DEFAULT_BEAT_NOTE;
	private time: number = 0;
	private lastTempoRecord: number = -1;
	private lastSignatureRecord: number = -1;

	// Result
	private timeSignatures: TimeSignature[] = [];
	private measures: Measure[] = [];

	public getCurrentMeasureIndex(): number {
		let measureTime = getTimeInMeasures(this.time, this.timeSignatures);

		// This rounding is done to account for issues that can arise from working with less uniform note lengths.
		measureTime = Math.ceil(measureTime * 64) / 64;

		return Math.floor(measureTime);
	}

	public createMusicFromNotation(notations: Notation[][]): Music {
		const music = new Music();

		this.timeSignatures = music.timeSignatures;
		this.measures = music.measures;
		this.lastTempoRecord = -1;
		this.lastSignatureRecord = -1;

		// Add the default time signature.
		this.timeSignatures.push({
			time: 0,
			beatsPerMinute: this.DEFAULT_BPM,
			beatsInMeasure: this.DEFAULT_BIM,
			beatNote: this.DEFAULT_BEAT_NOTE,
		});

		notations.forEach((track: Notation[], trackIndex) => {
			this.beatsPerMinute = this.DEFAULT_BPM;
			this.beatsInMeasure = this.DEFAULT_BIM;
			this.beatNote = this.DEFAULT_BEAT_NOTE;
			this.time = 0;

			track.forEach((notation) => {
				if (notation.type === "note") {
					this.addNote(notation as NoteNotation, trackIndex);
				} else if (notation.type === "chord") {
					const chord = notation as ChordNotation;

					// If the chord is empty, don't attempt to render it.
					if (chord.notes.length === 0) {
						return;
					}

					chord.notes.forEach((note: NoteNotation) => {
						this.addNote(note, trackIndex, false);
					});

					const longestDuration = chord.notes.sort((note1: NoteNotation, note2: NoteNotation) => {
						return note1.duration - note2.duration;
					})[0].duration;

					this.time += getNoteDurationForTimeSignature(
						longestDuration,
						getCurrentTimeSignature(this.time, this.timeSignatures)
					);
				} else if (notation.type === "rest") {
					const rest = notation as RestNotation;

					this.time += getNoteDurationForTimeSignature(
						rest.duration,
						getCurrentTimeSignature(this.time, this.timeSignatures)
					);
				} else if (notation.type === "tempo-change") {
					const tempoChange = notation as TempoNotation;
					this.beatsPerMinute = tempoChange.tempo;

					let changeTime = getClosestMeasureStart(this.time, this.timeSignatures);

					if (changeTime > this.lastTempoRecord) {
						this.lastTempoRecord = changeTime;
						const signatureRange = {
							time: this.time,
							beatsPerMinute: this.beatsPerMinute,
							beatsInMeasure: this.beatsInMeasure,
							beatNote: this.beatNote,
						};
						if (changeTime === 0) {
							this.timeSignatures[0] = signatureRange;
						} else {
							this.timeSignatures.push(signatureRange);
						}
					}
				} else if (notation.type === "time-signature-change") {
					const timeSignatureChange = notation as TimeSignatureNotation;
					if (timeSignatureChange.beatsInMeasure) {
						this.beatsInMeasure = timeSignatureChange.beatsInMeasure;
					}
					if (timeSignatureChange.beatNote) {
						this.beatNote = timeSignatureChange.beatNote;
					}

					let changeTime = getClosestMeasureStart(this.time, this.timeSignatures);

					if (changeTime > this.lastSignatureRecord) {
						this.lastSignatureRecord = changeTime;
						const signatureRange = {
							time: changeTime,
							beatsPerMinute: this.beatsPerMinute,
							beatsInMeasure: this.beatsInMeasure,
							beatNote: this.beatNote,
						};
						if (changeTime === 0) {
							this.timeSignatures[0] = signatureRange;
						} else {
							this.timeSignatures.push(signatureRange);
						}
					}
				}
			});
		});

		return music;
	}

	/**
	 * Adds a note to the music.
	 *
	 * @param noteNotation The note notation to add a note for.
	 * @param trackIndex Track index of the note.
	 * @param incrementTime Whether to increment the time for future notes.
	 */
	private addNote(noteNotation: NoteNotation, trackIndex: number, incrementTime: boolean = true) {
		const measureIndex = this.getCurrentMeasureIndex();

		let timeInMeasures = getTimeInMeasures(this.time, this.timeSignatures);

		// Fix for minor rounding errors.
		if (timeInMeasures < measureIndex) {
			timeInMeasures = measureIndex;
		}

		// Get the time of the note as a decimal percentage of the current measure.
		const measureTime = timeInMeasures % 1;

		const timeSignature = getCurrentTimeSignature(this.time, this.timeSignatures);

		// Calculate the duration of the note.
		const duration = getNoteDurationForTimeSignature(noteNotation.duration, timeSignature);

		// Calculate the measure duration of the note.
		const measureDuration = timeSignature.beatNote / noteNotation.duration / timeSignature.beatsInMeasure;

		while (this.measures[measureIndex] === undefined) {
			this.addMeasure();
		}

		const note: Note = {
			tone: noteNotation.tone,
			pitch: noteNotation.pitch,
			octave: noteNotation.octave,
			time: this.time,
			measureTime: measureTime,
			duration: duration,
			measureDuration: measureDuration,
			track: trackIndex,
		};

		if (incrementTime) {
			this.time += duration;
		}

		this.measures[measureIndex].notes.push(note);
	}

	private addMeasure(measureIndex?: number) {
		const measure = { beats: this.beatsInMeasure, beatNote: this.beatNote, notes: [] };

		if (measureIndex !== undefined) {
			this.measures[measureIndex] = measure;
		} else {
			this.measures.push(measure);
		}
	}
}

const musicParser = new MusicParser();

export function createMusicFromNotation(notation: Notation[][]): Music {
	return musicParser.createMusicFromNotation(notation);
}

export interface Measure {
	beats: number;
	beatNote: number;
	notes: Note[];
}

export interface Note {
	tone: Tone;
	pitch?: Pitch;
	octave: number;
	/**
	 * Time for the note to be played in seconds.
	 */
	time: number;
	/**
	 * Duration for the note to be played in seconds.
	 */
	duration: number;
	/**
	 * Time of the note as a decimal percentage of the measure it occupies.
	 */
	measureTime: number;
	/**
	 * Duration of the note as a decimal percentage of the measure it occupies.
	 */
	measureDuration: number;
	track: number;
}

type Pitch = "b" | "#";
type Tone = "c" | "d" | "e" | "f" | "g" | "a" | "b";

export function getCurrentTimeSignature(time: number, timeSignatures: TimeSignature[]) {
	const passedTimeSignatures = timeSignatures.filter((timeSignature) => {
		return time >= timeSignature.time;
	});

	return passedTimeSignatures[passedTimeSignatures.length - 1];
}

/**
 * Returns the number of measures covered by the given time.
 * @param time Time in seconds.
 * @param timeSignatures Time signatures to count the measures by.
 * @returns The number of measures covered. Can be a decimal.
 */
export function getTimeInMeasures(time: number, timeSignatures: TimeSignature[]): number {
	let measureCount = 0; // The number of measures covered so far.
	let measureLength = 0; // The current length of a measure in seconds.
	timeSignatures = [...timeSignatures]; // Copy the time signature so it can be altered safely.

	// Sort the signatures so the first signature found will be the relevant one.
	timeSignatures.sort((signature1, signature2) => {
		return signature2.time - signature1.time;
	});

	let workingTime = 0; // Time covered so far.
	while (true) {
		// Get the latest active time signature.
		const timeSignature = timeSignatures.find((timeSignature) => {
			return workingTime >= timeSignature.time;
		});

		// Remove all time signatures not ahead of the current time.
		timeSignatures = timeSignatures.filter((timeSignature) => {
			return workingTime < timeSignature.time;
		});

		if (timeSignature) {
			const beatLength = 60 / timeSignature.beatsPerMinute;
			measureLength = beatLength * timeSignature.beatsInMeasure;
		}

		if (time - workingTime >= measureLength) {
			// If the remaining time is greater than the current length of a measure, add a measure.
			measureCount++;
			workingTime += measureLength;
		} else {
			if (time - workingTime > 0) {
				// Otherwise add the remaining percentage of a measure.
				measureCount += (time - workingTime) / measureLength;
			}
			break;
		}
	}

	return measureCount;
}

/**
 * Gets the start time in seconds of the measure closest the provided time.
 * @param time Time to get the closest measure start of.
 * @param timeSignatures
 */
export function getClosestMeasureStart(time: number, timeSignatures: TimeSignature[]): number {
	let measureLength = 0; // The current length of a measure in seconds.
	timeSignatures = [...timeSignatures]; // Copy the time signature so it can be altered safely.

	// Sort the signatures so the first signature found will be the relevant one.
	timeSignatures.sort((signature1, signature2) => {
		return signature2.time - signature1.time;
	});

	let workingTime = 0; // Time covered so far.
	let lastMeasure = 0;
	while (true) {
		// Get the latest active time signature.
		const timeSignature = timeSignatures.find((timeSignature) => {
			return workingTime >= timeSignature.time;
		});

		// Remove all time signatures not ahead of the current time.
		timeSignatures = timeSignatures.filter((timeSignature) => {
			return workingTime < timeSignature.time;
		});

		if (timeSignature) {
			const beatLength = 60 / timeSignature.beatsPerMinute;
			measureLength = beatLength * timeSignature.beatsInMeasure;
		}

		workingTime += measureLength;

		if (workingTime > time) {
			if (time - lastMeasure < workingTime - time) {
				return lastMeasure;
			} else {
				return workingTime;
			}
		}

		lastMeasure = workingTime;
	}
}

/**
 * Returns the duration of a note in seconds for the provided note and time signature.
 * @param noteLength Note to get the duration of.
 * @param timeSignature Time signature to get the duration for.
 * @returns Note duration in seconds.
 */
export function getNoteDurationForTimeSignature(noteLength: number, timeSignature: TimeSignature): number {
	const secondPerBeat = 60 / timeSignature.beatsPerMinute;
	const secondPerWholeNote = secondPerBeat * timeSignature.beatNote;

	return secondPerWholeNote / noteLength;
}
