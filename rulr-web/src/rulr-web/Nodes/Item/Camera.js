//Item.Camera
import { Base } from '../Base.js'
import * as Debug from '../../Utils/Debug.js'

class Node extends Base {
	constructor() {
		super();
	}

	async init() {
		await super.init();

		this.viewportCamera = new THREE.PerspectiveCamera();
		this.viewportCameraPreview = new THREE.CameraHelper(this.viewportCamera);
		
		this.viewportObject.add(this.viewportCameraPreview);
	}
}
Debug.wrapClassPrototypeMethods(Node);

export { Node };