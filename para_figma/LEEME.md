# Imágenes del juego para Figma

Todo lo que usa el juego, **un archivo por personaje, objeto y fondo**, para editarlos uno por uno en Figma.
Todas son imágenes de Gemini.

## Cómo llevarlos a Figma
1. Abre el archivo de Figma **Juego CPT TDAH**.
2. Arrastra una carpeta (por ejemplo `dragones/objetos`) o varios archivos al lienzo de Figma.
3. Cada archivo queda como **una capa separada** con su nombre.

## Cómo están organizados
```
<mundo>/personajes/             protagonista, villano, villano atrapado y amigos (distractores del jefe final)
<mundo>/objetos/                lo que el niño busca (objetivo) y sus distractores
<mundo>/fondos/                 un fondo por capítulo (1 a 5)
<mundo>/distractores_entorno/   cosas del mundo que cruzan por los bordes (no se tocan; distraen)
comunes/                        canasta, red, efectos de los poderes e íconos
```
El nombre de cada archivo dice **qué es** y, entre paréntesis, **para qué se usa en el juego**.

## Si cambias algo en Figma
Exporta la capa desde Figma (**Export → PNG**), guárdala en la carpeta del mundo dentro de `assets/` y avísale a Claude para conectarla al juego.

> Esta carpeta se genera automáticamente a partir de `assets/manifest.js` con `herramientas/exportar_para_figma.js`,
> así que siempre coincide con lo que usa el juego.
