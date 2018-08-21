//Item.Camera
import { Base } from '../Base.js'
//import * as THREE from '../../../../node_modules/three/src/Three.js';

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

export { Node };