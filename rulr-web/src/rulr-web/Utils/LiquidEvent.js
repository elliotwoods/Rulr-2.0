
export class LiquidEvent {
	constructor() {
		this.listeners = [];
	}

	addListener(callback) {
		this.listeners.push(callback);
	}

	notifyListeners() {
		for(let listener of this.listeners) {
			listener();
		}
	}
};