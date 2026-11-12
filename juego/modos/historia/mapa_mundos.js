// Historia: mapa con todos los mundos.

// Mundos del mapa (todos se pueden jugar). Si se agrega uno que aún no existe, sale como "Pronto" con su silueta.
const MAP_WORLDS = ['heroes', 'fantasy', 'kingdom', 'space', 'ocean', 'dinos', 'robots', 'jungle', 'candy'];
// Silueta de cada mundo que viene (emoji pintado de sombra), para dar curiosidad sin decir el nombre
const COMING_WORLDS = {};

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
        const objs = mysteryNode(this, x, y, 52, silhouetteEmoji(this, COMING_WORLDS[w]));
        this.add.text(x, y + 72, '¿ ? ? ?', { font: 'bold 18px Arial', color: '#ffffff' }).setOrigin(0.5).setAlpha(0.7);
        this.add.text(x, y + 96, 'Pronto', { font: 'bold 15px Arial', color: '#94a3b8' }).setOrigin(0.5);
        objs[0].setInteractive({ useHandCursor: true })
          .on('pointerdown', () => teaseLocked(this, objs, '¿Qué mundo será? ¡Muy pronto lo descubrirás!'));
      }
    });
  }
}
