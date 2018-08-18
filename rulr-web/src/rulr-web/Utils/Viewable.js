export class Viewable {
	constructor(serverInstance) {
		// A reference to the counterpart server-side object
		this.serverInstance = null;

		// These are set by fromCreationDescriptionAsync
		this.module = '';
		this.class = '';

		this.needsRefreshData = true;
		this.needsGuiUpdate = true;
	}

	// Update is called on every Viewable once every frame
	async update() {
		if(this.needsRefreshData) {
			await this.refreshData();
			this.needsRefreshData = false;
			this.needsGuiUpdate = true;
		}

		// TODO : check if this is visible or not in the gui before performing any gui build
		if(this.needsGuiUpdate) {
			await this.guiUpdate();
			this.needsGuiUpdate = false;
		}
	}

	async refreshData() {
		
	}

	async guiUpdate() {

	}
}