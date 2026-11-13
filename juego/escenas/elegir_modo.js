// Pantalla inicial: Historia, Desafío o Modo Examen (la prueba fija, igual a como será el examen real).
// Abajo a la derecha, manteniendo presionado: la Zona de resultados (Panel del profesional), solo para adultos.

class ModeScene extends Phaser.Scene {
  constructor() { super('Mode'); }
  create() {
    const W = GAME_W, H = GAME_H;
    // sin jugador elegido (por ejemplo, si lo borraron en el Panel) no se juega: el progreso es de cada niño
    if (!currentPlayer()) { this.scene.start('Players'); return; }
    this.cameras.main.setBackgroundColor(0x0f172a);
    // Nombre del juego
    const logo = this.add.text(W / 2, 52, 'FOCUS QUEST', { font: 'bold 54px Arial', color: '#fde047', stroke: '#7c3aed', strokeThickness: 10 })
      .setOrigin(0.5).setShadow(0, 6, '#000000', 0, true, true);
    this.tweens.add({ targets: logo, scale: 1.04, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.add.text(W / 2, 104, '¡Concéntrate y salva tu mundo!  ·  ¿Cómo quieres jugar?', { font: 'bold 20px Arial', color: '#cbd5e1' }).setOrigin(0.5);

    const modeCard = (x, stroke, icon, title, desc, extra, onClick) => {
      const card = drawCard(this, x, 280, 280, 280, 0xffffff, 0.06, stroke);
      if (this.textures.exists(icon)) fit(this.add.image(x, 210, icon), 110);
      else this.add.text(x, 210, icon, { font: '84px Arial' }).setOrigin(0.5);   // emoji
      this.add.text(x, 300, title, { font: 'bold 30px Arial', color: '#ffffff' }).setOrigin(0.5);
      this.add.text(x, 348, desc, { font: '17px Arial', color: '#cbd5e1', align: 'center' }).setOrigin(0.5);
      if (extra) this.add.text(x, 396, extra, { font: 'bold 16px Arial', color: hexColor(stroke) }).setOrigin(0.5);
      const zone = this.add.zone(x, 280, 280, 280).setInteractive({ useHandCursor: true });
      zone.on('pointerover', () => card.setAlpha(0.8));
      zone.on('pointerout', () => card.setAlpha(1));
      zone.on('pointerdown', () => { getCtx(); onClick(); });
    };
    const stars = totalStars();
    modeCard(170, 0x38bdf8, 'icon_map', 'Historia', 'Viaja por los mundos\ny sigue la aventura',
      stars ? 'Tienes ' + stars + ' estrellas' : '', () => this.scene.start('WorldMap'));
    const best = Math.max(0, ...Object.values(getRecords()));
    modeCard(480, 0xfb923c, 'icon_trophy', 'Desafío', 'Cada vez más difícil.\n¿Hasta qué nivel llegas?',
      best ? 'Tu récord: nivel ' + best : '', () => this.scene.start('Menu', { mode: 'desafio' }));
    const exams = playerSessions(currentPlayerId()).filter(s => s.mode === 'prueba' || s.mode === 'memoria').length;
    modeCard(790, 0xa78bfa, 'icon_exam', 'Modo Examen', 'Practica como en la\nprueba de verdad',
      exams ? 'Lo has hecho ' + exams + (exams === 1 ? ' vez' : ' veces') : '', () => this.scene.start('PruebaSelect'));
    this.memoryIcon();   // deja lista la imagen del ícono de Memoria (la usan el Desafío y la Prueba fija)

    drawDailyMission(this, 300, 466);
    drawPerfectMission(this, 640, 466);

    // quién está jugando (arriba a la izquierda), con un botón para cambiar de jugador
    const p = currentPlayer();
    if (p) {
      this.add.text(24, 20, '👤 ' + p.name, { font: 'bold 20px Arial', color: '#ffffff' });
      this.add.text(24, 48, 'Cambiar de jugador', { font: 'bold 15px Arial', color: '#38bdf8' })
        .setInteractive({ useHandCursor: true }).on('pointerdown', () => this.scene.start('Players'));
    }
    this.resultsZone();
  }
  // Zona de resultados (Panel del profesional): abajo a la derecha. Se entra manteniendo presionado 2 segundos,
  // para que un niño no entre por error.
  resultsZone() {
    const W = GAME_W, H = GAME_H;
    const label = this.add.text(W - 16, H - 8, '🔒 Zona de resultados (mantén presionado)', { font: 'bold 14px Arial', color: '#94a3b8' })
      .setOrigin(1, 1).setInteractive({ useHandCursor: true });
    const bar = this.add.rectangle(W - 16 - label.width, H - 4, 0, 4, 0xfde047).setOrigin(0, 0.5);
    let tw = null;
    const cancel = () => { if (tw) { tw.stop(); tw = null; } bar.width = 0; };
    label.on('pointerdown', () => {
      getCtx();
      cancel();
      tw = this.tweens.add({ targets: bar, width: label.width, duration: 2000,
        onComplete: () => { tw = null; bar.width = 0; openPanel(this); } });
    });
    label.on('pointerup', cancel);
    label.on('pointerout', cancel);
  }
  // Ícono de Memoria: tablero de casillas con un camino encendido (si no hay imagen icon_memory en comunes)
  memoryIcon() {
    if (this.textures.exists('icon_memory')) return 'icon_memory';
    const g = this.make.graphics({ add: false }), lit = [0, 4, 5, 7];
    for (let i = 0; i < 9; i++) {
      const x = 8 + (i % 3) * 40, y = 8 + Math.floor(i / 3) * 40;
      g.fillStyle(lit.includes(i) ? 0xa78bfa : 0xffffff, lit.includes(i) ? 1 : 0.25);
      g.fillRoundedRect(x, y, 32, 32, 8);
    }
    g.lineStyle(5, 0xfde047, 1);
    g.lineBetween(24, 24, 64, 64); g.lineBetween(64, 64, 104, 64); g.lineBetween(104, 64, 64, 104);
    g.generateTexture('icon_memory', 128, 128);
    g.destroy();
    return 'icon_memory';
  }
}
