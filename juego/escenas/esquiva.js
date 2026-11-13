// Esquiva: el villano lanza 3 poderes a la vez, uno por carril. Llegan como sombras iguales y, a mitad de camino,
// se descubren: uno de ellos SE DETIENE y desaparece. Ese carril es el seguro: hay que ponerse ahí antes de que
// los otros dos lleguen. (Como en Atrapa, donde lo que cae se descubre al cruzar la línea.)
// - Si el carril seguro es otro: ensayo "cambiar" (objetivo) → acierto si llegó a tiempo · omisión si le cayó.
// - Si el carril seguro es justo donde ya estaba: ensayo "quedarse" (distractor) → ignoró bien si se quedó ·
//   error impulsivo si se movió antes de que se descubriera o terminó en otro carril.
// - 'anticipo' = se movió antes de que se descubriera cuál se detenía (adivinó en vez de esperar).
// - 'detiene_ms' (columna freno_ms) = cuántos ms después del lanzamiento se descubrió el seguro.
// Según cómo está dibujado el poder, el villano lo lanza de frente (desde la derecha, el protagonista se mueve
// arriba/abajo) o lo deja caer desde arriba (el protagonista se mueve a la izquierda/derecha).

// side: true = de frente (de derecha a izquierda) · pointsRight: el dibujo apunta a la derecha (hay que voltearlo)
// powers: imágenes que se mezclan ('w:' = papel del propio mundo, 'mundo:papel' = de otro mundo, sin prefijo = común)
// mark: marca que deja al chocar
const DODGE_WORLD = {
  heroes:  { side: true, pointsRight: true,  powers: ['w:fx_fly_1'], mark: 'w:fx_splat', one: 'la nube de humo', many: 'las nubes de humo' },
  fantasy: { side: true, pointsRight: false, powers: ['w:fx_fly_1'], mark: 'mk_estallido', one: 'el hechizo', many: 'los hechizos' },
  kingdom: { side: true, pointsRight: true,  powers: ['w:fx_fly_1'], mark: 'w:fx_splat', one: 'el pastel', many: 'los pasteles' },
  space:   { side: false, powers: ['w:fx_fly_1', 'w:fx_fly_2', 'w:fx_fly_3'], mark: 'mk_crater', one: 'el meteorito', many: 'los meteoritos' },
  ocean:   { side: true, pointsRight: false, powers: ['w:fx_fly_1'], mark: 'w:fx_splat', one: 'la bola de tinta', many: 'las bolas de tinta' },
  dinos:   { side: true, pointsRight: true,  powers: ['w:fx_fly_1'], mark: 'w:fx_splat', one: 'la bola de barro', many: 'las bolas de barro' },
  robots:  { side: true, pointsRight: true,  powers: ['w:fx_fly_1'], mark: 'w:fx_splat', one: 'el bloque de error', many: 'los bloques de error' },
  jungle:  { side: true, pointsRight: false, powers: ['w:fx_fly_1'], mark: 'mk_espiral', spin: true, one: 'la espiral', many: 'las espirales' },
  candy:   { side: true, pointsRight: false, powers: ['w:fx_fly_1'], mark: 'w:fx_splat', one: 'el chorro de jugo', many: 'los chorros de jugo' }
};
// "del meteorito" / "de la nube de humo"
const dodgeOf = s => s.replace(/^el /, 'del ').replace(/^la /, 'de la ');
// "uno" / "una" según lo que lanza
const dodgeUno = s => (/^la /.test(s) ? 'una' : 'uno');
const DODGE_COLS = [300, 480, 660];        // carriles cuando caen desde arriba
const DODGE_ROWS = [205, 325, 445];        // carriles cuando vienen de frente
const DODGE_FLOOR = GAME_H - 34;
const DODGE_HERO_X = 170;                  // de frente: dónde está el protagonista
const DODGE_WALL_X = 34;                   // de frente: la pared de atrás, donde se estrellan los poderes

function dodgeTex(scene, spec) {
  if (!spec) return null;
  let key = spec;
  if (spec.includes(':')) {
    const [t, r] = spec.split(':');
    key = (TEX[t === 'w' ? scene.themeKey : t] || {})[r];
  }
  return key && scene.textures.exists(key) ? key : null;
}

