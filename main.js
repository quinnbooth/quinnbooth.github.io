//import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js'
//import * as THREE from '/node_modules/three/build/three.module.js';
//import { GLTFLoader } from '/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/FBXLoader.js';

// For testing/troubleshooting
// npm run dev: hosts local site
// https://jsfiddle.net/

// In order to get the site working on github, do the following in sequence:
// npm run build: readies website for commit
// Commit and Push to GitHub
// npm run deploy: links http://quinnbooth.github.io to index.html file in dist directory (will take a few minutes after it says it's complete in terminal to load online)
// More information: https://sbcode.net/threejs/github-pages/

//================================================================================================================
//  
//  Ideas:
//
//  Animated typing text: 'click anywhere to start' with flashing bar
//  Fire behind ship
//  Add background?
//  Orbit controls?
//  Import three.js from node_modules? (not sure if this is good practice)
//      - Maybe download my own js files for this and put in src folder using wget()
//      - Could also use webpack? It might build modules into the bundle. Look into this?
//
//================================================================================================================

// Setup render
var stage = 0;
var fov = 75;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000); // (FOV, Aspect Ratio based on user's browser window, (View Frustrum: 1st arg is how close to camera user can see, 2nd is how far))
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight); // make fullscreen canvas
camera.position.setZ(40);
renderer.render(scene, camera);
var visibleHeight = 2 * Math.tan((camera.fov * Math.PI / 180 /*vertical fov*/) / 2) * camera.position.z;
var visibleWidth = visibleHeight * camera.aspect;
camera.position.setZ(500);
const sunLight = new THREE.PointLight(0xFFFFFF);
const ambLight = new THREE.AmbientLight(0xFFFFFF);
ambLight.intensity = 0.5;
scene.add(sunLight);
scene.add(ambLight);
const gltfLoader = new GLTFLoader();
var clock = new THREE.Clock();



//#region Solar System Animation
//#region Meshes

const spaceBkgd = new THREE.TextureLoader().load('images/space3.jpg');

const sunShape = new THREE.SphereGeometry(3, 100, 10, 1000);
const mercuryShape = new THREE.SphereGeometry(1, 100, 10, 1000);
const venusShape = new THREE.SphereGeometry(1.3, 100, 10, 1000);
const earthShape = new THREE.SphereGeometry(1.3, 100, 10, 1000);
const marsShape = new THREE.SphereGeometry(1, 100, 10, 1000);
const jupiterShape = new THREE.SphereGeometry(2.3, 100, 10, 1000);
const jupiterRingShape = new THREE.CircleGeometry(2.9, 100, 0, 1000);
const saturnShape = new THREE.SphereGeometry(2, 100, 10, 1000);
const saturnRingShape = new THREE.CircleGeometry(3, 100, 0, 1000);
const uranusShape = new THREE.SphereGeometry(1.7, 100, 10, 1000);
const uranusRingShape = new THREE.CircleGeometry(2.5, 100, 0, 1000);
const neptuneShape = new THREE.SphereGeometry(1.6, 100, 10, 1000);
const neptuneRingShape = new THREE.CircleGeometry(2.4, 100, 0, 1000);

//#region No Light Needed
/*
const sunColor = new THREE.MeshBasicMaterial({color: 0xF25C02, wireframe: false});
const mercuryColor = new THREE.MeshBasicMaterial({color: 0xB94500, wireframe: false});
const venusColor = new THREE.MeshBasicMaterial({color: 0xD7AB3D, wireframe: false});
const earthColor = new THREE.MeshBasicMaterial({color: 0x3E88E1, wireframe: false});
const marsColor = new THREE.MeshBasicMaterial({color: 0xBC3A00, wireframe: false});
const jupiterColor = new THREE.MeshBasicMaterial({color: 0xE3C059, wireframe: false});
const jupiterRingColor = new THREE.MeshBasicMaterial({color: 0xE9d18C, wireframe: true});
const saturnColor = new THREE.MeshBasicMaterial({color: 0xE5BD68, wireframe: false});
const saturnRingColor = new THREE.MeshBasicMaterial({color: 0xD2C19D, wireframe: true});
const uranusColor = new THREE.MeshBasicMaterial({color: 0xB6EEF3, wireframe: false});
const uranusRingColor = new THREE.MeshBasicMaterial({color: 0xCEF5F8, wireframe: true});
const neptuneColor = new THREE.MeshBasicMaterial({color: 0x1D65E2, wireframe: false});
const neptuneRingColor = new THREE.MeshBasicMaterial({color: 0x6491DF, wireframe: true});
*/
//#endregion No Light Needed

