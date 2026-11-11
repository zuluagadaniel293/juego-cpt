// Voces con emoción (ElevenLabs, modelo Eleven v3) para lo que dicen el villano y los amigos durante el juego:
// "¡Ayuda!", risas, burlas y amenazas. Las explicaciones de los protagonistas siguen con generar_voces.js (gratis).
//
// Cuesta créditos de ElevenLabs (1 por carácter, etiquetas incluidas), así que NUNCA vuelve a generar una frase
// que ya existe: para rehacer una, borra su MP3 y corre el script de nuevo.
//
// Requiere la llave de API en herramientas/.elevenlabs_key (no se sube a GitHub) con permiso de "Texto a voz".
// Uso: node herramientas/generar_voces_elevenlabs.js            (genera lo que falte)
//      node herramientas/generar_voces_elevenlabs.js --costo    (solo cuenta los créditos, no genera nada)
//      node herramientas/generar_voces_elevenlabs.js --mapa     (no genera nada; solo actualiza voces_eleven.js)
//
// Genera assets/voces/<mundo>/eleven/<id>.mp3 y assets/voces_eleven.js (window.VOICES_ELEVEN). Las frases que aún
// no tienen versión de ElevenLabs suenan con la voz gratuita de generar_voces.js.

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

// Voces por defecto de ElevenLabs (una distinta por personaje)
const VOZ = {
  jessica: 'cgSgspJ2msm6clMCkdW9', laura: 'FGY2WhTYpPnrIDTdsKH5', matilda: 'XrExE9yKIg1WjnnlVkGX', aria: '9BWtsMINqrJLrRacOk9x',
  sarah: 'EXAVITQu4vr4xnSDxMaL', river: 'SAz9YHcvj6GT2YYXdXww', charlie: 'IKne3meq5aSn9XLyUdCD', will: 'bIHbv24MWmeRgasZH58o', liam: 'TX3LPaxmHKxFdv7VOQHJ',
  bill: 'pqHfZKP75CvOlQylNhV4', chris: 'iP95p4xoKVk53GoZ742B', eric: 'cjVigY5qzO86Huf0OWal', callum: 'N2lVS1w4EtoT3dr4eOWO',
  lily: 'pFZP5JQG7iQjIQuC4Bku', roger: 'CwhRBWXzGAHq8TQ4Fs17'
};

// Quién habla con qué voz en cada mundo (villano y los 3 amigos)
const REPARTO = {
  heroes:  { carpeta: 'superheroes',  villain: 'liam',    friend1: 'jessica', friend2: 'charlie', friend3: 'will' },
  fantasy: { carpeta: 'dragones',     villain: 'sarah',   friend1: 'laura',   friend2: 'bill',    friend3: 'matilda' },
  kingdom: { carpeta: 'reino_magico', villain: 'callum',  friend1: 'chris',   friend2: 'eric',    friend3: 'river' },
  space:   { carpeta: 'espacio',      villain: 'charlie', friend1: 'river',   friend2: 'lily',    friend3: 'will' },
  ocean:   { carpeta: 'oceano',       villain: 'roger',   friend1: 'laura',   friend2: 'eric',    friend3: 'chris' }
};
// Emoción de cada tipo de frase (etiqueta de Eleven v3 que va antes del texto)
const EMOCION = { risa: '[evil laugh]', burla: '[mischievously]', amenaza: '[menacing]', ayuda: '[scared]', alto: '[shouting]' };

// Los textos son los de distractors.voices de cada mundo (juego/modos/historia/mundos/), uno por capítulo:
// 'dist_risa_c2' = risa del villano en el capítulo 2 · 'dist_ayuda_c2_friend3' = "¡ayuda!" del amigo 3 en el capítulo 2
const vm = require('vm');
const mundos = {};
const sandbox = { registrarMundo: (key, m) => { mundos[key] = m; } };
vm.createContext(sandbox);
for (const f of Object.values(REPARTO)) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'juego/modos/historia/mundos', f.carpeta + '.js'), 'utf8'), sandbox);
}
// [mundo, carpeta, id, quién, voz, texto]
const FRASES = [];
for (const [key, r] of Object.entries(REPARTO)) {
  for (const [name, v] of Object.entries(mundos[key].distractors.voices)) {
    const add = (id, role, s) => FRASES.push([key, r.carpeta, id, role, r[role], EMOCION[name] + ' ' + s]);
    if (v.who === 'friend') ['friend1', 'friend2', 'friend3'].forEach(f => v.text[f].forEach((s, k) => add('dist_' + name + '_c' + (k + 1) + '_' + f, f, s)));
    else v.text.forEach((s, k) => add('dist_' + name + '_c' + (k + 1), v.who, s));
  }
}

const archivo = f => path.join('voces', f[1], 'eleven', f[2] + '.mp3');

(async () => {
  const faltan = FRASES.filter(f => !fs.existsSync(path.join(ROOT, 'assets', archivo(f))));
  const costo = faltan.reduce((n, f) => n + f[5].length, 0);
  console.log('Frases: ' + FRASES.length + ' · faltan: ' + faltan.length + ' · costo: ' + costo + ' créditos');
  if (process.argv.includes('--costo')) return;

  const key = process.argv.includes('--mapa') ? null : fs.readFileSync(path.join(__dirname, '.elevenlabs_key'), 'utf8').trim();
  for (const f of key ? faltan : []) {
    const out = path.join(ROOT, 'assets', archivo(f));
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const r = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + VOZ[f[4]] + '?output_format=mp3_44100_128', {
      method: 'POST', headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: f[5], model_id: 'eleven_v3', language_code: 'es' })
    });
    const buf = Buffer.from(await r.arrayBuffer());
    if (!r.ok) { console.error('No se pudo generar', f[3], f[2], r.status, buf.toString().slice(0, 300)); process.exit(1); }
    fs.writeFileSync(out, buf);
    console.log('generado', archivo(f), '(' + f[3] + ')');
  }

  // Qué archivos usa el juego (solo los que existen)
  const mapa = {};
  for (const f of FRASES) {
    const a = archivo(f);
    if (!fs.existsSync(path.join(ROOT, 'assets', a))) continue;
    ((mapa[f[0]] = mapa[f[0]] || {})[f[2]] = mapa[f[0]][f[2]] || []).push(a.split(path.sep).join('/'));
  }
  fs.writeFileSync(path.join(ROOT, 'assets/voces_eleven.js'),
    '// Generado por herramientas/generar_voces_elevenlabs.js: no editar a mano.\n' +
    '// Voces con emoción (ElevenLabs) de villanos y amigos. Si hay varias versiones, el juego elige una al azar.\n' +
    'window.VOICES_ELEVEN = ' + JSON.stringify(mapa, null, 2) + ';\n');
  console.log('Listo.');
})();
