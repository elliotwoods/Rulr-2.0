import * as Utils from '../Utils.js'
import { Element } from './Element.js'
import { application } from '../Application.js'

class WorldExplorer extends Element {
	constructor() {
		super();
	}

	refresh() {
		var listDiv = $("#WorldExplorer-list");
		listDiv.empty();

		var nodeItemTemplateHTML = $("#WorldExplorer-NodeTemplate").first().html();

		if(application.rootNode != null) {
			var currentGroupNode = application.rootNode.getChildByPath(application.explorerNodePath);

			currentGroupNode.children.forEach(childNode => {
				var newEntry = $(nodeItemTemplateHTML);
				newEntry.find('#name').text(childNode.header.name);
				newEntry.find('#footer').text('#' + childNode.header.ID);
				newEntry.find('#module').text(childNode.moduleName);
				newEntry.find('#description').text("description of node");

				newEntry.appendTo(listDiv);
			});
		}
	}
}

export { WorldExplorer };