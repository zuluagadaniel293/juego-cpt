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

function backLink(scene, label, cb) {
  scene.add.text(30, 26, '‹ ' + label, { font: 'bold 20px Arial', color: '#ffffff', stroke: '#0f172a', strokeThickness: 5 })
    .setInteractive({ useHandCursor: true }).on('pointerdown', cb);
}

function starsText(n) { return '★'.repeat(n) + '☆'.repeat(3 - n); }

// Texto común de resultados para el niño (estrellas + qué tan bien le fue)
function drawKidSummary(scene, s, stars, verb, title) {
  const W = scene.scale.width;
  scene.add.text(W / 2, 60, title, { font: 'bold 46px Arial', color: '#ffffff' }).setOrigin(0.5);
  scene.add.text(W / 2, 130, starsText(stars), { font: '56px Arial', color: '#fde047' }).setOrigin(0.5);
  scene.add.text(W / 2, 215, verb + ' ' + s.hits + ' de ' + s.targets +
    '\nTe equivocaste ' + s.commissions + (s.commissions === 1 ? ' vez' : ' veces'),
    { font: '24px Arial', color: '#f1f5f9', align: 'center', lineSpacing: 8 }).setOrigin(0.5);
}
