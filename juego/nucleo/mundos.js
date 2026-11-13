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
// Menos uno y Pista); no tienen que salir todos. Capítulos 1 a 4: un juego distinto cada uno. Nivel 5 (jefe final):
// 2 fases al azar entre los juegos donde se busca al villano entre sus amigos (Clásico, Atrapa, Carrera, Encuentra,
// Memoria), de preferencia los que no salieron en los capítulos. Así ningún mundo repite siempre lo mismo.
// La dificultad la pone el nivel (1, 2, 3, 4 y 6 el jefe), no el juego. El orden se guarda para que el mapa
// no cambie mientras el niño avanza, y se vuelve a sortear cuando vence al jefe final.
const STORY_GAMES = ['classic', 'catch', 'race', 'find', 'memory', 'notx', 'ax', 'dodge', 'path'];
const BOSS_GAMES = ['classic', 'catch', 'race', 'find', 'memory'];
const ORDER_KEY = 'cpt_order_v3';   // v3: el jefe también sortea sus 2 fases
function storyOrder(theme) {
  const all = store.get(ORDER_KEY, {});
  if (!all[theme] || !Array.isArray(all[theme].boss)) {
    const shuffle = a => Phaser.Utils.Array.Shuffle(a.slice());
    const chapters = shuffle(STORY_GAMES).slice(0, 4);
    const boss = shuffle(BOSS_GAMES.filter(g => !chapters.includes(g)))
      .concat(shuffle(BOSS_GAMES.filter(g => chapters.includes(g)))).slice(0, 2);
    all[theme] = { chapters, boss };
  }
  if (!Array.isArray(all[theme].chars)) {
    // en cada capítulo: ¿se busca la señal/objetivo de siempre o al villano entre los amigos (personajes)?
    // Al menos uno de cada tipo por mundo, el resto al azar.
    all[theme].chars = Phaser.Utils.Array.Shuffle([true, false, Math.random() < 0.5, Math.random() < 0.5]);
  }
  store.set(ORDER_KEY, all);
  return all[theme];
}
// ¿El capítulo i es de personajes (el villano escondido entre los amigos)?
function chapterChars(theme, i) {
  // en Esquiva (siempre lanza el villano) y en Camino no hay versión de personajes
  return !STORY[theme].chapters[i].boss && storyOrder(theme).chars[i] && !['dodge', 'path'].includes(storyOrder(theme).chapters[i]);
}
const chapterGames = theme => storyOrder(theme).chapters;
function chapterGame(theme, i) {
  return STORY[theme].chapters[i].boss ? null : chapterGames(theme)[i];
}
// Fases del jefe final: los 2 juegos sorteados, con la duración de cada fase
function bossPhases(theme) {
  const games = storyOrder(theme).boss;
  const boss = STORY[theme].chapters.find(c => c.boss);
  return boss.phases.map((p, k) => ({ mg: games[k], sec: p.sec }));
}
function newChapterOrder(theme) {
  const all = store.get(ORDER_KEY, {});
  delete all[theme];
  store.set(ORDER_KEY, all);
}
// Lo que dice el personaje al empezar el capítulo, y el nombre de su audio (ver herramientas/generar_voces.js):
// 'race' = frase del juego · 'cast_race' = la de personajes · 'boss' = jefe final.
// En el capítulo 1, antes suena el saludo del mundo (introLine), que se graba una sola vez.
function chapterLine(theme, i) {
  const st = STORY[theme], ch = st.chapters[i];
  if (ch.boss) return { text: st.bossLine, voice: 'boss' };
  const mg = chapterGame(theme, i);
  if (chapterChars(theme, i)) {   // nivel de personajes: el villano entre los amigos
    let line = st.mgLinesCast[mg], id = 'cast_' + mg;
    if (line.includes('{pista}')) {   // Pista: nombra al amigo que hace de pista en este capítulo
      const cue = axCueRole(theme, i), c = st.companions.find(k => k.role === cue);
      line = line.split('{pista}').join(c.the || c.name).replace(/\bde el /g, 'del ');   // "de el Hada" → "del Hada"
      id += '_' + cue;
    }
    return { text: line, voice: id };
  }
  return { text: st.mgLines[mg], voice: mg };
}
function introLine(theme) { return { text: STORY[theme].intro, voice: 'intro' }; }
// Los 3 que hablan en cada mundo: el protagonista, el villano y este amigo (el que el villano ataca y persigue)
function speakingFriend(theme) {
  const a = ((DISTRACTORS[theme] || {}).voices || {}).ayuda;
  return a ? a.who : 'friend1';
}
// Pista con personajes: la pista es el primer amigo que no es el compañero del capítulo (igual que en el juego)
function axCueRole(theme, i) {
  const c = (STORY[theme].companions || [])[i];
  const buddy = c && c.role !== 'villain' ? c.role : null;
  return ['friend1', 'friend2', 'friend3'].find(f => f !== buddy);
}
// Empieza un capítulo o nivel: Memoria tiene su propia escena
function startMinigame(scene, data) {
  scene.scene.start(data.minigame === 'memory' ? 'Memory' : 'Game', data);
}

const hexColor = n => '#' + n.toString(16).padStart(6, '0');
// El amigo que corre en la Carrera de cada mundo, persiguiendo para ayudar. No es el que el villano ataca y persigue
// (ese tiene sus propias escenas) ni el que se parece al villano (friend3, distractor difícil).
// Su pose corriendo es friendN_run en assets/manifest.js (si falta, corre con su imagen normal).
const RACE_HELPER = { heroes: 'friend2', fantasy: 'friend1', kingdom: 'friend2', space: 'friend2', ocean: 'friend2',
  dinos: 'friend2', robots: 'friend2', jungle: 'friend2', candy: 'friend2' };
function raceHelper(theme) { return RACE_HELPER[theme] || 'friend2'; }
// Mensaje de "¡Mundo desbloqueado!": el mismo en todos los mundos (un solo audio, en assets/voces/comunes)
function unlockLine() { return UNLOCK_LINE; }
