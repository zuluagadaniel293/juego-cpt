// Elegir mundo (lo usan el Desafío y la Prueba fija).

// Elegir mundo (Prueba fija y Desafío)
class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }
  init(data) { this.mode = data.mode || 'prueba'; this.pruebaMg = data.minigame || 'classic'; }
  create() {
    const W = GAME_W;
    const isChallenge = this.mode === 'desafio', isMemory = this.mode === 'memoria';
    this.cameras.main.setBackgroundColor(0x0f172a);
    backLink(this, 'Volver', () => this.scene.start(this.mode === 'prueba' ? 'PruebaSelect' : 'Mode'));
    this.add.text(W / 2, 60, isChallenge ? 'Desafío: elige tu mundo' : isMemory ? 'Memoria: elige tu mundo' : 'Elige tu aventura',
      { font: 'bold 44px Arial', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(W / 2, 110, isChallenge
      ? 'Cada nivel es un poco más difícil. ¿Hasta dónde llegas?'
      : isMemory ? 'Recuerda el camino del objeto especial y repítelo'
      : this.pruebaMg === 'notx' ? 'Toca o presiona ESPACIO con cada señal, MENOS con el objeto especial'
      : this.pruebaMg === 'ax' ? 'Toca o presiona ESPACIO con el objeto especial solo si justo antes salió la pista'
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
        else if (isMemory) this.scene.start('Memory', { theme: key });
        else this.scene.start('Game', { mode: 'prueba', theme: key, minigame: this.pruebaMg });
      });
    });
  }
}
