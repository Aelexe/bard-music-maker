import { Note } from "../../js/music";
import Bar from "./bar";

interface Props {
	notes: Note[];
	selectedTrack: number;
	beats: number;
	beatNote: number;
}

export default class Octave extends React.Component<Props, any> {
	render() {
		return (
			<div className="octave">
				<Bar
					notes={this.props.notes.filter((note) => {
						return note.tone === "b" && note.pitch === undefined;
					})}
					selectedTrack={this.props.selectedTrack}
					beats={this.props.beats}
					beatNote={this.props.beatNote}
					background="dark"
				/>
				<Bar
					notes={this.props.notes.filter((note) => {
						return (note.tone === "a" && note.pitch === "#") || (note.tone === "b" && note.pitch === "b");
					})}
					selectedTrack={this.props.selectedTrack}
					beats={this.props.beats}
					beatNote={this.props.beatNote}
					background="light"
				/>
				<Bar
					notes={this.props.notes.filter((note) => {
						return note.tone === "a" && note.pitch === undefined;
					})}
					selectedTrack={this.props.selectedTrack}
					beats={this.props.beats}
					beatNote={this.props.beatNote}
					background="dark"
				/>
				<Bar
					notes={this.props.notes.filter((note) => {
						return (note.tone === "g" && note.pitch === "#") || (note.tone === "a" && note.pitch === "b");
					})}
					selectedTrack={this.props.selectedTrack}
					beats={this.props.beats}
					beatNote={this.props.beatNote}
					background="light"
				/>
				<Bar
					notes={this.props.notes.filter((note) => {
						return note.tone === "g" && note.pitch === undefined;
					})}
					selectedTrack={this.props.selectedTrack}
					beats={this.props.beats}
					beatNote={this.props.beatNote}
					background="dark"
				/>
				<Bar
					notes={this.props.notes.filter((note) => {
						return (note.tone === "f" && note.pitch === "#") || (note.tone === "g" && note.pitch === "b");
					})}
					selectedTrack={this.props.selectedTrack}
					beats={this.props.beats}
					beatNote={this.props.beatNote}
					background="light"
				/>
				<Bar
					notes={this.props.notes.filter((note) => {
						return (note.tone === "f" && note.pitch === undefined) || (note.tone === "e" && note.pitch === "#");
					})}
					selectedTrack={this.props.selectedTrack}
					beats={this.props.beats}
					beatNote={this.props.beatNote}
					background="dark"
				/>
				<Bar
					notes={this.props.notes.filter((note) => {
						return (note.tone === "e" && note.pitch === undefined) || (note.tone === "f" && note.pitch === "b");
					})}
					selectedTrack={this.props.selectedTrack}
					beats={this.props.beats}
					beatNote={this.props.beatNote}
					background="dark"
				/>
				<Bar
					notes={this.props.notes.filter((note) => {
						return (note.tone === "d" && note.pitch === "#") || (note.tone === "e" && note.pitch === "b");
					})}
					selectedTrack={this.props.selectedTrack}
					beats={this.props.beats}
					beatNote={this.props.beatNote}
					background="light"
				/>
				<Bar
					notes={this.props.notes.filter((note) => {
						return note.tone === "d" && note.pitch === undefined;
					})}
					selectedTrack={this.props.selectedTrack}
					beats={this.props.beats}
					beatNote={this.props.beatNote}
					background="dark"
				/>
				<Bar
					notes={this.props.notes.filter((note) => {
						return (note.tone === "c" && note.pitch === "#") || (note.tone === "d" && note.pitch === "b");
					})}
					selectedTrack={this.props.selectedTrack}
					beats={this.props.beats}
					beatNote={this.props.beatNote}
					background="light"
				/>
				<Bar
					notes={this.props.notes.filter((note) => {
						return note.tone === "c" && note.pitch === undefined;
					})}
					selectedTrack={this.props.selectedTrack}
					beats={this.props.beats}
					beatNote={this.props.beatNote}
					background="dark"
				/>
			</div>
		);
	}
}
