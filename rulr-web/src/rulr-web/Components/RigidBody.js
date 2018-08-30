//Component.RigidBody

import { Base } from './Base.js'

export class Component extends Base {
	Component() {
	}

	async init() {
		await super.init();

		// Add listeners to parameter changes
		this.parameters.onFirstDataReady.addListener(() => {
			this.parameters.transform.onChange.addListener(() => {
				this.transformIsNew = true;
			});

			this.parameters.trail.onAnyChildChange.addListener(() => {
				this.needsTrailUpdate = true;
			});
		});

		// Add the transformed object and its axes helper
		{
			this.transformedObject = new THREE.Object3D();
			this.transformedObject.matrixAutoUpdate = false;
			this.viewportObject.add(this.transformedObject);

			this.axesPreview = new THREE.AxesHelper(0.2);
			this.transformedObject.add(this.axesPreview);
		}

		// Initialise the trail (empty)
		{
			this.trail = new Object();
			this.trail.history = [];
			this.trail.line = null;
			this.trail.curve = null;
			this.trail.axes = null;
		}

		this.needsTrailUpdate = false;
		this.transformIsNew = false;
	}

	async updateData() {
		await super.updateData();
		if(this.transformIsNew) {
			this.needsTrailUpdate = true;
			this.needsViewportUpdate = true;
		}

		if(this.needsTrailUpdate) {
			this.needsViewportUpdate = true;
		}
	}

	async viewportUpdate() {
		await super.viewportUpdate();


		if(this.transformIsNew) {
			// Update the graphical transform
			this.parameters.transform.populateTHREEMatrix(this.transformedObject.matrix);
			
			// Add to the history for the trail
			// We do this here since we want to update history only whenever the transform is new, not when the trail parameters change
			{
				// Update the history
				this.trail.history.push(this.transformedObject.matrix.clone());

				// Trim the old data from the array when it's too long
				while(this.trail.history.length > this.parameters.trail.duration__frames.value) {
					this.trail.history.shift();
				}
			}
			
			this.transformIsNew = false;
		}
		
		// Update the trail
		if(this.needsTrailUpdate) {
			await this.updateTrail();
			this.needsTrailUpdate = false;
		}
	}

