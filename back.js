import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js';

let widthScale = 0.4;
let heightScale = 0.4;

let fov = 75;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#backg'), antialias: true, alpha: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth * widthScale, window.innerHeight * heightScale);
renderer.setClearColor( 0xffffff, 0);
renderer.shadowMap.enabled = true;
renderer.render(scene, camera);

const sunLight = new THREE.PointLight(0xFFFFFF);
const ambLight = new THREE.AmbientLight(0xFFFFFF);
ambLight.intensity = 0.5;
scene.add(sunLight);
scene.add(ambLight);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth * widthScale, window.innerHeight * heightScale);
});

const gltfLoader = new GLTFLoader();
var spaceship = new THREE.Mesh();
gltfLoader.load('/models/gltf/spaceship1_flipped.glb', (gltf) => {
    gltf.scene.scale.set(1.2, 1.2, 1.2);
    gltf.scene.position.set(1, 0, -5);
    gltf.scene.rotation.set(Math.PI / 8, 7.5 * Math.PI / 7, -0.05);
    spaceship = gltf.scene;
    scene.add(spaceship);
});

var spaceshipIdleCount = 0;
function idleSpaceShip() {
    if (spaceshipIdleCount == 100845) spaceshipIdleCount = 0;
    spaceship.rotation.x = Math.PI / 8 + -0.1 * Math.sin(spaceshipIdleCount / 300);
    spaceship.rotation.z = -0.05 + -0.1 * Math.sin(spaceshipIdleCount / 300);
    spaceshipIdleCount++;
}

camera.position.setZ(5);
function constRender() {

    let shipScale = window.innerWidth * widthScale / 600;
    let origScale = window.innerWidth * 0.4 / 600;
    if (origScale > 1) {
        shipScale = 1;
    } else if (origScale < 0.45) {
        widthScale = 0;
        heightScale = 0;
        shipScale = 0.5;
    } else {
        widthScale = 0.4;
        heightScale = 0.4;
    }
    spaceship.scale.set(1.2 * shipScale, 1.2 * shipScale, 1.2 * shipScale);
    idleSpaceShip();
    requestAnimationFrame(constRender);
    renderer.render(scene, camera);
}
constRender();





