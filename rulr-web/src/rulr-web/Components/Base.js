//Components.Base

import {AutoGroup} from '../Utils/AutoGroup.js'
import {Viewable} from '../Utils/Viewable.js'
import {ComponentCard} from '../Widgets/ComponentCard.js'

export class Base extends Viewable {
	constructor() {
		super();

		this.parameters = new AutoGroup();
		this.parameters.widget.caption = "Parameters";

		this.widget = new ComponentCard(this);
	}

	async update() {
		await super.update();
		this.parameters.update();
	}
}