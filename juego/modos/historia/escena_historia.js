// Historia: escena con el personaje, globo de diálogo y voz.

// Escena de historia: protagonista + (compañero del capítulo o villano) + globo de diálogo con voz.
// En los capítulos 1-4 primero habla quien presenta el capítulo (un amigo, o el villano en el 4) y después
// el protagonista explica el juego.
class StoryScene extends Phaser.Scene {
  constructor() { super('Story'); }
  init(data) {
    this.themeKey = data.theme;
    this.chapter = data.chapter;
    this.ending = !!data.ending;
  }
  create() {
    const W = GAME_W, H = GAME_H;
    const th = THEMES[this.themeKey];
    const st = STORY[this.themeKey];
    const tex = TEX[this.themeKey];
    const ch = st.chapters[this.chapter];
    const withVillain = this.ending || ch.boss;
    const comp = !withVillain && st.companions ? st.companions[this.chapter] : null;   // quien acompaña el capítulo
    const pair = withVillain || !!comp;   // dos personajes en pantalla
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

    const said = this.ending ? { text: st.ending, voice: 'end' } : chapterLine(this.themeKey, this.chapter);
    let bubble, btnY;
    if (this.ending && tex.end) {
      bubble = { x: 40, y: 380, w: 620, h: 130, wrap: 580, font: 24, tail: false };
      makeButton(this, 800, 410, 220, 50, 'Escuchar', 0xcbd5e1, () => this.talk());
      makeButton(this, 800, 480, 220, 50, 'Volver al mapa', th.accent, () => this.scene.start('WorldMap'));
    } else {
      const heroX = pair ? 150 : 210;
      const hero = fit(this.add.image(heroX, 300, tex.hero), pair ? 230 : 260);
      this.tweens.add({ targets: hero, y: 292, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      this.add.text(heroX, 450, st.hero, { font: 'bold 20px Arial', color: '#ffffff', stroke: '#0f172a', strokeThickness: 5 }).setOrigin(0.5);
      this.add.text(heroX, 476, 'Poder: ' + POWERS[this.themeKey].name,
        { font: 'bold 16px Arial', color: hexColor(POWERS[this.themeKey].color), stroke: '#0f172a', strokeThickness: 4 }).setOrigin(0.5);
      if (pair) {
        // a la derecha: el villano (jefe y final) o quien presenta el capítulo (amigo, o el villano burlándose)
        const key = withVillain ? (this.ending ? tex.villain_caught : tex.villain)
          : comp.role === 'villain' ? tex.villain_taunt : tex[comp.role];
        const other = fit(this.add.image(820, 300, key), 210).setFlipX(!withVillain);   // mira hacia el protagonista
        if (withVillain && !this.ending || comp && comp.role === 'villain') {
          this.tweens.add({ targets: other, angle: { from: -4, to: 4 }, duration: 500, yoyo: true, repeat: -1 });
        } else {
          this.tweens.add({ targets: other, y: 292, duration: 1000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        }
        this.add.text(820, 450, withVillain ? th.villain : comp.name,
          { font: 'bold 20px Arial', color: '#ffffff', stroke: '#0f172a', strokeThickness: 5 }).setOrigin(0.5);
        bubble = { x: 290, y: 120, w: 420, h: 250, wrap: 370, font: 22, tail: true };
        btnY = 455;
        makeButton(this, 390, btnY, 180, 54, 'Escuchar', 0xcbd5e1, () => this.talk());
      } else {
        bubble = { x: 380, y: 130, w: 540, h: 230, wrap: 480, font: 26, tail: true };
        btnY = 430;
        makeButton(this, 520, btnY, 200, 56, 'Escuchar', 0xcbd5e1, () => this.talk());
      }
      const goX = pair ? 610 : 760;
      if (this.ending) makeButton(this, goX, btnY, 240, 56, 'Volver al mapa', th.accent, () => this.scene.start('WorldMap'));
      else makeButton(this, goX, btnY, 240, 56, '¡Vamos!', th.accent,
        () => startMinigame(this, { mode: 'historia', theme: this.themeKey, chapter: this.chapter,
          minigame: chapterGame(this.themeKey, this.chapter) }));
    }
    this.bubble = bubble;
    this.bubbleG = this.add.graphics();
    this.bubbleText = this.add.text(bubble.x + 28, bubble.y + 24, '',
      { font: 'bold ' + bubble.font + 'px Arial', color: '#0f172a', wordWrap: { width: bubble.wrap }, lineSpacing: 6 });
    // diálogo: primero quien presenta el capítulo (solo el villano y el amigo que habla tienen frase), luego el
    // protagonista: en el capítulo 1, su saludo y después la frase del juego (dos audios encadenados)
    this.lines = (comp && comp.line ? [{ text: comp.line, voice: 'comp_' + (this.chapter + 1), right: true }] : [])
      .concat(this.chapter === 0 && !this.ending ? [Object.assign({ right: false }, introLine(this.themeKey))] : [])
      .concat({ text: said.text, voice: said.voice, right: false });
    this.talk();
  }
  // Muestra y dice cada parte del diálogo, una tras otra
  talk(i = 0) {
    const l = this.lines[i];
    if (!l) return;   // al salir de la escena, stopVoice corta la cadena (playVoice no llama a su onEnd)
    this.say(l.text, l.right);
    playVoice(this.themeKey, l.voice, l.text, () => this.time.delayedCall(350, () => this.talk(i + 1)));
  }
  // Globo de diálogo con la colita hacia quien habla (izquierda = protagonista, derecha = el otro personaje)
  say(text, right) {
    const b = this.bubble, g = this.bubbleG;
    g.clear();
    g.fillStyle(0xffffff, 1);
    g.fillRoundedRect(b.x, b.y, b.w, b.h, 28);
    if (b.tail && right) g.fillTriangle(b.x + b.w, b.y + 100, b.x + b.w, b.y + 140, b.x + b.w + 30, b.y + 120);
    else if (b.tail) g.fillTriangle(b.x, b.y + 100, b.x, b.y + 140, b.x - 30, b.y + 120);
    this.bubbleText.setText(text);
  }
}
