import * as $ from "jquery"

export class LoadDialog {
	constructor() {
		alert('constructor');
	}

	show() {

	}

	refresh(folderPath : string) {

	}
}

/*

function showLoadDialog() {
	refreshLoadDialog('.');
	$('#loadModal').modal({});
}
export { showLoadDialog };

function refreshLoadDialog(folderPath) {
	$.ajax({
		url: "/Application/ListProjects",
		data: {
			folderPath : folderPath
		}
	}).then(function(data) {
		if(data.success) {

			// breadcrumbs
			{}
				var breadcrumbsDiv = $("#loadDialog-breadcrumb");
				breadcrumbsDiv.empty();

				var pathArray = data.content.selectedPath.split("/");
				
				//filter empties
				pathArray = pathArray.filter(function(pathEntry) {
					if(pathEntry == "") {
						return false;
					}
					if(pathEntry == ".") {
						return false;
					}
					
					return true;
				})

				//add a home entry
				pathArray.splice(0, 0, '');

				var bottomLevelFolder = pathArray[pathArray.length - 1];

				pathArray.forEach(function(pathEntry, index) {
					var name = pathEntry;
					if(index == 0) {
						name = '<i class="fas fa-home"></i>'; // home icon
					}

					var newEntry = $(`<li />`, {
						class : 'breadcrumb-item'
					});
					newEntry.appendTo(breadcrumbsDiv);

					var isLastEntry = index == pathArray.length - 1;
					if(!isLastEntry) {
						var link = $("<a />", {
							html : name,
							href: '#'
						});
						link.appendTo(newEntry);
						link.click(function() {
							// go to the relevant path
							var targetPathArray = pathArray.slice(0, index + 1);
							var targetPath = targetPathArray.join("/");
							refreshLoadDialog(targetPath);
						});
					}
					else {
						//for the last one just put some text
						newEntry.html(name);
					}
				});
		}

		// list
		{
			var contentDiv = $("#loadDialog-content");
			contentDiv.empty();

			// list subfolders
			data.content.subFolders.forEach(function(item) {
				var newEntry = $(`<a href="#" class="list-group-item list-group-item-action">
					<i class="fas fa-folder-open"></i>&nbsp; ${item.name}
				</a>`);
				newEntry.appendTo(contentDiv);
				newEntry.click(function() {
					refreshLoadDialog(item.path)
				});
			});

			// list projects
			data.content.projects.forEach(function(item) {
				var newEntry = $(`<a href="#" class="list-group-item list-group-item-action">
					<i class="fas fa-file"></i>&nbsp; ${item.name}
				</a>`);
				newEntry.appendTo(contentDiv);
				newEntry.click(function() {
					loadProject(item.path)
				});
			});
		}
	});
}

function loadProject(projectFolderPath) {
	$.ajax({
		url: "/Application/LoadProject",
		data: {
			projectFolderPath : projectFolderPath
		}
	}).then(function(data) {
		$('#loadModal').modal('hide');
	});
}*/