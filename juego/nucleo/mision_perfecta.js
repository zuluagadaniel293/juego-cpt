// Misión perfecta: completar 3 niveles con 100% de aciertos (cada día, en cada mundo).
// Cada mundo tiene un tesoro redondo partido en 3 pedazos; cada pedazo se llena según la precisión
// de un nivel (si le faltó el 10%, al pedazo le falta un 10%). Se guardan los 3 mejores niveles del día.
// Si assets/manifest.js le asigna una imagen 'treasure' al mundo, se usa esa imagen recortada en pedazos.

const TREASURES = {
  heroes:  { name: 'el Escudo del Héroe', style: 'shield' },
  fantasy: { name: 'la Gema de Fuego',    style: 'gem' },
  kingdom: { name: 'el Pastel Real',      style: 'cake' }
};
const PERFECT_LEVELS = 3;

// Precisión del nivel: respuestas correctas (aciertos + distractores bien ignorados) sobre todos los estímulos.
// Así el 100% exige no despistarse y tampoco responder de más.
function levelAccuracy(log) {
  if (log.some(r => r.event_type === 'memory_trial')) return memoryStats(log).hitRate;   // caminos recordados
  const st = log.filter(r => r.event_type === 'stimulus');
  if (!st.length) return 0;
  return st.filter(r => r.outcome === 'hit' || r.outcome === 'correct_rejection').length / st.length;
}
function getPerfect() {
  const p = store.get('cpt_perfect', {}), today = dayKey(new Date());
  return p.day === today ? p : { day: today };
}
const perfectPieces = theme => getPerfect()[theme] || [];
const perfectCount = pieces => pieces.filter(a => a >= 1).length;

// Suma un nivel terminado; devuelve los pedazos antes y después
function addPerfectLevel(theme, acc) {
  const p = getPerfect(), before = (p[theme] || []).slice();
  p[theme] = before.concat(acc).sort((a, b) => b - a).slice(0, PERFECT_LEVELS);
  store.set('cpt_perfect', p);
  return { before, after: p[theme] };
}

// Dibuja el tesoro. Devuelve { redraw(pieces) } para animar el llenado.
function drawTreasure(scene, theme, x, y, r, pieces, depth) {
  const D = depth || 0, style = TREASURES[theme].style, deg = Phaser.Math.DegToRad;
  const imgKey = TEX[theme].treasure;
  const ghost = scene.add.graphics().setDepth(D);
  const g = scene.add.graphics().setDepth(D + 2);   // encima de la imagen: cortes y brillo
  const objects = [ghost, g];
  let img = null, maskG = null;
  if (imgKey) {   // con imagen: la imagen se ve tenue y los pedazos ganados se ven a todo color
    objects.push(fit(scene.add.image(x, y, imgKey), r * 2).setDepth(D).setAlpha(0.22));
    img = fit(scene.add.image(x, y, imgKey), r * 2).setDepth(D + 1);
    objects.push(img);
    maskG = scene.make.graphics({ add: false });
    img.setMask(maskG.createGeometryMask());
  }
  // pedazo i: de -90° + 120°*i, lleno en la fracción f
  const slice = (gr, rad, i, f, color, alpha) => {
    if (f <= 0) return;
    const a0 = -90 + 120 * i;
    gr.fillStyle(color, alpha === undefined ? 1 : alpha);
    gr.slice(x, y, rad, deg(a0), deg(a0 + 120 * Math.min(1, f)), false);
    gr.fillPath();
  };
  const polar = (a, rad) => [x + Math.cos(deg(a)) * rad, y + Math.sin(deg(a)) * rad];

  // Fondo: el tesoro "por completar" en sombra, con las divisiones de los pedazos
  ghost.fillStyle(0xffffff, 0.1); ghost.fillCircle(x, y, r);
  ghost.lineStyle(Math.max(2, r / 20), 0xffffff, 0.35); ghost.strokeCircle(x, y, r);
  for (let i = 0; i < 3; i++) { const [px, py] = polar(-90 + 120 * i, r); ghost.lineBetween(x, y, px, py); }

  const redraw = ps => {
    g.clear();
    if (maskG) {
      // todos los pedazos en una sola figura: en modo Canvas el recorte solo usa la última figura
      maskG.clear();
      maskG.fillStyle(0xffffff, 1);
      maskG.beginPath();
      for (let i = 0; i < 3; i++) {
        const f = Math.min(1, ps[i] || 0), a0 = -90 + 120 * i;
        if (f <= 0) continue;
        maskG.moveTo(x, y);
        for (let a = a0; a < a0 + 120 * f; a += 4) maskG.lineTo(...polar(a, r));
        maskG.lineTo(...polar(a0 + 120 * f, r));
        maskG.lineTo(x, y);
      }
      maskG.fillPath();
    }
    for (let i = 0; i < 3; i++) {
      const f = ps[i] || 0;
      if (maskG) continue;
      if (style === 'shield') {          // escudo: anillos rojo, blanco, azul y centro amarillo
        slice(g, r, i, f, 0xdc2626); slice(g, r * 0.8, i, f, 0xf1f5f9); slice(g, r * 0.6, i, f, 0x2563eb); slice(g, r * 0.32, i, f, 0xfde047);
      } else if (style === 'gem') {      // gema: naranja con centro dorado y facetas
        slice(g, r, i, f, 0xea580c); slice(g, r * 0.78, i, f, 0xf97316); slice(g, r * 0.42, i, f, 0xfacc15);
        g.lineStyle(Math.max(1, r / 30), 0xfff7ed, 0.7);
        for (let a = 0; a < 120 * Math.min(1, f); a += 30) {
          const [ax, ay] = polar(-90 + 120 * i + a, r * 0.42), [bx, by] = polar(-90 + 120 * i + a + 15, r * 0.95);
          g.lineBetween(ax, ay, bx, by);
        }
      } else {                            // pastel (visto desde arriba): borde de crema, betún rosado, chispas y fresa
        slice(g, r, i, f, 0xfef3c7); slice(g, r * 0.86, i, f, 0xf9a8d4);
        const colors = [0x38bdf8, 0xfde047, 0x86efac, 0xffffff];
        for (let k = 0; k < 7; k++) {
          const a = 8 + k * 15;
          if (a > 120 * f) break;
          const [sx, sy] = polar(-90 + 120 * i + a, r * (0.3 + 0.45 * ((k * 37) % 10) / 10));
          g.fillStyle(colors[k % 4], 1); g.fillCircle(sx, sy, Math.max(1.5, r / 22));
        }
        if (f >= 1) { const [cx, cy] = polar(-30 + 120 * i, r * 0.6); g.fillStyle(0xe11d48, 1); g.fillCircle(cx, cy, r / 8); }
      }
    }
    // Cortes entre pedazos (para que se vea que son 3); completo, el tesoro se ve entero
    if (perfectCount(ps) < 3) {
      g.lineStyle(Math.max(1.5, r / 25), 0x0f172a, 0.55);
      for (let i = 0; i < 3; i++) if (ps[i] > 0 || ps[(i + 2) % 3] >= 1) { const [px, py] = polar(-90 + 120 * i, r); g.lineBetween(x, y, px, py); }
    }
    // Completo: brillo dorado alrededor y estrella al centro
    if (ps.length >= 3 && perfectCount(ps) >= 3) {
      g.lineStyle(Math.max(3, r / 12), 0xfde047, 1); g.strokeCircle(x, y, r + r / 14);
      if (style === 'shield' && !imgKey) {   // la imagen ya trae su estrella
        const pts = [];
        for (let k = 0; k < 10; k++) pts.push(new Phaser.Math.Vector2(...polar(-90 + 36 * k, k % 2 ? r * 0.13 : r * 0.3)));
        g.fillStyle(0xffffff, 1); g.fillPoints(pts, true);
      }
    }
  };
  redraw(pieces);
  return { redraw, objects };
}

