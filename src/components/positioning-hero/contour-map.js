/* ============================================================================
 * contourMap — the hero's survey map. Ported verbatim from the Finovate audit
 * (dictionary-finovate-v2/src/map/contourMap.ts), TypeScript type annotations
 * removed and nothing else changed. Adapted there from Hallmark/Furrow map.js.
 * A generated topographic field: seeded noise -> fbm height field -> marching-
 * squares contours (every 5th an "index" line with a value label) -> Chaikin
 * smoothing -> paper grain + a vignette fade -> a magnifier loupe that follows
 * the pointer and re-draws the vector map magnified. Pure-canvas, progressive
 * enhancement. Global: createContourMap(canvas, loupe, host, {paper,paper2,ink,contour}, seed?)
 * ========================================================================== */

/* Vendored into the Finance OS DS verbatim from the brand-positioning hero
 * (brand repo assets/hero-contour.js). Type-checking is disabled on this ONE
 * numeric/canvas module so the algorithm stays byte-for-byte intact — the rest of
 * src/ remains strict. The only change from source is `export` on createContourMap.
 * React wiring (host div + the two canvases + token colours + cleanup) lives in
 * ./ContourField.tsx. */

function hexToRgb(hex) {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const rgba = (hex, a) => {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

/* seeded noise */
const rng = (a) => () => {
  a |= 0; a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const perlin = (seed) => {
  const r = rng(seed); const perm = new Uint8Array(512); const base = [...Array(256).keys()];
  for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [base[i], base[j]] = [base[j], base[i]]; }
  for (let i = 0; i < 512; i++) perm[i] = base[i & 255];
  const g = (h, x, y) => {
    switch (h & 7) {
      case 0: return x + y; case 1: return -x + y; case 2: return x - y; case 3: return -x - y;
      case 4: return x; case 5: return -x; case 6: return y; default: return -y;
    }
  };
  const f = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  return (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y); const X = xi & 255, Y = yi & 255; x -= xi; y -= yi;
    const u = f(x), v = f(y); const a = perm[X] + Y, b = perm[X + 1] + Y;
    const n00 = g(perm[a], x, y), n10 = g(perm[b], x - 1, y), n01 = g(perm[a + 1], x, y - 1), n11 = g(perm[b + 1], x - 1, y - 1);
    const l1 = n00 + u * (n10 - n00), l2 = n01 + u * (n11 - n01); return l1 + v * (l2 - l1);
  };
};
const fbm = (n, x, y, oct = 4) => { let s = 0, a = 0.5, f = 1; for (let i = 0; i < oct; i++) { s += a * n(x * f, y * f); f *= 2.03; a *= 0.5; } return s; };

/* geometry */
const chaikin = (pts, closed, it = 2) => {
  let p = pts;
  for (let n = 0; n < it; n++) {
    const o = []; const L = p.length; if (!closed) o.push(p[0]);
    for (let i = 0; i < (closed ? L : L - 1); i++) {
      const a = p[i], b = p[(i + 1) % L];
      o.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    }
    if (!closed) o.push(p[L - 1]); p = o;
  }
  return p;
};
const plen = (pts) => { let s = 0; for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return s; };
const bboxOf = (pts, pad = 4) => { let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; for (const [x, y] of pts) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; } return [x0 - pad, y0 - pad, x1 + pad, y1 + pad]; };
const hits = (b, r) => !(b[2] < r[0] || b[0] > r[2] || b[3] < r[1] || b[1] > r[3]);
const pathOf = (pts, closed = false) => { const p = new Path2D(); p.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) p.lineTo(pts[i][0], pts[i][1]); if (closed) p.closePath(); return p; };

