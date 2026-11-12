# Cómo leer el CSV del juego

Al terminar una partida, el botón **Descargar CSV** guarda un archivo con **todo lo que pasó, fila por fila**.
Sirve para analizar la atención del niño en Excel, Google Sheets, SPSS, R, etc.

## Abrirlo
- **Excel:** doble clic en el archivo. Se abre ya separado en columnas (usa punto y coma, el formato de Excel en español).
- **Google Sheets:** Archivo → Importar → Subir → separador **punto y coma**.

Nombre del archivo: `cpt_<modo>_<mundo>_<fecha>_<hora>.csv`, por ejemplo `cpt_historia_superheroes_cap1_2026-10-07_15h30.csv`.

## Qué es cada fila
Cada fila es **un evento**:
- `estimulo`: apareció algo que el niño debía tocar (objetivo) o ignorar (distractor).
- `distractor_sonido`: sonó un ruido del mundo (sirena, rugido, campanas...).
- `distractor_visual`: algo cruzó por el borde de la pantalla (avión, mariposa, ratón...).
  Desde el nivel 2 también aparecen **los personajes del mundo**: `pelea_sombra_capitan`, `pelea_morgana_mago`,
  `guardia_persigue_duende`, `sombra_persigue_capitana`, `hada_persigue_morgana` (escena en un borde o arriba),
  `*_se_asoma` (el villano se asoma riéndose por una esquina), `sombra_espia` (su cara espía desde un lado, nivel 4+)
  y `*_escabulle` (el villano cruza por arriba de puntillas, desde el nivel 3).
  No salen en Carrera (el villano ya va adelante), en el jefe final ni en la Prueba fija.
  Además, en cada capítulo (y en cada nivel del Desafío) hay un **compañero** en una esquina que salta al acertar:
  no es un distractor y no queda en el CSV.
- En `distractor_sonido`, las filas `sonido_...` (`sonido_avion`, `sonido_gato`, `sonido_murcielago`...) son el sonido de
  lo que va cruzando la pantalla (desde el nivel 2): distractor **visual y auditivo a la vez**.
- Las filas `voz_...` son **voces** de los personajes, y siempre suenan con ese personaje a la vista (en su escena de fondo
  o, en Carrera, el villano que va adelante): `voz_risa` (nivel 2+), `voz_burla` y
  `voz_ayuda` / `voz_alto` (nivel 3+), `voz_amenaza` (nivel 4+). Cada personaje tiene su propia voz. Una voz humana distrae más que un ruido: sirve para comparar
  cómo afecta cada tipo de distractor.

## Columnas
| Columna | Qué significa |
|---|---|
| `tipo_evento` | estimulo / distractor_sonido / distractor_visual |
| `modo` | Historia, Desafío o Prueba fija |
| `mundo` | Superhéroes, Dragones y fantasía, Reino mágico |
| `nivel` | Nivel de dificultad (1 = más fácil) |
| `capitulo` | Capítulo de la Historia (1 a 5) |
| `fase_jefe` | En el jefe final: 1 = atrapar con la red, 2 = persecución |
| `minijuego` | Clásico, Atrapa, Carrera o Encuentra |
| `ensayo` | Número de estímulo dentro de la partida (1, 2, 3...) |
| `tipo_estimulo` | **objetivo** (había que responder) o **distractor** (había que ignorarlo) |
| `que_aparecio` | Qué imagen apareció (por ejemplo `senal_de_sombra`, `dragon_bebe_rojo`) o qué distractor del entorno |
| `momento_ms` | Cuándo apareció, en milisegundos desde el inicio (60000 = minuto 1) |
| `respondio` | si / no |
| `tiempo_reaccion_ms` | Cuánto tardó en responder (solo si respondió) |
| `resultado` | Ver la tabla siguiente |

## Resultados
| `resultado` | Qué pasó | Qué indica |
|---|---|---|
| `acierto` | Respondió al objetivo | Atención correcta |
| `omision` | **No** respondió al objetivo | Despiste / falta de atención sostenida |
| `error_impulsivo` | Respondió a un distractor | Impulsividad (error de comisión) |
| `ignoro_bien` | No respondió a un distractor | Control correcto |
| `toco_otro` | En Encuentra, tocó otro objeto en vez del objetivo | Búsqueda imprecisa / impulsividad |

## Medidas típicas del CPT (cómo sacarlas en Excel)
Activa **Datos → Filtro** y filtra `tipo_evento = estimulo`.

