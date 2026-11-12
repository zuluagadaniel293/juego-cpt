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
  kingdom: { carpeta: 'reino_magico', voz: 'es-MX-DaliaNeural',   tono: '+12Hz', velocidad: '+0%' },   // Reina Luna
  space:   { carpeta: 'espacio',      voz: 'es-AR-ElenaNeural',   tono: '+25Hz', velocidad: '+4%' },   // Nova
  ocean:   { carpeta: 'oceano',       voz: 'es-US-PalomaNeural',  tono: '+25Hz', velocidad: '+4%' },   // Coral
  dinos:   { carpeta: 'dinosaurios',  voz: 'es-AR-TomasNeural',   tono: '+25Hz', velocidad: '+6%' },   // Tito
  robots:  { carpeta: 'robots',       voz: 'es-US-AlonsoNeural',  tono: '+25Hz', velocidad: '+6%' },   // Chip
  jungle:  { carpeta: 'selva',        voz: 'es-EC-AndreaNeural',  tono: '+25Hz', velocidad: '+4%' },   // Kiara
  candy:   { carpeta: 'dulces',       voz: 'es-MX-JorgeNeural',   tono: '+30Hz', velocidad: '+6%' }    // Gomi
};
// Voces del villano y de los 3 amigos de cada mundo (presentan capítulos y hacen de distractores auditivos).
// Voces latinoamericanas con cambios de tono pequeños: si se cambia mucho el tono, suenan a robot.
const VOCES_REPARTO = {
  heroes: {
    villain: { voz: 'es-VE-SebastianNeural', tono: '-4Hz',  velocidad: '+0%' },   // Sombra
    friend1: { voz: 'es-VE-PaolaNeural',     tono: '+10Hz', velocidad: '+3%' },   // Capitana Estrella
    friend2: { voz: 'es-PE-AlexNeural',      tono: '+10Hz', velocidad: '+3%' },   // Escudo Verde
    friend3: { voz: 'es-EC-LuisNeural',      tono: '+6Hz',  velocidad: '+0%' }    // Héroe Noche
  },
  fantasy: {
    villain: { voz: 'es-PE-CamilaNeural',    tono: '+4Hz',  velocidad: '-2%' },   // Morgana
    friend1: { voz: 'es-CR-MariaNeural',     tono: '+10Hz', velocidad: '+3%' },   // Hada del Bosque
    friend2: { voz: 'es-MX-JorgeNeural',     tono: '-8Hz',  velocidad: '-8%' },   // Mago Abuelo
    friend3: { voz: 'es-VE-PaolaNeural',     tono: '+4Hz',  velocidad: '+0%' }    // Hechicera Buena
  },
  kingdom: {
    villain: { voz: 'es-EC-LuisNeural',      tono: '+12Hz', velocidad: '+6%' },   // Duende Pícaro
    friend1: { voz: 'es-CR-JuanNeural',      tono: '+0Hz',  velocidad: '+0%' },   // Guardia
    friend2: { voz: 'es-PE-AlexNeural',      tono: '+10Hz', velocidad: '+6%' },   // Bufón
    friend3: { voz: 'es-VE-SebastianNeural', tono: '+12Hz', velocidad: '+3%' }    // Duende Amable
  },
  space: {
    villain: { voz: 'es-MX-JorgeNeural',     tono: '+10Hz', velocidad: '+4%' },   // Capitán Meteoro
    friend1: { voz: 'es-PE-AlexNeural',      tono: '+14Hz', velocidad: '+4%' },   // Robi
    friend2: { voz: 'es-CR-MariaNeural',     tono: '+12Hz', velocidad: '+3%' },   // Zuri
    friend3: { voz: 'es-EC-LuisNeural',      tono: '+6Hz',  velocidad: '+0%' }    // Cometa
  },
  ocean: {
    villain: { voz: 'es-VE-SebastianNeural', tono: '-2Hz',  velocidad: '-2%' },   // Pulpo Tinta
    friend1: { voz: 'es-US-AlonsoNeural',    tono: '+14Hz', velocidad: '+6%' },   // Delfi
    friend2: { voz: 'es-CO-GonzaloNeural',   tono: '+8Hz',  velocidad: '+4%' },   // Pinzas
    friend3: { voz: 'es-EC-LuisNeural',      tono: '+12Hz', velocidad: '+3%' }    // Pulpi
  },
  dinos: {
    villain: { voz: 'es-MX-JorgeNeural',     tono: '+6Hz',  velocidad: '+4%' },   // Pterodáctilo Ladrón
    friend1: { voz: 'es-CR-JuanNeural',      tono: '-6Hz',  velocidad: '-6%' },   // Cuello Largo
    friend2: { voz: 'es-PE-AlexNeural',      tono: '+12Hz', velocidad: '+6%' },   // Pinchos
    friend3: { voz: 'es-VE-PaolaNeural',     tono: '+12Hz', velocidad: '+3%' }    // Plumi
  },
  robots: {
    villain: { voz: 'es-EC-LuisNeural',      tono: '+14Hz', velocidad: '+8%' },   // Glitch
    friend1: { voz: 'es-CO-GonzaloNeural',   tono: '+10Hz', velocidad: '+4%' },   // Cable
    friend2: { voz: 'es-CR-MariaNeural',     tono: '+14Hz', velocidad: '+6%' },   // Zumbi
    friend3: { voz: 'es-VE-SebastianNeural', tono: '+4Hz',  velocidad: '+0%' }    // Antivirus
  },
  jungle: {
    villain: { voz: 'es-PE-CamilaNeural',    tono: '-2Hz',  velocidad: '-4%' },   // Serpiente Silbona
    friend1: { voz: 'es-PE-AlexNeural',      tono: '+14Hz', velocidad: '+6%' },   // Jaguarcito
    friend2: { voz: 'es-MX-JorgeNeural',     tono: '-6Hz',  velocidad: '-25%' },  // Lento
    friend3: { voz: 'es-CR-MariaNeural',     tono: '+8Hz',  velocidad: '+0%' }    // Silvia
  },
  candy: {
    villain: { voz: 'es-CR-JuanNeural',      tono: '-4Hz',  velocidad: '+0%' },   // Ácido
    friend1: { voz: 'es-US-AlonsoNeural',    tono: '+14Hz', velocidad: '+8%' },   // Jengi
    friend2: { voz: 'es-CO-SalomeNeural',    tono: '+14Hz', velocidad: '+0%' },   // Nube
    friend3: { voz: 'es-VE-PaolaNeural',     tono: '+10Hz', velocidad: '+3%' }    // Limonada
  }
};
const AMIGOS = ['friend1', 'friend2', 'friend3'];
const JUEGOS = ['classic', 'catch', 'race', 'find', 'memory', 'notx', 'ax'];

