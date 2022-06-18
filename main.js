import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js'

// https://jsfiddle.net/ for troubleshooting

// In order to get the site working on github, do the following in sequence
// npm run build: readies website for commit
// Commit and Push to GitHub
// npm run deploy: links http://quinnbooth.github.io to index.html file in dist directory

// npm run dev: hosts local site

// Setup render
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // (FOV, Aspect Ratio based on user's browser window, (View Frustrum: 1st arg is how close to camera user can see, 2nd is how far))
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight); // make fullscreen canvas
camera.position.setZ(30);
renderer.render(scene, camera);

// Test shapes
const shape = new THREE.CircleGeometry(5, 100, 0, 1000);
//const material = new THREE.MeshBasicMaterial({color: 0x117777, wireframe: true});
const material = new THREE.MeshBasicMaterial({color: 0xFFFFF1, wireframe: true});
const circ = new THREE.Mesh(shape, material);
scene.add(circ);

// Runs constant animation of scene in browser
function constRender() {
    requestAnimationFrame(constRender); // tells browser animation is to be performed

    circ.rotation.x += 0.005;
    circ.rotation.y += 0.001;
    circ.rotation.z += 0.005;

    renderer.render(scene, camera);
}
constRender();
