# Example: Trees, Birds & Surfaces (Three.js basics)

Students often ask: *“How do we add birds, trees, or a path — not just buildings?”*

**Answer:** you already know the recipe. A building is a **box**. A tree is a **cylinder + cone**. A bird is a **small box** that moves. A path is a **flat plane**. Same JavaScript pattern — different shapes.

**Files you edit:** `js/scene.js` (create objects) · optionally `js/main.js` (move birds each frame)

**Prerequisite:** you understand the building `spots` loop (see **[EXAMPLE-add-building-walkthrough.md](./EXAMPLE-add-building-walkthrough.md)**).

---

## The only recipe you need

Every object in this lab is built the same way:

```javascript
const mesh = new THREE.Mesh(
  new THREE.SomeGeometry(...),           // 1. SHAPE
  new THREE.MeshStandardMaterial({ ... }) // 2. LOOK (color, shiny/matte)
);
mesh.position.set(x, y, z);              // 3. WHERE
scene.add(mesh);                         // 4. PUT IT IN THE WORLD
```

Your buildings already do this with `BoxGeometry`. Trees and birds do **not** need a new framework — only a different geometry (or a few meshes glued together).

---

## Geometry menu (copy-paste shapes)

| Want… | Use this geometry | Typical params |
|---|---|---|
| Building / crate | `BoxGeometry(w, h, d)` | width, height, depth |
| Tree trunk / pole | `CylinderGeometry(topR, bottomR, height, sides)` | thin cylinder |
| Tree leaves / roof | `ConeGeometry(radius, height, sides)` | pointy cone |
| Bird body / ball | `SphereGeometry(radius, widthSegs, heightSegs)` | small sphere |
| Path / road / pond surface | `PlaneGeometry(width, depth)` | flat rectangle |
| Island (already in lab) | `CylinderGeometry(...)` | fat short cylinder |

**Colors:** same rule as buildings — `0x` + hex digits (`#4ade80` → `0x4ade80`).

| Color | Hex |
|---|---|
| Bark brown | `0x6b4423` |
| Leaf green | `0x2d6a3e` |
| Path stone | `0x8a7858` |
| Bird white | `0xf8fafc` |
| Pond blue | `0x1e6091` |

---

## Idea 1 — A tree (two shapes + a Group)

A tree is **not** one magic object. It is:

1. a brown cylinder (trunk)
2. a green cone (leaves)
3. a `THREE.Group` that holds both so you can move them together

### Step A — Uncomment the helper in `scene.js`

Scroll to **EXAMPLE PROPS** at the bottom of `js/scene.js`. Uncomment the whole block (remove `/*` and `*/`).

You should now have:

- `makeTree(x, z)`
- `makeBird(x, y, z)`
- `makePath(x, z, w, d)`
- `edpBirds` (array used for flying)

### Step B — Plant trees

Still in `scene.js`, **after** the props helpers are uncommented, add:

```javascript
makeTree(8, -3);
makeTree(-8, 2);
makeTree(5, 8);
```

Save → refresh. Three trees should appear.

### What the code is doing (read this with students)

```javascript
function makeTree(x, z) {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.35, 2, 8),
    new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.95 })
  );
  trunk.position.y = 1; // half of height 2 → sits on ground

  const leaves = new THREE.Mesh(
    new THREE.ConeGeometry(1.2, 2.5, 8),
    new THREE.MeshStandardMaterial({ color: 0x2d6a3e, roughness: 0.9 })
  );
  leaves.position.y = 3.1; // above the trunk

  const tree = new THREE.Group();
  tree.add(trunk);
  tree.add(leaves);
  tree.position.set(x, 0, z); // place the whole tree on the map
  scene.add(tree);
  return tree;
}
```

| Line idea | Meaning |
|---|---|
| `CylinderGeometry` / `ConeGeometry` | pick a shape |
| `position.y = …` | stack trunk and leaves in local space |
| `new THREE.Group()` | “folder” that holds child meshes |
| `tree.position.set(x, 0, z)` | move the whole folder with one `x` / `z` |

**Teach this sentence:** *Group = parent. Children keep their local positions. Move the parent to move everything.*

---

## Idea 2 — A path / surface (flat plane)

Water in this lab is already a `PlaneGeometry` rotated flat. A stone path is the same idea, smaller and on the grass.

After helpers are enabled:

```javascript
makePath(0, -2, 4, 10);
```

That creates a flat rectangle at `(0, -2)` that is `4` wide and `10` deep.

```javascript
function makePath(x, z, w, d) {
  const path = new THREE.Mesh(
    new THREE.PlaneGeometry(w, d),
    new THREE.MeshStandardMaterial({ color: 0x8a7858, roughness: 1 })
  );
  path.rotation.x = -Math.PI / 2; // lay flat (same trick as water)
  path.position.set(x, 0.05, z);  // slightly above ground so it shows
  scene.add(path);
  return path;
}
```

### Other surfaces you can invent with the same pattern

