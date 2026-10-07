// Mundo: Superhéroes. Héroe Rayo atrapa al villano Sombra.
// Cada capítulo (nivel) define su lugar, el texto del personaje, el minijuego, la dificultad y la duración.

registrarMundo('heroes', {
  // targetLabel: para mostrar · targetObj: para instrucciones ("Atrapa solo ___")
  theme: { label: 'Superhéroes', bg: 0x0f2a4a, accent: 0xfde047,
           targetLabel: 'la señal de Sombra', targetObj: 'la señal de Sombra',
           villain: 'Sombra', villainObj: 'a Sombra', chase: '¡Persíguelo!' },

  story: {
    hero: 'Héroe Rayo',
    voice: { pitch: 1.25 },
    chapters: [
      { place: 'El Centro', mg: 'classic', level: 1, sec: 45,
        line: '¡Hola! ¡Soy Héroe Rayo! El villano Sombra esconde su señal entre las señales de mis amigos héroes. ¡Toca solo la suya!' },
      { place: 'Barrio Norte', mg: 'catch', level: 2, sec: 60,
        line: '¡Sombra lanza su señal desde los tejados! Atrápala con la canasta... ¡y deja caer las de mis amigos!' },
      { place: 'El Puerto', mg: 'race', level: 3, sec: 75,
        line: '¡Escapó al puerto! Corre por los muelles y agarra solo sus señales. ¡Vamos!' },
      { place: 'La Torre', mg: 'find', level: 4, sec: 90,
        line: 'En la torre hay muchas señales juntas... ¡Encuentra la de Sombra! Y si no está, ¡no toques nada!' },
      // Jefe final: primero se atrapa al villano con la red y, cuando escapa, se le persigue
      { place: 'Guarida de Sombra', boss: true, level: 6, phases: [{ mg: 'catch', sec: 60 }, { mg: 'race', sec: 60 }],
        line: '¡Ahí está Sombra en persona! Atrápalo con la red y, si escapa, ¡persíguelo!' }
    ],
    ending: '¡Lo logramos! ¡Atrapamos a Sombra! La ciudad está a salvo gracias a ti. ¡Eres un gran héroe!'
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
    visual: [
      { name: 'avion', kind: 'fly', size: 100 },
      { name: 'pajaro', kind: 'fly', size: 65 },
      { name: 'gato', kind: 'walk', size: 85 }
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
    make('heroes_dist1', g => {          // Capitán Estrella
      g.fillStyle(0x2563eb, 1); g.fillCircle(80, 80, 66);
      g.fillStyle(0xffffff, 1); g.fillPoints(starPoints(80, 84, 44, 18), true);
    });
    make('heroes_dist2', g => {          // Escudo Verde
      g.fillStyle(0x16a34a, 1);
      g.fillPoints([{x:22,y:18},{x:138,y:18},{x:138,y:80},{x:80,y:150},{x:22,y:80}], true);
      g.fillStyle(0xffffff, 1);
      g.fillPoints([{x:80,y:40},{x:116,y:80},{x:94,y:80},{x:94,y:116},{x:66,y:116},{x:66,y:80},{x:44,y:80}], true);
    });
    make('heroes_dist3', g => {          // parecido al objetivo: rombo morado con estrella
      rombo(g);
      g.fillStyle(0xffffff, 1); g.fillPoints(starPoints(80, 84, 36, 15), true);
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
