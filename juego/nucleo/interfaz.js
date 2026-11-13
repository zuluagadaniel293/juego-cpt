// Botones, tarjetas y textos comunes de las pantallas.

// ======================= UTILIDADES =======================
function makeButton(scene, x, y, w, h, label, color, cb) {
  const r = scene.add.rectangle(x, y, w, h, color).setInteractive({ useHandCursor: true });
  scene.add.text(x, y, label, { font: 'bold 22px Arial', color: '#0f172a' }).setOrigin(0.5);
  r.on('pointerdown', cb);
  r.on('pointerover', () => r.setAlpha(0.85));
  r.on('pointerout', () => r.setAlpha(1));
  return r;
}

function drawCard(scene, x, y, w, h, fill, fillAlpha, stroke) {
  const g = scene.add.graphics();
  g.fillStyle(fill, fillAlpha);
  g.fillRoundedRect(x - w / 2, y - h / 2, w, h, 24);
  if (stroke !== undefined) {
    g.lineStyle(4, stroke, 1);
    g.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 24);
  }
  return g;
}

// ---------- Leer en voz alta (para los que todavía no leen bien) ----------
// Usa la voz del navegador (no gasta créditos de ElevenLabs y lee cualquier texto, con los nombres de cada mundo).
function speakText(text) {
  try {
    const s = window.speechSynthesis;
    if (!s || !text) return;
    s.cancel();
    const u = new SpeechSynthesisUtterance(String(text).replace(/\s+/g, ' ').replace(/([!?])\./g, '$1').replace(/[✔✘★👆]/g, ''));
    const vs = s.getVoices();
    const v = vs.find(x => /^es[-_](CO|MX|US|419)/i.test(x.lang)) || vs.find(x => /^es/i.test(x.lang));
    if (v) u.voice = v;
    u.lang = v ? v.lang : 'es-CO';
    u.rate = 0.95;
    s.speak(u);
  } catch (e) { /* sin voz disponible */ }
}
function stopSpeaking() { try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) { /* nada */ } }
// Niños de 5 a 7 años: las instrucciones se leen solas al aparecer
const youngPlayer = () => { const p = currentPlayer(); const a = p ? parseInt(p.age, 10) : NaN; return a > 0 && a <= 7; };
// Botón "🔊 Escuchar" que lee las instrucciones (getText devuelve el texto); list = objetos a borrar con la pantalla
function addSpeakButton(scene, x, y, getText, depth, list) {
  if (!window.speechSynthesis) return null;
  const b = scene.add.text(x, y, '🔊 Escuchar', { font: 'bold 18px Arial', color: '#0f172a', backgroundColor: '#fde047',
    padding: { x: 10, y: 6 } }).setOrigin(0.5).setDepth(depth || 0).setInteractive({ useHandCursor: true });
  b.on('pointerdown', () => speakText(getText()));
  if (list) list.push(b);
  if (youngPlayer()) scene.time.delayedCall(500, () => { if (b.active) speakText(getText()); });
  scene.events.once('shutdown', stopSpeaking);
  return b;
}

function backLink(scene, label, cb) {
  scene.add.text(30, 26, '‹ ' + label, { font: 'bold 20px Arial', color: '#ffffff', stroke: '#0f172a', strokeThickness: 5 })
    .setInteractive({ useHandCursor: true }).on('pointerdown', cb);
}

// ---------- Siluetas: lo bloqueado se ve como sombra, para dar curiosidad ----------
// Pinta una figura toda de un color, conservando su forma (canal alfa). Sirve para imágenes y emojis.
function paintSilhouette(scene, key, w, h, draw, color) {
  if (scene.textures.exists(key)) return key;
  const ct = scene.textures.createCanvas(key, w, h);
  const ctx = ct.getContext();
  draw(ctx);
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = color || '#0b1020';
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'source-over';
  ct.refresh();
  return key;
}
// Silueta de una textura del juego (personaje, objeto...). Si no se puede leer la imagen, devuelve null.
function silhouetteOf(scene, texKey, color) {
  try {
    const src = scene.textures.get(texKey).getSourceImage();
    const s = 256 / Math.max(src.width, src.height);
    const w = Math.round(src.width * s), h = Math.round(src.height * s);
    return paintSilhouette(scene, 'sil_' + texKey + (color || ''), w, h, ctx => ctx.drawImage(src, 0, 0, w, h), color);
  } catch (e) { return null; }
}
// Silueta de un emoji (para los mundos que todavía no existen)
function silhouetteEmoji(scene, emoji) {
  return paintSilhouette(scene, 'sil_emoji_' + emoji, 256, 256, ctx => {
    ctx.font = '210px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 128, 140);
  });
}
// Silueta misteriosa dentro de un círculo: fondo con luz suave, la sombra y un "?" que palpita
function mysteryNode(scene, x, y, r, silKey, accent) {
  const objs = [];
  objs.push(scene.add.circle(x, y, r, 0x475569).setStrokeStyle(4, accent === undefined ? 0x64748b : accent, 0.8));
  objs.push(scene.add.circle(x, y, r * 0.78, 0x64748b, 0.6));
  if (silKey) {
    const img = fit(scene.add.image(x, y + 2, silKey), r * 1.55);
    objs.push(img);
    scene.tweens.add({ targets: img, y: y - 3, duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }
  const q = scene.add.text(x + r * 0.62, y - r * 0.62, '?', { font: 'bold ' + Math.round(r * 0.6) + 'px Arial', color: '#fde047', stroke: '#0f172a', strokeThickness: 6 }).setOrigin(0.5);
  scene.tweens.add({ targets: q, scale: 1.2, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  objs.push(q);
  return objs;
}
// Tocar algo bloqueado: se sacude y da una pista abajo
function teaseLocked(scene, objs, msg) {
  if (scene.teasing) return;
  scene.teasing = true;
  fizzleSound();
  scene.tweens.add({ targets: objs, x: '+=6', duration: 50, yoyo: true, repeat: 3 });
  const t = scene.add.text(GAME_W / 2, GAME_H - 30, msg,
    { font: 'bold 20px Arial', color: '#fde047', stroke: '#0f172a', strokeThickness: 5 }).setOrigin(0.5).setDepth(30);
  scene.time.delayedCall(2200, () => { t.destroy(); scene.teasing = false; });
}

function starsText(n) { return '★'.repeat(n) + '☆'.repeat(3 - n); }

// Texto común de resultados para el niño (estrellas + qué tan bien le fue)
function drawKidSummary(scene, s, stars, verb, title) {
  const W = GAME_W;
  scene.add.text(W / 2, 60, title, { font: 'bold 46px Arial', color: '#ffffff' }).setOrigin(0.5);
  scene.add.text(W / 2, 130, starsText(stars), { font: '56px Arial', color: '#fde047' }).setOrigin(0.5);
  scene.add.text(W / 2, 215, verb + ' ' + s.hits + ' de ' + s.targets +
    '\nTe equivocaste ' + s.commissions + (s.commissions === 1 ? ' vez' : ' veces'),
    { font: '24px Arial', color: '#f1f5f9', align: 'center', lineSpacing: 8 }).setOrigin(0.5);
}
