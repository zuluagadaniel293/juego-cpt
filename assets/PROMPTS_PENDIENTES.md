# Prompts pendientes para Gemini

Con estas imágenes **ya no quedará nada dibujado por Claude**: todo el juego usará imágenes de Gemini.
Están ordenadas en **mensajes**. Cada mensaje es una hoja; después pides separar cada elemento.

## Reglas para todos los mensajes

**1. Adjunta una imagen de referencia** (por ejemplo, la hoja de los superhéroes) y empieza con:
> Usa exactamente el mismo estilo de dibujo de esta imagen: caricatura 2D para un videojuego infantil (8 a 12 años), contornos oscuros gruesos, colores vivos y planos, sombreado mínimo, formas simples. Sin texto, sin letras, sin marcas de agua. Fondo blanco liso, sin sombra en el suelo. Todos los elementos de cuerpo entero, bien separados entre sí y **sin que se corte ninguna parte**. Máxima resolución.

**2. Para separar cada elemento** después de la hoja:
> Usando exactamente el mismo diseño, genera solo el elemento número [N], solo, centrado y completo, con espacio libre alrededor, fondo blanco liso, sin texto, máxima resolución.

**3. Guarda cada imagen** en la carpeta del mundo con el nombre que dice la tabla. Si la hoja ya trae los elementos bien separados, **no hace falta pedirlos uno por uno**: yo los separo.

---

## Mensaje 1 · Reino mágico: personajes (4) → `assets/reino_magico/`
> [Reglas] Hoja de 4 personajes de frente, **corriendo**:
> 1) **"Reina Luna"**: reina joven y cariñosa, vestido rosado, corona dorada con una joya rosada, pelo castaño largo;
> 2) **"Duende Pícaro"**: duende travieso y gracioso (NO aterrador), pequeño, orejas puntiagudas, gorro verde oscuro, chaleco morado, botas negras, sonrisa pícara;
> 3) **"Guardia del castillo"**: soldado amable con armadura plateada y casco con pluma azul;
> 4) **"Bufón del rey"**: bufón alegre con traje de rombos amarillo y rojo, y gorro con cascabeles.

| N° | Archivo | Uso en el juego |
|---|---|---|
| 1 | `reina_luna.png` | Protagonista |
| 2 | `duende_picaro.png` | Villano (jefe final) |
| 3 | `guardia.png` | Amigo, distractor del jefe |
| 4 | `bufon.png` | Amigo, distractor del jefe |

## Mensaje 2 · Amigos parecidos al villano (distractor difícil del jefe final)
Adjunta la imagen del villano de cada mundo como referencia.
> [Reglas] Hoja de 2 personajes de frente, corriendo, **amables y sonrientes**:
> 1) **"Hechicera Buena"**: hechicera amable con sombrero puntiagudo y capa **morados**, parecida en colores a Morgana (adjunta), pero con cara dulce, sin varita y con una flor en el sombrero;
> 2) **"Duende Amable"**: duende amable, parecido al Duende Pícaro (adjunto), pero con gorro **azul** y una gran sonrisa amistosa.

| N° | Archivo | Carpeta |
|---|---|---|
| 1 | `hechicera_buena.png` | `assets/dragones/` |
| 2 | `duende_amable.png` | `assets/reino_magico/` |

## Mensaje 3 · Villanos atrapados en la red (para el final de cada mundo)
Adjunta la imagen de **Sombra**, **Morgana** y el **Duende Pícaro**.
> [Reglas] Hoja de 3 personajes, cada uno **atrapado dentro de una red de superhéroe blanca**, con cara de sorpresa graciosa (no asustados): 1) Sombra; 2) Morgana; 3) el Duende Pícaro. Mantén idéntico el diseño de cada personaje de las imágenes adjuntas.

| N° | Archivo | Carpeta |
|---|---|---|
| 1 | `sombra_atrapado.png` | `assets/superheroes/` |
| 2 | `morgana_atrapada.png` | `assets/dragones/` |
| 3 | `duende_atrapado.png` | `assets/reino_magico/` |

