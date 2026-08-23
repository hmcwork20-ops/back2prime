/* BACK2PRIME · mapa muscular — silueta anatómica SVG dibujada por código, sin
   activos externos. Frente a la izquierda, espalda a la derecha. Cada región
   lleva una clave neutra (pecho, dorsal, cuadriceps…) que viene de
   EJERCICIOS[id].mm, idéntica en los 5 idiomas. La principal se enciende en
   volt, las secundarias a media luz, el resto queda como tejido apagado.

   Construcción: todas las formas se definen para el lado DERECHO como
   coordenadas (dx, y) relativas al eje del cuerpo y se reflejan por código, así
   la figura es simétrica por construcción. Canon de ~7,5 cabezas: la cabeza
   mide 25 en un cuerpo de 236. Se lee a 40 px en una fila de la biblioteca y
   a 250 px en la ficha. */
window.B2P_MAPA = (function () {
  const f = v => Math.round(v * 10) / 10;

  /* path cúbico: segs = [[c1x,c1y, c2x,c2y, x,y], …] con dx relativo al eje.
     s = +1 lado derecho, −1 izquierdo. */
  function cub(cx, start, segs, s) {
    let d = 'M' + f(cx + s * start[0]) + ' ' + f(start[1]);
    segs.forEach(g => { d += ' C' + f(cx + s * g[0]) + ' ' + f(g[1]) + ' ' + f(cx + s * g[2]) + ' ' + f(g[3]) + ' ' + f(cx + s * g[4]) + ' ' + f(g[5]); });
    return d;
  }
  /* contorno simétrico cerrado: baja por la derecha y vuelve por la izquierda
     recorriendo los mismos segmentos al revés y reflejados */
  function contorno(cx, start, segs) {
    let d = cub(cx, start, segs, +1);
    let pts = [start].concat(segs.map(g => [g[4], g[5]]));
    for (let i = segs.length - 1; i >= 0; i--) {
      const g = segs[i], p = pts[i];
      d += ' C' + f(cx - g[2]) + ' ' + f(g[3]) + ' ' + f(cx - g[0]) + ' ' + f(g[1]) + ' ' + f(cx - p[0]) + ' ' + f(p[1]);
    }
    return d + ' Z';
  }
  const P = (cx, start, segs) => '<path d="' + cub(cx, start, segs, 1) + ' Z"/><path d="' + cub(cx, start, segs, -1) + ' Z"/>';
  const P1 = (cx, start, segs) => '<path d="' + contorno(cx, start, segs) + '"/>';
  const ell = (cx, dx, y, rx, ry) => '<ellipse cx="' + f(cx + dx) + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '"/>' + (dx ? '<ellipse cx="' + f(cx - dx) + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '"/>' : '');
  const ln = (cx, x1, y1, x2, y2) => '<line x1="' + f(cx + x1) + '" y1="' + y1 + '" x2="' + f(cx + x2) + '" y2="' + y2 + '"/>' + '<line x1="' + f(cx - x1) + '" y1="' + y1 + '" x2="' + f(cx - x2) + '" y2="' + y2 + '"/>';

  /* ---- el cuerpo: un solo contorno desde el cuello hasta la entrepierna ---- */
  const CUERPO = [
    [6, 34, 9, 36, 20, 40],        // cuello → trapecio
    [26, 41, 30, 46, 30, 52],      // casquete del hombro
    [31, 62, 33, 74, 33, 86],      // brazo, cara externa, hasta el codo
    [34, 98, 38, 108, 39, 118],    // antebrazo → muñeca
    [40, 124, 37, 130, 34, 128],   // mano
    [32, 126, 32, 122, 33, 118],   // muñeca, cara interna
    [31, 110, 29, 98, 27, 88],     // antebrazo interno → codo
    [26, 80, 24, 66, 22, 56],      // brazo interno → axila
    [22, 66, 19, 80, 17, 92],      // costado → cintura
    [17, 100, 21, 106, 22, 114],   // cadera
    [22, 130, 18, 150, 15, 170],   // muslo externo → rodilla
    [14, 178, 16, 190, 14, 204],   // gemelo externo
    [12, 214, 11, 220, 11, 226],   // tobillo
    [12, 232, 10, 236, 4, 236],    // pie
    [3, 233, 4, 228, 5, 222],      // tobillo interno
    [6, 214, 7, 200, 7, 186],      // pierna interna
    [7, 176, 6, 168, 6, 162],      // rodilla interna
    [5, 150, 3, 138, 0, 128]       // muslo interno → entrepierna
  ];
  function silueta(cx) {
    return ell(cx, 0, 17, 10, 12.5)                         // cabeza
      + P1(cx, [6, 31], CUERPO)
      + '<g class="mm-linea">' + ell(cx, 11, 172, 3.2, 4)    // rótulas
      + ln(cx, 7, 41, 20, 42) + '</g>';                      // clavículas
  }

  /* ---- regiones: [clave, svg] — frente ---- */
  function frente(cx) {
    return [
      ['pecho', P(cx, [1, 44], [[8, 44, 16, 45, 22, 52], [22, 58, 21, 64, 16, 67], [10, 69, 4, 69, 1, 66]])],
      ['hombro', P(cx, [19, 41], [[26, 41, 30, 46, 30, 52], [29, 57, 25, 59, 22, 56], [20, 52, 19, 46, 19, 41]])],
      ['biceps', P(cx, [22, 58], [[27, 60, 29, 70, 28, 82], [27, 86, 24, 86, 23, 82], [21, 74, 21, 64, 22, 58]])],
      ['antebrazo', P(cx, [28, 88], [[33, 92, 37, 104, 37, 116], [36, 119, 33, 119, 32, 116], [30, 106, 28, 96, 28, 88]])],
      ['abdomen', '<path d="' + contorno(cx, [7, 68], [[8, 80, 8, 92, 7, 104], [4, 106, 0, 106, 0, 106]]) + '"/>'
        + P(cx, [9, 72], [[14, 76, 17, 86, 16, 100], [14, 104, 11, 104, 10, 100], [9, 90, 9, 80, 9, 72]])
        + '<g class="mm-linea">' + ln(cx, 0, 68, 0, 104) + ln(cx, -6, 78, 6, 78) + ln(cx, -6, 87, 6, 87) + ln(cx, -6, 96, 6, 96) + '</g>'],
      ['cuadriceps', P(cx, [11, 114], [[19, 114, 23, 130, 20, 150], [18, 160, 15, 168, 13, 170], [9, 172, 7, 168, 7, 160], [6, 146, 6, 128, 11, 114]])],
      ['gemelos', P(cx, [10, 180], [[13, 182, 14, 194, 13, 206], [12, 212, 9, 212, 8, 206], [7, 194, 8, 184, 10, 180]])]
    ];
  }
  /* ---- regiones — espalda ---- */
  function espalda(cx) {
    return [
      ['espalda-alta', '<path d="' + contorno(cx, [0, 36], [[8, 38, 16, 40, 22, 44], [17, 52, 10, 60, 4, 72], [2, 78, 1, 82, 0, 84]]) + '"/>'],
      ['hombro', P(cx, [19, 41], [[26, 41, 30, 46, 30, 52], [29, 57, 25, 59, 22, 56], [20, 52, 19, 46, 19, 41]])],
      ['dorsal', P(cx, [22, 56], [[23, 62, 22, 70, 18, 80], [14, 90, 8, 98, 4, 100], [3, 96, 3, 90, 4, 84], [6, 76, 10, 66, 14, 60], [16, 58, 19, 56, 22, 56]])],
      ['lumbar', '<path d="' + contorno(cx, [5, 88], [[6, 98, 6, 108, 5, 114], [3, 115, 0, 115, 0, 115]]) + '"/>'],
      ['triceps', P(cx, [22, 56], [[29, 60, 31, 72, 29, 84], [28, 88, 25, 88, 24, 84], [23, 72, 22, 64, 22, 56]])],
      ['antebrazo', P(cx, [28, 88], [[33, 92, 37, 104, 37, 116], [36, 119, 33, 119, 32, 116], [30, 106, 28, 96, 28, 88]])],
      ['gluteo', P(cx, [1, 112], [[10, 110, 19, 114, 21, 122], [22, 134, 16, 140, 8, 140], [3, 140, 1, 136, 1, 130]])],
      ['isquios', P(cx, [8, 142], [[14, 142, 19, 146, 19, 152], [18, 162, 15, 172, 13, 176], [10, 178, 7, 178, 6, 174], [5, 164, 6, 152, 8, 142]])],
      ['gemelos', P(cx, [6, 178], [[12, 178, 16, 184, 16, 192], [16, 200, 12, 208, 9, 212], [7, 212, 6, 208, 6, 204], [5, 196, 5, 186, 6, 178]])]
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
    return '<svg viewBox="0 0 220 240"' + a11y + ' class="mm' + (opts.mini ? ' mm-mini' : '') + '">'
      + '<g class="mm-base">' + silueta(55) + silueta(165) + '</g>'
      + grupo(frente(55)) + grupo(espalda(165))
      + '</svg>';
  }

  return { svg };
})();
