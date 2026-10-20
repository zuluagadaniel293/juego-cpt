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

// ---------- CSV en español, listo para abrir en Excel (ver GUIA_CSV.md) ----------
const CSV_TEXT = {
  event_type: { stimulus: 'estimulo', audio_distractor: 'distractor_sonido', visual_distractor: 'distractor_visual' },
  mode: { historia: 'Historia', desafio: 'Desafío', prueba: 'Prueba fija' },
  stimulus_type: { target: 'objetivo', distractor: 'distractor' },
  outcome: {
    hit: 'acierto',                       // respondió al objetivo
    omission: 'omision',                  // no respondió al objetivo (despiste)
    commission: 'error_impulsivo',        // respondió a un distractor
    correct_rejection: 'ignoro_bien',     // no respondió a un distractor (correcto)
    wrong_tap: 'toco_otro'                // en Encuentra tocó otro objeto en vez del objetivo
  }
};
// Nombre legible de lo que apareció: el nombre del archivo de la imagen (sin la ruta)
function stimulusLabel(theme, key) {
  if (!key) return '';
  const m = /^img_(\w+?)_(.+)$/.exec(key);
  if (m && THEMES[m[1]]) { const f = assetFile(m[1], m[2]); if (f) return f.split('/').pop().replace(/\.[^.]+$/, ''); }
  return key;
}
function downloadCSV(log, name) {
  const cols = [
    ['tipo_evento', r => CSV_TEXT.event_type[r.event_type] || r.event_type],
    ['modo', r => CSV_TEXT.mode[r.mode] || r.mode],
    ['mundo', r => (THEMES[r.theme] ? THEMES[r.theme].label : r.theme)],
    ['nivel', r => r.level],
    ['capitulo', r => r.chapter],
    ['fase_jefe', r => r.phase],
    ['minijuego', r => (MG[r.minigame] ? MG[r.minigame].label : r.minigame)],
    ['ensayo', r => r.trial],
    ['tipo_estimulo', r => CSV_TEXT.stimulus_type[r.stimulus_type] || r.stimulus_type],
    ['que_aparecio', r => stimulusLabel(r.theme, r.stimulus_key)],
    ['momento_ms', r => r.onset_ms],
    ['respondio', r => (r.responded === undefined ? '' : r.responded ? 'si' : 'no')],
    ['tiempo_reaccion_ms', r => r.rt_ms],
    ['resultado', r => CSV_TEXT.outcome[r.outcome] || r.outcome]
  ];
  saveCSV(cols, log, name);
}
// Memoria (tipo Corsi): una fila por camino. Las casillas van numeradas del 1 al 9.
function downloadMemoryCSV(log, theme) {
  const cols = [
    ['modo', () => 'Memoria'],
    ['mundo', r => (THEMES[r.theme] ? THEMES[r.theme].label : r.theme)],
    ['fase', r => (r.direction === 'fwd' ? 'adelante' : 'al_reves')],
    ['ensayo', r => r.trial],
    ['largo_secuencia', r => r.length],
    ['casillas_mostradas', r => r.shown],
    ['respuesta_esperada', r => r.expected],
    ['respuesta_del_nino', r => r.answered],
    ['correcto', r => (r.correct ? 'si' : 'no')],
    ['tiempo_primer_toque_ms', r => r.first_tap_ms],
    ['tiempo_total_respuesta_ms', r => r.total_ms]
  ];
  saveCSV(cols, log, 'memoria_' + theme);
}
function saveCSV(cols, log, name) {
  const cell = v => (v === undefined || v === null ? '' : String(v).replace(/;/g, ','));
  const lines = [cols.map(c => c[0]).join(';')].concat(log.map(r => cols.map(c => cell(c[1](r))).join(';')));
  // BOM + punto y coma: Excel en español lo abre en columnas y con tildes correctas
  const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const d = new Date(), pad = n => String(n).padStart(2, '0');
  const stamp = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + '_' + pad(d.getHours()) + 'h' + pad(d.getMinutes());
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const world = { heroes: 'superheroes', fantasy: 'dragones', kingdom: 'reino_magico' };
  a.download = 'cpt_' + name.replace(/heroes|fantasy|kingdom/, m => world[m]) + '_' + stamp + '.csv';
  a.click();
  URL.revokeObjectURL(url);
}
