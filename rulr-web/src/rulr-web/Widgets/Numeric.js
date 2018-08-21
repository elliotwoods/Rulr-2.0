import { Base } from './Base.js'

export class Numeric extends Base {
	constructor(getFunction, setFunction) {
		super();
		this.getFunction = getFunction;
		this.setFunction = setFunction;

		this.digits = null;
		this.textEntry = null;

		this.digitDivs = new Object();
		this.drawnDigitHeight = -1;

		this._defaultHighDigitCount = 1;
		
		this.valueCache = null;

		this.decimalPlaces = 3;
		this.highDigitCount = this._defaultHighDigitCount;
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

		this.digits = $('<span></span>');
		this.digitDivs = new Object();
		this.content.append(this.digits);

		// text entry
		{
			this.textEntry = $(`<input class="form-control form-control-sm" placeholder=""/>`)
			this.content.append(this.textEntry);
			this.textEntry.hide();

			let closeTextEntry = () => {
				//get the value
				{
					var textEntryValue = parseFloat(this.textEntry.val());

					// Avoid NaN
					if (textEntryValue == textEntryValue) {
						this.setFunction(textEntryValue);
						this.needsRedraw = true;
					}
				}
				this.textEntry.hide();
				this.digits.show();
			};

			this.textEntry.keydown((event) => {
				var key = event.which;
				if (key == 13) {
					closeTextEntry();
				}
			})
			this.textEntry.focusout(closeTextEntry);
		}
	}

	draw() {
		super.draw();

		// rebuild digits
		{
			var height = Math.log(Math.abs(this.valueCache)) / Math.log(10);
			height = Math.floor(height) + 1;
			var digitHeightToDraw = Math.max(height, this._defaultHighDigitCount);
			if (this.drawnDigitHeight != digitHeightToDraw) {
				this.rebuildDigits(digitHeightToDraw);
			}
		}

		// set digit values
		this.redrawDigits();
	}

	rebuildDigits(digitHeightToDraw) {
		this.digits.empty();

		let digitElement = $(`<span class="rulr-widget-numeric-sign">&nbsp;</a>`);
		this.digits.append(digitElement);
		this.digitDivs["sign"] = digitElement;

		for (var exp = digitHeightToDraw; exp >= -this.decimalPlaces; exp--) {
			let numberScale = Math.pow(10, exp);

			let digitElement = $(`<a href="#" class="rulr-link-unstyle rulr-widget-numeric-digit">&nbsp;</a>`);
			this.digits.append(digitElement);
			this.digitDivs[exp.toString()] = digitElement;

			let isDragging = false;
			let mouseY = 0;
			let sumDelta = 0;
			let mouseMoved = false;

			let mouseDownListener = (event) => {
				// Don't perform a normal drag
				event.preventDefault();

				// Add listeners to mouse actions
				document.addEventListener("mousemove", mouseMoveListener);
				document.addEventListener("mouseup", mouseUpListener);

				mouseY = event.clientY;
				mouseMoved = false;

				digitElement.addClass('rulr-widget-numeric-digit-selected');
			};
			let mouseMoveListener = (event) => {
				var delta = event.clientY - mouseY;
				const pxPerStep = 4;
				delta /= pxPerStep;
				if (Math.abs(delta) > 1) {
					mouseMoved = true;

					var digitDelta = Math.floor(Math.abs(delta)) * Math.sign(delta);
					mouseY += digitDelta * pxPerStep;

					//calculate new value
					var newValue = this.getFunction();
					newValue -= digitDelta * numberScale;
					newValue = round(newValue, this.decimalPlaces);
					this.setFunction(newValue);
				}
			};
			let mouseUpListener = (event) => {
				document.removeEventListener("mousemove", mouseMoveListener);
				document.removeEventListener("mouseup", mouseUpListener);

				digitElement.removeClass('rulr-widget-numeric-digit-selected');

				if (!mouseMoved) {
					this.digits.hide();
					this.textEntry.show();
					this.textEntry.val(this.getFunction().toString());
					this.textEntry.select();
				}
			};

			//this also attaches the other listeners
			digitElement.mousedown(mouseDownListener);

			// Add the decimal point after the single digits
			if (exp == 0) {
				this.digits.append($(`<span class="rulr-widget-numeric-decimalpoint">&bull;</span>`));
			}
		}

		this.drawnDigitHeight = digitHeightToDraw;
	}

	redrawDigits() {
		var keys = Object.keys(this.digitDivs);

		var valueString = Math.abs(this.valueCache).toFixed(this.decimalPlaces);
		var reverseValueString = valueString.split("").reverse().join("");

		var cleanedValue = this.valueCache;
		{
			var pow = Math.pow(10, this.decimalPlaces);
			cleanedValue = Math.round(cleanedValue * pow) / pow;
		}

		for (var key of keys) {
			var div = this.digitDivs[key];

			if (key == "sign") {
				if(cleanedValue > 0) {
					div.html('+');
				}
				else if(cleanedValue == 0) {
					div.html('&nbsp;');
				}
				else {
					div.html('-');
				}
			}
			else {
				var exponent = Number(key);

				var digit = getDigitFromValueString(reverseValueString, exponent, this.decimalPlaces);
				div.html(digit);

				if (cleanedValue < 0) {
					div.addClass('rulr-widget-digit-negative');
				}
				else {
					div.removeClass('rulr-widget-digit-negative');
				}

				if (Math.abs(cleanedValue) < Math.pow(10, exponent)) {
					div.addClass('rulr-widget-digit-greyed');
					div.removeClass('rulr-widget-digit-negative');
				}
				else {
					div.removeClass('rulr-widget-digit-greyed');
				}
			}
		}
	}
}

function getDigit(value, digitIndex) {
	var numberScale = Math.pow(10, digitIndex);
	var significand = Math.abs(value) / numberScale;
	var digit = Math.floor(Math.round(significand, 8) % 10);
	return digit;
}

function round(value, decimalPlaces) {
	var multiplier = Math.pow(10, decimalPlaces);
	return Math.round(value * multiplier) / multiplier;
}

function getDigitFromValueString(reverseValueString, exponent, decimalPlaces) {
	var charIndex = exponent + decimalPlaces;

	//ignore the decimal place
	if (charIndex >= decimalPlaces) {
		charIndex++;
	}

	//zeros if digit is larger than value represented by string
	if (charIndex >= reverseValueString.length) {
		return '0'
	}
	else {
		return reverseValueString.charAt(charIndex);
	}
}