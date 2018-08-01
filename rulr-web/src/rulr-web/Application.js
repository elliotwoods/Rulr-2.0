import * as Utils from './Utils.js'
import { Window } from './Interface/Window.js'

class Application {
	constructor() {
		this.window = new Window();
		this.rootNode = null;
		this.explorerNodePath = [];
		this.selection = null;
		this.refresh();
	}

	async refresh() {
		var status = null;

		// Get the application status
		await Utils.asyncRequest("/Application/Graph/GetStatus", {}, (applicationStatus) => {
			status = applicationStatus;
		});

		// Check if the application is loaded
		if(status.hasRootNode) {
			await Utils.asyncRequest("/Application/Graph/GetViewDescription"
			, {
				nodePath : []
			}, async (response) => {
				// Populate the local graph
				this.rootNode = await Utils.fromViewDescriptionAsync(response.nodeViewDescription);

				// Set the selection to the first node (temporary - until we have click selection)
				application.selection = application.rootNode.getChildByPath([0]);

				// Refresh the interface
				this.window.refresh();
			});
		}
		else {
			// If not loaded, pop up the load project dialog
			this.window.loadProjectDialog.whenReady(() => {
				this.window.loadProjectDialog.show();
			});
		}
	}

	update() {
		if(this.rootNode != null) {
			this.rootNode.update();
		}
		this.window.update();
	}

	getVisibleNodes() {
		return getVisibleNodeAndChildren(this.rootNode);
	}

	getSelection() {
		return this.selection;
	}
}

function getVisibleNodeAndChildren(node) {
	if(node == null) {
		return [];
	}

	if(node != null && node.header.visible) {
		var visibleNodes = [];

		visibleNodes.push(node);
		if('children' in node) {
			node.children.forEach((child) => {
				visibleNodes = visibleNodes.concat(getVisibleNodeAndChildren(child));
			});
		}
		
		return visibleNodes;
	}
	else {
		return [];
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