// Imágenes de la carpeta assets, dibujos provisionales y fondos ambientados.

// ======================= IMÁGENES Y AUDIOS (carpeta assets) =======================
// Cada imagen tiene un dibujo provisional. Si assets/manifest.js le asigna un archivo, se usa el archivo.
const ASSET_NAMES = ['target', 'dist1', 'dist2', 'dist3', 'hero', 'hero_run', 'villain', 'villain_caught',
  'villain_sneak', 'villain_laugh', 'villain_taunt', 'villain_run', 'villain_scared', 'villain_face',
  ...['friend1', 'friend2', 'friend3'].flatMap(f => [f + '_help', f + '_cower', f + '_flee', f + '_cheer']),
  'friend1', 'friend2', 'friend3', 'net', 'end', 'treasure', 'bg_1', 'bg_2', 'bg_3', 'bg_4', 'bg_5'];
const ASSETS = window.ASSETS || {};
const COMMON_ASSETS = ASSETS.comunes || {};   // objetos e íconos de todos los mundos

// Archivo asignado a un papel de un mundo (ruta dentro de assets/), o null si no tiene.
function assetFile(theme, name) {
  return (ASSETS[theme] || {})[name] || null;
}
// Papeles de un mundo: los comunes + sus distractores del entorno (distractor_avion, distractor_gato...)
function assetNamesFor(theme) {
  return ASSET_NAMES.concat((DISTRACTORS[theme] ? DISTRACTORS[theme].visual : []).map(v => 'distractor_' + v.name));
}
function fallbackKey(theme, name) {
  if (name.startsWith('distractor_')) return theme + '_dv_' + name.slice('distractor_'.length);
  if (name === 'hero' || name === 'hero_run') return 'char_' + theme;
  if (name === 'net') return 'net';
  if (/^villain_(sneak|laugh|taunt|run|scared|face)$/.test(name)) return null;   // poses: si faltan, la imagen del villano
  if (/^friend\d_(help|cower|flee|cheer)$/.test(name)) return null;                   // poses: si faltan, la imagen del amigo
  if (name === 'end' || name === 'villain_caught' || name === 'treasure' || name.startsWith('bg_')) return null; // se generan aparte
  if (name === 'friend3' && theme !== 'heroes') return theme + '_friend1';
  return theme + '_' + name;
}
const TEX = {};   // TEX[tema][nombre] = textura a usar (archivo o dibujo provisional)

// ======================= FONDOS AMBIENTADOS =======================
// Un fondo por capítulo (idx 0-4). Si assets/manifest.js le asigna una imagen (bg_1 ... bg_5), se usa;
// si no, se dibuja uno provisional. dim = cuánto se oscurece con el color del mundo (0 a 1).
function drawBackdrop(scene, theme, idx, dim) {
  const W = GAME_W, H = GAME_H;
  const key = TEX[theme]['bg_' + (idx + 1)];
  if (key) {
    const img = scene.add.image(W / 2, H / 2, key).setDepth(-20);
    img.setScale(Math.max(W / img.width, H / img.height));
  } else {
    const g = scene.add.graphics().setDepth(-20);
    const rng = new Phaser.Math.RandomDataGenerator([theme + idx]);
    BACKDROPS[theme](g, idx, rng, W, H);
  }
  if (dim > 0) scene.add.rectangle(0, 0, W, H, THEMES[theme].bg, dim).setOrigin(0).setDepth(-19);
}

function mixColor(a, b, t) {
  const c = (s) => [(s >> 16) & 255, (s >> 8) & 255, s & 255];
  const A = c(a), B = c(b);
  return (Math.round(A[0] + (B[0] - A[0]) * t) << 16) | (Math.round(A[1] + (B[1] - A[1]) * t) << 8) | Math.round(A[2] + (B[2] - A[2]) * t);
}
function skyGradient(g, top, bottom, W, H) {
  for (let y = 0; y < H; y += 10) { g.fillStyle(mixColor(top, bottom, y / H), 1); g.fillRect(0, y, W, 10); }
}

function fit(img, px) {   // escala una imagen para que su lado mayor mida px
  img.setScale(px / Math.max(img.width, img.height));
  return img;
}
// Escala para partículas: que la textura (dibujo o imagen) mida unos px en pantalla
function sizeScale(scene, key, px) {
  const f = scene.textures.getFrame(key);
  return px / Math.max(f.width, f.height);
}
// Chispa de los efectos: la imagen común si existe; si no, la chispa del color de cada mundo
function sparkKey(scene, theme) {
  return scene.textures.exists('spark') ? 'spark' : 'spark_' + theme;
}
