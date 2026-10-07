// Historia: escena con el personaje, globo de diálogo y voz.

// Escena de historia: personaje + globo de diálogo (con voz)
class StoryScene extends Phaser.Scene {
  constructor() { super('Story'); }
  init(data) {
    this.themeKey = data.theme;
    this.chapter = data.chapter;
    this.ending = !!data.ending;
  }
  create() {
    const W = this.scale.width, H = this.scale.height;
    const th = THEMES[this.themeKey];
    const st = STORY[this.themeKey];
    const tex = TEX[this.themeKey];
    const ch = st.chapters[this.chapter];
    const withVillain = this.ending || ch.boss;
    this.cameras.main.setBackgroundColor(th.bg);
    if (!(this.ending && tex.end)) drawBackdrop(this, this.themeKey, this.ending ? 4 : this.chapter, 0.12);
    this.events.once('shutdown', stopVoice);

    // Final con ilustración propia (si existe el archivo *_end.png)
    if (this.ending && tex.end) {
      const bg = this.add.image(W / 2, H / 2, tex.end);
      bg.setScale(Math.max(W / bg.width, H / bg.height));
    }
    backLink(this, 'Capítulos', () => this.scene.start('ChapterMap', { theme: this.themeKey }));

    const label = this.ending ? '¡Mundo completado!'
      : (ch.boss ? 'Jefe final' : 'Capítulo ' + (this.chapter + 1)) + ' · ' + ch.place;
    const pill = this.add.text(W / 2, 60, label, { font: 'bold 20px Arial', color: hexColor(th.accent) }).setOrigin(0.5).setDepth(2);
    const pg = this.add.graphics().setDepth(1);
    pg.fillStyle(0x0f172a, 0.55);
    pg.fillRoundedRect(pill.x - pill.width / 2 - 20, 42, pill.width + 40, 36, 18);

    const text = this.ending ? st.ending : ch.line;
    const voiceId = this.ending ? 'end' : this.chapter + 1;
    let bubble, btnY;
    if (this.ending && tex.end) {
      bubble = { x: 40, y: 380, w: 620, h: 130, wrap: 580, font: 24, tail: false };
      makeButton(this, 800, 410, 220, 50, 'Escuchar', 0xcbd5e1, () => playVoice(this.themeKey, voiceId, text));
      makeButton(this, 800, 480, 220, 50, 'Volver al mapa', th.accent, () => this.scene.start('WorldMap'));
    } else {
      const heroX = withVillain ? 150 : 210;
      const hero = fit(this.add.image(heroX, 300, tex.hero), withVillain ? 230 : 260);
      this.tweens.add({ targets: hero, y: 292, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      this.add.text(heroX, 450, st.hero, { font: 'bold 20px Arial', color: '#ffffff', stroke: '#0f172a', strokeThickness: 5 }).setOrigin(0.5);
      this.add.text(heroX, 476, 'Poder: ' + POWERS[this.themeKey].name,
        { font: 'bold 16px Arial', color: hexColor(POWERS[this.themeKey].color), stroke: '#0f172a', strokeThickness: 4 }).setOrigin(0.5);
      if (withVillain) {
        const v = fit(this.add.image(820, 300, this.ending ? tex.villain_caught : tex.villain), 210);
        if (!this.ending) this.tweens.add({ targets: v, angle: { from: -4, to: 4 }, duration: 500, yoyo: true, repeat: -1 });
        this.add.text(820, 450, th.villain, { font: 'bold 20px Arial', color: '#ffffff', stroke: '#0f172a', strokeThickness: 5 }).setOrigin(0.5);
        bubble = { x: 290, y: 120, w: 420, h: 250, wrap: 370, font: 24, tail: true };
        btnY = 455;
        makeButton(this, 390, btnY, 180, 54, 'Escuchar', 0xcbd5e1, () => playVoice(this.themeKey, voiceId, text));
      } else {
        bubble = { x: 380, y: 130, w: 540, h: 230, wrap: 480, font: 26, tail: true };
        btnY = 430;
        makeButton(this, 520, btnY, 200, 56, 'Escuchar', 0xcbd5e1, () => playVoice(this.themeKey, voiceId, text));
      }
      const goX = withVillain ? 610 : 760;
      if (this.ending) makeButton(this, goX, btnY, 240, 56, 'Volver al mapa', th.accent, () => this.scene.start('WorldMap'));
      else makeButton(this, goX, btnY, 240, 56, '¡Vamos!', th.accent,
        () => this.scene.start('Game', { mode: 'historia', theme: this.themeKey, chapter: this.chapter }));
    }
    const b = this.add.graphics();
    b.fillStyle(0xffffff, 1);
    b.fillRoundedRect(bubble.x, bubble.y, bubble.w, bubble.h, 28);
    if (bubble.tail) b.fillTriangle(bubble.x, bubble.y + 100, bubble.x, bubble.y + 140, bubble.x - 30, bubble.y + 120);
    this.add.text(bubble.x + 28, bubble.y + 26, text,
      { font: 'bold ' + bubble.font + 'px Arial', color: '#0f172a', wordWrap: { width: bubble.wrap }, lineSpacing: 6 });
    playVoice(this.themeKey, voiceId, text);
  }
}
