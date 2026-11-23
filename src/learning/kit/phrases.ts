/** Frases comunes del kit educativo (runner y hub). */
import { definePhrases } from '@/audio';

/** Pool de elogios: el runner los rota sin repetir seguidos. */
export const PRAISE_KEYS = ['learn.praise.1', 'learn.praise.2', 'learn.praise.3', 'learn.praise.4', 'learn.praise.5', 'learn.praise.6', 'learn.praise.7', 'learn.praise.8'];

definePhrases({
  'learn.praise.1': ['¡Muy bien!', '¡Muy bien, {name}!'],
  'learn.praise.2': ['¡Lo lograste!', '¡Lo hiciste!'],
  'learn.praise.3': ['¡Qué buena idea!', '¡Eso es!'],
  'learn.praise.4': ['¡Excelente!', '¡Súper!'],
  'learn.praise.5': ['¡Bravo, {name}!', '¡Bravo!'],
  'learn.praise.6': ['¡Qué lista eres!', '¡Así se hace!'],
  'learn.praise.7': ['¡Increíble!', '¡Fantástico!'],
  'learn.praise.8': ['¡Me encanta cómo juegas!', '¡Sigue así!'],
  'learn.finish': ['¡Terminamos! ¡Jugaste muy bonito, {name}!', '¡Listo, {name}! ¡Qué divertido!', '¡Ya terminamos! ¡Gracias por jugar conmigo!'],
  'learn.hub': ['¿A qué jugamos, {name}?', '¡Elige un juego!', '¿Qué quieres aprender hoy?'],
  'learn.cat.colores': ['¡Colores!'],
  'learn.cat.figuras': ['¡Figuras!'],
  'learn.cat.numeros': ['¡Números!'],
  'learn.cat.memoria': ['¡Memoria!'],
  'learn.cat.patrones': ['¡Patrones!'],
  'learn.cat.clasificacion': ['¡A ordenar!'],
});
