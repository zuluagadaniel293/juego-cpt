// Modo Examen: como en el examen real, el niño no ve cómo le fue (ni estrellas ni puntajes). La partida se guarda
// sola y el profesional ve las medidas y descarga el CSV en el Panel (Zona de resultados).
class ResultsScene extends Phaser.Scene {
  constructor() { super('Results'); }
  init(data) {
    this.log = data.log;
    this.themeKey = data.theme;
    this.mg = data.minigame || 'classic';
  }
  create() {
    const th = THEMES[this.themeKey];
    this.cameras.main.setBackgroundColor(th.bg);
    const s = computeStats(this.log);
    const stars = s.hitRate >= 0.9 ? 3 : s.hitRate >= 0.7 ? 2 : 1;   // solo queda en el Panel
    recordSession({ mode: 'prueba', theme: 'mixto', minigame: this.mg, stars, log: this.log });
    drawExamEnd(this, th);
    missionCheck(this);
  }
}

// Pantalla final del Modo Examen (también la de Memoria): como en el examen real, el niño no ve su resultado
function drawExamEnd(scene, th, again) {
  const W = GAME_W;
  scene.add.text(W / 2, 110, '¡Terminaste la prueba!', { font: 'bold 46px Arial', color: '#ffffff' }).setOrigin(0.5);
  scene.add.text(W / 2, 175, '✔', { font: 'bold 64px Arial', color: '#86efac' }).setOrigin(0.5);
  scene.add.text(W / 2, 265, 'Gracias por concentrarte.\nTus resultados los revisará tu profesional.',
    { font: '24px Arial', color: '#e2e8f0', align: 'center', lineSpacing: 10 }).setOrigin(0.5);
  makeButton(scene, W / 2 - 170, 420, 280, 60, 'Hacer otra prueba', th.accent, () => scene.scene.start('PruebaSelect'));
  makeButton(scene, W / 2 + 170, 420, 280, 60, 'Ir al inicio', 0xcbd5e1, () => scene.scene.start('Mode'));
}
