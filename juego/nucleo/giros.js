// Variedad entre mundos: cada mundo trae su "giro" y una escena propia del villano.
// Solo en Historia y Desafío: la Prueba fija y el modo Memoria no cambian, para poder comparar sesiones.
// Lo que cambia es cómo se ven o se mueven las cosas, no qué hay que responder; el giro queda en el CSV.

// ---------- Giro de cada mundo (desde el capítulo 2, o el nivel 2 del Desafío) ----------
// motion = cómo llegan los objetos · ambient = algo que pasa por detrás de todo · event = algo que pasa de vez en cuando
// (Superhéroes es el primer mundo: se juega sin giro para aprender)
const WORLD_TWISTS = {
  fantasy: { name: 'Niebla mágica', desc: 'Una niebla mágica pasa por los bordes. ¡No te distraigas!', ambient: 'fog' },
  kingdom: { name: 'Hechizo giratorio', desc: 'El duende hechizó todo: las cosas llegan girando.', motion: 'spin' },
  space:   { name: 'Gravedad cero', desc: 'Sin gravedad, las cosas flotan de un lado a otro.', motion: 'float' },
  ocean:   { name: 'Corriente marina', desc: 'La corriente empuja las cosas hacia los lados.', motion: 'current', ambient: 'bubbles' },
  dinos:   { name: 'Temblor', desc: 'A veces la tierra tiembla. ¡Sigue concentrado!', event: 'quake' },
  robots:  { name: 'Modo turbo', desc: 'Unas cosas llegan más rápido y otras más lento.', motion: 'turbo' },
  jungle:  { name: 'Lluvia de hojas', desc: 'Caen hojas de los árboles. ¡Mira bien entre ellas!', ambient: 'leaves' },
  candy:   { name: 'Gomitas saltarinas', desc: 'Todo llega dando saltitos.', motion: 'hop', ambient: 'sprinkles' }
};
function worldTwist(scene) {
  const t = WORLD_TWISTS[scene.themeKey];
  if (!t) return null;
  if (scene.mode === 'historia') return scene.boss || scene.chapter >= 1 ? t : null;
  if (scene.mode === 'desafio') return (scene.level || 1) >= 2 ? t : null;
  return null;
}

