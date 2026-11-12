// Pone en el juego las grabaciones elegidas (de herramientas/sonidos_candidatos, ver buscar_sonidos.js):
// - una "característica" por sonido (la que suena cuando aparece el personaje u objeto)
// - las demás opciones buenas de cada mundo, como ambientación (suenan bajito de vez en cuando)
// Copia los MP3 a assets/sonidos/ y escribe assets/sonidos.js. El volumen lo empareja el juego al reproducirlos.
// Uso: node herramientas/elegir_sonidos.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.join(__dirname, '..');
const CAND = path.join(__dirname, 'sonidos_candidatos');

// Opción característica de cada sonido (1, 2 o 3).
// gato, pájaro, murciélago y rana: elegidos por el equipo; el resto, las grabaciones más cortas y suaves.
const ELEGIDO = {
  gato: 3, pajaro: 2, murcielago: 2, rana: 1,
  ardilla: 3, raton: 2, guacamaya: 3, mono: 1, ballena: 2, libelula: 1, sirena: 2, bocina: 2, silbato: 3, campanas: 2,
  puerta: 3, reloj: 2, lluvia: 1, aspiradora: 1, pajaros: 3, mariposa: 1, viento: 2, rugido: 3, libro_volador: 2,
  escoba_magica: 3, cohete: 2, satelite: 3, rover: 1, radio: 1, alarma: 3, motor: 2, medusa: 1, banco_de_peces: 2,
  estrella_de_mar: 2, burbujas: 1, corriente: 2, arqueopterix: 1, lagartija: 1, pisada: 3, volcan: 2, engranaje: 1,
  avion_de_papel: 2, pitido: 1, maquina: 1, mariposa_azul: 3, tambor: 1, caramelo: 1, globo_chicle: 1, osito_verde: 1,
  campanita: 2, burbujeo: 1, crujido: 1,
  // "error": una falla de computador, no un zumbador (sonaría a "respuesta incorrecta" y confundiría al niño)
  error: 3
};
// El avión no tiene grabación: se queda el hecho con código, que pasa de un lado al otro (juego/nucleo/sonido.js)
// Opciones que no sirven ni para ambientar (molestas, fuertes o que no tienen que ver)
const DESCARTAR = ['corriente_1', 'crujido_3', 'alarma_1', 'sirena_3', 'silbato_2', 'banco_de_peces_1'];

// sonidos de cada mundo (lo que cruza por los bordes y los sonidos sueltos)
const mundos = {};
const sb = { registrarMundo: (k, m) => { mundos[k] = m; } };
vm.createContext(sb);
for (const f of ['superheroes', 'dragones', 'reino_magico', 'espacio', 'oceano', 'dinosaurios', 'robots', 'selva', 'dulces']) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'juego/modos/historia/mundos', f + '.js'), 'utf8'), sb);
}
const fichas = JSON.parse(fs.readFileSync(path.join(CAND, 'candidatos.json'), 'utf8'));
// Lo que el equipo eligió en herramientas/probar_sonidos.html (botón "Guardar mi elección"): manda sobre lo de arriba.
// Formato: { gato: { principal: 3, quitar: [1] }, ... }
const ELECCION_PATH = path.join(CAND, 'eleccion.json');
const ELECCION = fs.existsSync(ELECCION_PATH) ? JSON.parse(fs.readFileSync(ELECCION_PATH, 'utf8')) : {};
for (const [name, e] of Object.entries(ELECCION)) {
  if (e.principal) ELEGIDO[name] = e.principal;
  for (let i = 1; i <= 3; i++) {
    const id = name + '_' + i, k = DESCARTAR.indexOf(id);
    if ((e.quitar || []).includes(i)) { if (k < 0) DESCARTAR.push(id); } else if (k >= 0) DESCARTAR.splice(k, 1);
  }
}
const out = path.join(ROOT, 'assets/sonidos'), outAmb = path.join(out, 'ambiente');
fs.mkdirSync(outAmb, { recursive: true });
const sfx = {}, ambient = {}, creditos = [], estado = {};
for (const [key, m] of Object.entries(mundos)) {
  const names = m.distractors.visual.map(v => v.name).concat(Object.keys(m.distractors.sounds || {}));
  ambient[key] = [];
  for (const name of names) {
    // estado de cada opción, para la página de prueba (principal / fondo / quitar)
    estado[name] = { principal: ELEGIDO[name] || 0, quitar: (fichas[name] || []).map((o, i) => i + 1).filter(i => DESCARTAR.includes(name + '_' + i)) };
    const opts = fichas[name] || [];
    const pick = ELEGIDO[name] || 0;
    opts.forEach((o, i) => {
      const id = name + '_' + (i + 1);
      if (i + 1 === pick) {
        fs.copyFileSync(path.join(CAND, o.file), path.join(out, name + '.mp3'));
        sfx[name] = 'sonidos/' + name + '.mp3';
      } else if (!DESCARTAR.includes(id)) {
        const file = key + '_' + id + '.mp3';
        fs.copyFileSync(path.join(CAND, o.file), path.join(outAmb, file));
        ambient[key].push({ name, file: 'sonidos/ambiente/' + file });
      } else return;
      creditos.push(o.url + '  ' + o.name + ' (' + o.autor + ', ' + o.licencia + ')');
    });
  }
}
fs.writeFileSync(path.join(ROOT, 'assets/sonidos.js'),
  '// Generado por herramientas/elegir_sonidos.js: no editar a mano.\n' +
  '// Grabaciones reales con licencia libre (Freesound, CC0). Si un sonido no está aquí, se usa el hecho con código.\n' +
  '// SFX_FILES: el sonido característico de cada personaje u objeto · SFX_AMBIENT: los de ambientación de cada mundo\n' +
  'window.SFX_FILES = ' + JSON.stringify(sfx, null, 2) + ';\n' +
  'window.SFX_AMBIENT = ' + JSON.stringify(ambient, null, 2) + ';\n');
fs.writeFileSync(path.join(out, 'FUENTES.txt'), 'Sonidos de Freesound.org con licencia Creative Commons 0 (uso libre, sin dar créditos).\n\n' + [...new Set(creditos)].join('\n') + '\n');
fs.writeFileSync(path.join(CAND, 'eleccion_actual.json'), JSON.stringify(estado, null, 1) + '\n');
console.log('característicos:', Object.keys(sfx).length, '· ambientación:', Object.values(ambient).reduce((n, a) => n + a.length, 0));
