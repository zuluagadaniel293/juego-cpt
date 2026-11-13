// Mundo: Selva. La Serpiente Silbona le robó los colores a Arcoíris, el tucán bebé; Kiara se los devuelve y atrapa
// a la serpiente.
// Cada capítulo (nivel) define su lugar, el texto del personaje, el minijuego, la dificultad y la duración.

registrarMundo('jungle', {
  // targetLabel: para mostrar · targetObj: para instrucciones ("Atrapa solo ___")
  theme: { label: 'Selva', mission: 'devolverle los colores a Arcoíris', missionCount: 'Colores devueltos', catcherName: 'el nido', bg: 0x064e3b, accent: 0xfacc15,
           targetLabel: 'Arcoíris, el tucán', cueLabel: 'el loro verde', targetObj: 'a Arcoíris, el tucán',
           villain: 'Serpiente Silbona', villainObj: 'a la Serpiente Silbona', chase: '¡Persíguela!',
           rescueTitle: '¡Devuélvele los colores a Arcoíris!' },

  story: {
    hero: 'Kiara',
    voice: { pitch: 1.3 },
    // Saludo: suena una sola vez, antes de la frase del primer capítulo (audio 'intro')
    // Los juegos salen en orden aleatorio: cada capítulo usa la frase de su juego
    intro: '¡Hola! Soy Kiara. ¡Ayúdame a devolverle los colores a Arcoíris!',
    mgLines: {
      classic: '¡Toca solo a Arcoíris para devolverle un color!',
      catch: '¡Recibe con el nido solo a Arcoíris!',
      race: '¡Lento persigue a la serpiente! Alcanza solo a Arcoíris.',
      find: '¡Busca a Arcoíris! Si no está, no toques nada.',
      notx: '¡Al revés! Toca a todos los pájaros... ¡menos a Arcoíris!',
      ax: 'Toca a Arcoíris solo si justo antes salió el loro verde.',
      memory: '¡Mira por dónde vuela Arcoíris y repite su camino!',
      dodge: '¡La serpiente lanza espirales! Ponte donde se detenga una.',
      path: '¡Mira el camino de Lento y repítelo de memoria!'
    },
    // Niveles de personajes: el objetivo es el villano escondido entre los amigos (en vez de la señal).
    // En Pista, {pista} se cambia por el amigo que hace de pista (el primero que no es el compañero del capítulo).
    mgLinesCast: {   // (Esquiva y Camino no tienen versión de personajes)
      classic: '¡La Serpiente Silbona se mezcla con los animales! Tócala solo a ella.',
      catch: '¡Atrapa a la Serpiente Silbona con la red y deja pasar a los demás!',
      race: '¡La Serpiente Silbona huye entre los animales! Alcánzala solo a ella.',
      find: '¡Busca a la Serpiente Silbona! Si no está, no toques nada.',
      memory: '¡Mira por dónde pasa la Serpiente Silbona y repite su camino!',
      notx: '¡Al revés! Toca a los animales... ¡menos a la Serpiente Silbona!',
      ax: 'Toca a la Serpiente Silbona solo si justo antes salió {pista}.'
    },
    // Jefe final: sus 2 fases salen al azar (ver bossPhases en juego/nucleo/mundos.js); esto dice el protagonista antes
    bossLine: '¡Los últimos colores están en su cueva! Recupéralos y atrapa a la serpiente.',
    chapters: [
      { place: 'La Orilla del Río', mg: 'classic', level: 1, sec: 45 },
      { place: 'Los Árboles Gigantes', mg: 'catch', level: 2, sec: 60 },
      { place: 'La Cascada', mg: 'race', level: 3, sec: 75 },
      { place: 'El Templo Antiguo', mg: 'find', level: 4, sec: 90 },
      { place: 'La Cueva de la Serpiente', boss: true, level: 6, phases: [{ mg: 'catch', sec: 60 }, { mg: 'race', sec: 60 }] }
    ],
    ending: '¡Arcoíris recuperó sus colores y atrapamos a la serpiente! ¡Gracias!',
    // Quién acompaña cada capítulo (1 a 4). Solo hablan 3 personajes por mundo: el protagonista, el villano y el
    // amigo al que el villano ataca (el de distractors.voices.ayuda); los demás acompañan sin hablar (sin line).
    // role = papel de la imagen (friend1, friend2, friend3, villain)
    companions: [
      { role: 'friend1', name: 'Jaguarcito', the: 'Jaguarcito', line: '¡Grrr, hola! Soy Jaguarcito. ¡Vamos a ayudar a Arcoíris!' },
      { role: 'friend2', name: 'Lento', the: 'Lento' },
      { role: 'friend3', name: 'Silvia', the: 'Silvia' },
      { role: 'villain', name: 'Serpiente Silbona', line: '¡Sssí! ¡Los colores de Arcoíris son míosss!' }
    ]
  },

  // Las hojas son solo contra la Serpiente Silbona (jefe final). A Arcoíris se le rescata, no se le ataca.
  power: { name: 'Hojas mágicas', kind: 'leaves', color: 0x4ade80, shout: '¡Hojas!',
           rescue: { shout: '¡Colores!' } },
  powerSound() {   // remolino de hojas
    noise(0.6, 0.06, 'bandpass', 2500, 1500);
    [0, 0.08, 0.16].forEach(d => sweep('sine', 700, 1400, 0.2, 0.04, d));
  },

  // Dibujo provisional de Kiara (se reemplaza por assets/selva/kiara.png)
  charSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="220" height="260" viewBox="0 0 220 260"><rect x="70" y="120" width="80" height="120" rx="20" fill="#a3a36b"/><circle cx="110" cy="85" r="40" fill="#e8b98f"/><ellipse cx="110" cy="50" rx="62" ry="14" fill="#d6b77a"/><rect x="80" y="20" width="60" height="32" rx="12" fill="#d6b77a"/><circle cx="96" cy="88" r="5" fill="#0f172a"/><circle cx="124" cy="88" r="5" fill="#0f172a"/></svg>',
  people: {},

  // Distractores del entorno: cruzan por los bordes (fly = arriba, walk = abajo) y suenan de vez en cuando
  distractors: {
    // Personajes del mundo como distractores (no en la Prueba fija). minLevel: desde qué nivel aparecen (cada escena dice la frase de su capítulo).
    // fight = pelea en un borde · peek = el villano se asoma riéndose · sneak = cruza por arriba ·
    // chase = uno huye por arriba y el otro lo persigue (flee: huye el amigo) · face = la cara del villano espía desde un lado
    cast: [
      { name: 'pelea_serpiente_jaguarcito', kind: 'fight', friend: 'friend1', voice: 'ayuda', minLevel: 2 },
      { name: 'serpiente_se_asoma', kind: 'peek', voice: 'risa', minLevel: 1 },
      { name: 'serpiente_persigue_jaguarcito', kind: 'chase', flee: true, friend: 'friend1', voice: 'ayuda', minLevel: 2 },
      { name: 'serpiente_escabulle', kind: 'sneak', voice: 'burla', minLevel: 1 },
      { name: 'serpiente_espia', kind: 'face', voice: 'amenaza', minLevel: 3 }
    ],
    // Voces de los personajes (las graba herramientas/generar_voces.js; con emoción, generar_voces_elevenlabs.js).
    // Las risas y los "¡ayuda!" son comunes a todos los mundos (pool: ver juego/nucleo/voces_comunes.js);
    // las burlas y amenazas son de este mundo y se turnan por capítulo. Las amenazas pasan de verdad (THREAT_FX).
    voices: {
      risa:    { who: 'villain', pool: 'risa_f' },
      burla:   { who: 'villain', text: [
        '¡Ssssigue buscando, exploradora!',
        '¡Mira mis ojos... te vas a marear!'
      ] },
      amenaza: { who: 'villain', text: [
        '¡Hipnotizaré a todos los animales!',
        '¡Me llevaré sus colores a mi cueva!',
        '¡Taparé la cascada con lianas!'
      ] },
      ayuda:   { who: 'friend1', pool: 'ayuda_m' }   // solo el amigo que el villano ataca y persigue
    },
    visual: [
      { name: 'mariposa_azul', kind: 'fly', size: 85,
        sound() { [0, 0.3, 0.6, 0.9].forEach(d => noise(0.08, 0.03, 'highpass', 4000, null, d)); } },   // aleteo suave
      { name: 'guacamaya', kind: 'fly', size: 100,
        sound() { [0, 0.4].forEach(d => sweep('sawtooth', 900, 1500, 0.25, 0.04, d)); } },   // graznido
      { name: 'rana', kind: 'walk', size: 80,
        sound() { [0, 0.6, 1.2].forEach(d => sweep('square', 220, 140, 0.15, 0.05, d)); } }   // croac
    ],
    sounds: {
      mono()    { [0, 0.2, 0.4, 0.6].forEach(d => sweep('square', 600, 1100, 0.15, 0.03, d)); },
      lluvia()  { noise(2.5, 0.05, 'highpass', 3000); },
      tambor()  { [0, 0.3, 0.6, 0.75].forEach(d => sweep('sine', 140, 70, 0.2, 0.1, d)); }
    }
  },

  // Provisionales (solo si faltan las imágenes): Arcoíris y los otros pajaritos
  textures(make) {
    const bird = (body, beak, rainbow) => g => {
      g.fillStyle(body, 1); g.fillEllipse(70, 90, 70, 90); g.fillCircle(70, 50, 30);
      g.fillStyle(0xfef08a, 1); g.fillEllipse(70, 95, 36, 50);
      g.fillStyle(beak, 1); g.fillTriangle(92, 40, 92, 66, 150, 56);
      if (rainbow) { g.fillStyle(0xef4444, 1); g.fillTriangle(110, 44, 110, 62, 125, 54); g.fillStyle(0x3b82f6, 1); g.fillTriangle(125, 50, 125, 60, 140, 56); }
      g.fillStyle(0xffffff, 1); g.fillCircle(66, 46, 9); g.fillStyle(0x0f172a, 1); g.fillCircle(68, 46, 4);
    };
    make('jungle_target', bird(0x111827, 0x22c55e, true));
    make('jungle_dist1', bird(0x111827, 0xf97316, false));
    make('jungle_dist2', bird(0x22c55e, 0xfacc15, false));
    make('jungle_dist3', bird(0x111827, 0xfacc15, false));          // pico de dos colores (difícil)
    make('jungle_dv_mariposa_azul', g => { g.fillStyle(0x3b82f6, 1); g.fillEllipse(55, 70, 60, 70); g.fillEllipse(105, 70, 60, 70); g.fillStyle(0x0f172a, 1); g.fillRect(77, 40, 6, 70); });
    make('jungle_dv_guacamaya', g => { g.fillStyle(0xef4444, 1); g.fillEllipse(80, 70, 50, 70); g.fillStyle(0x3b82f6, 1); g.fillTriangle(70, 100, 90, 100, 80, 150); });
    make('jungle_dv_rana', g => { g.fillStyle(0x22c55e, 1); g.fillEllipse(80, 100, 90, 50); g.fillCircle(60, 74, 14); g.fillCircle(100, 74, 14); });
  },

  // Fondos provisionales (solo si faltan las imágenes): selva con árboles
  backdrop(g, idx, rng, W, H) {
    skyGradient(g, 0x86efac, 0x166534, W, H);
    g.fillStyle(0x14532d, 1); for (let i = 0; i < 7; i++) g.fillCircle(rng.between(0, W), rng.between(60, 260), rng.between(60, 110));
    g.fillStyle([0xd6b77a, 0x4d7c0f, 0x0ea5e9, 0x78716c, 0x581c87][idx], 1); g.fillRect(0, 470, W, H - 470);
  }
});
