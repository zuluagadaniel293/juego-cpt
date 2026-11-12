// Historia: camino con los 5 capítulos (niveles) de un mundo.

class ChapterMapScene extends Phaser.Scene {
  constructor() { super('ChapterMap'); }
  init(data) { this.themeKey = data.theme; }
  create() {
    const W = GAME_W;
    const th = THEMES[this.themeKey];
    const st = STORY[this.themeKey];
    const stars = chapterStars(this.themeKey);
    this.cameras.main.setBackgroundColor(th.bg);
    const cur = stars.findIndex(s => s < PASS_STARS);
    drawBackdrop(this, this.themeKey, cur < 0 ? 4 : cur, 0.55);
    backLink(this, 'Mapa', () => this.scene.start('WorldMap'));
    this.add.text(W / 2, 40, th.label, { font: 'bold 34px Arial', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(W - 30, 40, '★ ' + stars.reduce((a, b) => a + b, 0) + ' / 15', { font: 'bold 22px Arial', color: '#fde047' }).setOrigin(1, 0.5);

    const pos = [[110, 400], [290, 210], [470, 400], [650, 210], [830, 310]];
    const path = this.add.graphics();
    path.lineStyle(6, 0xffffff, 0.18);
    for (let i = 0; i < pos.length - 1; i++) path.lineBetween(pos[i][0], pos[i][1], pos[i + 1][0], pos[i + 1][1]);

    const current = stars.findIndex(s => s < PASS_STARS);  // primer capítulo sin superar
    st.chapters.forEach((ch, i) => {
      const [x, y] = pos[i];
      const r = ch.boss ? 62 : 46;
      const unlocked = i === 0 || stars[i - 1] >= PASS_STARS;
      const done = stars[i] >= PASS_STARS;
      let node;
      if (done) {
        node = this.add.circle(x, y, r, th.accent);
        if (ch.boss) fit(this.add.image(x, y, TEX[this.themeKey].villain_caught), 96);
        else this.add.text(x, y, String(i + 1), { font: 'bold 36px Arial', color: '#0f172a' }).setOrigin(0.5);
        this.add.text(x, y + r + 48, starsText(stars[i]), { font: '20px Arial', color: '#fde047' }).setOrigin(0.5);
      } else if (unlocked) {
        const glow = this.add.circle(x, y, r + 14, th.accent, 0.35);
        this.tweens.add({ targets: glow, scale: 1.15, alpha: 0.15, duration: 800, yoyo: true, repeat: -1 });
        node = this.add.circle(x, y, r, ch.boss ? 0x7c3aed : 0xffffff).setStrokeStyle(6, th.accent);
        if (ch.boss) fit(this.add.image(x, y, TEX[this.themeKey].villain), 96);
        else this.add.text(x, y, String(i + 1), { font: 'bold 36px Arial', color: '#0f172a' }).setOrigin(0.5);
        // con 1 estrella todavía no se supera: se muestra lo que lleva para que intente mejorarlo
        if (stars[i] > 0) this.add.text(x, y + r + 48, starsText(stars[i]), { font: '20px Arial', color: '#fde047' }).setOrigin(0.5);
        else if (i === current) this.add.text(x, y + r + 50, '¡Jugar!', { font: 'bold 18px Arial', color: hexColor(th.accent) }).setOrigin(0.5);
      } else {
        // Bloqueado: la silueta de lo que hay adentro (el villano en el jefe final, el objeto del minijuego
        // en los demás), con un "?" y un candado pequeño, para dar curiosidad. Encuentra y Memoria usan el objetivo:
        // sus íconos vienen en baldosa y la silueta sería un cuadrado
        const what = ch.boss || chapterChars(this.themeKey, i) ? TEX[this.themeKey].villain
          : { classic: TEX[this.themeKey].target, catch: 'basket', race: TEX[this.themeKey].hero_run, find: TEX[this.themeKey].target,
              memory: TEX[this.themeKey].target, notx: TEX[this.themeKey].target, ax: TEX[this.themeKey].dist1 }[chapterGame(this.themeKey, i)];
        const objs = mysteryNode(this, x, y, r, silhouetteOf(this, what), ch.boss ? 0x7c3aed : undefined);
        objs.push(fit(this.add.image(x - r * 0.7, y + r * 0.7, 'icon_lock'), ch.boss ? 30 : 24));
        node = objs[0].setInteractive({ useHandCursor: true });
        node.on('pointerdown', () => teaseLocked(this, objs, ch.boss
          ? '¿Quién se esconde aquí? Supera los capítulos para descubrirlo'
          : '¿Qué habrá aquí? Gana ' + PASS_STARS + ' estrellas en el capítulo anterior para descubrirlo'));
      }
      this.add.text(x, y + r + 22, ch.place, { font: 'bold 17px Arial', color: '#ffffff' }).setOrigin(0.5).setAlpha(unlocked ? 1 : 0.55);
      if (unlocked) {
        node.setInteractive({ useHandCursor: true });
        node.on('pointerdown', () => this.scene.start('Story', { theme: this.themeKey, chapter: i }));
      }
    });
  }
}
