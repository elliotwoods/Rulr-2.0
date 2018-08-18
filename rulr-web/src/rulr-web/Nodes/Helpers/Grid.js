import {Base} from '../Base.js'

class Node extends Base {
	constructor() {
		super();

		this.minor = new THREE.GridHelper(40.0, 400 / 2, 0xeeeeee, 0xeeeeee);
		this.viewportObject.add(this.minor);
	}
}

export { Node };