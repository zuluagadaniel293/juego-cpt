// Memoria: tarea tipo Corsi (memoria de trabajo visoespacial).
// El objetivo del mundo aparece en varias casillas, una tras otra; el niño las toca en el mismo orden
// (fase "adelante") y luego del último al primero (fase "al revés", que exige manipular lo recordado).
//
// Se juega de dos formas:
// - Modo Memoria (pantalla inicial): adaptativo, la secuencia crece hasta fallar 2 veces seguidas (mide el span).
// - Historia y Desafío: la dificultad la pone el nivel (memoryParams en configuracion.js): velocidad, largo,
//   fase al revés, sonidos y cosas que cruzan, y objetos distractores que se encienden en las casillas.

// Casillas repartidas de forma irregular (como el tablero de Corsi), en coordenadas de 960x540
const MEMORY_SPOTS = [[250, 175], [470, 150], [700, 190], [175, 325], [390, 290], [605, 335], [800, 315], [300, 455], [560, 460]];
const MEMORY_MAX_LEN = 9;

class MemoryScene extends Phaser.Scene {
  constructor() { super('Memory'); }
  init(data) {
    this.mode = data.mode || 'memoria';
    this.themeKey = data.theme;
    this.theme = THEMES[data.theme];
    this.adaptive = this.mode === 'memoria';
    this.chapter = data.chapter === undefined ? null : data.chapter;
    this.level = this.mode === 'historia' ? STORY[this.themeKey].chapters[this.chapter].level
      : this.mode === 'desafio' ? data.level : null;
    this.params = this.adaptive
      ? { showMs: CONFIG.MEMORY_SHOW_MS, gapMs: CONFIG.MEMORY_GAP_MS, flashes: 0, audio: false, visual: false }
      : memoryParams(this.level);
    // lo usan los distractores del entorno (prestados del motor del juego)
    this.mg = 'memory';
    // Jefe final: Memoria puede ser una de sus fases. Ahí el villano es quien salta de escondite en escondite
    // y los amigos se encienden en las casillas como distractores.
    const ch = this.mode === 'historia' ? STORY[this.themeKey].chapters[this.chapter] : null;
    this.boss = !!(ch && ch.boss);
    this.phase = data.phase || 0;
    this.prevLog = data.prevLog || [];
    const tex = TEX[this.themeKey];
    // nivel de personajes (como en los otros juegos): el villano salta de escondite y los amigos distraen
    this.chars = this.boss || (this.mode === 'historia' ? chapterChars(this.themeKey, this.chapter)
      : this.mode === 'desafio' ? Math.random() < 0.5 : false);
    // Los amigos que pueden salir como distractores: nunca el compañero que acompaña en la esquina
    this.buddyRole = this.companionRole();
    const pals = ['friend1', 'friend2', 'friend3'].filter(f => f !== this.buddyRole);
    this.keys = this.chars
      ? { target: tex.villain, dists: [tex[pals[0]], tex[pals[1]]], similar: tex[pals.includes('friend3') ? 'friend3' : pals[1]], label: this.theme.villain }
      : { target: tex.target, dists: [tex.dist1, tex.dist2], similar: tex.dist3, label: this.theme.targetLabel };
  }
  create() {
    const W = GAME_W, th = this.theme;
    this.cameras.main.setBackgroundColor(th.bg);
    const idx = this.mode === 'historia' ? this.chapter : this.mode === 'desafio' ? (this.level - 1) % 5 : 0;
    drawBackdrop(this, this.themeKey, idx, this.adaptive ? 0.82 : Math.max(0.55, 0.85 - 0.05 * (this.level - 1)));
    addExitButton(this);   // ✕ Salir (pausa) arriba a la derecha, o ESC
    const tag = this.mode === 'desafio' ? 'Nivel ' + this.level : this.mode === 'historia' ? (this.boss ? 'Jefe final' : 'Capítulo ' + (this.chapter + 1)) : null;
    if (tag) {
      const pill = this.add.graphics();
      pill.fillStyle(0x0f172a, 0.6); pill.fillRoundedRect(20, 12, 140, 30, 15);
      this.add.text(90, 27, tag, { font: 'bold 16px Arial', color: hexColor(th.accent) }).setOrigin(0.5);
    }
    this.log = [];
    this.castBusy = false;     // escena de personajes en curso (una a la vez)
    this.trial = 0;
    this.result = { fwd: 0, bwd: 0 };
    this.t0 = null;
    this.ended = false;
    this.msg = this.add.text(W / 2, 62, '', { font: 'bold 28px Arial', color: '#ffffff', stroke: '#0f172a', strokeThickness: 6 }).setOrigin(0.5).setDepth(5);

    this.tiles = MEMORY_SPOTS.map(([x, y], i) => {
      const t = this.add.rectangle(x, y, 108, 108, 0xffffff, 0.1).setStrokeStyle(4, th.accent, 0.7);
      t.on('pointerdown', () => this.tap(i));
      return t;
    });
    this.setupBuddy();   // compañero del capítulo o del nivel, como en los otros juegos
    this.showIntro('fwd');
  }

