import { assert } from "chai";
import { getNoteDurationForTimeSignature, getTimeInMeasures, TimeSignature } from "../src/view/js/music";

describe("#getTimeInMeasures", () => {
	it("should get measures for 2/2 (cut time)", () => {
		// A measure at 60bpm is 2 seconds.
		let timeSignatures: TimeSignature[] = [{ time: 0, beatsPerMinute: 60, beatsInMeasure: 2, beatNote: 2 }];

		assert.equal(getTimeInMeasures(0, timeSignatures), 0);
		assert.equal(getTimeInMeasures(0.5, timeSignatures), 0.25);
		assert.equal(getTimeInMeasures(1, timeSignatures), 0.5);
		assert.equal(getTimeInMeasures(1.5, timeSignatures), 0.75);
		assert.equal(getTimeInMeasures(2, timeSignatures), 1);

		// A measure in cut time at 120bpm is 1 seconds.
		timeSignatures = [{ time: 0, beatsPerMinute: 120, beatsInMeasure: 2, beatNote: 2 }];

		assert.equal(getTimeInMeasures(0, timeSignatures), 0);
		assert.equal(getTimeInMeasures(0.25, timeSignatures), 0.25);
		assert.equal(getTimeInMeasures(0.5, timeSignatures), 0.5);
		assert.equal(getTimeInMeasures(0.75, timeSignatures), 0.75);
		assert.equal(getTimeInMeasures(1, timeSignatures), 1);
	});

	it("should get measures for 2/4", () => {
		// A measure at 60bpm is 2 seconds.
		let timeSignatures: TimeSignature[] = [{ time: 0, beatsPerMinute: 60, beatsInMeasure: 2, beatNote: 4 }];

		assert.equal(getTimeInMeasures(0, timeSignatures), 0);
		assert.equal(getTimeInMeasures(0.5, timeSignatures), 0.25);
		assert.equal(getTimeInMeasures(1, timeSignatures), 0.5);
		assert.equal(getTimeInMeasures(1.5, timeSignatures), 0.75);
		assert.equal(getTimeInMeasures(2, timeSignatures), 1);

		// A measure at 120bpm is 1 seconds.
		timeSignatures = [{ time: 0, beatsPerMinute: 120, beatsInMeasure: 2, beatNote: 4 }];

		assert.equal(getTimeInMeasures(0, timeSignatures), 0);
		assert.equal(getTimeInMeasures(0.25, timeSignatures), 0.25);
		assert.equal(getTimeInMeasures(0.5, timeSignatures), 0.5);
		assert.equal(getTimeInMeasures(0.75, timeSignatures), 0.75);
		assert.equal(getTimeInMeasures(1, timeSignatures), 1);
	});

	it("should get measures for 3/4", () => {
		// A measure at 60bpm is 3 seconds.
		let timeSignatures: TimeSignature[] = [{ time: 0, beatsPerMinute: 60, beatsInMeasure: 3, beatNote: 4 }];

		assert.equal(getTimeInMeasures(0, timeSignatures), 0);
		assert.equal(getTimeInMeasures(1.5, timeSignatures), 0.5);
		assert.equal(getTimeInMeasures(3, timeSignatures), 1);

		// A measure at 120bpm is 1.5 seconds.
		timeSignatures = [{ time: 0, beatsPerMinute: 120, beatsInMeasure: 3, beatNote: 4 }];

		assert.equal(getTimeInMeasures(0, timeSignatures), 0);
		assert.approximately(getTimeInMeasures(1, timeSignatures), 0.66, 0.01);
		assert.equal(getTimeInMeasures(1.5, timeSignatures), 1);
	});

	it("should get measures for 4/4 (common time)", () => {
		// A measure at 60bpm is 4 seconds.
		let timeSignatures: TimeSignature[] = [{ time: 0, beatsPerMinute: 60, beatsInMeasure: 4, beatNote: 4 }];

		assert.equal(getTimeInMeasures(0, timeSignatures), 0);
		assert.equal(getTimeInMeasures(1, timeSignatures), 0.25);
		assert.equal(getTimeInMeasures(2, timeSignatures), 0.5);
		assert.equal(getTimeInMeasures(3, timeSignatures), 0.75);
		assert.equal(getTimeInMeasures(4, timeSignatures), 1);

		// A measure at 120bpm is 2 seconds.
		timeSignatures = [{ time: 0, beatsPerMinute: 120, beatsInMeasure: 4, beatNote: 4 }];

		assert.equal(getTimeInMeasures(0, timeSignatures), 0);
		assert.equal(getTimeInMeasures(0.5, timeSignatures), 0.25);
		assert.equal(getTimeInMeasures(1, timeSignatures), 0.5);
		assert.equal(getTimeInMeasures(1.5, timeSignatures), 0.75);
		assert.equal(getTimeInMeasures(2, timeSignatures), 1);
	});

	it("should get measures for 3/8", () => {
		// A measure at 60bpm is 3 seconds.
		let timeSignatures: TimeSignature[] = [{ time: 0, beatsPerMinute: 60, beatsInMeasure: 3, beatNote: 8 }];

		assert.equal(getTimeInMeasures(0, timeSignatures), 0);
		assert.equal(getTimeInMeasures(1.5, timeSignatures), 0.5);
		assert.equal(getTimeInMeasures(3, timeSignatures), 1);

		// A measure at 120bpm is 1.5 seconds.
		timeSignatures = [{ time: 0, beatsPerMinute: 120, beatsInMeasure: 3, beatNote: 8 }];

		assert.equal(getTimeInMeasures(0, timeSignatures), 0);
		assert.approximately(getTimeInMeasures(1, timeSignatures), 0.66, 0.01);
		assert.equal(getTimeInMeasures(1.5, timeSignatures), 1);
	});

	it("should get measures for 6/8", () => {
		// A measure at 60bpm is 6 seconds.
		let timeSignatures: TimeSignature[] = [{ time: 0, beatsPerMinute: 60, beatsInMeasure: 6, beatNote: 8 }];

		assert.equal(getTimeInMeasures(0, timeSignatures), 0);
		assert.approximately(getTimeInMeasures(1, timeSignatures), 0.16, 0.01);
		assert.approximately(getTimeInMeasures(2, timeSignatures), 0.33, 0.01);
		assert.equal(getTimeInMeasures(3, timeSignatures), 0.5);
		assert.approximately(getTimeInMeasures(4, timeSignatures), 0.66, 0.01);
		assert.approximately(getTimeInMeasures(5, timeSignatures), 0.83, 0.01);
		assert.equal(getTimeInMeasures(6, timeSignatures), 1);

		// A measure at 120bpm is 3 seconds.
		timeSignatures = [{ time: 0, beatsPerMinute: 120, beatsInMeasure: 6, beatNote: 8 }];

		assert.equal(getTimeInMeasures(0, timeSignatures), 0);
		assert.approximately(getTimeInMeasures(0.5, timeSignatures), 0.16, 0.1);
		assert.approximately(getTimeInMeasures(1, timeSignatures), 0.33, 0.01);
		assert.equal(getTimeInMeasures(1.5, timeSignatures), 0.5);
		assert.approximately(getTimeInMeasures(2, timeSignatures), 0.66, 0.01);
		assert.approximately(getTimeInMeasures(2.5, timeSignatures), 0.83, 0.01);
		assert.equal(getTimeInMeasures(3, timeSignatures), 1);
	});

	it("should get measures for a change from 4/4 to 6/8", () => {
		let timeSignatures: TimeSignature[] = [
			{ time: 0, beatsPerMinute: 120, beatsInMeasure: 4, beatNote: 4 },
			{ time: 2, beatsPerMinute: 120, beatsInMeasure: 6, beatNote: 8 },
		];

		assert.equal(getTimeInMeasures(0, timeSignatures), 0);
		assert.equal(getTimeInMeasures(0.5, timeSignatures), 0.25);
		assert.equal(getTimeInMeasures(1, timeSignatures), 0.5);
		assert.equal(getTimeInMeasures(1.5, timeSignatures), 0.75);
		assert.equal(getTimeInMeasures(2, timeSignatures), 1);
		assert.approximately(getTimeInMeasures(2.5, timeSignatures), 1.167, 0.01);
	});
});