	async updateTrail() {
		if(this.parameters.trail.style.line.value) {
			// Create the line
			if(this.trail.line == null) {
				this.trail.line = new Object();

				// Make the line buffer data
				{
					this.trail.line.positionBufferArray = new Float32Array(this.parameters.trail.duration__frames.value * 3 * 2);
					this.trail.line.positionBuffer = new THREE.BufferAttribute(this.trail.line.positionBufferArray, 3);
					this.trail.line.positionBuffer.setDynamic = true;

					this.trail.line.colorBufferArray = new Float32Array(this.parameters.trail.duration__frames.value * 4 * 2);
					this.trail.line.colorBuffer = new THREE.BufferAttribute(this.trail.line.colorBufferArray, 4);
					this.trail.line.colorBuffer.setDynamic = true;
				}

				// Make the line object
				{
					this.trail.line.geometry = new THREE.BufferGeometry();
					this.trail.line.geometry.addAttribute('position', this.trail.line.positionBuffer);
					this.trail.line.geometry.addAttribute('color', this.trail.line.colorBuffer);
					
					this.trail.line.material = new THREE.LineBasicMaterial({
						linewidth : 5,
						color : 0x333333,
						opacity : 0.5
					});

					this.trail.line.viewportObject = new THREE.Line(this.trail.line.geometry, this.trail.line.material);
					this.trail.line.viewportObject.frustumCulled = false; // TODO : fix culling
					this.viewportObject.add(this.trail.line.viewportObject);
				}
			}

			// Reallocate the line
			if(this.trail.history > this.trail.line.positionBufferArray.length / 3) {
				this.trail.line.removeAttribute('position');
				this.trail.line.positionBufferArray = new Float32Array(this.trail.history.length * 3 * 2);
				this.trail.line.positionBuffer = new THREE.BufferAttribute(this.trail.line.positionBufferArray, 3);
				this.trail.line.positionBuffer.setDynamic = true;
				this.trail.line.geometry.addAttribute('position', this.trail.line.positionBuffer);

				this.trail.line.removeAttribute('color');
				this.trail.line.colorBufferArray = new Float32Array(this.trail.history.length * 4 * 2);
				this.trail.line.colorBuffer = new THREE.BufferAttribute(this.trail.line.positionBufferArray, 4);
				this.trail.line.colorBuffer.setDynamic = true;
				this.trail.line.geometry.addAttribute('color', this.trail.line.colorBuffer);
			}
			
			if(this.trail.history.length > 0) {
				// Update the line data
				{
					let positionAttribute = this.trail.line.geometry.attributes.position;
					let positionArray = positionAttribute.array;

					let colorAttribute = this.trail.line.geometry.attributes.color;
					let colorArray = colorAttribute.array;

					for(let i=0; i<this.trail.history.length; i++) {
						// extract the positions from the array of matrices
						let position = new THREE.Vector3();
						position.setFromMatrixColumn(this.trail.history[i], 3);
						positionArray[i * 3 + 0] = position.x;
						positionArray[i * 3 + 1] = position.y;
						positionArray[i * 3 + 2] = position.z;

						// Note : the color isn't working right now
						let fade = i / this.trail.history.length;
						colorArray[i * 4 + 0] = fade;
						colorArray[i * 4 + 1] = fade;
						colorArray[i * 4 + 2] = fade;
						colorArray[i * 4 + 3] = fade;
					}
					this.trail.line.geometry.setDrawRange(0, this.trail.history.length);
					this.trail.line.visible = this.trail.history.length > 1;
					
					positionAttribute.needsUpdate = true;
				}

				this.trail.line.viewportObject.visible = true;
			}
			else {
				this.trail.line.viewportObject.visible = false;
			}
		}
		else {
			if(this.trail.line != null) {
				this.trail.line.viewportObject.visible = false;
			}
		}

		if(this.parameters.trail.style.axes.value) {
			//Create the collection of axes
			if(this.trail.axes == null) {
				this.trail.axes = new THREE.Object3D();
				this.viewportObject.add(this.trail.axes);
			}

			// Trim excess children
			while(this.trail.axes.children.length > this.trail.history.length) {
				this.trail.axes.remove(this.trail.axes.children[0]);
			}

			// Add enough children
			while(this.trail.axes.children.length < this.trail.history.length) {
				let axisHelper = new THREE.AxesHelper(0.05);
				axisHelper.matrixAutoUpdate = false;
				this.trail.axes.add(axisHelper);
			}

			// Update the matrix for each
			for(let i=0; i<this.trail.history.length; i++) {
				this.trail.axes.children[i].matrix.copy(this.trail.history[i]);
			}

			this.trail.axes.visible = true;
		}
		else {
			if(this.trail.axes != null) {
				this.trail.axes.visible = false;
			}
		}

		if(this.parameters.trail.style.curve.value) {
			let curveResolution = 5;

			// Create the line
			if(this.trail.curve == null) {
				this.trail.curve = new Object();

				// Make the line buffer data
				{
					let curvePointCount = curveResolution * this.parameters.trail.duration__frames.value;

					this.trail.curve.positionBufferArray = new Float32Array(curvePointCount * 3 * 2);
					this.trail.curve.positionBuffer = new THREE.BufferAttribute(this.trail.curve.positionBufferArray, 3);
					this.trail.curve.positionBuffer.setDynamic = true;
				}

				// Make the line object
				{
					this.trail.curve.geometry = new THREE.BufferGeometry();
					this.trail.curve.geometry.addAttribute('position', this.trail.curve.positionBuffer);
					
					this.trail.curve.material = new THREE.LineBasicMaterial({
						linewidth : 5,
						color : 0x333333,
						opacity : 0.5
					});

					this.trail.curve.viewportObject = new THREE.Line(this.trail.curve.geometry, this.trail.curve.material);
					this.trail.curve.viewportObject.frustumCulled = false; // TODO : fix culling
					this.viewportObject.add(this.trail.curve.viewportObject);
				}
			}

			let curvePointCount = curveResolution * this.trail.history.length;

			// Reallocate the line
			if(curvePointCount > this.trail.curve.positionBufferArray.length / 3) {
				this.trail.curve.removeAttribute('position');
				this.trail.curve.positionBufferArray = new Float32Array(curvePointCount * 3 * 2);
				this.trail.curve.positionBuffer = new THREE.BufferAttribute(this.trail.curve.positionBufferArray, 3);
				this.trail.curve.positionBuffer.setDynamic = true;
				this.trail.curve.geometry.addAttribute('position', this.trail.curve.positionBuffer);
			}

			// Update the line data
			if (this.trail.history.length > 1) {
				let positionAttribute = this.trail.curve.geometry.attributes.position;
				let positionArray = positionAttribute.array;

				let previousPoint = null;
				let nextPoint = null;
				let thisPoint = null;

				for(let i=0; i<this.trail.history.length; i++) {
					let nextIndex = i + 1;

					//update thisPoint and previousPoint
					if (i == 0) {
						// first point
						thisPoint = new THREE.Vector3();
						thisPoint.setFromMatrixColumn(this.trail.history[0], 3);
						previousPoint = thisPoint;
					}
					else {
						previousPoint = thisPoint;
						thisPoint = nextPoint;
					}

					//update nextPoint
					if(nextIndex < this.trail.history.length) {
						nextPoint = new THREE.Vector3();
						nextPoint.setFromMatrixColumn(this.trail.history[nextIndex], 3);
					}

					let priorVector = thisPoint.clone();
					priorVector.sub(previousPoint);

					let postVector = thisPoint.clone();
					postVector.sub(nextPoint);

					for(let c=0; c<curveResolution; c++) {
						let x = c / curveResolution;
						
						let priorComponent = priorVector.clone();
						priorComponent.multiplyScalar(x);
						priorComponent.add(thisPoint);
						priorComponent.multiplyScalar(1.0 - x);

						let postComponent = postVector.clone();
						postComponent.multiplyScalar(1.0 - x);
						postComponent.add(nextPoint);
						postComponent.multiplyScalar(x);
						
						let position = priorComponent.clone();
						position.add(postComponent);

						let pointIndex = i * curveResolution + c;
						positionArray[pointIndex * 3 + 0] = position.x;
						positionArray[pointIndex * 3 + 1] = position.y;
						positionArray[pointIndex * 3 + 2] = position.z;
					}
				}
				
				this.trail.curve.geometry.setDrawRange(0, curvePointCount);
				this.trail.curve.visible = true;
				
				positionAttribute.needsUpdate = true;
				this.trail.curve.viewportObject.update
			} else {
				this.trail.curve.visible = false;
			}
		}
		else {
			if(this.trail.curve != null) {
				this.trail.curve.viewportObject.visible = false;
			}
		}
	}
}