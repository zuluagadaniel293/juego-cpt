// Historial de partidas de cada jugador, para el Panel del profesional (juego/panel/panel.js).
// Cada partida terminada (capítulo de la Historia, nivel del Desafío, Prueba fija o Memoria) se guarda sola,
// con sus medidas y todas sus filas (las mismas del CSV), así el adulto no depende de descargar nada en el momento.

// Las filas se guardan "empacadas" (nombres de columna una sola vez) para que quepan muchas partidas
function packLog(log) {
  const cols = [];
  log.forEach(r => Object.keys(r).forEach(k => { if (!cols.includes(k)) cols.push(k); }));
  return { cols, rows: log.map(r => cols.map(c => (r[c] === undefined ? null : r[c]))) };
}
function unpackLog(p) {
  if (!p) return [];
  return p.rows.map(a => { const r = {}; p.cols.forEach((c, i) => { if (a[i] !== null) r[c] = a[i]; }); return r; });
}

// info: { mode, theme, chapter (0-4), level, minigame, boss, stars, log, memory: { fwd, bwd } }
function recordSession(info) {
  if (!currentPlayerId()) return;
  const log = info.log || [];
  const s = levelStats(log);
  const num = v => (typeof v === 'number' && isFinite(v) ? Math.round(v * 1000) / 1000 : null);
  const ses = {
    t: Date.now(), mode: info.mode, theme: info.theme,
    chapter: info.chapter === undefined || info.chapter === null ? null : info.chapter,
    level: info.level || null, minigame: info.minigame || null, boss: !!info.boss, stars: info.stars,
    memory: info.memory || null,
    stats: { trials: s.trials, targets: s.targets, hits: s.hits, omissions: s.omissions, distractors: s.distractors,
      commissions: s.commissions, hitRate: num(s.hitRate), meanRT: num(s.meanRT), sdRT: num(s.sdRT) },
    log: packLog(log)
  };
  const list = store.get('cpt_sessions', []);
  list.push(ses);
  // si ya no cabe en el navegador, se sueltan las filas de las partidas más viejas (sus medidas se quedan)
  while (!store.set('cpt_sessions', list)) {
    const i = list.findIndex(x => x.log);
    if (i < 0 || i === list.length - 1) break;
    list[i].log = null;
  }
}
const playerSessions = id => rawStore.get(playerKey(id, 'cpt_sessions'), []);
