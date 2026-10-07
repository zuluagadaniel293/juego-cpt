// Configuración general: Prueba fija, minijuegos y dificultad por nivel.

// ======================= CONFIGURACIÓN =======================
// Prueba fija: siempre los mismos parámetros, para poder comparar sesiones.
// Valores provisionales: confirmarlos con la revisión de literatura del CPT (Fase 1).
const CONFIG = {
  SESSION_MS: 120000,        // duración de la sesión (poner 20000 para probar rápido)
  STIMULUS_MS: 1000,         // tiempo que el estímulo está en pantalla
  ISI_MIN: 700,              // pausa mínima entre estímulos
  ISI_MAX: 1400,             // pausa máxima entre estímulos
  TARGET_PROB: 0.25,         // proporción de estímulos objetivo
  AUDIO_DISTRACTOR: true,    // distractor auditivo ON/OFF
  AUDIO_EVERY_MS: [20000, 35000] // cada cuánto suena el distractor (rango aleatorio)
};

// Minijuegos: cada uno se juega distinto, pero todos miden aciertos, omisiones y comisiones.
// instr(n, holder): n = qué buscar ("a Sombra"), holder = con qué atrapar ("la canasta" / "la red")
const MG = {
  classic: { label: 'Clásico',   verb: 'Encontraste', desc: 'Toca cuando\naparezca',
             instr: n => 'Toca o presiona ESPACIO solo cuando veas\n' + n },
  catch:   { label: 'Atrapa',    verb: 'Atrapaste',   desc: 'Mueve la canasta\ny atrapa',
             instr: (n, holder) => 'Mueve ' + holder + ' con las flechas o el dedo.\nAtrapa solo ' + n + ' y esquiva lo demás' },
  race:    { label: 'Carrera',   verb: 'Agarraste',   desc: 'Cambia de carril\ny agarra',
             instr: n => 'Cambia de carril con las flechas o tocando arriba/abajo.\nAgarra solo ' + n },
  find:    { label: 'Encuentra', verb: 'Encontraste', desc: 'Búscalo entre\nmuchos',
             instr: n => 'Toca solo ' + n + '.\nSi no está, no toques nada' }
};

// Dificultad según el nivel (Desafío) o el capítulo (Historia): empieza fácil y corto.
function challengeParams(level, minigame) {
  const L = level - 1;
  const isiMin = Math.max(400, 900 - 40 * L);
  return {
    sessionMs: Math.min(45000 + 5000 * L, 120000),   // 45 s en el nivel 1, +5 s por nivel, máx. 2 min
    stimMs: Math.max(550, 1200 - 50 * L),            // Clásico: tiempo del estímulo en pantalla
    isiMin: isiMin,
    isiMax: isiMin + 600,
    targetProb: Math.max(0.2, 0.35 - 0.015 * L),     // al principio más objetivos; luego menos (vigilancia)
    similarProb: level >= 4 ? Math.min(0.5, 0.15 + 0.05 * (level - 4)) : 0, // distractor parecido al objetivo
    // Distractores del entorno (sonidos y cosas que cruzan por los bordes): más seguidos en niveles altos
    audio: level >= 2,
    audioEvery: [Math.max(6000, 16000 - 1000 * L), Math.max(10000, 26000 - 1500 * L)],
    visual: true,
    visualEvery: [Math.max(3500, 9000 - 600 * L), Math.max(6000, 14000 - 800 * L)],
    travelMs: Math.max(1500, 3400 - 150 * L),        // Atrapa/Carrera: tiempo que tarda en cruzar la pantalla
    spawnMin: Math.max(550, 1300 - 60 * L),
    spawnMax: Math.max(900, 1900 - 70 * L),
    setSize: Math.min(8, 3 + Math.floor(L / 2)),     // Encuentra: cuántos objetos a la vez
    displayMs: Math.max(1500, 3200 - 120 * L),       // Encuentra: tiempo para buscar
    minigame: minigame || 'classic'
  };
}

function pruebaParams() {
  return {
    sessionMs: CONFIG.SESSION_MS,
    stimMs: CONFIG.STIMULUS_MS,
    isiMin: CONFIG.ISI_MIN,
    isiMax: CONFIG.ISI_MAX,
    targetProb: CONFIG.TARGET_PROB,
    similarProb: 0,
    audio: CONFIG.AUDIO_DISTRACTOR,
    audioEvery: CONFIG.AUDIO_EVERY_MS,
    visual: false,             // la Prueba fija conserva sus condiciones de siempre
    minigame: 'classic'
  };
}
