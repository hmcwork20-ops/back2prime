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

    const NB = window.B2P_NUBE;
    if (NB && NB.activo) {
      const NU = TX.nube || {};
      /* llego por el enlace de recuperar contrasena: un solo campo */
      if (NB.enRecuperacion && NB.enRecuperacion()) {
        const nc = el('input', { type: 'password', autocomplete: 'new-password', minlength: '8', placeholder: '········' });
        const guarda = async ev => {
          if ((nc.value || '').length < 8) { U.toast(NU.errClaveCorta); nc.focus(); return; }
          ev.target.disabled = true;
          const r = await NB.nuevaClave(nc.value);
          ev.target.disabled = false;
          if (r.err) { U.toast(NU[r.err] || NU.errRed); return; }
          U.toast(NU.cambiada); location.reload();
        };
        const ojoN = el('button', { class: 'ojo plano', type: 'button',
          'aria-label': NU.verClave, 'aria-pressed': 'false',
          onclick: () => {
            const visible = nc.type === 'text';
            nc.type = visible ? 'password' : 'text';
            ojoN.setAttribute('aria-pressed', visible ? 'false' : 'true');
            ojoN.setAttribute('aria-label', visible ? NU.verClave : NU.ocultarClave);
            ojoN.replaceChildren(U.icono(visible ? 'ojo' : 'ojoNo', 19));
            nc.focus();
          } }, U.icono('ojo', 19));
        caja.append(el('div', { class: 'field' }, el('label', null, NU.nuevaClaveT),
          el('div', { class: 'con-ojo' }, nc, ojoN)));
        caja.append(el('button', { class: 'btn-b2p', style: 'width:100%', type: 'button', onclick: guarda }, NU.guardarClave));
        root.append(caja);
        return;
      }

      /* Campo de contrasena con ojo: escribir a ciegas en un movil es la
         primera causa de «no me deja entrar». El boton alterna el tipo del
         input y su propio icono, y se anuncia con aria-pressed. */
      const campoClave = (inp, etiqueta) => {
        const ojo = el('button', { class: 'ojo plano', type: 'button', tabindex: '0',
          'aria-label': NU.verClave, 'aria-pressed': 'false',
          onclick: () => {
            const visible = inp.type === 'text';
            inp.type = visible ? 'password' : 'text';
            ojo.setAttribute('aria-pressed', visible ? 'false' : 'true');
            ojo.setAttribute('aria-label', visible ? NU.verClave : NU.ocultarClave);
            ojo.replaceChildren(U.icono(visible ? 'ojo' : 'ojoNo', 19));
            inp.focus();
          } }, U.icono('ojo', 19));
        return el('div', { class: 'field' }, el('label', null, etiqueta),
          el('div', { class: 'con-ojo' }, inp, ojo));
      };

      let modo = 'entrar';                          // quien vuelve es mas frecuente que quien llega
      const nom = el('input', { type: 'text', autocomplete: 'name', maxlength: '24', placeholder: A.ph });
      const cor = el('input', { type: 'email', autocomplete: 'email', inputmode: 'email', placeholder: 'correo@ejemplo.com' });
      const cla = el('input', { type: 'password', autocomplete: 'current-password', minlength: '8', placeholder: '········' });
      const fNom = el('div', { class: 'field' }, el('label', null, A.nombreL), nom);
      const bPrin = el('button', { class: 'btn-b2p', style: 'width:100%', type: 'button' });
      const bCambia = el('button', { class: 'plano qaux', style: 'width:100%;margin-top:8px', type: 'button' });
      const bOlvide = el('button', { class: 'plano qaux', style: 'width:100%;margin-top:2px', type: 'button' }, NU.olvide);

      const entraApp = () => {
        const ses = NB.sesion();
        const meta = (ses && ses.user && ses.user.user_metadata) || {};
        const n = U.saneaNombre(nom.value || meta.nombre || (ses && ses.user.email || '').split('@')[0]);
        /* Un plan guardado en este dispositivo ANTES de que hubiera cuentas
           no tiene dueno conocido. Adoptarlo sin preguntar hacia dos cosas
           malas: a ti te saltaba el cuestionario, y a quien creara una
           cuenta en un movil ajeno le entregaba el plan, el peso y los
           registros del anterior. Se aparta, la cuenta nueva empieza
           limpia, y desde Mi perfil se puede traer si de verdad es tuyo. */
        if (S.perfil && !(S.config && S.config.uid)) {
          try { localStorage.setItem('b2p_previo', JSON.stringify(S)); } catch (e) {}
          const lang = S.config && S.config.lang;
          delete S.perfil;
          S.usuario = null; S.dias = {}; S.logros = {}; S.prs = {}; S.prCount = 0;
          S.flags = {}; S.shop = {}; S.prep = {}; S.ui = {};
          S.config = { cinturaBase: null, creado: U.hoyISO(), onboarded: false, lang };
        }
        if (!S.usuario || !S.usuario.nombre) S.usuario = { nombre: n || 'B2P', creado: U.hoyISO() };
        S.config.uid = ses && ses.user.id;          // marca de dueno de la copia local
        U.save();
        location.reload();                          // arranca() compara relojes y decide la copia
      };
      const acciona = async () => {
        const correo = (cor.value || '').trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)) { U.toast(NU.errCorreo); cor.focus(); return; }
        if ((cla.value || '').length < 8) { U.toast(NU.errClaveCorta); cla.focus(); return; }
        if (modo === 'crear' && U.saneaNombre(nom.value).length < 2) { U.toast(A.valNombre); nom.focus(); return; }
        bPrin.disabled = true;
        const r = modo === 'crear' ? await NB.registra(correo, cla.value, U.saneaNombre(nom.value)) : await NB.entra(correo, cla.value);
        bPrin.disabled = false;
        if (r.err) { U.toast(NU[r.err] || NU.errRed); return; }
        if (r.confirma) { U.toast(NU.confirmaCorreo); modo = 'entrar'; pinta(); return; }
        entraApp();
      };
      const pinta = () => {
        fNom.style.display = modo === 'crear' ? '' : 'none';
        cla.autocomplete = modo === 'crear' ? 'new-password' : 'current-password';
        bPrin.textContent = modo === 'crear' ? NU.crear : NU.entrar;
        bCambia.textContent = modo === 'crear' ? NU.aEntrar : NU.aCrear;
        bOlvide.style.display = modo === 'crear' ? 'none' : '';
      };
      bPrin.addEventListener('click', acciona);
      cla.addEventListener('keydown', ev => { if (ev.key === 'Enter') acciona(); });
      bCambia.addEventListener('click', () => { modo = modo === 'crear' ? 'entrar' : 'crear'; pinta(); });
      bOlvide.addEventListener('click', async () => {
        const correo = (cor.value || '').trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)) { U.toast(NU.errCorreo); cor.focus(); return; }
        const r = await NB.olvide(correo);
        U.toast(r.err ? (NU[r.err] || NU.errRed) : NU.enviadoReset);
      });

      caja.append(fNom,
        el('div', { class: 'field' }, el('label', null, NU.correoL), cor),
        campoClave(cla, NU.claveL),
        bPrin, bCambia, bOlvide,
        el('p', { class: 'mini', style: 'text-align:center' }, NU.local),
        /* la politica, antes de crear la cuenta: aqui es donde se consiente */
        el('p', { class: 'mini', style: 'text-align:center;margin-top:6px' },
          el('a', { href: 'privacidad.html', class: 'priv-a' }, TX.pPrivacidad)));
      pinta();

      // idioma tambien en la puerta con cuenta
      const filaN = el('div', { class: 'alta-langs', role: 'group', 'aria-label': A.idioma });
      (U.IDIOMAS || []).forEach(par => {
        const code = par[0], flag = par[1], nombre = par[2];
        filaN.append(el('button', { class: 'lpill plano' + ((S.config.lang || 'es') === code ? ' on' : ''),
          type: 'button', 'aria-label': nombre, onclick: async () => {
            if ((S.config.lang || 'es') === code) return;
            if (code !== 'es') {
              let ok = false;
              try { ok = (await fetch('./assets/data.' + code + '.js')).ok; } catch (e) { ok = false; }
              if (!ok) { U.toast(TX.ajIdiomaSinRed); return; }
            }
            S.config.lang = code; U.save(); location.reload();
          } }, flag));
      });
      caja.append(filaN);
      root.append(caja);
      if (!menosMovimiento()) caja.animate(
        [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }],
        { duration: 260, easing: 'cubic-bezier(.23,1,.32,1)' });
      return;
    }

    const inp = el('input', { type: 'text', id: 'alta-nombre', autocomplete: 'given-name',
      maxlength: '24', enterkeyhint: 'go', placeholder: A.ph });
    const crea = () => {
      const n = U.saneaNombre(inp.value);
      if (n.length < 2) { U.toast(A.valNombre); inp.focus(); return; }
      S.usuario = { nombre: n, creado: U.hoyISO() };
      U.save();
      // si el dispositivo ya tiene un plan (cerraste sesión), se vuelve a él
      location.hash = S.perfil ? '#/hoy' : '#/quiz';
    };
    inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') crea(); });
    caja.append(el('div', { class: 'field' }, el('label', { for: 'alta-nombre' }, A.nombreL), inp));
    caja.append(el('button', { class: 'btn-b2p', style: 'width:100%', type: 'button', onclick: crea }, A.cta));
    caja.append(el('p', { class: 'mini', style: 'text-align:center' }, A.local),
      el('p', { class: 'mini', style: 'text-align:center;margin-top:6px' },
          el('a', { href: 'privacidad.html', class: 'priv-a' }, TX.pPrivacidad)));

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
      if (x.k === 'split') fila(U.icono('mancuerna', 20), tpl(R.splitT, { d: x.d }), x.tipo === 'fb' ? R.splitFb : x.tipo === 'tp' ? R.splitTp : R.splitPpl);
      else if (x.k === 'kcal') fila(U.icono('flame', 20), tpl(R.kcalT, { k: fmtN(x.v) }),
        // redondeo a 25: «superávit de 260» era ruido de redondeos encadenados
        x.delta < -100 ? tpl(R.kDef, { v: fmtN(Math.round(-x.delta / 25) * 25) })
          : x.delta > 100 ? tpl(R.kSup, { v: fmtN(Math.round(x.delta / 25) * 25) }) : R.kMan);
      else if (x.k === 'prot') fila(U.icono('rayo', 20), tpl(R.protT, { p: x.v }), tpl(R.protSub, { v: String(x.kg).replace('.', ',') }));
      else if (x.k === 'dur') fila(U.icono('calendario', 20), tpl(R.durT, { s: x.s }),
        x.abierto && R.durOpen ? tpl(R.durOpen, { s: x.s }) : tpl(R.durSub, { a: fmtF(x.a), b: fmtF(x.b) }));
      else if (x.k === 'min' && R.minT) fila(U.icono('reloj', 20), tpl(R.minT, { v: x.v }), R.minSub);
      else if (x.k === 'evento' && R.evT) {
        const evTxt = { boda: C.evBoda, oposicion: C.evOpo, verano: C.evVerano }[x.v] || x.v;
        // con fecha, el plan termina antes y se dice; sin fecha, no se promete
        const sub = x.manda && x.f ? tpl(R.evFecha, { b: fmtF(x.f) }) : (R.evSinFecha || R.evSub);
        fila(U.icono('diana', 20), tpl(R.evT, { e: evTxt }), sub);
      }
      else if (x.k === 'subs') fila(U.icono('repetir', 20), tpl(R.subsT, { n: x.n }), R.subsSub);
      else if (x.k === 'cuida') fila(U.icono('escudo', 20), tpl(R.cuidaT, { a: x.zonas.map(z => lesionTxt[z] || z).join(' · ') }), R.cuidaSub);
      else if (x.k === 'menu') fila(U.icono('cubiertos', 20), R.menuT, x.avisos > 0 ? tpl(R.menuAv, { n: x.avisos }) : R.menuSub);
      else if (x.k === 'gustos') fila(U.icono('pulgar', 20), tpl(R.gustosT, { a: x.likes, b: x.nos }), R.gustosSub);
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
      el('div', { style: 'text-align:center', 'aria-hidden': 'true' }, U.icono('corazon', 42)),
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
      bub.innerHTML = '';
      bub.append(el('div', { class: 'mini tour-n' }, (i + 1) + '/' + T.pasos.length),
        el('h3', null, p[0]),
        el('p', { style: 'margin:6px 0 0' }, p[1]),
        el('div', { class: 'tour-pie' },
          el('button', { class: 'plano qaux', type: 'button', onclick: cierra }, T.salta),
          el('button', { class: 'btn-b2p', type: 'button', onclick: () => { i++; if (i >= T.pasos.length) cierra(); else pinta(); } },
            i === T.pasos.length - 1 ? T.listo : T.sigue)));
      /* La burbuja va al lado del objetivo con hueco REAL y se clampa al
         viewport SIEMPRE: en móviles bajos, «debajo de la tarjeta» podía caer
         fuera de pantalla y el tour parecía colgado (spotlight sin botones).
         Se recoloca además cuando cargan las fuentes web: el reflow movía el
         objetivo después de habernos medido. */
      const coloca = () => {
        if (!bub.isConnected) return;
        const rt = t.getBoundingClientRect(), m = 6;
        spot.style.width = (rt.width + m * 2) + 'px';
        spot.style.height = (rt.height + m * 2) + 'px';
        spot.style.transform = 'translate(' + (rt.left - m) + 'px,' + (rt.top - m) + 'px)';
        const bh = bub.offsetHeight || 180;
        const huecoAbajo = innerHeight - rt.bottom - 16;
        const huecoArriba = rt.top - 16;
        let top;
        if (huecoAbajo >= bh) top = rt.bottom + 16;
        else if (huecoArriba >= bh) top = rt.top - 16 - bh;
        else top = innerHeight - bh - 12;          // no cabe a ningún lado: pegada abajo, encima del recorte
        top = Math.max(8, Math.min(top, innerHeight - bh - 8));
        bub.style.bottom = '';
        bub.style.top = top + 'px';
      };
      coloca();
      requestAnimationFrame(coloca);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => setTimeout(coloca, 60));
      addEventListener('resize', coloca, { once: true });
      bub.focus({ preventScroll: true });
    }
    pinta();
    if (!menosMovimiento()) capa.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'linear' });
  }

  /* ---------------- visor del plan compartido ----------------
     Publico y de solo lectura: pinta el resumen que el dueno decidio
     compartir. Sin cuenta, sin registros, sin datos de nadie mas. */
  function renderComp(root) {
    const NB = window.B2P_NUBE, CO = TX.comp || {};
    const caja = el('div', { class: 'alta' });
    caja.append(el('div', { class: 'alta-marca', 'aria-hidden': 'true' }, 'BACK', el('span', { class: 'b2' }, '2'), 'PRIME'));
    root.append(caja);
    const token = (location.hash.split('?')[1] || '').trim();
    if (!NB || !NB.activo || !token) { caja.append(el('p', { class: 'alta-sub' }, CO.noExiste || '')); return; }
    caja.append(el('p', { class: 'alta-sub', id: 'comp-esp' }, '…'));
    NB.planCompartido(token).then(r => {
      const esp = caja.querySelector('#comp-esp'); if (esp) esp.remove();
      if (r.err || !r.plan) { caja.append(el('p', { class: 'alta-sub' }, CO.noExiste)); return; }
      const pl = r.plan;
      caja.append(el('h2', { class: 'rev-t' }, U.tpl(CO.vT, { n: U.saneaNombre(pl.n) || 'B2P' })));
      caja.append(el('p', { class: 'mini', style: 'text-align:center' }, CO.vSub));
      const filas = [
        [U.tpl(CO.sem, { s: parseInt(pl.sem) || 0 }), U.tpl(CO.dias, { d: parseInt(pl.dias) || 0 })],
        [String(pl.split || ''), (parseInt(pl.kcal) || 0) + ' kcal · P ' + (parseInt(pl.prot) || 0) + ' g']
      ];
      const tabla = el('div', { class: 'card', style: 'margin-top:14px;text-align:center' });
      filas.forEach(f => tabla.append(el('div', { style: 'padding:6px 0' },
        el('b', null, f[0]), el('div', { class: 'mini' }, f[1]))));
      if (Array.isArray(pl.fases)) tabla.append(el('div', { class: 'mini', style: 'padding:6px 0' },
        pl.fases.slice(0, 6).map(x => String(x)).join(' · ')));
      caja.append(tabla);
      caja.append(el('a', { class: 'btn-b2p', style: 'display:block;text-align:center;margin-top:16px;text-decoration:none',
        href: location.origin + location.pathname }, CO.vCta));
    });
  }

  window.B2P_REG('alta', renderAlta);
  window.B2P_REG('comp', renderComp);
  window.B2P_REG('reveal', renderReveal);
  window.B2P_REG('gate', renderGate);
  window.B2P_ONB = { tick };
})();
