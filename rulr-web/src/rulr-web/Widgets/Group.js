// Widgets.Group
import {Base} from './Base.js'

export class Group extends Base {
	constructor(getWidgets) {
		super();
		this.getWidgets = getWidgets;
	}

	draw() {
		super.draw();
		var widgets = this.getWidgets();
		
		var list = $('<ul class="list-group"></ul>');
		this.content.append(list);

		for(var widget of widgets) {
			widget.appendTo(list);
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