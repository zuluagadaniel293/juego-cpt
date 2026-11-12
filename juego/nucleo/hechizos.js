// Lo que dice el villano pasa de verdad: cuando suelta su amenaza del capítulo ("¡Congelaré el río!"), el fondo
// cambia unos segundos (el río se congela) y luego vuelve a la normalidad.
// Todo ocurre DETRÁS de los objetos del juego (no los tapa) y queda en el CSV como 'hechizo_<efecto>'.
// Solo en Historia y Desafío (la Prueba fija no tiene voces de personajes).

// Efecto de cada amenaza, en el orden de los capítulos (los textos están en distractors.voices.amenaza de cada mundo)
const THREAT_FX = {
  heroes:  ['takeover', 'stamp', 'smoke', 'dark', 'seal'],
  fantasy: ['kidnap', 'vines', 'freeze', 'seal', 'fire'],
  kingdom: ['dark', 'mess:escoba_magica', 'mess:libro_volador', 'seal', 'takeover'],
  space:   ['takeover', 'meteors', 'dark', 'freeze', 'seal'],
  ocean:   ['dark', 'ink', 'vines', 'ink', 'seal'],
  dinos:   ['kidnap', 'flood', 'fire', 'dark', 'seal'],
  robots:  ['glitch', 'glitch', 'dark', 'glitch', 'dark'],
  jungle:  ['hypno', 'kidnap', 'vines', 'steal', 'seal'],
  candy:   ['sour', 'sour', 'fire', 'takeover', 'seal']
};
const THREAT_MS = 5500;   // cuánto dura el efecto

function runThreatFx(scene, chapterIdx) {
  const list = THREAT_FX[scene.themeKey];
  if (!list || scene.mode === 'prueba' || scene.threatBusy) return;
  const [fx, arg] = (list[chapterIdx] || list[0]).split(':');
  scene.threatBusy = true;
  // empieza cuando el villano ya dijo buena parte de la frase
  scene.time.delayedCall(900, () => {
    if (scene.ended) { scene.threatBusy = false; return; }
    const objs = [];
    const done = () => { objs.forEach(o => o.destroy()); scene.threatBusy = false; };
    (THREAT_DRAW[fx] || THREAT_DRAW.takeover)(scene, objs, arg);
    scene.logDistractor('visual_distractor', 'hechizo_' + fx + (arg ? '_' + arg : ''));
    // al final todo se desvanece y el fondo vuelve a ser el de antes
    scene.time.delayedCall(THREAT_MS, () => {
      const live = objs.filter(o => o.active);
      if (!live.length) { done(); return; }
      scene.tweens.add({ targets: live, alpha: 0, duration: 700, onComplete: done });
    });
  });
}

// Capa que tiñe el fondo (detrás de los objetos y de los personajes)
function tint(scene, objs, color, alpha) {
  const r = scene.add.rectangle(0, 0, GAME_W, GAME_H, color, 1).setOrigin(0).setDepth(-3).setAlpha(0);
  objs.push(r);
  scene.tweens.add({ targets: r, alpha, duration: 600 });
  return r;
}
const edgeX = () => (Math.random() < 0.5 ? Phaser.Math.Between(20, 110) : Phaser.Math.Between(GAME_W - 110, GAME_W - 20));

