// Imágenes y audios de cada mundo: dice qué archivo usa el juego para cada papel.
// Los archivos pueden tener cualquier nombre; lo importante es ponerlos aquí.
// Si un papel no tiene archivo, el juego usa su dibujo provisional (o la voz del navegador).
// Personajes: PNG con fondo transparente. Fondos: PNG o JPG horizontales.
//
// Papeles posibles en cada mundo:
//   target            objetivo de los capítulos 1-4 (lo que el niño debe encontrar)
//   dist1, dist2      distractores
//   dist3             distractor difícil (parecido al objetivo)
//   hero              protagonista (escenas de historia, lanza su poder)
//   hero_run          protagonista corriendo (Carrera); si falta, usa "hero"
//   villain           villano: objetivo del jefe final
//   villain_caught    villano atrapado en la red; si falta, se arma solo
//   friend1, friend2  amigos: distractores del jefe final
//   friend3           amigo parecido al villano (distractor difícil del jefe final)
//   net               red para atrapar al villano
//   end               ilustración del final del mundo
//   bg_1 ... bg_5     fondo de cada capítulo
//   voice_1 ... voice_5, voice_end   voz del personaje en cada capítulo y en el final (MP3)
window.ASSETS = {
  heroes: {             // carpeta assets/superheroes
    hero:    'superheroes/heroe_rayo.png',
    villain: 'superheroes/sombra.png',
    friend1: 'superheroes/capitan_estrella.png',
    friend2: 'superheroes/escudo_verde.png',
    friend3: 'superheroes/heroe_noche.png'
  },
  fantasy: {            // carpeta assets/dragones
    target:  'dragones/dragon_bebe_dorado.png',
    dist1:   'dragones/dragon_bebe_rojo.png',
    dist2:   'dragones/dragon_bebe_azul.png',
    dist3:   'dragones/dragon_bebe_amarillo_palido.png',
    hero:    'dragones/chispa_la_dragona.png',
    villain: 'dragones/morgana_la_hechicera.png',
    friend1: 'dragones/hada_del_bosque.png',
    friend2: 'dragones/mago_abuelo.png',
    bg_1:    'dragones/fondo_1_nido.jpg',
    bg_2:    'dragones/fondo_2_bosque.jpg'
  },
  kingdom: {            // carpeta assets/reino_magico
    target:  'reino_magico/hada_rosada_lumi.png',
    dist1:   'reino_magico/hada_azul.png',
    dist2:   'reino_magico/hada_verde.png',
    dist3:   'reino_magico/hada_lila.png',
    bg_1:    'reino_magico/fondo_1_jardin.jpg'
  }
};
