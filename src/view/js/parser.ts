export interface Notation {
	type: "note" | "chord" | "rest" | "tempo-change" | "time-signature-change";
}

export interface NoteNotation extends Notation {
	tone: Tone;
	pitch?: Pitch;
	octave: number;
	duration: number;
	startOffset?: number;
	color?: "pink" | "green";
}

export interface ChordNotation extends Notation {
	notes: NoteNotation[];
}

export interface RestNotation extends Notation {
	duration: number;
}

export interface TempoNotation extends Notation {
	tempo: number;
}

export interface TimeSignatureNotation extends Notation {
	beatsInMeasure: number;
	beatNote: number;
}

type Pitch = "b" | "#";

type Tone = "c" | "d" | "e" | "f" | "g" | "a" | "b";
const tones = ["c", "d", "e", "f", "g", "a", "b"];

class Parser {
	private trackNotations: string[];
	private currentTrack: string = "";
	private i: number = 0;

	constructor(trackNotations: string);
	constructor(trackNotations: string[]);
	constructor(trackNotations: string | string[]) {
		if (typeof trackNotations === "string") {
			this.trackNotations = [trackNotations];
		} else {
			this.trackNotations = trackNotations;
		}
	}

	parse(): Notation[][] {
		return this.trackNotations.map((trackNotation, index) => {
			return this.parseTrack(index);
		});
	}

	parseTrack(trackIndex: number): Notation[] {
		this.currentTrack = this.trackNotations[trackIndex];
		this.i = 0;

		const track: Notation[] = [];

		let octave = 4;
		let append = false;
		let isChord = false;
		let chord: ChordNotation | undefined;
		let lineComment = false;
		let blockComment = false;

		const closeChord = () => {
			// Chord Close
			isChord = false;
			track.push(chord!);
			chord = undefined;
			this.next();
		};

		for (; this.i < this.currentTrack.length; ) {
			// Comment End
			if (lineComment) {
				if (this.get() === "\n") {
					lineComment = false;
				}

				this.next();
				continue;
			} else if (blockComment) {
				if (this.get() === "*" && this.find(1) === "/") {
					blockComment = false;
					this.next();
				}

				this.next();
				continue;
			}

			if (tones.indexOf(this.get().toLowerCase()) !== -1) {
				// Note
				const tone = this.get() as Tone;
				this.next();

				let pitch: Pitch | undefined;
				const character = this.get();
				if (["+", "-"].indexOf(character) !== -1) {
					switch (character) {
						case "+":
							pitch = "#";
							break;
						case "-":
							pitch = "b";
							break;
					}
					this.next();
				}

				let duration = this.nextDuration() || 4;

				if (append) {
					append = false;

					const notes = isChord ? chord!.notes : track;

					if (notes.length > 0 && notes[notes.length - 1].type === "note") {
						const previousNote = notes[notes.length - 1] as NoteNotation;
						if (previousNote.tone === tone && previousNote.pitch === pitch && previousNote.octave === octave) {
							previousNote.duration = addDurations(duration, previousNote.duration);
							continue;
						}
					}
				}

				const note = { tone, pitch, octave: octave, duration: duration, type: "note" } as NoteNotation;
				if (isChord) {
					chord!.notes.push(note);
				} else {
					track.push(note);
				}
			} else if (this.get() === "&") {
				// Append
				append = true;
				this.next();
			} else if (this.get() === "[") {
				// Chord Open
				isChord = true;
				chord = { notes: [], type: "chord" };
				this.next();
			} else if (this.get() === "]") {
				// Chord Close
				closeChord();
			} else if (this.get().toLowerCase() === "r") {
				// Rest
				this.next();
				const duration = this.nextDuration() || 4;

				if (append) {
					append = false;

					if (track.length > 0 && track[track.length - 1].type === "rest") {
						const previousRest = track[track.length - 1] as RestNotation;

						previousRest.duration = addDurations(duration, previousRest.duration);
						continue;
					}
				}

				track.push({ duration, type: "rest" } as RestNotation);
			} else if (["<", ">"].indexOf(this.get()) !== -1) {
				// Octave Shift
				if (this.get() === ">") {
					octave++;
				} else {
					octave--;
				}
				this.next();
			} else if (this.get().toLowerCase() === "o") {
				// Octave Change
				this.next();
				octave = Number.parseInt(this.get());
				this.next();
			} else if (this.get().toLowerCase() === "t") {
				this.next();

				if (this.get() === "s") {
					// Time Signature Change
					this.next();
					const beatsInMeasure = this.nextNumber();
					let beatNote;

					if (this.get() === "/") {
						this.next();
						beatNote = this.nextNumber();
					}

					if (beatsInMeasure !== undefined && beatNote !== undefined) {
						track.push({ beatsInMeasure, beatNote, type: "time-signature-change" } as TimeSignatureNotation);
					}
				} else {
					// Tempo Change
					const tempo = this.nextNumber();
					if (tempo) {
						track.push({ tempo, type: "tempo-change" } as TempoNotation);
					}
				}
			} else if (this.get() === "/") {
				// Comment Start
				if (this.find(1) === "/") {
					lineComment = true;
					this.next();
				} else if (this.find(1) === "*") {
					blockComment = true;
					this.next();
				}
				this.next();
			} else {
				this.next();
			}
		}

		if (isChord) {
			closeChord();
		}

		function correctNote(note: NoteNotation) {
			if (note.tone === "c" && note.pitch === "b") {
				note.tone = "b";
				note.pitch = undefined;
				note.octave--;
			} else if (note.tone === "b" && note.pitch === "#") {
				note.tone = "c";
				note.pitch = undefined;
				note.octave++;
			}
		}
		track.forEach((symbol: Notation) => {
			if (symbol.type === "note") {
				correctNote(symbol as NoteNotation);
			} else if (symbol.type === "chord") {
				(symbol as ChordNotation).notes.forEach(correctNote);
			}
		});

		return track;
	}