const THREAT_DRAW = {
  // se apagan las luces: todo el fondo se oscurece
  dark(scene, objs) { tint(scene, objs, 0x020617, 0.55); },
  // se congela: tinte celeste y escarcha que crece por abajo y por los lados
  freeze(scene, objs) {
    tint(scene, objs, 0xbae6fd, 0.35);
    for (let i = 0; i < 14; i++) {
      const bottom = i < 8, x = bottom ? Phaser.Math.Between(0, GAME_W) : edgeX(), y = bottom ? GAME_H - Phaser.Math.Between(0, 30) : Phaser.Math.Between(80, 480);
      const c = scene.add.star(x, y, 6, 6, Phaser.Math.Between(16, 30), 0xffffff, 0.85).setStrokeStyle(2, 0x7dd3fc).setDepth(-2).setScale(0);
      objs.push(c);
      scene.tweens.add({ targets: c, scale: 1, angle: 30, duration: 500, delay: i * 60 });
    }
  },
  // fuego o calor: resplandor naranja desde abajo y chispas que suben
  fire(scene, objs) {
    tint(scene, objs, 0xea580c, 0.25);
    const glow = scene.add.rectangle(0, GAME_H, GAME_W, 120, 0xf97316, 0.45).setOrigin(0, 1).setDepth(-3);
    objs.push(glow);
    scene.tweens.add({ targets: glow, alpha: 0.25, duration: 400, yoyo: true, repeat: -1 });
    const ev = scene.time.addEvent({ delay: 120, repeat: 40, callback: () => {
      const e = scene.add.circle(Phaser.Math.Between(0, GAME_W), GAME_H, Phaser.Math.Between(3, 6), Phaser.Utils.Array.GetRandom([0xfde047, 0xf97316, 0xef4444]), 0.9).setDepth(-2);
      objs.push(e);
      scene.tweens.add({ targets: e, y: Phaser.Math.Between(250, 420), alpha: 0, duration: 1500, onComplete: () => e.destroy() });
    } });
    objs.push({ get active() { return false; }, destroy() { ev.remove(); } });
  },
  // tinta: manchas oscuras que crecen en las esquinas
  ink(scene, objs) {
    tint(scene, objs, 0x1e1b4b, 0.25);
    [[0, 0], [GAME_W, 0], [0, GAME_H], [GAME_W, GAME_H]].forEach(([x, y], i) => {
      const b = scene.add.circle(x, y, 150, 0x1e1b4b, 0.8).setDepth(-2).setScale(0);
      objs.push(b);
      scene.tweens.add({ targets: b, scale: 1, duration: 800, delay: i * 150, ease: 'Back.easeOut' });
    });
  },
  // todo se vuelve agrio: tinte amarillo verdoso y gotas de limón por los bordes
  sour(scene, objs) {
    tint(scene, objs, 0xd9f99d, 0.35);
    const drop = TEX[scene.themeKey].fx_fly_1;
    for (let i = 0; i < 10; i++) {
      const x = edgeX();
      const d = drop ? fit(scene.add.image(x, -30, drop), 34).setAngle(90) : scene.add.circle(x, -30, 9, 0xfde047, 0.9);
      d.setDepth(-2); objs.push(d);
      scene.tweens.add({ targets: d, y: GAME_H + 30, duration: 1600, delay: i * 400, repeat: 1 });
    }
  },
  // falla de computador: el fondo parpadea con franjas de colores
  glitch(scene, objs) {
    const t = tint(scene, objs, 0x22c55e, 0.15);
    const ev = scene.time.addEvent({ delay: 180, repeat: 25, callback: () => {
      t.fillColor = Phaser.Utils.Array.GetRandom([0x22c55e, 0xd946ef, 0x0ea5e9, 0x000000]);
      const bar = scene.add.rectangle(0, Phaser.Math.Between(40, GAME_H - 20), GAME_W, Phaser.Math.Between(6, 22), Phaser.Utils.Array.GetRandom([0x22c55e, 0xd946ef, 0xffffff]), 0.35)
        .setOrigin(0, 0.5).setDepth(-2);
      objs.push(bar);
      scene.time.delayedCall(160, () => bar.destroy());
    } });
    objs.push({ get active() { return false; }, destroy() { ev.remove(); } });
  },
  // hipnosis: espirales que giran en las esquinas
  hypno(scene, objs) {
    tint(scene, objs, 0x581c87, 0.2);
    const sp = TEX[scene.themeKey].fx_fly_1;
    [[90, 140], [GAME_W - 90, 140], [90, GAME_H - 110], [GAME_W - 90, GAME_H - 110]].forEach(([x, y]) => {
      const s = sp ? fit(scene.add.image(x, y, sp), 120) : scene.add.circle(x, y, 50, 0xc084fc, 0).setStrokeStyle(10, 0xc084fc, 0.8);
      s.setDepth(-2).setAlpha(0.8); objs.push(s);
      scene.tweens.add({ targets: s, angle: 360, duration: 1500, repeat: -1 });
    });
  },
  // enredaderas o algas que crecen desde abajo por los bordes
  vines(scene, objs) {
    [40, 110, GAME_W - 110, GAME_W - 40].forEach((x, i) => {
      const g = scene.add.graphics().setDepth(-2);
      g.lineStyle(10, 0x15803d, 1);
      const pts = [];
      for (let y = GAME_H; y > 120; y -= 20) pts.push(new Phaser.Math.Vector2(x + Math.sin(y / 40 + i) * 18, y));
      g.strokePoints(pts);
      g.fillStyle(0x4ade80, 1);
      pts.forEach((p, k) => { if (k % 3 === 1) g.fillEllipse(p.x + (k % 2 ? 14 : -14), p.y, 26, 12); });
      g.y = GAME_H; objs.push(g);
      scene.tweens.add({ targets: g, y: 0, duration: 1200, delay: i * 150, ease: 'Sine.easeOut' });
    });
  },
  // se cierra: paredes de piedra entran por los dos lados
  seal(scene, objs) {
    tint(scene, objs, 0x0f172a, 0.3);
    [0, 1].forEach(side => {
      const g = scene.add.graphics().setDepth(-2);
      g.fillStyle(0x57534e, 1); g.fillRect(0, 0, 90, GAME_H);
      g.lineStyle(3, 0x292524, 1);
      for (let y = 0; y < GAME_H; y += 36) { g.lineBetween(0, y, 90, y); g.lineBetween((y / 36) % 2 ? 45 : 20, y, (y / 36) % 2 ? 45 : 20, y + 36); }
      g.x = side ? GAME_W : -90; objs.push(g);
      scene.tweens.add({ targets: g, x: side ? GAME_W - 90 : 0, duration: 700, ease: 'Bounce.easeOut' });
    });
    scene.cameras.main.shake(200, 0.003);
  },
  // lluvia de rocas por detrás
  meteors(scene, objs) {
    const keys = [1, 2, 3].map(i => TEX[scene.themeKey]['fx_fly_' + i]).filter(Boolean);
    const ev = scene.time.addEvent({ delay: 350, repeat: 14, callback: () => {
      const x = Phaser.Math.Between(100, GAME_W + 100);
      const m = keys.length ? fit(scene.add.image(x, -40, Phaser.Utils.Array.GetRandom(keys)), Phaser.Math.Between(34, 50))
        : scene.add.circle(x, -40, 14, 0x78716c, 1);
      m.setDepth(-2); objs.push(m);
      scene.tweens.add({ targets: m, x: x - 260, y: GAME_H + 40, duration: 1800, onComplete: () => m.destroy() });
    } });
    objs.push({ get active() { return false; }, destroy() { ev.remove(); } });
  },
  // pinta su marca por todas partes (en los bordes). Es su cara, no la señal del juego, para no confundir al niño.
  stamp(scene, objs) {
    const key = TEX[scene.themeKey].villain_face || TEX[scene.themeKey].villain;
    [[60, 120], [GAME_W - 60, 120], [60, 300], [GAME_W - 60, 300], [200, GAME_H - 50], [GAME_W - 200, GAME_H - 50]].forEach(([x, y], i) => {
      const s = fit(scene.add.image(x, y, key), 70).setDepth(-2).setAlpha(0.7).setAngle(Phaser.Math.Between(-20, 20));
      const sc = s.scale; s.setScale(sc * 2).setAlpha(0);
      objs.push(s);
      scene.tweens.add({ targets: s, scale: sc, alpha: 0.7, duration: 220, delay: i * 250 });
      scene.time.delayedCall(i * 250, () => noise(0.08, 0.06, 'lowpass', 400, 200));
    });
  },
  // hace volar cosas del mundo (escobas, libros) por los bordes
  mess(scene, objs, what) {
    const key = TEX[scene.themeKey]['distractor_' + what];
    if (!key) return THREAT_DRAW.takeover(scene, objs);
    for (let i = 0; i < 6; i++) {
      const left = i % 2 === 0, x = left ? 70 : GAME_W - 70, y = 110 + Math.floor(i / 2) * 140;
      const o = fit(scene.add.image(x, y, key), 60).setDepth(-2).setAlpha(0);
      objs.push(o);
      scene.tweens.add({ targets: o, alpha: 1, duration: 300, delay: i * 120 });
      scene.tweens.add({ targets: o, x: x + (left ? 40 : -40), y: y - 30, angle: left ? 20 : -20, duration: 500, yoyo: true, repeat: -1, delay: i * 120 });
    }
  },
  // se roba el tesoro (o se lleva al objetivo del mundo) cruzando por arriba
  steal(scene, objs) { showLootRun(scene, objs, TEX[scene.themeKey].treasure); },
  kidnap(scene, objs) { showLootRun(scene, objs, TEX[scene.themeKey].target, true); },
  // "¡Será mío!": el fondo se tiñe con el color del villano y su silueta aparece muy suave al fondo
  takeover(scene, objs) {
    tint(scene, objs, 0x4c1d95, 0.3);
    const v = fit(scene.add.image(GAME_W / 2, GAME_H / 2 + 20, TEX[scene.themeKey].villain_laugh || TEX[scene.themeKey].villain), 420)
      .setDepth(-3).setAlpha(0).setTint(0x000000);
    objs.push(v);
    scene.tweens.add({ targets: v, alpha: 0.18, duration: 800 });
  },
  // inundación: el agua sube desde abajo
  flood(scene, objs) {
    const w = scene.add.rectangle(0, GAME_H, GAME_W, 130, 0x38bdf8, 0.45).setOrigin(0, 0).setDepth(-2);
    objs.push(w);
    scene.tweens.add({ targets: w, y: GAME_H - 130, duration: 1200, ease: 'Sine.easeOut', onComplete: () =>
      scene.tweens.add({ targets: w, y: GAME_H - 118, duration: 600, yoyo: true, repeat: -1 }) });
  },
  // humo gris que cubre los bordes
  smoke(scene, objs) {
    tint(scene, objs, 0x475569, 0.25);
    const key = TEX[scene.themeKey].fx_splat;
    for (let i = 0; i < 8; i++) {
      const x = edgeX(), y = Phaser.Math.Between(90, 500);
      const s = key ? fit(scene.add.image(x, y, key), 160) : scene.add.ellipse(x, y, 160, 70, 0x64748b, 1);
      s.setDepth(-2).setAlpha(0).setScale(s.scale * 0.5);
      objs.push(s);
      scene.tweens.add({ targets: s, alpha: 0.75, scale: s.scale * 2, duration: 900, delay: i * 120 });
    }
  }
};
// El villano cruza por arriba llevándose algo (tesoro u objetivo del mundo)
// caught: lo lleva atrapado en una burbuja (si es el objetivo del juego, así no se confunde con uno que hay que tocar)
function showLootRun(scene, objs, lootKey, caught) {
  const tex = TEX[scene.themeKey], left = Math.random() < 0.5, y = 92;
  const from = left ? -90 : GAME_W + 90, to = left ? GAME_W + 90 : -90, dir = left ? 1 : -1;
  const v = fit(scene.add.image(from, y, tex.villain_run), 84).setDepth(-2).setFlipX(!left);
  const loot = fit(scene.add.image(from + 44 * dir, y - 24, lootKey), 46).setDepth(-2);
  objs.push(v, loot);
  if (caught) {
    loot.setAlpha(0.8);
    // encerrado en una burbuja: se ve que va atrapado
    const net = scene.add.circle(loot.x, loot.y, 30, 0xe0f2fe, 0.35).setStrokeStyle(3, 0xffffff, 0.9).setDepth(-2);
    objs.push(net);
    scene.tweens.add({ targets: net, y: '-=7', duration: 170, yoyo: true, repeat: -1 });
    scene.tweens.add({ targets: net, x: '+=' + (to - from), duration: 4200 });
  }
  scene.tweens.add({ targets: [v, loot], y: '-=7', duration: 170, yoyo: true, repeat: -1 });
  scene.tweens.add({ targets: [v, loot], x: '+=' + (to - from), duration: 4200 });
}
