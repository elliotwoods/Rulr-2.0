import {Base} from './Base.js'
import {Numeric} from './Numeric.js'

var matrixIndex = 0;

export class Matrix extends Base {
	constructor(getFunction, setFunction) {
		super();
		this.getFunction = getFunction;
		this.setFunction = setFunction;

		this._SIGNIFICANT_FIGURES = 4;

		this.drawnRows = -1;
		this.drawnCols = -1;

		this.selection = [0, 0];
		this._container = null;
		this._table = null;

		this.hrefName = `matrix_editor_${matrixIndex++}`;

		this.numericEditor = new Numeric(() => {
			return this.getSelectedValueForNumericWidget();
		}, (newValue) => {
			this.setSelectedValueForNumericWidget(newValue);
			this.needsRedraw = true;
		});
		this.numericEditorContainer = null;

		this.cellElements = [];
	}

	update() {
		super.update();
		this.numericEditor.update();
	}

	firstDraw() {
		this._container = $(`<div class="rulr-widgets-matrix-container"></div>`);
		this.content.append(this._container);
		this._table = $(`<table class="table rulr-widgets-matrix-table"></table>`);
		this._container.append(this._table);

		//numeric editor
		{
			var anchor = $(`<a name="${this.hrefName}" />`);
			this.content.append(anchor);

			this.numericEditorContainer = $("<div></div>");
			this.numericEditorContainer.appendTo(this.content);
			this.numericEditorContainer.hide();

			var dismissButton = $(`<button class="btn btn-sm rulr-widget-matrix-numericeditor-dismiss"><i class="far fa-circle"></i></button>`);
			this.numericEditorContainer.append(dismissButton);
			dismissButton.click(() => {
				this.numericEditorContainer.hide();
				this.needsRedraw = true;
			});

			this.numericEditor.appendTo(this.numericEditorContainer);
		}
	}

	draw() {
		super.draw();

		var value = this.getFunction();

		var rows = value.length;
		var cols = rows == 0 ? 0 : value[0].length;

		if(rows != this.drawnRows && cols != this.drawnCols) {
			this.rebuildTable(rows, cols);
		}

		this.redrawCells(value);
	}

	rebuildTable(rows, cols) {
		this.cellElements = [];

		this._table.empty();

		for(var rowIndex = 0; rowIndex < rows; rowIndex++) {
			let tableRow = $(`<tr class="rulr-widgets-matrix-table-row"></tr>`);
			this._table.append(tableRow);

			for(var colIndex = 0; colIndex < cols; colIndex++) {
				let tableCell = $(`<td class="rulr-widgets-matrix-table-cell"></td>`);
				tableRow.append(tableCell);

				tableCell.width(`100%`);

				//we could jump to ${this.hrefName} at this point, but actually it's jarring
				let cellContent = $(`<a href="#" class="rulr-widgets-matrix-table-cellcontent"></a>`);
				tableCell.append(cellContent);

				let cellIndex = [rowIndex, colIndex];

				cellContent.click(() => {
					this.selection = cellIndex;
					this.numericEditorContainer.show();
					this.numericEditor.caption = "(" + this.selection.join(', ') + ")";
					this.numericEditor.needsRedraw = true;
					this.needsRedraw = true;
				});

				this.cellElements.push({
					contentElement : cellContent,
					index: [rowIndex, colIndex]
				});
			}
		}

		this.drawnRows = rows;
		this.drawnCols = cols;
	}

	redrawCells(value) {
		for(var cell of this.cellElements) {
			var cellValue = value[cell.index[0]][cell.index[1]];
			
			var cellValueString = cellValue.toString();
		
			// TRUNCATE 
			{
				var absValue = Math.abs(cellValue);
				if(absValue == 0 || absValue == Math.floor(absValue)) {
					//do nothing - just print 0 or int
				}
				else if(absValue >= 1.0) {
					var digitsBeforePoint = Math.floor(Math.log10(absValue)) + 1;
					if(digitsBeforePoint >= this._SIGNIFICANT_FIGURES) {
						//More than sig figs before decimal point. truncate at decimal point
						cellValueString = Math.round(absValue).toString() + ".";
					}
					else {
						//Less than sig figs before decimal point. truncate after decimal point
						var digitsAfterPoint = this._SIGNIFICANT_FIGURES - digitsBeforePoint;
						var power = Math.pow(10, digitsAfterPoint);
						cellValueString = (Math.round(absValue * power) / power).toString();
					}

					if(cellValue < 0) {
						cellValueString = "-" + cellValueString;
					}

					cellValueString += "&hellip;";
				}
				else {
					if(cellValueString.length - 1 < this._SIGNIFICANT_FIGURES) {
						//do nothing - print short value 
					}
					else {
						// print small value truncated
						var power = Math.pow(10, this._SIGNIFICANT_FIGURES - 1);
						cellValueString = (Math.round(absValue * power) / power).toString();
						if(cellValue < 0) {
							cellValueString = "-" + cellValueString;
						}
						cellValueString += "&hellip;";
					}
				}
			}

			cell.contentElement.html(cellValueString);

			if(this.numericEditorContainer.css('display') != 'none' && cell.index[0] == this.selection[0] && cell.index[1] == this.selection[1]) {
				cell.contentElement.addClass('rulr-widgets-matrix-table-cellcontent-selected');
			}
			else {
				cell.contentElement.removeClass('rulr-widgets-matrix-table-cellcontent-selected');
			}
		}
	}

	getSelectedValueForNumericWidget() {
		var value = this.getFunction();
		var matrixRow = value[this.selection[0]];
		return matrixRow[this.selection[1]];
	}

	setSelectedValueForNumericWidget(newValue) {
		var matrix = this.getFunction();
		matrix[this.selection[0]][this.selection[1]] = newValue;
		this.setFunction(matrix);
	}
}
