// Elegir mundo (lo usan el Desafío y la Prueba fija).

// Elegir mundo (Prueba fija y Desafío)
class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }
  init(data) { this.mode = data.mode || 'prueba'; }
  create() {
    const W = this.scale.width;
    const isChallenge = this.mode === 'desafio';
    this.cameras.main.setBackgroundColor(0x0f172a);
    backLink(this, 'Volver', () => this.scene.start('Mode'));
    this.add.text(W / 2, 60, isChallenge ? 'Desafío: elige tu mundo' : 'Elige tu aventura',
      { font: 'bold 44px Arial', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(W / 2, 110, isChallenge
      ? 'Cada nivel es un poco más difícil. ¿Hasta dónde llegas?'
      : 'Toca la pantalla o presiona ESPACIO solo cuando aparezca el objeto especial',
      { font: '20px Arial', color: '#cbd5e1' }).setOrigin(0.5);

    Object.keys(THEMES).forEach((key, i) => {
      const th = THEMES[key];
      const x = 170 + i * 310;
      const y = 330;
      const card = this.add.rectangle(x, y, 270, 330, th.bg).setStrokeStyle(4, th.accent).setInteractive({ useHandCursor: true });
      fit(this.add.image(x, y - 70, TEX[key].target), 128);
      this.add.text(x, y + 30, th.label, { font: 'bold 24px Arial', color: '#ffffff' }).setOrigin(0.5);
      this.add.text(x, y + 75, 'Objeto especial:\n' + th.targetLabel,
        { font: '17px Arial', color: '#e2e8f0', align: 'center' }).setOrigin(0.5);
      card.on('pointerover', () => card.setScale(1.04));
      card.on('pointerout', () => card.setScale(1));
      card.on('pointerdown', () => {
        getCtx(); // activa el audio con el primer clic
        if (isChallenge) this.scene.start('MinigameSelect', { theme: key });
        else this.scene.start('Game', { mode: 'prueba', theme: key });
      });
    });
  }
}
