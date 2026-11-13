// Mundo: Océano. El Pulpo Tinta quiere atrapar a Perla, el caballito de mar rosado; Coral la protege y atrapa al pulpo.
// Cada capítulo (nivel) define su lugar, el texto del personaje, el minijuego, la dificultad y la duración.

registrarMundo('ocean', {
  // targetLabel: para mostrar · targetObj: para instrucciones ("Atrapa solo ___")
  theme: { label: 'Océano', mission: 'proteger a Perla del Pulpo Tinta', missionCount: 'Burbujas para Perla', catcherName: 'la concha', bg: 0x083344, accent: 0x2dd4bf,
           targetLabel: 'Perla, el caballito rosado', cueLabel: 'el caballito azul', targetObj: 'a Perla, el caballito rosado',
           villain: 'Pulpo Tinta', villainObj: 'al Pulpo Tinta', chase: '¡Persíguelo!',
           rescueTitle: '¡Protege a Perla!' },

  story: {
    hero: 'Coral',
    voice: { pitch: 1.3 },
    // Saludo: suena una sola vez, antes de la frase del primer capítulo (audio 'intro')
    // Los juegos salen en orden aleatorio: cada capítulo usa la frase de su juego
    intro: '¡Hola! Soy Coral. ¡Ayúdame a proteger a Perla del Pulpo Tinta!',
    mgLines: {
      classic: '¡Toca solo a Perla para cubrirla con una burbuja!',
      catch: '¡Guarda en la concha solo a Perla!',
      race: '¡Pinzas persigue al Pulpo Tinta! Alcanza solo a Perla.',
      find: '¡Busca a Perla! Si no está, no toques nada.',
      notx: '¡Al revés! Toca a todos los caballitos... ¡menos a Perla!',
      ax: 'Toca a Perla solo si justo antes salió el caballito azul.',
      memory: '¡Mira por dónde nada Perla y repite su camino!',
      dodge: '¡El Pulpo Tinta lanza tinta! Nada a donde se detenga una bola.',
      path: '¡Mira el camino de Pinzas y repítelo de memoria!'
    },
    // Niveles de personajes: el objetivo es el villano escondido entre los amigos (en vez de la señal).
    // En Pista, {pista} se cambia por el amigo que hace de pista (el primero que no es el compañero del capítulo).
    mgLinesCast: {   // (Esquiva y Camino no tienen versión de personajes)
      classic: '¡El Pulpo Tinta se mezcla con los animales del mar! Tócalo solo a él.',
      catch: '¡Atrapa al Pulpo Tinta con la red y deja pasar a los demás!',
      race: '¡El Pulpo Tinta nada entre mis amigos! Alcánzalo solo a él.',
      find: '¡Busca al Pulpo Tinta! Si no está, no toques nada.',
      memory: '¡Mira por dónde pasa el Pulpo Tinta y repite su camino!',
      notx: '¡Al revés! Toca a los animales del mar... ¡menos al Pulpo Tinta!',
      ax: 'Toca al Pulpo Tinta solo si justo antes salió {pista}.'
    },
    // Jefe final: sus 2 fases salen al azar (ver bossPhases en juego/nucleo/mundos.js); esto dice el protagonista antes
    bossLine: '¡Perla está en la fosa oscura! Protégela y atrapa al Pulpo Tinta.',
    chapters: [
      { place: 'El Arrecife de Coral', mg: 'classic', level: 1, sec: 45 },
      { place: 'El Barco Hundido', mg: 'catch', level: 2, sec: 60 },
      { place: 'El Bosque de Algas', mg: 'race', level: 3, sec: 75 },
      { place: 'La Cueva de Cristales', mg: 'find', level: 4, sec: 90 },
      { place: 'La Fosa Oscura', boss: true, level: 6, phases: [{ mg: 'catch', sec: 60 }, { mg: 'race', sec: 60 }] }
    ],
    ending: '¡Atrapamos al Pulpo Tinta y Perla está a salvo! ¡Gracias!',
    // Quién acompaña cada capítulo (1 a 4). Solo hablan 3 personajes por mundo: el protagonista, el villano y el
    // amigo al que el villano ataca (el de distractors.voices.ayuda); los demás acompañan sin hablar (sin line).
    // role = papel de la imagen (friend1, friend2, friend3, villain)
    companions: [
      { role: 'friend1', name: 'Delfi', the: 'Delfi', line: '¡Hola! Soy Delfi. ¡Nada conmigo y protejamos a Perla!' },
      { role: 'friend2', name: 'Pinzas', the: 'Pinzas' },
      { role: 'friend3', name: 'Pulpi', the: 'Pulpi' },
      { role: 'villain', name: 'Pulpo Tinta', line: '¡Je, je, je! ¡Con mi tinta atraparé a Perla!' }
    ]
  },

  // Las burbujas son solo contra el Pulpo Tinta (jefe final). A Perla se le rescata, no se le ataca.
  power: { name: 'Burbujas mágicas', kind: 'bubbles', color: 0x67e8f9, shout: '¡Burbujas!',
           rescue: { shout: '¡Protegida!' } },
  powerSound() {   // burbujas que suben
    for (let i = 0; i < 6; i++) sweep('sine', 400 + i * 90, 1400 + i * 120, 0.12, 0.07, i * 0.06);
  },

  // Dibujo provisional de Coral (se reemplaza por assets/oceano/coral.png)
  charSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="220" height="260" viewBox="0 0 220 260"><rect x="60" y="120" width="100" height="130" rx="30" fill="#14b8a6"/><circle cx="110" cy="80" r="50" fill="#f5c49c"/><rect x="70" y="60" width="80" height="34" rx="14" fill="#a5f3fc" stroke="#0f172a" stroke-width="5"/><circle cx="96" cy="77" r="5" fill="#0f172a"/><circle cx="124" cy="77" r="5" fill="#0f172a"/></svg>',
  people: {},

  // Distractores del entorno: cruzan por los bordes (fly = arriba, walk = abajo) y suenan de vez en cuando
  distractors: {
    // Personajes del mundo como distractores (no en la Prueba fija). minLevel: desde qué nivel aparecen (cada escena dice la frase de su capítulo).
    // fight = pelea en un borde · peek = el villano se asoma riéndose · sneak = cruza por arriba ·
    // chase = uno huye por arriba y el otro lo persigue (flee: huye el amigo) · face = la cara del villano espía desde un lado
    cast: [
      { name: 'pelea_pulpo_delfi', kind: 'fight', friend: 'friend1', voice: 'ayuda', minLevel: 2 },
      { name: 'pulpo_se_asoma', kind: 'peek', voice: 'risa', minLevel: 1 },
      { name: 'pulpo_persigue_delfi', kind: 'chase', flee: true, friend: 'friend1', voice: 'ayuda', minLevel: 2 },
      { name: 'pulpo_escabulle', kind: 'sneak', voice: 'burla', minLevel: 1 },
      { name: 'pulpo_espia', kind: 'face', voice: 'amenaza', minLevel: 3 }
    ],
    // Voces de los personajes (las graba herramientas/generar_voces.js; con emoción, generar_voces_elevenlabs.js).
    // Las risas y los "¡ayuda!" son comunes a todos los mundos (pool: ver juego/nucleo/voces_comunes.js);
    // las burlas y amenazas son de este mundo y se turnan por capítulo. Las amenazas pasan de verdad (THREAT_FX).
    voices: {
      risa:    { who: 'villain', pool: 'risa_m' },
      burla:   { who: 'villain', text: [
        '¡Tengo ocho brazos y tú solo dos!',
        '¡Tus burbujas no me asustan!'
      ] },
      amenaza: { who: 'villain', text: [
        '¡El mar entero será oscuro!',
        '¡Hundiré otro barco con mi tinta!',
        '¡Enredaré a todos en las algas!'
      ] },
      ayuda:   { who: 'friend1', pool: 'ayuda_m' }   // solo el amigo que el villano ataca y persigue
    },
    visual: [
      { name: 'medusa', kind: 'fly', size: 85,
        sound() { [0, 0.4, 0.8].forEach(d => sweep('sine', 300, 600, 0.3, 0.05, d)); } },   // medusa que flota (blub)
      { name: 'banco_de_peces', kind: 'fly', size: 110,
        sound() { noise(1.8, 0.05, 'bandpass', 1200, 2400); for (let i = 0; i < 5; i++) sweep('sine', 900, 1800, 0.06, 0.04, i * 0.3); } },   // peces que pasan rápido
      { name: 'estrella_de_mar', kind: 'walk', size: 80,
        sound() { [0, 0.35, 0.7, 1.05].forEach(d => noise(0.08, 0.06, 'lowpass', 900, 400, d)); } }   // pasitos en la arena
    ],
    sounds: {
      burbujas() { for (let i = 0; i < 8; i++) sweep('sine', 500 + Math.random() * 300, 1500 + Math.random() * 500, 0.08, 0.05, i * 0.12); },
      ballena()  { sweep('sine', 300, 180, 1.6, 0.05); sweep('sine', 180, 260, 1.2, 0.04, 1.4); },
      corriente() { noise(2.0, 0.05, 'lowpass', 600, 250); }
    }
  },

  // Provisionales (solo si faltan las imágenes): Perla y los otros caballitos
  textures(make) {
    const horse = (body, pearl) => g => {
      g.fillStyle(body, 1); g.fillCircle(84, 40, 24); g.fillEllipse(78, 84, 46, 60);
      g.lineStyle(14, body, 1); g.beginPath(); g.arc(90, 118, 18, Math.PI, Math.PI * 2.4, true); g.strokePath();
      g.fillStyle(0x0f172a, 1); g.fillCircle(90, 36, 4);
      if (pearl) { g.fillStyle(0xffffff, 1); g.fillCircle(108, 132, 7); }
    };
    make('ocean_target', horse(0xf472b6, true));
    make('ocean_dist1', horse(0x38bdf8, false));
    make('ocean_dist2', horse(0x4ade80, false));
    make('ocean_dist3', horse(0xd8b4fe, false));          // lila (difícil)
    make('ocean_dv_medusa', g => { g.fillStyle(0xf9a8d4, 1); g.fillEllipse(80, 60, 80, 50); g.lineStyle(4, 0xc4b5fd, 1); [55, 70, 85, 100].forEach(x => g.lineBetween(x, 80, x, 130)); });
    make('ocean_dv_banco_de_peces', g => { g.fillStyle(0xfb923c, 1); [[50, 60], [100, 50], [70, 100], [120, 95]].forEach(([x, y]) => { g.fillEllipse(x, y, 34, 18); g.fillTriangle(x - 16, y, x - 28, y - 9, x - 28, y + 9); }); });
    make('ocean_dv_estrella_de_mar', g => { g.fillStyle(0xf97316, 1); const p = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 22 : 55; p.push({ x: 80 + Math.cos(a) * r, y: 85 + Math.sin(a) * r }); } g.fillPoints(p, true); });
  },

  // Fondos provisionales (solo si faltan las imágenes): agua que se oscurece capítulo a capítulo
  backdrop(g, idx, rng, W, H) {
    const tops = [0x67e8f9, 0x22d3ee, 0x0891b2, 0x155e75, 0x0c1a3a];
    skyGradient(g, tops[idx], 0x083344, W, H);
    g.fillStyle(0xffffff, 0.25); for (let i = 0; i < 30; i++) g.fillCircle(rng.between(0, W), rng.between(0, H), rng.between(3, 8));
    g.fillStyle(0xfde68a, 1); g.fillRect(0, 480, W, H - 480);
  }
});
