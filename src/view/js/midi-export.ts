import { Notation, NoteNotation, ChordNotation, RestNotation, TempoNotation } from "./parser";
import { Midi, Track } from "@tonejs/midi";
import { Instrument } from "@tonejs/midi/dist/Instrument";

const DEFAULT_BPM = 120;
const DEFAULT_BEAT_NOTE = 4;

export default function createMidi(music: Notation[][]): Midi {
	const midi = new Midi();
	let midiTrack: Track;

	let bpm: number;
	let bps: number;
	let beatNote: number;
	let timeOffset: number;

	function addNote(note: NoteNotation, incrementTime: boolean = true) {
		let pitch = note.pitch || "";

		const beats = beatNote / note.duration;
		const duration = beats / bps;

		midiTrack.addNote({
			name: `${note.tone}${pitch}${note.octave}`,
			time: timeOffset,
			duration: duration,
		});

		if (incrementTime) {
			timeOffset += duration;
		}
	}

	music.forEach((track, i) => {
		bpm = DEFAULT_BPM;
		bps = bpm / 60;
		beatNote = DEFAULT_BEAT_NOTE;
		timeOffset = 0;

		midiTrack = midi.addTrack();
		if (i === 0) {
			midiTrack.name = "Harp";
		} else if (i === 1) {
			midiTrack.name = "Lute+1";
		}

		track.forEach((symbol) => {
			if (symbol.type === "note") {
				addNote(symbol as NoteNotation);
			} else if (symbol.type === "chord") {
				const chord = symbol as ChordNotation;

				for (let i = 0; i < chord.notes.length; i++) {
					addNote(chord.notes[i] as NoteNotation, i === chord.notes.length - 1);
				}
			} else if (symbol.type === "rest") {
				const rest = symbol as RestNotation;
				const beats = beatNote / rest.duration;
				const duration = beats / bps;
				timeOffset += duration;
			} else if (symbol.type === "tempo-change") {
				const tempoChange = symbol as TempoNotation;
				bpm = tempoChange.tempo;
				bps = bpm / 60;
			}
		});
	});

	return midi;
}