// Movimiento del giro para un objeto que acaba de aparecer (Clásico, Atrapa, Carrera y Encuentra)
function twistItem(scene, img, it) {
  const t = scene.twist;
  if (!t || !t.motion) return;
  const m = t.motion;
  if (it) {   // Atrapa y Carrera: lo mueve updateTwistItem en cada cuadro
    // y0: el carril donde termina (en Carrera, lo lanzado llega a otro carril)
    it.tw = { t: Math.random() * 6.28, x0: img.x, y0: it.lane != null && scene.lanes ? scene.lanes[it.lane] : img.y, off: 0 };
    if (m === 'current') it.tw.vx = (Math.random() < 0.5 ? -1 : 1) * Phaser.Math.Between(25, 45);
    if (m === 'turbo') it.tw.k = Phaser.Utils.Array.GetRandom([0.75, 0.85, 1, 1.2, 1.3]);
    return;
  }
  // Clásico y Encuentra: una animación corta sobre el objeto quieto
  if (m === 'spin') { img.setAngle(-120); scene.tweens.add({ targets: img, angle: 0, duration: 220, ease: 'Back.easeOut' }); }
  else if (m === 'float') scene.tweens.add({ targets: img, y: img.y - 12, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  else if (m === 'current') scene.tweens.add({ targets: img, x: img.x + (Math.random() < 0.5 ? -16 : 16), duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  else if (m === 'hop') scene.tweens.add({ targets: img, y: img.y - 16, duration: 160, yoyo: true, repeat: 1, ease: 'Quad.easeOut' });
  else if (m === 'turbo') { const sx = img.scaleX; img.scaleX = sx * 0.3; scene.tweens.add({ targets: img, scaleX: sx, duration: 140 }); }
}
// Atrapa (cae) y Carrera (avanza): el giro se suma al movimiento normal. Devuelve el factor de velocidad.
function updateTwistItem(scene, it, dt) {
  const tw = it.tw;
  if (!tw) return 1;
  const m = scene.twist.motion;
  tw.t += dt;
  if (scene.mg === 'catch') {
    if (m === 'float') it.img.x = tw.x0 + Math.sin(tw.t * 2.2) * 28;
    else if (m === 'current') it.img.x = Phaser.Math.Clamp(it.img.x + tw.vx * dt, 60, GAME_W - 60);
    else if (m === 'spin') it.img.angle += 120 * dt;
    else if (m === 'hop') { const off = -Math.abs(Math.sin(tw.t * 7)) * 12; it.img.y += off - tw.off; tw.off = off; }   // saltitos sin frenar la caída
  } else {
    if (m === 'float' || m === 'hop') it.img.y = tw.y0 + (m === 'hop' ? -Math.abs(Math.sin(tw.t * 7)) * 14 : Math.sin(tw.t * 3) * 10);
    else if (m === 'spin') it.img.angle += 140 * dt;
  }
  return m === 'turbo' ? tw.k : 1;
}

// Lo que pasa por detrás de todo (no tapa los objetos del juego) y los temblores
function startTwistAmbient(scene) {
  const t = scene.twist;
  if (!t) return;
  const W = GAME_W, H = GAME_H, DEPTH = -2;
  const loop = (min, max, fn) => {
    const go = () => { if (scene.ended) return; fn(); scene.time.delayedCall(Phaser.Math.Between(min, max), go); };
    scene.time.delayedCall(Phaser.Math.Between(min, max), go);
  };
  if (t.ambient === 'fog') loop(2500, 4500, () => {
    // nubes de niebla por la franja de arriba o la de abajo
    const top = Math.random() < 0.5, y = top ? Phaser.Math.Between(70, 130) : Phaser.Math.Between(470, 520);
    const left = Math.random() < 0.5;
    const f = scene.add.ellipse(left ? -200 : W + 200, y, Phaser.Math.Between(260, 380), 70, 0xe9d5ff, 0.22).setDepth(DEPTH);
    scene.tweens.add({ targets: f, x: left ? W + 200 : -200, duration: Phaser.Math.Between(9000, 13000), onComplete: () => f.destroy() });
  });
  if (t.ambient === 'bubbles') loop(500, 1100, () => {
    const x = Math.random() < 0.5 ? Phaser.Math.Between(15, 90) : Phaser.Math.Between(W - 90, W - 15);
    const b = scene.add.circle(x, H + 20, Phaser.Math.Between(5, 13), 0xbae6fd, 0.25).setStrokeStyle(2, 0xffffff, 0.6).setDepth(DEPTH);
    scene.tweens.add({ targets: b, y: -20, x: x + Phaser.Math.Between(-20, 20), duration: Phaser.Math.Between(3500, 5500), onComplete: () => b.destroy() });
  });
  if (t.ambient === 'leaves') loop(600, 1200, () => {
    const x = Phaser.Math.Between(20, W - 20);
    const l = scene.add.ellipse(x, -20, 26, 12, Phaser.Utils.Array.GetRandom([0x22c55e, 0x16a34a, 0x86efac, 0xa3e635]), 0.85)
      .setStrokeStyle(2, 0x14532d, 0.8).setDepth(DEPTH);
    scene.tweens.add({ targets: l, y: H + 20, x: x + Phaser.Math.Between(-80, 80), angle: Phaser.Math.Between(-360, 360),
      duration: Phaser.Math.Between(5000, 7500), onComplete: () => l.destroy() });
  });
  if (t.ambient === 'sprinkles') loop(250, 600, () => {
    const x = Phaser.Math.Between(10, W - 10);
    const s = scene.add.rectangle(x, -10, 12, 4, Phaser.Utils.Array.GetRandom([0xf472b6, 0x60a5fa, 0xfde047, 0x4ade80, 0xffffff]), 0.8).setDepth(DEPTH)
      .setAngle(Phaser.Math.Between(0, 180));
    scene.tweens.add({ targets: s, y: H + 10, angle: s.angle + 360, duration: Phaser.Math.Between(4000, 6000), onComplete: () => s.destroy() });
  });
  if (t.event === 'quake') loop(9000, 15000, () => {
    // la tierra tiembla un momento (queda en el CSV como distractor)
    scene.cameras.main.shake(380, 0.005);
    noise(0.5, 0.12, 'lowpass', 160, 60);
    const bum = scene.add.text(Math.random() < 0.5 ? 90 : W - 90, 70, '¡BUM!',
      { font: 'bold 26px Arial', color: '#fde68a', stroke: '#78350f', strokeThickness: 6 }).setOrigin(0.5).setDepth(DEPTH).setScale(0.5);
    scene.tweens.add({ targets: bum, scale: 1.2, alpha: 0, duration: 800, onComplete: () => bum.destroy() });
    scene.logDistractor('visual_distractor', 'temblor');
  });
}

// ---------- Escena propia del villano en cada mundo: se asoma por un borde y lanza algo ----------
// Lo que lanza cae en el borde (nunca en el centro, donde están los objetos del juego) y se desvanece.
const WORLD_SPLASH = {
  heroes:  { name: 'humo', say: '¡PUF!', color: 0x334155, shape: 'blob' },
  fantasy: { name: 'hechizo', say: '¡ZAP!', color: 0xa855f7, shape: 'star' },
  kingdom: { name: 'pastelazo', say: '¡SPLAT!', color: 0xfbcfe8, shape: 'blob' },
  space:   { name: 'meteoritos', say: '¡PUM!', color: 0x78716c, shape: 'rock' },
  ocean:   { name: 'tinta', say: '¡TINTA!', color: 0x111827, shape: 'blob' },
  dinos:   { name: 'barro', say: '¡PLOF!', color: 0x92400e, shape: 'blob' },
  robots:  { name: 'error', say: '¡ERROR!', color: 0x22c55e, shape: 'pixel' },
  jungle:  { name: 'hipnosis', say: '¡SSS!', color: 0xc084fc, shape: 'ring' },
  candy:   { name: 'jugo_agrio', say: '¡AGRIO!', color: 0xfde047, shape: 'blob' }
};
function showSplashScene(scene, objs, end, DEPTH) {
  const W = GAME_W, sp = WORLD_SPLASH[scene.themeKey] || WORLD_SPLASH.heroes, tex = TEX[scene.themeKey];
  // por el lado derecho si abajo a la izquierda están el protagonista o el compañero
  const left = Math.random() < 0.5 && !scene.caster && !scene.buddy, dir = left ? 1 : -1;
  const y = scene.mg === 'memory' ? 200 : Phaser.Math.Between(200, 320);
  const off = left ? -80 : W + 80, inX = left ? 45 : W - 45;
  const v = fit(scene.add.image(off, y, tex.villain_laugh), 100).setDepth(DEPTH).setFlipX(!left);
  objs.push(v);
  scene.tweens.add({ targets: v, x: inX, duration: 400, ease: 'Sine.easeOut', onComplete: () => {
    const say = scene.add.text(inX + 30 * dir, y - 70, sp.say, { font: 'bold 22px Arial', color: '#fde047', stroke: '#0f172a', strokeThickness: 5 })
      .setOrigin(0.5).setDepth(DEPTH);
    objs.push(say);
    sweep('triangle', 500, 180, 0.3, 0.05);
    for (let i = 0; i < 4; i++) {
      // cada mancha vuela pegada al borde, hacia arriba o hacia abajo
      const tx = left ? Phaser.Math.Between(15, 100) : Phaser.Math.Between(W - 100, W - 15);
      const ty = Phaser.Math.Clamp(y + Phaser.Math.Between(-170, 170), 70, 500);
      const r = Phaser.Math.Between(10, 18);
      const blob = sp.shape === 'pixel' ? scene.add.rectangle(inX, y, r * 1.6, r * 1.6, sp.color, 0.9)
        : sp.shape === 'ring' ? scene.add.circle(inX, y, r, sp.color, 0).setStrokeStyle(5, sp.color, 0.9)
        : sp.shape === 'star' ? scene.add.star(inX, y, 5, r * 0.5, r * 1.2, sp.color, 0.9)
        : scene.add.circle(inX, y, r, sp.color, sp.shape === 'rock' ? 1 : 0.85);
      blob.setDepth(DEPTH);
      objs.push(blob);
      scene.tweens.add({ targets: blob, x: tx, y: ty, duration: 320, delay: i * 120, ease: 'Quad.easeOut',
        onComplete: () => scene.tweens.add({ targets: blob, scale: 1.8, alpha: 0, duration: 1400, delay: 300 }) });
    }
    scene.time.delayedCall(2300, () => scene.tweens.add({ targets: [v, say], x: off, alpha: 0, duration: 400, onComplete: end }));
  } });
}
// El villano cruza por arriba robándose el tesoro del mundo
function showStealScene(scene, objs, end, DEPTH) {
  const W = GAME_W, tex = TEX[scene.themeKey];
  const left = Math.random() < 0.5, y = Phaser.Math.Between(80, 100);
  const from = left ? -90 : W + 90, to = left ? W + 90 : -90, dir = left ? 1 : -1;
  const v = fit(scene.add.image(from, y, tex.villain_run), 80).setDepth(DEPTH).setFlipX(!left);
  const loot = fit(scene.add.image(from + 42 * dir, y - 22, tex.treasure || tex.target), 40).setDepth(DEPTH);
  objs.push(v, loot);
  scene.tweens.add({ targets: [v, loot], y: '-=7', duration: 170, yoyo: true, repeat: -1 });
  scene.tweens.add({ targets: [v, loot], x: '+=' + (to - from), duration: 3800, onComplete: end });
  sweep('square', 900, 500, 0.15, 0.03);
}
