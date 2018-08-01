export class Viewable {
	constructor() {
		this.module = '';
		this.class = '';
		this.newDataForNextFrame = true;
		this.isFrameNew = false;
	}

	update() {
		this.isFrameNew = this.newDataForNextFrame;
		this.newDataForNextFrame = false;
	}
}