| Medida | Cómo calcularla |
|---|---|
| **Aciertos (%)** | cantidad de `acierto` ÷ cantidad de filas con `tipo_estimulo = objetivo` |
| **Omisiones** | cantidad de `omision` (más alto = más despistes) |
| **Comisiones** | cantidad de `error_impulsivo` + `toco_otro` (más alto = más impulsividad) |
| **Tiempo de reacción promedio** | promedio de `tiempo_reaccion_ms` en las filas `acierto` |
| **Variabilidad del tiempo de reacción** | desviación estándar de `tiempo_reaccion_ms` en `acierto` (en TDAH suele ser alta) |
| **Fatiga / atención sostenida** | compara aciertos y tiempo de reacción de la primera mitad (`momento_ms` bajo) con la segunda mitad |
| **Distractibilidad** | mira si hay más `omision` o `error_impulsivo` en los 2-3 segundos siguientes a un `distractor_sonido` o `distractor_visual` (compara su `momento_ms`) |

La pantalla de resultados de la **Prueba fija** ya muestra estas medidas calculadas para el adulto.

## CSV de Memoria
Memoria es una tarea tipo **Corsi** (memoria de trabajo visoespacial): el objetivo del mundo aparece en varias de las 9 casillas, una tras otra, y el niño las toca en el mismo orden (**adelante**) y luego del último al primero (**al revés**).

Se juega de dos formas:
- **Modo Memoria** (pantalla inicial): la secuencia crece de a 1 al acertar; con 2 fallos seguidos en el mismo largo termina la fase. Sirve para medir el *span*.
- **Historia y Desafío**: la dificultad la pone el nivel. Nivel 1: caminos de 2, lentos, sin distractores. Desde el 2: sonidos del mundo y cosas que cruzan. Desde el 3: fase al revés. Desde el 4: objetos distractores que se encienden en las casillas (hay que ignorarlos). Nivel 6: esos distractores se parecen al objetivo. Hay una cantidad fija de caminos; el largo sube 1 al acertar y baja 1 con 2 fallos seguidos.

Nombre del archivo: `cpt_memoria_<mundo>_<fecha>_<hora>.csv` (o `cpt_historia_...` / `cpt_desafio_...`). Cada fila es **un camino**, o un sonido o una cosa que cruzó la pantalla.

| Columna | Qué significa |
|---|---|
| `tipo_evento` | `camino`, `distractor_sonido` o `distractor_visual` |
| `modo`, `mundo`, `nivel`, `capitulo` | Dónde se jugó |
| `distractores_en_casillas` | Cuántos objetos distractores se encendieron en las casillas durante ese camino |
| `que_aparecio` | En las filas de distractores: qué sonó o qué cruzó |
| `fase` | `adelante` (memoria a corto plazo) o `al_reves` (memoria de trabajo: hay que manipular lo recordado) |
| `ensayo` | Número de camino dentro de la partida |
| `largo_secuencia` | Cuántas casillas tenía el camino |
| `casillas_mostradas` | Casillas en el orden en que aparecieron (numeradas 1 a 9, por ejemplo `4-8-6`) |
| `respuesta_esperada` | Lo que debía tocar (en `al_reves` es la secuencia invertida) |
| `respuesta_del_nino` | Lo que tocó |
| `correcto` | `si` / `no` |
| `tiempo_primer_toque_ms` | Cuánto tardó en empezar a responder |
| `tiempo_total_respuesta_ms` | Cuánto tardó en tocar todo el camino |

**Medidas principales:**
- **Span adelante** = el `largo_secuencia` más alto con `correcto = si` en `adelante`. Referencia aproximada para 8-12 años: ~5.
- **Span al revés** = lo mismo en `al_reves`. Referencia aproximada: ~4. En TDAH suele ser el más afectado.
- **Total correcto** = cantidad de `si`.

## Modos "Menos uno" y "Pista" (formatos de CPT de las evaluaciones)
Se juegan como el Clásico y su CSV tiene las mismas columnas, más **`condicion`**. En estos modos, `objetivo`
significa "lo que sí había que responder".

**Menos uno** (formato tipo **Conners CPT-3**): se responde a todo **menos** al objetivo del mundo, que sale 1 de cada 10 veces.

| `condicion` | Qué era | Respuesta correcta |
|---|---|---|
| `responder` | Una señal de un amigo | Responder (si no, es `omision`) |
| `no_responder` | El objetivo del mundo | No responder (si responde, es `error_impulsivo`: **impulsividad**) |

**Pista** (formato tipo **AX-CPT**): se responde al objetivo **solo si justo antes salió la pista** (la señal del primer amigo).
Mide atención sostenida y **memoria de trabajo** (hay que recordar la pista).

| `condicion` | Qué era | Si responde… |
|---|---|---|
| `pista` | La pista (A) | error (no se responde a la pista) |
| `pista_y_objetivo` | Pista y luego el objetivo (AX) | **acierto** (es lo único que se responde) |
| `objetivo_sin_pista` | El objetivo sin pista antes (BX) | error: **no recordó la pista** (falla de memoria de trabajo) |
| `pista_sin_objetivo` | Pista y luego otra cosa (AY) | error: respondió por anticipación |
| `ni_pista_ni_objetivo` | Ninguno (BY) | error al azar o por impulsividad |

