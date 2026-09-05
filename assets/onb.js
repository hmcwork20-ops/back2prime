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
     Foco recortado (spotlight) + burbuja, trece paradas que RECORREN la app:
     el tour navega a cada seccion y senala lo que hay en ella. El anterior
     tenia cinco paradas y nunca salia de HOY: senalaba las pestanas desde
     lejos, y con Ejercicios, el calendario, el recetario por grupos, la
     compra con foto y las dos burbujas, eso ya no contaba la app que hay.

     Siempre saltable. La primera vez arranca solo (S.ui.tour se borra al
     acabar o al saltar); despues se puede repetir desde Ajustes, y esa
     repeticion no toca S.ui.tour. */
  let tourVivo = false;
  function tick(r) {
    const S = U.S;
    if (r !== 'hoy' || tourVivo || !S.ui.tour || !S.perfil || S.ui.reveal || S.ui.gate) return;
    tourVivo = true;
    setTimeout(() => tour(() => { tourVivo = false; delete U.S.ui.tour; U.save(); }), 500);
  }
  function repite() {
    if (tourVivo) return;
    tourVivo = true;
    if (location.hash !== '#/hoy') location.hash = '#/hoy';
    setTimeout(() => tour(() => { tourVivo = false; }), 450);
  }

  /* Ruta y objetivo de cada parada. `alt` es el objetivo de reserva, y
     `antes` marca la parada que cambia de texto si el plan aun no ha
     empezado (la sesion de hoy no existe todavia: existe la cuenta atras). */
  const RUTAS = ['hoy', 'plan', 'ejercicios', 'nutricion', 'progreso', 'logros'];
  const PARADAS = [
    { r: 'hoy',        sel: '#view .card.fase-card', alt: '#view .card', antes: true },
    { r: 'hoy',        sel: '#hoy-comida' },
    { r: 'hoy',        sel: '#view .habits' },
    { r: 'plan',       sel: '#view .cal-envoltura' },
    { r: 'plan',       sel: '#view .fases-leyenda' },
    { r: 'ejercicios', sel: '#view .ej-zonas' },
    { r: 'nutricion',  sel: '#n-obj' },
    { r: 'nutricion',  sel: '#n-rec + div', alt: '#n-rec' },           // los grupos, no su titular
    { r: 'nutricion',  sel: '#n-compra + details', alt: '#n-compra' },  // el primer grupo de la compra
    { r: 'progreso',   sel: '#view .bp-card', alt: '#view .card' },
    { r: 'logros',     sel: '#view .vitrina' },
    { r: 'hoy',        sel: '.fab-rep', alt: '.fab' },
    { r: 'hoy',        sel: '#btnAjustes' }
  ];

  function tour(fin) {
    const T = TX.tour;
    if (!T || !T.pasos || document.querySelector('.tour')) { fin(); return; }
    const capa = el('div', { class: 'tour' });
    const spot = el('div', { class: 'tour-spot' });
    const bub = el('div', { class: 'card tour-bub', role: 'dialog', 'aria-modal': 'true', tabindex: '-1' });
    capa.append(spot, bub);
    document.body.append(capa);
    let i = 0, vivo = true, objetivo = null;
    const esc = ev => { if (ev.key === 'Escape') cierra(); };
    addEventListener('keydown', esc);
    const recoloca = () => { if (objetivo) coloca(objetivo); };
    addEventListener('resize', recoloca);
    function cierra() {
      vivo = false;
      removeEventListener('keydown', esc);
      removeEventListener('resize', recoloca);
      capa.remove();
      // el paseo acaba donde empieza el dia
      if (location.hash !== '#/hoy') location.hash = '#/hoy';
      fin();
    }

    /* Espera a que el objetivo exista: al cambiar de ruta, render() pinta la
       vista en el siguiente tick y las fuentes pueden mover cosas despues.
       Un sondeo corto vale mas que un retardo fijo: en un movil lento el
       retardo fijo se queda corto, y en uno rapido sobra. */
    /* Un objetivo sin altura util (la tarjeta de Progreso vacia mide 12 px
       sin registros) no se ilumina: se prueba el siguiente candidato. */
    const conCuerpo = sel => sel ? [...document.querySelectorAll(sel)].find(x => x.offsetHeight >= 40) || null : null;
    function busca(sel, alt, plazo) {
      return new Promise(res => {
        const t0 = Date.now();
        (function mira() {
          if (!vivo) return res(null);
          const t = conCuerpo(sel) || conCuerpo(alt);
          if (t) return res(t);
          if (Date.now() - t0 > plazo) return res(null);
          setTimeout(mira, 60);
        })();
      });
    }

    let paradaViva = null;                 // la parada en curso, para re-resolver su objetivo
    function coloca(t) {
      if (!bub.isConnected) return;
      /* La vista puede repintarse despues de encontrar el objetivo (Progreso
         dibuja sus graficas al cargar): un elemento desconectado mide cero y
         el foco se iba a la esquina con 12 px. Se vuelve a resolver del DOM. */
      if (!t.isConnected && paradaViva) {
        const otro = conCuerpo(paradaViva.sel) || conCuerpo(paradaViva.alt);
        if (!otro) return;
        t = objetivo = otro;
      }
      const rt = t.getBoundingClientRect(), m = 6;
      const bh = bub.offsetHeight || 180;
      /* Un objetivo mas alto de lo que cabe sobre la burbuja se recorta: se
         ilumina su parte de arriba (titulo y primeras filas, que es lo que se
         ensena) y la burbuja va debajo sin tapar nada. Antes, con la compra
         de 1900 px, la burbuja acababa encima del foco. */
      let alto = rt.height;
      const cabeAbajo = innerHeight - rt.bottom - 16 >= bh;
      const cabeArriba = rt.top - 16 >= bh;
      if (!cabeAbajo && !cabeArriba && rt.top >= 0)
        alto = Math.max(120, Math.min(rt.height, innerHeight - rt.top - bh - 28));
      spot.style.width = (rt.width + m * 2) + 'px';
      spot.style.height = (alto + m * 2) + 'px';
      spot.style.transform = 'translate(' + (rt.left - m) + 'px,' + (rt.top - m) + 'px)';
      const fondo = rt.top + alto;
      let top;
      if (innerHeight - fondo - 16 >= bh) top = fondo + 16;
      else if (cabeArriba) top = rt.top - 16 - bh;
      else top = innerHeight - bh - 12;          // no cabe a ningun lado: pegada abajo, encima del recorte
      top = Math.max(8, Math.min(top, innerHeight - bh - 8));
      bub.style.top = top + 'px';
    }

    async function ve(k) {
      if (!vivo) return;
      if (k >= PARADAS.length) { cierra(); return; }
      const P = PARADAS[k];
      /* con navegacion se espera a que render() pinte la seccion (hasta 1,6 s
         en un movil lento); sin ella la vista ya esta y lo que falta no va a
         aparecer: se decide en 300 ms, que es lo que tarda en saltarse la
         parada del registro diario cuando el plan aun no ha empezado */
      const navega = location.hash !== '#/' + P.r;
      if (navega) location.hash = '#/' + P.r;
      const t = await busca(P.sel, P.alt, navega ? 1600 : 300);
      if (!vivo) return;
      if (!t) { ve(k + 1); return; }              // no existe en este estado: siguiente
      i = k; objetivo = t; paradaViva = P;
      /* El objetivo a la vista ANTES de medir: en Comida la compra esta muy
         abajo, y un foco fuera de pantalla es un tour que parece colgado.
         Solo se desplaza lo que no esta ya en pantalla: las burbujas y el
         boton de perfil son fijos, y desplazarlos descolocaba la pagina.
         Lo mas alto que media pantalla va alineado arriba, no al centro:
         centrado se cortaba por los dos lados y el titulo quedaba fuera. */
      const r0 = t.getBoundingClientRect();
      const bh0 = bub.offsetHeight || 220;
      const fijo = getComputedStyle(t).position === 'fixed' || !!t.closest('.tabbar, header');
      const fuera = r0.top < 0 || r0.bottom > innerHeight;
      const noCabe = (innerHeight - r0.bottom - 16 < bh0) && (r0.top - 16 < bh0);
      if (!fijo && (fuera || noCabe)) {
        /* Arriba, bajo la cabecera fija, cuando es alto o cuando la burbuja no
           cabe a ningun lado: asi queda hueco debajo para la burbuja y el titulo
           del objetivo no se esconde tras la cabecera. Al centro solo cuando es
           bajo y cabe. 'instant' y no 'auto': html lleva scroll-behavior:smooth,
           'auto' lo hereda, y el suave no llega a moverse en algun navegador. */
        const arriba = noCabe || r0.height > innerHeight * 0.55;
        t.scrollIntoView({ block: arriba ? 'start' : 'center', behavior: 'instant' });
        if (arriba) {
          const hdr = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hdr-h')) || 59;
          window.scrollBy({ top: -(hdr + 10), behavior: 'instant' });
        }
      }
      // texto: la primera parada cambia si el plan aun no ha empezado
      const usaAntes = P.antes && T.antes && !conCuerpo(P.sel) && conCuerpo(P.alt);
      const par = usaAntes ? T.antes : T.pasos[k];
      const ult = k === PARADAS.length - 1;
      bub.innerHTML = '';
      bub.append(
        el('div', { class: 'tour-cab' },
          el('span', { class: 'tour-sec' }, (TX.tabs || [])[RUTAS.indexOf(P.r)] || ''),
          el('span', { class: 'mini tour-n' }, (k + 1) + '/' + PARADAS.length)),
        el('h3', null, par[0]),
        el('p', { style: 'margin:6px 0 0' }, par[1]),
        el('div', { class: 'tour-pie' },
          el('button', { class: 'plano qaux', type: 'button', onclick: cierra }, T.salta),
          el('button', { class: 'btn-b2p', type: 'button', onclick: () => ve(k + 1) }, ult ? T.listo : T.sigue)));
      requestAnimationFrame(() => { coloca(t); requestAnimationFrame(() => coloca(objetivo)); });
      setTimeout(() => { if (paradaViva === P) coloca(objetivo); }, 420);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => setTimeout(() => { if (paradaViva === P) coloca(objetivo); }, 60));
      bub.focus({ preventScroll: true });
    }
    ve(0);
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
  window.B2P_ONB = { tick, repite };
})();
