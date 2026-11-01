/**
 * The purple wireframe dragon that follows you down the home page.
 *
 * HOW IT MOVES
 * Each section of the page can have a "keyframe" below: a position, rotation and size
 * for the dragon. While you scroll between two sections the dragon glides smoothly
 * from one keyframe to the next.
 *
 * ADDING A NEW SECTION
 * You don't need to touch this file. A section with no keyframe simply uses OFFSCREEN
 * (the dragon waits above the screen). If you want the dragon to appear next to a new
 * section, add an entry to KEYFRAMES using that section's id.
 *
 * TUNING A KEYFRAME
 * Open the home page with ?debug in the address (e.g. index.html?debug). That loads
 * dev/dragon-debug.js, a small tool for dragging the dragon around and copying the numbers.
 *
 * Requires three.js + GLTFLoader (loaded in index.html from assets/vendor/).
 */

const MODEL_URL = 'assets/models/dragon.glb';
const SMOOTHING = 0.05; // 0 = never moves, 1 = jumps instantly

const OFFSCREEN = {
  position: { x: 0.92, y: 50, z: -1.01 },
  rotation: { x: 0.45, y: 5.54, z: -0.26 },
  scale: 3.25,
};

const FLY_AWAY = {
  position: { x: 500, y: -12.33, z: -1.79 },
  rotation: { x: 0.04, y: 5.99, z: 0.15 },
  scale: 8.53,
};

export const KEYFRAMES = {
  home: {
    position: { x: 6.4, y: -0.3, z: -1.01 },
    rotation: { x: 16.28, y: 10.61, z: 2.87 },
    scale: 3.25,
  },
  skills: { ...OFFSCREEN, rotation: { x: 1, y: 5.54, z: -0.26 } },
  about: {
    position: { x: 81.12, y: -21.29, z: -24.23 },
    rotation: { x: 2.15, y: -1.26, z: 1.94 },
    scale: 37.25,
  },
  certificates: FLY_AWAY,
  contact: FLY_AWAY,
};

const lerp = (a, b, t) => a + (b - a) * t;

/** Like lerp, but takes the short way around the circle. */
function lerpAngle(a, b, t) {
  let diff = b - a;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return a + diff * t;
}

/**
 * Starts the dragon. Returns a small controller (used by the debug tool),
 * or null if it can't run (no WebGL, no container, or three.js failed to load).
 */
export function initDragon() {
  const THREE = window.THREE;
  const container = document.getElementById('model-container');
  if (!THREE || !THREE.GLTFLoader || !container) return null;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true });
  } catch (error) {
    console.warn('WebGL is not available, skipping the dragon.', error);
    return null;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 12;
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0x404040, 2));
  const sun = new THREE.DirectionalLight(0xffffff, 2);
  sun.position.set(1, 1, 1);
  scene.add(sun);
  const fill = new THREE.PointLight(0xffffff, 1);
  fill.position.set(-1, -1, 1);
  scene.add(fill);

  let model = null;
  new THREE.GLTFLoader().load(
    MODEL_URL,
    (gltf) => {
      model = gltf.scene;
      model.traverse((child) => {
        if (!child.isMesh) return;
        child.material = new THREE.MeshBasicMaterial({
          color: 0x8b5cf6,
          wireframe: true,
          transparent: true,
          opacity: 0.8,
        });
      });
      scene.add(model);
    },
    undefined,
    (error) => console.error('Could not load the dragon model:', error)
  );

  // Sections in page order. Their top edges are measured once and re-measured when the layout changes
  // (reading offsetTop every frame would force the browser to recalculate layout 60 times a second).
  const sections = [...document.querySelectorAll('main > section[id]')];
  const ids = sections.map((section) => section.id);
  let tops = [];
  const measure = () => { tops = sections.map((section) => section.offsetTop); };
  measure();
  window.addEventListener('load', measure);
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.body);

  const keyframeFor = (id) => KEYFRAMES[id] ?? OFFSCREEN;

  /** Which two sections we are between, and how far (0 to 1) from the first to the second. */
  function scrollProgress() {
    const y = window.scrollY;
    let from = 0;
    let to = 1;
    let t = 0;

    for (let i = 0; i < ids.length - 1; i++) {
      if (y >= tops[i] && y < tops[i + 1]) {
        from = i;
        to = i + 1;
        t = (y - tops[i]) / (tops[i + 1] - tops[i]);
        break;
      }
      if (i === ids.length - 2 && y >= tops[i + 1]) {
        from = to = i + 1;
        t = 0;
      }
    }
    return { from: keyframeFor(ids[from]), to: keyframeFor(ids[to]), t };
  }

  // The values the dragon is actually drawn with right now (they chase the target smoothly).
  const start = keyframeFor(ids[0]);
  const state = {
    px: start.position.x, py: start.position.y, pz: start.position.z,
    rx: start.rotation.x, ry: start.rotation.y, rz: start.rotation.z,
    sc: start.scale,
  };

  const controller = {
    renderer,
    state,
    manualOverride: false, // the debug tool sets this to take over from the scroll animation
    getModel: () => model,
  };

  function frame() {
    requestAnimationFrame(frame);

    if (model && !controller.manualOverride) {
      const { from, to, t } = scrollProgress();

      state.px = lerp(state.px, lerp(from.position.x, to.position.x, t), SMOOTHING);
      state.py = lerp(state.py, lerp(from.position.y, to.position.y, t), SMOOTHING);
      state.pz = lerp(state.pz, lerp(from.position.z, to.position.z, t), SMOOTHING);
      state.rx = lerpAngle(state.rx, lerpAngle(from.rotation.x, to.rotation.x, t), SMOOTHING);
      state.ry = lerpAngle(state.ry, lerpAngle(from.rotation.y, to.rotation.y, t), SMOOTHING);
      state.rz = lerpAngle(state.rz, lerpAngle(from.rotation.z, to.rotation.z, t), SMOOTHING);
      state.sc = lerp(state.sc, lerp(from.scale, to.scale, t), SMOOTHING);

      model.position.set(state.px, state.py, state.pz);
      model.rotation.set(state.rx, state.ry, state.rz);
      model.scale.set(state.sc, state.sc, state.sc);
    }

    renderer.render(scene, camera);
  }
  frame();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return controller;
}
