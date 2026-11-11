# Rehacer en alta calidad los 3 primeros mundos

Prompts para volver a pedirle a Gemini las imágenes de **Superhéroes**, **Dragones y fantasía** y **Reino mágico**, más los objetos comunes (la red, la canasta, los poderes y los íconos). La idea es que el juego se vea con la misma calidad que Espacio y Océano, **sin cambiar el diseño de los personajes**: el niño los debe seguir reconociendo.

## Cómo usar cada prompt

**Cada recuadro es un mensaje completo**: cópialo tal cual y pégalo en Gemini.

**Antes de enviarlo, adjunta las imágenes que dice el título del mensaje.** Casi siempre son dos tipos:

**1. La imagen actual** del personaje o del fondo (está en la carpeta del mundo dentro de `assets`). Sirve para que Gemini copie el diseño: colores, ropa, peinado y detalles.

**2. Una imagen de referencia de calidad.** Usa uno de los amigos que ya están en HD del mismo mundo: `superheroes/capitan_estrella.png`, `dragones/hada_del_bosque.png` o `reino_magico/guardia.png`. Para los fondos, usa `espacio/fondo_1_base_lunar.jpg`.

**Nombres:** guarda cada imagen con el **nombre exacto** que aparece después de la flecha (→). Si Gemini entrega una hoja con varios personajes bien separados, no hace falta pedirlos uno por uno: yo los recorto.

**Envío:** mándamelos por mundo, en un zip o en una carpeta, como hiciste con Espacio y Océano.

**Si la imagen sale pequeña o borrosa**, responde en el mismo chat: "Dame esta misma imagen en la máxima resolución posible, sin cambiar nada".

**Ya no hace falta pedir:** los 3 amigos de cada mundo y sus poses celebrando, que ya están en HD desde el 11 de noviembre.

## Orden recomendado

**1. Lo que el niño busca:** los mensajes 1 y 2 de cada mundo (el protagonista, el villano, el objetivo y los distractores). Es lo que más se ve, en el centro de la pantalla.

**2. Los objetos comunes:** la red, la canasta y los poderes. La red actual mide solo 92 × 179 píxeles; por eso se ve tan mal.

**3. Las poses del villano y del amigo 1:** hay que rehacerlas para que combinen con el villano nuevo.

**4. Los fondos y las escenas finales.** Los fondos de Espacio y Océano llegaron de 1024 píxeles de ancho; aquí se piden de 1920 × 1080 para que se vean nítidos en pantallas grandes.

---

## A. Objetos comunes (todos los mundos)

### Red, canasta, poderes e íconos 🧺 — carpeta `assets/comunes/`

**Mensaje A1 · La red para atrapar al villano** (adjunta `comunes/red.png` y `superheroes/capitan_estrella.png`) → `red.png`

```
Adjunto dos imágenes. La primera es la red actual del juego: respeta su diseño y su posición. La segunda es solo la referencia de calidad y estilo: dibuja con ese mismo nivel de detalle, nitidez y acabado. Caricatura 2D para un videojuego infantil (8 a 12 años), contornos oscuros gruesos, colores vivos, formas simples. Fondo blanco liso (sin cuadrícula ni transparencia). Sin textos. El objeto completo, sin que se corte ninguna parte. Máxima resolución.

Una red para atrapar, como las de cazar mariposas: mango largo de madera, aro metálico dorado y malla blanca con los cuadros bien visibles. En diagonal, con el mango abajo a la izquierda y la red arriba a la derecha, igual que en la primera imagen. Grande, que ocupe casi toda la imagen.
```

**Mensaje A2 · Canasta, poderes y efectos** (adjunta `comunes/canasta.png` y `superheroes/capitan_estrella.png`) → `canasta.png`, `bola_de_fuego.png`, `estrella_magica.png`, `corazon.png`, `chispa.png`, `humo.png`

```
Adjunto dos imágenes. La primera es la canasta actual del juego: respeta su diseño. La segunda es solo la referencia de calidad y estilo: dibuja con ese mismo nivel de detalle, nitidez y acabado. Caricatura 2D para un videojuego infantil (8 a 12 años), contornos oscuros gruesos, colores vivos, formas simples. Fondo blanco liso (sin cuadrícula ni transparencia). Sin textos ni etiquetas. Cada elemento completo, bien separado de los demás y sin que se corte ninguna parte. Máxima resolución.

Hoja de 6 elementos del mismo tamaño, bien separados: 1) una canasta de mimbre café con asa, vista de frente; 2) una bola de fuego naranja y amarilla con llamas hacia arriba; 3) una estrella mágica rosada brillante con destellos; 4) un corazón rojo brillante; 5) un destello amarillo de cuatro puntas, como una chispa de brillo; 6) una nubecita de humo gris suave y redondeada, como un pequeño "puf" de caricatura.
```

