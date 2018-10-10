// Widgets.ComponentCard

import {Base} from './Base.js'
import * as Utils from '../Utils.js'

export class ComponentCard extends Base {
	constructor(component) {
		super();
		this.component = component;

		this.showDefaultTitle = false;
		this.componentCard = null;
	}

	async init() {
		super.init();
		this.component.parameters.widget.showDefaultTitle = false;
	}

	firstDraw() {
		super.firstDraw();

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

			//Add the parameter widgets to the list
			this.component.parameters.widget.appendTo(innerList);

			//Add the actions
			for(let [caption, action] of Object.entries(this.component.actions)) {
				let button = $(`<button class="btn">${caption}</button>`);
				button.click(action);
				this.componentCard.append(button);
			}

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