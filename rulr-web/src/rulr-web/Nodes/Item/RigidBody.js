import {Base} from '../Base.js'
import * as Debug from '../../Utils/Debug.js'

class Node extends Base {
	async init() {
		await super.init();
	}
}
Debug.wrapClassPrototypeMethods(Node);

export { Node };