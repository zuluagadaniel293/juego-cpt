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
//   villain_taunt     villano burlándose (presenta el capítulo 4); villain_run: corriendo; villain_scared: asustado
//                     (si faltan, usan "villain") · villain_face: solo la cara, espiando desde un lado (si falta, no sale)
//   friend1_help, friend1_cower, friend1_flee   poses del amigo 1 (igual friend2_..., friend3_...): pidiendo ayuda,
//                     cubriéndose del ataque, huyendo asustado. Si faltan, se usa su imagen normal.
//   friend1_cheer ...  amigo celebrando: el compañero de la esquina cambia a esta pose al saltar cuando el niño acierta
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
    villain_taunt: 'superheroes/sombra_encorvado.png',   // presenta el capítulo 4
    villain_run:   'superheroes/sombra_corriendo.png',   // persigue a la Capitana
    villain_face:  'superheroes/sombra_cara.png',        // espía desde un lado
    villain_scared:'superheroes/sombra_asustado.png',
    friend1_help:  'superheroes/capitan_ayuda.png',      // pelea: la Capitana pide ayuda
    friend1_cower: 'superheroes/capitan_cubriendose.png',// pelea: se cubre cuando la atacan
    friend1_flee:  'superheroes/capitan_huye.png',       // huye llorando de Sombra
    treasure: 'superheroes/tesoro_escudo.png',   // Misión perfecta
    friend1: 'superheroes/capitan_estrella.png',
    friend2: 'superheroes/escudo_verde.png',
    friend3: 'superheroes/heroe_noche.png',
    end:     'superheroes/final.jpg',
    bg_1:    'superheroes/fondo_1_el_centro.jpg',
    bg_2:    'superheroes/fondo_2_barrio_norte.png',
    bg_3:    'superheroes/fondo_3_el_puerto.jpg',
    bg_4:    'superheroes/fondo_4_la_torre.jpg',
    bg_5:    'superheroes/fondo_5_guarida_de_sombra.jpg',
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
    villain_sneak: 'dragones/morgana_puntillas.png',     // escenas de fondo: se escabulle
    villain_laugh: 'dragones/morgana_risa.png',          // escenas de fondo: se asoma con la varita
    villain_taunt: 'dragones/morgana_agachada.png',      // presenta el capítulo 4
    villain_scared: 'dragones/morgana_asustada.png',     // huye del Hada del Bosque
    villain_run:   'dragones/morgana_corriendo.png',
    villain_face:  'dragones/morgana_cara.png',          // espía desde un lado
    friend2_help:  'dragones/mago_ayuda.png',            // pelea: el Mago Abuelo suplica asustado
    friend2_cower: 'dragones/mago_cubre.png',            // pelea: se cubre cuando lo atacan
    friend2_flee:  'dragones/mago_huye.png',
    treasure: 'dragones/tesoro_gema.png',
    friend1: 'dragones/hada_del_bosque.png',
    friend2: 'dragones/mago_abuelo.png',
    friend3: 'dragones/hechicera_buena.png',
    end:     'dragones/final.jpg',
    bg_1:    'dragones/fondo_1_nido.jpg',
    bg_2:    'dragones/fondo_2_bosque.jpg',
    bg_3:    'dragones/fondo_3_el_rio.jpg',
    bg_4:    'dragones/fondo_4_la_cueva.jpg',
    bg_5:    'dragones/fondo_5_el_volcan.jpg',
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
    villain_sneak: 'reino_magico/duende_puntillas.png',  // escenas de fondo: se escabulle
    villain_laugh: 'reino_magico/duende_risa.png',       // escenas de fondo: se asoma riéndose
    villain_taunt: 'reino_magico/duende_burla.png',      // presenta el capítulo 4
    villain_run:   'reino_magico/duende_corriendo.png',  // huye del Guardia
    villain_scared:'reino_magico/duende_asustado.png',
    villain_face:  'reino_magico/duende_cara.png',       // espía desde un lado
    friend1_help:  'reino_magico/guardia_ayuda.png',     // pelea: el Guardia pide ayuda
    friend1_cower: 'reino_magico/guardia_cubre.png',     // pelea: se cubre cuando lo atacan
    friend1_flee:  'reino_magico/guardia_huye.png',
    treasure: 'reino_magico/tesoro_pastel.png',
    friend1: 'reino_magico/guardia.png',
    friend2: 'reino_magico/bufon.png',
    friend3: 'reino_magico/duende_amable.png',
    end:     'reino_magico/final.jpg',
    bg_1:    'reino_magico/fondo_1_jardin.jpg',
    bg_2:    'reino_magico/fondo_2_la_cocina.jpg',
    bg_3:    'reino_magico/fondo_3_la_biblioteca.jpg',
    bg_4:    'reino_magico/fondo_4_la_torre.jpg',
    bg_5:    'reino_magico/fondo_5_el_salon_del_trono.jpg',
    distractor_libro_volador: 'reino_magico/libro_volador.png',
    distractor_escoba_magica: 'reino_magico/escoba_magica.png',
    distractor_raton:         'reino_magico/raton.png'
  },
  space: {            // carpeta assets/espacio · Nova busca a Bip
    target:        'espacio/bip_alien_verde.png',
    dist1:         'espacio/alien_azul.png',
    dist2:         'espacio/alien_naranja.png',
    dist3:         'espacio/alien_verde_claro.png',
    hero:          'espacio/nova.png',
    villain:       'espacio/capitan_meteoro.png',
    villain_caught:'espacio/meteoro_atrapado.png',
    villain_sneak: 'espacio/meteoro_puntillas.png',
    villain_laugh: 'espacio/meteoro_risa.png',
    villain_taunt: 'espacio/meteoro_burla.png',
    villain_run:   'espacio/meteoro_corriendo.png',
    villain_scared:'espacio/meteoro_asustado.png',
    villain_face:  'espacio/meteoro_cara.png',
    treasure:      'espacio/tesoro_medalla.png',
    friend1:       'espacio/robi.png',
    friend1_help:  'espacio/robi_ayuda.png',
    friend1_cower: 'espacio/robi_cubre.png',
    friend1_flee:  'espacio/robi_huye.png',
    friend2:       'espacio/zuri.png',
    friend3:       'espacio/cometa.png',
    end:           'espacio/final.jpg',
    bg_1:          'espacio/fondo_1_base_lunar.jpg',
    bg_2:          'espacio/fondo_2_asteroides.jpg',
    bg_3:          'espacio/fondo_3_nave_nodriza.jpg',
    bg_4:          'espacio/fondo_4_planeta_cristal.jpg',
    bg_5:          'espacio/fondo_5_nave_pirata.jpg',
    distractor_cohete:'espacio/cohete.png',
    distractor_satelite:'espacio/satelite.png',
    distractor_rover:'espacio/rover.png'
  },
  ocean: {            // carpeta assets/oceano · Coral busca a Perla
    target:        'oceano/perla_caballito_rosado.png',
    dist1:         'oceano/caballito_azul.png',
    dist2:         'oceano/caballito_verde.png',
    dist3:         'oceano/caballito_lila.png',
    hero:          'oceano/coral.png',
    villain:       'oceano/pulpo_tinta.png',
    villain_caught:'oceano/pulpo_atrapado.png',
    villain_sneak: 'oceano/pulpo_puntillas.png',
    villain_laugh: 'oceano/pulpo_risa.png',
    villain_taunt: 'oceano/pulpo_burla.png',
    villain_run:   'oceano/pulpo_corriendo.png',
    villain_scared:'oceano/pulpo_asustado.png',
    villain_face:  'oceano/pulpo_cara.png',
    treasure:      'oceano/tesoro_brujula.png',
    friend1:       'oceano/delfi.png',
    friend1_help:  'oceano/delfi_ayuda.png',
    friend1_cower: 'oceano/delfi_cubre.png',
    friend1_flee:  'oceano/delfi_huye.png',
    friend2:       'oceano/pinzas.png',
    friend3:       'oceano/pulpi.png',
    end:           'oceano/final.jpg',
    bg_1:          'oceano/fondo_1_arrecife.jpg',
    bg_2:          'oceano/fondo_2_barco_hundido.jpg',
    bg_3:          'oceano/fondo_3_bosque_algas.jpg',
    bg_4:          'oceano/fondo_4_cueva_cristales.jpg',
    bg_5:          'oceano/fondo_5_fosa_oscura.jpg',
    distractor_medusa:'oceano/medusa.png',
    distractor_banco_de_peces:'oceano/banco_de_peces.png',
    distractor_estrella_de_mar:'oceano/estrella_de_mar.png'
  },
  dinos: {            // carpeta assets/dinosaurios · Tito busca a Dino
    target:        'dinosaurios/dino_triceratops_naranja.png',
    dist1:         'dinosaurios/triceratops_verde.png',
    dist2:         'dinosaurios/triceratops_azul.png',
    dist3:         'dinosaurios/triceratops_naranja_claro.png',
    hero:          'dinosaurios/tito.png',
    villain:       'dinosaurios/pterodactilo_ladron.png',
    villain_caught:'dinosaurios/ptero_atrapado.png',
    villain_sneak: 'dinosaurios/ptero_puntillas.png',
    villain_laugh: 'dinosaurios/ptero_risa.png',
    villain_taunt: 'dinosaurios/ptero_burla.png',
    villain_run:   'dinosaurios/ptero_corriendo.png',
    villain_scared:'dinosaurios/ptero_asustado.png',
    villain_face:  'dinosaurios/ptero_cara.png',
    treasure:      'dinosaurios/tesoro_amonite.png',
    friend1:       'dinosaurios/cuello_largo.png',
    friend1_help:  'dinosaurios/cuello_largo_ayuda.png',
    friend1_cower: 'dinosaurios/cuello_largo_cubre.png',
    friend1_flee:  'dinosaurios/cuello_largo_huye.png',
    friend2:       'dinosaurios/pinchos.png',
    friend3:       'dinosaurios/plumi.png',
    end:           'dinosaurios/final.jpg',
    bg_1:          'dinosaurios/fondo_1_valle.jpg',
    bg_2:          'dinosaurios/fondo_2_rio.jpg',
    bg_3:          'dinosaurios/fondo_3_volcan.jpg',
    bg_4:          'dinosaurios/fondo_4_cueva_pinturas.jpg',
    bg_5:          'dinosaurios/fondo_5_nido_montana.jpg',
    distractor_libelula:'dinosaurios/libelula.png',
    distractor_arqueopterix:'dinosaurios/arqueopterix.png',
    distractor_lagartija:'dinosaurios/lagartija.png'
  },
  robots: {            // carpeta assets/robots · Chip busca a Botón
    target:        'robots/boton_robot_azul.png',
    dist1:         'robots/robot_rojo.png',
    dist2:         'robots/robot_amarillo.png',
    dist3:         'robots/robot_azul_claro.png',
    hero:          'robots/chip.png',
    villain:       'robots/glitch.png',
    villain_caught:'robots/glitch_atrapado.png',
    villain_sneak: 'robots/glitch_puntillas.png',
    villain_laugh: 'robots/glitch_risa.png',
    villain_taunt: 'robots/glitch_burla.png',
    villain_run:   'robots/glitch_corriendo.png',
    villain_scared:'robots/glitch_asustado.png',
    villain_face:  'robots/glitch_cara.png',
    treasure:      'robots/tesoro_engranaje.png',
    friend1:       'robots/cable.png',
    friend1_help:  'robots/cable_ayuda.png',
    friend1_cower: 'robots/cable_cubre.png',
    friend1_flee:  'robots/cable_huye.png',
    friend2:       'robots/zumbi.png',
    friend3:       'robots/antivirus.png',
    end:           'robots/final.jpg',
    bg_1:          'robots/fondo_1_taller.jpg',
    bg_2:          'robots/fondo_2_fabrica.jpg',
    bg_3:          'robots/fondo_3_ciudad.jpg',
    bg_4:          'robots/fondo_4_laboratorio.jpg',
    bg_5:          'robots/fondo_5_centro_control.jpg',
    distractor_engranaje:'robots/engranaje.png',
    distractor_avion_de_papel:'robots/avion_de_papel.png',
    distractor_aspiradora:'robots/aspiradora.png'
  },
  jungle: {            // carpeta assets/selva · Kiara busca a Arcoíris
    target:        'selva/arcoiris_tucan.png',
    dist1:         'selva/tucan_naranja.png',
    dist2:         'selva/loro_verde.png',
    dist3:         'selva/tucan_dos_colores.png',
    hero:          'selva/kiara.png',
    villain:       'selva/serpiente_silbona.png',
    villain_caught:'selva/serpiente_atrapada.png',
    villain_sneak: 'selva/serpiente_puntillas.png',
    villain_laugh: 'selva/serpiente_risa.png',
    villain_taunt: 'selva/serpiente_burla.png',
    villain_run:   'selva/serpiente_corriendo.png',
    villain_scared:'selva/serpiente_asustada.png',
    villain_face:  'selva/serpiente_cara.png',
    treasure:      'selva/tesoro_medallon.png',
    friend1:       'selva/jaguarcito.png',
    friend1_help:  'selva/jaguarcito_ayuda.png',
    friend1_cower: 'selva/jaguarcito_cubre.png',
    friend1_flee:  'selva/jaguarcito_huye.png',
    friend2:       'selva/lento.png',
    friend3:       'selva/silvia.png',
    end:           'selva/final.jpg',
    bg_1:          'selva/fondo_1_rio.jpg',
    bg_2:          'selva/fondo_2_arboles_gigantes.jpg',
    bg_3:          'selva/fondo_3_cascada.jpg',
    bg_4:          'selva/fondo_4_templo.jpg',
    bg_5:          'selva/fondo_5_cueva_serpiente.jpg',
    distractor_mariposa_azul:'selva/mariposa_azul.png',
    distractor_guacamaya:'selva/guacamaya.png',
    distractor_rana:'selva/rana.png'
  },
  candy: {             // carpeta assets/dulces · Gomi busca a Chispita
    target:        'dulces/chispita_estrella_dorada.png',
    dist1:         'dulces/estrella_verde.png',
    dist2:         'dulces/corazon_rosado.png',
    dist3:         'dulces/estrella_amarilla.png',
    hero:          'dulces/gomi.png',
    villain:       'dulces/acido_limon.png',
    villain_caught:'dulces/acido_atrapado.png',
    villain_sneak: 'dulces/acido_puntillas.png',
    villain_laugh: 'dulces/acido_risa.png',
    villain_taunt: 'dulces/acido_burla.png',
    villain_run:   'dulces/acido_corriendo.png',
    villain_scared:'dulces/acido_asustado.png',
    villain_face:  'dulces/acido_cara.png',
    friend1_help:  'dulces/jengi_ayuda.png',
    friend1_cower: 'dulces/jengi_cubre.png',
    friend1_flee:  'dulces/jengi_huye.png',
    treasure:      'dulces/tesoro_galleta.png',
    friend1:       'dulces/jengi.png',
    friend2:       'dulces/nube.png',
    friend3:       'dulces/limonada.png',
    end:           'dulces/final.jpg',
    bg_1:          'dulces/fondo_1_chupetines.jpg',
    bg_2:          'dulces/fondo_2_rio_chocolate.jpg',
    bg_3:          'dulces/fondo_3_montana_helado.jpg',
    bg_4:          'dulces/fondo_4_castillo_galleta.jpg',
    bg_5:          'dulces/fondo_5_fabrica_agria.jpg',
    distractor_caramelo:'dulces/caramelo.png',
    distractor_globo_chicle:'dulces/globo_chicle.png',
    distractor_osito_verde:'dulces/osito_verde.png'
  },
  // Objetos e íconos que comparten todos los mundos (carpeta assets/comunes)
  comunes: {
    basket:      'comunes/canasta.png',          // minijuego Atrapa
    net:         'comunes/red.png',              // atrapar al villano
    fireball:    'comunes/bola_de_fuego.png',    // poder de Chispa
    magicstar:   'comunes/estrella_magica.png',  // poder de la Reina Luna
    heart:       'comunes/corazon.png',          // rescate de compañeros
    spark:       'comunes/chispa.png',           // brillos al acertar
    puff:        'comunes/humo.png',             // humito cuando el poder falla (tocó otro personaje)
    icon_map:    'comunes/icono_mapa.png',
    icon_trophy: 'comunes/icono_trofeo.png',
    icon_lock:   'comunes/icono_candado.png',
    icon_find:   'comunes/icono_lupa.png',
    icon_memory: 'comunes/icono_memoria.png'     // modo Memoria
  }
};
