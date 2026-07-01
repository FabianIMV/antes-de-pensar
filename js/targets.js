/**
 * Pool de blancos ocultos.
 *
 * Para agregar un blanco nuevo:
 * 1. Coloca un SVG (o PNG/JPG) simple en assets/img/targets/
 * 2. Agrega un objeto a TARGETS con un id único.
 *
 * Campos:
 * - id: identificador único (string, sin espacios)
 * - categoria: "paisaje" | "objeto" | "textura" | "simbolo"
 * - nombre: nombre visible en la revelación
 * - src: ruta al archivo de imagen
 * - temp: "frio" | "calido"       -> eje sensorial usado en la captura
 * - luz: "oscuro" | "claro"       -> eje sensorial usado en la captura
 * - movimiento: "quieto" | "movimiento" -> eje sensorial usado en la captura
 * - cualidades: lista de palabras descriptivas adicionales, mostradas
 *   en la revelación y usadas en la lista de auto-evaluación.
 */
const TARGETS = [
  {
    id: 'montana-amanecer',
    categoria: 'paisaje',
    nombre: 'Montaña al amanecer',
    src: 'assets/img/targets/montana-amanecer.svg',
    temp: 'calido',
    luz: 'claro',
    movimiento: 'quieto',
    cualidades: ['vertical', 'abierto', 'natural', 'elevado'],
  },
  {
    id: 'oceano-tormenta',
    categoria: 'paisaje',
    nombre: 'Océano en tormenta',
    src: 'assets/img/targets/oceano-tormenta.svg',
    temp: 'frio',
    luz: 'oscuro',
    movimiento: 'movimiento',
    cualidades: ['horizontal', 'abierto', 'natural', 'inquieto'],
  },
  {
    id: 'desierto-mediodia',
    categoria: 'paisaje',
    nombre: 'Desierto a mediodía',
    src: 'assets/img/targets/desierto-mediodia.svg',
    temp: 'calido',
    luz: 'claro',
    movimiento: 'quieto',
    cualidades: ['horizontal', 'abierto', 'natural', 'seco'],
  },
  {
    id: 'bosque-niebla',
    categoria: 'paisaje',
    nombre: 'Bosque con niebla',
    src: 'assets/img/targets/bosque-niebla.svg',
    temp: 'frio',
    luz: 'oscuro',
    movimiento: 'quieto',
    cualidades: ['vertical', 'cerrado', 'natural', 'húmedo'],
  },
  {
    id: 'rio-deshielo',
    categoria: 'paisaje',
    nombre: 'Río de deshielo',
    src: 'assets/img/targets/rio-deshielo.svg',
    temp: 'frio',
    luz: 'claro',
    movimiento: 'movimiento',
    cualidades: ['horizontal', 'abierto', 'natural', 'fluido'],
  },
  {
    id: 'llave-oxidada',
    categoria: 'objeto',
    nombre: 'Llave oxidada',
    src: 'assets/img/targets/llave-oxidada.svg',
    temp: 'frio',
    luz: 'oscuro',
    movimiento: 'quieto',
    cualidades: ['vertical', 'cerrado', 'artificial', 'antiguo'],
  },
  {
    id: 'llama-vela',
    categoria: 'objeto',
    nombre: 'Llama de una vela',
    src: 'assets/img/targets/llama-vela.svg',
    temp: 'calido',
    luz: 'claro',
    movimiento: 'movimiento',
    cualidades: ['vertical', 'abierto', 'frágil', 'cálido'],
  },
  {
    id: 'puerta-cerrada',
    categoria: 'objeto',
    nombre: 'Puerta cerrada',
    src: 'assets/img/targets/puerta-cerrada.svg',
    temp: 'frio',
    luz: 'oscuro',
    movimiento: 'quieto',
    cualidades: ['vertical', 'cerrado', 'artificial', 'umbral'],
  },
  {
    id: 'reloj-arena',
    categoria: 'objeto',
    nombre: 'Reloj de arena',
    src: 'assets/img/targets/reloj-arena.svg',
    temp: 'calido',
    luz: 'claro',
    movimiento: 'movimiento',
    cualidades: ['vertical', 'cerrado', 'artificial', 'cíclico'],
  },
  {
    id: 'grano-madera',
    categoria: 'textura',
    nombre: 'Grano de madera',
    src: 'assets/img/targets/grano-madera.svg',
    temp: 'calido',
    luz: 'oscuro',
    movimiento: 'quieto',
    cualidades: ['horizontal', 'cerrado', 'natural', 'denso'],
  },
  {
    id: 'grietas-tierra',
    categoria: 'textura',
    nombre: 'Grietas de tierra seca',
    src: 'assets/img/targets/grietas-tierra.svg',
    temp: 'calido',
    luz: 'claro',
    movimiento: 'quieto',
    cualidades: ['horizontal', 'abierto', 'natural', 'quebrado'],
  },
  {
    id: 'tejido-lana',
    categoria: 'textura',
    nombre: 'Tejido de lana',
    src: 'assets/img/targets/tejido-lana.svg',
    temp: 'calido',
    luz: 'oscuro',
    movimiento: 'quieto',
    cualidades: ['horizontal', 'cerrado', 'artificial', 'suave'],
  },
  {
    id: 'espiral',
    categoria: 'simbolo',
    nombre: 'Espiral',
    src: 'assets/img/targets/espiral.svg',
    temp: 'frio',
    luz: 'claro',
    movimiento: 'movimiento',
    cualidades: ['vertical', 'abierto', 'abstracto', 'envolvente'],
  },
  {
    id: 'circulo',
    categoria: 'simbolo',
    nombre: 'Círculo',
    src: 'assets/img/targets/circulo.svg',
    temp: 'calido',
    luz: 'claro',
    movimiento: 'quieto',
    cualidades: ['centrado', 'abierto', 'abstracto', 'completo'],
  },
  {
    id: 'flecha-arriba',
    categoria: 'simbolo',
    nombre: 'Flecha hacia arriba',
    src: 'assets/img/targets/flecha-arriba.svg',
    temp: 'frio',
    luz: 'claro',
    movimiento: 'movimiento',
    cualidades: ['vertical', 'abierto', 'abstracto', 'ascendente'],
  },
  {
    id: 'cruce-caminos',
    categoria: 'simbolo',
    nombre: 'Cruce de caminos',
    src: 'assets/img/targets/cruce-caminos.svg',
    temp: 'frio',
    luz: 'claro',
    movimiento: 'quieto',
    cualidades: ['horizontal', 'abierto', 'abstracto', 'decisivo'],
  },
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TARGETS;
}
