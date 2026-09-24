# Activity — Customize Your Socorro Island

**Subject:** PF 101 · Event-Driven Programming  
**Project:** `edp-lab` (Socorro Mini Map)  
**Due:** Next meeting — submit your GitHub repo link

---

## What you are doing

You already built the island step by step in class (STEP 0A → 7).

Now **make it yours**: add new events or change what happens when events fire — especially **colors** on buildings, water, island, sky, or HUD text.

Think of it like decorating a toy island and teaching it new reactions.

**Start here:** follow the worked example step by step → **[EXAMPLE-modification-walkthrough.md](./EXAMPLE-modification-walkthrough.md)**  
Then customize it for your own submission.

Want trees, birds, or a path on the island? Same Mesh recipe, different shapes → **[EXAMPLE-add-props-walkthrough.md](./EXAMPLE-add-props-walkthrough.md)**  
Want another building? → **[EXAMPLE-add-building-walkthrough.md](./EXAMPLE-add-building-walkthrough.md)**  
Want a visible sun / moon with **B**? → **[EXAMPLE-add-sun-walkthrough.md](./EXAMPLE-add-sun-walkthrough.md)**  
Want a road with dashed lines? → **[EXAMPLE-add-road-walkthrough.md](./EXAMPLE-add-road-walkthrough.md)**

---

## Before you start (required baseline)

Your repo must already have **all lab steps working**:

- Click a building → it highlights and HUD updates  
- Hover a building → preview highlight  
- Press **R** → selection resets  
- Resize window → scene still looks correct  

If any of that is broken, fix it first. Do not start customization on a broken base.

---

## Your mission

Complete **all required tasks** below, then pick **at least 2 ideas** from the menu (or invent your own).

Every change must follow the EDP pattern:

```text
EVENT  → user does something (click, key, double-click, etc.)
LISTEN → addEventListener in main.js
HANDLE → your function in events.js
UPDATE → color, text, camera, or scene changes
```

---

## Required tasks (everyone)

| # | Task | Where to work |
|---|---|---|
| 1 | Keep STEP 1–7 working | `events.js` + `main.js` |
| 2 | Add **at least 1 new event** OR clearly **change behavior** of an existing handler | `events.js` + `main.js` |
| 3 | Add **at least 1 visible color change** beyond the default pink/blue highlights | Usually `events.js` |
| 4 | Update `README.md` with a **“My Modifications”** section (3–5 bullets: what you added, which event, what changes on screen) | `README.md` |
| 5 | Push to GitHub with **at least 2 commits** for this activity | Git |

**Commit message examples:**

```bash
git commit -m "Change click highlight to gold and water color on select"
git commit -m "Add double-click handler to show building details"
```

---

## Pick at least 2 (menu)

Choose from **Easy**, **Medium**, or **Challenge**. You may mix levels.

### Easy — great first customizations

| Idea | Event | What happens |
|---|---|---|
| **Custom click color** | `click` | Change selected building color from pink to your own color (e.g. gold `0xfbbf24`) |
| **Custom hover color** | hover loop | Change hover highlight from light blue to another color |
| **Water reacts** | `click` | When a building is selected, change `edpWater` color |
| **Grass reacts** | `click` | When a building is selected, change `edpIsland` color |
| **Sky toggle** | `keydown` | Press **B** to toggle background between night blue and sunset orange |
| **Better HUD** | `click` | Show building name + a fun message you write |

### Medium — explore more events

| Idea | Event | What happens |
|---|---|---|
| **Double-click info** | `dblclick` | Double-click a building → show extra text in HUD |
| **Right-click reset** | `contextmenu` | Right-click canvas → reset colors + HUD (prevent default menu) |
| **Leave canvas** | `mouseleave` | When mouse leaves the canvas, clear hover highlight |
| **Number jump** | `keydown` | Press **1–5** to move camera closer to that building |
| **Random highlight** | `click` | Each click picks a random highlight color for the building |
| **Selected building glows water** | `click` | Water color matches the selected building’s base color |

### Challenge — if you want to push further

