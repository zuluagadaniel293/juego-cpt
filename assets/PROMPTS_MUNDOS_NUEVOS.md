# Mundos nuevos: personajes, fondos y prompts para Gemini

Seis mundos para completar el mapa: **Espacio, Océano, Dinosaurios, Robots, Selva y Dulces**.
Cada uno tiene exactamente las mismas piezas que Superhéroes, Dragones y Reino mágico, así el juego los usa sin cambios.

## Qué necesita cada mundo

| Pieza | Para qué se usa en el juego |
|---|---|
| **Protagonista** | Cuenta la historia, lanza su poder |
| **Objetivo** + 2 distractores + 1 distractor parecido | Lo que el niño busca en los niveles de señales |
| **Villano** | Lo que el niño busca en los niveles de personajes y en el jefe final |
| **3 amigos** (el 3.º parecido al villano) | Compañeros que presentan los capítulos; distractores en los niveles de personajes |
| **Poses del villano** | Escenas de fondo: de puntillas, riéndose, burlándose, corriendo, cara espiando, asustado, atrapado |
| **Poses del amigo 1** | Pide ayuda, se cubre, huye asustado (peleas y persecuciones) |
| **3 cosas que cruzan la pantalla** | 2 por arriba (vuelan) y 1 por abajo (camina) |
| **Tesoro redondo** | Misión perfecta (se parte en 3 pedazos) |
| **5 fondos** | Uno por capítulo; el 5.º es la guarida del villano |

## Reglas para TODOS los mensajes a Gemini

1. **Adjunta una imagen de referencia** del juego (por ejemplo, la hoja de personajes de Superhéroes) para que mantenga el estilo.
2. **Empieza cada mensaje de personajes u objetos con:**
   > Usa exactamente el mismo estilo de dibujo de esta imagen: caricatura 2D para un videojuego infantil (8 a 12 años), contornos oscuros gruesos, colores vivos y planos, sombreado mínimo, formas simples. **Fondo blanco liso** (sin cuadrícula ni transparencia). **Sin textos ni etiquetas.** Cada elemento completo, de cuerpo entero, bien separado de los demás y sin que se corte ninguna parte. Máxima resolución.
3. **Para los fondos, empieza con:**
   > Usa exactamente el mismo estilo de dibujo de esta imagen: fondo de videojuego infantil 2D, colores suaves y alegres, contornos oscuros, formato horizontal 16:9. **Sin personajes, sin textos.** El centro debe quedar más despejado y menos detallado (ahí aparecen los objetos del juego). Máxima resolución.
4. **Los personajes del mismo mundo deben verse claramente distintos**, salvo el que se pide "parecido": ese debe confundirse a primera vista, pero tener una diferencia clara.
5. Guarda cada imagen con el **nombre exacto** de la tabla, en la carpeta del mundo (`assets/espacio/`, `assets/oceano/`…). Si la hoja trae varios elementos bien separados, no hace falta pedirlos uno por uno: yo los recorto.

---

## 1. Espacio 🚀 — carpeta `assets/espacio/`

**Historia:** Nova, una niña astronauta, busca a **Bip, el alien bebé verde** que se perdió entre otros aliens. El **Capitán Meteoro**, un pirata espacial, quiere llevárselo en su nave.

| Papel | Personaje | Archivo |
|---|---|---|
| Protagonista | **Nova**, niña astronauta (traje blanco y naranja, casco con visera rosada). Poder: rayo de estrellas | `nova.png` |
| Objetivo | **Bip**, alien bebé verde, una antena con estrella amarilla | `bip_alien_verde.png` |
| Distractor 1 | Alien bebé azul, dos antenas redondas | `alien_azul.png` |
| Distractor 2 | Alien bebé naranja, tres ojos | `alien_naranja.png` |
| Distractor parecido | Alien bebé verde claro, antena con círculo (no estrella) | `alien_verde_claro.png` |
| Villano | **Capitán Meteoro**, niño pirata espacial: casco morado con calavera de estrella, parche, capa roja | `capitan_meteoro.png` |
| Amigo 1 | **Robi**, robot copiloto redondo y plateado | `robi.png` |
| Amigo 2 | **Zuri**, alienígena amistosa rosada con cuatro brazos | `zuri.png` |
| Amigo 3 (parecido al villano) | **Cometa**, piloto bueno con casco morado parecido, pero sin calavera y con capa azul | `cometa.png` |
| Cruzan arriba | Cohete pequeño · Satélite | `cohete.png` · `satelite.png` |
| Cruza abajo | Rover lunar (carrito explorador) | `rover.png` |
| Tesoro | **Medalla de la Galaxia**: medalla redonda dorada con una espiral de estrellas | `tesoro_medalla.png` |
| Fondos | 1 La base lunar · 2 El cinturón de asteroides · 3 Dentro de la nave nodriza · 4 El planeta de cristal · 5 La nave pirata del Capitán Meteoro | `fondo_1_base_lunar.png` … `fondo_5_nave_pirata.png` |

