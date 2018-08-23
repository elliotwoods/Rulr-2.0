import { Base } from '../Base.js'
import * as Debug from '../../Utils/Debug.js'

function flatten(arr) {
	return arr.reduce(function (flat, toFlatten) {
		return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
	}, []);
}

class Node extends Base {
	constructor() {
		super();
	}

	async init() {
		await super.init();
		this.parameters.onFirstDataReady.addListener(() => {
			var updateViewportCallback = () => {
				this.needsViewportUpdate = true;
			};
			this.parameters.Transform.onChange.addListener(updateViewportCallback);
			this.parameters.CameraMatrix.onChange.addListener(updateViewportCallback);
		});

		this.axesPreview = new THREE.AxesHelper(0.2);
		this.axesPreview.matrixAutoUpdate = false;
		this.viewportObject.add(this.axesPreview);
	}

	async updateData() {
		await super.updateData();
	}

	async viewportUpdate() {
		this.axesPreview.matrix.fromArray(flatten(this.parameters.Transform.value));
		this.axesPreview.matrix.transpose();
	}
}
Debug.wrapClassPrototypeMethods(Node);

export { Node };