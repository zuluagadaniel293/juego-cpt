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
// Los 5 niveles de cada mundo sacan sus juegos al azar entre los 7 (Clásico, Atrapa, Carrera, Encuentra, Memoria,
// Menos uno y Pista); no tienen que salir todos. Capítulos 1 a 4: un juego distinto cada uno. Nivel 5 (jefe final,
// 2 fases): empieza con uno de los que no salieron y sirven para encontrar al villano entre sus amigos (Clásico,
// Atrapa o Encuentra) y termina persiguiéndolo (Carrera).
// La dificultad la pone el nivel (1, 2, 3, 4 y 6 el jefe), no el juego. El orden se guarda para que el mapa
// no cambie mientras el niño avanza, y se vuelve a sortear cuando vence al jefe final.
const STORY_GAMES = ['classic', 'catch', 'race', 'find', 'memory', 'notx', 'ax'];
const BOSS_FIRST = ['classic', 'catch', 'find'];
const ORDER_KEY = 'cpt_order_v2';   // v2: todos los juegos al azar (el orden anterior siempre traía Memoria)
function chapterGames(theme) {
  const all = store.get(ORDER_KEY, {});
  if (!all[theme] || !all[theme].boss) {
    const chapters = Phaser.Utils.Array.Shuffle(STORY_GAMES.slice()).slice(0, 4);
    const rest = BOSS_FIRST.filter(g => !chapters.includes(g));
    all[theme] = { chapters, boss: rest.length ? Phaser.Utils.Array.GetRandom(rest) : Phaser.Utils.Array.GetRandom(BOSS_FIRST) };
    store.set(ORDER_KEY, all);
  }
  return all[theme].chapters;
}
function chapterGame(theme, i) {
  return STORY[theme].chapters[i].boss ? null : chapterGames(theme)[i];
}
// Fases del jefe final: el juego sorteado para él y luego la persecución (Carrera)
function bossPhases(theme) {
  chapterGames(theme);
  const first = store.get(ORDER_KEY, {})[theme].boss;
  const boss = STORY[theme].chapters.find(c => c.boss);
  return boss.phases.map((p, k) => ({ mg: k === 0 ? first : 'race', sec: p.sec }));
}
function newChapterOrder(theme) {
  const all = store.get(ORDER_KEY, {});
  delete all[theme];
  store.set(ORDER_KEY, all);
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
