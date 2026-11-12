// Voces de los personajes, sonidos del juego y sonidos de los poderes.

// ======================= VOZ DE LOS PERSONAJES =======================
// Usa las voces generadas (assets/voces.js, con herramientas/generar_voces.js): una voz fija por personaje.
// Si no hay, el audio que assets/manifest.js le asigne (voice_1 ... voice_5, voice_end); si no, la voz del navegador.
let currentVoice = null;
function bestSpanishVoice() {
  try {
    const voices = window.speechSynthesis.getVoices().filter(v => v.lang && v.lang.toLowerCase().startsWith('es'));
    const score = v => (/natural|online|neural/i.test(v.name) ? 10 : 0) + (/MX|US|CO|419|AR/i.test(v.lang) ? 3 : 0) + (v.localService ? 0 : 1);
    return voices.sort((a, b) => score(b) - score(a))[0] || null;
  } catch (e) { return null; }
}
function speakTTS(text, theme, onEnd) {
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = bestSpanishVoice();
    if (v) u.voice = v;
    u.lang = v ? v.lang : 'es-MX';
    u.pitch = STORY[theme].voice.pitch;   // tono más agudo: suena a personaje infantil
    u.rate = 1.0;
    if (onEnd) u.onend = onEnd;
    window.speechSynthesis.speak(u);
  } catch (e) { if (onEnd) onEnd(); }
}
// onEnd: se llama al terminar de hablar (para encadenar diálogos). Si otra voz la interrumpe, no se llama.
let voiceTurn = 0;
function playVoice(theme, id, text, onEnd) {
  stopVoice();
  const turn = ++voiceTurn;
  const done = () => { if (onEnd && turn === voiceTurn) onEnd(); };
  const file = ((window.VOICES || {})[theme] || {})[id] || assetFile(theme, 'voice_' + id);
  if (!file) { speakTTS(text, theme, done); return; }
  currentVoice = new Audio('assets/' + file);
  currentVoice.onended = done;
  currentVoice.play().catch(() => speakTTS(text, theme, done));
}
// Voz de un distractor (risa del villano, "¡ayuda!"...): suena encima de todo, sin cortar al narrador.
// Primero la versión con emoción de ElevenLabs (si hay varias, una al azar); si no, la voz gratuita.
function playClip(theme, id, volume) {
  const eleven = ((window.VOICES_ELEVEN || {})[theme] || {})[id];
  const file = (eleven && eleven.length ? eleven[Math.floor(Math.random() * eleven.length)] : null)
    || ((window.VOICES || {})[theme] || {})[id];
  if (!file) return false;
  const a = new Audio('assets/' + file);
  a.volume = volume === undefined ? 0.8 : volume;
  a.play().catch(() => {});
  return true;
}
function stopVoice() {
  voiceTurn++;   // lo que estaba esperando a que terminara esta voz ya no sigue
  if (currentVoice) { currentVoice.pause(); currentVoice = null; }
  try { window.speechSynthesis.cancel(); } catch (e) { /* nada */ }
}

