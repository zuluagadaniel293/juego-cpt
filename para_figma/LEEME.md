# Imágenes del juego para Figma

Todo lo que usa el juego, **un archivo por personaje, objeto y fondo**, para editarlos uno por uno en Figma.

## Cómo llevarlos a Figma
1. Abre el archivo de Figma **Juego CPT TDAH**.
2. Arrastra una carpeta (por ejemplo `dragones/objetos`) o varios archivos al lienzo de Figma.
3. Cada archivo queda como **una capa separada** con su nombre.
   - Los **`.svg`** se convierten en **formas editables** (puedes cambiar colores, trazos y puntos).
   - Los **`.png` / `.jpg`** quedan como **imágenes** (se pueden recortar, mover y escalar; para cambiar el dibujo hay que regenerarlo o retocarlo).

## Cómo están organizados
```
<mundo>/personajes/   protagonista, villano y amigos (distractores del jefe final)
<mundo>/objetos/      lo que el niño busca (objetivo) y los distractores de los capítulos 1-4
<mundo>/fondos/       un fondo por capítulo (1 a 5)
comunes/              canasta, red, efectos de los poderes e íconos
```
El nombre de cada archivo dice **qué es** y, entre paréntesis, **para qué se usa en el juego**.

**`_provisional`** = dibujo temporal hecho por código, todavía sin imagen de Gemini. Son los que faltan reemplazar.

## Si cambias algo en Figma
Exporta la capa desde Figma (**Export → PNG**), guárdala en la carpeta del mundo dentro de `assets/` y avísale a Claude para conectarla al juego.

> Esta carpeta se genera automáticamente a partir del juego con `herramientas/exportar_para_figma.js`.
> Si se cambia algo del juego, se vuelve a generar para que siempre coincida.
