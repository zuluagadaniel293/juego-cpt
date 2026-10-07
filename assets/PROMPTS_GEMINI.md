# Instrucciones para generar las imágenes en Gemini

## Cómo trabajar (léelo primero)

1. **Primero la hoja completa del mundo** (todos los personajes juntos). Así Gemini fija un solo estilo.
2. Cuando te guste la hoja, pide cada personaje por separado, adjuntando la hoja:
   > *"Usando exactamente el mismo estilo y diseño de esta imagen, genera solo el personaje N, solo, centrado, de cuerpo entero, sobre fondo blanco liso."*
3. Si un personaje sale distinto (otra cara, otros colores), dile: *"Mantén el diseño idéntico al de la hoja, solo cambia…"*.
4. **Guarda cada imagen** con un **nombre que diga qué muestra** (por ejemplo `hada_rosada_lumi.png`), en su carpeta (`assets/superheroes`, `assets/dragones`, `assets/reino_magico`).
5. No te preocupes por quitar el fondo blanco: yo lo quito.

**Tamaños:** personajes y objetos, cuadrados (1024 × 1024 o más). Escenas, horizontales (16:9).

### Estilo base: pégalo al inicio de CADA instrucción
> Ilustración 2D estilo caricatura plana para un videojuego infantil (niños de 8 a 12 años). Contornos oscuros gruesos, colores vivos y planos, sombreado mínimo, formas simples y fáciles de reconocer a simple vista. Sin texto, sin letras, sin marcas de agua. Fondo blanco liso, sin sombra en el suelo. Personaje centrado, de cuerpo entero, ocupando el 80 % de la imagen. Formato cuadrado.

**Importante para el juego:** el objetivo y los distractores deben distinguirse **por color y forma generales**, no por detalles pequeños. Si una imagen sale muy cargada de detalles, pide: *"más simple, menos detalles"*.

---

## 1. Superhéroes → carpeta `assets/superheroes/`

### Hoja de personajes
> [Estilo base] Hoja de 5 personajes, todos con la misma pose (de frente, de pie, alegres), mismo tamaño y bien separados:
> 1) **"Héroe Rayo"**: niño superhéroe valiente y amable, capa roja, traje azul, antifaz morado, y en el pecho un rombo morado con un rayo amarillo.
> 2) **"Sombra"**: villano travieso y gracioso (NO aterrador), capa negra, traje morado oscuro, antifaz negro, sonrisa pícara, y en el pecho un rombo morado con un rayo amarillo.
> 3) **"Capitán Estrella"**: heroína con traje azul brillante, capa blanca y una estrella blanca en el pecho.
> 4) **"Escudo Verde"**: héroe con traje verde, capa amarilla y un escudo verde en el brazo.
> 5) **"Héroe Noche"**: héroe amigo con traje morado oscuro parecido al de Sombra, pero con capa blanca, sonriente y con una luna amarilla en el pecho.

| Archivo | Qué es | Instrucción individual |
|---|---|---|
| `heroes_hero.png` | Héroe Rayo (escenas de historia) | Personaje 1, de frente, saludando con entusiasmo |
| `heroes_hero_run.png` | Héroe Rayo en la Carrera | Personaje 1 **corriendo de perfil, mirando hacia la derecha** |
| `heroes_villain.png` | **Sombra: el objetivo del jefe final** | Personaje 2, de frente |
| `heroes_villain_caught.png` | Sombra atrapado | Personaje 2 atrapado dentro de una red, con cara de sorpresa graciosa |
| `heroes_friend1.png` | Distractor: Capitán Estrella | Personaje 3 |
| `heroes_friend2.png` | Distractor: Escudo Verde | Personaje 4 |
| `heroes_friend3.png` | Distractor difícil: Héroe Noche | Personaje 5 |
| `heroes_net.png` | Red para atrapar (reemplaza la canasta en el jefe) | [Estilo base] Una red de superhéroe con mango, vista de frente, abierta hacia arriba |
| `heroes_end.png` | Escena final | [Estilo base, pero formato horizontal 16:9 y CON fondo de ciudad de noche] Héroe Rayo celebrando junto a Sombra atrapado en una red, con la ciudad iluminada detrás |

### Señales (capítulos 1 a 4), opcional
Si quieres que también las señales se vean mejor:
> [Estilo base, sin personajes] Hoja de 4 insignias de superhéroe, todas del mismo tamaño, planas y de frente: 1) rombo morado con un rayo amarillo; 2) círculo azul con una estrella blanca; 3) escudo verde con una flecha blanca; 4) rombo morado con una estrella blanca.

Archivos: `heroes_signal_target.png`, `heroes_signal_1.png`, `heroes_signal_2.png`, `heroes_signal_3.png` (en el mismo orden).

---

