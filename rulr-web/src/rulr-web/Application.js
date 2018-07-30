import * as Utils from './Utils.js'
import { Window } from './Interface/Window.js'

class Application {
	constructor() {
		this.window = new Window();
		this.rootNode = null;
		this.refresh();
	}

	async refresh() {
		var status = null;
		await Utils.asyncRequest("/Application/Graph/GetStatus", {}, (applicationStatus) => {
			status = applicationStatus;
		});

		if(status.hasRootNode) {
			await Utils.asyncRequest("/Application/Graph/GetViewDescription"
			, {
				nodePath : []
			}, (response) => {
				this.rootNode = Utils.fromViewDescription(response.nodeViewDescription);
			});
		}
		else {
			this.window.loadProjectDialog.whenReady(() => {
				this.window.loadProjectDialog.show();
			});

		}
	}

	update() {
		this.window.update();
	}
}

var application = new Application();

function update() {
	requestAnimationFrame(update);
	application.update();
}

$(document).ready(() => {
	update();
});

export { application };