  elapsed() { return performance.now() - this.t0; }

  // Pausa (botón Salir): al seguir, se corren los tiempos para no contar la pausa
  resumeFromPause(ms) {
    if (this.t0 !== null) this.t0 += ms;
    if (this.respT0) this.respT0 += ms;
  }
  exitGame() {
    this.ended = true;
    if (this.t0 !== null) addPlayTime(this, this.elapsed());
    const [scene, data] = exitTarget(this);
    this.scene.start(scene, data);
  }

  // Explicación antes de cada fase
  showIntro(dir) {
    const W = GAME_W, H = GAME_H, th = this.theme, D = 20, it = [];
    const add = o => { it.push(o.setDepth(D)); return o; };
    const touch = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    const flashes = this.params.flashes > 0;
    const panel = add(this.add.graphics());
    panel.fillStyle(0x0f172a, 0.9); panel.fillRoundedRect(80, 50, W - 160, H - 100, 26);
    this.tiles.forEach(t => t.setVisible(false));
    add(this.add.text(W / 2, 100, dir === 'fwd' ? (this.chars ? (this.phase > 0 ? '¡' + th.villain + ' escapó! ' : '') + '¡Sigue el camino de ' + th.villain + '!' : 'Memoria: ¡sigue el camino!') : '¡Ahora al revés!',
      { font: 'bold 34px Arial', color: hexColor(th.accent) }).setOrigin(0.5));
    const tex = TEX[this.themeKey];
    if (flashes) {   // el objetivo (sí) y el distractor de las casillas (no)
      add(this.add.circle(W / 2 - 110, 200, 62, 0x22c55e, 0.18).setStrokeStyle(4, 0x22c55e));
      add(fit(this.add.image(W / 2 - 110, 200, this.keys.target), 96));
      add(this.add.text(W / 2 - 110, 278, '✔ Recuerda este', { font: 'bold 18px Arial', color: '#86efac' }).setOrigin(0.5));
      add(this.add.circle(W / 2 + 110, 200, 56, 0xef4444, 0.12).setStrokeStyle(3, 0xef4444));
      add(fit(this.add.image(W / 2 + 110, 200, this.params.similarFlash ? this.keys.similar : this.keys.dists[0]), 84));
      add(this.add.text(W / 2 + 110, 278, '✘ Ignora los demás', { font: 'bold 18px Arial', color: '#fca5a5' }).setOrigin(0.5));
    } else {
      add(fit(this.add.image(W / 2, 200, this.keys.target), 110));
    }
    const tapWord = touch ? 'tócalas' : 'haz clic en ellas';
    add(this.add.text(W / 2, 345, dir === 'fwd'
      ? 'Mira en qué casillas aparece ' + this.keys.label + '.\nLuego ' + tapWord + ' en el mismo orden.'
      : 'Ahora ' + tapWord + ' del último al primero.\nEjemplo: si apareció 1 → 2 → 3, tocas 3 → 2 → 1.',
      { font: '24px Arial', color: '#f1f5f9', align: 'center', lineSpacing: 10 }).setOrigin(0.5));
    const btn = add(this.add.rectangle(W / 2, 440, 260, 62, th.accent).setInteractive({ useHandCursor: true }));
    add(this.add.text(W / 2, 440, '¡Empezar!', { font: 'bold 26px Arial', color: '#0f172a' }).setOrigin(0.5));
    let gone = false;
    const go = () => {
      if (gone) return; gone = true;
      it.forEach(o => o.destroy());
      this.tiles.forEach(t => t.setVisible(true));
      this.startPhase(dir);
    };
    btn.on('pointerdown', go);
    this.input.keyboard.once('keydown-SPACE', go);
    this.input.keyboard.once('keydown-ENTER', go);
  }

