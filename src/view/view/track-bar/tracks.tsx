import classNames from "classnames";
import { trigger } from "../../js/event";

interface Props {
	trackCount: number;
	selectedTrack: number;
}

export class Tracks extends React.Component<Props, any> {
	render() {
		const tracks = [];
		for (let i = 0; i < this.props.trackCount; i++) {
			tracks.push(
				<div
					key={i}
					className={classNames(["track", { selected: this.props.selectedTrack === i }])}
					onClick={() => {
						trigger("track:select", i);
					}}
				>
					Track {i + 1}
				</div>
			);
		}

		return (
			<div className="tracks">
				{tracks}
				<i
					className="fas fa-plus"
					onClick={() => {
						trigger("track:add");
					}}
				></i>
			</div>
		);
	}
}