/* marching squares */
const EDGES = [[], [[3, 2]], [[2, 1]], [[3, 1]], [[0, 1]], null, [[0, 2]], [[3, 0]], [[3, 0]], [[0, 2]], null, [[0, 1]], [[3, 1]], [[2, 1]], [[3, 2]], []];
function trace(field, nx, ny, cell, step) {
  const buckets = new Map();
  const pt = (i, j, e, v0, v1, v2, v3, t) => {
    switch (e) {
      case 0: return [(i + (t - v0) / (v1 - v0)) * cell, j * cell];
      case 1: return [(i + 1) * cell, (j + (t - v1) / (v2 - v1)) * cell];
      case 2: return [(i + (t - v3) / (v2 - v3)) * cell, (j + 1) * cell];
      default: return [i * cell, (j + (t - v0) / (v3 - v0)) * cell];
    }
  };
  const key = (i, j, e) => (e === 0 ? (j * nx + i) * 2 : e === 2 ? ((j + 1) * nx + i) * 2 : e === 1 ? (j * nx + i + 1) * 2 + 1 : (j * nx + i) * 2 + 1);
  for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
    const v0 = field[j * nx + i], v1 = field[j * nx + i + 1], v2 = field[(j + 1) * nx + i + 1], v3 = field[(j + 1) * nx + i];
    const lo = Math.min(v0, v1, v2, v3), hi = Math.max(v0, v1, v2, v3);
    for (let k = Math.ceil(lo / step); k * step < hi; k++) {
      const t = k * step;
      const code = (v0 > t ? 8 : 0) | (v1 > t ? 4 : 0) | (v2 > t ? 2 : 0) | (v3 > t ? 1 : 0);
      let segs = EDGES[code];
      if (segs === null) { const c = (v0 + v1 + v2 + v3) / 4 > t; segs = code === 5 ? (c ? [[3, 0], [2, 1]] : [[3, 2], [0, 1]]) : (c ? [[0, 1], [3, 2]] : [[3, 0], [2, 1]]); }
      if (!segs.length) continue;
      let b = buckets.get(k); if (!b) buckets.set(k, (b = { pts: new Map(), adj: new Map(), segs: [] }));
      for (const [ea, eb] of segs) {
        const ka = key(i, j, ea), kb = key(i, j, eb);
        if (!b.pts.has(ka)) b.pts.set(ka, pt(i, j, ea, v0, v1, v2, v3, t));
        if (!b.pts.has(kb)) b.pts.set(kb, pt(i, j, eb, v0, v1, v2, v3, t));
        const s = b.segs.length; b.segs.push([ka, kb]);
        (b.adj.get(ka) || b.adj.set(ka, []).get(ka)).push(s);
        (b.adj.get(kb) || b.adj.set(kb, []).get(kb)).push(s);
      }
    }
  }
  const out = [];
  for (const [k, b] of buckets) {
    const used = new Uint8Array(b.segs.length);
    const walk = (from, s0) => { const keys = []; let cur = from; for (;;) { const nxt = b.adj.get(cur).find((x) => !used[x]); if (nxt === undefined) break; used[nxt] = 1; const [a, c] = b.segs[nxt]; cur = a === cur ? c : a; keys.push(cur); } return keys; };
    for (let s = 0; s < b.segs.length; s++) {
      if (used[s]) continue; used[s] = 1;
      const [ka, kb] = b.segs[s];
      const fwd = walk(kb, s), back = walk(ka, s);
      const keys = [...back.reverse(), ka, kb, ...fwd];
      const closed = keys[0] === keys[keys.length - 1];
      const pts = keys.map((q) => b.pts.get(q));
      if (closed) pts.pop();
      if (pts.length < 4) continue;
      out.push({ k, closed, pts });
    }
  }
  return out;
}

