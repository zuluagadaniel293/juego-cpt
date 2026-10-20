// Memoria: secuencia más larga recordada (adelante y al revés), récord y CSV.

class MemoryResultsScene extends Phaser.Scene {
  constructor() { super('MemoryResults'); }
  init(data) {
    this.log = data.log;
    this.themeKey = data.theme;
    this.result = data.result;
  }
  create() {
    const W = GAME_W;
    const th = THEMES[this.themeKey];
    this.cameras.main.setBackgroundColor(th.bg);
    drawBackdrop(this, this.themeKey, 0, 0.8);

    const r = this.result;
    const mem = getMemory();
    const prev = mem[this.themeKey] || { fwd: 0, bwd: 0 };
    const newRecord = r.fwd > prev.fwd || r.bwd > prev.bwd;
    mem[this.themeKey] = { fwd: Math.max(prev.fwd, r.fwd), bwd: Math.max(prev.bwd, r.bwd) };
    store.set('cpt_memory', mem);

    // Referencia aproximada para 8-12 años: ~5 adelante y ~4 al revés
    const stars = r.fwd >= 5 && r.bwd >= 4 ? 3 : r.fwd >= 4 && r.bwd >= 3 ? 2 : r.fwd >= 3 ? 1 : 0;
    const right = this.log.filter(x => x.correct).length;

    this.add.text(W / 2, 60, stars >= 2 ? '¡Memoria de héroe!' : '¡Buen entrenamiento!', { font: 'bold 46px Arial', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(W / 2, 130, starsText(stars), { font: '56px Arial', color: '#fde047' }).setOrigin(0.5);
    this.add.text(W / 2, 225, 'Recordaste caminos de hasta ' + r.fwd + ' pasos\ny de ' + r.bwd + ' pasos al revés',
      { font: '26px Arial', color: '#f1f5f9', align: 'center', lineSpacing: 8 }).setOrigin(0.5);
    this.add.text(W / 2, 300, newRecord ? '¡Nuevo récord!' : 'Acertaste ' + right + ' de ' + this.log.length + ' caminos',
      { font: 'bold 24px Arial', color: newRecord ? '#86efac' : hexColor(th.accent) }).setOrigin(0.5);

    makeButton(this, W / 2, 400, 320, 64, 'Jugar otra vez', th.accent, () => this.scene.start('Memory', { theme: this.themeKey }));
    makeButton(this, W / 2 - 170, 490, 280, 50, 'Descargar CSV', 0xcbd5e1, () => downloadMemoryCSV(this.log, this.themeKey));
    makeButton(this, W / 2 + 170, 490, 280, 50, 'Otro mundo', 0xcbd5e1, () => this.scene.start('Menu', { mode: 'memoria' }));
    missionCheck(this);
  }
}
