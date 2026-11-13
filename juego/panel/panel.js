// Panel del profesional (Zona de adultos): resultados de cada niño por mundo, capítulo y nivel, un informe al
// terminar cada historia y las descargas (CSV de todas las partidas y resumen). Es una página HTML encima del
// juego, para poder leerla con calma, desplazarla e imprimirla o guardarla como PDF.
//
// Misión Foco es entrenamiento y familiarización con las pruebas de atención: las medidas usan los mismos
// nombres que un CPT para que el profesional las reconozca, pero NO se comparan con normas ni dan un diagnóstico.

const PANEL_NOTE = 'Misión Foco es un juego de entrenamiento y familiarización con las pruebas de atención. ' +
  'Las medidas usan los mismos nombres que un CPT para que sean fáciles de leer, pero no se comparan con normas ' +
  'ni reemplazan una evaluación estandarizada: describen cómo jugó este niño y cómo cambia con la práctica.';
const MODE_LABEL = { historia: 'Historia', desafio: 'Desafío', prueba: 'Prueba fija', memoria: 'Prueba fija · Memoria' };

// ---------- utilidades ----------
const esc = s => String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pctTxt = (a, b) => (b ? Math.round(a / b * 100) + ' %' : '—');
const msTxt = v => (typeof v === 'number' && isFinite(v) ? Math.round(v) + ' ms' : '—');
const worldName = t => (THEMES[t] ? THEMES[t].label : t || '');
const gameName = mg => (MG[mg] ? MG[mg].label : mg || '');
const dateTxt = t => new Date(t).toLocaleString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const pad2 = n => String(n).padStart(2, '0');
const csvDay = t => { const d = new Date(t); return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); };
const csvHour = t => { const d = new Date(t); return pad2(d.getHours()) + ':' + pad2(d.getMinutes()); };
const plural = (n, one, many) => n + ' ' + (n === 1 ? one : many);
const starTxt = n => '★'.repeat(n || 0) + '☆'.repeat(Math.max(0, 3 - (n || 0)));
const mean = a => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
const sdOf = a => { if (a.length < 2) return NaN; const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1)); };
const sessionPlace = s => (s.mode === 'historia' ? (s.boss ? 'Jefe final (cap. 5)' : 'Capítulo ' + (s.chapter + 1))
  : s.mode === 'desafio' ? 'Nivel ' + s.level : '');
const sessionMinutes = s => {
  const log = unpackLog(s.log);
  // el jefe final tiene fases que empiezan en 0: se suma lo que duró cada una
  const byPhase = {};
  log.forEach(r => { const k = r.phase || 0; byPhase[k] = Math.max(byPhase[k] || 0, r.onset_ms || 0); });
  return Object.values(byPhase).reduce((a, b) => a + b, 0) / 60000;
};

// ---------- medidas tipo CPT de un grupo de partidas ----------
function panelMeasures(sessions) {
  const logs = sessions.map(s => unpackLog(s.log)).filter(l => l.length);
  const all = [].concat(...logs);
  const st = computeStats(all), mem = memoryStats(all);
  const stim = all.filter(r => r.event_type === 'stimulus');
  const responses = stim.filter(r => r.responded && r.rt_ms !== '' && r.rt_ms !== undefined);
  const anticipations = responses.filter(r => r.rt_ms < 100).length;
  const isError = r => r.outcome === 'omission' || r.outcome === 'commission' || r.outcome === 'wrong_tap';
  // primera y segunda mitad de cada partida (y de cada fase del jefe), y errores justo después de un distractor
  const half = { first: { t: 0, h: 0, rt: [] }, second: { t: 0, h: 0, rt: [] } };
  const near = { n: 0, e: 0 }, far = { n: 0, e: 0 };
  logs.forEach(log => {
    const phases = {};
    log.forEach(r => { (phases[r.phase || 0] = phases[r.phase || 0] || []).push(r); });
    Object.values(phases).forEach(rows => {
      const s = rows.filter(r => r.event_type === 'stimulus');
      const dist = rows.filter(r => r.event_type === 'audio_distractor' || r.event_type === 'visual_distractor').map(r => r.onset_ms);
      const mid = s.length ? Math.max(...s.map(r => r.onset_ms)) / 2 : 0;
      s.forEach(r => {
        const h = r.onset_ms <= mid ? half.first : half.second;
        if (r.stimulus_type === 'target') { h.t++; if (r.outcome === 'hit') { h.h++; if (r.rt_ms !== '') h.rt.push(r.rt_ms); } }
        const g = dist.some(d => r.onset_ms - d >= 0 && r.onset_ms - d <= 3000) ? near : far;
        g.n++; if (isError(r)) g.e++;
      });
    });
  });
  return { st, mem, stim: stim.length, anticipations, responses: responses.length, half, near, far,
    cv: st.sdRT / st.meanRT };
}

