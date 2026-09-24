/*
 * scene.js — 3D world setup (PROVIDED)
 *
 * You do not need to edit this file for the basic lab.
 * It creates: scene, camera, renderer, island, water, and building meshes.
 *
 * buildings[] is exported on globalThis so events.js can use it for raycasting.
 * edpIsland, edpWater, edpSun are exported for the customization activity.
 */

const hud = document.getElementById('hud');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a1628);
scene.fog = new THREE.Fog(0x0a1628, 55, 180);

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.5,
  300
);
camera.position.set(28, 32, 40);
camera.lookAt(0, 2, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const sun = new THREE.DirectionalLight(0xfff0d0, 1.5);
sun.position.set(-65, 105, -55);
sun.target.position.set(0, 0, 0);
sun.castShadow = true;
scene.add(sun);
scene.add(sun.target);
scene.add(new THREE.AmbientLight(0x406080, 0.55));

function makeSkySprite(innerColor, outerColor, size) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, innerColor);
  grad.addColorStop(0.35, outerColor);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      fog: false,
      depthTest: false,
      depthWrite: false,
    })
  );
  sprite.scale.set(size, size, 1);
  sprite.renderOrder = 999;
  return sprite;
}

const sunSprite = makeSkySprite('#fff4c2', '#ffb347', 10);
scene.add(sunSprite);

const moonSprite = makeSkySprite('#f1f5f9', '#94a3b8', 8);
moonSprite.visible = false;
scene.add(moonSprite);

const skyBodyOffset = new THREE.Vector3();

function placeSkyBodies() {
  skyBodyOffset.set(-16, 19, -42);
  skyBodyOffset.applyQuaternion(camera.quaternion);
  sunSprite.position.copy(camera.position).add(skyBodyOffset);
  moonSprite.position.copy(sunSprite.position);
}

/* Island size: CylinderGeometry(topRadius, bottomRadius, height, segments)
 * Bigger numbers = more room for buildings / trees / paths.
 * Safe building range is roughly ±(topRadius - 8), currently about -28 to 28.
 */
const island = new THREE.Mesh(
  new THREE.CylinderGeometry(36, 40, 1.2, 48),
  new THREE.MeshStandardMaterial({ color: 0x2d6a3e, roughness: 0.92 })
);
island.position.y = -0.6;
island.receiveShadow = true;
scene.add(island);

const water = new THREE.Mesh(
  new THREE.PlaneGeometry(160, 160),
  new THREE.MeshStandardMaterial({ color: 0x143d5c, roughness: 0.35, metalness: 0.15 })
);
water.rotation.x = -Math.PI / 2;
water.position.y = -0.8;
scene.add(water);

const buildings = [];

const grid = new THREE.GridHelper(72, 36, 0x7dd3fc, 0x1e3a5f);
grid.position.y = 0.02;
scene.add(grid);

const axes = new THREE.AxesHelper(24);
axes.position.y = 0.05;
scene.add(axes);

function makeAxisLabel(text, colorHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#' + colorHex.toString(16).padStart(6, '0');
  ctx.font = 'bold 36px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 64, 32);
  const texture = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false })
  );
  sprite.scale.set(4, 2, 1);
  sprite.position.y = 1.2;
  return sprite;
}

const labelPX = makeAxisLabel('+X', 0xff6b6b);
labelPX.position.set(28, 1.2, 0);
scene.add(labelPX);

const labelNX = makeAxisLabel('-X', 0xff6b6b);
labelNX.position.set(-28, 1.2, 0);
scene.add(labelNX);

const labelPZ = makeAxisLabel('+Z', 0x60a5fa);
labelPZ.position.set(0, 1.2, 28);
scene.add(labelPZ);

const labelNZ = makeAxisLabel('-Z', 0x60a5fa);
labelNZ.position.set(0, 1.2, -28);
scene.add(labelNZ);

/*
 * MAP LEGEND — also shown in the UI (#map-legend) and as grid / axis labels.
 * Building positions use x and z (not y). y is automatic (height / 2).
 * Keep x/z about -28 to 28. Colors: CSS #4ade80 → JS 0x4ade80
 * See EXAMPLE-add-building-walkthrough.md
 */
const spots = [
  { name: 'Town Hall', color: 0xe8dcc8, x: -5, z: 3, w: 4, h: 4, d: 3 },
  { name: 'Church', color: 0xd4c4a8, x: 2, z: 1, w: 3.5, h: 6, d: 3.5 },
  { name: 'Market', color: 0xc8b090, x: 6, z: 4, w: 3, h: 3, d: 4 },
  { name: 'Pier', color: 0x8a7858, x: 11, z: -5, w: 5, h: 1.5, d: 2 },
  { name: 'School', color: 0xf0e8d8, x: -1, z: 6, w: 4, h: 3.5, d: 3 },
  { name: 'Library', color: 0xb8c4d8, x: 4, z: -2, w: 3, h: 4, d: 3 },
  { name: 'Cafe', color: 0xfbbf24, x: -10, z: 8, w: 3, h: 2.8, d: 3 },
  { name: 'Clinic', color: 0x7dd3fc, x: 10, z: 6, w: 3.5, h: 3.2, d: 3 },
];

