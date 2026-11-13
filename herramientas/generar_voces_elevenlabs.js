// Voces con emoción (ElevenLabs, modelo Eleven v3) para TODO lo que dicen los personajes. Las mismas frases que
// graba gratis generar_voces.js; mientras una frase no tenga versión de ElevenLabs, suena la gratuita.
//
// Solo hablan 3 personajes por mundo: el protagonista, el villano y el amigo al que el villano ataca.
// Lo que se repite entre mundos se graba una sola vez (assets/voces/comunes): el mensaje de "¡Mundo desbloqueado!",
// las risas de los villanos y los "¡ayuda!" de los amigos (juego/nucleo/voces_comunes.js).
//
// Cuesta créditos de ElevenLabs (1 por carácter, etiquetas de emoción incluidas), así que NUNCA vuelve a generar
// una frase que ya existe con el mismo texto y voz. Si el texto o la voz cambian, la cuenta como pendiente (y su
// costo) y la regraba. Para rehacer una igual, borra su MP3.
//
// Requiere la llave de API en herramientas/.elevenlabs_key (no se sube a GitHub) con permiso de "Texto a voz".
// Uso: node herramientas/generar_voces_elevenlabs.js --costo    (solo cuenta los créditos, no genera nada)
//      node herramientas/generar_voces_elevenlabs.js --lista    (como --costo, y además lista cada frase pendiente)
//      node herramientas/generar_voces_elevenlabs.js --mapa     (no genera nada; solo actualiza voces_eleven.js)
//      node herramientas/generar_voces_elevenlabs.js            (genera lo que falte: GASTA CRÉDITOS)
//
// Genera assets/voces/<carpeta>/eleven/<id>.mp3, assets/voces_eleven.js (window.VOICES_ELEVEN) y
// herramientas/voces_eleven_textos.json (con qué texto y voz se grabó cada archivo).

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const ROOT = path.join(__dirname, '..');

// Voces por defecto de ElevenLabs
const VOZ = {
  jessica: 'cgSgspJ2msm6clMCkdW9', laura: 'FGY2WhTYpPnrIDTdsKH5', matilda: 'XrExE9yKIg1WjnnlVkGX', aria: '9BWtsMINqrJLrRacOk9x',
  sarah: 'EXAVITQu4vr4xnSDxMaL', river: 'SAz9YHcvj6GT2YYXdXww', charlie: 'IKne3meq5aSn9XLyUdCD', will: 'bIHbv24MWmeRgasZH58o', liam: 'TX3LPaxmHKxFdv7VOQHJ',
  bill: 'pqHfZKP75CvOlQylNhV4', chris: 'iP95p4xoKVk53GoZ742B', eric: 'cjVigY5qzO86Huf0OWal', callum: 'N2lVS1w4EtoT3dr4eOWO',
  lily: 'pFZP5JQG7iQjIQuC4Bku', roger: 'CwhRBWXzGAHq8TQ4Fs17'
};

