// Mundo: Dragones y fantasía. Morgana asustó a los dragoncitos dorados (los hermanitos de Chispa) y se escaparon
// del nido; Chispa los lleva de vuelta y atrapa a Morgana.
// Cada capítulo (nivel) define su lugar, el texto del personaje, el minijuego, la dificultad y la duración.

registrarMundo('fantasy', {
  // targetLabel: para mostrar · targetObj: para instrucciones ("Atrapa solo ___")
  theme: { label: 'Dragones y fantasía', mission: 'llevar a los dragoncitos dorados a su nido', missionCount: 'Dragoncitos en el nido', catcherName: 'el nido', bg: 0x1f3a2a, accent: 0xfacc15,
           targetLabel: 'el dragón bebé dorado', cueLabel: 'el dragoncito rojo', targetObj: 'a los dragoncitos dorados',
           villain: 'Morgana', villainObj: 'a Morgana', chase: '¡Persíguela!',
           rescueTitle: '¡Lleva a los dragoncitos al nido!' },

  story: {
    hero: 'Chispa, la dragona',
    voice: { pitch: 1.45 },
    // Saludo: suena una sola vez, antes de la frase del primer capítulo (audio 'intro')
    // Los juegos salen en orden aleatorio: cada capítulo usa la frase de su juego
    intro: '¡Hola! Soy Chispa. ¡Ayúdame a llevar a mis hermanitos al nido!',
    mgLines: {
      classic: '¡Toca solo a los dragoncitos dorados!',
      catch: '¡Recibe con el nido solo a los dragoncitos dorados!',
      race: '¡El Hada del Bosque persigue a Morgana! Alcanza solo a los dorados.',
      find: '¡Busca al dragoncito dorado! Si no está, no toques nada.',
      notx: '¡Al revés! Toca a todos los dragoncitos... ¡menos a los dorados!',
      ax: 'Toca al dorado solo si justo antes salió el dragoncito rojo.',
      memory: '¡Mira por dónde vuela mi hermanito y repite su camino!',
      dodge: '¡Morgana lanza hechizos! Ponte donde se detenga uno.',
      path: '¡Mira el camino del Hada del Bosque y repítelo de memoria!'
    },
    // Niveles de personajes: el objetivo es el villano escondido entre los amigos (en vez de la señal).
    // En Pista, {pista} se cambia por el amigo que hace de pista (el primero que no es el compañero del capítulo).
    mgLinesCast: {   // (Esquiva y Camino no tienen versión de personajes)
      classic: '¡Morgana se esconde entre los magos! Tócala solo a ella.',
      catch: '¡Atrapa a Morgana con la red y deja pasar a los magos!',
      race: '¡Morgana huye entre los magos! Alcánzala solo a ella.',
      find: '¡Busca a Morgana! Si no está, no toques nada.',
      memory: '¡Mira por dónde salta Morgana y repite su camino!',
      notx: '¡Al revés! Toca a los magos buenos... ¡menos a Morgana!',
      ax: 'Toca a Morgana solo si justo antes salió {pista}.'
    },
    // Jefe final: sus 2 fases salen al azar (ver bossPhases en juego/nucleo/mundos.js); esto dice el protagonista antes
    bossLine: '¡Morgana está en el volcán! Salva a los últimos dragoncitos y atrápala.',
    chapters: [
      { place: 'El Nido', mg: 'classic', level: 1, sec: 45 },
      { place: 'El Bosque', mg: 'catch', level: 2, sec: 60 },
      { place: 'El Río', mg: 'race', level: 3, sec: 75 },
      { place: 'La Cueva', mg: 'find', level: 4, sec: 90 },
      // Jefe final: primero se atrapa a la villana con la red y, cuando escapa, se la persigue
      { place: 'El Volcán', boss: true, level: 6, phases: [{ mg: 'catch', sec: 60 }, { mg: 'race', sec: 60 }] }
    ],
    ending: '¡Atrapamos a Morgana y mis hermanitos volvieron al nido! ¡Gracias!',
    // Quién acompaña cada capítulo (1 a 4). Solo hablan 3 personajes por mundo: el protagonista, el villano y el
    // amigo al que el villano ataca (el de distractors.voices.ayuda); los demás acompañan sin hablar (sin line).
    // role = papel de la imagen (friend1, friend2, friend3, villain)
    companions: [
      { role: 'friend1', name: 'Hada del Bosque', the: 'el Hada del Bosque' },
      { role: 'friend2', name: 'Mago Abuelo', the: 'el Mago Abuelo', line: 'Soy el Mago Abuelo. ¡Cuidado, que Morgana anda cerca!' },
      { role: 'friend3', name: 'Hechicera Buena', the: 'la Hechicera Buena' },
      { role: 'villain', name: 'Morgana', line: '¡Ja, ja, ja! ¡Esos dragoncitos nunca volverán al nido!' }
    ]
  },

  // El fuego es solo contra Morgana (jefe final). Al hermanito dorado se le rescata con cariño, no se le ataca.
  power: { name: 'Bola de fuego', kind: 'fire', color: 0xf97316, shout: '¡Fuego!',
           rescue: { shout: '¡Al nido!' } },
  powerSound() {   // llamarada + explosión
    noise(0.25, 0.25, 'bandpass', 300, 2500);
    noise(0.35, 0.35, 'lowpass', 1200, 100, 0.18);
    sweep('sine', 180, 50, 0.3, 0.2, 0.18);
  },

  // Dibujos provisionales (se reemplazan por las imágenes de assets/dragones cuando existen)
  charSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="220" height="260" viewBox="0 0 220 260"><path d="M50,160 L4,96 L34,108 L22,64 L80,128 Z" fill="#15803d"/><path d="M170,160 L216,96 L186,108 L198,64 L140,128 Z" fill="#15803d"/><ellipse cx="110" cy="204" rx="62" ry="56" fill="#22c55e"/><ellipse cx="110" cy="212" rx="36" ry="42" fill="#fef08a"/><polygon points="72,52 62,14 92,42" fill="#fde68a"/><polygon points="148,52 158,14 128,42" fill="#fde68a"/><ellipse cx="110" cy="90" rx="60" ry="54" fill="#22c55e"/><ellipse cx="110" cy="116" rx="36" ry="22" fill="#4ade80"/><circle cx="100" cy="110" r="3.5" fill="#166534"/><circle cx="120" cy="110" r="3.5" fill="#166534"/><circle cx="88" cy="80" r="13" fill="#ffffff"/><circle cx="132" cy="80" r="13" fill="#ffffff"/><circle cx="90" cy="81" r="7" fill="#0f172a"/><circle cx="130" cy="81" r="7" fill="#0f172a"/><path d="M96,122 Q110,134 124,122" stroke="#166534" stroke-width="4" fill="none" stroke-linecap="round"/></svg>',
  people: {
    fantasy_villain: { cape: 0x6d28d9, suit: 0x7c3aed, hair: 0x111827, hat: 0x5b21b6, emblem: 0x22c55e },
    fantasy_friend2: { cape: 0x1d4ed8, suit: 0x2563eb, hat: 0x1e40af, beard: true }   // Mago Abuelo
  },

  // Distractores del entorno: cruzan por los bordes (fly = arriba, walk = abajo) y suenan de vez en cuando
  distractors: {
    // Personajes del mundo como distractores (no en la Prueba fija). minLevel: desde qué nivel aparecen (cada escena dice la frase de su capítulo).
    // fight = pelea en un borde · peek = el villano se asoma riéndose · sneak = cruza por arriba de puntillas ·
    // chase = el villano huye y el amigo lo persigue
    cast: [
      { name: 'pelea_morgana_mago', kind: 'fight', friend: 'friend2', voice: 'ayuda', minLevel: 2 },
      { name: 'morgana_se_asoma', kind: 'peek', voice: 'risa', minLevel: 1 },
      { name: 'morgana_persigue_mago', kind: 'chase', flee: true, friend: 'friend2', voice: 'ayuda', minLevel: 2 },
      { name: 'morgana_escabulle', kind: 'sneak', voice: 'burla', minLevel: 1 },
      { name: 'morgana_espia', kind: 'face', voice: 'amenaza', minLevel: 3 }
    ],
    // Voces de los personajes (las graba herramientas/generar_voces.js; con emoción, generar_voces_elevenlabs.js).
    // Las risas y los "¡ayuda!" son comunes a todos los mundos (pool: ver juego/nucleo/voces_comunes.js);
    // las burlas y amenazas son de este mundo y se turnan por capítulo. Las amenazas pasan de verdad (THREAT_FX).
    voices: {
      risa:    { who: 'villain', pool: 'risa_f' },
      burla:   { who: 'villain', text: [
        '¿Quieres llevarlos al nido? ¡Primero atrápame!',
        '¡Tu fuego no me hace ni cosquillas!'
      ] },
      amenaza: { who: 'villain', text: [
        '¡Me llevaré todos los dragones del nido!',
        '¡Llenaré el bosque de enredaderas!',
        '¡Congelaré el río con mi varita!'
      ] },
      ayuda:   { who: 'friend2', pool: 'ayuda_m' }   // solo el amigo que el villano ataca y persigue
    },
    visual: [
      { name: 'mariposa', kind: 'fly', size: 60,
        sound() { [0, 0.3, 0.6, 0.9].forEach(d => { sweep('sine', 1800, 2400, 0.15, 0.03, d); noise(0.12, 0.03, 'highpass', 5000, null, d); }); } },   // aleteo y brillito,
      { name: 'murcielago', kind: 'fly', size: 75,
        sound() { [0, 0.15, 0.3, 0.9, 1.05].forEach(d => sweep('sine', 6200, 4200, 0.06, 0.05, d)); noise(1.2, 0.04, 'bandpass', 700, 500, 0.2); } },   // chillidos y aleteo,
      { name: 'ardilla', kind: 'walk', size: 85,
        sound() { for (let i = 0; i < 9; i++) noise(0.035, 0.14, 'highpass', 2800, null, i * 0.08 + (i > 4 ? 0.4 : 0)); } }   // parloteo de ardilla
    ],
    sounds: {
      // sin rugido: sonaba muy fuerte y asustaba (los dragones de este mundo son amigos)
      pajaros() { [0, 0.15, 0.3, 0.7, 0.85].forEach(d => sweep('sine', 2500, 3800, 0.1, 0.05, d)); },
      viento()  { noise(1.6, 0.12, 'bandpass', 300, 900); }
    }
  },

  // El dragón bebé dorado entre dragones bebé de otros colores (todos iguales, solo cambia el color)
  textures(make) {
    // distractores del entorno (provisionales, mirando a la derecha)
    make('fantasy_dv_mariposa', g => {
      g.fillStyle(0xa855f7, 1); g.fillEllipse(58, 62, 56, 60); g.fillEllipse(102, 62, 56, 60);
      g.fillStyle(0xf472b6, 1); g.fillEllipse(62, 106, 40, 40); g.fillEllipse(98, 106, 40, 40);
      g.fillStyle(0x1f2937, 1); g.fillEllipse(80, 84, 12, 70);
    });
    make('fantasy_dv_murcielago', g => {
      g.fillStyle(0x312e81, 1);
      g.fillPoints([{x:80,y:70},{x:20,y:50},{x:34,y:72},{x:14,y:90},{x:50,y:88},{x:80,y:104},{x:110,y:88},{x:146,y:90},{x:126,y:72},{x:140,y:50}], true);
      g.fillCircle(80, 78, 16); g.fillTriangle(70, 70, 72, 54, 78, 66); g.fillTriangle(90, 70, 88, 54, 82, 66);
      g.fillStyle(0xfacc15, 1); g.fillCircle(74, 78, 3); g.fillCircle(86, 78, 3);
    });
    make('fantasy_dv_ardilla', g => {
      g.fillStyle(0xb45309, 1); g.fillEllipse(40, 74, 50, 80);
      g.fillStyle(0x92400e, 1); g.fillEllipse(86, 106, 70, 44); g.fillCircle(124, 86, 20); g.fillTriangle(116, 70, 120, 56, 128, 70);
      g.fillRect(64, 118, 9, 22); g.fillRect(100, 118, 9, 22);
      g.fillStyle(0x0f172a, 1); g.fillCircle(130, 82, 3);
    });
    make('fantasy_target', g => drawBabyDragon(g, 0xfacc15, 0xfef9c3, 0xf59e0b));
    make('fantasy_dist1', g => drawBabyDragon(g, 0xef4444, 0xfecaca));
    make('fantasy_dist2', g => drawBabyDragon(g, 0x60a5fa, 0xdbeafe));
    make('fantasy_dist3', g => drawBabyDragon(g, 0xfde68a, 0xfefce8));     // amarillo pálido (difícil)
    make('fantasy_friend1', g => drawFairy(g, 0x16a34a, 0xbbf7d0));        // hada del bosque (jefe final)
  },

  // Fondos: Nido (día), Bosque, Río, Cueva, Volcán
  backdrop(g, idx, rng, W, H) {
    if (idx === 3) {
      skyGradient(g, 0x1c1917, 0x44403c, W, H);
      g.fillStyle(0x57534e, 1);
      for (let x = 0; x < W; x += 60) { const h = rng.between(40, 130); g.fillTriangle(x, 0, x + 50, 0, x + 25, h); }
      for (let x = 30; x < W; x += 90) { const h = rng.between(30, 90); g.fillTriangle(x, H, x + 60, H, x + 30, H - h); }
      g.fillStyle(0x67e8f9, 0.8);
      for (let i = 0; i < 14; i++) { const x = rng.between(20, W - 20), y = rng.between(380, 520); g.fillTriangle(x, y, x + 10, y, x + 5, y - 22); }
      return;
    }
    if (idx === 4) {
      skyGradient(g, 0x7f1d1d, 0xf97316, W, H);
      g.fillStyle(0x6b7280, 0.5); for (let i = 0; i < 6; i++) g.fillCircle(480 + rng.between(-60, 60), 120 - i * 18, 30 + i * 6);
      g.fillStyle(0x292524, 1); g.fillTriangle(200, 470, 760, 470, 480, 140);
      g.fillStyle(0xef4444, 1); g.fillTriangle(440, 205, 520, 205, 480, 150); g.fillRect(470, 205, 20, 120);
      g.fillStyle(0x1c1917, 1); g.fillRect(0, 470, W, H - 470);
      return;
    }
    const skies = [[0x7dd3fc, 0xe0f2fe], [0x84cc16, 0xecfccb], [0x7dd3fc, 0xf0fdf4]];
    skyGradient(g, skies[idx][0], skies[idx][1], W, H);
    if (idx !== 1) { g.fillStyle(0xfde047, 1); g.fillCircle(830, 90, 38); }
    g.fillStyle(0x4ade80, 1); g.fillEllipse(220, 520, 700, 300); g.fillStyle(0x22c55e, 1); g.fillEllipse(760, 540, 760, 320);
    const trees = idx === 1 ? 16 : 6;
    for (let i = 0; i < trees; i++) {
      const x = rng.between(0, W), y = rng.between(330, 430), s = rng.realInRange(0.7, 1.3);
      g.fillStyle(0x78350f, 1); g.fillRect(x - 6 * s, y, 12 * s, 50 * s);
      g.fillStyle(i % 2 ? 0x166534 : 0x15803d, 1); g.fillTriangle(x - 45 * s, y + 10, x + 45 * s, y + 10, x, y - 100 * s);
    }
    if (idx === 2) {
      g.fillStyle(0x38bdf8, 1); g.fillPoints([{x:0,y:450},{x:300,y:420},{x:600,y:460},{x:W,y:430},{x:W,y:500},{x:600,y:530},{x:300,y:495},{x:0,y:520}], true);
    }
  }
});

// Dragón bebé provisional: todos iguales, solo cambia el color
function drawBabyDragon(g, color, belly, spots) {
  g.fillStyle(color, 0.75);
  g.fillTriangle(48, 82, 8, 40, 32, 104); g.fillTriangle(112, 82, 152, 40, 128, 104);
  g.fillStyle(color, 1); g.fillEllipse(80, 114, 74, 62);
  g.fillStyle(belly, 1); g.fillEllipse(80, 120, 42, 40);
  g.fillStyle(0xfef3c7, 1); g.fillTriangle(60, 36, 54, 12, 72, 30); g.fillTriangle(100, 36, 106, 12, 88, 30);
  g.fillStyle(color, 1); g.fillCircle(80, 62, 34);
  g.fillStyle(0xffffff, 1); g.fillCircle(67, 58, 9); g.fillCircle(93, 58, 9);
  g.fillStyle(0x0f172a, 1); g.fillCircle(68, 59, 5); g.fillCircle(92, 59, 5);
  g.fillCircle(74, 76, 2); g.fillCircle(86, 76, 2);
  if (spots) { g.fillStyle(spots, 1); g.fillCircle(60, 104, 6); g.fillCircle(102, 110, 7); g.fillCircle(84, 140, 5); }
}
