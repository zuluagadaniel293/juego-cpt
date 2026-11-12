// Camino: el niño lleva al protagonista por un camino hasta la meta (la misión del mundo) sin salirse.
// Como las pruebas de precisión visomotora: mide el control al moverse (salirse = moverse muy rápido / sin control).
// - Se juega arrastrando el dedo o el ratón (el personaje sigue al puntero) o con las flechas.
// - Si se sale, el personaje se pone gris y no avanza hasta que vuelva al camino (sin castigo).
// - Con el nivel el camino es más angosto y con más curvas. Desde el nivel 3, "Recuerda el camino": se ve unos
//   segundos y luego se borra casi del todo (hay que recordarlo; al salirse se vuelve a ver un momento).
// En el CSV: una fila por camino (objetivo: acierto = llegó a la meta · omisión = no alcanzó) con las salidas y el
// tiempo fuera, y una fila por cada salida (distractor, error impulsivo, condición 'salida').

Object.assign(GameScene.prototype, {
  setupPath() {
    this.pathG = this.add.graphics().setDepth(1);
    this.mgObjects.push(this.pathG);
    this.pathHero = fit(this.add.image(0, 0, TEX[this.themeKey].hero), 64).setDepth(5);
    this.pathGoal = fit(this.add.image(0, 0, this.keys.target), 70).setDepth(4);
    this.mgObjects.push(this.pathHero, this.pathGoal);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.pathPointer = null;
    this.input.on('pointerdown', p => { this.pathPointer = this.cameras.main.getWorldPoint(p.x, p.y); });
    this.input.on('pointermove', p => { if (p.isDown) this.pathPointer = this.cameras.main.getWorldPoint(p.x, p.y); });
    this.input.on('pointerup', () => { this.pathPointer = null; });
    this.pathCur = null;
  },

  // Camino nuevo: una curva suave de izquierda a derecha por puntos al azar
  nextPath() {
    if (this.ended) return;
    if (this.trial > 0 && this.elapsed() >= this.params.sessionMs) { this.finish(); return; }
    this.trial++;
    const L = (this.level || 1) - 1;
    const width = Math.max(44, 92 - 6 * L);
    const n = Math.min(8, 4 + Math.floor(L / 2));   // más puntos = más curvas
    const ctrl = [];
    for (let i = 0; i <= n; i++) {
      const x = 150 + (730 * i) / n;
      const y = i === 0 || i === n ? Phaser.Math.Between(220, 360) : Phaser.Math.Between(140, 420);
      ctrl.push(new Phaser.Math.Vector2(x, y));
    }
    const curve = new Phaser.Curves.Spline(ctrl);
    const pts = curve.getSpacedPoints(Math.round(curve.getLength() / 6));
    const hide = (this.level || 1) >= 3;
    this.pathCur = { trial: this.trial, pts, width, idx: 0, onset: performance.now(), exits: 0, outMs: 0, off: false,
      hide, done: false, visible: 1 };
    this.drawPath(1);
    const s = pts[0], e = pts[pts.length - 1];
    this.pathHero.setPosition(s.x, s.y).clearTint();
    this.pathGoal.setPosition(e.x, e.y);
    this.tweens.add({ targets: this.pathGoal, scale: { from: this.pathGoal.scale * 0.6, to: this.pathGoal.scale }, duration: 350, ease: 'Back.easeOut' });
    if (hide) {
      this.fb.setText('¡Mira bien el camino!').setAlpha(1);
      this.time.delayedCall(2200, () => {
        if (this.pathCur && this.pathCur.trial === this.trial && !this.pathCur.done) {
          this.fb.setText('¡Ahora recuérdalo!');
          this.tweens.add({ targets: this.fb, alpha: 0, duration: 900 });
          this.fadePath(0.18);
        }
      });
    }
  },

  // dibuja el camino con un borde del color del mundo; a = qué tan visible
  drawPath(a) {
    const c = this.pathCur, g = this.pathG, col = this.theme.accent;
    c.visible = a;
    g.clear();
    g.lineStyle(c.width + 10, 0x0f172a, 0.35 * a); g.strokePoints(c.pts);
    g.lineStyle(c.width, col, 0.45 * a); g.strokePoints(c.pts);
    g.lineStyle(3, 0xffffff, 0.5 * a);
    for (let i = 0; i < c.pts.length - 6; i += 12) g.lineBetween(c.pts[i].x, c.pts[i].y, c.pts[i + 4].x, c.pts[i + 4].y);   // rayitas del centro
  },
  fadePath(to) {
    const c = this.pathCur, o = { a: c.visible };
    this.tweens.add({ targets: o, a: to, duration: 600, onUpdate: () => { if (this.pathCur === c) this.drawPath(o.a); } });
  },

  updatePath(dt) {
    const c = this.pathCur;
    if (!c || c.done) return;
    const h = this.pathHero, maxStep = 900 * dt;   // sigue al dedo casi sin retraso
    // hacia dónde quiere ir: el puntero (arrastrando) o las flechas
    let tx = h.x, ty = h.y;
    if (this.pathPointer) { tx = this.pathPointer.x; ty = this.pathPointer.y; }
    else {
      const k = this.cursors, v = 260 * dt;
      tx += (k.right.isDown ? v : 0) - (k.left.isDown ? v : 0);
      ty += (k.down.isDown ? v : 0) - (k.up.isDown ? v : 0);
    }
    const dx = tx - h.x, dy = ty - h.y, d = Math.hypot(dx, dy);
    if (d > 0.5) {
      const f = Math.min(1, maxStep / d);
      h.x = Phaser.Math.Clamp(h.x + dx * f, 20, GAME_W - 20); h.y = Phaser.Math.Clamp(h.y + dy * f, 60, GAME_H - 20);
    }
    // punto del camino más cercano, cerca de donde va (no puede saltar a una parte lejana del camino)
    let best = c.idx, bd = Infinity;
    const from = Math.max(0, c.idx - 15), to = Math.min(c.pts.length - 1, c.idx + 70);
    for (let i = from; i <= to; i++) {
      const q = c.pts[i], dd = (q.x - h.x) ** 2 + (q.y - h.y) ** 2;
      if (dd < bd) { bd = dd; best = i; }
    }
    const off = Math.sqrt(bd) > c.width / 2;
    if (off && !c.off) {
      // se salió: cuenta una salida; el personaje se pone gris y el camino se vuelve a ver un momento
      c.off = true; c.exits++;
      c.offAt = performance.now();
      fizzleSound();
      h.setTint(0x64748b);
      this.fb.setText('¡Vuelve al camino!').setColor('#fca5a5').setAlpha(1);
      if (c.hide) { this.drawPath(0.7); }
      this.logTrial(c.trial, 'distractor', 'salida', c.offAt, true, c.offAt - c.onset, 'commission');
      this.log[this.log.length - 1].condition = 'salida';
    } else if (!off && c.off) {
      c.off = false;
      c.outMs += performance.now() - c.offAt;
      h.clearTint();
      this.fb.setAlpha(0).setColor('#86efac');
      if (c.hide) this.fadePath(0.18);
    }
    if (!off) c.idx = Math.max(c.idx, best);   // solo avanza dentro del camino
    if (!off && c.idx >= c.pts.length - 8) this.endPath(true);   // llegó a la meta (a menos de ~50 px)
  },

  endPath(done) {
    const c = this.pathCur;
    if (!c || c.done) return;
    c.done = true;
    if (c.off) c.outMs += performance.now() - c.offAt;
    const total = performance.now() - c.onset;
    this.logTrial(c.trial, 'target', 'camino', c.onset, true, total, done ? 'hit' : 'omission');
    Object.assign(this.log[this.log.length - 1], { condition: c.hide ? 'camino_de_memoria' : 'camino_visible',
      exits: c.exits, out_ms: Math.round(c.outMs), path_width: c.width });
    if (done) {
      rewardSound();
      this.fb.setText(c.exits === 0 ? '¡Perfecto, sin salirte!' : '¡Llegaste!').setColor('#86efac').setAlpha(1);
      this.tweens.add({ targets: this.fb, alpha: 0, duration: 900, delay: 400 });
      this.rescueEffect(this.pathGoal.x, this.pathGoal.y);
      this.drawPath(1);
    }
    this.time.delayedCall(1300, () => this.nextPath());
  }
});
