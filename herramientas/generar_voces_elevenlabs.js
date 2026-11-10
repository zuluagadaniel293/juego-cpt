// Voces con emoción (ElevenLabs, modelo Eleven v3) para lo que dicen el villano y los amigos durante el juego:
// "¡Ayuda!", risas, burlas y amenazas. Las explicaciones de los protagonistas siguen con generar_voces.js (gratis).
//
// Cuesta créditos de ElevenLabs (1 por carácter, etiquetas incluidas), así que NUNCA vuelve a generar una frase
// que ya existe: para rehacer una, borra su MP3 y corre el script de nuevo.
//
// Requiere la llave de API en herramientas/.elevenlabs_key (no se sube a GitHub) con permiso de "Texto a voz".
// Uso: node herramientas/generar_voces_elevenlabs.js            (genera lo que falte)
//      node herramientas/generar_voces_elevenlabs.js --costo    (solo cuenta los créditos, no genera nada)
//
// Genera assets/voces/<mundo>/eleven/<id>.mp3 y assets/voces_eleven.js (window.VOICES_ELEVEN). Si un id tiene
// varias versiones (por ejemplo dos risas), el juego elige una al azar cada vez.

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

// Voces por defecto de ElevenLabs (una distinta por personaje)
const VOZ = {
  jessica: 'cgSgspJ2msm6clMCkdW9', laura: 'FGY2WhTYpPnrIDTdsKH5', matilda: 'XrExE9yKIg1WjnnlVkGX', aria: '9BWtsMINqrJLrRacOk9x',
  sarah: 'EXAVITQu4vr4xnSDxMaL', river: 'SAz9YHcvj6GT2YYXdXww', charlie: 'IKne3meq5aSn9XLyUdCD', will: 'bIHbv24MWmeRgasZH58o', liam: 'TX3LPaxmHKxFdv7VOQHJ',
  bill: 'pqHfZKP75CvOlQylNhV4', chris: 'iP95p4xoKVk53GoZ742B', eric: 'cjVigY5qzO86Huf0OWal', callum: 'N2lVS1w4EtoT3dr4eOWO'
};

