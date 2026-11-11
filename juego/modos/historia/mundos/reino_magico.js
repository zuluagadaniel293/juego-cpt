// Mundo: Reino mágico. La Reina Luna busca a Lumi, el hada rosada, y atrapa al Duende Pícaro.
// Cada capítulo (nivel) define su lugar, el texto del personaje, el minijuego, la dificultad y la duración.

registrarMundo('kingdom', {
  // targetLabel: para mostrar · targetObj: para instrucciones ("Atrapa solo ___")
  theme: { label: 'Reino mágico', bg: 0x4a1d4a, accent: 0xf472b6,
           targetLabel: 'Lumi, el hada rosada', targetObj: 'a Lumi, el hada rosada',
           villain: 'Duende Pícaro', villainObj: 'al Duende Pícaro', chase: '¡Persíguelo!' },

  story: {
    hero: 'Reina Luna',
    voice: { pitch: 1.35 },
    // Los juegos salen en orden aleatorio: si a un capítulo le toca otro juego, se usa su texto de aquí
    intro: '¡Hola! Soy la Reina Luna. Un hechizo dispersó a las hadas por el castillo. ',
    mgLines: {
      classic: 'Lumi, el hada rosada, aparece entre las demás hadas. ¡Toca solo cuando la veas a ella!',
      catch: '¡Las hadas caen como polvo de estrellas! Atrapa solo a Lumi.',
      race: '¡Lumi vuela por los pasillos! Corre y alcánzala solo a ella.',
      find: 'Aquí hay muchas hadas juntas... ¡Encuentra a Lumi! Y si no está, ¡no toques nada!',
      notx: '¡Al revés! Toca a todas las hadas... ¡menos a Lumi!',
      ax: 'Lumi siempre llega después del hada azul. ¡Toca a Lumi solo si justo antes salió el hada azul!',
      memory: '¡Lumi va dejando polvo mágico por donde vuela! Mira bien su camino y repítelo en el mismo orden.'
    },
    // Niveles de personajes: el objetivo es el villano escondido entre los amigos (en vez de la señal).
    // En Pista, {pista} se cambia por el amigo que hace de pista (el primero que no es el compañero del capítulo).
    mgLinesCast: {
      classic: '¡El Duende Pícaro se mezcla con la gente del castillo! Toca solo cuando aparezca él.',
      catch: '¡El Duende Pícaro salta desde las torres entre la gente del castillo! Atrápalo con la red... ¡y deja pasar a los demás!',
      race: '¡El Duende Pícaro corre por los pasillos entre la gente del castillo! Atrápalo solo a él.',
      find: 'La gente del castillo y el Duende Pícaro están todos juntos... ¡Encuéntralo! Y si no está, ¡no toques nada!',
      memory: '¡El Duende Pícaro se esconde de sala en sala! Mira bien por dónde pasó y repite su camino.',
      notx: '¡Al revés! Toca a toda la gente del castillo... ¡pero NUNCA al Duende Pícaro!',
      ax: 'El Duende Pícaro solo aparece justo después de {pista}: esa es la pista. ¡Tócalo solo si justo antes salió {pista}!'
    },
    // Jefe final: sus 2 fases salen al azar (ver bossPhases en juego/nucleo/mundos.js); esto dice el protagonista antes
    bossLine: '¡Fue el Duende Pícaro quien lanzó el hechizo! Se esconde entre la gente del castillo. ¡Atrapémoslo!',
    chapters: [
      { place: 'El Jardín', mg: 'classic', level: 1, sec: 45,
        line: '¡Hola! Soy la Reina Luna. Un hechizo dispersó a las hadas por todo el castillo... Busca a Lumi, el hada rosada que cuida mi corona.' },
      { place: 'La Cocina', mg: 'catch', level: 2, sec: 60,
        line: '¡Las hadas caen como polvo de estrellas en la cocina! Atrapa solo a Lumi.' },
      { place: 'La Biblioteca', mg: 'race', level: 3, sec: 75,
        line: '¡Lumi vuela entre los libros de la biblioteca! Corre por los pasillos y alcánzala solo a ella.' },
      { place: 'La Torre', mg: 'find', level: 4, sec: 90,
        line: 'En la torre hay muchas hadas juntas... ¡Encuentra a Lumi! Y si no está, ¡no toques nada!' },
      // Jefe final: primero se atrapa al villano con la red y, cuando escapa, se le persigue
      { place: 'El Salón del Trono', boss: true, level: 6, phases: [{ mg: 'catch', sec: 60 }, { mg: 'race', sec: 60 }],
        line: '¡Fue el Duende Pícaro quien lanzó el hechizo! Atrápalo con la red y, si escapa, ¡persíguelo!' }
    ],
    ending: '¡Atrapamos al Duende Pícaro y Lumi volvió a casa! Todo el reino está feliz gracias a ti.',
    // Quién presenta cada capítulo (1 a 4): habla primero con su voz, y en los capítulos 1-3 acompaña al niño
    // mientras juega. En el 4, el villano se burla. role = papel de la imagen (friend1, friend2, friend3, villain)
    companions: [
      { role: 'friend1', name: 'Guardia', the: 'el Guardia', line: '¡A sus órdenes, majestad! Soy el guardia del castillo. ¡Vamos a buscar a las hadas!' },
      { role: 'friend2', name: 'Bufón', the: 'el Bufón', line: '¡Ja, ja! ¡Soy el bufón del reino! Aunque yo haga chistes, tú no pierdas la concentración.' },
      { role: 'friend3', name: 'Duende Amable', the: 'el Duende Amable', line: 'Hola, soy el Duende Amable. No todos los duendes somos traviesos. ¡Yo te ayudo!' },
      { role: 'villain', name: 'Duende Pícaro', line: '¡Ji, ji, ji! ¡Escondí a las hadas por todo el castillo! ¡A ver si las encuentras!' }
    ]
  },

  // Las estrellas son solo contra el Duende (jefe final). A Lumi se le rescata con cariño, no se le ataca.
  power: { name: 'Polvo de estrellas', kind: 'stars', color: 0xf472b6, shout: '¡Magia!',
           rescue: { shout: '¡Rescatada!' } },
  powerSound() {   // campanitas mágicas + brillo
    [1046, 1318, 1568, 2093].forEach((f, i) => sweep('sine', f, f * 1.01, 0.35, 0.09, i * 0.06));
    noise(0.5, 0.05, 'highpass', 6000, null, 0.1);
  },

  // Dibujos provisionales (se reemplazan por las imágenes de assets/reino_magico cuando existen)
  charSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="220" height="260" viewBox="0 0 220 260"><path d="M56,84 Q56,24 110,24 Q164,24 164,84 L172,176 L48,176 Z" fill="#78350f"/><path d="M70,132 Q110,120 150,132 L184,258 L36,258 Z" fill="#db2777"/><path d="M88,130 Q110,148 132,130 Z" fill="#f9a8d4"/><rect x="100" y="106" width="20" height="26" fill="#f5c49c"/><circle cx="110" cy="80" r="44" fill="#f5c49c"/><path d="M66,72 Q72,36 110,36 Q148,36 154,72 Q130,54 110,60 Q90,54 66,72 Z" fill="#78350f"/><polygon points="80,42 86,8 100,28 110,4 120,28 134,8 140,42" fill="#facc15"/><polygon points="110,16 117,27 110,38 103,27" fill="#f472b6"/><circle cx="94" cy="84" r="5" fill="#0f172a"/><circle cx="126" cy="84" r="5" fill="#0f172a"/><circle cx="86" cy="98" r="7" fill="#fda4af" fill-opacity="0.7"/><circle cx="134" cy="98" r="7" fill="#fda4af" fill-opacity="0.7"/><path d="M96,102 Q110,114 124,102" stroke="#7c2d12" stroke-width="4" fill="none" stroke-linecap="round"/></svg>',
  people: {
    kingdom_villain: { suit: 0x7e22ce, hat: 0x166534, ears: true, emblem: 0xfacc15 },
    kingdom_friend1: { cape: 0x1d4ed8, suit: 0x9ca3af, hat: 0x9ca3af, emblem: 0x1d4ed8 },   // guardia
    kingdom_friend2: { cape: 0xdc2626, suit: 0xfacc15, hat: 0xdc2626, emblem: 0xdc2626 }    // bufón
  },

  // Distractores del entorno: cruzan por los bordes (fly = arriba, walk = abajo) y suenan de vez en cuando
  distractors: {
    // Personajes del mundo como distractores (no en la Prueba fija). minLevel: desde qué nivel aparecen (cada escena dice la frase de su capítulo).
    // fight = pelea en un borde · peek = el villano se asoma riéndose · sneak = cruza por arriba de puntillas ·
    // chase = el villano huye y el amigo lo persigue
    cast: [
      { name: 'guardia_persigue_duende', kind: 'chase', friend: 'friend1', voice: 'ayuda', minLevel: 2 },
      { name: 'duende_se_asoma', kind: 'peek', voice: 'risa', minLevel: 1 },
      { name: 'duende_escabulle', kind: 'sneak', voice: 'burla', minLevel: 1 },
      { name: 'duende_espia', kind: 'face', voice: 'amenaza', minLevel: 3 }
    ],
    // Voces de los personajes (las graba herramientas/generar_voces.js; con emoción, generar_voces_elevenlabs.js).
    // Cada capítulo dice cosas distintas: text[0] = capítulo 1 ... text[3] = capítulo 4, text[4] = jefe final.
    // who = villain, friend (un texto por amigo, con su voz) o un amigo en particular (friend1...)
    voices: {
      risa:    { who: 'villain', text: [
        '¡Ji, ji, ji! ¡No me pueden atrapar!',
        '¡Je, je! ¿Dónde estaré?',
        '¡Ji, ji! ¡Me escondí detrás de los libros!',
        '¡Je, je, je! ¡Desde la torre se ve todo!',
        '¡Ji, ji, ji! ¡Me senté en el trono!'
      ] },
      burla:   { who: 'villain', text: [
        '¡Psst! ¡Por aquí! ¡No, por allá!',
        '¡Me comí el pastel de la reina! ¡Ñam!',
        '¡Escondí a Lumi entre las páginas! ¿O no?',
        '¡Subí todas las escaleras y tú no!',
        '¡Majestad, la corona me queda mejor a mí!'
      ] },
      amenaza: { who: 'villain', text: [
        '¡Voy a esconder la corona!',
        '¡Voy a revolver todas las ollas!',
        '¡Desordenaré todos los libros del castillo!',
        '¡Cerraré la torre con llave!',
        '¡Ahora el castillo es mío!'
      ] },
      ayuda:   { who: 'friend', text: {
        friend1: [
          '¡Alto ahí, duende! ¡Ayuda, majestad, se escapa!',
          '¡Majestad, el duende se metió en la cocina! ¡Ayuda!',
          '¡Me tiró los libros encima! ¡Socorro!',
          '¡El duende me encerró en la torre! ¡Ayuda!'
        ],
        friend2: [
          '¡Esto no es un chiste! ¡Ayuda, majestad!',
          '¡Me cayó la sopa en el gorro! ¡Ayuda!',
          '¡El duende me escondió los cascabeles! ¡Socorro!',
          '¡Majestad, no me puedo bajar de la torre!'
        ],
        friend3: [
          '¡Yo soy el duende bueno! ¡Socorro!',
          '¡No fui yo, majestad! ¡Fue el otro duende!',
          '¡El Duende Pícaro me quiere atrapar! ¡Ayuda!',
          '¡Majestad, me confunden con el pícaro! ¡Ayuda!'
        ]
      } }
    },
    visual: [
      { name: 'libro_volador', kind: 'fly', size: 75,
        sound() { for (let i = 0; i < 6; i++) noise(0.09, 0.07, 'bandpass', 1600, 900, i * 0.2); } },   // páginas que aletean,
      { name: 'escoba_magica', kind: 'fly', size: 100,
        sound() { noise(1.6, 0.08, 'bandpass', 500, 2500); [0.3, 0.6, 0.9].forEach(d => sweep('sine', 2200, 3300, 0.12, 0.03, d)); } },   // zumbido y chispas mágicas,
      { name: 'raton', kind: 'walk', size: 95,
        sound() { [0, 0.18, 0.7].forEach(d => sweep('sine', 3400, 4300, 0.08, 0.06, d)); } }   // ñic ñic
    ],
    sounds: {
      campanas() { [523, 659, 784].forEach((f, i) => { sweep('sine', f, f * 1.002, 1.2, 0.06, i * 0.4); sweep('sine', f * 2, f * 2.004, 0.8, 0.02, i * 0.4); }); },
      puerta()   { sweep('sawtooth', 90, 140, 0.8, 0.05); noise(0.8, 0.04, 'bandpass', 800, 500); },
      reloj()    { for (let i = 0; i < 4; i++) noise(0.05, 0.15, 'highpass', 3000, null, i * 0.35); sweep('sine', 880, 880, 0.9, 0.05, 1.4); }
    }
  },

  // Lumi, el hada rosada, entre hadas de otros colores (todas iguales, solo cambia el color)
  textures(make) {
    // distractores del entorno (provisionales, mirando a la derecha)
    make('kingdom_dv_libro_volador', g => {
      g.fillStyle(0x92400e, 1); g.fillPoints([{x:20,y:60},{x:80,y:76},{x:80,y:124},{x:20,y:108}], true); g.fillPoints([{x:140,y:60},{x:80,y:76},{x:80,y:124},{x:140,y:108}], true);
      g.fillStyle(0xfef3c7, 1); g.fillPoints([{x:28,y:58},{x:80,y:72},{x:80,y:116},{x:28,y:102}], true); g.fillPoints([{x:132,y:58},{x:80,y:72},{x:80,y:116},{x:132,y:102}], true);
      g.lineStyle(2, 0xd6d3d1, 1); for (let y = 76; y <= 100; y += 8) { g.lineBetween(36, y - 6, 72, y + 4); g.lineBetween(124, y - 6, 88, y + 4); }
    });
    make('kingdom_dv_escoba_magica', g => {
      g.lineStyle(8, 0x92400e, 1); g.lineBetween(20, 72, 112, 84);
      g.fillStyle(0xfacc15, 1); g.fillPoints([{x:108,y:72},{x:150,y:62},{x:154,y:104},{x:108,y:94}], true);
      g.fillStyle(0xfde68a, 1); for (let i = 0; i < 4; i++) g.fillCircle(30 + i * 12, 60 - (i % 2) * 6, 3);
    });
    make('kingdom_dv_raton', g => {
      g.lineStyle(4, 0xf9a8d4, 1); g.strokePoints([{x:40,y:110},{x:20,y:104},{x:10,y:88}]);
      g.fillStyle(0x9ca3af, 1); g.fillEllipse(80, 106, 84, 46); g.fillTriangle(110, 90, 150, 106, 112, 122);
      g.fillCircle(104, 84, 14); g.fillStyle(0xf9a8d4, 1); g.fillCircle(104, 84, 8);
      g.fillStyle(0x0f172a, 1); g.fillCircle(132, 102, 3); g.fillStyle(0xf472b6, 1); g.fillCircle(150, 106, 4);
    });
    make('kingdom_target', g => drawFairy(g, 0xec4899, 0xfbcfe8));
    make('kingdom_dist1', g => drawFairy(g, 0x3b82f6, 0xbfdbfe));
    make('kingdom_dist2', g => drawFairy(g, 0x22c55e, 0xbbf7d0));
    make('kingdom_dist3', g => drawFairy(g, 0xc4b5fd, 0xede9fe));          // lila pálido (difícil)
  },

  // Fondos del castillo: Jardín, Cocina, Biblioteca, Torre, Salón del Trono
  backdrop(g, idx, rng, W, H) {
    if (idx === 0) {
      skyGradient(g, 0x7dd3fc, 0xfce7f3, W, H);
      g.fillStyle(0xe9d5ff, 1); g.fillRect(560, 160, 280, 240);
      [560, 660, 760].forEach(x => { g.fillRect(x, 110, 80, 60); g.fillStyle(0xc084fc, 1); g.fillTriangle(x - 6, 112, x + 86, 112, x + 40, 50); g.fillStyle(0xe9d5ff, 1); });
      g.fillStyle(0x16a34a, 1); for (let x = -20; x < W; x += 90) g.fillCircle(x, 450, 60);
      g.fillStyle(0x15803d, 1); g.fillRect(0, 460, W, H - 460);
      for (let i = 0; i < 30; i++) { g.fillStyle([0xf472b6, 0xfde047, 0xffffff][i % 3], 1); g.fillCircle(rng.between(0, W), rng.between(420, 530), 5); }
      return;
    }
    if (idx === 1) {
      g.fillStyle(0xfef3c7, 1); g.fillRect(0, 0, W, 380);
      g.lineStyle(2, 0xfde68a, 1); for (let x = 0; x < W; x += 40) g.lineBetween(x, 0, x, 380); for (let y = 0; y < 380; y += 40) g.lineBetween(0, y, W, y);
      for (let x = 0; x < W; x += 60) for (let y = 380; y < H; y += 40) { g.fillStyle(((x / 60 + (y - 380) / 40) % 2) ? 0xd6a26a : 0xb7834d, 1); g.fillRect(x, y, 60, 40); }
      g.fillStyle(0x92400e, 1); g.fillRect(0, 300, W, 80);
      g.fillStyle(0x7dd3fc, 1); g.fillRect(380, 60, 200, 150); g.lineStyle(8, 0x92400e, 1); g.strokeRect(380, 60, 200, 150); g.lineBetween(480, 60, 480, 210);
      [[120, 280], [220, 270], [760, 276], [850, 284]].forEach(([x, y]) => { g.fillStyle(0x64748b, 1); g.fillEllipse(x, y, 70, 40); });
      return;
    }
    if (idx === 2) {
      skyGradient(g, 0x7c2d12, 0x9a3412, W, H);
      const colors = [0xef4444, 0x3b82f6, 0x22c55e, 0xfacc15, 0xa855f7, 0xf97316];
      [[30, 280], [670, 280]].forEach(([sx, sw]) => {
        g.fillStyle(0x451a03, 1); g.fillRect(sx, 40, sw, 400);
        for (let sy = 60; sy < 420; sy += 90) for (let bx = sx + 12; bx < sx + sw - 18; ) {
          const bw = rng.between(10, 18); g.fillStyle(colors[rng.between(0, 5)], 1); g.fillRect(bx, sy + rng.between(0, 14), bw, 66); bx += bw + 3;
        }
      });
      g.fillStyle(0x78350f, 1); g.fillRect(0, 440, W, H - 440);
      return;
    }
    if (idx === 3) {
      g.fillStyle(0x6b7280, 1); g.fillRect(0, 0, W, H);
      g.lineStyle(2, 0x4b5563, 1);
      for (let y = 0; y < H; y += 36) { g.lineBetween(0, y, W, y); for (let x = (y / 36) % 2 ? 0 : 40; x < W; x += 80) g.lineBetween(x, y, x, y + 36); }
      g.fillStyle(0x1e3a8a, 1); g.fillCircle(480, 200, 120);
      g.fillStyle(0xffffff, 0.9); for (let i = 0; i < 20; i++) { const a = rng.frac() * Math.PI * 2, r = rng.frac() * 105; g.fillCircle(480 + Math.cos(a) * r, 200 + Math.sin(a) * r, 2); }
      g.lineStyle(10, 0x374151, 1); g.strokeCircle(480, 200, 120);
      g.fillStyle(0x4b5563, 1); g.fillRect(0, 460, W, H - 460);
      return;
    }
    skyGradient(g, 0x581c87, 0x7e22ce, W, H);
    g.fillStyle(0xdc2626, 1); g.fillPoints([{x:400,y:250},{x:560,y:250},{x:760,y:H},{x:200,y:H}], true);
    [90, 250, 710, 870].forEach(x => { g.fillStyle(0xe9d5ff, 1); g.fillRect(x - 25, 40, 50, 440); g.fillRect(x - 35, 30, 70, 20); });
    g.fillStyle(0xfacc15, 1); g.fillRect(430, 120, 100, 130); g.fillTriangle(430, 122, 530, 122, 480, 70);
    g.fillStyle(0xdc2626, 1); g.fillRect(450, 170, 60, 60);
  }
});
