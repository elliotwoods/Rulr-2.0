import { WorldExplorer } from './WorldExplorer.js'
import { Inspector } from './Inspector.js';
import { LoadProjectDialog } from './LoadProjectDialog.js';

class Window {
	constructor() {
		self.worldExplorer = new WorldExplorer();
		self.inspector = new Inspector();
		self.loadProjectDialog = new LoadProjectDialog();
	}

	refresh() {
		self.worldExplorer.refresh();
	}
}

var rulrWindow = new Window();

export { rulrWindow };