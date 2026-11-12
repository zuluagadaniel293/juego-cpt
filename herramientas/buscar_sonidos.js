// Busca sonidos con licencia libre (CC0: se usan sin dar créditos) en Freesound y descarga las mejores opciones
// para escucharlas en herramientas/probar_sonidos.html. La clave va en herramientas/.freesound_key (no se sube a GitHub).
// Uso:  node herramientas/buscar_sonidos.js <nombre> "<búsqueda en inglés>" [cuántas=3] [duración máx en s=4]
//   ej: node herramientas/buscar_sonidos.js gato "cat meow" 3
// Deja los MP3 en herramientas/sonidos_candidatos/<nombre>_<n>.mp3 y su ficha en candidatos.json.
const fs = require('fs');
const path = require('path');

const [nombre, busqueda, cuantas = '3', maxDur = '4'] = process.argv.slice(2);
if (!nombre || !busqueda) { console.log('Uso: node herramientas/buscar_sonidos.js <nombre> "<búsqueda>" [cuántas] [duración máx]'); process.exit(1); }
const key = fs.readFileSync(path.join(__dirname, '.freesound_key'), 'utf8').trim();
const dir = path.join(__dirname, 'sonidos_candidatos');
fs.mkdirSync(dir, { recursive: true });

(async () => {
  const q = new URLSearchParams({
    query: busqueda,
    filter: 'license:"Creative Commons 0" duration:[0.3 TO ' + maxDur + ']',
    fields: 'id,name,username,duration,license,previews,avg_rating,num_ratings,num_downloads',
    sort: 'score', page_size: '20'   // los que más se parecen a la búsqueda
  });
  const r = await fetch('https://freesound.org/apiv2/search/text/?' + q, { headers: { Authorization: 'Token ' + key } });
  if (!r.ok) { console.error('Freesound respondió', r.status, (await r.text()).slice(0, 200)); process.exit(1); }
  const res = (await r.json()).results || [];
  // entre los que más se parecen, primero los bien calificados; luego el resto, en el orden de Freesound
  const best = res.filter(s => s.num_ratings >= 2 && s.avg_rating >= 3.5).concat(res)
    .filter((s, i, all) => all.findIndex(o => o.id === s.id) === i).slice(0, +cuantas);
  const fichaPath = path.join(dir, 'candidatos.json');
  const fichas = fs.existsSync(fichaPath) ? JSON.parse(fs.readFileSync(fichaPath, 'utf8')) : {};
  fichas[nombre] = [];
  for (const [i, s] of best.entries()) {
    const mp3 = await fetch(s.previews['preview-hq-mp3']);
    const file = nombre + '_' + (i + 1) + '.mp3';
    fs.writeFileSync(path.join(dir, file), Buffer.from(await mp3.arrayBuffer()));
    fichas[nombre].push({ file, id: s.id, name: s.name, autor: s.username, duracion: +s.duration.toFixed(2), licencia: s.license,
      url: 'https://freesound.org/s/' + s.id + '/', calificacion: +(s.avg_rating || 0).toFixed(1), descargas: s.num_downloads });
    console.log(file, '·', s.name, '·', s.duration.toFixed(1) + ' s', '·', (s.avg_rating || 0).toFixed(1) + '★', '·', s.num_downloads, 'descargas');
  }
  fs.writeFileSync(fichaPath, JSON.stringify(fichas, null, 2) + '\n');
})();
