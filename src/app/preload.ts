import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronBridge", {
	on: (channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
		ipcRenderer.on(channel, listener);
	},
	invoke: (channel: string, ...args: any[]) => {
		return ipcRenderer.invoke(channel, ...args);
	},
});

ipcRenderer.on("log", (event, message) => {
	console.log(...message);
});
