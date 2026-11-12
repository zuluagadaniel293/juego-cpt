// Mundo: Superhéroes. Sombra pinta su señal por toda la ciudad para asustar a la gente; Héroe Rayo las borra y lo atrapa.
// Cada capítulo (nivel) define su lugar, el texto del personaje, el minijuego, la dificultad y la duración.

registrarMundo('heroes', {
  // targetLabel: para mostrar · targetObj: para instrucciones ("Atrapa solo ___")
  theme: { label: 'Superhéroes', mission: 'detener las señales de Sombra', missionCount: 'Señales borradas', catcherName: 'el escudo', bg: 0x0f2a4a, accent: 0xfde047,
           targetLabel: 'la señal de Sombra', targetObj: 'la señal de Sombra',
           villain: 'Sombra', villainObj: 'a Sombra', chase: '¡Persíguelo!',
           rescueTitle: '¡Borra las señales de Sombra!' },   // jefe final, 1.ª fase (aquí no se rescata a nadie)

  story: {
    hero: 'Héroe Rayo',
    voice: { pitch: 1.25 },
    // Los juegos salen en orden aleatorio: si a un capítulo le toca otro juego, se usa su texto de aquí
    intro: '¡Hola! ¡Soy Héroe Rayo! El villano Sombra está pintando su señal por toda la ciudad para asustar a la gente. ¡Hay que detenerlo! ',
    mgLines: {
      classic: 'Sombra esconde su señal entre las señales de mis amigos héroes. ¡Toca solo la suya para borrarla con mi rayo!',
      catch: '¡Sombra lanza sus señales desde los tejados! Mueve el escudo de Escudo Verde y atrapa solo las de Sombra... ¡deja caer las de mis amigos!',
      race: '¡Sombra escapa soltando señales! Escudo Verde lo persigue: alcanza solo las señales de Sombra.',
      find: 'Sombra pegó su señal entre muchas otras... ¡Encuéntrala para borrarla! Y si no está, ¡no toques nada!',
      notx: '¡Al revés! Toca todas las señales de mis amigos héroes para encenderlas... ¡pero NUNCA la de Sombra!',
      ax: 'Sombra solo aparece después de la señal de la Capitana Estrella. ¡Toca su señal solo si justo antes salió la de ella!',
      memory: '¡Sombra pinta su señal en varios edificios, uno tras otro! Mira bien el orden y repítelo para borrarlas todas.',
      dodge: '¡Sombra me lanza bolas de humo desde los tejados! Muévete para esquivarlas... pero si una frena en el aire, ¡quédate quieto!',
      path: '¡Sombra borró las calles con su humo! Lleva a Héroe Rayo por el camino hasta su señal, sin salirte.'
    },
    // Niveles de personajes: el objetivo es el villano escondido entre los amigos (en vez de la señal).
    // En Pista, {pista} se cambia por el amigo que hace de pista (el primero que no es el compañero del capítulo).
    mgLinesCast: {
      classic: '¡Sombra se disfrazó y se mezcla con mis amigos héroes! Toca solo cuando aparezca él.',
      catch: '¡Sombra cae desde los tejados entre mis amigos! Atrápalo con la red... ¡y deja pasar a los demás!',
      race: '¡Sombra corre entre mis amigos héroes! Cambia de carril y alcánzalo solo a él.',
      find: 'Mis amigos y Sombra están todos juntos... ¡Encuentra a Sombra! Y si no está, ¡no toques nada!',
      memory: '¡Sombra salta de techo en techo! Mira bien por dónde pasó y repite su camino.',
      notx: '¡Al revés! Toca a todos mis amigos héroes... ¡pero NUNCA a Sombra!',
      ax: 'Sombra solo aparece justo después de {pista}: esa es la pista. ¡Toca a Sombra solo si justo antes salió {pista}!',
      dodge: '¡Sombra me lanza bolas de humo desde los tejados! Muévete para esquivarlas... pero si una frena en el aire, ¡quédate quieto!',
      path: '¡Sombra borró las calles con su humo! Lleva a Héroe Rayo por el camino hasta su señal, sin salirte.'
    },
    // Jefe final: sus 2 fases salen al azar (ver bossPhases en juego/nucleo/mundos.js); esto dice el protagonista antes
    bossLine: '¡Sombra está en su guarida pintando su señal gigante! Primero borra sus últimas señales y después atrápalo entre mis amigos héroes.',
    chapters: [
      { place: 'El Centro', mg: 'classic', level: 1, sec: 45,
        line: '¡Hola! ¡Soy Héroe Rayo! Sombra está pintando su señal por toda la ciudad. ¡Toca solo la suya para borrarla!' },
      { place: 'Barrio Norte', mg: 'catch', level: 2, sec: 60,
        line: '¡En Barrio Norte, Sombra lanza señales desde los tejados! Atrapa solo las suyas con el escudo de Escudo Verde.' },
      { place: 'El Puerto', mg: 'race', level: 3, sec: 75,
        line: '¡Sombra escapó al puerto soltando señales! Escudo Verde lo persigue: alcanza solo las de Sombra.' },
      { place: 'La Torre', mg: 'find', level: 4, sec: 90,
        line: 'Sombra llenó la torre de señales... ¡Encuentra la suya y bórrala! Y si no está, ¡no toques nada!' },
      // Jefe final: primero se atrapa al villano con la red y, cuando escapa, se le persigue
      { place: 'Guarida de Sombra', boss: true, level: 6, phases: [{ mg: 'catch', sec: 60 }, { mg: 'race', sec: 60 }],
        line: '¡Sombra está en su guarida pintando su señal gigante! Primero borra sus últimas señales y después atrápalo entre mis amigos héroes.' }
    ],
    ending: '¡Lo logramos! Borramos todas las señales y atrapamos a Sombra. La ciudad está a salvo gracias a ti. ¡Eres un gran héroe!',
    // Quién presenta cada capítulo (1 a 4): habla primero con su voz, y en los capítulos 1-3 acompaña al niño
    // mientras juega. En el 4, el villano se burla. role = papel de la imagen (friend1, friend2, friend3, villain)
    companions: [
      { role: 'friend1', name: 'Capitana Estrella', the: 'la Capitana Estrella', line: '¡Hola! Soy la Capitana Estrella. Sombra anda haciendo de las suyas por la ciudad. ¡Te acompaño en esta misión!' },
      { role: 'friend2', name: 'Escudo Verde', the: 'Escudo Verde', line: '¡Soy Escudo Verde! Yo te cubro con mi escudo. ¡Tú concéntrate y no te distraigas con nada!' },
      { role: 'friend3', name: 'Héroe Noche', the: 'Héroe Noche', line: 'Soy Héroe Noche. Me parezco un poco a Sombra, ¡pero soy de los buenos! Vamos juntos.' },
      { role: 'villain', name: 'Sombra', line: '¡Ja, ja! ¡Pintaré mi señal en cada rincón de la ciudad! ¡Nunca las borrarás todas!' }
    ]
  },

  power: { name: 'Rayo eléctrico', kind: 'bolt', color: 0xfde047, shout: '¡Zas!' },
  powerSound() {   // chispazo eléctrico + trueno
    sweep('sawtooth', 1600, 140, 0.22, 0.12);
    noise(0.12, 0.25, 'highpass', 2500);
    noise(0.7, 0.3, 'lowpass', 400, 80, 0.08);
  },

  // Dibujos provisionales (se reemplazan por las imágenes de assets/superheroes cuando existen)
  charSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="220" height="260" viewBox="0 0 220 260"><path d="M50,120 L170,120 L198,258 L22,258 Z" fill="#dc2626"/><path d="M65,120 Q110,106 155,120 L166,258 L54,258 Z" fill="#2563eb"/><polygon points="110,150 134,178 110,206 86,178" fill="#7c3aed"/><polygon points="114,158 100,182 110,182 105,198 120,176 111,176" fill="#fde047"/><rect x="98" y="104" width="24" height="20" fill="#f5c49c"/><circle cx="110" cy="70" r="48" fill="#f5c49c"/><path d="M62,64 Q66,18 110,20 Q156,18 158,64 Q140,42 110,44 Q80,42 62,64 Z" fill="#3f2a1d"/><path d="M62,62 Q110,50 158,62 L158,84 Q110,74 62,84 Z" fill="#7c3aed"/><ellipse cx="92" cy="72" rx="10" ry="7" fill="#ffffff"/><ellipse cx="128" cy="72" rx="10" ry="7" fill="#ffffff"/><circle cx="93" cy="72" r="4" fill="#0f172a"/><circle cx="127" cy="72" r="4" fill="#0f172a"/><path d="M96,98 Q110,110 124,98" stroke="#7c2d12" stroke-width="4" fill="none" stroke-linecap="round"/></svg>',
  people: {
    heroes_villain:  { cape: 0x111827, suit: 0x4c1d95, hair: 0x111827, mask: 0x000000, emblem: 0x7c3aed },
    heroes_friend1:  { cape: 0xffffff, suit: 0x2563eb, hair: 0x111827, mask: 0x1d4ed8, emblem: 0xffffff },
    heroes_friend2:  { cape: 0xfacc15, suit: 0x16a34a, hair: 0xfde68a, mask: 0x166534, emblem: 0x9ca3af },
    heroes_friend3:  { cape: 0xffffff, suit: 0x4c1d95, hair: 0x111827, mask: 0x312e81, emblem: 0xfacc15 }  // Héroe Noche (difícil)
  },

  // Distractores del entorno: cruzan por los bordes (fly = arriba, walk = abajo) y suenan de vez en cuando
  distractors: {
    // Personajes del mundo como distractores (no en la Prueba fija). minLevel: desde qué nivel aparecen (cada escena dice la frase de su capítulo).
    // fight = pelea en un borde · peek = el villano se asoma riéndose · sneak = cruza por arriba de puntillas ·
    // chase = uno huye por arriba y el otro lo persigue (flee: huye el amigo) · face = la cara del villano espía desde un lado
    cast: [
      { name: 'pelea_sombra_capitan', kind: 'fight', friend: 'friend1', voice: 'ayuda', minLevel: 2 },
      { name: 'sombra_se_asoma', kind: 'peek', voice: 'risa', minLevel: 1 },
      { name: 'sombra_persigue_capitana', kind: 'chase', flee: true, friend: 'friend1', voice: 'ayuda', minLevel: 2 },
      { name: 'sombra_escabulle', kind: 'sneak', voice: 'burla', minLevel: 1 },
      { name: 'sombra_espia', kind: 'face', voice: 'amenaza', minLevel: 3 }
    ],
    // Voces de los personajes (las graba herramientas/generar_voces.js; con emoción, generar_voces_elevenlabs.js).
    // Cada capítulo dice cosas distintas: text[0] = capítulo 1 ... text[3] = capítulo 4, text[4] = jefe final.
    // who = villain, friend (un texto por amigo, con su voz) o un amigo en particular (friend1...)
    voices: {
      risa:    { who: 'villain', text: [
        '¡Ja, ja, ja! ¡Nunca me atraparás!',
        '¡Jo, jo, jo! Aquí estoy... ¿o no?',
        '¡Je, je, je! ¡El puerto es mi escondite favorito!',
        '¡Ja, ja! ¡De noche nadie me ve!',
        '¡Ja, ja, ja! ¡Bienvenido a mi guarida, Héroe Rayo!'
      ] },
      burla:   { who: 'villain', text: [
        '¡Mi señal está por todas partes!',
        '¿Buscas mi señal? ¡Está detrás de ti! ¡Mentira!',
        '¡Los barcos se llevaron mi señal! ¿O fui yo?',
        '¡Desde la torre lo veo todo!',
        '¡Ni con tu rayo me vas a encontrar!'
      ] },
      amenaza: { who: 'villain', text: [
        '¡Esta ciudad será mía!',
        '¡Pintaré mi señal en cada casa del barrio!',
        '¡Cubriré el puerto de humo!',
        '¡Apagaré todas las luces de la ciudad!',
        '¡Nadie sale de mi guarida!'
      ] },
      ayuda:   { who: 'friend1', text: [   // solo el amigo que el villano ataca y persigue
        '¡Héroe Rayo, por aquí! ¡No puedo soltarme!',
        '¡Ay, no! ¡Ayuda, Héroe Rayo! ¡Sombra me atrapó!',
        '¡Sombra me empujó al muelle! ¡Ayuda!',
        '¡Está muy oscuro! ¡Héroe Rayo, ayúdame!'
      ] }
    },
    visual: [
      { name: 'avion', kind: 'fly', size: 100,
        sound(dir) { planeSound(dir); } },   // avión que pasa de un lado al otro (juego/nucleo/sonido.js)
      { name: 'pajaro', kind: 'fly', size: 65,
        sound() { [0, 0.22, 0.44, 1.2, 1.42].forEach(d => sweep('sine', 2600, 3900, 0.11, 0.06, d)); } },   // pío pío,
      { name: 'gato', kind: 'walk', size: 85,
        sound() { sweep('triangle', 480, 820, 0.28, 0.08); sweep('triangle', 820, 430, 0.42, 0.08, 0.28); } }   // miau
    ],
    sounds: {
      sirena()  { for (let i = 0; i < 3; i++) { sweep('sine', 650, 1000, 0.35, 0.07, i * 0.7); sweep('sine', 1000, 650, 0.35, 0.07, i * 0.7 + 0.35); } },
      bocina()  { sweep('square', 350, 350, 0.45, 0.06); sweep('square', 440, 440, 0.45, 0.04); },
      silbato() { sweep('sine', 2000, 2400, 0.25, 0.07); sweep('sine', 2400, 2000, 0.3, 0.07, 0.3); }
    }
  },

  // Capítulos 1-4: la señal de Sombra (su antifaz) entre señales de otros héroes
  textures(make) {
    // distractores del entorno (provisionales, mirando a la derecha)
    make('heroes_dv_avion', g => {
      g.fillStyle(0x94a3b8, 1); g.fillTriangle(22, 80, 14, 48, 44, 76);
      g.fillStyle(0xe5e7eb, 1); g.fillEllipse(84, 82, 130, 30);
      g.fillStyle(0x94a3b8, 1); g.fillPoints([{x:72,y:84},{x:104,y:84},{x:84,y:124},{x:66,y:124}], true);
      g.fillStyle(0x38bdf8, 1); for (let x = 60; x <= 120; x += 15) g.fillCircle(x, 78, 4);
    });
    make('heroes_dv_pajaro', g => {
      g.lineStyle(10, 0x1f2937, 1);
      g.strokePoints([{x:30,y:66},{x:58,y:84},{x:80,y:90},{x:102,y:84},{x:130,y:66}]);
    });
    make('heroes_dv_gato', g => {
      g.lineStyle(8, 0x1f2937, 1); g.strokePoints([{x:40,y:96},{x:22,y:80},{x:20,y:56}]);
      g.fillStyle(0x1f2937, 1); g.fillEllipse(78, 100, 84, 40);
      g.fillRect(48, 110, 9, 30); g.fillRect(62, 112, 9, 28); g.fillRect(92, 112, 9, 28); g.fillRect(106, 110, 9, 30);
      g.fillCircle(124, 80, 20); g.fillTriangle(108, 70, 114, 46, 124, 64); g.fillTriangle(128, 64, 138, 46, 142, 70);
      g.fillStyle(0xfde047, 1); g.fillCircle(118, 78, 3); g.fillCircle(132, 78, 3);
    });
    const rombo = g => { g.fillStyle(0x7c3aed, 1); g.fillPoints([{x:80,y:6},{x:154,y:80},{x:80,y:154},{x:6,y:80}], true); };
    make('heroes_target', g => {
      rombo(g);
      g.fillStyle(0x0f0f1a, 1);
      g.fillEllipse(56, 80, 54, 34); g.fillEllipse(104, 80, 54, 34); g.fillRect(56, 70, 48, 16);
      g.fillStyle(0xffffff, 1); g.fillEllipse(56, 80, 22, 10); g.fillEllipse(104, 80, 22, 10);
    });
    // Todas las señales son rombos del mismo tamaño: solo cambian el color y el símbolo,
    // así el niño tiene que mirar con atención y no reconocerla de lejos por la forma.
    const insignia = (g, color) => { g.fillStyle(color, 1); g.fillPoints([{x:80,y:6},{x:154,y:80},{x:80,y:154},{x:6,y:80}], true); };
    make('heroes_dist1', g => {          // Capitán Estrella: rombo azul con estrella
      insignia(g, 0x2563eb);
      g.fillStyle(0xffffff, 1); g.fillPoints(starPoints(80, 84, 38, 15), true);
    });
    make('heroes_dist2', g => {          // Escudo Verde: rombo verde con flecha
      insignia(g, 0x16a34a);
      g.fillStyle(0xffffff, 1);
      g.fillPoints([{x:80,y:46},{x:112,y:80},{x:92,y:80},{x:92,y:112},{x:68,y:112},{x:68,y:80},{x:48,y:80}], true);
    });
    make('heroes_dist3', g => {          // Héroe Noche (difícil): rombo MORADO con luna, igual color que Sombra
      rombo(g);
      g.fillStyle(0xffffff, 1); g.fillCircle(76, 80, 32);
      g.fillStyle(0x7c3aed, 1); g.fillCircle(92, 70, 28);
    });
  },

  // Fondos: Centro (día), Barrio Norte (atardecer), Puerto (tarde), Torre (noche), Guarida (noche de tormenta)
  backdrop(g, idx, rng, W, H) {
    const skies = [[0x38bdf8, 0xbae6fd], [0xf97316, 0xfde68a], [0x60a5fa, 0xfef3c7], [0x0b1026, 0x1e3a8a], [0x1e1b4b, 0x581c87]];
    const night = idx >= 3;
    skyGradient(g, skies[idx][0], skies[idx][1], W, H);
    if (idx === 0) { g.fillStyle(0xfde047, 1); g.fillCircle(820, 90, 42); }
    if (idx === 1) { g.fillStyle(0xfb923c, 1); g.fillCircle(480, 360, 70); }
    if (idx === 2) { g.fillStyle(0xfef08a, 1); g.fillCircle(160, 110, 36); }
    if (night) {
      g.fillStyle(0xffffff, 0.8);
      for (let i = 0; i < 60; i++) g.fillCircle(rng.between(0, W), rng.between(0, 260), rng.realInRange(0.8, 2));
      g.fillStyle(0xf8fafc, 1); g.fillCircle(820, 80, 30);
      g.fillStyle(skies[idx][0], 1); g.fillCircle(808, 72, 26);
    }
    const base = idx === 2 ? 430 : 480;
    const far = night ? 0x1e293b : mixColor(skies[idx][1], 0x475569, 0.45);
    const near = night ? 0x0f172a : mixColor(skies[idx][1], 0x1e293b, 0.6);
    for (let x = -20; x < W; ) { const w = rng.between(50, 100), h = rng.between(150, 290); g.fillStyle(far, 1); g.fillRect(x, base - h, w - 4, h); x += w; }
    if (idx === 4) { g.fillStyle(0x0f0f1a, 1); g.fillRect(640, 90, 90, base - 90); g.fillTriangle(630, 95, 740, 95, 685, 40); g.fillStyle(0xa855f7, 1); g.fillRect(670, 130, 30, 20); }
    for (let x = -10; x < W; ) {
      const w = rng.between(60, 120), h = rng.between(90, 210);
      g.fillStyle(near, 1); g.fillRect(x, base - h, w - 6, h);
      for (let wy = base - h + 14; wy < base - 16; wy += 24)
        for (let wx = x + 10; wx < x + w - 22; wx += 20) {
          if (night) g.fillStyle(rng.frac() < 0.45 ? 0xfde047 : 0x334155, 1);
          else g.fillStyle(0xe0f2fe, 0.55);
          g.fillRect(wx, wy, 10, 12);
        }
      x += w;
    }
    if (idx === 2) {
      g.fillStyle(0x0284c7, 1); g.fillRect(0, base, W, H - base);
      g.lineStyle(3, 0x7dd3fc, 0.7);
      for (let y = base + 20; y < H; y += 26) for (let x = rng.between(0, 60); x < W; x += 120) g.lineBetween(x, y, x + 40, y);
    } else {
      g.fillStyle(night ? 0x111827 : 0x475569, 1); g.fillRect(0, base, W, H - base);
      g.fillStyle(0xfde047, 0.6); for (let x = 20; x < W; x += 110) g.fillRect(x, base + 28, 50, 5);
    }
  }
});