**Mensaje A3 · Íconos de los menús** (adjunta `comunes/icono_trofeo.png` y `comunes/icono_memoria.png`) → `icono_mapa.png`, `icono_trofeo.png`, `icono_candado.png`, `icono_lupa.png`, `icono_memoria.png`

```
Adjunto dos íconos actuales del juego: respeta su estilo y sus colores, pero dibújalos con más nitidez y acabado. Íconos para un videojuego infantil (8 a 12 años), caricatura 2D, contornos oscuros gruesos, colores vivos, formas simples y fáciles de reconocer. Fondo blanco liso (sin cuadrícula ni transparencia). Sin textos. Cada ícono completo, bien separado de los demás. Máxima resolución.

Hoja de 5 íconos cuadrados del mismo tamaño, bien separados: 1) un mapa de papel azul doblado con una X roja; 2) un trofeo dorado con una estrella naranja; 3) un candado gris cerrado; 4) una lupa celeste; 5) un tablero de 3 × 3 casillas grises con un camino de casillas moradas encendidas y una estrella dorada en una esquina.
```

---

## B. Los 3 mundos

### 1. Superhéroes 🦸 — carpeta `assets/superheroes/`

**Mensaje 1 · Protagonista y villano** (adjunta `heroe_rayo.png`, `sombra.png` y `capitan_estrella.png`) → `heroe_rayo.png`, `sombra.png`

```
Adjunto tres imágenes. Las dos primeras son los personajes actuales del juego: respeta exactamente su diseño (forma, colores, ropa, peinado y detalles). La tercera es solo la referencia de calidad y estilo: dibújalos con ese mismo nivel de detalle, nitidez y acabado. Caricatura 2D para un videojuego infantil (8 a 12 años), contornos oscuros gruesos, colores vivos, formas simples. Fondo blanco liso (sin cuadrícula ni transparencia). Sin textos ni etiquetas. Cada personaje completo, de cuerpo entero, bien separado del otro y sin que se corte ninguna parte. Máxima resolución.

Hoja de 2 personajes de frente, de cuerpo entero, del mismo tamaño: 1) Héroe Rayo, un niño superhéroe valiente y amable, con capa roja, traje azul, antifaz morado y un rombo con un rayo amarillo en el pecho; 2) Sombra, un villano travieso y gracioso (no aterrador), con capa negra, traje morado oscuro, antifaz negro, guantes verdes y sonrisa pícara.
```

**Mensaje 2 · Las señales (objetivo y distractores)** (adjunta `senal_de_sombra.png`, `senal_heroe_noche.png` y `capitan_estrella.png`) → `senal_de_sombra.png`, `senal_capitan_estrella.png`, `senal_escudo_verde.png`, `senal_heroe_noche.png`

```
Adjunto tres imágenes. Las dos primeras son insignias actuales del juego: respeta su diseño. La tercera es solo la referencia de calidad y estilo: dibuja con ese mismo nivel de detalle, nitidez y acabado. Caricatura 2D para un videojuego infantil (8 a 12 años), contornos oscuros gruesos, colores vivos, formas simples. Fondo blanco liso (sin cuadrícula ni transparencia). Sin textos ni etiquetas. Cada insignia completa, bien separada de las demás y sin que se corte ninguna parte. Máxima resolución.

Hoja de 4 insignias de superhéroe, planas, de frente y todas exactamente del mismo tamaño y la misma forma de rombo con borde oscuro: 1) rombo morado con un antifaz negro en el centro; 2) rombo azul con una estrella blanca; 3) rombo verde con una flecha blanca hacia arriba; 4) rombo morado con una luna blanca. La 1 y la 4 deben tener exactamente el mismo morado: solo cambia el dibujo del centro.
```

**Mensaje 3 · Poses de Sombra** (adjunta el **nuevo** `sombra.png` del mensaje 1) → `sombra_puntillas.png`, `sombra_risa.png`, `sombra_encorvado.png`, `sombra_corriendo.png`, `sombra_cara.png`, `sombra_asustado.png`

```
Usa exactamente el mismo estilo y el mismo diseño del personaje de la imagen adjunta: caricatura 2D para un videojuego infantil (8 a 12 años), contornos oscuros gruesos, colores vivos, formas simples, mismo nivel de detalle y nitidez. Fondo blanco liso (sin cuadrícula ni transparencia). Sin textos ni etiquetas. Cada pose completa, de cuerpo entero, bien separada de las demás y sin que se corte ninguna parte. Máxima resolución.

Hoja de poses del mismo Sombra de la imagen adjunta: 1) caminando de puntillas, escabulléndose; 2) riéndose con la mano en la boca; 3) encorvado, burlándose con mirada traviesa; 4) corriendo de perfil, mirando hacia la derecha; 5) solo la cara, asomándose con sonrisa traviesa y mirando de lado; 6) asustado, huyendo.
```

