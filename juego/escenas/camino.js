// Camino: un amigo recorre un camino saltando de piedra en piedra hasta la meta (la misión del mundo) y deja
// huellas. Las huellas se borran y el niño tiene que llevar al protagonista por ese mismo camino, de memoria.
// Memoria de trabajo visoespacial (como el Corsi, pero siguiendo una ruta) + atención.
// - Se juega tocando la piedra de al lado (o con las flechas). Si pisa una piedra que no era, la piedra se pone
//   roja y no avanza (sin castigo); con 2 errores seguidos en el mismo paso, la piedra correcta brilla un momento.
// - Con el nivel: caminos más largos y con más vueltas, el amigo va más rápido, y desde el nivel 4 el villano deja
//   huellas falsas mientras el amigo camina (hay que recordar solo las del amigo). En el nivel 1 las huellas no se
//   borran del todo.
// En el CSV: una fila por camino (objetivo: acierto = llegó · omisión = se acabó el tiempo) con su largo y errores,
// y una fila por cada piedra equivocada (distractor, error impulsivo, condición 'paso_equivocado').

const PATH_COLS = 6, PATH_ROWS = 4;
const pathXY = (c, r) => ({ x: 215 + c * 110, y: 165 + r * 92 });

Object.assign(GameScene.prototype, {
  setupPath() {
    const tex = TEX[this.themeKey], th = this.theme;
    this.pathStones = [];
    for (let c = 0; c < PATH_COLS; c++) for (let r = 0; r < PATH_ROWS; r++) {
      const { x, y } = pathXY(c, r);
      const st = this.add.ellipse(x, y, 92, 58, 0xe2e8f0, 0.28).setStrokeStyle(3, th.accent, 0.55).setDepth(0);
      st.cell = [c, r];
      st.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.pathTap(c, r));
      this.pathStones.push(st); this.mgObjects.push(st);
    }
    this.pathPrints = [];
    // el amigo guía: el mismo que ayuda en la Carrera
    this.pathGuideRole = raceHelper(this.themeKey);
    this.pathGuide = fit(this.add.image(0, 0, tex[this.pathGuideRole + '_run'] || tex[this.pathGuideRole]), 74).setDepth(5);
    this.pathHero = fit(this.add.image(0, 0, tex.hero), 74).setDepth(5);
    this.pathGoal = fit(this.add.image(0, 0, this.keys.target), 66).setDepth(4);
    this.mgObjects.push(this.pathGuide, this.pathHero, this.pathGoal);
    const key = (dc, dr) => () => {
      const c = this.pathCur;
      if (c && c.playing) { const [hc, hr] = c.route[c.step]; this.pathTap(hc + dc, hr + dr); }
    };
    this.input.keyboard.on('keydown-RIGHT', key(1, 0)); this.input.keyboard.on('keydown-LEFT', key(-1, 0));
    this.input.keyboard.on('keydown-UP', key(0, -1)); this.input.keyboard.on('keydown-DOWN', key(0, 1));
    this.pathCur = null;
    this.fb.setY(108).setFontSize(30);   // los mensajes, entre el contador de arriba y las piedras
  },

  // camino al azar de la columna 0 a la última, sin repetir piedras (a la derecha, arriba o abajo)
  makeRoute(turns) {
    for (let tries = 0; tries < 200; tries++) {
      let r = Phaser.Math.Between(0, PATH_ROWS - 1), c = 0, vert = 0;
      const route = [[0, r]], seen = new Set(['0,' + r]);
      while (c < PATH_COLS - 1) {
        const opts = [[c + 1, r]];
        if (vert < turns) [[c, r - 1], [c, r + 1]].forEach(o => { if (o[1] >= 0 && o[1] < PATH_ROWS && !seen.has(o.join(','))) opts.push(o, o); });
        const [nc, nr] = Phaser.Utils.Array.GetRandom(opts);
        if (nc === c) vert++;
        c = nc; r = nr; route.push([c, r]); seen.add(c + ',' + r);
      }
      if (vert >= Math.min(turns, 2)) return route;
    }
    return [0, 1, 2, 3, 4, 5].map(c => [c, 1]);
  },

  nextPath() {
    if (this.ended) return;
    if (this.trial > 0 && this.elapsed() >= this.params.sessionMs) { this.finish(); return; }
    this.trial++;
    const L = (this.level || 1) - 1;
    const route = this.makeRoute(Math.min(7, 2 + L));
    const stepMs = Math.max(380, 700 - 40 * L);
    const fakes = (this.level || 1) >= 4 ? Math.min(3, 1 + Math.floor((L - 3) / 2)) : 0;
    this.pathPrints.forEach(p => p.destroy()); this.pathPrints = [];
    this.pathStones.forEach(s => s.setFillStyle(0xe2e8f0, 0.28));
    const c = this.pathCur = { trial: this.trial, route, step: 0, errors: 0, streak: 0, playing: false, done: false,
      keepFaint: (this.level || 1) === 1, onset: null, lastMove: null };
    const start = pathXY(...route[0]), goal = pathXY(...route[route.length - 1]);
    this.pathGoal.setPosition(goal.x + 52, goal.y - 4).setVisible(true);
    this.pathHero.setVisible(false);
    this.pathGuide.setVisible(true).setPosition(start.x, start.y - 18).setAlpha(1);
    this.fb.setText('¡Mira el camino de ' + this.charName(this.pathGuideRole) + '!').setColor('#ffffff').setAlpha(1);
    // el amigo salta de piedra en piedra dejando huellas
    route.forEach(([cc, rr], i) => this.time.delayedCall(500 + i * stepMs, () => {
      if (this.ended || this.pathCur !== c) return;
      const p = pathXY(cc, rr);
      this.tweens.add({ targets: this.pathGuide, x: p.x, duration: stepMs * 0.7, ease: 'Quad.easeOut' });
      this.tweens.add({ targets: this.pathGuide, y: p.y - 18, duration: stepMs * 0.7, ease: 'Back.easeOut' });
      this.time.delayedCall(stepMs * 0.7, () => {
        if (this.pathCur !== c) return;
        this.pathPrint(p.x, p.y, this.theme.accent);
        tone(500 + i * 40, 0.06, 0.04, 'triangle');
      });
    }));
    // el villano deja huellas falsas (en piedras de al lado del camino), para confundir
    if (fakes) {
      const onRoute = new Set(route.map(q => q.join(',')));
      const near = [];
      route.forEach(([cc, rr]) => [[cc, rr - 1], [cc, rr + 1]].forEach(([a, b]) => {
        if (b >= 0 && b < PATH_ROWS && !onRoute.has(a + ',' + b)) near.push([a, b]);
      }));
      Phaser.Utils.Array.Shuffle(near).slice(0, fakes).forEach(([a, b], k) => this.time.delayedCall(700 + (k + 1) * stepMs * 1.6, () => {
        if (this.pathCur !== c) return;
        const p = pathXY(a, b);
        this.pathPrint(p.x, p.y, 0x4c1d95);
        this.logDistractor('visual_distractor', 'huella_falsa_del_villano');
      }));
    }
    const demoEnd = 500 + route.length * stepMs + 500;
    // las huellas se borran (en el nivel 1 quedan muy suaves) y empieza el niño
    this.time.delayedCall(demoEnd, () => {
      if (this.ended || this.pathCur !== c) return;
      this.tweens.add({ targets: this.pathPrints, alpha: c.keepFaint ? 0.15 : 0, duration: 700 });
      this.tweens.add({ targets: this.pathGuide, alpha: 0, duration: 400 });
      this.fb.setText('¡Ahora tú! Sigue el mismo camino').setAlpha(1);
      this.tweens.add({ targets: this.fb, alpha: 0, duration: 900, delay: 900 });
      this.pathHero.setVisible(true).setPosition(start.x, start.y - 18);
      c.playing = true; c.onset = performance.now(); c.lastMove = c.onset;
      this.pathStones.find(s => s.cell[0] === route[0][0] && s.cell[1] === route[0][1]).setFillStyle(0x86efac, 0.45);
    });
  },

  // huellas (dos pies con deditos)
  pathPrint(x, y, color) {
    const g = this.add.graphics().setDepth(1);
    g.fillStyle(color, 0.9);
    g.fillEllipse(x - 12, y + 4, 14, 22); g.fillEllipse(x + 12, y - 4, 14, 22);
    [[-17, -11], [-12, -14], [-7, -11], [7, -19], [12, -22], [17, -19]].forEach(([dx, dy]) => g.fillCircle(x + dx, y + dy, 3.5));
    this.pathPrints.push(g);
    return g;
  },

  // el niño toca una piedra (o usa las flechas): solo cuentan las de al lado
  pathTap(cc, rr) {
    const c = this.pathCur;
    if (!c || !c.playing || c.done || !this.started || this.ended) return;
    if (cc < 0 || rr < 0 || cc >= PATH_COLS || rr >= PATH_ROWS) return;
    const [hc, hr] = c.route[c.step];
    if (Math.abs(cc - hc) + Math.abs(rr - hr) !== 1) return;
    const now = performance.now();
    const [nc, nr] = c.route[c.step + 1];
    const stone = this.pathStones.find(s => s.cell[0] === cc && s.cell[1] === rr);
    const p = pathXY(cc, rr);
    if (cc === nc && rr === nr) {
      c.step++; c.streak = 0; c.lastMove = now;
      this.tweens.add({ targets: this.pathHero, x: p.x, y: p.y - 18, duration: 160, ease: 'Quad.easeOut' });
      stone.setFillStyle(0x86efac, 0.45);
      tone(600 + c.step * 40, 0.06, 0.04, 'triangle');
      if (c.step === c.route.length - 1) this.endPath(true);
    } else {
      // piedra equivocada: se pone roja, el personaje intenta y vuelve
      c.errors++; c.streak++;
      fizzleSound();
      stone.setFillStyle(0xef4444, 0.5);
      this.time.delayedCall(450, () => { if (this.pathCur === c && !c.done) stone.setFillStyle(0xe2e8f0, 0.28); });
      const h = pathXY(hc, hr);
      this.tweens.add({ targets: this.pathHero, x: (h.x + p.x) / 2, y: (h.y + p.y) / 2 - 18, duration: 110, yoyo: true });
      this.logTrial(c.trial, 'distractor', 'piedra_equivocada', now, true, now - c.lastMove, 'commission');
      Object.assign(this.log[this.log.length - 1], { condition: 'paso_equivocado', step: c.step + 1 });
      if (c.streak >= 2) {   // ayudita: la piedra correcta brilla un momento
        const q = pathXY(nc, nr);
        const glow = this.add.ellipse(q.x, q.y, 100, 64, 0xfde047, 0.5).setDepth(0);
        this.tweens.add({ targets: glow, alpha: 0, duration: 900, onComplete: () => glow.destroy() });
        c.hints = (c.hints || 0) + 1; c.streak = 0;
      }
    }
  },

  endPath(done) {
    const c = this.pathCur;
    if (!c || c.done) return;
    c.done = true; c.playing = false;
    const total = c.onset ? performance.now() - c.onset : 0;
    this.logTrial(c.trial, 'target', 'camino', c.onset || performance.now(), true, total, done ? 'hit' : 'omission');
    Object.assign(this.log[this.log.length - 1], { condition: 'camino_de_memoria', path_len: c.route.length - 1,
      exits: c.errors, hints: c.hints || 0 });
    if (done) {
      rewardSound();
      this.fb.setText(c.errors === 0 ? '¡Perfecto, lo recordaste todo!' : '¡Llegaste!').setColor('#86efac').setAlpha(1);
      this.tweens.add({ targets: this.fb, alpha: 0, duration: 900, delay: 500 });
      this.rescueEffect(this.pathGoal.x, this.pathGoal.y);
      this.tweens.add({ targets: this.pathPrints, alpha: 0.9, duration: 300 });   // muestra el camino que era
    }
    this.time.delayedCall(1600, () => this.nextPath());
  },

  updatePath() {}
});
