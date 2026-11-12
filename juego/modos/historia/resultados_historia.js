// Historia: estrellas del capítulo y desbloqueo del siguiente.

// Historia: guarda estrellas del capítulo y desbloquea el siguiente
class StoryResultsScene extends Phaser.Scene {
  constructor() { super('StoryResults'); }
  init(data) {
    this.log = data.log;
    this.themeKey = data.theme;
    this.chapter = data.chapter;
    this.mg = data.minigame;
    this.boss = data.boss;
  }
  create() {
    const W = GAME_W;
    const th = THEMES[this.themeKey];
    this.cameras.main.setBackgroundColor(th.bg);
    drawBackdrop(this, this.themeKey, this.chapter, 0.75);

    const s = levelStats(this.log, this.mg);
    const stars = starsFor(s, this.mg);
    const story = getStory();
    const arr = story[this.themeKey] || [0, 0, 0, 0, 0];
    arr[this.chapter] = Math.max(arr[this.chapter], stars);
    story[this.themeKey] = arr;
    store.set('cpt_story', story);

    const passed = stars >= PASS_STARS;
    if (passed && this.boss) newChapterOrder(this.themeKey);   // al volver a jugar el mundo, otro orden de juegos
    const title = passed ? (this.boss ? '¡Misión cumplida!' : '¡Capítulo superado!') : '¡Casi lo logras!';
    drawKidSummary(this, s, stars, this.boss ? 'Acertaste' : MG[this.mg].verb, title);
    // al vencer al jefe se abre el mundo siguiente del mapa (si hay)
    const ks = Object.keys(THEMES), next = ks[ks.indexOf(this.themeKey) + 1];
    const bossMsg = next ? '¡Se abrió el mundo ' + THEMES[next].label + '!' : '¡Venciste el desafío final!';
    this.add.text(W / 2, 300, passed ? (this.boss ? bossMsg : '¡Se abrió el siguiente capítulo!')
      : 'Necesitas al menos ' + PASS_STARS + ' estrellas. ¡Inténtalo otra vez!',
      { font: 'bold 26px Arial', color: hexColor(th.accent) }).setOrigin(0.5);

    if (passed && !this.boss) {
      makeButton(this, W / 2, 400, 340, 64, 'Siguiente capítulo', th.accent,
        () => this.scene.start('Story', { theme: this.themeKey, chapter: this.chapter + 1 }));
    } else if (passed) {
      makeButton(this, W / 2, 400, 340, 64, 'Ver el final', th.accent,
        () => this.scene.start('Story', { theme: this.themeKey, chapter: this.chapter, ending: true }));
    } else {
      makeButton(this, W / 2, 400, 340, 64, 'Reintentar', th.accent,
        () => startMinigame(this, { mode: 'historia', theme: this.themeKey, chapter: this.chapter,
          minigame: chapterGame(this.themeKey, this.chapter) }));
    }
    makeButton(this, W / 2 - 170, 490, 280, 50, 'Descargar CSV', 0xcbd5e1,
      () => downloadCSV(this.log, 'historia_' + this.themeKey + '_cap' + (this.chapter + 1)));
    makeButton(this, W / 2 + 170, 490, 280, 50, 'Capítulos', 0xcbd5e1, () => this.scene.start('ChapterMap', { theme: this.themeKey }));
    perfectMissionPanel(this, this.themeKey, this.log);
    missionCheck(this);
  }
}
