class WorldExplorer {
	constructor() {
		$(document).ready(function () {
			$("#placeholder-WorldExplorer").load("Interface/WorldExplorer.html", function () {

			});
		});
	}

	refresh() {
		$.ajax({
			url: "/Application/GetNodeTree"
		}).then(data => {
			if (data.success) {
				//build up a tree data structure
				var tree = populateBranch(data.content.rootNode);

				//apply to the tree view
				$('#tree-WorldExplorer').treeview({
					data: tree
				});
			}
		})
	}
}

function populateBranch(description) {
	var branch = {
		text : description.name,
		nodes : []
	};

	description.children.forEach(child => {
		nodes.push(populateBranch(child));
	});

	return branch;
}

export { WorldExplorer };