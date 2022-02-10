import { CSSTransition } from "react-transition-group";
import { on } from "../../js/event";

interface State {
	showNotification?: boolean;
	notification?: string;
}

export class StatusBar extends React.Component<any, State> {
	private fadeTimeout?: number;

	constructor(props: any) {
		super(props);

		this.state = {};

		on("notification", ({ detail: message }: { detail: string }) => {
			this.setState({ showNotification: true, notification: message });
			if (this.fadeTimeout) {
				window.clearTimeout(this.fadeTimeout);
			}

			this.fadeTimeout = window.setTimeout(() => {
				this.setState({ showNotification: false });
			}, 3000);
		});
	}

	render() {
		return (
			<div className="status-bar">
				<CSSTransition in={this.state.showNotification} timeout={200}>
					<div className="notification" dangerouslySetInnerHTML={{ __html: this.state.notification || "&nbsp;" }}></div>
				</CSSTransition>
			</div>
		);
	}
}
