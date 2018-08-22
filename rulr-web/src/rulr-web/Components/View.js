//Component.View

import {Base} from './Base.js'

export class Component extends Base  {
	constructor() {
		super();		
	}

	async init() {
		await super.init();
		this.viewportCamera = new THREE.Camera();
		this.viewportHelper = new THREE.CameraHelper(this.viewportCamera);
		this.viewportObject.add(this.viewportHelper);

		this.parameters.onFirstDataReady.addListener(() => {
			this.parameters.clipped_projection_matrix.onChange.addListener(() => {
				this.needsViewportUpdate = true;
			})
		});

		this.testCamera = new THREE.PerspectiveCamera();
	}

	async viewportUpdate() {
		await super.viewportUpdate();
		this.parameters.clipped_projection_matrix.populateTHREEMatrix(this.viewportCamera.projectionMatrix);
		this.viewportHelper.update();
	}
}