function reportHTML(sessions, title) {
  const m = panelMeasures(sessions), s = m.st;
  const items = [];
  if (m.stim) {
    items.push(['Detección (aciertos)', s.hits + ' de ' + s.targets + ' (' + pctTxt(s.hits, s.targets) + ')',
      'Objetivos a los que respondió bien.']);
    items.push(['Omisiones', s.omissions + ' (' + pctTxt(s.omissions, s.targets) + ' de los objetivos)',
      'Objetivos que dejó pasar. En un CPT se leen como momentos de desconexión (atención sostenida).']);
    items.push(['Comisiones', s.commissions + ' (' + pctTxt(s.commissions, s.distractors || s.trials) + ')',
      'Respuestas a lo que debía ignorar. En un CPT se leen como impulsividad (control inhibitorio).']);
    items.push(['Respuestas anticipadas', m.anticipations + ' de ' + m.responses + ' respuestas',
      'Respuestas en menos de 100 ms: demasiado rápidas para haber visto el estímulo (en el Conners, "perseveraciones").']);
    items.push(['Tiempo de reacción', msTxt(s.meanRT), 'Promedio de los aciertos.']);
    items.push(['Variabilidad del TR', msTxt(s.sdRT) + (isFinite(m.cv) ? ' (coef. de variación ' + m.cv.toFixed(2) + ')' : ''),
      'Qué tan parejo es su ritmo. En los CPT, una variabilidad alta se asocia a altibajos de la atención.']);
    const h1 = m.half.first, h2 = m.half.second;
    items.push(['Principio vs. final de cada partida', 'Aciertos ' + pctTxt(h1.h, h1.t) + ' → ' + pctTxt(h2.h, h2.t) +
      ' · TR ' + msTxt(mean(h1.rt)) + ' → ' + msTxt(mean(h2.rt)),
      'Si baja al final, puede indicar cansancio o pérdida de la atención con el tiempo.']);
    items.push(['Efecto de los distractores', 'Errores con un distractor en los 3 s anteriores: ' + pctTxt(m.near.e, m.near.n) +
      ' (' + m.near.n + ' estímulos) · sin distractor reciente: ' + pctTxt(m.far.e, m.far.n) + ' (' + m.far.n + ')',
      'Distractores = sonidos, voces de los personajes y cosas que cruzan la pantalla.']);
  }
  if (m.mem.trials) items.push(['Memoria (caminos)', m.mem.hits + ' de ' + m.mem.trials + ' caminos repetidos bien (' +
    pctTxt(m.mem.hits, m.mem.trials) + ')', 'Memoria de trabajo visoespacial (tipo Corsi).']);
  if (!items.length) return '';
  return '<div class="mf-card mf-report"><h3>' + esc(title) + '</h3>' +
    '<p class="mf-muted">' + plural(sessions.length, 'partida', 'partidas') + ' · unos ' + Math.round(sessions.reduce((a, x) => a + sessionMinutes(x), 0)) +
    ' minutos de juego</p><dl>' +
    items.map(([k, v, d]) => '<dt>' + esc(k) + '</dt><dd>' + esc(v) + '<small>' + esc(d) + '</small></dd>').join('') +
    '</dl></div>';
}

// fila de medidas de una partida
const statCells = s => {
  if (s.mode === 'memoria') return '<td colspan="6">Span adelante ' + esc(s.memory ? s.memory.fwd : '—') +
    ' · al revés ' + esc(s.memory ? s.memory.bwd : '—') + '</td>';
  const x = s.stats || {};
  return '<td class="num">' + pctTxt(x.hits, x.targets) + '</td><td class="num">' + esc(x.omissions) + '</td>' +
    '<td class="num">' + esc(x.commissions) + '</td><td class="num">' + msTxt(x.meanRT) + '</td><td class="num">' + msTxt(x.sdRT) + '</td>' +
    '<td>' + esc(starTxt(s.stars)) + '</td>';
};
const STAT_HEAD = '<th class="num">Aciertos</th><th class="num">Omisiones</th><th class="num">Comisiones</th>' +
  '<th class="num">TR medio</th><th class="num">Variab. TR</th><th>Estrellas</th>';

