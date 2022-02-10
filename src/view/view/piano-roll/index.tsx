import Keys from "./keys";
import { Music, Measure } from "../../js/music";
import DisplayMeasure from "./measure";
import { player } from "../../js/player";

interface Props {
	music: Music;
	selectedTrack: number;
	caretPositionMeasures: number;
}
export default class PianoRoll extends React.Component<Props, any> {
	private rollRef: React.RefObject<HTMLDivElement>;
	private caret: React.RefObject<HTMLDivElement>;

	constructor(props: Props) {
		super(props);

		this.state = {};

		this.rollRef = React.createRef();
		this.caret = React.createRef();
	}

	componentDidUpdate(prevProps: Props) {
		if (this.props.caretPositionMeasures != prevProps.caretPositionMeasures) {
			if (player.isPlaying()) {
				const caret = this.caret.current!;
				const caretOffset = caret.offsetLeft;
				const rollScroll = caret.parentElement?.parentElement?.scrollLeft || 0;

				if (caretOffset - rollScroll > document.documentElement.clientWidth)
					this.caret.current?.scrollIntoView({ block: "nearest", inline: "center" });
			}
		}
	}

	render() {
		const music = this.props.music;

		// TODO: Move the extra measure logic to somewhere more performant.
		const extraMeasures: Measure[] = [];

		let currentWidth = 0;
		const desiredWidth = Math.ceil(document.documentElement.clientWidth - 30);

		if (currentWidth < desiredWidth) {
			let lastMeasure: Measure = music.measures[0];

			if (!lastMeasure) {
				lastMeasure = { beats: 4, beatNote: 4, notes: [] };
			}

			const beatWidth = 50;
			music.measures.forEach((measure) => {
				currentWidth += measure.beats * beatWidth;
			});

			while (currentWidth < desiredWidth) {
				extraMeasures.push({ beats: lastMeasure.beats, beatNote: lastMeasure.beatNote, notes: [] });
				currentWidth += lastMeasure.beats * beatWidth;
			}
		}

		const measures = music.measures.concat(extraMeasures);
		let caretMeasureCount = 0;
		let caretBeatCount = 0;
		let i = 0;
		while (true) {
			if (this.props.caretPositionMeasures - i >= 1) {
				caretMeasureCount++;
				caretBeatCount += measures[i].beats;
				i++;
			} else {
				if (this.props.caretPositionMeasures - i >= 0) {
					caretBeatCount += measures[i].beats * (this.props.caretPositionMeasures - i);
				}
				break;
			}
		}

		return (
			<div
				ref={this.rollRef}
				className="piano-roll"
				onScroll={() => {
					this.setState({ rerenderTrigger: !this.state.rerenderTrigger });
				}}
			>
				<div className="headers">
					{measures.map((measure, i) => {
						return (
							<div key={i + 1} className="header" style={{ width: measure.beats * 50 - 20 }}>
								{i + 1}
							</div>
						);
					})}
				</div>
				<div className="roll">
					<div className="keyboard">
						{[8, 7, 6, 5, 4, 3, 2, 1].map((octave) => {
							return <Keys key={octave} octave={octave} />;
						})}
					</div>
					<Measures measures={measures} selectedTrack={this.props.selectedTrack} />
					<div ref={this.caret} className="caret" style={{ left: caretMeasureCount + caretBeatCount * 50 + 30 }} />
				</div>
			</div>
		);
	}
}

interface MeasuresProps {
	measures: Measure[];
	selectedTrack: number;
}
class Measures extends React.Component<MeasuresProps, any> {
	private measuresRef: React.RefObject<HTMLDivElement>;

	constructor(props: MeasuresProps) {
		super(props);

		this.measuresRef = React.createRef();
	}

	/**
	 * Returns the expected width of the measures container.
	 */
	getWidth(): number {
		let measureCount = 0;
		let beatCount = 0;
		for (let i = 0; i < this.props.measures.length; i++) {
			measureCount++;
			beatCount += this.props.measures[i].beats;
		}

		return measureCount + beatCount * 50;
	}

	render() {
		const scrollContainer = this.measuresRef.current?.parentElement?.parentElement;

		const displayMeasures: number[] = [];
		let skipMeasureCount = 0;
		let skipBeatCount = 0;

		if (scrollContainer) {
			let scrollContainerLeft = scrollContainer.scrollLeft;
			let scrollContainerRight = scrollContainer.scrollLeft + scrollContainer.clientWidth;
			let scrollWidth = scrollContainerRight - scrollContainerLeft;
			scrollContainerLeft -= scrollWidth;
			scrollContainerRight += scrollWidth;

			for (let i = 0; i < this.props.measures.length; i++) {
				const measure = this.props.measures[i];
				let measureStart = 0;

				for (let j = 0; j < i; j++) {
					measureStart += this.props.measures[j].beats * 50 + 1;
				}

				const measureEnd = measureStart + measure.beats * 50 + 1;

				if (measureStart < scrollContainerRight && measureEnd > scrollContainerLeft) {
					displayMeasures.push(i);
				} else {
					if (displayMeasures.length > 0) {
						break;
					}
					skipMeasureCount++;
					skipBeatCount += measure.beats;
				}
			}
		}

		return (
			<div
				ref={this.measuresRef}
				className="measures"
				style={{ flexBasis: this.getWidth(), paddingLeft: skipMeasureCount + skipBeatCount * 50 }}
			>
				<div className="content">
					{this.props.measures.map((measure, measureIndex) => {
						if (displayMeasures.indexOf(measureIndex) === -1) {
							return;
						}
						return (
							<DisplayMeasure
								key={measureIndex}
								index={measureIndex}
								notes={measure.notes}
								selectedTrack={this.props.selectedTrack}
								beats={measure.beats}
								beatNote={measure.beatNote}
							></DisplayMeasure>
						);
					})}
				</div>
			</div>
		);
	}
}
