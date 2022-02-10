declare var electronBridge: any;
declare var webBridge: any;
let bridge: { invoke: (channel: string, ...args: any[]) => Promise<any> };

if (typeof electronBridge !== "undefined") {
	bridge = electronBridge;
} else {
	bridge = webBridge;
}

export default bridge;

export function isElectronApp(): boolean {
	return typeof electronBridge !== "undefined";
}

export function isWebApp(): boolean {
	return typeof electronBridge === "undefined";
}