// En resultados de Historia y Desafío: suma el nivel y anima el pedazo que se llenó
function perfectMissionPanel(scene, theme, log) {
  const acc = levelAccuracy(log);
  const { before, after } = addPerfectLevel(theme, acc);
  const x = 852, y = 190, r = 62;
  const t = drawTreasure(scene, theme, x, y, r, before);
  scene.add.text(x, y - r - 22, 'Misión perfecta', { font: 'bold 17px Arial', color: '#fde047' }).setOrigin(0.5);
  scene.add.text(x, y + r + 20, 'Este nivel: ' + Math.round(acc * 100) + '%', { font: 'bold 17px Arial', color: '#ffffff' }).setOrigin(0.5);
  scene.add.text(x, y + r + 44, perfectCount(after) + ' de ' + PERFECT_LEVELS + ' al 100%', { font: '16px Arial', color: '#cbd5e1' }).setOrigin(0.5);
  // llena los pedazos poco a poco
  const anim = { k: 0 };
  scene.tweens.add({ targets: anim, k: 1, delay: 400, duration: 900, ease: 'Sine.easeInOut',
    onUpdate: () => t.redraw(after.map((a, i) => (before[i] || 0) + (a - (before[i] || 0)) * anim.k)) });
  const justDone = perfectCount(before) < PERFECT_LEVELS && perfectCount(after) >= PERFECT_LEVELS;
  if (justDone) scene.time.delayedCall(1500, () => perfectCelebration(scene, theme));
  else if (acc >= 1) scene.time.delayedCall(1300, () => rewardSound());
}

function perfectCelebration(scene, theme) {
  const W = GAME_W, H = GAME_H, D = 60, it = [];
  const add = o => { it.push(o.setDepth(D)); return o; };
  add(scene.add.rectangle(0, 0, W, H, 0x0f172a, 0.94).setOrigin(0).setInteractive());
  add(scene.add.text(W / 2, 70, '¡Misión perfecta cumplida!', { font: 'bold 42px Arial', color: '#fde047' }).setOrigin(0.5));
  it.push(...drawTreasure(scene, theme, W / 2, 230, 100, [1, 1, 1], D).objects);
  add(scene.add.text(W / 2, 406, 'Completaste ' + TREASURES[theme].name + ':\n3 niveles con 100% de aciertos', { font: '26px Arial', color: '#f1f5f9', align: 'center', lineSpacing: 8 }).setOrigin(0.5));
  [0, 1, 2].forEach(k => scene.time.delayedCall(k * 160, () => rewardSound()));
  const r = add(scene.add.rectangle(W / 2, 485, 240, 56, 0xfde047).setInteractive({ useHandCursor: true }));
  add(scene.add.text(W / 2, 485, '¡Genial!', { font: 'bold 24px Arial', color: '#0f172a' }).setOrigin(0.5));
  r.on('pointerdown', () => it.forEach(o => o.destroy()));
}

// Pantalla inicial: los 3 tesoros pequeños del día
function drawPerfectMission(scene, x, y) {
  scene.add.text(x, y - 18, 'Misión perfecta: 3 niveles al 100%', { font: 'bold 16px Arial', color: '#e2e8f0' }).setOrigin(0.5);
  Object.keys(TREASURES).forEach((t, i) => drawTreasure(scene, t, x - 70 + i * 70, y + 18, 19, perfectPieces(t)));
}
