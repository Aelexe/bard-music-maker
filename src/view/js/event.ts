function on(eventType: string, listener: (data?: any) => void) {
	document.addEventListener(eventType, listener);
}

function off(eventType: string, listener: (data?: any) => void) {
	document.removeEventListener(eventType, listener);
}

function once(eventType: string, listener: (data?: any) => void) {
	on(eventType, handleEventOnce);

	function handleEventOnce() {
		listener();
		off(eventType, handleEventOnce);
	}
}

function trigger(eventType: string): void;
function trigger(eventType: string, data: any): void;
function trigger(eventType: string, data?: any): void {
	const event = new CustomEvent(eventType, { detail: data });
	document.dispatchEvent(event);
}

export { on, once, off, trigger };
