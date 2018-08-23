import { WorldExplorer } from './WorldExplorer.js'
import { Inspector } from './Inspector.js';
import { LoadProjectDialog } from './LoadProjectDialog.js';
import { Viewport } from './Viewport.js';
import { Toolbar } from './Toolbar.js';
import { GeneralModal } from './GeneralModal.js';

class Window {
	constructor() {
		this.viewport = new Viewport();
		this.toolbar = new Toolbar();
		this.worldExplorer = new WorldExplorer();
		this.inspector = new Inspector();
		this.loadProjectDialog = new LoadProjectDialog();
		this.generalModal = new GeneralModal();
	}

	async update() {
		if(this.viewport.ready) {
			await this.viewport.update();
		}
		if(this.toolbar.ready) {
			await this.toolbar.update();
		}
		if(this.worldExplorer.ready) {
			await this.worldExplorer.update();
		}
		if(this.inspector.ready) {
			await this.inspector.update();
		}
		if(this.generalModal.ready) {
			await this.generalModal.update();
		}
	}

	async refresh() {
		await this.viewport.refresh();
		await this.toolbar.refresh();
		await this.worldExplorer.refresh();
		await this.inspector.refresh();
		await this.generalModal.update();
	}
}

export { Window };