const sunColor = new THREE.MeshBasicMaterial({color: 0xF25C02, wireframe: false});
const mercuryColor = new THREE.MeshStandardMaterial({color: 0xB94500, wireframe: false});
const venusColor = new THREE.MeshStandardMaterial({color: 0xD7AB3D, wireframe: false});
const earthColor = new THREE.MeshStandardMaterial({color: 0x3E88E1, wireframe: false});
const marsColor = new THREE.MeshStandardMaterial({color: 0xBC3A00, wireframe: false});
const jupiterColor = new THREE.MeshStandardMaterial({color: 0xE3C059, wireframe: false});
const jupiterRingColor = new THREE.MeshStandardMaterial({color: 0xE9d18C, wireframe: true});
const saturnColor = new THREE.MeshStandardMaterial({color: 0xE5BD68, wireframe: false});
const saturnRingColor = new THREE.MeshStandardMaterial({color: 0xD2C19D, wireframe: true});
const uranusColor = new THREE.MeshStandardMaterial({color: 0xB6EEF3, wireframe: false});
const uranusRingColor = new THREE.MeshStandardMaterial({color: 0xCEF5F8, wireframe: true});
const neptuneColor = new THREE.MeshStandardMaterial({color: 0x1D65E2, wireframe: false});
const neptuneRingColor = new THREE.MeshStandardMaterial({color: 0x6491DF, wireframe: true});

const sun = new THREE.Mesh(sunShape, sunColor);
const mercury = new THREE.Mesh(mercuryShape, mercuryColor);
const venus = new THREE.Mesh(venusShape, venusColor);
const earth = new THREE.Mesh(earthShape, earthColor);
const mars = new THREE.Mesh(marsShape, marsColor);
const jupiter = new THREE.Mesh(jupiterShape, jupiterColor);
const jupiterRing = new THREE.Mesh(jupiterRingShape, jupiterRingColor);
const saturn = new THREE.Mesh(saturnShape, saturnColor);
const saturnRing = new THREE.Mesh(saturnRingShape, saturnRingColor);
const uranus = new THREE.Mesh(uranusShape, uranusColor);
const uranusRing = new THREE.Mesh(uranusRingShape, uranusRingColor);
const neptune = new THREE.Mesh(neptuneShape, neptuneColor);
const neptuneRing = new THREE.Mesh(neptuneRingShape, neptuneRingColor);

