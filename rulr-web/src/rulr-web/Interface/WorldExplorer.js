import * as Utils from '../Utils.js'
import { Element } from './Element.js'

class WorldExplorer extends Element {
	constructor() {
		super();
		this.nodePath = [];
	}

	refresh() {
		Utils.request("/Application/Graph/GetNodeList"
		, {
			nodePath : this.nodePath
		}, responseContent => {
			var listDiv = $("#WorldExplorer-list");
			listDiv.empty();

			var nodeItemTemplate = $("#WorldExplorer-NodeTemplate");

			responseContent.forEach(child => {
				var newEntry = $(nodeItemTemplate.first().html());
				newEntry.find('#name').text(child.name);
				newEntry.find('#footer').text('#' + child.ID);
				newEntry.find('#module').text(child.moduleName);
				newEntry.find('#description').text("description of node");

				newEntry.appendTo(listDiv);
			});
		})
	}
}

export { WorldExplorer };