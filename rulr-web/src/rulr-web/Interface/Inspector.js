import { Element } from './Element.js'
import { application } from '../Application.js'
import { Group } from '../Widgets/Group.js'
import { Notice } from '../Widgets/Notice.js'

class Inspector extends Element {
	constructor() {
		super();
		this.childWidgets = [];
		this.group = new Group(() => this.childWidgets);
		this.whenReady(() => {
			var listDiv = $("#Inspector-list");
			this.group.appendTo(listDiv);
		});
	}

	refresh() {
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

			// // Components
			// {
			// 	var keys = Object.keys(nodeSelection.components.children);
			// 	keys.forEach(key => {
			// 		listDiv.append($(`<div class="card">
			// 			<div class="card-header">${key}</div>
			// 			<div clas="card-body">
			// 				<h4 class="card-title">Component title</h4>
			// 				<p class="card-text">Body of the component.</p>
			// 			</div>
			// 		</div>`));
			// 	});
			// }

			this.childWidgets.push(nodeSelection.parameters.widget);
			this.group.needsRedraw = true;
		}
	}

	update() {
		this.group.update();
	}
}

export { Inspector };