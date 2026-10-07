// Desafío: elegir minijuego (cada uno con su récord).

// Desafío: elegir minijuego (cada uno con su propio récord)
class MinigameSelectScene extends Phaser.Scene {
  constructor() { super('MinigameSelect'); }
  init(data) { this.themeKey = data.theme; }
  create() {
    const W = this.scale.width;
    const th = THEMES[this.themeKey];
    const records = getRecords();
    this.cameras.main.setBackgroundColor(th.bg);
    drawBackdrop(this, this.themeKey, 0, 0.7);
    backLink(this, 'Mundos', () => this.scene.start('Menu', { mode: 'desafio' }));
    this.add.text(W / 2, 65, 'Elige tu juego', { font: 'bold 42px Arial', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(W / 2, 112, th.label, { font: 'bold 20px Arial', color: hexColor(th.accent) }).setOrigin(0.5);

    const icons = { classic: TEX[this.themeKey].target, catch: 'basket', race: TEX[this.themeKey].hero_run, find: 'icon_find' };
    Object.keys(MG).forEach((mg, i) => {
      const x = 135 + i * 230, y = 330;
      const card = drawCard(this, x, y, 200, 300, 0xffffff, 0.07, th.accent);
      fit(this.add.image(x, y - 70, icons[mg]), 115);
      this.add.text(x, y + 30, MG[mg].label, { font: 'bold 26px Arial', color: '#ffffff' }).setOrigin(0.5);
      this.add.text(x, y + 75, MG[mg].desc, { font: '16px Arial', color: '#cbd5e1', align: 'center' }).setOrigin(0.5);
      const rec = records[this.themeKey + '_' + mg] || 0;
      this.add.text(x, y + 122, rec ? 'Récord: nivel ' + rec : 'Sin récord', { font: 'bold 16px Arial', color: hexColor(th.accent) }).setOrigin(0.5);
      const zone = this.add.zone(x, y, 200, 300).setInteractive({ useHandCursor: true });
      zone.on('pointerover', () => card.setAlpha(0.75));
      zone.on('pointerout', () => card.setAlpha(1));
      zone.on('pointerdown', () => {
        this.registry.set('runLog', []);
        const start = Math.max(1, rec - 2); // retoma cerca de su récord
        this.scene.start('Game', { mode: 'desafio', theme: this.themeKey, level: start, minigame: mg });
      });
    });
  }
}
