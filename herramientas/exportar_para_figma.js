// Exporta a para_figma/ todo lo que usa el juego, un archivo por personaje, objeto y fondo,
// organizado por mundo. Lee la lista de imágenes de assets/manifest.js, así siempre coincide con el juego.
// Uso: node herramientas/exportar_para_figma.js
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..') + '/';
const OUT = ROOT + 'para_figma/';

global.window = {};
eval(fs.readFileSync(ROOT + 'assets/manifest.js', 'utf8'));
const ASSETS = window.ASSETS;

const WORLD_DIR = { heroes: 'superheroes', fantasy: 'dragones', kingdom: 'reino_magico' };
// carpeta y descripción de cada papel del juego
const ROLE = {
  target: ['objetos', 'objetivo'], dist1: ['objetos', 'distractor'], dist2: ['objetos', 'distractor'], dist3: ['objetos', 'distractor dificil'],
  hero: ['personajes', 'protagonista'], villain: ['personajes', 'villano - jefe final'], villain_caught: ['personajes', 'villano atrapado - final'],
  friend1: ['personajes', 'amigo - distractor jefe'], friend2: ['personajes', 'amigo - distractor jefe'], friend3: ['personajes', 'parecido al villano - distractor dificil jefe'],
  end: ['fondos', 'escena final']
};
const COMMON_ROLE = {
  basket: 'minijuego Atrapa', net: 'jefe final', fireball: 'poder de Chispa', magicstar: 'poder de Reina Luna',
  heart: 'rescate de compañeros', spark: 'brillos al acertar', icon_map: 'modo Historia', icon_trophy: 'modo Desafio',
  icon_lock: 'mundos y capitulos bloqueados', icon_find: 'minijuego Encuentra'
};

function place(role) {
  if (ROLE[role]) return ROLE[role];
  if (role.startsWith('bg_')) return ['fondos', 'capitulo ' + role.slice(3)];
  if (role.startsWith('distractor_')) return ['distractores_entorno', 'cruza por el borde'];
  return ['otros', role];
}

fs.rmSync(OUT, { recursive: true, force: true });   // se regenera completa
let n = 0;
const copy = (src, rel) => {
  fs.mkdirSync(path.dirname(OUT + rel), { recursive: true });
  fs.copyFileSync(ROOT + 'assets/' + src, OUT + rel); n++;
};
for (const [world, roles] of Object.entries(ASSETS)) {
  if (world === 'comunes') continue;
  for (const [role, file] of Object.entries(roles)) {
    if (role.startsWith('voice_')) continue;
    const [dir, what] = place(role);
    const base = path.basename(file).replace(/\.[^.]+$/, ''), ext = path.extname(file);
    copy(file, WORLD_DIR[world] + '/' + dir + '/' + base + ' (' + what + ')' + ext);
  }
}
for (const [role, file] of Object.entries(ASSETS.comunes || {})) {
  const base = path.basename(file).replace(/\.[^.]+$/, ''), ext = path.extname(file);
  copy(file, 'comunes/' + base + ' (' + (COMMON_ROLE[role] || role) + ')' + ext);
}
fs.copyFileSync(path.join(__dirname, 'LEEME_para_figma.md'), OUT + 'LEEME.md');
console.log(n, 'imágenes exportadas a para_figma/');
