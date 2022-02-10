import React from "react";
import ReactDOM from "react-dom";
window.React = React;
window.ReactDOM = ReactDOM;
import PianoRoll from "./view/piano-roll";
import { parse, Notation } from "./js/parser";
import { player } from "./js/player";
import { NotationEditor } from "./view/notation-editor";
import { Menu } from "./view/window-bar/menu";
import { on, once, trigger } from "./js/event";
import { WindowButtons } from "./view/window-bar/window-buttons";
import { Tracks } from "./view/track-bar/tracks";
import createMidi from "./js/midi-export";
import { StatusBar } from "./view/status-bar";
import { createMusicFromNotation, Music } from "./js/music";
import bridge, { isElectronApp } from "./js/bridge";
interface State {
	// File
	fileName?: string;
	lastSavePath?: string;

	// Notation Input
	inputNotations: string[];
	selectedTrack: number;

	// Music
	music?: Music;
	musicNotation: Notation[][];

	// Display
	caretPositionMeasures: number;
}

class App extends React.Component<any, State> {
	private parseTimeout?: number;

	constructor(props: any) {
		super(props);

		this.state = {
			inputNotations: [""],
			selectedTrack: 0,
			musicNotation: [],
			caretPositionMeasures: 0,
		};

		window.addEventListener("keydown", this.handleShortcuts.bind(this));

		on("track:add", () => {
			this.state.inputNotations.push("");
			this.setState({ inputNotations: this.state.inputNotations, selectedTrack: this.state.inputNotations.length - 1 });
		});
		on("track:select", (e) => {
			this.setState({ selectedTrack: e.detail });
		});

		on("player:playing", () => {
			this.setState({ caretPositionMeasures: player.getTimeInMeasures() });
		});
		on("measure:click", ({ detail }: { detail: { measure: number } }) => {
			player.setTimeInMeasures(detail.measure);
			this.setState({ caretPositionMeasures: detail.measure });
		});

		on("new", this.new.bind(this));
		on("open", this.open.bind(this));
		on("save", this.save.bind(this));
		on("saveAs", this.saveAs.bind(this));
		on("export", this.export.bind(this));
		on("window:minimise", () => {
			bridge.invoke("window:minimise");
		});
		on("window:maximise", () => {
			bridge.invoke("window:maximise");
		});
		on("window:close", () => {
			bridge.invoke("window:close");
		});
	}

	componentDidMount() {
		document.body.onclick = () => {
			document.body.onclick = null;
			player.initialise();
		};
	}

	handleShortcuts(e: KeyboardEvent): any {
		if (e.ctrlKey) {
			const key = e.key.toLowerCase();
			if (key === "o") {
				e.preventDefault();
				this.open();
			} else if (key === "s") {
				e.preventDefault();
				if (e.shiftKey) {
					this.saveAs();
				} else {
					this.save();
				}
			}
		}
	}

	new() {
		this.setState({ fileName: undefined, lastSavePath: undefined, selectedTrack: -1 }, () => {
			this.setState({ inputNotations: [""], selectedTrack: 0 });
		});
	}

	open() {
		bridge.invoke("openNotation").then(([filePath, trackNotations]: [string, string]) => {
			if (trackNotations !== undefined) {
				const fileName = /([^\\\/]*)\.bml/.exec(filePath)![1];
				this.setState({ fileName: fileName, lastSavePath: filePath, selectedTrack: -1 }, () => {
					this.setState(
						{
							inputNotations: trackNotations
								.split(/\[Track\d+\]/gm)
								.filter((trackNotation) => {
									return trackNotation.trim() !== "";
								})
								.map((trackNotation) => {
									return trackNotation.trim();
								}),
							selectedTrack: 0,
						},
						this.parseNotation.bind(this)
					);
				});
			}
		});
	}

	save() {
		this.saveAs(this.state.lastSavePath);
		trigger("notification", "Saved");
	}

	saveAs(filePath?: string) {
		const fileContents = this.state.inputNotations
			.map((track: string, i: number) => {
				return `[Track${i + 1}]\n${track}`;
			})
			.join("\n");

		bridge.invoke("saveNotation", fileContents, filePath).then((savePath?: string) => {
			if (savePath) {
				const fileName = /\\([^\\]*)\.bml/.exec(savePath)![1];
				this.setState({ lastSavePath: savePath, fileName: fileName });
			}
		});
	}

	export() {
		bridge.invoke("saveMidi", Buffer.from(createMidi(this.state.musicNotation).toArray()), this.state.fileName);
	}

	parseNotation() {
		const musicNotation = parse(this.state.inputNotations);
		const music = createMusicFromNotation(musicNotation);

		this.setState({ musicNotation, music });
	}

	render() {
		let title: string = "";
		if (this.state.fileName) {
			title += this.state.fileName;
		}

		if (isElectronApp()) {
			if (title.length > 0) {
				title += " - ";
			}
			title += "Bard Music Maker";
		}

		return (
			<div className="app">
				<div className="window-bar">
					<Menu />
					<div className="title">{title}</div>
					<WindowButtons />
				</div>
				<div className="media-bar">
					<Tracks trackCount={this.state.inputNotations.length} selectedTrack={this.state.selectedTrack} />
					<div className="controls">
						<i
							id="rewind-button"
							className="fas fa-step-backward"
							onClick={() => {
								player.setTime(0);
								this.setState({ caretPositionMeasures: 0 });
							}}
						/>
						<i
							id="play-button"
							className="fas fa-play"
							onClick={() => {
								player.loadMusic(this.state.musicNotation);
								player.playMusic();
							}}
						/>
						<i
							id="pause-button"
							className="fas fa-pause"
							onClick={() => {
								player.pauseMusic();
							}}
						/>
						<i
							id="stop-button"
							className="fas fa-stop"
							onClick={() => {
								player.stopMusic();
							}}
						/>
					</div>
				</div>
				<PianoRoll
					music={this.state.music || new Music()}
					selectedTrack={this.state.selectedTrack}
					caretPositionMeasures={this.state.caretPositionMeasures}
				></PianoRoll>
				<NotationEditor
					notation={this.state.inputNotations[this.state.selectedTrack]}
					trackIndex={this.state.selectedTrack}
					onChange={(notation) => {
						this.state.inputNotations[this.state.selectedTrack] = notation;
						this.setState(this.state);

						if (this.parseTimeout) {
							window.clearTimeout(this.parseTimeout);
						}

						this.parseTimeout = window.setTimeout(this.parseNotation.bind(this), 250);
					}}
				/>
				<StatusBar />
			</div>
		);
	}
}

/**
 * Executes a callback function once the document is loaded, or immediately if the document is already loaded.
 * @param callback The callback to execute.
 */
export default function onDocumentReady(callback: () => void): void {
	if (document.readyState === "complete" || document.readyState === "interactive") {
		setTimeout(callback, 1);
	} else {
		document.addEventListener("DOMContentLoaded", callback);
	}
}

function startApp() {
	const appContainer = document.querySelector(".container");
	const app = React.createElement(App);
	ReactDOM.render(app, appContainer);
}