	/**
	 * Gets the character at the current position.
	 */
	get(): string;
	/**
	 * Gets the range of characters indicated by the start and the end.
	 *
	 * @param start Index of the first character to get.
	 * @param end Index of the last character to get.
	 */
	get(start: number, end: number): string;
	get(start?: number, end?: number): string {
		if (start === undefined) {
			return this.currentTrack[this.i];
		} else {
			return this.currentTrack.substring(start, end);
		}
	}

	/**
	 * Gets the character at the provided offset from the pointer;
	 */
	find(offset: number): string | void {
		const findIndex = this.i + offset;

		if (findIndex < 0 || findIndex > this.currentTrack.length - 1) {
			return;
		}

		return this.currentTrack[findIndex];
	}

	/**
	 * Increments the pointer, returning whether the increment was successful.
	 * */
	next(): boolean {
		this.i++;

		if (this.i > this.currentTrack.length - 1) {
			return false;
		}

		return true;
	}

	/**
	 * Returns the next number in the notation and increments the pointer after it.
	 */
	nextNumber(): number | void {
		const numberStart = this.i;

		while (!isNaN(Number.parseInt(this.get())) && this.next()) {}

		if (this.i != numberStart) {
			return Number.parseInt(this.get(numberStart, this.i));
		}
	}

	nextDuration(): number | void {
		const originalDuration = this.nextNumber();

		if (originalDuration === undefined) {
			return;
		}

		let actualDuration = originalDuration;
		let dottedCount = 0;
		while (this.get() === ".") {
			this.next();
			dottedCount++;
			actualDuration = addDurations(actualDuration, originalDuration * (2 * dottedCount));
		}

		return actualDuration;
	}
}

function addDurations(duration1: number, duration2: number) {
	let combinedDuration = 1 / duration1 + 1 / duration2;
	combinedDuration = 1 / combinedDuration;
	return combinedDuration;
}

export function parse(musicNotation: string | string[]): Notation[][] {
	if (typeof musicNotation === "string") {
		return new Parser(musicNotation).parse();
	} else {
		return new Parser(musicNotation).parse();
	}
}
