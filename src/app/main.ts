import fs from "fs";
import { app, BrowserWindow, dialog, ipcMain } from "electron";
import * as path from "path";

let window: BrowserWindow;

function createWindow() {
	window = new BrowserWindow({
		title: "Bard Music Maker",
		width: 800,
		height: 600,
		frame: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: true,
			preload: path.join(__dirname, "./preload.js"),
			devTools: true,
		},
	});

	window.setMenu(null);
	window.loadFile(path.join(__dirname, "./view/index.html"));
	window.webContents.openDevTools();
}
app.on("ready", createWindow);

ipcMain.handle("openNotation", async (event) => {
	const openValue = await dialog.showOpenDialog(window, {
		filters: [{ name: "Bard Music Language", extensions: ["bml"] }],
		properties: ["openFile"],
	});

	if (openValue.filePaths[0]) {
		return [openValue.filePaths[0], fs.readFileSync(openValue.filePaths[0]).toString()];
	}
});

ipcMain.handle("saveNotation", async (event, ...[notation, filePath]) => {
	function saveNotation(filePath: string, notation: string) {
		fs.writeFileSync(filePath, notation);
		return filePath;
	}

	if (filePath) {
		return saveNotation(filePath, notation);
	} else {
		const saveValue = await dialog.showSaveDialog(window, {
			filters: [{ name: "Bard Music Language", extensions: ["bml"] }],
		});

		if (saveValue.filePath) {
			return saveNotation(saveValue.filePath, notation);
		}
	}
});

ipcMain.handle("saveMidi", (event, ...[midi]) => {
	dialog.showSaveDialog(window, { filters: [{ name: "Midi", extensions: ["mid", "midi"] }] }).then((save) => {
		if (save.filePath) {
			fs.writeFileSync(save.filePath, midi);
		}
	});
});

ipcMain.handle("window:minimise", (event) => {
	BrowserWindow.getFocusedWindow()?.minimize();
});

ipcMain.handle("window:maximise", (event) => {
	const window: BrowserWindow = BrowserWindow.getFocusedWindow()!;
	if (!window.isMaximized()) {
		window.maximize();
	} else {
		window.restore();
	}
});

ipcMain.handle("window:close", (event) => {
	BrowserWindow.getFocusedWindow()?.close();
});

ipcMain.handle("log", (event, message) => {
	console.log(message);
});