  startPhase(dir) {
    this.dir = dir;
    if (this.t0 === null) {   // primera fase: empieza el reloj y los distractores del entorno
      this.t0 = performance.now();
      this.scheduleAudio();
      this.scheduleVisual();
    }
    if (this.adaptive) {
      // Empieza un paso por debajo de su mejor marca (mínimo 2), para no aburrir con secuencias muy cortas
      const best = (getMemory()[this.themeKey] || {})[dir] || 0;
      this.len = Math.max(2, best - 1);
    } else {
      this.len = dir === 'fwd' ? this.params.startLen : Math.max(2, this.params.startLen - 1);
      this.trialsLeft = dir === 'fwd' ? this.params.fwdTrials : this.params.bwdTrials;
    }
    this.fails = 0;          // fallos seguidos en el largo actual
    this.phaseBest = 0;
    this.time.delayedCall(600, () => this.nextTrial());
  }

  nextTrial() {
    this.trial++;
    this.answer = [];
    this.accepting = false;
    // secuencia sin repetir casillas
    this.seq = Phaser.Utils.Array.Shuffle([...Array(MEMORY_SPOTS.length).keys()]).slice(0, this.len);
    // pasos a mostrar: la secuencia + distractores en otras casillas, intercalados al azar
    const tex = TEX[this.themeKey];
    const free = [...Array(MEMORY_SPOTS.length).keys()].filter(i => !this.seq.includes(i));
    const steps = this.seq.map(i => ({ i, key: this.keys.target }));
    this.flashCount = Math.min(this.params.flashes, free.length);
    Phaser.Utils.Array.Shuffle(free).slice(0, this.flashCount).forEach(i => {
      const key = this.params.similarFlash ? this.keys.similar : Phaser.Utils.Array.GetRandom(this.keys.dists);
      steps.splice(Phaser.Math.Between(1, steps.length), 0, { i, key });   // nunca de primero
    });
    this.msg.setText('Mira con atención...').setColor('#ffffff');
    const show = this.params.showMs, step = show + this.params.gapMs;
    steps.forEach((s, k) => this.time.delayedCall(400 + k * step, () => this.flash(s.i, s.key, show)));
    this.time.delayedCall(400 + steps.length * step, () => {
      this.msg.setText(this.dir === 'fwd' ? '¡Tu turno! En el mismo orden' : '¡Tu turno! Al revés').setColor(hexColor(this.theme.accent));
      this.tiles.forEach(t => t.setInteractive({ useHandCursor: true }));
      this.accepting = true;
      this.respT0 = performance.now();
    });
  }

  // Ilumina una casilla y muestra una imagen encima un momento
  flash(i, key, ms) {
    const [x, y] = MEMORY_SPOTS[i], t = this.tiles[i];
    t.setFillStyle(this.theme.accent, 0.85);
    const img = fit(this.add.image(x, y, key), 86).setDepth(3);
    tone(660, 0.12, 0.08, 'sine');
    this.time.delayedCall(ms, () => { t.setFillStyle(0xffffff, 0.1); img.destroy(); });
  }

  tap(i) {
    if (!this.accepting) return;
    this.answer.push({ i, ms: performance.now() - this.respT0 });
    this.flash(i, TEX[this.themeKey].hero, 250);
    if (this.answer.length === this.seq.length) this.evaluate();
  }

