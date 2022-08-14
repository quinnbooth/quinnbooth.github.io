import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';
//import { Texture } from 'three';
//import { Vector3 } from 'three';

//======= Ideas & Notes ===========================================================================================

// For testing/troubleshooting
// npm run dev: hosts local site
// https://jsfiddle.net/

// In order to get the site working on github, do the following in sequence:
// npm run build: readies website for commit
// Commit and Push to GitHub
// npm run deploy: links http://quinnbooth.github.io to index.html file in dist directory (will take a few minutes after it says it's complete in terminal to load online)
// More information: https://sbcode.net/threejs/github-pages/

// Use facetype.js to convert fonts in .ttf to .json

// Ideas:
//
// Fire behind ship
// Add background?
// Import three.js from node_modules? (not sure if this is good practice)
//  - Maybe download my own js files for this and put in src folder using wget()
//  - Could also use webpack? It might build modules into the bundle. Look into this?

//======= Setup ===================================================================================================

let stage = 0;
let orbitBool = 1;
let fov = 75;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000); // (FOV, Aspect Ratio based on user's browser window, (View Frustrum: 1st arg is how close to camera user can see, 2nd is how far))
const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#bg'), antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight); // make fullscreen canvas
renderer.shadowMap.enabled = true;
renderer.render(scene, camera);
camera.position.setZ(40);
let visibleHeight = 2 * Math.tan((camera.fov * Math.PI / 180 /*vertical fov*/) / 2) * camera.position.z;
let visibleWidth = visibleHeight * camera.aspect;
camera.position.setZ(500);
let clock = new THREE.Clock();
const sunLight = new THREE.PointLight(0xFFFFFF);
const ambLight = new THREE.AmbientLight(0xFFFFFF);
ambLight.intensity = 0.5;
scene.add(sunLight);
scene.add(ambLight);
const gltfLoader = new GLTFLoader();
const fontLoader = new THREE.FontLoader();
const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false;
const mousePos = new THREE.Vector2();
const raycaster = new THREE.Raycaster();



