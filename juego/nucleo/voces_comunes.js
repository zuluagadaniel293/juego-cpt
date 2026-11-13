// Frases que comparten todos los mundos, para grabar menos audios:
// - el mensaje de "¡Mundo desbloqueado!" (igual para todos)
// - las risas de los villanos y los "¡ayuda!" de los amigos: unas pocas voces de hombre (_m) y de mujer (_f).
//   Cada mundo dice cuál usa en distractors.voices (risa: { pool: 'risa_m' }, ayuda: { pool: 'ayuda_f' }) y el
//   juego elige una al azar. Las graban herramientas/generar_voces.js (gratis) y generar_voces_elevenlabs.js
//   (con emoción) en assets/voces/comunes, con ids 'pool_<pool>_<n>' (n empieza en 1).
// Sin nombres propios: así sirven en cualquier mundo.

const UNLOCK_LINE = '¡Felicidades! ¡Desbloqueaste un nuevo mundo!';

const VOICE_POOLS = {
  risa_m: [
    '¡Ja, ja, ja! ¡Nunca me atraparás!',
    '¡Jo, jo, jo! Aquí estoy... ¿o no?',
    '¡Ji, ji, ji! ¡No me pueden atrapar!',
    '¡Je, je! ¿Dónde estaré?',
    '¡Je, je! ¡No me ves, no me ves!'
  ],
  risa_f: [
    '¡Ja, ja, ja! ¡Jamás lo encontrarás!',
    '¡Ji, ji! ¡Mis hechizos nunca fallan!',
    '¡Ja, ja! ¡Atrápame si puedes!'
  ],
  ayuda_m: [
    '¡Ayuda! ¡Ayúdenme, por favor!',
    '¡Socorro! ¡Me atrapó!',
    '¡Ay, no! ¡Rápido, sálvame!',
    '¡Auxilio! ¡No puedo soltarme!'
  ],
  ayuda_f: [
    '¡Ayuda! ¡Ayúdenme, por favor!',
    '¡Socorro! ¡Me atrapó!',
    '¡Ay, no! ¡No puedo soltarme!'
  ]
};
