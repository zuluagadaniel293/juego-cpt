// Pausa: se abre con el botón "Salir" (o ESC) durante cualquier juego. El juego queda congelado mientras tanto.
// "Seguir jugando" lo reanuda (sin contar el tiempo en pausa); "Salir" vuelve al menú sin guardar el nivel.

// Botón "✕ Salir" arriba a la derecha y tecla ESC. La escena debe tener resumeFromPause(ms) y exitGame().
function addExitButton(scene) {
  const x = GAME_W - 62, y = 20;
  const bg = scene.add.graphics().setDepth(40);
  bg.fillStyle(0x0f172a, 0.75); bg.fillRoundedRect(x - 48, y - 14, 96, 28, 14);
  scene.add.text(x, y, '✕ Salir', { font: 'bold 16px Arial', color: '#ffffff' }).setOrigin(0.5).setDepth(41);
  scene.add.zone(x, y, 104, 36).setDepth(41).setInteractive({ useHandCursor: true }).on('pointerdown', () => openPause(scene));
  scene.input.keyboard.on('keydown-ESC', () => openPause(scene));
}
function openPause(scene) {
  if (scene.ended || !scene.scene.isActive()) return;
  scene.scene.launch('Pause', { from: scene.scene.key, start: performance.now() });
  scene.scene.pause();
}

class PauseScene extends Phaser.Scene {
  constructor() { super('Pause'); }
  init(data) { this.from = data.from; this.start = data.start; }
  create() {
    const W = GAME_W, H = GAME_H;
    const game = this.scene.get(this.from);
    this.add.rectangle(0, 0, W, H, 0x0f172a, 0.82).setOrigin(0).setInteractive();   // tapa el juego
    this.add.text(W / 2, 160, 'Juego en pausa', { font: 'bold 44px Arial', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(W / 2, 230, '¿Quieres salir? Lo que llevas de este nivel no se guardará.',
      { font: '22px Arial', color: '#cbd5e1' }).setOrigin(0.5);
    let done = false;
    const resume = () => {
      if (done) return; done = true;
      game.resumeFromPause(performance.now() - this.start);   // corre los tiempos para no medir la pausa
      this.scene.resume(this.from);
      this.scene.stop();
    };
    const exit = () => {
      if (done) return; done = true;
      this.scene.stop();
      game.exitGame();
    };
    makeButton(this, W / 2 - 170, 340, 300, 64, 'Seguir jugando', 0x86efac, resume);
    makeButton(this, W / 2 + 170, 340, 300, 64, 'Salir', 0xfca5a5, exit);
    this.add.text(W / 2, 420, 'ESC o ESPACIO: seguir jugando', { font: '16px Arial', color: '#94a3b8' }).setOrigin(0.5);
    this.input.keyboard.once('keydown-ESC', resume);
    this.input.keyboard.once('keydown-SPACE', resume);
  }
}

// A dónde vuelve cada modo al salir de un juego
function exitTarget(scene) {
  if (scene.mode === 'historia') return ['ChapterMap', { theme: scene.themeKey }];
  if (scene.mode === 'desafio') return ['MinigameSelect', { theme: scene.themeKey }];
  if (scene.mode === 'prueba') return ['PruebaSelect', {}];
  return ['PruebaSelect', {}];
}
