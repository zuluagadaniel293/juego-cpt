// Carga de imágenes y preparación de texturas.

class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }
  preload() {
    Object.keys(CHAR_SVG).forEach(k =>
      this.load.svg('char_' + k, 'data:image/svg+xml;base64,' + btoa(CHAR_SVG[k]), { width: 220, height: 260 }));
    Object.keys(THEMES).forEach(t => assetNamesFor(t).forEach(n => {
      const p = assetFile(t, n);
      if (p) this.load.image('img_' + t + '_' + n, 'assets/' + p);
    }));
    // objetos e íconos comunes (canasta, red, efectos, íconos)
    Object.entries(COMMON_ASSETS).forEach(([k, p]) => this.load.image('img_common_' + k, 'assets/' + p));
  }
  create() {
    buildTextures(this);
    // si hay imagen común, reemplaza al dibujo provisional con el mismo nombre ('basket', 'net', 'icon_map'...)
    Object.keys(COMMON_ASSETS).forEach(k => {
      if (!this.textures.exists('img_common_' + k)) return;
      if (this.textures.exists(k)) this.textures.remove(k);
      this.textures.renameTexture('img_common_' + k, k);
    });
    Object.keys(THEMES).forEach(t => {
      TEX[t] = {};
      assetNamesFor(t).forEach(n => {
        const img = 'img_' + t + '_' + n;
        TEX[t][n] = this.textures.exists(img) ? img : fallbackKey(t, n);
      });
      // si hay imagen del héroe pero no corriendo, usa la misma
      if (TEX[t].hero_run === 'char_' + t && TEX[t].hero !== 'char_' + t) TEX[t].hero_run = TEX[t].hero;
      // villano atrapado: si no hay imagen propia, se arma con el villano + una red encima
      if (!TEX[t].villain_caught) TEX[t].villain_caught = this.makeCaught(t);
      // poses del villano para las escenas de fondo (escabulléndose, riéndose): si faltan, la imagen normal
      ['villain_sneak', 'villain_laugh', 'villain_taunt', 'villain_run', 'villain_scared'].forEach(n => { if (!TEX[t][n]) TEX[t][n] = TEX[t].villain; });
    });
    this.scene.start('Mode');
  }
  makeCaught(t) {
    const key = t + '_caught', W = 220, H = 260;
    const dt = this.textures.addDynamicTexture(key, W, H);
    const v = fit(this.make.image({ key: TEX[t].villain, add: false }), 240).setPosition(W / 2, H / 2);
    dt.draw(v);
    const g = this.make.graphics({ add: false });
    g.lineStyle(3, 0xf1f5f9, 0.9);
    for (let x = -H; x < W; x += 22) { g.lineBetween(x, 0, x + H, H); g.lineBetween(x + H, 0, x, H); }
    g.lineStyle(8, 0xe5e7eb, 1); g.strokeRoundedRect(4, 4, W - 8, H - 8, 40);
    dt.draw(g);
    v.destroy(); g.destroy();
    return key;
  }
}
