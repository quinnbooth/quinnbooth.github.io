import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js'

// For testing/troubleshooting
// npm run dev: hosts local site
// https://jsfiddle.net/

// In order to get the site working on github, do the following in sequence:
// npm run build: readies website for commit
// Commit and Push to GitHub
// npm run deploy: links http://quinnbooth.github.io to index.html file in dist directory (will take a few minutes after it says it's complete in terminal to load online)
// More information: https://sbcode.net/threejs/github-pages/

//================================================================================================================

// Setup render
var fov = 75;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000); // (FOV, Aspect Ratio based on user's browser window, (View Frustrum: 1st arg is how close to camera user can see, 2nd is how far))
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight); // make fullscreen canvas
camera.position.setZ(30);
renderer.render(scene, camera);
var visibleHeight = 2 * Math.tan((camera.fov * Math.PI / 180 /*vertical fov*/) / 2) * camera.position.z;
var visibleWidth = visibleHeight * camera.aspect;

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
        scene.background = spaceBkgd;
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

// Runs constant animation of scene in browser
var a = 0;
function constRender() {
    requestAnimationFrame(constRender); // tells browser animation is to be performed
    a++;
    if (a < 100) {
        runSolarSystem(solarSystem, 5, [0.002, 0.001, 0.003], ringRots, planetSpeeds, regions);
    } else if (a == 101) {
        runSolarSystem(2, 5, [0.002, 0.001, 0.003], ringRots, planetSpeeds, regions);
        a = 0;
    }
    renderer.render(scene, camera);
}
constRender();
