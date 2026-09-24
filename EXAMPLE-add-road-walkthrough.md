# Example: Add a Road

A **path** is a flat brown plane. A **road** is the same idea plus asphalt color and a dashed center line — still just `PlaneGeometry` + a `Group`.

**Files you edit:** `js/scene.js` only

**Prerequisite:** you can add a building or a path (see **[EXAMPLE-add-props-walkthrough.md](./EXAMPLE-add-props-walkthrough.md)**).

---

## What you will build

| Action | Result |
|---|---|
| Call `makeRoad(...)` | A dark asphalt strip appears on the grass |
| Dashed yellow line | Center markings along the road |
| Second call with `alongX: true` | A crossing street (intersection) |

Same recipe as water and paths: **flat plane + rotate it onto the ground**.

---

## How a road is built

```
Group (the whole road — move this with x / z)
 ├── asphalt   PlaneGeometry  color 0x3f3f46
 └── dashes    small planes   color 0xfbbf24
```

| Property | Meaning |
|---|---|
| `x`, `z` | Center of the road on the island |
| `length` | How long the road is |
| `width` | How wide the road is |
| `alongX` | `false` = runs north/south (along **z**). `true` = runs east/west (along **x**) |

`y` is automatic — the road sits just above the grass (`0.06`) so it is not hidden.

---

## Step 1 — Add `makeRoad` in `scene.js`

Put this next to `makePath` (bottom of `js/scene.js`):

```javascript
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
```

| Line | Meaning |
|---|---|
| `rotation.x = -Math.PI / 2` | Lay the plane flat (same as water) |
| `Group` | Asphalt + dashes move together |
| `alongX` + `rotation.y` | Turn the whole road to run left/right |

---

## Step 2 — Place a road (exact example)

After your trees / paths, add:

```javascript
makeRoad(0, 1, 24, 3.4, false);
```

That is a north–south street through the village:

- center at `x: 0`, `z: 1`
- `24` long, `3.4` wide
- `false` → along **z** (toward the camera / back of the island)

Save → refresh. You should see dark asphalt with yellow dashes.

---

## Step 3 — Add a crossing street

```javascript
makeRoad(1, 2, 22, 3.2, true);
```

`true` rotates the group 90°, so this road runs along **x** (left / right) and crosses the first one.

---

## Step 4 — Test checklist

- [ ] Road is visible on the grass (not underwater, not floating)  
- [ ] Yellow dashes run down the middle  
- [ ] Second road crosses the first if you added it  
- [ ] Buildings still clickable  
- [ ] F12 Console → no red errors  

---

## Make it YOUR road

| Change | How |
|---|---|
| Move it | Change `x` and `z` |
| Longer / shorter | Change `length` |
| Wider highway | `width: 5` |
| White dashes | `0xf8fafc` instead of `0xfbbf24` |
| Only one street | Delete the `alongX: true` call |

Keep `x` / `z` about **-28 to 28** so the road stays on the island.

---

## If something breaks

| Problem | Fix |
|---|---|
| Invisible road | Need `rotation.x = -Math.PI / 2` and `y` slightly above `0` |
| Road in the water | Bring `x` / `z` closer to `0` |
| Dashes missing | Check the `for` loop is inside `makeRoad` and dashes use `y: 0.07` |
| Road runs the wrong way | Flip `alongX` (`false` = along z, `true` = along x) |
| Covers a building | Nudge `x` or `z` so it runs beside the box, not through it |

---

## Instructor note

A road is **not** a new Three.js feature. Students already know:

1. `PlaneGeometry` + rotate (water / path)
2. `Group` to combine parts (tree)
3. `x` / `z` placement (buildings)

Dashed lines are just a `for` loop of smaller planes.

Related:

- Paths / trees / birds: **[EXAMPLE-add-props-walkthrough.md](./EXAMPLE-add-props-walkthrough.md)**
- Buildings: **[EXAMPLE-add-building-walkthrough.md](./EXAMPLE-add-building-walkthrough.md)**
- Rubric: **[activity-island-modifications.md](./activity-island-modifications.md)**
