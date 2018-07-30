import { WorldExplorer } from './WorldExplorer.js'
import { Inspector } from './Inspector.js';
import { LoadProjectDialog } from './LoadProjectDialog.js';
import { Viewport } from './Viewport.js';

class Window {
	constructor() {
		self.viewport = new Viewport();
		self.worldExplorer = new WorldExplorer();
		self.inspector = new Inspector();
		self.loadProjectDialog = new LoadProjectDialog();
	}

	refresh() {
		self.viewport.refresh();
		self.worldExplorer.refresh();
		self.inspector.refresh();
	}

	update() {
		if(self.viewport.loaded) {
			self.viewport.update();
		}
	}
}

var rulrWindow = new Window();

function update() {
	requestAnimationFrame(update);
	rulrWindow.update();
}

$(document).ready(() => {
	update();
});

export { rulrWindow };