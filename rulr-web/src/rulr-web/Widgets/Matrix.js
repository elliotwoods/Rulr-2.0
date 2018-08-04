import {Base} from './Base.js'
import {Numeric} from './Numeric.js'

export class Matrix extends Base {
	constructor(getFunction, setFunction) {
		super();
		this.getFunction = getFunction;
		this.setFunction = setFunction;

		this.selection = [0, 0];
		this._table = null;

		this.numericEditor = new Numeric(() => {
			return this.getSelectedValueForNumericWidget();
		}, (newValue) => {
			this.setSelectedValueForNumericWidget(newValue);
		});
		this.numericEditorContainer = null;

		this.cellElements = [];
	}

	update() {
		super.update();
		this.numericEditor.update();

		if(this.needsCellRedraw) {
			this.redrawCells();
		}
	}

	firstDraw() {
		
	}

	draw() {
		super.draw();
		var value = this.getFunction();

		this._table = $(`<table class="table rulr-widgets-matrix-table"></table>`);
		this.content.append(this._table);

		var hrefName = `matrix_editor_${Math.floor(Math.random() * 1000001)}`;

		// draw rows
		{
			this.cellElements = [];

			for(let rowIndex in value) {
				var matrixRow = value[rowIndex];

				let tableRow = $(`<tr class="rulr-widgets-matrix-table-row"></tr>`);
				this._table.append(tableRow);

				for(let columnIndex in matrixRow) {
					let tableCell = $(`<td class="rulr-widgets-matrix-table-cell"></td>`);
					tableRow.append(tableCell);

					tableCell.width(`100%`);

					let cellContent = $(`<a href="#${hrefName}" class="rulr-widgets-matrix-table-cellcontent"></a>`);
					tableCell.append(cellContent);

					let cellIndex = [rowIndex, columnIndex];

					cellContent.click(() => {
						this.selection = cellIndex;
						this.numericEditorContainer.show();
						this.numericEditor.caption = "(" + this.selection.join(', ') + ")";
						this.numericEditor.needsRedraw = true;
						this.needsCellRedraw = true;
					});

					this.cellElements.push({
						contentElement : cellContent,
						index: [rowIndex, columnIndex]
					});
				}
			}

			this.needsCellRedraw = true;
		}

		//numeric editor
		{
			var anchor = $(`<a name="${hrefName}" />`);
			this.content.append(anchor);

			this.numericEditorContainer = $("<div></div>");
			this.numericEditorContainer.appendTo(this.content);
			this.numericEditorContainer.hide();

			var dismissButton = $(`<button class="btn btn-sm rulr-widget-matrix-numericeditor-dismiss"><i class="far fa-circle"></i></button>`);
			this.numericEditorContainer.append(dismissButton);
			dismissButton.click(() => {
				this.numericEditorContainer.hide();
				this.needsCellRedraw = true;
			});

			this.numericEditor.appendTo(this.numericEditorContainer);
		}
	}

	redrawCells() {
		try {
			var value = this.getFunction();
			for(var cell of this.cellElements) {
				var cellValue = value[cell.index[0]][cell.index[1]];
				cell.contentElement.html(cellValue);

				if(this.numericEditorContainer.css('display') != 'none' && cell.index[0] == this.selection[0] && cell.index[1] == this.selection[1]) {
					cell.contentElement.addClass('rulr-widgets-matrix-table-cellcontent-selected');
				}
				else {
					cell.contentElement.removeClass('rulr-widgets-matrix-table-cellcontent-selected');
				}
			}
			this.needsCellRedraw = false;
		}
		catch {
			// Maybe the matrix shape changed
			this.needsRedraw = true;
		}
	}

	getSelectedValueForNumericWidget() {
		try {
			var value = this.getFunction();
			var matrixRow = value[this.selection[0]];
			return matrixRow[this.selection[1]];
		}
		catch {
			// Maybe the matrix shape changed
			this.numericEditorContainer.hide();
			this.needsRedraw = true;
		}
	}

	setSelectedValueForNumericWidget(newValue) {
		try {
			var matrix = this.getFunction();
			matrix[this.selection[0]][this.selection[1]] = newValue;
			this.setFunction(matrix);
		}
		catch {
			// Maybe the matrix shape changed
			this.numericEditorContainer.hide();
			this.needsRedraw = true;
		}
		this.needsCellRedraw = true;
	}
}
