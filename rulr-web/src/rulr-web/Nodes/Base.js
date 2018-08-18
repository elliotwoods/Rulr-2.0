import { Viewable } from '../Utils/Viewable.js'
import { AutoGroup } from '../Utils/AutoGroup.js'

export class Header extends Viewable {
	constructor() {
		super();
		this.description = {};
	}

	async refreshData() {
		await super.refreshData();
		this.description = await this.serverInstance.getDescription();
	}
};

export class Base extends Viewable {
	constructor() {
		super();

		this.header = new Header();
		this.parameters = new AutoGroup();
		this.components = new AutoGroup();

		// Every node has a base viewportObject. To draw to the 3D viewport, add children to this viewportObject
		this.viewportObject = new THREE.Object3D();
	}

	async updateData() {
		await super.updateData();

		await this.header.updateData();
		await this.parameters.updateData();
		await this.components.updateData();
	}

	async updateView() {
		await super.updateView();

		await this.header.updateView();
		await this.parameters.updateView();
		await this.components.updateView();
	}

	async refreshData() {
		await super.refreshData();

		this.header.serverInstance = await this.serverInstance.getHeader();
		this.parameters.serverInstance = await this.serverInstance.getParameters();
		this.components.serverInstance = await this.serverInstance.getComponents();
	}

	getChildByPath(nodePath) {
		if (nodePath.length == 0) {
			return this;
		}
		else {
			// This will throw an exception if we don't have children
			var child = this.getChildByID(nodePath[0]);
			return child.getChildByPath(nodePath.slice(1));
		}
	}
}