// Captura todas las pantallas actuales del juego en alta resolución (para revisar el diseño o subirlas a Figma).
// Requiere puppeteer-core y el juego servido en http://localhost:8765 (python -m http.server 8765).
// Uso: node herramientas/capturar_pantallas.js <carpeta_de_salida>
const puppeteer = require('puppeteer-core');
const path = require('path');
const out = process.argv[2];
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
  const p = await b.newPage(); await p.setViewport({ width: 1920, height: 1080 });
  const errors = []; p.on('pageerror', e => errors.push(e.message));
  const url = 'http://localhost:8765/index.html';
  const shot = n => p.screenshot({ path: path.join(out, n + '.png') });
  const fresh = async () => {
    await p.goto(url); await sleep(1200);
    await p.evaluate(() => { localStorage.clear(); localStorage.setItem('cpt_story', JSON.stringify({ heroes: [3, 2, 0, 0, 0], fantasy: [1, 0, 0, 0, 0] }));
      localStorage.setItem('cpt_records', JSON.stringify({ heroes_classic: 4, heroes_race: 2 })); localStorage.setItem('cpt_challenge_level', JSON.stringify({ heroes_classic: 5 })); });
    await p.reload(); await sleep(1800);
  };
  const go = async (scene, data, wait) => { await p.evaluate((s, d) => { window.juego.scene.getScenes(true).forEach(x => { if (x.scene.key !== s) x.scene.stop(); }); window.juego.scene.start(s, d); }, scene, data); await sleep(wait || 1200); };
  const play = async (data, override, wait) => {
    await p.evaluate(o => { const f = window.challengeParams; window.challengeParams = (l, m) => Object.assign(f(l, m), o); }, override || {});
    await go('Game', data, 1200); await p.keyboard.press('Enter'); await sleep(wait || 2600);
  };
  const fakeLog = (n, hits, comm) => {
    const log = [];
    for (let i = 0; i < n; i++) {
      const target = i % 3 === 0, t = i * 1500;
      const outcome = target ? (i / 3 < hits ? 'hit' : 'omission') : (i < comm * 3 ? 'commission' : 'correct_rejection');
      log.push({ event_type: 'stimulus', stimulus_type: target ? 'target' : 'distractor', onset_ms: t, responded: outcome === 'hit' || outcome === 'commission' ? 1 : 0, rt_ms: outcome === 'hit' ? 380 + (i % 4) * 40 : '', outcome });
    }
    return log;
  };
  await fresh();
  await shot('01_inicio_elegir_modo');
  await go('WorldMap'); await shot('02_historia_mapa_de_mundos');
  for (const [t, n] of [['heroes', '03'], ['fantasy', '04'], ['kingdom', '05']]) { await go('ChapterMap', { theme: t }); await shot(n + '_historia_capitulos_' + t); }
  for (const [t, n] of [['heroes', '06'], ['fantasy', '07'], ['kingdom', '08']]) { await go('Story', { theme: t, chapter: 0 }, 1500); await shot(n + '_historia_escena_' + t); }
  await go('Story', { theme: 'heroes', chapter: 4 }, 1500); await shot('09_historia_jefe_final');
  await go('Story', { theme: 'kingdom', chapter: 4, ending: true }, 1500); await shot('10_historia_final');
  await go('Game', { mode: 'historia', theme: 'heroes', chapter: 0 }, 1500); await shot('11_juego_como_jugar');
  await play({ mode: 'desafio', theme: 'heroes', level: 3, minigame: 'classic' }, { targetProb: 1, visualEvery: [500, 800] }, 1500); await shot('12_juego_clasico');
  await play({ mode: 'desafio', theme: 'fantasy', level: 3, minigame: 'catch' }, { targetProb: 0.5, visualEvery: [500, 800] }, 3000); await shot('13_juego_atrapa');
  await play({ mode: 'desafio', theme: 'kingdom', level: 3, minigame: 'race' }, { targetProb: 0.5 }, 3500); await shot('14_juego_carrera');
  await play({ mode: 'desafio', theme: 'heroes', level: 6, minigame: 'find' }, {}, 1500); await shot('15_juego_encuentra');
  await play({ mode: 'historia', theme: 'fantasy', chapter: 4 }, { targetProb: 0.5 }, 3500); await shot('16_juego_jefe_red');
  await play({ mode: 'historia', theme: 'kingdom', chapter: 4, phase: 1 }, { targetProb: 0.5 }, 3500); await shot('17_juego_jefe_persecucion');
  await go('StoryResults', { log: fakeLog(15, 4, 1), theme: 'heroes', chapter: 0, minigame: 'classic', boss: false }); await shot('18_resultados_historia');
  await go('Menu', { mode: 'desafio' }); await shot('19_desafio_elegir_mundo');
  await go('MinigameSelect', { theme: 'heroes' }); await shot('20_desafio_elegir_minijuego');
  await go('ChallengeResults', { log: fakeLog(15, 5, 0), theme: 'heroes', level: 5, minigame: 'classic' }); await shot('21_resultados_desafio');
  await go('Menu', { mode: 'prueba' }); await shot('22_prueba_fija_elegir_mundo');
  await go('Results', { log: fakeLog(30, 8, 2), theme: 'heroes' }); await shot('23_resultados_prueba_fija');
  console.log('errores:', JSON.stringify(errors));
  await b.close();
})();
