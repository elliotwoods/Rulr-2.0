import { Base } from '../Base.js'
import * as Debug from '../../Utils/Debug.js'

class Node extends Base {
	async init() {
		await super.init();

		this.parameters.onFirstDataReady.addListener(() => {
			this.parameters.children.Size.onChange.addListener(() => {
				this.needsViewportUpdate = true;
			});
		});

		this.axes = new THREE.AxesHelper(1.0);
		this.viewportObject.add(this.axes);
	}

	async viewportUpdate() {
		await super.viewportUpdate();
		var scale = await this.parameters.children.Size.value;
		this.axes.scale.set(scale, scale, scale);
		this.axes.visible = scale != 0.0;
	}
}
Debug.wrapClassPrototypeMethods(Node);

export { Node };