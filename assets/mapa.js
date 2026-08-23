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

  /* ---------- pictogramas de patron de movimiento (silueta rellena) ----------
     Cada parte del cuerpo es una forma AHUSADA: tres anchos (origen, vientre,
     destino) y puntas redondeadas, rellena de tinta. Las articulaciones llevan
     su masa como círculos (hombro, glúteo, rodilla) que funden las piezas en
     una sola silueta. El muslo es ancho arriba y estrecha a la rodilla; el
     gemelo tiene vientre; el torso, hombros anchos y cintura. Equipamiento y
     dirección en volt. 48×48, legible a 22 px. */
  const PAT = (function () {
    const r1 = v => Math.round(v * 10) / 10;
    /* forma ahusada A→B pasando por M, con anchos wA/wM/wB y puntas redondas */
    function tap(A, M, B, w) {
      const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy) || 1;
      const nx = -dy / L, ny = dx / L, ux = dx / L, uy = dy / L;
      const wA = w[0] / 2, wM = w[1] / 2, wB = w[2] / 2;
      const P1 = [A[0] + nx * wA, A[1] + ny * wA], P2 = [M[0] + nx * wM, M[1] + ny * wM], P3 = [B[0] + nx * wB, B[1] + ny * wB];
      const Q3 = [B[0] - nx * wB, B[1] - ny * wB], Q2 = [M[0] - nx * wM, M[1] - ny * wM], Q1 = [A[0] - nx * wA, A[1] - ny * wA];
      const EB = [B[0] + ux * wB * 1.15, B[1] + uy * wB * 1.15], EA = [A[0] - ux * wA * 1.15, A[1] - uy * wA * 1.15];
      const c = P => r1(P[0]) + ' ' + r1(P[1]);
      return '<path class="pt-s" d="M' + c(P1) + ' Q' + c(P2) + ' ' + c(P3) + ' Q' + c(EB) + ' ' + c(Q3)
        + ' Q' + c(Q2) + ' ' + c(Q1) + ' Q' + c(EA) + ' ' + c(P1) + ' Z"/>';
    }
    const mid = (A, B) => [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
    const T = (A, B, w) => tap(A, mid(A, B), B, w);
    const C = (x, y, r) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" class="pt-s"/>';
    const cab = (x, y) => C(x, y, 3.3);
    const Vl = (pts, w) => '<path d="M' + pts.map(p => p.join(' ')).join(' L') + '" class="pt-v" stroke-width="' + (w || 2.8) + '"/>';
    const placa = (x, y) => Vl([[x, y - 3.6], [x, y + 3.6]], 3.4);
    const bola = (x, y, r) => '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 2.8) + '" class="pt-vd"/>';
    const F = (x1, y1, x2, y2) => {
      const a = Math.atan2(y2 - y1, x2 - x1), h = 4.2;
      const p1 = r1(x2 - h * Math.cos(a - .5)) + ' ' + r1(y2 - h * Math.sin(a - .5));
      const p2 = r1(x2 - h * Math.cos(a + .5)) + ' ' + r1(y2 - h * Math.sin(a + .5));
      return '<path d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + '" class="pt-f"/>'
        + '<path d="M' + p1 + ' L' + x2 + ' ' + y2 + ' L' + p2 + '" class="pt-f"/>';
    };
    const suelo = (x1, x2, y) => '<path d="M' + x1 + ' ' + y + ' L' + x2 + ' ' + y + '" class="pt-suelo"/>';

    /* piezas compuestas reutilizables */
    function piernasDePie(hx, hy) {
      return T([hx - .2, hy], [hx - 2.2, hy + 7.2], [6.4, 5.6, 3.6]) + C(hx - 2.2, hy + 7.2, 2)
        + tap([hx - 2.2, hy + 7.2], [hx - 2.6, hy + 10.6], [hx - 2.8, hy + 14.4], [3.8, 4.6, 2.2])
        + T([hx - 2.8, hy + 14.4], [hx + .6, hy + 15.2], [2.6, 2.2, 1.6])
        + T([hx + .4, hy], [hx + 2.6, hy + 7.2], [6.2, 5.4, 3.4]) + C(hx + 2.6, hy + 7.2, 2)
        + tap([hx + 2.6, hy + 7.2], [hx + 2.9, hy + 10.6], [hx + 3, hy + 14.4], [3.6, 4.4, 2.2])
        + T([hx + 3, hy + 14.4], [hx + 6.4, hy + 15.2], [2.6, 2.2, 1.6]);
    }
    function troncoDePie(sx, sy, hx, hy) {
      return tap([sx, sy], [(sx + hx) / 2, (sy + hy) / 2], [hx, hy], [8.8, 6.6, 7.6])
        + C(sx, sy, 2.6) + C(hx, hy, 3.1)
        + T([sx, sy - 2.6], [sx, sy - 4.4], [3.2, 3, 2.8]);
    }

    return {
      /* press de banca: tumbado en el banco, barra arriba */
      eh: suelo(5, 43, 43.4) + Vl([[9, 33.4], [39, 33.4]], 2) + Vl([[12, 34], [12, 41]], 2) + Vl([[35, 34], [35, 41]], 2)
        + tap([15.2, 29.8], [20.4, 29.5], [25.8, 29.8], [7.6, 6.2, 7]) + C(15.4, 29.6, 2.5) + C(25.8, 29.9, 2.9)
        + T([13, 29.4], [11.6, 29.3], [3, 2.8, 2.8]) + cab(9.8, 29.1)
        + tap([25.8, 29.9], [28.6, 32], [30.9, 34.6], [6.2, 5.4, 4.2]) + C(30.9, 34.6, 2)
        + tap([30.9, 34.6], [31.3, 37.6], [31.4, 40.6], [4, 4.4, 2.2]) + T([31.4, 40.6], [34.6, 41.2], [2.6, 2.2, 1.6])
        + tap([15.4, 29.4], [15.4, 25], [15.4, 21], [4.2, 3.6, 2.6]) + C(15.4, 20.2, 1.7)
        + Vl([[7.4, 18.6], [27.4, 18.6]]) + placa(10, 18.6) + placa(25, 18.6)
        + F(40.5, 27, 40.5, 16),
      /* press militar: de pie, barra sobre la cabeza */
      ev: suelo(12, 34, 42.2) + piernasDePie(21.6, 26.6) + troncoDePie(21.8, 15.2, 21.6, 26.6) + cab(21.8, 8.7)
        + tap([21.8, 15.2], [19.4, 13], [17.9, 10.6], [4.2, 3.6, 2.6]) + C(17.8, 10, 1.7)
        + tap([21.8, 15.2], [24.4, 13], [25.9, 10.6], [4.2, 3.6, 2.6]) + C(26, 10, 1.7)
        + Vl([[13, 8.8], [31, 8.8]]) + placa(15.4, 8.8) + placa(28.6, 8.8)
        + F(38.8, 19, 38.8, 8.5),
      /* remo: bisagra a 45, barra colgando */
      th: suelo(10, 40, 42.2)
        + tap([21, 33.2], [19.6, 37.2], [18.6, 40.8], [5.6, 4.6, 2.4]) + T([18.6, 40.8], [22, 41.6], [2.6, 2.2, 1.6])
        + tap([21.8, 33.4], [23.2, 37.2], [24.2, 40.8], [5.4, 4.4, 2.4]) + T([24.2, 40.8], [27.6, 41.6], [2.6, 2.2, 1.6])
        + C(20.2, 32.2, 3.1)
        + tap([20.6, 32.6], [25.6, 27.2], [30.6, 22], [7.8, 6.4, 7]) + C(30.4, 22, 2.5)
        + T([31.8, 20.8], [32.8, 19.8], [3, 2.8, 2.8]) + cab(34.2, 18.4)
        + tap([30, 22.8], [28.8, 27], [27.9, 31], [4, 3.4, 2.3]) + C(27.9, 31.8, 1.6)
        + Vl([[20.5, 32.9], [35.5, 32.9]]) + placa(23, 32.9) + placa(33, 32.9)
        + F(41, 31, 41, 21.5),
      /* dominada: colgado, barbilla a la barra, piernas recogidas */
      tv: Vl([[10, 7.6], [38, 7.6]])
        + tap([17.9, 8.2], [19.4, 11.8], [20.8, 15.2], [2.7, 3.4, 4]) + C(17.9, 8.2, 1.5)
        + tap([30.1, 8.2], [28.6, 11.8], [27.2, 15.2], [2.7, 3.4, 4]) + C(30.1, 8.2, 1.5)
        + C(21, 15.4, 2.5) + C(27, 15.4, 2.5) + cab(24, 13.5)
        + tap([24, 16.6], [24, 21.8], [24, 27.4], [8.2, 6.4, 7.2]) + C(24, 27.4, 3)
        + tap([24, 27.4], [22, 30.6], [20.9, 33.4], [6.2, 5.2, 3.8]) + C(20.9, 33.4, 2)
        + tap([20.9, 33.4], [22.4, 36.2], [24.3, 38.2], [3.6, 4, 2]) + T([24.3, 38.2], [26.8, 37.4], [2.4, 2, 1.5])
        + F(6.5, 22, 6.5, 12),
      /* sentadilla: cadera atras, barra en los hombros */
      rod: suelo(12, 40, 42.2)
        + T([25.4, 41], [29.4, 41.8], [2.8, 2.4, 1.7])
        + tap([25.2, 41], [25.7, 36.6], [25.1, 32.6], [2.4, 4.8, 4.4]) + C(25.1, 32.4, 2.2)
        + tap([25.1, 32.4], [21.2, 30.2], [17.7, 29.2], [4.6, 5.8, 6.4])
        + C(17.7, 29, 3.1) + C(16.2, 30.6, 3)
        + tap([17.7, 29], [19.2, 22.8], [20.8, 17.1], [7.8, 6.8, 8.4]) + C(20.9, 17, 2.6)
        + T([21.7, 14.7], [22.3, 13.2], [3, 2.8, 2.8]) + cab(22.8, 11.5)
        + tap([21, 17.2], [24, 16.4], [26.8, 15.9], [3.8, 3, 2.1]) + C(27.3, 15.8, 1.5)
        + Vl([[13, 15.6], [31.8, 15.6]]) + placa(15.4, 15.6) + placa(29.4, 15.6)
        + F(38.8, 20.5, 38.8, 30),
      /* rumano: piernas casi rectas, espalda recta inclinada, gluteo atras */
      bis: suelo(12, 40, 42.2)
        + tap([20.5, 41], [20.2, 34.8], [19.8, 28.8], [2.4, 4.6, 5.6]) + T([20.5, 41], [23.8, 41.8], [2.6, 2.2, 1.6])
        + tap([22.4, 41], [21.8, 34.8], [21.2, 29], [2.4, 4.2, 5.2])
        + C(19.8, 28.6, 3.1) + C(18.2, 27.6, 3)
        + tap([19.8, 28.6], [25.4, 23.4], [30.9, 18.8], [7.6, 6.6, 7.2]) + C(30.7, 18.9, 2.5)
        + T([32, 17.6], [33, 16.6], [3, 2.8, 2.8]) + cab(34.3, 15.3)
        + tap([30.2, 19.6], [29.3, 25], [28.5, 30.2], [4, 3.3, 2.3]) + C(28.5, 31, 1.6)
        + Vl([[21.5, 31.9], [36.5, 31.9]]) + placa(24, 31.9) + placa(34, 31.9)
        + F(8.5, 20.5, 8.5, 29.5),
      /* zancada: rodilla delantera a 90, trasera hacia el suelo */
      zan: suelo(6, 42, 42.2)
        + tap([19.8, 27], [23.8, 29.2], [27.4, 30.6], [6.6, 5.6, 4.6]) + C(27.4, 30.6, 2.2)
        + tap([27.4, 30.6], [27.7, 35.6], [27.6, 40.6], [4.4, 3.8, 2.4]) + T([27.6, 40.6], [31.4, 41.4], [2.6, 2.2, 1.7])
        + tap([19.8, 27], [17.2, 31], [14.8, 34.6], [6.2, 5, 4]) + C(14.8, 34.6, 2)
        + tap([14.8, 34.6], [13.4, 37.8], [12.3, 40.4], [3.8, 3.2, 2.1]) + T([12.3, 40.4], [9.6, 41.2], [2.4, 2, 1.5])
        + C(19.8, 27, 3.1)
        + tap([19.8, 15.2], [19.8, 21], [19.8, 27], [8.6, 6.6, 7.4]) + C(19.8, 15.2, 2.6)
        + T([19.8, 12.6], [19.8, 11], [3.2, 3, 2.8]) + cab(19.8, 8.7)
        + tap([19.8, 15.6], [19.6, 20.6], [19.4, 25.2], [4, 3.2, 2.3]) + C(19.4, 26, 1.6) + bola(19.3, 27.8, 2.5)
        + F(34, 38, 42, 38),
      /* plancha: codo bajo el hombro, cuerpo en linea */
      core: suelo(6, 43, 42.2)
        + T([9.8, 41.3], [17, 41.3], [3.2, 2.8, 2.2]) + C(10.6, 41, 1.9)
        + tap([10.6, 41], [12.2, 37.2], [13.9, 33.6], [3.4, 3.6, 4.2]) + C(14.1, 33.4, 2.5)
        + tap([14.1, 33.4], [23.8, 34.6], [33, 36.9], [7.8, 6.2, 5])
        + tap([33, 36.9], [36, 38.2], [38.7, 39.6], [5, 4.2, 2.5]) + T([38.7, 39.6], [40.9, 41.7], [2.6, 2.2, 1.6])
        + T([12.6, 31.9], [13.5, 32.7], [2.9, 2.8, 2.8]) + cab(11, 30.1)
        + Vl([[20, 45.2], [34, 45.2]], 2),
      /* crunch: lumbar apoyada, torso curvado hacia la rodilla */
      flex: suelo(6, 42, 41.8)
        + tap([24.8, 39.2], [21.4, 35.6], [18.5, 32.7], [6.4, 5.6, 4.4]) + C(18.5, 32.7, 2.1)
        + tap([18.5, 32.7], [16.2, 36.4], [14.3, 40], [4.2, 3.4, 2.2]) + T([14.3, 40], [11.5, 41.2], [2.4, 2, 1.5])
        + C(24.8, 39.2, 3)
        + tap([24.8, 39.2], [28.6, 38.2], [30.8, 36.1], [7.4, 6.6, 5.8])
        + tap([30.8, 36.1], [32.6, 34], [33.5, 31.7], [5.8, 5, 4.2])
        + T([34.2, 30.8], [34.8, 30], [2.9, 2.8, 2.8]) + cab(35.4, 28.6)
        + F(38.5, 32.5, 34.2, 25.5),
      /* curl: codo pegado, antebrazo subiendo con la mancuerna */
      curl: suelo(10, 30, 42.2) + piernasDePie(18, 26.6) + troncoDePie(18, 15.2, 18, 26.6) + cab(18, 8.7)
        + tap([18, 15.6], [18.3, 19.8], [18.6, 23.6], [4.2, 3.6, 3]) + C(18.6, 23.6, 1.9)
        + tap([18.6, 23.6], [22.6, 21.7], [26.3, 19.5], [3, 2.7, 2.1]) + C(26.9, 19.2, 1.6)
        + bola(28.4, 18.5, 2.8)
        + F(33, 27, 29.8, 20),
      /* extension de triceps en polea: codo fijo, antebrazo bajando */
      ext: suelo(10, 30, 42.2) + piernasDePie(18, 26.6) + troncoDePie(18, 15.2, 18, 26.6) + cab(18, 8.7)
        + Vl([[29.8, 11.5], [28.3, 29]], 1.4)
        + tap([18, 15.6], [18.3, 19.6], [18.6, 23.4], [4.2, 3.6, 3]) + C(18.6, 23.4, 1.9)
        + tap([18.6, 23.4], [22.4, 26.2], [25.9, 28.7], [3, 2.6, 2.1]) + C(26.6, 29.1, 1.6)
        + bola(28.1, 29.8, 2.5)
        + F(33.5, 21.5, 33.5, 30),
      /* elevacion de talones: de puntillas, gemelo marcado */
      gem: suelo(12, 36, 43.4) + troncoDePie(22.5, 15, 22.7, 26.8) + cab(22.5, 8.7)
        + tap([22.5, 15.4], [21.9, 20.6], [21.5, 25.4], [4, 3.2, 2.3]) + C(21.5, 26.2, 1.6)
        + tap([22.7, 26.8], [22.9, 30], [23.1, 32.8], [6.6, 5.6, 4.4]) + C(23.1, 32.8, 2.1)
        + tap([23.1, 32.8], [23.5, 35.8], [23.7, 38.4], [4.2, 5, 2.6])
        + tap([23.7, 38.4], [25.5, 40.6], [27.3, 42.2], [2.9, 2.4, 1.7])
        + F(33.8, 40, 33.8, 30.5),
      /* aislamiento: la mancuerna, con sus discos */
      ais: Vl([[17, 24], [31, 24]], 2.4)
        + Vl([[19.6, 19.4], [19.6, 28.6]], 4.4) + Vl([[28.4, 19.4], [28.4, 28.6]], 4.4)
        + Vl([[22.3, 21.2], [22.3, 26.8]], 3) + Vl([[25.7, 21.2], [25.7, 26.8]], 3)
        + F(24, 15.5, 24, 9.5)
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