## 2. Dragones y fantasía → carpeta `assets/dragones/`

**Nueva historia (sin huevos):** el hermanito de Chispa es un **dragón bebé dorado** que se perdió entre dragones bebé de otras familias. La hechicera traviesa **Morgana** lo escondió, y en el jefe final hay que atraparla.

### Hoja de dragones bebé (objetivo y distractores)
> [Estilo base] Hoja de 4 dragones bebé **idénticos en forma, pose y tamaño** (de frente, sentados, alas pequeñas abiertas, cara tierna). **Solo cambia el color:**
> 1) dorado brillante con manchas naranjas;
> 2) rojo;
> 3) azul;
> 4) amarillo pálido sin manchas.

| Archivo | Qué es |
|---|---|
| `fantasy_target.png` | Dragón bebé dorado (**objetivo**) |
| `fantasy_dist1.png` | Dragón bebé rojo |
| `fantasy_dist2.png` | Dragón bebé azul |
| `fantasy_dist3.png` | Dragón bebé amarillo pálido (distractor difícil) |

### Hoja de personajes de la historia
> [Estilo base] Hoja de 2 personajes bien separados:
> 1) **"Chispa"**: dragona joven, verde, amable y entusiasta, con barriga amarilla y cuernitos color crema;
> 2) **"Morgana"**: hechicera traviesa y graciosa (NO aterradora), sombrero puntiagudo morado, capa morada con estrellas, varita con punta verde, sonrisa pícara.

| Archivo | Qué es | Instrucción individual |
|---|---|---|
| `fantasy_hero.png` | Chispa (escenas) | Personaje 1, de frente, saludando |
| `fantasy_hero_run.png` | Chispa en la Carrera | Personaje 1 **volando de perfil, mirando hacia la derecha** |
| `fantasy_villain.png` | **Morgana: objetivo del jefe final** | Personaje 2, de frente |
| `fantasy_villain_caught.png` | Morgana atrapada | Personaje 2 atrapada en una red, cara de sorpresa graciosa |
| `fantasy_friend1.png` | Distractor del jefe: hada del bosque | [Estilo base] Hada pequeña y verde con alas transparentes, alegre |
| `fantasy_friend2.png` | Distractor del jefe: mago amable | [Estilo base] Mago abuelo amable, túnica azul y barba blanca |
| `fantasy_end.png` | Escena final | [Estilo base, formato horizontal 16:9 CON fondo de bosque mágico] Chispa abrazando a su hermanito dragón bebé dorado, y Morgana atrapada en una red al costado |

---

## 3. Reino mágico → carpeta `assets/reino_magico/`

**Nueva historia (con personajes):** un hechizo dispersó a las hadas del castillo. Hay que encontrar a **Lumi, el hada rosada** que cuida la corona de la Reina Luna. El hechizo lo lanzó el **Duende Pícaro**, y en el jefe final hay que atraparlo.

### Hoja de hadas (objetivo y distractores)
> [Estilo base] Hoja de 4 hadas pequeñas **idénticas en forma, pose, peinado y tamaño** (de frente, volando, alas abiertas, sonrientes). **Solo cambia el color del vestido, las alas y el pelo:**
> 1) rosado intenso (vestido y alas rosadas, pelo rosado);
> 2) azul;
> 3) verde;
> 4) lila pálido (parecido al rosado, pero más apagado).

| Archivo | Qué es |
|---|---|
| `kingdom_target.png` | Lumi, el hada rosada (**objetivo**) |
| `kingdom_dist1.png` | Hada azul |
| `kingdom_dist2.png` | Hada verde |
| `kingdom_dist3.png` | Hada lila pálido (distractor difícil) |

### Hoja de personajes de la historia
> [Estilo base] Hoja de 4 personajes bien separados:
> 1) **"Reina Luna"**: reina joven y cariñosa, vestido rosado, corona dorada con una joya rosada, pelo castaño largo;
> 2) **"Duende Pícaro"**: duende travieso y gracioso (NO aterrador), pequeño, orejas puntiagudas, gorro verde oscuro, chaleco morado, sonrisa pícara;
> 3) **"Guardia del castillo"**: soldado amable con armadura plateada y casco con pluma azul;
> 4) **"Bufón del rey"**: bufón alegre con traje de rombos amarillo y rojo, y gorro con cascabeles.

| Archivo | Qué es | Instrucción individual |
|---|---|---|
| `kingdom_hero.png` | Reina Luna (escenas) | Personaje 1, de frente, saludando |
| `kingdom_hero_run.png` | Reina Luna en la Carrera | Personaje 1 **corriendo de perfil, mirando hacia la derecha**, sosteniendo su vestido |
| `kingdom_villain.png` | **Duende Pícaro: objetivo del jefe final** | Personaje 2, de frente |
| `kingdom_villain_caught.png` | Duende atrapado | Personaje 2 atrapado en una red, cara de sorpresa graciosa |
| `kingdom_friend1.png` | Distractor del jefe: guardia | Personaje 3 |
| `kingdom_friend2.png` | Distractor del jefe: bufón | Personaje 4 |
| `kingdom_end.png` | Escena final | [Estilo base, formato horizontal 16:9 CON fondo de salón del trono] La Reina Luna celebrando con Lumi en la mano, y el Duende Pícaro atrapado en una red al costado |

