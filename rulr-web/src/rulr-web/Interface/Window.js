import { WorldExplorer } from './WorldExplorer.js'
import { Inspector } from './Inspector.js';
import { LoadProjectDialog } from './LoadProjectDialog.js';
import { Viewport } from './Viewport.js';

class Window {
	constructor() {
		this.viewport = new Viewport();
		this.worldExplorer = new WorldExplorer();
		this.inspector = new Inspector();
		this.loadProjectDialog = new LoadProjectDialog();
	}

	refresh() {
		this.viewport.refresh();
		this.worldExplorer.refresh();
		this.inspector.refresh();
	}

	update() {
		if(this.viewport.ready) {
			this.viewport.update();
		}
	}
}

export { Window };