| Surface | Geometry idea | Tip |
|---|---|---|
| Dirt patch | `PlaneGeometry` | brown color, `y ≈ 0.04` |
| Small pond | `CircleGeometry` or thin `CylinderGeometry` | blue, very short height |
| Bridge deck | `BoxGeometry` | low `h`, long `w` or `d` |
| **Road** (asphalt + dashes) | `makeRoad` | see **[EXAMPLE-add-road-walkthrough.md](./EXAMPLE-add-road-walkthrough.md)** |
| Fence post | `CylinderGeometry` | thin + tall |

You do **not** need new Three.js features — change numbers and colors.

---

## Idea 3 — A bird (small mesh + move it every frame)

### Step A — Create birds in `scene.js`

```javascript
makeBird(-6, 6, 4);
makeBird(3, 7, -5);
```

A lab bird is still just primitives — a **Group** of small parts (body, head, beak, wings), same idea as a tree:

```javascript
function makeBird(x, y, z) {
  const feather = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.75 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), feather);
  const leftWing = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.04, 0.28), feather);
  const rightWing = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.04, 0.28), feather);
  // …head, beak, tail — see makeBird in scene.js for the full version

  const bird = new THREE.Group();
  bird.add(body, leftWing, rightWing /* … */);
  bird.position.set(x, y, z); // y is height in the sky here
  bird.userData.leftWing = leftWing;
  bird.userData.rightWing = rightWing;
  scene.add(bird);
  edpBirds.push(bird);
  return bird;
}
```

Notice: for birds, **you do set `y`** — they fly, so they are not glued to the ground like buildings.

### Step B — Make them fly in `main.js`

Creating a mesh only places it once. **Motion** happens in the animation loop (same place as camera orbit / hover).

In `js/main.js`, inside `animate()`, uncomment the EXAMPLE bird lines:

```javascript
edpBirds.forEach(function (bird, i) {
  const t = Date.now() * 0.001;
  bird.position.x += Math.sin(t + i) * 0.02;
  bird.position.y = 6 + Math.sin(t * 2 + i) * 0.4;
  bird.rotation.y = Math.sin(t * 0.5 + i) * 0.4;

  const flap = Math.sin(t * 10 + i) * 0.45;
  bird.userData.leftWing.rotation.z = 0.35 + flap;
  bird.userData.rightWing.rotation.z = -0.35 - flap;
});
```

| Piece | Meaning |
|---|---|
| `animate()` + `requestAnimationFrame` | runs every frame (~60 times/sec) |
| `Date.now()` | time → smooth motion |
| `Math.sin(...)` | gentle back-and-forth / bobbing |
| `edpBirds.forEach` | update every bird the same way |

**Teach this sentence:** *Build once in `scene.js`. Move every frame in `main.js`.*

---

## Full “starter village props” checklist

Do these in order:

- [ ] Uncomment **EXAMPLE PROPS** block in `js/scene.js`
- [ ] Call `makeTree(...)` at least twice
- [ ] Call `makePath(...)` once
- [ ] Call `makeBird(...)` once or twice
- [ ] Uncomment bird motion in `main.js` → `animate()`
- [ ] Refresh — trees + path visible; birds bob / drift
- [ ] F12 Console → no red errors

---

## Make it YOUR version (homework-friendly)

Change at least **two** things without AI inventing new APIs:

| Change | How |
|---|---|
| Taller trees | Bigger cone `ConeGeometry(1.5, 3.5, 8)` |
| Palm-style tree | Sphere leaves instead of cone |
| Flock of birds | More `makeBird` calls + different starting `x,z` |
| Faster flight | Increase `0.02` / `0.4` in the `sin` math |
| Colored path | `0xc4a574` or your own hex |
| Clickable tree (advanced) | Push a mesh into `buildings` / give `userData.name` like buildings |

---

## Common mistakes

| Problem | Fix |
|---|---|
| `makeTree is not defined` | Uncomment the EXAMPLE PROPS block first |
| Tree floating / underground | Trunk `y` should be about half the trunk height |
| Path invisible | Need `rotation.x = -Math.PI / 2` and `y` slightly above `0` |
| Bird never moves | Uncomment the loop inside `animate()` in `main.js` |
| Bird undefined in `main.js` | Helpers must push into `edpBirds` and export `globalThis.edpBirds` |
| Object off the island | Keep roughly `x` / `z` between `-28` and `28` |

---

## What you are NOT expected to do (yet)

These are real Three.js topics — save them for later courses:

- Loading `.glb` / `.gltf` bird models from the internet
- Skeletal animation / Mixamo characters
- Particle systems, shaders, terrain heightmaps

For PF 101: **primitives + Group + position + (optional) animate loop** is the correct, honest skill.

---

## Instructor note

Keep the teaching spine short:

1. **Mesh = Geometry + Material** (already used for buildings)
2. **Group** = combine parts (tree)
3. **Plane + rotate** = surface (path / pond)
4. **animate loop** = motion over time (bird)

That is enough for students to invent props without treating Three.js as a black box.

Related:

- Buildings / coordinates: **[EXAMPLE-add-building-walkthrough.md](./EXAMPLE-add-building-walkthrough.md)**
- Events / colors: **[EXAMPLE-modification-walkthrough.md](./EXAMPLE-modification-walkthrough.md)**
- Rubric: **[activity-island-modifications.md](./activity-island-modifications.md)**