// ======================= AUDIO (Web Audio, sin archivos) =======================
let audioCtx = null;
function getCtx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function tone(freq, dur, vol, type) {
  const ctx = getCtx();
  if (!ctx) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type || 'sine';
  o.frequency.value = freq;
  g.gain.setValueAtTime(vol, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  o.connect(g);
  g.connect(ctx.destination);
  o.start();
  o.stop(ctx.currentTime + dur);
}
function distractorSound() {            // sonido disonante que funciona como distractor
  tone(220, 0.6, 0.25, 'sawtooth');
  tone(233, 0.6, 0.25, 'sawtooth');
}
function rewardSound() {                // refuerzo positivo
  tone(660, 0.12, 0.12, 'sine');
  setTimeout(() => tone(880, 0.15, 0.12, 'sine'), 90);
}

let noiseBuf = null;
function noise(dur, vol, filterType, f0, f1, delay) {   // ruido filtrado: truenos, fuego, brillo
  const ctx = getCtx();
  if (!ctx) return;
  if (!noiseBuf) {
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const t = ctx.currentTime + (delay || 0);
  const src = ctx.createBufferSource(); src.buffer = noiseBuf; src.loop = true;
  const f = ctx.createBiquadFilter(); f.type = filterType;
  f.frequency.setValueAtTime(f0, t);
  if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f); f.connect(g); g.connect(ctx.destination);
  src.start(t); src.stop(t + dur);
}
function sweep(type, f0, f1, dur, vol, delay) {           // tono que sube o baja
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime + (delay || 0);
  const o = ctx.createOscillator(); o.type = type;
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(ctx.destination);
  o.start(t); o.stop(t + dur);
}
// Envolvente: sube, se mantiene y baja (así las cosas "llegan" y "se van", en vez de empezar fuerte y apagarse)
function envGain(ctx, t, vol, a, s, r) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + a);
  g.gain.setValueAtTime(vol, t + a + s);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + s + r);
  return g;
}
// Paneo de un lado al otro (si el navegador lo permite)
function panNode(ctx, t, from, to, dur) {
  if (!ctx.createStereoPanner) return null;
  const p = ctx.createStereoPanner();
  p.pan.setValueAtTime(from, t);
  p.pan.linearRampToValueAtTime(to, t + dur);
  return p;
}
// conecta los nodos en fila (se salta los que no existen)
function chain(nodes) { const ns = nodes.filter(Boolean); for (let i = 0; i < ns.length - 1; i++) ns[i].connect(ns[i + 1]); }
// Avión que pasa: el rugido de las turbinas se acerca, pasa por encima (el tono baja, como en la vida real)
// y se aleja hacia el otro lado. dir: 1 = de izquierda a derecha, -1 = al revés
function planeSound(dir) {
  const ctx = getCtx();
  if (!ctx) return;
  const t = ctx.currentTime, dur = 4.6, a = 1.9, s = 0.5, r = dur - a - s;
  dir = dir || (Math.random() < 0.5 ? 1 : -1);
  if (!noiseBuf) noise(0.01, 0.0001, 'lowpass', 100);   // crea el ruido base
  const n = ctx.createBufferSource(); n.buffer = noiseBuf; n.loop = true;
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 0.7;
  bp.frequency.setValueAtTime(900, t); bp.frequency.linearRampToValueAtTime(1300, t + a); bp.frequency.exponentialRampToValueAtTime(380, t + dur);
  chain([n, bp, envGain(ctx, t, 0.16, a, s, r), panNode(ctx, t, -0.9 * dir, 0.9 * dir, dur), ctx.destination]);
  [0, 4].forEach(det => {   // zumbido grave del motor
    const o = ctx.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(128 + det, t); o.frequency.setValueAtTime(128 + det, t + a * 0.8);
    o.frequency.exponentialRampToValueAtTime(96 + det, t + a + s + 0.6);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 520;
    chain([o, lp, envGain(ctx, t, 0.035, a, s, r), panNode(ctx, t, -0.9 * dir, 0.9 * dir, dur), ctx.destination]);
    o.start(t); o.stop(t + dur + 0.1);
  });
  n.start(t); n.stop(t + dur + 0.1);
}
// ---------- Grabaciones reales (assets/sonidos.js): volumen parejo y suave ----------
// Cada grabación viene con su propio volumen; al cargarla se mide (qué tan fuerte suena en promedio y su pico)
// y se reproduce al nivel pedido, sin pasar de un tope. Dura máximo 3 s y se apaga suavemente al final.
const SFX_LEVEL = 0.07;       // sonido característico de un personaje u objeto (un poco más fuerte)
const AMBIENT_LEVEL = 0.03;   // ambientación de fondo (bajito)
const SFX_MAX_S = 3;
const sfxCache = {};
function loadSfx(file) {
  const ctx = getCtx();
  if (!ctx) return Promise.resolve(null);
  if (!sfxCache[file]) {
    sfxCache[file] = fetch((window.SFX_BASE || 'assets/') + file).then(r => r.arrayBuffer()).then(b => ctx.decodeAudioData(b)).then(buf => {
      const d = buf.getChannelData(0), n = Math.min(d.length, buf.sampleRate * SFX_MAX_S);
      let sum = 0, cnt = 0, peak = 0;
      for (let i = 0; i < n; i++) {
        const v = Math.abs(d[i]);
        if (v > peak) peak = v;
        if (v > 0.02) { sum += v * v; cnt++; }   // solo las partes que suenan (no los silencios)
      }
      return { buf, rms: Math.sqrt(sum / Math.max(1, cnt)) || 0.1, peak: peak || 1 };
    }).catch(() => null);
  }
  return sfxCache[file];
}
// level: SFX_LEVEL o AMBIENT_LEVEL · pan: -1 (izquierda) a 1 (derecha)
function playSfx(file, level, pan) {
  const ctx = getCtx();
  if (!ctx || !file) return false;
  loadSfx(file).then(s => {
    if (!s) return;
    const t = ctx.currentTime, len = Math.min(s.buf.duration, SFX_MAX_S);
    const vol = Math.min(level / s.rms, 0.6 / s.peak);
    const src = ctx.createBufferSource(); src.buffer = s.buf;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.03);
    g.gain.setValueAtTime(vol, t + Math.max(0.03, len - 0.4));
    g.gain.linearRampToValueAtTime(0.0001, t + len);
    chain([src, g, pan ? panNode(ctx, t, pan, pan, len) : null, ctx.destination]);
    src.start(t); src.stop(t + len + 0.05);
  });
  return true;
}
// Sonido característico de un personaje u objeto, si tiene grabación (si no, el que hace el código)
function playNamedSfx(name, pan) { return !!(window.SFX_FILES && window.SFX_FILES[name]) && playSfx(window.SFX_FILES[name], SFX_LEVEL, pan); }
// Deja cargados los sonidos de un mundo, para que suenen sin demora la primera vez
function preloadWorldSfx(theme) {
  const D = DISTRACTORS[theme] || {}, files = window.SFX_FILES || {};
  (D.visual || []).map(v => v.name).concat(Object.keys(D.sounds || {})).forEach(n => { if (files[n]) loadSfx(files[n]); });
  ((window.SFX_AMBIENT || {})[theme] || []).forEach(a => loadSfx(a.file));
}
function rescueSound() {   // rescatar a un compañero: campanitas suaves que suben
  [784, 988, 1175, 1568].forEach((f, i) => sweep('sine', f, f * 1.005, 0.3, 0.07, i * 0.07));
  noise(0.4, 0.03, 'highpass', 5000, null, 0.1);
}
function fizzleSound() { noise(0.22, 0.08, 'lowpass', 700, 200); }   // el poder se apaga (sin premio)
