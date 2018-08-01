import {Viewable} from '../Utils/Viewable.js'
import {AutoGroup} from '../Utils/AutoGroup.js'

export class Base extends Viewable {
	constructor() {
		super();

		this.header = {};
		this.parameters = new AutoGroup();
		this.components = new AutoGroup();

		this.viewportObject = new THREE.Object3D();
	}

	refresh() {
		Utils.request("/Application/Graph/GetViewDescription"
		,{
			"nodePath" : this.nodePath
		}
		, response => {
			this.header = response.nodeViewDescription.header;
		});
	}

	update() {
		this.parameters.update();
		this.components.update();
	}

	async updateViewDescriptionAsync(descriptionContent) {
		this.header = descriptionContent.header;
		if('parameters' in descriptionContent) {
			await this.parameters.updateViewDescriptionAsync(descriptionContent.parameters.content);
		}
		if('components' in descriptionContent) {
			await this.components.updateViewDescriptionAsync(descriptionContent.components.content);
		}
	}

	getChildByPath(nodePath) {
		if(nodePath.length == 0) {
			return this;
		}
		else {
			// This will throw an exception if we don't have children
			var child = this.getChildByID(nodePath[0]);
			return child.getChildByPath(nodePath.slice(1));
		}
	}
}