// Quién habla con qué voz en cada mundo: protagonista, villano y el amigo que habla (el de voices.ayuda.who)
const REPARTO = {
  heroes:  { carpeta: 'superheroes',  hero: 'eric',    villain: 'liam',    friend: 'jessica' },   // Héroe Rayo · Sombra · Capitana Estrella
  fantasy: { carpeta: 'dragones',     hero: 'lily',    villain: 'sarah',   friend: 'bill' },      // Chispa · Morgana · Mago Abuelo
  kingdom: { carpeta: 'reino_magico', hero: 'matilda', villain: 'callum',  friend: 'chris' },     // Reina Luna · Duende Pícaro · Guardia
  space:   { carpeta: 'espacio',      hero: 'aria',    villain: 'charlie', friend: 'river' },     // Nova · Capitán Meteoro · Robi
  ocean:   { carpeta: 'oceano',       hero: 'jessica', villain: 'roger',   friend: 'eric' },      // Coral · Pulpo Tinta · Delfi
  dinos:   { carpeta: 'dinosaurios',  hero: 'will',    villain: 'callum',  friend: 'bill' },      // Tito · Pterodáctilo Ladrón · Cuello Largo
  robots:  { carpeta: 'robots',       hero: 'liam',    villain: 'charlie', friend: 'chris' },     // Chip · Glitch · Cable
  jungle:  { carpeta: 'selva',        hero: 'laura',   villain: 'sarah',   friend: 'river' },     // Kiara · Serpiente Silbona · Jaguarcito
  candy:   { carpeta: 'dulces',       hero: 'charlie', villain: 'roger',   friend: 'will' }       // Gomi · Ácido · Jengi
};
// Frases comunes: voz de cada una, en orden (las primeras risas ya están grabadas con estas voces)
const VOCES_POOL = {
  risa_m: ['liam', 'liam', 'callum', 'callum', 'roger'],
  risa_f: ['sarah', 'sarah', 'matilda'],
  ayuda_m: ['will', 'eric', 'chris', 'bill'],
  ayuda_f: ['jessica', 'laura', 'aria']
};
const VOZ_UNLOCK = 'lily';
// Emoción (etiqueta de Eleven v3 que va antes del texto)
const EMOCION = { risa: '[evil laugh]', burla: '[mischievously]', amenaza: '[menacing]', ayuda: '[scared]', unlock: '[excited]' };
const JUEGOS = ['classic', 'catch', 'race', 'find', 'memory', 'notx', 'ax', 'dodge', 'path'];

// Leer los mundos y las frases comunes
const mundos = {};
const sandbox = { registrarMundo: (key, m) => { mundos[key] = m; } };
vm.createContext(sandbox);
for (const f of Object.values(REPARTO)) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'juego/modos/historia/mundos', f.carpeta + '.js'), 'utf8'), sandbox);
}
vm.runInContext(fs.readFileSync(path.join(ROOT, 'juego/nucleo/voces_comunes.js'), 'utf8') +
  '\nthis.UNLOCK_LINE = UNLOCK_LINE; this.VOICE_POOLS = VOICE_POOLS;', sandbox);

// [grupo del mapa, carpeta, id, quién (para mostrar), voz, texto a enviar]
const FRASES = [];
for (const [key, r] of Object.entries(REPARTO)) {
  const st = mundos[key].story, add = (id, who, s, tag) => FRASES.push([key, r.carpeta, id, who, r[who], (tag ? tag + ' ' : '') + s]);
  add('intro', 'hero', st.intro);
  JUEGOS.forEach(mg => add(mg, 'hero', st.mgLines[mg]));
  Object.entries(st.mgLinesCast || {}).forEach(([mg, line]) => {
    if (!line.includes('{pista}')) return add('cast_' + mg, 'hero', line);
    st.companions.filter(c => c.role !== 'villain').forEach(c =>
      add('cast_' + mg + '_' + c.role, 'hero', line.split('{pista}').join(c.the || c.name).replace(/\bde el /g, 'del ')));
  });
  add('boss', 'hero', st.bossLine);
  add('end', 'hero', st.ending);
  st.companions.forEach((c, i) => { if (c.line) add('comp_' + (i + 1), c.role === 'villain' ? 'villain' : 'friend', c.line, c.role === 'villain' ? EMOCION.burla : ''); });
  Object.entries(mundos[key].distractors.voices).forEach(([name, v]) =>
    (v.text || []).forEach((s, k) => add('dist_' + name + '_' + (k + 1), 'villain', s, EMOCION[name])));
}
FRASES.push(['comunes', 'comunes', 'unlock', 'desbloqueo', VOZ_UNLOCK, EMOCION.unlock + ' ' + sandbox.UNLOCK_LINE]);
Object.entries(sandbox.VOICE_POOLS).forEach(([pool, list]) => list.forEach((s, k) =>
  FRASES.push(['comunes', 'comunes', 'pool_' + pool + '_' + (k + 1), pool, VOCES_POOL[pool][k % VOCES_POOL[pool].length],
    EMOCION[pool.split('_')[0]] + ' ' + s])));