// 1. Leer los mundos (solo hace falta lo que pasan a registrarMundo)
const mundos = {};
const sandbox = { registrarMundo: (key, m) => { mundos[key] = m; } };
vm.createContext(sandbox);
for (const f of ['superheroes', 'dragones', 'reino_magico', 'espacio', 'oceano', 'dinosaurios', 'robots', 'selva', 'dulces']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'juego/modos/historia/mundos', f + '.js'), 'utf8'), sandbox);
}

// 2. Todos los textos posibles de cada mundo (los mismos ids que usa chapterLine en juego/nucleo/mundos.js),
// con la voz de quien lo dice: el protagonista, o el villano / el amigo ('dist_<nombre>', distractores)
function textos(key, m) {
  const st = m.story, yo = VOCES[key], t = {};
  st.chapters.forEach((ch, i) => { t[String(i + 1)] = [ch.line, yo]; });
  t.end = [st.ending, yo];
  // pantalla de "¡Mundo desbloqueado!" (igual que unlockLine en juego/nucleo/mundos.js)
  t.unlock = ['¡Llegaste a ' + m.theme.label + '! ' + st.intro + '¿Me ayudas?', yo];
  JUEGOS.forEach(mg => {
    t[mg] = [st.mgLines[mg], yo];
    t['intro_' + mg] = [st.intro + st.mgLines[mg], yo];
  });
  if (st.bossLine) t.boss = [st.bossLine, yo];
  // niveles de personajes (el villano entre los amigos): 'cast_race', y en el capítulo 1 'intro_cast_race'
  Object.entries(st.mgLinesCast || {}).forEach(([mg, line]) => {
    if (line.includes('{pista}')) {
      // Pista: una versión por cada amigo que puede ser la pista ('cast_ax_friend2'...)
      (st.companions || []).filter(c => c.role !== 'villain').forEach(c => {
        const l = line.split('{pista}').join(c.the || c.name).replace(/\bde el /g, 'del ');   // "de el Hada" → "del Hada"
        t['cast_' + mg + '_' + c.role] = [l, yo];
        t['intro_cast_' + mg + '_' + c.role] = [st.intro + l, yo];
      });
      return;
    }
    t['cast_' + mg] = [line, yo];
    t['intro_cast_' + mg] = [st.intro + line, yo];
  });
  const reparto = VOCES_REPARTO[key];
  // quien presenta cada capítulo: 'comp_1' ... 'comp_4'
  (st.companions || []).forEach((c, i) => { t['comp_' + (i + 1)] = [c.line, reparto[c.role]]; });
  // distractores, una frase por capítulo: 'dist_risa_c2' (villano o un amigo en particular, capítulo 2) ·
  // 'dist_ayuda_c2_friend3' (who: 'friend' = cada amigo con su propio texto)
  Object.entries((m.distractors || {}).voices || {}).forEach(([name, v]) => {
    if (v.who === 'friend') AMIGOS.forEach(f => v.text[f].forEach((s, k) => { t['dist_' + name + '_c' + (k + 1) + '_' + f] = [s, reparto[f]]; }));
    else v.text.forEach((s, k) => { t['dist_' + name + '_c' + (k + 1)] = [s, reparto[v.who]]; });
  });
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
  for (const [id, [texto, v]] of Object.entries(textos(key, mundos[key]))) {
    const file = path.join(dir, id + '.mp3');
    const firma = crypto.createHash('md5').update(v.voz + v.tono + v.velocidad + texto).digest('hex').slice(0, 10);
    todos[key][id] = { texto, firma };
    if (!(fs.existsSync(file) && antes[key] && antes[key][id] && antes[key][id].firma === firma)) {
      // el servicio a veces falla por un momento ("No audio was received"): se reintenta 3 veces antes de rendirse
      let r;
      for (let intento = 1; intento <= 3; intento++) {
        r = spawnSync(cmd[0], cmd.slice(1).concat(['--voice', v.voz, '--pitch=' + v.tono, '--rate=' + v.velocidad,
          '--text', texto, '--write-media', file]), { encoding: 'utf8' });
        if (r.status === 0) break;
        spawnSync(process.execPath, ['-e', 'setTimeout(()=>{},' + 3000 * intento + ')']);   // espera antes de reintentar
      }
      if (r.status !== 0) { console.error('No se pudo grabar', key, id, String(r.stderr || r.error).trim().split(String.fromCharCode(10)).pop()); process.exit(1); }
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
