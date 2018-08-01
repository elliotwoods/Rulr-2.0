import {Viewable} from './Viewable.js'
import * as Utils from '../Utils.js'
import {Group} from '../Widgets/Group.js'

export class AutoGroup extends Viewable {
	constructor() {
		super();
		
		this.children = new Object();
		this.childWidgets = [];

		// Create the widget
		this.widget = new Group(() => this.childWidgets);

		// The widget will watch for changes in this Viewable, and redraw whenever we announce a change
		this.widget.watchViewables.push(this);
	}

	async updateViewDescriptionAsync(descriptionContent) {
		var childrenByName = Object.keys(this.children);
		var changeMade = false;

		// Update and create children in the new description
		for(var key in descriptionContent) {
			var childDescription = descriptionContent[key];

			if(key in childrenByName) {
				//we have this child already
				var child = this.children[key];

				// Check if our child has the correct module
				if(childDescription.module == child.module && childDescription.class == child.class) {
					// Then just update it
					await child.updateViewDescriptionAsync(childDescription.content);
				}
				else {
					// create a replacement
					child = await Utils.fromViewDescriptionAsync(childDescription);

					// And push the new child in place of the old one
					this.children[key] = child;

					changeMade = true;
				}
			}
			else {
				// create a new child to match description
				var child = await Utils.fromViewDescriptionAsync(childDescription);

				// And push the new child in place of the old one
				this.children[key] = child;	

				changeMade = true;
			}
		}

		// Remove any children which are not in the new description
		var childrenToRemove = childrenByName.filter(childKey => !childKey in descriptionContent);
		childrenToRemove.forEach(key => {
			delete this.children[key];
			changeMade = true;
		});

		if(changeMade) {
			this.newDataForNextFrame = true;
		}
	}

	getChildKeys() {
		var childKeys = Object.keys(this.children);
		return childKeys.filter(childKey => {
			var child = this.children[childKey]
			return child instanceof Viewable;
		});
	}

	update() {
		super.update();

		var childKeys = this.getChildKeys();

		// update all child Viewables
		{
			for(var childKey of childKeys) {
				this.children[childKey].update();
			}
		}

		// rebuild child widgets
		if(this.isFrameNew) {
			this.childWidgets = [];
			for(var childKey of childKeys) {
				var child = this.children[childKey];
				if('widget' in child) {
					child.widget.caption = childKey;
					child.widget.needsRedraw = true;
					this.childWidgets.push(child.widget);
				}
			}
			this.widget.needsRedraw = true;
		}
	}
}