import {Base} from './Base.js'
import {Numeric} from './Numeric.js'
import {LiquidEvent} from '../Utils/LiquidEvent.js'

var matrixIndex = 0;

export class Widget extends Base {
	constructor(getFunction) {
		super();
		this.getFunction = getFunction;
		this._imageElement = null;
		this.onLoadImage = new LiquidEvent();
	}

	firstDraw() {
		this._imageElement = $(`<img class="rulr-widgets-image-img"></div>`);
		this.content.append(this._imageElement);
	}

	draw() {
		super.draw();
		
		var image_b64_string = this.getFunction();
		if(image_b64_string.length == 0)
		{
			this._imageElement.attr("src", "");
		}
		else {
			this._imageElement.attr("src", `data:image/png;base64, ${image_b64_string}`);
			this._imageElement.ready(() => {
				this.onLoadImage.notifyListeners();
			});
		}
	}

	getImage() {
		return this._imageElement[0];
	}
}
