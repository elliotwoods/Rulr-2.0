//Item.Camera
import { Base } from '../Base.js'
//import * as THREE from '../../../../node_modules/three/src/Three.js';

class Node extends Base {
	constructor() {
		super();

		this.viewportCamera = new THREE.PerspectiveCamera();
		this.viewportCameraPreview = new THREE.CameraHelper(this.viewportCamera);
		
		this.viewportObject.add(this.viewportCameraPreview);
	}

	update() {
		super.update();
	}
}

export { Node };