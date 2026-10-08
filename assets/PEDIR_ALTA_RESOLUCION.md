# Pedir a Gemini las imágenes en alta resolución y con fondo transparente

Las imágenes que salieron de hojas se ven algo pixeladas, porque cada personaje ocupaba un pedazo pequeño de la hoja
y el recorte del fondo blanco deja bordes dentados. La Reina Luna, pedida sola y con fondo transparente, quedó perfecta.
Hagamos lo mismo con las demás.

## Cómo pedir cada una
1. **Adjunta la imagen actual** del personaje u objeto (está en `para_figma/`, por ejemplo `para_figma/superheroes/personajes/sombra (villano - jefe final).png`).
2. Escribe:
> Genera exactamente este mismo personaje (mismo diseño, colores, ropa y pose), solo, de cuerpo entero, centrado y completo, sin que se corte ninguna parte. **Fondo transparente (PNG)**. Sin texto. Máxima resolución posible.
3. Descárgala en **PNG** y guárdala en la carpeta del mundo con **el mismo nombre de archivo** de la tabla (así reemplaza a la anterior sola).
4. Si Gemini no puede dejar el fondo transparente, que sea **blanco liso**: igual queda mucho mejor que recortada de una hoja.

## Prioridad 1 · Los que aparecen grandes en las escenas de historia
| Archivo | Carpeta |
|---|---|
| `heroe_rayo.png` | `assets/superheroes/` |
| `sombra.png` | `assets/superheroes/` |
| `sombra_atrapado.png` | `assets/superheroes/` |
| `chispa_la_dragona.png` | `assets/dragones/` |
| `morgana_la_hechicera.png` | `assets/dragones/` |
| `morgana_atrapada.png` | `assets/dragones/` |
| `duende_picaro.png` | `assets/reino_magico/` |
| `duende_atrapado.png` | `assets/reino_magico/` |

## Prioridad 2 · Lo que el niño busca (aparece en el centro de la pantalla)
Para los grupos de 4, pide **la hoja completa otra vez** adjuntando la actual, con "máxima resolución y fondo transparente", para que sigan siendo idénticos entre sí (si se piden por separado pueden cambiar de forma).

| Archivos | Carpeta |
|---|---|
| `senal_de_sombra.png`, `senal_capitan_estrella.png`, `senal_escudo_verde.png`, `senal_heroe_noche.png` | `assets/superheroes/` |
| `dragon_bebe_dorado.png`, `dragon_bebe_rojo.png`, `dragon_bebe_azul.png`, `dragon_bebe_amarillo_palido.png` | `assets/dragones/` |
| `hada_rosada_lumi.png`, `hada_azul.png`, `hada_verde.png`, `hada_lila.png` | `assets/reino_magico/` |

## Prioridad 3 · Amigos del jefe final
| Archivo | Carpeta |
|---|---|
| `capitan_estrella.png`, `escudo_verde.png`, `heroe_noche.png` | `assets/superheroes/` |
| `hada_del_bosque.png`, `mago_abuelo.png`, `hechicera_buena.png` | `assets/dragones/` |
| `guardia.png`, `bufon.png`, `duende_amable.png` | `assets/reino_magico/` |

## Prioridad 4 · Distractores del entorno y objetos comunes (se ven pequeños; menos urgente)
| Archivos | Carpeta |
|---|---|
| `avion.png`, `pajaro.png`, `gato.png` | `assets/superheroes/` |
| `mariposa.png`, `murcielago.png`, `ardilla.png` | `assets/dragones/` |
| `libro_volador.png`, `escoba_magica.png`, `raton.png` | `assets/reino_magico/` |
| `canasta.png`, `red.png`, `bola_de_fuego.png`, `estrella_magica.png`, `corazon.png`, `chispa.png`, `icono_mapa.png`, `icono_trofeo.png`, `icono_candado.png`, `icono_lupa.png` | `assets/comunes/` |

Cuando las guardes, avísale a Claude: las recorta, revisa que no tengan restos, las ajusta de tamaño y actualiza el juego y Figma.
