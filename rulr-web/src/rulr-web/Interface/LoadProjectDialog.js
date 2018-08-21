import { pyCall } from '../Imports.js'
import { showException } from '../Utils.js'
import { application } from '../Application.js'
import { Element } from './Element.js'

class LoadProjectDialog extends Element {
	constructor() {
		super();
	}

	show() {
		$('#loadModal').modal({});
		this.refresh('.');
	}

	async refresh(folderPath) {
		await super.refresh();
		
		var projectList = await application.serverInstance.list_projects(folderPath);
		
		// breadcrumbs
		{
			var breadcrumbsDiv = $("#loadDialog-breadcrumb");
			breadcrumbsDiv.empty();

			var pathArray = projectList.selectedPath.split("/");

			//filter empties
			pathArray = pathArray.filter(function (pathEntry) {
				if (pathEntry == "") {
					return false;
				}
				if (pathEntry == ".") {
					return false;
				}

				return true;
			})

			//add a home entry
			pathArray.splice(0, 0, '');

			var bottomLevelFolder = pathArray[pathArray.length - 1];

			pathArray.forEach((pathEntry, index) => {
				var name = pathEntry;
				if (index == 0) {
					name = '<i class="fas fa-home"></i>'; // home icon
				}

				var newEntry = $(`<li />`, {
					class: 'breadcrumb-item'
				});
				newEntry.appendTo(breadcrumbsDiv);

				var isLastEntry = index == pathArray.length - 1;
				if (!isLastEntry) {
					var link = $("<a />", {
						html: name,
						href: '#'
					});
					link.appendTo(newEntry);
					link.click(() => {
						// go to the relevant path
						var targetPathArray = pathArray.slice(0, index + 1);
						var targetPath = targetPathArray.join("/");
						this.refresh(targetPath);
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
			projectList.subFolders.forEach(item => {
				var newEntry = $(`<a href="#" class="list-group-item list-group-item-action">
					<i class="fas fa-folder-open"></i>&nbsp; ${item.name}
				</a>`);
				newEntry.appendTo(contentDiv);
				newEntry.click(() => {
					this.refresh(item.path)
				});
			});

			// list projects
			projectList.projects.forEach(item => {
				var newEntry = $(`<a href="#" class="list-group-item list-group-item-action">
					<i class="fas fa-file"></i>&nbsp; ${item.name}
				</a>`);
				newEntry.appendTo(contentDiv);
				newEntry.click(() => {
					this.loadProject(item.path)
				});
			});
		}
	}

	async loadProject(projectFolderPath) {
		try {
			await application.serverInstance.load_project(projectFolderPath);
			$('#loadModal').modal('hide');
			await application.refresh();
		}
		catch(exception) {
			showException(exception);
		}
	}
}

export { LoadProjectDialog };