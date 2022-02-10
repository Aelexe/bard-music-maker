import classNames from "classnames";

interface Props {
	left: number;
	width: number;
	height: number;
	color: number;
}

const colours = ["pink", "green"];

export default class Note extends React.Component<Props, any> {
	render() {
		return (
			<div
				className={classNames(["note", colours[this.props.color]])}
				style={{ left: `${this.props.left}%`, width: `${this.props.width}%`, height: `${this.props.height}%` }}
			></div>
		);
	}
}
