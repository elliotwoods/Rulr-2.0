import { Base } from './Base.js'
import * as Utils from '../Utils.js'

class Node extends Base {
	constructor() {
		super();
		this.children = [];
	}

	update() {
		super.update();
		for(var child of this.children) {
			child.update();
		}
	}

	getChildrenByID() {
		var childrenByID = {};
		this.children.forEach((child) => {
			childrenByID[child.header.ID] = child;
		});
		return childrenByID;
	}

	getChildByID(ID) {
		var foundChild = null;

		this.children.forEach((child) => {
			if(child.header.ID == ID) {
				foundChild = child;
			}
		});

		if(foundChild != null) {
			return foundChild;
		}
		else {
			throw(`Child #${ID} not found`);
		}
	}

	async updateViewDescriptionAsync(descriptionContent) {
		await super.updateViewDescriptionAsync(descriptionContent);

		// Children
		{
			var childrenByID = this.getChildrenByID();
			var validChildren = [];

			// Iterate through received children
			await Utils.asyncForEach(descriptionContent.children, async (childDescription) => {
				if(childDescription.content.header.ID in childrenByID) {
					// We have this child already

					var child = childrenByID[childDescription.content.header.ID];

					// Check if our child has the correct module
					if(childDescription.module == child.module && childDescription.class == child.class) {
						// Then just update it
						await child.updateViewDescriptionAsync(childDescription.content);
					}
					else {
						// Remove invalid child
						this.children = this.children.filter(item => item !== child);

						// New node has same ID but different module type - need a full replacement
						child = await Utils.fromViewDescriptionAsync(childDescription);

						// And push the new child in
						this.children.push(child);						
					}
				}
				else {
					// We do not have this child already
					var childNodeInstance = await Utils.fromViewDescriptionAsync(childDescription);
					this.children.push(childNodeInstance);
				}

				// Store the IDs of valid children
				validChildren.push(childDescription.content.header.ID);
			});

			// Filter out children which didn't show up in the deserialised set
			this.children = this.children.filter(child => validChildren.includes(child.header.ID));
			this.children.length;
		}
	}
}

export { Node };