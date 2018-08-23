import { Base } from '../Base.js'
import * as Debug from '../../Utils/Debug.js'

class Node extends Base {
	constructor() {
		super();
	}

	async init() {
		await super.init();

		this.components.onFirstDataReady.addListener(() => {
			var updateViewportCallback = () => {
				this.needsViewportUpdate = true;
			};

			//Add the rigid_body's viewportObject to ours (which will be rendered)
			this.viewportObject.add(this.components.rigid_body.viewportObject);

			//From now on, everything is added under this object
			this.components.rigid_body.viewportObject.add(this.components.view.viewportObject)

			this.components.rigid_body.parameters.onFirstDataReady.addListener(() => {
				this.components.rigid_body.parameters.children.transform.onChange.addListener(updateViewportCallback);
			});
			this.components.view.parameters.onFirstDataReady.addListener(() => {
				this.components.view.parameters.camera_matrix.onChange.addListener(updateViewportCallback);
			});
		});

		this.parameters.onFirstDataReady.addListener(() => {			
			// Update the texture when the image is reloaded inside the widget
			this.parameters.image.widget.onLoadImage.addListener(() => {
				this.previewImageTexture.image = this.parameters.image.widget.getImage();
				this.previewImageTexture.needsUpdate = true;
			});
		});

		this.previewImageTexture = new THREE.Texture();
		this.previewImageMatrial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: this.previewImageTexture, side: THREE.DoubleSide});
		this.previewImageGeometry = new THREE.PlaneBufferGeometry(2.0, 2.0,);
		this.previewImage = new THREE.Mesh(this.previewImageGeometry, this.previewImageMatrial);
		this.viewportObject.add(this.previewImage);
		this.previewImage.matrixAutoUpdate = false;

		this.updateViewportCountdown = 1;
	}

	async updateData() {
		await super.updateData();
	}

	async viewportUpdate() {
		await super.viewportUpdate();

		var projectionInverse = new THREE.Matrix4();
		projectionInverse.getInverse(this.components.view.viewportCamera.projectionMatrix);

		var viewInverse = new THREE.Matrix4();
		viewInverse.copy(this.components.rigid_body.viewportObject.matrix);

		var viewProjectionInverse = new THREE.Matrix4();
		viewProjectionInverse.multiply(viewInverse);
		viewProjectionInverse.multiply(projectionInverse);

		this.previewImage.matrix.copy(viewProjectionInverse);
	}
}
Debug.wrapClassPrototypeMethods(Node);

export { Node };