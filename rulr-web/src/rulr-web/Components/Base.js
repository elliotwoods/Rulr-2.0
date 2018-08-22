//Components.Base

import { AutoGroup } from '../Utils/AutoGroup.js'
import { Viewable } from '../Utils/Viewable.js'
import { fromServerInstance } from '../Imports.js'
import { ComponentCard } from '../Widgets/ComponentCard.js'
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
	}

	async updateData() {
		await super.updateData();
		await this.parameters.updateData();
	}

	async updateView() {
		await super.updateView();
		await this.parameters.updateView();
	}
}