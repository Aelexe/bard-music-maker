interface Props {
	notation?: string;
	trackIndex: number;

	// Callbacks
	onChange?: (notation: string) => void;
}

interface State {
	notation: string;
	displayNotation: string;
}

export class NotationEditor extends React.Component<Props, State> {
	private inputRef: React.RefObject<HTMLTextAreaElement>;

	constructor(props: Props) {
		super(props);

		this.inputRef = React.createRef();
		this.state = { notation: "", displayNotation: "" };
	}

	componentDidMount() {
		this.loadNotationFromProps();
	}

	componentDidUpdate(previousProps: Props, previousState: any) {
		// If the selected track has changed, reload the notation from the props.
		if (this.props.trackIndex !== previousProps.trackIndex) {
			this.loadNotationFromProps();
		}
	}

	loadNotationFromProps() {
		let notation;
		let displayNotation;

		if (this.props.notation) {
			notation = this.props.notation;
			displayNotation = this.annotateNotation(this.props.notation);
		} else {
			notation = "";
			displayNotation = "";
		}

		this.setState({ notation, displayNotation });

		if (this.inputRef.current) {
			this.inputRef.current.value = notation;
			this.resizeTextArea();
		}

		if (this.props.onChange) {
			this.props.onChange(notation);
		}
	}

	/**
	 * Annotates a notation with HTML for display purposes.
	 */
	annotateNotation(notation: string) {
		return notation
			.replace(/</gm, "&lt;")
			.replace(/>/gm, "&gt;")
			.replace(/\n/gm, "<br>")
			.replace(/(t\d+)/gm, "<span class='tempo'>$1</span>")
			.replace(/(o\d+)/gm, "<span class='octave'>$1</span>")
			.replace(/(l\d+)/gm, "<span class='length'>$1</span>")
			.replace(/(\/\/.*$|\/\*.*?\*\/)/, "<span class='comment'>$1</span>");
	}

	/**
	 * Resizes the text area to fit its current content.
	 */
	resizeTextArea() {
		const textArea = this.inputRef.current;
		if (!textArea) {
			return;
		}
		textArea.style.height = "";
		textArea.style.height = textArea.scrollHeight + "px";
	}

	render() {
		return (
			<div className="notation-editor">
				<div className="lines">
					{this.state.notation.split(/\r\n|\r|\n/).map((value, i) => {
						return (
							<div key={i + 1} className="line">
								{i + 1}
							</div>
						);
					})}
				</div>
				<div className="text">
					<textarea
						ref={this.inputRef}
						className="input"
						onChange={(event) => {
							const notation = event.currentTarget.value;
							this.setState({ notation: notation, displayNotation: this.annotateNotation(notation) });

							if (this.props.onChange) {
								this.props.onChange(notation);
							}
						}}
						onKeyDown={(e) => {
							if (e.key === "Tab") {
								e.preventDefault();
								if (/\[(?!.*[\]])/.exec(this.inputRef.current!.value)) {
									const notation = this.inputRef.current!.value + "]";
									this.inputRef.current!.value = notation;
									this.setState({ notation: notation, displayNotation: this.annotateNotation(notation) });
								}
							}
						}}
						onInput={this.resizeTextArea.bind(this)}
					></textarea>
					<div className="display" dangerouslySetInnerHTML={{ __html: this.state.displayNotation }}></div>
				</div>
			</div>
		);
	}
}
