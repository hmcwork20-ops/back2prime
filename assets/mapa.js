/* BACK2PRIME · mapa muscular — silueta SVG dibujada por código, sin activos
   externos. Frente a la izquierda, espalda a la derecha. Cada región lleva una
   clave neutra (pecho, dorsal, cuadriceps…) que viene de EJERCICIOS[id].mm,
   idéntica en los 5 idiomas. Las regiones principales se encienden en volt,
   las secundarias a media luz, el resto queda como tejido apagado.
   Estilizado a propósito: tiene que leerse a 40 px de alto en una fila de la
   biblioteca y a 240 px en la ficha. */
window.B2P_MAPA = (function () {
  const n = v => Math.round(v * 10) / 10;
  const rect = (x, y, w, h, r) => '<rect x="' + n(x) + '" y="' + n(y) + '" width="' + n(w) + '" height="' + n(h) + '" rx="' + r + '"/>';
  const ell = (x, y, rx, ry) => '<ellipse cx="' + n(x) + '" cy="' + n(y) + '" rx="' + rx + '" ry="' + ry + '"/>';
  const circ = (x, y, r) => '<circle cx="' + n(x) + '" cy="' + n(y) + '" r="' + r + '"/>';
  const path = d => '<path d="' + d + '"/>';

  /* silueta común a las dos vistas, centrada en cx */
  function silueta(cx) {
    return [
      circ(cx, 20, 11),
      rect(cx - 5, 30, 10, 8, 3),
      path('M' + (cx - 22) + ' 38 H' + (cx + 22) + ' Q' + (cx + 25) + ' 38 ' + (cx + 24) + ' 44 L' + (cx + 19) + ' 106 Q' + (cx + 17) + ' 114 ' + (cx + 11) + ' 116 H' + (cx - 11) + ' Q' + (cx - 17) + ' 114 ' + (cx - 19) + ' 106 L' + (cx - 24) + ' 44 Q' + (cx - 25) + ' 38 ' + (cx - 22) + ' 38 Z'),
      rect(cx - 37, 40, 12, 42, 6), rect(cx + 25, 40, 12, 42, 6),       // brazos
      rect(cx - 40, 84, 11, 36, 5), rect(cx + 29, 84, 11, 36, 5),       // antebrazos
      rect(cx - 18, 116, 17, 58, 8), rect(cx + 1, 116, 17, 58, 8),      // muslos
      rect(cx - 16, 176, 13, 52, 6), rect(cx + 3, 176, 13, 52, 6)       // piernas
    ].join('');
  }

  /* regiones: [clave, svg] — frente */
  function frente(cx) {
    return [
      ['pecho', ell(cx - 10, 52, 9, 9) + ell(cx + 10, 52, 9, 9)],
      ['hombro', circ(cx - 24, 44, 6.5) + circ(cx + 24, 44, 6.5)],
      ['biceps', rect(cx - 36, 46, 10, 28, 5) + rect(cx + 26, 46, 10, 28, 5)],
      ['antebrazo', rect(cx - 39, 86, 9, 30, 4.5) + rect(cx + 30, 86, 9, 30, 4.5)],
      ['abdomen', rect(cx - 8, 66, 16, 34, 4) + rect(cx - 16, 70, 7, 30, 3) + rect(cx + 9, 70, 7, 30, 3)],
      ['cuadriceps', rect(cx - 17, 120, 15, 48, 7) + rect(cx + 2, 120, 15, 48, 7)]
    ];
  }
  /* regiones — espalda */
  function espalda(cx) {
    return [
      ['espalda-alta', path('M' + cx + ' 38 L' + (cx - 20) + ' 44 L' + (cx - 13) + ' 72 L' + cx + ' 80 L' + (cx + 13) + ' 72 L' + (cx + 20) + ' 44 Z')],
      ['hombro', circ(cx - 24, 44, 6.5) + circ(cx + 24, 44, 6.5)],
      ['dorsal', path('M' + (cx - 19) + ' 62 L' + (cx - 2) + ' 70 L' + (cx - 2) + ' 100 L' + (cx - 13) + ' 104 Q' + (cx - 20) + ' 92 ' + (cx - 19) + ' 62 Z')
               + path('M' + (cx + 19) + ' 62 L' + (cx + 2) + ' 70 L' + (cx + 2) + ' 100 L' + (cx + 13) + ' 104 Q' + (cx + 20) + ' 92 ' + (cx + 19) + ' 62 Z')],
      ['lumbar', rect(cx - 8, 98, 16, 16, 4)],
      ['triceps', rect(cx - 36, 46, 10, 28, 5) + rect(cx + 26, 46, 10, 28, 5)],
      ['antebrazo', rect(cx - 39, 86, 9, 30, 4.5) + rect(cx + 30, 86, 9, 30, 4.5)],
      ['gluteo', ell(cx - 9, 128, 9, 10) + ell(cx + 9, 128, 9, 10)],
      ['isquios', rect(cx - 17, 140, 15, 32, 7) + rect(cx + 2, 140, 15, 32, 7)],
      ['gemelos', rect(cx - 15, 178, 12, 36, 6) + rect(cx + 3, 178, 12, 36, 6)]
    ];
  }

  /* mm = { p: [...], s: [...] } · opts = { label, mini } */
  function svg(mm, opts) {
    opts = opts || {};
    const p = new Set((mm && mm.p) || []), s = new Set((mm && mm.s) || []);
    const clase = k => p.has(k) ? 'mm-p' : s.has(k) ? 'mm-s' : 'mm-r';
    const grupo = regs => regs.map(r => '<g class="' + clase(r[0]) + '" data-m="' + r[0] + '">' + r[1] + '</g>').join('');
    const a11y = opts.mini ? ' aria-hidden="true" focusable="false"'
      : ' role="img" aria-label="' + String(opts.label || '').replace(/"/g, '&quot;') + '"';
    return '<svg viewBox="0 0 220 232"' + a11y + ' class="mm' + (opts.mini ? ' mm-mini' : '') + '">'
      + '<g class="mm-base">' + silueta(55) + silueta(165) + '</g>'
      + grupo(frente(55)) + grupo(espalda(165))
      + '</svg>';
  }

  return { svg };
})();
