export class Viewable {
	constructor(serverInstance) {
		// A reference to the counterpart server-side object
		this.serverInstance = null;

		// These are set by fromCreationDescriptionAsync
		this.module = '';
		this.class = '';

		// Used by update to call refresh as required
		this.newDataForNextFrame = true;
		this.isFrameNew = false;
	}

	async update() {
		this.isFrameNew = this.newDataForNextFrame;
		this.newDataForNextFrame = false;

		if(this.isFrameNew) {
			await this.refresh();
		}
	}

	async refresh() {

	}
}