// ---------- gráfica sencilla: % de aciertos en cada partida ----------
function lineChart(points, label) {
  if (points.length < 2) return '';
  const W = 520, H = 160, L = 36, B = 22, T = 10, R = 10;
  const x = i => L + i * (W - L - R) / (points.length - 1), y = v => T + (1 - v) * (H - T - B);
  const path = points.map((p, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(p.v).toFixed(1)).join(' ');
  const grid = [0, 0.5, 1].map(v => '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="#e2e8f0"/>' +
    '<text x="' + (L - 6) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + v * 100 + '%</text>').join('');
  const dots = points.map((p, i) => '<circle cx="' + x(i) + '" cy="' + y(p.v) + '" r="4" fill="#7c3aed"><title>' +
    esc(p.label + ': ' + Math.round(p.v * 100) + ' %') + '</title></circle>').join('');
  const ticks = points.map((p, i) => '<text x="' + x(i) + '" y="' + (H - 6) + '" text-anchor="middle">' + (i + 1) + '</text>').join('');
  return '<figure class="mf-chart"><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(label) + '">' + grid +
    '<path d="' + path + '" fill="none" stroke="#7c3aed" stroke-width="2.5"/>' + dots + ticks + '</svg>' +
    '<figcaption class="mf-muted">' + esc(label) + ' (eje horizontal: número de partida)</figcaption></figure>';
}

// ---------- secciones ----------
// Todos los intentos de un grupo (cada vez que repitió), en orden, con su CSV. all = todas las partidas del jugador
function attemptsHTML(all, list, placeTxt) {
  if (!list.length) return '';
  const rows = list.map((s, k) => '<tr><td class="num">' + (k + 1) + '</td><td>' + esc(placeTxt(s)) + '</td><td>' + esc(dateTxt(s.t)) + '</td>' +
    statCells(s) + '<td class="mf-noprint">' + (s.log ? '<button data-csv="' + all.indexOf(s) + '">CSV</button>' : '<span class="mf-muted">sin filas</span>') +
    '</td></tr>').join('');
  return '<details class="mf-attempts"><summary>Ver cada intento (' + list.length + ')</summary><div class="mf-scroll"><table><thead><tr>' +
    '<th class="num">#</th><th>Dónde</th><th>Fecha</th>' + STAT_HEAD + '<th class="mf-noprint"></th></tr></thead><tbody>' + rows +
    '</tbody></table></div></details>';
}

function historiaHTML(id, sessions) {
  const story = rawStore.get(playerKey(id, 'cpt_story'), {});
  const worlds = Object.keys(THEMES).filter(t => sessions.some(s => s.mode === 'historia' && s.theme === t) || (story[t] || []).some(v => v));
  if (!worlds.length) return '<p class="mf-muted">Todavía no ha jugado la Historia.</p>';
  return worlds.map(t => {
    const ws = sessions.filter(s => s.mode === 'historia' && s.theme === t);
    const stars = story[t] || [0, 0, 0, 0, 0];
    const done = stars[4] >= PASS_STARS;
    const passed = stars.filter(v => v >= PASS_STARS).length;
    const rows = [0, 1, 2, 3, 4].map(ch => {
      const cs = ws.filter(s => s.chapter === ch);
      const last = cs[cs.length - 1];
      return '<tr><td>' + (ch === 4 ? 'Jefe final' : 'Capítulo ' + (ch + 1)) + '</td><td>' + esc(last ? (last.boss ? 'Jefe (varias fases)' : gameName(last.minigame)) : '') +
        '</td><td class="num">' + (cs.length || (stars[ch] ? '—' : 0)) + '</td><td>' + esc(starTxt(stars[ch])) + '</td>' +
        (last ? statCells(last).replace(/<td>[★☆]*<\/td>$/, '')
          : '<td colspan="5" class="mf-muted">' + (stars[ch] ? 'jugado antes de que se guardaran las partidas: sin medidas' : 'sin jugar') + '</td>') + '</tr>';
    }).join('');
    return '<h3>' + esc(worldName(t)) + ' · ' + (done ? '<span class="mf-done">Historia completada</span>' : passed + ' de 5 capítulos superados') + '</h3>' +
      '<div class="mf-scroll"><table><thead><tr><th>Capítulo</th><th>Juego</th><th class="num">Intentos</th><th>Mejor</th>' +
      '<th class="num">Aciertos</th><th class="num">Omisiones</th><th class="num">Comisiones</th><th class="num">TR medio</th><th class="num">Variab. TR</th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<p class="mf-muted">Medidas del último intento de cada capítulo.</p>' +
      attemptsHTML(sessions, ws.slice().sort((a, b) => a.chapter - b.chapter || a.t - b.t),
        s => (s.boss ? 'Jefe final' : 'Capítulo ' + (s.chapter + 1)) + (s.minigame && !s.boss ? ' · ' + gameName(s.minigame) : '')) +
      (done ? (ws.length ? reportHTML(ws, 'Informe de la historia: ' + worldName(t))
        : '<p class="mf-muted">El informe sale cuando haya partidas guardadas de este mundo (al volver a jugarlo).</p>') : '');
  }).join('');
}

function desafioHTML(sessions) {
  const ds = sessions.filter(s => s.mode === 'desafio');
  if (!ds.length) return '<p class="mf-muted">Todavía no ha jugado el Desafío.</p>';
  const groups = {};
  ds.forEach(s => { (groups[s.theme + '|' + s.minigame] = groups[s.theme + '|' + s.minigame] || []).push(s); });
  const rows = Object.values(groups).map(g => {
    const last = g[g.length - 1];
    const best = Math.max(0, ...g.filter(s => s.stars >= 2).map(s => s.level));
    return '<tr><td>' + esc(worldName(last.theme)) + '</td><td>' + esc(gameName(last.minigame)) + '</td><td class="num">' + g.length +
      '</td><td class="num">' + (best || '—') + '</td><td class="num">' + esc(last.level) + '</td>' + statCells(last) + '</tr>';
  }).join('');
  return '<div class="mf-scroll"><table><thead><tr><th>Mundo</th><th>Juego</th><th class="num">Partidas</th><th class="num">Nivel máx. superado</th>' +
    '<th class="num">Último nivel</th>' + STAT_HEAD + '</tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<p class="mf-muted">Medidas de la última partida de cada juego.</p>' +
    attemptsHTML(sessions, ds.slice().sort((a, b) => (a.theme + a.minigame).localeCompare(b.theme + b.minigame) || a.t - b.t),
      s => worldName(s.theme) + ' · ' + gameName(s.minigame) + ' · nivel ' + s.level) +
    reportHTML(ds, 'Resumen del Desafío');
}

function pruebaHTML(sessions) {
  const ps = sessions.filter(s => s.mode === 'prueba' || s.mode === 'memoria');
  if (!ps.length) return '<p class="mf-muted">Todavía no ha hecho la Prueba fija.</p>';
  const rows = ps.map(s => '<tr><td>' + esc(dateTxt(s.t)) + '</td><td>' + esc(s.mode === 'memoria' ? 'Memoria' : gameName(s.minigame)) +
    '</td><td>' + esc(worldName(s.theme)) + '</td>' + statCells(s) + '</tr>').join('');
  // una gráfica por tipo de prueba (siempre las mismas condiciones: sirve para ver el cambio con la práctica)
  const charts = ['classic', 'notx', 'ax'].map(mg => {
    const pts = ps.filter(s => s.mode === 'prueba' && s.minigame === mg && s.stats && s.stats.targets)
      .map(s => ({ v: s.stats.hits / s.stats.targets, label: dateTxt(s.t) }));
    return lineChart(pts, 'Aciertos en ' + gameName(mg) + ' (prueba fija)');
  }).join('');
  return '<p class="mf-muted">Siempre con las mismas condiciones: sirve para ver cómo cambia con la práctica.</p>' +
    '<div class="mf-scroll"><table><thead><tr><th>Fecha</th><th>Prueba</th><th>Mundo</th>' + STAT_HEAD +
    '</tr></thead><tbody>' + rows + '</tbody></table></div>' + charts;
}

function sesionesHTML(sessions) {
  if (!sessions.length) return '<p class="mf-muted">Sin partidas todavía.</p>';
  const rows = sessions.map((s, i) => ({ s, i })).reverse().map(({ s, i }) => '<tr><td>' + esc(dateTxt(s.t)) + '</td><td>' +
    esc(MODE_LABEL[s.mode] || s.mode) + '</td><td>' + esc(worldName(s.theme)) + '</td><td>' + esc(sessionPlace(s)) + '</td><td>' +
    esc(s.boss ? 'Jefe' : s.mode === 'memoria' ? 'Memoria' : gameName(s.minigame)) + '</td>' + statCells(s) +
    '<td class="mf-noprint">' + (s.log ? '<button data-csv="' + i + '">CSV</button>' : '<span class="mf-muted">sin filas</span>') + '</td></tr>').join('');
  return '<div class="mf-scroll"><table><thead><tr><th>Fecha</th><th>Modo</th><th>Mundo</th><th>Dónde</th><th>Juego</th>' + STAT_HEAD +
    '<th class="mf-noprint"></th></tr></thead><tbody>' + rows + '</tbody></table></div>';
}

// ---------- descargas ----------
function playerCols(p, anon) {
  return [['codigo', r => p.code]].concat(anon ? [] : [['jugador', r => p.name]]).concat([
    ['edad', r => p.age], ['partida', r => r._n], ['fecha', r => csvDay(r._t)], ['hora', r => csvHour(r._t)]]);
}
function downloadAllCSV(p, sessions, anon) {
  const rows = [];
  sessions.forEach((s, i) => unpackLog(s.log).forEach(r => rows.push(Object.assign({ _n: i + 1, _t: s.t }, r))));
  const general = csvCols(), names = general.map(c => c[0]);
  const cols = playerCols(p, anon).concat(general, memoryCsvCols().filter(c => !names.includes(c[0])));
  saveCSV(cols, rows, 'todo_' + p.code);
}
function downloadSummaryCSV(p, sessions, anon) {
  const v = x => (typeof x === 'number' && isFinite(x) ? Math.round(x) : '');
  const rows = sessions.map((s, i) => Object.assign({ _n: i + 1, _t: s.t }, s));
  const cols = playerCols(p, anon).concat([
    ['modo', s => MODE_LABEL[s.mode] || s.mode], ['mundo', s => worldName(s.theme)],
    ['capitulo', s => (s.chapter === null ? '' : s.chapter + 1)], ['nivel', s => s.level], ['jefe_final', s => (s.boss ? 'si' : 'no')],
    ['minijuego', s => (s.boss ? 'Jefe' : s.mode === 'memoria' ? 'Memoria' : gameName(s.minigame))], ['estrellas', s => s.stars],
    ['objetivos', s => s.stats.targets], ['aciertos', s => s.stats.hits], ['omisiones', s => s.stats.omissions],
    ['distractores', s => s.stats.distractors], ['comisiones', s => s.stats.commissions],
    ['pct_aciertos', s => (s.stats.targets ? Math.round(s.stats.hits / s.stats.targets * 100) : '')],
    ['tr_medio_ms', s => v(s.stats.meanRT)], ['tr_de_ms', s => v(s.stats.sdRT)],
    ['span_adelante', s => (s.memory ? s.memory.fwd : '')], ['span_al_reves', s => (s.memory ? s.memory.bwd : '')],
    ['segundos_aprox', s => (s.log ? Math.round(sessionMinutes(s) * 60) : '')]
  ]);
  saveCSV(cols, rows, 'resumen_' + p.code);
}

// ---------- abrir y dibujar el panel ----------
// Cuánto espacio usan los datos guardados en este navegador y si están protegidos de borrado automático
function storageInfo() {
  if (!navigator.storage || !navigator.storage.estimate) return Promise.resolve('');
  const mb = b => (b / 1048576 < 10 ? (b / 1048576).toFixed(1) : Math.round(b / 1048576)) + ' MB';
  return Promise.all([navigator.storage.estimate(), navigator.storage.persisted ? navigator.storage.persisted() : false])
    .then(([e, kept]) => 'Datos guardados en este navegador: ' + mb(e.usage || 0) + ' usados de ' + mb(e.quota || 0) + ' disponibles' +
      (kept ? ' · protegidos: el navegador no los borra solo.' : '.') +
      ' Se guardan solo en este equipo y este navegador: descarguen "Todo (CSV)" de vez en cuando como copia.')
    .catch(() => '');
}

function openPanel(scene) {
  if (document.querySelector('.mf-panel')) return;
  askPersistentStorage();
  const kb = scene.input.keyboard;
  kb.enabled = false; kb.disableGlobalCapture();
  const el = document.createElement('div');
  el.className = 'mf-panel';
  document.body.appendChild(el);
  const close = () => { el.remove(); kb.enabled = true; kb.enableGlobalCapture(); };
  scene.events.once('shutdown', () => { if (el.isConnected) close(); });
  let pid = currentPlayerId() || (getPlayers()[0] || {}).id;
  const render = () => {
    const players = getPlayers();
    const p = players.find(x => x.id === pid) || players[0];
    const sessions = p ? playerSessions(p.id) : [];
    attachLogs(sessions).then(() => { if (el.isConnected) draw(players, p, sessions); });   // las filas están en IndexedDB
  };
  const draw = (players, p, sessions) => {
    const minutes = Math.round(sessions.reduce((a, s) => a + (s.log ? sessionMinutes(s) : 0), 0));
    el.innerHTML = '<div class="mf-wrap"><header><h1>Panel del profesional</h1><div class="mf-tools">' +
      (players.length ? '<label>Jugador <select class="mf-player">' + players.map(x => '<option value="' + x.id + '"' +
        (p && x.id === p.id ? ' selected' : '') + '>' + esc(x.name) + ' (' + esc(x.code) + ')</option>').join('') + '</select></label>' : '') +
      (p ? '<label><input type="checkbox" class="mf-anon"> CSV sin nombre (solo código)</label>' +
        '<button class="mf-primary mf-all">Descargar todo (CSV)</button><button class="mf-sum">Resumen (CSV)</button>' +
        '<button class="mf-print">Imprimir / PDF</button>' : '') +
      '<button class="mf-close">Cerrar</button></div></header>' +
      '<p class="mf-note">' + esc(PANEL_NOTE) + '</p><p class="mf-muted mf-space"></p>' +
      (!p ? '<p>Todavía no hay jugadores registrados.</p>' :
        '<div class="mf-kpis">' +
        [[p.name, 'Jugador · ' + p.code], [p.age ? p.age + ' años' : '—', 'Edad'], [sessions.length, 'Partidas'],
          [minutes + ' min', 'Tiempo de juego (aprox.)'], [sessions.length ? dateTxt(sessions[sessions.length - 1].t) : '—', 'Última partida'],
          [dateTxt(p.created), 'Registrado']]
          .map(([b, s]) => '<div class="mf-kpi"><b>' + esc(b) + '</b><span>' + esc(s) + '</span></div>').join('') + '</div>' +
        '<h2>Historia</h2>' + historiaHTML(p.id, sessions) +
        '<h2>Desafío</h2>' + desafioHTML(sessions) +
        '<h2>Prueba fija</h2>' + pruebaHTML(sessions) +
        '<h2>Todas las partidas</h2>' + sesionesHTML(sessions) +
        '<p class="mf-noprint"><button class="mf-danger mf-del">Borrar a ' + esc(p.name) + ' y todos sus datos</button></p>') +
      '</div>';
    const q = s => el.querySelector(s);
    q('.mf-close').onclick = close;
    storageInfo().then(t => { const x = q('.mf-space'); if (x) x.textContent = t; });
    if (!p) return;
    const anon = () => q('.mf-anon').checked;
    q('.mf-player').onchange = e => { pid = Number(e.target.value); render(); };
    q('.mf-all').onclick = () => downloadAllCSV(p, sessions, anon());
    q('.mf-sum').onclick = () => downloadSummaryCSV(p, sessions, anon());
    q('.mf-print').onclick = () => window.print();
    q('.mf-del').onclick = () => {
      if (!confirm('¿Borrar a ' + p.name + ' y todo su progreso e historial? No se puede deshacer.')) return;
      removePlayer(p.id);
      pid = (getPlayers()[0] || {}).id;
      render();
    };
    el.querySelectorAll('[data-csv]').forEach(b => {
      b.onclick = () => {
        const s = sessions[Number(b.dataset.csv)], n = Number(b.dataset.csv) + 1;
        const rows = unpackLog(s.log).map(r => Object.assign({ _n: n, _t: s.t }, r));
        const memOnly = rows.some(r => r.event_type === 'memory_trial') && !rows.some(r => r.event_type === 'stimulus');
        saveCSV(playerCols(p, anon()).concat(memOnly ? memoryCsvCols() : csvCols()), rows,
          p.code + '_' + s.mode + '_' + s.theme + '_partida' + n);
      };
    });
  };
  render();
}
