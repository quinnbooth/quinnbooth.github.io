import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js'

// For testing/troubleshooting
// npm run dev: hosts local site
// https://jsfiddle.net/

// In order to get the site working on github, do the following in sequence:
// npm run build: readies website for commit
// Commit and Push to GitHub
// npm run deploy: links http://quinnbooth.github.io to index.html file in dist directory (will take a few minutes after it says it's complete in terminal to load online)
// More information: https://sbcode.net/threejs/github-pages/

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

var maxDimension = window.innerWidth;
if (window.innerHeight < maxDimension) {
    maxDimension = window.innerHeight;
}
const ringRadius = maxDimension / 250;

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

function pointOnCircle(radius) {
    var angle = 2 * Math.PI * Math.random();
    return [radius * Math.cos(angle), radius * Math.sin(angle)];
}

var currentRadius = ringRadius;
const planets = [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune];
const ringedPlanets = [jupiter, saturn, uranus, neptune];
const rings = [jupiterRing, saturnRing, uranusRing, neptuneRing];
for (const planet of planets) {
    var coordinates = pointOnCircle(currentRadius);
    planet.position.x = coordinates[0];
    planet.position.y = coordinates[1];
    currentRadius += ringRadius;
    scene.add(planet);
}
scene.add(sun);

for (const ring of rings) {
    scene.add(ring);
}

function rotateMesh(mesh, x, y, z) {
    mesh.rotation.x += x;
    mesh.rotation.y += y;
    mesh.rotation.z += z;
}

function matchCoords(ring, planet) {
    ring.position.x = planet.position.x;
    ring.position.y = planet.position.y;
}

const jupiterRingRotations = [.005 * Math.random(), .005 * Math.random(), .005 * Math.random()];
const saturnRingRotations = [.005 * Math.random(), .005 * Math.random(), .005 * Math.random()];
const uranusRingRotations = [.005 * Math.random(), .005 * Math.random(), .005 * Math.random()];
const neptuneRingRotations = [.005 * Math.random(), .005 * Math.random(), .005 * Math.random()];
const ringRotations = [jupiterRingRotations, saturnRingRotations, uranusRingRotations, neptuneRingRotations];

const planetBools = [0, 1, 0, 0, 1, 0, 0, 0];
var planetSpeeds = [0, 0, 0, 0, 0, 0, 0, 0];
for (let i = 0; i < 8; i++) {
    planetSpeeds[i] = .005 * Math.random();
}

function orbitMesh(planet, speed, region) {
    var x = planet.position.x;
    var y = planet.position.y;
    var radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    var angle = Math.acos(x / radius);
    if (region == 0) {
        angle = Math.acos(x / radius);
    } else {
        angle = -1 * Math.acos(x / radius);
    }
    //console.log(angle);
    angle += speed;
    planet.position.x = radius * Math.cos(angle);
    planet.position.y = radius * Math.sin(angle);
    if (Math.abs(angle - Math.PI) < speed) {
        //console.log(region);
        angle = Math.PI + 0.001;
        if (region == 0){
            return 1;
        } else {
            return 0;
        }
    }
    if (Math.abs(angle) < speed) {
        //console.log(region);
        angle = 0 + 0.001;
        if (region == 0){
            return 1;
        } else {
            return 0;
        }
    }
    return region;
}

// Runs constant animation of scene in browser
function constRender() {
    requestAnimationFrame(constRender); // tells browser animation is to be performed
    //var currentRadius = 0;
    rotateMesh(sun, 0.002, 0.001, 0.003);
    for (let i = 0; i < 8; i++) {
        planetBools[i] = orbitMesh(planets[i], planetSpeeds[i], planetBools[i]);
        rotateMesh(planets[i], 0.002, 0.001, 0.003);
        //currentRadius += ringRadius;
    }
    console.log(planetBools);
    for (let i = 0; i < 4; i++) {
        matchCoords(rings[i], ringedPlanets[i]);
        rotateMesh(rings[i], ringRotations[i][0], ringRotations[i][1], ringRotations[i][2]);
    }

    renderer.render(scene, camera);
}
constRender();
