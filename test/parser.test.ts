import { assert } from "chai";

import { parse, Symbol, Note, Chord, Rest, TempoChange } from "../src/view/js/parser";

describe("#parse", function () {
	describe("notes", function () {
		it("should parse notes", function () {
			assertMusic(parse("c4"), [{ tone: "c", octave: 4, duration: 4, type: "note" } as Note]);
			assertMusic(parse("a1"), [{ tone: "a", octave: 4, duration: 1, type: "note" } as Note]);
			assertMusic(parse("g32"), [{ tone: "g", octave: 4, duration: 32, type: "note" } as Note]);
		});
		it("should parse notes with pitches", function () {
			assertMusic(parse("a+4"), [{ tone: "a", pitch: "#", octave: 4, duration: 4, type: "note" } as Note]);
			assertMusic(parse("f+1"), [{ tone: "f", pitch: "#", octave: 4, duration: 1, type: "note" } as Note]);
			assertMusic(parse("g-2"), [{ tone: "g", pitch: "b", octave: 4, duration: 2, type: "note" } as Note]);
			assertMusic(parse("d-64"), [{ tone: "d", pitch: "b", octave: 4, duration: 64, type: "note" } as Note]);
		});
		it("should parse pitch corrected notes", function () {
			assertMusic(parse("c-4"), [{ tone: "b", octave: 3, duration: 4, type: "note" } as Note]);
			assertMusic(parse("b+4"), [{ tone: "c", octave: 5, duration: 4, type: "note" } as Note]);
		});
		it("should parse multiple notes", function () {
			assertMusic(parse("c4d4e4f4g4a4b4"), [
				{ tone: "c", octave: 4, duration: 4, type: "note" } as Note,
				{ tone: "d", octave: 4, duration: 4, type: "note" } as Note,
				{ tone: "e", octave: 4, duration: 4, type: "note" } as Note,
				{ tone: "f", octave: 4, duration: 4, type: "note" } as Note,
				{ tone: "g", octave: 4, duration: 4, type: "note" } as Note,
				{ tone: "a", octave: 4, duration: 4, type: "note" } as Note,
				{ tone: "b", octave: 4, duration: 4, type: "note" } as Note,
			]);
		});
		it("should parse multiple notes of varying durations", function () {
			assertMusic(parse("c1e2g4b16d32f64"), [
				{ tone: "c", octave: 4, duration: 1, type: "note" } as Note,
				{ tone: "e", octave: 4, duration: 2, type: "note" } as Note,
				{ tone: "g", octave: 4, duration: 4, type: "note" } as Note,
				{ tone: "b", octave: 4, duration: 16, type: "note" } as Note,
				{ tone: "d", octave: 4, duration: 32, type: "note" } as Note,
				{ tone: "f", octave: 4, duration: 64, type: "note" } as Note,
			]);
		});
		it("should parse an appended note", function () {
			assertMusic(parse("c4&c4"), [{ tone: "c", octave: 4, duration: 2, type: "note" } as Note]);
			assertMusic(parse("c2&c2"), [{ tone: "c", octave: 4, duration: 1, type: "note" } as Note]);
			assertMusic(parse("c1&c1"), [{ tone: "c", octave: 4, duration: 0.5, type: "note" } as Note]);
		});
		it("should parse a dotted note", function () {
			assertMusic(parse("c4."), [{ tone: "c", octave: 4, duration: 2.6666666666666665, type: "note" } as Note]);
		});
	});
	describe("chords", function () {
		it("should parse chords", function () {
			assertMusic(parse("[c4e4g4]"), [
				{
					notes: [
						{ tone: "c", octave: 4, duration: 4 } as Note,
						{ tone: "e", octave: 4, duration: 4 } as Note,
						{ tone: "g", octave: 4, duration: 4 } as Note,
					],
					type: "chord",
				} as Chord,
			]);
		});
		it("should parse chords with pitches", function () {
			assertMusic(parse("[c4e-4g4]"), [
				{
					notes: [
						{ tone: "c", octave: 4, duration: 4 } as Note,
						{ tone: "e", pitch: "b", octave: 4, duration: 4 } as Note,
						{ tone: "g", octave: 4, duration: 4 } as Note,
					],
					type: "chord",
				} as Chord,
			]);
			assertMusic(parse("[<a8>c+8e8]"), [
				{
					notes: [
						{ tone: "a", octave: 3, duration: 8 } as Note,
						{ tone: "c", pitch: "#", octave: 4, duration: 8 } as Note,
						{ tone: "e", octave: 4, duration: 8 } as Note,
					],
					type: "chord",
				} as Chord,
			]);
		});
	});
	describe("rests", function () {
		it("should parse rests", function () {
			assertMusic(parse("r2"), [{ duration: 2, type: "rest" } as Rest]);
			assertMusic(parse("r64"), [{ duration: 64, type: "rest" } as Rest]);
			assertMusic(parse("r4"), [{ duration: 4, type: "rest" } as Rest]);
		});
		it("should parse an appended rest", function () {
			assertMusic(parse("r4&r4"), [{ duration: 2, type: "rest" } as Rest]);
			assertMusic(parse("r2&r2"), [{ duration: 1, type: "rest" } as Rest]);
			assertMusic(parse("r1&r1"), [{ duration: 0.5, type: "rest" } as Rest]);
		});
	});

	describe("octave changes", function () {
		it("should parse octave shifts", function () {
			assertMusic(parse("c4>c4>c4"), [
				{ tone: "c", octave: 4, duration: 4, type: "note" } as Note,
				{ tone: "c", octave: 5, duration: 4, type: "note" } as Note,
				{ tone: "c", octave: 6, duration: 4, type: "note" } as Note,
			]);
			assertMusic(parse("c4<c4<c4"), [
				{ tone: "c", octave: 4, duration: 4, type: "note" } as Note,
				{ tone: "c", octave: 3, duration: 4, type: "note" } as Note,
				{ tone: "c", octave: 2, duration: 4, type: "note" } as Note,
			]);
			assertMusic(parse("c4<<<c4"), [
				{ tone: "c", octave: 4, duration: 4, type: "note" } as Note,
				{ tone: "c", octave: 1, duration: 4, type: "note" } as Note,
			]);
			assertMusic(parse("c4<<<>>>c4"), [
				{ tone: "c", octave: 4, duration: 4, type: "note" } as Note,
				{ tone: "c", octave: 4, duration: 4, type: "note" } as Note,
			]);
		});

		it("should parse octave changes", function () {
			assertMusic(parse("c4o1c4"), [
				{ tone: "c", octave: 4, duration: 4, type: "note" } as Note,
				{ tone: "c", octave: 1, duration: 4, type: "note" } as Note,
			]);
		});
	});

	describe("tempo changes", function () {
		it("should parse tempo changes", function () {
			assertMusic(parse("t60"), [{ tempo: 60, type: "tempo-change" } as TempoChange]);
		});
	});

	describe("comments", function () {
		it("should parse line comments", function () {
			assertMusic(parse("// c4"), []);
			assertMusic(parse("c4 // c4"), [{ tone: "c", octave: 4, duration: 4, type: "note" } as Note]);
		});
		it("should parse block comments", function () {
			assertMusic(parse("/* c4 */"), []);
			assertMusic(parse("c4 /* c4 */ c4"), [
				{ tone: "c", octave: 4, duration: 4, type: "note" } as Note,
				{ tone: "c", octave: 4, duration: 4, type: "note" } as Note,
			]);
			assertMusic(parse("/* \n\nc4\n */ c4"), [{ tone: "c", octave: 4, duration: 4, type: "note" } as Note]);
		});
	});
});

