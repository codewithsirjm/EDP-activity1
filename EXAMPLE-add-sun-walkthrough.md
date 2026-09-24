# Example: Visible Sun & Moon

Night mode already dims the **light**. This example adds a **visible sun** (day) and **moon** (night) in the sky so students can see the toggle, not just feel darker lighting.

**Files you edit:** `js/scene.js` · `js/main.js` · `js/events.js` (`toggleNightMode`)

**Prerequisite:** STEP 1–7 working. Night mode with **B** is even better (see **[EXAMPLE-modification-walkthrough.md](./EXAMPLE-modification-walkthrough.md)**).

---

## What you will build

| Action | Result |
|---|---|
| Load the map | A **sun** sits in the upper sky (not on the grass) |
| Press **B** | Sky darkens, sun hides, **moon** appears |
| Press **B** again | Day returns — sun back, moon hidden |

This counts as a **visible color / sky change** plus the **B** key event.

---

## Why a world-position sun disappears

The camera **looks down** at the island. A sphere at a high `y` is often **above the view**, so you only see a glow on the ground.

The fix: keep sun/moon in **camera space** (left / up / forward of the camera) and update them every frame.

---

## Step 1 — Draw the sun and moon in `scene.js`

After the `DirectionalLight` (`edpSun`), add sprites that always face the camera.

```javascript
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
  skyBodyOffset.set(-16, 19, -42); // left, up, forward (camera space)
  skyBodyOffset.applyQuaternion(camera.quaternion);
  sunSprite.position.copy(camera.position).add(skyBodyOffset);
  moonSprite.position.copy(sunSprite.position);
}

globalThis.edpSunSprite = sunSprite;
globalThis.edpMoonSprite = moonSprite;
globalThis.edpPlaceSkyBodies = placeSkyBodies;
```

`depthTest: false` keeps the disc in the sky instead of hiding under the island.

To move it **higher**, increase the middle number (`19`). Too high and it clips off the top of the screen.

---

## Step 2 — Update position every frame in `main.js`

Inside `animate()`, **after** `lookAt`:

```javascript
if (typeof edpPlaceSkyBodies === 'function') edpPlaceSkyBodies();
```

The camera orbits, so the sun must move with it or it will drift off-screen.

---

## Step 3 — Swap sun / moon in `toggleNightMode`

In `js/events.js`:

```javascript
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
```

---

## Step 4 — Test checklist

- [ ] Sun is visible in the **upper sky**, not sitting on a rooftop  
- [ ] Press **B** → moon appears, sun hides, sky darkens  
- [ ] Press **B** again → sun returns  
- [ ] Camera orbit does not lose the sun  
- [ ] F12 Console → no red errors  

---

## Make it yours

| Change | Where |
|---|---|
| Bigger sun | `makeSkySprite(..., 14)` |
| Higher in the sky | `skyBodyOffset.set(-16, 22, -42)` |
| Sunset orange sun | `'#ff7b00'` inner color |
| Different night key | `KeyN` instead of `KeyB` |

---

## If something breaks

| Problem | Fix |
|---|---|
| Glow on the grass, no disc | Camera looks down — use `placeSkyBodies()`, do not park a sphere at high world `y` |
| Sun at building height | Increase the **up** value (`19`) in `skyBodyOffset.set` |
| Sun missing after orbit | Call `edpPlaceSkyBodies()` after `lookAt` in `animate()` |
| B darkens sky but no moon | Set `edpMoonSprite.visible = true` inside night mode |
| `edpPlaceSkyBodies is not defined` | Export it on `globalThis` in `scene.js` |

Related:

- Night mode wiring: **[EXAMPLE-modification-walkthrough.md](./EXAMPLE-modification-walkthrough.md)**
- Rubric: **[activity-island-modifications.md](./activity-island-modifications.md)**
