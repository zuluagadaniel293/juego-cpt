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

// ---------- Filas de cada partida en IndexedDB ----------
// El resumen de cada partida (medidas, estrellas, fecha) va en localStorage, que es pequeño (unos 5 MB para todo).
// Las filas, que son lo que pesa, van en IndexedDB, que tiene cientos de MB: caben miles de partidas.
// Si IndexedDB no está disponible (algunos modos privados), las filas se quedan en el resumen como antes.
let logsDbPromise = null;
function logsDb() {
  if (!logsDbPromise) logsDbPromise = new Promise((res, rej) => {
    if (!window.indexedDB) return rej(new Error('sin IndexedDB'));
    const r = indexedDB.open('mision_foco', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('logs');
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
  return logsDbPromise;
}
function logsTx(mode, fn) {
  return logsDb().then(db => new Promise((res, rej) => {
    const tx = db.transaction('logs', mode), req = fn(tx.objectStore('logs'));
    tx.oncomplete = () => res(req ? req.result : undefined);
    tx.onerror = tx.onabort = () => rej(tx.error);
  }));
}
const logKeyFor = (pid, t) => 'p' + pid + '_' + t;
const deletePlayerLogs = pid => logsTx('readwrite', st => st.delete(IDBKeyRange.bound('p' + pid + '_', 'p' + pid + '_￿'))).catch(() => {});
// Filas (empacadas) de una partida, estén donde estén
function sessionLog(ses) {
  if (ses.log) return Promise.resolve(ses.log);
  if (!ses.logKey) return Promise.resolve(null);
  return logsTx('readonly', st => st.get(ses.logKey)).then(v => v || null, () => null);
}
// Para el panel: pone las filas en cada partida de la lista (en memoria, no se vuelven a guardar)
function attachLogs(sessions) {
  return Promise.all(sessions.map(s => sessionLog(s).then(l => { s.log = l; })));
}
// Pasa a IndexedDB las filas que todavía estén en localStorage (partidas de antes de este cambio, o si falló)
function moveLogsToDb() {
  getPlayers().forEach(p => {
    const key = playerKey(p.id, 'cpt_sessions'), list = rawStore.get(key, []);
    const todo = list.filter(s => s.log && !s.logKey);
    if (!todo.length) return;
    logsTx('readwrite', st => { todo.forEach(s => st.put(s.log, logKeyFor(p.id, s.t))); }).then(() => {
      const now = rawStore.get(key, []);
      now.forEach(s => { if (s.log && !s.logKey && todo.some(x => x.t === s.t)) { s.logKey = logKeyFor(p.id, s.t); delete s.log; } });
      rawStore.set(key, now);
    }).catch(() => {});
  });
}

// info: { mode, theme, chapter (0-4), level, minigame, boss, stars, log, memory: { fwd, bwd } }
function recordSession(info) {
  const pid = currentPlayerId();
  if (!pid) return;
  const log = info.log || [];
  const s = levelStats(log);
  const num = v => (typeof v === 'number' && isFinite(v) ? Math.round(v * 1000) / 1000 : null);
  const t = Date.now(), packed = packLog(log);
  const ses = {
    t, mode: info.mode, theme: info.theme,
    chapter: info.chapter === undefined || info.chapter === null ? null : info.chapter,
    level: info.level || null, minigame: info.minigame || null, boss: !!info.boss, stars: info.stars,
    memory: info.memory || null,
    stats: { trials: s.trials, targets: s.targets, hits: s.hits, omissions: s.omissions, distractors: s.distractors,
      commissions: s.commissions, hitRate: num(s.hitRate), meanRT: num(s.meanRT), sdRT: num(s.sdRT) },
    log: packed
  };
  const key = playerKey(pid, 'cpt_sessions');
  const list = rawStore.get(key, []);
  list.push(ses);
  // si no cupiera ni el resumen, se sueltan las filas de las partidas más viejas que aún estén aquí
  while (!rawStore.set(key, list)) {
    const i = list.findIndex(x => x.log);
    if (i < 0 || i === list.length - 1) break;
    list[i].log = null;
  }
  // las filas se van a IndexedDB; cuando quedan guardadas allá, se quitan de aquí
  logsTx('readwrite', st => { st.put(packed, logKeyFor(pid, t)); }).then(() => {
    const now = rawStore.get(key, []), x = now.find(z => z.t === t);
    if (x) { x.logKey = logKeyFor(pid, t); delete x.log; rawStore.set(key, now); }
  }).catch(() => {});
}
const playerSessions = id => rawStore.get(playerKey(id, 'cpt_sessions'), []);
// Que el navegador no borre los datos por su cuenta cuando le falte espacio (se pide desde el panel del adulto)
function askPersistentStorage() {
  try { if (navigator.storage && navigator.storage.persist) return navigator.storage.persist(); } catch (e) { /* nada */ }
  return Promise.resolve(false);
}

// Última partida guardada del jugador actual que cumpla la condición (para mostrarla antes de repetir)
function lastSession(match) {
  const list = store.get('cpt_sessions', []).filter(match);
  return list[list.length - 1] || null;
}

// Antes de repetir un capítulo o un juego del Desafío: el resultado de la vez anterior, con su CSV
// (guardado en este navegador) y el botón para jugar. Si nunca lo ha jugado, empieza de una.
function showLastResult(scene, ses, csvName, onPlay) {
  if (!ses) return onPlay();
  const W = GAME_W, H = GAME_H, D = 1000, objs = [];
  const add = o => { objs.push(o.setDepth(D + objs.length)); return o; };
  const close = () => objs.forEach(o => o.destroy());
  add(scene.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.65).setInteractive());   // tapa lo de atrás
  const card = scene.add.graphics();
  card.fillStyle(0x1e293b, 1).fillRoundedRect(W / 2 - 300, H / 2 - 200, 600, 400, 26);
  card.lineStyle(4, 0xfde047, 1).strokeRoundedRect(W / 2 - 300, H / 2 - 200, 600, 400, 26);
  add(card);
  const d = new Date(ses.t);
  const when = d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long' }) + ', ' +
    d.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' });
  add(scene.add.text(W / 2, H / 2 - 160, 'Tu resultado anterior', { font: 'bold 32px Arial', color: '#fde047' }).setOrigin(0.5));
  add(scene.add.text(W / 2, H / 2 - 122, when + (ses.level ? '  ·  nivel ' + ses.level : ''), { font: '17px Arial', color: '#cbd5e1' }).setOrigin(0.5));
  add(scene.add.text(W / 2, H / 2 - 70, starsText(ses.stars || 0), { font: '48px Arial', color: '#fde047' }).setOrigin(0.5));
  const s = ses.stats;
  const hasLog = !!(ses.log || ses.logKey);
  let lines = '';
  if (ses.memory) lines = 'Recordaste hasta ' + (ses.memory.fwd || 0) + (ses.memory.bwd ? ' (al revés: ' + ses.memory.bwd + ')' : '');
  else if (s) lines = ((MG[ses.minigame] && !ses.boss && MG[ses.minigame].verb) || 'Acertaste') + ' ' + s.hits + ' de ' + s.targets;
  if (s && !ses.memory) lines += (lines ? '\n' : '') + 'Te equivocaste ' + s.commissions + (s.commissions === 1 ? ' vez' : ' veces');
  add(scene.add.text(W / 2, H / 2 + 5, lines, { font: '24px Arial', color: '#f1f5f9', align: 'center', lineSpacing: 8 }).setOrigin(0.5));
  const btn = (x, y, w, label, color, cb) => {
    const r = add(scene.add.rectangle(x, y, w, 58, color).setInteractive({ useHandCursor: true }));
    add(scene.add.text(x, y, label, { font: 'bold 22px Arial', color: '#0f172a' }).setOrigin(0.5));
    r.on('pointerover', () => r.setAlpha(0.85)); r.on('pointerout', () => r.setAlpha(1));
    r.on('pointerdown', cb);
  };
  if (hasLog) {
    btn(W / 2 - 140, H / 2 + 120, 250, 'Descargar CSV', 0xcbd5e1,
      () => sessionLog(ses).then(l => { if (l) downloadCSV(unpackLog(l), csvName); }));
    btn(W / 2 + 140, H / 2 + 120, 250, '¡Jugar otra vez!', 0xfde047, () => { close(); onPlay(); });
  } else {
    btn(W / 2, H / 2 + 120, 300, '¡Jugar otra vez!', 0xfde047, () => { close(); onPlay(); });
  }
  const x = add(scene.add.text(W / 2 + 270, H / 2 - 172, '✕', { font: 'bold 30px Arial', color: '#ffffff' }).setOrigin(0.5)
    .setInteractive({ useHandCursor: true }));
  x.on('pointerdown', close);
}
