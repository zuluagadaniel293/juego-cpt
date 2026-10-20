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

## CSV del modo Memoria
El modo **Memoria** es una tarea tipo **Corsi** (memoria de trabajo visoespacial): el objetivo del mundo aparece en varias de las 9 casillas, una tras otra, y el niño las toca en el mismo orden (**adelante**) y luego del último al primero (**al revés**). La secuencia crece de a 1 al acertar; con 2 fallos seguidos en el mismo largo termina la fase.

Nombre del archivo: `cpt_memoria_<mundo>_<fecha>_<hora>.csv`. Cada fila es **un camino** (ensayo).

| Columna | Qué significa |
|---|---|
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
