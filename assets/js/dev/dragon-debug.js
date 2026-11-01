/**
 * DEV TOOL - not loaded on the normal site.
 * Open the home page with ?debug in the address (index.html?debug) to use it.
 *
 *   POSITION button: left-drag moves X/Y, right-drag moves Z, mouse wheel changes size.
 *   ROTATION button: left-drag rotates X/Y, right-drag rotates Z.
 *
 * The box on the left shows numbers you can paste into KEYFRAMES in modules/dragon.js.
 */
export function attachDragonDebug({ renderer, state, getModel, setOverride }) {
  const canvas = renderer.domElement;
  const container = document.getElementById('model-container');
  let mode = 'scroll'; // 'scroll' | 'position' | 'rotation'
  let dragButton = null;
  let last = { x: 0, y: 0 };

  const baseButtonStyle = `
    position: fixed; left: 10px; z-index: 10000; width: 180px; display: block;
    color: #fff; font: bold 13px monospace; padding: 8px 14px;
    border: none; border-radius: 6px; cursor: pointer;`;

  const box = document.createElement('div');
  box.style.cssText = `
    position: fixed; top: 80px; left: 10px; z-index: 9999; min-width: 320px;
    background: rgba(0,0,0,0.7); color: #a855f7; font: 13px/1.8 monospace;
    padding: 10px; border: 1px solid #a855f7; border-radius: 6px;`;

  const makeButton = (top, label) => {
    const button = document.createElement('button');
    button.style.cssText = `${baseButtonStyle} top: ${top}px; background: #555;`;
    button.textContent = label;
    return button;
  };
  const positionButton = makeButton(260, 'POSITION: OFF');
  const rotationButton = makeButton(300, 'ROTATION: OFF');
  document.body.append(box, positionButton, rotationButton);

  function render() {
    const model = getModel();
    const editing = mode !== 'scroll';
    container.style.pointerEvents = editing ? 'auto' : 'none';
    canvas.style.zIndex = editing ? '1' : '-1';
    setOverride(editing);

    positionButton.textContent = `POSITION: ${mode === 'position' ? 'ON' : 'OFF'}`;
    positionButton.style.background = mode === 'position' ? '#22c55e' : '#555';
    rotationButton.textContent = `ROTATION: ${mode === 'rotation' ? 'ON' : 'OFF'}`;
    rotationButton.style.background = mode === 'rotation' ? '#f59e0b' : '#555';

    if (!editing || !model) {
      box.innerHTML = 'SCROLL MODE: scroll to animate.<br>Turn on position or rotation to edit.';
      return;
    }
    const f = (n) => n.toFixed(2);
    box.innerHTML = `
      ${mode.toUpperCase()} MODE<br>
      Left drag: X/Y | Right drag: Z | Wheel: size<br><br>
      position: { x: ${f(model.position.x)}, y: ${f(model.position.y)}, z: ${f(model.position.z)} },<br>
      rotation: { x: ${f(model.rotation.x)}, y: ${f(model.rotation.y)}, z: ${f(model.rotation.z)} },<br>
      scale: ${f(model.scale.x)}`;
  }

  const toggle = (target) => {
    mode = mode === target ? 'scroll' : target;
    render();
  };
  positionButton.addEventListener('click', () => toggle('position'));
  rotationButton.addEventListener('click', () => toggle('rotation'));

  canvas.addEventListener('contextmenu', (event) => event.preventDefault());
  canvas.addEventListener('mousedown', (event) => {
    if (mode === 'scroll') return;
    dragButton = event.button;
    last = { x: event.clientX, y: event.clientY };
  });
  window.addEventListener('mouseup', () => { dragButton = null; });

  canvas.addEventListener('mousemove', (event) => {
    const model = getModel();
    if (!model || dragButton === null) return;
    const dx = (event.clientX - last.x) * 0.01;
    const dy = (event.clientY - last.y) * 0.01;
    last = { x: event.clientX, y: event.clientY };

    if (mode === 'position') {
      if (dragButton === 0) { model.position.x += dx; model.position.y -= dy; }
      if (dragButton === 2) { model.position.z += dy; }
      Object.assign(state, { px: model.position.x, py: model.position.y, pz: model.position.z });
    } else {
      if (dragButton === 0) { model.rotation.x += dx; model.rotation.y += dy; }
      if (dragButton === 2) { model.rotation.z += dx; }
      Object.assign(state, { rx: model.rotation.x, ry: model.rotation.y, rz: model.rotation.z });
    }
    render();
  });

  canvas.addEventListener('wheel', (event) => {
    const model = getModel();
    if (!model || mode === 'scroll') return;
    event.preventDefault();
    const size = Math.max(0.1, model.scale.x + (event.deltaY > 0 ? -0.05 : 0.05));
    model.scale.set(size, size, size);
    state.sc = size;
    render();
  }, { passive: false });

  render();
}
