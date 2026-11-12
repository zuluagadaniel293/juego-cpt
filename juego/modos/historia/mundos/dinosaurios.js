// Mundo: Dinosaurios. Tito, el niño explorador, busca a Dino, el triceratops bebé naranja, y atrapa al Pterodáctilo Ladrón.
// Cada capítulo (nivel) define su lugar, el texto del personaje, el minijuego, la dificultad y la duración.

registrarMundo('dinos', {
  // targetLabel: para mostrar · targetObj: para instrucciones ("Atrapa solo ___")
  theme: { label: 'Dinosaurios', bg: 0x14532d, accent: 0xf97316,
           targetLabel: 'Dino, el triceratops naranja', targetObj: 'a Dino, el triceratops naranja',
           villain: 'Pterodáctilo Ladrón', villainObj: 'al Pterodáctilo Ladrón', chase: '¡Persíguelo!' },

  story: {
    hero: 'Tito',
    voice: { pitch: 1.3 },
    // Los juegos salen en orden aleatorio: si a un capítulo le toca otro juego, se usa su texto de aquí
    intro: '¡Hola! Soy Tito, explorador de dinosaurios. El Pterodáctilo Ladrón se llevó a Dino, el triceratops bebé. ',
    mgLines: {
      classic: 'Dino es el triceratops naranja con manchas amarillas. ¡Toca solo cuando lo veas a él!',
      catch: '¡Los triceratops bebés ruedan por la colina! Atrapa solo a Dino.',
      race: '¡Dino corre entre los helechos! Corre y alcánzalo solo a él.',
      find: 'Aquí hay muchos triceratops juntos... ¡Encuentra a Dino! Y si no está, ¡no toques nada!',
      notx: '¡Al revés! Toca a todos los triceratops... ¡menos a Dino!',
      ax: 'Dino siempre llega después del triceratops azul. ¡Toca a Dino solo si justo antes salió el triceratops azul!',
      memory: '¡Dino deja huellas de piedra en piedra! Mira bien su camino y repítelo en el mismo orden.'
    },
    // Niveles de personajes: el objetivo es el villano escondido entre los amigos (en vez de la señal).
    // En Pista, {pista} se cambia por el amigo que hace de pista (el primero que no es el compañero del capítulo).
    mgLinesCast: {
      classic: '¡El Pterodáctilo Ladrón se mezcla con los dinosaurios! Toca solo cuando aparezca él.',
      catch: '¡El Pterodáctilo Ladrón baja volando entre los dinosaurios! Atrápalo con la red... ¡y deja pasar a los demás!',
      race: '¡El Pterodáctilo Ladrón corre entre los dinosaurios! Alcánzalo solo a él.',
      find: 'Los dinosaurios y el Pterodáctilo Ladrón están todos juntos... ¡Encuéntralo! Y si no está, ¡no toques nada!',
      memory: '¡El Pterodáctilo Ladrón salta de roca en roca! Mira bien por dónde pasó y repite su camino.',
      notx: '¡Al revés! Toca a todos los dinosaurios... ¡pero NUNCA al Pterodáctilo Ladrón!',
      ax: 'El Pterodáctilo Ladrón solo aparece justo después de {pista}: esa es la pista. ¡Tócalo solo si justo antes salió {pista}!'
    },
    // Jefe final: sus 2 fases salen al azar (ver bossPhases en juego/nucleo/mundos.js); esto dice el protagonista antes
    bossLine: '¡El Pterodáctilo Ladrón tiene a Dino en su nido! Primero rescata a Dino y después atrapa al ladrón entre los dinosaurios.',
    chapters: [
      { place: 'El Valle de Helechos', mg: 'classic', level: 1, sec: 45,
        line: '¡Hola! Soy Tito, explorador de dinosaurios. El Pterodáctilo Ladrón se llevó a Dino... Búscalo: es el triceratops naranja con manchas amarillas.' },
      { place: 'El Río Prehistórico', mg: 'catch', level: 2, sec: 60,
        line: '¡Los triceratops bebés cruzan el río! Atrapa solo a Dino.' },
      { place: 'El Volcán Humeante', mg: 'race', level: 3, sec: 75,
        line: '¡Dino corre cerca del volcán! Corre y alcánzalo solo a él.' },
      { place: 'La Cueva de las Pinturas', mg: 'find', level: 4, sec: 90,
        line: 'En la cueva hay muchos triceratops juntos... ¡Encuentra a Dino! Y si no está, ¡no toques nada!' },
      { place: 'El Nido en la Montaña', boss: true, level: 6, phases: [{ mg: 'catch', sec: 60 }, { mg: 'race', sec: 60 }],
        line: '¡El Pterodáctilo Ladrón tiene a Dino en su nido! Primero rescata a Dino y después atrapa al ladrón entre los dinosaurios.' }
    ],
    ending: '¡Atrapamos al Pterodáctilo Ladrón y Dino volvió con su familia! Todo el valle está feliz gracias a ti.',
    // Quién presenta cada capítulo (1 a 4): habla primero con su voz, y en los capítulos 1-3 acompaña al niño
    // mientras juega. En el 4, el villano se burla. role = papel de la imagen (friend1, friend2, friend3, villain)
    companions: [
      { role: 'friend1', name: 'Cuello Largo', the: 'Cuello Largo', line: '¡Hola, pequeño! Soy Cuello Largo. Desde aquí arriba veo todo el valle. ¡Busquemos a Dino juntos!' },
      { role: 'friend2', name: 'Pinchos', the: 'Pinchos', line: '¡Hola! Soy Pinchos. Tengo picos en la espalda, pero soy muy amigable. ¡Mira con atención!' },
      { role: 'friend3', name: 'Plumi', the: 'Plumi', line: 'Hola, soy Plumi. Me parezco al ladrón, pero yo llevo bufanda y no antifaz. ¡Soy de los buenos!' },
      { role: 'villain', name: 'Pterodáctilo Ladrón', line: '¡Ja, ja, ja! ¡Dino ya está en mi bolsa! ¡A ver si lo encuentras, explorador!' }
    ]
  },

  // El rugido es solo contra el Pterodáctilo Ladrón (jefe final). A Dino se le rescata, no se le ataca.
  power: { name: 'Rugido de dinosaurio', kind: 'roar', color: 0xfb923c, shout: '¡Groaar!',
           rescue: { shout: '¡Te encontré!' } },
  powerSound() {   // rugido grave que retumba
    sweep('sawtooth', 160, 60, 0.7, 0.07);
    sweep('square', 110, 50, 0.6, 0.03, 0.05);
    noise(0.7, 0.06, 'lowpass', 500, 150);
  },

  // Dibujo provisional de Tito (se reemplaza por assets/dinosaurios/tito.png)
  charSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="220" height="260" viewBox="0 0 220 260"><rect x="70" y="120" width="80" height="120" rx="20" fill="#a16207"/><circle cx="110" cy="85" r="40" fill="#fcd9b6"/><ellipse cx="110" cy="50" rx="62" ry="14" fill="#d6b77a"/><rect x="80" y="20" width="60" height="32" rx="12" fill="#d6b77a"/><circle cx="96" cy="88" r="5" fill="#0f172a"/><circle cx="124" cy="88" r="5" fill="#0f172a"/></svg>',
  people: {},

  // Distractores del entorno: cruzan por los bordes (fly = arriba, walk = abajo) y suenan de vez en cuando
  distractors: {
    // Personajes del mundo como distractores (no en la Prueba fija). minLevel: desde qué nivel aparecen (cada escena dice la frase de su capítulo).
    // fight = pelea en un borde · peek = el villano se asoma riéndose · sneak = cruza por arriba ·
    // chase = uno huye por arriba y el otro lo persigue (flee: huye el amigo) · face = la cara del villano espía desde un lado
    cast: [
      { name: 'pelea_ptero_cuello_largo', kind: 'fight', friend: 'friend1', voice: 'ayuda', minLevel: 2 },
      { name: 'ptero_se_asoma', kind: 'peek', voice: 'risa', minLevel: 1 },
      { name: 'ptero_persigue_cuello_largo', kind: 'chase', flee: true, friend: 'friend1', voice: 'ayuda', minLevel: 2 },
      { name: 'ptero_escabulle', kind: 'sneak', voice: 'burla', minLevel: 1 },
      { name: 'ptero_espia', kind: 'face', voice: 'amenaza', minLevel: 3 }
    ],
    // Voces de los personajes (las graba herramientas/generar_voces.js; con emoción, generar_voces_elevenlabs.js).
    // Cada capítulo dice cosas distintas: text[0] = capítulo 1 ... text[3] = capítulo 4, text[4] = jefe final.
    // who = villain, friend (un texto por amigo, con su voz) o un amigo en particular (friend1...)
    voices: {
      risa:    { who: 'villain', text: [
        '¡Ja, ja, ja! ¡Dino ya es mío!',
        '¡Je, je! ¡Vuelo sobre el río y tú no!',
        '¡Ja, ja! ¡El humo del volcán me esconde!',
        '¡Je, je, je! ¡Yo también sé pintar en la cueva!',
        '¡Ja, ja, ja! ¡Bienvenido a mi nido!'
      ] },
      burla:   { who: 'villain', text: [
        '¡Nunca me alcanzarás, explorador!',
        '¡Te vas a mojar los zapatos, ja!',
        '¡Uy, qué calor! ¿Te cansaste?',
        '¡En la oscuridad no ves nada!',
        '¡Tu lupa no te sirve contra mí!'
      ] },
      amenaza: { who: 'villain', text: [
        '¡Me llevaré a todos los bebés!',
        '¡Haré que el río se desborde!',
        '¡Despertaré al volcán!',
        '¡Apagaré las antorchas de la cueva!',
        '¡Nadie sube a mi montaña!'
      ] },
      ayuda:   { who: 'friend1', text: [   // solo el amigo que el villano ataca y persigue
        '¡Ay, no! ¡Ayuda, Tito! ¡Me picoteó!',
        '¡Me resbalé en las piedras del río! ¡Ayuda!',
        '¡El humo me hace toser! ¡Tito!',
        '¡Mi cuello no cabe en la cueva! ¡Ayuda!'
      ] }
    },
    visual: [
      { name: 'libelula', kind: 'fly', size: 85,
        sound() { noise(1.6, 0.04, 'bandpass', 3000, 900); } },   // zumbido de alas
      { name: 'arqueopterix', kind: 'fly', size: 100,
        sound() { [0, 0.3, 0.6].forEach(d => sweep('sine', 1800, 1200, 0.15, 0.05, d)); } },   // pío prehistórico
      { name: 'lagartija', kind: 'walk', size: 90,
        sound() { [0, 0.2, 0.4, 0.6, 0.8].forEach(d => noise(0.05, 0.05, 'highpass', 2500, null, d)); } }   // patitas rápidas
    ],
    sounds: {
      pisada()  { [0, 0.8].forEach(d => { sweep('sine', 70, 40, 0.4, 0.12, d); noise(0.3, 0.05, 'lowpass', 200, 100, d); }); },
      // sin rugido: la grabación sonaba muy fuerte y asustaba
      volcan()  { noise(2.0, 0.06, 'lowpass', 300, 120); }
    }
  },

  // Provisionales (solo si faltan las imágenes): Dino y los otros triceratops
  textures(make) {
    const trike = (body, spots) => g => {
      g.fillStyle(body, 1); g.fillEllipse(75, 95, 110, 60); g.fillCircle(125, 75, 26);
      g.fillStyle(0xfef3c7, 1); g.fillTriangle(130, 52, 142, 30, 146, 56);
      g.fillStyle(body, 1); [40, 65, 90, 110].forEach(x => g.fillRect(x - 7, 115, 14, 26));
      g.fillStyle(0x0f172a, 1); g.fillCircle(130, 72, 4);
      if (spots) { g.fillStyle(0xfde047, 1); [[55, 85], [80, 78], [95, 100]].forEach(([x, y]) => g.fillCircle(x, y, 7)); }
    };
    make('dinos_target', trike(0xf97316, true));
    make('dinos_dist1', trike(0x22c55e, false));
    make('dinos_dist2', trike(0x3b82f6, false));
    make('dinos_dist3', trike(0xfdba74, false));          // naranja claro (difícil)
    make('dinos_dv_libelula', g => { g.fillStyle(0x14b8a6, 1); g.fillRect(30, 76, 100, 8); g.fillStyle(0xe0f2fe, 0.8); g.fillEllipse(70, 60, 40, 20); g.fillEllipse(70, 100, 40, 20); });
    make('dinos_dv_arqueopterix', g => { g.fillStyle(0x2563eb, 1); g.fillEllipse(80, 80, 70, 36); g.fillStyle(0xef4444, 1); g.fillTriangle(60, 70, 20, 40, 90, 72); });
    make('dinos_dv_lagartija', g => { g.fillStyle(0x84cc16, 1); g.fillEllipse(80, 100, 90, 26); g.fillRect(10, 98, 50, 6); });
  },

  // Fondos provisionales (solo si faltan las imágenes): cielo, volcán y pradera
  backdrop(g, idx, rng, W, H) {
    skyGradient(g, 0x7dd3fc, 0xfde68a, W, H);
    g.fillStyle(0x78716c, 1); g.fillTriangle(W - 320, 470, W - 180, 230, W - 40, 470);
    g.fillStyle([0x65a30d, 0x0ea5e9, 0x57534e, 0x44403c, 0xa16207][idx] || 0x65a30d, 1); g.fillRect(0, 470, W, H - 470);
  }
});