| Idea | Event | What happens |
|---|---|---|
| **Day / night** | `keydown` | Press **B** or **N** to toggle sun intensity + background + fog |
| **Visible sun / moon** | `keydown` + sprites | Day shows a sun disc; night swaps in a moon — see EXAMPLE-add-sun-walkthrough.md |
| **Multi-select** | `click` + **Shift** | Hold Shift to keep previous buildings highlighted |
| **Sound-free “pulse”** | `click` + animation loop | Briefly brighten building color for 300ms then settle |
| **Empty click effect** | `click` | Clicking empty ground flashes island color, then resets |
| **Your own event** | any valid DOM event | Must be wired with listener + handler + visible result |

---

## Starter hints (not full solutions)

You edit mainly **`js/events.js`** and **`js/main.js`**.

### Change a building color (you already have this helper)

```javascript
paintBuilding(someBuilding, 0xfbbf24); // gold
```

### Change water or island when something is clicked

These are available after `scene.js` loads:

```javascript
edpWater.material.color.setHex(0x1e6091);
edpIsland.material.color.setHex(0x40916c);
```

### Change sky / background

```javascript
edpScene.background = new THREE.Color(0x1a0a2e);
edpScene.fog.color.setHex(0x1a0a2e);
```

### Add a new listener in main.js

```javascript
window.addEventListener('dblclick', onDoubleClick);
```

Then write `onDoubleClick` in `events.js` and export it:

```javascript
function onDoubleClick() {
  // your code
}
globalThis.onDoubleClick = onDoubleClick;
```

### Double-click on canvas only

```javascript
edpRenderer.domElement.addEventListener('dblclick', onDoubleClick);
```

### Keyboard check (example: B key)

```javascript
function onKeyDown(event) {
  if (event.code === 'KeyB') {
    edpScene.background = new THREE.Color(0xff7b00);
  }
  // keep existing R reset logic if you still use it
}
```

### Prevent right-click menu

```javascript
function onContextMenu(event) {
  event.preventDefault();
  resetHud();
}
```

---

## Color cheat sheet (hex)

Use these inside `setHex(...)` or `paintBuilding(..., ...)`:

| Color | Hex |
|---|---|
| Pink (default select) | `0xf472b6` |
| Light blue (default hover) | `0x7dd3fc` |
| Gold | `0xfbbf24` |
| Green | `0x4ade80` |
| Purple | `0xc084fc` |
| Coral | `0xff6b6b` |
| Deep water | `0x0d3b66` |

---

## What to submit

Submit **one GitHub repo link** (your fork) containing:

1. Working modified island (open `index.html` locally to test)  
2. Updated `README.md` with **My Modifications** section  
3. At least **2 commits** for this activity (not one giant commit)  
4. Short demo in class **or** 30–60 second screen recording (if instructor asks)

**Optional bonus:** screenshot of your favorite interaction (paste link in README).

---

## Grading rubric (50 points)

| Criterion | Points | Full marks when… |
|---|---|---|
| Baseline lab works | 10 | Click, hover, resize, R reset all still work |
| New or modified event behavior | 12 | At least 1 real change beyond copying class code; listener + handler connected |
| Visible customization | 10 | Clear color/visual/UI change you can demo in 5 seconds |
| Code quality | 8 | Changes in sensible files; no random broken comments; console has no errors |
| README “My Modifications” | 5 | Clear bullets: event name, file, what user sees |
| Git history | 5 | 2+ meaningful commits pushed; messages describe changes |

---

## Common mistakes to avoid

- Uncommenting only the handler but **forgetting** `addEventListener` in `main.js`  
- Changing colors but **not saving** or **not refreshing** the browser  
- Breaking STEP 7 reset while editing `onKeyDown` — keep **R** working or replace it with something equivalent  
- Editing `scene.js` when you do not need to — prefer `events.js` for behavior  
- One commit named `"final"` with everything — use small commits instead  

---

## Quick self-check before submit

- [ ] I can click a building and see my custom behavior  
- [ ] I can name the **event** I added or changed (e.g. `dblclick`, `keydown`)  
- [ ] I changed at least one **color** on building, water, island, or sky  
- [ ] F12 Console shows **no red errors**  
- [ ] README lists what I built  
- [ ] GitHub is pushed and link is ready  

---

## Need help?

1. Open DevTools (F12) → **Console** — read the error line number  
2. Compare your listener in `main.js` with your function name in `events.js`  
3. Test one change at a time: save → refresh → test → commit  

**Remember:** You are not rebuilding the whole 3D world. You are learning to **react** to the user — that is event-driven programming.