**Mensaje 4 · Sombra atrapado** (adjunta el nuevo `sombra.png`) → `sombra_atrapado.png`

```
Usa exactamente el mismo estilo y el mismo diseño del personaje de la imagen adjunta: caricatura 2D para un videojuego infantil (8 a 12 años), contornos oscuros gruesos, colores vivos, formas simples, mismo nivel de detalle y nitidez. Fondo blanco liso (sin cuadrícula ni transparencia). Sin textos ni etiquetas. El personaje completo, de cuerpo entero, sin que se corte ninguna parte. Máxima resolución.

El mismo Sombra de la imagen adjunta, atrapado dentro de una red blanca, con cara de enojo y derrota (cómica, no triste).
```

**Mensaje 5 · Poses de la Capitana Estrella** (adjunta `capitan_estrella.png`, que ya está en HD) → `capitan_ayuda.png`, `capitan_cubriendose.png`, `capitan_huye.png`

```
Usa exactamente el mismo estilo y el mismo diseño del personaje de la imagen adjunta: caricatura 2D para un videojuego infantil (8 a 12 años), contornos oscuros gruesos, colores vivos, formas simples, mismo nivel de detalle y nitidez. Fondo blanco liso (sin cuadrícula ni transparencia). Sin textos ni etiquetas. Cada pose completa, de cuerpo entero, bien separada de las demás y sin que se corte ninguna parte. Máxima resolución.

Hoja de poses de la misma Capitana Estrella de la imagen adjunta: 1) asustada, con los brazos arriba pidiendo ayuda; 2) arrodillada, cubriéndose la cabeza con los brazos; 3) huyendo asustada, de perfil mirando hacia la izquierda.
```

**Mensaje 6 · Lo que cruza la pantalla y el tesoro** (adjunta `capitan_estrella.png`) → `avion.png`, `pajaro.png`, `gato.png`, `tesoro_escudo.png`

```
Usa exactamente el mismo estilo de dibujo de la imagen adjunta: caricatura 2D para un videojuego infantil (8 a 12 años), contornos oscuros gruesos, colores vivos, formas simples, mismo nivel de detalle y nitidez. Fondo blanco liso (sin cuadrícula ni transparencia). Sin textos ni etiquetas. Cada elemento completo, bien separado de los demás y sin que se corte ninguna parte. Máxima resolución.

Hoja de 4 elementos bien separados: 1) un avión de pasajeros blanco, de perfil mirando a la derecha; 2) un pájaro negro volando con las alas abiertas, de perfil mirando a la derecha; 3) un gato negro caminando, de perfil mirando a la derecha; 4) el Escudo del Héroe: un escudo perfectamente redondo, visto de frente, con anillos rojo, blanco y azul y una estrella dorada en el centro, que llene todo su espacio.
```

**Mensaje 7 · Fondo 1** (adjunta `fondo_1_el_centro.png` y `espacio/fondo_1_base_lunar.jpg`) → `fondo_1_el_centro.png`

```
Adjunto dos imágenes. La primera es el fondo actual del juego: mantén la misma escena y la misma composición. La segunda es solo la referencia de calidad y estilo. Fondo de videojuego infantil 2D, colores suaves y alegres, contornos oscuros, formato horizontal 16:9, de 1920 × 1080 píxeles o más. Sin personajes, sin textos. El centro debe quedar más despejado y menos detallado (ahí aparecen los objetos del juego); los detalles van hacia los bordes y la parte de abajo.

El centro de una ciudad moderna de día: cielo azul con sol y edificios a los lados.
```

**Mensaje 8 · Fondo 2** (adjunta `fondo_2_barrio_norte.png` y `espacio/fondo_1_base_lunar.jpg`) → `fondo_2_barrio_norte.png`

```
Adjunto dos imágenes. La primera es el fondo actual del juego: mantén la misma escena y la misma composición. La segunda es solo la referencia de calidad y estilo. Fondo de videojuego infantil 2D, colores suaves y alegres, contornos oscuros, formato horizontal 16:9, de 1920 × 1080 píxeles o más. Sin personajes, sin textos. El centro debe quedar más despejado y menos detallado (ahí aparecen los objetos del juego); los detalles van hacia los bordes y la parte de abajo.

Un barrio de casas y edificios bajos al atardecer, con el cielo naranja.
```

**Mensaje 9 · Fondo 3** (adjunta `fondo_3_el_puerto.png` y `espacio/fondo_1_base_lunar.jpg`) → `fondo_3_el_puerto.png`

```
Adjunto dos imágenes. La primera es el fondo actual del juego: mantén la misma escena y la misma composición. La segunda es solo la referencia de calidad y estilo. Fondo de videojuego infantil 2D, colores suaves y alegres, contornos oscuros, formato horizontal 16:9, de 1920 × 1080 píxeles o más. Sin personajes, sin textos. El centro debe quedar más despejado y menos detallado (ahí aparecen los objetos del juego); los detalles van hacia los bordes y la parte de abajo.

El puerto de la ciudad por la tarde: muelles, barcos y mar.
```

