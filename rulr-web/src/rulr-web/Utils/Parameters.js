import { Group } from '../Widgets/Group.js'
import { Numeric } from '../Widgets/Numeric.js'
import * as MatrixWidget from '../Widgets/Matrix.js'
import * as ImageWidget from '../Widgets/Image.js'
import * as ToggleWidget from '../Widgets/Toggle.js'

import { Viewable } from './Viewable.js'
import { LiquidEvent } from './LiquidEvent.js'
import * as Debug from './Debug.js'

export class Base extends Viewable {
	constructor() {
		super();
		this.value = null;
	}

	async pullData() {
		await super.pullData();
		this.value = await this.serverInstance.get_client_formatted();
	}

	async pushData() {
		await super.pushData();
		if('set' in this.serverInstance) {
			await this.serverInstance.set(this.value);
		}
	}
}

export class Float extends Base {
	constructor() {
		super();
		this.value = 0.0;

		this.widget = new Numeric(() => {
			return this.value;
		}, (value) => {
			this.value = value;
			this.commit();
		});
	}
}

export class Vector extends Base {
	constructor() {
		super();
		this.value = [];

		this.childWidgets = [];
		this.widget = new Group(() => {
			return this.childWidgets;
		});
	}

	async guiUpdate() {
		await super.guiUpdate();

		// build any missing child widgets
		for(var i=this.childWidgets.length; i<this.value.length; i++) {
			let index = i;
			var childWidget = new Numeric(() => {
				return this.value[index];
			}, (value) => {
				this.value[index] = value
				this.commit();	
			});
			childWidget.caption = i.toString();
			childWidget.needsRedraw = true;
			this.childWidgets.push(childWidget);
		}

		// remove any excess child widgets
		if(this.childWidgets.length > this.value.length) {
			this.childWidgets.length = this.value.length;
		}
	}
}

export class BoundVector extends Vector {
	constructor() {
		super();

		this.lowerLimit = 0.0;
		this.upperLimit = 0.0;
		this.step = 0.0;
	}
}

function flatten(arr) {
	return arr.reduce(function (flat, toFlatten) {
		return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
	}, []);
}

export class Matrix extends Base {
	constructor() {
		super();

		this.value = [];
		this.widget = new MatrixWidget.Matrix(() => {
			return this.value;
		}, (newValue) => {
			this.value = newValue;
			this.commit();
		});

		this.onChange.addListener(() => {
			this.widget.needsRedraw = true;
		})
	}

	getValueFlat() {
		return flatten(this.value);
	}

	populateTHREEMatrix(threeMatrix) {
		threeMatrix.fromArray(this.getValueFlat());
		threeMatrix.transpose();
	}
}

export class Image extends Base {
	constructor() {
		super();

		this.widget = new ImageWidget.Widget(() => {
			return this.value;
		});

		this.onChange.addListener(() => {
			this.widget.needsRedraw = true;
		})
	}

	async updateData() {
		//HACK : do nothing - supress super.update()
		await super.updateData();
	}

	getName() {
		//Currently this is only used by the graph debugger
		return this.widget.caption;
	}
}

export class Bool extends Base {
	constructor() {
		super();

		this.widget = new ToggleWidget.Widget(() => {
			return this.value;
		}, (newValue) => {
			this.value = newValue;
			this.commit();
		})

		this.onChange.addListener(() => {
			this.widget.needsRedraw = true;
		})
	}
}

Debug.wrapClassPrototypeMethods(Base);
Debug.wrapClassPrototypeMethods(Float);
Debug.wrapClassPrototypeMethods(Vector);
Debug.wrapClassPrototypeMethods(Matrix);
Debug.wrapClassPrototypeMethods(Image);