export function createContourMap(canvas, loupe, host, initial, seed = 7, opts = {}) {
  const fadeMode = opts.fade || "vignette"; // "vignette" (hero) | "none" (uniform, for CSS-masked edges)
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  let colors = { ...initial };
  const noise = perlin(seed);

  let W = 0, H = 0, dpr = 1, S = null;

  function layout() {
    const r = host.getBoundingClientRect();
    W = Math.max(2, Math.round(r.width)); H = Math.max(2, Math.round(r.height));
    dpr = Math.min(opts.maxDpr || 2, window.devicePixelRatio || 1);
  }

  function build() {
    const cell = 6; const nx = Math.ceil(W / cell) + 2, ny = Math.ceil(H / cell) + 2;
    const field = new Float32Array(nx * ny);
    const base = Math.max(W, H);
    const hx = 0.62, hy = 0.34;
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const X = (i * cell) / base, Y = (j * cell) / base;
      const hill = 0.5 * Math.exp(-(((X - hx) ** 2) * 1.2 + ((Y - hy) ** 2) * 2.2) / 0.28);
      const basin = -0.28 * Math.exp(-(((X - 0.2) ** 2) * 1.6 + ((Y - 0.8) ** 2) * 1.6) / 0.25);
      field[j * nx + i] = -0.78 * Y + 0.22 * X + 0.46 * fbm(noise, X * 1.5 + 11.3, Y * 1.5 + 4.1) + hill + basin;
    }
    const step = Math.max(0.016, 20 / base);
    const lines = trace(field, nx, ny, cell, step);
    let kmin = Infinity; for (const l of lines) kmin = Math.min(kmin, l.k);
    const contours = [];
    for (const l of lines) {
      const pts = chaikin(l.pts, l.closed, 2);
      const len = plen(pts); if (len < (l.closed ? 90 : 34)) continue;
      const index = (l.k - kmin) % 5 === 0;
      const chunks = [];
      for (let s = 0; s < pts.length - 1; s += 40) { const part = pts.slice(s, Math.min(pts.length, s + 41)); chunks.push({ b: bboxOf(part), p: pathOf(part) }); }
      if (l.closed) { const part = [pts[pts.length - 1], pts[0]]; chunks.push({ b: bboxOf(part), p: pathOf(part) }); }
      contours.push({ pts, index, len, value: 100 + 5 * (l.k - kmin), chunks });
    }
    const cLabels = [];
    const cx = W / 2, cy = H / 2, keepOut = Math.min(W, H) * 0.3;
    for (const c of contours.filter((x) => x.index && x.len > 160).sort((a, b) => b.len - a.len)) {
      if (cLabels.length >= 6) break;
      for (let i = 10; i < c.pts.length - 10; i += 9) {
        const [x, y] = c.pts[i];
        if (x < 46 || y < 40 || x > W - 46 || y > H - 40) continue;
        if (Math.hypot(x - cx, y - cy) < keepOut) continue;
        if (cLabels.some((l) => Math.hypot(l.x - x, l.y - y) < 230)) continue;
        const a0 = Math.atan2(c.pts[i + 4][1] - c.pts[i - 4][1], c.pts[i + 4][0] - c.pts[i - 4][0]);
        const a1 = Math.atan2(c.pts[i + 9][1] - c.pts[i - 9][1], c.pts[i + 9][0] - c.pts[i - 9][0]);
        if (Math.abs(a0 - a1) > 0.12) continue;
        let ang = a0; if (ang > Math.PI / 2) ang -= Math.PI; if (ang < -Math.PI / 2) ang += Math.PI;
        cLabels.push({ x, y, ang, text: String(c.value) }); break;
      }
    }
    S = { contours, cLabels };
  }

  /* paper grain + fibre, made once */
  const grain = (() => {
    const c = document.createElement("canvas"); c.width = c.height = 180; const x = c.getContext("2d");
    const img = x.createImageData(180, 180); const r = rng(5);
    for (let i = 0; i < img.data.length; i += 4) { const v = r(); img.data[i] = img.data[i + 1] = img.data[i + 2] = v > 0.5 ? 255 : 40; img.data[i + 3] = Math.floor(Math.abs(v - 0.5) * 18); }
    x.putImageData(img, 0, 0);
    x.lineWidth = 0.5; for (let i = 0; i < 60; i++) { const px = r() * 180, py = r() * 180, a = r() * Math.PI, l = 4 + r() * 9; x.strokeStyle = `rgba(60,48,30,${0.04 + r() * 0.04})`; x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + Math.cos(a) * l * 0.5, py + Math.sin(a) * l * 0.5, px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke(); }
    return c;
  })();

  function setFont(ctx, size) { ctx.font = `700 ${size}px ${getComputedStyle(document.body).getPropertyValue("--font-mono") || '"Anonymous Pro", monospace'}`; if ("letterSpacing" in ctx) ctx.letterSpacing = "0.04em"; }

  function paintContours(ctx, rect, scale = 1) {
    ctx.lineJoin = "round"; ctx.lineCap = "round";
    for (const pass of [false, true]) {
      ctx.strokeStyle = pass ? rgba(colors.contour, 0.6) : rgba(colors.contour, 0.3);
      ctx.lineWidth = (pass ? 1.15 : 0.7) / Math.sqrt(scale);
      for (const c of S.contours) { if (c.index !== pass) continue; for (const ch of c.chunks) if (hits(ch.b, rect)) ctx.stroke(ch.p); }
    }
    setFont(ctx, 10); ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (const l of S.cLabels) {
      if (l.x < rect[0] - 30 || l.x > rect[2] + 30 || l.y < rect[1] - 30 || l.y > rect[3] + 30) continue;
      ctx.save(); ctx.translate(l.x, l.y); ctx.rotate(l.ang);
      const w = ctx.measureText(l.text).width + 8; ctx.fillStyle = colors.paper; ctx.fillRect(-w / 2, -5, w, 10);
      ctx.fillStyle = rgba(colors.contour, 0.92); ctx.fillText(l.text, 0, 0.5); ctx.restore();
    }
  }

  function render() {
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = colors.paper; ctx.fillRect(0, 0, W, H);
    const mc = document.createElement("canvas"); mc.width = Math.ceil(W / 30); mc.height = Math.ceil(H / 30);
    const mx = mc.getContext("2d"); const mi = mx.createImageData(mc.width, mc.height); const mn = perlin(17);
    for (let j = 0; j < mc.height; j++) for (let i = 0; i < mc.width; i++) { const v = fbm(mn, i * 0.11, j * 0.11, 3); const o = (j * mc.width + i) * 4; mi.data[o] = 120; mi.data[o + 1] = 96; mi.data[o + 2] = 60; mi.data[o + 3] = Math.max(0, v) * 30; }
    mx.putImageData(mi, 0, 0); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high"; ctx.drawImage(mc, 0, 0, W, H);
    const lc = document.createElement("canvas"); lc.width = canvas.width; lc.height = canvas.height;
    const lx = lc.getContext("2d"); lx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintContours(lx, [0, 0, W, H]);
    if (fadeMode !== "none") {
      lx.globalCompositeOperation = "destination-in";
      const g = lx.createRadialGradient(W / 2, H * 0.46, Math.min(W, H) * 0.12, W / 2, H * 0.46, Math.max(W, H) * 0.62);
      g.addColorStop(0, "rgba(0,0,0,0.12)"); g.addColorStop(0.5, "rgba(0,0,0,0.6)"); g.addColorStop(1, "rgba(0,0,0,1)");
      lx.fillStyle = g; lx.fillRect(0, 0, W, H);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(lc, 0, 0); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = ctx.createPattern(grain, "repeat"); ctx.fillRect(0, 0, W, H);
  }

  /* ---- the loupe (surveyor's magnifier / "compass") ---- */
  const R = 72, M = 1.95, D = R * 2 + 44;
  const lctx = loupe ? loupe.getContext("2d") : null;
  const L = { x: 0, y: 0, o: 0 }, T = { x: 0, y: 0, o: 0 };
  let tau = 90, raf = 0, lastT = 0, inView = true, following = false, parkable = false;

  function sizeLoupe() { if (!loupe) return; loupe.width = D * dpr; loupe.height = D * dpr; loupe.style.width = loupe.style.height = D + "px"; }
  function park() { T.x = W * 0.84; T.y = H * 0.3; }
  function drawLoupe() {
    if (!lctx) return;
    const c = lctx, cx = L.x, cy = L.y, h = D / 2;
    c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, D, D);
    c.save(); c.shadowColor = rgba(colors.ink, 0.28); c.shadowBlur = 22; c.shadowOffsetY = 9; c.beginPath(); c.arc(h, h, R + 3, 0, Math.PI * 2); c.fillStyle = colors.paper2; c.fill(); c.restore();
    c.save(); c.beginPath(); c.arc(h, h, R, 0, Math.PI * 2); c.clip();
    c.setTransform(dpr * M, 0, 0, dpr * M, dpr * (h - M * cx), dpr * (h - M * cy));
    const r = R / M; const rect = [cx - r - 4, cy - r - 4, cx + r + 4, cy + r + 4];
    c.fillStyle = colors.paper; c.fillRect(rect[0], rect[1], rect[2] - rect[0], rect[3] - rect[1]);
    if (S) paintContours(c, rect, M);
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    let g = c.createRadialGradient(h, h, R * 0.7, h, h, R); g.addColorStop(0, rgba(colors.ink, 0)); g.addColorStop(1, rgba(colors.ink, 0.1)); c.fillStyle = g; c.fillRect(0, 0, D, D);
    g = c.createLinearGradient(0, h - R, 0, h); g.addColorStop(0, "rgba(255,255,255,0.18)"); g.addColorStop(1, "rgba(255,255,255,0)"); c.fillStyle = g; c.beginPath(); c.ellipse(h, h - R * 0.42, R * 0.78, R * 0.5, 0, Math.PI, Math.PI * 2); c.fill();
    c.restore();
    c.lineWidth = 1; c.strokeStyle = rgba(colors.ink, 0.85); c.beginPath(); c.arc(h, h, R + 0.5, 0, Math.PI * 2); c.stroke();
    c.lineWidth = 3; c.strokeStyle = colors.paper2; c.beginPath(); c.arc(h, h, R + 2.5, 0, Math.PI * 2); c.stroke();
    c.lineWidth = 0.75; c.strokeStyle = rgba(colors.contour, 0.6); c.beginPath(); c.arc(h, h, R + 4.4, 0, Math.PI * 2); c.stroke();
    c.lineWidth = 1; c.strokeStyle = rgba(colors.ink, 0.6); c.beginPath();
    for (let q = 0; q < 4; q++) { const a = (q * Math.PI) / 2; c.moveTo(h + Math.cos(a) * (R - 1), h + Math.sin(a) * (R - 1)); c.lineTo(h + Math.cos(a) * (R - 8), h + Math.sin(a) * (R - 8)); }
    c.moveTo(h - 7, h); c.lineTo(h - 2.5, h); c.moveTo(h + 2.5, h); c.lineTo(h + 7, h); c.moveTo(h, h - 7); c.lineTo(h, h - 2.5); c.moveTo(h, h + 2.5); c.lineTo(h, h + 7);
    c.stroke();
    loupe.style.transform = `translate3d(${(cx - h).toFixed(2)}px, ${(cy - h).toFixed(2)}px, 0)`;
    loupe.style.opacity = L.o.toFixed(3);
  }
  function tick(now) {
    const dt = Math.min(48, lastT ? now - lastT : 16); lastT = now;
    if (reduce) { L.x = T.x; L.y = T.y; L.o = T.o; } else { const k = 1 - Math.exp(-dt / tau), ko = 1 - Math.exp(-dt / 150); L.x += (T.x - L.x) * k; L.y += (T.y - L.y) * k; L.o += (T.o - L.o) * ko; }
    drawLoupe();
    const settled = Math.abs(T.x - L.x) < 0.05 && Math.abs(T.y - L.y) < 0.05 && Math.abs(T.o - L.o) < 0.004;
    if (settled) { L.x = T.x; L.y = T.y; L.o = T.o; drawLoupe(); raf = 0; lastT = 0; return; }
    raf = requestAnimationFrame(tick);
  }
  const wake = () => { if (!raf && inView && S && parkable && loupe) raf = requestAnimationFrame(tick); };

  function onMove(e) {
    if (e.pointerType !== "mouse" || !S || !parkable) return;
    const r = host.getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top;
    const over = x > 6 && x < W - 6 && y > 6 && y < H - 6;
    if (over) { T.x = x; T.y = y; T.o = 1; tau = following ? 55 : 95; following = true; canvas.style.cursor = "none"; }
    else if (following) { following = false; tau = 240; park(); canvas.style.cursor = ""; }
    wake();
  }
  function onLeave() { if (!following) return; following = false; tau = 240; park(); canvas.style.cursor = ""; wake(); }

  const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; if (!inView && raf) { cancelAnimationFrame(raf); raf = 0; lastT = 0; } else if (inView) wake(); });
  io.observe(host);

  if (fine && !reduce && loupe) {
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
  }

  function full() { layout(); build(); render(); sizeLoupe(); park(); if (!following) { L.x = T.x; L.y = T.y; } if (fine && !reduce && loupe) { parkable = true; T.o = 1; if (reduce) L.o = 1; } wake(); }

  let ro = new ResizeObserver(() => { const r = host.getBoundingClientRect(); if (Math.abs(Math.round(r.width) - W) < 2 && Math.abs(Math.round(r.height) - H) < 2) return; full(); });
  ro.observe(host);

  full();

  return {
    setColors(c) { colors = { ...colors, ...c }; render(); drawLoupe(); },
    resize() { full(); },
    destroy() {
      if (raf) cancelAnimationFrame(raf); io.disconnect(); if (ro) ro.disconnect(); ro = null;
      host.removeEventListener("pointermove", onMove); host.removeEventListener("pointerleave", onLeave);
      canvas.style.cursor = "";
    },
  };
}
