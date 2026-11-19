// Vice Heat Cover Lab — the editor.
// Wires the page: photo library and uploads, per-panel crop and position by
// drag and zoom, layout and grade pickers, editable lettering, badges, the
// "Surprise me" randomiser, undo and redo, and one-click PNG export in the
// three post sizes. Photos are read on this machine and never uploaded.
import { drawCover, layoutById, panelRects, LAYOUTS, GRADES, SIZES, sizeById } from './cover.js';
import { runShot } from './shots.js';

const SAMPLES = [
  { name: 'Convertible', src: 'samples/convertible.jpg', label: 'THE DRIVER', caption: 'OCEAN DRIVE — 7:40 PM' },
  { name: 'Neon Street', src: 'samples/neon.jpg', label: 'NEON NIGHTS', caption: 'DINER ROW — 11:58 PM' },
  { name: 'Lifeguard', src: 'samples/tower.jpg', label: 'THE LIFEGUARD', caption: 'PIER 26 — 5:30 AM' },
  { name: 'Rooftop', src: 'samples/rooftop.jpg', label: 'THE ROOFTOP', caption: 'SKYLINE — 8:15 PM' },
  { name: 'Boulevard', src: 'samples/boulevard.jpg', label: 'BOULEVARD', caption: 'PALM ROW — 6:02 PM' },
  { name: 'Pier', src: 'samples/pier.jpg', label: 'THE ANGLER', caption: 'OLD PIER — 5:12 AM' },
];

const TITLES = ['VICE HEAT', 'PALM ROW', 'NEON TIDE', 'COASTLINE', 'SUMMER HEAT', 'AFTER DARK', 'GOLDEN HOUR', 'HOT NIGHTS'];
const SUBTITLES = ['after dark', 'coastline nights', 'boardwalk nights', 'golden hour', 'neon tide', 'summer heat'];
const TAGLINES = [
  'HOT NIGHTS • FAST CARS • NO REGRETS',
  'EVERY SUMMER HAS A STORY',
  'ONE COAST • NO RULES • COMING SOON',
  'DRIVE FAST • SHINE BRIGHT • STAY OUT LATE',
  'THE CITY NEVER SLEEPS',
];

const canvas = document.getElementById('cover');
const statusEl = document.getElementById('status');

/** The library: loaded sample images, then any photos the person uploads. */
const photos = [];
const photoNames = [];

function defaultPanels(layoutId) {
  const layout = layoutById(layoutId);
  return layout.panels.map((_, i) => {
    const s = SAMPLES[i % SAMPLES.length];
    return { photo: i % SAMPLES.length, cx: 0.5, cy: 0.5, zoom: 1, label: s.label, caption: s.caption };
  });
}

const state = {
  layout: 'hero-left',
  grade: 'sunset',
  size: '1920x1080',
  title: 'VICE HEAT',
  subtitle: 'after dark',
  tagline: 'HOT NIGHTS • FAST CARS • NO REGRETS',
  volume: '01',
  stars: 5,
  showBadges: true,
  showCaptions: true,
  panels: defaultPanels('hero-left'),
};

let selectedPanel = 0;
let undoStack = [];
let redoStack = [];

function snapshot() {
  return JSON.stringify(state);
}

function pushUndo() {
  undoStack.push(snapshot());
  if (undoStack.length > 40) undoStack.shift();
  redoStack = [];
  updateUndoButtons();
}

function restore(json) {
  const next = JSON.parse(json);
  Object.assign(state, next);
  selectedPanel = Math.min(selectedPanel, state.panels.length - 1);
  syncControls();
  redraw();
}

function undo() {
  if (!undoStack.length) return;
  redoStack.push(snapshot());
  restore(undoStack.pop());
  updateUndoButtons();
}

function redo() {
  if (!redoStack.length) return;
  undoStack.push(snapshot());
  restore(redoStack.pop());
  updateUndoButtons();
}

/** Snapshots the state once when an input gains focus, so undo restores the
 *  state from before the edit. */
function pushUndoOnFocus(el) {
  el.addEventListener('focus', () => {
    if (!el._undoPushed) {
      pushUndo();
      el._undoPushed = true;
    }
  });
  el.addEventListener('blur', () => { el._undoPushed = false; });
}

function updateUndoButtons() {
  document.getElementById('undo').disabled = undoStack.length === 0;
  document.getElementById('redo').disabled = redoStack.length === 0;
}

/** Loads an image from a URL, resolving once it can be drawn. */
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function previewSize() {
  const size = sizeById(state.size);
  const scale = 900 / Math.max(size.w, size.h);
  return { w: Math.round(size.w * scale), h: Math.round(size.h * scale) };
}

