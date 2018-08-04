// Widgets.Base

import * as Utils from '../Utils.js'

export class Base {
	constructor() {
		this.watchViewables = [];
		this.onEditListeners = [];
		this.needsRedraw = true;
		this.caption = this.constructor.name;

		this.content = null;

		this.showDefaultTitle = true;

		this._domElement = null;
		this._title = null;
	}

	appendTo(parentDomElement) {
		if(this.showDefaultTitle) {
			this._domElement = $('<li class="list-group-item rulr-widget"></li>');
			this._domElement.appendTo(parentDomElement);
	
			{
				this._title = $(`<div class="rulr-widget-title"></div>`);
				this._title.appendTo(this._domElement);
			}
	
			{
				this.content = $(`<div class="rulr-widget-content"></div>`);
				this.content.appendTo(this._domElement);
			}	
		}
		else {
			this.content = $(`<div class="rulr-widget-content"></div>`);
			this.content.appendTo(parentDomElement);
		}
		
		this.firstDraw();
	}

	update() {
		for(var watchViewable of this.watchViewables) {
			if(watchViewable.isFrameNew) {
				this.needsRedraw = true;
				break;
			}
		}

		if (this.needsRedraw && this.content != null) {
			this.content.empty();
			this.draw();
			this.needsRedraw = false;
		}
	}

	firstDraw() {
		
	}

	draw() {
		if(this.showDefaultTitle) {
			this._title.html(Utils.camelCapsToSentanceCaps(this.caption));
		}
	}
}