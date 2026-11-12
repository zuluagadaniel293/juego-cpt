// Zona de adultos: elegir cuál prueba fija aplicar. Las tres usan siempre los mismos parámetros (pruebaParams),
// para comparar sesiones, y se parecen a los formatos de CPT que el niño puede encontrar en una evaluación.

const PRUEBAS = [
  { mg: 'classic', title: 'CPT clásico', like: 'Formato tipo TOVA / K-CPT',
    desc: 'Responde SOLO al objetivo,\nque aparece pocas veces.\nMide atención sostenida.' },
  { mg: 'notx', title: 'Menos uno', like: 'Formato tipo Conners CPT-3',
    desc: 'Responde a TODO menos al\nobjetivo (1 de cada 10).\nMide impulsividad.' },
  { mg: 'ax', title: 'Pista', like: 'Formato tipo AX-CPT',
    desc: 'Responde al objetivo solo si\njusto antes salió la pista.\nMide memoria de trabajo.' }
];

class PruebaSelectScene extends Phaser.Scene {
  constructor() { super('PruebaSelect'); }
  create() {
    const W = GAME_W;
    this.cameras.main.setBackgroundColor(0x0f172a);
    backLink(this, 'Volver', () => this.scene.start('Mode'));
    this.add.text(W / 2, 60, 'Zona de adultos: Prueba fija', { font: 'bold 38px Arial', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(W / 2, 108, 'Siempre con las mismas condiciones, para comparar sesiones. No es un diagnóstico.',
      { font: '18px Arial', color: '#94a3b8' }).setOrigin(0.5);
    PRUEBAS.forEach((pr, i) => {
      const x = W / 2 + (i - 1) * 300, y = 320;
      const card = drawCard(this, x, y, 270, 300, 0xffffff, 0.06, 0x38bdf8);
      this.add.text(x, y - 105, pr.title, { font: 'bold 28px Arial', color: '#ffffff' }).setOrigin(0.5);
      this.add.text(x, y - 68, pr.like, { font: 'bold 15px Arial', color: '#38bdf8' }).setOrigin(0.5);
      this.add.text(x, y + 10, pr.desc, { font: '17px Arial', color: '#cbd5e1', align: 'center', lineSpacing: 6 }).setOrigin(0.5);
      this.add.text(x, y + 112, 'Elegir ›', { font: 'bold 20px Arial', color: '#fde047' }).setOrigin(0.5);
      const zone = this.add.zone(x, y, 270, 300).setInteractive({ useHandCursor: true });
      zone.on('pointerover', () => card.setAlpha(0.8));
      zone.on('pointerout', () => card.setAlpha(1));
      zone.on('pointerdown', () => { getCtx(); this.scene.start('Menu', { mode: 'prueba', minigame: pr.mg }); });
    });
    // Modo demostración: abre todos los mundos (para mostrar el juego) sin tocar las estrellas del niño.
    // Al apagarlo, los mundos vuelven a abrirse de a uno según su progreso.
    const on = unlockAll();
    const demo = this.add.text(W / 2, GAME_H - 26,
      (on ? '☑' : '☐') + ' Modo demostración: todos los mundos abiertos', { font: 'bold 17px Arial', color: on ? '#fde047' : '#94a3b8' })
      .setOrigin(0.5).setInteractive({ useHandCursor: true });
    demo.on('pointerdown', () => { store.set('cpt_unlock_all', !on); this.scene.restart(); });
  }
}
