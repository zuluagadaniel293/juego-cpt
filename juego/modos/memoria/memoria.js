// Modo Memoria: tarea tipo Corsi (memoria de trabajo visoespacial).
// El objetivo del mundo aparece en varias casillas, una tras otra; el niño las toca en el mismo orden
// (fase "adelante") y luego del último al primero (fase "al revés", que exige manipular lo recordado).
// La secuencia crece de a 1 al acertar; con 2 fallos seguidos en el mismo largo, termina la fase.

// Casillas repartidas de forma irregular (como el tablero de Corsi), en coordenadas de 960x540
const MEMORY_SPOTS = [[250, 175], [470, 150], [700, 190], [175, 325], [390, 290], [605, 335], [800, 315], [300, 455], [560, 460]];
const MEMORY_MAX_LEN = 9;

class MemoryScene extends Phaser.Scene {
  constructor() { super('Memory'); }
  init(data) {
    this.themeKey = data.theme;
    this.theme = THEMES[data.theme];
  }
  create() {
    const W = GAME_W, th = this.theme;
    this.cameras.main.setBackgroundColor(th.bg);
    drawBackdrop(this, this.themeKey, 0, 0.82);
    backLink(this, 'Salir', () => this.scene.start('Menu', { mode: 'memoria' }));
    this.log = [];
    this.trial = 0;
    this.result = { fwd: 0, bwd: 0 };
    this.playMs = 0;
    this.msg = this.add.text(W / 2, 62, '', { font: 'bold 28px Arial', color: '#ffffff', stroke: '#0f172a', strokeThickness: 6 }).setOrigin(0.5).setDepth(5);

    this.tiles = MEMORY_SPOTS.map(([x, y], i) => {
      const t = this.add.rectangle(x, y, 108, 108, 0xffffff, 0.1).setStrokeStyle(4, th.accent, 0.7);
      t.on('pointerdown', () => this.tap(i));
      return t;
    });
    this.showIntro('fwd');
  }

  // Explicación antes de cada fase
  showIntro(dir) {
    const W = GAME_W, H = GAME_H, th = this.theme, D = 20, it = [];
    const add = o => { it.push(o.setDepth(D)); return o; };
    const touch = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    const panel = add(this.add.graphics());
    panel.fillStyle(0x0f172a, 0.9); panel.fillRoundedRect(80, 50, W - 160, H - 100, 26);
    this.tiles.forEach(t => t.setVisible(false));
    add(this.add.text(W / 2, 100, dir === 'fwd' ? 'Memoria: ¡sigue el camino!' : '¡Ahora al revés!',
      { font: 'bold 34px Arial', color: hexColor(th.accent) }).setOrigin(0.5));
    add(fit(this.add.image(W / 2, 200, TEX[this.themeKey].target), 110));
    const tapWord = touch ? 'tócalas' : 'haz clic en ellas';
    add(this.add.text(W / 2, 320, dir === 'fwd'
      ? 'Mira en qué casillas aparece ' + this.theme.targetObj + '.\nLuego ' + tapWord + ' en el mismo orden.'
      : 'Ahora ' + tapWord + ' del último al primero.\nEjemplo: si apareció 1 → 2 → 3, tocas 3 → 2 → 1.',
      { font: '24px Arial', color: '#f1f5f9', align: 'center', lineSpacing: 10 }).setOrigin(0.5));
    const btn = add(this.add.rectangle(W / 2, 430, 260, 62, th.accent).setInteractive({ useHandCursor: true }));
    add(this.add.text(W / 2, 430, '¡Empezar!', { font: 'bold 26px Arial', color: '#0f172a' }).setOrigin(0.5));
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
    // Empieza un paso por debajo de su mejor marca (mínimo 2), para no aburrir con secuencias muy cortas
    const best = (getMemory()[this.themeKey] || {})[dir] || 0;
    this.len = Math.max(2, best - 1);
    this.fails = 0;          // fallos seguidos en el largo actual
    this.phaseBest = 0;
    this.phaseT0 = performance.now();
    this.time.delayedCall(600, () => this.nextTrial());
  }

  nextTrial() {
    this.trial++;
    this.answer = [];
    this.accepting = false;
    // secuencia sin repetir casillas seguidas
    this.seq = [];
    while (this.seq.length < this.len) {
      const i = Phaser.Math.Between(0, MEMORY_SPOTS.length - 1);
      if (!this.seq.includes(i)) this.seq.push(i);
    }
    this.msg.setText('Mira con atención...').setColor('#ffffff');
    const show = CONFIG.MEMORY_SHOW_MS, step = show + CONFIG.MEMORY_GAP_MS;
    this.seq.forEach((i, k) => this.time.delayedCall(400 + k * step, () => this.flash(i, TEX[this.themeKey].target, show)));
    this.time.delayedCall(400 + this.seq.length * step, () => {
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
      event_type: 'memory_trial', mode: 'memoria', theme: this.themeKey, direction: this.dir, trial: this.trial,
      length: this.len, shown: num(this.seq), expected: num(expected), answered: num(this.answer.map(a => a.i)),
      correct: ok, first_tap_ms: Math.round(this.answer[0].ms), total_ms: Math.round(this.answer[this.answer.length - 1].ms)
    });

    if (ok) {
      rewardSound();
      this.msg.setText('¡Muy bien!').setColor('#86efac');
      this.phaseBest = Math.max(this.phaseBest, this.len);
      this.fails = 0;
      if (this.len >= MEMORY_MAX_LEN) return this.time.delayedCall(1000, () => this.endPhase());
      this.len++;
    } else {
      fizzleSound();
      this.msg.setText('¡Casi! Intentemos otra').setColor('#fca5a5');
      this.fails++;
      if (this.fails >= 2) {
        // si falló justo al empezar, baja un paso para encontrar su nivel; si no, termina la fase
        if (this.phaseBest === 0 && this.len > 2) { this.len--; this.fails = 0; }
        else return this.time.delayedCall(1000, () => this.endPhase());
      }
    }
    this.time.delayedCall(1100, () => this.nextTrial());
  }

  endPhase() {
    this.result[this.dir] = this.phaseBest;
    this.playMs += performance.now() - this.phaseT0;
    this.msg.setText('');
    if (this.dir === 'fwd') { this.showIntro('bwd'); return; }
    addPlayTime(this, this.playMs);
    this.scene.start('MemoryResults', { log: this.log, theme: this.themeKey, result: this.result });
  }
}
