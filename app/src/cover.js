// Vice Heat Cover Lab — the cover engine.
// Draws a multi-panel GTA-style poster cover onto any 2D canvas context, at any
// size: panels of photos, colour grades, gradient block lettering, a neon script
// subtitle, a tagline strip, stickers and per-panel captions. Everything is drawn
// with the canvas API; the only outside assets are the photos and two OFL fonts.

export const LAYOUTS = [
  {
    id: 'hero-left',
    name: 'Hero Left',
    blurb: 'One big hero photo, three stacked panels on the right.',
    panels: [
      { x: 0, y: 0, w: 0.62, h: 1 },
      { x: 0.62, y: 0, w: 0.38, h: 0.34 },
      { x: 0.62, y: 0.34, w: 0.38, h: 0.33 },
      { x: 0.62, y: 0.67, w: 0.38, h: 0.33 },
    ],
    title: { x: 0.03, y: 0.6, w: 0.56, h: 0.32, align: 'left' },
  },
  {
    id: 'hero-right',
    name: 'Hero Right',
    blurb: 'Three stacked panels on the left, one big hero on the right.',
    panels: [
      { x: 0, y: 0, w: 0.38, h: 0.34 },
      { x: 0, y: 0.34, w: 0.38, h: 0.33 },
      { x: 0, y: 0.67, w: 0.38, h: 0.33 },
      { x: 0.38, y: 0, w: 0.62, h: 1 },
    ],
    title: { x: 0.41, y: 0.6, w: 0.56, h: 0.32, align: 'left' },
  },
  {
    id: 'centre-title',
    name: 'Centre Title',
    blurb: 'Four corner photos ringing a solid title band.',
    panels: [
      { x: 0, y: 0, w: 0.5, h: 0.4 },
      { x: 0.5, y: 0, w: 0.5, h: 0.4 },
      { x: 0, y: 0.6, w: 0.5, h: 0.4 },
      { x: 0.5, y: 0.6, w: 0.5, h: 0.4 },
    ],
    title: { x: 0, y: 0.4, w: 1, h: 0.2, align: 'center', band: true },
  },
  {
    id: 'nine-grid',
    name: 'Nine Grid',
    blurb: 'Eight photos in a 3 x 3 grid with the title in the centre cell.',
    panels: [
      { x: 0, y: 0, w: 1 / 3, h: 1 / 3 },
      { x: 1 / 3, y: 0, w: 1 / 3, h: 1 / 3 },
      { x: 2 / 3, y: 0, w: 1 / 3, h: 1 / 3 },
      { x: 0, y: 1 / 3, w: 1 / 3, h: 1 / 3 },
      { x: 2 / 3, y: 1 / 3, w: 1 / 3, h: 1 / 3 },
      { x: 0, y: 2 / 3, w: 1 / 3, h: 1 / 3 },
      { x: 1 / 3, y: 2 / 3, w: 1 / 3, h: 1 / 3 },
      { x: 2 / 3, y: 2 / 3, w: 1 / 3, h: 1 / 3 },
    ],
    title: { x: 1 / 3, y: 1 / 3, w: 1 / 3, h: 1 / 3, align: 'center', band: true },
  },
  {
    id: 'slanted',
    name: 'Slanted',
    blurb: 'Three diagonal panels over a dark title band.',
    panels: [
      { x: -0.03, y: 0, w: 0.38, h: 0.74, slant: 0.07 },
      { x: 0.32, y: 0, w: 0.38, h: 0.74, slant: 0.07 },
      { x: 0.67, y: 0, w: 0.38, h: 0.74, slant: 0.07 },
    ],
    title: { x: 0, y: 0.74, w: 1, h: 0.26, align: 'center', band: true },
  },
  {
    id: 'strips',
    name: 'Strips',
    blurb: 'Three full-width photo strips, title across the middle one.',
    panels: [
      { x: 0, y: 0, w: 1, h: 0.3 },
      { x: 0, y: 0.3, w: 1, h: 0.3 },
      { x: 0, y: 0.6, w: 1, h: 0.4 },
    ],
    title: { x: 0.05, y: 0.3, w: 0.9, h: 0.3, align: 'center' },
  },
  {
    id: 'hero-top',
    name: 'Hero Top',
    blurb: 'A wide hero on top, three small panels along the foot.',
    panels: [
      { x: 0, y: 0, w: 1, h: 0.66 },
      { x: 0, y: 0.66, w: 1 / 3, h: 0.34 },
      { x: 1 / 3, y: 0.66, w: 1 / 3, h: 0.34 },
      { x: 2 / 3, y: 0.66, w: 1 / 3, h: 0.34 },
    ],
    title: { x: 0.03, y: 0.34, w: 0.94, h: 0.28, align: 'left' },
  },
];

