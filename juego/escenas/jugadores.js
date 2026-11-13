// ¿Quién va a jugar? Cada niño se registra con su nombre y tiene su propio progreso (estrellas, mundos, récords)
// y su propio historial para el Panel del profesional. Sale al abrir el juego si todavía no hay nadie elegido,
// y desde "Cambiar" en la pantalla inicial.

const PLAYER_COLORS = [0x38bdf8, 0xfb923c, 0xa78bfa, 0x4ade80, 0xf472b6, 0xfde047, 0x22d3ee, 0xf87171];
const PER_PAGE = 7;   // 7 niños + la tarjeta de "Nuevo jugador" por página

class PlayersScene extends Phaser.Scene {
  constructor() { super('Players'); }
  init(data) { this.page = (data && data.page) || 0; }
  create() {
    const W = GAME_W, H = GAME_H;
    this.cameras.main.setBackgroundColor(0x0f172a);
    this.add.text(W / 2, 58, '¿Quién va a jugar?', { font: 'bold 46px Arial', color: '#fde047', stroke: '#7c3aed', strokeThickness: 8 }).setOrigin(0.5);
    this.add.text(W / 2, 108, 'Toca tu nombre. Si es tu primera vez, crea tu jugador.', { font: 'bold 19px Arial', color: '#cbd5e1' }).setOrigin(0.5);
    if (currentPlayer()) backLink(this, 'Volver', () => this.scene.start('Mode'));

    const players = getPlayers();
    const pages = Math.max(1, Math.ceil((players.length + 1) / (PER_PAGE + 1)));
    this.page = Math.min(this.page, pages - 1);
    const shown = players.slice(this.page * PER_PAGE, (this.page + 1) * PER_PAGE);
    const cards = shown.map(p => ['player', p]).concat([['new']]);
    cards.forEach((c, i) => {
      const inRow = Math.min(4, cards.length - Math.floor(i / 4) * 4);   // cada fila centrada
      const x = W / 2 + ((i % 4) - (inRow - 1) / 2) * 215, y = 225 + Math.floor(i / 4) * 175;
      if (c[0] === 'new') return this.newCard(x, y);
      this.playerCard(x, y, c[1]);
    });
    if (pages > 1) {
      const arrow = (x, label, page) => this.add.text(x, 400, label, { font: 'bold 54px Arial', color: '#ffffff' }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true }).on('pointerdown', () => this.scene.restart({ page }));
      if (this.page > 0) arrow(28, '‹', this.page - 1);
      if (this.page < pages - 1) arrow(W - 28, '›', this.page + 1);
    }
  }
  playerCard(x, y, p) {
    const color = PLAYER_COLORS[(p.id - 1) % PLAYER_COLORS.length];
    const card = drawCard(this, x, y, 195, 155, 0xffffff, 0.06, color);
    this.add.circle(x, y - 30, 34, color);
    this.add.text(x, y - 30, p.name.charAt(0).toUpperCase(), { font: 'bold 38px Arial', color: '#0f172a' }).setOrigin(0.5);
    this.add.text(x, y + 22, p.name, { font: 'bold 24px Arial', color: '#ffffff' }).setOrigin(0.5);
    const story = rawStore.get(playerKey(p.id, 'cpt_story'), {});
    const stars = Object.values(story).reduce((a, arr) => a + arr.reduce((x2, y2) => x2 + y2, 0), 0);
    this.add.text(x, y + 54, '⭐ ' + stars, { font: 'bold 18px Arial', color: '#fde047' }).setOrigin(0.5);
    const zone = this.add.zone(x, y, 195, 155).setInteractive({ useHandCursor: true });
    zone.on('pointerover', () => card.setAlpha(0.75));
    zone.on('pointerout', () => card.setAlpha(1));
    zone.on('pointerdown', () => { getCtx(); selectPlayer(p.id); this.scene.start('Mode'); });
  }
  newCard(x, y) {
    const card = drawCard(this, x, y, 195, 155, 0xffffff, 0.03, 0x64748b);
    this.add.text(x, y - 22, '+', { font: 'bold 64px Arial', color: '#fde047' }).setOrigin(0.5);
    this.add.text(x, y + 40, 'Nuevo jugador', { font: 'bold 22px Arial', color: '#ffffff' }).setOrigin(0.5);
    const zone = this.add.zone(x, y, 195, 155).setInteractive({ useHandCursor: true });
    zone.on('pointerover', () => card.setAlpha(0.75));
    zone.on('pointerout', () => card.setAlpha(1));
    zone.on('pointerdown', () => { getCtx(); this.openForm(); });
  }
  // Formulario en HTML (encima del juego), para poder escribir con el teclado del celular o del computador
  openForm() {
    if (this.form) return;
    const kb = this.input.keyboard;
    kb.enabled = false; kb.disableGlobalCapture();   // que las teclas (espacio, flechas) lleguen al formulario
    const f = document.createElement('form');
    f.className = 'mf-form';
    f.innerHTML =
      '<h2>¡Hola! ¿Cómo te llamas?</h2>' +
      '<label>Tu nombre<input name="name" maxlength="20" autocomplete="off" required></label>' +
      '<label>Tu edad <small>(opcional: así el juego va a tu ritmo)</small><input name="age" type="number" min="3" max="99" inputmode="numeric"></label>' +
      '<div class="mf-row"><button type="button" class="mf-cancel">Cancelar</button><button type="submit">¡Listo!</button></div>';
    document.body.appendChild(f);
    this.form = f;
    const close = () => {
      if (!this.form) return;
      f.remove(); this.form = null;
      kb.enabled = true; kb.enableGlobalCapture();
    };
    f.querySelector('.mf-cancel').onclick = close;
    f.onsubmit = e => {
      e.preventDefault();
      const name = f.elements.name.value.trim();
      if (!name) return;
      addPlayer(name, f.elements.age.value);
      close();
      this.scene.start('Mode');
    };
    this.events.once('shutdown', close);
    setTimeout(() => f.elements.name.focus(), 50);
  }
}
