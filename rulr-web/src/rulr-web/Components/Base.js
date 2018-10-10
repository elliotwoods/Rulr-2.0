//Components.Base

import { AutoGroup } from '../Utils/AutoGroup.js'
import { Viewable } from '../Utils/Viewable.js'
import { fromServerInstance } from '../Imports.js'
import { ComponentCard } from '../Widgets/ComponentCard.js'
import * as Debug from '../Utils/Debug.js'

export class Base extends Viewable {
	constructor() {
		super();

		this.parameters = null;

		this.widget = new ComponentCard(this);
		this.viewportObject = new THREE.Object3D();
	}

	async init() {
		await super.init();
		var parametersServerInstance = await this.serverInstance.parameters.get();
		this.parameters = await fromServerInstance(parametersServerInstance);
		this.parameters.widget.caption = "Parameters";

		this.actions = {};

		let actionsGroup = await this.serverInstance.actions.get();
		let actionNames = await actionsGroup.get_child_functions();

		for (let actionName of actionNames) {
			let action = actionsGroup[actionName];
			this.actions[actionName] = () => {
				action().then(() => {
					this.needsGuiUpdate = true;
					this.needsViewportUpdate = true;
				});
			};
		}
	}

	async updateData() {
		Debug.enter(this);

		await super.updateData();
		await this.parameters.updateData();

		Debug.leave();
	}

	async updateView() {
		await super.updateView();
		await this.parameters.updateView();
	}

	getName() {
		//Currently this is only used by the graph debugger
		return this.widget.caption;
	}
}