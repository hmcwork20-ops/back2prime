/* ============================================================
   BACK2PRIME · marca.js — el logo como código
   GENERADO por tools/marca.py: no editar a mano. Los mismos trazados
   pintan el favicon, los iconos, la cabecera y la puerta de entrada.
   Marco: altura de mayúscula 100, línea base y=100.
   ============================================================ */
window.B2P_MARCA = (function () {
  'use strict';
  const B = 'M35 100H8Q7.29 100 6.79 99.5Q6.29 99 6.29 98.29V1.71Q6.29 1 6.79 0.5Q7.29 0 8 0H31.86Q46.14 0 54.21 6.86Q62.29 13.71 62.29 27.29Q62.29 41.43 52.57 47.86Q52 48.29 52.43 48.71Q63.71 56.71 63.71 72.43Q63.71 85.71 55.71 92.86Q47.71 100 35 100ZM26.43 18V40.43Q26.43 41.14 27.14 41.14H32.29Q37.14 41.14 39.86 38.07Q42.57 35 42.57 29.43Q42.57 23.57 39.93 20.43Q37.29 17.29 32.29 17.29H27.14Q26.43 17.29 26.43 18ZM43.57 69.43Q43.57 63.14 40.86 59.43Q38.14 55.71 33.57 55.71H27.14Q26.43 55.71 26.43 56.43V81.86Q26.43 82.57 27.14 82.57H33.43Q38.14 82.57 40.86 79.14Q43.57 75.71 43.57 69.43Z';
  const P = 'M63.57 30.29Q63.57 43.57 56.43 51.57Q49.29 59.57 37.71 59.57H27Q26.29 59.57 26.29 60.29V98.29Q26.29 99 25.79 99.5Q25.29 100 24.57 100H7.86Q7.14 100 6.64 99.5Q6.14 99 6.14 98.29V1.57Q6.14 0.86 6.64 0.36Q7.14 -0.14 7.86 -0.14H36.71Q44.57 -0.14 50.71 3.71Q56.86 7.57 60.21 14.5Q63.57 21.43 63.57 30.29ZM43.43 30.71Q43.43 24.43 40.64 20.86Q37.86 17.29 33.29 17.29H27Q26.29 17.29 26.29 18V43.14Q26.29 43.86 27 43.86H33.29Q37.86 43.86 40.64 40.36Q43.43 36.86 43.43 30.71Z';
  const DOS_M = 'M20.94 31.75A14.5 14.5 0 1 1 45.38 32.82L21 61H40', PUNTA_M = 'M40 52L53 61L40 70Z';   // monograma, trazo 10
  const DOS_W = 'M20.94 31.75A14.5 14.5 0 1 1 45.38 32.82L21 61H39.2', PUNTA_W = 'M39.2 51L53.5 61L39.2 71Z';   // nombre completo, trazo 11
  const T = tx => 'translate(' + tx + ' -10) scale(1.836) translate(-14 -5)';
  const DOS_TX = 73.71, P_TX = 149.16, MONO = { w: 206.44, cx: 109.51 };
  function mono(c) {
    return '<path d="' + B + '" fill="' + c + '"/>'
      + '<g transform="' + T(DOS_TX) + '"><path d="' + DOS_M + '" fill="none" stroke="' + c + '" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="' + PUNTA_M + '" fill="' + c + '"/></g>'
      + '<path d="' + P + '" fill="' + c + '" transform="translate(' + P_TX + ' 0)"/>';
  }
  /* El anillo B2P completo, en una caja de 72. o = { size, color, fondo, rx } */
  function anillo(o) {
    o = o || {};
    const c = o.color || '#C8F24E', s = o.size || 72, e = 0.155;
    const fondo = o.fondo ? '<rect width="72" height="72" rx="' + (o.rx == null ? 16 : o.rx) + '" fill="' + o.fondo + '"/>' : '';
    return '<svg viewBox="0 0 72 72" width="' + s + '" height="' + s + '" aria-hidden="true" focusable="false">' + fondo
      + '<circle cx="36" cy="36" r="24" fill="none" stroke="' + c + '" stroke-width="6" opacity=".34"/>'
      + '<path d="M26.62 58.09A24 24 0 0 1 18.45 52.37" fill="none" stroke="' + c + '" stroke-width="6" stroke-linecap="round"/>'
      + '<g transform="translate(' + (36 - MONO.cx * e).toFixed(2) + ' ' + (36 - 50 * e).toFixed(2) + ') scale(' + e + ')">' + mono(c) + '</g></svg>';
  }
  /* El 2-flecha para ir en línea dentro del nombre: hereda el color del texto;
     el alto y la posición los fija el CSS (.b2). */
  function dosInline(cls) {
    return '<svg class="' + (cls || 'b2') + '" viewBox="-0.9 -10.9 73.4 122.1" aria-hidden="true" focusable="false"><g transform="' + T(0) + '">'
      + '<path d="' + DOS_W + '" fill="none" stroke="currentColor" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><path d="' + PUNTA_W + '" fill="currentColor"/></g></svg>';
  }
  const logotipo = () => 'BACK' + dosInline('b2') + 'PRIME';
  return { B, P, DOS_M, PUNTA_M, DOS_W, PUNTA_W, DOS_TX, P_TX, MONO, T, mono, anillo, dosInline, logotipo };
})();