export const GRADES = [
  { id: 'sunset', name: 'Warm Sunset', blurb: 'Golden-hour orange and pink wash.' },
  { id: 'magenta', name: 'Magenta Duotone', blurb: 'Pink-to-purple duotone.' },
  { id: 'teal', name: 'Teal Duotone', blurb: 'Cyan-to-blue duotone.' },
  { id: 'neon', name: 'Neon Night', blurb: 'High-contrast purple and cyan night.' },
  { id: 'poster-ink', name: 'Poster Ink', blurb: 'Halftone print, heavy contrast.' },
  { id: 'skin-safe', name: 'Skin Safe', blurb: 'Gentle warm grade, skin stays true.' },
];

export const SIZES = [
  { id: '1920x1080', name: 'Landscape 1920 x 1080', w: 1920, h: 1080 },
  { id: '1080x1080', name: 'Square 1080 x 1080', w: 1080, h: 1080 },
  { id: '1080x1350', name: 'Portrait 1080 x 1350', w: 1080, h: 1350 },
];

const GAP = 0.006; // panel gap, as a fraction of the cover width

/** Returns the layout object for an id, falling back to the first layout. */
export function layoutById(id) {
  return LAYOUTS.find((l) => l.id === id) || LAYOUTS[0];
}

/** Returns the grade object for an id, falling back to the first grade. */
export function gradeById(id) {
  return GRADES.find((g) => g.id === id) || GRADES[0];
}

/** Returns the export size object for an id, falling back to landscape. */
export function sizeById(id) {
  return SIZES.find((s) => s.id === id) || SIZES[0];
}

/** A halftone dot pattern, built once and reused by the poster-ink grade. */
let halftonePattern = null;
function getHalftone(ctx) {
  if (halftonePattern) return halftonePattern;
  const tile = document.createElement('canvas');
  tile.width = 9;
  tile.height = 9;
  const t = tile.getContext('2d');
  t.fillStyle = '#fff';
  t.fillRect(0, 0, 9, 9);
  t.fillStyle = '#000';
  t.beginPath();
  t.arc(4.5, 4.5, 2.1, 0, Math.PI * 2);
  t.fill();
  halftonePattern = ctx.createPattern(tile, 'repeat');
  return halftonePattern;
}

/** A film-grain pattern, built once and reused for the finish pass. */
let grainPattern = null;
function getGrain(ctx) {
  if (grainPattern) return grainPattern;
  const tile = document.createElement('canvas');
  tile.width = 140;
  tile.height = 140;
  const t = tile.getContext('2d');
  const img = t.createImageData(140, 140);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 118 + Math.floor(Math.random() * 40);
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  t.putImageData(img, 0, 0);
  grainPattern = ctx.createPattern(tile, 'repeat');
  return grainPattern;
}

/**
 * Draws one photo into a panel rect with the grade applied, honouring the
 * panel's focus point (cx, cy in 0..1) and zoom. `photo` may be null, in which
 * case a sunset placeholder is drawn instead.
 */