function assertMusic(actual: Symbol[][], expected: Symbol[] | Symbol[][]) {
	if (Array.isArray(expected[0])) {
		assert.equal(actual.length, expected.length);

		for (let i = 0; i < actual.length; i++) {
			assertTrack(actual[i], expected[i] as Symbol[]);
		}
	} else {
		assert.equal(actual.length, 1);
		assertTrack(actual[0], expected as Symbol[]);
	}
}

function assertTrack(actual: Symbol[], expected: Symbol[]) {
	assert.equal(actual.length, expected.length, "Music symbol length did not match.");

	for (let i = 0; i < actual.length; i++) {
		const actualSymbol = actual[i];
		const expectedSymbol = expected[i];
		assert.equal(actualSymbol.type, expectedSymbol.type, "Music symbol order did not match.");

		if (actualSymbol.type === "note") {
			assertNote(actualSymbol as Note, expectedSymbol as Note);
		} else if (actualSymbol.type === "chord") {
			const actualChord = actualSymbol as Chord;
			const expectedChord = expectedSymbol as Chord;
			assert.equal(actualChord.notes.length, expectedChord.notes.length, "Chord note count did not match.");

			for (let i = 0; i < actualChord.notes.length; i++) {
				assertNote(actualChord.notes[i], expectedChord.notes[i]);
			}
		} else if (actualSymbol.type === "rest") {
			assert.equal((actualSymbol as Rest).duration, (expectedSymbol as Rest).duration, "Rest duration did not match.");
		}
	}
}

function assertNote(actual: Note, expected: Note) {
	assert.equal(actual.tone, expected.tone, "Note tone did not match.");
	assert.equal(actual.pitch, expected.pitch, "Note pitch did not match.");
	assert.equal(actual.octave, expected.octave, "Note octave did not match.");
	assert.equal(actual.duration, expected.duration, "Note duration did not match.");
}
