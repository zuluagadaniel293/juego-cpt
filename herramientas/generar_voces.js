// Graba en MP3 todo lo que dice el personaje de cada mundo, con una voz fija por personaje.
// Lee los textos directamente de juego/modos/historia/mundos/*.js, así que si cambias un texto
// basta con volver a correr este script (solo regraba lo que cambió).
//
// Requiere Node y edge-tts (voces neuronales de Microsoft, gratis, necesita internet):
//   python -m pip install edge-tts
// Uso (desde la carpeta del proyecto):
//   node herramientas/generar_voces.js
// Si edge-tts no está en el PATH: TTS_CMD="python -m edge_tts" node herramientas/generar_voces.js
//
// Genera:
//   assets/voces/<mundo>/<id>.mp3   un audio por texto
//   assets/voces.js                 qué audio usa el juego para cada texto (window.VOICES)
//   herramientas/voces_textos.json  el texto exacto de cada audio (para revisar o volver a grabar)

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
// Voz de cada personaje: nombre de la voz, tono (más agudo = suena más joven) y velocidad
const VOCES = {
  heroes:  { carpeta: 'superheroes',  voz: 'es-CO-GonzaloNeural', tono: '+25Hz', velocidad: '+6%' },   // Héroe Rayo
  fantasy: { carpeta: 'dragones',     voz: 'es-CO-SalomeNeural',  tono: '+35Hz', velocidad: '+6%' },   // Chispa
  kingdom: { carpeta: 'reino_magico', voz: 'es-MX-DaliaNeural',   tono: '+12Hz', velocidad: '+0%' }    // Reina Luna
};
const JUEGOS = ['classic', 'catch', 'race', 'find', 'memory'];

// 1. Leer los mundos (solo hace falta lo que pasan a registrarMundo)
const mundos = {};
const sandbox = { registrarMundo: (key, m) => { mundos[key] = m; } };
vm.createContext(sandbox);
for (const f of ['superheroes', 'dragones', 'reino_magico']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'juego/modos/historia/mundos', f + '.js'), 'utf8'), sandbox);
}

// 2. Todos los textos posibles de cada mundo (los mismos ids que usa chapterLine en juego/nucleo/mundos.js)
function textos(st) {
  const t = {};
  st.chapters.forEach((ch, i) => { t[String(i + 1)] = ch.line; });
  t.end = st.ending;
  JUEGOS.forEach(mg => {
    t[mg] = st.mgLines[mg];
    t['intro_' + mg] = st.intro + st.mgLines[mg];
  });
  Object.entries(st.bossLines || {}).forEach(([mg, line]) => { t['boss_' + mg] = line; });
  return t;
}

// 3. Grabar lo que falte o haya cambiado
const cmd = (process.env.TTS_CMD || 'edge-tts').split(' ');
const textosPath = path.join(__dirname, 'voces_textos.json');
const antes = fs.existsSync(textosPath) ? JSON.parse(fs.readFileSync(textosPath, 'utf8')) : {};
const mapa = {}, todos = {};
let grabados = 0;
for (const [key, cfg] of Object.entries(VOCES)) {
  const dir = path.join(ROOT, 'assets/voces', cfg.carpeta);
  fs.mkdirSync(dir, { recursive: true });
  mapa[key] = {}; todos[key] = {};
  for (const [id, texto] of Object.entries(textos(mundos[key].story))) {
    const file = path.join(dir, id + '.mp3');
    const firma = crypto.createHash('md5').update(cfg.voz + cfg.tono + cfg.velocidad + texto).digest('hex').slice(0, 10);
    todos[key][id] = { texto, firma };
    if (!(fs.existsSync(file) && antes[key] && antes[key][id] && antes[key][id].firma === firma)) {
      const r = spawnSync(cmd[0], cmd.slice(1).concat(['--voice', cfg.voz, '--pitch=' + cfg.tono, '--rate=' + cfg.velocidad,
        '--text', texto, '--write-media', file]), { encoding: 'utf8' });
      if (r.status !== 0) { console.error('No se pudo grabar', key, id, r.stderr || r.error); process.exit(1); }
      grabados++;
      console.log('grabado', cfg.carpeta + '/' + id + '.mp3');
    }
    mapa[key][id] = 'voces/' + cfg.carpeta + '/' + id + '.mp3';
  }
}
// rutas relativas a assets/ (como en manifest.js)
fs.writeFileSync(path.join(ROOT, 'assets/voces.js'),
  '// Generado por herramientas/generar_voces.js: no editar a mano.\n' +
  '// Audio de cada texto de los personajes (ids: ver chapterLine en juego/nucleo/mundos.js).\n' +
  'window.VOICES = ' + JSON.stringify(mapa, null, 2) + ';\n');
fs.writeFileSync(textosPath, JSON.stringify(todos, null, 2) + '\n');
console.log('Listo: ' + grabados + ' audios nuevos.');
