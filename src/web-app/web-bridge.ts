var webBridge = {
	invoke: async (channel: string, ...args: any[]): Promise<any> => {
		if (channel === "openNotation") {
			return await openNotation();
		} else if (channel === "saveNotation") {
			return await saveNotation(args[0] as string, args[1] as string);
		} else if (channel === "saveMidi") {
			return await saveMidi(args[0] as Buffer, args[1] as string);
		}
		return "";
	},
};

let fileInput: HTMLInputElement;
let cancelExistingDialog: (value: unknown) => void;

function createFileInput() {
	if (fileInput === undefined) {
		fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.style.display = "none";
		fileInput.accept = ".bml";
		document.body.appendChild(fileInput);
	}
}

function openNotation(): Promise<any> {
	createFileInput();

	if (cancelExistingDialog !== undefined) {
		cancelExistingDialog(null);
	}

	fileInput.click();

	return new Promise((resolve) => {
		cancelExistingDialog = resolve;

		fileInput.onchange = (e) => {
			if (fileInput.files?.length === 0) {
				resolve(null);
			}

			const file = fileInput.files![0];

			const reader = new FileReader();
			reader.readAsText(file, "UTF-8");
			reader.onload = function (e) {
				resolve([file.name, e.target?.result]);
			};
			reader.onerror = function (e) {
				resolve(null);
			};
		};
	});
}

function saveNotation(notation: string, fileName?: string) {
	const a = document.createElement("a");
	a.href = window.URL.createObjectURL(new Blob([notation], { type: "text/plain" }));
	a.download = fileName || "music.bml";
	a.click();
}

function saveMidi(midi: Buffer, fileName?: string) {
	const a = document.createElement("a");
	a.href = window.URL.createObjectURL(new Blob([midi], { type: "text/plain" }));
	a.download = `${fileName}.midi` || "music.midi";
	a.click();
}
