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
				newEntry.appendTo(listDiv);

				newEntry.find('#name').html(childNode.header.name);
				newEntry.find('#nodePath').html('#' + childNode.header.ID);
				newEntry.find('#moduleName').html(childNode.module);
				newEntry.find('#description').html("description of node");

				let toolBar = newEntry.find('#toolBar');
				toolBar.hide();

				newEntry.mouseenter(() => {
					toolBar.show();
				});
				newEntry.mouseleave(function(event) {
					toolBar.hide();
				});
			});
		}
	}
}

export { WorldExplorer };