**Mensaje 10 · Fondo 4** (adjunta `fondo_4_la_torre.png` y `espacio/fondo_1_base_lunar.jpg`) → `fondo_4_la_torre.png`

```
Adjunto dos imágenes. La primera es el fondo actual del juego: mantén la misma escena y la misma composición. La segunda es solo la referencia de calidad y estilo. Fondo de videojuego infantil 2D, colores suaves y alegres, contornos oscuros, formato horizontal 16:9, de 1920 × 1080 píxeles o más. Sin personajes, sin textos. El centro debe quedar más despejado y menos detallado (ahí aparecen los objetos del juego); los detalles van hacia los bordes y la parte de abajo.

La ciudad de noche con ventanas iluminadas, la luna y una torre alta a un costado.
```

**Mensaje 11 · Fondo 5** (adjunta `fondo_5_guarida_de_sombra.png` y `espacio/fondo_1_base_lunar.jpg`) → `fondo_5_guarida_de_sombra.png`

```
Adjunto dos imágenes. La primera es el fondo actual del juego: mantén la misma escena y la misma composición. La segunda es solo la referencia de calidad y estilo. Fondo de videojuego infantil 2D, colores suaves y alegres, contornos oscuros, formato horizontal 16:9, de 1920 × 1080 píxeles o más. Sin personajes, sin textos. El centro debe quedar más despejado y menos detallado (ahí aparecen los objetos del juego); los detalles van hacia los bordes y la parte de abajo.

La guarida de Sombra: un edificio oscuro con luces moradas en una noche de tormenta; misterioso, pero apto para niños.
```

**Mensaje 12 · Escena final** (adjunta los nuevos `heroe_rayo.png` y `sombra_atrapado.png`) → `final.jpg`

```
Usa exactamente el mismo estilo y el mismo diseño de los personajes de las imágenes adjuntas: ilustración de videojuego infantil 2D, colores vivos y alegres, contornos oscuros, formato horizontal 16:9, de 1920 × 1080 píxeles o más. Sin textos. Máxima resolución.

Escena final de celebración: Héroe Rayo celebrando con los brazos arriba junto a Sombra atrapado en una red, con la ciudad iluminada de noche detrás.
```


### 2. Dragones y fantasía 🐉 — carpeta `assets/dragones/`

**Mensaje 1 · Protagonista y villana** (adjunta `chispa_la_dragona.png`, `morgana_la_hechicera.png` y `hada_del_bosque.png`) → `chispa_la_dragona.png`, `morgana_la_hechicera.png`

```
Adjunto tres imágenes. Las dos primeras son los personajes actuales del juego: respeta exactamente su diseño (forma, colores, ropa, peinado y detalles). La tercera es solo la referencia de calidad y estilo: dibújalos con ese mismo nivel de detalle, nitidez y acabado. Caricatura 2D para un videojuego infantil (8 a 12 años), contornos oscuros gruesos, colores vivos, formas simples. Fondo blanco liso (sin cuadrícula ni transparencia). Sin textos ni etiquetas. Cada personaje completo, de cuerpo entero, bien separado del otro y sin que se corte ninguna parte. Máxima resolución.

Hoja de 2 personajes de frente, de cuerpo entero, del mismo tamaño: 1) Chispa, una dragona joven, verde, amable y entusiasta, con barriga amarilla, cuernitos color crema y alas pequeñas; 2) Morgana, una hechicera traviesa y graciosa (no aterradora), con sombrero puntiagudo morado, capa morada con estrellas, varita con punta verde y sonrisa pícara.
```

**Mensaje 2 · Dragones bebé (objetivo y distractores)** (adjunta `dragon_bebe_dorado.png`, `dragon_bebe_amarillo_palido.png` y `hada_del_bosque.png`) → `dragon_bebe_dorado.png`, `dragon_bebe_rojo.png`, `dragon_bebe_azul.png`, `dragon_bebe_amarillo_palido.png`

```
Adjunto tres imágenes. Las dos primeras son dragones bebé actuales del juego: respeta su diseño. La tercera es solo la referencia de calidad y estilo: dibújalos con ese mismo nivel de detalle, nitidez y acabado. Caricatura 2D para un videojuego infantil (8 a 12 años), contornos oscuros gruesos, colores vivos, formas simples. Fondo blanco liso (sin cuadrícula ni transparencia). Sin textos ni etiquetas. Cada dragón completo, bien separado de los demás y sin que se corte ninguna parte. Máxima resolución.

Hoja de 4 dragones bebé idénticos en forma, pose y tamaño (de frente, alas pequeñas abiertas, cara tierna); solo cambia el color: 1) dorado brillante con manchas naranjas; 2) rojo; 3) azul; 4) amarillo pálido sin manchas.
```

