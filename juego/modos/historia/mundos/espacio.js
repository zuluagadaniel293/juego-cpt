// Mundo: Espacio. Bip y sus hermanitos (aliens verdes) se perdieron por culpa del Capitán Meteoro; Nova los lleva
// a la base en su nave de rescate y atrapa al pirata.
// Cada capítulo (nivel) define su lugar, el texto del personaje, el minijuego, la dificultad y la duración.

registrarMundo('space', {
  // targetLabel: para mostrar · targetObj: para instrucciones ("Atrapa solo ___")
  theme: { label: 'Espacio', mission: 'llevar a Bip y sus hermanitos a la base', missionCount: 'Aliens a bordo', catcherName: 'la nave de rescate', bg: 0x172554, accent: 0xfb923c,
           targetLabel: 'Bip, el alien verde', targetObj: 'a Bip y sus hermanitos',
           villain: 'Capitán Meteoro', villainObj: 'al Capitán Meteoro', chase: '¡Persíguelo!',
           rescueTitle: '¡Sube a Bip a la nave!' },

  story: {
    hero: 'Nova',
    voice: { pitch: 1.3 },
    // Los juegos salen en orden aleatorio: si a un capítulo le toca otro juego, se usa su texto de aquí
    intro: '¡Hola! Soy Nova, astronauta. Por culpa del Capitán Meteoro, Bip y sus hermanitos, los aliens verdes, se perdieron en el espacio. ¡Hay que llevarlos a la base! ',
    mgLines: {
      classic: 'Bip y sus hermanitos flotan entre otros aliens. ¡Toca solo a los verdes para subirlos con el rayo de la nave!',
      catch: '¡Los aliens caen entre los asteroides! Mueve la nave de rescate y sube solo a Bip y sus hermanitos.',
      race: '¡El Capitán Meteoro huye con Bip y sus hermanitos! Zuri lo persigue: alcanza solo a los aliens verdes.',
      find: 'Bip y sus hermanitos se esconden entre muchos aliens... ¡Encuentra al verde! Y si no está, ¡no toques nada!',
      notx: '¡Al revés! Los otros aliens vuelven a sus planetas: tócalos a todos... ¡menos a Bip, que viene a la base!',
      ax: 'Bip siempre llega después del alien azul. ¡Toca a Bip solo si justo antes salió el alien azul!',
      memory: '¡Bip salta de asteroide en asteroide! Mira bien su camino y repítelo para guiar la nave.'
    },
    // Niveles de personajes: el objetivo es el villano escondido entre los amigos (en vez de la señal).
    // En Pista, {pista} se cambia por el amigo que hace de pista (el primero que no es el compañero del capítulo).
    mgLinesCast: {
      classic: '¡El Capitán Meteoro se mezcla con la tripulación! Toca solo cuando aparezca él.',
      catch: '¡El Capitán Meteoro cae del cielo entre la tripulación! Atrápalo con la red... ¡y deja pasar a los demás!',
      race: '¡El Capitán Meteoro corre por la nave entre la tripulación! Alcánzalo solo a él.',
      find: 'La tripulación y el Capitán Meteoro están todos juntos... ¡Encuéntralo! Y si no está, ¡no toques nada!',
      memory: '¡El Capitán Meteoro salta de nave en nave! Mira bien por dónde pasó y repite su camino.',
      notx: '¡Al revés! Toca a toda la tripulación... ¡pero NUNCA al Capitán Meteoro!',
      ax: 'El Capitán Meteoro solo aparece justo después de {pista}: esa es la pista. ¡Tócalo solo si justo antes salió {pista}!'
    },
    // Jefe final: sus 2 fases salen al azar (ver bossPhases en juego/nucleo/mundos.js); esto dice el protagonista antes
    bossLine: '¡El Capitán Meteoro tiene a los últimos hermanitos en su nave pirata! Primero súbelos a la nave de rescate y después atrapa al pirata.',
    chapters: [
      { place: 'La Base Lunar', mg: 'classic', level: 1, sec: 45,
        line: '¡Hola! Soy Nova. Bip y sus hermanitos se perdieron cerca de la base. ¡Toca solo a los aliens verdes para subirlos con el rayo!' },
      { place: 'El Cinturón de Asteroides', mg: 'catch', level: 2, sec: 60,
        line: '¡Los aliens caen entre los asteroides! Mueve la nave de rescate y sube solo a Bip y sus hermanitos.' },
      { place: 'La Nave Nodriza', mg: 'race', level: 3, sec: 75,
        line: '¡El Capitán Meteoro huye por la nave nodriza con los hermanitos de Bip! Zuri lo persigue: alcanza solo a los aliens verdes.' },
      { place: 'El Planeta de Cristal', mg: 'find', level: 4, sec: 90,
        line: 'En el planeta de cristal hay muchos aliens... ¡Encuentra a los verdes! Y si no hay ninguno, ¡no toques nada!' },
      { place: 'La Nave Pirata', boss: true, level: 6, phases: [{ mg: 'catch', sec: 60 }, { mg: 'race', sec: 60 }],
        line: '¡El Capitán Meteoro tiene a los últimos hermanitos en su nave pirata! Primero súbelos a la nave de rescate y después atrapa al pirata.' }
    ],
    ending: '¡Atrapamos al Capitán Meteoro y Bip y sus hermanitos llegaron a la base! Toda la galaxia te lo agradece.',
    // Quién presenta cada capítulo (1 a 4): habla primero con su voz, y en los capítulos 1-3 acompaña al niño
    // mientras juega. En el 4, el villano se burla. role = papel de la imagen (friend1, friend2, friend3, villain)
    companions: [
      { role: 'friend1', name: 'Robi', the: 'Robi', line: '¡Bip, bup! Soy Robi, tu robot copiloto. ¡Encendamos los motores y llevemos a Bip a la base!' },
      { role: 'friend2', name: 'Zuri', the: 'Zuri', line: '¡Hola, terrícola! Soy Zuri. En el espacio todo brilla y se mueve... ¡pero tú no te distraigas!' },
      { role: 'friend3', name: 'Cometa', the: 'Cometa', line: 'Soy Cometa, piloto de la galaxia. Mi casco se parece al del pirata, ¡pero yo soy de los buenos!' },
      { role: 'villain', name: 'Capitán Meteoro', line: '¡Ja, ja, ja! ¡Me llevaré a Bip y a todos sus hermanitos! ¡Nunca llegarán a la base!' }
    ]
  },

  // Las estrellas son solo contra el Capitán Meteoro (jefe final). A Bip se le rescata, no se le ataca.
  power: { name: 'Rayo de estrellas', kind: 'stars', color: 0xfde047, shout: '¡Zum!',
           rescue: { shout: '¡A bordo!' } },
  powerSound() {   // rayo espacial que baja + brillo
    sweep('square', 1800, 300, 0.3, 0.05);
    [1318, 1760, 2349].forEach((f, i) => sweep('sine', f, f * 1.02, 0.25, 0.06, 0.08 + i * 0.05));
    noise(0.4, 0.04, 'highpass', 6000, null, 0.1);
  },

  // Dibujo provisional de Nova (se reemplaza por assets/espacio/nova.png)
  charSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="220" height="260" viewBox="0 0 220 260"><rect x="60" y="120" width="100" height="130" rx="30" fill="#f8fafc"/><rect x="60" y="160" width="100" height="16" fill="#fb923c"/><circle cx="110" cy="80" r="58" fill="#f8fafc"/><circle cx="110" cy="84" r="42" fill="#f9a8d4"/><circle cx="96" cy="84" r="5" fill="#0f172a"/><circle cx="124" cy="84" r="5" fill="#0f172a"/></svg>',
  people: {},

  // Distractores del entorno: cruzan por los bordes (fly = arriba, walk = abajo) y suenan de vez en cuando
  distractors: {
    // Personajes del mundo como distractores (no en la Prueba fija). minLevel: desde qué nivel aparecen (cada escena dice la frase de su capítulo).
    // fight = pelea en un borde · peek = el villano se asoma riéndose · sneak = cruza por arriba ·
    // chase = uno huye por arriba y el otro lo persigue (flee: huye el amigo) · face = la cara del villano espía desde un lado
    cast: [
      { name: 'pelea_meteoro_robi', kind: 'fight', friend: 'friend1', voice: 'ayuda', minLevel: 2 },
      { name: 'meteoro_se_asoma', kind: 'peek', voice: 'risa', minLevel: 1 },
      { name: 'meteoro_persigue_robi', kind: 'chase', flee: true, friend: 'friend1', voice: 'ayuda', minLevel: 2 },
      { name: 'meteoro_escabulle', kind: 'sneak', voice: 'burla', minLevel: 1 },
      { name: 'meteoro_espia', kind: 'face', voice: 'amenaza', minLevel: 3 }
    ],
    // Voces de los personajes (las graba herramientas/generar_voces.js; con emoción, generar_voces_elevenlabs.js).
    // Cada capítulo dice cosas distintas: text[0] = capítulo 1 ... text[3] = capítulo 4, text[4] = jefe final.
    // who = villain, friend (un texto por amigo, con su voz) o un amigo en particular (friend1...)
    voices: {
      risa:    { who: 'villain', text: [
        '¡Ja, ja, ja! ¡Bip será mío!',
        '¡Jo, jo! Estoy en otra galaxia...',
        '¡Ja, ja! ¡Me colé en tu nave nodriza!',
        '¡Je, je, je! ¡Los cristales me esconden!',
        '¡Ja, ja, ja! ¡Bienvenida a mi nave pirata!'
      ] },
      burla:   { who: 'villain', text: [
        '¡Nunca me alcanzarás, astronauta!',
        '¡Esquiva las rocas si puedes!',
        '¡Apreté todos los botones de tu nave!',
        '¡Bip brilla, pero yo brillo más!',
        '¡Tu cohete es más lento que una tortuga!'
      ] },
      amenaza: { who: 'villain', text: [
        '¡Todo el espacio será mío!',
        '¡Lanzaré los asteroides contra tu base!',
        '¡Apagaré las luces de tu nave nodriza!',
        '¡Congelaré el planeta de cristal!',
        '¡Nadie escapa del Capitán Meteoro!'
      ] },
      ayuda:   { who: 'friend1', text: [   // solo el amigo que el villano ataca y persigue
        '¡Ay, no! ¡Ayuda, Nova! ¡Me atraparon!',
        '¡Nova, mis circuitos fallan!',
        '¡Se me acabó la batería! ¡Ayuda, Nova!',
        '¡Me resbalo en los cristales! ¡Ayuda!'
      ] }
    },
    visual: [
      { name: 'cohete', kind: 'fly', size: 100,
        sound() { noise(2.4, 0.08, 'lowpass', 900, 200); sweep('sawtooth', 120, 70, 2.4, 0.015); } },   // cohete que pasa rugiendo
      { name: 'satelite', kind: 'fly', size: 90,
        sound() { [0, 0.5, 1.0, 1.5].forEach(d => sweep('square', 1400, 1400, 0.08, 0.03, d)); } },   // bip... bip... del satélite
      { name: 'rover', kind: 'walk', size: 100,
        sound() { noise(2.0, 0.05, 'bandpass', 300, 400); sweep('sawtooth', 70, 90, 2.0, 0.012); } }   // motor del carrito
    ],
    sounds: {
      radio()  { noise(0.6, 0.05, 'bandpass', 2000, 1200); [0.7, 0.85].forEach(d => sweep('sine', 1046, 1046, 0.1, 0.05, d)); },
      alarma() { [0, 0.5, 1.0].forEach(d => sweep('square', 660, 880, 0.35, 0.025, d)); },
      motor()  { sweep('sawtooth', 60, 110, 1.5, 0.03); noise(1.5, 0.03, 'lowpass', 400, 200); }
    }
  },

  // Provisionales (solo si faltan las imágenes): Bip y los otros aliens
  textures(make) {
    const alien = (body, ant) => g => {
      g.fillStyle(body, 1); g.fillEllipse(80, 100, 90, 100); g.fillCircle(80, 60, 40);
      g.lineStyle(4, body, 1); g.lineBetween(80, 22, 80, 6); g.fillStyle(ant, 1); g.fillCircle(80, 8, 8);
      g.fillStyle(0xffffff, 1); g.fillCircle(66, 58, 10); g.fillCircle(94, 58, 10);
      g.fillStyle(0x0f172a, 1); g.fillCircle(66, 58, 5); g.fillCircle(94, 58, 5);
    };
    make('space_target', alien(0x22c55e, 0xfacc15));
    make('space_dist1', alien(0x3b82f6, 0x3b82f6));
    make('space_dist2', alien(0xf97316, 0xf97316));
    make('space_dist3', alien(0x86efac, 0x86efac));          // verde claro (difícil)
    make('space_dv_cohete', g => { g.fillStyle(0xf8fafc, 1); g.fillEllipse(80, 80, 120, 40); g.fillStyle(0xf97316, 1); g.fillTriangle(20, 70, 20, 90, 4, 80); });
    make('space_dv_satelite', g => { g.fillStyle(0x94a3b8, 1); g.fillRect(65, 65, 30, 30); g.fillStyle(0x1e3a8a, 1); g.fillRect(15, 70, 45, 20); g.fillRect(100, 70, 45, 20); });
    make('space_dv_rover', g => { g.fillStyle(0xe2e8f0, 1); g.fillRect(40, 80, 80, 30); g.fillStyle(0x334155, 1); [55, 80, 105].forEach(x => g.fillCircle(x, 115, 12)); });
  },

  // Fondos provisionales (solo si faltan las imágenes): cielo estrellado con un planeta
  backdrop(g, idx, rng, W, H) {
    skyGradient(g, 0x0b1026, 0x312e81, W, H);
    g.fillStyle(0xffffff, 0.8); for (let i = 0; i < 80; i++) g.fillCircle(rng.between(0, W), rng.between(0, H), rng.between(1, 2));
    g.fillStyle([0x94a3b8, 0x78716c, 0x64748b, 0xc4b5fd, 0x7e22ce][idx], 1); g.fillCircle(W - 140, 120, 70);
    g.fillStyle(0x475569, 1); g.fillRect(0, 470, W, H - 470);
  }
});
