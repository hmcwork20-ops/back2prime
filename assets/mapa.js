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

  /* ---------- pictogramas de patron de movimiento (siluetas) ----------
     Cada hueso es una cápsula: un trazo con puntas redondas y el grosor de su
     parte del cuerpo (torso 7,5 · muslo 6 · gemelo 4,8 · brazo 4 · antebrazo
     3,8). La cabeza va rellena. Así la figura lee como silueta, no como
     monigote. Equipamiento (barra, discos, mancuerna) y flecha en volt.
     Vista lateral, 48×48, legible a 22 px. */
  const PAT = (function () {
    const H = (x, y) => '<circle cx="' + x + '" cy="' + y + '" r="3.3" class="pt-cab"/>';
    const S = (pts, w) => '<path d="M' + pts.map(p => p.join(' ')).join(' L') + '" class="pt-c" stroke-width="' + w + '"/>';
    const Vl = (pts, w) => '<path d="M' + pts.map(p => p.join(' ')).join(' L') + '" class="pt-v" stroke-width="' + (w || 2.8) + '"/>';
    const disco = x => Vl([[x, 0], [x, 0]], 0);   // se sobreescribe abajo
    const placa = (x, y) => Vl([[x, y - 3.6], [x, y + 3.6]], 3.4);
    const mancuerna = (x, y) => '<circle cx="' + x + '" cy="' + y + '" r="2.9" class="pt-vd"/>';
    const F = (x1, y1, x2, y2) => {
      const a = Math.atan2(y2 - y1, x2 - x1), h = 4.2;
      const p1 = (x2 - h * Math.cos(a - .5)).toFixed(1) + ' ' + (y2 - h * Math.sin(a - .5)).toFixed(1);
      const p2 = (x2 - h * Math.cos(a + .5)).toFixed(1) + ' ' + (y2 - h * Math.sin(a + .5)).toFixed(1);
      return '<path d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + '" class="pt-f"/>'
        + '<path d="M' + p1 + ' L' + x2 + ' ' + y2 + ' L' + p2 + '" class="pt-f"/>';
    };
    const suelo = (x1, x2, y) => '<path d="M' + x1 + ' ' + y + ' L' + x2 + ' ' + y + '" class="pt-suelo"/>';

    return {
      /* press de banca: tumbado, banco debajo, barra arriba */
      eh: suelo(5, 41, 43) + S([[9, 33.2], [39, 33.2]], 2.2)
        + S([[14.5, 29.8], [25.5, 29.8]], 7.2) + H(10.2, 29.3)
        + S([[25.5, 29.8], [31, 35]], 5.6) + S([[31, 35], [31.5, 41]], 4.4) + S([[31.5, 41], [34.5, 41]], 2.8)
        + S([[15.5, 29], [15.5, 20.5]], 4)
        + Vl([[7.5, 18.6], [27.5, 18.6]]) + placa(10, 18.6) + placa(25, 18.6)
        + F(39.5, 27, 39.5, 16),
      /* press militar: de pie, barra sobre la cabeza */
      ev: S([[21.5, 26.5], [19, 41]], 5) + S([[21.5, 26.5], [24.5, 41]], 5)
        + S([[19, 41], [16.5, 41.6]], 2.6) + S([[24.5, 41], [27, 41.6]], 2.6)
        + S([[21.8, 15], [21.5, 26.5]], 7.4) + H(21.8, 8.9)
        + S([[21.8, 15.5], [17.8, 10.2]], 3.9) + S([[21.8, 15.5], [25.8, 10.2]], 3.9)
        + Vl([[13, 8.8], [31, 8.8]]) + placa(15.4, 8.8) + placa(28.6, 8.8)
        + F(38.5, 19, 38.5, 8.5),
      /* remo: bisagra a 45 con barra colgando */
      th: suelo(10, 40, 42.6)
        + S([[18.2, 41.6], [20.2, 33.6]], 4.8) + S([[24.8, 41.6], [22.6, 33.6]], 4.8)
        + S([[21, 33.4], [31, 21.5]], 7) + H(33.6, 18.9)
        + S([[29.3, 23], [27.6, 31.6]], 3.9)
        + Vl([[20.5, 32.8], [35.5, 32.8]]) + placa(23, 32.8) + placa(33, 32.8)
        + F(40.8, 31, 40.8, 21.5),
      /* dominada: colgado, barbilla hacia la barra */
      tv: Vl([[10, 7.6], [38, 7.6]])
        + S([[17.8, 8.4], [20.6, 15.2]], 3.9) + S([[30.2, 8.4], [27.4, 15.2]], 3.9)
        + H(24, 13.8) + S([[24, 17.8], [24, 27.6]], 7)
        + S([[24, 27.6], [21, 33.6]], 5.4) + S([[21, 33.6], [24.6, 38.4]], 4.2)
        + F(6.5, 22, 6.5, 12),
      /* sentadilla: cadera atras, barra en los hombros */
      rod: suelo(12, 40, 42.6)
        + S([[24.6, 41.6], [28.8, 41.6]], 2.8) + S([[25.4, 41], [25.2, 32.4]], 4.9)
        + S([[25.2, 32.4], [17.4, 29]], 6.2)
        + S([[17.4, 29], [20.8, 16.8]], 7.4) + H(22.5, 11.8)
        + S([[20.8, 17.6], [26.4, 16]], 3.6)
        + Vl([[13, 15.7], [31.5, 15.7]]) + placa(15.4, 15.7) + placa(29.1, 15.7)
        + F(38.5, 20.5, 38.5, 30),
      /* peso muerto rumano: piernas casi rectas, espalda recta inclinada */
      bis: suelo(12, 40, 42.6)
        + S([[20.6, 41.6], [20.2, 34.4]], 4.9) + S([[20.2, 34.4], [19.6, 28.2]], 5.4)
        + S([[19.6, 28.2], [31.2, 18.4]], 7) + H(33.8, 15.9)
        + S([[29.4, 20], [28.4, 30.4]], 3.9)
        + Vl([[21.5, 31.8], [36, 31.8]]) + placa(24, 31.8) + placa(33.6, 31.8)
        + F(8.5, 20.5, 8.5, 29.5),
      /* zancada: rodilla delantera a 90, trasera cerca del suelo */
      zan: suelo(6, 42, 42.6)
        + S([[19.8, 14.8], [19.8, 27]], 7.2) + H(19.8, 8.9)
        + S([[19.8, 27], [27.6, 30.6]], 6) + S([[27.6, 30.6], [27.6, 41]], 4.8) + S([[27.6, 41], [31.2, 41.6]], 2.8)
        + S([[19.8, 27], [14.6, 34.6]], 5.4) + S([[14.6, 34.6], [12, 40.6]], 4.2)
        + S([[19.8, 16.5], [19.2, 25.5]], 3.6)
        + F(34, 38, 42, 38),
      /* plancha: codo bajo el hombro, cuerpo en linea */
      core: suelo(6, 43, 42.6)
        + S([[9.5, 41.4], [17.5, 41.4]], 3.4) + S([[11.5, 41], [14, 33.4]], 3.9)
        + S([[14, 33.4], [27, 35.2], [38.6, 39.4]], 6.4)
        + S([[38.6, 39.4], [40.8, 41.8]], 3)
        + H(10.9, 30.2)
        + Vl([[20, 45.4], [34, 45.4]], 2),
      /* crunch: lumbar apoyada, torso curvado hacia la rodilla */
      flex: suelo(6, 42, 41.9)
        + S([[24.8, 39.4], [18.4, 32.6]], 6) + S([[18.4, 32.6], [14, 40.4]], 4.6)
        + S([[24.8, 39.4], [30, 36.4], [32.8, 32.6]], 6.6) + H(34.6, 29.9)
        + F(38, 32.5, 33.8, 25.5),
      /* curl de biceps: codo pegado, antebrazo subiendo con la mancuerna */
      curl: S([[18, 28], [15.5, 41]], 5) + S([[18, 28], [20.5, 41]], 5)
        + S([[18, 15], [18, 28]], 7.2) + H(18, 8.9)
        + S([[18, 16.2], [18.6, 23.8]], 3.9) + S([[18.6, 23.8], [26.4, 19.2]], 3.7)
        + mancuerna(28, 18.2)
        + F(32.5, 27, 29.3, 19.8),
      /* extension de triceps en polea: codo fijo, antebrazo bajando */
      ext: S([[18, 28], [15.5, 41]], 5) + S([[18, 28], [20.5, 41]], 5)
        + S([[18, 15], [18, 28]], 7.2) + H(18, 8.9)
        + S([[18, 16.2], [18.6, 23.6]], 3.9) + S([[18.6, 23.6], [26.6, 28.6]], 3.7)
        + mancuerna(28.2, 29.6)
        + F(32.5, 21.5, 32.5, 30),
      /* elevacion de talones: de puntillas, talon alto */
      gem: suelo(12, 36, 44.4)
        + S([[22.8, 26.6], [23.4, 38.2]], 5.2) + S([[23.4, 38.2], [27.4, 42.4]], 4.2)
        + S([[22.5, 14.8], [22.8, 26.6]], 7.2) + H(22.5, 8.9)
        + S([[22.5, 16.5], [21.6, 25.5]], 3.6)
        + F(33.5, 40, 33.5, 30.5),
      /* aislamiento: la mancuerna sola */
      ais: Vl([[17, 24], [31, 24]], 2.6)
        + Vl([[19.2, 19.6], [19.2, 28.4]], 4.2) + Vl([[28.8, 19.6], [28.8, 28.4]], 4.2)
        + F(24, 16, 24, 9.5)
    };
  })();

  function svgPat(key, opts) {
    opts = opts || {};
    const dib = PAT[key];
    if (!dib) return '';
    const a11y = opts.label ? ' role="img" aria-label="' + String(opts.label).replace(/"/g, '&quot;') + '"'
      : ' aria-hidden="true" focusable="false"';
    return '<svg viewBox="0 0 48 48"' + a11y + ' class="pt">' + dib + '</svg>';
  }

  return { svg, svgPat };
})();
