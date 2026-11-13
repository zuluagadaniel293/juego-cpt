// Guardado en el navegador: jugadores, récords del Desafío y estrellas de la Historia.

// ======================= GUARDADO (navegador) =======================
// rawStore: claves tal cual. store: claves del jugador actual (cada niño tiene su propio progreso:
// 'cpt_story' del jugador 3 se guarda como 'cpt_p3_story'). Unas pocas claves son del equipo, no de un jugador.
const rawStore = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },   // false = no cupo
  del(k) { try { localStorage.removeItem(k); } catch (e) { /* sin guardado disponible */ } }
};
const SHARED_KEYS = ['cpt_players', 'cpt_player', 'cpt_unlock_all'];
const playerKey = (id, k) => 'cpt_p' + id + '_' + k.replace(/^cpt_/, '');
const scopedKey = k => (SHARED_KEYS.includes(k) || !currentPlayerId() ? k : playerKey(currentPlayerId(), k));
const store = {
  get: (k, d) => rawStore.get(scopedKey(k), d),
  set: (k, v) => rawStore.set(scopedKey(k), v)
};

// ---------- Jugadores: cada niño se registra con su nombre ----------
// { id, name, age, code: 'P01', created } · el código sirve para el estudio (CSV sin nombres si se quiere)
const getPlayers = () => rawStore.get('cpt_players', []);
const currentPlayerId = () => rawStore.get('cpt_player', null);
const currentPlayer = () => getPlayers().find(p => p.id === currentPlayerId()) || null;
function selectPlayer(id) { rawStore.set('cpt_player', id); }
function addPlayer(name, age) {
  const players = getPlayers();
  const id = players.reduce((m, p) => Math.max(m, p.id), 0) + 1;
  const p = { id, name: name.trim(), age: age || '', code: 'P' + String(id).padStart(2, '0'), created: Date.now() };
  if (!players.length) adoptOldProgress(id);
  players.push(p);
  rawStore.set('cpt_players', players);
  selectPlayer(id);
  return p;
}
// El primer jugador se queda con el progreso que ya había en este equipo (de antes de que existieran los jugadores)
function adoptOldProgress(id) {
  try {
    Object.keys(localStorage).filter(k => /^cpt_/.test(k) && !SHARED_KEYS.includes(k) && !/^cpt_p\d+_/.test(k))
      .forEach(k => { localStorage.setItem(playerKey(id, k), localStorage.getItem(k)); localStorage.removeItem(k); });
  } catch (e) { /* sin guardado disponible */ }
}
// Borra al jugador y todo lo suyo (desde el Panel del profesional)
function removePlayer(id) {
  try { Object.keys(localStorage).filter(k => k.startsWith('cpt_p' + id + '_')).forEach(k => localStorage.removeItem(k)); } catch (e) { /* nada */ }
  if (typeof deletePlayerLogs === 'function') deletePlayerLogs(id);   // y sus filas en IndexedDB (sesiones.js)
  rawStore.set('cpt_players', getPlayers().filter(p => p.id !== id));
  if (currentPlayerId() === id) rawStore.del('cpt_player');
}
const getRecords = () => store.get('cpt_records', {});           // { 'heroes_catch': 5, ... }
const getChallengeLevels = () => store.get('cpt_challenge_level', {}); // nivel en que va cada mundo+minijuego del Desafío
const getMemory = () => store.get('cpt_memory', {});             // { heroes: { fwd: 5, bwd: 4 }, ... } mejor secuencia en Memoria
const getStory =() => store.get('cpt_story', {});               // { heroes: [3,2,0,0,0], ... }
const chapterStars = theme => (getStory()[theme] || [0, 0, 0, 0, 0]);
// Estrellas mínimas para superar un capítulo de la Historia (y abrir el siguiente; en el jefe, el mundo siguiente).
// Igual que en el Desafío, donde con 2 estrellas se sube de nivel.
const PASS_STARS = 2;
const totalStars = () => Object.values(getStory()).reduce((a, arr) => a + arr.reduce((x, y) => x + y, 0), 0);

// Mundos que se abren de a uno: el primero siempre; cada uno de los demás, al vencer al jefe final (capítulo 5)
// del anterior con al menos PASS_STARS estrellas, en el orden del mapa. Un mundo donde el niño ya ganó estrellas sigue abierto.
// Lo que se abre en la Historia se abre también en Desafío, Memoria y Prueba fija: solo la Historia desbloquea mundos.
// En la Zona de adultos se pueden abrir todos (modo demostración), sin tocar el progreso del niño.
const unlockAll = () => store.get('cpt_unlock_all', false);
function previousWorld(theme) {
  const ks = Object.keys(THEMES), i = ks.indexOf(theme);
  return i > 0 ? ks[i - 1] : null;
}
function worldUnlocked(theme) {
  const prev = previousWorld(theme);
  return !prev || unlockAll() || chapterStars(prev)[4] >= PASS_STARS || chapterStars(theme).some(s => s > 0);
}
// Frase para cuando el niño toca un mundo cerrado
function lockedWorldHint(theme) {
  const prev = previousWorld(theme);
  return '¡Atrapa ' + THEMES[prev].villainObj + ' en ' + THEMES[prev].label + ' para abrir este mundo!';
}
