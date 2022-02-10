import { isWebApp } from "../../js/bridge";
import { trigger } from "../../js/event";

export class WindowButtons extends React.Component<any, any> {
	render() {
		if (isWebApp()) {
			return <div />;
		}

		return (
			<div className="window-buttons">
				<i
					className="fas fa-window-minimize"
					onClick={() => {
						trigger("window:minimise");
					}}
				></i>
				<i
					className="fas fa-window-maximize"
					onClick={() => {
						trigger("window:maximise");
					}}
				></i>
				<i
					className="fas fa-window-close"
					onClick={() => {
						trigger("window:close");
					}}
				></i>
			</div>
		);
	}
}
