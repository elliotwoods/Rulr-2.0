// Widgets.ComponentCard

import {Base} from './Base.js'
import * as Utils from '../Utils.js'

export class ComponentCard extends Base {
	constructor(component) {
		super();
		this.component = component;
		this.component.parameters.widget.showDefaultTitle = false;

		this.showDefaultTitle = false;
		this.componentCard = null;
	}

	draw() {
		super.draw();
		
		// Create the card
		{
			var nodeItemTemplateHTML = $("#Inspector-ComponentTemplate").first().html();
			this.componentCard = $(nodeItemTemplateHTML);
			this.componentCard.appendTo(this.content);
		}

		// Set the properties
		{
			this.componentCard.find('#inspector-card-name').html(Utils.camelCapsToSentanceCaps(this.caption));
			var innerList = this.componentCard.find('#inspector-card-content');
			this.component.parameters.widget.appendTo(innerList);

			let toolBar = this.componentCard.find('#toolBar');
			toolBar.hide();

			this.componentCard.mouseenter(() => {
				toolBar.show();
			});
			this.componentCard.mouseleave(function(event) {
				toolBar.hide();
			});
		}
	}

	update() {
		super.update();
		this.component.parameters.widget.update();
	}
}