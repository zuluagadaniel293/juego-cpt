// Dibujos provisionales comunes (personajes, red, efectos de poderes, iconos).

// ======================= DIBUJOS PROVISIONALES =======================
function starPoints(cx, cy, R, r) {
  const p = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5;
    const d = i % 2 ? r : R;
    p.push({ x: cx + d * Math.cos(a), y: cy + d * Math.sin(a) });
  }
  return p;
}

// Hada: todas iguales, solo cambia el color
function drawFairy(g, color, light) {
  g.fillStyle(light, 0.8); g.fillEllipse(48, 74, 48, 66); g.fillEllipse(112, 74, 48, 66);
  g.fillStyle(color, 1); g.fillTriangle(80, 70, 42, 146, 118, 146);
  g.fillStyle(color, 1); g.fillEllipse(80, 36, 54, 32);
  g.fillStyle(0xf5c49c, 1); g.fillCircle(80, 52, 22);
  g.fillStyle(0x0f172a, 1); g.fillCircle(72, 52, 3); g.fillCircle(88, 52, 3);
  g.fillStyle(0xfde047, 1); g.fillPoints(starPoints(126, 108, 12, 5), true);
}

// Personaje (villanos y amigos): capa, traje, cabeza, pelo/sombrero, antifaz y emblema
function drawPerson(g, o) {
  if (o.cape !== undefined) { g.fillStyle(o.cape, 1); g.fillTriangle(80, 62, 30, 152, 130, 152); }
  g.fillStyle(o.suit, 1); g.fillRoundedRect(54, 72, 52, 76, 16);
  if (o.ears) { g.fillStyle(0xf5c49c, 1); g.fillTriangle(54, 44, 34, 30, 58, 58); g.fillTriangle(106, 44, 126, 30, 102, 58); }
  g.fillStyle(0xf5c49c, 1); g.fillCircle(80, 48, 24);
  if (o.beard) { g.fillStyle(0xffffff, 1); g.fillTriangle(60, 56, 100, 56, 80, 96); }
  if (o.hair !== undefined) { g.fillStyle(o.hair, 1); g.fillEllipse(80, 30, 52, 24); }
  if (o.hat !== undefined) { g.fillStyle(o.hat, 1); g.fillTriangle(80, 0, 52, 32, 108, 32); }
  if (o.mask !== undefined) { g.fillStyle(o.mask, 1); g.fillRect(56, 40, 48, 12); }
  g.fillStyle(0xffffff, 1); g.fillCircle(71, 46, 4); g.fillCircle(89, 46, 4);
  g.fillStyle(0x0f172a, 1); g.fillCircle(71, 46, 2); g.fillCircle(89, 46, 2);
  if (o.emblem !== undefined) { g.fillStyle(o.emblem, 1); g.fillCircle(80, 100, 11); }
}

function drawNet(g, villain) {
  g.lineStyle(10, 0x92400e, 1); g.lineBetween(80, 110, 80, 156);
  g.lineStyle(6, 0xe5e7eb, 1); g.strokeEllipse(80, 66, 130, 92);
  g.lineStyle(2, 0xe5e7eb, villain ? 0.9 : 0.6);
  for (let i = -3; i <= 3; i++) {
    g.lineBetween(80 + i * 16, 24, 80 + i * 16, 108);
    g.lineBetween(20, 66 + i * 12, 140, 66 + i * 12);
  }
}

function buildTextures(scene) {
  const S = 160;
  const make = (key, drawFn) => {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    drawFn(g);
    g.generateTexture(key, S, S);
    g.destroy();
  };

  // --- Objetivos y distractores de cada mundo (ver modos/historia/mundos/) ---
  WORLD_TEXTURES.forEach(fn => fn(make));

  // --- Villanos, amigos y redes ---
  Object.keys(PEOPLE).forEach(k => make(k, g => drawPerson(g, PEOPLE[k])));
  make('net', g => drawNet(g, false));

  // --- Efectos de los poderes ---
  const small = (key, size, fn) => {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    fn(g);
    g.generateTexture(key, size, size);
    g.destroy();
  };
  Object.keys(POWERS).forEach(t => small('spark_' + t, 16, g => {
    g.fillStyle(POWERS[t].color, 1); g.fillCircle(8, 8, 8);
    g.fillStyle(0xffffff, 0.9); g.fillCircle(8, 8, 3);
  }));
  small('puff', 20, g => { g.fillStyle(0x94a3b8, 0.8); g.fillCircle(10, 10, 10); });
  small('fireball', 48, g => {
    g.fillStyle(0xef4444, 1); g.fillCircle(24, 24, 22);
    g.fillStyle(0xf97316, 1); g.fillCircle(24, 24, 16);
    g.fillStyle(0xfde047, 1); g.fillCircle(24, 24, 9);
  });
  small('magicstar', 36, g => {
    g.fillStyle(0xf9a8d4, 1); g.fillPoints(starPoints(18, 19, 17, 7), true);
    g.fillStyle(0xffffff, 1); g.fillCircle(18, 18, 4);
  });

  // --- Canasta del minijuego Atrapa ---
  make('basket', g => {
    g.fillStyle(0x92400e, 1);
    g.fillPoints([{x:12,y:70},{x:148,y:70},{x:128,y:140},{x:32,y:140}], true);
    g.lineStyle(4, 0x78350f, 1);
    g.lineBetween(40, 92, 120, 92); g.lineBetween(46, 116, 114, 116);
    g.fillStyle(0xb45309, 1); g.fillRoundedRect(4, 60, 152, 16, 6);
  });

  // --- Iconos ---
  make('icon_map', g => {
    g.fillStyle(0x38bdf8, 1);
    g.fillPoints([{x:10,y:40},{x:55,y:28},{x:55,y:128},{x:10,y:140}], true);
    g.fillPoints([{x:105,y:40},{x:150,y:28},{x:150,y:128},{x:105,y:140}], true);
    g.fillStyle(0x7dd3fc, 1);
    g.fillPoints([{x:55,y:28},{x:105,y:40},{x:105,y:140},{x:55,y:128}], true);
    g.lineStyle(6, 0xef4444, 1);
    g.lineBetween(116, 54, 132, 70); g.lineBetween(132, 54, 116, 70);
  });
  make('icon_trophy', g => {
    g.lineStyle(8, 0xfb923c, 1);
    g.strokeCircle(40, 52, 16); g.strokeCircle(120, 52, 16);
    g.fillStyle(0xfb923c, 1);
    g.fillRect(44, 24, 72, 40); g.fillCircle(80, 64, 36);
    g.fillRect(72, 98, 16, 22);
    g.fillStyle(0xc2410c, 1); g.fillRoundedRect(48, 118, 64, 18, 5);
    g.fillStyle(0xfff7ed, 1); g.fillPoints(starPoints(80, 58, 18, 8), true);
  });
  make('icon_lock', g => {
    g.lineStyle(14, 0x94a3b8, 1);
    g.beginPath(); g.arc(80, 66, 28, Math.PI, 0); g.strokePath();
    g.lineBetween(52, 64, 52, 82); g.lineBetween(108, 64, 108, 82);
    g.fillStyle(0x94a3b8, 1); g.fillRoundedRect(36, 78, 88, 62, 12);
  });
  make('icon_find', g => {
    g.lineStyle(14, 0x38bdf8, 1); g.strokeCircle(68, 68, 38);
    g.lineStyle(20, 0x38bdf8, 1); g.lineBetween(98, 98, 140, 140);
  });
}
