import * as Utils from '../../Utils.js'

class WorldExplorer {
	constructor() {
		$(document).ready(function () {
			$("#WorldExplorer-placeholder").load("Interface/WorldExplorer.html", function () {

			});
		});

		self.nodePath = [];
	}

	refresh() {
		Utils.request("/Application/Graph/GetNodeList"
		, {
			nodePath : self.nodePath
		}, responseContent => {
			var listDiv = $("#WorldExplorer-list");
			listDiv.empty();

			var nodeItemTemplate = $("#WorldExplorer-NodeTemplate");

			responseContent.forEach(child => {
				var newEntry = $(nodeItemTemplate.first().html());
				newEntry.find('#name').text(child.name);
				newEntry.find('#footer').text('#' + str(child.ID));
				newEntry.find('#module').text(child.moduleName);
				newEntry.find('#description').text("description of node");

				newEntry.appendTo(listDiv);
			});
		})
	}
}

export { WorldExplorer };