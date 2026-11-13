// Mundo: Robots. Glitch, el virus travieso, le robó la energía a Botón, el robotito azul; Chip lo recarga y atrapa a Glitch.
// Cada capítulo (nivel) define su lugar, el texto del personaje, el minijuego, la dificultad y la duración.

registrarMundo('robots', {
  // targetLabel: para mostrar · targetObj: para instrucciones ("Atrapa solo ___")
  theme: { label: 'Robots', mission: 'recargar a Botón', missionCount: 'Energía de Botón', catcherName: 'la estación de carga', bg: 0x1e1b4b, accent: 0x22d3ee,
           targetLabel: 'Botón, el robotito azul', cueLabel: 'el robotito rojo', targetObj: 'a Botón, el robotito azul',
           villain: 'Glitch', villainObj: 'a Glitch', chase: '¡Persíguelo!',
           rescueTitle: '¡Recarga a Botón!' },

  story: {
    hero: 'Chip',
    voice: { pitch: 1.3 },
    // Saludo: suena una sola vez, antes de la frase del primer capítulo (audio 'intro')
    // Los juegos salen en orden aleatorio: cada capítulo usa la frase de su juego
    intro: '¡Hola! Soy Chip. ¡Ayúdame a recargar a Botón!',
    mgLines: {
      classic: '¡Toca solo a Botón para darle energía!',
      catch: '¡Recibe con la estación de carga solo a Botón!',
      race: '¡Zumbi persigue a Glitch! Alcanza solo a Botón.',
      find: '¡Busca a Botón! Si no está, no toques nada.',
      notx: '¡Al revés! Toca a todos los robots... ¡menos a Botón!',
      ax: 'Toca a Botón solo si justo antes salió el robotito rojo.',
      memory: '¡Mira por dónde salta Botón y repite su camino!',
      dodge: '¡Glitch lanza bloques de error! Ponte donde se detenga uno.',
      path: '¡Mira el camino de Zumbi y repítelo de memoria!'
    },
    // Niveles de personajes: el objetivo es el villano escondido entre los amigos (en vez de la señal).
    // En Pista, {pista} se cambia por el amigo que hace de pista (el primero que no es el compañero del capítulo).
    mgLinesCast: {   // (Esquiva y Camino no tienen versión de personajes)
      classic: '¡Glitch se mezcla con mis robots! Tócalo solo a él.',
      catch: '¡Atrapa a Glitch con la red y deja pasar a mis robots!',
      race: '¡Glitch corre entre mis robots! Alcánzalo solo a él.',
      find: '¡Busca a Glitch! Si no está, no toques nada.',
      memory: '¡Mira por dónde salta Glitch y repite su camino!',
      notx: '¡Al revés! Toca a mis robots... ¡menos a Glitch!',
      ax: 'Toca a Glitch solo si justo antes salió {pista}.'
    },
    // Jefe final: sus 2 fases salen al azar (ver bossPhases en juego/nucleo/mundos.js); esto dice el protagonista antes
    bossLine: '¡Glitch está en el centro de control! Recarga a Botón y atrapa a Glitch.',
    chapters: [
      { place: 'El Taller de Inventos', mg: 'classic', level: 1, sec: 45 },
      { place: 'La Fábrica de Engranajes', mg: 'catch', level: 2, sec: 60 },
      { place: 'La Ciudad Digital', mg: 'race', level: 3, sec: 75 },
      { place: 'El Laboratorio', mg: 'find', level: 4, sec: 90 },
      { place: 'El Centro de Control', boss: true, level: 6, phases: [{ mg: 'catch', sec: 60 }, { mg: 'race', sec: 60 }] }
    ],
    ending: '¡Atrapamos a Glitch y Botón brilla otra vez! ¡Gracias!',
    // Quién acompaña cada capítulo (1 a 4). Solo hablan 3 personajes por mundo: el protagonista, el villano y el
    // amigo al que el villano ataca (el de distractors.voices.ayuda); los demás acompañan sin hablar (sin line).
    // role = papel de la imagen (friend1, friend2, friend3, villain)
    companions: [
      { role: 'friend1', name: 'Cable', the: 'Cable', line: '¡Guau, bip! Soy Cable. ¡Mi nariz encontrará a Botón!' },
      { role: 'friend2', name: 'Zumbi', the: 'Zumbi' },
      { role: 'friend3', name: 'Antivirus', the: 'Antivirus' },
      { role: 'villain', name: 'Glitch', line: '¡Ji, ji, ji! ¡Me comí la energía de Botón!' }
    ]
  },

  // El rayo es solo contra Glitch (jefe final). A Botón se le rescata, no se le ataca.
  power: { name: 'Rayo electromagnético', kind: 'bolt', color: 0x22d3ee, shout: '¡Bzzt!',
           rescue: { shout: '¡Energía!' } },
  powerSound() {   // descarga eléctrica con zumbido
    sweep('square', 300, 1200, 0.15, 0.05);
    sweep('sawtooth', 1200, 200, 0.35, 0.04, 0.12);
    noise(0.3, 0.05, 'bandpass', 3000, 1500, 0.05);
  },

  // Dibujo provisional de Chip (se reemplaza por assets/robots/chip.png)
  charSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="220" height="260" viewBox="0 0 220 260"><rect x="70" y="120" width="80" height="120" rx="20" fill="#facc15"/><circle cx="110" cy="85" r="40" fill="#fcd9b6"/><rect x="74" y="44" width="72" height="16" rx="8" fill="#334155"/><circle cx="96" cy="88" r="5" fill="#0f172a"/><circle cx="124" cy="88" r="5" fill="#0f172a"/></svg>',
  people: {},

  // Distractores del entorno: cruzan por los bordes (fly = arriba, walk = abajo) y suenan de vez en cuando
  distractors: {
    // Personajes del mundo como distractores (no en la Prueba fija). minLevel: desde qué nivel aparecen (cada escena dice la frase de su capítulo).
    // fight = pelea en un borde · peek = el villano se asoma riéndose · sneak = cruza por arriba ·
    // chase = uno huye por arriba y el otro lo persigue (flee: huye el amigo) · face = la cara del villano espía desde un lado
    cast: [
      { name: 'pelea_glitch_cable', kind: 'fight', friend: 'friend1', voice: 'ayuda', minLevel: 2 },
      { name: 'glitch_se_asoma', kind: 'peek', voice: 'risa', minLevel: 1 },
      { name: 'glitch_persigue_cable', kind: 'chase', flee: true, friend: 'friend1', voice: 'ayuda', minLevel: 2 },
      { name: 'glitch_escabulle', kind: 'sneak', voice: 'burla', minLevel: 1 },
      { name: 'glitch_espia', kind: 'face', voice: 'amenaza', minLevel: 3 }
    ],
    // Voces de los personajes (las graba herramientas/generar_voces.js; con emoción, generar_voces_elevenlabs.js).
    // Risas (del villano) y "¡ayuda!" (del amigo que el villano ataca): una al azar cada vez;
    // las burlas y amenazas son de este mundo y se turnan por capítulo. Las amenazas pasan de verdad (THREAT_FX).
    voices: {
      risa:    { who: 'villain', random: true, text: [
        '¡Ji, ji, ji! ¡Error, error, no me encuentras!',
        '¡Je, je! ¡Nunca me atraparás, Chip!',
        '¡Ji, ji! ¡La energía de Botón es mía!'
      ] },
      burla:   { who: 'villain', text: [
        '¡Error, error! ¡No me encuentras!',
        '¡Soy más rápido que tu internet!'
      ] },
      amenaza: { who: 'villain', text: [
        '¡Desconfiguraré todos tus robots!',
        '¡Romperé todas las máquinas!',
        '¡Apagaré todas las luces!'
      ] },
      ayuda:   { who: 'friend1', random: true, text: [
        '¡Guau, bip! ¡Chip, ayúdame!',
        '¡Glitch me atrapó!',
        '¡Rápido, Chip, sálvame!'
      ] }   // solo el amigo que el villano ataca y persigue
    },
    visual: [
      { name: 'engranaje', kind: 'fly', size: 85,
        sound() { [0, 0.15, 0.3, 0.45, 0.6].forEach(d => noise(0.04, 0.05, 'highpass', 3000, null, d)); } },   // tic tic del engranaje
      { name: 'avion_de_papel', kind: 'fly', size: 90,
        sound() { noise(1.2, 0.04, 'bandpass', 1500, 2500); } },   // fiuuu del aire
      { name: 'aspiradora', kind: 'walk', size: 95,
        sound() { sweep('sawtooth', 180, 200, 2.0, 0.015); noise(2.0, 0.04, 'bandpass', 800, 300); } }   // motor de la aspiradora
    ],
    sounds: {
      pitido()  { [0, 0.25, 0.5].forEach(d => sweep('square', 1200, 1200, 0.12, 0.03, d)); },
      error()   { sweep('square', 400, 200, 0.4, 0.04); sweep('square', 300, 150, 0.4, 0.04, 0.45); },
      maquina() { [0, 0.4, 0.8, 1.2].forEach(d => noise(0.15, 0.06, 'lowpass', 600, 200, d)); }
    }
  },

  // Provisionales (solo si faltan las imágenes): Botón y los otros robotitos
  textures(make) {
    const bot = (body, smile) => g => {
      g.fillStyle(body, 1); g.fillRoundedRect(40, 70, 80, 70, 14); g.fillRoundedRect(35, 10, 90, 64, 18);
      g.fillStyle(0x0f172a, 1); g.fillRoundedRect(48, 22, 64, 40, 10);
      g.fillStyle(0x67e8f9, 1); g.fillCircle(66, 38, 5); g.fillCircle(94, 38, 5);
      g.lineStyle(3, 0x67e8f9, 1); if (smile) { g.beginPath(); g.arc(80, 44, 10, 0.2, Math.PI - 0.2); g.strokePath(); } else g.lineBetween(70, 52, 90, 52);
    };
    make('robots_target', bot(0x2563eb, true));
    make('robots_dist1', bot(0xef4444, true));
    make('robots_dist2', bot(0xfacc15, true));
    make('robots_dist3', bot(0x7dd3fc, false));          // azul claro y serio (difícil)
    make('robots_dv_engranaje', g => { g.fillStyle(0x94a3b8, 1); g.fillCircle(80, 80, 40); g.fillStyle(0xe2e8f0, 1); g.fillCircle(80, 80, 14); });
    make('robots_dv_avion_de_papel', g => { g.fillStyle(0xffffff, 1); g.fillTriangle(20, 80, 140, 50, 70, 100); });
    make('robots_dv_aspiradora', g => { g.fillStyle(0xdc2626, 1); g.fillEllipse(80, 100, 120, 44); g.fillStyle(0x334155, 1); g.fillEllipse(80, 92, 70, 16); });
  },

  // Fondos provisionales (solo si faltan las imágenes): taller con luces
  backdrop(g, idx, rng, W, H) {
    skyGradient(g, 0x312e81, 0x0f172a, W, H);
    g.fillStyle(0x22d3ee, 0.25); for (let i = 0; i < 12; i++) g.fillRect(rng.between(0, W), rng.between(40, 400), 40, 24);
    g.fillStyle([0x92400e, 0x475569, 0x4338ca, 0x64748b, 0x581c87][idx], 1); g.fillRect(0, 470, W, H - 470);
  }
});
