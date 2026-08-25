/* ============================================================
   BACK2PRIME · onb.js — la puerta de entrada
   Alta local (tu nombre, tu idioma) → cuestionario → REVEAL (el
   plan enseña sus decisiones) → tour por la app. Sin cuentas y
   sin red: el «usuario» vive en localStorage como todo lo demás.
   ============================================================ */
(function () {
  'use strict';
  const U = window.UI, el = U.el, tpl = U.tpl;
  const D = window.B2P, TX = U.TX;
  const menosMovimiento = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- ALTA ---------------- */
  function renderAlta(root) {
    const S = U.S, A = TX.alta;
    const caja = el('div', { class: 'alta' });
    // los cuatro discos: la identidad de la casa como primer saludo
    caja.append(el('div', { class: 'alta-discos' },
      [1, 2, 3, 4].map(i => el('span', { class: 'disco d' + i }, ['10', '15', '20', '25'][i - 1]))));
    caja.append(el('div', { class: 'alta-marca', 'aria-hidden': 'true' }, 'BACK', el('span', { class: 'b2' }, '2'), 'PRIME'));
    caja.append(el('p', { class: 'alta-sub' }, A.sub));

    const inp = el('input', { type: 'text', id: 'alta-nombre', autocomplete: 'given-name',
      maxlength: '24', enterkeyhint: 'go', placeholder: A.ph });
    const crea = () => {
      const n = (inp.value || '').trim();
      if (n.length < 2) { U.toast(A.valNombre); inp.focus(); return; }
      S.usuario = { nombre: n, creado: U.hoyISO() };
      U.save();
      location.hash = '#/quiz';                    // el router hace el resto
    };
    inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') crea(); });
    caja.append(el('div', { class: 'field' }, el('label', { for: 'alta-nombre' }, A.nombreL), inp));
    caja.append(el('button', { class: 'btn-b2p', style: 'width:100%', type: 'button', onclick: crea }, A.cta));
    caja.append(el('p', { class: 'mini', style: 'text-align:center' }, A.local));

    // idioma: la única decisión que se toma ANTES de escribir nada
    const fila = el('div', { class: 'alta-langs', role: 'group', 'aria-label': A.idioma });
    (U.IDIOMAS || []).forEach(par => {
      const code = par[0], flag = par[1], nombre = par[2];
      fila.append(el('button', { class: 'lpill plano' + ((S.config.lang || 'es') === code ? ' on' : ''),
        type: 'button', 'aria-label': nombre, 'aria-pressed': (S.config.lang || 'es') === code ? 'true' : 'false',
        onclick: async () => {
          if ((S.config.lang || 'es') === code) return;
          // mismo trato que en Ajustes: el idioma se trae AHORA, con red, para
          // que el service worker lo guarde antes de recargar
          if (code !== 'es') {
            let ok = false;
            try { ok = (await fetch('./assets/data.' + code + '.js')).ok; } catch (e) { ok = false; }
            if (!ok) { U.toast(TX.ajIdiomaSinRed); return; }
          }
          S.config.lang = code; U.save(); location.reload();
        } }, flag));
    });
    caja.append(fila);
    root.append(caja);
    if (!menosMovimiento()) caja.animate(
      [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }],
      { duration: 260, easing: 'cubic-bezier(.23,1,.32,1)' });
  }

  /* ---------------- REVEAL: el plan enseña sus decisiones ----------------
     El único momento en que un motor determinista puede parecer magia. Cada
     fila sale de D.__decisiones (gen.js): solo hechos que el plan cumple. */
  function renderReveal(root) {
    const S = U.S, R = TX.rev, C = TX.cuest;
    if (!D.__gen || !R) {                          // sin plan generado no hay nada que presentar
      delete S.ui.reveal; U.save(); location.hash = '#/hoy';
      return;
    }
    const dec = D.__decisiones || [];
    const fmtF = s => { const d = U.fromISO(s); return d.getDate() + ' ' + TX.meses[d.getMonth()]; };
    const fmtN = n => n.toLocaleString(TX.lang || 'es');
    const lesionTxt = { rodilla: C.lesRodilla, hombro: C.lesHombro, lumbar: C.lesLumbar };

    const caja = el('div', { class: 'rev' });
    caja.append(el('div', { class: 'rev-disco' }, el('span', { class: 'disco d1' }, '10')));
    caja.append(el('h2', { class: 'rev-t' }, S.usuario && S.usuario.nombre ? tpl(R.t, { n: S.usuario.nombre }) : R.tAnon));
    caja.append(el('p', { class: 'rev-sub' }, R.sub));

    const lista = el('div', { class: 'card rev-lista' });
    const fila = (icono, t, sub) => lista.append(el('div', { class: 'rev-row' },
      el('span', { class: 'rev-ico', 'aria-hidden': 'true' }, icono),
      el('div', { class: 'rev-txt' }, el('div', { class: 'rev-rt' }, t), sub ? el('div', { class: 'mini' }, sub) : null)));
    dec.forEach(x => {
      if (x.k === 'split') fila('🏋️', tpl(R.splitT, { d: x.d }), x.tipo === 'fb' ? R.splitFb : x.tipo === 'tp' ? R.splitTp : R.splitPpl);
      else if (x.k === 'kcal') fila('🔥', tpl(R.kcalT, { k: fmtN(x.v) }),
        x.delta < -100 ? tpl(R.kDef, { v: fmtN(Math.round(-x.delta / 10) * 10) })
          : x.delta > 100 ? tpl(R.kSup, { v: fmtN(Math.round(x.delta / 10) * 10) }) : R.kMan);
      else if (x.k === 'prot') fila('💪', tpl(R.protT, { p: x.v }), tpl(R.protSub, { v: String(x.kg).replace('.', ',') }));
      else if (x.k === 'dur') fila('📅', tpl(R.durT, { s: x.s }), tpl(R.durSub, { a: fmtF(x.a), b: fmtF(x.b) }));
      else if (x.k === 'subs') fila('🔁', tpl(R.subsT, { n: x.n }), R.subsSub);
      else if (x.k === 'cuida') fila('🛡️', tpl(R.cuidaT, { a: x.zonas.map(z => lesionTxt[z] || z).join(' · ') }), R.cuidaSub);
      else if (x.k === 'menu') fila('🍽️', R.menuT, x.avisos > 0 ? tpl(R.menuAv, { n: x.avisos }) : R.menuSub);
      else if (x.k === 'gustos') fila('👍', tpl(R.gustosT, { a: x.likes, b: x.nos }), R.gustosSub);
    });
    caja.append(lista);
    caja.append(el('button', { class: 'btn-b2p', style: 'width:100%', type: 'button', onclick: () => {
      delete S.ui.reveal; U.save(); location.hash = '#/hoy';
    } }, R.cta));
    caja.append(el('p', { class: 'mini', style: 'text-align:center' }, R.micro));
    root.append(caja);

    // entrada escalonada dentro del presupuesto: cada pieza <300 ms, sin viaje largo
    if (!menosMovimiento()) {
      const disco = caja.querySelector('.rev-disco .disco');
      if (disco) disco.animate(
        [{ transform: 'scale(.55)', opacity: 0 }, { transform: 'scale(1.08)', opacity: 1, offset: .7 }, { transform: 'scale(1)', opacity: 1 }],
        { duration: 380, easing: 'cubic-bezier(.2,1.4,.4,1)', fill: 'backwards' });
      Array.from(lista.children).forEach((row, i) => row.animate(
        [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }],
        { duration: 240, delay: 120 + i * 55, easing: 'cubic-bezier(.23,1,.32,1)', fill: 'backwards' }));
    }
  }

  /* ---------------- PAUSA MÉDICA (gate) ---------------- */
  function renderGate(root) {
    const S = U.S, C = TX.cuest;
    root.append(el('div', { class: 'alta', style: 'min-height:60vh' },
      el('div', { style: 'font-size:44px;text-align:center', 'aria-hidden': 'true' }, '🩺'),
      el('h2', { style: 'text-align:center' }, C.gateHoyT),
      el('p', { class: 'mut', style: 'text-align:center' }, C.gateHoyTxt),
      el('button', { class: 'btn-b2p', style: 'width:100%', type: 'button', onclick: () => {
        delete S.ui.gate; U.save(); location.hash = '#/quiz';
      } }, C.gateVolver)));
  }

  /* ---------------- TOUR: el paseo de bienvenida ----------------
     Foco recortado (spotlight) + burbuja. Cinco paradas, siempre saltable,
     y solo la primera vez: S.ui.tour se borra al terminar o al saltar. */
  let tourVivo = false;
  function tick(r) {
    const S = U.S;
    if (r !== 'hoy' || tourVivo || !S.ui.tour || !S.perfil || S.ui.reveal || S.ui.gate) return;
    tourVivo = true;
    setTimeout(() => tour(() => { tourVivo = false; delete U.S.ui.tour; U.save(); }), 500);
  }

  function tour(fin) {
    const T = TX.tour;
    if (!T || document.querySelector('.tour')) { fin(); return; }
    const targets = () => [
      document.querySelector('#view .card') || document.querySelector('#view'),
      document.querySelector('.tabbar'),
      document.querySelector('.tab[data-r="plan"]'),
      document.querySelector('.tab[data-r="nutricion"]'),
      document.querySelector('.tab[data-r="progreso"]')
    ];
    const capa = el('div', { class: 'tour' });
    const spot = el('div', { class: 'tour-spot' });
    const bub = el('div', { class: 'card tour-bub', role: 'dialog', 'aria-modal': 'true', tabindex: '-1' });
    capa.append(spot, bub);
    document.body.append(capa);
    let i = 0;
    const esc = ev => { if (ev.key === 'Escape') cierra(); };
    addEventListener('keydown', esc);
    function cierra() { removeEventListener('keydown', esc); capa.remove(); fin(); }
    function pinta() {
      const t = targets()[i], p = T.pasos[i];
      if (!t || !p) { cierra(); return; }
      const r = t.getBoundingClientRect(), m = 6;
      // el tamaño cambia al instante; solo viaja el transform (nada de animar layout)
      spot.style.width = (r.width + m * 2) + 'px';
      spot.style.height = (r.height + m * 2) + 'px';
      spot.style.transform = 'translate(' + (r.left - m) + 'px,' + (r.top - m) + 'px)';
      bub.innerHTML = '';
      bub.append(el('div', { class: 'mini tour-n' }, (i + 1) + '/' + T.pasos.length),
        el('h3', null, p[0]),
        el('p', { style: 'margin:6px 0 0' }, p[1]),
        el('div', { class: 'tour-pie' },
          el('button', { class: 'plano qaux', type: 'button', onclick: cierra }, T.salta),
          el('button', { class: 'btn-b2p', type: 'button', onclick: () => { i++; if (i >= T.pasos.length) cierra(); else pinta(); } },
            i === T.pasos.length - 1 ? T.listo : T.sigue)));
      // burbuja al lado libre del objetivo
      bub.style.top = ''; bub.style.bottom = '';
      if (r.top > innerHeight * .55) bub.style.bottom = (innerHeight - r.top + 16) + 'px';
      else bub.style.top = (r.bottom + 16) + 'px';
      bub.focus({ preventScroll: true });
    }
    pinta();
    if (!menosMovimiento()) capa.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'linear' });
  }

  window.B2P_REG('alta', renderAlta);
  window.B2P_REG('reveal', renderReveal);
  window.B2P_REG('gate', renderGate);
  window.B2P_ONB = { tick };
})();
