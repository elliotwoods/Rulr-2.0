import { Base } from '../Base.js'
import * as Debug from '../../Utils/Debug.js'
import { application } from '../../Application.js'

class Node extends Base {
	async init() {
		await super.init();

		var updateViewportCallback = () => {
			this.needsViewportUpdate = true;
			this.needsViewportFrameCountdown = 2;
		};
		
		this.components.onFirstDataReady.addListener(() => {
			this.components.rigid_body.transformedObject.add(this.viewFlippedFromCamera);

			// Add the view's viewportObject under the rigid_body's transformed object
			this.components.rigid_body.transformedObject.add(this.components.view.transformed_object)

			this.components.rigid_body.parameters.onFirstDataReady.addListener(() => {
				this.components.rigid_body.parameters.children.transform.onChange.addListener(updateViewportCallback);
			});
			this.components.view.parameters.onFirstDataReady.addListener(() => {
				this.components.view.parameters.clipped_projection_matrix.onChange.addListener(updateViewportCallback);
			});
		});

		this.parameters.onFirstDataReady.addListener(() => {			
			// Update the texture when the image is reloaded inside the widget
			this.parameters.image.widget.onLoadImage.addListener(() => {
				this.previewImageTexture.image = this.parameters.image.widget.getImage();
				this.previewImageTexture.needsUpdate = true;
			});

			this.parameters.board_transform.onChange.addListener(updateViewportCallback);
		});

		this.previewImageTexture = new THREE.Texture();
		this.previewImageMatrial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: this.previewImageTexture, side: THREE.DoubleSide});
		this.previewImageGeometry = new THREE.PlaneBufferGeometry(2.0, 2.0,);
		this.previewImage = new THREE.Mesh(this.previewImageGeometry, this.previewImageMatrial);
		this.viewportObject.add(this.previewImage);
		this.previewImage.matrixAutoUpdate = false;

		this.viewFlippedFromCamera = new THREE.Object3D();
		this.viewFlippedFromCamera.rotateX(Math.PI);
		{
			this.boardPreviewObject = new THREE.AxesHelper(200.2);
			this.boardPreviewObject.matrixAutoUpdate = false;
			this.viewFlippedFromCamera.add(this.boardPreviewObject)

			{
				var geometry = new THREE.PlaneGeometry(0.03 * 11, 0.03 * 8, 3, 3);
				var material = new THREE.MeshBasicMaterial({
					color: 0x000000,
					wireframe: true,
					side: THREE.DoubleSide
				});
				var plane = new THREE.Mesh(geometry, material);
				this.boardPreviewObject.add(plane);
			}
		}

		//weird hack for incoming frames
		this.needsViewportFrameCountdown = 0;
	}

	async updateData() {
		await super.updateData();

		this.needsViewportFrameCountdown--;
		if(this.needsViewportFrameCountdown == 0) {
			this.needsViewportUpdate = true;
		}
	}

	async viewportUpdate() {
		await super.viewportUpdate();

		// need matrices from here first
		this.components.rigid_body.viewportUpdate();
		this.components.view.viewportUpdate();

		var projectionInverse = new THREE.Matrix4();
		projectionInverse.getInverse(this.components.view.viewportCamera.projectionMatrix);

		var viewInverse = new THREE.Matrix4();
		viewInverse.copy(this.components.rigid_body.transformedObject.matrix);

		var viewProjectionInverse = new THREE.Matrix4();
		viewProjectionInverse.multiply(viewInverse);
		viewProjectionInverse.multiply(projectionInverse);

		this.previewImage.matrix.copy(viewProjectionInverse);
		this.previewImage.updateMatrixWorld();

		//set the camera to look at the object
		if(this.parameters.track_camera.value) {
			var position = new THREE.Vector3();
			position.setFromMatrixColumn(this.components.rigid_body.transformedObject.matrix, 3);
			var camera = application.window.viewport.camera;
			camera.lookAt(position);
		}

		this.boardPreviewObject.matrix.value

		//update the board's transform
		if(this.parameters.find_charuco_enabled.value) {
			this.boardPreviewObject.visible = true;
			var boardMatrix = new THREE.Matrix4();
			this.parameters.board_transform.populateTHREEMatrix(boardMatrix);
	
			if(true) {
				this.parameters.board_transform.populateTHREEMatrix(this.boardPreviewObject.matrix);
			}
			else {
				this.boardPreviewObject.matrix.getInverse(boardMatrix);
			}
		}
		else {
			this.boardPreviewObject.visible = false;
		}
	}
}
Debug.wrapClassPrototypeMethods(Node);

var frameIndex = 0;

export { Node };