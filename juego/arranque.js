// Arranque del juego (va al final, después de cargar todo lo demás).

const SCENES = [BootScene, ModeScene, MenuScene, MinigameSelectScene, WorldMapScene, ChapterMapScene, StoryScene,
  GameScene, ResultsScene, ChallengeResultsScene, StoryResultsScene, MemoryScene, MemoryResultsScene, PruebaSelectScene];

// Alta resolución: el lienzo mide RES veces 960x540 y cada escena hace zoom x RES centrada,
// así todo se sigue diseñando en 960x540 pero las imágenes y textos se ven nítidos en pantallas grandes.
SCENES.forEach(S => {
  const create = S.prototype.create;
  S.prototype.create = function (...args) {
    this.cameras.main.setZoom(RES).centerOn(GAME_W / 2, GAME_H / 2);
    return create.apply(this, args);
  };
});
// Los textos se generan también a RES, para que no se vean borrosos con el zoom.
// Solo en WebGL (versión publicada): en modo Canvas (doble clic) Phaser los dibujaría al doble de tamaño.
const addText = Phaser.GameObjects.GameObjectFactory.prototype.text;
Phaser.GameObjects.GameObjectFactory.prototype.text = function (...args) {
  const t = addText.apply(this, args);
  return this.scene.sys.game.renderer.type === Phaser.WEBGL ? t.setResolution(RES) : t;
};

// Abierto con doble clic (file://), Chrome no deja usar imágenes en WebGL: se usa el modo Canvas.
// window.juego queda accesible para las herramientas (por ejemplo, exportar las imágenes a Figma).
window.juego = new Phaser.Game({
  type: location.protocol === 'file:' ? Phaser.CANVAS : Phaser.AUTO,
  parent: 'game',
  width: GAME_W * RES,
  height: GAME_H * RES,
  backgroundColor: '#0f172a',
  loader: { imageLoadType: 'HTMLImageElement' },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: SCENES
});
