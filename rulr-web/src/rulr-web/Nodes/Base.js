import * as Utils from '../Utils.js'

class Base {
	constructor() {
		this.header = {};
		this.nodePath = [];
		this.children = [];
		this.moduleName = '';

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

	getChildByID(ID) {
		this.children.forEach((child) => {
			if(child.header.ID == ID) {
				return child;
			}
		});

		throw(`Child #${ID} not found`);
	}

	getChildByPath(nodePath) {
		if(nodePath.length == 0) {
			return this;
		}
		else {
			var child = this.getChildByID(nodePath[0]);
			return child.getChildByPath(nodePath.slice(1));
		}
	}
}

export { Base };