// Prueba fija: métricas completas para el adulto.

// Prueba fija: métricas completas para el adulto
class ResultsScene extends Phaser.Scene {
  constructor() { super('Results'); }
  init(data) {
    this.log = data.log;
    this.themeKey = data.theme;
  }
  create() {
    const W = this.scale.width;
    const th = THEMES[this.themeKey];
    this.cameras.main.setBackgroundColor(th.bg);
    const s = computeStats(this.log);
    const ms = v => (isNaN(v) ? '—' : Math.round(v) + ' ms');
    const stars = s.hitRate >= 0.9 ? 3 : s.hitRate >= 0.7 ? 2 : 1;

    this.add.text(W / 2, 55, '¡Buen trabajo!', { font: 'bold 46px Arial', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(W / 2, 120, starsText(stars), { font: '52px Arial', color: '#fde047' }).setOrigin(0.5);

    const lines = [
      'Objetivos detectados: ' + s.hits + ' de ' + s.targets + ' (' + Math.round(s.hitRate * 100) + '%)',
      'Omisiones (no detectó el objetivo): ' + s.omissions,
      'Respuestas a distractores (comisiones): ' + s.commissions + ' de ' + s.distractors,
      'Tiempo de reacción promedio: ' + ms(s.meanRT),
      'Variabilidad del TR (desv. estándar): ' + ms(s.sdRT),
      'TR primera mitad vs. segunda mitad: ' + ms(s.rtFirst) + ' → ' + ms(s.rtSecond)
    ];
    this.add.text(W / 2, 290, lines.join('\n'),
      { font: '24px Arial', color: '#f1f5f9', align: 'center', lineSpacing: 12 }).setOrigin(0.5);

    makeButton(this, W / 2 - 170, 470, 300, 60, 'Descargar CSV', 0xfde047, () => downloadCSV(this.log, 'prueba_' + this.themeKey));
    makeButton(this, W / 2 + 170, 470, 300, 60, 'Jugar de nuevo', 0x86efac, () => this.scene.start('Menu', { mode: 'prueba' }));
  }
}
