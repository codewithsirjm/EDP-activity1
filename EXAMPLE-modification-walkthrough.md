# Example Modification Walkthrough

Follow this **exact example first**. When it works, change the colors, keys, or behavior to make it yours for the homework submission.

**Files you edit:** `js/events.js` only (for this example)

**Prerequisite:** STEP 1–7 must already be working.

---

## What you will build

| Action | Result |
|---|---|
| Click a building | Building turns **gold**, water turns **blue**, grass turns **green** |
| Click empty ground | Surroundings reset to default |
| Press **R** | Selection clears + surroundings reset |
| Press **B** | Toggle **day / night** (sky darkens, sun hides, moon appears) |

This counts as:
- 1 modified event (`click` does more than before)
- 1 new event (`keydown` **B** for night mode)
- Multiple color changes

---

## Step 1 — Uncomment the example block

Open `js/events.js` and scroll to the bottom.

Find the section labeled **EXAMPLE MODIFICATION** and uncomment the whole block:

- Remove the opening `/*` after the section header comment
- Remove the closing `*/` at the very end

You should now have these functions active:

- `highlightSurroundings(building)`
- `resetSurroundings()`
- `toggleNightMode()`

Save the file. Do **not** refresh yet — the example is not wired up until Step 2.

---

## Step 2 — Wire click to change surroundings

In the same file, find `function onClick()`.

You will see commented EXAMPLE lines ready for you. Replace the pink highlight + default HUD with the helper, and uncomment `resetSurroundings()` in the `else` branch.

**Before (STEP 4 default + commented EXAMPLE hints):**

```javascript
if (selected) {
  paintBuilding(selected, 0xf472b6);
  edpHud.innerHTML =
    '<strong>Selected: ' + selected.userData.name + '</strong>' +
    '<em>click → addEventListener → handler → 3D response</em>';
  // highlightSurroundings(selected);   // EXAMPLE — uncomment after enabling the block below
} else {
  resetHud();
  // resetSurroundings();               // EXAMPLE — uncomment after enabling the block below
}
```

**After (with example enabled):**

```javascript
if (selected) {
  highlightSurroundings(selected);
} else {
  resetHud();
  resetSurroundings();
}
```

Do **not** leave both the pink `paintBuilding` and `highlightSurroundings` — the helper owns the color.

Save → refresh browser → click a building. Water and grass should change.

---

## Step 3 — Wire R to reset surroundings

Find `function onKeyDown(event)`.

**Uncomment** the line inside the R handler:

```javascript
resetSurroundings();
```

Save → refresh → select a building → press **R**. Colors should return to normal.

---

## Step 4 — Enable night mode with B

In the same `onKeyDown` function, **uncomment** these lines at the top:

```javascript
if (event.code === 'KeyB') {
  toggleNightMode();
  return;
}
```

Save → refresh → press **B**. Sky should darken. Press **B** again for day mode.

Want a **visible sun and moon** in the sky (not just dimmer light)? Follow **[EXAMPLE-add-sun-walkthrough.md](./EXAMPLE-add-sun-walkthrough.md)**.

---

## Step 5 — Test checklist

- [ ] Click Town Hall → gold building + new water + new grass  
- [ ] Click empty space → surroundings reset  
- [ ] Press **R** → selection and surroundings reset  
- [ ] Press **B** → night mode on/off  
- [ ] F12 Console → no red errors  

---

## Step 6 — Commit this example

```bash
git add js/events.js
git commit -m "Enable example modification: surroundings on click and B for night mode"
git push
```

---

## Step 7 — Make it YOUR submission

The example is a **template**, not the final homework. Change at least **two** things, for example:

| Change | Where |
|---|---|
| Use purple `0xc084fc` instead of gold | `highlightSurroundings` |
| Press **N** instead of **B** for night | `onKeyDown` — change `KeyB` to `KeyN` |
| Double-click shows a fun message | New `onDoubleClick` + listener in `main.js` |
| Hover changes water color slightly | Inside `updateHover` |
| Random highlight color on each click | `highlightSurroundings` |

Then update `README.md`:

```markdown
## My Modifications

- Changed click highlight to coral and water to deep blue on select
- Added double-click handler to show building name in large HUD text
- Press N toggles night mode (changed from example B key)
```

Commit again:

```bash
git add .
git commit -m "Customize example: my colors and double-click handler"
git push
```

---

## If something breaks

| Problem | Fix |
|---|---|
| `highlightSurroundings is not defined` | Uncomment the full example block at bottom of `events.js` |
| Click works but water does not change | Call `highlightSurroundings(selected)` inside `if (selected)` |
| B does nothing | Uncomment the `KeyB` block at top of `onKeyDown` |
| Building stays pink and gold | Remove duplicate `paintBuilding(selected, 0xf472b6)` — let the helper handle color |
| Night mode stuck | Press **B** again, or refresh page |

---

## Instructor note

This example intentionally modifies an **existing** handler (`click`) and adds to an **existing** listener (`keydown`) so students see both patterns before inventing their own.

Full rubric and idea menu: **[activity-island-modifications.md](./activity-island-modifications.md)**
