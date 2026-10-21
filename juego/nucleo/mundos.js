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
// Los capítulos 1 a 4 de cada mundo traen los juegos en orden aleatorio (siempre con Memoria), y el jefe final
// (que tiene 2 fases) empieza con el juego que quedó por fuera: así salen los 5 juegos en cada mundo.
// La dificultad la pone el capítulo (nivel 1, 2, 3, 4 y 6 el jefe), no el juego. El orden se guarda para que
// el mapa no cambie mientras el niño avanza, y se vuelve a sortear cuando vence al jefe final.
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
// Fases del jefe final: primero el juego que no salió en los capítulos y luego la persecución (Carrera).
// Si el que faltó es Atrapa o Carrera, queda como siempre: atrapar con la red y perseguir.
function bossPhases(theme) {
  const left = ['classic', 'catch', 'race', 'find'].find(g => !chapterGames(theme).includes(g));
  const games = left === 'classic' || left === 'find' ? [left, 'race'] : ['catch', 'race'];
  const boss = STORY[theme].chapters.find(c => c.boss);
  return boss.phases.map((p, k) => ({ mg: games[k], sec: p.sec }));
}
function newChapterOrder(theme) {
  const all = store.get('cpt_order', {});
  delete all[theme];
  store.set('cpt_order', all);
}
// Lo que dice el personaje al empezar el capítulo, y el nombre de su audio (ver herramientas/generar_voces.js):
// '1'...'5' = texto original del capítulo · 'race' = texto del juego · 'intro_race' = saludo + texto del juego
// (capítulo 1) · 'boss_find' = jefe final que empieza con otro juego
function chapterLine(theme, i) {
  const st = STORY[theme], ch = st.chapters[i];
  if (ch.boss) {
    const first = bossPhases(theme)[0].mg;
    return first === 'catch' ? { text: ch.line, voice: String(i + 1) } : { text: st.bossLines[first], voice: 'boss_' + first };
  }
  const mg = chapterGame(theme, i);
  if (mg === ch.mg) return { text: ch.line, voice: String(i + 1) };
  return i === 0 ? { text: st.intro + st.mgLines[mg], voice: 'intro_' + mg } : { text: st.mgLines[mg], voice: mg };
}
// Empieza un capítulo o nivel: Memoria tiene su propia escena
function startMinigame(scene, data) {
  scene.scene.start(data.minigame === 'memory' ? 'Memory' : 'Game', data);
}

const hexColor = n => '#' + n.toString(16).padStart(6, '0');
