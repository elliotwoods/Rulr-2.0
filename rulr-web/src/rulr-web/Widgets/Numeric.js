import { Base } from './Base.js'

export class Numeric extends Base {
	constructor(getFunction, setFunction) {
		super();
		this.getFunction = getFunction;
		this.setFunction = setFunction;
		this.needsDigitRedraw = false;
		this.digitDivs = new Object();
	}

	update() {
		super.update();
		if (this.needsDigitRedraw) {
			this.redrawDigits();
		}
	}

	firstDraw() {
		this.title.addClass('rulr-widget-title-left');
		this.content.addClass('rulr-widget-content-right');
	}

	draw() {
		super.draw();
		var value = this.getFunction();

		var highDigitCount = Math.floor(Math.log(value) / Math.log(10));
		highDigitCount = Math.max(highDigitCount, 2);

		{
			let digitElement = $(`<a href="#" class="rulr-link-unstyle rulr-widget-numeric-digit">&nbsp;</a>`);
			this.content.append(digitElement);
			this.digitDivs["sign"] = digitElement;
		}

		for (var exp = highDigitCount; exp >= -3; exp--) {
			let numberScale = Math.pow(10, exp);
			
			
			let digitElement = $(`<a href="#" class="rulr-link-unstyle rulr-widget-numeric-digit">&nbsp;</a>`);
			this.content.append(digitElement);
			this.digitDivs[exp.toString()] = digitElement;

			let isDragging = false;
			let mouseY = 0;
			let sumDelta = 0;

			let mouseMoveListener = (event) => {
				var delta = event.clientY - mouseY;
				delta /= 8;
				if (Math.abs(delta) > 1) {
					var digitDelta = Math.floor(Math.abs(delta)) * Math.sign(delta);
					mouseY += digitDelta * 8;

					//calculate new value
					var newValue = this.getFunction();
					newValue -= digitDelta * numberScale;
					this.setFunction(newValue);

					//flag for redraw digits on next update
					this.needsDigitRedraw = true;
				}
			};
			let mouseUpListener = (event) => {
				document.removeEventListener("mousemove", mouseMoveListener);
				document.removeEventListener("mouseup", mouseUpListener);

				digitElement.removeClass('rulr-widget-numeric-digit-selected');
			};

			digitElement.mousedown((event) => {
				// Don't perform a normal drag
				event.preventDefault();

				// Add listeners to mouse actions
				document.addEventListener("mousemove", mouseMoveListener);
				document.addEventListener("mouseup", mouseUpListener);

				mouseY = event.clientY;

				digitElement.addClass('rulr-widget-numeric-digit-selected');
			});

			// Add the decimal point after the single digits
			if (exp == 0) {
				this.content.append($(`<span class="rulr-widget-numeric-decimalpoint">&bull;</span>`));
			}
		}

		this.needsDigitRedraw = true;
	}

	redrawDigits() {
		var keys = Object.keys(this.digitDivs);
		var value = this.getFunction();

		for (var key of keys) {
			var div = this.digitDivs[key];

			if(key == "sign") {
				div.html(value >= 0 ? "+" : "-");
			}
			else {
				var exp = Number(key);
				let numberScale = Math.pow(10, exp);
				var digit = Math.floor(Math.abs(value % (numberScale * 10)) / numberScale);
				div.html(digit);
			}
		}
		this.needsDigitRedraw = false;
	}
}