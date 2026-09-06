/* ============================================================
   BACK2PRIME · figuras.js — lo que se explica mejor dibujado que escrito

   Cada figura sustituye a un párrafo que antes había que leer: dónde va la
   cinta de la cintura, cómo se reparte el plato, las cuatro tomas del día,
   qué días de la semana son de fuerza, las doce semanas de un vistazo.
   Devuelven HTML (cadenas): quien las pinta las mete con `html:` y les da
   los textos ya traducidos. Aquí no hay ni una palabra: solo forma.

   Mismo idioma que iconos.js: trazo 1.8, currentColor, sin relleno salvo
   donde el relleno ES el dato (los sectores del plato, la cinta).
   ============================================================ */
window.B2P_FIG = (function () {
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const ico = (n, s) => '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + ((window.B2P_ICO || {})[n] || '') + '</svg>';

  /* ---- la cintura: un torso y la cinta a la altura del ombligo ----
     Sustituye a «mídete a la altura del ombligo, sin apretar», que estaba
     escrito cuatro veces. */
  function cintura(size) {
    size = size || 44;
    return '<svg viewBox="0 0 48 48" width="' + size + '" height="' + size + '" class="fig fig-cintura" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
      + '<path d="M13 3c0 6-3.5 10-4.5 16-.8 5 .3 9 1.2 13 .8 4 1 8 1 13"/>'
      + '<path d="M35 3c0 6 3.5 10 4.5 16 .8 5-.3 9-1.2 13-.8 4-1 8-1 13"/>'
      + '<path d="M13 3c3 2 7 3 11 3s8-1 11-3" opacity=".55"/>'
      + '<rect x="6" y="24.5" width="36" height="4.5" rx="2.25" fill="var(--volt)" stroke="none"/>'
      + '<circle cx="24" cy="26.75" r="1.5" fill="var(--volt-ink)" stroke="none"/>'
      + '</svg>';
  }

  /* ---- el plato: media verdura, un cuarto proteína, un cuarto
     carbohidrato y una cucharada de aceite. Las referencias de mano (palma
     y media, un puño) van dibujadas al lado de su sector. ---- */
  function sector(cx, cy, r, a0, a1) {
    const p = a => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    const grande = a1 - a0 > Math.PI ? 1 : 0;
    return 'M' + cx + ' ' + cy + 'L' + x0.toFixed(1) + ' ' + y0.toFixed(1) + 'A' + r + ' ' + r + ' 0 ' + grande + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + 'Z';
  }
  const MANO = '<path d="M1 9V4a1.4 1.4 0 0 1 2.8 0v4M3.8 8V2a1.4 1.4 0 0 1 2.8 0v6M6.6 8V3a1.4 1.4 0 0 1 2.8 0v6M9.4 10V6a1.4 1.4 0 0 1 2.8 0v6.5c0 4-2.4 6.5-6 6.5S1 16 1 12.5V9"/>';
  const PUNO = '<path d="M1.5 9c0-3 2-5 5-5h4.5c2 0 3.5 1.5 3.5 3.5v3c0 3.5-2.5 6-6 6H6.5c-3 0-5-2.5-5-5.5z"/><path d="M4.5 7v3.5M7.5 6v4.5M10.5 6v4.5"/>';
  const CUCHARA = '<path d="M4 1.5c-2 0-3.5 2-3.5 4.5S2 10.5 4 10.5s3.5-2 3.5-4.5S6 1.5 4 1.5z"/><path d="M4 10.5V19"/>';
  function plato(L) {
    L = L || {};
    const cx = 78, cy = 82, r = 62, PI = Math.PI;
    const fila = (y, sw, txt, mano, manoTxt) => '<g transform="translate(160 ' + y + ')">'
      + sw
      + '<text x="22" y="4.5" class="fig-t">' + esc(txt) + '</text>'
      + (mano ? '<g transform="translate(22 12) scale(.85)" class="fig-mano">' + mano + '</g><text x="38" y="26" class="fig-m">' + esc(manoTxt) + '</text>' : '')
      + '</g>';
    return '<svg viewBox="0 0 300 168" class="fig fig-plato" role="img" aria-label="' + esc([L.v, L.p, L.c, L.g].filter(Boolean).join(' · ')) + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
      + '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r + 8) + '" opacity=".35"/>'
      + '<path d="' + sector(cx, cy, r, PI / 2, 3 * PI / 2) + '" class="fig-v"/>'
      + '<path d="' + sector(cx, cy, r, -PI / 2, 0) + '" class="fig-p"/>'
      + '<path d="' + sector(cx, cy, r, 0, PI / 2) + '" class="fig-c"/>'
      + '<text x="' + (cx - 30) + '" y="' + (cy + 6) + '" class="fig-frac">½</text>'
      + '<text x="' + (cx + 26) + '" y="' + (cy - 22) + '" class="fig-frac">¼</text>'
      + '<text x="' + (cx + 26) + '" y="' + (cy + 34) + '" class="fig-frac">¼</text>'
      + fila(22, '<rect x="0" y="-6" width="14" height="14" rx="3" class="fig-v"/>', L.v)
      + fila(56, '<rect x="0" y="-6" width="14" height="14" rx="3" class="fig-p"/>', L.p, MANO, L.mano)
      + fila(104, '<rect x="0" y="-6" width="14" height="14" rx="3" class="fig-c"/>', L.c, PUNO, L.puno)
      + fila(150, '<g transform="translate(2 -9) scale(.8)">' + CUCHARA + '</g>', L.g + (L.cuchara ? ' · ' + L.cuchara : ''))
      + '</svg>';
  }

  /* ---- las cuatro tomas de proteína, sobre una línea del día ---- */
  function tomas(lbl, q) {
    lbl = lbl || {};
    const nodos = [['taza', lbl.desayuno], ['cubiertos', lbl.comida], ['plato', lbl.cena], ['luna', lbl.presueno]];
    return '<div class="tomas" aria-hidden="true"><i class="tomas-l"></i>'
      + nodos.map(n => '<div class="toma"><span class="toma-ico">' + ico(n[0], 18) + '</span><b>' + esc(n[1]) + '</b>' + (q ? '<span>' + esc(q) + '</span>' : '') + '</div>').join('')
      + '</div>';
  }

  /* ---- la semana: siete puntos, los de fuerza encendidos ---- */
  function semana(tipos, ini) {
    ini = ini || ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    return '<div class="tira7" aria-hidden="true">'
      + tipos.map((t, i) => '<span class="d7 ' + esc(t || 'libre') + '"><i>' + esc(ini[i] || '') + '</i></span>').join('')
      + '</div>';
  }

  /* ---- las semanas del plan: color de fase, pines de hito, checkpoints ---- */
  function semanas(o) {
    const n = o.n, cel = [];
    for (let w = 1; w <= n; w++) {
      const h = (o.hitos || {})[w];
      const chk = (o.checkpoints || []).includes(w);
      const pin = h ? '<i class="pin pin-' + esc(h.tipo) + '" title="' + esc(h.t) + '">' + ico(h.tipo === 'dietbreak' ? 'cubiertos' : h.tipo === 'descarga' ? 'baja' : 'corazon', 11) + '</i>' : '';
      const marca = chk ? '<i class="chk">' + ico('hecho', 10) + '</i>' : '';
      const lbl = (w === 1 || w === n || w % 4 === 0) ? '<span class="ts-n">' + w + '</span>' : '';
      cel.push('<span class="ts f' + (o.faseDe(w) || 1) + (w === o.actual ? ' actual' : '') + '">' + pin + marca + lbl + '</span>');
    }
    return '<div class="tira-s" style="--n:' + n + '" aria-hidden="true">' + cel.join('') + '</div>';
  }

  /* ---- la leyenda de la gráfica de peso, con los trazos de verdad ---- */
  function leyendaPeso(l) {
    l = l || [];
    return '<span class="lg"><i class="lg-punto"></i>' + esc(l[0]) + '</span>'
      + '<span class="lg"><i class="lg-linea"></i>' + esc(l[1]) + '</span>'
      + '<span class="lg"><i class="lg-banda"></i>' + esc(l[2]) + '</span>';
  }

  /* ---- molestias sobre el cuerpo: tres puntos sobre el mapa muscular ----
     Coordenadas en % del viewBox 220×240 de mapa.js: rodilla y hombro sobre
     la figura de frente, lumbar sobre la de espaldas. Los botones llevan
     data-les; quien pinta engancha el toque. */
  const PUNTOS = { rodilla: [25, 71.5], hombro: [36, 19.2], lumbar: [75, 42.5] };
  function mapaLesiones(sel, lbl) {
    const M = window.B2P_MAPA;
    sel = sel || []; lbl = lbl || {};
    return '<div class="les-mapa">' + (M ? M.svg({ p: [], s: [] }, { mini: true }) : '')
      + Object.keys(PUNTOS).map(k => '<button type="button" class="les-pt' + (sel.includes(k) ? ' on' : '') + '" data-les="' + k + '" aria-pressed="' + (sel.includes(k) ? 'true' : 'false') + '" style="left:' + PUNTOS[k][0] + '%;top:' + PUNTOS[k][1] + '%"><i></i><span>' + esc(lbl[k] || k) + '</span></button>').join('')
      + '</div>';
  }

  return { cintura, plato, tomas, semana, semanas, leyendaPeso, mapaLesiones, ico };
})();
