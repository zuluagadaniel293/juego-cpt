// Misión del día: cuánto se jugó cada día y aviso amable al cumplir la meta.
// La literatura de entrenamiento cognitivo en TDAH usa sesiones de ~15-25 min, 3-5 días por semana,
// durante 4-6 semanas (EndeavorRx: 25 min/día, 5 días/semana; Cogmed: 25 sesiones en 5 semanas).

const dayKey = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const getDaily = () => store.get('cpt_daily', {});           // { '2026-10-19': 734000, ... } ms jugados por día
const todayMs = () => getDaily()[dayKey(new Date())] || 0;
const goalMs = () => CONFIG.DAILY_GOAL_MIN * 60000;

// Días de los últimos 7 (incluido hoy) en que se cumplió la misión
function missionDaysThisWeek() {
  const daily = getDaily();
  let n = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    if ((daily[dayKey(d)] || 0) >= goalMs()) n++;
  }
  return n;
}

// Suma el tiempo de una partida. Si con ella se cumple la meta de hoy, la pantalla de resultados lo celebra.
function addPlayTime(scene, ms) {
  if (!(ms > 0)) return;
  const daily = getDaily(), k = dayKey(new Date()), before = daily[k] || 0;
  daily[k] = before + ms;
  store.set('cpt_daily', daily);
  if (before < goalMs() && daily[k] >= goalMs()) scene.registry.set('missionJustDone', true);
}

// Barra de la misión en la pantalla inicial
function drawDailyMission(scene, x, y) {
  const min = Math.floor(todayMs() / 60000), goal = CONFIG.DAILY_GOAL_MIN, done = min >= goal, w = 300;
  scene.add.text(x, y - 18, done ? '★ ¡Misión del día cumplida! ★' : 'Misión del día: ' + min + ' de ' + goal + ' minutos',
    { font: 'bold 16px Arial', color: done ? '#fde047' : '#e2e8f0' }).setOrigin(0.5);
  scene.add.rectangle(x - w / 2, y + 4, w, 10, 0xffffff, 0.15).setOrigin(0, 0.5);
  scene.add.rectangle(x - w / 2, y + 4, w * Math.min(1, min / goal), 10, done ? 0xfde047 : 0x38bdf8).setOrigin(0, 0.5);
  const days = missionDaysThisWeek(), want = CONFIG.WEEKLY_DAYS_GOAL;
  scene.add.text(x, y + 24, 'Esta semana: ' + '●'.repeat(Math.min(days, want)) + '○'.repeat(Math.max(0, want - days)),
    { font: '15px Arial', color: '#94a3b8' }).setOrigin(0.5);
}

// En las pantallas de resultados: si se acaba de cumplir la misión, felicita y sugiere descansar
function missionCheck(scene) {
  if (!scene.registry.get('missionJustDone')) return;
  scene.registry.set('missionJustDone', false);
  const W = GAME_W, H = GAME_H, D = 50, it = [];
  const add = o => { it.push(o.setDepth(D)); return o; };
  add(scene.add.rectangle(0, 0, W, H, 0x0f172a, 0.92).setOrigin(0).setInteractive());   // tapa los botones de atrás
  add(scene.add.text(W / 2, 120, '★ ¡Misión del día cumplida! ★', { font: 'bold 44px Arial', color: '#fde047' }).setOrigin(0.5));
  add(scene.add.text(W / 2, 230, 'Entrenaste ' + CONFIG.DAILY_GOAL_MIN + ' minutos hoy. ¡Tu cerebro está más fuerte!\nAhora descansa y vuelve mañana para la siguiente misión.',
    { font: '24px Arial', color: '#f1f5f9', align: 'center', lineSpacing: 10 }).setOrigin(0.5));
  add(scene.add.text(W / 2, 320, 'Esta semana: ' + missionDaysThisWeek() + ' de ' + CONFIG.WEEKLY_DAYS_GOAL + ' misiones',
    { font: 'bold 22px Arial', color: '#86efac' }).setOrigin(0.5));
  rewardSound();
  const btn = (x, label, color, cb) => {
    const r = add(scene.add.rectangle(x, 420, 300, 62, color).setInteractive({ useHandCursor: true }));
    add(scene.add.text(x, 420, label, { font: 'bold 22px Arial', color: '#0f172a' }).setOrigin(0.5));
    r.on('pointerdown', cb);
  };
  btn(W / 2 - 170, 'Terminar por hoy', 0xfde047, () => scene.scene.start('Mode'));
  btn(W / 2 + 170, 'Jugar un poquito más', 0xcbd5e1, () => it.forEach(o => o.destroy()));
}
