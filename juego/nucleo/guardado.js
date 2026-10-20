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
const totalStars = () => Object.values(getStory()).reduce((a, arr) => a + arr.reduce((x, y) => x + y, 0), 0);
