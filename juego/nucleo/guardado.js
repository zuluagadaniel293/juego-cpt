// Guardado en el navegador: récords del Desafío y estrellas de la Historia.

// ======================= GUARDADO (navegador) =======================
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin guardado disponible */ } }
};
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
