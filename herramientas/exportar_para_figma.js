// Exporta todo lo que usa el juego a la carpeta para_figma/, un archivo por personaje, objeto y fondo.
// Requiere Node, Google Chrome y puppeteer-core (npm i puppeteer-core).
// Uso: servir el juego en http://localhost:8765 (python -m http.server 8765) y ejecutar: node herramientas/exportar_para_figma.js
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const ROOT = 'C:/Users/Daniel Zuluaga/OneDrive/juego-cpt/';
const OUT = ROOT + 'para_figma/';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const save = (rel, buf) => { fs.mkdirSync(path.dirname(OUT + rel), { recursive: true }); fs.writeFileSync(OUT + rel, buf); console.log('  ', rel); };
const copy = (src, rel) => save(rel, fs.readFileSync(ROOT + 'assets/' + src));

// ---------- SVG editables de las señales de Superhéroes (iguales a las del juego) ----------
const star = (cx, cy, R, r) => Array.from({ length: 10 }, (_, i) => {
  const a = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r : R;
  return (cx + d * Math.cos(a)).toFixed(1) + ',' + (cy + d * Math.sin(a)).toFixed(1);
}).join(' ');
const svg = b => '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">' + b + '</svg>';
const rombo = '<polygon id="rombo" points="80,6 154,80 80,154 6,80" fill="#7c3aed"/>';
const SVGS = {
  'superheroes/objetos/senal_de_sombra (objetivo).svg': svg(rombo +
    '<g id="antifaz"><ellipse cx="56" cy="80" rx="27" ry="17" fill="#0f0f1a"/><ellipse cx="104" cy="80" rx="27" ry="17" fill="#0f0f1a"/><rect x="56" y="70" width="48" height="16" fill="#0f0f1a"/>' +
    '<ellipse cx="56" cy="80" rx="11" ry="5" fill="#ffffff"/><ellipse cx="104" cy="80" rx="11" ry="5" fill="#ffffff"/></g>'),
  'superheroes/objetos/senal_capitan_estrella (distractor).svg': svg('<circle cx="80" cy="80" r="66" fill="#2563eb"/><polygon points="' + star(80, 84, 44, 18) + '" fill="#ffffff"/>'),
  'superheroes/objetos/senal_escudo_verde (distractor).svg': svg('<polygon points="22,18 138,18 138,80 80,150 22,80" fill="#16a34a"/><polygon points="80,40 116,80 94,80 94,116 66,116 66,80 44,80" fill="#ffffff"/>'),
  'superheroes/objetos/senal_rombo_estrella (distractor dificil).svg': svg(rombo + '<polygon points="' + star(80, 84, 36, 15) + '" fill="#ffffff"/>')
};

// ---------- Archivos reales (copiados tal cual de assets/) ----------
const REAL = [
  ['superheroes/heroe_rayo.png', 'superheroes/personajes/heroe_rayo (protagonista).png'],
  ['superheroes/sombra.png', 'superheroes/personajes/sombra (villano - jefe final).png'],
  ['superheroes/capitan_estrella.png', 'superheroes/personajes/capitan_estrella (amiga - distractor jefe).png'],
  ['superheroes/escudo_verde.png', 'superheroes/personajes/escudo_verde (amigo - distractor jefe).png'],
  ['superheroes/heroe_noche.png', 'superheroes/personajes/heroe_noche (distractor dificil jefe).png'],
  ['dragones/chispa_la_dragona.png', 'dragones/personajes/chispa_la_dragona (protagonista).png'],
  ['dragones/morgana_la_hechicera.png', 'dragones/personajes/morgana_la_hechicera (villana - jefe final).png'],
  ['dragones/hada_del_bosque.png', 'dragones/personajes/hada_del_bosque (amiga - distractor jefe).png'],
  ['dragones/mago_abuelo.png', 'dragones/personajes/mago_abuelo (amigo - distractor jefe).png'],
  ['dragones/dragon_bebe_dorado.png', 'dragones/objetos/dragon_bebe_dorado (objetivo).png'],
  ['dragones/dragon_bebe_rojo.png', 'dragones/objetos/dragon_bebe_rojo (distractor).png'],
  ['dragones/dragon_bebe_azul.png', 'dragones/objetos/dragon_bebe_azul (distractor).png'],
  ['dragones/dragon_bebe_amarillo_palido.png', 'dragones/objetos/dragon_bebe_amarillo_palido (distractor dificil).png'],
  ['dragones/fondo_1_nido.jpg', 'dragones/fondos/fondo_1_el_nido.jpg'],
  ['dragones/fondo_2_bosque.jpg', 'dragones/fondos/fondo_2_el_bosque.jpg'],
  ['reino_magico/hada_rosada_lumi.png', 'reino_magico/objetos/hada_rosada_lumi (objetivo).png'],
  ['reino_magico/hada_azul.png', 'reino_magico/objetos/hada_azul (distractor).png'],
  ['reino_magico/hada_verde.png', 'reino_magico/objetos/hada_verde (distractor).png'],
  ['reino_magico/hada_lila.png', 'reino_magico/objetos/hada_lila (distractor dificil).png'],
  ['reino_magico/fondo_1_jardin.jpg', 'reino_magico/fondos/fondo_1_el_jardin.jpg'],
  ['superheroes/avion.png', 'superheroes/distractores_entorno/avion (cruza arriba).png'],
  ['superheroes/pajaro.png', 'superheroes/distractores_entorno/pajaro (cruza arriba).png'],
  ['superheroes/gato.png', 'superheroes/distractores_entorno/gato (camina abajo).png'],
  ['dragones/mariposa.png', 'dragones/distractores_entorno/mariposa (cruza arriba).png'],
  ['dragones/murcielago.png', 'dragones/distractores_entorno/murcielago (cruza arriba).png'],
  ['dragones/ardilla.png', 'dragones/distractores_entorno/ardilla (camina abajo).png'],
  ['reino_magico/libro_volador.png', 'reino_magico/distractores_entorno/libro_volador (cruza arriba).png'],
  ['reino_magico/escoba_magica.png', 'reino_magico/distractores_entorno/escoba_magica (cruza arriba).png'],
  ['reino_magico/raton.png', 'reino_magico/distractores_entorno/raton (camina abajo).png']
];