## 2. Océano 🐙 — carpeta `assets/oceano/`

**Historia:** Coral, una niña buzo, busca a **Perla, el caballito de mar rosado**. El **Pulpo Tinta** esconde a los animales lanzando nubes de tinta.

| Papel | Personaje | Archivo |
|---|---|---|
| Protagonista | **Coral**, niña buzo con traje turquesa y aletas amarillas. Poder: burbujas mágicas | `coral.png` |
| Objetivo | **Perla**, caballito de mar rosado con una perla en la cola | `perla_caballito_rosado.png` |
| Distractor 1 | Caballito de mar azul | `caballito_azul.png` |
| Distractor 2 | Caballito de mar verde | `caballito_verde.png` |
| Distractor parecido | Caballito de mar lila (casi rosado), sin perla | `caballito_lila.png` |
| Villano | **Pulpo Tinta**, pulpo morado oscuro y travieso con sombrero de capitán | `pulpo_tinta.png` |
| Amigo 1 | **Delfi**, delfín celeste sonriente | `delfi.png` |
| Amigo 2 | **Pinzas**, cangrejo rojo con gafas | `pinzas.png` |
| Amigo 3 (parecido al villano) | **Pulpi**, pulpo bueno morado claro, sin sombrero y con flor | `pulpi.png` |
| Cruzan arriba | Medusa · Banco de peces pequeños | `medusa.png` · `banco_de_peces.png` |
| Cruza abajo | Estrella de mar caminando | `estrella_de_mar.png` |
| Tesoro | **Brújula del capitán**: brújula redonda dorada con la rosa de los vientos | `tesoro_brujula.png` |
| Fondos | 1 El arrecife de coral · 2 El barco hundido · 3 El bosque de algas · 4 La cueva submarina · 5 La fosa oscura del Pulpo Tinta | `fondo_1_arrecife.png` … `fondo_5_fosa_oscura.png` |

## 3. Dinosaurios 🦖 — carpeta `assets/dinosaurios/`

**Historia:** Tito, un niño explorador, busca a **Dino, el triceratops bebé naranja**. El **Pterodáctilo Ladrón** se lleva a los bebés a su nido en la montaña.

| Papel | Personaje | Archivo |
|---|---|---|
| Protagonista | **Tito**, niño explorador con sombrero, chaleco y lupa. Poder: rugido de dinosaurio | `tito.png` |
| Objetivo | **Dino**, triceratops bebé naranja con manchas amarillas | `dino_triceratops_naranja.png` |
| Distractor 1 | Triceratops bebé verde | `triceratops_verde.png` |
| Distractor 2 | Triceratops bebé azul | `triceratops_azul.png` |
| Distractor parecido | Triceratops bebé naranja claro, sin manchas | `triceratops_naranja_claro.png` |
| Villano | **Pterodáctilo Ladrón**, pterodáctilo gris con antifaz y bolsa de botín | `pterodactilo_ladron.png` |
| Amigo 1 | **Cuello Largo**, braquiosaurio amable y verde | `cuello_largo.png` |
| Amigo 2 | **Pinchos**, estegosaurio naranja y gracioso | `pinchos.png` |
| Amigo 3 (parecido al villano) | **Plumi**, pterodáctilo bueno gris claro, sin antifaz y con bufanda | `plumi.png` |
| Cruzan arriba | Libélula gigante · Arqueópterix (pájaro prehistórico) | `libelula.png` · `arqueopterix.png` |
| Cruza abajo | Lagartija | `lagartija.png` |
| Tesoro | **Fósil de amonite**: concha en espiral, redonda, dorada | `tesoro_amonite.png` |
| Fondos | 1 El valle de helechos · 2 El río prehistórico · 3 El volcán humeante · 4 La cueva de las pinturas · 5 El nido en la montaña | `fondo_1_valle.png` … `fondo_5_nido_montana.png` |

