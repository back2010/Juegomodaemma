/** Frases base comunes. Español latinoamericano, cortas, sin negatividad. */
import type { PhraseBook } from '@/types';

const colors: Record<string, string> = {
  rojo: 'rojo', naranja: 'naranja', amarillo: 'amarillo', verde: 'verde', azul: 'azul',
  morado: 'morado', rosa: 'rosa', blanco: 'blanco', negro: 'negro', cafe: 'café', celeste: 'celeste', gris: 'gris',
};
const shapes: Record<string, string> = {
  circulo: 'el círculo', cuadrado: 'el cuadrado', triangulo: 'el triángulo', estrella: 'la estrella',
  corazon: 'el corazón', rectangulo: 'el rectángulo', rombo: 'el rombo', ovalo: 'el óvalo',
};
const nums = ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];

export const BASE_PHRASES: PhraseBook = {
  'greet.hello': ['¡Hola, {name}!', '¡Hola, {name}! ¡Qué bueno verte!', '¡Hola! ¡Vamos a jugar, {name}!'],
  'greet.bye': ['¡Hasta pronto, {name}!', '¡Nos vemos, {name}!'],
  'cheer': ['¡Muy bien!', '¡Qué bien, {name}!', '¡Eso es!', '¡Lo lograste!', '¡Genial!', '¡Bravo, {name}!', '¡Súper!'],
  'cheer.big': ['¡Fantástico, {name}!', '¡Lo hiciste increíble!', '¡Qué lindo quedó!', '¡Eres una campeona!'],
  'retry': ['¡Inténtalo otra vez!', 'Casi, ¡vamos de nuevo!', 'Probemos otra vez, {name}.'],
  'hint': ['Mira bien…', 'Tú puedes, {name}.', 'Con calma, {name}.'],
  'common.dress': ['Vamos a vestir a nuestra muñeca.', 'Vamos a vestir a nuestra muñeca, {name}.'],
  'common.find-color': ['Busca el color {color}.', '¿Dónde está el color {color}?'],
  'common.find-pink': ['Busca el color rosa.'],
  'common.find-shape': ['¿Dónde está {shape}?', 'Busca {shape}.'],
  'common.where-circle': ['¿Dónde está el círculo?'],
  'common.count-stars': ['Vamos a contar las estrellas.'],
  'common.pick-hair': ['Elige tu peinado favorito.', '¿Qué peinado te gusta, {name}?'],
  'common.pick-doll': ['Elige tu muñeca favorita.'],
  'common.count': ['¿Cuántos hay? Vamos a contar.'],
  'audio.test': ['¡Hola! Así sueno yo.'],
};
for (const [k, v] of Object.entries(colors)) BASE_PHRASES[`color.${k}`] = [v];
for (const [k, v] of Object.entries(shapes)) BASE_PHRASES[`shape.${k}`] = [v];
nums.forEach((w, i) => { BASE_PHRASES[`num.${i + 1}`] = [w]; });
