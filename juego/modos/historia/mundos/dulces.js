// Mundo: Dulces. Gomi, el osito de gomita, busca a Chispita, la gomita estrella dorada, y atrapa a Ácido, el limón gruñón.
// Cada capítulo (nivel) define su lugar, el texto del personaje, el minijuego, la dificultad y la duración.

registrarMundo('candy', {
  // targetLabel: para mostrar · targetObj: para instrucciones ("Atrapa solo ___")
  theme: { label: 'Dulces', bg: 0x831843, accent: 0xf9a8d4,
           targetLabel: 'Chispita, la estrella dorada', targetObj: 'a Chispita, la estrella dorada',
           villain: 'Ácido', villainObj: 'a Ácido', chase: '¡Persíguelo!' },

  story: {
    hero: 'Gomi',
    voice: { pitch: 1.3 },
    // Los juegos salen en orden aleatorio: si a un capítulo le toca otro juego, se usa su texto de aquí
    intro: '¡Hola! Soy Gomi, un osito de gomita. Ácido, el limón gruñón, escondió a Chispita, mi amiga estrella. ',
    mgLines: {
      classic: 'Chispita es la gomita estrella dorada. ¡Toca solo cuando la veas a ella!',
      catch: '¡Llueven gomitas del cielo! Atrapa solo a Chispita.',
      race: '¡Chispita rueda por el camino de azúcar! Corre y alcánzala solo a ella.',
      find: 'Aquí hay muchas gomitas juntas... ¡Encuentra a Chispita! Y si no está, ¡no toques nada!',
      notx: '¡Al revés! Toca a todas las gomitas... ¡menos a Chispita!',
      ax: 'Chispita siempre llega después del corazón rosado. ¡Toca a Chispita solo si justo antes salió el corazón rosado!',
      memory: '¡Chispita salta de dulce en dulce! Mira bien su camino y repítelo en el mismo orden.'
    },
    // Niveles de personajes: el objetivo es el villano escondido entre los amigos (en vez de la señal).
    // En Pista, {pista} se cambia por el amigo que hace de pista (el primero que no es el compañero del capítulo).
    mgLinesCast: {
      classic: '¡Ácido se mezcla con mis amigos dulces! Toca solo cuando aparezca él.',
      catch: '¡Ácido cae entre mis amigos dulces! Atrápalo con la red... ¡y deja pasar a los demás!',
      race: '¡Ácido corre entre mis amigos dulces! Atrápalo solo a él.',
      find: 'Mis amigos dulces y Ácido están todos juntos... ¡Encuéntralo! Y si no está, ¡no toques nada!',
      memory: '¡Ácido salta de dulce en dulce! Mira bien por dónde pasó y repite su camino.',
      notx: '¡Al revés! Toca a todos mis amigos dulces... ¡pero NUNCA a Ácido!',
      ax: 'Ácido solo aparece justo después de {pista}: esa es la pista. ¡Tócalo solo si justo antes salió {pista}!'
    },
    // Jefe final: sus 2 fases salen al azar (ver bossPhases en juego/nucleo/mundos.js); esto dice el protagonista antes
    bossLine: '¡Ácido quiere volver agria a Chispita! Se esconde entre mis amigos dulces. ¡Atrapémoslo!',
    chapters: [
      { place: 'El Bosque de Chupetines', mg: 'classic', level: 1, sec: 45,
        line: '¡Hola! Soy Gomi, un osito de gomita. Ácido escondió a Chispita... Búscala: es la gomita estrella dorada.' },
      { place: 'El Río de Chocolate', mg: 'catch', level: 2, sec: 60,
        line: '¡Las gomitas caen al río de chocolate! Atrapa solo a Chispita.' },
      { place: 'La Montaña de Helado', mg: 'race', level: 3, sec: 75,
        line: '¡Chispita se desliza por la montaña de helado! Corre y alcánzala solo a ella.' },
      { place: 'El Castillo de Galleta', mg: 'find', level: 4, sec: 90,
        line: 'En el castillo hay muchas gomitas juntas... ¡Encuentra a Chispita! Y si no está, ¡no toques nada!' },
      { place: 'La Fábrica Agria', boss: true, level: 6, phases: [{ mg: 'catch', sec: 60 }, { mg: 'race', sec: 60 }],
        line: '¡Ácido llevó a Chispita a su fábrica agria! Atrápalo con la red y, si escapa, ¡persíguelo!' }
    ],
    ending: '¡Atrapamos a Ácido y Chispita volvió a brillar! Todo el reino de los dulces está feliz gracias a ti.',
    // Quién presenta cada capítulo (1 a 4): habla primero con su voz, y en los capítulos 1-3 acompaña al niño
    // mientras juega. En el 4, el villano se burla. role = papel de la imagen (friend1, friend2, friend3, villain)
    companions: [
      { role: 'friend1', name: 'Jengi', the: 'Jengi', line: '¡Hola! Soy Jengi, la galleta de jengibre. ¡Corre, corre, que vamos a buscar a Chispita!' },
      { role: 'friend2', name: 'Nube', the: 'Nube', line: 'Hola, soy Nube, de algodón de azúcar. Aquí todo es dulce y de colores... ¡pero tú no te distraigas!' },
      { role: 'friend3', name: 'Limonada', the: 'Limonada', line: 'Soy Limonada. Soy un limón como Ácido, pero yo llevo moño y soy muy dulce. ¡Te ayudo!' },
      { role: 'villain', name: 'Ácido', line: '¡Grrr! ¡Los dulces me empalagan! ¡Escondí a Chispita y todo será agrio!' }
    ]
  },

  // Las chispas de azúcar son solo contra Ácido (jefe final). A Chispita se le rescata, no se le ataca.
  power: { name: 'Lluvia de chispas de azúcar', kind: 'sprinkles', color: 0xf472b6, shout: '¡Chispas!',
           rescue: { shout: '¡Te encontré!' } },
  powerSound() {   // chispitas que caen tintineando
    [1568, 2093, 1760, 2349, 1976].forEach((f, i) => sweep('sine', f, f * 1.05, 0.12, 0.05, i * 0.05));
    noise(0.35, 0.03, 'highpass', 5000, null, 0.05);
  },

  // Dibujo provisional de Gomi (se reemplaza por assets/dulces/gomi.png)
  charSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="220" height="260" viewBox="0 0 220 260"><circle cx="70" cy="40" r="22" fill="#ef4444"/><circle cx="150" cy="40" r="22" fill="#ef4444"/><circle cx="110" cy="85" r="50" fill="#ef4444"/><ellipse cx="110" cy="180" rx="60" ry="70" fill="#ef4444"/><circle cx="94" cy="80" r="6" fill="#0f172a"/><circle cx="126" cy="80" r="6" fill="#0f172a"/></svg>',
  people: {},

  // Distractores del entorno: cruzan por los bordes (fly = arriba, walk = abajo) y suenan de vez en cuando
  distractors: {
    // Personajes del mundo como distractores (no en la Prueba fija). minLevel: desde qué nivel aparecen (cada escena dice la frase de su capítulo).
    // fight = pelea en un borde · peek = el villano se asoma riéndose · sneak = cruza por arriba ·
    // chase = uno huye por arriba y el otro lo persigue (flee: huye el amigo) · face = la cara del villano espía desde un lado
    // (sin imagen de la cara, el juego la cambia por "se asoma")
    cast: [
      { name: 'pelea_acido_jengi', kind: 'fight', friend: 'friend1', voice: 'ayuda', minLevel: 2 },
      { name: 'acido_se_asoma', kind: 'peek', voice: 'risa', minLevel: 1 },
      { name: 'acido_persigue_jengi', kind: 'chase', flee: true, friend: 'friend1', voice: 'ayuda', minLevel: 2 },
      { name: 'acido_escabulle', kind: 'sneak', voice: 'burla', minLevel: 1 },
      { name: 'acido_espia', kind: 'face', voice: 'amenaza', minLevel: 3 }
    ],
    // Voces de los personajes (las graba herramientas/generar_voces.js; con emoción, generar_voces_elevenlabs.js).
    // Cada capítulo dice cosas distintas: text[0] = capítulo 1 ... text[3] = capítulo 4, text[4] = jefe final.
    // who = villain, friend (un texto por amigo, con su voz) o un amigo en particular (friend1...)
    voices: {
      risa:    { who: 'villain', text: [
        '¡Ja, ja, ja! ¡Chispita es mía!',
        '¡Je, je! ¡Le eché limón al chocolate!',
        '¡Ja, ja! ¡Derretí tu montaña de helado!',
        '¡Je, je, je! ¡Mordí tu castillo de galleta!',
        '¡Ja, ja, ja! ¡Bienvenido a mi fábrica agria!'
      ] },
      burla:   { who: 'villain', text: [
        '¡Qué empalagoso eres, osito!',
        '¡Te vas a quedar pegado en el chocolate!',
        '¡Brrr! ¿Tienes frío, osito?',
        '¡Tu castillo se desmorona como galleta!',
        '¡Tus chispitas no me hacen nada!'
      ] },
      amenaza: { who: 'villain', text: [
        '¡Volveré agrios todos los dulces!',
        '¡Convertiré el río en jugo de limón!',
        '¡Todo el helado sabrá a limón!',
        '¡Me quedaré con el castillo!',
        '¡De mi fábrica nadie sale dulce!'
      ] },
      ayuda:   { who: 'friend1', text: [   // solo el amigo que el villano ataca y persigue
        '¡Ay, no! ¡Ayuda, Gomi! ¡Me quiere morder!',
        '¡Me caí al chocolate! ¡Ayuda!',
        '¡Me estoy congelando en el helado! ¡Gomi!',
        '¡Se me rompió un brazo de galleta! ¡Ayuda!'
      ] }
    },
    visual: [
      { name: 'caramelo', kind: 'fly', size: 85,
        sound() { noise(0.8, 0.04, 'highpass', 4000); } },   // envoltura que cruje
      { name: 'globo_chicle', kind: 'fly', size: 90,
        sound() { sweep('sine', 200, 500, 0.8, 0.05); noise(0.08, 0.08, 'bandpass', 1500, 800, 0.85); } },   // se infla y... ¡pop!
      { name: 'osito_verde', kind: 'walk', size: 85,
        sound() { [0, 0.35, 0.7, 1.05].forEach(d => sweep('sine', 300, 180, 0.12, 0.06, d)); } }   // pasitos de gomita (boing)
    ],
    sounds: {
      campanita() { [0, 0.15, 0.3].forEach((d, i) => sweep('sine', 1320 + i * 200, 1320 + i * 200, 0.2, 0.04, d)); },
      burbujeo()  { for (let i = 0; i < 6; i++) sweep('sine', 300, 700, 0.1, 0.04, i * 0.15); },
      crujido()   { [0, 0.1, 0.25].forEach(d => noise(0.08, 0.06, 'bandpass', 2500, 1500, d)); }
    }
  },

  // Provisionales (solo si faltan las imágenes): Chispita y las otras gomitas
  textures(make) {
    const star = (col) => g => {
      g.fillStyle(col, 1); const p = [];
      for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 28 : 64; p.push({ x: 80 + Math.cos(a) * r, y: 84 + Math.sin(a) * r }); }
      g.fillPoints(p, true); g.fillStyle(0x0f172a, 1); g.fillCircle(70, 80, 5); g.fillCircle(90, 80, 5);
    };
    make('candy_target', star(0xf59e0b));
    make('candy_dist1', star(0x22c55e));
    make('candy_dist2', g => { g.fillStyle(0xf472b6, 1); g.fillCircle(60, 70, 30); g.fillCircle(100, 70, 30); g.fillTriangle(32, 82, 128, 82, 80, 135); });
    make('candy_dist3', star(0xfef08a));          // amarilla pálida (difícil)
    make('candy_dv_caramelo', g => { g.fillStyle(0xef4444, 1); g.fillEllipse(80, 80, 70, 44); g.fillTriangle(45, 80, 15, 60, 15, 100); g.fillTriangle(115, 80, 145, 60, 145, 100); });
    make('candy_dv_globo_chicle', g => { g.fillStyle(0xf9a8d4, 1); g.fillCircle(80, 80, 55); });
    make('candy_dv_osito_verde', g => { g.fillStyle(0x22c55e, 1); g.fillCircle(80, 50, 28); g.fillEllipse(80, 105, 60, 70); });
  },

  // Fondos provisionales (solo si faltan las imágenes): cielo rosado con chupetines
  backdrop(g, idx, rng, W, H) {
    skyGradient(g, 0xbae6fd, 0xfbcfe8, W, H);
    for (let i = 0; i < 6; i++) { const x = rng.between(40, W - 40); g.fillStyle(0xffffff, 1); g.fillRect(x - 3, 300, 6, 170); g.fillStyle([0xf472b6, 0xfde047, 0x86efac][i % 3], 1); g.fillCircle(x, 290, 34); }
    g.fillStyle([0xfde68a, 0x92400e, 0xe0f2fe, 0xd6a35c, 0xbef264][idx], 1); g.fillRect(0, 470, W, H - 470);
  }
});