// ---------- Dibujos que el juego genera (provisionales): se exportan desde el juego ----------
const TEXTURES = {
  'kingdom_villain': 'reino_magico/personajes/duende_picaro (villano - jefe final)_provisional.png',
  'kingdom_friend1': 'reino_magico/personajes/guardia (amigo - distractor jefe)_provisional.png',
  'kingdom_friend2': 'reino_magico/personajes/bufon (amigo - distractor jefe)_provisional.png',
  'basket': 'comunes/canasta (minijuego Atrapa).png',
  'net': 'comunes/red (jefe final).png',
  'fireball': 'comunes/efecto_bola_de_fuego (poder de Chispa).png',
  'magicstar': 'comunes/efecto_estrella_magica (poder de Reina Luna).png',
  'icon_map': 'comunes/icono_mapa (modo Historia).png',
  'icon_trophy': 'comunes/icono_trofeo (modo Desafio).png',
  'icon_lock': 'comunes/icono_candado.png',
  'icon_find': 'comunes/icono_lupa (minijuego Encuentra).png'
};
const BACKDROPS_OUT = {   // [mundo, índice de capítulo, carpeta]  (los que todavía no tienen imagen real)
  heroes: [[0, 'superheroes', 'el_centro'], [1, 'superheroes', 'barrio_norte'], [2, 'superheroes', 'el_puerto'], [3, 'superheroes', 'la_torre'], [4, 'superheroes', 'guarida_de_sombra']],
  fantasy: [[2, 'dragones', 'el_rio'], [3, 'dragones', 'la_cueva'], [4, 'dragones', 'el_volcan']],
  kingdom: [[1, 'reino_magico', 'la_cocina'], [2, 'reino_magico', 'la_biblioteca'], [3, 'reino_magico', 'la_torre'], [4, 'reino_magico', 'el_salon_del_trono']]
};

(async () => {
  console.log('SVG editables:');
  for (const [rel, s] of Object.entries(SVGS)) save(rel, s);
  console.log('Imágenes reales:');
  for (const [src, rel] of REAL) copy(src, rel);
  // Reina Luna sigue siendo el dibujo provisional en SVG: se exporta editable
  const reino = fs.readFileSync(ROOT + 'juego/modos/historia/mundos/reino_magico.js', 'utf8');
  save('reino_magico/personajes/reina_luna (protagonista)_provisional.svg', reino.match(/charSvg: '([^']+)'/)[1]);

  console.log('Dibujos y fondos generados por el juego:');
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
  const p = await b.newPage(); await p.setViewport({ width: 960, height: 540 });
  await p.goto('http://localhost:8765/index.html'); await sleep(2500);
  const data = await p.evaluate((texKeys, bds) => {
    const g = window.juego, out = {};
    for (const k of texKeys) out[k] = g.textures.getBase64(k);
    const scene = g.scene.getScene('Mode');
    for (const [theme, list] of Object.entries(bds)) for (const [idx] of list) {
      const gr = scene.make.graphics({ add: false });
      BACKDROPS[theme](gr, idx, new Phaser.Math.RandomDataGenerator([theme + idx]), 960, 540);
      const key = 'exp_' + theme + idx;
      gr.generateTexture(key, 960, 540); gr.destroy();
      out[key] = g.textures.getBase64(key);
    }
    return out;
  }, Object.keys(TEXTURES), BACKDROPS_OUT);
  const png = b64 => Buffer.from(b64.split(',')[1], 'base64');
  for (const [k, rel] of Object.entries(TEXTURES)) save(rel, png(data[k]));
  for (const [theme, list] of Object.entries(BACKDROPS_OUT))
    for (const [idx, dir, place] of list) save(dir + '/fondos/fondo_' + (idx + 1) + '_' + place + '_provisional.png', png(data['exp_' + theme + idx]));
  await b.close();
})();
