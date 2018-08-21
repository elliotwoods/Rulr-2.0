// Widgets.Group
import {Base} from './Base.js'

export class Group extends Base {
	constructor(getWidgets) {
		super();
		this.getWidgets = getWidgets;
		this.listElement = null;
	}

	firstDraw() {
		super.firstDraw();
		this.listElement = $('<ul class="list-group"></ul>');
		this.content.append(this.listElement);
	}

	draw() {
		super.draw();
		var widgets = this.getWidgets();
		
		this.listElement.empty();

		for(var widget of widgets) {
			widget.appendTo(this.listElement);
		}
	}

	update() {
		super.update();
		var widgets = this.getWidgets();
		for(var widget of widgets) {
			widget.update();
		}
	}
}