// [mundo, carpeta, id del juego, versión, quién, voz, texto]. Los ids son los de distractors.voices de cada mundo:
// dist_ayuda_friendN = "¡ayuda!" del amigo N (suena con su escena) · dist_risa, dist_burla, dist_amenaza = villano
const FRASES = [
  ['heroes', 'superheroes', 'dist_ayuda_friend1', 1, 'Capitana Estrella', 'jessica', '[scared] ¡Ay, no! [panicked] ¡Ayuda, Héroe Rayo! ¡Sombra me atrapó!'],
  ['heroes', 'superheroes', 'dist_ayuda_friend1', 2, 'Capitana Estrella', 'jessica', '[panicked] ¡Héroe Rayo, por aquí! ¡No puedo soltarme!'],
  ['heroes', 'superheroes', 'dist_ayuda_friend2', 1, 'Escudo Verde', 'charlie', '[scared] ¡Mi escudo no aguanta más! ¡Ayúdame!'],
  ['heroes', 'superheroes', 'dist_ayuda_friend3', 1, 'Héroe Noche', 'will', '[nervous] ¡Yo no soy Sombra! [panicked] ¡Socorro!'],
  ['heroes', 'superheroes', 'dist_risa', 1, 'Sombra', 'liam', '[evil laugh] ¡Ja, ja, ja! ¡Nunca me atraparás!'],
  ['heroes', 'superheroes', 'dist_risa', 2, 'Sombra', 'liam', '[laughs] ¡Jo, jo, jo! [whispers] Aquí estoy... ¿o no?'],
  ['heroes', 'superheroes', 'dist_burla', 1, 'Sombra', 'liam', '[sarcastic] ¡Mi señal está por todas partes!'],
  ['heroes', 'superheroes', 'dist_amenaza', 1, 'Sombra', 'liam', '[menacing] ¡Esta ciudad será mía!'],

  ['fantasy', 'dragones', 'dist_ayuda_friend1', 1, 'Hada del Bosque', 'laura', '[scared] ¡Ay, mis alas! [panicked] ¡Ayuda, Chispa!'],
  ['fantasy', 'dragones', 'dist_alto', 1, 'Hada del Bosque', 'laura', '[shouting] ¡Alto ahí, Morgana! ¡Deja a los dragones!'],
  ['fantasy', 'dragones', 'dist_ayuda_friend2', 1, 'Mago Abuelo', 'bill', '[scared] ¡Ay, ay, ay, mi barba! ¡Chispa, ayúdame!'],
  ['fantasy', 'dragones', 'dist_ayuda_friend3', 1, 'Hechicera Buena', 'matilda', '[panicked] ¡Morgana me quitó la varita! ¡Ayuda!'],
  ['fantasy', 'dragones', 'dist_risa', 1, 'Morgana', 'sarah', '[evil laugh] ¡Ja, ja, ja! ¡Jamás lo encontrarás!'],
  ['fantasy', 'dragones', 'dist_risa', 2, 'Morgana', 'sarah', '[giggles] ¡Ji, ji! ¡Mis hechizos nunca fallan!'],
  ['fantasy', 'dragones', 'dist_burla', 1, 'Morgana', 'sarah', '[whispers] ¿Buscas al dragón dorado? Yo sé dónde está...'],
  ['fantasy', 'dragones', 'dist_amenaza', 1, 'Morgana', 'sarah', '[menacing] ¡El bosque caerá bajo mi hechizo!'],

  ['kingdom', 'reino_magico', 'dist_ayuda_friend1', 1, 'Guardia', 'chris', '[shouting] ¡Alto ahí, duende! ¡Ayuda, majestad, se escapa!'],
  ['kingdom', 'reino_magico', 'dist_ayuda_friend2', 1, 'Bufón', 'eric', '[scared] ¡Esto no es un chiste! [panicked] ¡Ayuda, majestad!'],
  ['kingdom', 'reino_magico', 'dist_ayuda_friend3', 1, 'Duende Amable', 'river', '[nervous] ¡Yo soy el duende bueno! ¡Socorro!'],
  ['kingdom', 'reino_magico', 'dist_risa', 1, 'Duende Pícaro', 'callum', '[giggles] ¡Ji, ji, ji! ¡No me pueden atrapar!'],
  ['kingdom', 'reino_magico', 'dist_risa', 2, 'Duende Pícaro', 'callum', '[laughs] ¡Je, je! [whispers] ¿Dónde estaré?'],
  ['kingdom', 'reino_magico', 'dist_burla', 1, 'Duende Pícaro', 'callum', '[whispers] ¡Psst! ¡Por aquí! ¡No, por allá!'],
  ['kingdom', 'reino_magico', 'dist_amenaza', 1, 'Duende Pícaro', 'callum', '[mischievously] ¡Voy a esconder la corona!']
];

const archivo = f => path.join('voces', f[1], 'eleven', f[2] + (f[3] > 1 ? '_' + f[3] : '') + '.mp3');

(async () => {
  const faltan = FRASES.filter(f => !fs.existsSync(path.join(ROOT, 'assets', archivo(f))));
  const costo = faltan.reduce((n, f) => n + f[6].length, 0);
  console.log('Frases: ' + FRASES.length + ' · faltan: ' + faltan.length + ' · costo: ' + costo + ' créditos');
  if (process.argv.includes('--costo')) return;

  const key = fs.readFileSync(path.join(__dirname, '.elevenlabs_key'), 'utf8').trim();
  for (const f of faltan) {
    const out = path.join(ROOT, 'assets', archivo(f));
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const r = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + VOZ[f[5]] + '?output_format=mp3_44100_128', {
      method: 'POST', headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: f[6], model_id: 'eleven_v3', language_code: 'es' })
    });
    const buf = Buffer.from(await r.arrayBuffer());
    if (!r.ok) { console.error('No se pudo generar', f[4], f[2], r.status, buf.toString().slice(0, 300)); process.exit(1); }
    fs.writeFileSync(out, buf);
    console.log('generado', archivo(f), '(' + f[4] + ')');
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
