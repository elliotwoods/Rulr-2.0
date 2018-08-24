import * as Utils from '../Utils.js'
import { Element } from './Element.js'
import { application } from '../Application.js'
var scaleFactor = 1.0;

class Viewport extends Element {
	constructor() {
		super();

		this.scene = null;
		this.raycaster = null;
		this.mousePosition = null;
		this.container = null;
		this.orbitControls = null;
		this.renderSize = {
			width: 100,
			height: 100
		};

		this.whenReady(() => {
			this.init();
		});
	}

	init() {
		if (!Detector.webgl) {
			Detector.addGetWebGLMessage();
		}

		{
			this.scene = new THREE.Scene();
		}

		{
			this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01 * scaleFactor, 1000 * scaleFactor);
			this.camera.position.x = 0;
			this.camera.position.y = 3;
			this.camera.position.z = 10;
			this.camera.lookAt(new THREE.Vector3(0, 0, 0));
		}

		this.raycaster = new THREE.Raycaster();
		this.mousePosition = new THREE.Vector2();

		{
			this.container = document.getElementById('Viewport-container');

			this.renderer = new THREE.WebGLRenderer({ 'antialias': true });
			this.renderer.setPixelRatio(window.devicePixelRatio);
			this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
			this.renderer.setClearColor(0xffffff, 1);

			this.container.appendChild(this.renderer.domElement);
		}

		{
			this.orbitControls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
			// Force a render
			this.orbitControls.addEventListener('change', this._render.bind(this));
			this.orbitControls.mouseButtons.ZOOM = 2;
			this.orbitControls.mouseButtons.PAN = 1;
		}

		// GUI callback actions
		{
			this.renderer.domElement.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
			this.renderer.domElement.addEventListener('mousedown', this.onDocumentMouseDown.bind(this), false);
			this.renderer.domElement.addEventListener('mouseup', this.onDocumentMouseUp.bind(this), false);

			$(window).resize(() => {
				this.onWindowResize();
			});

			jQuery(this.renderer.domElement).dblclick(this.doubleClick);
		}

		// Initialise the first render
		{
			this.onWindowResize();
		}
	}

	async update() {
		await super.update();


	}

	async refresh() {
		await super.refresh();

		var visibleNodes = application.getVisibleNodes();

		var visibleViewportObjects = [];
		visibleNodes.forEach((node) => {
			if(!this.scene.children.includes(node.viewportObject)) {
				this.scene.add(node.viewportObject);
			}
			visibleViewportObjects.push(node.viewportObject)
		});

		this.scene.children.forEach((sceneObject) => {
			if(!visibleViewportObjects.includes(sceneObject)) {
				this.scene.remove(sceneObject);
			}
		});
	}

	doubleClick() {

	}

	onWindowResize() {
		this.renderSize.width = this.container.clientWidth;
		this.renderSize.height = this.container.clientHeight;

		this.camera.aspect = this.renderSize.width / this.renderSize.height;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(this.renderSize.width, this.renderSize.height);
		this.render();
	}

	onDocumentMouseMove(event) {
		this.mousePosition.x = (event.clientX / this.renderSize.width) * 2 - 1;
		this.mousePosition.y = - (event.clientY / this.renderSize.height) * 2 + 1;
	}

	onDocumentMouseDown(event) {

	}

	onDocumentMouseUp(event) {
		
	}

	render() {
		this.orbitControls.update();
		this.raycaster.setFromCamera(this.mousePosition, this.camera);
		this._render();
	}

	_render() {
		// This doesn't include orbitControls, which may also invoke a render onChange
		this.renderer.render(this.scene, this.camera);
	}
}

export { Viewport };