## Mensaje 4 · Señales de Superhéroes (lo que el niño busca) → `assets/superheroes/`
**Muy importante:** las 4 deben tener **exactamente la misma forma y el mismo tamaño** (un rombo). Solo cambian el color y el símbolo del centro. Si no, el niño las distingue por la forma y el juego se vuelve fácil.
> [Reglas] Hoja de 4 insignias de superhéroe **idénticas en forma y tamaño**: un rombo (cuadrado girado 45°) con borde oscuro grueso y un símbolo blanco grande en el centro, vistas de frente, planas:
> 1) rombo **morado** con un **antifaz negro** con ojos blancos;
> 2) rombo **azul** con una **estrella** blanca;
> 3) rombo **verde** con una **flecha hacia arriba** blanca;
> 4) rombo **morado** (el mismo morado del 1) con una **luna creciente** blanca.

| N° | Archivo | Uso en el juego |
|---|---|---|
| 1 | `senal_de_sombra.png` | Objetivo |
| 2 | `senal_capitan_estrella.png` | Distractor |
| 3 | `senal_escudo_verde.png` | Distractor |
| 4 | `senal_heroe_noche.png` | Distractor difícil |

## Mensaje 5 · Objetos del juego (todos los mundos) → `assets/comunes/`
> [Reglas] Hoja de 7 objetos, vistos de frente:
> 1) canasta de mimbre café, abierta hacia arriba;
> 2) red de superhéroe para atrapar, con mango café y malla blanca;
> 3) bola de fuego anaranjada y amarilla;
> 4) estrella mágica rosada brillante;
> 5) corazón rojo brillante;
> 6) nubecita de humo gris;
> 7) chispa de luz amarilla.

| N° | Archivo | Uso en el juego |
|---|---|---|
| 1 | `canasta.png` | Minijuego Atrapa |
| 2 | `red.png` | Atrapar al villano en el jefe final |
| 3 | `bola_de_fuego.png` | Poder de Chispa |
| 4 | `estrella_magica.png` | Poder de la Reina Luna |
| 5 | `corazon.png` | Rescate del hermanito y de Lumi |
| 6 | `humo.png` | Cuando el niño toca el objeto equivocado |
| 7 | `chispa.png` | Brillos al acertar |

## Mensaje 6 · Íconos de los menús → `assets/comunes/`
> [Reglas] Hoja de 4 íconos simples, planos, de frente: 1) mapa del tesoro doblado, azul, con una X roja; 2) trofeo dorado-anaranjado con una estrella; 3) candado gris; 4) lupa celeste.

| N° | Archivo | Uso |
|---|---|---|
| 1 | `icono_mapa.png` | Modo Historia |
| 2 | `icono_trofeo.png` | Modo Desafío |
| 3 | `icono_candado.png` | Mundos y capítulos bloqueados |
| 4 | `icono_lupa.png` | Minijuego Encuentra |

---

## Mensajes 7 al 18 · Fondos (uno por mensaje)
**Pega estas reglas en lugar de las anteriores** (los fondos no llevan fondo blanco):
> Fondo para un videojuego infantil, mismo estilo de dibujo de la imagen adjunta, colores suaves, **formato horizontal 16:9**, máxima resolución. **Sin personajes, sin texto.** La **zona central debe quedar tranquila y despejada** (cielo, pared o suelo liso), con los detalles hacia los bordes y la parte de abajo.

La zona central despejada importa: ahí aparece lo que el niño debe encontrar.

| Mensaje | Archivo | Descripción |
|---|---|---|
| 7 | `superheroes/fondo_1_el_centro.jpg` | Centro de una ciudad moderna **de día**, cielo azul y sol, edificios a los lados |
| 8 | `superheroes/fondo_2_barrio_norte.jpg` | Barrio de casas y edificios bajos **al atardecer**, cielo naranja |
| 9 | `superheroes/fondo_3_el_puerto.jpg` | **Puerto** con muelles, barcos y mar, por la tarde |
| 10 | `superheroes/fondo_4_la_torre.jpg` | Ciudad **de noche** con ventanas iluminadas, luna y una torre alta al costado |
| 11 | `superheroes/fondo_5_guarida_de_sombra.jpg` | Guarida del villano: edificio oscuro con luces moradas, **noche de tormenta** |
| 12 | `dragones/fondo_3_el_rio.jpg` | Río que cruza un valle verde |
| 13 | `dragones/fondo_4_la_cueva.jpg` | Cueva con cristales brillantes celestes |
| 14 | `dragones/fondo_5_el_volcan.jpg` | Volcán con lava, cielo rojo y anaranjado |
| 15 | `reino_magico/fondo_2_la_cocina.jpg` | **Cocina** del castillo: azulejos, ollas, ventana |
| 16 | `reino_magico/fondo_3_la_biblioteca.jpg` | **Biblioteca** del castillo con estanterías de libros a los lados |
| 17 | `reino_magico/fondo_4_la_torre.jpg` | Habitación de la **torre**: paredes de piedra y ventana redonda con cielo de noche |
| 18 | `reino_magico/fondo_5_el_salon_del_trono.jpg` | **Salón del trono**: alfombra roja, columnas, trono dorado al fondo |

