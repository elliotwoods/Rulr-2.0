export class Element {
	constructor() {
		this.ready = false;
		this.whenReadyActions = [];

		var className = this.constructor.name;

		$(document).ready(() => {
			$(`#${className}-placeholder`).load(`Interface/${className}.html`, () => {
				this.ready = true;
				this.whenReadyActions.forEach((action) => {
					action();
				});
				this.whenReadyActions = [];
			});
		});
	}

	whenReady(action) {
		if('ready' in this && this.ready) {
			action();
		}
		else {
			this.whenReadyActions.push(action);
		}
	}
}