**Mensaje 3 · Poses de Morgana** (adjunta la **nueva** `morgana_la_hechicera.png` del mensaje 1) → `morgana_puntillas.png`, `morgana_risa.png`, `morgana_agachada.png`, `morgana_corriendo.png`, `morgana_cara.png`, `morgana_asustada.png`

```
Usa exactamente el mismo estilo y el mismo diseño del personaje de la imagen adjunta: caricatura 2D para un videojuego infantil (8 a 12 años), contornos oscuros gruesos, colores vivos, formas simples, mismo nivel de detalle y nitidez. Fondo blanco liso (sin cuadrícula ni transparencia). Sin textos ni etiquetas. Cada pose completa, de cuerpo entero, bien separada de las demás y sin que se corte ninguna parte. Máxima resolución.

Hoja de poses de la misma Morgana de la imagen adjunta: 1) caminando de puntillas, escabulléndose; 2) riéndose con la mano en la boca y la varita en la otra; 3) agachada, burlándose con mirada traviesa; 4) corriendo de perfil, mirando hacia la derecha; 5) solo la cara con su sombrero, asomándose con sonrisa traviesa y mirando de lado; 6) asustada, huyendo.
```

**Mensaje 4 · Morgana atrapada** (adjunta la nueva `morgana_la_hechicera.png`) → `morgana_atrapada.png`

```
Usa exactamente el mismo estilo y el mismo diseño del personaje de la imagen adjunta: caricatura 2D para un videojuego infantil (8 a 12 años), contornos oscuros gruesos, colores vivos, formas simples, mismo nivel de detalle y nitidez. Fondo blanco liso (sin cuadrícula ni transparencia). Sin textos ni etiquetas. El personaje completo, de cuerpo entero, sin que se corte ninguna parte. Máxima resolución.

La misma Morgana de la imagen adjunta, atrapada dentro de una red blanca, con cara de enojo y derrota (cómica, no triste).
```

**Mensaje 5 · Poses del Mago Abuelo** (adjunta `mago_abuelo.png`, que ya está en HD) → `mago_ayuda.png`, `mago_cubriendose.png`, `mago_huye.png`

```
Usa exactamente el mismo estilo y el mismo diseño del personaje de la imagen adjunta: caricatura 2D para un videojuego infantil (8 a 12 años), contornos oscuros gruesos, colores vivos, formas simples, mismo nivel de detalle y nitidez. Fondo blanco liso (sin cuadrícula ni transparencia). Sin textos ni etiquetas. Cada pose completa, de cuerpo entero, bien separada de las demás y sin que se corte ninguna parte. Máxima resolución.

Hoja de poses del mismo Mago Abuelo de la imagen adjunta: 1) asustado, con las manos juntas suplicando ayuda; 2) agachado, cubriéndose la cabeza con los brazos; 3) huyendo asustado, de perfil mirando hacia la izquierda.
```

**Mensaje 6 · Lo que cruza la pantalla y el tesoro** (adjunta `hada_del_bosque.png`) → `mariposa.png`, `murcielago.png`, `ardilla.png`, `tesoro_gema.png`

```
Usa exactamente el mismo estilo de dibujo de la imagen adjunta: caricatura 2D para un videojuego infantil (8 a 12 años), contornos oscuros gruesos, colores vivos, formas simples, mismo nivel de detalle y nitidez. Fondo blanco liso (sin cuadrícula ni transparencia). Sin textos ni etiquetas. Cada elemento completo, bien separado de los demás y sin que se corte ninguna parte. Máxima resolución.

Hoja de 4 elementos bien separados: 1) una mariposa morada y rosada (nada dorado ni amarillo), de perfil mirando a la derecha; 2) un murciélago azul oscuro volando, de perfil mirando a la derecha; 3) una ardilla café caminando, de perfil mirando a la derecha; 4) la Gema de Fuego: una gema naranja perfectamente redonda, vista de frente, con facetas y centro dorado, que llene todo su espacio.
```

**Mensaje 7 · Fondo 1** (adjunta `fondo_1_nido.jpg` y `espacio/fondo_1_base_lunar.jpg`) → `fondo_1_nido.png`

```
Adjunto dos imágenes. La primera es el fondo actual del juego: mantén la misma escena y la misma composición. La segunda es solo la referencia de calidad y estilo. Fondo de videojuego infantil 2D, colores suaves y alegres, contornos oscuros, formato horizontal 16:9, de 1920 × 1080 píxeles o más. Sin personajes, sin textos. El centro debe quedar más despejado y menos detallado (ahí aparecen los objetos del juego); los detalles van hacia los bordes y la parte de abajo.

El nido de los dragones en lo alto de una colina, en un día soleado.
```

