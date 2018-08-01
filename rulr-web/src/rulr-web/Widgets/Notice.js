import {Base} from './Base.js'

export class Notice extends Base {
	constructor(caption) {
		super();
		this.caption = caption;
	}

	draw() {
		super.draw();
		this.content.html(this.caption);
	}
}