  evaluate() {
    this.accepting = false;
    this.tiles.forEach(t => t.disableInteractive());
    const expected = this.dir === 'fwd' ? this.seq : this.seq.slice().reverse();
    const ok = this.answer.every((a, k) => a.i === expected[k]);
    const num = arr => arr.map(i => i + 1).join('-');
    this.log.push({
      event_type: 'memory_trial', mode: this.mode, theme: this.themeKey, level: this.level || '',
      chapter: this.chapter === null ? '' : this.chapter + 1, minigame: 'memory',
      stim_set: this.chars ? 'personajes' : 'senales', direction: this.dir, trial: this.trial, length: this.len, flashes: this.flashCount,
      shown: num(this.seq), expected: num(expected), answered: num(this.answer.map(a => a.i)),
      correct: ok, outcome: ok ? 'memory_ok' : 'memory_fail', phase: this.boss ? this.phase + 1 : '', first_tap_ms: Math.round(this.answer[0].ms), total_ms: Math.round(this.answer[this.answer.length - 1].ms),
      onset_ms: Math.round(this.elapsed())
    });

    if (ok) {
      rewardSound();
      this.buddyCheer();
      this.msg.setText('¡Muy bien!').setColor('#86efac');
      this.phaseBest = Math.max(this.phaseBest, this.len);
      this.fails = 0;
    } else {
      fizzleSound();
      this.msg.setText('¡Casi! Intentemos otra').setColor('#fca5a5');
      this.fails++;
    }

    if (this.adaptive) {
      if (ok) {
        if (this.len >= MEMORY_MAX_LEN) return this.time.delayedCall(1000, () => this.endPhase());
        this.len++;
      } else if (this.fails >= 2) {
        // si falló justo al empezar, baja un paso para encontrar su nivel; si no, termina la fase
        if (this.phaseBest === 0 && this.len > 2) { this.len--; this.fails = 0; }
        else return this.time.delayedCall(1000, () => this.endPhase());
      }
    } else {
      // Historia/Desafío: cantidad fija de caminos; sube 1 al acertar y baja 1 con 2 fallos seguidos
      if (ok) this.len = Math.min(MEMORY_MAX_LEN, this.len + 1);
      else if (this.fails >= 2) { this.len = Math.max(2, this.len - 1); this.fails = 0; }
      if (--this.trialsLeft <= 0) return this.time.delayedCall(1000, () => this.endPhase());
    }
    this.time.delayedCall(1100, () => this.nextTrial());
  }

  endPhase() {
    this.result[this.dir] = this.phaseBest;
    this.msg.setText('');
    if (this.dir === 'fwd' && (this.adaptive || this.params.bwdTrials > 0)) { this.showIntro('bwd'); return; }
    this.ended = true;
    addPlayTime(this, this.elapsed());
    const data = { log: this.prevLog.concat(this.log), theme: this.themeKey, minigame: 'memory' };
    // jefe final: si queda otra fase, sigue con ese juego
    if (this.boss && this.phase < bossPhases(this.themeKey).length - 1) {
      startMinigame(this, { mode: 'historia', theme: this.themeKey, chapter: this.chapter, phase: this.phase + 1,
        prevLog: data.log, minigame: bossPhases(this.themeKey)[this.phase + 1].mg });
      return;
    }
    if (this.mode === 'historia') this.scene.start('StoryResults', Object.assign(data, { chapter: this.chapter, boss: this.boss }));
    else if (this.mode === 'desafio') this.scene.start('ChallengeResults', Object.assign(data, { level: this.level }));
    else this.scene.start('MemoryResults', Object.assign(data, { result: this.result }));
  }
}
// Sonidos, cosas que cruzan, escenas de personajes y compañero: los mismos del motor del juego (y quedan en el CSV)
['logDistractor', 'scheduleAudio', 'scheduleVisual', 'showVisualDistractor', 'showCastScene',
  'setupBuddy', 'buddyCheer', 'castFriend', 'castVoice', 'companionRole', 'villainSpeaks'].forEach(m => {
  MemoryScene.prototype[m] = GameScene.prototype[m];
});
