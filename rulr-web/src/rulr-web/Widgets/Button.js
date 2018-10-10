import {Base} from './Base.js'

export class Button extends Base {
	constructor(caption, action) {
		super();
		this.caption = caption;
		this.action = action;

		this.button = null;
	}

	firstDraw() {
		super.firstDraw();

		this.button = $(`<button class="btn">${this.caption}</button>`);
		this.button.click(this.action);
		this.content.append(this.button);
	}
}