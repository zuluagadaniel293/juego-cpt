// Desafío: elegir minijuego (cada uno con su récord).

// Desafío: elegir minijuego (cada uno con su propio récord)
class MinigameSelectScene extends Phaser.Scene {
  constructor() { super('MinigameSelect'); }
  init(data) { this.themeKey = data.theme; }
  create() {
    const W = GAME_W;
    const th = THEMES[this.themeKey];
    const records = getRecords();
    const levels = getChallengeLevels();
    this.cameras.main.setBackgroundColor(th.bg);
    drawBackdrop(this, this.themeKey, 0, 0.7);
    backLink(this, 'Mundos', () => this.scene.start('Menu', { mode: 'desafio' }));
    this.add.text(W / 2, 60, 'Elige tu juego', { font: 'bold 42px Arial', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(W / 2, 104, th.label, { font: 'bold 20px Arial', color: hexColor(th.accent) }).setOrigin(0.5);

    const tex = TEX[this.themeKey];
    const icons = { classic: tex.target, catch: 'basket', race: tex.hero_run, find: 'icon_find', memory: 'icon_memory' };
    // 7 juegos en 2 filas: los 4 de atención (CPT) arriba; Memoria y los formatos de examen (Menos uno, Pista) abajo
    const rows = [['classic', 'catch', 'race', 'find'], ['memory', 'notx', 'ax']];
    rows.forEach((row, r) => row.forEach((mg, i) => {
      const x = W / 2 + (i - (row.length - 1) / 2) * 230, y = r === 0 ? 242 : 442;
      const card = drawCard(this, x, y, 210, 178, 0xffffff, 0.07, th.accent);
      const iy = y - 46;
      if (mg === 'notx') {          // la señal del villano tachada: "a esta no"
        fit(this.add.image(x, iy, tex.target), 62);
        this.add.circle(x, iy, 33).setStrokeStyle(5, 0xef4444);
        this.add.rectangle(x, iy, 66, 5, 0xef4444).setAngle(-45);
      } else if (mg === 'ax') {     // la pista y luego el objetivo
        fit(this.add.image(x - 42, iy, tex.dist1), 50);
        this.add.text(x, iy, '→', { font: 'bold 28px Arial', color: '#ffffff' }).setOrigin(0.5);
        fit(this.add.image(x + 42, iy, tex.target), 50);
      } else {
        fit(this.add.image(x, iy, icons[mg]), 66);
      }
      this.add.text(x, y + 8, MG[mg].label, { font: 'bold 21px Arial', color: '#ffffff' }).setOrigin(0.5);
      this.add.text(x, y + 40, MG[mg].desc, { font: '14px Arial', color: '#cbd5e1', align: 'center' }).setOrigin(0.5);
      const rec = records[this.themeKey + '_' + mg] || 0;
      const current = levels[this.themeKey + '_' + mg] || 1;   // nivel en que quedó la última vez
      this.add.text(x, y + 71, 'Nivel ' + current + (rec ? '  ·  récord ' + rec : ''),
        { font: 'bold 14px Arial', color: hexColor(th.accent) }).setOrigin(0.5);
      const zone = this.add.zone(x, y, 210, 178).setInteractive({ useHandCursor: true });
      zone.on('pointerover', () => card.setAlpha(0.75));
      zone.on('pointerout', () => card.setAlpha(1));
      zone.on('pointerdown', () => {
        this.registry.set('runLog', []);
        startMinigame(this, { mode: 'desafio', theme: this.themeKey, level: current, minigame: mg });
      });
    }));
  }
}
