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

    // las tarjetas se reparten a lo ancho según cuántos mundos haya; con más de 5, en dos filas más bajitas
    const keys = Object.keys(THEMES), gap = 14, rows = keys.length > 5 ? 2 : 1;
    const perRow = Math.ceil(keys.length / rows), ch = rows > 1 ? 172 : 330;
    const cw = Math.min(270, (W - 40 - gap * (perRow - 1)) / perRow), small = cw < 220;
    keys.forEach((key, i) => {
      const th = THEMES[key];
      const row = Math.floor(i / perRow), inRow = row ? keys.length - perRow : perRow, col = i - row * perRow;
      const x = W / 2 + (col - (inRow - 1) / 2) * (cw + gap);
      const y = rows > 1 ? 240 + row * (ch + 12) : 330;
      const card = this.add.rectangle(x, y, cw, ch, th.bg).setStrokeStyle(4, th.accent).setInteractive({ useHandCursor: true });
      const name = rows > 1
        ? (fit(this.add.image(x, y - 34, TEX[key].target), 86),
           this.add.text(x, y + 28, th.label, { font: 'bold 20px Arial', color: '#ffffff' }).setOrigin(0.5))
        : (fit(this.add.image(x, y - 70, TEX[key].target), small ? 110 : 128),
           this.add.text(x, y + 30, th.label, { font: 'bold ' + (small ? 21 : 24) + 'px Arial', color: '#ffffff' }).setOrigin(0.5));
      if (name.width > cw - 14) name.setScale((cw - 14) / name.width);   // nombres largos: se encogen para caber
      this.add.text(x, rows > 1 ? y + 58 : y + 85, rows > 1 ? th.targetLabel : 'Objeto especial:\n' + th.targetLabel,
        { font: (rows > 1 ? 14 : small ? 15 : 17) + 'px Arial', color: '#e2e8f0', align: 'center', wordWrap: { width: cw - 20 } }).setOrigin(0.5);
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
