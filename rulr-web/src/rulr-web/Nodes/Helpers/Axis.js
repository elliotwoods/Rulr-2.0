import { Base } from '../Base.js'

class Node extends Base {
	constructor() {
		super();

		this.parameters.onDataReadyListeners.push(() => {
			this.parameters.children.Size.onChangeListeners.push(() => {
				this.needsViewportUpdate = true;
			});
		});

		this.axes = new THREE.AxesHelper(1.0);
		this.viewportObject.add(this.axes);
	}

	async viewportUpdate() {
		await super.viewportUpdate();
		var scale = await this.parameters.children.Size.serverInstance.value_get();
		this.axes.scale.set(scale, scale, scale);
	}
}

export { Node };