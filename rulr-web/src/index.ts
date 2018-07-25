import {LoadDialog} from './rulr-web/LoadProjectModal'

let loadDialog = new LoadDialog();

import * as $ from "jquery"
import * as THREE from 'three'
import 'three/examples/js/controls/OrbitControls';
import 'three/examples/js/Detector';

var scene, camera, controls, renderer, stats;
var geometry, material, mesh;
var raycaster, mousePosition, projector;

var rootNode;
var container;

var scaleFactor = 1.0;
var forEach = Array.prototype.forEach;

var renderSize = {
	width: 100,
	height: 100
};

$(document).ready(function() {
	$("#placeholder-Inspector").load("Interface/Inspector.html");
	$("#placeholder-WorldExplorer").load("Interface/WorldExplorer.html");
	$("#placeholder-LoadProjectModal").load("Interface/LoadProjectModal.html", function() {
		loadDialog.show();
	});
	alert('loaded');
});

function init() {
	//if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	scene = new THREE.Scene();
	var inspectorContentDiv = document.getElementById('inspectorContent');

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01 * scaleFactor, 1000 * scaleFactor);
	camera.position.x = 0;
	camera.position.y = 3;
	camera.position.z = 10;
	camera.lookAt(new THREE.Vector3(0, 2, 0));

	raycaster = new THREE.Raycaster();
	mousePosition = new THREE.Vector2();

	container = document.getElementById( 'mainView' );

	renderer = new THREE.WebGLRenderer({'antialias' : true});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(container.clientWidth, container.clientHeight);
	renderer.setClearColor( 0xffffff, 1 );
	container.appendChild( renderer.domElement );
	
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.addEventListener( 'change', render );
	controls.mouseButtons.ZOOM = 2;
	controls.mouseButtons.PAN = 1;

	$(window).resize(function() {
		onWindowResize();
	})
	renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
	renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
	renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );

	$(renderer.domElement).dblclick(doubleClick);

	{
		var minor = new THREE.GridHelper(40.0, 400 / 2, 0xeeeeee, 0xeeeeee);
		scene.add(minor);
	}

	onWindowResize();
	render();
}

function doubleClick() {
	//sceneObjects.doubleClick();
}


function onWindowResize() {
	renderSize.width = container.clientWidth;
	renderSize.height = window.innerHeight;

	camera.aspect = renderSize.width / renderSize.height;
	camera.updateProjectionMatrix();
	renderer.setSize( renderSize.width, renderSize.height );
	render();
}

function onDocumentMouseMove(event) {
	mousePosition.x = ( event.clientX / renderSize.width ) * 2 - 1;
	mousePosition.y = - ( event.clientY / renderSize.height ) * 2 + 1;
}

function onDocumentMouseDown(event) {
	//sceneObjects.mouseDown(event);
}

function onDocumentMouseUp(event) {
	//sceneObjects.mouseUp(event);
}

function animate() {
	requestAnimationFrame(animate);

	controls.update();

	raycast();
	render();
}

function render() {
	renderer.render(scene, camera);
	
	if(stats) {
		stats.update();
	}
}

function raycast() {
	raycaster.setFromCamera(mousePosition, camera);
	//sceneObjects.updateHover(raycaster);
}

init();
animate();