import { Base } from './Base.js'
import { fromServerInstance } from '../Imports.js'

class Node extends Base {
	constructor() {
		super();
		this.children = [];
	}

	async updateData() {
		await super.updateData();

		for(var child of this.children) {
			await child.updateData();
		}
	}

	async updateView() {
		await super.updateView();

		for(var child of this.children) {
			await child.updateView();
		}
	}

	async refreshData() {
		await super.refreshData();

		// Get list of children on server side
		var serverChildIDs = await this.serverInstance.getChildIDs();

		//remove any children on client + not on server
		this.children = this.children.filter(child => serverChildIDs.includes(child.header.description.ID));

		//TODO : Add an 'isValid' method to all exported objects (to check if they are stale + check it here)
		//TODO : we could pass the server instances over to the server to check for validity

		//add any missing children
		var currentChildrenByIDs = this.getChildrenByID();
		for(let serverChildID of serverChildIDs) {
			if(!(serverChildID in currentChildrenByIDs)) {
				var serverChildInstance = await this.serverInstance.getChildByID(serverChildID);
				var newClientChildInstance = await fromServerInstance(serverChildInstance);
				this.children.push(newClientChildInstance);
			}
		}
	}

	getChildrenByID() {
		var childrenByID = {};
		this.children.forEach((child) => {
			childrenByID[child.header.description.ID] = child;
		});
		return childrenByID;
	}

	getChildByID(ID) {
		var foundChild = null;

		this.children.forEach((child) => {
			if(child.header.description.ID == ID) {
				foundChild = child;
			}
		});

		if(foundChild != null) {
			return foundChild;
		}
		else {
			throw(new Error(`Child #${ID} not found`));
		}
	}
}

export { Node };