describe("#getNoteDurationForTimeSignature", () => {
	it("should get note durations for 2/2 (cut time)", () => {
		// 60bpm
		let timeSignature: TimeSignature = { time: 0, beatsPerMinute: 60, beatsInMeasure: 2, beatNote: 2 };

		assert.equal(getNoteDurationForTimeSignature(1, timeSignature), 2);
		assert.equal(getNoteDurationForTimeSignature(2, timeSignature), 1);
		assert.equal(getNoteDurationForTimeSignature(4, timeSignature), 0.5);
		assert.equal(getNoteDurationForTimeSignature(8, timeSignature), 0.25);
		assert.equal(getNoteDurationForTimeSignature(16, timeSignature), 0.125);
		assert.equal(getNoteDurationForTimeSignature(32, timeSignature), 0.0625);

		// 120bpm
		timeSignature = { time: 0, beatsPerMinute: 120, beatsInMeasure: 2, beatNote: 2 };

		assert.equal(getNoteDurationForTimeSignature(1, timeSignature), 1);
		assert.equal(getNoteDurationForTimeSignature(2, timeSignature), 0.5);
		assert.equal(getNoteDurationForTimeSignature(4, timeSignature), 0.25);
		assert.equal(getNoteDurationForTimeSignature(8, timeSignature), 0.125);
		assert.equal(getNoteDurationForTimeSignature(16, timeSignature), 0.0625);
		assert.equal(getNoteDurationForTimeSignature(32, timeSignature), 0.03125);
	});

	it("should get note durations for 2/4 ", () => {
		// 60bpm
		let timeSignature: TimeSignature = { time: 0, beatsPerMinute: 60, beatsInMeasure: 2, beatNote: 4 };

		assert.equal(getNoteDurationForTimeSignature(1, timeSignature), 4);
		assert.equal(getNoteDurationForTimeSignature(2, timeSignature), 2);
		assert.equal(getNoteDurationForTimeSignature(4, timeSignature), 1);
		assert.equal(getNoteDurationForTimeSignature(8, timeSignature), 0.5);
		assert.equal(getNoteDurationForTimeSignature(16, timeSignature), 0.25);
		assert.equal(getNoteDurationForTimeSignature(32, timeSignature), 0.125);

		// 120bpm
		timeSignature = { time: 0, beatsPerMinute: 120, beatsInMeasure: 2, beatNote: 4 };

		assert.equal(getNoteDurationForTimeSignature(1, timeSignature), 2);
		assert.equal(getNoteDurationForTimeSignature(2, timeSignature), 1);
		assert.equal(getNoteDurationForTimeSignature(4, timeSignature), 0.5);
		assert.equal(getNoteDurationForTimeSignature(8, timeSignature), 0.25);
		assert.equal(getNoteDurationForTimeSignature(16, timeSignature), 0.125);
		assert.equal(getNoteDurationForTimeSignature(32, timeSignature), 0.0625);
	});

	it("should get note durations for 3/4 ", () => {
		// 60bpm
		let timeSignature: TimeSignature = { time: 0, beatsPerMinute: 60, beatsInMeasure: 3, beatNote: 4 };

		assert.equal(getNoteDurationForTimeSignature(1, timeSignature), 4);
		assert.equal(getNoteDurationForTimeSignature(2, timeSignature), 2);
		assert.equal(getNoteDurationForTimeSignature(4, timeSignature), 1);
		assert.equal(getNoteDurationForTimeSignature(8, timeSignature), 0.5);
		assert.equal(getNoteDurationForTimeSignature(16, timeSignature), 0.25);
		assert.equal(getNoteDurationForTimeSignature(32, timeSignature), 0.125);

		// 120bpm
		timeSignature = { time: 0, beatsPerMinute: 120, beatsInMeasure: 3, beatNote: 4 };

		assert.equal(getNoteDurationForTimeSignature(1, timeSignature), 2);
		assert.equal(getNoteDurationForTimeSignature(2, timeSignature), 1);
		assert.equal(getNoteDurationForTimeSignature(4, timeSignature), 0.5);
		assert.equal(getNoteDurationForTimeSignature(8, timeSignature), 0.25);
		assert.equal(getNoteDurationForTimeSignature(16, timeSignature), 0.125);
		assert.equal(getNoteDurationForTimeSignature(32, timeSignature), 0.0625);
	});

	it("should get note durations for 4/4 (common time) ", () => {
		// 60bpm
		let timeSignature: TimeSignature = { time: 0, beatsPerMinute: 60, beatsInMeasure: 4, beatNote: 4 };

		assert.equal(getNoteDurationForTimeSignature(1, timeSignature), 4);
		assert.equal(getNoteDurationForTimeSignature(2, timeSignature), 2);
		assert.equal(getNoteDurationForTimeSignature(4, timeSignature), 1);
		assert.equal(getNoteDurationForTimeSignature(8, timeSignature), 0.5);
		assert.equal(getNoteDurationForTimeSignature(16, timeSignature), 0.25);
		assert.equal(getNoteDurationForTimeSignature(32, timeSignature), 0.125);

		// 120bpm
		timeSignature = { time: 0, beatsPerMinute: 120, beatsInMeasure: 4, beatNote: 4 };

		assert.equal(getNoteDurationForTimeSignature(1, timeSignature), 2);
		assert.equal(getNoteDurationForTimeSignature(2, timeSignature), 1);
		assert.equal(getNoteDurationForTimeSignature(4, timeSignature), 0.5);
		assert.equal(getNoteDurationForTimeSignature(8, timeSignature), 0.25);
		assert.equal(getNoteDurationForTimeSignature(16, timeSignature), 0.125);
		assert.equal(getNoteDurationForTimeSignature(32, timeSignature), 0.0625);
	});

	it("should get note durations for 3/8 ", () => {
		// 60bpm
		let timeSignature: TimeSignature = { time: 0, beatsPerMinute: 60, beatsInMeasure: 3, beatNote: 8 };

		assert.equal(getNoteDurationForTimeSignature(1, timeSignature), 8);
		assert.equal(getNoteDurationForTimeSignature(2, timeSignature), 4);
		assert.equal(getNoteDurationForTimeSignature(4, timeSignature), 2);
		assert.equal(getNoteDurationForTimeSignature(8, timeSignature), 1);
		assert.equal(getNoteDurationForTimeSignature(16, timeSignature), 0.5);
		assert.equal(getNoteDurationForTimeSignature(32, timeSignature), 0.25);

		// 120bpm
		timeSignature = { time: 0, beatsPerMinute: 120, beatsInMeasure: 3, beatNote: 8 };

		assert.equal(getNoteDurationForTimeSignature(1, timeSignature), 4);
		assert.equal(getNoteDurationForTimeSignature(2, timeSignature), 2);
		assert.equal(getNoteDurationForTimeSignature(4, timeSignature), 1);
		assert.equal(getNoteDurationForTimeSignature(8, timeSignature), 0.5);
		assert.equal(getNoteDurationForTimeSignature(16, timeSignature), 0.25);
		assert.equal(getNoteDurationForTimeSignature(32, timeSignature), 0.125);
	});

	it("should get note durations for 6/8 ", () => {
		// 60bpm
		let timeSignature: TimeSignature = { time: 0, beatsPerMinute: 60, beatsInMeasure: 6, beatNote: 8 };

		assert.equal(getNoteDurationForTimeSignature(1, timeSignature), 8);
		assert.equal(getNoteDurationForTimeSignature(2, timeSignature), 4);
		assert.equal(getNoteDurationForTimeSignature(4, timeSignature), 2);
		assert.equal(getNoteDurationForTimeSignature(8, timeSignature), 1);
		assert.equal(getNoteDurationForTimeSignature(16, timeSignature), 0.5);
		assert.equal(getNoteDurationForTimeSignature(32, timeSignature), 0.25);

		// 120bpm
		timeSignature = { time: 0, beatsPerMinute: 120, beatsInMeasure: 6, beatNote: 8 };

		assert.equal(getNoteDurationForTimeSignature(1, timeSignature), 4);
		assert.equal(getNoteDurationForTimeSignature(2, timeSignature), 2);
		assert.equal(getNoteDurationForTimeSignature(4, timeSignature), 1);
		assert.equal(getNoteDurationForTimeSignature(8, timeSignature), 0.5);
		assert.equal(getNoteDurationForTimeSignature(16, timeSignature), 0.25);
		assert.equal(getNoteDurationForTimeSignature(32, timeSignature), 0.125);
	});
});
