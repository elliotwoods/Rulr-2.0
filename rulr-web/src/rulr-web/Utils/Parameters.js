import { Group } from '../Widgets/Group.js'
import { Numeric } from '../Widgets/Numeric.js'
import { Viewable } from '../Utils/Viewable.js'

export class Base extends Viewable {

}

export class Vector extends Base {
	constructor() {
		super();
		this.value = [];
		this.value.length = length;

		this.childWidgets = [];
		this.widget = new Group(() => this.childWidgets);
	}

	async updateViewDescriptionAsync(descriptionContent) {
		this.value = descriptionContent.value;

		// build any missing child widgets
		for(var i=this.childWidgets.length; i<this.value.length; i++) {
			let index = i;
			var childWidget = new Numeric(() => {
				return this.value[index];
			}, (value) => {
				this.value[index] = value
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