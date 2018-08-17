import { Viewable } from '../Utils/Viewable.js'
import { AutoGroup } from '../Utils/AutoGroup.js'

export class Header extends Viewable {
	constructor() {
		super();
		this.description = {};
	}

	async refresh() {
		await super.refresh();
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

	async update() {
		await super.update();

		await this.header.update();
		await this.parameters.update();
		await this.components.update();
	}

	async refresh() {
		await super.refresh();

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