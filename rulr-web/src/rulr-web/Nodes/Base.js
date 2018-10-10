import { Viewable } from '../Utils/Viewable.js'
import { AutoGroup } from '../Utils/AutoGroup.js'
import * as Debug from '../Utils/Debug.js'
import { showException } from '../Utils.js'


export class Header extends Viewable {
	constructor() {
		super();
		this.description = {};
	}

	async pullData() {
		await super.pullData();
		this.description = await this.serverInstance.get_description();
	}
};

export class Base extends Viewable {
	constructor() {
		super();

		// Every node has a base viewportObject. To draw to the 3D viewport, add children to this viewportObject
		this.viewportObject = new THREE.Object3D();

		// These are created during init
		this.header = null;
		this.parameters = null;
		this.components = null;
	}

	async init() {
		await super.init();

		// TODO : this is a semi-manual way of importing objects - look into using fromServerInstance function in future to avoid any issues
		this.header = new Header();
		this.header.serverInstance = await this.serverInstance.header.get();

		this.parameters = new AutoGroup();
		this.parameters.serverInstance = await this.serverInstance.parameters.get();

		this.components = new AutoGroup();
		this.components.serverInstance = await this.serverInstance.components.get();
		this.components.onFirstDataReady.addListener(() => {
			console.log(this.components.children);
			for(let [name, component] of Object.entries(this.components.children)) {
				this.viewportObject.add(component.viewportObject);
			}
		});

		this.actions = {};

		let actionsGroup = await this.serverInstance.actions.get();
		let actionNames = await actionsGroup.get_child_functions();

		for (let actionName of actionNames) {
			let action = actionsGroup[actionName];
			this.actions[actionName] = () => {
				let asyncAction = async () => {
					try {
						await action();
					}
					catch(exception) {
						showException(exception);
					}
				};
				asyncAction().then(() => {
					this.needsGuiUpdate = true;
					this.needsViewportUpdate = true;
				});
			};
		}
	}

	async updateData() {
		await this.header.updateData();
		await this.parameters.updateData();
		await this.components.updateData();

		// First update often relies on the content of the parameter and component groups
		// Since group members can change at runtime, this means that the members should be fetched per update loop
		await super.updateData();
	}

	async updateView() {
		await super.updateView();

		await this.header.updateView();
		await this.parameters.updateView();
		await this.components.updateView();
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

	getName() {
		//Currently this is only used by the graph debugger
		return this.header.description.name;
	}
}

Debug.wrapClassPrototypeMethods(Base);