## 4. Robots 🤖 — carpeta `assets/robots/`

**Historia:** Chip, una niña inventora, busca a **Botón, el robotito azul** de pantalla sonriente. **Glitch**, un virus travieso, desordena todos los robots de la ciudad.

| Papel | Personaje | Archivo |
|---|---|---|
| Protagonista | **Chip**, niña inventora con overol amarillo, gafas de soldar en la frente y llave inglesa. Poder: rayo electromagnético | `chip.png` |
| Objetivo | **Botón**, robotito azul con pantalla de cara sonriente | `boton_robot_azul.png` |
| Distractor 1 | Robotito rojo con ruedas | `robot_rojo.png` |
| Distractor 2 | Robotito amarillo con hélice | `robot_amarillo.png` |
| Distractor parecido | Robotito azul claro con pantalla de cara seria | `robot_azul_claro.png` |
| Villano | **Glitch**, virus morado hecho de cuadritos de píxeles, con sonrisa traviesa | `glitch.png` |
| Amigo 1 | **Cable**, perro robot plateado | `cable.png` |
| Amigo 2 | **Zumbi**, dron verde con ojos grandes | `zumbi.png` |
| Amigo 3 (parecido al villano) | **Antivirus**, figura de píxeles morada clara con escudo | `antivirus.png` |
| Cruzan arriba | Engranaje volador · Avión de papel | `engranaje.png` · `avion_de_papel.png` |
| Cruza abajo | Robot aspiradora | `aspiradora.png` |
| Tesoro | **Engranaje dorado** con un rayo en el centro | `tesoro_engranaje.png` |
| Fondos | 1 El taller de inventos · 2 La fábrica de engranajes · 3 La ciudad digital · 4 El laboratorio · 5 El centro de control de Glitch | `fondo_1_taller.png` … `fondo_5_centro_control.png` |

## 5. Selva 🐒 — carpeta `assets/selva/`

**Historia:** Kiara, una niña exploradora, busca a **Arcoíris, el tucán bebé** de pico de colores. La **Serpiente Silbona** hipnotiza a los animales para esconderlos.

| Papel | Personaje | Archivo |
|---|---|---|
| Protagonista | **Kiara**, niña exploradora con sombrero de safari y mochila. Poder: hojas mágicas | `kiara.png` |
| Objetivo | **Arcoíris**, tucán bebé con pico de rayas de colores | `arcoiris_tucan.png` |
| Distractor 1 | Tucán bebé de pico naranja | `tucan_naranja.png` |
| Distractor 2 | Loro bebé verde | `loro_verde.png` |
| Distractor parecido | Tucán bebé con pico de dos colores (casi arcoíris) | `tucan_dos_colores.png` |
| Villano | **Serpiente Silbona**, serpiente morada con ojos en espiral y sombrero de copa | `serpiente_silbona.png` |
| Amigo 1 | **Jaguarcito**, jaguar bebé amable | `jaguarcito.png` |
| Amigo 2 | **Lento**, perezoso sonriente | `lento.png` |
| Amigo 3 (parecido al villano) | **Silvia**, serpiente buena verde con flor, sin sombrero | `silvia.png` |
| Cruzan arriba | Mariposa morfo azul · Guacamaya | `mariposa_azul.png` · `guacamaya.png` |
| Cruza abajo | Rana saltando | `rana.png` |
| Tesoro | **Medallón de jade** redondo, con un sol tallado | `tesoro_medallon.png` |
| Fondos | 1 La orilla del río · 2 Los árboles gigantes · 3 La cascada · 4 El templo antiguo · 5 La cueva de la Serpiente Silbona | `fondo_1_rio.png` … `fondo_5_cueva_serpiente.png` |

## 6. Dulces 🍭 — carpeta `assets/dulces/`

**Historia:** Gomi, un osito de gomita, busca a **Chispita, la gomita estrella dorada**. **Ácido, el limón gruñón**, quiere volver agrio todo el reino de los dulces.

