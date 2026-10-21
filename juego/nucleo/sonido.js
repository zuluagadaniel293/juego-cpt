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
function speakTTS(text, theme) {
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = bestSpanishVoice();
    if (v) u.voice = v;
    u.lang = v ? v.lang : 'es-MX';
    u.pitch = STORY[theme].voice.pitch;   // tono más agudo: suena a personaje infantil
    u.rate = 1.0;
    window.speechSynthesis.speak(u);
  } catch (e) { /* sin voz disponible */ }
}
function playVoice(theme, id, text) {
  stopVoice();
  const file = ((window.VOICES || {})[theme] || {})[id] || assetFile(theme, 'voice_' + id);
  if (!file) { speakTTS(text, theme); return; }
  currentVoice = new Audio('assets/' + file);
  currentVoice.play().catch(() => speakTTS(text, theme));
}
function stopVoice() {
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
function rescueSound() {   // rescatar a un compañero: campanitas suaves que suben
  [784, 988, 1175, 1568].forEach((f, i) => sweep('sine', f, f * 1.005, 0.3, 0.07, i * 0.07));
  noise(0.4, 0.03, 'highpass', 5000, null, 0.1);
}
function fizzleSound() { noise(0.22, 0.08, 'lowpass', 700, 200); }   // el poder se apaga (sin premio)
