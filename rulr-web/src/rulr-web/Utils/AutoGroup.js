import { Viewable } from './Viewable.js'
import { fromServerInstance } from '../Imports.js'
import { Group } from '../Widgets/Group.js'

export class AutoGroup extends Viewable {
	constructor() {
		super();

		this.children = new Object();
		this.childWidgets = [];

		// Create the widget
		this.widget = new Group(() => this.childWidgets);

		// The widget will watch for changes in this Viewable, and redraw whenever we announce a change
		this.widget.watchViewables.push(this);
	}

	getChildKeys() {
		var childKeys = Object.keys(this.children);
		return childKeys.filter(childKey => {
			var child = this.children[childKey]
			return child instanceof Viewable;
		});
	}

	async updateData() {
		await super.updateData();

		let childKeys = this.getChildKeys();
		// update all child Viewables
		for (let childKey of childKeys) {
			await this.children[childKey].updateData();
		}
	}

	async updateView() {
		await super.updateView();

		let childKeys = this.getChildKeys();
		// update all child Viewables
		for (let childKey of childKeys) {
			await this.children[childKey].updateView();
		}
	}

	async refreshData() {
		await super.refreshData();

		var childNames = Object.keys(this.children);

		var serverChildNames = await this.serverInstance.getChildNames();

		//Remove invalidated children
		//TODO : more resilient way to check for object consistency (e.g. object_id)
		for (let childName of childNames) {
			if (!(childName in serverChildNames)) {
				delete this.children[childName];
			}
		}

		//Add any missing children
		for (let serverChildName of serverChildNames) {
			if (!(serverChildName in Object.keys(this.children))) {
				var childServerInstance = await this.serverInstance.getChildByName(serverChildName);
				var child = await fromServerInstance(childServerInstance);
				this.children[serverChildName] = child;
			}
		}
	}

	async guiUpdate() {
		this.childWidgets = [];
		let childKeys = this.getChildKeys();
		for (let childKey of childKeys) {
			let child = this.children[childKey];
			if ('widget' in child) {
				child.widget.caption = childKey;
				child.widget.needsRedraw = true;
				this.childWidgets.push(child.widget);
			}
		}
		this.widget.needsRedraw = true;
	}
}