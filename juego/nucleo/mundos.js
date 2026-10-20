// Registro de mundos. Cada archivo de modos/historia/mundos/ se agrega con registrarMundo().

const THEMES = {};         // colores y nombres de cada mundo
const STORY = {};          // historia y capítulos (niveles) de cada mundo
const CHAR_SVG = {};       // dibujo provisional del protagonista
const BACKDROPS = {};      // fondos provisionales de cada capítulo
const POWERS = {};         // poder del protagonista
const POWER_SOUNDS = {};   // sonido del poder
const PEOPLE = {};         // dibujos provisionales de villanos y amigos
const WORLD_TEXTURES = []; // funciones que dibujan el objetivo y los distractores de cada mundo
const DISTRACTORS = {};    // distractores del entorno (visuales en los bordes y sonidos) de cada mundo

function registrarMundo(key, m) {
  DISTRACTORS[key] = m.distractors || { visual: [], sounds: {} };
  THEMES[key] = m.theme;
  STORY[key] = m.story;
  CHAR_SVG[key] = m.charSvg;
  BACKDROPS[key] = m.backdrop;
  POWERS[key] = m.power;
  POWER_SOUNDS[key] = m.powerSound;
  Object.assign(PEOPLE, m.people || {});
  WORLD_TEXTURES.push(m.textures);
}

// ---------- Orden de los juegos en la Historia ----------
// Los capítulos 1 a 4 de cada mundo traen los juegos en orden aleatorio (siempre con Memoria).
// La dificultad la pone el capítulo (nivel 1, 2, 3, 4), no el juego. El orden se guarda para que el mapa
// no cambie mientras el niño avanza, y se vuelve a sortear cuando vence al jefe final.
function chapterGames(theme) {
  const all = store.get('cpt_order', {});
  if (!all[theme]) {
    const others = Phaser.Utils.Array.Shuffle(['classic', 'catch', 'race', 'find']).slice(0, 3);
    all[theme] = Phaser.Utils.Array.Shuffle(others.concat('memory'));
    store.set('cpt_order', all);
  }
  return all[theme];
}
function chapterGame(theme, i) {
  return STORY[theme].chapters[i].boss ? null : chapterGames(theme)[i];
}
function newChapterOrder(theme) {
  const all = store.get('cpt_order', {});
  delete all[theme];
  store.set('cpt_order', all);
}
// Lo que dice el personaje al empezar el capítulo. Si el juego es el original del capítulo, usa su texto
// y su voz grabada; si no, el texto de ese juego en el mundo (con la voz del navegador).
function chapterLine(theme, i) {
  const st = STORY[theme], ch = st.chapters[i], mg = chapterGame(theme, i);
  if (ch.boss || mg === ch.mg) return { text: ch.line, voice: i + 1 };
  return { text: (i === 0 ? st.intro : '') + st.mgLines[mg], voice: null };
}
// Empieza un capítulo o nivel: Memoria tiene su propia escena
function startMinigame(scene, data) {
  scene.scene.start(data.minigame === 'memory' ? 'Memory' : 'Game', data);
}

const hexColor =n => '#' + n.toString(16).padStart(6, '0');