---

## 4. Fondos de cada capítulo (opcional; el juego ya trae fondos provisionales)

**Reglas para todos los fondos** (pégalas al inicio, en lugar del estilo base):
> Fondo para un videojuego infantil, estilo caricatura 2D plano, colores suaves, formato horizontal 16:9 (1920 × 1080). **Sin personajes, sin texto.** La **zona central debe ser tranquila y despejada** (cielo, pared o suelo liso), con los detalles hacia los bordes y la parte de abajo.

**Por qué la zona central tranquila:** ahí aparecen los objetos que el niño debe encontrar. Si el centro tiene mucho detalle, el fondo compite con el objetivo y los errores ya no miden solo la atención. En el juego, el fondo se ve oscurecido en los niveles fáciles y más visible en los difíciles.

Guarda cada uno como `<mundo>_bg_<número>.png` (o `.jpg`) en la carpeta de su mundo.

| Archivo | Descripción |
|---|---|
| `heroes_bg_1` | Centro de una ciudad moderna **de día**, cielo azul y sol, edificios a los lados |
| `heroes_bg_2` | Barrio de casas y edificios bajos **al atardecer**, cielo naranja |
| `heroes_bg_3` | **Puerto** con muelles, barcos y mar, por la tarde |
| `heroes_bg_4` | Ciudad **de noche** con ventanas iluminadas, luna y una torre alta al costado |
| `heroes_bg_5` | Guarida del villano: edificio oscuro con luces moradas, **noche de tormenta** |
| `fantasy_bg_1` | Nido de dragones en lo alto de una colina, día soleado |
| `fantasy_bg_2` | Bosque mágico con árboles grandes |
| `fantasy_bg_3` | Río que cruza un valle verde |
| `fantasy_bg_4` | Cueva con cristales brillantes celestes |
| `fantasy_bg_5` | Volcán con lava, cielo rojo y anaranjado |
| `kingdom_bg_1` | Jardín del castillo con flores y setos, castillo rosado al fondo |
| `kingdom_bg_2` | **Cocina** del castillo: azulejos, ollas, ventana |
| `kingdom_bg_3` | **Biblioteca** del castillo: estanterías llenas de libros a los lados |
| `kingdom_bg_4` | Habitación de la **torre**: paredes de piedra y una ventana redonda con cielo nocturno |
| `kingdom_bg_5` | **Salón del trono**: alfombra roja, columnas y trono dorado al fondo |

---

## 5. Distractores del entorno (cosas que cruzan por los bordes)

No son para tocarlos: pasan por arriba o por abajo de la pantalla mientras el niño juega, para entrenar que siga concentrado. Por eso deben ser **llamativos pero claramente distintos del objetivo** (otra forma y otros colores).

Pide **una hoja por mundo** y después sepárala igual que los personajes:
> [Estilo base] Hoja de 3 elementos **de perfil, mirando hacia la derecha**, bien separados, sin que se corte ninguna parte, fondo blanco liso, sin texto: [los 3 de la tabla].

| Mundo | Elementos | Dónde aparecen |
|---|---|---|
| Superhéroes | 1) avión de pasajeros blanco; 2) pájaro negro volando con las alas abiertas; 3) gato negro caminando | avión y pájaro arriba; gato abajo |
| Dragones | 1) mariposa morada y rosada; 2) murciélago azul oscuro volando; 3) ardilla café caminando | mariposa y murciélago arriba; ardilla abajo |
| Reino mágico | 1) libro abierto volando; 2) escoba mágica volando sola; 3) ratón gris caminando | libro y escoba arriba; ratón abajo |

**Cuidado:** en Dragones, la mariposa **no** debe ser dorada ni amarilla, para que no se parezca al dragón dorado; en Reino mágico, nada rosado, para que no se confunda con Lumi.

Guárdalos en la carpeta del mundo con su nombre (`avion.png`, `gato.png`, `mariposa.png`…).

---

## Lista rápida de control

- [ ] Superhéroes: 9 imágenes (+4 señales opcionales)
- [ ] Dragones: 11 imágenes
- [ ] Reino mágico: 11 imágenes
- [ ] Fondos (opcional): 15 imágenes
- [ ] Distractores del entorno: 3 hojas (9 elementos)
- [ ] Todos los archivos en PNG con el nombre exacto
