import {Base} from '../Base.js'
import * as Debug from '../../Utils/Debug.js'

class Node extends Base {
	async init() {
		await super.init();
		
		this.minor = new THREE.GridHelper(40.0, 400 / 2, 0xeeeeee, 0xeeeeee);
		this.viewportObject.add(this.minor);
	}
}
Debug.wrapClassPrototypeMethods(Node);

export { Node };