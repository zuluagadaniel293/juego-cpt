// Arranque del juego (va al final, después de cargar todo lo demás).

// Abierto con doble clic (file://), Chrome no deja usar imágenes en WebGL: se usa el modo Canvas.
new Phaser.Game({
  type: location.protocol === 'file:' ? Phaser.CANVAS : Phaser.AUTO,
  parent: 'game',
  width: 960,
  height: 540,
  backgroundColor: '#0f172a',
  loader: { imageLoadType: 'HTMLImageElement' },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [BootScene, ModeScene, MenuScene, MinigameSelectScene, WorldMapScene, ChapterMapScene, StoryScene,
    GameScene, ResultsScene, ChallengeResultsScene, StoryResultsScene]
});
