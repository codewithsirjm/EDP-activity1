/*
 * main.js — Wire events to handlers + run the animation loop (DEMO COMPLETE)
 *
 * Instructor showcase: all STEP listeners + activity extras enabled.
 */

/* ================================================================== STEP 0A
 * Slight camera move once on load
 * ================================================================== */
window.addEventListener('load', function () {
  edpCamera.position.x = 30;
  edpCamera.position.z = 38;
  edpCamera.lookAt(0, 2, 0);
  edpRenderer.render(edpScene, edpCamera);
  if (typeof resetHud === 'function') resetHud();
});

/* ================================================================== STEP 3–7 + ACTIVITY listeners */
window.addEventListener('mousemove', onMouseMove);
edpRenderer.domElement.addEventListener('click', onClick);
edpRenderer.domElement.addEventListener('dblclick', onDoubleClick);
window.addEventListener('resize', onResize);
window.addEventListener('keydown', onKeyDown);

/*
 * Animation loop — orbit (STEP 0B), hover (STEP 6), bird motion (props activity)
 */
function animate() {
  requestAnimationFrame(animate);

  updateHover();

  const t = Date.now() * 0.00025;
  const orbitRadius = 55;   // how far from island center
  const orbitHeight = 32;   // how high the camera sits
  edpCamera.position.x = Math.sin(t) * orbitRadius;
  edpCamera.position.z = Math.cos(t) * orbitRadius;
  edpCamera.position.y = orbitHeight;
  edpCamera.lookAt(0, 2, 0);  // keep looking at island center
  if (typeof edpPlaceSkyBodies === 'function') edpPlaceSkyBodies();

  if (globalThis.edpBirds) {
    edpBirds.forEach(function (bird, i) {
      const bt = Date.now() * 0.0005;
      bird.position.x += Math.sin(bt + i) * 0.42;
      bird.position.y = 6 + Math.sin(bt * 2 + i) * 0.4;
      bird.rotation.y = Math.sin(bt * 0.5 + i) * 0.4;

      const flap = Math.sin(bt * 10 + i) * 0.45;
      if (bird.userData.leftWing) {
        bird.userData.leftWing.rotation.z = 0.35 + flap;
        bird.userData.rightWing.rotation.z = -0.35 - flap;
      }
    });
  }

  edpRenderer.render(edpScene, edpCamera);
}

animate();
