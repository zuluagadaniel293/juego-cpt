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
      this.params = pruebaParams(data.minigame);   // Clásico, Menos uno o Pista, siempre igual
    } else if (this.mode === 'historia') {
      const ch = STORY[this.themeKey].chapters[this.chapter];
      // el juego del capítulo sale del orden aleatorio del mundo; la dificultad, del capítulo
      const spec = ch.phases ? bossPhases(this.themeKey)[this.phase] : { mg: chapterGame(this.themeKey, this.chapter), sec: ch.sec };
      this.boss = !!ch.boss;
      this.level = ch.level;
      this.params = forAge(Object.assign(challengeParams(ch.level, spec.mg), { sessionMs: spec.sec * 1000 }));
    } else {
      this.level = data.level;
      this.params = forAge(challengeParams(data.level, data.minigame));   // más despacio para los de 5 a 7 años
    }
    this.mg = this.params.minigame;
    this.twist = worldTwist(this);
    if ((this.mg === 'dodge' || this.mg === 'path') && this.twist && this.twist.motion) this.twist = null;   // en Esquiva solo los giros de ambiente   // giro del mundo (gravedad cero, corriente...): solo Historia y Desafío
    this.powers = this.mode !== 'prueba';   // la Prueba fija conserva el feedback simple de siempre
    // Qué se busca: la señal/objetivo de siempre, o el villano escondido entre los amigos ("nivel de personajes").
    // Jefe final: primero se rescata al objetivo del mundo (señales) y después se atrapa al villano (personajes).
    // En la Historia lo sortea cada capítulo; en el Desafío, cada nivel al azar; la Prueba fija siempre con
    // señales, para comparar sesiones.
    this.chars = this.boss ? this.phase > 0 : (this.mode === 'historia' ? chapterChars(this.themeKey, this.chapter)
      : this.mode === 'desafio' ? Math.random() < 0.5 : false);
    if (this.mg === 'dodge' || this.mg === 'path') this.chars = false;   // en Esquiva siempre lanza el villano
    const tex = TEX[this.themeKey];
    // Los amigos que pueden salir como distractores: nunca el compañero que acompaña en la esquina
    this.buddyRole = this.companionRole();
    // Carrera: corre siempre el mismo amigo de cada mundo (el que tiene pose corriendo) y el protagonista, arriba
    // a la izquierda, le lanza su poder a lo que agarra. En la Prueba fija corre el protagonista, como siempre.
    this.runnerRole = this.mg === 'race' && this.powers ? raceHelper(this.themeKey) : null;
    const pals = ['friend1', 'friend2', 'friend3'].filter(f => f !== this.buddyRole && f !== this.runnerRole);
    // si solo queda un personaje para mostrar (en la Carrera corre uno y otro acompaña), sale ese mismo dos veces
    if (pals.length === 1) pals.push(pals[0]);
    this.keys = this.chars
      ? { target: tex.villain, dists: [tex[pals[0]], tex[pals[1]]], similar: tex[pals.includes('friend3') ? 'friend3' : pals[1]] }
      : { target: tex.target, dists: [tex.dist1, tex.dist2], similar: tex.dist3 };
    // Prueba fija: objetivo fijo (Bip) entre personajes y objetos de todos los mundos (ver pruebaPool)
    if (this.mode === 'prueba') {
      const pool = pruebaPool(), cue = TEX[PRUEBA_CUE[0]][PRUEBA_CUE[1]];
      this.keys = { target: tex.target, dists: this.mg === 'ax' ? [cue].concat(pool) : pool, others: pool, similar: tex.dist3 };
    }
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
    // Phaser reutiliza la escena: lo de la partida anterior se borra aquí
    this.lead = null; this.lastCast = null; this.friendSceneDone = false; this.threatBusy = false;
    this.lastWasCue = false;   // Pista: si lo anterior fue la pista
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
    this.barW = W - barX - 140;   // a la derecha va el botón de salir
    addExitButton(this);
    const track = this.add.rectangle(barX, 20, this.barW, 10, 0xffffff, 0.2).setOrigin(0, 0.5);
    this.bar = this.add.rectangle(barX, 20, 0, 10, th.accent).setOrigin(0, 0.5);
    // Modo Examen: sin barra de tiempo, como en el examen real (el niño no sabe cuánto falta)
    if (this.mode === 'prueba') { track.setVisible(false); this.bar.setVisible(false); }
    // Contador de la misión del mundo ("Hojas para Dino: 3"): solo para motivar, no cambia estrellas ni datos.
    // No sale en la Prueba fija, ni cuando se busca al villano, ni en Menos uno (ahí se toca a los demás).
    this.missionCount = 0; this.missionText = null;
    if (this.mode !== 'prueba' && !this.chars && th.missionCount && this.mg !== 'notx' && this.mg !== 'dodge') {
      // arriba a la derecha, bajo el botón de salir (a la izquierda están el protagonista y el compañero)
      this.missionText = this.add.text(W - 20, 54, th.missionCount + ': 0',
        { font: 'bold 17px Arial', color: '#ffffff', stroke: '#0f172a', strokeThickness: 4 }).setOrigin(1, 0.5).setDepth(5);
      this.missionIcon = fit(this.add.image(W - 20 - this.missionText.width - 20, 54, this.keys.target), 30).setDepth(5);
    }

    this.fb = this.add.text(W / 2, CLASSIC_LIKE.includes(this.mg) ? H / 2 + 140 : 100, '',
      { font: 'bold 38px Arial', color: '#86efac' }).setOrigin(0.5).setDepth(10);

    this.setupMinigame();
    this.setupBuddy();

    // Pantalla de preparación
    let title, what;
    if (this.boss) {
      // cada fase del jefe es un juego al azar: primero se rescata al objetivo y luego se atrapa al villano
      title = this.phase === 0 ? th.rescueTitle || '¡Rescata ' + th.targetObj + '!'
        : '¡Ahora ' + ({ race: 'alcanza', catch: 'atrapa', classic: 'vigila', find: 'encuentra' }[this.mg] || 'atrapa') + ' ' + th.villainObj + '!';
      what = this.chars ? th.villainObj : th.targetObj;
    } else {
      title = tag ? tag + ' · ' + MG[this.mg].label : 'Prepárate...';
      what = this.chars ? th.villainObj : this.mode === 'prueba' ? 'a ' + th.targetLabel : th.targetObj;
    }
    const holder = this.chars ? 'la red' : (th.catcherName || 'la canasta');
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

    // Ejemplos: lo que sí se responde (verde) y lo que no (rojo)
    const exY = 160;
    const yes = (x, k, r) => { add(this.add.circle(x, exY, r || 64, 0x22c55e, 0.18).setStrokeStyle(4, 0x22c55e)); add(fit(this.add.image(x, exY, k), (r || 64) * 1.5)); };
    const no = (x, k) => { add(this.add.circle(x, exY, 56, 0xef4444, 0.12).setStrokeStyle(3, 0xef4444)); add(fit(this.add.image(x, exY, k), 84)); };
    const dists = [this.keys.dists[0], this.keys.dists[1]].filter(Boolean);
    if (this.mg === 'path') {
      // el amigo guía y sus huellas sobre las piedras, hasta la meta
      const tex = TEX[this.themeKey], guide = raceHelper(this.themeKey);
      add(fit(this.add.image(250, exY, tex[guide + '_run'] || tex[guide]), 96));
      [370, 460, 550].forEach((x, i) => {
        add(this.add.ellipse(x, exY + 10 + (i === 1 ? -26 : 0), 76, 46, 0xe2e8f0, 0.3).setStrokeStyle(3, th.accent, 0.6));
        txt(x, exY + 8 + (i === 1 ? -26 : 0), '👣', 24);
      });
      yes(680, this.keys.target, 50);
      txt(470, exY + 84, 'Mira el camino de ' + this.charName(guide) + '... ¡y repítelo de memoria!', 22, '#86efac');
    } else if (this.mg === 'dodge') {
      // tres poderes como sombras; el del medio se detiene (verde): ahí hay que ponerse
      const k = dodgeTex(this, (DODGE_WORLD[this.themeKey] || DODGE_WORLD.heroes).powers[0]);
      [330, 480, 630].forEach((x, i) => {
        const safe = i === 1, col = safe ? 0x22c55e : 0xef4444;
        add(this.add.circle(x, exY, 56, col, 0.15).setStrokeStyle(4, col));
        if (k) { const im = add(fit(this.add.image(x, exY, k), 76)); if (!safe) im.setTint(0x0f172a); else im.setAlpha(0.45); }
      });
      const dw = DODGE_WORLD[this.themeKey] || DODGE_WORLD.heroes;
      txt(480, exY + 84, '¡Ponte donde se detiene ' + dodgeUno(dw.one) + '!', 22, '#86efac');
    } else if (this.mg === 'notx' || this.mg === 'ax') {
      this.playDemo(add, txt);   // demostración animada paso a paso
    } else {
      yes(260, this.keys.target);
      txt(260, exY + 84, '✔ ¡Este sí!', 22, '#86efac');
      dists.forEach((k, i) => no(560 + i * 150, k));
      txt(560 + (dists.length - 1) * 75, exY + 84, '✘ Estos no', 22, '#fca5a5');
    }

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
    // En la Carrera con amigo, quien persigue es el amigo (el protagonista lanza el poder)
    const helper = this.runnerRole && (STORY[this.themeKey].companions || []).find(c => c.role === this.runnerRole);
    const chase = !this.lead ? '' : helper ? '¡' + helper.name + ' persigue ' + th.villainObj + '! ' : '¡Persigue ' + th.villainObj + '! ';
    if (CLASSIC_LIKE.includes(this.mg)) {
      const act = touch ? 'Toca la pantalla' : 'Presiona ESPACIO';
      if (touch) icon(220, ctrlY, '👆'); else keycap(220, ctrlY, 210, 'ESPACIO');
      explain = this.mg === 'notx' ? act + ' con cada ' + (this.chars || this.mode === 'prueba' ? 'personaje' : 'señal') + ' que aparezca, MENOS cuando veas ' + what
        : this.mg === 'ax' ? act + ' cuando veas ' + what + ' justo después de la pista. Si sale sin la pista, ¡no toques!'
        : act + ' solo cuando veas ' + what;
    } else if (this.mg === 'catch') {
      if (touch) { icon(220, ctrlY, '👆↔'); explain = 'Arrastra el dedo para mover ' + holder + '. Atrapa solo ' + what + ' y esquiva lo demás'; }
      else { keycap(185, ctrlY, 58, '←'); keycap(255, ctrlY, 58, '→'); explain = 'Mueve ' + holder + ' con las flechas (o el ratón). Atrapa solo ' + what + ' y esquiva lo demás'; }
      if (this.revealY) explain += '. ¡Ojo! Todo cae como sombra y se descubre al cruzar la línea amarilla: decide rápido';
    } else if (this.mg === 'path') {
      const guideName = this.charName(raceHelper(this.themeKey));
      const rest = ' ' + guideName + ' salta de piedra en piedra hasta ' + what + '. Cuando sus huellas se borren, lleva a tu personaje por el mismo camino.'
        + ((this.level || 1) >= 4 ? ' ¡Ojo! El villano deja huellas falsas.' : '');
      if (touch) { icon(220, ctrlY, '👆'); explain = 'Toca la piedra de al lado para avanzar.' + rest; }
      else { keycap(220, ctrlY - 32, 58, '↑'); keycap(185, ctrlY + 34, 58, '←'); keycap(255, ctrlY + 34, 58, '→'); explain = 'Avanza con las flechas (o tocando la piedra).' + rest; }
    } else if (this.mg === 'dodge') {
      const of = th.villainObj.replace(/^al /, 'del ').replace(/^a /, 'de ');
      const dw = DODGE_WORLD[this.themeKey] || DODGE_WORLD.heroes, side = dw.side;
      const many = dw.many.replace(/^./, m => m.toUpperCase());
      const rest = ' ' + many + ' ' + of + ' llegan como sombras. A mitad de camino ' + dodgeUno(dw.one) + ' se detiene: ¡ponte en su carril! No te muevas antes de tiempo.';
      if (touch) { icon(220, ctrlY, side ? '👆↕' : '👆↔'); explain = 'Toca ' + (side ? 'arriba o abajo' : 'a un lado') + ' de tu personaje para moverte.' + rest; }
      else if (side) { keycap(220, ctrlY - 32, 58, '↑'); keycap(220, ctrlY + 34, 58, '↓'); explain = 'Muévete con las flechas.' + rest; }
      else { keycap(185, ctrlY, 58, '←'); keycap(255, ctrlY, 58, '→'); explain = 'Muévete con las flechas.' + rest; }
    } else if (this.mg === 'race') {
      if (touch) { icon(220, ctrlY, '👆'); explain = chase + 'Toca arriba o abajo de tu personaje para cambiar de carril. Alcanza solo ' + what; }
      else { keycap(220, ctrlY - 32, 58, '↑'); keycap(220, ctrlY + 34, 58, '↓'); explain = chase + 'Cambia de carril con las flechas. Alcanza solo ' + what; }
    } else {
      if (touch) { icon(220, ctrlY, '👆'); explain = 'Toca ' + what + '. Si no está, no toques nada'; }
      else { icon(220, ctrlY, '🖱️'); explain = 'Haz clic sobre ' + what.replace(/^al /, 'el ').replace(/^a /, '') + '. Si no está, no hagas clic'; }
    }
    txt(330, ctrlY, explain, 22, '#ffffff', { align: 'left', wordWrap: { width: 560 }, lineSpacing: 6 }).setOrigin(0, 0.5);
    // leer en voz alta (solo en los de 5 a 7 años se lee al aparecer)
    addSpeakButton(this, W - 130, 58, () => title + '. ' + explain + (this.twist ? '. ' + this.twist.name + ': ' + this.twist.desc : ''), D + 1, it);
    // lo nuevo de este mundo
    if (this.twist) txt(W / 2, 410, '✨ ' + this.twist.name + ': ' + this.twist.desc, 19, '#fde047', { wordWrap: { width: 800 } });

    // Empezar cuando el niño esté listo (botón, o ESPACIO / ENTER en computador)
    const btn = add(this.add.rectangle(W / 2, 462, 260, 62, th.accent).setInteractive({ useHandCursor: true }));
    txt(W / 2, 462, '¡Empezar!', 26, '#0f172a');
    if (!touch) txt(W / 2, 506, 'o presiona ESPACIO', 15, '#94a3b8');
    let gone = false;
    const go = () => {
      if (gone) return; gone = true;
      if (this.demoTimer) { this.demoTimer.remove(); this.demoTimer = null; }
      stopSpeaking();
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

  // Demostración de Menos uno y Pista: una pantallita muestra una secuencia de ejemplo y dice qué hacer con
  // cada señal (verde = tocar, rojo = no tocar, amarillo = la pista). En Pista se ve también lo que salió antes.
  playDemo(add, txt) {
    // con personajes: 'el Duende Pícaro', 'Sombra', 'Morgana' (sin el 'a' de villainObj)
    const th = this.theme, k = this.keys, label = this.chars ? th.villainObj.replace(/^al /, 'el ').replace(/^a /, '') : th.targetLabel;
    const steps = this.mg === 'notx' ? [
      { key: k.dists[0], ok: true, say: '✔ No es ' + label + ': ¡toca!' },
      { key: k.dists[1], ok: true, say: '✔ Tampoco es: ¡toca!' },
      { key: k.target, ok: false, say: '✘ ¡Es ' + label + '! NO toques' },
      { key: k.dists[0], ok: true, say: '✔ ¡Toca!' }
    ] : [
      { key: k.dists[0], cue: true, say: '★ Esta es la PISTA: no toques, ¡recuérdala!' },
      { key: k.target, ok: true, say: '✔ Salió después de la pista: ¡toca!' },
      { key: k.dists[1], ok: false, say: '✘ Otra cosa: no toques' },
      { key: k.target, ok: false, say: '✘ Sin la pista antes: ¡NO toques!' },
      { key: k.dists[0], cue: true, say: '★ La pista otra vez: ¡recuérdala!' },
      { key: k.dists[1], ok: false, say: '✘ Después de la pista vino otra cosa: no toques' }
    ];
    const cx = 480, cy = 150;
    txt(cx, 96, 'Mira cómo se juega:', 18, '#cbd5e1');
    const box = add(this.add.graphics());
    box.fillStyle(0x1e293b, 1); box.fillRoundedRect(cx - 110, cy - 42, 220, 108, 16);
    const frame = add(this.add.graphics());
    const img = add(this.add.image(cx, cy + 12, steps[0].key));
    const say = txt(cx, cy + 92, '', 21, '#ffffff');
    const tap = txt(cx + 150, cy + 12, '', 40);   // 👆 cuando hay que tocar
    let prev = null, prevLbl = null;
    if (this.mg === 'ax') {   // lo que salió justo antes (hay que recordarlo)
      prevLbl = txt(cx - 175, cy - 24, 'antes salió:', 15, '#94a3b8');
      prev = add(this.add.image(cx - 175, cy + 22, steps[0].key).setAlpha(0));
    }
    let i = 0;
    const show = () => {
      const st = steps[i % steps.length], before = steps[(i + steps.length - 1) % steps.length];
      const color = st.cue ? 0xfacc15 : st.ok ? 0x22c55e : 0xef4444;
      frame.clear(); frame.lineStyle(5, color, 1); frame.strokeRoundedRect(cx - 110, cy - 42, 220, 108, 16);
      fit(img.setTexture(st.key), 84).setScale(img.scale * 0.6);
      this.tweens.add({ targets: img, scale: img.scale / 0.6, duration: 220, ease: 'Back.easeOut' });
      say.setText(st.say).setColor(st.cue ? '#fde047' : st.ok ? '#86efac' : '#fca5a5');
      tap.setText(st.ok ? '👆' : '');
      if (prev) { if (i > 0) fit(prev.setTexture(before.key), 54).setAlpha(0.8); else prev.setAlpha(0); }
      i++;
    };
    show();
    this.demoTimer = this.time.addEvent({ delay: 1900, loop: true, callback: show });
  }

  setupMinigame() {
    const W = GAME_W, H = GAME_H;
    this.mgObjects = [];
    this.caster = null;
    if (CLASSIC_LIKE.includes(this.mg)) {
      this.stim = this.add.image(W / 2, H / 2, this.keys.target).setVisible(false);
      this.input.keyboard.on('keydown-SPACE', () => this.respond());
      this.input.on('pointerdown', () => this.respond());
    } else if (this.mg === 'catch') {
      this.basket = fit(this.add.image(W / 2, H - 60, this.chars ? TEX[this.themeKey].net : TEX[this.themeKey].catcher), this.chars ? 120 : 160).setDepth(3);
      this.mgObjects.push(this.basket);
      this.cursors = this.input.keyboard.createCursorKeys();
      const follow = p => { if (this.started) this.basket.x = Phaser.Math.Clamp(this.cameras.main.getWorldPoint(p.x, p.y).x, 70, W - 70); };
      this.input.on('pointermove', follow);
      this.input.on('pointerdown', follow);
      this.fallSpeed = (H - 60 + 60) / this.params.travelMs * 1000;
      // línea donde los objetos se descubren (desde el nivel 2; no en el jefe ni en la Prueba fija)
      this.revealY = this.boss || this.mode === 'prueba' ? 0 : (this.params.revealY || 0);
      if (this.revealY) {
        const line = this.add.graphics().setDepth(1);
        line.lineStyle(3, 0xfde047, 0.45);
        for (let x = 0; x < W; x += 28) line.lineBetween(x, this.revealY, x + 16, this.revealY);
        this.mgObjects.push(line);
      }
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
      const tex = TEX[this.themeKey];
      // pose corriendo decidido (friendN_run); si todavía no hay, su imagen normal
      const runKey = this.runnerRole ? tex[this.runnerRole + '_run'] || tex[this.runnerRole] : tex.hero_run;
      this.runner = fit(this.add.image(170, this.lanes[1], runKey), 104).setDepth(4);
      this.mgObjects.push(this.runner);
      this.bob = this.tweens.add({ targets: this.runner, angle: { from: -4, to: 4 }, duration: 160, yoyo: true, repeat: -1 });
      // El villano corre adelante, cambia de carril y va soltando los objetos.
      // (Con personajes se persigue al villano en persona, entre amigos, así que no hay nadie adelante.)
      if (!this.chars) {
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
    if (this.mg === 'dodge') this.setupDodge();   // juego/escenas/esquiva.js
    if (this.mg === 'path') this.setupPath();     // juego/escenas/camino.js
    // En Clásico y Encuentra, el protagonista aparece abajo a la izquierda y lanza su poder.
    // En Carrera, si corre el amigo, el protagonista va arriba a la izquierda (encima de la pista) y le lanza el poder.
    if (this.powers && (CLASSIC_LIKE.includes(this.mg) || this.mg === 'find' || this.runnerRole)) {
      this.caster = this.runnerRole ? fit(this.add.image(62, 92, TEX[this.themeKey].hero), 104).setDepth(7)
        : fit(this.add.image(70, H - 70, TEX[this.themeKey].hero), 120).setDepth(7);
      this.mgObjects.push(this.caster);
    }
    // 'find' no necesita elementos fijos: crea los objetos en cada ronda
    this.mgObjects.forEach(o => o.setVisible(false));
  }

  begin() {
    this.intro.forEach(o => o.destroy());
    this.showReminder();
    this.mgObjects.forEach(o => o.setVisible(true));
    this.t0 = performance.now();
    this.started = true;
    if (CLASSIC_LIKE.includes(this.mg)) this.nextTrial();
    else if (this.mg === 'find') this.nextFindTrial();
    else if (this.mg === 'dodge') this.time.delayedCall(500, () => this.nextDodge());
    else if (this.mg === 'path') this.nextPath();
    else this.scheduleSpawn();
    if (this.lead) this.time.delayedCall(1200, () => this.moveLead());
    this.scheduleAudio();
    this.scheduleVisual();
    startTwistAmbient(this);
    if (this.mode !== 'prueba') { preloadWorldSfx(this.themeKey); startAmbientSounds(this); }
  }

  elapsed() { return performance.now() - this.t0; }

  // ---------- Nombres de los personajes (siempre por su nombre, nunca "el amigo") ----------
  charName(role) {
    const c = (STORY[this.themeKey].companions || []).find(k => k.role === role);
    return c ? c.name : this.theme.villain;
  }
  charThe(role) {   // con artículo si lo lleva: "el Hada del Bosque", "la Capitana Estrella", "Zuri"
    const c = (STORY[this.themeKey].companions || []).find(k => k.role === role);
    return c ? (c.the || c.name) : this.theme.villain;
  }
  // de qué personaje es una imagen (para llamarlo por su nombre)
  nameOfKey(key) {
    const tex = TEX[this.themeKey];
    const role = ['friend1', 'friend2', 'friend3'].find(r => tex[r] === key);
    return role ? this.charName(role) : null;
  }

  // ---------- Recordatorio fijo arriba: qué hay que hacer en este juego, con nombres ----------
  reminderText() {
    const th = this.theme, noun = s => s.replace(/^al /, 'el ').replace(/^a /, '');
    // solo el nombre: "a Lumi" en vez de "a Lumi, el hada rosada"
    const what = (this.chars ? th.villainObj : this.mode === 'prueba' ? 'a ' + th.targetLabel : th.targetObj).split(',')[0], who = noun(what);
    const tex = TEX[this.themeKey];
    if (this.mg === 'classic') return 'Toca solo cuando aparezca ' + who;
    if (this.mg === 'notx') return 'Toca todo, MENOS cuando aparezca ' + who;
    if (this.mg === 'ax') {
      const cueRole = ['friend1', 'friend2', 'friend3'].find(r => tex[r] === this.keys.dists[0]);
      const cue = this.chars && cueRole ? this.charThe(cueRole)
        : this.mode === 'prueba' ? THEMES[PRUEBA_CUE[0]].targetLabel.split(',')[0] : th.cueLabel || 'la pista';
      return 'Toca ' + what + ' solo si justo antes salió ' + cue;
    }
    if (this.mg === 'catch') return 'Atrapa solo ' + what + ' con ' + (this.chars ? 'la red' : th.catcherName || 'la canasta');
    if (this.mg === 'race') return this.runnerRole ? this.charThe(this.runnerRole).replace(/^./, m => m.toUpperCase()) + ' persigue: alcanza solo ' + what : 'Alcanza solo ' + what;
    if (this.mg === 'find') return 'Encuentra ' + what + '. Si no está, no toques nada';
    if (this.mg === 'dodge') { const d = DODGE_WORLD[this.themeKey] || DODGE_WORLD.heroes; return 'Ponte en el carril ' + dodgeOf(d.one) + ' que se detiene'; }
    if (this.mg === 'path') return 'Sigue de memoria el camino de ' + this.charName(raceHelper(this.themeKey));
    return '';
  }
  showReminder() {
    const s = this.reminderText();
    if (!s) return;
    const W = GAME_W, y = 52;
    const t = this.add.text(W / 2 + 14, y, s, { font: 'bold 17px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(6);
    const iconKey = this.mg === 'path' ? TEX[this.themeKey][raceHelper(this.themeKey)]
      : this.mg === 'dodge' ? dodgeTex(this, (DODGE_WORLD[this.themeKey] || DODGE_WORLD.heroes).powers[0]) || TEX[this.themeKey].villain : this.keys.target;
    const icon = fit(this.add.image(t.x - t.width / 2 - 20, y, iconKey), 28).setDepth(6);
    const g = this.add.graphics().setDepth(5);
    g.fillStyle(0x0f172a, 0.72);
    g.fillRoundedRect(icon.x - 24, y - 17, t.width + 62, 34, 17);
    g.lineStyle(2, this.theme.accent, 0.8); g.strokeRoundedRect(icon.x - 24, y - 17, t.width + 62, 34, 17);
    // el contador de la misión, un poco más abajo para no chocar
    if (this.missionText) { this.missionText.setY(86); this.missionIcon.setY(86); }
  }

  // Pausa (botón Salir): al seguir, se corren los tiempos para no contar la pausa en la sesión ni en los TR
  resumeFromPause(ms) {
    if (this.t0 === undefined || !this.started) return;
    this.t0 += ms;
    if (this.current) this.current.onset += ms;
    this.items.forEach(it => { it.onset += ms; });
    if (this.ft) this.ft.onset += ms;
  }
  exitGame() {
    this.ended = true;
    if (this.started) addPlayTime(this, this.elapsed());   // el tiempo jugado cuenta para la Misión del día
    stopVoice();
    const [scene, data] = exitTarget(this);
    this.scene.start(scene, data);
  }

  // type: 'target' = hay que responder · 'distractor' = no hay que responder. cond: condición (queda en el CSV)
  pickStimulus() {
    const P = this.params;
    if (this.mg === 'notx') {
      // Menos uno (como el Conners): casi todo se responde (señales de los amigos); al objetivo, NO
      if (Math.random() < P.noGoProb) return { type: 'distractor', key: this.keys.target, cond: 'no_responder' };
      return { type: 'target', key: this.distractorKey(), cond: 'responder' };
    }
    if (this.mg === 'ax') {
      // Pista (AX-CPT): la pista (A) es la señal del primer amigo; el objetivo (X) se responde solo si viene
      // justo después de la pista. AX = responder · AY = pista sin objetivo · BX = objetivo sin pista (trampa:
      // si responde, no recordó la pista) · BY = ni pista ni objetivo
      const other = () => (Math.random() < P.similarProb ? this.keys.similar
        : this.keys.others ? Phaser.Utils.Array.GetRandom(this.keys.others) : this.keys.dists[1]);
      let s;
      if (this.lastWasCue) {
        s = Math.random() < P.axAfterCue ? { type: 'target', key: this.keys.target, cond: 'AX' }
          : { type: 'distractor', key: other(), cond: 'AY' };
      } else {
        const r = Math.random();
        s = r < P.axCueProb ? { type: 'distractor', key: this.keys.dists[0], cond: 'A' }
          : r < P.axCueProb + P.axLureProb ? { type: 'distractor', key: this.keys.target, cond: 'BX' }
          : { type: 'distractor', key: other(), cond: 'BY' };
      }
      this.lastWasCue = s.cond === 'A';
      return s;
    }
    if (Math.random() < P.targetProb) return { type: 'target', key: this.keys.target };
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
      theme: this.mode === 'prueba' ? 'mixto' : this.themeKey,
      level: this.level || '',
      chapter: this.chapter === null ? '' : this.chapter + 1,
      phase: this.boss ? this.phase + 1 : '',
      minigame: this.mg,
      stim_set: this.mode === 'prueba' ? 'mixto' : this.chars ? 'personajes' : 'senales',
      pace: this.params.pace || 1,
      twist: this.twist ? this.twist.name : '',
      trial: trial,
      stimulus_type: type,
      stimulus_key: key,
      onset_ms: Math.round(onset - this.t0),
      responded: responded ? 1 : 0,
      rt_ms: rt === null ? '' : Math.round(rt),
      outcome: outcome
    });
    if (outcome === 'hit') this.buddyCheer();   // el compañero celebra
    if (outcome === 'hit' && this.missionText) {
      this.missionText.setText(this.theme.missionCount + ': ' + (++this.missionCount));
      this.missionIcon.x = GAME_W - 40 - this.missionText.width;
      this.tweens.add({ targets: this.missionIcon, scale: { from: this.missionIcon.scale * 1.5, to: this.missionIcon.scale }, duration: 250 });
    }
  }

  update(time, delta) {
    if (!this.started || this.ended) return;
    const dt = delta / 1000;
    this.bar.width = this.barW * Math.min(1, this.elapsed() / this.params.sessionMs);
    if (this.mg === 'catch') this.updateCatch(dt);
    else if (this.mg === 'race') this.updateRace(dt);
    else if (this.mg === 'dodge') this.dodgeWatch(delta);
    else if (this.mg === 'path') {
      // si se queda mucho rato sin llegar después del tiempo, se termina igual
      if (this.elapsed() > this.params.sessionMs + 20000) { this.endPath(false); this.finish(); return; }
    }
  }

  ring(x, y) {
    const r = this.add.circle(x, y, 70).setStrokeStyle(8, 0x86efac).setDepth(6);
    this.tweens.add({ targets: r, scale: 1.6, alpha: 0, duration: 500, onComplete: () => r.destroy() });
  }
  praise() {
    rewardSound();
    this.fb.setText(this.chars ? CAST_WORD[this.mg] : '¡Bien!').setAlpha(1);
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
      const pk = sizeScale(this, 'puff', 20);   // la nube mide unos 20 px, sea imagen o dibujo
      const em = this.add.particles(ox, oy, 'puff', { speed: { min: 20, max: 60 }, lifespan: 450,
        scale: { start: 0.8 * pk, end: 0 }, alpha: { start: 0.6, end: 0 }, emitting: false }).setDepth(9);
      em.explode(8);
      this.time.delayedCall(600, () => em.destroy());
      return;
    }
    // Si el objetivo es un compañero (hermanito de Chispa, Lumi), se le rescata: nada de atacarlo.
    // El poder de ataque queda para el villano (jefe final) o, en Superhéroes, para la señal de Sombra.
    // En Menos uno con personajes lo que se toca son los amigos (se les deja pasar): tampoco se les ataca.
    const friendly = this.chars && this.mg === 'notx';
    if ((p.rescue && !this.chars) || friendly) {
      rescueSound();
      // en Menos uno con personajes se deja pasar al amigo, llamándolo por su nombre
      const passName = friendly && this.current ? this.nameOfKey(this.current.key) : null;
      this.fb.setText(friendly ? (passName ? '¡Pasa, ' + passName + '!' : CAST_WORD.notx) : p.rescue.shout).setAlpha(1);
      // si el protagonista está en pantalla, de él salen unas estrellitas hacia el rescatado
      if (c) for (let i = 0; i < 3; i++) {
        const s = fit(this.add.image(ox, oy, 'magicstar'), 26).setDepth(9);
        this.tweens.add({ targets: s, x: tx + Phaser.Math.Between(-20, 20), y: ty + Phaser.Math.Between(-20, 20), angle: 360,
          duration: 200, delay: i * 50, onComplete: () => s.destroy() });
      }
      this.tweens.add({ targets: this.fb, alpha: 0, duration: 800 });
      this.rescueEffect(tx, ty);
      return;
    }
    POWER_SOUNDS[this.themeKey]();
    this.fb.setText(this.chars ? CAST_WORD[this.mg] : p.shout).setAlpha(1);
    this.tweens.add({ targets: this.fb, alpha: 0, duration: 700 });
    const sx = c ? ox : tx, sy = c ? oy : 0;   // sin lanzador en pantalla, el poder cae desde arriba
    if (p.kind === 'bolt') {
      this.drawBolt(sx, sy, tx, ty, p.color);
      const fl = this.add.rectangle(0, 0, GAME_W, GAME_H, 0xffffff, 0.2).setOrigin(0).setDepth(9);
      this.tweens.add({ targets: fl, alpha: 0, duration: 160, onComplete: () => fl.destroy() });
      this.impact(tx, ty);
    } else if (p.kind === 'roar') {
      // rugido (Tito): 3 ondas que viajan hacia el objetivo y crecen
      for (let i = 0; i < 3; i++) {
        const ring = this.add.circle(sx, sy, 16, p.color, 0).setStrokeStyle(6, p.color, 0.9).setDepth(9);
        this.tweens.add({ targets: ring, x: tx, y: ty, scale: 3, alpha: 0.2, duration: 260, delay: i * 70,
          onComplete: () => { ring.destroy(); if (i === 2) this.impact(tx, ty); } });
      }
      this.cameras.main.shake(180, 0.006);
    } else {
      const n = p.kind === 'sprinkles' ? 9 : p.kind === 'stars' || p.kind === 'bubbles' || p.kind === 'leaves' ? 5 : 1;
      for (let i = 0; i < n; i++) {
        // burbujas (Coral): círculos transparentes con borde blanco · hojas (Kiara): óvalos verdes con borde oscuro ·
        // si no, estrellas o bola de fuego
        const proj = p.kind === 'bubbles'
          ? this.add.circle(sx, sy, Phaser.Math.Between(10, 18), p.color, 0.35).setStrokeStyle(3, 0xffffff, 0.9).setDepth(9)
          : p.kind === 'sprinkles'   // chispas de azúcar (Gomi): palitos de colores, como confites
          ? this.add.rectangle(sx, sy, 20, 7, Phaser.Utils.Array.GetRandom([0xf472b6, 0x60a5fa, 0xfde047, 0x4ade80, 0xf97316, 0xffffff]), 1).setStrokeStyle(2, 0x0f172a, 0.6).setDepth(9)
          : p.kind === 'leaves'
          ? this.add.ellipse(sx, sy, 34, 16, Phaser.Utils.Array.GetRandom([p.color, 0x22c55e, 0x86efac]), 1).setStrokeStyle(3, 0x14532d, 1).setDepth(9)
          : fit(this.add.image(sx, sy, p.kind === 'fire' ? 'fireball' : 'magicstar'), p.kind === 'fire' ? 56 : 40).setDepth(9);
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
    this.tweens.killTweensOf(this.stim);
    fit(this.stim.setTexture(s.key).setVisible(true).setAlpha(1).setPosition(GAME_W / 2, GAME_H / 2).setAngle(0), 160);
    twistItem(this, this.stim);
    this.current = { trial: this.trial, type: s.type, key: s.key, cond: s.cond, onset: performance.now(), responded: false, rt: null };
    this.time.delayedCall(P.stimMs, () => this.endTrial());
  }
  endTrial() {
    const c = this.current;
    this.stim.setVisible(false);
    let outcome;
    if (c.type === 'target') outcome = c.responded ? 'hit' : 'omission';
    else outcome = c.responded ? 'commission' : 'correct_rejection';
    this.logTrial(c.trial, c.type, c.key, c.onset, c.responded, c.rt, outcome);
    if (c.cond) this.log[this.log.length - 1].condition = c.cond;   // Menos uno y Pista
    this.current = null;
    this.time.delayedCall(Phaser.Math.Between(this.params.isiMin, this.params.isiMax), () => this.nextTrial());
  }
  respond() {
    const c = this.current;
    if (!this.started || this.ended || !c || c.responded) return;
    c.responded = true;
    c.rt = performance.now() - c.onset;
    // Modo Examen: como en el CPT real, no se dice si estuvo bien o mal (solo se registra)
    if (this.mode === 'prueba') return;
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
      // si hay línea, cae como sombra (todas iguales) y se descubre al cruzarla
      img = fit(this.add.image(x, -50, this.revealY ? (silhouetteOf(this, s.key, '#cbd5e1') || s.key) : s.key), this.chars ? 100 : 88);
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
      img = fit(this.add.image(W + 60, this.lanes[lane], s.key), this.chars ? 96 : 78);
    }
    if (lane !== null) this.lastLane = lane;
    this.trial++;
    const item = { img, lane, trial: this.trial, type: s.type, key: s.key, onset: performance.now(), resolved: false,
      hidden: this.mg === 'catch' && !!this.revealY };
    this.items.push(item);
    twistItem(this, img, item);
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
      it.img.y += this.fallSpeed * dt * updateTwistItem(this, it, dt);
      if (it.hidden && it.img.y >= this.revealY) {
        // se descubre: el tiempo de reacción se cuenta desde aquí (cuando ya se puede saber qué es)
        it.hidden = false;
        it.onset = performance.now();
        fit(it.img.setTexture(it.key), this.chars ? 100 : 88);
        this.tweens.add({ targets: it.img, scale: { from: it.img.scale * 1.3, to: it.img.scale }, duration: 160 });
      }
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
      it.img.x -= dx * updateTwistItem(this, it, dt);
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
    const ft = this.ft = { trial: this.trial, present, onset: performance.now(), imgs: [], done: false };
    for (let i = 0; i < P.setSize; i++) {
      const isTarget = i === targetIdx;
      const key = isTarget ? this.keys.target : this.distractorKey();
      const [cx, cy] = cells[i];
      const img = fit(this.add.image(cx + Phaser.Math.Between(-30, 30), cy + Phaser.Math.Between(-20, 20), key), 100)
        .setInteractive({ useHandCursor: true });
      img.on('pointerdown', () => this.findTap(ft, isTarget, key, img));
      twistItem(this, img);
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
      theme: this.mode === 'prueba' ? 'mixto' : this.themeKey,
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
  // Qué amigo acompaña: el que presenta el capítulo (Historia) o uno según el nivel (Desafío)
  companionRole() {
    if (this.mode === 'historia' && !this.boss) {
      const c = (STORY[this.themeKey].companions || [])[this.chapter];
      return c && c.role !== 'villain' ? c.role : null;   // en el capítulo 4 presenta el villano: sin compañero
    }
    return this.mode === 'desafio' ? ['friend1', 'friend2', 'friend3'][(this.level - 1) % 3] : null;
  }
  setupBuddy() {
    this.buddy = null;
    this.buddyRole = this.companionRole();
    this.buddyJumping = false;
    if (this.mg === 'dodge') return;   // en Esquiva el protagonista usa toda la pantalla
    if (!this.buddyRole || this.buddyRole === this.runnerRole) return;   // si es el que corre en la Carrera, no está en la esquina
    const x = this.caster && !this.runnerRole ? 170 : 66;   // en Carrera el protagonista está arriba: el amigo, en la esquina   // en Clásico y Encuentra, al lado del protagonista
    this.buddy = fit(this.add.image(x, GAME_H - 6, TEX[this.themeKey][this.buddyRole]).setOrigin(0.5, 1), 104).setDepth(-1);
    this.buddyY = this.buddy.y;
    this.tweens.add({ targets: this.buddy, angle: { from: -3, to: 3 }, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }
  buddyCheer() {
    if (!this.buddy || this.buddyJumping) return;
    this.buddyJumping = true;
    // si tiene pose celebrando, la usa mientras salta y luego vuelve a la normal
    const tex = TEX[this.themeKey], cheer = tex[this.buddyRole + '_cheer'];
    if (cheer) fit(this.buddy.setTexture(cheer), 110);
    this.tweens.add({ targets: this.buddy, y: this.buddyY - 28, duration: 170, yoyo: true, hold: cheer ? 260 : 0, ease: 'Quad.easeOut',
      onComplete: () => {
        if (cheer) fit(this.buddy.setTexture(tex[this.buddyRole]), 104);
        this.buddyJumping = false;
      } });
  }
  // Un amigo para una escena de fondo: el pedido, salvo que sea el compañero que ya está en pantalla
  castFriend(pref) {
    if (pref && pref !== this.buddyRole) return pref;
    return Phaser.Utils.Array.GetRandom(['friend1', 'friend2', 'friend3'].filter(f => f !== this.buddyRole && f !== pref));
  }
  // Qué frases dicen los personajes: cada capítulo las suyas (0-3, y 4 el jefe final), para que no se repitan
  // entre capítulos. En el Desafío, los niveles van pasando por las frases de los capítulos 1 a 4.
  voiceChapter() {
    return this.mode === 'historia' ? this.chapter : ((this.level || 1) - 1) % 4;
  }
  // ¿Tiene frase en este capítulo? (las de los amigos van hasta el capítulo 4: en el jefe ellos son los distractores)
  // Las del villano se turnan entre sus frases; las del amigo ("¡ayuda!") no suenan en el jefe (ahí los amigos son
  // los distractores).
  hasVoice(name) {
    const v = (DISTRACTORS[this.themeKey].voices || {})[name], k = this.voiceChapter();
    if (!v) return false;
    if (v.who !== 'villain' && k >= 4) return false;
    return !!(v.text && v.text.length);
  }
  // Voz de un distractor. Las del amigo ("¡ayuda!") están grabadas con la voz de cada amigo.
  // No suena si es la voz de un amigo en particular que ahora es el compañero (no puede estar en dos lados).
  castVoice(name, friendRole) {
    const v = (DISTRACTORS[this.themeKey].voices || {})[name];
    if (!v || !this.hasVoice(name)) return;
    if (v.who !== 'friend' && v.who !== 'villain' && v.who === this.buddyRole) return;
    // risas y "¡ayuda!" (random): una al azar · burlas y amenazas: la del capítulo, turnándose ('dist_burla_1'...)
    const idx = v.random ? Phaser.Math.Between(0, v.text.length - 1) : this.voiceChapter() % v.text.length;
    const played = playClip(this.themeKey, 'dist_' + name + '_' + (idx + 1));
    if (played) this.logDistractor('audio_distractor', 'voz_' + name);
    if (name === 'amenaza') runThreatFx(this, idx);   // lo que amenaza pasa en el fondo (juego/nucleo/hechizos.js)
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
      // Voces del villano (risa, burla, amenaza): se le ve hablando. Sale en una escena de fondo (se asoma, cruza
      // o espía) o, en Carrera, ya va corriendo adelante. Las de los amigos ("¡ayuda!") suenan con su escena
      // (pelea, persecución), con la voz del amigo que está en peligro.
      // En los niveles de personajes (y el jefe final) el villano y los amigos ya están en pantalla como objetivo y
      // distractores: no hay escenas de fondo, así que sus frases se oyen solas (las de todos los personajes).
      const onlyVoice = this.mode !== 'prueba' && this.chars;
      const canShow = this.mode !== 'prueba' && !this.chars && (this.mg === 'race' ? !!this.lead : !this.castBusy);
      const voices = Object.keys(D.voices || {})
        .filter(n => this.hasVoice(n) && (onlyVoice || (canShow && D.voices[n].who === 'villain'))).map(n => 'voz_' + n);
      const names = Object.keys(sounds).concat(voices);
      const name = names.length ? Phaser.Utils.Array.GetRandom(names) : 'tono';
      if (name.startsWith('voz_')) { if (onlyVoice) this.castVoice(name.slice(4)); else this.villainSpeaks(name.slice(4)); }
      else {
        // la grabación real si la hay (assets/sonidos.js); si no, el sonido hecho con código
        if (names.length) { if (!playNamedSfx(name)) sounds[name](); } else distractorSound();
        this.logDistractor('audio_distractor', name);
      }
      this.scheduleAudio();
    });
  }
  // El villano dice algo y se le ve: en Carrera ya está adelante (se sacude riéndose); en los demás juegos sale
  // en su escena de fondo con esa voz (o se asoma por una esquina si esa voz no tiene escena propia)
  villainSpeaks(name) {
    if (this.mg === 'race' || this.mg === 'dodge') {
      this.castVoice(name);
      const who = this.lead || this.dodgeVillain;
      if (who) this.tweens.add({ targets: who, scale: who.scale * 1.15, duration: 150, yoyo: true, repeat: 3 });
      return;
    }
    const D = DISTRACTORS[this.themeKey];
    const villainName = this.theme.villain.toLowerCase().replace(/[^a-záéíóúñ]+/g, '_');
    const c = (D.cast || []).find(k => k.voice === name && ['peek', 'sneak', 'face'].includes(k.kind))
      || { name: villainName + '_se_asoma', kind: 'peek', voice: name };
    this.showCastScene(c);
    this.logDistractor('visual_distractor', c.name);
  }
  // Visuales: algo del mundo cruza por el borde de arriba (fly) o de abajo (walk), lejos del centro
  scheduleVisual() {
    const P = this.params;
    const D = DISTRACTORS[this.themeKey];
    const list = D.visual
      .filter(v => !((this.mg === 'catch' || this.mg === 'memory' || this.mg === 'dodge' || this.mg === 'path') && v.kind === 'walk'));   // abajo está la canasta / las casillas
    // Personajes del mundo (villano y amigos) desde su nivel. No en el jefe final (ahí ya son el objetivo y los
    // distractores) ni en Carrera (el villano ya va adelante).
    // (con personajes tampoco: el villano y los amigos ya son los estímulos). Cada mundo tiene un solo amigo al que
    // el villano ataca y persigue: si ese amigo está acompañando en la esquina, esas escenas no salen.
    // Además, en todos los mundos: el villano se roba el tesoro (desde el nivel 2) y su escena propia (desde el 3).
    const villainName = this.theme.villain.toLowerCase().replace(/[^a-záéíóúñ]+/g, '_');
    const extra = [{ name: villainName + '_roba_tesoro', kind: 'steal', minLevel: 2 },
      { name: villainName + '_lanza_' + (WORLD_SPLASH[this.themeKey] || WORLD_SPLASH.heroes).name, kind: 'splash', minLevel: 3 }];
    const cast = this.mode === 'prueba' || this.chars || this.mg === 'race' || this.mg === 'dodge' ? []
      : (D.cast || []).concat(extra).filter(c => (this.level || 0) >= c.minLevel && !(c.friend && c.friend === this.buddyRole));
    if (!P.visual || !list.length) return;
    const d = Phaser.Math.Between(P.visualEvery[0], P.visualEvery[1]);
    this.time.delayedCall(d, () => {
      if (this.ended) return;
      // en niveles altos cruzan varias cosas a la vez (una detrás de otra); una sola escena de personajes a la vez
      for (let k = 0; k < (P.visualCount || 1); k++) {
        this.time.delayedCall(k * 450, () => {
          if (this.ended) return;
          // la escena del amigo (pelea o persecución) sale una sola vez por nivel, y ninguna escena se repite seguida
          const free = cast.filter(c => c.name !== this.lastCast && !(c.friend && this.friendSceneDone));
          const v = Phaser.Utils.Array.GetRandom(this.castBusy ? list : list.concat(free));
          this.logDistractor('visual_distractor', this.showVisualDistractor(v) || v.name);
        });
      }
      this.scheduleVisual();
    });
  }
  showVisualDistractor(v) {
    if (['fight', 'sneak', 'chase', 'peek', 'face', 'steal', 'splash'].includes(v.kind)) return this.showCastScene(v);
    const W = GAME_W, H = GAME_H;
    const fromLeft = Math.random() < 0.5;
    const y = v.kind === 'walk' ? H - 32 : Phaser.Math.Between(62, 112);
    const img = fit(this.add.image(fromLeft ? -70 : W + 70, y, TEX[this.themeKey]['distractor_' + v.name]), v.size).setDepth(2);
    img.setFlipX(!fromLeft);   // los dibujos miran a la derecha
    this.tweens.add({ targets: img, x: fromLeft ? W + 70 : -70, duration: v.kind === 'walk' ? 5500 : 4000,
      onComplete: () => img.destroy() });
    if (v.kind === 'fly') this.tweens.add({ targets: img, y: y - 14, duration: 350, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    // Desde el nivel 2 suena mientras pasa (avión, pájaro, gato, murciélago...): distractor visual y auditivo a la vez
    if (v.sound && (this.level || 0) >= 2 && this.mode !== 'prueba') {
      // grabación real, sonando del lado por donde entra; si no hay, el sonido hecho con código
      // (el avión suena de un lado al otro)
      if (!playNamedSfx(v.name, fromLeft ? -0.5 : 0.5)) v.sound(fromLeft ? 1 : -1);
      this.logDistractor('audio_distractor', 'sonido_' + v.name);
    }
  }
  // Escenas "de fondo" con los personajes del mundo (detrás de los objetos del juego, para no taparlos):
  // fight = el villano pelea con un amigo en un borde (el amigo pide ayuda y se cubre) · peek = el villano se asoma
  // por una esquina de abajo y se ríe · sneak = cruza por arriba de puntillas · chase = uno huye por arriba y el otro
  // lo persigue (flee: huye el amigo) · face = la cara del villano espía desde un lado. Cada una con su voz (en el CSV).
  showCastScene(c) {
    const W = GAME_W, H = GAME_H, tex = TEX[this.themeKey], DEPTH = -1;
    if (c.kind === 'face' && !tex.villain_face) c = Object.assign({}, c, { kind: 'peek' });   // sin la imagen de la cara
    this.castBusy = true;
    this.lastCast = c.name;
    if (c.friend) this.friendSceneDone = true;
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
      const wins = Math.random() < 0.4;   // a veces el amigo se defiende y el villano huye asustado
      if (cower) this.time.delayedCall(950, () => { if (friend.active) fit(friend.setTexture(cower), 80); });
      if (wins) this.time.delayedCall(1700, () => {
        if (!friend.active) return;
        fit(friend.setTexture(tex[friendRole]), 100);
        fit(villain.setTexture(tex.villain_scared || tex.villain_run), 100).setFlipX(!left);
        const ok = this.add.text(fx + 30 * dir, y - 70, '¡Toma!', { font: 'bold 22px Arial', color: '#86efac', stroke: '#14532d', strokeThickness: 5 })
          .setOrigin(0.5).setDepth(DEPTH);
        objs.push(ok);
        this.tweens.add({ targets: villain, x: off, duration: 450 });
      });
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
      return wins ? c.name + '_gana_amigo' : c.name;
    } else if (c.kind === 'steal') {
      showStealScene(this, objs, end, DEPTH);
    } else if (c.kind === 'splash') {
      showSplashScene(this, objs, end, DEPTH);
    } else if (c.kind === 'peek') {
      // sube desde abajo en una esquina, se ríe (se sacude) y se vuelve a esconder.
      // Abajo a la izquierda están el protagonista (Clásico y Encuentra) y el compañero: sale por la derecha.
      const side = left && !this.caster && !this.buddy;
      const x = side ? 70 : W - 70;
      const img = fit(this.add.image(x, H + 80, tex.villain_laugh), 120).setDepth(DEPTH).setFlipX(!side);
      objs.push(img);
      this.villainSpot = { x, y: H - 90, t: this.time.now };
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
      this.villainSpot = { x: inX, y, t: this.time.now };   // de aquí sale su hechizo (juego/nucleo/hechizos.js)
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
        // a veces el villano se tropieza a mitad de camino y el amigo se escapa
        const trip = c.flee && Math.random() < 0.4;
        this.tweens.add({ targets: runner(first), x: to, duration: 4200, onComplete: trip ? end : undefined });
        this.time.delayedCall(700, () => {
          if (!this.scene.isActive()) return;
          const chaser = runner(second);
          this.tweens.add({ targets: chaser, x: trip ? W / 2 : to, duration: trip ? 2100 : 4200, onComplete: trip ? () => {
            this.tweens.killTweensOf(chaser);
            this.tweens.add({ targets: chaser, angle: 90 * (left ? 1 : -1), y: chaser.y + 10, duration: 200 });
            const plaf = this.add.text(chaser.x, chaser.y - 40, '¡PLAF!', { font: 'bold 22px Arial', color: '#fde047', stroke: '#7c2d12', strokeThickness: 5 })
              .setOrigin(0.5).setDepth(DEPTH);
            objs.push(plaf);
            this.tweens.add({ targets: [chaser, plaf], alpha: 0, duration: 500, delay: 900 });
          } : end });
        });
        if (trip) return c.name + '_gana_amigo';
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
      startMinigame(this, { mode: 'historia', theme: this.themeKey, chapter: this.chapter, phase: this.phase + 1,
        prevLog: this.prevLog.concat(this.log), minigame: bossPhases(this.themeKey)[this.phase + 1].mg });
      return;
    }
    const data = { log: this.prevLog.concat(this.log), theme: this.themeKey, level: this.level,
      minigame: this.mg, chapter: this.chapter, boss: this.boss };
    if (this.mode === 'desafio') this.scene.start('ChallengeResults', data);
    else if (this.mode === 'historia') this.scene.start('StoryResults', data);
    else this.scene.start('Results', data);
  }
}
