import * as Utils from '../Utils.js'
import { Element } from './Element.js'
import { application } from '../Application.js'

var toolbarItems = [
	{
		title : "Load project",
		icon : 'far fa-folder-open',
		action : () => {
			application.onNextUpdate.push(() => {
				application.showLoadDialog();
			});
		}
	},
	{
		title : "Debug call tree",
		icon : 'fas fa-stethoscope',
		action : () => {
			application.onNextUpdate.push(() => {
				application.debugCallTree();
			});
		}
	}
];

class Toolbar extends Element {
	constructor() {
		super();
		this.whenReady(() => {
			var toolbarDom = $("#toolbar");

			for(let toolbarItem of toolbarItems) {
				var toolbarButton = $(`<button class="btn btn-outline-secondary btn-sm toolbarItem" data-toggle="tooltip" data-placement="bottom" title=${toolbarItem.title}"><i class="${toolbarItem.icon}"></i></button>`);
				toolbarDom.append(toolbarButton);
				toolbarButton.click(toolbarItem.action);
			}

			$('[data-toggle="tooltip"]').tooltip();
		});
	}

	async refresh() {

	}
}

export { Toolbar };