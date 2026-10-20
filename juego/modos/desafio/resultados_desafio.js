// Desafío: estrellas y subida/bajada de nivel automática.

// Desafío: estrellas y cambio de nivel automático
class ChallengeResultsScene extends Phaser.Scene {
  constructor() { super('ChallengeResults'); }
  init(data) {
    this.log = data.log;
    this.themeKey = data.theme;
    this.level = data.level;
    this.mg = data.minigame;
  }
  create() {
    const W = GAME_W;
    const th = THEMES[this.themeKey];
    this.cameras.main.setBackgroundColor(th.bg);
    drawBackdrop(this, this.themeKey, (this.level - 1) % 5, 0.75);

    const runLog = (this.registry.get('runLog') || []).concat(this.log);
    this.registry.set('runLog', runLog);

    const s = computeStats(this.log);
    const stars = starsFor(s, this.mg);
    // 2 o 3 estrellas: sube · 1: repite · 0: baja para practicar
    const next = stars >= 2 ? this.level + 1 : stars === 0 ? Math.max(1, this.level - 1) : this.level;

    const records = getRecords();
    const recKey = this.themeKey + '_' + this.mg;
    // guardar en qué nivel quedó, para continuar desde ahí aunque salga del juego
    const levels = getChallengeLevels();
    levels[recKey] = next;
    store.set('cpt_challenge_level', levels);
    const newRecord = stars >= 2 && this.level > (records[recKey] || 0);
    if (newRecord) {
      records[recKey] = this.level;
      store.set('cpt_records', records);
    }

    drawKidSummary(this, s, stars, MG[this.mg].verb,
      stars >= 2 ? '¡Excelente!' : stars === 1 ? '¡Buen intento!' : '¡Sigue practicando!');
    const msg = next > this.level ? '¡Subes al nivel ' + next + '!'
      : next < this.level ? 'Bajamos al nivel ' + next + ' para practicar'
      : 'Repite el nivel ' + this.level + ', ¡tú puedes!';
    this.add.text(W / 2, 300, msg, { font: 'bold 30px Arial', color: hexColor(th.accent) }).setOrigin(0.5);
    if (newRecord) this.add.text(W / 2, 345, '¡Nuevo récord!', { font: 'bold 22px Arial', color: '#86efac' }).setOrigin(0.5);

    makeButton(this, W / 2, 410, 320, 64, next > this.level ? 'Siguiente nivel' : 'Seguir', th.accent,
      () => this.scene.start('Game', { mode: 'desafio', theme: this.themeKey, level: next, minigame: this.mg }));
    makeButton(this, W / 2 - 170, 495, 280, 50, 'Descargar CSV', 0xcbd5e1, () => downloadCSV(runLog, 'desafio_' + this.themeKey));
    makeButton(this, W / 2 + 170, 495, 280, 50, 'Otro juego', 0xcbd5e1, () => this.scene.start('MinigameSelect', { theme: this.themeKey }));
    missionCheck(this);
  }
}
