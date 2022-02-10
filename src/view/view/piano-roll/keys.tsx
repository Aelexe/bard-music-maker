import classNames from "classnames";
import { player } from "../../js/player";

interface Props {
	octave: number;
}

export default class Keys extends React.Component<Props, any> {
	render() {
		return (
			<div className="keys">
				<Key type="white" note={`b${this.props.octave}`} />
				<Key type="black" note={`a#${this.props.octave}`} />
				<Key type="white" note={`a${this.props.octave}`} />
				<Key type="black" note={`g#${this.props.octave}`} />
				<Key type="white" note={`g${this.props.octave}`} />
				<Key type="black" note={`f#${this.props.octave}`} />
				<Key type="white" note={`f${this.props.octave}`} />
				<Key type="white" note={`e${this.props.octave}`} />
				<Key type="black" note={`d#${this.props.octave}`} />
				<Key type="white" note={`d${this.props.octave}`} />
				<Key type="black" note={`c#${this.props.octave}`} />
				<Key type="white" note={`c${this.props.octave}`}>
					c{this.props.octave}
				</Key>
			</div>
		);
	}
}

interface KeyProps {
	type: "white" | "black";
	note: string;
}

interface KeyState {
	pressed: boolean;
}

class Key extends React.Component<KeyProps, KeyState> {
	constructor(props: KeyProps) {
		super(props);
		this.state = { pressed: false };
	}

	press() {
		this.setState({ pressed: true });
		player.playNote(this.props.note);
	}

	release() {
		this.setState({ pressed: false });
		player.releaseNote(this.props.note);
	}

	render() {
		return (
			<div
				className={classNames(["key", this.props.type, { pressed: this.state.pressed }])}
				onMouseDown={() => {
					this.press();
				}}
				onMouseUp={() => {
					this.release();
				}}
				onMouseEnter={(e) => {
					if (e.buttons === 1) {
						this.press();
					}
				}}
				onMouseLeave={() => {
					this.release();
				}}
			>
				{this.props.children}
			</div>
		);
	}
}
