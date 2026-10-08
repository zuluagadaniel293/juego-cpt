// Pantalla inicial: Historia, Desafío o Zona de adultos.

class ModeScene extends Phaser.Scene {
  constructor() { super('Mode'); }
  create() {
    const W = GAME_W, H = GAME_H;
    this.cameras.main.setBackgroundColor(0x0f172a);
    // Nombre del juego
    const logo = this.add.text(W / 2, 52, 'MISIÓN FOCO', { font: 'bold 54px Arial', color: '#fde047', stroke: '#7c3aed', strokeThickness: 10 })
      .setOrigin(0.5).setShadow(0, 6, '#000000', 0, true, true);
    this.tweens.add({ targets: logo, scale: 1.04, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.add.text(W / 2, 104, '¡Concéntrate y salva tu mundo!  ·  ¿Cómo quieres jugar?', { font: 'bold 20px Arial', color: '#cbd5e1' }).setOrigin(0.5);

    const modeCard = (x, stroke, icon, title, desc, extra, onClick) => {
      const card = drawCard(this, x, 290, 360, 300, 0xffffff, 0.06, stroke);
      fit(this.add.image(x, 220, icon), 120);
      this.add.text(x, 315, title, { font: 'bold 32px Arial', color: '#ffffff' }).setOrigin(0.5);
      this.add.text(x, 365, desc, { font: '18px Arial', color: '#cbd5e1', align: 'center' }).setOrigin(0.5);
      if (extra) this.add.text(x, 418, extra, { font: 'bold 17px Arial', color: hexColor(stroke) }).setOrigin(0.5);
      const zone = this.add.zone(x, 290, 360, 300).setInteractive({ useHandCursor: true });
      zone.on('pointerover', () => card.setAlpha(0.8));
      zone.on('pointerout', () => card.setAlpha(1));
      zone.on('pointerdown', () => { getCtx(); onClick(); });
    };
    const stars = totalStars();
    modeCard(290, 0x38bdf8, 'icon_map', 'Historia', 'Viaja por los mundos\ny sigue la aventura',
      stars ? 'Tienes ' + stars + ' estrellas' : '', () => this.scene.start('WorldMap'));
    const best = Math.max(0, ...Object.values(getRecords()));
    modeCard(670, 0xfb923c, 'icon_trophy', 'Desafío', 'Cada vez más difícil.\n¿Hasta qué nivel llegas?',
      best ? 'Tu récord: nivel ' + best : '', () => this.scene.start('Menu', { mode: 'desafio' }));

    // Zona de adultos: prueba fija para comparar sesiones
    // (abajo a la izquierda: la esquina derecha la tapa el botón "Powered by Netlify" en la versión publicada)
    this.add.text(30, H - 24, 'Zona de adultos: Prueba fija', { font: 'bold 15px Arial', color: '#94a3b8' })
      .setOrigin(0, 1).setInteractive({ useHandCursor: true })
      .on('pointerdown', () => { getCtx(); this.scene.start('Menu', { mode: 'prueba' }); });
  }
}