spots.forEach((spot) => {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(spot.w, spot.h, spot.d),
    new THREE.MeshStandardMaterial({ color: spot.color, roughness: 0.88 })
  );
  mesh.position.set(spot.x, spot.h / 2, spot.z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData = { isBuilding: true, name: spot.name, baseColor: spot.color };
  scene.add(mesh);
  buildings.push(mesh);
});

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(-9999, -9999);

globalThis.edpScene = scene;
globalThis.edpCamera = camera;
globalThis.edpRenderer = renderer;
globalThis.edpBuildings = buildings;
globalThis.edpRaycaster = raycaster;
globalThis.edpMouse = mouse;
globalThis.edpHud = hud;
globalThis.edpIsland = island;
globalThis.edpWater = water;
globalThis.edpSun = sun;
globalThis.edpSunSprite = sunSprite;
globalThis.edpMoonSprite = moonSprite;
globalThis.edpPlaceSkyBodies = placeSkyBodies;

/* ================================================================== EXAMPLE PROPS (ENABLED — demo complete)
 * Trees, birds, paths — same Mesh recipe as buildings, different shapes.
 * Follow EXAMPLE-add-props-walkthrough.md for the student enable path.
 * ================================================================== */

const edpBirds = [];

function makeTree(x, z) {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.35, 2, 8),
    new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.95 })
  );
  trunk.position.y = 1;
  trunk.castShadow = true;

  const leaves = new THREE.Mesh(
    new THREE.ConeGeometry(1.2, 2.5, 8),
    new THREE.MeshStandardMaterial({ color: 0x2d6a3e, roughness: 0.9 })
  );
  leaves.position.y = 3.1;
  leaves.castShadow = true;

  const tree = new THREE.Group();
  tree.add(trunk);
  tree.add(leaves);
  tree.position.set(x, 0, z);
  scene.add(tree);
  return tree;
}

function makePath(x, z, w, d) {
  const path = new THREE.Mesh(
    new THREE.PlaneGeometry(w, d),
    new THREE.MeshStandardMaterial({ color: 0x8a7858, roughness: 1 })
  );
  path.rotation.x = -Math.PI / 2;
  path.position.set(x, 0.05, z);
  path.receiveShadow = true;
  scene.add(path);
  return path;
}

function makeRoad(x, z, length, width, alongX) {
  const road = new THREE.Group();
  const asphalt = new THREE.Mesh(
    new THREE.PlaneGeometry(width, length),
    new THREE.MeshStandardMaterial({ color: 0x3f3f46, roughness: 1 })
  );
  asphalt.rotation.x = -Math.PI / 2;
  asphalt.position.y = 0.06;
  asphalt.receiveShadow = true;
  road.add(asphalt);

  const dashMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 1 });
  const gap = 2.4;
  const dashCount = Math.max(1, Math.floor(length / gap));
  const start = -length / 2 + gap / 2;
  for (let i = 0; i < dashCount; i++) {
    const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 1.1), dashMat);
    dash.rotation.x = -Math.PI / 2;
    dash.position.set(0, 0.07, start + i * gap);
    road.add(dash);
  }

  if (alongX) road.rotation.y = Math.PI / 2;
  road.position.set(x, 0, z);
  scene.add(road);
  return road;
}

function makeBird(x, y, z) {
  const feather = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.75 });
  const beakMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.7 });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), feather);
  body.scale.set(1.2, 0.85, 1);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), feather);
  head.position.set(0.28, 0.06, 0);

  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.18, 6), beakMat);
  beak.rotation.z = -Math.PI / 2;
  beak.position.set(0.42, 0.04, 0);

  const leftWing = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.04, 0.28), feather);
  leftWing.position.set(0, 0.05, 0.32);
  leftWing.rotation.x = 0.15;
  leftWing.rotation.z = 0.35;

  const rightWing = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.04, 0.28), feather);
  rightWing.position.set(0, 0.05, -0.32);
  rightWing.rotation.x = -0.15;
  rightWing.rotation.z = -0.35;

  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.28, 6), feather);
  tail.rotation.z = Math.PI / 2;
  tail.position.set(-0.32, 0, 0);

  const bird = new THREE.Group();
  bird.add(body, head, beak, leftWing, rightWing, tail);
  bird.position.set(x, y, z);
  bird.userData.leftWing = leftWing;
  bird.userData.rightWing = rightWing;
  scene.add(bird);
  edpBirds.push(bird);
  return bird;
}

globalThis.edpBirds = edpBirds;

makeTree(8, -3);
makeTree(-8, 2);
makeTree(5, 8);
makeTree(-14, -4);
makeTree(12, -8);
makePath(0, -2, 4, 10);
makePath(-6, 4, 3, 8);
makeRoad(0, 1, 24, 3.4, false);
makeRoad(1, 2, 22, 3.2, true);
makeBird(-6, 6, 24);
makeBird(3, 7, -15);
makeBird(10, 8, 2);


