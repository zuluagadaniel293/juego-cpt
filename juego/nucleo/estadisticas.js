// Métricas de atención (aciertos, omisiones, comisiones, TR), estrellas y CSV.

function computeStats(log) {
  const st = log.filter(r => r.event_type === 'stimulus');
  const targets = st.filter(r => r.stimulus_type === 'target');
  const dists = st.filter(r => r.stimulus_type === 'distractor');
  const hits = targets.filter(r => r.outcome === 'hit');
  const mean = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN;
  const sd = a => {
    if (a.length < 2) return NaN;
    const m = mean(a);
    return Math.sqrt(a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1));
  };
  const rts = hits.map(r => r.rt_ms);
  const lastOnset = st.length ? Math.max(...st.map(r => r.onset_ms)) : 0;
  const half = lastOnset / 2;
  return {
    trials: st.length,
    targets: targets.length,
    hits: hits.length,
    omissions: targets.length - hits.length,
    distractors: dists.length,
    // 'wrong_tap' = en Encuentra tocó otro objeto en vez del especial
    commissions: st.filter(r => r.outcome === 'commission' || r.outcome === 'wrong_tap').length,
    hitRate: targets.length ? hits.length / targets.length : 0,
    meanRT: mean(rts),
    sdRT: sd(rts),
    cv: sd(rts) / mean(rts),
    rtFirst: mean(hits.filter(r => r.onset_ms <= half).map(r => r.rt_ms)),
    rtSecond: mean(hits.filter(r => r.onset_ms > half).map(r => r.rt_ms))
  };
}

// Estrellas: premian precisión (aciertos y pocas comisiones), no velocidad.
function starsFor(s, mg) {
  const hitRate = s.targets ? s.hitRate : 1;
  const base = mg === 'find' ? s.trials : s.distractors;
  const commRate = base ? s.commissions / base : 0;
  if (hitRate >= 0.9 && commRate <= 0.1) return 3;
  if (hitRate >= 0.75 && commRate <= 0.25) return 2;
  if (hitRate >= 0.5 && commRate <= 0.4) return 1;
  return 0;
}

function downloadCSV(log, name) {
  const cols = ['event_type', 'mode', 'theme', 'level', 'chapter', 'phase', 'minigame', 'trial', 'stimulus_type', 'stimulus_key',
    'onset_ms', 'responded', 'rt_ms', 'outcome'];
  const lines = [cols.join(',')].concat(
    log.map(r => cols.map(c => (r[c] === undefined ? '' : r[c])).join(','))
  );
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cpt_' + name + '_' + Date.now() + '.csv';
  a.click();
  URL.revokeObjectURL(url);
}
