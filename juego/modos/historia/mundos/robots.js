// Mundo: Robots. Chip, el niño inventor, busca a Botón, el robotito azul, y atrapa a Glitch, el virus travieso.
// Cada capítulo (nivel) define su lugar, el texto del personaje, el minijuego, la dificultad y la duración.

registrarMundo('robots', {
  // targetLabel: para mostrar · targetObj: para instrucciones ("Atrapa solo ___")
  theme: { label: 'Robots', mission: 'recargar a Botón', catcherName: 'la estación de carga', bg: 0x1e1b4b, accent: 0x22d3ee,
           targetLabel: 'Botón, el robotito azul', targetObj: 'a Botón, el robotito azul',
           villain: 'Glitch', villainObj: 'a Glitch', chase: '¡Persíguelo!' },

  story: {
    hero: 'Chip',
    voice: { pitch: 1.3 },
    // Los juegos salen en orden aleatorio: si a un capítulo le toca otro juego, se usa su texto de aquí
    intro: '¡Hola! Soy Chip, inventor. Glitch, un virus travieso, desordenó los robots y escondió a Botón, mi robotito azul. ',
    mgLines: {
      classic: 'Botón es el robotito azul con la cara sonriente en su pantalla. ¡Toca solo cuando lo veas a él!',
      catch: '¡Los robotitos caen de la banda de la fábrica! Atrapa solo a Botón.',
      race: '¡Botón rueda por la ciudad! Corre y alcánzalo solo a él.',
      find: 'Aquí hay muchos robotitos juntos... ¡Encuentra a Botón! Y si no está, ¡no toques nada!',
      notx: '¡Al revés! Toca a todos los robotitos... ¡menos a Botón!',
      ax: 'Botón siempre llega después del robotito rojo. ¡Toca a Botón solo si justo antes salió el robotito rojo!',
      memory: '¡Botón salta de máquina en máquina! Mira bien su camino y repítelo en el mismo orden.'
    },
    // Niveles de personajes: el objetivo es el villano escondido entre los amigos (en vez de la señal).
    // En Pista, {pista} se cambia por el amigo que hace de pista (el primero que no es el compañero del capítulo).
    mgLinesCast: {
      classic: '¡Glitch se mezcla con mis amigos robots! Toca solo cuando aparezca él.',
      catch: '¡Glitch cae entre mis amigos robots! Atrápalo con la red... ¡y deja pasar a los demás!',
      race: '¡Glitch corre entre mis amigos robots! Alcánzalo solo a él.',
      find: 'Mis amigos robots y Glitch están todos juntos... ¡Encuéntralo! Y si no está, ¡no toques nada!',
      memory: '¡Glitch salta de pantalla en pantalla! Mira bien por dónde pasó y repite su camino.',
      notx: '¡Al revés! Toca a todos mis amigos robots... ¡pero NUNCA a Glitch!',
      ax: 'Glitch solo aparece justo después de {pista}: esa es la pista. ¡Tócalo solo si justo antes salió {pista}!'
    },
    // Jefe final: sus 2 fases salen al azar (ver bossPhases en juego/nucleo/mundos.js); esto dice el protagonista antes
    bossLine: '¡Glitch tiene a Botón en el centro de control! Primero rescátalo y después atrapa a Glitch entre mis amigos robots.',
    chapters: [
      { place: 'El Taller de Inventos', mg: 'classic', level: 1, sec: 45,
        line: '¡Hola! Soy Chip, inventor. Glitch escondió a Botón... Búscalo: es el robotito azul con la cara sonriente en su pantalla.' },
      { place: 'La Fábrica de Engranajes', mg: 'catch', level: 2, sec: 60,
        line: '¡Los robotitos caen de la banda de la fábrica! Atrapa solo a Botón.' },
      { place: 'La Ciudad Digital', mg: 'race', level: 3, sec: 75,
        line: '¡Botón rueda por las calles de la ciudad digital! Corre y alcánzalo solo a él.' },
      { place: 'El Laboratorio', mg: 'find', level: 4, sec: 90,
        line: 'En el laboratorio hay muchos robotitos juntos... ¡Encuentra a Botón! Y si no está, ¡no toques nada!' },
      { place: 'El Centro de Control', boss: true, level: 6, phases: [{ mg: 'catch', sec: 60 }, { mg: 'race', sec: 60 }],
        line: '¡Glitch tiene a Botón en el centro de control! Primero rescátalo y después atrapa a Glitch entre mis amigos robots.' }
    ],
    ending: '¡Atrapamos a Glitch y Botón está recargado y brillando! Todos los robots funcionan gracias a ti.',
    // Quién presenta cada capítulo (1 a 4): habla primero con su voz, y en los capítulos 1-3 acompaña al niño
    // mientras juega. En el 4, el villano se burla. role = papel de la imagen (friend1, friend2, friend3, villain)
    companions: [
      { role: 'friend1', name: 'Cable', the: 'Cable', line: '¡Guau, bip! Soy Cable, el perro robot de Chip. ¡Mi nariz electrónica nos ayudará a encontrar a Botón!' },
      { role: 'friend2', name: 'Zumbi', the: 'Zumbi', line: '¡Bzzz! Soy Zumbi, el dron. Vuelo rápido y miro desde arriba... ¡tú mira con mucha atención!' },
      { role: 'friend3', name: 'Antivirus', the: 'Antivirus', line: 'Soy Antivirus. Estoy hecho de cuadritos como Glitch, pero yo tengo escudo. ¡Protejo a los robots!' },
      { role: 'villain', name: 'Glitch', line: '¡Ji, ji, ji! ¡Desordené todos los robots! ¡A ver si encuentras a Botón, inventor!' }
    ]
  },

  // El rayo es solo contra Glitch (jefe final). A Botón se le rescata, no se le ataca.
  power: { name: 'Rayo electromagnético', kind: 'bolt', color: 0x22d3ee, shout: '¡Bzzt!',
           rescue: { shout: '¡Te encontré!' } },
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
    // Cada capítulo dice cosas distintas: text[0] = capítulo 1 ... text[3] = capítulo 4, text[4] = jefe final.
    // who = villain, friend (un texto por amigo, con su voz) o un amigo en particular (friend1...)
    voices: {
      risa:    { who: 'villain', text: [
        '¡Ji, ji, ji! ¡Botón es mío!',
        '¡Je, je! ¡Desordené todos los engranajes!',
        '¡Ja, ja! ¡Apagué las luces de la ciudad!',
        '¡Ji, ji! ¡Mezclé todas tus pociones!',
        '¡Ja, ja, ja! ¡Bienvenido a mi centro de control!'
      ] },
      burla:   { who: 'villain', text: [
        '¡Error, error! ¡No me encuentras!',
        '¡Tu banda va al revés, ja!',
        '¡Soy más rápido que tu internet!',
        '¡Tus inventos no funcionan!',
        '¡Tu llave inglesa no me asusta!'
      ] },
      amenaza: { who: 'villain', text: [
        '¡Desconfiguraré todos tus robots!',
        '¡Romperé todas las máquinas!',
        '¡Apagaré todas las luces de la ciudad!',
        '¡Borraré todos tus inventos!',
        '¡Apagaré a todos los robots para siempre!'
      ] },
      ayuda:   { who: 'friend1', text: [   // solo el amigo que el villano ataca y persigue
        '¡Guau! ¡Ayuda, Chip! ¡Glitch me desconectó!',
        '¡Me atoré en la banda! ¡Ayuda!',
        '¡Se me acaba la batería! ¡Chip!',
        '¡Me cambió los botones! ¡Ayuda, Chip!'
      ] }
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