Object.assign(GameScene.prototype, {
  setupDodge() {
    const W = GAME_W, tex = TEX[this.themeKey];
    const cfg = this.dodgeCfg = DODGE_WORLD[this.themeKey] || DODGE_WORLD.heroes;
    this.dodgeLane = 1;
    const g = this.add.graphics();
    if (cfg.side) {
      // tres franjas horizontales; el protagonista a la izquierda, el villano a la derecha
      DODGE_ROWS.forEach(y => { g.fillStyle(0xffffff, 0.08); g.fillRoundedRect(60, y - 48, W - 120, 96, 30); });
      // la pared de atrás, donde se estrellan los poderes
      g.fillStyle(0x0f172a, 0.45); g.fillRect(0, 140, DODGE_WALL_X + 10, 370);
      g.lineStyle(3, 0xffffff, 0.25); g.lineBetween(DODGE_WALL_X + 10, 140, DODGE_WALL_X + 10, 510);
      this.dodgeHero = fit(this.add.image(DODGE_HERO_X, DODGE_ROWS[1], tex.hero), 104).setDepth(4);
      this.dodgeVillain = fit(this.add.image(W - 70, DODGE_ROWS[1], tex.villain_laugh || tex.villain), 118).setDepth(4).setFlipX(true);
    } else {
      DODGE_COLS.forEach(x => { g.fillStyle(0xffffff, 0.1); g.fillEllipse(x, DODGE_FLOOR - 4, 150, 34); });
      this.dodgeHero = fit(this.add.image(DODGE_COLS[1], DODGE_FLOOR, tex.hero).setOrigin(0.5, 1), 130).setDepth(4);
      this.dodgeVillain = fit(this.add.image(DODGE_COLS[1], 140, tex.villain_laugh || tex.villain), 100).setDepth(4);   // debajo del recordatorio
    }
    this.mgObjects.push(g, this.dodgeHero, this.dodgeVillain);
    this.tweens.add({ targets: this.dodgeVillain, angle: { from: -4, to: 4 }, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    const lanes = cfg.side ? DODGE_ROWS : DODGE_COLS;
    const move = d => {
      if (!this.started || this.ended) return;
      const lane = Phaser.Math.Clamp(this.dodgeLane + d, 0, 2);
      if (lane === this.dodgeLane) return;
      this.dodgeLane = lane;
      this.tweens.killTweensOf(this.dodgeHero);
      this.tweens.add({ targets: this.dodgeHero, [cfg.side ? 'y' : 'x']: lanes[lane], duration: 110, ease: 'Quad.easeOut' });
      const c = this.dodgeCur;
      if (c && !c.done) {
        const now = performance.now();
        if (!c.moved) { c.moved = true; c.firstMove = now; }
        if (!c.revealed) c.anticipated = true;
      }
    };
    if (cfg.side) {
      ['UP', 'W'].forEach(k => this.input.keyboard.on('keydown-' + k, () => move(-1)));
      ['DOWN', 'S'].forEach(k => this.input.keyboard.on('keydown-' + k, () => move(1)));
      this.input.on('pointerdown', p => {
        const y = this.cameras.main.getWorldPoint(p.x, p.y).y;
        if (y < this.dodgeHero.y - 40) move(-1); else if (y > this.dodgeHero.y + 40) move(1);
      });
    } else {
      ['LEFT', 'A'].forEach(k => this.input.keyboard.on('keydown-' + k, () => move(-1)));
      ['RIGHT', 'D'].forEach(k => this.input.keyboard.on('keydown-' + k, () => move(1)));
      this.input.on('pointerdown', p => {
        const x = this.cameras.main.getWorldPoint(p.x, p.y).x;
        if (x < this.dodgeHero.x - 40) move(-1); else if (x > this.dodgeHero.x + 40) move(1);
      });
    }
    this.dodgeCur = null;
  },

  nextDodge() {
    if (this.ended || (this.dodgeCur && !this.dodgeCur.done)) return;   // nunca dos tandas a la vez
    if (this.elapsed() >= this.params.sessionMs) { this.finish(); return; }
    this.trial++;
    const v = this.dodgeVillain;
    // el villano se prepara (se infla) y lanza los tres
    this.tweens.add({ targets: v, scaleX: v.scaleX * 1.15, scaleY: v.scaleY * 0.9, duration: 160, yoyo: true,
      onComplete: () => { if (!this.ended) this.throwVolley(); } });
  },

  throwVolley() {
    const P = this.params, cfg = this.dodgeCfg, side = cfg.side;
    const safe = Phaser.Math.Between(0, 2);
    const travel = P.dodgeTravelMs, revealAt = Math.round(travel * P.dodgeStopFrac);
    this.dodgeIdle = 0;
    const c = this.dodgeCur = { trial: this.trial, safe, startLane: this.dodgeLane, onset: performance.now(), revealAt,
      moved: false, firstMove: null, anticipated: false, revealed: false, revealTime: null, done: false, orbs: [] };
    sweep('sine', 700, 380, 0.4, 0.035);
    const v = this.dodgeVillain;
    for (let lane = 0; lane < 3; lane++) {
      const key = dodgeTex(this, Phaser.Utils.Array.GetRandom(cfg.powers));
      const x0 = side ? v.x - 50 : v.x + (lane - 1) * 95, y0 = side ? v.y + (lane - 1) * 30 : v.y + 40;
      // de frente: pasa por donde está el protagonista (a los 'travel' ms) y sigue hasta estrellarse en la pared
      const x1 = side ? DODGE_WALL_X : DODGE_COLS[lane], y1 = side ? DODGE_ROWS[lane] : DODGE_FLOOR - 70;
      const dur = side ? travel * (x0 - DODGE_WALL_X) / (x0 - DODGE_HERO_X) : travel;
      const orb = key ? fit(this.add.image(x0, y0, key), 78) : this.add.circle(x0, y0, 26, POWERS[this.themeKey].color, 1);
      if (key) { orb.setTint(0x0f172a); if (side && cfg.pointsRight) orb.setFlipX(true); }   // sombra: todas iguales
      // cayendo: el dibujo (que viene en diagonal hacia abajo a la izquierda) se gira para apuntar a donde cae
      if (!side && key) orb.setAngle(Phaser.Math.RadToDeg(Math.atan2(y1 - y0, x1 - x0)) - 135);
      orb.setDepth(5);
      if (side) this.tweens.add({ targets: orb, y: y1, duration: travel * 0.35, ease: 'Sine.easeOut' });   // se acomoda en su carril
      const props = { targets: orb, x: x1, duration: dur,
        ease: side ? 'Linear' : 'Quad.easeIn', onComplete: () => this.landOrb(c, lane, orb) };
      if (!side) props.y = y1;
      if (cfg.spin) props.angle = 300;   // solo la espiral gira
      const tw = this.tweens.add(props);
      // el momento en que llega a donde está el protagonista: ¿estaba en ese carril?
      const check = this.time.delayedCall(travel, () => this.passHero(c, lane));
      c.orbs.push({ orb, tw, lane, check });
    }
    // a mitad de camino se descubren: el del carril seguro se detiene y desaparece
    this.time.delayedCall(revealAt, () => {
      if (this.ended || c.done) return;
      c.revealed = true; c.revealTime = performance.now();
      tone(880, 0.12, 0.05, 'triangle');
      c.orbs.forEach(o => {
        if (o.orb.clearTint) o.orb.clearTint();
        this.tweens.add({ targets: o.orb, scale: { from: o.orb.scale * 1.3, to: o.orb.scale }, duration: 160 });
        if (o.lane !== safe) return;
        o.tw.stop(); o.check.remove();
        this.tweens.killTweensOf(o.orb);
        const ring = this.add.circle(o.orb.x, o.orb.y, 44).setStrokeStyle(6, 0x4ade80, 1).setDepth(6);
        this.tweens.add({ targets: ring, scale: 1.7, alpha: 0, duration: 450, onComplete: () => ring.destroy() });
        this.tweens.add({ targets: o.orb, alpha: 0, scale: o.orb.scale * 0.3, duration: 450, delay: 150, onComplete: () => o.orb.destroy() });
        // el carril seguro se ilumina en verde un momento
        const glow = side ? this.add.rectangle(GAME_W / 2, DODGE_ROWS[safe], GAME_W - 120, 96, 0x4ade80, 0.18)
          : this.add.ellipse(DODGE_COLS[safe], DODGE_FLOOR - 4, 170, 44, 0x4ade80, 0.35);
        glow.setDepth(0);
        this.tweens.add({ targets: glow, alpha: 0, duration: 900, delay: 300, onComplete: () => glow.destroy() });
      });
    });
  },

  // el poder choca: cayendo, en el suelo; de frente, en la pared de atrás. Ahí queda su marca y se desvanece.
  landOrb(c, lane, orb) {
    orb.destroy();
    if (this.ended) return;
    const cfg = this.dodgeCfg, side = cfg.side;
    const mx = side ? DODGE_WALL_X : DODGE_COLS[lane], my = side ? DODGE_ROWS[lane] : DODGE_FLOOR - 6;
    const mk = dodgeTex(this, cfg.mark);
    const mark = mk ? fit(this.add.image(mx, my, mk).setOrigin(side ? 0.3 : 0.5, side ? 0.5 : 0.7), side ? 100 : 140)
      : this.add.ellipse(mx, my, side ? 40 : 120, side ? 90 : 32, POWERS[this.themeKey].color, 0.6);
    if (side && mk) mark.setScale(mark.scaleX * 0.5, mark.scaleY);   // aplastada contra la pared, vista de lado
    mark.setDepth(1);
    this.tweens.add({ targets: mark, alpha: 0, duration: 900, delay: 900, onComplete: () => mark.destroy() });
  },

  // el poder pasa por donde está el protagonista: si estaba en ese carril, le cae y se sacude (sin castigo)
  passHero(c, lane) {
    if (this.ended || c.done) return;
    if (this.dodgeLane === lane && !c.gotHit) {
      c.gotHit = true;
      fizzleSound();
      this.cameras.main.shake(160, 0.005);
      this.dodgeHero.setTint(0x94a3b8);
      this.tweens.add({ targets: this.dodgeHero, angle: { from: -10, to: 10 }, duration: 70, yoyo: true, repeat: 3,
        onComplete: () => this.dodgeHero.setAngle(0).clearTint() });
    }
    // cuando llegan los dos poderes, se cierra el ensayo
    c.landed = (c.landed || 0) + 1;
    if (c.landed >= 2) this.endDodge(c);
  },

  endDodge(c) {
    if (c.done) return;
    c.done = true;
    const safeNow = this.dodgeLane === c.safe;
    const stay = c.startLane === c.safe;
    let type, outcome;
    if (stay) { type = 'distractor'; outcome = safeNow && !c.anticipated ? 'correct_rejection' : 'commission'; }
    else { type = 'target'; outcome = safeNow ? 'hit' : 'omission'; }
    // tiempo de reacción: desde que se descubrió el carril seguro hasta su primer movimiento (negativo = se adelantó)
    const rt = c.firstMove === null ? null : c.firstMove - (c.revealTime || c.onset + c.revealAt);
    // en el CSV, qué lanzó: "meteoritos", "nubes_de_humo"...
    this.logTrial(c.trial, type, this.dodgeCfg.many.split(' ').slice(1).join('_'), c.onset, c.moved, rt, outcome);
    const row = this.log[this.log.length - 1];
    row.condition = stay ? 'quedarse' : 'cambiar';
    row.stop_ms = c.revealAt;
    row.anticipated = c.anticipated ? 1 : 0;
    if (outcome === 'hit') this.dodgeCheer('¡A salvo!');
    else if (outcome === 'correct_rejection') this.dodgeCheer('¡Bien, ya estabas a salvo!');
    this.dodgeCur = null;
    this.dodgeIdle = 0;
    // espera a que los que pasaron terminen de cruzar antes de la siguiente tanda (nunca dos tandas a la vez)
    const gap = this.dodgeCfg.side ? this.params.dodgeTravelMs * 0.35 + 900 : 1000;
    this.time.delayedCall(gap + Phaser.Math.Between(0, 400), () => this.nextDodge());
  },

  // Seguro: si por algo un lanzamiento no termina o no llega el siguiente, se retoma solo (lo llama update)
  // (cuenta el tiempo de juego que pasa, así una pausa o cambiar de pestaña no lo confunde)
  dodgeWatch(delta) {
    if (!this.started || this.ended || this.dodgeIdle === undefined) return;
    this.dodgeIdle += Math.min(delta, 100);
    const limit = this.params.dodgeTravelMs * 2 + 3000;
    if (this.dodgeCur && !this.dodgeCur.done && this.dodgeIdle > limit) this.endDodge(this.dodgeCur);
    else if (!this.dodgeCur && this.dodgeIdle > 6000) { this.dodgeIdle = 0; this.nextDodge(); }
  },

  dodgeCheer(msg) {
    rewardSound();
    this.fb.setText(msg).setAlpha(1);
    this.tweens.add({ targets: this.fb, alpha: 0, duration: 800 });
    const side = this.dodgeCfg.side;
    this.tweens.add({ targets: this.dodgeHero, [side ? 'x' : 'y']: (side ? DODGE_HERO_X + 14 : DODGE_FLOOR - 22), duration: 140, yoyo: true, ease: 'Quad.easeOut' });
  }
});