**Mensaje 8 · Fondo 2** (adjunta `fondo_2_bosque.jpg` y `espacio/fondo_1_base_lunar.jpg`) → `fondo_2_bosque.png`

```
Adjunto dos imágenes. La primera es el fondo actual del juego: mantén la misma escena y la misma composición. La segunda es solo la referencia de calidad y estilo. Fondo de videojuego infantil 2D, colores suaves y alegres, contornos oscuros, formato horizontal 16:9, de 1920 × 1080 píxeles o más. Sin personajes, sin textos. El centro debe quedar más despejado y menos detallado (ahí aparecen los objetos del juego); los detalles van hacia los bordes y la parte de abajo.

Un bosque mágico con árboles grandes y luz que entra entre las hojas.
```

**Mensaje 9 · Fondo 3** (adjunta `fondo_3_el_rio.png` y `espacio/fondo_1_base_lunar.jpg`) → `fondo_3_el_rio.png`

```
Adjunto dos imágenes. La primera es el fondo actual del juego: mantén la misma escena y la misma composición. La segunda es solo la referencia de calidad y estilo. Fondo de videojuego infantil 2D, colores suaves y alegres, contornos oscuros, formato horizontal 16:9, de 1920 × 1080 píxeles o más. Sin personajes, sin textos. El centro debe quedar más despejado y menos detallado (ahí aparecen los objetos del juego); los detalles van hacia los bordes y la parte de abajo.

Un río que cruza un valle verde.
```

**Mensaje 10 · Fondo 4** (adjunta `fondo_4_la_cueva.png` y `espacio/fondo_1_base_lunar.jpg`) → `fondo_4_la_cueva.png`

```
Adjunto dos imágenes. La primera es el fondo actual del juego: mantén la misma escena y la misma composición. La segunda es solo la referencia de calidad y estilo. Fondo de videojuego infantil 2D, colores suaves y alegres, contornos oscuros, formato horizontal 16:9, de 1920 × 1080 píxeles o más. Sin personajes, sin textos. El centro debe quedar más despejado y menos detallado (ahí aparecen los objetos del juego); los detalles van hacia los bordes y la parte de abajo.

Una cueva con cristales brillantes celestes en las paredes.
```

**Mensaje 11 · Fondo 5** (adjunta `fondo_5_el_volcan.png` y `espacio/fondo_1_base_lunar.jpg`) → `fondo_5_el_volcan.png`

```
Adjunto dos imágenes. La primera es el fondo actual del juego: mantén la misma escena y la misma composición. La segunda es solo la referencia de calidad y estilo. Fondo de videojuego infantil 2D, colores suaves y alegres, contornos oscuros, formato horizontal 16:9, de 1920 × 1080 píxeles o más. Sin personajes, sin textos. El centro debe quedar más despejado y menos detallado (ahí aparecen los objetos del juego); los detalles van hacia los bordes y la parte de abajo.

Un volcán con ríos de lava y el cielo rojo y anaranjado; emocionante, pero apto para niños.
```

**Mensaje 12 · Escena final** (adjunta las nuevas `chispa_la_dragona.png`, `dragon_bebe_dorado.png` y `morgana_atrapada.png`) → `final.jpg`

```
Usa exactamente el mismo estilo y el mismo diseño de los personajes de las imágenes adjuntas: ilustración de videojuego infantil 2D, colores vivos y alegres, contornos oscuros, formato horizontal 16:9, de 1920 × 1080 píxeles o más. Sin textos. Máxima resolución.

Escena final de celebración: Chispa abrazando a su hermanito, el dragón bebé dorado, con Morgana atrapada en una red a un costado, en un bosque mágico.
```


### 3. Reino mágico 👑 — carpeta `assets/reino_magico/`

**Mensaje 1 · Protagonista y villano** (adjunta `reina_luna.png`, `duende_picaro.png` y `guardia.png`) → `reina_luna.png`, `duende_picaro.png`

```
Adjunto tres imágenes. Las dos primeras son los personajes actuales del juego: respeta exactamente su diseño (forma, colores, ropa, peinado y detalles). La tercera es solo la referencia de calidad y estilo: dibújalos con ese mismo nivel de detalle, nitidez y acabado. Caricatura 2D para un videojuego infantil (8 a 12 años), contornos oscuros gruesos, colores vivos, formas simples. Fondo blanco liso (sin cuadrícula ni transparencia). Sin textos ni etiquetas. Cada personaje completo, de cuerpo entero, bien separado del otro y sin que se corte ninguna parte. Máxima resolución.

Hoja de 2 personajes de frente, de cuerpo entero, del mismo tamaño: 1) la Reina Luna, una reina joven y cariñosa, con vestido rosado, corona dorada con una joya rosada y pelo castaño largo; 2) el Duende Pícaro, un duende travieso y gracioso (no aterrador), pequeño, de piel verde, orejas puntiagudas, gorro verde oscuro, chaleco morado y sonrisa pícara.
```

