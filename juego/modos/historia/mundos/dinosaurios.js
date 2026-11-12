// Mundo: Dinosaurios. El Pterodáctilo Ladrón se robó las hojas doradas, la comida que le da fuerzas a Dino (el triceratops
// bebé). Tito, el niño explorador, las recupera para alimentarlo y al final atrapa al ladrón.
// Cada capítulo (nivel) define su lugar, el texto del personaje, el minijuego, la dificultad y la duración.

registrarMundo('dinos', {
  // targetLabel: para mostrar · targetObj: para instrucciones ("Atrapa solo ___")
  theme: { label: 'Dinosaurios', mission: 'darle hojas doradas a Dino', missionCount: 'Hojas para Dino', catcherName: 'la boca de Dino', bg: 0x14532d, accent: 0xf97316,
           targetLabel: 'la hoja dorada', targetObj: 'la hoja dorada', rescueTitle: '¡Recupera las hojas doradas!',
           villain: 'Pterodáctilo Ladrón', villainObj: 'al Pterodáctilo Ladrón', chase: '¡Persíguelo!' },

  story: {
    hero: 'Tito',
    voice: { pitch: 1.3 },
    // Los juegos salen en orden aleatorio: si a un capítulo le toca otro juego, se usa su texto de aquí
    intro: '¡Hola! Soy Tito, explorador de dinosaurios. Dino, el triceratops bebé, está muy débil: el Pterodáctilo Ladrón se robó todas las hojas doradas, su comida favorita. ',
    mgLines: {
      classic: 'Las hojas doradas brillan con destellos. ¡Toca solo cuando veas una hoja dorada, para dársela a Dino!',
      catch: '¡El viento hace caer hojas de los árboles! Mueve a Dino para que atrape con la boca solo las hojas doradas.',
      race: '¡El Pterodáctilo Ladrón huye y deja caer hojas! Pinchos lo persigue: lanza tu rugido solo a las hojas doradas para que no se las lleve.',
      find: 'El ladrón escondió las hojas entre los helechos... ¡Encuentra la hoja dorada! Y si no está, ¡no toques nada!',
      notx: '¡Al revés! Los dinosaurios del valle tienen hambre: dales todas las hojas... ¡menos las doradas, que son para Dino!',
      ax: 'Las hojas doradas crecen después del helecho verde. ¡Toca la hoja dorada solo si justo antes salió el helecho!',
      memory: '¡El viento lleva la hoja dorada de piedra en piedra! Mira bien su camino y repítelo en el mismo orden.',
      dodge: '¡El Pterodáctilo Ladrón me lanza barro para que no le lleve hojas a Dino! Esquívalo... pero si algo frena en el aire, ¡no te muevas!'
    },
    // Niveles de personajes: el objetivo es el villano escondido entre los amigos (en vez de la hoja dorada).
    // En Pista, {pista} se cambia por el amigo que hace de pista (el primero que no es el compañero del capítulo).
    mgLinesCast: {
      classic: '¡El Pterodáctilo Ladrón se mezcla con los dinosaurios para robar más hojas! Toca solo cuando aparezca él.',
      catch: '¡El Pterodáctilo Ladrón baja volando entre los dinosaurios! Atrápalo con la red... ¡y deja pasar a los demás!',
      race: '¡El Pterodáctilo Ladrón corre con la bolsa de hojas! Alcánzalo solo a él.',
      find: 'El Pterodáctilo Ladrón se esconde entre los dinosaurios con su bolsa de hojas... ¡Encuéntralo! Y si no está, ¡no toques nada!',
      memory: '¡El Pterodáctilo Ladrón salta de roca en roca escondiendo hojas! Mira bien por dónde pasó y repite su camino.',
      notx: '¡Al revés! Saluda a todos los dinosaurios... ¡pero NUNCA al Pterodáctilo Ladrón!',
      ax: 'El Pterodáctilo Ladrón solo aparece justo después de {pista}: esa es la pista. ¡Tócalo solo si justo antes salió {pista}!',
      dodge: '¡El Pterodáctilo Ladrón me lanza barro para que no le lleve hojas a Dino! Esquívalo... pero si algo frena en el aire, ¡no te muevas!'
    },
    // Jefe final: sus 2 fases salen al azar (ver bossPhases en juego/nucleo/mundos.js); esto dice el protagonista antes
    bossLine: '¡El Pterodáctilo Ladrón guarda las últimas hojas doradas en su nido! Primero recupéralas para Dino y después atrapa al ladrón entre los dinosaurios.',
    chapters: [
      { place: 'El Valle de Helechos', mg: 'classic', level: 1, sec: 45,
        line: '¡Hola! Soy Tito. Dino está débil porque el Pterodáctilo Ladrón se robó las hojas doradas. ¡Toca solo las hojas doradas para dárselas!' },
      { place: 'El Río Prehistórico', mg: 'catch', level: 2, sec: 60,
        line: '¡Caen hojas sobre el río! Mueve a Dino para que atrape con la boca solo las hojas doradas.' },
      { place: 'El Volcán Humeante', mg: 'race', level: 3, sec: 75,
        line: '¡El ladrón huye por el volcán soltando hojas! Pinchos lo persigue: lanza tu rugido solo a las hojas doradas.' },
      { place: 'La Cueva de las Pinturas', mg: 'find', level: 4, sec: 90,
        line: 'En la cueva hay hojas escondidas por todas partes... ¡Encuentra la hoja dorada! Y si no está, ¡no toques nada!' },
      { place: 'El Nido en la Montaña', boss: true, level: 6, phases: [{ mg: 'catch', sec: 60 }, { mg: 'race', sec: 60 }],
        line: '¡El Pterodáctilo Ladrón guarda las últimas hojas doradas en su nido! Primero recupéralas para Dino y después atrapa al ladrón entre los dinosaurios.' }
    ],
    ending: '¡Atrapamos al Pterodáctilo Ladrón! Dino comió todas sus hojas doradas y ya está fuerte otra vez. ¡Todo el valle está feliz gracias a ti!',
    // Quién presenta cada capítulo (1 a 4): habla primero con su voz, y en los capítulos 1-3 acompaña al niño
    // mientras juega. En el 4, el villano se burla. role = papel de la imagen (friend1, friend2, friend3, villain)
    companions: [
      { role: 'friend1', name: 'Cuello Largo', the: 'Cuello Largo', line: '¡Hola, pequeño! Soy Cuello Largo. Desde aquí arriba veo todo el valle. ¡Busquemos las hojas doradas para Dino!' },
      { role: 'friend2', name: 'Pinchos', the: 'Pinchos', line: '¡Hola! Soy Pinchos. Tengo picos en la espalda, pero soy muy amigable. ¡Mira con atención!' },
      { role: 'friend3', name: 'Plumi', the: 'Plumi', line: 'Hola, soy Plumi. Me parezco al ladrón, pero yo llevo bufanda y no antifaz. ¡Soy de los buenos!' },
      { role: 'villain', name: 'Pterodáctilo Ladrón', line: '¡Ja, ja, ja! ¡Todas las hojas doradas están en mi bolsa! ¡Dino se quedará sin comer!' }
    ]
  },

  // El rugido es solo contra el Pterodáctilo Ladrón. Las hojas doradas se recogen para Dino.
  power: { name: 'Rugido de dinosaurio', kind: 'roar', color: 0xfb923c, shout: '¡Groaar!',
           rescue: { shout: '¡Ñam, para Dino!' } },
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
        '¡Ja, ja, ja! ¡Las hojas doradas son mías!',
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
        '¡Me llevaré todas las hojas!',
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
