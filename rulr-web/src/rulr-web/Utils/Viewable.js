import { LiquidEvent } from './LiquidEvent.js'

export class Viewable {
	constructor() {
		// A reference to the counterpart server-side object
		this.serverInstance = null;
		this.serverCommitIndexCached = 0;

		// These are set by fromCreationDescriptionAsync
		this.module = '';
		this.class = '';

		this.firstDataReady = false; // This flag is set so that onFirstDataReady is only called once

		this.needsPushData = false;
		this.needsGuiUpdate = true;
		this.needsViewportUpdate = true;

		this.onFirstDataReady = new LiquidEvent();
		this.onDataRefresh = new LiquidEvent();
		this.onChange = new LiquidEvent(); // This is fired on client or server changes
	}

	// init() is called once per object creation. Consider putting any async init operations inside here
	async init() {

	}

	// updateData is called on every Viewable once every frame
	async updateData() {
		let dataChanged = false;

		if (this.needsPushData) {
			await this.pushData();
			this.needsPushData = false;
			dataChanged = true;
		}

		{
			var serverCommitIndex = await this.serverInstance.commit_index.get();
			var needsPullData = serverCommitIndex != this.serverCommitIndexCached;
			if (needsPullData) {
				await this.pullData();

				// Let any custom listeners know that the data has been updated
				if (!this.firstDataReady) {
					this.onFirstDataReady.notifyListeners();
					this.firstDataReady = true;
				}
				this.onDataRefresh.notifyListeners();


				// If any data is pulled, then we need to update the GUI elements
				this.needsGuiUpdate = true;
				this.needsViewportUpdate = true;
				this.serverCommitIndexCached = serverCommitIndex;
				dataChanged = true;
			}
		}

		if(dataChanged) {
			this.onChange.notifyListeners();
		}
	}

	commit() {
		this.needsPushData = true;
	}

	async pullData() {

	}

	async pushData() {

	}

	async updateView() {
		// TODO : check if this is visible or not in the gui before performing any gui build
		if (this.needsGuiUpdate) {
			await this.guiUpdate();
			this.needsGuiUpdate = false;
		}

		// TODO : this should be called from the viewport drawing system (e.g. only prepare to draw when this object is visible)
		if (this.needsViewportUpdate) {
			await this.viewportUpdate();
			this.needsViewportUpdate = false;
		}
	}

	async guiUpdate() {

	}

	async viewportUpdate() {

	}
}