**Mensaje 2 · Hadas (objetivo y distractores)** (adjunta `hada_rosada_lumi.png`, `hada_lila.png` y `guardia.png`) → `hada_rosada_lumi.png`, `hada_azul.png`, `hada_verde.png`, `hada_lila.png`

```
Adjunto tres imágenes. Las dos primeras son hadas actuales del juego: respeta su diseño. La tercera es solo la referencia de calidad y estilo: dibújalas con ese mismo nivel de detalle, nitidez y acabado. Caricatura 2D para un videojuego infantil (8 a 12 años), contornos oscuros gruesos, colores vivos, formas simples. Fondo blanco liso (sin cuadrícula ni transparencia). Sin textos ni etiquetas. Cada hada completa, bien separada de las demás y sin que se corte ninguna parte. Máxima resolución.

Hoja de 4 hadas pequeñas idénticas en forma, pose, peinado y tamaño (de frente, volando, alas abiertas, sonrientes); solo cambia el color del vestido, las alas y el pelo: 1) Lumi, rosado intenso; 2) azul; 3) verde; 4) lila pálido (parecido al rosado, pero más apagado).
```

**Mensaje 3 · Poses del Duende Pícaro** (adjunta el **nuevo** `duende_picaro.png` del mensaje 1) → `duende_puntillas.png`, `duende_risa.png`, `duende_burla.png`, `duende_corriendo.png`, `duende_cara.png`, `duende_asustado.png`

```
Usa exactamente el mismo estilo y el mismo diseño del personaje de la imagen adjunta: caricatura 2D para un videojuego infantil (8 a 12 años), contornos oscuros gruesos, colores vivos, formas simples, mismo nivel de detalle y nitidez. Fondo blanco liso (sin cuadrícula ni transparencia). Sin textos ni etiquetas. Cada pose completa, de cuerpo entero, bien separada de las demás y sin que se corte ninguna parte. Máxima resolución.

Hoja de poses del mismo Duende Pícaro de la imagen adjunta: 1) caminando de puntillas, escabulléndose; 2) riéndose con la mano en la boca; 3) agachado, burlándose con mirada traviesa; 4) corriendo de perfil, mirando hacia la derecha; 5) solo la cara, asomándose con sonrisa traviesa y mirando de lado; 6) asustado, huyendo.
```

**Mensaje 4 · Duende atrapado** (adjunta el nuevo `duende_picaro.png`) → `duende_atrapado.png`

```
Usa exactamente el mismo estilo y el mismo diseño del personaje de la imagen adjunta: caricatura 2D para un videojuego infantil (8 a 12 años), contornos oscuros gruesos, colores vivos, formas simples, mismo nivel de detalle y nitidez. Fondo blanco liso (sin cuadrícula ni transparencia). Sin textos ni etiquetas. El personaje completo, de cuerpo entero, sin que se corte ninguna parte. Máxima resolución.

El mismo Duende Pícaro de la imagen adjunta, atrapado dentro de una red blanca, con cara de enojo y derrota (cómica, no triste).
```

**Mensaje 5 · Poses del Guardia** (adjunta `guardia.png`, que ya está en HD) → `guardia_corriendo.png`, `guardia_ayuda.png`, `guardia_cubriendose.png`

```
Usa exactamente el mismo estilo y el mismo diseño del personaje de la imagen adjunta: caricatura 2D para un videojuego infantil (8 a 12 años), contornos oscuros gruesos, colores vivos, formas simples, mismo nivel de detalle y nitidez. Fondo blanco liso (sin cuadrícula ni transparencia). Sin textos ni etiquetas. Cada pose completa, de cuerpo entero, bien separada de las demás y sin que se corte ninguna parte. Máxima resolución.

Hoja de poses del mismo Guardia de la imagen adjunta: 1) corriendo de perfil, mirando hacia la derecha, gritando con una mano levantada, persiguiendo a alguien; 2) asustado, con los brazos arriba pidiendo ayuda; 3) agachado, cubriéndose la cabeza con los brazos.
```

**Mensaje 6 · Lo que cruza la pantalla y el tesoro** (adjunta `guardia.png`) → `libro_volador.png`, `escoba_magica.png`, `raton.png`, `tesoro_pastel.png`

```
Usa exactamente el mismo estilo de dibujo de la imagen adjunta: caricatura 2D para un videojuego infantil (8 a 12 años), contornos oscuros gruesos, colores vivos, formas simples, mismo nivel de detalle y nitidez. Fondo blanco liso (sin cuadrícula ni transparencia). Sin textos ni etiquetas. Cada elemento completo, bien separado de los demás y sin que se corte ninguna parte. Máxima resolución.

Hoja de 4 elementos bien separados (nada rosado en los tres primeros): 1) un libro abierto volando, de perfil mirando a la derecha; 2) una escoba mágica volando sola, de perfil mirando a la derecha; 3) un ratón gris caminando, de perfil mirando a la derecha; 4) el Pastel Real visto desde arriba: un pastel perfectamente redondo con betún rosado, fresas, chispas de colores y una pequeña corona dorada en el centro, que llene todo su espacio.
```

