// Mundo: Dragones y fantasía. Chispa busca a su hermanito, un dragón bebé dorado, y atrapa a Morgana.
// Cada capítulo (nivel) define su lugar, el texto del personaje, el minijuego, la dificultad y la duración.

registrarMundo('fantasy', {
  // targetLabel: para mostrar · targetObj: para instrucciones ("Atrapa solo ___")
  theme: { label: 'Dragones y fantasía', bg: 0x1f3a2a, accent: 0xfacc15,
           targetLabel: 'el dragón bebé dorado', targetObj: 'al dragón bebé dorado',
           villain: 'Morgana', villainObj: 'a Morgana', chase: '¡Persíguela!' },

  story: {
    hero: 'Chispa, la dragona',
    voice: { pitch: 1.45 },
    chapters: [
      { place: 'El Nido', mg: 'classic', level: 1, sec: 45,
        line: '¡Hola! ¡Soy Chispa! Mi hermanito, un dragón bebé dorado, se perdió entre dragones de otras familias... ¿Me ayudas a encontrarlo?' },
      { place: 'El Bosque', mg: 'catch', level: 2, sec: 60,
        line: '¡Los dragoncitos bajan volando del bosque! Atrapa solo a mi hermanito dorado.' },
      { place: 'El Río', mg: 'race', level: 3, sec: 75,
        line: '¡Mi hermanito está jugando en el río! Corre por la orilla y alcánzalo solo a él.' },
      { place: 'La Cueva', mg: 'find', level: 4, sec: 90,
        line: 'La cueva está llena de dragoncitos... ¡Busca al dorado! Y si no está, ¡no toques nada!' },
      // Jefe final: primero se atrapa a la villana con la red y, cuando escapa, se la persigue
      { place: 'El Volcán', boss: true, level: 6, phases: [{ mg: 'catch', sec: 60 }, { mg: 'race', sec: 60 }],
        line: '¡Fue la hechicera Morgana! Atrápala con la red y, si escapa, ¡persíguela!' }
    ],
    ending: '¡Atrapamos a Morgana y mi hermanito está a salvo! ¡Ahora eres parte de la familia de los dragones!'
  },

  power: { name: 'Bola de fuego', kind: 'fire', color: 0xf97316, shout: '¡Fuego!' },
  powerSound() {   // llamarada + explosión
    noise(0.25, 0.25, 'bandpass', 300, 2500);
    noise(0.35, 0.35, 'lowpass', 1200, 100, 0.18);
    sweep('sine', 180, 50, 0.3, 0.2, 0.18);
  },

  // Dibujos provisionales (se reemplazan por las imágenes de assets/fantasy cuando existen)
  charSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="220" height="260" viewBox="0 0 220 260"><path d="M50,160 L4,96 L34,108 L22,64 L80,128 Z" fill="#15803d"/><path d="M170,160 L216,96 L186,108 L198,64 L140,128 Z" fill="#15803d"/><ellipse cx="110" cy="204" rx="62" ry="56" fill="#22c55e"/><ellipse cx="110" cy="212" rx="36" ry="42" fill="#fef08a"/><polygon points="72,52 62,14 92,42" fill="#fde68a"/><polygon points="148,52 158,14 128,42" fill="#fde68a"/><ellipse cx="110" cy="90" rx="60" ry="54" fill="#22c55e"/><ellipse cx="110" cy="116" rx="36" ry="22" fill="#4ade80"/><circle cx="100" cy="110" r="3.5" fill="#166534"/><circle cx="120" cy="110" r="3.5" fill="#166534"/><circle cx="88" cy="80" r="13" fill="#ffffff"/><circle cx="132" cy="80" r="13" fill="#ffffff"/><circle cx="90" cy="81" r="7" fill="#0f172a"/><circle cx="130" cy="81" r="7" fill="#0f172a"/><path d="M96,122 Q110,134 124,122" stroke="#166534" stroke-width="4" fill="none" stroke-linecap="round"/></svg>',
  people: {
    fantasy_villain: { cape: 0x6d28d9, suit: 0x7c3aed, hair: 0x111827, hat: 0x5b21b6, emblem: 0x22c55e },
    fantasy_friend2: { cape: 0x1d4ed8, suit: 0x2563eb, hat: 0x1e40af, beard: true }   // Mago Abuelo
  },

  // El dragón bebé dorado entre dragones bebé de otros colores (todos iguales, solo cambia el color)
  textures(make) {
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