Como referencia de estilo para los fondos, adjunta uno de los que ya tienes (por ejemplo `dragones/fondo_1_nido.jpg`).

---

## Opcional · Escenas finales (una por mundo)
> [Reglas de fondos, pero **con** personajes] Escena final de celebración: [descripción]. Adjunta las imágenes de los personajes como referencia.

| Archivo | Descripción |
|---|---|
| `superheroes/final.jpg` | Héroe Rayo celebrando junto a Sombra atrapado en una red, con la ciudad iluminada de noche detrás |
| `dragones/final.jpg` | Chispa abrazando a su hermanito dragón bebé dorado, y Morgana atrapada en una red al costado, en un bosque mágico |
| `reino_magico/final.jpg` | La Reina Luna celebrando con Lumi en la mano, y el Duende Pícaro atrapado en una red, en el salón del trono |

---

## Opcional · Tesoros de la Misión perfecta (uno por mundo)
Hoy se dibujan solos; si llega la imagen, el juego la recorta en 3 pedazos. Debe ser **redonda y vista de frente o desde arriba**, ocupando todo el cuadro.
> [Reglas] Un solo objeto **redondo**, visto de frente, centrado y ocupando casi toda la imagen, fondo blanco liso: [descripción].

| Archivo | Descripción |
|---|---|
| `superheroes/tesoro_escudo.png` | Escudo redondo de superhéroe con anillos rojo, blanco y azul, y una estrella blanca en el centro amarillo |
| `dragones/tesoro_gema.png` | Gema de fuego redonda y facetada, naranja y dorada, con brillo interior como lava |
| `reino_magico/tesoro_pastel.png` | Pastel real redondo visto desde arriba: betún rosado, borde de crema, chispas de colores y fresas |

Después agrégalo en `assets/manifest.js` como `treasure: 'superheroes/tesoro_escudo.png'` (y así en cada mundo).

---

## Poses para las escenas de fondo (villanos y amigos como distractores)
Adjunta la hoja de personajes del mundo y pide una hoja de poses (como la de Sombra), con **fondo blanco liso** (no de cuadritos) y **sin textos**. Si trae
cuadritos o textos, no importa: yo los quito. Mejor si es de **alta resolución**.
> [Reglas] Hoja de poses del mismo personaje: 1) caminando de puntillas, escabulléndose; 2) riéndose con la mano en la boca.

| Mundo | Villano (`villain_sneak`, `villain_laugh`) | Amigo pidiendo ayuda (opcional) |
|---|---|---|
| Superhéroes | ✅ `superheroes/sombra_puntillas.png`, `superheroes/sombra_risa.png` | ✅ `superheroes/capitan_ayuda.png`, `superheroes/capitan_cubriendose.png` |
| Dragones | ✅ `dragones/morgana_puntillas.png`, `dragones/morgana_risa.png` | ✅ `dragones/mago_ayuda.png` |
| Reino mágico | Duende → `reino_magico/duende_puntillas.png`, `reino_magico/duende_risa.png` | Guardia corriendo y gritando |

---

## Lista de control
- [x] Mensaje 1: 4 personajes del Reino
- [x] Mensaje 2: 2 amigos parecidos al villano
- [x] Mensaje 3: 3 villanos atrapados
- [x] Mensaje 4: 4 señales de Superhéroes
- [ ] Mensaje 5: 7 objetos del juego → llegaron 6; **falta la nubecita de humo gris** (`humo.png`), que aparece cuando el niño toca el objeto equivocado
- [x] Mensaje 6: 4 íconos
- [x] Mensajes 7-18: 12 fondos
- [ ] Opcional: 3 escenas finales