En la **Zona de adultos** se puede elegir cualquiera de las tres pruebas fijas (CPT clásico, Menos uno, Pista), siempre
con los mismos parámetros para comparar sesiones. La pantalla de resultados muestra los errores por condición.
**No es un diagnóstico**: sirve para seguir el progreso del niño.

## Atrapa: objetos que se descubren al cruzar la línea
Desde el nivel 2, en Atrapa los objetos caen como **sombras iguales** y solo muestran qué son al cruzar una línea
amarilla, que baja con cada nivel (hay menos tiempo para decidir). Por eso, en Atrapa, `momento_ms` y
`tiempo_reaccion_ms` se cuentan **desde que el objeto se descubre**, no desde que empieza a caer: así el tiempo de
reacción mide cuánto tarda el niño en decidir y moverse, no cuánto se demora el objeto en caer.

## Jefe final
Sus dos fases salen al azar entre Clásico, Atrapa, Carrera, Encuentra y Memoria (la columna `fase_jefe` dice cuál
fue la 1 y cuál la 2). En la fase 1 se **rescata** al objetivo del mundo (`estimulos` = `senales`) y en la fase 2 se
**atrapa** al villano entre sus amigos (`personajes`). Si una fase es Memoria, sus caminos aparecen en el mismo CSV como `camino_memoria`, con
resultado `recordo_el_camino` o `se_equivoco_de_camino`.

## Niveles de señales y niveles de personajes
La columna `estimulos` dice qué se buscaba en ese nivel:
- `senales`: el objetivo de siempre (la señal de Sombra, el dragoncito dorado, Lumi) entre otros parecidos.
- `personajes`: **el villano escondido entre sus amigos** (Sombra entre la Capitana Estrella, Escudo Verde y Héroe Noche, etc.).
En la Historia cada capítulo sortea el tipo (al menos uno de cada uno por mundo); en el Desafío, cada nivel al azar.
La Prueba fija usa siempre señales, para poder comparar sesiones. Sirve para ver si al niño le cuesta más distinguir
señales (símbolos) o personajes (figuras parecidas, como Héroe Noche y Sombra).

## Giro de cada mundo
La columna `giro_del_mundo` dice qué cambia en ese mundo para que no todos se jueguen igual (desde el capítulo 2 de la
Historia y el nivel 2 del Desafío; vacía = sin giro). Cambia cómo se ven o se mueven las cosas, no qué hay que responder:
- Superhéroes: sin giro (es el primer mundo).
- Dragones `Niebla mágica`: niebla por los bordes, detrás de todo.
- Reino mágico `Hechizo giratorio`: los objetos llegan girando.
- Espacio `Gravedad cero`: los objetos flotan de lado a lado.
- Océano `Corriente marina`: la corriente empuja lo que cae hacia un lado; burbujas por los bordes.
- Dinosaurios `Temblor`: cada 9 a 15 s la pantalla tiembla un momento (queda como distractor `temblor`).
- Robots `Modo turbo`: unos objetos llegan más rápido y otros más lento (en promedio, igual).
- Selva `Lluvia de hojas`: caen hojas por detrás de los objetos.
- Dulces `Gomitas saltarinas`: los objetos llegan dando saltitos; chispitas de colores por detrás.
La Prueba fija y el modo Memoria nunca tienen giro. Al comparar mundos, conviene tener en cuenta esta columna.

Escenas nuevas de los personajes (columna `que_aparecio` en los distractores): `<villano>_roba_tesoro`, `<villano>_lanza_<algo>`
(escena propia de cada mundo, por un borde) y `..._gana_amigo` cuando en la pelea o la persecución el amigo se salva.

## Hechizos: lo que el villano amenaza, pasa
Cuando el villano dice su amenaza del capítulo ("¡Congelaré el río!"), el fondo cambia unos 5 segundos (el río se congela)
y luego vuelve a la normalidad. Pasa detrás de los objetos del juego y queda como distractor `hechizo_<efecto>`:
`dark` (se apagan las luces), `freeze` (hielo), `fire` (fuego o calor), `ink` (tinta), `sour` (todo agrio), `glitch` (falla de
computador), `hypno` (espirales), `vines` (enredaderas o algas), `seal` (paredes que cierran los lados), `meteors` (lluvia de
rocas), `stamp` (marcas del villano), `mess_<cosa>` (cosas volando), `steal` (roba el tesoro), `kidnap` (se lleva al
personaje), `takeover` (el fondo se tiñe con su color), `flood` (sube el agua), `smoke` (humo), `melt` (el helado se derrite).