| Papel | Personaje | Archivo |
|---|---|---|
| Protagonista | **Gomi**, osito de gomita rojo y sonriente. Poder: lluvia de chispas de azúcar | `gomi.png` |
| Objetivo | **Chispita**, gomita en forma de estrella dorada | `chispita_estrella_dorada.png` |
| Distractor 1 | Gomita estrella verde | `estrella_verde.png` |
| Distractor 2 | Gomita corazón rosada | `corazon_rosado.png` |
| Distractor parecido | Gomita estrella amarilla pálida | `estrella_amarilla.png` |
| Villano | **Ácido**, limón gruñón con cejas enojadas y capa verde | `acido_limon.png` |
| Amigo 1 | **Jengi**, galleta de jengibre | `jengi.png` |
| Amigo 2 | **Nube**, algodón de azúcar rosado | `nube.png` |
| Amigo 3 (parecido al villano) | **Limonada**, limón bueno y sonriente, con moño | `limonada.png` |
| Cruzan arriba | Caramelo envuelto volando · Globo de chicle | `caramelo.png` · `globo_chicle.png` |
| Cruza abajo | Osito de gomita verde caminando | `osito_verde.png` |
| Tesoro | **Galleta gigante** redonda con chispas de colores | `tesoro_galleta.png` |
| Fondos | 1 El bosque de chupetines · 2 El río de chocolate · 3 La montaña de helado · 4 El castillo de galleta · 5 La fábrica agria de Ácido | `fondo_1_chupetines.png` … `fondo_5_fabrica_agria.png` |

---

## Prompts (iguales para cada mundo, cambiando los nombres)

Copia la regla 2 o 3 al inicio y luego el texto del mensaje, reemplazando lo que está entre `< >` con lo de la tabla del mundo.

**Mensaje 1 · Personajes principales (5)**
> Hoja de 5 personajes de frente, cuerpo entero, bien separados: 1) `<protagonista>`; 2) `<villano>`; 3) `<amigo 1>`; 4) `<amigo 2>`; 5) `<amigo 3>`, que se parece al villano a primera vista pero con la diferencia indicada.

**Mensaje 2 · Objetivo y distractores (4)**
> Hoja de 4 personajes pequeños del mismo tamaño y en la misma postura, bien separados: 1) `<objetivo>`; 2) `<distractor 1>`; 3) `<distractor 2>`; 4) `<distractor parecido>`. Los cuatro deben parecerse en forma, y diferenciarse en el color o en un detalle claro.

**Mensaje 3 · Poses del villano (6)**
> Hoja de poses del mismo `<villano>`, mismo diseño que en la imagen adjunta: 1) caminando de puntillas, escabulléndose; 2) riéndose con la mano en la boca; 3) agachado, burlándose con mirada traviesa; 4) corriendo de lado; 5) solo la cara, asomándose con sonrisa traviesa; 6) asustado, huyendo.

**Mensaje 4 · Villano atrapado (1)**
> El mismo `<villano>` atrapado dentro de una red, con cara de enojo y derrota (cómica, no triste).

**Mensaje 5 · Poses del amigo 1 (3)**
> Hoja de poses del mismo `<amigo 1>`, mismo diseño que en la imagen adjunta: 1) asustado, con los brazos arriba pidiendo ayuda; 2) arrodillado cubriéndose la cabeza; 3) huyendo asustado.

**Mensaje 6 · Cosas que cruzan y tesoro (4)**
> Hoja de 4 elementos bien separados: 1) `<cruza arriba 1>`, de perfil mirando a la derecha; 2) `<cruza arriba 2>`, de perfil mirando a la derecha; 3) `<cruza abajo>`, caminando de perfil mirando a la derecha; 4) `<tesoro>`, un objeto **perfectamente redondo**, visto de frente, que llene todo su espacio.

**Mensajes 7 a 11 · Fondos (uno por mensaje)**
> `<nombre del fondo>`: `<descripción breve, por ejemplo: "el cinturón de asteroides, con rocas flotando, estrellas y un planeta lejano">`. El fondo 5 es la guarida del villano: un poco más oscuro y misterioso, pero apto para niños.

**Opcional · Escena final**
> `<protagonista>` celebrando junto a `<objetivo>`, con `<villano>` atrapado en una red al fondo, en `<lugar del mundo>`. Formato horizontal 16:9.

**Por mundo son 11 mensajes** (6 de personajes y objetos, y 5 de fondos), **unas 30 imágenes**.

---

## Voces con emoción (ElevenLabs) — 8 frases por mundo

Calculadas para gastar poco: **unos 380 créditos por mundo, 2.300 en total**. Las explicaciones del protagonista siguen con la voz gratuita.

