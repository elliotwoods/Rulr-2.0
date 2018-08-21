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

	async update() {
		if(this.viewport.ready) {
			await this.viewport.update();
		}
		if(this.worldExplorer.ready) {
			await this.worldExplorer.update();
		}
		if(this.inspector.ready) {
			await this.inspector.update();
		}
	}

	async refresh() {
		await this.viewport.refresh();
		await this.worldExplorer.refresh();
		await this.inspector.refresh();
	}
}

export { Window };