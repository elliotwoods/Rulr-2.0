export class Viewable {
	constructor(serverInstance) {
		// A reference to the counterpart server-side object
		this.serverInstance = null;

		// These are set by fromCreationDescriptionAsync
		this.module = '';
		this.class = '';

		this.onDataReadyListeners = [];

		this.dataReady= false;

		this.needsRefreshData = true;
		this.needsGuiUpdate = true;
		this.needsViewportUpdate = true;
	}

	// Update is called on every Viewable once every frame
	async updateData() {
		if(this.needsRefreshData) {
			await this.refreshData();
			this.needsRefreshData = false;
			this.needsGuiUpdate = true;
			if(!this.dataReady) {
				this.onDataReady();
				this.dataReady = true;
			}
		}
	}

	async updateView() {
		// TODO : check if this is visible or not in the gui before performing any gui build
		if(this.needsGuiUpdate) {
			await this.guiUpdate();
			this.needsGuiUpdate = false;
		}

		// TODO : this should be called from the viewport drawing system (e.g. only prepare to draw when this object is visible)
		if(this.needsViewportUpdate) {
			await this.viewportUpdate();
			this.needsViewportUpdate = false;
		}
	}

	async refreshData() {
		
	}

	async guiUpdate() {

	}

	async viewportUpdate() {

	}

	onDataReady() {
		for(let listener of this.onDataReadyListeners) {
			listener();
		}
	}
}