| Mundo | Amigo 1 (2 frases de ayuda) | Amigos 2 y 3 (1 frase cada uno) | Villano (2 risas, 1 burla, 1 amenaza) |
|---|---|---|---|
| Espacio | `[scared] ¡Ay, no! [panicked] ¡Ayuda, Nova! ¡Me atraparon!` · `[panicked] ¡Nova, mis circuitos fallan!` | Zuri: `[scared] ¡Me quitaron mi nave! ¡Ayuda!` · Cometa: `[nervous] ¡Yo no soy el pirata! [panicked] ¡Socorro!` | `[evil laugh] ¡Ja, ja, ja! ¡Bip será mío!` · `[laughs] ¡Jo, jo! [whispers] Estoy en otra galaxia...` · `[sarcastic] ¡Nunca me alcanzarás, astronauta!` · `[menacing] ¡Todo el espacio será mío!` |
| Océano | `[scared] ¡Ay, no! [panicked] ¡Ayuda, Coral! ¡La tinta no me deja ver!` · `[panicked] ¡Coral, por aquí, rápido!` | Pinzas: `[scared] ¡Me enredé en las algas! ¡Ayuda!` · Pulpi: `[nervous] ¡Yo soy el pulpo bueno! [panicked] ¡Socorro!` | `[evil laugh] ¡Ja, ja! ¡Más tinta para todos!` · `[giggles] ¡Je, je! ¡No me ves, no me ves!` · `[sarcastic] ¿Buscas a Perla? ¡Qué lástima!` · `[menacing] ¡El mar entero será oscuro!` |
| Dinosaurios | `[scared] ¡Ay, no! [panicked] ¡Ayuda, Tito! ¡Se lo lleva volando!` · `[panicked] ¡Tito, por aquí! ¡Rápido!` | Pinchos: `[scared] ¡Me caí en el barro! ¡Ayuda!` · Plumi: `[nervous] ¡Yo no soy el ladrón! [panicked] ¡Socorro!` | `[evil laugh] ¡Ja, ja, ja! ¡Todos los bebés a mi nido!` · `[laughs] ¡Jo, jo! [whispers] Estoy en las nubes...` · `[sarcastic] ¡No puedes volar, pequeño explorador!` · `[menacing] ¡Ningún huevo estará a salvo!` |
| Robots | `[scared] ¡Ay, no! [panicked] ¡Ayuda, Chip! ¡Glitch me desconectó!` · `[panicked] ¡Chip, mi batería se apaga!` | Zumbi: `[scared] ¡Perdí el control! ¡Ayuda!` · Antivirus: `[nervous] ¡Yo no soy el virus! [panicked] ¡Socorro!` | `[evil laugh] ¡Ja, ja! ¡Error, error, error!` · `[giggles] ¡Ji, ji! [whispers] Estoy en tu pantalla...` · `[sarcastic] ¿Reiniciar? ¡No funcionará!` · `[menacing] ¡Todos los robots serán míos!` |
| Selva | `[scared] ¡Ay, no! [panicked] ¡Ayuda, Kiara! ¡Me está hipnotizando!` · `[panicked] ¡Kiara, por aquí, rápido!` | Lento: `[tired] ¡Ay... no puedo correr tan rápido! ¡Ayuda!` · Silvia: `[nervous] ¡Yo soy la serpiente buena! [panicked] ¡Socorro!` | `[evil laugh] ¡Sssí, sssí! ¡Ja, ja, ja!` · `[whispers] Sssigue mis ojosss... [laughs]` · `[sarcastic] ¡Nunca encontrarásss al tucán!` · `[menacing] ¡Toda la ssselva será mía!` |
| Dulces | `[scared] ¡Ay, no! [panicked] ¡Ayuda, Gomi! ¡Me estoy volviendo agrio!` · `[panicked] ¡Gomi, por aquí, rápido!` | Nube: `[scared] ¡Me estoy derritiendo! ¡Ayuda!` · Limonada: `[nervous] ¡Yo soy el limón bueno! [panicked] ¡Socorro!` | `[evil laugh] ¡Ja, ja! ¡Todo será agrio!` · `[giggles] ¡Ji, ji! ¡Qué rico lo ácido!` · `[sarcastic] ¿Dulce? ¡Puaj!` · `[menacing] ¡El reino de los dulces será mío!` |

Cuando lleguen las imágenes de un mundo, me las envían, yo las recorto y las conecto, y genero sus voces.