export function drawPhotoPanel(ctx, photo, rect, panel, gradeId) {
  const { x, y, w, h } = rect;
  ctx.save();
  ctx.beginPath();
  if (panel.slant) {
    const s = panel.slant * w;
    ctx.moveTo(x, y + h);
    ctx.lineTo(x + s, y);
    ctx.lineTo(x + w + s, y);
    ctx.lineTo(x + w, y + h);
  } else {
    ctx.rect(x, y, w, h);
  }
  ctx.closePath();
  ctx.clip();

  if (!photo) {
    const g = ctx.createLinearGradient(x, y, x + w, y + h);
    g.addColorStop(0, '#3a1c5c');
    g.addColorStop(0.55, '#c2437a');
    g.addColorStop(1, '#ff8a3d');
    ctx.fillStyle = g;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = `bold ${Math.max(11, w * 0.035)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('YOUR PHOTO HERE', x + w / 2, y + h / 2);
    ctx.restore();
    return;
  }

  // Grade the photo on a small offscreen canvas at panel resolution.
  const pw = Math.max(2, Math.round(w));
  const ph = Math.max(2, Math.round(h));
  const off = document.createElement('canvas');
  off.width = pw;
  off.height = ph;
  const o = off.getContext('2d');
  const iw = photo.naturalWidth;
  const ih = photo.naturalHeight;
  const base = Math.max(pw / iw, ph / ih) * (panel.zoom || 1);
  const dw = iw * base;
  const dh = ih * base;
  const cx = panel.cx == null ? 0.5 : panel.cx;
  const cy = panel.cy == null ? 0.5 : panel.cy;
  const dx = pw / 2 - cx * dw;
  const dy = ph / 2 - cy * dh;
  o.drawImage(photo, dx, dy, dw, dh);
  applyGrade(o, pw, ph, gradeId);
  ctx.drawImage(off, x, y, w, h);
  ctx.restore();
}

/** Applies a colour grade to an offscreen context holding one photo. */
function applyGrade(o, w, h, gradeId) {
  const wash = (stops, mode, alpha) => {
    const g = o.createLinearGradient(0, 0, 0, h);
    for (const [at, color] of stops) g.addColorStop(at, color);
    o.save();
    o.globalCompositeOperation = mode;
    o.globalAlpha = alpha;
    o.fillStyle = g;
    o.fillRect(0, 0, w, h);
    o.restore();
  };
  if (gradeId === 'sunset') {
    o.filter = 'saturate(1.3) contrast(1.06) brightness(1.02)';
    o.drawImage(o.canvas, 0, 0);
    o.filter = 'none';
    wash([[0, 'rgba(255,190,90,0.55)'], [0.6, 'rgba(255,110,60,0.35)'], [1, 'rgba(255,46,136,0.5)']], 'soft-light', 0.9);
    wash([[0, 'rgba(255,120,40,0)'], [1, 'rgba(255,46,136,0.28)']], 'overlay', 0.7);
  } else if (gradeId === 'magenta') {
    o.filter = 'grayscale(0.55) contrast(1.14) brightness(1.03)';
    o.drawImage(o.canvas, 0, 0);
    o.filter = 'none';
    wash([[0, '#ff2e88'], [1, '#7b2ff7']], 'color', 0.9);
    wash([[0, 'rgba(255,46,136,0.35)'], [1, 'rgba(123,47,247,0.35)']], 'soft-light', 0.8);
  } else if (gradeId === 'teal') {
    o.filter = 'grayscale(0.55) contrast(1.14) brightness(1.03)';
    o.drawImage(o.canvas, 0, 0);
    o.filter = 'none';
    wash([[0, '#00e5c7'], [1, '#0057ff']], 'color', 0.9);
    wash([[0, 'rgba(0,229,199,0.3)'], [1, 'rgba(0,87,255,0.3)']], 'soft-light', 0.8);
  } else if (gradeId === 'neon') {
    o.filter = 'saturate(1.55) contrast(1.16) brightness(0.94)';
    o.drawImage(o.canvas, 0, 0);
    o.filter = 'none';
    wash([[0, 'rgba(123,47,247,0.5)'], [0.5, 'rgba(255,46,136,0.3)'], [1, 'rgba(0,229,199,0.45)']], 'overlay', 0.9);
    wash([[0, 'rgba(20,0,60,0.25)'], [1, 'rgba(20,0,60,0)']], 'multiply', 0.6);
  } else if (gradeId === 'poster-ink') {
    o.filter = 'contrast(1.38) saturate(1.6) brightness(1.02)';
    o.drawImage(o.canvas, 0, 0);
    o.filter = 'none';
    wash([[0, 'rgba(255,200,80,0.6)'], [1, 'rgba(255,46,136,0.6)']], 'soft-light', 0.9);
    o.save();
    o.globalCompositeOperation = 'overlay';
    o.globalAlpha = 0.28;
    o.fillStyle = getHalftone(o);
    o.fillRect(0, 0, w, h);
    o.restore();
  } else {
    // skin-safe: a gentle warm grade that leaves skin tones alone.
    o.filter = 'saturate(1.12) contrast(1.03) brightness(1.01)';
    o.drawImage(o.canvas, 0, 0);
    o.filter = 'none';
    wash([[0, 'rgba(255,180,110,0.4)'], [1, 'rgba(255,120,80,0.25)']], 'soft-light', 0.55);
  }
}

/** Shrinks a font until `text` fits `maxWidth`, then returns the size used. */
function fitFont(ctx, text, family, weight, startSize, maxWidth) {
  let size = startSize;
  ctx.font = `${weight} ${size}px ${family}`;
  while (size > 10 && ctx.measureText(text).width > maxWidth) {
    size -= Math.max(1, Math.round(size * 0.04));
    ctx.font = `${weight} ${size}px ${family}`;
  }
  return size;
}

/** Draws the big block title with a warm gradient fill, thick outline and shadow. */
function drawBlockTitle(ctx, zone, text) {
  const { x, y, w, h, align } = zone;
  const pad = w * 0.04;
  const maxW = w - pad * 2;
  const size = fitFont(ctx, text, 'Anton, "Arial Narrow", sans-serif', '400', h * 0.72, maxW);
  const tx = align === 'center' ? x + w / 2 : x + pad;
  const ty = y + h * 0.5 + size * 0.36;
  ctx.save();
  ctx.textAlign = align === 'center' ? 'center' : 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.lineJoin = 'round';
  // Offset drop shadow, drawn first.
  ctx.font = `400 ${size}px Anton, "Arial Narrow", sans-serif`;
  ctx.fillStyle = 'rgba(10,2,16,0.6)';
  ctx.fillText(text, tx + size * 0.045, ty + size * 0.06);
  // Thick dark outline.
  ctx.strokeStyle = '#160a1c';
  ctx.lineWidth = Math.max(2, size * 0.11);
  ctx.strokeText(text, tx, ty);
  // Warm gradient fill.
  const g = ctx.createLinearGradient(0, ty - size, 0, ty + size * 0.18);
  g.addColorStop(0, '#ffe45e');
  g.addColorStop(0.45, '#ff9a3d');
  g.addColorStop(1, '#ff2e88');
  ctx.fillStyle = g;
  ctx.fillText(text, tx, ty);
  ctx.restore();
  return size;
}

/** Draws the neon script subtitle with a pink glow. */
function drawScriptSubtitle(ctx, zone, text, titleSize) {
  const { x, y, w, h, align } = zone;
  const size = fitFont(ctx, text, 'Pacifico, cursive', '400', Math.max(18, titleSize * 0.42), w * 0.9);
  ctx.save();
  ctx.textAlign = align === 'center' ? 'center' : 'left';
  ctx.font = `400 ${size}px Pacifico, cursive`;
  const sx = align === 'center' ? x + w / 2 : x + w * 0.04;
  const sy = y + h * 0.94;
  ctx.shadowColor = '#ff2e88';
  ctx.shadowBlur = size * 0.55;
  ctx.fillStyle = '#ff5ec4';
  ctx.fillText(text, sx, sy);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffd7f0';
  ctx.fillText(text, sx, sy);
  ctx.restore();
}

/** Draws one sticker badge: a gold star rating, an EST. seal or a VOL. pill. */
function drawBadges(ctx, W, H, state) {
  if (!state.showBadges) return;
  const u = Math.min(W, H) / 1080; // scale unit
  // Star rating, top right.
  const stars = '★'.repeat(Math.max(0, Math.min(5, state.stars || 5)));
  ctx.save();
  ctx.font = `${Math.round(34 * u)}px system-ui, sans-serif`;
  ctx.textAlign = 'right';
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 8 * u;
  ctx.fillStyle = '#ffd94d';
  ctx.fillText(stars, W - 26 * u, 52 * u);
  ctx.restore();
  // EST. 2026 seal, bottom right above the tagline strip.
  const cx = W - 74 * u;
  const cy = H - 118 * u;
  const r = 46 * u;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(22,8,28,0.82)';
  ctx.fill();
  ctx.lineWidth = 3 * u;
  ctx.strokeStyle = '#ffd94d';
  ctx.stroke();
  ctx.fillStyle = '#ffd94d';
  ctx.textAlign = 'center';
  ctx.font = `bold ${Math.round(15 * u)}px system-ui, sans-serif`;
  ctx.fillText('EST.', cx, cy - 4 * u);
  ctx.font = `bold ${Math.round(19 * u)}px system-ui, sans-serif`;
  ctx.fillText('2026', cx, cy + 17 * u);
  ctx.restore();
  // VOL. pill, top left.
  ctx.save();
  const label = `VOL. ${String(state.volume || '01').padStart(2, '0')}`;
  ctx.font = `bold ${Math.round(22 * u)}px Anton, "Arial Narrow", sans-serif`;
  const tw = ctx.measureText(label).width;
  const bx = 22 * u;
  const by = 22 * u;
  const bw = tw + 28 * u;
  const bh = 40 * u;
  ctx.fillStyle = 'rgba(22,8,28,0.85)';
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, bh / 2);
  ctx.fill();
  ctx.strokeStyle = '#ff5ec4';
  ctx.lineWidth = 2.5 * u;
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, bx + bw / 2, by + bh / 2 + 1 * u);
  ctx.restore();
}

/** Draws the small caps tagline strip along the foot of the cover. */
function drawTaglineStrip(ctx, W, H, tagline) {
  if (!tagline || !tagline.trim()) return;
  const u = Math.min(W, H) / 1080;
  const bh = Math.max(34 * u, H * 0.055);
  ctx.save();
  ctx.fillStyle = 'rgba(12,4,18,0.88)';
  ctx.fillRect(0, H - bh, W, bh);
  ctx.fillStyle = '#ffe9a8';
  ctx.font = `bold ${Math.round(21 * u)}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  try {
    ctx.letterSpacing = `${Math.round(4 * u)}px`;
  } catch (_) {
    // Older canvas builds ignore letterSpacing; the strip still reads fine.
  }
  ctx.fillText(tagline.trim().toUpperCase(), W / 2, H - bh / 2 + 1 * u);
  try {
    ctx.letterSpacing = '0px';
  } catch (_) {}
  ctx.restore();
}

/** Draws a panel's name label and time-and-note caption inside the panel.
 *  The label drops below the VOL. pill when the panel sits in the cover's
 *  top-left corner, and the caption lifts above the tagline strip when the
 *  panel reaches the foot of the cover, so nothing is ever covered up. */
function drawPanelCaption(ctx, rect, panel, W, H, taglineH, showBadges) {
  if (!panel.label && !panel.caption) return;
  const { x, y, w, h } = rect;
  const u = Math.min(W, H) / 1080;
  ctx.save();
  if (panel.label) {
    let labelY = y + 34 * u;
    if (showBadges && x < 2 && y < 2) labelY += 52 * u;
    ctx.font = `${Math.round(26 * u)}px Anton, "Arial Narrow", sans-serif`;
    ctx.textAlign = 'left';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 6 * u;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(panel.label.toUpperCase(), x + 14 * u, labelY);
  }
  if (panel.caption) {
    let captionY = y + h - 16 * u;
    if (taglineH > 0) captionY = Math.min(captionY, H - taglineH - 12 * u);
    ctx.font = `bold ${Math.round(17 * u)}px system-ui, sans-serif`;
    ctx.textAlign = 'left';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 6 * u;
    ctx.fillStyle = '#ffe9a8';
    ctx.fillText(panel.caption.toUpperCase(), x + 14 * u, captionY);
  }
  ctx.restore();
}

/**
 * Draws the whole cover. `state` holds layout, grade, title, subtitle,
 * tagline, volume, stars, showBadges, showCaptions and panels (one per layout
 * panel: {photo, cx, cy, zoom, label, caption}). `photos` is the library array
 * of images (or nulls), indexed by panel.photo.
 */
export function drawCover(ctx, state, W, H, photos) {
  const layout = layoutById(state.layout);
  const gap = Math.max(2, W * GAP);
  ctx.save();
  ctx.fillStyle = '#160a1c';
  ctx.fillRect(0, 0, W, H);

  // Photo panels.
  const taglineH =
    state.tagline && state.tagline.trim() ? Math.max(34 * (Math.min(W, H) / 1080), H * 0.055) : 0;
  const rects = layout.panels.map((p) => ({
    x: p.x * W + (p.x > 0 ? gap / 2 : 0),
    y: p.y * H + (p.y > 0 ? gap / 2 : 0),
    w: p.w * W - (p.x > 0 ? gap / 2 : 0) - (p.x + p.w < 1 ? gap / 2 : 0),
    h: p.h * H - (p.y > 0 ? gap / 2 : 0) - (p.y + p.h < 1 ? gap / 2 : 0),
  }));
  layout.panels.forEach((p, i) => {
    const panel = state.panels[i] || { photo: -1, cx: 0.5, cy: 0.5, zoom: 1 };
    const photo = panel.photo >= 0 && photos[panel.photo] ? photos[panel.photo] : null;
    drawPhotoPanel(ctx, photo, rects[i], { ...panel, slant: p.slant }, state.grade);
    if (state.showCaptions) drawPanelCaption(ctx, rects[i], panel, W, H, taglineH, state.showBadges);
  });

  // Title block: a solid band for centre layouts, a scrim for over-photo ones.
  const tz = layout.title;
  const tx = tz.x * W;
  const ty = tz.y * H;
  const tw = tz.w * W;
  const th = tz.h * H;
  if (tz.band) {
    const g = ctx.createLinearGradient(tx, ty, tx, ty + th);
    g.addColorStop(0, '#1d0b26');
    g.addColorStop(1, '#12061a');
    ctx.fillStyle = g;
    ctx.fillRect(tx, ty, tw, th);
    ctx.fillStyle = 'rgba(255,94,196,0.9)';
    ctx.fillRect(tx, ty, tw, Math.max(2, H * 0.004));
    ctx.fillRect(tx, ty + th - Math.max(2, H * 0.004), tw, Math.max(2, H * 0.004));
  } else {
    const scrim = ctx.createLinearGradient(0, ty - th * 0.25, 0, ty + th);
    scrim.addColorStop(0, 'rgba(12,4,18,0)');
    scrim.addColorStop(1, 'rgba(12,4,18,0.62)');
    ctx.fillStyle = scrim;
    ctx.fillRect(tx - tw * 0.03, ty - th * 0.25, tw * 1.06, th * 1.25);
  }

  // Lettering: block title, then the neon script subtitle tucked under it.
  const titleText = (state.title || '').trim().toUpperCase() || 'VICE HEAT';
  const titleSize = drawBlockTitle(ctx, { x: tx, y: ty, w: tw, h: th * 0.72, align: tz.align }, titleText);
  if ((state.subtitle || '').trim()) {
    drawScriptSubtitle(
      ctx,
      { x: tx, y: ty + th * 0.66, w: tw, h: th * 0.34, align: tz.align },
      state.subtitle.trim(),
      titleSize,
    );
  }

  drawBadges(ctx, W, H, state);
  drawTaglineStrip(ctx, W, H, state.tagline);

  // Finish: vignette and a whisper of film grain.
  const vg = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.42, W / 2, H / 2, Math.max(W, H) * 0.75);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(10,2,14,0.32)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = getGrain(ctx);
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  ctx.restore();
  return rects;
}

/** Panel rects for a layout at a given size, for hit-testing in the editor. */
export function panelRects(layoutId, W, H) {
  const layout = layoutById(layoutId);
  const gap = Math.max(2, W * GAP);
  return layout.panels.map((p) => ({
    x: p.x * W + (p.x > 0 ? gap / 2 : 0),
    y: p.y * H + (p.y > 0 ? gap / 2 : 0),
    w: p.w * W - (p.x > 0 ? gap / 2 : 0) - (p.x + p.w < 1 ? gap / 2 : 0),
    h: p.h * H - (p.y > 0 ? gap / 2 : 0) - (p.y + p.h < 1 ? gap / 2 : 0),
  }));
}
