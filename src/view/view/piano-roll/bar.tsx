import classNames from "classnames";
import DisplayNote from "./note";
import Beat from "./beat";
import { Note } from "../../js/music";

interface Props {
	notes: Note[];
	selectedTrack: number;
	background: "dark" | "light";
	beats: number;
	beatNote: number;
}

export default class Bar extends React.Component<Props, any> {
	render() {
		return (
			<div className={classNames(["bar", this.props.background])}>
				<div className="notes" style={{ width: this.props.beats * 50 }}>
					{this.props.notes.map((note, i) => {
						return (
							<DisplayNote
								key={i}
								left={note.measureTime * 100}
								width={note.measureDuration * 100}
								height={this.props.selectedTrack === note.track ? 100 : 50}
								color={note.track}
							></DisplayNote>
						);
					})}
				</div>
				<div className="background">
					{[...Array(this.props.beats)].map((e, i) => {
						return <Beat key={i} />;
					})}
				</div>
			</div>
		);
	}
}
