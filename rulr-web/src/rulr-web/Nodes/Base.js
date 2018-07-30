import * as Utils from '../Utils.js'

class Base {
	constructor() {
		this.header = {};
		this.nodePath = [];
		this.children = [];
	}

	refresh() {
		Utils.request("/Application/Graph/GetViewDescription"
		,{
			"nodePath" : this.nodePath
		}
		, response => {
			this.header = response.nodeViewDescription.header;
		});
	}

	refresh(description) {
		Utils.request("/")
	}
}

export { Base };