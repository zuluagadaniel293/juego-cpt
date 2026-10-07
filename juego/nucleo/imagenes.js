// Imágenes de la carpeta assets, dibujos provisionales y fondos ambientados.

// ======================= IMÁGENES Y AUDIOS (carpeta assets) =======================
// Cada imagen tiene un dibujo provisional. Si el archivo está en assets/manifest.js, se usa el archivo.
const ASSET_NAMES = ['target', 'dist1', 'dist2', 'dist3', 'hero', 'hero_run', 'villain', 'villain_caught',
  'friend1', 'friend2', 'friend3', 'net', 'end', 'bg_1', 'bg_2', 'bg_3', 'bg_4', 'bg_5'];
const AVAILABLE = new Set(window.ASSET_FILES || []);

function assetPath(theme, name) {
  // en Superhéroes, el objetivo y los distractores de los capítulos 1-4 son señales
  const signal = { target: 'signal_target', dist1: 'signal_1', dist2: 'signal_2', dist3: 'signal_3' };
  const file = theme === 'heroes' && signal[name] ? signal[name] : name;
  return theme + '/' + theme + '_' + file + '.png';
}
function fallbackKey(theme, name) {
  if (name === 'hero' || name === 'hero_run') return 'char_' + theme;
  if (name === 'net') return 'net';
  if (name === 'end' || name === 'villain_caught' || name.startsWith('bg_')) return null; // se generan aparte
  if (name === 'friend3' && theme !== 'heroes') return theme + '_friend1';
  return theme + '_' + name;
}
const TEX = {};   // TEX[tema][nombre] = textura a usar (archivo o dibujo provisional)

// ======================= FONDOS AMBIENTADOS =======================
// Un fondo por capítulo (idx 0-4). Si existe assets/<tema>/<tema>_bg_N.png (o .jpg) se usa la imagen;
// si no, se dibuja uno provisional. dim = cuánto se oscurece con el color del mundo (0 a 1).
function drawBackdrop(scene, theme, idx, dim) {
  const W = scene.scale.width, H = scene.scale.height;
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
