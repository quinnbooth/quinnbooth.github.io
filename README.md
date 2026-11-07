# quinnbooth.github.io

My personal site: a small solar system where every planet is a part of my
life. Fly my ship to a planet and it lands, and what's there opens in a panel
beside it. You never leave the system.

**Live:** https://quinnbooth.github.io

- **The sun** is me (it's my website).
- **Inner planets** are where I've worked and done research.
- **The gas giant** is projects, one moon per project.
- **Further out:** education, music (the rings ripple with whatever recording you play), and a blinking contact beacon.

Every planet is drawn procedurally in GLSL; there are no texture files. The
ship is a model I made in Blender for the first version of this site.

## Running it

```sh
npm install
npm run dev       # http://localhost:5173
npm run build     # production build into dist/
npm run preview   # serve the build locally
```

Deep links work: `/#/projects` skips the intro and flies straight there.

## Editing content

Nearly everything lives in **`src/content/bodies.js`**. Each entry is one
planet: its hover preview, its look, its orbit, and the sections of its panel.
Add an entry and you've added a planet. Labels, the system index, previews,
and prev/next navigation all update on their own. Names and links shared
across the site live in `src/content/site.js`.

## How it's put together

```
src/
  main.js              App state: intro → explore → fly → land. Wires the world to the UI.
  content/             All the words. Edit these, not the code.
  world/               Three.js, no DOM.
    World.js           Renderer, bloom, camera choreography, picking
    CameraRig.js       Damped spherical camera; drag, wheel and pinch input
    Ship.js            Loads the Blender ship; time-based flight and parking
    Planet.js          Orbit, spin, atmosphere, rings, moons
    Sun.js, Sky.js     Sun, starfield, galactic dust
    shaders/           GLSL: simplex noise and the planet surfaces
  ui/                  DOM overlays: panel, labels, hover card, index, audio, form
  styles/              base (tokens, type) · hud (overlays) · panel
public/                Served as-is: ship model, audio, photos, résumé
art/blender/           Source .blend files for the ship
```

A few decisions worth knowing about:

- **Frame-rate independence.** All motion is driven by elapsed time (exponential
  damping and time-parameterized curves), never "+= N per frame", so it runs at
  the same speed on a 60 Hz laptop and a 144 Hz monitor.
- **The ship always arrives.** A flight is a Bézier curve that runs from 0 to 1
  over a fixed duration, and its endpoint is re-read from the planet's current
  position every frame. A moving planet can't outrun it.
- **Calm while reading.** When you land, the orbits slow almost to a stop and
  the camera offsets so the planet sits beside the panel, not under it.
- **Accessible without the 3D.** Planet labels and the index are real buttons,
  the panel is keyboard-navigable (Esc closes, ←/→ move between planets), and
  if WebGL isn't available the index alone still opens every panel.

## Deploying

Pushing to `main` builds and deploys through GitHub Actions
(`.github/workflows/deploy.yml`). In the repo settings, *Pages → Source* must be
set to **GitHub Actions**.

### Résumé auto-update

The deploy pulls the latest résumé PDF from wherever it lives, and the résumé
repo can trigger a redeploy whenever it changes. Setup is in
[`docs/resume-sync.md`](docs/resume-sync.md).
