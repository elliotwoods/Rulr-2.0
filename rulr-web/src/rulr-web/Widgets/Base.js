// Widgets.Base
export class Base {
	constructor() {
		this.watchViewables = [];
		this.onEditListeners = [];
		this.needsRedraw = true;
		this.caption = this.constructor.name;
		
		this.domElement = null;
		this.title = null;
		this.content = null;
	}

	appendTo(parentDomElement) {
		this.domElement = $('<li class="list-group-item rulr-widget"></li>');
		this.domElement.appendTo(parentDomElement);

		{
			this.title = $(`<div class="rulr-widget-title">${this.caption}</div>`);
			this.title.appendTo(this.domElement);
		}

		{
			this.content = $(`<div class="rulr-widget-content"></div>`);
			this.content.appendTo(this.domElement);
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

		if (this.needsRedraw && this.domElement != null) {
			this.content.empty();
			this.draw();
			this.needsRedraw = false;
		}
	}

	firstDraw() {
		
	}

	draw() {
		this.title.html(this.caption);
	}
}