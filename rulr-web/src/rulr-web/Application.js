import { showException } from './Utils.js'
import { fromServerInstance } from './Imports.js'
import { pyCall } from './Imports.js'
import { Window } from './Interface/Window.js'
class Application {
	constructor() {
		this.window = new Window();
		this.rootNode = null;
		this.explorerNodePath = [];
		this.selection = null;
		this.serverInstance = null;
	}

	async initialise(serverApplication) {
		try {
			this.serverInstance = serverApplication;
			await this.refresh();

			// start the regular update
			regularUpdate();
		}
		catch (exception) {
			showException(exception);
		}
	}

	async refresh() {
		if (this.serverInstance == null) {
			throw ("Server application is not available");
		}

		// Check if the application is loaded
		if (await pyCall(this.serverInstance.hasRootNode)) {
			var nodeServerInstance = await pyCall(this.serverInstance.getNodeByPath, []);
			this.rootNode = await fromServerInstance(nodeServerInstance);

			// We must update before setting the selection (otherwise it won't be populated)
			await this.rootNode.updateData();

			// Set the selection to the first node (temporary - until we have click selection)
			this.selection = this.rootNode.getChildByPath([0]);

			// Refresh the interface
			this.window.refresh();
		}
		else {
			// If not loaded, pop up the load project dialog
			this.window.loadProjectDialog.whenReady(() => {
				this.window.loadProjectDialog.show();
			});
		}
	}

	async update() {
		await pyCall(this.serverInstance.update);
		if (this.rootNode != null) {
			await this.rootNode.updateData();
			await this.rootNode.updateView();
		}
		this.window.update();
	}

	getVisibleNodes() {
		return getVisibleNodeAndChildren(this.rootNode);
	}

	getSelection() {
		return this.selection;
	}

	selectNode(nodeInstance) {
		this.selection = nodeInstance;
		this.window.inspector.needsRefresh = true;
	}
}

function getVisibleNodeAndChildren(node) {
	if (node == null) {
		return [];
	}

	if (node != null && node.header.description.visible) {
		var visibleNodes = [];

		visibleNodes.push(node);
		if ('children' in node) {
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

let applicationLockUpdate = false;
function regularUpdate() {
	application.update().then(regularUpdate);
}

export { application };