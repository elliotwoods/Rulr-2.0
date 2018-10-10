import { Element } from './Element.js'
import { application } from '../Application.js'
import { Group } from '../Widgets/Group.js'
import { Notice } from '../Widgets/Notice.js'
import { Button } from '../Widgets/Button.js'

class Inspector extends Element {
	constructor() {
		super();
		this.childWidgets = [];
		this.groupWidget = new Group(() => this.childWidgets);
		this.groupWidget.showDefaultTitle = false;
		this.whenReady(() => {
			var listDiv = $("#Inspector-list");
			this.groupWidget.appendTo(listDiv);
		});
	}

	async update() {
		await super.update();
		await this.groupWidget.update();
	}

	async refresh() {
		await super.refresh();
		
		this.childWidgets = [];

		var nodeSelection = application.getSelection();
		if(nodeSelection == null) {
			// No selection
			this.childWidgets.push(new Notice(`No nodes selected.`));
		}
		else if(Array.isArray(nodeSelection)) {
			// Multiple nodes are selected
			this.childWidgets.push(new Notice(`${nodeSelection.length} nodes selected.`));
		}
		else {
			// Single node is selected
			nodeSelection.components.widget.caption = "Components";
			nodeSelection.parameters.widget.caption = "Parameters";
			
			this.childWidgets.push(nodeSelection.components.widget);
			this.childWidgets.push(nodeSelection.parameters.widget);
			
			for(let [actionName, action] of Object.entries(nodeSelection.actions)) {
				this.childWidgets.push(new Button(actionName, action));
			}

			this.groupWidget.caption = nodeSelection.header.name
			this.groupWidget.needsRedraw = true;
		}
	}
}

export { Inspector };