//#endregion Meshes
//#region Function
var solarSystem = 0;
var planetSpeeds = [];
var ringRots = [];
var regions = [];
function runSolarSystem(state, rad0, planetRot, ringRot, planetSpeed, region) {
    /*
    state: setup/animate/delete
    rad0: rad between sun and mercury
    rad: rad between rest of planets
    planetRots: planet rotation speeds
    ringRots: empty array to store ring rotation speeds
    planetSpeed: empty array to store planet orbit speeds
    regions: empty array to store info on whether planet is on top or bottom half of screen
    */
    const planets = [sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune];
    const ringedPlanets = [jupiter, saturn, uranus, neptune];
    const rings = [jupiterRing, saturnRing, uranusRing, neptuneRing];
    if (state == 0) {   // Set up solar system
        var maxDimension = visibleWidth;
        if (visibleHeight < maxDimension) {
            maxDimension = visibleHeight;
        }
        var rad = maxDimension / 20;
        //scene.background = spaceBkgd;
        scene.add(sun);
        for (let i = 1; i < planets.length; i++) {  // Add planets on respective orbits
            scene.add(planets[i]);
            var angle = 2 * Math.PI * Math.random();
            planets[i].position.set(rad0 * Math.cos(angle), rad0 * Math.sin(angle), 0);
            rad0 += rad;
            planetSpeed.push(.005 * Math.random()); // Generate random planet orbit speeds
            regions.push(0);
        }
        for (let i = 0; i < rings.length; i++) {    // Add rings and match coords to planets
            scene.add(rings[i]);
            rings[i].position.set(ringedPlanets[i].position.x, ringedPlanets[i].position.y, 0);
            ringRot.push([.005 * Math.random(), .005 * Math.random(), .005 * Math.random()]);   // Generate random ring rotation speeds
        }
        solarSystem = 1;
    } else if (state == 1) {    // Animate solar system
        planets[0].rotation.x += planetRot[0];  // Rotate sun
        planets[0].rotation.y += planetRot[1];
        planets[0].rotation.z += planetRot[2];
        for (let i = 1; i < planets.length; i++) {  // Rotate & orbit planets
            const j = i - 1;
            planets[i].rotation.x += planetRot[0];
            planets[i].rotation.y += planetRot[1];
            planets[i].rotation.z += planetRot[2];
            var x = planets[i].position.x;
            var y = planets[i].position.y;
            var radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            var angle = Math.acos(x / radius) * (-2 * region[j] + 1) + planetSpeed[j];
            planets[i].position.x = radius * Math.cos(angle);
            planets[i].position.y = radius * Math.sin(angle);
            if (Math.abs(angle - Math.PI) < planetSpeed[j]) {
                angle = Math.PI + 0.001;
                region[j] = -1 * region[j] + 1;
            } else if (Math.abs(angle) < planetSpeed[j]) {
                angle = 0.001;
                region[j] = -1 * region[j] + 1;
            }
        }
        for (let i = 0; i < rings.length; i++) {    // Rotate & orbit rings
            rings[i].rotation.x += ringRot[i][0];
            rings[i].rotation.y += ringRot[i][1];
            rings[i].rotation.z += ringRot[i][2];
            rings[i].position.set(ringedPlanets[i].position.x, ringedPlanets[i].position.y, 0);
        }
    } else {    // Delete solar system
        solarSystem = 0;
        for (var spd in planetSpeed) {
            planetSpeed.pop();
            regions.pop();
        }
        for (var ring in ringRot) {
            ringRot.pop();
        }
        planetSpeeds = [];
        ringRots = [];
        regions = [];
        scene.background = new THREE.Color(0x000000);
        for (const planet of planets) {
            scene.remove(planet);
        }
        for (const ring of rings) {
            scene.remove(ring);
        }
    }
}
//#endregion Function
//#endregion Solar System Animation

//#region Initial Zoom Animation
const starsShape = new THREE.BufferGeometry();
var starsShapeVertices = new Float32Array(9000);
for (let i = 0; i < 9000; i++) starsShapeVertices[i] = Math.random() * 600 - 300;
starsShape.setAttribute('position', new THREE.BufferAttribute(starsShapeVertices, 3));
let starTexture = new THREE.TextureLoader().load('/images/star1.png');
let starMaterial = new THREE.PointsMaterial({color: 0xAAAAAA, size: 0.75, map: starTexture, transparent: true});
const stars = new THREE.Points(starsShape, starMaterial);
scene.add(stars);

var removeTextBool = true;
var camVelZ = 0;
var starRotSpd = 0;
function initialZoom() {
    if (camera.position.z > 250) {
        camera.position.z += camVelZ;
        camVelZ -= 0.001;
        if (starRotSpd < 0.0012) starRotSpd += 0.000003;
        stars.rotation.z += starRotSpd;
    } else if (camera.position.z > 45) {
        camera.position.z += camVelZ;
        camVelZ += 0.001225;
        if (starRotSpd > 0.000075) starRotSpd -= 0.000003;
        stars.rotation.z += starRotSpd;
    } else {
        stars.rotation.z += 0.000075;
        if (removeTextBool) {
            scene.remove(typingtext);
            removeTextBool = false;
        }
    }
    if (camera.rotation.x < .25) camera.rotation.x += 0.00020;
    if (camera.position.y > -15) camera.position.y -= (6 / 500);
}
//#endregion Initial Zoon Animation

//#region Space Ship Animation
const spaceshipLight = new THREE.PointLight(0xFFFFFF);
spaceshipLight.intensity = 2;
scene.add(spaceshipLight);
spaceshipLight.position.set(-2, -2, 502);
var spaceship = new THREE.Mesh();
gltfLoader.load('/models/gltf/spaceship1.glb', (gltf) => {
    gltf.scene.scale.set(0.3, 0.3, 0.3);
    gltf.scene.position.set(-4.5, 0.3, 498);
    gltf.scene.rotation.set(Math.PI / 9, -1 * Math.PI / 7, 0);
    spaceship = gltf.scene;
    scene.add(spaceship);
});

