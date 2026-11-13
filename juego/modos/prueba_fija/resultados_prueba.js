// Prueba fija: métricas completas para el adulto.

// Prueba fija: métricas completas para el adulto
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
    const ms = v => (isNaN(v) ? '—' : Math.round(v) + ' ms');
    const stars = s.hitRate >= 0.9 ? 3 : s.hitRate >= 0.7 ? 2 : 1;
    recordSession({ mode: 'prueba', theme: this.themeKey, minigame: this.mg, stars, log: this.log });

    this.add.text(W / 2, 55, '¡Buen trabajo!', { font: 'bold 46px Arial', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(W / 2, 120, starsText(stars), { font: '52px Arial', color: '#fde047' }).setOrigin(0.5);

    // Medidas según la prueba (en Menos uno y Pista, "objetivo" = lo que sí había que responder)
    const pct = (a, b) => a + ' de ' + b + (b ? ' (' + Math.round(a / b * 100) + '%)' : '');
    const errs = cond => {   // Pista: errores por condición
      const rows = this.log.filter(r => r.event_type === 'stimulus' && r.condition === cond);
      return pct(rows.filter(r => r.responded).length, rows.length);
    };
    const common = ['Tiempo de reacción promedio: ' + ms(s.meanRT) + '   ·   variabilidad (DE): ' + ms(s.sdRT),
      'TR primera mitad vs. segunda mitad: ' + ms(s.rtFirst) + ' → ' + ms(s.rtSecond)];
    const lines = this.mg === 'notx' ? [
      'Prueba: Menos uno (formato tipo Conners)',
      'Respondió a las señales: ' + pct(s.hits, s.targets) + '   ·   omisiones: ' + s.omissions,
      'Respondió al objetivo, que NO debía (impulsividad): ' + pct(s.commissions, s.distractors)
    ].concat(common) : this.mg === 'ax' ? [
      'Prueba: Pista (formato tipo AX-CPT)',
      'Pista → objetivo, respondió: ' + pct(s.hits, s.targets) + '   ·   omisiones: ' + s.omissions,
      'Objetivo SIN pista, respondió (no recordó la pista): ' + errs('BX'),
      'Pista sin objetivo, respondió: ' + errs('AY') + '   ·   otros: ' + errs('BY')
    ].concat(common) : [
      'Objetivos detectados: ' + pct(s.hits, s.targets),
      'Omisiones (no detectó el objetivo): ' + s.omissions,
      'Respuestas a distractores (comisiones): ' + s.commissions + ' de ' + s.distractors
    ].concat(common);
    this.add.text(W / 2, 290, lines.join('\n'),
      { font: (this.mg === 'classic' ? 24 : 21) + 'px Arial', color: '#f1f5f9', align: 'center', lineSpacing: 12 }).setOrigin(0.5);

    makeButton(this, W / 2 - 170, 470, 300, 60, 'Descargar CSV', 0xfde047, () => downloadCSV(this.log, 'prueba_' + (this.mg === 'classic' ? '' : this.mg + '_') + this.themeKey));
    makeButton(this, W / 2 + 170, 470, 300, 60, 'Jugar de nuevo', 0x86efac, () => this.scene.start('Menu', { mode: 'prueba', minigame: this.mg }));
    missionCheck(this);
  }
}