function redraw() {
  const { w, h } = previewSize();
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  drawCover(canvas.getContext('2d'), state, w, h, photos);
  highlightSelected();
}

function highlightSelected() {
  const { w, h } = previewSize();
  const rects = panelRects(state.layout, w, h);
  const overlay = document.getElementById('panelOverlay');
  const ctx = overlay.getContext('2d');
  overlay.width = w;
  overlay.height = h;
  ctx.clearRect(0, 0, w, h);
  const r = rects[selectedPanel];
  if (!r) return;
  ctx.strokeStyle = '#ff5ec4';
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 6]);
  ctx.strokeRect(r.x + 2, r.y + 2, r.w - 4, r.h - 4);
  ctx.setLineDash([]);
}

function setStatus(text) {
  statusEl.textContent = text;
}

/* ---------- controls ---------- */

function buildPickers() {
  const layoutBox = document.getElementById('layouts');
  for (const l of LAYOUTS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pick';
    b.dataset.id = l.id;
    b.innerHTML = `<strong>${l.name}</strong><span>${l.panels.length} panels</span>`;
    b.title = l.blurb;
    b.addEventListener('click', () => {
      if (state.layout === l.id) return;
      pushUndo();
      state.layout = l.id;
      state.panels = adaptPanels(state.panels, l.id);
      selectedPanel = 0;
      syncControls();
      redraw();
    });
    layoutBox.appendChild(b);
  }
  const gradeBox = document.getElementById('grades');
  for (const g of GRADES) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pick grade-' + g.id;
    b.dataset.id = g.id;
    b.innerHTML = `<strong>${g.name}</strong><span>${g.blurb}</span>`;
    b.addEventListener('click', () => {
      if (state.grade === g.id) return;
      pushUndo();
      state.grade = g.id;
      syncControls();
      redraw();
    });
    gradeBox.appendChild(b);
  }
  const sizeBox = document.getElementById('sizes');
  for (const s of SIZES) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pick';
    b.dataset.id = s.id;
    b.innerHTML = `<strong>${s.name}</strong><span>${s.w} x ${s.h} PNG</span>`;
    b.addEventListener('click', () => {
      if (state.size === s.id) return;
      pushUndo();
      state.size = s.id;
      syncControls();
      redraw();
    });
    sizeBox.appendChild(b);
  }
}

/** Keeps photo assignments when the layout changes, filling new panels in order. */
function adaptPanels(oldPanels, layoutId) {
  const count = layoutById(layoutId).panels.length;
  const next = [];
  for (let i = 0; i < count; i++) {
    if (oldPanels[i]) next.push({ ...oldPanels[i] });
    else {
      const s = SAMPLES[i % SAMPLES.length];
      next.push({ photo: i % SAMPLES.length, cx: 0.5, cy: 0.5, zoom: 1, label: s.label, caption: s.caption });
    }
  }
  return next;
}

function syncControls() {
  for (const el of document.querySelectorAll('#layouts .pick')) {
    el.classList.toggle('active', el.dataset.id === state.layout);
  }
  for (const el of document.querySelectorAll('#grades .pick')) {
    el.classList.toggle('active', el.dataset.id === state.grade);
  }
  for (const el of document.querySelectorAll('#sizes .pick')) {
    el.classList.toggle('active', el.dataset.id === state.size);
  }
  document.getElementById('title').value = state.title;
  document.getElementById('subtitle').value = state.subtitle;
  document.getElementById('tagline').value = state.tagline;
  document.getElementById('volume').value = state.volume;
  document.getElementById('stars').value = String(state.stars);
  document.getElementById('showBadges').checked = state.showBadges;
  document.getElementById('showCaptions').checked = state.showCaptions;
  syncPanelEditor();
}

function syncPanelEditor() {
  const panel = state.panels[selectedPanel];
  document.getElementById('panelName').textContent = panel
    ? `Panel ${selectedPanel + 1} of ${state.panels.length} — drag to move, scroll to zoom`
    : 'No panel';
  document.getElementById('panelLabel').value = panel ? panel.label : '';
  document.getElementById('panelCaption').value = panel ? panel.caption : '';
  document.getElementById('panelZoom').value = panel ? String(Math.round((panel.zoom || 1) * 100)) : '100';
  for (const el of document.querySelectorAll('#library .thumb')) {
    el.classList.toggle('active', panel && Number(el.dataset.index) === panel.photo);
  }
}

