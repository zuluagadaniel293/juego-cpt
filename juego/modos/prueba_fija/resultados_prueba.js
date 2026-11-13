// Modo Examen: el niño ve sus estrellas y cuántos encontró (como en los otros modos); las medidas completas
// (tiempos de reacción, variabilidad, errores por condición) quedan en el Panel del profesional.
class ResultsScene extends Phaser.Scene {
  constructor() { super('Results'); }
  init(data) {
    this.log = data.log;
    this.themeKey = data.theme;
    this.mg = data.minigame || 'classic';
  }
  create() {
    const W = GAME_W;
    const th = THEMES[this.themeKey];
    this.cameras.main.setBackgroundColor(th.bg);
    const s = computeStats(this.log);
    const stars = s.hitRate >= 0.9 ? 3 : s.hitRate >= 0.7 ? 2 : 1;
    recordSession({ mode: 'prueba', theme: 'mixto', minigame: this.mg, stars, log: this.log });

    drawKidSummary(this, s, stars, this.mg === 'notx' ? 'Tocaste a tiempo' : 'Encontraste',
      stars === 3 ? '¡Excelente!' : stars === 2 ? '¡Muy bien!' : '¡Buen trabajo!');
    this.add.text(W / 2, 300, 'Prueba: ' + ({ classic: 'Clásico', notx: 'Menos uno', ax: 'Pista' }[this.mg] || this.mg),
      { font: 'bold 24px Arial', color: hexColor(th.accent) }).setOrigin(0.5);

    makeButton(this, W / 2, 400, 320, 64, 'Jugar de nuevo', th.accent,
      () => this.scene.start('Game', { mode: 'prueba', theme: PRUEBA_BASE, minigame: this.mg }));
    makeButton(this, W / 2 - 170, 490, 280, 50, 'Descargar CSV', 0xcbd5e1,
      () => downloadCSV(this.log, 'prueba_' + ({ classic: 'clasico', notx: 'menos_uno', ax: 'pista' }[this.mg] || this.mg)));
    makeButton(this, W / 2 + 170, 490, 280, 50, 'Otra prueba', 0xcbd5e1, () => this.scene.start('PruebaSelect'));
    missionCheck(this);
  }
}