var spaceshipIdleCount = 0;
function idleSpaceShip(state) {
    if (state == 0) {
        if (spaceshipIdleCount == 100845) spaceshipIdleCount = 0;
        spaceship.rotation.x = -0.05 * Math.sin(spaceshipIdleCount / 300) + Math.PI / 10;
        spaceshipIdleCount++;
    }
}

var spaceshipVelX = 0.01;
var spaceshipVelY = -0.00085;
const spaceshipAccX = -0.0000143;
const spaceshipAccY = 0.0000012;
function runSpaceShip(state) {
    if (state == 0) {
        if (spaceship.position.x < -1) {
            spaceship.position.x += spaceshipVelX;
            spaceshipVelX += spaceshipAccX;
        }
        if (spaceship.position.y > 0) {
            spaceship.position.y += spaceshipVelY;
            spaceshipVelY += spaceshipAccY;
        }
        if (spaceship.position.x >= -1 && spaceship.position.y <= 0 && textAnimation) textAnimation.play();
        idleSpaceShip(0);
        stars.rotation.z += 0.000075;
    } else if (state == 1) {
        if (spaceship.position.x < 6) {
            spaceship.position.x += spaceshipVelX;
            spaceshipVelX -= 2 * spaceshipAccX;
        }
        if (spaceship.position.y > -0.5) {
            spaceship.position.y += spaceshipVelY;
            spaceshipVelY -= 2 * spaceshipAccY;
        }
        idleSpaceShip(0);
        if (spaceshipLight.intensity > 0) spaceshipLight.intensity = spaceshipLight.intensity - 0.004;
        if (spaceship.position.x >= 6 && spaceship.position.y <= -0.5) {
            stage++;
            scene.remove(spaceshipLight);
        }
        stars.rotation.z += 0.000075;
    }
}
//#endregion Space Ship Animation

//#region Fire Animation
/*const fireIntricacy = 10;
const fireShape = new THREE.BufferGeometry();
var fireShapeVertices = new Float32Array(3 * fireIntricacy);
let fireTexture = new THREE.TextureLoader().load('/images/fire2.png');
let fireMaterial = new THREE.PointsMaterial({color: 0xAAAAAA, size: 0.1, map: fireTexture, transparent: true});
var fire = new THREE.Points(fireShape, fireMaterial);
//var fire = new THREE.Points(fireShape, fireMaterial);
scene.add(fire);

function randomFire() {
    for (let i = 0; i < 3 * fireIntricacy; i++) fireShapeVertices[i] = (Math.random() * 2 - 1) * 0.25;
    fireShape.setAttribute('position', new THREE.BufferAttribute(fireShapeVertices, 3));
    fire.geometry.attributes.position.needsUpdate = true;
}
randomFire();*/

//const fireCone = new THREE.ConeGeometry();

//#endregion Fire Animation

//#region Typing Text Animation
let mixer;
let typingtext;
let textAnimation;
gltfLoader.load('/models/gltf/typingtext1.glb', (gltf) => {
    typingtext = gltf.scene;
    typingtext.scale.set(0.25, 0.01, 0.25);
    typingtext.position.set(0, 0.65, 499);
    typingtext.rotation.set(90, 0, 0);
    scene.add(typingtext);
    mixer = new THREE.AnimationMixer(typingtext);
    gltf.animations.forEach((clip) => {
        textAnimation = mixer.clipAction(clip);
        textAnimation.setLoop(THREE.LoopOnce);
        textAnimation.clampWhenFinished = true;
        textAnimation.enable = true;
    });
});
//#endregion Typing Text Animation

//#region Detect Events
// Detects mouse click
window.addEventListener('click', function(e) {
    if (stage == 0 && spaceship.position.x >= -1 && spaceship.position.y <= 0) {
        stage = 1;
    }
});

// Resizes canvas when window changes size
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
//#endregion Detect Events



// Runs constant animation of scene in browser
var a = 0;
function constRender() {
    requestAnimationFrame(constRender); // tells browser animation is to be performed
    var delta = clock.getDelta();
    if (mixer) mixer.update(delta);

    runSolarSystem(solarSystem, 5, [0.002, 0.001, 0.003], ringRots, planetSpeeds, regions);
    runSpaceShip(stage);
    if (stage == 2) initialZoom();

    renderer.render(scene, camera);
}
constRender();