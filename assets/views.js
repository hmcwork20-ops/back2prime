/* ============================================================
   BACK2PRIME · views.js — vistas PLAN · COMIDA · PROGRESO · LOGROS
   Gráficas SVG a mano (sin librerías), mono-serie por gráfica.
   Nota dataviz: la paleta de fases es identidad física (discos
   olímpicos 10/15/20/25). Nunca comparten plot; cada gráfica usa
   UNA serie + banda neutra, con etiqueta directa, tooltip y vista
   tabla (codificación secundaria). Contraste vs superficie: PASS.
   ============================================================ */
(function () {
  'use strict';
  const D = window.B2P, U = window.UI;
  const el = U.el;
  const SVGNS = 'http://www.w3.org/2000/svg';
  const COL = { peso: '#C8F24E', cintura: '#66A0E8', banca: '#E5B63E', sent: '#E5685A', rdl: '#4CC07E', pasos: '#66A0E8' };

  function sv(tag, attrs) {
    const n = document.createElementNS(SVGNS, tag);
    if (attrs) for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }
  const diaIdx = f => Math.floor((U.fromISO(f) - U.fromISO(D.META.inicioISO)) / 864e5);

  /* ---- chips-ancla con scroll-spy (secciones largas) ----
     Misma pantalla: el chip desliza hasta el bloque y, al scrollear, se
     ilumina solo el del bloque que tienes delante. */
  let spyLock = 0;
  function chipNav(defs) {
    const nav = el('div', { class: 'chipnav' });
    const off = () => ((parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hdr-h')) || 59) + nav.offsetHeight + 16);
    const setOn = btn => {
      nav.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === btn));
      nav.scrollTo({ left: btn.offsetLeft - nav.clientWidth / 2 + btn.offsetWidth / 2, behavior: 'smooth' });
    };
    defs.forEach(([id, label], i) => nav.append(el('button', { class: i === 0 ? 'on' : '', onclick: ev => {
      const t = document.getElementById(id); if (!t) return;
      spyLock = Date.now() + 750;
      setOn(ev.currentTarget);
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - off() - 2, behavior: 'smooth' });
    } }, label)));
    window.__b2pSpy = () => {
      if (!document.contains(nav)) { window.__b2pSpy = null; return; }
      if (Date.now() < spyLock) return;
      let best = 0;
      defs.forEach(([id], i) => { const t = document.getElementById(id); if (t && t.getBoundingClientRect().top <= off() + 42) best = i; });
      const btn = nav.children[best];
      if (btn && !btn.classList.contains('on')) setOn(btn);
    };
    return nav;
  }
  addEventListener('scroll', () => { if (window.__b2pSpy) window.__b2pSpy(); }, { passive: true });

  /* ==================== PLAN (4 sub-secciones) ==================== */
  function renderPlan(root) {
    const hoy = U.hoyISO(), w = U.semanaDe(hoy);
    const faseAct = (w >= 1 && w <= 12) ? D.FASES[D.CAL[w - 1].fase - 1] : null;
    const fold = (titulo, abierto, ...kids) => el('details', { class: 'fold', ...(abierto ? { open: '' } : {}) }, el('summary', null, titulo), el('div', { class: 'fold-in' }, ...kids));

    // Segmentado: cada sub-sección carga sola → nada de scroll kilométrico
    const SECS = [['fases', 'Fases'], ['reglas', 'Reglas'], ['ejercicios', 'Ejercicios'], ['ciencia', 'Ciencia']];
    let sec = (U.S.ui && U.S.ui.plansec) || 'fases';
    if (!SECS.some(s => s[0] === sec)) sec = 'fases';
    const seg = el('div', { class: 'seg seg-plan', role: 'tablist' });
    const cont = el('div');
    SECS.forEach(([id, n]) => seg.append(el('button', { class: id === sec ? 'on' : '', role: 'tab', onclick: ev => {
      sec = id; U.S.ui.plansec = id; U.save();
      seg.querySelectorAll('button').forEach(b => b.classList.remove('on'));
      ev.currentTarget.classList.add('on');
      cont.innerHTML = ''; BUILD[id](cont); scrollTo(0, 0);
    } }, n)));
    root.append(seg, cont);
    const BUILD = { fases: secFases, reglas: secReglas, ejercicios: secEjercicios, ciencia: secCiencia };
    BUILD[sec](cont);

    /* ---- REGLAS: sección propia, primera pantalla sin scroll ---- */
    function secReglas(root) {
      root.append(el('div', { class: 'sec-h' }, el('h2', null, 'Las 8 reglas'), el('span', { class: 'mini' }, 'si dudas, gana la regla')));
      root.append(el('div', { class: 'regla-g' }, D.REGLAS.map(r => el('div', { class: 'regla' }, el('b', null, r.n + ' · ' + r.t), r.d))));
      root.append(el('div', { class: 'banner hot', style: 'margin-top:16px' }, el('div', null, el('b', null, 'Señales de parar'), el('div', null, D.SENALES))));
      root.append(el('div', { class: 'banner ok' }, el('div', null, el('b', null, 'El objetivo real'), el('div', null, D.CIERRE))));
    }

    /* ---- FASES: fase actual + calendario + las 4 fases ---- */
    function secFases(root) {
    // cabecera de fase actual
    if (faseAct) {
      root.append(el('div', { class: 'card fase-card p' + faseAct.id },
        el('div', { class: 'card-title' },
          el('span', { class: 'disco d' + faseAct.id }, String(faseAct.disco)),
          el('div', null, el('h2', null, 'Fase ' + faseAct.id + ' · ' + faseAct.nombre),
            el('div', { class: 'sub' }, faseAct.fechas + ' · ' + faseAct.sub + ' · RPE ' + faseAct.rpe))),
        el('p', { style: 'font-size:13.5px;margin:4px 0 2px' }, faseAct.objetivo)));
    } else if (w === 0) {
      root.append(el('div', { class: 'banner' }, el('div', null, el('b', null, 'El plan empieza el lunes 17 de agosto'), el('div', null, 'Fase 1 · Reactivación en casa. Aquí tienes todo para llegar con los deberes hechos.'))));
    }

    root.append(el('div', { class: 'sec-h' }, el('h2', null, 'Calendario')));
    const tcal = el('div', { class: 'tw' }, el('table', null,
      el('tr', null, el('th'), el('th', null, 'Fase'), el('th', null, 'Sem'), el('th', null, 'Fechas'), el('th', null, 'RPE')),
      D.FASES.map(f => el('tr', faseAct && f.id === faseAct.id ? { class: 'now' } : null,
        el('td', null, el('span', { class: 'disco d' + f.id }, String(f.disco))),
        el('td', null, el('b', null, f.nombre), el('div', { class: 'mini' }, f.sub)),
        el('td', { class: 'sr' }, f.semanas[0] + '–' + f.semanas[f.semanas.length - 1]),
        el('td', null, f.fechas),
        el('td', { class: 'sr' }, f.rpe)))));
    root.append(tcal);

    // 12 semanas con estado
    const tsem = el('table', null, el('tr', null, el('th', null, 'Sem'), el('th', null, 'Fechas'), el('th', null, 'Especial'), el('th', null, 'Fuerza')));
    for (let i = 1; i <= 12; i++) {
      const fs = U.fechasSemana(i), ses = U.sesionesFuerzaSemana(i), done = ses.filter(s => s.hecho).length;
      const hito = D.HITOS_SEMANA[i];
      tsem.append(el('tr', i === w ? { class: 'now' } : null,
        el('td', { class: 'sr' }, 'S' + i),
        el('td', null, U.fmtCorta(fs.ini) + ' – ' + U.fmtCorta(fs.fin)),
        el('td', { class: 'mini' }, hito ? hito.t : '—'),
        el('td', { class: 'sr' }, fs.ini <= hoy ? done + '/' + ses.length : '·')));
    }
    root.append(el('div', { class: 'tw' }, tsem));

    // Fases en detalle
    root.append(el('div', { class: 'sec-h' }, el('h2', null, 'Las 4 fases, al detalle')));
    const DIAS_C = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    D.FASES.forEach(f => {
      const kids = [];
      kids.push(el('p', { style: 'margin-top:2px' }, f.objetivo));
      // semana tipo
      const cal = D.CAL[f.semanas[0] - 1];
      const st = el('table', null, el('tr', null, DIAS_C.map(d => el('th', null, d))),
        el('tr', null, cal.dias.map(s => {
          const opt = typeof s === 'object'; const id = opt ? s.s : s; const ses = D.SESIONES[id];
          return el('td', { style: 'font-size:11.5px' }, (ses.tipo === 'fuerza' ? el('b', null, ses.nombre) : ses.nombre + (opt ? ' (opc)' : '')));
        })));
      kids.push(el('div', { class: 'tw compact' }, st));
      // hitos de la fase
      f.semanas.forEach(wn => { if (D.HITOS_SEMANA[wn]) kids.push(el('div', { class: 'banner' + (wn === 9 ? ' warn' : wn === 10 ? ' hot' : ''), style: 'margin:8px 0' }, el('div', null, el('b', null, 'S' + wn + ' · ' + D.HITOS_SEMANA[wn].t), el('div', null, D.HITOS_SEMANA[wn].d)))); });
      // sesiones de fuerza de la fase
      const vistos = new Set();
      D.CAL.filter(c => c.fase === f.id).forEach(c => c.dias.forEach(s => {
        const id = typeof s === 'object' ? s.s : s;
        const ses = D.SESIONES[id];
        if (!ses || ses.tipo !== 'fuerza' || vistos.has(id)) return;
        vistos.add(id);
        const t = el('table', null, el('tr', null, el('th', null, ses.nombre), el('th', null, 'Series'), el('th', null, 'Desc.')));
        ses.bloques.forEach(b => {
          const e = D.EJERCICIOS[b.e];
          if (!e) { console.warn('B2P: falta ficha de', b.e); return; }
          const reps = b.rW ? Object.values(b.rW).join(' → ') : b.r;
          t.append(el('tr', null,
            el('td', { style: 'cursor:pointer', onclick: () => U.fichaEjercicio(b.e, {}) }, el('b', null, e.nombre), b.n ? el('div', { class: 'mini' }, b.n) : null),
            el('td', { class: 'sr' }, b.s + '×' + reps),
            el('td', { class: 'sr' }, b.d >= 60 ? (b.d / 60).toLocaleString('es-ES') + '′' : b.d + '″')));
        });
        kids.push(el('div', { class: 'tw' }, t));
      }));
      // cardio de la fase
      const cardio = new Set();
      D.CAL.filter(c => c.fase === f.id).forEach(c => c.dias.forEach(s => {
        const id = typeof s === 'object' ? s.s : s; const ses = D.SESIONES[id];
        if (ses && ses.tipo === 'cardio') cardio.add(id);
      }));
      if (cardio.size) kids.push(el('div', { class: 'regla' }, el('b', null, 'Cardio de la fase'),
        Array.from(cardio).map(id => el('div', { style: 'margin:4px 0' }, el('b', { style: 'font-family:Inter;text-transform:none;font-size:13px;display:inline' }, D.SESIONES[id].nombre + ': '), D.SESIONES[id].detalle))));
      if (f.id === 1) kids.push(el('div', { class: 'banner ok' }, el('div', null, el('b', null, 'Check de salida (dom 30 ago)'), el('div', null, 'Completas ambos circuitos con las reps de la semana 2 sin dolor articular → Fase 2. Si algo molesta, repites una semana: los tendones lo agradecen.'))));
      if (f.id === 2) {
        const A = D.ARRANQUE;
        const ta = el('table', null, el('tr', null, el('th', null, 'Ejercicio'), el('th', null, 'S3'), el('th', null, 'S4'), el('th', null, 'S5')));
        A.tabla.forEach(r => ta.append(el('tr', null,
          el('td', { style: 'cursor:pointer', onclick: () => U.fichaEjercicio(r.ej, {}) }, el('b', null, D.EJERCICIOS[r.ej].nombre), el('div', { class: 'mini' }, r.n)),
          el('td', { class: 'sr' }, r.s3), el('td', { class: 'sr' }, r.s4), el('td', { class: 'sr' }, r.s5))));
        kids.push(el('div', { class: 'regla', style: 'border-left:3px solid var(--volt)' }, el('b', null, '🔓 ' + A.titulo), A.derivacion));
        kids.push(el('div', { class: 'tw' }, ta));
        kids.push(el('p', { class: 'mini' }, A.resto));
        kids.push(el('div', { class: 'banner warn' }, el('div', null, el('b', null, 'Te van a parecer pesos ridículos'), el('div', null, A.aviso))));
        kids.push(el('div', { class: 'banner' }, el('div', null, el('b', null, 'Lo que dicen tus marcas'), el('div', null, A.desequilibrio))));
      }
      root.append(el('details', { class: 'fold' },
        el('summary', null, el('span', { class: 'disco d' + f.id, style: 'width:26px;height:26px;border-width:4px;font-size:10px;margin-right:2px' }, String(f.disco)), 'Fase ' + f.id + ' · ' + f.nombre),
        el('div', { class: 'fold-in' }, kids)));
    });
    }

    /* ---- EJERCICIOS: seguros del plan + biblioteca ---- */
    function secEjercicios(root) {
    root.append(el('div', { class: 'sec-h' }, el('h2', null, 'Los seguros del plan')));
    root.append(el('div', { class: 'card' },
      el('div', { class: 'card-title' }, el('div', null, el('h2', null, '🛡 ' + D.TENDON.titulo))),
      el('p', { style: 'font-size:13.5px' }, D.TENDON.intro),
      D.TENDON.bloques.map(b => el('div', { class: 'regla', style: 'margin:8px 0' }, el('b', null, b.nombre), el('div', { class: 'mini', style: 'margin-bottom:3px' }, '📍 ' + b.donde), b.detalle)),
      el('p', { class: 'mini' }, '⚠ ' + D.TENDON.nota)));
    root.append(el('div', { class: 'card' },
      el('div', { class: 'card-title' }, el('div', null, el('h2', null, '🏃 ' + D.CARRERA.titulo))),
      el('ul', { style: 'font-size:13.5px;padding-left:19px' }, D.CARRERA.reglas.map(r => el('li', null, r)))));

    // Biblioteca de ejercicios
    root.append(el('div', { class: 'sec-h' }, el('h2', null, 'Biblioteca de ejercicios'), el('span', { class: 'mini' }, 'toca cualquiera')));
    const ZONAS = [['empuje', 'Empuje'], ['tiron', 'Tirón'], ['pierna', 'Pierna y cadera'], ['core', 'Core']];
    const lib = el('div', { class: 'card exlib' });
    ZONAS.forEach(([z, zt]) => {
      lib.append(el('div', { class: 'zona-h' }, zt));
      Object.keys(D.EJERCICIOS).filter(id => D.EJERCICIOS[id].zona === z).forEach(id => {
        const e = D.EJERCICIOS[id];
        lib.append(el('div', { class: 'exrow' },
          el('div', { class: 'exmain', onclick: () => U.fichaEjercicio(id, {}) },
            el('div', { class: 'exname' }, e.nombre),
            el('div', { class: 'exmeta' }, el('span', { class: 'dose' }, e.musc[0]), el('span', { class: 'mini' }, e.equipo))),
          el('span', { class: 'mini', style: 'color:var(--ink3)' }, '›')));
      });
    });
    root.append(lib);
    }

    /* ---- CIENCIA ---- */
    function secCiencia(root) {
    root.append(el('div', { class: 'sec-h' }, el('h2', null, 'La ciencia del plan')));
    root.append(el('p', { class: 'mini', style: 'padding:0 2px' }, D.CIENCIA.intro));
    D.CIENCIA.temas.forEach(t => root.append(fold('🔬 ' + t.t, false,
      el('p', { style: 'margin-top:4px' }, t.d), el('p', { class: 'mini' }, '📚 ' + t.ref))));
    root.append(el('p', { class: 'mini', style: 'margin:16px 2px 8px' }, D.AVISO_LEGAL));
    }
  }

  /* ==================== NUTRICIÓN ==================== */
  function renderNutricion(root) {
    const w = U.semanaDe(U.hoyISO());
    const fi = w >= 10 ? 2 : (w >= 6 ? 1 : 0);
    const fn = D.NUTRI.fases[fi];

    root.append(chipNav([
      ['n-obj', 'Objetivo'], ['n-plato', 'El plato'], ['n-rec', 'Recetas'], ['n-menu', 'Menú'],
      ['n-compra', 'Compra'], ['n-prep', 'Meal prep'], ['n-supl', 'Suplementos']
    ]));

    root.append(el('div', { id: 'n-obj', class: 'card fase-card', style: 'border-left-color:var(--nutri)' },
      el('div', { class: 'card-title' }, el('div', null, el('h2', null, 'Tu objetivo ahora'), el('div', { class: 'sub' }, fn.f + (w >= 1 && w <= 12 ? ' · semana ' + w : '')))),
      el('div', { class: 'statrow', style: 'grid-template-columns:repeat(4,1fr);margin:6px 0 2px' },
        el('div', { class: 'stat' }, el('div', { class: 'sl' }, 'kcal'), el('div', { class: 'sv num' }, fn.kcal.toLocaleString('es-ES'))),
        el('div', { class: 'stat' }, el('div', { class: 'sl' }, 'Prote'), el('div', { class: 'sv num' }, fn.p + ' g')),
        el('div', { class: 'stat' }, el('div', { class: 'sl' }, 'Grasa'), el('div', { class: 'sv num' }, fn.g + ' g')),
        el('div', { class: 'stat' }, el('div', { class: 'sl' }, 'Carbos'), el('div', { class: 'sv num' }, fn.c + ' g'))),
      w === 7 ? el('div', { class: 'banner', style: 'margin:8px 0 2px' }, el('div', null, el('b', null, 'Esta semana: DIET BREAK'), el('div', null, '~2.800 kcal: +2 raciones de carbohidrato al día. Proteína igual. Entreno igual.'))) : null,
      el('p', { class: 'mini', style: 'margin-top:8px' }, D.NUTRI.tomas)));

    // números y escalado
    root.append(el('details', { class: 'fold' }, el('summary', null, 'De dónde salen los números'),
      el('div', { class: 'fold-in' },
        el('div', { class: 'tw' }, el('table', null, D.NUTRI.calorias.map(c => el('tr', null, el('td', null, c.c, el('div', { class: 'mini' }, c.n)), el('td', { class: 'sr' }, c.v))))),
        el('div', { class: 'tw' }, el('table', null,
          el('tr', null, el('th', null, 'Fase'), el('th', null, 'kcal'), el('th', null, 'P'), el('th', null, 'G'), el('th', null, 'C')),
          D.NUTRI.fases.map((f, i) => el('tr', i === fi ? { class: 'now' } : null, el('td', null, f.f), el('td', { class: 'sr' }, f.kcal.toLocaleString('es-ES')), el('td', { class: 'sr' }, f.p), el('td', { class: 'sr' }, f.g), el('td', { class: 'sr' }, f.c))))),
        el('p', { style: 'font-size:13px' }, D.NUTRI.escalado))));

    // plato
    root.append(el('div', { id: 'n-plato', class: 'sec-h' }, el('h2', null, 'Cómo montar cada comida')));
    root.append(el('div', { class: 'regla-g' }, D.NUTRI.plato.map(p => el('div', { class: 'regla' }, el('b', null, p.t), p.d))));

    // recetas
    root.append(el('div', { id: 'n-rec', class: 'sec-h' }, el('h2', null, 'Recetario'), el('span', { class: 'mini' }, 'toca para cocinar')));
    const grid = el('div', { class: 'rec-grid' });
    D.RECETAS.forEach(r => {
      grid.append(el('div', { class: 'rec-card', onclick: () => sheetReceta(r) },
        el('div', { class: 'rtipo' }, r.tipo),
        el('h3', null, r.nombre),
        el('div', { class: 'rmacros' }, el('span', { class: 'rkcal' }, r.macros.kcal), ' kcal · P', r.macros.p, ' G', r.macros.g, ' C', r.macros.c)));
    });
    root.append(grid);

    // menú semanal
    root.append(el('div', { id: 'n-menu', class: 'sec-h' }, el('h2', null, 'Menú semanal')));
    const rec = id => D.RECETAS.find(r => r.id === id);
    const tm = el('table', null, el('tr', null, el('th', null, 'Día'), el('th', null, 'Desayuno'), el('th', null, 'Comida'), el('th', null, 'Cena')));
    const celda = id => id === 'LIBRE' ? el('td', null, el('b', { style: 'color:var(--volt)' }, 'COMIDA LIBRE')) :
      el('td', { style: 'cursor:pointer', onclick: () => sheetReceta(rec(id)) }, rec(id).nombre);
    D.MENU.forEach(m => tm.append(el('tr', null, el('td', { class: 'sr' }, m.d), celda(m.de), celda(m.co), celda(m.ce))));
    root.append(el('div', { class: 'tw' }, tm));
    root.append(el('p', { class: 'mini', style: 'padding:0 2px' }, '+ cada noche: toma pre-sueño (skyr + whey). ' + D.NUTRI.comidaLibre));

    // lista de la compra
    root.append(el('div', { id: 'n-compra', class: 'sec-h' }, el('h2', null, 'La compra de la semana'),
      el('button', { class: 'tbl-toggle', onclick: () => { U.S.shop = {}; U.save(); render(); } }, 'reiniciar')));
    const shop = el('div', { class: 'card shoplist' });
    D.COMPRA.forEach((c, ci) => {
      shop.append(el('div', { class: 'shopcat' }, c.cat));
      c.items.forEach((it, ii) => {
        const k = ci + '-' + ii, on = !!U.S.shop[k];
        // toggle EN EL SITIO: re-pintar la vista hacía scroll-arriba en cada marca
        shop.append(el('div', { class: 'shopitem' + (on ? ' on' : ''), onclick: ev => { U.S.shop[k] = !U.S.shop[k]; U.save(); ev.currentTarget.classList.toggle('on', !!U.S.shop[k]); } },
          el('span', { class: 'sq' }, it.q), el('span', { class: 'si' }, it.i + (it.opc ? ' (opcional)' : '')),
          el('span', { class: 'tick', html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' })));
      });
    });
    root.append(shop);

    // meal prep
    root.append(el('div', { id: 'n-prep', class: 'sec-h' }, el('h2', null, 'Meal prep del domingo'),
      el('button', { class: 'tbl-toggle', onclick: () => { U.S.prep = {}; U.save(); render(); } }, 'reiniciar')));
    const mp = el('div', { class: 'card' });
    D.MEALPREP.forEach((p, i) => {
      const on = !!U.S.prep[i];
      mp.append(el('div', { class: 'prep-step' + (on ? ' on' : ''), onclick: ev => { U.S.prep[i] = !U.S.prep[i]; U.save(); ev.currentTarget.classList.toggle('on', !!U.S.prep[i]); } },
        el('span', { class: 'pmin' }, p.min), el('span', { class: 'pt' }, p.paso)));
    });
    mp.append(el('p', { class: 'mini', style: 'margin:10px 0 2px' }, D.MEALPREP_NOTA));
    root.append(mp);

    // suplementos + agua
    root.append(el('div', { id: 'n-supl', class: 'sec-h' }, el('h2', null, 'Suplementos')));
    root.append(el('div', { class: 'regla-g' }, D.NUTRI.suplementos.map(s => el('div', { class: 'regla' }, el('b', null, s.t), s.d))));
    root.append(el('p', { class: 'mini', style: 'margin:12px 2px' }, '💧 ' + D.NUTRI.hidratacion));
  }

  function sheetReceta(r) {
    U.openSheet(sh => {
      sh.append(el('h2', null, r.nombre),
        el('div', { class: 'stag' }, r.tipo + ' · ' + r.tiempo + ' · ' + r.cocina),
        el('div', { class: 'statrow', style: 'grid-template-columns:repeat(4,1fr)' },
          el('div', { class: 'stat' }, el('div', { class: 'sl' }, 'kcal'), el('div', { class: 'sv num' }, r.macros.kcal)),
          el('div', { class: 'stat' }, el('div', { class: 'sl' }, 'Prote'), el('div', { class: 'sv num' }, r.macros.p)),
          el('div', { class: 'stat' }, el('div', { class: 'sl' }, 'Grasa'), el('div', { class: 'sv num' }, r.macros.g)),
          el('div', { class: 'stat' }, el('div', { class: 'sl' }, 'Carbos'), el('div', { class: 'sv num' }, r.macros.c))));
      sh.append(el('h4', null, 'Ingredientes (1 ración)'));
      const t = el('table');
      r.ing.forEach(i => t.append(el('tr', null, el('td', { class: 'sr', style: 'white-space:nowrap' }, i.q), el('td', null, i.i, i.n ? el('div', { class: 'mini' }, i.n) : null))));
      sh.append(el('div', { class: 'tw' }, t));
      sh.append(el('h4', null, 'Pasos'));
      sh.append(el('ol', { style: 'padding-left:20px;font-size:13.5px' }, r.pasos.map(p => el('li', { style: 'margin:6px 0' }, p))));
      if (r.tips) sh.append(el('div', { class: 'alt', style: 'margin-top:12px' }, el('b', null, '💡 '), r.tips));
    });
  }
  U.sheetReceta = sheetReceta;   // la usa la tarjeta «La comida de hoy» (app.js)

  /* ==================== PROGRESO ==================== */
  function renderProgreso(root) {
    const S = U.S, hoy = U.hoyISO(), w = U.semanaDe(hoy);
    const ms = U.mediasSemanales();
    const pesoAhora = ms.length ? ms[ms.length - 1].m : null;
    const cint = ultimaCintura();
    const adh = adherenciaGlobal();

    root.append(chipNav([
      ['p-res', 'Resumen'], ['p-peso', 'Peso'], ['p-cint', 'Cintura'],
      ['p-carg', 'Cargas'], ['p-adh', 'Semanas'], ['p-chk', 'Checkpoints']
    ]));

    // stats
    root.append(el('div', { id: 'p-res', class: 'statrow' },
      stat('Peso', pesoAhora ? U.kg1(pesoAhora) : '—', pesoAhora ? 'media S' + ms[ms.length - 1].w : 'sin datos'),
      stat('Perdido', pesoAhora ? (D.META.perfil.pesoSalida - pesoAhora > 0.04 ? '−' + U.kg1(D.META.perfil.pesoSalida - pesoAhora) : '0,0') : '—', 'desde 95,1'),
      stat('Cintura', cint ? U.kg1(cint.v) : '—', cint ? U.fmtCorta(cint.f) + ' · meta <91' : 'lunes en ayunas'),
      stat('Adherencia', adh.tot ? Math.round(adh.ok / adh.tot * 100) + '%' : '—', adh.ok + '/' + adh.tot + ' fuerzas'),
      stat('Sesiones', String(U.totalFuerza()), 'de fuerza'),
      stat('Racha', String(U.racha(hoy)), 'días cumplidos')));

    // alertas inteligentes
    alertas().forEach(a => root.append(a));

    // ---- gráfica de peso ----
    const cardP = el('div', { id: 'p-peso', class: 'card chart-card' });
    const headP = el('div', { class: 'card-title' },
      el('div', null, el('h2', null, 'Peso'), el('div', { class: 'sub' }, 'puntos: pesajes · línea: media semanal · banda: corredor esperado')),
      el('button', { class: 'tbl-toggle', onclick: ev => { const t = cardP.querySelector('.ptable'); t.hidden = !t.hidden; ev.target.textContent = t.hidden ? 'tabla' : 'gráfica'; } }, 'tabla'));
    cardP.append(headP, chartPeso());
    const pt = el('div', { class: 'ptable', hidden: '' });
    const tbl = el('table', null, el('tr', null, el('th', null, 'Fecha'), el('th', null, 'kg')));
    Object.keys(S.dias).filter(f => S.dias[f].peso).sort().reverse().slice(0, 30).forEach(f =>
      tbl.append(el('tr', null, el('td', null, U.fmtFecha(f)), el('td', { class: 'sr' }, U.kg1(S.dias[f].peso)))));
    pt.append(el('div', { class: 'tw' }, tbl));
    cardP.append(pt);
    root.append(cardP);

    // ---- cintura ----
    root.append(el('div', { id: 'p-cint', class: 'card chart-card' },
      el('div', { class: 'card-title' }, el('div', null, el('h2', null, 'Cintura'), el('div', { class: 'sub' }, 'la métrica reina · objetivo <91 cm'))),
      chartCintura()));

    // ---- cargas ----
    const cardC = el('div', { id: 'p-carg', class: 'card chart-card' });
    cardC.append(el('div', { class: 'card-title' }, el('div', null, el('h2', null, 'Cargas'), el('div', { class: 'sub' }, 'peso del ejercicio, sesión a sesión'))));
    const LIFTS = [['press-banca', 'Banca', COL.banca], ['sentadilla-barra', 'Sentadilla', COL.sent], ['rdl-barra', 'Rumano', COL.rdl]];
    let liftSel = S.ui.lift || 'press-banca';
    const seg = el('div', { class: 'seg' });
    const chartHolder = el('div');
    LIFTS.forEach(([id, n]) => {
      seg.append(el('button', { class: id === liftSel ? 'on' : '', onclick: ev => {
        liftSel = id; S.ui.lift = id; U.save();
        seg.querySelectorAll('button').forEach(b => b.classList.remove('on'));
        ev.target.classList.add('on');
        chartHolder.innerHTML = ''; chartHolder.append(chartCargas(liftSel));
      } }, n));
    });
    chartHolder.append(chartCargas(liftSel));
    cardC.append(seg, chartHolder);
    root.append(cardC);

    // ---- adherencia semanal ----
    root.append(el('div', { id: 'p-adh', class: 'card chart-card' },
      el('div', { class: 'card-title' }, el('div', null, el('h2', null, 'Adherencia'), el('div', { class: 'sub' }, 'sesiones de fuerza completadas por semana'))),
      chartAdherencia()));

    // checkpoints
    root.append(el('div', { id: 'p-chk', class: 'sec-h' }, el('h2', null, 'Checkpoints')));
    const tc = el('table', null, el('tr', null, el('th', null, 'Fecha'), el('th', null, 'Esperado'), el('th', null, 'Real'), el('th', null, 'Si te desvías')));
    D.CHECKPOINTS.forEach(c => {
      const m = U.mediaSemana(c.sem);
      const estado = m === null ? '—' : (m <= c.rango[1] ? '✅ ' + U.kg1(m) : '⚠ ' + U.kg1(m));
      tc.append(el('tr', w === c.sem ? { class: 'now' } : null,
        el('td', null, 'S' + c.sem + ' · ' + U.fmtCorta(c.fecha)),
        el('td', { class: 'sr' }, U.kg1(c.rango[0]) + '–' + U.kg1(c.rango[1])),
        el('td', { class: 'sr' }, estado),
        el('td', { class: 'mini' }, c.si)));
    });
    root.append(el('div', { class: 'tw' }, tc));

    function stat(l, v, d) { return el('div', { class: 'stat' }, el('div', { class: 'sl' }, l), el('div', { class: 'sv num' }, v), el('div', { class: 'sd' }, d)); }
    function ultimaCintura() {
      const fs = Object.keys(S.dias).filter(f => S.dias[f].cintura).sort();
      return fs.length ? { f: fs[fs.length - 1], v: S.dias[fs[fs.length - 1]].cintura } : null;
    }
    function adherenciaGlobal() {
      let ok = 0, tot = 0;
      for (let i = 1; i <= Math.min(w || 0, 12); i++) U.sesionesFuerzaSemana(i).forEach(s => { if (s.f <= hoy) { tot++; if (s.hecho) ok++; } });
      return { ok, tot };
    }
    function alertas() {
      const out = [];
      // ritmo de pérdida (2 deltas consecutivos, ignorando semana 7)
      const deltas = [];
      for (let i = 1; i < ms.length; i++) {
        if (ms[i].w - ms[i - 1].w === 1 && ms[i].w !== 7 && ms[i].w !== 8) deltas.push(ms[i - 1].m - ms[i].m);
      }
      const d2 = deltas.slice(-2);
      if (d2.length === 2 && d2.every(x => x > 1.0)) out.push(el('div', { class: 'banner hot' }, el('div', null, el('b', null, 'Vas demasiado rápido'), el('div', null, D.AJUSTES[0].accion))));
      if (d2.length === 2 && d2.every(x => x < 0.45) && w > 3) out.push(el('div', { class: 'banner warn' }, el('div', null, el('b', null, 'Ritmo por debajo de lo esperado'), el('div', null, D.AJUSTES[1].accion))));
      // checkpoint de esta semana
      const cp = D.CHECKPOINTS.find(c => c.sem === w);
      if (cp) { const m = U.mediaSemana(w); out.push(el('div', { class: 'banner' }, el('div', null, el('b', null, 'Semana de checkpoint'), el('div', null, 'Esperado: ' + U.kg1(cp.rango[0]) + '–' + U.kg1(cp.rango[1]) + ' kg' + (m ? ' · llevas ' + U.kg1(m) : ' · aún sin pesajes esta semana'))))); }
      // ACWR del trote
      if (w >= 4 && w <= 12) {
        const carga = wk => { let m = 0; const fs = U.fechasSemana(wk); for (let i = 0; i < 7; i++) { const f = U.addDays(fs.ini, i), dd = S.dias[f], sl = U.slotDe(f); if (dd && dd.sesionOk && sl && sl.ses.tipo === 'cardio' && sl.ses.icono === 'run') m += dd.cardioMin || 28; } return m; };
        const prev = []; for (let i = Math.max(3, w - 4); i < w; i++) prev.push(carga(i));
        const media = prev.length ? prev.reduce((a, b) => a + b, 0) / prev.length : 0;
        const acwr = media > 0 ? carga(w) / media : 0;
        if (acwr > 1.3) out.push(el('div', { class: 'banner warn' }, el('div', null, el('b', null, 'Frena el trote'), el('div', null, 'Esta semana llevas ' + Math.round(acwr * 100) / 100 + '× tu media reciente de minutos corriendo. Por encima de 1,3× el riesgo de lesión se dispara: recorta o camina.'))));
      }
      return out;
    }
  }

  /* ---- motor de gráficas mono-serie ---- */
  function baseSVG(W, H) {
    const svg = sv('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img' });
    svg.style.touchAction = 'pan-y';
    return svg;
  }
  function nice(v) { return String(Math.round(v * 10) / 10).replace('.', ','); }

  function chartPeso() {
    const S = U.S, W = 640, H = 260, L = 40, R = 14, T = 16, B = 28;
    const dias = 84;
    const pesos = Object.keys(S.dias).filter(f => S.dias[f].peso).sort()
      .map(f => ({ x: diaIdx(f), y: S.dias[f].peso, f })).filter(p => p.x >= -7 && p.x <= dias);
    const ms = U.mediasSemanales().map(m => ({ x: (m.w - 1) * 7 + 3, y: m.m, w: m.w }));
    // dominio Y
    const ys = pesos.map(p => p.y).concat([86, 95.6]);
    const yMin = Math.floor(Math.min(...ys) - 1), yMax = Math.ceil(Math.max(...ys) + 0.5);
    const sx = x => L + (x + 7) / (dias + 7) * (W - L - R);
    const sy = y => T + (yMax - y) / (yMax - yMin) * (H - T - B);
    const svg = baseSVG(W, H);
    // corredor esperado (banda neutra)
    const cor = [[0, 95.6, 94.6], [27, 93.5, 92.5], [55, 91.3, 90.0], [83, 88.0, 86.0]];
    const up = cor.map(c => sx(c[0]) + ',' + sy(c[1])).join(' ');
    const lo = cor.slice().reverse().map(c => sx(c[0]) + ',' + sy(c[2])).join(' ');
    svg.append(sv('polygon', { points: up + ' ' + lo, fill: 'rgba(255,255,255,.055)' }));
    svg.append(sv('polyline', { points: up, fill: 'none', stroke: 'rgba(255,255,255,.16)', 'stroke-dasharray': '3 4', 'stroke-width': 1 }));
    svg.append(sv('polyline', { points: cor.map(c => sx(c[0]) + ',' + sy(c[2])).join(' '), fill: 'none', stroke: 'rgba(255,255,255,.16)', 'stroke-dasharray': '3 4', 'stroke-width': 1 }));
    // zona creatina (agua) sem 1-2
    svg.append(sv('rect', { x: sx(0), y: T, width: sx(14) - sx(0), height: H - T - B, fill: 'rgba(102,160,232,.05)' }));
    const zc = sv('text', { x: sx(7), y: T + 11, 'text-anchor': 'middle', 'font-size': 9.5, fill: 'rgba(167,175,185,.8)' }); zc.textContent = 'agua creatina'; svg.append(zc);
    // grid Y
    for (let y = yMin + 1; y < yMax; y += 2) {
      svg.append(sv('line', { x1: L, x2: W - R, y1: sy(y), y2: sy(y), stroke: 'rgba(255,255,255,.05)' }));
      const t = sv('text', { x: L - 6, y: sy(y) + 3.5, 'text-anchor': 'end', 'font-size': 10, fill: '#6B7480' }); t.textContent = y; svg.append(t);
    }
    // eje X: S1..S12 (cada 2)
    for (let wk = 1; wk <= 12; wk += 2) {
      const x = sx((wk - 1) * 7 + 3);
      const t = sv('text', { x, y: H - 8, 'text-anchor': 'middle', 'font-size': 10, fill: '#6B7480' }); t.textContent = 'S' + wk; svg.append(t);
    }
    // pesajes (puntos suaves)
    pesos.forEach(p => svg.append(sv('circle', { cx: sx(p.x), cy: sy(p.y), r: 3, fill: COL.peso, opacity: .38 })));
    // media semanal (línea + marcadores)
    if (ms.length) {
      svg.append(sv('polyline', { points: ms.map(p => sx(p.x) + ',' + sy(p.y)).join(' '), fill: 'none', stroke: COL.peso, 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
      ms.forEach(p => svg.append(sv('circle', { cx: sx(p.x), cy: sy(p.y), r: 4, fill: COL.peso, stroke: '#14171B', 'stroke-width': 2 })));
      const last = ms[ms.length - 1];
      const lb = sv('text', { x: Math.min(sx(last.x) + 8, W - 44), y: sy(last.y) - 8, 'font-size': 11.5, 'font-weight': 700, fill: COL.peso }); lb.textContent = nice(last.y); svg.append(lb);
    } else {
      const t = sv('text', { x: W / 2, y: H / 2, 'text-anchor': 'middle', 'font-size': 12, fill: '#6B7480' }); t.textContent = 'Los pesajes de lunes, miércoles y viernes aparecerán aquí'; svg.append(t);
    }
    return conTooltip(svg, pesos.concat(ms.map(m => ({ x: m.x, y: m.y, f: 'Media S' + m.w }))), sx, sy, p => (p.f && p.f.startsWith('Media') ? p.f : U.fmtFecha(p.f)) + ' · ' + nice(p.y) + ' kg');
  }

  function chartCintura() {
    const S = U.S, W = 640, H = 200, L = 40, R = 14, T = 14, B = 28, dias = 84;
    const pts = Object.keys(S.dias).filter(f => S.dias[f].cintura).sort().map(f => ({ x: diaIdx(f), y: S.dias[f].cintura, f }));
    if (U.S.config.cinturaBase && !pts.some(p => p.x <= 0)) pts.unshift({ x: -3, y: U.S.config.cinturaBase, f: 'línea base' });
    const ys = pts.map(p => p.y).concat([90, U.S.config.cinturaBase || 100]);
    const yMin = Math.floor(Math.min(...ys, 89) - 1), yMax = Math.ceil(Math.max(...ys) + 1);
    const sx = x => L + (x + 7) / (dias + 7) * (W - L - R);
    const sy = y => T + (yMax - y) / (yMax - yMin) * (H - T - B);
    const svg = baseSVG(W, H);
    // meta 91
    svg.append(sv('line', { x1: L, x2: W - R, y1: sy(91), y2: sy(91), stroke: 'rgba(255,255,255,.22)', 'stroke-dasharray': '5 4' }));
    const mt = sv('text', { x: W - R, y: sy(91) - 5, 'text-anchor': 'end', 'font-size': 10, fill: '#A7AFB9' }); mt.textContent = 'meta 91'; svg.append(mt);
    for (let wk = 1; wk <= 12; wk += 2) { const t = sv('text', { x: sx((wk - 1) * 7 + 3), y: H - 8, 'text-anchor': 'middle', 'font-size': 10, fill: '#6B7480' }); t.textContent = 'S' + wk; svg.append(t); }
    for (let y = yMin + 1; y < yMax; y += 2) { svg.append(sv('line', { x1: L, x2: W - R, y1: sy(y), y2: sy(y), stroke: 'rgba(255,255,255,.05)' })); const t = sv('text', { x: L - 6, y: sy(y) + 3.5, 'text-anchor': 'end', 'font-size': 10, fill: '#6B7480' }); t.textContent = y; svg.append(t); }
    if (pts.length) {
      svg.append(sv('polyline', { points: pts.map(p => sx(p.x) + ',' + sy(p.y)).join(' '), fill: 'none', stroke: COL.cintura, 'stroke-width': 2, 'stroke-linejoin': 'round' }));
      pts.forEach(p => svg.append(sv('circle', { cx: sx(p.x), cy: sy(p.y), r: 4, fill: COL.cintura, stroke: '#14171B', 'stroke-width': 2 })));
      const last = pts[pts.length - 1];
      const lb = sv('text', { x: Math.min(sx(last.x) + 8, W - 40), y: sy(last.y) - 8, 'font-size': 11.5, 'font-weight': 700, fill: COL.cintura }); lb.textContent = nice(last.y); svg.append(lb);
    } else {
      const t = sv('text', { x: W / 2, y: H / 2, 'text-anchor': 'middle', 'font-size': 12, fill: '#6B7480' }); t.textContent = 'Cada lunes en ayunas: cinta al ombligo, sin apretar'; svg.append(t);
    }
    return conTooltip(svg, pts, sx, sy, p => (p.f === 'línea base' ? 'Línea base' : U.fmtFecha(p.f)) + ' · ' + nice(p.y) + ' cm');
  }

  function chartCargas(ejId) {
    const col = ejId === 'press-banca' ? COL.banca : ejId === 'sentadilla-barra' ? COL.sent : COL.rdl;
    const hist = U.historial(ejId, 40);
    const W = 640, H = 200, L = 40, R = 16, T = 16, B = 26;
    const svg = baseSVG(W, H);
    if (!hist.length) {
      const t = sv('text', { x: W / 2, y: H / 2, 'text-anchor': 'middle', 'font-size': 12, fill: '#6B7480' }); t.textContent = 'En cuanto registres kg en este ejercicio, aquí verás la escalada'; svg.append(t);
      return svg;
    }
    const marca = D.HISTORICO[ejId];
    const pts = hist.map((h, i) => ({ x: i, y: h.kg, f: h.fecha, falta: h.falta }));
    const ys = pts.map(p => p.y);
    const yMin = Math.max(0, Math.floor(Math.min(...ys) - 5));
    const yMax = Math.ceil(Math.max(...ys, marca ? marca.kg : 0) + 5);
    const sx = x => L + (pts.length === 1 ? .5 : x / (pts.length - 1)) * (W - L - R);
    const sy = y => T + (yMax - y) / (yMax - yMin || 1) * (H - T - B);
    for (let y = Math.ceil(yMin / 10) * 10; y <= yMax; y += 10) { svg.append(sv('line', { x1: L, x2: W - R, y1: sy(y), y2: sy(y), stroke: 'rgba(255,255,255,.05)' })); const t = sv('text', { x: L - 6, y: sy(y) + 3.5, 'text-anchor': 'end', 'font-size': 10, fill: '#6B7480' }); t.textContent = y; svg.append(t); }
    // diana: la marca de su etapa anterior
    if (marca) {
      svg.append(sv('line', { x1: L, x2: W - R, y1: sy(marca.kg), y2: sy(marca.kg), stroke: 'rgba(242,244,240,.34)', 'stroke-dasharray': '6 4', 'stroke-width': 1.5 }));
      const mt = sv('text', { x: W - R, y: sy(marca.kg) - 6, 'text-anchor': 'end', 'font-size': 10, fill: '#A7AFB9' });
      mt.textContent = 'tu marca · ' + marca.kg + ' kg'; svg.append(mt);
    }
    svg.append(sv('polyline', { points: pts.map(p => sx(p.x) + ',' + sy(p.y)).join(' '), fill: 'none', stroke: col, 'stroke-width': 2, 'stroke-linejoin': 'round' }));
    const maxY = Math.max(...ys);
    pts.forEach(p => {
      svg.append(sv('circle', { cx: sx(p.x), cy: sy(p.y), r: 4, fill: p.falta ? '#14171B' : col, stroke: col, 'stroke-width': 2 }));
      if (p.y === maxY && !p.falta) { const s = sv('text', { x: sx(p.x), y: sy(p.y) - 9, 'text-anchor': 'middle', 'font-size': 12 }); s.textContent = '⭐'; svg.append(s); }
    });
    const last = pts[pts.length - 1];
    const lb = sv('text', { x: Math.min(sx(last.x) + 8, W - 40), y: sy(last.y) + 4, 'font-size': 11.5, 'font-weight': 700, fill: col }); lb.textContent = nice(last.y); svg.append(lb);
    return conTooltip(svg, pts, sx, sy, p => U.fmtFecha(p.f) + ' · ' + nice(p.y) + ' kg' + (p.falta ? ' · reps a medias' : ''));
  }

  function chartAdherencia() {
    const hoy = U.hoyISO(), wNow = U.semanaDe(hoy);
    const W = 640, H = 190, L = 34, R = 10, T = 16, B = 26;
    const svg = baseSVG(W, H);
    const wMax = wNow >= 1 && wNow <= 12 ? wNow : (wNow === 99 ? 12 : 0);
    if (!wMax) { const t = sv('text', { x: W / 2, y: H / 2, 'text-anchor': 'middle', 'font-size': 12, fill: '#6B7480' }); t.textContent = 'Semana a semana, aquí se verá tu constancia'; svg.append(t); return svg; }
    const bw = (W - L - R) / 12;
    const sy = v => T + (1 - v) * (H - T - B);
    [.5, 1].forEach(v => { svg.append(sv('line', { x1: L, x2: W - R, y1: sy(v), y2: sy(v), stroke: 'rgba(255,255,255,.05)' })); const t = sv('text', { x: L - 5, y: sy(v) + 3.5, 'text-anchor': 'end', 'font-size': 10, fill: '#6B7480' }); t.textContent = v * 100 + '%'; svg.append(t); });
    const tips = [];
    for (let i = 1; i <= 12; i++) {
      const x = L + (i - 1) * bw + 3, wdt = bw - 6;
      const t = sv('text', { x: x + wdt / 2, y: H - 8, 'text-anchor': 'middle', 'font-size': 9.5, fill: i === wNow ? '#F2F4F0' : '#6B7480' }); t.textContent = 'S' + i; svg.append(t);
      if (i > wMax) { svg.append(sv('rect', { x, y: sy(0) - 2, width: wdt, height: 2, rx: 1, fill: 'rgba(255,255,255,.07)' })); continue; }
      const ses = U.sesionesFuerzaSemana(i).filter(s => s.f <= hoy);
      const tot = U.sesionesFuerzaSemana(i).length;
      const done = ses.filter(s => s.hecho).length;
      const v = tot ? done / tot : 0;
      const hgt = Math.max(3, (H - T - B) * v);
      svg.append(sv('rect', { x, y: sy(0) - hgt, width: wdt, height: hgt, rx: 4, fill: COL.peso, opacity: i === wNow ? 1 : .78 }));
      if (v > 0) { const pt = sv('text', { x: x + wdt / 2, y: sy(0) - hgt - 5, 'text-anchor': 'middle', 'font-size': 9.5, fill: i === wNow ? '#F2F4F0' : '#6B7480' }); pt.textContent = done + '/' + tot; svg.append(pt); }
      tips.push({ x: i, y: v, cx: x + wdt / 2, cy: sy(0) - hgt, txt: 'S' + i + ' · ' + done + ' de ' + tot + ' fuerzas' });
    }
    return svg;
  }

  // tooltip táctil/ratón compartido (crosshair al punto más cercano)
  function conTooltip(svg, pts, sx, sy, fmt) {
    const wrap = el('div', { class: 'chart-wrap' });
    wrap.append(svg);
    if (!pts.length) return wrap;
    const tip = el('div', { class: 'ctip' });
    wrap.append(tip);
    const marker = sv('circle', { r: 7, fill: 'none', stroke: '#F2F4F0', 'stroke-width': 1.5, opacity: 0 });
    svg.append(marker);
    function move(ev) {
      const r = svg.getBoundingClientRect();
      const px = (ev.touches ? ev.touches[0].clientX : ev.clientX) - r.left;
      const vx = px / r.width * 640;
      let best = null, bd = 1e9;
      pts.forEach(p => { const d = Math.abs(sx(p.x) - vx); if (d < bd) { bd = d; best = p; } });
      if (!best || bd > 60) { hide(); return; }
      marker.setAttribute('cx', sx(best.x)); marker.setAttribute('cy', sy(best.y)); marker.setAttribute('opacity', .9);
      tip.style.display = 'block';
      tip.innerHTML = fmt(best);
      const tx = sx(best.x) / 640 * r.width;
      tip.style.left = Math.min(Math.max(tx - 40, 4), r.width - 130) + 'px';
      tip.style.top = Math.max(sy(best.y) / (svg.viewBox.baseVal.height) * r.height - 44, 2) + 'px';
    }
    function hide() { tip.style.display = 'none'; marker.setAttribute('opacity', 0); }
    svg.addEventListener('pointermove', move);
    svg.addEventListener('pointerdown', move);
    svg.addEventListener('pointerleave', hide);
    return wrap;
  }

  /* ==================== LOGROS ==================== */
  function renderLogros(root) {
    const S = U.S;
    root.append(el('div', { class: 'sec-h' }, el('h2', null, 'La colección de discos'), el('span', { class: 'mini' }, 'uno por fase completada')));
    const vit = el('div', { class: 'vitrina' });
    [['disco-10', '10', 'Fase 1'], ['disco-15', '15', 'Fase 2'], ['disco-20', '20', 'Fase 3'], ['disco-25', '25', 'Fase 4']].forEach(([id, kg, f]) => {
      const won = !!S.logros[id];
      const slot = el('div', { class: 'vslot' + (won ? ' won' : '') });
      const caja = el('div', { class: 'vdisc' });
      if (won) caja.append(U.discoSVG(kg, 60));
      else caja.append(el('span', { class: 'disco big locked' }, kg));
      slot.append(caja, el('div', { class: 'vn' }, f));
      vit.append(slot);
    });
    root.append(vit);

    // stats
    const mejor = mejorRacha();
    root.append(el('div', { class: 'statrow' },
      st('Fuerzas', String(U.totalFuerza())), st('PRs', String(S.prCount || 0)),
      st('Perdido', U.bajadaMax() > 0 ? '−' + U.kg1(U.bajadaMax()) : '—'),
      st('Mejor racha', String(mejor)),
      st('Logros', Object.keys(S.logros).length + '/' + D.LOGROS.length),
      st('Fotos', D.FOTOS.filter(f => S.dias[f] && S.dias[f].foto).length + '/4')));

    root.append(el('div', { class: 'sec-h' }, el('h2', null, 'Logros')));
    const grid = el('div', { class: 'badges' });
    D.LOGROS.filter(l => !l.disco).forEach(l => {
      const won = S.logros[l.id];
      grid.append(el('div', { class: 'b2-badge' + (won ? '' : ' locked') },
        el('div', { class: 'bi' }, l.icon),
        el('div', { class: 'bn' }, l.nombre),
        el('div', { class: 'bd' }, l.desc),
        won ? el('div', { class: 'bwhen' }, '✓ ' + U.fmtCorta(won)) : null));
    });
    root.append(grid);
    root.append(el('div', { class: 'banner ok', style: 'margin-top:16px' }, el('div', null, el('b', null, 'Recuerda'), el('div', null, D.CIERRE))));

    function st(l, v) { return el('div', { class: 'stat' }, el('div', { class: 'sl' }, l), el('div', { class: 'sv num' }, v)); }
    function mejorRacha() {
      let best = 0, run = 0, f = U.addDays(D.META.inicioISO, -14);
      const hoy = U.hoyISO();
      while (f <= hoy) { if (U.cumplido(f)) { run++; best = Math.max(best, run); } else run = 0; f = U.addDays(f, 1); }
      return best;
    }
  }

  /* registro de vistas */
  function render() { location.hash = location.hash; dispatchEvent(new HashChangeEvent('hashchange')); }
  window.B2P_REG('plan', renderPlan);
  window.B2P_REG('nutricion', renderNutricion);
  window.B2P_REG('progreso', renderProgreso);
  window.B2P_REG('logros', renderLogros);
})();
