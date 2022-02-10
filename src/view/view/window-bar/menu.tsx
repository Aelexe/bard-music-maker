import classNames from "classnames";
import { trigger } from "../../js/event";
import { isElectronApp } from "../../js/bridge";

interface State {
	fileMenuOpen?: boolean;

	close?: boolean;
}

export class Menu extends React.Component<any, State> {
	private menuRef: React.RefObject<HTMLUListElement>;

	constructor(props: any) {
		super(props);

		this.state = {};

		this.menuRef = React.createRef();
	}

	closeAll() {
		this.setState({ fileMenuOpen: false, close: true }, () => {
			this.setState({ close: false });
		});
	}

	render() {
		return (
			<ul ref={this.menuRef} className="menu">
				<li
					className={classNames(["item", { open: this.state.fileMenuOpen, closed: this.state.close }])}
					tabIndex={0}
					onClick={() => {
						this.setState({ fileMenuOpen: true });
					}}
					onBlur={() => {
						this.setState({ fileMenuOpen: false });
					}}
				>
					<span>File</span>
					<ul className="sub-menu">
						<li
							className="item"
							onClick={(e) => {
								e.stopPropagation();
								trigger("new");
								this.closeAll();
							}}
						>
							<span>New</span>
						</li>
						<li
							className="item"
							onClick={(e) => {
								e.stopPropagation();
								trigger("open");
								this.closeAll();
							}}
						>
							<span>Open</span>
						</li>
						<li
							className="item"
							onClick={(e) => {
								e.stopPropagation();
								trigger("save");
								this.closeAll();
							}}
						>
							<span>Save</span>
						</li>
						{isElectronApp() && (
							<li
								className="item"
								onClick={(e) => {
									e.stopPropagation();
									trigger("saveAs");
									this.closeAll();
								}}
							>
								<span>Save As</span>
							</li>
						)}
						<li
							className="item"
							onClick={(e) => {
								e.stopPropagation();
								trigger("export");
								this.closeAll();
							}}
						>
							<span>Export to Midi</span>
						</li>
					</ul>
				</li>
			</ul>
		);
	}
}
