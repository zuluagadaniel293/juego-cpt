// Memoria del Modo Examen: guarda la secuencia más larga (adelante y al revés) para el Panel; el niño no ve el resultado.

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

    const r = this.result;
    const mem = getMemory();
    const prev = mem[this.themeKey] || { fwd: 0, bwd: 0 };
    mem[this.themeKey] = { fwd: Math.max(prev.fwd, r.fwd), bwd: Math.max(prev.bwd, r.bwd) };
    store.set('cpt_memory', mem);

    // Referencia aproximada para 8-12 años: ~5 adelante y ~4 al revés
    const stars = r.fwd >= 5 && r.bwd >= 4 ? 3 : r.fwd >= 4 && r.bwd >= 3 ? 2 : r.fwd >= 3 ? 1 : 0;
    recordSession({ mode: 'memoria', theme: 'mixto', minigame: 'memory', stars, memory: { fwd: r.fwd, bwd: r.bwd }, log: this.log });

    drawExamEnd(this, th);   // como en el examen real: sin resultado para el niño (está en el Panel)
    missionCheck(this);
  }
}
