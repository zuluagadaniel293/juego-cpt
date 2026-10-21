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
//   villain_sneak     villano de puntillas, escabulléndose (escenas de fondo); si falta, usa "villain"
//   villain_laugh     villano riéndose (se asoma por una esquina); si falta, usa "villain"
//   friend1, friend2  amigos: distractores del jefe final
//   friend3           amigo parecido al villano (distractor difícil del jefe final)
//   net               red para atrapar al villano
//   end               ilustración del final del mundo
//   bg_1 ... bg_5     fondo de cada capítulo
//   voice_1 ... voice_5, voice_end   voz del personaje en cada capítulo y en el final (MP3)
//   distractor_<nombre>   distractor del entorno (cruza por los bordes). Nombres de cada mundo:
//                         superheroes: avion, pajaro, gato · dragones: mariposa, murcielago, ardilla
//                         reino_magico: libro_volador, escoba_magica, raton
window.ASSETS = {
  heroes: {             // carpeta assets/superheroes
    target:  'superheroes/senal_de_sombra.png',
    dist1:   'superheroes/senal_capitan_estrella.png',
    dist2:   'superheroes/senal_escudo_verde.png',
    dist3:   'superheroes/senal_heroe_noche.png',
    hero:    'superheroes/heroe_rayo.png',
    villain: 'superheroes/sombra.png',
    villain_caught: 'superheroes/sombra_atrapado.png',
    villain_sneak: 'superheroes/sombra_puntillas.png',   // escenas de fondo: se escabulle
    villain_laugh: 'superheroes/sombra_risa.png',        // escenas de fondo: se asoma riéndose
    treasure: 'superheroes/tesoro_escudo.png',   // Misión perfecta
    friend1: 'superheroes/capitan_estrella.png',
    friend2: 'superheroes/escudo_verde.png',
    friend3: 'superheroes/heroe_noche.png',
    bg_1:    'superheroes/fondo_1_el_centro.png',
    bg_2:    'superheroes/fondo_2_barrio_norte.png',
    bg_3:    'superheroes/fondo_3_el_puerto.png',
    bg_4:    'superheroes/fondo_4_la_torre.png',
    bg_5:    'superheroes/fondo_5_guarida_de_sombra.png',
    distractor_avion:  'superheroes/avion.png',
    distractor_pajaro: 'superheroes/pajaro.png',
    distractor_gato:   'superheroes/gato.png',
    voice_1: 'superheroes/voz_capitulo_1.mp3',   // voces generadas por Leidy
    voice_2: 'superheroes/voz_capitulo_2.mp3'
  },
  fantasy: {            // carpeta assets/dragones
    target:  'dragones/dragon_bebe_dorado.png',
    dist1:   'dragones/dragon_bebe_rojo.png',
    dist2:   'dragones/dragon_bebe_azul.png',
    dist3:   'dragones/dragon_bebe_amarillo_palido.png',
    hero:    'dragones/chispa_la_dragona.png',
    villain: 'dragones/morgana_la_hechicera.png',
    villain_caught: 'dragones/morgana_atrapada.png',
    treasure: 'dragones/tesoro_gema.png',
    friend1: 'dragones/hada_del_bosque.png',
    friend2: 'dragones/mago_abuelo.png',
    friend3: 'dragones/hechicera_buena.png',
    bg_1:    'dragones/fondo_1_nido.jpg',
    bg_2:    'dragones/fondo_2_bosque.jpg',
    bg_3:    'dragones/fondo_3_el_rio.png',
    bg_4:    'dragones/fondo_4_la_cueva.png',
    bg_5:    'dragones/fondo_5_el_volcan.png',
    distractor_mariposa:   'dragones/mariposa.png',
    distractor_murcielago: 'dragones/murcielago.png',
    distractor_ardilla:    'dragones/ardilla.png'
  },
  kingdom: {            // carpeta assets/reino_magico
    target:  'reino_magico/hada_rosada_lumi.png',
    dist1:   'reino_magico/hada_azul.png',
    dist2:   'reino_magico/hada_verde.png',
    dist3:   'reino_magico/hada_lila.png',
    hero:    'reino_magico/reina_luna.png',
    villain: 'reino_magico/duende_picaro.png',
    villain_caught: 'reino_magico/duende_atrapado.png',
    treasure: 'reino_magico/tesoro_pastel.png',
    friend1: 'reino_magico/guardia.png',
    friend2: 'reino_magico/bufon.png',
    friend3: 'reino_magico/duende_amable.png',
    bg_1:    'reino_magico/fondo_1_jardin.jpg',
    bg_2:    'reino_magico/fondo_2_la_cocina.png',
    bg_3:    'reino_magico/fondo_3_la_biblioteca.png',
    bg_4:    'reino_magico/fondo_4_la_torre.png',
    bg_5:    'reino_magico/fondo_5_el_salon_del_trono.png',
    distractor_libro_volador: 'reino_magico/libro_volador.png',
    distractor_escoba_magica: 'reino_magico/escoba_magica.png',
    distractor_raton:         'reino_magico/raton.png'
  },
  // Objetos e íconos que comparten todos los mundos (carpeta assets/comunes)
  comunes: {
    basket:      'comunes/canasta.png',          // minijuego Atrapa
    net:         'comunes/red.png',              // atrapar al villano
    fireball:    'comunes/bola_de_fuego.png',    // poder de Chispa
    magicstar:   'comunes/estrella_magica.png',  // poder de la Reina Luna
    heart:       'comunes/corazon.png',          // rescate de compañeros
    spark:       'comunes/chispa.png',           // brillos al acertar
    icon_map:    'comunes/icono_mapa.png',
    icon_trophy: 'comunes/icono_trofeo.png',
    icon_lock:   'comunes/icono_candado.png',
    icon_find:   'comunes/icono_lupa.png',
    icon_memory: 'comunes/icono_memoria.png'     // modo Memoria
  }
};
