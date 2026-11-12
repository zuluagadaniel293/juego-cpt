// ¡Mundo desbloqueado! Sale al volver al mapa después de vencer al jefe que abre un mundo nuevo.
// El nombre del mundo no se sabe hasta este momento: el candado tiembla, se abre y se revela el mundo
// con su protagonista, sus amigos y el villano asomándose, entre confeti y una fanfarria.

class WorldUnlockedScene extends Phaser.Scene {
  constructor() { super('WorldUnlocked'); }
  init(data) { this.themeKey = data.theme; }
  create() {
    const W = GAME_W, H = GAME_H, key = this.themeKey, th = THEMES[key], tex = TEX[key], st = STORY[key];
    this.cameras.main.setBackgroundColor(0x020617);
    drawBackdrop(this, key, 0, 0);
    const shade = this.add.rectangle(0, 0, W, H, 0x020617, 0.85).setOrigin(0).setDepth(-18);

    // rayos de luz que giran detrás del mundo (aparecen al abrirse el candado)
    const rays = this.add.graphics().setPosition(W / 2, 265).setAlpha(0);
    for (let i = 0; i < 12; i++) {
      const a = i * Math.PI / 6;
      rays.fillStyle(i % 2 ? th.accent : 0xffffff, 0.22);
      rays.fillTriangle(0, 0, Math.cos(a - 0.12) * 560, Math.sin(a - 0.12) * 560, Math.cos(a + 0.12) * 560, Math.sin(a + 0.12) * 560);
    }
    this.tweens.add({ targets: rays, angle: 360, duration: 24000, repeat: -1 });

    // el objetivo del mundo, primero como sombra con un candado encima
    const shadowKey = silhouetteOf(this, tex.target) || tex.target;
    const shadow = fit(this.add.image(W / 2, 265, shadowKey), 180);
    const target = fit(this.add.image(W / 2, 265, tex.target), 180).setAlpha(0);
    const lock = fit(this.add.image(W / 2, 265, 'icon_lock'), 96);
    const hint = this.add.text(W / 2, 410, '¿Qué mundo será?', { font: 'bold 28px Arial', color: '#cbd5e1' }).setOrigin(0.5);

    // 1) el candado tiembla...
    this.tweens.add({ targets: lock, angle: { from: -12, to: 12 }, duration: 90, yoyo: true, repeat: 7, delay: 500 });
    [500, 800, 1100].forEach(t => this.time.delayedCall(t, () => tone(300 + t / 4, 0.08, 0.06, 'square')));
    // 2) ...se abre y se revela el mundo
    this.time.delayedCall(1500, () => {
      hint.destroy();
      sweep('triangle', 600, 1400, 0.25, 0.08);
      this.tweens.add({ targets: lock, y: lock.y - 140, angle: 40, alpha: 0, duration: 600, ease: 'Quad.easeOut' });
      const flash = this.add.rectangle(0, 0, W, H, 0xffffff, 0.9).setOrigin(0).setDepth(30);
      this.tweens.add({ targets: flash, alpha: 0, duration: 600, onComplete: () => flash.destroy() });
      this.tweens.add({ targets: shade, alpha: 0.45, duration: 800 });
      this.tweens.add({ targets: rays, alpha: 1, duration: 800 });
      this.tweens.add({ targets: shadow, alpha: 0, duration: 400 });
      target.setScale(target.scale * 0.3).setAlpha(1);
      this.tweens.add({ targets: target, scale: target.scale / 0.3, duration: 600, ease: 'Back.easeOut',
        onComplete: () => this.tweens.add({ targets: target, y: 255, duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' }) });
      this.fanfare();
      this.reveal(th, tex, st);
      this.confetti(th);
    });
  }

  // títulos, personajes alrededor y botones
  reveal(th, tex, st) {
    const W = GAME_W, H = GAME_H;
    const title = this.add.text(W / 2, 58, '¡Mundo desbloqueado!', { font: 'bold 46px Arial', color: '#ffffff', stroke: '#0f172a', strokeThickness: 8 })
      .setOrigin(0.5).setScale(0);
    this.tweens.add({ targets: title, scale: 1, duration: 500, ease: 'Back.easeOut' });
    const name = this.add.text(W / 2, 118, th.label, { font: 'bold 42px Arial', color: hexColor(th.accent), stroke: '#0f172a', strokeThickness: 8 })
      .setOrigin(0.5).setAlpha(0).setScale(1.6);
    this.tweens.add({ targets: name, alpha: 1, scale: 1, duration: 450, delay: 350, ease: 'Back.easeOut' });
    // quién necesita ayuda, en una franja oscura entre el protagonista y los amigos
    const who = this.add.text(W / 2, 385, st.hero.split(',')[0] + ' necesita tu ayuda para encontrar ' + th.targetObj.replace(/^a /, 'a ').replace(/^al /, 'al '),
      { font: 'bold 19px Arial', color: '#ffffff', align: 'center', wordWrap: { width: 380 } }).setOrigin(0.5).setAlpha(0).setDepth(2);
    const pill = this.add.graphics().setAlpha(0).setDepth(1);
    pill.fillStyle(0x0f172a, 0.75);
    pill.fillRoundedRect(W / 2 - who.width / 2 - 18, 385 - who.height / 2 - 10, who.width + 36, who.height + 20, 16);
    this.tweens.add({ targets: [who, pill], alpha: 1, duration: 500, delay: 900 });

    // los personajes entran saltando desde abajo, uno tras otro, y se quedan meciéndose
    const cast = [
      [tex.hero, 150, 295, 230, false], [tex.friend1, 62, 460, 110, false], [tex.friend2, 890, 455, 115, true],
      [tex.friend3, 785, 300, 170, true]
    ];
    cast.forEach(([k, x, y, size, flip], i) => {
      if (!k) return;
      const img = fit(this.add.image(x, H + 160, k), size).setFlipX(flip);
      this.tweens.add({ targets: img, y, duration: 600, delay: 300 + i * 180, ease: 'Back.easeOut',
        onComplete: () => this.tweens.add({ targets: img, y: y - 10, angle: { from: -3, to: 3 }, duration: 800 + i * 90, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' }) });
    });
    // y el villano se asoma por la esquina, riéndose
    const v = fit(this.add.image(W + 80, 130, tex.villain_laugh || tex.villain), 115).setFlipX(true).setAngle(-12);
    this.tweens.add({ targets: v, x: W - 45, duration: 500, delay: 1300, ease: 'Sine.easeOut',
      onComplete: () => this.tweens.add({ targets: v, angle: { from: -16, to: -6 }, duration: 160, yoyo: true, repeat: -1 }) });

    // botones
    this.time.delayedCall(1100, () => {
      makeButton(this, W / 2 - 110, 472, 300, 62, '¡Vamos a jugar!', th.accent, () => this.scene.start('ChapterMap', { theme: this.themeKey }));
      makeButton(this, W / 2 + 165, 472, 210, 54, 'Ver el mapa', 0xcbd5e1, () => this.scene.start('WorldMap'));
    });
  }

  // confeti con los colores del mundo, durante unos segundos
  confetti(th) {
    const colors = [th.accent, 0xffffff, 0xfde047, 0xf472b6, 0x60a5fa, 0x4ade80];
    const ev = this.time.addEvent({ delay: 45, repeat: 90, callback: () => {
      const x = Phaser.Math.Between(0, GAME_W);
      const c = this.add.rectangle(x, -10, Phaser.Math.Between(7, 12), Phaser.Math.Between(4, 7), Phaser.Utils.Array.GetRandom(colors)).setDepth(20);
      this.tweens.add({ targets: c, y: GAME_H + 20, x: x + Phaser.Math.Between(-90, 90), angle: Phaser.Math.Between(-540, 540),
        duration: Phaser.Math.Between(2200, 3400), onComplete: () => c.destroy() });
    } });
    this.events.once('shutdown', () => ev.remove());
  }

  // fanfarria corta (do, mi, sol, ¡do!)
  fanfare() {
    [[523, 0], [659, 120], [784, 240], [1047, 380]].forEach(([f, t]) =>
      this.time.delayedCall(t, () => tone(f, t === 380 ? 0.5 : 0.14, 0.09, 'triangle')));
    this.time.delayedCall(380, () => rescueSound());
  }
}
