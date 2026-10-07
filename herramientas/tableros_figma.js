// Arma un tablero SVG por mundo (Personajes, Objetos, Distractores del entorno, Fondos) a partir de para_figma/.
// Cada elemento es un grupo con nombre: al subir el SVG a Figma queda como capa propia (imágenes incrustadas).
// Uso: node herramientas/tableros_figma.js <carpeta_de_salida>
const fs = require('fs');
const path = require('path');
const PF = 'C:/Users/Daniel Zuluaga/OneDrive/juego-cpt/para_figma/';
const OUT = process.argv[2];

function dims(file) {
  const b = fs.readFileSync(file);
  if (file.endsWith('.png')) return [b.readUInt32BE(16), b.readUInt32BE(20)];
  if (file.endsWith('.svg')) { const m = b.toString().match(/viewBox="0 0 (\d+) (\d+)"/); return [+m[1], +m[2]]; }
  let i = 2;                                   // JPG: buscar el marcador SOF
  while (i < b.length) { const m = b[i + 1], len = b.readUInt16BE(i + 2); if (m >= 0xC0 && m <= 0xC2) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)]; i += 2 + len; }
}
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const label = f => path.basename(f).replace(/\.(png|jpg|svg)$/, '');

// Un elemento: imagen incrustada (o SVG editable) + su nombre debajo
function item(file, x, y, h, maxW) {
  const [w0, h0] = dims(file);
  let s = h / h0, w = w0 * s;
  if (maxW && w > maxW) { s = maxW / w0; w = maxW; }
  const hh = h0 * s, name = label(file);
  // nombre en dos líneas: "heroe_rayo" / "(protagonista)"; el ancho del elemento es el mayor entre dibujo y texto
  const [l1, l2] = name.includes(' (') ? [name.split(' (')[0], '(' + name.split(' (').slice(1).join(' (')] : [name, ''];
  const cell = Math.max(w, l1.length * 8, l2.length * 7);
  const ax = x + (cell - w) / 2;
  let art;
  if (file.endsWith('.svg')) {
    const inner = fs.readFileSync(file, 'utf8').replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
    art = `<g transform="translate(${ax},${y + (h - hh)}) scale(${s})">${inner}</g>`;
  } else {
    const mime = file.endsWith('.png') ? 'image/png' : 'image/jpeg';
    art = `<image x="${ax}" y="${y + (h - hh)}" width="${w.toFixed(1)}" height="${hh.toFixed(1)}" href="data:${mime};base64,${fs.readFileSync(file).toString('base64')}"/>`;
  }
  const t = (txt, dy, size, bold, col) => `<text x="${x + cell / 2}" y="${y + h + dy}" font-family="Arial" font-size="${size}"${bold ? ' font-weight="bold"' : ''} fill="${col}" text-anchor="middle">${esc(txt)}</text>`;
  const text = t(l1, 22, 14, true, '#ffffff') + (l2 ? t(l2, 40, 12, false, '#cbd5e1') : '');
  return { svg: `<g id="${esc(name)}">${art}${text}</g>`, w: cell };
}

// Un cuadro (frame) con título y sus elementos en fila
function box(title, files, x, y, h, color, maxW) {
  let cx = x + 24, parts = [];
  for (const f of files) { const it = item(f, cx, y + 56, h, maxW); parts.push(it.svg); cx += it.w + 32; }
  const W = Math.max(cx - x - 8, 300), H = h + 125;
  return { W, H, svg: `<g id="${esc(title)}"><rect x="${x}" y="${y}" width="${W}" height="${H}" rx="18" fill="#ffffff" fill-opacity="0.06" stroke="${color}" stroke-width="3"/>` +
    `<text x="${x + 24}" y="${y + 36}" font-family="Arial" font-size="22" font-weight="bold" fill="${color}">${esc(title)}</text>${parts.join('')}</g>` };
}

function board(name, dir, bg, color, sections) {
  const list = sub => fs.existsSync(PF + dir + '/' + sub) ? fs.readdirSync(PF + dir + '/' + sub).sort().map(f => PF + dir + '/' + sub + '/' + f) : [];
  let y = 110, W = 0, parts = [];
  for (const [title, sub, h, maxW, order] of sections) {
    let files = list(sub);
    if (order) files.sort((a, b) => order(a) - order(b));
    if (!files.length) continue;
    const bx = box(title, files, 40, y, h, color, maxW);
    parts.push(bx.svg); y += bx.H + 40; W = Math.max(W, bx.W + 80);
  }
  const H = y;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    `<rect id="fondo_tablero" width="${W}" height="${H}" rx="24" fill="${bg}"/>` +
    `<text x="40" y="70" font-family="Arial" font-size="40" font-weight="bold" fill="${color}">${esc(name)}</text>${parts.join('')}</svg>`;
  const file = path.join(OUT, 'tablero_' + dir + '.svg');
  fs.writeFileSync(file, svg);
  console.log(file, W + 'x' + H, (fs.statSync(file).size / 1e6).toFixed(2) + ' MB');
}

// el objetivo primero, luego distractores, luego el difícil
const rank = f => /\(objetivo\)/.test(f) ? 0 : /dificil/.test(f) ? 2 : 1;
const roleRank = f => /protagonista/.test(f) ? 0 : /villan/.test(f) ? 1 : /dificil/.test(f) ? 3 : 2;
const W = [
  ['Personajes', 'personajes', 230, 0, roleRank],
  ['Objetos (lo que el niño busca y sus distractores)', 'objetos', 150, 0, rank],
  ['Distractores del entorno (cruzan por los bordes)', 'distractores_entorno', 120, 260],
  ['Fondos de los capítulos', 'fondos', 200, 0]
];
board('Superhéroes', 'superheroes', '#0f2a4a', '#fde047', W);
board('Dragones y fantasía', 'dragones', '#1f3a2a', '#facc15', W);
board('Reino mágico', 'reino_magico', '#4a1d4a', '#f472b6', W);
board('Comunes (todos los mundos)', 'comunes', '#1e293b', '#cbd5e1', [['Canasta, red, efectos e íconos', '', 120, 0]]);
