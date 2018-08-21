import * as Utils from '../Utils.js'
import { Element } from './Element.js'
import { application } from '../Application.js'

class WorldExplorer extends Element {
	constructor() {
		super();
	}

	async refresh() {
		var listDiv = $("#WorldExplorer-list");
		listDiv.empty();

		var nodeItemTemplateHTML = $("#WorldExplorer-NodeTemplate").first().html();

		if(application.rootNode != null) {
			var currentGroupNode = application.rootNode.getChildByPath(application.explorerNodePath);

			currentGroupNode.children.forEach(childNode => {
				var newEntry = $(nodeItemTemplateHTML);
				newEntry.appendTo(listDiv);

				newEntry.find('#name').html(childNode.header.description.name);
				newEntry.find('#nodePath').html('#' + childNode.header.description.ID);
				newEntry.find('#moduleName').html(childNode.module);
				newEntry.find('#description').html("description of node");

				let toolBar = newEntry.find('#toolBar');
				toolBar.hide();

				newEntry.mouseenter(() => {
					toolBar.show();
				});
				newEntry.mouseleave((event) => {
					toolBar.hide();
				});
				newEntry.click(() => {
					application.selectNode(childNode);
				});
			});
		}
	}
}

export { WorldExplorer };