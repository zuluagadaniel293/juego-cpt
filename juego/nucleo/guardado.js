// Guardado en el navegador: récords del Desafío y estrellas de la Historia.

// ======================= GUARDADO (navegador) =======================
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin guardado disponible */ } }
};
const getRecords = () => store.get('cpt_records', {});           // { 'heroes_catch': 5, ... }
const getStory = () => store.get('cpt_story', {});               // { heroes: [3,2,0,0,0], ... }
const chapterStars = theme => (getStory()[theme] || [0, 0, 0, 0, 0]);
const totalStars = () => Object.values(getStory()).reduce((a, arr) => a + arr.reduce((x, y) => x + y, 0), 0);
