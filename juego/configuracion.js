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
  AUDIO_EVERY_MS: [20000, 35000], // cada cuánto suena el distractor (rango aleatorio)
  // Misión del día (ver nucleo/mision_del_dia.js): minutos por día y días por semana recomendados
  DAILY_GOAL_MIN: 20,
  WEEKLY_DAYS_GOAL: 5,
  // Modo Memoria (tipo Corsi): tiempo que se ve cada paso de la secuencia y pausa entre pasos
  MEMORY_SHOW_MS: 700,
  MEMORY_GAP_MS: 300
};

// Tamaño del juego: todo se diseña en 960 x 540, pero se dibuja RES veces más grande para que se vea nítido.
const GAME_W = 960, GAME_H = 540, RES = 2;

// Minijuegos: cada uno se juega distinto, pero todos miden aciertos, omisiones y comisiones.
// instr(n, holder): n = qué buscar ("a Sombra"), holder = con qué atrapar ("la canasta" / "la red")
const MG = {
  classic: { label: 'Clásico',   verb: 'Encontraste', desc: 'Toca cuando\naparezca',
             instr: n => 'Toca o presiona ESPACIO solo cuando veas\n' + n },
  catch:   { label: 'Atrapa',    verb: 'Atrapaste',   desc: 'Mueve la canasta\ny atrapa',
             instr: (n, holder) => 'Mueve ' + holder + ' con las flechas o el dedo.\nAtrapa solo ' + n + ' y esquiva lo demás' },
  race:    { label: 'Carrera',   verb: 'Agarraste',   desc: 'Persigue y agarra\nlo que suelta',
             instr: n => 'Cambia de carril con las flechas o tocando arriba/abajo.\nAgarra solo ' + n,
             // con alguien adelante que va soltando los objetos
             instrChase: (n, who) => '¡Persigue ' + who + '! Va soltando cosas por el camino.\nCambia de carril (flechas o tocando arriba/abajo) y agarra solo ' + n },
  find:    { label: 'Encuentra', verb: 'Encontraste', desc: 'Búscalo entre\nmuchos',
             instr: n => 'Toca solo ' + n + '.\nSi no está, no toques nada' },
  // Memoria (tipo Corsi): se juega en su propia escena (modos/memoria/memoria.js)
  memory:  { label: 'Memoria',   verb: 'Recordaste',  desc: 'Recuerda el\ncamino' },
  // Formatos de CPT de los exámenes, para que el niño los practique (se juegan como el Clásico):
  // Menos uno = como el Conners CPT-3: se responde a todo MENOS al objetivo (aparece 1 de cada 10 veces)
  notx:    { label: 'Menos uno', verb: 'Acertaste',   desc: 'Toca todo menos\nla del villano' },
  // Pista = como el AX-CPT: se responde al objetivo SOLO si justo antes apareció la pista (memoria de trabajo)
  ax:      { label: 'Pista',     verb: 'Encontraste', desc: 'Solo si antes\nsalió la pista' }
};
// Juegos que funcionan como el Clásico (un estímulo en el centro; se responde con ESPACIO o tocando)
const CLASSIC_LIKE = ['classic', 'notx', 'ax'];
// Misión de cada juego cuando se busca al villano entre los amigos: así no todo es "atrapar".
// Clásico = vigilar y descubrirlo · Atrapa = atraparlo con la red · Carrera = alcanzarlo · Encuentra = descubrir su escondite ·
// Menos uno = dejar pasar a los amigos · Pista = descubrir su truco
const CAST_WORD = { classic: '¡Te vi!', catch: '¡Atrapado!', race: '¡Alcanzado!', find: '¡Te encontré!',
  notx: '¡Pasa, amigo!', ax: '¡Descubierto!', memory: '¡Lo seguiste!' };

