// Fixed scenes for screenshots: ?shot=editor shows the page with sample photos
// loaded; ?shot=cover shows one exported cover alone, full frame, at the size
// the query asks for. window.__shotReady is set once the cover is painted.
import { layoutById, sizeById } from './cover.js';

// The library's photos, in order, with the label and caption each one carries.
const LIBRARY = [
  { label: 'THE DRIVER', caption: 'OCEAN DRIVE — 7:40 PM' },
  { label: 'NEON NIGHTS', caption: 'DINER ROW — 11:58 PM' },
  { label: 'THE LIFEGUARD', caption: 'PIER 26 — 5:30 AM' },
  { label: 'THE ROOFTOP', caption: 'SKYLINE — 8:15 PM' },
  { label: 'BOULEVARD', caption: 'PALM ROW — 6:02 PM' },
  { label: 'THE ANGLER', caption: 'OLD PIER — 5:12 AM' },
];

/** Grows or shrinks the panel list to the layout's panel count, keeping the
 *  photos already placed and filling new panels from the library in order. */
function adaptPanels(state, order) {
  const count = layoutById(state.layout).panels.length;
  const next = [];
  for (let i = 0; i < count; i++) {
    const old = state.panels[i];
    if (old) next.push(old);
    else {
      const s = LIBRARY[order[i % order.length] % LIBRARY.length];
      next.push({ photo: order[i % order.length], cx: 0.5, cy: 0.5, zoom: 1, label: s.label, caption: s.caption });
    }
  }
  state.panels = next;
}

export async function runShot(shot, query, api) {
  const { loadImage, photos, state, redraw, syncControls } = api;
  const size = sizeById(query.get('size') || '1920x1080');
  state.size = size.id;
  if (query.get('layout')) state.layout = query.get('layout');
  if (query.get('grade')) state.grade = query.get('grade');
  if (query.get('title')) state.title = query.get('title');
  if (query.get('subtitle') !== null) state.subtitle = query.get('subtitle') || '';
  if (query.get('tagline')) state.tagline = query.get('tagline');

  // The library photos, in the same order the editor lists them.
  const names = ['convertible', 'neon', 'tower', 'rooftop', 'boulevard', 'pier'];
  for (const name of names) photos.push(await loadImage(`samples/${name}.jpg`));
  await document.fonts.ready;

  if (shot === 'cover') {
    document.body.classList.add('shot-cover');
    // A hero photo across the panels, cycling through the whole library so
    // even an eight-panel layout fills every cell with a real photo.
    const order = (query.get('photos') || '0,1,2,3,4,5').split(',').map(Number);
    adaptPanels(state, order);
    state.panels.forEach((p, i) => {
      p.photo = order[i % order.length];
      p.cx = 0.5;
      p.cy = 0.5;
      p.zoom = 1;
    });
  }
  syncControls();
  redraw();
  requestAnimationFrame(() => requestAnimationFrame(() => { window.__shotReady = true; }));
}
