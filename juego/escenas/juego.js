// Motor del juego: los 4 minijuegos (Clásico, Atrapa, Carrera, Encuentra). Lo usan todos los modos.

// ======================= ESCENA DE JUEGO (todos los minijuegos) =======================
class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }
  init(data) {
    this.mode = data.mode;
    this.themeKey = data.theme;
    this.theme = THEMES[data.theme];
    this.chapter = data.chapter === undefined ? null : data.chapter;
    this.phase = data.phase || 0;
    this.prevLog = data.prevLog || [];   // jefe final: registros de la fase anterior
    this.boss = false;
    if (this.mode === 'prueba') {
      this.level = null;
      this.params = pruebaParams();
    } else if (this.mode === 'historia') {
      const ch = STORY[this.themeKey].chapters[this.chapter];
      // el juego del capítulo sale del orden aleatorio del mundo; la dificultad, del capítulo
      const spec = ch.phases ? bossPhases(this.themeKey)[this.phase] : { mg: chapterGame(this.themeKey, this.chapter), sec: ch.sec };
      this.boss = !!ch.boss;
      this.level = ch.level;
      this.params = challengeParams(ch.level, spec.mg);
      this.params.sessionMs = spec.sec * 1000;
    } else {
      this.level = data.level;
      this.params = challengeParams(data.level, data.minigame);
    }
    this.mg = this.params.minigame;
    this.powers = this.mode !== 'prueba';   // la Prueba fija conserva el feedback simple de siempre
    // Qué se busca: en el jefe final, el villano entre personajes amigos
    const tex = TEX[this.themeKey];
    this.keys = this.boss
      ? { target: tex.villain, dists: [tex.friend1, tex.friend2], similar: tex.friend3 }
      : { target: tex.target, dists: [tex.dist1, tex.dist2], similar: tex.dist3 };
  }

  create() {
    const W = GAME_W, H = GAME_H;
    const th = this.theme;
    this.cameras.main.setBackgroundColor(th.bg);
    // Fondo del capítulo/nivel: muy oscurecido al principio y más visible en niveles altos (distractor visual).
    // La Prueba fija queda con fondo liso para no cambiar las condiciones de medición.
    if (this.mode !== 'prueba') {
      const idx = this.mode === 'historia' ? this.chapter : (this.level - 1) % 5;
      drawBackdrop(this, this.themeKey, idx, Math.max(0.4, 0.85 - 0.06 * (this.level - 1)));
    }
    this.log = [];
    this.castBusy = false;     // escena de personajes en curso (una a la vez)
    this.trial = 0;
    this.current = null;
    this.items = [];           // objetos en movimiento (Atrapa / Carrera)
    this.started = false;
    this.ended = false;
    this.spawningDone = false;

    // Barra de progreso, con el nivel o capítulo a la izquierda
    let barX = 40;
    const tag = this.mode === 'desafio' ? 'Nivel ' + this.level
      : this.mode === 'historia' ? (this.boss ? 'Jefe final' : 'Capítulo ' + (this.chapter + 1)) : null;
    if (tag) {
      const pill = this.add.graphics();
      pill.fillStyle(th.accent, 0.18);
      pill.fillRoundedRect(20, 6, 130, 28, 14);
      this.add.text(85, 20, tag, { font: 'bold 16px Arial', color: hexColor(th.accent) }).setOrigin(0.5);
      barX = 166;
    }
    this.barW = W - barX - 40;
    this.add.rectangle(barX, 20, this.barW, 10, 0xffffff, 0.2).setOrigin(0, 0.5);
    this.bar = this.add.rectangle(barX, 20, 0, 10, th.accent).setOrigin(0, 0.5);

    this.fb = this.add.text(W / 2, this.mg === 'classic' ? H / 2 + 140 : 70, '',
      { font: 'bold 38px Arial', color: '#86efac' }).setOrigin(0.5).setDepth(10);

    this.setupMinigame();
    this.setupBuddy();

    // Pantalla de preparación
    let title, what;
    if (this.boss) {
      title = this.phase > 0 ? '¡' + th.villain + ' escapó! ' + th.chase
        : this.mg === 'catch' ? '¡Atrápalo con la red!' : '¡Encuentra ' + th.villainObj + '!';
      what = th.villainObj;
    } else {
      title = tag ? tag + ' · ' + MG[this.mg].label : 'Prepárate...';
      what = th.targetObj;
    }
    const holder = this.boss ? 'la red' : 'la canasta';
    this.showHowToPlay(title, what, holder);
  }

  // ---------- Cómo jugar: qué tocar, qué no, y con qué teclas (o con el dedo en celular) ----------
  showHowToPlay(title, what, holder) {
    const W = GAME_W, H = GAME_H, th = this.theme;
    const touch = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
    const D = 20, it = [];
    const add = o => { o.setDepth(D); it.push(o); return o; };
    const txt = (x, y, s, size, color, extra) => add(this.add.text(x, y, s, Object.assign({ font: 'bold ' + size + 'px Arial', color: color || '#ffffff', align: 'center' }, extra || {})).setOrigin(0.5));
    const panel = add(this.add.graphics());
    panel.fillStyle(0x0f172a, 0.85); panel.fillRoundedRect(40, 22, W - 80, H - 44, 26);
    txt(W / 2, 58, title, 30, hexColor(th.accent));

    // Ejemplos: el objetivo (sí) y los distractores (no)
    const exY = 160;
    add(this.add.circle(260, exY, 64, 0x22c55e, 0.18).setStrokeStyle(4, 0x22c55e));
    add(fit(this.add.image(260, exY, this.keys.target), 96));
    txt(260, exY + 84, '✔ ¡Este sí!', 22, '#86efac');
    const noKeys = [this.keys.dists[0], this.keys.dists[1]].filter(Boolean);
    noKeys.forEach((k, i) => {
      const x = 560 + i * 150;
      add(this.add.circle(x, exY, 56, 0xef4444, 0.12).setStrokeStyle(3, 0xef4444));
      add(fit(this.add.image(x, exY, k), 84));
    });
    txt(560 + (noKeys.length - 1) * 75, exY + 84, '✘ Estos no', 22, '#fca5a5');

    // Controles: dibujos de las teclas (computador) o del dedo (celular / tableta)
    const ctrlY = 335;
    const keycap = (x, y, w, label) => {
      const g = add(this.add.graphics());
      g.fillStyle(0x475569, 1); g.fillRoundedRect(x - w / 2, y - 26 + 6, w, 52, 10);
      g.fillStyle(0xf1f5f9, 1); g.fillRoundedRect(x - w / 2, y - 26, w, 52, 10);
      g.lineStyle(2, 0x94a3b8, 1); g.strokeRoundedRect(x - w / 2, y - 26, w, 52, 10);
      txt(x, y, label, label.length > 2 ? 20 : 28, '#0f172a');
    };
    const icon = (x, y, s) => txt(x, y, s, 56);
    let explain;
    const chase = this.lead ? '¡Persigue ' + th.villainObj + '! ' : '';
    if (this.mg === 'classic') {
      if (touch) { icon(220, ctrlY, '👆'); explain = 'Toca la pantalla solo cuando veas ' + what; }
      else { keycap(220, ctrlY, 210, 'ESPACIO'); explain = 'Presiona ESPACIO solo cuando veas ' + what; }
    } else if (this.mg === 'catch') {
      if (touch) { icon(220, ctrlY, '👆↔'); explain = 'Arrastra el dedo para mover ' + holder + '. Atrapa solo ' + what + ' y esquiva lo demás'; }
      else { keycap(185, ctrlY, 58, '←'); keycap(255, ctrlY, 58, '→'); explain = 'Mueve ' + holder + ' con las flechas (o el ratón). Atrapa solo ' + what + ' y esquiva lo demás'; }
    } else if (this.mg === 'race') {
      if (touch) { icon(220, ctrlY, '👆'); explain = chase + 'Toca arriba o abajo de tu personaje para cambiar de carril. Agarra solo ' + what; }
      else { keycap(220, ctrlY - 32, 58, '↑'); keycap(220, ctrlY + 34, 58, '↓'); explain = chase + 'Cambia de carril con las flechas. Agarra solo ' + what; }
    } else {
      if (touch) { icon(220, ctrlY, '👆'); explain = 'Toca ' + what + '. Si no está, no toques nada'; }
      else { icon(220, ctrlY, '🖱️'); explain = 'Haz clic sobre ' + what + '. Si no está, no hagas clic'; }
    }
    txt(330, ctrlY, explain, 22, '#ffffff', { align: 'left', wordWrap: { width: 560 }, lineSpacing: 6 }).setOrigin(0, 0.5);

    // Empezar cuando el niño esté listo (botón, o ESPACIO / ENTER en computador)
    const btn = add(this.add.rectangle(W / 2, 462, 260, 62, th.accent).setInteractive({ useHandCursor: true }));
    txt(W / 2, 462, '¡Empezar!', 26, '#0f172a');
    if (!touch) txt(W / 2, 506, 'o presiona ESPACIO', 15, '#94a3b8');
    let gone = false;
    const go = () => {
      if (gone) return; gone = true;
      it.forEach(o => o.destroy());
      const ya = this.add.text(W / 2, H / 2, '¡Ya!', { font: 'bold 72px Arial', color: hexColor(th.accent) }).setOrigin(0.5).setDepth(D);
      this.tweens.add({ targets: ya, scale: 1.4, alpha: 0, duration: 700, onComplete: () => ya.destroy() });
      this.time.delayedCall(700, () => this.begin());
    };
    btn.on('pointerdown', go);
    this.input.keyboard.once('keydown-SPACE', go);
    this.input.keyboard.once('keydown-ENTER', go);
    this.intro = it;
  }

  setupMinigame() {
    const W = GAME_W, H = GAME_H;
    this.mgObjects = [];
    if (this.mg === 'classic') {
      this.stim = this.add.image(W / 2, H / 2, this.keys.target).setVisible(false);
      this.input.keyboard.on('keydown-SPACE', () => this.respond());
      this.input.on('pointerdown', () => this.respond());
    } else if (this.mg === 'catch') {
      this.basket = fit(this.add.image(W / 2, H - 60, this.boss ? TEX[this.themeKey].net : 'basket'), this.boss ? 120 : 144).setDepth(3);
      this.mgObjects.push(this.basket);
      this.cursors = this.input.keyboard.createCursorKeys();
      const follow = p => { if (this.started) this.basket.x = Phaser.Math.Clamp(this.cameras.main.getWorldPoint(p.x, p.y).x, 70, W - 70); };
      this.input.on('pointermove', follow);
      this.input.on('pointerdown', follow);
      this.fallSpeed = (H - 60 + 60) / this.params.travelMs * 1000;
    } else if (this.mg === 'race') {
      this.lanes = [210, 330, 450];
      this.lane = 1;
      const road = this.add.graphics();
      road.fillStyle(0x000000, 0.22);
      road.fillRect(0, 150, W, 360);
      road.lineStyle(3, 0xffffff, 0.12);
      road.lineBetween(0, 270, W, 270); road.lineBetween(0, 390, W, 390);
      this.mgObjects.push(road);
      this.dashes = [];
      for (let i = 0; i < 9; i++) {
        const d = this.add.rectangle(i * 120, 512, 60, 6, 0xffffff, 0.3).setOrigin(0, 0.5);
        this.dashes.push(d);
        this.mgObjects.push(d);
      }
      this.runner = fit(this.add.image(170, this.lanes[1], TEX[this.themeKey].hero_run), 104).setDepth(4);
      this.mgObjects.push(this.runner);
      this.bob = this.tweens.add({ targets: this.runner, angle: { from: -4, to: 4 }, duration: 160, yoyo: true, repeat: -1 });
      // El villano corre adelante, cambia de carril y va soltando los objetos.
      // (En el jefe final se persigue al villano en persona, entre amigos, así que no hay nadie adelante.)
      if (!this.boss) {
        this.leadLane = 1;
        this.lead = fit(this.add.image(840, this.lanes[1], TEX[this.themeKey].villain), 110).setDepth(4);
        this.mgObjects.push(this.lead);
        this.tweens.add({ targets: this.lead, angle: { from: -5, to: 5 }, duration: 180, yoyo: true, repeat: -1 });
      }
      this.raceSpeed = ((this.lead ? this.lead.x - 40 : W + 60) - 170) / this.params.travelMs * 1000;
      const move = d => {
        if (!this.started || this.ended) return;
        this.lane = Phaser.Math.Clamp(this.lane + d, 0, 2);
        this.tweens.add({ targets: this.runner, y: this.lanes[this.lane], duration: 110 });
      };
      ['UP', 'W'].forEach(k => this.input.keyboard.on('keydown-' + k, () => move(-1)));
      ['DOWN', 'S'].forEach(k => this.input.keyboard.on('keydown-' + k, () => move(1)));
      this.input.on('pointerdown', p => {
        const y = this.cameras.main.getWorldPoint(p.x, p.y).y;   // posición del toque dentro del juego
        if (y < this.runner.y - 30) move(-1);
        else if (y > this.runner.y + 30) move(1);
      });
    }
    // En Clásico y Encuentra, el protagonista aparece abajo a la izquierda y lanza su poder
    if (this.powers && (this.mg === 'classic' || this.mg === 'find')) {
      this.caster = fit(this.add.image(70, H - 70, TEX[this.themeKey].hero), 120).setDepth(7);
      this.mgObjects.push(this.caster);
    }
    // 'find' no necesita elementos fijos: crea los objetos en cada ronda
    this.mgObjects.forEach(o => o.setVisible(false));
  }

  begin() {
    this.intro.forEach(o => o.destroy());
    this.mgObjects.forEach(o => o.setVisible(true));
    this.t0 = performance.now();
    this.started = true;
    if (this.mg === 'classic') this.nextTrial();
    else if (this.mg === 'find') this.nextFindTrial();
    else this.scheduleSpawn();
    if (this.lead) this.time.delayedCall(1200, () => this.moveLead());
    this.scheduleAudio();
    this.scheduleVisual();
  }

  elapsed() { return performance.now() - this.t0; }

  pickStimulus() {
    if (Math.random() < this.params.targetProb) return { type: 'target', key: this.keys.target };
    return { type: 'distractor', key: this.distractorKey() };
  }
  distractorKey() {
    if (Math.random() < this.params.similarProb) return this.keys.similar;
    return Phaser.Utils.Array.GetRandom(this.keys.dists);
  }

  logTrial(trial, type, key, onset, responded, rt, outcome) {
    this.log.push({
      event_type: 'stimulus',
      mode: this.mode,
      theme: this.themeKey,
      level: this.level || '',
      chapter: this.chapter === null ? '' : this.chapter + 1,
      phase: this.boss ? this.phase + 1 : '',
      minigame: this.mg,
      trial: trial,
      stimulus_type: type,
      stimulus_key: key,
      onset_ms: Math.round(onset - this.t0),
      responded: responded ? 1 : 0,
      rt_ms: rt === null ? '' : Math.round(rt),
      outcome: outcome
    });
    if (outcome === 'hit') this.buddyCheer();   // el compañero celebra
  }

  update(time, delta) {
    if (!this.started || this.ended) return;
    const dt = delta / 1000;
    this.bar.width = this.barW * Math.min(1, this.elapsed() / this.params.sessionMs);
    if (this.mg === 'catch') this.updateCatch(dt);
    else if (this.mg === 'race') this.updateRace(dt);
  }

  ring(x, y) {
    const r = this.add.circle(x, y, 70).setStrokeStyle(8, 0x86efac).setDepth(6);
    this.tweens.add({ targets: r, scale: 1.6, alpha: 0, duration: 500, onComplete: () => r.destroy() });
  }
  praise() {
    rewardSound();
    this.fb.setText(this.boss ? '¡Atrapado!' : '¡Bien!').setAlpha(1);
    this.tweens.add({ targets: this.fb, alpha: 0, duration: 600 });
  }

  // Poder del protagonista. hit = tocó al objetivo (poder completo, con premio);
  // si tocó otro personaje, el poder se apaga en un humito gris (sin premio, para no reforzar la impulsividad).
  castPower(tx, ty, hit) {
    if (!this.powers) { if (hit) { this.praise(); this.ring(tx, ty); } return; }
    const p = POWERS[this.themeKey];
    const c = this.caster;
    const ox = c ? c.x + 30 : tx, oy = c ? c.y - 40 : ty;
    if (c) this.tweens.add({ targets: c, scale: c.scale * 1.12, duration: 90, yoyo: true });
    if (!hit) {
      fizzleSound();
      const em = this.add.particles(ox, oy, 'puff', { speed: { min: 20, max: 60 }, lifespan: 450,
        scale: { start: 0.8, end: 0 }, alpha: { start: 0.6, end: 0 }, emitting: false }).setDepth(9);
      em.explode(8);
      this.time.delayedCall(600, () => em.destroy());
      return;
    }
    // Si el objetivo es un compañero (hermanito de Chispa, Lumi), se le rescata: nada de atacarlo.
    // El poder de ataque queda para el villano (jefe final) o, en Superhéroes, para la señal de Sombra.
    if (p.rescue && !this.boss) {
      rescueSound();
      this.fb.setText(p.rescue.shout).setAlpha(1);
      this.tweens.add({ targets: this.fb, alpha: 0, duration: 800 });
      this.rescueEffect(tx, ty);
      return;
    }
    POWER_SOUNDS[this.themeKey]();
    this.fb.setText(this.boss ? '¡Atrapado!' : p.shout).setAlpha(1);
    this.tweens.add({ targets: this.fb, alpha: 0, duration: 700 });
    const sx = c ? ox : tx, sy = c ? oy : 0;   // sin lanzador en pantalla, el poder cae desde arriba
    if (p.kind === 'bolt') {
      this.drawBolt(sx, sy, tx, ty, p.color);
      const fl = this.add.rectangle(0, 0, GAME_W, GAME_H, 0xffffff, 0.2).setOrigin(0).setDepth(9);
      this.tweens.add({ targets: fl, alpha: 0, duration: 160, onComplete: () => fl.destroy() });
      this.impact(tx, ty);
    } else {
      const n = p.kind === 'stars' ? 5 : 1;
      for (let i = 0; i < n; i++) {
        const proj = fit(this.add.image(sx, sy, p.kind === 'fire' ? 'fireball' : 'magicstar'), p.kind === 'fire' ? 56 : 40).setDepth(9);
        const jitter = () => (n > 1 ? Phaser.Math.Between(-30, 30) : 0);
        this.tweens.add({ targets: proj, x: tx + jitter(), y: ty + jitter(), angle: 360, duration: 170, delay: i * 35,
          onComplete: () => { proj.destroy(); if (i === n - 1) this.impact(tx, ty); } });
      }
    }
  }
  // Rescate: brillo suave alrededor del compañero y corazones que suben
  rescueEffect(x, y) {
    const glow = this.add.circle(x, y, 55, 0xfef08a, 0.45).setDepth(8);
    this.tweens.add({ targets: glow, scale: 1.7, alpha: 0, duration: 650, onComplete: () => glow.destroy() });
    const hk = sizeScale(this, 'heart', 30);
    const hearts = this.add.particles(x, y, 'heart', { speedX: { min: -70, max: 70 }, speedY: { min: -170, max: -70 },
      lifespan: 900, scale: { start: 0.9 * hk, end: 0.3 * hk }, alpha: { start: 1, end: 0 }, emitting: false }).setDepth(9);
    hearts.explode(8);
    const sk = sparkKey(this, this.themeKey), ss = sizeScale(this, sk, 18);
    const sparks = this.add.particles(x, y, sk, { speed: { min: 40, max: 120 }, lifespan: 600,
      scale: { start: 0.8 * ss, end: 0 }, alpha: { start: 0.9, end: 0 }, emitting: false }).setDepth(9);
    sparks.explode(12);
    this.time.delayedCall(1000, () => { hearts.destroy(); sparks.destroy(); });
  }
  drawBolt(x0, y0, x1, y1, color) {
    const g = this.add.graphics().setDepth(9);
    const pts = [{ x: x0, y: y0 }];
    for (let i = 1; i < 8; i++) {
      const t = i / 8;
      pts.push({ x: x0 + (x1 - x0) * t + Phaser.Math.Between(-22, 22), y: y0 + (y1 - y0) * t + Phaser.Math.Between(-22, 22) });
    }
    pts.push({ x: x1, y: y1 });
    g.lineStyle(14, color, 0.35); g.strokePoints(pts);
    g.lineStyle(7, color, 1); g.strokePoints(pts);
    g.lineStyle(3, 0xffffff, 1); g.strokePoints(pts);
    this.tweens.add({ targets: g, alpha: 0, duration: 260, delay: 60, onComplete: () => g.destroy() });
  }
  impact(x, y) {
    const sk = sparkKey(this, this.themeKey), ss = sizeScale(this, sk, 18);
    const em = this.add.particles(x, y, sk, { speed: { min: 120, max: 340 }, lifespan: 520,
      scale: { start: ss, end: 0 }, alpha: { start: 1, end: 0 }, emitting: false }).setDepth(9);
    em.explode(26);
    this.time.delayedCall(800, () => em.destroy());
    const r = this.add.circle(x, y, 60).setStrokeStyle(8, POWERS[this.themeKey].color).setDepth(8);
    this.tweens.add({ targets: r, scale: 1.8, alpha: 0, duration: 450, onComplete: () => r.destroy() });
  }

  // ---------- Clásico: aparece un objeto; responder solo al especial ----------
  nextTrial() {
    const P = this.params;
    if (this.elapsed() >= P.sessionMs) { this.finish(); return; }
    this.trial++;
    const s = this.pickStimulus();
    fit(this.stim.setTexture(s.key).setVisible(true).setAlpha(1), 160);
    this.current = { trial: this.trial, type: s.type, key: s.key, onset: performance.now(), responded: false, rt: null };
    this.time.delayedCall(P.stimMs, () => this.endTrial());
  }
  endTrial() {
    const c = this.current;
    this.stim.setVisible(false);
    let outcome;
    if (c.type === 'target') outcome = c.responded ? 'hit' : 'omission';
    else outcome = c.responded ? 'commission' : 'correct_rejection';
    this.logTrial(c.trial, c.type, c.key, c.onset, c.responded, c.rt, outcome);
    this.current = null;
    this.time.delayedCall(Phaser.Math.Between(this.params.isiMin, this.params.isiMax), () => this.nextTrial());
  }
  respond() {
    const c = this.current;
    if (!this.started || this.ended || !c || c.responded) return;
    c.responded = true;
    c.rt = performance.now() - c.onset;
    this.castPower(GAME_W / 2, GAME_H / 2, c.type === 'target');
    if (c.type !== 'target') this.stim.setAlpha(0.35);  // error de comisión: feedback neutro, sin castigo
  }

  // ---------- Atrapa y Carrera: objetos en movimiento ----------
  scheduleSpawn() {
    if (this.elapsed() >= this.params.sessionMs) { this.spawningDone = true; return; }
    this.spawnItem();
    // en niveles altos, a veces sale otro distractor al mismo tiempo (en otra columna o carril)
    if (Math.random() < (this.params.extraProb || 0)) this.spawnItem(true);
    this.time.delayedCall(Phaser.Math.Between(this.params.spawnMin, this.params.spawnMax), () => this.scheduleSpawn());
  }
  spawnItem(extra) {
    const W = GAME_W;
    const s = extra ? { type: 'distractor', key: this.distractorKey() } : this.pickStimulus();
    let img, lane = null;
    if (this.mg === 'catch') {
      const x = Phaser.Utils.Array.GetRandom([130, 290, 450, 610, 770, 850].filter(v => !extra || v !== this.lastX));
      this.lastX = x;
      img = fit(this.add.image(x, -50, s.key), this.boss ? 100 : 88);
    } else if (this.lead) {
      // lo suelta el que va adelante: a veces en su carril y a veces lo lanza a otro (con un pequeño arco),
      // para que no baste con seguirlo
      const thrown = extra || Math.random() < 0.45;
      lane = thrown ? Phaser.Utils.Array.GetRandom([0, 1, 2].filter(l => l !== this.leadLane && (!extra || l !== this.lastLane))) : this.leadLane;
      img = fit(this.add.image(this.lead.x - 40, this.lead.y, s.key), 78);
      const sc = img.scale;
      img.setScale(0);
      this.tweens.add({ targets: img, scale: sc, duration: 150 });
      if (thrown) this.tweens.add({ targets: img, y: this.lanes[lane], duration: 320, ease: 'Back.easeOut' });
      else img.y = this.lanes[lane];
    } else {
      lane = Phaser.Utils.Array.GetRandom([0, 1, 2].filter(l => !extra || l !== this.lastLane));
      img = fit(this.add.image(W + 60, this.lanes[lane], s.key), this.boss ? 96 : 78);
    }
    if (lane !== null) this.lastLane = lane;
    this.trial++;
    this.items.push({ img, lane, trial: this.trial, type: s.type, key: s.key, onset: performance.now(), resolved: false });
  }
  resolveItem(it, got) {
    it.resolved = true;
    const rt = got ? performance.now() - it.onset : null;
    let outcome;
    if (it.type === 'target') outcome = got ? 'hit' : 'omission';
    else outcome = got ? 'commission' : 'correct_rejection';
    this.logTrial(it.trial, it.type, it.key, it.onset, got, rt, outcome);
    if (!got) return;
    const holder = this.mg === 'catch' ? this.basket : this.runner;
    this.castPower(holder.x, holder.y - 20, it.type === 'target');
    if (it.type === 'target') {
      this.tweens.add({ targets: it.img, x: holder.x, y: holder.y, scale: it.img.scale * 0.2, alpha: 0, duration: 220, onComplete: () => it.img.destroy() });
    } else {
      // agarró un distractor: feedback neutro (se desvanece y la canasta/personaje se sacude)
      this.tweens.add({ targets: it.img, alpha: 0, duration: 250, onComplete: () => it.img.destroy() });
      this.tweens.add({ targets: holder, x: holder.x + 8, duration: 60, yoyo: true, repeat: 1 });
    }
    it.gone = true;
  }
  updateCatch(dt) {
    const W = GAME_W, H = GAME_H;
    if (this.cursors.left.isDown) this.basket.x = Math.max(70, this.basket.x - 650 * dt);
    if (this.cursors.right.isDown) this.basket.x = Math.min(W - 70, this.basket.x + 650 * dt);
    for (const it of this.items) {
      if (it.gone) continue;
      it.img.y += this.fallSpeed * dt;
      if (!it.resolved && it.img.y >= this.basket.y - 45 && it.img.y <= this.basket.y + 5 && Math.abs(it.img.x - this.basket.x) < 80) {
        this.resolveItem(it, true);
      } else if (!it.resolved && it.img.y > this.basket.y + 5) {
        this.resolveItem(it, false);
      }
      if (!it.gone && it.img.y > H + 60) { it.img.destroy(); it.gone = true; }
    }
    this.cleanupItems();
  }
  // El que va adelante cambia de carril cada poco para que el niño tenga que seguirlo
  moveLead() {
    if (this.ended) return;
    this.leadLane = Phaser.Utils.Array.GetRandom([0, 1, 2].filter(l => l !== this.leadLane));
    this.tweens.add({ targets: this.lead, y: this.lanes[this.leadLane], duration: 260, ease: 'Sine.easeInOut' });
    this.time.delayedCall(Phaser.Math.Between(900, 2000), () => this.moveLead());
  }
  updateRace(dt) {
    const dx = this.raceSpeed * dt;
    this.dashes.forEach(d => { d.x -= dx; if (d.x < -60) d.x += 9 * 120; });
    for (const it of this.items) {
      if (it.gone) continue;
      it.img.x -= dx;
      if (!it.resolved && it.img.x <= this.runner.x + 25) this.resolveItem(it, it.lane === this.lane);
      if (!it.gone && it.img.x < -60) { it.img.destroy(); it.gone = true; }
    }
    this.cleanupItems();
  }
  cleanupItems() {
    this.items = this.items.filter(it => !it.gone);
    if (this.spawningDone && this.items.every(it => it.resolved)) this.finish();
  }

  // ---------- Encuentra: varios objetos a la vez; tocar solo el especial ----------
  nextFindTrial() {
    const P = this.params;
    if (this.elapsed() >= P.sessionMs) { this.finish(); return; }
    this.trial++;
    const cells = [];
    for (const y of [190, 390]) for (const x of [150, 370, 590, 810]) cells.push([x, y]);
    Phaser.Utils.Array.Shuffle(cells);
    const present = Math.random() < 0.75;
    const targetIdx = present ? Phaser.Math.Between(0, P.setSize - 1) : -1;
    const ft = { trial: this.trial, present, onset: performance.now(), imgs: [], done: false };
    for (let i = 0; i < P.setSize; i++) {
      const isTarget = i === targetIdx;
      const key = isTarget ? this.keys.target : this.distractorKey();
      const [cx, cy] = cells[i];
      const img = fit(this.add.image(cx + Phaser.Math.Between(-30, 30), cy + Phaser.Math.Between(-20, 20), key), 100)
        .setInteractive({ useHandCursor: true });
      img.on('pointerdown', () => this.findTap(ft, isTarget, key, img));
      ft.imgs.push(img);
    }
    ft.timer = this.time.delayedCall(P.displayMs, () => this.findEnd(ft, null));
    this.findTrial = ft;
  }
  findTap(ft, isTarget, key, img) {
    if (ft.done || this.ended) return;
    ft.timer.remove();
    this.castPower(img.x, img.y, isTarget);
    if (!isTarget) img.setAlpha(0.35);  // feedback neutro
    this.findEnd(ft, { isTarget, key });
  }
  findEnd(ft, tap) {
    if (ft.done) return;
    ft.done = true;
    const rt = tap ? performance.now() - ft.onset : null;
    let outcome;
    if (ft.present) outcome = !tap ? 'omission' : tap.isTarget ? 'hit' : 'wrong_tap';
    else outcome = tap ? 'commission' : 'correct_rejection';
    this.logTrial(ft.trial, ft.present ? 'target' : 'distractor',
      tap ? tap.key : 'set_' + ft.imgs.length, ft.onset, !!tap, rt, outcome);
    this.time.delayedCall(tap ? 350 : 0, () => ft.imgs.forEach(i => i.destroy()));
    this.time.delayedCall(Phaser.Math.Between(this.params.isiMin, this.params.isiMax), () => this.nextFindTrial());
  }

  // ---------- Común ----------
  // ---------- Distractores del entorno (no se responden; quedan en el CSV para medir la distractibilidad) ----------
  logDistractor(type, name) {
    this.log.push({
      event_type: type,
      mode: this.mode,
      theme: this.themeKey,
      level: this.level || '',
      chapter: this.chapter === null ? '' : this.chapter + 1,
      phase: this.boss ? this.phase + 1 : '',
      minigame: this.mg,
      stimulus_key: name,
      onset_ms: Math.round(this.elapsed())
    });
  }
  // ---------- Compañero del capítulo (Historia) o del nivel (Desafío) ----------
  // Está en una esquina de abajo mientras se juega (detrás de todo, para no tapar nada) y salta al acertar.
  setupBuddy() {
    this.buddy = null;
    this.buddyRole = null;
    this.buddyJumping = false;
    if (this.mode === 'historia' && !this.boss) {
      const c = (STORY[this.themeKey].companions || [])[this.chapter];
      if (c && c.role !== 'villain') this.buddyRole = c.role;   // en el capítulo 4 presenta el villano: sin compañero
    } else if (this.mode === 'desafio') {
      this.buddyRole = ['friend1', 'friend2', 'friend3'][(this.level - 1) % 3];
    }
    if (!this.buddyRole) return;
    const x = this.caster ? 170 : 66;   // en Clásico y Encuentra, al lado del protagonista
    this.buddy = fit(this.add.image(x, GAME_H - 6, TEX[this.themeKey][this.buddyRole]).setOrigin(0.5, 1), 104).setDepth(-1);
    this.buddyY = this.buddy.y;
    this.tweens.add({ targets: this.buddy, angle: { from: -3, to: 3 }, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }
  buddyCheer() {
    if (!this.buddy || this.buddyJumping) return;
    this.buddyJumping = true;
    this.tweens.add({ targets: this.buddy, y: this.buddyY - 28, duration: 170, yoyo: true, ease: 'Quad.easeOut',
      onComplete: () => { this.buddyJumping = false; } });
  }
  // Un amigo para una escena de fondo: el pedido, salvo que sea el compañero que ya está en pantalla
  castFriend(pref) {
    if (pref && pref !== this.buddyRole) return pref;
    return Phaser.Utils.Array.GetRandom(['friend1', 'friend2', 'friend3'].filter(f => f !== this.buddyRole && f !== pref));
  }
  // Voz de un distractor. Las del amigo ("¡ayuda!") están grabadas con la voz de cada amigo.
  // No suena si es la voz de un amigo en particular que ahora es el compañero (no puede estar en dos lados).
  castVoice(name, friendRole) {
    const v = (DISTRACTORS[this.themeKey].voices || {})[name];
    if (!v) return;
    if (v.who !== 'friend' && v.who !== 'villain' && v.who === this.buddyRole) return;
    const id = v.who === 'friend' ? 'dist_' + name + '_' + (friendRole || this.castFriend()) : 'dist_' + name;
    if (playClip(this.themeKey, id)) this.logDistractor('audio_distractor', 'voz_' + name);
  }

  // Sonidos: en la Prueba fija, el tono de siempre; en los mundos, sonidos del propio mundo
  // y voces del villano y de los amigos (risa, burla, "¡ayuda!"), cada una desde su nivel
  scheduleAudio() {
    const P = this.params;
    if (!P.audio) return;
    const d = Phaser.Math.Between(P.audioEvery[0], P.audioEvery[1]);
    this.time.delayedCall(d, () => {
      if (this.ended) return;
      const D = DISTRACTORS[this.themeKey];
      const sounds = this.mode === 'prueba' ? {} : D.sounds;
      const voices = this.mode === 'prueba' ? [] : Object.keys(D.voices || {})
        .filter(n => (this.level || 0) >= D.voices[n].minLevel).map(n => 'voz_' + n);
      const names = Object.keys(sounds).concat(voices);
      const name = names.length ? Phaser.Utils.Array.GetRandom(names) : 'tono';
      if (name.startsWith('voz_')) this.castVoice(name.slice(4));
      else {
        if (names.length) sounds[name](); else distractorSound();
        this.logDistractor('audio_distractor', name);
      }
      this.scheduleAudio();
    });
  }
  // Visuales: algo del mundo cruza por el borde de arriba (fly) o de abajo (walk), lejos del centro
  scheduleVisual() {
    const P = this.params;
    const D = DISTRACTORS[this.themeKey];
    const list = D.visual
      .filter(v => !((this.mg === 'catch' || this.mg === 'memory') && v.kind === 'walk'));   // abajo está la canasta / las casillas
    // Personajes del mundo (villano y amigos) desde su nivel. No en el jefe final (ahí ya son el objetivo y los
    // distractores) ni en Carrera (el villano ya va adelante).
    const cast = this.mode === 'prueba' || this.boss || this.mg === 'race' ? []
      : (D.cast || []).filter(c => (this.level || 0) >= c.minLevel);
    if (!P.visual || !list.length) return;
    const d = Phaser.Math.Between(P.visualEvery[0], P.visualEvery[1]);
    this.time.delayedCall(d, () => {
      if (this.ended) return;
      // en niveles altos cruzan varias cosas a la vez (una detrás de otra); una sola escena de personajes a la vez
      for (let k = 0; k < (P.visualCount || 1); k++) {
        this.time.delayedCall(k * 450, () => {
          if (this.ended) return;
          const v = Phaser.Utils.Array.GetRandom(this.castBusy ? list : list.concat(cast));
          this.showVisualDistractor(v);
          this.logDistractor('visual_distractor', v.name);
        });
      }
      this.scheduleVisual();
    });
  }
  showVisualDistractor(v) {
    if (['fight', 'sneak', 'chase', 'peek', 'face'].includes(v.kind)) { this.showCastScene(v); return; }
    const W = GAME_W, H = GAME_H;
    const fromLeft = Math.random() < 0.5;
    const y = v.kind === 'walk' ? H - 32 : Phaser.Math.Between(62, 112);
    const img = fit(this.add.image(fromLeft ? -70 : W + 70, y, TEX[this.themeKey]['distractor_' + v.name]), v.size).setDepth(2);
    img.setFlipX(!fromLeft);   // los dibujos miran a la derecha
    this.tweens.add({ targets: img, x: fromLeft ? W + 70 : -70, duration: v.kind === 'walk' ? 5500 : 4000,
      onComplete: () => img.destroy() });
    if (v.kind === 'fly') this.tweens.add({ targets: img, y: y - 14, duration: 350, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }
  // Escenas "de fondo" con los personajes del mundo (detrás de los objetos del juego, para no taparlos):
  // fight = el villano pelea con un amigo en un borde (el amigo pide ayuda y se cubre) · peek = el villano se asoma
  // por una esquina de abajo y se ríe · sneak = cruza por arriba de puntillas · chase = uno huye por arriba y el otro
  // lo persigue (flee: huye el amigo) · face = la cara del villano espía desde un lado. Cada una con su voz (en el CSV).
  showCastScene(c) {
    const W = GAME_W, H = GAME_H, tex = TEX[this.themeKey], DEPTH = -1;
    if (c.kind === 'face' && !tex.villain_face) c = Object.assign({}, c, { kind: 'peek' });   // sin la imagen de la cara
    this.castBusy = true;
    const objs = [];
    const end = () => { objs.forEach(o => o.destroy()); this.castBusy = false; };
    const friendRole = c.friend || c.kind === 'fight' || c.kind === 'chase' ? this.castFriend(c.friend) : null;
    const pose = (role, p) => tex[role + '_' + p] || tex[role];   // pose del amigo, o su imagen normal
    if (c.voice) this.castVoice(c.voice, friendRole);
    const left = Math.random() < 0.5, dir = left ? 1 : -1;
    if (c.kind === 'fight') {
      // en Memoria, más arriba para no tapar las casillas de los lados
      const y = this.mg === 'memory' ? 205 : Phaser.Math.Between(260, 320);
      const fx = left ? 36 : W - 36, vx = left ? 92 : W - 92, off = left ? -90 : W + 90, feet = y + 50;
      // el amigo llega pidiendo ayuda y, cuando el villano lo ataca, se cubre (si hay esas poses)
      const friend = fit(this.add.image(off, feet, pose(friendRole, 'help')).setOrigin(0.5, 1), 100).setDepth(DEPTH).setFlipX(!left);
      const villain = fit(this.add.image(off, feet, tex.villain_run).setOrigin(0.5, 1), 100).setDepth(DEPTH).setFlipX(left);   // se miran de frente
      const cower = tex[friendRole + '_cower'];
      if (cower) this.time.delayedCall(950, () => { if (friend.active) fit(friend.setTexture(cower), 80); });
      objs.push(friend, villain);
      this.tweens.add({ targets: friend, x: fx, duration: 350 });
      this.tweens.add({ targets: villain, x: vx, duration: 350, onComplete: () => {
        this.tweens.add({ targets: villain, x: vx - 18 * dir, duration: 140, yoyo: true, repeat: 5 });
        this.tweens.add({ targets: friend, angle: { from: -8, to: 8 }, duration: 140, yoyo: true, repeat: 5 });
        [0, 600, 1200].forEach(t => this.time.delayedCall(t, () => {
          if (!this.scene.isActive()) return;
          const pow = this.add.text((fx + vx) / 2, y - 62, Phaser.Utils.Array.GetRandom(['¡POW!', '¡PUM!', '¡ZAS!']),
            { font: 'bold 22px Arial', color: '#fde047', stroke: '#7c2d12', strokeThickness: 5 }).setOrigin(0.5).setDepth(DEPTH).setScale(0.4);
          objs.push(pow);
          this.tweens.add({ targets: pow, scale: 1.1, alpha: 0, duration: 550 });
        }));
      } });
      this.time.delayedCall(2600, () => this.tweens.add({ targets: [friend, villain], x: off, duration: 350, onComplete: end }));
    } else if (c.kind === 'peek') {
      // sube desde abajo en una esquina, se ríe (se sacude) y se vuelve a esconder.
      // Abajo a la izquierda están el protagonista (Clásico y Encuentra) y el compañero: sale por la derecha.
      const side = left && !this.caster && !this.buddy;
      const x = side ? 70 : W - 70;
      const img = fit(this.add.image(x, H + 80, tex.villain_laugh), 120).setDepth(DEPTH).setFlipX(!side);
      objs.push(img);
      this.tweens.add({ targets: img, y: H - 60, duration: 450, ease: 'Back.easeOut', onComplete: () => {
        this.tweens.add({ targets: img, angle: { from: -5, to: 5 }, duration: 120, yoyo: true, repeat: 7 });
        this.time.delayedCall(2000, () => this.tweens.add({ targets: img, y: H + 80, duration: 400, onComplete: end }));
      } });
    } else if (c.kind === 'face') {
      // la cara del villano se asoma por un lado, mira un momento y se vuelve a esconder
      const y = this.mg === 'memory' ? 200 : Phaser.Math.Between(180, 330);
      const off = left ? -70 : W + 70, inX = left ? 40 : W - 40;
      const img = fit(this.add.image(off, y, tex.villain_face), 110).setDepth(DEPTH).setFlipX(!left).setAngle(18 * dir);
      objs.push(img);
      this.tweens.add({ targets: img, x: inX, duration: 500, ease: 'Sine.easeOut', onComplete: () => {
        this.tweens.add({ targets: img, angle: 8 * dir, duration: 300, yoyo: true, repeat: 2 });
        this.time.delayedCall(1800, () => this.tweens.add({ targets: img, x: off, duration: 400, onComplete: end }));
      } });
    } else {
      // por la franja de arriba, de un lado al otro
      const y = Phaser.Math.Between(78, 98), from = left ? -80 : W + 80, to = left ? W + 80 : -80;
      const sneak = c.kind === 'sneak';
      const runner = key => {
        const img = fit(this.add.image(from, y, key), sneak ? 84 : 78).setDepth(DEPTH).setFlipX(!left);
        // saltitos al correr; de puntillas, pasos lentos
        this.tweens.add({ targets: img, y: y - (sneak ? 4 : 7), duration: sneak ? 320 : 180, yoyo: true, repeat: -1 });
        objs.push(img);
        return img;
      };
      if (sneak) {
        this.tweens.add({ targets: runner(tex.villain_sneak), x: to, duration: 5200, onComplete: end });
      } else {
        // chase: adelante huye uno y detrás lo persigue el otro
        const villainKey = c.villainPose ? tex[c.villainPose] : tex.villain_run;
        const first = c.flee ? pose(friendRole, 'flee') : villainKey;
        const second = c.flee ? tex.villain_run : tex[friendRole];
        this.tweens.add({ targets: runner(first), x: to, duration: 4200 });
        this.time.delayedCall(700, () => {
          if (!this.scene.isActive()) return;
          this.tweens.add({ targets: runner(second), x: to, duration: 4200, onComplete: end });
        });
      }
    }
  }

  finish() {
    if (this.ended) return;
    this.ended = true;
    if (this.started) addPlayTime(this, this.elapsed());   // tiempo para la Misión del día
    // Jefe final: al terminar la fase de la red, el villano escapa y empieza la persecución
    const ch = this.mode === 'historia' ? STORY[this.themeKey].chapters[this.chapter] : null;
    if (ch && ch.phases && this.phase < ch.phases.length - 1) {
      this.scene.start('Game', { mode: 'historia', theme: this.themeKey, chapter: this.chapter,
        phase: this.phase + 1, prevLog: this.prevLog.concat(this.log) });
      return;
    }
    const data = { log: this.prevLog.concat(this.log), theme: this.themeKey, level: this.level,
      minigame: this.mg, chapter: this.chapter, boss: this.boss };
    if (this.mode === 'desafio') this.scene.start('ChallengeResults', data);
    else if (this.mode === 'historia') this.scene.start('StoryResults', data);
    else this.scene.start('Results', data);
  }
}