// Dificultad según el nivel (Desafío) o el capítulo (Historia): corto al principio, pero ya con reto.
function challengeParams(level, minigame) {
  const L = level - 1;
  const isiMin = Math.max(400, 800 - 40 * L);
  return {
    sessionMs: Math.min(45000 + 5000 * L, 120000),   // 45 s en el nivel 1, +5 s por nivel, máx. 2 min
    stimMs: Math.max(500, 1000 - 50 * L),            // Clásico: tiempo del estímulo en pantalla
    isiMin: isiMin,
    isiMax: isiMin + 600,
    targetProb: Math.max(0.2, 0.3 - 0.015 * L),      // al principio más objetivos; luego menos (vigilancia)
    similarProb: Math.min(0.55, 0.08 + 0.06 * L),    // distractor parecido al objetivo: poco al inicio, cada vez más
    // Distractores del entorno (sonidos y cosas que cruzan por los bordes): más seguidos en niveles altos
    audio: level >= 2,
    audioEvery: [Math.max(6000, 16000 - 1000 * L), Math.max(10000, 26000 - 1500 * L)],
    visual: true,
    visualEvery: [Math.max(3500, 9000 - 600 * L), Math.max(6000, 14000 - 800 * L)],
    visualCount: 1 + Math.floor(L / 3),              // cosas que cruzan a la vez: 1 (niv. 1-3), 2 (4-6), 3 (7-9)...
    extraProb: level >= 3 ? Math.min(0.6, 0.12 * (level - 2)) : 0,   // Atrapa/Carrera: otro distractor sale junto
    // Atrapa/Carrera: tiempo que tarda en cruzar la pantalla (en Atrapa, más rápido: si no, sobra tiempo para decidir)
    travelMs: minigame === 'catch' ? Math.max(1300, 2500 - 140 * L) : Math.max(1400, 3000 - 150 * L),
    // Atrapa: desde el nivel 2 los objetos caen como sombras iguales y se descubren al cruzar una línea, que baja
    // con el nivel: cada vez hay menos tiempo para decidir si atraparlo (atención y control de impulsos)
    revealY: level >= 2 ? Math.min(300, 110 + 35 * L) : 0,
    spawnMin: Math.max(550, 1200 - 60 * L),
    spawnMax: Math.max(900, 1800 - 70 * L),
    setSize: Math.min(8, 4 + Math.floor(L / 2)),     // Encuentra: cuántos objetos a la vez
    displayMs: Math.max(1400, 2800 - 120 * L),       // Encuentra: tiempo para buscar
    minigame: minigame || 'classic',
    // Menos uno: proporción de veces que sale el objetivo (al que NO se responde). Conners: ~10%
    noGoProb: 0.1,
    // Pista (AX-CPT): tras la pista sale el objetivo el 70% de las veces (AX); sin pista, a veces sale la pista
    // (A) o el objetivo solo (BX, la trampa que mide si recordó la pista)
    axCueProb: 0.3, axAfterCue: 0.7, axLureProb: 0.12
  };
}

// Memoria en Historia y Desafío: la dificultad sube con el nivel, igual que en los otros juegos.
// Nivel 1: caminos cortos, lentos y sin distractores. Luego: más rápido, al revés, sonidos y cosas que cruzan,
// y objetos distractores que se encienden en las casillas (hay que recordar solo el objetivo).
function memoryParams(level) {
  const L = level - 1;
  return Object.assign(challengeParams(level, 'memory'), {
    // Pensado para 8 años en adelante con TDAH (span de Corsi típico ~4 adelante y ~3-4 al revés a esa edad,
    // algo menos con TDAH): pasos de casi 1 s como en el Corsi, empieza corto y sube solo si acierta.
    showMs: Math.max(750, 1000 - 50 * L),          // tiempo que se ve cada paso (1 s en el nivel 1, mín. 0,75 s)
    gapMs: Math.max(250, 350 - 20 * L),            // pausa entre pasos
    startLen: Math.min(4, 2 + Math.floor(L / 3)),  // largo inicial: 2 (niv. 1-3), 3 (4-6), 4 (7 en adelante)
    fwdTrials: level >= 4 ? 4 : 6,                 // caminos "adelante"
    bwdTrials: level >= 4 ? 3 : 0,                 // caminos "al revés" desde el nivel 4
    flashes: level >= 4 ? Math.min(2, Math.floor((level - 2) / 2)) : 0,   // distractores en las casillas (máx. 2)
    similarFlash: level >= 8,                      // el distractor de las casillas se parece al objetivo (solo Desafío alto)
    visual: level >= 2                             // nivel 1 sin cosas que crucen
  });
}

// Prueba fija: siempre igual, para comparar sesiones. mg = 'classic' (como el TOVA), 'notx' (como el Conners)
// o 'ax' (AX-CPT). Valores provisionales: confirmarlos con la literatura de cada prueba.
function pruebaParams(mg) {
  return {
    noGoProb: 0.1, axCueProb: 0.3, axAfterCue: 0.7, axLureProb: 0.12,
    sessionMs: CONFIG.SESSION_MS,
    stimMs: CONFIG.STIMULUS_MS,
    isiMin: CONFIG.ISI_MIN,
    isiMax: CONFIG.ISI_MAX,
    targetProb: CONFIG.TARGET_PROB,
    similarProb: 0,
    audio: CONFIG.AUDIO_DISTRACTOR,
    audioEvery: CONFIG.AUDIO_EVERY_MS,
    visual: false,             // la Prueba fija conserva sus condiciones de siempre
    minigame: mg || 'classic'
  };
}
