// Modo Examen: elegir cuál prueba fija hacer. Todas usan siempre los mismos parámetros (pruebaParams) y los mismos
// estímulos (Bip entre personajes de todos los mundos), para comparar sesiones, y se parecen a los formatos de CPT
// que el niño puede encontrar en una evaluación. Lo ve el niño: textos sencillos; las medidas van al Panel.

const PRUEBAS = [
  { mg: 'classic', title: 'Clásico', like: 'como el TOVA / K-CPT',
    desc: 'Toca SOLO cuando\naparezca Bip.\n¡Sale pocas veces!' },
  { mg: 'notx', title: 'Menos uno', like: 'como el Conners CPT-3',
    desc: 'Toca TODO,\nmenos a Bip.\n¡Frena a tiempo!' },
  { mg: 'ax', title: 'Pista', like: 'como el AX-CPT',
    desc: 'Toca a Bip solo si\njusto antes salió\nChispita.' },
  // Memoria adaptativa (tipo Corsi): la secuencia crece hasta fallar 2 veces; mide el span adelante y al revés
  { mg: 'memory', title: 'Memoria', like: 'como el Corsi',
    desc: 'Repite el camino\nde Bip en orden\ny luego al revés.' }
];

class PruebaSelectScene extends Phaser.Scene {
  constructor() { super('PruebaSelect'); }
  create() {
    const W = GAME_W;
    this.cameras.main.setBackgroundColor(0x0f172a);
    backLink(this, 'Volver', () => this.scene.start('Mode'));
    this.add.text(W / 2, 60, 'Modo Examen', { font: 'bold 38px Arial', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(W / 2, 108, 'Así se ve la prueba de verdad: sin mundos ni sorpresas. ¡Concéntrate!',
      { font: '18px Arial', color: '#94a3b8' }).setOrigin(0.5);
    PRUEBAS.forEach((pr, i) => {
      const x = W / 2 + (i - (PRUEBAS.length - 1) / 2) * 226, y = 320;
      const card = drawCard(this, x, y, 212, 300, 0xffffff, 0.06, 0x38bdf8);
      this.add.text(x, y - 105, pr.title, { font: 'bold 26px Arial', color: '#ffffff' }).setOrigin(0.5);
      this.add.text(x, y - 68, pr.like, { font: 'bold 15px Arial', color: '#38bdf8' }).setOrigin(0.5);
      this.add.text(x, y + 10, pr.desc, { font: '15px Arial', color: '#cbd5e1', align: 'center', lineSpacing: 6 }).setOrigin(0.5);
      if (pr.mg === 'memory') {   // récord del span, como antes en la pantalla inicial
        const mem = Math.max(0, ...Object.values(getMemory()).map(m => m.fwd));
        if (mem) this.add.text(x, y + 84, 'Récord: ' + mem + ' pasos', { font: 'bold 14px Arial', color: '#a78bfa' }).setOrigin(0.5);
      }
      this.add.text(x, y + 112, 'Elegir ›', { font: 'bold 20px Arial', color: '#fde047' }).setOrigin(0.5);
      const zone = this.add.zone(x, y, 212, 300).setInteractive({ useHandCursor: true });
      zone.on('pointerover', () => card.setAlpha(0.8));
      zone.on('pointerout', () => card.setAlpha(1));
      zone.on('pointerdown', () => { getCtx(); // una sola prueba para todos los mundos: empieza directo, sin elegir mundo
        if (pr.mg === 'memory') this.scene.start('Memory', { theme: PRUEBA_BASE });
        else this.scene.start('Game', { mode: 'prueba', theme: PRUEBA_BASE, minigame: pr.mg }); });
    });
  }
}
