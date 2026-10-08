// Historia: mapa con todos los mundos.

// Mundos del mapa: los 3 primeros ya se pueden jugar; el resto llega pronto.
const MAP_WORLDS = ['heroes', 'fantasy', 'kingdom', 'Espacio', 'Océano', 'Dinosaurios', 'Robots', 'Selva', 'Dulces'];

class WorldMapScene extends Phaser.Scene {
  constructor() { super('WorldMap'); }
  create() {
    const W = GAME_W;
    this.cameras.main.setBackgroundColor(0x0f172a);
    backLink(this, 'Volver', () => this.scene.start('Mode'));
    this.add.text(W / 2, 40, 'Mapa de aventuras', { font: 'bold 34px Arial', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(W - 30, 40, '★ ' + totalStars(), { font: 'bold 24px Arial', color: '#fde047' }).setOrigin(1, 0.5);

    const pos = [[110, 170], [290, 170], [470, 170], [650, 170], [830, 170], [830, 390], [650, 390], [470, 390], [290, 390]];
    const path = this.add.graphics();
    path.lineStyle(6, 0xffffff, 0.15);
    for (let i = 0; i < pos.length - 1; i++) path.lineBetween(pos[i][0], pos[i][1], pos[i + 1][0], pos[i + 1][1]);

    const story = getStory();
    MAP_WORLDS.forEach((w, i) => {
      const [x, y] = pos[i];
      const th = THEMES[w];
      if (th) {
        const done = (story[w] || []).filter(s => s > 0).length;
        const c = this.add.circle(x, y, 52, th.bg).setStrokeStyle(5, th.accent).setInteractive({ useHandCursor: true });
        fit(this.add.image(x, y, TEX[w].target), 70);
        this.add.text(x, y + 72, th.label.split(' ')[0], { font: 'bold 18px Arial', color: '#ffffff' }).setOrigin(0.5);
        this.add.text(x, y + 96, done + ' de 5', { font: 'bold 15px Arial', color: hexColor(th.accent) }).setOrigin(0.5);
        c.on('pointerover', () => c.setScale(1.06));
        c.on('pointerout', () => c.setScale(1));
        c.on('pointerdown', () => this.scene.start('ChapterMap', { theme: w }));
      } else {
        this.add.circle(x, y, 52, 0x1e293b).setStrokeStyle(5, 0x475569);
        fit(this.add.image(x, y, 'icon_lock'), 46);
        this.add.text(x, y + 72, w, { font: 'bold 18px Arial', color: '#ffffff' }).setOrigin(0.5).setAlpha(0.55);
        this.add.text(x, y + 96, 'Pronto', { font: 'bold 15px Arial', color: '#94a3b8' }).setOrigin(0.5);
      }
    });
  }
}
