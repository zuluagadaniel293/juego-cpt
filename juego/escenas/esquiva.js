// Esquiva: el villano, arriba, le lanza sus poderes al protagonista, que está abajo en uno de 3 carriles.
// - Poder que baja directo (ensayo "esquivar"): hay que cambiarse de carril antes de que llegue.
//   Se guarda como objetivo: acierto = lo esquivó · omisión = le cayó encima.
// - Poder que frena (ensayo "frenar", ~1 de cada 4): se detiene en el aire, brilla en rojo y se devuelve.
//   Hay que NO moverse. Es como la tarea de la señal de parar (Stop-Signal): mide si el niño puede frenar
//   un movimiento que ya iba a hacer. Se guarda como distractor: ignoró bien = se quedó quieto ·
//   error impulsivo = se movió. 'stop_ms' = cuántos ms después de lanzado se detuvo el poder.
// Cada villano tiene 2 poderes: el 1 siempre baja directo; el 2 es el que puede frenar (a veces frena y a veces no),
// así el niño aprende a esperar a ver qué hace antes de moverse.
// Una sombra en el suelo avisa dónde va a caer, y al caer queda su marca, que se desvanece.

// poder: imagen que cae · mark: marca en el suelo. 'w:' = papel del propio mundo, 'mundo:papel' = de otro mundo,
// sin prefijo = imagen común (assets/comunes)
const DODGE_POWERS = {
  heroes:  [{ img: 'w:fx_fly_1', mark: 'w:fx_splat' },   { img: 'hz_ink', mark: 'ocean:fx_splat' }],
  fantasy: [{ img: 'w:fx_fly_1', mark: 'mk_estallido' }, { img: 'hz_crystal_1', mark: 'hz_ice_floor' }],
  kingdom: [{ img: 'w:fx_fly_1', mark: 'w:fx_splat' },   { img: 'w:distractor_libro_volador', mark: 'mk_libro' }],
  space:   [{ img: 'w:fx_fly_1', mark: 'mk_crater' },    { img: 'w:fx_fly_2', mark: 'mk_crater' }],
  ocean:   [{ img: 'w:fx_fly_1', mark: 'w:fx_splat' },   { img: 'w:fx_amb_1', mark: 'mk_charco' }],
  dinos:   [{ img: 'w:fx_fly_1', mark: 'w:fx_splat' },   { img: 'hz_fire_1', mark: 'mk_fuego' }],
  robots:  [{ img: 'w:fx_fly_1', mark: 'w:fx_splat' },   { img: 'spark', mark: 'mk_rayo', tint: 0x4ade80 }],
  jungle:  [{ img: 'w:fx_fly_1', mark: 'mk_espiral' },   { img: 'w:fx_amb_1', mark: 'mk_hojas' }],
  candy:   [{ img: 'w:fx_fly_1', mark: 'w:fx_splat' },   { img: 'hz_melt', mark: 'hz_melt_puddle' }]
};
const DODGE_LANES = [300, 480, 660];
const DODGE_FLOOR = GAME_H - 34;   // donde pisa el protagonista

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
    this.dodgeLane = 1;
    // carriles: tres huellas claras en el suelo
    const g = this.add.graphics();
    DODGE_LANES.forEach(x => { g.fillStyle(0xffffff, 0.1); g.fillEllipse(x, DODGE_FLOOR - 4, 150, 34); });
    this.mgObjects.push(g);
    this.dodgeHero = fit(this.add.image(DODGE_LANES[1], DODGE_FLOOR, tex.hero).setOrigin(0.5, 1), 130).setDepth(4);
    this.dodgeVillain = fit(this.add.image(DODGE_LANES[1], 112, tex.villain_laugh || tex.villain), 110).setDepth(4);
    this.mgObjects.push(this.dodgeHero, this.dodgeVillain);
    this.tweens.add({ targets: this.dodgeVillain, angle: { from: -4, to: 4 }, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    const move = d => {
      if (!this.started || this.ended) return;
      const lane = Phaser.Math.Clamp(this.dodgeLane + d, 0, 2);
      if (lane === this.dodgeLane) return;
      this.dodgeLane = lane;
      this.tweens.killTweensOf(this.dodgeHero);
      this.tweens.add({ targets: this.dodgeHero, x: DODGE_LANES[lane], duration: 110, ease: 'Quad.easeOut' });
      const c = this.dodgeCur;
      if (c && !c.done && !c.moved) { c.moved = true; c.rt = performance.now() - c.onset; }
    };
    ['LEFT', 'A'].forEach(k => this.input.keyboard.on('keydown-' + k, () => move(-1)));
    ['RIGHT', 'D'].forEach(k => this.input.keyboard.on('keydown-' + k, () => move(1)));
    this.input.on('pointerdown', p => {
      const x = this.cameras.main.getWorldPoint(p.x, p.y).x;
      if (x < this.dodgeHero.x - 40) move(-1); else if (x > this.dodgeHero.x + 40) move(1);
    });
    this.dodgeCur = null;
  },

  // El villano se pone sobre el carril del protagonista y lanza
  nextDodge() {
    if (this.ended) return;
    const P = this.params;
    if (this.elapsed() >= P.sessionMs) { this.finish(); return; }
    this.trial++;
    const lane = this.dodgeLane;
    const stop = Math.random() < P.dodgeStopProb;
    // el poder 2 es el que puede frenar: siempre en los que frenan y a veces en los que no
    const powerIdx = stop || Math.random() < 0.4 ? 1 : 0;
    const v = this.dodgeVillain;
    this.tweens.add({ targets: v, x: DODGE_LANES[lane], duration: 250, ease: 'Sine.easeInOut', onComplete: () => {
      if (this.ended) return;
      this.tweens.add({ targets: v, scaleX: v.scaleX * 1.15, scaleY: v.scaleY * 0.9, duration: 90, yoyo: true });
      this.throwPower(this.dodgeLane, powerIdx, stop);
    } });
  },

  throwPower(lane, powerIdx, stop) {
    const P = this.params, W = GAME_W;
    const spec = (DODGE_POWERS[this.themeKey] || DODGE_POWERS.heroes)[powerIdx];
    const key = dodgeTex(this, spec.img);
    const x0 = this.dodgeVillain.x, y0 = this.dodgeVillain.y + 40, x1 = DODGE_LANES[lane], y1 = DODGE_FLOOR - 70;
    const orb = key ? fit(this.add.image(x0, y0, key), powerIdx ? 64 : 76)
      : this.add.circle(x0, y0, 26, POWERS[this.themeKey].color, 1).setStrokeStyle(5, 0xffffff, 0.9);
    if (key && spec.tint) orb.setTint(spec.tint);
    orb.setDepth(5);
    // sombra en el suelo: avisa dónde va a caer y crece mientras baja
    const shadow = this.add.ellipse(x1, DODGE_FLOOR - 4, 130, 30, 0x000000, 0.35).setDepth(1).setScale(0.3);
    const c = this.dodgeCur = { trial: this.trial, lane, stop, onset: performance.now(), moved: false, rt: null, done: false,
      key: key || 'poder', powerIdx };
    sweep('sine', 700, 380, 0.4, 0.035);
    const travel = P.dodgeTravelMs;
    const stopAt = Math.round(travel * P.dodgeStopFrac);
    c.stopMs = stop ? stopAt : null;
    this.tweens.add({ targets: shadow, scale: 1, duration: stop ? stopAt : travel });
    const fall = this.tweens.add({ targets: orb, x: x1, y: y1, angle: powerIdx ? 200 : 360, duration: travel, ease: 'Quad.easeIn',
      onComplete: () => this.landPower(c, orb, shadow, spec) });
    if (stop) this.time.delayedCall(stopAt, () => {
      if (this.ended || c.done) return;
      fall.stop();
      // ¡se frena! brilla en rojo, tiembla y se devuelve al villano
      tone(220, 0.25, 0.06, 'square');
      const ring = this.add.circle(orb.x, orb.y, 46).setStrokeStyle(6, 0xef4444, 1).setDepth(6);
      this.tweens.add({ targets: ring, scale: 1.6, alpha: 0, duration: 500, repeat: 1, onComplete: () => ring.destroy() });
      if (orb.setTint) orb.setTint(0xfca5a5);
      this.tweens.add({ targets: orb, x: orb.x + 6, duration: 50, yoyo: true, repeat: 5, onComplete: () => {
        this.tweens.add({ targets: orb, x: this.dodgeVillain.x, y: this.dodgeVillain.y, scale: orb.scale * 0.4, alpha: 0, duration: 450,
          ease: 'Quad.easeIn', onComplete: () => orb.destroy() });
      } });
      this.tweens.add({ targets: shadow, alpha: 0, duration: 400, onComplete: () => shadow.destroy() });
      // se espera un poco más: si se mueve en ese momento, también cuenta como que no frenó
      this.time.delayedCall(800, () => this.endDodge(c, null));
    });
  },

  // El poder llega al suelo: ¿estaba ahí el protagonista?
  landPower(c, orb, shadow, spec) {
    if (this.ended || c.done) return;
    orb.destroy(); shadow.destroy();
    const x = DODGE_LANES[c.lane];
    const markKey = dodgeTex(this, spec.mark);
    const mark = markKey ? fit(this.add.image(x, DODGE_FLOOR - 6, markKey).setOrigin(0.5, 0.7), 140)
      : this.add.ellipse(x, DODGE_FLOOR - 6, 130, 34, POWERS[this.themeKey].color, 0.6);
    mark.setDepth(1);
    this.tweens.add({ targets: mark, alpha: 0, duration: 900, delay: 900, onComplete: () => mark.destroy() });
    const hit = this.dodgeLane === c.lane;
    if (hit) {
      // le cayó encima: se sacude un momento, sin castigo
      fizzleSound();
      this.cameras.main.shake(160, 0.005);
      this.dodgeHero.setTint(0x94a3b8);
      this.tweens.add({ targets: this.dodgeHero, angle: { from: -10, to: 10 }, duration: 70, yoyo: true, repeat: 3,
        onComplete: () => { this.dodgeHero.setAngle(0).clearTint(); } });
    }
    this.endDodge(c, hit);
  },

  endDodge(c, hit) {
    if (c.done) return;
    c.done = true;
    let type, outcome;
    if (c.stop) { type = 'distractor'; outcome = c.moved ? 'commission' : 'correct_rejection'; }
    else { type = 'target'; outcome = hit ? 'omission' : 'hit'; }
    this.logTrial(c.trial, type, c.key, c.onset, c.moved, c.rt, outcome);
    const row = this.log[this.log.length - 1];
    row.condition = c.stop ? 'frenar' : 'esquivar';
    row.stop_ms = c.stopMs === null ? '' : c.stopMs;
    if (outcome === 'hit') this.dodgeCheer('¡Esquivado!');
    else if (outcome === 'correct_rejection') this.dodgeCheer('¡Bien, esperaste!');
    this.dodgeCur = null;
    // pausa corta entre poderes (más intentos por nivel)
    this.time.delayedCall(Phaser.Math.Between(450, 950), () => this.nextDodge());
  },

  dodgeCheer(msg) {
    rewardSound();
    this.fb.setText(msg).setAlpha(1);
    this.tweens.add({ targets: this.fb, alpha: 0, duration: 700 });
    this.tweens.add({ targets: this.dodgeHero, y: DODGE_FLOOR - 22, duration: 140, yoyo: true, ease: 'Quad.easeOut' });
  }
});