function buildLibrary() {
  const box = document.getElementById('library');
  SAMPLES.forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'thumb';
    b.dataset.index = String(i);
    b.title = `${s.name} — click to put in the selected panel`;
    const img = document.createElement('img');
    img.src = s.src;
    img.alt = s.name;
    const cap = document.createElement('span');
    cap.textContent = s.name;
    b.append(img, cap);
    b.addEventListener('click', () => {
      pushUndo();
      const panel = state.panels[selectedPanel];
      panel.photo = i;
      panel.label = s.label;
      panel.caption = s.caption;
      panel.cx = 0.5;
      panel.cy = 0.5;
      panel.zoom = 1;
      syncPanelEditor();
      redraw();
      setStatus(`${s.name} placed in panel ${selectedPanel + 1}.`);
    });
    box.appendChild(b);
  });
}

/* ---------- export ---------- */

/** Renders the cover at an export size and downloads it as a PNG. */
export function exportPNG(sizeId) {
  const size = sizeById(sizeId);
  const off = document.createElement('canvas');
  off.width = size.w;
  off.height = size.h;
  drawCover(off.getContext('2d'), state, size.w, size.h, photos);
  return new Promise((resolve) => {
    off.toBlob((blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `vice-heat-cover-${size.w}x${size.h}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      setStatus(`Saved vice-heat-cover-${size.w}x${size.h}.png`);
      resolve(true);
    }, 'image/png');
  });
}

/* ---------- surprise me / clear ---------- */

function surpriseMe() {
  pushUndo();
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  state.layout = pick(LAYOUTS).id;
  state.grade = pick(GRADES).id;
  state.title = pick(TITLES);
  state.subtitle = pick(SUBTITLES);
  state.tagline = pick(TAGLINES);
  state.volume = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
  state.stars = 4 + Math.floor(Math.random() * 2);
  state.panels = layoutById(state.layout).panels.map((_, i) => {
    const idx = Math.floor(Math.random() * photos.length);
    const s = SAMPLES[idx % SAMPLES.length];
    return {
      photo: idx,
      cx: 0.35 + Math.random() * 0.3,
      cy: 0.3 + Math.random() * 0.4,
      zoom: 1 + Math.random() * 0.6,
      label: s.label,
      caption: s.caption,
    };
  });
  selectedPanel = 0;
  syncControls();
  redraw();
  setStatus('Surprise! A fresh cover, rolled at random.');
}

function clearAll() {
  pushUndo();
  state.title = '';
  state.subtitle = '';
  state.tagline = '';
  state.panels = state.panels.map((p) => ({ ...p, photo: -1, cx: 0.5, cy: 0.5, zoom: 1, label: '', caption: '' }));
  syncControls();
  redraw();
  setStatus('Cleared — pick photos from the library or upload your own.');
}

/* ---------- per-panel drag and zoom on the preview ---------- */

function canvasPoint(e) {
  const r = canvas.getBoundingClientRect();
  return {
    x: ((e.clientX - r.left) / r.width) * canvas.width,
    y: ((e.clientY - r.top) / r.height) * canvas.height,
  };
}

let drag = null;

canvas.addEventListener('pointerdown', (e) => {
  const p = canvasPoint(e);
  const rects = panelRects(state.layout, canvas.width, canvas.height);
  const hit = rects.findIndex((r) => p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h);
  if (hit < 0) return;
  selectedPanel = hit;
  const panel = state.panels[hit];
  // Snapshot before the drag mutates the panel, so undo restores its old crop.
  if (panel && panel.photo >= 0) pushUndo();
  drag = { start: p, cx: panel.cx ?? 0.5, cy: panel.cy ?? 0.5, moved: false };
  canvas.setPointerCapture(e.pointerId);
  syncPanelEditor();
  redraw();
});

canvas.addEventListener('pointermove', (e) => {
  if (!drag) return;
  const p = canvasPoint(e);
  const rects = panelRects(state.layout, canvas.width, canvas.height);
  const r = rects[selectedPanel];
  const panel = state.panels[selectedPanel];
  if (!r || !panel || panel.photo < 0) return;
  const dx = (p.x - drag.start.x) / r.w;
  const dy = (p.y - drag.start.y) / r.h;
  if (Math.abs(dx) > 0.004 || Math.abs(dy) > 0.004) drag.moved = true;
  panel.cx = Math.min(1, Math.max(0, drag.cx - dx));
  panel.cy = Math.min(1, Math.max(0, drag.cy - dy));
  redraw();
});

canvas.addEventListener('pointerup', () => {
  drag = null;
});

let wheelUndoAt = 0;
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const panel = state.panels[selectedPanel];
  if (!panel || panel.photo < 0) return;
  // One undo step per wheel gesture, not one per tick.
  if (Date.now() - wheelUndoAt > 800) {
    pushUndo();
    wheelUndoAt = Date.now();
  }
  const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
  panel.zoom = Math.min(4, Math.max(1, (panel.zoom || 1) * factor));
  document.getElementById('panelZoom').value = String(Math.round(panel.zoom * 100));
  redraw();
}, { passive: false });

/* ---------- wiring the controls ---------- */

function bind(id, event, fn) {
  document.getElementById(id).addEventListener(event, fn);
}

function bindText(id, key) {
  pushUndoOnFocus(document.getElementById(id));
  bind(id, 'input', (e) => {
    state[key] = e.target.value;
    redraw();
  });
}

bindText('title', 'title');
bindText('subtitle', 'subtitle');
bindText('tagline', 'tagline');
bind('volume', 'input', (e) => {
  state.volume = e.target.value;
  redraw();
});
bind('stars', 'input', (e) => {
  state.stars = Number(e.target.value);
  redraw();
});
pushUndoOnFocus(document.getElementById('volume'));
pushUndoOnFocus(document.getElementById('stars'));
pushUndoOnFocus(document.getElementById('panelLabel'));
pushUndoOnFocus(document.getElementById('panelCaption'));
pushUndoOnFocus(document.getElementById('panelZoom'));
bind('showBadges', 'change', (e) => {
  pushUndo();
  state.showBadges = e.target.checked;
  redraw();
});
bind('showCaptions', 'change', (e) => {
  pushUndo();
  state.showCaptions = e.target.checked;
  redraw();
});
bind('panelLabel', 'input', (e) => {
  state.panels[selectedPanel].label = e.target.value;
  redraw();
});
bind('panelCaption', 'input', (e) => {
  state.panels[selectedPanel].caption = e.target.value;
  redraw();
});
bind('panelZoom', 'input', (e) => {
  const v = Number(e.target.value);
  if (Number.isFinite(v) && v >= 100 && v <= 400) {
    state.panels[selectedPanel].zoom = v / 100;
    redraw();
  }
});
bind('fillAll', 'click', () => {
  pushUndo();
  const panel = state.panels[selectedPanel];
  state.panels.forEach((p) => {
    p.photo = panel.photo;
    p.label = panel.label;
    p.caption = panel.caption;
  });
  redraw();
  setStatus('This photo now fills every panel.');
});
bind('surprise', 'click', surpriseMe);
bind('clear', 'click', clearAll);
bind('undo', 'click', undo);
bind('redo', 'click', redo);
bind('export', 'click', () => exportPNG(state.size));
bind('exportAll', 'click', async () => {
  for (const s of SIZES) {
    // eslint-disable-next-line no-await-in-loop
    await exportPNG(s.id);
  }
  setStatus('Saved all three sizes: 1920x1080, 1080x1080 and 1080x1350.');
});

bind('upload', 'change', async (e) => {
  const files = [...e.target.files].filter((f) => f.type.startsWith('image/'));
  if (!files.length) return;
  for (const file of files) {
    const url = URL.createObjectURL(file);
    const img = await loadImage(url);
    photos.push(img);
    photoNames.push(file.name.replace(/\.[^.]+$/, ''));
    addUploadThumb(photos.length - 1, file.name);
  }
  pushUndo();
  const panel = state.panels[selectedPanel];
  panel.photo = photos.length - files.length;
  panel.cx = 0.5;
  panel.cy = 0.5;
  panel.zoom = 1;
  syncPanelEditor();
  redraw();
  setStatus(`${files.length} photo${files.length > 1 ? 's' : ''} added to the library.`);
  e.target.value = '';
});

function addUploadThumb(index, name) {
  const box = document.getElementById('library');
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'thumb';
  b.dataset.index = String(index);
  b.title = `${name} — click to put in the selected panel`;
  const img = document.createElement('img');
  img.src = photos[index].src;
  img.alt = name;
  const cap = document.createElement('span');
  cap.textContent = name.replace(/\.[^.]+$/, '').slice(0, 18) || 'Your photo';
  b.append(img, cap);
  b.addEventListener('click', () => {
    pushUndo();
    const panel = state.panels[selectedPanel];
    panel.photo = index;
    panel.cx = 0.5;
    panel.cy = 0.5;
    panel.zoom = 1;
    syncPanelEditor();
    redraw();
  });
  box.appendChild(b);
}

/* ---------- boot ---------- */

buildPickers();
buildLibrary();
syncControls();
updateUndoButtons();

const shot = new URLSearchParams(location.search).get('shot');
if (shot) {
  runShot(shot, new URLSearchParams(location.search), {
    loadImage,
    photos,
    state,
    redraw,
    syncControls,
    setStatus,
  });
} else {
  (async () => {
    for (const s of SAMPLES) photos.push(await loadImage(s.src));
    await document.fonts.ready;
    redraw();
  })();
}