const archivo = f => path.join('voces', f[1], 'eleven', f[2] + '.mp3');
const firmasPath = path.join(__dirname, 'voces_eleven_textos.json');
const firmas = fs.existsSync(firmasPath) ? JSON.parse(fs.readFileSync(firmasPath, 'utf8')) : {};
const firma = f => crypto.createHash('md5').update(f[4] + '|' + f[5]).digest('hex').slice(0, 10);
const clave = f => archivo(f).split(path.sep).join('/');
// pendiente: no existe, o se grabó con otro texto o voz (si no hay registro de cómo se grabó, se da por bueno)
const pendiente = f => !fs.existsSync(path.join(ROOT, 'assets', archivo(f))) || (firmas[clave(f)] && firmas[clave(f)].firma !== firma(f));

(async () => {
  const faltan = FRASES.filter(pendiente);
  const costo = faltan.reduce((n, f) => n + f[5].length, 0);
  const total = FRASES.reduce((n, f) => n + f[5].length, 0);
  console.log('Frases: ' + FRASES.length + ' (' + total + ' caracteres) · faltan: ' + faltan.length + ' · costo: ' + costo + ' créditos');
  if (process.argv.includes('--lista')) faltan.forEach(f => console.log('  ' + f[1] + '/' + f[2] + ' [' + f[3] + ', ' + f[4] + '] ' + f[5]));
  if (process.argv.includes('--costo') || process.argv.includes('--lista')) return;

  const key = process.argv.includes('--mapa') ? null : fs.readFileSync(path.join(__dirname, '.elevenlabs_key'), 'utf8').trim();
  for (const f of key ? faltan : []) {
    const out = path.join(ROOT, 'assets', archivo(f));
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const r = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + VOZ[f[4]] + '?output_format=mp3_44100_128', {
      method: 'POST', headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: f[5], model_id: 'eleven_v3', language_code: 'es' })
    });
    const buf = Buffer.from(await r.arrayBuffer());
    if (!r.ok) { console.error('No se pudo generar', f[3], f[2], r.status, buf.toString().slice(0, 300)); break; }
    fs.writeFileSync(out, buf);
    firmas[clave(f)] = { texto: f[5], voz: f[4], firma: firma(f) };
    fs.writeFileSync(firmasPath, JSON.stringify(firmas, null, 2) + '\n');   // se guarda después de cada una
    console.log('generado', clave(f), '(' + f[3] + ')');
  }

  // Qué archivos usa el juego (solo los que existen con su texto actual), y registro de cómo se grabó cada uno
  const mapa = {};
  for (const f of FRASES) {
    if (pendiente(f)) continue;
    if (!firmas[clave(f)]) firmas[clave(f)] = { texto: f[5], voz: f[4], firma: firma(f) };
    ((mapa[f[0]] = mapa[f[0]] || {})[f[2]] = mapa[f[0]][f[2]] || []).push(clave(f));
  }
  // el mensaje de "¡Mundo desbloqueado!" es el mismo en todos los mundos
  if (mapa.comunes && mapa.comunes.unlock) Object.keys(REPARTO).forEach(k => { (mapa[k] = mapa[k] || {}).unlock = mapa.comunes.unlock; });
  fs.writeFileSync(firmasPath, JSON.stringify(firmas, null, 2) + '\n');
  fs.writeFileSync(path.join(ROOT, 'assets/voces_eleven.js'),
    '// Generado por herramientas/generar_voces_elevenlabs.js: no editar a mano.\n' +
    '// Voces con emoción (ElevenLabs). Si hay varias versiones, el juego elige una al azar.\n' +
    'window.VOICES_ELEVEN = ' + JSON.stringify(mapa, null, 2) + ';\n');
  console.log('Listo.');
})();
