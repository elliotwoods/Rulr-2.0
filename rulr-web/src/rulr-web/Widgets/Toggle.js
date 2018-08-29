import { Base } from './Base.js'

export class Widget extends Base {
	constructor(getFunction, setFunction) {
		super();
		this.getFunction = getFunction;
		this.setFunction = setFunction;
		
		this.valueCache = null;
		this.inputField = null;
	}

	update() {
		super.update();

		{
			var value = this.getFunction();
			if(value != this.valueCache) {
				// Don't draw NaN
				if(value == value) {
					this.valueCache = value;
					this.needsRedraw = true;
				}
			}
		}
	}

	firstDraw() {
		super.firstDraw();

		if (this._title != null) {
			this._title.addClass('rulr-widget-title-left');
		}

		this.content.addClass('rulr-widget-content-right');

		this.inputField = $('<input type="checkbox" data-toggle="toggle" />');
		this.content.append(this.inputField);

		this.inputField.change((newValue) => {
			newValue = this.inputField.is(":checked");
			this.setFunction(newValue);
		});
	}

	draw() {
		super.draw();

		var value = this.getFunction();
		this.inputField.prop('checked', value);
		this.valueCache = value;
	}
}