**Mensaje 7 · Fondo 1** (adjunta `fondo_1_jardin.jpg` y `espacio/fondo_1_base_lunar.jpg`) → `fondo_1_jardin.png`

```
Adjunto dos imágenes. La primera es el fondo actual del juego: mantén la misma escena y la misma composición. La segunda es solo la referencia de calidad y estilo. Fondo de videojuego infantil 2D, colores suaves y alegres, contornos oscuros, formato horizontal 16:9, de 1920 × 1080 píxeles o más. Sin personajes, sin textos. El centro debe quedar más despejado y menos detallado (ahí aparecen los objetos del juego); los detalles van hacia los bordes y la parte de abajo.

El jardín del castillo con flores y setos, y el castillo al fondo.
```

**Mensaje 8 · Fondo 2** (adjunta `fondo_2_la_cocina.png` y `espacio/fondo_1_base_lunar.jpg`) → `fondo_2_la_cocina.png`

```
Adjunto dos imágenes. La primera es el fondo actual del juego: mantén la misma escena y la misma composición. La segunda es solo la referencia de calidad y estilo. Fondo de videojuego infantil 2D, colores suaves y alegres, contornos oscuros, formato horizontal 16:9, de 1920 × 1080 píxeles o más. Sin personajes, sin textos. El centro debe quedar más despejado y menos detallado (ahí aparecen los objetos del juego); los detalles van hacia los bordes y la parte de abajo.

La cocina del castillo: azulejos, ollas y una ventana.
```

**Mensaje 9 · Fondo 3** (adjunta `fondo_3_la_biblioteca.png` y `espacio/fondo_1_base_lunar.jpg`) → `fondo_3_la_biblioteca.png`

```
Adjunto dos imágenes. La primera es el fondo actual del juego: mantén la misma escena y la misma composición. La segunda es solo la referencia de calidad y estilo. Fondo de videojuego infantil 2D, colores suaves y alegres, contornos oscuros, formato horizontal 16:9, de 1920 × 1080 píxeles o más. Sin personajes, sin textos. El centro debe quedar más despejado y menos detallado (ahí aparecen los objetos del juego); los detalles van hacia los bordes y la parte de abajo.

La biblioteca del castillo, con estanterías llenas de libros a los lados.
```

**Mensaje 10 · Fondo 4** (adjunta `fondo_4_la_torre.png` y `espacio/fondo_1_base_lunar.jpg`) → `fondo_4_la_torre.png`

```
Adjunto dos imágenes. La primera es el fondo actual del juego: mantén la misma escena y la misma composición. La segunda es solo la referencia de calidad y estilo. Fondo de videojuego infantil 2D, colores suaves y alegres, contornos oscuros, formato horizontal 16:9, de 1920 × 1080 píxeles o más. Sin personajes, sin textos. El centro debe quedar más despejado y menos detallado (ahí aparecen los objetos del juego); los detalles van hacia los bordes y la parte de abajo.

Una habitación de la torre: paredes de piedra y una ventana redonda con el cielo de noche.
```

**Mensaje 11 · Fondo 5** (adjunta `fondo_5_el_salon_del_trono.png` y `espacio/fondo_1_base_lunar.jpg`) → `fondo_5_el_salon_del_trono.png`

```
Adjunto dos imágenes. La primera es el fondo actual del juego: mantén la misma escena y la misma composición. La segunda es solo la referencia de calidad y estilo. Fondo de videojuego infantil 2D, colores suaves y alegres, contornos oscuros, formato horizontal 16:9, de 1920 × 1080 píxeles o más. Sin personajes, sin textos. El centro debe quedar más despejado y menos detallado (ahí aparecen los objetos del juego); los detalles van hacia los bordes y la parte de abajo.

El salón del trono: alfombra roja, columnas y un trono dorado al fondo.
```

**Mensaje 12 · Escena final** (adjunta las nuevas `reina_luna.png`, `hada_rosada_lumi.png` y `duende_atrapado.png`) → `final.jpg`

```
Usa exactamente el mismo estilo y el mismo diseño de los personajes de las imágenes adjuntas: ilustración de videojuego infantil 2D, colores vivos y alegres, contornos oscuros, formato horizontal 16:9, de 1920 × 1080 píxeles o más. Sin textos. Máxima resolución.

Escena final de celebración: la Reina Luna celebrando con Lumi, el hada rosada, en la mano, y el Duende Pícaro atrapado en una red a un costado, en el salón del trono.
```
