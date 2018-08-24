//Component.RigidBody

import { Base } from './Base.js'

export class Component extends Base {
	async init() {
		await super.init();

		this.parameters.onFirstDataReady.addListener(() => {
			this.parameters.transform.onChange.addListener(() => {
				this.needsViewportUpdate = true;
			});
		});

		this.axesPreview = new THREE.AxesHelper(0.2);
		this.viewportObject.matrixAutoUpdate = false;
		this.viewportObject.add(this.axesPreview);
	}

	async viewportUpdate() {
		await super.viewportUpdate();
		
		this.parameters.transform.populateTHREEMatrix(this.viewportObject.matrix);
	}
}