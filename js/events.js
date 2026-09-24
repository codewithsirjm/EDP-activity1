/*
 * events.js — Event handlers for the Socorro mini map (DEMO COMPLETE)
 *
 * Instructor showcase build: STEP 1–7 + full activity modifications enabled.
 * Students still learn by uncommenting in their own forks — this copy is the
 * finished target they can see and play.
 *
 * Pattern:
 *   1. EVENT FIRES  — user clicks, moves mouse, resizes, presses a key
 *   2. LISTEN       — addEventListener in main.js
 *   3. HANDLE       — functions below run your response code
 */

let selected = null;
let hovered = null;

/* ================================================================== STEP 1 */
function paintBuilding(mesh, color) {
  mesh.material.color.setHex(color);
}

/* ================================================================== STEP 2 */
function resetHud() {
  edpHud.innerHTML =
    '<strong>Socorro Mini Map — Activity Demo</strong>' +
    'Click a building · Hover to preview · <kbd>R</kbd> reset · <kbd>B</kbd> night · Double-click for details';
}

/* ================================================================== STEP 3 */
function onMouseMove(event) {
  edpMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  edpMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

globalThis.onMouseMove = onMouseMove;

/* ================================================================== STEP 4 + ACTIVITY
 * Click selects a building, paints gold, and shifts water/grass colors.
 * ================================================================== */
function onClick() {
  edpRaycaster.setFromCamera(edpMouse, edpCamera);
  const hits = edpRaycaster.intersectObjects(edpBuildings, false);

  if (selected) {
    paintBuilding(selected, selected.userData.baseColor);
  }

  selected = hits.length ? hits[0].object : null;

  if (selected) {
    highlightSurroundings(selected);
  } else {
    resetHud();
    resetSurroundings();
  }
}

globalThis.onClick = onClick;

/* ================================================================== STEP 5 */
function onResize() {
  edpCamera.aspect = window.innerWidth / window.innerHeight;
  edpCamera.updateProjectionMatrix();
  edpRenderer.setSize(window.innerWidth, window.innerHeight);
}

globalThis.onResize = onResize;

/* ================================================================== STEP 6
 * Hover preview — purple highlight (activity color customization).
 * ================================================================== */
function updateHover() {
  edpRaycaster.setFromCamera(edpMouse, edpCamera);
  const hoverHits = edpRaycaster.intersectObjects(edpBuildings, false);
  const nextHovered = hoverHits.length ? hoverHits[0].object : null;

  if (hovered && hovered !== selected) {
    paintBuilding(hovered, hovered.userData.baseColor);
  }

  hovered = nextHovered;

  if (hovered && hovered !== selected) {
    paintBuilding(hovered, 0x7dd3fc);
  }

  edpRenderer.domElement.style.cursor = hovered ? 'pointer' : 'default';
}

globalThis.updateHover = updateHover;

/* ================================================================== STEP 7 + ACTIVITY
 * R — clear selection + surroundings
 * B — day / night toggle
 * ================================================================== */
function onKeyDown(event) {
  if (event.code === 'KeyB') {
    toggleNightMode();
    return;
  }

  if (event.code !== 'KeyR') return;

  if (selected) {
    paintBuilding(selected, selected.userData.baseColor);
    selected = null;
  }

  if (hovered) {
    paintBuilding(hovered, hovered.userData.baseColor);
    hovered = null;
  }

  resetHud();
  resetSurroundings();
  edpRenderer.domElement.style.cursor = 'default';
}

globalThis.onKeyDown = onKeyDown;

/* ================================================================== ACTIVITY · dblclick
 * New event — double-click a building for a detail message in the HUD.
 * ================================================================== */
function onDoubleClick() {
  edpRaycaster.setFromCamera(edpMouse, edpCamera);
  const hits = edpRaycaster.intersectObjects(edpBuildings, false);
  if (!hits.length) return;

  const building = hits[0].object;
  edpHud.innerHTML =
    '<strong>' + building.userData.name + ' · details</strong>' +
    'Double-click → <code>dblclick</code> listener → handler → HUD update.<br>' +
    '<em>Same Fire → Listen → Handle pattern as click.</em>';
}

globalThis.onDoubleClick = onDoubleClick;

/* ================================================================== EXAMPLE / ACTIVITY HELPERS */
const defaultSurroundings = {
  water: 0x143d5c,
  island: 0x2d6a3e,
  sky: 0x0a1628,
  fog: 0x0a1628,
};

let nightMode = false;

function highlightSurroundings(building) {
  paintBuilding(building, 0xfbbf24);
  edpWater.material.color.setHex(0x1e6091);
  edpIsland.material.color.setHex(0x52b788);
  edpHud.innerHTML =
    '<strong>Selected: ' + building.userData.name + '</strong>' +
    'Gold highlight · water &amp; grass updated · press <kbd>R</kbd> to reset · <kbd>B</kbd> for night';
}

function resetSurroundings() {
  edpWater.material.color.setHex(defaultSurroundings.water);
  edpIsland.material.color.setHex(defaultSurroundings.island);
  if (!nightMode) {
    edpScene.background = new THREE.Color(defaultSurroundings.sky);
    edpScene.fog.color.setHex(defaultSurroundings.fog);
  }
}

function toggleNightMode() {
  nightMode = !nightMode;
  if (nightMode) {
    edpScene.background = new THREE.Color(0x020617);
    edpScene.fog.color.setHex(0x020617);
    edpSun.intensity = 0.35;
    if (globalThis.edpSunSprite) edpSunSprite.visible = false;
    if (globalThis.edpMoonSprite) edpMoonSprite.visible = true;
    edpHud.innerHTML =
      '<strong>Night mode</strong> Press <kbd>B</kbd> for day · <kbd>R</kbd> resets selection.';
  } else {
    edpScene.background = new THREE.Color(defaultSurroundings.sky);
    edpScene.fog.color.setHex(defaultSurroundings.fog);
    edpSun.intensity = 1.5;
    if (globalThis.edpSunSprite) edpSunSprite.visible = true;
    if (globalThis.edpMoonSprite) edpMoonSprite.visible = false;
    resetHud();
  }
}