//======= Animations =============================================================================================

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
const planets = [sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune];
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
            instructions1Stage = 1;
            stage++;
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
    } else {
        if (spaceshipIdleCount == 100845) spaceshipIdleCount = 0;
        spaceship.rotation.x = 0.5 * Math.sin(spaceshipIdleCount / 300) + 3 * Math.PI / 2;
        // y controls what direction the ship looks like it's facing
        spaceship.rotation.z = -0.25 * Math.sin(spaceshipIdleCount / 200) + Math.PI;
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

let destPlanet;
let shipToCursorState = 0;
let shipVel = new THREE.Vector3(0, 0, 0);
let shipVelMag = 0.1;
let shipAccMag = 0.0005;
let shipAcc = new THREE.Vector3(0.0001, 0, 0);
function shipToCursor(dest, state) {
    if (state == 0) {
        shipVel = new THREE.Vector3(-0.1, 0, 0);
        shipToCursorState++;
    } else if (state == 1) {
        if (spaceship.position.x > 25) {
            spaceship.position.add(shipVel);
        } else {
            shipToCursorState++;
        }
        shipVel.add(shipAcc);
    } else if (dest) {
        console.log(shipVelMag);
        if (state == 2) {
            // Turn towards new clicked planet
            let distVect = new THREE.Vector3().copy(dest.position).sub(spaceship.position).normalize();
            distVect.z = 0;
            let flipFactor = 1;
            if (spaceship.position.x < dest.position.x) { flipFactor = -1; }
            let compareVector = new THREE.Vector3(0, flipFactor, 0);
            let addAngle = flipFactor * Math.PI / 2;
            let facingAngle = Math.acos(distVect.dot(compareVector) / (distVect.length() * compareVector.length()));
            spaceship.rotation.y = facingAngle + addAngle;
            spaceship.rotation.z = 0;
            spaceship.rotation.x = Math.PI/2;
            // Calculate path to first chosen planet and fly in that direction
            let planetPos = new THREE.Vector3()
            planetPos.copy(dest.position);
            planetPos.sub(spaceship.position);
            planetPos.normalize();
            planetPos.multiplyScalar(-shipVelMag);
            shipVelMag += shipAccMag;
            planetPos.z = 0;
            spaceship.position.sub(planetPos);
            // Once the ship is in place go to the next stage
            planetPos.copy(dest.position);
            if (planetPos.sub(spaceship.position).lengthSq() < 15) {
                shipVelMag += 10 * shipAccMag;
                shipToCursorState = 3;
            }
        } else if (state == 3) {
            // Pursue the last clicked planet
            let planetPos = new THREE.Vector3()
            planetPos.copy(dest.position);
            planetPos.sub(spaceship.position);
            planetPos.normalize();
            planetPos.multiplyScalar(-shipVelMag);
            planetPos.z = 0;
            spaceship.position.sub(planetPos);
        }
    }
}

//#endregion Space Ship Animation

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

//#region Instructions Animation
var instructions1Stage = 0;
let instructions1 = "Scroll to zoom\nDrag to rotate\nClick Sun to pause planets\nClick planet to expore contents";
let instructionsMesh = new THREE.Mesh();
fontLoader.load('/models/fonts/Cairo_Bold.json', (font) => {
    const instructions1Shape = new THREE.TextGeometry(instructions1, {
        font: font,
        size: 1.25,
        height: 0.1,
    });
    instructionsMesh = new THREE.Mesh(instructions1Shape, [
        new THREE.MeshPhongMaterial({color: 0xFFFFFF, transparent: true}),
        new THREE.MeshPhongMaterial({color: 0X333333, transparent: true}),
    ]);
    instructionsMesh.position.set(-40, -15, 0);
    instructionsMesh.material[0].opacity = 0;
    instructionsMesh.material[1].opacity = 0;
    scene.add(instructionsMesh);
});

function instruction1(state) {
    if (instructionsMesh && instructionsMesh.material[0] && instructionsMesh.material[1]) {
        if (state == 1) {
            if (instructionsMesh.material[0].opacity < 1 && instructionsMesh.material[1].opacity < 1) {
                instructionsMesh.material[0].opacity += 0.002;
                instructionsMesh.material[1].opacity += 0.002;
            } else {
                instructions1Stage++;
            }
        } else if (state == 3) {
            if (instructionsMesh.material[0].opacity <= 0 && instructionsMesh.material[1].opacity <= 0) {
                // In case more instructions should pop-up after the first set fades
            } else {
                instructionsMesh.material[0].opacity -= 0.001;
                instructionsMesh.material[1].opacity -= 0.001;
            }
        }
        instructionsMesh.lookAt(camera.position.x, camera.position.y, camera.position.z);
    }
}
//#endregion InstructionsAnimation

//======= Events =================================================================================================

//#region Detect Events
// Detects mouse click
window.addEventListener('click', function(e) {
    if (stage == 0 && spaceship.position.x >= -1 && spaceship.position.y <= 0) {
        stage = 1;
    } else if (stage == 3) {
        let curPlanet;
        if (curPlanet = planetHover()) {
            if (curPlanet.name == "sun") {
                orbitBool = !orbitBool; // Pauses planet orbits
            } else {
                if (shipToCursorState == 1) {
                    shipToCursorState++;
                } else if (shipToCursorState == 3) {
                    shipToCursorState--;
                }
                shipVelMag = 0.1;
                destPlanet = curPlanet;
            }
            //console.log("Clicked on: " + curPlanet.name);
        } else if (instructions1Stage == 2) {
            instructions1Stage++;
        }
    } 
});

// Detects mouse move
window.addEventListener('mousemove', function(e) {
    mousePos.x = (e.clientX / this.innerWidth) * 2 - 1;
    mousePos.y = ((e.clientY / this.innerHeight) * 2 - 1) * -1;
});

// Resizes canvas when window changes size
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
//#endregion Detect Events

//#region Find Where Mouse is Hovering
sun.name = "sun";
mercury.name = "mercury";
venus.name = "venus";
earth.name = "earth";
mars.name = "mars";
jupiter.name = "jupiter";
saturn.name = "saturn";
uranus.name = "uranus";
neptune.name = "neptune";

function distanceFromCam(obj) {
    let objDistance = 0;
    let objLocation = new THREE.Vector3();
    objLocation.copy(obj.position);
    objDistance = (objLocation.sub(camera.position)).length();
    return objDistance;
}

function planetHover() {
    let hoveredPlanets = [];
    raycaster.setFromCamera(mousePos, camera);
    const intersections = raycaster.intersectObjects(scene.children);
    if (intersections.length > 0) {
        for (let i = 0; i < intersections.length; i++) {
            for (let j = 0; j < planets.length; j++) {
                if (intersections[i].object.name == planets[j].name) hoveredPlanets.push(planets[j]);
            }
        }
    }
    let closestPlanet = hoveredPlanets[0];
    if (hoveredPlanets.length > 1) {
        for (let i = 1; i < hoveredPlanets.length; i++) {
            if (distanceFromCam(hoveredPlanets[i]) < distanceFromCam(closestPlanet)) closestPlanet = hoveredPlanets[i];
        }
    }
    return closestPlanet;
}
//#endregion Find Where Mouse is Hovering

//======= Workspace ==============================================================================================



//======= Animation Loop ==========================================================================================

var skipIntro = false;

// Runs constant animation of scene in browser
var skipIntroHelper = true;
var a = 0;
function constRender() {
    requestAnimationFrame(constRender); // tells browser animation is to be performed
    var delta = clock.getDelta();
    if (mixer) mixer.update(delta);
  
    if (!skipIntro) {
        if (orbitBool) runSolarSystem(solarSystem, 5, [0.002, 0.001, 0.003], ringRots, planetSpeeds, regions);
        if (spaceship) runSpaceShip(stage);
        if (stage == 2) initialZoom();
        if (stage == 3) {
            if (controls.enabled == false) {
                spaceship.position.set(75, -15, 3);
                spaceship.rotation.x = Math.PI/2;
                spaceship.rotation.y = Math.PI;
            }
            controls.enabled = true;
            instruction1(instructions1Stage);
            shipToCursor(destPlanet, shipToCursorState);
        }
    } else {
        if (skipIntroHelper) {
            scene.remove(spaceshipLight);
            camera.position.setZ(40);
            instructions1Stage = 1;
            skipIntroHelper = false;
        }
        if (a < 100) a++;
        if (a == 5) {
            spaceship.position.set(75, -15, 3);
            spaceship.rotation.x = Math.PI/2;
            spaceship.rotation.y = Math.PI;
        } else if (a > 5) {

        //------- Testing -------//

            //window.location.href = 'contacts.html';
            shipToCursor(destPlanet, shipToCursorState);









        
        
        //-----------------------//
        }
        controls.enabled = true;
        if (orbitBool) runSolarSystem(solarSystem, 5, [0.002, 0.001, 0.003], ringRots, planetSpeeds, regions);
        instruction1(instructions1Stage);
        stage = 3;
    }

    controls.update();
    renderer.render(scene, camera);
}
constRender();
