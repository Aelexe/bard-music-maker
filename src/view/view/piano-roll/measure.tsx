import { trigger } from "../../js/event";
import { Note } from "../../js/music";
import Octave from "./octave";

interface Props {
	index: number;
	notes: Note[];
	selectedTrack: number;
	beats: number;
	beatNote: number;
}

export default class Measure extends React.Component<Props, any> {
	render() {
		return (
			<div
				className="measure"
				onClick={(e) => {
					const rollScroll = e.currentTarget.parentElement?.getBoundingClientRect().left || 0;
					const measuresOffset = e.currentTarget.offsetLeft;
					const parentOffset = e.currentTarget.parentElement?.offsetLeft || 0;
					const measureOffset = measuresOffset - parentOffset;
					const positionOnPage = e.pageX - rollScroll;
					const positionOnMeasure = positionOnPage - measureOffset;
					trigger("measure:click", {
						measure: this.props.index + positionOnMeasure / e.currentTarget.clientWidth,
					});
				}}
			>
				<Octave
					notes={this.props.notes.filter((note) => {
						return note.octave === 8;
					})}
					selectedTrack={this.props.selectedTrack}
					beats={this.props.beats}
					beatNote={this.props.beatNote}
				/>
				<Octave
					notes={this.props.notes.filter((note) => {
						return note.octave === 7;
					})}
					selectedTrack={this.props.selectedTrack}
					beats={this.props.beats}
					beatNote={this.props.beatNote}
				/>
				<Octave
					notes={this.props.notes.filter((note) => {
						return note.octave === 6;
					})}
					selectedTrack={this.props.selectedTrack}
					beats={this.props.beats}
					beatNote={this.props.beatNote}
				/>
				<Octave
					notes={this.props.notes.filter((note) => {
						return note.octave === 5;
					})}
					selectedTrack={this.props.selectedTrack}
					beats={this.props.beats}
					beatNote={this.props.beatNote}
				/>
				<Octave
					notes={this.props.notes.filter((note) => {
						return note.octave === 4;
					})}
					selectedTrack={this.props.selectedTrack}
					beats={this.props.beats}
					beatNote={this.props.beatNote}
				/>
				<Octave
					notes={this.props.notes.filter((note) => {
						return note.octave === 3;
					})}
					selectedTrack={this.props.selectedTrack}
					beats={this.props.beats}
					beatNote={this.props.beatNote}
				/>
				<Octave
					notes={this.props.notes.filter((note) => {
						return note.octave === 2;
					})}
					selectedTrack={this.props.selectedTrack}
					beats={this.props.beats}
					beatNote={this.props.beatNote}
				/>
				<Octave
					notes={this.props.notes.filter((note) => {
						return note.octave === 1;
					})}
					selectedTrack={this.props.selectedTrack}
					beats={this.props.beats}
					beatNote={this.props.beatNote}
				/>
			</div>
		);
	}
}
