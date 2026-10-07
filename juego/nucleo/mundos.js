// Registro de mundos. Cada archivo de modos/historia/mundos/ se agrega con registrarMundo().

const THEMES = {};         // colores y nombres de cada mundo
const STORY = {};          // historia y capítulos (niveles) de cada mundo
const CHAR_SVG = {};       // dibujo provisional del protagonista
const BACKDROPS = {};      // fondos provisionales de cada capítulo
const POWERS = {};         // poder del protagonista
const POWER_SOUNDS = {};   // sonido del poder
const PEOPLE = {};         // dibujos provisionales de villanos y amigos
const WORLD_TEXTURES = []; // funciones que dibujan el objetivo y los distractores de cada mundo

function registrarMundo(key, m) {
  THEMES[key] = m.theme;
  STORY[key] = m.story;
  CHAR_SVG[key] = m.charSvg;
  BACKDROPS[key] = m.backdrop;
  POWERS[key] = m.power;
  POWER_SOUNDS[key] = m.powerSound;
  Object.assign(PEOPLE, m.people || {});
  WORLD_TEXTURES.push(m.textures);
}

const hexColor = n => '#' + n.toString(16).padStart(6, '0');
