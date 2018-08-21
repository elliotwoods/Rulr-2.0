import {Base} from '../Base.js'

class Node extends Base {
	async init() {
		await super.init();
		
		this.minor = new THREE.GridHelper(40.0, 400 / 2, 0xeeeeee, 0xeeeeee);
		this.viewportObject.add(this.minor);
	}
}

export { Node };